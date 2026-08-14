# Passo 7 — Smoke Test End-to-End

> Tempo estimado: 30 minutos
> O que entrega: confiança de que sua Bia tá viva, responde, e você consegue monitorar/intervir pelo Chatwoot.

---

## O que vamos validar (4 cenários)

| # | Cenário | Validação |
|---|---------|-----------|
| 1 | Você manda template `teste_pipeline_bia` (ou hello_world) pro seu número → você responde → Bia responde como `bia` (default/triage) | Pipeline base funcionando + L1+L2+L3 da triage carregados |
| 2 | Você seta `active_agent_id=bia-recovery` → manda template de novo → responde → Bia responde como recovery | active_agent_id sendo respeitado + prompt L3 correto |
| 3 | Você escreve "Sair" no chat → Bia para de responder | Opt-out funcionando + `blacklist_api` inserida |
| 4 | Você intervém pelo Chatwoot → digita resposta no painel → chega no seu WhatsApp | WF-CHATWOOT-HUMAN funcionando + `is_human_takeover` ativado |

---

## Preparativos

### Seu número precisa estar no allowlist Development

Se sua WABA ainda está em Development mode (passo 2.9 do meta-cloud.md), você só pode mandar template pra números pré-autorizados.

1. Meta App Dashboard > WhatsApp > **API Setup**
2. Em "Send and receive messages" > campo "To" > adicione seu próprio número (formato: +55 11 99999-9999)
3. Confirme o código que chegar

### Variáveis pra ter prontas no terminal

```bash
export N8N_URL="https://seu-n8n.com"
export N8N_KEY="..."
export SUPA_URL="https://SEU.supabase.co"
export SUPA_KEY="..."  # service_role
export META_TOKEN="EAA..."
export PHONE_NUMBER_ID="..."
export SEU_NUMERO="55XXYYYYYYYYY"  # seu número de teste, só dígitos
```

---

## Cenário 1 — Pipeline base (template default → Bia triage)

### 1.1 — Criar contato no Supabase

```bash
curl -s -X POST "$SUPA_URL/rest/v1/bia_whatsapp_contacts" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  -d "{\"phone\": \"$SEU_NUMERO\", \"phone_number_id\": \"$PHONE_NUMBER_ID\", \"active_agent_id\": \"bia\", \"nome\": \"Teste Smoke\"}"
```

### 1.2 — Mandar template pra si mesmo

Opção A — template `hello_world` (em inglês, mas universal):

```bash
curl -s -X POST "https://graph.facebook.com/v21.0/$PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer $META_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"messaging_product\":\"whatsapp\",
    \"to\":\"$SEU_NUMERO\",
    \"type\":\"template\",
    \"template\":{\"name\":\"hello_world\",\"language\":{\"code\":\"en_US\"}}
  }"
```

Opção B — seu `teste_pipeline_bia` (se já aprovou):

```bash
curl -s -X POST "https://graph.facebook.com/v21.0/$PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer $META_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"messaging_product\":\"whatsapp\",
    \"to\":\"$SEU_NUMERO\",
    \"type\":\"template\",
    \"template\":{\"name\":\"teste_pipeline_bia\",\"language\":{\"code\":\"pt_BR\"}}
  }"
```

Você deve receber a msg no WhatsApp em 1-3 segundos.

### 1.3 — Responder no WhatsApp

Você responde algo livre tipo: "oi, tudo bem?"

### 1.4 — Verificar pipeline

```bash
# 1. WF-INBOUND-CLOUD teve execução nos últimos 30s?
curl -s "$N8N_URL/api/v1/executions?workflowId=$WF_INBOUND_ID&limit=3" \
  -H "X-N8N-API-KEY: $N8N_KEY" | jq '.data[] | {id, finished, mode, startedAt, stoppedAt}'

# 2. WF-AGENT-CORE-CLOUD foi chamado?
curl -s "$N8N_URL/api/v1/executions?workflowId=$WF_AGENT_CORE_ID&limit=3" \
  -H "X-N8N-API-KEY: $N8N_KEY" | jq '.data[] | {id, finished}'

# 3. WF-OUTBOUND-CLOUD respondeu?
curl -s "$N8N_URL/api/v1/executions?workflowId=$WF_OUTBOUND_ID&limit=3" \
  -H "X-N8N-API-KEY: $N8N_KEY" | jq '.data[] | {id, finished}'

# 4. Histórico foi salvo?
curl -s "$SUPA_URL/rest/v1/bia_agent_context?subscriber_id=eq.$SEU_NUMERO&select=agent_id,messages" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | jq

# 5. A conversa apareceu no Chatwoot?
# Vai no painel: Conversations > deveria ter 1 aberta com seu número
```

### 1.5 — Validar resposta

A Bia (agent_id=`bia`/triage) deveria:
- Cumprimentar pelo nome ("Oii Teste!" ou similar)
- Perguntar algo aberto pra entender o que você quer
- Sem markdown, sem bullets, sem `**negrito**`
- **NUNCA escrever `{{var}}` literal** — se aparecer, placeholder não foi substituído (problema no Context Manager ou workshop_config vazio)

---

## Cenário 2 — Trocar agent_id e ver mudança de prompt

### 2.1 — Setar agent_id=bia-recovery

```bash
curl -s -X PATCH "$SUPA_URL/rest/v1/bia_whatsapp_contacts?phone=eq.$SEU_NUMERO" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" \
  -H "Content-Type: application/json" \
  -d '{"active_agent_id": "bia-recovery"}'

# Limpar histórico pra ela esquecer a conversa anterior
curl -s -X DELETE "$SUPA_URL/rest/v1/bia_agent_context?subscriber_id=eq.$SEU_NUMERO" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY"
```

### 2.2 — Mandar mensagem livre (sem template — janela 24h aberta da Cenário 1)

Você responde no chat: "quero o cupom"

### 2.3 — Validar

A Bia (agora bia-recovery) deveria entrar no MODO ESPECIAL:
- Cumprimentar
- Fazer 1 pergunta de validação ("antes de te mandar...")
- Depois mandar o link de desconto

Se ela responder como triage normal (perguntando "o que você quer saber"), o agent_id não foi respeitado. Verificar:
- PATCH funcionou? `select active_agent_id from bia_whatsapp_contacts where phone=$SEU_NUMERO`
- O L3 de bia-recovery está no AGENT_L3 do node "Configuracao do Agente"?
- REGRA-001 violada? (sempre setar agent_id ANTES de operar)

---

## Cenário 3 — Opt-out

Manda no chat: "Sair"

Aguarda alguns segundos.

```bash
# Verificar blacklist
curl -s "$SUPA_URL/rest/v1/blacklist_api?phone=eq.$SEU_NUMERO" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | jq
```

Deve aparecer 1 row com seu phone e reason tipo `opt-out:sair`.

A partir daqui, qualquer disparo proativo pra esse número deve pular ele (filtro de blacklist nos workflows que disparam template).

> Pra remover seu phone da blacklist (pra continuar testando):
> ```bash
> curl -s -X DELETE "$SUPA_URL/rest/v1/blacklist_api?phone=eq.$SEU_NUMERO" \
>   -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY"
> ```

---

## Cenário 4 — Handoff humano via Chatwoot

### 4.1 — Pegar conversa no Chatwoot

1. Vai no painel do Chatwoot: `https://chatwoot.SEUDOMINIO.com`
2. Conversations > inbox da Bia > sua conversa de teste
3. Status: deve estar "Open" (aberta automaticamente quando lead manda msg)

### 4.2 — Digitar resposta no painel

1. No campo de mensagem do Chatwoot, digita: "Aqui é o suporte! Posso te ajudar?"
2. Enviar

### 4.3 — Validar

- [ ] A mensagem chega no SEU WhatsApp (o número da Bia mandou pra você)
- [ ] No Supabase, `is_human_takeover` ficou `true`:
  ```bash
  curl -s "$SUPA_URL/rest/v1/bia_whatsapp_contacts?phone=eq.$SEU_NUMERO&select=is_human_takeover" \
    -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | jq
  ```

### 4.4 — Validar que a Bia NÃO responde mais (humano assumiu)

Responde no WhatsApp: "obrigado pela ajuda"

Espera alguns segundos. **A Bia NÃO deve responder** (porque `is_human_takeover=true` bloqueia ela no WF-OUTBOUND-CLOUD).

A mensagem deve aparecer no Chatwoot pra você ver, mas a Bia fica silenciosa.

### 4.5 — Devolver controle pra Bia

Quando você termina de atender humano, devolve a Bia:

```bash
curl -s -X PATCH "$SUPA_URL/rest/v1/bia_whatsapp_contacts?phone=eq.$SEU_NUMERO" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" \
  -H "Content-Type: application/json" \
  -d '{"is_human_takeover": false, "active_agent_id": "bia"}'

# E fechar a conversa no Chatwoot (Resolve)
```

A próxima msg que o lead mandar, a Bia volta a responder.

---

## Diagnóstico de falhas

### Cenário 1 falha → problema base
- WF-INBOUND-CLOUD não tem execução, MAS o botão "Test" da Meta (Webhook Fields) chega? → **App não inscrito na WABA** (`subscribed_apps` vazio) — causa #1. Confere com `curl .../{WABA_ID}/subscribed_apps` (se voltar `{"data":[]}` está quebrado) e corrige com o `POST`. Ver passo 2.7.1 do `02-meta-cloud.md`.
- WF-INBOUND-CLOUD não tem execução (nem o botão "Test")? → webhook Meta não tá enviando OU n8n não está ativo OU verify token não bate OU `messages` não inscrito
- WF-INBOUND-CLOUD tem execução mas crashou? → ver erro nos logs do node
- Mensagem chegou no n8n mas Bia não respondeu? → WF-AGENT-CORE-CLOUD com erro (geralmente JS inválido — REGRA-012)
- Resposta chegou no Sender mas não foi pro WhatsApp? → credentials Meta erradas OU `phone_number_id` errado

### Cenário 2 falha → problema com agent_id ou prompt L3
- PATCH no agent_id deu certo? `select active_agent_id from bia_whatsapp_contacts where phone=X`
- O L3 de `bia-recovery` está no node "Configuracao do Agente" do WF-AGENT-CORE-CLOUD?
- Cache cycle foi feito após PATCH? (REGRA-005)

### Cenário 3 falha → opt-out não tá configurado
- WF-INBOUND-CLOUD tem node `Detector OptOut`?
- Match case-insensitive? Sair = sair = SAIR = Sair.
- INSERT em `blacklist_api` está acontecendo? Cheque a credential Supabase no node.

### Cenário 4 falha → WF-CHATWOOT-HUMAN ou webhook do Chatwoot
- Webhook configurado NO Chatwoot apontando pra `webhook.SEUDOMINIO.com/webhook/wf-chatwoot-human`?
- Filtro de mensagem detectando outgoing humana (não outgoing Bia)?
- Chatwoot account_id e inbox_id corretos?

---

## Checklist final

- [ ] Cenário 1 — pipeline base funcionando (Bia responde com agent_id=bia)
- [ ] Cenário 2 — trocar agent_id muda prompt (bia-recovery entra no MODO ESPECIAL)
- [ ] Cenário 3 — "Sair" entra na blacklist
- [ ] Cenário 4 — humano responde pelo Chatwoot, lead recebe, Bia se cala
- [ ] Histórico salvando em `bia_agent_context`
- [ ] Sem `{{var}}` literal nas respostas
- [ ] Conversa aparece em tempo real no Chatwoot

---

## 🎉 Bia instalada e validada

Se todos os 4 cenários passaram, sua Bia está em produção. A partir daqui você pode:

- Direcionar leads pra escrever pro seu número (QR code, link wa.me, link no Instagram bio, etc) — a Bia atende
- Monitorar tudo pelo Chatwoot
- Quando precisar de funcionalidades extras (boas-vindas automática pós-compra, recovery de carrinho abandonado, disparos em massa), instalar os kits separados:
  - **kit-compras-hotmart** — boas-vindas auto após compra
  - **kit-recovery** — 6 toques T1-T6
  - **kit-dispatcher** — disparo em massa pra base

---

## Operação contínua — leitura obrigatória

Antes de operar de verdade, **leia [`regras.md`](./regras.md)** completo. As 14 regras inegociáveis. Cada uma nasceu de um incidente — não viola.
