# ETLmaker Knowledge Base — Metodologia v3.0

## Visao Geral

O ETLmaker transforma fontes brutas de conhecimento (cursos, livros, transcricoes, conversas, PDFs) em Knowledge Bases ricas, completas e fieis ao original. O output e um conjunto de volumes organizados por dominio, com formatacao rica, exemplos preservados, voz do autor mantida, e validacao em 3 camadas contra fonte.

## Principios Fundamentais

### 1. Composicao > Atomizacao

O pipeline trata conhecimento como um livro, nao como dados. Nao atomiza em unidades menores — compreende o todo e compoe documentos ricos.

### 2. Fidelidade Absoluta

Nada entra no output que nao esteja na fonte. Nada sai da fonte que nao entre no output.

- **Zero invencoes** — Se nao ta na fonte, nao ta no output
- **Proveniencia inline** — Cada bloco de conteudo tem [Fonte:]
- **Validacao em 3 camadas** — Spot-check por volume + auditoria exaustiva + 6 passes
- **Contradicoes preservadas** — Se fontes discordam, ambas posicoes aparecem

### 3. Riqueza Obrigatoria

O output deve ser MELHOR que o original em organizacao, clareza e navegabilidade, mantendo 100% do conteudo.

### 4. Aprovacao do Usuario

O usuario aprova o plano de volumes ANTES da composicao.

### 5. Mapeamento Territorial Antes de Compor

Ver o terreno inteiro de cima antes de mergulhar. Dominar dominios, backbone, autores, frameworks, regras, glossario — tudo num unico documento integrado.

### 6. Composicao Blocada com Checkpoint

1 volume = 1 ciclo completo (ler + compor + spot-check + salvar). Cada volume e independente e persistente.

### 7. Validacao em 3 Camadas

Erros pegos cedo custam menos. Camada 1 pega distorcao/invencao por volume. Camada 2 pega PERDA silenciosa. Camada 3 valida estatisticamente.

### 8. Profundidade > Velocidade

ZERO compressao. Output MAIOR e mais organizado que input, nunca menor. Cada exemplo, cada metafora, cada template preservado intacto.

### 9. Backbone do Autor

Usar a estrutura que o AUTOR criou. Se ele organizou em etapas, modulos, fases — essa e a espinha dorsal natural da KB.

### 10. Persistencia Entre Sessoes

PLANO-ETL.md e MAPA-TERRITORIAL.md SEMPRE sobrevivem. Reler a cada retomada.

## Pipeline v3.0 — 4 Fases (+Setup)

| Fase | Agente | O que faz |
|------|--------|-----------|
| 0. Setup | Chief | Escopo, modo, estrutura, PLANO-ETL.md |
| 1. Mapeamento Territorial | Extractor + Analyst | Ingerir fontes + mapear territorio (11 dimensoes) |
| 2. Composicao Blocada | Composer + Auditor | Compor volumes em ciclo blocado com spot-check |
| 3. Integracao | Architect | README, REGRAS, REPERTORIO, GLOSSARIO |
| 4. Validacao Final | Auditor | Camada 2 (exaustiva) + Camada 3 (6-passes) |

## Agentes

| Agente | Papel |
|--------|-------|
| **etl-chief** | Orquestrador — gerencia pipeline, gates, handoffs, checkpoints |
| **extractor** | Ingestao — normaliza fontes em texto limpo |
| **analyst** | Mapeamento territorial — dominios, backbone, volumes, voz |
| **architect** | Integracao — README, REGRAS, REPERTORIO, GLOSSARIO, cross-refs |
| **composer** | Composicao blocada — volumes ricos em ciclo de 6 steps |
| **auditor** | Validacao 3 camadas — spot-check, auditoria exaustiva, 6-passes |

## Quality Gates

| Gate | Nome | Threshold Chave |
|------|------|-----------------|
| QG-000 | Ingestion Validity | >= 100 palavras, UTF-8, metadados |
| QG-001 | Territorial Comprehension | >= 3 dominios, backbone, voz, MAPA gerado |
| QG-002 | Architecture Approval | Usuario aprovou plano de volumes |
| QG-003 | Composition Richness | >= 300 linhas, spot-check 10 claims (por volume) |
| QG-004 | Package Integration | README + REGRAS + REPERTORIO + GLOSSARIO + cross-refs |
| QG-005 | Final Validation | Camada 2 PASS + Aggregate >= 90% + 0 invencoes |

## Validacao em 3 Camadas

### Camada 1: Spot-check por Volume (durante composicao)
- 10 claims aleatorios verificados contra fonte
- >= 8 corretos, 0 inventados
- Pega erros de fidelidade CEDO

### Camada 2: Auditoria Exaustiva (apos integracao)
- 100% frameworks verificados contra MAPA
- 100% regras cardinais em volumes E em REGRAS-CARDINAIS.md
- 100% termos no GLOSSARIO
- 100% artefatos acionaveis em volumes E no REPERTORIO
- Consistencia entre volumes, cross-refs validas
- NAO e amostragem — e varredura COMPLETA

### Camada 3: Validacao Estatistica 6-Passes (final)

| Pass | O que valida | Threshold |
|------|-------------|-----------|
| 1. Coverage | Dominios e subtopicos no output | >= 95% |
| 2. Fidelity | Claims corretos vs fonte | >= 90%, 0 invencoes |
| 3. Richness | Linhas, tabelas, exemplos por volume | Criterios minimos |
| 4. Voice | Catchphrases, terminologia, tom | >= 80% |
| 5. Consistency | Coerencia interna, cross-refs | 0 contradicoes |
| 6. Integrity | Plano vs output real | 100% |

**Formula:** (Cov×0.20) + (Fid×0.30) + (Rich×0.10) + (Voz×0.10) + (Cons×0.15) + (Int×0.15)

## 8 Conceitos Formalizados

### Mapeamento Territorial
Fase obrigatoria de compreensao profunda antes de composicao. Output: MAPA-TERRITORIAL.md com 11 secoes.

### Descoberta de Backbone
Identificacao ativa da estrutura que o AUTOR ja criou. Usar a organizacao do criador, nao impor de fora.

### Fontes Primarias vs Suporte
Primarias (ancora) dao estrutura. Suporte (enriquecimento) da exemplos e profundidade. Classificacao por volume.

### Composicao Blocada
1 volume = 1 ciclo completo. Profundidade total. Checkpoint obrigatorio.

### Protocolo de Persistencia
PLANO-ETL.md e MAPA-TERRITORIAL.md sobrevivem autocompact. Reler a cada retomada.

### Multi-Autor com Hierarquia
Rastreamento de autores com peso (primary > collaborator > guest).

### Catalogo de Artefatos Acionaveis
Templates, formulas, benchmarks, checklists, workflows — catalogados no MAPA, preservados nos volumes, indexados no REPERTORIO.

### Validacao em 3 Camadas
Spot-check (cedo) + Auditoria (exaustiva) + 6-passes (estatistica).

## Estrutura de Output

```
kbs/{slug}/
  PLANO-ETL.md                    # Plano persistente (status, decisoes)
  README.md                       # Indice + navegacao
  REGRAS-CARDINAIS.md             # Principios absolutos por dominio
  REPERTORIO.md                   # Artefatos acionaveis (11 secoes)
  GLOSSARIO.md                    # Terminologia proprietaria
  VOL-01-{topico}.md              # Volumes por dominio
  VOL-02-{topico}.md
  ...
  completeness-report.yaml        # Metricas e status
  00-pipeline/                    # Interno (nao entregavel)
    sources/                      # Fontes normalizadas
    MAPA-TERRITORIAL.md           # Mapa integrado com 11 secoes
    critical-audit-report.yaml    # Resultado Camada 2
    validation-report.yaml        # Resultado Camada 3
  .state.json                     # Estado do pipeline
```

## Evolucao v1.0 → v2.0 → v3.0

| Aspecto | v1.0 | v2.0 | v3.0 |
|---------|------|------|------|
| Unidade base | MIU (atomica) | Documento rico | Documento rico |
| Compreensao | Nenhuma | Deep Read (4 yamls) | Mapeamento Territorial (1 MAPA integrado) |
| Planejamento | Automatico | Architect planeja | Analyst planeja (quem entende planeja) |
| Composicao | Reassembly de MIUs | Linear | Blocada (1 vol = 1 ciclo) |
| Validacao | Estrutural | 5-passes no final | 3 camadas (spot-check + exaustiva + 6-passes) |
| Checkpoint | Nenhum | Nenhum | Por volume + PLANO-ETL.md |
| Multi-autor | Nao | Nao | Com hierarquia |
| Backbone | Nao | Nao | Descoberta ativa |
| Glossario | Nao | Nao | Obrigatorio |
| Artefatos | Nao catalogados | No REPERTORIO | Catalogados no MAPA + preservados + indexados |
| Persistencia | 1 sessao | 1 sessao | Protocolo formal |
