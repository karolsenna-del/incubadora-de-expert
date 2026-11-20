-- 18/11/2026: o botão "Anotar" do Painel Comercial grava origem_registro = 'painel_comercial', mas o check
-- só aceitava 'closer' e 'backfill_planilha' — toda anotação feita pelo painel falhava. Libera o valor.
alter table public.crm_followups drop constraint if exists crm_followups_origem_registro_check;
alter table public.crm_followups add constraint crm_followups_origem_registro_check
  check (origem_registro = any (array['closer', 'backfill_planilha', 'painel_comercial']));
