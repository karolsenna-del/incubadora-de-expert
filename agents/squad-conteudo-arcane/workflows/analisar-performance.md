---
workflow: "Analisar Performance"
versao: "1.0.0"
fases: 3
duracao_estimada: "15-45 min (depende do volume)"
quando_usar: "Posts ja postados — expert quer diagnosticar performance e gerar insights"
output_principal: "docs/producao-conteudo/{expert}/analises/{data}/relatorio.md"
---

# Workflow: Analisar Performance — Pós-Publicação

**Workflow ID:** analisar-performance
**Versão:** 1.0.0

---

## Quando Usar

Use este workflow quando:
- Expert postou e quer entender o que rolou
- Quer comparar múltiplos posts (semana/mês)
- Quer ler comentários qualitativamente
- Quer plano de escala (formato vs assunto)
- Tem dump do Apify pra processar

**Cadência sugerida:** sob demanda + opcional semanal.

---

## Pipeline (3 Fases)

```
═══════════════════════════════════════════════════════════════
ANALISAR PERFORMANCE
═══════════════════════════════════════════════════════════════

FASE 1: COLETAR INPUT
  ↓ Print / Verbalizado / Apify JSON / Dump comentarios
  ↓ Quantos posts? 1 (individual) ou N (batch)?
  ↓
FASE 2: DIAGNOSTICAR (Aria)
  ↓ Se 1 post: analisar-post.md
  ↓ Se N posts: analisar-batch.md
  ↓ Se Apify: ler-apify.md → analisar-post OU analisar-batch
  ↓ Se comentarios: analisar-comentarios.md (paralelo)
  ↓
FASE 3: GERAR RELATORIO + INSIGHTS
  ↓ Output: relatorio.md
  ↓ Recomendações estratégicas
  ↓ Insights pra Iris (pool) e Rico (roteiro)
  ↓
ENTREGA: Expert decide o que executar
```

---

## FASE 1: Coletar Input

Aria pergunta ao expert:

```
Pra analise, tem 4 fontes possiveis:

1. PRINT/screenshot do Instagram Insights
2. VERBALIZADO ("250k views, 35% nos 3s, etc")
3. JSON do APIFY (scraping)
4. DUMP DE COMENTARIOS (texto)

Voce vai analisar:
- 1 POST especifico (deep dive)?
- N POSTS comparativo (batch)?
- COMENTARIOS qualitativa?
- TUDO (post + comentarios + batch)?

Manda o que tem.
```

---

## FASE 2: Diagnosticar

Aria roteia conforme input:

### Caminho A — 1 Post Individual

**Task:** `analisar-post.md`

Steps:
1. Coletar 3 métricas-chave
2. Identificar tema/hook/formato/elementos usados
3. Diagnosticar cirurgicamente cada métrica
4. (Se houver comentários) análise qualitativa
5. Recomendações estratégicas

### Caminho B — Batch (N posts)

**Task:** `analisar-batch.md`

Steps:
1. Diagnóstico individual resumido de cada post
2. Comparativo top vs bottom
3. Padrões identificados (formato/tema/hook campeões)
4. Lapidação 80/20 sugerida
5. 2 formas de escalar + reaproveitamento

### Caminho C — Apify JSON

**Task:** `ler-apify.md`

Steps:
1. Validar e processar JSON
2. Extrair posts + métricas + comentários
3. Encaminhar pra Caminho A ou B conforme volume

### Caminho D — Comentários Qualitativa

**Task:** `analisar-comentarios.md`

Pode rodar paralelo às outras análises:
1. Sentimento geral
2. Dúvidas recorrentes (= temas novos)
3. Pontos que ressoaram
4. Polêmica/discordância
5. Demanda por continuidade
6. Insights pra Iris e Rico

---

## FASE 3: Relatório + Insights

Output final em `docs/producao-conteudo/{expert}/analises/{YYYY-MM-DD}/relatorio.md`:

```markdown
# Relatório de Análise — {data}

## Período / Posts Analisados
[lista]

## Diagnóstico
[depende do caminho — individual ou batch]

## Análise Qualitativa
[se houver comentários]

## Padrões Identificados
[se foi batch]

## Recomendações Estratégicas

### Pra IRIS (atualizar pool)
- {tema novo extraído de dúvidas recorrentes}
- {ângulo derivado de polêmica}
- {tema da continuidade}

### Pra RICO (próximos roteiros)
- {padrão de hook campeão}
- {estrutura validada}
- {ângulo a aprofundar}

### EXECUÇÃO RECOMENDADA
1. {ação 1 — escalar formato}
2. {ação 2 — escalar assunto}
3. {ação 3 — reaproveitar}

> Aria sugere. Expert decide.
```

---

## ENTREGA

```
Relatorio pronto em
`docs/producao-conteudo/{expert}/analises/{data}/relatorio.md`.

Recomendacao principal: {sintese}

Voce decide o que executar. Quer que eu encaminhe pra:
- IRIS (atualizar pool com insights de comentarios e padroes)?
- RICO (proximo roteiro usando padrao identificado)?

Ou guarda o relatorio e segue?
```

→ Volta pro Vox.

---

## Tempo Total

- Análise 1 post: 15-25 min
- Análise batch (3-5 posts): 30-45 min
- Análise comentários (50+ comentarios): 15-30 min
- Apify JSON (processar): 5-10 min

---

## Quality Gate

**QG-SCA-005 — Análise entregue**

- [ ] Input coletado e estruturado
- [ ] Diagnóstico cirurgico feito (3 métricas + identificação dos elementos)
- [ ] Análise qualitativa (se aplicável)
- [ ] Recomendações estratégicas geradas
- [ ] Insights organizados pra outros agentes
- [ ] Relatório salvo

---

**Workflow Status:** Ready for Production
