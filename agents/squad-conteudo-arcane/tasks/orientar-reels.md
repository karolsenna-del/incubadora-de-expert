---
task: "Orientar Reels"
responsavel: "@mack-produtor"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "roteiro.md aprovado (formato = reels)"
Saida: "direcao-reels.md com setup ideal + direção de gravacao + edicao"
Checklist:
  - "Roteiro carregado"
  - "Setup ideal apresentado (iPhone Pro 13+, modo cinema, contra luz, zoom 2x, mic Hollyland/Boya)"
  - "Fallback apresentado (comeca com o que tem)"
  - "Cenario sugerido"
  - "Direcao de gravacao (postura, tom, cortes)"
  - "Variacao emocional ao longo do video mapeada"
  - "Edicao orientada (CapCut passo a passo)"
  - "Sugestao de reaproveitamento (carrossel/anuncio)"
  - "Salvou direcao-reels.md"
execution_type: "interactive"
---

# Task: Orientar Reels — Passo 6 (Reels)

**Task ID:** squad-conteudo-arcane/orientar-reels
**Version:** 1.0.0
**Responsavel:** @mack-produtor
**Category:** Rotina por Post — Producao
**Execution Type:** Interactive

---

## Pipeline Visual

```
orientar-reels
  |
  v
STEP 1: CARREGAR ROTEIRO + ANOTAÇÕES DO RICO
  |
  v
STEP 2: APRESENTAR SETUP IDEAL
  iPhone Pro 13+, modo cinema, contra luz, zoom 2x, mic
  |
  v
STEP 3: APRESENTAR FALLBACK (sem equipamento ideal)
  Comeca com o que tem
  |
  v
STEP 4: DIREÇÃO DE GRAVACAO
  Cenario + postura + tom + cortes
  |
  v
STEP 5: VARIAÇÃO EMOCIONAL (mapa)
  Ja vem do roteiro, Mack reforca
  |
  v
STEP 6: ORIENTACAO DE EDICAO
  CapCut passo a passo + textos + trilha + legenda
  |
  v
STEP 7: SUGESTAO DE REAPROVEITAMENTO
  Reels → carrossel / anuncio
  |
  v
STEP 8: SALVAR direcao-reels.md
```

---

## Step 1: Carregar Roteiro

Mack abre `docs/producao-conteudo/{expert}/posts/{slug}/roteiro.md`. Lê as "Anotações pro Mack" que o Rico já deixou.

---

## Step 2: Setup Ideal

```markdown
═══════════════════════════════════════════════════════════════
SETUP REELS RECOMENDADO (se voce tem)
═══════════════════════════════════════════════════════════════

CAMERA: iPhone Pro (13 ou superior)
  Por que: qualidade alta, modo cinema avançado, estabilização
  nativa, processamento de luz bom.

LENTE: câmera de TRÁS (não frontal)
  Por que: lente principal traseira tem qualidade muito superior
  à frontal. Foco mais preciso.

MODO: cinematográfico
  Por que: foco automático, desfoque de fundo (bokeh), visual
  profissional.
  Configura em: Câmera > toca em "Cinemático" no menu de modos

LUZ: natural, gravando CONTRA a luz
  Por que: você fica iluminado de frente (não silhueta).
  Posiciona: de frente pra janela ou luz natural.
  Evita: luz por trás (silhueta) ou de cima direta (sombras
  no rosto).

ZOOM: fechamento mínimo (2x)
  Por que: lente padrão do iPhone (1x) distorce o rosto sutilmente.
  Zoom 2x corrige e dá visual mais profissional.
  Configura: pressiona e segura o "1x" no app câmera → aparece
  slider → escolhe 2x.

MICROFONE:
  Premium: Hollyland M2 (lavalier wireless, ~R$ 800-1.000)
  Custo-benefício: Boya BY-M1 ou BY-WM3 (~R$ 200)

  Por que: áudio do microfone embutido fica abafado em ambiente
  médio. Microfone externo eleva qualidade drasticamente.
```

---

## Step 3: Fallback (sem equipamento ideal)

```markdown
═══════════════════════════════════════════════════════════════
SE VOCE NAO TEM ESSE SETUP
═══════════════════════════════════════════════════════════════

PRINCIPIO: COMEÇA COM O QUE TEM.
Equipamento e otimizacao, NAO pre-requisito.

✓ SEM iPhone Pro? → iPhone normal ou Android decente
  (acima de R$ 1.500) ainda entregam bom.

✓ SEM microfone externo? → Grava em ambiente silencioso.
  Mic embutido resolve em ambiente quieto. Pode comprar
  Boya depois (R$ 200, faz papel muito bem).

✓ SEM cenário "instagramavel"? → Lo-fi resolve. Cozinha,
  sala, carro. Autenticidade > produção.

LEMBRA: Pantera viralizou na cozinha com camisa simples.
Mari Krieger na sala de casa. Hannah Franklin no quarto.
Equipamento bom serve quem já entrega — nao substitui
execucao.

POSTA. APRENDE. OTIMIZA DEPOIS.
```

---

## Step 4: Direção de Gravação

Mack interpreta o roteiro e expande:

```markdown
═══════════════════════════════════════════════════════════════
DIRECAO DE GRAVACAO
═══════════════════════════════════════════════════════════════

CENARIO SUGERIDO: {do roteiro / Mack confirma}
  - Ambiente neutro, sem distrações
  - Opções: escritório simples / parede limpa / lo-fi (sala
    ou cozinha)
  - Iluminação natural pela janela

POSTURA:
  - Olhar direto na câmera (você ta CONVERSANDO, não palestrando)
  - Ombros relaxados
  - Mão pode aparecer se for falar com gesto, mas sem exagero

TOM DE FALA (baseado no perfil de tom do expert):
  - {do perfil-tom-de-voz.md}
  - Para esse post especifico: {nuance do tema — ex: serio mas
    nao bravo / confronta sem perder leveza}

CORTES (sugestao):

  Opcao A — 1 TAKE: grava tudo de uma vez
    Pros: mais autêntico, ritmo natural
    Contras: errou, refaz tudo
    Recomendado se: voce ta confortavel com texto

  Opcao B — MULTIPLOS CORTES: grava por seções do roteiro
    Pros: pode errar e refazer só a seção
    Contras: ritmo pode ficar entrecortado
    Recomendado se: roteiro tem viradas claras

  Sugestao pra esse roteiro: {Mack escolhe baseado no roteiro}
```

---

## Step 5: Variação Emocional (Mapa)

Mack reforça o mapa de variação emocional que o Rico ja anotou:

```markdown
═══════════════════════════════════════════════════════════════
VARIAÇÃO EMOCIONAL AO LONGO DO VIDEO
═══════════════════════════════════════════════════════════════

(mapeado pelo Rico no roteiro — Mack reforca aqui)

0-5s (HOOK): {emocao alvo — ex: intriga + provoca}
5-15s (INTRO): {emocao}
15-30s (CONTEUDO core): {emocao}
30-45s (PROFUNDIDADE): {emocao}
45-55s (CTA): {emocao}
55-60s (FECHAMENTO): {emocao}

IMPORTANTE: emocao varia, nunca fica monotom.
Audience: "emocao prende, monotonia mata."
```

---

## Step 6: Orientação de Edição (CapCut)

```markdown
═══════════════════════════════════════════════════════════════
EDICAO (no CapCut — gratuito, mobile)
═══════════════════════════════════════════════════════════════

PASSO A PASSO:

1. Abre CapCut, importa video(s) gravados

2. Se gravou em sessoes → junta na ordem do roteiro

3. CORTE: remove pausas longas, mantem ritmo
   - Se demorou pra começar uma fala, corta o tempo morto
   - Pausas naturais ficam (não corta tudo)

4. TEXTOS ON-SCREEN (essencial):
   - Capa: "{texto do hook em destaque}"
   - Em {Xs}: "{palavra-chave 1}"
   - Em {Ys}: "{palavra-chave 2}"
   - Em {Zs}: "{palavra-chave 3}"
   - (texto reforça pontos importantes pra quem assiste sem som)

5. LEGENDA AUTOMATICA:
   - CapCut tem essa funcao — ativa
   - Tabuleiro de legendas embaixo (estilo TikTok)
   - 70%+ do publico ve sem som — legenda e obrigatoria

6. TRILHA SONORA:
   - Opcional, baixa, instrumental
   - Recomendo: instrumental dramatico/serio
   - Volume: 15-25% (não compete com voz)
   - Pode pular se voce prefere

7. EXPORTAR EM 1080p (qualidade alta)
```

---

## Step 7: Sugestão de Reaproveitamento

```markdown
═══════════════════════════════════════════════════════════════
REAPROVEITAMENTO (se esse reels for bem)
═══════════════════════════════════════════════════════════════

Se metricas forem boas (Aria confirma depois), podemos
transformar em:

→ CARROSSEL: 10 slides com os mesmos pontos
  (visual diferente, mesmo conteudo, posicionar diferente)

→ ANUNCIO PAGO: se voce escala via Meta Ads
  (reels viral organico vira anuncio campeao)

→ POST DE BLOG / NEWSLETTER: aprofundar a tese pra publico
  que prefere ler

Aria diagnostica depois e a gente decide se vale.
```

---

## Step 8: Caption Sugerida + Salvar

```markdown
═══════════════════════════════════════════════════════════════
CAPTION PRO INSTAGRAM (sugestao)
═══════════════════════════════════════════════════════════════

{Caption sugerida usando hook + 2-3 linhas + CTA. Pode reusar
texto do roteiro, ajustar tom pra leitura}

Hashtags (3-5 do nicho): {hashtags relevantes}
```

Salva em `docs/producao-conteudo/{expert}/posts/{slug}/direcao-reels.md` com tudo acima:

```markdown
# Direção de Reels — {slug}

**Tema:** {tema}
**Formato:** Reels
**Duração estimada:** {Xs}
**Roteiro fonte:** {link relativo pro roteiro.md}

---

## Setup de Gravação
[Setup ideal completo]

## Fallback (sem equipamento)
[Fallback completo]

## Direção de Gravação
[Cenário + postura + tom + cortes]

## Variação Emocional (mapa)
[Mapa]

## Edição (CapCut)
[Passo a passo]

## Reaproveitamento Sugerido
[Cascata]

## Caption Sugerida
{caption}

Hashtags: {hashtags}
```

---

## Veto Conditions

| Condição | Ação |
|----------|------|
| Expert trava por falta de equipamento | "Setup e otimizacao, nao pre-requisito. Bora com iPhone basico + luz natural. Posta, aprende, otimiza." |
| Expert quer comprar equipamento de R$ 50k antes | "Investe quando ja entrega bom com basico. Pantera viralizou na cozinha." |
| Expert quer reels de 3 minutos | "Ideal 30-90s pro algoritmo. Mais que isso, retencao despenca." |
| Expert nao tem CapCut e nao quer usar | Sugere alternativas (InShot, VN, mesmo iMovie). Mas reforca: CapCut e o mais simples. |

---

## Quality Gate

**Direção pronta pra produção**

Checklist:
- [ ] Setup ideal apresentado
- [ ] Fallback apresentado
- [ ] Cenário sugerido
- [ ] Postura/tom/cortes definidos
- [ ] Variação emocional mapeada
- [ ] Edição orientada (CapCut passo a passo)
- [ ] Reaproveitamento sugerido
- [ ] Caption pronta
- [ ] Salvo em direcao-reels.md

---

## Próximo Passo

```
Direcao pronta. Salvei em
`docs/producao-conteudo/{expert}/posts/{slug}/direcao-reels.md`.

Tempo estimado: 
- Gravação: 15-30 min (1 take) ou 30-60 min (múltiplos cortes)
- Edição CapCut: 20-40 min

Quando postar, manda os numeros pra Aria diagnosticar.

Bora pro proximo post ou tá bom por aqui?
```

→ Volta pro Vox.

---

**Task Status:** Ready for Production
