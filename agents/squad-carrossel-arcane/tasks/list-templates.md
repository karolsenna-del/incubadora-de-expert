---
task: "List Templates"
responsavel: "@carrossel-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Aluno quer ver o que ja tem salvo"
Saida: "Lista dos dois padroes (arte CSS + estilo de imagem) + previews abertos"
execution_type: "interactive"
---

# Task: List Templates

## Executive Summary

Lista os **dois padroes reutilizaveis** do aluno — templates de arte em CSS
(camada 1) e estilos de imagem de IA (camada 2) — com metadados, e abre os
previews de arte no Finder.

## Steps

### Step 1: Ler os Templates de Arte (camada 1 — CSS)

```bash
TEMPLATES_DIR="$HOME/.carrossel-arcane/templates"

if [ ! -d "$TEMPLATES_DIR" ] || [ -z "$(ls -A "$TEMPLATES_DIR" 2>/dev/null)" ]; then
  echo "Sem template de arte ainda — sem ele nao da pra montar post."
  # rotear pra setup-identity
else
  for tmpl in "$TEMPLATES_DIR"/*/; do
    NAME=$(grep "^name:" "$tmpl/meta.yaml" | cut -d'"' -f2)
    TYPE=$(grep "^type:" "$tmpl/meta.yaml" | cut -d'"' -f2)
    DIMENSIONS=$(grep "^dimensions:" "$tmpl/meta.yaml" | cut -d'"' -f2)
    echo "- $NAME ($TYPE, $DIMENSIONS)"
  done
fi
```

### Step 2: Ler os Estilos de Imagem (camada 2 — IA)

Dois lugares: os do aluno e os embarcados no squad.

```bash
STYLES_DIR="$HOME/.carrossel-arcane/image-styles"

# estilos do aluno
if [ -d "$STYLES_DIR" ] && [ "$(ls -A "$STYLES_DIR" 2>/dev/null)" ]; then
  ls -1 "$STYLES_DIR"
else
  echo "(nenhum estilo proprio — o Image Director calibra na hora)"
fi

# estilos embarcados no squad (sempre disponiveis, ex.: euriler)
ls -1 knowledge/image-styles/ 2>/dev/null
```

### Step 3: Mostrar

```
=== O QUE TU JA TEM SALVO ===

CAMADA 1 — TEMPLATES DE ARTE (CSS, sem custo de API)
  1. Capa Minimalista (capa, 1080x1350)
  2. Conteudo Padrao (conteudo, 1080x1350)
  3. CTA Limpo (cta, 1080x1350)

CAMADA 2 — ESTILOS DE IMAGEM (IA, gasta credito)
  Teus:       {lista ou "nenhum ainda"}
  Embarcados: euriler

Vou abrir os previews de arte no Finder.
```

```bash
open $(find "$TEMPLATES_DIR" -name "preview.png")
```

### Step 4: Oferecer Acoes

```
O que queres fazer?

1. Gerar as imagens de IA de um carrossel   (Image Director)
2. Montar carrossel                          (Producer)
3. Montar post estatico                      (Producer)
4. Adicionar template de arte                (Identity Designer)
5. Criar/ajustar estilo de imagem            (Image Director)
6. So queria ver, sair
```

## Veto Conditions

| Cenario | Acao |
|---------|------|
| Sem template de arte | Rotear pra `setup-identity` (bloqueia producao) |
| Sem estilo de imagem | Nao bloqueia — avisar que o Image Director calibra na hora |
| Pasta de templates corrompida | Alertar e oferecer recriar |
