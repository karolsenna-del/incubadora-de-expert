# 03 — Os 8 Agentes Core

> Catálogo de referência dos agentes que vêm no Auroq OS. O consultor usa isto pra responder "qual agente uso pra X?", "o que esse agente faz?", "como ativo?". Comandos confirmados contra as personas do repo.

---

## Matriz de Decisão Rápida

| O aluno quer… | Agente | Ativação |
|---------------|--------|----------|
| Saber onde está, pensar junto, organizar projetos | **Companion** | `/{nome}-companion` |
| Commit, push, atualizar o sistema, bootstrap, health | **Ops** | `/AuroqOS:agents:ops` |
| Diagnosticar bagunça, organizar, limpar, backup | **Organizer** | `/auroq-organizer` |
| Virar um processo manual em squad multi-agente | **Squad Forge** | `/auroq-squad-forge` |
| Criar mente sintética ou consultor de 1 assunto | **Mind Forge** | `/auroq-mind-forge` |
| Criar um worker (funcionário digital) | **Worker Forge** | `/auroq-worker-forge` |
| Clonar uma pessoa real em agente | **Clone Forge** | `/auroq-clone-forge` |
| Transformar conteúdo bruto em KB estruturada | **ETLmaker** | `/auroq-etlmaker` |

> Regra de ativação: **sempre barra (`/`), nunca arroba (`@`)**. O `@` faz o Claude Code interpretar errado.

---

## 1. Companion — o parceiro cognitivo
**Ativação:** `/{nome}-companion` (o aluno escolhe o nome no bootstrap — ex: `/jarvis-companion`)
**Propósito:** O cérebro operacional do sistema. Situa, lembra, pensa junto e roteia. Sem ele, o Auroq OS é pasta morta; com ele, é um SO que opera.
**Quando usar:** Início de toda sessão (briefing), tomar decisão, entender o sistema, registrar decisão, revisar a semana.
**Comandos:** `*situar` (onde estamos), `*pensar` (raciocinar junto), `*rotear` (qual agente usar), `*novo-projeto`, `*review` (weekly), `*memoria`, `*decisao`, `*priorizar`, `*sistema`, `*commit`.
**Entrega:** Briefing situacional, recomendação de foco, roteamento, gestão de projetos e consolidação de memória.

## 2. Ops — o gatekeeper de operações
**Ativação:** `/AuroqOS:agents:ops`
**Propósito:** Mãos e pernas do sistema. Cuida de git, ambiente e infra — autoridade EXCLUSIVA de git push, PR, deploy e MCP (Constitution Art. II).
**Quando usar:** Salvar progresso (commit), enviar pro remote (push), atualizar o sistema, instalar agente/pack, checar saúde, bootstrap do zero.
**Comandos:** `*commit`, `*push`, `*update` (baixa versão nova do npm), `*status`, `*health`, `*bootstrap`, `*yolo` (modo de permissão), `*install`, `*update-squad`, `*install-pack`, `*pr`, `*cleanup`.
**Entrega:** Commits de negócio, sistema atualizado preservando dados, ambiente configurado, diagnóstico.

## 3. Organizer — a higiene do sistema
**Ativação:** `/auroq-organizer`
**Propósito:** Mente sintética que funde 6 experts de organização (Forte, McKeown, Newport, Covert, Bradley, Milo) + guardião da higiene do Auroq OS.
**Quando usar:** Diagnosticar bagunça, criar estrutura nova, otimizar o que existe, guardar documento no lugar certo, limpar duplicados, fazer backup.
**Comandos:** `*diagnose` (score 1-10 em 5 lentes), `*architect`, `*optimize`, `*consult`, `*store`, `*clean`, `*backup`, `*bootstrap`.
**Entrega:** Diagnóstico, estruturas (PARA/LYT/PPV), simplificação, arquivos organizados, backup.
**Frase:** "Organização que não serve ação é decoração."

## 4. Squad Forge — fábrica de squads
**Ativação:** `/auroq-squad-forge`
**Propósito:** Extrai um processo da cabeça do expert e transforma em squad multi-agente. 5 fases: extração → playback → arquitetura → montagem → validação.
**Quando usar:** Automatizar um processo que já funciona manualmente; virar conhecimento tácito em squad reutilizável.
**Comandos:** `*start`, `*update`, `*fix`, `*rebuild`, `*resume`, `*playback`, `*gaps`, `*status`.
**Entrega:** Squad operacional (agents, tasks, workflows, KBs) com quality gates. Pipeline pausável/retomável.
**Frase:** "Não tô inventando nada. Se não veio de você, não entra."

## 5. Mind Forge — fábrica de mentes
**Ativação:** `/auroq-mind-forge`
**Propósito:** Transforma documentação bruta em mente sintética (funde N experts numa lente) ou consultor (expertise profunda em 1 assunto). 6 fases: ingestão → análise → playback → forja → validação.
**Quando usar:** Criar agente que combina vários experts, ou um especialista profundo num domínio.
**Comandos:** `*start`, `*resume`, `*playback`, `*gaps`, `*status`.
**Entrega:** Mente com 20+ Knowledge Fragments por domínios, frameworks mapeados, agente testado.

## 6. Worker Forge — fábrica de workers
**Ativação:** `/auroq-worker-forge`
**Propósito:** Define e constrói workers (funcionários digitais especializados). 6 fases: discovery → research → proposal → playback → assembly → validação.
**Quando usar:** Criar um funcionário digital pra uma tarefa/domínio específico (atendimento, pesquisa, execução).
**Comandos:** `*start`, `*resume`, `*playback`, `*status`.
**Entrega:** Worker com role card, KB, contexto, delegation map e scoreboard de KPIs.
**Frase:** "Me descreve esse funcionário como se fosse uma vaga de emprego."

## 7. Clone Forge — clonagem cognitiva
**Ativação:** `/auroq-clone-forge`
**Propósito:** Clona uma pessoa real em agente de alta fidelidade, combinando 3 dimensões: Voice DNA (como fala), Thinking DNA (como pensa), POC (ontologia). 11 fases.
**Quando usar:** Clonar a essência e o jeito de pensar de alguém num agente digital.
**Comandos:** `*clone-forge {nome}`, `*ingest-local`, `*deep-interview`, `*gap-analysis`, `*resume`, `*status`.
**Entrega:** 30+ arquivos em 8 pastas; clone com voz, pensamento e valores reconhecíveis + smoke tests.
**Frase:** "Se entrar coco, sai coco. Vamos melhorar o input antes de seguir."

## 8. ETLmaker — fábrica de KBs
**Ativação:** `/auroq-etlmaker`
**Propósito:** Extrai conhecimento de fontes brutas e estrutura em Knowledge Base rica e fiel. 4 fases: setup → mapeamento → composição → integração → validação (3 camadas).
**Quando usar:** Transformar caos de documentação/conteúdo em KB organizada por domínios e volumes.
**Comandos:** `*start`, `*add-source`, `*resume`, `*status`.
**Entrega:** KB com N volumes, mapa territorial, regras cardinais, repertório, glossário + audit em 3 camadas.

---

## Os 3 grupos (como pensar nos agentes)

1. **Operação do dia a dia:** Companion (cérebro) + Ops (mãos) + Organizer (higiene) — o aluno usa direto, todo dia.
2. **As 4 Forjas:** Squad/Mind/Worker/Clone Forge — o aluno usa quando quer CRIAR um agente novo.
3. **A ferramenta de conhecimento:** ETLmaker — alimenta as forjas e a biblioteca com KBs tratadas.

Padrão importante: as Forjas e o ETLmaker são **pausáveis/retomáveis** (`*resume`/`*status`) e fazem **playback** (validam o entendimento com o expert antes de construir) — porque "se não veio de você, não entra" e qualidade vem antes de velocidade.

---

*Fonte: repo auroq-os (personas em agents/*/agents/, ops.md). Comandos confirmados contra os arquivos. Fundação factual.*
