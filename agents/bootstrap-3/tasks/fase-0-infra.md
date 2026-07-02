---
task: "FASE 0 — Servidor (provisionamento automatico via Hetzner API + Cloudflare)"
responsavel: "@operador-infra"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "QG-B3-000 validado + tracker criado"
Saida: "Servidor Hetzner provisionado via API, n8n queue mode em https com owner criado via API, webhook respondendo 200, credenciais no cofre (1Password)"
Checklist:
  - "Passo 0.1: pre-requisitos checados (1Password vault Claude · Cloudflare MCP · conta Hetzner)"
  - "Passo 0.2: token Hetzner Read&Write no cofre + validado (HTTP 200 na API)"
  - "Passo 0.3: dominio escolhido no Cloudflare (ou comprado se nao tinha)"
  - "Passo 0.4: servidor criado via API (cloud-init: Docker no ar) + DNS-only no Cloudflare"
  - "Passo 0.5: stack subido via SSH (Traefik + n8n queue mode) + validacao (https cadeado + webhook 200)"
execution_type: "interactive"
---

# FASE 0 — Servidor (a maquina 24/7 do aluno, provisionada via API)

**Agente:** @operador-infra · **Gate de saida:** QG-B3-001
**Material:** `data/kit/fase-0/setup-servidor.md` (playbook completo com os comandos de API e armadilhas)

> Virada de metodo (v1.1.0): o aluno NAO monta na mao. Ele faz 3 coisas — conta Hetzner + cartao,
> gera 1 token (guiado por print), confirma o dominio — e o **Claude Code provisiona tudo via API**:
> servidor, Docker, DNS, Traefik (SSL) e n8n. Sem EasyPanel, sem painel.
>
> Custo informado ANTES de criar a conta: CX23 ~€6,49/mes (~R$38) — checar o valor vigente ao provisionar, cobrado em euro.

## Passo 0.1 — Pre-requisitos (Claude valida)
- `op vault list` mostra o vault **Claude** (cofre) — senao, fallback `.env` local (avisar)
- `claude mcp list` mostra **cloudflare** — senao, apontar pro `*bootstrap-2 cloudflare` (sem isso nao ha DNS automatico)
- Aluno tem conta Hetzner + cartao (verificacao de identidade e normal)

## Passo 0.2 — Token Hetzner no cofre (UNICA UI guiada por print) (~10min)
1. Hetzner Console → Projeto → **Security → API Tokens → Generate** → **Read & Write** → copiar (aparece 1x)
2. Guardar: **(A)** item `Hetzner`/campo `token` no vault `Claude` → `op read "op://Claude/Hetzner/token"`; **(B fallback)** `data/.env` gitignored
3. Validar sem imprimir: `curl` na `/v1/servers` com `Bearer $HCLOUD_TOKEN` → **200** (401=token errado · 403=Read-only)
4. Token no chat por engano → NAO repetir valor, orientar revogar + gerar outro

## Passo 0.3 — Dominio no Cloudflare (~5min) (Claude via MCP)
1. Listar zonas do Cloudflare do aluno
2. Tem dominio → confirmar qual usar · Nao tem → guiar compra/adicao no Cloudflare, pausar e retomar
3. Subdominios da fase: `n8n.{dominio}` · `webhook.{dominio}`

## Passo 0.4 — Provisionar servidor + DNS (~10min) (Claude via API)
1. SSH key: `ssh-keygen` local + registrar a publica via `POST /v1/ssh_keys` (privada fica na maquina do aluno)
2. Escolher o tipo: listar `GET /v1/server_types`, filtrar **nao-deprecated** ~2vCPU/4GB (o `cx22` saiu; hoje `cx23`) — nao hardcodar. `POST /v1/servers`: `cx23`, Ubuntu 22.04, `hel1`, com **cloud-init** (instala Docker + `daemon.json` DNS 8.8.8.8/1.1.1.1)
3. Esperar `running`, pegar o IP → tracker
4. Cloudflare MCP: registros A `n8n.` e `webhook.` → IP, **DNS-only (proxied=false)** (proxied quebra o SSL)

## Passo 0.5 — Subir o stack + validar (~15min) (Claude via SSH)
1. Esperar cloud-init com polling tolerante (`/root/.cloud-init-done` + `docker info`); mensagem honesta ("ainda subindo, normal" vs falha) — so declarar falha apos confirmar estado REAL (SSH responde? `cloud-init-output.log` com erro?). Princípio 6.
2. Gerar `PG_PASS` (`openssl rand -hex 24`) + `N8N_KEY` (`openssl rand -hex 16`) → **cofre NA HORA** com prefixo do projeto (itens `{Prefixo} - n8n Postgres` / `{Prefixo} - n8n Encryption Key`; a MESMA key nos 3 services; key perdida = credentials perdidas). Princípio 1a.
3. Gerar `/opt/n8n/docker-compose.yml` (Traefik embutido + postgres + redis + n8n editor/worker/webhook) — conferir versoes estaveis atuais e compativeis (Princípio 2), com `N8N_PROXY_HOPS=1` no env compartilhado (trust proxy atras do Traefik) → `docker compose up -d`
4. Criar a conta **owner do n8n via API** (`POST https://n8n.{dominio}/rest/owner/setup`), senha forte gerada pelo squad → cofre (item `{Prefixo} - n8n Admin`). E-mail confirmado com o aluno; o aluno NAO digita nada
5. Validar: `https://n8n.{dominio}` **200 com cadeado** + owner criado via API (login valida) · webhook de teste **HTTP 200**

## Gate QG-B3-001 → reporta ao Chief
Token no cofre · servidor via API no ar · DNS-only no Cloudflare · n8n https com cadeado · owner criado via API (cofre) · webhook 200 · credenciais no cofre · tracker atualizado.

## Error Handling

| Cenario | Acao |
|---------|------|
| Token retorna 403 | E Read-only — gerar novo com **Read & Write** |
| `claude mcp list` sem cloudflare | Sem DNS automatico — mandar rodar `*bootstrap-2 cloudflare` no Ops e retomar |
| SSL nao emite | Conferir registro **DNS-only** (proxied=false) + `dig n8n.{dominio} +short` = IP. Esperar 1-2min (Let's Encrypt, rate limit 5/h — nao forcar) |
| cloud-init nao termina | `ssh ... 'cat /var/log/cloud-init-output.log'` pra diagnosticar; conferir `docker info` |
| Container n8n em loop | Senha Postgres igual no compose + `docker compose logs n8n` |
| Credentials "invalid" | Encryption key divergente — reusar a key do cofre, nao gerar outra |
| Aluno cola token/senha no chat | Cofre, nao repetir valor; se exposto, revogar e gerar outro |
| Aluno sem dominio quer pular SSL | Bloquear: webhook de plataforma exige https. Guiar compra no Cloudflare ou pausar (progresso salvo) |
