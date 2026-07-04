# Bootstrap 3 — Tracker

> Estado da jornada Configuracoes Avancadas. O b3-chief le este arquivo na ativacao
> e retoma de onde parou. Atualizado a CADA passo concluido (nao no fim).
> Vive no repo do aluno: `business/infra/bootstrap3-tracker.md`

**Aluno:** Karol Senna
**Iniciado em:** 2026-07-02
**Status geral:** EM ANDAMENTO
**Fase atual:** FASE 2 (Fases 0 e 1 concluídas em 2026-07-04)

---

## FASE 0 — Servidor (gate QG-B3-001)

- [x] 0.1a 1Password conectado (Service Account, vault "Claude" confirmado via `op vault list`) — 2026-07-02
- [x] 0.1b Cloudflare MCP autorizado e VALIDADO (listou zonas via API na conta karolsenna@incubadoradeexpert.com.br) — 2026-07-03. Obs: conta Cloudflare sem nenhuma zona — `karolsenna.com.br` precisa ser adicionado no passo 0.3
- [x] 0.1c Conta Hetzner criada pela aluna — 2026-07-03
- [x] 0.2 Token Hetzner Read&Write no cofre (`op://Claude/Hetzner/token`) + validado na API (HTTP 200) — 2026-07-03
- [x] 0.3 Dominio `karolsenna.com.br` adicionado no Cloudflare (plano Free) + nameservers trocados no Registro.br + zona ATIVA — 2026-07-03. Wildcard morto do HostGator removido. (Registros `n8n.`/`webhook.` → IP entram no 0.4)
- [x] 0.4 Servidor criado via API (cx23, Ubuntu 22.04, hel1, €6,49/mes confirmado; cloud-init: Docker) — IP: `204.168.240.18` · server id: `147715826` · ssh key: `~/.ssh/hetzner-n8n` — 2026-07-03. DNS `n8n.`/`webhook.karolsenna.com.br` → IP (DNS-only) ✅
- [x] 0.5 Stack subido (Traefik v3.6.1 + Postgres 16 + Redis 7 + n8n queue mode, 6 containers) + VALIDADO: `https://n8n.karolsenna.com.br` 200 com SSL ok · owner criado via API (login HTTP 200) · webhook https ok (404 esperado, sem workflow) · segredos no cofre (`Incubadora - n8n Postgres` / `Incubadora - n8n Encryption Key` / `Incubadora - n8n Admin`) — 2026-07-04
- [x] **GATE QG-B3-001 fechado em:** 2026-07-04

## FASE 1 — Banco unificado (gate QG-B3-002)

- [x] 1.1 Modelo entendido (hub + append-only + 5 principios; duvida do DDI internacional esclarecida) — 2026-07-04
- [x] 1.2 Migrations aplicadas via Management API no projeto `pxnbcbhgoewrwyreohki` (ACTIVE_HEALTHY), persistencia confirmada apos cada uma (001 funcao → 002 pessoas → 003 capturas+compras; 12 indexes, RLS nas 3, trigger updated_at) — 2026-07-04
- [x] 1.3 Testes: dedup por email (com variacao de caixa) ✅ · FKs ✅ · id_transacao UNIQUE (retry nao duplica) ✅ · RLS negativa via SQL (role anon = 0 linhas) ✅ · RLS negativa via REST (publishable key = corpo vazio) ✅ — 2026-07-04
- [x] 1.4 Dados de teste limpos (pessoas/capturas/compras = 0) — 2026-07-04
- [x] **GATE QG-B3-002 fechado em:** 2026-07-04

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
- 2026-07-03 — @b3-chief: Cloudflare MCP autorizado e validado (API respondeu). Conta Cloudflare está SEM zonas — `karolsenna.com.br` ainda não foi adicionado (vira parte do passo 0.3). Blocker do MCP resolvido.
- 2026-07-03 — @b3-chief: conta Hetzner criada (0.1 completo). Domínio `karolsenna.com.br` confirmado no Registro.br — passo 0.3 vai exigir troca de nameservers lá.
- 2026-07-03 — @operador-infra: token Hetzner no cofre e validado (HTTP 200). Zona `karolsenna.com.br` ativa no Cloudflare (NS trocados no Registro.br). MCP Cloudflare é read-only pra DNS → criado token API `Edit zone DNS` no cofre (`op://Claude/Cloudflare/token`). Wildcard morto do HostGator removido.
- 2026-07-03 — @operador-infra: servidor `n8n-incubadora` criado via API (cx23 @ hel1, IP 204.168.240.18). Registros A `n8n.` e `webhook.` → IP, DNS-only. Aguardando cloud-init (Docker) pra subir o stack (passo 0.5).
- 2026-07-04 — @operador-infra: conta de serviço 1Password era read-only → criada `Auroq-RW` (ler+escrever no vault Claude), token trocado na env var do Windows, antiga revogada pela aluna e item do token velho apagado do cofre.
- 2026-07-04 — @operador-infra: stack no ar (Traefik v3.6.1 + Postgres 16 + Redis 7 + n8n queue mode). SSL emitido em 10s. Owner criado via API, login validado. Webhook https ok. Segredos no cofre. **GATE QG-B3-001 FECHADO** — Fase 0 concluída.
- 2026-07-04 — @operador-banco: Fase 1 completa em ~20min. Sem MCP Supabase na sessão → migrations e testes via Management API (token SUPABASE_ACCESS_TOKEN + chaves em business/vault/supabase.md). 3 migrations aplicadas e persistidas, todos os testes do gate passaram (dedup, FK, unique de transacao, RLS negativa dupla), dados de teste limpos. **GATE QG-B3-002 FECHADO** — Fase 1 concluída.

## BLOCKERS ATIVOS

- (nenhum)

## DECISOES DO ALUNO

- 2026-07-02 — usou `karolsenna.com.br` pra Fase 0 (infra técnica: n8n/webhook), mantendo `incubadoradeexpert.com.br` livre pras páginas/LPs
- 2026-07-02 — tinha servidor AWS (~R$137/mês) criado pro n8n mas nunca usado; decidiu NÃO reaproveitar, seguir com Hetzner (~R$38/mês) e cancelar a AWS depois que o novo servidor validar
