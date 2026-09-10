#!/usr/bin/env python3
"""
video-transcribe.py — extrai audio + roda whisper-cli com prompt de nomes proprios.
uso: video-transcribe.py <video> [<output.txt>]
output default: <tempdir>/transcript_raw.txt

Cross-platform (porta do antigo video-transcribe.sh). Precisa de ffmpeg + whisper-cli
+ modelo ggml-medium.bin. Roda com python puro, nao precisa do venv.

O modelo eh resolvido por _common.model_path() (env WHISPER_MODEL -> default Mac ->
<squad>/models/ggml-medium.bin). O prompt pre-alimenta nomes proprios do expert,
lido de data/nomes-proprios.yaml (nunca hardcoded — cada expert tem o seu).

Transcreve em janelas de CHUNK_MS (via -ot/-d do proprio whisper-cli, sem reextrair
audio) em vez de processar o arquivo inteiro numa unica chamada. Achado real
(09/09/2026, video de 59min): rodar o whisper-cli de uma vez so em audio longo
acumula memoria ao longo do processamento e o processo e matado pelo sistema por
falta de RAM (reproduzido 3x). Em janelas, cada chamada carrega o modelo, processa
so aquele trecho e libera tudo ao terminar — memoria de pico fica limitada ao
tamanho da janela, nao ao tamanho do video.
"""
import sys, os, re, subprocess, argparse, tempfile

CHUNK_MS = 5 * 60 * 1000  # 5min por chamada — ver nota de memoria acima
THREADS = 2  # menos paralelismo = menos pico de memoria (mais lento, mesma precisao)

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common

FFMPEG = _common.ffmpeg()
WHISPER = _common.whisper_cli()
MODEL = _common.model_path()


def _load_prompt_names():
    """Le a lista `nomes_corretos` de data/nomes-proprios.yaml sem depender de
    PyYAML (o script roda com python puro, sem venv). Formato esperado: lista
    plana de strings entre aspas, uma por linha, sob a chave nomes_corretos."""
    path = os.path.join(_common.SQUAD_DIR, "data", "nomes-proprios.yaml")
    if not os.path.isfile(path):
        return []
    with open(path, encoding="utf-8") as f:
        linhas = f.readlines()
    nomes = []
    dentro = False
    for linha in linhas:
        if re.match(r"^nomes_corretos:\s*$", linha):
            dentro = True
            continue
        if dentro:
            if re.match(r"^\s*#", linha) or not linha.strip():
                continue
            m = re.match(r'^\s*-\s*"(.+)"\s*$', linha)
            if m:
                nomes.append(m.group(1))
                continue
            break  # fim da lista (proxima chave top-level ou linha nao-item)
    return nomes


PROMPT = ", ".join(_load_prompt_names())

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

FFPROBE = _common.ffprobe()
probe = subprocess.run([FFPROBE, "-v", "error", "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1", wav], capture_output=True, text=True, check=True)
total_ms = int(float(probe.stdout.strip()) * 1000)

offset = 0
chunk_n = 0
total_chunks = (total_ms // CHUNK_MS) + 1
with open(out, "w", encoding="utf-8") as fout:
    while offset < total_ms:
        chunk_n += 1
        restante = total_ms - offset
        is_last = restante <= CHUNK_MS
        cmd = [WHISPER, "-m", MODEL, "-l", "pt", "-ml", "32", "-sow", "-t", str(THREADS),
            "--prompt", PROMPT, "-ot", str(offset)]
        if not is_last:
            cmd += ["-d", str(CHUNK_MS)]
        cmd += ["-f", wav]
        print(f"chunk {chunk_n}/{total_chunks} (offset {offset//1000}s)...", file=sys.stderr)
        subprocess.run(cmd, stdout=fout, stderr=subprocess.DEVNULL, check=True)
        fout.flush()
        offset += CHUNK_MS

os.remove(wav)

with open(out, encoding="utf-8") as f:
    linhas = sum(1 for _ in f)

print(f"transcript raw em: {out}")
print(f"linhas: {linhas}")
