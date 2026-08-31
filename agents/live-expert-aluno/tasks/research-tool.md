---
task: "Research Tool"
responsavel: "@live-expert-aluno"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Pedido de pesquisa sobre um tema/referência de live"
Saida: "Síntese adicionada à Foundation KB"
execution_type: "sequential"
---

# Task: Research Tool — Pesquisar Referência

## Trigger

"pesquisa exemplos sobre X pra live", "como outros experts abrem live sobre Y"

## Passos

1. Pesquisar via WebSearch
2. Sintetizar o que é relevante pro Funil de Zoom (não trazer formato de live genérico de mercado — sempre adaptar aos 4 blocos)
3. Adicionar à Foundation KB (`data/live-expert-aluno-kb.md`) com a fonte
4. Reportar o que encontrou
