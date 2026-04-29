# Task: ingest-sources

## Objetivo

Ler todas as fontes de conhecimento, criar inventario estruturado e validar que sao suficientes.

## Trigger

- Handoff automatico da Fase 0 (start)
- `*resume` quando pipeline pausado na Fase 1

## Pre-condicoes

- Fase 0 (setup) completa
- `.state.json` inicializado com lista de fontes

## Agente Executor

@knowledge-miner

## Passos

### Step 1: Ler Fontes

Para cada fonte no `.state.json`:

1. Ler o documento completo
2. Verificar que e legivel e nao esta vazio
3. Contar palavras
4. Identificar estrutura (secoes, headings, listas, tabelas)

### Step 2: Classificar Fontes

Para cada fonte, identificar:

- **Tipo:** kb (knowledge base existente), book (livro/resumo), transcript (transcricao), course (curso/aula), article (artigo/post)
- **Expert:** Quem e o expert/autor (modo sintetica) ou qual topico cobre (modo consultor)
- **Qualidade:** estimativa de profundidade (shallow/medium/deep)
- **Secoes relevantes:** listar as secoes com mais conteudo extraivel

### Step 2.5: Source Tier Classification

Classificar cada fonte em tier com peso de confianca:

| Tier | Peso | Criterio | Exemplos |
|------|------|----------|----------|
| **OURO** (1.0) | 0.90-1.00 | Conteudo original do expert, profundo, editado | Livro proprio, KB curada, curso completo, artigo tecnico detalhado |
| **PRATA** (0.7) | 0.60-0.89 | Conteudo do expert mas superficial ou parcial | Transcript de palestra, podcast, posts longos, entrevistas |
| **BRONZE** (0.4) | 0.30-0.59 | Conteudo secundario ou resumido | Resumo de terceiros, notas rapidas, conteudo antigo (5+ anos), artigos curtos |

**Regra:** O peso do tier propaga para o `confidence` dos KFs extraidos daquela fonte:
`kf.confidence = base_confidence * source_tier_weight`

**Threshold de viabilidade:**
- ouro_ratio >= 60%: GREEN — proceder
- ouro_ratio 40-60%: YELLOW — alertar usuario que mente pode ser rasa
- ouro_ratio < 40%: RED — alertar fortemente, recomendar fontes melhores

### Step 3: Gerar Source Manifest

Criar `minds/{slug}/01-ingestion/source-manifest.yaml`:

```yaml
mind_slug: "{slug}"
mode: "synthetic|consultant"
ingestion_date: "{timestamp}"
total_sources: N
total_words: N
ouro_ratio: 0.X          # % de palavras vindas de fontes OURO

sources:
  - id: SRC-001
    path: "{path}"
    type: "kb|book|transcript|course|article"
    tier: "ouro|prata|bronze"
    tier_weight: 0.X
    expert: "{nome}"       # sintetica
    topic: "{topico}"      # consultor
    word_count: N
    sections: N
    quality: "shallow|medium|deep"
    key_sections:
      - "{secao 1}"
      - "{secao 2}"
    notes: "{observacoes}"
```

### Step 4: Quality Gate QG-MF-001

Validar:

- [x] Todas as fontes legiveis e parseadas
- [x] Total de palavras >= 500
- [x] Cada fonte tem tipo e expert/topico identificado
- [x] Nenhuma fonte vazia ou corrompida

**Veto conditions:**
- Qualquer fonte ilegivel → reportar, pedir alternativa
- Total < 200 palavras → bloquear, pedir mais fontes

### Step 5: Atualizar State

```json
{
  "phase_status": { "phase_1": "completed" },
  "current_phase": 2
}
```

### Step 6: Continuar para Analise

Prosseguir diretamente para task `analyze-knowledge` (mesmo agente).

## Formato de Output

`01-ingestion/source-manifest.yaml` com inventario completo.

## Error Handling

| Cenario | Acao |
|---------|------|
| Arquivo nao encontrado | Reportar path, pedir correcao ao chief |
| Arquivo vazio | Registrar como invalido, continuar com demais |
| Todas as fontes rasas | Alertar: "Fontes com pouco conteudo — mente resultante pode ser superficial" |

## Completion Criteria

- source-manifest.yaml gerado com todas as fontes
- QG-MF-001 passou
- State atualizado
