# Relatório Aria — Batch últimos 10 dias (02/09 a 12/09/2026)

> Squad: Conteúdo Arcane (Aria — analista)
> Fonte: `business/instagram/metricas/2026-09-12.md` (janela lifetime, 113 posts, 02/09 22:57 a 12/09 10:00) + `business/instagram/metricas/historico-conta.csv` (conta, mesmo período) + `business/instagram/metricas/comentarios/2026-09-02.json` a `2026-09-12.json`.
> Pedido pela Karol (12/09): "analise a performance dos últimos 10 dias com base nas métricas".
> Antecessor: `analises/2026-09-03/relatorio-semana04-desafio-rota100k.md` (Semana04, 24-30/08).

## Período e volume

113 publicações em 10 dias — **102 Reels + 11 Feed**. Cruzando legendas: **84 peças únicas** (73 Reels + 11 Feed), das quais **29 saíram em dupla publicação** (mesmo Reel postado 2x na janela).

**Confirmado pela Karol (12/09): não é bug.** Estratégia deliberada — cada peça vai pro Feed **e** como "Reels de teste" (recurso do Instagram que testa a peça com não-seguidores antes/à parte da distribuição normal). Ela aproveita o teste justamente porque ele alcança gente fora da base de seguidores. **A partir daqui, os números abaixo somam as duas publicações de cada peça duplicada** — trato como 1 peça de conteúdo com alcance combinado, não como 2 eventos separados.

## RETENÇÃO 3s (100% − skip rate, por peça única — dupla publicação somada)

| Métrica | Valor |
|---|---|
| Peças únicas de Reels com dado de skip rate | 73 |
| Acima de 50% (threshold) | 17/73 = **23,3%** |
| Retenção média simples | 39,3% |
| Retenção ponderada por views | 63,5% |

**Diagnóstico:** GANCHO segue sendo o gargalo estrutural — mesma leitura das 3 semanas anteriores (20,3% → 26,7% → 29,7% → agora 23,3% por peça). Calculado por peça (feed+teste somados), o número fica pior que a leitura bruta por publicação (28,4%), porque juntar as duas exibições de uma peça fraca não muda o problema — só reflete o alcance real dela dobrado. A melhora que vinha semana a semana **parou de avançar** nesses 10 dias. A retenção ponderada por views (63,5%) segue bem mais alta que a simples porque as poucas peças com muita visualização também têm retenção boa — quando o hook funciona, funciona bem; o problema é que isso é minoria.

Por dia (retenção média e quantos bateram 50%):

| Dia | Posts | Views totais | Retenção média | Acima 50% |
|---|---|---|---|---|
| 02/09 | 6 | 338 | 30,7% | 0/5 |
| 03/09 | 12 | 425 | 42,8% | 3/11 |
| 04/09 | 10 | 918 | 32,8% | 2/9 |
| 05/09 | 12 | 1498 | 41,2% | 3/10 |
| 06/09 | 8 | 521 | 39,4% | 2/8 |
| 07/09 | 14 | 3120 | 42,3% | 5/12 |
| 08/09 | 11 | 793 | 38,8% | 4/10 |
| 09/09 | 15 | 5657 | 43,8% | 6/15 |
| 10/09 | 8 | 789 | 38,2% | 1/6 |
| 11/09 | 11 | 437 | 26,3% | 0/10 |
| 12/09 | 6 | 404 | 60,0%* | 3/6 |

*12/09 tem só 6 posts (dia parcial na coleta) — amostra pequena, não bater o sino ainda.

## TEMPO MÉDIO — limitação de dado

A tabela traz "tempo médio" em milissegundos absolutos, não em % da duração — e não tenho a duração de cada Reel pra calcular o percentual do Método Audience (threshold 25-30%). **Não vou inventar essa conversão.** O que dá pra ver, comparando os valores absolutos: os posts de maior alcance (ex. "instabilidade financeira", 6449ms/6,4s; "currículo forte", tempo não capturado nessa linha) não têm tempo médio muito destoante dos posts de baixo alcance — não parece ser o gargalo principal aqui. Se quiser esse dado fechado, preciso da duração de cada vídeo (dá pra pegar no Insights nativo por post, ou eu posso tentar cruzar pelo Cloudinary se as URLs originais dos vídeos estiverem em algum manifest).

## INTERAÇÃO POR VISUALIZAÇÃO

| Métrica | Valor |
|---|---|
| Total views (113 publicações, mesmo total somado) | 14.900 |
| Total interações | 215 |
| Int/View ponderado | **1,44%** |
| Zero-interação (por peça única, 84 peças) | 33/84 = **39,3%** |
| Total comentários reais | **2** (ambos no mesmo Reel, "O mundo é dos rasos") |

Por peça única o zero-interação fica menor que a leitura bruta por publicação (49,6%) — faz sentido: uma peça com duas exibições tem duas chances de gerar reação. Ainda assim quase 4 em cada 10 peças não geraram nenhuma curtida/comentário/save/share somando as duas publicações.

**Diagnóstico:** threshold de viralização é >10% — estamos muito abaixo, igual às semanas anteriores. Comparando com o histórico corrigido:

| Janela | Int/View ponderado | Zero-interação |
|---|---|---|
| Semana02 (10-16/08) | 1,29% | 31,9% |
| Semana03 (17-23/08) | 1,32% | 27,3% |
| Semana04 (24-30/08) | 0,75% | 43,7% |
| **Últimos 10 dias (02-12/09)** | **1,44%** | **49,6%** |

Interação ponderada voltou a subir (acima até da Semana03), mas isso é puxado por pouquíssimos posts fortes — a proporção de posts com ZERO interação nunca foi tão alta (quase metade). É consistente com o volume de republicações: quando o mesmo vídeo sai várias vezes, a segunda/terceira exibição tende a não gerar interação nova (quem já viu, já reagiu ou já ignorou).

Comentários reais: só 2 em 10 dias, os dois no mesmo Reel ("O mundo é dos rasos... e já saem criticando"), um deles é resposta da própria Karol. Zero pergunta nova de audiência pra alimentar a Iris nesse período — mesmo achado dos relatórios anteriores.

## TOP 10 por alcance (VIEWS, peça única — dupla publicação somada)

| Peça | Publicações | Views (somado) | Retenção 3s | Int/View |
|---|---|---|---|---|
| "Eu tinha currículo forte: quinze anos entre gestão, auditoria..." | 2x | 2604 | 73,4% | 0,96% |
| "Toda vez que a instabilidade financeira apertou, eu aceitei um projeto errado..." | 1x | 2491 | 78,1% | 1,73% |
| "Se preparar mais um pouco parece inteligente..." | 2x | 1361 | 69,9% | 1,18% |
| "Independência não é só a data de hoje..." | 1x | 1307 | 68,7% | 1,07% |
| "E tem um povo na intersecção dos dois lados kkkkk. Qual é o seu?" | 1x | 786 | 71,6% | 1,02% |
| "Aqui não tem promessa milagrosa: validação vem antes de escala" | 1x | 544 | 69,2% | 1,47% |
| "Quem tá doido, eu ou eles?" | 1x | 443 | 75,5% | 1,58% |
| "O mundo é dos rasos. Ninguém consegue chegar no final..." | 1x | 289 | 58,7% | **3,46%** |
| "Grave, escute, teste com alguém e anote o que a pessoa entendeu..." | 2x | 237 | 48,9% | 2,53% |
| "Ordem errada ❌ Ordem cooreta✅me segue" | 1x | 222 | 79,2% | 0,00% |

**Padrão claro:** as peças de topo têm retenção 3s acima de 68% (com exceção pontual de "Grave, escute..." em 48,9%) — bem acima do threshold de 50% e muito acima da média geral (23,3%). O que as une:
- **Causo pessoal/vulnerável** ("instabilidade financeira", "currículo forte", "independência", "aqui não tem promessa milagrosa") — mesmo padrão já identificado em `analises/2026-07-28/hipotese-audiencia-vs-consistencia.md` e no relatório de 03/09: causo real > roteiro de método abstrato.
- **Frase curta e provocativa** ("Quem tá doido, eu ou eles?", "E tem um povo na intersecção...") — gancho direto, sem preâmbulo.
- **"O mundo é dos rasos"** é o único do top 10 com interação de verdade (3,46%, os únicos 2 comentários da janela) — conteúdo com polêmica leve ("ninguém consegue chegar no final... e já saem criticando") gerou reação. Vale estudar esse como modelo de CTA/polêmica, não só de hook.

## BOTTOM (views mais baixas, ≥10 views pra evitar ruído de amostra ínfima)

Maioria com retenção 3s abaixo de 45% e ganchos genéricos/instrucionais ("Como eu fiz a escolha entre 2 boas alternativas", "Não tem jeito de se aprofundar no digital") — mesmo padrão de gancho fraco já visto nas semanas anteriores (dia "não tenho seguidores" da Semana04).

## CONTA (10 dias)

- Seguidores: 6833 (02/09) → 6832 (12/09) — estável, oscilando 6826-6833.
- Alcance diário médio: **~1677/dia** — abaixo da Semana04 (~2246/dia) e bem abaixo da Semana03 (~2646/dia). Reach seguindo em queda, não em recuperação.

## 2 FORMAS DE ESCALAR (Elias)

**Escalar FORMATO — sim, mesmo vencedor de sempre:** causo pessoal/vulnerável em 1ª pessoa, sem jargão de método, abrindo com uma confissão ou virada real. 6 dos 8 melhores da janela usam essa textura. Vale priorizar esse tipo de abertura nos horários de maior alcance histórico (parece ser 08h e por volta de 16h-17h, onde caíram os posts-âncora desta janela).

**Escalar ASSUNTO — trajetória profissional dela (auditoria/gestão/planejamento, 15 anos) é tema com tração real** — apareceu 2x no top e é parte documentada da história real da Karol (não é invenção — bate com a trajetória profissional registrada). Vale desdobrar em mais ângulos sem repetir a mesma peça.

## REAPROVEITAMENTO

- "Toda vez que a instabilidade financeira apertou..." (2491 views, melhor da janela) — candidato a virar Carrossel expandindo a história em passos, ou anúncio se ela quiser usar pra oferta de posicionamento/autoridade.
- "O mundo é dos rasos" (única com comentário real) — vale um post-filho puxando o fio da polêmica ("por que as pessoas comentam sem assistir até o fim?").

## INSIGHTS DOS COMENTÁRIOS

Amostra praticamente vazia (2 comentários em 10 dias, ambos no mesmo Reel, sem pergunta nova de audiência). Não tenho dúvida real pra mandar pra Iris atualizar o pool. Se quiser gerar sinal de comentário, os relatórios anteriores já sugeriram testar 1 post com CTA de pergunta direta — ainda não foi testado nesses 10 dias (nenhum comentário fora do "opinadores de manchetes" espontâneo).

## RECOMENDAÇÕES ESTRATÉGICAS

1. **Retenção 3s parou de melhorar (23,3% por peça, pior que a leitura bruta e sem avanço desde a Semana04).** Gancho continua sendo o gargalo crônico — as poucas peças que resolvem isso (causo pessoal, frase curta e provocativa) seguem sendo exceção, não regra.
2. **Zero-interação em quase 4 de cada 10 peças (39,3%), mesmo somando feed + teste.** Testar CTA de pergunta direta (como "O mundo é dos rasos" fez sem querer, com a polêmica leve) em pelo menos 1 peça por dia pra ver se muda o padrão de zero-comentário.
3. **Alcance diário em queda contínua há 3 janelas seguidas** (2646 → 2246 → 1677/dia), mesmo com a estratégia de feed+teste ativa. Isso é independente da duplicação (é métrica de conta, já soma tudo) — o gargalo é gancho, não falta de tentativa de distribuição.
4. **Vale medir teste vs feed separadamente numa próxima rodada** — hoje a coleta não distingue qual das duas publicações de cada peça é o "Reels de teste" e qual é o feed normal (ambas vêm marcadas REELS no dado bruto). Se quiser saber se o teste realmente entrega incremental sobre o feed sozinho, dá pra pedir esse split — mas não é possível montar isso com o dado que já tenho.

Você decide o que priorizar. Quer que eu encaminhe o padrão de hook campeão (causo pessoal + frase curta) pro Rico usar no próximo roteiro?
