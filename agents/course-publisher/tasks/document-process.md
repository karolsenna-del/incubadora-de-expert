---
task: "Document Process"
responsavel: "@course-publisher"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Processo a documentar"
Saida: "SOP criado/atualizado no Playbook"
execution_type: "interactive"
---

# Task: Document Process

## Objetivo

Criar ou atualizar SOP no Playbook a partir de processo executado.

## Protocolo

1. Identificar o processo (nome, quando usar, inputs, outputs)
2. Documentar passos em ordem, com nivel de detalhe suficiente para re-executar sem lembrar
3. Adicionar regras obrigatorias (quais REGRA-XXX se aplicam)
4. Definir tier: Recorrente / Sob demanda / One-shot
5. Adicionar ao Playbook na secao correta
6. Se o SOP substitui um anterior: atualizar (nao duplicar)

## Template de SOP

```markdown
### SOP-XXX: {Nome do Processo}

**Quando usar:** {situacao}

**Inputs necessarios:**
- {input 1}
- {input 2}

**Passos:**
1. {passo 1}
2. {passo 2}

**Regras obrigatorias:** REGRA-XXX, REGRA-YYY
```
