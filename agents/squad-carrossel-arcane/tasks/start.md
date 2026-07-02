---
task: "Start"
responsavel: "@carrossel-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativacao via /squad-carrossel-arcane"
Saida: "Greeting + estado detectado + handoff pro fluxo correto"
execution_type: "interactive"
---

# Task: Start — Entry Point

## Executive Summary

Detecta se aluno tem templates salvos. Sem templates → Setup. Com templates → menu de producao.

## Steps

### Step 1: Detectar Estado

```bash
TEMPLATES_DIR="$HOME/.carrossel-arcane/templates"
if [ -d "$TEMPLATES_DIR" ] && [ "$(ls -A "$TEMPLATES_DIR" 2>/dev/null)" ]; then
  COUNT=$(ls -1 "$TEMPLATES_DIR" | wc -l)
  STATE="ready"
else
  STATE="first_use"
fi
```

### Step 2: Greeting

**Se `first_use`:**

```
=== SQUAD CARROSSEL ARCANE · v1.1.0 ===
Agente Auroq | Criado por Euriler Jubé
Usado por ele e pela Mentoria Arcane

Primeira vez aqui. Antes de produzir, preciso criar teus templates visuais.

Vou te passar pro Identity Designer — ele monta 3-5 templates baseados nas
tuas referencias (Pinterest, prints de IG, identidade visual ou descricao).

Comecamos?
```

→ Se sim, executar task `setup-identity`

**Se `ready` (com N templates):**

```
=== SQUAD CARROSSEL ARCANE ===
Agente Auroq | Criado por Euriler Jubé
Usado por ele e pela Mentoria Arcane

Tens {N} templates salvos. O que vamos fazer?

1. Produzir carrossel (multi-slide)
2. Produzir post estatico (1 imagem)
3. Adicionar novo template
4. Ver templates salvos

Escolhe.
```

→ Rotear conforme escolha:
- 1 → task `produce-carousel`
- 2 → task `produce-static-post`
- 3 → task `add-template`
- 4 → task `list-templates`

## Regras

- NAO listar todos os comandos
- NAO explicar o pipeline completo
- Ir direto ao ponto
