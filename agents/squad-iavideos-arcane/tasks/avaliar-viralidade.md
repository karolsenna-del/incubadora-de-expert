---
task: "Avaliar Viralidade"
responsavel: "@operador-higgsfield"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Peças produzidas (URLs do Higgsfield)"
Saida: "Cada peça com sua nota do Virality Predictor (hook, retenção, atenção)"
Checklist:
  - "Virality Predictor rodado em cada peça produzida"
  - "Nota e relatório capturados por peça"
  - "Peças identificadas como abaixo do threshold mínimo destacadas"
  - "QG-IAV-02 cumprido (nenhuma peça apresentada sem nota)"
execution_type: "deterministic"
---

# Task: Avaliar Viralidade

## Executive Summary

Quality gate QG-IAV-02. Antes de qualquer peça chegar ao usuário, o operador roda o Virality Predictor (`brain_activity`) — dado objetivo de hook, retenção e atenção. Isso reduz as voltas do feedback loop: o usuário avalia com número na mão.

## Steps

### Step 1: Rodar o Virality Predictor

Para cada peça produzida:

```bash
higgsfield generate create brain_activity --video <peça_url_ou_id> --wait
```

O modelo é o `brain_activity` — input é o vídeo, output é um relatório de texto com score geral, pico de hook, sustain e link para o relatório completo.

### Step 2: Capturar os scores

Extrair:
- **Score geral** (0-100)
- **Peak hook** (segundo do pico de atenção)
- **Sustain** (% de retenção)
- **Open report URL** (link pro relatório completo)

### Step 3: Aplicar a regra dos 3 segundos

Se o pico de hook está depois do segundo 3 — peça não prende. Destacar isso ao Chief, que vai apresentar.

### Step 4: Encaminhar pra apresentação

Devolver ao iavideos-chief: lista de peças com nota + observações. O Chief apresenta na task `apresentar-pecas`.

## Error Handling

| Cenário | Ação |
|---------|------|
| Virality Predictor retorna erro | Reportar ao Chief; nota fica como "indisponível", apresentar sem ela |
| Conta sem créditos pra rodar a análise | Avisar o usuário; opcional pular a análise nessa rodada |
| Nota baixa em todas as peças | Sinalizar ao Chief — pode indicar problema no conceito, não só na produção |
