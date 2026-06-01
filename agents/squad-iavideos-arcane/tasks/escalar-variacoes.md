---
task: "Escalar Variações"
responsavel: "@operador-higgsfield"
responsavel_type: "interactive"
atomic_layer: "task"
Entrada: "Peça(s) aprovada(s) no feedback loop"
Saida: "Variações da peça-base produzidas conforme escolha do usuário"
Checklist:
  - "Usuário consultado: quantas variações + qual eixo"
  - "Variações geradas no eixo escolhido (avatar / copy / formato / combinação)"
  - "Cada variação preserva o que foi aprovado na peça-base"
  - "Lote final consistente com a copy/conceito aprovado"
execution_type: "interactive"
---

# Task: Escalar Variações

## Executive Summary

Com peça-base aprovada, o operador escala em variações. O usuário define quantas e qual eixo — o squad não decide automaticamente.

## Steps

### Step 1: Perguntar ao usuário

Decision point (PU-has-017). Duas definições:

- **Quantas** variações
- **Qual eixo:**
  - (a) Mesma copy, formatos diferentes — testa qual formato vende melhor
  - (b) Mesmo formato, copies diferentes — testa qual ângulo pega
  - (c) Os dois — leque mais largo, mais crédito

### Step 2: Produzir as variações

Conforme o eixo escolhido:

- **Eixo a:** mantém copy e persona aprovadas, varia formato/modo (UGC → talking head → listicle, etc)
- **Eixo b:** mantém formato e persona, varia o roteiro (estrategista entrega novas copies)
- **Eixo c:** combina os dois

Rodar `higgsfield generate create marketing_studio_video` para cada variação.

### Step 3: Rodar Virality Predictor

Pontuar cada variação como na task `avaliar-viralidade`. Isso ajuda o usuário a priorizar ao subir nas campanhas.

### Step 4: Encaminhar pra entrega

Devolver ao Chief com o lote completo + notas.

## Error Handling

| Cenário | Ação |
|---------|------|
| Usuário pede volume muito grande de cara | Lembrar custo; sugerir lote intermediário |
| Eixo escolhido não faz sentido pra peça (ex: variar copy quando o forte é a copy) | Apontar e sugerir o eixo melhor |
| Falha de rede no meio | Recuperar jobs pelo ID; só regerar o que falhou |
