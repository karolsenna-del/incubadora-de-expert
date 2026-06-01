# Cronograma de Disparos WhatsApp — Workshop NDF (Exemplo Real)

> **EXEMPLO REAL — Workshop NDF do Euriler**
> Este é exemplo extraído de um lançamento real (Workshop NDF, R$27, 1-2 dias).
> Use como referência de estrutura, voz, timing, cronograma.
> NÃO copie literalmente — adapte ao contexto do aluno.
>
> Carregado por: copywriter-mensagens, estrategista-chief
>
> Fonte original: capturada em 2026-05-08 (build time)

---

# Cronograma de Disparos WhatsApp — Workshop NDF (Template)

> Template neutro do funil de comunicacao WhatsApp do workshop em formato 2 dias (sabado+domingo).
> Baseado no que rodou de fato no ciclo 25-26/04/2026.
>
> **Este doc descreve a INTENCAO de cada disparo.** Copies + datas reais vivem em `active.json` (ciclo ativo) e `arquivo/{ciclo_ref}.json` (ciclos encerrados).
>
> **Operacao:** sempre via dispatcher CLI dedicado. Nunca editar copies aqui.

---

## Visao geral

| Bloco | Disparos | Janela |
|-------|----------|--------|
| Captacao (pre-evento) | 6 | T-7d → T-1d |
| Dia 1 (Sabado) | 13 | T-1h → noite |
| Dia 2 (Domingo) | 11 | T-1h → noite |
| Pos-evento | 4 (TBD) | D+0 → D+2 |
| **Total** | **30+** | — |

**Canais:**
- `grupo` — Z-API (mensagem em grupo @todos, com mention array)
- `api` — WhatsApp Cloud API (template aprovado, envio individual)

**Variaveis usadas (vars do active.json):**
`meet_link`, `link_grupo`, `data_evento_texto`, `dia_semana`, `horario_evento`, `duracao_horas`, `data_vespera`, `dia_vespera`, `prazo_formato_aulas`, `checkout_formato_aulas`

---

## Captacao (pre-evento)

| # | Quando | Canal | Tipo | Intencao |
|---|--------|-------|------|----------|
| #1 | T-7d 18h | grupo | Boas-vindas + Checklist | Acolher comprador + setup expectativa (formato 2 dias, sem replay) + 1o upsell formato aulas |
| #1b | T-5d 10h | api | Check-in pessoal | Confirmar presenca + lembrar grupo (template `checkin_workshop_ndf`) |
| #2 | T-3d 10h | grupo | Lembrete 2 dias + setup Claude | Preparar pratica (criar conta Claude) + 2o upsell formato aulas |
| #3 | T-3d 18h | api | Lembrete pessoal | Push individual + prazo formato aulas (template `lembrete_pessoal_ndf`) |
| #4 | T-1d 10h | api | Upsell formato aulas | ULTIMO push pra quem ainda nao comprou (template `upsell_formato_aulas_ndf`, com `filter_formato_aulas`) |
| #5 | T-1d 18h | grupo | "AMANHA COMECA" | Hype final + checklist + last call formato aulas |

---

## Dia 1 — Sabado (T0 = horario inicio)

| # | Quando | Canal | Tipo | Intencao |
|---|--------|-------|------|----------|
| #d1-6 | T-1h | api | Link antecipado | Evitar perda — entrega individual (template `link_acesso_ndf`) |
| #d1-7 | T-30min | grupo | Link + intro Dia 1 | Hype + acesso publico no grupo |
| #d1-8 | T0 | grupo | "COMECOU Dia 1" | Trigger urgencia |
| #d1-9 | T+15min | api | "Cade voce?" | Recovery individual (template `cade_voce_ndf`) |
| #d1-9b | T+20min | grupo | "Voce ta atrasado!" | Pressao social grupo |
| #d1-9c | T+40min | grupo | "Ainda da tempo" | Recover atrasados |
| #d1-9d | T+45min | api | "Conseguiu entrar?" | Recovery individual 2 (template `conseguiu_entrar_ndf`) |
| #d1-9e | T+1h | grupo | "Ta fervendo" | FOMO |
| #d1-9f | T+2h | grupo | "2h de conteudo" | FOMO + tease tarde |
| #d1-10 | Almoco (~14h) | grupo | Volta almoco | Reabertura sessao |
| #d1-10b | Almoco (~14h) | api | Volta almoco pessoal | Recovery individual (template `voltamos_almoco_ndf`) |
| #d1-11 | Tarde (~17h) | grupo | "Voce comprou..." | Lembrete valor + push pra quem saiu |
| #d1-12 | Encerramento (~19h) | grupo | Encerramento Dia 1 | Acolher + reabrir Dia 2 (mesmo link amanha) |

---

## Dia 2 — Domingo (mesma estrutura, contexto "ultimo dia")

| # | Quando | Canal | Tipo | Intencao |
|---|--------|-------|------|----------|
| #d2-6 | T-1h | api | Link antecipado | Mesmo padrao Dia 1 |
| #d2-7 | T-30min | grupo | Link + intro Dia 2 | "Ultimo dia" |
| #d2-8 | T0 | grupo | "DIA 2 COMECOU" | — |
| #d2-9 | T+15min | api | "Cade voce?" | — |
| #d2-9b | T+20min | grupo | "Dia 2 ja comecou" | "O melhor fica pro ultimo dia" |
| #d2-9c | T+40min | grupo | "Ainda da tempo" | — |
| #d2-9d | T+45min | api | "Conseguiu entrar?" | — |
| #d2-9e | T+1h | grupo | "Ta fervendo Dia 2" | — |
| #d2-9f | T+2h | grupo | "2h de Dia 2" | — |
| #d2-10 | Almoco (~14h) | grupo | Volta almoco | "Ultima reta" |
| #d2-10b | Almoco (~14h25) | api | Volta almoco pessoal | — |
| #d2-11 | Tarde (~17h) | grupo | "Ultimas horas" | Push final |
| #d2-12 | Encerramento (~19h) | grupo | Bloco final | "O melhor fica pro final" |

---

## Pos-evento (TBD — nao rodaram no ciclo 25-26/04)

| # | Quando | Canal | Tipo | Intencao |
|---|--------|-------|------|----------|
| #13 | D+0 19-20h | grupo | Finalizamos + NPS + chamada oferta | Encerramento + transicao pra oferta de continuidade |
| #14 | D+2 10h | api | Ultima chance carrinho | Push individual oferta pos-evento |
| #15 | D+2 fim do dia | api | Acesso liberado | Entrega formato aulas / apostila / replay (se aplicavel) |
| #16 | D+2 | grupo | Encerramento grupo | Avisos finais + arquivamento |

> **Decidir antes de ativar:** qual a oferta pos-evento (mentoria/imersao/programa). Sem isso, esses 4 disparos ficam disabled com TODO no `active.json`.

---

## Como usar este template

**Para um novo ciclo:**
1. Copie a estrutura para o `active.json` da campanha (via dispatcher CLI)
2. Ajuste `data_evento`, `vars` e timestamps de cada disparo
3. Edite copies se necessario via CLI

**Para consultar copies do que esta ativo agora:**
- `active.json` da campanha

**Para consultar copies historicas:**
- `arquivo/{ciclo_ref}.json` da campanha

---

## Mudancas de formato

| Data | Mudanca |
|------|---------|
| 25/04/2026 | Workshop passou de 1 dia (9-19h) para 2 dias (sab+dom 10h-19h). Cronograma reestruturado: bloco unico day-D virou Dia 1 + Dia 2 espelhados |
| 13/04/2026 | Dispatcher v2 — copies + datas migraram para `active.json`. Este doc passou a descrever apenas intencao narrativa |

---

*Snapshot: 2026-05-08 — versão 1.0.0 — fonte: campanha NDF Workshop (lançamento real Euriler)*
