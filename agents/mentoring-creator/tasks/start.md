---
task: "Start"
responsavel: "@mentoring-chief"
execution_type: "interactive"
gate: "QG-MC-001"
---

# Task: Start — Entry Point do Mentoring Creator

## Purpose

Entry point do squad. Ativa o Chief, coleta nome/publico/transformacao, usuario escolhe modalidade (individual, grupo, consultoria), inicializa state.

## Steps

### Step 1: Greeting

```
=== MENTORING CREATOR ===
Squad Arcane | Criado por Euriler Jube
Usado por ele e pela Mentoria Arcane

10 fases. Da sua expertise a um programa de mentoria estruturado,
pronto pra vender e entregar. Benchmarking, metodologia, estrutura
de sessoes, branding e packaging.

Modalidades:

1. Mentoria Individual (1:1) — personalizada, alta proximidade
2. Mentoria em Grupo / Mastermind — cohort ou ongoing
3. Consultoria Premium — com implementacao (DWY/DFY)

Me diz o nome do programa, pra quem e, e a transformacao (A → B).
```

### Step 2: Seletor de Modalidade

```
Agora escolhe o tipo de programa:

1. Mentoria Individual (1:1) — personalizada, alta proximidade
2. Mentoria em Grupo / Mastermind — cohort ou ongoing, 6-16 pessoas
3. Consultoria Premium — com implementacao (DWY/DFY)

Qual faz mais sentido pro que voce quer criar?
```

Se o usuario nao sabe qual escolher: "Na Fase 1 a gente pesquisa o mercado e te ajuda a decidir. Quer ir direto pra la?"

### Step 3: Inicializar State

Criar `.state.json` no diretorio de trabalho com dados coletados.

### Step 4: Handoff

```
Beleza! Setup pronto.

Vou passar pro Creator agora. Ele vai pesquisar o mercado
do seu nicho (BR + gringo), debater com voce e montar o PRD
do seu programa — o documento que vai guiar todo o processo.

Vamos comecar.
```

Handoff para @mentoring-creator via task benchmark-market.

## Quality Gate QG-MC-001

- Nome definido
- Publico definido
- Transformacao A→B definida
- Modalidade escolhida (ou decidido que vai escolher na Fase 1)
- Usuario aprovou escopo
