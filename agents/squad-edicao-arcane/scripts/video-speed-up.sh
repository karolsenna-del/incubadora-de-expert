#!/usr/bin/env bash
# speed-up.sh — acelera video mantendo pitch (atempo + setpts)
# uso: speed-up.sh <video> [<speed>] [<output>]
# default speed: 1.2
set -euo pipefail

# ffmpeg/ffprobe do Homebrew (bottle completo) — evita um ffmpeg de conda/build
# estatico no PATH que possa faltar filtros. Cai pro PATH so se nao houver brew.
_bin(){ for b in /opt/homebrew/bin /usr/local/bin; do [ -x "$b/$1" ] && { echo "$b/$1"; return; }; done; command -v "$1" 2>/dev/null || echo "$1"; }
FFMPEG="$(_bin ffmpeg)"; FFPROBE="$(_bin ffprobe)"

VIDEO="${1:?uso: speed-up.sh <video> [<speed>] [<output>]}"
SPEED="${2:-1.2}"
DEFAULT_OUT="${VIDEO%.*}_speed$(echo "$SPEED" | tr -d '.').mp4"
OUTPUT="${3:-$DEFAULT_OUT}"

"$FFMPEG" -y -i "$VIDEO" \
  -filter_complex "[0:v]setpts=PTS/$SPEED[v];[0:a]atempo=$SPEED[a]" \
  -map "[v]" -map "[a]" \
  -c:v libx264 -preset fast -crf 18 \
  -pix_fmt yuv420p -profile:v main -level 4.0 \
  -movflags +faststart \
  -c:a aac -b:a 192k \
  "$OUTPUT"

ORIG_DUR=$("$FFPROBE" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VIDEO")
NEW_DUR=$("$FFPROBE" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUTPUT")
echo "speed: ${SPEED}x"
# LC_NUMERIC=C garante printf com ponto decimal (locale pt-BR usa virgula e quebra %.1f)
LC_NUMERIC=C printf "original: %.1fs -> acelerado: %.1fs\n" "$ORIG_DUR" "$NEW_DUR"
echo "output: $OUTPUT"
