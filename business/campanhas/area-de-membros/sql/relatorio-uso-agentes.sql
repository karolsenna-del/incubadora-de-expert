-- Relatório do mês de medição da Expert-IAs (rodar em 01/12)
select agente_id, plano,
       count(distinct email)             as alunos,
       sum(mensagens)                    as mensagens,
       round(avg(mensagens), 1)          as media_por_aluno_dia,
       percentile_cont(0.9) within group (order by mensagens) as p90_por_aluno_dia,
       max(mensagens)                    as maximo_aluno_dia,
       sum(bloqueios)                    as bloqueios
from uso_agentes
where dia between date '2026-11-01' and date '2026-11-30'
group by agente_id, plano
order by mensagens desc;
