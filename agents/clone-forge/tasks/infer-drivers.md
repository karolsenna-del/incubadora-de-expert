# Task: Inferencia de Drivers

**Task ID:** clone-forge/infer-drivers
**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-03-02
**Category:** Psychological Analysis
**Execution Type:** Autonomous

---

## Executive Summary

Infere drivers psicologicos a partir dos MIUs extraidos na Fase 2. Cada MIU e comparado contra o catalogo de 951 drivers para identificar padroes psicologicos subjacentes. Apos a inferencia individual, os drivers sao agregados, sua forca calculada com ponderacao por tier/confianca, e as relacoes entre drivers sao mapeadas -- incluindo paradoxos produtivos (conflitos que sao features, nao bugs). O resultado e um mapa psicologico completo com cadeia de evidencia rastreavel de cada driver ate os MIUs originais.

**Pipeline Position:** Phase 4 (apos DNA extraction, antes de Psychometric mapping)
**Success Definition:** >= 20 drivers inferidos, top 5 com forca >= 60, todas categorias representadas
**Blocking Gate:** QG-003 (interno -- Driver Quality Gate)

---

## Purpose

MIUs capturam O QUE a pessoa diz e faz. Drivers capturam POR QUE a pessoa diz e faz. Sem drivers, o clone reproduz comportamento sem entender a motivacao subjacente -- reage de forma generica em situacoes novas. Com drivers, o clone tem um "motor psicologico" que gera respostas coerentes mesmo em contextos nao vistos nas fontes.

Drivers tambem sao a ponte entre extracao bruta (MIUs) e mapeamento psicometrico (MBTI, Enneagram, etc.). Sem drivers bem inferidos, a psicometria e um exercicio de adivinhacao.

Os 3 outputs desta task alimentam:
1. **Phase 5** (Psychometric Mapping) -- drivers sao a materia-prima para mapear sistemas
2. **Phase 6** (Profile Aggregation) -- drivers enriquecem os modulos Mental Model e Identity
3. **Phase 7** (Validation) -- drivers informam smoke tests de tomada de decisao

---

## Execution Type

**Autonomous** -- o @cognitive-motor executa a inferencia completa sem intervencao humana, seguindo o Protocol 1 (Driver Inference) definido em sua agent definition.

O agente carrega MIUs, catalogo de drivers e templates de relacao, executa matching/agregacao/filtragem/deteccao de relacoes, e entrega 4 outputs estruturados.

---

## Inputs

### Obrigatorios

| Input | Path | Descricao |
|-------|------|-----------|
| MIUs validados | `minds/{slug}/02-extraction/mius.yaml` | MIUs com status "validated", confianca >= 0.3 |
| Driver catalog | `agents/clone-forge/data/driver-catalog.yaml` | 951 drivers catalogados com indicators |
| Relationship templates | `agents/clone-forge/data/driver-relationship-templates.yaml` | Templates de relacao entre drivers |

### Opcionais

| Input | Path | Descricao |
|-------|------|-----------|
| DNA synthesis | `minds/{slug}/03-dna/dna-synthesis.yaml` | Para contexto adicional de Voice + Thinking |
| Implicit knowledge | `minds/{slug}/03-dna/implicit-knowledge.yaml` | Crencas e regras inconscientes como evidencia extra |

---

## Precondicoes

- [ ] QG-002 MIU_QUALITY: PASS
- [ ] QG-003 DNA_QUALITY: PASS (ou CONDITIONAL com warnings documentados)
- [ ] Minimo 50 MIUs validados (warn se 30-49, block se < 30)
- [ ] Driver catalog carregado e acessivel
- [ ] Relationship templates carregados e acessiveis
- [ ] Todas as 5 categorias de MIU presentes (BEHAVIORAL, METHODOLOGICAL, STORYTELLING, OPINION, TECHNICAL)

---

## Steps

### Step 1: Carregar MIUs Validados

```yaml
action: load
source: minds/{slug}/02-extraction/mius.yaml
validate:
  - status == "validated"
  - confidence >= 0.3
  - category in [BEHAVIORAL, METHODOLOGICAL, STORYTELLING, OPINION, TECHNICAL]
  - provenance.source_id presente
  - provenance.source_tier presente
stats_to_log:
  - total_mius
  - mius_per_category
  - average_confidence
  - tier_distribution
```

**Thresholds:**
- >= 50 MIUs: ideal, prosseguir normalmente
- 30-49 MIUs: WARN -- "Inferencia possivel mas robustez comprometida"
- < 30 MIUs: BLOCK -- "MIUs insuficientes. Voltar a Fase 2 ou buscar mais fontes."

### Step 2: Carregar Catalogo de Drivers

```yaml
action: load
source: agents/clone-forge/data/driver-catalog.yaml
contents:
  - 951 drivers organizados por categoria
  - Cada driver com: id, name, category, description, indicators[], strength_formula
  - 6 categorias: cognitive, emotional, motivational, social, behavioral, meta
```

### Step 3: Carregar Templates de Relacao

```yaml
action: load
source: agents/clone-forge/data/driver-relationship-templates.yaml
contents:
  - Templates para 7 tipos de relacao
  - Cada template com: type, evidence_min, signal_principal, detection_rule
  - Tipos: AMPLIFIES, CONFLICTS, CONDITIONAL, COMPENSATES, SYNERGIZES, MASKS, TRIGGERS
```

### Step 4: Match MIU contra Driver Indicators

Para cada MIU:

1. Extrair: keywords, temas, sentimentos, contexto da provenance
2. Comparar contra indicators[] de cada driver no catalogo
3. Registrar match com confianca:

```yaml
match:
  miu_id: "MIU-0034"
  driver_id: "DRV-NEED_CONTROL"
  match_confidence: 0.82
  match_reason: "MIU descreve padrao de microgerenciamento recorrente"
  source_tier: 1
```

**Regras de matching:**
- Um MIU pode matchear multiplos drivers
- Um driver pode ser matcheado por multiplos MIUs
- Match confidence depende de: explicitude do indicator, confianca do MIU, tier da fonte
- Ignorar matches com confidence < 0.3

### Step 5: Agregar por Driver

Agrupar todos os matches por driver_id:

```yaml
aggregation:
  driver_id: "DRV-NEED_CONTROL"
  miu_count: 7
  weighted_count: 5.85  # sum(miu_confidence * source_tier_weight)
  source_diversity: 4    # fontes distintas
  tier_distribution:
    tier_0: 1
    tier_1: 3
    tier_2: 2
    tier_3: 1
  average_match_confidence: 0.76
  contexts: ["decisao", "equipe", "planejamento", "crise"]
```

**Pesos por tier:**
- Tier 0: 1.00
- Tier 1: 0.90
- Tier 2: 0.70
- Tier 3: 0.40

### Step 6: Calcular Forca

Para cada driver agregado:

```
base = weighted_count / max_possible_weighted_count * 100

modifiers:
  source_diversity_bonus = min(source_diversity * 5, 20)
  tier_0_bonus = 10 (se pelo menos 1 MIU Tier 0)
  consistency_bonus = 5 (se presente em 3+ contextos distintos)

strength = min(base + modifiers, 100)
strength = max(strength, 0)
```

Registrar formula completa para auditoria.

### Step 7: Filtrar

Aplicar filtros de qualidade:

| Filtro | Regra | Acao se FAIL |
|--------|-------|--------------|
| Evidencia minima | >= 2 MIUs de evidencia | Descartar driver (1 MIU = anedota) |
| Forca minima | strength >= 20 | Descartar driver (fraco demais) |
| Volume maximo | <= 80 drivers totais | Subir threshold de forca ate <= 80 |
| Volume minimo | >= 20 drivers | Baixar threshold ou buscar mais MIUs |

**Target range:** 20-60 drivers (sweet spot para perfil rico sem ruido).

### Step 8: Detectar Relacoes

Para cada par de drivers filtrados, checar:

1. **Templates:** match contra `driver-relationship-templates.yaml`
2. **Overlap de evidencia:** MIUs compartilhados entre drivers
3. **Contradicao:** MIUs que suportam driver A contradizem driver B
4. **Condicionalidade:** driver presente em contexto X, ausente em contexto Y
5. **Emergencia:** A + B juntos explicam comportamento que nenhum explica sozinho

| Tipo | Evidencia Min | Sinal Principal | Direcao |
|------|--------------|-----------------|---------|
| AMPLIFIES | 3 MIUs overlap | Ambos forca >= 60 + MIUs sobrepostos | A -> B |
| CONFLICTS | 2 MIUs contraditorios | MIUs de A contradizem MIUs de B | A <-> B |
| CONDITIONAL | 2 MIUs | Driver presente em contexto X, ausente em Y | A -> B |
| COMPENSATES | 3 MIUs | Efeitos negativos de B nao se manifestam | A -> B |
| SYNERGIZES | 4 MIUs | Comportamento emergente nao explicado isoladamente | A <-> B |
| MASKS | 2 MIUs | Driver B em Tier 0 mas ausente em fontes publicas | A -> B |
| TRIGGERS | 2 MIUs | Driver B so aparece apos situacoes de A | A -> B |

### Step 9: Identificar Paradoxos Produtivos

Filtrar relacoes do tipo CONFLICTS e avaliar:

- O conflito gera VALOR ou DISFUNCAO?
- Se valor: classificar como **paradoxo produtivo**
- Documentar com evidencia de ambos os lados
- Nunca "resolver" o paradoxo -- preservar como feature

```yaml
productive_paradox:
  id: "PP-001"
  driver_a: "DRV-AUTONOMY"
  driver_b: "DRV-COLLABORATION"
  tension: "Quer autonomia total MAS valoriza trabalho em equipe"
  value_generated: "Lidera com independencia sem se isolar"
  evidence_a: ["MIU-0012", "MIU-0034"]
  evidence_b: ["MIU-0089", "MIU-0102"]
  clone_instruction: "NAO RESOLVER — preservar ambos"
```

### Step 10: Gerar Outputs

**10a. mind-drivers.yaml**

```yaml
# Para cada driver filtrado:
- id: "DRV-NEED_CONTROL"
  name: "Need for Control"
  category: "motivational"
  strength: 78
  confidence: 0.82
  evidence_count: 7
  source_diversity: 4
  top_evidence_mius: ["MIU-0034", "MIU-0067", "MIU-0089"]
  summary: "Padrao consistente de microgerenciamento e planejamento detalhado"
```

**10b. driver-evidence.yaml**

```yaml
# Para cada link MIU -> driver:
- driver_id: "DRV-NEED_CONTROL"
  miu_id: "MIU-0034"
  match_confidence: 0.82
  match_reason: "Descreve habito de planejar cada detalhe antes de agir"
  source_tier: 1
  context: "resposta sobre processo de trabalho"
```

**10c. driver-relationships.yaml**

```yaml
# Para cada relacao detectada:
- id: "REL-001"
  type: "AMPLIFIES"
  driver_a: "DRV-NEED_CONTROL"
  driver_b: "DRV-PERFECTIONISM"
  direction: "A -> B"
  condition: null
  strength: 72
  confidence: 0.78
  evidence_mius: ["MIU-0034", "MIU-0067", "MIU-0089"]
  note: "Necessidade de controle amplifica perfeccionismo em entregas"
```

### Step 11: Gerar Driver Report

Produzir `04-drivers/driver-report.md` com 7 secoes:

1. **Resumo Executivo** -- Top 10 drivers, forca, categoria
2. **Constelacoes** -- Clusters de drivers que atuam juntos
3. **Paradoxos Produtivos** -- Conflitos que geram valor
4. **Drivers Condicionais** -- Drivers que dependem de contexto
5. **Mascaras e Triggers** -- Drivers ocultos e gatilhos
6. **Mapa de Evidencia** -- Tabela: driver -> MIUs -> fontes
7. **Gaps e Recomendacoes** -- Areas com pouca evidencia

### Step 12: Quality Gate — Driver Quality Gate

Executar `checklists/driver-quality-gate.md`:

| Check | Criterio | Bloqueante |
|-------|----------|-----------|
| Total drivers | >= 20 | SIM |
| Top 5 forca >= 60 | 5 drivers | SIM |
| Evidencia minima | Todo driver com 2+ MIUs | SIM |
| Cadeia documentada | driver-evidence.yaml completo | SIM |
| Relacoes detectadas | >= 5 | NAO (warn) |
| Paradoxos produtivos | >= 1 | NAO (warn) |
| Diversidade categorias | >= 3 das 5 | SIM |
| Driver report | driver-report.md gerado | SIM |

**Decisao:**

| Resultado | Criterio | Acao |
|-----------|----------|------|
| PASS | 7+/8 checks | Avancar para Fase 5 |
| CONDITIONAL | 5-6/8 + gaps documentados | Avancar com warnings |
| FAIL | < 5/8 | BLOQUEAR — re-analisar MIUs |

---

## Outputs

| Arquivo | Path | Descricao |
|---------|------|-----------|
| Mind Drivers | `minds/{slug}/04-drivers/mind-drivers.yaml` | Drivers inferidos com forca, confianca, evidencia |
| Driver Evidence | `minds/{slug}/04-drivers/driver-evidence.yaml` | Cadeia de evidencia MIU -> driver |
| Driver Relationships | `minds/{slug}/04-drivers/driver-relationships.yaml` | Relacoes entre drivers + paradoxos |
| Driver Report | `minds/{slug}/04-drivers/driver-report.md` | Relatorio narrativo completo |

---

## Validacao

### Checklist Pos-Execucao

- [ ] >= 20 drivers em mind-drivers.yaml
- [ ] Top 5 drivers com strength >= 60
- [ ] 100% dos drivers com 2+ MIUs de evidencia
- [ ] >= 3 das 5 categorias representadas (cognitive, emotional, motivational, social, behavioral)
- [ ] driver-evidence.yaml com cadeia completa MIU -> driver
- [ ] >= 5 relacoes em driver-relationships.yaml
- [ ] >= 1 paradoxo produtivo identificado
- [ ] driver-report.md gerado com as 7 secoes
- [ ] Nenhum driver com forca atribuida "por feeling" (formula documentada)
- [ ] Zero drivers sem source_tier na evidencia

---

## Error Handling

### Erro: Menos de 20 drivers inferidos

**Sintoma:** Poucos drivers passam no filtro de evidencia minima.
**Acao:**
1. Verificar se catalogo foi consultado adequadamente (951 drivers)
2. Baixar threshold de forca para 15 (documentar justificativa)
3. Se persistir: solicitar mais MIUs ao @innerlens
4. Ultimo recurso: solicitar entrevista profunda focada em comportamento/decisao

### Erro: Drivers sem diversidade de categoria

**Sintoma:** 1-2 categorias dominam, outras ausentes.
**Acao:**
1. Verificar distribuicao de MIUs por categoria
2. Se MIUs BEHAVIORAL escassos: solicitar fontes com observacao de comportamento
3. Se MIUs OPINION escassos: solicitar fontes com posicionamento explicito
4. Mapear: qual categoria de MIU alimenta qual categoria de driver

### Erro: Excesso de drivers (> 80)

**Sintoma:** Threshold muito baixo, muitos drivers de baixa qualidade.
**Acao:**
1. Subir threshold de forca de 20 para 30 (ou mais)
2. Subir threshold de evidencia de 2 para 3 MIUs
3. Priorizar: drivers com source_diversity >= 2
4. Documentar drivers descartados para referencia futura

### Erro: Zero paradoxos produtivos

**Sintoma:** Nenhum conflito detectado entre drivers.
**Acao:**
1. Revisar MIUs OPINION e BEHAVIORAL em busca de contradicoes
2. Verificar se templates de CONFLICTS estao sendo aplicados
3. Se genuinamente nao ha conflitos: documentar como "perfil coerente" (raro mas possivel)

---

## Integracao

### Recebe de

| Fase | Agente | Dados |
|------|--------|-------|
| Phase 2 | @innerlens | MIUs validados (`02-extraction/mius.yaml`) |
| Phase 3 | @innerlens + @cognitive-motor | DNA synthesis (`03-dna/dna-synthesis.yaml`) -- contexto opcional |

### Entrega para

| Fase | Agente | Dados |
|------|--------|-------|
| Phase 5 | @cognitive-motor (self) | Drivers para mapeamento psicometrico |
| Phase 6 | @clone-forge-chief | Drivers para agregacao de perfil |
| Phase 7 | @clone-forge-chief | Drivers para smoke tests de decisao |

### Handoff Protocol

```yaml
handoff_to_phase_5:
  from: "@cognitive-motor"
  to: "@cognitive-motor (self — proxima task)"
  gate: "Driver Quality Gate PASS"
  package:
    - minds/{slug}/04-drivers/mind-drivers.yaml
    - minds/{slug}/04-drivers/driver-evidence.yaml
    - minds/{slug}/04-drivers/driver-relationships.yaml
    - minds/{slug}/04-drivers/driver-report.md
```

---

## Historico de Revisoes

| Versao | Data | Autor | Mudanca |
|--------|------|-------|---------|
| 1.0.0 | 2026-03-02 | @cognitive-motor | Criacao inicial da task |

---

*"O driver existe SE e SOMENTE SE os MIUs sustentam."*
*"Forca sem evidencia e chute. Evidencia sem forca e ruido."*
