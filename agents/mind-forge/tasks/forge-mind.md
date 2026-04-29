# Task: forge-mind

## Objetivo

Transformar o mapa de conhecimento validado em uma mente operacional completa: agent.md, KB, tasks, config.yaml e skill.md.

## Trigger

- Handoff automatico da Fase 3 (playback-validate)

## Pre-condicoes

- Fase 3 completa (QG-MF-003 passed — usuario validou)
- knowledge-facets.yaml, domain-map.yaml, voice-profile.yaml atualizados

## Agente Executor

@mind-smith

## Referencia Obrigatoria

- `agents/mind-forge/templates/agent-tmpl.md` — template do agent
- `agents/mind-forge/templates/kb-tmpl.md` — template da KB
- `agents/mind-forge/templates/config-tmpl.yaml` — template do config
- `agents/mind-forge/data/forge-kb.md` — referencia de qualidade
- o primeiro consultor/mente bem-feita do sistema — usar como padrao-ouro
- a KB mais completa disponivel no sistema — usar como referencia

## Passos

### Step 1: Gerar KB

Seguir o padrao de referencia. A KB e o coracao da mente.

**Estrutura obrigatoria:**

1. **Visao Geral** — tabela de experts (sintetica) ou overview da metodologia (consultor)
2. **Principios Universais** — convergencias ou fundamentos
3-N. **Dominios** — 1 capitulo por dominio, cada um com:
   - Frameworks (nome + passos)
   - Heuristicas (formato SE/ENTAO)
   - Anti-padroes (com consequencia)
N-2. **Caixa de Ferramentas** — tabela situacao → ferramenta/acao
N-1. **Heuristicas Mestras** — top 15-20 em formato SE/ENTAO
N. **Output Examples** — pelo menos 1 por modo principal

**Regras criticas:**
- Organizar por DOMINIO, nunca por fonte/expert
- Cada dominio deve ter mix de tipos
- Heuristicas em formato SE/ENTAO (nao "e importante fazer X")
- Output examples devem ser completos (input → output)
- Minimo 300 linhas
- **Priorizar por Pareto Zone:** Crown Jewels devem ter posicao de destaque (Principios Universais, Heuristicas Mestras). KFs Excellence detalhados com exemplos. KFs Impact inclusos em formato padrao. KFs Filler avaliar se vale incluir — na duvida, descartar
- **Citacoes verificaveis:** Manter `source_ref` granular nos KFs mais importantes (Crown Jewel + Excellence) para que o usuario possa voltar na fonte se quiser

**Output:** `04-forged/data/{mind-slug}-kb.md`

### Step 2: Definir Modos Operacionais

Analisar os KFs e propor 2-4 modos:

**Sintetica (default):**
- Juiz/Diagnostico — avaliar algo existente
- Arquiteto/Criacao — criar algo novo
- Otimizador/Melhoria — melhorar algo existente
- Consultor/Q&A — perguntas genericas

**Consultor (default):**
- Professor/Ensino — explicar a metodologia
- Aplicador/Execucao — aplicar ao caso do usuario
- Auditor/Avaliacao — avaliar contra a metodologia
- Consultor/Q&A — perguntas genericas

Adaptar modos conforme os KFs justificam. Nem toda mente precisa de 4 modos.

### Step 3: Gerar agent.md

Usando o template e os dados da analise, gerar agent completo:

- **IDENTIDADE:** proposito, dominio, voice DNA, frases-chave
- **MODOS DE OPERACAO:** cada modo com trigger, protocolo, formato de output
- **PRINCIPIOS INEGOCIAVEIS:** top 5-10 principios dos KFs
- **IMMUNE SYSTEM:** >= 3 triggers de anti-padroes + respostas automaticas
- **BASE COGNITIVA:** referencia a KB
- **STRICT RULES:** >= 5 NUNCAs + >= 5 SEMPREs
- **GREETING:** texto de ativacao
- **COMMAND ROUTER:** comandos + mapeamento de linguagem natural

**Voice Fusion (sintetica):**
- Expert dominante como ancora (60% do tom)
- Vocabulario dos demais incorporado naturalmente
- Frases-chave proprias da mente fundida
- Vocabulario proibido = uniao dos "never_use"

**Output:** `04-forged/agents/{mind-slug}.md`

### Step 4: Gerar Tasks

**Task obrigatoria:** `start.md`
```markdown
# Task: start
Ler e adotar persona de agents/{mind-slug}.md.
Carregar KB de data/{mind-slug}-kb.md com prioridade ALTA.
Exibir greeting. Aguardar comando do usuario.
```

**1 task por modo operacional:** cada task define:
- Objetivo
- Trigger (comando + linguagem natural)
- Protocolo (passos numerados)
- Formato de output rigido
- Error handling
- Completion criteria

**Output:** `04-forged/tasks/start.md`, `04-forged/tasks/{modo}.md`

### Step 5: Gerar config.yaml e skill.md

**config.yaml** seguindo template com:
- name, slash_prefix, version, description
- type: single-mind
- Lista de agents, tasks, knowledge_base

**skill.md** como shim de ativacao:
```markdown
# {mind-slug}
{Descricao curta.}
CRITICAL: First, read and adopt the persona defined in `agents/{mind-slug}/agents/{mind-slug}.md`.
Then, read and execute the task defined in `agents/{mind-slug}/tasks/start.md`.
Follow ALL instructions exactly as written.
```

**Output:** `04-forged/config.yaml`, `04-forged/skill.md`

### Step 6: Self-Check

Antes de entregar, o Smith verifica:

- [ ] KB organizada por dominio (nao por fonte)
- [ ] KB >= 300 linhas
- [ ] >= 2 frameworks completos na KB
- [ ] >= 10 heuristicas SE/ENTAO na KB
- [ ] Output examples presentes (>= 1 por modo principal)
- [ ] Agent tem immune system com >= 3 triggers
- [ ] Agent tem NUNCA (5+) + SEMPRE (5+)
- [ ] Agent tem greeting
- [ ] Agent tem command router
- [ ] config.yaml valido
- [ ] Todas as tasks tem os 8 campos

Se falhar em qualquer item: corrigir e re-verificar (max 3 tentativas).

### Step 7: Quality Gate QG-MF-004

Validar checklist `checklists/mind-quality.md` completo.

**Veto:** Agent incompleto ou KB < 100 linhas.

### Step 8: Atualizar State e Handoff

```json
{
  "phase_status": { "phase_4": "completed" },
  "current_phase": 5,
  "quality_gates_passed": ["QG-MF-001", "QG-MF-002", "QG-MF-003", "QG-MF-004"]
}
```

Handoff de volta para @forge-chief com task `validate-mind`.

## Formato de Output

```
04-forged/
  config.yaml
  skill.md
  agents/{mind-slug}.md
  data/{mind-slug}-kb.md
  tasks/start.md
  tasks/{modo-1}.md
  tasks/{modo-2}.md
  ...
```

## Error Handling

| Cenario | Acao |
|---------|------|
| KFs insuficientes pra KB rica | Reportar ao chief, indicar gaps |
| Nao consegue definir modos | Usar modos default + flag pro chief |
| KB abaixo de 300 linhas | Enriquecer dominios com mais detalhe |
| Self-check falha 3x | Escalar pro chief com diagnostico |

## Completion Criteria

- Todos os artefatos gerados em 04-forged/
- Self-check passou
- QG-MF-004 passou
- Handoff executado
