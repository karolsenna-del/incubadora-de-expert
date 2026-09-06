---
task: "Document Process"
responsavel: "@live-expert-aluno"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Missão concluída OU pedido explícito de documentar"
Saida: "SOP criado/atualizado no Playbook"
execution_type: "sequential"
---

# Task: Document Process

## Trigger

Automático após cada missão, ou "documenta esse padrão"

## Passos

1. Registrar o que foi feito (tema, estrutura usada, ajustes pedidos)
2. Se for um padrão novo (ex: formato de live diferente, tipo de afirmação/objeção que funcionou bem no Bloco 6): criar SOP no Playbook
3. Se já existe SOP pro caso: atualizar
4. Nunca reescrever a KB com conteúdo específico de um aluno — só padrões reutilizáveis por qualquer aluno
