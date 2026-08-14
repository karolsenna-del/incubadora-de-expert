# Renderizar HTML → PNG

## Stack

Usar **Chromium headless** (via Playwright ou Chrome for Testing) pra renderizar HTML como PNG. Confiavel, pixel-perfect, suporta CSS moderno e Google Fonts.

## Instalacao do Chromium

### Se ja tem Playwright instalado

```bash
npx @playwright/mcp install-browser chromium
```

Binario fica em:
```
~/Library/Caches/ms-playwright/chromium-{version}/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing
```

### Se nao tem

Instalar Playwright:

```bash
npm install -g @playwright/test
npx playwright install chromium
```

Ou alternativa: usar Chrome ja instalado no sistema (`/Applications/Google Chrome.app/...`).

## Comando de Renderizacao

```bash
# Localizar binario do Chrome
CHROME=$(find ~/Library/Caches/ms-playwright -name "Google Chrome for Testing" -type f 2>/dev/null | head -1)

if [ -z "$CHROME" ]; then
  # Fallback pro Chrome do sistema
  CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
fi

# Renderizar HTML → PNG
"$CHROME" --headless \
  --disable-gpu \
  --hide-scrollbars \
  --window-size=1080,1350 \
  --screenshot="$OUTPUT_PNG" \
  "file://$INPUT_HTML"
```

## Argumentos Explicados

| Flag | Funcao |
|------|--------|
| `--headless` | Sem UI, roda em background |
| `--disable-gpu` | Estabilidade em headless (necessario em alguns sistemas) |
| `--hide-scrollbars` | Sem scrollbar no screenshot |
| `--window-size=W,H` | Define viewport (W x H) |
| `--screenshot=PATH` | Salva screenshot no path |
| `file://PATH.html` | Arquivo local (precisa caminho absoluto) |

## Tratando Erros

### "Browser not installed"
```bash
npx @playwright/mcp install-browser chromium
```

### "Failed to take screenshot"
- Verificar se HTML existe e e valido
- Verificar permissao de escrita na pasta de output
- Logar `chrome --headless` sem `--screenshot` pra debug

### Imagem com tamanho errado
- Forcar dimensoes no CSS do HTML:
  ```css
  body { width: 1080px; height: 1350px; overflow: hidden; }
  ```
- E manter `--window-size` igual

### Fontes Google Fonts nao carregam
- Aguardar carregamento: usar `--virtual-time-budget=5000` (5s)
- Ou embutir fonte como base64 no CSS

## Script Reusavel

Salvar em `tools/render.sh`:

```bash
#!/bin/bash
# Uso: ./render.sh <input.html> <output.png> [width] [height]

set -euo pipefail

INPUT_HTML="$1"
OUTPUT_PNG="$2"
WIDTH="${3:-1080}"
HEIGHT="${4:-1350}"

CHROME=$(find ~/Library/Caches/ms-playwright -name "Google Chrome for Testing" -type f 2>/dev/null | head -1)

if [ -z "$CHROME" ]; then
  CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
fi

if [ ! -f "$CHROME" ]; then
  echo "ERRO: Chrome nao encontrado. Instale: npx @playwright/mcp install-browser chromium"
  exit 1
fi

INPUT_ABS=$(realpath "$INPUT_HTML")

"$CHROME" --headless \
  --disable-gpu \
  --hide-scrollbars \
  --window-size="${WIDTH},${HEIGHT}" \
  --virtual-time-budget=3000 \
  --screenshot="$OUTPUT_PNG" \
  "file://$INPUT_ABS" 2>&1 | grep -v "^$" | tail -1

if [ ! -f "$OUTPUT_PNG" ]; then
  echo "ERRO: PNG nao foi gerado"
  exit 1
fi

echo "OK: $OUTPUT_PNG"
```

Tornar executavel: `chmod +x tools/render.sh`

## Performance

- 1 render: ~1-2 segundos
- 15 slides em batch: ~20-30 segundos
- Renderizar em paralelo (background jobs) acelera mas nao e necessario
