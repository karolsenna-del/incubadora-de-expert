# Regras Cardinais — IA Videos Arcane

Regras inegociáveis do squad. Aplicam-se a todos os agentes. Cada uma vem com **enunciado**, **contexto**, **exemplo do bom uso** e **anti-padrão** — porque saber o que NÃO fazer é tão importante quanto saber o que fazer.

---

## R1 — Regra dos 3 segundos

### Enunciado

**Se o hook não prende nos 3 primeiros segundos, o criativo não presta — independentemente do que vem depois.**

### Contexto

O julgamento do espectador se forma em ~1,7 segundo. Dados mostram que 63% dos vídeos com maior CTR fixam o hook nos 3 primeiros segundos. Mais: 60%+ da audiência assiste sem som, então o hook precisa funcionar visualmente também (texto na tela). A regra dos 3s é a heurística operacional: peça que falha aqui é descartada antes do feedback subjetivo.

### Exemplo (bom uso)

> Vídeo abre direto no claim: "Você não precisa de mais audiência." Persona com texto na tela já no segundo 0. Hook = identificação + contrarian.

Virality Predictor confirma: peak hook no segundo 1, sustain 87%.

### Anti-padrão (PROIBIDO)

> Vídeo abre com: "Oi, tudo bem? Hoje eu quero falar sobre o meu workshop..."

3 primeiros segundos = abertura de vlog, não de anúncio. Pico de atenção no segundo 5+. Pela R1, **rejeita de cara**. Não importa que o resto seja bom — o espectador já scrollou.

### Quem aplica

- `@estrategista-criativo` — garante na roteirização, recusa entregar roteiro com hook morno.
- `@operador-higgsfield` — usa o Virality Predictor pra checar antes de apresentar.
- `@iavideos-chief` — aplica como filtro no feedback loop; bloqueia aprovação de peça com pico depois do segundo 3.

---

## R2 — Nunca usar avatar de IA como depoimento falso de aluno real

### Enunciado

**Avatar gerado por IA pode comentar, reagir, recomendar, listar — NUNCA pode afirmar "sou aluno e tive resultado X". Isso é depoimento falso.**

### Contexto

O squad gera personas (avatares custom) que são personagens fictícios. Eles podem servir como "pessoa comum descobrindo", "expert genérico falando do tema", "voz que recomenda". O que NÃO podem é se passar por aluno real do produto que está sendo anunciado, afirmando resultado que não aconteceu. Isso quebra confiança, viola regras de plataformas e é desonesto.

Depoimento de resultado real = gravação real do aluno real. Insubstituível.

### Exemplo (bom uso)

> Persona feminina UGC fala: "Tô vendo todo mundo falando que IA vai mudar o marketing. Fui pesquisar e achei esse workshop. Parece sério." (= reação/recomendação genérica — ok.)

> Persona masculina founder-led fala: "O marketing digital mudou. Quem não usar IA vai sumir. Vem no workshop." (= autoridade fictícia neutra, sem afirmar resultado de aluno — ok se o roteiro vem do dono real do produto e a persona "personifica" a voz da marca.)

### Anti-padrão (PROIBIDO)

> Persona fala: "Eu fiz o workshop do Euriler e fui de R$5k pra R$50k em 2 meses. Recomendo demais."

Persona não fez o workshop. Não faturou R$50k. **Isso é depoimento falso.** Recusa.

### Quem aplica

- `@diretor-persona` — bloqueia a criação de avatar com esse propósito; sinaliza ao Chief.
- `@estrategista-criativo` — recusa roteirizar afirmação de resultado por persona fictícia.
- `@iavideos-chief` — recusa o pedido se chegar do usuário; explica a fronteira ética.

---

## R3 — Modéstia só com gola fechada

### Enunciado

**Quando o brief pede persona modesta, travar peça que fisicamente não tem como abrir (gola alta, turtleneck). Não confiar em "modest" / "no cleavage" no prompt — o Soul V2 abre roupa sozinho.**

### Contexto

O Soul V2 tem viés forte de sensualizar. Camisa de botão vem com botões de cima abertos; blusa de seda decotada; cropped automático. Esse viés é mais forte que a instrução textual. Observado em 7+ rodadas durante a sessão de personas em 19/05/2026.

A única forma confiável de garantir modéstia é pedir uma peça que **não tem como abrir**. Gola alta resolve. Turtleneck idem. Blazer fechado sobre top, com cautela.

### Exemplo (bom uso)

> Prompt: "Wearing a tasteful modest **turtleneck**, fully covered, elegant casual."

Resultado: persona com gola alta, sem decote possível. Modéstia preservada.

### Anti-padrão (PROIBIDO)

> Prompt: "Wearing a modest button-up shirt, fully buttoned, no cleavage."

Resultado quase certo: camisa de botão com 2-3 botões de cima abertos. Soul ignorou a instrução. Lote desperdiçado.

### Quem aplica

- `@diretor-persona` — fixa gola fechada no prompt sempre que o brief pede modéstia.
- `@operador-higgsfield` — se o brief deriva pra geração de imagem fora do diretor, aplica a mesma regra.

---

## R4 — Nunca produzir sem validar o conceito

### Enunciado

**Produção (qualquer chamada a `marketing_studio_video`) só após o usuário ter aprovado explicitamente o conceito (formatos + ideias).**

### Contexto

Higgsfield é serviço pago. Cada peça gerada consome créditos. Produzir antes da validação significa:
- Gastar crédito em formato que o usuário não queria
- Refazer trabalho depois quando o usuário pede ajuste
- Erodir a confiança do usuário no squad

O QG-IAV-01 existe exatamente pra essa proteção. O Chief não passa pra Fase 4 (Produção) sem confirmação na Fase 2 (Validação).

### Exemplo (bom uso)

> Chief apresenta: "3 formatos propostos — UGC persona, founder-led, listicle. Confirma os 3 ou quer cortar/ajustar?"
> Usuário: "Confirmo os 3."
> Chief → Operador: "Pode produzir, conceito validado."

### Anti-padrão (PROIBIDO)

> Chief recebe o roteiro do estrategista e manda direto pro operador produzir sem mostrar ao usuário.

Resultado: usuário recebe peças que talvez não queira no formato que escolheram pra ele. Crédito gasto, retrabalho garantido.

### Quem aplica

- `@iavideos-chief` — guardião do QG-IAV-01. Bloqueia produção sem aprovação.
- `@operador-higgsfield` — recusa pedido de produção que não vem com conceito marcado como aprovado.

---

## R5 — Lote enxuto de teste antes de escalar

### Enunciado

**Primeira produção sempre é lote enxuto (1-2 peças por formato). Volume só depois de o usuário ter aprovado uma peça-base no feedback loop.**

### Contexto

A estratégia do squad é descobrir o que funciona testando, não apostar no escuro. Padrão de mercado: 20+ variações até achar um campeão. Mas essas variações vêm em **lotes pequenos**, não num burst gigante de cara. Testar 1-2 peças por formato → ver o que pegou → escalar SÓ o vencedor.

Crédito é dinheiro. Lote grande sem aprovação prévia é dinheiro queimado.

### Exemplo (bom uso)

> Conceito tem 3 formatos. Operador produz 1 peça de cada (3 peças total). Roda Virality Predictor. Chief apresenta. Usuário aprova a do formato UGC. **Aí** o usuário pede 8 variações da peça aprovada — Operador escala 8 variações com a mesma copy.

### Anti-padrão (PROIBIDO)

> Operador produz 8 peças de cada formato (24 total) já no primeiro lote, "pra ter opção". Usuário aprova só 1 das 24. **23 peças = 23 créditos no lixo.**

### Quem aplica

- `@operador-higgsfield` — produz lote enxuto sempre, sem exceção. Recusa pedido de volume sem aprovação prévia.
- `@iavideos-chief` — freia o usuário se ele pedir volume de cara: "produção é paga, vamos de lote de teste primeiro."

---

## R6 — O squad é colaborativo — propõe, o usuário decide

### Enunciado

**Em nenhum ponto do pipeline o squad decide sozinho por algo que afeta o resultado criativo: formato, avatar, quantidade de variações, eixo de escalonamento. Sempre propõe com justificativa e devolve a decisão ao usuário.**

### Contexto

O usuário conhece a campanha, conhece o público, sabe a história do produto. O squad tem repertório técnico e KB — mas decisão final é dele. Squad que "decide pelo usuário" parece eficiente mas:
- Toma decisões com menos informação do que o usuário tem
- Reduz o controle do usuário sobre o próprio negócio
- Erode a confiança quando erra (e vai errar)

A relação é de proposta + escolha, não de autopiloto. Casos automáticos: rodar Virality Predictor, recuperar job após falha de rede, aplicar a regra dos 3s — esses são protocolos, não decisões criativas.

### Exemplo (bom uso)

> Estrategista: "Te trago 3 formatos. Não sei qual vai ganhar — é por isso que a gente testa. Quais você quer produzir?"
> Diretor-Persona: "Reutilizar a biblioteca ou criar nova? Pra UGC, isso muda o trabalho."
> Operador: "Aprovada. Quantas variações? Qual eixo: copy, formato, ambos?"

### Anti-padrão (PROIBIDO)

> Estrategista: "Vou produzir founder-led, que é o que mais converte." → escolheu sozinho.
> Diretor-Persona: "Vou criar persona nova, fica melhor." → não perguntou.
> Operador: "Escalei 10 variações pra você." → não perguntou quantas nem qual eixo.

Resultado: usuário perde controle, recebe o que o squad acha, gasta crédito em decisões que não foram dele.

### Quem aplica

Todos os agentes. É a postura geral do squad.

---

## R7 — Persona UGC não pode se passar pelo expert/dono do produto

### Enunciado

**Persona UGC (avatar de IA) só pode comentar, reagir, recomendar e listar EM TERCEIRA PESSOA. Não pode dizer "eu mostro", "eu ensino", "eu desenvolvi", "no meu workshop" — isso afirma que ela é o expert/dono do produto, o que é falso.**

### Contexto

Extensão da R2. A R2 cobre o caso óbvio (persona se passar por aluno que teve resultado). A R7 cobre o caso mais sutil: persona se passando pelo próprio dono do produto. Ambos são depoimento/atribuição falsa.

A persona é uma observadora-recomendando — fala do expert em terceira pessoa, no estilo das copies vencedoras (#2, #3 do lote 2 antigo): *"Esse cara que lançou Paulo Vieira...", "Um cara que..."*. Isso preserva autoridade real do dono SEM falsificar atribuição.

Observado em 20/05/2026: roteiro original do Conceito C tinha "Sábado e domingo **eu** mostro como" na voz da Bruna (persona). O Euriler apontou na hora — "ela é UGC, não pode dizer que é ela mesma".

### Exemplo (bom uso)

> "Te falaram que pra crescer no digital você precisa de sócio, lançador, equipe. Mentira. **Esse cara aqui tá provando** que IA faz tudo isso sozinha. **Workshop dele** esse fim de semana."

A persona narra sobre o expert. Terceira pessoa. Aponta pro "cartãozinho" (que vira foto do expert no edit).

### Anti-padrão (PROIBIDO)

> "Te falaram que pra crescer no digital você precisa de sócio, lançador, equipe. Mentira. **Eu vou te mostrar** que IA faz tudo isso sozinha. **No meu workshop** esse fim de semana."

A persona se atribui o conhecimento, o produto e a entrega. **É o expert falando pela boca dela.** Não funciona — quebra a coerência da narrativa UGC e é desonesto sobre quem fez o quê.

### Padrões de copy que funcionam na voz da persona

- Descoberta: *"Tô vendo todo mundo falar desse cara..."*
- Recomendação: *"Esse cara que [credencial real] tá abrindo o jogo sobre [tema]..."*
- Observação: *"Olha tudo que esse cara não paga mais pra ninguém..."*
- Comentário: *"Não sei se você viu, mas esse cara aqui..."*

Sempre 3ª pessoa quando a ação/conhecimento é do expert.

### Quem aplica

- `@estrategista-criativo` — escreve roteiros UGC sempre em 3ª pessoa quando referindo ao expert.
- `@ad-studio-chief` — bloqueia produção se o roteiro UGC tem "eu mostro/ensino/desenvolvi" se atribuindo ao expert.
- `@diretor-persona` — auxilia na avaliação de coerência da fala da persona com a fronteira da R7.

---

## R8 — Mão do gesto ≠ mão do celular

### Enunciado

**Em UGC com persona segurando smartphone, gesto natural (ajeitar cabelo, tucking) DEVE ser feito com a mão LIVRE — NUNCA com a mão que segura o celular. Caso contrário, o Higgsfield gera bug visual de IA (mãos sobrepostas, dedos extras, smartphone "flutuante").**

### Contexto

Observado em 21/05/2026 no lote v2 da Renata: prompt sem especificar duas mãos resultou em vídeo onde ela mexia no cabelo COM a mesma mão do celular — bug visível, mostra que é IA. Euriler rejeitou imediatamente.

### Exemplo (bom uso — prompt)

> "SHE HAS TWO HANDS: ONE hand holds smartphone at her side or chest level. The OTHER hand (the free hand) is the one she uses for any gesture. First frame: she tucks hair using HER FREE HAND ONLY — NEVER the hand holding the smartphone."

### Anti-padrão (PROIBIDO)

> "She holds a smartphone and tucks her hair behind her ear."

Ambíguo. O modelo interpreta que a mesma mão faz tudo. Resultado: bug visual.

### Quem aplica

- `@diretor-persona` — escreve prompts de geração de persona/UGC sempre explicitando "two hands".
- `@operador-higgsfield` — bloqueia disparo se prompt de UGC tem celular sem separar as mãos.

---

## R9 — Celular: tela sempre virada pra ela, nunca pra câmera

### Enunciado

**Quando a persona segura smartphone em UGC, a tela deve estar SEMPRE virada pra ela (away from camera). NUNCA virar a tela pro câmera. Se ela virar o telefone pra "mostrar a tela", o vídeo perde o naturalismo UGC e parece propaganda explícita.**

### Contexto

Observado em 21/05/2026 na Renata v2: prompt sem ancoragem da orientação do celular resultou em vídeo onde ela girava o telefone na frente da câmera mostrando uma tela vazia. Quebra total da naturalidade.

### Exemplo (bom uso — prompt)

> "She holds the smartphone with the SCREEN FACING HERSELF, ANGLED AWAY from the camera AT ALL TIMES — the camera NEVER sees the phone screen. She glances down at the phone occasionally as if reading something to herself."

### Anti-padrão (PROIBIDO)

> "She holds and looks at her phone."

Sem ancoragem, o modelo vira a tela pra câmera (default de modo "showcase product").

### Quem aplica

- `@diretor-persona` — ancora orientação do celular em todos os prompts de UGC.
- `@operador-higgsfield` — bloqueia disparo se a orientação não estiver explícita.

---

## Resumo das regras

| Regra | Enunciado curto |
|-------|-----------------|
| R1 | Hook prende em 3s ou descarta |
| R2 | Avatar de IA não é depoimento de aluno real |
| R3 | Modéstia = gola fechada (Soul abre o resto) |
| R4 | Nunca produzir sem conceito validado |
| R5 | Lote enxuto de teste antes de escalar |
| R6 | Propõe, não decide pelo usuário |
| R7 | Persona UGC fala do expert em 3ª pessoa, nunca como se fosse ele |
| R8 | Mão do gesto ≠ mão do celular (sempre 2 mãos explícitas) |
| R9 | Celular com tela virada pra ela, nunca pra câmera |

Quando duas regras parecem conflitar, a regra de número menor tem prioridade (R1 > R2 > ... > R9).
