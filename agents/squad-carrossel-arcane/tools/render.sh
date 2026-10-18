#!/bin/bash
# render.sh — Renderiza HTML como PNG via Chromium headless
# Uso: ./render.sh <input.html> <output.png> [width] [height]
# Default: 1080x1350 (carrossel Instagram)

set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Uso: $0 <input.html> <output.png> [width=1080] [height=1350]"
  exit 1
fi

INPUT_HTML="$1"
OUTPUT_PNG="$2"
WIDTH="${3:-1080}"
HEIGHT="${4:-1350}"

# Localizar Chromium
CHROME=""
for path in \
  $(find ~/Library/Caches/ms-playwright -name "Google Chrome for Testing" -type f 2>/dev/null) \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium" \
  ; do
  if [ -f "$path" ]; then
    CHROME="$path"
    break
  fi
done

if [ -z "$CHROME" ]; then
  echo "ERRO: Chromium nao encontrado."
  echo "Instale via: npx @playwright/mcp install-browser chromium"
  exit 1
fi

# Verificar input
if [ ! -f "$INPUT_HTML" ]; then
  echo "ERRO: HTML nao encontrado: $INPUT_HTML"
  exit 1
fi

# Garantir caminho absoluto
INPUT_ABS=$(cd "$(dirname "$INPUT_HTML")" && pwd)/$(basename "$INPUT_HTML")

# Garantir pasta de output
mkdir -p "$(dirname "$OUTPUT_PNG")"

# Renderizar
"$CHROME" --headless \
  --disable-gpu \
  --hide-scrollbars \
  --window-size="${WIDTH},${HEIGHT}" \
  --virtual-time-budget=3000 \
  --screenshot="$OUTPUT_PNG" \
  "file://$INPUT_ABS" 2>&1 | tail -1

if [ ! -f "$OUTPUT_PNG" ]; then
  echo "ERRO: PNG nao foi gerado"
  exit 1
fi

echo "OK: $OUTPUT_PNG (${WIDTH}x${HEIGHT})"
