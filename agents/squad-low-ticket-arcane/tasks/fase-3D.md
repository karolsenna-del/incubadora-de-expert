---
task: "Fase 3D — Os 3 Primeiros Dias"
responsavel: "@lt-traffic-ops (com @lt-strategist + @lt-diagnostician se acionar)"
atomic_layer: "task"
Entrada: "Setup Trafego completo + 10 criativos PRSA prontos"
Saida: "Funil 3X analisado, 4-5 campeoes identificados OU diagnostico de problema"
execution_type: "interactive (4 dias completos)"
---

# Task: Fase 3D — Primeiros 3 Dias de Tráfego

**Task ID:** squad-low-ticket-arcane/fase-3D
**Owner:** lt-traffic-ops

---

## Conceito

> "Vocês vão aprender comigo o F3D, que é uma fase dos primeiros 3 dias de teste do meu produto low-ticket. Nesses 3 dias principais, eu analiso essas 3 métricas, eu não estou preocupado com venda."

Foco: **MÉTRICAS, não vendas.** Se Funil 3X tá dentro, vendas virão.

---

## Estrutura ABO Testadora 1-1-1

| Campo | Valor |
|-------|-------|
| Estrutura | 1 campanha → 10 conjuntos → 1 criativo cada |
| Cada criativo novo | NOVO conjunto na MESMA campanha |
| Objetivo | Vendas |
| Tipo campanha | **Configuração manual** (NÃO Advantage Campaign) |
| Orçamento | **45% do produto/dia por conjunto** |
| Público | **Advantage** (aberto). 95% das vezes |
| Idade/Gênero | Da persona |
| Posicionamento | Advantage (automático) |
| Texto/Título/Descrição | **NUNCA coloca** |
| Link | Página de venda |
| Horário ativação | **00:00:03** (sempre meia-noite e três) |
| "Anúncios com vários anunciantes" | **Desmarcar** |
| Nomenclatura | "[Produto] Eds01", "Eds02"... |

**Total investimento:** 10 criativos × R$30 (45% de R$67) = R$300/dia × 3 dias = **R$900 total**.

Verba curta? 5 criativos × R$30 = R$150/dia × 3 = R$450 total.

---

## Receita Dia a Dia

### Dia 1

```
✓ 00:00:03 — campanha sobe
✓ 10 conjuntos ativos
✓ Cada um R$30/dia
✓ 1 criativo PRSA por conjunto
```

> "Existe um querer profundo dentro de mim, do meu coração, que se eu coloco 0,3 ali vai dar ROI 3 na parada."

### Dia 2

> "Fazer um chá de camomila pra se acalmar."

**NÃO MEXE EM NADA. NÃO DESLIGA NENHUMA CAMPANHA. Deixa rodar.**

### Dia 3

> "Se você for colérico ou colérica, dobre o chá de camomila."

**NÃO MEXE EM NADA.** Na Fase 3D a regra é 3 dias (não 2 do teste normal).

### Dia 4 — Análise

```
✓ Acordar de manhã cedo
✓ Abrir gerenciador
✓ Configurar coluna pré-definida (FF3X)
✓ Analisar 3 dias completos
```

---

## Análise via Funil 3X

### Thresholds (preço R$67)

| Métrica | Alvo | Excedeu |
|---------|------|---------|
| **CVP** (1X) | < R$2,68 (4%) | Criativo |
| **Finalização** (2X) | < R$15,41 (23%) | Página |
| **CPA** (3X) | < R$30,15 (45%) | Oferta |

### Cenários

| Cenário | CVP | Final | CPA | Diagnóstico | Ação |
|---------|-----|-------|-----|-------------|------|
| **TUDO OK** | OK | OK | OK | Funil sustentável | Identificar 4-5 campeões → Fase 2 (Variações) |
| **Erro Crônico** | Estourada | Estourada | Estourada | Criativo puxa tudo | → `lt-creative-director` (criar mais variando formato) |
| **Página fraca** | OK | Estourada | Estourada | Página não converte | → `lt-page-master` (revisar headline/entregáveis) |
| **Checkout/Preço** | OK | OK | Estourada | Pessoa entra mas não compra | → testar preço, verificar checkout |
| **Volume baixo** | OK | OK | OK | Sem dados ainda | Aguardar mais 2-3 dias |

### Connect Rate Antes de Tudo

Se Connect Rate <75%:
- **PARAR análise**
- → `lt-page-master *velocidade` — resolver hospedagem PRIMEIRO
- Connect Rate <50% = trocar pra Rochost

---

## Critério de Criativo Campeão (Pra escalar)

| Critério | Valor |
|----------|-------|
| Vendas | 5-10 (10 = estatisticamente confiável) |
| ROI | >= 2.5 |
| Funil 3X | Todas as 3 métricas OK |

> "Criativo validado pra nós são criativos que vendem acima de 2,5%. Acima de 3. Porque um criativo de 2 ele vende, mas ele não escala."

> "Todo criativo escalado vai perder ROI." (~0.5 de queda)

---

## Após Análise

### Se TUDO OK

1. Identificar 4-5 criativos campeões
2. Matar conjuntos com criativos ruins
3. Pegar fala EXATA dos campeões
4. → `tasks/teste-bifasico.md` Fase 2 (50-300 versões)
5. → `tasks/kit-escala.md` quando arsenal Top 15 pronto

### Se Funil Estourado

→ `lt-diagnostician *sos` ou `*arvore-diagnostico`:
- P1 (CVP estourada) → criativo
- P7 (Connect Rate baixo) → hospedagem
- P8 (página não converte) → headline/entregáveis
- P12 (CPM altíssima) → conta nova
- P19 (pixel não marcando) → checklist técnico

---

## Anti-Padrões

| AP | Antídoto |
|----|----------|
| Mexer durante 3 dias | "Chá de camomila duplo" |
| Ansiedade com vendas no D2 | Foco em métricas, não vendas |
| Desligar criativo no D1 mesmo absurdamente caro | Exceção: ROI -100% pode pausar |
| Múltiplos criativos no mesmo conjunto | 1-1-1 sempre |
| Texto/título/descrição no criativo | "Nunca coloquei. De preguiça." |
| Começar fora de meia-noite | "Se não for 00:03, não tem ROI" |
| Esquecer "Anúncios com vários anunciantes" | Desmarcar |

---

## Output

```yaml
fase_3d:
  duracao: 3 dias
  investimento_total: R$900
  criativos_testados: 10
  funil_3x:
    cvp_medio: "R$X,XX"
    final_medio: "R$X,XX"
    cpa_medio: "R$X,XX"
    connect_rate: "X%"
  decisao:
    cenario: "TUDO_OK | ERRO_CRONICO | PAGINA_FRACA | ..."
    proximo_passo: "{handoff}"
  campeoes_identificados:
    - {criativo_id, roi, vendas}
  ruins_matados:
    - {criativo_id, motivo}
```

---

## Handoff

### Cenário TUDO OK
→ `lt-creative-director *teste-bifasico` Fase 2 (variações campeão)
→ Quando Top 15 prontos: `tasks/kit-escala.md`

### Cenário Funil Estourado
→ `lt-diagnostician *sos`

---

## Cases Reais

| Case | Insight |
|------|---------|
| Teste Suelen/Gabriel ao vivo | Crit 61 morto, 57 ressuscitou, 59 ROI 3 escalou 5 conjuntos |
| Gabriel "Menos 1kg" | CVP R$2,15, Final R$6,78, CPA R$9, ROI 6,2x |
| Alan "Joelho Sem Dor" | Custo finalização R$3 — Nova: "nunca vi" |

---

**Task Status:** Production Ready
