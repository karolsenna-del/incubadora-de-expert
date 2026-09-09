# Clip Expert

Encontra sozinho os melhores trechos da live semanal da Incubadora de Expert e entrega já cortados e legendados, usando os critérios do agente Expert Viral e o Stylist do squad-edicao-arcane.

## Ativação

```
/clipExpert
```

## O que faz

```
Live semanal (quarta)
  -> weekly-sync (course-publisher) processa e registra em encontros_mentoria
  -> Clip Expert detecta linha nova e pega o video bruto no Drive
  -> transcreve automaticamente se faltar transcricao
  -> pontua trechos candidatos (criterios do Expert Viral, 0-10)
  -> descarta abaixo da nota minima (menos cortes > corte fraco)
  -> corta + legenda (via Stylist do squad-edicao-arcane)
  -> entrega em pasta local + avisa por e-mail
  -> Karol revisa e aprova
  -> aprovados entram na fila do Postador (business/instagram/fila-reels/)
```

## Agentes

| Agente | Role |
|--------|------|
| @clip-chief | Orquestrador. Conduz o status, a revisão/aprovação e o handoff pro Postador. |
| @garimpeiro | Detecta live nova, transcreve se necessário, pontua trechos usando o Expert Viral. |
| @cortador | Corta, legenda (via Stylist), entrega e notifica. |

## Pré-requisitos

- **squad-edicao-arcane** instalado e configurado (ffmpeg, whisper-cli, fontes, Stylist) — o Clip Expert reaproveita a infraestrutura dele em vez de duplicar
- **expert-viral** instalado (`agents/expert-viral/`) — fonte dos critérios de pontuação
- **course-publisher** instalado e rodando (`weekly-sync`) — fonte da detecção de live nova
- **insta-scheduler** (Postador) instalado — destino da fila de aprovação (nota: ele ainda não publica REELS via API, só CAROUSEL/STORIES — ver limitação abaixo)
- Acesso configurado ao Google Drive (pasta "Live Expert360 (recurring)") e à tabela Supabase `encontros_mentoria`, com as mesmas credenciais que o `course-publisher` já usa
- E-mail configurado no ambiente pra notificação (opcional — sem isso, o squad avisa na sessão)

## Limitação conhecida — publicação de Reels

O Postador (`insta-scheduler`) hoje publica CAROUSEL e STORIES via Meta Graph API, mas **não REELS**. O Clip Expert prepara e deixa os cortes aprovados prontos em `business/instagram/fila-reels/`, mas a publicação automática real ainda depende de uma extensão futura do Postador ou de publicação manual pela Karol. Isso está documentado no PRD (`docs/prd/squad-clip-expert.md`, CON-004) e não é um bug deste squad.

## Calibração inicial

A nota mínima de corte (`data/nota-minima.yaml`) começa em 7.0 — valor conservador, ainda não testado em vídeo real. Rode o squad nas primeiras 3-4 lives acompanhando de perto (ver Checklist de Calibração Inicial em `data/clip-expert-kb.md`) antes de deixar rodando 100% em piloto automático.

## Estrutura

```
clip-expert/
├── README.md
├── squad.yaml
├── agents/
│   ├── clip-chief.md
│   ├── garimpeiro.md
│   └── cortador.md
├── tasks/
│   ├── start.md
│   ├── detectar-live-nova.md
│   ├── transcrever-se-necessario.md
│   ├── pontuar-trechos.md
│   ├── cortar-e-legendar.md
│   ├── entregar-e-notificar.md
│   └── revisar-e-aprovar.md
├── workflows/
│   └── wf-clip-expert.yaml
├── checklists/
│   └── quality-gate-nota-minima.md
├── data/
│   ├── clip-expert-kb.md
│   ├── nota-minima.yaml
│   └── ultima-live-processada.yaml
└── scripts/
    └── score_clip.py
```

## Gerado por

Squad Forge, a partir do processo "Clip Expert" extraído da Karol (16 PUs, 3 rounds, playback validado em 2026-09-08).
PRD: `docs/prd/squad-clip-expert.md` · Stories: `docs/stories/squad-forge/clip-expert/` · Tracker: `business/campanhas/squad-clip-expert/tracker.md`
