# 01 — Arquitetura do Pipeline

Visão geral de como o squad funciona — útil pra entender handoffs e debug.

## Filosofia

**Esteira linear com quality gates entre cada etapa.** Cada agent orquestra 1-2 skills (scripts) e roda seu próprio quality gate antes de passar pro próximo. Se um QG falha, o agent responsável corrige antes de ceder.

Não é deliberação paralela (não tem reunião de agents) — é cadeia de produção com inspeção a cada estação.

## Fluxo

```
Video bruto
   ↓
[@chief]       recebe, valida path
   ↓
[@installer]         doctor.py → QG-SEA-001
   ↓                         ↓ FAIL: install.py → re-doctor
[@cutter]      speech-cut → QG-SEA-002
   ↓                         ↓ alerta se fora 30-70%
[@scribe]      transcribe + revisão pt → QG-SEA-003
   ↓                         ↓ revisão na main thread (Opus)
[@finisher]    speed 1.2x + queimar legenda → QG-SEA-004 + QG-SEA-005
   ↓
[@chief]       entrega
```

## Por que essa divisão de agents

| Agent | Por que existe separado |
|---|---|
| **chief** | Ponto único de contato com expert. Sem isso, expert teria que saber quem chamar — squad fica complicado de usar |
| **ops** | Setup e diagnóstico são responsabilidade de infra, separados da edição. Tratá-los junto com cortar/legenda mistura concerns |
| **cutter** | Corte por fala usa Silero VAD (ferramenta diferente do whisper). Defaults críticos (threshold, min_silence) ficam centralizados |
| **scribe** | Único agent que **pensa** (revisão de português na main thread). Separar isso dos agents executores torna explícito onde está a inteligência |
| **finisher** | Acelerar + legendar são as duas últimas etapas antes da entrega. Juntos porque o speed precisa rodar antes da legenda (timestamps batem) |

## Por que NÃO tem @qa separado

Cada agent é dono do próprio quality gate. Auditoria separada gera ping-pong (qa rejeita → quem corrige? volta pro agent original?). Cada um responde pelo que produziu.

## Por que os scripts são embutidos (não importados de lib externa)

REGRA AUTOCONTIDO. Aluno baixa o squad, roda `install.py` (cross-platform), tudo funciona. Sem dependência de paths privados do criador do squad. Todos os scripts (`.py`, com `_common.py` compartilhado) vivem em `scripts/` dentro do próprio squad.

## Por que venv local (não global)

PEP 668 do Python do Homebrew bloqueia pip install global. E não queremos sujar o ambiente do aluno com `silero-vad` + `torch` (2GB) globalmente. Venv local em `.venv/` é isolado e descartável.

## Por que 1.2x e não outro speed

Validado pelo Euriler em talking-head real: 1.2x dá energia sem deixar a voz "esquilo" (atempo mantém pitch). 1.1x soa devagar. 1.25x já fica pesado pra ouvido sensível; 1.5x soa acelerado demais. 1.2x é o sweet spot pra Reels/TikTok dele.

Configurável via `--speed` se o expert quiser diferente — mas default é o validado.

## Por que estilo B (Bebas Neue 2 linhas branco/amarelo)

Estilo "Pop viral" / MrBeast / TikTok atual. Validado vs 3 mockups (A clean, B pop, C suave) e escolhido pelo expert. Posição Y=60% da altura é safe contra UI do WhatsApp Status, Reels, TikTok (que tampam o fundo).
