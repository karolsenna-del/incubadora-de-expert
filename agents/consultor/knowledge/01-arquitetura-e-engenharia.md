# 01 — Arquitetura e Engenharia do Auroq OS

> Como o sistema é construído por dentro: árvore de pastas, camadas, motor de contexto, constitution e DNA. O consultor usa isto pra responder "onde fica X?", "como o sistema funciona?", "por que está estruturado assim?".

---

## O que é o Auroq OS

Auroq OS é um **Sistema Operacional de IA para Experts**: engenharia de contexto permanente pro Claude Code e Codex CLI. Na prática, são pastas estruturadas com regras, agentes, tasks e conhecimento que ensinam o runtime escolhido a operar como um time de especialistas dentro do negócio do expert.

Não é chatbot, não é automação tipo Zapier, não é ferramenta de dev. É o **centro de comando** onde o expert roda o negócio dele — com a IA como sistema operacional, não como prompt avulso.

Distribuição: o aluno instala via `npx auroq-os init` e atualiza via Ops (`*update`), que baixa a versão nova do npm e preserva os dados dele.

---

## Árvore de Pastas (o mapa)

```
.auroq-core/          ← O FRAMEWORK (motor + regras). Não se mexe à mão.
├── core/synapse/     ← Synapse Engine: o motor de contexto (8 layers)
├── development/      ← agents, tasks, templates, workflows, scripts do framework
├── hooks/unified/    ← hooks de runtime
├── infrastructure/   ← schemas
├── constitution.md   ← os 6 princípios invioláveis
├── core-config.yaml  ← configuração do framework
└── dna-operacional.md← o DNA herdado por todo agente

.claude/              ← A PONTE com o Claude Code
├── commands/         ← slash commands (ativam os agentes)
│   └── AuroqOS/agents/ops.md
├── rules/            ← a "lei": 10 regras contextuais
├── hooks/            ← synapse-engine.cjs, precompact
└── CLAUDE.md         ← instruções globais do projeto

.synapse/             ← runtime do Synapse (sessions, metrics, manifest)

agents/               ← OS AGENTES (8 core + os que o expert criar)
├── companion/        ← parceiro cognitivo (personalizado pelo expert)
├── organizer/        ← higiene do sistema
├── squad-forge/      ← cria squads
├── mind-forge/       ← cria mentes sintéticas
├── worker-forge/     ← cria workers
├── clone-forge/      ← clona mentes reais
└── etlmaker/         ← extrai conhecimento → KB

business/             ← ONDE O EXPERT RODA O NEGÓCIO
├── cockpit.md        ← fonte única de verdade dos projetos
├── campanhas/        ← projetos ativos (cada um com tracker.md)
├── processos/        ← playbooks/SOPs reutilizáveis
├── vault/            ← credenciais (gitignored, nunca commita)
└── templates/        ← moldes (tracker, campanha)

docs/knowledge/       ← O EXOCÓRTEX (memória permanente)
├── expert-mind/      ← identidade, valores, tom, história do expert
├── expert-business/  ← posicionamento, público, metodologia
└── biblioteca-pmi/   ← conhecimento tratado (Propósito, Marketing, IA)

bin/                  ← o instalador (auroq-os.js)
```

---

## As 4 Camadas de Mutabilidade (L1–L4)

O sistema separa o que é framework (atualiza via Ops) do que é dado do expert (nunca sobrescreve). Isso é o que permite **atualizar sem perder nada**.

| Camada | O que é | Mutabilidade | Onde |
|--------|---------|--------------|------|
| **L1** Framework Core | motor, constitution | NUNCA mexer | `.auroq-core/core/`, `constitution.md` |
| **L2** Framework Templates | agentes core, rules, hooks | extend-only | `.auroq-core/development/`, `.claude/rules/`, meta squads |
| **L3** Project Config | config, manifest | mutável | `core-config.yaml`, `.synapse/manifest` |
| **L4** Project Runtime | dados do expert | SEMPRE preservar | `business/`, `docs/knowledge/`, `companion/data/`, squads criados, `minds/` |

**Regra de update (Ops `*update`):** copia L1/L2/L3 (sobrescreve) · NUNCA toca L4 · preserva `minds/` dentro dos meta squads · não sobrescreve Companion personalizado nem CLAUDE.md customizado.

---

## Synapse Engine — o motor de contexto

O Synapse é a engenharia que monta, a cada interação, o contexto que o Claude Code enxerga — em **camadas** (layers), da mais fundamental pra mais específica. Não é prompt: é contexto montado por regras.

| Layer | Responsabilidade |
|-------|------------------|
| **L0** Constitution | os princípios invioláveis carregam primeiro |
| **L1** Global | regras globais do projeto |
| **L2** Agent | persona do agente ativo |
| **L3** Workflow | o workflow em execução |
| **L4** Task | a task atual (inputs/outputs) |
| **L5** Squad | contexto do squad |
| **L6** Keyword | regras que carregam por palavra-chave/path |
| **L7** Star-command | comandos `*` do agente |

Componentes: `engine.js` (orquestra), `context-builder.js` (monta), `memory-bridge.js` (liga à memória), `hook-runtime.js` (roda hooks), `formatter.js` (formata saída). Roda via hook `synapse-engine.cjs` registrado no Claude Code.

**Por que importa pro expert:** ele não precisa "lembrar de dar contexto". O Synapse injeta a constitution, a persona certa, as regras do path em que ele está mexendo — automaticamente. É o que faz o sistema parecer que "já sabe".

---

## A Constitution — 6 artigos invioláveis

Governam TODO agente, squad, worker e mind. Gates automáticos bloqueiam violações.

| # | Artigo | O que significa | Severidade |
|---|--------|-----------------|------------|
| I | **O terminal é o Centro de Comando** | Todo negócio passa pelo projeto Auroq via Claude Code ou Codex. Ferramentas externas (Meta, Hotmart) são braços, não centros | NON-NEGOTIABLE |
| II | **Cada Um Faz o Seu** | Agentes têm domínios exclusivos. Ops faz git push, Aurora governa, Companion decide com o expert | NON-NEGOTIABLE |
| III | **Documentar = Investir** | Todo trabalho gera documento. O que não é documentado, morre | MUST (BLOCK) |
| IV | **Não Inventar** | Agente executa o planejado, fundamenta em KB/instrução. Não viaja, não adiciona não-pedido | MUST (BLOCK) |
| V | **Qualidade com Julgamento** | Output sem verificação não é output. O expert julga — a IA não se auto-aprova | MUST (BLOCK) |
| VI | **Evolução Incremental** | Nunca do zero. REUSE > ADAPT > CREATE | SHOULD (WARN) |

---

## DNA Operacional — herdado por todo agente

Não é regra externa: é embutido em como cada agente é construído (todo Forge injeta o bloco `DNA_OPERACIONAL`).

1. **Projeto antes de execução** — Briefing → Plano → Execução → Validação. O plano é a coleira do agente.
2. **Documentação contínua** — atualiza o doc de trabalho a cada etapa (autocompact pode apagar o que está só na conversa).
3. **Handoff perfeito** — o documento de trabalho É o handoff. Troca de agente/sessão não perde contexto.
4. **Anti-viagem** — executa o planejado; se precisa mudar o plano, PARA e pergunta.
5. **Anti-entropia** — tasks com I/O definido, separação de papéis, documentos > conversas, quality gates.

---

## As 10 Rules (a lei contextual)

Em `.claude/rules/`. Carregam automaticamente (algumas por path/keyword):

| Rule | O que governa |
|------|---------------|
| `agent-authority.md` | matriz de delegação — quem pode o quê |
| `agent-handoff.md` | compactação de contexto na troca de agentes |
| `commit-inteligente.md` | o ritual de commit (negócio, não código) |
| `dna-operacional.md` | o DNA acima, como regra |
| `evolucao-incremental.md` | REUSE > ADAPT > CREATE |
| `mcp-usage.md` | uso de MCPs e prioridade de ferramentas |
| `memoria-inteligente.md` | quando/o quê/onde salvar |
| `natural-language-first.md` | expert descreve, sistema resolve qual task/agente |
| `project-tracker.md` | protocolo de tracker (antes/durante/depois) |
| `tool-response-filtering.md` | redução de tokens em respostas |

---

## Engenharia de Contexto (o conceito-chave)

O Auroq OS não é "prompt bonito". É **contexto permanente**. A diferença:

- **Prompt:** você digita instruções toda vez. Some quando a sessão acaba.
- **Contexto (Auroq):** as regras, personas, conhecimento e memória vivem em arquivos. O Synapse injeta o pedaço certo na hora certa. O sistema acumula poder em vez de recomeçar do zero.

É por isso que o lugar mais importante de instalar o Auroq não é no Claude Code — é na cabeça do expert. O sistema só amplifica o que ele já sabe; o repertório dele é que avalia o output.

---

*Fonte: repo auroq-os (.auroq-core/constitution.md, dna-operacional.md, core/synapse/, .claude/rules/). Fundação factual — verdade do sistema como ele é hoje.*
