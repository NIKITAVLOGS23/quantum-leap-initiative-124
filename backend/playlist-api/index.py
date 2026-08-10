import json
import os
import time
import boto3
import psycopg2
import psycopg2.extras

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def table_name() -> str:
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    return f'{schema}.playlist_videos'


def response(status: int, body: dict):
    return {
        'statusCode': status,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps(body, default=str)
    }


def handler(event: dict, context) -> dict:
    """Управляет плейлистом видео для синхронного эфира: публичная отдача плейлиста с текущей позицией показа, и админ-действия (логин, добавление, сортировка, удаление видео)"""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'playlist')

    if method == 'GET' and action == 'playlist':
        return get_playlist()

    if method == 'POST':
        try:
            body = json.loads(event.get('body') or '{}')
        except json.JSONDecodeError:
            return response(400, {'error': 'Invalid JSON'})

        action = body.get('action')

        if action == 'login':
            return handle_login(body)

        if not check_password(body):
            return response(401, {'error': 'Неверный пароль'})

        if action == 'add':
            return handle_add(body)
        if action == 'reorder':
            return handle_reorder(body)
        if action == 'delete':
            return handle_delete(body)
        if action == 'list':
            return get_playlist(include_all=True)

        return response(400, {'error': 'Unknown action'})

    return response(404, {'error': 'Not found'})


def check_password(body: dict) -> bool:
    return body.get('password') == os.environ.get('ADMIN_PANEL_PASSWORD')


def handle_login(body: dict):
    if check_password(body):
        return response(200, {'success': True})
    return response(401, {'success': False, 'error': 'Неверный пароль'})


def get_playlist(include_all: bool = False):
    conn = get_conn()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f'SELECT id, title, file_url, duration_seconds, sort_order FROM {table_name()} ORDER BY sort_order ASC, id ASC'
        )
        rows = cur.fetchall()
        cur.close()
    finally:
        conn.close()

    videos = [dict(r) for r in rows]
    for v in videos:
        v['duration_seconds'] = float(v['duration_seconds'])

    total_duration = sum(v['duration_seconds'] for v in videos)
    now = time.time()

    current_index = 0
    offset_seconds = 0.0

    if total_duration > 0 and videos:
        elapsed = now % total_duration
        cumulative = 0.0
        for i, v in enumerate(videos):
            if cumulative + v['duration_seconds'] > elapsed:
                current_index = i
                offset_seconds = elapsed - cumulative
                break
            cumulative += v['duration_seconds']

    return response(200, {
        'videos': videos,
        'current_index': current_index,
        'offset_seconds': round(offset_seconds, 2),
        'server_time': now
    })


def handle_add(body: dict):
    title = (body.get('title') or '').strip()
    file_key = body.get('file_key')
    file_url = body.get('file_url')
    duration_seconds = body.get('duration_seconds', 0)

    if not title or not file_key or not file_url:
        return response(400, {'error': 'Missing required fields'})

    conn = get_conn()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM {table_name()}')
        next_order = cur.fetchone()['next_order']
        cur.execute(
            f'''INSERT INTO {table_name()} (title, file_key, file_url, duration_seconds, sort_order)
                VALUES (%s, %s, %s, %s, %s) RETURNING id, title, file_url, duration_seconds, sort_order''',
            (title, file_key, file_url, duration_seconds, next_order)
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
    finally:
        conn.close()

    result = dict(row)
    result['duration_seconds'] = float(result['duration_seconds'])
    return response(200, {'video': result})


def handle_reorder(body: dict):
    order = body.get('order')
    if not isinstance(order, list) or not order:
        return response(400, {'error': 'Invalid order'})

    conn = get_conn()
    try:
        cur = conn.cursor()
        for idx, video_id in enumerate(order):
            cur.execute(
                f'UPDATE {table_name()} SET sort_order = %s WHERE id = %s',
                (idx, video_id)
            )
        conn.commit()
        cur.close()
    finally:
        conn.close()

    return response(200, {'success': True})


def handle_delete(body: dict):
    video_id = body.get('id')
    if not video_id:
        return response(400, {'error': 'Missing id'})

    conn = get_conn()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f'SELECT file_key FROM {table_name()} WHERE id = %s', (video_id,))
        row = cur.fetchone()
        cur.execute(f'DELETE FROM {table_name()} WHERE id = %s', (video_id,))
        conn.commit()
        cur.close()
    finally:
        conn.close()

    if row and row['file_key']:
        try:
            s3 = boto3.client(
                's3',
                endpoint_url='https://bucket.poehali.dev',
                aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
            )
            s3.delete_object(Bucket='files', Key=row['file_key'])
        except Exception:
            pass

    return response(200, {'success': True})
