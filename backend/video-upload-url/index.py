import base64
import json
import os
import time
import uuid
import boto3
from botocore.client import Config
from concurrent.futures import ThreadPoolExecutor

MAX_WORKERS = 10

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
}


def response(status: int, body: dict):
    return {
        'statusCode': status,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps(body, default=str)
    }


def get_s3():
    return boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
        config=Config(max_pool_connections=MAX_WORKERS)
    )


def handler(event: dict, context) -> dict:
    """Загружает видеофайл в S3 через сервер частями (браузер шлёт файл небольшими кусками в base64, сервер складывает их во временные объекты, а на последнем шаге склеивает в один файл), чтобы обойти лимит размера тела запроса cloud-функции"""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    if method != 'POST':
        return response(404, {'error': 'Not found'})

    try:
        body = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return response(400, {'error': 'Invalid JSON'})

    # TODO: временно захардкожен пароль вместо секрета ADMIN_PANEL_PASSWORD — вернуть на os.environ, когда пользователь решит проблему с виджетом ввода секрета
    if body.get('password') != 'goldtv2026':
        return response(401, {'error': 'Неверный пароль'})

    action = body.get('action', 'start')

    if action == 'start':
        return handle_start(body)
    if action == 'upload_part':
        return handle_upload_part(body)
    if action == 'complete':
        return handle_complete(body)
    if action == 'abort':
        return handle_abort(body)

    return response(400, {'error': 'Unknown action'})


def handle_start(body: dict):
    file_name = body.get('file_name', 'video.mp4')
    content_type = body.get('content_type', 'video/mp4')
    ext = file_name.rsplit('.', 1)[-1] if '.' in file_name else 'mp4'
    upload_id = uuid.uuid4().hex[:16]
    file_key = f"playlist/{int(time.time())}-{uuid.uuid4().hex[:8]}.{ext}"

    return response(200, {
        'upload_id': upload_id,
        'file_key': file_key,
        'content_type': content_type
    })


def handle_upload_part(body: dict):
    upload_id = body.get('upload_id')
    part_number = body.get('part_number')
    data_b64 = body.get('data')

    if not upload_id or part_number is None or not data_b64:
        return response(400, {'error': 'Missing required fields'})

    chunk = base64.b64decode(data_b64)
    part_key = f"tmp_uploads/{upload_id}/{part_number:06d}"

    s3 = get_s3()
    s3.put_object(Bucket='files', Key=part_key, Body=chunk)

    return response(200, {'part_number': part_number})


def handle_complete(body: dict):
    upload_id = body.get('upload_id')
    file_key = body.get('file_key')
    content_type = body.get('content_type', 'video/mp4')
    total_parts = body.get('total_parts')

    if not upload_id or not file_key or not total_parts:
        return response(400, {'error': 'Missing required fields'})

    s3 = get_s3()

    def fetch_part(i):
        part_key = f"tmp_uploads/{upload_id}/{i:06d}"
        last_error = None
        for attempt in range(3):
            try:
                obj = s3.get_object(Bucket='files', Key=part_key)
                return i, obj['Body'].read()
            except Exception as e:
                last_error = e
                time.sleep(0.3)
        raise last_error

    parts_data = [None] * total_parts
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        for i, data in pool.map(fetch_part, range(total_parts)):
            parts_data[i] = data

    combined = b''.join(parts_data)
    s3.put_object(Bucket='files', Key=file_key, Body=combined, ContentType=content_type)

    def delete_part(i):
        part_key = f"tmp_uploads/{upload_id}/{i:06d}"
        try:
            s3.delete_object(Bucket='files', Key=part_key)
        except Exception:
            pass

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        list(pool.map(delete_part, range(total_parts)))

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"

    return response(200, {'file_key': file_key, 'file_url': cdn_url})


def handle_abort(body: dict):
    upload_id = body.get('upload_id')
    total_parts = body.get('total_parts', 0)

    if upload_id:
        s3 = get_s3()
        for i in range(total_parts):
            part_key = f"tmp_uploads/{upload_id}/{i:06d}"
            try:
                s3.delete_object(Bucket='files', Key=part_key)
            except Exception:
                pass

    return response(200, {'success': True})