# Guia de Produção Higgsfield — Operacional

KB de protocolos operacionais que alimenta o `@operador-higgsfield`, o `@diretor-persona` e o setup do `@iavideos-chief`. Comandos do CLI, fluxos de produção, criação de avatar, recuperação de jobs.

---

## Setup do ambiente (uma vez por máquina)

### 1. Instalar o CLI

```bash
curl -fsSL https://raw.githubusercontent.com/higgsfield-ai/cli/main/install.sh | sh
```

Verificar:
```bash
which higgsfield
higgsfield --version
```

### 2. Autenticar

```bash
higgsfield auth login
```

Comando interativo — abre o navegador, usuário faz login.

### 3. Confirmar

```bash
higgsfield account status
```

Output esperado:
```
{email} — {plan} plan, {N} credits
```

Se "Session expired" → rodar `higgsfield auth login` de novo.

---

## Fluxo de produção de vídeo UGC

### Pipeline básico

```bash
# 1. Verificar status
higgsfield account status

# 2. Listar avatares (preset + custom)
higgsfield marketing-studio avatars list --json

# 3. Montar payload de avatares
printf '[{"id":"<avatar_id>","type":"custom"}]' > /tmp/avatars.json

# 4. Gerar peça
higgsfield generate create marketing_studio_video \
  --prompt "<roteiro>" \
  --avatars @/tmp/avatars.json \
  --mode ugc \
  --aspect_ratio 9:16 \
  --duration 25 \
  --resolution 720p \
  --wait
```

A flag `--wait` bloqueia até o job terminar e imprime a URL final. Sem ela, retorna o job ID e o operador precisa polar.

### Lote de teste

Para produzir 3 peças (uma por formato):

```bash
for f in ugc ugc_how_to ugc; do
  higgsfield generate create marketing_studio_video \
    --prompt "<roteiro do formato>" \
    --avatars @/tmp/avatars.json \
    --mode "$f" \
    --aspect_ratio 9:16 \
    --duration 25 \
    --wait
done
```

Coletar URLs de saída, encaminhar pra `avaliar-viralidade`.

---

## Fluxo de criação de avatar custom

### 1. Gerar a imagem da persona

```bash
higgsfield generate create text2image_soul_v2 \
  --prompt "Candid phone selfie of a naturally beautiful Brazilian woman, 33yo, ..." \
  --aspect_ratio 9:16 \
  --quality 2k \
  --wait
```

Output: URL de uma imagem PNG.

### 2. Baixar e converter pra ver

```bash
curl -s -o /tmp/persona.png "<URL_da_imagem>"
# Em macOS: converter pra jpg pra visualização rápida
sips -s format jpeg -Z 700 /tmp/persona.png --out /tmp/persona.jpg
open /tmp/persona.jpg
```

### 3. Sub-loop até aprovação

Repetir geração ajustando uma variável por vez (idade, etnia, vestuário, ambiente) com base no feedback do usuário.

### 4. Registrar como avatar custom

Com a imagem aprovada:

```bash
# Upload
U=$(higgsfield upload create /tmp/persona.png --json)
ID=$(echo "$U" | jq -r .id)
URL=$(echo "$U" | jq -r .url)

# Criar avatar
higgsfield marketing-studio avatars create \
  --name "<Nome da Persona>" \
  --image "$ID" \
  --image-url "$URL"
```

Validar:
```bash
higgsfield marketing-studio avatars list --json | jq '.[] | select(.type=="custom")'
```

A persona agora está disponível como `type: custom` pra produzir vídeos.

---

## Rodar Virality Predictor

```bash
higgsfield generate create brain_activity \
  --video <video_url_ou_job_id> \
  --wait
```

Output (texto):
```
Overall score: X/100
Peak hook: Y% at Zs
Sustain: W%
Strongest region: ...
Open report: <URL>
```

Sem prompt, só `--video`. Roda em cada peça antes de apresentar.

---

## Recuperação após falha de rede

Se o `--wait` falha com `Cannot reach...`:

1. **Não regerar do zero** — o job geralmente foi criado no servidor.
2. Capturar o job ID que apareceu antes da falha.
3. Consultar:

```bash
higgsfield generate get <job_id>
```

Retorna o status e a URL se já estiver concluído.

4. Se status = `completed`: usar a URL. Trabalho preservado.
5. Se status = `running`: aguardar e re-consultar.
6. Se status = `failed`: aí sim regerar.

---

## Padrão Visual UGC Validado (21/05/2026)

Sequência aprendida em produção real que entrega criativos UGC vencedores com Higgsfield Marketing Studio. **Aplicar em todo UGC de persona daqui pra frente.**

### Anatomia do prompt UGC validado

```
Brazilian woman, [idade], [cenário/ambiente], casual phone selfie style.

SHE HAS TWO HANDS:
- ONE hand holds a small smartphone iPhone at her side or chest level
  with the SCREEN FACING HERSELF, ANGLED AWAY from the camera AT ALL TIMES
  — the camera NEVER sees the phone screen.
- The OTHER hand (the free hand) is the one she uses for any gesture.

CRITICAL VISUAL HOOK: in the very first frame she [gesto natural — tucks hair behind ear / adjusts collar / brushes shoulder]
using HER FREE HAND ONLY — NEVER the hand holding the smartphone.

Throughout the video, she glances at the phone occasionally as if reading something to herself,
but the screen is always angled toward her face and away from camera.

ABSOLUTELY NO promo card, NO printed signs, NO on-screen text, NO graphics on screen.

The audio is in Brazilian Portuguese only — no English words.
She says exactly this in Brazilian Portuguese with natural pacing:
'[ROTEIRO LITERAL EM PT-BR — terceira pessoa quando refere ao expert]'

Authentic UGC look, [iluminação coerente com cenário], vertical 9:16.
```

### CTA padrão pra anúncios Meta Ads

**"Clica no botão"** (sempre no fim do roteiro).

NÃO usar "Link na bio" — esse é CTA orgânico de Instagram, não anúncio pago. No anúncio pago do Meta, o link vem no botão do criativo, então a fala da persona reforça isso.

### Triplo reforço de língua

Pra forçar áudio PT-BR (o sistema às vezes marca `prompt_language: "en"` por causa das partes em inglês do prompt):
1. **Antes do roteiro:** "The audio is in Brazilian Portuguese only — no English words."
2. **Imediatamente antes do roteiro:** "She says exactly this in Brazilian Portuguese with natural pacing:"
3. **O próprio roteiro entre aspas em PT-BR.**

Sem esse triplo reforço, risco do modelo gerar áudio em inglês ou inventar conteúdo aleatório.

### Parâmetros validados

- `--mode ugc` (padrão Marketing Studio)
- `--aspect_ratio 9:16` (Reels/Stories) ou `1:1` (feed)
- **`--duration` omitida** ou `15` — cap real é 15s no Marketing Studio (não pedir mais; ver E7 no troubleshooting)
- `--generate_audio true` (forçado pelo backend de qualquer jeito)
- `--avatars @path/to/avatar.json` (formato `[{"id":"...","type":"custom"}]`)

### Higgsfield brilha em UGC, não em B-roll standalone

Aprendizado de 21/05/2026: tentamos rodar 4 formatos não-UGC standalone (Cinematic VSL, Kinetic Typography, Demo Visual, Before/After Split) com Cinema Studio Video 3.0 e Seedance 2.0. **Resultado: shots viraram "wallpaper bonito" sem narrativa específica — não funcionam como criativo standalone.**

Mas alguns shots viram **B-roll útil** pra:
- Inserir em meio a UGC (cortes pra dar variedade)
- Compor abertura/fechamento de outros criativos
- Posts orgânicos no Instagram com texto sobreposto

**Regra prática:** Higgsfield é forte pra **UGC com avatar falando**. Pra anúncio standalone, sempre rode UGC. Pra suplemento visual, B-roll Cinema Studio funciona como apoio.

---

## Decision Tree — fluxo de produção

```
Conceito aprovado pelo Chief
│
├── Inclui formato UGC?
│   ├── Sim → Diretor define avatar (biblioteca ou criar)
│   │         ├── Reutilizar: pega avatar custom pela ID
│   │         └── Criar: roda Soul V2 + sub-loop + registra como custom
│   └── Não → skip Avatar
│
├── Selecionar modelo (catalogo-modelos-higgsfield.md)
│   └── Default: marketing_studio_video
│
├── Montar parâmetros (mode, aspect_ratio, duration, avatars)
│
├── Submeter com --wait
│   ├── Sucesso → captura URL
│   └── Falha de rede → recuperar pelo job ID
│
├── Rodar Virality Predictor em cada peça (brain_activity)
│
├── Apresentar URLs + notas ao Chief
│
└── Aguardar feedback do usuário pra próxima ação
```

---

## Comandos úteis (referência rápida)

```bash
# Status da conta
higgsfield account status

# Listar modelos
higgsfield model list --json

# Schema de um modelo (parâmetros aceitos)
higgsfield model get marketing_studio_video --json

# Listar avatares
higgsfield marketing-studio avatars list --json

# Listar jobs anteriores
higgsfield generate list --json

# Detalhe de um job
higgsfield generate get <job_id>

# Reentar wait de job antigo (se não rodou com --wait)
higgsfield generate wait <job_id>

# Upload de arquivo
higgsfield upload create <path>

# Listar uploads
higgsfield upload list --json
```

---

## Tabela de parâmetros recomendados — por formato

| Formato | Modelo | --mode | aspect | duration |
|---------|--------|--------|--------|----------|
| Founder-led | marketing_studio_video | ugc | 9:16 | 25 |
| UGC persona | marketing_studio_video | ugc | 9:16 | 25 |
| Listicle | marketing_studio_video | ugc | 9:16 | 30 |
| PAS | marketing_studio_video | ugc | 9:16 | 25 |
| VSL curta | marketing_studio_video | tv_spot | 9:16 ou 1:1 | 45 |
| How-to | marketing_studio_video | ugc_how_to | 9:16 | 30 |
| Product review | marketing_studio_video | product_review | 9:16 | 25 |
| Feed quadrado | marketing_studio_video | (mesmo do formato) | 1:1 | 25 |
| Stories | marketing_studio_video | (mesmo do formato) | 9:16 | 15 |

---

## Disciplina operacional

1. **Lote enxuto sempre.** 1-2 peças por formato no teste. Escala só o que acertar a mão.
2. **Virality Predictor antes de apresentar.** Não pular.
3. **Recuperar jobs, não regerar.** Falha de rede ≠ trabalho perdido.
4. **Consultar `model get` antes de submeter parâmetro incerto.** Schema é a fonte de verdade.
5. **Validar pela listagem após erro de parsing.** O JSON pode quebrar, a operação geralmente concluiu.
