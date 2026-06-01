# Recuperação de Venda de Ingresso

> **KB do Squad LPago Arcane — Método Euriler Jubé**
> Tratamento: knowledge novo (ensinado pelo Euriler em 2026-05-08, ausente da KB original)
> Fonte: transmissão direta Euriler 2026-05-08 + validação stack atual NDF Workshop (WhatsApp Cloud API + N8N + agente Bia)
> Carregado por: estrategista-chief, copywriter-mensagens, analista-dados

---

> ⚠️ **NÃO CONFUNDIR COM DOWNSELL PÓS-EVENTO (VOL-08)**
>
> - **Recuperação de venda de Ingresso (este volume):** ação DURANTE a CAPTAÇÃO, ANTES do evento. Vende o INGRESSO. Vai pra lead que deixou contato (checkout pré-populado, formulário pré-checkout, ou no checkout em si) e ABANDONOU a compra. Cadência começa 15min após abandono, vai até 5 follow-ups.
> - **Downsell / Meteórico (VOL-08):** ação DEPOIS do evento. Vende oferta alternativa (mais barata) pra quem assistiu pitch e disse "não tenho grana". Cadência de 7 dias com 7 ângulos diários + ficha de interesse + comercial humano + encerramento.
>
> Trigger, momento e produto vendido são DIFERENTES. Não misturar.

---

## 1. O Que É

Recuperação de venda de ingresso é uma ação **EXTRA e OPCIONAL** que opera **durante a captação** (antes do evento) pra trazer de volta leads que abandonaram o checkout do ingresso. Pode chegar a **30% dos ingressos totais vendidos**, com custo baixíssimo (custo marginal de mensagem WhatsApp + email).

### Por Que É Estratégica

- Lead que abandona checkout já é qualificado — passou pelo anúncio, leu a página, chegou ao checkout, deixou contato. Está a 1 clique da compra.
- Custo de aquisição já foi pago (CPA Meta Ads). Não recuperar = jogar fora investimento já feito.
- Conversão de recuperação é desproporcionalmente alta — lead já decidiu, só travou em algo (preço, dúvida, distração).
- Sem custo de criação de criativo novo: 1 vídeo do expert + 1 cupom + automação rodam em loop pra todo lead que abandona.

### Diferença vs Outras Recuperações

| Conceito | Quando | Vende | Trigger |
|----------|--------|-------|---------|
| **Recuperação de Ingresso (este vol)** | DURANTE captação | INGRESSO (R$27-R$67) | Lead deixou contato + abandonou checkout |
| **Downsell / Meteórico (VOL-08)** | DEPOIS do evento (D+1 a D+7) | Oferta alternativa mais barata que produto principal | Pitch acabou + lead não comprou principal |
| **Recuperação Comercial 1:1 (VOL-08)** | DEPOIS do evento (D+1 a D+6) | Produto principal | Lead preencheu ficha de interesse |

Os 3 são complementares. Esse volume cobre só o primeiro.

---

## 2. Quando Ativa (Trigger)

Lead que cumpre **AMBAS** as condições:

1. **Deixou contato** — pelo menos 1 dos 3 pontos:
   - Checkout pré-populado (lead clicou no anúncio com UTM que pré-preenche nome/email/telefone)
   - Formulário pré-checkout (página de captura de lead antes do checkout — mais comum em alunos sem stack avançada)
   - Checkout em si (lead chegou no checkout e digitou nome/email/telefone)

2. **NÃO finalizou a compra** — checkout abandonado dentro de janela técnica (~10-30min sem retorno).

> O trigger técnico é **abandono detectável**. Se o lead não deixou contato, recuperação não roda — não tem pra quem disparar.

---

## 3. Canais

Recomendado **email + WhatsApp individual SIMULTÂNEO**. Dois canais aumentam taxa de leitura sem sobrepor — email entra no momento de pausa, WhatsApp no momento ativo.

### 3.1 Email

- Custo zero (ferramenta já paga)
- Entrega 80-95% inbox se sender warm
- Subject precisa quebrar padrão ("vi que você quase entrou", não "última chance")

### 3.2 WhatsApp Individual

- **API oficial (Meta Cloud API) RECOMENDADO**
  - Lead opt-in via checkout (concordou com termos = consentimento)
  - Templates aprovados pela Meta evitam ban
  - Custo: ~R$0,03-0,05 por conversa (categoria Marketing)
- **Alternativas (válidas, mas com tradeoffs):**
  - SellFlux — UI fácil, mas paga uma camada extra
  - DevZapp — popular entre infoprodutores
  - ManyChat — não recomendado em 2026 (Euriler não usa mais — ver memória)
  - N8N standalone — sem agente IA, só dispara mensagem
  - WhatsApp não-oficial (Z-API, etc.) — mais barato, MAIS RISCO de ban

### 3.3 Stack Validado do Euriler (2026-05)

- WhatsApp API Oficial (Cloud API direto, paga pra Meta)
- N8N orquestrando o fluxo (trigger → delay → dispara)
- Agente "Bia" conversacional — recebe lead, tira dúvida, libera cupom, direciona pro checkout
- Resultado: até 30% dos ingressos via recuperação

> **Stack do Euriler é EXEMPLO, não obrigação.** Aluno pode rodar em SellFlux + ManyChat sem agente IA e ainda assim recuperar 15-20% dos ingressos. Bia agrega conversão extra mas não é pré-requisito.

---

## 4. Cadência (5+1 disparos)

| Disparo | Quando | Conteúdo |
|---------|--------|----------|
| 1 | T+15min após virar lead sem comprar | Vídeo expert + cupom + CTA dual (compra direta com desconto OU IA conversacional) |
| 2 | TBD | TBD — Euriler vai detalhar timing/conteúdo |
| 3 | TBD | TBD |
| 4 | TBD | TBD |
| 5 | TBD | TBD |
| 6 | TBD | TBD (último — desiste após) |

> ⚠️ **Cadência 2-6: TBD aguardando detalhamento do Euriler.** Marcado TBD pra captura futura. Quando Euriler ensinar, este volume é atualizado.

### Princípios da Cadência (já validados)

- **Primeiro disparo aos 15min** — janela curta. Lead ainda lembra do anúncio. Pasou de 1h, esfria.
- **Até 5 follow-ups depois** — máximo. Após esgotar, desiste.
- **Após esgotar, desiste do lead** — não vira spam. Lead já recebeu 6 chances.
- **Tudo automático** — manual não escala. Lead recupera no horário que abandonou (3h da manhã, sábado, etc.).

---

## 5. Kit Básico Mínimo (Disparo 1 — o mais forte)

Estrutura do disparo de 15min:

### 5.1 Vídeo do Expert (15-30s)

- **Reconhece interesse:** "Vi que você se interessou no workshop"
- **Quebra objeção implícita do abandono:** "Sei que talvez você tenha ficado em dúvida — é normal"
- **Apresenta cupom especial:** "Quero te dar um cupom pra você entrar"
- **CTA leve:** "Garante aqui embaixo ou fala comigo" (CTA dual no texto)

> Vídeo do expert é o elemento que MAIS converte. Mensagem de texto sem vídeo perde força significativa. Se o expert não pode gravar 15-30s pra esse fluxo, recuperação fica fraca.

### 5.2 Cupom Especial

- **Desconto típico:** ~R$20 abaixo do preço atual do ingresso
- **Exemplos:**
  - Ingresso R$47 → cupom recupera por R$27
  - Ingresso R$57 → cupom recupera por R$37
  - Ingresso R$67 → cupom recupera por R$47
- **Mantém na faixa do método (R$27-R$67 — RC-015):** mesmo recuperando, ingresso continua dentro do Preço da Escala. Não cai abaixo de R$27 (fora da faixa = lead sem grana).

### 5.3 CTA Dual (escolher 1)

- **(a) Link de compra direto com desconto aplicado:** botão "Garantir vaga por R$27"
- **(b) Botão pra falar com agente IA conversacional e receber cupom:** botão "Falar com a Bia / agente"

**Quando escolher cada:**
- (a) é mais simples, converte direto. Bom pra alunos sem stack de IA.
- (b) é mais conversacional. Lead pode ter dúvida ("é gravado? tem certificado? funciona pra mim?"). Agente IA tira dúvida E libera cupom. Conversão mais alta mas exige stack.

**Pode mostrar AMBOS ao mesmo tempo** — botão de compra direta + linha "ou se quiser tirar dúvida antes, fala com a {agente}". Lead escolhe canal.

---

## 6. Stack Tecnológico

### 6.1 Stack Validado do Euriler (2026-05)

```
[Trigger: lead abandonou checkout]
       ↓
   [Webhook capturou contato (nome, email, telefone)]
       ↓
   [N8N agenda delay 15min]
       ↓
   [Dispara em paralelo:]
       ├── Email (template MailerLite com vídeo embed + cupom)
       └── WhatsApp Cloud API (template aprovado: vídeo header + body com cupom + buttons CTA dual)
       ↓
   [Lead clica botão "falar com Bia"]
       ↓
   [Agente Bia (conversacional) tira dúvida + libera cupom + direciona pro checkout]
```

### 6.2 Alternativas para Aluno

Aluno pode escolher conforme maturidade:

| Stack | Custo | Esforço Setup | Conversão Esperada |
|-------|-------|---------------|---------------------|
| SellFlux + Email + IA | Médio | Baixo (drag-drop) | Boa |
| DevZapp + Email | Baixo | Médio | Razoável |
| N8N + Cloud API + Bia | Baixo (após setup) | Alto (técnico) | Alta (validado Euriler) |
| ManyChat (legacy) | Médio | Baixo | Razoável (Euriler descontinuou) |
| WhatsApp não-oficial + Email | Muito Baixo | Médio | Razoável MAS risco de ban |

> **Regra do método:** rodar em alguma stack > não rodar. Stack imperfeita recupera 10-15%. Stack ausente recupera 0%.

---

## 7. Automação (regra de ouro)

**TUDO precisa rodar automático. Manual não escala.**

Pipeline mínimo:

1. Trigger: lead virou contato sem compra
2. Aguarda 15min (delay configurável, mas 15min é o validado)
3. Dispara em paralelo: email + WhatsApp
4. Espera resposta OU compra (loop de espera 1-X horas conforme cadência TBD)
5. Se não converter: aciona próximo disparo (cadência 2-6, ainda TBD)
6. Se converter OU esgotar 6 disparos: encerra fluxo pra esse lead

> **Anti-padrão:** "vou disparar manual quando lembrar." Resultado: lead esfria, conversão zero, esforço alto. Pior dos dois mundos.

---

## 8. Métricas

> Maioria das métricas detalhadas é **TBD** — aguarda dados de ciclos com recuperação ativa pra calibrar benchmark.

| Métrica | Bom | Ótimo | Fonte |
|---------|-----|-------|-------|
| % ingressos via recuperação (do total) | 15-20% | 25-30%+ | Euriler 2026-05 (até 30%) |
| Conversão Disparo 1 (15min) | TBD | TBD | aguardando |
| Conversão Disparo 2-6 (acumulada) | TBD | TBD | aguardando |
| % leads alcançados (entrega WhatsApp + email) | 85%+ | 95%+ | benchmarks de ferramenta |
| Taxa de bloqueio por spam (WhatsApp) | < 1% | < 0,3% | Cloud API mantém baixa |

> Quando ciclos com recuperação ativa fecharem, voltar aqui pra calibrar números reais por nicho.

---

## 9. Anti-Padrões

- **Não fazer recuperação** = perder até 30% dos ingressos possíveis. Investimento em CPA já foi gasto, jogar fora.
- **Confundir com downsell pós-evento** = escopos diferentes. Esse vende ingresso, downsell vende oferta alternativa pós-pitch.
- **Mais de 5-6 disparos** = queima lead. Vira spam. Lead bloqueia, denuncia, e ainda contamina sender.
- **Manual em vez de automático** = não escala. Lead que abandona às 3h da manhã não pode esperar você acordar.
- **Cupom igual ao lote inicial** = não dá desconto real. Lead percebe que "cupom" é fake. Quebra confiança.
- **Disparo 1 sem vídeo do expert** = mensagem genérica converte muito menos. Vídeo é o que personaliza e quebra padrão.
- **Cair abaixo de R$27** com cupom = sai da faixa do método. Lead "sem grana" não compra mesmo a R$17. Mantém R$27 mínimo.
- **Cadência igual pra todo nicho** = não testar. Stack validada do Euriler é referência, não receita única. Cada nicho pode precisar de cadência diferente — TBD pra detalhar.

---

## 10. Limitações Conhecidas (TBD)

- **Conteúdo + timing dos disparos 2-5:** aguardando detalhamento Euriler. Disparo 1 está coberto integralmente. Disparos 2-6 estão como placeholder estrutural.
- **Roteiro literal do vídeo do expert (15-30s):** aguardando. Estrutura geral coberta (reconhece interesse + cupom + CTA), mas roteiro palavra-a-palavra ainda não.
- **Métricas detalhadas dos disparos individuais:** aguardando ciclos com dados reais. Só "até 30% do total via recuperação" foi reportado pelo Euriler.
- **Comparativo de conversão entre stacks (Cloud API + Bia vs SellFlux vs ManyChat):** aguardando teste A/B.
- **Cadência por nicho (B2B vs B2C, ticket alto vs baixo):** aguardando calibração.
- **Limite diário de disparos pra não triggar anti-spam Meta:** aguardando — já existe memória de incidente WhatsApp MCP em massa (Z-API), mas Cloud API tem limites diferentes.

---

## 11. Integração com Outros Volumes

- **VOL-03 (Página de Vendas):** página precisa pré-popular checkout via UTM ou ter formulário pré-checkout pra capturar contato antes do abandono. Sem isso, recuperação não tem trigger.
- **VOL-04 (Anúncios + Tráfego):** UTM bem configurado é pré-requisito. Pixel de checkout abandonado precisa estar disparando.
- **VOL-05 (Infraestrutura):** stack tecnológico vive aqui. Cloud API + N8N + email tool.
- **VOL-06 (Antecipação):** lead recuperado entra na sequência de antecipação normal (T-7d em diante). Não é tratado diferente.
- **VOL-08 (Pós-Evento):** downsell pós-evento é OUTRO mecanismo. Não substitui nem é substituído por recuperação de ingresso.
- **VOL-09 (Referência Tática):** benchmarks de conversão de ingresso já existem. Recuperação ADICIONA 15-30% em cima, não substitui o canal principal.

---

**Última atualização:** 2026-05-08
**Versão:** 1.0.0
**Status:** Volume novo — fundamentos e kit mínimo (Disparo 1) cobertos. Cadência completa (Disparos 2-6) pendente refinamento Euriler.
