#!/usr/bin/env python3
"""
montar-corte-tela.py — corte vertical (Reels) de gravação do Meet com TELA COMPARTILHADA
(tela à esquerda + janelinha de quem fala à direita). Criado 11/11/2026 (sessão Diogo e Juliana).

Layout 1080x1920 (fundo preto):
  - rosto (janelinha do Meet) em cima, 1080x608, com zoom dinâmico alternado (1.0 / 1.12)
    a cada --zoom-a s, pra dar ritmo de edição
  - tela compartilhada embaixo, recortada no conteúdo (--tela-x0/--tela-x1), largura 1080
  - legenda custom-karol-laranja-tela (na base do rosto, sem cobrir a tela)
  - headline no CENTRO (tela compartilhada — Karol, 07/11), caixa preta, letra branca,
    palavra-chave em laranja #F05A28, sem legenda enquanto ela aparece

uso:
  montar-corte-tela.py <video_bruto> <transcript.txt> <offset_s> <inicio_s> <fim_s>
      "<HEADLINE BRANCA|DESTAQUE LARANJA>" <saida.mp4> [--tela-x0 230 --tela-x1 1210]
Executar com o Python do venv do squad-edicao-arcane.
"""
import os, sys, re, argparse, subprocess, tempfile, shutil

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
SEA = os.path.join(ROOT, "agents", "squad-edicao-arcane", "scripts")
sys.path.insert(0, SEA)
import _common

FFMPEG = _common.ffmpeg()
PY = sys.executable

p = argparse.ArgumentParser()
p.add_argument("video"); p.add_argument("transcript"); p.add_argument("offset", type=float)
p.add_argument("inicio", type=float); p.add_argument("fim", type=float)
p.add_argument("headline"); p.add_argument("saida")
p.add_argument("--style", default="custom-karol-laranja-tela")
p.add_argument("--hl-dur", type=float, default=4.0)
p.add_argument("--hl-size", type=int, default=88)
p.add_argument("--hl-y", type=float, default=0.44)
# regiões medidas na gravação de 29/10 (1920x1080): tela 0-1438 x 135-944; janelinha 1440-1910 x 406-673
p.add_argument("--tela-x0", type=int, default=230); p.add_argument("--tela-x1", type=int, default=1210)
p.add_argument("--tela-y0", type=int, default=135); p.add_argument("--tela-y1", type=int, default=944)
p.add_argument("--cam", default="1442:406:468:264")  # x:y:w:h da janelinha
p.add_argument("--zoom-a", type=float, default=5.0)
a = p.parse_args()

tmp = tempfile.mkdtemp(prefix="corte-tela-")
comp = os.path.join(tmp, "comp.mp4"); leg = os.path.join(tmp, "leg.mp4"); trs = os.path.join(tmp, "tr.txt")

def ts(s):
    h = int(s // 3600); m = int(s % 3600 // 60); sec = s % 60
    return f"{h:02d}:{m:02d}:{sec:06.3f}"

def parse(t):
    h, m, s = t.split(":"); return int(h) * 3600 + int(m) * 60 + float(s)

dur = a.fim - a.inicio
cx, cy, cw, ch = map(int, a.cam.split(":"))
tw = a.tela_x1 - a.tela_x0; th = a.tela_y1 - a.tela_y0
tela_h = int(round(th * 1080 / tw)); tela_h -= tela_h % 2
FACE_Y = 236
TELA_Y = FACE_Y + 608 + 24
if TELA_Y + tela_h > 1900:  # tela alta demais: limita
    tela_h = 1900 - TELA_Y; tela_h -= tela_h % 2

# 1. composição
fc = (
    f"color=c=0x0B0B0C:s=1080x1920:d={dur:.3f}[bg];"
    f"[0:v]split=3[v1][v2][v3];"
    f"[v1]crop={cw}:{ch}:{cx}:{cy},scale=1080:608:flags=lanczos,setsar=1[fa];"
    f"[v2]crop={cw}:{ch}:{cx}:{cy},scale=1210:682:flags=lanczos,crop=1080:608:65:30,setsar=1[fz];"
    f"[fa][fz]overlay=0:0:enable='eq(mod(floor(t/{a.zoom_a}),2),1)'[face];"
    f"[v3]crop={tw}:{th}:{a.tela_x0}:{a.tela_y0},scale=1080:{tela_h}:flags=lanczos,setsar=1[tela];"
    f"[bg][face]overlay=0:{FACE_Y}[b1];[b1][tela]overlay=0:{TELA_Y}:shortest=1,format=yuv420p[outv]"
)
ff = os.path.join(tmp, "fc.txt")
with open(ff, "w", encoding="utf-8") as f:
    f.write(fc)
subprocess.run([FFMPEG, "-y", "-ss", f"{a.inicio:.3f}", "-t", f"{dur:.3f}", "-i", a.video,
    "-/filter_complex", ff, "-map", "[outv]", "-map", "0:a", "-r", "30",
    "-c:v", "libx264", "-preset", "fast", "-crf", "16", "-c:a", "aac", "-b:a", "192k", comp],
    check=True, capture_output=True)

# 2. legenda (relativa ao corte, sem legenda durante a headline)
out = []
with open(a.transcript, encoding="utf-8") as f:
    for line in f:
        mt = re.match(r"\[(\d+:\d+:\d+\.\d+) --> (\d+:\d+:\d+\.\d+)\]\s*(.+)", line)
        if not mt:
            continue
        s0 = parse(mt.group(1)) + a.offset - a.inicio
        s1 = parse(mt.group(2)) + a.offset - a.inicio
        if s1 <= a.hl_dur or s0 >= dur:
            continue
        s0 = max(s0, a.hl_dur); s1 = min(s1, dur)
        if s1 - s0 < 0.15:
            continue
        out.append(f"[{ts(s0)} --> {ts(s1)}]   {mt.group(3).strip()}")
with open(trs, "w", encoding="utf-8") as f:
    f.write("\n".join(out) + "\n")
subprocess.run([PY, os.path.join(SEA, "video-captions.py"), comp, trs, leg, "--style", a.style], check=True)

# 3. headline no centro
def quebra(texto, maxc=20):
    words = texto.split(); linhas = []; atual = ""
    for w in words:
        if atual and len(atual) + 1 + len(w) > maxc:
            linhas.append(atual); atual = w
        else:
            atual = f"{atual} {w}".strip()
    if atual: linhas.append(atual)
    return linhas

def esc(t):
    t = t.replace("'", "’").replace('"', "")
    return t.replace("\\", "\\\\").replace(":", "\\:").replace("%", "%%").replace(",", "\\,")

branco, _, laranja = a.headline.partition("|")
linhas = [(l, "white") for l in quebra(branco.strip().upper())] + \
         [(l, "0xF05A28") for l in quebra(laranja.strip().upper())]
LH = a.hl_size + 30
y0 = int(1920 * a.hl_y) - (len(linhas) * LH) // 2
font = _common.drawtext_font_opt({"font": "Bebas Neue"})
filtros = []
for i, (ln, cor) in enumerate(linhas):
    filtros.append(":".join([
        f"drawtext={font}", f"text='{esc(ln)}'", f"fontcolor={cor}", f"fontsize={a.hl_size}",
        "x=(w-text_w)/2", f"y={y0 + i * LH}", "box=1", "boxcolor=0x0B0B0C@1.0", "boxborderw=16",
        f"enable='between(t,0,{a.hl_dur})'"]))
fh = os.path.join(tmp, "hl.txt")
with open(fh, "w", encoding="utf-8") as f:
    f.write("[0:v]" + ",".join(filtros) + "[outv]")
os.makedirs(os.path.dirname(os.path.abspath(a.saida)), exist_ok=True)
subprocess.run([FFMPEG, "-y", "-i", leg, "-/filter_complex", fh, "-map", "[outv]", "-map", "0:a",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p", "-profile:v", "main",
    "-level", "4.0", "-movflags", "+faststart", "-c:a", "copy", a.saida], check=True, capture_output=True)
shutil.rmtree(tmp, ignore_errors=True)
print(f"pronto: {a.saida} ({dur:.1f}s, headline {len(linhas)} linha(s), {len(out)} legendas)")
