---
task: "Produce Static Post"
responsavel: "@producer"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Aluno quer post estatico (1 imagem so)"
Saida: "1 PNG em ~/Downloads/{nome}/"
execution_type: "interactive"
---

# Task: Produce Static Post

## Executive Summary

Variacao de `produce-carousel` pra 1 slide so. Mesmo fluxo, sem inferencia de multiplos slides.

## Steps

### Step 1: Receber Copy

```
Cola o texto do post estatico aqui.
Pode ser headline + corpo, ou so headline, ou texto livre.
```

### Step 2: Escolher Template

Listar templates compativeis (tipos: `capa`, `quote`, `stats`, `lista`, ou qualquer template marcado como adequado a posts unicos):

```bash
TEMPLATES_DIR="$HOME/.carrossel-arcane/templates"
# filtrar templates adequados a post estatico
```

Abrir previews:

```bash
open $(find "$TEMPLATES_DIR" -name "preview.png")
```

Aluno escolhe.

### Step 3: Resolver Placeholders

Igual ao Step 5 de `produce-carousel`, mas pra 1 slide so:
- `image-ai` → gera + aprova
- `image-manual` → aluno envia
- `image-none` → renderiza direto

### Step 4: Renderizar

```bash
NOME="${NOME:-post-$(date +%Y-%m-%d-%H%M)}"
OUTPUT_DIR="$HOME/Downloads/$NOME"
mkdir -p "$OUTPUT_DIR"

CHROME=$(find ~/Library/Caches/ms-playwright -name "Google Chrome for Testing" -type f 2>/dev/null | head -1)

# Post estatico pode ser 1080x1080 (quadrado) ou 1080x1350 (vertical) — aluno escolhe
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --window-size=1080,1350 \
  --screenshot="$OUTPUT_DIR/post.png" \
  "file:///tmp/post.html"
```

### Step 5: Entrega

```
Pronto. Post em:

~/Downloads/{nome}/post.png

Abrir agora?
```

## Quality Gates

- 1 PNG renderizado em 1080x1080 ou 1080x1350
- Pasta existe e acessivel

## Veto Conditions

| Cenario | Acao |
|---------|------|
| Aluno sem templates | Rotear pra `setup-identity` |
| Template escolhido inadequado pra post unico | Avisar e sugerir outros |
