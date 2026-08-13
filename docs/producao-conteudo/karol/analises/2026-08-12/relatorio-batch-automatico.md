# Relatório de Análise — Batch Automático — Últimos 10 dias — 12/08/2026

> Squad: Conteúdo Arcane (Aria — analista)
> Fonte: `business/instagram/metricas/` — snapshots de 03/08 a 12/08 (coleta automática do workflow instagram-metricas)
> Período coberto: 03/08 05:39 até 11/08 23:22 (~9 dias, ritmo mínimo de 4 posts/dia confirmado pela Karol)
> Escopo pedido pela Karol: "vamos trabalhar com últimos 10 dias" (ajuste do escopo original, que era só desde o relatório de 09/08)

## ⚠️ Limitação de dado conhecida e ACEITA pela Karol (não corrigir manualmente)

A automação só rastreia os **últimos 25 posts** (`N_POSTS=25`). No ritmo de 4+ posts/dia, um post sai dessa janela em 1-2 dias — e a Karol usa **Reels de Teste** (audiência só não-seguidores) antes de republicar pra audiência geral, o que gera 2 entradas pra mesma peça. Quando a perna de "teste" sai da janela antes de eu conseguir capturar (ou antes do post estabilizar), o número fica subestimado.

**Caso confirmado nesse período:** a Karol conferiu no Instagram nativo 2 posts — "Aconteceu comigo, acontece com você" (real: 940 + 1.388 = 2.328 views vs 713 capturado) e "Não existe vida feita de atalhos" (real: 770 + 2.212 = 2.982 views vs 1.954 capturado). **Decisão da Karol: seguir com os números da automação sem correção manual** — ela avalia que isso não muda a leitura estratégica. Trato os números abaixo como **direcionais**, não exatos — principalmente alcance/views de peças com Reels de Teste envolvido. Recomendo ao Ops aumentar a janela de rastreio pra próximos relatórios saírem mais precisos.

## Correção metodológica de pareamento

250 linhas brutas nos 10 snapshots → 109 links únicos → 19 pares teste+republicado identificados (16 deles dentro da janela 03/08-12/08) → **71 peças de conteúdo distintas** no período pedido.

## RANKING (71 peças, por Interação/View) — ordenado decrescente

| # | Peça | Tipo | Views | Int | Int/View | Par? |
|---|---|---|---|---|---|---|
| 1 | "Thiago Nigro não lança sozinho" (CTA "comenta GRUPO") | FEED | 67 | 4 | **5,97%** | não |
| 2 | "Já parou para pensar sobre isso?" | REELS | 1.177 | 63 | **5,35%** | não |
| 3 | "Hoje é um dia muito especial" (Dia dos Pais) | FEED | 652 | 31 | **4,75%** | não |
| 4 | "Aconteceu comigo, acontece com você" (inveja) | REELS | 713 | 29 | **4,07%** | não* |
| 5 | "O problema não é o seu método..." (alho) | REELS | 1.084 | 37 | **3,41%** | sim |
| 6 | "Você também pode ser burro..." (diarista) | REELS | 2.570 | 80 | **3,11%** | sim |
| 7 | "Não existe vida feita de atalhos..." (academia) | REELS | 1.954 | 58 | **2,97%** | não* |
| 8 | "Esse é o maior caos que o empreendedor vive" | REELS | 340 | 10 | 2,94% | sim |
| 9 | "Primeiro faz o que dá, depois melhora" | REELS | 72 | 2 | 2,78% ⚠️ amostra mínima | não |
| 10 | "No passado eu escondia meus lançamentos" | REELS | 111 | 3 | 2,70% ⚠️ amostra mínima | não |
| 11 | "Você tem muito conhecimento pra ficar guardado" | FEED | 40 | 1 | 2,50% ⚠️ amostra mínima | não |
| 12 | "Esse é o motivo de eu não ter assistido ao Rota100k" | REELS | 44 | 1 | 2,27% ⚠️ amostra mínima | não |
| 13 | "Você precisa parar de complicar" | REELS | 177 | 4 | 2,26% | não |
| 14 | "5 anos atrás eu estava estudando pra concurso" | FEED | 188 | 4 | 2,13% | não |
| 15 | "Deixe sua semana produtiva..." | REELS | 472 | 10 | 2,12% | sim |
| 16 | "Sabia que a forma como as pessoas pesquisam" | FEED | 102 | 2 | 1,96% | não |
| 17 | "Você também pensa em desistir todos os dias?" | REELS | 527 | 10 | 1,90% | sim |
| 18 | "Cinco frases que eu repito tanto" | FEED | 55 | 1 | 1,82% | não |
| 19 | "Não quero me sentir iniciante e amadora novamente" | FEED | 113 | 2 | 1,77% | não |
| 20 | "Promessa em cima, comprovação embaixo" | REELS | 177 | 3 | 1,69% | não |
| 21 | "Levei na cabeça, mas ela estava certa" | REELS | 480 | 8 | 1,67% | não |
| 22 | "Você está olhando do jeito errado" | REELS | 122 | 2 | 1,64% | não |
| 23 | "Influencers estão desistindo de parceria paga" | FEED | 67 | 1 | 1,49% | não |
| 24 | "A OpenAI já lançou plataforma de anúncio" | FEED | 68 | 1 | 1,47% | não |
| 25 | "Eu comprei o curso dele e não assisti nenhuma aula" | REELS | 142 | 2 | 1,41% | não |
| 26 | "Antes de fechar a semana, faz esse exercício" | FEED | 73 | 1 | 1,37% | não |
| 27 | "Não poste conteúdo aleatório no digital" | REELS | 79 | 1 | 1,27% | não |
| 28 | "Você se engana o tempo inteiro" | REELS | 400 | 5 | 1,25% | sim |
| 29 | "Não é sobre desacreditar de ninguém" | REELS | 325 | 4 | 1,23% | sim |
| 30 | "Ninguém te conta que o prazo depende" | REELS | 162 | 2 | 1,23% | não |
| 31 | "Há erros invisíveis que fazem seu cliente não fechar" | REELS | 162 | 2 | 1,23% | não |
| 32 | "Levei anos pra contar minha própria história" | REELS | 188 | 2 | 1,06% | não |
| 33 | "Você já sabe o suficiente pra começar" | REELS | 96 | 1 | 1,04% | não |
| 34 | (sem legenda) | REELS | 236 | 2 | 0,85% | não |
| 35 | "Ontem alguém me perguntou a diferença..." | FEED | 120 | 1 | 0,83% | não |
| 36 | "Maíra Cardi foi processada duas vezes" | FEED | 1.839 | 15 | 0,82% | não |
| 37 | "Toda vez que mostro um método pronto" | REELS | 392 | 3 | 0,77% | sim |
| 38 | "Lançamento é pra quem já tem audiência" | REELS | 394 | 3 | 0,76% | sim |
| 39 | "Tá tudo errado!" | REELS | 142 | 1 | 0,70% | não |
| 40 | "Acompanhamento e suporte diferencial" | REELS | 145 | 1 | 0,69% | não |
| 41 | "Concorrência não é o que trava quem ensina" | REELS | 149 | 1 | 0,67% | não |
| 42 | "Há 6 anos eu tentei lançar sem clareza" | REELS | 156 | 1 | 0,64% | não |
| 43 | "Já fui tentada a fazer do jeito rápido" | REELS | 156 | 1 | 0,64% | não |
| 44 | "Diplomas não pagam boletos no digital" | REELS | 163 | 1 | 0,61% | não |
| 45 | "Essa pergunta me pegou..." | REELS | 167 | 1 | 0,60% | não |
| 46 | "Esse conteúdo NÃO é sobre dieta" | REELS | 173 | 1 | 0,58% | não |
| 47 | "Fracassar é o último passo de quem desistiu" | REELS | 183 | 1 | 0,55% | não |
| 48 | "O passo 1 que quase todo mundo pula" | REELS | 385 | 2 | 0,52% | sim |
| 49 | "Adiar a primeira venda até 'estar pronta'" | REELS | 224 | 1 | 0,45% | não |
| 50 | "Ele é F0d@ e eu dou f0d1nh@ 😂" | REELS | 231 | 1 | 0,43% | não |
| 51 | "Você acha que precisa terminar o produto sozinha" | REELS | 237 | 1 | 0,42% | não |
| 52 | "Já ganhei aluno porque ele fez essas perguntas" | REELS | 248 | 1 | 0,40% | sim |
| 53 | "Testei fechar meu primeiro produto sozinha" | REELS | 300 | 1 | 0,33% | sim |
| 54 | "Seu problema não é marketing, é clareza" | REELS | 364 | 1 | 0,27% | sim |
| 55 | "Você já fez essa pergunta desconfortável?" | REELS | 357 | 0 | 0% | sim |
| 56 | "Vejo isso toda semana: profissional com trajetória" | REELS | 303 | 0 | 0% | sim |
| 57 | "Esses são os 5 passos pra criar seu método" | REELS | 279 | 0 | 0% | sim |
| 58 | "Amanhã é dia de LIVE Expert360" | REELS | 22 | 0 | 0% | não |
| 59 | "5 sinais de que você tá vendendo curso genérico" | FEED | 24 | 0 | 0% | não |
| 60 | "A dificuldade? Clareza da persona e suas dores" | REELS | 86 | 0 | 0% | não |
| 61 | "Prontidão não é um estado que chega antes" | FEED | 34 | 0 | 0% | não |
| 62 | "Esse conselho não é mentira" | REELS | 144 | 0 | 0% | não |
| 63 | "Todo aluno que chega até mim quer o método completo" | FEED | 32 | 0 | 0% | não |
| 64 | "Não tinha os pré-requisitos, mas paguei R$50k" | REELS | 93 | 0 | 0% | não |
| 65 | "Escolham bons pais!♥️" | REELS | 155 | 0 | 0% | não |
| 66 | "Nossa live sobre criação de produtos" | REELS | 23 | 0 | 0% | não |
| 67 | "Não crie conteúdo sem definir sua persona" | REELS | 53 | 0 | 0% | não |
| 68 | "Se acha isso, está achando errado" | REELS | 82 | 0 | 0% | não |
| 69 | "Eu sempre falei isso: não grave seu curso antes" | FEED | 30 | 0 | 0% | não |
| 70 | "Parar de aprender só para saber" | REELS | 76 | 0 | 0% | não |
| 71 | "Seu método é moldado por fracassos" | REELS | 107 | 0 | 0% | não |

*Peças #4 e #7 têm perna de Reels de Teste não capturada pela automação — número real de views é maior (ver ressalva no topo). Ranking por % ainda é válido como referência relativa, mas a posição desses 2 no topo é, na prática, ainda mais forte do que os números mostram.

**Zero-interação: 17 de 71 peças = 24%** — estável com os relatórios anteriores (25-26%).

## FORMATOS (média ponderada por volume — total interações ÷ total views)

- **REELS** (55 peças, 17.799 views totais): **2,05%** Int/View
- **FEED** (16 peças, 3.504 views totais): **1,83%** Int/View

Praticamente empatado nos 10 dias — REELS levemente à frente, mas sem folga clara. Isso **contradiz o achado do relatório anterior** (batch de 2,5 dias, que tinha visto FEED muito acima) — aquele resultado era artefato de amostra pequena (só 6 FEEDs, 2 deles outliers de conteúdo pessoal/CTA). Com 71 peças, o sinal mais confiável é: **formato pesa pouco, tipo de conteúdo pesa muito.**

## ACHADO CENTRAL — o padrão que a Karol já tinha percebido, confirmado com mais dado

Karol identificou por conta própria 4 posts fora da curva, todos com a mesma estrutura: **história/causo real contado informalmente (andando, dirigindo, na cozinha) + moral de negócio no final.** Olhando o TOP 8 do período inteiro, **5 dos 8 batem exatamente nesse padrão**:

- #2 "Já parou para pensar sobre isso?" — REELS, 5,35%
- #4 "Aconteceu comigo, acontece com você" (inveja na academia) — REELS, 4,07%
- #5 "O problema não é o seu método" (causo do alho descascado) — REELS, 3,41%
- #6 "Você também pode ser burro" (causo da diarista) — REELS, 3,11%
- #7 "Não existe vida feita de atalhos" (causo da academia) — REELS, 2,97%

Isso não é mais amostra de 4 — é **5 de 8 top performers em 71 peças analisadas**. Padrão real, não coincidência.

**Contraponto que a Karol trouxe e que os dados confirmam:** interação (comentário) não acompanha esse padrão de forma consistente — só "Você também pode ser burro" teve volume de comentário relevante (visto em relatório anterior: 10). Os outros 4 do padrão tiveram comentário zero ou quase zero. E seguidores da conta ficaram estáveis o mês inteiro (6.803 → 6.827, dentro do ruído normal) independente de qual desses posts saiu.

**Leitura estratégica:** esse formato entrega Métrica 1 e 2 do Método Audience (hook + retenção/atenção) de forma consistente — é a melhor ferramenta de alcance que a conta tem hoje. Mas não está fechando o ciclo pra Métrica 3 (interação → posicionamento). São objetivos diferentes, e vale tratar como 2 apostas separadas, não uma só.

## RETENÇÃO 3s (só disponível pra posts de 09/08 em diante — ~40 Reels da janela)

Reaproveitando o achado do relatório anterior (fórmula `100% − skip_rate` validada contra Insights nativo, 86% real vs 84,4% calculado): a maioria dos Reels do período recente continua abaixo do threshold de 50% retenção nos 3s. O post #7 ("Não existe vida feita de atalhos") segue como exceção clara — 84% de retenção, muito acima da média.

## LAPIDAÇÃO 80/20 SUGERIDA

- 80%: dobrar a aposta no formato "causo real contado informalmente + moral de negócio" — 5 dos 8 melhores posts dos últimos 9 dias
- 20%: testar CTA de comentário explícito dentro desse formato (como fez em "Thiago Nigro", que também performou bem) — pra tentar somar Métrica 1+2 (alcance) com Métrica 3 (interação), que hoje não estão andando juntas

## 2 FORMAS DE ESCALAR (Elias)

### Escalar FORMATO (causo informal + moral de negócio)
1. Mais causos do dia a dia (filho, trânsito, compras, atendimento) que terminem em lição sobre método/posicionamento
2. Testar o mesmo formato COM CTA de comentário no final (hoje nenhum dos 5 top desse padrão pede comentário)
3. Testar gravando em cenário informal mesmo em temas mais técnicos (ver observação da Karol: escritório à tarde arrumada nunca performou bem)

### Escalar ASSUNTO (bastidor real / processo sem atalho)
1. "O que eu fiz diferente da segunda vez que lancei"
2. "Comparação: meu primeiro produto vs o que eu venderia hoje"
3. "Erros que só quem já testou sozinho comete"

## REAPROVEITAMENTO

- Os 5 posts do padrão "causo informal" → candidatos a **carrossel** (expandir a história + a lição em slides) — testar se o formato estático também retém nesse estilo
- Família "pergunta retórica sobre processo de criar produto" (Testei fechar sozinha / Já ganhei aluno / O passo 1) → 4-5 tentativas com retenção e interação fracas — **pausar esse ângulo específico** por um tempo

## INSIGHTS PRA IRIS (pool de temas)

- Tema/formato validado com amostra boa agora (5 posts, 9 dias): "causo pessoal informal → lição de negócio" — vale ampliar o pool nesse ângulo
- Comentário-texto segue escasso — sem dado suficiente pra extrair tema novo direto de dúvida de audiência

## INSIGHTS PRA RICO (próximos roteiros)

- Formato "causo informal + moral" é a aposta mais validada da conta agora — mas testar variação COM CTA de comentário, já que interação não está vindo de graça nesse formato
- Evitar repetir a família "pergunta retórica sobre processo de criar produto sozinha" — 4-5 tentativas, performance fraca em todas
- Nenhum post gravado no escritório à tarde performou bem nesse período — vale testar deslocar conteúdo técnico/direto pra formato carrossel em vez de Reels gravado nesse cenário

## RECOMENDAÇÃO ESTRATÉGICA

**PRIORIDADE 1** — Formato "causo informal + moral de negócio" é a aposta mais forte e validada (5 dos 8 melhores posts em 71 peças / 9 dias). Produzir mais nesse estilo.

**PRIORIDADE 2** — Esse formato ganha atenção mas não interação/seguidor de forma consistente. Testar variações com CTA de comentário explícito pra tentar fechar o ciclo.

**PRIORIDADE 3** — Pausar a família "pergunta retórica sobre processo de criar produto sozinha" — 4-5 tentativas com performance fraca.

**PRIORIDADE 4** — Sinalizar pro Ops aumentar a janela de rastreio da automação (`N_POSTS` no script) — no ritmo atual de 4+ posts/dia, peças com Reels de Teste saem da janela antes de estabilizar, subestimando alcance real.

**PRIORIDADE 5** — Comentário-texto continua escasso. Sem isso, segue sem confirmar sinal qualitativo real de audiência.

> Aria gera análise. Karol decide o que executar.
