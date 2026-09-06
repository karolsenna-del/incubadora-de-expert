---
task: "create-script"
responsavel: "@expert-em-lives"
atomic_layer: "task"
entrada: "Tema aprovado pela Karol"
saida: "Roteiro completo no modelo Funil de Zoom + checklist de live"
---

# Task: Criar Roteiro de Live

## Objetivo

Criar roteiro completo de live semanal no modelo Aula de 8 Blocos (Funil de Zoom) adaptado para a Incubadora de Expert.

> **Migrado em 05/09** — substitui o modelo anterior de 4 partes (Narrativa/Execução/Prática/Pitch). Sem bloco de prática/exercício ao vivo — modelo agora é puramente narrativo/conversão, fiel à fonte `agents/etlmaker/kbs/alcateia-implementacao/VOL-funil-vendas.md` seção 13.

## Estrutura Obrigatória (Aula de 8 Blocos)

```
BLOCO 1 — ACORDO (~3-4 min)
  Objetivo: contrato inicial. Quem é a Karol e o que essa live vai entregar.
  - Quem fala (autoridade mínima, sem exagero)
  - O que exatamente vai ser entregue nessa live (o combinado)
  - Ancoragem opcional: quanto custaria/valeria descobrir isso sozinha

BLOCO 2 — FILTRO DE LEADS (~2-3 min)
  Objetivo: quebrar "isso funciona pro meu caso?" logo no início.
  - Casos/depoimentos reais de mentoradas (perguntar quais existem — nunca inventar)
  - Se não houver: validação indireta ancorada no método Expert360 documentado

BLOCO 3 — DOR E EVENTOS (~5-6 min)
  Objetivo: expor e criticar, com respeito, os caminhos tradicionais que a Laura já tentou.
  - 2-4 abordagens tradicionais do nicho dela (lançamento genérico, curso raso, redes sem método)
  - Por que cada uma costuma falhar pra quem está no ponto da Laura
  - Fechar preparando a transição pro Bloco 4

BLOCO 4 — TIRA A CULPA DO LEAD (~2-3 min)
  Objetivo: reposicionar — o problema não é a Laura, é o mercado/soluções que ela tentou.
  - Afirmar explicitamente que ela não é o problema
  - Redirecionar a causa pro mercado (conectar com Bloco 3)
  - Introduzir que existe um caminho mais direto — a live está prestes a mostrar

BLOCO 5 — AUTORIDADE IMEDIATA / MÉTODO (~6-8 min)
  Objetivo: mostrar por que o método Expert360 funciona, sem ensinar o "como" completo.
  - Reframing do problema + por que o método funciona (o racional)
  - Estrutura do método por cima (o quê, não o passo a passo completo)
  - Conexão explícita com o P do método Expert360 relevante ao tema

BLOCO 6 — 5 AFIRMAÇÕES (quebra de objeção via IA) (~6-8 min)
  Objetivo: neutralizar as principais objeções da Laura antes que apareçam.
  - Rodar o prompt de IA (ver Protocolo das 5 Afirmações abaixo) com o tema/oferta da live
  - Selecionar as 5 objeções mais prováveis da Laura pra essa live específica
  - Roteirizar cada uma como objeção → afirmação que quebra

BLOCO 7 — PROJEÇÃO DO CLIENTE (Custo de Não Executar) (~3-4 min)
  Objetivo: fazer a Laura sentir o custo de adiar — 15/30/90 dias, executando vs. não executando.
  - Usar número/resultado real (da Karol ou de mentorada, com permissão) — nunca inventado
  - Se não houver número: projeção qualitativa ("onde você estaria")

BLOCO 8 — PITCH + OFERTA + Q&A (~5-6 min)
  Objetivo: apresentar a oferta específica da live e fechar com CTA único.
  - Promessa (resultado + prazo, puxado do método Expert360)
  - Pré-requisitos/Filtro (pra quem é essa oferta)
  - Estrutura/Entregáveis
  - Bônus único (nunca vários)
  - Fechamento "Decisão Mais Inteligente": sozinha vs. com a Incubadora
  - Nomeia a oferta específica da live (Sprint, Mentoria Grupo, VIP, Individual, ecossistema
    etc.) — NUNCA "Incubadora de Expert" genérico [regra 12/08/2026, adaptada pro Bloco 8]
  - CTA: [KAROL DEFINE O LINK/ACESSO]
```

## Checklist de Entrega (DoD)

Antes de entregar o roteiro, verificar:

- [ ] 8 blocos presentes (Acordo / Filtro de Leads / Dor e Eventos / Tira a Culpa / Autoridade Imediata-Método / 5 Afirmações / Projeção do Cliente / Pitch+Oferta)
- [ ] Bloco 6 com as 5 afirmações levantadas via prompt de IA e priorizadas pra essa live
- [ ] Bloco 7 com número real (Karol/mentorada) ou projeção qualitativa — nunca inventado
- [ ] Duração estimada por bloco
- [ ] Tom da Karol — direto, acolhedor, vulnerável quando necessário
- [ ] Histórias e casos têm âncora no material documentado (ou sinalização pendente)
- [ ] Bloco 8 nomeia a oferta específica da live, nunca "Incubadora de Expert" genérico
- [ ] Pitch estruturado nas 4 partes fixas do Bloco 8
- [ ] Conexão com método Expert360 explícita (Bloco 5)
- [ ] CTA marcado como [KAROL DEFINE] se não confirmado

## Protocolo de Histórias, Casos e Números Pessoais

SE o roteiro ficaria mais forte com uma história, caso ou número específico da Karol:
→ Sinalizar: "Aqui caberia uma história/caso/número seu sobre [tema]. Você tem algo assim que eu possa usar?"
→ AGUARDAR confirmação antes de incluir
→ SE Karol confirmar e der detalhes: incluir com fidelidade
→ SE Karol não tiver: usar dado/princípio genérico ou projeção qualitativa no lugar — nunca inventar

## Protocolo das 5 Afirmações (Bloco 6)

1. Confirmar com a Karol: qual é a oferta específica dessa live e pra quem (a Laura, nesse momento/tema)?
2. Rodar num chat de IA (Claude/ChatGPT/Gemini): *"Eu vendo [oferta] para [Laura, no contexto de {tema da live}]. Me dê as 10 maiores objeções desse público pra não comprar/não agir, e pra cada uma, uma afirmação curta que já quebra essa objeção antes dela ser dita em voz alta."*
3. Levar as 10 pra Karol, condensar com ela em 5 — as mais prováveis pra essa live específica
4. Roteirizar cada afirmação como uma virada curta dentro do Bloco 6

Exercícios reutilizáveis de m0-roteiros.md (Lista de Fracassos, Minha História Real) continuam válidos como fonte de história pro Bloco 3 ou 5, mesmo sem bloco de prática dedicado.

## Formato de Entrega

```
# Live XX — [TÍTULO]
> Tema: [tema]
> Duração estimada: [X] min
> Modelo: Aula de 8 Blocos (Funil de Zoom)

---

## BLOCO 1 — ACORDO (~X min)

[roteiro]

---

## BLOCO 2 — FILTRO DE LEADS (~X min)

[roteiro]

---

## BLOCO 3 — DOR E EVENTOS (~X min)

[roteiro]

---

## BLOCO 4 — TIRA A CULPA DO LEAD (~X min)

[roteiro]

---

## BLOCO 5 — AUTORIDADE IMEDIATA / MÉTODO (~X min)

[roteiro]

---

## BLOCO 6 — 5 AFIRMAÇÕES (~X min)

[objeção → afirmação, uma a uma]

---

## BLOCO 7 — PROJEÇÃO DO CLIENTE (~X min)

[roteiro]

---

## BLOCO 8 — PITCH + OFERTA + Q&A (~X min)

[roteiro nas 4 partes: Promessa / Filtro / Estrutura / Bônus]
> CTA: [KAROL DEFINE]

---

## CHECKLIST PRÉ-LIVE

- [ ] Confirmar CTA/link
- [ ] [itens específicos da live]
```
