---
task: "Produce Card Images"
responsavel: "@image-director"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Estilo calibrado + carrossel mapeado + provider + modo escolhido"
Saida: "card{N}-FINAL.png em ~/Downloads/{nome}/ + template cristalizado + handoff pro Producer"
Checklist:
  - "Todo card com imagem tem seu card{N}-FINAL.png em ~/Downloads/{nome}/"
  - "Cards text-only NAO geraram arquivo"
  - "Lote revisado e aprovado pelo usuario (card mais fraco apontado)"
  - "Template cristalizado (save-image-style rodou)"
  - "Handoff pro Producer feito"
execution_type: "interactive"
---

# Task: Produce Card Images

## Executive Summary

Produz as imagens de conteudo de cada card aplicando o estilo calibrado, em um de dois modos (Batch ou Incremental). Entrega `card{N}-FINAL.png` em `~/Downloads/{nome}/`, cristaliza os aprendizados de volta no template, e faz handoff pro Producer.

Pre-requisito: `calibrate-image-style` rodou e o usuario aprovou o estilo.

---

## Convencao de saida (CRITICA — integra com o Producer)

- **`card{N}-FINAL.png` = bloco N da copy.** Mesmo padrao que o Producer ja le em `produce-carousel`.
- Salvar em `~/Downloads/{nome-do-carrossel}/`.
- Card text-only (ex.: CTA) → NAO gerar arquivo (o Producer trata como slide sem imagem).
- Aspect ratio e modelo vem do template de estilo (ex.: euriler = 16:9, ultrarrealista).

---

## Modo Batch (default — rapido)

### Step B1: Gerar todas
Pra cada card com imagem, gerar aplicando estilo + Regra de Ouro. Respeitar limite de jobs concorrentes do provider (ex.: Higgsfield ~8 — gerar em levas).

### Step B2: Baixar + salvar
Salvar cada uma como `card{N}-FINAL.png` em `~/Downloads/{nome}/`.

### Step B3: Revisao em lote
- Abrir todas no preview (`open -a Preview ...`).
- Dar a leitura critica card a card; **apontar o(s) card(s) mais fraco(s)** sem o usuario pedir.
- Coletar o que aprova e o que refazer.

### Step B4: Refazer o que precisar
Re-gerar so os cards apontados, com o ajuste pedido. Repetir ate o usuario aprovar o lote.

---

## Modo Incremental (economico — menos credito)

### Step I1: Gerar UMA
Gerar o proximo card aplicando estilo + aprendizados acumulados das aprovacoes anteriores.

### Step I2: Revisar
Mostrar. "Aprova ou ajusta?"

### Step I3: Aprender
Incorporar o ajuste do usuario ao entendimento do estilo da sessao. O proximo card ja sai com o aprendizado aplicado.

### Step I4: Loop
Repetir card a card ate o ultimo. Mais lento, gasta menos credito (nao gera lote inteiro pra jogar fora).

---

## Step C: Pos-producao (texto/composicao)

Quando o card precisa de texto/numero/selo na imagem:
- Header/numero/label na imagem → o modelo gera; se acento PT sair errado, corrigir por composicao (PIL), nao regerar.
- Selos/badges (ex.: "VS") → compor por cima via codigo.
- **Medir pixels REAIS** (perfil de luminancia/deteccao) ao localizar regioes — nunca estimar coords de preview redimensionado.

---

## Step D: Cristalizar o template (OBRIGATORIO)

Apos o lote aprovado, chamar `save-image-style` pra **atualizar o template de estilo** com os aprendizados da sessao: novos exemplos (texto do card → prompt → resultado aprovado), correcoes de direcao, novos simbolos/padroes validados. O template fica melhor pra proxima.

---

## Step E: Entregar + handoff Producer

```
Lote pronto: {N} imagens em ~/Downloads/{nome}/.
[apontar card mais fraco, se houver]
Atualizei o template {estilo} com o que funcionou nessa sessao.

Agora chama o Producer e aponta ~/Downloads/{nome}/ que ele monta o carrossel
(ele ja le card{N}-FINAL.png = bloco N da copy).
```

```bash
open "$HOME/Downloads/{nome}"
```

---

## Quality Gates

- Todo card com imagem tem seu `card{N}-FINAL.png` em `~/Downloads/{nome}/`
- Cards text-only NAO geraram arquivo
- Lote revisado e aprovado pelo usuario
- Template cristalizado (save-image-style rodou)
- Handoff pro Producer feito

## Veto Conditions

| Cenario | Acao |
|---------|------|
| Estilo nao calibrado | Voltar pra `calibrate-image-style` |
| Provider barra imagem (nsfw/ip) | Reformular o prompt mais neutro e regerar; avisar o usuario |
| Pasta de output ja existe | Confirmar nome antes de sobrescrever |
| Dado/citacao na imagem nao verificado | Sinalizar pro usuario confirmar a fonte antes de publicar |

---

**Task Status:** Ready for Production
