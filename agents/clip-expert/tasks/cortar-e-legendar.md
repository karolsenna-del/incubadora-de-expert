---
task: "Cortar e Legendar"
responsavel: "@cortador"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Lista de trechos aprovados (timestamps + nota) do garimpeiro"
Saida: "Arquivos de video cortados, verticais (9x16), legendados e com headline, validados no encoding"
Checklist:
  - "Corte gerado exatamente nos timestamps aprovados"
  - "Video convertido pra vertical 1080x1920 via split-screen (webcam em cima, slide embaixo) antes de qualquer texto"
  - "Legenda aplicada via agente Stylist (squad-edicao-arcane), no vao entre os dois blocos — nao escolhida pelo cortador"
  - "Headline (gancho fixo, ~4s) queimado no topo de cada corte"
  - "Encoding validado: 8-bit yuv420p, profile Main, faststart"
execution_type: "deterministic"
---

# Task: Cortar e Legendar

## Executive Summary

Transforma cada trecho aprovado num arquivo de vídeo final pronto pra Reels: corte exato, vertical 9x16 em split-screen (webcam em cima + slide embaixo), legenda queimada no vão entre os dois blocos, e headline (gancho) no topo.

**Achado 21/09/2026 (primeira live real processada, Live 24):** a primeira entrega saiu só cortada e legendada, ainda em 16:9 horizontal — a Karol pediu formato Reels de verdade. Primeira tentativa foi um crop vertical simples (rosto centrado via `video-produce-zoom.py`, herdado do squad-edicao-arcane) — a Karol corrigiu: toda live tem slide, e o corte tem que ser **split-screen**, metade ela e metade o slide, não um crop que descarta o slide. Layout do Google Meet é fixo dentro de uma mesma gravação (câmera sempre no mesmo canto, slide sempre na mesma área) — os 2 blocos abaixo (Step 2) substituem o crop simples.

## Steps

### Step 1: Cortar via ffmpeg

Para cada trecho aprovado, cortar exatamente nos timestamps fornecidos pelo garimpeiro. Não ajustar os limites por conta própria.

### Step 2: Montar Split-Screen Vertical (9x16)

Antes de qualquer texto, compor o vertical 1080x1920 com dois blocos empilhados (`vstack`), cada um 1080x960:

1. **Identificar a posição da webcam e do slide** no frame 1920x1080 original — layout fixo dentro da mesma gravação do Meet (varia entre gravações diferentes, então confirmar com um frame de amostra a cada live nova, não assumir as mesmas coordenadas de sempre). Extrair um frame de teste (`ffmpeg -ss <t> -frames:v 1`) e inspecionar visualmente antes de aplicar em todos os cortes da live.
2. **Bloco de cima (webcam):** `crop` na região da câmera, depois `scale=1080:960:force_original_aspect_ratio=increase,crop=1080:960` (preenche o quadrado inteiro, corta o excesso — cara ocupa a tela toda, sem letterbox).
3. **Bloco de baixo (slide):** `crop` na região do slide, `scale=1080:<altura proporcional>` (mantém o slide legível, sem distorcer nem cortar texto), depois `pad=1080:960:0:<offset>:black` pra centralizar dentro do bloco de baixo.
4. `vstack=inputs=2` os dois blocos → output 1080x1920.
5. Não reaproveita `video-produce-zoom.py` aqui (esse script é pra crop único com zoom dinâmico em vídeo talking-head já escolhido, do squad-edicao-arcane — não resolve split de duas regiões simultâneas). Esse split-screen é capacidade própria do Clip Expert, não do squad-edicao-arcane.

### Step 3: Invocar o Stylist

Chamar o agente Stylist (`agents/squad-edicao-arcane/agents/stylist.md`) pra aplicar o `estilo-ativo.yaml` daquele squad. Se a Karol quiser mudar o estilo nesse momento, o Stylist conduz essa conversa — o cortador só aplica o resultado.

### Step 4: Queimar Legenda no Vão Entre os Blocos

Usar `agents/squad-edicao-arcane/scripts/video-captions.py` (mesma técnica de drawtext/estilo do squad-edicao-arcane, fonte OS-aware, `fontfile=` no Windows) pra queimar a legenda no split-screen **já montado** (a ordem importa — legendar antes do split faz o texto cortar errado). O `y_pos:0.60` do estilo padrão (`viral-euriler`) cai em cima do slide nesse formato — usar a variação `data/estilos/custom-viral-euriler-split.yaml` (fonte menor, `y_pos:0.50`), criada especificamente pra encaixar a legenda no vão preto entre os dois blocos, sem cobrir rosto nem slide. Nunca editar o `viral-euriler.yaml` original pra isso (regra do Stylist — preset fixo não muda, variação vai em arquivo custom separado).

### Step 5: Queimar Headline

Usar `agents/squad-edicao-arcane/scripts/video-headline.py` pra queimar um gancho curto (4-8 palavras) fixo no topo do vídeo, visível nos primeiros ~4s — função diferente da legenda (que acompanha a fala o vídeo inteiro). O texto do headline é uma síntese do gancho do corte, não a legenda sugerida do post.

### Step 6: Validar Encoding

Forçar 8-bit yuv420p + profile Main + faststart (mesmo padrão QG-SEA-004 do squad-edicao-arcane), resolução final 1080x1920. Reprocessar se algum corte falhar na validação.

### Step 7: Handoff

Handoff pra `entregar-e-notificar` com os arquivos finais prontos.

## Error Handling

| Cenário | Ação |
|---------|------|
| ffmpeg falha num corte específico | Reprocessar isoladamente, não descartar o trecho aprovado sem tentar de novo |
| Stylist ou squad-edicao-arcane indisponível | Reportar ao clip-chief — não aplica legenda "improvisada" |
| Encoding não bate o padrão após reprocessar | Escalar ao clip-chief como falha técnica |
