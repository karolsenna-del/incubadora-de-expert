---
task: "Feedback Loop"
responsavel: "@iavideos-chief"
responsavel_type: "interactive"
atomic_layer: "task"
Entrada: "Peças apresentadas + avaliação inicial do usuário"
Saida: "Ao menos uma peça aprovada, pronta pra escalar"
Checklist:
  - "Feedback do usuário coletado (quais gostou + porquê quando possível)"
  - "Peças aprovadas separadas das rejeitadas"
  - "Peças rejeitadas regeneradas com a direção do usuário"
  - "Loop fechado com ao menos uma peça aprovada"
  - "QG-IAV-03 cumprido"
execution_type: "interactive"
---

# Task: Feedback Loop

## Executive Summary

O gargalo do pipeline (mitigado pelo Virality Predictor). O Chief conduz a iteração: coleta o feedback, separa aprovadas das rejeitadas, roteia a regeneração das rejeitadas para o operador, e repete até o usuário aprovar pelo menos uma peça.

## Steps

### Step 1: Coletar feedback estruturado

Para cada peça, perguntar:
- Aprovada / rejeitada
- Se aprovada: o que pegou (hook? persona? ritmo? copy?)
- Se rejeitada: o que não funcionou

Decision point (PU-has-016): se ao menos uma é aprovada → seguir; se nenhuma → todas regeneradas com nova direção.

### Step 2: Aplicar a regra dos 3 segundos

Antes de aceitar qualquer aprovação, conferir o pico de hook do Virality Predictor. Peça com hook depois do segundo 3 não passa, por mais que o usuário tenha gostado do resto. Sugerir regerar o arranque mantendo o restante.

### Step 3: Rotear regeneração

Para cada peça rejeitada, devolver pro operador-higgsfield com a direção específica:
- O que mudar (hook, persona, ritmo, formato)
- O que manter

Operador re-roda `produzir-pecas` + `avaliar-viralidade` para essas peças.

### Step 4: Quality Gate QG-IAV-03

Loop fecha quando há ao menos uma peça aprovada. Sem peça aprovada, não passa pra escala.

## Error Handling

| Cenário | Ação |
|---------|------|
| Usuário rejeita tudo várias rodadas | Voltar pro estrategista — o problema pode ser do conceito, não da produção |
| Usuário aprova peça com hook fraco | Bloquear; sugerir regerar só o arranque |
| Loop excede 4-5 rodadas sem convergir | Pausar, oferecer revisão do conceito antes de gastar mais crédito |
| Usuário some no meio do loop | Salvar o estado (aprovadas/pendentes); retomar quando voltar |
