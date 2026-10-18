#!/usr/bin/env python3
"""Plataforma — tudo o que muda entre Mac, Windows e Linux fica aqui; os outros scripts importam daqui.

  python3 plataforma.py diagnosticar     mostra o sistema, o Python do ambiente da skill, o ffmpeg/ffprobe,
                                         o conversor de HDR e o transcritor que vão ser usados
  python3 plataforma.py abrir <arquivo>  abre o arquivo no programa padrão (Mac: open; Windows: start; Linux: xdg-open)

No Windows, troque `python3` por `python` (ou `py`) nos comandos da skill.

Variáveis de ambiente (opcionais):
  EDICAO_PLATAFORMA=mac|windows|linux   força o caminho de outro sistema onde dá (ex.: testar num Mac o caminho de
                                        fora do Mac: faster-whisper no lugar do mlx-whisper, ffmpeg no lugar do avconvert)
  EDICAO_FFMPEG / EDICAO_FFPROBE        caminho de um ffmpeg/ffprobe específico (ex.: um build com zscale)
  EDICAO_VENV                           outra pasta para o ambiente Python da skill (padrão ~/.cache/edicao-euriliana/venv)
  EDICAO_WHISPER_MODELO                 modelo do faster-whisper (padrão large-v3-turbo; numa máquina fraca: medium ou small)
"""
import os
import platform
import re
import shutil
import subprocess
import sys
from pathlib import Path

_REAL = {"Darwin": "mac", "Windows": "windows"}.get(platform.system(), "linux")
SISTEMA = (os.environ.get("EDICAO_PLATAFORMA") or "").strip().lower() or _REAL
if SISTEMA not in ("mac", "windows", "linux"):
    SISTEMA = _REAL
SIMULADO = SISTEMA != _REAL
MAC = SISTEMA == "mac"
WINDOWS = SISTEMA == "windows"
# Apple Silicon de verdade (o mlx-whisper só roda nele)
MAC_ARM = MAC and _REAL == "mac" and platform.machine() == "arm64"
NT = os.name == "nt"  # o que é físico (caminho do Python do venv, .exe, .cmd) segue o sistema real

VENV = Path(os.environ.get("EDICAO_VENV") or (Path.home() / ".cache/edicao-euriliana/venv")).expanduser()
PACOTES_BASE = ["numpy", "opencv-python-headless<5"]
UTF8 = {"encoding": "utf-8", "errors": "replace"}  # para subprocess.run(..., text=True, **UTF8)


def _utf8():
    """console do Windows (cp1252) quebra com acento, seta e travessão: saída sempre em UTF-8"""
    for s in (sys.stdout, sys.stderr):
        try:
            if (s.encoding or "").lower().replace("-", "") != "utf8":
                s.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass
    if NT:
        os.environ.setdefault("PYTHONIOENCODING", "utf-8")
        os.environ.setdefault("PYTHONUTF8", "1")


_utf8()


# ----------------------------------------------------------------------------- ffmpeg / ffprobe

def _lugares_comuns():
    if NT:
        la = Path(os.environ.get("LOCALAPPDATA") or Path.home() / "AppData/Local")
        pf = Path(os.environ.get("ProgramFiles") or r"C:\Program Files")
        lugares = [la / "Microsoft/WinGet/Links", Path(r"C:\ffmpeg\bin"), pf / "ffmpeg/bin", Path.home() / "scoop/shims",
                   Path(r"C:\ProgramData\chocolatey\bin")]
        lugares += sorted((la / "Microsoft/WinGet/Packages").glob("Gyan.FFmpeg*/*/bin"), reverse=True)
        return lugares
    return [Path("/opt/homebrew/bin"), Path("/usr/local/bin"), Path("/usr/bin"), Path("/snap/bin")]


def _achar(nome):
    env = os.environ.get(f"EDICAO_{nome.upper()}")
    if env and Path(env).expanduser().exists():
        return str(Path(env).expanduser())
    w = shutil.which(nome)
    if w:
        return w
    for d in _lugares_comuns():
        p = d / (nome + (".exe" if NT else ""))
        if p.exists():
            return str(p)
    return None


FFMPEG = _achar("ffmpeg")
FFPROBE = _achar("ffprobe")
# os scripts chamam "ffmpeg"/"ffprobe" pelo nome: se o escolhido não é o primeiro do PATH, ele vai para a frente
for _exe in (FFPROBE, FFMPEG):
    if _exe and shutil.which(Path(_exe).stem) != _exe:
        os.environ["PATH"] = str(Path(_exe).parent) + os.pathsep + os.environ.get("PATH", "")
FFMPEG = FFMPEG or "ffmpeg"
FFPROBE = FFPROBE or "ffprobe"

COMO_FFMPEG = {
    "windows": "Windows: winget install Gyan.FFmpeg (build 'full' do gyan.dev, já vem com zscale e libplacebo) ou baixe "
               "ffmpeg-release-full.7z em https://www.gyan.dev/ffmpeg/builds/, descompacte e ponha a pasta bin no PATH. "
               "Feche e abra o terminal depois.",
    "linux": "Linux: sudo apt install ffmpeg (ou dnf/pacman). Confira se tem zscale: ffmpeg -hide_banner -filters | grep zscale; "
             "se não tiver, use o build estático de https://johnvansickle.com/ffmpeg/",
    "mac": "Mac: brew install ffmpeg",
}


def exigir_ffmpeg():
    if shutil.which("ffmpeg") and shutil.which("ffprobe"):
        return
    sys.exit("não achei o ffmpeg/ffprobe neste computador.\n  " + COMO_FFMPEG[SISTEMA] +
             "\n  (ou aponte EDICAO_FFMPEG e EDICAO_FFPROBE para os executáveis)")


def filtros_ffmpeg():
    try:
        return subprocess.run([FFMPEG, "-hide_banner", "-filters"], capture_output=True, text=True, **UTF8).stdout
    except OSError:
        return ""


# ----------------------------------------------------------------------------- Python do ambiente da skill

def python_venv():
    return VENV / ("Scripts/python.exe" if NT else "bin/python")


def no_venv():
    try:
        return Path(sys.prefix).resolve() == VENV.resolve()
    except OSError:
        return False


def pacotes_whisper():
    """mlx-whisper no Apple Silicon; fora dele, faster-whisper (rápido na CPU e usa a placa NVIDIA se houver)"""
    return ["mlx-whisper"] if MAC_ARM else ["faster-whisper"]


def criar_venv():
    py = python_venv()
    if not py.exists():
        print("criando ambiente Python da skill (uma vez só)...", flush=True)
        subprocess.run([sys.executable, "-m", "venv", str(VENV)], check=True)
        subprocess.run([str(py), "-m", "pip", "install", "-q", *PACOTES_BASE, *pacotes_whisper()], check=True)
    return py


def rodar_no_venv(argv=None):
    """roda este mesmo script no Python do ambiente da skill e termina com o código dele"""
    py = criar_venv()
    argv = list(sys.argv if argv is None else argv)
    if NT:  # no Windows o os.execv solta o terminal antes do fim: espera o filho
        sys.exit(subprocess.run([str(py), *argv]).returncode)
    os.execv(str(py), [str(py), *argv])


def tem_modulo(nome):
    import importlib.util
    return importlib.util.find_spec(nome) is not None


def python_com(modulo):
    """o Python atual se ele já tem o módulo; senão o do ambiente da skill (se existir)"""
    if tem_modulo(modulo) or not python_venv().exists():
        return sys.executable
    return str(python_venv())


def exigir_modulo(modulo):
    """script standalone que precisa de numpy etc.: sem o módulo aqui, roda de novo no ambiente da skill"""
    if tem_modulo(modulo) or no_venv():
        return
    rodar_no_venv()


def pip_instalar(*pacotes):
    r = subprocess.run([sys.executable, "-m", "pip", "install", "-q", *pacotes])
    return r.returncode == 0


# ----------------------------------------------------------------------------- programas e arquivos

def comando(nome):
    """começo da lista do subprocess (shell=False) para rodar um programa pelo nome em qualquer sistema.
    No Windows os programas do npm (higgsfield, codex, npm) são .cmd: o subprocess não acha sem a extensão, e passar
    pelo cmd.exe estraga aspas, % e quebra de linha do prompt. Aqui o .cmd é aberto e o node roda o .js direto."""
    if not NT:
        return [nome]
    w = shutil.which(nome)
    if not w:
        return [nome]
    if w.lower().endswith((".cmd", ".bat")):
        try:
            txt = Path(w).read_text(encoding="utf-8", errors="ignore")
            alvos = re.findall(r'"%~?dp0%?\\([^"]+)"\s+%\*', txt)
            if alvos:
                alvo = Path(w).parent / alvos[-1].replace("\\", "/")
                if alvo.suffix.lower() in (".js", ".mjs", ".cjs") and alvo.exists():
                    node = Path(w).parent / "node.exe"
                    return [str(node if node.exists() else (shutil.which("node") or "node")), str(alvo)]
                if alvo.exists():
                    return [str(alvo)]
        except OSError:
            pass
    return [w]


def ligar(origem, destino):
    """link simbólico; no Windows (sem modo de desenvolvedor) cai para link físico e, por último, cópia"""
    origem, destino = Path(origem).resolve(), Path(destino)
    try:
        os.symlink(origem, destino)
        return
    except OSError:
        pass
    try:
        os.link(origem, destino)
    except OSError:
        shutil.copy2(origem, destino)


# Isolador de voz (tratar_audio.py): DeepFilterNet 0.5.6, rede neural que separa a voz do ruído e roda no próprio
# computador (licença MIT/Apache). Programa de arquivo único por sistema, baixado do GitHub na primeira vez para
# ~/.cache/edicao-euriliana/bin e conferido pela assinatura SHA-256 abaixo (arquivo diferente é apagado, nunca roda).
DEEP_FILTER = {
    ("mac", "arm64"): ("aarch64-apple-darwin", "4601e7f4e4c03e59a4c5b5000216ef3add3e808799cfccd95e14e83ea4611081"),
    ("mac", "x86_64"): ("x86_64-apple-darwin", "d3be84003acb7c23e738ad7f70a158ec779a8d233a82e7fa3e717d112eb5b50f"),
    ("windows", "amd64"): ("x86_64-pc-windows-msvc.exe", "75e11fa16445f560cb6b021521ddb89e89270d13b83089705d98776f58fd7915"),
    ("windows", "x86_64"): ("x86_64-pc-windows-msvc.exe", "75e11fa16445f560cb6b021521ddb89e89270d13b83089705d98776f58fd7915"),
    ("linux", "x86_64"): ("x86_64-unknown-linux-musl", "70775e251eee44c0f2451a1e833326cf8bcbbe304d3e7cd12851e6fce72ef7da"),
    ("linux", "aarch64"): ("aarch64-unknown-linux-gnu", "14e02a1c0028f3ca0bdf83b62b3336e56ba0556894ef295a95e8573f06557166"),
}


def isolador_de_voz(baixar=True):
    """caminho do deep-filter desta máquina (baixa e confere na primeira vez) ou None se não der (sem internet,
    processador sem versão pronta); quem chama cai para o tratamento só com filtros do ffmpeg"""
    import hashlib
    import urllib.request
    alvo = DEEP_FILTER.get((_REAL, platform.machine().lower()))
    if not alvo:
        return None
    nome, sha = alvo
    arq = Path.home() / ".cache/edicao-euriliana/bin" / f"deep-filter-0.5.6-{nome}"
    confere = lambda f: hashlib.sha256(f.read_bytes()).hexdigest() == sha
    if arq.is_file() and confere(arq):
        return arq
    if not baixar:
        return None
    arq.parent.mkdir(parents=True, exist_ok=True)
    tmp = arq.with_suffix(arq.suffix + ".baixando")
    try:
        print("baixando o isolador de voz (DeepFilterNet, ~30 MB, uma vez só)...", flush=True)
        url = f"https://github.com/Rikorose/DeepFilterNet/releases/download/v0.5.6/deep-filter-0.5.6-{nome}"
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "edicao-euriliana"}), timeout=120) as r:
            tmp.write_bytes(r.read())
        if not confere(tmp):
            tmp.unlink(missing_ok=True)
            print("o arquivo baixado não bate com a assinatura esperada: apaguei e sigo sem o isolador", flush=True)
            return None
        tmp.replace(arq)
        if not NT:
            arq.chmod(0o755)
        return arq
    except Exception as e:  # sem internet, GitHub fora etc.
        tmp.unlink(missing_ok=True)
        print(f"não consegui baixar o isolador de voz ({e.__class__.__name__}): sigo com os filtros do ffmpeg", flush=True)
        return None


def linha_concat(p):
    """linha do arquivo de lista do concat do ffmpeg (barra normal também no Windows; apóstrofo escapado)"""
    return "file '" + Path(p).resolve().as_posix().replace("'", "'\\''") + "'"


def abrir(arq):
    arq = str(arq)
    if _REAL == "windows":
        os.startfile(arq)  # noqa: (só existe no Windows)
    elif _REAL == "mac":
        subprocess.run(["open", arq])
    else:
        subprocess.run(["xdg-open", arq])


# ----------------------------------------------------------------------------- transcrição (roda no venv)

def _faster_whisper(wav, idioma):
    from faster_whisper import WhisperModel
    modelo = os.environ.get("EDICAO_WHISPER_MODELO", "large-v3-turbo")
    tentativas = []
    try:
        import ctranslate2
        if ctranslate2.get_cuda_device_count() > 0:
            tentativas.append(("cuda", "float16"))
    except Exception:
        pass
    tentativas.append(("cpu", "int8"))
    # o áudio vai já decodificado pelo ffmpeg (16 kHz mono): o decodificador do faster-whisper (PyAV) quebra quando o
    # pip traz uma versão nova do av ("open() got an unexpected keyword argument 'metadata_errors'", av 19)
    import numpy as np
    bruto = subprocess.run([FFMPEG, "-v", "error", "-i", str(wav), "-vn", "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
                           capture_output=True, check=True).stdout
    audio = np.frombuffer(bruto, np.float32)
    erro = None
    for dev, tipo in tentativas:
        try:
            print(f"transcrevendo com faster-whisper {modelo} ({'placa de vídeo NVIDIA' if dev == 'cuda' else 'processador'})...",
                  file=sys.stderr, flush=True)
            m = WhisperModel(modelo, device=dev, compute_type=tipo)
            segs, _ = m.transcribe(audio, language=idioma, word_timestamps=True)
            return [{"words": [{"word": w.word, "start": w.start, "end": w.end} for w in (s.words or [])]} for s in segs]
        except Exception as e:  # CUDA sem cuBLAS/cuDNN: cai para o processador
            erro = e
            print(f"  não deu em {dev}: {str(e)[:160]}", file=sys.stderr, flush=True)
    raise erro


def transcrever_whisper(wav, idioma="pt"):
    """segmentos do Whisper com palavras e tempos: [{"words": [{"word", "start", "end"}, ...]}, ...]
    Mac Apple Silicon: mlx-whisper. Fora dele: faster-whisper; se não tiver, openai-whisper; se nenhum, instala o faster."""
    if MAC_ARM:
        import mlx_whisper
        r = mlx_whisper.transcribe(str(wav), path_or_hf_repo="mlx-community/whisper-large-v3-turbo", language=idioma, word_timestamps=True)
        return r["segments"]
    if not tem_modulo("faster_whisper") and not tem_modulo("whisper"):
        print("instalando o faster-whisper no ambiente da skill (uma vez só)...", file=sys.stderr, flush=True)
        if not pip_instalar("faster-whisper"):
            print("o faster-whisper não instalou; tentando o openai-whisper (mais lento na CPU)...", file=sys.stderr, flush=True)
            pip_instalar("openai-whisper")
        import importlib
        importlib.invalidate_caches()
    if tem_modulo("faster_whisper"):
        try:
            return _faster_whisper(wav, idioma)
        except Exception as e:
            if not tem_modulo("whisper"):
                raise
            print(f"faster-whisper falhou ({str(e)[:160]}); indo para o openai-whisper", file=sys.stderr, flush=True)
    import whisper
    print("transcrevendo com openai-whisper turbo (na CPU pode levar vários minutos)...", file=sys.stderr, flush=True)
    return whisper.load_model("turbo").transcribe(str(wav), language=idioma, word_timestamps=True)["segments"]


def motor_transcricao():
    if MAC_ARM:
        return "mlx-whisper (Apple Silicon)"
    return "faster-whisper (CPU ou placa NVIDIA), com openai-whisper de reserva"


# ----------------------------------------------------------------------------- diagnóstico

def diagnosticar():
    print(f"sistema: {SISTEMA}{' (simulado por EDICAO_PLATAFORMA; o real é ' + _REAL + ')' if SIMULADO else ''} · "
          f"{platform.machine()} · Python {platform.python_version()}")
    py = python_venv()
    print(f"ambiente da skill: {VENV} ({'pronto' if py.exists() else 'ainda não criado; o preparar.py cria na 1ª vez'})")
    ok = shutil.which("ffmpeg") and shutil.which("ffprobe")
    print(f"ffmpeg: {FFMPEG if ok else 'NÃO ENCONTRADO'}" + ("" if ok else "\n  " + COMO_FFMPEG[SISTEMA]))
    f = filtros_ffmpeg() if ok else ""
    if MAC and shutil.which("avconvert"):
        hdr = "avconvert (conversão nativa da Apple)"
    elif " zscale " in f:
        hdr = "zscale do ffmpeg"
    elif " libplacebo " in f:
        hdr = "libplacebo do ffmpeg (precisa de placa de vídeo com Vulkan)"
    else:
        hdr = "NENHUM: vídeo HDR do iPhone vai sair com a cor lavada.\n  " + COMO_FFMPEG[SISTEMA]
    print(f"conversor de HDR: {hdr}")
    print(f"transcrição: {motor_transcricao()}")
    print(f"node: {shutil.which('node') or 'NÃO ENCONTRADO (instale o Node 22: https://nodejs.org)'}")


if __name__ == "__main__":
    a = sys.argv[1:] or ["diagnosticar"]
    if a[0] == "diagnosticar":
        diagnosticar()
    elif a[0] == "abrir" and len(a) > 1:
        abrir(a[1])
    else:
        sys.exit(__doc__)
