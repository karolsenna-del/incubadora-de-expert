---
task: "Playback Onde Estou — Visualiza a Jornada"
responsavel: "@lt-chief"
atomic_layer: "task"
Entrada: "Aluno em qualquer estado do squad"
Saida: "Visualizacao das 10 etapas + 5 fases com posicao do aluno marcada"
execution_type: "interactive"
---

# Task: Playback Onde Estou — Visualização da Jornada

**Task ID:** squad-low-ticket-arcane/playback-onde-estou
**Owner:** lt-chief

---

## Conceito

Aluno fica perdido nas 10 Etapas + 5 Fases. Esta task gera **visualização clara** de onde ele está, o que já completou, o que falta.

---

## As 10 Etapas (Imersão Mapa do Império)

| # | Nome | Volume | Status (exemplo) |
|---|------|--------|------------------|
| 1 | Lógica e Formato do Perpétuo LT | Vol 1 | ✅ |
| 2 | Como Criar Ofertas | Vol 1 | ✅ |
| 3 | Esteira de Vendas | Vol 1 | ⏳ (parcial — só Fase Azul) |
| 4 | Funil 3X | Vol 2 | ✅ (projetivo definido) |
| 5 | Lógica da Página | Vol 3 | ✅ |
| 6 | Planilha do Norte | Vol 4 | ❌ |
| 7 | Copy Headline | Vol 3 + 7 | ✅ |
| 8 | UX Design na Prática | Vol 3 | ✅ |
| 9 | Criativos 3X | Vol 5 | ✅ |
| 10 | Tráfego Pago | Vol 6 | ⏳ (Fase 3D rodando) |

---

## As 5 Fases Operacionais

```
FASE 0 ─────── CRIAR (16 dias)
  Mecanismo + Oferta + Ruminação + Headline + Página + Criativos
  ✅ COMPLETA

FASE AZUL ──── VALIDAR (max 30 dias) ←── VOCÊ ESTÁ AQUI
  Setup → ABO Testadora 1-1-1 → Fase 3D → 4-5 campeões
  ⏳ Em andamento (dia 5 de 30)
  Critério saída: ROI 2+ SEM esteira

FASE LARANJA ─ RECUPERAR (~2 meses total)
  Recuperador 5min/24h/7d + verba gradual
  ❌ Pendente

FASE VERDE ─── ESCALAR
  OB1 → OB2 → Upsell + Kit de escala (8 estruturas)
  ❌ Pendente

FASE 5 ─────── LATERALIDADE
  Próxima oferta paralela
  ❌ Pendente
  Meta: 3-5 ofertas, R$50-144k/mês
```

---

## Workflow

### Step 1 — Carregar Contexto

Ler scratchpad:
- `oferta_atual`
- `estagio` (qual fase)
- `ultimo_problema`
- `agente_ativo`

### Step 2 — Marcar Posição

Apresentar visualização ASCII com:
- ✅ etapas completadas
- ⏳ em andamento
- ❌ pendentes

### Step 3 — Próximos Passos

Listar 3 próximos passos concretos, com agente responsável:

```
PRÓXIMOS PASSOS

1. Aguardar Fase 3D completar (mais 2 dias) — @lt-traffic-ops
2. Quando completar: análise Funil 3X — @lt-strategist + @lt-traffic-ops
3. Identificar 4-5 criativos campeões — @lt-creative-director (Teste Bifásico F2)
```

### Step 4 — Mostrar KPIs (se aplicável)

Se aluno tem oferta rodando:

```
📊 STATUS ATUAL — [Nome da Oferta]
├── Tempo rodando: 5 dias
├── Investimento total: R$1.500
├── CVP: R$2,30 (alvo R$2,68 ✅)
├── Finalização: R$14,80 (alvo R$15,41 ✅)
├── CPA: R$28,90 (alvo R$30,15 ✅)
├── ROI período máximo: 2.3 ✅
├── Vendas: 52
└── Status: Funil 3X dentro — pronto pra escalar (precisa 4-5 campeões)
```

---

## Output (Visual ASCII)

```
🗺️  JORNADA SQUAD LOW TICKET ARCANE — [Aluno]

📦 OFERTA ATUAL: "Protocolo Seca em 7" (R$67)

═══════════════════════════════════════════════
                10 ETAPAS DO MÉTODO
═══════════════════════════════════════════════
✅ E1 — Lógica do Perpétuo LT
✅ E2 — Como Criar Ofertas
⏳ E3 — Esteira (só Fase Azul ativada)
✅ E4 — Funil 3X (projetivo)
✅ E5 — Página de Vendas
❌ E6 — Planilha do Norte
✅ E7 — Copy HeadLine
✅ E8 — UX Design
✅ E9 — Criativos 3X
⏳ E10 — Tráfego Pago (Fase 3D rodando)

═══════════════════════════════════════════════
              5 FASES OPERACIONAIS
═══════════════════════════════════════════════
✅ FASE 0 — CRIAR (16 dias completos)
⏳ FASE AZUL — VALIDAR ◄── VOCÊ AQUI (dia 5 de 30)
❌ FASE LARANJA — RECUPERAR
❌ FASE VERDE — ESCALAR
❌ FASE 5 — LATERALIDADE

═══════════════════════════════════════════════
                  PRÓXIMOS PASSOS
═══════════════════════════════════════════════
1. ⏰ Aguardar Fase 3D completar (mais 2 dias)
   → @lt-traffic-ops

2. 📊 Análise Funil 3X dia 4
   → @lt-strategist + @lt-traffic-ops

3. 🏆 Identificar 4-5 criativos campeões + Fase 2
   → @lt-creative-director (Teste Bifásico)

═══════════════════════════════════════════════
                  📊 KPIs ATUAIS
═══════════════════════════════════════════════
CVP:        R$2,30 / R$2,68 ✅
Finalização: R$14,80 / R$15,41 ✅
CPA:         R$28,90 / R$30,15 ✅
ROI máx:     2.3 ✅
Vendas:      52
═══════════════════════════════════════════════

🎯 META: ROI 2+ SEM esteira → entrar Fase Laranja
```

---

## Variantes

### Aluno em ESTADO ZERO (sem oferta)

```
🗺️  JORNADA SQUAD LOW TICKET ARCANE — [Aluno]

📦 OFERTA ATUAL: ainda não tem

❌ FASE 0 — CRIAR ◄── COMECE AQUI
❌ FASE AZUL — VALIDAR
❌ FASE LARANJA — RECUPERAR
❌ FASE VERDE — ESCALAR
❌ FASE 5 — LATERALIDADE

PRÓXIMO PASSO: → @lt-strategist *nova-oferta
Duração: 16 dias
```

### Aluno em LATERALIDADE

```
📦 OFERTAS:
1. "Protocolo Seca em 7" — R$3k/dia, ROI 2.0, R$90k/mês ✅
2. "Pack Bio Instagram" — Fase Azul (dia 8) ⏳
3. "Detector Gente Boa" — em criação ❌

PLANILHA DO NORTE:
Total atual: R$3k/dia → R$90k/mês
Projeção 3 ofertas: R$150k/mês
```

---

## Handoff

Conforme fase atual, mostra agente próximo:
- Fase 0 → `lt-strategist *nova-oferta`
- Fase Azul → `lt-traffic-ops *fase-3D` ou `lt-diagnostician *sos`
- Fase Laranja → `lt-copywriter *recuperador`
- Fase Verde → `lt-strategist *esteira` + `lt-traffic-ops *kit-escala`
- Fase 5 → `lt-strategist *lateralidade`

---

**Task Status:** Production Ready
