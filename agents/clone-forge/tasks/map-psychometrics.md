# Task: Mapeamento Psicometrico

**Task ID:** clone-forge/map-psychometrics
**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-03-02
**Category:** Psychological Analysis
**Execution Type:** Autonomous

---

## Executive Summary

Mapeia constelacoes de drivers psicologicos para 6 sistemas psicometricos (MBTI, Enneagram, DISC, Big Five, IQ/EQ, Spiral Dynamics). Todos os mapeamentos sao marcados como "estimated" a menos que assessment formal exista (ex: Zona Genialidade). Se assessment formal estiver disponivel, integra como ground truth e flagga discrepancias entre estimado e aferido. O resultado e um "DNA Mental" que cruza todos os sistemas numa narrativa coerente.

**Pipeline Position:** Phase 5 (apos Driver inference, antes de Profile aggregation)
**Success Definition:** 6/6 sistemas mapeados, confianca media >= 0.5, discrepancias documentadas
**Blocking:** NAO -- gera warnings, nao bloqueia pipeline

---

## Purpose

Drivers sao padroes psicologicos isolados. Psicometria organiza esses padroes em frameworks validados pela psicologia. O mapeamento serve 3 propositos:

1. **Consistencia interna** -- verificar se drivers convergem para um perfil coerente (ou se os conflitos sao genuinos)
2. **Comunicabilidade** -- traduzir drivers em linguagem que pessoas entendem ("INTJ", "Enneagram 3", "Alto D")
3. **Calibracao do clone** -- ajustar comportamento do clone baseado em perfil psicometrico (ex: INTJ nao faz small talk)

Importante: mapeamento psicometrico a partir de drivers e ESTIMATIVA, nao diagnostico. Todo resultado e marcado com confidence score e fonte (estimated vs assessed). Nunca apresentar estimativa como fato.

---

## Execution Type

**Autonomous** -- o @cognitive-motor executa o mapeamento completo sem intervencao humana, seguindo o Protocol 2 (Psychometric Mapping) definido em sua agent definition.

O agente carrega drivers inferidos, sistema psicometrico de referencia e (se disponivel) assessments formais. Executa mapeamento por sistema, merge com formais, e gera outputs estruturados.

---

## Inputs

### Obrigatorios

| Input | Path | Descricao |
|-------|------|-----------|
| Drivers inferidos | `minds/{slug}/04-drivers/mind-drivers.yaml` | Min 20 drivers, top 5 com strength >= 60 |
| Psychometric systems | `agents/clone-forge/data/psychometric-systems.yaml` | Definicao dos 6 sistemas com componentes e mapeamento |
| Driver relationships | `minds/{slug}/04-drivers/driver-relationships.yaml` | Relacoes entre drivers (para consistencia cross-system) |

### Opcionais

| Input | Path | Descricao |
|-------|------|-----------|
| Assessment formal | Zona Genialidade ou outro | Resultado de assessment psicometrico formal |
| Driver evidence | `minds/{slug}/04-drivers/driver-evidence.yaml` | Para rastrear cadeia ate MIUs |
| DNA synthesis | `minds/{slug}/03-dna/dna-synthesis.yaml` | Contexto adicional de Voice + Thinking |

---

## Precondicoes

- [ ] Driver Quality Gate: PASS (ou CONDITIONAL)
- [ ] Minimo 20 drivers inferidos em `04-drivers/mind-drivers.yaml`
- [ ] Top 5 drivers com strength >= 60
- [ ] Psychometric systems data carregado (`data/psychometric-systems.yaml`)
- [ ] Assessment formal verificado (presente ou ausente -- ambos validos)

---

## Steps

### Step 1: Carregar Drivers

```yaml
action: load
source: minds/{slug}/04-drivers/mind-drivers.yaml
validate:
  - total >= 20
  - top_5_strength >= 60
  - cada driver com: id, name, category, strength, confidence
stats_to_log:
  - total_drivers
  - strength_distribution
  - category_distribution
  - top_10_by_strength
```

### Step 2: Carregar Psychometric Systems

```yaml
action: load
source: agents/clone-forge/data/psychometric-systems.yaml
contents:
  - 6 sistemas com componentes, escalas e regras de mapeamento
  - Mapping rules: quais categorias de drivers mapeiam para quais componentes
  - Confidence formulas por sistema
```

### Step 3: Verificar Assessments Formais

```yaml
action: check
sources:
  - Zona Genialidade squad outputs (se existir)
  - Qualquer assessment formal documentado no perfil
result:
  - formal_exists: true/false
  - formal_systems: [lista de sistemas com resultado formal]
  - formal_data: {dados do assessment}
```

Se assessment formal existe: marcar sistemas cobertos como "assessed" (confidence 1.0).
Se nao existe: todos os sistemas serao "estimated".

### Step 4: Mapear por Sistema

Para cada um dos 6 sistemas:

#### 4a. MBTI (Myers-Briggs Type Indicator)

```yaml
system: MBTI
components:
  - 4 dicotomias: E/I, S/N, T/F, J/P
  - 8 funcoes cognitivas: Ni, Ne, Si, Se, Ti, Te, Fi, Fe
mapping:
  - Drivers cognitive -> funcoes cognitivas
  - Drivers social -> E/I
  - Drivers motivational -> J/P
  - Drivers behavioral -> S/N
  - Drivers emotional -> T/F
output:
  type: "INTJ"  # exemplo
  functions: ["Ni", "Te", "Fi", "Se"]
  confidence: 0.65
  source: "estimated"
  drivers_mapped: ["DRV-001", "DRV-034", ...]
```

#### 4b. Enneagram

```yaml
system: Enneagram
components:
  - 9 tipos base
  - Asa (wing): tipo adjacente dominante
  - Instinto: sp (self-preservation), sx (sexual/one-to-one), so (social)
  - Trifix: top type de cada centro (head, heart, gut)
mapping:
  - Drivers motivational -> tipo base
  - Drivers emotional -> centro (head/heart/gut)
  - Drivers social -> instinto
  - Drivers behavioral -> asa
output:
  type: 3
  wing: "3w4"
  instinct: "sp/so"
  trifix: "3-5-1"
  confidence: 0.58
  source: "estimated"
  drivers_mapped: [...]
```

#### 4c. DISC

```yaml
system: DISC
components:
  - 4 dimensoes: D (Dominance), I (Influence), S (Steadiness), C (Conscientiousness)
  - Cada dimensao: 0-100
mapping:
  - Drivers motivational (controle, impacto) -> D
  - Drivers social (comunicacao, persuasao) -> I
  - Drivers behavioral (consistencia, harmonia) -> S
  - Drivers cognitive (analise, precisao) -> C
output:
  scores:
    D: 78
    I: 45
    S: 32
    C: 65
  primary: "DC"
  confidence: 0.72
  source: "estimated"
  drivers_mapped: [...]
```

#### 4d. Big Five (OCEAN)

```yaml
system: Big_Five
components:
  - 5 dimensoes: O (Openness), C (Conscientiousness), E (Extraversion), A (Agreeableness), N (Neuroticism)
  - Sub-facetas por dimensao
mapping:
  - Drivers cognitive (curiosidade, criatividade) -> O
  - Drivers behavioral (disciplina, organizacao) -> C
  - Drivers social (sociabilidade, assertividade) -> E
  - Drivers emotional (empatia, cooperacao) -> A
  - Drivers emotional (ansiedade, reatividade) -> N
output:
  scores:
    O: 82
    C: 75
    E: 45
    A: 55
    N: 30
  facets:
    O: { imagination: 85, artistic_interests: 60, ... }
  confidence: 0.68
  source: "estimated"
  drivers_mapped: [...]
```

#### 4e. IQ/EQ Estimate

```yaml
system: IQ_EQ
components:
  - IQ: range estimado (nao numero exato)
  - EQ: 5 componentes (self-awareness, self-regulation, motivation, empathy, social_skills)
mapping:
  - Drivers cognitive (complexidade, abstracoes) -> IQ range
  - Drivers emotional + social -> 5 componentes EQ
note: "Confianca SEMPRE baixa (0.3-0.5). IQ/EQ requer teste formal."
output:
  iq_range: "120-135"
  eq_components:
    self_awareness: 72
    self_regulation: 65
    motivation: 88
    empathy: 55
    social_skills: 60
  confidence: 0.35
  source: "estimated"
  note: "Estimativa grosseira. Assessment formal recomendado."
  drivers_mapped: [...]
```

#### 4f. Spiral Dynamics

```yaml
system: Spiral_Dynamics
components:
  - Nivel predominante (Beige, Purple, Red, Blue, Orange, Green, Yellow, Turquoise)
  - Niveis secundarios
  - Transicoes ativas
mapping:
  - Drivers motivational -> nivel predominante
  - Drivers meta (auto-referencia, complexidade) -> Yellow/Turquoise
  - Drivers social -> Red/Blue/Green
output:
  predominant: "Orange"
  secondary: ["Green", "Yellow"]
  transitions: ["Orange -> Green (ativa)"]
  confidence: 0.55
  source: "estimated"
  drivers_mapped: [...]
```

### Step 5: Merge com Assessments Formais

Se assessment formal existe para algum sistema:

```yaml
merge_rules:
  - Formal SEMPRE sobrescreve estimado (confidence 1.0)
  - Estimados preenchem LACUNAS (sistemas sem assessment)
  - Flaggar discrepancias:
      estimated_type: "INTJ"
      assessed_type: "INFJ"
      discrepancy: "E/I -> I (concordam), S/N -> N (concordam), T/F -> diverge, J/P -> J (concordam)"
      investigation_note: "Investigar: drivers emocionais podem estar subrepresentados"
  - Nunca sobrescrever assessed com estimated
```

Se assessment formal NAO existe:
- Todos marcados como "estimated"
- Incluir recomendacao: "Assessment formal recomendado para aumentar confianca"

### Step 6: Gerar Outputs Individuais

Para cada sistema, gerar arquivo individual:

| Arquivo | Path | Conteudo |
|---------|------|----------|
| MBTI | `minds/{slug}/05-psychometric/mbti.yaml` | Tipo, funcoes, confianca, drivers_mapped |
| Enneagram | `minds/{slug}/05-psychometric/enneagram.yaml` | Tipo, asa, instinto, trifix |
| DISC | `minds/{slug}/05-psychometric/disc.yaml` | Scores D/I/S/C, perfil primario |
| Big Five | `minds/{slug}/05-psychometric/big-five.yaml` | Scores OCEAN + sub-facetas |
| IQ/EQ | `minds/{slug}/05-psychometric/iq-eq-estimate.yaml` | Range IQ, 5 componentes EQ |
| Spiral Dynamics | `minds/{slug}/05-psychometric/spiral-dynamics.yaml` | Nivel predominante + secundarios |

Cada arquivo inclui:
- `source: "estimated"` ou `source: "assessed"`
- `confidence: 0.XX`
- `drivers_mapped: [lista de driver IDs]`
- `discrepancies: []` (se assessment formal existir)

### Step 7: Gerar Psychometric Synthesis

Produzir `05-psychometric/psychometric-synthesis.md` -- narrativa "DNA Mental":

**Estrutura da sintese:**

1. **Perfil Integrado** -- como os 6 sistemas convergem para descrever essa pessoa
2. **Convergencias** -- onde 3+ sistemas apontam na mesma direcao
3. **Tensoes** -- onde sistemas divergem (e por que isso faz sentido ou nao)
4. **Discrepancias Estimado vs Aferido** -- se assessment formal existe
5. **Paradoxos Psicometricos** -- conflitos entre sistemas que refletem paradoxos produtivos
6. **Implicacoes para o Clone** -- como o perfil psicometrico deve influenciar comportamento
7. **Confianca Geral** -- media ponderada e recomendacoes para aumentar

### Step 8: Quality Gate — Psychometric Quality Gate

Executar `checklists/psychometric-quality-gate.md`:

| Check | Criterio | Bloqueante |
|-------|----------|-----------|
| Sistemas mapeados | 6/6 | SIM |
| Confianca media core | >= 0.5 (MBTI, Enneagram, DISC, Big Five) | SIM |
| Consistencia cross-system | >= 70% alinhamento | NAO (warn) |
| Nenhum sistema < 0.3 | 0 sistemas abaixo | NAO (warn) |
| Discrepancias flaggadas | 100% (se formal existe) | SIM |
| Evidencia por componente | Rastreavel ate drivers | SIM |
| Synthesis gerado | psychometric-synthesis.md completo | SIM |

**Decisao:**

| Resultado | Criterio | Acao |
|-----------|----------|------|
| PASS | 6+/7 checks | Prosseguir para Fase 6 |
| CONDITIONAL | 4-5/7 | Prosseguir com warnings -- nao bloqueia |
| NEEDS_DATA | < 4/7 | Documentar gaps, prosseguir com perfil incompleto |

**Importante:** Este gate NAO bloqueia o pipeline. Psicometria e complementar ao perfil core. Um clone pode ser funcional sem mapeamento psicometrico perfeito. Porem, gaps psicometricos afetam o fidelity_score final na Fase 7.

---

## Outputs

| Arquivo | Path | Descricao |
|---------|------|-----------|
| MBTI | `minds/{slug}/05-psychometric/mbti.yaml` | Tipo + funcoes cognitivas |
| Enneagram | `minds/{slug}/05-psychometric/enneagram.yaml` | Tipo + asa + instinto + trifix |
| DISC | `minds/{slug}/05-psychometric/disc.yaml` | Scores D/I/S/C |
| Big Five | `minds/{slug}/05-psychometric/big-five.yaml` | Scores OCEAN + facetas |
| IQ/EQ Estimate | `minds/{slug}/05-psychometric/iq-eq-estimate.yaml` | Range IQ + componentes EQ |
| Psychometric Synthesis | `minds/{slug}/05-psychometric/psychometric-synthesis.md` | Narrativa "DNA Mental" |

---

## Validacao

### Checklist Pos-Execucao

- [ ] 6/6 sistemas com arquivo individual gerado
- [ ] Todos os arquivos com campo `source` ("estimated" ou "assessed")
- [ ] Todos os arquivos com campo `confidence`
- [ ] Todos os arquivos com campo `drivers_mapped`
- [ ] Se assessment formal existe: discrepancias documentadas em cada arquivo
- [ ] Se assessment formal existe: formal prevalece sobre estimado
- [ ] IQ/EQ marcado com confianca <= 0.5 (nunca alta)
- [ ] psychometric-synthesis.md gerado com todas as 7 secoes
- [ ] Nenhum sistema apresentado como "fato" quando e "estimativa"
- [ ] Consistencia cross-system verificada e documentada

---

## Error Handling

### Erro: Drivers insuficientes para mapear sistema

**Sintoma:** Menos de 5 drivers relevantes para um sistema especifico.
**Acao:**
1. Marcar sistema como "insufficient_data" com confidence < 0.3
2. Documentar quais categorias de drivers estao faltando
3. Incluir no synthesis: "Sistema X nao mapeavel com dados atuais"
4. Nao inventar dados -- transparencia > completude

### Erro: Cross-system inconsistency > 30%

**Sintoma:** MBTI sugere introversao, DISC sugere alto I, Big Five sugere alta E.
**Acao:**
1. Identificar quais drivers geraram cada mapeamento conflitante
2. Verificar se drivers conflitantes tem evidencia forte (podem ser paradoxo)
3. Se paradoxo: documentar como "tensao psicometrica autentica"
4. Se erro de mapeamento: revisar mapping rules e re-calcular
5. Nunca forcar coerencia -- investigar e documentar

### Erro: Assessment formal contradiz estimado significativamente

**Sintoma:** Estimado sugere INTJ, formal diz ESFP (divergencia extrema).
**Acao:**
1. Formal SEMPRE prevalece (confidence 1.0)
2. Investigar por que drivers geraram estimativa tao diferente
3. Possivel: fontes nao refletem pessoa real (material editado, persona publica)
4. Documentar: "Divergencia significativa sugere que fontes capturam persona publica, nao pessoa real"
5. Recomendar entrevista profunda adicional

### Erro: IQ/EQ com confianca alta

**Sintoma:** Algoritmo atribuiu confianca > 0.5 para IQ/EQ.
**Acao:**
1. IQ/EQ NUNCA pode ter confianca > 0.5 sem teste formal
2. Cap em 0.5 independente do calculo
3. Adicionar nota: "Requer teste formal para validacao"

---

## Integracao

### Recebe de

| Fase | Agente | Dados |
|------|--------|-------|
| Phase 4 | @cognitive-motor (self) | Drivers (`04-drivers/mind-drivers.yaml`) |
| Phase 4 | @cognitive-motor (self) | Relacoes (`04-drivers/driver-relationships.yaml`) |
| Zona Genialidade | Squad externo (opcional) | Assessment formal |

### Entrega para

| Fase | Agente | Dados |
|------|--------|-------|
| Phase 6 | @clone-forge-chief | Perfil psicometrico para agregacao |
| Phase 7 | @clone-forge-chief | Psicometria para validacao de consistencia |
| Phase 8 | @clone-forge-chief | Perfil para calibracao do agente final |

### Handoff Protocol

```yaml
handoff_to_phase_6:
  from: "@cognitive-motor"
  to: "@clone-forge-chief"
  gate: "Psychometric Quality Gate (non-blocking)"
  package:
    - minds/{slug}/05-psychometric/mbti.yaml
    - minds/{slug}/05-psychometric/enneagram.yaml
    - minds/{slug}/05-psychometric/disc.yaml
    - minds/{slug}/05-psychometric/big-five.yaml
    - minds/{slug}/05-psychometric/iq-eq-estimate.yaml
    - minds/{slug}/05-psychometric/psychometric-synthesis.md
    - minds/{slug}/04-drivers/mind-drivers.yaml  # Necessario para Fase 6
```

---

## Historico de Revisoes

| Versao | Data | Autor | Mudanca |
|--------|------|-------|---------|
| 1.0.0 | 2026-03-02 | @cognitive-motor | Criacao inicial da task |

---

*"Estimado, nao aferido -- a confianca reflete isso."*
*"Nunca forcar uma pessoa num tipo. Sempre com confidence score."*
