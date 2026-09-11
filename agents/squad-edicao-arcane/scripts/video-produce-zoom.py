#!/usr/bin/env python3
"""
video-produce-zoom.py — zoom dinamico baseado em sections JSON.
uso: video-produce-zoom.py <video> <sections.json> [<output>] [--speed FLOAT]

Sections JSON tem trechos com label normal/emphasis/critical.
Cada label vira um zoom diferente (mais aperto pro critical).
Adaptado pra source vertical (1080x1920) — cropa fracao centrada no rosto.

Deteccao de rosto via YuNet (cv2.FaceDetectorYN) — nao Haar Cascade. A partir do
opencv-python-headless 5.0.0, cv2.CascadeClassifier foi removido da API Python
(nao e so falta do XML — a classe nao existe mais), ver knowledge/04-troubleshooting.md
Bug 12. Requer models/face_detection_yunet_2023mar.onnx (baixado pelo install.py).

--speed: reescalada start/end de cada section dividindo por SPEED. Use quando
o video ja foi acelerado mas as sections foram montadas com timestamps do
transcript pre-speed. Default 1.0 (sem reescala).

Executar com o Python do venv (Windows: .venv/Scripts/python.exe · Mac/Linux: .venv/bin/python3).
"""
import sys, subprocess, os, json, cv2, statistics, argparse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common

FFMPEG = _common.ffmpeg()

ap = argparse.ArgumentParser()
ap.add_argument("video")
ap.add_argument("sections")
ap.add_argument("output", nargs="?", default=None)
ap.add_argument("--speed", type=float, default=1.0,
    help="fator de reescala de timestamps. Use o mesmo speed aplicado ao video. Default 1.0")
ar = ap.parse_args()

video = ar.video
sjson = ar.sections
base = os.path.splitext(video)[0]
output = ar.output or f"{base}_zoomed.mp4"
SPEED = ar.speed if ar.speed > 0 else 1.0

# ─── carrega sections ───
data = json.load(open(sjson))
sections = data["sections"]
if SPEED != 1.0:
    for sec in sections:
        sec["start"] = sec["start"] / SPEED
        sec["end"]   = sec["end"]   / SPEED
    print(f"timestamps de sections reescalados /={SPEED}")
zoom_fracs = {  # fracao do height usada (resto vira crop)
    "normal":   1.00,   # frame inteiro
    "emphasis": 0.85,   # cropa ~15%
    "critical": 0.70,   # cropa ~30%
}

# ─── face detection (YuNet — ver nota no docstring) ───
cap = cv2.VideoCapture(video)
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
yunet_model = os.path.join(_common.SQUAD_DIR, "models", "face_detection_yunet_2023mar.onnx")
detector = cv2.FaceDetectorYN_create(yunet_model, "", (width, height), 0.7, 0.3, 5000)

centers = []
for fi in [int(total*i/10) for i in range(10)]:
    cap.set(cv2.CAP_PROP_POS_FRAMES, fi)
    ret, frame = cap.read()
    if not ret: continue
    detector.setInputSize((frame.shape[1], frame.shape[0]))
    _, faces = detector.detect(frame)
    if faces is not None and len(faces):
        faces = sorted(faces, key=lambda f: f[2]*f[3], reverse=True)
        x,y,w,h = faces[0][:4]
        centers.append((int(x+w/2), int(y+h/2)))
cap.release()

if centers:
    mx = statistics.median(c[0] for c in centers)
    my = statistics.median(c[1] for c in centers)
    centers = [c for c in centers if abs(c[0]-mx) < width*0.3 and abs(c[1]-my) < height*0.3]
if centers:
    fcx = int(sum(c[0] for c in centers)/len(centers))
    fcy = int(sum(c[1] for c in centers)/len(centers))
else:
    fcx, fcy = width//2, height//2

print(f"source: {width}x{height} | rosto detectado em {len(centers)}/10 frames, centro ({fcx},{fcy})")

# ─── monta filter_complex por section ───
TW, TH = 1080, 1920  # output sempre 1080x1920
parts = []
for i, sec in enumerate(sections):
    frac = zoom_fracs[sec["label"]]
    ch = int(height * frac)
    cw = int(ch * 9 / 16)  # mantem aspect 9:16
    cw -= cw % 2; ch -= ch % 2
    cx = max(0, min(fcx - cw//2, width - cw))
    cy = max(0, min(fcy - int(ch*0.30), height - ch))  # rosto no terço superior
    parts.append(
        f"[0:v]trim=start={sec['start']:.6f}:end={sec['end']:.6f},"
        f"setpts=PTS-STARTPTS,crop={cw}:{ch}:{cx}:{cy},"
        f"scale={TW}:{TH}:flags=lanczos[v{i}];"
    )
parts.append("".join(f"[v{i}]" for i in range(len(sections)))
    + f"concat=n={len(sections)}:v=1:a=0[outv]")

ff = _common.tmp_path(".txt")
open(ff,"w").write("\n".join(parts))
subprocess.run([FFMPEG,"-y","-i",video,"-filter_complex_script",ff,
    "-map","[outv]","-map","0:a",
    "-c:v","libx264","-preset","fast","-crf","18",
    "-pix_fmt","yuv420p","-profile:v","main","-level","4.0",
    "-movflags","+faststart",
    "-c:a","aac","-b:a","192k", output], check=True, capture_output=True)
os.remove(ff)

import collections
dist = collections.Counter(s["label"] for s in sections)
print(f"secoes: {len(sections)} | distribuicao: {dict(dist)}")
print(f"output: {output}")
