---
task: "Construir Mensagem Pontual (Ad-Hoc)"
responsavel: "@copywriter-mensagens"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Pedido pontual do usuario ('preciso de uma mensagem pra X') + contexto minimo (canal, momento do funil, tom desejado, parametros)"
Saida: "mensagem-{slug}.md (copy unica pronta pra disparo, com gramatica do canal solicitado)"
Checklist:
  - "Identificar canal (grupo WA / API individual com template / email / outro)"
  - "Identificar momento do funil (pre-evento / dia do evento / pos-evento / suporte / objecao especifica)"
  - "Coletar parametros faltantes (link, prazo, vars do nicho)"
  - "Aplicar gramatica de canal correspondente"
  - "Coerencia com tom Euriler / dono do lancamento (REPERTORIO) — sem promessas magicas, sem corporativo"
  - "Mensagem aprovada explicitamente pelo usuario"
execution_type: "interactive"
---

# Task: Construir Mensagem Pontual (Ad-Hoc)

## Executive Summary

Mensagens fora do cronograma planejado. Usuario pede ad-hoc: "preciso de uma msg pra mandar agora pq aconteceu X". Copywriter coleta contexto minimo, aplica gramatica do canal, entrega copy unica.

## Pipeline

```
Pedido do usuario
   |
   v
[Identificar canal]
   |
   v
[Identificar momento do funil]
   |
   v
[Coletar parametros]
   |
   v
[Aplicar gramatica do canal]
   |
   v
[Validar tom + RCs aplicaveis]
   |
   v
[Aprovacao explicita]
```

## Steps

### Step 1: Identificar Canal

Pergunta direta:

```
Pra qual canal e essa mensagem?

1. Grupo WhatsApp (publico — todos do grupo veem)
2. API individual (template Meta — disparo um-a-um automatizado)
3. Email (massa via MailerLite / ConvertKit / outro)
4. WhatsApp pessoal 1-a-1 (manual, sem template)
5. Outro (especifica)
```

### Step 2: Identificar Momento do Funil

```
Em que momento da jornada a pessoa que recebe ta?

1. Pre-evento (entre compra e evento)
2. Dia do evento (em curso)
3. Pos-evento (recuperacao / oferta de continuidade)
4. Suporte (problema operacional, duvida pratica)
5. Objecao especifica (preco, dificuldade, encaixe)
6. Outro (especifica)
```

### Step 3: Coletar Parametros Faltantes

Dependendo do canal e momento, pode precisar:
- Link (Meet, pagina, grupo, etc.)
- Prazo (data limite, "ate X horario")
- Variaveis do nicho (nome do workshop, mecanismo, ticket)
- Tom desejado (urgencia / acolhimento / transparencia)
- Restricoes (formal / casual / brincadeira / serio)

### Step 4: Aplicar Gramatica do Canal

| Canal | Gramatica |
|-------|-----------|
| Grupo WA | Coletivo, bordoes, paragrafos curtos, emojis aplicados, asteriscos pra negrito |
| API individual (template Meta) | Body com parametros, header opcional, buttons quick reply, body curto |
| Email | Subject pessoal, preheader, corpo longo OK, P.S. com CTA |
| WhatsApp 1-a-1 | Pessoal, conversacional, sem formalidade, pode ser longa OU curta |

### Step 5: Validar Tom + RCs

- [ ] Tom coerente com voice DNA do dono (Euriler ou aluno)
- [ ] Sem promessa magica
- [ ] Sem linguagem de infoprodutor generico
- [ ] RC aplicavel cita (RC-005, RC-008, RC-014, RC-019)

### Step 6: Aprovacao Explicita

```
Mensagem pontual fechada.

Canal: {canal}
Momento: {momento}
Variaveis aplicadas: {list}

[copy redigida]

Voce APROVA pra disparo agora?

(SIM / NAO + ajuste especifico)
```

## Veto Conditions

- Pedido sem contexto minimo (canal nao especificado, etc.) → coleta antes de redigir
- Mensagem que mistura gramatica de canais → ajusta
- Tom corporativo → ajusta
- Mensagem que inventa info que nao esta no contexto → recusa, pede info
- Aprovacao implicita → exige SIM/NAO

## Output Esperado

Arquivo `mensagem-{slug}.md` com:
- Header (data, canal, momento, contexto)
- Variaveis declaradas
- Copy redigida
- Checklist tom + RCs verde
- Linha de aprovacao

## Regras

- Coleta contexto antes de redigir
- Gramatica especifica por canal
- Variaveis declaradas
- Tom Euriler ou aluno (REPERTORIO)
- Curta quando precisa, longa quando precisa
- Termina com proximo passo concreto
