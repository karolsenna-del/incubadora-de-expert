---
task: "Assemble Squad"
responsavel: "@forge-smith"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "03-blueprint/squad-blueprint.yaml"
Saida: "04-squad/ (diretorio completo do squad Auroq)"
Checklist:
  - "squad.yaml valido (name kebab-case + version semver)"
  - "agents/ com >=1 .md com frontmatter ou heading"
  - "Cada agente >=250 linhas (profundidade minima)"
  - "Cada agente com >=3 OUTPUT EXAMPLES concretos do processo"
  - "Cada agente com >=3 IMMUNE SYSTEM triggers"
  - "Cada agente com >=5 frases-chave"
  - "tasks/ com >=1 .md com 8 campos TASK-FORMAT-SPEC-V1"
  - "workflows/ com YAML valido e fluxo unidirecional"
  - "data/ com KB >= linhas minimas pelo tipo (operacional 800, analitico 600, dev 400)"
  - "KB com >=1 tabela de referencia + >=3 Regras Cardinais completas"
  - "Todos os arquivos referenciados em config existem"
  - "Sem dependencia circular"
  - "Self-audit PASS + squad-validator.js PASS"
execution_type: "semantic"
---

# Task: Assemble Squad — Montagem dos Artefatos Auroq

**Task ID:** squad-forge/assemble-squad
**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-03-03
**Category:** Construction
**Execution Type:** Semantic

---

## Executive Summary

Fase 4 do pipeline Squad Forge. O @forge-smith gera todos os artefatos Auroq a partir do blueprint: squad.yaml, agents, tasks, workflows, checklists, knowledge base. Valida contra a estrutura nuclear do Auroq (squad-validator.js ou checklist interno).

**Posicao no Workflow:** Fase 4 — Apos Arquitetura (Fase 3), antes de Validacao (Fase 5)
**Definicao de Sucesso:** Squad completo que passa no squad-validator.js
**Gate:** QG-SF-004 — Nuclear Structure

---

## Purpose

O blueprint diz O QUE o squad deve ser. Esta task CONSTROI o squad — gera cada arquivo seguindo os padroes Auroq. O resultado e um diretorio pronto pra copiar pra `squads/` e ativar.

---

## Step-by-Step Execution

> **Story Tracking durante a Fase 4.** Esta task usa as stories geradas em `docs/stories/squad-forge/{slug}/` como tracker. Cada artefato gerado:
>
> 1. Marca AC correspondente como `[x]` na story relevante
> 2. Adiciona arquivo a `## File List` da story
> 3. Atualiza `Status` (Draft → InProgress → Done)
>
> Sem isso, Article III da Constitution e violado e auditoria fica impossivel.

### Step 1: Read Blueprint

Ler `03-blueprint/squad-blueprint.yaml` — agentes, tasks, workflow, quality gates.

### Step 2: Generate squad.yaml

Seguindo o padrao de squads existentes (squad-advisor, clone-forge):

```yaml
# ═══════════════════════════════════════════════════════════════════════════
# SQUAD: {title}
# {descricao breve baseada no processo}
# ═══════════════════════════════════════════════════════════════════════════

name: "{squad-name}"
title: "{Squad Title}"
version: "1.0.0"
author: "{dono}"
description: >
  {Descricao baseada no processo extraido. 2-3 linhas.}

slash_prefix: "{camelCase}"
pattern_prefix: "{2-3 letras}"
target_user: "{Quem usa}"

tiers:
  orchestrator:
    - "{chief-agent-id}"
  tier_1:
    - "{agent-2-id}"
    # ...

tasks:
  - start
  - "{task-1}"
  # ...

workflows:
  - "wf-{squad-name}"

quality_gates:
  # Gerados a partir dos PU-QUALITY_GATEs
  - id: "QG-{PREFIX}-01"
    name: "{Nome}"
    transition: "{fase} -> {fase}"
    blocking: true
    criteria: "{Criterio do processo original}"

dependencies:
  required: []
  optional: []
```

### Step 3: Generate Agents

Para cada agente no blueprint, gerar arquivo `.md` em `04-squad/agents/`.

**Profundidade minima OBRIGATORIA (bloqueante em QG-SF-004):**

| Metrica | Minimo | Por que |
|---------|--------|---------|
| Linhas totais | >=250 | Squad-forge ele mesmo: 259 (chief), 367 (archaeologist), 446 (smith). Agente <250 e raso |
| OUTPUT EXAMPLES | >=3 cenarios concretos | Sem exemplos, LLM nao tem referencia do que produzir |
| IMMUNE SYSTEM triggers | >=3 | Sem protecao, agente desvia em casos atipicos |
| Frases-Chave | >=5 | Voice DNA so funciona com material de referencia |
| Estilo de Comunicacao | >=3 bullets | Tom precisa ser explicito, nao implicito |

**Se qualquer metrica falhar:** assemble-squad NAO PASSA QG-SF-004 e entra em self-healing loop (Step 9.5).

**Formato OBRIGATORIO:**

```markdown
# Agent: {agent-id}

**ID:** {agent-id}
**Tier:** {Orchestrator|Tier 1|Tier 2}
**Version:** 1.0.0

---

## IDENTIDADE

### Proposito
{Baseado no rationale do blueprint. Min 2 paragrafos explicando POR QUE este agente existe e nao outro.}

### Dominio de Expertise
{Lista de 4-7 dominios baseados nos PUs cobertos. Especifico, nao generico.}

### Personalidade (Voice DNA)
{Tom em paragrafo: como esse agente fala, qual a postura. Min 2-3 frases concretas.}

### Estilo de Comunicacao
- {Bullet 1: caracteristica + exemplo de fala}
- {Bullet 2: caracteristica + exemplo de fala}
- {Bullet 3: caracteristica + exemplo de fala}
{Minimo 3 bullets, cada um com exemplo entre aspas}

### Frases-Chave
- "{Frase 1 do agente — extraida do tom do dono ou do dominio}"
- "{Frase 2}"
- "{Frase 3}"
- "{Frase 4}"
- "{Frase 5}"
{Minimo 5 frases. Vocabulario do usuario.}

---

## RESPONSABILIDADES CORE

### {Responsabilidade 1: nome curto}

**Nivel de Autoridade:** {Total|Compartilhada|Limitada}
**Task Associada:** {nome-da-task}
**Referencia:** {arquivo da KB se existir}

{Descricao da responsabilidade. Min 1 paragrafo + 1 lista de sub-acoes.}

### {Responsabilidade 2}
...

{Minimo 2 responsabilidades core, idealmente 3-4.}

---

## OUTPUT EXAMPLES (OBRIGATORIO — minimo 3)

### Exemplo 1: Happy path — {cenario tipico do processo}

**Input do usuario:**
"{exemplo concreto de pedido extraido de um PU-STEP de inicio}"

**Output do agente:**
{Output completo que o agente produziria. Nao resumir — mostrar o entregavel real, do tamanho que sairia. Min 10 linhas.}

### Exemplo 2: Decisao — {cenario de PU-DECISION especifico}

**Input do usuario:**
"{cenario que ativa um PU-DECISION}"

**Output do agente:**
{Como o agente decide e o que entrega em cada branch. Min 10 linhas.}

### Exemplo 3: Excecao — {cenario de PU-EXCEPTION especifico}

**Input do usuario:**
"{cenario de falha extraido de PU-EXCEPTION}"

**Output do agente:**
{Como o agente responde a falha. Min 8 linhas.}

> Sem 3 exemplos concretos extraidos do processo real do usuario, LLM nao tem referencia. Generic = ruim. Concretos = bom.

---

## IMMUNE SYSTEM (OBRIGATORIO — minimo 3 triggers)

| Trigger (situacao de risco) | Resposta Automatica | Origem |
|----------------------------|---------------------|--------|
| {Trigger 1: situacao que NUNCA pode acontecer} | {Resposta protetiva concreta} | PU-EXCEPTION-xxx ou PU-TACIT-xxx |
| {Trigger 2: desvio comum} | {Como o agente bloqueia o desvio} | PU-xxx |
| {Trigger 3: pedido fora de escopo} | {Como o agente recusa ou redireciona} | Rationale do agente |

> Triggers DEVEM ter origem rastreavel em PU. Inventar trigger = falha de extracao, nao de imaginacao.

---

{IF target_audience == "internal" — squad usado SO pelo Euriler na maquina dele:}

## COORDENACAO DE PROJETOS

> Secao incluida porque este squad e de uso INTERNO (so Euriler). Sistema de projetos da Arka.

O {agent_name} trabalha em tarefas que fazem parte de projetos maiores.
O cockpit (`business/cockpit.md`) lista todos os projetos. Cada projeto ativo tem um tracker (`business/campanhas/*/tracker.md`).

**Antes de trabalhar:** ler o tracker do projeto → ver suas tarefas, status, dependencias.
**Depois de trabalhar:** atualizar tracker (Done + data) + adicionar entrada no LOG.
**Se encontrar blocker:** registrar na secao BLOCKERS do tracker.
**Se nao existe tracker:** avisar o usuario.

{ELSE target_audience == "distributed" — squad vai pra aluno/cliente:}

## COORDENACAO DE TRABALHO (opcional)

> Squad e distribuido. NAO assume estrutura especifica de projetos. REGRA AUTOCONTIDO.

Se o usuario tiver um sistema de tracker proprio (qualquer formato), o {agent_name} pode integrar:
- Antes de trabalhar: ler tracker do projeto se existir
- Depois de trabalhar: registrar conclusao se houver convencao

Sem tracker: trabalhar normalmente, manter contexto na conversa.

{END}

> **REGRA AUTOCONTIDO:** seleciona o bloco condicional baseado no `target_audience` perguntado em `start.md` Step 3. Squads distribuidos NAO incluem refs a `business/cockpit.md` nem `business/campanhas/*/tracker.md` (paths privados Arka). Substituir `{agent_name}` pelo nome real e remover marcadores `{IF}` `{ELSE}` `{END}` na geracao final.

---

## COMMANDS

| Comando | Descricao |
|---------|-----------|
| `*{cmd}` | {descricao acionavel — verbo + objeto} |
| `*status` | Mostrar estado do trabalho atual |
| `*help` | Listar comandos |
| `*exit` | Sair |

---

## STRICT RULES

### O {agent} NUNCA:
- {Regra 1 derivada de PU-EXCEPTION ou PU-QUALITY_GATE}
- {Regra 2}
- {Regra 3}
{Minimo 5 regras NUNCA, derivadas dos PUs.}

### O {agent} SEMPRE:
- {Regra 1 derivada de PU-STEP ou PU-TACIT}
- {Regra 2}
- {Regra 3}
{Minimo 5 regras SEMPRE, derivadas dos PUs.}

---

## ERROR HANDLING

| Cenario | Acao |
|---------|------|
| {Cenario 1 de falha — de PU-EXCEPTION} | {Acao concreta} |
| {Cenario 2} | {Acao} |
| {Cenario 3} | {Acao} |

---

**Agent Status:** Ready for Production
```

**Regras de geracao concretas:**

1. **Nada de placeholder generico no output final.** `{Baseado nos PUs}` e instrucao pra ti, nao texto pro arquivo. Substituir por conteudo real.
2. **Vocabulario do usuario sempre.** Se o dono fala "lance", "carrossel", "criativo" — usar esses termos. Nao inventar "asset visual" se ele diz "criativo".
3. **Output Examples sao do processo real.** Cada cenario referencia PU especifico (rastreavel). Sem isso, e ficcao.
4. **Immune System triggers sao do processo real.** Cada trigger tem origem em PU-EXCEPTION ou PU-TACIT.
5. **Profundidade > Brevidade.** Agente raso = squad ruim. Sem excecao.

### Step 4: Generate Tasks

Para cada task no blueprint, gerar arquivo `.md` em `04-squad/tasks/`:

**TASK-FORMAT-SPECIFICATION-V1 — 8 campos obrigatorios:**

```yaml
---
task: "{Nome da Task}"
responsavel: "@{agent-id}"
responsavel_type: "{agent|human|hybrid|worker}"
atomic_layer: "task"
Entrada: |
  {Inputs — derivados de PU-INPUTs}
Saida: |
  {Outputs — derivados de PU-OUTPUTs}
Checklist:
  - "{criterio 1 — de PU-QUALITY_GATE}"
  - "{criterio 2}"
execution_type: "{deterministic|semantic|interactive}"
---

# Task: {Nome}

## Executive Summary
{O que esta task faz, baseado nos PUs}

## Steps

### Step 1: {Nome}
{Derivado de PU-STEP}

### Step 2: {Nome}
...

## Error Handling
{Derivado de PU-EXCEPTIONs}
```

**Task start.md especial:**

```yaml
---
task: "Start"
responsavel: "@{chief-agent-id}"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativacao do squad pelo usuario"
Saida: "Squad ativo, greeting exibido, pronto pra operar"
Checklist:
  - "Chief ativo"
  - "Greeting exibido"
  - "Primeiro comando executado"
execution_type: "interactive"
---
```

### Step 5: Generate Workflow

Gerar `04-squad/workflows/wf-{squad-name}.yaml`:

```yaml
name: "wf-{squad-name}"
version: "1.0.0"
description: "{Baseado no processo}"
trigger: "{Como o workflow inicia}"

phases:
  - phase: 0
    name: "{Nome}"
    tasks:
      - "{task-name}"
    agent: "@{agent-id}"
    blocking: true
    duration: "{estimativa}"
    quality_gate: "QG-{PREFIX}-01"

  - phase: 1
    # ...

# Quality gates derivados do processo
quality_gates:
  - id: "QG-{PREFIX}-01"
    transition: "phase_0 -> phase_1"
    criteria: "{Do PU-QUALITY_GATE original}"
    blocking: true
```

### Step 6: Generate Knowledge Base (ARTEFATO PRIMARIO)

**A KB e o cerebro do squad.** Pra squads operacionais (trafego, conteudo, vendas, processos de negocio), a KB e o que faz o squad funcionar ou nao. Tasks definem O QUE fazer; KB define COMO fazer com profundidade.

**REGRA: KB e artefato primario, nao arquivo de suporte.** Deve ser gerada ANTES de checklists e README (que sao supporting files).

#### Step 6a: Classificar tipo de squad

| Tipo | Exemplos | KB esperada |
|------|----------|-------------|
| **Operacional** | Trafego, conteudo, vendas, atendimento | Rica: protocolos, decision trees, tabelas, regras cardinais, exemplos |
| **Dev/Tecnico** | CI/CD, code review, testes | Moderada: padroes, convencoes, checklists |
| **Analitico** | Pesquisa, diagnostico, auditoria | Rica: frameworks, criterios, benchmarks, heuristicas |
| **Criativo** | Roteiros, design, copy | Rica: templates, referencias, voice DNA, anti-padroes |

**Se operacional/analitico/criativo:** KB DEVE ter profundidade proporcional ao processo. Skeleton de 3 secoes NAO e aceitavel.

#### Step 6b: Build-time vs Runtime — Internalizar fontes externas

> **REGRA AUTOCONTIDO (NON-NEGOTIABLE).** Squads sao distribuidos pra alunos. Aluno NAO tem o repo do Euriler. Se squad referencia `docs/knowledge/...`, `squads/etlmaker/kbs/...`, `business/...` em runtime, quebra. Fontes sao **build-time inputs**, NAO runtime references. Ver REGRA AUTOCONTIDO no `agents/forge-smith.md`.

**Detectar fontes externas relevantes (so leitura, NAO referencia):**

```bash
# Checar em docs/knowledge/euriler-business/
ls docs/knowledge/euriler-business/*{slug}*/ 2>/dev/null

# Checar em squads/etlmaker/kbs/
ls squads/etlmaker/kbs/*{slug}*/ 2>/dev/null

# Outras fontes possiveis: docs/knowledge/euriler-mind/, business/, ~/euriler-brain/
```

**Se fonte externa existir:**

NAO referenciar. **PROCESSAR e INTERNALIZAR:**

1. **Ler o conteudo completo** da fonte (volumes ETL, KBs, transcricoes)
2. **Extrair o que e relevante** pro escopo do squad — NAO copiar tudo
3. **Adaptar ao contexto dos agentes do squad** — re-sintetizar pra que cada agente saiba COMO usar essa info especificamente
4. **Escrever arquivos NOVOS** em `squads/{name}/data/{nome-tematico}.md` como conteudo proprio do squad
5. **Citar proveniencia em comentario de cabecalho** (opcional, build-time only):
   ```markdown
   <!-- Adaptado de docs/knowledge/euriler-business/trafego-andromeda/ em build-time. Squad runtime nao referencia esse path. -->
   ```
6. **NAO criar links/imports/symlinks** pra arquivos fora de `squads/{name}/`
7. **NAO escrever** "Ver KB completa em {path-externo}" em lugar nenhum

**Se fonte NAO existir:**

Compor KB a partir dos PUs extraidos (Step 6c). Profundidade proporcional ao tipo (Step 6d).

---

**Exemplo do que e errado (PROIBIDO):**

```markdown
# Squad Trafego Pago — KB

Para detalhes operacionais, ver:
- `docs/knowledge/euriler-business/trafego-andromeda/VOL-03-escala.md`
- `squads/etlmaker/kbs/criativos/VOL-02-templates.md`
```

(Squad assim quebra na maquina do aluno. Confronto explicito do Euriler 05/05/2026: "É a maior burrice que ja vi.")

**Exemplo do que e certo (OBRIGATORIO):**

```markdown
<!-- Adaptado de docs/knowledge/euriler-business/trafego-andromeda/ em build-time -->
# Squad Trafego Pago — KB

## Protocolo de Escala (operacional)

Apos campanha atingir CPA-target por 3 dias consecutivos:
1. Aumentar orcamento 20-50% por dia (nunca mais que 50%)
2. Trading de orcamento horario: 6h-22h x1.5, 22h-6h x0.5
3. Se CPA subir >30% em 24h, voltar ao orcamento anterior

## Decision Tree — Quando matar adset

(arvore completa aqui, nao "ver em outro lugar")

| Cenario | Acao |
|---------|------|
| ROAS < 1.5 por 2 dias | Pausar |
| ROAS < 2.0 por 5 dias | Pausar |
| Frequency > 4 e CTR caindo | Refresh criativo |
```

#### Step 6c: Compor KB a partir dos PUs

Cada tipo de PU alimenta uma secao diferente da KB:

| PU Type | Secao na KB | O que capturar |
|---------|-------------|----------------|
| STEP (operacional) | Protocolos / Procedimentos | O COMO detalhado, nao so o O QUE |
| DECISION | Decision Trees / Regras | Condicoes, branches, criterios com exemplos |
| EXCEPTION | Excecoes e Troubleshooting | Falhas, causas, respostas, planos B |
| QUALITY_GATE | Criterios de Qualidade | Metricas, thresholds, checklists de validacao |
| TACIT | Regras Cardinais / Heuristicas | Conhecimento implicito tornado explicito |
| INPUT/OUTPUT | Glossario / Referencias | Definicoes, formatos, exemplos |

**Template de KB rica:**

```markdown
# {Squad Name} — Knowledge Base

## Regras Cardinais
{Top 5-10 regras inegociaveis do processo, ranqueadas por importancia}
{Cada regra com: enunciado + contexto + exemplo + anti-padrao}

## Protocolos Operacionais
{Procedimentos passo-a-passo pra cada operacao core}
{Decision trees com condicoes e branches}
{Tabelas de referencia (cenario → acao)}

## Decision Trees
{Arvores de decisao derivadas de PU-DECISIONs}
{Formato visual (texto) com branches claros}

## Tabelas de Referencia
{Lookup tables: cenario → acao → timing → observacao}
{Metricas e benchmarks}

## Excecoes e Troubleshooting
{Falhas conhecidas + diagnostico + resolucao}
{Derivado de PU-EXCEPTIONs}

## Glossario
{Termos do dominio no vocabulario do usuario}

## Analogias e Exemplos
{Metaforas, exemplos praticos, casos reais}
{Preserva a voz do autor/instrutor quando aplicavel}
```

**Regras de composicao:**
- Profundidade > Brevidade. KB rasa = squad burro.
- Preservar exemplos concretos (numeros, cenarios, casos reais) — nao abstrair em regras genericas
- Preservar analogias e metaforas do usuario — sao ferramentas de ensino que ajudam a LLM
- Tabelas de referencia sao obrigatorias quando o processo tem decisoes por cenario
- Decision trees sao obrigatorias quando o processo tem bifurcacoes complexas
- Anti-padroes sao tao importantes quanto padroes — documentar O QUE NAO FAZER

#### Step 6d: Validar cobertura e profundidade da KB (BLOQUEANTE)

**Checks quantitativos OBRIGATORIOS (BLOQUEIA QG-SF-004 se falhar):**

| Check | Minimo | Por que |
|-------|--------|---------|
| Total linhas de KB | >=500 | Squad operacional precisa profundidade. Spec promete "Regras Cardinais + Decision Trees + Protocolos + Tabelas + Glossario" — nao cabe em 200 linhas |
| Tabelas de referencia | >=1 (formato `\| cenario \| acao \|`) | Lookup tables sao ferramenta primaria de squad operacional |
| Decision trees | >=1 se processo tem PU-DECISION com 2+ branches | Decisoes documentadas com criterios viram capacidade do squad |
| Regras Cardinais | >=3 com `enunciado + contexto + exemplo + anti-padrao` | Regras sem exemplo/anti-padrao sao opiniao, nao operacional |

**Checklist de cobertura qualitativa:**

- [ ] Cada PU-TACIT esta representado na KB (regras cardinais ou heuristicas)
- [ ] Cada PU-DECISION com 2+ branches tem decision tree na KB
- [ ] Cada PU-STEP operacional tem protocolo detalhado (nao so mencionado na task)
- [ ] Cada PU-EXCEPTION critica tem troubleshooting na KB
- [ ] Se ETL existe: conteudo operacional do ETL esta incorporado (nao resumido)
- [ ] KB usa o vocabulario do usuario (nao termos inventados)

**Tipos de squad e KB minima esperada:**

| Tipo do squad | Linhas minimas KB | Justificativa |
|--------------|-------------------|---------------|
| Operacional (trafego, conteudo, vendas) | >=800 | Squad opera diariamente — KB e o cerebro |
| Analitico (pesquisa, diagnostico) | >=600 | Frameworks + criterios + benchmarks |
| Criativo (roteiros, copy) | >=600 | Templates + voice DNA + anti-padroes |
| Dev/Tecnico (CI/CD, code review) | >=400 | Padroes + convencoes + checklists |

**Se nao atinge minimo:** HALT, completar ate atingir antes de prosseguir. Nao "passa com warning" — bloqueia.

### Step 7: Generate Supporting Files

**Checklists** (se processo tem quality gates):

```markdown
# Checklist: {Nome}

- [ ] {Criterio 1 — de PU-QUALITY_GATE}
- [ ] {Criterio 2}
- [ ] {Criterio 3}
```

**README.md:**

```markdown
# {Squad Title}

{Descricao}

## Ativacao
/{slashPrefix}

## Agentes
| Agente | Role |
|--------|------|
| @{agent} | {role} |

## Pipeline
{Workflow resumido}
```

### Step 8: Self-Audit Quantitativo (OBRIGATORIO antes do validator externo)

> Este step existe porque o squad-forge ja gerou squads superficiais no passado (gestor-andromeda: agentes 91-136 linhas, KB 679 linhas total). Squad-validator.js externo nao checa profundidade — checa estrutura. Profundidade e responsabilidade do Smith.

**Rodar checks quantitativos:**

```bash
# Para cada agente
for agent in 04-squad/agents/*.md; do
  lines=$(wc -l < "$agent")
  examples=$(grep -c "^### Exemplo" "$agent")
  triggers=$(grep -c "^| {.*} |" "$agent" || grep -A100 "IMMUNE SYSTEM" "$agent" | grep -c "^|")
  frases=$(grep -A20 "Frases-Chave" "$agent" | grep -c '^- "')

  if [ "$lines" -lt 250 ]; then echo "FAIL: $agent tem $lines linhas (min 250)"; fi
  if [ "$examples" -lt 3 ]; then echo "FAIL: $agent tem $examples exemplos (min 3)"; fi
  if [ "$triggers" -lt 3 ]; then echo "FAIL: $agent tem $triggers triggers immune (min 3)"; fi
  if [ "$frases" -lt 5 ]; then echo "FAIL: $agent tem $frases frases-chave (min 5)"; fi
done

# Para a KB
kb_lines=$(wc -l 04-squad/data/*.md | tail -1 | awk '{print $1}')
tabelas=$(grep -c "^|" 04-squad/data/*.md)
# (... outros checks de KB conforme thresholds da Step 6d ...)

# REGRA AUTOCONTIDO — grep por refs externas proibidas (BLOQUEANTE)
forbidden_patterns=(
  "docs/knowledge/euriler-business"
  "docs/knowledge/euriler-mind"
  "squads/etlmaker/kbs"
  "business/campanhas"
  "business/financeiro"
  "~/euriler-brain"
  "/Users/euriler/"
)

for pattern in "${forbidden_patterns[@]}"; do
  # Excluir comentarios HTML de proveniencia (build-time only)
  hits=$(grep -rn "$pattern" 04-squad/ \
    --include="*.md" --include="*.yaml" \
    | grep -v "<!--.*$pattern.*-->" \
    | grep -v "build-time")
  if [ -n "$hits" ]; then
    echo "AUTOCONTIDO FAIL: ref externa proibida '$pattern' encontrada:"
    echo "$hits"
  fi
done

# Refs absolute paths (qualquer /Users/, ~/, etc fora de comentario)
abs_paths=$(grep -rn -E '(^|[^<!-])\s*[~"]?(/Users/|~/[a-z])' 04-squad/ \
  --include="*.md" --include="*.yaml" \
  | grep -v "<!--" | grep -v "build-time")
if [ -n "$abs_paths" ]; then
  echo "AUTOCONTIDO FAIL: absolute paths encontrados:"
  echo "$abs_paths"
fi
```

**Output esperado:** `audit-report.yaml` em `05-validation/audit-report.yaml`:

```yaml
audit:
  agents:
    - file: "{agent-1}.md"
      lines: 287
      output_examples: 3
      immune_triggers: 4
      frases_chave: 6
      checks_passed: ["lines", "examples", "triggers", "frases"]
      checks_failed: []
      verdict: PASS
    - file: "{agent-2}.md"
      lines: 142  # FAIL
      verdict: FAIL
      reason: "Lines < 250"
  kb:
    total_lines: 723
    tables: 2
    decision_trees: 3
    cardinal_rules: 5
    verdict: PASS
  overall: PASS|FAIL
```

**Self-Healing Loop (max 3 tentativas):**

```
Tentativa 1: rodar audit
  → Se PASS: prosseguir Step 9
  → Se FAIL: identificar agentes/KB rasos, expandir conteudo

Tentativa 2: re-rodar audit
  → Se PASS: prosseguir
  → Se FAIL: aprofundar mais

Tentativa 3: re-rodar audit
  → Se PASS: prosseguir
  → Se FAIL: HALT — reportar ao Chief com lista de gaps de profundidade
```

**Regra:** self-audit FALHA = QG-SF-004 NAO PASSA. Ponto.

---

### Step 9: Automated Validation — squad-validator.js (OBRIGATORIO)

**Este step usa a mesma infraestrutura de validacao do Squad Creator (Craft).**

**Rodar:**
```bash
node .auroq-core/development/scripts/squad/squad-validator.js minds/{slug}/04-squad/
```

O validator checa automaticamente:
- squad.yaml contra JSON Schema
- Estrutura de diretorios (task-first architecture)
- Tasks contra TASK-FORMAT-SPEC-V1 (8 campos)
- Agent definitions
- Workflow YAML (sequence, references)
- Referencias cruzadas

**Self-Healing Loop (OBRIGATORIO se falhar):**

```
Tentativa 1: Rodar validator
  → Se PASS: prosseguir para Step 9
  → Se ERRORS: ler erros, corrigir artefatos

Tentativa 2: Re-rodar validator
  → Se PASS: prosseguir
  → Se ERRORS: corrigir novamente

Tentativa 3: Re-rodar validator
  → Se PASS: prosseguir
  → Se ERRORS: HALT — reportar ao Chief com lista de erros irresolvidos
```

**Regras:**
- ERRORS sao BLOQUEANTES — nao avanca ate resolver
- WARNINGS sao non-blocking — logar no report, nao bloquear
- Max 3 tentativas de self-healing antes de escalar

**Fallback (SOMENTE se script nao existir no path):**

Usar checklist nuclear manual:
- [ ] squad.yaml tem name + version
- [ ] squad.yaml name e kebab-case
- [ ] tasks/ dir existe com >= 1 .md
- [ ] agents/ dir existe com >= 1 .md
- [ ] Cada task tem 8 campos obrigatorios (TASK-FORMAT-SPEC-V1)
- [ ] Cada agent tem frontmatter ou heading com ID
- [ ] Todos os arquivos referenciados em squad.yaml existem
- [ ] Workflow YAML e valido
- [ ] Sem dependencia circular no workflow

### Step 10: Coverage Analysis — squad-analyzer.js (RECOMENDADO)

**Opcional mas recomendado. Gera metricas de cobertura e sugestoes de melhoria.**

```bash
node .auroq-core/development/scripts/squad/squad-analyzer.js minds/{slug}/04-squad/
```

Resultado esperado:
- Inventario de componentes (agents, tasks, workflows, checklists, data)
- Metricas de cobertura (% de diretorios populados, tasks com 8 campos, etc)
- Sugestoes de melhoria (componentes faltantes, boas praticas nao seguidas)

**Se analyzer nao disponivel:** Pular — nao e bloqueante.

### Step 11: Quality Gate — QG-SF-004

**Criterio principal:** Self-audit PASS + squad-validator.js PASS + KB com profundidade

| Criterio | Fonte | Obrigatorio |
|----------|-------|-------------|
| Self-audit PASS (todos agentes >=250 linhas, 3+ exemplos, 3+ triggers, 5+ frases) | Step 8 | Sim |
| squad-validator.js retornou VALID (0 errors) | Step 9 | Sim |
| KB >= linhas minimas pelo tipo (Step 6d) | Step 6d | Sim |
| KB tem >=1 tabela de referencia | Step 6d | Sim |
| KB tem >=1 decision tree (se PU-DECISION com 2+ branches existe) | Step 6d | Sim |
| KB tem >=3 Regras Cardinais com enunciado+contexto+exemplo+anti-padrao | Step 6d | Sim |
| squad-analyzer.js coverage > 70% | Step 10 | Nao (nice to have) |

**Veto conditions (BLOQUEANTES):**

- **REGRA AUTOCONTIDO violada** — qualquer ref externa proibida em arquivo runtime do squad (paths `docs/knowledge/...`, `squads/etlmaker/kbs/...`, `business/...`, `~/euriler-brain/`, absolute paths `/Users/...`). Ver Step 8 grep. **Incluindo `business/cockpit.md` e `business/campanhas/*/tracker.md` em squad com `target_audience: distributed`.**
- **Marcadores condicionais nao-resolvidos** — qualquer `{IF}`, `{ELSE}`, `{END}` ou `{target_audience}` literal em arquivo gerado (geracao final deve resolver e remover).
- Qualquer agente com < 250 linhas
- Qualquer agente sem `## OUTPUT EXAMPLES` ou com < 3 exemplos
- Qualquer agente sem `## IMMUNE SYSTEM` ou com < 3 triggers
- Qualquer agente sem 5+ frases-chave
- KB total < linhas minimas pelo tipo do squad (operacional 800, analitico/criativo 600, dev 400)
- KB sem tabela de referencia
- KB sem decision tree (quando processo tem PU-DECISION com 2+ branches)
- squad-validator.js INVALID apos 3 tentativas de self-healing
- Task sem 8 campos obrigatorios (TASK-FORMAT-SPEC-V1)
- squad.yaml invalido

> Razao do rigor: o squad-forge ja gerou squads superficiais (gestor-andromeda: agentes 91-136 linhas, KB 679 linhas total). Sem hard gates, regride. Hard gates = nunca mais.

---

## Outputs

```
minds/{slug}/04-squad/
  squad.yaml
  README.md
  agents/
    {agent-1}.md
    {agent-2}.md
    ...
  tasks/
    start.md
    {task-1}.md
    {task-2}.md
    ...
  workflows/
    wf-{squad-name}.yaml
  checklists/
    {checklist-1}.md
  data/
    {squad-name}-kb.md
```

---

**Task Status:** Ready for Production
