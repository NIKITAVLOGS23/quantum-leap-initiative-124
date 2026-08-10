import base64
import urllib.request
import urllib.error

SOURCE_BASE = "http://81.177.159.27:8080/hls/"


def handler(event: dict, context) -> dict:
    """Проксирует HLS-поток (m3u8/ts) с HTTP-сервера на HTTPS, чтобы браузер мог его воспроизвести на защищённом сайте"""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    params = event.get('queryStringParameters') or {}
    file_name = params.get('file', 'stream.m3u8')

    if '..' in file_name or file_name.startswith('/'):
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': 'Invalid file'
        }

    source_url = SOURCE_BASE + file_name

    try:
        req = urllib.request.Request(source_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = resp.read()
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError):
        return {
            'statusCode': 502,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': 'Stream unavailable'
        }

    if file_name.endswith('.m3u8'):
        text = data.decode('utf-8', errors='ignore')
        lines = []
        for line in text.splitlines():
            stripped = line.strip()
            if stripped and not stripped.startswith('#'):
                base_func_url = event.get('headers', {}).get('X-Forwarded-Proto', 'https') and _self_url(event)
                lines.append(f"{_self_url(event)}?file={stripped}")
            else:
                lines.append(line)
        body_text = "\n".join(lines)
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/vnd.apple.mpegurl',
                'Cache-Control': 'no-cache'
            },
            'body': body_text
        }

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'video/mp2t',
            'Cache-Control': 'no-cache'
        },
        'body': base64.b64encode(data).decode('utf-8'),
        'isBase64Encoded': True
    }


def _self_url(event: dict) -> str:
    headers = event.get('headers', {}) or {}
    host = headers.get('X-Forwarded-Host') or headers.get('Host') or headers.get('host', '')
    proto = headers.get('X-Forwarded-Proto', 'https')
    path = event.get('requestContext', {}).get('path') or event.get('path', '/')
    return f"{proto}://{host}{path}"
