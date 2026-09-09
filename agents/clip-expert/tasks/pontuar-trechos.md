---
task: "Pontuar Trechos"
responsavel: "@garimpeiro"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Transcricao completa do video (de transcrever-se-necessario)"
Saida: "Lista de trechos aprovados (timestamp inicio/fim + nota), 10-15 ou menos"
Checklist:
  - "Trechos candidatos identificados na transcricao (~1min cada)"
  - "Cada trecho pontuado 0-10 usando a rubrica derivada do Expert Viral"
  - "Trechos abaixo da nota minima descartados (data/nota-minima.yaml)"
  - "Nenhum criterio de pontuacao inventado fora do Expert Viral"
execution_type: "semantic"
---

# Task: Pontuar Trechos

## Executive Summary

Núcleo de curadoria do squad. Identifica janelas de ~1min na transcrição com potencial de corte e pontua cada uma usando a rubrica sintetizada a partir do Expert Viral (ver `data/clip-expert-kb.md`, seção Rubrica de Pontuação). Aplica o quality gate QG-CE-01 — nunca força quantidade às custas de qualidade.

## Steps

### Step 1: Identificar Candidatos

Ler a transcrição completa. Identificar entre 10 e 20 janelas candidatas (~1min cada, com início e fim que fazem sentido isolados do resto da live) — pontos onde há gancho, virada, história completa, dado forte, ou provocação, seguindo os sinais da rubrica.

### Step 2: Pontuar cada candidato (0-10)

Para cada candidato, aplicar a rubrica de `data/clip-expert-kb.md` (gancho, retenção, anti-padrões — critérios herdados do Expert Viral). Documentar a nota e o motivo (não só o número).

### Step 3: Aplicar Quality Gate (QG-CE-01)

Ler nota mínima de `data/nota-minima.yaml`. Descartar todo candidato abaixo dela. Se sobrarem menos de 10 aprovados, aceitar o número menor — nunca rebaixar a nota mínima pra compensar.

### Step 4: Handoff

Handoff pro cortador (task `cortar-e-legendar`) com a lista final: timestamps + nota + trecho de transcrição de cada corte aprovado.

## Error Handling

| Cenário | Ação |
|---------|------|
| 0 candidatos passam na nota mínima | Reportar isso claramente ao clip-chief — não entrega corte forçado |
| Transcrição muito curta pra gerar 10+ candidatos (vídeo curto) | Gera o que for possível, sem forçar quantidade artificial |
| Rubrica do Expert Viral parecer desatualizada/incoerente | Reportar ao clip-chief antes de prosseguir — não substitui por critério próprio |
