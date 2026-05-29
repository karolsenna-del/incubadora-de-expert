---
task: "Ler Apify JSON"
responsavel: "@aria-analista"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "JSON do Apify (scrape de posts/perfil)"
Saida: "Dados estruturados extraidos + analise no padrao standard"
Checklist:
  - "JSON carregado e validado"
  - "Posts extraidos com metricas"
  - "Comentarios extraidos (se incluso)"
  - "Hashtags + caption extraidas"
  - "Encaminhado pra analisar-post OU analisar-batch"
execution_type: "interactive"
---

# Task: Ler Apify JSON — Processar Scraping

**Task ID:** squad-conteudo-arcane/ler-apify
**Version:** 1.0.0
**Responsavel:** @aria-analista
**Category:** Pós-Publicação — Input Automatizado
**Execution Type:** Interactive

---

## Propósito

Apify scrapeia posts/perfis e gera JSON estruturado. Aria sabe extrair dados relevantes e converter pro padrão de análise.

---

## Pipeline

```
ler-apify
  |
  v
STEP 1: VALIDAR JSON RECEBIDO
  Estrutura valida? Tem campos essenciais?
  |
  v
STEP 2: EXTRAIR POSTS
  Loop em cada post
  |
  v
STEP 3: EXTRAIR METRICAS POR POST
  Views, likes, comentarios, salvamentos, compartilhamentos
  |
  v
STEP 4: EXTRAIR COMENTARIOS (se incluso)
  Dump qualitativo
  |
  v
STEP 5: ESTRUTURAR DADOS NO FORMATO PADRAO
  |
  v
STEP 6: ENCAMINHAR PRA analisar-post OU analisar-batch
```

---

## Step 1: Validar JSON

Aria espera estrutura típica do Apify Instagram Scraper:

```json
[
  {
    "url": "https://instagram.com/p/...",
    "type": "Image|Video|Sidecar",
    "shortCode": "...",
    "caption": "...",
    "likesCount": ...,
    "commentsCount": ...,
    "videoViewCount": ...,
    "videoPlayCount": ...,
    "ownerUsername": "...",
    "timestamp": "...",
    "comments": [
      {
        "text": "...",
        "ownerUsername": "...",
        "timestamp": "..."
      }
    ]
  },
  ...
]
```

**Validação:**
- Array de posts?
- Tem campos `videoViewCount`, `likesCount`, `commentsCount`?
- (Opcional) Tem array `comments` aninhado?

Se estrutura inválida: avisar e pedir export correto.

---

## Step 2-3: Extrair Posts + Métricas

Pra cada post no JSON:

```yaml
post_id: "{shortCode}"
url: "{url}"
type: "{Image | Video | Sidecar}"
postado_em: "{timestamp}"

caption: "{texto da legenda}"

metricas:
  views: "{videoViewCount ou videoPlayCount}"
  likes: "{likesCount}"
  comentarios: "{commentsCount}"
  # Apify nem sempre tem salvamentos/compartilhamentos — sinalizar se falta

# CALCULAR:
# - interacao_por_view = (likes + comentarios) / views * 100
# (Sem salvamentos/compartilhamentos, calculo e parcial)
```

**Importante:** Apify nem sempre traz tempo médio nem taxa após 3s (são métricas internas do Insights). Aria avisa o expert:

```
Apify nao tem tempo medio nem taxa apos 3s — sao metricas
internas do Instagram Insights.

Vou trabalhar com:
- Views
- Likes
- Comentarios
- Caption (pra identificar tema/hook)
- Comentarios texto (pra analise qualitativa)

Se voce tem PRINT do Insights de cada post, manda — completa
o diagnostico. Sem isso, analise fica parcial.
```

---

## Step 4: Extrair Comentários (se incluso)

Se JSON tem array `comments`:

```yaml
post_id: "{shortCode}"
comentarios:
  - texto: "{texto comentario}"
    autor: "{username}"
    data: "{timestamp}"
  - ...
```

Aria pode então rodar `analisar-comentarios.md` em cima desses dumps.

---

## Step 5: Estruturar Dados

Aria gera arquivo intermediário pra usar nas análises:

```yaml
# .tmp/apify-extracao-{data}.yaml

batch_data: {data scraping}
total_posts: {N}

posts:
  - id: "{1}"
    [dados extraídos]
  - id: "{2}"
    ...

resumo:
  views_total: {soma}
  likes_total: {soma}
  comentarios_total: {soma}
  views_medio: {media}
  taxa_interacao_media: {media}
```

---

## Step 6: Encaminhar

Aria pergunta:

```
JSON processado. Tenho dados de {N} posts.

Quer:
1. ANALISAR 1 ESPECIFICO (individual deep dive)
2. ANALISAR BATCH (comparativo dos {N})
3. ANALISAR SO COMENTARIOS (qualitativa)
4. SALVAR DADOS E DECIDIR DEPOIS

Qual?
```

→ Encaminha pra `analisar-post`, `analisar-batch` ou `analisar-comentarios`.

---

## Veto Conditions

| Condição | Ação |
|----------|------|
| JSON malformado / vazio | "JSON não bate com estrutura esperada do Apify Instagram. Cola novamente ou descreve estrutura." |
| JSON com 1 post (não batch) | Encaminha direto pra `analisar-post` |
| JSON tem só views, sem outras métricas | Avisar: "Apenas views — analise vai ser muito limitada. Print do Insights ajuda." |

---

## Apify Actor Recomendado

Pra scrapear posts do Instagram:
- **apify/instagram-post-scraper** — pega posts de perfil
- **apify/instagram-scraper** — completo (posts + comentários + perfil)

Configurar:
```json
{
  "directUrls": ["https://instagram.com/{handle}"],
  "resultsType": "posts",
  "resultsLimit": 30,
  "addParentData": false
}
```

---

**Task Status:** Ready for Production
