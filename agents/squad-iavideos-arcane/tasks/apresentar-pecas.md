---
task: "Apresentar Peças"
responsavel: "@iavideos-chief"
responsavel_type: "interactive"
atomic_layer: "task"
Entrada: "Peças produzidas + notas do Virality Predictor"
Saida: "Peças apresentadas ao usuário em formato avaliável (peça + nota)"
Checklist:
  - "Cada peça apresentada com sua nota de viralidade"
  - "Regra dos 3 segundos aplicada (peças que não prendem destacadas)"
  - "Apresentação clara e enxuta (formato consumível)"
execution_type: "interactive"
---

# Task: Apresentar Peças

## Executive Summary

O Chief mostra ao usuário cada peça produzida acompanhada da nota do Virality Predictor — peça e dado lado a lado. Aplica a regra dos 3 segundos antes da avaliação, destacando peças cujo hook não prende.

## Steps

### Step 1: Montar a apresentação

Para cada peça:

```
PEÇA N — formato: {formato}, persona: {avatar}
URL: {link da peça}
Virality Predictor: {score}/100 (pico hook em {Ns}, sustain {N%})
{Se peak_hook > 3s: ⚠️ HOOK NÃO PRENDE NOS 3 SEGUNDOS}
```

### Step 2: Apresentar ao usuário

Mostrar a lista de peças + notas + observações. Não YAML — formato legível.

### Step 3: Coletar a avaliação inicial

Perguntar quais peças o usuário gostou. Se possível, perguntar o porquê — alimenta a regeneração das outras na task `feedback-loop`.

## Error Handling

| Cenário | Ação |
|---------|------|
| Peça com nota muito baixa em todas as métricas | Apontar antes do usuário avaliar — provável regerar |
| Peça aprovada cujo hook não prende em 3s | Bloquear aprovação antes de seguir; sugerir regerar o arranque |
| Usuário não consegue acessar a URL | Reapresentar; se persistir, peça pro operador re-disponibilizar |
