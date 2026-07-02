-- ============================================================================
-- BOOTSTRAP 3 · FASE 1 · Migration 001 — Funcao de updated_at
-- Funcao generica usada pelos triggers de updated_at do core.
-- Idempotente: pode rodar mais de uma vez sem erro.
-- ============================================================================

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.update_updated_at() is
  'Bootstrap 3: toca updated_at = now() em BEFORE UPDATE. Usada pelo core (pessoas).';
