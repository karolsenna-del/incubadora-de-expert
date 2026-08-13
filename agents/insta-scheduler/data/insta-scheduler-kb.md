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

## 1.5 Publicar Stories (`media_type=STORIES`) — pesquisado 12/08/2026

**Fonte:** Meta Developer Docs, Content Publishing API (developers.facebook.com/docs/instagram-platform/content-publishing/).
Pesquisado pra destravar a automação de Stories da Karol (worker `agents/expert-stories/`).

**Confirmado: Stories É suportado pela mesma API, mesmo flow de 2 passos.**

```
POST https://graph.instagram.com/v21.0/{IG_USER_ID}/media
Params: media_type = STORIES
        image_url  = {url pública} (ou video_url pra vídeo)
        access_token = {META_TOKEN}
```
→ retorna container_id. Depois:
```
POST https://graph.instagram.com/v21.0/{IG_USER_ID}/media_publish
Params: creation_id = {container_id}
```

**Diferenças em relação ao fluxo de carrossel já implementado:**
- Sem `is_carousel_item`/`children` — Stories é sempre 1 mídia por container (não suporta múltiplos slides como carrossel)
- `media_type` no container criado é `STORIES`, não `IMAGE`/`CAROUSEL`
- Ao consultar depois, o campo `media_type` retorna `IMAGE`/`VIDEO` (não `STORIES`) — pra confirmar que é uma Story, consultar o campo `media_product_type`

**`scheduled_publish_time` pra Stories: NÃO documentado pela Meta (zona cinzenta).** Mas isso não bloqueia nada aqui — o script atual (`post-frase-que-vale-milhoes.yml` e os demais workflows) **já não usa esse parâmetro pra agendar**: o "agendamento" real é o próprio cron do GitHub Actions disparando o workflow na hora certa, e o script publica imediatamente (`published:"false"` → espera `FINISHED` → `media_publish` na hora). Então o mesmo padrão serve pra Stories sem depender de scheduling nativo da Meta.

**Confirmado: NÃO dá pra anexar sticker interativo (caixinha de pergunta, enquete, quiz) via API.** A documentação de publicação não lista nenhum parâmetro pra isso — stickers nativos só existem quando postados manualmente pelo app. Isso bate com o que já era esperado pro catálogo de Stories (formatos como Caixinha/Enquete Positiva sempre vão precisar do toque manual da Karol no app, mesmo com imagem de fundo gerada e publicada via API).

**Limitação adicional achada:** campo novo `alt_text` (introduzido mar/2025) explicitamente NÃO suporta Reels nem Stories — não é relevante pro fluxo atual, só registro.

**Conclusão pra extensão do insta-scheduler:** dá pra reaproveitar quase 100% do script de carrossel — trocar `media_type: CAROUSEL` + loop de containers por um único `media_type: STORIES` + `image_url`, sem o passo de criar múltiplos `is_carousel_item`. Esforço estimado: baixo (script já existe, é adaptação, não criação do zero).

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

## 3. CLOUDINARY API

### 3.1 Visão Geral

**Documentação:** https://cloudinary.com/documentation/image_upload_api_reference
**Base URL:** `https://api.cloudinary.com/v1_1/{cloud_name}/`
**Autenticação:** Upload assinado com SHA1 (API Key + API Secret do Vault)

**Vantagem sobre Drive:** URLs diretas sem redirect — Meta Graph API aceita sem erros.

### 3.2 Credenciais no Vault

```
CLOUDINARY_CLOUD_NAME=drvy4cz5x
CLOUDINARY_API_KEY=667561448886123
CLOUDINARY_API_SECRET=<pegar no vault>
```

### 3.3 Upload Autenticado (Python)

```python
import hashlib, time, requests

def upload_to_cloudinary(local_path, public_id, vault):
    timestamp = int(time.time())
    
    # Gerar assinatura
    signature_str = f"public_id={public_id}&timestamp={timestamp}{vault['CLOUDINARY_API_SECRET']}"
    signature = hashlib.sha1(signature_str.encode('utf-8')).hexdigest()
    
    url = f"https://api.cloudinary.com/v1_1/{vault['CLOUDINARY_CLOUD_NAME']}/image/upload"
    
    with open(local_path, 'rb') as f:
        response = requests.post(url, data={
            'public_id': public_id,
            'api_key': vault['CLOUDINARY_API_KEY'],
            'timestamp': timestamp,
            'signature': signature,
        }, files={'file': f})
    
    response.raise_for_status()
    return response.json()['secure_url']
```

### 3.4 Nomear public_id

```python
public_id = f"{slug}-slide-{str(i+1).zfill(2)}"
# Resultado: "adiando-ha-anos-slide-01", "adiando-ha-anos-slide-02", etc.
```

### 3.5 URL Pública Resultante

```
https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.png
```

Ou usar o `secure_url` direto da resposta — já é HTTPS e acessível publicamente.

### 3.6 Boas Práticas

- Nomear sempre com slug + número do slide para evitar sobrescrever uploads anteriores
- Aguardar resposta de cada upload antes de prosseguir (upload é síncrono)
- SE mesmo public_id for reenviado, Cloudinary sobrescreve — sem problema neste fluxo

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

**Causa:** Meta não consegue acessar a URL do Cloudinary (raro — URLs são diretas).
**Fix:**
1. Verificar se o upload completou com sucesso: checar `secure_url` na resposta
2. Confirmar que a URL abre em aba anônima sem login
3. Tentar re-upload do slide (mesmo public_id sobrescreve — tudo bem)
4. SE persiste: reportar pra Karol com o `secure_url` que falhou

### 5.2 "Error 190: Invalid OAuth access token"

**Causa:** Token Meta expirado ou inválido.
**Fix:** Executar SOP-001 (renovar token). SE token expirou há mais de 60 dias, Karol precisa refazer OAuth completo.

### 5.3 "scheduled_publish_time is invalid"

**Causa:** Timestamp inválido (no passado, formato errado, ou menos de 10min no futuro).
**Fix:** Verificar cálculo do timestamp — garantir UTC correto e que é futuro.

### 5.4 Upload Cloudinary falha com 401

**Causa:** Assinatura inválida — API Key, API Secret ou timestamp incorreto.
**Fix:** Verificar credenciais no vault. Checar que a signature_str segue exatamente o formato `public_id=...&timestamp=...{api_secret}` sem espaços extras.

### 5.5 Carrossel aparece como "failed" no Meta

**Causa:** Imagem rejeitada (tamanho, formato ou aspect ratio fora do padrão).
**Fix:** Verificar dimensões dos slides (mínimo 320x320, máximo 8MB, PNG ou JPEG).
