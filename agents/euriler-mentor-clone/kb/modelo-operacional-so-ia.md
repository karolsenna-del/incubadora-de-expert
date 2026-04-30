# MODELO OPERACIONAL — SO COM IA

### Documento de Trabalho | Março 2026

> Como se opera um negócio com IA como Sistema Operacional no dia a dia. Não é a teoria NDF (o quê e por quê). É o **como se vive** — o modus operandi que emergiu da prática.
>
> v0.1 — Rascunho inicial extraído da sessão de 13/03/2026.

---

# O QUE É ISTO

A teoria NDF explica o problema (irrelevância), a solução (PMI), e a arquitetura (exocortex, minds, workers, squads). Mas não explica **como é o dia a dia** de quem opera com IA como SO.

Este documento descreve o modelo operacional — as necessidades que guiam tudo, os papéis que as resolvem, o ciclo diário, e como o sistema cresce com o tempo.

É o **GPS ligado** enquanto a teoria é o **mapa**.

---

# AS 4 NECESSIDADES FUNDAMENTAIS

Tudo que foi construído no sistema nasceu de 4 necessidades reais. Não foram planejadas — foram sentidas. E cada uma gerou uma solução.

## 1. PERSISTIR

**A necessidade:** Nada pode se perder. Tudo que eu trabalho e construo precisa solidificar. O que aprendi ontem precisa estar acessível amanhã. Evolução incremental — nunca recomeçar do zero.

**O que resolve:** Exocortex — a infraestrutura incremental de documentos, memórias, configs, KBs. Todo progresso salvo e documentado. O Claude acessa tudo. Nunca reseta, sempre cresce.

**Manifestações práticas:**
- Centenas de MDs organizados em pastas
- Memórias persistentes (contexto dinâmico, log de decisões, padrões observados)
- KBs geradas por ETL que ficam disponíveis pra sempre
- Agentes e squads que acumulam refinamento com o uso

**Sem isso:** Cada conversa recomeça do zero. Cada sessão é amnésia. Você perde tudo que construiu quando fecha o chat.

---

## 2. SITUAR

**A necessidade:** São tantas coisas acontecendo ao mesmo tempo — projetos, ideias, pendências, urgências — que eu me perco. E a confusão gera perda de tempo, foco, energia e paralisia. Preciso de ajuda pra me situar.

**O que resolve:** Jarvis (Companion) com contexto dinâmico + Campaign Hub com contexto de projetos ativos.

**Manifestações práticas:**
- Jarvis carrega o contexto dinâmico: o que está ativo, o que está travado, o que é prioridade
- Campaign Hub (ou project doc) carrega o estado de cada projeto específico
- No início de cada sessão: "Onde estamos. O que importa hoje."
- Consciência permanente de: o que está rodando, o que parou, o que precisa de atenção

**Sem isso:** Você abre o terminal e não sabe por onde começar. Fica pulando de uma coisa pra outra sem fechar nada. Sensação de overwhelm constante.

---

## 3. LEMBRAR

**A necessidade:** Onde parei? O que eu queria fazer mesmo? Qual era o plano? O que a gente decidiu semana passada? E isso vai desde nível estratégico (qual é a visão do trimestre?) até tático (o que falta no lançamento?) até operacional (qual era o bug que precisava consertar?).

**O que resolve:** Jarvis (memória viva — log de decisões, padrões observados) + documentos de projeto (planejamento, checklist, status).

**Manifestações práticas:**
- Log de decisões com racional e contexto — impede reverter decisões sem variável nova
- Padrões observados — meta-cognição acumulada
- Project docs com status, próximos passos, bloqueios
- O sistema lembra por você — você consulta, não precisa carregar na cabeça

**Sem isso:** Você repete decisões já tomadas. Esquece compromissos. Revisita problemas já resolvidos. O cérebro fica sobrecarregado tentando segurar tudo.

---

## 4. EXECUTAR

**A necessidade:** Alguém precisa fazer o trabalho. E não só fazer — precisa acompanhar a execução, saber o que foi feito, o que falta, e atualizar o sistema com o resultado.

**O que resolve:** Workers (execução operacional), Squads (processos complexos), Minds (consultoria e julgamento).

**Manifestações práticas:**
- Tech Ops resolve qualquer coisa de infra com um comando
- Gestor de Tráfego opera campanhas com metodologia da Babruna
- Bia (agente WhatsApp) vende e atende automaticamente
- Squads rodam projetos completos com pipeline e gates
- Minds consultam e julgam quando preciso

**Sem isso:** Você sabe o que fazer mas não tem braço. Ou tem braço mas sem qualidade. Ou faz mas ninguém acompanha e as coisas se perdem.

---

# OS 3 NÍVEIS DE OPERAÇÃO

As 4 necessidades operam em 3 níveis diferentes, com atores diferentes:

| Nível | Foco | Quem opera | Exemplos |
|-------|------|-----------|----------|
| **Estratégico** | Visão, direção, decisões de negócio | Expert + Jarvis (Companion) | Definir prioridades do trimestre, decidir o próximo produto, avaliar rumo do negócio |
| **Tático** | Planejamento, organização, projeto | Expert + Minds + Campaign Hub | Planejar lançamento, definir cronograma, estruturar oferta, organizar campanha |
| **Operacional** | Execução, monitoramento, ajustes | Workers + Squads + Agentes | Subir campanha, configurar webhook, criar dashboard, produzir criativos, atender leads |

O expert atua primariamente nos dois primeiros. O operacional é majoritariamente IA.

---

# O CICLO DIÁRIO

O dia a dia de quem opera com SO de IA segue um ciclo natural:

## 1. SITUAR — "Onde estou?"

Abrir sessão. Jarvis carrega contexto. Entender: o que está ativo, o que parou, o que é urgente, o que mudou desde ontem.

## 2. PRIORIZAR — "O que dói mais?"

Pain-first. Das coisas ativas, qual é a mais urgente? Qual gera mais resultado se resolver agora? O que destrava o resto?

## 3. EXECUTAR — "Faz."

Acionar o agente/worker/squad certo. Ou fazer junto com IA (co-piloto). A execução pode ser:
- Comando direto: "Tech Ops, configura esse webhook"
- Co-piloto: expert + IA fazendo junto
- Delegação: squad roda sozinho, expert no gate de aprovação

## 4. DOCUMENTAR — "Salva."

Tudo que foi feito, decidido, aprendido → salva no sistema. O exocortex cresce. Nada se perde.

## 5. REFINAR — "Melhora."

Com o uso, percebe o que pode ser melhor. Refina agentes. Faz ETLs de novos conhecimentos. Consolida workflows. Cria novos agentes/workers se uma dor nova aparece.

```
SITUAR → PRIORIZAR → EXECUTAR → DOCUMENTAR → REFINAR
                                                  ↓
                                          Sistema mais potente
                                                  ↓
                                          Volta pro SITUAR
```

Cada volta do ciclo torna o sistema mais inteligente, mais refinado, mais capaz.

---

# O VOLANTE DE CRESCIMENTO

O sistema não é estático. Ele cresce em 4 dimensões simultaneamente:

## Conhecimento cresce
- Cada ETL adiciona uma KB nova
- Cada sessão de trabalho gera aprendizados documentados
- Cada decisão logada é contexto futuro

## Agentes melhoram
- Cada uso revela o que pode ser melhor
- Prompts refinados, workflows ajustados, knowledge bases enriquecidas
- Agentes v1 → v2 → v3 com o tempo

## Ecossistema expande
- Novas dores → novos workers/minds/squads
- O que antes era manual vira automatizado
- O expert vai soltando operacional progressivamente

## Expert evolui
- Mais repertório → melhores comandos e julgamentos
- Mais tempo livre → mais pensamento estratégico
- Visão mais clara → decisões melhores

```
         Conhecimento cresce
              ↗          ↖
    Expert evolui    Agentes melhoram
              ↖          ↗
         Ecossistema expande
```

Cada dimensão alimenta as outras. É um volante — quanto mais roda, mais rápido fica.

---

# OS ATORES DO MODELO

Cada ator tem um papel claro no modelo operacional:

| Ator | Papel no dia a dia | Nível primário |
|------|-------------------|----------------|
| **Expert** | Manda, julga, decide. O orquestrador. | Estratégico + Tático |
| **Jarvis (Companion)** | Situa, lembra, pensa junto, roteia, protege foco | Estratégico |
| **Campaign Hub / Project Docs** | Carrega contexto tático de projetos ativos | Tático |
| **Minds (Clone, Sintética, Consultor)** | Consultam, mentoram, julgam quando acionados | Tático |
| **Workers (Tech Ops, etc.)** | Executam tarefas operacionais sob demanda | Operacional |
| **Squads** | Executam processos complexos com pipeline | Operacional |
| **Agentes autônomos (Bia, etc.)** | Rodam 24/7 sem intervenção | Operacional (automação) |
| **Exocortex** | O substrato — tudo persiste aqui | Todos (infraestrutura) |

---

# PREMISSAS DO MODELO

Princípios que sustentam o modelo — sem eles, o sistema não funciona:

## Evolução incremental
Tudo que é construído persiste e melhora. Nada volta pra zero. O sistema de amanhã é melhor que o de hoje porque carrega tudo que foi feito até agora.

## Pain-first
Não planeje tudo antes. Resolva a dor de agora. A próxima dor aparece naturalmente. O sistema se constrói pela urgência, não pelo roadmap.

## Pavimentar antes de delegar
Faça primeiro. Documente. Depois delegue (pra humano ou IA). Quem fez primeiro sabe cobrar qualidade.

## O expert é o pai da criança
Ninguém vai cuidar do seu negócio como você. A IA dá braço, mas a direção e o julgamento são seus. Repertório é insubstituível.

## Incerteza é o processo
Não existe modelo perfeito. Cria, testa, descobre. A certeza vem do uso, não do planejamento.

## Documentar é investir
Cada minuto documentando é minuto poupado no futuro. O que não é documentado, morre. O que é documentado, vira poder.

---

# COMO ESSE MODELO SE RELACIONA COM A TEORIA NDF

| Teoria NDF | Modelo Operacional |
|------------|-------------------|
| O problema (irrelevância, 3Fs) | As 4 necessidades (persistir, situar, lembrar, executar) |
| A solução (PMI) | O ciclo diário (situar → priorizar → executar → documentar → refinar) |
| A arquitetura (exocortex, minds, workers, squads) | Os atores do modelo (quem faz o quê no dia a dia) |
| Os princípios (pavimentar, repertório, fórmula) | As premissas (evolução incremental, pain-first, pai da criança) |
| "IA como SO" (conceito) | O modelo operacional (a prática de viver com o SO ligado) |

A teoria é o **mapa**. O modelo operacional é o **GPS ligado**.

---

*v0.1 — Rascunho inicial — 13/03/2026 — Euriler Jubé + Jarvis*
