---
task: "Entregar e Notificar"
responsavel: "@cortador"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Cortes finais validados (de cortar-e-legendar)"
Saida: "Pasta de entrega populada + e-mail enviado pra Karol"
Checklist:
  - "Pasta videos-editados/clip-expert/{live}/ criada e populada"
  - "Legenda sugerida salva em texto junto de cada video"
  - "E-mail enviado avisando que os cortes estao prontos"
execution_type: "deterministic"
---

# Task: Entregar e Notificar

## Executive Summary

Organiza os cortes finais numa pasta dedicada à live e avisa a Karol por e-mail que estão prontos pra revisão.

## Steps

### Step 1: Organizar Pasta

Criar (se não existir) `videos-editados/clip-expert/{live-slug}/`. Salvar cada corte como `corte-{NN}.mp4`.

### Step 2: Salvar Legenda Sugerida

Junto de cada vídeo, salvar `corte-{NN}-legenda.txt` com a legenda sugerida em texto plano (facilita copiar/colar na hora de postar).

### Step 3: Enviar E-mail

Enviar e-mail pra Karol com: quantidade de cortes, nota de cada um, caminho da pasta. Usar o mecanismo de e-mail já configurado no ambiente.

### Step 4: Handoff

Handoff pro clip-chief (task `revisar-e-aprovar`) — a partir daqui, o processo aguarda a Karol.

## Error Handling

| Cenário | Ação |
|---------|------|
| SMTP/e-mail não configurado no ambiente | Avisar na sessão como alternativa — não falhar silenciosamente |
| Pasta da live já existe (reprocessamento) | Não sobrescrever cortes anteriores sem confirmação — perguntar antes |
