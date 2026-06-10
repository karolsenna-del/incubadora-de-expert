# Task: Ingestao de Conteudo Local

**Task ID:** clone-forge/ingest-local-content
**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-03-02
**Category:** Source Ingestion Pipeline
**Execution Type:** Interactive

---

## Executive Summary

Fase 0 do pipeline Clone Forge. Recebe QUALQUER formato de conteudo do usuario (video, audio, PDF, docs, texto puro, URLs do YouTube, redes sociais, texto colado, skills Auroq, assessments) e normaliza tudo para markdown. Tudo que entra passa por um handler de tipo, e transcrito/extraido/normalizado e salvo em `01-sources/`. Esta fase e opcional — se o usuario nao tem conteudo local, pode pular direto para Fase 1 (coleta web).

**Posicao no Workflow:** Fase 0 — Entry point do pipeline Clone Forge
**Definicao de Sucesso:** Todo conteudo do usuario normalizado em markdown e indexado
**Quality Gate de Output:** Pelo menos 1 fonte normalizada salva com metadados completos

---

## Purpose

O Clone Forge precisa de materia-prima para clonar. A fonte MAIS rica e o que o proprio sujeito ja produziu: videos, podcasts, livros, posts, aulas, mentorias gravadas, mensagens. Essa task aceita tudo que o usuario tiver e normaliza para um formato unico (markdown com frontmatter YAML) que o resto do pipeline consegue consumir.

Sem esta task, o pipeline dependeria 100% de coleta web (Fase 1), perdendo o conteudo mais valioso — o que o expert ja produziu e tem no computador.

O handler de tipos em `data/source-type-handlers.yaml` define como cada formato e processado. A task segue esse handbook sem inventar.

---

## Execution Type

**Interactive (70% Human, 30% Agent)**

- **Papel do Human:** Fornecer caminhos de arquivos, URLs, colar texto, indicar o que tem disponivel
- **Papel do Agent:** Identificar tipo, processar, transcrever, normalizar, indexar
- **Runtime Estimado:** 30-60 minutos (depende da quantidade de conteudo)

---

## Inputs

### Inputs Obrigatorios

```yaml
mind_slug:
  field: "Identificador unico da mente sendo clonada"
  format: "string (snake_case)"
  required: true
  example: "joao_silva"
  notes: "Usado para criar o diretorio de output em minds/{slug}/"

manifest_path:
  field: "Caminho para o manifest.yaml da mind"
  format: "path"
  required: true
  location: "agents/clone-forge/minds/{mind_slug}/manifest.yaml"
  notes: "Criado pela task start. Atualizado ao final desta task."
```

### Inputs Opcionais

```yaml
local_files:
  field: "Lista de caminhos para arquivos locais"
  format: "list of paths"
  required: false
  examples:
    - "~/Downloads/minha-palestra.mp4"
    - "~/Documents/meu-livro.pdf"
    - "~/NDF/teorias/*.md"
  notes: "Aceita globs. Subpastas sao processadas recursivamente."

youtube_urls:
  field: "URLs de videos do YouTube para transcrever"
  format: "list of URLs"
  required: false
  examples:
    - "https://youtube.com/watch?v=abc123"
    - "https://youtu.be/def456"

pasted_content:
  field: "Texto colado diretamente pelo usuario"
  format: "text"
  required: false
  notes: "Pedir contexto: de onde veio, quando foi escrito, para quem"

auroq_skill_path:
  field: "Diretorio de uma skill Auroq ja existente"
  format: "path"
  required: false
  example: "~/Downloads/skills/expert-content/"
  notes: "Skills Auroq sao pre-processadas — alta qualidade, Tier 1"

assessment_path:
  field: "YAML de resultado de assessment (ex: Zona Genialidade)"
  format: "path"
  required: false
  notes: "Assessment formal supera estimativa — Tier 0"
```

---

## Precondicoes

Antes de iniciar esta task:

- [ ] Mind slug definido e diretorio `minds/{slug}/` criado (task `start` executada)
- [ ] Diretorio `minds/{slug}/01-sources/` existe com subpastas `raw/`, `transcripts/`, `interview/`
- [ ] `data/source-type-handlers.yaml` acessivel e valido
- [ ] manifest.yaml criado com metadados basicos da mind

---

## Steps

### Step 1: Elicitacao — O que voce tem? (3-5 min)

**Atividade do Agent:**
Perguntar ao usuario o que ele tem disponivel. Apresentar opcoes claras.

**Elicitacao:**

```yaml
elicit: true
prompt: |
  Pra comecar a clonagem, preciso saber que conteudo voce ja tem disponivel.
  Pode ser QUALQUER coisa — quanto mais, melhor o clone.

  O que voce tem?

  1. Arquivos locais (video, audio, PDF, docs, markdown)
  2. URLs do YouTube (videos seus ou entrevistas)
  3. Texto pra colar (posts, emails, mensagens, rascunhos)
  4. Skill Auroq ja pronta (diretorio de skill)
  5. Assessment formal (Zona Genialidade, DISC, etc)
  6. Varios dos acima (vou perguntar um por um)
  7. Nenhum / pular esta fase

  Pode escolher mais de um. Se tiver duvida, escolhe 6 que eu te guio.
type: "numbered_choice"
options: [1, 2, 3, 4, 5, 6, 7]
default: 6
on_7: "Pular para Fase 1 (collect-and-merge-sources). Registrar skip no manifest."
```

**Se usuario escolhe 7 (pular):**
- Registrar no manifest: `phase_0: { status: skipped, reason: "no local content" }`
- Finalizar task com output vazio
- Nao bloquear pipeline

**Se usuario escolhe 1-6:**
- Prosseguir para Step 2 para cada tipo selecionado

**Checkpoint:** Usuario indicou quais tipos de conteudo tem. Pronto para processar.

---

### Step 2: Coleta de Caminhos e URLs (5-10 min)

**Atividade do Agent:**
Para cada tipo selecionado no Step 1, perguntar os detalhes:

**Para arquivos locais:**

```yaml
elicit: true
prompt: |
  Me passa o caminho dos arquivos. Pode ser:
  - Um arquivo especifico: ~/Downloads/palestra.mp4
  - Uma pasta inteira: ~/Documents/meu-conteudo/
  - Um glob: ~/NDF/**/*.md

  Cole os caminhos (um por linha):
type: "free_text"
validation: "Verificar se caminhos existem. Reportar quais nao foram encontrados."
```

**Para YouTube URLs:**

```yaml
elicit: true
prompt: |
  Cole as URLs do YouTube (uma por linha).
  Pode ser qualquer formato:
  - https://youtube.com/watch?v=abc123
  - https://youtu.be/abc123
type: "free_text"
validation: "Verificar formato de URL valido."
```

**Para texto colado:**

```yaml
elicit: true
prompt: |
  Cola o texto aqui. Antes de colar, me diz:
  1. De onde veio? (post, email, mensagem, rascunho, etc)
  2. Quando foi escrito? (data aproximada)
  3. Pra quem era? (publico, privado, resposta a alguem)
type: "free_text"
```

**Para skill Auroq:**

```yaml
elicit: true
prompt: |
  Me passa o caminho do diretorio da skill.
  Exemplo: ~/Downloads/skills/expert-content/
type: "free_text"
validation: "Verificar se diretorio existe e contem arquivos de skill."
```

**Para assessment:**

```yaml
elicit: true
prompt: |
  Me passa o caminho do arquivo de assessment.
  Exemplo: agents/zona-genialidade/data/{mind_slug}/assessment-result.yaml
type: "free_text"
validation: "Verificar se YAML e valido e contem dados de assessment."
```

**Checkpoint:** Todos os inputs coletados, caminhos validados. Pronto para processar.

---

### Step 3: Identificacao de Tipo e Handler (2-3 min)

**Atividade do Agent:**

1. Para cada input coletado, identificar o tipo usando `data/source-type-handlers.yaml`
2. Mapear extensao ou formato para o handler correto:

```yaml
type_identification:
  rules:
    - extension_match: "Verificar extensao do arquivo contra handlers"
    - url_match: "Se contem youtube.com ou youtu.be → handler youtube"
    - directory_match: "Se contem arquivos de skill Auroq → handler auroq_skill"
    - yaml_content: "Se YAML com campos de assessment → handler assessment"
    - fallback: "Se nao bate em nenhum → handler pasted_text"
```

3. Gerar plano de processamento:

```yaml
processing_plan:
  items:
    - id: "SRC-001"
      original_path: "~/Downloads/palestra.mp4"
      type: "video"
      handler: "video"
      estimated_time: "5-10 min"
      steps: ["extrair audio", "transcrever", "normalizar", "salvar"]
    - id: "SRC-002"
      original_path: "~/Documents/meu-livro.pdf"
      type: "pdf"
      handler: "pdf"
      estimated_time: "2-3 min"
      steps: ["extrair texto", "preservar estrutura", "normalizar", "salvar"]
  total_items: N
  estimated_total_time: "X min"
```

4. Apresentar plano ao usuario antes de processar:

```yaml
elicit: true
prompt: |
  Encontrei {N} itens pra processar:

  | # | Arquivo | Tipo | Tempo Est. |
  |---|---------|------|-----------|
  | 1 | palestra.mp4 | Video | 5-10 min |
  | 2 | meu-livro.pdf | PDF | 2-3 min |

  Confirma pra eu comecar? (s/n)
  Se quiser tirar algum, me diz o numero.
type: "confirmation"
default: "s"
```

**Checkpoint:** Plano de processamento aprovado pelo usuario.

---

### Step 4: Processamento e Normalizacao (10-30 min)

**Atividade do Agent:**
Processar cada item seguindo o handler definido em `source-type-handlers.yaml`.

**Para cada fonte:**

1. **Processar conforme handler:**
   - **Video/Audio:** Transcrever via Whisper (ou fallback: pedir colagem manual)
   - **PDF:** Extrair texto preservando estrutura (Read tool para PDFs pequenos, pagina por pagina para grandes)
   - **Document:** Converter com textutil/pandoc, normalizar para markdown
   - **Text/Markdown:** Ler direto, normalizar formatacao
   - **YouTube:** Extrair transcript via MCP youtube-transcript, ou fallback yt-dlp + whisper
   - **Social Media:** Coletar via Apify ou pedir colagem manual
   - **Pasted Text:** Salvar com metadados de contexto
   - **Auroq Skill:** Ler todos os arquivos, extrair persona/voice/thinking
   - **Assessment:** Ler YAML, extrair scores/perfis/recomendacoes

2. **Normalizar para markdown com frontmatter:**

```yaml
# Frontmatter padrao (de source-type-handlers.yaml)
---
source_id: "SRC-{seq:3}-{slug}"
type: "{source_type}"
tier: {tier_default_do_handler}
original_format: "{extension}"
ingestion_date: "{date}"
word_count: {count}
language: "{lang}"
metadata:
  title: "{title}"
  author: "{author}"
  date: "{original_date}"
---

# {Title}

{conteudo normalizado em markdown}
```

3. **Salvar no diretorio correto:**
   - Transcricoes (video/audio/youtube): `01-sources/transcripts/{source_id}.md`
   - Demais (PDF, docs, texto, skills): `01-sources/raw/{source_id}.md`

4. **Aplicar tier_upgrade_if quando aplicavel:**
   - Entrevista longa/Q&A espontaneo: video/audio Tier 2 → Tier 1
   - Livro proprio/material de curso: PDF Tier 1 → Tier 1 (confirma)
   - Resposta a comentario/stories espontaneos: social Tier 2 → Tier 1
   - Assessment formal: Tier 0 sempre

5. **Reportar progresso ao usuario:**

```
Processando [2/5]: meu-livro.pdf
  Tipo: PDF | Handler: pdf
  Paginas: 120 | Palavras: ~35.000
  Tier: 1 (conteudo proprio)
  Status: Normalizado → salvo em 01-sources/raw/SRC-002-meu-livro.md
```

**Checkpoint:** Todos os itens processados. Nenhum pendente ou falhado.

---

### Step 5: Criar Indice de Fontes Locais (2-3 min)

**Atividade do Agent:**

1. Compilar todas as fontes processadas no indice local:

```yaml
# 01-sources/local-sources-index.yaml
local_sources_index:
  generated_at: "2026-03-02T10:00:00Z"
  mind_slug: "{slug}"
  total_sources: N
  total_words: XXXXX
  processing_summary:
    successful: N
    failed: 0
    skipped: 0

  sources:
    - source_id: "SRC-001-palestra"
      original_path: "~/Downloads/palestra.mp4"
      normalized_path: "01-sources/transcripts/SRC-001-palestra.md"
      type: "video"
      tier: 1
      processing_method: "whisper_transcription"
      processing_status: "completed"
      word_count: 5200
      language: "pt-BR"
      metadata:
        title: "Palestra sobre NDF"
        duration_seconds: 3600
        date: "2025-11-15"

    - source_id: "SRC-002-meu-livro"
      original_path: "~/Documents/meu-livro.pdf"
      normalized_path: "01-sources/raw/SRC-002-meu-livro.md"
      type: "pdf"
      tier: 1
      processing_method: "pdf_text_extraction"
      processing_status: "completed"
      word_count: 35000
      language: "pt-BR"
      metadata:
        title: "Meu Livro"
        page_count: 120
        author: "Nome do Expert"
```

2. Salvar em `minds/{slug}/01-sources/local-sources-index.yaml`

**Checkpoint:** Indice criado com todas as fontes locais catalogadas.

---

### Step 6: Atualizar Manifest e Reportar (2 min)

**Atividade do Agent:**

1. Atualizar manifest.yaml:

```yaml
phase_0:
  status: completed
  completed_at: "2026-03-02T10:30:00Z"
  duration_minutes: 35
  sources_ingested: N
  total_words: XXXXX
  types_processed:
    - video: 1
    - pdf: 2
    - text: 3
  index_path: "01-sources/local-sources-index.yaml"
```

2. Apresentar resumo ao usuario:

```yaml
elicit: false
output: |
  Fase 0 concluida.

  | Metrica | Valor |
  |---------|-------|
  | Fontes processadas | {N} |
  | Palavras totais | {XXXXX} |
  | Tipos | {video: 1, pdf: 2, text: 3} |
  | Tier 0 (ouro maximo) | {N} fontes |
  | Tier 1 (alta qualidade) | {N} fontes |
  | Tier 2 (curado) | {N} fontes |
  | Falhas | {0} |

  Tudo salvo em minds/{slug}/01-sources/.
  Proximo passo: Fase 1 — Coleta e Validacao de Fontes.
```

**Checkpoint:** Manifest atualizado. Usuario informado. Pronto para Fase 1.

---

## Outputs

### Output Primario

**Fontes Normalizadas**

Formato: Markdown com frontmatter YAML
Localizacao: `agents/clone-forge/minds/{slug}/01-sources/raw/` e `01-sources/transcripts/`
Quantidade: 1 arquivo por fonte processada

### Outputs Secundarios

1. **Indice de Fontes Locais**
   - Formato: YAML
   - Localizacao: `agents/clone-forge/minds/{slug}/01-sources/local-sources-index.yaml`
   - Conteudo: Catalogo completo de todas as fontes locais com metadados

2. **Manifest Atualizado**
   - Formato: YAML
   - Localizacao: `agents/clone-forge/minds/{slug}/manifest.yaml`
   - Conteudo: Status da Fase 0 com metricas

---

## Validacao

### Checklist

- [ ] Pelo menos 1 fonte normalizada salva (se usuario nao pulou)
- [ ] Toda fonte tem frontmatter YAML com source_id, type, tier, word_count
- [ ] Naming convention SRC-{seq:3}-{slug}.md seguida
- [ ] Transcricoes salvas em `01-sources/transcripts/`
- [ ] Demais fontes salvas em `01-sources/raw/`
- [ ] local-sources-index.yaml criado com todas as fontes
- [ ] Nenhuma fonte com processing_status = "failed" sem fallback
- [ ] Manifest atualizado com status da Fase 0
- [ ] Tiers atribuidos conforme source-type-handlers.yaml
- [ ] Usuario informado do resultado

### Criterios de Sucesso

**Threshold: 8/10 no checklist acima**

| Criterio | Excelente (3) | Aceitavel (2) | Fraco (1) |
|----------|--------------|----------------|---------|
| **Cobertura** | Todo conteudo do usuario processado sem falhas | 90%+ processado, 1-2 falhas com fallback | Falhas sem fallback |
| **Normalizacao** | Frontmatter completo, formatacao limpa, estrutura preservada | Frontmatter presente, formatacao aceitavel | Frontmatter incompleto ou formatacao quebrada |
| **Tiering** | Tiers corretos com upgrades aplicados onde devido | Tiers padrao aplicados corretamente | Tiers errados |
| **UX** | Progresso claro, confirmacoes, resumo final | Processamento transparente | Usuario no escuro sobre o que aconteceu |

---

## Error Handling

```yaml
errors:
  unsupported_format:
    description: "Formato de arquivo nao reconhecido"
    action: "Informar usuario, pedir para converter para PDF ou TXT"
    fallback: "Tratar como texto puro se possivel"
    severity: "warning"

  transcription_failed:
    description: "Whisper ou outro transcriber falhou"
    action: "Pedir ao usuario para colar a transcricao manualmente"
    fallback: "Marcar fonte como pending, prosseguir com as demais"
    severity: "warning"

  file_not_found:
    description: "Caminho fornecido nao existe"
    action: "Reportar ao usuario, pedir novo caminho"
    fallback: "Pular fonte, continuar com as demais"
    severity: "warning"

  youtube_blocked:
    description: "Transcricao do YouTube nao disponivel"
    action: "Tentar yt-dlp + whisper. Se falhar, pedir colagem manual."
    fallback: "Marcar como pending"
    severity: "warning"

  file_too_large:
    description: "Arquivo > 10MB normalizado"
    action: "Dividir em partes menores (por capitulo, por secao)"
    fallback: "Processar parcialmente, documentar limitacao"
    severity: "warning"

  empty_content:
    description: "Arquivo existe mas esta vazio ou ilegivel"
    action: "Reportar ao usuario, pedir versao alternativa"
    fallback: "Pular fonte"
    severity: "error"
```

---

## Integracao

### Depende De

- **Task:** `start` — Cria o diretorio `minds/{slug}/` e manifest.yaml

### Alimenta

- **Task:** `collect-and-merge-sources` (Fase 1) — Consome `local-sources-index.yaml` para merge com fontes web
- **Task:** `deep-interview` (Fase 1.5) — Usa quantidade de fontes locais para calcular coverage
- **Task:** `extract-mius` (Fase 2) — Consome fontes normalizadas em `01-sources/`

### Chained Tasks

```yaml
chain:
  previous: start
  next: collect-and-merge-sources
  skip_condition: "Usuario escolheu opcao 7 (nenhum conteudo local)"
  skip_behavior: "Pular para Fase 1 sem bloquear pipeline"
```

---

## Historico de Revisoes

| Versao | Data | Mudanca |
|---------|------|--------|
| 1.0.0 | 2026-03-02 | Release inicial de producao |
