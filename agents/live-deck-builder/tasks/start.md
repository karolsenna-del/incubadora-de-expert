---
task: "Start"
responsavel: "@live-deck-builder"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativação do worker pelo usuário"
Saida: "Worker ativo, base carregada, pronto pra montar deck"
Checklist:
  - "Persona carregada"
  - "Rules carregadas"
  - "Greeting exibido"
  - "Roteiros pendentes verificados"
execution_type: "interactive"
---

# Task: Start — Entry Point do Live Deck Builder

## Objetivo

Ativar o Live Deck Builder e verificar se há roteiros de live sem deck correspondente.

## Trigger

- `/live-deck-builder` ou `*start`

## Passos

### Step 1: Carregar Base (SEMPRE)

Estes arquivos são carregados em TODA ativação:

1. Ler e adotar persona de `agents/live-deck-builder/agents/live-deck-builder.md`
2. Carregar Regras Operacionais: `agents/live-deck-builder/data/live-deck-builder-rules.md`

### Step 2: Verificar Roteiros Pendentes

Listar `business/campanhas/lives-semanais/live-*-roteiro.md` e comparar com `live-*-apresentacao.html` existentes.

- SE há roteiro sem apresentação correspondente → sinalizar no greeting
- SE todos os roteiros já têm deck → informar no greeting

### Step 3: Exibir Greeting

```
=== LIVE DECK BUILDER · v1.0.0 ===
Agente Auroq | Criado por Euriler Jubé
Usado por ele e pela Mentoria Arcane

Executor de deck visual. Roteiro pronto entra,
apresentação pronta pra Zoom sai — sem Gamma, sem imagem paga.

{SE HÁ ROTEIRO SEM DECK}
Sem deck ainda:
  • Live {N} — {tema}

Monto?

{SE TUDO EM DIA}
Todos os roteiros já têm deck. Nova live ou ajuste em algum já entregue?
```

### Step 4: Aguardar Instrução

Com a resposta do usuário, identificar o modo:

| Intent | Task |
|--------|------|
| Montar deck de uma live específica | `execute-mission` |
| Ajustar deck já entregue | `adjust-deck` |
| Live com formato diferente do padrão | `research-tool` |
| Deck não ficou bom / está repetitivo | `diagnose-issue` |
| Documentar um padrão novo de slide | `document-process` |

## Error Handling

| Cenário | Ação |
|---------|------|
| Pasta `business/campanhas/lives-semanais/` sem roteiro nenhum | Informar: "Não achei roteiro nenhum ainda. Me passa o path do roteiro da live quando tiver pronto." |
| Usuário não sabe o que quer | Perguntar: "Quer montar deck de alguma live específica, ou tem outra coisa?" |
