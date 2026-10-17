---
task: "Document Process"
responsavel: "@garimpeiro-leads-instagram"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Missão/rodada executada"
Saida: "Playbook e Mission Log atualizados"
execution_type: "semantic"
---

# Task: Document Process

1. Registrar no Mission Log: `| N | AAAA-MM-DD | missão | ok/parcial/falhou | SOP? | obs |`
2. Processo novo → SOP no Playbook (template no fim do arquivo). Caminho mudou → atualizar SOP existente.
3. Rodada → linha em "Rendimento por termo".
4. Incidente → regra nova em `garimpeiro-leads-instagram-rules.md` (contexto, motivo, checklist) + linha no registro de incidentes.
5. Descoberta técnica (ator, campo, preço) → KB.
Nunca registrar dado de prospect (nome, @, bio) em nenhum desses arquivos — eles vão pro git.
