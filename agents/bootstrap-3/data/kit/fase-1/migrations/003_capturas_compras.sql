-- ============================================================================
-- BOOTSTRAP 3 · FASE 1 · Migration 003 — capturas + compras (os logs de FATO)
--
-- capturas = diario de leads (cada form/LP preenchido = 1 linha -> pessoa)
-- compras  = livro-caixa   (cada pagamento = 1 linha -> pessoa)
--
-- AMBAS APPEND-ONLY: fato nao se edita. Cancelamento/reembolso = linha NOVA
-- com status proprio. Historico e auditoria.
--
-- Derivada do banco real da Arka, ja corrigindo o que la doeu:
--  · indexes em pessoa_id / created_at / evento_referencia (la faltam ate hoje)
--  · plataforma NOT NULL (la, 93% das compras ficaram sem — bug de workflow)
--  · id_transacao UNIQUE (dedup garantido por constraint, nao so por busca)
--  · sem colunas mortas (produto_id, criativo_id, campanha_id)
-- Idempotente: pode rodar mais de uma vez sem erro.
-- ============================================================================

-- ───────────────────────────── CAPTURAS ─────────────────────────────────────

create table if not exists public.capturas (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  pessoa_id          uuid not null references public.pessoas (id) on delete cascade,

  -- de onde veio
  tipo_captura       text,            -- ex: 'lp_captura', 'checkout_prepopulado', 'form_diagnostico'
  evento_referencia  text,            -- identificador da campanha (padrao: '{tipo_pagina} | {SLUG_CAMPANHA}')
  pagina_origem      text,            -- URL completa de origem

  -- atribuicao
  utm_source         text,
  utm_medium         text,
  utm_campaign       text,
  utm_content        text
);

create index if not exists idx_capturas_pessoa  on public.capturas (pessoa_id);
create index if not exists idx_capturas_evento  on public.capturas (evento_referencia);
create index if not exists idx_capturas_created on public.capturas (created_at);

alter table public.capturas enable row level security;

comment on table public.capturas is
  'Bootstrap 3 core: log APPEND-ONLY de captura de leads. Mesma pessoa pode ter N capturas (N campanhas).';
comment on column public.capturas.evento_referencia is
  'Identificador da campanha. Padrao Arka: "{tipo_pagina} | {SLUG}" — permite extrair o slug com split.';

-- ───────────────────────────── COMPRAS ──────────────────────────────────────

create table if not exists public.compras (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  pessoa_id        uuid not null references public.pessoas (id) on delete cascade,

  -- o que foi comprado (produto_nome e a fonte de verdade — sem tabela de catalogo)
  produto_nome     text not null,
  produto_tipo     text,              -- ex: 'workshop', 'mentoria', 'gravacao'
  valor            numeric,
  forma_pagamento  text,              -- 'pix', 'cartao', 'boleto'...

  -- de onde veio o pagamento
  plataforma       text not null,     -- 'hotmart', 'tmb', 'asaas', 'stripe'... (NOT NULL: licao da Arka)
  status           text not null,     -- status normalizado: 'aprovada', 'cancelada', 'reembolsada'
  id_transacao     text unique,       -- ID externo da plataforma — UNIQUE = dedup por constraint
  id_oferta        text,

  -- atribuicao
  utm_source       text,
  utm_medium       text,
  utm_campaign     text,
  utm_content      text,
  src              text,              -- source customizado (sck bruto / origem de automacao)
  pagina_origem    text,
  is_order_bump    boolean not null default false
);

create index if not exists idx_compras_pessoa  on public.compras (pessoa_id);
create index if not exists idx_compras_created on public.compras (created_at);

alter table public.compras enable row level security;

comment on table public.compras is
  'Bootstrap 3 core: ledger APPEND-ONLY de pagamentos. Cancelamento = linha NOVA com status proprio, nunca UPDATE.';
comment on column public.compras.status is
  'Normalizar no parse do workflow: aprovada | cancelada | reembolsada (nao copiar o status cru de cada plataforma).';
comment on column public.compras.id_transacao is
  'ID externo da plataforma. UNIQUE garante que retry de webhook NUNCA duplica compra.';
