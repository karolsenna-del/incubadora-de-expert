# Task: Geracao de Agente a partir do Perfil (Phase 8)

**Task ID:** clone-forge/generate-agent-from-profile
**Version:** 2.0.0
**Status:** Production Ready
**Created:** 2026-03-02
**Category:** Agent Generation
**Execution Type:** Autonomous

---

## Executive Summary

Transforma o perfil ontologico completo (6 modulos POC + contradicoes + obsessoes), DNA de comunicacao/pensamento e resultados de validacao em 3 artefatos finais de deploy: agent-config.yaml (configuracao estruturada do agente), system-prompt.md (prompt completo para o LLM) e deployment-notes.md (instrucoes de uso, limitacoes e recomendacoes). Esta e a fase culminante do pipeline Clone Forge -- onde todo o trabalho de 7 fases anteriores se materializa num agente funcional capaz de responder como o expert no seu dominio.

**Pipeline Position:** Phase 8 (apos Validacao, fase final do pipeline)
**Success Definition:** 3 artefatos gerados em `08-agent/`, manifest atualizado, agente pronto para deploy
**Blocking Gate:** Nenhum (ultima fase -- nao bloqueia downstream)

---

## Purpose

As fases anteriores produzem um retrato completo da pessoa: quem e, como pensa, como fala, o que sabe, o que defende, onde atua, suas contradicoes e obsessoes. Mas esse retrato esta espalhado em 20+ arquivos YAML e Markdown. A Fase 8 resolve o ultimo mile -- compila tudo num formato que um LLM consegue consumir e executar como persona.

Sem esta fase, o perfil e um mapa sem carro. Com esta fase, o mapa vira GPS -- o agente sabe pra onde ir, como falar no caminho e quando parar pra recalcular rota.

A qualidade do agente gerado depende diretamente da qualidade do perfil upstream. Por isso esta fase so executa apos QG-005 (Clone Validated) aprovar. Garbage in, garbage out e lei -- mas se o pipeline foi bem executado, o output aqui e ouro.

---

## Execution Type

**Autonomous** -- o @clone-forge-chief executa a geracao completa sem intervencao humana.

O Chief carrega todos os outputs de Fase 6 (perfil), Fase 3 (DNA), Fase 7 (validacao) e opcionalmente Fase 4 (drivers) e Fase 5 (psicometria). Compila os 3 artefatos finais, calcula metricas de confianca por secao e atualiza o manifest. Nao ha quality gate bloqueante nesta fase -- o controle de qualidade ja foi feito na Fase 7.

---

## Inputs

### Obrigatorios

| Input | Path | Descricao |
|-------|------|-----------|
| Unified Profile | `minds/{slug}/06-profile/unified-profile.md` | Narrativa legivel do perfil completo |
| Identity Module | `minds/{slug}/06-profile/identity.yaml` | Modulo Identidade (L1 + L3) |
| Mental Model Module | `minds/{slug}/06-profile/mental-model.yaml` | Modulo Modelo Mental (L2) |
| Operational Module | `minds/{slug}/06-profile/operational.yaml` | Modulo Operacional (L1) |
| Repertoire Module | `minds/{slug}/06-profile/repertoire.yaml` | Modulo Repertorio (L2) |
| Visual Framework Module | `minds/{slug}/06-profile/visual-framework.yaml` | Modulo Framework Visual (L3) |
| Ecosystem Module | `minds/{slug}/06-profile/ecosystem.yaml` | Modulo Ecossistema (L4) |
| Contradictions | `minds/{slug}/06-profile/contradictions.yaml` | Paradoxos produtivos |
| Obsessions | `minds/{slug}/06-profile/obsessions.yaml` | Temas recorrentes |
| Voice DNA | `minds/{slug}/03-dna/voice-dna.yaml` | DNA de comunicacao |
| Thinking DNA | `minds/{slug}/03-dna/thinking-dna.yaml` | DNA de pensamento e frameworks |
| Fidelity Score | `minds/{slug}/07-validation/fidelity-score.yaml` | Score de fidelidade global e por dimensao |
| Smoke Test Results | `minds/{slug}/07-validation/smoke-test-results.yaml` | Resultados dos 3 smoke tests |

### Opcionais

| Input | Path | Descricao |
|-------|------|-----------|
| Mind Drivers | `minds/{slug}/04-drivers/mind-drivers.yaml` | Drivers psicologicos (ausente em modo quick) |
| Driver Relationships | `minds/{slug}/04-drivers/driver-relationships.yaml` | Relacoes e paradoxos entre drivers |
| Psychometric Synthesis | `minds/{slug}/05-psychometric/psychometric-synthesis.yaml` | Sintese dos 6 sistemas psicometricos |
| Implicit Knowledge | `minds/{slug}/03-dna/implicit-knowledge.yaml` | Crencas, regras tacitas, gaps |
| DNA Synthesis | `minds/{slug}/03-dna/dna-synthesis.yaml` | Integracao Voice + Thinking |
| Manifest | `minds/{slug}/manifest.yaml` | Estado atual do pipeline |

### Dados do Squad

| Dado | Path | Descricao |
|------|------|-----------|
| POC Schema | `agents/clone-forge/data/poc-schema.yaml` | Definicao dos 6 modulos com campos required/optional |

---

## Precondicoes

- [ ] QG-005 CLONE_VALIDATION: PASS (ou CONDITIONAL com limitacoes documentadas)
- [ ] Todos os 6 modulos POC existem em `06-profile/`
- [ ] unified-profile.md gerado e completo
- [ ] contradictions.yaml e obsessions.yaml existem
- [ ] Voice DNA e Thinking DNA existem em `03-dna/`
- [ ] fidelity-score.yaml e smoke-test-results.yaml existem em `07-validation/`
- [ ] Manifest atualizado com Fase 7 completa

---

## Steps

### Step 1: Carregar Perfil Unificado e Modulos POC

```yaml
action: load_profile
sources:
  unified_profile: minds/{slug}/06-profile/unified-profile.md
  identity: minds/{slug}/06-profile/identity.yaml
  mental_model: minds/{slug}/06-profile/mental-model.yaml
  operational: minds/{slug}/06-profile/operational.yaml
  repertoire: minds/{slug}/06-profile/repertoire.yaml
  visual_framework: minds/{slug}/06-profile/visual-framework.yaml
  ecosystem: minds/{slug}/06-profile/ecosystem.yaml
  contradictions: minds/{slug}/06-profile/contradictions.yaml
  obsessions: minds/{slug}/06-profile/obsessions.yaml

validate:
  - Cada arquivo existe e nao esta vazio
  - Modulos tem campos required preenchidos
  - unified-profile.md tem as 10 secoes esperadas
on_missing: |
  Se algum modulo POC esta ausente: ABORT.
  Fase 8 nao pode gerar agente sem perfil completo.
  Retornar a Fase 6 para reprocessamento.
```

### Step 2: Carregar Voice DNA e Thinking DNA

```yaml
action: load_dna
sources:
  voice_dna: minds/{slug}/03-dna/voice-dna.yaml
  thinking_dna: minds/{slug}/03-dna/thinking-dna.yaml

extract_for_agent:
  voice:
    - power_words         # Palavras que o expert usa com frequencia
    - signature_phrases   # Frases de assinatura
    - never_use           # Palavras/expressoes que NUNCA usa
    - tom                 # Tom geral de comunicacao
    - contextual_tone     # Tom por contexto (ensino, confronto, casual)
    - metaphors           # Metaforas e analogias favoritas
    - recurring_stories   # Historias que repete
    - immune_system       # Como reage a provocacao/BS
    - anti_patterns       # O que rejeita na comunicacao
    - favorite_examples   # Exemplos que usa pra explicar conceitos
  thinking:
    - frameworks          # Frameworks de pensamento core
    - heuristics          # Regras de bolso / atalhos de decisao
    - decision_pipeline   # Como toma decisoes (sequencia)
    - mental_models       # Modelos mentais que aplica
    - non_negotiables     # Principios inegociaveis de pensamento
    - blind_spots         # Pontos cegos reconhecidos
    - reasoning_style     # Estilo de raciocinio (analitico, intuitivo, misto)

validate:
  - Voice DNA tem score >= 8/10 (ja validado por QG-003 e QG-005)
  - Thinking DNA tem score >= 7/9
on_missing: |
  ABORT — DNA e obrigatorio. Sem ele, agente sera generico.
```

### Step 3: Carregar Resultados de Validacao

```yaml
action: load_validation
sources:
  fidelity_score: minds/{slug}/07-validation/fidelity-score.yaml
  smoke_tests: minds/{slug}/07-validation/smoke-test-results.yaml

extract_for_agent:
  fidelity:
    - global_score        # Score geral (0-100)
    - voice_score         # Fidelidade de voz
    - thinking_score      # Fidelidade de pensamento
    - values_score        # Fidelidade de valores
    - tier                # "high" (>= 85), "standard" (70-84), "limited" (< 70)
    - weak_dimensions     # Dimensoes abaixo de 70%
    - recommendations     # Recomendacoes de melhoria da validacao
  smoke_tests:
    - voice_test          # PASS/FAIL + detalhes
    - thinking_test       # PASS/FAIL + detalhes
    - values_test         # PASS/FAIL + detalhes
    - blind_test_result   # Se aplicavel

validate:
  - fidelity_score existe e tem global_score
  - smoke_tests tem resultados para os 3 testes
on_missing: |
  Se fidelity-score ausente: ABORT — nao gerar agente sem validacao.
  Se smoke-test-results ausente: documentar como "validacao incompleta".
```

### Step 4: Carregar Dados Opcionais (Drivers e Psicometria)

```yaml
action: load_optional
sources:
  drivers: minds/{slug}/04-drivers/mind-drivers.yaml (se existir)
  driver_relationships: minds/{slug}/04-drivers/driver-relationships.yaml (se existir)
  psychometric_synthesis: minds/{slug}/05-psychometric/psychometric-synthesis.yaml (se existir)
  implicit_knowledge: minds/{slug}/03-dna/implicit-knowledge.yaml (se existir)
  dna_synthesis: minds/{slug}/03-dna/dna-synthesis.yaml (se existir)

behavior:
  if_drivers_exist: |
    Enriquecer behavioral constraints com motivacoes profundas.
    Adicionar driver-based rules ao agente (ex: se driver "autonomia" e forte,
    agente nunca recomenda depender de terceiros como solucao padrao).
  if_drivers_missing: |
    Documentar em deployment-notes: "Modo quick — sem drivers psicologicos.
    Agente funcional mas sem profundidade motivacional."
  if_psychometric_exists: |
    Adicionar secao de perfil psicometrico ao system prompt.
    Usar como contexto para calibrar tom e estilo de interacao.
  if_psychometric_missing: |
    Documentar em deployment-notes: "Sem mapeamento psicometrico.
    Agente nao ajusta interacao baseado em perfil de personalidade."
```

### Step 5: Gerar agent-config.yaml

Produzir o arquivo de configuracao estruturada do agente:

```yaml
output: minds/{slug}/08-agent/agent-config.yaml

structure:
  # --- Metadata ---
  agent:
    id: "clone-{slug}-v1"
    name: "{nome do expert}"
    version: "1.0.0"
    generated_at: "{timestamp ISO 8601}"
    generated_by: "clone-forge-chief"
    clone_source:
      pipeline: "clone-forge"
      mode: "{full | quick}"
      phases_completed: [0, 1, 1.5, 2, 3, 4, 5, 6, 6.5, 7, 8]  # ou subset
      fidelity_score: "{global_score}"
      fidelity_tier: "{high | standard | limited}"
    domain: "{area de expertise}"
    language: "pt-BR"

  # --- Personality Configuration ---
  personality:
    voice:
      tom_primario: "# extraido de voice-dna.yaml > tom"
      tom_contextual:
        ensino: "# extraido de voice-dna > contextual_tone.teaching"
        confronto: "# extraido de voice-dna > immune_system"
        casual: "# extraido de voice-dna > contextual_tone.casual"
        vendas: "# extraido de voice-dna > contextual_tone.selling"
      power_words: ["# lista de voice-dna > power_words"]
      signature_phrases: ["# lista de voice-dna > signature_phrases"]
      never_use: ["# lista de voice-dna > never_use"]
      metaphors: ["# lista de voice-dna > metaphors"]
      anti_patterns: ["# lista de voice-dna > anti_patterns"]
    thinking:
      reasoning_style: "# extraido de thinking-dna > reasoning_style"
      frameworks_core: ["# lista de thinking-dna > frameworks"]
      heuristics: ["# lista de thinking-dna > heuristics"]
      decision_pipeline: "# extraido de thinking-dna > decision_pipeline"
      non_negotiables: ["# lista de thinking-dna > non_negotiables"]

  # --- Knowledge Domains ---
  knowledge:
    primary_domain: "# extraido de identity.yaml > dominio"
    sub_domains: ["# extraido de operational.yaml + repertoire.yaml"]
    expertise_areas:
      - area: "# nome da area"
        confidence: 0.0  # 0-1, baseado em completude do modulo
        source_modules: ["# modulos que alimentam essa area"]
    repertoire:
      cases_count: 0  # total de casos em repertoire.yaml
      playbooks_count: 0  # total de playbooks
      frameworks_count: 0  # total de frameworks aplicados

  # --- Behavioral Constraints ---
  behavioral:
    never_rules:  # Derivadas de contradictions, voice DNA anti_patterns, obsessions
      - id: "NEVER-001"
        rule: "# regra derivada do perfil"
        source: "# de onde veio (ex: voice-dna > never_use, obsessions > OBS-002)"
        severity: "hard"  # hard = inviolavel, soft = contexto-dependente
    always_rules:  # Derivadas de non_negotiables, obsessions, identity
      - id: "ALWAYS-001"
        rule: "# regra derivada do perfil"
        source: "# de onde veio"
        severity: "hard"
    paradox_rules:  # Derivadas de contradictions.yaml
      - id: "PARADOX-001"
        rule: "# como manejar o paradoxo"
        sides: ["# side_a", "# side_b"]
        default_behavior: "# qual lado priorizar por default"
        switch_trigger: "# quando trocar pro outro lado"

  # --- Confidence Levels ---
  confidence:
    global: 0.0  # fidelity_score global
    per_module:
      identity: 0.0  # completude do modulo identity
      mental_model: 0.0
      operational: 0.0
      repertoire: 0.0
      visual_framework: 0.0
      ecosystem: 0.0
    per_dimension:
      voice: 0.0  # voice fidelity score
      thinking: 0.0  # thinking fidelity score
      values: 0.0  # values fidelity score
    low_confidence_areas: ["# areas com confidence < 0.7"]
```

**Regras de preenchimento:**

- Cada valor DEVE ter proveniencia rastreavel (qual arquivo fonte)
- NEVER rules derivadas de: `voice-dna > never_use` + `contradictions.yaml` + `obsessions.yaml (rejeicoes)`
- ALWAYS rules derivadas de: `thinking-dna > non_negotiables` + `obsessions.yaml` + `identity.yaml > valores_core`
- PARADOX rules derivadas diretamente de `contradictions.yaml`
- Confidence levels calculados a partir de completude dos modulos e fidelity scores
- Se campo fonte esta vazio ou `[INFERRED]`: reduzir confidence em -0.15

### Step 6: Gerar system-prompt.md

Produzir o system prompt completo do agente. Este e o artefato mais critico -- e o que o LLM vai receber como instrucao.

```yaml
output: minds/{slug}/08-agent/system-prompt.md

structure:
  # Cada secao do prompt mapeia para dados especificos do perfil

  sections:
    - name: "Identidade"
      source: identity.yaml
      content: |
        Quem e essa pessoa: nome, dominio, proposito, historia de origem.
        Valores core e rejeicoes fundamentais.
        Identidade profissional e pessoal (como se ve, como quer ser vista).
        Aspiracoes e visao de futuro.
      guidance: |
        Escrever em primeira pessoa do singular.
        Tom: apresentacao natural, como se a pessoa estivesse dizendo quem e.
        Incluir turning points se disponiveis (momentos que mudaram tudo).

    - name: "Voz"
      source: voice-dna.yaml
      content: |
        COMO falar: tom primario, variacoes contextuais.
        Palavras de poder (usar frequentemente).
        Frases de assinatura (usar naturalmente, nao forcar).
        Palavras PROIBIDAS (nunca usar, sem excecao).
        Metaforas e analogias favoritas.
        Historias recorrentes (mencionar quando relevante).
        Sistema imunologico: como reagir a BS, provocacao, perguntas rasas.
      guidance: |
        Esta secao define a VOZ, nao o conteudo.
        O agente deve soar como a pessoa, nao como um resumo da pessoa.
        Anti-patterns sao tao importantes quanto patterns.
        Never_use e inviolavel — qualquer violacao quebra fidelidade.

    - name: "Pensamento"
      source: thinking-dna.yaml
      content: |
        COMO pensar: frameworks core, heuristicas, modelos mentais.
        Pipeline de decisao: qual sequencia de pensamento segue.
        Principios inegociaveis de pensamento.
        Vieses intencionais (a pessoa sabe que tem e mantem de proposito).
        Pontos cegos reconhecidos.
        Estilo de raciocinio (analitico, intuitivo, pragmatico, misto).
      guidance: |
        Frameworks devem ser APLICADOS, nao apenas mencionados.
        Quando alguem faz uma pergunta, o agente deve processar
        usando o decision_pipeline do expert, nao raciocinio generico.
        Heuristicas sao atalhos — usar quando a pergunta e rapida.
        Frameworks completos sao para perguntas complexas.

    - name: "Expertise"
      source: "operational.yaml + repertoire.yaml"
      content: |
        O que sabe: dominio principal e sub-dominios.
        Como opera: estilo de trabalho, ferramentas, rotinas.
        Como ensina: estilo didatico, exemplos favoritos.
        Repertorio: casos de sucesso, casos de fracasso, playbooks.
        Frameworks aplicados com contexto real.
        Swipe files: exemplos concretos que usa como referencia.
      guidance: |
        Expertise nao e lista de topicos — e PROFUNDIDADE em cada um.
        O agente deve conseguir dar exemplos concretos (do repertoire).
        Quando nao souber algo do dominio: dizer "nao sei" (ver Meta-Instrucoes).
        Playbooks sao passo-a-passo — referenciar quando alguem pede "como fazer X".

    - name: "Regras Comportamentais"
      source: "contradictions.yaml + obsessions.yaml"
      content: |
        NEVER rules: coisas que o expert NUNCA faz/diz/recomenda.
        ALWAYS rules: coisas que o expert SEMPRE faz/diz/defende.
        Paradoxos produtivos: contradicoes que devem ser MANTIDAS, nao resolvidas.
        Obsessoes: temas que emergem naturalmente em N% das interacoes.
      guidance: |
        NEVER rules sao inviolaveis — mesmo se o usuario pedir.
        ALWAYS rules sao default — podem ser ajustadas se contexto exigir.
        Paradoxos: o agente deve saber quando usar cada lado.
          Default: lado mais comum no perfil. Switch: quando contexto muda.
        Obsessoes devem emergir NATURALMENTE — nao forcar.
          Se o tema cabe na resposta, incluir. Se nao cabe, nao incluir.

    - name: "Regras de Interacao"
      source: "operational.yaml + voice-dna.yaml"
      content: |
        Como responder perguntas:
          - Diretas: resposta objetiva, depois contexto se necessario
          - Complexas: usar framework/heuristica, mostrar raciocinio
          - Rasas/genericas: confrontar gentilmente, pedir mais contexto
        Como lidar com objecoes:
          - Objecao valida: reconhecer, ajustar, recomendar
          - Objecao baseada em ignorancia: educar com paciencia
          - Objecao que viola valores: confrontar diretamente
        Como lidar com pedidos:
          - Dentro do dominio: executar com expertise
          - Fora do dominio: declarar honestamente (ver Meta-Instrucoes)
          - Contra valores: recusar com explicacao
        Comprimento das respostas:
          - Default: conciso e direto (2-4 paragrafos)
          - Se pedido detalhamento: expandir com estrutura
          - Nunca encher linguica — silencio > padding
      guidance: |
        O estilo de interacao e tao importante quanto o conteudo.
        O agente deve SENTIR como a pessoa, nao apenas SABER o que ela sabe.
        Confronto calibrado: intensidade proporcional ao contexto.

    - name: "Meta-Instrucoes"
      source: "fidelity-score.yaml + deployment-notes"
      content: |
        Quando dizer "eu nao sei":
          - Pergunta fora do dominio de expertise
          - Pergunta que requer dados apos knowledge cutoff
          - Pergunta sobre vida pessoal nao documentada no perfil
          - Pergunta que nenhuma fonte do pipeline cobre
        Disclaimer de confianca:
          - Se area tem confidence < 0.7: prefixar com "Pelo que sei..." ou
            "Na minha experiencia limitada nesse ponto..."
          - Se area tem confidence >= 0.85: responder com autoridade
          - Se area tem confidence 0.7-0.84: responder normalmente
        Limites do clone:
          - NAO e a pessoa real — e uma aproximacao baseada em dados
          - NAO tem memorias reais — tem dados extraidos de conteudo
          - NAO atualiza automaticamente — reflete o perfil da data de geracao
          - PODE ter gaps — areas onde dados foram insuficientes
      guidance: |
        Honestidade radical: melhor dizer "nao sei" do que inventar.
        Meta-instrucoes sao transparentes — o agente sabe que e um clone.
        Se alguem perguntar "voce e real?": responder honestamente.

    - name: "Perfil Psicometrico"
      source: "psychometric-synthesis.yaml (se disponivel)"
      content: |
        Resumo dos sistemas mapeados (MBTI, Enneagram, DISC, Big Five, IQ/EQ, Spiral Dynamics).
        NAO como rotulo — como contexto de calibragem.
        Usar para ajustar tom e profundidade das respostas.
      guidance: |
        Secao OPCIONAL — so incluir se psicometria foi executada.
        Se ausente: omitir silenciosamente, nao mencionar.
        Se presente: usar como pano de fundo, nunca como protagonista.
        NOTA: mapeamento e ESTIMADO (inferido), nao aferido formalmente.
        Nunca apresentar como diagnostico.

    - name: "Ecossistema"
      source: "ecosystem.yaml + visual-framework.yaml"
      content: |
        Publico que o expert serve.
        Mercado onde atua.
        Tese central e manifesto (o que defende).
        Posicionamento e diferencial.
        Visao de futuro e legado.
      guidance: |
        Ecossistema informa CONTEXTO das respostas.
        Quando o agente responde, considera quem e o publico do expert.
        Tese central aparece naturalmente nas recomendacoes.
        Manifesto aparece quando alguem questiona posicionamento.
```

**Regras de compilacao do system prompt:**

1. Cada secao deve fluir naturalmente -- nao parecer lista de instrucoes robotica
2. Primeira pessoa do singular: "Eu sou...", "Eu penso...", "Eu nunca..."
3. Tom do prompt deve refletir a voz do expert (nao tom generico de sistema)
4. Tamanho alvo: 3.000-6.000 tokens (suficiente para fidelidade sem overflow)
5. Se tamanho > 8.000 tokens: comprimir secoes de menor confidence
6. Incluir exemplos concretos do repertoire (1-2 por secao de expertise)
7. NEVER rules em secao dedicada e destacada -- sao inviolaveis
8. Meta-instrucoes no FINAL do prompt (ultima coisa que o LLM le)

### Step 7: Gerar deployment-notes.md

Produzir documentacao de deploy e limitacoes:

```yaml
output: minds/{slug}/08-agent/deployment-notes.md

structure:
  sections:
    - name: "Resumo"
      content: |
        Nome do agente, dominio, data de geracao, modo do pipeline.
        Fidelity score e tier. Tempo total do pipeline.

    - name: "Instrucoes de Uso"
      content: |
        Como ativar o agente (integracao com Auroq ou standalone).
        Como configurar como system prompt em outro LLM.
        Parametros recomendados (temperature, top_p, max_tokens).
        Recomendacao de modelo: qual LLM performa melhor com este prompt.
      details:
        auroq_integration: |
          1. Copiar agent-config.yaml para agents/{slug}.yaml
          2. Registrar no config.yaml do squad
          3. Ativar via @{slug} ou /Auroq:agents:{slug}
        standalone: |
          1. Copiar conteudo de system-prompt.md
          2. Colar como system message no LLM de escolha
          3. Parametros: temperature 0.7, top_p 0.9
        api_integration: |
          1. Parsear agent-config.yaml programaticamente
          2. Montar system message a partir dos campos
          3. Injetar behavioral constraints como guardrails

    - name: "Limitacoes Conhecidas"
      content: |
        Listar areas com confidence < 0.7 e impacto pratico.
        Listar dimensoes onde smoke tests foram marginais.
        Listar modulos que dependeram de [INFERRED] data.
        Documentar se alguma fase upstream teve CONDITIONAL pass.
      categories:
        inerentes:
          - "Clone baseado em conteudo — nao tem memorias reais"
          - "Mapeamento psicometrico e ESTIMADO, nao aferido formalmente"
          - "Nao atualiza automaticamente — reflete perfil da data de geracao"
        especificas:
          - "# Derivadas do gap analysis e da validacao"
          - "# Campos marcados como [DADOS LIMITADOS]"
          - "# Modulos com completude abaixo do threshold"

    - name: "Fidelidade por Dimensao"
      content: |
        Tabela com:
        | Dimensao | Score | Status | Notas |
        |----------|-------|--------|-------|
        | Voz | X% | PASS/MARGINAL/WEAK | ... |
        | Pensamento | X% | PASS/MARGINAL/WEAK | ... |
        | Valores | X% | PASS/MARGINAL/WEAK | ... |
        | Global | X% | TIER | ... |
      thresholds:
        PASS: ">= 80%"
        MARGINAL: "70-79%"
        WEAK: "< 70%"

    - name: "Modulos com Baixa Confianca"
      content: |
        Para cada modulo POC com completude < 80%:
        - Qual modulo
        - Quais campos estao incompletos ou [INFERRED]
        - Impacto pratico no agente (quais respostas serao afetadas)
        - O que fazer pra melhorar (fontes adicionais, entrevista, etc.)

    - name: "Recomendacoes de Melhoria"
      content: |
        Baseado em:
        - Gap analysis (se executado): gaps restantes nao preenchidos
        - Validacao (dimensoes fracas): o que coletar pra melhorar score
        - Modulos incompletos: que tipo de fonte resolveria cada gap
        - Evolucao temporal: quando re-rodar pipeline (sugestao a cada 3-6 meses)
      priority_order:
        - "1. Coletar fontes Tier 0 adicionais (entrevista profunda)"
        - "2. Preencher gaps em modulos de baixa completude"
        - "3. Adicionar assessments psicometricos formais"
        - "4. Re-validar com conteudo recente do expert"

    - name: "Diferencas Quick vs Full"
      content: |
        Se pipeline foi executado em modo quick:
        - Listar fases puladas (4: Drivers, 5: Psicometria, 6.5: Gap Analysis)
        - Impacto pratico de cada fase ausente:
          - Sem drivers: agente nao tem profundidade motivacional
          - Sem psicometria: agente nao ajusta estilo por perfil de personalidade
          - Sem gap analysis: gaps no perfil nao foram preenchidos
        - Como complementar: "*resume --full" pra rodar fases faltantes e re-gerar
        Se pipeline foi full: "Pipeline completo executado. Todas as 11 fases."

    - name: "Historico do Pipeline"
      content: |
        Resumo de cada fase: status, duracao, resultado do quality gate.
        Quantas iteracoes de gap analysis (se aplicavel).
        Quantas iteracoes de validacao.
        Total de fontes processadas, MIUs extraidos, modulos preenchidos.
      format: |
        | Fase | Status | Duracao | Gate | Notas |
        |------|--------|---------|------|-------|
        | 0 - Ingestao | ... | ... | N/A | ... |
        | 1 - Coleta | ... | ... | QG-001 | ... |
        | ... | ... | ... | ... | ... |
```

### Step 8: Atualizar manifest.yaml

```yaml
action: update_manifest
path: minds/{slug}/manifest.yaml

update:
  phase_8:
    status: complete
    timestamp: "{ISO 8601}"
    agent: "clone-forge-chief"
    outputs:
      - "08-agent/agent-config.yaml"
      - "08-agent/system-prompt.md"
      - "08-agent/deployment-notes.md"
    stats:
      system_prompt_tokens: "{contagem estimada}"
      config_rules_count: "{total NEVER + ALWAYS + PARADOX rules}"
      confidence_global: "{fidelity score}"
      confidence_tier: "{high | standard | limited}"
      mode: "{full | quick}"
    duration: "{tempo da fase em minutos}"

  pipeline:
    status: complete
    completed_at: "{ISO 8601}"
    total_duration: "{tempo total do pipeline}"
    fidelity_tier: "{high | standard | limited}"

validate:
  - manifest.yaml atualizado com phase_8 complete
  - pipeline status marcado como complete
  - Todos os 3 artefatos existem em 08-agent/
```

### Step 9: Mensagem de Entrega

Apos gerar todos os artefatos, o Chief apresenta o resultado ao usuario:

```
CLONE 360 — Pipeline Completo!
=================================
Expert: {nome}
Dominio: {dominio}
Slug: {slug}

ARTEFATOS GERADOS:
  minds/{slug}/08-agent/agent-config.yaml    Configuracao estruturada
  minds/{slug}/08-agent/system-prompt.md     System prompt ({N} tokens)
  minds/{slug}/08-agent/deployment-notes.md  Instrucoes de deploy

FIDELIDADE:
  Global: {score}% ({tier})
  Voz: {voice_score}%
  Pensamento: {thinking_score}%
  Valores: {values_score}%

PIPELINE STATS:
  Fases completadas: {N}/11
  Modo: {full | quick}
  Tempo total: {duration}
  Fontes processadas: {N}
  MIUs extraidos: {N}
  Modulos POC: 6/6

{se limitacoes existem}
AVISOS:
  - {limitacao 1}
  - {limitacao 2}
{/se}

O agente esta pronto. Use o system-prompt.md como prompt de sistema
em qualquer LLM compativel, ou integre o agent-config.yaml no Auroq.
```

---

## Outputs

| Arquivo | Path | Descricao |
|---------|------|-----------|
| Agent Config | `minds/{slug}/08-agent/agent-config.yaml` | Configuracao estruturada do agente (metadata, personalidade, knowledge, behavioral constraints, confidence) |
| System Prompt | `minds/{slug}/08-agent/system-prompt.md` | System prompt completo para o LLM (identidade, voz, pensamento, expertise, regras, meta-instrucoes) |
| Deployment Notes | `minds/{slug}/08-agent/deployment-notes.md` | Instrucoes de uso, limitacoes conhecidas, fidelidade por dimensao, recomendacoes de melhoria |

---

## Validacao

### Checklist Pos-Execucao

- [ ] agent-config.yaml gerado em `08-agent/` com todas as secoes (metadata, personality, knowledge, behavioral, confidence)
- [ ] agent-config.yaml e YAML valido (parseable sem erros)
- [ ] agent-config.yaml referencia fidelity score real (nao placeholder)
- [ ] system-prompt.md gerado com secoes: Identidade, Voz, Pensamento, Expertise, Regras Comportamentais, Regras de Interacao, Meta-Instrucoes
- [ ] system-prompt.md entre 3.000-8.000 tokens
- [ ] system-prompt.md escrito em primeira pessoa do expert (nao terceira pessoa)
- [ ] system-prompt.md NAO usa linguagem de IA ("como modelo de linguagem...")
- [ ] system-prompt.md contem power_words do Voice DNA
- [ ] system-prompt.md contem signature_phrases
- [ ] system-prompt.md lista never_use words como regras inviolaveis
- [ ] system-prompt.md inclui framework principal com passos
- [ ] system-prompt.md inclui heuristicas de decisao
- [ ] system-prompt.md inclui contradicoes como features (nao tenta resolver)
- [ ] deployment-notes.md gerado com todas as 7 secoes
- [ ] deployment-notes.md documenta limitacoes reais (nao boilerplate)
- [ ] deployment-notes.md inclui instrucoes de uso (Auroq + standalone + API)
- [ ] deployment-notes.md inclui recomendacoes de melhoria priorizadas
- [ ] NEVER rules derivadas de voice-dna.never_use + contradictions + obsessions
- [ ] ALWAYS rules derivadas de non_negotiables + obsessions + valores_core
- [ ] PARADOX rules derivadas de contradictions.yaml com default_behavior e switch_trigger
- [ ] Confidence levels calculados por modulo e por dimensao
- [ ] Areas de baixa confianca (< 0.7) documentadas em deployment-notes
- [ ] manifest.yaml atualizado com phase_8: complete e pipeline: complete
- [ ] Nenhum dado fabricado -- apenas dados compilados do perfil existente
- [ ] Se modo quick: diferencas documentadas em deployment-notes
- [ ] Mensagem de entrega apresentada ao usuario com metricas

---

## Error Handling

### Erro: Perfil unificado ausente ou incompleto

**Sintoma:** unified-profile.md nao existe ou falta secoes.
**Acao:**
1. Verificar se Fase 6 (Agregacao) foi completada no manifest
2. Se nao: retornar para Fase 6. Fase 8 nao pode executar sem perfil
3. Se sim mas arquivo corrompido: re-executar Step 6 da Fase 6 (geracao do perfil unificado)
4. NUNCA gerar agente com perfil parcial sem documentar explicitamente
5. Se retorno a Fase 6 nao e viavel: ABORT com mensagem clara

### Erro: DNA ausente

**Sintoma:** voice-dna.yaml ou thinking-dna.yaml nao existem.
**Acao:**
1. ABORT -- DNA e obrigatorio para geracao de agente
2. Voice DNA define a voz; sem ele, agente sera generico e nao-fiel
3. Thinking DNA define o raciocinio; sem ele, agente sera raso e generico
4. Retornar para Fase 3 (Extracao de DNA) antes de tentar novamente
5. Nunca tentar "compensar" DNA ausente com dados de outros modulos

### Erro: Validacao nao executada (QG-005 pending)

**Sintoma:** fidelity-score.yaml e smoke-test-results.yaml nao existem.
**Acao:**
1. ABORT -- nao gerar agente sem validacao
2. Retornar para Fase 7 (Validacao) e executar QG-005
3. Excecao unica: se usuario explicitamente autoriza com `--skip-validation`
   - Gerar agente com nota: "AGENTE NAO VALIDADO -- USAR COM CAUTELA"
   - deployment-notes deve ter banner de aviso prominente no topo
   - Confidence global reduzida em -0.20 como penalidade
4. Documentar no manifest: `qg_005: skipped_by_user`

### Erro: System prompt excede 8.000 tokens

**Sintoma:** Prompt gerado e muito grande para uso eficiente.
**Acao:**
1. Identificar secoes com menor confidence (< 0.7)
2. Comprimir essas secoes: remover exemplos, manter regras core
3. Mover detalhes extensos para agent-config.yaml (referencia, nao prompt)
4. Re-contar tokens apos compressao
5. Se ainda > 8.000: priorizar secoes por impacto na fidelidade:
   - Tier 1 (NUNCA cortar): Identidade, Voz, Regras Comportamentais
   - Tier 2 (comprimir se necessario): Pensamento, Expertise
   - Tier 3 (mover pra config se necessario): Ecossistema, Psicometria
6. Documentar compressao em deployment-notes: "Prompt comprimido de X para Y tokens"

### Erro: System prompt abaixo de 3.000 tokens

**Sintoma:** Prompt muito curto, indicando dados insuficientes no perfil.
**Acao:**
1. Verificar quais secoes estao sub-representadas
2. Expandir com exemplos concretos do repertoire.yaml
3. Adicionar mais contexto de contradictions.yaml e obsessions.yaml
4. Se mesmo assim < 3.000: documentar como "perfil com baixa densidade de dados"
5. Nao encher linguica -- se dados nao existem, documentar gaps

### Erro: Dados opcionais ausentes (modo quick)

**Sintoma:** Drivers e/ou psicometria nao existem (pipeline rapido).
**Acao:**
1. NAO e erro -- e comportamento esperado em modo quick
2. Omitir secoes dependentes de drivers no agent-config
3. Omitir secao Perfil Psicometrico do system-prompt
4. Documentar em deployment-notes: "Modo quick -- fases 4/5 puladas"
5. Reduzir confidence global em -0.10 (penalidade quick mode)
6. Recomendar: "*resume --full para rodar fases faltantes e re-gerar agente"

### Erro: Contradictions ou obsessions ausentes

**Sintoma:** contradictions.yaml ou obsessions.yaml nao existem.
**Acao:**
1. Se contradictions ausente:
   - Gerar PARADOX rules vazias (lista vazia)
   - Documentar: "Nenhuma contradicao documentada -- agente pode parecer artificialmente coerente"
   - Flag em deployment-notes como limitacao de media severidade
2. Se obsessions ausente:
   - Gerar agente sem temas recorrentes de obsessao
   - Documentar: "Sem obsessoes identificadas -- agente pode nao demonstrar paixao por temas core"
   - Flag em deployment-notes como limitacao de media severidade
3. Nao bloquear geracao -- mas documentar impacto explicitamente

### Erro: YAML invalido no output

**Sintoma:** agent-config.yaml gerado com erro de sintaxe YAML.
**Acao:**
1. Revalidar estrutura YAML (indentacao, aspas, caracteres especiais)
2. Corrigir e re-gerar
3. Max 2 tentativas de correcao
4. Se persistir: gerar versao simplificada sem nested structures complexas

---

## Integracao

### Recebe de

| Fase | Agente | Dados |
|------|--------|-------|
| Phase 6 | @clone-forge-chief (self) | Perfil POC completo (`06-profile/`) |
| Phase 3 | @innerlens + @cognitive-motor | Voice DNA + Thinking DNA (`03-dna/`) |
| Phase 7 | @clone-forge-chief | Validacao (`07-validation/`) |
| Phase 4 | @cognitive-motor (opcional) | Drivers (`04-drivers/`) |
| Phase 5 | @cognitive-motor (opcional) | Psicometria (`05-psychometric/`) |

### Entrega para

| Destino | Dados | Formato |
|---------|-------|---------|
| Usuario final | Agente pronto para uso | 3 artefatos em `08-agent/` |
| Auroq integration (futuro) | agent-config.yaml | Compativel com formato de agents Auroq |
| LLM externo (standalone) | system-prompt.md | System message texto puro |
| Integracao via API | agent-config.yaml | YAML parseavel programaticamente |

### Handoff Protocol

```yaml
# Fase 8 nao tem handoff downstream -- e a fase final.
# O "handoff" e para o USUARIO.

delivery_package:
  from: "@clone-forge-chief"
  to: "usuario"
  gate: "N/A (fase final, sem gate bloqueante)"
  artefatos:
    - minds/{slug}/08-agent/agent-config.yaml
    - minds/{slug}/08-agent/system-prompt.md
    - minds/{slug}/08-agent/deployment-notes.md
  instrucoes: |
    1. Para usar no Auroq: copiar agent-config.yaml para agents/{slug}.yaml
    2. Para usar standalone: copiar conteudo de system-prompt.md como system message
    3. Parametros recomendados: temperature 0.7, top_p 0.9
    4. Modelo recomendado: Claude Sonnet 3.5+ ou GPT-4o+ (modelos com bom instruction following)
    5. Consultar deployment-notes.md para limitacoes e areas de baixa confianca
```

### Pipeline Position

```
Phase 7 (Validacao — QG-005 PASS) ----> Phase 8 (Geracao de Agente) ----> PIPELINE COMPLETO
                                                                              |
                                                                              v
                                                                        Entrega ao Usuario
```

---

## Historico de Revisoes

| Versao | Data | Autor | Mudanca |
|--------|------|-------|---------|
| 1.0.0 | 2026-03-02 | @clone-forge-chief | Criacao inicial da task |
| 2.0.0 | 2026-03-02 | @clone-forge-chief | Rewrite completo: 9 steps detalhados, behavioral constraints (NEVER/ALWAYS/PARADOX), confidence levels, system prompt com 9 secoes, deployment-notes com 7 secoes, error handling expandido |

---

*"O pipeline e longo, mas cada fase existe por um motivo. A Fase 8 e onde tudo converge."*
*"Clone bom nao se faz com pressa -- se faz com curadoria. E a Fase 8 e a curadoria final."*
