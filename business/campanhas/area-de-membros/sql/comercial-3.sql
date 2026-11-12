-- Painel Comercial (11/11/2026): venda paga na Voomp vira "Aluno" no CRM, para qualquer produto.
-- Motivo: só produtos com trilha geram matrícula (VIP e Sprint não), então a venda não chegava ao lead.
-- Fonte: fin_voomp_avisos (o webhook guarda todo aviso cru, desde 03/11). Liga pelo e-mail do comprador;
-- comprador que não estava no CRM entra como lead novo, origem compra_direta.

create or replace function public.crm_auto_venda_voomp() returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_email text := lower(nullif(trim(new.payload -> 'client' ->> 'email'), ''));
  v_nome  text := nullif(trim(new.payload -> 'client' ->> 'name'), '');
  v_prod  text := coalesce(nullif(new.payload -> 'product' ->> 'name', ''), nullif(new.payload -> 'product' ->> 'id', ''));
  v_quando timestamptz := now();
  n int;
begin
  if new.trigger is distinct from 'salePaid' or v_email is null then return null; end if;
  begin
    v_quando := coalesce((new.payload -> 'sale' ->> 'paid_at')::timestamptz, (new.payload -> 'sale' ->> 'approved_at')::timestamptz, now());
  exception when others then v_quando := now();
  end;
  update public.crm_leads set etapa = 'aluno', etapa_fonte = 'voomp', etapa_em = v_quando, produto = coalesce(produto, v_prod)
   where lower(email) = v_email and etapa <> 'aluno';
  get diagnostics n = row_count;
  if n = 0 and not exists (select 1 from public.crm_leads where lower(email) = v_email) then
    insert into public.crm_leads (nome, email, origem, origem_detalhe, status, etapa, etapa_fonte, etapa_em, produto)
    values (v_nome, v_email, 'compra_direta', 'Comprou na Voomp sem passar pelo CRM', 'fechou', 'aluno', 'voomp', v_quando, v_prod);
  end if;
  return null;
exception when others then
  raise warning 'crm_auto_venda_voomp: %', sqlerrm;  -- nunca derruba o registro da venda
  return null;
end $$;

drop trigger if exists fin_voomp_avisos_crm on public.fin_voomp_avisos;
create trigger fin_voomp_avisos_crm after insert on public.fin_voomp_avisos
  for each row execute function public.crm_auto_venda_voomp();

-- matrícula: mesmo cuidado de nunca derrubar a gravação
create or replace function public.crm_auto_matricula() returns trigger language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if new.email is null or new.email = '' then return null; end if;
  update public.crm_leads set etapa = 'aluno', etapa_fonte = 'matricula', etapa_em = coalesce(new.liberado_em, now()),
         produto = coalesce(produto, new.produto_slug)
   where lower(email) = lower(new.email) and coalesce(etapa, 'novo') <> 'aluno';
  get diagnostics n = row_count;
  if n = 0 and not exists (select 1 from public.crm_leads where lower(email) = lower(new.email)) then
    insert into public.crm_leads (email, origem, origem_detalhe, status, etapa, etapa_fonte, etapa_em, produto)
    values (lower(new.email), 'compra_direta', 'Comprou sem passar pelo CRM', 'fechou', 'aluno', 'matricula', coalesce(new.liberado_em, now()), new.produto_slug);
  end if;
  return null;
exception when others then
  raise warning 'crm_auto_matricula: %', sqlerrm;
  return null;
end $$;

-- o mesmo para o WhatsApp
create or replace function public.crm_auto_whatsapp() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.event_kind = 'message' and new.direction = 'entrada' and new.lead_id is not null then
    update public.crm_leads set etapa = 'respondeu', etapa_fonte = 'whatsapp', etapa_em = coalesce(new.occurred_at, now())
     where id = new.lead_id and etapa in ('novo', 'abordado');
  end if;
  return null;
exception when others then
  raise warning 'crm_auto_whatsapp: %', sqlerrm;
  return null;
end $$;

-- vendas que já chegaram por aviso (desde 03/11)
select count(*) filter (where trigger = 'salePaid') vendas_avisadas, count(*) avisos from public.fin_voomp_avisos;
