-- Painel Comercial (21/11/2026): leads quentes do WhatsApp na fila "Abordar".
--   1. Quem se inscreve na página do grupo das lives (leads_live_expert360) vira lead no painel sozinho
--      (origem grupo_lives, "lead desde" = dia da inscrição). Se a pessoa já tem ficha (e-mail ou celular), não duplica.
--   2. crm_preparar_quentes_whatsapp(): escreve a 1ª mensagem de WhatsApp (garimpo.Copy, Canal = WhatsApp) dos leads
--      Novos sem mensagem que têm nome e celular: grupo das lives, compradores do workshop e lista da Black.
--      Sem nome ou sem contexto (números soltos do grupo antigo e do WhatsApp) fica de fora: não dá pra personalizar.
--      Método: Vendedor Expert §6 (abertura por origem), sem oferta, sem link na 1ª mensagem, gênero neutro.

create or replace function public.crm_fone_br(t text) returns text language sql immutable as $$
  select case when d ~ '^55\d{10,11}$' then d when d ~ '^\d{10,11}$' then '55' || d else nullif(d, '') end
  from (select regexp_replace(coalesce(t, ''), '\D', '', 'g') d) x
$$;

create or replace function public.crm_lead_da_live() returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_email text := lower(nullif(trim(new.email), ''));
  v_tel text := crm_fone_br(new.whatsapp);
begin
  if v_email = 'karolsenna@incubadoradeexpert.com.br' then return null; end if;
  if exists (select 1 from crm_leads c where (v_email is not null and lower(c.email) = v_email)
             or (length(v_tel) >= 8 and right(regexp_replace(coalesce(c.telefone, ''), '\D', '', 'g'), 8) = right(v_tel, 8))) then
    return null;
  end if;
  insert into crm_leads (nome, email, telefone, origem, origem_detalhe, etapa, lead_desde)
  values (nullif(trim(new.nome), ''), v_email, v_tel, 'grupo_lives',
          'Entrou no grupo das lives pela página em ' || to_char(new.created_at at time zone 'America/Sao_Paulo', 'DD/MM/YYYY'),
          'novo', new.created_at);
  return null;
exception when others then
  raise warning 'crm_lead_da_live: %', sqlerrm;  -- nunca derruba a inscrição
  return null;
end $$;

drop trigger if exists crm_lead_da_live on public.leads_live_expert360;
create trigger crm_lead_da_live after insert on public.leads_live_expert360
  for each row execute function public.crm_lead_da_live();

-- Quem já estava inscrito antes do gatilho (uma vez; roda de novo sem duplicar)
do $$
declare r record;
begin
  for r in select distinct on (right(regexp_replace(coalesce(whatsapp, ''), '\D', '', 'g'), 8)) *
             from leads_live_expert360 order by right(regexp_replace(coalesce(whatsapp, ''), '\D', '', 'g'), 8), created_at
  loop
    declare
      v_email text := lower(nullif(trim(r.email), ''));
      v_tel text := crm_fone_br(r.whatsapp);
    begin
      if v_email = 'karolsenna@incubadoradeexpert.com.br' then continue; end if;
      if exists (select 1 from crm_leads c where (v_email is not null and lower(c.email) = v_email)
                 or (length(v_tel) >= 8 and right(regexp_replace(coalesce(c.telefone, ''), '\D', '', 'g'), 8) = right(v_tel, 8))) then
        continue;
      end if;
      insert into crm_leads (nome, email, telefone, origem, origem_detalhe, etapa, lead_desde, created_at)
      values (nullif(trim(r.nome), ''), v_email, v_tel, 'grupo_lives',
              'Entrou no grupo das lives pela página em ' || to_char(r.created_at at time zone 'America/Sao_Paulo', 'DD/MM/YYYY'),
              'novo', r.created_at, r.created_at);
    end;
  end loop;
end $$;

create or replace function public.crm_preparar_quentes_whatsapp() returns int language plpgsql security definer set search_path = public as $$
declare
  meses text[] := array['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  n int;
begin
  with base as (
    select l.id, l.origem, l.garimpo,
           initcap(split_part(trim(l.nome), ' ', 1)) primeiro,
           (select min(x.created_at) from leads_live_expert360 x
             where (l.email is not null and lower(x.email) = lower(l.email))
                or right(regexp_replace(coalesce(x.whatsapp, ''), '\D', '', 'g'), 8) = right(regexp_replace(coalesce(l.telefone, ''), '\D', '', 'g'), 8)) live_em
    from crm_leads l
    where l.etapa = 'novo' and coalesce(l.garimpo ->> 'Copy', '') = ''
      and length(trim(coalesce(l.nome, ''))) >= 2 and length(regexp_replace(coalesce(l.telefone, ''), '\D', '', 'g')) >= 10
  ), msg as (
    select id, garimpo,
      case
        when live_em is not null then jsonb_build_object(
          'Grupo', 'Grupo das lives', 'Calor', 0, 'Prioridade de abordagem', 'Alta',
          'Fato-gancho', 'Entrou no grupo das lives em ' || to_char(live_em at time zone 'America/Sao_Paulo', 'DD/MM'),
          'Copy', 'Olá ' || primeiro || ', tudo bem? Aqui é a Karol Senna.' || E'\n\n' ||
                  'Vi que você entrou no grupo das minhas lives de quarta em ' || meses[extract(month from live_em at time zone 'America/Sao_Paulo')::int] || '. Que bom te ter por lá!' || E'\n\n' ||
                  'Me conta: o que você faz hoje e o que gostaria de transformar em curso ou mentoria?')
        when origem = 'comprador_outro_produto' then jsonb_build_object(
          'Grupo', 'Comprou o workshop', 'Calor', 1, 'Prioridade de abordagem', 'Média',
          'Fato-gancho', 'Comprou o workshop Destrave seu Curso Online (2025). Já recebeu o "conseguiu criar seu curso?" em maio e o convite da Black.',
          'Copy', 'Olá ' || primeiro || ', tudo bem? Aqui é a Karol Senna.' || E'\n\n' ||
                  'Você fez o meu workshop Destrave seu Curso Online e eu lembrei de você.' || E'\n\n' ||
                  'Hoje eu faço uma live toda quarta, às 15h, sobre como transformar o que você sabe em curso ou mentoria. Quer que eu te mande o convite do grupo?')
        when origem = 'black_expert_manual' then jsonb_build_object(
          'Grupo', 'Lista da Black', 'Calor', 1, 'Prioridade de abordagem', 'Média',
          'Fato-gancho', 'Você colocou na lista da Black Expert (set/2026). Recebeu o convite do grupo da Black e não respondeu.',
          'Copy', 'Olá ' || primeiro || ', tudo bem? Aqui é a Karol Senna.' || E'\n\n' ||
                  'Toda quarta, às 15h, eu faço uma live gratuita sobre como transformar o que você sabe em curso ou mentoria, e lembrei de você.' || E'\n\n' ||
                  'Quer que eu te mande o convite do grupo?')
      end extra
    from base
  )
  update crm_leads c set garimpo = coalesce(m.garimpo, '{}'::jsonb) || m.extra || '{"Canal": "WhatsApp"}'::jsonb
    from msg m where c.id = m.id and m.extra is not null;
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.crm_preparar_quentes_whatsapp() from public, anon, authenticated;
