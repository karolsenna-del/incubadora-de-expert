# Volume 10 — Auroq Avancado

> Metodologia Euriler Jube — Negocio Digital do Futuro
> Composicao: ETLmaker v2.0 | Fontes primarias: SRC-C10, SRC-C08, SRC-C04, SRC-C05 | Fontes secundarias: SRC-C01, SRC-C03, SRC-C06, SRC-C02
> Topicos: T17 (Skills e Squads), T18 (Jornada IA por Fase), T19 (Pipeline de Know-How), T20 (45 Atividades)

---

## Indice

- [1. Skills e Squads (T17)](#1-skills-e-squads-t17)
  - [1.1 Arquitetura de Skills para Experts](#11-arquitetura-de-skills-para-experts)
  - [1.2 As 3 Categorias de Skills](#12-as-3-categorias-de-skills)
  - [1.3 Skills Criadoras](#13-skills-criadoras)
  - [1.4 Protecao de Skills](#14-protecao-de-skills)
  - [1.5 Skill vs Squad](#15-skill-vs-squad)
  - [1.6 Os 3 Papeis num Squad](#16-os-3-papeis-num-squad)
  - [1.7 O Padrao de Entrega: Euriler vs Expert](#17-o-padrao-de-entrega-euriler-vs-expert)
  - [1.8 O Produto de Segundo Ordem](#18-o-produto-de-segundo-ordem)
- [2. Jornada IA por Fase (T18)](#2-jornada-ia-por-fase-t18)
  - [2.1 As Camadas do Negocio](#21-as-camadas-do-negocio)
  - [2.2 Fase 1: Ideacao (Fundacao)](#22-fase-1-ideacao-fundacao)
  - [2.3 Fase 2: Propulsao (Mercado)](#23-fase-2-propulsao-mercado)
  - [2.4 Fase 3: Solidificacao (Gestao)](#24-fase-3-solidificacao-gestao)
  - [2.5 Fase 4: Escala (Dominio)](#25-fase-4-escala-dominio)
  - [2.6 As 9 Descobertas NDF + Auroq](#26-as-9-descobertas-ndf--aios)
- [3. Pipeline de Know-How (T19)](#3-pipeline-de-know-how-t19)
  - [3.1 Visao Geral do Pipeline](#31-visao-geral-do-pipeline)
  - [3.2 Etapa 1: Extracao](#32-etapa-1-extracao)
  - [3.3 Etapa 2: Indexacao (Checksum)](#33-etapa-2-indexacao-checksum)
  - [3.4 Etapa 3: Cruzamento em Camadas](#34-etapa-3-cruzamento-em-camadas)
  - [3.5 Etapa 4: Validacao por Checksum](#35-etapa-4-validacao-por-checksum)
  - [3.6 Etapa 5: Julgamento Adversarial](#36-etapa-5-julgamento-adversarial)
  - [3.7 Pos-Pipeline: Skill + Patches](#37-pos-pipeline-skill--patches)
  - [3.8 Principios do Pipeline](#38-principios-do-pipeline)
- [4. As 45 Atividades do Expert (T20)](#4-as-45-atividades-do-expert-t20)
  - [4.1 Framework de Classificacao: 6 Dimensoes](#41-framework-de-classificacao-6-dimensoes)
  - [4.2 Os 5 Modos de Interacao com IA](#42-os-5-modos-de-interacao-com-ia)
  - [4.3 Mapa de Atividades por Area](#43-mapa-de-atividades-por-area)
  - [4.4 Cruzamento PMI x Atividades](#44-cruzamento-pmi-x-atividades)
  - [4.5 Padroes Identificados](#45-padroes-identificados)
  - [4.6 Logica de Priorizacao](#46-logica-de-priorizacao)
  - [4.7 Resumo Quantitativo](#47-resumo-quantitativo)
- [5. Conexoes Entre Volumes](#5-conexoes-entre-volumes)

---

## 1. Skills e Squads (T17)

> **REGRA CARDINAL:** Skill = know-how empacotado que CRIA e JULGA. Squad = execucao automatizada que FAZ. Skills entram onde precisa de conhecimento especializado pra criar ou avaliar. Squads entram onde tem workflow recorrente e complexo. [Fonte: SRC-C08]

### 1.1 Arquitetura de Skills para Experts

O sistema de Skills para experts digitais se divide em duas frentes: as Skills proprias do expert (pra uso no negocio dele) e as Skills criadoras (robos que conduzem o expert pelo processo e entregam a Skill pronta). [Fonte: SRC-C10]

Toda Skill segue uma estrutura padrao:

```
/nome-da-skill/
  SKILL.md           -> Instrucoes de como usar (frontmatter YAML obrigatorio)
  conhecimento-01.md -> Base de conhecimento
  conhecimento-02.md -> ...
  patches.md         -> Correcoes do uso (documento vivo)
```

O arquivo `SKILL.md` e obrigatorio. Contem frontmatter YAML com `name` e `description` (a description e o que ativa a Skill — funciona como trigger). Recursos opcionais incluem pastas `scripts/`, `references/` e `assets/`. [Fonte: SRC-C10]

**Ambientes de uso:**
- **Local (Claude Desktop/Code):** Skills ficam em diretorio padrao, ativam automaticamente por trigger, multiplas Skills podem ativar ao mesmo tempo. [Fonte: SRC-C10]
- **Web (Claude.ai):** Usa Projects como equivalente — system prompt + arquivos de contexto. Um projeto por vez. [Fonte: SRC-C10]

### 1.2 As 3 Categorias de Skills

| Categoria | O que e | Quem constroi | Conexao PMI |
|-----------|---------|---------------|-------------|
| **Skills de Identidade** | Expert, tom de voz, posicionamento, publico, metodologia, negocio. Personalizadas e unicas | Expert constroi (com processo guiado) | Carregam o **Proposito** |
| **Skills Tecnicas** | Lancamento pago, copy, pagina de vendas, conteudo social, trafego, automacao, produto. Ensinadas e replicaveis | Euriler entrega prontas | Carregam o know-how de **Marketing** |
| **Skills de Projeto** | Campanha atual, evento atual, produto em criacao. Temporarias — nascem e morrem com o projeto | Expert constroi por demanda | Carregam **Contexto** momentaneo |

[Fonte: SRC-C10, SRC-C01]

> **REGRA CARDINAL:** Skills de Identidade sao do expert — cada expert cria a sua. Skills Tecnicas sao de area — Euriler cria, todos usam. Skills de Projeto sao temporarias — por campanha ou evento. [Fonte: SRC-C10]

A arquitetura final das Skills de Identidade do Euriler/Arka exemplifica a logica:

| Skill | Escopo |
|-------|--------|
| `euriler` | Identidade + posicionamento + publico (consolidado) |
| `metodologia-arvore` | Framework completo da Arvore do Expert |
| `arka-contexto` | Operacao do negocio |

[Fonte: SRC-C10]

### 1.3 Skills Criadoras

Skills criadoras sao Skills internas que ensinam um agente a conduzir o aluno pelo processo e entregar a Skill pronta como output. Nao sao Skills de uso direto — sao robos de criacao. [Fonte: SRC-C10]

| Skill Criadora | O que faz | Output |
|----------------|-----------|--------|
| `criador-skill-expert` | Conduz perguntas sobre identidade, tom, posicionamento, publico | Skill de expert pronta |
| `criador-skill-metodologia` | Ajuda a estruturar framework proprio | Skill de metodologia pronta |
| `criador-skill-negocio` | Coleta dados do negocio | Skill de contexto pronta |
| `criador-skill-projeto` | Briefing de campanha/lancamento | Skill de projeto pronta |

[Fonte: SRC-C10]

**Fluxo de uso:**

```
Aluno entra no bot/chat
        |
Bot usa Skill Criadora
        |
Conduz o processo (perguntas, extracao, organizacao)
        |
Entrega Skill pronta pro aluno usar
```

[Fonte: SRC-C10]

Isso conecta diretamente com o Produto de Segundo Ordem (secao 1.8): o expert nao so usa Skills — ele aprende a CRIAR Skills, e os alunos recebem o processo guiado para construir as suas.

### 1.4 Protecao de Skills

Ao fornecer Skills para alunos, 4 estrategias de protecao: [Fonte: SRC-C10]

1. **Contratual** — termo de uso proibindo redistribuicao
2. **Nao entregar arquivo** — usar Project compartilhado ou bot que usa por tras
3. **Versao lite vs premium** — entregar versao basica, manter completa restrita
4. **Diferenciar por servico** — valor nas atualizacoes e suporte, nao no arquivo

### 1.5 Skill vs Squad

| Tipo | Funcao | Analogia | Quando usa |
|------|--------|----------|------------|
| **Skill** | Know-how. Cria e julga. | Consultor especialista | Onde precisa de conhecimento especializado pra criar ou avaliar |
| **Squad** | Execucao automatizada. Faz. | Funcionario que executa | Onde tem workflow recorrente e complexo |

[Fonte: SRC-C08]

**Relacao entre eles:**

```
SQUAD
  |-- consulta SKILL TECNICA (como fazer a tarefa)
  |-- consulta SKILL DO EXPERT (contexto, publico, tom de voz)
        |
    EXECUTA com qualidade + personalizacao
```

O Squad nao e burro — ele tem acesso ao conhecimento certo pra executar no nivel certo. [Fonte: SRC-C08]

**Nem toda area precisa de Squad.** Squads entram onde tem workflow recorrente e complexo. Skills entram onde precisa de conhecimento especializado pra criar ou avaliar. Algumas areas sao so Skill. [Fonte: SRC-C08]

> Ver Volume 8 — IA como Sistema Operacional (secoes 5.1 e 5.2 para fundamentos conceituais de Skills e Squads)

### 1.6 Os 3 Papeis num Squad

Dentro de cada Squad, a IA opera em 3 papeis distintos e separados: [Fonte: SRC-C01]

| Papel | O que faz | Regra |
|-------|----------|-------|
| **Coordenador (Master)** | Orquestra o fluxo, distribui tasks, garante sequencia | Nunca executa — so organiza |
| **Executor** | Executa a task com base no conhecimento empacotado | Nunca se auto-valida — sempre passa pelo juiz |
| **Juiza (Queen)** | Avalia output contra criterios e checklists da metodologia | Nunca cria — so julga |

A separacao de papeis e o que impede a entropia: o executor nao julga seu proprio trabalho (vies), o juiz nao cria (conflito de interesse), o coordenador nao faz nenhum dos dois (foco no fluxo). [Fonte: SRC-C01]

**Fluxo com gates de aprovacao (contribuicao do Edu):**

```
Input entra (briefing, dados, etc.)
    |
Passa pelos agentes do Squad
    |
Chega num GATE (portao de aprovacao)
    |
Humano olha: aprovado ou reprovado?
    |
Se aprovado -> segue pro proximo estagio
Se reprovado -> volta pros agentes ajustarem
```

"O ser humano so faz o chequinho de gate." [Fonte: SRC-C03]

### 1.7 O Padrao de Entrega: Euriler vs Expert

| Tipo | Euriler entrega | Expert constroi |
|------|-----------------|-----------------|
| **Skills de criacao** | Prontas (encontrar publico, criar metodologia, etc) | — |
| **Skills Tecnicas** | Prontas (lancamento pago, trafego, conteudo) | Se quiser criar novas |
| **Skills do expert** | Schema/template padrao + processo guiado | Conteudo proprio dele |
| **Squads** | Configurados (os do negocio de expert) | Se quiser criar novos |

[Fonte: SRC-C08]

O padrao de entrega segue uma logica consistente:

```
TEORIA (Euriler ensina)
       |
SKILL (cria + julga)
       |
SQUAD (executa)
       |
OUTPUT (resultado concreto)
```

[Fonte: SRC-C08]

### 1.8 O Produto de Segundo Ordem

Euriler nao esta so criando Skills especificas (lancamento pago, conteudo, etc.). Ele esta criando uma **metodologia de construcao de know-how artificial**. [Fonte: SRC-C08]

| Ordem | O que e |
|-------|---------|
| 1a ordem | Skill de lancamento pago (know-how especifico) |
| 2a ordem | Metodo para criar Skills de qualquer coisa (meta-processo) |

A segunda multiplica o valor da primeira porque permite criar outras com o mesmo rigor. Isso se encaixa na Arvore do Expert: o expert do futuro nao e so quem tem know-how, e quem sabe **construir e transferir know-how via IA**. [Fonte: SRC-C08]

> Ver Volume 5 — Metodologia (Arvore do Expert como framework completo do negocio de expert)

---

## 2. Jornada IA por Fase (T18)

### 2.1 As Camadas do Negocio

O Sistema Operacional de IA opera em 3 camadas que correspondem as perguntas fundamentais do expert: [Fonte: SRC-C08]

```
CAMADA 1: FUNDACAO (o que fazer)
|-- Posicionamento
|-- Metodologia do expert
|-- Produto/Oferta

CAMADA 2: EXECUCAO (como fazer)
|-- Audiencia -> Conteudo
|-- Vendas -> Lancamento Pago / Sessao Estrategica
|-- Produto -> Entrega
|-- Gestao -> Operacao

CAMADA 3: SEQUENCIA (quando fazer)
|-- Fase 1: Ideacao -> foco em Fundacao
|-- Fase 2: Propulsao -> foco em Vendas
|-- Fase 3: Solidificacao -> foco em Gestao
|-- Fase 4: Escala -> dominio total
```

[Fonte: SRC-C08]

### 2.2 Fase 1: Ideacao (Fundacao)

**Objetivo:** Clareza total antes de ir pro mercado. [Fonte: SRC-C08]

| Area | Teoria | Pratica (IA) | Output |
|------|--------|--------------|--------|
| Publico | Conteudo ensinando | Skill de encontrar publico | publico.md do expert |
| Posicionamento | Conteudo ensinando | Skill de criar posicionamento | posicionamento.md do expert |
| Metodologia | Conteudo ensinando | Skill de criar metodologia | metodologia.md do expert |
| Produto | Conteudo ensinando | Skill de criar produto + Skill de criar curso | produto.md do expert |

**Consolidacao:** Tudo vira o **Cerebro Externo do Expert** — Skills proprias com schema padrao. [Fonte: SRC-C08]

Nesta fase, as Skills Criadoras (secao 1.3) sao o mecanismo principal de entrega. O aluno nao precisa saber construir Skills — ele usa o robo criador que conduz o processo e entrega a Skill pronta. [Fonte: SRC-C10]

### 2.3 Fase 2: Propulsao (Mercado)

**Objetivo:** Audiencia e vendas. [Fonte: SRC-C08]

| Area | Teoria | Skill | Squad | Output |
|------|--------|-------|-------|--------|
| Conteudo | Conteudo ensinando | Skill de criacao de conteudo | Squad de producao (potencial) | Posts, videos |
| Vendas | Conteudo sobre funil escolhido | Skill de lancamento pago (cria + julga) | Squad de execucao de lancamento | Lancamento rodando |
| Trafego | Conteudo ensinando | Skill de trafego | Squad de trafego | Campanhas rodando |

**Logica:** [Fonte: SRC-C08]
- Skill -> ajuda a CRIAR a estrutura, JULGAR se ta bom
- Squad -> EXECUTA o checklist, faz as tarefas acontecerem

Aqui a Skill Juiza ganha protagonismo: o expert cria com apoio da Skill, e a propria Skill julga se o output esta no padrao. Exemplo pratico do Euriler: ao criar pagina de vendas com a Skill de lancamento pago, a IA julgava ativamente — "isso ta muito generico", "sua proposta nao ta clara", "de acordo com o metodo aqui, falta isso". [Fonte: SRC-C03]

### 2.4 Fase 3: Solidificacao (Gestao)

**Objetivo:** Estrutura pra nao depender so do expert. [Fonte: SRC-C08]

| Area | Skill | Squad | Output |
|------|-------|-------|--------|
| Gestao de projetos | Skill de gestao | Squad de gestao (organiza, acompanha) | Projetos organizados |
| Financeiro | Skill financeira (analise, decisao) | Squad financeiro (execucao, relatorios) | Controle financeiro |
| Dados | Skill de dados | Squad de dados | Banco unificado |
| Planejamento | Skill de planejamento estrategico | — | Plano trimestral/anual |

[Fonte: SRC-C08]

### 2.5 Fase 4: Escala (Dominio)

**Objetivo:** Operar no topo com visao 360. [Fonte: SRC-C08]

| Area | O que precisa |
|------|---------------|
| Visao geral | Dashboard de KPIs, saude das areas |
| Orquestracao | Saber onde precisa de atencao |
| Dominio total | Usa todas as ferramentas com maestria |

Na Fase 4, o expert opera como CEO do sistema — nao executa, orquestra. Os Squads rodam as areas, as Skills garantem qualidade, e o expert intervem apenas nos gates de aprovacao e nas decisoes estrategicas. [Fonte: SRC-C08, SRC-C02]

> **REGRA CARDINAL:** A meta e: 100% estrategico, 20-30% tatico, 0-10% operacional. IA faz o operacional. Humano entra com inteligencia, estrategia e aprovacao. [Fonte: SRC-C03]

> Ver Volume 3 — Maturidade, Niveis e Fases (para a progressao completa das 4 fases do negocio)

### 2.6 As 9 Descobertas NDF + Auroq

O cruzamento entre a teoria NDF e a implementacao real via Auroq gerou 9 atualizacoes fundamentais na teoria. Estas descobertas representam a evolucao do pensamento teorico a partir da pratica: [Fonte: SRC-C08]

**Descoberta 1 — As Camadas do Negocio dentro do SO**

O Sistema Operacional de IA nao e uma unica camada. Sao 3 camadas distintas — Fundacao (o que fazer), Execucao (como fazer) e Sequencia (quando fazer). Cada camada tem ferramentas e entregaveis diferentes. [Fonte: SRC-C08]

**Descoberta 2 — Os Niveis de IA**

Dentro do Sistema Operacional existem niveis progressivos de sofisticacao nas ferramentas: [Fonte: SRC-C08]

| Nivel | Ferramenta | Funcao | Quando usa |
|-------|------------|--------|------------|
| 1 | Cerebro Externo | Bases de conhecimento densas | Armazenar know-how consolidado |
| 2 | Projects | Contexto persistente | Manter contexto do negocio/projeto |
| 3 | Skills | Know-how empacotado (cria + julga) | Quando precisa pensar, criar, avaliar |
| 4 | Cowork | Execucao autonoma de tarefas complexas | Tarefas em cadeia que exigem autonomia |
| 5 | Squads | Workflows automatizados | Execucao recorrente de processos |
| 6 | AI Companion | Assistente pessoal continuo | Acompanhamento e suporte constante |

[Fonte: SRC-C08]

**Descoberta 3 — Skill vs Squad (clareza operacional)**

A distincao ficou cristalina: Skill = know-how que cria e julga (consultor). Squad = execucao automatizada que faz (funcionario). A relacao entre eles e que o Squad consulta Skills Tecnicas e Skills do Expert pra executar com qualidade e personalizacao. [Fonte: SRC-C08]

**Descoberta 4 — O que Euriler entrega vs Expert constroi**

Definicao clara do modelo de entrega: Euriler entrega Skills de criacao prontas, Skills Tecnicas prontas e Squads configurados. O expert constroi conteudo das Skills de Identidade e pode criar novas Skills e Squads se quiser. [Fonte: SRC-C08]

**Descoberta 5 — O Padrao de Entrega**

A cadeia Teoria -> Skill -> Squad -> Output se revelou como o padrao consistente de como cada area do negocio e coberta pelo sistema. [Fonte: SRC-C08]

**Descoberta 6 — Jornada do Expert por Fase com IA**

Cada fase do negocio tem uma combinacao especifica de teoria, Skills e Squads. Na Fase 1, predominam Skills Criadoras. Na Fase 2, entram Skills Tecnicas e primeiros Squads. Na Fase 3, Squads de gestao. Na Fase 4, orquestracao total. [Fonte: SRC-C08]

**Descoberta 7 — Nem toda area precisa de Squad**

Squads entram onde tem workflow recorrente e complexo. Skills entram onde precisa de conhecimento especializado. Algumas areas sao so Skill — nao exigem automacao de workflow. [Fonte: SRC-C08]

**Descoberta 8 — O Produto de Segundo Ordem**

Euriler nao esta so criando Skills especificas. Ele esta criando uma metodologia de construcao de know-how artificial — o meta-processo. Skill de lancamento pago e 1a ordem. Metodo para criar Skills de qualquer coisa e 2a ordem. A segunda multiplica o valor da primeira. [Fonte: SRC-C08]

> **REGRA CARDINAL:** O ciclo resolver-ensinar-produtizar e SIMULTANEO, nao sequencial. Euriler resolve pra si, ensina pros alunos e produtiza como ferramenta — tudo ao mesmo tempo. A experiencia pratica alimenta o ensino e a produtizacao em tempo real. [Fonte: SRC-C08]

**Descoberta 9 — O Ciclo Resolver-Ensinar-Produtizar**

O caminho natural do expert no NDF: [Fonte: SRC-C08]

```
RESOLVE PRA SI (cria Skills, Squads, processos pro proprio negocio)
    |  (simultaneo)
ENSINA PROS ALUNOS (mostra como fez, ensina o metodo)
    |  (simultaneo)
PRODUTIZA (transforma em ferramenta/plataforma que qualquer expert pode usar)
```

"Ja peguei todo meu conhecimento de lancamento pago, botei na IA. Tudo que to ensinando na oficina, depois vai virar curso, depois Skill, depois Squad." [Fonte: SRC-C03]

O lancador do futuro e uma IA: o expert nao precisa mais de lancador humano, coprodutores ou equipe de lancamento. Squad de lancamento (IA) conduz cada etapa com gates de aprovacao onde o expert so inputa dados e aprova. [Fonte: SRC-C03]

---

## 3. Pipeline de Know-How (T19)

> **REGRA CARDINAL:** O Pipeline de Know-How e uma meta-metodologia. Nao e sobre UM assunto — e sobre como transformar QUALQUER conhecimento disperso em base consolidada pronta pra virar Skill. [Fonte: SRC-C04]

### 3.1 Visao Geral do Pipeline

O Pipeline transforma conhecimento disperso (transcricoes, cursos, anotacoes, experiencia pessoal) em documentos consolidados prontos para virar Skills de IA. [Fonte: SRC-C04]

```
FONTES BRUTAS
     |
[Etapa 1: Extracao] -> Documentos padronizados
     |
[Etapa 2: Indexacao] -> Checksums de cada documento
     |
[Etapa 3: Cruzamento em Camadas]
     Camada 1: similares entre si
     Camada 2: teoria x pratica
     Camada 3: externo x seu know-how
     |
[Etapa 4: Validacao] -> Checa se insights sobreviveram
     |
[Etapa 5: Adversarial] -> Ataca o documento
     |
DOCUMENTO FINAL CONSOLIDADO
     |
[Vira Skill + Patches]
     |
USO -> REFINAMENTO -> CONSOLIDACAO
```

[Fonte: SRC-C04]

### 3.2 Etapa 1: Extracao

Transformar fontes brutas (transcricoes, cursos, anotacoes, conversas) em documentos padronizados com estrutura fixa. Fontes brutas sao baguncadas e incomparaveis — uma transcricao tem 50 paginas de "ne, entao, tipo", um PDF de curso tem estrutura propria, anotacoes sao telegraficas. Quando voce padroniza, a IA consegue comparar igual com igual nos cruzamentos. [Fonte: SRC-C04]

**Estrutura fixa de extracao:** [Fonte: SRC-C04]

| Secao | O que captura |
|-------|---------------|
| Conceitos-chave | Definicoes, principios fundamentais, verdades centrais |
| Frameworks | Estruturas, modelos, formulas, sequencias, processos |
| Exemplos e Cases | Casos citados, numeros, resultados concretos |
| Anti-padroes | O que NAO fazer, erros comuns, armadilhas |
| Dependencias | O que precisa saber antes, pre-requisitos |
| Contexto e Limitacoes | Quando isso se aplica, quando nao se aplica |

Diretriz central: extrair APENAS o que esta no documento, nao adicionar conhecimento externo. [Fonte: SRC-C04]

### 3.3 Etapa 2: Indexacao (Checksum)

Criar uma lista curta (10-20 itens) dos insights mais importantes de cada documento extraido. Essa lista funciona como "checksum" — verificacao de integridade. [Fonte: SRC-C04]

Nos cruzamentos, coisas se perdem. Se voce nao sabe o que era importante antes, nao tem como verificar depois. O indice e sua lista de verificacao. [Fonte: SRC-C04]

**Estrutura em 3 niveis:** [Fonte: SRC-C04]

| Nivel | O que contem | Quantidade |
|-------|-------------|------------|
| **Insights Criticos** | Core do documento — se sumir, o documento perde valor | 5-8 itens |
| **Insights Importantes** | Complementam os criticos, deveriam estar em qualquer consolidacao | 5-8 itens |
| **Dados Especificos** | Numeros, metricas, porcentagens — faceis de perder em cruzamentos | 3-5 itens |

### 3.4 Etapa 3: Cruzamento em Camadas

Consolidar os documentos extraidos em fases, do mais similar ao mais diferente, ate chegar no know-how pessoal do expert. Cruzar tudo de uma vez gera confusao — a IA nao sabe o que priorizar. [Fonte: SRC-C04]

**As 3 Camadas:** [Fonte: SRC-C04]

| Camada | O que cruza | Exemplo | Regra principal |
|--------|-------------|---------|-----------------|
| **Camada 1** | Fontes similares entre si | Dois cursos de lancamento pago -> vira um documento | Manter tudo que aparece em ambos, manter unico que nao contradiz, sinalizar contradicoes |
| **Camada 2** | Teoria x Pratica | Documento teorico consolidado x documento de cases/exemplos | Teoria como estrutura base, enriquecer com exemplos, identificar gaps |
| **Camada 3** | Externo x Seu Know-how | Documento consolidado x o que voce sabe e acredita | **Know-how do expert tem PRIORIDADE** quando houver conflito direto |

> **REGRA CARDINAL:** Na Camada 3, o know-how do expert tem prioridade sobre qualquer fonte externa. Resultado final deve soar como o EXPERT falando, nao como compilacao generica. [Fonte: SRC-C04]

### 3.5 Etapa 4: Validacao por Checksum

Pegar os indices de insights criados na Etapa 2 e verificar se cada insight sobreviveu no documento final. E o controle de qualidade do Pipeline. [Fonte: SRC-C04]

**Classificacao de cada insight:** [Fonte: SRC-C04]
- **PRESENTE** — o insight esta claramente no documento final
- **PARCIAL** — o insight esta mencionado mas incompleto ou superficial
- **AUSENTE** — o insight nao esta no documento final

**O que fazer com o resultado:** [Fonte: SRC-C04]
- Ausentes e parciais: reinjetar no documento final, descartar conscientemente (nao e relevante), ou investigar (por que sumiu?)
- Gera um relatorio com taxa de retencao quantificada

### 3.6 Etapa 5: Julgamento Adversarial

Uma IA questiona e ataca o documento final para encontrar falhas, lacunas e excecoes. Ate aqui voce construiu. Agora voce destroi pra ver o que sobra. [Fonte: SRC-C04]

**6 analises adversariais:** [Fonte: SRC-C04]

| Analise | O que busca |
|---------|-------------|
| Lacunas de Conhecimento | O que esta FALTANDO? Perguntas obvias que o documento nao responde |
| Afirmacoes Questionaveis | Exageradas, nao fundamentadas, potencialmente erradas |
| Excecoes Nao Cobertas | Situacoes, contextos, publicos onde as recomendacoes falham |
| Contradicoes Internas | O documento se contradiz em algum ponto? |
| Dependencias Ocultas | O que o documento assume que o leitor ja sabe |
| Teste de Stress | Se alguem seguir ao pe da letra, o que pode dar errado? |

O documento que sobrevive ao adversarial e mais robusto. [Fonte: SRC-C04]

### 3.7 Pos-Pipeline: Skill + Patches

Apos as 5 etapas, o documento final consolidado esta pronto para virar uma Skill. O SKILL.md deve incluir instrucao explicita: "Consulte o arquivo patches.md para correcoes e excecoes. Patches tem prioridade sobre o conteudo base quando houver conflito." [Fonte: SRC-C04]

**Ciclo de Vida da Skill (pos-Pipeline):**

```
SKILL CRIADA
     |
USO REAL
     |
PERCEBE FALHA/LACUNA
     |
ANOTA NO PATCHES.MD
     |
[repete uso -> anotacao]
     |
ACUMULA 10-15 PATCHES
     |
CONSOLIDACAO: Incorpora patches no documento base
     |
NOVA VERSAO DA SKILL
     |
ZERA PATCHES
     |
[ciclo recomeca]
```

[Fonte: SRC-C04, SRC-C08]

**Fluxo de captura rapida durante o uso:** [Fonte: SRC-C04]
1. Fala no chat: "Anota como patch: [descricao do problema]"
2. IA formata o patch
3. Copia pro patches.md
4. Continua trabalhando

Tempo total: ~10 segundos. Baixa friccao = alta adesao.

**Estrutura do patches.md:** [Fonte: SRC-C04]
- **Correcoes** — quando algo no base esta errado
- **Adicoes** — conhecimento novo que falta
- **Excecoes** — situacoes onde o base nao se aplica
- **Log de Consolidacao** — registro de quando patches foram incorporados ao documento base

### 3.8 Principios do Pipeline

6 principios que governam o Pipeline inteiro: [Fonte: SRC-C04]

| Principio | O que significa |
|-----------|-----------------|
| **Padronizacao antes de cruzamento** | Fontes no mesmo formato cruzam melhor |
| **Checksum como seguro** | Se nao sabe o que tinha antes, nao sabe o que perdeu |
| **Camadas reduzem confusao** | Similar com similar primeiro. Seu know-how por ultimo (e com prioridade) |
| **Ataque antes de confiar** | O documento que sobrevive ao adversarial e mais robusto |
| **Documento vivo > documento perfeito** | Lancar, usar, corrigir e melhor que tentar acertar tudo antes de usar |
| **Patches sao memoria de curto prazo** | Captura rapida, processamento depois |

**Quando usar o Pipeline:** [Fonte: SRC-C04]
- Tem multiplas fontes sobre o mesmo tema
- Quer consolidar know-how disperso
- Vai criar uma Skill de IA
- Quer transferir conhecimento para outros

**Quando NAO usar:** [Fonte: SRC-C04]
- Tem uma unica fonte simples
- O conhecimento e trivial
- Nao vai reutilizar o resultado

### Meta-Aplicacao

O Pipeline e, ele mesmo, um Produto de Segundo Ordem: pode virar uma Skill de criacao de Skills. Ai voce tem Skill de Lancamento Pago (know-how especifico, 1a ordem) e Skill de Criacao de Skills (meta-processo, 2a ordem). A segunda multiplica o valor da primeira porque permite criar outras com o mesmo rigor. [Fonte: SRC-C04]

> Ver Volume 8 — IA como Sistema Operacional (secao 5.1 para fundamentos de Skills como documento vivo e consolidacao continua)

---

## 4. As 45 Atividades do Expert (T20)

> **REGRA CARDINAL:** O mapa de 45 atividades e o desdobramento pratico do Pilar Marketing (Face 1 — O Mapa). E a resposta pra "o que eu preciso fazer no negocio?". As 6 disciplinas transversais (copy, estrategia, design, dados, AV, trafego) sao a Face 2 — O Know-how ("como fazer bem cada uma"). [Fonte: SRC-C05, SRC-C01]

### 4.1 Framework de Classificacao: 6 Dimensoes

Cada uma das 45 atividades carrega 6 dimensoes simultaneas: [Fonte: SRC-C05]

**Dimensao 1 — Tipo (pode acumular):**

| Tipo | Significado | Prioridade |
|------|-------------|------------|
| **Chave** | Game changer, define o patamar do negocio | 1a (se + Geradora) ou 3a (se isolada) |
| **Geradora** | Bota dinheiro no caixa diretamente | 2a |
| **Solidez** | Constroi estrutura e sustentacao | 4a |
| **Mantenedora** | Mantem o que existe funcionando | 5a |
| **Reativa** | Apareceu, tem que resolver (imprevisivel) | 6a |

**Dimensao 2 — Dono:**

| Dono | Significado |
|------|-------------|
| **Expert** | Sempre do expert, nao sai da mao dele |
| **Expert primeiro** | Expert faz ate dominar, depois pode delegar |
| **Delegavel** | Pode sair da mao do expert desde o inicio |

**Dimensao 3 — Modo mental:**

| Modo | O que exige |
|------|-------------|
| **Criativo** | Criar algo, foco profundo e estado |
| **Analitico** | Ler dados e tomar decisao |
| **Relacional** | Estar presente com gente, escuta e presenca |
| **Operacional** | Executar processo, atencao sem criatividade |

**Dimensao 4 — Frequencia:** Diaria, Semanal, Mensal, Semestral, Por ciclo, Pontual, Pontual com revisao [Fonte: SRC-C05]

**Dimensao 5 — Fase do negocio em que entra:** Fase 1+, Fase 2+, Fase 3+, Fase 4+ [Fonte: SRC-C05]

**Dimensao 6 — Modo IA (adicionado na v3):** P (Pensar junto), C (Co-piloto), B (Briefing), A (Automacao) + H (Humano — categoria a parte, nao e modo de IA) [Fonte: SRC-C05]

### 4.2 Os 4 Modos de Interacao com IA

| Sigla | Modo | Descricao |
|-------|------|-----------|
| **P** | Pensar junto | Expert senta com IA pra raciocinar, analisar, decidir |
| **C** | Co-piloto | Expert executando, IA do lado guiando em tempo real |
| **B** | Briefing | Expert da input/direcao, IA produz output, expert revisa |
| **A** | Automacao | Roda sozinho, zero ou minimo toque humano |

**Atividades Humanas Irredutiveis (H):** Atividades onde a presenca humana E o produto — voz, rosto, conexao, presenca. Nao sao modo de IA porque nao envolvem IA. Sao a excecao declarada: o que o expert faz porque so ele pode fazer. Exemplos: vendas por call, entrega ao vivo, evento presencial, stories, social selling, gravacao de conteudo. [Fonte: SRC-C01]

[Fonte: SRC-C05]

**Observacoes fundamentais do mapeamento:** [Fonte: SRC-C05]
- **P e baseline.** Aparece em 40+ das 45 atividades. "Pensar com IA" nao e modo especifico — e a mentalidade padrao.
- **A maioria das atividades e multi-modal.** Nao e UM modo, e combinacao. O que muda e a proporcao e a etapa.
- **Atividades complexas tem modos diferentes por etapa.** Ex: criativos de anuncio -> pesquisa (P), roteiro (B), gravacao (H), edicao (potencialmente A).
- **"Lembrar" nao e um modo** — e a camada de conhecimento (Skills + Exocortex) que alimenta e potencializa todos os modos.

> **REGRA CARDINAL:** Os 4 Modos de IA sao: Pensar, Co-piloto, Briefing e Automacao. "Humano" nao e modo de IA — e categoria a parte (atividades humanas irredutiveis onde a presenca humana E o produto). [Fonte: SRC-C01]

> Ver Volume 8 — IA como Sistema Operacional (secao 3.2 para fundamento dos 4 Modos de IA e secao 3.4 para Niveis vs Modos como eixos paralelos)

### 4.3 Mapa de Atividades por Area

**AREA 1: VENDAS (12 atividades)**

| # | Atividade | Tipo | Dono | Modo mental | Modo IA | Freq. | Fase |
|---|-----------|------|------|-------------|---------|-------|------|
| 1 | Planejamento da campanha | Chave | Expert | Criativo + Analitico | P | Por ciclo | 2+ |
| 2 | Construcao da oferta/pitch | Geradora | Expert | Criativo | P | Por ciclo | 2+ |
| 3 | Pagina de vendas/captura | Chave, Geradora | Expert | Criativo | P+B+C | Pontual c/ revisao | 2+ |
| 4 | Conteudo do evento de vendas | Chave, Geradora | Expert | Criativo | P+B | Por ciclo | 2+ |
| 5 | Criativos de anuncio | Chave, Geradora | Expert primeiro | Criativo | P+B+A* | Semanal | 2+ |
| 6 | Infraestrutura da campanha | Mantenedora | Expert primeiro | Operacional | C | Por ciclo | 2+ |
| 7 | Gestao de trafego | Chave, Geradora | Expert primeiro | Analitico | C | Diaria | 2+ |
| 8 | Social selling | Geradora | Expert primeiro | Relacional | H | Diaria | 1+ |
| 9 | Vendas (calls, WhatsApp, comercial) | Geradora | Expert primeiro | Relacional | H+P | Diaria | 1+ |
| 10 | Suporte a leads | Mantenedora | Delegavel | Operacional | A | Diaria | 2+ |
| 11 | Recuperacao | Geradora | Expert primeiro | Criativo | C+A | Por ciclo | 2+ |
| 12 | Coleta de prova social/depoimentos | Solidez | Delegavel | Operacional | P+A | Por ciclo | 2+ |

*Criativos: multi-etapa — pesquisa (P), roteiro (B), gravacao (H), edicao (A potencial) [Fonte: SRC-C05]

**AREA 2: PRODUTO (13 atividades)**

| # | Atividade | Tipo | Dono | Modo mental | Modo IA | Freq. | Fase |
|---|-----------|------|------|-------------|---------|-------|------|
| 1 | Criacao de metodologia | Chave | Expert | Criativo + Analitico | P | Pontual c/ revisao | 1+ |
| 2 | Idealizacao de produto | Chave | Expert | Criativo | P+B | Pontual | 1+ |
| 3 | Estruturacao/revisao da esteira | Solidez | Expert | Analitico | P | Pontual c/ revisao | 1+ |
| 4 | Roteirizacao de cursos e aulas | Chave | Expert | Criativo | P+C | Pontual | 1+ |
| 5 | Gravacao de conteudo (aulas, tutoriais) | Mantenedora | Delegavel | Criativo | H | Semanal | 1+ |
| 6 | Materiais e ferramentas complementares | Solidez | Expert primeiro | Criativo | P+B | Pontual | 2+ |
| 7 | Infraestrutura de produto | Mantenedora | Delegavel | Operacional | C | Semanal | 1+ |
| 8 | Entrega ao vivo (calls, grupo, aulas) | Mantenedora | Expert primeiro | Relacional | H | Semanal | 1+ |
| 9 | Evento presencial de entrega | Chave | Expert | Relacional | H | Por ciclo | 2+ |
| 10 | Suporte operacional (SAC) | Mantenedora | Delegavel | Operacional | A+H | Diaria | 2+ |
| 11 | Suporte tecnico (implementacao) | Mantenedora | Delegavel | Relacional | A+H | Diaria | 2+ |
| 12 | Gestao de comunidade | Mantenedora | Expert primeiro | Relacional | H+C+A | Semanal | 2+ |
| 13 | Atualizacoes e melhorias | Solidez | Expert | Analitico | C | Mensal | 2+ |

[Fonte: SRC-C05]

**AREA 3: AUDIENCIA (8 atividades)**

| # | Atividade | Tipo | Dono | Modo mental | Modo IA | Freq. | Fase |
|---|-----------|------|------|-------------|---------|-------|------|
| 1 | Posicionamento digital (bio, perfil) | Geradora, Solidez | Expert | Criativo | P+B | Pontual c/ revisao | 2+ |
| 2 | Producao de conteudo de feed | Chave, Geradora, Solidez | Expert | Criativo | P+B+C | Semanal | 2+ |
| 3 | Stories | Chave, Geradora, Solidez | Expert | Criativo | P+H | Diaria | 2+ |
| 4 | Conteudo outras plataformas (LinkedIn, YT) | Geradora, Solidez | Expert primeiro | Criativo | P+H+C | Semanal | 3+ |
| 5 | Newsletter | Geradora, Solidez | Expert primeiro | Criativo | P+B+A | Semanal | 3+ |
| 6 | Conteudo pra grupos de relacionamento | Solidez | Expert primeiro | Criativo | B+A | Semanal | 3+ |
| 7 | Gestao da rede social (DMs, comentarios) | Mantenedora | Expert primeiro | Relacional | H | Diaria | 2+ |
| 8 | Analise de metricas e performance | Chave, Solidez | Expert | Analitico | P+H | Semanal | 2+ |

[Fonte: SRC-C05]

**AREA 4: GESTAO (12 atividades)**

| # | Atividade | Tipo | Dono | Modo mental | Modo IA | Freq. | Fase |
|---|-----------|------|------|-------------|---------|-------|------|
| 1 | Planejamento estrategico do negocio | Chave, Solidez | Expert | Criativo + Analitico | P+C | Pontual c/ revisao | 1+ |
| 2 | Definicao de posicionamento e persona | Chave, Geradora, Solidez | Expert | Criativo + Analitico | P | Pontual c/ revisao | 1+ |
| 3 | Calendario comercial | Chave, Geradora, Solidez | Expert | Analitico | P+B+C | Semestral | 1+ |
| 4 | Gestao de projetos e tarefas | Chave, Geradora, Solidez | Expert primeiro | Criativo + Analitico | P+C+A | Diaria/Semanal | 1+ |
| 5 | Gestao de processos | Solidez | Expert primeiro | Operacional | P+C+A | Semanal/Mensal | 2+ |
| 6 | Dados e inteligencia | Chave, Solidez, Geradora | Expert primeiro | Analitico | P+C+A | Semanal/Mensal | 2+ |
| 7 | Gestao de pessoas/equipe | Mantenedora | Expert primeiro | Relacional + Analitico | P+H | Semanal | 3+ |
| 8 | Contratacoes | Solidez, Geradora | Expert primeiro | Relacional | P+H | Pontual | 3+ |
| 9 | Gestao de recursos e ferramentas | Solidez | Expert | Analitico | P+H+C | Mensal | 1+ |
| 10 | Contabil/financeiro | Chave, Solidez | Expert | Analitico + Operacional | P+A+C | Mensal | 1+ |
| 11 | Juridico | Solidez | Expert primeiro | Operacional | P+C+H | Mensal/Semanal | 1+ |
| 12 | Estudo e evolucao | Chave, Solidez | Expert | Criativo + Analitico | P+H | Semanal/Mensal | 1+ |

[Fonte: SRC-C05]

### 4.4 Cruzamento PMI x Atividades

Cada atividade puxa de 3 fontes em proporcoes diferentes: [Fonte: SRC-C05]

- **PROPOSITO** -> da DIRECAO (quem sou, minha voz, minha mensagem, meu chamado)
- **MARKETING** -> da CONHECIMENTO (como fazer bem — copy, estrategia, design, dados, trafego, AV)
- **IA** -> da CAPACIDADE (conseguir executar, mesmo sozinho — via os 5 modos)

**Marketing tem duas faces:** [Fonte: SRC-C05, SRC-C01]
1. **O mapa** — saber que atividades existem, quando fazer, em que ordem (este mapa de 45 atividades)
2. **O know-how** — saber fazer bem cada uma (as disciplinas: copy, estrategia, design, dados, AV, trafego)

Marketing e IA se entrelacam: o know-how de Marketing e o que vai dentro das Skills Tecnicas. Skills Tecnicas sao entregues via IA. Sem conhecimento de Marketing, IA produz coisa generica. Sem IA, conhecimento de Marketing exige especialista caro. [Fonte: SRC-C05, SRC-C01]

**O papel do "Lembrar":**

"Lembrar" (Skills + Exocortex) potencializa todos os modos: [Fonte: SRC-C05]

| Modo | Com memoria |
|------|-------------|
| Pensar junto | Pensa com contexto profundo do negocio |
| Co-piloto | Guia sabendo seus padroes e historico |
| Briefing | Produz output que soa como voce |
| Automacao | Roda alinhado com seu negocio |

Operacionalizado via: [Fonte: SRC-C05]
- **Skills de Identidade** -> quem voce e (Proposito)
- **Skills Tecnicas** -> como fazer bem (Marketing)
- **Skills de Projeto** -> contexto do momento

### 4.5 Padroes Identificados

**Por modo IA x dono:** [Fonte: SRC-C05]

| Dono | Padrao de modo IA |
|------|-------------------|
| **Expert** (21 atividades) | Predomina P+H — presenca humana e o produto, IA pensa junto |
| **Expert primeiro** (18 atividades) | Predomina P+C ou P+B — expert faz mas IA acelera brutalmente |
| **Delegavel** (6 atividades) | Predomina A ou A+H — candidatas naturais pra automacao |

**Distribuicao dos modos:** [Fonte: SRC-C05]

| Modo | Presenca | Papel |
|------|----------|-------|
| P (Pensar) | ~90% das atividades | Baseline, mentalidade. Nao e especifico. |
| C (Co-piloto) | ~45% | Onde IA mais transforma o expert solo — elimina dependencia de especialista |
| B (Briefing) | ~30% | Atividades de producao — criativos, materiais, conteudo |
| H (Humano) | ~40% | Nucleo relacional e presencial — insubstituivel |
| A (Automacao) | ~30% | SAC, suporte, dados, processos repetitivos |

**O que e irredutivel (H puro ou H dominante):** [Fonte: SRC-C05]

Atividades onde a presenca humana E o produto:
- Gravacao de conteudo (voz, rosto, presenca)
- Entrega ao vivo (calls, grupo)
- Evento presencial
- Social selling (relacionamento real)
- Vendas (calls, WhatsApp)
- Stories (presenca diaria)
- Gestao da rede social (DMs, comentarios)

**Disciplinas que atravessam as atividades:** [Fonte: SRC-C05]
- Copy — escrita persuasiva e comunicacao estrategica
- Estrategia — pensamento estrategico e planejamento
- Design — comunicacao visual
- Analise de dados — leitura de metricas e padroes
- Audiovisual — producao de video e audio
- Trafego — conhecimento de midia paga e performance

### 4.6 Logica de Priorizacao

**3 Filtros em Sequencia:** [Fonte: SRC-C05]

**Filtro 1 — Fase do negocio:** Elimina tudo que nao e da sua fase. Se esta na Fase 1, nao olha pra atividades de Fase 3+. Isso corta boa parte da lista e evita profissionalizacao prematura. [Fonte: SRC-C05]

**Filtro 2 — Momento no ciclo:** Dentro das atividades da sua fase, qual o momento? Pre-campanha, durante campanha, pos-campanha, entre ciclos? Cada momento tem atividades que dominam e outras que entram em modo manutencao. [Fonte: SRC-C05]

**Filtro 3 — Hierarquia de tipo:** Com o que sobrou, prioriza por tipo: [Fonte: SRC-C05]

| Prioridade | Tipo | Logica | Exemplo |
|------------|------|--------|---------|
| 1a | Chave + Geradora | Muda patamar E bota dinheiro | Produzir conteudo, lancamento, criativos, gestao de trafego |
| 2a | Geradora | Bota dinheiro, paga boletos | Calls de vendas, social selling, recuperacao |
| 3a | Chave | Muda patamar mas nao gera receita direta agora | Criacao de metodologia, analise de metricas |
| 4a | Solidez | Constroi estrutura | Esteira de produtos, processos, infra |
| 5a | Mantenedora | Mantem rodando | Suporte, comunidade, plataforma |
| 6a | Reativa | Apaga incendio | Imprevistos |

> **REGRA CARDINAL:** Se voce nao fez nada do nivel 1 e 2 hoje, o resto nao importa. [Fonte: SRC-C05]

**Dois niveis de priorizacao:** [Fonte: SRC-C05]

- **Entre projetos:** Projetos ativos competem pela hierarquia de tipo. Projeto chave+gerador (lancamento) vem antes de projeto de solidez (reestruturacao de processos).
- **Dentro do projeto:** A logica e sequencia e fluxo, nao hierarquia. Infra e mantenedora, mas precisa acontecer pro lancamento rodar. Expert foca energia nas atividades chave+geradoras (copy, oferta, criativos, conteudo) e delega ou encaixa as mantenedoras (infra, suporte).

**Armadilhas de profissionalizacao prematura:** Atividades como visagismo, fotos profissionais, identidade visual e branding parecem "trabalho no negocio" mas na fase errada sao procrastinacao disfarcada. A fase do negocio determina se isso e relevante ou distracao. [Fonte: SRC-C05]

### 4.7 Resumo Quantitativo

**Total: 45 atividades no mapa geral** [Fonte: SRC-C05]

| Area | Qtd |
|------|-----|
| Vendas | 12 |
| Produto | 13 |
| Audiencia | 8 |
| Gestao | 12 |

| Tipo | Ocorrencias |
|------|-------------|
| Chave | 22 |
| Geradora | 21 |
| Solidez | 24 |
| Mantenedora | 12 |
| Reativa | nao mapeada (imprevisivel) |

| Dono | Qtd |
|------|-----|
| Expert | 21 |
| Expert primeiro | 18 |
| Delegavel | 6 |

| Fase de entrada | Qtd |
|-----------------|-----|
| Fase 1+ | 18 |
| Fase 2+ | 21 |
| Fase 3+ | 6 |

| Modo IA | Presenca (de 45) |
|---------|------------------|
| P (Pensar junto) | ~40 atividades |
| C (Co-piloto) | ~20 atividades |
| B (Briefing) | ~13 atividades |
| H (Humano) | ~18 atividades |
| A (Automacao) | ~14 atividades |

**Evolucao futura:** Atividades hoje em modo C ou B podem migrar pra A via Squads de IA conforme o sistema evolui. Nao mapeado nesta versao — foco e o modo atual de operacao. [Fonte: SRC-C05]

> Ver Volume 9 — Gestao, Ambiente e OPB (para gestao detalhada das 4 areas do negocio)

---

## 5. Conexoes Entre Volumes

| Volume | Conexao com Volume 10 |
|--------|----------------------|
| **Vol 1 — Fundacao e Tese** | Tese NDF e o "por que" de tudo neste volume — Skills e Squads existem para dar autonomia tecnica ao expert |
| **Vol 2 — Arvore do Expert** | O expert do futuro nao e so quem tem know-how — e quem sabe construir e transferir know-how via IA (Produto de Segundo Ordem) |
| **Vol 3 — Maturidade, Niveis e Fases** | As 4 fases do negocio (Ideacao -> Escala) determinam quais Skills e Squads sao relevantes em cada momento |
| **Vol 5 — Metodologia** | A Arvore do Expert como framework e o que da substancia as Skills de Identidade |
| **Vol 7 — Copa: Audiencia e Vendas** | As atividades de Audiencia (8) e Vendas (12) do mapa de 45 sao o desdobramento pratico do que o Vol 7 cobre conceitualmente |
| **Vol 8 — IA como Sistema Operacional** | Base conceitual direta — este volume e a camada avancada/operacional do que o Vol 8 fundamenta (Niveis, Modos, Skills, Squads, IA Executora/Juiza) |
| **Vol 9 — Gestao, Ambiente e OPB** | As atividades de Gestao (12) e o principio Pavimentar antes de Delegar conectam com a visao de OPB do Vol 9 |

---

*Volume 10 — Composicao ETLmaker v2.0 | Metodologia Euriler Jube — Negocio Digital do Futuro*
