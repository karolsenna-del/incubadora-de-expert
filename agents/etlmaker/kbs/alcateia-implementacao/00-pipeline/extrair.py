"""
ETLmaker — Extração Alcateia Implementação + Social Selling
Navega cada aula no MemberKit, captura stream HLS (PandaVideo),
baixa áudio com ffmpeg, transcreve com Whisper.
"""

import subprocess
import sys
import os
import time
import atexit
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE      = Path(__file__).parent
AUDIO_DIR = BASE / "sources" / "audio"
TRANS_DIR = BASE / "sources" / "transcricoes"
LOG_FILE  = BASE / "progresso.log"
LOCK_FILE = BASE / ".extrair.lock"

CREDENCIAIS = {
    "email": "karol.franzini@gmail.com",
    "senha": "123456",
    "login_url": "https://vinigrevy.memberkit.com.br/users/sign_in",
}

AULAS = [
    # ── Módulo 01: Comece Aqui ──────────────────────────────────────────────
    {"titulo": "01-bem-vindo-a-alcateia",            "url": "https://vinigrevy.memberkit.com.br/165479-comece-aqui-modelo-de-negocio/3660540-bem-vindo-a-alcateia"},
    {"titulo": "02-curva-jota",                      "url": "https://vinigrevy.memberkit.com.br/165479-comece-aqui-modelo-de-negocio/3660551-curva-jota"},
    {"titulo": "03-modelo-de-negocio",               "url": "https://vinigrevy.memberkit.com.br/165479-comece-aqui-modelo-de-negocio/3660560-modelo-de-negocio"},
    {"titulo": "04-seu-caminho-para-os-30k",         "url": "https://vinigrevy.memberkit.com.br/165479-comece-aqui-modelo-de-negocio/3660561-seu-caminho-para-os-30k"},
    {"titulo": "05-como-editar-o-notion",            "url": "https://vinigrevy.memberkit.com.br/165479-comece-aqui-modelo-de-negocio/3804661-como-editar-o-notion"},
    {"titulo": "06-checklist-modelo-de-negocios",    "url": "https://vinigrevy.memberkit.com.br/165479-comece-aqui-modelo-de-negocio/5169199-checklist-modelo-de-negocios"},
    # ── Módulo 02: Caixa Rápido ─────────────────────────────────────────────
    {"titulo": "07-caixa-rapido-sem-audiencia",      "url": "https://vinigrevy.memberkit.com.br/165494-caixa-rapido-24hrs/3660570-caixa-rapido-sem-audiencia"},
    {"titulo": "08-caixa-rapido-com-audiencia",      "url": "https://vinigrevy.memberkit.com.br/165494-caixa-rapido-24hrs/3660575-caixa-rapido-com-audiencia"},
    {"titulo": "09-checklist-caixa-rapido",          "url": "https://vinigrevy.memberkit.com.br/165494-caixa-rapido-24hrs/3660579-checklist-caixa-rapido"},
    {"titulo": "10-teia-de-aranha-da-alcateia",      "url": "https://vinigrevy.memberkit.com.br/165494-caixa-rapido-24hrs/3979909-a-teia-de-aranha-da-alcateia"},
    # ── Módulo 03: Posicionamento e Comunicação ─────────────────────────────
    {"titulo": "11-definindo-seu-problema",          "url": "https://vinigrevy.memberkit.com.br/165495-posicionamento-e-comunicacao/3662040-definindo-seu-problema"},
    {"titulo": "12-mercado-unico",                   "url": "https://vinigrevy.memberkit.com.br/165495-posicionamento-e-comunicacao/3662042-mercado-unico"},
    {"titulo": "13-promessa-matadora",               "url": "https://vinigrevy.memberkit.com.br/165495-posicionamento-e-comunicacao/3662044-promessa-matadora"},
    {"titulo": "14-metodo-ab",                       "url": "https://vinigrevy.memberkit.com.br/165495-posicionamento-e-comunicacao/3662047-metodo-ab"},
    {"titulo": "15-perfil-matador",                  "url": "https://vinigrevy.memberkit.com.br/165495-posicionamento-e-comunicacao/3662049-perfil-matador"},
    {"titulo": "16-guia-de-publico-e-posicionamento","url": "https://vinigrevy.memberkit.com.br/165495-posicionamento-e-comunicacao/5169294-guia-de-publico-e-posicionamento"},
    {"titulo": "17-checklist-posicionamento",        "url": "https://vinigrevy.memberkit.com.br/165495-posicionamento-e-comunicacao/3662050-checklist-posicionamento"},
    # ── Módulo 04: Oferta e Produto ─────────────────────────────────────────
    {"titulo": "18-inicio-oferta",                   "url": "https://vinigrevy.memberkit.com.br/165496-oferta-e-produto/3667154-inicio"},
    {"titulo": "19-instagram-fantasma",              "url": "https://vinigrevy.memberkit.com.br/165496-oferta-e-produto/3667156-instagram-fantasmta"},
    {"titulo": "20-criando-seu-metodo",              "url": "https://vinigrevy.memberkit.com.br/165496-oferta-e-produto/3667167-criando-seu-metodo"},
    {"titulo": "21-precificacao",                    "url": "https://vinigrevy.memberkit.com.br/165496-oferta-e-produto/3667168-precificacao"},
    {"titulo": "22-alcateia-model-offer",            "url": "https://vinigrevy.memberkit.com.br/165496-oferta-e-produto/5169247-alcateia-model-offer"},
    {"titulo": "23-modelo-prestacao-de-servicos",    "url": "https://vinigrevy.memberkit.com.br/165496-oferta-e-produto/3667169-modelo-prestacao-de-servicos"},
    {"titulo": "24-modelo-mentoria-individual",      "url": "https://vinigrevy.memberkit.com.br/165496-oferta-e-produto/3667170-modelo-mentoria-individual"},
    {"titulo": "25-modelo-mentoria-em-grupo",        "url": "https://vinigrevy.memberkit.com.br/165496-oferta-e-produto/3667171-modelo-mentoria-em-grupo"},
    {"titulo": "26-modelo-infoproduto",              "url": "https://vinigrevy.memberkit.com.br/165496-oferta-e-produto/3667173-modelo-infoproduto"},
    {"titulo": "27-checklist-oferta-e-produto",      "url": "https://vinigrevy.memberkit.com.br/165496-oferta-e-produto/3679814-checklist-oferta-e-produto"},
    {"titulo": "28-criando-conteudos-validados",     "url": "https://vinigrevy.memberkit.com.br/165496-oferta-e-produto/5169295-criando-conteudos-validados-agente-gpt"},
    {"titulo": "29-estrategia-de-conteudo",          "url": "https://vinigrevy.memberkit.com.br/165496-oferta-e-produto/5169286-a-estrategia-de-conteudo"},
    {"titulo": "30-conteudo-1-viral-reels",          "url": "https://vinigrevy.memberkit.com.br/165496-oferta-e-produto/5169290-conteudo-1-viral-reels"},
    {"titulo": "31-conteudo-2-dor-eventos",          "url": "https://vinigrevy.memberkit.com.br/165496-oferta-e-produto/5169291-conteudo-2-dor-eventos"},
    {"titulo": "32-conteudo-3-principios-e-valores", "url": "https://vinigrevy.memberkit.com.br/165496-oferta-e-produto/5169292-conteudo-3-principios-e-valores"},
    {"titulo": "33-frequencia-de-conteudo",          "url": "https://vinigrevy.memberkit.com.br/165496-oferta-e-produto/5169287-frequencia-de-conteudo"},
    {"titulo": "34-criando-com-chatgpt-alcance",     "url": "https://vinigrevy.memberkit.com.br/165496-oferta-e-produto/5169293-criando-com-chatgpt-alcance"},
    {"titulo": "35-criando-com-chatgpt-dor",         "url": "https://vinigrevy.memberkit.com.br/165496-oferta-e-produto/5169288-criando-com-chatgpt-eventos-e-dor"},
    {"titulo": "36-agentes-ia-conteudos-validados",  "url": "https://vinigrevy.memberkit.com.br/165496-oferta-e-produto/5169289-agentes-de-ia-conteudos-validados"},
    {"titulo": "37-checklist-conteudo",              "url": "https://vinigrevy.memberkit.com.br/165496-oferta-e-produto/5169296-checklist-conteudo"},
    # ── Módulo 05: Aquisição de Clientes ────────────────────────────────────
    {"titulo": "38-cilindro-de-vendas",              "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5175124-cilindro-de-vendas"},
    {"titulo": "39-jornada-do-cliente",              "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5175125-jornada-do-cliente"},
    {"titulo": "40-modelos-de-mini-treinamento",     "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5175126-modelos-de-mini-treinamento"},
    {"titulo": "41-automacao-mini-treinamento",      "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5175127-automacao-para-mini-treinamento-manychat"},
    {"titulo": "42-agente-ia-mini-treinamento",      "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5175128-agente-de-ia-para-mini-treinamento"},
    {"titulo": "43-pagina-mini-treinamento",         "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5175163-pagina-de-mini-treinamento"},
    {"titulo": "44-checklist-mini-treinamento",      "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5175166-checklist-mini-treinamento"},
    {"titulo": "45-planilha-metricas-mini-funil",    "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/3679693-planilha-de-metricas-de-para-funil-de-mini-treinamento"},
    {"titulo": "46-problemas-com-manychat",          "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/3847760-problemas-com-manychat"},
    {"titulo": "47-estrutura-aula-milionaria",       "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5175167-estrutura-da-aula-milionaria"},
    {"titulo": "48-etapa-1-introducao-lead",         "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5175168-etapa-1-introducao-lead"},
    {"titulo": "49-etapa-2-conteudo",                "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5175169-etapa-2-conteudo"},
    {"titulo": "50-etapa-3-oferta",                  "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5175170-etapa-3-oferta"},
    {"titulo": "51-aula-milionaria-sem-depoimento",  "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5175203-aula-milionaria-validada-sem-depoimento"},
    {"titulo": "52-aula-milionaria-com-depoimento",  "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5242254-aula-milionaria-validada-com-depoimento"},
    {"titulo": "53-subindo-aula-milionaria-vturb",   "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5175174-subindo-sua-aula-milionaria-vturb"},
    {"titulo": "54-pagina-aula-milionaria",          "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5175177-pagina-aula-milionaria"},
    {"titulo": "55-pagina-upsell-faturamento",       "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5242472-pagina-de-upssell-aumentando-seu-faturamento"},
    {"titulo": "56-automacao-aula-milionaria",       "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5175213-automacao-para-aula-milionaria-manychat"},
    {"titulo": "57-checklist-aula-milionaria",       "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5175184-checklist-aula-milionaria"},
    {"titulo": "58-config-pv-aula1-introducao",      "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5196837-aula-1-introducao-informacoes-iniciais-mp4"},
    {"titulo": "59-config-pv-aula2-vantagens",       "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5196838-aula-2-vantagens-de-usar-a-estrutura-mp4"},
    {"titulo": "60-config-pv-aula3-orientacoes",     "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5196839-aula-3-orientacoes-previas-mp4"},
    {"titulo": "61-config-pv-aula4-greatpages",      "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5196840-aula-4-salvando-informacoes-do-greatpages-mp4"},
    {"titulo": "62-config-pv-aula5-vturb",           "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5196841-aula-5-salvando-elementos-da-vturb-mp4"},
    {"titulo": "63-config-pv-aula6-primeiro-codigo", "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5196842-aula-6-configurando-o-primeiro-codigo-mp4"},
    {"titulo": "64-config-pv-aula7-testando-pagina", "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5196843-aula-7-testando-a-configuracao-da-pagina-mp4"},
    {"titulo": "65-config-pv-aula8-teste-ab-vturb",  "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5196844-aula-8-configurando-o-teste-a-b-na-vturb-mp4"},
    {"titulo": "66-config-pv-aula9-codigo-ab",       "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5196845-aula-9-configurando-o-codigo-a-b-mp4"},
    {"titulo": "67-config-pv-aula10-botoes-teste-ab","url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5196846-aula-10-configurando-os-botoes-do-teste-a-b-na-vturb-mp4"},
    {"titulo": "68-config-pv-aula11-encerramento",   "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5196847-aula-11-encerramento"},
    {"titulo": "69-copie-automacao-seguidores",      "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5175195-copie-a-automacao-para-seguidores"},
    {"titulo": "70-funil-seguidores-manual",         "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/3667179-configurando-manualmente-o-funil-de-seguidores"},
    {"titulo": "71-estrategia-no-meu-perfil",        "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5175181-estrategia-no-meu-perfil-para-voce-copiar"},
    {"titulo": "72-funis-ocultos-perfil",            "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/5175182-os-funis-ocultos-do-meu-perfil"},
    {"titulo": "73-aumentando-conversao-30",         "url": "https://vinigrevy.memberkit.com.br/165497-aquisicao-de-clientes/3667178-aumentando-sua-conversao-em-30"},
    # ── Módulo 06: Vendas e Escala ──────────────────────────────────────────
    {"titulo": "74-processo-de-vendas",              "url": "https://vinigrevy.memberkit.com.br/165498-vendas-e-escala/3667181-processo-de-vendas"},
    {"titulo": "75-rotina-14hrs-semanais",           "url": "https://vinigrevy.memberkit.com.br/165498-vendas-e-escala/3679536-rotina-de-14hrs-semanais"},
    {"titulo": "76-script-de-vendas-e-conducao",     "url": "https://vinigrevy.memberkit.com.br/165498-vendas-e-escala/3667182-script-de-vendas-e-conducao"},
    {"titulo": "77-social-seller-e-boas-vindas",     "url": "https://vinigrevy.memberkit.com.br/165498-vendas-e-escala/3679537-social-seller-e-boas-vindas"},
    {"titulo": "78-gerando-desejo-no-produto",       "url": "https://vinigrevy.memberkit.com.br/165498-vendas-e-escala/3667183-gerando-desejo-no-seu-produto"},
    {"titulo": "79-metricas-de-trafego",             "url": "https://vinigrevy.memberkit.com.br/165498-vendas-e-escala/3679538-metricas-de-trafego"},
    {"titulo": "80-trafego-pago",                    "url": "https://vinigrevy.memberkit.com.br/165498-vendas-e-escala/3667184-trafego-pago"},
    {"titulo": "81-turninando-pelo-notebook",        "url": "https://vinigrevy.memberkit.com.br/165498-vendas-e-escala/3859273-turninando-pelo-notebook"},
    {"titulo": "82-escala-de-trafego",               "url": "https://vinigrevy.memberkit.com.br/165498-vendas-e-escala/3667185-escala-de-trafego"},
    {"titulo": "83-planilha-metricas-trafego",       "url": "https://vinigrevy.memberkit.com.br/165498-vendas-e-escala/3679696-planilha-de-metricas-de-trafego"},
    {"titulo": "84-checklist-vendas-e-escala",       "url": "https://vinigrevy.memberkit.com.br/165498-vendas-e-escala/3679824-checklist-vendas-e-escala"},
    {"titulo": "85-o-simples-que-funciona-iniciante","url": "https://vinigrevy.memberkit.com.br/165498-vendas-e-escala/5171493-o-simples-que-funciona-iniciante"},
    {"titulo": "86-hackeando-gerenciador",           "url": "https://vinigrevy.memberkit.com.br/165498-vendas-e-escala/5171492-hackeando-o-gerenciador-intermediario"},
    {"titulo": "87-momento-certo-remarketing",       "url": "https://vinigrevy.memberkit.com.br/165498-vendas-e-escala/5171499-o-momento-certo-de-investir-em-remarketing"},
    {"titulo": "88-estrutura-remarketing",           "url": "https://vinigrevy.memberkit.com.br/165498-vendas-e-escala/5171498-estrutura-de-remarketing-e-campanhas"},
    {"titulo": "89-criativos-para-remarketing",      "url": "https://vinigrevy.memberkit.com.br/165498-vendas-e-escala/5171497-criativos-para-remarketing"},
    {"titulo": "90-baixe-pdf-mapa-mental",           "url": "https://vinigrevy.memberkit.com.br/165498-vendas-e-escala/5171500-baixe-o-pdf-do-mapa-mental"},
    # ── Social Selling ──────────────────────────────────────────────────────
    {"titulo": "91-selling-no-instagram",            "url": "https://vinigrevy.memberkit.com.br/275602-social-selling/5258505-selling-no-instagram"},
    {"titulo": "92-selling-no-whatsapp",             "url": "https://vinigrevy.memberkit.com.br/275602-social-selling/5258504-selling-no-whatsapp"},
    {"titulo": "93-pdf-e-docs-social-selling",       "url": "https://vinigrevy.memberkit.com.br/275602-social-selling/5258506-pdf-e-docs"},
    {"titulo": "94-workshop-social-selling",         "url": "https://vinigrevy.memberkit.com.br/275602-social-selling/5258503-workshop-social-selling-e-vendas-no-organico"},
]


def log(msg):
    print(msg, flush=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(msg + "\n")


def ja_transcrito(titulo):
    return (TRANS_DIR / f"{titulo}.txt").exists()


def extrair_m3u8(page, aula_url):
    """Captura URL m3u8 com token — ignora probe inicial (get_qualities)."""
    candidatos = []

    def capturar(request):
        url = request.url
        if "pandavideo" in url and ".m3u8" in url and "get_qualities" not in url:
            candidatos.append(url)

    page.on("request", capturar)
    try:
        try:
            page.goto(aula_url, wait_until="domcontentloaded", timeout=30000)
        except Exception as nav_err:
            # Erro de rede transitório: aguarda e tenta reload
            log(f"  [NAV-ERRO] {str(nav_err)[:120]} — aguardando 5s...")
            time.sleep(5)
            try:
                page.goto(aula_url, wait_until="domcontentloaded", timeout=30000)
            except Exception:
                return None
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
    if audio_path.exists():
        log(f"  [SKIP] Áudio já existe: {audio_path.name}")
        return audio_path
    log(f"  [DOWNLOAD] Baixando áudio...")

    headers = "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36\r\n"
    headers += "Referer: https://player-vz-dd8d2def-f8f.tv.pandavideo.com.br/\r\n"
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
        log(f"  [ERRO] ffmpeg: {result.stderr[-500:]}")
        return None
    log(f"  [OK] Áudio salvo: {audio_path.name}")
    return audio_path


def transcrever(audio_path, titulo):
    trans_path = TRANS_DIR / f"{titulo}.txt"
    if trans_path.exists():
        log(f"  [SKIP] Transcrição já existe: {trans_path.name}")
        return trans_path
    log(f"  [WHISPER] Transcrevendo...")
    cmd = [
        sys.executable, "-m", "whisper", str(audio_path),
        "--language", "pt",
        "--model", "small",
        "--output_format", "txt",
        "--output_dir", str(TRANS_DIR),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=7200)
    if result.returncode != 0:
        log(f"  [ERRO] Whisper: {result.stderr[-500:]}")
        return None
    whisper_out = TRANS_DIR / f"{audio_path.stem}.txt"
    if whisper_out.exists() and whisper_out != trans_path:
        whisper_out.rename(trans_path)
    log(f"  [OK] Transcrição salva: {trans_path.name}")
    return trans_path


def login(page):
    log("[LOGIN] Entrando no MemberKit...")
    page.goto(CREDENCIAIS["login_url"], wait_until="domcontentloaded", timeout=30000)
    page.wait_for_selector("input[name='user[email]']", timeout=10000)
    page.fill("input[name='user[email]']", CREDENCIAIS["email"])
    page.fill("input[name='user[password]']", CREDENCIAIS["senha"])
    page.get_by_role("button", name="Login").click()
    # Aguarda sair da página de login
    page.wait_for_function("() => !window.location.href.includes('sign_in')", timeout=15000)
    time.sleep(1)
    log("[LOGIN] OK")


def adquirir_lock():
    if LOCK_FILE.exists():
        pid = LOCK_FILE.read_text().strip()
        print(f"[LOCK] Processo já em execução (PID {pid}). Abortando.", flush=True)
        sys.exit(1)
    LOCK_FILE.write_text(str(os.getpid()))
    atexit.register(lambda: LOCK_FILE.unlink(missing_ok=True))


def abrir_browser(p):
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    return browser, page


def main():
    adquirir_lock()
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    TRANS_DIR.mkdir(parents=True, exist_ok=True)

    log("=" * 60)
    log("ETLmaker — Alcateia Implementação — Início")
    log("=" * 60)

    pendentes = [a for a in AULAS if not ja_transcrito(a["titulo"])]
    log(f"Total: {len(AULAS)} aulas | Pendentes: {len(pendentes)} | Prontas: {len(AULAS) - len(pendentes)}")

    if not pendentes:
        log("Todas as transcrições já existem.")
        return

    with sync_playwright() as p:
        browser, page = abrir_browser(p)
        login(page)

        total = len(pendentes)
        skips_consecutivos = 0

        for i, aula in enumerate(pendentes, 1):
            titulo = aula["titulo"]
            log(f"\n[{i}/{total}] {titulo}")

            if ja_transcrito(titulo):
                log("  [SKIP] Já transcrito.")
                skips_consecutivos = 0
                continue

            # Se 4 skips seguidos, browser provavelmente perdeu estado — reinicia
            if skips_consecutivos >= 4:
                log("  [BROWSER-RESTART] Muitos skips consecutivos — reiniciando browser...")
                try:
                    browser.close()
                except Exception:
                    pass
                browser, page = abrir_browser(p)
                login(page)
                skips_consecutivos = 0

            try:
                # Limpa página anterior antes de navegar
                try:
                    page.goto("about:blank", wait_until="load", timeout=5000)
                except Exception:
                    pass

                m3u8 = extrair_m3u8(page, aula["url"])
                if not m3u8:
                    log("  [RETRY] m3u8 não capturado, recarregando...")
                    m3u8 = extrair_m3u8(page, aula["url"])
                if not m3u8:
                    log("  [SKIP] Sem vídeo (PDF/checklist/planilha). Pulando.")
                    skips_consecutivos += 1
                    continue

                skips_consecutivos = 0
                log(f"  [M3U8] {m3u8[:80]}...")

                cookies = extrair_cookies(page)
                audio = baixar_audio(m3u8, titulo, cookies=cookies)
                if not audio:
                    continue

                transcrever(audio, titulo)

            except Exception as e:
                log(f"  [ERRO] {e}")
                skips_consecutivos += 1
                audio_existente = AUDIO_DIR / f"{titulo}.mp3"
                if audio_existente.exists() and not ja_transcrito(titulo):
                    log(f"  [RETRY-WHISPER] Áudio existe, tentando transcrever...")
                    transcrever(audio_existente, titulo)
                    skips_consecutivos = 0

        browser.close()

    log("\n" + "=" * 60)
    log("Pipeline de ingestão concluído!")
    prontas = sum(1 for a in AULAS if ja_transcrito(a["titulo"]))
    log(f"Transcrições prontas: {prontas}/{len(AULAS)}")
    log("=" * 60)


if __name__ == "__main__":
    main()
