---
task: "Processar Input"
responsavel: "@estrategista-criativo"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Roteiro ou ideia de vídeo trazido pelo usuário"
Saida: "Input classificado por maturidade; roteiro completo se o input era ideia crua"
Checklist:
  - "Input classificado em ideia crua / roteiro sem direção / roteiro com estilo"
  - "Se ideia crua: roteiro gerado com estrutura hook-corpo-CTA"
  - "Hook prende nos 3 primeiros segundos"
  - "Fluxo roteado conforme a classificação"
execution_type: "semantic"
---

# Task: Processar Input

## Executive Summary

Primeira task do trabalho criativo. O estrategista-criativo recebe o que o usuário trouxe, classifica o nível de maturidade e — se for só uma ideia — transforma em roteiro usando as melhores práticas de anúncio.

## Steps

### Step 1: Classificar a maturidade do input

Decision point (PU-has-014). Classificar em um de três níveis:

- **Ideia crua** — só um conceito, sem roteiro → Step 2
- **Roteiro sem direção** — texto pronto, sem formato definido → segue pra `propor-conceito`
- **Roteiro com estilo** — roteiro + formato indicado → segue pra `validar-conceito`

Na dúvida, perguntar ao usuário — não assumir.

### Step 2: Roteirizar (só se ideia crua)

Transformar a ideia em roteiro com a estrutura hook-corpo-CTA:

- **Hook (0-3s)** — prende imediatamente. Usar um tipo da KB (revelação, curiosidade, identificação, contrarian, FOMO).
- **Corpo** — desenvolve a mensagem.
- **CTA** — ação clara no fim.

Referência: `data/melhores-praticas-anuncio.md`.

### Step 3: Validar o hook

Aplicar a regra dos 3 segundos: se o hook não prende nos 3 primeiros segundos, reescrever o arranque antes de seguir.

## Error Handling

| Cenário | Ação |
|---------|------|
| Input vago demais pra classificar | Perguntar ao usuário: ideia, roteiro, ou roteiro com formato? |
| Hook fraco no roteiro recebido | Apontar e propor reescrever só o arranque, mantendo corpo e CTA |
| Roteiro promete resultado não confirmado | Recusar a promessa e sugerir reformular |
