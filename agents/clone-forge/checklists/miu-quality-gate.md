# MIU Quality Gate — Clone Forge

**Gate ID:** QG-002
**Phase:** 2 (Extracao de MIUs)
**Blocking:** YES
**Agent:** @innerlens
**Checklist:** 10 items

---

## Pre-condicoes

- [ ] Fontes normalizadas em `01-sources/raw/` e `01-sources/transcripts/`
- [ ] Source inventory validado (QG-001 PASS)
- [ ] MIU taxonomy carregada (`data/miu-classification-taxonomy.yaml`)

---

## Checklist de Qualidade

### Volume e Cobertura

- [ ] **Minimo 30 MIUs validos extraidos**
  - Menos que 30 = material insuficiente para clone confiavel
  - Se < 30, verificar: fontes suficientes? Extracao muito restritiva?

- [ ] **Minimo 5 MIUs por categoria primaria** (BEHAVIORAL, METHODOLOGICAL, STORYTELLING, OPINION, TECHNICAL)
  - Distribuicao desequilibrada = perfil incompleto
  - Se categoria < 5, buscar fontes especificas para essa categoria

- [ ] **Taxa de extracao >= 60%** (MIUs validos / total extraido)
  - < 60% = ou fontes sao ruins (muito bronze) ou extracao esta quebrando MIUs bons
  - Investigar motivos de rejeicao antes de continuar

### Qualidade Individual

- [ ] **Todo MIU tem source_id + location completos** (proveniencia >= 90%)
  - MIU sem proveniencia nao pode ser usado para evidencia de drivers
  - Rastrear ate pagina/minuto/paragrafo

- [ ] **Distribuicao de confianca saudavel:** >= 40% high, <= 20% low
  - Muitos MIUs low-confidence = inferencia excessiva
  - Poucos high-confidence = fontes insuficientes ou de baixa qualidade

- [ ] **Zero MIUs genericos** no set valido
  - Testar: "qualquer expert diria isso?" Se sim, rejeitar
  - Genericos vao para `mius-rejected.yaml` com razao GENERIC

### Consistencia

- [ ] **MIUs contraditorios identificados e marcados**
  - Contradicao nao e erro — e feature. Mas precisa ser explicita
  - Tag CONTRADICTION no MIU + related_mius linkando os dois lados

- [ ] **Nenhum MIU depende de contexto externo**
  - Cada MIU deve fazer sentido sozinho
  - Se precisa de "ele disse isso no contexto de...", expandir ou rejeitar

### Fragmentacao

- [ ] **MIUs complexos divididos em fragmentos**
  - MIU METHODOLOGICAL com framework de 5 passos = 5 fragmentos
  - Fragmentos herdam source e category do pai

- [ ] **Extraction report gerado** (`02-extraction/extraction-report.md`)
  - Metricas, distribuicoes, gaps, recomendacoes

---

## Decisao

| Resultado | Criterio | Acao |
|-----------|----------|------|
| **PASS** | 8+/10 checks passam | Prosseguir para Fase 3 |
| **CONDITIONAL** | 6-7/10 + gaps documentados | Prosseguir com warnings |
| **FAIL** | < 6/10 | BLOQUEAR — revisar fontes e re-extrair |

---

## Se FAIL

1. Identificar quais checks falharam
2. Se volume: buscar mais fontes (voltar a Fase 1)
3. Se qualidade: ajustar extracao (re-rodar com parametros diferentes)
4. Se distribuicao: buscar fontes especificas para categorias fracas
5. Max 2 retries antes de escalar para usuario
