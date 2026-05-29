# Processar JSON do Apify

**Aplicação:** Aria executa quando expert traz JSON do Apify.
**Princípio:** Apify scraping = input estruturado pra análise em batch.

---

## O Que Apify Entrega

Apify Instagram Scraper / Apify TikTok Scraper retornam JSON com:

```json
[
  {
    "url": "https://instagram.com/p/...",
    "type": "Image|Video|Sidecar",
    "shortCode": "...",
    "caption": "...",
    "likesCount": 12345,
    "commentsCount": 678,
    "videoViewCount": 250000,
    "videoPlayCount": 250000,
    "ownerUsername": "...",
    "timestamp": "2026-05-01T10:00:00Z",
    "comments": [
      {
        "text": "...",
        "ownerUsername": "...",
        "timestamp": "...",
        "likesCount": 23
      }
    ],
    "hashtags": ["...", "..."]
  },
  ...
]
```

---

## O Que Apify NÃO Entrega

Métricas internas do Instagram Insights:
- **Taxa após 3 segundos** (não disponível via scraping)
- **Tempo médio de visualização** (não disponível)
- **Salvamentos** (parcial em algumas versões)
- **Compartilhamentos** (parcial)

**Limitação:** sem essas métricas internas, diagnóstico de Aria fica PARCIAL.

**Mitigação:** combinar Apify (views, likes, comentários) com PRINTS do Insights (taxa 3s, tempo médio).

---

## Atores Apify Recomendados

### Pra Instagram

**`apify/instagram-scraper`** (completo)
- Posts + comentários + perfil
- Mais informações
- Mais lento (5-10 min por perfil)

**`apify/instagram-post-scraper`** (rápido)
- Só posts (sem comentários)
- Mais rápido (1-3 min)
- Pra análise quantitativa rápida

### Pra TikTok

**`apify/tiktok-scraper`**
- Vídeos + métricas + comentários

### Pra YouTube

**`apify/youtube-scraper`**
- Vídeos + métricas + comentários
- Inclui dados de retenção em alguns casos

---

## Configuração Apify (Instagram)

```json
{
  "directUrls": ["https://instagram.com/{handle}"],
  "resultsType": "posts",
  "resultsLimit": 30,
  "addParentData": false,
  "searchType": "user"
}
```

**Parâmetros importantes:**

- `resultsType`: "posts" (não usa stories) ou "details" (mais info)
- `resultsLimit`: 10-50 (cuidado com créditos Apify)
- `addParentData`: false (não precisa info do perfil pai)

---

## Processo de Aria

### Step 1: Validar JSON

Aria valida estrutura:
- É array de posts?
- Tem campos essenciais (views, likes, comments)?
- Comentários inclusos?

Se inválido: avisa expert e pede export correto.

### Step 2: Extrair Dados Por Post

Pra cada post:

```yaml
post_id: "{shortCode}"
url: "{url}"
type: "{Image | Video | Sidecar}"
postado_em: "{timestamp}"

caption: "{texto da legenda}"

metricas_disponiveis:
  views: "{videoViewCount}"
  likes: "{likesCount}"
  comentarios: "{commentsCount}"
  
metricas_AUSENTES:
  - taxa_apos_3s (sem isso, diagnóstico de gancho fica parcial)
  - tempo_medio (sem isso, diagnóstico de estrutura fica parcial)
  - salvamentos (parcial)
  - compartilhamentos (parcial)
```

### Step 3: Avisar Expert das Limitações

```
JSON processado. Tenho:
- {N} posts
- Views, likes, comentários por post
- {N total} comentários pra análise qualitativa

⚠️ FALTAM:
- Taxa após 3s (sem isso, gancho fica indiagnosticado)
- Tempo médio (sem isso, estrutura/conteúdo idem)

Se voce tem PRINT do Insights de cada post, manda — completa
o diagnóstico. Sem isso, análise fica parcial mas ainda útil
(views/likes/comentários + análise qualitativa).

Como prefere?
1. Trabalho com o que tenho (parcial)
2. Manda prints do Insights pra completar
```

### Step 4: Calcular Métricas Derivadas

Com o que tem, Aria calcula:

```
Taxa de engajamento parcial:
  (likes + comentários) / views * 100

Threshold sem salvamentos/compartilhamentos:
  >5% pra bom engajamento
  >10% se incluiu salvamentos/compartilhamentos (regra completa)
```

### Step 5: Análise Comparativa Batch

Com múltiplos posts:

- Top performers (maior views + engagement)
- Bottom performers
- Padrões (formato, tema, hashtags)
- Recomendações

### Step 6: Análise Qualitativa (Se Tem Comentários)

Roda `analisar-comentarios.md` em cima do dump extraído.

### Step 7: Encaminhar Pra Análise Apropriada

```
Quer:
1. ANALISAR 1 ESPECÍFICO (deep dive em 1 post)
2. ANALISAR BATCH (comparativo dos {N})
3. ANALISAR SÓ COMENTÁRIOS (qualitativa)
4. SALVAR DADOS e decidir depois
```

→ Roteia pra `analisar-post`, `analisar-batch`, `analisar-comentarios`.

---

## Insights Apify-Specific

Algumas análises só Apify permite:

### A) Análise de Hashtags

Apify retorna hashtags. Aria pode identificar:
- Hashtags que apareceram em posts top
- Hashtags ausentes (oportunidade)
- Hashtags repetidas demais (saturação)

### B) Análise de Caption

Apify retorna captions. Aria pode identificar:
- Padrão de hook em captions
- Tamanho de caption (curta vs longa, qual performa)
- Uso de emojis, quebras de linha

### C) Análise de Concorrentes

Apify pode scrape concorrentes do nicho. Aria pode:
- Comparar performance do expert vs concorrentes
- Identificar temas/formatos que concorrentes acertam
- Encontrar gaps (temas que ninguém aborda no nicho)

---

## Limites de Custo

Apify cobra por créditos. Pra orientação:

- 1 perfil completo (30 posts + comentários): ~5-20 créditos
- 1 batch de hashtag (50 posts): ~20-50 créditos
- Scrape contínuo (monitoramento diário): caro

**Recomendação:** usa Apify sob demanda, não rotina. 1x por mês análise profunda + complementa com prints manuais.

---

## Aplicação no Squad

Tarefa: `ler-apify.md`

Aria recebe JSON, valida, extrai, e encaminha pra análise apropriada.

**Fluxo:**

```
Expert manda Apify JSON
     ↓
Aria valida + extrai
     ↓
Avisa limitações (falta tempo médio etc)
     ↓
Pergunta: 1 post, batch, ou só comentários?
     ↓
Encaminha pra análise apropriada
     ↓
Gera relatório final
```
