#!/usr/bin/env python3
"""
video-headline.py — queima uma headline fixa no topo do video (gancho que
aparece nos primeiros segundos e some), separada da legenda sincronizada
com a fala (essa e' feita pelo video-captions.py).

uso: video-headline.py <video> "<texto da headline>" [<output>] [--duration 4.0]
     [--fontsize 64] [--y-pos 0.09] [--max-chars-line 24]

Por que script separado do video-captions.py: a legenda ali e sincronizada
por trecho de transcript (uma frase troca pela proxima ao longo do video
inteiro); a headline e' um texto UNICO, fixo, que so aparece no comeco —
funcao diferente (gancho de topo de funil vs. legenda de acompanhamento).

Roda com python puro (nao precisa do venv) — so usa ffmpeg via _common.

GOTCHA DE WINDOWS (achado 11/09/2026, ver knowledge/04-troubleshooting.md
Bug 13): NUNCA passar o filtro drawtext com texto acentuado direto como
string pra `-vf` na linha de comando — o ffmpeg no Windows recebe o argv
recodificado pela codepage do console e corrompe acento (Ú/Ã/É viram
lixo/`?`), e o parser do filtro pode ate falhar ("No option name near...").
Fix: escrever o filtro num arquivo UTF-8 e usar `-filter_complex_script`
(mesmo padrao que o video-captions.py ja usa) — e' o que este script faz.
"""
import os, sys, argparse, subprocess

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common

FFMPEG = _common.ffmpeg()

p = argparse.ArgumentParser()
p.add_argument("video")
p.add_argument("headline")
p.add_argument("output", nargs="?", default=None)
p.add_argument("--duration", type=float, default=4.0, help="segundos visivel no inicio (default 4.0)")
p.add_argument("--fontsize", type=int, default=64)
p.add_argument("--y-pos", type=float, default=0.09, help="posicao vertical, fracao da altura (default 0.09 = perto do topo)")
p.add_argument("--max-chars-line", type=int, default=24)
args = p.parse_args()

video = args.video
base = os.path.splitext(video)[0]
output = args.output or f"{base}_headline.mp4"
LH = args.fontsize + 20
STYLE = {"font": "Bebas Neue"}  # so pra resolver fontfile via _common.drawtext_font_opt


def probe_height(v):
    ffprobe = _common.ffprobe()
    out = subprocess.run([ffprobe, "-v", "error", "-select_streams", "v:0",
        "-show_entries", "stream=height", "-of", "csv=p=0", v],
        capture_output=True, text=True, check=True).stdout.strip()
    return int(out)


def quebrar_em_linhas(text, max_per_line):
    words = text.split()
    linhas = []
    atual = [words[0]]; atual_chars = len(words[0])
    for w in words[1:]:
        novo = atual_chars + 1 + len(w)
        if novo > max_per_line:
            linhas.append(" ".join(atual)); atual = [w]; atual_chars = len(w)
        else:
            atual.append(w); atual_chars = novo
    linhas.append(" ".join(atual))
    return linhas


def esc(t):
    t = t.replace("'", "").replace('"', "")
    t = t.replace("\\", "\\\\").replace(":", "\\:").replace("%", "%%")
    return t


TH = probe_height(video)
linhas = quebrar_em_linhas(args.headline, args.max_chars_line)
y_top = f"({TH}*{args.y_pos})"

filters = []
for i, ln in enumerate(linhas):
    y = f"{y_top}+{i*LH}"
    parts = [
        f"drawtext={_common.drawtext_font_opt(STYLE)}",
        f"text='{esc(ln)}'",
        "fontcolor=white",
        f"fontsize={args.fontsize}",
        "x=(w-text_w)/2",
        f"y={y}",
        "borderw=6",
        "bordercolor=black",
        "box=1",
        "boxcolor=black@0.45",
        "boxborderw=14",
        f"enable='between(t,0,{args.duration})'",
    ]
    filters.append(":".join(parts))

graph = "[0:v]" + ",".join(filters) + "[outv]"
ff = _common.tmp_path(".txt")
with open(ff, "w", encoding="utf-8") as fout:
    fout.write(graph)

subprocess.run([FFMPEG, "-y", "-i", video, "-filter_complex_script", ff,
    "-map", "[outv]", "-map", "0:a",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18",
    "-pix_fmt", "yuv420p", "-profile:v", "main", "-level", "4.0",
    "-movflags", "+faststart",
    "-c:a", "copy", output], check=True, capture_output=True)
os.remove(ff)

print(f"headline: '{args.headline}' ({len(linhas)} linha(s)) — visivel 0-{args.duration}s")
print(f"output: {output}")
