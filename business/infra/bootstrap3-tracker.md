# Bootstrap 3 — Tracker

> Estado da jornada Configuracoes Avancadas. O b3-chief le este arquivo na ativacao
> e retoma de onde parou. Atualizado a CADA passo concluido (nao no fim).
> Vive no repo do aluno: `business/infra/bootstrap3-tracker.md`

**Aluno:** Karol Senna
**Iniciado em:** 2026-07-02
**Status geral:** EM ANDAMENTO
**Fase atual:** FASE 0

---

## FASE 0 — Servidor (gate QG-B3-001)

- [x] 0.1a 1Password conectado (Service Account, vault "Claude" confirmado via `op vault list`) — 2026-07-02
- [ ] 0.1b Cloudflare MCP registrado (`claude mcp add`) mas AINDA NAO AUTORIZADO — falta rodar `/mcp` numa sessao nova (reabrir Claude Code) e autorizar no navegador
- [ ] 0.1c Conta Hetzner + cartao (ainda nao verificado)
- [ ] 0.2 Token Hetzner Read&Write no cofre + validado na API (HTTP 200)
- [ ] 0.3 Dominio escolhido no Cloudflare (dominio: `karolsenna.com.br`) + DNS-only `n8n.`/`webhook.` → IP
- [ ] 0.4 Servidor criado via API (tipo nao-deprecated ~2vCPU/4GB, ex: cx23; cloud-init: Docker no ar) — IP: `___`
- [ ] 0.5 Stack subido (Traefik + n8n queue mode) + VALIDADO: https cadeado + owner n8n criado via API (cofre) + webhook responde via https (segredos no cofre)
- [ ] **GATE QG-B3-001 fechado em:** `___`

## FASE 1 — Banco unificado (gate QG-B3-002)

- [ ] 1.1 Modelo entendido (hub + append-only + 5 principios)
- [ ] 1.2 Migrations aplicadas (001 funcao → 002 pessoas → 003 capturas+compras)
- [ ] 1.3 Testes: dedup por email ✅ · FKs ✅ · RLS negativa (anon bloqueada) ✅
- [ ] 1.4 Dados de teste limpos
- [ ] **GATE QG-B3-002 fechado em:** `___`

## FASE 2 — Automacoes (gate QG-B3-003)

- [ ] 2.0 Z-API conectado (teste RECEBIDO) + credenciais no cofre + anti-ban configurado — numero: dedicado? `___`
- [ ] 2.1 Compras: dry-run e2e ✅ · idempotencia ✅ · webhook real conectado (plataforma: `___`)
- [ ] 2.2 Dispatcher: tabelas criadas · dry-run ✅ · disparo minusculo ✅
- [ ] 2.3 Recovery: tabela + trigger ✅ · dry-run ✅ · trigger de conversao testado ✅
- [ ] **GATE QG-B3-003 fechado em:** `___`

---

## REGISTRO (append-only — nunca apagar linha)

- 2026-07-02 — @b3-chief: tracker criado, jornada iniciada
- 2026-07-02 — @ops: QG-B3-000 resolvido — projeto Supabase "incubadora-de-expert" criado (São Paulo), chaves salvas no cofre
- 2026-07-02 — @ops: 1Password conectado (vault Claude confirmado). Cloudflare MCP registrado, autenticação pendente — precisa sessão nova do Claude Code pra completar via `/mcp`

## BLOCKERS ATIVOS

- Cloudflare MCP registrado mas nao autenticado — sessao do Claude Code precisa ser reaberta pra `/mcp` reconhecer o servidor novo e permitir autorizar no navegador. Resolver assim que o aluno reabrir.

## DECISOES DO ALUNO

- 2026-07-02 — usou `karolsenna.com.br` pra Fase 0 (infra técnica: n8n/webhook), mantendo `incubadoradeexpert.com.br` livre pras páginas/LPs
- 2026-07-02 — tinha servidor AWS (~R$137/mês) criado pro n8n mas nunca usado; decidiu NÃO reaproveitar, seguir com Hetzner (~R$38/mês) e cancelar a AWS depois que o novo servidor validar
