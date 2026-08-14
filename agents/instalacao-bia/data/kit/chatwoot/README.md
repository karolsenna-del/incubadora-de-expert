# Chatwoot self-hosted — pasta do kit

O Chatwoot é o painel onde **você (ou seu time) assume conversas humanas** quando a Bia
passa o bastão (handoff). É **gratuito** (versão Community) e roda na sua própria infra.

> O passo a passo guiado, com os 2 modos (o agente sobe pra você / você sobe em colaboração),
> verificações e solução de problemas, está em **`knowledge/instalar-chatwoot.md`** do squad.
> Aqui é só a referência rápida do template.

## Os 4 valores que você troca no `docker-compose.yml`

| Placeholder | O que é | Como gerar/obter |
|---|---|---|
| `{{CHATWOOT_DOMINIO}}` | subdomínio do painel | ex.: `chatwoot.seudominio.com` — crie um **registro DNS A** apontando pro IP do servidor |
| `{{CW_POSTGRES_PASSWORD}}` | senha do banco | `openssl rand -hex 16` |
| `{{CW_REDIS_PASSWORD}}` | senha do redis | `openssl rand -hex 16` |
| `{{CW_SECRET_KEY_BASE}}` | chave de criptografia do Chatwoot | `openssl rand -hex 64` |

> Anote os 4 no seu **cofre** (não no chat). Eles ficam só no `docker-compose.yml` do servidor.

## Subir (resumo — detalhes no guia)

```bash
# no servidor, dentro de /opt/chatwoot/ com o compose já preenchido:
docker compose pull
docker compose run --rm chatwoot bundle exec rails db:chatwoot_prepare   # 1ª vez: prepara o banco
docker compose up -d
docker compose ps                                                        # 4 containers "Up/healthy"
```

Depois: abra `https://{{CHATWOOT_DOMINIO}}`, crie sua conta admin (a 1ª pela tela de cadastro),
e siga pro **Passo 3** (criar o inbox API + token) — esse passo é o `04-credentials.md`.

## Por que essas escolhas

- **`pgvector/pgvector:pg16`** (e não Postgres comum): o Chatwoot v4 usa busca vetorial.
- **Versão fixada `v4.3.0`** (e não `latest`): é a validada com a Bia. Atualizar é decisão sua, depois.
- **Rede `easypanel` externa**: é onde mora o Traefik que faz o SSL automático. No servidor padrão
  da mentoria essa rede já existe (EasyPanel). Se o seu proxy tem outro nome, ajuste no compose.
