# Task: Extracao de MIUs

**Task ID:** clone-forge/extract-mius
**Version:** 2.0.0
**Status:** Production Ready
**Created:** 2026-03-02
**Category:** Semantic Extraction Pipeline
**Execution Type:** Autonomous

---

## Executive Summary

Extrai MIUs (Minimum Inference Units) de todas as fontes normalizadas na Fase 1 usando chunking semantico com zero-inference. Cada MIU e a menor unidade semantica que carrega significado autonomo sobre o pensamento, comportamento ou metodo de uma pessoa. O @innerlens processa fontes em batch, segmenta em chunks semanticos, extrai MIUs candidatos, classifica em 5 categorias (BEHAVIORAL, METHODOLOGICAL, STORYTELLING, OPINION, TECHNICAL), aplica sub-category tags da taxonomia, registra proveniencia completa, valida contra 6 regras de rejeicao, fragmenta MIUs compostos e gera 4 outputs estruturados. Quality gate QG-002 MIU_QUALITY bloqueia o pipeline se a qualidade for insuficiente.

**Pipeline Position:** Phase 2 (apos Source Collection, antes de DNA Extraction)
**Success Definition:** >= 50 MIUs validos, cobertura >= 3 categorias, rejection rate <= 30%, proveniencia 100%
**Blocking Gate:** QG-002 (MIU Quality Gate)

---

## Purpose

Fontes brutas -- mesmo normalizadas em markdown -- sao inuteis para construir um clone. Um video de 1 hora contem talvez 20 minutos de conteudo util misturado com 40 minutos de contexto, repeticao e filler. Uma entrevista de 2 horas contem centenas de unidades semanticas enterradas em conversa. A extracao de MIUs e o processo que separa sinal de ruido, transformando horas de conteudo bruto em unidades atomicas de conhecimento que alimentam o resto do pipeline.

Sem MIUs de qualidade, tudo que vem depois (DNA, drivers, psicometria, perfil) e construido sobre areia. O MIU e o atomo do clone -- se o atomo esta errado, a molecula esta errada.

O @innerlens opera sob o principio de ZERO INFERENCE: extrai o que ESTA la, nao o que PODERIA estar. Se precisa interpretar, marca [INFERRED] e reduz confianca. Se e generico, rejeita. Se nao tem proveniencia, nao existe. Se cobre multiplos conceitos, divide.

Os 4 outputs desta task alimentam:
1. **Phase 3** (DNA Extraction) -- MIUs sao a materia-prima para extrair Voice DNA e Thinking DNA
2. **Phase 4** (Driver Inference) -- MIUs sao a evidencia para inferir drivers psicologicos
3. **Phase 6** (Profile Aggregation) -- MIUs enriquecem modulos de Repertoire e Operational
4. **Phase 7** (Validation) -- MIUs informam smoke tests de consistencia

---

## Execution Type

**Autonomous** -- o @innerlens executa a extracao completa sem intervencao humana, seguindo o Protocol 1 (Extraction Pipeline) definido em sua agent definition.

O agente carrega fontes, taxonomia e templates, executa chunking/classificacao/validacao/fragmentacao, e entrega 4 outputs estruturados. Humano valida no final apenas se necessario.

**Runtime Estimado:** 1-2 horas (depende do volume de fontes)

---

## Inputs

### Obrigatorios

| Input | Path | Descricao |
|-------|------|-----------|
| Sources inventory | `minds/{slug}/01-sources/sources-inventory.yaml` | Inventario completo de fontes validadas (QG-001 PASS) |
| Raw sources | `minds/{slug}/01-sources/raw/*.md` | Conteudo normalizado em markdown |
| Transcripts | `minds/{slug}/01-sources/transcripts/*.md` | Transcricoes de audio/video normalizadas |
| Interviews | `minds/{slug}/01-sources/interview/*.md` | Entrevistas profundas transcritas |
| MIU taxonomy | `agents/clone-forge/data/miu-classification-taxonomy.yaml` | Fonte de verdade para categorias, tags, validacao e rejeicao |
| MIU template | `agents/clone-forge/templates/miu-tmpl.yaml` | Template de output para MIUs validos e rejeitados |

### Opcionais

| Input | Path | Descricao |
|-------|------|-----------|
| Extraction config | Inline | batch_size (default 3), min_miu_words (20), max_miu_words (300), confidence_floor (0.3), dedup_threshold (0.8) |
| Previous MIUs | `minds/{slug}/02-extraction/mius.yaml` | Para re-run incremental -- extrai apenas fontes novas |

---

## Precondicoes

- [ ] QG-001 SOURCE_QUALITY: PASS (fontes validadas e inventariadas)
- [ ] sources-inventory.yaml existe com pelo menos 3 fontes
- [ ] Fontes normalizadas existem nos paths listados no inventario
- [ ] `data/miu-classification-taxonomy.yaml` acessivel e valido
- [ ] `templates/miu-tmpl.yaml` acessivel e valido
- [ ] Diretorio `minds/{slug}/02-extraction/` existe (ou sera criado)
- [ ] Fase 1 (Source Collection) completa
- [ ] Fase 1.5 (Deep Interview) completada OU explicitamente pulada

---

## Steps

### Step 1: Carregar Fontes Validadas do sources-inventory.yaml

```yaml
action: load
source: minds/{slug}/01-sources/sources-inventory.yaml
validate:
  - file exists
  - qg_001_result == "PASS"
  - sources[].source_id presente
  - sources[].path presente
  - sources[].tier in [0, 1, 2, 3]
stats_to_log:
  - total_sources
  - sources_per_tier
  - total_estimated_words
  - source_types (raw, transcript, interview)
```

**Atividade do Agent (@innerlens):**

1. Ler `sources-inventory.yaml` COMPLETO
2. Validar que QG-001 passou (campo `quality_gate.result == "PASS"`)
3. Listar todas as fontes com source_id, path, tier, type
4. Ordenar por tier (Tier 0 primeiro -- maior qualidade primeiro)
5. Calcular volume total estimado (word count)
6. Planejar batches de processamento:

```yaml
processing_plan:
  total_sources: N
  total_estimated_words: XXXXX
  batch_size: 3  # fontes por batch (evita limite de contexto)
  total_batches: ceil(N / 3)
  order: "tier_desc"  # Tier 0 primeiro
  mode: "full"  # ou "incremental" se previous_mius existe
```

7. Se modo incremental: identificar fontes ja processadas e pular

**Thresholds:**
- >= 10 fontes: ideal, prosseguir normalmente
- 3-9 fontes: WARN -- "Volume limitado, extracao possivel mas cobertura comprometida"
- < 3 fontes: BLOCK -- "Fontes insuficientes. Voltar a Fase 1 ou buscar mais fontes."

8. Carregar tambem `data/miu-classification-taxonomy.yaml` COMPLETO:
   - 5 categorias primarias
   - 12 tags secundarias
   - Regras de validacao (campos obrigatorios, ranges de confianca)
   - 6 regras de rejeicao
   - Metricas de qualidade (extraction rate, distribuicao, proveniencia)

**Checkpoint:** Fontes mapeadas. Taxonomia carregada. Batches planejados.

---

### Step 2: Segmentar cada Fonte em Chunks Semanticos

**Atividade do Agent (@innerlens):**

Para cada fonte no batch, processar sequencialmente:

1. Ler o arquivo markdown COMPLETO (nunca leitura parcial)
2. Verificar frontmatter: source_id, type, tier presentes
3. Registrar metadados: word_count, tipo, tier

4. Identificar fronteiras semanticas baseado em:
   - **Mudanca de topico:** novo assunto, nova ideia, nova tematica
   - **Mudanca de tipo de conteudo:** historia -> opiniao -> metodo -> dado tecnico
   - **Marcadores linguisticos:** "por outro lado", "outro ponto", "agora sobre", "voltando ao"
   - **Pausas longas em transcricoes:** indicadas por timestamps com gap > 5 segundos
   - **Mudanca de interlocutor:** em entrevistas/dialogos
   - **Mudanca de secao:** headers, bullet points, transicoes

5. Marcar cada chunk com posicao precisa:
   - Pagina (se texto paginado)
   - Timestamp minuto:segundo (se audio/video)
   - Paragrafo (se texto corrido)
   - Contexto breve ("resposta sobre monetizacao", "historia de origem")

6. Se chunk > 300 palavras: subdividir em sub-chunks mantendo coerencia semantica
7. Se chunk < 20 palavras: avaliar se e significativo ou apenas filler

```yaml
chunk_example:
  chunk_id: "CHK-SRC-001-014"
  source_id: "SRC-001"
  position:
    start_paragraph: 14
    end_paragraph: 16
    timestamp: "14:32-15:47"
    context: "explicando metodo PMI"
  word_count: 187
  type_hint: "METHODOLOGICAL"  # sugestao inicial
```

**Checkpoint:** Fonte segmentada em N chunks. Cada chunk com posicao registrada.

---

### Step 3: Extrair MIUs de cada Chunk

**Atividade do Agent (@innerlens):**

Para cada chunk identificado no Step 2:

1. **Extrair a unidade semantica central** -- o que este chunk DIZ de fato? Qual e o nucleo de significado?

2. **Verificar atomicidade:** contem mais de um conceito independente?
   - Se sim: dividir em 2+ MIUs candidatos (cada conceito vira um MIU)
   - Se nao: manter como MIU unico

3. **Verificar auto-suficiencia:** o MIU faz sentido sozinho sem contexto externo?
   - Se sim: prosseguir
   - Se nao: expandir para incluir contexto minimo OU rejeitar

4. **Formatar como MIU candidato:**

```yaml
- id: "MIU-{seq:4}"
  content: |
    {texto extraido -- 20-300 palavras, auto-contido, sem contexto externo necessario}
  category: "PENDING"
  source_id: "{fonte}"
  location:
    page: null
    timestamp: "14:32"
    paragraph: 3
    context: "resposta sobre monetizacao"
  confidence: 0.0  # pendente -- sera atribuida no Step 3 continuacao
  tags: []
  fragments: []
  related_mius: []
  note: ""
```

5. **Principio zero-inference em acao:**

| Correto (extracao) | Errado (inferencia) |
|---------------------|---------------------|
| "O expert diz que prefere verdade a validacao vazia" | "O expert provavelmente valoriza honestidade porque teve experiencias ruins" |
| "Usa metodo PMI: Proposito + Marketing + IA" | "Provavelmente criou o PMI por influencia de frameworks ageis" |
| "Rejeita reunioes sem pauta definida" | "Deve ter trauma de reunioes improdutivas" |

Se a fonte NAO diz o PORQUE, o MIU NAO inclui o porque.

**Checkpoint:** N MIUs candidatos extraidos do batch.

---

### Step 4: Classificar cada MIU em 1 das 5 Categorias

**Atividade do Agent (@innerlens):**

Para cada MIU candidato, determinar a categoria primaria usando pergunta-chave:

| Categoria | Pergunta-Chave | Indicadores |
|-----------|---------------|-------------|
| BEHAVIORAL | "Isso descreve algo que a pessoa FAZ repetidamente?" | Padroes observaveis, habitos, reacoes, tendencias recorrentes |
| METHODOLOGICAL | "Isso descreve COMO a pessoa resolve problemas?" | Frameworks, processos, sequencias, regras SE/ENTAO |
| STORYTELLING | "Isso e uma historia ou exemplo concreto?" | Narrativa com inicio/meio/fim, caso de uso, experiencia pessoal |
| OPINION | "Isso e algo que a pessoa ACREDITA ou REJEITA?" | Valores, posicionamentos, rejeicoes explicitas, crencas |
| TECHNICAL | "Isso e conhecimento tecnico especifico?" | Dados, metricas, ferramentas, tecnicas, numeros concretos |

**Regras de desempate:**
- BEHAVIORAL vs OPINION: verificar se e acao observavel (BEHAVIORAL) ou crenca declarada (OPINION)
- METHODOLOGICAL vs TECHNICAL: verificar se e processo/framework (METH) ou dado pontual/ferramenta (TECH)
- STORYTELLING vs qualquer outra: se e narrativa com inicio/meio/fim, e STORYTELLING
- Duvida real: usar a categoria com maior `weight_for_profile` na taxonomia (`feeds_into`)

**Regra absoluta:** Um MIU encaixa em EXATAMENTE 1 categoria primaria. Se encaixa em duas, a dominante vence.

**Distribuicao ideal (referencia da taxonomia):**

| Categoria | Target |
|-----------|--------|
| BEHAVIORAL | 20-30% |
| METHODOLOGICAL | 20-30% |
| STORYTELLING | 15-25% |
| OPINION | 15-25% |
| TECHNICAL | 10-20% |

**Checkpoint:** Todos os MIUs candidatos classificados.

---

### Step 5: Aplicar Sub-category Tags da Taxonomia

**Atividade do Agent (@innerlens):**

Para cada MIU classificado, aplicar 0-N tags secundarias conforme taxonomia. Validar compatibilidade tag/categoria usando o campo `applies_to`:

| Tag | Applies To | Quando Aplicar |
|-----|-----------|---------------|
| IDENTITY | BEHAVIORAL, OPINION, STORYTELLING | Revela quem a pessoa E (nao o que faz) |
| VALUES | OPINION, BEHAVIORAL | Valor explicito ou implicito na fala |
| REJECTION | OPINION, BEHAVIORAL | Algo que a pessoa rejeita, evita, recusa explicitamente |
| VOICE | BEHAVIORAL, STORYTELLING | Padrao de comunicacao, linguagem, tom |
| METAPHOR | STORYTELLING, OPINION | Usa metafora ou analogia para explicar |
| HUMOR | BEHAVIORAL, STORYTELLING | Uso de humor (auto-depreciativo, ironico, etc) |
| HEURISTIC | METHODOLOGICAL, BEHAVIORAL | Regra de bolso para decisao rapida |
| FRAMEWORK | METHODOLOGICAL, TECHNICAL | Modelo estruturado com passos/camadas |
| DECISION | METHODOLOGICAL, BEHAVIORAL | Revela como decide ou prioriza |
| TACIT | BEHAVIORAL, METHODOLOGICAL, OPINION | Conhecimento tacito (faz mas nao articula) |
| CONTRADICTION | OPINION, BEHAVIORAL | Contradiz algo dito em outro contexto |
| OBSESSION | OPINION, BEHAVIORAL, STORYTELLING | Tema que aparece repetidamente |

**Validacao de compatibilidade:**
- Se tag.applies_to NAO contem a categoria do MIU: tag invalida, nao aplicar
- Exemplo: FRAMEWORK so aplica a METHODOLOGICAL e TECHNICAL -- nao aplicar a BEHAVIORAL

```yaml
miu_with_tags:
  id: "MIU-0023"
  category: "OPINION"
  tags: [VALUES, REJECTION]  # Validos: ambos applies_to contem OPINION
```

**Checkpoint:** Tags aplicadas e validadas contra taxonomia.

---

### Step 6: Registrar Proveniencia de cada MIU

**Atividade do Agent (@innerlens):**

Para CADA MIU valido, registrar proveniencia completa:

```yaml
provenance:
  source_id: "SRC-001"          # ID da fonte no inventario
  source_type: "transcricao"     # Tipo da fonte (raw, transcript, interview)
  source_tier: 0                 # Tier da fonte (0-3)
  location:
    page: null                   # Pagina (se texto paginado)
    timestamp: "14:32"           # Minuto:segundo (se audio/video)
    paragraph: 3                 # Paragrafo (se texto corrido)
    context: "resposta sobre monetizacao"  # Contexto breve da extracao
  extraction_confidence: 0.87    # Score final apos calculo
```

**Calculo de confianca:**

```yaml
confidence_calculation:
  base_score:
    citacao_direta_frase_exata: [0.9, 1.0]
    parafraseado_proximo_comportamento_explicito: [0.7, 0.89]
    inferencia_minima_padrao_claro: [0.5, 0.69]
    inferencia_moderada_precisa_triangulacao: [0.3, 0.49]
    especulacao: [0.0, 0.29]  # AUTO-REJECT

  tier_multipliers:
    tier_0_modelo_do_eu: 1.00
    tier_1_entrevista_longa: 0.95
    tier_2_conteudo_curado: 0.85
    tier_3_terceiros: 0.70

  bonuses:
    quoted_speech: +0.10      # Frase entre aspas na fonte
    multi_source: +0.10       # Comportamento confirmado em 2+ fontes
    interview_direct: +0.05   # Resposta direta de entrevista profunda

  formula: "min((base_score * tier_multiplier) + bonuses, 1.0)"
```

**Regras:**
- Confianca < 0.3: AUTO-REJECT -- vai para mius-rejected.yaml
- Confianca 0.3-0.49: LOW -- precisa de triangulacao para ser util
- Confianca 0.5-0.79: MEDIUM -- inferencia minima, aceito
- Confianca 0.8-1.0: HIGH -- citacao direta ou comportamento explicito
- Se qualquer campo de proveniencia estiver AUSENTE: marcar MIU como INCOMPLETE, priorizar preenchimento

**Meta: Proveniencia 100%.** Sem proveniencia, nao existe MIU -- existe opiniao.

**Checkpoint:** Proveniencia e confianca registradas para todos os MIUs.

---

### Step 7: Validar MIUs contra Regras de Rejeicao

**Atividade do Agent (@innerlens):**

Testar CADA MIU candidato contra as 6 regras de rejeicao definidas na taxonomia:

| Regra | Teste | Acao se FAIL |
|-------|-------|-------------|
| GENERIC | "Qualquer pessoa diria isso? Nao captura unicidade da pessoa-alvo?" | Rejeitar -> mius-rejected.yaml com reason GENERIC |
| INFERENCE_HEAVY | "Mais de 30% do conteudo e inferencia, nao extracao?" | Rejeitar ou marcar [INFERRED] e reduzir confianca |
| DUPLICATE | "MIU identico ou quase identico (>80% similaridade) ja existe?" | Rejeitar, linkar ao original via related_mius |
| NO_ATTRIBUTION | "MIU sem source_id, location ou proveniencia completa?" | Rejeitar -- viola regra de proveniencia obrigatoria |
| TOO_BROAD | "Cobre 2+ conceitos distintos que deveriam ser MIUs separados?" | Dividir em 2+ MIUs atomicos, re-classificar cada um |
| CONTRADICTS_SOURCE | "O MIU distorce ou contradiz o que a fonte realmente diz?" | Rejeitar -- viola principio zero-inference |

**Para cada MIU rejeitado, registrar:**

```yaml
rejected_miu:
  id: "MIU-R-{seq:4}"
  content: "{texto rejeitado}"
  original_source_id: "SRC-{seq:3}"
  rejection_reason: "{GENERIC|INFERENCE_HEAVY|DUPLICATE|NO_ATTRIBUTION|TOO_BROAD|CONTRADICTS_SOURCE}"
  rejection_note: "{explicacao detalhada de por que foi rejeitado}"
  duplicate_of: null  # MIU-XXXX se DUPLICATE
  suggestion: "{sugestao de correcao, se recuperavel}"
```

**Metricas de rejeicao:**
- Taxa de rejeicao <= 30%: saudavel (fontes boas, extracao calibrada)
- Taxa de rejeicao 30-50%: WARN (fontes ruins ou extracao muito restritiva)
- Taxa de rejeicao > 50%: FAIL (fontes muito brutas ou extracao quebrada)

**Checkpoint:** MIUs validados separados de MIUs rejeitados. Taxa de rejeicao calculada.

---

### Step 8: Gerar Fragmentos para MIUs Complexos

**Atividade do Agent (@innerlens):**

1. Identificar MIUs que contem sub-unidades estruturadas:
   - METHODOLOGICAL com framework de 3+ passos
   - TECHNICAL com lista de ferramentas/metricas relacionadas
   - BEHAVIORAL com variantes contextuais do mesmo padrao

2. Para cada MIU complexo, criar fragmentos:

```yaml
fragments:
  - id: "FRAG-MIU-0015-01"
    parent_miu: "MIU-0015"
    content: "Passo 1 do framework: Diagnostico — mapear situacao atual"
    position: 1
    tags: [FRAMEWORK]
    note: ""

  - id: "FRAG-MIU-0015-02"
    parent_miu: "MIU-0015"
    content: "Passo 2 do framework: Estrategia — definir plano de acao"
    position: 2
    tags: [FRAMEWORK]
    note: ""

  - id: "FRAG-MIU-0015-03"
    parent_miu: "MIU-0015"
    content: "Passo 3 do framework: Execucao — implementar com medicao"
    position: 3
    tags: [FRAMEWORK]
    note: ""
```

3. **Heranca:** Fragmentos herdam source_id e category do MIU pai
4. **ID Format:** `FRAG-{parent_miu_id}-{seq:2}` (ex: FRAG-MIU-0015-01)

**Quando NAO fragmentar:**
- MIUs OPINION: sao atomicos por natureza (uma crenca = uma unidade)
- MIUs BEHAVIORAL simples: padroes unicos sem variantes
- MIUs STORYTELLING: historias perdem sentido fora de contexto narrativo

**Checkpoint:** MIUs complexos fragmentados. Fragmentos indexados com heranca.

---

### Step 9: Gravar mius.yaml

**Atividade do Agent (@innerlens):**

Gravar todos os MIUs validos em formato estruturado:

```yaml
# minds/{slug}/02-extraction/mius.yaml
metadata:
  generated_at: "{ISO-8601 timestamp}"
  mind_slug: "{slug}"
  total_valid: N
  extraction_version: "2.0.0"
  taxonomy_version: "1.0.0"
  agent: "@innerlens"
  mode: "full"  # ou "incremental"

items:
  - id: "MIU-0001"
    content: |
      O expert diz que prefere verdade a validacao vazia.
      Confronta quando necessario, mesmo que desconfortavel.
    category: "OPINION"
    tags: [VALUES, REJECTION]
    source_id: "SRC-001"
    location:
      page: null
      timestamp: "14:32"
      paragraph: 3
      context: "resposta sobre feedback"
    confidence: 0.92
    fragments: []
    related_mius: ["MIU-0023"]
    note: "Citacao quase direta da fonte"
  # ... todos os MIUs validos
```

**Validacao pre-gravacao:**
- Todo MIU tem id, content, category, source_id, location, confidence
- Nenhum campo PENDING ou INCOMPLETE restante
- Confidence >= 0.3 para todos
- IDs unicos e sequenciais

**Checkpoint:** mius.yaml gravado.

---

### Step 10: Gravar mius-rejected.yaml

**Atividade do Agent (@innerlens):**

Gravar todos os MIUs rejeitados com motivos documentados:

```yaml
# minds/{slug}/02-extraction/mius-rejected.yaml
metadata:
  generated_at: "{ISO-8601 timestamp}"
  mind_slug: "{slug}"
  total_rejected: N
  rejection_rate: 0.XX  # rejeitados / (validos + rejeitados)
  agent: "@innerlens"

rejection_summary:
  GENERIC: N
  INFERENCE_HEAVY: N
  DUPLICATE: N
  NO_ATTRIBUTION: N
  TOO_BROAD: N
  CONTRADICTS_SOURCE: N

items:
  - id: "MIU-R-0001"
    content: "E importante ter foco no que importa"
    original_source_id: "SRC-003"
    confidence: 0.45
    rejection_reason: "GENERIC"
    rejection_note: "Afirmacao que qualquer expert diria — nao captura unicidade"
    duplicate_of: null
    suggestion: "Nao recuperavel — conteudo generico sem especificidade"

  - id: "MIU-R-0002"
    content: "Provavelmente valoriza autonomia porque cresceu empreendendo"
    original_source_id: "SRC-007"
    confidence: 0.22
    rejection_reason: "INFERENCE_HEAVY"
    rejection_note: "Mais inferencia que extracao — fonte nao diz o porque"
    duplicate_of: null
    suggestion: "Extrair apenas a parte factual: 'Cresceu empreendendo'"
  # ... todos os rejeitados
```

**Checkpoint:** mius-rejected.yaml gravado com motivos e sugestoes.

---

### Step 11: Gravar fragments.yaml

**Atividade do Agent (@innerlens):**

Gravar todos os fragmentos de MIUs complexos:

```yaml
# minds/{slug}/02-extraction/fragments.yaml
metadata:
  generated_at: "{ISO-8601 timestamp}"
  mind_slug: "{slug}"
  total_fragments: N
  total_parent_mius: M  # quantos MIUs foram fragmentados
  agent: "@innerlens"

items:
  - id: "FRAG-MIU-0015-01"
    parent_miu: "MIU-0015"
    content: "Passo 1: Proposito — clareza sobre quem voce e e o que Deus te chamou pra fazer"
    position: 1
    tags: [FRAMEWORK]
    note: ""

  - id: "FRAG-MIU-0015-02"
    parent_miu: "MIU-0015"
    content: "Passo 2: Marketing — estrategia para se tornar relevante e atrair o publico certo"
    position: 2
    tags: [FRAMEWORK]
    note: ""

  - id: "FRAG-MIU-0015-03"
    parent_miu: "MIU-0015"
    content: "Passo 3: IA — sistema operacional que escala o negocio sem depender de equipe"
    position: 3
    tags: [FRAMEWORK]
    note: ""
  # ... todos os fragmentos
```

**Checkpoint:** fragments.yaml gravado. Pode estar vazio se nenhum MIU foi fragmentado (arquivo gerado mesmo assim).

---

### Step 12: Gerar extraction-report.md

**Atividade do Agent (@innerlens):**

Produzir `02-extraction/extraction-report.md` com 7 secoes:

```markdown
# Extraction Report — {mind_slug}

**Data:** {date}
**Agente:** @innerlens
**Fontes processadas:** {sources_count}
**Tempo de processamento:** {X} minutos

---

## 1. Resumo Executivo

| Metrica | Valor | Target | Status |
|---------|-------|--------|--------|
| MIUs extraidos (total) | {total} | — | — |
| MIUs validos | {valid} | >= 50 | {PASS/FAIL} |
| MIUs rejeitados | {rejected} | — | — |
| Taxa de extracao | {rate}% | >= 70% | {PASS/WARN/FAIL} |
| Taxa de rejeicao | {rej_rate}% | <= 30% | {PASS/WARN/FAIL} |
| Proveniencia completa | {prov}% | 100% | {PASS/FAIL} |
| Fragmentos gerados | {frags} | — | — |
| Palavras processadas | {words} | — | — |

## 2. Distribuicao por Categoria

| Categoria | Count | % | Target | Status |
|-----------|-------|---|--------|--------|
| BEHAVIORAL | {n} | {%} | 20-30% | {OK/LOW/HIGH} |
| METHODOLOGICAL | {n} | {%} | 20-30% | {OK/LOW/HIGH} |
| STORYTELLING | {n} | {%} | 15-25% | {OK/LOW/HIGH} |
| OPINION | {n} | {%} | 15-25% | {OK/LOW/HIGH} |
| TECHNICAL | {n} | {%} | 10-20% | {OK/LOW/HIGH} |

Categorias cobertas: {N}/5

## 3. Distribuicao por Confianca

| Nivel | Count | % | Target | Status |
|-------|-------|---|--------|--------|
| High (0.8-1.0) | {n} | {%} | >= 40% | {OK/WARN} |
| Medium (0.5-0.79) | {n} | {%} | 30-40% | — |
| Low (0.3-0.49) | {n} | {%} | <= 20% | {OK/WARN} |

## 4. Motivos de Rejeicao

| Motivo | Count | % dos Rejeitados |
|--------|-------|-----------------|
| GENERIC | {n} | {%} |
| INFERENCE_HEAVY | {n} | {%} |
| DUPLICATE | {n} | {%} |
| NO_ATTRIBUTION | {n} | {%} |
| TOO_BROAD | {n} | {%} |
| CONTRADICTS_SOURCE | {n} | {%} |

## 5. Top 10 MIUs (Maior Confianca)

{Lista dos 10 MIUs com maior confidence score, com id, categoria, confianca e trecho}

## 6. Problemas Detectados

{Lista de problemas: MIUs incompletos, proveniencia faltando, desequilibrio de categorias,
categorias ausentes, fontes nao processadas, taxa de rejeicao alta}

## 7. Recomendacoes

{Acoes necessarias antes do handoff para DNA extraction:
- Buscar mais fontes para categorias fracas
- Re-processar fontes com parametros ajustados
- Completar proveniencia de MIUs incompletos
- Resolver MIUs TOO_BROAD pendentes}
```

**Checkpoint:** extraction-report.md gerado com 7 secoes completas.

---

### Step 13: Quality Gate QG-002 MIU_QUALITY (Blocking)

**Atividade do Agent (@innerlens):**

Executar checklist de `checklists/miu-quality-gate.md`:

| Check | Criterio | Threshold | Bloqueante |
|-------|----------|-----------|-----------|
| 1. Minimo de MIUs | Total MIUs validos | >= 50 | SIM |
| 2. Cobertura de categorias | Categorias com MIUs | >= 3 das 5 | SIM |
| 3. Taxa de rejeicao | Rejeitados / total | <= 30% | SIM |
| 4. Proveniencia | MIUs com proveniencia completa | 100% | SIM |
| 5. Taxa de extracao | Validos / (validos + rejeitados) | >= 60% | SIM |
| 6. Distribuicao de confianca | MIUs high confidence | >= 40% | NAO (warn) |
| 7. Zero genericos | Genericos no set valido | 0 | SIM |
| 8. Zero MIUs incompletos | MIUs marcados INCOMPLETE | 0 | SIM |
| 9. Contradicoes marcadas | Contradicoes com tag CONTRADICTION | Todas marcadas | NAO (warn) |
| 10. Report gerado | extraction-report.md existe | Sim | SIM |

**Resultado do QG-002:**

```yaml
qg_002_results:
  checks_passed: N
  checks_total: 10
  blocking_passed: N  # dos 8 bloqueantes
  blocking_total: 8

  details:
    min_50_mius:
      threshold: 50
      actual: N
      result: "PASS/FAIL"
      blocking: true
    coverage_3_categories:
      threshold: 3
      actual: N
      result: "PASS/FAIL"
      blocking: true
    rejection_rate:
      threshold: 0.30
      actual: 0.XX
      result: "PASS/FAIL"
      blocking: true
    provenance_100:
      threshold: 1.0
      actual: 0.XX
      result: "PASS/FAIL"
      blocking: true
    extraction_rate:
      threshold: 0.6
      actual: 0.XX
      result: "PASS/FAIL"
      blocking: true
    confidence_distribution:
      high_pct: {X}%
      result: "PASS/WARN"
      blocking: false
    zero_generics:
      generics_count: N
      result: "PASS/FAIL"
      blocking: true
    zero_incomplete:
      incomplete_count: N
      result: "PASS/FAIL"
      blocking: true
    contradictions_marked:
      result: "PASS/WARN"
      blocking: false
    report_generated:
      result: "PASS/FAIL"
      blocking: true

  decision: "PASS / CONDITIONAL / FAIL"
```

**Decisao:**

| Resultado | Criterio | Acao |
|-----------|----------|------|
| **PASS** | 8+/10 checks (todos bloqueantes passam) | Prosseguir para Fase 3 (DNA Extraction) |
| **CONDITIONAL** | 6-7/10 + gaps documentados | Prosseguir com warnings no manifest |
| **FAIL** | < 6/10 OU qualquer bloqueante falha | BLOQUEAR — revisar fontes e re-extrair |

**Se FAIL:**
1. Identificar quais checks falharam
2. Se volume (< 50 MIUs): buscar mais fontes (voltar a Fase 1)
3. Se qualidade (rejeicao > 30%): ajustar parametros de extracao
4. Se distribuicao (< 3 categorias): buscar fontes especificas para categorias ausentes
5. Se proveniencia (< 100%): completar campos ausentes
6. Max 2 retries antes de escalar para usuario

**Checkpoint:** QG-002 executado. Decisao registrada. Manifest atualizado.

---

## Outputs

| Arquivo | Path | Descricao |
|---------|------|-----------|
| MIUs Validos | `minds/{slug}/02-extraction/mius.yaml` | Todos os MIUs validos com classificacao, confianca, proveniencia e tags |
| MIUs Rejeitados | `minds/{slug}/02-extraction/mius-rejected.yaml` | MIUs rejeitados com motivo, regra violada e sugestao |
| Fragmentos | `minds/{slug}/02-extraction/fragments.yaml` | Sub-unidades de MIUs complexos com heranca |
| Extraction Report | `minds/{slug}/02-extraction/extraction-report.md` | Relatorio com metricas, distribuicoes, problemas e recomendacoes |

---

## Validacao

### QG-002 — MIU Quality Gate (Blocking)

**Checklist Pos-Execucao:**

- [ ] >= 50 MIUs validos em mius.yaml
- [ ] >= 3 das 5 categorias primarias representadas
- [ ] Taxa de rejeicao <= 30%
- [ ] Proveniencia 100% (source_id + location em todo MIU valido)
- [ ] Taxa de extracao >= 60%
- [ ] >= 40% dos MIUs com high confidence (0.8-1.0)
- [ ] Zero MIUs genericos no set valido
- [ ] Zero MIUs marcados INCOMPLETE
- [ ] Contradicoes identificadas e marcadas com tag CONTRADICTION
- [ ] extraction-report.md gerado com as 7 secoes

### Criterios de Sucesso

**Threshold: 8/10 no checklist acima**

| Criterio | Excelente (3) | Aceitavel (2) | Fraco (1) |
|----------|--------------|----------------|---------|
| **Volume** | 80+ MIUs, 5+ categorias | 50-79 MIUs, 3+ categorias | < 50 MIUs ou < 3 categorias |
| **Qualidade** | 50%+ high confidence, zero genericos | 40%+ high, zero genericos | < 40% high ou genericos presentes |
| **Proveniencia** | 100% completa | 95-99% completa | < 95% |
| **Distribuicao** | Equilibrada (nenhuma categoria > 35%) | Aceitavel (nenhuma > 45%) | Desequilibrada (1 categoria > 50%) |
| **Rejeicao** | <= 20% rejeitados | 20-30% rejeitados | > 30% rejeitados |

---

## Error Handling

### Erro: Menos de 50 MIUs validos

**Sintoma:** Poucos MIUs passam na validacao apos processar todas as fontes.
**Acao:**
1. Verificar volume de fontes -- fontes suficientes no inventario?
2. Verificar taxa de rejeicao -- extracao muito restritiva?
3. Se fontes insuficientes: solicitar mais fontes ao usuario (voltar a Fase 1)
4. Se extracao restritiva: ajustar parametros (confidence_floor, dedup_threshold)
5. Ultimo recurso: solicitar entrevista profunda focada em areas com poucos MIUs

### Erro: Cobertura de categorias < 3

**Sintoma:** 1-2 categorias dominam, outras ausentes.
**Acao:**
1. Identificar categorias ausentes
2. Mapear: qual tipo de fonte alimenta qual categoria
   - BEHAVIORAL: entrevistas, observacao direta
   - METHODOLOGICAL: conteudo proprio, lives, aulas
   - STORYTELLING: biografias, casos, depoimentos
   - OPINION: posts, artigos opinativos, debates
   - TECHNICAL: tutoriais, dados, documentacao
3. Recomendar fontes especificas para categorias fracas
4. Se possivel: re-extrair com foco em categorias ausentes

### Erro: Taxa de rejeicao > 30%

**Sintoma:** Muitos MIUs sendo descartados.
**Acao:**
1. Analisar motivos de rejeicao dominantes (mius-rejected.yaml)
2. Se GENERIC domina: fontes de baixa qualidade, buscar fontes melhores
3. Se INFERENCE_HEAVY domina: extracao esta inferindo demais, recalibrar
4. Se DUPLICATE domina: fontes muito similares, normal se mesma pessoa
5. Se NO_ATTRIBUTION domina: proveniencia nao esta sendo registrada corretamente
6. Se TOO_BROAD domina: chunking muito grande, reduzir tamanho de chunks

### Erro: Proveniencia < 100%

**Sintoma:** MIUs no set valido sem source_id, location ou campos de proveniencia.
**Acao:**
1. Identificar MIUs com proveniencia incompleta
2. Completar campos ausentes rastreando de volta a fonte
3. Se nao conseguir rastrear: mover para mius-rejected.yaml com reason NO_ATTRIBUTION
4. Nunca enviar MIU sem proveniencia para o proximo passo

### Erro: Fonte nao encontrada no filesystem

**Sintoma:** Arquivo listado no inventario nao existe no path indicado.
**Acao:**
1. Registrar warning. Pular fonte. Continuar com as demais.
2. Se > 30% das fontes faltam: HALT e reportar ao usuario
3. Documentar fontes ausentes no extraction-report.md

### Erro: Context limit excedido durante batch

**Sintoma:** Fonte muito grande para processar em um batch com taxonomia e MIUs acumulados.
**Acao:**
1. Reduzir batch_size para 1 (processar fonte isolada)
2. Se ainda excede: dividir fonte em sub-batches por secao/capitulo
3. Processar primeiras 50% da fonte, documentar limitacao
4. Nunca sacrificar qualidade por volume

### Erro: QG-002 FAIL

**Sintoma:** Quality gate falhou em checks bloqueantes.
**Acao:**
1. Analisar quais checks especificos falharam
2. Aplicar acoes corretivas especificas (ver erros acima)
3. Re-rodar steps afetados (nao tudo -- apenas o necessario)
4. Max 2 retries
5. Se 2 retries falham: escalar para usuario com diagnostico completo
6. NUNCA prosseguir para Fase 3 com QG-002 FAIL em check bloqueante

---

## Integracao

### Recebe de

| Fase | Agente | Dados |
|------|--------|-------|
| Phase 1 | @clone-forge-chief | sources-inventory.yaml validado (QG-001 PASS) |
| Phase 1 | @clone-forge-chief | Fontes normalizadas em 01-sources/ (raw, transcripts, interview) |
| Phase 1.5 | @clone-forge-chief | Entrevistas profundas (Tier 0) em 01-sources/interview/ |

### Entrega para

| Fase | Agente | Dados |
|------|--------|-------|
| Phase 3 | @innerlens + @cognitive-motor | MIUs validados para DNA Extraction (Voice DNA + Thinking DNA) |
| Phase 4 | @cognitive-motor | MIUs validados como evidencia para Driver Inference |
| Phase 6 | @clone-forge-chief | extraction-report.md para metricas de agregacao |
| Phase 7 | @clone-forge-chief | MIUs validados para smoke tests de consistencia |

### Handoff Protocol

```yaml
handoff_to_phase_3:
  from: "@innerlens"
  to: "@clone-forge-chief"
  gate: "QG-002 MIU_QUALITY PASS"
  condition: "QG-002 PASS or CONDITIONAL"
  veto: "QG-002 FAIL em qualquer check bloqueante"
  package:
    - minds/{slug}/02-extraction/mius.yaml
    - minds/{slug}/02-extraction/fragments.yaml
    - minds/{slug}/02-extraction/extraction-report.md
  note: "mius-rejected.yaml fica disponivel para referencia mas NAO e entregue como input"
```

### Chained Tasks

```yaml
chain:
  previous: collect-and-merge-sources (or deep-interview if executed)
  next: extract-dna-enriched
  blocking_gate: QG-002
  on_fail: "BLOQUEAR. Resolver gaps antes de prosseguir."
  handoff_to: "@clone-forge-chief"
  handoff_condition: "QG-002 PASS or CONDITIONAL"
  handoff_artifacts:
    - "02-extraction/mius.yaml"
    - "02-extraction/fragments.yaml"
    - "02-extraction/extraction-report.md"
```

---

## Notas para o Executor

### Ordem de Processamento Importa

Processar fontes Tier 0 primeiro, depois Tier 1, depois Tier 2, por ultimo Tier 3. Motivo: MIUs de fontes Tier 0 servem como ancora -- quando uma fonte Tier 2 diz algo parecido, o MIU da Tier 0 e o "original" e o da Tier 2 e marcado como related (ou duplicata).

### Batch Size e Context Window

Nao processar mais de 3 fontes por batch. Cada fonte pode ter milhares de palavras. O @innerlens precisa manter em contexto: a taxonomia, os MIUs ja extraidos (para dedup), e a fonte atual. Overload de contexto = queda de qualidade.

### Quando Extrair Fragmentos

Fragmentos so fazem sentido para MIUs METHODOLOGICAL com framework de 3+ passos e MIUs TECHNICAL com listas estruturadas. NAO fragmentar:
- MIUs OPINION (sao atomicos por natureza)
- MIUs BEHAVIORAL (sao padroes, nao sequencias)
- MIUs STORYTELLING (historias perdem sentido fora de contexto)

### Zero Inference na Pratica

A regra e simples mas a tentacao e grande:

| Correto (extracao) | Errado (inferencia) |
|---------------------|---------------------|
| "O expert diz que prefere verdade a validacao vazia" | "O expert provavelmente valoriza honestidade porque teve experiencias negativas" |
| "Usa metodo PMI: Proposito + Marketing + IA" | "Provavelmente criou o PMI por influencia de frameworks ageis" |
| "Rejeita reunioes sem pauta definida" | "Deve ter trauma de reunioes improdutivas" |

Se a fonte NAO diz o PORQUE, o MIU NAO inclui o porque. Ponto.

### Re-runs Incrementais

Se o usuario adiciona fontes depois da primeira extracao, rodar em modo incremental:
- Carregar mius.yaml existente
- Processar APENAS fontes novas (comparar inventario anterior vs atual)
- Dedup contra MIUs existentes
- Append ao arquivo existente (nao sobrescrever)
- Re-rodar QG-002

### Manifest Update

Ao finalizar, atualizar manifest.yaml da mind:

```yaml
phase_2:
  status: completed
  completed_at: "{timestamp}"
  duration_minutes: N
  quality_gate: "QG-002"
  quality_gate_result: "{PASS/CONDITIONAL/FAIL}"
  total_mius_valid: N
  total_mius_rejected: N
  total_fragments: N
  extraction_rate: 0.XX
  rejection_rate: 0.XX
  category_distribution:
    BEHAVIORAL: N
    METHODOLOGICAL: N
    STORYTELLING: N
    OPINION: N
    TECHNICAL: N
  confidence_distribution:
    high: N
    medium: N
    low: N
  outputs:
    mius: "02-extraction/mius.yaml"
    rejected: "02-extraction/mius-rejected.yaml"
    fragments: "02-extraction/fragments.yaml"
    report: "02-extraction/extraction-report.md"
```

---

## Historico de Revisoes

| Versao | Data | Autor | Mudanca |
|--------|------|-------|---------|
| 1.0.0 | 2026-03-02 | @innerlens | Criacao inicial da task |
| 2.0.0 | 2026-03-02 | @innerlens | Reescrita completa: 13 steps detalhados, QG-002 com thresholds atualizados (50 MIUs, 3 categorias, rejection rate 30%, proveniencia 100%), regras de rejeicao expandidas (NO_ATTRIBUTION, CONTRADICTS_SOURCE), error handling detalhado, notas para executor |

---

*"Sem proveniencia, nao existe MIU. Existe opiniao."*
*"Zero-inference. Extrai o que ESTA la, nao o que poderia estar."*
*"Generico qualquer pessoa diria. Me mostra o que so ESSA pessoa diz."*
