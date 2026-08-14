#!/usr/bin/env python3
"""
video-speed-up.py — acelera video mantendo pitch (atempo + setpts).
uso: video-speed-up.py <video> [<speed>] [<output>]
default speed: 1.2

Cross-platform (porta do antigo video-speed-up.sh). So precisa de ffmpeg/ffprobe —
roda com python puro, nao precisa do venv. A formatacao de float do Python usa ponto
sempre, entao o antigo Bug 4 (locale pt-BR quebrando printf %.1f) nao existe mais.
"""
import sys, os, subprocess, argparse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common

FFMPEG = _common.ffmpeg()
FFPROBE = _common.ffprobe()

p = argparse.ArgumentParser()
p.add_argument("video")
p.add_argument("speed", nargs="?", default="1.2")
p.add_argument("output", nargs="?", default=None)
args = p.parse_args()

video = args.video
speed = args.speed
base = os.path.splitext(video)[0]
output = args.output or f"{base}_speed{speed.replace('.', '')}.mp4"

subprocess.run([FFMPEG, "-y", "-i", video,
    "-filter_complex", f"[0:v]setpts=PTS/{speed}[v];[0:a]atempo={speed}[a]",
    "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18",
    "-pix_fmt", "yuv420p", "-profile:v", "main", "-level", "4.0",
    "-movflags", "+faststart",
    "-c:a", "aac", "-b:a", "192k",
    output], check=True)


def dur(path):
    out = subprocess.run([FFPROBE, "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", path],
        capture_output=True, text=True).stdout.strip()
    return float(out)


print(f"speed: {speed}x")
print(f"original: {dur(video):.1f}s -> acelerado: {dur(output):.1f}s")
print(f"output: {output}")
