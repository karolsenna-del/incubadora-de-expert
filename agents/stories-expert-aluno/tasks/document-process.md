---
task: "Document Process"
responsavel: "@stories-expert-aluno"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Missão concluída OU pedido explícito de documentar"
Saida: "SOP criado/atualizado no Playbook"
execution_type: "sequential"
---

# Task: Document Process

## Trigger

Automático após cada missão

## Passos

1. Registrar o que foi feito (categoria, dispositivos aplicados, ajustes pedidos)
2. Se for um padrão novo (combinação de dispositivos que funcionou bem pra uma categoria): criar SOP no Playbook
3. Nunca reescrever a KB com conteúdo específico de um aluno — só padrões reutilizáveis por qualquer aluno
