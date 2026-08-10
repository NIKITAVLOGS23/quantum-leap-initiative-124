import json
import os
import time
import uuid
import boto3
from botocore.client import Config

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


def handler(event: dict, context) -> dict:
    """Выдаёт временную ссылку для прямой загрузки видеофайла в S3 из браузера (обходит лимиты на размер тела запроса cloud-функции)"""
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
    if body.get('password') != 'Vlogs@2345':
        return response(401, {'error': 'Неверный пароль'})

    file_name = body.get('file_name', 'video.mp4')
    content_type = body.get('content_type', 'video/mp4')
    ext = file_name.rsplit('.', 1)[-1] if '.' in file_name else 'mp4'
    file_key = f"playlist/{int(time.time())}-{uuid.uuid4().hex[:8]}.{ext}"

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
        config=Config(signature_version='s3v4')
    )

    upload_url = s3.generate_presigned_url(
        'put_object',
        Params={'Bucket': 'files', 'Key': file_key, 'ContentType': content_type},
        ExpiresIn=3600
    )

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"

    return response(200, {
        'upload_url': upload_url,
        'file_key': file_key,
        'file_url': cdn_url
    })