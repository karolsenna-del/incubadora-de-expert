"""Operação manual restrita às três capas aprovadas. Não executar localmente em produção."""
import hashlib
import os
from pathlib import Path
import re
import struct
import subprocess
import time
from urllib.parse import urlsplit
import zlib

import requests

ROOT = Path(__file__).resolve().parents[2]
ASSETS = 'docs/producao-conteudo/karol/posts/contrastes-semana15-13a15nov'
TARGETS = (
    ('capa-sex-13-11.png', 'rota100k-s15-sex-espera-publico-x-vende-sem'),
    ('capa-sab-14-11.png', 'rota100k-s15-sab-servidor-espera-x-constroi'),
    ('capa-dom-15-11.png', 'rota100k-s15-dom-7-listas-da-semana'),
)
MAPPINGS = tuple((f'{ASSETS}/{file}', f'instagram-carrosseis/{slug}/slide-01',
                  f'.github/workflows/post-{slug}.yml') for file, slug in TARGETS)


def allowed(mapping):
    if mapping not in MAPPINGS:
        raise ValueError('Mapeamento não autorizado')


def png(data):
    if data[:8] != b'\x89PNG\r\n\x1a\n':
        raise ValueError('PNG inválido')
    pos, chunks, compressed = 8, [], bytearray()
    while pos < len(data):
        size = struct.unpack('>I', data[pos:pos+4])[0]
        kind = data[pos+4:pos+8]
        body = data[pos+8:pos+8+size]
        crc = data[pos+8+size:pos+12+size]
        if len(crc) != 4 or zlib.crc32(kind + body) != struct.unpack('>I', crc)[0]:
            raise ValueError('PNG truncado ou CRC inválido')
        chunks.append(kind)
        if kind == b'IHDR':
            w, h, depth, color, compression, filtering, interlace = struct.unpack('>IIBBBBB', body)
            if (w, h) != (1080, 1350) or color not in (2, 6) or depth != 8 or (compression, filtering, interlace) != (0, 0, 0):
                raise ValueError('PNG deve ser 1080x1350 RGB/RGBA 8-bit não entrelaçado')
        if kind == b'IDAT':
            compressed.extend(body)
        pos += size + 12
        if kind == b'IEND':
            break
    if chunks[:1] != [b'IHDR'] or chunks[-1:] != [b'IEND'] or pos != len(data):
        raise ValueError('Estrutura PNG inválida')
    raw = zlib.decompress(compressed)
    stride = 1080 * (3 if color == 2 else 4) + 1
    if len(raw) != stride * 1350 or any(raw[i] > 4 for i in range(0, len(raw), stride)):
        raise ValueError('Pixels PNG inválidos')


def public_url(url):
    if not isinstance(url, str):
        raise ValueError('URL inválida')
    parsed = urlsplit(url)
    if (parsed.scheme != 'https' or parsed.hostname != 'res.cloudinary.com'
            or parsed.username or parsed.password or parsed.query or parsed.fragment
            or parsed.port or not re.fullmatch(r'https://res\.cloudinary\.com/[A-Za-z0-9_./%-]+', url)):
        raise ValueError('URL pública inválida')
    return url


def response_url(mapping, payload):
    allowed(mapping)
    if payload.get('public_id') != mapping[1] or type(payload.get('width')) is not int or type(payload.get('height')) is not int or (payload['width'], payload['height']) != (1080, 1350):
        raise ValueError('Resposta Cloudinary inválida')
    return public_url(payload.get('secure_url'))


def replace_cover(mapping, original, url):
    allowed(mapping)
    public_url(url)
    blocks = list(re.finditer(rb'SLIDES = \[(.*?)\]', original, re.S))
    if len(blocks) != 1:
        raise ValueError('Lista SLIDES ambígua')
    urls = list(re.finditer(rb'"(https://[^"\r\n]+)"', blocks[0][1]))
    slug = mapping[1].rsplit('/', 1)[0]
    if len(urls) < 2:
        raise ValueError('Slides ausentes')
    for index, match in enumerate(urls, 1):
        if not match[1].endswith(f'/{slug}/slide-{index:02}.png'.encode()):
            raise ValueError('Sequência de slides inesperada')
    first = urls[0]
    start = blocks[0].start(1) + first.start(1)
    end = blocks[0].start(1) + first.end(1)
    return original[:start] + url.encode('ascii') + original[end:]


def upload(mapping, data, credentials, session=requests):
    allowed(mapping)
    png(data)
    cloud, key, secret = credentials
    if not re.fullmatch(r'[A-Za-z0-9_-]+', cloud):
        raise ValueError('Cloud inválida')
    params = {'invalidate': 'true', 'overwrite': 'true', 'public_id': mapping[1], 'timestamp': str(int(time.time()))}
    signed = '&'.join(f'{k}={v}' for k, v in sorted(params.items()))
    signature = hashlib.sha1((signed + secret).encode()).hexdigest()
    result = session.post(f'https://api.cloudinary.com/v1_1/{cloud}/image/upload',
                          data={**params, 'api_key': key, 'signature': signature},
                          files={'file': ('cover.png', data, 'image/png')}, timeout=120)
    result.raise_for_status()
    return response_url(mapping, result.json())


def verify(url, session=requests):
    public_url(url)
    result = session.get(url, timeout=120, allow_redirects=False)
    if result.status_code != 200:
        raise ValueError('Verificação HTTP falhou')
    png(result.content)


def git(*args, check=True):
    result = subprocess.run(['git', *args], cwd=ROOT, capture_output=True, text=True)
    if check and result.returncode:
        # Git diagnostics are safe; never include HTTP/API exception bodies.
        raise RuntimeError(f'Git {args[0]} falhou: {result.stderr.strip()}')
    return result


def commit_push():
    git('config', 'user.name', 'github-actions[bot]')
    git('config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com')
    for mapping in MAPPINGS:
        git('add', '--', mapping[2])
    staged = set(git('diff', '--cached', '--name-only').stdout.splitlines())
    if staged - {m[2] for m in MAPPINGS}:
        raise ValueError('Arquivos não autorizados no index')
    if staged:
        git('commit', '-m', 'Substituir somente capas dos carrosséis da semana 15')
    for attempt in range(3):
        git('fetch', 'origin', 'master')
        git('pull', '--rebase', 'origin', 'master')
        result = git('push', 'origin', 'HEAD:master', check=False)
        if result.returncode == 0:
            print('COMMIT_OK', git('rev-parse', 'HEAD').stdout.strip())
            return
    raise RuntimeError(f'Git push falhou após 3 tentativas: {result.stderr.strip()}')


def main():
    if git('status', '--porcelain').stdout:
        raise ValueError('Checkout deve estar limpo')
    prepared = []
    # Validate all files and all workflow edits before the first remote mutation.
    for mapping in MAPPINGS:
        allowed(mapping)
        git('ls-files', '--error-unmatch', '--', mapping[0], mapping[2])
        data = (ROOT / mapping[0]).read_bytes()
        png(data)
        original = (ROOT / mapping[2]).read_bytes()
        replace_cover(mapping, original, 'https://res.cloudinary.com/validation/slide-01.png')
        prepared.append((mapping, data, original))
    credentials = tuple(os.environ[k] for k in ('CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'))
    edits = []
    for mapping, data, original in prepared:
        url = upload(mapping, data, credentials)
        slug = mapping[1].split('/')[1]
        print('UPLOAD_OK', slug, url, flush=True)
        verify(url)
        print('VERIFY_OK', slug, flush=True)
        edits.append((mapping[2], replace_cover(mapping, original, url)))
    for path, content in edits:
        (ROOT / path).write_bytes(content)
    commit_push()


if __name__ == '__main__':
    # Fail closed, without requests tracebacks that could reveal signed parameters.
    try:
        main()
    except Exception as error:
        if isinstance(error, RuntimeError):
            raise SystemExit(str(error)) from None
        raise SystemExit(1) from None
