-- ============================================================================
-- BOOTSTRAP 3 · FASE 1 · Migration 002 — pessoas (o HUB de identidade)
--
-- UMA linha por ser humano. Identidade = email (UNIQUE, sempre normalizado
-- com trim + lowercase ANTES de inserir). Lead -> comprador -> aluno e a
-- MESMA linha mudando status_geral — nunca tabelas separadas.
--
-- Derivada do banco real da Arka (46k pessoas), sem os campos que la
-- morreram (manychat_id, data_nascimento, tipo_pessoa, endereco completo).
-- Idempotente: pode rodar mais de uma vez sem erro.
-- ============================================================================

create table if not exists public.pessoas (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  -- identidade (email e A chave universal do ecossistema)
  email         text not null unique,
  nome          text,
  nome_primeiro text,

  -- contato (telefone SEMPRE normalizado: so digitos, com DDI 55)
  telefone      text,
  instagram     text,
  cpf           text,

  -- localizacao (vem do checkout; o resto do endereco nao se mostrou util)
  cidade        text,
  estado        text,
  cep           text,

  -- estagio no funil: lead -> comprador -> aluno_ativo
  status_geral  text not null default 'lead',
  tags          text[] not null default '{}'
);

-- indexes (no banco da Arka, a falta deles em telefone/status doeu em queries)
create index if not exists idx_pessoas_status   on public.pessoas (status_geral);
create index if not exists idx_pessoas_telefone on public.pessoas (telefone);

-- trigger de updated_at
drop trigger if exists pessoas_updated_at on public.pessoas;
create trigger pessoas_updated_at
  before update on public.pessoas
  for each row execute function public.update_updated_at();

-- RLS: service-role only. Frontend NUNCA acessa direto (anon nao tem policy
-- permissiva — logo, nao le nem escreve). service_role bypassa RLS por design.
alter table public.pessoas enable row level security;

comment on table public.pessoas is
  'Bootstrap 3 core: HUB de identidade. 1 linha por pessoa, email UNIQUE = chave universal. Upsert sempre por onConflict: email.';
comment on column public.pessoas.email is
  'Normalizar SEMPRE antes de inserir: trim + lowercase. E a identidade do ecossistema.';
comment on column public.pessoas.telefone is
  'Normalizar SEMPRE: so digitos com DDI 55 (ex: 5511999999999). Formato misto quebrou lookups no banco da Arka.';
comment on column public.pessoas.status_geral is
  'Estagio: lead | comprador | aluno_ativo. A pessoa e UMA — o estagio e que muda.';
