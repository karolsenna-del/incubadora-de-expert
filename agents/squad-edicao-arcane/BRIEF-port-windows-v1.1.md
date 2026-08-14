# BRIEF — Port Cross-Platform do Squad Edição Arcane (v1.0.0 → v1.1.0)

> **Autor da auditoria:** Jarvis · **Decisão:** Euriler (10/07/2026) · **Executor:** @squad-creator
> **Backup do v1.0.0:** `squads/_backups/squad-edicao-arcane-v1.0.0-2026-07-10.zip`

---

## 1. Objetivo

Fazer o squad rodar **nativamente em Windows 10/11**, mantendo o Mac funcionando (retrocompat). Público-alvo: experts não-devs da Mentoria Arcane — maioria provável em Windows. **Sem exigir WSL nem Docker do aluno.**

Gatilho: feedback de aluno Windows reportando que o instalador é Mac-only (brew, GPU Metal), que a legenda depende de fontconfig (inexistente no Windows) e que corte/zoom precisam de venv com silero-vad/opencv. Só a trilha (ffmpeg puro) roda.

## 2. Decisão arquitetural (Euriler)

**Opção 1 — instalador cross-platform ÚNICO em Python.** Python já é dependência do squad (venv). Elimina manter `.sh` + `.ps1` em paralelo. Aluno roda o mesmo comando em qualquer SO. **Corrigir já** (prioridade alta — buraco de produto, não bug isolado: a Arcane entrega squads como camada de entrega; Mac-only exclui metade da base).

## 3. Diagnóstico — a raiz do problema

**Nada no processamento é intrinsecamente Mac.** ffmpeg, whisper, torch, silero-vad, opencv rodam igual em Windows. O acoplamento está na **camada de instalação e resolução de caminhos**. Quatro pontos concretos:

### Ponto 1 — Instalador Mac-only (`install.sh`)
- Gate explícito `if [[ "$(uname)" != "Darwin" ]]; then exit 1` — recusa rodar fora do Mac.
- Assume `brew`, `xcode-select`, fontes em `~/Library/Fonts` + `fc-cache`/`fc-match`, modelo whisper em `/opt/homebrew/share/whisper-cpp/models/`, venv em `.venv/bin/` (Windows é `.venv/Scripts/`).

### Ponto 2 — Resolução de binário hardcoded (todos os 6 scripts)
- `_bin()` (nos `.py` e `.sh`) só procura em `/opt/homebrew/bin` e `/usr/local/bin`. No Windows não existem → cai pro PATH cru, só funciona se o aluno tiver posto ffmpeg no PATH na mão.

### Ponto 3 — `/tmp/` cravado (scripts `.py` e `.sh`)
- wav intermediário e os filter-scripts do ffmpeg escritos em `/tmp/...`. Windows não tem `/tmp/`. Derruba speech-cut, zoom, captions, transcribe e music.

### Ponto 4 — Legenda via fontconfig (`video-captions.py`)
- `drawtext=font='Bebas Neue'` resolve por **nome** → depende de fontconfig, que o ffmpeg de Windows normalmente **não** traz compilado.
- **Correção certa:** trocar `font=` por `fontfile=<caminho do .ttf embarcado>` (o squad já tem os `.ttf` em `data/fontes/`). Mata a dependência de fontconfig e fica mais robusto no Mac também. NÃO tentar instalar fontconfig no Windows (foi o caminho difícil que o aluno tentou).

> **Mito a desfazer:** silero-vad/opencv NÃO são o bloqueio — têm wheel Windows e instalam liso. O bloqueio é o instalador Mac-only, não o ambiente Python em si.

## 4. Escopo de implementação

### 4.1 `install.sh` → `install.py` cross-platform
- Detectar SO via `platform.system()` (Darwin/Windows/Linux). Remover o gate de Darwin.
- **Deps de sistema (ffmpeg + whisper):**
  - Mac: `brew install ffmpeg whisper-cpp` (mantém).
  - Windows: `winget install` (fallback `choco`); se nenhum package manager, instruir download manual com link. **Garantir ffmpeg com os filtros usados: `drawtext` (com freetype) e `sidechaincompress`.** Builds gyan.dev / BtbN pro Windows trazem drawtext — validar na prática.
- **Modelo whisper:** path por SO. Mac mantém `/opt/homebrew/share/whisper-cpp/models/`; Windows guardar dentro do squad (`<squad>/models/ggml-medium.bin`) pra não depender de layout brew. Baixar via `urllib`/`requests` do mesmo `MODEL_URL`.
- **venv:** criar com `sys.executable -m venv`; resolver pip/python por SO (`Scripts/` no Windows, `bin/` no Mac). Pacotes idênticos: `silero-vad torch torchaudio scipy numpy fonttools pyyaml opencv-python-headless`.
- **Fontes:** com o Ponto 4 (fontfile), a instalação de fonte no sistema deixa de ser obrigatória. Manter cópia opcional no Mac; no Windows, dispensável.
- **Registro do slash command:** `find_auroq_root` + wrapper em `.claude/commands/` é portável com `pathlib`. **Evitar symlink** (no Windows exige privilégio) — usar cópia do wrapper ou junction.

### 4.2 `_bin()` cross-platform (nos scripts que sobrarem em `.py`)
- Ordem: `shutil.which(name)` primeiro (respeita PATH, cobre Windows) → depois candidatos por SO (brew paths no Mac; dirs de winget/choco no Windows) como fallback.

### 4.3 `/tmp/` → `tempfile`
- Usar `tempfile.gettempdir()` / `NamedTemporaryFile` nos `.py`. Afeta `video-speech-cut.py`, `video-produce-zoom.py`, `video-captions.py`.

### 4.4 `font=` → `fontfile=` em `video-captions.py`
- Trocar resolução por nome por caminho do `.ttf` embarcado. Mapear cada estilo → seu `.ttf` (Bebas/Montserrat/Poppins) — adicionar campo `fontfile` nos yamls de estilo (`data/estilos/*.yaml`) ou mapear por nome.
- **Cuidado com escaping no Windows:** path com `C:\...` quebra o filtergraph do ffmpeg (o `:` do drive e as `\`). Usar forward slashes e escapar o drive-colon; como já usam `-filter_complex_script` (arquivo), garantir o path escapado dentro do script.

### 4.5 Os 3 `.sh` → `.py` (rodar sem bash no Windows)
- `video-speed-up.sh`, `video-transcribe.sh`, `video-add-music.sh` viram `.py` — elimina dependência de bash/Git Bash e unifica `_bin`/`tempfile`/`fontfile`.
- **Atualizar os agents** que chamam esses scripts (comandos passam de `bash ...sh` para `python ...py`).
- `video-transcribe.sh`: o prompt de nomes próprios e o path do modelo por SO precisam vir junto.

### 4.6 Doc + agents + doctor
- `doctor.sh` → `doctor.py` cross-platform (binário via `which`, filtros drawtext/sidechaincompress, venv `Scripts`/`bin`, fonte por `fontfile`, model path por SO).
- Atualizar `README.md` (Requisitos: **Windows 10/11 + macOS**), `tasks/instalar.md`, `knowledge/04-troubleshooting.md`.
- Revisar os 6 agents (`chief`, `installer`, `cutter`, `scribe`, `zoomer`, `finisher`) — trocar referências a `.venv/bin/python3` e scripts `.sh`.

## 5. Restrições (não violar)
- **Não quebrar o Mac** — retrocompat total (Euriler edita no Mac).
- **Não adicionar Docker/WSL** como pré-req.
- **Manter defaults validados** — params do Silero VAD (threshold 0.6, min-silence 80ms, pad 30ms), speed 1.2x, estilos, ducking. O port é de encanamento, não de comportamento.

## 6. Validação
- **Vantagem:** a máquina do Euriler onde isso será validado é **Windows 11**. Dá pra testar o port aqui de ponta a ponta.
- **Quality gate de aceite:**
  1. `doctor.py` verde em Windows.
  2. 1 vídeo talking-head processado end-to-end (corte → speed → zoom → legenda → trilha) com a **legenda renderizando** (prova do fontfile).
  3. Sanity check de retrocompat no Mac (pelo menos revisão de que os paths Darwin seguem íntegros).

## 7. Versionamento
- v1.0.0 → **v1.1.0** (`squad.yaml` + rodapé do `README.md`).
- Changelog: "Suporte nativo a Windows (instalador Python cross-platform; fontfile no lugar de fontconfig; tempfile no lugar de /tmp; resolução de binário via PATH)."
