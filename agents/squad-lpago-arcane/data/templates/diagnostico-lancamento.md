# Template — Diagnóstico de Lançamento

> **KB do Squad LPago Arcane — Templates/Playbooks**
> Tratamento: built from scratch (4 seções definidas em PU-LP-011, baseado em data/metodo/09 + REGRAS-CARDINAIS)
> Carregado por: analista-dados

---

## Para Que Serve Este Template

Output do agente `analista-dados`: diagnóstico estruturado em **4 seções** (snapshot tabela / status semáforo / diagnóstico narrativo / ação prioritária) sobre o estado do lançamento em qualquer ponto (durante captação, dia do evento, pós-evento).

Não é relatório bonito. É **arma de decisão**: o expert lê em 30 segundos e sabe o que fazer agora.

> "CPA é Rei. Não importa CPM, impressões, alcance ou CTR isolado — só importa quanto custa cada comprador." (RC-007)

---

## Pré-Requisitos

- [ ] Dados de Meta Ads disponíveis (campanha + adset + criativo)
- [ ] Dados de checkout disponíveis (Hotmart / Kiwify / Eduzz)
- [ ] Dados de página disponíveis (Clarity / Hotjar / GA)
- [ ] Plano original em mãos (`documento-mestre.md` — pra comparar com previsto)
- [ ] Janela de análise definida (ex: últimas 48h, últimos 7 dias, ciclo completo)

---

## Cabeçalho

```
# Diagnóstico — {Nome do Lançamento} | {DD/MM/AAAA}
Período analisado: {de DD/MM até DD/MM}
Fase do funil: {pré-evento / dia do evento / pós-evento / Meteorico}
Versão do diagnóstico: v{N}
Próxima rodada de análise: {quando}
```

---

## Seção 1 — Snapshot (Tabela de Indicadores)

> Tabela com indicador / valor real / valor esperado / status semáforo. Comparar com período anterior se houver dado.

| Indicador | Valor Real | Esperado | Status | vs. Período Anterior |
|-----------|-----------|----------|--------|----------------------|
| **CPA Lead/Ingresso** | R$ {...} | R$ {target do plano} — RC-007 | 🟢/🟡/🔴 | ↑ ↓ → |
| **Hook Rate (média campanha)** | {%} | >30% | 🟢/🟡/🔴 | ↑ ↓ → |
| **CTR (frio)** | {%} | 0.68-0.98% mínimo, >1.5% bom | 🟢/🟡/🔴 | ↑ ↓ → |
| **CPM** | R$ {...} | depende ticket (ver formula 3.3) | 🟢/🟡/🔴 | ↑ ↓ → |
| **Conversão da página** | {%} | 7-13% pra ticket R$2-10k | 🟢/🟡/🔴 | ↑ ↓ → |
| **Initiate Checkout** | {%} | 20% | 🟢/🟡/🔴 | ↑ ↓ → |
| **Conversão Checkout** | {%} | 35% | 🟢/🟡/🔴 | ↑ ↓ → |
| **Connect Rate** | {%} | >75% | 🟢/🟡/🔴 | ↑ ↓ → |
| **ROAS Front** | {x} | 1.4-2.0 mínimo | 🟢/🟡/🔴 | ↑ ↓ → |
| **Ingressos vendidos (acumulado)** | {N} | {meta documento-mestre} | 🟢/🟡/🔴 | — |
| **% da meta atingida** | {%} | 100% no fim | 🟢/🟡/🔴 | — |

### Indicadores Específicos Por Fase

#### Se Fase = Dia do Evento

| Indicador | Valor Real | Esperado | Status |
|-----------|-----------|----------|--------|
| Comparecimento ao vivo | {%} | ~15% até pitch | 🟢/🟡/🔴 |
| Retenção até Pitch 1 | {%} | >40% | 🟢/🟡/🔴 |
| Retenção até Pitch 2 | {%} | >25% | 🟢/🟡/🔴 |

#### Se Fase = Pós-Evento

| Indicador | Valor Real | Esperado | Status |
|-----------|-----------|----------|--------|
| Conversão evento → produto | {%} | 7-13% (R$2-10k) ou 2-5% (R$10k+) | 🟢/🟡/🔴 |
| % vendas pós-evento / total | {%} | 40-60% (RC-014) | 🟢/🟡/🔴 |
| NPS Dia 1 | {%} | 80%+ | 🟢/🟡/🔴 |
| NPS Dia 2 | {%} | 90%+ | 🟢/🟡/🔴 |

> **Regra de leitura da tabela:** 🟢 = dentro ou acima do esperado | 🟡 = no limite, atenção | 🔴 = abaixo do esperado, ação requerida.

---

## Seção 2 — Status Geral (Semáforo)

> Síntese em 1 emoji + 1 frase. Lê em 1 segundo.

```
Status: 🟢 Saudável  /  🟡 Atenção  /  🔴 Crítico

Justificativa (1 frase): {...}
```

**Regra:**
- 🟢 Saudável: CPA dentro do target + conversão página > esperado + ROAS ≥ 2.0
- 🟡 Atenção: 1-2 indicadores críticos abaixo do esperado, mas funil ainda saudável
- 🔴 Crítico: CPA > ticket OU Hook Rate < 20% OU Connect Rate crítico OU sem vendas há > 48h

---

## Seção 3 — Diagnóstico Narrativo

> Leitura cruzada dos números + contexto do plano original + hipóteses + gargalo identificado.

### 3.1 O Que os Números Estão Dizendo

{2-4 parágrafos curtos. Conta a história dos dados. Onde está o gargalo. O que mudou em relação à fase anterior. Comparar com plano do `documento-mestre.md`.}

### 3.2 Hipóteses (em ordem de probabilidade)

| # | Hipótese | Evidência | Probabilidade |
|---|----------|-----------|---------------|
| 1 | {...} | {indicador X mostra...} | Alta / Média / Baixa |
| 2 | {...} | {...} | Alta / Média / Baixa |
| 3 | {...} | {...} | Alta / Média / Baixa |

### 3.3 Gargalo Principal Identificado

```
Gargalo: {1 frase clara — onde o funil está vazando}
Etapa do funil: {anúncio / página / checkout / evento / pós-evento}
Regra Cardinal violada (se houver): {RC-XXX}
Referência rápida: {data/metodo/09 seção 7 — Diagnóstico por Fase}
```

### 3.4 Cenários Compostos (se aplicável)

> Quando 2+ indicadores estão fora do esperado, o diagnóstico é composto. Ver tabela abaixo.

| Sintomas Combinados | Diagnóstico Composto |
|---------------------|---------------------|
| CPA alto + Conversão página alta | Problema é PÚBLICO (anúncio atrai errado) |
| CPA alto + Conversão página baixa | Problema é PÁGINA (mata gente que clica) |
| CPA alto + CTR alto + Conversão baixa | Promessa do anúncio NÃO bate com a da página |
| Hook Rate baixo + CTR alto | Quem assiste 3s clica — refazer abertura segura mais gente |
| Connect Rate baixo + Conversão baixa | Problema TÉCNICO (carregamento), não marketing |
| Comparecimento baixo + ingressos vendidos OK | Falha na ANTECIPAÇÃO (sequência de mensagens) |
| Conversão evento OK + vendas pós-evento baixas | Falha no MENINHA / MeteOríco / pressão comercial |

---

## Seção 4 — Ação Prioritária

> Numerada por ordem. Cada ação tem responsável + prazo + critério de sucesso. **Máximo 3 ações** — se tem mais de 3, prioriza.

| # | Ação | Responsável | Prazo | Critério de Sucesso |
|---|------|-------------|-------|---------------------|
| 1 | {ação mais crítica — descrição específica e acionável} | {agente do squad ou Euriler/aluno} | {timing — ex: hoje, 24h, 48h} | {indicador volta pra 🟢 OU faturamento de Y atingido} |
| 2 | {ação secundária} | {...} | {...} | {...} |
| 3 | {ação que pode esperar mas precisa entrar no radar} | {...} | {...} | {...} |

### Bloqueios Cardinais

> Se alguma destas situações está ativa, **TODAS as outras ações pausam** até resolver:

- [ ] RC-007: CPA > ticket → não escalar mais ad spend
- [ ] RC-011: Hook Rate < 20% → matar criativo no ninho antes de qualquer otimização
- [ ] Connect Rate < 60% → resolver TÉCNICO antes de mexer em copy/oferta
- [ ] Sem venda há > 48h durante captação → pausar campanhas, refazer hipótese

### O Que NÃO Fazer Agora

> Lista do que está tentador mas não deve fazer (RC-009 e RC-010).

- [ ] Não mexer no que está funcionando (RC-009)
- [ ] Não otimizar antes de 2 dias de dados estáveis (RC-010)
- [ ] Não trocar headline na página antes de testar nos criativos (RC-006)
- [ ] {outras específicas do contexto}

---

## Próxima Rodada de Diagnóstico

```
Quando: {data + horário}
Foco específico: {ex: validar se ação #1 baixou CPA pra R$X}
Indicadores prioritários a olhar: {lista curta}
```

---

**Última atualização:** 2026-05-08
**Versão:** 1.0.0
