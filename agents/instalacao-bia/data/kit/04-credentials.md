# Passo 3 (na ordem do README) — Credentials no n8n

> Tempo estimado: 20 minutos
> O que entrega: 4-5 credentials configuradas no n8n (Anthropic, OpenAI, Supabase, Meta Cloud API, Chatwoot opcional)

---

## Por que fazer credentials antes de importar workflows?

Workflows do n8n exportados de outra instância vêm com **referências** a credentials por ID. Quando você importa num n8n novo, esses IDs não existem — então os workflows entram com credentials "missing" e quebrados. Criar primeiro evita ter que refazer mapping em cada node.

---

## Credenciais que você vai criar (5 — todas obrigatórias neste kit)

| # | Credential | Tipo | Pra que serve |
|---|-----------|------|---------------|
| 1 | Anthropic API | HTTP Header Auth | LLM primário (Claude Opus / Sonnet) |
| 2 | OpenAI API | HTTP Header Auth | LLM fallback (GPT-4.1-mini) + Whisper (audio) + Vision (imagem) |
| 3 | Supabase | HTTP Header Auth | Todas operações no banco (service_role) |
| 4 | Meta Cloud API | HTTP Header Auth | Enviar mensagens via Graph API |
| 5 | Chatwoot | HTTP Header Auth | Sync conversas + caminho de volta humano → Cloud API (WF-CHATWOOT-HUMAN) |

---

## 3.1 — Anthropic API

1. Vá em `console.anthropic.com` → **Settings > API Keys**
2. Clique **Create Key**
3. Nomeie (ex: "n8n bia") e copie

No n8n:

1. **Credentials > New > HTTP Header Auth**
2. Nome: `Anthropic API`
3. Header Name: `x-api-key`
4. Header Value: `sk-ant-...` (sua key)
5. Save

> O WF-AGENT-CORE-CLOUD também precisa do header `anthropic-version: 2023-06-01` mas isso vai hardcoded no node, não na credential.

---

## 3.2 — OpenAI API

1. Vá em `platform.openai.com/api-keys`
2. **Create new secret key**
3. Copie (só aparece uma vez)

No n8n:

1. **Credentials > New > HTTP Header Auth**
2. Nome: `OpenAI API`
3. Header Name: `Authorization`
4. Header Value: `Bearer sk-...` (com o `Bearer ` na frente)
5. Save

---

## 3.3 — Supabase

> Você vai usar a **service_role** key (não a anon). Service role bypassa RLS — é o que workflows precisam pra escrever em qualquer tabela.

1. Pegue do Supabase Dashboard: **Settings > API > service_role key** (a key longa, *secret*)

No n8n:

1. **Credentials > New > HTTP Header Auth**
2. Nome: `Supabase`
3. Header Name: `apikey`
4. Header Value: `eyJhbG...` (sua service_role key)
5. Save

> O workflow vai usar ESSA mesma key em 2 headers diferentes: `apikey` e `Authorization: Bearer {KEY}`. Se você ver o segundo no JSON do workflow, o n8n vai pedir pra colocar a key lá também — ou você cria 2 credentials, ou (mais limpo) configura como variável de ambiente n8n e usa expressão.

### Alternativa mais limpa — variáveis de ambiente n8n

Em vez de credentials, você pode definir:

```yaml
# No docker-compose.yml do n8n (ou .env)
SUPABASE_URL=https://SEU.supabase.co
SUPABASE_KEY=eyJhbG...
```

E nos workflows usar `={{$env.SUPABASE_URL}}` + `={{$env.SUPABASE_KEY}}`. Restart o n8n depois.

**Vantagem:** se trocar a key, atualiza num lugar só (env), não em 10 credentials.

---

## 3.4 — Meta Cloud API

> Use o System User Token que você gerou no passo 2.5.

No n8n:

1. **Credentials > New > HTTP Header Auth**
2. Nome: `Meta Cloud API`
3. Header Name: `Authorization`
4. Header Value: `Bearer EAA...` (System User Token, com `Bearer ` na frente)
5. Save

### Alternativa env vars (recomendado):

```yaml
META_TOKEN=EAA...
META_PHONE_NUMBER_ID=12345...
META_WABA_ID=12345...
META_APP_ID=12345...
META_APP_SECRET=abc123...
META_VERIFY_TOKEN=bia-cloud-{{SEU_DOMINIO}}-2026
```

Restart o n8n. Workflows vão usar `={{$env.META_TOKEN}}` em vez de credential — mais portável.

---

## 3.5 — Chatwoot (OBRIGATÓRIO)

> Chatwoot é a ferramenta que você (e seu aluno) vai usar pra **monitorar a Bia em tempo real** e **intervir manualmente** quando precisar. Sem Chatwoot, você fica cego — não tem como ver o que a Bia tá conversando nem como assumir o controle.

### Pré-requisito: criar inbox tipo "API"

Antes de configurar a credential no n8n, você precisa criar um **inbox tipo API** no Chatwoot. Esse inbox é o "balcão" onde as conversas da Bia vão aparecer.

> **Por que tipo API e não WhatsApp Business Cloud?** O Chatwoot tem um canal nativo de WhatsApp Business Cloud que se conecta direto na Meta. Você NÃO quer isso — porque a Meta só permite UMA integração por número, e o seu número já está integrado no n8n (passou pelo passo 2). Se você usar o canal nativo do Chatwoot, vai roubar o webhook do n8n e quebrar tudo.
>
> Solução: inbox tipo **API** (genérico). O Chatwoot vira "espelho" — você manda mensagens pra ele via API (do n8n) e ele te avisa via webhook quando um agente humano digita resposta.

#### Passo a passo no Chatwoot:

1. Chatwoot Dashboard > **Settings > Inboxes**
2. Clique **Add Inbox**
3. Escolha **API** (ícone com `<>`)
4. Preencha:
   - **Channel name:** ex: "WhatsApp Bia"
   - **Webhook URL:** deixe VAZIO por enquanto. (Vamos voltar aqui no passo 4 pra configurar `https://webhook.{{SEU_DOMINIO}}/webhook/wf-chatwoot-human`)
   - Save
5. Próxima tela: **Add Agents** — adicione você mesmo (e qualquer outro humano que vai monitorar)
6. Próxima tela: **Voilà** — anote o **Inbox ID** que aparece na URL: `chatwoot.../app/accounts/N/settings/inboxes/M` → o M é o Inbox ID

#### Configurações pós-criação (importante)

Clique no inbox criado > aba **Configuration**:

- **Inbox Identifier** (Hash): aparece — você não vai usar, mas é o ID interno do inbox
- **HMAC Authentication**: pode deixar desligado pra começar (ativar depois se quiser hardening de segurança)
- **Pre-Chat Form**: deixe desligado
- **Sender Name Type**: "Friendly" (mostra nome do contato em vez de phone)

Aba **Collaborators**:
- Você + qualquer outro humano que vai responder. Cada agente precisa ter conta no Chatwoot.

### Pegar credenciais

1. **URL do Chatwoot:** ex: `https://chatwoot.seudominio.com` — anota
2. **Account ID:** URL do dashboard mostra `/app/accounts/N` — anota o N (geralmente `1`)
3. **Inbox ID:** anotou no passo 6 acima
4. **Access Token:**
   - Chatwoot Dashboard > **clique no seu avatar (canto sup direito) > Profile Settings**
   - Aba **Access Token**
   - Copie o token

### Configurar credential no n8n

1. **Credentials > New > HTTP Header Auth**
2. Nome: `Chatwoot`
3. Header Name: `api_access_token`
4. Header Value: token do Chatwoot
5. Save → **anote o ID gerado da credential** (`{{CRED_ID_CHATWOOT}}`)

### Variáveis pra anotar

| Variável | Onde achar | Exemplo |
|----------|-----------|---------|
| `CHATWOOT_URL` | seu domínio | `https://chatwoot.seudominio.com` |
| `CHATWOOT_ACCOUNT_ID` | URL do dashboard `/app/accounts/N` | `1` |
| `CHATWOOT_INBOX_ID` | URL do inbox `/inboxes/M` | `1` ou `2` |
| `CHATWOOT_TOKEN` | Profile > Access Token | `xyz123...` |
| `CRED_ID_CHATWOOT` | ID da credential no n8n | (gerado ao salvar) |

### Alternativa env vars (recomendado pra workflows não terem token hardcoded)

No docker-compose.yml do n8n:

```yaml
CHATWOOT_URL=https://chatwoot.seudominio.com
CHATWOOT_ACCOUNT_ID=1
CHATWOOT_INBOX_ID=1
CHATWOOT_TOKEN=xyz123...
```

Restart o n8n. Nos workflows, use `={{ $env.CHATWOOT_URL }}` etc.

### Webhook reverso (Chatwoot → n8n) — configura no passo 4

Quando você importar o WF-CHATWOOT-HUMAN no passo 4, vai pegar a URL do webhook dele. Volta no Chatwoot:

1. Settings > Inboxes > seu inbox "WhatsApp Bia" > **Configuration**
2. Campo **Webhook URL**: cole `https://webhook.{{SEU_DOMINIO}}/webhook/wf-chatwoot-human`
3. Save

A partir disso: humano digita resposta no Chatwoot → Chatwoot POST pra essa URL → n8n recebe → envia via Graph API pro WhatsApp do lead.

### Como o sync flui (visão geral)

```
Lead manda msg WhatsApp
   ↓
Meta envia webhook
   ↓
WF-INBOUND-CLOUD recebe
   ↓
Node "Sync Inbound → Chatwoot" cria/atualiza:
   - Contato no Chatwoot
   - Conversation no inbox da Bia
   - Mensagem INBOUND
   ↓
Bia processa + responde via AGENT-CORE + OUTBOUND
   ↓
Node "Sync Outbound → Chatwoot" registra a mensagem da Bia como OUTBOUND
   ↓
Você vê tudo em tempo real no Chatwoot ✓


Se você (humano) quiser intervir:
   ↓
Você digita no Chatwoot
   ↓
Chatwoot POST → WF-CHATWOOT-HUMAN
   ↓
WF-CHATWOOT-HUMAN:
   - Lookup phone do contato no Supabase
   - Envia via Graph API pro WhatsApp do lead
   - PATCH is_human_takeover=true em bia_whatsapp_contacts
   ↓
Bia para de responder pra esse contato (até você devolver controle)
```

### Devolver controle pra Bia (após terminar atendimento humano)

Quando você fechar o atendimento humano e quiser que a Bia volte a responder:

```bash
curl -s -X PATCH "$SUPA_URL/rest/v1/bia_whatsapp_contacts?phone=eq.55DDDXXXXXXXX" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" \
  -H "Content-Type: application/json" \
  -d '{"is_human_takeover": false, "active_agent_id": "bia"}'
```

E feche a conversa no Chatwoot (Resolve).

---

## 3.6 — Testar cada credential

Antes de continuar, valide que cada uma funciona com um curl simples (pelo seu terminal, não pelo n8n):

### Anthropic
```bash
curl -s "https://api.anthropic.com/v1/messages" \
  -H "x-api-key: $ANTHROPIC_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-3-haiku-20240307","max_tokens":10,"messages":[{"role":"user","content":"hi"}]}' | head
```
Deve retornar JSON com `content`.

### OpenAI
```bash
curl -s "https://api.openai.com/v1/models" \
  -H "Authorization: Bearer $OPENAI_KEY" | jq -r '.data[0].id'
```
Deve retornar nome de um model.

### Supabase
```bash
curl -s "$SUPA_URL/rest/v1/bia_whatsapp_contacts?select=count" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" \
  -H "Prefer: count=exact" -H "Range: 0-0" -I | grep -i content-range
```
Deve retornar `content-range: */0` (zero rows ainda, mas tabela existe).

### Meta
```bash
curl -s "https://graph.facebook.com/v21.0/me" \
  -H "Authorization: Bearer $META_TOKEN" | jq
```
Deve retornar info do System User (id + nome).

---

## 3.7 — Checklist final

- [ ] Anthropic credential criada e testada
- [ ] OpenAI credential criada e testada
- [ ] Supabase credential criada e testada (ou env vars no docker-compose)
- [ ] Meta Cloud API credential criada e testada (ou env vars)
- [ ] Chatwoot: inbox API criado, account_id/inbox_id/token anotados, credential criada
- [ ] Tudo guardado no cofre

---

**Próximo passo:** [`03-workflows.md`](./03-workflows.md) — importar e ajustar os 9 workflows.
