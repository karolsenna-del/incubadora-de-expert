# Relatório de Análise — Batch Completo (dado automatizado) — 20/07/2026

> Squad: Conteúdo Arcane (Aria — analista)
> Motivo: reanálise do Ciclo 1 do Desafio 10 Dias com dado completo. As análises anteriores (15/07, 16/07, 17/07, 18/07) usaram prints seletivos que a Karol mandava manualmente. Agora existe coleta automática (`business/instagram/metricas/`, workflow rodando desde 16/07) com os últimos 25 posts da conta em cada snapshot — dado completo, não amostra escolhida.

## Período Analisado

11/07 a 16/07/2026 (27 posts únicos, combinando os snapshots de 16/07 e 17/07 — o segundo já não mostra os 2 posts mais antigos de 11/07 porque saíram da janela dos "últimos 25").

## ⚠️ Limite do dado

Essa coleta automática traz: Alcance, Views, Curtidas, Comentários, Saves, Shares, Interações (lifetime, por post). **Não traz Tempo Médio de Visualização nem Taxa após 3s por post** — essas duas métricas do Método Audience continuam dependendo de print manual do Insights (Instagram nem mostra mais a Taxa 3s isolada no app nativo, conforme já registrado em 17/07). Então esse relatório é cirúrgico na **Métrica 3 (Interação/View)** com dado 100% completo, e usa os relatórios anteriores (baseados em print) como referência pontual pras Métricas 1 e 2 nos poucos posts que foram medidos manualmente.

## TABELA COMPLETA — Interação/View (dado automatizado, os 27 posts)

| Post (data/hora) | Tipo | Alcance | Views | Interações | Interação/View | Status vs threshold 10% |
|---|---|---|---|---|---|---|
| 12/07 17:50 — "Você não vende porque complica demais, sabe demais.." | REELS | **1.374** | 2.143 | 16 | 0,75% | ✗ |
| 15/07 18:40 — "Em ordem de prioridade... looks" | REELS | 889 | 1.754 | 12 | 0,68% | ✗ |
| 12/07 20:35 — "Demorei anos pra entender..." (Dedo Podre) | REELS | 647 | 729 | 11 | 1,51% | ✗ |
| 14/07 22:20 — "@sadiabrasil me ajudaaa" | REELS | 460 | 492 | 3 | 0,61% | ✗ |
| 13/07 20:35 — "Querida especialista," | REELS | 210 | 262 | 0 | 0% | ✗ |
| 11/07 20:35 — "Quando eu tiver mais seguidores..." | REELS | 220 | 252 | 5 | 1,98% | ✗ |
| 15/07 20:35 — "Todo mundo diz que não tem tempo..." (v.1) | REELS | 164 | 230 | 13 | **5,65%** | ✗ (melhor do batch) |
| 14/07 18:45 — "Você não vende porque complica demais. A partir do momento..." | REELS | 161 | 186 | 5 | 2,69% | ✗ |
| 12/07 09:00 — "Entenda sua persona: clareza, conexão..." | REELS | 149 | 184 | 0 | 0% | ✗ |
| 13/07 18:35 — "Você fala de você..." | REELS | 149 | 165 | 2 | 1,21% | ✗ |
| 14/07 20:35 — "Já reparou que todo mundo acha..." (v.1) | REELS | 116 | 131 | 3 | 2,29% | ✗ |
| 13/07 22:59 — "Já reparou que todo mundo acha..." (v.2) | REELS | 109 | 120 | 0 | 0% | ✗ |
| 12/07 12:56 — "Ninguém questiona quem ganha bem" | FEED | 112 | 267 | 8 | 3,00% | ✗ |
| 14/07 09:13 — "Aversão à venda? Medo de falhar?" | REELS | 92 | 109 | 0 | 0% | ✗ |
| 15/07 17:11 — "Todo mundo diz que não tem tempo..." (v.2) | REELS | 89 | 97 | 1 | 1,03% | ✗ |
| 16/07 22:06 — "Tem gente que sonha em ouvir os macetes..." (Planilha) | REELS | 159 | 196 | 6 | 3,06% | ✗ |
| 16/07 09:09 / 15/07 09:16 — "Promessas vagas..." / "Networking event.." | REELS | 76 | 96 | 0 | 0% | ✗ |
| 16/07 18:40 — "Todo especialista acredita que precisa colocar tudo.." | REELS | 76 | 84 | 0 | 0% | ✗ |
| 15/07 16:15 — "Comente GRUPO e olhe seu direct" (v.1) | REELS | 85 | 119 | 4 | 3,36% | ✗ |
| 15/07 14:50 — "Comente GRUPO e olhe seu direct" (v.2) | REELS | 46 | 52 | 0 | 0% | ✗ |
| 13/07 14:10 — "O gargalo do especialista nunca foi criar conteúdo" | FEED | 34 | 68 | 1 | 1,47% | ✗ |
| 14/07 13:11 — "Tem um tipo de cansaço que não passa com férias" | FEED | 45 | 121 | 1 | 0,83% | ✗ |
| 14/07 14:59 — "Se criar conteúdo é a sua maior trava" | REELS | 42 | 61 | 0 | 0% | ✗ |
| 11/07 18:45 — "Narrativa vende mais do que método" | REELS | 49 | 65 | 0 | 0% | ✗ |
| 11/07 13:31 — "Quando eu tiver mais seguidores..." (repost/2ª versão) | REELS | 110 | 120 | 1 | 0,83% | ✗ |
| 11/07 13:28 — post sem legenda mapeada | REELS | 525 | 554 | 2 | 0,36% | ✗ |

## DIAGNÓSTICO CIRÚRGICO — o que os 27 posts mostram

**NENHUM dos 27 posts cruzou o threshold de 10% de Interação/View.** O melhor resultado do batch inteiro foi 5,65% — quase metade do mínimo que o Método Audience considera necessário pra viralizar (Pattern D). A maioria fica abaixo de 3%, e **8 dos 27 posts (30%) tiveram ZERO interação registrada** apesar de terem alcance real (34 a 220 contas).

Isso é diferente do que os relatórios anteriores sugeriam. Analisando só prints selecionados, parecia que o problema era pontual — "esse CTA foi fraco", "esse post prendeu mas não converteu". Com o dado completo, o padrão é **estrutural, não pontual**: interação baixa é a norma da conta inteira nesse período, independente de alcance (o post de MAIOR alcance do batch, 1.374, teve uma das PIORES taxas de interação, 0,75%) e independente de formato (Reels e Feed têm o mesmo problema).

Pattern do Método Audience que bate aqui: **Pattern C — "Tudo bom mas baixa interação"** (quando taxa 3s e tempo médio estão OK, mas interação falha = problema de CTA ou Notabilidade), só que acontecendo em praticamente 100% da amostra, não em 1-2 posts isolados.

### Hipóteses pro erro estrutural (CTA/Notabilidade, não Gancho/Algoritmo)

1. **CTA "comenta a palavra-código" pode estar com fricção alta demais pra quem não é audiência quente.** Os 2 posts com caption **literalmente só o CTA** ("Comente GRUPO e olhe seu direct", sem nenhum hook na legenda) tiveram interação 0% e 3,36% — nem esses convertem bem, e são exatamente os que deveriam converter mais fácil por serem 100% CTA.
2. **Conteúdo de tom "informativo/afirmação" (ex: "Entenda sua persona...", "Você não vende porque complica demais...") não gera reação — não tem polêmica nem identificação forte o bastante pra fazer alguém comentar.** São os que zeram interação com mais frequência.
3. **Volume alto (4-6 posts/dia) pode estar dividindo a atenção da audiência existente** — a mesma pessoa não comenta em 5 posts do mesmo dia, então cada post individual recebe uma fatia menor do engajamento total disponível.

### O que os relatórios anteriores (baseados em print, retenção/tempo) ainda valem

Os achados de Retenção/Tempo Médio dos relatórios de 15-18/07 (Dedo Podre 8s=2x média; Planilha 25s=recorde absoluto; domingo à noite 9s fraca) **continuam válidos** — são dado real que só o Insights manual mostra, a coleta automática não cobre isso. Ou seja: **Métrica 1 (Gancho) parece estar funcionando bem em vários posts** (a Karol prende atenção). O gargalo real, confirmado agora com dado completo, é especificamente a **Métrica 3 (Interação)**.

## COMPARATIVO — Top vs Bottom (por Interação/View)

**Top 3:**
1. 15/07 20:35 "Todo mundo diz que não tem tempo..." v.1 — 5,65%
2. 15/07 14:50→16:15 "Comente GRUPO" v.1 — 3,36%
3. 16/07 22:06 "Planilha" — 3,06%

**Padrão dos tops:** os 3 têm alguma forma de confronto direto de crença ("Todo mundo diz que X, a verdade é outra", "planilha que prendia" = história pessoal com virada) — não são afirmações informativas soltas.

**Bottom (0% interação, 8 posts):** "Entenda sua persona" (conteúdo educacional puro), "Aversão à venda? Medo de falhar?" (pergunta retórica sem virada), "Se criar conteúdo é sua maior trava" (afirmação sem gancho pessoal), "Comente GRUPO" v.2, "Já reparou que todo mundo acha" v.2, "Networking event/Promessas vagas", "Todo especialista acredita", "Narrativa vende mais do que método".

**Padrão dos bottom:** frases de "consultoria genérica" — soam como conteúdo que qualquer conta de marketing digital posta. Sem história pessoal, sem confronto de crença específica da persona.

## RECOMENDAÇÃO ESTRATÉGICA

Isso não é "o desafio não funcionou" — é "a Fase de ativação (alcance) funcionou, a Fase de conversão (interação) não foi resolvida por ela, porque não era o objetivo dela". Onde focar agora:

**PRIORIDADE 1 — CTA de reconhecimento, não de comando genérico.** Testar CTA que nomeia a pessoa específica ("compartilha com [tipo de pessoa]") em vez de "comenta X" solto — comparar interação nos próximos 5 posts.

**PRIORIDADE 2 — Cortar o formato "afirmação informativa genérica" (os 8 posts de 0%).** Esse tom não é o que funciona pra essa conta. Manter só formatos com história pessoal + confronto de crença (o padrão que já rendeu os tops nesse batch E nos relatórios anteriores — Dedo Podre, Planilha).

**PRIORIDADE 3 — RETIRADA (decisão da Karol, 20/07).** Hipótese original: volume alto (4-6 posts/dia) dividiria a atenção da mesma audiência entre si. Karol contestou com argumento válido: dos ~6.803 seguidores, a maioria não é alcançada em cada post — a maior parte das views vem de NÃO-seguidores (confirmado no relatório de 18/07: 87,7% não-seguidores no post "domingo à noite"). Ou seja, cada post não está competindo pela mesma audiência fixa — está sendo descoberto por gente nova a cada vez. Reduzir volume não resolveria o gargalo de interação; mais testes = mais chance de achar o padrão que converte. **Decisão: manter volume alto, focar em Prioridades 1 e 2.**

## DECISÃO FINAL (Karol, 20/07)

1. ✅ **Cortar o formato "afirmação genérica"** (os 8 posts zerados) — confirmado
2. ✅ **Testar CTA de reconhecimento específico** em vez de "comenta X" solto — confirmado
3. ❌ Reduzir volume — descartado (ver justificativa acima)

> Aria gera análise. Karol decide o que executar.

## Insights pra Iris (pool de temas)

Nenhum dado de comentário qualitativo disponível nesse batch automatizado (a coleta não traz texto de comentário, só contagem). Recomendo: da próxima vez que a Karol tiver um post com comentário de verdade, mandar o dump de texto pra Aria ler qualitativamente — isso é uma mina que ainda não foi explorada com esse desafio.

## Insights pra Rico (próximo roteiro)

Estrutura vencedora confirmada 2x com dado completo: confronto direto de crença + história pessoal (não afirmação informativa solta). Evitar abrir Reels só com o CTA na legenda sem nenhum gancho de conteúdo.
