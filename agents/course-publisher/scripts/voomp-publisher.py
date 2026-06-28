"""
Voomp Publisher — Automação Voomp Play para Expert360
Incubadora de Expert | Karol Senna

Cria aulas e faz upload de vídeos, thumbnails e descrições no Voomp Play.

Uso:
    python voomp-publisher.py --dry-run              # ver plano sem abrir browser
    python voomp-publisher.py --modulo M0            # só M0
    python voomp-publisher.py                        # todos os módulos com vídeo pronto
    python voomp-publisher.py --so-descricoes        # só descrições
    python voomp-publisher.py --criar-aulas          # criar aulas (sem upload de vídeo)
"""

import sys
import yaml
import argparse
from pathlib import Path
from playwright.sync_api import sync_playwright, Page

# ─── PATHS ────────────────────────────────────────────────────────────────────

SCRIPT_DIR   = Path(__file__).resolve().parent
AGENT_DIR    = SCRIPT_DIR.parent
PROJECT_ROOT = AGENT_DIR.parent.parent

DATA_DIR      = AGENT_DIR / "data"
VAULT_PATH    = DATA_DIR / "vault.yaml"
CONFIG_PATH   = DATA_DIR / "config.yaml"

PRODUCAO_BASE = PROJECT_ROOT / "business" / "producao" / "expert360"
THUMBS_DIR    = PRODUCAO_BASE / "assets" / "thumbnails"
DESCRICOES_MD = PRODUCAO_BASE / "descricoes.md"

VOOMP_BASE = "https://app.voompplay.com.br"

# ─── VAULT ────────────────────────────────────────────────────────────────────

def load_vault() -> dict:
    if not VAULT_PATH.exists():
        print(f"\n[ERRO] vault.yaml não encontrado em {VAULT_PATH}")
        sys.exit(1)
    with open(VAULT_PATH, "r", encoding="utf-8") as f:
        v = yaml.safe_load(f)
    voomp = v.get("voomp", {})
    if not voomp.get("email"):
        print("[ERRO] Credenciais Voomp não encontradas no vault.yaml"); sys.exit(1)
    return voomp

# ─── CONFIG ────────────────────────────────────────────────────────────────────

def load_config() -> list:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)["modules"]

# ─── DESCRIÇÕES ────────────────────────────────────────────────────────────────

def parse_descricoes() -> dict:
    descricoes: dict = {}
    current_modulo = None
    current_slug   = None
    buffer: list   = []

    with open(DESCRICOES_MD, "r", encoding="utf-8") as f:
        for raw_line in f:
            line = raw_line.rstrip()
            if line.startswith("## "):
                if current_slug and current_modulo is not None:
                    descricoes[current_modulo][current_slug] = "\n".join(b for b in buffer if b).strip()
                    buffer = []
                    current_slug = None
                current_modulo = line[3:].strip()
                descricoes[current_modulo] = {}
            elif line.startswith("### "):
                if current_slug and current_modulo is not None:
                    descricoes[current_modulo][current_slug] = "\n".join(b for b in buffer if b).strip()
                    buffer = []
                current_slug = line[4:].strip()
            elif current_slug is not None and line not in ("---", ""):
                buffer.append(line)

    if current_slug and current_modulo is not None:
        descricoes[current_modulo][current_slug] = "\n".join(b for b in buffer if b).strip()

    return descricoes

# ─── PLANO ────────────────────────────────────────────────────────────────────

def build_plan(modules: list, descricoes: dict) -> list:
    tasks = []
    for mod in modules:
        mod_id = mod["id"]
        voomp_module_id = mod.get("voomp_module_id", "")

        for lesson in mod["lessons"]:
            slug       = lesson["descricao_slug"]
            video_file = lesson.get("video")

            video_path = None
            if video_file:
                candidate = PRODUCAO_BASE / mod_id / video_file
                if candidate.exists():
                    video_path = candidate

            thumb_path = THUMBS_DIR / f"{mod_id}-{slug}.png"
            if not thumb_path.exists():
                thumb_path = None

            tasks.append({
                "modulo_id":       mod_id,
                "modulo_nome":     mod.get("hotmart_name", mod_id),
                "voomp_module_id": voomp_module_id,
                "aula_nome":       lesson["hotmart_name"],
                "video_path":      video_path,
                "thumb_path":      thumb_path,
                "descricao":       descricoes.get(mod_id, {}).get(slug, ""),
            })
    return tasks

# ─── DRY-RUN ──────────────────────────────────────────────────────────────────

def print_plan(tasks: list, so_descricoes: bool = False):
    modulo_atual = None
    total_videos = 0
    total_sem_video = 0
    sem_module_id = set()

    for t in tasks:
        if t["modulo_id"] != modulo_atual:
            modulo_atual = t["modulo_id"]
            mid = t["voomp_module_id"] or "SEM ID"
            print(f"\n  [{modulo_atual}] {t['modulo_nome']}  (voomp_module_id: {mid})")

            if not t["voomp_module_id"]:
                sem_module_id.add(modulo_atual)

        if not so_descricoes:
            if t["video_path"]:
                v_status = f"VIDEO={t['video_path'].name}"
                total_videos += 1
            else:
                v_status = "VIDEO=[pendente]"
                total_sem_video += 1
        else:
            v_status = ""

        thumb  = "THUMB=OK" if t["thumb_path"] else "THUMB=[ausente]"
        desc   = "DESC=OK"  if t["descricao"]  else "DESC=[vazia]"

        print(f"    • {t['aula_nome']}")
        parts = [p for p in [v_status, thumb, desc] if p]
        print(f"      {' | '.join(parts)}")

    print()
    if not so_descricoes:
        print(f"  Vídeos prontos:   {total_videos}")
        print(f"  Vídeos pendentes: {total_sem_video}")

    if sem_module_id:
        print(f"\n  ATENÇÃO: módulos sem voomp_module_id no config.yaml: {sem_module_id}")
        print(f"  Crie os módulos na Voomp e adicione os IDs ao config.yaml.\n")

# ─── LOGIN ────────────────────────────────────────────────────────────────────

def voomp_login(page: Page, vault: dict):
    print("\n  Abrindo Voomp Play...")
    login_url = vault.get("login_url", f"{VOOMP_BASE}/login")
    page.goto(login_url)
    page.wait_for_load_state("domcontentloaded", timeout=30_000)

    # Tentar preencher email e senha automaticamente
    try:
        page.locator("input[type='email'], input[name='email'], input[placeholder*='mail']").first.fill(vault["email"])
        page.locator("input[type='password']").first.fill(vault["password"])
        page.keyboard.press("Enter")
        page.wait_for_load_state("networkidle", timeout=20_000)
        print("  Login enviado automaticamente")
    except Exception:
        print("  [PAUSA] Preencha o login manualmente no browser.")

    # Verificar se entrou
    if "login" in page.url or "signin" in page.url:
        input("  Faça login manualmente e pressione Enter quando estiver dentro...")
    else:
        print("  Login OK")

# ─── CRIAÇÃO DE AULA ──────────────────────────────────────────────────────────

def navigate_to_lesson_page(page: Page, vault: dict, voomp_module_id: str):
    course_id = vault.get("course_id", "")
    url = f"{VOOMP_BASE}/config_curso/{course_id}/module/{voomp_module_id}/lesson"
    page.goto(url)
    page.wait_for_load_state("networkidle", timeout=20_000)


def fill_lesson_form(page: Page, task: dict, so_descricoes: bool):
    """Preenche o formulário de criação de aula na Voomp."""
    aula_nome = task["aula_nome"]
    print(f"\n  >> {aula_nome}")

    # Clicar em "Clique e adicione uma Aula" se aparecer (nova aula)
    try:
        add_btn = page.get_by_text("Clique e adicione uma Aula", exact=False).first
        if add_btn.is_visible():
            add_btn.click()
            page.wait_for_timeout(1000)
    except Exception:
        pass

    # Nome da aula
    try:
        name_field = page.locator("input[placeholder='Nome da Aula'], input[placeholder*='ula']").first
        name_field.wait_for(state="visible", timeout=5000)
        name_field.click()
        name_field.fill(aula_nome)
        print(f"    Nome: OK")
    except Exception as e:
        print(f"    [AVISO] Nome manual necessário: {e}")
        input(f"    Preencha o nome '{aula_nome}' e pressione Enter...")

    # Upload de vídeo
    if not so_descricoes and task["video_path"]:
        try:
            with page.expect_file_chooser(timeout=8000) as fc_info:
                page.get_by_text("Clique e adicione um Vídeo", exact=False).first.click()
            fc_info.value.set_files(str(task["video_path"]))
            print(f"    Vídeo: enviando {task['video_path'].name}...")
        except Exception as e:
            print(f"    [AVISO] Upload de vídeo manual: {task['video_path']}")

    # Upload de thumbnail
    if task["thumb_path"]:
        try:
            with page.expect_file_chooser(timeout=8000) as fc_info:
                page.get_by_text("Clique e adicione uma Thumb", exact=False).first.click()
            fc_info.value.set_files(str(task["thumb_path"]))
            print(f"    Thumb: OK")
        except Exception as e:
            print(f"    [AVISO] Thumbnail manual: {task['thumb_path']}")

    # Descrição (rich text editor)
    if task["descricao"]:
        try:
            desc_field = page.locator(".ql-editor, [contenteditable='true']").first
            desc_field.wait_for(state="visible", timeout=5000)
            desc_field.click()
            desc_field.fill(task["descricao"])
            print(f"    Descrição: OK")
        except Exception as e:
            print(f"    [AVISO] Descrição manual necessária")

    # Salvar
    saved = False
    for btn_text in ["Salvar", "Criar", "Adicionar", "Confirmar"]:
        try:
            btn = page.get_by_role("button", name=btn_text)
            if btn.is_visible():
                btn.click()
                page.wait_for_timeout(2000)
                saved = True
                print(f"    Salvo ✓")
                break
        except Exception:
            continue

    if not saved:
        try:
            page.keyboard.press("Control+s")
            page.wait_for_timeout(1500)
            print(f"    Ctrl+S enviado")
        except Exception:
            print(f"    [AVISO] Salve manualmente e pressione Enter...")
            input("    Enter para continuar...")


# ─── MAIN ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Voomp Publisher — Expert360")
    parser.add_argument("--modulo", help="Processar só um módulo (ex: M0)")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--so-descricoes", action="store_true")
    parser.add_argument("--so-com-video", action="store_true")
    args = parser.parse_args()

    print("\n=== VOOMP PUBLISHER — Expert360 ===")

    modules    = load_config()
    descricoes = parse_descricoes()

    # Filtrar só módulos com voomp_module_id
    modules = [m for m in modules if m.get("voomp_module_id")]

    if args.modulo:
        modules = [m for m in modules if m["id"].upper() == args.modulo.upper()]
        if not modules:
            print(f"[ERRO] Módulo '{args.modulo}' não encontrado ou sem voomp_module_id")
            sys.exit(1)

    tasks = build_plan(modules, descricoes)

    if args.so_com_video:
        tasks = [t for t in tasks if t["video_path"]]

    if args.dry_run:
        print("\n  [DRY-RUN — nenhuma alteração será feita]\n")
        print_plan(tasks, so_descricoes=args.so_descricoes)
        return

    if not tasks:
        print("Nenhuma aula encontrada.")
        return

    print_plan(tasks, so_descricoes=args.so_descricoes)

    vault = load_vault()
    confirmar = input("Iniciar? (s/n): ").strip().lower()
    if confirmar != "s":
        print("Cancelado.")
        return

    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(
            user_data_dir=r"C:\Users\karol\AppData\Local\voomp-publisher-profile",
            channel="chrome",
            headless=False,
            slow_mo=300,
            viewport={"width": 1440, "height": 900},
        )
        page = context.new_page()

        try:
            voomp_login(page, vault)

            modulo_atual = None
            for task in tasks:
                if task["modulo_id"] != modulo_atual:
                    modulo_atual = task["modulo_id"]
                    print(f"\n{'='*55}")
                    print(f"  {task['modulo_nome']}")
                    print(f"{'='*55}")
                    navigate_to_lesson_page(page, vault, task["voomp_module_id"])
                    page.wait_for_timeout(1500)

                fill_lesson_form(page, task, so_descricoes=args.so_descricoes)

            print("\n\n  Processo concluído.")
            input("  Pressione Enter para fechar o browser...")

        except KeyboardInterrupt:
            print("\n\nInterrompido.")
        finally:
            context.close()


if __name__ == "__main__":
    main()
