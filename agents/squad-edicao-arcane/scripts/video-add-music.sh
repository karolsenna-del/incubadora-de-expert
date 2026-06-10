#!/usr/bin/env bash
# video-add-music.sh — mixa trilha de fundo com ducking automatico.
# uso: video-add-music.sh <video> [<trilha>] [<output>] [<volume>]
#   <trilha>  default: data/trilhas/default.mp3 do squad
#   <volume>  default: 0.18 (audivel nas pausas, voz ainda manda)
# Ducking balanceado: threshold=0.1 ratio=4 release=150ms — trilha respira nas
# pausas em vez de ficar 100% esmagada. Validado em talking-head 32s.
# Output 8-bit yuv420p Main + AAC 192k. -c:v copy (nao re-encoda video).
set -euo pipefail
export LC_NUMERIC=C

# ffmpeg/ffprobe do Homebrew (bottle completo, com sidechaincompress) — evita um
# ffmpeg de conda/build estatico no PATH que possa faltar filtros.
_bin(){ for b in /opt/homebrew/bin /usr/local/bin; do [ -x "$b/$1" ] && { echo "$b/$1"; return; }; done; command -v "$1" 2>/dev/null || echo "$1"; }
FFMPEG="$(_bin ffmpeg)"; FFPROBE="$(_bin ffprobe)"

SQUAD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

VIDEO="${1:?uso: video-add-music.sh <video> [<trilha>] [<output>] [<volume>]}"
TRILHA="${2:-$SQUAD_DIR/data/trilhas/default.mp3}"
DEFAULT_OUT="${VIDEO%.*}_final.mp4"
OUTPUT="${3:-$DEFAULT_OUT}"
VOLUME="${4:-0.18}"

if [[ ! -f "$TRILHA" ]]; then
  echo "❌ trilha nao encontrada: $TRILHA"
  echo "   passe uma trilha como 2º argumento, ou ponha uma em data/trilhas/default.mp3"
  exit 1
fi

DUR=$("$FFPROBE" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VIDEO")
FADE_OUT=$(awk "BEGIN{printf \"%.3f\", $DUR-2.5}")

FF="/tmp/music_filter_$$.txt"
cat > "$FF" <<EOF
[1:a]volume=${VOLUME},afade=t=in:st=0:d=2,afade=t=out:st=${FADE_OUT}:d=2.5[music];
[0:a]asplit=2[voice][sc];
[music][sc]sidechaincompress=threshold=0.1:ratio=4:attack=15:release=150:makeup=1:level_sc=1[ducked];
[voice][ducked]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[aout]
EOF

"$FFMPEG" -y -i "$VIDEO" -stream_loop -1 -i "$TRILHA" \
  -filter_complex_script "$FF" \
  -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k -t "$DUR" \
  "$OUTPUT" 2>&1 | tail -2

rm -f "$FF"
echo "✓ trilha aplicada: volume=${VOLUME}, ducking balanceado (voz manda, trilha respira nas pausas)"
echo "  output: $OUTPUT"
