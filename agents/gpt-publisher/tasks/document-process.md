---
task: "Document Process"
responsavel: "@gpt-publisher"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Processo executado que precisa ser documentado"
Saida: "SOP adicionado ao Playbook"
execution_type: "sequential"
---

# Task: Document Process — Documentar Processo como SOP

## Objetivo

Transformar uma publicação executada em SOP reutilizável no Playbook — principalmente útil pra registrar o fluxo exato do Playwright no GPT Builder (criação vs. edição), já que isso não vinha documentado antes deste worker existir.

## Trigger

Automático após a primeira missão de cada tipo (criação nova, atualização) OU `*document` OU "documenta X"

## Passos

1. Identificar o processo a documentar (ex: "fluxo de criação de GPT novo via Playwright")
2. Reconstruir os passos executados com detalhe suficiente pra repetir (seletores usados, ordem de campos preenchidos, cliques)
3. Identificar pré-condições, inputs, outputs
4. Identificar pontos de erro encontrados e como foram tratados
5. Adicionar SOP no Playbook (`data/gpt-publisher-playbook.md`)
6. Se for processo recorrente, referenciar o SOP em `publish-gpt.md`

## Template de SOP

```markdown
### SOP-{N}: {Nome do Processo}

**Trigger:** {quando executar}
**Input:** {o que entra}
**Output:** {o que sai}
**Regras obrigatórias:** {regras específicas deste SOP, ver gpt-publisher-rules.md}

**Passos:**
1. {passo 1}
2. {passo 2}
...

**Error handling:**
| Cenário | Ação |
|---------|------|
| {cenário} | {ação} |
```

## Error Handling

| Cenário | Ação |
|---------|------|
| Processo mudou desde a última vez que foi documentado (OpenAI alterou o fluxo) | Atualizar o SOP existente, não criar um duplicado |
