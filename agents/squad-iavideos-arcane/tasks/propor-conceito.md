---
task: "Propor Conceito"
responsavel: "@estrategista-criativo"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Roteiro classificado (da task processar-input)"
Saida: "Leque de formatos, ângulos e hooks proposto, cada um com justificativa"
Checklist:
  - "Múltiplos formatos propostos (nunca aposta única)"
  - "Cada formato com justificativa do porquê encaixa"
  - "Hooks indicados por formato"
  - "Proposta entregue ao Chief para validação com o usuário"
execution_type: "semantic"
---

# Task: Propor Conceito

## Executive Summary

O estrategista-criativo pega o roteiro e propõe um leque de formatos, ângulos e hooks. Nunca uma aposta única — variar e testar é a estratégia. O usuário escolhe; o estrategista fundamenta.

## Steps

### Step 1: Mapear formato à mensagem

Analisar o tom e a intenção do roteiro (autoridade? identificação? urgência?) e cruzar com o catálogo de formatos da KB (`data/melhores-praticas-anuncio.md`): founder-led, UGC de persona, listicle, PAS, VSL, how-to.

### Step 2: Montar o leque

Decision point (PU-has-015) — sem lógica determinística. Propor 2-4 formatos, cada um com:

- O formato e o hook recomendado
- A justificativa: por que encaixa nessa mensagem
- O que esse formato testa (qual ângulo/intenção)

### Step 3: Entregar ao Chief

Devolver o leque ao iavideos-chief, que apresenta ao usuário na task `validar-conceito`. O estrategista não decide — propõe.

## Error Handling

| Cenário | Ação |
|---------|------|
| Roteiro encaixa em um formato só | Ainda assim oferecer variações de hook/ângulo dentro do formato |
| Usuário pede formato fora do catálogo | Mostrar os formatos disponíveis e mapear a intenção pro mais próximo |
| Roteiro fraco demais pra qualquer formato | Devolver pra processar-input: o problema é o roteiro, não o formato |
