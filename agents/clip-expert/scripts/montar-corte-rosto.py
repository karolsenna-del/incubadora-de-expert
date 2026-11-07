#!/usr/bin/env python3
"""
montar-corte-rosto.py — monta um corte vertical (Reels) de gravação 1:1 do Meet em
speaker view (rosto em tela cheia, sem slide). Criado 06/11/2026 (sessão Bruna).

Pipeline (reaproveita os scripts do squad-edicao-arcane):
  1. corta o trecho do vídeo bruno (ffmpeg)
  2. video-reframe-vertical.py — crop 9:16 que acompanha o rosto de quem fala
  3. video-captions.py — legenda com o estilo pedido, SEM legenda enquanto a headline aparece
  4. headline no MEIO da tela (Karol pediu em 06/11): caixa preta, letra branca,
     palavra-chave em laranja (#F05A28) — padrão da Karol (25/10 e 28/10)

uso:
  montar-corte-rosto.py <video_bruto> <transcript_bruto.txt> <offset_transcript_s>
      <inicio_s> <fim_s> "<HEADLINE BRANCA|DESTAQUE LARANJA>" <saida.mp4>
      [--style custom-karol-laranja] [--hl-dur 4.0]

<offset_transcript_s>: o transcript foi gerado a partir de um trecho que começa nesse
segundo do vídeo bruto (0 se for do vídeo inteiro).
Executar com o Python do venv do squad-edicao-arcane (tem cv2 + pyyaml).
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
p.add_argument("--style", default="custom-karol-laranja")
p.add_argument("--hl-dur", type=float, default=4.0)
p.add_argument("--hl-size", type=int, default=88)
p.add_argument("--hl-y", type=float, default=0.44)  # meio da tela (Karol, 06/11)
a = p.parse_args()

tmp = tempfile.mkdtemp(prefix="corte-")
cut = os.path.join(tmp, "cut.mp4"); vert = os.path.join(tmp, "vert.mp4")
leg = os.path.join(tmp, "leg.mp4"); trs = os.path.join(tmp, "tr.txt")

def ts(s):
    h = int(s // 3600); m = int(s % 3600 // 60); sec = s % 60
    return f"{h:02d}:{m:02d}:{sec:06.3f}"

def parse(t):
    h, m, s = t.split(":"); return int(h) * 3600 + int(m) * 60 + float(s)

# 1. corte
subprocess.run([FFMPEG, "-y", "-ss", f"{a.inicio:.3f}", "-to", f"{a.fim:.3f}", "-i", a.video,
    "-c:v", "libx264", "-preset", "fast", "-crf", "16", "-c:a", "aac", "-b:a", "192k", cut],
    check=True, capture_output=True)

# 2. vertical acompanhando o rosto. Não usa o video-reframe-vertical.py (amostra a cada 3s e
# move a cada amostra): no speaker view do Meet o quadro troca de pessoa no meio do segmento e
# o crop pegava metade do rosto (teste 06/11). Aqui: amostra a cada 0.25s, segura o enquadramento
# enquanto o rosto está perto do centro (sem tremer) e pula na hora quando o Meet troca de pessoa.
def reframe(src, dst, passo=0.25):
    import cv2
    yunet = os.path.join(ROOT, "agents", "squad-edicao-arcane", "models", "face_detection_yunet_2023mar.onnx")
    cap = cv2.VideoCapture(src)
    W = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)); H = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 24
    total = cap.get(cv2.CAP_PROP_FRAME_COUNT) / fps
    det = cv2.FaceDetectorYN_create(yunet, "", (W, H), 0.5, 0.3, 5000)
    cw = int(H * 9 / 16); cw -= cw % 2
    n = max(1, int(round(total / passo)))
    centros = []
    # leitura sequencial: o seek do OpenCV em mp4 cai em frame errado e o crop ficava
    # atrasado/adiantado em relação à troca de câmera do Meet (teste 06/11)
    alvos = [int(min(total - 0.05, i * passo + passo / 2) * fps) for i in range(n)]
    idx = -1
    for i in range(n):
        ok = True
        while idx < alvos[i] and ok:
            ok = cap.grab(); idx += 1
        ok, fr = cap.retrieve() if ok else (False, None); c = None
        if ok:
            _, faces = det.detect(fr)
            # ignora rosto pequeno (foto no porta-retrato do fundo virou alvo no teste de 06/11)
            faces = [f for f in faces if f[2] >= W * 0.08] if faces is not None else []
            if len(faces):
                f0 = max(faces, key=lambda f: f[14]); c = int(f0[0] + f0[2] / 2)  # mais confiável, não o maior (o maior às vezes é falso positivo)
        centros.append(c)
    cap.release()
    # amostra sem rosto (mão no rosto, cabeça baixa): segura a posição anterior
    conhecidos = [i for i, c in enumerate(centros) if c is not None]
    ultimo = centros[conhecidos[0]] if conhecidos else W // 2
    for i, c in enumerate(centros):
        if c is None:
            centros[i] = ultimo
        else:
            ultimo = c
    xs = []; atual = None
    for c in centros:
        if atual is None or abs(c - atual) > cw * 0.15:
            atual = c
        xs.append(max(0, min(atual - cw // 2, W - cw)))
    blocos = []  # junta amostras seguidas com o mesmo X
    for i, x in enumerate(xs):
        if blocos and blocos[-1][2] == x:
            blocos[-1][1] = i + 1
        else:
            blocos.append([i, i + 1, x])
    parts = []
    for j, (i0, i1, x) in enumerate(blocos):
        s0 = i0 * passo; s1 = total if j == len(blocos) - 1 else i1 * passo
        parts.append(f"[0:v]trim=start={s0:.3f}:end={s1:.3f},setpts=PTS-STARTPTS,"
                     f"crop={cw}:{H}:{x}:0,scale=1080:1920:flags=lanczos[v{j}];")
    parts.append("".join(f"[v{j}]" for j in range(len(blocos))) + f"concat=n={len(blocos)}:v=1:a=0[outv]")
    fs = os.path.join(tmp, "rf.txt")
    with open(fs, "w", encoding="utf-8") as f:
        f.write("\n".join(parts))
    subprocess.run([FFMPEG, "-y", "-i", src, "-filter_complex_script", fs, "-map", "[outv]", "-map", "0:a",
        "-c:v", "libx264", "-preset", "fast", "-crf", "16", "-c:a", "copy", dst], check=True, capture_output=True)
    print(f"enquadramento: {len(blocos)} posições em {total:.1f}s")

reframe(cut, vert)

# 3. transcript relativo ao corte, sem legenda durante a headline
dur = a.fim - a.inicio
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
subprocess.run([PY, os.path.join(SEA, "video-captions.py"), vert, trs, leg, "--style", a.style], check=True)

# 4. headline: parte branca | destaque laranja
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
y0 = int(1920 * a.hl_y)
font = _common.drawtext_font_opt({"font": "Bebas Neue"})
filtros = []
for i, (ln, cor) in enumerate(linhas):
    filtros.append(":".join([
        f"drawtext={font}", f"text='{esc(ln)}'", f"fontcolor={cor}", f"fontsize={a.hl_size}",
        "x=(w-text_w)/2", f"y={y0 + i * LH}", "box=1", "boxcolor=0x0B0B0C@1.0", "boxborderw=16",
        f"enable='between(t,0,{a.hl_dur})'"]))
ff = os.path.join(tmp, "hl.txt")
with open(ff, "w", encoding="utf-8") as f:
    f.write("[0:v]" + ",".join(filtros) + "[outv]")
os.makedirs(os.path.dirname(os.path.abspath(a.saida)), exist_ok=True)
subprocess.run([FFMPEG, "-y", "-i", leg, "-filter_complex_script", ff, "-map", "[outv]", "-map", "0:a",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p", "-profile:v", "main",
    "-level", "4.0", "-movflags", "+faststart", "-c:a", "copy", a.saida], check=True, capture_output=True)
shutil.rmtree(tmp, ignore_errors=True)
print(f"pronto: {a.saida} ({dur:.1f}s, headline {len(linhas)} linha(s), {len(out)} legendas)")
