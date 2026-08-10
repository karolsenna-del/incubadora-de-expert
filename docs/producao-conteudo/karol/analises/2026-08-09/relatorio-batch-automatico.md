# Relatório de Análise — Batch Automático — 09/08/2026

> Squad: Conteúdo Arcane (Aria — analista)
> Fonte: `business/instagram/metricas/` — snapshots de 31/07, 02/08, 04/08, 06/08, 07/08 e 09/08 (coleta automática do workflow instagram-metricas)
> Período coberto: 31/07 09:20 até 08/08 23:04 (últimos ~10 dias, contados desde o fim do período do relatório anterior de 01/08 — que foi até 30/07 19:15)
> Solicitado pela Karol: "últimos 10 dias desde a última vez que Aria analisou" + comentários se possível

## ⚠️ Limite do dado (mesma limitação dos relatórios anteriores)

A coleta automática traz Alcance, Views, Curtidas, Comentários, Saves, Shares e Interações (lifetime), mas **não traz texto de comentário, Taxa após 3s nem Tempo Médio de Visualização** — dependem de print manual do Insights ou de dump/Apify. Diagnóstico cirúrgico fica restrito à **Métrica 3 (Interação/View)**. Karol confirmou que tem poucos comentários nesse período — os 5 posts com comentário (contagem) estão listados abaixo, mas sem o texto não dá pra fazer leitura qualitativa real.

## Correção metodológica (herdada do relatório de 01/08)

Karol usa a aba **Reels de Teste** (audiência só não-seguidores) e, quando o teste vai bem, republica pra audiência geral — isso gera 2 entradas pra mesma peça de conteúdo. Nesse período apareceram **10 pares teste+republicado** (bem mais que os 3 do relatório anterior — uso do recurso aumentou). Números somados por peça, não tratados como posts concorrentes.

**64 publicações brutas → 54 peças de conteúdo distintas** nesse período.

## RANKING (54 peças, por Interação/View)

| Peça | Tipo | Views | Interações | Int/View | Par teste+republ? |
|---|---|---|---|---|---|
| "Já parou para pensar sobre isso?" | REELS | 1.177 | 63 | **5,35%** | não |
| "Sempre fiz dieta assim 😂" | REELS | 6.565 | 285 | **4,34%** | sim (2) |
| "Preso no mesmo lugar? 3 medos..." | REELS | 52 | 2 | 3,85% ⚠️ amostra mínima | não |
| "Aconteceu comigo, acontece com você..." | REELS | 370 | 13 | 3,51% | não |
| "O problema não é o seu método, é o formato do infoproduto..." | REELS | 1.084 | 37 | **3,41%** | sim (2) |
| "Você também pode ser burro em outras áreas..." | REELS | 2.570 | 80 | **3,11%** | sim (2) |
| "No passado eu escondia meus lançamentos fracassados..." | REELS | 101 | 3 | 2,97% ⚠️ amostra pequena | não |
| "Esse é o maior caos que o empreendedor digital vive..." | REELS | 340 | 10 | 2,94% | sim (2) |
| "Você tem muito conhecimento pra ficar guardado..." | FEED | 40 | 1 | 2,50% ⚠️ amostra mínima | não |
| "Cinco frases que eu repito tanto..." | FEED | 43 | 1 | 2,33% ⚠️ amostra mínima | não |
| ... (44 peças intermediárias, ver planilha bruta) | | | | 0,28% – 2,27% | |
| 14 peças zeraram interação | REELS (12) / FEED (1) / — | — | 0 | 0% | 2 pares inclusos |

**Zero-interação: 14 de 54 peças = 26%** — melhora forte vs os 47% do relatório de 01/08 (base de comparação diferente, mas direção é boa).

## FORMATOS

- **REELS** (42 peças): média **2,96%** Int/View
- **FEED** (12 peças): média **1,07%** Int/View

REELS performando quase **3x melhor** que FEED nesse período — sinal bem mais forte que o relatório anterior (que tinha achado praticamente empatado). Amostra agora é grande o suficiente (42 vs 12) pra levar a sério.

## ACHADO CENTRAL — mudança de padrão vs relatórios anteriores

Os 3 relatórios anteriores (20/07, 27/07, 01/08) tinham achado consistente: **conteúdo pessoal engaja, conteúdo de negócio não**. Esse período quebra parcialmente esse padrão:

- O TOP 1 ("Já parou pra pensar sobre isso?") e o TOP 2 ("Sempre fiz dieta assim") ainda são leve/pessoal — confirma a tendência antiga.
- MAS 3 peças de **negócio/posicionamento** aparecem logo atrás, com Int/View forte e amostra relevante (Views 340–2.570, não são outliers de amostra pequena):
  - "O problema não é o seu método, é o formato do infoproduto" — 3,41%
  - "Você também pode ser burro em outras áreas da vida" — 3,11%
  - "Esse é o maior caos que o empreendedor digital vive" — 2,94%

**Elemento comum dessas 3:** confronto direto + vulnerabilidade/autocrítica ("você também pode ser burro", "o problema é seu", "o caos que você vive") — não é o discurso de autoridade clássico, é confronto + identificação. Isso é diferente do "relato pessoal de vida" (férias, dieta) que vinha sendo o único tipo de conteúdo pessoal que engajava.

**Vale considerar:** talvez não seja "pessoal vs negócio" a variável real — pode ser "confronto/vulnerabilidade vs afirmação segura". Vale segurar essa hipótese nova pros próximos batches antes de virar conclusão (ver [[project_hipotese_audiencia_conteudo_karol]]).

## COMENTÁRIOS (contagem apenas — sem texto)

| Peça | Tipo | Comentários |
|---|---|---|
| "Você também pode ser burro em outras áreas..." | REELS (par) | 10 |
| "Sempre fiz dieta assim" | REELS (par) | 14 |
| "Já parou para pensar sobre isso?" | REELS | 7 |
| "Mariana Rios lançou curso de R$297..." | FEED | 4 |
| "Não é sobre desacreditar de ninguém..." | REELS (par) | 1 |

Sem o texto, não dá pra confirmar se são comentários reais de audiência ou contaminação comercial (como aconteceu 2x nos relatórios anteriores). Se Karol quiser leitura qualitativa real, precisa colar o texto dos comentários ou rodar Apify nesses 5 posts.

## LAPIDAÇÃO 80/20 SUGERIDA

- 80%: manter REELS como formato principal (3x melhor que FEED nesse período, amostra já robusta)
- 20%: testar mais peças no estilo "confronto + vulnerabilidade em negócio" pra confirmar se é padrão novo ou coincidência de 3 posts

## 2 FORMAS DE ESCALAR (Elias)

### Escalar FORMATO (hook de confronto direto + identificação)
Estrutura "Você também [erro/fraqueza] + ninguém fala sobre isso" aplicada a outros temas:
1. "Você também erra na hora de precificar e finge que não" 
2. "Você também procrastina o lançamento e chama de 'ainda não tá pronto'"
3. "Você também copia concorrente e chama de 'inspiração'"

### Escalar ASSUNTO (tema campeão: caos/erro do processo de criar produto digital)
1. "5 sinais de que seu infoproduto tá com problema de formato, não de conteúdo"
2. "O caos que ninguém mostra de bastidor de lançamento"
3. "Erros que todo mundo comete na primeira versão do método"

## REAPROVEITAMENTO

- "Você também pode ser burro..." (2.570 views, 80 int, 10 comentários) → vale virar **carrossel** detalhando os "outros erros" mencionados no reels, e considerar repost em 30+ dias
- "Sempre fiz dieta assim" (6.565 views, maior alcance do período) → é conteúdo leve, bom pra alcance/humanização, mas não pra posicionamento — não usar como referência de roteiro de negócio pro Rico
- "Já parou para pensar sobre isso?" (985 alcance, top Int/View) → hook simples de pergunta direta, vale testar variações do mesmo gancho em outros temas de negócio

## INSIGHTS PRA IRIS (pool de temas)

- Tema validado com amostra boa: "erro/caos no processo de criar infoproduto/método" — 3 peças testadas, todas acima de 2,9%
- Sem dúvida/pergunta explícita de comentário disponível (falta texto) — não dá pra extrair tema novo direto de comentário nesse batch

## INSIGHTS PRA RICO (próximos roteiros)

- Testar mais hooks no formato "confronto direto + vulnerabilidade" em temas de negócio (ver Escalar Formato acima) — é a primeira vez que conteúdo de negócio chega perto do pessoal em performance
- Reforçar CTA de pergunta direta continua sendo variável não testada sistematicamente (recomendação do relatório de 01/08 segue válida — ainda sem dado de comentário-texto pra confirmar se funcionou)

## RECOMENDAÇÃO ESTRATÉGICA

**PRIORIDADE 1** — Confirmar se "confronto + vulnerabilidade em negócio" é padrão real ou sorte de 3 posts. Produzir mais 3-5 nesse estilo e comparar no próximo batch.

**PRIORIDADE 2** — REELS vs FEED agora é um sinal forte (3x, amostra grande). Vale reduzir ainda mais o FEED ou usá-lo só pra conteúdo que não serve pra vídeo.

**PRIORIDADE 3** — Cadência subiu muito nesse período (54 peças em ~9 dias vs 15 peças em ~4 dias no relatório anterior — ritmo de várias publicações por dia). Vale intencional? Ou foi teste de volume? Se intencional, considerar se qualidade/consistência de tom está se sustentando nesse ritmo.

**PRIORIDADE 4** — Sem texto de comentário, meus relatórios seguem sem conseguir confirmar sinal real de audiência (dúvida, objeção, demanda). Se Karol quiser destravar isso, precisa de print/dump de comentário ou Apify nos 5 posts com comentário listados acima.

> Aria gera análise. Karol decide o que executar.
