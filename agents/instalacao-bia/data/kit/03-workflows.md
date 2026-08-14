# Passo 4 (na ordem do README) — Importar 4 Workflows + Ajustes Obrigatórios

> Tempo estimado: 45-60 minutos
> O que entrega: 4 workflows importados, com IDs/URLs ajustados pros SEUS, todos ativados.

---

## Pré-requisito

- Credentials criadas no passo anterior (`04-credentials.md`)
- Os 4 workflows já vêm no kit, na pasta `workflows/`

---

## Os 4 workflows do kit Bia

| # | Workflow | Arquivo no kit | Tem ID novo? |
|---|----------|----------------|--------------|
| 1 | WF-INBOUND-CLOUD | `workflows/wf-inbound-cloud.json` | sim (anote) |
| 2 | WF-AGENT-CORE-CLOUD | `workflows/wf-agent-core-cloud.json` | sim (anote) |
| 3 | WF-OUTBOUND-CLOUD | `workflows/wf-outbound-cloud.json` | sim (anote) |
| 4 | WF-CHATWOOT-HUMAN | `workflows/wf-chatwoot-human.json` | sim (anote) |

### Engenharia — quem chama quem

```
Meta webhook ──▶ WF-INBOUND-CLOUD
                    │ (executeWorkflow)
                    ▼
              WF-AGENT-CORE-CLOUD
                    │ (executeWorkflow)
                    ▼
              WF-OUTBOUND-CLOUD ──▶ Graph API ──▶ lead recebe msg

Chatwoot ──▶ WF-CHATWOOT-HUMAN ──▶ Graph API ──▶ lead recebe msg (resposta humana)
                                                  │
                                                  └─▶ Supabase (seta is_human_takeover)
```

---

## 4.1 — Importar via UI do n8n (mais simples)

Pra cada arquivo `.json`:

1. n8n Editor > **Workflows > Import from File**
2. Selecione o JSON
3. Click "Import" — o workflow aparece NOVO (não vai sobrescrever existente)
4. **NÃO ATIVE AINDA** — primeiro tem que fazer os ajustes

### Alternativa via API n8n

```bash
export N8N_URL="https://seu-n8n.com"
export N8N_KEY="..."

for f in workflows/wf-inbound-cloud.json \
          workflows/wf-agent-core-cloud.json \
          workflows/wf-outbound-cloud.json \
          workflows/wf-chatwoot-human.json; do
  echo "Importing $(basename $f)..."
  curl -s -X POST "$N8N_URL/api/v1/workflows" \
    -H "X-N8N-API-KEY: $N8N_KEY" \
    -H "Content-Type: application/json" \
    -d @"$f" | jq -r '.id // .message'
done
```

---

## 4.2 — Logging (já resolvido no kit)

> O OUTBOUND deste kit já vem **sem** os nodes de logging externo (`Call WF-LOGGER`, `Prepare Logger Payload`) — eles dependiam de um sistema de monitoramento (WF-LOGGER) que não faz parte do kit base. A chain termina em `Sender Cloud API → Log Interacao` (log local em console + estatísticas em memória, zero dependência externa). **Nada a fazer aqui.**

---

## 4.3 — Ajustes em **WF-INBOUND-CLOUD**

Abra cada node e cheque:

### Node `Webhook Cloud API` (primeiro node)
- **Path:** `wf-inbound-cloud` (manter — esse vai pra Meta)
- **Verify Token:** definir o MESMO valor que você cadastrar na Meta (passo 2.7 do meta-cloud.md)
- **HTTP Method:** GET + POST (Meta usa GET no handshake, POST nos eventos)
- **Response Mode:** Last Node ou Immediately (verificar — Meta espera 200 em <5s)

### Node `Parse Cloud API` (Code)
- Hardcoded `phone_number_id` esperado — substituir pelo SEU
- Lógica de extração de mensagens da estrutura JSON da Meta (não mexer)

### Node `Resolve Contact (Supabase)` (Code)
- URL do Supabase substituído pela SUA
- Service role key (via env ou hardcoded — preferir env)

### Node `Detector OptOut` + `Apply OptOut` (Code)
- Lógica de detectar "Sair" (case-insensitive, com/sem acento) — não mexer, regra universal
- URL do Supabase pra inserir em `blacklist_api`

### Node `Consulta Supabase` (Code/HTTP — busca perfil completo do lead)
- URL Supabase
- **Tabelas referenciadas:** `bia_whatsapp_contacts`, `pessoas`, `compras`, `aplicacoes`, `eventos_participados`, `alunos_mentoria`, `checkpoints_mentoria`, `nps`, `grupos_whatsapp`
- Se sua infra não tem TODAS essas tabelas (aluno talvez não tenha `alunos_mentoria`), pode comentar as queries — só certifique que `pessoas` e `compras` existem

### Node `Sync Inbound → Chatwoot` (Code)
- URL do Chatwoot (`https://chatwoot.seudominio.com`)
- API token do Chatwoot
- `account_id` (geralmente 1)
- `inbox_id` do inbox API/Cloud API que você criou no Chatwoot

### Node `Sync Humano → Chatwoot` (Code)
- Mesmas configs do node acima

### Node `Download Audio` (HTTP Request — só pra mensagens de áudio)
- URL: `https://graph.facebook.com/v21.0/{media_id}`
- Credential: Meta Cloud API

### Nodes `Whisper Transcricao` e `Vision Descricao` (OpenAI)
- Credential: OpenAI

### Node `Chama WF-AGENT-CORE` (Execute Workflow)
- **Workflow ID:** trocar pelo ID novo do SEU WF-AGENT-CORE-CLOUD (aparece na URL após importar)

---

## 4.4 — Ajustes em **WF-AGENT-CORE-CLOUD**

Este é o coração da Bia. **Cuidado triplo aqui.**

### Node `Configuracao do Agente` (Code — ~64k chars)
- Aqui vivem os prompts L3 dos 4 agentes (`AGENT_L3['bia']`, `['bia-recovery']`, `['bia-boas-vindas']`, `['bia-convite']`)
- O prompt vem como **exemplo**, já com **placeholders nos links** (`{{HOTMART_PRODUCT_CODE}}`, `{{HOTMART_OFERTA}}`, `{{LINK_PAGINA}}`, `{{LINK_GRUPO_WHATSAPP}}`) — **não** com links de venda reais. Você REESCREVE o prompt no passo 5 com os seus dados.
- URLs do Supabase via placeholder `{{SUPABASE_PROJECT_REF}}` — substituir
- Função `fetchWorkshopConfig()` faz query em `workshop_config?status=eq.active` — só vai funcionar se você populou a tabela no passo 1.3 (opcional)

### Node `Read Supabase Context` (HTTP — RPC `get_agent_context`)
- URL do Supabase

### Node `Read Campaign Data` (HTTP — RPC `get_campaign_data`)
- URL do Supabase

### Node `Context Manager` (Code)
- Código universal, **não mexer**
- Aplica `applyWorkshopVars` + sanity check de placeholder

### Nodes `Call Anthropic` + `Fallback Anthropic` (HTTP)
- URL: `https://api.anthropic.com/v1/messages`
- Credential: **Anthropic API**
- Headers: `x-api-key` + `anthropic-version: 2023-06-01`
- **Model:** vem `claude-opus-4-6`. Se sua conta Anthropic não tem acesso ao Opus, troca pra `claude-sonnet-4-6` (mais barato, quase tão bom). Sonnet 4.6 é o default recomendado pra começar.

### Nodes `OpenAI Chat Completions` + `Fallback OpenAI` (HTTP)
- URL: `https://api.openai.com/v1/chat/completions`
- Credential: **OpenAI API**
- Model: `gpt-4.1-mini`

### Node `Save Context to Supabase` (HTTP — UPSERT em `bia_agent_context`)
- URL do Supabase

### Node `Chama WF-OUTBOUND-CLOUD` (Execute Workflow)
- **Workflow ID:** trocar pelo ID do SEU WF-OUTBOUND-CLOUD

### Node `Handoff Actions` (Code)
- URL do Supabase pra setar `is_human_takeover=true`

---

## 4.5 — Ajustes em **WF-OUTBOUND-CLOUD**

### Node `Config Cloud API` (Code)
- Hardcoded: `PHONE_NUMBER_ID`, `META_TOKEN` (ou via env var). Trocar pelos SEUS.

### Node `Check Atendimento Humano` (Code)
- URL do Supabase pra ler `is_human_takeover` em `bia_whatsapp_contacts`

### Node `Chunker (Separa Frases)` (Code)
- Lógica universal — não mexer

### Node `Sender Cloud API` (Code)
- URL: `https://graph.facebook.com/v21.0/{phone_number_id}/messages`
- Credential: Meta Cloud API (ou env var)
- Loop com delay 3.2s entre chunks + typing indicator

### Node `Log Interacao` (no OUTBOUND)
- Log local (console) + estatísticas diárias em memória. Sem dependência externa. **Não mexer.**

> Os nodes de logging externo (`Call WF-LOGGER`, `Prepare Logger Payload`) já foram removidos do kit. A chain termina em `Sender → Log Interacao`.

---

## 4.6 — Ajustes em **WF-CHATWOOT-HUMAN**

### Node `Webhook` (entrada — chamado pelo Chatwoot)
- **Path:** `wf-chatwoot-human`
- Vai gerar URL: `https://webhook.seudominio.com/webhook/wf-chatwoot-human`
- **Configure isso no Chatwoot:** Settings > Integrations > Webhooks > Add. URL = a de cima, evento = "Message Created"

### Node `Filter` ou `If` (filtra só msgs outbound de humano)
- Verifica que `message_type=outgoing` e `sender_type=user` (humano digitando), não outbound da própria Bia que já passou aqui

### Node `Lookup Contact Supabase` (HTTP)
- URL Supabase
- Query: `bia_whatsapp_contacts?chatwoot_conversation_id=eq.{id_da_conversa}`
- Pega o `phone` correspondente

### Node `Send via Cloud API` (HTTP)
- URL: `https://graph.facebook.com/v21.0/{phone_number_id}/messages`
- Credential: Meta Cloud API
- Type: `text` (resposta humana é texto livre)

### Node `Set is_human_takeover=true` (HTTP — PATCH Supabase)
- Marca o contato como em atendimento humano
- A próxima msg do lead que chegar via INBOUND vai ver a flag e a Bia não responde

---

## 4.7 — Salvar IDs dos workflows novos (referência cruzada)

Após importar e ajustar, anote os IDs (URL do editor):

```
WF-INBOUND-CLOUD: ___________________
WF-AGENT-CORE-CLOUD: ___________________
WF-OUTBOUND-CLOUD: ___________________
WF-CHATWOOT-HUMAN: ___________________
```

Esses IDs vão ser referenciados em **Execute Workflow** nodes:
- WF-INBOUND-CLOUD chama WF-AGENT-CORE-CLOUD
- WF-AGENT-CORE-CLOUD chama WF-OUTBOUND-CLOUD

Verifique em cada Execute Workflow node que o ID referenciado é o do SEU workflow, não os de origem.

---

## 4.8 — Ordem de ativação

Ative na ordem inversa do fluxo, pra cada um já achar suas dependências ativas:

1. WF-OUTBOUND-CLOUD
2. WF-AGENT-CORE-CLOUD
3. WF-INBOUND-CLOUD ← este é o que a Meta vai chamar via webhook
4. WF-CHATWOOT-HUMAN ← este é o que o Chatwoot vai chamar via webhook

---

## 4.9 — REGRA-005/006 — Cache Cycle após PATCH via API

> n8n cacheia workflows em memória. PATCH via API atualiza storage mas NÃO a instância ativa.

Sempre que você editar workflow via API (depois das edições iniciais), execute cache cycle:

```bash
WF_ID="seu_workflow_id"

# 1. Pega versionId atual
VID=$(curl -s "$N8N_URL/api/v1/workflows/$WF_ID" \
  -H "X-N8N-API-KEY: $N8N_KEY" | jq -r '.versionId')

# 2. Deactivate
curl -s -X POST "$N8N_URL/rest/workflows/$WF_ID/deactivate" \
  -H "X-N8N-API-KEY: $N8N_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"versionId\":\"$VID\"}"

# 3. Get NOVO versionId
VID2=$(curl -s "$N8N_URL/api/v1/workflows/$WF_ID" \
  -H "X-N8N-API-KEY: $N8N_KEY" | jq -r '.versionId')

# 4. Reactivate
curl -s -X POST "$N8N_URL/rest/workflows/$WF_ID/activate" \
  -H "X-N8N-API-KEY: $N8N_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"versionId\":\"$VID2\"}"
```

> **ATENÇÃO:** `PATCH {"active":false}` NÃO funciona em workflows com webhook — sempre retorna `active:true`. Use os endpoints `/deactivate` e `/activate` com `versionId`.

---

## 4.10 — Checklist final

- [ ] 4 workflows importados via UI ou API
- [ ] WF-INBOUND: webhook path = `wf-inbound-cloud` + verify token configurado igual ao da Meta
- [ ] WF-INBOUND: sync Chatwoot configurado com URL/token/account_id/inbox_id
- [ ] WF-AGENT-CORE: model do Claude correto pra sua conta Anthropic (Opus se tem, Sonnet 4.6 default)
- [ ] WF-OUTBOUND: phone_number_id seu hardcoded ou via env
- [ ] WF-CHATWOOT-HUMAN: webhook configurado no Chatwoot apontando pra `webhook.SEUDOMINIO/webhook/wf-chatwoot-human`
- [ ] Todos os Execute Workflow nodes referenciam IDs dos SEUS workflows (não os de origem)
- [ ] Todas URLs `PROJETO_EXEMPLO` substituídas pela sua Supabase URL
- [ ] Workflows ativados na ordem 4.8

---

**Próximo passo:** [`05-prompts.md`](./05-prompts.md) — customizar L1+L2+L3+L4 com SEUS dados.
