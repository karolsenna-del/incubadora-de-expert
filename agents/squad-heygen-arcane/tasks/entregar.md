---
task: "Entregar"
responsavel: "@operador-heygen-mcp"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "video_urls de vídeos completed"
Saida: "Vídeos baixados em ~/Downloads/, abertos no player, confirmados"
Checklist:
  - "Cada MP4 baixado em ~/Downloads/ com nome descritivo"
  - "Vídeos abertos no player do Mac"
  - "Resumo entregue ao usuário (links + duração + próximo passo)"
execution_type: "automated"
---

# Task: Entregar — Pacote Final

## Executive Summary

O operador baixa cada vídeo `completed` em `~/Downloads/` com nome descritivo, abre no player do Mac, e o Chief entrega o resumo com o próximo passo possível.

## Steps

### Step 1: Baixar os vídeos

Para cada `video_url`, baixar via `curl -sSL` em `~/Downloads/` com nome descritivo (ex: `heygen-ad1-confronto-talking-head.mp4`).

### Step 2: Abrir no player

Rodar `open` nos arquivos baixados pra exibir no player padrão do Mac.

### Step 3: Entregar o resumo

Apresentar ao usuário:
- Tabela: cada vídeo, look usado, ângulo, duração, caminho local
- Links da página HeyGen (`video_page_url`) e dos MP4
- Aviso: links diretos do HeyGen expiram (~7 dias) — os arquivos locais não

### Step 4: Apontar o próximo passo

Sugerir o que fazer com os vídeos:
- Rodar pelo `/process-video` (corte de silêncio + speed-up 1.25x + legenda viral)
- Ou subir direto pras campanhas / Reels

## Error Handling

| Cenário | Ação |
|---------|------|
| Download falha (link expirado) | Recapturar o video_url via get_video e baixar de novo |
| ~/Downloads/ não acessível | Baixar em path alternativo e informar o caminho ao usuário |
| Vídeo baixado corrompido (tamanho zero) | Rebaixar; se persistir, checar o vídeo no dashboard HeyGen |
