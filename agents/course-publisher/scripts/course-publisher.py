"""
Course Publisher — Automação Hotmart para Expert360
Incubadora de Expert | Karol Senna

Faz upload de vídeos, thumbnails e descrições para a área de membros da Hotmart.
Roda em modo visível (headless=False) para suportar 2FA e intervenções manuais.

Uso:
    python course-publisher.py --dry-run                    # ver plano sem abrir browser
    python course-publisher.py --modulo M0                  # só M0
    python course-publisher.py                              # todos os módulos com vídeo pronto
    python course-publisher.py --so-descricoes              # só descrições (sem upload de vídeo)
    python course-publisher.py --criar-estrutura            # criar módulos e aulas na Hotmart
    python course-publisher.py --criar-estrutura --modulo M0  # criar só o M0
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

def load_config_raw() -> dict:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def save_config_raw(data: dict):
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        yaml.dump(data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)

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

    if current_slug and current_modulo is not None:
        descricoes[current_modulo][current_slug] = _clean_buffer(buffer)

    return descricoes


def _clean_buffer(buf: list) -> str:
    return "\n".join(l for l in buf if l).strip()

# ─── PLANO ────────────────────────────────────────────────────────────────────

def build_plan(modules: list, descricoes: dict) -> list:
    tasks = []
    for mod in modules:
        mod_id = mod["id"]
        for lesson in mod["lessons"]:
            slug = lesson["descricao_slug"]
            video_file = lesson.get("video")

            video_path = None
            if video_file:
                candidate = PRODUCAO_BASE / mod_id / video_file
                if candidate.exists():
                    video_path = candidate

            thumb_path = THUMBS_DIR / f"{mod_id}-{slug}.png"
            if not thumb_path.exists():
                thumb_path = None

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
        print(f"  Use --criar-estrutura para criar os módulos e capturar as URLs automaticamente.\n")

# ─── HOTMART LOGIN / NAVEGAÇÃO ────────────────────────────────────────────────

def hotmart_login(page: Page, vault: dict):
    print("\n  Abrindo Hotmart...")
    page.goto("https://app.hotmart.com/user/login")
    page.wait_for_load_state("domcontentloaded")

    print("\n  Faça login manualmente no browser:")
    print(f"  Email: {vault['email']}")
    print("  (preencha email, senha e 2FA no browser)")
    input("\n  Pressione Enter aqui quando estiver logada e na tela principal do Hotmart...")

    print("  Login OK")


def navigate_to_modules_page(page: Page, vault: dict):
    product_url = vault.get("product_url", "")
    if not product_url or "SEU_PRODUCT_ID" in product_url:
        print("\n  [AVISO] product_url não configurado no vault.yaml.")
        input("  Navegue manualmente até a página de módulos do curso e pressione Enter...")
        return

    print(f"\n  Abrindo página de módulos: {product_url}")
    page.goto(product_url)
    page.wait_for_load_state("networkidle", timeout=30_000)
    print("  Página de módulos carregada")

# ─── CRIAÇÃO DE ESTRUTURA ─────────────────────────────────────────────────────

def _try_click(page: Page, strategies: list) -> bool:
    """Tenta cada estratégia de clique em sequência. Retorna True se alguma funcionou."""
    for fn in strategies:
        try:
            fn()
            page.wait_for_timeout(1200)
            return True
        except Exception:
            continue
    return False


def create_hotmart_module(page: Page, mod_name: str) -> bool:
    """Cria um módulo na Hotmart. Retorna True se criado."""
    print(f"\n  Criando módulo: {mod_name}")

    clicked = _try_click(page, [
        lambda: page.get_by_role("button", name="Adicionar módulo").click(),
        lambda: page.get_by_role("button", name="Nova seção").click(),
        lambda: page.get_by_role("button", name="Novo módulo").click(),
        lambda: page.get_by_text("Adicionar módulo", exact=False).first.click(),
        lambda: page.get_by_text("Nova seção", exact=False).first.click(),
        lambda: page.get_by_text("Novo módulo", exact=False).first.click(),
        lambda: page.locator("[data-testid*='add-module'], [data-testid*='new-module']").first.click(),
        lambda: page.locator("button:has-text('módulo'), button:has-text('seção')").first.click(),
    ])

    if not clicked:
        print(f"  [PAUSA] Não encontrei o botão 'Adicionar módulo'.")
        input(f"  Clique em 'Adicionar módulo/seção' manualmente e pressione Enter...")

    # Preencher nome
    name_filled = False
    try:
        field = page.locator("input[type='text']:visible").first
        field.wait_for(state="visible", timeout=5000)
        field.click()
        field.fill(mod_name)
        page.wait_for_timeout(400)
        name_filled = True
    except Exception:
        print(f"  [PAUSA] Preencha o nome '{mod_name}' manualmente.")
        input("  Pressione Enter quando preencher...")
        return True

    if name_filled:
        confirmed = _try_click(page, [
            lambda: page.get_by_role("button", name="Salvar").click(),
            lambda: page.get_by_role("button", name="Criar").click(),
            lambda: page.get_by_role("button", name="Confirmar").click(),
            lambda: page.get_by_role("button", name="Adicionar").click(),
            lambda: page.keyboard.press("Enter"),
        ])
        if not confirmed:
            print(f"  [PAUSA] Confirme a criação do módulo manualmente.")
            input("  Pressione Enter após confirmar...")

    page.wait_for_timeout(1500)
    print(f"  Módulo '{mod_name}' criado")
    return True


def create_hotmart_lesson(page: Page, lesson_name: str, mod_name: str) -> str:
    """Cria uma aula dentro do módulo e retorna a URL de edição."""
    print(f"    Criando aula: {lesson_name}")

    # Tentar clicar no botão de adicionar aula dentro do módulo correto
    clicked = _try_click(page, [
        # Estratégias específicas ao módulo: encontra o módulo e clica no "+" próximo
        lambda: page.locator(f"[data-testid*='add-lesson'], [aria-label*='aula']").last.click(),
        lambda: page.get_by_role("button", name="Adicionar aula").last.click(),
        lambda: page.get_by_role("button", name="Nova aula").last.click(),
        lambda: page.get_by_text("Adicionar aula", exact=False).last.click(),
        lambda: page.get_by_text("Nova aula", exact=False).last.click(),
        lambda: page.get_by_text("Adicionar conteúdo", exact=False).last.click(),
        lambda: page.locator("button:has-text('aula')").last.click(),
    ])

    if not clicked:
        print(f"    [PAUSA] Clique em 'Adicionar aula' dentro do módulo '{mod_name}'.")
        input("    Pressione Enter quando clicar...")

    # Selecionar tipo Vídeo se aparecer menu de tipo
    page.wait_for_timeout(800)
    _try_click(page, [
        lambda: page.get_by_text("Vídeo", exact=True).first.click(),
        lambda: page.get_by_role("option", name="Vídeo").click(),
        lambda: page.locator("[data-type='video'], [value='video']").first.click(),
    ])
    page.wait_for_timeout(600)

    # Preencher título
    name_filled = False
    try:
        field = page.locator(
            "input[type='text']:visible, input[placeholder*='ítulo']:visible, input[placeholder*='ome']:visible"
        ).first
        field.wait_for(state="visible", timeout=5000)
        field.click()
        field.fill(lesson_name)
        page.wait_for_timeout(400)
        name_filled = True
    except Exception:
        print(f"    [PAUSA] Preencha o título '{lesson_name}' manualmente.")
        input("    Pressione Enter quando preencher...")

    if name_filled:
        _try_click(page, [
            lambda: page.get_by_role("button", name="Salvar").click(),
            lambda: page.get_by_role("button", name="Criar").click(),
            lambda: page.get_by_role("button", name="Adicionar").click(),
            lambda: page.get_by_role("button", name="Confirmar").click(),
            lambda: page.keyboard.press("Enter"),
        ])

    page.wait_for_timeout(2000)

    # Capturar URL de edição da aula
    url = _capture_lesson_url(page, lesson_name)
    return url


def _capture_lesson_url(page: Page, lesson_name: str) -> str:
    """Tenta capturar a URL de edição da aula. Fallback: input manual."""
    page.wait_for_timeout(1000)

    # Tenta navegar até a aula pelo nome para abrir edição
    try:
        lesson_el = page.get_by_text(lesson_name, exact=True).first
        lesson_el.click()
        page.wait_for_load_state("networkidle", timeout=10_000)
        url = page.url
        if url and ("edit" in url or "lesson" in url or "content" in url or "aula" in url):
            print(f"      URL: {url}")
            return url
    except Exception:
        pass

    # Tentar ícone de edição (lápis) próximo ao nome da aula
    try:
        edit_btn = page.locator(
            f"[title='Editar'], [aria-label='Editar'], button[data-testid*='edit']"
        ).last
        edit_btn.click()
        page.wait_for_load_state("networkidle", timeout=10_000)
        url = page.url
        if url:
            print(f"      URL: {url}")
            return url
    except Exception:
        pass

    # Fallback manual
    print(f"      [PAUSA] Não consegui capturar URL de '{lesson_name}' automaticamente.")
    print(f"      Clique na aula para abrir a edição e copie a URL do browser.")
    url = input(f"      Cole aqui (ou Enter para pular): ").strip()
    return url


def save_lesson_urls_to_config(lesson_urls: dict):
    """
    Salva as URLs das aulas no config.yaml.
    lesson_urls: {mod_id: {lesson_hotmart_name: url}}
    """
    raw = load_config_raw()
    total = 0

    for mod in raw["modules"]:
        mod_id = mod["id"]
        if mod_id not in lesson_urls:
            continue
        for lesson in mod["lessons"]:
            aula_name = lesson["hotmart_name"]
            url = lesson_urls[mod_id].get(aula_name, "")
            if url:
                lesson["hotmart_lesson_url"] = url
                total += 1

    save_config_raw(raw)
    print(f"\n  config.yaml atualizado com {total} URLs de aula")


def create_all_modules(page: Page, modules: list, vault: dict):
    """Cria toda a estrutura de módulos e aulas na Hotmart."""

    navigate_to_modules_page(page, vault)
    product_url = vault.get("product_url", "")

    lesson_urls: dict = {}

    for mod in modules:
        mod_id   = mod["id"]
        mod_name = mod["hotmart_name"]

        print(f"\n{'='*55}")
        print(f"  MÓDULO {mod_id}: {mod_name}")
        print(f"{'='*55}")

        lesson_urls[mod_id] = {}

        # Voltar para página de módulos antes de cada módulo novo
        if product_url and "SEU_PRODUCT_ID" not in product_url:
            page.goto(product_url)
            page.wait_for_load_state("networkidle", timeout=20_000)

        # Criar o módulo
        create_hotmart_module(page, mod_name)

        # Criar cada aula
        for lesson in mod["lessons"]:
            lesson_name = lesson["hotmart_name"]

            # Garantir que estamos na página do módulo antes de cada aula
            if product_url and "SEU_PRODUCT_ID" not in product_url:
                page.goto(product_url)
                page.wait_for_load_state("networkidle", timeout=15_000)

            url = create_hotmart_lesson(page, lesson_name, mod_name)
            lesson_urls[mod_id][lesson_name] = url

    # Salvar no config.yaml
    save_lesson_urls_to_config(lesson_urls)

    # Relatório final
    print(f"\n{'='*55}")
    print(f"  ESTRUTURA CRIADA — RELATÓRIO")
    print(f"{'='*55}")

    sem_url = 0
    for mod_id, lessons in lesson_urls.items():
        print(f"\n  [{mod_id}]")
        for name, url in lessons.items():
            if url:
                print(f"    ✓ {name}")
            else:
                print(f"    ✗ {name}  ← URL não capturada")
                sem_url += 1

    if sem_url:
        print(f"\n  ATENÇÃO: {sem_url} aulas sem URL. Preencha hotmart_lesson_url no config.yaml.")
    else:
        print(f"\n  Tudo certo. Próximo passo: upload dos vídeos.")
        print(f"  Execute: python course-publisher.py --modulo M0")

# ─── UPLOAD DE CONTEÚDO ────────────────────────────────────────────────────────

def navigate_to_course(page: Page, vault: dict):
    navigate_to_modules_page(page, vault)


def find_lesson_page(page: Page, task: dict) -> bool:
    url = task["lesson_url"]
    if url:
        page.goto(url)
        page.wait_for_load_state("networkidle", timeout=30_000)
        return True

    try:
        link = page.get_by_text(task["aula_nome"], exact=False).first
        link.click()
        page.wait_for_load_state("networkidle", timeout=15_000)
        return True
    except Exception:
        return False


def upload_video(page: Page, video_path: Path):
    print(f"    Enviando vídeo: {video_path.name}")
    try:
        with page.expect_file_chooser(timeout=10_000) as fc_info:
            try:
                page.get_by_text("Upload", exact=False).first.click()
            except Exception:
                page.locator("input[type='file']").first.click()
        fc_info.value.set_files(str(video_path))
        print(f"    Vídeo enviado (processamento pode demorar)")
    except Exception as e:
        print(f"    [AVISO] Não foi possível fazer upload automático: {e}")
        print(f"    Upload manual: {video_path}")
        input("    Faça o upload manualmente e pressione Enter para continuar...")


def upload_thumbnail(page: Page, thumb_path: Path):
    print(f"    Enviando thumbnail: {thumb_path.name}")
    try:
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
    print(f"    Preenchendo descrição...")
    try:
        field = page.locator(
            "textarea:visible, [contenteditable='true']:visible"
        ).first
        field.click()
        field.fill(descricao)

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

    if not find_lesson_page(page, task):
        print(f"    [AVISO] Aula não encontrada na Hotmart — pulando")
        print(f"    Preencha hotmart_lesson_url no config.yaml para esta aula")
        return

    if not so_descricoes and task["video_path"]:
        upload_video(page, task["video_path"])

    if not so_descricoes and task["thumb_path"]:
        upload_thumbnail(page, task["thumb_path"])

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
    parser.add_argument("--criar-estrutura", action="store_true",
                        help="Criar módulos e aulas na Hotmart (captura URLs e salva no config.yaml)")
    args = parser.parse_args()

    print("\n=== COURSE PUBLISHER — Expert360 ===")

    modules    = load_config()
    descricoes = parse_descricoes()

    # Filtrar módulo específico
    if args.modulo:
        modules = [m for m in modules if m["id"].upper() == args.modulo.upper()]
        if not modules:
            print(f"[ERRO] Módulo '{args.modulo}' não encontrado no config.yaml")
            sys.exit(1)

    # ── MODO: CRIAR ESTRUTURA ─────────────────────────────────────────────────
    if args.criar_estrutura:
        modulos_str = args.modulo.upper() if args.modulo else "TODOS"
        print(f"\n  Modo: CRIAR ESTRUTURA — {modulos_str}")
        print(f"  Módulos a criar: {[m['hotmart_name'] for m in modules]}")

        vault = load_vault()
        confirmar = input("\n  Iniciar criação de módulos na Hotmart? (s/n): ").strip().lower()
        if confirmar != "s":
            print("  Cancelado.")
            return

        print("\n  IMPORTANTE: Feche o Chrome completamente antes de continuar.")
        input("  Pressione Enter quando o Chrome estiver fechado...")

        with sync_playwright() as p:
            context = p.chromium.launch_persistent_context(
                user_data_dir=r"C:\Users\karol\AppData\Local\hotmart-publisher-profile",
                channel="chrome",
                headless=False,
                slow_mo=400,
                viewport={"width": 1440, "height": 900},
            )
            page = context.new_page()

            try:
                hotmart_login(page, vault)
                create_all_modules(page, modules, vault)
                print("\n\n  Estrutura criada.")
                input("  Pressione Enter para fechar o browser...")
            except KeyboardInterrupt:
                print("\n\nInterrompido.")
            finally:
                context.close()
        return

    # ── MODO: UPLOAD ──────────────────────────────────────────────────────────
    tasks = build_plan(modules, descricoes)

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

    print("\n  IMPORTANTE: Feche o Chrome completamente antes de continuar.")
    input("  Pressione Enter quando o Chrome estiver fechado...")

    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(
            user_data_dir=r"C:\Users\karol\AppData\Local\Google\Chrome\User Data",
            channel="chrome",
            headless=False,
            slow_mo=300,
            args=["--start-maximized"],
            no_viewport=True,
        )
        page = context.new_page()

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
            context.close()


if __name__ == "__main__":
    main()
