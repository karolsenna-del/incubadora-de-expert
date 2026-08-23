# Relatório Aria — Desafio Rota100k, Semana 03 (17-23/08) — quase-fechamento, 23/08/2026

> Squad: Conteúdo Arcane (Aria — analista)
> Fonte: `business/instagram/metricas/2026-08-22.md` (janela lifetime, posts 12/08 a 21/08) + `business/instagram/metricas/comentarios/2026-08-21.json` e `2026-08-22.json` + `historico-conta.csv`.
> Pedido pela Karol (23/08): analisar como foi a Semana 03 antes do Rico montar a Semana 04.
> Antecessor: `analises/2026-08-21/relatorio-rota100k-semana03-parcial.md` (cobria 17-21/08).

## ⚠️ Cobertura de dado — ainda não é fechamento total

A coleta de métricas por post que alimenta este relatório (`2026-08-22.md`) foi feita às 07h09 de 22/08 e **ainda não tem nenhum post de 22/08 ou 23/08** na tabela — só o snapshot de conta (seguidores/alcance) avançou um dia. Ou seja: no nível de post, os dados são os mesmos 17-21/08 do relatório parcial anterior; não há dado novo pra sábado e domingo (os 2 últimos dias da semana, 10 posts que faltam). Trato as conclusões abaixo como **quase-fechamento** (mais robustas que o parcial pelo N maior e por cruzar com o padrão histórico), não fechamento 100%.

## RANKING — peças de 17 a 21/08 (Interação/View)

Recalculei a tabela inteira (47 Reels com métrica de retenção + demais Feed/Reels sem essa métrica) em vez de amostra. Top confirma o parcial, sem post novo entrando no topo:

| Peça | Data | Views | Int | Int/View |
|---|---|---|---|---|
| "Será que é coisa de ariana? Sempre fui competitiva" | 17/08 22h50 | 416 | 17 | **4,09%** |
| "Adorei, não nego... blogueira x quem usa IG pra trabalho" | 17/08 17h00 | 291 | 9 | 3,09% |
| "Você não está sem tempo..." (republicado) | 20/08 20h55 | 139 | 4 | 2,88% |
| "Se você aprender essa planilha..." | 19/08 18h00 | 71 | 2 | 2,82% |
| "Eu fui pro digital para falar com quem quer me ouvir" (7s) | 21/08 05h04 | 36 | 1 | 2,78% |
| "Conquistar a primeira venda validada..." (republicado) | 21/08 18h00 | 76 | 2 | 2,63% |
| "Não é talento que separa amador de profissional" (FEED) | 20/08 20h16 | 40 | 1 | 2,50% |
| *(demais ~40 peças do roteiro do desafio)* | 17-21/08 | 28-292 | 0-4 | 0-2,3% |

Os 2 posts de topo continuam sendo **conteúdo pessoal/lifestyle**, não roteiro do desafio — mesmo achado do parcial, agora com mais dias confirmando.

## ZERO-INTERAÇÃO

11 de 47 peças com métrica de retenção ficaram com 0 interação (23%) — praticamente igual ao parcial (24%). Sem mudança de padrão.

## RETENÇÃO 3s

Recalculado com as 47 peças (17-21/08) que trouxeram o campo "Skip rate (3s)" — sigo a mesma convenção dos relatórios anteriores (valor da coluna tratado como retenção após 3s, threshold >50%):

- **35 de 47 (≈74%) ficaram acima do threshold de 50%.** Isso é mais positivo do que a leitura qualitativa do parcial ("boa parte abaixo do threshold") sugeria — com a tabela completa, a maioria passa.
- Por dia: 17/08 9/14 acima; 18/08 8/8 acima (100%); 19/08 6/9; 20/08 6/9; 21/08 6/7.
- ⚠️ **Nota metodológica:** a coluna se chama "Skip rate (3s)" no dado bruto (Meta), mas os relatórios desse squad (parcial incluído) vêm tratando o valor diretamente como retenção, sem inverter (100 - skip_rate). Não mudei essa convenção aqui pra manter comparável com os relatórios anteriores, mas registro que existe uma dúvida de nomenclatura não resolvida — vale a Karol confirmar qual é a leitura correta antes de decisões que dependam muito fino dessa métrica.

## CONTA

- Seguidores: 6836 (17/08) → 6830 (22/08) — caiu 6 no período (pior que os -4 do parcial, que só ia até 21/08). Segue sem crescimento na semana.
- Alcance diário: 4010 (17/08) → 1552 (22/08) — queda consistente dia a dia, não é ruído pontual: 4010 → 4417 → 2099 → 1852 → 1946 → 1552. Tendência de queda ao longo da semana inteira, não só nos últimos dias.

## COMENTÁRIOS — mesmo padrão, sem novidade

Chequei os arquivos de comentários de 21 e 22/08: nenhum comentário novo de possível aluna em conteúdo de método. Os únicos comentários de audiência real seguem em conteúdo pessoal (Ariana/signo, "blogueira x reels", molho de tomate) e a controvérsia do Reels da Shein (comentários chamando de "arrogância"/"soberba") **continua sem resposta nova da Karol** — mesma situação já sinalizada no parcial, ainda em aberto.

## ESCALAR FORMATO vs ESCALAR ASSUNTO (Elias)

**Escalar FORMATO — não há vencedor claro dentro do roteiro do desafio.** Nenhum dos 5 slots da grade (7s sem fala, YAP 09h/12h/17h, carrossel 20h) se destacou de forma consistente — as diferenças entre eles ficam todas na faixa de 0-2,3% de Int/View, dentro do ruído de amostra pequena. O slot 07h (7s sem fala, formato novo desde 16/08) não superou os YAP — ficou na média ou abaixo (0,49% a 1,80%).

**Escalar ASSUNTO — o padrão histórico se confirma de novo.** "Causo real pessoal + moral de negócio" (Ariana, Shein, molho de tomate — todos de antes da semana03) seguem sendo o que mais rendeu historicamente, e nenhum post do roteiro oficial da semana03 testou esse padrão (o roteiro é mais abstrato/método, sem causo concreto na maioria dos slots 12h). Isso bate com o que já está registrado em `analises/2026-07-28/hipotese-audiencia-vs-consistencia.md`: conteúdo pessoal engaja mais, mas majoritariamente audiência que já conhece a Karol (comentários vêm de amigas, não de leads).

**Recomendação pro Rico (Semana 04):** dentro da grade fixa do desafio (não dá pra trocar formato — grid é regra do próprio material), o slot com mais alavancagem é o **12h ("história e bastidor... prova pelo que você viveu")** — é o slot já desenhado pra carregar causo real, e é exatamente o padrão que historicamente mais rende. Vale o Rico priorizar puxar histórias BEM concretas e específicas (não genéricas) pra esse slot na semana04, usando `historias-trajetoria.md` e `historias-mentorias-atendidas.md` com o máximo de detalhe possível — replicando o que fez o post da planilha/controladoria (2,82%) em vez de afirmações abstratas sobre método. Não é uma mudança de formato, é uma ênfase dentro do que já está no plano.

## LACUNAS PRA KAROL SABER ANTES DO ROTEIRO DA SEMANA 04

1. **Faltam os 2 últimos dias de semana03 (22-23/08)** na coleta de métricas — a automação ainda não capturou. As conclusões acima são "quase-fechamento", baseadas em 5 de 7 dias de dado por post (mas 6 dias de dado de conta).
2. **Controvérsia do Reels da Shein segue sem resposta** — não escalou em volume, mas é o único ponto de polêmica real de audiência ativo. Decisão de moderar ou não é da Karol, só sinalizo de novo.
3. **Dúvida de nomenclatura** na métrica de retenção 3s (skip rate vs retenção, ver nota acima) — não resolvi, só registrei. Não acho que deva travar a produção da semana04, mas caso algum dia a métrica vire critério de decisão fina, vale esclarecer com a fonte da API.
4. Seguidores e alcance seguem em leve queda a semana inteira, não é sinal novo (mesma tendência das semanas anteriores) — não é motivo pra pânico, mas reforça que o desafio ainda não reverteu a curva.
