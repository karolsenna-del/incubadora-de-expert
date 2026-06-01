---
task: "Orientar Gravação"
responsavel: "@heygen-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Scripts aprovados + look definido por script"
Saida: "Usuário instruído pra gravar; áudio(s) recebido(s)"
Checklist:
  - "Script limpo entregue ao usuário (texto pra ler na gravação)"
  - "Instrução de gravação dada (ferramenta, tom, energia)"
  - "Áudio(s) recebido(s) com caminho válido"
  - "Mapeamento áudio ↔ script ↔ look confirmado"
execution_type: "interactive"
---

# Task: Orientar Gravação — O Gargalo do Pipeline

## Executive Summary

A gravação é a única coisa que o squad não faz sozinho. O Chief prepara o usuário: entrega o script limpo, instrui como gravar, recebe o áudio e confirma o mapeamento. Sem áudio, o operador não tem o que produzir.

## Steps

### Step 1: Entregar o script limpo

Para cada script aprovado, entregar o texto final puro — só o que vai ser falado, sem anotações de ângulo. O usuário vai ler isso na gravação.

### Step 2: Instruir a gravação

Passar a instrução:
- **Ferramenta:** Voice Memos do Mac (mais simples), QuickTime, ou qualquer gravador. Formato `.m4a` ou `.wav`.
- **Tom:** falar como se fosse pra um amigo, não pra câmera. O Avatar V espelha a energia da voz.
- **Energia por look:** talking head pede peso e pausa entre frases; selfie pede ritmo mais rápido e curiosidade.
- **Qualidade:** ambiente silencioso, headset/lapela se tiver. Mic do MacBook serve pra teste.
- **Duração:** a duração do vídeo = duração do áudio. Não dá pra editar trecho por texto depois.

### Step 3: Receber o(s) áudio(s)

O usuário grava e passa o caminho do arquivo (ou arrasta no chat). Confirmar que o arquivo existe e é áudio válido.

### Step 4: Confirmar o mapeamento (QG-HGN-03 — parte 1)

Confirmar com o usuário: qual áudio corresponde a qual script, e qual look vai pra cada um. Sem esse mapeamento claro, o operador produz errado.

### Step 5: Handoff

Passar pro operador-heygen-mcp (task `produzir-videos`) com áudios + mapeamento.

## Error Handling

| Cenário | Ação |
|---------|------|
| Caminho de áudio inválido / arquivo não existe | Pedir o caminho correto ou que o usuário arraste o arquivo |
| Usuário gravou áudio de duração muito diferente do script | Avisar — duração do vídeo segue o áudio; perguntar se quer regravar |
| Áudio com muito ruído de fundo | Sinalizar; sugerir regravar em ambiente silencioso pra teste valer |
| Usuário some no meio | Salvar os scripts aprovados; retomar da gravação na próxima |
