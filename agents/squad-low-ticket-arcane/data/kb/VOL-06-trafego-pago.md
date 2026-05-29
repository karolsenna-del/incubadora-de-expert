# Volume 06 — Tráfego Pago

> **Âncora:** Etapa 10 (Tráfego Pago, 85KB) — Imersão Presencial Mapa do Império
> **Enriquecimento:** Mod 01 (Escala Máxima — pré-requisitos, testadoras, análise), Mod 03/04-Tráfego (Suscênia, 35 sessões — gestão ao vivo), Mod 07 (Q&A turmas 1-8 + CBO Natalina workshop)
> **Autor principal:** Ricardo Maxxima | **Operação:** Suscênia (gestora de tráfego)
> **Tópicos:** Filosofia, configuração base (BM, pixel, API Conversões), ABO Testadora 1-1-1, Regra 45%, Regra 48h/3 dias, 8 estruturas de escala, Fase 3D, Fase da Turbulência, Lenha na Fogueira, Regra 20%, clusterização, contingenciamento, sazonalidade, anti-padrões

---

## Filosofia Fundamental

Tráfego pago é a última etapa do método por uma razão: **ele não salva oferta ruim.** As 10 etapas anteriores precisam estar feitas com excelência. O tráfego só amplifica o que já funciona.

> "Tira da tua cabeça que é o meu tráfego pago, é o jeito que eu faço a campanha que vai vender. Não é." [Fonte: Etapa 10 ILT]

> "Todas as 10 etapas precisam ser feitas com excelência. Porque nenhuma etapa salva o restante sozinho." [Fonte: Etapa 10 ILT]

A única exceção: **a promessa.** Uma promessa forte vende mesmo com tráfego ruim — é a única etapa que compensa deficiência de campanha.

> "Uma promessa foda vende mesmo com tráfego ruim." [Fonte: Etapa 10 ILT]

A essência do tráfego para low ticket é **análise e tração em escala**, não mágica de segmentação.

> "Eu não consigo, com toda a minha maestria em perpétuo, escalar uma oferta bosta. Mas eu consigo analisar com maestria e falar, tá aqui o erro." [Fonte: Etapa 10 ILT]

### Lógica vs Apertar Botão

Maxxima divide o tráfego pago em dois componentes separados:

1. **Lógica** — o que ensina na imersão: regras, estruturas, quando matar, quando escalar
2. **Apertar botão** — a execução operacional dentro do Gerenciador de Anúncios

> "Todo o tráfego pago é dividido de duas coisas. A lógica e o apertar botão. Aqui eu estou mostrando a lógica. E aí você entrega essa lógica para quem aperta os botões, que é o gestor de tráfego." [Fonte: Etapa 10 ILT]

O expert domina a lógica. O gestor aperta os botões. Se não tiver gestor, o expert faz os dois — mas a lógica sempre vem primeiro.

---

## Configuração Base

### Checklist de Pré-Requisitos

Antes de rodar qualquer campanha, 5 ativos precisam estar prontos:

| # | Ativo | Requisito | Observação |
|---|-------|-----------|------------|
| 1 | **Perfil Facebook** | Antigo, limpo (nunca banido), com atividade | Perfil aquecido > perfil novo [Fonte: Mod 01 Aula 02-2] |
| 2 | **Página Comercial** | Página antiga > nova. Score de integridade alto | Limite de 250 anúncios por página [Fonte: Mod 03/04 Sessão 19, 22] |
| 3 | **Instagram** | Vinculado à página e BM | 1 Instagram por BM [Fonte: Mod 03/04 Sessão 02] |
| 4 | **Business Manager (BM)** | 1 BM por produto/operação | Até ~10 contas por BM [Fonte: Mod 01 Aula 05-5] |
| 5 | **Conta de Anúncios** | Fuso América/São Paulo, moeda BRL | Cartão de crédito (definitiva, não troca) [Fonte: Mod 01 Aula 06-6] |

[Fonte: Mod 01 Aulas 01-06]

### Regra de Isolamento: 1 Conta por Oferta

Cada oferta perpétua roda em sua própria conta de anúncios. Cada oferta tem seu próprio pixel. Cada oferta tem seu próprio domínio.

> "Eu faço uma conta de anúncio para cada oferta. Para cada oferta." [Fonte: Etapa 10 ILT]

**Nunca misturar lançamento com perpétuo na mesma BM.** São operações com métricas completamente diferentes. [Fonte: Mod 03/04 Sessão 27]

Pode ter duas contas por oferta quando quer variação de CPM por conta de anúncio. [Fonte: Etapa 10 ILT]

### Workaround do Limite de 250 Anúncios

Cada página do Facebook suporta no máximo 250 anúncios. Quando atingir o limite:
- Criar múltiplas páginas FB
- Vincular todas ao mesmo Instagram via BM
- Distribuir campanhas entre as páginas

[Fonte: Mod 07 Sessão 10; Mod 03/04 Sessão 19, 22]

### Forma de Pagamento

Cartão de crédito, sempre. Meta prefere cartão. PIX pode pausar campanha se saldo acabar. **Dica:** Conta Simples converte cash em cartão de crédito para anúncios. [Fonte: Mod 03/04 Sessão 25; Mod 07 Sessão 20]

---

## Pixel e API de Conversões

### O que é o Pixel

O pixel é uma câmera de vigilância digital com duas funções:

1. **Contabilizar/rastrear:** (a) quem viu o anúncio, (b) quem entrou na página, (c) quem foi pro checkout, (d) quem comprou
2. **Inteligência:** lê o perfil de quem compra e busca perfis similares na plataforma

[Fonte: Mod 01 Aula 07]

### Pixel Virgem vs Pixel Aquecido

Pixel novo é lento para contabilizar — normal nas primeiras campanhas. Ele precisa acumular dados para ficar inteligente.

- **Pixel virgem:** sem dados, lento, impreciso. Esperar ~100 eventos de conversão antes de analisar resultados [Fonte: Mod 07 Sessão 11]
- **Pixel aquecido:** com alto volume de vendas e dados. Busca compradores com precisão. Com pixel aquecido + oferta validada + caixa, pode decidir em 24h ao invés de 48h [Fonte: Mod 01 Aula Públicos-03]

[Fonte: Mod 03/04 Sessão 08, 09, 11, 12]

### Instalação do Pixel

- Plugin: **Pixel Your Site** (WordPress)
- Configuração: número do pixel + token de acesso
- Token do pixel vai na **Hotmart**; código base vai na **página**
- Verificação: **Pixel Helper** (extensão Chrome) — se bugar, usar guia anônima

[Fonte: Mod 01 Aula 08; Mod 03/04 Sessão 10, 34]

### API de Conversões

Configurar junto com pixel para dados mais precisos. Setup manual: token gerado e colocado no Hotmart. Obrigatória para traqueamento correto. [Fonte: Mod 03/04 Sessão 06, 10, 14, 18, 21]

### Evento de Conversão

Usar **"compras no site"** padrão. NUNCA criar evento personalizado. A diferença entre "ver conteúdo" e "comprar" impacta diretamente o tipo de pessoa que a Meta busca — se otimizar para "ver conteúdo", a Meta vai buscar curiosos, não compradores. [Fonte: Mod 03/04 Sessão 06, 14, 16, 29]

**Impossível trocar evento em campanha ativa** — precisa criar campanha nova. [Fonte: Mod 03/04 Sessão 29]

### Correspondência Avançada

Ativar correspondência manual e automática para melhorar tracking. [Fonte: Mod 03/04 Sessão 20, 21, 22, 34]

### Configuração Hotmart — "Apenas Pagamentos Imediatos"

Configurar para o pixel NÃO contabilizar PIX gerado e não pago. Sem essa configuração, o gerenciador mostra vendas falsas (pessoa gerou PIX mas não pagou).

- Recalcular ROI real: dividir custo total pelo número real de vendas (pagas)
- Tirar boleto da Hotmart — só PIX (menos métrica falsa)

[Fonte: Mod 03/04 Sessão 10, 12; Mod 07 Sessão 11]

---

## Hierarquia de Campanha

Toda campanha no Meta Ads segue a mesma hierarquia:

```
CAMPANHA (define objetivo + tipo de orçamento)
└── CONJUNTO (define público + posicionamento + orçamento se ABO)
    └── CRIATIVO (o anúncio em si — imagem/vídeo + link)
```

### ABO vs CBO

| Tipo | Orçamento definido em | Controle | Quando usar |
|------|----------------------|----------|-------------|
| **ABO** | CONJUNTO (cada conjunto tem seu orçamento) | Granular — você controla quanto cada público/criativo gasta | Teste de criativos, teste de públicos, escala horizontal (ABO Raiz, ABO Campeões) |
| **CBO** | CAMPANHA (Meta distribui entre conjuntos) | Menos controle — Meta decide quanto cada conjunto gasta | Escala agressiva (CBO 500, CBO 1K, CBO Natalina) |

[Fonte: Etapa 10 ILT]

---

## A Regra dos 45% (Regra de Orçamento)

Orçamento diário por conjunto em qualquer estrutura ABO = **45% do preço do produto.**

| Produto | Cálculo | Orçamento/dia |
|---------|---------|---------------|
| R$47 | R$47 x 0,45 | ~R$21 |
| R$67 | R$67 x 0,45 | ~R$30 |
| R$87 | R$87 x 0,45 | ~R$39 |
| R$97 | R$97 x 0,45 | ~R$44 |

Essa regra se aplica a **todas** as estruturas ABO: testadora de criativos, testadora de públicos, ABO Raiz, ABO Campeões. [Fonte: Etapa 10 ILT; Mod 03/04 Sessão 02, 07, 08, 29, 34]

Exceções:
- **ABO Garimpo:** R$10 por conjunto (garimpa clusters baratos)
- **ABO Campeões Advantage:** 100% do valor do produto (não 45%)
- **Estruturas CBO:** orçamento fixo na campanha (R$500, R$1.000+)

---

## ABO Testadora de Criativos (Estrutura 1-1-1)

### O que é

A primeira campanha que todo perpétuo roda. Objetivo: encontrar **criativos campeões** — aqueles que vendem com ROI acima de 2.5.

> "É a minha melhor estrutura de teste de criativos. Eu já testei CBO 145, eu já fiz tudo quanto é teste de estrutura de campanha de criativo para perpétuo em CBO." [Fonte: Etapa 10 ILT]

### Estrutura

- 1 Campanha → 1 Conjunto → 1 Criativo (isolado)
- Cada criativo novo = **novo conjunto** separado na MESMA campanha
- Pode ter 10, 20, N criativos — cada um em seu conjunto isolado
- Campanha cresce infinitamente: pode ter 400+ conjuntos ao longo do tempo

### Configuração Completa

| Campo | Valor |
|-------|-------|
| **Objetivo** | Vendas |
| **Tipo campanha** | Configuração manual (NÃO Advantage Campaign) |
| **Orçamento** | ABO — 45% do valor por conjunto |
| **Público** | Advantage (aberto). 95% das vezes sem segmentação |
| **Idade** | Da persona |
| **Gênero** | Da persona |
| **Posicionamento** | Advantage (automático) |
| **Criativo** | Imagem ou vídeo, formato PRSA |
| **Textos/Título/Descrição** | NUNCA coloca |
| **Link** | Página de venda |
| **Data limite** | Sem data — desativa manualmente |
| **Horário de ativação** | 00:00:03 (meia-noite e 3 segundos/minutos) |
| **Nomenclatura** | Campanha: "ABO Testadora de Criativos"; Conjunto: "[Produto] Eds01", "Eds02"... |
| **"Anúncios com vários anunciantes"** | Desmarcar |

[Fonte: Etapa 10 ILT; Mod 01 Aulas 01-03; Mod 03/04 Sessão 02]

> "Nunca coloquei [texto/título]. De preguiça. Nunca coloquei." [Fonte: Etapa 10 ILT]

> "Se não for meia-noite e 3 minutos, você não tem ROI." [Fonte: Mod 01 Aula 02-Passo2]

### Duplicação

NUNCA duplicar a campanha — apenas o **conjunto de anúncio** dentro da campanha existente. Nomenclatura sequencial: Eds01, Eds02, Eds03... [Fonte: Mod 01 Aula 03-Passo2.2]

### Regra 48h (Tempo de Espera)

Esperar **2 dias completos** rodando antes de analisar qualquer resultado. Nunca tomar decisão no dia 1.

> "Se você for colérico ou colérica, dobre o chá de camomila." [Fonte: Etapa 10 ILT]

### Análise (Dia 3+)

Usar o **Funil 3X** (ver Volume 02) para diagnosticar:
- CVP (custo da visualização de página): criativo bom ou ruim?
- Finalização: página converte ou não?
- CPA (custo por compra): oferta funciona ou não?

### Criativo Campeão — Definição

Criativo com **5-10 vendas**, ROI **>= 2.5** (idealmente >= 3.0), métricas dentro do **Funil 3X**.

> "Criativo validado para nós é criativos que vendem acima de 2,5%. Acima de 3. Porque um criativo de 2 ele vende, mas ele não escala." [Fonte: Etapa 10 ILT]

Por que 2.5 e não 2.0? Porque todo criativo **perde ROI ao escalar** (tipicamente 0.5 de queda). Criativo com ROI 2.0 na escala vira 1.5 — dá merda.

> "Todo criativo que é escalado vai perder ROI. E se eu não tenho margem, dá merda." [Fonte: Etapa 10 ILT]

**Meta:** Encontrar 5 a 15 criativos campeões. Produzir **5-10 criativos novos por semana** por oferta (mínimo). [Fonte: Mod 07 Sessão 09]

### Anti-Padrão: Escalar Dentro da Testadora

Erro mais recorrente entre alunos: vender na testadora e nunca ir para escala, ou aumentar verba dentro da testadora.

> Exemplo: aluna com 1.500 vendas na testadora e nunca foi para campanha de escala — Suscênia repreendeu. [Fonte: Mod 03/04 Sessão 03]

A testadora é TESTE. Escala é campanha SEPARADA. [Fonte: Mod 03/04 Sessão 11]

---

## ABO Testadora de Públicos (Estrutura 1-1-1)

### Quando Usar

Teste de público é **secundário**. Só testar se:
1. Advantage (aberto) não está dando resultado
2. Momento de escala agressiva (R$500-1.000/dia) e quer mais clusters

Se Advantage está dando ROI, **continua em Advantage.** [Fonte: Mod 01 Aula Públicos-01]

### Ordem Obrigatória

**Primeiro** testar criativo, **DEPOIS** testar público. Para achar público, precisa ter criativo campeão como variável fixa.

> "Para eu achar um público de interesse, eu tenho que ter um criativo campeão." [Fonte: Etapa 10 ILT]

### Tipos de Público

#### Público Frio
- **Interesse Óbvio:** relação direta com a persona. Ex: produto para mecânico → público "mecânico"; planilha financeira → público "empresário", "Sebrae"
- **Interesse Não Óbvio:** no ecossistema da persona, sem relação direta. Ex: empresário → "Os Segredos da Mente Milionária" (empresário que quer ser milionário leu esse livro). Bordado → "Roberto Carlos" (senhorinha que borda ouve Roberto Carlos)
- **Cargo:** segmentar por cargo no Facebook (médico, mecânico etc.). Pouca gente faz, Maxxima faz muito

#### Público Quente
- Seguidores do Instagram
- Lookalike
- Compradores

[Fonte: Etapa 10 ILT]

> "Público não óbvio pode te dar um resultado significante no tráfego pago." [Fonte: Etapa 10 ILT]

> Exemplo real: "Senado Federal do Brasil. Eu vendi muito para esse público. Muito. Pessoas que tinham interesse no Senado Federal do Brasil compravam demais o meu curso de Canva." [Fonte: Etapa 10 ILT]

### Configuração

Mesma estrutura 1-1-1 do teste de criativo:
- Cada conjunto = **1 público isolado** (nunca 2 públicos no mesmo conjunto)
- Criativo = **CAMPEÃO** (já validado)
- Orçamento: 45% (ABO)
- Primeiro testar óbvios, depois não-óbvios [Fonte: Mod 01 Aula Públicos-02]

### Validação

- Esperar **2 dias** (antes era 24h, hoje 2 dias)
- Público validado: **5-10 vendas** com ROI **>= 2.0**
- Se deu 1 venda só: NÃO é validado. "Ele deu um. É fake neles." [Fonte: Etapa 10 ILT]
- **Meta:** 5 públicos de interesse campeão com ROI positivo
- NÃO usar público "compradores envolvidos" em campanha de teste [Fonte: Mod 03/04 Sessão 21]

> "Tem gente que cria amor com o público de interesse. Tipo, nossa, mas eu estou anunciando para esse público, como é que não vende? Não vende, criatura, vai para o outro." [Fonte: Etapa 10 ILT]

---

## Audiência e Advantage

### Advantage (Público Aberto)

Advantage é o padrão para teste de criativo. É um público por si só — não precisa de interesse fechado. [Fonte: Mod 07 Sessão 09]

**Regra:** Se validou em Advantage, escala em Advantage. [Fonte: Mod 07 Sessão 09]

**Segmentar na comunicação (criativo), NÃO no público do Meta.** O criativo é quem filtra a pessoa certa — não o targeting. [Fonte: Mod 03/04 Sessão 06]

### Bolha do Instagram

Advantage entrega primeiro para seguidores do Instagram vinculado, depois fura a bolha para público frio real. Instagram com poucos seguidores = Advantage joga para conhecidos primeiro (falso positivo). [Fonte: Mod 03/04 Sessão 05, 12; Mod 07 Sessão 56]

### Falsa Validação

Campanhas Advantage podem entregar para seguidores/engajados primeiro — parece validar mas não é público frio real. **Demanda reprimida:** público do expert que já queria comprar; compra rápido no início mas não escala. [Fonte: Mod 03/04 Sessão 35]

**Falso Funil 3X:** CVP baixo pode ser amigos clicando por curiosidade. [Fonte: Mod 07 Sessão 56]

---

## Fase 3D — Os 3 Primeiros Dias de Uma Oferta Nova

### Definição

> "Fase dos 3 dias de teste para receber os primeiros números da oferta no tráfego pago e fazer as primeiras análises." [Fonte: Etapa 10 ILT]

### Receita Dia a Dia

**Dia 1:**
- Começar tráfego à **meia-noite e 3 segundos** (00:00:03) — sempre meia-noite para janela completa de 24h
- Gravar 10 criativos diferentes com PRSA (mínimo 5)
- Começar vendendo por R$67
- Criar ABO testadora com 10 conjuntos, 1 criativo por conjunto
- Investimento: ~R$300/dia (10 x R$30) ou R$150/dia (5 x R$30 se budget menor)

> "Porque existe profundamente um querer, um acreditar dentro de mim, do meu coração, que se eu coloco 0,3 ali vai dar ROI 3 na parada." [Fonte: Etapa 10 ILT]

**Dia 2:**
- "Fazer um chá de camomila para se acalmar."
- **NÃO FAZER NADA.** Não desligar nenhuma campanha. Deixar rodar.

**Dia 3:**
- "Se você for colérico ou colérica, dobre o chá de camomila."
- **NÃO FAZER NADA.** Deixar rodar.
- Na Fase 3D a regra é 3 dias (não 2 como no teste normal)

**Dia 4 (Análise):**
- Acordar de manhã cedo
- Usar ferramenta do Funil 3X
- Analisar resultados dos 3 dias
- Se **NÃO** gerou vendas: parar tudo e analisar via Funil 3X (onde o funil quebra?)
- Se **gerou** vendas: identificar campeões, começar estruturas de escala

**Investimento total da Fase 3D:** ~R$900 (10 criativos x R$30/dia x 3 dias). [Fonte: Etapa 10 ILT]

---

## 3 Fases do Tráfego Pago

Maxxima define 3 fases claras na evolução do tráfego de qualquer oferta:

| Fase | Nome | Objetivo | O que fazer |
|------|------|----------|-------------|
| **Fase 1** | Teste | Validar oferta + criativo | Pode não dar dinheiro. Mais importante = VALIDAR |
| **Fase 2** | Otimização | Testar ESTRUTURAS de escala | ABO Raiz, CBO 500, CBO Natalina, Mix de Criativo, Advantage. Cada oferta tem afinidade diferente |
| **Fase 3** | Escala | Escalar a estrutura que funcionou | Duplicar, duplicar, duplicar |
| **Fase Vermelha** | Nenhuma funciona | Voltar para Fase 1 | Criativos fracos — testar novos |

> "Cada oferta tem afinidade com estruturas de escala diferentes." [Fonte: Mod 07 Sessão 13]

O **cardápio de estruturas** para Fase 2: ABO Raiz, ABO Campeões, CBO 500, CBO 1K, CBO Natalina, Mix de Criativo, Gramado. Testar uma de cada vez, nunca todas ao mesmo tempo. [Fonte: Mod 07 Sessão 13]

---

## Escala Horizontal vs Vertical

### Definições

- **Escala Vertical:** colocar MAIS dinheiro no MESMO conjunto. "No Pedro, você é muito bom. Pega mais mil reais e vende mais para mim."
- **Escala Horizontal:** DUPLICAR o que está funcionando. "Vamos duplicar o Pedro."

### Regra Absoluta para Perpétuo Low Ticket

**Sempre escala HORIZONTAL. Nunca vertical.**

> "Tudo que a gente faz no tráfego pago é com escala horizontal no Perpetual Ticket." [Fonte: Etapa 10 ILT]

> "Escala vertical, colocando mais verba em CBO, funciona muito para lançamento. Porque as métricas de lead é muito diferente das métricas do evento compra do Facebook Ads." [Fonte: Etapa 10 ILT]

**Exceções à regra:**
1. **ABO Garimpo:** após garimpar cluster bom com R$10, sobe para orçamento normal de ~R$30
2. **CBO Natalina:** escala na vertical — subir verba 20-30% por vez (estrutura específica para isso)

---

## 8 Estruturas de Escala

### Estrutura 1 — ABO Raiz (Escala Horizontal Controlada)

**A MELHOR ESTRUTURA junto com ABO Campeões.**

#### Configuração
- 1 Campanha → 1 Conjunto → 1 Criativo CAMPEÃO + Público CAMPEÃO
- Orçamento: 45% do valor (ABO)
- Escala: DUPLICAÇÃO do conjunto (escala horizontal)
- **Nunca** aumentar verba

#### Mecânica

Deu bom? Aperta "Duplicar" no Facebook. Duplica com configurações originais. Vai duplicando: 5x, 10x, quantas quiser. Cada ABO duplicada gera um novo cluster.

> "Eu olho pra cada ABOzinha dessa como se ela fosse uma kitnet na minha vida." [Fonte: Etapa 10 ILT]

Cada ABO de ~R$30/dia que funciona = ~R$1.000/mês de lucro (analogia da kitnet).

#### Proporção Real

~80% ou mais da estrutura de tráfego é ABO. CBO é minoria. [Fonte: Etapa 10 ILT]

#### Vida Útil

ABO vive ~1.5-2 meses. Depois, cluster esgota — frequência sobe, custo sobe. [Fonte: Mod 07 Sessão 10]

Tendência de performar **50-60 dias** e depois cair. [Fonte: Mod 03/04 Sessão 26]

#### Escalando ABO Raiz

Pegar o melhor conjunto e duplicar 3x dentro da mesma campanha. Escala conservadora. [Fonte: Mod 03/04 Sessão 26, 31]

#### Formato Batch 2-3 (Suscênia)

Estrutura formal: 1 campanha, 4 conjuntos, 1 mesmo criativo (1-4-1). [Fonte: Mod 03/04 Sessão 24]

#### Kill Rules (ABO Raiz)

1. **Duplicou, não vendeu em 1 dia:** desativa (tudo validado, não precisa esperar 48h)
2. **Vendeu:** deixar rodando até parar. **Nunca mudar nada.**
3. **Parou de vender (7 dias sem venda):** antes de matar, analisar a JANELA COMPLETA

> "Nunca mudar nada. Deixa ela ser feliz." [Fonte: Etapa 10 ILT]

#### Análise de Janela Completa (Conceito Crítico)

Maxxima SEMPRE analisa 3 janelas antes de matar uma ABO:

1. **Dia de ontem** (resultado isolado)
2. **Últimos 7 dias** (tendência)
3. **Desde quando começou** (período máximo — ROI geral)

> "Analisar a ABO desde o dia que ela começou para tomar a decisão de desligar." [Fonte: Etapa 10 ILT]

**Exemplo detalhado:** ABO de R$30/dia criada dia 1/outubro. Dia 26 está 7 dias sem vender (só 1 venda). Últimos 7 dias: estourada. MAS filtro dia 1 até dia 26: ROI positivo no geral, custo por venda abaixo de R$30. Decisão: **SEGURA.** Pode ser turbulência, ela vai voltar. [Fonte: Etapa 10 ILT]

> "O gestor de tráfego ansioso, que não é analítico, ele olha lá, últimos sete dias, não parou de vender. Vamos matar." [Fonte: Etapa 10 ILT]

**Usar o gráfico do Facebook:** filtrar período completo, olhar picos e buracos, identificar se o padrão é de recuperação ou de queda constante.

#### Substituição de Criativo em Cluster Bom

Quando uma ABO parou de vender mas está num **cluster bom** (histórico de vendas):
1. NÃO desliga
2. Coloca criativo NOVO dentro do mesmo conjunto
3. Deixa os 2 criativos rodarem 2 dias juntos
4. Mata o que está ruim, deixa o bom

> "Dificilmente não dá certo. Não me lembro uma vez que não deu certo. Ela volta a vender. Porque era um cluster bom." [Fonte: Etapa 10 ILT]

---

### Estrutura 2 — ABO Campeões (Estrutura 1-1-3)

**A MELHOR ESTRUTURA junto com ABO Raiz. Descoberta recente (~4 semanas antes da imersão).**

#### Configuração
- 1 Campanha → 1 Conjunto → **3 Criativos campeões** (todos com ROI >= 2.5)
- Orçamento: 45% (ABO)

#### Por que funciona melhor que ABO Raiz

3 criativos validados no mesmo conjunto = aguenta mais tempo vendendo. Diminui drasticamente os dias sem venda.

> "É quase impossível uma estrutura dessa passar um dia sem vender." [Fonte: Etapa 10 ILT]

De todas que Maxxima subiu nessa estrutura: **NENHUMA** não vendeu de cara.

#### Resultado Concreto

Oferta que dava R$500/dia de lucro → com ABO Campeões foi para **R$1.700/dia de lucro.** [Fonte: Etapa 10 ILT]

#### Variação: ABO Campeões Advantage (100%)

Mesma estrutura 1-1-3, mas:
- Campanha 100% Advantage (tipo de campanha diferente)
- Orçamento: **100% do valor do produto** (não 45%). Ex: R$67/dia
- Descoberta ainda mais recente (~1 semana antes da imersão)

> "Se eu coloca muita grana, ela se comporta igual uma CBO ruim. E se eu coloco pouca grana, ela se comporta igual uma ABO rainha maravilhosa." [Fonte: Etapa 10 ILT]

Preferir escala horizontal (duplicar) em vez de vertical (aumentar verba).

#### Papel na Escalada

ABO Campeões funciona como **etapa de validação antes de ir para Gramado** — se funciona em 1-1-3, está pronto para testar estruturas mais agressivas. [Fonte: Mod 03/04 Sessão 26]

---

### Estrutura 3 — Gramado

**Estrutura intermediária de escala com múltiplos criativos em Advantage.**

#### Configuração
- Campanha Advantage + **4+ criativos campeões** no mesmo conjunto
- Subir em **pares/trios de campanhas**, NUNCA solo
- Mínimo 3 campanhas ativas (clusterização)
- Mínimo **5 gramados ativos** para ter volume
- Orçamento: 1x o valor do produto por campanha (padrão)

[Fonte: Mod 03/04 Sessão 05, 08, 09, 11, 12, 13, 22]

#### Regra do 5o Dia

Gramado precisa de **pelo menos 5 dias** para avaliar performance. Não matar antes. [Fonte: Mod 03/04 Sessão 13, 27, 29]

#### Gestão Interna

- **NUNCA desligar criativos dentro do Gramado** — deixar a Meta distribuir [Fonte: Mod 03/04 Sessão 17]
- 1 criativo top se sobressai, mas os outros auxiliam na venda do cluster [Fonte: Mod 03/04 Sessão 31]
- Análise "por fora" (nível campanha) vs "por dentro" (nível conjunto/criativo) [Fonte: Mod 03/04 Sessão 27]

#### Escala Máxima (via Gramado)

Quando Gramado está performando bem: aumentar budget de 1x para **2x o valor do produto**. Única estrutura onde escala vertical funciona dentro do método (além de CBO Natalina). [Fonte: Mod 03/04 Sessão 18]

---

### Estrutura 4 — CBO 500 (Estrutura 1-5-1)

#### Configuração
- 1 Campanha → 5 Conjuntos iguais → 1 Criativo por conjunto
- Orçamento: **R$500/dia na CAMPANHA** (CBO)
- Público campeão, posicionamento Advantage, criativo campeão

#### Manutenção

- Deixar ativa **2 dias**
- Se vendeu e deu ROI: **duplicar a campanha INTEIRA** (não aumentar verba)
- Se não deu ROI em 2 dias: **DESLIGA INTEIRA**

> "Eu nunca faço manutenção em CBO. Nunca. Nunca, nunca, nunca." [Fonte: Etapa 10 ILT]

> "CBO não deu bom? Tchum. Mal. Tchau. Acabou." [Fonte: Etapa 10 ILT]

Não fica desligando conjuntos individuais, não ajusta nada. CBO é binária: funciona ou não.

#### Resultado Típico

95 vendas a R$34 (produto R$67), ROI 1.8-1.9. Quando cai pra 1.4: mata. [Fonte: Etapa 10 ILT]

---

### Estrutura 5 — CBO 1K (Estrutura 1-10-5)

#### Configuração
- 1 Campanha → 10 Conjuntos → **5 Criativos campeões** em cada
- Orçamento: **R$1.000/dia na CAMPANHA** (CBO)

#### Pré-Requisito RÍGIDO

**5 criativos campeões com ROI acima de 2.5.** Sem isso, não sobe CBO 1K.

> "Se eu não tiver com esses cinco criativos foda, eu não mexo nela." [Fonte: Etapa 10 ILT]

#### Manutenção

- Rodar 2 dias, depois analisar
- Se deu bom: duplicar para escalar (nunca aumentar verba)
- Se ROI negativo em 2 dias: desliga inteira. Não otimiza.

#### Resultado

> "Essa CBO1K já me deu muita grana." Exemplo: 988 vendas, ROI 1.9. [Fonte: Etapa 10 ILT]

---

### Estrutura 6 — CBO Natalina (CBO R$1.000+)

**Estrutura criada no Natal/2024. Usa conceito de criativos DARK.**

#### O que é Criativo Dark

Subir o criativo pelo **código dele (ID do post)**, não duplicando. Gera **força de criativo nova** — a Meta trata como um anúncio fresh. [Fonte: Mod 07 Sessão 09]

#### Estrutura Técnica

```
CAMPANHA (CBO — R$1.000+/dia)
├── Conjunto 1 (público aberto: idade + gênero)
│   ├── Criativo A (dark)
│   ├── Criativo B (dark)
│   └── Criativo C (dark)
├── Conjunto 2 (público aberto: idade + gênero)
│   ├── Criativo D (dark)
│   ├── Criativo E (dark)
│   └── Criativo F (dark)
└── Conjunto 3 (público aberto: idade + gênero)
    ├── Criativo G (dark)
    ├── Criativo H (dark)
    └── Criativo I (dark)
```

[Fonte: CBO Natalina Workshop; Mod 07 Sessão 09, 10]

#### 10 Regras Operacionais da CBO Natalina

1. Orçamento na **CAMPANHA** (CBO), não no conjunto
2. Mínimo **3 conjuntos** por campanha
3. Mínimo **3 criativos** por conjunto
4. Público **ABERTO** (sem interesses/lookalike)
5. Otimizar para **COMPRA** (purchase)
6. **NÃO mexer** em campanha que vende
7. **NÃO editar/pausar** conjunto ativo
8. Escalar na **vertical** — subir verba 20-30% por vez
9. Testar **3-5 dias** antes de matar
10. Para novos criativos: **duplicar campanha inteira**, não adicionar em campanha existente

[Fonte: CBO Natalina Workshop]

#### Resultado Case

Produto biografia Instagram: de ROI 1.3 no dia 1 para **ROI 5** em ~7 dias, com escala para ~R$1.000/dia de lucro. [Fonte: CBO Natalina]

ROI de 4.16 em produto de R$67: R$958 gastos, R$4.000 retorno. Subiu de R$1.000 para R$2.000 por campanha e aguentou. [Fonte: Mod 07 Sessão 09, 10]

#### Diferença da CBO Natalina

A CBO Natalina é a **única estrutura CBO que escala na vertical** (subir verba). Todas as outras escalas são horizontais (duplicar). Requer criativos **exclusivos nunca usados antes** (dark). [Fonte: Mod 07 Sessão 09]

---

### Estrutura 7 — Mix de Criativo (Advantage)

- Campanha Advantage, **top 3 criativos**, valor = **100% do valor do produto** (não 40-45%)
- Sem conjunto — campanha distribui entre criativos
- Na prática: mesma coisa que ABO Campeões, mas em formato Advantage

[Fonte: Mod 07 Sessão 10]

---

### Estrutura 8 — ABO Garimpo (Estrutura 1-N-1, R$10)

**Técnica para encontrar clusters bons gastando pouco.**

#### Conceito

Em vez de duplicar ABOs de R$30 cada (10 duplicatas = R$300/dia para achar cluster bom), usa **R$10/conjunto** para garimpar ruas boas com investimento mínimo.

> "O ABO garimpo nada mais é do que você fazer isso aqui: uma campanha, 10 conjuntos e um criativo." [Fonte: Etapa 10 ILT]

#### Configuração

- 1 Campanha → 10 a 50 Conjuntos → 1 Criativo campeão
- **Orçamento: R$10 por conjunto** (NÃO os 45%)
- Público campeão, criativo campeão

#### Mecânica

1. Sobe campanha com 10, 15, ou até 50 conjuntos a R$10 cada
2. Deixa rodar **24 horas** (1 dia, não 2)
3. Após 24h: desativa os que NÃO venderam, deixa os que venderam
4. Os que venderam com R$10 = **cluster bom**
5. Aumenta orçamento das vencedoras para o valor normal (~R$30) — escala vertical para chegar no valor correto
6. Se NENHUMA vendeu: desliga tudo

[Fonte: Etapa 10 ILT]

---

## Ranking de Estruturas (Declaração Explícita)

> "De tudo isso que eu falei para vocês até aqui, de todas as campanhas, a melhor é a ABO Raiz e a ABO Campeão." [Fonte: Etapa 10 ILT]

> "São as melhores. Não adianta. São as que mais funciona para mim. Escala controlada de tráfego pago." [Fonte: Etapa 10 ILT]

---

## Carioca e Miami

Estruturas de escala alternativas mencionadas mas com pouco detalhamento:

- **Carioca:** testada por aluna Nadia — ROI 0.96, não performou. [Fonte: Mod 03/04 Sessão 19, 20, 23]
- **Miami:** tipo de escala dentro da metodologia, sem detalhes técnicos nas sessões de tráfego. [Fonte: Mod 03/04 Sessão 33]

---

## Clusterização (Conceito Completo)

### Definição

Fragmentação interna do público de interesse pelo Facebook em micro-setores (clusters). Analogia: público de interesse = um **bairro** (Alphaville). Cada cluster = uma **rua** do bairro. Cada ABO duplicada cai numa rua diferente. [Fonte: Etapa 10 ILT]

> "Então, ele vai pegando cada ABO e colocando, essa aqui é essa rua. Aí quando você duplica, você vai para essa rua." [Fonte: Etapa 10 ILT]

### Origem do Termo

Maxxima foi professor de montagem e manutenção de computadores. Clusters de HD (micro partições de fragmentação) = mesma lógica no Facebook. [Fonte: Etapa 10 ILT]

### Implicações Práticas

- Duplicar 5 ABOs iguais: **2-3 vão vender, 2-3 vão falhar.** Normal. Não é erro de configuração. [Fonte: Etapa 10 ILT; Mod 03/04 Sessão 28]
- Cada conjunto testa um cluster diferente [Fonte: Mod 03/04 Sessão 26]
- Cluster esgota com o tempo (frequência sobe, custo sobe). Vida útil: ~1.5-2 meses [Fonte: Mod 07 Sessão 10]
- Quando encontra cluster bom, **não desliga** mesmo se criativo cansou — troca o criativo
- ABO Garimpo é a técnica para achar clusters bons com baixo investimento (R$10)

> "Como é que eu sei onde tem um cluster bom e um cluster ruim? Só duplicando o conjunto e encontrando." [Fonte: Etapa 10 ILT]

---

## Fase da Turbulência

Período de queda temporária de performance — 3-5 dias de resultado ruim sem causa aparente. **É normal. Não reagir sob pressão.**

> "Nenhum avião cai por turbulência; o piloto que desliga é que causa a queda." [Fonte: Mod 07]

### O que fazer durante turbulência

1. **NÃO desligar campanhas** que estavam vendendo
2. **NÃO testar criativos novos** — esperar normalizar primeiro
3. **NÃO alterar orçamento** — qualquer alteração reseta aprendizado da Meta
4. **Esperar 3-5 dias** analisando janela completa
5. Se a turbulência é pós-duplicação ou pós-escala: é **NORMAL e temporária**

[Fonte: Mod 03/04 Sessão 07, 08, 09; Mod 07 Sessão 67]

Turbulência sazonal (Natal, Ano Novo, Black Friday) não é turbulência real — é sazonalidade. Não confundir. [Fonte: Mod 07 Sessão 09]

---

## Lenha na Fogueira

Conceito: **retroalimentar campanha que está em queda com criativos novos validados.**

- Só em campanhas que **já tiveram ROI positivo** (comprovado na janela completa)
- Pegar criativo novo validado na testadora e colocar na campanha de escala
- Não é "salvar campanha morta" — é renovar combustível em campanha viva que esfriou

[Fonte: Mod 07 Sessão 40, 42]

---

## Regra dos 20% (Gestão de Verba)

### Significado 1: Kill Rule

Criativo com custo **20%+ acima do alvo** do Funil 3X — considerar desligar. [Fonte: Mod 03/04 Sessão 01]

### Significado 2: Fator de Proteção na Escala

Verba diária total x 20% = valor máximo para subir por dia. Não é obrigatório, é fator de proteção.
- Escalar verba em incrementos de 20-30% por vez
- Subir verba manualmente às **23h-23h30** (nunca cedo)
- Se fatura R$1.000/dia: máximo R$200 a mais por dia

[Fonte: Mod 07 Sessão 10]

---

## Kill Rules — Tabela Consolidada

| Estrutura | Tempo mínimo | Critério de Kill | Observação |
|-----------|-------------|-----------------|------------|
| **ABO Testadora** (Criativo/Público) | 2 dias (3 na Fase 3D) | Funil 3X estourado | Matar no 3o dia criativos fora do funil [Fonte: Mod 03/04 Sessão 29] |
| **ABO Raiz** (Duplicada) | 1 dia | Não vendeu = desativa | Se vendendo e parou 7 dias: janela completa antes de matar |
| **ABO Raiz** (Período máximo) | Analisar gráfico | ROI geral em queda (1.8→1.7→1.6) | Se positivo com margem = SEGURAR |
| **CBO 500/1K** | 2 dias | ROI negativo = desliga INTEIRA | Nunca otimiza, nunca mexe em conjuntos |
| **CBO Natalina** | 3-5 dias | ROI negativo = desliga INTEIRA | Duplicar campanha para novos criativos |
| **Gramado** | 5 dias | Análise "por fora" e "por dentro" | NUNCA desligar criativos individuais |
| **ABO Garimpo** | 24h | Conjunto não vendeu = desativa | Nenhuma vendeu = desliga tudo |

[Fonte: Etapa 10 ILT; Mod 03/04; Mod 07; CBO Natalina]

### Regras Gerais Anti-Kill Prematuro

- **Não alterar valor de campanha** — derruba performance. Duplicar com novo valor [Fonte: Mod 03/04 Sessão 24]
- **Não mexer em campanha que roda** — qualquer alteração reseta aprendizado da Meta [Fonte: Mod 03/04 Sessão 24, 31]
- **Fadiga de criativos (aviso do Meta):** IGNORAR. Continuar enquanto vender [Fonte: Mod 03/04 Sessão 08]
- **"Limite de Aprendizagem" do Facebook:** IGNORAR

> "Limite de aprendizagem é bobagem. Bobagem, bobagem, bobagem. Parece o governo falando como você tem que educar teus filhos e nunca educaram um filho." [Fonte: Etapa 10 ILT]

> "Eu tenho uma análise de tráfego pago como investidor." [Fonte: Etapa 10 ILT]

---

## Gestão Diária

### O que Analisar Todo Dia

3 janelas, sempre:
1. **Dia de ontem** (resultado isolado)
2. **Últimos 7 dias** (tendência)
3. **Desde quando começou** (ROI geral)

Usar o **gráfico do Facebook** para ver padrão visual de vendas ao longo do tempo. [Fonte: Etapa 10 ILT]

### Feeling de Gestão

Não reagir sob ansiedade. Avaliar **blocos de 2-3 dias**, nunca 1 dia isolado. [Fonte: Mod 03/04 Sessão 09, 11, 12]

Suscênia opera como "quase um trader": 3 telas, monitoramento constante. [Fonte: Mod 03/04 Sessão 29]

### Coluna "Data de Criação"

Ativar no gerenciador para rastrear quando conjuntos foram criados — essencial para análise de janela completa. [Fonte: Mod 07 Sessão 13]

### Cartilha do Maxxima

21 criativos de uma vez, 7-8 bons, descartar o resto. [Fonte: Mod 03/04 Sessão 29]

### Hora de Início

Sempre **meia-noite** (00:00:03). Janela completa de 24h.

> "Se não for meia-noite e 3 minutos, você não tem ROI." [Fonte: Mod 01 Aula 02-Passo2]

### Frequência

Indicativo de fadiga. Frequência 4 em 65k alcançados = campanha repetindo para mesmas pessoas. Cluster esgotando. [Fonte: Mod 03/04 Sessão 35]

---

## Contingenciamento

### Posição do Maxxima

Maxxima NÃO faz contingenciamento (múltiplas BMs, contas reserva). Razão: trabalha com **oferta white** — oferta honesta, sem mentiras.

> "Quem faz oferta white não precisa de contingenciamento." [Fonte: Mod 07 Sessão 01]

### Na Prática (Se Precisar)

- BM backup com ativos compartilhados (pixel, públicos)
- Compartilhar ativos entre BMs: pixel, públicos
- Não misturar contas de lançamento com low ticket na mesma BM

[Fonte: Mod 03/04 Sessão 03, 04, 27]

### Gerenciador Novo (Aquecimento)

Conta nova tende a não gastar por ser "verde". Soluções em ordem:
1. Duplicar conjuntos dentro da mesma campanha
2. Duplicar campanha inteira e reativar 00h03
3. Criar campanha de reconhecimento/alcance para aquecer

[Fonte: Mod 03/04 Sessão 01, 19, 21, 25, 32]

### CPM Altíssimo como Sinal

CPM muito alta = problema de criativo OU de conta/pixel. Solução: criar **NOVA conta de anúncio + pixel novo** e testar. Conta fresca pode ter CPMs melhores. [Fonte: Mod 07 Sessão 50, 67]

### Tropino

Compartilhar pixel entre contas de anúncio para a mesma oferta — transfere inteligência acumulada. [Fonte: Mod 07 Sessão 20]

---

## Sazonalidade

| Período | Comportamento | Impacto |
|---------|---------------|---------|
| **Janeiro-Março** | MELHOR período. "Ano novo, vida nova" | CPM baixo, conversão alta |
| **Fevereiro** | Um dos melhores meses (opinião Suscênia) | Excelente para testar ofertas novas |
| **Abril-Setembro** | Período normal | Operação padrão |
| **Outubro-Dezembro** | PIOR período. Black Friday distorce métricas | CPM sobe significativamente |
| **Novembro** | Pior mês do low ticket | Mais caro testar criativos |

[Fonte: Mod 03/04 Sessão 21, 23, 25, 26, 28, 30]

**Sazonalidade de persona:** confeiteira trabalha até 24/dez (boa época); outros nichos desaceleram. Considerar o calendário do PÚBLICO, não o geral. [Fonte: Mod 03/04 Sessão 25]

---

## Plataformas de Venda (Impacto no Tráfego)

| Plataforma | Taxa | Quando usar | Observação |
|------------|------|-------------|------------|
| **Hotmart** | ~10-15% | Início, até R$1.000/dia | Melhor checkout, conversão, configuração |
| **PagarMe + IAMP** | <1% | Acima de R$1.000/dia | Migrar quando faturamento justifica |
| **Green (MemberKit)** | ~5% | Alternativa intermediária | — |
| **Kiwify** | Variável | NÃO recomendada | Migrar para Hotmart |

[Fonte: Mod 07 Sessão 09; Mod 03/04 Sessão 15; Mod 07 Sessão 49]

> "Sair da Hotmart quando fatura >R$1.000/dia. Migrar para PagarMe + IAMP (taxas 15% vs <1%)." [Fonte: Mod 07 Sessão 09]

---

## Efeito Colateral: Tráfego Derrama no Instagram

Vendas de produto mais caro via bio do Instagram são efeito colateral normal do tráfego pago. Pessoas veem o anúncio, visitam o perfil, compram pelo link na bio. Não é ROI direto da campanha, mas é receita gerada por ela. [Fonte: Mod 07 Sessão 17, 18]

**Atenção:** Instagram com 1 post só causa problema. Exemplo: Nicolas — 13 de 27 visitaram perfil e não compraram por falta de credibilidade. [Fonte: Mod 03/04 Sessão 35]

---

## Problemas Técnicos Comuns

| Problema | Causa Provável | Solução |
|----------|---------------|---------|
| Pixel não marca compras | Hotmart + WordPress/Hostinger | Reinstalar Pixel Your Site, verificar API Conversões [Fonte: Mod 03/04 Sessão 10, 20, 21] |
| Gerenciador bugado/zerou dados | Bug do próprio Meta | Não afeta entrega — ignorar [Fonte: Mod 07 Sessão 57] |
| Conta não gasta | Conta "verde", sem histórico | Duplicar conjuntos > duplicar campanha > reconhecimento |
| CPM altíssima | Conta/pixel comprometido | Conta nova + pixel novo [Fonte: Mod 07 Sessão 50] |
| Connect Rate <80% | Página lenta (6-11s carregamento) | Trocar hospedagem para Rocha/Rochost [Fonte: Mod 07 Sessão 19, 57] |
| Discrepância UTMify vs gerenciador | Normal | Usar gerenciador como fonte primária [Fonte: Mod 03/04 Sessão 03] |
| Pixel Helper bugado | Extensão com cache | Usar guia anônima [Fonte: Mod 03/04 Sessão 10] |
| Conta bloqueada | Violação de propriedade intelectual | Não usar marcas (ChatGPT etc.) no criativo [Fonte: Mod 03/04 Sessão 32] |

---

## Anti-Padrões (O que NUNCA Fazer)

1. **Acreditar que tráfego pago salva oferta ruim.** "Sobral não faz vender uma oferta ruim." [Fonte: Etapa 10 ILT]
2. **Analisar só "vendeu/não vendeu" sem Funil 3X.** "Só que é um câncer quando as pessoas fazem teste de criativo e a única coisa que ela analisa é: não vendeu." [Fonte: Etapa 10 ILT]
3. **Escalar criativo com ROI 2.0.** Na escala perde 0.5, vai pra 1.5. Sem margem. [Fonte: Etapa 10 ILT]
4. **Gestor ansioso que mata cedo demais.** Olha só últimos dias, não olha janela completa. [Fonte: Etapa 10 ILT]
5. **Criar amor com público de interesse.** Não vendeu, vai pro próximo. [Fonte: Etapa 10 ILT]
6. **Validar público com 1 venda.** Precisa de 5-10 vendas com ROI para validar. [Fonte: Etapa 10 ILT]
7. **Fazer manutenção/otimização em CBO.** Nunca, nunca, nunca. [Fonte: Etapa 10 ILT]
8. **Escala vertical em perpétuo.** Sempre horizontal — exceto CBO Natalina e Gramado Escala Máxima. [Fonte: Etapa 10 ILT]
9. **Começar campanha durante o dia.** Sempre meia-noite. [Fonte: Etapa 10 ILT]
10. **Colocar texto/título/descrição no criativo.** Maxxima nunca coloca. [Fonte: Etapa 10 ILT]
11. **Mexer em ABO que está vendendo.** "Nunca mudar nada. Deixa ela ser feliz." [Fonte: Etapa 10 ILT]
12. **Olhar/confiar no "Limite de Aprendizagem" do Facebook.** Bobagem. [Fonte: Etapa 10 ILT]
13. **Subir CBO 1K sem 5 criativos campeões com ROI 2.5+.** Pré-requisito rígido. [Fonte: Etapa 10 ILT]
14. **Escalar dentro da testadora.** Testadora é teste. Escala é campanha separada. [Fonte: Mod 03/04 Sessão 11]
15. **Múltiplos criativos num conjunto na testadora (estrutura errada).** Deve ser 1x1x1. [Fonte: Mod 07 Sessão 44, 46]
16. **Subir todas as escalas ao mesmo tempo.** Testar uma estrutura por vez. [Fonte: Mod 03/04 Sessão 08; Mod 07 Sessão 42]
17. **Usar marca registrada no criativo (ChatGPT etc.).** Pode bloquear conta. [Fonte: Mod 03/04 Sessão 32]
18. **Overanalyze página sem dados de tráfego.** "Página pronta, roda." [Fonte: Mod 07 Sessão 18]
19. **CBO ao invés de ABO na testadora.** Meta distribui verba como quer — perde isolamento. [Fonte: Mod 03/04 Sessão 03]
20. **Usar público "compradores envolvidos" no teste.** Contamina resultado. [Fonte: Mod 03/04 Sessão 21]

---

## Exemplos Concretos com Números

### Teste de Criativo (Etapa 10)
- Criativo 1: 8 visualizações de página a R$3,97. 1 finalização. ROI ruim
- Criativo 2 (mesmo teste): 31 finalizações, 20 finalizações, 7 finalizações, 4 e 3 compras. ROI ~5

### Teste ao Vivo (WhatsApp com Suelen/Gabriel Carvalho)
- Criativo 61: vendas a R$50 (produto R$67). **MATOU**
- Criativo 57: 2 vendas, ressuscitou. **Segurou**
- Criativo 59: 5 vendas a R$20. ROI ~3. **ESCALOU** para 5 conjuntos no dia seguinte

### Teste de Público
- Substituto de açúcar (emagrecimento): ROI 2.5, 69 compras a R$29 (produto R$67). **VALIDADO**
- Comidas naturais e bebidas: venda a R$45, ROI 1.3. **NÃO VALIDADO**
- Veganismo: 7 vendas a R$42, ROI 1.4. **NÃO VALIDADO**

### ABO Raiz Duplicada
- Raiz original: muito bom
- 5 duplicatas: 3 com ROI 2.6, 3.8, 2.0. 2 com ROI 1.8, 1.7
- ROI geral: 2.4

### CBO Natalina (Case Maxxima)
- ROI de 4.16 em produto de R$67: R$958 gastos, R$4.000 retorno
- Subiu de R$1.000 para R$2.000 por campanha e aguentou
- [Fonte: Mod 07 Sessão 09, 10]

### ABO Campeões (Resultado)
- Oferta de R$500/dia lucro → R$1.700/dia lucro com estrutura 1-1-3
- [Fonte: Etapa 10 ILT]

### Análise ao Vivo (Campanha Real — Etapa 10)
- Campanha perpétuo branding, começou 31/ago/2024
- 46 vendas a R$35, ROI geral (período máximo): 1.7
- Gastou R$1.652
- Gráfico: picos de 4 vendas, buracos, depois recovery
- Últimos 7 dias: 7 vendas a R$29, ROI 2.0
- Hoje: R$18 gasto, 0 vendas
- Decisão: **segurar mas vigiar** — se mais 2-3 dias sem venda, mata
- [Fonte: Etapa 10 ILT]

### Mel (Acompanhamento Suscênia — 3 meses)
- 2.000 compradores, ROI caiu de 5x para ~1.30 em novembro (sazonalidade)
- ABO Raiz rodando desde setembro, ROI geral 1.74 com 3 meses
- 30-35 vendas/dia usando ABO Raiz
- [Fonte: Mod 03/04 Sessão 18, 20, 23, 25, 26]

### Alan — "Joelho Sem Dor"
- Vendeu 15 no primeiro dia a R$67 (antes vendia a R$27 com 100+ vendas/dia)
- Custo de finalização R$3 (Suscênia: "nunca vi")
- [Fonte: Mod 03/04 Sessão 09]

### Luciano — "Mestres na Cor Certa"
- Usou termos virais do nicho ("misturinha", "cheio de filtro") nos criativos
- Vendas decolaram com linguagem do público
- [Fonte: Mod 03/04 Sessão 12]

### Aluno com 7 LTs simultâneos
- 7 LTs na própria empresa + 5 em outra
- Faturando ~R$100k/mês lucro
- [Fonte: Mod 03/04 Sessão 13]

---

## Regras Cardinais do Tráfego Pago

1. **Tráfego pago não salva oferta ruim.** As 10 etapas precisam estar excelentes
2. **Escala horizontal, nunca vertical** (exceto CBO Natalina e Gramado Escala Máxima)
3. **Regra dos 45%** para todo orçamento ABO
4. **Regra 48h/3 dias:** nunca decidir antes de 2 dias (3 na Fase 3D)
5. **1 conta de anúncio por oferta, 1 pixel por oferta, 1 domínio por oferta**
6. **Criativo campeão = ROI >= 2.5 com 5-10 vendas.** ROI 2.0 não escala
7. **Nunca otimizar CBO.** Funciona ou mata inteira
8. **Nunca mexer no que vende.** Qualquer alteração reseta aprendizado da Meta
9. **Sempre analisar janela completa** (ontem + 7 dias + período máximo)
10. **Meia-noite e 3.** Toda campanha começa 00:00:03
11. **Ignorar avisos do Facebook** (fadiga, aprendizagem limitada, sugestões)
12. **Segmentar na comunicação (criativo), não no público do Meta**

---

## Frases de Assinatura do Maxxima (Neste Volume)

- "Tira da tua cabeça que é o meu tráfego pago, é o jeito que eu faço a campanha que vai vender"
- "Uma promessa foda vende mesmo com tráfego ruim"
- "Todo o tráfego pago é dividido de duas coisas. A lógica e o apertar botão"
- "Criativo validado para nós é criativos que vendem acima de 2,5%"
- "Todo criativo que é escalado vai perder ROI"
- "Eu olho pra cada ABOzinha dessa como se ela fosse uma kitnet na minha vida"
- "Tem gente que cria amor com o público de interesse. Não vende, criatura, vai para o outro"
- "Nunca mudar nada. Deixa ela ser feliz"
- "CBO não deu bom? Tchum. Mal. Tchau. Acabou"
- "Analisar a ABO desde o dia que ela começou para tomar a decisão de desligar"
- "Limite de aprendizagem é bobagem. Parece o governo falando como você tem que educar teus filhos"
- "Se eu coloca muita grana, ela se comporta igual uma CBO ruim"
- "Se não for meia-noite e 3 minutos, você não tem ROI"
- "Eu fiquei muito ruim no Instagram, mas eu fiquei muito bom em fazer anúncio"
- "Se segura a métrica, a venda é impossível não acontecer"
- "O criativo não vende, quem vende é a página"
- "Página pronta, roda"
- "99,9% do tráfego do perpétuo é Facebook"
- "Criativo no perpétuo é lenha. Você joga ali e dá ROI"

---

## Glossário do Volume

| Termo | Definição |
|-------|-----------|
| **ABO** | Ad set Budget Optimization — orçamento definido no conjunto (controle granular) |
| **CBO** | Campaign Budget Optimization — orçamento definido na campanha (Meta distribui) |
| **ABO Testadora** | Campanha ABO 1-1-1 para testar criativos ou públicos isoladamente |
| **ABO Raiz** | Campanha de escala horizontal: público campeão + criativo campeão, duplicar infinitamente |
| **ABO Campeões** | Campanha ABO 1-1-3 com 3 criativos campeões (ROI 2.5+) no mesmo conjunto |
| **ABO Campeões Advantage** | ABO Campeões em tipo Advantage, orçamento 100% do valor do produto |
| **Gramado** | Campanha Advantage com 4+ criativos, mínimo 5 ativas, análise no 5o dia |
| **CBO 500** | Campanha CBO com R$500/dia, estrutura 1-5-1 |
| **CBO 1K** | Campanha CBO com R$1.000/dia, estrutura 1-10-5 |
| **CBO Natalina** | Campanha CBO R$1.000+, criativos dark, 3 conjuntos x 3 criativos, escala vertical |
| **Mix de Criativo** | Campanha Advantage com top 3 criativos, orçamento 100% do valor do produto |
| **ABO Garimpo** | Campanha ABO com R$10/conjunto para garimpar clusters bons a baixo custo |
| **Carioca** | Estrutura de escala alternativa (pouco detalhamento disponível) |
| **Miami** | Estrutura de escala alternativa (pouco detalhamento disponível) |
| **Escala Horizontal** | Duplicar ABOs que funcionam (padrão do perpétuo) |
| **Escala Vertical** | Aumentar verba no mesmo conjunto (NÃO recomendado, exceto CBO Natalina/Gramado) |
| **Cluster/Clusterização** | Fragmentação interna do público pelo Facebook em micro-setores. Analogia: ruas de um bairro |
| **Criativo Dark** | Subir criativo pelo código/ID do post, gerando força de criativo nova |
| **Fase 3D** | 3 primeiros dias de tráfego de oferta nova. Não mexe em nada, só coleta dados |
| **Fase da Turbulência** | 3-5 dias de queda sem causa. Esperar, não desligar |
| **Lenha na Fogueira** | Retroalimentar campanha em queda com criativos novos validados |
| **Regra dos 45%** | Orçamento diário por conjunto ABO = 45% do preço do produto |
| **Regra 48h / 3 dias** | Tempo mínimo antes de qualquer decisão sobre criativo/campanha |
| **Regra dos 20%** | (1) Kill: custo 20%+ acima do alvo. (2) Escala: incrementos de 20% na verba |
| **Criativo Campeão** | 5-10 vendas + ROI >= 2.5 + Funil 3X OK |
| **Público Campeão** | 5-10 vendas com ROI >= 2.0 no público isolado |
| **Interesse Óbvio** | Público com relação direta com a persona |
| **Interesse Não Óbvio** | Público no ecossistema da persona sem relação direta |
| **Kitnet** | Analogia: cada ABO de ~R$30 = uma kitnet gerando ~R$1.000/mês de lucro |
| **00:00:03** | Horário ritual de início de campanhas (meia-noite e 3 segundos/minutos) |
| **Janela Completa** | Análise em 3 períodos: ontem + 7 dias + período máximo |
| **Pixel Virgem** | Pixel sem dados, lento, impreciso. Precisa de ~100 eventos para funcionar |
| **Pixel Aquecido** | Pixel com alto volume de dados, busca compradores com precisão |
| **API de Conversões** | Camada adicional ao pixel para tracking mais preciso |
| **Connect Rate** | Visualizações de página / Cliques no link. Meta: 85%+. <80% = problema técnico |
| **Tropino** | Compartilhar pixel entre contas de anúncio para transferir inteligência |
| **Oferta White** | Oferta honesta, sem mentiras — não precisa de contingenciamento |
| **Falsa Validação** | Vendas de público quente que parecem validar mas não escalam |
| **Demanda Reprimida** | Público quente que compra rápido no início mas não sustenta |
| **Clickbait** | Criativo com CVP barato mas sem conversão — clique por curiosidade |
| **PRSA** | Formato padrão de criativo (Problema-Resultado-Solução-Ação) |
| **Funil 3X** | Sistema de diagnóstico com 3 métricas financeiras (ver Volume 02) |
| **Perpétuo Branding** | Perpétuo que usa seguidores do Instagram como público |
| **Frequência** | Número médio de vezes que mesma pessoa vê o anúncio. Alta = cluster esgotado |
| **BM** | Business Manager — gerenciador de negócios do Meta |
| **CPM** | Custo por Mil impressões |
