# Template — Recuperação de Venda de Ingresso

> **KB do Squad LPago Arcane — Templates**
> Tratamento: built from scratch (baseado em `data/metodo/10-recuperacao-ingresso.md`)
> Carregado por: copywriter-mensagens

---

> ⚠️ **NÃO CONFUNDIR COM `downsell-pos-evento.md`**
>
> - **Este template (recuperacao-ingresso.md):** ação DURANTE captação. Vende INGRESSO. Trigger: lead deixou contato + abandonou checkout. Cadência começa T+15min.
> - **`downsell-pos-evento.md`:** ação DEPOIS do evento. Vende oferta alternativa (Meteórico) pós-pitch. Cadência D+1 a D+7.
>
> Trigger, momento e produto vendido são DIFERENTES.

---

## Propósito

Template do output da task `construir-recuperacao-ingresso`. Define a sequência completa de mensagens (6 disparos) pra recuperar leads que abandonaram o checkout do ingresso DURANTE a captação.

Disparo 1 (15min) está coberto integralmente — fundamentos validados pelo Euriler em 2026-05-08. Disparos 2-6 ficam estruturais com TBD claro até detalhamento futuro.

---

## Pré-Requisitos (input do Estrategista)

- Documento mestre Bloco 4 (cronograma) com data início vendas — define janela em que recuperação roda
- Documento mestre Bloco 6 (metas) com preço atual de ingresso definido — usado pra calcular preço de recuperação (R$20 abaixo)
- Stack tecnológico definido (qual ferramenta vai disparar) — Cloud API + N8N + Bia (validado Euriler), SellFlux, DevZapp, etc.
- Decisão: usar agente IA conversacional? Sim/Não — define se CTA dual inclui botão "falar com IA" ou só link direto
- Roteiro do vídeo do expert (15-30s) — gravado pelo expert ou pelo aluno antes do disparo

Se faltar contexto, voltar pro Estrategista.

---

## Estrutura do Output

```markdown
# Recuperação de Venda de Ingresso — {ciclo}

## Configuração Geral
- Ciclo: {ex: NDF Workshop 2026-05-16}
- Stack: {ex: Cloud API + N8N + Bia}
- Preço atual ingresso: R${preco_atual}
- Preço de recuperação (cupom): R${preco_recuperacao} (= preço atual - R$20)
- Vídeo expert: {link/path}

## Disparo 1 — T+15min (DETALHADO)
[email + WhatsApp template completo]

## Disparos 2-6 — PLACEHOLDERS
[estrutura com TBD claro]

## Configuração Técnica
[trigger automático, delays, condicionais]

## Variáveis Dinâmicas
[lista completa]

## Validação Final
[checklist]
```

---

## Disparo 1 — Detalhe Completo

**Quando:** T+15min após virar lead sem comprar
**Canais:** Email + WhatsApp individual SIMULTÂNEO
**Trigger automático:** Pixel/postback do checkout abandonado captura contato → N8N agenda delay 15min → dispara em paralelo

### 1.1 Email

**Subject:**
```
{{first_name}}, vi que você quase entrou no {{workshop_nome}}...
```

**Preheader:**
```
Tenho um cupom especial pra você. Te explico em 30 segundos.
```

**Corpo (plain text + vídeo embed):**
```
Oi {{first_name}},

[VÍDEO 15-30s do expert: "vi que você se interessou no
workshop, sei que talvez tenha ficado em dúvida — é normal.
Preparei um cupom especial pra você entrar."]

Vi que você chegou no checkout do {{workshop_nome}} mas não
finalizou. Talvez algo tenha distraído ou você ficou em
dúvida no preço.

Quero te dar uma chance: cupom de R${{preco_recuperacao}}
(R$20 abaixo do lote atual de R${{preco_atual}}).

[BOTÃO: "Garantir vaga por R${{preco_recuperacao}}"]
{{link_checkout_com_cupom}}

Se quiser tirar dúvida antes, fala com a {{nome_agente_ia}}:
{{link_ia_conversacional}}

Te espero,
{{nome_expert}}

P.S.: Cupom é por tempo limitado. Se demorar, perde.
```

**Custom fields:** `{{first_name}}`, `{{workshop_nome}}`, `{{preco_recuperacao}}`, `{{preco_atual}}`, `{{link_checkout_com_cupom}}`, `{{nome_agente_ia}}`, `{{link_ia_conversacional}}`, `{{nome_expert}}`

### 1.2 WhatsApp Individual (Template Meta)

```
TEMPLATE NAME (sugestão): recuperacao_ingresso_15min_{nicho}
CATEGORIA: Marketing
IDIOMA: pt_BR

[HEADER]
Tipo: VIDEO (vídeo do expert 15-30s)

[BODY com parametros]
{{1}} = first_name
{{2}} = workshop_nome
{{3}} = preco_recuperacao (ex: "27")
{{4}} = preco_atual (ex: "47")

[BODY REDIGIDO]
{{1}}! 👋

Vi que você se interessou no {{2}} mas não finalizou a inscrição.

Tenho um cupom especial pra você: *R${{3}}* (R$20 abaixo do lote atual de R${{4}}).

Garante aqui ou se quiser tirar dúvida antes, fala comigo. 🔥

[BUTTONS]
1. URL: "Garantir vaga por R${{3}}" → {{link_checkout_com_cupom}}
2. Quick Reply: "Falar com {{nome_agente_ia}}"

[NOTA TODO]
[!] Esse template precisa ser aprovado na Meta antes do disparo.
    Categoria Marketing exige opt-in via checkout (lead concordou
    com termos). Validar com Euriler/aluno se template já existe
    ou precisa criar.
```

**Variáveis dinâmicas:**
- `{{first_name}}` — primeiro nome do lead (capturado no checkout)
- `{{workshop_nome}}` — nome do workshop/evento
- `{{preco_recuperacao}}` — preço atual menos R$20 (ex: 27, 37, 47)
- `{{preco_atual}}` — lote atual de ingresso (ex: 47, 57, 67)
- `{{link_checkout_com_cupom}}` — URL com cupom já aplicado (lead clica e entra com desconto)
- `{{nome_agente_ia}}` — nome do agente conversacional (ex: "Bia"). Se aluno não usa IA, omitir.
- `{{link_ia_conversacional}}` — URL/deep-link pra conversa com agente IA. Se aluno não usa IA, omitir.
- `{{nome_expert}}` — nome do expert dono do lançamento

---

## Disparos 2-6 — PLACEHOLDERS

> ⚠️ Conteúdo e timing dos disparos 2-6 ainda **NÃO foram detalhados pelo Euriler**. Estrutura abaixo é placeholder pra captura futura.

### Disparo 2 — TBD

```
QUANDO: TBD (provavelmente algumas horas após Disparo 1, mas timing exato não foi ensinado)
CANAIS: Email + WhatsApp individual SIMULTÂNEO

EMAIL:
- Subject: TBD
- Preheader: TBD
- Body: TBD

WHATSAPP TEMPLATE:
- Body: TBD
- Buttons: TBD

INTENÇÃO: TBD (provável: lembrar do cupom + reforçar escassez)
ANTI-PADRÃO: TBD
```

### Disparo 3 — TBD

```
QUANDO: TBD
CANAIS: TBD (provável: email + WhatsApp)
INTENÇÃO: TBD
COPY: TBD
```

### Disparo 4 — TBD

```
QUANDO: TBD
CANAIS: TBD
INTENÇÃO: TBD
COPY: TBD
```

### Disparo 5 — TBD

```
QUANDO: TBD
CANAIS: TBD
INTENÇÃO: TBD
COPY: TBD
```

### Disparo 6 — TBD (último, desiste após)

```
QUANDO: TBD
CANAIS: TBD
INTENÇÃO: TBD — última chance + sem mais retorno se não converter
COPY: TBD
PÓS-ESGOTAMENTO: lead removido do fluxo de recuperação. Não vira spam.
```

---

## Configuração Técnica

### Trigger (automático)

```
[Pixel/postback de checkout abandonado dispara]
       ↓
   [Webhook captura: nome, email, telefone, valor, link checkout]
       ↓
   [N8N (ou ferramenta equivalente) agenda delay 15min]
       ↓
   [Após 15min, dispara em paralelo:]
       ├── Email (template MailerLite/ConvertKit/etc.)
       └── WhatsApp Cloud API (template aprovado Meta)
       ↓
   [Aguarda evento: compra OU resposta OU timeout]
       ↓
   [Se compra: encerra fluxo, lead vai pra sequência de antecipação normal]
   [Se timeout: aciona Disparo 2 (cadência TBD)]
   [Após 6 disparos sem conversão: encerra, remove do fluxo]
```

### Parâmetros Configuráveis

- **Delay Disparo 1:** 15min (fixo, validado)
- **Delay Disparos 2-6:** TBD
- **Limite total de disparos:** 6 (5 follow-ups após o primeiro)
- **Janela de detecção de abandono:** 10-30min sem retorno ao checkout
- **Opt-in WhatsApp:** lead concordou com termos no checkout (consentimento Cloud API)
- **Sender email warm:** sender precisa ter histórico (não usar email novo pra recuperação)

### Condicionais

- Lead converteu em qualquer disparo → encerra fluxo
- Lead respondeu WhatsApp → encerra fluxo automático, vai pro agente IA conversacional
- Lead respondeu email com unsubscribe → remove de tudo (legal)
- Lead bloqueou WhatsApp → continua só email
- Esgotou 6 disparos → remove do fluxo, sem retomada

---

## Validação Final (checklist)

- [ ] Disparo 1 com vídeo do expert (15-30s) embedado
- [ ] Cupom = preço atual menos R$20 (ex: R$47 → R$27)
- [ ] Cupom dentro da faixa do método (R$27-R$67 — RC-015)
- [ ] CTA dual: link direto OU IA conversacional (ou ambos)
- [ ] Email + WhatsApp simultâneos (não sequenciais)
- [ ] Trigger automático configurado (não manual)
- [ ] Delay de 15min exato (não 1h, não 5min)
- [ ] Stack do aluno escolhido e operacional
- [ ] Limite máximo de 6 disparos respeitado
- [ ] Opt-in WhatsApp via checkout (consentimento Cloud API)
- [ ] Template Meta com TODO claro de aprovação se ainda não existe
- [ ] Variáveis dinâmicas declaradas e mapeadas pra ferramenta
- [ ] Disparos 2-6 marcados explicitamente como TBD (sem inventar)
- [ ] Distinção clara vs downsell-pos-evento.md (header com aviso)
- [ ] RC-015 verificada (preço de recuperação dentro da faixa)

---

## Anti-padrões (NÃO fazer)

- **Inventar copies pros disparos 2-6** — Euriler ainda não detalhou. Marca TBD honesto.
- **Cupom abaixo de R$27** — sai da faixa do método (RC-015). Lead sem grana não compra mesmo a R$17.
- **Manual em vez de automático** — lead que abandona às 3h da manhã não pode esperar.
- **Disparo 1 sem vídeo do expert** — mensagem genérica converte muito menos.
- **Mais de 6 disparos** — queima lead, vira spam, contamina sender.
- **Confundir com downsell pós-evento** — escopos diferentes (ver header desse template).
- **Cupom igual ao lote inicial** — não dá desconto real, lead percebe e quebra confiança.
- **Disparar Marketing sem opt-in** — viola política Meta Cloud API, gera bloqueio.
- **Misturar gramática de canal** — body de email longo dentro de template Meta API não funciona.

---

## TODOs Ativos

- [ ] Detalhar Disparos 2-6 (timing + canal + copy + intenção) — aguarda Euriler
- [ ] Roteiro literal do vídeo do expert (15-30s) — aguarda Euriler
- [ ] Calibrar métricas reais por nicho — aguarda ciclos com recuperação ativa
- [ ] Validar limite anti-spam Cloud API por dia — aguarda teste

---

**Última atualização:** 2026-05-08
**Versão:** 1.0.0
