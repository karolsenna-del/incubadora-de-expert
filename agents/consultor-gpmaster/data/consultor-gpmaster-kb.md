# GPMaster — Knowledge Base

> 10 mestres sintetizados por dominio de aplicacao.
> Organizado para uso pratico: diagnostico, criacao, otimizacao, gestao de pessoas.

---

## 1. OS 10 MESTRES — Referencia Rapida

| # | Mestre | Obra-Prima | Framework Central | Pergunta que Faz |
|---|--------|-----------|-------------------|-------------------|
| 1 | David Allen | Getting Things Done | GTD (5 passos + 6 horizontes) | Qual e a proxima acao fisica? |
| 2 | Jeff Sutherland | Scrum: Twice the Work, Half the Time | Scrum (3 papeis, 5 eventos, 3 artefatos) | O time ta terminando cedo? |
| 3 | Eliyahu Goldratt | The Goal | TOC (5 Focusing Steps + Thinking Processes) | Onde esta o constraint? |
| 4 | Peter Drucker | The Effective Executive | 5 Habitos de Eficacia + MBO | Qual e a contribuicao? |
| 5 | Taiichi Ohno | Toyota Production System | TPS (JIT + Jidoka + 7 Mudas) | Onde esta o desperdicio? |
| 6 | Mike Cohn | Agile Estimating & Planning | Story Points + INVEST + Planning Onion | Quanto isso realmente custa? |
| 7 | Jurgen Appelo | Management 3.0 | 6 Views + CHAMPFROGS + Delegation Poker | As pessoas estao energizadas? |
| 8 | Atul Gawande | The Checklist Manifesto | DO-CONFIRM / READ-DO Checklists | Tem checklist nos pontos criticos? |
| 9 | Marty Cagan | Inspired / Empowered / Transformed | Product Discovery + 4 Risks + Empowered Teams | Estamos construindo a coisa certa? |
| 10 | W. Edwards Deming | Out of the Crisis | SoPK (4 pilares) + 14 Pontos + PDSA | O sistema e estavel? |

---

## 2. PRINCIPIOS UNIVERSAIS — Onde Todos Concordam

Estes principios aparecem em pelo menos 5 dos 10 mestres. Sao verdades convergentes:

### 2.1 O Sistema Determina o Resultado

> "Every system is perfectly designed to get the results it gets." — Deming

Se o resultado e ruim, o sistema e ruim. Nao adianta trocar as pessoas (Deming). Nao adianta trabalhar mais horas (Sutherland). Nao adianta otimizar a parte errada (Goldratt). Mude o sistema.

**Quem diz isso:** Deming (SoPK), Goldratt (local vs global optima), Ohno (TPS como sistema, nao ferramentas), Cagan (empowered teams vs feature teams), Drucker (gestao como design)

### 2.2 Desperdicio e o Inimigo

> "All we are doing is looking at the timeline and reducing it by removing non-value-adding wastes." — Ohno

Tudo que nao agrega valor ao output final e desperdicio. Producao excessiva, espera, transporte desnecessario, processamento alem do pedido, estoque, movimento, defeitos, talento desperdicado.

**Quem diz isso:** Ohno (7 mudas), Goldratt (throughput accounting), Allen (open loops como desperdicio cognitivo), Sutherland (85% do esforço e waste), Drucker (abandonment planejado)

### 2.3 Ciclos Curtos Vencem Planejamento Longo

> "Plans are hypotheses. Reality is the test." — Sutherland

Todo plano e hipotese. A unica forma de aprender e rodar ciclos curtos e ajustar. PDSA (Deming), sprints (Sutherland), weekly review (Allen), discovery iterations (Cagan).

**Quem diz isso:** Deming (PDSA), Sutherland (sprints), Allen (weekly review), Cagan (continuous discovery), Cohn (cone of uncertainty)

### 2.4 Pessoas Nao Sao o Problema

> "A bad system will defeat a good person every time." — Deming

Culpar pessoas por falhas de sistema e o erro mais comum e mais destrutivo da gestao. Se o processo falha, o processo e o culpado. Se as pessoas nao performam, o sistema nao as esta habilitando.

**Quem diz isso:** Deming (94/6 rule — sistema responsavel por 94%), Ohno (respeito = nao desperdicar inteligencia), Appelo (energize people), Drucker (construir sobre forcas), Sutherland (happiness metric), Gawande (ineptitude, nao ignorancia)

### 2.5 Melhoria e Infinita

> "If you are going to do kaizen, you've got to assume that things are a mess." — Ohno

Nao existe processo perfeito. Existe processo que melhora continuamente. PDSA, kaizen, retrospectiva — o nome muda, o principio e o mesmo.

**Quem diz isso:** Ohno (kaizen), Deming (PDSA, improve constantly), Sutherland (retrospectiva), Allen (weekly review), Cagan (continuous discovery)

---

## 3. DIAGNOSTICO — Como Julgar um Processo

### 3.1 As 5 Lentes do Diagnostico

Quando analisar qualquer processo, aplicar todas as 5 lentes simultaneamente:

**LENTE 1 — Goldratt: Onde esta o constraint?**

O constraint e o recurso cuja capacidade e menor ou igual a demanda. Ele determina o throughput do sistema inteiro.

Perguntas:
- Qual etapa tem a fila mais longa?
- Onde o trabalho acumula e espera?
- Se eu acelerasse essa etapa, o throughput total aumentaria?
- Estou otimizando nao-constraints? (se sim, estou desperdicando)

Ferramentas: 5 Focusing Steps, Drum-Buffer-Rope, Current Reality Tree

**LENTE 2 — Ohno: Onde esta o desperdicio?**

Procurar os 7+1 mudas em cada etapa:

| Muda | Pergunta Diagnostica |
|------|---------------------|
| Superprodução | Estamos produzindo mais do que o proximo passo precisa? |
| Estoque | Tem trabalho acumulado entre etapas? |
| Transporte | Material/informacao viaja mais do que deveria? |
| Movimento | Pessoas se movem desnecessariamente? |
| Espera | Alguem esta parado esperando algo? |
| Superprocessamento | Estamos fazendo mais do que o cliente pediu? |
| Defeitos | Retrabalho existe? Com que frequencia? |
| Talento desperdicado | Pessoas qualificadas fazendo trabalho que nao usa sua capacidade? |

Perguntas adicionais:
- Esse processo e push ou pull? (push acumula estoque)
- Qual e o takt time real? O processo respeita?
- Mura (irregularidade) e Muri (sobrecarga) estao presentes?

**LENTE 3 — Deming: O sistema e estavel?**

Perguntas:
- A variacao nos resultados e common cause (inerente ao sistema) ou special cause (evento pontual)?
- Estamos reagindo a cada flutuacao? (tampering — piora o sistema)
- Existe PDSA rodando? Ou o processo e estatico?
- As metricas tem definicao operacional clara?
- Medo esta presente? (medo produz dados falsos)

Ferramentas: Controle estatistico de processo, Red Bead experiment (conceitual), Funnel experiment (conceitual)

**LENTE 4 — Gawande: Os pontos criticos tem protecao?**

Perguntas:
- Quais etapas sao criticas (erro aqui = falha grave)?
- Essas etapas tem checklist? Sao DO-CONFIRM ou READ-DO?
- Os checklists tem no maximo 9 itens?
- Tem pause points definidos (momentos de verificacao)?
- A comunicacao entre etapas e formalizada?

Diagnostico de tipo de problema:
- Simple (receita funciona) -> processo padrao
- Complicated (expertise resolve) -> especialista + coordenacao
- Complex (emergente, imprevisivel) -> julgamento adaptativo + restricoes

**LENTE 5 — Drucker: Isso contribui para o resultado que importa?**

Perguntas:
- Qual e o OBJETIVO desse processo? (se ninguem sabe, o processo nao deveria existir)
- O output desse processo contribui para resultado direto, construcao de valores, ou desenvolvimento de pessoas?
- Se eliminassemos esse processo hoje, o que aconteceria? (se "nada" -> abandonar)
- Quem e o CLIENTE desse processo? (interno ou externo)
- Estamos medindo eficacia (coisas certas) ou eficiencia (coisas certo)?

### 3.2 Formato do Veredicto

Depois de aplicar as 5 lentes:

```
DIAGNOSTICO
===========
Processo: {nome}
Objetivo declarado: {o que deveria fazer}
Resultado real: {o que realmente produz}

CONSTRAINT PRINCIPAL:
{onde esta o gargalo e por que}

DESPERDICIOS IDENTIFICADOS:
1. {muda + onde + impacto}
2. {muda + onde + impacto}
...

ESTABILIDADE DO SISTEMA:
{common vs special cause, nivel de variacao}

PONTOS CRITICOS SEM PROTECAO:
{etapas criticas sem checklist}

CONTRIBUICAO REAL:
{o processo contribui ou nao para resultado que importa}

PRESCRICAO:
1. {acao imediata — quick win}
2. {acao de medio prazo — mudanca estrutural}
3. {acao de longo prazo — redesign se necessario}

METRICAS DE ACOMPANHAMENTO:
- {metrica 1: o que medir e por que}
- {metrica 2: o que medir e por que}
```

---

## 4. CRIACAO — Como Projetar um Processo do Zero

### 4.1 O Protocolo de 7 Passos

**Passo 1 — Definir o Objetivo (Drucker)**

Antes de qualquer coisa: por que esse processo existe?
- Qual contribuicao ele faz?
- Quem e o cliente? (quem recebe o output)
- Qual e o resultado esperado?
- Se eu nao criar esse processo, o que acontece?

"There is nothing so useless as doing efficiently that which should not be done at all." — Drucker

**Passo 2 — Definir Restricoes (Goldratt)**

- Quanto tempo disponivel?
- Quantas pessoas envolvidas?
- Quais ferramentas disponiveis?
- Qual o orcamento?
- Quais dependencias externas?
- Qual e o constraint provavel? (ja antecipar)

**Passo 3 — Planejar Naturalmente (Allen — Natural Planning Model)**

1. Proposito e principios: por que existe e quais limites nao violamos
2. Visao do resultado: como e o sucesso? O que teremos quando acabar?
3. Brainstorm: gerar ideias sem filtro
4. Organizar: sequenciar, priorizar, identificar componentes
5. Next actions: definir a proxima acao fisica para cada frente

**Passo 4 — Desenhar o Fluxo (Ohno — princípios Lean)**

- Pull system: cada etapa puxa do anterior (nao push)
- One-piece flow: processar uma unidade por vez quando possivel
- Takt time: cadenciar pelo ritmo do cliente
- Eliminar handoffs desnecessarios
- Cada etapa com Definition of Done clara (Sutherland)
- Dono por etapa (nunca etapa sem responsavel)

**Passo 5 — Adicionar Protecao (Gawande — Checklists)**

Nos pontos criticos (onde erro = falha grave):
- Checklist DO-CONFIRM para profissionais experientes
- Checklist READ-DO para procedimentos novos ou criticos
- Maximo 9 itens por checklist
- Pause point definido: quando exatamente rodar o checklist
- Dupla funcao: verificacao + comunicacao entre membros

**Passo 6 — Definir Metricas de Saude**

Inspirado em Sutherland (metricas de time) + Deming (controle estatistico):

| Tipo de Metrica | O que Mede | Exemplo |
|----------------|-----------|---------|
| Throughput | Volume de output por periodo | Pedidos processados/dia |
| Lead time | Tempo do input ao output | Tempo do pedido ao despacho |
| Cycle time | Tempo de uma etapa especifica | Tempo de aprovacao |
| WIP | Trabalho em progresso | Itens entre etapas |
| Defect rate | Taxa de erro/retrabalho | % de pedidos com erro |
| Happiness | Satisfacao do time | Escala 1-5 por retrospectiva |

Regra: maximo 5 metricas. Mais do que isso e ruido.

**Passo 7 — Ciclo de Melhoria (Deming — PDSA)**

Todo processo criado nasce com seu ciclo de revisao embutido:

- Plan: o que esperamos que o processo produza?
- Do: rodar por periodo definido (1-2 semanas iniciais)
- Study: o que realmente aconteceu vs. o esperado?
- Act: ajustar, adotar ou abandonar partes do processo

Frequencia de revisao: semanal no inicio, quinzenal quando estabilizar, mensal quando maduro.

### 4.2 Checklist de Processo Bem Desenhado

- [ ] Objetivo claro e documentado
- [ ] Cliente do processo identificado
- [ ] Fluxo de ponta a ponta mapeado
- [ ] Dono para cada etapa
- [ ] Definition of Done para cada etapa
- [ ] Checklists nos pontos criticos (max 9 itens cada)
- [ ] Metricas de saude definidas (max 5)
- [ ] Ciclo PDSA programado
- [ ] Constraint antecipado e protegido

---

## 5. OTIMIZACAO — Como Melhorar um Processo Existente

### 5.1 Os 5 Focusing Steps (Goldratt)

O framework primario de otimizacao. Sempre comecar aqui:

**Step 1 — Identificar o constraint**
Onde esta o gargalo? Sintomas: fila longa, WIP acumulado, espera frequente. O constraint pode ser:
- Fisico: pessoa, maquina, espaco
- Politico: regra, procedimento, aprovacao
- De mercado: demanda insuficiente

**Step 2 — Explorar o constraint**
Antes de investir, extrair o maximo do que ja existe:
- O constraint esta parado em algum momento? (eliminar idle time)
- O constraint esta processando coisas que nao deveria? (priorizar)
- O constraint tem tudo que precisa quando precisa? (buffer antes dele)

**Step 3 — Subordinar tudo ao constraint**
Todos os outros recursos operam NO RITMO do constraint. Nao-constraints podem ficar ociosos — e isso e CORRETO. Rodar nao-constraints a 100% so acumula WIP.

**Step 4 — Elevar o constraint**
Se exploit + subordinate nao bastou: investir. Comprar capacidade, contratar, automatizar. Mas so depois dos steps 2 e 3.

**Step 5 — Repetir (e cuidado com inercia)**
O constraint muda de lugar quando resolvido. Recomecar. E: politicas criadas para o constraint anterior podem virar obstaculos.

### 5.2 Eliminacao dos 7 Mudas (Ohno)

Apos tratar o constraint, eliminar desperdicios visiveis:

| Muda | Tecnica de Eliminacao |
|------|-----------------------|
| Superprodução | Mudar para pull system. Produzir so quando o proximo passo pede. |
| Estoque (WIP) | Reduzir batch size. Kanban com WIP limits. |
| Transporte | Reorganizar layout. Aproximar etapas dependentes. |
| Movimento | Ergonomia. Ferramentas ao alcance. Eliminar busca de informacao. |
| Espera | Balancear carga. Buffer antes do constraint. Eliminar aprovacoes desnecessarias. |
| Superprocessamento | Perguntar ao cliente. Eliminar o que ele nao pediu. |
| Defeitos | Jidoka: parar e resolver na hora. Poka-yoke: tornar erro impossivel. 5 Whys: causa raiz. |
| Talento desperdicado | Envolver pessoas em melhoria. Delegar decisoes. Usar Delegation Poker (Appelo). |

### 5.3 Estabilizacao (Deming)

Se o processo e instavel (resultados imprevissiveis):

1. Determinar se a variacao e common cause ou special cause
2. Special cause: investigar e eliminar o evento especifico
3. Common cause: mudar o SISTEMA (nao as pessoas, nao os procedimentos pontuais)
4. Nunca reagir a cada flutuacao individual (tampering — piora tudo)
5. Usar PDSA para cada mudanca: Plan (hipotese) → Do (teste pequeno) → Study (comparar) → Act (adotar/adaptar/abandonar)

### 5.4 Protecao (Gawande)

Nos pontos criticos que nao tem protecao:

1. Identificar os "killer items" — passos que experts esquecem (nao os obvios)
2. Criar checklist de 5-9 itens
3. Definir o tipo: DO-CONFIRM (experts) ou READ-DO (novatos/alta pressao)
4. Definir o pause point: QUANDO exatamente o checklist e executado
5. Testar em condicao real antes de formalizar
6. Iterar ate funcionar na pratica

### 5.5 Melhoria de Ritmo (Sutherland + Ohno)

Se o processo e lento mas estavel:

1. Calcular o takt time real (demanda / tempo disponivel)
2. Comparar cycle time de cada etapa com o takt time
3. Etapas acima do takt time: dividir, simplificar ou paralelizar
4. Eliminar multitasking (context switching e desperdicio puro)
5. Usar Yesterday's Weather: projetar capacidade futura com base nos ultimos 3 ciclos, nao com wishful thinking
6. Times que terminam cedo aceleram: deixar folga, nao encher ate 100%

---

## 6. GESTAO DE PESSOAS EM PROCESSOS

### 6.1 Drucker — Os 5 Habitos do Executivo Efetivo

1. **Gerenciar o tempo:** Registrar, eliminar, consolidar em blocos longos
2. **Focar em contribuicao:** "Que resultado posso produzir que mude algo?"
3. **Construir sobre forcas:** Staffing pelo que a pessoa faz bem, nao pelo que precisa melhorar
4. **Concentrar:** Fazer primeiro as coisas mais importantes. Uma de cada vez. Definir posteriorities (o que NAO fazer).
5. **Tomar decisoes efetivas:** Classificar → boundary conditions → comecar pelo certo → implementar → feedback

Frase: "Feed opportunities and starve problems."

### 6.2 Appelo — Management 3.0

**Os 10 Motivadores (CHAMPFROGS):**

| Motivador | O que e |
|-----------|---------|
| Curiosity | Investigar, aprender, explorar |
| Honor | Trabalho alinhado com valores |
| Acceptance | Reconhecimento dos pares |
| Mastery | Desafio no nivel certo |
| Power | Influencia sobre o que acontece |
| Freedom | Autonomia |
| Relatedness | Conexoes significativas |
| Order | Processos estaveis |
| Goal | Proposito refletido no trabalho |
| Status | Posicao reconhecida |

**Delegation Poker — 7 niveis:**

| Nivel | Nome | Quem decide |
|-------|------|------------|
| 1 | Tell | Gestor decide, comunica |
| 2 | Sell | Gestor decide, justifica |
| 3 | Consult | Gestor pede input, decide |
| 4 | Agree | Decisao conjunta |
| 5 | Advise | Time decide, gestor opina |
| 6 | Inquire | Time decide, gestor e informado |
| 7 | Delegate | Time com total autonomia |

Regra: mapear cada area de decisao no nivel certo. Ambiguidade sobre quem decide e a maior fonte de conflito.

### 6.3 Deming — Psicologia Organizacional

**Forcas de destruicao (eliminar):**
- Performance reviews / ranking de funcionarios
- Merit pay baseado em avaliacao individual
- Metas numericas sem metodo
- Competicao interna entre colegas
- Medo (produz dados falsos e compliance minimo)
- Slogans e exortacoes ("Zero defeitos!" muda nada)

**O que colocar no lugar:**
- Constancy of purpose (proposito de longo prazo)
- Drive out fear (seguranca psicologica)
- Break down barriers between departments
- Institute leadership (supervisor ajuda, nao controla)
- Joy in work como criterio de saude organizacional

Frase: "85-94% da variacao nos resultados vem do sistema. 6-15% vem das pessoas. Quem e responsavel pelo sistema? A gestao."

### 6.4 Sutherland — Happiness como Metrica

A cada retrospectiva, cada membro responde:
1. "De 1 a 5, quao feliz voce esta com seu papel?"
2. "Qual UMA coisa te faria mais feliz no proximo ciclo?"

Happiness e indicador antecedente de velocity. Cai primeiro, performance cai depois. Subir primeiro, performance sobe depois. Nao e soft — e leading indicator.

### 6.5 Cagan — Missionaries vs Mercenaries

| Feature Teams (Mercenarios) | Empowered Teams (Missionarios) |
|-----------------------------|-------------------------------|
| Recebem lista de features | Recebem problema pra resolver |
| Accountability por output | Accountability por outcome |
| Motivacao extrinseca | Motivacao intrinseca |
| Time reativo | Time proativo |
| "Fizemos o que mandaram" | "Resolvemos o problema" |

A diferenca entre mercenarios e missionarios nao e contratacao — e o modelo operacional. Mesma pessoa pode ser missionaria ou mercenaria dependendo de como o sistema a trata.

---

## 7. CAIXA DE FERRAMENTAS — Situacao → Ferramenta

### 7.1 Diagnostico

| Situacao | Ferramenta | Mestre |
|----------|-----------|--------|
| Processo lento, nao sei onde esta o problema | 5 Focusing Steps + Current Reality Tree | Goldratt |
| Muito retrabalho e erro | 5 Whys + Jidoka + Checklist | Ohno + Gawande |
| Resultados imprevisiveis | Controle estatistico (common vs special cause) | Deming |
| Time desmotivado | Moving Motivators + Happiness Metric | Appelo + Sutherland |
| Processo existe mas ninguem sabe pra que | Teste de contribuicao + Abandonment test | Drucker |
| Construimos a coisa errada | 4 Risks Assessment | Cagan |

### 7.2 Planejamento

| Situacao | Ferramenta | Mestre |
|----------|-----------|--------|
| Projeto novo, preciso planejar | Natural Planning Model (5 fases) | Allen |
| Preciso estimar entregas | Story Points + Planning Poker + Velocity | Cohn |
| Preciso priorizar backlog | Valor/Risco Matrix + WSJF | Cohn + Cagan |
| Time novo, nao sei o ritmo | Yesterday's Weather (3 sprints) | Sutherland |
| Incerteza alta, nao sei quanto vai custar | Cone of Uncertainty + Ranges | Cohn |
| Preciso decidir o que NAO fazer | Posteriorities + Abandonment test | Drucker |

### 7.3 Execucao

| Situacao | Ferramenta | Mestre |
|----------|-----------|--------|
| Processo com muitas etapas, medo de esquecer algo | Checklist DO-CONFIRM (max 9 itens) | Gawande |
| Procedimento novo, time nao conhece | Checklist READ-DO | Gawande |
| Trabalho acumula entre etapas | Kanban + WIP limits | Ohno |
| Time nao sabe quem decide o que | Delegation Board | Appelo |
| Ninguem sabe qual e o proximo passo | Next Action + Contextos | Allen |
| Muita coisa na cabeca, sensacao de caos | GTD Capture + Clarify + Organize | Allen |

### 7.4 Melhoria

| Situacao | Ferramenta | Mestre |
|----------|-----------|--------|
| Quero melhorar mas nao sei por onde | Identificar constraint primeiro | Goldratt |
| Processo funciona mas e lento | Eliminar 7 mudas + Reduzir batch size | Ohno |
| Quero mudanca mas nao sei o impacto | PDSA cycle (teste pequeno) | Deming |
| Time parado, sem energia | CHAMPFROGS assessment | Appelo |
| Retrospectiva nao gera mudanca real | Happiness metric + 1 melhoria por ciclo | Sutherland |
| Quero encontrar quem ja resolve isso dentro da org | Positive Deviance | Gawande |

### 7.5 Conflitos e Decisoes

| Situacao | Ferramenta | Mestre |
|----------|-----------|--------|
| Conflito entre duas necessidades | Evaporating Cloud (premissa falsa) | Goldratt |
| Decisao importante, muitas opcoes | Framework de decisao (5 passos) | Drucker |
| Time discorda sobre complexidade de uma tarefa | Planning Poker | Cohn |
| Preciso convencer alguem | Future Reality Tree (mapa de consequencias) | Goldratt |
| Nao sei se o problema e do sistema ou da pessoa | Common vs Special cause analysis | Deming |

---

## 8. FRAMEWORKS COMPLETOS — Referencia Detalhada

### 8.1 GTD — Getting Things Done (Allen)

**Os 5 Passos:**
1. **Capture** — Tirar tudo da cabeca. Todo open loop vai pro inbox.
2. **Clarify** — Processar cada item: e acionavel? Sim → next action. Nao → descartar/incubar/arquivar.
3. **Organize** — Colocar no lugar certo: calendario, next actions (por contexto), projetos, waiting for, someday/maybe.
4. **Reflect** — Weekly Review (60-90 min): limpar, atualizar, criar.
5. **Engage** — Decidir o que fazer agora: contexto → tempo → energia → prioridade.

**6 Horizontes de Foco:**
| Nivel | Altitude | Pergunta |
|-------|----------|----------|
| Runway | Solo | Quais next actions? |
| H1 | 10.000 pes | Quais projetos ativos? |
| H2 | 20.000 pes | Quais areas de responsabilidade? |
| H3 | 30.000 pes | Objetivos de 2-5 anos? |
| H4 | 40.000 pes | Visao de longo prazo? |
| H5 | 50.000 pes | Proposito e principios? |

Direcao de derivacao: top-down (proposito gera visao gera objetivos gera projetos gera acoes).
Direcao de execucao: bottom-up (domine o runway antes de subir).

**Natural Planning Model:**
1. Proposito e principios (por que?)
2. Visao do resultado (o que e sucesso?)
3. Brainstorm (ideias sem filtro)
4. Organizar (sequenciar, priorizar)
5. Next actions (proximo passo fisico)

**Heuristicas:**
- Regra dos 2 minutos: se leva menos de 2 min, faz agora
- Calendario e sagrado: so hard landscape (data e hora reais)
- Todo projeto precisa de pelo menos 1 next action
- Mente e pra ter ideias, nao pra guardar (trusted system)
- Controle + Perspectiva = eficacia total

### 8.2 Scrum (Sutherland)

**3 Papeis:** Product Owner (o que e por que), Developers (como), Scrum Master (remove impedimentos)

**5 Eventos:**
| Evento | Quando | Duracao | Proposito |
|--------|--------|---------|-----------|
| Sprint | Ciclo fixo 1-4 sem | Fixo | Container |
| Sprint Planning | Inicio | Max 8h/mes | O que + como |
| Daily Scrum | Diario | 15 min | Inspecao + adaptacao |
| Sprint Review | Final | Max 4h | Inspecao do incremento |
| Sprint Retrospective | Final | Max 3h | Inspecao do processo |

**3 Artefatos:** Product Backlog (priorizado), Sprint Backlog (do time), Increment (potencialmente entregavel)

**Heuristicas:**
- Yesterday's Weather: media das ultimas 3 sprints = capacidade real
- Times que terminam cedo aceleram mais rapido (folga = investimento)
- INVEST para stories: Independent, Negotiable, Valuable, Estimable, Small, Testable
- Velocity nao e meta — e medicao. Usar como meta destroi a honestidade
- Time ideal: 4-7 pessoas. Acima de 7, custo por ponto quase dobra
- Impediment removal e o lever #1 do Scrum Master
- Happiness Metric: leading indicator de velocity

### 8.3 Theory of Constraints (Goldratt)

**5 Focusing Steps:** Identificar → Explorar → Subordinar → Elevar → Repetir

**3 Metricas Globais:**
- **Throughput (T):** Dinheiro gerado pelas vendas
- **Inventory (I):** Dinheiro investido em coisas pra vender
- **Operating Expense (OE):** Dinheiro gasto pra transformar I em T

Prioridade: aumentar T > reduzir OE > reduzir I

**Drum-Buffer-Rope:**
- Drum: o constraint dita o ritmo
- Buffer: estoque antes do constraint (nunca deixar ele parado)
- Rope: sinal do constraint pro inicio (produzir so quando puxar)

**Thinking Processes:**
- Current Reality Tree (CRT): causa-efeito dos problemas atuais → encontra root cause
- Evaporating Cloud (EC): mapeia conflito → identifica premissa falsa → conflito "evapora"
- Future Reality Tree (FRT): testa solucoes propostas → verifica consequencias
- Prerequisite Tree: lista obstaculos → define intermediate objectives
- Transition Tree: sequencia acoes concretas de implementacao

**Critical Chain (projetos):**
- Remover safety das estimativas individuais
- Concentrar safety em buffers do projeto
- Buffer verde (>2/3): ok. Amarelo (1/3-2/3): monitore. Vermelho (<1/3): aja.

**Heuristicas:**
- Todo conflito tem pelo menos uma premissa falsa
- Local optima destroi global optima
- Superproducao esconde todos os outros problemas
- Se nao encontra o constraint, ele e politico (nao fisico)
- A inercia do constraint anterior e o maior perigo apos resolve-lo

### 8.4 Eficacia Executiva (Drucker)

**5 Habitos:** Tempo → Contribuicao → Forcas → Concentracao → Decisoes

**Framework de Decisao:**
1. Classificar: generico (criar politica) ou unico (resolver caso)
2. Boundary conditions: o minimo que a decisao precisa realizar
3. Comecar pelo certo (nao pelo aceitavel)
4. Implementacao: quem sabe, quem faz, como, quando
5. Feedback: checar 6-9 meses depois

**Teoria do Negocio:** Pressupostos sobre ambiente + missao + competencias. Quando o negocio estagna, a teoria ficou obsoleta.

**7 Fontes de Inovacao:** Inesperado → Incongruencia → Necessidade de processo → Mudanca estrutural → Demografias → Percepcao → Novo conhecimento

**Heuristicas:**
- "Se nao estivessemos nisto, entrarîamos?" (se nao → abandonar)
- "Qual contribuicao posso fazer que mude algo?" (foco em resultado)
- Priorities + posteriorities (o que NAO fazer e tao importante)
- Feedback analysis: expectativa vs resultado real para descobrir forcas
- Nao busque consenso: discordancia revela alternativas e premissas

### 8.5 Toyota Production System (Ohno)

**Pilares do TPS:**
- Pilar 1 — JIT: produzir so o necessario, quando necessario, na quantidade necessaria
- Pilar 2 — Jidoka: autonomacao, parar e resolver na hora, qualidade no processo
- Fundacao: Heijunka (nivelamento) + Trabalho Padronizado + Kaizen

**Ferramentas:**
- Kanban: sinal visual que autoriza producao/movimento
- 5 Whys: perguntar "por que?" 5 vezes ate a causa raiz
- 5S: Seiri (organizar), Seiton (ordenar), Seiso (limpar), Seiketsu (padronizar), Shitsuke (disciplinar)
- Andon: sinal visual do estado da linha
- Poka-yoke: mecanismo a prova de erro
- Genchi genbutsu: ir ao gemba, ver com os proprios olhos
- One-piece flow: processar uma unidade por vez

**Heuristicas:**
- Superprodução e o pior muda (gera todos os outros)
- Estoque esconde problemas (metafora do rio)
- Dados reportam o passado; fatos mostram o agora — va ao gemba
- Padrao → desvio → problema → solucao → novo padrao
- "Custos existem para serem reduzidos, nao calculados"
- Comecar agora e a unica forma de vencer (acao > planejamento perfeito)

### 8.6 Estimativas Ageis (Cohn)

**Planning Onion:** Estrategico → Produto → Release → Iteracao → Diario

**Story Points:** Combinam quantidade de trabalho + complexidade + incerteza. Escala Fibonacci.

**INVEST:** Independent, Negotiable, Valuable, Estimable, Small, Testable

**SPIDR (story splitting):** Spikes, Paths, Interfaces, Data, Rules

**Planning Poker:** Estimativa simultanea → discussao de outliers → convergencia

**Velocity:** Story points completados/sprint. Media de 3-5 sprints.

**Cone of Uncertainty:** Inicio (4x erro), Requisitos (2x), Design (1.5x), Dev (1.25x)

**Heuristicas:**
- Nao estime em horas — pontos relativos sao mais precisos
- Velocity e descritiva, nao prescritiva (nunca usar como meta)
- Story grande e mentira organizada — divide ate caber
- Alto valor + alto risco = fazer primeiro (aprender rapido)
- Incerteza e dado, nao problema — comunique ranges, nao numeros

### 8.7 Management 3.0 (Appelo)

**6 Views (Martie):**
1. Energize People — motivacao intrinseca
2. Empower Teams — auto-organizacao com restricoes
3. Align Constraints — direcao sem microgerenciamento
4. Develop Competence — skills como pre-requisito de autonomia
5. Grow Structure — redes, nao hierarquias
6. Improve Everything — melhoria em todos os niveis

**Ferramentas praticas:**
- Moving Motivators (CHAMPFROGS): ordenar motivadores + avaliar impacto de mudancas
- Delegation Poker (7 niveis): mapear quem decide o que
- Delegation Board: tabela visual area × nivel de delegacao
- Merit Money: reconhecimento peer-to-peer com pontos

**Heuristicas:**
- Organizacoes sao jardins, nao maquinas — cultive, nao projete
- Motivacao extrinseca destroi intrinseca a longo prazo
- Delegar sem contexto/competencia/informacao = abandonar
- Gestao e responsabilidade demais pra deixar so com gestores
- Mudanca sem transparencia gera resistencia

### 8.8 Checklists e Sistemas (Gawande)

**Dois tipos de falha:** Ignorancia (nao sabemos) vs Ineptitude (sabemos mas nao fazemos)

**Tres tipos de problema:** Simple (receita) → Complicated (expertise) → Complex (emergente)

**Dois tipos de checklist:**
- DO-CONFIRM: profissional experiente executa, depois confirma
- READ-DO: le e executa sequencialmente

**Design de checklist:**
- 5-9 itens maximo
- Completavel em 60-90 segundos
- Focar nos "killer items" (o que expert esquece)
- Definir pause point claro
- Testar em condicao real antes de formalizar

**Dupla funcao:** Verificacao de tarefas + protocolo de comunicacao

**Heuristicas:**
- Maioria das falhas e ineptitude, nao ignorancia
- Checklist libera expertise para o dificil
- Complexidade humilha — ninguem e imune a erro em sistemas complexos
- Positive deviance: busque quem ja resolve dentro do sistema antes de importar solucao
- Meca algo. Dados mudam percepcao.

### 8.9 Product Discovery (Cagan)

**4 Risks:** Value (vao comprar?) → Usability (vao saber usar?) → Feasibility (da pra construir?) → Business Viability (funciona pro negocio?)

**Discovery vs Delivery:**
- Discovery: validar a solucao certa (PM + Designer + Tech Lead)
- Delivery: construir a solucao validada (Engineers)
- Dual-track: rodam em paralelo, discovery 1-3 sprints a frente

**Product Operating Model:**
- Outcome over output
- Empowered cross-functional teams
- Continuous discovery
- Continuous delivery
- Product culture: principios > processo

**Triad:** PM (value + viability) + Designer (usability) + Tech Lead (feasibility)

**Heuristicas:**
- A maioria dos fracassos e de discovery, nao de delivery
- Roadmap e contrato pra construir coisas que podem estar erradas
- O custo de oportunidade do que voce NAO constroi e sempre o maior risco
- Missionaries > mercenaries (empoderamento > controle)
- 12-15 iteracoes de discovery por semana por time

### 8.10 Qualidade Total e Pensamento Sistemico (Deming)

**System of Profound Knowledge (4 pilares):**
1. Appreciation for a System: otimizar o todo, nao as partes
2. Knowledge of Variation: common cause vs special cause
3. Theory of Knowledge: dados sem teoria = ruido
4. Psychology: motivacao intrinseca, drive out fear

**PDSA Cycle:**
- Plan: teoria + predicao + design do experimento
- Do: teste em escala pequena
- Study: comparar resultado com predicao
- Act: adotar, adaptar ou abandonar

**14 Pontos (resumo operacional):**
1. Constancy of purpose
2. Adote a nova filosofia
3. Qualidade no processo, nao inspecao
4. Fornecedores de confianca, nao menor preco
5. Melhore constantemente
6. Treinamento no trabalho
7. Lideranca que ajuda
8. Elimine o medo
9. Quebre barreiras entre departamentos
10. Elimine slogans e exortacoes
11. Elimine quotas numericas
12. Remova barreiras ao orgulho no trabalho
13. Educacao e autodesenvolvimento
14. Todos trabalham na transformacao

**7 Doencas Mortais:**
1. Falta de constancy of purpose
2. Enfase em lucro de curto prazo
3. Avaliacao de performance / merit rating
4. Mobilidade excessiva da alta gestao
5. Gestao so por numeros visiveis
6-7. Custos medicos e legais excessivos (contexto US)

**Heuristicas:**
- 94% da variacao vem do sistema, 6% das pessoas
- Tampering (reagir a cada flutuacao) piora tudo
- "There is no knowledge without theory"
- O que nao pode ser medido pode ser o mais importante
- Cooperacao e a unica base de saude sistemica de longo prazo

---

## 9. ANTI-PADROES — O que Nunca Fazer

| Anti-Padrao | Por que e Perigoso | Quem Condena |
|-------------|-------------------|--------------|
| Otimizar partes sem ver o todo | Piora o sistema global | Goldratt, Deming |
| Culpar pessoas por falhas de sistema | Injusto e improdutivo | Deming, Ohno |
| Reagir a cada flutuacao (tampering) | Aumenta variacao | Deming |
| Metas numericas sem metodo | Gera gaming, nao resultado | Deming |
| Ranking de funcionarios | Destroi cooperacao | Deming, Appelo |
| Multitasking | Aumenta cycle time de tudo | Sutherland, Goldratt |
| Checklists longos (>9 itens) | Ninguem usa em pressao | Gawande |
| Push system (produzir antes de pedir) | Acumula WIP e esconde problemas | Ohno |
| Roadmaps como contratos | Impedem aprendizado | Cagan |
| Velocity como meta de performance | Destroi honestidade de estimativas | Sutherland, Cohn |
| Gestao por reuniao | Fragmenta tempo e impede trabalho real | Drucker, Allen |
| Processo sem dono | Ninguem e responsavel, processo morre | Drucker |
| Ignorar o gemba (decidir de longe) | Decisoes baseadas em ficcao | Ohno |
| Bonus por performance individual | Destroi motivacao intrinseca | Deming, Appelo |
| Planejar em horas | Falsa precisao, bias, pressao | Cohn |

---

## 10. HEURISTICAS MESTRAS — Top 20

As 20 regras de decisao mais poderosas, sintetizadas dos 10 mestres. Formato SE/ENTAO para uso direto:

1. **SE vai otimizar → ENTAO encontre o constraint PRIMEIRO.** Melhorar nao-constraint e desperdicar energia. (Goldratt)
2. **SE etapa nao agrega valor ao cliente → ENTAO e candidata a eliminacao.** Desperdicio e tudo que o cliente nao paga. (Ohno)
3. **SE resultado e ruim → ENTAO mude o sistema, nao culpe as pessoas.** 94% da variacao vem do sistema. (Deming)
4. **SE processo travou → ENTAO pergunte "qual e a next action fisica e visivel?"** Se ninguem sabe, nao ha processo. (Allen)
5. **SE etapa e critica (erro = falha grave) → ENTAO crie checklist de max 9 itens.** Nao mais — ninguem usa sob pressao. (Gawande)
6. **SE medindo resultado → ENTAO meca outcome, nao output.** Features entregues nao sao resultado. Cliente satisfeito e. (Cagan)
7. **SE alocando pessoas → ENTAO construa sobre forcas, nao conserte fraquezas.** Staffing pelo que faz bem. (Drucker)
8. **SE time desmotivado → ENTAO investigue motivacao intrinseca, nao aumente recompensa.** Extrinseca destroi intrinseca a longo prazo. (Appelo + Deming)
9. **SE tarefa leva menos de 2 min → ENTAO faz agora.** Registrar e acompanhar custa mais que fazer. (Allen)
10. **SE precisa estimar capacidade → ENTAO use Yesterday's Weather (media das ultimas 3 sprints).** Nao use wishful thinking. (Sutherland)
11. **SE encontrou problema → ENTAO pergunte "por que?" 5 vezes antes de agir.** A primeira resposta quase nunca e a causa raiz. (Ohno)
12. **SE ha conflito aparentemente impossivel → ENTAO busque a premissa falsa.** Todo conflito tem pelo menos uma. (Goldratt)
13. **SE decidindo baseado em report → ENTAO va ao gemba primeiro.** Dados reportam passado, fatos mostram agora. (Ohno)
14. **SE quer mudar algo → ENTAO PDSA: teste pequeno primeiro, aprenda, so depois escale.** Nao implante mudanca grande de uma vez. (Deming)
15. **SE time ta acelerando → ENTAO deixe folga, nao encha ate 100%.** Times que terminam cedo aceleram mais rapido. (Sutherland)
16. **SE processo existe ha tempo → ENTAO pergunte "se nao estivessemos nisto, entrarîamos?"** Se nao, abandone. (Drucker)
17. **SE delegando → ENTAO garanta contexto + competencia + informacao.** Delegar sem esses 3 e abandonar. (Appelo)
18. **SE story e grande → ENTAO divida ate caber num ciclo.** Story grande e mentira organizada. (Cohn)
19. **SE vai construir → ENTAO valide primeiro.** Discovery antes de delivery. A maioria dos fracassos e de discovery. (Cagan)
20. **SE nao ve problemas → ENTAO nao esta olhando.** Melhoria e infinita. Kaizen nunca para. (Ohno + Deming)

---

## 11. OUTPUT EXAMPLES — Como o GPMaster Responde

### 11.1 Exemplo: Modo Juiz (Diagnostico)

**Input:** "Avalia esse processo: a gente cria conteudo, manda pro cliente aprovar, se ele pede mudanca a gente refaz, manda de novo, e assim ate aprovar. As vezes leva 3 semanas."

**Output:**

```
DIAGNOSTICO — Processo de Aprovacao de Conteudo
================================================

OBJETIVO: Entregar conteudo aprovado pelo cliente
CLIENTE: Cliente externo
FLUXO: Criacao → Envio → Aprovacao/Reprovacao → Retrabalho → Reenvio → ... → Publicacao

CONSTRAINT PRINCIPAL:
Aprovacao do cliente. Cada rodada de revisao adiciona 3-5 dias. O constraint
nao e a criacao — e o loop de aprovacao. Se acelerasse a criacao, nao mudaria
nada. O throughput e limitado pela velocidade de feedback do cliente.

DESPERDICIOS:
1. Defeitos (Ohno) — retrabalho constante indica briefing ruim. O erro nao e
   do retrabalho — e do input.
2. Espera (Ohno) — conteudo parado esperando aprovacao. WIP acumulado.
3. Superprocessamento (Ohno) — refinando alem do necessario antes do primeiro
   envio.

ESTABILIDADE:
Instavel — special cause. Cada cliente tem ritmo diferente, cada tipo de
conteudo tem complexidade diferente.

PONTOS CRITICOS SEM PROTECAO:
Briefing inicial — se o briefing ta errado, TUDO depois e desperdicio.
Nao tem checklist de briefing.

CONTRIBUICAO:
Alta — conteudo aprovado e output direto pro negocio.

SCORE: 4/10
Processo funcional com problemas significativos. O loop de retrabalho e o
sintoma; briefing ruim e a causa raiz.

PRESCRICAO:
1. IMEDIATO: Criar checklist de briefing (DO-CONFIRM, 7 itens) — Gawande.
   Inclui: objetivo, publico, tom, referencias, restricoes, formato, deadline.
2. MEDIO PRAZO: Enviar rascunho rapido (70%) antes de refinar. Feedback cedo
   custa menos que feedback tarde. Reduzir batch size.
3. LONGO PRAZO: Classificar conteudo por complexidade (Simple/Complicated/Complex).
   Protocolo diferente pra cada tipo.

METRICAS:
- Lead time: do briefing a aprovacao final (meta: <7 dias)
- First-time-right: % aprovado na primeira rodada (meta: >60%)
```

### 11.2 Exemplo: Modo Arquiteto (Criacao)

**Input:** "Preciso de um processo pra onboarding de aluno novo na mentoria."

**Output:**

```
PROCESSO: Onboarding de Aluno — Mentoria
=========================================

OBJETIVO: Levar aluno de "acabou de comprar" a "sabe o que fazer na 1a semana"
CLIENTE: Aluno novo
FREQUENCIA: Por demanda (a cada venda)
DONO GERAL: Operacao

FLUXO:
  Venda confirmada → Boas-vindas (auto) → Coleta de dados → Setup acessos →
  Aula orientacao → Check-in 7 dias

ETAPAS DETALHADAS:

1. Boas-vindas automatica
   - Dono: Sistema (automacao)
   - Input: Confirmacao de pagamento
   - Acao: Enviar mensagem com proximo passo
   - Output: Aluno sabe que foi recebido
   - DoD: Mensagem entregue em <1h apos compra
   - Tempo: Automatico

2. Coleta de dados
   - Dono: Operacao
   - Input: Formulario padrao (link na boas-vindas)
   - Acao: Aluno preenche: nicho, estagio, objetivo, urgencia
   - Output: Perfil preenchido
   - DoD: Formulario completo e revisado
   - Tempo: 24h (aluno) + 10min (revisao)

3. Setup de acessos
   - Dono: Operacao
   - Input: Dados do aluno
   - Acao: Liberar area de membros, grupo, calendario
   - Output: Aluno com acessos funcionando
   - DoD: Aluno confirmou acesso
   - Tempo: 30min

4. Aula de orientacao
   - Dono: Mentor
   - Input: Perfil do aluno
   - Acao: Apresentar metodo, trilha, regras, canais
   - Output: Aluno sabe o que fazer na 1a semana
   - DoD: Aluno descreve seus proximos 3 passos
   - Tempo: 45min

5. Check-in 7 dias
   - Dono: Operacao
   - Input: 7 dias apos orientacao
   - Acao: Contato proativo — "como ta? travou?"
   - Output: Feedback + destrave se necessario
   - DoD: Aluno respondeu e esta ativo
   - Tempo: 15min

CHECKLIST — Setup de Acessos (DO-CONFIRM):
- [ ] Area de membros liberada
- [ ] Grupo adicionado
- [ ] Calendario compartilhado
- [ ] Material de boas-vindas enviado
- [ ] Aluno confirmou acesso

METRICAS:
1. Lead time: compra → fim da orientacao (meta: <48h)
2. Ativacao 7 dias: % alunos ativos na 1a semana (meta: >85%)
3. NPS onboarding: satisfacao com o processo (meta: >8)

REVISAO:
  Frequencia: Quinzenal (inicio), mensal (estavel)
  Metodo: PDSA
  Primeiro review: {data + 2 semanas}
```

### 11.3 Exemplo: Modo Otimizador (Melhoria)

**Input:** "Meu processo de vendas ta lento. Lead entra, mando proposta, mas demora muito pra fechar."

**Output:**

```
PLANO DE OTIMIZACAO — Processo de Vendas
=========================================

DIAGNOSTICO RESUMIDO:
  Score atual: 5/10
  Constraint: Tempo entre proposta e decisao do lead (follow-up)
  Desperdicios: Espera (lead parado), Superprocessamento (proposta custom demais)
  Instabilidade: Sim — special cause (cada vendedor faz diferente)

ACOES IMEDIATAS (esta semana):
1. Padronizar proposta base (80% dos casos podem usar template)
   — Impacto: elimina superprocessamento — Responsavel: dono comercial
2. Follow-up no dia seguinte ao envio (nao esperar lead voltar)
   — Impacto: elimina espera — Responsavel: vendedor

ACOES DE MEDIO PRAZO (proximo mes):
1. Classificar leads por urgencia ANTES de gerar proposta
   — Impacto: lead quente em 24h, frio vai pra nurturing — Responsavel: ops
2. Checklist de qualificacao (DO-CONFIRM, 6 itens) antes de proposta
   — Impacto: evita proposta pra lead que nao vai fechar — Responsavel: vendedor

METRICAS DE ACOMPANHAMENTO:
- Tempo proposta→fechamento: baseline {atual} → meta {50% do atual}
- Conversao proposta→venda: baseline {atual} → meta {+20%}
- % propostas com template: baseline 0% → meta 80%

CICLO PDSA:
- Primeiro teste: template + follow-up por 2 semanas
- Primeiro review: {data + 2 semanas}
- Frequencia: Semanal ate estabilizar

SCORE ESPERADO APOS OTIMIZACAO: 7/10
```

---

*GPMaster Knowledge Base v1.0.0 — 2026-03-03*
*10 mestres. Uma mente. Zero corporatives.*
