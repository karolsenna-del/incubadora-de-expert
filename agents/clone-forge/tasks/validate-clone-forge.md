# Task: Validacao Enhanced do Clone Forge

**Task ID:** clone-forge/validate-clone-forge
**Version:** 1.1.0
**Status:** Production Ready
**Created:** 2026-03-02
**Category:** Quality Assurance
**Execution Type:** Hybrid

---

## Executive Summary

Executa a validacao final do clone antes da geracao do agente. Combina auditoria exhaustiva de rastreabilidade (Layer 2 — verifica CADA elemento critico no draft prompt), 3 smoke tests autonomos (Conhecimento do Dominio, Tomada de Decisao, Resposta a Objecao), scoring de fidelidade em 8 camadas (observable, cognitive, deep identity) e blind test opcional (requer pessoas externas). E o ultimo quality gate bloqueante (QG-005) antes da Fase 8. Tarefa 100% interna ao squad — orquestrada pelo @clone-forge-chief com suporte de @innerlens (consistencia de voz) e @cognitive-motor (consistencia de raciocinio).

---

## Purpose

Um clone que nao foi validado pode parecer bom no papel mas falhar na pratica. Esta task garante que o clone realmente "soa" como o expert — nao apenas contem as informacoes certas, mas as expressa com a voz, o pensamento e os valores corretos. Os smoke tests simulam interacoes reais; o scoring de fidelidade mede precisao em 8 dimensoes; o blind test (quando possivel) e a prova definitiva de autenticidade.

---

## Execution Type

**Hybrid** — Smoke tests e fidelidade scoring sao autonomos. Blind test requer pessoas externas e e opcional mas fortemente recomendado.

- **Autonomo:** Steps 1-3 (dados, draft prompt, auditoria de rastreabilidade)
- **Autonomo:** Steps 4-8 (smoke tests, scoring, relatorios)
- **Externo (humanos):** Step 9 (blind test — requer coordenacao com pessoas que conhecem o expert)
- **Autonomo:** Step 10 (resultados finais)

---

## Inputs

| Parameter | Type | Required | Description | Source |
|-----------|------|----------|-------------|--------|
| `mind_slug` | string | Yes | Slug do clone ativo | manifest.yaml |
| `unified_profile` | files | Yes | Todos os modulos POC | 06-profile/*.yaml |
| `voice_dna` | file | Yes | Voice DNA extraido | 03-dna/voice-dna.yaml |
| `thinking_dna` | file | Yes | Thinking DNA extraido | 03-dna/thinking-dna.yaml |
| `driver_report` | file | No | Driver report (se modo full) | 04-drivers/mind-drivers.yaml |
| `psychometric_synthesis` | file | No | Mapeamento psicometrico | 05-psychometric/ |
| `contradictions` | file | Yes | Paradoxos produtivos | 06-profile/contradictions.yaml |
| `obsessions` | file | Yes | Temas recorrentes | 06-profile/obsessions.yaml |
| `manifest` | file | Yes | Manifest com estado do pipeline | manifest.yaml |

---

## Precondicoes

- [ ] Fase 6 (ou 6.5) concluida — QG-004 PASS
- [ ] Perfil POC completo com completude >= 80% global
- [ ] Voice DNA extraido (03-dna/voice-dna.yaml existe)
- [ ] Thinking DNA extraido (03-dna/thinking-dna.yaml existe)
- [ ] Contradicoes e obsessoes documentadas
- [ ] Manifest atualizado ate Fase 6 (ou 6.5) completa

---

## Steps

### Step 1: Carregar Dados do Perfil + DNA

**Action:** Carregar todos os artefatos necessarios para gerar o system prompt de teste e executar validacao.

```yaml
load_validation_data:
  required:
    - "minds/{slug}/06-profile/identity.yaml"
    - "minds/{slug}/06-profile/mental-model.yaml"
    - "minds/{slug}/06-profile/operational.yaml"
    - "minds/{slug}/06-profile/repertoire.yaml"
    - "minds/{slug}/06-profile/visual-framework.yaml"
    - "minds/{slug}/06-profile/ecosystem.yaml"
    - "minds/{slug}/06-profile/contradictions.yaml"
    - "minds/{slug}/06-profile/obsessions.yaml"
    - "minds/{slug}/03-dna/voice-dna.yaml"
    - "minds/{slug}/03-dna/thinking-dna.yaml"
  optional:
    - "minds/{slug}/04-drivers/mind-drivers.yaml"
    - "minds/{slug}/05-psychometric/psychometric-synthesis.yaml"
```

**Output:** Dados de perfil e DNA carregados em contexto.

---

### Step 2: Gerar System Prompt Draft para Smoke Testing

**Action:** Construir um system prompt preliminar do clone que sera usado nos smoke tests. Este NAO e o system prompt final (que sera gerado na Fase 8), mas uma versao funcional para validacao.

```yaml
generate_draft_prompt:
  sections:
    identity:
      source: "06-profile/identity.yaml"
      include: "core_identity, values, rejections, mission, turning_points"

    voice:
      source: "03-dna/voice-dna.yaml"
      include: "power_words, signature_phrases, never_use, tom, sentence_starters"

    thinking:
      source: "03-dna/thinking-dna.yaml"
      include: "primary_framework, heuristics, decision_pipeline, mental_models"

    knowledge:
      source: "06-profile/repertoire.yaml + mental-model.yaml"
      include: "domain_expertise, methodologies, case_studies, key_concepts"

    boundaries:
      source: "06-profile/identity.yaml → rejections + contradictions.yaml"
      include: "O que rejeitar, anti-patterns, never_use"

  output: "minds/{slug}/07-validation/draft-system-prompt.md"
```

**Output:** System prompt draft salvo para uso nos smoke tests.

---

### Step 3: Auditoria Exhaustiva de Rastreabilidade (Layer 2)

**Action:** Verificar que CADA elemento critico extraido nas fases anteriores esta presente no draft system prompt. Nao e amostra — e verificacao item por item. Inspirado no ETLmaker Layer 2 (auditoria exhaustiva de frameworks, regras e artefatos).

**Logica:** Smoke tests (Steps 4-6) testam se o clone "soa" certo em cenarios. Mas se o draft prompt nem contem os elementos criticos, o smoke test vai falhar por motivos obvios. Layer 2 pega esses gaps ANTES, economizando tempo e dando diagnostico preciso.

```yaml
traceability_audit:
  name: "Exhaustive Traceability Audit"
  agent: "self"
  blocking: true  # Smoke tests so rodam se Layer 2 PASS

  check_1_voice_dna:
    source: "03-dna/voice-dna.yaml"
    verify_in: "07-validation/draft-system-prompt.md"
    items:
      power_words: "CADA power_word presente ou referenciada"
      signature_phrases: "CADA signature_phrase incluida"
      never_use: "CADA never_use word listada nas boundaries"
      tone_dimensions: "Tom descrito e consistente com perfil"
      anti_patterns: "Anti-patterns documentados nas restricoes"
    threshold: "100% power_words + signature_phrases + never_use"

  check_2_thinking_dna:
    source: "03-dna/thinking-dna.yaml"
    verify_in: "07-validation/draft-system-prompt.md"
    items:
      heuristics: "CADA heuristica documentada presente"
      decision_pipeline: "CADA step do pipeline incluido"
      mental_models: "Modelos mentais principais referenciados"
      non_negotiables: "CADA principio inegociavel listado"
      primary_framework: "Framework primario descrito"
    threshold: "100% heuristics + decision_pipeline + non_negotiables"

  check_3_poc_critical_fields:
    source: "06-profile/*.yaml"
    verify_in: "07-validation/draft-system-prompt.md"
    items:
      identity_values: "Valores core presentes"
      identity_rejections: "Rejeicoes explicitas listadas"
      identity_mission: "Missao/proposito descrito"
      operational_conflict_style: "Estilo de conflito informado"
      repertoire_frameworks: "Frameworks do repertorio referenciados"
    threshold: "100% values + rejections + mission"

  check_4_contradictions:
    source: "06-profile/contradictions.yaml"
    verify_in: "07-validation/draft-system-prompt.md"
    items:
      each_paradox: "CADA paradoxo produtivo preservado (nao achatado)"
    threshold: "100% — paradoxos sao identidade, nao bugs"

  check_5_obsessions:
    source: "06-profile/obsessions.yaml"
    verify_in: "07-validation/draft-system-prompt.md"
    items:
      each_obsession: "CADA obsessao (tema 5+ MIUs, 3+ fontes) referenciada"
    threshold: "100%"

  check_6_high_confidence_mius:
    source: "02-extraction/mius.yaml"
    verify_in: "03-dna/*.yaml + 06-profile/*.yaml"
    method: |
      Selecionar top 20 MIUs por confidence (>= 0.8).
      Verificar que CADA um e rastreavel em pelo menos 1 artefato
      downstream (DNA ou POC module). Rastreabilidade e semantica
      (o conceito aparece), nao literal (a frase exata).
    threshold: ">= 90% rastreabilidade (max 2 MIUs sem rastro)"

  output: "minds/{slug}/07-validation/traceability-audit.yaml"

  output_format:
    voice_dna:
      total_items: N
      found_in_prompt: N
      missing: ["..."]
      coverage: "XX.X%"
    thinking_dna:
      total_items: N
      found_in_prompt: N
      missing: ["..."]
      coverage: "XX.X%"
    poc_critical:
      total_items: N
      found_in_prompt: N
      missing: ["..."]
      coverage: "XX.X%"
    contradictions:
      total: N
      preserved: N
      flattened: ["..."]
      coverage: "XX.X%"
    obsessions:
      total: N
      referenced: N
      missing: ["..."]
      coverage: "XX.X%"
    high_confidence_mius:
      sampled: 20
      traceable: N
      untraceable: ["MIU-XXX: descricao"]
      coverage: "XX.X%"
    overall_verdict: "PASS | FAIL"
    critical_missing: ["..."]

  decision:
    PASS:
      criteria: "Voice 100% + Thinking 100% + POC 100% + Contradictions 100% + Obsessions 100% + MIUs >= 90%"
      action: "Prosseguir para smoke tests (Step 4)"
    FAIL:
      criteria: "Qualquer check abaixo do threshold"
      action: "Corrigir draft system prompt ANTES de rodar smoke tests"
      max_retries: 2
      remediation: |
        Para cada item missing, adicionar ao draft system prompt.
        Re-rodar apenas os checks que falharam.
        Se apos 2 tentativas ainda FAIL, escalar ao usuario
        com lista de items irrecuperaveis.
```

**Output:** `minds/{slug}/07-validation/traceability-audit.yaml` com coverage por check.

---

### Step 4: Smoke Test 1 — Conhecimento do Dominio

**Action:** Testar se o clone domina o assunto do expert e se expressa com a voz correta. Protocolo detalhado em `agents/clone-forge/checklists/smoke-test-clone.md` (3 cenarios padronizados).

```yaml
smoke_test_1:
  name: "Conhecimento do Dominio"
  reference_checklist: "agents/clone-forge/checklists/smoke-test-clone.md"
  agent: "@clone-forge-chief (orquestra) + @innerlens (avalia voz)"

  prompt_template: |
    Usando o system prompt draft como persona, responder:
    "Explique {framework_principal} em suas proprias palavras.
     Como voce aplica isso na pratica com seus clientes?"

  validation_criteria:
    - id: ST1-01
      check: "Usa power_words do Voice DNA"
      score: "0-5"
      source: "03-dna/voice-dna.yaml → power_words"

    - id: ST1-02
      check: "Usa signature_phrases"
      score: "0-5"
      source: "03-dna/voice-dna.yaml → signature_phrases"

    - id: ST1-03
      check: "Evita never_use words"
      score: "0-5 (5 = zero violacoes)"
      source: "03-dna/voice-dna.yaml → never_use"

    - id: ST1-04
      check: "Tom consistente com voice_dna"
      score: "0-5"
      source: "03-dna/voice-dna.yaml → tom, estilo"

    - id: ST1-05
      check: "Conteudo factualmente correto no dominio"
      score: "0-5"
      source: "06-profile/repertoire.yaml"

  pass_threshold: "4/5 criterios com score >= 3"
  overall_score: "media dos 5 criterios"
```

**Output:** Score do Smoke Test 1 com detalhamento por criterio.

---

### Step 5: Smoke Test 2 — Tomada de Decisao

**Action:** Testar se o clone pensa como o expert — aplica os frameworks, heuristicas e pipeline de decisao corretos.

```yaml
smoke_test_2:
  name: "Tomada de Decisao"
  agent: "@clone-forge-chief (orquestra) + @cognitive-motor (avalia raciocinio)"

  prompt_template: |
    Usando o system prompt draft como persona, responder:
    "Estou diante de uma decisao: {cenario_real_do_dominio}.
     Devo fazer A ou B? Me ajuda a pensar."

  scenario_generation:
    source: "06-profile/repertoire.yaml → case_studies + methodologies"
    rule: "Usar cenario real do dominio, nao hipotetico generico"
    example: "Devo lancar meu curso com webinar ao vivo ou funil perpetuo?"

  validation_criteria:
    - id: ST2-01
      check: "Aplica heuristica documentada do Thinking DNA"
      score: "0-5"
      source: "03-dna/thinking-dna.yaml → heuristics"

    - id: ST2-02
      check: "Segue decision_pipeline"
      score: "0-5"
      source: "03-dna/thinking-dna.yaml → decision_pipeline"

    - id: ST2-03
      check: "Usa framework para estruturar resposta"
      score: "0-5"
      source: "03-dna/thinking-dna.yaml → primary_framework"

    - id: ST2-04
      check: "Responde com conviccao (nao fica em cima do muro)"
      score: "0-5"
      source: "06-profile/identity.yaml → values"

    - id: ST2-05
      check: "Rejeita opcao errada com justificativa clara"
      score: "0-5"
      source: "06-profile/operational.yaml → conflict_style"

  pass_threshold: "4/5 criterios com score >= 3"
  overall_score: "media dos 5 criterios"
```

**Output:** Score do Smoke Test 2 com detalhamento por criterio.

---

### Step 6: Smoke Test 3 — Resposta a Objecao

**Action:** Testar se o clone mantem autenticidade e conviccao quando desafiado — sem agressividade, com firmeza.

```yaml
smoke_test_3:
  name: "Resposta a Objecao"
  agent: "@clone-forge-chief (orquestra) + @innerlens (voz) + @cognitive-motor (conviccao)"

  prompt_template: |
    Usando o system prompt draft como persona, responder:
    "Discordo completamente: {objecao_comum_ao_metodo}.
     Isso nao funciona mais no mercado atual. O que voce tem a dizer?"

  objection_generation:
    source: "06-profile/identity.yaml → rejections + operational.yaml → conflict_style"
    rule: "Usar objecao real que o expert ja enfrentou (se disponivel nos MIUs)"
    example: "Esse negocio de proposito e muito bonito, mas no final o que importa e faturamento."

  validation_criteria:
    - id: ST3-01
      check: "Reconhece a objecao (nao ignora nem desqualifica)"
      score: "0-5"

    - id: ST3-02
      check: "Usa resposta documentada ou consistente com objection handling do DNA"
      score: "0-5"
      source: "03-dna/thinking-dna.yaml + operational.yaml"

    - id: ST3-03
      check: "Mantem conviccao sem agressividade"
      score: "0-5"
      source: "06-profile/identity.yaml → values"

    - id: ST3-04
      check: "Parece resposta real do expert (nao generica)"
      score: "0-5"
      source: "03-dna/voice-dna.yaml → signature_phrases, power_words"

    - id: ST3-05
      check: "Usa exemplo ou historia para sustentar"
      score: "0-5"
      source: "06-profile/repertoire.yaml → case_studies"

  pass_threshold: "4/5 criterios com score >= 3"
  overall_score: "media dos 5 criterios"
```

**Output:** Score do Smoke Test 3 com detalhamento por criterio.

---

### Step 7: Score de Fidelidade (8 Camadas)

**Action:** Avaliar cada uma das 8 camadas de fidelidade com scores de 1 a 5, usando pesos diferentes por categoria. Delega execucao detalhada para `tasks/fidelity-score.md` (carrega criterios maduros de `data/clone-validation.yaml`).

```yaml
fidelity_scoring:
  delegate_to: "agents/clone-forge/tasks/fidelity-score.md"
  loads_data: "agents/clone-forge/data/clone-validation.yaml"
  reference_checklist: "agents/clone-forge/checklists/clone-forge-validation.md"

  layers:
    observable_layers:
      weight: 0.8
      items:
        - name: "Padroes Comportamentais"
          check: "O clone age como o expert agiria? Rejeita o que rejeitaria?"
          score: "1-5"
          evidence_from: "06-profile/operational.yaml + identity.yaml"

        - name: "Estilo de Comunicacao"
          check: "Tom, vocabulario, estrutura de frase, metaforas corretas?"
          score: "1-5"
          evidence_from: "03-dna/voice-dna.yaml"

        - name: "Rotinas e Habitos"
          check: "Padroes de trabalho, ferramentas, preferencias corretas?"
          score: "1-5"
          evidence_from: "06-profile/operational.yaml"

        - name: "Padroes de Reconhecimento"
          check: "O que o clone nota PRIMEIRO numa situacao? Coerente com expert?"
          score: "1-5"
          evidence_from: "06-profile/mental-model.yaml"

    cognitive_layer:
      weight: 1.0
      items:
        - name: "Modelos Mentais"
          check: "Frameworks corretos aplicados corretamente? Heuristicas no momento certo?"
          score: "1-5"
          evidence_from: "03-dna/thinking-dna.yaml + 06-profile/mental-model.yaml"

    deep_identity_layers:
      weight: 1.0
      items:
        - name: "Hierarquia de Valores"
          check: "Prioriza o que o expert priorizaria?"
          score: "1-5"
          evidence_from: "06-profile/identity.yaml → values"

        - name: "Obsessoes Core"
          check: "Retorna aos temas recorrentes do expert?"
          score: "1-5"
          evidence_from: "06-profile/obsessions.yaml"

        - name: "Paradoxos Produtivos"
          check: "Mantem as contradicoes autenticas sem forcar resolucao?"
          score: "1-5"
          evidence_from: "06-profile/contradictions.yaml"

  calculation: |
    Observable = (comportamental + comunicacao + rotinas + reconhecimento) * 0.8 / 4
    Cognitive = modelos_mentais * 1.0
    Deep = (valores + obsessoes + paradoxos) * 1.0 / 3

    Fidelidade = (Observable + Cognitive + Deep) / 3 * 20  # Escala 0-100
```

**Output:** Score de fidelidade por camada e global (0-100%).

---

### Step 8: Calcular Fidelidade Global

**Action:** Consolidar todos os scores e determinar o resultado.

```yaml
calculate_overall:
  smoke_tests:
    st1_score: "{media 5 criterios}"
    st2_score: "{media 5 criterios}"
    st3_score: "{media 5 criterios}"
    smoke_pass: "{N}/3 passaram (threshold: 4/5 criterios >= 3)"

  fidelity:
    observable: "{score ponderado}"
    cognitive: "{score}"
    deep_identity: "{score ponderado}"
    overall_percentage: "{0-100%}"

  generate_reports:
    - file: "minds/{slug}/07-validation/smoke-test-results.yaml"
      content: "Detalhamento dos 3 smoke tests com scores por criterio"

    - file: "minds/{slug}/07-validation/fidelity-score.yaml"
      content: "Score de fidelidade por camada e global"

    - file: "minds/{slug}/07-validation/quality-dashboard.md"
      template: "agents/clone-forge/templates/quality-dashboard-360-tmpl.md"
      content: "Dashboard visual com todos os resultados consolidados"
```

**Output:** 3 arquivos de validacao gerados em `07-validation/`.

---

### Step 9: Blind Test (Opcional)

**Action:** Se possivel, preparar material para blind test com pessoas que conhecem o expert.

```yaml
blind_test:
  condition: "Opcional — fortemente recomendado se expert tem audiencia acessivel"

  preparation:
    - "Selecionar 3 topicos variados (tecnico, opiniao, historia)"
    - "Gerar 3 respostas do clone (usando draft system prompt)"
    - "Obter 3 respostas reais do expert (dos MIUs ou fontes Tier 0)"
    - "Misturar as 6 respostas sem identificar qual e qual"
    - "Preparar instrucoes para testadores"

  instructions_template: |
    BLIND TEST — Clone {nome}
    ==========================
    Abaixo estao 6 respostas sobre temas variados.
    Algumas foram escritas pelo(a) {nome}, outras por uma IA.

    Para cada resposta, indique:
    - "REAL" se acha que foi o(a) {nome} quem escreveu
    - "IA" se acha que foi gerado por inteligencia artificial

    Resposta 1: [...]
    Sua avaliacao: [ REAL / IA ]
    ...

  result_threshold:
    pass: "Testadores acertam >= 70% das atribuicoes ao expert"
    fail: "Testadores acertam < 70% — clone nao esta convincente"

  if_not_possible:
    action: "Documentar como PENDING no relatorio"
    note: "Blind test nao executado. Validacao baseada em smoke tests + fidelidade scoring."
    proceed: true # nao bloqueia
```

**Output:** Material para blind test preparado OU documentado como PENDING.

---

### Step 10: Gerar Resultados Finais

**Action:** Consolidar todos os resultados e tomar decisao final.

```yaml
final_results:
  generate:
    - file: "minds/{slug}/07-validation/validation-summary.yaml"
      content:
        smoke_tests:
          test_1: "{PASS/FAIL} — {score}"
          test_2: "{PASS/FAIL} — {score}"
          test_3: "{PASS/FAIL} — {score}"
          overall: "{N}/3 PASS"
        fidelity:
          observable: "{score}"
          cognitive: "{score}"
          deep_identity: "{score}"
          overall: "{percentage}%"
        blind_test: "{PASS/FAIL/PENDING}"
        final_verdict: "{PASS/CONDITIONAL/FAIL}"

  decision_matrix:
    PASS:
      criteria: "Smoke 3/3 + fidelidade >= 80%"
      action: "Clone aprovado — avancar para Fase 8 (Geracao de Agente)"
      update_manifest:
        phase_7:
          status: "completed"
          gate_result: "GO"

    CONDITIONAL:
      criteria: "Smoke 2/3 OU fidelidade 70-79%"
      action: "Refinar DNA especifico + re-testar (max 2 tentativas)"
      remediation:
        if_voice_weak: "Voltar para Fase 3 (DNA) com foco em Voice"
        if_thinking_weak: "Voltar para Fase 4 (Drivers) + Fase 2 (MIUs de heuristicas)"
        if_values_weak: "Voltar para Fase 6 (Identidade module)"
      max_retries: 2
      update_manifest:
        phase_7:
          status: "needs_refinement"
          gate_result: "CONDITIONAL"

    FAIL:
      criteria: "Smoke < 2/3 OU fidelidade < 70%"
      action: "BLOQUEAR — revisar pipeline desde a fase que produziu dados fracos"
      escalation: "Escalar ao usuario com diagnostico claro"
      update_manifest:
        phase_7:
          status: "failed"
          gate_result: "NO_GO"
```

**Output:** Decisao final (PASS/CONDITIONAL/FAIL) com proximo passo.

---

## Outputs

| Output | Path | Description |
|--------|------|-------------|
| Draft system prompt | `minds/{slug}/07-validation/draft-system-prompt.md` | System prompt usado nos smoke tests |
| Traceability audit | `minds/{slug}/07-validation/traceability-audit.yaml` | Auditoria exhaustiva Layer 2 — coverage por check |
| Smoke test results | `minds/{slug}/07-validation/smoke-test-results.yaml` | Detalhamento dos 3 smoke tests |
| Fidelity score | `minds/{slug}/07-validation/fidelity-score.yaml` | Score de fidelidade por camada e global |
| Quality dashboard | `minds/{slug}/07-validation/quality-dashboard.md` | Dashboard visual consolidado |
| Validation summary | `minds/{slug}/07-validation/validation-summary.yaml` | Resultado final com decisao |
| Manifest atualizado | `minds/{slug}/manifest.yaml` | Fase 7 registrada |

---

## Validacao

### Blocking Gate: QG-005 CLONE_VALIDATION

| Check | Criterio de Aprovacao | Acao se Falhar |
|-------|----------------------|----------------|
| Traceability audit | Layer 2 PASS (100% DNA + POC + 90% MIUs) | Corrigir draft prompt antes dos smoke tests |
| Smoke tests | 3/3 passaram (4/5 criterios >= 3 cada) | Retornar a Fase 3 (DNA) para ajuste |
| Fidelidade score | >= 80% global | Identificar dimensoes fracas e iterar |
| Blind test | >= 70% atribuicao correta (se executado) | Refinar voice DNA e heuristicas |
| Consistencia interna | Clone nao se contradiz de forma nao-documentada | Reconciliar com contradictions.yaml |

### Checklist Formal

Referencia: `agents/clone-forge/checklists/clone-forge-validation.md` (21 items)

---

## Error Handling

```yaml
error_handling:

  traceability_audit_fail:
    symptom: "Um ou mais checks da Layer 2 abaixo do threshold"
    diagnosis:
      voice_missing: "Power words ou signature phrases ausentes do draft prompt"
      thinking_missing: "Heuristicas ou decision pipeline ausentes"
      poc_missing: "Valores, rejeicoes ou missao nao representados"
      contradictions_flattened: "Paradoxos foram resolvidos/achatados ao inves de preservados"
      obsessions_missing: "Temas obsessivos do expert nao referenciados"
      mius_untraceable: "MIUs de alta confianca nao rastreaveis em DNA/POC"
    action: "Corrigir draft system prompt adicionando items faltantes. Re-rodar checks falhados."
    max_retries: 2
    note: "NAO avancar para smoke tests enquanto Layer 2 nao PASS"

  smoke_test_fail:
    symptom: "Um ou mais smoke tests nao atingem threshold"
    diagnosis:
      st1_fail: "Voice DNA fraco — clone nao soa como expert"
      st2_fail: "Thinking DNA fraco — clone nao pensa como expert"
      st3_fail: "Valores/conviccao fracos — clone nao defende como expert"
    action: "Identificar QUAL dimensao falhou e retornar a fase relevante"
    max_retries: 2

  fidelity_below_threshold:
    symptom: "Score global < 80%"
    action: "Identificar camadas com score < 3/5"
    remediation:
      observable_weak: "Revisitar Fase 3 (DNA) — Voice DNA precisa de ajuste"
      cognitive_weak: "Revisitar Fase 2 (MIUs) + Fase 4 (Drivers) — frameworks insuficientes"
      deep_weak: "Revisitar Fase 6 (Profile) — valores e obsessoes nao capturados"

  blind_test_fail:
    symptom: "Testadores acertam < 70%"
    action: "Analisar QUAIS respostas foram identificadas como IA"
    common_issues:
      - "Vocabulario muito formal (ajustar voice DNA)"
      - "Resposta muito estruturada (humanos sao mais organicos)"
      - "Falta de exemplos pessoais (adicionar mais storytelling)"
    note: "Blind test fail nao bloqueia se smoke tests + fidelidade passam"

  missing_profile_data:
    symptom: "Arquivos de perfil ou DNA nao encontrados"
    action: "Verificar se Fase 6 realmente completou"
    fallback: "Retornar ao pipeline e completar fases pendentes"
```

---

## Integracao

### Agentes Envolvidos

| Agente | Papel | Steps |
|--------|-------|-------|
| @clone-forge-chief | Orquestracao, geracao de prompts, smoke tests, consolidacao | Todos |
| @innerlens | Avaliacao de consistencia de voz nos smoke tests | 4, 6 |
| @cognitive-motor | Avaliacao de consistencia de raciocinio nos smoke tests | 5, 6 |
| Humanos externos (opcional) | Blind test | 9 |

### Dependencias

| Artefato | Path | Obrigatorio |
|----------|------|-------------|
| Validation checklist | `agents/clone-forge/checklists/clone-forge-validation.md` | Sim |
| Smoke test checklist | `agents/clone-forge/checklists/smoke-test-clone.md` | Sim |
| Fidelity score task | `agents/clone-forge/tasks/fidelity-score.md` | Sim |
| Validate clone task | `agents/clone-forge/tasks/validate-clone.md` | Sim |
| Clone validation criteria | `agents/clone-forge/data/clone-validation.yaml` | Sim |
| Clone anti-patterns | `agents/clone-forge/data/clone-anti-patterns.yaml` | Sim |
| Output examples (referencia) | `agents/clone-forge/data/output-examples.yaml` | Sim |
| Quality dashboard template | `agents/clone-forge/templates/quality-dashboard-360-tmpl.md` | Sim |
| Voice DNA | `minds/{slug}/03-dna/voice-dna.yaml` | Sim |
| Thinking DNA | `minds/{slug}/03-dna/thinking-dna.yaml` | Sim |
| Profile modules | `minds/{slug}/06-profile/*.yaml` | Sim |

### Fluxo no Pipeline

```
Fase 6/6.5 (Perfil completo) -> Fase 7 (esta task) -> QG-005
  QG-005 PASS -> Fase 8 (Geracao de Agente)
  QG-005 CONDITIONAL -> Refinar + Re-validar (max 2x)
  QG-005 FAIL -> Retornar a fase relevante
```

---

## Historico de Revisoes

| Versao | Data | Descricao |
|--------|------|-----------|
| 1.0.0 | 2026-03-02 | Criacao inicial — 10 steps, 3 smoke tests, 8-layer fidelity, blind test, integrity check |
| 1.1.0 | 2026-03-23 | Layer 2 Traceability Audit — novo Step 3 com 6 checks exhaustivos (Voice DNA, Thinking DNA, POC, Contradictions, Obsessions, MIUs). Blocking antes dos smoke tests. Inspirado no ETLmaker v3.0 Layer 2. Steps renumerados (10→11) |

---

_Task: clone-forge/validate-clone-forge v2.0.0_
_Phase: 7 — Validacao Enhanced_
_Agents: @clone-forge-chief + @innerlens + @cognitive-motor_
_Execution: Hybrid_
