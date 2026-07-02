# FASE 2 · Passo 2.2 — Dispatcher de Disparos (grupo + individual)

> Versao-aluno ESSENCIAL do `WF-DISPATCHER` da Arka, adaptada de forma declarada:
> o sistema da Arka agenda por arquivos de campanha + CLI; a versao-aluno agenda
> por **tabela no Supabase** (`disparos_agendados`) — mais simples de operar via
> Claude Code e mantem a mesma espinha: candidatos → blacklist → cadencia → envio
> Z-API → log idempotente. Conduzido pelo @operador-automacoes.
>
> AQUI MORAM AS REGRAS ANTI-BAN. Dry-run obrigatorio. Primeiro disparo real minusculo.

---

## O efeito

"Quinta 9h, manda o convite do evento pros 3 grupos e pra lista quente" — programado HOJE, executado sozinho na hora certa, com cadencia humana, pulando quem pediu pra sair, e cada envio registrado (quem, quando, o que). Auditavel e sem dedo no botao.

## Tabelas de sistema (SQL — aplicar via MCP do Supabase)

> Repare o padrao do hub: `pessoa_id` aponta pro core; NENHUMA identidade duplicada.

```sql
-- Agenda de disparos (a "fila" que o aluno programa — via Claude Code ou direto)
create table if not exists public.disparos_agendados (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  tipo          text not null check (tipo in ('individual','grupo')),
  destinatario  text not null,            -- phone normalizado (individual) ou ID do grupo
  pessoa_id     uuid references public.pessoas (id) on delete set null,  -- quando individual e conhecido
  mensagem      text not null,            -- o texto desta mensagem (variacao ja escolhida)
  enviar_apos   timestamptz not null,     -- quando pode sair
  campanha      text,                     -- slug da campanha (relatorio)
  status        text not null default 'pendente'
                check (status in ('pendente','enviado','falhou','cancelado','bloqueado')),
  enviado_em    timestamptz
);
create index if not exists idx_disparos_fila on public.disparos_agendados (status, enviar_apos);

-- Log de envios (audit + idempotencia — espelho do dispatches_log da Arka)
create table if not exists public.dispatches_log (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  disparo_id    uuid references public.disparos_agendados (id) on delete set null,
  destinatario  text not null,
  campanha      text,
  resultado     text not null,            -- 'enviado' | 'falhou: {motivo}' | 'bloqueado: blacklist'
  payload       jsonb                     -- resposta da Z-API (debug)
);
create index if not exists idx_dispatches_dest on public.dispatches_log (destinatario, created_at);

-- Blacklist / opt-out (fonte UNICA — todas as automacoes consultam)
create table if not exists public.blacklist (
  phone       text primary key,           -- normalizado: so digitos com DDI 55
  created_at  timestamptz not null default now(),
  motivo      text                        -- 'pediu_saida', 'numero_invalido', 'manual'
);

alter table public.disparos_agendados enable row level security;
alter table public.dispatches_log     enable row level security;
alter table public.blacklist          enable row level security;
```

> **Como aplicar (Principio 4):** o operador aplica esse SQL via **MCP do Supabase**
> (`apply_migration`), nao no SQL Editor. Depois **confirma a persistencia**
> (`information_schema` — as 3 tabelas existem) antes de seguir: durante `COMING_UP` o
> `apply_migration` pode dar falso-sucesso. O SQL em si nao muda.

## O workflow (n8n)

```
Schedule Trigger (a cada 5 min)
  → Busca lote (HTTP → Supabase)       status=pendente AND enviar_apos <= now() · LIMIT 10
  → Tem itens? (IF)                    nao → encerra silencioso
  → Loop (1 por vez)
      → Checa blacklist (HTTP)         phone na blacklist? → marca 'bloqueado' + log → proximo
      → Checa limite diario (HTTP)     count(dispatches_log hoje, tipo individual) >= 90? → para o lote (fica pra amanha)
      → Envia (HTTP → Z-API send-text) individual: phone · grupo: ID do grupo
      → Marca enviado + log            status='enviado', enviado_em=now() + linha no dispatches_log
      → Wait ALEATORIO 90-240s         (Code node sorteia; NUNCA fixo)
  → fim do lote
```

> **Como e montado (Principio 3 e 4):** o aluno e nao-dev — este workflow (8-9 nodes) e
> **criado via API do n8n** pelo operador (`POST /rest/workflows` com nodes + conexoes), com
> as credenciais criadas via API: header **`apikey`** pro Supabase e header **`Client-Token`**
> pro Z-API. A credencial do Supabase usa a **secret key nova** (`sb_secret_...`, que substitui
> a service_role legacy) — **UM header so, `apikey`** (com `Authorization: Bearer` sozinho o
> gateway da 401). O valor vem do cofre (o aluno pega em Settings → API Keys → Secret keys; o
> MCP nao expoe). O workflow de referencia pode ficar embarcado como template no squad.

Pontos que o operador NAO flexibiliza:
- **Wait aleatorio 90-240s** entre individuais (grupos: 1 grupo a cada poucos minutos tambem)
- **Limite diario ~90** individuais — o node de checagem PARA o lote quando bate
- **Blacklist antes de TODO envio** — sem excecao
- **Horario humano:** agendar `enviar_apos` dentro de 08h-21h
- **Variacoes:** quem programa a campanha grava mensagens VARIADAS na agenda (10+ variacoes pra lista grande) — o operador ajuda a gerar

## Como o aluno programa um disparo (operacao do dia a dia)

Via Claude Code (linguagem natural → INSERTs na agenda):

> "Programa pra quinta 9h o convite do workshop pros grupos A e B e pra lista de compradores do produto X"

vira N linhas em `disparos_agendados` (cada uma com variacao de mensagem e `enviar_apos` espacado). O dispatcher faz o resto sozinho.

## DRY-RUN (obrigatorio)

1. Popular a agenda com 2-3 linhas de teste (destinatario = o PROPRIO aluno), `enviar_apos = now()`
2. **Envio desligado:** desativar temporariamente o node de envio (ou trocar por NoOp) → rodar manual → conferir: itens achados, blacklist consultada, log gravado com resultado simulado
3. Religar o envio → rodar de novo com a fila de teste → mensagens chegam no celular do aluno, com o intervalo aleatorio visivel entre elas
4. Conferir `dispatches_log`: 1 linha por envio

**Teste da blacklist:** inserir o proprio numero na blacklist → agendar disparo → rodar → resultado: `bloqueado`, NADA enviado → tirar o numero da blacklist.

## Primeiro disparo real

Lista MINUSCULA: o aluno + 2-3 contatos avisados. Volume sobe DEVAGAR nas semanas seguintes (numero esquentando). A lista de 800 vai levar dias de cadencia — e esse e o jogo certo.

> **Pra rodar no schedule, PUBLICAR** (botao **Publish** no editor) — nas versoes recentes
> do n8n (2.27+) ativa-se por Publish, nao pelo toggle "Active"; a ativacao via API (campo
> `active`) NAO funciona nessas versoes. O Schedule Trigger so dispara com o workflow
> publicado. O dry-run acima e "rodar manual" no editor (nao precisa publicar). O operador
> detecta a versao e adapta; o aluno publica com 1 clique (Principio 3).

## Checklist do passo

- [ ] 3 tabelas criadas (agenda, log, blacklist)
- [ ] Workflow montado com cadencia aleatoria + limite diario + checagem de blacklist
- [ ] Dry-run sem envio validado (fila + log)
- [ ] Dry-run com envio: mensagens recebidas com intervalo visivel
- [ ] Teste da blacklist: bloqueio funciona
- [ ] Primeiro disparo real minusculo feito
- [ ] Workflow publicado (Publish)
