---
task: "SOS Diagnostico — Entrada do Diagnostician"
responsavel: "@lt-diagnostician"
atomic_layer: "task"
Entrada: "Aluno em problema (ROI estourado, criativo caro, pagina nao converte, etc)"
Saida: "Diagnostico clinico com fix pattern especifico (F1-F13) + handoff pro agente certo"
execution_type: "interactive"
---

# Task: SOS Diagnóstico — Entrada Principal

**Task ID:** squad-low-ticket-arcane/sos-diagnostico
**Owner:** lt-diagnostician

---

## Conceito

Aluno em pânico chega: *"Maxxima, gastei R$500 e zero venda!"*

**Você não dá palpite. Você dá DIAGNÓSTICO clínico.**

> "Em Deus eu confio e os demais me tragam dados."
> "Funil 3X é uma bioimpedância — sem ele, análise é abstrata."

---

## Step 1 — Coletar Dados (sem dados, sem diagnóstico)

```yaml
elicit: true
questions:
  - oferta: "Qual oferta? Preço?"
  - dias_rodando: "Quantos dias rodando trafego?"
  - cvp: "Custo de visualização de página de destino atual?"
  - finalizacao: "Custo de finalização de compra atual?"
  - cpa: "CPA (custo por venda) atual?"
  - connect_rate: "Connect Rate (Visualização Página / Cliques)?"
  - criativos_rodando: "Quantos criativos rodando?"
  - intervencoes: "O que ja foi feito (intervencoes anteriores)?"
```

Sem esses números → "Me traga as métricas. Em Deus eu confio e os demais me tragam dados."

---

## Step 2 — Calcular Thresholds (Funil 3X)

Para preço informado:

| Métrica | Threshold |
|---------|-----------|
| CVP | 4% do preço |
| Finalização | 23% do preço |
| CPA | 45% do preço |

Comparar reais vs alvo.

---

## Step 3 — Árvore de Diagnóstico

```
1. Connect Rate < 75%?
   └── SIM → STOP. P7 — resolver Connect Rate antes
        Encaminhar lt-page-master *velocidade

2. CVP estourada?
   └── SIM → CRIATIVO
        Investigar P1, P3, P5, P6
        Encaminhar lt-creative-director

3. CVP OK + Finalização estourada?
   └── SIM → PÁGINA
        P8, P9
        Encaminhar lt-page-master

4. CVP OK + Final OK + CPA estourada?
   └── SIM → CHECKOUT/PREÇO/OFERTA
        P17, P18, P21
        Encaminhar lt-strategist (preço) ou lt-traffic-ops (checkout)

5. Tudo OK + ROI < 2?
   └── PREÇO baixo OU ESTEIRA incompleta
        P17 (testar preço maior) ou P18 (OB+Upsell)

6. Tudo OK + sem vendas?
   └── Volume baixo / pixel novo / verba insuficiente
        Aguardar mais dados ou aumentar verba
```

---

## Step 4 — Janela Completa (varredura)

ANTES de qualquer decisão drástica, SEMPRE 3 janelas:

| Janela | O que olhar |
|--------|-------------|
| **Período MÁXIMO** | ROI geral desde o início |
| **Últimos 7 dias** | Tendência |
| **Últimos 3 dias** | Estado atual |

**Regra:** Se ROI > 2 no MÁXIMO + custo por venda dentro = SEGURA. Pode ser turbulência.

> "Eu nunca mato um criativo sem antes olhar a história dele."

---

## Step 5 — Identificar Problema Catalogado (P1-P26)

Casar sintomas com os 26 problemas do Vol 8:

### CRIATIVO (P1-P6)

| P | Sintoma |
|---|---------|
| **P1** | CVP > 4% |
| **P2** | CVP barato + zero conversão (clickbait) |
| **P3** | 15-20+ criativos, só 1-2 performam |
| **P4** | Valida em teste, não escala |
| **P5** | Copy Dilma — headline confusa |
| **P6** | Formato errado — IA, animação, sem rosto |

### PÁGINA (P7-P9)

| P | Sintoma |
|---|---------|
| **P7** | Connect Rate <75% |
| **P8** | Criativo bom, página não converte |
| **P9** | Oferta aberta, sem mecanismo |

### TRÁFEGO (P10-P15)

| P | Sintoma |
|---|---------|
| **P10** | Estrutura errada (gestor de lançamento) |
| **P11** | Desligar prematuro |
| **P12** | CPM altíssima |
| **P13** | Escala destruindo ROI |
| **P14** | Turbulência |
| **P15** | Falso Funil 3X |

### OFERTA (P16-P18)

| P | Sintoma |
|---|---------|
| **P16** | Demanda Reprimida (ROI alto cai) |
| **P17** | Preço errado |
| **P18** | Esteira incompleta |

### TÉCNICA (P19-P21)

| P | Sintoma |
|---|---------|
| **P19** | Pixel não marcando |
| **P20** | Conta/BM bugada |
| **P21** | Plataforma checkout problemática |

### COMPORTAMENTO (P22-P26)

| P | Sintoma |
|---|---------|
| **P22** | Esperar bênção (paralisia) |
| **P23** | Medo de escalar |
| **P24** | Overanalyze sem dados |
| **P25** | Apaixonar-se pela oferta |
| **P26** | Falta de criativos (Alegria Pendurada) |

---

## Step 6 — Aplicar Fix Pattern (F1-F13)

| Fix | Problema | Receita |
|-----|----------|---------|
| F1 | Criativo caro | Criar mais variando formato |
| F2 | Connect Rate baixo | Trocar Rochost |
| F3 | Página não converte | Teste AB headline |
| F4 | CPM alta | Conta nova + pixel novo |
| F5 | Pixel não marca | API + Pixel Helper |
| F6 | Oferta não vende | Pivotar (não trocar produto) |
| F7 | Escala não funciona | Testar estruturas (kit) |
| F8 | ROI caindo | Lenha na Fogueira |
| F9 | Sem criativos | 5-10/sem + choque |
| F10 | Conta bugada | BM/conta nova |
| F11 | Dúvida preço | Testar AB |
| F12 | Oferta aberta | Mecanismo único tangível |
| F13 | Aluno travado | Botão Vermelho |

---

## Step 7 — Anti-Padrões (10 catalogados)

Confrontar com:

| AP | Antídoto |
|----|----------|
| AP1 Copy Dilma | Uma ruminação, mecanismo, promessa |
| AP2 Síndrome Reset | Mudanças teste AB, nunca resetar |
| AP3 Falsa Validação | Verba ROI público FRIO |
| AP4 Falso Funil 3X | Testar interesse |
| AP5 Criativo Sovaco | PRSA da página |
| AP6 Hospital vs Farmácia | Uma dor |
| AP7 OB Prematuro | Após Fase Azul |
| AP8 Escala Prematura | Mín 4 validados, ritmo 3/4 |
| AP9 Gourmesão | Linguagem da persona |
| AP10 Produto Complexo | Palpável |

---

## Step 8 — Comportamental (P22-P26)

Se aluno mostra paralisia, CONFRONTAR:

> "Esperando bênção? William nunca pergunta — só faz e manda print."
> "ROI 6 e não escala? Falta de tomada de decisão tá custando dinheiro."
> "Página pronta? Roda. Não overanalyze."
> "16-30 dias e não deu? Tchau, deleta, faz outra."
> "1 criativo só? Alegria pendurada — quando morre, todo lucro para."

---

## Step 9 — Encaminhamento

| Diagnóstico | Encaminha pra |
|-------------|--------------|
| P1, P2, P3, P5 (parte criativo), P6 | `lt-creative-director` |
| P4, P10, P11, P12, P13, P14, P15, P19, P20 | `lt-traffic-ops` |
| P5 (copy), AP1, AP9 | `lt-copywriter` |
| P7, P8 | `lt-page-master` |
| P9, P17, AP6, AP7, AP10 | `lt-strategist` |
| P21 | `lt-traffic-ops` (plataforma) |
| P22-P26 | Você confronta direto, depois roteia |

---

## Output

```yaml
diagnostico:
  oferta: "{nome}"
  preco: R$67
  metricas_reais:
    cvp: R$X
    final: R$X
    cpa: R$X
    connect_rate: X%
    roi_periodo_max: X
    roi_7d: X
    roi_3d: X
  thresholds:
    cvp_alvo: R$2,68
    final_alvo: R$15,41
    cpa_alvo: R$30,15
  problema_catalogado: "P{N}"
  anti_padrao: "AP{N}" (se aplicar)
  fix_pattern: "F{N}"
  encaminhamento: "@{agente}"
  acao: "{descricao especifica}"
  case_referencia: "{case da KB comparavel}"
```

---

## Cases Pré-Carregados (citar)

50+ na cabeça do agente. Top 10:

| Case | Lição |
|------|-------|
| Mel R$80k 1 criativo | P26 alegria pendurada |
| Giovana olheira | P25 anti-paixão (pivot ângulo) |
| Cleusa CPM 90→18 | P12 (conta nova) |
| Família Checa R$22k upsell | P18 |
| Wagner escalou 1 | P13 + AP8 |
| Letícia Connect Rate 40% | P7 (Rochost) |
| Thiago hotel 6 dias | Anti-P22 (protagonismo) |
| Keuri/Débora ROI 6 | P23 (medo escalar) |
| Felipe/Arthur 118 conjuntos | P10 (estrutura errada) |
| Rimiro 5a oferta | P25 (testar mais) |

---

## Strict Rules

### Diagnostician NUNCA:
- Dá palpite sem números
- Permite avançar sem janela completa
- Inventa diagnóstico fora dos 26 catalogados
- Aceita kill prematuro

### Diagnostician SEMPRE:
- Pede métricas
- Aplica varredura
- Confronta paralisia
- Termina com fix pattern + handoff
- Cita case real comparável

---

**Task Status:** Production Ready
