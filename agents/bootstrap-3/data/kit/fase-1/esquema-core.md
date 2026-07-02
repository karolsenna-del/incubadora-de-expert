# FASE 1 — Esquema Core do Banco Unificado

> O modelo, as decisoes e os testes da Fase 1. Conduzido pelo @operador-banco.
> Migrations em `migrations/` (rodar na ordem: 001 → 002 → 003).
> Teoria completa das 3 camadas: `knowledge/banco-unificado-logica.md`.

---

## O modelo em 1 diagrama

```
                pessoas  (HUB — 1 linha por ser humano, email UNIQUE)
                  ▲   ▲
                  │   │
            capturas  compras
        (diario de    (livro-caixa de
       leads, append)  pagamentos, append)
```

- **`pessoas`** — identidade. Lead → comprador → aluno_ativo e a MESMA linha mudando `status_geral`.
- **`capturas`** — cada formulario/LP preenchido = 1 linha apontando pra pessoa. A mesma pessoa pode ter 10 capturas.
- **`compras`** — cada pagamento = 1 linha apontando pra pessoa. Cancelamento = linha NOVA (`status: cancelada`), nunca UPDATE.

E como cresce depois: **toda tabela nova aponta pro hub** via `pessoa_id` e nunca duplica identidade (nada de coluna email propria). A Fase 2 ja demonstra: `dispatches_log`, `blacklist`, `recovery_contacts` nascem assim. No banco da Arka, 44 outras tabelas orbitam essas mesmas 3.

## Os 5 principios (cada um nasceu de dor real)

| # | Principio | De onde veio |
|---|-----------|--------------|
| 1 | **Email e a chave universal** — `trim().toLowerCase()` SEMPRE antes de inserir/buscar. Upsert por `onConflict: email` | Sem isso, a mesma pessoa vira 5 registros e nenhum dashboard fecha |
| 2 | **Telefone normalizado** — so digitos com DDI 55 (`5511999999999`) | No banco da Arka ha formato misto (`(85) 9999...` vs `5585...`) e lookups falham ate hoje |
| 3 | **Append-only nos fatos** — compra/captura nao se edita nem apaga; correcao e linha nova | Auditoria de graca; ja salvou fechamento de ciclo na Arka |
| 4 | **RLS service-role only** — anon key NAO acessa o core; frontend fala com servidor, servidor fala com banco | Anon aberta = banco publico na internet |
| 5 | **Sistemas nao escrevem no core** — automacao/app le e linka via `pessoa_id`; quem escreve identidade e o fluxo dono (upsert de pessoas) | Mantém o core estavel quando sistemas mudam/morrem |

## Decisoes herdadas (e corrigidas) do banco real da Arka

| Decisao no kit | Por que |
|---|---|
| Indexes em `pessoa_id`, `created_at`, `evento_referencia` desde o dia 1 | No banco da Arka FALTAM ate hoje — queries de dashboard fazem scan em 51k rows |
| `compras.plataforma NOT NULL` | Na Arka, 93% das compras ficaram sem plataforma (workflow nao populava). O parse do aluno ja nasce obrigado a preencher |
| `compras.id_transacao UNIQUE` | Dedup por constraint — retry de webhook NUNCA duplica, mesmo se o workflow falhar na busca |
| `compras.status` normalizado (`aprovada`/`cancelada`/`reembolsada`) | Na Arka convivem 8 formatos crus de 3 plataformas (`invoice.payment_succeeded`, `NewSale`, `Paga`...) — analise vira ginastica |
| SEM `produto_id`/`criativo_id`/`campanha_id` (FKs de catalogo) | Na Arka existem e estao mortas/orfas — `produto_nome` e a fonte de verdade na pratica |
| SEM tabela de leads separada | Lead e comprador sao a mesma pessoa em momentos diferentes — `status_geral` resolve |

## Aplicando (caminho principal: MCP do Supabase)

> Ver `knowledge/principios-operacionais.md` — **Princípio 4 (banco via MCP)**. O operador aplica
> e confirma tudo via MCP; o aluno não precisa colar SQL na mão.

**0. Projeto certo + projeto vivo (antes de tocar em qualquer migration):**
- **Isolar produção/cobaia:** confirmar o `ref` do projeto certo via `list_projects` (ou decodificando
  o JWT/secret do cofre). Itens do cofre podem ser de OUTRO projeto do aluno (produção) — nunca aplicar
  no ambiente errado. Operar via MCP (conectado à conta certa) é o caminho seguro.
- **Projeto pausado (free tier):** se o status for `INACTIVE` (pausado por inatividade), **reativar**
  (`restore_project`) e **AGUARDAR `ACTIVE_HEALTHY`** antes de aplicar qualquer migration. Aplicar
  durante `COMING_UP` causa falso-sucesso (passo 3).

**1.** Aplicar via MCP (`apply_migration`), NA ORDEM: `001_funcao_updated_at.sql` →
`002_pessoas.sql` → `003_capturas_compras.sql`.

**2.** As migrations são idempotentes (rodar 2x não dá erro).

**3. NÃO confiar no `success` — confirmar persistência (P0):** durante `COMING_UP`, o `apply_migration`
pode retornar `success=true` mas **NÃO persistir** (as tabelas somem depois). Por isso: só aplicar com o
projeto `ACTIVE_HEALTHY` E, **depois de cada migration, CONFIRMAR a persistência** via
`information_schema.tables` / `pg_proc` (execute_sql ou `list_tables`) — nunca declarar criado só porque
o retorno deu sucesso.

**4. Confirmar as 3 tabelas via MCP:** `list_tables` (ou
`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`) deve listar
`pessoas`, `capturas`, `compras` com as colunas certas — **não** pelo Table Editor visual.

**Fallback (só se o MCP não estiver disponível):** painel do Supabase → **SQL Editor** → colar e rodar
os 3 SQLs na mesma ordem, e confirmar via SQL (`information_schema`), não pelo Table Editor visual.

## Testes (o gate QG-B3-002 exige os 3)

> Caminho recomendado: **via MCP (`execute_sql`)** — não precisa expor nenhuma key nem usar curl.
> Ver `knowledge/principios-operacionais.md` — **Princípio 4 (RLS negativa via MCP)**.
> O curl REST fica como alternativa secundária (no fim da seção).

### Teste 1 — Upsert + dedup por email (via MCP `execute_sql`)

```sql
-- 1a insercao
insert into pessoas (email, nome, telefone)
values ('teste@teste.com', 'Teste Dedup', '5511999990000')
on conflict (email) do update
  set nome = excluded.nome, telefone = excluded.telefone;

-- 2a insercao — MESMO email (ja normalizado: trim+lowercase) e telefone NOVO
insert into pessoas (email, telefone)
values ('teste@teste.com', '5511888880000')
on conflict (email) do update set telefone = excluded.telefone;

-- Verificar: DEVE retornar 1 linha so, com o telefone atualizado
select id, email, telefone from pessoas where email = 'teste@teste.com';
```

✅ Passou se: **1 linha**, telefone `5511888880000`.

### Teste 2 — Fatos com FK (via MCP `execute_sql`)

```sql
-- pega o id da pessoa de teste e insere 1 captura + 1 compra apontando pra ela
insert into capturas (pessoa_id, tipo_captura, evento_referencia)
select id, 'teste', 'Teste | B3' from pessoas where email = 'teste@teste.com';

insert into compras (pessoa_id, produto_nome, plataforma, status, id_transacao)
select id, 'Produto Teste', 'teste', 'aprovada', 'TESTE-001'
from pessoas where email = 'teste@teste.com';
```

✅ Passou se: ambos inserem sem erro de FK.

### Teste 3 — RLS negativa (o que ninguem lembra de testar) — via MCP, sem anon key

Em vez de expor a anon key e disparar curl, simula-se o acesso anônimo **dentro do `execute_sql`**
com `set local role anon` (mesma transação). Confirma que o anônimo vê **0 linhas**:

```sql
-- mesma chamada execute_sql (mesma transacao)
set local role anon;
select count(*) as linhas_visiveis_anon from pessoas;
reset role;
```

✅ Passou se: `linhas_visiveis_anon = 0` (RLS bloqueia o anônimo). ❌ Se vier > 0: **RLS errada — PARAR e corrigir** antes de qualquer outra coisa.

### Limpeza (teste nao e fato) — via MCP `execute_sql`

```sql
-- a compra de teste primeiro (FK), depois a pessoa (cascade limpa capturas)
delete from compras where id_transacao = 'TESTE-001';
delete from pessoas where email = 'teste@teste.com';
```

### Alternativa secundária — testes via curl REST

Se preferir REST (ex: validar do lado de fora do MCP). Substituir `{SUPA_URL}`/`{SERVICE_ROLE}`/`{ANON_KEY}`
pelos do projeto. A service_role vem do COFRE — nunca colar no chat. Lembrete: a **secret key nova**
(`sb_secret_...`) funciona **só com o header `apikey`** (`Authorization: Bearer` sozinho dá 401) — ver
nota de preparação no fim deste arquivo.

```bash
# Teste 1 — upsert/dedup
curl -s -X POST "{SUPA_URL}/rest/v1/pessoas" \
  -H "apikey: {SERVICE_ROLE}" -H "Authorization: Bearer {SERVICE_ROLE}" \
  -H "Content-Type: application/json" -H "Prefer: resolution=merge-duplicates" \
  -d '{"email":"teste@teste.com","nome":"Teste Dedup","telefone":"5511999990000"}'
curl -s -X POST "{SUPA_URL}/rest/v1/pessoas?on_conflict=email" \
  -H "apikey: {SERVICE_ROLE}" -H "Authorization: Bearer {SERVICE_ROLE}" \
  -H "Content-Type: application/json" -H "Prefer: resolution=merge-duplicates" \
  -d '{"email":"teste@teste.com","telefone":"5511888880000"}'
curl -s "{SUPA_URL}/rest/v1/pessoas?email=eq.teste@teste.com&select=id,email,telefone" \
  -H "apikey: {SERVICE_ROLE}" -H "Authorization: Bearer {SERVICE_ROLE}"

# Teste 2 — fatos/FK (usar o {ID_PESSOA} do retorno acima)
curl -s -X POST "{SUPA_URL}/rest/v1/capturas" \
  -H "apikey: {SERVICE_ROLE}" -H "Authorization: Bearer {SERVICE_ROLE}" \
  -H "Content-Type: application/json" \
  -d '{"pessoa_id":"{ID_PESSOA}","tipo_captura":"teste","evento_referencia":"Teste | B3"}'
curl -s -X POST "{SUPA_URL}/rest/v1/compras" \
  -H "apikey: {SERVICE_ROLE}" -H "Authorization: Bearer {SERVICE_ROLE}" \
  -H "Content-Type: application/json" \
  -d '{"pessoa_id":"{ID_PESSOA}","produto_nome":"Produto Teste","plataforma":"teste","status":"aprovada","id_transacao":"TESTE-001"}'

# Teste 3 — RLS negativa com a ANON key (a publica) — DEVE vir vazio/negado
curl -s "{SUPA_URL}/rest/v1/pessoas?select=*" \
  -H "apikey: {ANON_KEY}" -H "Authorization: Bearer {ANON_KEY}"

# Limpeza
curl -s -X DELETE "{SUPA_URL}/rest/v1/compras?id_transacao=eq.TESTE-001" \
  -H "apikey: {SERVICE_ROLE}" -H "Authorization: Bearer {SERVICE_ROLE}"
curl -s -X DELETE "{SUPA_URL}/rest/v1/pessoas?email=eq.teste@teste.com" \
  -H "apikey: {SERVICE_ROLE}" -H "Authorization: Bearer {SERVICE_ROLE}"
```

## Checklist final da FASE 1 (gate QG-B3-002)

- [ ] Projeto certo confirmado (`ref` via `list_projects`) e `ACTIVE_HEALTHY` (não `INACTIVE`/`COMING_UP`)
- [ ] 3 migrations aplicadas via MCP (001→002→003) e **persistência confirmada** via `information_schema`/`pg_proc` (não só pelo `success`)
- [ ] 3 tabelas (pessoas, capturas, compras) listadas via MCP (`list_tables`), com indexes e RLS habilitada
- [ ] Teste 1: dedup por email funciona (1 linha, dado atualizado)
- [ ] Teste 2: FKs funcionam (captura + compra inserem)
- [ ] Teste 3: anônimo BLOQUEADO (`set local role anon` vê 0 linhas)
- [ ] Dados de teste removidos
- [ ] Tracker atualizado

## Nota de preparação pra Fase 2 — secret key nova

Na Fase 2 o n8n vai **escrever no banco** via REST e vai precisar da **SECRET KEY nova** do Supabase
(`sb_secret_...`). Pontos que já ficam avisados aqui (detalhe na Fase 2):
- O aluno pega essa key no painel: **Settings → API Keys → Secret keys**. O **MCP NÃO expõe** essa key
  (proteção) — é o fluxo (b) do Princípio 1 (só o aluno pega, no painel).
- Ela funciona **só com o header `apikey`**. `Authorization: Bearer` sozinho retorna **401**.
