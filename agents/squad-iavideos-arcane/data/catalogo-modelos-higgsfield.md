<!-- Sintetizado a partir do model-catalog e marketing-modes das skills higgsfield-* em mai/2026. Squad runtime não referencia esses paths. -->

# Catálogo de Modelos Higgsfield — Quando Usar Cada

KB que alimenta o `@operador-higgsfield` na hora de selecionar o modelo certo pra cada peça. Cobre modelos de vídeo, modelos de imagem (pra persona), modos do Marketing Studio, aspect ratios, durações e media roles.

---

## Modelos de vídeo

| Modelo | ID CLI | Quando usar |
|--------|--------|-------------|
| **Marketing Studio** ⭐ | `marketing_studio_video` | Todo vídeo de anúncio/comercial — UGC, founder-led, unboxing, tv spot, product showcase. Aceita avatares e produtos. **Default pra criativos do squad.** |
| **Seedance 2.0** | `seedance_2_0` | Vídeo geral sério, multi-shot, motion forte, image-to-video. Default fora do Marketing Studio. |
| **Kling 3.0** | `kling3_0` | Substituto mais barato do Seedance pra cenas de plano único sem muito movimento. Multi-shot, sync de áudio. |
| **Seedance 1.5 Pro** | `seedance1_5` | Versão econômica — take único limpo. Só quando o usuário pede budget. |
| **Cinema Studio Video 3.0** | `cinema_studio_video_3_0` | Topo de linha cinema-grade, look de cinema, fidelidade máxima. |
| **Google Veo 3.1** | `veo_3_1` | Ultra-realista. Tiers basic/high/ultra. Formatos restritos (16:9 ou 9:16; duração 4, 6 ou 8s). |
| **Veo 3.1 Lite** | `veo_3_1_lite` | Veo rápido e barato — pra lote/volume. |
| **Minimax Hailuo** | `minimax_hailuo` | Barato com física forte de movimento (sem áudio). |
| **Wan 2.7** | `wan_2_7` | Áudio sincronizado + personagem consistente. Estilizado. |
| **Grok Imagine (vídeo)** | `grok_imagine_video` | Estilizado/anime, com áudio. |

### Default do squad: Marketing Studio

Pra todo criativo de anúncio do squad, **default = Marketing Studio**. Ele aceita avatares custom (`type: custom`) e preset, tem modos prontos pros formatos da KB, e gera nativa pro feed (9:16, 1:1, 16:9). Os outros modelos entram só em casos específicos (cinema, plano único, lote massivo).

---

## Modos do Marketing Studio

Passados no parâmetro `--mode`:

| `--mode` | Label | Hook/setting? | Quando usar |
|----------|-------|---------------|-------------|
| `ugc` | UGC | ✅ | **Default.** Casual, orgânico, presenter falando direto. |
| `ugc_how_to` | Tutorial | ✅ | "Veja como usar X." Tutorial / explainer. |
| `ugc_unboxing` | Unboxing | ✅ | "Acabei de receber." Reveal de produto físico. |
| `product_showcase` | Product Showcase | ❌ | Highlight limpo de produto, sem presenter dominante. |
| `product_review` | Product Review | ✅ | Presenter dando opinião sobre o produto. |
| `tv_spot` | TV Spot | ❌ | Cara de comercial de TV. Mais polido. |
| `ugc_virtual_try_on` | Virtual Try On UGC | ✅ | Pessoa testando roupa/acessório. |
| `virtual_try_on` | Virtual Try On Pro | ❌ | Try-on polido, modelo. |
| `wild_card` | Wild Card | ❌ | Modelo escolhe a vibe. Experimental. |

### Picking flow (para os formatos da KB)

| Formato (KB) | `--mode` recomendado |
|--------------|---------------------|
| Founder-led talking head | `ugc` com avatar custom (seu rosto) |
| UGC de persona | `ugc` com avatar custom (persona) |
| Yapper ad | `ugc` (roteiro acelerado) |
| Listicle | `ugc` |
| PAS | `ugc` |
| VSL curta | `ugc` ou `tv_spot` (mais polido) |
| How-to / Tutorial | `ugc_how_to` |
| Product review / produto | `product_review` |
| Day-in-the-life | `ugc` |

---

## Parâmetros do Marketing Studio video

```bash
higgsfield generate create marketing_studio_video \
  --prompt "..." \
  --avatars @avatars.json \
  --mode ugc \
  --duration 25 \
  --resolution 720p \
  --aspect_ratio 9:16 \
  --wait
```

| Parâmetro | Valores aceitos | Default |
|-----------|-----------------|---------|
| `--aspect_ratio` | `auto`, `21:9`, `16:9`, `4:3`, `1:1`, `3:4`, `9:16` | `16:9` |
| `--duration` | inteiro ≥ 4 (sem cap fixo — checar `model get`) | — |
| `--resolution` | `480p` ou `720p` | `720p` |
| `--mode` | ver tabela acima | `ugc` |
| `--generate_audio` | `true` ou `false` | `false` |
| `--avatars` | JSON array `[{"id":"...","type":"preset|custom"}]` | — |
| `--product_ids` | JSON array `["product_uuid"]` | — |
| `--hook_id` | UUID de hook do Marketing Studio | — |
| `--setting_id` | UUID de setting do Marketing Studio | — |

### Avatares no Marketing Studio

```bash
# Listar avatares preset
higgsfield marketing-studio avatars list --json

# Criar avatar custom a partir de uma imagem
ID=$(higgsfield upload create rosto.png --json | jq -r .id)
URL=$(higgsfield upload create rosto.png --json | jq -r .url)
higgsfield marketing-studio avatars create --name "Persona X" --image "$ID" --image-url "$URL"

# Passar pro vídeo
printf '[{"id":"<avatar_id>","type":"custom"}]' > avatars.json
higgsfield generate create marketing_studio_video --avatars @avatars.json ...
```

---

## Modelos de imagem (pra gerar persona)

| Modelo | ID CLI | Quando usar |
|--------|--------|-------------|
| **Higgsfield Soul V2** ⭐ | `text2image_soul_v2` | **Default pra persona.** Aesthetic UGC, lifestyle, character. Realista. |
| Soul Cinema | `soul_cinematic` | Persona com vibe cinematográfica. |
| Soul Cast | `soul_cast` | Persona criativa, expressiva. Text-only (sem imagem de referência). |
| Soul Location | `soul_location` | Ambientes/locais sem pessoa. Best in class pra cenário. |
| GPT Image 2 | `gpt_image_2` | Default geral. Banners, on-image text. |
| Nano Banana 2 | `nano_banana_flash` | Personagem/cartoon. |
| Z Image | `z_image` | Geração rápida, drafts. |

### Geração de persona — parâmetros Soul V2

```bash
higgsfield generate create text2image_soul_v2 \
  --prompt "..." \
  --aspect_ratio 9:16 \
  --quality 2k \
  --wait
```

| Parâmetro | Valores aceitos | Default |
|-----------|-----------------|---------|
| `--aspect_ratio` | `1:1`, `16:9`, `9:16`, `4:3`, `3:4`, `3:2`, `2:3` | — |
| `--quality` | `1.5k` ou `2k` | — |
| `--soul-id` | reference_id de Soul Character (opcional) | — |

---

## Virality Predictor

```bash
higgsfield generate create brain_activity --video <video_url_ou_id> --wait
```

| Característica | Detalhe |
|----------------|---------|
| ID CLI | `brain_activity` (customer-facing: "Virality Predictor") |
| Input | Vídeo (URL ou job ID de geração anterior) |
| Output | Relatório de texto: score, peak hook, sustain, regiões, Open report URL |
| Quando usar | Antes de apresentar qualquer peça ao usuário (QG-IAV-02) |
| Não usa | Prompt — só `--video` |

**Interpretação:**
- **Score 0-100** geral de viralidade
- **Peak hook segundo X** — onde a atenção do espectador picou
- **Sustain %** — quanto da atenção se manteve
- **Open report URL** — link pro relatório detalhado

**Sinal de hook:** se peak hook > 3 segundos, o hook falhou — regra dos 3 segundos.

---

## Media roles por modelo

| Modelo | Roles aceitos |
|--------|---------------|
| Seedance 2.0 | `image`, `start_image`, `end_image`, `video`, `audio` |
| Kling 3.0 | `start_image`, `end_image` |
| Veo 3.1 | `start_image` (max 1) |
| Marketing Studio video | `image`, `start_image`, `end_image` |
| Virality Predictor | `video` |
| Soul V2 | `image` (opcional) |
| Z Image / Soul Cast / Soul Location | (nenhum — prompt-only) |

---

## Decision Tree — qual modelo usar

```
Tipo de peça?
│
├── Vídeo de anúncio (qualquer formato da KB)
│   └── Marketing Studio (ID: marketing_studio_video)
│       └── Escolher --mode conforme tabela "Picking flow"
│
├── Vídeo geral cinematográfico (não anúncio)
│   ├── Top fidelidade → Cinema Studio Video 3.0
│   ├── Default sério → Seedance 2.0
│   └── Cena simples barata → Kling 3.0
│
├── Imagem de persona (pra criar avatar custom)
│   └── Soul V2 (ID: text2image_soul_v2)
│       └── Quality 2k, aspect 9:16
│
├── Imagem geral (banner, design, on-image text)
│   └── GPT Image 2
│
└── Análise de vídeo finalizado
    └── Virality Predictor (ID: brain_activity)
```

---

## Quando consultar o schema do modelo

Antes de submeter um parâmetro incerto:

```bash
higgsfield model get <modelo> --json
```

Retorna o schema completo: parâmetros aceitos, enums, defaults. Submeter parâmetro fora do enum custa uma rodada perdida — e rodada perdida é crédito perdido.

---

## Disciplina de custo

| Ação | Custo relativo | Recomendação |
|------|---------------|--------------|
| Geração de imagem (Soul V2) | Baixo | OK pra lotes de 4-6 |
| Geração de vídeo (Marketing Studio, 9:16, 720p, ~15s) | Médio (~150 créditos) | Lote enxuto de teste (1-2 por formato) |
| Vídeo em cinema-grade (Cinema Studio 3.0) | Alto | Só pra peças vencedoras escaladas |
| Virality Predictor | Baixo (~5-10) | Obrigatório em cada peça antes de apresentar |
| Geração de persona (Soul V2 1080p) | Baixo (~5) | Lote de 4 por rodada de aprovação |

Lote enxuto primeiro. Escala só o que acertar.

---

## Planos Higgsfield e parallel limits

O número de jobs concurrent (rodando ao mesmo tempo) é o gargalo de produção. Limite por plano:

| Plano | Créditos/mês | Parallel concurrent | Soul V2 unlimited | Indicação |
|-------|--------------|---------------------|-------------------|-----------|
| Free | 0 | 1 | Não | Não usar pra produção |
| Plus | ~1.000 | **2** | Não | Insuficiente — gargalo grave |
| **Ultra** ⭐ | 3.000-9.000 | **8** | **5.000 free gens** | **Sweet spot** pra single user |
| Business | 1.500-4.500/seat × 2 seats | **16** | Não | Pra equipes; pago por seat |

**Aprendizado validado (21/05/2026):**
- **Ultra atende muito bem single user** que produz UGC em volume — 8 concurrent fecha lote de 8 jobs em ~10 min.
- **Plus é gargalo grave** — 2 concurrent paralisa workflow. Vimos isso em produção: cada lote demorando 1h+ quando podia ser 10 min.
- **Soul V2 unlimited do Ultra** é o ouro escondido — gera persona ilimitada sem custo. Cria biblioteca de avatares sem queimar crédito.

**Erro de moderação:** se aparecer `rate_limit_reached`, é só estourar o concurrent. Aguardar slot abrir (ver E9 no troubleshooting).
