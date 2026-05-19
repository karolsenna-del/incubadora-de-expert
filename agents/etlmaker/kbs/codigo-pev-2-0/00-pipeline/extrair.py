"""
ETLmaker — Extração Código PEV 2.0
Navega cada aula, captura stream HLS, baixa áudio, transcreve com Whisper.
"""

import subprocess
import json
import os
import time
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = Path(__file__).parent
AUDIO_DIR = BASE / "sources" / "audio"
TRANS_DIR = BASE / "sources" / "transcricoes"
LOG_FILE  = BASE / "progresso.log"

CREDENCIAIS = {
    "email": "karolsenna@incubadoradeexpert.com.br",
    "senha": "suasenhadopev123",
    "url":   "https://clarasiqueira.cademi.com.br",
}

AULAS = [
    # Módulo 1 — Comece Aqui para Resultado Rápido
    {"modulo": "01-comece-aqui",          "titulo": "01-comece-aqui",                               "url": "https://clarasiqueira.cademi.com.br/area/conteudo/aula/7786216"},
    {"modulo": "01-comece-aqui",          "titulo": "02-obrigue-o-algoritmo",                       "url": "https://clarasiqueira.cademi.com.br/area/conteudo/aula/7786230"},
    {"modulo": "01-comece-aqui",          "titulo": "03-estrutura-viral-2026",                      "url": "https://clarasiqueira.cademi.com.br/area/conteudo/aula/7786231"},
    # Módulo 2 — Códigos pra Viralizar ainda Hoje
    {"modulo": "02-codigos-viralizar",    "titulo": "01-como-aplicar-os-codigos",                   "url": "https://clarasiqueira.cademi.com.br/area/conteudo/aula/7786238"},
    {"modulo": "02-codigos-viralizar",    "titulo": "02-ideias-infinitas",                          "url": "https://clarasiqueira.cademi.com.br/area/conteudo/aula/7786239"},
    {"modulo": "02-codigos-viralizar",    "titulo": "03-codigo-1",                                  "url": "https://clarasiqueira.cademi.com.br/area/conteudo/aula/7786240"},
    {"modulo": "02-codigos-viralizar",    "titulo": "04-codigo-2",                                  "url": "https://clarasiqueira.cademi.com.br/area/conteudo/aula/7786241"},
    {"modulo": "02-codigos-viralizar",    "titulo": "05-codigo-3",                                  "url": "https://clarasiqueira.cademi.com.br/area/conteudo/aula/7786242"},
    {"modulo": "02-codigos-viralizar",    "titulo": "06-codigo-4",                                  "url": "https://clarasiqueira.cademi.com.br/area/conteudo/aula/7786243"},
    {"modulo": "02-codigos-viralizar",    "titulo": "07-codigo-5",                                  "url": "https://clarasiqueira.cademi.com.br/area/conteudo/aula/7786244"},
    # Módulo 3 — Como Escrevo meus Roteiros
    {"modulo": "03-roteiros",             "titulo": "01-ganchos-virais",                            "url": "https://clarasiqueira.cademi.com.br/area/conteudo/aula/7786877"},
    {"modulo": "03-roteiros",             "titulo": "02-retencao-que-hipnotiza",                    "url": "https://clarasiqueira.cademi.com.br/area/conteudo/aula/7786879"},
    {"modulo": "03-roteiros",             "titulo": "03-acao-que-gera-seguidor",                    "url": "https://clarasiqueira.cademi.com.br/area/conteudo/aula/7786880"},
    {"modulo": "03-roteiros",             "titulo": "04-criando-primeiro-roteiro-viral",            "url": "https://clarasiqueira.cademi.com.br/area/conteudo/aula/7786882"},
    # Módulo 4 — Nunca Mais tenha um Perfil Flopado
    {"modulo": "04-perfil-nao-flopado",   "titulo": "01-movimento-gera-movimento",                  "url": "https://clarasiqueira.cademi.com.br/area/conteudo/aula/7787371"},
    {"modulo": "04-perfil-nao-flopado",   "titulo": "02-codigo-bombar-stories",                     "url": "https://clarasiqueira.cademi.com.br/area/conteudo/aula/7787372"},
    {"modulo": "04-perfil-nao-flopado",   "titulo": "03-viralize-no-brasil-todo",                   "url": "https://clarasiqueira.cademi.com.br/area/conteudo/aula/7787373"},
    # Módulo 5 — Estrutura de um Perfil que Vende
    {"modulo": "05-perfil-que-vende",     "titulo": "01-estrutura-perfil-que-vende",                "url": "https://clarasiqueira.cademi.com.br/area/conteudo/aula/8564858"},
    {"modulo": "05-perfil-que-vende",     "titulo": "02-reels-x-stories",                          "url": "https://clarasiqueira.cademi.com.br/area/conteudo/aula/8564860"},
    {"modulo": "05-perfil-que-vende",     "titulo": "03-stories-que-vendem",                       "url": "https://clarasiqueira.cademi.com.br/area/conteudo/aula/8564861"},
]


def log(msg):
    print(msg, flush=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(msg + "\n")


def ja_transcrito(titulo):
    return (TRANS_DIR / f"{titulo}.txt").exists()


def extrair_m3u8(page, aula_url):
    """Captura a URL m3u8 real com token — ignora o probe inicial (get_qualities)."""
    candidatos = []

    def capturar(request):
        url = request.url
        # Ignorar probe de qualidades — não tem token e dá 403 no ffmpeg
        if ".m3u8" in url and "get_qualities" not in url:
            candidatos.append(url)

    page.on("request", capturar)
    try:
        page.goto(aula_url, wait_until="domcontentloaded", timeout=30000)
        # Esperar até 30s pelo m3u8 com token (vem depois do probe)
        for _ in range(60):
            if candidatos:
                break
            time.sleep(0.5)
    finally:
        page.remove_listener("request", capturar)

    return candidatos[0] if candidatos else None


def extrair_cookies(page):
    """Retorna cookies da sessão como string para o ffmpeg."""
    cookies = page.context.cookies()
    return "; ".join(f"{c['name']}={c['value']}" for c in cookies)


def baixar_audio(m3u8_url, titulo, referer=None, cookies=None):
    audio_path = AUDIO_DIR / f"{titulo}.mp3"
    if audio_path.exists():
        log(f"  [SKIP] Áudio já existe: {audio_path.name}")
        return audio_path
    log(f"  [DOWNLOAD] Baixando áudio...")

    headers = "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36\r\n"
    if referer:
        headers += f"Referer: {referer}\r\n"
    if cookies:
        headers += f"Cookie: {cookies}\r\n"

    cmd = [
        "ffmpeg", "-y",
        "-headers", headers,
        "-i", m3u8_url,
        "-vn",
        "-acodec", "mp3",
        "-ar", "16000",
        "-ac", "1",
        "-q:a", "5",
        str(audio_path)
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
    if result.returncode != 0:
        log(f"  [ERRO] ffmpeg: {result.stderr[-400:]}")
        return None
    log(f"  [OK] Áudio salvo: {audio_path.name}")
    return audio_path


def transcrever(audio_path, titulo):
    trans_path = TRANS_DIR / f"{titulo}.txt"
    if trans_path.exists():
        log(f"  [SKIP] Transcrição já existe: {trans_path.name}")
        return trans_path
    log(f"  [WHISPER] Transcrevendo (pode demorar)...")
    cmd = [
        "whisper", str(audio_path),
        "--language", "pt",
        "--model", "tiny",
        "--output_format", "txt",
        "--output_dir", str(TRANS_DIR),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=3600)
    if result.returncode != 0:
        log(f"  [ERRO] Whisper: {result.stderr[-500:]}")
        return None
    # Whisper salva como {nome_audio}.txt — renomear se necessário
    whisper_out = TRANS_DIR / f"{audio_path.stem}.txt"
    if whisper_out.exists() and whisper_out != trans_path:
        whisper_out.rename(trans_path)
    log(f"  [OK] Transcrição salva: {trans_path.name}")
    return trans_path


def main():
    log("=" * 60)
    log("ETLmaker — Código PEV 2.0 — Início")
    log("=" * 60)

    pendentes = [a for a in AULAS if not ja_transcrito(a["titulo"])]
    log(f"Total: {len(AULAS)} aulas | Pendentes: {len(pendentes)} | Já prontas: {len(AULAS) - len(pendentes)}")

    if not pendentes:
        log("Todas as transcrições já existem. Nada a fazer.")
        return

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Login
        log("\n[LOGIN] Entrando na plataforma...")
        page.goto(f"{CREDENCIAIS['url']}/auth/login", wait_until="networkidle")
        page.fill("#AcessoEmail", CREDENCIAIS["email"])
        page.fill("#AcessoSenha", CREDENCIAIS["senha"])
        page.click("button[type=submit], button:has-text('Entrar')")
        page.wait_for_url("**/vitrine/**", timeout=15000)
        log("[LOGIN] OK")

        total = len(pendentes)
        for i, aula in enumerate(pendentes, 1):
            titulo = aula["titulo"]
            log(f"\n[{i}/{total}] {titulo}")

            if ja_transcrito(titulo):
                log("  [SKIP] Já transcrito.")
                continue

            try:
                log(f"  [NAV] {aula['url']}")
                m3u8 = extrair_m3u8(page, aula["url"])
                if not m3u8:
                    # Segunda tentativa com reload
                    log("  [RETRY] m3u8 não capturado, recarregando...")
                    m3u8 = extrair_m3u8(page, aula["url"])
                if not m3u8:
                    log("  [ERRO] m3u8 não encontrado após retry. Pulando.")
                    continue
                log(f"  [M3U8] {m3u8[:80]}...")

                # Passar cookies e referer para o ffmpeg
                panda_referer = f"https://player-vz-539660e8-322.tv.pandavideo.com.br/"
                cookies = extrair_cookies(page)
                audio = baixar_audio(m3u8, titulo, referer=panda_referer, cookies=cookies)
                if not audio:
                    continue

                transcrever(audio, titulo)

            except Exception as e:
                log(f"  [ERRO] {e}")
                # Se áudio já existe mas transcrição falhou, tentar transcrever mesmo assim
                audio_existente = AUDIO_DIR / f"{titulo}.mp3"
                if audio_existente.exists() and not ja_transcrito(titulo):
                    log(f"  [RETRY-WHISPER] Tentando transcrever áudio existente...")
                    transcrever(audio_existente, titulo)

            except Exception as e2:
                log(f"  [ERRO-FINAL] {e2}")
                continue

        browser.close()

    log("\n" + "=" * 60)
    log("ETLmaker — Pipeline concluído!")
    prontas = sum(1 for a in AULAS if ja_transcrito(a["titulo"]))
    log(f"Transcrições prontas: {prontas}/{len(AULAS)}")
    log("=" * 60)


if __name__ == "__main__":
    main()
