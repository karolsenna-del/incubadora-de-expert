---
task: "Assemble Worker"
responsavel: "@worker-smith"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Proposta validada + KB rascunho"
Saida: "Worker AIOS completo (agent, tasks, KB 4 camadas, config, skill)"
Checklist:
  - "agent.md completo com 4 modos + Role Card + Delegation Map"
  - "5 tasks padrao geradas"
  - "Tasks especificas do dominio geradas"
  - "Foundation KB finalizada (>=500 linhas)"
  - "Playbook inicializado"
  - "Mission Log inicializado"
  - "squad.yaml valido"
  - "skill.md gerada"
  - "Improvement Loop (PDSA) embutido"
  - "Validator pass (se disponivel)"
execution_type: "semantic"
---

# Task: Assemble Worker — Montar Worker AIOS

## Objetivo

Construir a estrutura AIOS completa do worker a partir da proposta validada.

## Posicao no Workflow

Fase 4 do pipeline. Gate: QG-WF-004.

## Passos

### Step 1: Criar Diretorio

```
agents/worker-forge/output/{worker-slug}/
  agents/
    {worker-slug}.md
  tasks/
    start.md
    execute-mission.md
    research-tool.md
    document-process.md
    diagnose-issue.md
    {tasks-especificas}.md
  data/
    {worker-slug}-rules.md     (Rules — operacionais, always loaded)
    {worker-slug}-kb.md        (Foundation KB — on-demand)
    {worker-slug}-playbook.md  (Playbook — SOPs, on-demand)
    {worker-slug}-missions.md  (Mission Log)
  squad.yaml
  skill.md
```

### Step 2: Gerar Agent.md

Seguir template definido no worker-smith agent.
Incluir obrigatoriamente:
- IDENTIDADE (proposito, dominio, personalidade)
- ROLE CARD (da proposta)
- CONTEXT PACK (da proposta)
- DELEGATION MAP (da proposta)
- SCOREBOARD (da proposta)
- 4 MODOS DE OPERACAO (Missao, Pesquisa, Documentacao, Diagnostico)
- **COORDENACAO DE PROJETOS** (protocolo de tracker — ver abaixo)
- KB VIVA — 4 CAMADAS (Rules, Foundation, Playbook, Mission Log)
- IMPROVEMENT LOOP (PDSA)
- STRICT RULES (>= 5 NUNCAs + >= 5 SEMPREs)
- COMMANDS

**Secao COORDENACAO DE PROJETOS (obrigatoria em todo worker):**

Todo worker deve incluir esta secao padrao adaptada ao seu dominio:

```markdown
## COORDENACAO DE PROJETOS

O {worker-name} trabalha frequentemente em tarefas que fazem parte de projetos maiores.
O sistema de projetos usa cockpit + trackers pra coordenar entre agentes.

### Arquivos de Referencia

| Arquivo | O que e |
|---------|---------|
| `business/cockpit.md` | Tabela central de todos os projetos da empresa |
| `business/campanhas/*/tracker.md` | Execucao viva de cada projeto ativo |

### Protocolo

**Antes da missao:**
1. Se a missao se refere a um projeto → ler o tracker do projeto
2. Identificar tarefas do {worker-name}, status e dependencias

**Depois da missao:**
1. Atualizar tracker: marcar tarefa como Done + data
2. Adicionar entrada no LOG: `DD/MM — @{worker-slug}: {o que fez}`
3. Se encontrou blocker: registrar na secao BLOCKERS
4. Se desbloqueou tarefa de outro agente: fica visivel automaticamente

**Se nao existe tracker:** avisar o Euriler.
**Se missao nao faz parte de projeto:** trabalhar normalmente.
```

### Step 3: Gerar Tasks

**5 tasks padrao:**

1. **start.md** — Carregar persona, base (rules + vault), greeting, aguardar. KB e Playbook carregados sob demanda conforme missao
2. **execute-mission.md** — Ciclo: receber -> confirmar -> checar playbook -> checar delegation -> planejar -> executar -> reportar -> documentar
3. **research-tool.md** — Pesquisar ferramenta/plataforma via WebSearch, sintetizar, adicionar a Foundation KB
4. **document-process.md** — Criar/atualizar SOP no Playbook a partir de missao executada
5. **diagnose-issue.md** — Coletar sintomas, consultar KB, investigar, diagnosticar, propor/executar fix, documentar

**Tasks especificas:** 1 por duty que justifique protocolo dedicado.

### Step 4: Finalizar KB (4 camadas)

**Rules** (`data/{slug}-rules.md`):
```markdown
# {Worker Name} — Regras Operacionais

> Regras que nascem de incidentes e aprendizados operacionais.
> Carregar SEMPRE antes de qualquer missao.
> Este arquivo cresce com o tempo. Cada regra deve ter: contexto, motivo e checklist.

(nenhuma regra ainda — este arquivo cresce conforme o worker opera)
```

**Foundation KB** (`data/{slug}-kb.md`):
- Pegar KB rascunho do Knowledge Curator
- Enriquecer com conteudo da proposta
- Garantir >= 500 linhas
- Organizar por dominio/ferramenta

**Playbook** (`data/{slug}-playbook.md`):
```markdown
# {Worker Name} — Playbook

> SOPs e procedures. Cresce a cada missao documentada.
> Consultar ANTES de iniciar qualquer missao. Se ja tem SOP, seguir.
> **Regras operacionais:** ver `{slug}-rules.md` (arquivo separado, carregado no start).

---

## Tier 1 — Recorrentes
(SOPs que rodam frequentemente)

## Tier 2 — Sob demanda
(SOPs que rodam quando pedido)

## Tier 3 — One-shot
(SOPs executados uma vez, mantidos pra referencia)

{Importar SOPs existentes da coleta interna — se houver}

---

## Template de SOP

### [SOP-XXX] {Nome do Processo}
**Criado em:** {data}
**Ultima execucao:** {data}
**Trigger:** {o que dispara}
**Tempo estimado:** {quanto tempo}
**Ferramentas:** {quais}
**Regras obrigatorias:** (nenhuma ainda — preencher quando surgirem)

**Pre-requisitos:**
- {o que precisa}

**Passos:**
1. {passo 1}
   - Verificar: {como saber que deu certo}

**Output esperado:** {o que deve sair}

**Troubleshooting:**
- {problema}: {solucao}
```

**Mission Log** (`data/{slug}-missions.md`):
```markdown
# {Worker Name} — Mission Log

> Historico de missoes executadas. Cresce automaticamente.

| # | Data | Missao | Resultado | SOP Criado? |
|---|------|--------|-----------|-------------|
| | | | | |
```

### Step 5: Gerar squad.yaml e skill.md

Seguir padroes do worker-smith agent.

### Step 6: Self-Check

- [ ] Agent.md completo (todos os blocos obrigatorios)
- [ ] 4 modos padrao presentes
- [ ] Secao COORDENACAO DE PROJETOS presente (cockpit + tracker protocol)
- [ ] KB Foundation >= 500 linhas (300 se dominio simples)
- [ ] Rules file inicializado (vazio, estruturado)
- [ ] Playbook inicializado com tiers (Recorrentes / Sob demanda / One-shot) + template com campo "Regras obrigatorias"
- [ ] Mission Log inicializado com header
- [ ] >= 5 tasks (5 padrao + especificas)
- [ ] Delegation Map com >= 5 decisoes
- [ ] Improvement Loop presente
- [ ] STRICT RULES: >= 5 NUNCAs + >= 5 SEMPREs
- [ ] squad.yaml valido (rules como critical/always no knowledge_base)
- [ ] skill.md gerada
- [ ] Todos arquivos referenciados existem

### Step 7: Rodar Validator (se disponivel)

```bash
node .auroq-core/development/scripts/squad/squad-validator.js agents/{worker-slug}/
```

Se falhar: corrigir e re-rodar (max 3 tentativas).
Se validator nao disponivel: self-check e suficiente.

## Quality Gate: QG-WF-004

| Criterio | Obrigatorio |
|----------|-------------|
| Self-check passou | Sim |
| Validator PASS (se disponivel) | Sim |
| 0 errors | Sim |

**Veto:** Self-check falha em item critico, validator retorna errors.

## Error Handling

| Cenario | Acao |
|---------|------|
| KB insuficiente | Pedir mais pesquisa ao Knowledge Curator |
| Proposta ambigua | Pedir clarificacao ao Chief |
| Validator falha 3x | Escalar pro Chief com diagnostico |
