---
task: "FASE 1 — Banco de dados unificado (Supabase core)"
responsavel: "@operador-banco"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "QG-B3-001 validado (servidor vivo)"
Saida: "3 tabelas core (pessoas/capturas/compras) criadas, testadas (dedup + FK + RLS negativa), logica entendida pelo aluno"
Checklist:
  - "Passo 1.1: modelo entendido (hub + logs append-only + 5 principios)"
  - "Passo 1.2: 3 migrations aplicadas na ordem (funcao → pessoas → capturas+compras)"
  - "Passo 1.3: testes reais — dedup por email, FKs, RLS negativa (anon bloqueada)"
  - "Passo 1.4: dados de teste limpos + tracker atualizado"
execution_type: "interactive"
---

# FASE 1 — Banco de dados unificado (a memoria do negocio)

**Agente:** @operador-banco · **Gate de saida:** QG-B3-002
**Material:** `data/kit/fase-1/esquema-core.md` (modelo + decisoes) · `data/kit/fase-1/migrations/` (3 SQLs) · `knowledge/banco-unificado-logica.md` (teoria, pro chief/consultoria)

> Usa o Supabase que o aluno JA conectou no bootstrap 1. Nada novo pra contratar.
> **Conceito antes do comando:** o aluno so roda SQL depois de entender o que esta criando.

## Passo 1.1 — Entender o modelo (~10min)
Apresentar (versao curta, do `esquema-core.md`):
- **`pessoas`** = hub. 1 linha por ser humano. Email = identidade (UNIQUE). Lead → comprador e a MESMA linha mudando `status_geral`
- **`capturas`** = diario de leads (append-only). Cada form preenchido = 1 linha → pessoa
- **`compras`** = livro-caixa (append-only). Cada pagamento = 1 linha → pessoa. Cancelamento = linha NOVA
- Os 5 principios (email universal · telefone normalizado · append-only · RLS service-role · sistemas nao escrevem no core) — cada um com o caso real de onde veio

## Passo 1.2 — Aplicar as migrations via MCP (~15min)
> Caminho principal: **MCP do Supabase** (`knowledge/principios-operacionais.md`, Princípio 4). SQL Editor do painel é fallback.
1. **Projeto certo + vivo:** confirmar o `ref` do projeto (`list_projects` / decodificar JWT) — itens do cofre podem ser de OUTRO projeto do aluno (produção); nunca tocar no ambiente errado. Se o status for `INACTIVE` (free tier pausado), `restore_project` e **AGUARDAR `ACTIVE_HEALTHY`** antes de aplicar
2. Aplicar via `apply_migration`, ordem: `001_funcao_updated_at.sql` → `002_pessoas.sql` → `003_capturas_compras.sql`
3. **Falso-sucesso (P0):** durante `COMING_UP` o `apply_migration` pode dar `success=true` e NÃO persistir. Só aplicar com `ACTIVE_HEALTHY` e, **depois de cada migration, CONFIRMAR a persistência** via `information_schema.tables`/`pg_proc` — nunca confiar só no `success`
4. Confirmar as 3 tabelas via MCP (`list_tables`/`information_schema`), não no Table Editor visual
5. Fallback: se o MCP não estiver disponível, colar os 3 SQLs no SQL Editor do painel na mesma ordem (e confirmar via SQL, não pelo Table Editor)

## Passo 1.3 — Testar de verdade via MCP (~15min)
> Caminho recomendado: `execute_sql` — sem expor key nem curl (Princípio 4).
1. **Dedup:** upsert da mesma pessoa 2x via `execute_sql` (`ON CONFLICT (email)`), segunda vez com telefone novo → resultado: **1 linha**, telefone atualizado
2. **Fatos/FK:** 1 captura + 1 compra apontando pro `pessoa_id` → inserem sem erro
3. **RLS negativa:** dentro do `execute_sql`, `set local role anon` e contar linhas de `pessoas` → DEVE ver **0 linhas**. Se vier dado: PARAR e corrigir a policy antes de qualquer coisa
4. SQLs (e o curl REST alternativo) prontos no `esquema-core.md` (secao Testes)

## Passo 1.4 — Registrar e limpar
1. Apagar os dados de teste (sao teste, nao fato)
2. Tracker: projeto Supabase, data, migrations aplicadas, testes ✅
3. Reforcar a regra de crescimento: tabela nova so entra apontando pro hub (a Fase 2 ja demonstra na pratica)

## Gate QG-B3-002 → reporta ao Chief
3 tabelas + indexes + RLS + triggers · dedup testado (com variacao de caixa) · anon key bloqueada · tracker atualizado.

## Error Handling

| Cenario | Acao |
|---------|------|
| Projeto Supabase `INACTIVE` (pausado, free tier) | `restore_project` e AGUARDAR `ACTIVE_HEALTHY` antes de qualquer migration — não aplicar durante `COMING_UP` |
| `apply_migration` deu `success` mas as tabelas somem | Falso-sucesso de `COMING_UP` (P0): só aplicar com `ACTIVE_HEALTHY` e confirmar persistência via `information_schema`/`pg_proc` após cada migration |
| Dúvida de qual projeto é o certo | Confirmar `ref` via `list_projects`/JWT — pode ser projeto de PRODUÇÃO do aluno; operar via MCP na conta certa |
| Migration falha (objeto ja existe) | Conferir se rodou 2x; migrations do kit sao idempotentes (IF NOT EXISTS) — reler o erro antes de mexer |
| Insert de teste falha por RLS | Esta usando anon key no lugar da service_role — mostrar onde pegar a certa (Settings → API) |
| Anon key retorna dados no teste negativo | Policy errada/RLS desabilitada → corrigir AGORA (banco aberto pra internet e critico) |
| Aluno quer ja criar tabelas do nicho dele | Aceitar SO depois do core puro testado; aplicar a regra do hub (pessoa_id, sem identidade duplicada) |
| Aluno cola service_role key no chat | Cofre; se exposta, rotacionar a key no painel |
| Email/telefone fora do padrao nos testes | Normalizar sempre: email trim+lowercase, telefone so digitos com DDI 55 |
