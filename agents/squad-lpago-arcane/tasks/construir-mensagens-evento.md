---
task: "Construir Mensagens do Dia do Evento"
responsavel: "@copywriter-mensagens"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "documento-mestre.md (com cronograma do dia do evento) + sequencia-antecipacao.md (pra coerencia narrativa)"
Saida: "mensagens-evento.md (copies do dia do evento por momento: T-1h, T-30min, T0, recovery T+15min, pressao social T+20/40min, recovery api, FOMO T+1h/2h, almoco, tarde, encerramento — por dia se evento for multi-dia)"
Checklist:
  - "Cronograma do dia do evento extraido do documento mestre"
  - "Disparos T-1h e T-30min com link antecipado (api individual + grupo) — gramatica de hype pre-inicio"
  - "Disparo T0 (start ao vivo) — gatilho de urgencia 'COMECOU'"
  - "Disparos de recovery T+15min/T+45min via API individual (template) — copies de 'cade voce' e 'conseguiu entrar' com TODO Meta se template ainda nao existir"
  - "Disparos de pressao social no grupo T+20min/T+40min — 'voce ta atrasado' / 'ainda da tempo'"
  - "Disparos de FOMO T+1h/T+2h — 'ta fervendo', 'X horas de conteudo'"
  - "Disparo de volta de almoco (grupo + api individual)"
  - "Disparo de tarde (~17h) — 'voce comprou X, volta'"
  - "Disparo de encerramento (~19h) — acolher + ponte pra proximo dia OU pos-evento"
  - "Se evento multi-dia, espelhar estrutura do Dia 1 no Dia 2 com tom 'ultimo dia / o melhor fica pro final'"
  - "Variaveis declaradas: meet_link, first_name (api), {{1}} (template Meta)"
  - "Validacao contra RC-008 (retencao = vida), RC-019"
  - "Mensagens aprovadas EXPLICITAMENTE pelo usuario"
execution_type: "interactive"
---

# Task: Construir Mensagens do Dia do Evento

## Executive Summary

Pipeline pra redigir copies do dia do evento — momentos criticos onde RC-008 (tudo e retencao) determina sucesso ou falha. Mensagens cobrem grupo WA + API individual (recovery), por dia se evento multi-dia.

## Pipeline

```
Doc mestre + sequencia-antecipacao.md
   |
   v
[Extrair cronograma do dia do evento]
   |
   v
[Por momento, redigir copies]
   |
   +-- T-1h: link antecipado (api + grupo)
   +-- T-30min: link grupo
   +-- T0: start ao vivo
   +-- T+15min: recovery api "cade voce"
   +-- T+20min: pressao social grupo
   +-- T+40min: grupo "ainda da tempo"
   +-- T+45min: recovery api "conseguiu entrar"
   +-- T+1h: FOMO grupo
   +-- T+2h: FOMO grupo
   +-- almoco: grupo + recovery api
   +-- tarde: grupo "voce comprou X"
   +-- encerramento: grupo + ponte
   |
   v
[Se multi-dia: espelhar Dia 2]
   |
   v
[Validar RCs]
   |
   v
[Aprovacao explicita]
```

## Steps

### Step 1: Extrair Cronograma do Dia

Filtra disparos do dia do evento do Bloco 5 do doc mestre.

### Step 2: Construir Copies Por Momento

#### T-1h (api individual + grupo)

**API individual (template Meta):**
- Tom: pessoal, urgencia leve
- Body: "{{1}}, em 1 hora a gente comeca. Te lembro do link: {{2}}"
- Buttons: quick reply "Confirmado"

**Grupo:**
- Tom: hype subindo, bordao coletivo
- "Pessoal, em 1 hora estamos juntas. Quem ja ta a postos manda um '🙋'"

#### T-30min (grupo)

- Tom: urgencia subindo
- "30 minutos! Garanta seu copo de agua, caderno, e desconecta o celular de outras notificacoes. Vamos."

#### T0 (start ao vivo, grupo)

- Tom: COMECOU, gatilho de urgencia
- "TA AO VIVO. Link: {meet_link}. Entra agora, voce nao quer perder os primeiros minutos."

#### T+15min (recovery api individual)

**Template Meta:**
- Categoria: Marketing
- Body: "{{1}}, ja ta dentro? Comecamos ha 15 min e nao te vi entrar. Se teve problema, manda aqui. Link: {{2}}"
- Buttons: "To dentro" / "Tive problema"
- TODO: aprovar template na Meta antes

#### T+20min (pressao social grupo)

- Tom: leve confronto + urgencia
- "Quem chegou agora ta entrando no melhor pedaco. Quem nao chegou — voce ta atrasado, mas ainda da. Link: {meet_link}"

#### T+40min (grupo, "ainda da tempo")

- Tom: ultimo aviso operacional
- "Ainda da tempo de entrar. To explicando a primeira fase. Link: {meet_link}"

#### T+45min (recovery api individual)

**Template Meta:**
- Body: "{{1}}, conseguiu entrar? Se sim, manda 'sim' aqui. Se nao, me avisa que eu te ajudo."
- Buttons: "Sim, to dentro" / "Tive problema"

#### T+1h (FOMO grupo)

- Tom: provocacao social
- "Pessoal, ja sao 1h de aula. Conteudo: [resumo curtissimo do que ja foi]. Quem ta acompanhando, da um '✋'"

#### T+2h (FOMO grupo)

- Tom: validacao do progresso
- "2h de conteudo. Acabamos de fechar a Fase 1. Quem ta com a cabeca explodindo, manda emoji '🤯'"

#### Almoco (grupo + api individual)

**Grupo:**
- Tom: pausa + hype pra volta
- "PAUSA pro almoco. Voltamos as 14h. Tarde e ainda mais densa que a manha."

**API individual recovery:**
- Body: "{{1}}, voce sumiu pela manha. Voltamos as 14h. Te espera la."

#### Tarde (~17h, grupo)

- Tom: pressao + lembranca de compra
- "Tarde de hoje voce viu [conteudo X]. Quem ja decidiu que quer aprofundar, manda DM."

#### Encerramento (~19h, grupo)

- Tom: acolher + ponte
- Se evento multi-dia: "Dia 1 fechou. AMANHA o melhor fica pro final — vou abrir [conteudo Dia 2]. 10h em ponto."
- Se evento dia unico: "Dia fechou. Quem quer aprofundar com o produto principal, link na DM. Quem ainda tem duvida, fica aqui."

### Step 3: Espelhar Dia 2 (Se Multi-Dia)

Se workshop e 2 dias:
- Mesma estrutura do Dia 1
- Tom Dia 2: "ultimo dia / o melhor fica pro final"
- Encerramento Dia 2: ponte pra pos-evento + oferta produto principal

### Step 4: Validar RCs

- [ ] RC-008 (retencao = vida): mensagens criticas (recovery, FOMO) priorizadas
- [ ] RC-019: tom Euriler / dono
- [ ] Coerencia narrativa com sequencia-antecipacao.md (continuacao da promessa)
- [ ] Sem mensagem que prometa data fixa em copy reusavel

### Step 5: Aprovacao Explicita

```
Mensagens do dia do evento fechadas.

{N} disparos cobrindo Dia 1 (e Dia 2 se multi-dia):
- Grupo WA: {N} disparos
- API individual: {N} disparos (com TODO Meta)

Voce APROVA?

(SIM / NAO + ajuste especifico por disparo)
```

## Veto Conditions

- Recovery api soa como venda (deve ser presenca) → ajusta
- Encerramento sem ponte pra Dia 2 ou pos-evento → ajusta (RC-014)
- Mensagem com data fixa em copy reusavel → ajusta
- Tom corporativo → ajusta
- Aprovacao implicita → exige SIM/NAO

## Output Esperado

Arquivo `mensagens-evento.md` com:
- Header (data, versao, evento referenciado)
- Por momento: copy redigida + canal + tom + variaveis + (se api) estrutura template Meta + TODO
- Se multi-dia: secoes Dia 1 / Dia 2 espelhadas
- Lista de TODOs (templates Meta a aprovar)
- Linha de aprovacao

## Regras

- Recovery api e PRESENCA, nao venda
- Encerramento Dia X SEMPRE faz ponte
- Espelha estrutura no Dia 2
- Variaveis declaradas
- TODO Meta claro
- Termina com proximo passo concreto
