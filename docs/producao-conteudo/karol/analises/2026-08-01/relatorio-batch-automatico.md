# Relatório de Análise — Batch Automático — 01/08/2026

> Squad: Conteúdo Arcane (Aria — analista)
> Fonte: `business/instagram/metricas/2026-07-31.md` (coleta automática, snapshot 08:50 BRT de 31/07)
> Período coberto: 27/07 13:53 até 30/07 19:15 (18 publicações → 15 peças de conteúdo distintas, ver correção abaixo)
> Ainda não existe coleta de 01/08 no repo no momento desta análise — cron roda 07h BRT, pode não ter processado ainda.

## ⚠️ Limite do dado

A coleta automática traz Alcance, Views, Curtidas, Comentários, Saves, Shares e Interações (lifetime), mas **não traz Taxa após 3s nem Tempo Médio de Visualização** — dependem de print manual do Insights. Diagnóstico cirúrgico fica restrito à **Métrica 3 (Interação/View)**.

## ⚠️ CORREÇÃO (feita com a Karol, 01/08)

A 1ª versão deste relatório tratou 3 pares de vídeo com legenda idêntica como publicações separadas concorrendo entre si. Karol esclareceu: ela publica na **aba Reels de Teste** (audiência só não-seguidores) e, quando o teste vai bem, clica em **"republicar"** — isso gera uma 2ª entrada pro mesmo conteúdo, só que pra audiência geral. **São a mesma peça, não dois posts.** Análise refeita somando os dois números (Views + Interações) de cada par:

- "Toda vez é uma luta para voltar" (27/07 22:30 + 23:05) → Views 358, Interações 6
- "Vivemos na linha tênue..." (29/07 12:24 + 12:26) → Views 268, Interações 3
- "Muitas vezes o seu método está travado por excesso" (29/07 22:42 + 22:45) → Views 230, Interações 0

**18 publicações → 15 peças de conteúdo distintas.** Tabela e conclusões abaixo já refletem essa correção.

## POSTS DO PERÍODO (15 peças, ranking por Interação/View)

| Post | Tipo | Views | Interações | Interação/View |
|---|---|---|---|---|
| 27/07 13:53 — "Até o mercado de lançamento..." | FEED | 124 | 8 | ~~6,45%~~ ⚠️ ver nota |
| 30/07 16:00 — "Meu julho no OFFLINE ♥️" | REELS | 208 | 12 | 5,77% |
| 28/07 09:15 — "O estudo não é mais a saída. A ação é." | REELS | 143 | 5 | 3,50% |
| "Toda vez é uma luta para voltar" (teste+republicado) | REELS | 358 | 6 | 1,68% |
| 29/07 13:20 — "Um resort pode ter investido 214 milhões..." | FEED | 146 | 2 | 1,37% |
| "Vivemos na linha tênue..." (teste+republicado) | REELS | 268 | 3 | 1,12% |
| 29/07 18:35 — "Aqui no digital você tem que aprender a viver no limite..." | REELS | 165 | 1 | 0,61% |
| 30/07 13:19 — "O mercado de circo estava saturado..." | FEED | 264 | 1 | 0,38% |
| "Muitas vezes o seu método está travado..." (teste+republicado) | REELS | 230 | 0 | 0% |
| 29/07 22:04 — "Inúmeros especialistas estão travados..." | REELS | 109 | 0 | 0% |
| 29/07 23:14 — "Você reclama, mas não faz a sua parte..." | REELS | 70 | 0 | 0% |
| 30/07 09:18 — "Thalita Maia viu um padrão de procrastinação..." | REELS | 72 | 0 | 0% |
| 30/07 15:08 — "O que você aprendeu em Julho?" | REELS | 16 | 0 | 0% |
| 30/07 15:28 — "Esquece essa ideia, por enquanto." | REELS | 30 | 0 | 0% |
| 30/07 19:15 — "Enquanto fizer como a Iza..." | REELS | 38 | 0 | 0% |

**⚠️ Nota — "Até o mercado de lançamento...":** Karol confirmou que os 3 comentários são do **mesmo designer** que já apareceu no relatório de 27/07 tentando vender serviço de design/social media — é social selling, não lead. **Esse post sai da corrida de melhor do batch**, igual aconteceu com "A única saída é a ação" no relatório passado. Padrão se repetindo: 2 relatórios seguidos, o post com maior Interação/View tinha comentário contaminado por prestador de serviço comercial, não audiência real.

## ACHADO CENTRAL

**Zero comentário real de audiência segue de pé.** Contando os 3 relatórios (20/07, 27/07, 01/08), ainda não apareceu nenhum comentário confirmado de lead/audiência-alvo em conteúdo de negócio — todos os comentários que surgiram foram invalidados (spam comercial ou assunto pessoal fora do nicho). Esse é o achado mais consistente e mais sério da série: não é falta de "molde certo", é ausência de reação de comentário da persona em qualquer formato testado até agora.

**Taxa de zero-interação:** 7 de 15 peças (47%) zeraram interação total — segue alto, no mesmo patamar do relatório anterior (27% → esse fica em 47%, mas a base de comparação mudou com a correção; olhando peça a peça, a maioria das REELS "solo" sem contexto pessoal ficou em zero).

**Conteúdo pessoal segue confirmando o padrão dos relatórios anteriores:** "Meu julho no OFFLINE" (relato de férias) é a 2ª melhor peça do batch com 5,77% — sem comentário, só curtida/share, igual "café da manhã no hotel" e "jornada de emagrecimento" nos relatórios passados. Engaja, mas não é conteúdo de negócio/posicionamento.

**Reels de Teste + republicar:** os 3 pares confirmam que o recurso está sendo usado ativamente. Nenhum dos 3 bateu threshold forte depois de somado (melhor foi 1,68%), mas a amostra ainda é pequena (3 pares) pra dizer se o recurso em si ajuda ou não — o valor dele parece ser mais "testar sem arriscar alcance geral" do que "garantir performance".

## FORMATOS

FEED (3 peças, excluindo a contaminada da comparação de "melhor"): 1,37% / 0,38% — média ~0,87% nas 2 limpas
REELS (12 peças): média ~1,06%

Sem diferença clara de formato nesse batch — amostra pequena demais (o relatório de 27/07 achou REELS melhor, esse fica praticamente empatado). Ainda não dá pra declarar formato campeão com confiança.

## RECOMENDAÇÃO ESTRATÉGICA

**PRIORIDADE 1 — O problema não é formato nem hook, é ausência de comentário de audiência real.** 3 relatórios seguidos (20/07, 27/07, 01/08) sem um único comentário confirmado de lead em conteúdo de negócio. Vale considerar testar CTA mais direto pedindo comentário específico (pergunta, não afirmação fechada) — é a única variável ainda não testada sistematicamente.

**PRIORIDADE 2 — Conteúdo pessoal segue sendo o que mais engaja, mas não converte pra conversa de negócio.** 3 relatórios seguidos com o mesmo padrão (café da manhã, jornada de emagrecimento, julho no offline). Serve pra alcance/humanização, não pra posicionamento — não usar como referência de roteiro pro Rico.

**PRIORIDADE 3 — Vale bloquear/silenciar o designer que comenta pra social selling?** Já apareceu 2x distorcendo a leitura de métrica em 2 relatórios seguidos. Não é decisão de conteúdo, mas afeta diretamente a confiabilidade dos meus relatórios — toda vez que aparece um comentário, preciso confirmar com voce se é real antes de usar como sinal positivo.

## Insights pra Iris (pool de temas)

Sem dado de comentário qualitativo real nesse batch (os únicos comentários foram invalidados). Nada novo pra alimentar o pool a partir de comentário — segue sendo limitação da coleta automática (não traz texto).

## Insights pra Rico (próximos roteiros)

Testar CTA que peça comentário específico e direto (pergunta fechada tipo "comenta X se Y") no próximo roteiro de negócio/posicionamento — é a variável que ainda não foi tentada nos últimos 3 batches e pode ser o que falta pra gerar comentário real de audiência.

> Aria gera análise. Karol decide o que executar.
