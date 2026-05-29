---
task: "Teste Bifasico — Encontrar Campeao + Variar"
responsavel: "@lt-creative-director (com @lt-traffic-ops)"
atomic_layer: "task"
Entrada: "Pagina pronta + Setup trafego ok"
Saida: "Top 15 criativos validados pra escala"
execution_type: "interactive multi-agent (4-7 dias)"
---

# Task: Teste Bifasico — Processo de Encontrar Criativo Campeao

**Task ID:** squad-low-ticket-arcane/teste-bifasico
**Owner:** lt-creative-director (criou Jett)
**Duracao:** 4-7 dias minimo

---

## Conceito

Processo em 2 fases pra encontrar O CRIATIVO que vende E depois multiplicar variacoes:

1. **Fase 1 (Variedade):** ~10 criativos com COPIES 100% DIFERENTES — descobre QUAL fala converte
2. **Fase 2 (Variacoes):** 50-300 versoes da fala campea em cenarios diferentes

> "Vocês perceberam que todos os meus criativos são iguais? Só muda o cenário? Sim ou não? Sim. Porque eu acertei aquela copy."

---

## FASE 1 — Teste de Copy (Variedade Total)

### PRÉ-REQUISITO INEGOCIÁVEL

**F1 só começa DEPOIS de tom calibrado e aprovado.** Antes de Quinn cuspir as 10 copies, o protocolo de protótipos da `tasks/prsa-criativo.md` precisa ter sido rodado:

1. ✅ 6 inputs verificados (EDI, página, pneu furado, mecanismo, persona gravação, tom)
2. ✅ 2-3 protótipos com estilos de abertura diferentes (A-F)
3. ✅ Aprovação explícita do aluno no tom (não "mais ou menos")

**Se algum desses falta, F1 NÃO sobe.** Subir F1 com tom não calibrado = queimar 10 criativos.

### Objetivo

Descobrir QUAL copy/fala conecta com o publico.

### Regras Cardinais

| Regra | Detalhe |
|-------|---------|
| Tom calibrado antes do batch | Protocolo de protótipos rodado e aprovado |
| Copies 100% diferentes | NÃO usar mesma copy em criativos diferentes |
| Variedade real em 2+ dos 4 vetores | Eixo emocional / Estilo abertura (A-F) / Comprimento (20-60s) / Show do produto |
| Ambientes diferentes | Cenarios distintos pra cada criativo |
| Formatos diferentes | Talking head, tela, dialogo, etc |
| Mínimo 3 copies / 3 ambientes | Variedade real, não micro-variações |
| 10 criativos teste | 5 se verba curta |
| Período | Mínimo 3-5 dias rodando |

### Os 4 Vetores de Variedade (regra do Quinn)

| Vetor | Variações |
|-------|-----------|
| **Eixo emocional** | Quantos eixos a persona tem? (Ex: Deus, filhos, marido, dinheiro, corpo) |
| **Estilo de abertura** | 6 estilos A-F (`data/core/estilos-de-abertura.md`) — confissão, observação, cena, pergunta gentil, terceira pessoa, tabu |
| **Comprimento** | 20-30s / 30-45s / 45-60s |
| **Mostra produto** | Sem show / show parcial / show máximo |

Cada criativo F1 deve variar em pelo menos **2 dos 4 vetores**. Sem variedade = 10 versões da mesma coisa = teste sem sinal estatístico.

### Estrutura no Tráfego

`lt-traffic-ops` sobe ABO Testadora 1-1-1:
- 1 campanha → 10 conjuntos (1 por criativo) → cada um 1 criativo
- 45% do produto/dia por conjunto
- Advantage aberto
- 00:00:03

### Critério de Validação F1 (Criativo Campeão)

| Critério | Valor |
|----------|-------|
| Vendas mínimas | 5-10 (10 = estatisticamente confiavel) |
| ROI mínimo | >= 2.5 |
| Funil 3X | CVP < 4%, Final < 23%, CPA < 45% |
| Tempo rodando | Min 3 dias completos |

**Resultado:** Identificar 1-3 criativos top com ROI >= 2.5.

### Pegar a FALA EXATA

Anotar literal:
- Texto da Cabeca (P) que mais converteu
- Texto do Corpo (R)
- Texto da Cauda (S+A)

Essa fala = "fórmula vencedora". Não muda mais.

---

## FASE 2 — Variações do Campeão

### Objetivo

Multiplicar arsenal mantendo a copy validada.

### Workflow

| Passo | Ação |
|-------|------|
| 1 | Pegar FALA EXATA do criativo campeão |
| 2 | Gravar 50-300 versões da MESMA fala em cenários diferentes |
| 3 | Identificar Top 15 do lote |
| 4 | Usar Top 15 nas campanhas de escala |

### O que VARIA na Fase 2

- Cenário (clínica, escritório, parque, viagem)
- Roupa
- Hook visual (objeto inusitado, pattern interrupt)
- Headline visual primeiros 3-5s
- Legenda
- Música de fundo (se usar)
- Formato (selfie, dupla, podcast)

### O que NÃO VARIA

- A FALA / COPY validada da Fase 1
- A estrutura PRSA
- Os 3 CTAs (manter os mesmos)

### Volume Recomendado

| Recursos | Volume Fase 2 |
|----------|---------------|
| Verba abundante + estúdio | 200-300 versões |
| Verba média + iPhone | 100-150 versões |
| Verba limitada | 50 versões |

### Lego como Multiplicador

Aplicar `tasks/hulk-lego.md` na Fase 2:
- 10 cabeças (variações de gancho)
- 5 corpos (variações de Rota — mas mantendo copy validada)
- 3 caudas (S+A)
- = 150 criativos da Fase 2

---

## Análise da Fase 2

### Identificar Top 15

Após 5-10 dias rodando os 50-300:

| Métrica | Threshold pra Top 15 |
|---------|----------------------|
| ROI | >= 2.5 |
| Vendas | >= 5 |
| CVP | < 4% do produto |

Top 15 = arsenal de escala pra ABO Raiz / ABO Campeões / Gramado / CBO.

---

## Volume e Sustentabilidade

| Métrica | Valor |
|---------|-------|
| Criativos novos/semana | 5-10 (mínimo) |
| Criativos novos/dia (verba limitada) | 2 |
| Validados antes de escalar | Mínimo 4 |
| Limite criativos/mês por página FB | 250 (workaround: múltiplas páginas) |

> "Enquanto eu não tiver 4 criativos na minha mão, eu não faço nada."

> "Criativo no perpétuo é lenha." — alimentar constantemente.

---

## Cases Reais

| Case | Insight |
|------|---------|
| **Mil Seguidores Por Semana** (Maxxima) | F1: criativo selfie movimento, ROI 4.0. F2: 50+ versões. CBO R$54.882, 1.691 compras |
| **Menos 1kg** (Gabriel/Suelen) | F1: criativo dupla (diálogo), ROI 1.8 |
| **Grace Vinho** | F1: criativo "feio" do churrasco com papelzinhos venceu produzidos |
| **Mel R$80k** | NÃO fez F2 a tempo — alegria pendurada |

---

## Anti-Padrões

| AP | Antidoto |
|----|----------|
| **F1 sem tom calibrado** (pular protocolo de protótipos) | Quinn roda `*prototipos` ANTES de cuspir as 10 copies |
| **Variedade falsa** (10 versões da mesma coisa) | Cada criativo varia em 2+ dos 4 vetores (eixo, estilo, comprimento, show) |
| Mesma copy em criativos diferentes na F1 | Copies 100% diferentes |
| Variar copy na F2 | Manter copy validada (só varia cenario/visual) |
| Pular F1 e ir direto pra F2 | F1 e obrigatorio pra descobrir copy campea |
| Escalar com <4 criativos validados | Esperar arsenal antes de escalar |
| Decidir em <3 dias | Cha de camomila |

---

## Output

```yaml
fase_1:
  criativos_testados: 10
  copies_diferentes: 10
  formatos_diferentes: 5+
  duracao_dias: 5
  campeao_identificado: true
  fala_exata_validada: "{copy completa}"
  roi_campeao: 2.8

fase_2:
  versoes_gravadas: 150
  cenarios: 12
  roupas: 6
  duracao_dias: 5
  top_15_identificado: true
  arsenal_escala: 15 criativos prontos
```

---

## Handoff

→ `lt-traffic-ops *kit-escala` — testar 8 estruturas com Top 15

---

**Task Status:** Production Ready
