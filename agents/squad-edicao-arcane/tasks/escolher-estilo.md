---
task: "Escolher estilo de legenda"
responsavel: "@stylist"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Expert quer mexer no estilo (ou primeira vez configurando)"
Saida: "data/estilo-ativo.yaml atualizado + opcionalmente novo preset em data/estilos/"
execution_type: "interactive"
---

# Task: Escolher estilo de legenda

Quando o expert quer trocar / customizar o estilo da legenda. Fluxo interativo: apresentar opções, ouvir, gerar mockup, salvar.

## Pré-condições

- Squad já instalado (QG-SEA-001 PASS)
- Idealmente expert já gravou pelo menos um vídeo (pra gerar mockup no frame real dele)
- Se não tem vídeo ainda: usa um frame placeholder em `data/exemplo-frame.png` (a criar opcional)

## Fluxo

### Step 1 — Identificar caminho

Stylist apresenta os 3 caminhos (greeting do agent). Expert escolhe.

### Step 2 — Gerar mockup(s)

#### Path 1 (catálogo)

Pra cada `data/estilos/*.yaml`, gera mockup:

```bash
# texto exemplo (se há transcript do expert, usa frase real; senao, generico)
TXT="UMA EMPRESA INTEIRA COM IA"
FRAME=/tmp/stylist-frame.png
ffmpeg -y -ss <t> -i <video_expert> -frames:v 1 $FRAME 2>/dev/null

# pra cada estilo
for estilo in neutro viral clean organico; do
  # le yaml e monta drawtext (igual o video-captions.py faz, mas em PNG estatico)
  # salva /tmp/stylist-mockup-<nome>.png
done

# abre todos os mockups
open /tmp/stylist-mockup-*.png
```

Pergunta: "Qual? (neutro / viral / clean / organico)"

#### Path 2 (referência)

```
Manda o que você tem:
- URL de TikTok/Reels/YouTube
- Print do frame
- Ou só descreve ("estilo MrBeast", "estilo CapCut padrão")
```

Stylist analisa visualmente (se print) ou contextualmente (se URL/descrição). Identifica:
- Fonte aproximada (condensed/grotesque/rounded → Bebas/Montserrat/Poppins)
- Cor, borda, sombra, posição
- Cria yaml custom + mockup
- Mostra: "Bate?"

#### Path 3 (pesquisa)

WebSearch trending. Identifica padrões. Propõe 3 variações. Mockups.

### Step 3 — Confirmar escolha

Expert escolhe um estilo. Stylist pergunta:

```
Salvar como padrão pros próximos vídeos?

1. Sim, vira meu default
2. Não, usa só nesse vídeo
```

Se 1 → atualiza `data/estilo-ativo.yaml`:
```yaml
estilo_ativo: "<nome-escolhido>"
```

Se 2 → mantém `estilo-ativo.yaml` como tá. Stylist passa o estilo como flag pro próximo `/auroq-squad-edicao-arcane` step:
```bash
{SQUAD_DIR}/.venv/bin/python3 scripts/video-captions.py <video> <transcript> --style <nome>
```

### Step 4 — Confirmar e ceder

```
✅ Estilo `<nome>` ativo. <Próximo vídeo vai usar ele> | <Só nesse vídeo, depois volta pro neutro>.

Voltando pro chief.
```

Handoff pro @chief.

## Sobre criar estilo custom

Se expert quer um estilo que não bate exatamente com nenhum dos 3 preset principais, Stylist cria `data/estilos/custom-<descricao-curta>.yaml` baseado na análise + customização. Esse estilo vira opção permanente do squad daquele expert (não é distribuído de volta).

## Veto conditions

| Condição | Ação |
|---|---|
| Expert não tem vídeo ainda | Usa frame placeholder ou pede pra gerar mockup depois do primeiro vídeo |
| Referência inacessível (URL quebrada, print ilegível) | Pede outra OU pergunta descrição em texto |
| WebSearch falha / sem resultados | Avisa, sugere caminho 1 (catálogo) |
| Fonte da referência não tem equivalente nas 3 disponíveis | Avisa expert: "A fonte mais próxima que tenho é X. Quer que eu use ela ou prefere catálogo?" |
