-- ============================================================================
-- CRM Reativação de Leads · Migration 001 — crm_leads + crm_followups
--
-- Camada SISTEMA (nao Camada CORE). Pendurada no hub via pessoa_id, nunca
-- escreve identidade no core. Se este projeto for desativado, pessoas/
-- capturas/compras continuam intactas.
--
-- pessoa_id e NULLABLE por design: leads do grupo do WhatsApp chegam so com
-- telefone (sem email), e pessoas.email e obrigatorio/unico no hub. O lead
-- nasce aqui com telefone/email crus e e promovido pra pessoas quando a
-- identidade completa aparece (o closer descobre o email na conversa, ou o
-- import por email da um match direto).
--
-- Fontes de origem (texto livre, documentado aqui — sem enum rigido, mesmo
-- padrao de compras.status/plataforma):
--   sessao_estrategica   -> diagnostico 1:1 (Pré-diagnóstico do Seu Perfil de Expert, Forms)
--   comprador_outro_produto -> comprou produto (ex: Destrave seu curso online, Hotmart) mas nunca a mentoria
--   grupo_whatsapp       -> participante do grupo fechado das lives, so numero
--   webinar_metodo_1h    -> lead da palestra "Seu Método em 1 Hora"
--
-- Idempotente: pode rodar mais de uma vez sem erro.
-- ============================================================================

-- ───────────────────────────── CRM_LEADS ────────────────────────────────────

create table if not exists public.crm_leads (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),

  -- identidade (promovida pra pessoas quando completa)
  pessoa_id              uuid references public.pessoas (id) on delete set null,
  email                  text,            -- cru, antes/sem match confirmado com pessoas
  telefone               text,            -- normalizado: so digitos, DDI 55
  instagram              text,

  -- origem da reativacao
  origem                 text not null,   -- ver legenda no cabecalho do arquivo
  origem_detalhe         text,            -- ex: nome do produto comprado

  -- sinais de qualificacao (extraidos do diagnostico, quando existe)
  diagnostico_em         timestamptz,     -- data que respondeu o formulario — quao frio o lead esta
  faturamento_mensal     text,            -- categorico, ex: "Até R$2000" — sinal de fit de ticket
  urgencia               smallint,        -- escala 1-10 do proprio form
  o_que_ja_tentou        text,            -- pedido explicito: evita repetir objecao ja descartada
  nicho                  text,            -- derivado por IA (nao existe pergunta literal no form)
  maturidade             text,            -- derivado por IA (perfil definido? promessa? provas? tempo de expertise?)
  link_sessao            text,            -- gravacao/agendamento — closer abre com 1 clique
  resumo_ia              text,            -- resumo gerado a partir do diagnostico, o closer le primeiro
  respostas_diagnostico  jsonb not null default '{}'::jsonb,  -- linha crua da planilha, sem filtro

  -- trabalho do closer (so ele edita depois da criacao do lead)
  status                 text not null default 'a_reativar'  -- a_reativar | em_conversa | follow_up_marcado | fechou | desistiu
    check (status in ('a_reativar', 'em_conversa', 'follow_up_marcado', 'fechou', 'desistiu')),

  constraint crm_leads_urgencia_range check (urgencia is null or (urgencia between 1 and 10))
);

create index if not exists idx_crm_leads_pessoa   on public.crm_leads (pessoa_id);
create index if not exists idx_crm_leads_email    on public.crm_leads (email);
create index if not exists idx_crm_leads_telefone on public.crm_leads (telefone);
create index if not exists idx_crm_leads_status   on public.crm_leads (status);
create index if not exists idx_crm_leads_origem   on public.crm_leads (origem);

drop trigger if exists crm_leads_updated_at on public.crm_leads;
create trigger crm_leads_updated_at
  before update on public.crm_leads
  for each row execute function public.update_updated_at();

alter table public.crm_leads enable row level security;

comment on table public.crm_leads is
  'CRM Reativação: 1 linha por lead no funil de reativação do comercial. Camada SISTEMA — pendurada no hub (pessoas) via pessoa_id, nunca dona da identidade.';
comment on column public.crm_leads.pessoa_id is
  'Nullable: lead pode nascer so com telefone (grupo WhatsApp). Promover pra pessoas quando identidade (email) for confirmada.';
comment on column public.crm_leads.status is
  'Editado pelo closer via planilha operacional. Robo (import/sync) nao sobrescreve depois da criacao.';
comment on column public.crm_leads.respostas_diagnostico is
  'Linha crua da planilha de respostas do Forms (ou fonte equivalente), sem filtro — nada se perde mesmo se o formulario mudar.';

-- ───────────────────────────── CRM_FOLLOWUPS ────────────────────────────────
-- Append-only, mesma doutrina de capturas/compras: fato nao se edita, cada
-- contato e uma linha nova. Inclui backfill do historico que ja existia na
-- coluna "Observações" da planilha antes deste projeto existir.

create table if not exists public.crm_followups (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  lead_id             uuid not null references public.crm_leads (id) on delete cascade,

  autor               text not null,     -- nome do closer, ou 'Karol (histórico)' pro backfill
  observacao          text,
  proximo_contato_em  timestamptz,

  origem_registro     text not null default 'closer'  -- 'closer' | 'backfill_planilha'
    check (origem_registro in ('closer', 'backfill_planilha'))
);

create index if not exists idx_crm_followups_lead  on public.crm_followups (lead_id);
create index if not exists idx_crm_followups_proximo on public.crm_followups (proximo_contato_em);

alter table public.crm_followups enable row level security;

comment on table public.crm_followups is
  'CRM Reativação: log APPEND-ONLY de cada contato do closer com o lead. Mesma doutrina de capturas/compras: fato não se edita.';
comment on column public.crm_followups.origem_registro is
  'closer = registrado no trabalho diario. backfill_planilha = importado da coluna Observações da planilha de diagnóstico (histórico pré-projeto).';
