---
task: "Ingest Sources"
responsavel: "@extractor"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Lista de fontes brutas (arquivos, texto colado, URLs)"
Saida: "Fontes normalizadas em 00-pipeline/sources/ + manifesto de ingestao"
Checklist:
  - "Todas as fontes acessiveis e legiveis"
  - "Texto normalizado para UTF-8"
  - "Estrutura preservada (headers, secoes, paragrafos)"
  - "Metadados gerados por fonte"
  - "Manifesto de ingestao completo"
execution_type: "automated"
---

# Task: Ingest Sources — Fase 1

**Task ID:** etlmaker/ingest-sources
**Version:** 2.0.0
**Status:** Production Ready
**Created:** 2026-03-03
**Updated:** 2026-03-04
**Category:** Ingestion
**Execution Type:** Automated

---

## Executive Summary

Ingerir todas as fontes brutas, normalizar em texto limpo e estruturado, gerar metadados de proveniencia, e produzir manifesto de ingestao. Fase puramente mecanica — sem analise ou interpretacao.

---

## Pipeline Visual

```
FONTES BRUTAS (PDF, MD, texto, transcricoes...)
  |
  v
STEP 1: DETECTAR FORMATO
  Identificar tipo de cada fonte
  |
  v
STEP 2: NORMALIZAR
  Converter para Markdown limpo + UTF-8
  |
  v
STEP 3: GERAR METADADOS
  ID, formato, titulo, autor, palavras, secoes
  |
  v
STEP 4: GERAR MANIFESTO
  Consolidar metadados de todas as fontes
  |
  v
QG-ETL-000: INGESTION VALIDITY
  >= 100 palavras, encoding OK, metadados OK
```

---

## Step-by-Step Execution

### Step 1: Detect Format

Para cada fonte:
- Identificar formato (PDF, MD, txt, HTML, YAML, transcricao)
- Verificar acessibilidade (arquivo existe, pode ser lido)
- Registrar formato original

### Step 2: Normalize

Para cada fonte:
- Converter encoding para UTF-8
- Converter para Markdown (preservar headers como # ## ###)
- Limpar fillers em transcricoes (uh, um, ne, tipo)
- Preservar timestamps [HH:MM:SS] em transcricoes
- Separar paragrafos com linha em branco
- Preservar ordem e hierarquia original

**Output:** `00-pipeline/sources/{source-slug}-normalized.md`

### Step 3: Generate Metadata

Para cada fonte:
```yaml
source:
  id: "SRC-{kb_slug}-{seq}"
  original_path: "{caminho}"
  format: "{formato}"
  title: "{titulo}"
  author: "{autor se disponivel}"
  date: "{data se disponivel}"
  total_sections: N
  total_paragraphs: N
  total_words: N
  normalized_path: "00-pipeline/sources/{slug}-normalized.md"
```

**Output:** `00-pipeline/sources/{source-slug}-metadata.yaml`

### Step 4: Generate Manifest

Consolidar todos os metadados:

```yaml
ingestion_manifest:
  kb_slug: "{slug}"
  total_sources: N
  total_words: N
  total_sections: N
  total_paragraphs: N
  sources:
    - id: "SRC-001"
      title: "{titulo}"
      words: N
      sections: N
      paragraphs: N
      format: "{formato}"
    - id: "SRC-002"
      # ...
  timestamp: "{ISO 8601}"
```

**Output:** `00-pipeline/sources/ingestion-manifest.yaml`

### Step 5: Quality Gate QG-ETL-000

Validar antes de avancar:

| Criterio | Threshold |
|----------|-----------|
| Palavras por fonte | >= 100 |
| Encoding | UTF-8 valido |
| Metadados | Completos (id, formato, titulo) |
| Estrutura | Preservada |

**Se falhar:** Rejeitar fonte especifica, informar Chief com motivo.

---

## Arquivos Gerados

```
kbs/{slug}/00-pipeline/sources/
  {source-1}-normalized.md
  {source-1}-metadata.yaml
  {source-2}-normalized.md
  {source-2}-metadata.yaml
  ...
  ingestion-manifest.yaml
```

---

**Task Status:** Ready for Production
