---
task: "Document Process"
responsavel: "@vendedor-expert"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Missão nova executada com sucesso, ou pedido 'documenta isso'"
Saida: "SOP novo ou atualizado no Playbook"
Checklist:
  - "Verificado se já existe SOP"
  - "SOP no template padrão"
  - "Sem dado pessoal"
execution_type: "semantic"
---

# Task: Document Process

1. Procurar SOP parecido em `data/vendedor-expert-playbook.md` — existe → atualizar (Última execução, passos, troubleshooting)
2. Não existe → criar `[SOP-0xx]` no template do Playbook, no tier certo (Recorrente · Sob demanda · One-shot)
3. Preencher "Regras obrigatórias" com as R-0xx que se aplicam
4. Exemplos de mensagem no SOP: genéricos, com `[nome]` — nunca texto real de lead (R-005)
5. Avisar a Karol em 1 linha: "Criei o SOP-0xx ({nome}). Da próxima vez sigo ele direto."
