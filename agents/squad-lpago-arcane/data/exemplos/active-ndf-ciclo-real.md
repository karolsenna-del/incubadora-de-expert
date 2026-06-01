# Disparos WhatsApp — Ciclo Ativo NDF (Exemplo Real)

> **EXEMPLO REAL — Workshop NDF do Euriler**
> Este é exemplo extraído de um lançamento real (Workshop NDF, R$27, 1-2 dias).
> Use como referência de estrutura, voz, timing, cronograma.
> NÃO copie literalmente — adapte ao contexto do aluno.
>
> Carregado por: copywriter-mensagens, estrategista-chief
>
> Fonte original: capturada em 2026-05-08 (build time)

---

## Metadados do Ciclo

| Campo | Valor |
|-------|-------|
| Campaign slug | `ndf-workshop` |
| Ciclo ref | `2026-05-24` |
| Data evento | 2026-05-23 (sábado) + 2026-05-24 (domingo) |
| Data início captação | 2026-04-25 |
| Horário evento | 10h às 19h |
| Duração | 2 dias (~19h ao vivo) |
| Audience produto pattern | `*Workshop*Neg*` (exclude `*GRAVA*`) |

### Variáveis usadas no ciclo

| Var | Valor |
|-----|-------|
| `meet_link` | https://meet.google.com/vdy-awbe-hhe |
| `link_grupo` | https://www.grupify.com.br/r/workshop-ndf |
| `checkout_formato_aulas` | https://pay.hotmart.com/T104436102Y?sck=grupo-ndf-NDF0524 |
| `data_evento_texto` | Sábado e Domingo, 23 e 24 de maio |
| `dia_semana` | Sábado e Domingo |
| `horario_evento` | 10h às 19h |
| `duracao_horas` | 2 dias (~19h ao vivo) |
| `data_vespera` | 22/05 |
| `dia_vespera` | sexta-feira |
| `prazo_formato_aulas` | sexta-feira (22/05) |

---

# FASE: PRÉ-EVENTO (Captação)

## Disparo #1 — Boas-vindas + Checklist (PRE | T-7d 18h | grupo)

**Objetivo:** Acolher comprador + setup expectativa (formato 2 dias, sem replay) + 1º upsell formato aulas
**When:** 2026-05-16T18:00:00-03:00

**Copy:**

```
Em 1 semana vamos nos encontrar no Workshop Negócio Digital do Futuro e eu preciso que você leia esse checklist com atenção.

{{dia_semana}} eu vou abrir ao vivo o sistema que uso pra operar um negócio digital lucrativo SOZINHO com IA. Método PMI na prática. {{duracao_horas}} de conteúdo ao vivo.

🔍 *INFORMAÇÕES IMPORTANTES:*

➡️ *ONDE*
100% online, ao vivo. O link de acesso será enviado aqui no grupo *30 minutos antes*.

⏰ *QUANDO*
{{data_evento_texto}} | {{horario_evento}}
Teremos pausas para almoço e intervalos.

📱 *SE PREPARE*
• Computador com bateria carregada
• Internet estável
• Ambiente tranquilo

📹 *E O REPLAY?*
O workshop é ao vivo e NÃO terá replay. A única forma de rever o conteúdo depois é com o *formato aulas*.

🎓 *FORMATO AULAS*
Todo o conteúdo do workshop organizado em aulas, numa plataforma com *1 ano de acesso* pra você rever e aprofundar no seu ritmo.

⚠️ O formato aulas só pode ser adquirido *até {{dia_vespera}} ({{data_vespera}})*. No {{dia_semana}} ao vivo o Euriler *não vai vender*.

👉 Clica aqui pra garantir o formato aulas: {{checkout_formato_aulas}}

Te espero {{dia_semana}}!

Euriler
```

**Variáveis usadas:** `{{dia_semana}}`, `{{duracao_horas}}`, `{{data_evento_texto}}`, `{{horario_evento}}`, `{{dia_vespera}}`, `{{data_vespera}}`, `{{checkout_formato_aulas}}`

---

## Disparo #1b — Check-in pessoal (PRE | T-5d 10h | api)

**Objetivo:** Confirmar presença + lembrar grupo
**Template Meta:** `checkin_workshop_ndf`
**Agent ID:** bia-convite
**When:** 2026-05-18T10:00:00-03:00

**Copy:** (template Meta API — body vive na conta Meta do Euriler)

**Parâmetros enviados:** `first_name`, `data_evento_texto`, `link_grupo`, `data_vespera`

---

## Disparo #2 — Lembrete 2 dias + setup Claude (PRE | T-3d 10h | grupo)

**Objetivo:** Preparar prática (criar conta Claude) + 2º upsell formato aulas
**When:** 2026-05-20T10:00:00-03:00

**Copy:**

```
Faltam 2 dias.

Nesse {{dia_semana}} eu vou te mostrar como se posicionar nesse novo mercado digital. Tudo mudou com a IA — e quem entender esse novo tempo vai ter uma vantagem absurda. Eu vou te mostrar ao vivo como usar a IA como sistema operacional do seu negócio. Com prática.

📌 *Anota:*
• {{data_evento_texto}}, das {{horario_evento}}
• São 2 DIAS de workshop ao vivo
• Link de acesso enviado aqui 30min antes
• Sem replay — só pra quem estiver ao vivo

🤖 *Já criou sua conta no Claude?*
No workshop teremos prática ao vivo. Se ainda não fez:
• Acesse *claude.ai* e crie sua conta
• Baixe o app no computador (Mac ou Windows)
• Se puder, ative o plano *Claude Pro* (~R$100/mês) pra praticar junto ao vivo

Não é obrigatório — quem não tiver vai acompanhar tudo normalmente. Mas quem tiver o Claude aberto vai sair do workshop com coisa feita.

⚠️ *FORMATO AULAS — só até {{dia_vespera}}!*

Você só tem até *{{dia_vespera}}* pra garantir o Workshop em formato de aulas. Depois disso, acabou.

O formato aulas te dá todo o conteúdo separado em aulas, numa plataforma com *1 ano de acesso* pra você rever e aprofundar cada parte.

São {{duracao_horas}} de conteúdo — muita coisa pra absorver em 2 dias. Quem tem o formato aulas revê tudo no ritmo certo. No {{dia_semana}} ao vivo, *não vai ter essa venda*.

👉 Clica aqui pra garantir o formato aulas: {{checkout_formato_aulas}}

Euriler
```

**Variáveis usadas:** `{{dia_semana}}`, `{{data_evento_texto}}`, `{{horario_evento}}`, `{{dia_vespera}}`, `{{duracao_horas}}`, `{{checkout_formato_aulas}}`

---

## Disparo #3 — Lembrete pessoal (PRE | T-3d 18h | api)

**Objetivo:** Push individual + prazo formato aulas
**Template Meta:** `lembrete_pessoal_ndf`
**Agent ID:** bia-convite
**When:** 2026-05-20T18:00:00-03:00

**Copy:** (template Meta API)

**Parâmetros enviados:** `first_name`, `data_evento_texto`, `prazo_formato_aulas`

---

## Disparo #4 — Upsell formato aulas (PRE | T-1d 10h | api)

**Objetivo:** ÚLTIMO push pra quem ainda não comprou formato aulas
**Template Meta:** `upsell_formato_aulas_ndf`
**Agent ID:** bia-convite
**Filtro crítico:** `filter_formato_aulas: true` (envia só pra quem NÃO comprou)
**When:** 2026-05-22T10:00:00-03:00

**Copy:** (template Meta API)

**Parâmetros enviados:** `first_name`

---

## Disparo #5 — "AMANHÃ COMEÇA" (PRE | T-1d 18h | grupo)

**Objetivo:** Hype final + checklist + last call formato aulas
**When:** 2026-05-22T18:00:00-03:00

**Copy:**

```
*AMANHÃ COMEÇA.*

O Workshop Negócio Digital do Futuro começa amanhã (Sábado) e vai até Domingo, das {{horario_evento}}, AO VIVO.

*O que esperar:*
• 2 dias intensos de conteúdo ao vivo
• Entender o novo tempo digital e onde você se encaixa nele
• IA como sistema operacional — funcionando ao vivo na sua frente
• Prática com Claude — você vai fazer junto comigo

Se prepare pra sair diferente de como entrou.

📌 *Prepare-se:*
• Computador + internet estável
• Ambiente tranquilo (são 2 dias de conteúdo)
• Papel e caneta ou bloco de notas
• *Claude aberto no computador* (claude.ai — se ainda não criou conta, cria agora)

⚠️ *Não terá replay.* A única forma de rever o conteúdo depois é com o formato aulas.

🚨 *HOJE É O ÚLTIMO DIA* pra garantir o formato aulas. No Sábado ao vivo o Euriler *não vai vender*. Depois de hoje, acabou.

👉 Clica aqui pra garantir o formato aulas: {{checkout_formato_aulas}}

O link de acesso será enviado aqui no grupo 30min antes.

Nos vemos amanhã!

Euriler
```

**Variáveis usadas:** `{{horario_evento}}`, `{{checkout_formato_aulas}}`

---

# FASE: DIA 1 (Sábado)

## Disparo #d1-6 — Link antecipado individual (DIA 1 | T-1h | api)

**Objetivo:** Evitar perda — entrega individual
**Template Meta:** `link_acesso_ndf`
**When:** 2026-05-23T09:00:00-03:00

**Parâmetros enviados:** `first_name`, `meet_link`

---

## Disparo #d1-7 — Link + intro Dia 1 (DIA 1 | T-30min | grupo)

**Objetivo:** Hype + acesso público no grupo
**When:** 2026-05-23T09:30:00-03:00

**Copy:**

```
🔗 *ACESSO AO WORKSHOP NEGÓCIO DIGITAL DO FUTURO — DIA 1*

Aqui está o seu link de acesso 👇🏼

Sala: {{meet_link}}

📌 *Dica:* Use computador pra melhor experiência. Se tiver problema de áudio, recarregue a página.

São 2 dias de workshop. Hoje é o Dia 1. Começamos em 30 minutos. Te vejo lá dentro! 🔥
```

**Variáveis usadas:** `{{meet_link}}`

---

## Disparo #d1-8 — "COMEÇOU Dia 1" (DIA 1 | T0 | grupo)

**Objetivo:** Trigger urgência
**When:** 2026-05-23T10:00:00-03:00

**Copy:**

```
🔥 COMEÇOU! DIA 1

O Workshop Negócio Digital do Futuro tá ao vivo AGORA.

Sala 👉🏼 {{meet_link}}
```

**Variáveis usadas:** `{{meet_link}}`

---

## Disparo #d1-9 — "Cadê você?" (DIA 1 | T+15min | api)

**Objetivo:** Recovery individual
**Template Meta:** `cade_voce_ndf`
**When:** 2026-05-23T10:15:00-03:00

**Parâmetros enviados:** `first_name`, `meet_link`

---

## Disparo #d1-9b — "Você tá atrasado!" (DIA 1 | T+20min | grupo)

**Objetivo:** Pressão social grupo
**When:** 2026-05-23T10:20:00-03:00

**Copy:**

```
Você está atrasado!! 🚨

Dia 1 já começou e não vai ter replay. Vem!

Sala 👉🏼 {{meet_link}}
```

**Variáveis usadas:** `{{meet_link}}`

---

## Disparo #d1-9c — "Ainda dá tempo" (DIA 1 | T+40min | grupo)

**Objetivo:** Recover atrasados
**When:** 2026-05-23T10:40:00-03:00

**Copy:**

```
Ainda dá tempo!

Agora que o conteúdo tá esquentando. São 2 dias ao vivo — e o que passar, passou.

Sala 👉🏼 {{meet_link}}
```

**Variáveis usadas:** `{{meet_link}}`

---

## Disparo #d1-9d — "Conseguiu entrar?" (DIA 1 | T+45min | api)

**Objetivo:** Recovery individual 2
**Template Meta:** `conseguiu_entrar_ndf`
**When:** 2026-05-23T10:45:00-03:00

**Parâmetros enviados:** `first_name`, `meet_link`

---

## Disparo #d1-9e — "Tá fervendo" (DIA 1 | T+1h | grupo)

**Objetivo:** FOMO
**When:** 2026-05-23T11:00:00-03:00

**Copy:**

```
🔥 Tá fervendo aqui dentro!

Se você ainda não entrou, entra agora. O que tá rolando não vai se repetir.

Sala 👉🏼 {{meet_link}}
```

**Variáveis usadas:** `{{meet_link}}`

---

## Disparo #d1-9f — "2h de conteúdo" (DIA 1 | T+2h | grupo)

**Objetivo:** FOMO + tease tarde
**When:** 2026-05-23T12:00:00-03:00

**Copy:**

```
Já são 2 horas de conteúdo e o chat tá em chamas.

E isso é só o começo. A tarde vai ser ainda mais intensa. E amanhã tem mais.

Se você não tá dentro, tá perdendo.

Sala 👉🏼 {{meet_link}}
```

**Variáveis usadas:** `{{meet_link}}`

---

## Disparo #d1-10 — Volta almoço (DIA 1 | ~14h | grupo)

**Objetivo:** Reabertura sessão
**When:** 2026-05-23T14:00:00-03:00

**Copy:**

```
Acabamos de voltar do almoço e o Dia 1 do Workshop já tá ao vivo de novo!

A manhã foi pesada, mas a tarde vai ser ainda melhor. Bora?

Sala 👉🏼 {{meet_link}}
```

**Variáveis usadas:** `{{meet_link}}`

---

## Disparo #d1-10b — Volta almoço pessoal (DIA 1 | ~14h | api)

**Objetivo:** Recovery individual
**Template Meta:** `voltamos_almoco_ndf`
**When:** 2026-05-23T14:00:00-03:00

**Parâmetros enviados:** `first_name`, `meet_link`

---

## Disparo #d1-11 — "Você comprou..." (DIA 1 | ~17h | grupo)

**Objetivo:** Lembrete valor + push pra quem saiu
**When:** 2026-05-23T17:00:00-03:00

**Copy:**

```
Você comprou um workshop de 2 dias ao vivo, sem replay, com tudo que você precisa pra montar um negócio digital com IA.

Se você saiu, volta. Se não entrou, entra. O que tá rolando agora não vai se repetir.

Sala 👉🏼 {{meet_link}}
```

**Variáveis usadas:** `{{meet_link}}`

---

## Disparo #d1-12 — Encerramento Dia 1 (DIA 1 | ~19h | grupo)

**Objetivo:** Acolher + reabrir Dia 2 (mesmo link amanhã)
**When:** 2026-05-23T19:00:00-03:00

**Copy:**

```
Encerramos o Dia 1! 🔥

Foi intenso. Se você esteve presente, parabéns — já absorveu mais do que a maioria consegue em meses.

Amanhã (Domingo) continuamos às 10h. *Mesmo link:*

Sala 👉🏼 {{meet_link}}

Descansa, processa o que viu hoje, e volta amanhã com a mente aberta. O melhor ainda tá por vir.

Euriler
```

**Variáveis usadas:** `{{meet_link}}`

---

# FASE: DIA 2 (Domingo)

## Disparo #d2-6 — Link antecipado individual (DIA 2 | T-1h | api)

**Template Meta:** `link_acesso_ndf`
**When:** 2026-05-24T09:00:00-03:00

**Parâmetros enviados:** `first_name`, `meet_link`

---

## Disparo #d2-7 — Link + intro Dia 2 (DIA 2 | T-30min | grupo)

**Objetivo:** "Último dia"
**When:** 2026-05-24T09:30:00-03:00

**Copy:**

```
🔗 *DIA 2 — ACESSO AO WORKSHOP*

Bom dia! Hoje é o último dia do Workshop Negócio Digital do Futuro.

Sala: {{meet_link}}

Começamos em 30 minutos. Mesmo link de ontem. Te vejo lá dentro! 🔥
```

**Variáveis usadas:** `{{meet_link}}`

---

## Disparo #d2-8 — "DIA 2 COMEÇOU" (DIA 2 | T0 | grupo)

**When:** 2026-05-24T10:00:00-03:00

**Copy:**

```
🔥 DIA 2 COMEÇOU!

Último dia do Workshop. Tá ao vivo AGORA.

Sala 👉🏼 {{meet_link}}
```

**Variáveis usadas:** `{{meet_link}}`

---

## Disparo #d2-9 — "Cadê você?" (DIA 2 | T+15min | api)

**Template Meta:** `cade_voce_ndf`
**When:** 2026-05-24T10:15:00-03:00

**Parâmetros enviados:** `first_name`, `meet_link`

---

## Disparo #d2-9b — "Dia 2 já começou" (DIA 2 | T+20min | grupo)

**Objetivo:** "O melhor fica pro último dia"
**When:** 2026-05-24T10:20:00-03:00

**Copy:**

```
Dia 2 já começou! 🚨

Se você veio ontem e tá pensando em pular hoje — não faz isso. O melhor sempre fica pro último dia.

Sala 👉🏼 {{meet_link}}
```

**Variáveis usadas:** `{{meet_link}}`

---

## Disparo #d2-9c — "Ainda dá tempo" (DIA 2 | T+40min | grupo)

**When:** 2026-05-24T10:40:00-03:00

**Copy:**

```
Ainda dá tempo de entrar!

Dia 2 tá ao vivo. Conteúdo de hoje complementa tudo de ontem.

Sala 👉🏼 {{meet_link}}
```

**Variáveis usadas:** `{{meet_link}}`

---

## Disparo #d2-9d — "Conseguiu entrar?" (DIA 2 | T+45min | api)

**Template Meta:** `conseguiu_entrar_ndf`
**When:** 2026-05-24T10:45:00-03:00

**Parâmetros enviados:** `first_name`, `meet_link`

---

## Disparo #d2-9e — "Tá fervendo Dia 2" (DIA 2 | T+1h | grupo)

**When:** 2026-05-24T11:00:00-03:00

**Copy:**

```
🔥 Tá fervendo aqui no Dia 2!

Se você ainda não entrou, entra agora. Último dia.

Sala 👉🏼 {{meet_link}}
```

**Variáveis usadas:** `{{meet_link}}`

---

## Disparo #d2-9f — "2h de Dia 2" (DIA 2 | T+2h | grupo)

**When:** 2026-05-24T12:00:00-03:00

**Copy:**

```
2 horas de Dia 2 e o chat tá mais intenso que ontem.

A tarde vai ser o encerramento de tudo. Não perca.

Sala 👉🏼 {{meet_link}}
```

**Variáveis usadas:** `{{meet_link}}`

---

## Disparo #d2-10 — Volta almoço (DIA 2 | ~14h | grupo)

**Objetivo:** "Última reta"
**When:** 2026-05-24T14:00:00-03:00

**Copy:**

```
Voltamos do almoço! Última reta do Workshop. 🔥

A tarde de hoje é o fechamento de 2 dias de conteúdo. Bora?

Sala 👉🏼 {{meet_link}}
```

**Variáveis usadas:** `{{meet_link}}`

---

## Disparo #d2-10b — Volta almoço pessoal (DIA 2 | ~14h25 | api)

**Template Meta:** `voltamos_almoco_ndf`
**When:** 2026-05-24T14:25:00-03:00

**Parâmetros enviados:** `first_name`, `meet_link`

---

## Disparo #d2-11 — "Últimas horas" (DIA 2 | ~17h | grupo)

**Objetivo:** Push final
**When:** 2026-05-24T17:00:00-03:00

**Copy:**

```
Últimas horas do Workshop. 2 dias de conteúdo, e o bloco final é agora.

Se você saiu, volta. Se não veio hoje, perdeu — mas ainda dá tempo de pegar o encerramento.

Sala 👉🏼 {{meet_link}}
```

**Variáveis usadas:** `{{meet_link}}`

---

## Disparo #d2-12 — Bloco final (DIA 2 | ~19h | grupo)

**Objetivo:** "O melhor fica pro final"
**When:** 2026-05-24T19:00:00-03:00

**Copy:**

```
Últimas horas do Workshop. Bloco final do Dia 2.

O melhor sempre fica pro final. Se você saiu, volta agora.

Sala 👉🏼 {{meet_link}}
```

**Variáveis usadas:** `{{meet_link}}`

---

*Snapshot: 2026-05-08 — versão 1.0.0 — fonte: campanha NDF Workshop ciclo 2026-05-24 (lançamento real Euriler)*
