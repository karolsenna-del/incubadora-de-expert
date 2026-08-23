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

# Localizar Chromium — cross-platform (Mac local, Linux/nuvem via ambientes CCR)
CHROME=""
for path in \
  $(find ~/Library/Caches/ms-playwright -name "Google Chrome for Testing" -type f 2>/dev/null) \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium" \
  $(command -v google-chrome-stable 2>/dev/null) \
  $(command -v google-chrome 2>/dev/null) \
  $(command -v chromium-browser 2>/dev/null) \
  $(command -v chromium 2>/dev/null) \
  $(find /opt/pw-browsers -maxdepth 3 -type f \( -iname "chrome" -o -iname "headless_shell" \) 2>/dev/null | head -1) \
  $(find ~/.cache/ms-playwright -maxdepth 3 -type f \( -iname "chrome" -o -iname "headless_shell" \) 2>/dev/null | head -1) \
  $(find ~/AppData/Local/ms-playwright -maxdepth 3 -iname "chrome.exe" 2>/dev/null | sort -r | head -1) \
  ; do
  if [ -n "$path" ] && [ -f "$path" ] && [ -x "$path" ]; then
    CHROME="$path"
    break
  fi
done

if [ -z "$CHROME" ]; then
  echo "ERRO: Chromium nao encontrado."
  echo "Mac: npx @playwright/mcp install-browser chromium"
  echo "Linux/ambiente CCR: verificar /opt/pw-browsers ou ~/.cache/ms-playwright"
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

# Montar a URL file:// — em Windows/git-bash, o binario nativo (.exe) nao entende
# path POSIX (/tmp/...) dentro da string file://, precisa virar path Windows (C:\...)
# via cygpath antes. Em Mac/Linux, o path POSIX normal funciona direto.
if command -v cygpath >/dev/null 2>&1 && [[ "$CHROME" == *.exe ]]; then
  INPUT_URL="file:///$(cygpath -w "$INPUT_ABS" | sed 's#\\#/#g')"
else
  INPUT_URL="file://$INPUT_ABS"
fi

# Renderizar
"$CHROME" --headless \
  --disable-gpu \
  --hide-scrollbars \
  --window-size="${WIDTH},${HEIGHT}" \
  --virtual-time-budget=3000 \
  --screenshot="$OUTPUT_PNG" \
  "$INPUT_URL" 2>&1 | tail -1

if [ ! -f "$OUTPUT_PNG" ]; then
  echo "ERRO: PNG nao foi gerado"
  exit 1
fi

echo "OK: $OUTPUT_PNG (${WIDTH}x${HEIGHT})"
