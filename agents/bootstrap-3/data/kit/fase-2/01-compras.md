# FASE 2 · Passo 2.1 — Automacao de Compras/Onboarding

> Versao-aluno do workflow `COMPRAS totais` da Arka (que processa Hotmart+TMB+Asaas
> ha meses em producao), enxuta pro essencial: **compra aprovada → pessoa + compra
> no banco → boas-vindas no WhatsApp via Z-API**. **Criada via API do n8n** pelo
> @operador-automacoes (o aluno e nao-dev — nao monta node a node); o aluno so
> **publica**. Os blocos abaixo descrevem a LOGICA pra o aluno entender o que roda.
>
> Tabelas novas: NENHUMA — esta automacao escreve direto no core (pessoas/compras).

---

## O efeito (mostrar antes da tecnica)

Compra entra as 3h da manha → 5 segundos depois: a pessoa existe no banco como `comprador`, a venda esta no livro-caixa com atribuicao, e o cliente recebeu as boas-vindas no WhatsApp. O aluno estava dormindo.

## O fluxo (8 nodes)

```
Webhook (POST /webhook/compras)
  → Responde 200                       (imediato — evita retry da plataforma)
  → IF compra aprovada?                (senao: NoOp, evento ignorado)
  → parse_dados (Code)                 (normaliza TUDO — o coracao)
  → Upsert Pessoa (HTTP → Supabase)    (onConflict: email · status_geral: comprador)
  → Busca duplicada (HTTP → Supabase)  (por id_transacao)
  → IF duplicada? → NoOp               (idempotencia — a constraint UNIQUE e a 2a trava)
  → Insert Compra (HTTP → Supabase)
  → Boas-vindas (HTTP → Z-API)
```

> **Como e montado (Principio 3):** o operador cria o workflow inteiro via API do n8n
> (`POST /rest/workflows` com nodes + conexoes), com placeholders, e cria as credenciais
> via API (header `apikey` pro Supabase, header `Client-Token` pro Z-API). O workflow de
> referencia pode ficar embarcado como template no squad. O aluno so abre e **publica**.
> Os "testes de bloco" abaixo o operador roda durante a montagem — o aluno acompanha o efeito.

## Bloco A — Webhook + filtro (nodes 1-3)

1. **Webhook**: POST, path `/webhook/compras`, modo respond-with-node
2. **Respond to Webhook**: 200 imediato
3. **IF aprovada** (Hotmart): `body.event == 'PURCHASE_APPROVED'`
   - Outra plataforma? O operador adapta o filtro pro evento de "pagamento aprovado" dela (TMB: `status_pedido == 'Efetivado'`; Asaas: `PAYMENT_CONFIRMED`/`PAYMENT_RECEIVED`)

**Teste do bloco:** curl no webhook de **producao** (`/webhook/compras`, workflow publicado — em queue mode o `/webhook-test/` nao funciona) com `{"event":"PURCHASE_APPROVED"}` → execution aparece e segue pelo TRUE; com `{"event":"PURCHASE_REFUNDED"}` → cai no FALSE.

## Bloco B — parse_dados (node 4, Code)

Normalizacao e a alma do banco unificado. Saida padrao (payload Hotmart como referencia — adaptar caminho dos campos pra outra plataforma):

```javascript
const d = $json.body.data;
const email = (d.buyer.email || '').trim().toLowerCase();          // PRINCIPIO 1
const telefone = (d.buyer.checkout_phone || '').replace(/\D/g,''); // PRINCIPIO 2 (so digitos)

return [{ json: {
  email,
  telefone: telefone.startsWith('55') ? telefone : '55' + telefone,
  nome: d.buyer.name || null,
  nome_primeiro: d.buyer.first_name || null,
  produto_nome: d.product.name,
  valor: d.purchase.price?.value ?? null,
  forma_pagamento: d.purchase.payment?.type || null,
  plataforma: 'hotmart',                    // NOT NULL no banco — licao da Arka
  status: 'aprovada',                       // status NORMALIZADO (nunca o cru da plataforma)
  id_transacao: d.purchase.transaction,     // UNIQUE no banco = dedup garantido
  id_oferta: d.purchase.offer?.code || null,
  pagina_origem: d.purchase.checkout_country ? null : null,
  utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null,
  src: d.purchase.origin?.sck || null       // sck bruto (atribuicao avancada vem depois)
}}];
```

> UTMs via `sck`/UTMify (como a Arka faz, com delimiter) e refinamento opcional —
> o operador oferece DEPOIS do e2e fechado. Primeiro o essencial vivo.

## Bloco C — Banco (nodes 5-7, HTTP Request → Supabase REST)

Credencial: Header Auth com a **secret key nova** do Supabase (`sb_secret_...`, que substitui a service_role legacy) — **UM header so: `apikey`**. Com `Authorization: Bearer` sozinho o gateway retorna 401. O operador cria essa credencial via API do n8n; o valor vem do cofre. O aluno pega a key no painel (Settings → API Keys → Secret keys) — o MCP NAO expoe essa key (ver Principio 1b e 4 em `knowledge/principios-operacionais.md`).

5. **Upsert Pessoa**: `POST {SUPA_URL}/rest/v1/pessoas?on_conflict=email`
   - Headers extras: `Prefer: resolution=merge-duplicates,return=representation`
   - Body: email, telefone, nome, nome_primeiro + `"status_geral": "comprador"`
   - Guardar o `id` retornado (pessoa_id)
6. **Busca duplicada**: `GET {SUPA_URL}/rest/v1/compras?id_transacao=eq.{{id_transacao}}&select=id`
7. **IF duplicada?** array vazio → segue · tem item → NoOp (`compra_ja_existe`)
8. **Insert Compra**: `POST {SUPA_URL}/rest/v1/compras` com pessoa_id + todos os campos do parse

**Teste do bloco:** rodar com payload simulado → conferir no Table Editor: pessoa (status comprador) + compra.

## Bloco D — Boas-vindas (node 9, HTTP → Z-API)

`POST https://api.z-api.io/instances/{ID}/token/{TOKEN}/send-text` (Client-Token no header):

```json
{ "phone": "{{telefone}}", "message": "{{primeira_de_3_variacoes}}" }
```

- Mensagem de boas-vindas escrita COM o aluno (3+ variacoes, tom dele, sem promessa exagerada)
- Boas-vindas pos-compra e 1-pra-1 transacional — fora da cadencia de massa, mas as variacoes continuam valendo

## DRY-RUN E2E (obrigatorio antes da plataforma real)

> O dry-run e no webhook de **PRODUCAO** (`/webhook/...`), com o workflow **publicado** —
> nunca no webhook de TESTE (`/webhook-test/...`). Em **queue mode** o n8n serve o webhook
> de teste por um processo `n8n-webhook` separado, e ele **nao funciona**. Por isso aqui se
> usa o webhook real com payload de teste, e no fim **limpa os dados de teste do banco**
> (Principio 3 em `knowledge/principios-operacionais.md`).

```bash
curl -s -X POST "https://webhook.{dominio}/webhook/compras" \
  -H "Content-Type: application/json" \
  -d '{"event":"PURCHASE_APPROVED","data":{
    "buyer":{"email":"EMAIL_DO_ALUNO","checkout_phone":"55DDDNUMERO_DO_ALUNO","name":"Aluno Teste","first_name":"Aluno"},
    "product":{"name":"Produto Teste B3"},
    "purchase":{"price":{"value":97},"payment":{"type":"pix"},"transaction":"B3-TESTE-001","offer":{"code":"teste"}}}}'
```

Conferir os 3 efeitos: ① pessoa no banco (comprador) · ② compra no banco · ③ boas-vindas chegou no WhatsApp do aluno.

**Teste de idempotencia:** rodar o MESMO curl de novo → NADA duplica (cai no `compra_ja_existe`).

**Limpeza:** apagar compra `B3-TESTE-001` e a pessoa de teste **via MCP do Supabase** (`execute_sql`) — nao precisa expor key (Principio 4).

## Conectar a plataforma real

Hotmart: Ferramentas → Webhook (ou Hottok/Postback conforme versao do painel) → URL `https://webhook.{dominio}/webhook/compras` → evento "compra aprovada" marcado. Outras plataformas: caminho equivalente (toda plataforma seria tem postback de venda).

> **Publicar o workflow** (botao **Publish** no editor) — nas versoes recentes do n8n (2.27+)
> ativa-se por Publish, nao pelo toggle "Active"; a ativacao via API (campo `active`) NAO liga
> o webhook nessas versoes. O webhook de producao so responde com o workflow publicado. O
> operador detecta a versao e adapta; o aluno publica com 1 clique (Principio 3).

## Checklist do passo

- [ ] Workflow montado por blocos, cada bloco testado
- [ ] Dry-run e2e: pessoa + compra + mensagem recebida
- [ ] Idempotencia: payload repetido nao duplica
- [ ] Dados de teste limpos
- [ ] Webhook real conectado na plataforma (registrar QUAL no tracker)
- [ ] Workflow publicado (Publish)
