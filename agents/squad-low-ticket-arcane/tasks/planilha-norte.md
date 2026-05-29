---
task: "Planilha do Norte — Bussola do Negocio"
responsavel: "@lt-strategist"
atomic_layer: "task"
Entrada: "Lista de ofertas (existentes + planejadas) com tráfego/dia e ROI estimado/real"
Saida: "Planilha calculada com totalizadores + meta clara"
execution_type: "interactive"
---

# Task: Planilha do Norte — Bússola do Negócio

**Task ID:** squad-low-ticket-arcane/planilha-norte
**Owner:** lt-strategist

---

## Conceito

> "A Planilha do Norte é a planilha que eu estruturo pra visualizar pra onde os meus low-tickets estão indo. Você vai colocar de papel de parede no seu celular. Norte. Você sabe pra onde está indo."

Bússola do negócio. Visualiza empilhamento, simula cenários, define metas concretas.

---

## Estrutura

| Campo | Tipo | Descrição |
|-------|------|-----------|
| **Produto** | Input | Nome da oferta |
| **Tráfego mínimo diário** | Input | Quanto de verba aguenta/dia (Verba do ROI) |
| **ROI esperado** | Input | ROAS — meta = 2.0 |
| **Faturamento/dia** | Calc | Tráfego × ROI |
| **Lucro/dia** | Calc | Faturamento - Tráfego |
| **Lucro/mês** | Calc | Lucro/dia × 30 |

### Fórmulas

- **Faturamento/dia** = Tráfego × ROI
- **Lucro/dia** = Faturamento - Tráfego
- **Lucro/mês** = Lucro/dia × 30

---

## Template

| Produto | Tráfego/dia | ROI | Faturamento/dia | Lucro/dia | Lucro/mês |
|---------|-------------|-----|-----------------|-----------|-----------|
| [nome] | R$ [valor] | [x.x] | [auto] | [auto] | [auto] |
| [nome] | R$ [valor] | [x.x] | [auto] | [auto] | [auto] |
| [nome] | R$ [valor] | [x.x] | [auto] | [auto] | [auto] |
| **TOTAL** | **[soma]** | — | **[soma]** | **[soma]** | **[soma]** |

---

## Simulações Reais (cases pra inspirar)

### Simulação 1 — 4 Produtos Empilhados (slide imersão)

| Produto | Tráfego/dia | ROI | Faturamento/dia | Lucro/dia | Lucro/mês |
|---------|-------------|-----|-----------------|-----------|-----------|
| -1kg por semana | R$ 1.500 | 2.0 | R$ 3.000 | R$ 1.500 | R$ 45.000 |
| Instabil | R$ 1.000 | 2.2 | R$ 2.200 | R$ 1.200 | R$ 36.000 |
| ChatGPT | R$ 1.000 | 1.9 | R$ 1.900 | R$ 900 | R$ 27.000 |
| Canva | R$ 1.200 | 2.0 | R$ 2.400 | R$ 1.200 | R$ 36.000 |
| **TOTAL** | **R$ 4.700** | — | **R$ 9.500** | **R$ 4.800** | **R$ 144.000** |

Faturamento mensal: R$ 285.000. Lucro: **R$ 144.000**.

### Simulação 2 — 3 Produtos (demo ao vivo)

| Produto | Tráfego/dia | ROI | Lucro/dia | Lucro/mês |
|---------|-------------|-----|-----------|-----------|
| ChatGPT | R$ 500 | 2.0 | R$ 500 | R$ 15.000 |
| Canva | R$ 1.000 | 2.3 | R$ 1.300 | R$ 39.000 |
| Instabil | R$ 800 | 2.3 | R$ 1.040 | R$ 31.000 |
| **TOTAL** | **R$ 2.300** | — | — | **R$ 85.000** |

### Simulação 3 — Aluna 8 ideias

> "Ela só precisa de 3 dando certo pra colocar R$50 mil de lucro por mês."

---

## Meta de Empilhamento

| Quantidade | Lucro/mês |
|-----------|-----------|
| 3 ofertas | R$ 50-85k |
| 4-5 ofertas | R$ 85-144k |

---

## Workflow

### Step 1 — Listar Ofertas (existentes + planejadas)

```yaml
ofertas_atuais:
  - nome: "{}"
    status: rodando|validacao|criando
    verba_do_roi: R$X
    roi_real: X.X

ofertas_planejadas:
  - nome: "{}"
    timeline: "+30 dias"
    estimativa_verba: R$X (conservador)
    estimativa_roi: 2.0 (default)
```

### Step 2 — Preencher Planilha

Use Excel/Google Sheets com fórmulas.

### Step 3 — Adicionar Linha TOTAL com Soma

Calcular automático.

### Step 4 — Definir Meta

- Conservadora: 3 ofertas × R$30k = R$90k/mês
- Agressiva: 5 ofertas × R$30k = R$150k/mês

### Step 5 — Papel de Parede

> "Você vai colocar de papel de parede no seu celular. Norte. Você sabe pra onde está indo."

---

## Observação Importante

**Lucro bruto** — impostos não descontados.

> "Claro que você vai trabalhar a porcentagem de imposto, mas é o lucro bruto que a gente tem na operação."

A partir de R$30-35k/mês, fazer análise tributária:
- Simples Nacional → Lucro Presumido
- CBL + ISBN (imunidade tributária pra material digital)

---

## Output

```yaml
planilha_norte:
  produtos:
    - nome: "Produto 1"
      trafego_dia: 1500
      roi: 2.0
      lucro_dia: 1500
      lucro_mes: 45000
    - nome: "Produto 2"
      ...
  totalizador:
    trafego_total_dia: 4700
    faturamento_total_mes: 285000
    lucro_total_mes: 144000
  meta_definida: 100000 (conservadora)
  proxima_oferta_em: "+30 dias"
  papel_de_parede_gerado: true
```

---

## Handoff

- Compartilhar com aluno como wallpaper
- → `tasks/lateralidade.md` quando atingir Verba do ROI atual

---

**Task Status:** Production Ready
