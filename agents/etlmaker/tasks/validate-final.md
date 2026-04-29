---
task: "Validate Final"
responsavel: "@auditor"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Todos os volumes, docs transversais, MAPA-TERRITORIAL.md, fontes originais"
Saida: "critical-audit-report.yaml (Camada 2) + validation-report.yaml (Camada 3)"
Checklist:
  - "Camada 2: 100% frameworks verificados"
  - "Camada 2: 100% regras cardinais verificadas"
  - "Camada 2: 100% termos do glossario verificados"
  - "Camada 2: 0 contradicoes entre volumes"
  - "Camada 2: 100% artefatos acionaveis verificados"
  - "Camada 2: REPERTORIO completo com 11 secoes"
  - "Camada 3 Pass 1: Coverage >= 95%"
  - "Camada 3 Pass 2: Fidelity >= 90%, 0 invencoes"
  - "Camada 3 Pass 3: Richness — todos volumes passam"
  - "Camada 3 Pass 4: Voice >= 80%"
  - "Camada 3 Pass 5: Consistency — 0 contradicoes"
  - "Camada 3 Pass 6: Integrity — 100%"
  - "Aggregate >= 90%"
execution_type: "automated"
---

# Task: Validate Final — Fase 4

**Task ID:** etlmaker/validate-final
**Version:** 3.0.0
**Status:** Production Ready
**Created:** 2026-03-08
**Category:** Validation
**Execution Type:** Automated

---

## Executive Summary

Validacao final em 2 camadas apos integracao do pacote. Camada 2 e EXAUSTIVA em itens criticos (frameworks, regras, termos, artefatos — 100% verificados, nao amostragem). Camada 3 e ESTATISTICA sobre o conteudo geral (6 passes: coverage, fidelity, richness, voice, consistency, integrity).

Substitui a antiga task validate-output. Diferenca principal: a Camada 2 pega PERDA silenciosa de conteudo que o spot-check por volume (Camada 1) nao detecta.

---

## Pipeline Visual

```
TODOS VOLUMES + DOCS TRANSVERSAIS + MAPA-TERRITORIAL + FONTES
  |
  v
CAMADA 2: AUDITORIA EXAUSTIVA DE ITENS CRITICOS
  |
  ├─ CHECK 1: Frameworks e Metodos
  ├─ CHECK 2: Regras Cardinais
  ├─ CHECK 3: Glossario de Termos
  ├─ CHECK 4: Consistencia Entre Volumes
  ├─ CHECK 5: Artefatos Acionaveis
  └─ CHECK 6: Repertorio Completude
  |
  v
  CAMADA 2 PASS? ── NAO → CORRIGIR → RE-VERIFICAR
  |
  SIM
  |
  v
CAMADA 3: VALIDACAO ESTATISTICA 6-PASSES
  |
  ├─ PASS 1: Cobertura de Conteudo
  ├─ PASS 2: Fidelidade (spot-check ampliado)
  ├─ PASS 3: Riqueza
  ├─ PASS 4: Voz
  ├─ PASS 5: Consistencia
  └─ PASS 6: Integridade Estrutural
  |
  v
SCORE AGREGADO + VERDICT
  |
  v
QG-ETL-005: FINAL VALIDATION
  Aggregate >= 90%, 0 invencoes, Camada 2 PASS
```

---

## Camada 2: Auditoria Exaustiva de Itens Criticos

**Premissa:** O MAPA-TERRITORIAL catalogou os itens mais valiosos do conhecimento. Se QUALQUER UM desaparece do output, a KB falha. Verificamos CADA UM, nao uma amostra.

### Check 1: Frameworks e Metodos

```yaml
frameworks_check:
  source: "MAPA-TERRITORIAL.md secao 4"
  method: "Para CADA framework listado no MAPA:"
  verify:
    - exists: "Aparece descrito em algum volume?"
    - complete: "Estrutura, proposito, regras, exemplos preservados?"
    - accurate: "Nome, criador, componentes batem com a fonte?"
  threshold: "100% dos frameworks devem existir no output"
  fail: "Lista frameworks ausentes → composer deve adicionar"
```

### Check 2: Regras Cardinais

```yaml
cardinal_rules_check:
  source: "MAPA-TERRITORIAL.md secao 5"
  method: "Para CADA regra cardinal listada no MAPA:"
  verify:
    - in_volume: "Aparece no volume correspondente ao dominio?"
    - in_regras_cardinais: "Aparece no REGRAS-CARDINAIS.md?"
    - faithful: "Texto preserva o significado original?"
    - with_source: "Tem [Fonte:] apontando pra evidencia?"
  threshold: "100% das regras devem existir em AMBOS (volume + REGRAS-CARDINAIS)"
  fail: "Lista regras ausentes → composer/architect deve adicionar"
```

### Check 3: Glossario de Termos

```yaml
glossary_check:
  source: "MAPA-TERRITORIAL.md secao 6"
  method: "Para CADA termo listado no MAPA:"
  verify:
    - in_glossary: "Aparece no GLOSSARIO.md com definicao?"
    - in_volumes: "Termo e usado nos volumes com significado consistente?"
    - definition_accurate: "Definicao bate com a fonte original?"
  threshold: "100% dos termos do MAPA devem estar no GLOSSARIO"
  fail: "Lista termos ausentes → architect deve adicionar"
```

### Check 4: Consistencia Entre Volumes

```yaml
cross_volume_check:
  method: "Identificar conceitos que aparecem em 2+ volumes"
  verify:
    - same_definition: "O conceito e descrito da mesma forma?"
    - no_contradiction: "Nao ha contradicao entre volumes?"
    - cross_refs_valid: "Se um volume referencia outro, o referenciado existe?"
  threshold: "0 contradicoes, 100% cross-refs validas"
  fail: "Lista contradicoes → composer corrige no volume menos autoritativo"
```

### Check 5: Artefatos Acionaveis

```yaml
artifacts_check:
  source: "MAPA-TERRITORIAL.md secao 9"
  method: "Para CADA artefato listado no MAPA:"
  verify:
    - in_volume: "Aparece contextualizado no volume indicado?"
    - in_repertorio: "Aparece catalogado no REPERTORIO na categoria correta?"
    - preserved_intact: "Estrutura/conteudo preservados SEM simplificacao?"
    - has_source: "Tem [Fonte:] rastreavel em AMBOS os lugares?"
  per_type:
    templates: "Template completo com todos os campos fill-in?"
    formulas: "Formula com todas as variaveis e exemplo de uso?"
    benchmarks: "Numeros com contexto (pra qual cenario se aplica)?"
    checklists: "Todos os passos presentes na ordem correta?"
    workflows: "Todas as etapas com decisoes e condicoes?"
    scripts: "Texto exato preservado, nao parafraseado?"
    swipes: "Estrutura completa com variantes se houver?"
    reference_tables: "Todos os dados tabulados, nada omitido?"
  threshold: "100% dos artefatos do MAPA devem existir no volume E no REPERTORIO"
  fail: "Lista artefatos ausentes → composer/architect deve adicionar"
```

### Check 6: Repertorio Completude

```yaml
repertorio_check:
  method: "Verificar REPERTORIO.md como documento de referencia rapida"
  verify:
    - all_11_sections: "Todas as 11 secoes presentes?"
    - each_item_sourced: "Cada item tem [Fonte:]?"
    - each_item_cross_ref: "Cada item referencia o volume onde esta contextualizado?"
    - navigable: "Organizado por tipo, facil de encontrar?"
    - no_orphans: "Nenhum item no REPERTORIO que nao existe em nenhum volume?"
  threshold: "100% items com [Fonte:] + cross-ref, 11 secoes presentes"
  fail: "Corrigir itens sem fonte, adicionar secoes faltantes"
```

### Output Camada 2: critical-audit-report.yaml

```yaml
critical_audit:
  frameworks:
    total_in_mapa: N
    found_in_output: N
    missing: ["lista"]
    coverage: "XX.X%"

  cardinal_rules:
    total_in_mapa: N
    found_in_volumes: N
    found_in_regras_doc: N
    missing_from_volumes: ["lista"]
    missing_from_regras: ["lista"]
    coverage: "XX.X%"

  glossary_terms:
    total_in_mapa: N
    found_in_glossary: N
    missing: ["lista"]
    coverage: "XX.X%"

  cross_volume:
    concepts_in_multiple_volumes: N
    contradictions: N
    contradiction_details: ["lista"]
    invalid_cross_refs: N

  actionable_artifacts:
    total_in_mapa: N
    found_in_volumes: N
    found_in_repertorio: N
    missing_from_volumes: ["lista"]
    missing_from_repertorio: ["lista"]
    by_type:
      templates: "found/total"
      formulas: "found/total"
      benchmarks: "found/total"
      checklists: "found/total"
      workflows: "found/total"
      scripts: "found/total"
      swipes: "found/total"
      reference_tables: "found/total"
    coverage: "XX.X%"

  repertorio_completeness:
    sections_present: "N/11"
    items_with_provenance: "N/total"
    items_with_cross_ref: "N/total"
    orphan_items: N

  overall_verdict: "PASS | FAIL"
  critical_missing: ["itens que DEVEM ser adicionados"]
```

**Se FAIL:** Pipeline PARA. Itens missing sao corrigidos antes de prosseguir pra Camada 3.

---

## Camada 3: Validacao Estatistica 6-Passes

**Pre-requisito:** Camada 2 PASS.

### Pass 1: Cobertura de Conteudo

```yaml
pass_1_coverage:
  method: |
    Para cada dominio do MAPA-TERRITORIAL (secao 1):
    - Verificar que os subtopicos estao cobertos no volume correspondente
    - Verificar que fontes primarias foram efetivamente lidas
    - Verificar que fontes de enriquecimento contribuiram
  threshold: ">= 95%"
  fail_on: "Dominio core sem cobertura de subtopicos"
```

### Pass 2: Fidelidade (spot-check ampliado)

```yaml
pass_2_fidelity:
  claims_to_check: "5 por volume (proporcional)"
  method: |
    Selecionar claims de DIFERENTES tipos:
    - 2 claims factuais (numeros, thresholds, nomes)
    - 1 claim de framework (estrutura descrita corretamente?)
    - 1 claim de regra (regra cardinal preserva significado?)
    - 1 claim de exemplo (exemplo preservado fielmente?)
  classification: "CORRECT | DISTORTED | INVENTED"
  threshold: "fidelity >= 90%, invented = 0, distorted <= 3 total"
```

### Pass 3: Riqueza

```yaml
pass_3_richness:
  method: "Verificar criterios QG-ETL-003 em cada volume"
  per_volume:
    - lines: ">= 300"
    - tables: ">= 2"
    - examples: ">= 3"
    - provenance: ">= 10 [Fonte:]"
    - cardinal_rules: ">= 1"
    - metaphors: ">= 1"
    - headers: ">= 5 (H2/H3)"
    - lists: ">= 3"
  threshold: "100% dos volumes passam"
```

### Pass 4: Voz

```yaml
pass_4_voice:
  method: |
    Comparar Voice Profile (MAPA secao 11) com output:
    - Catchphrases do autor aparecem nos volumes?
    - Terminologia preferida usada (nao substituida por formal)?
    - Tom consistente com o perfil?
    - Metaforas preservadas com contexto original?
  threshold: ">= 80% consistency"
```

### Pass 5: Consistencia

```yaml
pass_5_consistency:
  method: |
    Verificar coerencia INTERNA da KB:
    - Mesmos conceitos descritos de forma compativel entre volumes?
    - REGRAS-CARDINAIS consistente com regras nos volumes?
    - GLOSSARIO consistente com uso dos termos nos volumes?
    - REPERTORIO items rastreaveis aos volumes?
    - Cross-references validas?
  threshold: "0 contradicoes internas, 100% cross-refs validas"
```

### Pass 6: Integridade Estrutural

```yaml
pass_6_integrity:
  method: |
    MAPA-TERRITORIAL (secao 8) vs output real:
    - Todos os volumes planejados existem como arquivos?
    - Todos os docs transversais existem (README, REGRAS, REPERTORIO, GLOSSARIO)?
    - completeness-report.yaml existe e esta correto?
    - PLANO-ETL.md esta atualizado com status final?
    - Nenhum arquivo orfao (volume nao planejado)?
  threshold: "100% — tudo que foi planejado existe"
```

---

## Formula do Score Agregado v3.0

```
Agregado = (Cobertura x 0.20) + (Fidelidade x 0.30) + (Riqueza x 0.10) + (Voz x 0.10) + (Consistencia x 0.15) + (Integridade x 0.15)
```

| Dimensao | Peso | Justificativa |
|----------|------|---------------|
| Cobertura | 0.20 | Importante mas Camada 2 ja pegou gaps criticos |
| Fidelidade | 0.30 | Mais critico — distorcao = dano financeiro |
| Riqueza | 0.10 | QG-003 ja validou por volume |
| Voz | 0.10 | Preservacao de autenticidade |
| Consistencia | 0.15 | Coerencia interna da KB |
| Integridade | 0.15 | Plano = output |

---

## Verdicts

| Verdict | Criterio |
|---------|---------|
| **APPROVED** | Agregado >= 90% AND Fidelidade >= 90% AND Invented = 0 AND Camada 2 PASS |
| **NEEDS_REVISION** | Agregado >= 75% OR Fidelidade com <= 5 distortions |
| **REJECTED** | Agregado < 75% OR Invented > 0 OR Camada 2 FAIL nao resolvida |

---

## Ciclo de Revisao

```
Se NEEDS_REVISION:
  1. Auditor lista revision_items com:
     - volume afetado
     - tipo (coverage_gap | distortion | missing_example | voice_issue | inconsistency)
     - descricao PRECISA do que esta errado
     - referencia a fonte original
     - acao especifica: "Adicionar framework X ao VOL-03, secao Y"
  2. Chief repassa ao composer/architect (conforme tipo)
  3. Composer/architect corrige APENAS os itens listados
  4. Auditor re-executa APENAS os passes que falharam
  5. Maximo 3 ciclos — apos 3, escala ao usuario com relatorio
```

---

## Output Camada 3: validation-report.yaml

```yaml
validation_report:
  kb_slug: "{slug}"
  timestamp: "{ISO 8601}"
  version: "3.0"

  layer_2_verdict: "PASS"

  pass_1_coverage:
    total_domains: N
    domains_covered: N
    subtopics_coverage: XX.X
    uncovered: [...]
    verdict: "PASS|FAIL"

  pass_2_fidelity:
    total_checks: N
    correct: N
    distorted: N
    invented: N
    fidelity_score: XX.X
    issues: [...]
    verdict: "PASS|FAIL"

  pass_3_richness:
    volumes: [...]
    all_pass: true|false
    verdict: "PASS|FAIL"

  pass_4_voice:
    consistency_score: XX.X
    issues: [...]
    verdict: "PASS|FAIL"

  pass_5_consistency:
    contradictions: N
    cross_refs_valid: true|false
    verdict: "PASS|FAIL"

  pass_6_integrity:
    volumes_planned: N
    volumes_present: N
    transversal_planned: 4
    transversal_present: N
    verdict: "PASS|FAIL"

  aggregate:
    coverage: XX.X
    fidelity: XX.X
    richness: XX.X
    voice: XX.X
    consistency: XX.X
    integrity: XX.X
    score: XX.X
    verdict: "APPROVED|NEEDS_REVISION|REJECTED"

  revision_items: [...]
  revision_cycle: N
```

---

## Quality Gate QG-ETL-005: Final Validation

| Criterio | Threshold | Bloqueante |
|----------|-----------|-----------|
| Camada 2 overall | PASS (100% frameworks, regras, termos) | Sim |
| Coverage (Pass 1) | >= 95% | Sim |
| Fidelity (Pass 2) | >= 90%, 0 invented, <= 3 distorted | Sim |
| Richness (Pass 3) | 100% volumes passam QG-003 | Sim |
| Voice (Pass 4) | >= 80% | Sim |
| Consistency (Pass 5) | 0 contradicoes | Sim |
| Integrity (Pass 6) | 100% | Sim |
| Aggregate | >= 90% | Sim |
| Verdict | APPROVED | Sim |

---

## Arquivos Gerados

```
kbs/{slug}/00-pipeline/
  critical-audit-report.yaml       # Resultado Camada 2 (itens criticos)
  validation-report.yaml           # Resultado Camada 3 (6 passes + aggregate)
```

---

**Task Status:** Ready for Production
