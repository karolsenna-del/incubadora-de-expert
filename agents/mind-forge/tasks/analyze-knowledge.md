# Task: analyze-knowledge

## Objetivo

Executar analise profunda de todas as fontes usando 6 lentes, extrair Knowledge Facets (KFs), mapear dominios, perfilar voz dos experts, e detectar convergencias/tensoes/gaps.

## Trigger

- Continuacao automatica da Fase 1 (ingest-sources)
- `*resume` quando pipeline pausado na Fase 2

## Pre-condicoes

- Fase 1 completa (QG-MF-001 passed)
- source-manifest.yaml disponivel

## Agente Executor

@knowledge-miner

## Referencia Obrigatoria

- `agents/mind-forge/data/extraction-lenses.yaml` — 7 lentes de analise (6 de leitura + 1 de implicito)
- `agents/mind-forge/data/kf-classification.yaml` — 7 tipos de KF + regras

## Passos

### Step 1: Passe 1 — Mapeamento (L1 + L2)

Para cada fonte:

**L1 — Territory Mapping:**
- Quais dominios/topicos a fonte cobre?
- Qual a tese central?
- Quais termos o expert define de forma propria?
- Extrair: PRINCIPLE, VOCABULARY

**L2 — Framework Extraction:**
- Quais metodologias nomeadas existem?
- Quais sao os passos/componentes?
- Extrair: FRAMEWORK

Resultado parcial: ~50% dos KFs.

### Step 2: Passe 2 — Extracao (L3 + L4)

Para cada fonte:

**L3 — Heuristic Mining:**
- Quais regras SE/ENTAO o expert ensina?
- Quais criterios de decisao?
- Extrair: HEURISTIC

**L4 — Voice & Personality:**
- Quais frases de assinatura?
- Qual tom de comunicacao?
- O que o expert NUNCA diz?
- Extrair: OUTPUT_FORMAT, VOCABULARY

Resultado parcial: ~80% dos KFs.

### Step 3: Passe 3 — Fronteiras (L5 + L6)

Para cada fonte:

**L5 — Cases & Illustrations:**
- Quais exemplos concretos?
- Quais cases de antes/depois?
- Extrair: EXAMPLE

**L6 — Boundaries & Anti-patterns:**
- O que o expert avisa pra NAO fazer?
- Onde a metodologia nao se aplica?
- Extrair: ANTI_PATTERN

Resultado parcial: ~95% dos KFs.

### Step 3.5: Desconstrucao (condicional — fontes tipo transcript/entrevista)

**Aplica-se APENAS quando** source-manifest indica fontes tipo `transcript`, `interview`, `podcast` ou `qa_session`.

Para cada fonte elegivel, aplicar perguntas de desconstrucao sobre o conteudo:

1. **Ponto de Decisao:** "Em que momento exato o expert mudou de abordagem/opiniao? O que causou a mudanca?"
   - Extrair: HEURISTIC (o criterio de decisao implicito)

2. **Contrafactual:** "Se o contexto fosse diferente, a recomendacao mudaria? Como?"
   - Extrair: HEURISTIC com `exception` preenchida

3. **Pior Decisao:** "Qual foi o pior erro que o expert admite? O que aprendeu?"
   - Extrair: ANTI_PATTERN com `consequence` real

4. **Framework Forcado:** "Se o expert NAO pudesse usar seu framework principal, o que faria?"
   - Extrair: PRINCIPLE (revela hierarquia de valores)

5. **Pergunta que o expert NAO respondeu:** "O que o entrevistador perguntou que o expert desviou ou simplificou?"
   - Extrair: gap documentado ou ANTI_PATTERN implicito

**Regra:** Todas as respostas devem ter `source_ref` com timestamp. Se o expert nao disse explicitamente, marcar `inferred: true`.

**Output:** KFs adicionais com `source_lens: "deconstruction"` e `notes: "[extraido via desconstrucao]"`.

### Step 3.7: Passe 4 — Implicito (L7)

Meta-analise sobre os KFs ja extraidos nos passes 1-3:

**L7 — Implicit & Tacit:**
- Que premissas o expert assume sem declarar?
- Que heuristicas SE/ENTAO existem nas entrelinhas mas nao foram formalizadas?
- Que decisoes foram feitas por omissao (topicos ignorados, alternativas nao discutidas)?
- Que contradicoes sutis existem entre diferentes partes do conteudo?
- Extrair: HEURISTIC, PRINCIPLE, ANTI_PATTERN
- Marcar todos com nota `[extraido de implicito]`, confidence max 0.7

**Regra critica:** KFs implicitos sao hipoteses ate o playback. O usuario confirma ou descarta na Fase 3.

Resultado parcial: ~98% dos KFs.

### Step 4: Classificacao Pareto ao Cubo

Apos extrair todos os KFs (passes 1-4), classificar cada um numa zona Pareto:

**Criterios de classificacao (ver `kf-classification.yaml` secao `pareto_zone`):**

| Zona | % esperado | Criterio rapido |
|------|-----------|-----------------|
| Crown Jewel | <5% | Define a identidade da mente. Sem ele, a mente perde sentido |
| Excellence | ~10-15% | Pilar operacional. Framework completo ou heuristica de alta aplicacao |
| Impact | ~20-30% | Util e aplicavel, mas nao unico |
| Filler | ~50-60% | Generico ou de suporte. Avaliar se vale incluir |

**Adicionar campo `pareto_zone` em cada KF.**

**Regra:** Se >10% dos KFs estao como Crown Jewel, o miner esta sendo generoso demais. Revisar.

### Step 5: Domain Mapping

Organizar todos os KFs extraidos por DOMINIO (nao por fonte):

**Modo sintetica:**
- Agrupar KFs de diferentes experts pelo mesmo dominio
- Identificar convergencias (2+ experts concordam)
- Identificar tensoes (experts discordam)

**Modo consultor:**
- Agrupar KFs por subtopico dentro da metodologia
- Avaliar profundidade relativa de cada subtopico

Gerar `02-analysis/domain-map.yaml`.

### Step 6: Voice Profiling

Para cada expert (sintetica) ou para o assunto (consultor):

- Tom de comunicacao
- Frases de assinatura (exatas)
- Vocabulario obrigatorio e proibido
- Estrutura de entrega preferida
- Metaforas/analogias frequentes

Em modo sintetica, propor voz fundida:
- Expert dominante como ancora
- Blend do vocabulario dos demais

Gerar `02-analysis/voice-profile.yaml`.

### Step 7: Analysis Metrics

Calcular e gerar `02-analysis/analysis-metrics.yaml`:

```yaml
metrics:
  total_kfs: N
  by_type:
    PRINCIPLE: N
    FRAMEWORK: N
    HEURISTIC: N
    EXAMPLE: N
    ANTI_PATTERN: N
    VOCABULARY: N
    OUTPUT_FORMAT: N
  by_pareto_zone:
    crown_jewel: N
    excellence: N
    impact: N
    filler: N
  total_domains: N
  average_confidence: 0.X
  inferred_ratio: 0.X
  source_ref_coverage: 0.X  # % de KFs com citacao granular
  convergences: N       # sintetica
  tensions: N           # sintetica
  gaps:
    - "{dominio sem exemplos}"
    - "{dominio raso}"
```

### Step 8: Self-Validation (checklist antes do handoff)

Antes de passar pelo QG-MF-002, o miner executa self-validation:

- [ ] **Citacoes granulares:** >=60% dos KFs tem `source_ref` preenchido (localizacao exata)
- [ ] **Voice profile:** >=5 signature phrases EXATAS verificaveis na fonte
- [ ] **Pareto classificado:** Todos os KFs tem `pareto_zone` atribuido
- [ ] **Crown Jewels identificados:** 1-5% dos KFs marcados como crown_jewel
- [ ] **Trinity por dominio:** Cada dominio tem pelo menos 1 FRAMEWORK + 1 HEURISTIC + 1 EXAMPLE
- [ ] **Zero KFs genericos:** Nenhum KF sobreviveu que "qualquer expert diria"
- [ ] **Tensoes documentadas (sintetica):** Divergencias entre experts registradas com ambos os lados
- [ ] **Confidence baseline aplicado:** Confidence scores seguem tabela de referencia de `kf-classification.yaml`

**Se qualquer item FAIL:** Corrigir antes de prosseguir. Loop, nao handoff.

**Se 3+ items FAIL:** Reportar ao forge-chief — pode indicar fontes insuficientes.

### Step 9: Quality Gate QG-MF-002

Validar:

**Sintetica:**
- [x] >= 20 KFs extraidos
- [x] >= 2 KFs tipo FRAMEWORK
- [x] >= 3 KFs tipo HEURISTIC
- [x] >= 3 dominios identificados
- [x] Confianca media >= 0.7
- [x] Voice profile completo
- [x] Ratio inferred < 0.4

**Consultor:**
- [x] >= 15 KFs extraidos
- [x] >= 2 KFs tipo FRAMEWORK
- [x] >= 3 KFs tipo HEURISTIC
- [x] >= 3 subtopicos identificados
- [x] Confianca media >= 0.7
- [x] Voice profile completo

**Veto:** < 10 KFs, ou 0 FRAMEWORKs, ou > 40% inferred.

### Step 10: Salvar KFs

Gerar `02-analysis/knowledge-facets.yaml` com todos os KFs estruturados.

### Step 11: Atualizar State e Handoff

Atualizar `.state.json`:
```json
{
  "phase_status": { "phase_2": "completed" },
  "current_phase": 3,
  "total_kfs": N,
  "domains_identified": N,
  "quality_gates_passed": ["QG-MF-001", "QG-MF-002"]
}
```

Fazer handoff de volta para @forge-chief com task `playback-validate`.

## Formato de Output

- `02-analysis/knowledge-facets.yaml`
- `02-analysis/domain-map.yaml`
- `02-analysis/voice-profile.yaml`
- `02-analysis/analysis-metrics.yaml`

## Error Handling

| Cenario | Acao |
|---------|------|
| Fonte rasa (poucos KFs) | Registrar gap, continuar |
| Tipo de KF ambiguo | Preferir tipo mais restritivo |
| Experts contradizem | Registrar como tensao, nao resolver |
| QG-MF-002 falha | Reportar ao chief com gaps especificos |

## Completion Criteria

- Todos os 4 arquivos de output gerados
- QG-MF-002 passou
- State atualizado
- Handoff executado
