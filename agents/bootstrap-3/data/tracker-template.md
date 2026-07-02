# Bootstrap 3 — Tracker

> Estado da jornada Configuracoes Avancadas. O b3-chief le este arquivo na ativacao
> e retoma de onde parou. Atualizado a CADA passo concluido (nao no fim).
> Vive no repo do aluno: `business/infra/bootstrap3-tracker.md`

**Aluno:** {NOME}
**Iniciado em:** {DATA}
**Status geral:** EM ANDAMENTO
**Fase atual:** FASE 0

---

## FASE 0 — Servidor (gate QG-B3-001)

- [ ] 0.1 Pre-requisitos: 1Password (vault Claude) + Cloudflare MCP + conta Hetzner
- [ ] 0.2 Token Hetzner Read&Write no cofre + validado na API (HTTP 200)
- [ ] 0.3 Dominio escolhido no Cloudflare (dominio: `___`) + DNS-only `n8n.`/`webhook.` → IP
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

- {DATA} — @b3-chief: tracker criado, jornada iniciada

## BLOCKERS ATIVOS

(nenhum)

## DECISOES DO ALUNO

(ex: "usou numero pessoal no Z-API contra recomendacao — registrado em {data}")
