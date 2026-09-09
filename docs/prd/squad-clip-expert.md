# PRD: Squad Clip Expert

**Slug:** clip-expert
**Version:** 1.0.0
**Created:** 2026-09-08
**Source process:** Clip Expert (16 PUs extraídos, 3 rounds, 7/8 lentes)
**Status:** Approved (via QG-SF-002 — playback validado 2026-09-08)

---

## Visão

Toda quarta-feira Karol grava a live semanal da Incubadora de Expert. Hoje, achar os melhores momentos pra virar Reels depende dela mesma reassistir a live inteira e decidir o que cortar — trabalho manual, repetitivo, e que compete com o tempo dela de criar conteúdo novo. O Clip Expert existe pra fazer essa curadoria sozinho: assim que a automação `weekly-sync` (squad `course-publisher`) processa a live, o Clip Expert pega o vídeo bruto, encontra os melhores trechos usando os mesmos critérios do agente Expert Viral (gancho, retenção, anti-padrões), corta, legenda, e entrega pronto pra Karol só revisar e aprovar. Diferente de assistir manualmente, o squad aplica um critério consistente e documentado a cada vídeo, sem cansaço e sem viés do dia.

## Escopo

### In-scope

- Disparo automático ao detectar linha nova em `encontros_mentoria` (Supabase), inserida pelo `weekly-sync` do `course-publisher`
- Busca do vídeo bruto na pasta do Drive "Live Expert360 (recurring)"
- Transcrição automática quando o vídeo de entrada não tem transcrição
- Pontuação de trechos candidatos usando os critérios do agente Expert Viral (gancho, retenção, anti-padrões)
- Quality gate de nota mínima (0-10) — descarta corte fraco em vez de forçar quantidade
- Geração de 10 a 15 cortes de ~1min por vídeo longo (podendo entregar menos se não houver momentos bons o suficiente)
- Corte + legenda queimada (reaproveitando o agente Stylist do squad-edicao-arcane)
- Entrega numa pasta local + aviso por e-mail
- Handoff pra fila do Postador (`insta-scheduler`) após aprovação da Karol

### Out-of-scope

- Baixar/processar a live do zero (isso é do `course-publisher` — o Clip Expert só consome o resultado)
- Definir critérios de "corte bom" do zero (reaproveita 100% do Expert Viral — não inventa critério novo)
- Escolher estilo de legenda do zero (reaproveita 100% do Stylist do squad-edicao-arcane)
- Publicar automaticamente sem revisão da Karol (ela sempre revisa antes de aprovar)
- **Publicação real do Reels via API** — o Postador (`insta-scheduler`) hoje só publica CAROUSEL e STORIES via Meta Graph API. REELS não está implementado nele ainda (ver CON-004). O Clip Expert prepara e deixa na fila; a publicação efetiva do Reels depende dessa extensão futura do Postador ou de publicação manual pela Karol.

## Personas

### Persona Primária

- **Nome do papel:** Karol Senna, dona da Incubadora de Expert
- **Contexto:** Grava live semanal (quarta), tem pouco tempo pra reassistir e recortar manualmente
- **Objetivo principal ao usar o squad:** Receber cortes prontos pra postar sem precisar reassistir a live inteira
- **Frequência de uso:** Semanal (1x por live), revisão leva minutos em vez de horas

### Personas Secundárias

- Nenhuma — o output é consumido só pela Karol (revisão) e pelo Postador (agente, não pessoa)

## Functional Requirements

**FR-001:** O squad detecta automaticamente quando uma nova live foi processada pelo `course-publisher`, verificando linha nova em `encontros_mentoria`.
- Origem: PU-clip-expert-003, PU-clip-expert-012
- Agente responsável: garimpeiro
- Acceptance criteria:
  - [ ] Squad identifica a linha mais recente em `encontros_mentoria` que ainda não foi processada por ele
  - [ ] Squad localiza o arquivo correspondente na pasta do Drive "Live Expert360 (recurring)" pelo título/data

**FR-002:** O squad verifica se o vídeo de entrada tem transcrição disponível e, se não tiver, transcreve automaticamente antes de prosseguir.
- Origem: PU-clip-expert-004, PU-clip-expert-005
- Agente responsável: garimpeiro
- Acceptance criteria:
  - [ ] Se transcrição existe, pula direto pra pontuação
  - [ ] Se não existe, roda transcrição (reaproveitando `video-transcribe.py` do squad-edicao-arcane) antes de pontuar

**FR-003:** O squad pontua trechos candidatos da transcrição usando os critérios do agente Expert Viral.
- Origem: PU-clip-expert-007
- Agente responsável: garimpeiro
- Acceptance criteria:
  - [ ] Critérios usados são os mesmos do Expert Viral (gancho, retenção, anti-padrões) — nenhum critério novo inventado
  - [ ] Cada trecho candidato recebe nota de 0 a 10

**FR-004:** O squad descarta trechos abaixo da nota mínima, entregando menos cortes em vez de forçar o número.
- Origem: PU-clip-expert-008, PU-clip-expert-009
- Agente responsável: garimpeiro
- Acceptance criteria:
  - [ ] Nenhum corte com nota abaixo do threshold configurado é entregue
  - [ ] Se sobrarem menos de 10 trechos aprovados, o squad entrega os que existem (nunca inventa quantidade)

**FR-005:** O squad corta os trechos aprovados e queima legenda usando o estilo definido pelo agente Stylist.
- Origem: PU-clip-expert-010, PU-clip-expert-015
- Agente responsável: cortador
- Acceptance criteria:
  - [ ] Corte gerado com ffmpeg a partir dos timestamps aprovados
  - [ ] Legenda queimada usando o `estilo-ativo.yaml` do squad-edicao-arcane (mesma fonte/cor validada)

**FR-006:** O squad salva os cortes finais numa pasta local e avisa a Karol por e-mail.
- Origem: PU-clip-expert-010, PU-clip-expert-011
- Agente responsável: cortador
- Acceptance criteria:
  - [ ] Pasta de saída contém 1 arquivo de vídeo final por corte aprovado + a legenda sugerida em texto
  - [ ] E-mail enviado pra Karol avisando que os cortes estão prontos, com o caminho da pasta

**FR-007:** Após a Karol revisar e aprovar os cortes, eles entram na fila do Postador.
- Origem: PU-clip-expert-013, PU-clip-expert-014
- Agente responsável: clip-chief
- Acceptance criteria:
  - [ ] Corte aprovado é copiado/registrado na convenção de fila que o Postador espera
  - [ ] Karol não precisa executar nenhum passo manual de agendamento — só aprovar

## Non-Functional Requirements

**NFR-001:** Precisão de curadoria acima de velocidade.
- Origem: PU-clip-expert-005 (transcrever mesmo que demore mais)
- Tipo: Quality
- Threshold: Squad sempre transcreve antes de pontuar quando falta transcrição, mesmo que isso signifique um vídeo demorar minutos a mais pra processar

**NFR-002:** Nenhum corte abaixo da nota mínima.
- Origem: PU-clip-expert-008, PU-clip-expert-009
- Tipo: Quality
- Threshold: 0 cortes entregues com nota abaixo do limiar configurado em `data/nota-minima.yaml` (calibrado nos primeiros vídeos reais, default inicial documentado na KB)

**NFR-003:** Consistência de critério entre Clip Expert e Expert Viral.
- Origem: PU-clip-expert-007, PU-clip-expert-016
- Tipo: Quality
- Threshold: 100% dos critérios de pontuação usados vêm do Expert Viral — 0 critérios inventados pelo Clip Expert

## Constraints

**CON-001:** Vídeo bruto depende do `course-publisher` já ter processado a live.
- Origem: PU-clip-expert-002, PU-clip-expert-012
- Tipo: Technical
- Impacto: Se o `weekly-sync` falhar ou atrasar (já aconteceu por bloqueio de acesso ao Drive, ver `agents/course-publisher/data/weekly-sync-state.yaml`), o Clip Expert não tem o que processar naquela semana

**CON-002:** Critério de qualidade depende do Expert Viral estar disponível e coerente.
- Origem: PU-clip-expert-007
- Tipo: Technical
- Impacto: Se o Expert Viral mudar critérios, o Clip Expert herda a mudança automaticamente (é dependência, não cópia)

**CON-003:** Estilo de legenda depende do Stylist do squad-edicao-arcane (incluindo dependências de fonte/ffmpeg desse squad).
- Origem: PU-clip-expert-015
- Tipo: Technical
- Impacto: Se `squad-edicao-arcane` não estiver instalado/configurado (ffmpeg, fontes, whisper-cli), o Clip Expert não consegue legendar

**CON-004:** Postador (`insta-scheduler`) hoje não publica REELS via Meta Graph API — só CAROUSEL e STORIES.
- Origem: descoberto durante Fase 3 (arquitetura), lendo `agents/insta-scheduler/data/insta-scheduler-kb.md`
- Tipo: Technical
- Impacto: Cortes aprovados ficam preparados numa fila própria (`business/instagram/fila-reels/`), mas a publicação automática real depende de uma extensão futura do Postador pra suportar `media_type=REELS`, ou de publicação manual pela Karol enquanto isso não existe. Documentado explicitamente — não inventado como se já funcionasse.

## Success Criteria

**SC-001:** Squad entrega cortes sem intervenção manual da Karol até o ponto de revisão.
- Mensurável via: nenhuma ação da Karol entre a live acontecer e os cortes aparecerem na pasta + e-mail
- FRs cobertos: [FR-001, FR-002, FR-003, FR-004, FR-005, FR-006]

**SC-002:** Nenhum corte fraco é entregue.
- Mensurável via: 100% dos cortes na pasta de saída têm nota >= threshold configurado
- FRs cobertos: [FR-004]

**SC-003:** Aprovação da Karol é o único passo manual entre live e fila de publicação.
- Mensurável via: 0 passos manuais adicionais entre "Karol aprova" e "corte está na fila do Postador"
- FRs cobertos: [FR-007]

## Trace Matrix

| PU-ID | Tipo | Vira em |
|-------|------|---------|
| PU-clip-expert-001 | STEP | Contexto (fora do squad — live acontece) |
| PU-clip-expert-002 | DEPENDENCY | CON-001 |
| PU-clip-expert-003 | STEP | FR-001 |
| PU-clip-expert-004 | INPUT | FR-002 |
| PU-clip-expert-005 | DECISION | FR-002, NFR-001 |
| PU-clip-expert-006 | OUTPUT | FR-004 (quantidade de cortes) |
| PU-clip-expert-007 | DEPENDENCY | FR-003, CON-002, NFR-003 |
| PU-clip-expert-008 | QUALITY_GATE | FR-004, NFR-002 |
| PU-clip-expert-009 | EXCEPTION | FR-004 |
| PU-clip-expert-010 | OUTPUT | FR-005, FR-006 |
| PU-clip-expert-011 | OUTPUT | FR-006 |
| PU-clip-expert-012 | INPUT | FR-001, CON-001 |
| PU-clip-expert-013 | STEP | FR-007 (touchpoint humano) |
| PU-clip-expert-014 | DEPENDENCY | FR-007, CON-004 |
| PU-clip-expert-015 | DECISION | FR-005, CON-003 |
| PU-clip-expert-016 | TACIT | NFR-003 |

> Trace matrix prova rastreabilidade — cada elemento do PRD veio de PU específico.

---

## Quality Check (antes de fechar)

- [x] Todos os PU-STEPs viraram pelo menos 1 FR
- [x] Todos os PU-QUALITY_GATEs viraram NFR
- [x] Todos os PU-DEPENDENCYs externos viraram CON
- [x] Cada FR/NFR/CON tem Origem rastreável
- [x] Trace matrix completa
- [x] Vocabulário do usuário (nao termos inventados)
