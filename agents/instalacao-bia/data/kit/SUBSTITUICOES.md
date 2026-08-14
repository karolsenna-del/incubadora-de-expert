# Substituições Obrigatórias — Checklist Consolidado

> Todos os valores que você (aluno) precisa trocar pelos SEUS antes da Bia funcionar.
> Use este doc como referência cruzada enquanto executa os passos 1-7 do kit.
> Marque os checkboxes conforme for resolvendo.

---

## Mapa de valores

Preencha esta tabela primeiro (de cima pra baixo). Volte aqui sempre que precisar consultar um valor.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ INFRA QUE VOCÊ JÁ TEM                                                   │
├─────────────────────────────────────────────────────────────────────────┤
│ {{SEU_DOMINIO}}              = _____________________________            │
│ {{N8N_URL}}                  = https://n8n.{{SEU_DOMINIO}}              │
│ {{N8N_API_KEY}}              = (do painel n8n)                          │
│ {{WEBHOOK_DOMAIN}}           = webhook.{{SEU_DOMINIO}}                  │
├─────────────────────────────────────────────────────────────────────────┤
│ SUPABASE (passo 1)                                                      │
├─────────────────────────────────────────────────────────────────────────┤
│ {{SUPABASE_PROJECT_REF}}     = _____________________________            │
│   (subdomínio antes de .supabase.co)                                    │
│ {{SUPABASE_URL}}             = https://{{SUPABASE_PROJECT_REF}}.supabase.co │
│ {{SUPABASE_SERVICE_ROLE_KEY}} = ___________________________             │
│ {{SUPABASE_ANON_KEY}}        = _____________________________            │
├─────────────────────────────────────────────────────────────────────────┤
│ META CLOUD API (passo 2)                                                │
├─────────────────────────────────────────────────────────────────────────┤
│ {{BM_ID}}                    = _____________________________            │
│ {{WABA_ID}}                  = _____________________________            │
│ {{APP_ID}}                   = _____________________________            │
│ {{APP_SECRET}}               = _____________________________            │
│ {{SYSTEM_USER_TOKEN}}        = EAA_____________________________         │
│ {{PHONE_NUMBER_ID}}          = _____________________________            │
│ {{NUMERO_WHATSAPP}}          = +55 11 _____ (display)                   │
│ {{VERIFY_TOKEN}}             = bia-cloud-{{SEU_DOMINIO}}-2026           │
│   (você inventa — usa nos 2 lados Meta + n8n)                           │
│ {{PIN_2FA_META}}             = ____ (anota no cofre)                    │
├─────────────────────────────────────────────────────────────────────────┤
│ LLMs (passo 3)                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│ {{ANTHROPIC_API_KEY}}        = sk-ant-____________________              │
│ {{OPENAI_API_KEY}}           = sk-_______________________               │
├─────────────────────────────────────────────────────────────────────────┤
│ CHATWOOT — instalação (passo 0.5 — só no docker-compose do servidor)    │
├─────────────────────────────────────────────────────────────────────────┤
│ {{CHATWOOT_DOMINIO}}         = chatwoot.{{SEU_DOMINIO}} (DNS A → IP)    │
│ {{CW_POSTGRES_PASSWORD}}     = (openssl rand -hex 16) 🔒                │
│ {{CW_REDIS_PASSWORD}}        = (openssl rand -hex 16) 🔒                │
│ {{CW_SECRET_KEY_BASE}}       = (openssl rand -hex 64) 🔒                │
├─────────────────────────────────────────────────────────────────────────┤
│ CHATWOOT — inbox (passo 3)                                              │
├─────────────────────────────────────────────────────────────────────────┤
│ {{CHATWOOT_URL}}             = https://chatwoot.{{SEU_DOMINIO}}         │
│ {{CHATWOOT_ACCOUNT_ID}}      = ____ (geralmente 1)                      │
│ {{CHATWOOT_INBOX_ID}}        = ____ (após criar inbox tipo API)         │
│ {{CHATWOOT_TOKEN}}           = _____________________________            │
├─────────────────────────────────────────────────────────────────────────┤
│ N8N CREDENTIAL IDs (passo 3 — você cria, anota o ID gerado)             │
├─────────────────────────────────────────────────────────────────────────┤
│ {{CRED_ID_ANTHROPIC}}        = ____________ (10-20 chars)               │
│ {{CRED_ID_OPENAI}}           = ____________                             │
│ {{CRED_ID_META}}             = ____________                             │
│ {{CRED_ID_SUPABASE}}         = ____________                             │
│ {{CRED_ID_CHATWOOT}}         = ____________                             │
├─────────────────────────────────────────────────────────────────────────┤
│ WORKFLOW IDs (passo 4 — gerados após importar)                          │
├─────────────────────────────────────────────────────────────────────────┤
│ {{WF_INBOUND_ID}}            = ____________                             │
│ {{WF_AGENT_CORE_ID}}         = ____________                             │
│ {{WF_OUTBOUND_ID}}           = ____________                             │
│ {{WF_CHATWOOT_HUMAN_ID}}     = ____________                             │
├─────────────────────────────────────────────────────────────────────────┤
│ IDENTIDADE DA SUA BIA (passo 5)                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ {{NOME_AGENTE}}              = ____________ (ex: Bia, Sofia, Lia)       │
│ {{NOME_EXPERT}}              = ____________ (você ou nome do expert)    │
│ {{NOME_EMPRESA}}             = ____________                             │
│ {{INSTAGRAM_EXPERT}}         = @___________                             │
│ {{WHATSAPP_SUPORTE}}         = 55DDDXXXXXXXX (só dígitos)               │
│ {{EMAIL_SUPORTE}}            = suporte@_____________                    │
├─────────────────────────────────────────────────────────────────────────┤
│ PRODUTO / OFERTA (passo 5)                                              │
├─────────────────────────────────────────────────────────────────────────┤
│ {{NOME_PRODUTO}}             = ____________                             │
│ {{NOME_PRODUTO_CURTO}}       = ____________                             │
│ {{LINK_DESCONTO_RECOVERY}}   = ____________                             │
│ {{LINK_DESCONTO_CONVITE}}    = ____________                             │
│ {{LINK_CHECKOUT_NORMAL}}     = ____________                             │
│ {{LINK_GRUPO_WHATSAPP}}      = ____________                             │
│ {{FORMAS_PAGAMENTO}}         = ____________                             │
│ {{POLITICA_GARANTIA}}        = ____________                             │
│ {{PROMESSA_PRODUTO}}         = ____________                             │
│ {{MECANISMO_PRODUTO}}        = ____________                             │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Onde cada valor é substituído

### Nos JSONs dos workflows (`workflows/*.json`)

Antes de importar, OU após importar (no editor n8n):

| Placeholder no JSON | Substituir por |
|---------------------|----------------|
| `{{SUPABASE_PROJECT_REF}}` | seu project ref |
| `{{SUPABASE_SERVICE_ROLE_KEY}}` | sua service_role key (Settings → API) — **🔒 secret** |
| `{{SUPABASE_ANON_KEY}}` | sua anon key (Settings → API) |
| `{{SYSTEM_USER_TOKEN}}` | token Meta System User (`EAA...`) — **🔒 secret** |
| `{{CHATWOOT_TOKEN}}` | token Chatwoot (Profile → Access Token) — **🔒 secret** |
| `{{PHONE_NUMBER_ID}}` | seu phone number ID |
| `{{WABA_ID}}` | sua WABA ID |
| `{{APP_ID}}` | seu app ID |
| `{{WHATSAPP_SUPORTE}}` | seu whatsapp suporte |
| `{{EMAIL_SUPORTE}}` | seu email suporte |
| `{{INSTAGRAM_EXPERT}}` | seu @ (sem @ na frente) |
| `{{SEU_DOMINIO}}` | seu domínio |
| `{{WF_INBOUND_ID}}` | ID do workflow Inbound após importar |
| `{{WF_AGENT_CORE_ID}}` | ID do workflow Agent Core após importar |
| `{{WF_OUTBOUND_ID}}` | ID do workflow Outbound após importar |
| `{{WF_CHATWOOT_HUMAN_ID}}` | ID do workflow Chatwoot Human após importar |
| `{{CRED_ID_ANTHROPIC}}` | ID da credential Anthropic |
| `{{CRED_ID_META}}` | ID da credential Meta |
| `{{CRED_ID_OPENAI}}` | ID da credential OpenAI |
| `{{N8N_PROJECT_ID}}` / `{{N8N_USER_ID}}` / `{{N8N_USER_EMAIL}}` / `{{N8N_PROJECT_NAME}}` / `{{NEW_WORKFLOW_ID}}` | irrelevantes — n8n vai gerar novos automaticamente |
| `{{HOTMART_PRODUCT_CODE}}` / `{{HOTMART_OFERTA}}` / `{{LINK_PAGINA}}` | links no prompt do AGENT-CORE — substituídos ao reescrever o prompt (passo 5) |

### Placeholders OPCIONAIS — alerta de handoff via Twilio

Os workflows trazem um alerta opcional (SMS/WhatsApp) quando um handoff acontece. Só preencha se quiser esse aviso; senão, deixe como está — o alerta simplesmente não dispara (falha silenciosa, não quebra nada).

| Placeholder | Substituir por |
|-------------|----------------|
| `{{TWILIO_ACCOUNT_SID}}` | Account SID do Twilio (opcional) |
| `{{TWILIO_AUTH_TOKEN}}` | Auth Token do Twilio (opcional) — **🔒 secret** |
| `{{TWILIO_FROM_NUMBER}}` | número Twilio de envio, ex: `+1...` (opcional) |

### Nos prompts (`prompts-template/*.md` — passo 5)

Quando você editar e injetar no node "Configuracao do Agente":

| Placeholder nos prompts | Substituir por |
|-------------------------|----------------|
| `{{NOME_AGENTE}}` | nome da sua Bia |
| `{{NOME_EXPERT}}` | seu nome ou nome do expert |
| `{{NOME_EMPRESA}}` | sua marca |
| `{{INSTAGRAM_EXPERT}}` | @ Instagram |
| `{{WHATSAPP_SUPORTE}}` | wa.me/55... (com `wa.me/` na frente!) |
| `{{EMAIL_SUPORTE}}` | email suporte |
| `{{NOME_PRODUTO}}` | nome completo do produto |
| `{{NOME_PRODUTO_CURTO}}` | versão curta do nome do produto |
| `{{LINK_DESCONTO_RECOVERY}}` | URL com `?sck=bia-recovery` |
| `{{LINK_DESCONTO_CONVITE}}` | URL com `?sck=bia-convite` |
| `{{LINK_CHECKOUT_NORMAL}}` | URL sem desconto |
| `{{LINK_GRUPO_WHATSAPP}}` | link do grupo oficial |
| `{{PROMESSA_PRODUTO}}` | 1 frase |
| `{{MECANISMO_PRODUTO}}` | 1 frase |

### Placeholders dinâmicos (NÃO substitua manualmente — Context Manager faz em runtime)

Estes ficam nos prompts e são substituídos pelo Context Manager lendo da tabela `workshop_config`:

```
{{data_full_text}}
{{data_short_text}}
{{data_event_range}}
{{data_template_var}}
{{event_time_start}}
{{event_time_end}}
{{duracao}}
{{end_signup_text}}
```

> Pra mudar valor desses (= mudar data do evento), você UPDATE a `workshop_config` no Supabase via `scripts/workshop-cycle.mjs shift`. Não mexe no prompt.

---

## Checklist por etapa

### Passo 0.5 — Chatwoot (instalação)

- [ ] Confirmou pré-requisitos: rede do proxy existe · `dig chatwoot.dominio` → IP do servidor · acesso ao servidor
- [ ] Gerou e guardou no cofre: `{{CW_POSTGRES_PASSWORD}}`, `{{CW_REDIS_PASSWORD}}`, `{{CW_SECRET_KEY_BASE}}`
- [ ] Preencheu `chatwoot/docker-compose.yml` (domínio + 3 segredos)
- [ ] Rodou `db:chatwoot_prepare` (1ª vez) + `docker compose up -d` → 4 containers Up
- [ ] `https://{{CHATWOOT_DOMINIO}}` abre com cadeado + criou conta admin

### Passo 1 — Supabase

- [ ] Anotou `{{SUPABASE_PROJECT_REF}}`
- [ ] Anotou `{{SUPABASE_SERVICE_ROLE_KEY}}`
- [ ] Anotou `{{SUPABASE_ANON_KEY}}`
- [ ] Rodou as 19 migrations
- [ ] Populou `workshop_config` (se tem evento) com 1 linha `status='active'`
- [ ] Inseriu 1 linha em `bia_campaign_data` com `agent_id='bia'`

### Passo 2 — Meta Cloud API

- [ ] Anotou `{{WABA_ID}}`, `{{APP_ID}}`, `{{APP_SECRET}}`
- [ ] Anotou `{{SYSTEM_USER_TOKEN}}` (System User Admin com 3 permissions, Never expires)
- [ ] Anotou `{{PHONE_NUMBER_ID}}` (do número registrado na WABA)
- [ ] Anotou `{{PIN_2FA_META}}` no cofre
- [ ] Definiu `{{VERIFY_TOKEN}}` (mesma string nos 2 lados Meta + n8n)
- [ ] Webhook validado na Meta (após importar WF-INBOUND-CLOUD no passo 4)

### Passo 3 — Credentials n8n

- [ ] Credential Anthropic criada → anotar `{{CRED_ID_ANTHROPIC}}`
- [ ] Credential OpenAI criada → anotar `{{CRED_ID_OPENAI}}`
- [ ] Credential Supabase criada (header `apikey`)
- [ ] Credential Meta Cloud API criada → anotar `{{CRED_ID_META}}`
- [ ] Credential Chatwoot criada → anotar `{{CRED_ID_CHATWOOT}}`
- [ ] Inbox tipo "API" criado no Chatwoot → anotar `{{CHATWOOT_INBOX_ID}}`

### Passo 4 — Workflows

- [ ] WF-OUTBOUND-CLOUD importado → anotar `{{WF_OUTBOUND_ID}}`
- [ ] WF-AGENT-CORE-CLOUD importado → anotar `{{WF_AGENT_CORE_ID}}`
- [ ] WF-INBOUND-CLOUD importado → anotar `{{WF_INBOUND_ID}}`
- [ ] WF-CHATWOOT-HUMAN importado → anotar `{{WF_CHATWOOT_HUMAN_ID}}`
- [ ] Todos os placeholders dos JSONs substituídos
- [ ] Executar Workflow nodes apontam pros IDs novos (cross-reference)
- [ ] Credentials atribuídas (não vermelhas) em todos os nodes HTTP
- [ ] Webhook Meta validado apontando pra `{{WEBHOOK_DOMAIN}}/webhook/wf-inbound-cloud`
- [ ] Webhook Chatwoot configurado apontando pra `{{WEBHOOK_DOMAIN}}/webhook/wf-chatwoot-human`
- [ ] Workflows ativados na ordem: OUTBOUND → AGENT-CORE → INBOUND → CHATWOOT-HUMAN

### Passo 5 — Prompts

- [ ] Definiu `{{NOME_AGENTE}}` + restante da identidade
- [ ] L1+L2 customizado (substituiu 5 placeholders)
- [ ] L3-triage customizado (mínimo essencial — o `bia` default)
- [ ] L3-recovery customizado (opcional — pra quando instalar kit-recovery)
- [ ] L3-boas-vindas customizado (opcional — pra quando instalar kit-compras)
- [ ] L3-convite customizado (opcional — pra quando instalar kit-dispatcher)
- [ ] L4-campanha customizado
- [ ] JS validado com `node -c` antes de PUT (REGRA-012)
- [ ] Injetado no node "Configuracao do Agente" via UI ou API
- [ ] Cache cycle executado (REGRA-005)
- [ ] L4 atualizado na `bia_campaign_data` no Supabase

### Passo 6 — Templates Cloud API

- [ ] 1 template aprovado (`teste_pipeline_bia` ou `hello_world`)

### Passo 7 — Smoke test

- [ ] Cenário 1 (pipeline base) — Bia responde
- [ ] Cenário 2 (trocar agent_id) — prompt muda
- [ ] Cenário 3 (opt-out "Sair") — blacklist insere
- [ ] Cenário 4 (handoff Chatwoot) — humano responde via painel

---

## ⚠️ Erros comuns por placeholder esquecido

| Sintoma | Causa provável |
|---------|----------------|
| Bia responde com placeholders literais (ex: `{{NOME_AGENTE}}`, `{{NOME_EXPERT}}`) | Prompt L1-L4 não foi preenchido no passo 5 |
| Bia tenta consultar Supabase de origem (`PROJETO_EXEMPLO`) | Esqueceu `{{SUPABASE_PROJECT_REF}}` em algum node |
| `Resolve Contact` falha no Supabase | Mesma coisa — URL Supabase errada |
| Workflow não dispara | `{{VERIFY_TOKEN}}` no n8n não bate com o cadastrado na Meta |
| Mensagem enviada mas não chega no lead | `{{PHONE_NUMBER_ID}}` no Sender está errado |
| Bia respondendo errado pra agent_id certo | `{{CRED_ID_ANTHROPIC}}` ou outras credentials marcadas como missing |
| `Chama WF-AGENT-CORE` no INBOUND aponta pra workflow inexistente | `{{WF_AGENT_CORE_ID}}` não foi substituído pelo ID novo |

---

## Como verificar de uma vez se sobrou placeholder em algum lugar

```bash
# Procurar placeholders não substituídos no workflow exportado
curl -s "$N8N_URL/api/v1/workflows/$WF_INBOUND_ID" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" | grep -ho '{{[A-Z_]*}}' | sort -u

# Não deve retornar nada (ou só placeholders dinâmicos {{data_*}} que vão ser substituídos em runtime)
```

Se aparecer `{{PHONE_NUMBER_ID}}` ou `{{SUPABASE_PROJECT_REF}}`: você esqueceu.
