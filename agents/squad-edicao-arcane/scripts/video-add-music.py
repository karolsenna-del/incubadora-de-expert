#!/usr/bin/env python3
"""
video-add-music.py — mixa trilha de fundo com ducking automatico.
uso: video-add-music.py <video> [<trilha>] [<output>] [<volume>]
  <trilha>  default: data/trilhas/default.mp3 do squad (passe "" pra usar o default)
  <volume>  default: 0.18 (audivel nas pausas, voz ainda manda)

Ducking balanceado: threshold=0.1 ratio=4 release=150ms — trilha respira nas pausas
em vez de ficar 100% esmagada. Output: -c:v copy (nao re-encoda video) + AAC 192k.

Cross-platform (porta do antigo video-add-music.sh). So precisa de ffmpeg/ffprobe
(com sidechaincompress). Roda com python puro, nao precisa do venv.
"""
import sys, os, subprocess, argparse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common

FFMPEG = _common.ffmpeg()
FFPROBE = _common.ffprobe()

p = argparse.ArgumentParser()
p.add_argument("video")
p.add_argument("trilha", nargs="?", default=None)
p.add_argument("output", nargs="?", default=None)
p.add_argument("volume", nargs="?", default="0.18")
args = p.parse_args()

video = args.video
# "" (string vazia) tambem cai pro default
trilha = args.trilha or os.path.join(_common.SQUAD_DIR, "data", "trilhas", "default.mp3")
base = os.path.splitext(video)[0]
output = args.output or f"{base}_final.mp4"
volume = args.volume

if not os.path.isfile(trilha):
    print(f"trilha nao encontrada: {trilha}")
    print('   passe uma trilha como 2o argumento, ou ponha uma em data/trilhas/default.mp3')
    sys.exit(1)

dur = float(subprocess.run([FFPROBE, "-v", "error", "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1", video],
    capture_output=True, text=True).stdout.strip())
fade_out = dur - 2.5

filtergraph = (
    f"[1:a]volume={volume},afade=t=in:st=0:d=2,afade=t=out:st={fade_out:.3f}:d=2.5[music];\n"
    f"[0:a]asplit=2[voice][sc];\n"
    f"[music][sc]sidechaincompress=threshold=0.1:ratio=4:attack=15:release=150:makeup=1:level_sc=1[ducked];\n"
    f"[voice][ducked]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[aout]"
)
ff = _common.tmp_path(".txt")
open(ff, "w").write(filtergraph)

subprocess.run([FFMPEG, "-y", "-i", video, "-stream_loop", "-1", "-i", trilha,
    "-filter_complex_script", ff,
    "-map", "0:v", "-map", "[aout]",
    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", f"{dur}",
    output], check=True)
os.remove(ff)

print(f"trilha aplicada: volume={volume}, ducking balanceado (voz manda, trilha respira nas pausas)")
print(f"output: {output}")
