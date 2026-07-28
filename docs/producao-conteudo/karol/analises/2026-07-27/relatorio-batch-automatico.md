# Relatório de Análise — Batch Automático — 27/07/2026

> Squad: Conteúdo Arcane (Aria — analista)
> Fonte: `business/instagram/metricas/2026-07-27.md` (coleta automática, snapshot 09:46 BRT)
> Período coberto: 20/07 15:15 a 27/07 08:59 (25 posts — janela nova, sem sobreposição com o relatório anterior de 20/07 que cobriu 11-16/07)

## ⚠️ Limite do dado

Mesma limitação já registrada em 20/07: a coleta automática traz Alcance, Views, Curtidas, Comentários, Saves, Shares e Interações (lifetime), mas **não traz Taxa após 3s nem Tempo Médio de Visualização** por post — essas duas métricas do Método Audience ainda dependem de print manual do Insights. Relatório cirúrgico na **Métrica 3 (Interação/View)**.

**⚠️ CORREÇÃO (feita com a Karol, 27/07):** a 1ª versão deste relatório tratou 10 dos 25 posts como "reposts" comparáveis ao resto do batch. Karol esclareceu que são **Reels de Teste** — recurso nativo do Instagram que publica o Reel só pra audiência de **não-seguidores**, pra testar antes de decidir liberar geral. Não é o mesmo tipo de distribuição dos posts normais (que alcançam seguidores + explore), então **não é justo comparar contra o threshold de 10%** nem misturar com o resto do batch. Análise refeita separando os dois grupos.

## GRUPO A — Posts normais (15 de 25)

| Post (data/hora) | Tipo | Views | Interações | Interação/View |
|---|---|---|---|---|
| 24/07 09:17 — "A única saída é a ação" | REELS | 145 | 7 | ~~4,83%~~ ⚠️ ver nota |
| 26/07 12:58 — "matéria de mercado confirmou" | FEED | 73 | 2 | 2,74% |
| 25/07 09:35 — "acordei mais cedo, último dia" | REELS | 347 | 7 | 2,02% |
| 21/07 14:18 — "não é a praia" | FEED | 1.214 | 22 | 1,81% |
| 23/07 13:20 — "Duas pessoas, mesmo diploma" | FEED | 387 | 5 | 1,29% |
| 22/07 09:01 — "vende ativamente ou se esconde" | REELS | 98 | 1 | 1,02% |
| 23/07 09:50 — "Carol reencontrou" (depoimento) | REELS | 122 | 1 | 0,82% |
| 20/07 15:15 — "As últimas serão as primeiras" | REELS | 1.119 | 9 | 0,80% ⚠️ ver nota |
| 22/07 13:18 — "prometeu ensinar inglês, R$6mi" | FEED | 324 | 2 | 0,62% |
| 20/07 19:35 — "aparecer no digital é vaidade" | REELS | 161 | 1 | 0,62% |
| 21/07 14:28 — "Dei muita risada dessa guerra" | REELS | 1.204 | 5 | 0,42% |
| 27/07 08:59 — "energia mental é recurso finito" | REELS | 18 | 0 | 0% |
| 25/07 12:54 — "mídia deu nome ao que eu ensino" | FEED | 169 | 0 | 0% |
| 25/07 08:55 — "Entregar de graça não valida oferta" | REELS | 95 | 0 | 0% |
| 21/07 09:01 — "sims que parecem oportunidades" | REELS | 109 | 0 | 0% |

**⚠️ Nota (Karol, 27/07):** os 4 comentários de "A única saída é a ação" não são de lead — pelo menos 1 é de um prestador de serviço tentando vender design/social media pra Karol. Os 4,83% de Interação/View estão contaminados por engajamento comercial, não audiência real. **Esse post sai da corrida de "melhor do grupo"** — a métrica automática conta quantidade de comentário, não quem comentou, então não dá pra confiar nela sozinha quando o volume absoluto é baixo (aqui, só 4 comentários — 1 comentário fora do público já muda o resultado em >1 ponto percentual).

**⚠️ Nota 2 (Karol, 28/07):** os 2 comentários de "As últimas serão as primeiras" (0,80%) também não são de audiência da persona — o post é sobre a jornada pessoal de emagrecimento da Karol, assunto que ela vem documentando à parte, sem conexão com método/produto/posicionamento. Mesmo padrão do café da manhã: engaja como conteúdo pessoal, não como conteúdo de negócio.

**Achado central desse batch:** dos 15 posts do Grupo A, só 2 tiveram comentário — e nenhum dos 2 é comentário relevante (1 é spam comercial, o outro é sobre um assunto pessoal fora do nicho). Ou seja, **nenhum post de conteúdo de negócio/posicionamento gerou comentário de audiência real nesse período inteiro (20-27/07)**. Os outros 13 posts do Grupo A tiveram ZERO comentário. Isso é mais sério do que "não achei o molde certo" — é sinal de que o conteúdo de negócio não está gerando conversa com a persona-alvo, ponto.

4 de 15 (27%) zeraram interação total (curtida+comentário+save+share) — ainda alto, mas menor que os 30% do relatório de 20/07 (que usava a amostra errada, com os Reels de Teste misturados). Os zeros são afirmação/pergunta retórica sem cena pessoal: "energia mental...", "entregar de graça...", "sims que parecem...", "mídia deu nome...".

## GRUPO B — Reels de Teste (10 de 25, audiência = só não-seguidores)

| Vídeo | Publicação | Views | Interações | Interação/View |
|---|---|---|---|---|
| "café da manhã no hotel" | 24/07 19:35 | 2.408 | 150 | 6,23% |
| "café da manhã no hotel" | 22/07 23:32 | 1.828 | 94 | 5,14% |
| "Levei o computador pra cá" | 26/07 08:25 | 547 | 31 | 5,67% |
| "Levei o computador pra cá" | 25/07 21:02 | 104 | 0 | 0% |
| "balde de água fria" | 24/07 15:30 | 1.344 | 5 | 0,37% |
| "balde de água fria" | 23/07 12:43 | 572 | 0 | 0% |
| "pegadas mostram o caminho" | 25/07 19:35 | 227 | 4 | 1,76% |
| "pegadas mostram o caminho" | 22/07 23:38 | 205 | 0 | 0% |
| "ânsia por entregar mais" | 23/07 19:35 | 227 | 4 | 1,76% |
| "ânsia por entregar mais" | 22/07 23:24 | 522 | 1 | 0,19% |

**Diagnóstico (contexto diferente — não comparar direto com Grupo A ou threshold 10%):** interação de não-seguidor tende a ser mais baixa por natureza (sem vínculo prévio com a Karol), então mesmo os números baixos aqui não indicam "conteúdo fraco" do mesmo jeito que indicariam no Grupo A.

**"café da manhã no hotel" — contexto da Karol (27/07):** já foi liberado pra audiência geral também (não ficou só no teste). É relato pessoal — passou mal depois de comer ovo mexido, orou, melhorou — **sem conexão com nicho/produto/posicionamento**, só história pessoal + fé. Alcance e engajamento bons (confirmado: viraliza), mas **não converte**, segundo a própria Karol. Isso muda a leitura: é conteúdo de **atenção pura**, não de **posicionamento**. Bom pra crescer alcance/seguidor, mas não é o molde a replicar como estratégia central — não constrói autoridade no método dela nem qualifica lead.

## FORMATOS (Grupo A, amostra comparável)

REELS e FEED sem diferença clara nesse grupo menor (15 posts) — segue pequeno demais pra conclusão de formato.

## RECOMENDAÇÃO ESTRATÉGICA

**PRIORIDADE 1 — Nenhum conteúdo de negócio gerou comentário real nesse período (20-27/07).** Não é sobre achar o "molde certo" nesse batch — é sobre reconhecer que 0 dos 15 posts de negócio/posicionamento provocou reação de comentário da persona-alvo. Os únicos comentários do período foram: 1 spam comercial e 1 sobre assunto pessoal fora do nicho. Antes de testar mais formato/hook, vale investigar se a oferta/CTA do conteúdo de negócio está convidando a comentar de algum jeito, ou se está só informando.

**PRIORIDADE 2 — Conteúdo pessoal (café da manhã, jornada de emagrecimento) segue confirmando que engaja bem, mas não serve de molde pro Rico.** Os 2 posts com melhor resposta emocional do período inteiro são pessoais, não de negócio — úteis pra humanizar/crescer alcance, mas não devem virar referência de estrutura de roteiro de venda/posicionamento.

**PRIORIDADE 3 — Ao reportar métricas, separar Reels de Teste do resto E desconfiar de Interação/View quando o total de comentários é baixo (<10) sem checar quem comentou.** Com poucos comentários, 1 comentário fora do público-alvo distorce a taxa inteira — foi o que aconteceu 2x nesse batch.

## Insights pra Iris (pool de temas)

Sem dado de comentário qualitativo nesse batch (a coleta não traz texto, só contagem) — mesma limitação de 20/07. Se algum post desses tiver comentário real, vale mandar o dump pra leitura qualitativa.

## Insights pra Rico (próximos roteiros)

Nenhum molde novo confirmado nesse batch — os 2 posts de negócio com comentário tiveram esse comentário invalidado (spam / fora do nicho), e os 13 restantes tiveram zero comentário. Os 2 posts pessoais que viralizaram (café da manhã, jornada de emagrecimento) não servem de referência pra roteiro de venda/posicionamento. Recomendo: no próximo roteiro, testar um CTA que convide mais diretamente ao comentário (pergunta específica, não afirmação fechada) — pode ser o gancho que falta pra gerar comentário real de audiência.

> Aria gera análise. Karol decide o que executar.
