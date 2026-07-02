# FASE 0 — Setup do Servidor (provisionamento automatico via API)

> Playbook do Bootstrap 3 para o Claude Code montar o servidor do aluno **via API**, sem painel.
> O aluno toca em 3 coisas (conta Hetzner + cartao, gerar 1 token, confirmar/comprar dominio);
> o Claude Code provisiona TODO o resto: cria o servidor via Hetzner API, instala Docker,
> configura DNS no Cloudflare, sobe Traefik (SSL Let's Encrypt) e o n8n queue mode.
>
> Sem EasyPanel. Sem UI de servidor. Baseado na infra Hetzner real da Arka — incluindo as
> armadilhas que ja quebraram na pratica, agora aplicadas automaticamente pelo Claude.
>
> NOTA: a conexao com a Meta Cloud API NAO e desta fase — pertence a instalacao da Bia
> (`/instalacaoBia`, passo seguinte da jornada, que reusa este servidor).

---

## Pre-requisitos (o Claude valida ANTES de comecar)

| Item | Como o Claude verifica | Se falhar |
|------|------------------------|-----------|
| **1Password (vault "Claude")** | `op vault list` lista o vault `Claude` | Fallback: `.env` local gitignored (ver Passo 1) |
| **Cloudflare conectado (MCP)** | `claude mcp list` mostra `cloudflare` | Apontar pro Bootstrap 2 (`*bootstrap-2 cloudflare`) — sem isso nao ha DNS automatico |
| **Conta Hetzner + cartao** | o aluno confirma que criou | Guiar criacao em hetzner.com (verificacao de identidade e normal) |
| **`ssh` + `openssl` no terminal** | `ssh -V` / `openssl version` | Padrao em macOS/Linux; no Windows usar WSL/Git Bash |

> Custo informado ANTES de qualquer compromisso: servidor CX23 ~€6,49/mes (~R$38) — checar o valor
> vigente ao provisionar, cobrado em euro no cartao.

---

## Passo 1 — Token da Hetzner no cofre (UNICO momento de UI guiada por print)

O aluno faz na interface da Hetzner, o Claude conduz por print de tela:

1. Hetzner Cloud Console → escolher/criar o **Projeto** → menu **Security** → aba **API Tokens**
2. **Generate API Token** → permissao **Read & Write** (acesso total ao projeto) → dar um nome (ex: `auroq`) → **Generate**
3. O token (`<longo>`) aparece **uma vez so** — copiar na hora

**Guardar o token (ordem de preferencia):**

- **(A — recomendado) 1Password:** o aluno cria, no vault **"Claude"**, um item chamado **`Hetzner`** com um campo **`token`** e cola o valor ali. O Claude le sem nunca exibir:
  ```bash
  export HCLOUD_TOKEN="$(op read "op://Claude/Hetzner/token")"
  ```
- **(B — fallback) `.env` local:** se o 1Password nao estiver conectado, o Claude cria `agents/bootstrap-3/data/.env` (gitignored) com `HCLOUD_TOKEN=...`. O aluno cola o valor no arquivo; o Claude referencia, nunca ecoa.

> Este e o fluxo (b) do Princípio do Cofre (`knowledge/principios-operacionais.md`, Princípio 1b): o
> que SO o aluno pode pegar num painel externo. O Claude orienta exatamente onde salvar, depois le do
> cofre e valida. Leitura **robusta**: aceita tanto o **campo nomeado** (`token`) quanto as **notas**
> do item — o aluno salva como preferir, o Claude se vira pra ler.

**Validar o token (sem imprimir o valor):**
```bash
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $HCLOUD_TOKEN" \
  https://api.hetzner.cloud/v1/servers
# Espera: 200. Se 401 → token errado/expirado. Se 403 → token e Read-only (precisa Read & Write).
```

> REGRA DE COFRE: o token nunca aparece no chat. Se o aluno colar no chat por engano, o Claude
> NAO repete o valor e orienta REVOGAR o token na Hetzner e gerar outro.

---

## Passo 2 — Escolher o dominio (Claude via Cloudflare MCP)

O Claude lista as zonas (dominios) do Cloudflare do aluno pela conexao MCP ja existente:

| Situacao | Acao |
|----------|------|
| Tem 1+ dominio | Mostrar a lista, confirmar com o aluno qual usar |
| Nao tem dominio | Orientar **comprar/adicionar um no Cloudflare** (Registrar do Cloudflare, ou apontar nameservers de um dominio existente). Pausar a fase ate ter o dominio — retomar depois |

Definido o dominio `{DOMINIO}`, os subdominios desta fase sao:
- `n8n.{DOMINIO}` — editor do n8n
- `webhook.{DOMINIO}` — endpoint de webhooks (entrada das automacoes)

---

## Passo 3 — Provisionar o servidor (Claude via Hetzner API)

### 3.1 — Gerar e registrar a SSH key
```bash
ssh-keygen -t ed25519 -f ~/.ssh/auroq-hetzner -N "" -C "auroq-bootstrap3"
PUBKEY="$(cat ~/.ssh/auroq-hetzner.pub)"

curl -s -X POST https://api.hetzner.cloud/v1/ssh_keys \
  -H "Authorization: Bearer $HCLOUD_TOKEN" -H "Content-Type: application/json" \
  -d "{\"name\":\"auroq-bootstrap3\",\"public_key\":\"$PUBKEY\"}"
```
> Registrar a referencia da chave no 1Password (item `Hetzner`, campo `ssh_key_path` = `~/.ssh/auroq-hetzner`). A chave PRIVADA fica so na maquina do aluno.

### 3.2 — Criar o servidor com cloud-init (Docker ja instalado no boot)

Cloud-init (`user_data`) que ja resolve a **armadilha do DNS do Docker** e instala o Docker:
```yaml
#cloud-config
write_files:
  - path: /etc/docker/daemon.json
    content: |
      { "dns": ["8.8.8.8", "1.1.1.1"] }
runcmd:
  - curl -fsSL https://get.docker.com | sh
  - systemctl enable --now docker
  - systemctl restart docker
  - touch /root/.cloud-init-done
```

> ANTES de criar: nao hardcodar o tipo. O `cx22` foi descontinuado. Listar `GET /v1/server_types`,
> filtrar os **NAO-deprecated** com ~2vCPU/4GB e escolher o equivalente atual (hoje `cx23`). Ver
> Princípio 2 em `knowledge/principios-operacionais.md`.
> ```bash
> curl -s -H "Authorization: Bearer $HCLOUD_TOKEN" \
>   https://api.hetzner.cloud/v1/server_types | \
>   python3 -c "import sys,json; [print(t['name'], t['cores'],'vCPU', int(t['memory']),'GB', 'DEPRECATED' if t['deprecation'] else 'ok') for t in json.load(sys.stdin)['server_types'] if t['cores']==2 and t['memory']==4]"
> ```

Criar o servidor (CX23, Ubuntu 22.04, Helsinki):
```bash
curl -s -X POST https://api.hetzner.cloud/v1/servers \
  -H "Authorization: Bearer $HCLOUD_TOKEN" -H "Content-Type: application/json" \
  -d @- <<'JSON'
{
  "name": "auroq-prod",
  "server_type": "cx23",
  "image": "ubuntu-22.04",
  "location": "hel1",
  "ssh_keys": ["auroq-bootstrap3"],
  "user_data": "#cloud-config\nwrite_files:\n  - path: /etc/docker/daemon.json\n    content: |\n      { \"dns\": [\"8.8.8.8\", \"1.1.1.1\"] }\nruncmd:\n  - curl -fsSL https://get.docker.com | sh\n  - systemctl enable --now docker\n  - systemctl restart docker\n  - touch /root/.cloud-init-done\n"
}
JSON
```
Pegar o IP quando ficar `running`:
```bash
curl -s -H "Authorization: Bearer $HCLOUD_TOKEN" \
  https://api.hetzner.cloud/v1/servers | \
  python3 -c "import sys,json; s=json.load(sys.stdin)['servers'][0]; print(s['status'], s['public_net']['ipv4']['ip'])"
```
> Anotar o IP no tracker. `server_type`/`location` configuraveis: CX32 (~€8) se precisar mais; `fsn1`/`nbg1` alternativas na Europa.

---

## Passo 4 — DNS no Cloudflare (Claude via MCP)

O Claude cria os registros A na zona do aluno, **modo DNS-only (proxied=false)** — obrigatorio pro
Traefik emitir o certificado por HTTP-challenge (se ficar "proxied"/nuvem laranja, o Cloudflare
intercepta a porta 80 e o Let's Encrypt do Traefik nao valida):

| Nome | Tipo | Conteudo | Proxy |
|------|------|----------|-------|
| `n8n` | A | `{IP}` | **DNS only** (cinza) |
| `webhook` | A | `{IP}` | **DNS only** (cinza) |

> Feito via Cloudflare MCP (create dns_record, proxied=false). Propagacao com proxy desligado e quase imediata.

---

## Passo 5 — Subir o stack via SSH (Traefik + n8n queue mode)

### 5.1 — Esperar o cloud-init terminar
```bash
SSH="ssh -i ~/.ssh/auroq-hetzner -o StrictHostKeyChecking=accept-new -o ConnectTimeout=10 root@{IP}"
# Polling com tolerancia: boot + cloud-init (instalar Docker) leva alguns minutos. "Demorar" e normal.
for i in $(seq 1 60); do   # ~10 min de tolerancia (60 x 10s)
  if $SSH 'test -f /root/.cloud-init-done && docker info >/dev/null 2>&1'; then
    echo "pronto: cloud-init done + docker no ar"; break
  fi
  echo "($i/60) ainda subindo, normal — aguardando o boot/cloud-init terminar..."; sleep 10
done
```
> Espera honesta (Princípio 6 em `knowledge/principios-operacionais.md`): o timeout do polling
> sozinho NAO e prova de falha. So declarar falha depois de confirmar o estado REAL — SSH responde?
> `cat /var/log/cloud-init-output.log` mostra erro de verdade? Se o SSH ja conecta mas o
> `.cloud-init-done` ainda nao apareceu, e "ainda subindo", nao "falhou".

### 5.2 — Gerar segredos e guardar no cofre (NA HORA)
```bash
PG_PASS="$(openssl rand -hex 24)"
N8N_KEY="$(openssl rand -hex 16)"
```
Salvar no 1Password (vault `Claude`) — **antes de subir** (fluxo (a) do Cofre, Princípio 1a em
`knowledge/principios-operacionais.md`: o que o squad GERA vai pro cofre automatico, com o prefixo
do projeto):
- item `{Prefixo} - n8n Postgres` → campo `password` = `$PG_PASS`
- item `{Prefixo} - n8n Encryption Key` → campo `key` = `$N8N_KEY`

> A encryption key e a MESMA nos 3 services do n8n. **Perdeu a key = todas as credentials do n8n morrem** (criptografia, sem recuperacao). Por isso vai pro cofre antes de qualquer coisa.

### 5.3 — docker-compose (Traefik standalone + n8n queue mode)

O Claude gera `/opt/n8n/docker-compose.yml` no servidor com os valores ja substituidos
(`{DOMINIO}`, `{EMAIL}` do aluno, `$PG_PASS`, `$N8N_KEY`). Estrutura:

> VERSOES (Princípio 2): antes de subir, conferir a release estavel ATUAL de cada imagem (Traefik,
> n8n, Postgres, Redis) e pinnar versoes recentes e **compativeis entre si** — nao reusar versoes
> velhas hardcodadas. O `traefik:v3.6.1` abaixo ja e o pin recente que resolve o Docker 29 (Armadilha 7).

```yaml
services:
  traefik:
    image: traefik:v3.6.1   # >=3.6.1 obrigatorio: Docker 29 exige API >=1.40; Traefik <3.6.1 fixa 1.24 e quebra (ver Armadilha 7)
    restart: always
    command:
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --entrypoints.web.address=:80
      - --entrypoints.web.http.redirections.entrypoint.to=websecure
      - --entrypoints.web.http.redirections.entrypoint.scheme=https
      - --entrypoints.websecure.address=:443
      - --certificatesresolvers.le.acme.httpchallenge=true
      - --certificatesresolvers.le.acme.httpchallenge.entrypoint=web
      - --certificatesresolvers.le.acme.email={EMAIL}
      - --certificatesresolvers.le.acme.storage=/letsencrypt/acme.json
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik_le:/letsencrypt
    networks: [n8n-net]

  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_DB: n8n
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: {PG_PASS}
    volumes: [postgres_data:/var/lib/postgresql/data]
    networks: [n8n-net]
    healthcheck: { test: ["CMD-SHELL","pg_isready -U n8n"], interval: 10s, timeout: 5s, retries: 5 }

  redis:
    image: redis:7-alpine
    restart: always
    volumes: [redis_data:/data]
    networks: [n8n-net]
    healthcheck: { test: ["CMD","redis-cli","ping"], interval: 10s, timeout: 5s, retries: 5 }

  n8n:
    image: n8nio/n8n:latest
    restart: always
    environment: &n8n_env
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD={PG_PASS}
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
      - N8N_ENCRYPTION_KEY={N8N_KEY}
      - N8N_HOST=n8n.{DOMINIO}
      - N8N_PROTOCOL=https
      - N8N_PROXY_HOPS=1   # n8n atras do Traefik: identifica o IP real do cliente (sem isso, ValidationError de trust proxy)
      - WEBHOOK_URL=https://webhook.{DOMINIO}/
      - GENERIC_TIMEZONE=America/Sao_Paulo
      - N8N_DEFAULT_BINARY_DATA_MODE=filesystem
      - NODE_FUNCTION_ALLOW_BUILTIN=*
      - NODE_FUNCTION_ALLOW_EXTERNAL=*
    volumes: [n8n_data:/home/node/.n8n]
    depends_on:
      postgres: { condition: service_healthy }
      redis: { condition: service_healthy }
    networks: [n8n-net]
    labels:
      - traefik.enable=true
      - traefik.http.routers.n8n.rule=Host(`n8n.{DOMINIO}`)
      - traefik.http.routers.n8n.entrypoints=websecure
      - traefik.http.routers.n8n.tls.certresolver=le
      - traefik.http.services.n8n.loadbalancer.server.port=5678

  n8n-worker:
    image: n8nio/n8n:latest
    restart: always
    command: worker --concurrency=10
    environment: *n8n_env
    volumes: [n8n_data:/home/node/.n8n]
    depends_on:
      postgres: { condition: service_healthy }
      redis: { condition: service_healthy }
    networks: [n8n-net]

  n8n-webhook:
    image: n8nio/n8n:latest
    restart: always
    command: webhook
    environment: *n8n_env
    volumes: [n8n_data:/home/node/.n8n]
    depends_on:
      postgres: { condition: service_healthy }
      redis: { condition: service_healthy }
    networks: [n8n-net]
    labels:
      - traefik.enable=true
      - traefik.http.routers.n8n-webhook.rule=Host(`webhook.{DOMINIO}`)
      - traefik.http.routers.n8n-webhook.entrypoints=websecure
      - traefik.http.routers.n8n-webhook.tls.certresolver=le
      - traefik.http.services.n8n-webhook.loadbalancer.server.port=5678

volumes: { postgres_data: {}, redis_data: {}, n8n_data: {}, traefik_le: {} }
networks: { n8n-net: { driver: bridge } }
```

> Diferenca-chave vs versao antiga: o **Traefik vem embutido** (substitui o EasyPanel). Sem
> `network easypanel external`. O `WEBHOOK_URL` separado garante que o webhook entra pelo
> service dedicado (queue mode) — compra nunca se perde por alguem mexer no editor.

### 5.4 — Subir
```bash
$SSH 'cd /opt/n8n && docker compose up -d'
```
Aguardar ~1-2 min (Traefik emite o cert na primeira request).

### 5.5 — Criar a conta owner do n8n via API (automatico — o aluno NAO digita nada)

O squad cria a conta owner do n8n **via API** — o aluno nao acessa o editor pra cadastrar nada.

1. Confirmar com o aluno o **e-mail** do owner (so isso; o resto e automatico).
2. Gerar uma **senha forte** (ex: `openssl rand -base64 24`) — o squad gera, o aluno nao escolhe.
3. Salvar no cofre NA HORA (fluxo (a) do Cofre, Princípio 1a): item **`{Prefixo} - n8n Admin`**
   (vault `Claude`) com `login` (e-mail), `password` (senha gerada) e `url` (`https://n8n.{DOMINIO}`).
4. Criar o owner via API:
   ```bash
   curl -s -X POST https://n8n.{DOMINIO}/rest/owner/setup \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"$OWNER_EMAIL\",\"firstName\":\"$OWNER_FIRST\",\"lastName\":\"$OWNER_LAST\",\"password\":\"$OWNER_PASS\"}"
   ```
   `$OWNER_PASS` vem do passo 2 (lido do cofre com `op read`), nunca aparece no chat.

---

## Passo 6 — Validar (gate QG-B3-001)

```bash
# SSL + editor no ar (cadeado valido = sem -k)
curl -s -o /dev/null -w "n8n: HTTP %{http_code} | SSL verify: %{ssl_verify_result} (0=ok)\n" https://n8n.{DOMINIO}

# Webhook respondendo via https (NAO usar /webhook-test/ — em queue mode ele nao funciona;
# aqui ainda nao ha workflow, entao o objetivo e so provar roteamento Traefik->n8n-webhook + SSL)
curl -s -o /dev/null -w "webhook: HTTP %{http_code}\n" -X POST \
  https://webhook.{DOMINIO}/webhook/ping \
  -H "Content-Type: application/json" -d '{"ok":true}'
```
- `n8n.{DOMINIO}` responde **200** com cadeado (cert Let's Encrypt valido, `ssl_verify_result=0`)
- conta owner do n8n criada via API pelo squad (item `{Prefixo} - n8n Admin` no cofre); login validado
- `webhook.{DOMINIO}` **responde via https com cadeado** — um **HTTP 404 do n8n e ESPERADO e valido** aqui (nao ha workflow ainda; o 404 prova que o Traefik roteia pro processo n8n-webhook e o SSL ta certo). O que NAO pode e nao responder / erro de SSL.

---

## Armadilhas conhecidas (agora aplicadas automaticamente pelo Claude)

### 1. Module 'https' is disallowed
Code nodes que usam `require('https'/'crypto'/'url')` falham. **Fix (ja no compose):**
`NODE_FUNCTION_ALLOW_BUILTIN=*` + `NODE_FUNCTION_ALLOW_EXTERNAL=*` nos 3 services do n8n.

### 2. DNS do Docker
Containers nao resolvem dominios externos. **Fix (ja no cloud-init):** `/etc/docker/daemon.json`
com `8.8.8.8`/`1.1.1.1` antes de instalar o Docker.

### 3. Registro Cloudflare "proxied" quebra o SSL
Se o registro A ficar com proxy ligado (nuvem laranja), o Cloudflare intercepta a porta 80 e o
HTTP-challenge do Traefik nao valida — o cert nunca emite. **Fix:** criar os registros como
**DNS-only** (proxied=false). Esta no Passo 4.

### 4. Encryption Key diferente = credentials perdidas
A `N8N_ENCRYPTION_KEY` precisa ser a MESMA nos 3 services e NUNCA mudar. Esta no cofre. Se
recriar o stack, reusar a key do 1Password — nao gerar outra.

### 5. SSL demora na primeira vez
Let's Encrypt leva ~1-2 min pra emitir e tem rate limit (5 certs/dominio/hora). **Nao ficar
forcando** — esperar. Se estourar o limite, esperar 1 hora. Conferir DNS: `dig n8n.{DOMINIO} +short` retorna o IP.

### 6. Traefik nao precisa de "force update"
Com Traefik standalone + provider Docker, ele re-descobre as rotas sozinho quando os containers
reiniciam. O antigo `docker service update --force traefik` era especifico do EasyPanel/Swarm —
nao se aplica aqui. Se uma rota sumir: `docker compose restart traefik`.

### 7. Docker 29 quebra Traefik antigo ("client version 1.24 is too old")
O `get.docker.com` instala o Docker mais recente (29.x), que **exige API >= 1.40**. O Traefik v3.1
fixa a versao de client em 1.24 e e rejeitado pelo daemon — o log enche de `Error response from
daemon: client version 1.24 is too old` e o provider Docker nunca carrega: sem rotas, sem SSL,
n8n responde `HTTP 000`. A env `DOCKER_API_VERSION` **NAO resolve** (o Traefik nao le essa env).
**Fix (ja no compose):** usar `traefik:v3.6.1` ou superior — a partir do 3.6.1 o Traefik negocia
a versao da API automaticamente. Confirmado: issue oficial traefik/traefik#12253.
(Validado em campo no setup do aluno Arsenal Trader, 27/06/2026.)

---

## Custos

| Plano Hetzner | vCPU | RAM | Disco | Preco |
|---------------|------|-----|-------|-------|
| CX23 | 2 | 4 GB | 40 GB | ~€6,49/mes (~R$38)* |
| CX32 | 4 | 8 GB | 80 GB | ~€8/mes |
| CX43 | 8 | 16 GB | 160 GB | ~€14/mes |

*Checar o valor vigente ao provisionar (precos da Hetzner mudam). O `cx22` foi descontinuado — usar
o equivalente atual nao-deprecated com ~2vCPU/4GB (hoje `cx23`; ver Passo 3.2 e Princípio 2).

Para 1 aluno iniciante, CX23 e suficiente. Escalar via API depois (`PUT /v1/servers/{id}/actions/change_type`) se precisar.

---

## Seguranca pos-setup

- O **token Hetzner Read&Write** e poderoso (cria/destroi servidores). Fica no 1Password, referenciado por `op read`. Se vazar em qualquer lugar: revogar na Hetzner (Security → API Tokens → revoke) e gerar outro.
- Senha do Postgres + encryption key do n8n: no vault `Claude`, nunca em texto plano no repo.
- O `.env` de fallback (se usado) e gitignored — confirmar que `data/.env` esta no `.gitignore` do squad.

---

## Checklist final da FASE 0 (gate QG-B3-001)

- [ ] Token Hetzner validado (HTTP 200 na API) e guardado no cofre (1Password vault `Claude`, ou `.env` fallback)
- [ ] Servidor CX23 (equivalente atual ~2vCPU/4GB, nao-deprecated) criado via API, Docker no ar (cloud-init concluido), IP no tracker
- [ ] DNS no Cloudflare: `n8n.` e `webhook.` apontando pro IP, **DNS-only**
- [ ] n8n editor em `https://n8n.{DOMINIO}` com cadeado (SSL valido) + owner criado via API (item `{Prefixo} - n8n Admin` no cofre) + login OK
- [ ] Webhook de teste respondendo HTTP 200
- [ ] Cofre contem: token Hetzner · senha Postgres · encryption key n8n · senha admin n8n · caminho da SSH key
- [ ] Tracker atualizado (`business/infra/bootstrap3-tracker.md`)

> Com os checks ✅, o @operador-infra reporta o gate ao @b3-chief.
> Proximo passo da jornada: FASE 1 — banco de dados unificado.
