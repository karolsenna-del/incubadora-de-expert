---
task: "Detectar Live Nova"
responsavel: "@garimpeiro"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: |
  Tabela Supabase encontros_mentoria (mesmo acesso do course-publisher),
  data/ultima-live-processada.yaml
Saida: |
  Confirmacao de live nova + caminho do arquivo bruto no Drive, ou
  confirmacao de que nao ha live nova
Checklist:
  - "Linha mais recente de encontros_mentoria comparada com ultima-live-processada.yaml"
  - "Arquivo correspondente localizado na pasta do Drive 'Live Expert360 (recurring)'"
  - "Nenhuma live reprocessada indevidamente"
execution_type: "deterministic"
---

# Task: Detectar Live Nova

## Executive Summary

Verifica se o course-publisher processou uma live que este squad ainda não viu, e localiza o arquivo bruto correspondente no Drive (preferindo-o ao YouTube já comprimido).

## Steps

### Step 1: Consultar encontros_mentoria

Buscar a linha mais recente (mesmo mecanismo de acesso que `agents/course-publisher/scripts/` usa pra essa tabela — reaproveitar a mesma configuração de credenciais, não recriar).

### Step 2: Comparar com Estado Local

Ler `data/ultima-live-processada.yaml`. Se o título/data da linha mais recente já bate com o registrado, não há live nova — reportar isso e parar aqui.

### Step 3: Localizar Arquivo no Drive

Se há live nova: buscar na pasta "Live Expert360 (recurring)" o arquivo cujo `createdTime`/título bate com a linha da tabela. Preferir esse arquivo (qualidade original) ao invés do vídeo já no YouTube.

### Step 4: Handoff

Se transcrição existe → handoff direto pra `pontuar-trechos`.
Se não existe → handoff pra `transcrever-se-necessario`.

## Error Handling

| Cenário | Ação |
|---------|------|
| Linha nova em encontros_mentoria sem arquivo correspondente no Drive | Reportar ao clip-chief, não inventar origem alternativa (ex: não usar o YouTube como substituto silencioso) |
| Falha de acesso ao Drive ou Supabase | Reportar erro técnico claro, sugerir checar `agents/course-publisher/data/weekly-sync-state.yaml` pra ver se há pendência conhecida |
