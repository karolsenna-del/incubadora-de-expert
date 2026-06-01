---
task: "Validar Conceito"
responsavel: "@iavideos-chief"
responsavel_type: "interactive"
atomic_layer: "task"
Entrada: "Leque de formatos proposto (da task propor-conceito)"
Saida: "Conceito validado pelo usuário — formatos e ideias confirmados pra produção"
Checklist:
  - "Conceito apresentado ao usuário de forma clara"
  - "Usuário confirmou explicitamente os formatos a produzir"
  - "Ajustes do usuário integrados antes de seguir"
  - "QG-IAV-01 cumprido"
execution_type: "interactive"
---

# Task: Validar Conceito

## Executive Summary

Quality gate QG-IAV-01. O Chief apresenta o conceito proposto pelo estrategista e coleta a confirmação explícita do usuário. Nada é produzido sem esse aval — produção sem conceito validado queima crédito à toa.

## Steps

### Step 1: Apresentar o conceito

Mostrar ao usuário o leque de formatos com as justificativas, em formato legível (não YAML). Para cada formato: o hook, o ângulo, o que ele testa.

### Step 2: Coletar a decisão

Perguntar de forma direta: quais formatos produzir? O usuário pode aprovar todos, cortar, ou pedir ajuste.

### Step 3: Integrar ajustes

Se o usuário quer mudar algo (trocar hook, ajustar ângulo, adicionar formato), devolver pro estrategista-criativo e re-apresentar. Repetir até a confirmação.

### Step 4: Quality Gate QG-IAV-01

Só seguir pra produção quando o usuário confirmar explicitamente os formatos. Sem confirmação, não passa.

## Error Handling

| Cenário | Ação |
|---------|------|
| Usuário não decide | Recomendar um subconjunto enxuto pra começar o teste; não travar |
| Usuário quer todos os formatos possíveis | Lembrar que produção é paga; sugerir lote de teste antes de leque amplo |
| Usuário rejeita o conceito todo | Devolver pro estrategista com o feedback pra refazer o leque |
