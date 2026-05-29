---
task: "Verba do ROI — Descoberta Empirica"
responsavel: "@lt-strategist + @lt-traffic-ops"
atomic_layer: "task"
Entrada: "Oferta validada na Fase Azul, com criativos campeoes"
Saida: "Teto empirico do produto descoberto, estabilizado"
execution_type: "interactive (10-15 dias)"
---

# Task: Verba do ROI — Descoberta do Teto Empirico

**Task ID:** squad-low-ticket-arcane/verba-do-roi
**Owner:** lt-strategist + lt-traffic-ops

---

## Conceito

Todo produto LT tem um TETO de investimento diário em tráfego pago que aguenta sem perder o ROI. Esse é a **Verba do ROI**.

> "Todo produto dá lucro, desde que eu respeite a verba do ROI."
> "Eu preciso encontrar a verba do ROI."

---

## Princípio Cardinal

Em vez de forçar mais verba num produto, **respeitar o teto** e criar **lateralidade** (próxima oferta paralela).

---

## Workflow Empirico

### Step 1 — Começar Baixo

```
Verba inicial: R$1.000/dia
ROI alvo: >= 2.0
```

### Step 2 — Aumentar Gradualmente

Se ROI >= 2.0, aumentar:

```
R$1.000 → R$1.500 (avalia 24h+)
R$1.500 → R$2.000 (avalia)
R$2.000 → R$3.000 (avalia)
```

**Regra dos 20%:** incrementos de 20% sobre o investimento. Recalcular dia seguinte.

### Step 3 — Monitorar Ponto de Inflexão

Quando ROI começar a CAIR (ex: 1.5, 1.4, 1.0):

**PARA. NÃO insiste.**

### Step 4 — Voltar pro Último Valor que Manteve

Voltar pro patamar onde ROI >= 2.0.

```
Exemplo:
R$1.000 → ROI 2.5 ✓
R$2.000 → ROI 2.3 ✓
R$3.000 → ROI 2.0 ✓
R$4.000 → ROI 1.5 ✗ → VOLTA
R$3.000 → ROI 2.0 ✓ → ESSE É O TETO
```

### Step 5 — Respeitar Indefinidamente

Esse valor = **Verba do ROI** do produto.

> "Respeite esse teto indefinidamente."

---

## Exemplo Numérico Real

| Verba/dia | ROI | Faturamento | Lucro |
|-----------|-----|-------------|-------|
| R$1.000 | 2.0 | R$2.000 | R$1.000 |
| R$2.000 | 2.0 | R$4.000 | R$2.000 |
| R$3.000 | 2.0 | R$6.000 | R$3.000 |
| **R$4.000** | **1.5** | **R$6.000** | **R$2.000** |
| R$4.000 | 1.4→1.0 | R$5.600→4.000 | -R$0 (piorando) |

**Conclusão:** Verba do ROI = R$3.000/dia. Voltar e respeitar.

---

## Quando Atinge Verba do ROI

**NÃO força mais verba.** Cria oferta lateral.

> "Cara, em 16 dias essa oferta tem que nascer." — fast turnaround pra próxima.

→ `tasks/lateralidade.md` (próxima oferta paralela)

---

## Ritmo de Teste (3 Dias Luta + 4 Dias Glória)

Aplicar o ritmo durante teste:
- 3 dias luta: testar verbas novas
- 4 dias glória: consolidar no patamar que funciona

> "Nos dias de luta você CRESCE."

---

## Output

```yaml
verba_do_roi_oferta_X:
  produto: "{nome}"
  preco: R$67
  testes:
    - verba: R$1.000
      roi_24h: 2.5
      decisao: aumentar
    - verba: R$2.000
      roi_24h: 2.3
      decisao: aumentar
    - verba: R$3.000
      roi_24h: 2.0
      decisao: aumentar
    - verba: R$4.000
      roi_24h: 1.5
      decisao: voltar
  teto_descoberto: R$3.000
  lucro_medio_dia: R$3.000
  lucro_mes_estimado: R$90.000
  proxima_acao: "Lateralidade — próxima oferta"
```

---

## Anti-Padrões

| AP | Antídoto |
|----|----------|
| Forçar verba acima do teto | Respeitar — crescer via lateralidade |
| Testar com <24h | Mín 24h por patamar |
| Não voltar quando ROI cai | Voltar imediatamente |
| Confundir turbulência (3-5 dias) com queda real | Esperar antes de "voltar" |
| Demanda Reprimida (ROI alto inicial cai) | Identificar verba ROI público FRIO |

---

## Handoff

→ `lt-strategist *lateralidade` — quando teto atingido, próxima oferta
→ `lt-strategist *planilha-norte` — atualizar simulação com teto descoberto

---

**Task Status:** Production Ready
