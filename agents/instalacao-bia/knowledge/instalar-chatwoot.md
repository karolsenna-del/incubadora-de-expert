# Instalar o Chatwoot self-hosted — guia do Preparador

> KB do `preparador`. Conduz o aluno a **subir o Chatwoot** (Community, grátis) na própria
> infra, do zero até o painel acessível por https com uma conta admin criada. É o **Passo 0.5**
> da jornada — vem antes das migrations e do inbox, porque o Chatwoot demora alguns minutos pra
> inicializar (dá pra deixar subindo e adiantar as migrations enquanto isso).
>
> **Não confundir** com o **Passo 3** (criar o *inbox* API + token) — aquele só acontece DEPOIS
> que o Chatwoot está no ar. Aqui o objetivo é só: **Chatwoot vivo, com https e login funcionando.**

---

## O que é e por que self-hosted

O Chatwoot é o **painel de atendimento humano** da Bia. Quando a Bia passa o bastão (handoff),
a conversa aparece lá pra você (ou seu time) responder pela mão. É o único componente **exclusivo
da Bia** que ainda não está de pé quando o aluno chega — por isso ele entra aqui dentro, e não
como pré-requisito (diferente do servidor/n8n/Supabase, que servem o negócio todo).

**Self-hosted (Community) e não Cloud:** é grátis, roda no mesmo servidor que o n8n, e faz tudo
que a Bia precisa (inbox API, conversas, handoff). O Cloud cobra por agente/mês e não traz vantagem
pro caso da Bia.

---

## Os 2 modos de instalar

O aluno é expert, não-dev. A instalação do Chatwoot mexe em servidor (Docker), então sempre
oferecer os dois caminhos — **nunca empurrar terminal goela abaixo**:

- **Modo A — eu subo pra você:** o aluno te dá acesso SSH ao servidor (ou roda os comandos que
  você dita, colando a saída de volta). Você executa os comandos, lê os logs, confirma cada etapa.
  Mais rápido, menos chance de erro de digitação. **Padrão recomendado.**
- **Modo B — em colaboração:** você explica cada comando, o aluno executa no terminal dele e cola
  o resultado. Você valida e segue. Mais lento, mas o aluno aprende e mantém o controle.

Em qualquer modo, **as senhas geradas vão pro cofre do aluno** — nunca ficam no chat.

---

## Pré-requisitos desta etapa (confirme ANTES de tocar no servidor)

Sem os 3, não dá pra subir o Chatwoot com https. Cheque um a um:

1. **Servidor com Docker + proxy reverso (Traefik) com SSL automático.** No servidor padrão da
   mentoria isso vem do **EasyPanel**, que cria uma rede Docker chamada `easypanel`. Confirma:
   ```bash
   docker network ls | grep -E "easypanel|traefik"
   ```
   - Apareceu `easypanel` (ou similar) → ok, o proxy existe. Anote o nome exato da rede.
   - Não apareceu nada → o servidor não tem proxy/SSL configurado. **Pare** e resolva isso no
     step de infra da mentoria antes de seguir (o n8n do aluno já deve usar esse mesmo proxy).

2. **Um subdomínio pro Chatwoot com DNS apontando pro servidor.** Ex.: `chatwoot.seudominio.com`.
   Crie um **registro A** no DNS apontando pro **IP do servidor** (o mesmo IP do n8n). Confirma a
   propagação:
   ```bash
   dig +short chatwoot.SEUDOMINIO.com    # tem que retornar o IP do servidor
   ```
   Se não retornar o IP, o SSL não vai emitir. Espere a propagação (minutos a algumas horas).

3. **Acesso ao servidor** — SSH (Modo A/B) ou, no mínimo, o aluno consegue abrir o terminal do
   servidor pelo painel. Sem acesso, não há como subir containers.

> Se algum falhar, **não improvise** — registra o que falta e devolve pro Chief. Infra-base é
> de um step anterior; aqui a gente só instala o Chatwoot em cima dela.

---

## Passo a passo

### 1. Escolher o domínio e gerar os 3 segredos

Decida o `{{CHATWOOT_DOMINIO}}` (ex.: `chatwoot.seudominio.com`) e gere as 3 senhas. No servidor
(ou na máquina do aluno):

```bash
echo "POSTGRES: $(openssl rand -hex 16)"
echo "REDIS:    $(openssl rand -hex 16)"
echo "SECRET:   $(openssl rand -hex 64)"
```

Manda os 3 pro **cofre** com rótulo claro (`CW_POSTGRES_PASSWORD`, `CW_REDIS_PASSWORD`,
`CW_SECRET_KEY_BASE`). Não cola no chat.

### 2. Colocar o compose no servidor e preencher

O template está em `data/kit/chatwoot/docker-compose.yml`. No servidor:

```bash
mkdir -p /opt/chatwoot
# copie o template pra /opt/chatwoot/docker-compose.yml
```

Abra `/opt/chatwoot/docker-compose.yml` e substitua os 4 placeholders:
- `{{CHATWOOT_DOMINIO}}` → seu subdomínio (aparece em 3 lugares: FRONTEND_URL e nos 2 labels)
- `{{CW_POSTGRES_PASSWORD}}`, `{{CW_REDIS_PASSWORD}}`, `{{CW_SECRET_KEY_BASE}}` → os 3 segredos

> Se a rede do proxy **não** se chama `easypanel` (você viu outro nome no pré-requisito 1), troque
> nos 2 lugares: na seção `networks:` lá embaixo e no label `traefik.docker.network`.

### 3. Subir os containers (1ª vez prepara o banco)

```bash
cd /opt/chatwoot
docker compose pull                                                   # baixa as imagens
docker compose run --rm chatwoot bundle exec rails db:chatwoot_prepare # 1ª vez: cria o schema
docker compose up -d                                                  # sobe os 4 containers
```

O `db:chatwoot_prepare` é o passo que mais gente esquece — sem ele o app sobe e reinicia em loop
porque o banco está vazio. Rode-o **uma vez**, na primeira instalação.

### 4. Esperar inicializar e conferir

O app demora ~1-3 min pra ficar de pé na primeira vez. Confira:

```bash
docker compose ps                          # os 4 containers devem ficar "Up" (db/redis "healthy")
docker compose logs -f chatwoot            # espere ver "Listening on http://0.0.0.0:3000" (Ctrl-C pra sair)
```

Se o container `chatwoot` ficar reiniciando (`Restarting`), vá pra seção **Solução de problemas**.

### 5. Conferir o SSL e abrir o painel

Abra no navegador: `https://{{CHATWOOT_DOMINIO}}`

- Carregou com **cadeado** (https válido) e mostrou a tela do Chatwoot → SSL ok. ✅
- Deu aviso de segurança / "não seguro" / 404 do Traefik → o certificado ainda não emitiu.
  Espere 1-2 min (o Traefik emite o Let's Encrypt no primeiro acesso) e recarregue. Se persistir,
  veja **Solução de problemas → SSL**.

### 6. Criar a conta admin (sua)

Na tela inicial, **crie sua conta** (o compose já vem com cadastro liberado pra isso):
- Nome, e-mail, senha forte → cria a conta e a primeira "Account" (sua empresa/marca).

> **Ponto a validar no ensaio:** dependendo da versão, a tela pode ser "Create an account" direto
> ou um onboarding inicial. Se a tela de cadastro **não** aparecer (cai direto no login sem opção
> de criar), é porque o cadastro veio fechado — nesse caso use o fallback em **Solução de problemas
> → criar admin pela linha de comando**.

Depois que sua conta existir e você conseguir logar:
- (Recomendado, segurança) no `docker-compose.yml`, troque `ENABLE_ACCOUNT_SIGNUP=true` → `false`
  e rode `docker compose up -d` de novo. Isso fecha o cadastro público — só você entra.

### 7. Fechado

Chatwoot **vivo**: https funcionando + login admin ok. **Não crie o inbox ainda** — isso é o
Passo 3 (`04-credentials.md`), e a gente faz depois das migrations, já com o `account_id`/`inbox_id`/
token indo direto pro cofre.

✅ **Critério desta etapa:** `https://{{CHATWOOT_DOMINIO}}` abre com cadeado e você loga como admin.

---

## Solução de problemas

**Diagnostique, não chute.** Uma mudança por vez, e re-teste depois de cada conserto.

### Container `chatwoot` reiniciando (`Restarting`)
Quase sempre é banco não preparado ou senha errada. Veja o log:
```bash
docker compose logs --tail=50 chatwoot
```
- `PG::ConnectionBad` / `password authentication failed` → a `CW_POSTGRES_PASSWORD` no `DATABASE_URL`
  não bate com a do `chatwoot-db`. Confira que as duas são idênticas no compose.
- `relation "..." does not exist` / erro de migration → você pulou o `db:chatwoot_prepare`. Rode-o
  (passo 3) e suba de novo.
- `Redis::CannotConnectError` → a `CW_REDIS_PASSWORD` no `REDIS_URL` não bate com a do `redis-server`.

### SSL não emite / "não seguro" / 404 do Traefik
- **DNS:** `dig +short {{CHATWOOT_DOMINIO}}` retorna o IP do servidor? Se não, é DNS — corrija o
  registro A e espere propagar.
- **Rede:** o serviço `chatwoot` está na rede do proxy? `docker network inspect easypanel` deve
  listar o container `chatwoot`. Se não, o nome da rede no compose está errado (veja pré-requisito 1).
- **Espera:** o Let's Encrypt emite no primeiro acesso https — dê 1-2 min e recarregue.

### A tela de criar conta não aparece (cadastro fechado) — criar admin pela linha de comando
Fallback oficial do Chatwoot (cria o usuário direto no banco). Rode no servidor:
```bash
docker compose -f /opt/chatwoot/docker-compose.yml exec chatwoot bundle exec rails console
```
No console que abrir, crie a conta e o usuário admin (ajuste nome/e-mail/senha):
```ruby
account = Account.create!(name: 'Minha Marca')
user = User.new(name: 'Seu Nome', email: 'voce@email.com', password: 'UmaSenhaForte123')
user.skip_confirmation!
user.save!
AccountUser.create!(account_id: account.id, user_id: user.id, role: :administrator)
exit
```
Depois logue normalmente em `https://{{CHATWOOT_DOMINIO}}`.
> Se algum nome de classe der erro nessa versão, **pare** — não fique chutando. Registra o erro e
> devolve pro Chief; melhor pedir o comando certo da versão do que inventar.

### "Porta 3000 já em uso" ou conflito com o n8n
O Chatwoot **não** publica porta no host (quem expõe é o Traefik via domínio). Se alguém adicionou
um `ports:` no compose, remova — o acesso é só pelo `https://{{CHATWOOT_DOMINIO}}`.

---

## Princípios (pro Preparador)

1. **Confirme os 3 pré-requisitos antes de tocar no servidor.** Subir sem DNS/proxy = SSL quebrado
   e meia hora perdida.
2. **Senha gerada vai pro cofre, na hora.** Nunca no chat, nunca "depois eu anoto".
3. **`db:chatwoot_prepare` uma vez, na primeira subida.** É a causa nº 1 de container reiniciando.
4. **Chatwoot vivo ≠ inbox criado.** Esta etapa entrega o painel no ar; o inbox é o Passo 3.
5. **Travou em algo que você não tem certeza (ex.: criar admin numa versão diferente)?** Não chuta —
   registra e devolve pro Chief. Honestidade > força bruta.
