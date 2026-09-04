# Relatório Aria — Desafio Rota100k, Semana 04 (24-30/08) — fechamento, 03/09/2026

> Squad: Conteúdo Arcane (Aria — analista)
> Fonte: `business/instagram/metricas/2026-09-02.md` (janela lifetime, posts 23/08 a 02/09) + `business/instagram/metricas/2026-08-23.md` (janela lifetime, posts 17-23/08, usada só pra recalcular Semana03) + `business/instagram/metricas/comentarios/2026-08-27.json` + `historico-conta.csv`.
> Pedido pela Karol (03/09): "use as métricas que vocês coletam e analise-as" — sem post específico indicado, então cobri o período fechado que ainda não tinha relatório (Semana04 inteira, 24-30/08 — a Semana03 já tinha fechamento em `analises/2026-08-23/`).
> Antecessor: `analises/2026-08-23/relatorio-rota100k-semana03-fechamento.md`.

## ⚠️ Correção de metodologia (resolve dúvida aberta no relatório anterior)

O relatório da Semana03 registrou uma dúvida não resolvida: a coluna "Skip rate (3s)" vinha sendo tratada **diretamente** como retenção, sem inverter. Isso está **errado** — há memória validada em 12/08/2026 (post com maior amostra do batch, 86% real conferido no Insights nativo vs 84,4% calculado): a fórmula correta é **retenção 3s = 100% − skip_rate**.

Recalculei os dois períodos com a fórmula certa. Resultado: o "74% dos posts acima do threshold" reportado pra Semana03 estava **invertido e errado** — o número real é **26,7%**. Isso muda a leitura: não existe uma retenção historicamente boa que caiu na Semana04. As duas semanas sempre estiveram baixas nesse quesito; o relatório anterior só mostrou o espelho.

## RETENÇÃO 3s — Semana04 vs Semana03 (recalculado, comparável)

| Semana | Reels com dado | Acima de 50% | % |
|---|---|---|---|
| Semana03 (17-23/08) | 60 | 16 | **26,7%** |
| Semana04 (24-30/08) | 64 | 19 | **29,7%** |

**Diagnóstico:** retenção nos 3s estável (dentro do ruído de amostra), e estruturalmente baixa nas duas semanas — a maioria dos Reels perde mais da metade da audiência antes de completar 3 segundos. Isso é problema de GANCHO, recorrente, não um evento pontual da Semana04.

Por dia (Semana04, retenção corrigida):

| Dia | Objeção do dia | Acima de 50% |
|---|---|---|
| 24/08 | Não tenho tempo | 1/10 |
| 25/08 | Preciso estudar mais | 3/9 |
| 26/08 | Marketing não é meu forte | 4/9 |
| 27/08 | Já tem muita gente fazendo isso | 3/9 |
| 28/08 | Não tenho seguidores | **2/9 (pior média: 29,6%)** |
| 29/08 | Tenho medo de me expor | 4/9 (**melhor média: 47,5%**) |
| 30/08 | Fechamento de agosto | 2/9 |

## INTERAÇÃO — aqui sim houve queda real

| Semana | Zero-interação | Int/View ponderado (total int ÷ total views) |
|---|---|---|
| Semana03 (17-23/08) | 18/66 (27,3%) | 1,32% |
| Semana04 (24-30/08) | **31/71 (43,7%)** | **0,75%** |

**Diagnóstico:** diferente da retenção (estável), a interação caiu de fato — quase dobrou a proporção de posts com zero interação, e a taxa ponderada de interação por view caiu quase pela metade. Threshold de viralização do Método Audience é >10% — as duas semanas estão muito abaixo, mas a direção da Semana04 é pra pior.

## ZERO COMENTÁRIOS — o dado mais crítico da semana

Os 71 posts da Semana04 somaram: 97 curtidas, **0 comentários**, 5 saves, 3 shares. Conferi o dump bruto de comentários do período (`comentarios/2026-08-27.json` como amostra) — os poucos comentários que existem na conta seguem batendo em conteúdo pessoal antigo, fora do desafio (piada da "Ariana"/signo, indicação de amaciante), não em nenhuma peça do roteiro Rota100k.

**Isso significa:** zero pergunta, zero dúvida, zero objeção nova capturável de audiência real nesse período. Não tenho material pra alimentar a Iris com "insights dos comentários" — não porque não coletei, mas porque a peça não gerou nenhum. Não da pra saber com o que a audiência trava só olhando esse dado; falta o gatilho que puxa resposta escrita, não só o like.

## TOP 5 por ALCANCE — retenção é o que abre distribuição

| Post | Dia (objeção) | Views | Retenção 3s | Int/View |
|---|---|---|---|---|
| "Ver os outros crescendo dói mais que qualquer objeção..." | 27/08 08h (Já tem muita gente) | 3428 | **81,0%** | 0,35% |
| "Aqui não tem promessa milagrosa: validação vem antes de escala" | 30/08 18h50 (Fechamento) | 1880 | **76,3%** | 0,59% |
| "O mês passou igual pra todo mundo..." | 30/08 08h35 (Fechamento) | 518 | 69,8% | 0,77% |
| "Fui arrogante depois de pagar R$50 mil numa mentoria..." | 25/08 13h (Preciso estudar mais) | 390 | 61,4% | **2,82%** |
| "Uma amiga voltou de viagem encantada com o cardápio de travesseiro..." | 27/08 01h10 (Já tem muita gente) | 356 | — (Feed) | 1,40% |

Os 4 posts de maior alcance são exatamente os 4 de maior retenção corrigida da semana — **confirma de novo que retenção nos 3s é a alavanca de distribuição** (mesmo achado dos relatórios anteriores). O post #1 (81% retenção, 3428 views) só não converteu em interação — 12 curtidas, zero comentário, 0,35% int/view, bem abaixo da média da própria semana.

**Elemento em comum dos 2 top de retenção:** os dois fogem do roteiro-de-objeção abstrato e entram em registro **pessoal/vulnerável** ("dói ver os outros crescendo", "aqui não tem promessa milagrosa, validação vem antes de escala"). Bate com o padrão já registrado em `analises/2026-07-28/hipotese-audiencia-vs-consistencia.md`: causo real pessoal > roteiro de método abstrato. O post #4 (Fui arrogante / R$50 mil) confirma de novo — é o único do top 5 com int/view alto (2,82%), e também é causo pessoal concreto com número específico.

## BOTTOM — onde quebrou

4 dos 8 posts com pior retenção da semana são do dia 28/08 ("não tenho seguidores") — dia com a pior média de retenção (29,6%). Hooks desse dia foram mais genéricos/instrucionais ("mapeie dores, desejos e objeções", "defina pra quem você fala") — sem o gancho de vida da Laura que a v2 do plano da Semana04 tinha como direção.

## CONTA

- Seguidores: 6829 (24/08) → 6829 (30/08) — estável na semana, oscilando 6828-6833 nos dias intermediários. Sem queda líquida (Semana03 tinha caído 6).
- Alcance diário médio: ~2246/dia (Semana04) vs ~2646/dia (Semana03, últimos 6 dias medidos) — leve queda, mas com um pico isolado no dia 27/08 (3920) puxado pelo post âncora de 3428 views.

## ESCALAR FORMATO vs ESCALAR ASSUNTO (Elias)

**Escalar FORMATO — sim, há vencedor: registro pessoal/vulnerável.** Os 2 posts de maior retenção da semana (e maior alcance) usam abertura em primeira pessoa, confissão ou vulnerabilidade, sem jargão de método. Vale replicar essa textura de abertura nos slots 07h/09h/12h da Semana05 — não é mudar o roteiro do desafio, é priorizar qual causo entra em cada dia.

**Escalar ASSUNTO — nenhum tema-do-dia se destacou isoladamente.** A objeção "já tem muita gente fazendo isso" (27/08) teve o melhor dia agregado (mais views + mais interação totais), mas isso foi carregado quase todo pelo post-âncora, não pelo tema em si — os outros 9 posts do mesmo dia tiveram desempenho comum.

## RECOMENDAÇÃO PRA SEMANA05 (vi que você já está com o plano em rascunho)

1. **Zero comentário é o alerta real, não a retenção baixa.** Retenção baixa é crônica nas duas semanas — não é novidade, é característica do formato atual. O que mudou pra pior foi interação (zero-int quase dobrou, int/view caiu quase à metade). Se a Semana05 mantiver CTA fixo em "seguir" sem nenhum gatilho de resposta (pergunta direta, "comenta X", enquete), o padrão deve se repetir.
2. **Puxar mais aberturas no registro pessoal/vulnerável** (como os 2 posts-âncora da semana) em vez de abertura de objeção abstrata — isso é o que abriu alcance nas duas semanas analisadas até agora.
3. **Revisar o hook do slot "não tenho seguidores"** — foi o dia mais fraco em retenção nas duas últimas semanas em que apareceu (checar se ele repete na grade da Semana05).
4. Não tenho dúvida de audiência real pra sugerir tema novo pra Iris — o pool de comentários está vazio pro desafio. Se quiser gerar sinal de audiência, vale testar 1 post com pergunta direta como CTA só pra ver se isso muda o padrão de zero-comentário.

Você decide o que executar. Quer que eu confira também a Semana02 com a fórmula corrigida pra fechar a leitura histórica completa, ou já é suficiente com Semana03 x Semana04?

---

## ADENDO (03/09/2026) — Semana02 recalculada, comparativo das 3 semanas fechado

A pedido da Karol, recalculei a Semana02 (10-16/08) com a mesma fórmula corrigida. O relatório original de 16/08 tinha cobertura incompleta (faltava 14/08 tarde, 15/08 e 16/08 inteiros, porque a automação ainda não tinha alcançado esses dias). Usando um snapshot posterior (`2026-08-19.md`), a janela de 10 dias já cobre a Semana02 inteira — **69 posts, cobertura completa pela primeira vez**.

| Semana | Período | Retenção 3s corrigida >50% | Zero-interação | Int/View ponderado | Comentários reais |
|---|---|---|---|---|---|
| 02 | 10-16/08 | 20,3% (12/59) | 31,9% (22/69) | 1,29% | **8** (2 posts) |
| 03 | 17-23/08 | 26,7% (16/60) | 27,3% (18/66) | 1,32% | ~0 (nenhum do desafio) |
| 04 | 24-30/08 | 29,7% (19/64) | 43,7% (31/71) | 0,75% | **0** |

**Retenção 3s:** melhora pequena e consistente semana a semana (20,3% → 26,7% → 29,7%) — ainda estruturalmente baixa, mas não é estagnação: o gancho tá, devagar, ficando menos ruim.

**Interação:** sem tendência limpa — Semana03 foi a melhor das três (27,3% zero-int), Semana04 a pior (43,7%). Int/View ponderado ficou estável ~1,3% nas duas primeiras semanas e caiu quase pela metade na Semana04 — a queda é recente, não é característica das 3 semanas.

**Achado que resolve uma dúvida antiga — CTA muda comentário real:** os únicos 2 posts com comentário de verdade em 3 semanas inteiras de desafio foram os que **fugiram do CTA-padrão "seguir"**:
1. "Thiago Nigro não lança sozinho" (11/08, FEED, fora do roteiro oficial) — CTA explícito "Comenta GRUPO 👇" → gerou pedido real de comentário ("Grupo").
2. "Minha amiga, consultora de imagem, me indicou a Shein" (13/08) — gerou comentários por **polêmica negativa** (acusação de "arrogância"/"soberba" pela doação de roupa pra empregada). Tinha sido sinalizada como sem resposta nos relatórios de 21/08 e 23/08 — **correção (04/09, confirmado pela Karol): já foi respondida.** O dado bruto que capturei (comentário mais recente de 17/08) não tinha essa resposta no snapshot, mas isso é limitação da coleta, não fato do negócio.

Nenhum post com CTA "seguir" (a regra oficial do desafio) gerou um único comentário nas 3 semanas — 208 posts, zero pergunta, zero diálogo. Isso não é falha de execução do roteiro — é o CTA fazendo exatamente o que pede (seguir, não comentar). Mas se o objetivo for capturar dúvida/objeção real de audiência pra alimentar a Iris, esse CTA estruturalmente não entrega isso.

**Recomendação consolidada:** se decidir manter a regra "seguir" do material do desafio, aceitar que o pool de temas não vai vir de comentário nas próximas semanas (buscar em DM/pesquisa direta em vez disso). Se quiser testar comentário como sinal, 1 post isolado fora do roteiro oficial com CTA de pergunta direta (like o Thiago Nigro) resolve sem quebrar a regra do desafio nos outros 34 posts da semana.
