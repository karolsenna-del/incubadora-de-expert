---
workflow: "Perpetuo Completo"
id: wf-perpetuo-completo
version: 1.0.0
duracao_total: "60-90 dias do zero ao escalado + lateralidade indefinida"
fases: 5
agentes_envolvidos: 7
---

# Workflow: wf-perpetuo-completo

**Workflow ID:** squad-low-ticket-arcane/wf-perpetuo-completo
**Tipo:** Multi-agent, sequencial com loops
**Modo de uso:** Guiado (UC1) — alternativa: convocacao livre (UC2)

---

## Visao Geral

```
FASE 0 — CRIAR              16 dias    Oferta + página + criativos
FASE AZUL — VALIDAR         max 30d    ROI 2+ SEM esteira
FASE LARANJA — RECUPERAR    ~2 meses   Recuperador 3 tempos
FASE VERDE — ESCALAR        contínuo   Esteira + 8 estruturas
FASE 5 — LATERALIDADE       indefinido 3-5 ofertas paralelas
                                       Meta: R$50-144k/mês lucro
```

---

## FASE 0 — CRIAR (16 dias)

**Output:** Oferta validada estruturalmente, página ao ar, 10 criativos PRSA prontos
**Quality Gate:** QG-LT-001

### Sequência

| # | Agente | Task | Output |
|---|--------|------|--------|
| 1 | `lt-strategist` | `*pneu-furado` | Dor lucrativa identificada |
| 2 | `lt-strategist` | `*tipo-perpetuo` | Frio/Porta/Branding + preço |
| 3 | `lt-strategist` | `*mecanismo-unico` | Habilidade core (não nicho) |
| 4 | `lt-copywriter` | `*edi` (`tasks/edi-completo.md`) | 6 ruminações Score 4-5 |
| 5 | `lt-strategist + lt-copywriter` | `*maquina-de-nomes` | Nome da oferta |
| 6 | `lt-copywriter` | `*headline-3-partes` (`tasks/headline-3-partes.md`) | Headline costurada |
| 7 | `lt-page-master` | `*nova-pagina` (`tasks/nova-pagina.md`) | 14 blocos ao ar |
| 8 | `lt-strategist` | `*entregaveis-base` | 4+3 entregaveis |
| 9 | `lt-copywriter` | `*food-porn` | Titulos com desejo |
| 10 | `lt-page-master` | `*setup-stack` + `*velocidade` | Hostinger + WP + Pixel YourSite |
| 11 | `lt-strategist` | `*esteira` | OB1 + OB2 + Upsell mapeados (NÃO ligados) |
| 12 | `lt-creative-director + lt-copywriter` | `*prsa-criativo` (`tasks/prsa-criativo.md`) | 10 criativos PRSA |

### Checkpoint QG-LT-001

Antes de avançar pra Fase Azul, validar:
- [ ] Mecanismo único definido (não "3 passos")
- [ ] 1 ruminação Score 4-5
- [ ] Headline 3 partes costurada (mecanismo + tempo)
- [ ] 4+3 entregáveis com Food Porn
- [ ] Página ao ar, 14 blocos, mobile-first
- [ ] PageSpeed mobile 80+
- [ ] Pixel + API Conversões verificados
- [ ] 10 criativos PRSA prontos (formatos diferentes, copies 100% diferentes)
- [ ] Frases do criativo aparecem na página (anti-Sovaco)

---

## FASE AZUL — VALIDAR (max 30 dias)

**Output:** ROI 2+ SEM esteira
**Quality Gate:** QG-LT-002 (Funil 3X dentro) + QG-LT-003 (ROI 2+)

### Sequência

| # | Agente | Task | Output |
|---|--------|------|--------|
| 1 | `lt-traffic-ops` | `*setup-bm` (`tasks/setup-trafego.md`) | 5 ativos prontos |
| 2 | `lt-traffic-ops` | `*pixel` | Pixel + API verificados |
| 3 | `lt-traffic-ops` | `*ftesta-criativos` (`tasks/fase-3D.md`) | ABO Testadora 1-1-1 a 45%, 00:03 |
| 4 | `lt-traffic-ops` | Aguardar Fase 3D | Cha de camomila duplo (3 dias) |
| 5 | Dia 4: `lt-strategist + lt-traffic-ops` | `*funil-3X-corrigir` | Análise Funil 3X |
| 6a | Se OK: `lt-traffic-ops` | `*kill` ruins | 4-5 campeões identificados |
| 6b | Se estourado: `lt-diagnostician` | `*sos` (`tasks/sos-diagnostico.md`) | Diagnóstico clínico |
| 7 | `lt-creative-director` | `*teste-bifasico F2` (`tasks/teste-bifasico.md`) | 50-300 versões do campeão → Top 15 |
| 8 | `lt-strategist + lt-traffic-ops` | `*verba-do-roi` (`tasks/verba-do-roi.md`) | Teto empírico descoberto |

### Checkpoint QG-LT-002 (Funil 3X)

- [ ] CVP < 4% do produto
- [ ] Finalização < 23%
- [ ] CPA < 45%
- [ ] Connect Rate > 75%

### Checkpoint QG-LT-003 (ROI)

- [ ] ROI 2+ SEM order bump
- [ ] SEM upsell
- [ ] SEM recuperação ativada
- [ ] Em max 30 dias

---

## FASE LARANJA — RECUPERAR (~2 meses total)

**Output:** Conversão recuperação 30-35% + verba escalando

### Sequência

| # | Agente | Task | Output |
|---|--------|------|--------|
| 1 | `lt-copywriter` | `*recuperador` | 3 mensagens (5min/24h/7d) |
| 2 | Aluno | Configurar automação | WhatsApp + Email |
| 3 | `lt-traffic-ops` | Escalar verba gradual | Mantendo ROI |

### Critério de Saída

- [ ] Recuperador convertendo 30-35%
- [ ] Verba aumentando com ROI mantido

---

## FASE VERDE — ESCALAR

**Output:** Lucro consistente + Verba do ROI atingida
**Quality Gate:** QG-LT-004 (4 criativos validados)

### Sequência

| # | Agente | Task | Output |
|---|--------|------|--------|
| 1 | `lt-strategist` | Sobe Order Bump 1 | Testar — manteve ROI? |
| 2 | `lt-strategist` | Sobe Order Bump 2 | Testar — manteve ROI? |
| 3 | `lt-strategist` | Sobe Upsell | Testar — manteve ROI? |
| 4 | `lt-traffic-ops` | `*kit-escala` (`tasks/kit-escala.md`) | Kit personalizado por oferta |
| 5 | `lt-traffic-ops` | Operar ritmo 3/4 | 3 luta + 4 glória |
| 6 | `lt-traffic-ops` | `*escala-maxima` | Intradiária quando ROI > 2.5 |

### Checkpoint QG-LT-004

- [ ] Mín 4 criativos validados (ROI >= 2.5, 5-10 vendas)
- [ ] Kit de escala identificado (1+ estruturas funcionando)

### Critério de Saída

Verba do ROI descoberta + ROI estabilizado → trigger Fase 5.

---

## FASE 5 — LATERALIDADE

**Output:** 3-5 ofertas paralelas
**Meta:** R$50-144k/mês lucro

### Sequência

| # | Agente | Task | Output |
|---|--------|------|--------|
| 1 | `lt-strategist` | `*lateralidade` (`tasks/lateralidade.md`) | Brief nova oferta |
| 2 | Loop: `tasks/new-offer.md` | Voltar Fase 0 com nova oferta | 16 dias até Fase Azul |
| 3 | `lt-strategist` | `*planilha-norte` (`tasks/planilha-norte.md`) | Atualizar simulação |

### Checkpoint QG-LT-005

- [ ] Verba do ROI da oferta atual descoberta e respeitada
- [ ] Nova oferta criada em 16 dias
- [ ] Planilha do Norte atualizada

### Loop

Cada nova oferta percorre Fases 0 → Azul → Laranja → Verde paralela às existentes.

Meta: 3-5 ofertas com R$30k cada/mês = R$90-150k lucro/mês.

---

## Loops e Recuperações

### Loop de Diagnóstico (Fase Azul ou Verde)

Se métricas estouram a qualquer momento:

```
lt-diagnostician *sos
  → Identifica P{N}
  → Aplica F{N}
  → Encaminha pro agente
  → Aguarda 3-7 dias
  → Re-diagnostica
```

### Loop de Pivot (Fase Azul)

Se oferta NÃO valida em 30 dias:

```
lt-diagnostician identifica problema (não é técnico)
  → lt-strategist *pivotar
    → opção A: pivotar headline (caso Giovana — ângulo)
    → opção B: tchau, deleta, faz outra
  → loop pra nova Fase 0 (mesmo produto, oferta nova)
```

### Loop de Lenha na Fogueira (Fase Verde)

Se ROI cai por fadiga em campanha que vendia:

```
lt-traffic-ops *lenha-fogueira
  → adicionar criativos NOVOS validados
  → não desligar antigos
  → reviver campanha
```

---

## Saídas e Comandos

### Modo Guiado (UC1)

```
*workflow → inicia wf-perpetuo-completo na Fase 0
```

Em qualquer ponto:
- `*onde-tô` → mostra posição (chief)
- `*pause` → suspende workflow
- `*resume` → retoma

### Modo Convocação Livre (UC2)

```
*chamar {agente}
```

Aluno chama agente sem seguir o workflow. Útil pra quem já opera e precisa de ajuda pontual.

### Modo SOS (UC3)

```
*sos
```

Direto pro `lt-diagnostician` em emergência.

---

## Quality Gates Resumo

| Gate | Quando | Critério |
|------|--------|----------|
| QG-LT-001 | Fase 0 → Azul | Oferta validada estruturalmente |
| QG-LT-002 | Fase 3D → Otimização | Funil 3X dentro |
| QG-LT-003 | Azul → Laranja | ROI 2+ SEM esteira em max 30 dias |
| QG-LT-004 | Otimização → Escala | 4 criativos validados |
| QG-LT-005 | Verde → Lateralidade | Verba do ROI descoberta |

---

## Princípios Cardinais aplicados ao workflow

1. **10 etapas com excelência** — pular qualquer = ROI não vem
2. **Sequência rígida** — Criativo → Página → Escala
3. **Dados, não achismo** — Funil 3X é bússola
4. **Velocidade > perfeição** — 16 dias por oferta
5. **Lateralidade > vertical** — empilhar, não forçar
6. **Não se apaixone pela oferta** — 4-5 média até acertar
7. **Se tá dando bom, não mexe** — só cria novos em paralelo

---

**Workflow Status:** Production Ready
