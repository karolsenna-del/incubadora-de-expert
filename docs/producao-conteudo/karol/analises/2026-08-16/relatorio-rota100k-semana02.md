# Relatório Aria — Desafio Rota100k, Semana 02 (10-16/08) — 16/08/2026

> Squad: Conteúdo Arcane (Aria — analista)
> Fonte: `business/instagram/metricas/` (snapshots 2026-08-10 a 2026-08-14) + `business/instagram/metricas/comentarios/` + `docs/producao-conteudo/karol/desafio-rota100k-semana02-plano.md`
> Pedido pela Karol: analisar a semana 02 ANTES do Rico fechar o roteiro da semana 03.

## ⚠️ Cobertura de dado — INCOMPLETA, leia antes do resto

A automação de métricas roda com janela de **25 posts** e o último snapshot disponível é de **14/08 07:44**, capturando posts só até **14/08 00:35**. Não existe snapshot de 15/08 nem 16/08. Isso significa:

- **Cobertura real: segunda 10/08 até madrugada de quinta 14/08.** Sexta 14/08 (dia inteiro), sábado 15/08 e domingo 16/08 — a maior parte da 2ª metade da semana planejada — **não tem dado nenhum**. Não seguem estimados abaixo pra esse trecho.
- A postagem **não seguiu a ordem do calendário planejado**. O plano previa 4 posts/dia (1 por slot: 09h/12h/17h/20h) rodando 1 dia de cada vez. Na prática, a Karol gravou/postou vários dias do roteiro juntos e fora de ordem — por exemplo, o gancho roteirizado pra **domingo 09h** ("Levei anos tentando aprender tráfego...") já saiu no ar na madrugada de **14/08** (quinta pra sexta), e ganchos de quinta/sexta apareceram publicados já no dia 10. Uso a legenda pra casar cada post com o slot do plano, não a data de publicação.
- Vários posts têm **2 entradas com o mesmo texto e IDs diferentes** — consistente com o padrão já confirmado no relatório anterior (12/08): Reels de Teste pra não-seguidores, depois republicado pra audiência geral. Tratei como peças distintas quando os links eram diferentes.
- Onde um post saiu da janela de 25 antes de eu conseguir o número mais recente, usei o último valor capturado (é direcional, não final — visualizações provavelmente estão levemente subestimadas nesses casos, mesmo viés já documentado no relatório de 12/08).

## RANKING — peças da semana 02 com dado capturado (Interação/View, ordenado)

| Peça (gancho/slot do plano) | Views | Int | Int/View | Nota |
|---|---|---|---|---|
| "Thiago Nigro não lança sozinho" (FEED, CTA "Comenta GRUPO") | 94 | 4 | **4,26%** | ⚠️ Não é do roteiro da semana 02 — sobra do pool antigo, CTA quebra a regra do desafio (só "seguir") |
| "Esse conselho não é mentira" — quarta 17h (conselho famoso incompleto) | 194 | 4 | **2,06%** | — |
| "Primeiro faz o que dá..." | 156 | 2 | 1,28% | fora do plano mapeado (pool antigo) |
| "Levei anos tentando aprender tráfego, infra, automação" — **domingo 09h** | 156 | 2 | 1,28% | postado fora de ordem, já na madrugada de 14/08 |
| "Toda vez que mostro um método pronto" — quarta 09h | 223 | 4 | 1,79% | — |
| "Minha amiga, consultora de imagem, me indicou a Shein" — **sábado 17h** | 187 | 3 | 1,60% | causo real, ângulo trocado 13/08 |
| "Tem gente com medo de perder autenticidade usando IA" — sexta 12h (react) | 158 | 2 | 1,27% | — |
| "Essa pergunta me pegou..." — quinta 09h | 214-167* | 2 | ~0,9-1,2% | 2 entradas (teste+republicado) |
| "Levei anos pra contar minha própria história" — quarta 09h | 215 | 1 | 0,47% | — |
| "O passo 1 que quase todo mundo pula" — segunda 17h | 203 | 1 | 0,49% | 2 entradas (teste+republicado) |
| "Já fui tentada a fazer do jeito rápido" — quarta 12h | 156 | 1 | 0,64% | — |
| "Adiar a primeira venda até 'estar pronta'" — segunda 12h | 224 | 1 | 0,45% | — |
| "Você acha que precisa terminar o produto sozinha" — segunda 09h | 237 | 1 | 0,42% | — |
| "Já ganhei aluno porque ele fez essas perguntas" — sexta 09h | 192 | 1 | 0,52% | — |
| "Testei fechar meu primeiro produto sozinha" — terça 09h | 193 | 0 | 0% | — |
| "Há 6 anos eu tentei lançar sem clareza" — quinta 12h | **480** | 0 | **0%** | ⚠️ Melhor alcance da semana, interação zero |
| "Ninguém te conta que o prazo depende..." — quinta 17h | 147-162 | 0 | 0% | 2 entradas, ambas zeradas |
| "Se você quer ser mentora, é assim de verdade" — **sábado 09h** (case Yamada) | 41 | 0 | 0% | amostra pequena — não deu tempo de rodar |
| "Vivi a dor que o curso resolvia" — sexta 09h | 56 | 0 | 0% | amostra pequena |
| "Você também pensa em desistir todos os dias?" (10/08 19h) | 221 | 0 | 0% | fora do plano mapeado (pool antigo) |
| "Minha família não entende metade do que faço online" | 145 | 1 | 0,69% | não localizado no plano — provável ajuste de última hora |

*Onde aparecem 2 números, é par teste+republicado com métricas capturadas em momentos diferentes.

**Zero-interação nessa amostra: 8 de 21 peças identificáveis (≈38%)** — pior que o período mais amplo de 03-12/08 (24% no relatório anterior). Amostra pequena e enviesada pela janela curta — trato como sinal fraco, não conclusão.

## RETENÇÃO 3s — não disponível de forma confiável nesse recorte

Os poucos "tempo médio" capturados vêm com valores absurdos (ex: 87.488, 104.758 — muito acima da duração real do vídeo), sinal de que a métrica ainda tá instável na API pros Reels dessa semana. Skip rate (3s) apareceu pra maioria — a maior parte fica na faixa de 45-65%, abaixo do threshold de retenção >50% em boa parte, mas alguns exemplos (Yamada 89%, "Só fracassa quem desiste" 87%) batem bem. Sem volume suficiente pra virar achado forte — sinalizo como ponto de atenção, não conclusão.

## SEGUIDORES E ALCANCE DA CONTA (10-14/08)

- Seguidores: 6828 (10/08) → 6829 (14/08) — **praticamente parado**, dentro do ruído normal.
- Alcance diário: caiu de 6888 (10/08) para 2030 (13/08), depois subiu pra 4219 (14/08).
- Visitas ao perfil: 541 em 14/08 — muito acima do normal da semana (10-15). Não dá pra atribuir a um post específico com o dado disponível; vale a Karol conferir no Instagram nativo o que gerou esse pico, porque pode ser sinal de um conteúdo com alcance fora da janela de 25 posts que a automação não capturou.

## ACHADO CENTRAL

Com a cobertura que existe (10/08 a madrugada de 14/08), **nenhuma peça da semana 02 chegou perto do padrão "causo informal + moral de negócio" que dominou o relatório anterior** (5 dos 8 melhores posts de 03-12/08, com destaque de 3-5% Int/View e um outlier de 1.954 views). O melhor Int/View real do roteiro da semana 02 foi "Esse conselho não é mentira" (2,06%) — ok, mas bem abaixo do padrão anterior. O post de maior alcance ("Há 6 anos eu tentei lançar sem clareza", 480 views) teve **interação zero**, reforçando o achado já visto: alcance e interação seguem sendo apostas diferentes, não a mesma coisa.

O melhor Int/View da janela inteira (4,26%, "Thiago Nigro") **não é do roteiro do desafio** — é conteúdo do pool antigo com CTA "Comenta GRUPO", que **quebra a regra do próprio desafio** (CTA único deveria ser "seguir"). Vale a Karol confirmar se esse post foi um vazamento do agendamento antigo ou intencional.

O causo real mais próximo do padrão vencedor da semana anterior — "Minha amiga, consultora de imagem, me indicou a Shein" (sábado 17h) — ficou em 3º lugar (1,60%), o segundo melhor dentro do roteiro oficial da semana. É o mais parecido em formato (causo pessoal informal + virada de negócio) com os 5 posts que lideraram o relatório de 12/08.

## INSIGHTS PRA RICO — pra aplicar na semana 03

1. **O padrão "causo informal + moral de negócio" não se repetiu com força na semana 02** apesar de ter sido a aposta #1 recomendada no relatório de 12/08 — só 1 peça desse estilo entrou no roteiro (Shein/sábado), e teve resultado mediano, não excepcional. Vale considerar 2-3 causos informais na semana 03, não só 1, pra ter amostra que permita comparar de verdade.
2. **"Já vivi/testei sozinha" como ângulo genérico (sem causo concreto)** — "Testei fechar meu primeiro produto sozinha", "Você acha que precisa terminar sozinha", "Adiar a primeira venda" — ficaram todos abaixo de 0,5% Int/View. Essa família de ganchos reflexivos-sem-história-concreta segue fraca (já tinha sido sinalizada no relatório de 12/08 pra família parecida "pergunta retórica sobre processo"). Evitar repetir esse ângulo puro na semana 03; se usar, ancorar em um causo real específico, não em reflexão genérica.
3. **CTA "seguir" é a regra do desafio — mas o post com melhor Int/View da semana rompeu essa regra com "Comenta GRUPO"** e performou melhor que tudo que seguiu a regra. Isso não é motivo pra abandonar o "seguir" (é a regra do desafio, não decisão de conteúdo), mas é dado real: CTA de comentário net pode "custar" performance de reach a favor de mais interação — vale a Karol decidir conscientemente, não por acidente de agendamento.
4. **Novo slot 07h (Reels 7s sem fala) da semana 03 não tem precedente de dado** — é formato novo, sem como prever performance. Sugestão: usar esse slot pra ganchos mais fortes e recicláveis (frases de efeito, sem depender de causo), já que o próprio formato do PDF pede isso — e comparar contra os Reels YAP do mesmo dia depois de uma semana rodando, pra já entrar no relatório de fechamento da semana 03.

## INSIGHTS PRA IRIS — pool de temas

- Segue sem confirmação forte de que "causo informal" é aposta garantida — amostra da semana 02 é pequena demais pra contradizer o relatório de 12/08, mas também não reforça. Recomendo tratar como hipótese em teste, não como certeza, até a semana 03 rodar completa com mais exemplos desse formato.
- Família "reflexão genérica sem causo" (testei/você acha que precisa/adiar) tem agora 2 relatórios seguidos com performance fraca — considerar tirar do pool por um tempo.

## RECOMENDAÇÃO ESTRATÉGICA (priorizada)

**PRIORIDADE 1** — Dado incompleto: falta 14/08 (tarde/noite), 15/08 e 16/08 inteiros. Antes de tirar conclusão definitiva da semana 02, pedir ao Ops rodar a automação e capturar esses dias (ou a Karol conferir manualmente no Instagram nativo) — sem isso, metade da semana simplesmente não existe pra análise.

**PRIORIDADE 2** — Aumentar a amostra de "causo informal + moral" na semana 03 (2-3 peças, não 1) pra confirmar ou derrubar a hipótese do relatório anterior com dado de verdade.

**PRIORIDADE 3** — Cortar/pausar a família "reflexão genérica sem causo real" do pool ativo — 2 relatórios seguidos com performance fraca.

**PRIORIDADE 4** — Confirmar com a Karol se o post "Thiago Nigro" (CTA "Comenta GRUPO") foi vazamento de agendamento antigo — ele quebra a regra do desafio e ainda assim foi o melhor Int/View da janela.

**PRIORIDADE 5** — Investigar o pico de 541 visitas ao perfil em 14/08 — fora do padrão da semana, causa não identificável com o dado da automação (janela de 25 posts pode ter perdido o post responsável).

> Aria gera análise. Karol decide o que executar.
