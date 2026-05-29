---
task: "Analisar Post"
responsavel: "@aria-analista"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "1 post com metricas + (opcional) comentarios"
Saida: "relatorio.md com diagnostico cirurgico + recomendacoes estrategicas"
Checklist:
  - "Aria coletou as 3 metricas-chave (3s, tempo medio, interacao)"
  - "Identificou tema (qual das 16 categorias)"
  - "Identificou hook usado (gatilhos + camadas)"
  - "Identificou formato (qual da biblioteca)"
  - "Identificou elementos notaveis aplicados (quais dos 8)"
  - "Diagnosticou cada metrica (OK ou problema + qual)"
  - "Se houver comentarios, fez analise qualitativa"
  - "Sugeriu acoes estrategicas (sem disparar)"
  - "Salvou relatorio.md"
execution_type: "interactive"
---

# Task: Analisar Post — Análise Individual

**Task ID:** squad-conteudo-arcane/analisar-post
**Version:** 1.0.0
**Responsavel:** @aria-analista
**Category:** Pós-Publicação
**Execution Type:** Interactive

---

## Pipeline Visual

```
analisar-post
  |
  v
STEP 1: COLETAR INPUT
  Print / verbalizado / Apify / dump comentarios
  |
  v
STEP 2: EXTRAIR METRICAS-CHAVE
  3s + Tempo Medio + Interacao
  |
  v
STEP 3: IDENTIFICAR ELEMENTOS USADOS
  Tema + Hook + Formato + Elementos notaveis
  |
  v
STEP 4: DIAGNOSTICAR CIRURGICAMENTE
  Cada metrica: OK ou problema + qual + por que
  |
  v
STEP 5: ANALISE QUALITATIVA (se houver comentarios)
  Sentimento + duvidas + ressonancia + polemica + demanda
  |
  v
STEP 6: SUGERIR ACOES ESTRATEGICAS
  Escalar formato / escalar assunto / reaproveitar / repostar
  |
  v
STEP 7: SALVAR relatorio.md
```

---

## Step 1: Coletar Input

Aria pergunta ao expert qual o formato de entrada:

```
Posta os dados do post. Pode ser:

1. PRINT/screenshot do Insights do Instagram
2. VERBALIZADO (ex: "250k views, 35% nos 3s, 18s tempo médio, 850 comentários")
3. JSON do APIFY (cola aqui)
4. DUMP DE COMENTARIOS (pra analise qualitativa)

Quanto mais, melhor. Mas se voce só tem parte, eu trabalho
com o que tem.

Cola aqui.
```

Expert entrega.

---

## Step 2: Extrair Métricas-Chave

Aria identifica e calcula:

### 3 Métricas-Chave (Método Audience)

| Métrica | Cálculo | Threshold |
|---------|---------|-----------|
| **Taxa após 3s** | views após 3s ÷ views totais × 100 | >50% |
| **Tempo médio** | tempo médio ÷ duração total × 100 | 25-30% |
| **Interação/visualização** | (curtidas + comentários + compartilhamentos + salvamentos) ÷ views × 100 | >10% pra viralizar |

**Se input incompleto:** Aria avisa o que falta e o impacto:

```
Faltou {métrica}. Sem ela, diagnostico fica parcial.
Tem como voce conseguir? Esta no Instagram Insights:
- {onde achar}
```

---

## Step 3: Identificar Elementos Usados

Aria abre o roteiro/laminas do post analisado e identifica:

```markdown
### IDENTIFICAÇÃO CIRURGICA

TEMA USADO: "{tema}"
  Categoria das 16: {qual}
  Viralidade do tema: {alto/médio/baixo conforme exemplos similares}

HOOK USADO:
  Verbal: "{frase verbal}"
  Visual: "{o que mostrou}"
  Textual: "{texto na tela}"
  Gatilhos: {1-3 dos 7 — recompensa, mistério, popularidade,
    reputação, crença, disrupção, reconhecimento}

ESTRUTURA MACRO: Hook → Intro Forte → Conteúdo → CTA + Posicionamento
  Aplicou na íntegra? {sim/não — onde desviou se desviou}

FORMATO: {qual da biblioteca}

ELEMENTOS NOTÁVEIS APLICADOS (dos 8):
  ✓ {Elemento 1} — em {onde}
  ✓ {Elemento 2} — em {onde}
  ✓ {Elemento 3} — em {onde}
  ✗ {Elementos NÃO usados}

TOM DE VOZ: {mantido conforme perfil / desviou em — explicar}
```

---

## Step 4: Diagnosticar Cirurgicamente

Pra cada métrica:

```markdown
### DIAGNÓSTICO POR MÉTRICA

✓/✗ TAXA APÓS 3s: {X}% (threshold >50%)
   {OK / PROBLEMA NO GANCHO}
   
   Se OK: {comentário positivo — qual aspecto do hook funcionou}
   
   Se PROBLEMA:
   - Onde provavelmente travou:
     * Hook verbal: {avaliação}
     * Hook visual: {avaliação}
     * Hook textual: {avaliação}
   - AÇÃO sugerida: {como reforçar — combinar gatilhos, fortalecer camada}

✓/✗ TEMPO MÉDIO: {X}% do video (threshold 25-30%)
   {OK / PROBLEMA na ESTRUTURA/CONTEÚDO}
   
   Se OK: {qual estrutura segurou}
   
   Se PROBLEMA:
   - Onde provavelmente perdeu:
     * Transição entre seções
     * Looping aberto não fechou
     * Parte rasa no meio
     * Conteúdo notável fraco
   - AÇÃO sugerida: {como ajustar}

✓/✗ INTERAÇÃO: {X}% (threshold >10%)
   {OK / PROBLEMA no CTA ou NOTABILIDADE}
   
   Se OK: {o que gerou interação}
   
   Se PROBLEMA:
   - CTA: era específico de reconhecimento ou genérico?
   - Conteúdo: notável o suficiente pra compartilhar?
   - Polêmica/identificação: gerou ou não?
   - AÇÃO sugerida: {como ajustar}
```

---

## Step 5: Análise Qualitativa (se houver comentários)

Se expert passou comentários:

```markdown
### ANÁLISE QUALITATIVA DOS COMENTÁRIOS

SENTIMENTO GERAL:
- {X}% positivo (concordância)
- {Y}% negativo (defensiva, discordância)
- {Z}% neutro (dúvidas técnicas)

DÚVIDAS RECORRENTES (cada uma = tema potencial novo):
1. "{dúvida 1}" ({N} menções) → POTENCIAL TEMA: "{...}"
2. "{dúvida 2}" ({N} menções) → POTENCIAL TEMA: "{...}"
[...]

PONTOS QUE RESSOARAM FORTE:
- "{ponto 1}" (citado {N} vezes)
- "{ponto 2}" (citado {N} vezes)

POLÊMICA / DISCORDÂNCIA:
{síntese da reação negativa, se houve — pode virar gancho novo}

DEMANDA POR CONTINUIDADE:
{X} comentários pediram parte 2 / aprofundamento / variações
→ tema engatou, vale serializar
```

---

## Step 6: Sugerir Ações Estratégicas

```markdown
### RECOMENDAÇÕES ESTRATEGICAS

(Aria sugere. Expert decide. Nada é disparado.)

OPÇÃO A — ESCALAR FORMATO
   Se hook/estrutura ganharam:
   Pega gancho campeão + aplica em outros assuntos do pool
   Sugestões prontas:
   1. {ideia}
   2. {ideia}
   3. {ideia}

OPÇÃO B — ESCALAR ASSUNTO
   Se tema viralizou:
   Pega tema + faz outros ganchos
   Sugestões prontas:
   1. {ideia}
   2. {ideia}
   3. {ideia}

OPÇÃO C — REAPROVEITAR
   Carrossel → Reels? {sim/não — por quê}
   Reels → Anúncio pago? {sim/não}
   Repost em 30+ dias com pequenas mudanças? {sim/não}

OPÇÃO D — REFAZER COM AJUSTES
   Se métricas mostram um ponto fraco específico:
   Refazer mesmo post com {ajuste cirurgico} + republicar

OPÇÃO E — IGNORAR (post baixo, sem padrão)
   Se for 1 post isolado bottom performer, normal.
   Espera 3+ posts pra ver se vira padrão antes de ajustar.

VOCE DECIDE. EU SUGIRO.
```

---

## Step 7: Salvar relatorio.md

Salva em `docs/producao-conteudo/{expert}/analises/{YYYY-MM-DD}/relatorio.md`:

```markdown
# Relatório de Análise — {data}

## Post Analisado
- Tema: {tema}
- Formato: {formato}
- Postado em: {data}
- Plataforma: {Instagram / TikTok / etc}

## Identificação Cirurgica
[Step 3 completo]

## Diagnóstico por Métrica
[Step 4 completo]

## Análise Qualitativa
[Step 5 completo se aplicável]

## Recomendações Estratégicas
[Step 6 completo]

---

## Próximos Passos Sugeridos

(Aria sugere. Expert decide o que executar.)

1. {sugestão 1 — pode ser pra Iris atualizar pool}
2. {sugestão 2 — pode ser pra Rico produzir variação}
3. {sugestão 3 — pode ser ignorar e seguir produção normal}
```

---

## Veto Conditions

| Condição | Ação |
|----------|------|
| Expert pede pra Aria "subir o anúncio" | "Eu não disparo ação. Identifico que post X tem potencial pra anúncio. Voce decide." |
| Expert quer conclusão de 1 post como padrão | "1 post = sorte/anomalia. Pra ver padrão, junta 3+ posts com mesma característica." |
| Expert quer Aria prever próximo viral | "Não tem como prever. Eu mostro padrões do que funcionou — você decide próxima aposta baseado em vibe + timing." |
| Métricas incompletas (só views) | Avisar limitação. Trabalha com o que tem mas diz que diagnóstico é parcial. |

---

## Quality Gate

**QG-SCA-005 — Análise entregue**

Checklist:
- [ ] 3 métricas-chave coletadas (ou avisado que falta)
- [ ] Identificação cirurgica feita (tema, hook, formato, elementos)
- [ ] Diagnóstico por métrica completo
- [ ] Análise qualitativa (se houver comentários)
- [ ] Recomendações estratégicas com 3-5 opções
- [ ] Salvo em relatorio.md

---

## Próximo Passo

```
Análise pronta. Salvei em
`docs/producao-conteudo/{expert}/analises/{data}/relatorio.md`.

Recomendação principal: {síntese da Aria}

Voce decide o que executar. Quer que eu encaminhe algum
insight pra:
- Iris (atualizar pool de temas com dúvidas dos comentários)?
- Rico (próximo roteiro com padrão identificado)?

Ou só guarda o relatório e segue?
```

→ Volta pro Vox.

---

**Task Status:** Ready for Production
