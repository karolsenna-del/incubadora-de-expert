---
task: "Preparar — Passos 0.5, 1, 3, 4 do INSTALL"
responsavel: "@preparador"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "QG-IB-000 validado + abertura feita (identidade decidida, contas Anthropic/OpenAI em mãos, cofre aberto)"
Saida: "Chatwoot vivo (https + admin), tabelas bia_* no Supabase, inbox Chatwoot criado, 5 credentials no n8n testadas"
Checklist:
  - "Passo 0.5: Chatwoot self-hosted no ar — https com cadeado + login admin criado"
  - "Passo 1: 19 migrations aplicadas — tabelas bia_* existem"
  - "Passo 3: inbox API do Chatwoot criado (webhook vazio) + account/inbox IDs + token anotados"
  - "Passo 4: 5 credentials no n8n criadas e testadas (curl OK)"
execution_type: "interactive"
---

# Preparar (Passos 0.5, 1, 3, 4 do INSTALL)

**Agente:** @preparador · **Gate de saída:** QG-IB-001
**Material:** `knowledge/instalar-chatwoot.md`, `data/kit/chatwoot/`, `data/kit/INSTALL.md` (passos 0.5, 1, 3, 4), `data/kit/01-supabase.md`, `data/kit/04-credentials.md`

> Segue a ordem do INSTALL: cada passo pega o que precisa **no momento que precisa**. Não há "reunir tudo antes".

## Passo 0.5 — Subir o Chatwoot self-hosted (~20-30min)
1. Confirma os 3 pré-requisitos: rede do proxy (Traefik/EasyPanel) · DNS `chatwoot.dominio` → IP · acesso ao servidor
2. Oferece os 2 modos (eu subo via SSH / em colaboração). Gera os 3 segredos (`openssl rand`) → cofre
3. Preenche `data/kit/chatwoot/docker-compose.yml`, sobe (`db:chatwoot_prepare` na 1ª vez → `up -d`)
4. Confirma: 4 containers Up + `https://chatwoot.dominio` com cadeado + conta admin criada
> Sobe cedo (demora a inicializar) e adianta o Passo 1 enquanto sobe. **Não cria o inbox aqui** (é o Passo 3). Guia: `knowledge/instalar-chatwoot.md`.

## Passo 1 — Migrations no Supabase (~20min)
1. **Anota do painel Supabase** (Settings → API): `SUPA_URL` + `service_role key` → cofre + `SUBSTITUICOES.md`
2. Aplica as 19 migrations (CLI `supabase db push --linked --include-all`, ou SQL Editor)
3. Confirma que as tabelas `bia_*` foram criadas
> A chave do Supabase é pega e usada AQUI (não depende do n8n). Detalhe: `01-supabase.md`.

## Passo 3 — Inbox no Chatwoot (~15min)
1. Chatwoot → Settings → Inboxes → Add Inbox → tipo **API** ("WhatsApp Bia")
2. **Webhook URL: deixa vazio** (volta na fase Conectar)
3. Anota `account_id`, `inbox_id` e o **token** (Profile → Access Token) → cofre

## Passo 4 — 5 credentials no n8n (~15min)
1. Cria as 5 credentials HTTP Header Auth no n8n, usando as chaves já em mãos: **Anthropic, OpenAI, Supabase** (`apikey`), **Meta** (`Bearer`), **Chatwoot** (`api_access_token`)
2. Testa cada uma com curl antes de seguir → anota os `{{CRED_ID_*}}`

## Gate QG-IB-001 → reporta ao Chief
Chatwoot vivo (https + admin) · tabelas `bia_*` no Supabase · inbox Chatwoot criado · 5 credentials testadas.

## Error Handling
| Cenário | Ação |
|---------|------|
| Pré-requisito do Chatwoot faltando (DNS/proxy) | Não subir — registrar o que falta, devolver pro Chief (infra-base é step anterior) |
| Container do Chatwoot reiniciando | Diagnosticar pelo log: `db:chatwoot_prepare` esquecido ou senha divergente (`instalar-chatwoot.md`) |
| Aluno cola secret no chat | Mandar pro cofre, não repetir o valor |
| `supabase db push` falha | Migration remota conflitando → fix em `01-supabase.md` |
| Credential "missing" depois | Não fechar sem o curl de teste passar |
