# Como o Auroq OS funciona por dentro

> Arquivo de consulta. Não carrega em toda conversa: leia quando o aluno perguntar "como funciona",
> quando for explicar o sistema ou quando a tarefa precisar desse mapa. As regras de trabalho estão
> no `AGENTS.md` da raiz da pasta e em `.claude/rules/`; em conflito, elas valem sobre este texto.
> Este arquivo é do sistema: a atualização troca.

## A ideia

O Auroq OS transforma o Claude Code (ou o Codex) num centro de comando do negócio do aluno.

- **Pensar com IA:** decisões, planos e estratégia, com a IA como parceira.
- **Fazer com IA:** o aluno pede, a equipe de IA executa, o aluno confere e aprova.
- **Lembrar com IA:** o que foi decidido e aprendido fica salvo na pasta e cresce com o uso.

Fórmula: repertório + IA = resultado. O aluno domina o **o quê** (o que fazer e se ficou bom);
a IA domina o **como**.

## Quem é quem na equipe

| Tipo | O que é | Exemplo |
|------|---------|---------|
| **Companion** | Chefe da equipe e parceiro do aluno. Situa, lembra, pensa junto e chama quem faz | `/auroq-companion` |
| **Mentes** | Pensam e julgam: consultam, mentoram, avaliam | Clone, mente sintética, consultor |
| **Workers** | Executam uma função (um cargo) | um worker de atendimento |
| **Squads** | Vários agentes com etapas e conferência de qualidade | Squad de conteúdo, de anúncios |
| **Ops** | O técnico: instala, atualiza, conserta, conecta | `/AuroqOS:agents:ops` |
| **Forjas** | Criam agentes novos para o negócio do aluno | Squad Forge, Mind Forge, Worker Forge, Clone Forge, ETLmaker |

Subtipos de mente: **Clone** (replica uma pessoa real), **Mente sintética** (junta vários
especialistas num agente só) e **Consultor** (empacota o conhecimento de um assunto).

Cada agente pode servir de **mentor** ("o que eu faço?"), **juiz** ("tá bom?") ou **executor** ("faz").
Num squad os papéis ficam separados: quem coordena não executa, quem executa não aprova o próprio
trabalho, quem julga não cria.

**Como isso aparece para o aluno:** ele só fala com o Companion. O Companion escolhe e aciona o
squad, a skill ou o agente certo sozinho, confere e entrega. O aluno não precisa saber o nome de ninguém.

## Onde mora cada coisa

```
pasta-do-negocio/
├── AGENTS.md               # regras de base (Claude, Codex, Grok) — do sistema
├── .claude/
│   ├── CLAUDE.md           # porta de entrada do Claude Code (importa o AGENTS.md)
│   ├── rules/              # regras do sistema + custom-do-aluno.md (do aluno)
│   ├── commands/           # atalhos dos agentes (/auroq-companion, /AuroqOS:agents:ops...)
│   ├── output-styles/      # estilo de resposta Direto
│   └── hooks/              # automações (Synapse, sincronização, histórico)
├── .auroq-core/            # núcleo do sistema (constitution, configuração) — não mexer
├── .synapse/               # lembretes curtos que o sistema injeta em cada conversa
├── agents/companion/data/  # memória: onde paramos, decisões, padrões, pendências
├── business/               # o negócio: cockpit, campanhas, processos, vault (fora do git)
└── docs/knowledge/         # conhecimento do aluno
    ├── expert-mind/        # quem o aluno é: propósito, identidade, valores, tom de voz, história
    └── expert-business/    # o que ele faz: posicionamento, público, método, produtos
```

Os nomes `expert-mind/` e `expert-business/` ficaram assim por compatibilidade; o conteúdo é do aluno.
A equipe da Arcane (Companion interno, Consultor, forjas, Pack) não fica no disco: chega ao vivo pelo
MCP `arcane`.

## Constitution (resumo)

Texto completo em `.auroq-core/constitution.md`.

| Artigo | Princípio |
|--------|-----------|
| I | O terminal é o centro de comando: o negócio passa pela pasta, ferramentas externas são braços |
| II | Cada um faz o seu: o técnico (push forçado, MCP, infraestrutura, atualização) é do Ops |
| III | Documentar é investir: o que não está escrito se perde |
| IV | Não inventar: fato, número e prova precisam de fonte |
| V | Qualidade com julgamento: o aluno aprova as entregas importantes |
| VI | Evolução incremental: reusar antes de adaptar, adaptar antes de criar |

## Jeito de trabalhar de todo agente

- **Plano antes de execução** em trabalho grande: o plano é a coleira.
- **Documento de trabalho atualizado** a cada etapa: sobrevive à compactação da conversa e serve
  de passagem de bastão para qualquer agente.
- **Sem viagem:** faz o pedido, não inventa melhoria; mudança de rumo só com o aluno.
- **Sem bagunça:** tarefas com entrada e saída claras, documentos valem mais que conversa,
  conferência antes de aceitar a entrega.

Premissas: faça primeiro e documente depois; ninguém cuida do negócio como o dono; resolva a dor de
agora; a certeza vem do uso; nada volta para o zero.

## Ciclos

**Dia a dia:** situar ("onde estou?") → priorizar ("o que dói mais?") → executar → documentar →
refinar (melhorar agentes e processos). Cada volta deixa o sistema mais forte.

**Conversa:** o Companion carrega onde paramos, mostra o que importa, o aluno escolhe o foco, a
equipe trabalha, no fim de cada tarefa a memória é salva e, quando o aluno pede, o trabalho é salvo
e entregue no GitHub.

**Semana:** sem revisão há 7 dias ou mais, o Companion propõe uma revisão de 20 minutos (cockpit,
trackers, pendências, padrões).

**Projeto:** nasce no cockpit com tracker e fases → os agentes trabalham e atualizam o tracker →
termina com uma retrospectiva de 3 perguntas e vai para o arquivo, abrindo vaga para o próximo.

## Níveis de uso de IA

| Nível | Como é |
|-------|--------|
| N0 | Sem IA, na força bruta |
| N1 | IA crua: cada conversa começa do zero |
| N2 | IA com repertório: skills, mentes e contexto que fica |
| N3 | Sistema operacional de IA: equipe coordenada, memória e Companion |

O Auroq OS leva o aluno ao N3.

## Conhecimento, skills e agentes

- **Base de conhecimento:** conhecimento bruto tratado (extraído, limpo, organizado). É o ingrediente.
- **Skill:** IA + base de conhecimento + persona + regras. É o prato.
- Caminho: conhecimento bruto → tratamento (o ETLmaker faz) → base pronta → skill → agente.
  Conhecimento primeiro, execução depois.

Três camadas de contexto que a equipe usa:

| Pergunta | De onde vem |
|----------|-------------|
| Para quem trabalho? | `docs/knowledge/expert-mind/` |
| O que sei fazer? | `docs/knowledge/expert-business/` e o conhecimento que o aluno tratou |
| O que está rolando agora? | `business/campanhas/` e o cockpit |

Tipos de skill: de **identidade** (do aluno, únicas), **técnicas** (copy, tráfego, lançamento) e de
**projeto** (de uma campanha, temporárias).

## Memória

| Camada | Onde | Dura |
|--------|------|------|
| Conversa | o chat | até a compactação |
| Operacional | `agents/companion/data/` | entre conversas |
| Permanente | `docs/knowledge/` e `business/` | para sempre |

Quando salvar: decisão tomada, projeto avançou, conhecimento criado, padrão percebido, tarefa
concluída e conversa encerrando. Regra completa: `.claude/rules/memoria-inteligente.md`.

## Projetos

- Ideias soltas viram pendência; o que vai ser feito entra no **cockpit** (`business/cockpit.md`),
  com no máximo 3 projetos ativos, cada um com a próxima ação definida.
- Receitas que se repetem viram **processos** em `business/processos/`.
- Cada projeto tem um **tracker** (`business/campanhas/{projeto}/tracker.md`): todo agente lê antes de
  trabalhar e atualiza depois (`.claude/rules/project-tracker.md`).

## Salvar é o botão do negócio

Commit aqui não é coisa de programador: é o ponto de restauração do negócio. A mensagem conta o que
aconteceu (`progresso:`, `decisao:`, `processo:`, `agente:`, `conhecimento:`, `campanha:`, `fix:`,
`setup:`), não o que mudou nos arquivos. Entregar (push) manda a cópia para o GitHub privado do aluno.
Ritual em `.claude/rules/puxar-e-entregar.md`.

## Volante

Conhecimento cresce → agentes melhoram → o negócio do aluno anda → o aluno aprende mais → o
conhecimento cresce de novo. Cada uso acelera o próximo.
