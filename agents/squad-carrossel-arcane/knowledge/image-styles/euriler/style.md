# Estilo de Imagem — EURILER

> Template de estilo consumido pelo `@image-director`. Destila o essencial pra reproduzir o estilo do Euriler em qualquer sessao. Para a metodologia completa, ler junto: `../../imagens-padrao-euriler.md` (playbook). Para exemplos calibrados: `examples.md`.

---

## ⭐ REGRA DE OURO (a mais importante)

**Atacar no TETO de ousadia/picancia/especificidade desde a PRIMEIRA versao. Nunca gerar a versao "segura" primeiro.**

O viés natural de quem gera e errar por baixo (metafora segura, tom moderado, universal-elegante). O Euriler quer o oposto: concreto, polarizador, exagerado, especifico-brasileiro, simbolo carregado. A direcao do ajuste dele e SEMPRE pra cima. Na duvida entre duas ideias, escolher a mais ousada. Antes de gerar, perguntar "essa e a versao mais picante possivel, ou da pra subir?". Se da, sobe. Foi isso que separou o 1o carrossel (80%, muito retrabalho) do 2o (acerto de primeira).

---

## Princípio mestre

A imagem **ENCENA a tese do texto como frame de filme** — nunca ilustra literal. Quem ve so a imagem ja sente o argumento. Texto informa; imagem opina/julga. Pergunta geradora: *"qual a emocao-tese deste card, e qual cena — com personagem, ancora real e impacto — faria a pessoa sentir isso em 1 segundo?"*

## Como o Euriler quer sentir o leitor

Informativo MAS carregado de posicionamento — formador de opiniao, nao reporter. Polarizacao forte e traco natural dele (nao suavizar). Urgencia + tensao com respiros de humor/esperanca. Motores: ganancia e medo. O leitor sente que "algo importante esta acontecendo e ele nao sabia".

## As 5 mecânicas

1. **Personificacao do abstrato** — conceito vira corpo/personagem em situacao dramatica. Nunca cena generica de tecnologia.
2. **Emocao visceral + espanto** — sentimento FORTE (o unico proibido e o morno). Paleta inteira: humor, ira, justica/injustica, nojo, medo, tensao, terror, pena, perturbacao, estranheza, deboche, ganancia, ocitocina (familia/futuro).
3. **Ancoras de realidade + simbolos pre-carregados (PRIORIDADE)** — logos e marcas reais; e sempre que houver, simbolos que JA carregam emocao: bandeiras (EUA, China), Trump, Musk, Zuck, Estatua da Liberdade, bomba atomica, fogo, patriotismo. Emocao emprestada — a pessoa sente antes de processar. **Sempre procurar o angulo que ativa um simbolo pronto.**
4. **Rostos como picancia** — famosos reais, o proprio Euriler na cena, ou arquetipos. Rosto = fofoca; sem rosto = conceito. Famoso facialmente iconico (Trump, Tony Robbins, Musk, Zuck) pega no GPT Image so com marcadores faciais fortes na descricao (queixo, sorriso, cabelo); famoso pouco iconico → Nano Banana Pro com foto-referencia. Alvo de satira = arquetipo/figura publica, nunca pessoa comum identificavel.
5. **Exagero + satira-ofensa** contra inimigos de valores (woke, etc) — polarizacao proposital. Alvo e ideia/figura publica, nunca gente comum identificavel.

## Arquitetura do carrossel

- **Card 1 = biggest win.** Compete com o feed inteiro, nao com os outros cards. A ideia mais espantosa do lote vai nele.
- **Variar a emocao card a card** (variacao = retencao). Intensidade nunca esfria.
- **Arco:** sobe tensao → alivia com humor/esperanca → aperta de novo. Fecha solar (esperanca/empoderamento) entregando o leitor quente pro CTA.

## Anti-padrao (o que evitar)

- Imagem abstrata/distante/detalhada demais (pouca identificacao). Preferir **proximo, UM sujeito emocional dominante** ocupando o frame.
- Nuance: "distante" nao e proibido se for **legivel + ancora emocional clara em 1 segundo** (ex.: museu das invencoes). O proibido e o vago/sem ancora.
- Especifico-brasileiro-picante > universal-elegante (ex.: funkeiros na favela vs tech, em vez de rosto dividido generico).
- Fotorrealismo frio sem emocao. Sempre empurrar drama/emocao pro maximo + objeto concreto que ancora (terco = fe; sanduiche cuspido = choque).
- Contraste "real vs copia/clone" sem cravar o vazio. Quando a tese e "a maquina copiou tudo menos X", descrever explicitamente o estado oco da copia (peito apagado, olhos mortos) — senao o modelo embeleza os dois e a tese some.

## Specs técnicas

- **16:9**, ultrarrealista cinematografico (nao pintura conceitual).
- **Personagem recorrente** quando fizer sentido — atravessa cards E posts, vira assinatura visual (ex.: o robo "MYTHOS": gunmetal escuro, olhos azuis, nome no peito + asterisco laranja).
- **Texto na imagem:** entre aspas/ALL CAPS, "must be 100 percent readable". Acento PT erra → corrigir por composicao (PIL), nao regerar. Voz de instituicao estrangeira (ex.: governo americano) pode ficar em ingles de proposito.
- **Dados reais:** pesquisar/confirmar antes de cravar numero/citacao numa peca publica.

## Receita de prompt

Briefing com **direcionamento emocional explicito** ("the viewer should feel X"), nao descricao seca. Emocao entra por: frase de intencao/uso + expressao facial/corporal + iluminacao especifica + detalhe fisico que carrega a emocao. Frases completas, UM sujeito dominante perto da camera.

Estrutura GPT Image 2 (em secoes): `Scene:` / `Subject:` / `Important details:` / `Use case:` (carrega a emocao-intencao) / `Constraints:` (critica — sem ela inventa).

Ver `examples.md` pros prompts reais que funcionaram.
