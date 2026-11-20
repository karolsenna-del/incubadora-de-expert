-- Painel Comercial (20/11/2026): a venda paga na Voomp agora
--   1. grava o valor da venda na ficha (sale.amount) — o cartão "vendidos" somava só quem tinha valor digitado;
--   2. procura a ficha que a pessoa já tinha não só pelo e-mail, mas também pelo celular e, por último, pelo nome
--      (ficha sem e-mail cujo nome inteiro está no começo do nome do comprador, e só se houver UMA assim).
--      Caso Thalita (20/11): a compra criou ficha nova porque a ficha da prospecção (21/09) não tinha e-mail.
-- Quando liga pela 2ª ou 3ª forma, completa o e-mail e o celular da ficha antiga.

create or replace function public.crm_nome_chave(t text) returns text language sql immutable as $$
  select trim(regexp_replace(translate(lower(coalesce(t, '')), 'áàâãäéèêëíìîïóòôõöúùûüç', 'aaaaaeeeeiiiiooooouuuuc'), '[^a-z ]+', ' ', 'g'))
$$;

create or replace function public.crm_auto_venda_voomp() returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_email text := lower(nullif(trim(new.payload -> 'client' ->> 'email'), ''));
  v_nome  text := nullif(trim(new.payload -> 'client' ->> 'name'), '');
  v_tel   text := nullif(regexp_replace(coalesce(new.payload -> 'client' ->> 'cellphone', ''), '\D', '', 'g'), '');
  v_prod  text := coalesce(nullif(new.payload -> 'product' ->> 'name', ''), nullif(new.payload -> 'product' ->> 'id', ''));
  v_valor numeric;
  v_quando timestamptz := now();
  v_id uuid;
  v_chave text;
begin
  if new.trigger is distinct from 'salePaid' or v_email is null then return null; end if;
  begin
    v_quando := coalesce((new.payload -> 'sale' ->> 'paid_at')::timestamptz, (new.payload -> 'sale' ->> 'approved_at')::timestamptz, now());
  exception when others then v_quando := now();
  end;
  begin v_valor := nullif(new.payload -> 'sale' ->> 'amount', '')::numeric; exception when others then v_valor := null; end;

  -- 1) e-mail
  select id into v_id from crm_leads where lower(email) = v_email order by (etapa = 'aluno'), updated_at desc limit 1;
  -- 2) celular (últimos 8 dígitos)
  if v_id is null and length(v_tel) >= 8 then
    select id into v_id from crm_leads
     where right(regexp_replace(coalesce(telefone, ''), '\D', '', 'g'), 8) = right(v_tel, 8)
     order by updated_at desc limit 1;
  end if;
  -- 3) nome: ficha sem e-mail, nome com 2+ palavras que é o começo do nome do comprador; só se for única
  if v_id is null and v_nome is not null then
    v_chave := crm_nome_chave(v_nome);
    select (array_agg(id))[1] into v_id from (
      select id from crm_leads
       where email is null and etapa <> 'aluno'
         and crm_nome_chave(nome) like '% %'
         and (v_chave || ' ') like regexp_replace(crm_nome_chave(nome), '\s+', ' ', 'g') || ' %'
    ) c having count(*) = 1;
  end if;

  if v_id is not null then
    update crm_leads set etapa = 'aluno', etapa_fonte = 'voomp', etapa_em = v_quando,
           produto = coalesce(produto, v_prod), valor_venda = coalesce(valor_venda, v_valor),
           email = coalesce(email, v_email), telefone = coalesce(telefone, v_tel)
     where id = v_id and etapa <> 'aluno';
    if not found then
      update crm_leads set valor_venda = coalesce(valor_venda, v_valor), produto = coalesce(produto, v_prod) where id = v_id;
    end if;
  else
    insert into crm_leads (nome, email, telefone, origem, origem_detalhe, status, etapa, etapa_fonte, etapa_em, produto, valor_venda)
    values (v_nome, v_email, v_tel, 'compra_direta', 'Comprou na Voomp sem passar pelo CRM', 'fechou', 'aluno', 'voomp', v_quando, v_prod, v_valor);
  end if;
  return null;
exception when others then
  raise warning 'crm_auto_venda_voomp: %', sqlerrm;  -- nunca derruba o registro da venda
  return null;
end $$;
