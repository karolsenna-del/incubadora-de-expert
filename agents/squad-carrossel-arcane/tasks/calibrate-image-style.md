---
task: "Calibrate Image Style"
responsavel: "@image-director"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Texto do carrossel + (template de estilo salvo OU referencias do usuario)"
Saida: "Estilo confirmado pelo usuario + 3 imagens-piloto aprovadas, pronto pra producao"
Checklist:
  - "Estilo carregado (template) OU sintetizado e confirmado (calibracao do zero)"
  - "Provider e modo escolhidos"
  - "Carrossel mapeado: arco emocional, card 1 identificado, cards text-only marcados"
  - "3 imagens-piloto geradas e aprovadas pelo usuario"
execution_type: "interactive"
---

# Task: Calibrate Image Style

## Executive Summary

Estabelece o estilo visual antes da producao real. Se o usuario tem template salvo, carrega e valida com 3 imagens-piloto. Se nao tem, coleta referencias/vibe e calibra do zero. So libera a producao quando o usuario confirma "esse e o estilo".

Objetivo: nunca produzir um lote inteiro com um estilo nao-validado (desperdicio de credito e retrabalho).

---

## Steps

### Step 1: Receber o texto + estabelecer o estilo

```
Cola o texto do carrossel.
Qual estilo a gente usa?
- Tem template salvo (ex.: euriler)? Me diz o nome.
- Ou monto do zero a partir de referencias tuas?
```

**Se template salvo:**
- Carregar `knowledge/image-styles/{nome}/style.md` + `examples.md`
- Carregar a metodologia geral `knowledge/imagens-padrao-euriler.md`
- Anunciar a Regra de Ouro do template ("ataco no teto de ousadia desde a 1a versao")

**Se sem template (calibracao do zero):**
- Coletar:
  ```
  Manda 2-3 referencias visuais (prints de carrosseis que tu curte).
  E me diz:
  - Que emocao a pessoa tem que sentir? (medo, humor, indignacao, ocitocina, espanto...)
  - Tom: sobrio, picante, bizarro, polemico?
  - Usa rosto de famoso? Marca real? Polemica/satira?
  - O que tu NAO quer (ex.: imagem generica, fotorrealismo frio)?
  ```
- Sintetizar a direcao e confirmar antes de gerar.

### Step 2: Escolher provider + modo

```
Provider de imagem: [Higgsfield CLI versatil mas mais caro | GPT Image API direto mais barato | Nano Banana Pro | Freepik]
Modo de producao: Batch (gero todas, tu revisa) [default] ou Incremental (uma a uma, economiza credito)?
```

(Ver `data/image-providers.yaml` pra autenticacao de cada provider.)

### Step 3: Mapear o carrossel

- Separar a copy em blocos (`-` isolado ou linha vazia dupla) = cards.
- Pra cada card, definir a **emocao-tese** e a ideia de cena (aplicando estilo + metodologia).
- Marcar quais cards sao text-only (ex.: CTA) — esses NAO geram imagem.
- Mapear o arco emocional do conjunto e qual card e a capa (biggest win).

### Step 4: Gerar as 3 imagens-piloto

- Escolher 3 cards representativos (preferir o card 1 + 2 de emocoes diferentes).
- Gerar aplicando a **Regra de Ouro** (teto de ousadia desde a 1a versao) + simbolos pre-carregados quando houver.
- Salvar em `~/Downloads/{nome}/` (card{N}-FINAL.png).

### Step 5: Feedback + ajuste

- Abrir as 3 no preview.
- Coletar feedback objetivo: composicao, emocao, simbolo, realismo, escala, picancia.
- Apontar o que EU acho mais fraco (nao esperar o usuario achar).
- Ajustar o entendimento do estilo. Re-gerar piloto se o feedback for grande.
- Repetir ate o usuario confirmar.

### Step 6: Confirmar e liberar producao

```
Estilo calibrado. As 3 pilotos batem com o que tu quer?
Se sim, sigo pra producao do carrossel inteiro no modo {batch/incremental}.
```

So passar pra `produce-card-images` com confirmacao explicita.

---

## Quality Gates

- Estilo carregado (template) OU sintetizado e confirmado (calibracao do zero)
- Provider e modo escolhidos
- 3 imagens-piloto geradas e aprovadas pelo usuario
- Arco emocional do carrossel mapeado, card 1 identificado, cards text-only marcados

## Veto Conditions

| Cenario | Acao |
|---------|------|
| Usuario nao tem referencia nem template | Propor defaults a partir do nicho + 1 piloto pra ancorar |
| Feedback contradiz o template carregado | Perguntar: ajustar so essa sessao ou atualizar o template? |
| Usuario quer pular calibracao | Avisar do risco (lote inteiro errado = retrabalho/credito) mas respeitar se insistir |
| Provider nao autenticado | Rotear pra setup do provider (login/API key) antes |

---

**Task Status:** Ready for Production
