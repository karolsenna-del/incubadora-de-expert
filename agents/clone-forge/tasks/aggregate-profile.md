# Task: Agregacao de Perfil (POC)

**Task ID:** clone-forge/aggregate-profile
**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-03-02
**Category:** Profile Assembly
**Execution Type:** Autonomous

---

## Executive Summary

Agrega todos os dados extraidos ao longo do pipeline (MIUs, Voice DNA, Thinking DNA, drivers, psicometria, entrevista) nos 6 modulos POC (Perfil Ontologico Completo) + extras (contradicoes e obsessoes). Cada campo de cada modulo recebe proveniencia rastreavel e confidence score. Calcula completude por modulo e global. Se completude < 80% em algum modulo, flagga gaps para a Fase 6.5 (Gap Analysis). O resultado e o perfil completo da pessoa -- a fundacao sobre a qual o clone sera construido.

**Pipeline Position:** Phase 6 (apos Psychometric mapping, antes de Gap Analysis / Validation)
**Success Definition:** >= 80% completude em todos os modulos, contradicoes e obsessoes documentadas
**Blocking Gate:** QG-004 PROFILE_COMPLETENESS

---

## Purpose

As fases anteriores produzem dados fragmentados: MIUs sao atomicos, DNA e bifurcado (voice + thinking), drivers sao isolados, psicometria e por sistema. A agregacao resolve a fragmentacao -- organiza tudo em 6 modulos tematicos que juntos descrevem a pessoa inteira em 4 camadas de profundidade (Observable, Cognitive, Deep Identity, Ecosystem).

Alem dos 6 modulos, a agregacao identifica:
- **Contradicoes** -- paradoxos produtivos que definem a singularidade da pessoa
- **Obsessoes** -- temas recorrentes que revelam o que a pessoa realmente se importa

Sem agregacao, o clone tem dados brutos. Com agregacao, o clone tem um MAPA da pessoa.

---

## Execution Type

**Autonomous** -- o @clone-forge-chief executa a agregacao completa sem intervencao humana.

O Chief carrega todos os outputs upstream, mapeia dados para modulos POC, calcula completude e gera o perfil unificado. Se completude insuficiente, sinaliza para Fase 6.5 automaticamente.

---

## Inputs

### Obrigatorios

| Input | Path | Descricao |
|-------|------|-----------|
| MIUs validados | `minds/{slug}/02-extraction/mius.yaml` | MIUs com categoria, confianca, proveniencia |
| Voice DNA | `minds/{slug}/03-dna/voice-dna.yaml` | DNA de comunicacao |
| Thinking DNA | `minds/{slug}/03-dna/thinking-dna.yaml` | DNA de pensamento e frameworks |
| Implicit Knowledge | `minds/{slug}/03-dna/implicit-knowledge.yaml` | Crencas, regras, gaps |
| DNA Synthesis | `minds/{slug}/03-dna/dna-synthesis.yaml` | Integracao Voice + Thinking |
| Mind Drivers | `minds/{slug}/04-drivers/mind-drivers.yaml` | Drivers com forca e evidencia |
| Driver Relationships | `minds/{slug}/04-drivers/driver-relationships.yaml` | Relacoes e paradoxos |
| Psychometric files | `minds/{slug}/05-psychometric/*.yaml` | 5 arquivos + synthesis |

### Opcionais

| Input | Path | Descricao |
|-------|------|-----------|
| Entrevista profunda | `minds/{slug}/01-sources/interview/` | Respostas Tier 0 dos 6 blocos |
| Driver Evidence | `minds/{slug}/04-drivers/driver-evidence.yaml` | Cadeia MIU -> driver |
| Driver Report | `minds/{slug}/04-drivers/driver-report.md` | Narrativa de drivers |

### Dados do Squad

| Dado | Path | Descricao |
|------|------|-----------|
| POC Schema | `agents/clone-forge/data/poc-schema.yaml` | Definicao dos 6 modulos com campos required/optional |

---

## Precondicoes

- [ ] QG-002 MIU_QUALITY: PASS
- [ ] QG-003 DNA_QUALITY: PASS (ou CONDITIONAL)
- [ ] Driver Quality Gate: PASS (ou CONDITIONAL)
- [ ] Psychometric Quality Gate: PASS, CONDITIONAL ou NEEDS_DATA (qualquer resultado)
- [ ] Todos os outputs de Phase 2-5 existem nos respectivos diretorios
- [ ] POC schema carregado (`data/poc-schema.yaml`)

---

## Steps

### Step 1: Carregar Todos os Dados Upstream

```yaml
action: load_all
sources:
  mius: minds/{slug}/02-extraction/mius.yaml
  voice_dna: minds/{slug}/03-dna/voice-dna.yaml
  thinking_dna: minds/{slug}/03-dna/thinking-dna.yaml
  implicit: minds/{slug}/03-dna/implicit-knowledge.yaml
  dna_synthesis: minds/{slug}/03-dna/dna-synthesis.yaml
  drivers: minds/{slug}/04-drivers/mind-drivers.yaml
  relationships: minds/{slug}/04-drivers/driver-relationships.yaml
  psychometric: minds/{slug}/05-psychometric/*.yaml
  interview: minds/{slug}/01-sources/interview/ (se existir)

validate:
  - Cada arquivo existe e nao esta vazio
  - MIUs tem status "validated"
  - Drivers tem forca e confianca
on_missing: |
  Documentar quais inputs estao ausentes.
  Prosseguir com dados disponiveis.
  Campos dependentes do input ausente marcados como "data_unavailable".
```

### Step 2: Preencher Modulos POC

Para cada um dos 6 modulos, mapear dados relevantes, preencher campos, registrar proveniencia e calcular completude.

#### 2a. Modulo Identidade (`identity.yaml`)

```yaml
module: identity
layer: "L1 (Observable) + L3 (Deep Identity)"
threshold: 80%

fields_mapping:
  nome: "metadata do pipeline"
  dominio: "metadata do pipeline"
  proposito: "MIUs OPINION (tag VALUES) + entrevista Bloco 5"
  historia_origem: "MIUs STORYTELLING (tag IDENTITY) + entrevista Bloco 1"
  turning_points: "MIUs STORYTELLING de alta confianca"
  valores_core: "MIUs OPINION (tag VALUES) + implicit beliefs"
  rejeicoes: "MIUs OPINION (tag REJECTION) + Voice DNA anti_patterns"
  identidade_profissional: "Thinking DNA + MIUs BEHAVIORAL"
  identidade_pessoal: "entrevista Bloco 1 + MIUs STORYTELLING"
  aspiracoes: "entrevista Bloco 6 + MIUs OPINION"

provenance_per_field:
  proposito:
    source: "Phase 2, MIUs [MIU-012, MIU-045]; Phase 1.5, Bloco 5, P2"
    confidence: 0.85
    method: "direct_extraction"
```

#### 2b. Modulo Modelo Mental (`mental-model.yaml`)

```yaml
module: mental_model
layer: "L2 (Cognitive)"
threshold: 80%

fields_mapping:
  frameworks_core: "Thinking DNA frameworks + MIUs METHODOLOGICAL"
  heuristicas: "Thinking DNA heuristics + MIUs METHODOLOGICAL (tag HEURISTIC)"
  modelos_mentais: "Thinking DNA mental_models + implicit unconscious_rules"
  decision_pipeline: "Thinking DNA decision_pipeline + entrevista Bloco 3"
  vieses_intencionais: "MIUs OPINION + drivers motivational"
  premissas: "implicit beliefs_assumed"
  anti_modelos: "MIUs OPINION (tag REJECTION) + Thinking DNA non_negotiables"
```

#### 2c. Modulo Operacional (`operational.yaml`)

```yaml
module: operational
layer: "L1 (Observable)"
threshold: 70%

fields_mapping:
  estilo_trabalho: "MIUs BEHAVIORAL + Voice DNA tone"
  rotinas: "MIUs BEHAVIORAL (observacoes de habito)"
  ferramentas: "MIUs TECHNICAL + entrevista Bloco 2"
  comunicacao: "Voice DNA completo"
  ensino: "Voice DNA contextual_tone.teaching + MIUs METHODOLOGICAL"
  lideranca: "drivers social + MIUs BEHAVIORAL (contexto equipe)"
  confronto: "Voice DNA immune_system + MIUs BEHAVIORAL (contexto conflito)"
```

#### 2d. Modulo Repertorio (`repertoire.yaml`)

```yaml
module: repertoire
layer: "L2 (Cognitive)"
threshold: 70%

fields_mapping:
  casos_sucesso: "MIUs STORYTELLING de alta confianca (resultados positivos)"
  casos_fracasso: "MIUs STORYTELLING (resultados negativos, licoes)"
  exemplos_favoritos: "Voice DNA favorite_examples"
  analogias_metaforas: "Voice DNA metaphors"
  historias_recorrentes: "Voice DNA recurring_stories"
  playbooks: "MIUs METHODOLOGICAL (tag FRAMEWORK) — passo a passo"
  frameworks_aplicados: "Thinking DNA + MIUs METHODOLOGICAL com contexto real"
  swipe_files: "MIUs STORYTELLING que aplicam playbook + framework"
```

#### 2e. Modulo Framework Visual (`visual-framework.yaml`)

```yaml
module: visual_framework
layer: "L3 (Deep Identity)"
threshold: 60%

fields_mapping:
  tese_central: "MIUs OPINION mais recorrentes + Thinking DNA non_negotiables"
  manifesto: "MIUs OPINION de alta confianca + entrevista Bloco 5"
  visao_futuro: "entrevista Bloco 6 + MIUs OPINION (tag VALUES)"
  posicionamento_mercado: "MIUs OPINION sobre concorrentes/mercado"
  diferencial: "drivers motivational + MIUs BEHAVIORAL unicOs"
  legado: "entrevista Bloco 6 + MIUs STORYTELLING (aspiracoes)"
```

#### 2f. Modulo Ecossistema (`ecosystem.yaml`)

```yaml
module: ecosystem
layer: "L4 (Ecosystem)"
threshold: 60%

fields_mapping:
  publico_alvo: "MIUs OPINION (sobre quem serve) + metadata"
  concorrentes_referencia: "MIUs OPINION (sobre outros no mercado)"
  parceiros: "MIUs STORYTELLING (mencionam outras pessoas/empresas)"
  influencias: "MIUs STORYTELLING + entrevista Bloco 1 (formacao)"
  mercado: "MIUs OPINION + MIUs TECHNICAL (dados de mercado)"
  modelo_negocio: "MIUs METHODOLOGICAL (como monetiza) + MIUs TECHNICAL"
```

### Step 3: Registrar Proveniencia por Campo

Para CADA campo preenchido, documentar:

```yaml
field_provenance:
  field_name: "proposito"
  value: "Ajudar experts a..."
  sources:
    - origin: "Phase 2"
      ref: "MIU-012"
      confidence: 0.88
      type: "direct_extraction"
    - origin: "Phase 1.5"
      ref: "Bloco 5, P2"
      confidence: 0.95
      type: "direct_quote"
  final_confidence: 0.91  # Weighted average
  method: "highest_confidence_wins"  # ou "consensus", "triangulation"
  inferred: false  # true se requer interpretacao
```

**Regras de preenchimento:**
- Dado de maior confianca prevalece
- Se 2+ fontes concordam: confidence bonus (+0.05)
- Se fontes divergem: documentar ambas, marcar como "contested"
- Se campo requer inferencia: marcar `[INFERRED]` com confidence reduzida

### Step 4: Identificar Contradicoes

Analisar todos os dados em busca de contradicoes autenticas:

```yaml
action: detect_contradictions
sources: all_modules + drivers + MIUs
output: minds/{slug}/06-profile/contradictions.yaml

detection_criteria:
  - Campo A diz X, campo B diz ~X (mesmo modulo ou cross-modulo)
  - Driver A conflita com Driver B (via driver-relationships CONFLICTS)
  - MIU diz algo que contradiz Voice DNA ou Thinking DNA
  - Comportamento observado contradiz valor declarado

per_contradiction:
  id: "CONTRA-001"
  description: "Defende simplicidade mas usa frameworks complexos"
  side_a:
    claim: "Simplicidade e rei"
    evidence: ["MIU-012", "MIU-034"]
    module: "mental_model"
  side_b:
    claim: "Frameworks de 5 camadas"
    evidence: ["MIU-078", "MIU-089"]
    module: "repertoire"
  classification: "productive_paradox"  # ou "evolution", "context_dependent", "genuine_inconsistency"
  resolution: "NAO RESOLVER — paradoxo produtivo. Simplifica pra audiencia, complexifica internamente."
  clone_instruction: "Manter ambos modos. Usar simplicidade por default, complexidade quando solicitado."
```

**Minimo:** 2 contradicoes documentadas. Se nenhuma encontrada, investigar mais (pessoas reais SEMPRE se contradizem).

### Step 5: Identificar Obsessoes

Analisar frequencia de temas recorrentes across todos os dados:

```yaml
action: detect_obsessions
sources: all_MIUs + Voice DNA + Thinking DNA + interview
output: minds/{slug}/06-profile/obsessions.yaml

detection_criteria:
  - Tema que aparece em 5+ MIUs de 3+ fontes diferentes
  - Tema que o expert retorna SEMPRE independente do contexto
  - Tema presente em Voice DNA (recurring_stories, signature_phrases)
  - Tema presente em Thinking DNA (non_negotiables, frameworks)

per_obsession:
  id: "OBS-001"
  theme: "Autonomia como principio inegociavel"
  frequency: 12  # vezes que aparece
  sources_count: 7  # fontes distintas
  evidence_mius: ["MIU-005", "MIU-023", "MIU-045", ...]
  manifests_as:
    - "Rejeicao de modelos que dependem de equipe grande"
    - "Framework de One Person Business"
    - "Critica a lancadores e socios"
  intensity: "alta"  # alta, media, baixa
  clone_instruction: "Tema deve emergir naturalmente em 20%+ das respostas"
```

**Minimo:** 3 obsessoes identificadas. Se menos de 3, revisar MIUs de alta frequencia.

### Step 6: Gerar Perfil Unificado

Produzir `06-profile/unified-profile.md` -- narrativa legivel do perfil completo:

**Estrutura:**

1. **Quem e essa pessoa** -- resumo de identidade (modulo 1)
2. **Como pensa** -- modelo mental e frameworks (modulo 2)
3. **Como opera** -- estilo de trabalho e comunicacao (modulo 3)
4. **O que sabe** -- repertorio e casos (modulo 4)
5. **O que defende** -- tese, manifesto, visao (modulo 5)
6. **Onde esta** -- ecossistema e mercado (modulo 6)
7. **Contradicoes autenticas** -- paradoxos produtivos
8. **Obsessoes core** -- temas recorrentes
9. **Perfil psicometrico** -- resumo dos 6 sistemas
10. **Completude e limitacoes** -- gaps, campos incompletos, recomendacoes

### Step 7: Calcular Completude

Para cada modulo:

```
completude_modulo = campos_required_preenchidos / total_campos_required * 100
```

Para completude global:

```
completude_global = media_ponderada(completude_modulo * peso_modulo)

pesos:
  identity: 1.0
  mental_model: 1.0
  operational: 0.8
  repertoire: 0.8
  visual_framework: 0.6
  ecosystem: 0.6
```

### Step 8: Quality Gate — QG-004 PROFILE_COMPLETENESS

| Check | Criterio | Acao se FAIL |
|-------|----------|--------------|
| Identidade | >= 80% | Gap analysis focado em identidade |
| Modelo Mental | >= 80% | Gap analysis focado em frameworks |
| Operacional | >= 70% | Gap analysis focado em estilo |
| Repertorio | >= 70% | Gap analysis focado em cases |
| Framework Visual | >= 60% | Gap analysis focado em tese |
| Ecossistema | >= 60% | Gap analysis focado em mercado |
| Contradicoes | >= 2 documentadas | Revisitar MIUs e drivers |
| Obsessoes | >= 3 identificadas | Revisitar frequencia nos MIUs |
| Completude global | >= 80% | Triggerar Fase 6.5 |

**Decisao:**

| Resultado | Criterio | Acao |
|-----------|----------|------|
| PASS | Todos os modulos acima do threshold + global >= 80% | Avancar para Fase 7 |
| CONDITIONAL | 1-2 modulos abaixo mas global >= 75% | Documentar gaps e avancar |
| FAIL | Global < 75% ou modulo critico (Identity/Mental Model) < 60% | Triggerar Fase 6.5 |

**Se FAIL:** Fase 6.5 (Gap Analysis) e ativada automaticamente. O Chief gera questionario cirurgico focado nos gaps especificos. Apos respostas integradas, recalcular completude. Max 2 iteracoes de gap analysis antes de avancar com limitacoes documentadas.

---

## Outputs

| Arquivo | Path | Descricao |
|---------|------|-----------|
| Identity | `minds/{slug}/06-profile/identity.yaml` | Modulo Identidade (L1 + L3) |
| Mental Model | `minds/{slug}/06-profile/mental-model.yaml` | Modulo Modelo Mental (L2) |
| Operational | `minds/{slug}/06-profile/operational.yaml` | Modulo Operacional (L1) |
| Repertoire | `minds/{slug}/06-profile/repertoire.yaml` | Modulo Repertorio (L2) |
| Visual Framework | `minds/{slug}/06-profile/visual-framework.yaml` | Modulo Framework Visual (L3) |
| Ecosystem | `minds/{slug}/06-profile/ecosystem.yaml` | Modulo Ecossistema (L4) |
| Contradictions | `minds/{slug}/06-profile/contradictions.yaml` | Paradoxos produtivos |
| Obsessions | `minds/{slug}/06-profile/obsessions.yaml` | Temas recorrentes |
| Unified Profile | `minds/{slug}/06-profile/unified-profile.md` | Narrativa legivel do perfil completo |

---

## Validacao

### Checklist Pos-Execucao

- [ ] 6 modulos POC gerados em `06-profile/`
- [ ] Cada modulo com campos required preenchidos acima do threshold
- [ ] Proveniencia documentada por campo (source + confidence)
- [ ] Campos inferidos marcados com `[INFERRED]`
- [ ] contradictions.yaml com min 2 contradicoes documentadas
- [ ] obsessions.yaml com min 3 obsessoes identificadas
- [ ] unified-profile.md gerado com todas as 10 secoes
- [ ] Completude por modulo calculada e registrada
- [ ] Completude global >= 80% (ou gaps flaggados para Fase 6.5)
- [ ] Nenhum dado fabricado -- apenas dados extraidos ou inferidos com evidencia

---

## Error Handling

### Erro: Modulo com completude < 50%

**Sintoma:** Modulo critico muito incompleto.
**Acao:**
1. Identificar quais campos estao vazios
2. Rastrear: esses campos dependem de qual fase upstream?
3. Se dados existem mas nao foram mapeados: corrigir mapeamento
4. Se dados nao existem: flaggar para gap analysis com prioridade alta
5. Se dados nao podem existir (expert nao tem essa informacao): documentar como "not_applicable"

### Erro: Zero contradicoes encontradas

**Sintoma:** Perfil parece artificialmente coerente.
**Acao:**
1. Revisar driver-relationships.yaml (tipo CONFLICTS)
2. Revisar MIUs OPINION contraditoriOs
3. Comparar Voice DNA anti_patterns com comportamento real
4. Se genuinamente nao ha contradicoes: documentar como "perfil coerente" (flag para Fase 7 investigar)
5. Nota: ausencia de contradicoes e um smell -- pessoas reais sempre tem tensoes

### Erro: Obsessoes nao atingem minimo

**Sintoma:** Menos de 3 temas recorrentes identificados.
**Acao:**
1. Baixar threshold de frequencia (de 5 para 3 MIUs)
2. Expandir busca para Voice DNA (recurring_stories, signature_phrases)
3. Verificar Thinking DNA (non_negotiables repetidos)
4. Se fontes sao muito diversificadas: agrupar por meta-tema

### Erro: Dados upstream ausentes

**Sintoma:** Um ou mais inputs de fases anteriores nao existem.
**Acao:**
1. Documentar quais inputs estao ausentes
2. Campos que dependem do input ausente: marcar como "data_unavailable"
3. Calcular completude com campos indisponiveis excluidos do denominador
4. Recomendar re-execucao da fase upstream quando possivel
5. Nunca inventar dados para compensar ausencia

### Erro: Completude global < 75% apos gap analysis

**Sintoma:** Mesmo apos 2 iteracoes de Fase 6.5, perfil insuficiente.
**Acao:**
1. Documentar limitacoes explicitamente em unified-profile.md
2. Marcar campos incompletos como "[DADOS LIMITADOS]"
3. Avancar para Fase 7 com nota: "Perfil incompleto — fidelity_score sera impactado"
4. No output final: recomendar coleta de mais fontes para versao futura

---

## Integracao

### Recebe de

| Fase | Agente | Dados |
|------|--------|-------|
| Phase 2 | @innerlens | MIUs (`02-extraction/mius.yaml`) |
| Phase 3 | @innerlens + @cognitive-motor | DNA (`03-dna/`) |
| Phase 4 | @cognitive-motor | Drivers (`04-drivers/`) |
| Phase 5 | @cognitive-motor | Psicometria (`05-psychometric/`) |
| Phase 1.5 | @clone-forge-chief (self) | Entrevista (`01-sources/interview/`) |

### Entrega para

| Fase | Agente | Dados |
|------|--------|-------|
| Phase 6.5 | @clone-forge-chief (self) | Gaps para questionario cirurgico |
| Phase 7 | @clone-forge-chief | Perfil completo para validacao |
| Phase 8 | @clone-forge-chief (self) | Perfil para geracao de agente |

### Handoff Protocol

```yaml
handoff_to_phase_7:
  from: "@clone-forge-chief"
  to: "@clone-forge-chief"
  gate: "QG-004 PASS"
  package:
    - minds/{slug}/06-profile/identity.yaml
    - minds/{slug}/06-profile/mental-model.yaml
    - minds/{slug}/06-profile/operational.yaml
    - minds/{slug}/06-profile/repertoire.yaml
    - minds/{slug}/06-profile/visual-framework.yaml
    - minds/{slug}/06-profile/ecosystem.yaml
    - minds/{slug}/06-profile/contradictions.yaml
    - minds/{slug}/06-profile/obsessions.yaml
    - minds/{slug}/06-profile/unified-profile.md
    - minds/{slug}/03-dna/voice-dna.yaml  # Necessario para smoke tests
    - minds/{slug}/03-dna/thinking-dna.yaml  # Necessario para smoke tests
```

---

## Historico de Revisoes

| Versao | Data | Autor | Mudanca |
|--------|------|-------|---------|
| 1.0.0 | 2026-03-02 | @clone-forge-chief | Criacao inicial da task |

---

*"Clone bom nao se faz com pressa -- se faz com curadoria."*
*"Contradicoes nao sao bugs -- sao features."*
