---
task: "Validate Full Theory"
responsavel: "@slide-forge-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Doc de construção com TODOS os blocos do esqueleto FECHADOS"
Saida: "theory-validated.flag (teoria do evento inteiro validada cabo a rabo pelo usuário)"
Checklist:
  - "Todos os blocos apresentados na sequência"
  - "Bridges entre blocos verificados"
  - "Arcos emocionais verificados"
  - "Coerência geral validada explicitamente pelo usuário"
execution_type: "interactive"
---

# Task: Validate Full Theory — Fase 4 (Validação Cabo a Rabo)

## Executive Summary

⚠️ **GATE CRÍTICO — QG-SF-02.** Sem aprovação aqui, NÃO passa pra produção de slides.

Chief apresenta a teoria INTEIRA do evento (todos os blocos) na sequência cronológica. Usuário valida coerência geral, fluxo entre blocos, arcos emocionais, bridges. Aprova ou pede revisão profunda.

## Steps

### Step 1: Verificar pré-requisitos

Checar:
- [ ] Todos os blocos do esqueleto têm seção FECHADA no doc de construção
- [ ] Bridges entre blocos definidos
- [ ] Arcos emocionais marcados em cada bloco

Se algum bloco não está fechado, sinalizar e voltar pra `develop-block-theory` desse bloco.

### Step 2: Compor apresentação cabo a rabo

Compor visão integrada de TODOS os blocos:

```
=== TEORIA INTEIRA — {Nome do Evento} ===

Total: {N blocos} · {tempo total}

--- FLUXO COMPLETO ---

BLOCO 1: {nome} ({tempo}, {posição})
Ângulo: {1 frase}
Conceitos: {lista 1-linha}
Arco: {arco}
Bridge → Bloco 2: "{frase}"

BLOCO 2: {nome} ({tempo}, {posição})
Ângulo: {1 frase}
Conceitos: {lista 1-linha}
Arco: {arco}
Bridge → Bloco 3: "{frase}"

...

BLOCO N: {nome}
Ângulo: ...
Conceitos: ...
Arco: ...
Fechamento: {se for o último bloco}

--- ARCO EMOCIONAL DO EVENTO ---
{descrição do arco emocional total — como começa, vira, termina}

--- COERÊNCIA NARRATIVA ---
{análise: bridges fluem? blocos vizinhos se conectam? arco geral funciona?}
```

### Step 3: Apresentar ao usuário

Mostrar inline. Pedir validação explícita:

> "Esse é o fluxo da teoria toda. Bate com o que você quer entregar?
> Coerente? Os bridges fluem? Algum bloco fora de lugar?"

### Step 4: Coletar resposta

| Resposta | Ação |
|---|---|
| **Aprova** ("tá fechado", "vamos pros slides") | QG-SF-02 PASS → handoff `produce-block-slides` |
| **Pede ajuste pontual** (mudar bridge, swap blocos) | Ajustar e re-apresentar |
| **Pede revisão profunda** ("o bloco X tá errado") | `*revise-theory` → volta pra `develop-block-theory` do bloco apontado |
| **Detecta inconsistência** ("X contradiz Y") | Sinalizar bloco(s) afetados, voltar pra `develop-block-theory` |

### Step 5: Quality Gate QG-SF-02

**Criterio:** usuário validou explicitamente coerência cabo a rabo.

**Veto:**
- Algum bloco sem aprovação anterior
- Inconsistências detectadas e não resolvidas
- Usuário não confirmou explicitamente

**Se passou:** marca `theory-validated.flag` e libera Fase 5 (slides).

## Error Handling

| Cenário | Ação |
|---------|------|
| Usuário detecta inconsistência grave entre blocos | Voltar pra develop-block-theory dos blocos afetados — refazer síntese |
| Arco emocional não funciona ("começa e termina no mesmo lugar") | Voltar pra revisar arcos individuais e bridges |
| Tempo total não bate com event-definition | Sinalizar pro usuário cortar conteúdo OU expandir tempo |
| Usuário quer adicionar bloco novo | Voltar pra define-skeleton, ajustar lista, develop-block-theory do novo bloco |

---

## Cardinal Rules Aplicadas

- Validação cabo a rabo é GATE CRÍTICO — sem ela, slides não saem (PU-010, PU-013)
- Reconhecer mancada e corrigir rápido (PU-034)
- Não invento, não chuto (PU-005)
