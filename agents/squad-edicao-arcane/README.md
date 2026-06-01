# Squad Edição Arcane

**Squad de edição de vídeo Reels/Shorts/TikTok pra experts da Mentoria Arcane.**

Pega seu vídeo bruto talking-head e devolve um vídeo pronto pra postar — com corte por fala, aceleração e legenda no estilo viral validado.

---

## O que faz

```
Video bruto (4min talking-head)
  ↓ corte por fala (Silero VAD agressivo)        ← 50% removido (respiração mínima)
  ↓ aceleração 1.2x (mantém pitch)              ← +energia, mesma voz
  ↓ legenda estilo B (Bebas Neue, branco/amarelo) ← estilo viral
  ↓ encoding 8-bit profile Main + faststart      ← abre em qualquer player
Video final (1min30s, pronto pra Reels)
```

## Pré-requisito

Ter o **Auroq OS** instalado (`npx auroq-os init` numa pasta sua — geralmente `~/auroq-os/` ou `~/meu-negocio/`). Se ainda não tem, instala primeiro.

## Como ativar

### Primeira vez (instalação)

1. **Extraia o ZIP** do squad **dentro do teu projeto Auroq**, em `agents/`:

   ```bash
   cd <seu-projeto-auroq>/agents/
   unzip ~/Downloads/auroq-squad-edicao-arcane.zip
   ```

2. **Roda o instalador:**

   ```bash
   cd squad-edicao-arcane
   bash install.sh
   ```

   Faz tudo: detecta o projeto Auroq, instala `ffmpeg`/`whisper-cpp`/modelo medium (1.5GB), cria venv local, instala fonte Bebas Neue, **registra o slash command** em `<projeto>/.claude/commands/auroq-squad-edicao-arcane.md`.

### Editar vídeo

Abre o Claude Code dentro do projeto Auroq e:

```
/auroq-squad-edicao-arcane
```

Ou falar com o Claude direto: *"edita esse vídeo: /Users/seunome/Movies/X.mov"*

## Arquitetura (7 agents, 6 quality gates)

```
[chief] Vector — recebe vídeo, roteia, entrega
  ↓
[installer] Forge — instala / valida ambiente → QG-SEA-001
  ↓
[cutter] Tesoura — corte por fala (Silero VAD) → QG-SEA-002
  ↓
[scribe] Letra — transcribe + revisar português + speed 1.2x → QG-SEA-003
  ↓
[zoomer] Lente — Claude classifica sections + zoom dinâmico no rosto → QG-SEA-006
  ↓
[finisher] Finalizador — legenda (estilo ativo) + trilha → QG-SEA-004 + QG-SEA-005
  ↓
[chief] entrega
```

**Fora da esteira:** `[stylist] Curador` — troca/customiza o estilo de legenda (catálogo, referência ou pesquisa web). Ativado sob demanda ("muda legenda").

Cada specialist orquestra 1-3 skills (scripts em `scripts/`) e roda seu próprio quality gate antes do handoff.

**Zoom e trilha:**
- Zoom roda por default. Pra desligar: "sem zoom". A classificação normal/emphasis/critical é feita pelo **Claude** lendo o transcript (não heurística — o squad sempre roda dentro do Claude Code).
- Trilha default embarcada em `data/trilhas/default.mp3` (ambient uplifting, volume baixo). Aluno pode passar a própria, ou pedir "sem trilha".

## Configuração do expert

Antes de editar o primeiro vídeo, edite `data/nomes-proprios.yaml` com **seus nomes próprios** (seu nome, equipe, marca, produto). Isso faz o whisper acertar e a legenda sair com português correto.

Exemplo (apague o exemplo e bote os seus):

```yaml
nomes_corretos:
  - "Seu Nome"
  - "Sua Marca"
  - "Seu Produto Principal"

correcoes_automaticas:
  - errado: "Sue Nome"    # como whisper transcreveu errado
    correto: "Seu Nome"
```

Detalhes em `knowledge/03-dicionario-correcoes.md`.

## Estrutura

```
squad-edicao-arcane/
├── README.md                    (este arquivo)
├── squad.yaml                   (manifesto)
├── skill.md                     (chief activation — slash command)
├── install.sh                   (setup inicial)
├── agents/
│   ├── chief.md                 (Vector — orquestrador)
│   ├── installer.md                   (Forge — install + doctor)
│   ├── cutter.md                (Tesoura — speech-cut)
│   ├── scribe.md                (Letra — transcribe + revisar pt)
│   └── finisher.md              (Finalizador — speed + legenda)
├── tasks/
│   ├── start.md                 (entry point — greeting + roteamento)
│   ├── instalar.md              (setup inicial)
│   └── diagnosticar.md          (doctor)
├── workflows/
│   └── pipeline-edicao.md       (workflow master da esteira completa)
├── scripts/
│   ├── video-speech-cut.py      (Silero VAD agressivo)
│   ├── video-speed-up.sh        (1.2x mantendo pitch)
│   ├── video-transcribe.sh      (whisper + prompt)
│   ├── video-captions.py (legenda estilo viral)
│   └── doctor.sh                (health check)
├── knowledge/
│   ├── 01-pipeline-arquitetura.md  (visão geral)
│   ├── 02-defaults-validados.md    (params + por quê)
│   ├── 03-dicionario-correcoes.md  (configurar nomes)
│   └── 04-troubleshooting.md       (10 bugs conhecidos + solução)
└── data/
    ├── nomes-proprios.yaml      (configurável pelo expert)
    └── fontes/
        └── BebasNeue-Regular.ttf (60KB — embarcada)
```

## Requisitos

- **macOS** (Apple Silicon M1/M2/M3/M4 — outros precisam adaptar paths)
- **Homebrew** instalado
- **~3 GB de espaço** (modelo whisper 1.5GB + venv ~1GB + fonte/scripts)
- **Tempo de instalação:** ~5-10 min (depende da conexão pra baixar o modelo)

## Tempos típicos por vídeo

| Duração original | Tempo de processamento (M2/M3/M4) |
|---|---|
| 1 min | ~2 min |
| 3 min | ~5 min |
| 5 min | ~8 min |
| 10 min | ~15 min |

Maior parte do tempo é o re-encoding do vídeo (a 1080p). Whisper + Silero VAD rodam em GPU e são rápidos.

## O que NÃO faz

- **Color grade** — fora do escopo
- **Master audio broadcast** (-16 LUFS) — fora do escopo
- **B-roll insert** — fora do escopo (decisão editorial humana)
- **Multi-câmera** — fora do escopo

Se quiser algum desses, edita o `_final.mp4` num app de edição (CapCut, Premiere) depois.

> **Já faz por default:** zoom dinâmico no rosto + trilha musical de fundo com ducking. Pra desligar em algum vídeo: `*tirar-zoom` ou `*sem-trilha`.

## Diferença pra outros squads Arcane

Esse squad é **técnico-operacional**, não criativo. Não tem agentes "pensando" sobre conteúdo (exceto o @scribe que revisa português). É uma esteira de produção — agentes executam skills com defaults validados.

Pra **produzir conteúdo** (escolher tema, escrever roteiro), use o `/squad-conteudo-arcane`. Pra **editar** o vídeo que você gravou desse conteúdo, use este squad.

---

**Versão:** 1.0.0
**Criado:** 19/05/2026
**Criado por:** Euriler Jubé via Squad Forge (UC1 acelerado — pipeline validado iterativamente em conversa)
**Validado em:** vídeo IMG_6894 (4min09s talking-head) → 1min44s Reels pronto, todos os QGs PASS
