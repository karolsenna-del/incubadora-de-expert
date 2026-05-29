---
task: "Analisar Comentários"
responsavel: "@aria-analista"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Dump de comentarios (copy-paste) de 1 ou N posts"
Saida: "Analise qualitativa + insights pra proximos posts"
Checklist:
  - "Sentimento geral classificado"
  - "Duvidas recorrentes extraidas (cada uma = tema potencial)"
  - "Pontos que ressoaram identificados"
  - "Polemica/discordancia mapeada"
  - "Demanda por continuidade detectada"
  - "Insights pra Iris (pool) e Rico (roteiro) listados"
execution_type: "interactive"
---

# Task: Analisar Comentários — Qualitativa

**Task ID:** squad-conteudo-arcane/analisar-comentarios
**Version:** 1.0.0
**Responsavel:** @aria-analista
**Category:** Pós-Publicação — Análise Qualitativa
**Execution Type:** Interactive

---

## Propósito

Métricas dizem ONDE quebrou/funcionou. Comentários dizem POR QUÊ.

Aria lê comentários e extrai:
- Sentimento real do público
- Dúvidas recorrentes (= temas novos)
- Pontos que ressoaram (= ângulos a aprofundar)
- Polêmica/discordância (= novos ganchos)
- Demanda por continuidade (= serializar)

---

## Pipeline

```
analisar-comentarios
  |
  v
STEP 1: COLETAR DUMP DE COMENTARIOS
  Copy-paste do expert OU via Apify
  |
  v
STEP 2: CLASSIFICAR SENTIMENTO GERAL
  % positivo / negativo / neutro
  |
  v
STEP 3: EXTRAIR DUVIDAS RECORRENTES
  Top 5-10 perguntas/duvidas mais citadas
  |
  v
STEP 4: PONTOS QUE RESSOARAM
  Frases/ideias que apareceram em multiplos comentarios
  |
  v
STEP 5: POLEMICA / DISCORDANCIA
  Reacao negativa pode virar gancho novo
  |
  v
STEP 6: DEMANDA POR CONTINUIDADE
  Pediram parte 2? Aprofundamento?
  |
  v
STEP 7: GERAR INSIGHTS PRA OUTROS AGENTES
  Iris (pool) + Rico (roteiro)
```

---

## Step 1: Coletar Dump

```
Cola os comentarios aqui. Pode ser:
- Copy-paste direto do Instagram (selecionar todos)
- JSON do Apify (scrapeia comentarios)
- Exportacao manual

Quanto mais, melhor analise. Idealmente 50+ comentarios.
```

---

## Step 2: Sentimento Geral

Aria lê e classifica:

```markdown
## SENTIMENTO GERAL ({N} comentarios analisados)

- {X}% positivo (concordancia, elogios, agradecimentos)
- {Y}% negativo (defensiva, discordancia, criticas)
- {Z}% neutro (dúvidas técnicas, pedidos, observações)

Tipo de discussão: {polarizada / consensual / dispersa}
```

---

## Step 3: Dúvidas Recorrentes

Top 5-10 perguntas/dúvidas que aparecem em múltiplos comentários:

```markdown
## TOP DÚVIDAS RECORRENTES (cada uma = tema potencial)

1. "{dúvida}" ({N} menções)
   → TEMA POTENCIAL NOVO: "{tema sugerido baseado na dúvida}"

2. "{dúvida 2}" ({N} menções)
   → TEMA POTENCIAL: ...

[até 10]
```

---

## Step 4: Pontos Que Ressoaram

Frases/ideias do post que apareceram repetidas nos comentários:

```markdown
## PONTOS QUE RESSOARAM FORTE

- "{ponto/ideia 1}" — citado {N} vezes
- "{ponto/ideia 2}" — citado {N} vezes
- "{frase do expert}" — repetida em {N} comentários
```

Esses pontos sinalizam: o que tocou. Vale APROFUNDAR em próximos posts.

---

## Step 5: Polêmica / Discordância

Reação negativa pode ser ouro pra próximos posts:

```markdown
## POLÊMICA DETECTADA

Padrão de discordância: "{tipo de reação negativa}"
Exemplos:
- "{comentário discordante 1}"
- "{comentário 2}"

Análise:
{padrão da discordância — ironicamente, defesa de algo que o
post criticou? Reação superficial? Discordância sincera?}

GANCHO POTENCIAL:
"{tema novo que confronta a reação negativa}"
```

---

## Step 6: Demanda Por Continuidade

```markdown
## DEMANDA POR CONTINUIDADE

{N} comentários pediram:
- "Faz parte 2"
- "Aprofunda nesse tema"
- "Como aplicar em [contexto Y]?"
- "E pra quem [situação Z]?"

→ Tema engatou. Vale SERIALIZAR.

Próximos posts da série podem ser:
1. {ideia 1}
2. {ideia 2}
3. {ideia 3}
```

---

## Step 7: Insights Pra Outros Agentes

```markdown
## INSIGHTS PRA ENCAMINHAR

### Pra IRIS (atualizar pool de temas)
- {N} temas novos extraídos das dúvidas
- {N} ângulo derivado da polêmica detectada
- Sinalização: tema da continuidade engatou — adicionar ao pool

### Pra RICO (próximos roteiros)
- Pontos que ressoaram = usar como hook ou conteúdo central
- Padrão de discordância = gancho contra-intuitivo potencial
- Demanda por continuidade = base pra série
```

---

## Output

Salva na seção qualitativa do relatorio.md em
`docs/producao-conteudo/{expert}/analises/{data}/relatorio.md`.

---

**Task Status:** Ready for Production
