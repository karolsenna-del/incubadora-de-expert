---
task: "Gerar Scripts"
responsavel: "@estrategista-copy-ads"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Use case, objetivo, público e ação definidos"
Saida: "3 ângulos de script por look elegível, cada um com justificativa"
Checklist:
  - "3 ângulos gerados (por look elegível)"
  - "Cada script calibrado pra duração do use case"
  - "Hook nos 3 primeiros segundos em cada um"
  - "Regra anti-promessa-pesada aplicada"
  - "Justificativa de cada ângulo escrita"
execution_type: "interactive"
---

# Task: Gerar Scripts — Os 3 Ângulos

## Executive Summary

O estrategista gera os scripts. Por padrão, 3 ângulos por look elegível, cada um calibrado pra duração do use case e pro tom do look. Texto escrito pra ser falado, hook na abertura, regra anti-promessa aplicada em cada linha.

## Steps

### Step 1: Carregar as regras de copy

Ler `data/regras-copy-ads.md` — as regras inegociáveis (sem promessa de resultado, sem entregável específico, tom do dono da marca).

### Step 2: Escolher os ângulos

Da biblioteca de ângulos, escolher 3 que encaixem na intenção:
- **Confronto** — verdade inconveniente, peso
- **Diagnóstico** — "não era culpa sua, era o modelo"
- **Inimigo nomeado** — aponta o vilão concreto
- **Ruminação** — pensamento em voz alta
- **Provocação** — pergunta que incomoda
- **Insight** — virada súbita

### Step 3: Escrever os scripts

Para cada ângulo, escrever o script:
- Calibrado pra duração (ad ~25-30s ≈ 65-75 palavras; orgânico mais; long-form em blocos)
- Hook na primeira frase
- Texto pra ser FALADO — frases curtas, ritmo de fala
- Sem promessa de resultado, sem entregável específico
- CTA leve no fim (ad) ou nenhum (orgânico)

### Step 4: Justificar cada ângulo

Uma linha por script: por que esse ângulo encaixa nessa intenção.

### Step 5: Handoff

Passar os 3 scripts pro Chief apresentar (task `validar-scripts`).

## Error Handling

| Cenário | Ação |
|---------|------|
| Usuário pediu promessa pesada | Recusar, explicar, oferecer versão reescrita sem a promessa |
| Script estourou a duração do use case | Sinalizar e oferecer versão enxuta |
| Intenção ainda confusa | Voltar pra `processar-input` |
