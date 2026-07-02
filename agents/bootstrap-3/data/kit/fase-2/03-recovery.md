# FASE 2 · Passo 2.3 — Recovery de Vendas

> Versao-aluno do `WF-RECOVERY-CRON` da Arka (em producao desde 04/2026), com o
> MESMO desenho central: cron busca quem **capturou e nao comprou**, envia o resgate,
> e um **trigger no banco** garante que quem compra SAI da fila na hora. Adaptacao
> declarada: o envio aqui e Z-API texto (na Arka e template Cloud API + Bia
> respondendo — essa evolucao chega pro aluno junto com a Bia, depois).
> Conduzido pelo @operador-automacoes.

---

## O efeito

Lead preencheu a pagina, chegou no checkout, nao pagou. 2 horas depois recebe UMA mensagem de resgate — pessoal, com link. Se comprar (por qualquer caminho), nunca mais recebe nada do recovery: o banco se auto-corrige. E a automacao de maior ROI por esforco: lead quente que JA quis comprar.

## Tabela + trigger de conversao (SQL — aplicar via MCP do Supabase)

```sql
-- Fila de recovery (padrao do hub: pessoa_id aponta pro core)
create table if not exists public.recovery_contacts (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  pessoa_id     uuid not null references public.pessoas (id) on delete cascade,
  phone         text not null,            -- normalizado (so digitos com DDI 55)
  campanha      text,                     -- de qual captura/campanha veio
  contacted_at  timestamptz,              -- quando o resgate foi enviado
  converted_at  timestamptz,              -- quando comprou (preenchido pelo TRIGGER)
  unique (pessoa_id, campanha)            -- 1 entrada por pessoa por campanha
);
create index if not exists idx_recovery_fila on public.recovery_contacts (contacted_at, converted_at);

alter table public.recovery_contacts enable row level security;

-- TRIGGER: comprou -> recovery PARA na hora (mesmo desenho da Arka, que ja
-- evitou oferta-pra-quem-ja-comprou em producao). Business-critical.
create or replace function public.fn_recovery_mark_converted()
returns trigger
language plpgsql
as $$
begin
  update public.recovery_contacts
     set converted_at = now()
   where pessoa_id = new.pessoa_id
     and converted_at is null;
  return new;
end;
$$;

drop trigger if exists trg_recovery_mark_converted on public.compras;
create trigger trg_recovery_mark_converted
  after insert on public.compras
  for each row execute function public.fn_recovery_mark_converted();
```

> **Como aplicar (Principio 4):** o operador aplica esse SQL via **MCP do Supabase**
> (`apply_migration`), nao no SQL Editor. Depois **confirma a persistencia** — tabela
> `recovery_contacts` em `information_schema` E a funcao/trigger em `pg_proc`/`information_schema.triggers`
> — antes de seguir (durante `COMING_UP` o `apply_migration` pode dar falso-sucesso). O SQL em si nao muda.

> ⚠️ Este trigger e **silently business-critical** (licao da Arka): se ele sair do ar,
> o recovery nao para de mandar mensagem pra quem ja comprou. O teste dele e parte do gate.

## O workflow (n8n)

```
Schedule Trigger (a cada 15 min)
  → Busca candidatos (HTTP → Supabase)
      capturas entre 2h e 48h atras
      E pessoa com status_geral = 'lead' (nao virou comprador)
      E sem entrada em recovery_contacts ja contatada
      E telefone preenchido
      E fora da blacklist
      LIMIT 5                              ← lote pequeno por rodada (cadencia natural)
  → Tem candidatos? (IF)                   nao → encerra silencioso
  → Loop (1 por vez)
      → Upsert em recovery_contacts        (pessoa_id, phone, campanha)
      → Envia resgate (HTTP → Z-API)       variacao de mensagem + link do checkout
      → Marca contacted_at = now()
      → Wait aleatorio 90-240s
```

> **Como e montado (Principio 3 e 4):** o aluno e nao-dev — este workflow e **criado via API
> do n8n** pelo operador (`POST /rest/workflows` com nodes + conexoes), com as credenciais
> criadas via API: header **`apikey`** pro Supabase e header **`Client-Token`** pro Z-API. A
> credencial do Supabase usa a **secret key nova** (`sb_secret_...`, que substitui a service_role
> legacy) — **UM header so, `apikey`** (com `Authorization: Bearer` sozinho da 401). O valor vem
> do cofre (o aluno pega em Settings → API Keys → Secret keys; o MCP nao expoe). O workflow de
> referencia pode ficar embarcado como template no squad; o aluno so **publica**.

Regras fixas:
- **Janela 2h-48h:** antes de 2h e afobado (pessoa ainda pode estar comprando); depois de 48h esfriou — o aluno ajusta com o operador depois de rodar
- **1 toque so** nesta versao (cadencia multi-toque e evolucao consciente, nao default)
- **Blacklist sempre** · **horario humano** (se a rodada cai de madrugada, candidato espera a proxima janela)
- Mensagem de resgate escrita COM o aluno: pessoal, curta, sem pressao falsa, com o link — 5+ variacoes

## DRY-RUN (obrigatorio)

1. **Popular cenario de teste:** inserir pessoa de teste (status `lead`, telefone do ALUNO) + captura de ~3h atras (`created_at` retroativo no insert)
2. **Sem envio:** node de envio desligado → rodar manual → conferir: candidato achado, linha em `recovery_contacts` criada
3. **Com envio:** religar → rodar → mensagem de resgate chega no celular do aluno + `contacted_at` preenchido
4. **Rodar de novo:** o mesmo candidato NAO e pego (ja contatado) — idempotencia
5. **TESTE DO TRIGGER (parte do gate):** inserir uma compra pra essa pessoa de teste → conferir `converted_at` preenchido na hora em `recovery_contacts`
6. Limpar todos os dados de teste **via MCP do Supabase** (`execute_sql`) — sem expor key (Principio 4)

> **Pra rodar no schedule, PUBLICAR** (botao **Publish** no editor) — nas versoes recentes do
> n8n (2.27+) ativa-se por Publish, nao pelo toggle "Active"; a ativacao via API (campo `active`)
> NAO funciona nessas versoes. O Schedule Trigger so dispara com o workflow publicado. O dry-run
> acima e "rodar manual" no editor (nao precisa publicar). O operador detecta a versao e adapta;
> o aluno publica com 1 clique (Principio 3).

## Checklist do passo

- [ ] Tabela `recovery_contacts` + trigger criados
- [ ] Workflow montado (janela 2h-48h, lote 5, blacklist, cadencia)
- [ ] Dry-run sem envio: candidato achado e registrado
- [ ] Dry-run com envio: resgate recebido + contacted_at marcado
- [ ] Idempotencia: candidato contatado nao repete
- [ ] Trigger testado: compra → converted_at na hora
- [ ] Dados de teste limpos · workflow publicado (Publish)
