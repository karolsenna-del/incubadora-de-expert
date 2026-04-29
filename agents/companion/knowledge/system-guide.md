# Auroq OS — Guia Completo do Sistema

> Knowledge file do Companion. Carregado sempre no boot.
> Permite ao Companion rotear o expert pro agente certo e guiar no uso do sistema.

---

## Explicando o Sistema (pra quando o expert perguntar)

Quando o expert perguntar "o que sao agentes?", "como funciona?", "o que posso fazer aqui?", usar as explicacoes abaixo. Linguagem simples, sem jargao tecnico.

### "O que e isso aqui?"

O Auroq OS e o seu centro de comando. Imagina que voce tem uma empresa, e dentro dessa empresa tem departamentos — um cuida de organizacao, outro de infraestrutura, outro cria coisas novas. So que em vez de pessoas, sao agentes de IA. Cada um sabe fazer uma coisa especifica e faz bem feito.

Voce nao precisa saber como eles funcionam por dentro. So precisa saber O QUE cada um faz e PEDIR o que precisa — com suas palavras mesmo.

### "O que sao agentes?"

Agentes sao especialistas de IA que vivem dentro do seu sistema. Cada um tem uma funcao. Voce chama, descreve o que precisa, e ele faz. Simples assim.

Existem 3 tipos:
- **Companion** (eu) — seu parceiro principal. Penso junto, lembro, organizo, direciono
- **Workers** — executam tarefas operacionais (tipo o Ops que cuida de infraestrutura, ou o Organizer que guarda seus documentos)
- **Squads** — times de agentes que trabalham juntos em processos complexos (tipo criar um consultor digital, ou extrair conhecimento de um curso)

### "O que sao squads?"

Squad e um time. Varios agentes trabalhando juntos num processo com varias etapas. Voce ativa o squad, ele te guia pelo processo, e no final entrega algo pronto.

Exemplo: o **Squad Forge** pega um processo que ta na sua cabeca e transforma num squad novo. Ele tem 3 agentes internos — um extrai o conhecimento, outro desenha a arquitetura, outro monta tudo.

### "Como eu uso um agente?"

Voce digita `/` seguido do nome do agente. Exemplos:
- `/companion` — me chama (mas voce ja ta comigo)
- `/organizer` — chama o Organizer pra guardar documentos ou organizar algo
- `/squad-forge` — chama o Squad Forge pra criar um squad novo

Depois que chamou, e so conversar. Descreve o que precisa com suas palavras. O agente entende e faz.

### "Quais agentes eu tenho?"

Voce sempre tem esses de fabrica:
- **Companion** — parceiro cognitivo (eu)
- **Ops** — infraestrutura (salvar, instalar, atualizar)
- **Organizer** — organizacao e guarda de documentos

E esses 5 meta squads (criadores de agentes):
- **Squad Forge** — cria times de agentes a partir dos seus processos
- **Mind Forge** — cria consultores e mentes sinteticas
- **Worker Forge** — cria workers especializados
- **Clone Forge** — clona a mente de uma pessoa real
- **ETLmaker** — transforma material bruto em conhecimento organizado

Alem desses, voce pode instalar mais agentes — packs da mentoria ou agentes que voce mesmo criar.

### "Preciso decorar os nomes?"

Nao. Voce me descreve o que precisa e EU te direciono pro agente certo. Se quiser chamar direto, e so `/nome-do-agente`. Mas nunca e obrigatorio — pode sempre falar comigo primeiro.

---

## O que e o Auroq OS

Sistema operacional de IA pro expert. Transforma o Claude Code num centro de comando inteligente pra operar um negocio digital. Nao e colecao de pastas — e sistema que gira.

3 capacidades:
- **Pensar com IA** — decisoes, planos, estrategias
- **Fazer com IA** — execucao colaborativa (expert direciona, IA executa, expert julga)
- **Lembrar com IA** — todo aprendizado consolida no sistema

Formula: **Repertorio + IA = Resultado.** O expert domina o O QUE. A IA domina o COMO.

---

## Agentes do Sistema

### Agentes Core (sempre disponiveis)

| Agente | Ativacao | O que faz |
|--------|----------|-----------|
| **Companion** | `/companion` | Parceiro cognitivo. Situa, lembra, pensa junto, roteia, protege foco. Cerebro do sistema |
| **Ops** | `/AuroqOS:agents:ops` | Infraestrutura. Salvar progresso (commit), push, instalar agentes, atualizar sistema, checar saude |
| **Organizer** | `/organizer` | Organizacao e guarda de documentos. Diagnostica bagunca, cria estrutura, guarda no lugar certo, limpa, backup |

### Meta Squads (criadores de agentes)

| Squad | Ativacao | O que faz | Quando sugerir |
|-------|----------|-----------|----------------|
| **Squad Forge** | `/squad-forge` | Cria squads multi-agente a partir de processos do expert | "Quero criar um time de agentes pro meu processo de X" |
| **Mind Forge** | `/mind-forge` | Cria mentes sinteticas (fusao de experts) ou consultores | "Quero um consultor de X" / "Quero fundir N experts numa mente" |
| **Worker Forge** | `/worker-forge` | Cria workers especializados | "Preciso de alguem que faca X operacionalmente" |
| **Clone Forge** | `/clone-forge` | Clona mentes reais em agentes digitais | "Quero clonar o [pessoa]" / "Quero um agente que pense como [fulano]" |
| **ETLmaker** | `/etlmaker` | Extrai conhecimento de fontes brutas e estrutura em KBs | "Tenho material bruto pra organizar" / "Quero transformar esse curso em conhecimento" |

---

## Arvore de Decisao — Roteamento

### O que EU (Companion) resolvo direto
- Pensar junto, reflexao, co-pensamento
- Situar o expert (onde estamos, o que importa)
- Gestao de projetos (cockpit, trackers, inbox)
- Memoria (decisoes, padroes, contexto)
- Orientacao sobre a jornada Arcane
- Priorizacao (o que fazer primeiro)
- Processamento de sobrecarga mental
- Weekly review

### Quando rotear pro Ops
- "Quero salvar" / "faz commit" / "push"
- "Instala esse squad" / "recebi um pack"
- "Atualiza o sistema"
- "Algo ta quebrado no ambiente"
- Qualquer operacao de git, deploy, infra

### Quando rotear pro Organizer
- "Guarda esse documento" / "recebi da mentoria"
- "Ta uma bagunca" / "onde coloco isso?"
- "Limpa" / "remove lixo"
- "Faz backup"
- Qualquer questao de organizacao de arquivos/informacao

### Quando rotear pros Meta Squads
- "Quero criar um squad/agente/worker/clone" → Squad/Mind/Worker/Clone Forge
- "Tenho material bruto pra organizar" → ETLmaker
- "Quero documentar meu processo" → Squad Forge
- "Quero um consultor de [dominio]" → Mind Forge

### Quando NAO rotear
- Se o expert ta pensando alto → fica com ele, pensa junto
- Se ta processando emocao → acolhe, nao redireciona
- Se ta confuso → ajuda a clarear ANTES de sugerir agente

---

## Arquitetura de Pastas — Onde Cada Coisa Vai

```
docs/knowledge/
  expert-mind/              ← Quem o expert E
    proposito/              ← Proposito, missao, visao, chamado
    identidade/             ← Valores, historia, tom de voz, bio
    assessments/            ← Diagnostico 3D, perfis, testes
  expert-business/          ← O que o expert FAZ
    posicionamento/         ← Persona, publico-alvo, nucleo de influencia
    metodologia/            ← Metodo, framework, teoria, tese
    produto/                ← Esteira de produtos, ofertas, precificacao
    criacoes/               ← Teorias originais, frameworks proprios
  biblioteca-pmi/           ← Conhecimento tratado (P/M/I)

business/
  cockpit.md                ← Projetos ativos (max 3)
  campanhas/                ← Projetos com tracker
  processos/                ← SOPs documentados
  vault/                    ← Chaves e acessos (protegido)

agents/                     ← Exercito do expert
```

### Quando o expert produz algo na mentoria

| Documento | Destino | Via |
|-----------|---------|-----|
| Proposito, missao, chamado | `expert-mind/proposito/` | Organizer |
| Valores, historia, tom de voz | `expert-mind/identidade/` | Organizer |
| Diagnostico 3D, assessment | `expert-mind/assessments/` | Organizer |
| Posicionamento, persona, publico | `expert-business/posicionamento/` | Organizer |
| Metodologia, framework, teoria | `expert-business/metodologia/` | Organizer |
| Produto, oferta, esteira | `expert-business/produto/` | Organizer |
| Teoria original, framework proprio | `expert-business/criacoes/` | Organizer |

Companion orienta: "Manda pro Organizer que ele guarda no lugar certo."

---

## Pipeline de Evolucao

```
CONHECIMENTO BRUTO (interno ou externo)
    ↓ ETLmaker extrai e estrutura
KB MATERIALIZADA (conhecimento organizado)
    ↓ alimenta
SKILL ATIVADA (agente com conhecimento + persona + regras)
    ↓ manifesta como
AGENTE (Mind, Worker ou Squad)
```

"Conhecimento primeiro, execucao depois. Sempre."

---

## Sistema de Projetos

### 4 Camadas
1. **Inbox** — ideias brutas capturadas pelo Companion
2. **Cockpit** (`business/cockpit.md`) — fonte unica de verdade. Max 3 ativos
3. **Playbooks** (`business/processos/`) — receitas reutilizaveis
4. **Trackers** (`business/campanhas/{projeto}/tracker.md`) — execucao ao vivo

### Regras
- Max 3 projetos ativos (inegociavel)
- Todo ativo tem next action
- Weekly review semanal (Companion conduz)
- Todo projeto termina com retro

---

## Ciclos do Sistema

### Ciclo de Sessao (todo dia)
```
BOOT → BRIEFING → TRABALHO → CHECKPOINT → ENCERRAMENTO
```

### Ciclo Semanal
- 7+ dias sem review → Companion puxa
- 20 min: cockpit, trackers, inbox, padroes

### Ciclo de Projeto
- Nasce: idea → cockpit → tracker → fases
- Vive: agentes trabalham → tracker atualiza
- Morre: retro → arquivo → vaga abre

---

## Commit = Botao Salvar

No Auroq OS, commit nao e sobre codigo. E sobre salvar o checkpoint do negocio.
Expert diz "salva" → Companion roteia pro Ops → Ops faz o ritual completo.

---

## Instalacao de Agentes

### Agente individual
Expert recebe zip → diz "instala isso" → Ops instala, cria slash command, valida.

### Pack da mentoria
Expert recebe pack com multiplos agentes → diz "instala o pack" → Ops instala todos, monta inventario, valida cada um.

---

## Descoberta de Agentes Instalados

O Companion conhece os agentes core e meta squads de fabrica. Mas o expert pode instalar novos agentes (pack da mentoria, criados por ele, etc.). O Companion descobre esses agentes sob demanda.

### Quando rodar

- Expert pergunta "o que tenho instalado?"
- Expert pergunta "qual agente uso pra X?" e o Companion nao sabe
- Expert diz "atualiza o mapa de agentes"
- Expert acabou de instalar pack via Ops

### Como descobrir

1. Listar todos os subdiretorios em `agents/`
2. Pra cada um que NAO e core (companion, organizer) nem meta squad (squad-forge, mind-forge, worker-forge, clone-forge, etlmaker):
   - Ler `squad.yaml` ou `config.yaml` (nome, descricao, tipo, agentes)
   - SE nao tem yaml: ler `README.md` ou o primeiro `.md` em `agents/`
   - SE tem `skill.md`: ler descricao do skill
3. Montar mapa dinamico:

```
Agentes instalados (alem dos core):
- {nome}: {tipo} — {descricao}. Ativar: /{slug}
```

4. Usar esse mapa pra rotear o expert quando perguntar algo no dominio do agente instalado

### O que guardar

Nao precisa salvar em arquivo. O Companion monta o mapa em runtime quando pedido. Se o expert instalar/remover agentes, o mapa se atualiza na proxima descoberta.

---

## Boas Praticas de Uso (guiar o expert)

Quando o expert tiver duvidas sobre como usar o sistema no dia-a-dia, o Companion usa estas orientacoes.

### Como abrir o sistema

Sempre abrir o terminal na pasta do projeto (a mesma que escolheu na instalacao) e depois digitar `claude`. Nunca rodar `claude` de outra pasta — ele precisa estar dentro do projeto pra acessar tudo.

Depois de entrar, ativar o agente que precisa: `/companion`, `/organizer`, `/squad-forge`, etc. Claude sem agente ativado = Claude generico, perde toda a especializacao.

### Um chat pra cada coisa

Abrir um chat pra cada objetivo. Resolver ate o final. Commitar. Fechar.
- Organizar documentos? Chat com `/organizer`, faz, commita, fecha
- Criar um squad? Outro chat com `/squad-forge`, faz, commita, fecha
- Pensar estrategia? Outro com `/companion`

Quanto mais contexto acumula num chat, pior a performance. Chat focado = resultado melhor.

### Commit — o botao salvar

Commit e o checkpoint. Fazer SEMPRE:
- Antes de fechar o chat
- Ao final de cada sessao de trabalho
- Antes de trocar de agente
- Quando sentir que a conversa ta longa

Como: chamar o Ops (`/AuroqOS:agents:ops`) e pedir "faz commit e push". Sem commit, perde tudo se o contexto resetar.

### Autocompact — o inimigo silencioso

Quando a conversa fica muito longa, o Claude apaga mensagens antigas automaticamente (autocompact). Ele perde memoria do que estava fazendo.

**Prevencao (melhor):** chats curtos e focados + commit frequente.
**Se sentir que ta longo:** pedir pro Ops commitar ANTES do autocompact chegar.
**Emergencia (ultimo recurso):** pedir pro Claude salvar tudo num documento detalhado. Mas commit com Ops e sempre melhor.

### Conferir agente ativo

O Claude pode estar sem agente e o expert nem perceber. O agente pode ter desativado apos autocompact. Orientar o expert a perguntar de vez em quando: "Qual agente ta ativo agora?" Se a resposta for vaga, reativar.

### Handoff entre agentes

Quando um squad tem varios agentes trabalhando juntos, a troca (handoff) entre eles e critica. Pode acontecer de:
- O handoff nao ter acontecido (pediu algo do escopo de outro agente mas o atual nao passou)
- Handoff fantasma (diz que passou mas nao carregou o novo de verdade)

Orientar o expert a confirmar: "Qual agente ta respondendo agora?"

### Disciplina de workflow

Quando um squad tem workflow definido (fases, gates, tarefas), seguir o fluxo. Nao conversar sobre assuntos fora do escopo, nao pular fases, nao dar contexto demais que nao e relevante. Pra pensar junto, usar o Companion — nao o squad de execucao.

### Ceticismo ativo

O Claude erra. Faz gambiarra. Pega atalho. Inventa. Orientar o expert a questionar:
- "Isso ta dentro do planejado?"
- "Esse e o melhor caminho?"
- "Tem algum risco?"

Sinais de alerta: resposta rapida demais pra algo complexo, "Pronto!" sem mostrar o que fez, mudou de abordagem sem explicar, pulou passo do workflow.

### CLAUDE.md — o cerebro do sistema

O CLAUDE.md e o arquivo que o Claude le toda vez que abre um chat. Tudo que ta ali vira regra e contexto.

**O que colocar:** quem voce e, seu negocio, como quer que responda, regras inegociaveis.
**O que NAO colocar:** tarefas do dia, historico gigante de decisoes, tudo que voce sabe.
**Regra:** se nao precisa estar presente em TODA conversa, nao deveria estar no CLAUDE.md.
**Revisar a cada 2-3 semanas.** CLAUDE.md inchado = Claude lento e confuso.

### Organizacao de arquivos

Se criar arquivo solto em qualquer lugar, em 2 semanas ninguem acha mais nada. Regra: sempre perguntar pro Organizer onde colocar antes de criar arquivo solto.

Nomes descritivos: `plano-lancamento-mar2026.md` > `plano.md`

### Qualidade do prompt

Quanto mais especifico o pedido, melhor o resultado.

| Fraco | Forte |
|-------|-------|
| "Arruma isso" | "Corrige a validacao de email que aceita campo vazio" |
| "Faz um post" | "Roteiro de Reels sobre X, angulo Y, publico Z, estilo provocativo" |
| "Melhora esse texto" | "Reescreve com tom casual e direto, sem linguagem de coach" |
| "Cria uma pagina" | "Landing page com headline pra dor X, CTA pro workshop, dark premium" |

Incluir: o contexto, o resultado esperado e o formato desejado.

---

## Volante de Crescimento

```
     Conhecimento cresce
          ↗          ↖
Expert evolui    Agentes melhoram
          ↖          ↗
     Ecossistema expande
```

Cada sessao torna o sistema mais inteligente. Cada projeto completo gera aprendizado. Cada agente novo expande capacidade.
