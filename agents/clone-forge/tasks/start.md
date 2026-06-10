# Task: Start — Entry Point do Clone Forge Pipeline

**Task ID:** clone-forge/start
**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-03-02
**Category:** Pipeline Orchestration
**Execution Type:** Interactive

---

## Executive Summary

Entry point do pipeline Clone Forge. Recebe o comando do usuario, cria a estrutura de diretorios do mind, inicializa o manifest, determina o modo (full/quick), verifica se a pessoa sendo clonada esta presente, e inicia o pipeline. E a unica task que o usuario chama diretamente — todas as outras sao invocadas sequencialmente pelo pipeline.

---

## Purpose

O pipeline Clone Forge tem 11 fases, 5 quality gates e 4 agentes. Sem um entry point bem definido, o usuario teria que entender toda essa complexidade para comecar. Esta task abstrai tudo: o usuario diz "quero clonar o fulano" e o pipeline cuida do resto. Tambem garante que a estrutura de dados existe antes de qualquer fase comecar, e que o manifest rastreia tudo desde o inicio.

O squad e self-contained — nao requer outros squads instalados. A task valida apenas dependencias internas (templates, schemas, taxonomias do proprio Clone Forge).

---

## Execution Type

**Interactive (60% Human, 40% Agent)**

- **Papel do Human:** Fornecer nome, dominio, modo, caminhos de conteudo, disponibilidade do sujeito
- **Papel do Agent:** Gerar slug, detectar brownfield, criar estrutura, inicializar manifest, selecionar workflow, validar dependencias
- **Runtime Estimado:** 3-5 minutos

---

## Inputs

### Inputs Obrigatorios

```yaml
mind_name:
  field: "Nome completo da pessoa a ser clonada"
  format: "string"
  required: true
  example: "Roberto Carvalho"
  notes: "Nome real, nao apelido. Usado para gerar slug e preencher manifest."

domain:
  field: "Area de expertise principal"
  format: "string"
  required: true
  example: "Marketing Digital + IA + Proposito"
  notes: "Dominio principal. Pode conter multiplas areas separadas por +"
```

### Inputs Opcionais

```yaml
mode:
  field: "Modo do pipeline"
  format: "string (full | quick)"
  required: false
  default: "full"
  notes: "full = 11 fases (8-14h). quick = 7 fases (2-4h). Flag --quick ativa quick."

sources_path:
  field: "Caminho para conteudo local ja existente"
  format: "path"
  required: false
  example: "~/Downloads/expert-content/"
  notes: "Se fornecido, Fase 0 (ingest-local-content) inicia automaticamente."

subject_present:
  field: "A pessoa sendo clonada esta disponivel para entrevista?"
  format: "boolean (true | false)"
  required: false
  default: false
  notes: "Se true, Fase 1.5 (entrevista profunda) sera ativada quando fontes forem insuficientes."

formal_assessments:
  field: "Lista de assessments formais disponiveis"
  format: "list of strings"
  required: false
  example: ["zona-genialidade"]
  notes: "Integrados na Fase 5 (mapeamento psicometrico). Sobrescreve estimativas."
```

**Command Format:**

```
*clone-forge {name} --domain "{area}" [--quick] [--subject-present] [--content-path "{path}"]
```

**Natural Language:**

```
"Quero clonar o Roberto Carvalho na area de marketing digital"
"Clona o expert Joao Silva, dominio automacao com IA, modo rapido"
"Preciso de um clone da Lisiane, ela ta aqui pra entrevista"
```

---

## Precondicoes

- [ ] `agents/clone-forge/templates/manifest-tmpl.yaml` acessivel e valido
- [ ] `agents/clone-forge/workflows/wf-clone-forge-full.yaml` acessivel
- [ ] `agents/clone-forge/workflows/wf-clone-forge-quick.yaml` acessivel
- [ ] `agents/clone-forge/data/` com poc-schema.yaml, miu-classification-taxonomy.yaml, source-type-handlers.yaml, driver-catalog.yaml
- [ ] Diretorio `agents/clone-forge/minds/` existe (ou sera criado)

---

## Steps

### Step 0.5: Display Greeting

```
=== CLONE FORGE ===
Agente Auroq | Criado por Euriler Jube
Usado por ele e pela Mentoria Arcane

Nao e chatbot — e clonagem cognitiva de alta fidelidade.
11 fases que transformam conteudo de uma pessoa real em um clone
digital com voz, pensamento e estilo preservados.

O que posso fazer:

1. Clonar pessoa — pipeline completo (11 fases) ou rapido (7 fases)
2. Atualizar clone — ajustar DNA, voz, comportamento ou KB
3. Consertar clone — diagnosticar fidelidade e corrigir desvios
4. Retomar clone — continuar pipeline pausado
5. Ver status — checar progresso

Quem voce quer clonar?
```

**Roteamento:**
- Se opcao 1 ou nome de pessoa → seguir Step 1 (parsear comando)
- Se opcao 2 (Atualizar) → listar clones existentes em `agents/clone-forge/minds/` e perguntar qual quer modificar
- Se opcao 3 (Consertar) → listar clones existentes em `agents/clone-forge/minds/` e executar diagnostico de fidelidade
- Se opcao 4 → carregar .state.json e executar `*resume`
- Se opcao 5 → executar `*status`

### Step 1: Parsear Comando

**Action:** Extrair parametros do comando ou linguagem natural do usuario.

```yaml
parse_command:
  from_command:
    pattern: "*clone-forge {name} --domain \"{domain}\" [--quick] [--subject-present] [--content-path \"{path}\"]"
    extract:
      name: "string — nome completo do expert"
      domain: "string — area de expertise"
      quick: "boolean — modo rapido (default: false)"
      subject_present: "boolean — pessoa disponivel (default: false)"
      content_path: "string | null — caminho do conteudo"

  from_natural_language:
    examples:
      - input: "Quero clonar o Roberto na area de marketing digital"
        parsed: { name: "Roberto", domain: "marketing digital", quick: false, subject_present: false }
      - input: "Clone rapido do Joao Silva, dominio automacao com IA"
        parsed: { name: "Joao Silva", domain: "automacao com IA", quick: true, subject_present: false }
      - input: "Clona a Lisiane, ela ta aqui, area de coaching"
        parsed: { name: "Lisiane", domain: "coaching", subject_present: true }

  validation:
    name_required: true
    domain_required: true
    if_missing:
      name: "Perguntar: 'Quem vamos clonar? Nome completo.'"
      domain: "Perguntar: 'Qual a area de expertise? Ex: marketing digital, psicologia, coaching'"
```

**Output:** Parametros parseados e validados.

---

### Step 2: Gerar mind_slug

**Action:** Converter o nome em slug (snake_case, lowercase, sem acentos).

```yaml
generate_slug:
  input: "{name}"
  transform:
    - lowercase
    - remove_accents
    - replace_spaces_with_underscore
    - remove_special_chars
    - remove_articles_prepositions  # de, da, do, e
    - max_30_chars
    - trim

  examples:
    - "Roberto Carvalho" -> "roberto_carvalho"
    - "Maria Jose da Silva" -> "maria_jose_silva"
    - "Dr. Joao Pedro" -> "dr_joao_pedro"
    - "Ana Beatriz Lima" -> "ana_beatriz_lima"

  confirm_with_user:
    prompt: |
      Slug gerado: {mind_slug}
      (usado como identificador em todo o pipeline)
      Ta ok ou quer mudar? (enter = aceitar)
    type: "confirmation_or_override"
    default: "aceitar"
```

**Output:** `mind_slug` gerado e confirmado.

---

### Step 3: Verificar se Mind Ja Existe (Brownfield Check)

**Action:** Checar se ja existe um clone anterior para este expert.

```yaml
brownfield_check:
  check_path: "agents/clone-forge/minds/{mind_slug}/"

  if_exists:
    load_manifest: "minds/{mind_slug}/manifest.yaml"
    identify:
      - last_completed_phase: "{N}"
      - current_status: "{status}"
      - progress_percentage: "{%}"
      - fidelity_if_complete: "{score}"

    if_manifest_complete:
      message: |
        Ja existe um clone completo de {name}.
        Status: {status}
        Fidelidade: {fidelity_score}%
        Concluido em: {completed_at}

        O que voce quer fazer?
        1. Ver status detalhado (*status)
        2. Atualizar com novo conteudo (*resume)
        3. Recomecar do zero (backup + recria)
      wait_for_input: true

    if_manifest_incomplete:
      message: |
        Existe um clone em andamento de {name}.
        Parado na Fase {current_phase}: {current_phase_name}
        Progresso: {X}%
        Iniciado em: {created_at}

        O que voce quer fazer?
        1. Retomar de onde parou (*resume) [recomendado]
        2. Recomecar do zero (backup + recria)
        3. Cancelar
      wait_for_input: true

    if_user_chooses_restart:
      action: "Mover minds/{mind_slug}/ para minds/{mind_slug}_backup_{timestamp}/"
      note: "NUNCA deletar — sempre backup"

  if_not_exists:
    action: "Prosseguir para Step 4"
```

**Output:** Decisao de criar novo ou retomar existente.

---

### Step 4: Criar Estrutura de Diretorios

**Action:** Criar a arvore completa de diretorios para o novo mind.

```yaml
create_directory_structure:
  base_path: "agents/clone-forge/minds/{mind_slug}/"

  directories:
    - "01-sources/"
    - "01-sources/transcripts/"
    - "01-sources/interview/"
    - "01-sources/gap-responses/"
    - "01-sources/raw/"
    - "02-extraction/"
    - "03-dna/"
    - "04-drivers/"
    - "05-psychometric/"
    - "06-profile/"
    - "07-validation/"
    - "08-agent/"

  quick_mode_note: |
    No modo quick, ainda cria todos os diretorios mas Fases 2, 4, 5
    sao puladas. Diretorios ficam vazios e podem ser preenchidos
    depois com upgrade para modo full.

  verify: "Todos os 12 diretorios criados com sucesso"

  output_to_user: |
    Estrutura criada: agents/clone-forge/minds/{mind_slug}/
      01-sources/  (raw, transcripts, interview, gap-responses)
      02-extraction/
      03-dna/
      04-drivers/
      05-psychometric/
      06-profile/
      07-validation/
      08-agent/
```

**Output:** Estrutura de diretorios criada.

---

### Step 5: Inicializar Manifest

**Action:** Gerar `manifest.yaml` a partir do template com dados iniciais.

```yaml
initialize_manifest:
  template: "agents/clone-forge/templates/manifest-tmpl.yaml"
  output: "agents/clone-forge/minds/{mind_slug}/manifest.yaml"

  populate:
    mind_name: "{name}"
    mind_slug: "{mind_slug}"
    domain: "{domain}"
    created_at: "{iso_date}"
    updated_at: "{iso_date}"
    created_by: "clone-forge-chief"
    status: "in_progress"
    current_phase: 0
    current_phase_name: "Ingestao de Conteudo"

    config:
      mode: "{full | quick}"
      subject_present: "{true | false}"
      auto_acquire_sources: true
      formal_assessments: "{lista ou vazia}"

    phases: "Copiar do template, todas pending"
    metrics: "Copiar do template, tudo zerado"

  quick_mode_adjustments:
    - "phase 2 → status: skipped, skipped_reason: 'Quick mode — sem MIU extraction'"
    - "phase 4 → status: skipped, skipped_reason: 'Quick mode — sem driver inference'"
    - "phase 5 → status: skipped, skipped_reason: 'Quick mode — sem psychometric mapping'"

  validation:
    - "YAML e valido (parseable)"
    - "Todos os campos obrigatorios preenchidos"
    - "mind_slug bate com o nome do diretorio"
    - "mode e um dos valores validos (full | quick)"
```

**Output:** `manifest.yaml` criado e populado.

---

### Step 6: Elicitacao — Confirmar Detalhes

**Action:** Confirmar modo, disponibilidade e conteudo com o usuario antes de iniciar o pipeline.

```yaml
elicitation:
  if_mode_not_provided:
    ask: |
      Modo do pipeline:
      1. Completo (11 fases, 8-14h) — profundidade maxima [recomendado]
      2. Rapido (7 fases, 2-4h) — funcional mas sem drivers/psicometria

      Qual?
    default: 1
    processing:
      "1" | "a" | "completo" | "full" | default: mode = "full"
      "2" | "b" | "rapido" | "quick": mode = "quick"

  if_subject_not_indicated:
    ask: |
      A pessoa sendo clonada ({name}) esta disponivel pra entrevista?
      1. Sim — pode responder perguntas agora ou depois
      2. Nao — vamos trabalhar so com o conteudo existente

      Isso afeta Fases 1.5 (Entrevista) e 6.5 (Gap Analysis).
    default: 2
    processing:
      "1" | "sim" | "s": subject_present = true
      "2" | "nao" | "n" | default: subject_present = false

  if_content_path_not_provided:
    ask: |
      Onde esta o conteudo existente de {name}?
      - Caminho local (ex: ~/Downloads/conteudo-expert/)
      - URLs de videos/posts
      - "Nao tenho" (vamos precisar de entrevista)

  confirm_all:
    message: |
      Confirmando:
      Expert: {name}
      Dominio: {domain}
      Slug: {mind_slug}
      Modo: {full | quick}
      Pessoa disponivel: {sim | nao}
      Conteudo: {path | "nenhum"}

      Isso ta certo? Posso comecar?
    wait_for_confirmation: true
```

**Output:** Parametros confirmados pelo usuario.

---

### Step 7: Determinar Pipeline Path

**Action:** Com base no modo e disponibilidade, definir quais fases serao executadas.

```yaml
determine_pipeline:
  full_mode:
    phases: [0, 1, 1.5, 2, 3, 4, 5, 6, 6.5, 7, 8]
    description: "Pipeline completo de 11 fases"
    estimated_time: "8-14 horas"
    quality_gates: ["QG-001", "QG-002", "QG-003", "QG-004", "QG-005"]
    note: "Pausavel por fase — pode levar dias se necessario"

  quick_mode:
    phases: [0, 1, 3, 6, 7, 8]
    skipped: [1.5, 2, 4, 5, 6.5]
    description: "Pipeline rapido de 6 fases"
    estimated_time: "2-4 horas"
    quality_gates: ["QG-001", "QG-003", "QG-004", "QG-005"]
    note: "Sem MIUs, drivers, psicometria ou gap analysis. Upgrade posterior com *resume --full"
    skip_reasons:
      phase_1_5: "Modo quick nao inclui entrevista profunda"
      phase_2: "Modo quick nao inclui extracao de MIUs"
      phase_4: "Modo quick nao inclui inferencia de drivers"
      phase_5: "Modo quick nao inclui mapeamento psicometrico"
      phase_6_5: "Modo quick nao inclui gap analysis"

  conditional_phases:
    phase_1_5:
      condition: "subject_present AND (source_coverage < 0.8 OR tier_0_count < 2)"
      if_skip: "skipped_reason: 'Pessoa nao disponivel' OU 'Fontes suficientes'"

    phase_6_5:
      condition: "completeness < 0.8 AND subject_present"
      if_skip: "skipped_reason: 'Perfil completo' OU 'Pessoa nao disponivel'"

  update_manifest:
    - "Marcar fases puladas com status: 'skipped' e skipped_reason"
    - "Atualizar config.mode com modo selecionado"
```

**Output:** Pipeline path definido com fases ativas e puladas.

---

### Step 8: Registrar Disponibilidade do Expert

**Action:** Se `subject_present: true`, marcar no manifest e habilitar fases condicionais.

```yaml
register_subject:
  if_subject_present:
    update_manifest:
      config:
        subject_present: true
    enable_phases:
      - phase_1_5: "Entrevista Profunda habilitada (condicional)"
      - phase_6_5: "Gap Analysis habilitado (condicional)"
    note: |
      Pessoa disponivel. Fases 1.5 (Entrevista) e 6.5 (Gap Analysis)
      ativadas condicionalmente — so executam se criterios forem atendidos.

  if_not_present:
    update_manifest:
      config:
        subject_present: false
    skip_phases:
      - phase_1_5:
          status: "skipped"
          skipped_reason: "Pessoa nao disponivel para entrevista"
      - phase_6_5:
          status: "skipped"
          skipped_reason: "Pessoa nao disponivel para gap analysis"
    note: |
      Pessoa nao disponivel. Fases 1.5 e 6.5 desativadas.
      Clone sera baseado exclusivamente em conteudo existente.
      Pode ativar depois com *resume --subject-present.
```

**Output:** Manifest atualizado com disponibilidade do expert.

---

### Step 9: Validar Dependencias Internas

**Action:** Verificar que os arquivos internos do Clone Forge estao todos presentes. O squad e self-contained — nao depende de outros squads.

```yaml
dependency_validation:
  optional:
    - name: "Zona Genialidade"
      check_path: "agents/zona-genialidade/"
      on_missing: |
        AVISO: Squad Zona Genialidade nao encontrado.
        Sem ele, Fase 5 (psicometria) usara apenas estimativas.
        Nao e bloqueante — pipeline continua normalmente.
      severity: "warning"

  internal:
    - name: "source-type-handlers.yaml"
      check_path: "agents/clone-forge/data/source-type-handlers.yaml"
      severity: "blocking"
    - name: "manifest template"
      check_path: "agents/clone-forge/templates/manifest-tmpl.yaml"
      severity: "blocking"
    - name: "miu taxonomy"
      check_path: "agents/clone-forge/data/miu-classification-taxonomy.yaml"
      severity: "blocking"
    - name: "poc schema"
      check_path: "agents/clone-forge/data/poc-schema.yaml"
      severity: "blocking"
    - name: "driver catalog"
      check_path: "agents/clone-forge/data/driver-catalog.yaml"
      severity: "blocking"

  if_blocking_missing:
    action: |
      Pipeline BLOQUEADO.
      Arquivo interno faltando: {nome}
      Caminho esperado: {path}
      Reinstale o squad Clone Forge — pode ter havido corrupcao na copia.
    status: "failed"
```

**Output:** Dependencias validadas ou pipeline bloqueado.

---

### Step 10: Iniciar Pipeline e Mostrar Overview

**Action:** Iniciar a primeira fase do pipeline e apresentar visao geral ao usuario.

```yaml
start_pipeline:
  # Determinar primeira fase
  if_content_path_provided:
    start_phase: 0
    task: "tasks/ingest-local-content.md"
    message_prefix: "Conteudo local fornecido. Iniciando Fase 0: Ingestao."

  if_no_content:
    elicit: true
    prompt: |
      Voce nao indicou conteudo local. O que prefere?
      1. Fornecer conteudo agora (me passa o caminho)
      2. Pular pra Fase 1 (coleta direto)

    on_1: "Carregar ingest-local-content.md"
    on_2: "Pular Fase 0, iniciar Fase 1 (collect-and-merge-sources)"

  # Atualizar manifest
  update_manifest:
    status: "in_progress"
    current_phase: "{0 | 1}"
    current_phase_name: "{Ingestao de Conteudo | Coleta e Validacao de Fontes}"
    "phases[{N}]":
      status: "in_progress"
      started_at: "{iso_date}"

  # Salvar .state.json
  save_state:
    file: "agents/clone-forge/minds/{mind_slug}/.state.json"
    content:
      clone_id: "C360-{mind_slug}-{timestamp}"
      active_clone: "{mind_slug}"
      current_phase: "{N}"
      mode: "{mode}"
      started_at: "{iso_date}"
      manifest_path: "agents/clone-forge/minds/{mind_slug}/manifest.yaml"

  # Mostrar overview
  show_overview:
    format: |
      CLONE 360 — Pipeline Iniciado
      ===============================
      Expert: {name}
      Dominio: {domain}
      Slug: {mind_slug}
      Modo: {full | quick}
      Pessoa disponivel: {sim | nao}

      PIPELINE ({N} FASES):
      {for_each_active_phase}
        Fase {N}: {name} ........... {status} ({estimated_time}) {[QG-XXX] se tem gate}
      {endfor}
      {for_each_skipped_phase}
        Fase {N}: {name} ........... PULADA ({reason})
      {endfor}

      Tempo estimado total: {estimated_total}
      Pipeline e pausavel por fase — pode levar dias.
      Use *status pra acompanhar e *resume pra retomar.

      Iniciando Fase {N}: {phase_name}...

    example_full: |
      CLONE 360 — Pipeline Iniciado
      ===============================
      Expert: Roberto Carvalho
      Dominio: Estrategia de Negocio + Lideranca
      Slug: roberto_carvalho
      Modo: Completo (11 fases)
      Pessoa disponivel: Sim

      PIPELINE (11 FASES):
        Fase 0:   Ingestao .............. EM ANDAMENTO (30-60min)
        Fase 1:   Coleta/Validacao ...... Pendente (30-60min)   [QG-001]
        Fase 1.5: Entrevista ............ Condicional (30-90min)
        Fase 2:   MIUs .................. Pendente (1-2h)       [QG-002]
        Fase 3:   DNA ................... Pendente (2-4h)       [QG-003]
        Fase 4:   Drivers ............... Pendente (1-2h)
        Fase 5:   Psicometria ........... Pendente (30-60min)
        Fase 6:   Agregacao ............. Pendente (1-2h)       [QG-004]
        Fase 6.5: Gap Analysis .......... Condicional (15-60min)
        Fase 7:   Validacao ............. Pendente (30min)      [QG-005]
        Fase 8:   Agente ................ Pendente (15min)

      Tempo estimado total: 8-14 horas
      Pipeline e pausavel por fase — pode levar dias.
      Use *status pra acompanhar e *resume pra retomar.

      Iniciando Fase 0: Ingestao de Conteudo...
```

**Output:** Pipeline iniciado, overview exibido, primeira fase em andamento.

---

## Outputs

| Output | Path | Description |
|--------|------|-------------|
| Mind directory | `agents/clone-forge/minds/{slug}/` | Estrutura completa de 12 subdiretorios |
| Manifest | `minds/{slug}/manifest.yaml` | Estado inicial do pipeline com todos os metadados |
| State file | `minds/{slug}/.state.json` | Arquivo de estado para resume rapido |
| Pipeline kickoff | Fase 0 ou Fase 1 iniciada | Pipeline em andamento |

---

## Validacao

### Checklist de Setup Completo

- [ ] mind_name coletado e nao vazio
- [ ] domain coletado e nao vazio
- [ ] mind_slug gerado corretamente (snake_case, sem acentos, sem caracteres especiais)
- [ ] Brownfield detection executada (clone existente ou novo)
- [ ] 12 subdiretorios criados em `minds/{slug}/` (se clone novo)
- [ ] manifest.yaml criado e valido (YAML parseavel, campos obrigatorios)
- [ ] Dependencias internas validadas (templates, schemas, taxonomias, driver catalog)
- [ ] Modo (full/quick) definido e registrado
- [ ] Disponibilidade do expert registrada
- [ ] Fases condicionais marcadas corretamente no manifest
- [ ] .state.json criado com clone ativo
- [ ] Pipeline overview exibido ao usuario
- [ ] Primeira fase operacional iniciada

**Threshold:** 11/13 para PASS

---

## Error Handling

```yaml
error_handling:

  missing_mind_name:
    symptom: "Usuario nao forneceu nome"
    action: "Re-perguntar: 'Preciso do nome completo da pessoa pra comecar.'"
    severity: "blocking"

  missing_domain:
    symptom: "Usuario nao forneceu dominio"
    action: "Re-perguntar: 'Qual a area de expertise principal?'"
    severity: "blocking"

  invalid_slug:
    symptom: "Slug gerado e invalido ou muito longo"
    action: "Pedir override manual"
    severity: "warning"

  internal_file_missing:
    symptom: "Algum arquivo interno do Clone Forge nao foi encontrado"
    action: |
      Informar: "Arquivo interno faltando: {path}.
      O squad pode estar corrompido. Reinstale o Clone Forge."
    severity: "blocking"

  directory_creation_failed:
    symptom: "Falha ao criar diretorios (permissao, disco cheio)"
    action: "Reportar erro exato, pedir que usuario resolva"
    severity: "blocking"

  manifest_template_missing:
    symptom: "Template de manifest nao encontrado"
    action: "Verificar instalacao do squad Clone Forge"
    severity: "blocking"

  sources_path_invalid:
    symptom: "Caminho fornecido pelo usuario nao existe"
    action: "Reportar e pedir caminho correto"
    fallback: "Prosseguir sem conteudo local (Fase 0 pulada)"
    severity: "warning"

  resume_manifest_corrupted:
    symptom: "Manifest existente esta corrompido ou invalido"
    action: "Reportar e recomendar restart com backup"
    severity: "error"

  state_file_conflict:
    symptom: "Ja existe um clone ativo diferente em .state.json"
    action: |
      Reportar: "Ja tem um clone ativo: {outro_slug}.
      1. Pausar {outro_slug} e iniciar {novo_slug}
      2. Retomar {outro_slug}
      3. Cancelar"
    severity: "warning"
```

---

## Integracao

### Agentes Envolvidos

| Agente | Papel | Quando |
|--------|-------|--------|
| @clone-forge-chief | Executa esta task inteira | Sempre |

### Tasks Referenciadas (Todo o Pipeline)

| Task | Phase | Relacao |
|------|-------|---------|
| `tasks/ingest-local-content.md` | 0 | Kickoff direto (se conteudo local) |
| `tasks/collect-and-merge-sources.md` | 1 | Kickoff direto (se sem conteudo local) |
| `tasks/deep-interview.md` | 1.5 | Condicional (subject_present + fontes insuficientes) |
| `tasks/extract-mius.md` | 2 | Sequencial (modo full) |
| `tasks/extract-dna-enriched.md` | 3 | Sequencial |
| `tasks/infer-drivers.md` | 4 | Sequencial (modo full) |
| `tasks/map-psychometrics.md` | 5 | Sequencial (modo full) |
| `tasks/aggregate-profile.md` | 6 | Sequencial |
| `tasks/gap-analysis-questionnaire.md` | 6.5 | Condicional (completeness < 0.8 + subject_present) |
| `tasks/validate-clone-forge.md` | 7 | Sequencial |
| `tasks/generate-agent-from-profile.md` | 8 | Sequencial (final) |

### Templates Usados

| Template | Path | Purpose |
|----------|------|---------|
| Manifest template | `agents/clone-forge/templates/manifest-tmpl.yaml` | Estrutura inicial do manifest |

### Dependencias

| Dependencia | Tipo | Obrigatoria | Verificada |
|-------------|------|-------------|------------|
| Templates internos (`agents/clone-forge/templates/`, `data/`) | Interna | Sim | Step 9 |
| Zona Genialidade | Externa | Nao (enriquece Fase 5) | Step 9 |

### Fluxo no Pipeline

```
Usuario -> *clone-forge {nome} --domain "{area}" -> esta task
  -> Step 1-9: Setup
  -> Step 10: Kickoff
  -> Fase 0 (ou 1) -> ... -> Fase 8 -> CLONE PRONTO
```

### Notas de Implementacao

**Pipeline Resumivel:** O estado e mantido em `manifest.yaml` (fonte de verdade) e `.state.json` (referencia rapida). Manifest e SEMPRE atualizado ANTES de operacao longa.

**Brownfield Detection:** Se `minds/{slug}/` ja existe, oferece resume (padrao), restart (com backup), ou status.

**Quick para Full Upgrade:** Clone quick pode ser promovido para full. Pipeline detecta fases puladas e executa apenas as faltantes.

**Conflito de Clones:** `.state.json` rastreia o clone ativo. Apenas um clone ativo por vez.

---

## Historico de Revisoes

| Versao | Data | Descricao |
|--------|------|-----------|
| 1.0.0 | 2026-03-02 | Criacao inicial — 10 steps, entry point completo com brownfield check, elicitacao, validacao de dependencias e pipeline kickoff |

---

_Task: clone-forge/start v1.0.0_
_Phase: Entry Point_
_Agent: @clone-forge-chief_
_Execution: Interactive_
