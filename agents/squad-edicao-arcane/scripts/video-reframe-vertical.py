#!/usr/bin/env python3
"""
video-reframe-vertical.py — reenquadra video horizontal (16:9) pra vertical
9:16 (1080x1920), com crop que acompanha o rosto ao longo do tempo.

uso: video-reframe-vertical.py <video> [<output>] [--seg-len 3.0]

Diferenca do video-produce-zoom.py: aquele script assume que a FONTE ja e
vertical e varia o NIVEL de zoom por secao (normal/emphasis/critical, via
JSON). Este aqui parte de uma fonte HORIZONTAL e resolve o problema de
TRADUCAO horizontal — decidir que fatia 9:16 do frame largo acompanha quem
fala, pra ela nao saltar fora do quadro num plano de palco/plateia onde a
pessoa caminha.

Tecnica: divide o video em segmentos de `--seg-len` segundos, detecta o
rosto (YuNet, maior bbox) numa amostra do meio de cada segmento, e cropa
cada segmento numa posicao X diferente (crop:trim+setpts+crop+scale+concat,
mesmo padrao do video-produce-zoom.py). Isso da um tracking "em escada"
(atualiza a cada poucos segundos), nao uma panorâmica continua — suficiente
pra nao perder a pessoa de vista, sem a complexidade de uma expressao ffmpeg
dinamica por frame.

Se nenhum rosto for encontrado num segmento, mantem o X do ultimo segmento
com rosto detectado (fallback: centro do frame se nunca achou nenhum).

Executar com o Python do venv (tem cv2): Windows .venv\\Scripts\\python.exe,
Mac/Linux .venv/bin/python3.
"""
import os, sys, argparse
import cv2

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common

FFMPEG = _common.ffmpeg()
YUNET_MODEL = os.path.join(_common.SQUAD_DIR, "models", "face_detection_yunet_2023mar.onnx")

p = argparse.ArgumentParser()
p.add_argument("video")
p.add_argument("output", nargs="?", default=None)
p.add_argument("--seg-len", type=float, default=3.0,
    help="duracao de cada segmento de tracking, em segundos (default 3.0)")
args = p.parse_args()

video = args.video
base = os.path.splitext(video)[0]
output = args.output or f"{base}_9x16.mp4"
SEG_LEN = args.seg_len

if not os.path.isfile(YUNET_MODEL):
    print(f"modelo YuNet nao encontrado: {YUNET_MODEL}")
    print("rode o install.py do squad (ele baixa o modelo automaticamente)")
    sys.exit(1)

cap = cv2.VideoCapture(video)
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = cap.get(cv2.CAP_PROP_FPS) or 30
clip_dur = cap.get(cv2.CAP_PROP_FRAME_COUNT) / fps

detector = cv2.FaceDetectorYN_create(YUNET_MODEL, "", (width, height), 0.7, 0.3, 5000)

cw = int(height * 9 / 16); cw -= cw % 2  # largura do crop, aspect 9:16 exato
ch = height

n_segs = max(1, int(clip_dur // SEG_LEN) + (1 if clip_dur % SEG_LEN > 0.3 else 0))
seg_len_real = clip_dur / n_segs
last_fcx = width // 2
xs = []
for i in range(n_segs):
    t_mid = (i + 0.5) * seg_len_real
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(t_mid * fps))
    ret, frame = cap.read()
    fcx = last_fcx
    if ret:
        detector.setInputSize((frame.shape[1], frame.shape[0]))
        _, faces = detector.detect(frame)
        if faces is not None and len(faces):
            faces = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)
            x, y, w, h = faces[0][:4]
            fcx = int(x + w / 2)
            last_fcx = fcx
    cx = max(0, min(fcx - cw // 2, width - cw))
    xs.append(cx)
cap.release()

print(f"source: {width}x{height} | {n_segs} segmentos de ~{seg_len_real:.1f}s | "
      f"crop {cw}x{ch} | cx variando {min(xs)}-{max(xs)}")

parts = []
for i in range(n_segs):
    s0 = i * seg_len_real
    s1 = min(clip_dur, (i + 1) * seg_len_real)
    parts.append(
        f"[0:v]trim=start={s0:.6f}:end={s1:.6f},setpts=PTS-STARTPTS,"
        f"crop={cw}:{ch}:{xs[i]}:0,scale=1080:1920:flags=lanczos[v{i}];"
    )
parts.append("".join(f"[v{i}]" for i in range(n_segs)) + f"concat=n={n_segs}:v=1:a=0[outv]")

ff = _common.tmp_path(".txt")
with open(ff, "w", encoding="utf-8") as fout:
    fout.write("\n".join(parts))

import subprocess
subprocess.run([FFMPEG, "-y", "-i", video, "-filter_complex_script", ff,
    "-map", "[outv]", "-map", "0:a",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18",
    "-pix_fmt", "yuv420p", "-profile:v", "main", "-level", "4.0",
    "-movflags", "+faststart",
    "-c:a", "aac", "-b:a", "192k", output], check=True, capture_output=True)
os.remove(ff)

print(f"output: {output}")
