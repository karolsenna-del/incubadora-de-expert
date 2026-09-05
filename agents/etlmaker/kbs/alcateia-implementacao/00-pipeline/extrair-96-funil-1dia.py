"""
ETLmaker — Merge: Funil de 1 Dia > Aula de 8 Blocos
Mesma tecnica do extrair.py principal, aplicada a uma unica aula nova.
"""

import subprocess
import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE      = Path(__file__).parent
AUDIO_DIR = BASE / "sources" / "audio"
TRANS_DIR = BASE / "sources" / "transcricoes"

CREDENCIAIS = {
    "email": "karol.franzini@gmail.com",
    "senha": "123456",
    "login_url": "https://vinigrevy.memberkit.com.br/users/sign_in",
}

TITULO = "96-funil-1dia-aula-8-blocos"
URL = "https://vinigrevy.memberkit.com.br/292899-funil-de-1-dia/5606340-aula-de-8-blocos"


def log(msg):
    print(msg, flush=True)


def login(page):
    log("[LOGIN] Entrando no MemberKit...")
    page.goto(CREDENCIAIS["login_url"], wait_until="domcontentloaded", timeout=30000)
    page.wait_for_selector("input[name='user[email]']", timeout=10000)
    page.fill("input[name='user[email]']", CREDENCIAIS["email"])
    page.fill("input[name='user[password]']", CREDENCIAIS["senha"])
    page.get_by_role("button", name="Login").click()
    page.wait_for_function("() => !window.location.href.includes('sign_in')", timeout=15000)
    time.sleep(1)
    log("[LOGIN] OK")


def extrair_m3u8(page, aula_url):
    candidatos = []

    def capturar(request):
        u = request.url
        if "pandavideo" in u and ".m3u8" in u and "get_qualities" not in u:
            candidatos.append(u)

    page.on("request", capturar)
    try:
        page.goto(aula_url, wait_until="domcontentloaded", timeout=30000)
        for _ in range(60):
            if candidatos:
                break
            time.sleep(0.5)
    finally:
        page.remove_listener("request", capturar)

    return candidatos[0] if candidatos else None


def extrair_cookies(page):
    cookies = page.context.cookies()
    return "; ".join(f"{c['name']}={c['value']}" for c in cookies)


def baixar_audio(m3u8_url, titulo, cookies=None):
    audio_path = AUDIO_DIR / f"{titulo}.mp3"
    headers = "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36\r\n"
    headers += "Referer: https://player-vz-dd8d2def-f8f.tv.pandavideo.com.br/\r\n"
    if cookies:
        headers += f"Cookie: {cookies}\r\n"

    cmd = [
        "ffmpeg", "-y",
        "-headers", headers,
        "-i", m3u8_url,
        "-vn", "-acodec", "mp3", "-ar", "16000", "-ac", "1", "-q:a", "5",
        str(audio_path)
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=1800)
    if result.returncode != 0:
        log(f"[ERRO] ffmpeg: {result.stderr[-800:]}")
        return None
    log(f"[OK] Audio salvo: {audio_path.name}")
    return audio_path


def transcrever(audio_path, titulo):
    trans_path = TRANS_DIR / f"{titulo}.txt"
    log("[WHISPER] Transcrevendo...")
    cmd = [
        sys.executable, "-m", "whisper", str(audio_path),
        "--language", "pt",
        "--model", "small",
        "--output_format", "txt",
        "--output_dir", str(TRANS_DIR),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=7200)
    if result.returncode != 0:
        log(f"[ERRO] Whisper: {result.stderr[-800:]}")
        return None
    whisper_out = TRANS_DIR / f"{audio_path.stem}.txt"
    if whisper_out.exists() and whisper_out != trans_path:
        whisper_out.rename(trans_path)
    log(f"[OK] Transcricao salva: {trans_path.name}")
    return trans_path


def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    TRANS_DIR.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        login(page)

        log(f"[NAV] {URL}")
        m3u8 = extrair_m3u8(page, URL)
        if not m3u8:
            log("[RETRY] m3u8 nao capturado, recarregando...")
            m3u8 = extrair_m3u8(page, URL)
        if not m3u8:
            log("[FALHA] Sem video capturado.")
            browser.close()
            sys.exit(1)

        log(f"[M3U8] {m3u8[:100]}...")
        cookies = extrair_cookies(page)
        audio = baixar_audio(m3u8, TITULO, cookies=cookies)
        browser.close()

        if not audio:
            sys.exit(1)

        transcrever(audio, TITULO)


if __name__ == "__main__":
    main()
