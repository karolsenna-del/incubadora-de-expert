"""
Course Publisher — Automação Hotmart para Expert360
Incubadora de Expert | Karol Senna

Faz upload de vídeos, thumbnails e descrições para a área de membros da Hotmart.
Roda em modo visível (headless=False) para suportar 2FA e intervenções manuais.

Uso:
    python course-publisher.py --dry-run          # ver plano sem abrir browser
    python course-publisher.py --modulo M0        # só M0
    python course-publisher.py                    # todos os módulos com vídeo pronto
    python course-publisher.py --so-descricoes    # só descrições (sem upload de vídeo)
"""

import sys
import yaml
import argparse
from pathlib import Path
from playwright.sync_api import sync_playwright, Page

# ─── PATHS ────────────────────────────────────────────────────────────────────

SCRIPT_DIR   = Path(__file__).resolve().parent
AGENT_DIR    = SCRIPT_DIR.parent                             # agents/course-publisher/
PROJECT_ROOT = AGENT_DIR.parent.parent                       # raiz do projeto
DATA_DIR     = AGENT_DIR / "data"

VAULT_PATH    = DATA_DIR / "vault.yaml"
CONFIG_PATH   = DATA_DIR / "config.yaml"

PRODUCAO_BASE = PROJECT_ROOT / "business" / "producao" / "expert360"
THUMBS_DIR    = PRODUCAO_BASE / "assets" / "thumbnails"
CAPAS_DIR     = PRODUCAO_BASE / "assets" / "capas-modulos"
DESCRICOES_MD = PRODUCAO_BASE / "descricoes.md"

# ─── VAULT ────────────────────────────────────────────────────────────────────

def load_vault() -> dict:
    if not VAULT_PATH.exists():
        print(f"\n[ERRO] vault.yaml não encontrado.")
        print(f"       Copie: {DATA_DIR / 'vault.template.yaml'}")
        print(f"       Para:  {VAULT_PATH}")
        print(f"       E preencha com suas credenciais.\n")
        sys.exit(1)

    with open(VAULT_PATH, "r", encoding="utf-8") as f:
        v = yaml.safe_load(f)

    hotmart = v.get("hotmart", {})
    if not hotmart.get("email") or "AQUI" in hotmart.get("email", ""):
        print("[ERRO] Email não preenchido no vault.yaml"); sys.exit(1)
    if not hotmart.get("password") or "AQUI" in hotmart.get("password", ""):
        print("[ERRO] Senha não preenchida no vault.yaml"); sys.exit(1)

    return hotmart

# ─── CONFIG ────────────────────────────────────────────────────────────────────

def load_config() -> list:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)["modules"]

# ─── DESCRIÇÕES ────────────────────────────────────────────────────────────────

def parse_descricoes() -> dict:
    """
    Retorna:
    {
      "M0": {"00-intro": "texto...", "01-fracasso-como-prova": "texto..."},
      "M1": {...},
      ...
    }
    """
    descricoes: dict = {}
    current_modulo = None
    current_slug   = None
    buffer: list   = []

    with open(DESCRICOES_MD, "r", encoding="utf-8") as f:
        for raw_line in f:
            line = raw_line.rstrip()

            if line.startswith("## "):
                # Fecha slug anterior
                if current_slug and current_modulo is not None:
                    descricoes[current_modulo][current_slug] = _clean_buffer(buffer)
                    buffer = []
                    current_slug = None
                current_modulo = line[3:].strip()
                descricoes[current_modulo] = {}

            elif line.startswith("### "):
                if current_slug and current_modulo is not None:
                    descricoes[current_modulo][current_slug] = _clean_buffer(buffer)
                    buffer = []
                current_slug = line[4:].strip()

            elif current_slug is not None and line not in ("---", ""):
                buffer.append(line)

    # Fecha o último
    if current_slug and current_modulo is not None:
        descricoes[current_modulo][current_slug] = _clean_buffer(buffer)

    return descricoes


def _clean_buffer(buf: list) -> str:
    return "\n".join(l for l in buf if l).strip()

# ─── PLANO ────────────────────────────────────────────────────────────────────

def build_plan(modules: list, descricoes: dict) -> list:
    """
    Retorna lista de tarefas prontas para execução:
    {
      modulo_id, hotmart_name, video_path (Path|None),
      thumb_path (Path|None), descricao (str), lesson_url (str)
    }
    """
    tasks = []
    for mod in modules:
        mod_id = mod["id"]
        for lesson in mod["lessons"]:
            slug = lesson["descricao_slug"]
            video_file = lesson.get("video")

            # Vídeo
            video_path = None
            if video_file:
                candidate = PRODUCAO_BASE / mod_id / video_file
                if candidate.exists():
                    video_path = candidate

            # Thumbnail
            thumb_path = THUMBS_DIR / f"{mod_id}-{slug}.png"
            if not thumb_path.exists():
                thumb_path = None

            # Descrição
            descricao = descricoes.get(mod_id, {}).get(slug, "")

            tasks.append({
                "modulo_id":    mod_id,
                "modulo_nome":  mod["hotmart_name"],
                "aula_nome":    lesson["hotmart_name"],
                "video_path":   video_path,
                "thumb_path":   thumb_path,
                "descricao":    descricao,
                "lesson_url":   lesson.get("hotmart_lesson_url", ""),
            })
    return tasks

# ─── DRY-RUN ──────────────────────────────────────────────────────────────────

def print_plan(tasks: list, so_descricoes: bool = False):
    modulo_atual = None
    total_videos = 0
    total_sem_video = 0

    for t in tasks:
        if t["modulo_id"] != modulo_atual:
            modulo_atual = t["modulo_id"]
            print(f"\n  [{modulo_atual}] {t['modulo_nome']}")

        v_status = ""
        if not so_descricoes:
            if t["video_path"]:
                v_status = f"  VIDEO={t['video_path'].name}"
                total_videos += 1
            else:
                v_status = "  VIDEO=[pendente]"
                total_sem_video += 1

        thumb_status = f"  THUMB={'OK' if t['thumb_path'] else '[ausente]'}"
        desc_status  = f"  DESC={'OK' if t['descricao'] else '[vazia]'}"
        url_status   = f"  URL={'OK' if t['lesson_url'] else '[preencher]'}"

        print(f"    • {t['aula_nome']}")
        print(f"     {v_status}{thumb_status}{desc_status}{url_status}")

    print()
    if not so_descricoes:
        print(f"  Vídeos prontos: {total_videos}")
        print(f"  Vídeos pendentes: {total_sem_video}")

    urls_vazias = sum(1 for t in tasks if not t["lesson_url"])
    if urls_vazias:
        print(f"\n  ATENÇÃO: {urls_vazias} aulas sem hotmart_lesson_url no config.yaml.")
        print(f"  Preencha os campos hotmart_lesson_url após criar as aulas na Hotmart,")
        print(f"  ou o script vai tentar navegar por nome (menos confiável).\n")

# ─── HOTMART AUTOMATION ────────────────────────────────────────────────────────

def hotmart_login(page: Page, vault: dict):
    print("\n  Abrindo Hotmart...")
    page.goto("https://app.hotmart.com/user/login")
    page.wait_for_load_state("domcontentloaded")

    try:
        page.get_by_label("E-mail").fill(vault["email"])
    except Exception:
        page.locator("input[type='email'], input[name='email']").first.fill(vault["email"])

    try:
        page.get_by_label("Senha").fill(vault["password"])
    except Exception:
        page.locator("input[type='password']").first.fill(vault["password"])

    page.keyboard.press("Enter")

    print("  Aguardando login... (resolva 2FA/captcha se aparecer)")
    try:
        page.wait_for_url("**hotmart.com/**", timeout=120_000)
        page.wait_for_load_state("networkidle", timeout=30_000)
    except Exception:
        pass

    if "login" in page.url:
        print("\n  [PAUSA] Login não completou automaticamente.")
        input("  Faça login manualmente e pressione Enter para continuar...")

    print("  Login OK")


def navigate_to_course(page: Page, vault: dict):
    product_url = vault.get("product_url", "")
    if not product_url or "SEU_PRODUCT_ID" in product_url:
        print("\n  [AVISO] product_url não configurado no vault.yaml.")
        input("  Navegue manualmente até a página de conteúdo do curso e pressione Enter...")
        return

    print(f"\n  Abrindo curso: {product_url}")
    page.goto(product_url)
    page.wait_for_load_state("networkidle", timeout=30_000)
    print("  Página do curso carregada")


def find_lesson_page(page: Page, task: dict) -> bool:
    """
    Navega até a página de edição da aula.
    Retorna True se chegou, False se não encontrou.
    """
    url = task["lesson_url"]
    if url:
        page.goto(url)
        page.wait_for_load_state("networkidle", timeout=30_000)
        return True

    # Tenta encontrar pelo nome da aula na página atual
    try:
        link = page.get_by_text(task["aula_nome"], exact=False).first
        link.click()
        page.wait_for_load_state("networkidle", timeout=15_000)
        return True
    except Exception:
        return False


def upload_video(page: Page, video_path: Path):
    """Faz upload do arquivo de vídeo na página de edição da aula."""
    print(f"    Enviando vídeo: {video_path.name}")
    try:
        # Hotmart geralmente tem um botão "Upload" ou input file
        with page.expect_file_chooser(timeout=10_000) as fc_info:
            # Tenta botão de upload por texto
            try:
                page.get_by_text("Upload", exact=False).first.click()
            except Exception:
                # Fallback: clica no input file diretamente
                page.locator("input[type='file']").first.click()
        fc_info.value.set_files(str(video_path))
        print(f"    Vídeo enviado (processamento pode demorar)")
    except Exception as e:
        print(f"    [AVISO] Não foi possível fazer upload automático: {e}")
        print(f"    Upload manual: {video_path}")
        input("    Faça o upload manualmente e pressione Enter para continuar...")


def upload_thumbnail(page: Page, thumb_path: Path):
    """Faz upload da thumbnail na página de edição da aula."""
    print(f"    Enviando thumbnail: {thumb_path.name}")
    try:
        # Hotmart: botão de capa/thumbnail geralmente contém "Capa" ou "Imagem"
        with page.expect_file_chooser(timeout=10_000) as fc_info:
            try:
                page.get_by_text("Capa", exact=False).first.click()
            except Exception:
                try:
                    page.get_by_text("Imagem", exact=False).first.click()
                except Exception:
                    page.locator("input[type='file'][accept*='image']").first.click()
        fc_info.value.set_files(str(thumb_path))
        print(f"    Thumbnail enviada")
    except Exception as e:
        print(f"    [AVISO] Thumbnail manual: {e}")
        print(f"    Arquivo: {thumb_path}")


def set_descricao(page: Page, descricao: str):
    """Preenche e salva a descrição da aula."""
    print(f"    Preenchendo descrição...")
    try:
        # Tenta campo de texto editável (pode ser textarea ou contenteditable)
        field = page.locator(
            "textarea:visible, [contenteditable='true']:visible"
        ).first
        field.click()
        field.fill(descricao)

        # Salvar
        try:
            page.get_by_role("button", name="Salvar").click()
            page.wait_for_timeout(1500)
        except Exception:
            try:
                page.keyboard.press("Control+s")
            except Exception:
                pass

        print(f"    Descrição salva")
    except Exception as e:
        print(f"    [AVISO] Não foi possível preencher descrição automaticamente: {e}")
        print(f"    Texto para copiar:\n---\n{descricao}\n---")


def process_task(page: Page, task: dict, so_descricoes: bool):
    print(f"\n  >> {task['aula_nome']}")

    # Navegar até a aula
    if not find_lesson_page(page, task):
        print(f"    [AVISO] Aula não encontrada na Hotmart — pulando")
        print(f"    Preencha hotmart_lesson_url no config.yaml para esta aula")
        return

    # Upload de vídeo
    if not so_descricoes and task["video_path"]:
        upload_video(page, task["video_path"])

    # Upload de thumbnail
    if not so_descricoes and task["thumb_path"]:
        upload_thumbnail(page, task["thumb_path"])

    # Descrição
    if task["descricao"]:
        set_descricao(page, task["descricao"])

    print(f"    OK")

# ─── MAIN ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Course Publisher — Expert360 → Hotmart"
    )
    parser.add_argument("--modulo", help="Processar só um módulo (ex: M0, M1, modulo-orientacoes)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Mostrar plano sem abrir browser")
    parser.add_argument("--so-descricoes", action="store_true",
                        help="Só preencher descrições (sem upload de vídeo/thumbnail)")
    parser.add_argument("--so-com-video", action="store_true",
                        help="Processar só aulas que já têm vídeo pronto")
    args = parser.parse_args()

    print("\n=== COURSE PUBLISHER — Expert360 ===")

    modules   = load_config()
    descricoes = parse_descricoes()

    # Filtrar módulo específico
    if args.modulo:
        modules = [m for m in modules if m["id"].upper() == args.modulo.upper()]
        if not modules:
            print(f"[ERRO] Módulo '{args.modulo}' não encontrado no config.yaml")
            sys.exit(1)

    tasks = build_plan(modules, descricoes)

    # Filtrar só aulas com vídeo pronto
    if args.so_com_video:
        tasks = [t for t in tasks if t["video_path"]]

    if args.dry_run:
        print("\n  [DRY-RUN — nenhuma alteração será feita]\n")
        print_plan(tasks, so_descricoes=args.so_descricoes)
        return

    if not tasks:
        print("Nenhuma aula encontrada com os filtros aplicados.")
        return

    print_plan(tasks, so_descricoes=args.so_descricoes)

    vault = load_vault()

    confirmar = input("Iniciar upload? (s/n): ").strip().lower()
    if confirmar != "s":
        print("Cancelado.")
        return

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=300)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page    = context.new_page()

        try:
            hotmart_login(page, vault)
            navigate_to_course(page, vault)

            modulo_atual = None
            for task in tasks:
                if task["modulo_id"] != modulo_atual:
                    modulo_atual = task["modulo_id"]
                    print(f"\n{'='*55}")
                    print(f"  {task['modulo_nome']}")
                    print(f"{'='*55}")

                process_task(page, task, so_descricoes=args.so_descricoes)

            print("\n\n  Processo concluído.")
            input("  Pressione Enter para fechar o browser...")

        except KeyboardInterrupt:
            print("\n\nInterrompido.")
        finally:
            browser.close()


if __name__ == "__main__":
    main()
