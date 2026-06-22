---
task: "Document Process"
responsavel: "@insta-scheduler"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Processo executado que precisa ser documentado"
Saida: "SOP adicionado ao Playbook"
execution_type: "sequential"
---

# Task: Document Process — Documentar Processo como SOP

## Objetivo

Transformar processo executado em SOP reutilizável no Playbook.

## Trigger

Automático após missão nova OU `*document` OU "documenta X"

## Passos

1. Identificar o processo a documentar
2. Reconstruir os passos executados (com detalhes suficientes pra repetir)
3. Identificar pré-condições, inputs, outputs
4. Identificar pontos de erro e como tratá-los
5. Adicionar SOP no Playbook (`data/insta-scheduler-playbook.md`)
6. Referenciar o SOP no execute-mission.md se for processo recorrente

## Template de SOP

```markdown
### SOP-{N}: {Nome do Processo}

**Trigger:** {quando executar}
**Input:** {o que entra}
**Output:** {o que sai}
**Regras obrigatórias:** {regras específicas deste SOP}

**Passos:**
1. {passo 1}
2. {passo 2}
...

**Error handling:**
| Cenário | Ação |
|---------|------|
| {cenário} | {ação} |
```
