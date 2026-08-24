---
task: "Execute Mission"
responsavel: "@insta-scheduler"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Slug do carrossel a agendar (ou pasta identificada na fila)"
Saida: "Carrossel agendado no Instagram + log atualizado + pasta movida"
Checklist:
  - "Pasta validada (slides + legenda.txt)"
  - "Slides enviados para o Cloudinary"
  - "URLs públicas obtidas"
  - "Próximo dia livre identificado na Meta API"
  - "Carrossel agendado"
  - "Resumo exibido"
  - "Log atualizado"
  - "Pasta movida para agendados/"
execution_type: "sequential"
---

# Task: Execute Mission — Agendar Carrossel no Instagram

## Objetivo

Executar o pipeline completo de agendamento: validar → upload → consultar → agendar → documentar.

## Trigger

`*mission`, `*agenda {slug}`, ou qualquer instrução de agendamento.

## Pré-condições

- Vault carregado com token Meta e credenciais Cloudinary
- Pasta `business/instagram/fila/{slug}/` existe

---

## Passos

### Step 1: Identificar e Validar Pasta

1. Identificar o slug do carrossel (informado pelo usuário ou único na fila)
2. Verificar se pasta existe: `business/instagram/fila/{slug}/`
3. Listar arquivos da pasta
4. Validar presença de:
   - `legenda.txt` → SE ausente: **PARAR** — "Falta o arquivo `legenda.txt` na pasta `{slug}`. O agente de conteúdo precisa gerar esse arquivo antes de agendar."
   - Pelo menos 2 slides (`slide-01.png`, `slide-02.png`) → SE ausente: **PARAR** — "Slides insuficientes na pasta `{slug}`."
5. Listar slides em ordem alfabética: `slide-01.png`, `slide-02.png`, ...
6. Ler conteúdo de `legenda.txt`

**Confirmar antes de prosseguir:**
```
Vou agendar `{slug}`.
  Slides: {N} imagens encontradas
  Legenda: "{primeiros 80 chars}..."

Confirma?
```

### Step 2: Upload dos Slides para o Cloudinary

Usar credenciais do Vault (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).

Para cada slide (em ordem: slide-01, slide-02, ...):

```python
import hashlib, time

timestamp = int(time.time())
public_id = f"{slug}-slide-{i+1:02d}"

# Gerar assinatura (SHA1 do params + api_secret)
signature_str = f"public_id={public_id}&timestamp={timestamp}{CLOUDINARY_API_SECRET}"
signature = hashlib.sha1(signature_str.encode()).hexdigest()

# Upload autenticado
POST https://api.cloudinary.com/v1_1/{CLOUDINARY_CLOUD_NAME}/image/upload
Body (multipart/form-data):
  file: <binary content do slide>
  public_id: {public_id}
  api_key: {CLOUDINARY_API_KEY}
  timestamp: {timestamp}
  signature: {signature}

# Resposta: {"secure_url": "https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.png"}
url = response["secure_url"]
```

Coletar lista de URLs: `[url_slide01, url_slide02, ...]`

**SE upload falhar:**
- Tentar novamente 1x
- SE falhar novamente: PARAR — "Falha no upload do slide {N} para o Cloudinary. Erro: {mensagem}. Verifique as credenciais no vault."

### Step 3: Consultar Meta API — Próximo Dia Livre

```python
# Listar posts agendados (próximos 30 dias)
GET https://graph.instagram.com/v21.0/{IG_USER_ID}/media
Params:
  fields: timestamp,permalink
  access_token: {META_TOKEN}
```

Filtrar posts com `published=false` ou `scheduled_publish_time` no futuro.

**Lógica de próximo dia livre:**
1. Mapear dias com post já agendado
2. Começar de amanhã (D+1)
3. Iterar até encontrar dia sem post
4. Resultado: `{YYYY-MM-DD}T12:00:00-03:00` (12h BRT = UTC-3)
5. Converter para Unix timestamp: `scheduled_ts`

### Step 4: Agendar Carrossel via Meta Graph API

**Passo 4a: Criar container para cada slide**

```python
for i, url in enumerate(slide_urls):
    POST https://graph.instagram.com/v21.0/{IG_USER_ID}/media
    Params:
      image_url: {url}
      is_carousel_item: true
      access_token: {META_TOKEN}
    # Resposta: {"id": "container_id_N"}
```

Coletar IDs: `[container_id_1, container_id_2, ...]`

**Passo 4b: Criar container pai do carrossel**

```python
POST https://graph.instagram.com/v21.0/{IG_USER_ID}/media
Params:
  media_type: CAROUSEL
  children: {container_id_1},{container_id_2},...
  caption: {conteudo de legenda.txt}
  published: false
  scheduled_publish_time: {scheduled_ts}
  access_token: {META_TOKEN}
# Resposta: {"id": "carousel_id"}
```

**Passo 4b.1: Aguardar container ficar FINISHED (OBRIGATÓRIO)**

A Meta processa os containers de forma assíncrona (busca as imagens no Cloudinary). Chamar `media_publish` sem esperar causa erro intermitente 9007 ("Media ID is not available") — falha de corrida, não de conteúdo.

```python
import time

for tentativa in range(20):
    r = requests.get(f"{BASE}/{carousel_id}", params={"fields": "status_code", "access_token": TOKEN})
    status = r.json().get("status_code", "UNKNOWN")
    if status == "FINISHED":
        break
    if status == "ERROR":
        raise RuntimeError("Container falhou com status ERROR")
    time.sleep(5)
else:
    raise RuntimeError("Container não ficou FINISHED após 100s")
```

Todo `post-{slug}.yml` gerado a partir desta task DEVE incluir este passo entre a criação do container do carrossel e o `media_publish`. Sem exceção.

**Passo 4c: Publicar (agendar)**

```python
POST https://graph.instagram.com/v21.0/{IG_USER_ID}/media_publish
Params:
  creation_id: {carousel_id}
  access_token: {META_TOKEN}
# Resposta: {"id": "media_id"} — post agendado com sucesso
```

**SE qualquer chamada Meta API falhar:**
- PARAR imediatamente
- Não mover pasta
- Reportar: erro HTTP, mensagem da API, step que falhou

### Step 5: Exibir Resumo

```
=== AGENDADO ✓ ===

Carrossel: {slug}
Data: {DD/MM/YYYY} às 12h00 (BRT)
Slides: {N} imagens
Legenda: "{primeiros 100 chars}..."
Media ID: {media_id}
```

### Step 6: Atualizar Log

Adicionar linha em `business/instagram/agendamentos.md`:

```
| {DD/MM/YYYY} | {slug} | {data-agendada} 12h | {media_id} | ✓ |
```

### Step 7: Mover Pasta

```
business/instagram/fila/{slug}/ → business/instagram/agendados/{slug}/
```

### Step 8: PDSA

1. **Plan:** Agendar `{slug}` para {data} às 12h
2. **Do:** Upload {N} slides + agendamento via Meta API
3. **Study:** Bateu? Algo demorou mais que esperado? Erro de URL do Cloudinary?
4. **Act:** SE URL do Cloudinary causou problema → atualizar Rules. SE processo novo → criar SOP.

---

## SOP-001: Renovar Token Meta

**Trigger:** token expira em < 5 dias OU erro 190 da Meta API

**CORRIGIDO 24/08/2026:** `META_TOKEN` é da família Facebook Login (prefixo `EAA`, usado via
`graph.facebook.com` nos workflows de publicação) — o endpoint `graph.instagram.com/refresh_access_token`
com `ig_refresh_token` (versão antiga deste SOP) retorna erro 190 "Cannot parse access token" pra
esse tipo de token — só serve pra token da família Instagram Login (ex: `IG_INSIGHTS_TOKEN`).

```python
GET https://graph.facebook.com/v21.0/oauth/access_token
Params:
  grant_type: fb_exchange_token
  client_id: {META_APP_ID}
  client_secret: {META_APP_SECRET}
  fb_exchange_token: {META_TOKEN_ATUAL}
# Resposta: {"access_token": "novo_token", "token_type": "bearer", "expires_in": segundos}
```

Atualizar `META_TOKEN` e `META_TOKEN_EXPIRES` (data de hoje + expires_in segundos) no Vault
**e** no GitHub Secret `META_TOKEN` (`gh secret set META_TOKEN`) após renovação.

---

## Error Handling

| Cenário | Código Meta | Ação |
|---------|------------|------|
| Token expirado | 190 | Executar SOP-001 (renovar) e tentar novamente |
| URL inválida (Cloudinary) | 100 | Verificar se upload completou com sucesso. Checar secure_url na resposta. Tentar re-upload do slide. |
| Rate limit | 4 / 32 | Aguardar 60s e tentar novamente (máx 2x) |
| Post já existe no dia | — | Pegar próximo dia disponível |
| Carrossel > 10 slides | — | PARAR — "Carrossel `{slug}` tem {N} slides. Instagram aceita no máximo 10." |
| legenda.txt vazio | — | PARAR — "Arquivo `legenda.txt` está vazio em `{slug}`." |
