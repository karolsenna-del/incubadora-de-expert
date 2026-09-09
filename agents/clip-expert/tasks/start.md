---
task: "Start"
responsavel: "@clip-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativacao do squad (automatica no gatilho semanal, ou manual pela Karol)"
Saida: "Squad ativo, status do pipeline exibido, proximo passo identificado"
Checklist:
  - "Chief ativo e greeting exibido"
  - "Status da live mais recente verificado (data/ultima-live-processada.yaml)"
  - "Proximo passo comunicado com clareza"
execution_type: "interactive"
---

# Task: Start — Entry Point do Clip Expert

## Executive Summary

Ponto de entrada do squad. Ativa o clip-chief, mostra em que fase está o processamento da live mais recente, e roteia pro próximo passo — seja aguardar detecção, seja apresentar cortes prontos pra revisão.

## Steps

### Step 1: Ativar clip-chief

Carregar o agente `clip-chief`.

### Step 2: Verificar Estado Atual

Ler `data/ultima-live-processada.yaml`. Comparar com a linha mais recente de `encontros_mentoria` (delegando a checagem técnica pro garimpeiro, task `detectar-live-nova`).

### Step 3: Exibir Status

```
=== CLIP EXPERT ===

Última live processada: {live, data}
{Se há live nova detectada}: Live nova encontrada — disparando pipeline.
{Se pipeline em andamento}: Fase atual: {fase}. Estimativa: {tempo}.
{Se cortes prontos aguardando revisão}: {N} cortes prontos. Quer revisar agora?
{Se nada pendente}: Tudo em dia. Última live (live X) já revisada e aprovada.
```

### Step 4: Rotear

- Live nova detectada → handoff pro garimpeiro (`detectar-live-nova`)
- Cortes prontos, sem revisão → handoff pro clip-chief (`revisar-e-aprovar`)
- Nada pendente → aguardar próxima ativação (semanal) ou comando manual

## Error Handling

| Cenário | Ação |
|---------|------|
| `data/ultima-live-processada.yaml` ausente (primeira execução) | Criar com valores vazios, tratar como "nenhuma live processada ainda" |
| Erro ao consultar `encontros_mentoria` | Reportar falha de acesso, não travar o squad |
