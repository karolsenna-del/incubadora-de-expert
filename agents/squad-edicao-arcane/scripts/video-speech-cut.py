#!/usr/bin/env python3
"""
video-speech-cut.py — corte por fala usando Silero VAD (modo agressivo: minima respiracao)
uso: video-speech-cut.py <video> [<output>] [--scale WxH]

Executar com o Python do venv (Windows: .venv/Scripts/python.exe · Mac/Linux: .venv/bin/python3).
O venv local do squad e criado pelo install.py.
"""
import sys, subprocess, os, argparse, torch
from scipy.io import wavfile
from silero_vad import load_silero_vad, get_speech_timestamps

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common

FFMPEG = _common.ffmpeg()
FFPROBE = _common.ffprobe()

p = argparse.ArgumentParser()
p.add_argument("video")
p.add_argument("output", nargs="?", default=None)
p.add_argument("--scale", default="1080:1920",
    help="resolucao do output, default 1080:1920 portrait")
# defaults agressivos pra cortar respiracao
p.add_argument("--threshold", type=float, default=0.6,
    help="prob minima de fala (0.5=tolerante, 0.6=agressivo default, 0.7=so fala clara)")
p.add_argument("--min-silence-ms", type=int, default=80,
    help="gaps de fala >= isso viram corte. 80=agressivo default")
p.add_argument("--min-speech-ms", type=int, default=120)
p.add_argument("--pad-ms", type=int, default=30,
    help="padding antes/depois da fala. 30=minimo pra nao cortar consoante")
args = p.parse_args()

video = args.video
base = os.path.splitext(video)[0]
output = args.output or f"{base}_speechcut.mp4"
scale = args.scale.replace("x", ":")

wav = _common.tmp_path(".wav")
subprocess.run([FFMPEG,"-y","-i",video,"-ar","16000","-ac","1","-f","wav",wav],
    capture_output=True, check=True)

model = load_silero_vad()
sr, data = wavfile.read(wav)
os.remove(wav)
audio = torch.from_numpy(data.astype('float32') / 32768.0)

ts = get_speech_timestamps(audio, model, sampling_rate=16000,
    threshold=args.threshold,
    min_silence_duration_ms=args.min_silence_ms,
    min_speech_duration_ms=args.min_speech_ms,
    speech_pad_ms=args.pad_ms,
    return_seconds=True)

duration = float(subprocess.run([FFPROBE,"-v","error","-show_entries","format=duration",
    "-of","default=noprint_wrappers=1:nokey=1",video],capture_output=True,text=True).stdout.strip())
segs = [[max(0.0,t['start']), min(duration,t['end'])] for t in ts]

if not segs:
    print("nenhum bloco de fala detectado"); sys.exit(1)

parts = []
for i,(s,e) in enumerate(segs):
    parts.append(f"[0:v]trim=start={s:.6f}:end={e:.6f},setpts=PTS-STARTPTS,scale={scale}:flags=lanczos[v{i}];")
    parts.append(f"[0:a]atrim=start={s:.6f}:end={e:.6f},asetpts=PTS-STARTPTS[a{i}];")
parts.append("".join(f"[v{i}][a{i}]" for i in range(len(segs)))
    + f"concat=n={len(segs)}:v=1:a=1[outv][outa]")
ff = _common.tmp_path(".txt")
open(ff,"w").write("\n".join(parts))
subprocess.run([FFMPEG,"-y","-i",video,"-filter_complex_script",ff,
    "-map","[outv]","-map","[outa]",
    "-c:v","libx264","-preset","fast","-crf","18",
    "-pix_fmt","yuv420p","-profile:v","main","-level","4.0",
    "-movflags","+faststart",
    "-c:a","aac","-b:a","192k", output], check=True, capture_output=True)
os.remove(ff)

kept = sum(e-s for s,e in segs)
print(f"params: threshold={args.threshold} min_silence={args.min_silence_ms}ms pad={args.pad_ms}ms")
print(f"blocos de FALA: {len(segs)} -> {len(segs)-1} jumpcuts")
print(f"original: {duration:.1f}s -> cortado: {kept:.1f}s")
print(f"removido (sem fala): {duration-kept:.1f}s ({(duration-kept)/duration*100:.0f}%)")
print(f"output: {output}")
