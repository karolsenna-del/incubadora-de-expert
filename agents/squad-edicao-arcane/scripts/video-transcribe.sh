#!/usr/bin/env bash
# transcribe.sh — extrai audio + whisper com prompt de nomes proprios do Euriler
# uso: transcribe.sh <video> [<output_path_txt>]
# output default: /tmp/transcript_raw.txt
set -euo pipefail

VIDEO="${1:?uso: transcribe.sh <video> [<output.txt>]}"
OUT="${2:-/tmp/transcript_raw.txt}"
MODEL="/opt/homebrew/share/whisper-cpp/models/ggml-medium.bin"
PROMPT="Euriler, Workshop Negocio Digital do Futuro, Bia, Arka, NDF, inteligencia artificial, lancador"

WAV="/tmp/whisper_$$.wav"
ffmpeg -y -i "$VIDEO" -ar 16000 -ac 1 -f wav "$WAV" 2>/dev/null
whisper-cli -m "$MODEL" -l pt -ml 32 -sow --prompt "$PROMPT" -f "$WAV" 2>/dev/null > "$OUT"
rm -f "$WAV"
echo "transcript raw em: $OUT"
echo "linhas: $(wc -l < "$OUT")"
