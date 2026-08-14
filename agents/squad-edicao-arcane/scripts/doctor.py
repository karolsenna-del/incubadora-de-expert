#!/usr/bin/env python3
"""
doctor.py — health check cross-platform do ambiente do Squad Edicao Arcane.
uso: python doctor.py
exit 0 = tudo OK, exit 1 = falta algo essencial.

Porta do antigo doctor.sh. Usa scripts/_common.py pra resolver binarios, modelo,
venv e fontes de forma portavel (macOS / Windows / Linux).
"""
import sys, os, subprocess

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common

SQUAD_DIR = _common.SQUAD_DIR
FFMPEG = _common.ffmpeg()
FFPROBE = _common.ffprobe()
WHISPER = _common.whisper_cli()
MODEL = _common.model_path()
VPY = _common.venv_python()

errors = 0
warnings = 0


def _ok(cond):
    try:
        return bool(cond())
    except Exception:
        return False


def check(name, cond):
    global errors
    if _ok(cond):
        print(f"[ OK ] {name}")
    else:
        print(f"[FAIL] {name}")
        errors += 1


def warn(name, cond):
    global warnings
    if _ok(cond):
        print(f"[ OK ] {name}")
    else:
        print(f"[WARN] {name} (opcional — pipeline default ainda roda)")
        warnings += 1


def is_exe(path):
    # aceita path absoluto executavel OU nome resolvivel no PATH
    if os.path.isabs(path):
        return os.path.exists(path)
    import shutil
    return shutil.which(path) is not None


def ffmpeg_has(filt):
    out = subprocess.run([FFMPEG, "-hide_banner", "-filters"],
        capture_output=True, text=True).stdout
    return filt in out


def venv_import(mod):
    return subprocess.run([VPY, "-c", f"import {mod}"],
        capture_output=True).returncode == 0


print("=== Squad Edicao Arcane — Doctor ===")
print(f"OS: {sys.platform} | ffmpeg: {FFMPEG}")
print("")

# ─── Binarios ───
check(f"ffmpeg ({FFMPEG})", lambda: is_exe(FFMPEG))
check("ffprobe", lambda: is_exe(FFPROBE))
check("whisper-cli", lambda: is_exe(WHISPER))

# ─── Filtros ffmpeg ───
check("ffmpeg drawtext (legenda)", lambda: ffmpeg_has("drawtext"))
check("ffmpeg sidechaincompress (trilha)", lambda: ffmpeg_has("sidechaincompress"))
# libfontconfig so importa no Mac (la a legenda usa font='<nome>'); no Windows/Linux
# a legenda usa fontfile=<.ttf> (freetype direto), entao fontconfig e dispensavel.
if _common.IS_MAC:
    def has_fontconfig():
        out = subprocess.run([FFMPEG, "-hide_banner", "-version"],
            capture_output=True, text=True).stdout
        return "libfontconfig" in out
    check("ffmpeg libfontconfig (Mac usa font= por nome)", has_fontconfig)

# ─── Modelo whisper ───
# checa tamanho, nao so existencia: download truncado (ex: 778MB/1533MB) dava OK falso
check(f"modelo ggml-medium.bin ({MODEL})",
    lambda: os.path.isfile(MODEL) and os.path.getsize(MODEL) == _common.MODEL_SIZE)

# ─── Venv local ───
check(f"venv local ({VPY})", lambda: os.path.exists(VPY))
if os.path.exists(VPY):
    check("venv: silero-vad", lambda: venv_import("silero_vad"))
    check("venv: torch", lambda: venv_import("torch"))
    check("venv: scipy", lambda: venv_import("scipy"))
    check("venv: numpy", lambda: venv_import("numpy"))
    check("venv: pyyaml", lambda: venv_import("yaml"))
    check("venv: cv2 (zoom)", lambda: venv_import("cv2"))

# ─── Fontes embarcadas (a legenda usa fontfile a partir daqui) ───
fontes = os.path.join(SQUAD_DIR, "data", "fontes")
check("fonte BebasNeue-Regular.ttf (embarcada)",
    lambda: os.path.isfile(os.path.join(fontes, "BebasNeue-Regular.ttf")))
warn("fonte Montserrat-Bold.ttf (estilo clean)",
    lambda: os.path.isfile(os.path.join(fontes, "Montserrat-Bold.ttf")))
warn("fonte Poppins-Bold.ttf (estilo organico)",
    lambda: os.path.isfile(os.path.join(fontes, "Poppins-Bold.ttf")))

# ─── Scripts ───
for scr in ("_common.py", "video-speech-cut.py", "video-speed-up.py",
            "video-transcribe.py", "video-captions.py", "video-produce-zoom.py",
            "video-add-music.py"):
    check(scr, (lambda s: lambda: os.path.isfile(os.path.join(SQUAD_DIR, "scripts", s)))(scr))

# ─── Data ───
check("data/estilo-ativo.yaml",
    lambda: os.path.isfile(os.path.join(SQUAD_DIR, "data", "estilo-ativo.yaml")))
check("data/estilos/neutro.yaml",
    lambda: os.path.isfile(os.path.join(SQUAD_DIR, "data", "estilos", "neutro.yaml")))
check("data/trilhas/default.mp3",
    lambda: os.path.isfile(os.path.join(SQUAD_DIR, "data", "trilhas", "default.mp3")))

# ─── Diagnostico especifico: drawtext ───
if not ffmpeg_has("drawtext"):
    print("")
    print(f"[!] O ffmpeg usado ({FFMPEG}) NAO tem 'drawtext' — a legenda nao renderiza.")
    if _common.IS_WINDOWS:
        print("    Windows: instale um build completo, ex: winget install Gyan.FFmpeg")
    elif _common.IS_MAC:
        print("    Mac: brew install ffmpeg   (o bottle ja traz drawtext — NAO compile do source)")
    else:
        print("    Linux: instale ffmpeg com --enable-libfreetype (ex: pacote da distro)")

print("")
print("-------------------------------------")
if errors == 0:
    print(f"OK — tudo certo ({warnings} avisos)")
    sys.exit(0)
else:
    print(f"FAIL — {errors} problemas detectados ({warnings} avisos)")
    print("")
    print("Pra corrigir: rode o instalador do squad")
    print(f"  python \"{os.path.join(SQUAD_DIR, 'install.py')}\"")
    sys.exit(1)
