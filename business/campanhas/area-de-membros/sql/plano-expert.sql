-- Expert Plan no Painel Comercial (16/11/2026). Uma linha só (id 'atual') com o plano inteiro em JSON.
-- Só a Karol lê e grava (mesma regra das tabelas do CRM e do financeiro).
create table if not exists plano_expert (
  id text primary key default 'atual',
  dados jsonb not null,
  atualizado_em timestamptz not null default now()
);
alter table plano_expert enable row level security;
drop policy if exists "so a karol" on plano_expert;
create policy "so a karol" on plano_expert for all
  using ((auth.jwt() ->> 'email') = 'karolsenna@incubadoradeexpert.com.br')
  with check ((auth.jwt() ->> 'email') = 'karolsenna@incubadoradeexpert.com.br');
grant select, insert, update on plano_expert to authenticated;

-- Primeiro plano (montado pelas vendas reais de ago-nov/2026; a Karol ajusta no painel).
-- Taxas de Vendas Secretas: resposta 5% e fechamento 20% são as reais do CRM (out-nov/2026);
-- as outras são as de pior cenário da planilha M5.1, até ter dado real.
insert into plano_expert (id, dados) values ('atual', '{
  "inicio": "2026-12",
  "meses": 12,
  "produtos": [
    {"nome": "Método VIP", "preco": 1500, "tipo": "Ao vivo", "chaves": ["vip"], "vendas": [2,2,2,2,2,2,2,2,2,2,2,2]},
    {"nome": "Incubadora Express", "preco": 2500, "tipo": "Ao vivo", "chaves": ["express"], "vendas": [1,1,1,1,1,1,1,1,1,1,1,1]},
    {"nome": "Sprint do Método", "preco": 5000, "tipo": "Ao vivo", "chaves": ["sprint"], "vendas": [0,1,0,1,0,1,0,1,0,1,0,1]},
    {"nome": "Grupo", "preco": 7500, "tipo": "Ao vivo", "chaves": ["grupo"], "vendas": [0,0,0,0,0,0,0,0,0,0,0,0]},
    {"nome": "Individual", "preco": 15000, "tipo": "Ao vivo", "chaves": ["individual"], "vendas": [0,0,0,0,0,0,0,0,0,0,0,0]},
    {"nome": "Expert360º", "preco": 697, "tipo": "Gravado", "chaves": ["expert360", "expert 360"], "vendas": [0,0,0,0,0,0,0,0,0,0,0,0]}
  ],
  "estagio": [2,2,2,2,2,2,2,2,2,2,2,2],
  "taxas": {
    "vs": {"fecha": 0.20, "comparece": 0.80, "aceita": 0.30, "responde": 0.05},
    "lives": {"fecha": 0.25, "comparece": 0.80, "pede": 0.15, "assiste": 0.40, "entra": 0.20, "porMes": 4},
    "mini": {"fecha": 0.25, "comparece": 0.80, "agenda": 0.03, "vira": 0.30},
    "msg": {"fecha": 0.05, "conversa": 0.50},
    "vsl": {"compra": 0.005}
  },
  "capacidade": 6,
  "semanasMes": 4
}'::jsonb) on conflict (id) do nothing;
