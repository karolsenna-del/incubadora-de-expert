---
task: "Document Process"
responsavel: "@live-deck-builder"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Processo ou padrão de slide executado que precisa ser documentado"
Saida: "SOP adicionado ao Playbook e/ou padrão adicionado ao catálogo na KB"
execution_type: "sequential"
---

# Task: Document Process — Documentar Processo ou Padrão Novo

## Objetivo

Transformar processo executado em SOP reutilizável no Playbook, ou um tipo de slide novo em entrada permanente do catálogo.

## Trigger

Automático após missão nova OU `*document` OU "documenta esse padrão"

## Passos

1. Identificar o que documentar: um processo (SOP) ou um tipo de slide novo (catálogo)
2. Se processo: reconstruir os passos executados, pré-condições, inputs/outputs, pontos de erro
3. Se tipo de slide: descrever quando usar, estrutura esperada, origem (qual live gerou o padrão)
4. Adicionar no arquivo certo:
   - SOP → `data/live-deck-builder-playbook.md`
   - Tipo de slide → `data/live-deck-builder-kb.md`, seção de catálogo
5. Se for processo recorrente, referenciar no `execute-mission.md`

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
