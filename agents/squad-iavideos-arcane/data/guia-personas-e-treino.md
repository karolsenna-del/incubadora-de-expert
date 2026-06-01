# Guia de Personas, Treino e Padrão de Qualidade

KB que ensina o usuário a entender **tudo o que o Higgsfield consegue gerar**, **como treinar cada coisa** e — o mais importante — o **padrão de qualidade orgânico** validado em produção pra gerar avatares de pessoas reais e críveis, não modelos de revista.

---

## 1. O que dá pra gerar no Higgsfield

| Tipo de output | Modelo | Pra que serve | Como se obtém |
|---|---|---|---|
| **Vídeo UGC com avatar** | Marketing Studio (`marketing_studio_video`) | Anúncio com pessoa falando, estilo celular | Avatar custom + prompt com roteiro |
| **Imagem de persona** | Soul V2 (`text2image_soul_v2`) | Criar o rosto/aparência de uma persona fictícia | Prompt descritivo (padrão orgânico) |
| **B-roll cinematográfico** | Cinema Studio Video 3.0 (`cinematic_studio_3_0`) | Cenas de apoio (ambientes, objetos, atmosfera) | Prompt de cena, sem pessoas falando |
| **Vídeo geral / motion** | Seedance 2.0 (`seedance_2_0`) | Movimento, multi-shot, image-to-video | Prompt de cena |
| **Imagem geral / design** | GPT Image 2 (`gpt_image_2`) | Banners, peças com texto, design | Prompt descritivo |
| **Digital twin (você)** | Soul ID (`higgsfield soul-id create`) | Treinar SUA identidade facial pra te gerar em qualquer cenário | 8-12 fotos suas + treino |
| **Análise de viralidade** | Virality Predictor (`brain_activity`) | Pontuar hook/retenção de um vídeo pronto | Upload do vídeo |

**Regra de ouro do squad:** pra anúncio standalone, sempre **UGC com avatar**. B-roll é só apoio. (Ver `guia-producao.md`.)

---

## 2. Padrão de Qualidade Orgânico — Geração de Persona/Avatar

O squad nasceu com 5 personas femininas validadas (Bruna, Renata, Aline, Patricia, Juliana). O padrão abaixo é o que produz pessoas que **parecem gente de verdade** — e foi conquistado depois de 4 lotes de tentativa e erro. Serve pra **homem ou mulher**: o gênero muda, o padrão orgânico se mantém.

### Os 5 princípios do orgânico

1. **Gente comum, não modelo.** O Soul V2 puxa pra "modelo de revista/influencer" por padrão. Combater explicitamente.
2. **Pele real.** Imperfeições sutis, linhas de expressão, sem retoque de pele.
3. **Foto de celular, não photoshoot.** Enquadramento levemente imperfeito, luz natural de ambiente.
4. **Casa real, não estúdio.** Fundo de lar vivido — cozinha com objetos, sala com bagunça leve, home office com livros.
5. **Beleza acessível.** Bonito de um jeito real — "a pessoa atraente do bairro", não passarela.

### O equilíbrio dos 3 eixos

O erro mais comum é ir longe demais num eixo só:
- Buscar "real" → perde a beleza (vira desleixado)
- Buscar "bonito" → perde a autenticidade (vira modelo)
- Esquecer o público → persona não parece com quem vai assistir

**Calibrar os 3 juntos, na mesma rodada:** bonito + real + parecido com o público-alvo.

### Template de prompt validado (Soul V2)

```
Candid authentic phone selfie of a naturally good-looking ordinary Brazilian
[man / woman], [30-40] years old, [tom de pele: fair / light brown / brown / tan],
[cabelo: tipo e estado], the look of a real everyday person — attractive in a
natural accessible way, NOT a glamorous model. Natural unretouched skin with
subtle texture and faint expression lines. Light natural makeup or none.
Warm genuine expression, looking directly at camera.

Wearing [roupa modesta de bom gosto — gola fechada / turtleneck / camisa fechada;
ver R3]. In a real lived-in Brazilian home [cozinha / sala / home office /
varanda] with everyday details visible.

Soft natural indoor daylight. Authentic homemade UGC look, slightly imperfect
framing. Vertical 9:16.
```

### Vieses do Soul V2 a combater (sempre)

| Viés | Sintoma | Antídoto no prompt |
|---|---|---|
| Glamour | Vira modelo de revista | "ordinary", "NOT a glamorous model", "real everyday person" |
| Idade pra baixo | Pede 35, entrega 25 | Reforçar: "the look of a mature accomplished person", "subtle expression lines" |
| Sensualização de roupa | Abre decote/botões sozinho | Travar gola alta/fechada (ver R3 em `regras-cardinais.md`) |
| Estúdio | Fundo limpo de catálogo | "real lived-in home", "everyday details", "homemade look" |

### O sub-loop de aprovação

Persona boa raramente sai de primeira. O processo validado:

```
gerar lote de 4 opções (variando tom de pele/cabelo) →
apresentar ao usuário → ouvir o que não funcionou →
ajustar UMA variável por vez → regerar → repetir até "bater o martelo"
```

Ajustar uma variável por vez: assim cada rodada chega mais perto sem perder o que já estava bom.

---

## 3. Como criar um avatar custom (persona fictícia)

Persona fictícia = personagem inventado pra UGC (como a Bruna, a Aline). Passo a passo:

```bash
# 1. Gerar a imagem da persona (padrão orgânico — seção 2)
higgsfield generate create text2image_soul_v2 \
  --prompt "<template orgânico>" --aspect_ratio 9:16 --quality 2k --wait

# 2. Baixar e revisar
curl -s -o /tmp/persona.png "<URL_resultado>"
sips -s format jpeg -Z 700 /tmp/persona.png --out /tmp/persona.jpg
open /tmp/persona.jpg

# 3. Sub-loop de aprovação até bater o martelo (seção 2)

# 4. Registrar como avatar custom no Marketing Studio
U=$(higgsfield upload create /tmp/persona.png --json)
ID=$(echo "$U" | jq -r '.id // .[0].id')
URL=$(echo "$U" | jq -r '.url // .[0].url')
higgsfield marketing-studio avatars create --name "<Nome>" --image "$ID" --image-url "$URL"
```

A persona aprovada vira biblioteca reusável — produz quantos UGC quiser com ela.

**Custo:** geração Soul V2 ~5 créditos. Lote de 4 = ~20 créditos. Barato — não economizar no sub-loop.

---

## 4. Como treinar o Soul ID (seu digital twin)

Soul ID é diferente de avatar custom: treina a **SUA identidade facial real** num modelo. Depois de treinado, gera VOCÊ em qualquer cenário, roupa, luz — não fica preso a foto nenhuma.

> **Soul ID treina só o ROSTO/identidade visual. NÃO treina voz.** Pra ter sua voz nos vídeos, é voice cloning separado (ElevenLabs PVC) mixado em pós-produção.

### Quais fotos juntar (decisivo pra qualidade)

| Critério | Recomendação |
|---|---|
| Quantidade | 8-12 fotos (mínimo 5, máximo 20) |
| Rosto | Nítido, olhos visíveis, 1 pessoa por foto |
| Ângulos | Frente, 3/4 esquerda, 3/4 direita, leve cima/baixo |
| Iluminação | Variada — interna, externa, suave, dura |
| Expressões | Neutra, sorrindo, falando |
| Distâncias | Close de rosto, busto, corpo inteiro |
| Resolução | ≥ 1024×1024, nítida, em foco |

**Evitar:** foto de grupo, óculos escuros, chapéu cobrindo rosto, maquiagem/fantasia fora do normal, mesma pose repetida, filtros pesados.

> **Quanto mais variado o conjunto de treino, maior a liberdade de cenário depois.** Conjunto pobre = Soul que só funciona em contexto parecido com as fotos. Conjunto rico = você em qualquer ocasião.

### Comando de treino

```bash
# Variante soul-2 (imagens) — default; soul-cinematic pra vídeo cinematográfico
higgsfield soul-id create --name "<nome>" --soul-2 \
  --image ./foto1.jpg --image ./foto2.jpg --image ./foto3.jpg ... --wait

# Acompanhar (treino leva minutos)
higgsfield soul-id wait <id>

# Listar Souls treinados
higgsfield soul-id list
```

Retorna um `reference_id`. Treina **uma vez**, usa pra sempre.

### Como usar o Soul depois

```bash
# Gerar imagem sua em qualquer cenário
higgsfield generate create text2image_soul_v2 \
  --prompt "<você no cenário desejado>" --soul-id <ref_id> --quality 2k --wait

# Versão cinematográfica
higgsfield generate create soul_cinematic \
  --prompt "..." --soul-id <ref_id> --quality 2k --wait
```

### Do Soul ID ao vídeo founder-led

Soul ID gera **imagens** suas. Pra virar vídeo de você falando:
1. Gerar imagem sua com Soul ID no cenário desejado
2. Registrar essa imagem como avatar custom no Marketing Studio (seção 3, passo 4)
3. Produzir UGC com você falando — mesmo fluxo da Bruna/Aline, mas sendo você

**Pré-requisito:** Soul ID exige plano pago (Basic+). Planos Ultra/Business cobrem.

---

## 5. Tabela de decisão — qual caminho pra qual objetivo

```
O que você quer?
│
├── Anúncio com pessoa fictícia falando
│   └── Criar avatar custom (seção 3) → produzir UGC (guia-producao.md)
│
├── Anúncio com VOCÊ falando (founder-led)
│   └── Treinar Soul ID (seção 4) → gerar sua imagem → avatar custom → UGC
│
├── Biblioteca de avatares variados pra testar
│   └── Gerar várias personas no padrão orgânico (seção 2), registrar todas
│
├── Cena de apoio / atmosfera (B-roll)
│   └── Cinema Studio Video 3.0 ou Seedance 2.0 (catalogo-modelos-higgsfield.md)
│
├── Banner / peça com texto / design
│   └── GPT Image 2
│
└── Avaliar um vídeo pronto
    └── Virality Predictor (brain_activity)
```

---

## Resumo

- **Avatar custom** = persona fictícia, criada de uma imagem Soul V2 no padrão orgânico.
- **Soul ID** = seu digital twin real, treinado de 8-12 fotos suas, te gera em qualquer cenário.
- **Padrão orgânico** = gente real, não modelo. Vale pra homem e mulher. Combater os 4 vieses do Soul sempre.
- **Persona boa é aproximação** — sub-loop de aprovação, uma variável por vez.
