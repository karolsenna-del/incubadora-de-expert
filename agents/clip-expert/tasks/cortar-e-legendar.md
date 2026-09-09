---
task: "Cortar e Legendar"
responsavel: "@cortador"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Lista de trechos aprovados (timestamps + nota) do garimpeiro"
Saida: "Arquivos de video cortados e legendados, validados no encoding"
Checklist:
  - "Corte gerado exatamente nos timestamps aprovados"
  - "Legenda aplicada via agente Stylist (squad-edicao-arcane), nao escolhida pelo cortador"
  - "Encoding validado: 8-bit yuv420p, profile Main, faststart"
execution_type: "deterministic"
---

# Task: Cortar e Legendar

## Executive Summary

Transforma cada trecho aprovado num arquivo de vídeo final, com legenda queimada no estilo já validado pelo Stylist do squad-edicao-arcane.

## Steps

### Step 1: Cortar via ffmpeg

Para cada trecho aprovado, cortar exatamente nos timestamps fornecidos pelo garimpeiro. Não ajustar os limites por conta própria.

### Step 2: Invocar o Stylist

Chamar o agente Stylist (`agents/squad-edicao-arcane/agents/stylist.md`) pra aplicar o `estilo-ativo.yaml` daquele squad. Se a Karol quiser mudar o estilo nesse momento, o Stylist conduz essa conversa — o cortador só aplica o resultado.

### Step 3: Queimar Legenda

Usar a mesma técnica de drawtext/estilo do squad-edicao-arcane (fonte OS-aware, `fontfile=` no Windows) pra queimar a legenda no corte.

### Step 4: Validar Encoding

Forçar 8-bit yuv420p + profile Main + faststart (mesmo padrão QG-SEA-004 do squad-edicao-arcane). Reprocessar se algum corte falhar na validação.

### Step 5: Handoff

Handoff pra `entregar-e-notificar` com os arquivos finais prontos.

## Error Handling

| Cenário | Ação |
|---------|------|
| ffmpeg falha num corte específico | Reprocessar isoladamente, não descartar o trecho aprovado sem tentar de novo |
| Stylist ou squad-edicao-arcane indisponível | Reportar ao clip-chief — não aplica legenda "improvisada" |
| Encoding não bate o padrão após reprocessar | Escalar ao clip-chief como falha técnica |
