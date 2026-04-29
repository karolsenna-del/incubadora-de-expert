# Task: weekly-review

## Objetivo

Ritual semanal de revisao do cockpit e projetos. Max 20 minutos.

## Trigger

- `*review` no Companion
- Automatico quando ultima review > 7 dias (Companion puxa)
- Force alert quando > 14 dias

## Pre-condicoes

- `business/cockpit.md` existe
- Companion ativo

## Agente Executor

companion

## Passos

### Step 1: Briefing

Ler cockpit completo e todos os trackers ativos. Apresentar:
- Status de cada projeto ativo (fase, % conclusao, blockers)
- Fila — o que esta esperando
- Inbox — o que precisa ser processado
- Operacoes continuas — algo fora do normal?

### Step 2: DO-CONFIRM Checklist

Passar por cada item com o expert:

- [ ] Todo ativo tem next action definida?
- [ ] Algum ativo parado 5+ dias sem movimento?
- [ ] Algum blocker sem acao de resolucao?
- [ ] Fila ordenada por prioridade correta?
- [ ] Inbox processado (tudo classificado)?
- [ ] Operacoes continuas saudaveis?

SE algum item falhar: resolver ali na hora ou registrar como acao.

### Step 3: Update

- Atualizar cockpit (status, next actions, datas)
- Atualizar trackers se necessario
- Mover projetos se aplicavel (ativo → arquivo, fila → ativo, inbox → fila)
- Atualizar contexto-dinamico.md com estado atual

### Step 4: Close

- Resumo do que foi decidido/atualizado
- Proxima data de review (hoje + 7 dias)
- Atualizar campo "Proximo review" no cockpit

## Formato de Output

```
=== WEEKLY REVIEW — {data} ===

ATIVOS:
1. {projeto} — {status breve}
2. {projeto} — {status breve}
3. {projeto} — {status breve}

CHECKLIST: {X}/6 OK
{itens que falharam, se houver}

ACOES:
- {acao 1}
- {acao 2}

PROXIMO REVIEW: {data}
```

## Completion Criteria

- Todos os 6 itens do checklist verificados
- Cockpit atualizado
- Proxima data de review definida
