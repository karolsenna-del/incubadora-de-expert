# Análise Double Down #2 — "A planilha que prendia" · Dia 9 (16/07/2026)

> Analista: Aria (Squad Conteúdo Arcane)
> Input: coleta automática do workflow `instagram-metricas` (17/07 08:11 BRT) — post publicado 16/07 22:06 (~10h de vida no momento da coleta)
> Post: https://www.instagram.com/reel/Da3_pwOuBlB/
> Roteiro de origem: `posts/planilha-que-prendia/roteiro.md`
> Referência de comparação: Double Down #1 / react Canadá (`analises/2026-07-16/relatorio-dia9-react.md`) e ciclo completo (`analises/2026-07-15/relatorio-batch.md`)

---

## Números disponíveis (coleta automática, ~10h de vida)

| Métrica | Planilha/Chefe (~10h) | React Canadá (~20h) | Dedo Podre (3+ dias) |
|---------|------------------------|----------------------|------------------------|
| Alcance (contas) | **159** | 121 | 642 |
| Views | 196 | 378 | 996 |
| Curtidas | 6 | 4 | 10 |
| Comentários | 0 | 3 | 3 |
| Salvamentos | 0 | 1 | 0 |
| Compartilhamentos | 0 | 0 | 0 |
| Interações totais | 6 | 8 | 13 |
| Interação/view | **3,06%** (6/196) | 2,1% | 1,3% |
| Views por conta (rewatch) | 1,23 | 3,1 | 1,55 |

⚠️ **Dado que falta:** taxa de retenção nos 3s e tempo médio de exibição. A coleta automática (Graph API) não traz essas duas métricas — só vêm do print manual da tela de Insights do Reels específico (como nas análises anteriores). Sem isso, não dá pra diagnosticar cirurgicamente se o problema (se houver) tá no GANCHO ou na ESTRUTURA — só consigo olhar alcance e interação.

---

## Leitura possível com o dado que tenho

**Sinal parcial positivo:** com metade do tempo de vida do react Canadá (10h vs 20h), a interação/view já tá mais alta (3,06% vs 2,1%) e o alcance também (159 vs 121 contas). Ainda muito cedo e amostra pequena (196 views) pra cravar qualquer coisa — mas a tendência inicial é melhor que o double down #1.

**Zero comentários até agora** — sem leitura qualitativa possível ainda, e nenhuma resposta ao CTA "GRUPO". Não é alarmante em 10h (o react só teve os 3 comentários dele ao longo do dia seguinte), mas é o primeiro ponto a reavaliar na próxima coleta.

**Não dá pra saber ainda:**
- Se o freio de scroll do frame 1 (mock da planilha caótica) funcionou — isso só aparece na retenção 3s, que não tenho.
- Se o padrão "Dedo Podre" (história pessoal + pista falsa sustentada) se confirma de novo — preciso do tempo médio pra isso.

---

## Atualização — prints do Insights (17/07, ~14h · post com ~16h de vida)

| Métrica | Valor |
|---|---|
| Contas alcançadas | 211 |
| Visualizações | 255 |
| Tempo médio de visualização | **25s** |
| Curtidas | 7 |
| Comentários | 1 |
| Reposts / Compart. / Salvos | 0 / 0 / 0 |
| Seguidores ganhos | 1 |
| Interações totais | 8 |
| Interação/view | 3,14% |
| Interação/alcance | 3,79% |
| Rewatch (views/conta) | 1,21 |

⚠️ **Descoberta:** o app nativo não mostra mais "taxa após 3s" em nenhuma aba (Visão Geral nem Engajamento) — confirmado nos 2 prints. KB da Aria (`metricas-diagnostico.md`) atualizada: até esse dado voltar a aparecer, o diagnóstico do gancho usa o Tempo Médio como proxy.

### Diagnóstico final

✓ **TEMPO MÉDIO: 25s — recorde absoluto do ciclo** (mais que o dobro do react Canadá, 11s, que já era recorde). Pelo roteiro (45-60s alvo), isso é 42-56% do vídeo — bem acima do threshold saudável (25-30%). O gancho (mock da planilha caótica no frame 1 + pista falsa) muito provavelmente funcionou — melhor resultado composto hook+estrutura do ciclo.

△ **INTERAÇÃO: 3,14%** — abaixo do threshold de 10% pra viralizar, mas na faixa normal do ciclo.

**Leitura qualitativa do comentário:** é um emoji de uma amiga que não é lead — **aplauso de rede social, não resposta ao CTA GRUPO.** Mesmo padrão do react Canadá (Dia 9 #1): quem comentou foi audiência quente, não público novo respondendo ao chamado.

**Padrão (KB Audience) — Pattern C:** conteúdo prendeu muito bem, mas conversão em ação (CTA/comentário de estranho) segue fraca. Não é problema de gancho nem de estrutura — é CTA/notabilidade.

## Recomendação

1. **Estrutura Dedo Podre + pista falsa sustentada: RECONFIRMADA e turbinada** — melhor retenção do ciclo até aqui. Manter pra Rico usar de novo no próximo roteiro.
2. **CTA/notabilidade é o elo fraco recorrente** (2º post seguido com esse padrão: prende bem, comenta pouco fora da base quente). Vale Rico testar CTA mais específico de reconhecimento ou reforçar elemento de polêmica/identificação que puxe comentário de quem não conhece a Karol ainda.
3. Alcance (211 contas, ~16h) ainda moderado — cedo pra saber se vai crescer mais (posts do ciclo levaram dias pra acumular alcance maior).

> Aria sugere. Karol decide.
