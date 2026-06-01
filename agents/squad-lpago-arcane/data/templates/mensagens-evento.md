# Template — Mensagens do Dia do Evento

> **KB do Squad LPago Arcane — Templates**
> Tratamento: built from scratch (baseado em `data/metodo/06-antecipacao.md` + referências reais NDF em `data/exemplos/`)
> Carregado por: copywriter-mensagens

---

## Propósito

Template do output da task `construir-mensagens-evento`. Define copies operacionais do(s) dia(s) do evento — link, recovery individual de atrasados, hype social, encerramento de bloco e reabertura.

Diferente da antecipação (que prepara), as mensagens de evento **operam**: garantem comparecimento, recuperam atrasados, sustentam atenção. RC-013: cada participante a mais no início = +X% conversão.

---

## Pré-requisitos (input do Estrategista + Copywriter)

Antes de redigir, confirmar:
- Documento mestre Bloco 4 com data + horário do evento
- Documento mestre Bloco 5 com cronograma do dia do evento (T-1h, T-30min, T0, T+15min, etc.)
- Sequência de antecipação (`templates/sequencia-antecipacao.md`) já fechada — coerência narrativa
- Formato do evento: 1 dia, 2 dias, 3 dias?
- Canais ativos: grupo / api individual / ambos?

Se faltar contexto, voltar pro Estrategista.

---

## Estrutura do Output

```markdown
# Mensagens do Dia do Evento — {Nome do Lançamento}

**Data evento:** {data}
**Horário:** {hora início — hora fim}
**Formato:** {1 dia / 2 dias / N dias}
**Sala:** {ferramenta + link template}
**Canais ativos:** {grupo / api / ambos}
**Cliente:** {Euriler ou aluno + nicho}
**Versão:** v{N}
**Última atualização:** {data}

---

## Sumário do Cronograma do Dia

| # | Quando | Canal | Tipo | Intenção |
|---|--------|-------|------|----------|
| d1-6 | T-1h | api | link antecipado | acesso individual |
| d1-7 | T-30min | grupo | link + intro | hype + acesso público |
| d1-8 | T0 | grupo | "COMEÇOU" | urgência |
| d1-9 | T+15min | api | recovery 1 ("cadê você?") | individual |
| d1-9b | T+20min | grupo | "tá atrasado" | pressão social |
| d1-9c | T+40min | grupo | "ainda dá tempo" | recovery atrasados |
| d1-9d | T+45min | api | recovery 2 ("conseguiu entrar?") | individual |
| d1-9e | T+1h | grupo | "tá fervendo" | FOMO |
| d1-9f | T+2h | grupo | "2h de conteúdo" | tease |
| d1-10 | ~14h | grupo + api | volta almoço | reabertura sessão |
| d1-11 | ~17h | grupo | "você comprou..." | lembrete valor |
| d1-12 | ~19h | grupo | encerramento | acolher + reabrir D2 (se 2 dias) |

(Repetir bloco DIA 2 com nuances — "último dia", "o melhor fica pro final", etc.)

---

## Disparos Detalhados

### Disparo {dN-id} — {Nome curto}

**Quando:** {timing relativo ao início do evento}
**Canal:** {grupo / api}
**Tipo:** {link / hype / recovery / FOMO / volta sessão / encerramento}
**Variáveis dinâmicas:** {{first_name}}, {{meet_link}}, etc.
**Filtros:** {se aplicável}

**Objetivo do método:** {por que esse disparo existe — conforme `data/metodo/06-antecipacao.md` ou raciocínio explícito}

**Copy:**

```
{texto literal}
```

**Validação contra Regras Cardinais:**
- RC-{N}: {confirmação ou ressalva}

**Notas operacionais:**
- {detalhes — ex: "se sala for Zoom, anexar link nativo na mensagem"}

---

(Repetir pra todos os disparos do dia)
```

---

## Padrões por Tipo de Mensagem

### Link antecipado (T-1h)
- Canal: api individual
- Body curto (até 100 palavras)
- Variável `{{meet_link}}` obrigatória
- Tom: pessoal, leve, instrutivo ("aqui está seu link", "use computador pra melhor experiência")

### Link público (T-30min)
- Canal: grupo
- Body médio
- Hype + intro do bloco
- "Começamos em 30 minutos"

### "COMEÇOU" (T0)
- Canal: grupo
- Body curto + emoji 🚨/🔥/⚡
- Urgência sem desespero
- Repetir o link

### Recovery individual (T+15min, T+45min)
- Canal: api individual
- Body curto
- Tom: cuidado + cobrança leve
- "Cadê você?" / "Conseguiu entrar?" / "Tô esperando"
- Repetir link

### Hype social / FOMO (T+20min, T+1h, T+2h)
- Canal: grupo
- Body curto
- Tom: pressão social positiva
- "Tá fervendo aqui dentro" / "Quem entrou tá pirando" / "X horas de conteúdo já"
- Sem desespero — energia alta

### Volta de almoço/intervalo
- Canal: grupo + api
- Body médio
- Tom: reabertura energética
- Lembrar do que vem na próxima parte ("agora vamos pra prática", "agora o pitch")

### Lembrete valor (~17h, antes do pitch)
- Canal: grupo
- Body médio
- Tom: ancoragem do que recebeu até aqui
- Prepara terreno pra pitch sem soar "vendendo"

### Encerramento dia
- Canal: grupo
- Body médio-longo
- Tom: acolhida + reabertura
- Se 2 dias: "Amanhã continuamos. Mesmo link." + descansa, processa, volta amanhã
- Se 1 dia: gancho pro pós (replay, oferta, recuperação)

---

## Regras de Redação (preservar)

### Tom Euriler (`data/metodo/REPERTORIO.md`)
- PT-BR casual, energia alta sem ser apelativo
- "Vem", "tá", "cara", "amigo(a)" ok
- Frases curtas. Pontuação forte (! e ⚡ pra urgência)
- Negrito *raro* — apenas pra ênfase real
- Sem corporatives ("nesse momento decisivo", "experiência transformadora")

### Variáveis comuns
- `{{first_name}}` — nome (em api individual)
- `{{meet_link}}` — link da sala
- `{{dia_semana}}` — "sábado", "domingo"
- `{{checkout_formato_aulas}}` — link upsell se ativo

### Estrutura por momento
- **Antes do início:** preparação + acolhida
- **Durante:** energia + recovery + sustento de atenção
- **Pós-bloco:** reabertura ou encerramento

---

## Validação Final (checklist obrigatório)

- [ ] Cobertura T-1h até encerramento do dia
- [ ] Recovery individual em pelo menos 2 momentos (T+15min e T+45min)
- [ ] Hype social no grupo em pelo menos 3 momentos
- [ ] Volta de almoço ou intervalo coberto se evento >4h
- [ ] Encerramento prepara D2 (se 2 dias) ou pós-evento (se 1 dia)
- [ ] Variáveis dinâmicas listadas em cada disparo
- [ ] Tom Euriler preservado
- [ ] Sem promessa hard-sell durante o evento ao vivo (RC-019: pitch tem hora própria)
- [ ] Compatibilidade com dispatcher/api do aluno

---

## Anti-padrões (NÃO fazer)

- Mensagem longa quando o usuário tá tentando entrar na sala (ele não vai ler)
- Recovery individual em massa (api individual NÃO é grupo — é 1:1)
- Hype falso ("transformação", "evento exclusivo", "decisão da sua vida")
- Repetir mesma frase em canais diferentes (cada canal tem voz)
- Encerramento sem ponte pro próximo dia / pós (frustra expectativa)
- Linkar oferta no meio do evento ao vivo (mata atenção e quebra fluxo do pitch)

---

## Referências dentro da KB

- Protocolo de evento: `data/metodo/07-evento-pitch.md` (princípios SEED, ancoragem, drives, timing)
- Antecipação adjacente: `data/metodo/06-antecipacao.md`
- Regras Cardinais aplicáveis: RC-013 (comparecimento), RC-019 (pitch tem timing), RC-020 (ancoragem de tempo)
- Tom Euriler: `data/metodo/REPERTORIO.md`
- Exemplos reais NDF (copies do dia do evento): `data/exemplos/active-ndf-ciclo-real.md` (seção DIA 1 + DIA 2)
- Ciclo histórico completo executado: `data/exemplos/ciclo-historico-2026-04-26.md`

---

**Última atualização:** 2026-05-08
**Versão:** 1.0.0
