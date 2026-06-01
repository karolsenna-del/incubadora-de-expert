---
task: "Construir Sequencia de Antecipacao"
responsavel: "@copywriter-mensagens"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "documento-mestre.md aprovado (com cronograma de disparos definido no Bloco 5) + briefing-pagina.md (pra coerencia de promessa) + (opcional) referencias do NDF como inspiracao"
Saida: "sequencia-antecipacao.md (cronograma completo pre-evento + copies por canal: grupo WA, API individual com placeholders Meta, email)"
Checklist:
  - "Cronograma de disparos extraido do documento mestre (intencao + canal + timing por disparo)"
  - "Para cada disparo de grupo WA: copy redigida com tom coerente (acolhimento -> hype crescente -> last call), aplica vars do cronograma, cita prazos do plano"
  - "Para cada disparo de API individual: estrutura template Meta (header / body com parametros / buttons / quick replies) + body redigido com TODO claro caso template ainda nao exista na Meta"
  - "Para email de boas-vindas (compra confirmada): subject, preheader, corpo plain text com custom fields, P.S. com CTA do grupo"
  - "Sequencia respeita gramatica de canal: grupo=coletivo+bordoes / API=transacional+template / email=corpo longo+P.S."
  - "Sequencia coerente com promessa da pagina (sem reabrir publico/proposta — vem do plano)"
  - "Variaveis declaradas: meet_link, link_grupo, data_evento_texto, dia_semana, horario_evento, duracao_horas, prazo_formato_aulas, etc."
  - "Validacao contra RC-005 (vendedor 24h), RC-019 (validar contra RCs aplicaveis), e regra REPERTORIO 'sem prometer atalho magico'"
  - "Sequencia aprovada EXPLICITAMENTE pelo usuario"
execution_type: "interactive"
---

# Task: Construir Sequencia de Antecipacao

## Executive Summary

Pipeline pra redigir copies das mensagens pre-evento (T-7d a T-1d) cobrindo 3 canais: grupo WhatsApp, API individual (template Meta), email. Input principal e o cronograma de disparos definido pelo Estrategista no Bloco 5 do doc mestre — copywriter NAO define cronograma, apenas redige copies.

## Pipeline

```
Doc mestre aprovado (com cronograma Bloco 5)
+ briefing-pagina.md (pra coerencia)
   |
   v
[Extrair cronograma de disparos pre-evento]
   |
   v
[Para cada disparo, identificar canal]
   |
   +-- Grupo WA -> copy coletiva
   +-- API individ -> estrutura template Meta + body
   +-- Email -> subject + preheader + corpo + P.S.
   |
   v
[Aplicar gramatica do canal]
   |
   v
[Declarar variaveis]
   |
   v
[Validar coerencia com promessa da pagina]
   |
   v
[Validar RCs]
   |
   v
[Aprovacao explicita]
```

## Steps

### Step 1: Extrair Cronograma do Doc Mestre

Le Bloco 5 do documento mestre. Filtra disparos pre-evento (T-7d a T-1d, antes do start).

Estrutura tipica:

```
| # | Quando  | Canal       | Tipo                  | Intencao                 |
|---|---------|-------------|-----------------------|--------------------------|
| 1 | T-7d    | Grupo WA    | Boas-vindas           | Acolher + apresentar     |
| 2 | T-7d    | Email       | Boas-vindas pos-compra| Confirmar + grupo        |
| 3 | T-3d    | Grupo WA    | Lembrete + dor        | Identificacao            |
| 4 | T-1d    | API individ | Lembrete pessoal      | Toque humano             |
| 5 | T-1d    | Grupo WA    | Vespera               | Aquecimento              |
| 6 | T-1h    | API individ | Link antecipado       | Link Meet pessoal        |
```

### Step 2: Identificar Variaveis Globais

Antes de comecar, declarar variaveis que vao aparecer em multiplos disparos:

```
VARIAVEIS GLOBAIS:
- {workshop_nome}: ex "Workshop Sistema Hormonio em Equilibrio"
- {workshop_data}: ex "16-17 de maio (sabado e domingo)"
- {workshop_horario}: ex "10h as 19h30"
- {duracao_horas}: ex "~9 horas por dia"
- {dia_semana}: ex "sabado"
- {data_vespera}: ex "15 de maio (sexta)"
- {dia_vespera}: ex "sexta"
- {meet_link}: liberado proximo ao evento (placeholder)
- {link_grupo}: link de convite WhatsApp
- {first_name} ou {{1}}: parametro para api individual
- {nutricionista_nome} ou {dono_lancamento}: ex "Dra. Marina Lopes"
```

### Step 3: Construir Copies de GRUPO WA

Para cada disparo de grupo, gramatica coletiva:

**Estrutura:**
```
Saudacao (tom coerente com momento)

Bordao / frase forte (curta)

Conteudo principal:
- Bullet 1
- Bullet 2
- Bullet 3

Variaveis aplicadas (data, horario, etc.)

Frase de relacionamento

Frase de fechamento + assinatura
```

**Tons por momento:**
- T-7d: ACOLHIMENTO (boas-vindas, cria expectativa)
- T-5d a T-3d: IDENTIFICACAO (gatilho de dor, curiosidade)
- T-2d: HYPE (anticipacao subindo)
- T-1d (vespera): LAST CALL + AQUECIMENTO

**Exemplos de bordoes/frases:**
- "Voces decidiram nao se conformar com [dor] como 'idade' ou 'fase'"
- "Sabado a gente comeca"
- "Eu vou estar presente nesse grupo todo dia ate la"

### Step 4: Construir Copies de API INDIVIDUAL (Template Meta)

Para cada disparo de api individual:

**Estrutura template Meta:**

```
TEMPLATE NAME: {sugestao — ex: "lembrete_pessoal_workshop_she"}
CATEGORIA: Marketing OU Utility (com justificativa)
IDIOMA: pt_BR

[HEADER]
Tipo: TEXT / IMAGE / VIDEO

[BODY — com parametros]
{{1}} = first_name
{{2}} = workshop_data_curta
...

[BODY REDIGIDO]
texto pronto pra entrar no body do template

[BUTTONS]
Quick reply: "X" / "Y"
OU CTA URL: "Z"

[NOTA TODO]
[!] Esse template precisa ser aprovado na Meta antes do disparo.
    Validar com Euriler/aluno se template ja existe ou precisa criar.
```

**Tons por momento:**
- T-3d / T-1d: PESSOAL ("oi {{1}}, aqui e a {nome}")
- T-1h: URGENCIA LEVE ("ja ta tudo pronto pra amanha?")

### Step 5: Construir Email de Boas-Vindas

Estrutura:

```
[SUBJECT]
{tipo "Parabens, {$nome}! Sua vaga no {$workshop_nome} esta confirmada"}

[PREHEADER]
{1 frase de complemento — aparece como preview}

[CORPO PLAIN TEXT]
Saudacao com {$nome}
Confirmacao da compra
Detalhes do workshop (data, horario, link grupo)
Como vai funcionar (antes / durante / depois)
Apresentacao do dono / proxima etapa
Despedida

[P.S.]
CTA principal (entrar no grupo)

[CUSTOM FIELDS DECLARADAS]
- $nome
- $workshop_nome
- $workshop_data
- $workshop_horario
- $grupo_whatsapp
- $link_vendas (se aplicavel)
```

Referencia: `data/exemplos/email-boas-vindas-ndf.md` mostra estrutura real do NDF Workshop.

### Step 6: Validar Coerencia com Pagina

Para cada copy redigida:
- Promessa da mensagem bate com headline da pagina?
- Mecanismo (nome) aparece consistente?
- Tom da mensagem coerente com tom da pagina?

Se nao: ajusta.

### Step 7: Validar RCs

- [ ] RC-005 (vendedor 24h): mensagens trabalham relacao
- [ ] RC-019 (validar contra RCs): tom Euriler / dono do lancamento
- [ ] REPERTORIO: sem promessa magica, sem corporativo, sem "investe em voce"

### Step 8: Aprovacao Explicita

```
Sequencia de antecipacao fechada.

{N} disparos cobrindo {periodos}:
- Grupo WA: {N} disparos
- API individual: {N} disparos (com TODO de aprovacao Meta)
- Email: {N} disparos

Voce APROVA essa sequencia? Aprovacao significa:
- Copies redigidas vao pro dispatcher (manual ou automatizado)
- Templates Meta API com TODO viram tarefas pra aprovar na Meta
- Emails configurados na ferramenta (MailerLite / ConvertKit / outro)

(SIM / NAO + ajuste especifico por disparo)
```

## Veto Conditions

- Cronograma nao definido no doc mestre → recusa, devolve pro Estrategista
- Copy redige cronograma novo (escopo errado) → recusa, copywriter nao define cronograma
- Promessa da mensagem diverge da headline da pagina → ajusta
- Tom corporativo / "investe em voce" → ajusta
- API individual sem TODO claro de aprovacao Meta → adiciona TODO
- Email sem custom fields declaradas → ajusta
- Mistura de gramatica (paragrafos longos no template Meta, p.ex.) → ajusta
- Aprovacao implicita → exige SIM/NAO

## Output Esperado

Arquivo `sequencia-antecipacao.md` com:
- Header (data, versao, cronograma referenciado)
- Variaveis globais declaradas
- Por disparo: canal + briefing + copy redigida + (se api) estrutura template Meta + (se email) custom fields + nota TODO se aplicavel
- Checklist RCs verde
- Lista de TODOs (templates Meta a aprovar, emails a configurar)
- Linha de aprovacao

## Regras

- Cronograma vem do Estrategista (NUNCA define aqui)
- Gramatica especifica por canal
- Variaveis declaradas explicitas
- TODO claro pra templates Meta nao aprovados ainda
- Cita RC aplicada
- Tom Euriler ou aluno (REPERTORIO)
- Termina com proximo passo concreto
