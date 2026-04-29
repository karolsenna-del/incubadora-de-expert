# Psychometric Quality Gate — Clone Forge

**Phase:** 5 (Mapeamento Psicometrico)
**Blocking:** NO (nao bloqueia pipeline, mas gera warnings)
**Agent:** @cognitive-motor
**Checklist:** 7 items

---

## Pre-condicoes

- [ ] Drivers inferidos e validados (Fase 4 completa)
- [ ] Psychometric systems carregados (`data/psychometric-systems.yaml`)
- [ ] Assessment formal verificado (Zona Genialidade, se existir)

---

## Checklist de Qualidade

### Cobertura

- [ ] **Todos os 6 sistemas mapeados** (MBTI, Enneagram, DISC, Big Five, IQ/EQ, Spiral Dynamics)
  - Sistema nao mapeado = gap explicito no perfil
  - Se drivers insuficientes, marcar como "insufficient_data"

- [ ] **Confianca media >= 0.5 nos sistemas core** (MBTI, Enneagram, DISC, Big Five)
  - < 0.5 = estimativa fraca — marcar claramente como "low_confidence"
  - Sistemas core precisam de mais evidencia que complementares

### Consistencia

- [ ] **Mapeamentos nao se contradizem entre si**
  - MBTI INTJ + Enneagram 7 e possivel mas raro — justificar se ocorrer
  - DISC alto D + Big Five alta Agreeableness e contraditorio — investigar
  - Contradicoes entre sistemas = possivel erro de mapeamento

- [ ] **Se assessment formal existe, discrepancias documentadas**
  - Estimado vs aferido — onde divergem? Por que?
  - Assessment formal SEMPRE prevalece (confidence 1.0)
  - Documentar: "Estimado INTJ, aferido ENTJ — divergencia em E/I"

### Marcacao

- [ ] **Todo resultado marcado como "estimado" ou "aferido"**
  - Nunca apresentar estimativa como fato
  - "aferido" so com resultado de assessment formal

- [ ] **Evidencia por componente documentada**
  - MBTI: quais drivers suportam cada funcao cognitiva?
  - Big Five: quais drivers suportam cada faceta?
  - Rastreabilidade driver → componente psicometrico

### Sintese

- [ ] **Psychometric synthesis gerado** (`05-psychometric/psychometric-synthesis.md`)
  - "DNA Mental" consolidado em formato legivel
  - Cruza todos os 6 sistemas numa narrativa coerente
  - Destaca convergencias e divergencias entre sistemas

---

## Decisao

| Resultado | Criterio | Acao |
|-----------|----------|------|
| **PASS** | 6+/7 checks | Prosseguir para Fase 6 |
| **CONDITIONAL** | 4-5/7 | Prosseguir com warnings — nao bloqueia |
| **NEEDS_DATA** | < 4/7 | Documentar gaps, prosseguir com perfil incompleto |

---

## Nota

Este gate NAO bloqueia o pipeline porque psicometria e complementar ao perfil core.
Um clone pode ser funcional sem mapeamento psicometrico perfeito.
Porem, gaps psicometricos afetam o fidelity_score final.
