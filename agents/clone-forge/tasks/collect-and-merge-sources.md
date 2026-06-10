# Task: Coleta, Merge e Validacao de Fontes

**Task ID:** clone-forge/collect-and-merge-sources
**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-03-02
**Category:** Source Collection Pipeline
**Execution Type:** Hybrid

---

## Executive Summary

Fase 1 do pipeline Clone Forge. Task self-contained de classificacao e validacao de fontes. Combina (1) fontes locais ja ingeridas na Fase 0 e (2) fontes web fornecidas pelo usuario (URLs e transcripts). Classifica todas as fontes por tier (0-3) usando 5 dimensoes de curadoria, valida cobertura minima e emite decisao GO/NO-GO no quality gate QG-001 SOURCE_QUALITY. Esta e a fase que garante materia-prima suficiente antes de iniciar extracao.

**Posicao no Workflow:** Fase 1 — Coleta e Validacao de Fontes
**Definicao de Sucesso:** Inventario unificado com 10+ fontes, 5+ Tier 1, 3+ tipos, 5+ horas de conteudo
**Quality Gate de Output:** QG-001 SOURCE_QUALITY (blocking)

---

## Purpose

O clone so e tao bom quanto suas fontes. Fontes ruins = clone generico. Esta task existe para garantir que o pipeline tenha materia-prima suficiente e diversa ANTES de gastar tempo com extracao de MIUs.

A task combina duas fontes de conteudo:
1. **Fontes locais** (Fase 0) — conteudo que o expert ja tem no computador. Alta qualidade, alta confianca.
2. **Fontes web fornecidas** — URLs, transcripts ou textos extraidos manualmente pelo usuario (videos, posts, entrevistas publicas).

O merge e necessario porque nenhuma das duas fontes sozinha e suficiente. Fontes locais tem profundidade mas podem ter gaps. Fontes web tem breadth mas podem ser superficiais. A unificacao com classificacao por tier e curadoria por 5 dimensoes garante o mix ideal.

**Por que nao automatizar web discovery?** Descoberta automatizada (scraping de YouTube/Instagram, busca em redes) exige infra adicional (MCPs, APIs de transcricao) que nem todo usuario tem. O squad e portable: usuario fornece o que tem, chief classifica.

---

## Execution Type

**Hybrid (40% Human, 60% Agent)**

- **Papel do Human:** Fornecer URLs/transcripts adicionais, confirmar tiers, aprovar GO/NO-GO
- **Papel do Agent (@clone-forge-chief):** Merge, classificacao por tier, score de curadoria, validacao de cobertura
- **Runtime Estimado:** 30-60 minutos

---

## Inputs

### Inputs Obrigatorios

```yaml
mind_slug:
  field: "Identificador unico da mente sendo clonada"
  format: "string (snake_case)"
  required: true

manifest_path:
  field: "Caminho para o manifest.yaml da mind"
  format: "path"
  required: true
  location: "agents/clone-forge/minds/{mind_slug}/manifest.yaml"

subject_name:
  field: "Nome completo da pessoa sendo clonada"
  format: "string"
  required: true
  notes: "Usado para busca web e matching de fontes"

subject_context:
  field: "Contexto profissional do sujeito para guiar busca"
  format: "text"
  required: true
  example: "Empreendedor digital, fundador da Arka, marketing digital + mentorias para experts"
  notes: "Quanto mais especifico, melhor a qualidade da descoberta web"
```

### Inputs Opcionais

```yaml
local_sources_index:
  field: "Indice de fontes locais da Fase 0"
  format: "YAML"
  required: false
  location: "agents/clone-forge/minds/{mind_slug}/01-sources/local-sources-index.yaml"
  notes: "Se Fase 0 foi pulada, este input nao existe. Pipeline continua normalmente."

user_provided_urls:
  field: "URLs e transcripts fornecidos pelo usuario (site, redes, posts, videos)"
  format: "list of URLs ou paths para transcripts/textos colados"
  required: false
  notes: "Usuario fornece o que tem. Sem coleta automatizada — usuario controla qualidade do material."

skip_web_sources:
  field: "Trabalhar apenas com fontes locais (Fase 0)"
  format: "boolean"
  required: false
  default: false
  notes: "Util se fontes locais ja sao suficientes"
```

---

## Precondicoes

Antes de iniciar esta task:

- [ ] Mind slug definido e diretorio `minds/{slug}/` criado
- [ ] manifest.yaml existe com metadados basicos
- [ ] Nome e contexto do sujeito disponiveis
- [ ] Fase 0 completada OU explicitamente pulada

---

## Steps

### Step 1: Verificar Fontes Locais da Fase 0 (2 min)

**Atividade do Agent (@clone-forge-chief):**

1. Verificar se `01-sources/local-sources-index.yaml` existe
2. Se existe:
   - Ler indice completo
   - Contar fontes, palavras totais, distribuicao por tipo e tier
   - Registrar como baseline de cobertura

```yaml
local_baseline:
  exists: true
  total_sources: N
  total_words: XXXXX
  tier_distribution:
    tier_0: N
    tier_1: N
    tier_2: N
    tier_3: N
  types:
    video: N
    pdf: N
    text: N
    # ...
```

3. Se nao existe:
   - Registrar: `local_baseline: { exists: false }`
   - Nao bloquear — prosseguir para coleta web

**Checkpoint:** Baseline de fontes locais definido.

---

### Step 2: Ingestao de Fontes Web Fornecidas pelo Usuario (10-20 min)

**Atividade do Agent (@clone-forge-chief):**

> **Nota:** Sem descoberta automatizada. O usuario fornece URLs, transcripts ja extraidos ou textos colados. Chief organiza e classifica.

1. **Se `skip_web_sources: true`:** Pular este step inteiro
2. **Se ha fontes a adicionar:**
   - Perguntar ao usuario:
     ```
     Tem mais fontes alem das locais? Pode fornecer:
     - URLs de videos do YouTube (com link)
     - Transcricoes ja extraidas (cole o texto ou indique caminho)
     - Posts de redes (cole o texto)
     - Artigos/entrevistas (cole o texto ou link)

     Cola tudo aqui ou diz "nao tenho mais".
     ```
   - Para cada item fornecido:
     - Se URL pura sem texto: registrar URL com nota "transcricao pendente — usuario deve fornecer"
     - Se texto colado: salvar em `01-sources/raw/SRC-XXX-{slug}.md` com cabecalho de metadados
     - Se path local fornecido: copiar arquivo para `01-sources/raw/`
   - Tipo da fonte e inferido pelo dominio da URL ou conteudo:
     - youtube.com / youtu.be → `youtube` (transcricao)
     - linkedin.com / instagram.com / x.com / twitter.com → `social_media`
     - podcast / spotify → `podcast`
     - dominio de blog → `article`
     - outros → `text` (default)

3. Normalizar para formato unificado:

```yaml
web_sources:
  ingested_at: "{timestamp}"
  agent: "@clone-forge-chief"
  total_ingested: N
  sources:
    - source_id: "WEB-001"
      title: "Entrevista no Podcast X"
      url: "https://..."
      type: "podcast"
      estimated_tier: 1
      content_status: "transcript_provided"
      notes: "Entrevista longa, espontanea"
    - source_id: "WEB-002"
      title: "Post no LinkedIn"
      url: "https://..."
      type: "social_media"
      estimated_tier: 2
      content_status: "text_provided"
```

4. Se ha URLs sem transcricao: avisar usuario e oferecer 2 opcoes:
   - "Posso seguir sem essa fonte" (mais rapido)
   - "Voce extrai a transcricao e me passa depois" (melhor qualidade)

**Checkpoint:** Fontes web fornecidas pelo usuario catalogadas.

---

### Step 3: Merge de Fontes Locais + Web (5 min)

**Atividade do Agent (@clone-forge-chief):**

1. Unificar fontes locais (Fase 0) e web (Step 2) em inventario unico
2. Gerar source_id sequencial unificado: SRC-001, SRC-002, etc.
3. Detectar duplicatas (mesma URL, mesmo titulo, conteudo similar)
4. Resolver conflitos de tier (se mesma fonte aparece em local E web, manter tier mais alto)

```yaml
merge_rules:
  dedup:
    strategy: "URL exact match + title fuzzy match (>80% similarity)"
    on_duplicate: "Manter a versao com tier mais alto e mais metadados"
  id_renumbering:
    strategy: "Sequencial unificado SRC-{seq:3}"
    preserve_original: true  # Manter original_id para rastreabilidade
  tier_conflict:
    strategy: "Manter tier mais alto (local geralmente ganha)"
```

5. Gerar inventario unificado preliminar

**Checkpoint:** Fontes locais e web unificadas sem duplicatas.

---

### Step 4: Classificacao por Tier e Curadoria (5-10 min)

**Atividade do Agent (@clone-forge-chief):**

> **Carregar:** `agents/clone-forge/data/source-tiers.yaml` — taxonomia detalhada de classificacao com pesos, exemplos e decision pipeline.

1. Para cada fonte no inventario unificado, atribuir tier final baseado em 5 dimensoes de curadoria:

```yaml
curadoria_dimensions:
  autenticidade:
    description: "Quao proxima da voz real da pessoa?"
    score: 1-5
    tier_impact: "Alto (peso 0.3)"
    exemplos:
      5: "Transcricao de conversa informal, resposta espontanea"
      3: "Conteudo editado mas com voz propria"
      1: "Texto escrito por ghostwriter, comunicado corporativo"

  profundidade:
    description: "Nivel de detalhe e nuance"
    score: 1-5
    tier_impact: "Alto (peso 0.25)"
    exemplos:
      5: "Entrevista de 2h explorando multiplos topicos"
      3: "Post de 500 palavras com opiniao clara"
      1: "Frase solta, bio de rede social"

  cobertura_tematica:
    description: "Diversidade de temas cobertos"
    score: 1-5
    tier_impact: "Medio (peso 0.2)"
    exemplos:
      5: "Aborda negocio, vida pessoal, valores, metodo"
      3: "Foca em 1-2 temas com profundidade"
      1: "Topico unico e superficial"

  espontaneidade:
    description: "Quao preparado vs espontaneo e o conteudo?"
    score: 1-5
    tier_impact: "Medio (peso 0.15)"
    exemplos:
      5: "Conversa informal, resposta improvisada"
      3: "Apresentacao com roteiro mas com improviso"
      1: "Texto totalmente roteirizado"

  recenticidade:
    description: "Quao recente e o conteudo?"
    score: 1-5
    tier_impact: "Baixo (peso 0.1)"
    exemplos:
      5: "Ultimos 6 meses"
      3: "1-3 anos"
      1: "> 5 anos"
```

2. Calcular score ponderado e atribuir tier:

```yaml
tier_classification:
  tier_0:
    label: "OURO MAXIMO"
    score_range: [4.0, 5.0]
    description: "Voz direta da pessoa sem filtro"
    examples: "Entrevista profunda, modelo-do-eu, assessment formal"
  tier_1:
    label: "Alta Qualidade"
    score_range: [3.0, 3.99]
    description: "Conteudo proprio com boa autenticidade"
    examples: "Podcast longo, livro proprio, aula gravada"
  tier_2:
    label: "Curado"
    score_range: [2.0, 2.99]
    description: "Conteudo editado ou de fonte secundaria"
    examples: "Post de rede social, artigo editado, video curto"
  tier_3:
    label: "Bronze"
    score_range: [1.0, 1.99]
    description: "Fonte terciaria ou superficial"
    examples: "Mencao por terceiros, bio, resumo externo"
```

3. Excepcoes automaticas de tier:
   - Assessment formal → sempre Tier 0
   - Entrevista profunda (Fase 1.5) → sempre Tier 0
   - Skill Auroq → sempre Tier 1
   - Texto de terceiros sobre a pessoa → maximo Tier 3

**Checkpoint:** Todos os fontes classificados por tier com score de curadoria.

---

### Step 5: Validacao de Cobertura (3-5 min)

**Atividade do Agent (@clone-forge-chief):**

1. Calcular metricas de cobertura:

```yaml
coverage_metrics:
  total_sources: N
  minimum_required: 10

  tier_distribution:
    tier_0: N  # Minimo desejavel: 1
    tier_1: N  # Minimo requerido: 5
    tier_2: N
    tier_3: N

  type_diversity:
    types_present: [video, pdf, text, youtube, social_media]
    unique_types: N
    minimum_required: 3

  content_volume:
    total_words: XXXXX
    estimated_hours: X.X  # (palavras / 150 wpm para audio, / 250 wpm para texto)
    minimum_required_hours: 5

  category_coverage_estimate:
    behavioral: "presente/ausente"
    methodological: "presente/ausente"
    storytelling: "presente/ausente"
    opinion: "presente/ausente"
    technical: "presente/ausente"
```

2. Comparar contra thresholds QG-001:

| Metrica | Threshold | Resultado |
|---------|-----------|-----------|
| Total sources | >= 10 | PASS/FAIL |
| Tier 1+ sources | >= 5 | PASS/FAIL |
| Tipos unicos | >= 3 | PASS/FAIL |
| Horas de conteudo | >= 5 | PASS/FAIL |
| Todas 5 categorias estimadas | presentes | PASS/WARN |

3. Calcular source_coverage (0.0 - 1.0):

```yaml
source_coverage:
  formula: "weighted average of 5 metrics"
  score: 0.XX
  interpretation:
    ">= 0.8": "Cobertura excelente — proceder sem entrevista"
    "0.6 - 0.79": "Cobertura boa — entrevista recomendada para gaps"
    "0.4 - 0.59": "Cobertura insuficiente — entrevista obrigatoria"
    "< 0.4": "Cobertura critica — mais fontes necessarias OU entrevista longa"
```

**Checkpoint:** Metricas de cobertura calculadas. Pronto para decisao GO/NO-GO.

---

### Step 6: Quality Gate QG-001 — GO/NO-GO (3 min)

**Atividade do Agent (@clone-forge-chief):**

1. Apresentar dashboard de decisao ao usuario:

```yaml
elicit: true
prompt: |
  ## QG-001 SOURCE_QUALITY — Resultado

  | Metrica | Valor | Threshold | Status |
  |---------|-------|-----------|--------|
  | Total fontes | {N} | >= 10 | {PASS/FAIL} |
  | Tier 1+ | {N} | >= 5 | {PASS/FAIL} |
  | Tipos unicos | {N} | >= 3 | {PASS/FAIL} |
  | Horas conteudo | {X.X}h | >= 5h | {PASS/FAIL} |
  | Cobertura categorias | {N}/5 | 5/5 | {PASS/WARN} |

  **Coverage Score:** {0.XX}

  **Decisao recomendada:** {GO / NO-GO / GO_WITH_INTERVIEW}

  {Se NO-GO: "Recomendo buscar mais fontes antes de continuar."}
  {Se GO_WITH_INTERVIEW: "Fontes ok mas entrevista profunda (Fase 1.5) recomendada para cobrir gaps."}
  {Se GO: "Fontes excelentes. Pode prosseguir direto para extracao de MIUs."}

  Confirma a decisao? (go / no-go / buscar mais fontes)
type: "choice"
options: ["go", "no-go", "buscar-mais"]
```

2. **Se GO:** Gravar inventario final, atualizar manifest, prosseguir
3. **Se NO-GO:** Listar gaps especificos, recomendar acoes (mais fontes locais? mais busca web? entrevista?)
4. **Se buscar-mais:** Voltar ao Step 2 ou Step 4 conforme necessidade

**Checkpoint:** Decisao GO/NO-GO tomada e registrada.

---

### Step 7: Gravar Inventario Final e Atualizar Manifest (2 min)

**Atividade do Agent (@clone-forge-chief):**

1. Salvar inventario unificado final:

```yaml
# minds/{slug}/01-sources/sources-inventory.yaml
sources_inventory:
  generated_at: "{timestamp}"
  mind_slug: "{slug}"
  quality_gate: "QG-001"
  quality_gate_result: "PASS"
  coverage_score: 0.XX

  summary:
    total_sources: N
    total_words: XXXXX
    estimated_hours: X.X
    tier_distribution:
      tier_0: N
      tier_1: N
      tier_2: N
      tier_3: N
    type_distribution:
      video: N
      pdf: N
      text: N
      youtube: N
      social_media: N

  sources:
    - source_id: "SRC-001"
      title: "..."
      type: "..."
      tier: N
      format_original: "..."
      path_normalized: "01-sources/raw/SRC-001-xxx.md"
      word_count: N
      language: "pt-BR"
      date_original: "..."
      date_ingested: "..."
      quality_score: 0.XX
      curadoria:
        autenticidade: N
        profundidade: N
        cobertura_tematica: N
        espontaneidade: N
        recenticidade: N
      notes: "..."
```

2. Atualizar manifest.yaml:

```yaml
phase_1:
  status: completed
  completed_at: "{timestamp}"
  quality_gate: "QG-001"
  quality_gate_result: "PASS"
  coverage_score: 0.XX
  total_sources: N
  inventory_path: "01-sources/sources-inventory.yaml"
  interview_recommended: true/false
```

**Checkpoint:** Inventario gravado. Manifest atualizado. Fase 1 completa.

---

## Outputs

### Output Primario

**Sources Inventory**

Formato: YAML
Localizacao: `agents/clone-forge/minds/{slug}/01-sources/sources-inventory.yaml`
Conteudo: Inventario unificado de todas as fontes (locais + web) com metadados, tier e score de curadoria

### Outputs Secundarios

1. **Manifest Atualizado**
   - Formato: YAML
   - Localizacao: `agents/clone-forge/minds/{slug}/manifest.yaml`
   - Conteudo: Status da Fase 1 com metricas e resultado QG-001

2. **Fontes Web Normalizadas** (se descobertas neste step)
   - Formato: Markdown
   - Localizacao: `agents/clone-forge/minds/{slug}/01-sources/raw/` e `01-sources/transcripts/`

---

## Validacao

### Checklist

- [ ] Fontes locais (Fase 0) verificadas e contabilizadas
- [ ] Fontes web fornecidas pelo usuario ingeridas (ou explicitamente puladas)
- [ ] Merge realizado sem duplicatas
- [ ] Todas as fontes classificadas por tier (0-3) com score de curadoria
- [ ] Metricas de cobertura calculadas
- [ ] Total fontes >= 10
- [ ] Tier 1+ fontes >= 5
- [ ] Tipos unicos >= 3
- [ ] Horas de conteudo >= 5
- [ ] QG-001 decisao registrada (GO / NO-GO / GO_WITH_INTERVIEW)
- [ ] sources-inventory.yaml gravado com todas as fontes
- [ ] Manifest atualizado com status da Fase 1

### Criterios de Sucesso

**Threshold: 9/12 no checklist acima**

| Criterio | Excelente (3) | Aceitavel (2) | Fraco (1) |
|----------|--------------|----------------|---------|
| **Volume** | 15+ fontes, 10+ horas | 10-14 fontes, 5-10 horas | < 10 fontes ou < 5 horas |
| **Diversidade** | 5+ tipos, todos tiers representados | 3-4 tipos, Tier 0-2 presente | < 3 tipos ou sem Tier 1 |
| **Curadoria** | Cada fonte com 5 dimensoes avaliadas | Tier atribuido, curadoria parcial | Tier generico sem curadoria |
| **Merge** | Zero duplicatas, IDs consistentes | Duplicatas removidas, IDs ok | Duplicatas presentes |

---

## Error Handling

```yaml
errors:
  url_without_transcript:
    description: "Usuario forneceu URL mas sem transcricao/texto"
    action: "Pedir ao usuario que extraia o texto OU pular essa fonte. Sem texto, MIU extraction nao funciona."
    fallback: "Marcar fonte como skipped com nota e remover do inventario"
    severity: "warning"

  insufficient_sources:
    description: "Total de fontes < 10 apos merge"
    action: "Apresentar gap analysis. Recomendar: mais fontes locais, URLs manuais, ou entrevista longa."
    fallback: "Permitir GO com warning se >= 7 fontes e usuario aceita risco"
    severity: "warning"

  no_tier_1_sources:
    description: "Nenhuma fonte Tier 1 ou melhor"
    action: "BLOQUEAR. Sem fontes de alta qualidade, clone sera generico."
    fallback: "Entrevista profunda (Fase 1.5) obrigatoria para compensar"
    severity: "error"

  duplicate_detection_failure:
    description: "Merge nao conseguiu detectar duplicatas"
    action: "Apresentar lista completa ao usuario para revisao manual"
    fallback: "Manter ambas versoes com nota de possivel duplicata"
    severity: "warning"

  coverage_below_40:
    description: "Coverage score < 0.4"
    action: "NO-GO automatico. Listar gaps e recomendar acoes especificas."
    fallback: "Nao permitir override. Fontes insuficientes = clone ruim."
    severity: "error"
```

---

## Integracao

### Depende De

- **Task:** `start` — Cria diretorio e manifest
- **Task:** `ingest-local-content` (Fase 0) — Fornece fontes locais (opcional)
- **Input do usuario:** URLs/transcripts adicionais (opcional)

### Alimenta

- **Task:** `deep-interview` (Fase 1.5) — Usa coverage_score para decidir se entrevista e necessaria
- **Task:** `extract-mius` (Fase 2) — Consome sources-inventory.yaml e fontes normalizadas
- **QG-001** → Blocking gate para todo o pipeline downstream

### Chained Tasks

```yaml
chain:
  previous: ingest-local-content
  next: deep-interview (if interview_recommended) OR extract-mius (if not)
  blocking_gate: QG-001
  on_fail: "Nao prosseguir. Resolver gaps antes."
```

---

## Historico de Revisoes

| Versao | Data | Mudanca |
|---------|------|--------|
| 1.0.0 | 2026-03-02 | Release inicial de producao |
