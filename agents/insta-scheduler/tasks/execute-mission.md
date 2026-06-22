---
task: "Execute Mission"
responsavel: "@insta-scheduler"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Slug do carrossel a agendar (ou pasta identificada na fila)"
Saida: "Carrossel agendado no Instagram + log atualizado + pasta movida"
Checklist:
  - "Pasta validada (slides + legenda.txt)"
  - "Slides carregados no Google Drive"
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

- Vault carregado com token Meta e credenciais Google Drive
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

### Step 2: Upload dos Slides para Google Drive

Usar credenciais do Vault (Service Account JSON ou OAuth token).

Para cada slide (em ordem: slide-01, slide-02, ...):

```python
# Lógica de upload por slide
POST https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart
Headers:
  Authorization: Bearer {drive_access_token}
Body (multipart):
  metadata: {"name": "{slug}-slide-0N.png", "parents": ["{DRIVE_FOLDER_ID}"]}
  file: <binary content do slide>

# Resposta: {"id": "fileId"}

# Tornar público
POST https://www.googleapis.com/drive/v3/files/{fileId}/permissions
Body: {"role": "reader", "type": "anyone"}

# URL pública
url = f"https://drive.google.com/uc?export=view&id={fileId}"
```

Coletar lista de URLs: `[url_slide01, url_slide02, ...]`

**SE upload falhar:**
- Tentar novamente 1x
- SE falhar novamente: PARAR — "Falha no upload do slide {N} para o Drive. Erro: {mensagem}. Verifique as credenciais no vault e a conexão."

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
3. **Study:** Bateu? Algo demorou mais que esperado? Erro de URL do Drive?
4. **Act:** SE URL do Drive causou problema → atualizar Rules. SE processo novo → criar SOP.

---

## SOP-001: Renovar Token Meta

**Trigger:** token expira em < 5 dias OU erro 190 da Meta API

```python
GET https://graph.instagram.com/refresh_access_token
Params:
  grant_type: ig_refresh_token
  access_token: {META_TOKEN_ATUAL}
# Resposta: {"access_token": "novo_token", "expires_in": 5184000}
```

Atualizar token no Vault após renovação.

---

## Error Handling

| Cenário | Código Meta | Ação |
|---------|------------|------|
| Token expirado | 190 | Executar SOP-001 (renovar) e tentar novamente |
| URL inválida (Drive) | 100 | Verificar se arquivo é público. Tentar URL alternativa. Se persistir, propor Cloudinary |
| Rate limit | 4 / 32 | Aguardar 60s e tentar novamente (máx 2x) |
| Post já existe no dia | — | Pegar próximo dia disponível |
| Carrossel > 10 slides | — | PARAR — "Carrossel `{slug}` tem {N} slides. Instagram aceita no máximo 10." |
| legenda.txt vazio | — | PARAR — "Arquivo `legenda.txt` está vazio em `{slug}`." |
