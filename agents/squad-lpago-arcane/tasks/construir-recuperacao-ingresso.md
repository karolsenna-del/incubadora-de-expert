---
task: "Construir Recuperacao de Ingresso"
responsavel: "@copywriter-mensagens"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Documento mestre aprovado (preco atual de ingresso + data inicio captacao + stack tech) + decisao sobre usar agente IA conversacional + (opcional) roteiro do video do expert 15-30s"
Saida: "data/output/recuperacao-ingresso-{ciclo}.md — sequencia completa de 6 disparos (1 detalhado + 5 placeholders TBD) com configuracao tecnica + variaveis dinamicas"
Checklist:
  - "Pre-requisitos validados (preco atual no doc mestre, stack tech, decisao IA conversacional)"
  - "Disparo 1 (T+15min) completo com video expert 15-30s + cupom (preco atual menos R$20) + CTA dual (link direto OU IA conversacional)"
  - "Cadencia 2-6 estruturada com TBD claro (sem inventar copies)"
  - "Email + WhatsApp simultaneos (nao sequenciais)"
  - "Variaveis dinamicas listadas e mapeadas (first_name, workshop_nome, preco_recuperacao, preco_atual, link_checkout_com_cupom, nome_agente_ia, link_ia_conversacional, nome_expert)"
  - "Configuracao tecnica (trigger automatico, delays, condicionais) explicita"
  - "Validacao contra VOL-10 (anti-padroes evitados) + RC-015 (preco dentro da faixa R$27-R$67)"
  - "Limite maximo 6 disparos respeitado"
  - "Distincao explicita vs downsell-pos-evento (header de aviso no output)"
  - "Output aprovado explicitamente pelo usuario"
execution_type: "interactive"
---

# Task: Construir Recuperacao de Venda de Ingresso

> ⚠️ **NAO CONFUNDIR COM DOWNSELL POS-EVENTO (`construir-downsell-pos-evento`)**
>
> - **Esta task (recuperacao de ingresso):** roda DURANTE a captacao, ANTES do evento. Vende o INGRESSO (R$27-R$67) pra lead que deixou contato e abandonou checkout. Cadencia comeca T+15min, vai ate 6 disparos. Pode chegar a 30% dos ingressos totais.
> - **Downsell pos-evento (`construir-downsell-pos-evento`):** roda DEPOIS do evento. Vende oferta alternativa (Meteorico) pra quem assistiu pitch e nao comprou produto principal. 7 angulos diarios + ficha + comercial + encerramento.
>
> Trigger, momento e produto vendido sao DIFERENTES.

## Executive Summary

Pipeline pra produzir copies de recuperacao de venda de INGRESSO durante a captacao. Aplica estrutura validada pelo Euriler em 2026-05-08 (VOL-10): cadencia de 6 disparos (1 detalhado + 5 TBD), email + WhatsApp simultaneos, vídeo do expert 15-30s + cupom R$20 abaixo + CTA dual.

**CRITICO:** disparos 2-6 NAO foram detalhados pelo Euriler ainda. Entrega placeholder estrutural com TBD claro. NAO inventar copies dos disparos 2-6. Disparo 1 esta coberto integralmente.

## Pipeline

```
Doc mestre aprovado (preco atual + stack + decisao IA)
   |
   v
[Validar pre-requisitos]
   |
   v
[Calcular preco_recuperacao = preco_atual - R$20]
   |
   v
[Validar RC-015 — preco_recuperacao dentro de R$27-R$67]
   |
   v
[Redigir Disparo 1 — DETALHADO]
   - Email (subject + preheader + body com video + cupom + CTA)
   - WhatsApp template Meta (header video + body + buttons CTA dual)
   |
   v
[Redigir Disparos 2-6 — PLACEHOLDERS com TBD claro]
   |
   v
[Redigir Configuracao Tecnica]
   - Trigger automatico
   - Delays
   - Condicionais
   |
   v
[Listar Variaveis Dinamicas]
   |
   v
[Validar contra VOL-10 anti-padroes + checklist final]
   |
   v
[Aprovacao explicita]
```

## Steps

### Step 1: Validar Pre-Requisitos

Le doc mestre. Procura:
- Bloco 4 (cronograma) tem data inicio vendas?
- Bloco 6 (metas) tem preco atual de ingresso definido?
- Stack tech foi escolhido? (Cloud API + N8N + Bia / SellFlux / DevZapp / outro)
- Decisao sobre agente IA conversacional? (sim/nao)
- (Opcional) roteiro do video do expert 15-30s ja gravado ou definido?

**Se faltar qualquer um dos 3 primeiros:** devolve pro Estrategista. Sem isso, recuperacao nao tem trigger ou nao calcula cupom corretamente.

**Se faltar decisao IA ou video:** prossegue marcando placeholder explicito ("aluno decide se inclui CTA pra IA" / "video sera gravado pelo expert antes do disparo").

### Step 2: Calcular Preco de Recuperacao

```
preco_recuperacao = preco_atual - 20
```

Exemplos:
- preco_atual = R$47 → preco_recuperacao = R$27
- preco_atual = R$57 → preco_recuperacao = R$37
- preco_atual = R$67 → preco_recuperacao = R$47

**Validacao RC-015:** preco_recuperacao precisa estar dentro de R$27-R$67. Se ficar abaixo de R$27 (ex: ingresso R$37 → R$17), AVISO: "fora da faixa do metodo. Recomendo nao baixar tanto. Mantem em R$27 minimo OU cupom de R$10 (R$27)." Confirma com usuario antes de prosseguir.

### Step 3: Redigir Disparo 1 — DETALHADO

**Quando:** T+15min apos virar lead sem comprar (delay validado pelo Euriler)
**Canais:** Email + WhatsApp individual SIMULTANEO

#### 3.1 Email

Estrutura:
- **Subject:** `{first_name}, vi que você quase entrou no {workshop_nome}...`
- **Preheader:** `Tenho um cupom especial pra você. Te explico em 30 segundos.`
- **Body:** vídeo embed + texto contextualizando + CTA com link de cupom + alternativa de IA conversacional + assinatura + P.S. de escassez

Tom: pessoal, direto, sem performatica. Sem "ÚLTIMA CHANCE" em caps. Quebra padrão com "vi que você quase entrou".

#### 3.2 WhatsApp Template Meta

Estrutura:
```
TEMPLATE NAME (sugestão): recuperacao_ingresso_15min_{nicho}
CATEGORIA: Marketing
IDIOMA: pt_BR

[HEADER]
Tipo: VIDEO (vídeo do expert 15-30s)

[BODY com parametros]
{{1}} = first_name
{{2}} = workshop_nome
{{3}} = preco_recuperacao
{{4}} = preco_atual

[BODY REDIGIDO]
{{1}}! 👋

Vi que você se interessou no {{2}} mas não finalizou a inscrição.

Tenho um cupom especial pra você: *R${{3}}* (R$20 abaixo do lote atual de R${{4}}).

Garante aqui ou se quiser tirar dúvida antes, fala comigo. 🔥

[BUTTONS]
1. URL: "Garantir vaga por R${{3}}" → {link_checkout_com_cupom}
2. Quick Reply: "Falar com {nome_agente_ia}"

[NOTA TODO]
[!] Template precisa ser aprovado na Meta antes do disparo.
    Categoria Marketing exige opt-in via checkout.
```

### Step 4: Redigir Disparos 2-6 — PLACEHOLDERS

**REGRA INEGOCIAVEL:** NAO INVENTA copies dos disparos 2-6. Euriler ainda nao detalhou timing nem conteudo. Marca TBD claro.

Estrutura placeholder:

```
### Disparo {N} — TBD

QUANDO: TBD
CANAIS: TBD (provavel: email + WhatsApp)
INTENCAO: TBD
EMAIL: TBD
WHATSAPP TEMPLATE: TBD
ANTI-PADRAO: TBD
```

Se o usuario insistir em ter copies dos disparos 2-6: confronta. "Euriler ainda nao ensinou cadencia 2-6. Posso esbocar copy generica MAS isso vira invencao — fica TBD honesto. Quando Euriler detalhar, retorna a essa task que eu redijo."

### Step 5: Configuracao Tecnica

Documenta:

**Trigger:**
- Pixel/postback de checkout abandonado captura contato
- Webhook envia pra ferramenta de automacao (N8N / SellFlux / outra)
- Ferramenta agenda delay de 15min

**Disparo:**
- Apos 15min: dispara email + WhatsApp em paralelo (nao sequencial)
- Aguarda evento: compra / resposta WhatsApp / timeout

**Condicionais:**
- Compra em qualquer disparo → encerra fluxo
- Resposta WhatsApp → encerra automacao, vai pro agente IA conversacional
- Unsubscribe email → remove de tudo (legal)
- Bloqueio WhatsApp → continua so email
- Esgotou 6 disparos → remove, sem retomada

### Step 6: Variaveis Dinamicas

Lista explicita:

```
{first_name} — primeiro nome do lead (capturado no checkout)
{workshop_nome} — nome do workshop/evento
{preco_recuperacao} — preco_atual - R$20
{preco_atual} — lote atual de ingresso
{link_checkout_com_cupom} — URL com cupom já aplicado
{nome_agente_ia} — nome do agente conversacional (opcional)
{link_ia_conversacional} — URL/deep-link pra agente IA (opcional)
{nome_expert} — nome do expert dono do lancamento
```

### Step 7: Validar Contra VOL-10 + Anti-Padroes

Checklist:
- [ ] Disparo 1 com vídeo do expert
- [ ] Cupom = preco_atual - R$20
- [ ] Cupom dentro da faixa R$27-R$67 (RC-015)
- [ ] CTA dual (link direto OU IA conversacional)
- [ ] Email + WhatsApp simultaneos
- [ ] Trigger automatico (nao manual)
- [ ] Delay 15min exato
- [ ] Disparos 2-6 com TBD claro (nao inventados)
- [ ] Limite maximo 6 disparos
- [ ] Template Meta com TODO de aprovacao
- [ ] Variaveis dinamicas declaradas
- [ ] Header de aviso vs downsell-pos-evento

### Step 8: Aprovacao Explicita

```
Recuperacao de venda de ingresso entregue:

- Disparo 1 (T+15min): completo (email + WhatsApp template)
- Disparos 2-6: placeholders TBD (cadencia ainda nao detalhada
  pelo Euriler — quando ensinar, retorna a essa task)
- Configuracao tecnica: completa
- Variaveis dinamicas: listadas

Voce APROVA esse output?

(SIM / NAO + ajuste especifico)

PROXIMO PASSO sugerido apos aprovacao:
1. Aluno grava vídeo do expert (15-30s) se ainda nao tem
2. Aluno aprova template Meta (Categoria Marketing) — pode levar 24-48h
3. Aluno configura automacao na stack escolhida (N8N / SellFlux / outra)
4. Aluno testa fluxo com checkout abandonado proprio antes de ativar pra leads reais
```

## Veto Conditions

- Inventar copies dos disparos 2-6 → recusa, mantem TBD honesto
- Cupom fora da faixa R$27-R$67 → confronta, recomenda ajuste
- Manual em vez de automatico → recusa, exige stack tecnologica
- Disparo 1 sem vídeo do expert → recusa, exige vídeo (ou marca placeholder explicito)
- Misturar gramatica de canal (body email dentro de template Meta) → ajusta
- Mais de 6 disparos → recusa, limite maximo
- Confundir com downsell pos-evento → adiciona header de distincao
- Aprovacao implicita → exige SIM/NAO

## Output Esperado

Arquivo `recuperacao-ingresso-{ciclo}.md` com:
- Header (data, versao, ciclo, distincao vs downsell)
- Configuracao geral (preco_atual, preco_recuperacao, stack, video)
- Disparo 1 completo (email + WhatsApp)
- Disparos 2-6 placeholders TBD
- Configuracao tecnica
- Variaveis dinamicas
- Validacao final (checklist)
- Anti-padroes
- TODOs ativos
- Linha de aprovacao

## Regras

- NUNCA inventa copies dos disparos 2-6 (Euriler ainda nao ensinou)
- Disparo 1 SEMPRE com vídeo do expert + cupom + CTA dual
- Cupom SEMPRE preco_atual - R$20, dentro da faixa R$27-R$67
- Email + WhatsApp SEMPRE simultaneos (paralelos, nao sequenciais)
- Trigger SEMPRE automatico (manual nao escala)
- Limite MAXIMO 6 disparos (5 follow-ups apos o primeiro)
- Header SEMPRE distingue de downsell-pos-evento
- Template Meta SEMPRE com TODO de aprovacao se ainda nao existe
- Aprovacao SEMPRE explicita (SIM/NAO)
- Termina com proximo passo concreto
