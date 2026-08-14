# 🚀 INSTALL — Instalar a Bia do Zero

> **Você está aqui:** começou agora, recebeu o kit, quer instalar a Bia.
> **Pré-condição:** você JÁ TEM a **API oficial Meta (Cloud API) funcional** + **Supabase + n8n** rodando, num domínio com SSL (tudo de steps anteriores da mentoria).
> **O Chatwoot NÃO é pré-requisito** — ele é exclusivo da Bia, então a gente **instala aqui dentro** (Passo 0.5). O servidor/n8n/Supabase/domínio servem teu negócio todo, por isso vêm prontos de antes.
> **Tempo total:** ~3.5-4 horas focadas (pode dividir em 2 dias).

---

## Passo 0 — Antes de começar (10 min)

### 0.1 — Abra o kit lado a lado com este documento

Estrutura do kit:

```
kit-aluno/
├── INSTALL.md            ← você está aqui
├── README.md             ← visão geral do que você vai construir
├── SUBSTITUICOES.md      ← TODOS os valores que você vai trocar (mantenha aberto)
├── regras.md             ← 14 regras inegociáveis (ler ANTES dos passos 5 e 7)
├── 01-supabase.md
├── 02-meta-cloud.md
├── 03-workflows.md
├── 04-credentials.md
├── 05-prompts.md
├── 06-templates.md
├── 07-smoke.md
├── migrations/           ← 19 .sql pra rodar no Supabase
├── workflows/            ← 4 .json sanitizados pra importar no n8n
└── prompts-template/     ← 6 templates de prompt preenchíveis
```

### 0.2 — Decida agora 4 coisas

Não vai mais voltar atrás depois. Decida agora:

- [ ] **Nome da sua agente** (ex: Bia, Sofia, Lia) → `{{NOME_AGENTE}}`
- [ ] **Nome do expert** (você ou quem representa) → `{{NOME_EXPERT}}`
- [ ] **Nome da empresa/marca** → `{{NOME_EMPRESA}}`
- [ ] **Domínio que vai usar** (você já configurou) → `{{SEU_DOMINIO}}`

### 0.3 — Tenha em mãos

- [ ] Cofre pra anotar credenciais (1Password, Bitwarden, ou pelo menos um txt criptografado)
- [ ] Conta Anthropic + cartão pra API (~$3-30/mês)
- [ ] Conta OpenAI + cartão (~$1-10/mês)
- [ ] Conta Meta pessoal pra criar Business Manager
- [ ] Número de telefone disponível (não pode estar em outro WhatsApp Business)
- [ ] **Abra `SUBSTITUICOES.md` num editor** — você vai preencher conforme avança

---

## Passo 0.5 — Subir o Chatwoot self-hosted (20-30 min)

**Por que agora:** o Chatwoot é o painel onde você assume conversas humanas (handoff). É o único
componente exclusivo da Bia que ainda não está de pé. Suba ele **primeiro** porque demora alguns
minutos pra inicializar — deixa subindo e adianta o Passo 1 (migrations) enquanto isso.

**Antes:** confirme os 3 pré-requisitos — proxy/SSL no servidor (rede `easypanel` ou similar),
DNS `chatwoot.{{SEU_DOMINIO}}` apontando pro IP do servidor, e acesso ao servidor.

```bash
# no servidor, com o compose de chatwoot/docker-compose.yml já preenchido em /opt/chatwoot/:
cd /opt/chatwoot
docker compose pull
docker compose run --rm chatwoot bundle exec rails db:chatwoot_prepare   # 1ª vez: prepara o banco
docker compose up -d
docker compose ps                                                        # 4 containers Up/healthy
```

Depois: abra `https://chatwoot.{{SEU_DOMINIO}}` (cadeado), crie sua conta admin pela tela de cadastro.

✅ **Critério de sucesso:** painel abre com https válido e você loga como admin (inbox ainda não — é o Passo 3)

📖 **Guia completo (2 modos, troubleshooting):** o agente Preparador usa `knowledge/instalar-chatwoot.md`. Template: [`chatwoot/docker-compose.yml`](./chatwoot/docker-compose.yml) + [`chatwoot/README.md`](./chatwoot/README.md)

---

## Passo 1 — Aplicar migrations no Supabase (20 min)

**Por que primeiro:** tudo precisa dessas tabelas pra funcionar (workflows do n8n, prompts, recovery, etc).

```bash
# 1.1 — Anote do painel Supabase:
SUPA_URL="https://SEU_PROJETO.supabase.co"
SUPA_KEY="..." # service_role key (Settings > API)

# 1.2 — Anota no SUBSTITUICOES.md o {{SUPABASE_PROJECT_REF}}

# 1.3 — Aplicar as 19 migrations
supabase link --project-ref SEU_PROJECT_REF
cp migrations/*.sql supabase/migrations/
supabase db push --linked --include-all
```

✅ **Critério de sucesso:** 22+ tabelas Bia criadas (validar conforme `migrations/README.md`)

📖 **Detalhes completos:** [`01-supabase.md`](./01-supabase.md) + [`migrations/README.md`](./migrations/README.md)

---

## Passo 2 — API Meta Cloud (PRÉ-REQUISITO — já feito antes)

> ⚠️ **Isto NÃO faz parte desta instalação.** A API oficial Meta (Cloud API) já deve estar **funcional** quando você chega aqui — foi montada num step anterior da mentoria: Business Manager, WABA, App, System User + token permanente, número registrado + PIN, e o `{{VERIFY_TOKEN}}` definido.

Você só precisa ter **em mãos** (do step anterior), pra usar mais adiante:
- `{{WABA_ID}}`, `{{PHONE_NUMBER_ID}}`, `{{SYSTEM_USER_TOKEN}}`, `{{VERIFY_TOKEN}}`

A única parte da Meta que acontece **nesta** instalação é **apontar o webhook pro n8n** — e isso é no Passo 5 (fase Conectar), depois do n8n estar pronto.

📖 Se precisar revisar como a API Meta foi montada: [`02-meta-cloud.md`](./02-meta-cloud.md)

---

## Passo 3 — Inbox no Chatwoot (15 min)

**Por que agora:** o Chatwoot já está no ar (Passo 0.5). Criar o inbox aqui é rápido e libera a credential do passo 4.

1. Chatwoot > Settings > Inboxes > **Add Inbox** > tipo **API**
2. Name: "WhatsApp Bia"
3. Webhook URL: deixa vazio (volta no passo 6)
4. Add Agents: você + outros que vão monitorar
5. Anota `{{CHATWOOT_ACCOUNT_ID}}`, `{{CHATWOOT_INBOX_ID}}`
6. Profile Settings > Access Token → anota `{{CHATWOOT_TOKEN}}`

✅ **Critério de sucesso:** consegue acessar o inbox vazio no painel Chatwoot

📖 **Detalhes:** [`04-credentials.md`](./04-credentials.md) seção 3.5

---

## Passo 4 — Criar 5 credentials no n8n (15 min)

**Por que agora:** os workflows do passo 5 precisam delas.

1. **Anthropic API** (HTTP Header Auth) → anota `{{CRED_ID_ANTHROPIC}}`
2. **OpenAI API** (HTTP Header Auth) → anota `{{CRED_ID_OPENAI}}`
3. **Supabase** (HTTP Header Auth, header `apikey`)
4. **Meta Cloud API** (HTTP Header Auth, `Authorization: Bearer ...`) → anota `{{CRED_ID_META}}`
5. **Chatwoot** (HTTP Header Auth, header `api_access_token`) → anota `{{CRED_ID_CHATWOOT}}`

✅ **Critério de sucesso:** rodar curl de teste pra cada API retorna sucesso (procedimento em `04-credentials.md` seção 3.6)

📖 **Detalhes completos:** [`04-credentials.md`](./04-credentials.md)

---

## Passo 5 — Importar 4 workflows + ajustar (45-60 min)

**A parte mais delicada.** Leia `regras.md` ANTES de começar (especialmente REGRA-005 sobre cache cycle e REGRA-012 sobre JS validation).

### 5.1 — Importar os 4 JSONs

Ordem: OUTBOUND → AGENT-CORE → INBOUND → CHATWOOT-HUMAN

```bash
for f in kit-aluno/workflows/wf-outbound-cloud.json \
         kit-aluno/workflows/wf-agent-core-cloud.json \
         kit-aluno/workflows/wf-inbound-cloud.json \
         kit-aluno/workflows/wf-chatwoot-human.json; do
  curl -X POST "$N8N_URL/api/v1/workflows" \
    -H "X-N8N-API-KEY: $N8N_KEY" \
    -H "Content-Type: application/json" \
    -d @"$f"
done
```

### 5.2 — Anotar 4 workflow IDs gerados

Cada workflow novo tem ID. Anote em `SUBSTITUICOES.md`:
- `{{WF_OUTBOUND_ID}}`
- `{{WF_AGENT_CORE_ID}}`
- `{{WF_INBOUND_ID}}`
- `{{WF_CHATWOOT_HUMAN_ID}}`

### 5.3 — Substituir placeholders nos workflows (no editor n8n)

Pra cada um dos 4 workflows, abre no editor e:
- Substitui `{{SUPABASE_PROJECT_REF}}`, `{{PHONE_NUMBER_ID}}`, `{{WABA_ID}}` nos nodes HTTP
- Em "Execute Workflow" nodes, seleciona o workflow correto pelo dropdown (cross-reference cruzada)
- Em nodes com credentials missing (vermelho), atribui as credentials do passo 4

### 5.4 — Configurar webhooks externos

- **No Chatwoot:** Settings > Inboxes > "WhatsApp Bia" > Configuration > Webhook URL = `https://webhook.{{SEU_DOMINIO}}/webhook/wf-chatwoot-human`
- **Na Meta:** WhatsApp > Configuration > Webhook URL = `https://webhook.{{SEU_DOMINIO}}/webhook/wf-inbound-cloud` + Verify Token = o que você definiu no passo 2

### 5.5 — Ativar workflows na ordem

```bash
# Ordem: OUTBOUND → AGENT-CORE → INBOUND → CHATWOOT-HUMAN
```

✅ **Critério de sucesso:** todos os 4 workflows ativos, sem credentials vermelhas, webhook Meta retorna 200 quando você manda template

📖 **Detalhes completos:** [`03-workflows.md`](./03-workflows.md) + [`workflows/README.md`](./workflows/README.md)

---

## Passo 6 — Customizar e injetar prompts (60-90 min)

**Antes:** RELEIA `regras.md` REGRA-012 (JSON.stringify + node -c).

### 6.1 — Preencher os 5 templates de prompt

Copia os arquivos `prompts-template/*.md` pra um local de trabalho. Substitui:
- `{{NOME_AGENTE}}`, `{{NOME_EXPERT}}`, `{{NOME_EMPRESA}}`, `{{INSTAGRAM_EXPERT}}`
- `{{WHATSAPP_SUPORTE}}`, `{{EMAIL_SUPORTE}}`
- `{{NOME_PRODUTO}}`, `{{NOME_PRODUTO_CURTO}}`
- `{{LINK_DESCONTO_RECOVERY}}`, `{{LINK_DESCONTO_CONVITE}}`, `{{LINK_CHECKOUT_NORMAL}}`
- `{{PROMESSA_PRODUTO}}`, `{{MECANISMO_PRODUTO}}`, etc

**Mínimo essencial:** L1-L2-base + L3-triage + L4-campanha (pra Bia responder no modo `bia` default)
**Recomendado:** todos os 5 (deixa pronto pros kits adicionais futuros)

### 6.2 — Validar JS antes de injetar (REGRA-012)

```bash
# Pra cada bloco de texto que vai virar string JS:
node -e "console.log(JSON.stringify(require('fs').readFileSync('seu-prompt.txt','utf8')))" > escaped.js
node -c arquivo-completo-do-node.js  # tem que ser silencioso
```

### 6.3 — Injetar no node "Configuracao do Agente"

- Abre WF-AGENT-CORE-CLOUD no n8n editor
- Node "Configuracao do Agente"
- Preenche os placeholders nos prompts do objeto `AGENT_L3` (que já vem com os templates genéricos)
- Save

### 6.4 — Cache cycle (REGRA-005)

```bash
# Deactivate + Activate WF-AGENT-CORE-CLOUD via API com versionId
```

### 6.5 — UPDATE da L4 no Supabase

```bash
L4_TEXT=$(cat L4-campanha-preenchido.md)
curl -X PATCH "$SUPA_URL/rest/v1/bia_campaign_data?agent_id=eq.bia" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg t "$L4_TEXT" '{campaign_text: $t}')"
```

### 6.6 — (Opcional, só se tem evento) Popular `workshop_config`

```bash
# Comando completo em 01-supabase.md seção 1.3
```

✅ **Critério de sucesso:** prompt no n8n não tem nenhum `{{var}}` (exceto `{{data_*}}` dinâmico que vai ser substituído em runtime)

📖 **Detalhes completos:** [`05-prompts.md`](./05-prompts.md)

---

## Passo 7 — Submeter 1 template Cloud API (15 min + espera Meta)

**Opção rápida:** usar o `hello_world` que já vem aprovado por padrão na WABA. Pula este passo.

**Opção custom:** submete `teste_pipeline_bia` via Graph API (texto simples, sem variáveis, sem botão — categoria UTILITY aprova em <5min).

```bash
curl -X POST "https://graph.facebook.com/v21.0/{{WABA_ID}}/message_templates" \
  -H "Authorization: Bearer {{SYSTEM_USER_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{...}'  # ver 06-templates.md
```

✅ **Critério de sucesso:** template com status `APPROVED`

📖 **Detalhes completos:** [`06-templates.md`](./06-templates.md)

---

## Passo 8 — Smoke test e2e (30 min)

4 cenários:

### Cenário 1 — Pipeline base
Adiciona seu número no allowlist Development da WABA → manda template `hello_world` pra você → você responde no WhatsApp → Bia responde como `bia` (triage default)

### Cenário 2 — Trocar agent_id
PATCH `active_agent_id=bia-recovery` no Supabase → manda outra msg → Bia responde no MODO ESPECIAL do recovery

### Cenário 3 — Opt-out
Escreve "Sair" → blacklist insere → próximos disparos pulam seu número

### Cenário 4 — Handoff Chatwoot
Você digita resposta no painel Chatwoot → chega no seu WhatsApp → Bia para de responder (`is_human_takeover=true`)

✅ **Critério de sucesso:** todos os 4 cenários funcionam SEM `{{var}}` literal aparecer na resposta

📖 **Detalhes completos:** [`07-smoke.md`](./07-smoke.md)

---

## 🎉 Instalado!

A partir daqui:

### Pra operar todo dia
- **Monitorar:** abre Chatwoot. Tudo aparece em tempo real.
- **Intervir manual:** digita resposta no Chatwoot → vai pro lead → Bia se cala
- **Devolver controle pra Bia:** PATCH `is_human_takeover=false` + `active_agent_id=bia` no Supabase
- **Mudar data do evento:** UPDATE `workshop_config` (não mexe em prompt)

### Pra adicionar features depois

Quando precisar, instala um destes kits (separados):

| Quero... | Instalo... |
|----------|-----------|
| Boas-vindas automática pós-compra Hotmart | `kit-compras-hotmart` |
| Recovery automático (6 toques T1-T6) | `kit-recovery` |
| Disparo em massa pra base (convite, lembrete) | `kit-dispatcher` |

---

## ⚠️ Se algo der errado

1. **Releia `regras.md`** — 80% dos bugs são violação de regra
2. **Veja `07-smoke.md` seção "Diagnóstico de falhas"** — sintomas comuns mapeados
3. **Verifica no n8n se workflow tá ATIVO e teve execução recente**
4. **Verifica no Supabase se contato existe + `active_agent_id` certo**
5. **Pede ajuda no canal da mentoria** com print da execução do n8n + query do Supabase

---

## Resumo cronológico (cole no seu Notion/Trello)

```
PRÉ-REQUISITO — API Meta Cloud já funcional + infra-base de pé (servidor, n8n, Supabase, domínio/SSL)

□ Passo 0   — Decidir nomes + contas Anthropic/OpenAI em mãos + cofre (10min)
□ Passo 0.5 — Subir o Chatwoot self-hosted (https + admin) (20-30min)
□ Passo 1   — Migrations Supabase — pega a service_role key aqui (20min)
□ Passo 3   — Chatwoot inbox API, webhook vazio (15min)
□ Passo 4   — Credentials n8n: 5 credentials (15min)
□ Passo 5   — Importar + ajustar 4 workflows (45-60min)
□ Passo 6   — Customizar e injetar prompts L1-L4 (60-90min)
□ Passo 5.4-5.5 — Webhooks (Meta + Chatwoot) + ativar
□ Passo 7   — Submeter 1 template Cloud API (15min + espera Meta)
□ Passo 8   — Smoke test 4 cenários (30min)

TOTAL: ~3.5-4 horas focadas (Meta já vem pronta; Chatwoot instalado aqui)
```
