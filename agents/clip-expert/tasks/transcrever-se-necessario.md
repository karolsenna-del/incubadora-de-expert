---
task: "Transcrever Se Necessario"
responsavel: "@garimpeiro"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Arquivo de video bruto localizado (de detectar-live-nova)"
Saida: "Transcricao disponivel (existente ou gerada)"
Checklist:
  - "Verificado se transcricao ja existe"
  - "Se ausente, transcricao gerada via whisper-cli antes de prosseguir"
  - "Nenhum trecho pontuado sem transcricao completa"
execution_type: "deterministic"
---

# Task: Transcrever Se Necessário

## Executive Summary

Garante que existe transcrição completa antes de qualquer pontuação. Decisão explícita da Karol: precisão acima de velocidade — transcreve automaticamente quando falta, mesmo que isso demore mais.

## Steps

### Step 1: Verificar Transcrição Existente

Lives e mentorias por Google Meet costumam vir com transcrição própria. Verificar se ela está disponível junto do arquivo.

### Step 2: Transcrever se Ausente

Se não houver transcrição (ex: vídeo de palestra ou fonte externa sem legendas geradas pelo Meet): rodar transcrição reaproveitando o mesmo mecanismo já validado em `agents/squad-edicao-arcane/scripts/video-transcribe.py` (whisper-cli + prompt de nomes próprios) — sem recriar essa capacidade do zero. Requer que o squad-edicao-arcane esteja instalado com o modelo whisper já baixado.

### Step 3: Confirmar Completude

Não prosseguir pra pontuação com transcrição parcial. Se a transcrição falhar no meio, reprocessar antes de seguir.

### Step 4: Handoff

Handoff pra `pontuar-trechos` com a transcrição completa em mãos.

## Error Handling

| Cenário | Ação |
|---------|------|
| whisper-cli ou modelo ausente | Reportar que squad-edicao-arcane precisa estar instalado/configurado (ver `agents/squad-edicao-arcane/README.md`) |
| Transcrição gerada mas com muitos erros óbvios (nomes próprios errados) | Aplicar o mesmo dicionário de correções que o squad-edicao-arcane usa, se disponível |
