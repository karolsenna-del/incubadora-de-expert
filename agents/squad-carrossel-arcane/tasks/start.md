---
task: "Start"
responsavel: "@carrossel-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativacao via /squad-carrossel-arcane"
Saida: "Apresentacao do squad + estado detectado + handoff pro fluxo correto"
execution_type: "interactive"
---

# Task: Start — Entry Point

## Executive Summary

Apresenta o squad (o que faz, o que nao faz, as duas camadas visuais, quem faz o
que), detecta os padroes que o usuario ja tem salvos e roteia. Sem template de
arte → Setup. Com template de arte → menu de producao.

## Steps

### Step 1: Detectar Estado

Duas pastas, dois padroes independentes:

```bash
TEMPLATES_DIR="$HOME/.carrossel-arcane/templates"      # arte CSS (Identity Designer)
STYLES_DIR="$HOME/.carrossel-arcane/image-styles"      # estilo de imagem IA (Image Director)

if [ -d "$TEMPLATES_DIR" ] && [ "$(ls -A "$TEMPLATES_DIR" 2>/dev/null)" ]; then
  TEMPLATES=$(ls -1 "$TEMPLATES_DIR")
  TEMPLATE_COUNT=$(ls -1 "$TEMPLATES_DIR" | wc -l | tr -d ' ')
  STATE="ready"
else
  TEMPLATE_COUNT=0
  STATE="first_use"
fi

if [ -d "$STYLES_DIR" ] && [ "$(ls -A "$STYLES_DIR" 2>/dev/null)" ]; then
  STYLES=$(ls -1 "$STYLES_DIR")
  STYLE_COUNT=$(ls -1 "$STYLES_DIR" | wc -l | tr -d ' ')
else
  STYLE_COUNT=0
fi
```

> O estado que decide o roteamento e o **template de arte**. Estilo de imagem e
> opcional — sem ele, o Image Director calibra na hora.
> Alem dos estilos do usuario, o squad ja traz estilos embarcados em
> `knowledge/image-styles/` (ex.: `euriler`) — mencionar como disponiveis.

### Step 2: Apresentacao + Greeting

O texto oficial do greeting vive em **`agents/carrossel-chief.md` → secao
"Greeting (FONTE CANONICA)"**. Emitir de la, na integra. NAO reescrever nem
resumir aqui — uma copia so, pra nunca divergir.

Ordem de emissao:

1. **Bloco de apresentacao** (sempre, nos dois estados) — abre com:

```
=== SQUAD CARROSSEL ARCANE · v1.2.0 ===
```

   e segue com: o que faz · o que nao faz · as duas camadas visuais
   ([1] arte em CSS, gratis, feita aqui · [2] imagem de IA, GPT Image 2 /
   Nano Banana Pro, gasta credito) · os dois padroes reutilizaveis ·
   quem faz o que.

2. **Bloco de estado + acao**, conforme `STATE`:
   - `first_use` → bloco "TEU ESTADO AGORA / nenhum" + convite pro Identity Designer
   - `ready` → bloco "TEU ESTADO AGORA" preenchido com `TEMPLATE_COUNT`/`TEMPLATES` e
     `STYLE_COUNT`/`STYLES`, seguido do menu de 6 opcoes

### Step 3: Rotear

**Se `first_use`** e o usuario confirmar → task `setup-identity` (@identity-designer)

**Se `ready`**, conforme a escolha:

| Opcao | Rota |
|-------|------|
| 1 — Gerar imagens de IA dos cards | @image-director → `calibrate-image-style` → `produce-card-images` |
| 2 — Montar carrossel | @producer → `produce-carousel` |
| 3 — Montar post estatico | @producer → `produce-static-post` |
| 4 — Criar/ajustar template de arte CSS | @identity-designer → `add-template` |
| 5 — Criar/ajustar estilo de imagem | @image-director → `calibrate-image-style` → `save-image-style` |
| 6 — Ver o que tenho salvo | `list-templates` |

## Regras

- NUNCA pular o bloco de apresentacao — e ele que ensina o usuario a usar o squad
- Deixar explicito o que gasta credito (imagem de IA) e o que nao gasta (arte CSS)
- NAO listar os comandos `*` sem ser perguntado
- NAO explicar o pipeline interno de cada agente — so quem faz o que
- Depois do greeting, ir direto ao ponto
