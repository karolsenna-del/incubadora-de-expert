-- ============================================================================
-- CRM Reativação de Leads · Migration 002 — adiciona coluna `nome`
--
-- Gap encontrado durante o import: nome ficou só dentro de
-- respostas_diagnostico (jsonb), sem coluna propria. O closer precisa ver o
-- nome de cara na planilha, nao garimpar dentro do jsonb.
-- Idempotente: pode rodar mais de uma vez sem erro.
-- ============================================================================

alter table public.crm_leads
  add column if not exists nome text;

comment on column public.crm_leads.nome is
  'Nome do lead. Populado no import a partir de respostas_diagnostico->>''nome'' quando existente.';

-- Backfill pros 85 leads ja importados
update public.crm_leads
set nome = respostas_diagnostico ->> 'nome'
where nome is null
  and respostas_diagnostico ->> 'nome' is not null;

create index if not exists idx_crm_leads_nome on public.crm_leads (nome);
