# Migrations Supabase — Kit Aluno (Bia)

> 19 migrations que criam todas as tabelas, RPCs, triggers, índices e RLS policies que a Bia precisa.
> Ordem cronológica (nome do arquivo = ordem de execução).

---

## Como aplicar (escolha 1 das 2 opções)

### Opção A — Supabase CLI (recomendado)

```bash
cd /caminho/do/seu/repo
supabase link --project-ref SEU_PROJECT_REF

# Copia as migrations pra pasta padrão do Supabase
cp migrations/*.sql supabase/migrations/

# Aplica todas
supabase db push --linked --include-all
```

### Opção B — Manual via SQL Editor

Vai no painel Supabase > SQL Editor e cola/executa cada uma NA ORDEM abaixo (numérica crescente).

---

## Ordem de execução

```
1.  20260303000002_create_recovery_contacts.sql
2.  20260306000001_create_bia_quality_monitoring.sql
3.  20260310000001_add_recovery_sales_to_dashboard.sql
4.  20260310000002_fix_recovery_sales_bia_purchases.sql
5.  20260311000001_add_bia_upsell_attribution.sql
6.  20260311000002_fix_bia_purchases_rls_anon.sql
7.  20260311100001_add_agent_id_to_bia_monitor.sql
8.  20260313000003_add_agent_context.sql
9.  20260313000004_add_agent_context_rpc.sql
10. 20260316000004_add_launch_override_bia.sql
11. 20260318000001_create_bia_whatsapp_contacts.sql
12. 20260326000001_create_bia_campaign_data.sql
13. 20260328000002_create_bia_message_buffer.sql
14. 20260329000001_create_tally_integration.sql
15. 20260401000001_fix_recovery_converted_at.sql
16. 20260406000002_append_agent_context.sql
17. 20260511220000_create_workshop_config.sql
18. 20260604000001_create_blacklist_api.sql
19. 20260604000002_create_bia_handoffs.sql
```

---

## O que cada uma cria

### Essenciais pra Bia conversar e atender

| # | Arquivo | O que cria |
|---|---------|------------|
| 8 | `20260313000003_add_agent_context.sql` | tabela `bia_agent_context` (histórico conversacional) |
| 9 | `20260313000004_add_agent_context_rpc.sql` | RPC `get_agent_context(subscriber_id, agent_id)` |
| 11 | `20260318000001_create_bia_whatsapp_contacts.sql` | tabela `bia_whatsapp_contacts` (contatos + active_agent_id + is_human_takeover) + trigger updated_at |
| 12 | `20260326000001_create_bia_campaign_data.sql` | tabela `bia_campaign_data` (L4) + RPC `get_campaign_data` |
| 13 | `20260328000002_create_bia_message_buffer.sql` | tabela `bia_message_buffer` + RPCs `buffer_message`, `collect_buffer`, `cleanup_message_buffers` |
| 16 | `20260406000002_append_agent_context.sql` | patch — função append no histórico |
| 17 | `20260511220000_create_workshop_config.sql` | tabela `workshop_config` (config dinâmica do evento — opcional, só pra quem tem evento) |
| 18 | `20260604000001_create_blacklist_api.sql` | tabela `blacklist_api` (**opt-out** — a Bia registra aqui quem escreve "Sair"; lida pelo INBOUND e pelo AGENT-CORE) |
| 19 | `20260604000002_create_bia_handoffs.sql` | tabela `bia_handoffs` (registro de quando a Bia passa o bastão pro humano — usada pelo OUTBOUND) |

### Observabilidade (mesmo sem LOGGER/SCORECARD instalados, deixa schema pronto pro futuro)

| # | Arquivo | O que cria |
|---|---------|------------|
| 2 | `20260306000001_create_bia_quality_monitoring.sql` | `bia_journeys`, `bia_conversations`, `bia_messages`, `bia_scores`, `bia_flags`, `bia_moments` |
| 7 | `20260311100001_add_agent_id_to_bia_monitor.sql` | adiciona `agent_id` em bia_conversations |

### Recovery / Compras (kit-recovery e kit-compras-hotmart usam — mas schema fica pronto desde já)

| # | Arquivo | O que cria |
|---|---------|------------|
| 1 | `20260303000002_create_recovery_contacts.sql` | `recovery_contacts` + trigger `trg_recovery_mark_converted` |
| 3 | `20260310000001_add_recovery_sales_to_dashboard.sql` | views/colunas pra dashboard recovery |
| 4 | `20260310000002_fix_recovery_sales_bia_purchases.sql` | patch |
| 5 | `20260311000001_add_bia_upsell_attribution.sql` | tabela `bia_purchases` |
| 6 | `20260311000002_fix_bia_purchases_rls_anon.sql` | patch RLS |
| 10 | `20260316000004_add_launch_override_bia.sql` | suporte a override de lançamento |
| 15 | `20260401000001_fix_recovery_converted_at.sql` | patch |

### Outros

| # | Arquivo | O que cria |
|---|---------|------------|
| 14 | `20260329000001_create_tally_integration.sql` | `tally_forms`, `tally_submissions` (captura via Tally — opcional) |

---

## Estratégia: rodar tudo de uma vez

**Recomendado:** rode TODAS as 19 migrations mesmo que não vá usar tudo agora.

**Por quê:**
- Quando você for instalar kit-compras-hotmart ou kit-recovery depois, as tabelas já estão prontas
- As tabelas vazias custam ~0 KB de espaço
- Evita "ah, depois eu rodo essa migration" e esquecer

Custo: 30 segundos a mais no setup inicial.

---

## Pré-requisitos no Supabase

Antes de rodar:

1. Projeto Supabase criado
2. Você tem a **service_role key** (não a anon)
3. Recomendado: extensão `pgcrypto` habilitada (algumas migrations usam `gen_random_uuid()`)
   - Vai em **Database > Extensions** e ativa `pgcrypto` e `uuid-ossp` se aparecer

---

## Validação pós-migration

```bash
SUPA_URL="https://SEU.supabase.co"
SUPA_KEY="..."

# Listar tabelas Bia criadas
curl -s "$SUPA_URL/rest/v1/" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | \
  jq -r '.definitions | keys[]' | grep -E '^(bia_|blacklist_|recovery_|workshop_|tally_)' | sort

# Esperado: ~20 tabelas
```

Saída esperada:
```
bia_agent_context
bia_campaign_data
bia_conversations
bia_flags
bia_handoffs
bia_journeys
bia_message_buffer
bia_messages
bia_moments
bia_purchases
bia_scores
bia_whatsapp_contacts
blacklist_api
recovery_contacts
tally_forms
tally_submissions
workshop_config
```

(Pode ter mais — não tem menos)

---

## Próximo passo

Voltar pro [`../01-supabase.md`](../01-supabase.md) e seguir a partir do passo 1.3 (popular tabelas).
