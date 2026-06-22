# Instagram Scheduler — Foundation KB

> Conhecimento técnico do domínio. Carregado sob demanda antes de missões.
> Cresce a cada pesquisa e missão executada.

---

## 1. META GRAPH API — INSTAGRAM CONTENT PUBLISHING

### 1.1 Visão Geral

**API:** Meta Graph API v21.0
**Documentação:** https://developers.facebook.com/docs/instagram-platform/content-publishing/
**Base URL:** `https://graph.instagram.com/v21.0/`

**Pré-requisitos:**
- Conta Instagram Business ou Creator
- App Meta aprovado com permissão `instagram_content_publish`
- Long-lived Access Token (válido 60 dias)
- Instagram User ID (`IG_USER_ID`)

**Rate Limits:**
- Máximo 100 posts publicados via API em 24h (moving window)
- Carrossel conta como 1 post
- Verificar: `GET /{IG_USER_ID}/content_publishing_limit`

---

### 1.2 Flow Completo de Agendamento de Carrossel

**3 steps obrigatórios:**

#### Step 1: Criar containers dos slides

```
POST https://graph.instagram.com/v21.0/{IG_USER_ID}/media
```

Parâmetros (por slide):
```
image_url      = {url pública HTTPS do slide}
is_carousel_item = true
access_token   = {META_TOKEN}
```

Resposta: `{"id": "17889615814797797"}` (container_id)

Repetir para cada slide. Coletar todos os container_ids.

**Limitações dos slides:**
- Máximo 10 slides por carrossel
- Formato: JPEG ou PNG
- Tamanho mínimo: 320x320px
- Tamanho máximo: 1440px (lado mais longo)
- Aspect ratio: 1:1 (quadrado) recomendado, suporta 4:5 e 16:9
- Tamanho do arquivo: máximo 8MB por imagem

#### Step 2: Criar container pai do carrossel

```
POST https://graph.instagram.com/v21.0/{IG_USER_ID}/media
```

Parâmetros:
```
media_type             = CAROUSEL
children               = {container_id_1},{container_id_2},...
caption                = {texto da legenda}
published              = false
scheduled_publish_time = {unix_timestamp}
access_token           = {META_TOKEN}
```

Resposta: `{"id": "carousel_id"}`

**Sobre o scheduled_publish_time:**
- Deve ser Unix timestamp (segundos desde epoch)
- Mínimo: 10 minutos no futuro
- Máximo: 75 dias no futuro
- Para 12h BRT (UTC-3): `datetime(ano, mes, dia, 15, 0, 0)` em UTC = 12h em Brasília

**Converter para Unix timestamp (Python):**
```python
from datetime import datetime, timezone, timedelta

BRT = timezone(timedelta(hours=-3))
scheduled_dt = datetime(2026, 6, 25, 12, 0, 0, tzinfo=BRT)
scheduled_ts = int(scheduled_dt.timestamp())
```

#### Step 3: Publicar (agendar)

```
POST https://graph.instagram.com/v21.0/{IG_USER_ID}/media_publish
```

Parâmetros:
```
creation_id  = {carousel_id}
access_token = {META_TOKEN}
```

Resposta: `{"id": "media_id"}` — post está agendado.

---

### 1.3 Listar Posts Agendados

```
GET https://graph.instagram.com/v21.0/{IG_USER_ID}/media
```

Parâmetros:
```
fields       = id,timestamp,media_type,permalink
access_token = {META_TOKEN}
```

Para filtrar agendados (não publicados ainda), verificar `timestamp` no futuro.

**Alternativa — verificar via Content Publishing Limit:**
```
GET https://graph.instagram.com/v21.0/{IG_USER_ID}/content_publishing_limit
Params: fields=quota_usage
```

---

### 1.4 Códigos de Erro Meta API

| Código | Significado | Solução |
|--------|-------------|---------|
| 190 | Token inválido ou expirado | Renovar token (SOP-001) |
| 100 | Parâmetro inválido (geralmente image_url inacessível) | Verificar URL pública |
| 32 | Rate limit de publicação | Aguardar 60s, tentar novamente |
| 4 | Rate limit de chamadas | Aguardar e tentar novamente |
| 10 | Permissão insuficiente | Verificar se app tem `instagram_content_publish` |
| 36000 | scheduled_publish_time inválido | Verificar se é futuro e formato Unix |
| 9007 | Carrossel com menos de 2 itens | Verificar se todos os containers foram criados |

---

## 2. TOKEN MANAGEMENT

### 2.1 Tipos de Token

| Tipo | Validade | Quando usar |
|------|----------|-------------|
| Short-lived | 1-2 horas | Apenas durante OAuth |
| Long-lived | 60 dias | Operação normal do worker |

### 2.2 Obter Long-lived Token (primeira vez)

1. Gerar short-lived token via Facebook Login (Karol faz manualmente)
2. Trocar por long-lived:

```
GET https://graph.instagram.com/access_token
Params:
  grant_type        = ig_exchange_token
  client_id         = {APP_ID}
  client_secret     = {APP_SECRET}
  access_token      = {SHORT_LIVED_TOKEN}
```

Resposta: `{"access_token": "...", "token_type": "bearer", "expires_in": 5183944}`

### 2.3 Renovar Long-lived Token (SOP-001)

**Quando:** Token com menos de 5 dias para expirar OU erro 190.

```
GET https://graph.instagram.com/refresh_access_token
Params:
  grant_type   = ig_refresh_token
  access_token = {LONG_LIVED_TOKEN_ATUAL}
```

Resposta: `{"access_token": "novo_token", "token_type": "bearer", "expires_in": 5184000}`

**Salvar novo token no Vault imediatamente.**

**Regra:** Verificar validade do token em TODA ativação do worker.

---

## 3. GOOGLE DRIVE API

### 3.1 Visão Geral

**Documentação:** https://developers.google.com/drive/api/v3/reference
**Base URL:** `https://www.googleapis.com/`
**Autenticação:** Service Account (recomendado — sem OAuth interativo)

### 3.2 Service Account Setup (feito uma vez pela Karol)

1. Criar projeto no Google Cloud Console
2. Ativar Google Drive API
3. Criar Service Account → baixar JSON key
4. Criar pasta `instagram-staging` no Drive → compartilhar com email do Service Account (editor)
5. Guardar ID da pasta no Vault (`DRIVE_FOLDER_ID`)
6. Guardar JSON key no Vault (conteúdo do arquivo)

### 3.3 Autenticar com Service Account (Python)

```python
from google.oauth2 import service_account
from googleapiclient.discovery import build

credentials = service_account.Credentials.from_service_account_info(
    vault['GOOGLE_SERVICE_ACCOUNT_JSON'],
    scopes=['https://www.googleapis.com/auth/drive']
)
service = build('drive', 'v3', credentials=credentials)
```

### 3.4 Upload de Arquivo

```python
from googleapiclient.http import MediaFileUpload

file_metadata = {
    'name': f'{slug}-slide-{str(i).zfill(2)}.png',
    'parents': [vault['DRIVE_FOLDER_ID']]
}
media = MediaFileUpload(local_path, mimetype='image/png')
file = service.files().create(
    body=file_metadata,
    media_body=media,
    fields='id'
).execute()
file_id = file.get('id')
```

### 3.5 Tornar Arquivo Público

```python
service.permissions().create(
    fileId=file_id,
    body={'role': 'reader', 'type': 'anyone'}
).execute()
```

### 3.6 URL Pública

```python
# Formato que funciona com a maioria das APIs externas:
public_url = f"https://drive.google.com/uc?export=view&id={file_id}"

# URL alternativa (se a acima falhar):
alt_url = f"https://lh3.googleusercontent.com/d/{file_id}"
```

### 3.7 Risco: Compatibilidade Google Drive URL com Meta API

**Problema conhecido:** Meta pode não conseguir baixar imagens do Google Drive em alguns casos:
- Redirects na URL
- Rate limiting do Drive
- Cache de permissão

**Mitigação:**
1. Usar `export=view` (não `export=download`)
2. Aguardar 5s após tornar público antes de passar URL pra Meta
3. SE erro 100 na Meta API → tentar URL alternativa `lh3.googleusercontent.com`
4. SE persistir → flaggar para Karol considerar Cloudinary

---

## 4. FILE SYSTEM — ESTRUTURA DE PASTAS

### 4.1 Estrutura

```
business/instagram/
  fila/
    {slug}/
      slide-01.png
      slide-02.png
      slide-03.png
      ...
      legenda.txt        ← gerado pelo agente de conteúdo
  agendados/
    {slug}/              ← movido aqui após agendamento
      slide-01.png
      ...
      legenda.txt
  agendamentos.md        ← log histórico
```

### 4.2 Convenções

- **Slug:** nome da pasta em lowercase com hífens (ex: `psicologa-agenda-cheia`)
- **Slides:** `slide-01.png`, `slide-02.png`, ... (dois dígitos, zero-padded)
- **Legenda:** `legenda.txt` em UTF-8, sem BOM
- **Máximo slides:** 10 (limitação Instagram)

### 4.3 Operações

```bash
# Listar slides em ordem
ls business/instagram/fila/{slug}/slide-*.png | sort

# Ler legenda
cat business/instagram/fila/{slug}/legenda.txt

# Mover pasta após agendamento
mv business/instagram/fila/{slug} business/instagram/agendados/{slug}
```

---

## 5. TROUBLESHOOTING

### 5.1 "Error 100: Invalid image URL"

**Causa:** Meta não consegue acessar a URL do Google Drive.
**Fix:**
1. Verificar se o arquivo é público: tentar abrir a URL em aba anônima
2. Aguardar 10s após setar permissão pública
3. Tentar URL alternativa: `https://lh3.googleusercontent.com/d/{file_id}`
4. SE persiste: reportar pra Karol e sugerir Cloudinary

### 5.2 "Error 190: Invalid OAuth access token"

**Causa:** Token Meta expirado ou inválido.
**Fix:** Executar SOP-001 (renovar token). SE token expirou há mais de 60 dias, Karol precisa refazer OAuth completo.

### 5.3 "scheduled_publish_time is invalid"

**Causa:** Timestamp inválido (no passado, formato errado, ou menos de 10min no futuro).
**Fix:** Verificar cálculo do timestamp — garantir UTC correto e que é futuro.

### 5.4 Upload Drive falha com 403

**Causa:** Service Account não tem permissão na pasta.
**Fix:** Verificar se a pasta `instagram-staging` está compartilhada com o email da Service Account.

### 5.5 Carrossel aparece como "failed" no Meta

**Causa:** Imagem rejeitada (tamanho, formato ou aspect ratio fora do padrão).
**Fix:** Verificar dimensões dos slides (mínimo 320x320, máximo 8MB, PNG ou JPEG).
