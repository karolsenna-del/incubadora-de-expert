---
task: "Processar Input"
responsavel: "@estrategista-copy-ads"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Intenção do usuário (ideia, objetivo do vídeo)"
Saida: "Use case confirmado, público e ação-alvo identificados"
Checklist:
  - "Use case identificado (UC1-UC4)"
  - "Objetivo do vídeo claro (pra quê)"
  - "Público-alvo da mensagem identificado (pra quem)"
  - "Ação esperada identificada (qual CTA)"
execution_type: "interactive"
---

# Task: Processar Input — Classificação da Intenção

## Executive Summary

O estrategista recebe a intenção do usuário e a classifica: use case, objetivo, público, ação esperada. Isso calibra o tipo de script que será gerado. Input vago vira script ruim — o estrategista pergunta o suficiente antes de escrever.

## Steps

### Step 1: Ler a intenção

Receber do Chief o que o usuário trouxe e o use case preliminar.

### Step 2: Calibrar com 3 perguntas (se necessário)

Se a intenção vier vaga, perguntar:
1. **Pra quê** — vender, atrair pra evento, crescer audiência, ensinar?
2. **Pra quem** — qual o público que vai ver?
3. **Qual ação** — o que o espectador deve fazer depois?

### Step 3: Confirmar o use case

- **UC1 — Ad curto:** 10-30s, hook forte, CTA claro
- **UC2 — Conteúdo orgânico:** 30-90s, reflexivo, CTA leve ou nenhum
- **UC3 — Long-form:** até 3 min, estruturado em blocos
- **UC4 — A/B de look:** script já existe, vai direto pro diretor

### Step 4: Handoff

Passar pra task `gerar-scripts` com use case, objetivo, público e ação definidos.

## Error Handling

| Cenário | Ação |
|---------|------|
| Intenção vaga demais | Fazer as 3 perguntas de calibragem antes de seguir |
| Use case ambíguo | Devolver ao Chief pra confirmar com o usuário |
| Usuário não sabe o objetivo | Ajudar a definir: o vídeo precisa de um objetivo pra ter um bom script |
