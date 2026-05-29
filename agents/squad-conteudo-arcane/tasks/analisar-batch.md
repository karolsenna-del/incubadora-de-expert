---
task: "Analisar Batch (Comparativo)"
responsavel: "@aria-analista"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "N posts (>=3 ideal) com metricas"
Saida: "relatorio.md com comparativo + padroes identificados + recomendacoes"
Checklist:
  - "Diagnostico individual de cada post (resumido)"
  - "Comparativo top vs bottom performers"
  - "Padroes identificados (formato + tema + hook + elementos)"
  - "Lapidacao 80/20 sugerida"
  - "Sugestoes de escala (formato vs assunto)"
  - "Salvou em relatorio.md"
execution_type: "interactive"
---

# Task: Analisar Batch — Comparativo de N Posts

**Task ID:** squad-conteudo-arcane/analisar-batch
**Version:** 1.0.0
**Responsavel:** @aria-analista
**Category:** Pós-Publicação — Análise Comparativa
**Execution Type:** Interactive

---

## Propósito

1 post = sorte/anomalia. 3+ posts com mesmo padrão = sinal.

Aria compara múltiplos posts pra identificar PADRÕES (não conclusões isoladas).

---

## Pipeline

```
analisar-batch
  |
  v
STEP 1: COLETAR DADOS DOS N POSTS (minimo 3)
  |
  v
STEP 2: DIAGNOSTICO INDIVIDUAL RESUMIDO
  Mesmo padrao do analisar-post mas mais conciso
  |
  v
STEP 3: COMPARATIVO TOP vs BOTTOM
  Identifica padroes
  |
  v
STEP 4: PADROES CONSOLIDADOS
  Formato campeao, tema campeao, hook campeao
  |
  v
STEP 5: LAPIDACAO 80/20
  Sugestao de foco
  |
  v
STEP 6: 2 FORMAS DE ESCALAR + REAPROVEITAMENTO
  |
  v
STEP 7: SALVAR relatorio.md
```

---

## Step 1: Coletar Dados

Aria pede:

```
Pra analise comparativa, preciso de pelo menos 3 posts. Pode ser:
- Print dos Insights de cada
- Verbalizado
- Apify JSON com batch

Tem como passar os dados de pelo menos 3? Quanto mais, melhor
(idealmente 5-10 pra padrao mais forte).
```

---

## Step 2: Diagnóstico Individual Resumido

Pra cada post:

```
Post N: "{título/tema}"
  Formato: {qual}
  Hook: {gatilhos}
  Tema: {qual + categoria}
  Métricas: 3s={X}% / Tempo={Y}% / Interação={Z}%
  Diagnóstico: {OK / problema X / problema Y}
```

---

## Step 3: Comparativo Top vs Bottom

Aria identifica:

**TOP PERFORMERS:**
- Quais 2-3 posts performaram melhor
- O que tinham em comum (formato, hook, tema, elementos)
- Por que pegaram

**BOTTOM PERFORMERS:**
- Quais 2-3 posts performaram pior
- O que tinham em comum
- Onde quebrou (3s? retenção? interação?)

---

## Step 4: Padrões Consolidados

```markdown
## PADRÕES IDENTIFICADOS

🔥 FORMATOS CAMPEÕES:
- {Formato A} — bateu {N} posts com média {X}% acima
- {Formato B} — bateu {N} posts com média {Y}% acima

🔥 TEMAS CAMPEÕES:
- "{Tema 1}" — {N} posts top performers
- "{Tema 2}" — {N} posts top performers

🔥 HOOKS CAMPEÕES (estruturas):
- {Estrutura de hook 1} — apareceu nos tops
- {Estrutura de hook 2}

🔥 ELEMENTOS NOTÁVEIS RECORRENTES NOS TOPS:
- {Elemento 1} aparece em {N} dos tops
- {Elemento 2}

⚠️ ANTI-PADRÕES (nos bottoms):
- {O que tinha em comum nos flopers}
- {Onde quebrou consistentemente}
```

---

## Step 5: Lapidação 80/20 Sugerida

```markdown
## LAPIDAÇÃO SUGERIDA (princípio Hannah 80/20)

Próximos N posts:
- 80%: focar em FORMATO {campeão} + TEMA {tipos validados}
- 20%: testar formatos/temas novos pra não estagnar

Atenção: amostra ainda {pequena/média/grande}.
{Recomendação de quantidade ideal pra padrão mais firme}
```

---

## Step 6: 2 Formas de Escalar + Reaproveitamento

```markdown
## 2 FORMAS DE ESCALAR (Elias)

### Escalar FORMATO (gancho campeão + outros assuntos)
Pega estrutura do hook que ganhou e aplica em outros temas:
1. {ideia pronta 1}
2. {ideia pronta 2}
3. {ideia pronta 3}

### Escalar ASSUNTO (tema campeão + outros ganchos)
Pega tema que viralizou e faz outros ângulos:
1. {ideia 1}
2. {ideia 2}
3. {ideia 3}

## REAPROVEITAMENTO
- Top post X → virar {carrossel/reels/anúncio}? {recomendação}
- Top post Y → idem?
- Post {Z} de 30+ dias atrás vale repost? {sim/não}
```

---

## Step 7: Salvar relatorio.md

Em `docs/producao-conteudo/{expert}/analises/{data}/relatorio-batch.md`:

```markdown
# Relatório de Análise Batch — {data}

## Período Analisado
{datas / posts analisados}

## Resumo Individual
[Step 2 completo pra cada post]

## Comparativo Top vs Bottom
[Step 3 completo]

## Padrões Identificados
[Step 4 completo]

## Lapidação 80/20
[Step 5]

## Escala + Reaproveitamento
[Step 6]

## Recomendações Estratégicas
{síntese — o que o expert deve fazer a seguir}
```

---

## Veto Conditions

| Condição | Ação |
|----------|------|
| Menos de 3 posts pra batch | "Pra padrao, mínimo 3. Com 1-2, faz analise individual." → redireciona pra `analisar-post`. |
| Padrão emergente mas amostra pequena | Aviso: "Padrão sugerido mas amostra ainda pequena. Confirmar com mais 3-5 posts." |
| Posts heterogêneos demais (formatos/temas todos diferentes) | "Posts muito heterogeneos. Comparativo fica fraco. Sugiro padronizar pra teste — fazer 5 posts mesmo formato + temas variados, ou vice-versa." |

---

**Task Status:** Ready for Production
