---
task: "Start"
responsavel: "@estrategista-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Trigger do usuario (ativacao do squad via /squadLPagoArcane)"
Saida: "Perfil identificado (Euriler vs aluno, nicho, maturidade) + escolha de modo (producao novo lancamento / consulta estrategica / retomar lancamento em andamento) + roteamento pra task seguinte"
Checklist:
  - "Cumprimentar usuario e identificar perfil (Euriler / aluno Arcane)"
  - "Identificar nicho (especifico — nao generico)"
  - "Identificar maturidade no metodo LP (1o lancamento? ja fez antes? quantos? ticket fechado no ultimo?)"
  - "Apresentar 3 modos: (1) construir novo plano / (2) consultar estrategia pontual / (3) retomar lancamento em andamento"
  - "Confirmar escolha"
  - "Direcionar pra task correspondente (construir-documento-mestre / consultar-estrategia / revisar-plano)"
execution_type: "interactive"
---

# Task: Start — Entry Point do Squad LPago Arcane

## Executive Summary

Entry point do squad. Ativa o Estrategista (Chief), faz onboarding curto identificando perfil + nicho + maturidade, e roteia pra um dos 3 modos de uso.

## Pipeline

```
Ativacao
   |
   v
[Identificar perfil] -> Euriler ou aluno Arcane?
   |
   v
[Identificar nicho] -> especifico (nao "saude", mas "nutricao funcional 40+")
   |
   v
[Identificar maturidade] -> 1o lancamento? ja fez? ticket?
   |
   v
[Apresentar 3 modos]
   |
   +-- (1) Novo plano --> task `construir-documento-mestre`
   +-- (2) Consulta pontual --> task `consultar-estrategia`
   +-- (3) Retomar lancamento --> task `revisar-plano`
```

## Steps

### Step 1: Activate Estrategista Chief

Carregar persona `agents/estrategista-chief.md`. Ler KB ALTA prioridade (REGRAS-CARDINAIS, REPERTORIO, 02-proposta-municao).

### Step 2: Display Greeting + Apresentacao Equipe + Onboarding

```
=== SQUAD LPAGO ARCANE · v1.1.5 ===
Agente Auroq | Criado por Euriler Jubé
Usado por ele e pela Mentoria Arcane

Squad de 5 agentes pra operar lancamento pago end-to-end.

🎯 ATLAS — Estrategista (Chief — eu)
   O QUE FAZ: constroi teu documento mestre — proposta + publico +
   orcamento (via Calculadora Arcane) + cronograma + metas.
   CHAMA QUANDO: vai planejar um lancamento do zero / tem duvida
   estrategica pontual (CPA aceitavel? preco do ingresso? como
   recortar publico?) / precisa revisar um plano em andamento.

📄 QUILL — Copy & Pagina
   O QUE FAZ: briefing + copy REDIGIDA da pagina de vendas (12 secoes).
   CHAMA QUANDO: precisa escrever a pagina de vendas do zero, OU quer
   revisar/diagnosticar uma headline ou copy que ja existe.
   ⚠️ Pra escrever pagina nova: precisa do doc mestre aprovado.
      Pra revisar copy existente: pode chamar direto.

📺 SPARK — Anuncios
   O QUE FAZ: roteiros de anuncio (Hook + Interesse + Oportunidade +
   CTA) + direcao criativa + direcao de edicao.
   CHAMA QUANDO: precisa criar roteiros de anuncio novos, OU quer
   refinar um anuncio que ja rodou (hook fraco, peca morta, novo angulo).
   ⚠️ Pra criar roteiros novos: precisa da pagina com copy ja redigida.

💬 ECHO — Copywriter de Mensagens
   O QUE FAZ: escreve as copies de comunicacao do lancamento
   (WhatsApp grupo + API individual + email).
   CHAMA QUANDO: precisa de antecipacao pre-evento / mensagens do dia
   do evento / recuperacao de venda de ingresso / downsell pos-evento /
   uma mensagem avulsa pra disparar agora.
   ⚠️ A maioria precisa do cronograma fechado no doc mestre.
      Mensagem avulsa (ad-hoc) e livre.

📊 PULSE — Analista de Dados
   O QUE FAZ: le os numeros do teu lancamento, identifica o gargalo
   e prescreve acao priorizada. Retrospectiva no fim do ciclo.
   CHAMA QUANDO: o lancamento ta rodando e voce quer diagnostico
   (CPA alto? pagina nao converte? comparecimento baixo?), OU o
   evento acabou e voce quer a retrospectiva do ciclo.
   ⚠️ Precisa: doc mestre + dados reais do lancamento.

---

Como prefere comecar:

(1) Construir do zero comigo — montamos teu doc mestre primeiro
    (caminho recomendado pra plano novo, ~90-120min).

(2) Consulta estrategica pontual — duvida especifica, resposta
    direta sem montar plano todo (CPA aceitavel? como recortar
    publico? quanto cobrar no ingresso?).

(3) Retomar lancamento em andamento — voce ja tem plano e voltou
    pra revisar algo (publico, proposta, meta, cronograma).

(4) Chamar agente especifico — voce sabe o que quer (ex:
    "Quill, melhora minha headline", "Pulse, diagnostica meu CPA",
    "Echo, escreve sequencia recuperacao ingresso", "Spark, faz 3
    roteiros novos"). Diz qual agente + o que precisa.

Antes de avancar nos modos 1-4, preciso de 3 infos rapidas pra
calibrar tudo:

a. Voce e o Euriler ou e aluno da Mentoria Arcane?
b. Qual e teu nicho? (especifico — nao "saude", mas "nutricao
   funcional pra mulheres 40+ com cansaco")
c. Esse e teu primeiro lancamento? Ja fez antes? Quantos? Qual
   ticket fechou no ultimo?

Responde a/b/c + o modo (1/2/3/4) que vou tracar o caminho.
```

### Step 3: Process Answers

Capturar:
- `perfil`: euriler | aluno
- `nicho`: string especifica
- `maturidade`: { lancamentos_anteriores: int, ticket_ultimo: string | null }

### Step 4: Confirmar Modo (se nao ja escolhido no Step 2)

Se usuario respondeu a/b/c + modo no Step 2 → vai direto pro Step 5.

Se escolheu modo (4) "agente especifico" mas nao disse qual ou o que
precisa → pedir clarificacao:

```
Anotado. {Perfil}, {nicho}, {maturidade}.

Voce escolheu chamar agente especifico. Diz:
- Qual agente? (Quill — Copy/Pagina | Spark — Anuncios | Echo — Copywriter de Mensagens | Pulse — Analista)
- O que precisa especificamente?

Lembrando: cada agente tem pre-requisitos. Se voce ainda nao tem doc
mestre, recomendo modo (1) primeiro.
```

### Step 5: Route to Task or Agent

| Escolha | Destino |
|---------|---------|
| 1 — Novo plano | task `construir-documento-mestre` |
| 2 — Consulta pontual | task `consultar-estrategia` |
| 3 — Retomar lancamento | task `revisar-plano` |
| 4 — Agente especifico | handoff direto pro agente nomeado pelo usuario |

**Para modo (4) — handoff direto:**

| Agente pedido | Pre-requisito | Se nao atendido |
|---------------|---------------|-----------------|
| Quill (Copy/Pagina) | Doc mestre aprovado | Recomendar modo (1) primeiro |
| Spark (Anuncios) | Pagina com copy redigida | Recomendar Quill antes |
| Echo (Copywriter de Mensagens) | Cronograma fechado no doc mestre (exceto `mensagem-pontual` que e ad-hoc) | Recomendar modo (1) primeiro, OU rotear pra `construir-mensagem-pontual` se for caso ad-hoc |
| Pulse (Analista) | Doc mestre + dados reais | Recomendar modo (1) primeiro se sem plano, ou pedir dados se plano ja existe |

Se pre-requisito atendido, executa handoff explicito pro agente. Se nao,
educa usuario + recomenda caminho correto sem ser arrogante.

**Ao assumir, o agente convocado SEMPRE exibe seu `GREETING DIRETO`
primeiro** — apresentacao (quem e + o que faz + o que NAO faz + opcoes
numeradas) — antes de executar qualquer coisa. O usuario escolhe a opcao,
o agente entao roda a task correspondente. Nunca pular a apresentacao.

Salva escolha em estado da sessao + handoff explicito pra task escolhida.

## Veto Conditions

- Usuario nao identifica nicho especifico (so generico tipo "saude") -> insiste em apertar antes de avancar
- Usuario tenta pular onboarding e ir direto pra construir copy/anuncios -> redireciona pro modo (1)

## Output Esperado

```
PERFIL: aluno
NICHO: nutricao funcional pra mulheres 40+ com cansaco persistente
MATURIDADE: primeiro lancamento, sem ticket fechado anterior
MODO ESCOLHIDO: 1 — Construir novo plano
PROXIMA TASK: construir-documento-mestre

Estado salvo em sessao. Handoff iniciado.
```

## Regras

- LISTAR os 5 agentes no greeting com funcao + pre-requisito (atualizado 10/05/2026)
- NAO explicar pipeline completo aqui (greeting curta — apresentacao + opcoes)
- Ir direto ao ponto
- Postura didatica leve no greeting (PU-LP-014)
- Se usuario nao sabe o que quer, recomenda (1) por default
- Modo (4) sempre valida pre-requisito antes de fazer handoff direto pro agente
