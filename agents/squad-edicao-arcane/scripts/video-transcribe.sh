#!/usr/bin/env bash
# transcribe.sh — extrai audio + whisper com prompt de nomes proprios do Euriler
# uso: transcribe.sh <video> [<output_path_txt>]
# output default: /tmp/transcript_raw.txt
set -euo pipefail

# binarios do Homebrew (ffmpeg/whisper-cli) — evita versoes de conda/build
# estatico no PATH. Cai pro PATH so se nao houver brew.
_bin(){ for b in /opt/homebrew/bin /usr/local/bin; do [ -x "$b/$1" ] && { echo "$b/$1"; return; }; done; command -v "$1" 2>/dev/null || echo "$1"; }
FFMPEG="$(_bin ffmpeg)"; WHISPER="$(_bin whisper-cli)"

VIDEO="${1:?uso: transcribe.sh <video> [<output.txt>]}"
OUT="${2:-/tmp/transcript_raw.txt}"
MODEL="/opt/homebrew/share/whisper-cpp/models/ggml-medium.bin"
PROMPT="Euriler, Workshop Negocio Digital do Futuro, Bia, Arka, NDF, inteligencia artificial, lancador"

WAV="/tmp/whisper_$$.wav"
"$FFMPEG" -y -i "$VIDEO" -ar 16000 -ac 1 -f wav "$WAV" 2>/dev/null
"$WHISPER" -m "$MODEL" -l pt -ml 32 -sow --prompt "$PROMPT" -f "$WAV" 2>/dev/null > "$OUT"
rm -f "$WAV"
echo "transcript raw em: $OUT"
echo "linhas: $(wc -l < "$OUT")"
