#!/usr/bin/env python3
"""
video-transcribe.py — extrai audio + roda whisper-cli com prompt de nomes proprios.
uso: video-transcribe.py <video> [<output.txt>]
output default: <tempdir>/transcript_raw.txt

Cross-platform (porta do antigo video-transcribe.sh). Precisa de ffmpeg + whisper-cli
+ modelo ggml-medium.bin. Roda com python puro, nao precisa do venv.

O modelo eh resolvido por _common.model_path() (env WHISPER_MODEL -> default Mac ->
<squad>/models/ggml-medium.bin). O prompt pre-alimenta nomes proprios do expert.
"""
import sys, os, subprocess, argparse, tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common

FFMPEG = _common.ffmpeg()
WHISPER = _common.whisper_cli()
MODEL = _common.model_path()
PROMPT = "Euriler, Workshop Negocio Digital do Futuro, Bia, Arka, NDF, inteligencia artificial, lancador"

p = argparse.ArgumentParser()
p.add_argument("video")
p.add_argument("output", nargs="?",
    default=os.path.join(tempfile.gettempdir(), "transcript_raw.txt"))
args = p.parse_args()

video = args.video
out = args.output

if not os.path.isfile(MODEL):
    print(f"modelo whisper nao encontrado: {MODEL}")
    print("rode o instalador do squad (install.py) ou defina WHISPER_MODEL apontando pro ggml-medium.bin")
    sys.exit(1)

wav = _common.tmp_path(".wav")
subprocess.run([FFMPEG, "-y", "-i", video, "-ar", "16000", "-ac", "1", "-f", "wav", wav],
    capture_output=True, check=True)

with open(out, "w", encoding="utf-8") as fout:
    subprocess.run([WHISPER, "-m", MODEL, "-l", "pt", "-ml", "32", "-sow",
        "--prompt", PROMPT, "-f", wav],
        stdout=fout, stderr=subprocess.DEVNULL, check=True)

os.remove(wav)

with open(out, encoding="utf-8") as f:
    linhas = sum(1 for _ in f)

print(f"transcript raw em: {out}")
print(f"linhas: {linhas}")
