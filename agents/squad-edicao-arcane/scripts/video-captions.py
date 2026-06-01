#!/usr/bin/env python3
"""
video-captions.py — queima legenda lendo estilo de config YAML.
uso: video-captions.py <video> <transcript.txt> [<output>] [--style <nome>] [--speed FLOAT]

Estilo lido de data/estilos/<nome>.yaml. Default: estilo-ativo.yaml.

--speed: reescalada timestamps do transcript dividindo por SPEED. Use quando o
video ja foi acelerado mas o transcript ainda tem timestamps do video original
(pre-speedup). Ex: video acelerado 1.2x -> --speed 1.2 (timestamps /= 1.2).
Default 1.0 (sem reescala).

Quebra automatica em linhas visuais: cada legenda eh subdividida em N linhas
que cabem em max_chars_per_line. NUNCA deixa texto sair da tela.

Executar com: {SQUAD_DIR}/.venv/bin/python3 video-captions.py ...
"""
import sys, subprocess, os, re, argparse, yaml

SQUAD_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

p = argparse.ArgumentParser()
p.add_argument("video")
p.add_argument("transcript")
p.add_argument("output", nargs="?", default=None)
p.add_argument("--style", default=None,
    help="nome do estilo (data/estilos/<nome>.yaml). Default: le estilo-ativo.yaml")
p.add_argument("--speed", type=float, default=1.0,
    help="fator de reescala de timestamps. Use o mesmo speed aplicado ao video (ex: 1.2 se video foi acelerado 1.2x). Default 1.0")
args = p.parse_args()
SPEED = args.speed if args.speed > 0 else 1.0

# ─── carrega config do estilo ───
if args.style:
    style_name = args.style
else:
    with open(f"{SQUAD_DIR}/data/estilo-ativo.yaml") as f:
        style_name = yaml.safe_load(f)["estilo_ativo"]

with open(f"{SQUAD_DIR}/data/estilos/{style_name}.yaml") as f:
    s = yaml.safe_load(f)

# default robusto caso yaml antigo nao tenha o campo
MAX_LINE = s.get("max_chars_per_line", 24)

print(f"[stylist] usando estilo '{s['nome']}' — {s['descricao']}")

video = args.video
base = os.path.splitext(video)[0]
output = args.output or f"{base}_final.mp4"

probe = subprocess.run(["ffprobe","-v","error","-select_streams","v:0",
    "-show_entries","stream=width,height","-of","csv=p=0",video],
    capture_output=True, text=True).stdout.strip()
TW, TH = map(int, probe.split(","))

# ─── le transcript ───
raw_events = []
for line in open(args.transcript).read().splitlines():
    mt = re.match(r"\[(\d+:\d+:\d+\.\d+) --> (\d+:\d+:\d+\.\d+)\]\s*(.+)", line)
    if mt:
        def ts(t):
            h,m,s_ = t.split(":")
            return int(h)*3600 + int(m)*60 + float(s_)
        st, en, tx = ts(mt.group(1))/SPEED, ts(mt.group(2))/SPEED, mt.group(3).strip()
        if tx: raw_events.append((st, en, tx))

# ─── agrupa chunks ───
# OBS: agrupamento agora pode juntar ate MAX_WORDS/MAX_DUR — a quebra em linhas
# visuais cabe direto. Isso permite legendas maiores e melhor leitura.
events = []
i = 0
MAX_CHARS_GROUP = s["max_chars"]   # tamanho total alvo apos agrupar
MAX_WORDS, MAX_DUR = s["max_words"], s["max_dur"]
while i < len(raw_events):
    st, en, tx = raw_events[i]
    words = tx.split()
    j = i + 1
    while j < len(raw_events):
        nxt = raw_events[j][2].split()
        new_chars = len(" ".join(words + nxt))
        if (new_chars <= MAX_CHARS_GROUP and len(words)+len(nxt) <= MAX_WORDS
                and raw_events[j][1]-st <= MAX_DUR):
            words += nxt; en = raw_events[j][1]; j += 1
        else: break
    events.append((st, en, " ".join(words).upper().rstrip(".,;:")))
    i = j

# ─── helpers ───
FS, BW = s["fontsize"], s["borderw"]
LH = FS + 16
Y_TOP = int(TH * s["y_pos"])

def esc(t):
    t = t.replace("'","").replace('"','')
    t = t.replace("\\","\\\\").replace(":","\\:").replace("%","%%")
    return t

def draw(text, color, y, st, en):
    parts = [
        f"drawtext=font='{s['font']}'",
        f"text='{esc(text)}'",
        f"fontcolor={color}",
        f"fontsize={FS}",
        f"x=(w-text_w)/2",
        f"y={y}",
        f"enable='between(t,{st:.3f},{en:.3f})'",
    ]
    if BW > 0:
        parts.insert(4, f"borderw={BW}")
        parts.insert(5, f"bordercolor={s['bordercolor']}")
    if s.get("shadow"):
        parts.insert(4, f"shadowx={s['shadowx']}")
        parts.insert(5, f"shadowy={s['shadowy']}")
        parts.insert(6, f"shadowcolor={s['shadowcolor']}")
    return ":".join(parts)

def quebrar_em_linhas(text, max_per_line):
    """Quebra texto em N linhas que cabem em max_per_line caracteres cada."""
    words = text.split()
    if not words: return []
    linhas = []
    atual = [words[0]]
    atual_chars = len(words[0])
    for w in words[1:]:
        novo = atual_chars + 1 + len(w)
        if novo > max_per_line:
            linhas.append(" ".join(atual))
            atual = [w]; atual_chars = len(w)
        else:
            atual.append(w); atual_chars = novo
    if atual: linhas.append(" ".join(atual))
    return linhas

def split_60_40_words(words):
    """Divide palavras 60/40 entre top e bot (modo split_60_40_color)."""
    n = len(words)
    if n == 0: return [], []
    if n == 1: return [], words
    if n == 2: return [words[0]], [words[1]]
    if n == 3: return words[:2], words[2:]
    cut = max(1, int(round(n * 0.6)))
    return words[:cut], words[cut:]

def render_lines(linhas, color, y_start, st, en):
    """Renderiza N linhas verticalmente empilhadas a partir de y_start."""
    out = []
    for i, ln in enumerate(linhas):
        out.append(draw(ln, color, y_start + i*LH, st, en))
    return out

# ─── monta filters segundo o mode ───
filters = []
for st, en, tx in events:
    if s["mode"] == "single":
        # quebra em N linhas seguras, mesma cor
        linhas = quebrar_em_linhas(tx, MAX_LINE)
        filters.extend(render_lines(linhas, s["fontcolor"], Y_TOP, st, en))

    elif s["mode"] == "split_60_40_color":
        # divide palavras 60/40 e cada parte vira N linhas seguras
        words = tx.split()
        top_w, bot_w = split_60_40_words(words)
        top_lines = quebrar_em_linhas(" ".join(top_w), MAX_LINE) if top_w else []
        bot_lines = quebrar_em_linhas(" ".join(bot_w), MAX_LINE) if bot_w else []

        # top branco no Y_TOP, bot amarelo logo abaixo
        if top_lines:
            filters.extend(render_lines(top_lines, s["fontcolor"], Y_TOP, st, en))
        if bot_lines:
            color_bot = s.get("linha_2_color", s["fontcolor"])
            y_bot = Y_TOP + len(top_lines)*LH
            filters.extend(render_lines(bot_lines, color_bot, y_bot, st, en))

    else:
        raise ValueError(f"mode desconhecido: {s['mode']}")

graph = "[0:v]" + ",".join(filters) + "[outv]"
ff = f"/tmp/cap_filter_{os.getpid()}.txt"
open(ff,"w").write(graph)
subprocess.run(["ffmpeg","-y","-i",video,"-filter_complex_script",ff,
    "-map","[outv]","-map","0:a",
    "-c:v","libx264","-preset","fast","-crf","18",
    "-pix_fmt","yuv420p","-profile:v","main","-level","4.0",
    "-movflags","+faststart",
    "-c:a","aac","-b:a","192k", output], check=True, capture_output=True)
os.remove(ff)

print(f"chunks: {len(raw_events)} -> legendas: {len(events)} (media {sum(len(e[2].split()) for e in events)/len(events):.1f} palavras)")
print(f"quebra automatica em linhas (max {MAX_LINE} chars/linha) — texto nunca estoura tela")
if SPEED != 1.0:
    print(f"timestamps reescalados /={SPEED} (video acelerado {SPEED}x)")
print(f"output: {output}")
