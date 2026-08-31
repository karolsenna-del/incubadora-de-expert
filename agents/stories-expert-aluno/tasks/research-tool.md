---
task: "Research Tool"
responsavel: "@stories-expert-aluno"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Pedido de pesquisa sobre um tema/dispositivo"
Saida: "Síntese adicionada à Foundation KB"
execution_type: "sequential"
---

# Task: Research Tool

## Trigger

"pesquisa um jeito melhor de fazer story sobre X", "tem algum dispositivo bom pra Y"

## Passos

1. Se a dúvida for sobre um dispositivo específico do método, consultar a fonte completa (`agents/etlmaker/kbs/stories-10x/VOL-03-dispositivos-engenharia-social.md`) antes de responder — nunca inventar dispositivo que não está na fonte
2. Se for pesquisa externa (mudança na plataforma Instagram, etc), usar WebSearch
3. Sintetizar e adicionar à Foundation KB com a fonte
4. Reportar o que encontrou
