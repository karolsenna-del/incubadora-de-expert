#!/usr/bin/env python3
"""
install.py — setup cross-platform do Squad Edicao Arcane (macOS / Windows / Linux).

Instalador UNICO em Python (substitui o antigo install.sh Mac-only). Idempotente:
pode rodar de novo sem quebrar. Cada etapa degrada com mensagem clara em vez de
abortar o processo inteiro — no fim roda o doctor.py pra dar o veredito.

Provisiona:
  - ffmpeg (com drawtext + sidechaincompress)  -> brew (Mac) / winget (Windows)
  - whisper-cli (whisper.cpp)                  -> brew (Mac) / release GitHub (Windows)
  - modelo ggml-medium.bin (~1.5GB)            -> download direto
  - venv local + pacotes (silero-vad, torch, opencv, ...) -> escolhe Python compativel
  - fontes (so no Mac, pro font= por nome; no Windows a legenda usa fontfile embarcado)
  - wrapper do slash command /auroq-squad-edicao-arcane

Uso:  python install.py      (ou os shims: bash install.sh / powershell install.ps1)
"""
import os, sys, subprocess, shutil, urllib.request, zipfile, tempfile

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "scripts"))
import _common

SQUAD_DIR = _common.SQUAD_DIR
IS_WINDOWS = _common.IS_WINDOWS
IS_MAC = _common.IS_MAC
LOCAL_BIN = _common.LOCAL_BIN_DIR

MODEL_URL = "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.bin"
MODEL_SIZE = _common.MODEL_SIZE  # bytes esperados do ggml-medium.bin (detecta download incompleto)
# release prebuilt do whisper.cpp pro Windows (contem whisper-cli.exe + dlls ggml).
# Pinado numa versao que TEM o asset whisper-bin-x64.zip (o v1.7.4 antigo dava 404).
WHISPER_WIN_URL = "https://github.com/ggml-org/whisper.cpp/releases/download/v1.9.1/whisper-bin-x64.zip"
PIP_PACKAGES = ["silero-vad", "torch", "torchaudio", "scipy", "numpy",
                "fonttools", "pyyaml", "opencv-python-headless"]

WARNINGS = []


def hr():
    print("=" * 55)


def have(name):
    return shutil.which(name) is not None


def ffmpeg_has(filt):
    try:
        out = subprocess.run([_common.ffmpeg(), "-hide_banner", "-filters"],
            capture_output=True, text=True).stdout
        return filt in out
    except Exception:
        return False


def download(url, dest, label):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    print(f"   baixando {label} ...")
    try:
        urllib.request.urlretrieve(url, dest)
        return True
    except Exception as e:
        print(f"   [!] falha ao baixar {label}: {e}")
        return False


def download_verified(url, dest, expected_size, label, tries=4):
    """Baixa com retomada (HTTP Range) e verificacao de tamanho. HuggingFace suporta
    Range, entao uma conexao que cai retoma de onde parou em vez de recomecar 1.5GB.
    So retorna True quando o arquivo final bate `expected_size` — evita o OK falso
    de arquivo truncado que o urlretrieve deixava passar."""
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    for attempt in range(1, tries + 1):
        have = os.path.getsize(dest) if os.path.exists(dest) else 0
        if have == expected_size:
            return True
        if have > expected_size:  # arquivo maior que o esperado = lixo, recomeca
            os.remove(dest)
            have = 0
        req = urllib.request.Request(url)
        if have:
            req.add_header("Range", f"bytes={have}-")
        try:
            print(f"   baixando {label} — {have // (1024*1024)}MB/{expected_size // (1024*1024)}MB (tentativa {attempt}/{tries})")
            with urllib.request.urlopen(req, timeout=60) as r:
                # se pedimos Range mas o servidor ignorou (200, nao 206), recomeca do zero
                resuming = have > 0 and getattr(r, "status", 200) == 206
                with open(dest, "ab" if resuming else "wb") as f:
                    while True:
                        chunk = r.read(1024 * 256)
                        if not chunk:
                            break
                        f.write(chunk)
        except Exception as e:
            print(f"   [!] queda no download ({e}) — vou retomar")
            continue
        if os.path.getsize(dest) == expected_size:
            return True
    return os.path.exists(dest) and os.path.getsize(dest) == expected_size


# ─────────────────────────────────────────────────────────────────────────────
# 1. ffmpeg
# ─────────────────────────────────────────────────────────────────────────────
def ensure_ffmpeg():
    print("\n[1/6] ffmpeg (com drawtext + sidechaincompress)")
    if have("ffmpeg") and ffmpeg_has("drawtext") and ffmpeg_has("sidechaincompress"):
        print("   OK — ffmpeg completo ja presente")
        return
    if IS_MAC:
        if not have("brew"):
            WARNINGS.append("Homebrew ausente — instale em https://brew.sh e rode de novo")
            print("   [!] Homebrew ausente. Veja https://brew.sh")
            return
        subprocess.run(["brew", "install", "ffmpeg"])
        if not ffmpeg_has("drawtext"):
            subprocess.run(["brew", "reinstall", "ffmpeg"])
    elif IS_WINDOWS:
        if have("winget"):
            print("   instalando via winget (Gyan.FFmpeg — build completo)...")
            subprocess.run(["winget", "install", "--id", "Gyan.FFmpeg", "-e",
                "--accept-source-agreements", "--accept-package-agreements"])
            print("   [i] se o ffmpeg nao aparecer no PATH agora, ABRA UM NOVO terminal e rode o install de novo")
        else:
            WARNINGS.append("winget ausente — instale o ffmpeg full manualmente (gyan.dev/ffmpeg) e ponha no PATH")
            print("   [!] winget ausente. Baixe o build 'full' em https://www.gyan.dev/ffmpeg/builds/ e adicione ao PATH")
    else:
        WARNINGS.append("Instale ffmpeg com libfreetype (ex: apt install ffmpeg)")
        print("   [!] Linux: instale ffmpeg pela sua distro (apt/dnf install ffmpeg)")


# ─────────────────────────────────────────────────────────────────────────────
# 2. whisper-cli
# ─────────────────────────────────────────────────────────────────────────────
def ensure_whisper():
    print("\n[2/6] whisper-cli (whisper.cpp)")
    if _common.find_bin("whisper-cli") != "whisper-cli" and (
            have("whisper-cli") or os.path.exists(os.path.join(LOCAL_BIN, "whisper-cli.exe"))):
        print("   OK — whisper-cli ja presente")
        return
    if IS_MAC:
        if have("brew"):
            subprocess.run(["brew", "install", "whisper-cpp"])
        else:
            WARNINGS.append("whisper-cpp: instale via brew (brew install whisper-cpp)")
    elif IS_WINDOWS:
        os.makedirs(LOCAL_BIN, exist_ok=True)
        zpath = os.path.join(tempfile.gettempdir(), "whisper-bin-x64.zip")
        if download(WHISPER_WIN_URL, zpath, "whisper.cpp (Windows)"):
            try:
                with zipfile.ZipFile(zpath) as z:
                    for m in z.namelist():
                        low = m.lower()
                        if low.endswith(".exe") or low.endswith(".dll"):
                            data = z.read(m)
                            open(os.path.join(LOCAL_BIN, os.path.basename(m)), "wb").write(data)
                # release novo ja traz whisper-cli.exe; release antigo traz main.exe
                cli = os.path.join(LOCAL_BIN, "whisper-cli.exe")
                mainexe = os.path.join(LOCAL_BIN, "main.exe")
                if not os.path.exists(cli) and os.path.exists(mainexe):
                    shutil.copy(mainexe, cli)
                if os.path.exists(cli):
                    print(f"   OK — whisper-cli em {cli}")
                else:
                    WARNINGS.append("whisper-cli.exe nao encontrado no zip — baixe manualmente de github.com/ggml-org/whisper.cpp/releases e ponha o exe em squad/bin/")
                    print("   [!] o zip nao trouxe whisper-cli.exe — ver instrucao no fim")
            except Exception as e:
                WARNINGS.append(f"falha ao extrair whisper.cpp: {e}")
                print(f"   [!] falha ao extrair: {e}")
        else:
            WARNINGS.append("download do whisper.cpp falhou — baixe de github.com/ggml-org/whisper.cpp/releases (asset whisper-bin-x64.zip) e ponha whisper-cli.exe em squad/bin/")
    else:
        WARNINGS.append("Linux: compile/instale whisper.cpp (whisper-cli) e ponha no PATH")


# ─────────────────────────────────────────────────────────────────────────────
# 3. modelo whisper
# ─────────────────────────────────────────────────────────────────────────────
def ensure_model():
    print("\n[3/6] modelo whisper medium (~1.5GB)")
    # no Mac guardamos no layout do brew se ele existir; senao no squad/models
    if IS_MAC and os.path.isdir("/opt/homebrew/share/whisper-cpp/models"):
        dest = "/opt/homebrew/share/whisper-cpp/models/ggml-medium.bin"
    else:
        dest = os.path.join(SQUAD_DIR, "models", "ggml-medium.bin")
    if os.path.isfile(dest) and os.path.getsize(dest) == MODEL_SIZE:
        print(f"   OK — modelo ja presente e completo ({dest})")
        return
    if download_verified(MODEL_URL, dest, MODEL_SIZE, "modelo ggml-medium.bin (1.5GB, demora)"):
        print(f"   OK — {dest}")
    else:
        got = os.path.getsize(dest) if os.path.exists(dest) else 0
        WARNINGS.append(f"modelo ggml-medium.bin incompleto ({got}/{MODEL_SIZE} bytes) — rode o install de novo (retoma de onde parou)")
        print(f"   [!] modelo incompleto ({got}/{MODEL_SIZE}) — idempotente: rode de novo pra retomar")


# ─────────────────────────────────────────────────────────────────────────────
# 4. venv + pacotes
# ─────────────────────────────────────────────────────────────────────────────
def _win_python313_paths():
    """Caminhos padrao onde o winget instala o python.exe do 3.13 (por-usuario e
    all-users). Retorna so os que existem em disco."""
    la = os.environ.get("LOCALAPPDATA", "")
    pf = os.environ.get("ProgramFiles", "")
    cands = []
    if la:
        cands.append(os.path.join(la, "Programs", "Python", "Python313", "python.exe"))
    if pf:
        cands.append(os.path.join(pf, "Python313", "python.exe"))
    return [c for c in cands if os.path.exists(c)]


def pick_venv_python():
    """Escolhe um Python compativel com torch (wheels ate ~3.13). Evita 3.14+."""
    def ver_ok(exe):
        try:
            out = subprocess.run([exe, "-c",
                "import sys;print(sys.version_info[0],sys.version_info[1])"],
                capture_output=True, text=True).stdout.split()
            return (int(out[0]), int(out[1]))
        except Exception:
            return None

    candidates = []
    if IS_WINDOWS:
        for v in ("3.13", "3.12", "3.11", "3.10"):
            candidates.append(["py", f"-{v}"])
    else:
        for name in ("python3.13", "python3.12", "python3.11", "python3.10", "python3"):
            if have(name):
                candidates.append([name])
    # tenta os candidatos preferidos
    for c in candidates:
        exe = c[0] if len(c) == 1 else None
        probe = c + ["-c", "print(1)"]
        try:
            if subprocess.run(probe, capture_output=True).returncode != 0:
                continue
        except Exception:
            continue
        v = ver_ok(c[0]) if len(c) == 1 else _launcher_ver(c)
        if v and v < (3, 14):
            return c

    # nenhum Python compativel encontrado — no Windows, instala o 3.13 sozinho
    # (mesmo caminho do ffmpeg via winget) pro aluno nao-dev nao bater numa parede
    if IS_WINDOWS and have("winget"):
        print("   nenhum Python <3.14 (compativel com torch) encontrado.")
        print("   instalando Python 3.13 via winget (Python.Python.3.13)...")
        subprocess.run(["winget", "install", "--id", "Python.Python.3.13", "-e",
            "--accept-source-agreements", "--accept-package-agreements"])
        # prefere o exe por caminho absoluto: o launcher 'py -3.13' as vezes so
        # enxerga a instalacao nova num terminal novo; o exe em disco funciona ja.
        for cand in _win_python313_paths():
            v = _launcher_ver([cand])
            if v and v < (3, 14):
                print(f"   OK — Python 3.13 instalado ({cand})")
                return [cand]
        v = _launcher_ver(["py", "-3.13"])
        if v and v < (3, 14):
            print("   OK — Python 3.13 instalado (via launcher)")
            return ["py", "-3.13"]
        WARNINGS.append("Python 3.13 instalado via winget, mas nao localizei o exe nesta sessao — ABRA UM NOVO terminal e rode o install de novo")
        print("   [!] instalado, mas precisa de um NOVO terminal pra ser localizado — reabra e rode o install de novo")
    elif IS_WINDOWS:
        WARNINGS.append("Python compativel (<3.14) ausente e sem winget — instale Python 3.13 (python.org) e rode de novo")

    # fallback: o proprio interpretador que roda o install
    cur = (sys.version_info[0], sys.version_info[1])
    if cur >= (3, 14):
        WARNINGS.append(f"Python {cur[0]}.{cur[1]} pode nao ter wheel de torch. Se o venv falhar, instale Python 3.12 ou 3.13 e rode o install de novo.")
    return [sys.executable]


def _launcher_ver(cmd):
    try:
        out = subprocess.run(cmd + ["-c",
            "import sys;print(sys.version_info[0],sys.version_info[1])"],
            capture_output=True, text=True).stdout.split()
        return (int(out[0]), int(out[1]))
    except Exception:
        return None


def ensure_venv():
    print("\n[4/6] venv local + pacotes Python")
    vdir = _common.venv_dir()
    vpy = _common.venv_python()
    if not os.path.exists(vpy):
        base = pick_venv_python()
        print(f"   criando venv com: {' '.join(base)}")
        r = subprocess.run(base + ["-m", "venv", vdir])
        if r.returncode != 0 or not os.path.exists(vpy):
            WARNINGS.append("falha ao criar o venv — verifique sua instalacao de Python")
            print("   [!] nao consegui criar o venv")
            return
    print("   instalando pacotes (silero-vad, torch, opencv, ...) — demora na 1a vez")
    subprocess.run([vpy, "-m", "pip", "install", "--quiet", "--upgrade", "pip"])
    r = subprocess.run([vpy, "-m", "pip", "install", "--quiet"] + PIP_PACKAGES)
    if r.returncode != 0:
        WARNINGS.append("pip install falhou (provavel torch x versao do Python). Instale Python 3.12/3.13 e rode de novo.")
        print("   [!] pip install falhou — ver aviso no fim")
        return
    check = subprocess.run([vpy, "-c",
        "import torch,silero_vad,scipy,numpy,fontTools,yaml,cv2;"
        "print('venv OK — torch',torch.__version__,'| opencv',cv2.__version__)"],
        capture_output=True, text=True)
    print("   " + (check.stdout.strip() or check.stderr.strip()[-200:]))


# ─────────────────────────────────────────────────────────────────────────────
# 5. fontes (so Mac precisa — usa font= por nome; Windows usa fontfile embarcado)
# ─────────────────────────────────────────────────────────────────────────────
def ensure_fonts():
    print("\n[5/6] fontes")
    if not IS_MAC:
        print("   OK — Windows/Linux usam o .ttf embarcado direto (fontfile), nada a instalar")
        return
    fonts_dir = os.path.expanduser("~/Library/Fonts")
    os.makedirs(fonts_dir, exist_ok=True)
    src = os.path.join(SQUAD_DIR, "data", "fontes")
    for f in os.listdir(src):
        if f.endswith(".ttf") and not os.path.exists(os.path.join(fonts_dir, f)):
            shutil.copy(os.path.join(src, f), fonts_dir)
    subprocess.run(["fc-cache", "-f", fonts_dir])
    print("   OK — fontes copiadas + cache atualizado")


# ─────────────────────────────────────────────────────────────────────────────
# 6. wrapper do slash command
# ─────────────────────────────────────────────────────────────────────────────
def find_auroq_root(start):
    d = start
    home = os.path.expanduser("~")
    while d and d not in ("/", home) and os.path.dirname(d) != d:
        if os.path.isdir(os.path.join(d, ".auroq-core")):
            return d
        d = os.path.dirname(d)
    return None


WRAPPER = """# squad-edicao-arcane

Edita video bruto talking-head pra Reels/Shorts: corte por fala (Silero VAD), aceleracao 1.2x mantendo pitch, zoom dinamico no rosto, legenda Bebas Neue e trilha de fundo com ducking balanceado. 7 agents com quality gates entre handoffs. Cross-platform (macOS + Windows).

CRITICAL: First, read and adopt the persona defined in `agents/squad-edicao-arcane/agents/chief.md`.
Then, read and execute the task defined in `agents/squad-edicao-arcane/tasks/start.md`.
Follow ALL instructions exactly as written. Those files are your single source of truth.
"""


def register_slash():
    print("\n[6/6] slash command /auroq-squad-edicao-arcane")
    root = find_auroq_root(SQUAD_DIR)
    if not root:
        print("   [i] projeto Auroq nao encontrado na hierarquia.")
        print("       mova a pasta do squad pra <seu-projeto-auroq>/agents/squad-edicao-arcane/")
        print("       e rode o install de novo (o ambiente ja fica instalado).")
        WARNINGS.append("slash command nao registrado — squad fora de um projeto Auroq")
        return
    cmd_dir = os.path.join(root, ".claude", "commands")
    os.makedirs(cmd_dir, exist_ok=True)
    with open(os.path.join(cmd_dir, "auroq-squad-edicao-arcane.md"), "w", encoding="utf-8") as f:
        f.write(WRAPPER)
    print(f"   OK — wrapper criado em {cmd_dir}")


# ─────────────────────────────────────────────────────────────────────────────
def main():
    hr()
    print("  Squad Edicao Arcane — Setup (cross-platform)")
    print(f"  OS: {sys.platform} | Python: {sys.version_info[0]}.{sys.version_info[1]}")
    hr()
    if not have("claude"):
        print("[i] Claude Code nao detectado no PATH — o squad e usado dentro dele (https://claude.ai/code)")

    ensure_ffmpeg()
    ensure_whisper()
    ensure_model()
    ensure_venv()
    ensure_fonts()
    register_slash()

    print("\n" + "=" * 55)
    print("  Rodando health check (doctor.py)...")
    print("=" * 55)
    rc = subprocess.run([sys.executable, os.path.join(SQUAD_DIR, "scripts", "doctor.py")]).returncode

    print("")
    hr()
    if rc == 0 and not WARNINGS:
        print("  OK — Squad pronto pra editar videos.")
    else:
        print("  Setup terminou com pendencias:")
        for w in WARNINGS:
            print(f"   - {w}")
    hr()
    print("Pra editar: /auroq-squad-edicao-arcane  (ou: 'edita esse video: <path>')")
    return rc


if __name__ == "__main__":
    sys.exit(main())
