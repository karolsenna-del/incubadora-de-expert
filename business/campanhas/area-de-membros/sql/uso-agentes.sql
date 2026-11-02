-- Expert-IAs: contagem de uso por aluno, agente e dia (decisão da Karol, 01/11/2026)
-- Mês de medição (01/11 a 01/12): só teto folgado de segurança contra abuso/conta emprestada.
-- Mentoria (grupo, individual, incubadora-express) tem o dobro do teto do curso.
-- Dia vira à meia-noite de Brasília.

create table if not exists public.uso_agentes (
  email      text not null,
  agente_id  text not null,
  dia        date not null,
  plano      text not null,             -- 'curso' ou 'mentoria' no momento do uso
  mensagens  integer not null default 0,
  bloqueios  integer not null default 0, -- tentativas recusadas por bater o teto
  atualizado_em timestamptz not null default now(),
  primary key (email, agente_id, dia)
);

alter table public.uso_agentes enable row level security;
-- Sem policy: aluno não lê nem grava direto. Só a função abaixo mexe na tabela.

create or replace function public.registrar_uso_agente(p_agente text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email    text := lower(auth.jwt() ->> 'email');
  v_dia      date := (now() at time zone 'America/Sao_Paulo')::date;
  v_mentoria boolean;
  v_plano    text;
  v_limite   integer;
  v_usadas   integer;
begin
  if v_email is null then
    return json_build_object('permitido', false, 'motivo', 'sem_sessao');
  end if;

  select exists (
    select 1 from matriculas
    where lower(email) = v_email
      and produto_slug in ('grupo', 'individual', 'incubadora-express')
      and ativo
      and (expira_em is null or expira_em > now())
  ) into v_mentoria;

  v_plano  := case when v_mentoria then 'mentoria' else 'curso' end;
  v_limite := case when v_mentoria then 160 else 80 end; -- teto de segurança do mês de medição

  insert into uso_agentes (email, agente_id, dia, plano)
  values (v_email, p_agente, v_dia, v_plano)
  on conflict (email, agente_id, dia) do nothing;

  select mensagens into v_usadas from uso_agentes
  where email = v_email and agente_id = p_agente and dia = v_dia
  for update;

  if v_usadas >= v_limite then
    update uso_agentes set bloqueios = bloqueios + 1, atualizado_em = now()
    where email = v_email and agente_id = p_agente and dia = v_dia;
    return json_build_object('permitido', false, 'usadas', v_usadas, 'limite', v_limite, 'plano', v_plano);
  end if;

  update uso_agentes set mensagens = mensagens + 1, plano = v_plano, atualizado_em = now()
  where email = v_email and agente_id = p_agente and dia = v_dia;

  return json_build_object('permitido', true, 'usadas', v_usadas + 1, 'limite', v_limite, 'plano', v_plano);
end;
$$;

revoke all on function public.registrar_uso_agente(text) from public, anon;
grant execute on function public.registrar_uso_agente(text) to authenticated;
