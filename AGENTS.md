# AGENTS.md — Auroq OS (Claude / Codex / Grok)

Este arquivo define as instrucoes do projeto para qualquer harness CLI
suportado: **Claude Code**, **Codex CLI** e **Grok Build**.

- **Claude Code** e **Grok** carregam `.claude/CLAUDE.md`, `.claude/rules/`,
  `.claude/commands/` e este `AGENTS.md` de forma nativa (Grok via compat Claude).
- **Codex** nao carrega `.claude/*` sozinho — entao este arquivo replica o
  essencial e as skills em `.agents/skills/` (via sync) completam a descoberta.

---

## O que e o Auroq OS

Sistema Operacional de IA pra experts. Voce opera o negocio inteiro pelo
terminal, com agentes especializados pra cada coisa. Constitution formal em
`.auroq-core/constitution.md`.

## Mapa do projeto

- `.auroq-core/` — nucleo do framework (constitution, DNA, configs, scripts). **Nao modificar sem pedido explicito.**
- `agents/<nome>/` — cada agente core. Persona em `agents/<nome>/agents/<nome>.md` + `tasks/` + `knowledge/` + `data/`
- `.claude/commands/` — comandos de ativacao dos agentes (fonte de verdade)
- `.claude/rules/` — regras de operacao (autoridade, memoria, commit, etc.)
- `.synapse/` — Synapse Engine (contexto e memoria do sistema)
- `business/` — **teu** negocio (cockpit, campanhas, processos). Dados teus — nunca sobrescrever.
- `docs/knowledge/` — tua base de conhecimento (expert-mind, expert-business)

---

## Como ativar os agentes por harness

### Codex CLI (`$nome`)

As skills ativaveis vivem em `.agents/skills/`, local oficial de skills de
repositorio do Codex, e sao geradas por
`node scripts/sync-codex-skills.mjs`. O modo local e o padrao porque isola cada
negocio e evita colisao entre projetos. A instalacao global existe apenas como
opcao explicita em `~/.agents/skills/` via `npm run sync:codex:global`. Digite `$nome` pra ativar. Depois de
criar ou atualizar um agente, rode o sync de novo pra a skill aparecer.

### Claude Code e Grok Build

Nao dependem do sync Codex. Use os comandos em `.claude/commands/`
(`/auroq-companion`, `/auroq-squad-forge`, etc.) ou peca pra ativar pelo nome
(`@companion`, "ativa o ops"). Fonte de verdade continua o arquivo do comando e
a persona em `agents/<nome>/` (Ops: `.claude/commands/AuroqOS/agents/ops.md`).

**Grok em especial:** le a camada Claude por padrao e **nao** descobre
`~/.codex/skills` nem exige `sync:codex`. Se algo so existir como skill Codex e
nao em `.claude/commands/`, rode o sync Codex no projeto (nao muda o Grok) ou
ative lendo a persona em `agents/<nome>/` direto.

### Tabela de agentes

| Agente | Ativacao | O que faz |
|--------|----------|-----------|
| Companion | `$companion` / `/auroq-companion` | parceiro cognitivo — situa, lembra, pensa junto, roteia |
| Ops | `$ops` / `@ops` | git, commit, push, deploy, ambiente, `*update` do framework |
| Organizer | `$organizer` / `/auroq-organizer` | organizacao e backup do sistema |
| Consultor | `$consultor` / `/auroq-consultor` | guia do sistema — "como opero?", "como faço X?", duvidas |
| Squad Forge | `$squad-forge` / `/auroq-squad-forge` | cria squads multi-agente |
| Mind Forge | `$mind-forge` / `/auroq-mind-forge` | cria mentes sinteticas |
| Worker Forge | `$worker-forge` / `/auroq-worker-forge` | cria workers |
| Clone Forge | `$clone-forge` / `/auroq-clone-forge` | clona mentes reais |
| ETLmaker | `$etlmaker` / `/auroq-etlmaker` | extrai e estrutura conhecimento |

Qualquer squad/agente que voce criar tambem vira skill no proximo sync Codex;
no Claude/Grok, garanta o comando correspondente em `.claude/commands/`.

**Aceite** `$nome`, `/nome`, `/auroq-nome` e `@nome` como ativacao equivalente:
leia o arquivo em `.claude/commands/auroq-<nome>.md` (ou
`.claude/commands/AuroqOS/agents/ops.md` pro Ops), adote a persona e siga as
instrucoes do arquivo ate `*exit`.

---

## Constitution — principios inegociaveis (replica de `.auroq-core/constitution.md`)

1. **Centro de comando** — toda operacao passa pelo projeto Auroq no terminal, via Claude Code, Codex ou Grok. Ferramentas externas (Meta Ads, Hotmart, n8n) sao bracos, nao centros. *(NON-NEGOTIABLE)*
2. **Cada um faz o seu** — `git commit/push/deploy` e o `*update` do framework sao **EXCLUSIVOS do Ops**. Outro agente delega. *(NON-NEGOTIABLE)*
3. **Documentar = investir** — todo trabalho significativo vira `.md`. O que nao e documentado, morre. *(MUST)*
4. **Nao inventar** — fundamenta em KB, instrucao ou plano. Nao gera dado/numero/fato sem fonte. Se precisa mudar o plano, PARA e pergunta. *(MUST)*
5. **Qualidade com julgamento** — o expert julga; a IA nao se auto-aprova em entregas importantes. *(MUST)*
6. **Evolucao incremental** — `REUSE > ADAPT > CREATE`. Verifica o que ja existe antes de criar. *(SHOULD)*

## DNA Operacional (replica de `.auroq-core/dna-operacional.md`)

1. **Projeto antes de execucao** — trabalho com mais de 3 etapas comeca com plano. O plano e a coleira: executa o que esta nele.
2. **Documentacao continua** — atualiza o documento de trabalho a cada etapa (progresso, decisoes, problemas, estado). Autocompact apaga a conversa, nao o documento.
3. **Handoff perfeito** — o documento de trabalho **e** o handoff. Quem ler sabe onde o trabalho esta.
4. **Anti-viagem** — executa o planejado, nao adiciona "melhorias" nao pedidas. Muda escopo so com aprovacao.
5. **Anti-entropia** — papeis separados (quem executa nao se auto-valida), documentos > conversas, quality gates antes de aceitar output.

## Autoridade de agentes (de `.claude/rules/agent-authority`)

- **Ops** detem exclusivamente `git push`, `commit`, `deploy`, gestao de MCP/infra e `*update`.
- Os **Forges** criam agentes/squads/workers/clones; o **Companion** situa e roteia; o **Consultor** ensina o sistema.
- Um agente nao invade o dominio de outro — **delega**. Em conflito de fronteira, escala pro Companion/expert.

## Comportamento com ferramentas

- Prefira as ferramentas nativas do harness em uso (Claude, Codex ou Grok) pra arquivo, shell e busca local.
- MCP e infra sao responsabilidade do **Ops**.
- Nunca use API paga no Claude/Codex/Grok onde o plano ja resolve — e dinheiro jogado fora.
- Em respostas grandes de ferramenta, filtre ruido e preserve so o relevante.
- Use um runtime por sessao. Antes de trocar entre Claude Code, Codex e Grok, finalize ou documente o estado do trabalho.

## Gates da camada hibrida

- `npm run auroq:sync:codex` — gera/atualiza as skills locais
- `npm run auroq:sync:codex:check` — detecta drift sem escrever
- `npm run auroq:validate` — valida estrutura e comandos
- No repo da distribuicao: `npm run lint && npm run typecheck && npm test && npm run build`

## Memoria e contexto (carregar sob demanda)

Quando o pedido depender de contexto/memoria ja definidos, leia:
- Regras Claude: `.claude/CLAUDE.md`, `.claude/rules/`
- Memoria/Synapse: `.synapse/` (`manifest`, `global`, `context`)
- Teu negocio: `business/cockpit.md`, `business/`, `docs/knowledge/`

## Higiene de uso (do Consultor)

- **Um chat por objetivo**: abre, resolve, o Ops commita + faz push, fecha. Chat-balaio engorda o contexto e a qualidade cai.
- **O agente certo pra cada tarefa** — nao deixa o modelo cru fazer trabalho de especialista.
- **Nao caia na labia da IA** — ela as vezes inventa, alucina ou te limita sem motivo. Questione, confirme, e pergunte no grupo da mentoria quando ela parecer viajando.
