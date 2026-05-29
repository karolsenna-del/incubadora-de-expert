---
task: "Gather Fase 1 Materials"
responsavel: "@nucleo-strategist"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Handoff do chief com materiais Fase 1 anexados + estado do aluno"
Saida: "Materiais absorvidos + entendimento clarificado + conflitos resolvidos"
Checklist:
  - "Todos os materiais lidos integralmente"
  - "Pontos vagos clareados via 5 Whys"
  - "Conflitos entre fontes resolvidos com aluno"
  - "Vocabulario do aluno capturado"
  - "Pre-requisitos identificados pra construir nucleo"
execution_type: "interactive"
---

# Task: Gather Fase 1 Materials — Coleta e Clareza

**Task ID:** posicionamento-digital/gather-fase1-materials
**Version:** 1.0.0
**Category:** Nucleo / Coleta

---

## Executive Summary

Primeira task do nucleo-strategist. Absorve os materiais da Fase 1 da Mentoria (proposito, posicionamento, metodologia, primeiro produto), confirma entendimento, clarea pecas vagas via 5 Whys, e resolve conflitos.

E a fundacao do nucleo. Sem coleta bem feita, construcao do nucleo vira chute.

---

## Inputs

- Materiais Fase 1 (PDFs, MDs, docs anexados pelo aluno)
- Estado do aluno (improviso=true/false)
- Vocabulario do aluno (capturado pelo chief durante diagnostico)

---

## Outputs

- Materiais lidos e sintetizados
- Mapeamento dos 4 pilares da Fase 1:
  - Proposito (mensagem central)
  - Posicionamento (persona + tese + mecanismo + promessa)
  - Metodologia (como faz)
  - Primeiro produto (o que vende)
- Pontos vagos marcados pra perguntar
- Conflitos resolvidos
- Vocabulario do aluno catalogado

---

## Step-by-Step Execution

### Step 1: Greeting do Specialist

```
Bom te ver. Sou o @nucleo-strategist. Vou construir seu Nucleo 
de Influencia segundo metodo audience.

Antes de comecar, vou ler tudo que voce me passou.
```

### Step 2: Leitura Integral dos Materiais

Le TODOS os materiais anexados:
- PDFs (conteudo completo)
- MDs (estrutura + conteudo)
- Textos colados no chat

**Regra:** NAO PULAR partes. Mesmo que pareca repetitivo, ler.

### Step 3: Sintese Inicial

Apresenta sintese do que entendeu:

```
═══════════════════════════════════════
O QUE EU ENTENDI DOS SEUS MATERIAIS
═══════════════════════════════════════

PROPOSITO:
[mensagem central que extraiu]

POSICIONAMENTO:
- Persona: [quem ele quer atender]
- Tese de mercado: [visao unica que defende]
- Mecanismo unico: [o que ele faz diferente]
- Promessa: [transformacao prometida]

METODOLOGIA:
[como ele entrega — passos, framework, processo]

PRIMEIRO PRODUTO:
- Nome: [...]
- Formato: [mentoria/curso/programa/etc]
- Pra quem: [...]
- Promessa: [...]

═══════════════════════════════════════

Bate? O que ta errado ou faltando?
```

### Step 4: Aplicar 5 Whys

Quando aluno usa palavras vagas ("depende", "as vezes", "geralmente"):

**Why 1:** "Depende de QUE exatamente?"
**Why 2:** "E o que determina isso?"
**Why 3:** "E quando esse criterio aparece?"
**Why 4:** "E por que esse criterio e nao outro?"
**Why 5:** "Qual e a regra real por tras disso?"

Aplica ate chegar na regra real. Anota essa regra.

### Step 5: Resolver Conflitos

Se durante leitura ou conversa identifica que fonte A diz X e fonte B diz Y:

```
Detectei conflito:
- No PDF de [X], voce escreveu: "[trecho]"
- No MD de [Y], voce escreveu: "[trecho diferente]"

Qual e a versao real? Preciso decidir antes de seguir.
```

Aluno decide. Anota.

### Step 6: Confronto + Entrevista Profunda (se improviso=true)

Se aluno chegou sem Fase 1 fechada:

```
Voce nao tem Fase 1 estruturada. Vou fazer entrevista de 
posicionamento MAIS PROFUNDA do que normal pra extrair na hora.

Vai ser pesado. Topa?

Pode levar 30-60 minutos a mais. Mas sem isso, nucleo sai chute.
```

Apos aceitar, agente RODA entrevista em **5 blocos**.  
Max 3 perguntas por bloco — sem interrogatorio.

**Bloco A — Historia + Por Que Faz Isso**
1. "Como voce chegou nessa profissao? Conta a historia curta."
2. "Que dor pessoal te fez querer ajudar outras pessoas com isso?"
3. "Tem alguma cicatriz emocional sua que conecta com o que voce faz hoje?"

Extrai: origem da missao, conexao emocional, autoridade pessoal.

**Bloco B — Tese de Mercado (visao unica)**
1. "Qual A COISA que o seu mercado FAZ que voce DISCORDA profundamente?"
2. "Se voce pudesse mudar UMA crenca do seu publico, qual seria?"
3. "O que voce acredita que e VERDADE mas que ninguem do seu nicho fala?"

Extrai: tese, crenca central, posicionamento ideologico.

**Bloco C — Publico Real**
1. "Me descreve a ultima cliente satisfeita: idade, contexto, dor especifica."
2. "Tem algum tipo de cliente que voce nao atende mais? Por que?"
3. "Quando alguem chega pra voce, em UMA palavra, qual a DOR que ela usa?"

Extrai: persona vivida, filtros, dor na voz do cliente (Ponto 5 critico).

**Bloco D — Mecanismo Proprio**
1. "Como voce explica pra alguem o que voce faz diferente dos outros?"
2. "Tem alguma TECNICA, PROCESSO ou ANGULO que e SEU, que voce desenvolveu?"
3. "Se voce fosse ensinar isso em 3 passos, quais seriam?"

Extrai: mecanismo unico (Ponto 10 — solucao), metodologia.

**Bloco E — Produto e Transformacao**
1. "Qual produto voce ja tem pronto? Se nao, qual seria o primeiro?"
2. "Quanto cobra (ou cobraria)? Como entrega?"
3. "Quando alguem termina seu trabalho, em UMA frase, qual a transformacao concreta?"

Extrai: primeiro produto, formato, transformacao (Ponto 11).

**Apos a Entrevista:**
Sintetiza tudo no formato do Step 3 e segue fluxo normal. 
Marca PUs com `improviso=true`.

**Limite explicito:** se algum bloco fica VAZIO apos as 3 perguntas, 
agente sinaliza:
```
Voce nao tem clareza em [X]. Vou seguir, mas isso vai aparecer 
como ponto fraco no nucleo. Recomendo voltar pra Fase 1 da mentoria 
depois pra resolver.
```

### Step 7: Catalogar Vocabulario do Aluno

Durante toda a conversa, anota:
- Palavras que ele USA (especialmente dores, beneficios, criticas)
- Bordoes proprios
- Termos que ele inventou ou que sao parte do mundo dele
- Como ele descreve a propria audiencia

Esse vocabulario VAI VOLTAR nos pontos do nucleo (especialmente Pontos 5, 6, 9, 11).

### Step 8: Marcar Pre-Requisitos

Antes de seguir pro build-nucleo-influencia, garantir:
- [ ] Proposito claro
- [ ] Posicionamento entendido (persona + tese + mecanismo + promessa)
- [ ] Metodologia descrita
- [ ] Primeiro produto identificado (ou conceito do produto)
- [ ] Conflitos resolvidos
- [ ] Vocabulario do aluno catalogado

Se falta algo critico, perguntar antes de seguir.

### Step 9: Handoff Pra Build

```
Coleta fechada. Tenho material suficiente pra construir.

Proximo passo: vou propor uma PROPOSTA V1 do seu nucleo segundo 
o metodo audience. 11 pontos estruturados.

Vamos?
```

Executa task `build-nucleo-influencia.md`.

---

## Veto Conditions

| Condicao | Acao |
|----------|------|
| Aluno trouxe so 1 dos 4 pilares (so produto, por exemplo) | Confrontar — pedir o resto OU rodar entrevista profunda |
| Materiais escritos em outra lingua | Pedir traducao ou trabalhar no original |
| Aluno se contradiz no meio da conversa | Confrontar gentilmente: "Antes voce disse X, agora Y. Qual e a regra real?" |
| Material e muito antigo (>1 ano) e parece desalinhado com momento atual | Perguntar: "Esse material reflete onde voce ta hoje?" |

---

**Task Status:** Ready for Production
