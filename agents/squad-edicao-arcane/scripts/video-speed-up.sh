#!/usr/bin/env bash
# speed-up.sh — acelera video mantendo pitch (atempo + setpts)
# uso: speed-up.sh <video> [<speed>] [<output>]
# default speed: 1.2
set -euo pipefail

VIDEO="${1:?uso: speed-up.sh <video> [<speed>] [<output>]}"
SPEED="${2:-1.2}"
DEFAULT_OUT="${VIDEO%.*}_speed$(echo "$SPEED" | tr -d '.').mp4"
OUTPUT="${3:-$DEFAULT_OUT}"

ffmpeg -y -i "$VIDEO" \
  -filter_complex "[0:v]setpts=PTS/$SPEED[v];[0:a]atempo=$SPEED[a]" \
  -map "[v]" -map "[a]" \
  -c:v libx264 -preset fast -crf 18 \
  -pix_fmt yuv420p -profile:v main -level 4.0 \
  -movflags +faststart \
  -c:a aac -b:a 192k \
  "$OUTPUT"

ORIG_DUR=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VIDEO")
NEW_DUR=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUTPUT")
echo "speed: ${SPEED}x"
# LC_NUMERIC=C garante printf com ponto decimal (locale pt-BR usa virgula e quebra %.1f)
LC_NUMERIC=C printf "original: %.1fs -> acelerado: %.1fs\n" "$ORIG_DUR" "$NEW_DUR"
echo "output: $OUTPUT"
