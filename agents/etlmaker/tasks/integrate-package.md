---
task: "Integrate Package"
responsavel: "@architect"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Todos os volumes compostos, MAPA-TERRITORIAL.md"
Saida: "README.md, REGRAS-CARDINAIS.md, REPERTORIO.md, GLOSSARIO.md, completeness-report.yaml"
Checklist:
  - "README com indice, navegacao, fontes, autores, validacao"
  - "REGRAS-CARDINAIS organizadas por dominio"
  - "REPERTORIO com 11 secoes por tipo de artefato"
  - "GLOSSARIO com todos os termos do MAPA + emergentes"
  - "completeness-report.yaml com metricas completas"
  - "Cross-references consistentes entre volumes"
  - "Todos os volumes presentes conforme plano"
execution_type: "automated"
---

# Task: Integrate Package — Fase 3

**Task ID:** etlmaker/integrate-package
**Version:** 3.0.0
**Status:** Production Ready
**Created:** 2026-03-08
**Category:** Integration
**Execution Type:** Automated

---

## Executive Summary

Integrar todos os volumes compostos num pacote coeso e navegavel. Gerar os 4 docs transversais obrigatorios (README, REGRAS-CARDINAIS, REPERTORIO, GLOSSARIO) + completeness-report, e verificar cross-references entre volumes. Substitui a antiga task assemble-package com escopo expandido.

---

## Pipeline Visual

```
TODOS OS VOLUMES + MAPA-TERRITORIAL
  |
  v
STEP 1: GERAR README
  Indice, navegacao, fontes, autores, validacao
  |
  v
STEP 2: GERAR REGRAS-CARDINAIS
  Consolidar de TODOS os volumes + secao 5 do MAPA, organizar por dominio
  |
  v
STEP 3: GERAR REPERTORIO
  11 secoes por tipo de artefato, cada item com [Fonte:] + cross-ref ao volume
  |
  v
STEP 4: GERAR GLOSSARIO
  Termos do MAPA (secao 6) + termos emergentes dos volumes
  |
  v
STEP 5: GERAR COMPLETENESS-REPORT
  Metricas por volume, totais, status gates, verdict
  |
  v
STEP 6: CROSS-REFERENCE CHECK
  Referencias entre volumes, docs transversais, consistencia
  |
  v
QG-ETL-004: PACKAGE INTEGRATION
  README + REGRAS + REPERTORIO + GLOSSARIO + todos volumes + cross-refs
```

---

## Step-by-Step Execution

### Step 1: Generate README

Ler todos os volumes em `kbs/{slug}/` e montar README:

```markdown
# {Nome da KB}

> **Versao:** 3.0
> **Fontes:** {N} fontes processadas ({total_words} palavras)
> **Autor(es):** {autor principal} {+ colaboradores se houver}
> **Volumes:** {N} volumes + 4 docs transversais
> **Gerado por:** ETLmaker v3.0

---

## Indice

| # | Volume | Dominios | Linhas |
|---|--------|----------|--------|
| 1 | [{titulo}](VOL-01-{slug}.md) | {dominios} | {N} |
| 2 | [{titulo}](VOL-02-{slug}.md) | {dominios} | {N} |
| ... | ... | ... | ... |

## Docs Transversais

| Doc | Descricao |
|-----|-----------|
| [REGRAS-CARDINAIS.md](REGRAS-CARDINAIS.md) | Principios absolutos do metodo |
| [REPERTORIO.md](REPERTORIO.md) | Templates, formulas, benchmarks, exemplos |
| [GLOSSARIO.md](GLOSSARIO.md) | Termos proprietarios e definicoes |

## Como Navegar

- Cada volume e **autocontido** — leia na ordem ou pule direto pro topico
- **REGRAS-CARDINAIS** — Quick reference dos principios absolutos
- **REPERTORIO** — Artefatos acionaveis organizados por tipo
- **GLOSSARIO** — Terminologia proprietaria do metodo

## Fontes Utilizadas

| # | Titulo | Formato | Palavras | Autor |
|---|--------|---------|----------|-------|
| 1 | {titulo} | {formato} | {N} | {autor} |
| ... | ... | ... | ... | ... |

## Autores

{hierarquia de autores do MAPA secao 3}

---
*Gerado pelo ETLmaker v3.0 — Knowledge ETL Pipeline*
```

### Step 2: Generate REGRAS-CARDINAIS

Ler secao 5 do MAPA-TERRITORIAL + regras destacadas nos volumes:

```markdown
# Regras Cardinais — {Nome do Metodo}

> Estes principios sao tratados como **ABSOLUTOS** pelo autor.
> Nao sao sugestoes — sao leis do metodo.
> Organizados por dominio para facilitar consulta.

---

## {Dominio 1}

### 1. {Nome da Regra}

{Descricao completa}

> "{Citacao do autor}"
> [Fonte: {fonte}, {localizacao}]

**Por que e absoluta:** {contexto}

---

## {Dominio 2}

### 2. {Nome da Regra}
...
```

**Regras de geracao:**
- Organizar POR DOMINIO (nao por volume, nao por ordem)
- Cada regra com descricao, citacao do autor, [Fonte:], motivo
- Regras que aparecem em multiplas fontes: listar todas as fontes

### Step 3: Generate REPERTORIO

Organizar por tipo de artefato (11 secoes):

```markdown
# Repertorio — {Nome da KB}

> Todos os artefatos acionaveis, exemplos, metaforas, historias e frases
> catalogados por tipo para consulta rapida.
> Cada item com proveniencia [Fonte:] e referencia ao volume.

---

## 1. Templates

### {Template 1 — nome descritivo}
{Template completo como descrito pelo autor}
[Fonte: {nome}, {localizacao}]
*Contextualizado em: [VOL-{N}](VOL-{N}-{slug}.md)*

---

## 2. Formulas

### {Formula 1}
{Formula com todas as variaveis e exemplo de uso}
[Fonte: {nome}, {localizacao}]
*Contextualizado em: [VOL-{N}](VOL-{N}-{slug}.md)*

---

## 3. Benchmarks
{Numeros de referencia com contexto}

## 4. Checklists
{Listas sequenciais de verificacao}

## 5. Workflows
{Processos passo-a-passo com decisoes}

## 6. Scripts e Copy
{Textos exatos para copiar e adaptar}

## 7. Swipes
{Exemplos modelaveis}

## 8. Tabelas de Referencia
{Dados tabulados para consulta rapida}

## 9. Metaforas e Analogias
{Analogias com significado e contexto original}

## 10. Frases de Assinatura
{Catchphrases do autor}

## 11. Historias e Casos
{Narrativas concretas do autor}
```

**Regras do REPERTORIO:**
- Cada item com [Fonte:] inline
- Cada item com referencia ao volume onde esta contextualizado
- Artefatos preservados INTACTOS (nunca resumidos)
- Sem itens orfaos (tudo que esta no REPERTORIO existe em algum volume)

### Step 4: Generate GLOSSARIO

Ler secao 6 do MAPA-TERRITORIAL + termos emergentes dos volumes:

```markdown
# Glossario — {Nome da KB}

> Terminologia proprietaria e termos tecnicos do metodo.
> Definicoes fieis ao uso do autor.

---

| Termo | Definicao | Fonte |
|-------|-----------|-------|
| {termo} | {definicao em 1-2 frases} | [Fonte: {nome}] |
| ... | ... | ... |
```

**Ou formato expandido se termos forem complexos:**

```markdown
### {Termo}

**Definicao:** {definicao completa}
**Sinonimos:** {se houver}
**Usado em:** [VOL-{N}](VOL-{N}-{slug}.md)
[Fonte: {nome}, {localizacao}]
```

### Step 5: Generate Completeness Report

```yaml
completeness_report:
  version: "3.0"
  kb_name: "{nome}"
  kb_slug: "{slug}"
  generated_at: "{timestamp}"
  generated_by: "ETLmaker v3.0"

  source:
    author: "{autor principal}"
    total_sources: N
    total_words: N
    formats: ["{formato1}", "{formato2}"]

  pipeline:
    phase_0_setup: "completed"
    phase_1_territorial: "completed"
    phase_2_composition: "completed"
    phase_3_integration: "completed"
    phase_4_validation: "pending"

  volumes:
    - id: "VOL-01"
      title: "{titulo}"
      file: "VOL-01-{slug}.md"
      lines: N
      tables: N
      examples: N
      provenance_refs: N
      domains: ["{dom1}", "{dom2}"]
      qg_003_pass: true

  transversal_docs:
    readme: true
    regras_cardinais: true
    repertorio: true
    glossario: true

  quality_gates:
    QG-ETL-000: "PASSED"
    QG-ETL-001: "PASSED"
    QG-ETL-002: "PASSED"
    QG-ETL-003: "PASSED"
    QG-ETL-004: "PASSED"
    QG-ETL-005: "PENDING"

  totals:
    total_volumes: N
    total_lines: N
    total_tables: N
    total_examples: N
    total_provenance_refs: N

  verdict: "PENDING_VALIDATION"
  verdict_notes: "Aguardando validacao final (Fase 4)"
```

### Step 6: Cross-Reference Check

Verificar:
- Referencias entre volumes apontam pra volumes que existem
- REPERTORIO items referenciam volumes existentes
- GLOSSARIO termos sao usados nos volumes
- REGRAS-CARDINAIS mencionam fontes existentes
- README indices apontam pra arquivos existentes

---

## Quality Gate QG-ETL-004: Package Integration

| Criterio | Threshold |
|----------|-----------|
| README presente e completo | Todas as secoes obrigatorias |
| REGRAS-CARDINAIS presente | >= 5 regras (se fonte tiver) |
| REPERTORIO presente | >= 5 itens com [Fonte:] |
| GLOSSARIO presente | >= 10 termos (se fonte tiver) |
| Todos volumes presentes | 100% conforme plano |
| Cross-references consistentes | 0 referencias quebradas |
| completeness-report gerado | Arquivo com todos os campos |

**Se falhar:** Completar docs faltantes e re-verificar.

---

## Arquivos Gerados

```
kbs/{slug}/
  README.md                       # Indice master + navegacao
  REGRAS-CARDINAIS.md             # Principios absolutos por dominio
  REPERTORIO.md                   # Artefatos acionaveis por tipo (11 secoes)
  GLOSSARIO.md                    # Terminologia proprietaria
  completeness-report.yaml        # Metricas e status
```

---

**Task Status:** Ready for Production
