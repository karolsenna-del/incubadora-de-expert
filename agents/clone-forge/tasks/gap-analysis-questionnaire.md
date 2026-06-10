# Task: Gap Analysis + Questionario de Refinamento

**Task ID:** clone-forge/gap-analysis-questionnaire
**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-03-02
**Category:** Profile Refinement
**Execution Type:** Interactive

---

## Executive Summary

Diagnostica automaticamente quais modulos POC estao incompletos apos a Fase 6 (Agregacao de Perfil), identifica exatamente o que falta ou tem confianca baixa, e gera um questionario cirurgico -- nunca generico -- direcionado apenas aos gaps reais. As respostas alimentam re-extracao parcial e re-agregacao dos modulos afetados, elevando a completude do perfil para o threshold de 80%.

---

## Purpose

Apos a agregacao de perfil (Fase 6), e comum que alguns modulos POC fiquem abaixo do threshold de completude. Em vez de repetir o pipeline inteiro ou fazer perguntas genericas, esta task analisa cirurgicamente o que falta e gera perguntas especificas que referenciam evidencias existentes (MIUs, fontes, contradicoes). O objetivo e atingir >= 80% de completude em todos os modulos com o minimo de perguntas possivel.

---

## Execution Type

**Interactive** — Gera perguntas que precisam ser respondidas pela pessoa sendo clonada (ou por quem a conhece bem). O fluxo e:

1. Analise automatica dos gaps (autonomo)
2. Geracao das perguntas (autonomo)
3. Apresentacao ao usuario/expert (interativo)
4. Captura de respostas (interativo)
5. Re-extracao e re-agregacao (autonomo)

---

## Inputs

| Parameter | Type | Required | Description | Source |
|-----------|------|----------|-------------|--------|
| `mind_slug` | string | Yes | Slug do clone ativo | manifest.yaml |
| `profile_completeness` | object | Yes | Completude por modulo (output da Fase 6) | 06-profile/ |
| `poc_modules` | files | Yes | Arquivos de perfil POC existentes | 06-profile/*.yaml |
| `miu_database` | files | Yes | MIUs extraidos | 02-extraction/ |
| `dna_files` | files | Yes | Voice DNA + Thinking DNA | 03-dna/ |
| `driver_report` | file | No | Driver report (se modo full) | 04-drivers/ |
| `manifest` | file | Yes | Manifest do clone com estado atual | manifest.yaml |
| `subject_present` | boolean | Yes | Se a pessoa sendo clonada esta disponivel | manifest.yaml → config.subject_present |

---

## Precondicoes

- [ ] Fase 6 (Agregacao de Perfil) concluida
- [ ] QG-004 (PROFILE_COMPLETENESS) resultou em FAIL ou CONDITIONAL
- [ ] Completude < 0.8 em pelo menos 1 modulo POC
- [ ] `subject_present: true` no manifest (pessoa disponivel para responder)
- [ ] Arquivos de perfil existem em `minds/{slug}/06-profile/`
- [ ] MIUs extraidos existem em `minds/{slug}/02-extraction/`
- [ ] Manifest atualizado com status da Fase 6

**Skip Condition:**
Se `completeness >= 0.8` em TODOS os modulos: pular esta fase e avancar para Fase 7 (Validacao). Registrar no manifest: `phase_6_5.status: skipped`, `phase_6_5.skipped_reason: "Todos os modulos acima do threshold"`.

Se `subject_present: false`: pular esta fase e documentar gaps como limitacoes conhecidas. Registrar no manifest: `phase_6_5.status: skipped`, `phase_6_5.skipped_reason: "Pessoa nao disponivel para responder"`.

---

## Steps

### Step 1: Carregar Completude da Fase 6

**Action:** Ler todos os arquivos de perfil POC e o resultado de completude da Fase 6.

```yaml
load_profile:
  files:
    - "minds/{slug}/06-profile/identity.yaml"
    - "minds/{slug}/06-profile/mental-model.yaml"
    - "minds/{slug}/06-profile/operational.yaml"
    - "minds/{slug}/06-profile/repertoire.yaml"
    - "minds/{slug}/06-profile/visual-framework.yaml"
    - "minds/{slug}/06-profile/ecosystem.yaml"
    - "minds/{slug}/06-profile/contradictions.yaml"
    - "minds/{slug}/06-profile/obsessions.yaml"
  reference: "agents/clone-forge/data/poc-schema.yaml"
```

**Output:** Mapa de completude por modulo com status de cada campo (filled, missing, low_confidence, inferred).

---

### Step 2: Identificar Modulos Abaixo do Threshold

**Action:** Comparar completude de cada modulo contra o threshold definido no `poc-schema.yaml`.

```yaml
identify_gaps:
  thresholds:
    identity: 80
    mental-model: 80
    operational: 70
    repertoire: 70
    visual-framework: 60
    ecosystem: 60
    contradictions: "min 2 items"
    obsessions: "min 3 items"

  for_each_module:
    - calculate: "campos_preenchidos / campos_required * 100"
    - compare: "completude vs threshold"
    - if_below: "marcar como GAP_MODULE"
    - list_missing_fields: "campos required nao preenchidos"
    - list_low_confidence: "campos com confidence < 0.5"
    - list_inferred_only: "campos marcados como [INFERRED] sem evidencia direta"
```

**Output:** Lista priorizada de modulos com gaps, ordenada por impacto (required fields primeiro, maior peso de camada primeiro).

---

### Step 3: Analisar Dados Faltantes por Gap

**Action:** Para cada gap identificado, analisar especificamente o que falta e por que.

```yaml
analyze_gaps:
  for_each_gap:
    - field_name: "nome do campo faltante"
    - field_type: "required | optional"
    - module: "modulo POC a que pertence"
    - layer: "L1 | L2 | L3 | L4"
    - current_data: "o que ja temos (se algo)"
    - confidence: "nivel de confianca atual (0-1)"
    - why_missing: "por que esta faltando"
      options:
        - "Nenhuma fonte abordou este topico"
        - "Fontes mencionam superficialmente mas sem profundidade"
        - "Dados contraditorios entre fontes (nao resolvido)"
        - "Informacao inferida mas sem evidencia direta"
        - "Topico aparece em fontes Tier 3 apenas (baixa confiabilidade)"
    - related_mius: "MIUs que tocam neste campo (se algum)"
    - evidence_available: "evidencia parcial que ja existe"
```

**Output:** Diagnostico detalhado por gap com contexto suficiente para gerar perguntas precisas.

---

### Step 4: Gerar Questionario Cirurgico

**Action:** Gerar entre 3 e 10 perguntas, dependendo da quantidade de gaps. Cada pergunta deve ser ESPECIFICA e referenciar evidencias existentes quando possivel.

```yaml
generate_questions:
  rules:
    min_questions: 3
    max_questions: 10
    priority: "required fields > optional fields"
    specificity: "MUST reference evidence"

  question_types:

    missing_data:
      pattern: "Nao encontramos em nenhuma fonte: {campo}. {pergunta_direta}"
      example: "Nao encontramos em nenhuma fonte quais sao suas regras de bolso para decisao rapida. Quais sao as 3 regras que voce segue instintivamente quando precisa decidir rapido?"

    low_confidence:
      pattern: "Nos MIUs extraidos, aparece que {dado_inferido}. Isso confere? Pode ir mais fundo?"
      example: "Nos MIUs extraidos, aparece que voce prioriza profundidade sobre velocidade na mentoria. Isso confere? Como isso funciona na pratica quando o cliente quer resultado rapido?"

    contradiction:
      pattern: "Em {fonte_A} voce diz {X}, mas em {fonte_B} voce diz {Y}. Qual e a verdade? Ou as duas coisas sao verdade em contextos diferentes?"
      example: "No video sobre lancamento voce diz que 'todo expert precisa de audiencia grande', mas em outra entrevista voce diz que 'audiencia e vaidade, conversao e o que importa'. Qual e a verdade? Ou as duas coisas sao verdade em contextos diferentes?"

    surface_only:
      pattern: "Voce menciona {conceito} varias vezes mas nunca explica em profundidade. Pode detalhar: {pergunta_especifica}?"
      example: "Voce menciona o Metodo PMI varias vezes mas nunca explica o passo a passo completo. Pode detalhar: como cada etapa funciona na pratica com um cliente real?"

  anti_patterns:
    - "NUNCA perguntar 'Fale sobre seus valores'" # generico demais
    - "NUNCA perguntar 'O que te motiva?'" # superficie
    - "NUNCA repetir o que ja sabemos" # desperdicio
    - "NUNCA fazer pergunta que pode ser respondida com sim/nao" # precisa ser aberta
    - "NUNCA fazer mais de 10 perguntas" # respeitar tempo do expert
```

**Output:** Lista de perguntas numeradas com metadata (gap_target, module, expected_impact).

---

### Step 5: Apresentar Questionario ao Expert

**Action:** Apresentar as perguntas de forma clara e contextualizada. Explicar por que cada pergunta esta sendo feita e qual gap ela resolve.

```yaml
present_questionnaire:
  format: |
    GAP ANALYSIS — Questionario de Refinamento
    =============================================
    Expert: {nome}
    Completude atual: {completude_global}%
    Gaps identificados: {N} campos em {M} modulos

    O perfil ta quase la, mas preciso de {N} respostas pra fechar
    os gaps. Cada pergunta mira num ponto especifico que falta.

    PERGUNTA 1/{total} — {modulo} ({campo})
    {pergunta}
    [Por que pergunto: {justificativa_curta}]

    PERGUNTA 2/{total} — {modulo} ({campo})
    ...

  interaction:
    - "Apresentar perguntas uma por vez OU todas de uma vez (preferencia do usuario)"
    - "Aceitar respostas em qualquer formato (texto, audio transcrito, link)"
    - "Se resposta for rasa: follow-up com 'Pode ir mais fundo?'"
    - "Se resposta contradiz dados existentes: apontar e pedir reconciliacao"
```

**Output:** Questionario apresentado, aguardando respostas.

---

### Step 6: Capturar Respostas

**Action:** Receber e registrar cada resposta vinculada ao gap que resolve.

```yaml
capture_responses:
  for_each_response:
    - question_id: "Q-{seq}"
    - target_gap: "{module}.{field}"
    - response_text: "{texto da resposta}"
    - response_quality:
        options:
          - "rich" # resposta profunda com detalhes
          - "adequate" # resposta suficiente
          - "shallow" # precisa follow-up
          - "contradicts" # contradiz dados existentes
    - follow_up_needed: true | false
    - follow_up_question: "{se necessario}"
```

**Output:** Respostas capturadas com classificacao de qualidade.

---

### Step 7: Salvar em gap-responses/

**Action:** Persistir respostas em arquivos organizados por modulo.

```yaml
save_responses:
  base_path: "minds/{slug}/01-sources/gap-responses/"

  file_format: "{module}-gaps.md"
  # Ex: identity-gaps.md, mental-model-gaps.md

  content_format: |
    # Gap Responses — {Module Name}
    **Clone:** {nome}
    **Date:** {iso_date}
    **Phase:** 6.5 — Gap Analysis
    **Questions answered:** {N}

    ---

    ## Q1: {pergunta}
    **Target:** {module}.{field}
    **Response:**
    {resposta completa}

    **Quality:** {rich | adequate | shallow}
    **Follow-up:** {se houve}

    ---
    ...
```

**Output:** Arquivos `{module}-gaps.md` em `01-sources/gap-responses/`.

---

### Step 8: Classificar como Tier 0

**Action:** Classificar as respostas do gap analysis como Tier 0 (voz propria, sem filtro editorial).

```yaml
classify_tier:
  tier: 0
  weight: 1.0
  justification: "Respostas diretas da pessoa sendo clonada, direcionadas a gaps especificos"
  update: "sources-inventory (se existir) com novas fontes gap-response"
```

**Output:** Respostas classificadas como Tier 0 no inventario de fontes.

---

### Step 9: Re-extrair MIUs das Respostas

**Action:** Executar extracao parcial de MIUs apenas das respostas do gap analysis.

```yaml
re_extract_mius:
  scope: "APENAS gap-responses/ (nao re-processar fontes ja extraidas)"
  agent: "@innerlens (ou inline se contexto suficiente)"

  process:
    for_each_gap_response:
      - extract_mius: "seguir miu-classification-taxonomy.yaml"
      - tag: "source: gap-response-{module}"
      - confidence: "high (Tier 0 — voz propria)"
      - append_to: "minds/{slug}/02-extraction/mius-valid.yaml"
      - update_count: "manifest.metrics.mius_total"

  quality_check:
    - "Cada resposta deve gerar pelo menos 1 MIU"
    - "Se resposta 'shallow' nao gera MIU: marcar gap como persistente"
```

**Output:** MIUs adicionais extraidos das gap responses.

---

### Step 10: Re-agregar Modulos Afetados

**Action:** Re-executar agregacao APENAS nos modulos que tinham gaps. Nao re-processar modulos que ja estavam acima do threshold.

```yaml
re_aggregate:
  scope: "APENAS modulos identificados no Step 2"

  process:
    for_each_gap_module:
      - load_existing_profile: "minds/{slug}/06-profile/{module}.yaml"
      - load_new_mius: "MIUs extraidos no Step 9 para este modulo"
      - merge: "preencher campos missing com novos dados"
      - update_confidence: "campos que eram low_confidence e agora tem evidencia direta"
      - resolve_contradictions: "se gap response resolveu contradicao, atualizar"
      - save: "sobrescrever minds/{slug}/06-profile/{module}.yaml"
      - add_provenance: "source: 'Phase 6.5, Gap Response, Q-{id}'"

  preserve:
    - "NAO alterar modulos que ja estavam acima do threshold"
    - "NAO remover dados existentes — apenas adicionar/atualizar"
    - "NAO mudar proveniencia de dados que vieram de fases anteriores"
```

**Output:** Modulos POC atualizados com dados das gap responses.

---

### Step 11: Recalcular Completude

**Action:** Recalcular completude de todos os modulos e global.

```yaml
recheck_completeness:
  calculate:
    for_each_module:
      - "campos_preenchidos / campos_required * 100"
    global:
      - "media ponderada dos modulos (weight do layer)"

  decision:
    if_all_above_threshold:
      action: "Fase 6.5 concluida com sucesso"
      next: "Avancar para Fase 7 (Validacao)"
      update_manifest:
        phase_6_5:
          status: "completed"
          completeness_before: "{valor_antes}"
          completeness_after: "{valor_depois}"
          questions_asked: "{N}"
          questions_answered: "{N}"

    if_still_below_threshold:
      iteration_count: "verificar quantas iteracoes ja foram feitas"
      if_iteration_1:
        action: "Executar segunda rodada de gap analysis (Steps 2-11)"
        note: "Gerar novas perguntas APENAS para gaps persistentes"
      if_iteration_2_plus:
        action: "Documentar gaps persistentes e avancar com nota"
        update_manifest:
          phase_6_5:
            status: "completed_with_gaps"
            persistent_gaps: ["{lista de campos ainda faltantes}"]
            justification: "2 iteracoes de gap analysis executadas. Gaps restantes documentados como limitacoes."
        next: "Avancar para Fase 7 com nota de limitacao"

  max_iterations: 2
```

**Output:** Completude recalculada, decisao de avancar ou iterar.

---

## Outputs

| Output | Path | Description |
|--------|------|-------------|
| Gap responses (por modulo) | `minds/{slug}/01-sources/gap-responses/{module}-gaps.md` | Respostas do expert para cada gap |
| MIUs adicionais | `minds/{slug}/02-extraction/mius-valid.yaml` (append) | MIUs extraidos das gap responses |
| Perfil atualizado | `minds/{slug}/06-profile/{module}.yaml` (updated) | Modulos POC com gaps preenchidos |
| Manifest atualizado | `minds/{slug}/manifest.yaml` | Fase 6.5 registrada com metricas |
| Gap analysis log | `minds/{slug}/06-profile/gap-analysis-log.yaml` | Registro de todos os gaps, perguntas e resolucoes |

---

## Validacao

### Gate: Completude POC >= 80%

| Check | Criterio | Acao se Falhar |
|-------|----------|----------------|
| Completude global | >= 80% media ponderada | Iterar (max 2x) ou documentar limitacao |
| Identidade | >= 80% | Pergunta direta sobre turning points / valores |
| Modelo Mental | >= 80% | Pergunta sobre heuristicas e decision pipeline |
| Operacional | >= 70% | Pergunta sobre estilo de comunicacao e ensino |
| Repertorio | >= 70% | Pergunta sobre casos de sucesso e metodologias |
| Framework Visual | >= 60% | Pergunta sobre tese central e metaforas |
| Ecossistema | >= 60% | Pergunta sobre publico-alvo e modelo de negocio |
| Contradicoes | Min 2 items | Revisitar MIUs com tag CONTRADICTION |
| Obsessoes | Min 3 items | Revisitar MIUs com tag OBSESSION |

### Qualidade das Perguntas

- [ ] Nenhuma pergunta generica ("Fale sobre...")
- [ ] Todas as perguntas referenciam evidencia ou gap especifico
- [ ] Perguntas sao abertas (nao sim/nao)
- [ ] Max 10 perguntas por iteracao
- [ ] Min 3 perguntas por iteracao
- [ ] Perguntas cobrindo contradicoes citam fontes especificas

---

## Error Handling

```yaml
error_handling:

  expert_unavailable:
    symptom: "subject_present mudou para false durante a fase"
    action: "Salvar perguntas geradas em gap-analysis-log.yaml para uso futuro"
    fallback: "Documentar gaps como limitacoes conhecidas e avancar"

  shallow_responses:
    symptom: "Respostas curtas que nao geram MIUs"
    action: "Follow-up com 'Pode ir mais fundo? O que ta por tras disso?'"
    max_follow_ups: 2
    fallback: "Marcar campo como 'dados limitados' com confidence baixa"

  contradictory_responses:
    symptom: "Resposta contradiz dado existente de fase anterior"
    action: "Apresentar contradicao ao expert e pedir reconciliacao"
    options:
      1: "Expert confirma resposta nova -> atualizar perfil"
      2: "Expert confirma dado antigo -> manter perfil"
      3: "Ambos sao verdade em contextos diferentes -> registrar como contradicao produtiva"

  no_new_mius:
    symptom: "Gap responses nao geraram MIUs novos"
    action: "Verificar se respostas sao profundas o suficiente"
    fallback: "Usar respostas diretamente para preencher campos POC sem intermediar por MIUs"

  infinite_loop:
    symptom: "Completude nao sobe apos 2 iteracoes"
    action: "STOP — documentar gaps persistentes"
    justification: "Material disponivel e insuficiente para este modulo. Limitacao conhecida."
    next: "Avancar para Fase 7 com nota de limitacao no manifest"
```

---

## Integracao

### Agentes Envolvidos

| Agente | Papel | Quando |
|--------|-------|--------|
| @clone-forge-chief | Executar a task inteira | Sempre |
| @innerlens | Re-extracao de MIUs (Step 9) | Se necessario |
| Expert (humano) | Responder perguntas | Steps 5-6 |

### Dependencias

| Artefato | Path | Obrigatorio |
|----------|------|-------------|
| POC Schema | `agents/clone-forge/data/poc-schema.yaml` | Sim |
| MIU Taxonomy | `agents/clone-forge/data/miu-classification-taxonomy.yaml` | Sim |
| Profile modules | `minds/{slug}/06-profile/*.yaml` | Sim |
| MIUs database | `minds/{slug}/02-extraction/` | Sim |
| Manifest | `minds/{slug}/manifest.yaml` | Sim |

### Fluxo no Pipeline

```
Fase 6 (Agregacao) -> QG-004 FAIL -> Fase 6.5 (esta task) -> QG-004 re-check -> Fase 7 (Validacao)
                    -> QG-004 PASS -> Fase 7 (pula 6.5)
```

---

## Historico de Revisoes

| Versao | Data | Descricao |
|--------|------|-----------|
| 1.0.0 | 2026-03-02 | Criacao inicial — 11 steps, questionario cirurgico com re-extracao parcial |

---

_Task: clone-forge/gap-analysis-questionnaire v1.0.0_
_Phase: 6.5 — Gap Analysis + Questionario de Refinamento_
_Agent: @clone-forge-chief_
_Execution: Interactive_
