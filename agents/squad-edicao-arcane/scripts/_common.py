"""
_common.py — helpers cross-platform compartilhados pelos scripts do Squad Edicao Arcane.

Existe pra o squad rodar identico em macOS e Windows (e Linux) sem paths cravados.
Resolve os 4 acoplamentos que travavam o Windows na v1.0.0:

  1. Binarios (ffmpeg/ffprobe/whisper-cli): antes so procurava em /opt/homebrew/bin
     e /usr/local/bin (paths do Homebrew). Agora: PATH primeiro (shutil.which),
     depois um bin local do squad, depois fallbacks por OS.
  2. Arquivos temporarios: antes cravava /tmp/ (inexistente no Windows). Agora
     tempfile.gettempdir() via tmp_path().
  3. Modelo whisper: antes so /opt/homebrew/share/... Agora env WHISPER_MODEL,
     depois default do Mac, depois <squad>/models/ (default Windows).
  4. Fonte da legenda: no Mac o drawtext usa font='<nome>' (fontconfig, validado);
     no Windows/Linux usa fontfile='<caminho .ttf>' (freetype direto, dispensa
     fontconfig — que o ffmpeg de Windows costuma nao trazer). Ver drawtext_font_opt().

Import a partir de qualquer script da pasta scripts/:
    import os, sys
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import _common
"""
import os
import platform
import shutil
import tempfile

SQUAD_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

IS_WINDOWS = platform.system() == "Windows"
IS_MAC = platform.system() == "Darwin"

# Bins que o instalador pode baixar pra dentro do squad (ex: whisper-cli.exe no Windows)
LOCAL_BIN_DIR = os.path.join(SQUAD_DIR, "bin")

# ─────────────────────────────────────────────────────────────────────────────
# Resolucao de binarios
# ─────────────────────────────────────────────────────────────────────────────
def _os_fallbacks(name):
    """Locais conhecidos por OS, tentados DEPOIS do PATH e do bin local."""
    if IS_MAC:
        return [f"/opt/homebrew/bin/{name}", f"/usr/local/bin/{name}"]
    if IS_WINDOWS:
        # winget/choco normalmente jogam no PATH (pego antes por which). Aqui so
        # cobrimos casos onde o exe existe mas nao esta no PATH desta sessao.
        return []
    # Linux
    return [f"/usr/bin/{name}", f"/usr/local/bin/{name}"]


def find_bin(name):
    """Resolve um executavel de forma portavel.

    Ordem: PATH (respeita winget/brew/choco) -> bin local do squad -> fallbacks por OS.
    Se nada acha, devolve o proprio nome (deixa o subprocess falhar com erro claro).
    """
    p = shutil.which(name)
    if p:
        return p

    exe = name + (".exe" if IS_WINDOWS else "")
    local = os.path.join(LOCAL_BIN_DIR, exe)
    if os.path.exists(local):
        return local

    for cand in _os_fallbacks(name):
        if os.path.exists(cand):
            return cand

    return name


def ffmpeg():
    return find_bin("ffmpeg")


def ffprobe():
    return find_bin("ffprobe")


def whisper_cli():
    return find_bin("whisper-cli")


# ─────────────────────────────────────────────────────────────────────────────
# Temporarios (nunca mais /tmp/ cravado)
# ─────────────────────────────────────────────────────────────────────────────
def tmp_path(suffix=""):
    """Caminho temporario portavel. Cria e fecha o arquivo; o chamador escreve/remove."""
    fd, path = tempfile.mkstemp(suffix=suffix, prefix="sea_")
    os.close(fd)
    return path


# ─────────────────────────────────────────────────────────────────────────────
# Modelo whisper
# ─────────────────────────────────────────────────────────────────────────────
# Tamanho exato do ggml-medium.bin (bytes) — fonte: HuggingFace. Usado pra detectar
# download incompleto (o urlretrieve nao verifica tamanho e o doctor dava OK falso).
MODEL_SIZE = 1533763059


def model_path():
    """Caminho do ggml-medium.bin. Ordem: env WHISPER_MODEL -> default Mac -> <squad>/models."""
    env = os.environ.get("WHISPER_MODEL")
    if env:
        return env
    if IS_MAC:
        mac = "/opt/homebrew/share/whisper-cpp/models/ggml-medium.bin"
        if os.path.exists(mac):
            return mac
    return os.path.join(SQUAD_DIR, "models", "ggml-medium.bin")


# ─────────────────────────────────────────────────────────────────────────────
# venv local
# ─────────────────────────────────────────────────────────────────────────────
def venv_dir():
    return os.path.join(SQUAD_DIR, ".venv")


def venv_python():
    """Python do venv local, por OS (.venv/Scripts/python.exe vs .venv/bin/python3)."""
    if IS_WINDOWS:
        return os.path.join(venv_dir(), "Scripts", "python.exe")
    return os.path.join(venv_dir(), "bin", "python3")


def venv_pip():
    if IS_WINDOWS:
        return os.path.join(venv_dir(), "Scripts", "pip.exe")
    return os.path.join(venv_dir(), "bin", "pip")


# ─────────────────────────────────────────────────────────────────────────────
# Fontes da legenda (o ponto mais sensivel do port)
# ─────────────────────────────────────────────────────────────────────────────
# Mapa nome-de-fonte -> arquivo embarcado em data/fontes/. Usado quando o estilo
# nao traz um campo `fontfile` explicito.
FONT_FILES = {
    "Bebas Neue": "BebasNeue-Regular.ttf",
    "Montserrat": "Montserrat-Bold.ttf",
    "Poppins": "Poppins-Bold.ttf",
}

FONTS_DIR = os.path.join(SQUAD_DIR, "data", "fontes")


def font_file_for_style(style):
    """Caminho absoluto do .ttf embarcado pro estilo. Le `fontfile` do yaml se houver,
    senao mapeia por `font` (nome). Devolve None se nao achar arquivo."""
    fname = style.get("fontfile") or FONT_FILES.get(style.get("font", ""))
    if not fname:
        return None
    path = fname if os.path.isabs(fname) else os.path.join(FONTS_DIR, fname)
    return path if os.path.exists(path) else None


def _short_path_windows(path):
    """Converte pro nome curto 8.3 (ASCII, sem espaco/acento) via GetShortPathName.

    O ffmpeg no Windows nao abre fontfile com acento no caminho (ex: C:/Users/Jose/
    OneDrive - X/...); o short path resolve espaco E acento de uma vez. Se o 8.3
    estiver desabilitado no volume, a API devolve o path longo (fallback aceitavel:
    ainda cobre paths so-ASCII com espaco)."""
    try:
        import ctypes
        from ctypes import wintypes
        fn = ctypes.windll.kernel32.GetShortPathNameW
        fn.argtypes = [wintypes.LPCWSTR, wintypes.LPWSTR, wintypes.DWORD]
        fn.restype = wintypes.DWORD
        buf = ctypes.create_unicode_buffer(600)
        n = fn(path, buf, 600)
        if n and buf.value:
            return buf.value
    except Exception:
        pass
    return path


def _drawtext_fontfile_value(path):
    """Monta o valor `fontfile='...'` pro drawtext, escapado pro filtergraph.

    Forma validada empiricamente no ffmpeg 8.1/Windows (via filter_complex_script):
    aspas simples + ':' do drive escapado como '\\:'. Aspas sozinhas nao bastam,
    ':' cru nao basta — precisa dos dois. Em Windows usamos ainda o short path 8.3
    pra fugir de espaco/acento que o ffmpeg nao abre."""
    if IS_WINDOWS:
        path = _short_path_windows(os.path.abspath(path))
    fwd = path.replace("\\", "/")
    esc = fwd.replace(":", r"\:")
    return f"fontfile='{esc}'"


def drawtext_font_opt(style):
    """Opcao de fonte pro drawtext, OS-aware.

    Mac  -> font='<nome>'  (fontconfig; comportamento validado na v1.0.0, intocado).
    Win/Linux -> fontfile='<caminho .ttf escapado>' (freetype direto, dispensa
    fontconfig — que o ffmpeg de Windows costuma nao trazer).

    Fallback: se for usar fontfile mas o .ttf nao existir, cai pra font='<nome>'
    (melhor tentar resolver por nome do que quebrar a legenda)."""
    if IS_MAC:
        return f"font='{style['font']}'"
    ff = font_file_for_style(style)
    if ff:
        return _drawtext_fontfile_value(ff)
    return f"font='{style['font']}'"
