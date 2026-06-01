---
task: "List Templates"
responsavel: "@carrossel-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Aluno quer ver templates salvos"
Saida: "Lista + previews abertos"
execution_type: "interactive"
---

# Task: List Templates

## Executive Summary

Lista templates salvos com metadados e abre previews no Finder.

## Steps

### Step 1: Ler Templates

```bash
TEMPLATES_DIR="$HOME/.carrossel-arcane/templates"

if [ ! -d "$TEMPLATES_DIR" ] || [ -z "$(ls -A "$TEMPLATES_DIR" 2>/dev/null)" ]; then
  echo "Nao tens templates ainda. Vou te passar pro Identity Designer pra criar."
  # rotear pra setup-identity
  exit 0
fi

for tmpl in "$TEMPLATES_DIR"/*/; do
  NAME=$(grep "^name:" "$tmpl/meta.yaml" | cut -d'"' -f2)
  TYPE=$(grep "^type:" "$tmpl/meta.yaml" | cut -d'"' -f2)
  DIMENSIONS=$(grep "^dimensions:" "$tmpl/meta.yaml" | cut -d'"' -f2)
  echo "- $NAME ($TYPE, $DIMENSIONS)"
done
```

### Step 2: Mostrar

```
=== TEMPLATES SALVOS ({N}) ===

1. Capa Minimalista (capa, 1080x1350)
2. Conteudo Padrao (conteudo, 1080x1350)
3. CTA Limpo (cta, 1080x1350)

Vou abrir os previews no Finder.
```

```bash
open $(find "$TEMPLATES_DIR" -name "preview.png")
```

### Step 3: Oferecer Acoes

```
O que queres fazer?

1. Produzir carrossel com esses
2. Produzir post estatico
3. Adicionar template novo
4. So queria ver, sair
```

## Veto Conditions

| Cenario | Acao |
|---------|------|
| Sem templates | Rotear pra `setup-identity` |
| Pasta de templates corrompida | Alertar e oferecer recriar |
