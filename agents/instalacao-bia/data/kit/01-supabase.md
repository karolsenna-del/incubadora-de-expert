# Passo 1 — Supabase (migrations + tabelas + RPCs + dados iniciais)

> Tempo estimado: 30 minutos
> O que entrega: 23 tabelas Bia criadas no seu Supabase, `workshop_config` populado com seu evento, `bia_campaign_data` com texto L4 base pronto pra customizar.

---

## Pré-requisito

- Conta Supabase criada (qualquer plano, free funciona até ~500 MB)
- Service role key em mãos (Settings > API > service_role)
- Supabase CLI instalado (opcional mas recomendado): `brew install supabase/tap/supabase`

---

## 1.1 — Variáveis pra ter em mãos

```bash
# Cole no terminal e adapte
export SUPA_URL="https://SEU_PROJETO.supabase.co"
export SUPA_KEY="eyJhbG..."  # service_role key (NÃO a anon)

# Verificar que funciona
curl -s "$SUPA_URL/rest/v1/" -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | head -c 200
# Deve retornar JSON com "swagger" no início
```

---

## 1.2 — Aplicar migrations (ordem obrigatória)

> Todas as 19 migrations da Bia estão consolidadas em `kit-aluno/migrations/` — pasta única, ordem por nome do arquivo (timestamp). Detalhes de cada uma em [`./migrations/README.md`](./migrations/README.md).

### Opção A — Supabase CLI (recomendado)

```bash
# 1. Linkar seu projeto local com o Supabase remoto
cd /caminho/pro/seu/repo
supabase link --project-ref SEU_PROJECT_REF

# 2. Copiar as migrations pra pasta padrão do Supabase
cp migrations/*.sql supabase/migrations/

# 3. Aplicar tudo
supabase db push --linked --include-all
```

### Opção B — Manual via SQL Editor

Vai em **SQL Editor** no painel do Supabase e roda cada uma em ordem numérica crescente. Ver `kit-aluno/migrations/README.md` pra lista completa.

### Validar que tudo subiu

```bash
# Listar tabelas Bia
curl -s "$SUPA_URL/rest/v1/" -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | \
  jq -r '.definitions | keys[]' | grep -E '^(bia_|recovery_|workshop_|tally_)' | sort

# Deve listar pelo menos:
# bia_agent_context, bia_campaign_data, bia_conversations, bia_flags, bia_handoffs,
# bia_journeys, bia_message_buffer, bia_messages, bia_moments, bia_purchases,
# bia_scores, bia_whatsapp_contacts
# blacklist_api, recovery_contacts
# workshop_config
# tally_forms, tally_submissions
```

Se faltou alguma, rode a migration manualmente.

---

## 1.3 — Popular `workshop_config` (OPCIONAL — só se tem evento)

> **Workshop_config existe pra quem tem evento/workshop com data específica.** Se você é consultoria, SaaS, infoproduto sem data, mentoria contínua etc — **pode pular esta seção.** A tabela continua criada (pelas migrations), só fica vazia.
>
> Se você usa, a Bia substitui placeholders `{{data_full_text}}`, `{{duracao}}`, etc no L4 em runtime. Isso evita ter que reescrever prompt cada vez que muda data.

Se for usar: 1 linha com `status='active'` deve existir antes da Bia ir pra produção (senão a substituição falha e a Bia fala `{{data_full_text}}` literal).

```bash
# Adapte com os dados do seu evento
SLUG="meu-workshop-2026-07"
EVENT_DATE_START="2026-07-15"
EVENT_DATE_END="2026-07-16"
EVENT_TIME_START="10h"
EVENT_TIME_END="19h"
DURACAO="2 dias"
END_SIGNUP_AT="2026-07-14T23:00:00Z"  # último momento que aceita inscrição

# Strings derivadas — escreva exatamente como vai aparecer pro lead
DATA_FULL_TEXT="Quarta e Quinta, 15 e 16 de julho de 2026, das 10h às 19h"
DATA_SHORT_TEXT="15 e 16/07"
DATA_EVENT_RANGE="15-16/07/2026"
DATA_TEMPLATE_VAR="quarta e quinta, 15 e 16 de julho, das 10h às 19h"  # sem ano, vai no template
END_SIGNUP_TEXT="terça 14/07/2026"

# INSERT
curl -s -X POST "$SUPA_URL/rest/v1/workshop_config" \
  -H "apikey: $SUPA_KEY" \
  -H "Authorization: Bearer $SUPA_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "$(cat <<JSON
{
  "slug": "$SLUG",
  "status": "active",
  "event_date_start": "$EVENT_DATE_START",
  "event_date_end": "$EVENT_DATE_END",
  "event_time_start": "$EVENT_TIME_START",
  "event_time_end": "$EVENT_TIME_END",
  "duracao": "$DURACAO",
  "end_signup_at": "$END_SIGNUP_AT",
  "data_full_text": "$DATA_FULL_TEXT",
  "data_short_text": "$DATA_SHORT_TEXT",
  "data_event_range": "$DATA_EVENT_RANGE",
  "data_template_var": "$DATA_TEMPLATE_VAR",
  "end_signup_text": "$END_SIGNUP_TEXT"
}
JSON
)"
```

> **Atenção:** existe um UNIQUE INDEX `workshop_config_one_active ON (status) WHERE status='active'`. Você não consegue ter 2 ativos ao mesmo tempo. Pra trocar de ciclo, primeiro arquive o atual (`status='archived'`), depois insira o novo.

### Validar

```bash
curl -s "$SUPA_URL/rest/v1/workshop_config?status=eq.active&select=*" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | jq
```

Deve retornar array com 1 elemento, com os dados que você acabou de inserir.

---

## 1.4 — Popular `bia_campaign_data` (texto L4 — campanha)

Esta tabela tem 1 linha por `agent_id` com o texto da camada L4 (campanha). É o que muda quando você troca de produto, valores, posicionamento.

> **IMPORTANTE:** este texto vai usar placeholders `{{data_full_text}}`, `{{duracao}}`, `{{end_signup_text}}`, etc — que são substituídos em runtime pelo Context Manager do WF-AGENT-CORE-CLOUD lendo do `workshop_config`. Você NÃO escreve a data direto aqui. Escreve o placeholder.

Por enquanto vamos popular com texto MÍNIMO genérico — você vai customizar de verdade no Passo 5 (Prompts), usando `prompts-template/L4-campanha.tmpl.md`. Mas pra rodar o smoke test no final, basta este esqueleto:

```bash
curl -s -X POST "$SUPA_URL/rest/v1/bia_campaign_data" \
  -H "apikey: $SUPA_KEY" \
  -H "Authorization: Bearer $SUPA_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "bia",
    "campaign_text": "PRODUTO: {{NOME_PRODUTO}}\nFORMATO: {{duracao}} (ao vivo, online)\nDATA: {{data_full_text}}\nPRECOS: NAO HARDCODED. {{NOME_AGENTE}} usa link com desconto direto, nao revela preco salvo se perguntado.\nLINK_DESCONTO: {{LINK_DESCONTO}}\nPAGAMENTO: {{FORMAS_PAGAMENTO}}\nGARANTIA: {{POLITICA_GARANTIA}}\nPROMESSA: {{PROMESSA_PRODUTO}}\nMECANISMO: {{MECANISMO_PRODUTO}}\nPARA_QUEM: {{PUBLICO_ALVO_RESUMO}}\nCONTEUDO:\n- {{TOPICO_1}}\n- {{TOPICO_2}}\n- {{TOPICO_3}}\nOBJECOES_ESPECIFICAS:\n- \"Nao tenho tempo\" -> {{RESPOSTA_TEMPO}}\n- \"Ta caro\" -> {{RESPOSTA_PRECO}}\nPROVA_SOCIAL:\n- {{PROVA_1}}\n- {{PROVA_2}}\nVALORES_EXPERT:\n- {{VALOR_1}}\n- {{VALOR_2}}"
  }'
```

Você vai REESCREVER esse `campaign_text` no Passo 5 com o conteúdo real.

---

## 1.5 — Popular `blacklist_api` (opcional, mas recomendado)

Se você já tem opt-outs declarados (alguém que reclamou de receber mensagem, LGPD, etc):

```bash
curl -s -X POST "$SUPA_URL/rest/v1/blacklist_api" \
  -H "apikey: $SUPA_KEY" \
  -H "Authorization: Bearer $SUPA_KEY" \
  -H "Content-Type: application/json" \
  -d '{"phone": "5511999999999", "reason": "opt-out manual"}'
```

Se não tem ninguém ainda, deixa vazia. O sistema vai inserir automaticamente quando lead mandar "Sair" (configurado no WF-INBOUND-CLOUD).

---

## 1.6 — Verificar RPCs

As migrations criam estas RPCs (procedimentos armazenados Postgres). Verifique que estão funcionando:

```bash
# Listar RPCs disponíveis
curl -s "$SUPA_URL/rest/v1/" -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | \
  jq -r '.paths | keys[]' | grep -i rpc

# Testar get_campaign_data (agent_id=bia que acabamos de inserir)
curl -s -X POST "$SUPA_URL/rest/v1/rpc/get_campaign_data" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" \
  -H "Content-Type: application/json" \
  -d '{"p_agent_id": "bia"}'
# Deve retornar o campaign_text que acabamos de inserir
```

Se alguma RPC tá faltando, rode a migration `20260313000004_add_agent_context_rpc.sql` novamente.

---

## 1.7 — Checklist final do passo

- [ ] ~20 tabelas Bia criadas (validar com query do 1.2)
- [ ] `workshop_config` tem 1 linha com `status='active'` — OU pode ficar vazia (só se tem evento)
- [ ] `bia_campaign_data` tem 1 linha com `agent_id='bia'`
- [ ] `blacklist_api` existe (mesmo que vazia)
- [ ] RPC `get_campaign_data` retorna o `campaign_text` corretamente
- [ ] Anotou no seu cofre: SUPA_URL, SUPA_KEY (service_role), SUPA_ANON_KEY

---

**Próximo passo:** [`02-meta-cloud.md`](./02-meta-cloud.md) — configurar Meta WhatsApp Cloud API.
