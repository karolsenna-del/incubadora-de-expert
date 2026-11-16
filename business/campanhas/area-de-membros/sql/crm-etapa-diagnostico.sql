-- Coluna "Diagnóstico" no painel comercial (Karol, 15/11/2026).
-- Antes: quem respondia o pré-diagnóstico caía direto em "Sessão", misturando quem fez a sessão com quem
-- preencheu e sumiu. Agora: pré-diagnóstico -> "diagnostico"; "sessao" = fez a sessão (prova: gravação ou
-- anotação da Karol). A dinâmica "Crie seu método em 1 hora" (origem webinar_metodo_1h) não é pré-diagnóstico.
-- Cópia de segurança das 83 fichas de Sessão antes da mudança: fora do git (dado pessoal).

-- 1) Etapa nova
alter table public.crm_leads drop constraint crm_leads_etapa_check;
alter table public.crm_leads add constraint crm_leads_etapa_check check (etapa = any (array[
  'novo','abordado','respondeu','diagnostico','sessao','proposta','aluno','perdido','descartado']));

-- 2) Pré-diagnóstico respondido leva a "diagnostico" (não mais a "sessao"); a dinâmica não conta.
create or replace function public.crm_auto_diagnostico()
 returns trigger language plpgsql as $function$
begin
  if new.diagnostico_em is not null and (tg_op = 'INSERT' or old.diagnostico_em is null)
     and coalesce(new.etapa, 'novo') in ('novo', 'abordado', 'respondeu')
     and new.origem is distinct from 'webinar_metodo_1h' then
    new.etapa := 'diagnostico'; new.etapa_fonte := 'diagnostico'; new.etapa_em := new.diagnostico_em;
  end if;
  return new;
end $function$;

-- 3) Reclassificação das 83 fichas que estavam em Sessão (conferida com a Karol em 15/11/2026).
--    Gatilhos desligados só nesta transação, para manter as datas e corrigir o histórico à mão.
begin;
set local session_replication_role = replica;

create temp table _fez on commit drop as  -- fez a sessão: gravação/nome da gravação na ficha, ou achada no Drive
select id from crm_leads where etapa = 'sessao' and (
     (link_sessao is not null and link_sessao not ilike 'Não teve%')
  or nome ilike any (array['Laís Daltrozo%','Izack Ribeiro%','Bruna Camargo%','Juliana Pasqual%','Ronaldo Peixoto%',
                           'Bianca Moscarelli%','Dianessa Tiago Martins%','Rodrigo Arino%','Hilda Carla%'])
  or lower(email) = 'lucianadavantelarq@gmail.com');

create temp table _aluno on commit drop as  -- viraram clientes (Karen: VIP; Rômulo: consultoria)
select id from crm_leads where etapa = 'sessao' and (nome ilike 'Karen Altafini%' or nome ilike 'Rômulo Toledo%');

create temp table _dinamica on commit drop as  -- só fizeram a dinâmica; sessão oferecida e não aceita
select id from crm_leads where etapa = 'sessao' and origem = 'webinar_metodo_1h'
  and id not in (select id from _fez) and id not in (select id from _aluno);

-- gravações achadas no Drive viram o link da ficha
update crm_leads l set link_sessao = 'https://drive.google.com/file/d/' || v.arq || '/view'
from (values ('Laís Daltrozo%','1h6TDl38eXxETAlqLf5Qclcf3e9SkQZYi'), ('Izack Ribeiro%','1Gaq-Z2eTCbwqAI-yLYwXV7W0JFLLGKfi'),
             ('Bruna Camargo%','1zpyh3XvUkG31HVE6ucncVOQw-imJpszQ'), ('Juliana Pasqual%','1yVBI3Jf8Y324AY3fW7Ulb5XTx6Reqnio'),
             ('Ronaldo Peixoto%','1lh0NlAmMWA3Kg_dDVmGsQocN__LJuSKU'), ('Bianca Moscarelli%','1AVsUKkbR9dSdklPddt7I9a-AOMZQg6aT'),
             ('Dianessa Tiago Martins%','1FSOelwcPtwqQnHPlQlD2dbmQu-lIDoRZ'), ('Hilda Carla%','1zk6c3A2-wzZ9eSBeZta-XwKfUknRRObY')) v(nome, arq)
where l.nome ilike v.nome and l.link_sessao is null and l.id in (select id from _fez);

update crm_etapas set etapa = 'abordado' where etapa = 'sessao' and lead_id in (select id from _dinamica);
update crm_leads set etapa = 'abordado' where id in (select id from _dinamica);

update crm_etapas set etapa = 'diagnostico' where etapa = 'sessao'
  and lead_id in (select id from crm_leads where etapa = 'sessao' and id not in (select id from _fez) and id not in (select id from _aluno));
update crm_leads set etapa = 'diagnostico', etapa_fonte = coalesce(etapa_fonte, 'diagnostico')
  where etapa = 'sessao' and id not in (select id from _fez) and id not in (select id from _aluno);

update crm_leads set etapa = 'aluno', etapa_em = now(), etapa_fonte = 'painel' where id in (select id from _aluno);
insert into crm_etapas (lead_id, etapa, em, fonte, aproximada) select id, 'aluno', now(), 'painel', true from _aluno;

commit;
