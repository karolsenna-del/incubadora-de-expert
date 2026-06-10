# Task: Extracao de DNA Enriched

**Task ID:** clone-forge/extract-dna-enriched
**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-03-02
**Category:** Extraction Pipeline
**Execution Type:** Autonomous

---

## Executive Summary

Extracao nativa de Voice DNA + Thinking DNA enriquecida com dados de MIUs. Voice DNA e responsabilidade do @innerlens (extrator linguistico); Thinking DNA e responsabilidade do @cognitive-motor (extrator cognitivo). Em vez de extrair DNA apenas das fontes brutas, alimenta MIUs categorizados como contexto suplementar -- BEHAVIORAL e STORYTELLING para Voice DNA, METHODOLOGICAL e OPINION para Thinking DNA. Tambem extrai conhecimento implicito (crencas assumidas, regras inconscientes, gaps de autoconhecimento). Resultado: DNA de maior fidelidade porque os agentes ja "entendem" os padroes semanticos antes de sintetizar.

**Pipeline Position:** Phase 3 (apos MIU extraction, antes de Driver inference)
**Success Definition:** Voice DNA >= 8/10, Thinking DNA >= 7/9, conhecimento implicito documentado
**Blocking Gate:** QG-003 DNA_QUALITY

---

## Purpose

Extracao de DNA direto sobre fontes brutas funciona, mas perde nuances que so emergem quando os MIUs ja foram extraidos e categorizados. O enriquecimento com MIUs resolve 3 problemas:

1. **Voice DNA mais preciso** -- MIUs BEHAVIORAL e STORYTELLING revelam padroes de comunicacao que nao aparecem em fontes individuais isoladas
2. **Thinking DNA mais profundo** -- MIUs METHODOLOGICAL e OPINION mapeiam frameworks e posicionamentos que o expert repete across fontes
3. **Conhecimento implicito** -- crencas que o expert assume mas nunca articula, regras que segue inconscientemente, gaps de autoconhecimento

Sem enriquecimento, o DNA captura a SUPERFICIE. Com enriquecimento, captura a ESTRUTURA.

---

## Execution Type

**Autonomous** -- executa sem intervencao humana apos receber os inputs.

Dois agentes trabalham em paralelo:
- **@innerlens** recebe o pacote de handoff com MIUs categorizados como BEHAVIORAL + STORYTELLING e executa a extracao de Voice DNA enriquecida (`*extract-voice-dna`)
- **@cognitive-motor** recebe o pacote com MIUs METHODOLOGICAL + OPINION (e drivers ja inferidos, se disponivel) e executa a extracao de Thinking DNA enriquecida (`*extract-thinking-dna`)

O @clone-forge-chief orquestra o paralelismo, sintetiza o conhecimento implicito a partir dos 2 outputs e valida o resultado via QG-003.

---

## Inputs

### Obrigatorios

| Input | Path | Descricao |
|-------|------|-----------|
| MIUs validados | `minds/{slug}/02-extraction/mius.yaml` | MIUs com status "validated", categorizados e com proveniencia |
| Inventario de fontes | `minds/{slug}/01-sources/source-inventory.yaml` | Fontes classificadas por Tier com metadados |
| Fontes normalizadas | `minds/{slug}/01-sources/` | Markdown normalizado de todas as fontes |

### Opcionais

| Input | Path | Descricao |
|-------|------|-----------|
| Entrevista profunda | `minds/{slug}/01-sources/interview/` | Transcricao da Fase 1.5 (Tier 0) |
| MIUs rejeitados | `minds/{slug}/02-extraction/mius-rejected.yaml` | Para referencia de padroes descartados |

### Dados do Squad

| Dado | Path | Descricao |
|------|------|-----------|
| Taxonomia MIU | `agents/clone-forge/data/miu-classification-taxonomy.yaml` | Categorias e tags de MIU |

---

## Precondicoes

- [ ] QG-002 MIU_QUALITY: PASS
- [ ] Minimo 30 MIUs validados em `02-extraction/mius.yaml`
- [ ] Minimo 5 MIUs BEHAVIORAL
- [ ] Minimo 5 MIUs STORYTELLING
- [ ] Minimo 5 MIUs METHODOLOGICAL
- [ ] Minimo 5 MIUs OPINION
- [ ] Fontes normalizadas em `01-sources/` com inventario
- [ ] @innerlens e @cognitive-motor ativos no squad

---

## Steps

### Step 1: Carregar MIUs Validados

```yaml
action: load
source: minds/{slug}/02-extraction/mius.yaml
validate:
  - status == "validated" para cada MIU
  - category presente e valida
  - confidence >= 0.3
  - provenance completa (source_id + location)
on_fail: HALT — "MIUs invalidos. Rodar *validate-mius antes."
```

Separar MIUs por categoria em 4 grupos:
- **voice_context**: BEHAVIORAL + STORYTELLING (alimenta Voice DNA)
- **thinking_context**: METHODOLOGICAL + OPINION (alimenta Thinking DNA)
- **technical_context**: TECHNICAL (referencia cruzada)
- **all_mius**: todos (para conhecimento implicito)

### Step 2: Carregar Inventario de Fontes

```yaml
action: load
source: minds/{slug}/01-sources/source-inventory.yaml
extract:
  - Lista de fontes por Tier
  - Tipos de fonte (video, texto, audio, etc.)
  - Fontes Tier 0 e Tier 1 priorizadas
```

### Step 3: Extrair Voice DNA Enriquecido

```yaml
action: call_agent
agent: "@innerlens"
command: "*extract-voice-dna"
task_file: "agents/clone-forge/tasks/extract-voice-dna.md"
loads_data:
  - "agents/clone-forge/data/source-tiers.yaml"
enrichment:
  supplementary_data: voice_context (BEHAVIORAL + STORYTELLING MIUs)
  instruction: |
    Use os MIUs BEHAVIORAL e STORYTELLING como contexto suplementar.
    Estes MIUs revelam padroes de comunicacao cross-fonte.
    Priorize: power_words, signature_phrases, story_patterns,
    tone_dimensions que os MIUs confirmam em multiplas fontes.
    Se um padrao aparece em 3+ MIUs de fontes diferentes, e forte.
sources: minds/{slug}/01-sources/
output: minds/{slug}/03-dna/voice-dna.yaml
```

**Criterios de enriquecimento para Voice DNA:**
- Power words confirmados por 2+ MIUs BEHAVIORAL
- Signature phrases que aparecem em 3+ fontes (via MIU provenance)
- Story patterns extraidos de MIUs STORYTELLING (recurring themes)
- Anti-patterns confirmados por ausencia consistente nos MIUs

### Step 4: Extrair Thinking DNA Enriquecido

```yaml
action: call_agent
agent: "@cognitive-motor"
command: "*extract-thinking-dna"
task_file: "agents/clone-forge/tasks/extract-thinking-dna.md"
loads_data:
  - "agents/clone-forge/data/source-tiers.yaml"
enrichment:
  supplementary_data: thinking_context (METHODOLOGICAL + OPINION MIUs)
  instruction: |
    Use os MIUs METHODOLOGICAL e OPINION como contexto suplementar.
    Estes MIUs mapeiam frameworks, heuristicas e posicionamentos.
    Priorize: decision_pipelines, mental_models, heuristics,
    non_negotiables que os MIUs confirmam em multiplas fontes.
    Se um framework aparece fragmentado em 5+ MIUs, e core.
sources: minds/{slug}/01-sources/
output: minds/{slug}/03-dna/thinking-dna.yaml
```

**Criterios de enriquecimento para Thinking DNA:**
- Frameworks confirmados por 3+ MIUs METHODOLOGICAL
- Heuristicas extraidas de MIUs OPINION (regras de decisao)
- Mental models que aparecem fragmentados across fontes
- Posicionamentos com alta confianca (>= 0.7) em MIUs OPINION

### Step 5: Extrair Conhecimento Implicito

```yaml
action: analyze
input: all_mius + voice-dna.yaml + thinking-dna.yaml
output: minds/{slug}/03-dna/implicit-knowledge.yaml
```

Analisar o conjunto completo de MIUs para identificar 3 tipos de conhecimento implicito:

**5a. Crencas Assumidas (beliefs_assumed)**
- O que o expert trata como obvio mas nunca justifica?
- Detectar: afirmacoes sem qualificadores ("Claro que...", "Obviamente...")
- Detectar: premissas presentes em MIUs METHODOLOGICAL que nunca sao questionadas
- Output por crenca: `{belief, evidence_mius[], confidence, category}`

**5b. Regras Inconscientes (unconscious_rules)**
- Regras que o expert segue consistentemente mas nunca articula
- Detectar: padroes de decisao em MIUs BEHAVIORAL que se repetem sem ser nomeados
- Detectar: SE/ENTAO implicitos nos MIUs METHODOLOGICAL
- Output por regra: `{rule, evidence_mius[], confidence, trigger_context}`

**5c. Gaps de Autoconhecimento (knowledge_gaps)**
- Areas onde o expert tem competencia demonstrada mas parece nao perceber
- Detectar: habilidades presentes nos MIUs que nunca sao mencionadas como fortalezas
- Detectar: inconsistencia entre auto-avaliacao (quando disponivel) e comportamento observado
- Output por gap: `{gap_area, evidence_for[], evidence_against[], confidence}`

### Step 6: Sintetizar DNA Completo

```yaml
action: synthesize
inputs:
  - minds/{slug}/03-dna/voice-dna.yaml
  - minds/{slug}/03-dna/thinking-dna.yaml
  - minds/{slug}/03-dna/implicit-knowledge.yaml
output: minds/{slug}/03-dna/dna-synthesis.yaml
```

Combinar Voice DNA + Thinking DNA + Conhecimento Implicito num unico arquivo de sintese:

```yaml
dna_synthesis:
  expert: "{nome}"
  extracted_at: "{timestamp}"
  enrichment_source: "MIU-enriched (Phase 3)"

  voice_summary:
    identity_statement: ""
    top_power_words: []
    top_signature_phrases: []
    dominant_tone: {}
    key_anti_patterns: []

  thinking_summary:
    core_frameworks: []
    key_heuristics: []
    decision_style: ""
    non_negotiables: []

  implicit_summary:
    top_beliefs: []
    top_rules: []
    top_gaps: []

  cross_references:
    voice_confirms_thinking: []  # Voice patterns que confirmam Thinking patterns
    thinking_explains_voice: []  # Thinking patterns que explicam Voice patterns
    implicit_bridges: []         # Conhecimento implicito que conecta Voice + Thinking

  enrichment_stats:
    mius_used_voice: 0
    mius_used_thinking: 0
    mius_used_implicit: 0
    enrichment_delta: ""  # Diferenca estimada vs extracao sem enriquecimento
```

### Step 7: Quality Gate — QG-003 DNA_QUALITY

Executar quality gate conforme criterios:

| Check | Criterio | Acao se FAIL |
|-------|----------|--------------|
| Voice DNA score | >= 8/10 em fidelidade | Feedback especifico + re-extracao com MIUs adicionais |
| Thinking DNA score | >= 7/9 em completude | Enriquecer com mais MIUs METHODOLOGICAL |
| Consistencia Voice-MIU | Voice DNA nao contradiz MIUs BEHAVIORAL | Reconciliar com evidencia |
| Consistencia Thinking-MIU | Thinking DNA nao contradiz MIUs OPINION | Reconciliar com evidencia |
| Vocabulario capturado | Termos proprios do expert identificados (min 10) | Revisitar fontes Tier 0/1 |
| Conhecimento implicito | Min 3 crencas + 3 regras + 1 gap | Expandir analise com mais MIUs |
| Sintese gerada | dna-synthesis.yaml completo | Gerar antes de prosseguir |

**Decisao:**

| Resultado | Criterio | Acao |
|-----------|----------|------|
| PASS | Voice >= 8/10 + Thinking >= 7/9 + sintese completa | Avancar para Fase 4 |
| CONDITIONAL | Voice >= 7/10 + Thinking >= 6/9 | Avancar com warnings documentados |
| FAIL | Voice < 7/10 OU Thinking < 6/9 | BLOQUEAR — re-extrair com feedback |

**Max retries:** 2. Apos 2 falhas, escalar ao @clone-forge-chief com diagnostico.

---

## Outputs

| Arquivo | Path | Descricao |
|---------|------|-----------|
| Voice DNA | `minds/{slug}/03-dna/voice-dna.yaml` | DNA de comunicacao enriquecido com MIUs |
| Thinking DNA | `minds/{slug}/03-dna/thinking-dna.yaml` | DNA de pensamento enriquecido com MIUs |
| Conhecimento Implicito | `minds/{slug}/03-dna/implicit-knowledge.yaml` | Crencas, regras inconscientes, gaps |
| Sintese DNA | `minds/{slug}/03-dna/dna-synthesis.yaml` | Integracao dos 3 arquivos + cross-references |

---

## Validacao

### Checklist Pos-Execucao

- [ ] Voice DNA score >= 8/10
- [ ] Thinking DNA score >= 7/9
- [ ] implicit-knowledge.yaml contem min 3 crencas assumidas
- [ ] implicit-knowledge.yaml contem min 3 regras inconscientes
- [ ] implicit-knowledge.yaml contem min 1 gap de autoconhecimento
- [ ] dna-synthesis.yaml gerado com cross_references preenchidas
- [ ] enrichment_stats documentam quantos MIUs foram usados
- [ ] Todos os 4 outputs existem em `minds/{slug}/03-dna/`

---

## Error Handling

### Erro: MIUs insuficientes por categoria

**Sintoma:** Menos de 5 MIUs BEHAVIORAL, STORYTELLING, METHODOLOGICAL ou OPINION.
**Acao:**
1. Informar qual categoria esta fraca
2. Solicitar re-extracao ao @innerlens com foco na categoria
3. Se fontes nao suportam: documentar limitacao e prosseguir com nota
4. Nunca fabricar MIUs para compensar

### Erro: Voice DNA generico

**Sintoma:** Voice DNA score < 7/10. Expert nao e reconhecivel.
**Acao:**
1. Comparar Voice DNA com MIUs BEHAVIORAL de alta confianca
2. Identificar quais power_words/signature_phrases estao ausentes
3. Alimentar @innerlens com MIUs especificos como exemplos
4. Re-extrair com instrucao explicita: "Foque nestes padroes: {lista}"

### Erro: Thinking DNA incompleto

**Sintoma:** Thinking DNA score < 6/9. Frameworks incompletos.
**Acao:**
1. Verificar se MIUs METHODOLOGICAL cobrem os frameworks principais
2. Se nao: solicitar entrevista complementar (Bloco 2: Metodo e Framework)
3. Se sim: solicitar re-extracao ao @cognitive-motor com MIUs como exemplos explicitos de frameworks

---

## Integracao

### Recebe de

| Fase | Agente | Dados |
|------|--------|-------|
| Phase 2 | @innerlens | MIUs validados (`02-extraction/mius.yaml`) |
| Phase 1 | @clone-forge-chief | Fontes classificadas (`01-sources/`) |

### Entrega para

| Fase | Agente | Dados |
|------|--------|-------|
| Phase 4 | @cognitive-motor | DNA completo (`03-dna/`) — necessario para contexto de drivers |
| Phase 6 | @clone-forge-chief | DNA sintetizado para agregacao de perfil |
| Phase 7 | @clone-forge-chief | Voice DNA + Thinking DNA para smoke tests de fidelidade |

### Handoff Protocol

```yaml
handoff_to_phase_4:
  from: "@clone-forge-chief (orchestrator)"
  to: "@cognitive-motor"
  gate: "QG-003 PASS"
  package:
    - minds/{slug}/03-dna/voice-dna.yaml
    - minds/{slug}/03-dna/thinking-dna.yaml
    - minds/{slug}/03-dna/implicit-knowledge.yaml
    - minds/{slug}/03-dna/dna-synthesis.yaml
    - minds/{slug}/02-extraction/mius.yaml  # Tambem necessario para Fase 4
```

---

## Historico de Revisoes

| Versao | Data | Autor | Mudanca |
|--------|------|-------|---------|
| 1.0.0 | 2026-03-02 | @clone-forge-chief | Criacao inicial da task |

---

*"DNA sem MIU e chute educado. DNA com MIU e ciencia."*
