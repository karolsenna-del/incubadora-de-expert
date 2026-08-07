---
task: "Generate Starters"
responsavel: "@gpt-publisher"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Tasks/modos da mente de origem"
Saida: "Lista de conversation starters (tipicamente 4)"
Checklist:
  - "Cada starter reflete um modo/task real da mente"
  - "Linguagem natural, como a aluna falaria"
  - "Curtos (1 linha)"
execution_type: "sequential"
---

# Task: Generate Starters — Gerar Conversation Starters

## Objetivo

Criar os prompts de exemplo que aparecem quando a aluna abre o GPT pela primeira vez, derivados dos modos/tasks reais da mente de origem — não inventados.

## Trigger

Quarto passo de `execute-mission.md`, após `prepare-knowledge.md`.

## Passos

### Step 1: Listar Triggers das Tasks

Pra cada task identificada em `extract-mind.md`, extrair o trigger (frase ou intenção que ativa aquele modo).

Exemplo (ExpertViral): task `roteirizar.md` tem trigger relacionado a criar roteiro de vídeo → starter possível: "Quero roteirizar um vídeo sobre [tema]"

### Step 2: Priorizar os Mais Relevantes

SE há mais de 4 modos/tasks, escolher os 4 que representam:
1. O uso mais comum/óbvio (a razão principal de existir)
2. Um uso alternativo relevante
3. Um uso de diagnóstico/consultoria (se existir)
4. Um uso menos óbvio que mostra a amplitude do agente

### Step 3: Escrever em Linguagem Natural

Cada starter deve soar como algo que a aluna digitaria, não como nome técnico de task:
- ❌ "Executar task roteirizar"
- ✅ "Quero roteirizar um vídeo sobre [tema]"

Manter curto — 1 linha, sem explicação adicional.

### Step 4: Apresentar pra Revisão

Os starters entram no pacote apresentado no Step de Apresentação de `execute-mission.md` — Karol pode ajustar antes da publicação (autonomia nível 5, Advise).

## Output

```
=== CONVERSATION STARTERS ===
1. {starter 1}
2. {starter 2}
3. {starter 3}
4. {starter 4}
```

## Error Handling

| Cenário | Ação |
|---------|------|
| Mente tem só 1-2 tasks | Gerar só os starters que fazem sentido, não forçar 4 |
| Trigger da task é vago ou técnico demais | Reformular em linguagem natural baseado no propósito da task, não traduzir literalmente |
