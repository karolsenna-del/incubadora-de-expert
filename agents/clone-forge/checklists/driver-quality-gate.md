# Driver Quality Gate — Clone Forge

**Gate ID:** (interno — parte do QG-004)
**Phase:** 4 (Inferencia de Drivers)
**Blocking:** YES
**Agent:** @cognitive-motor
**Checklist:** 8 items

---

## Pre-condicoes

- [ ] MIUs validados (QG-002 PASS)
- [ ] Driver catalog carregado (`data/driver-catalog.yaml`)
- [ ] Relationship templates carregados (`data/driver-relationship-templates.yaml`)

---

## Checklist de Qualidade

### Volume

- [ ] **Minimo 20 drivers inferidos**
  - < 20 = perfil psicologico incompleto
  - Verificar se o catalogo foi consultado adequadamente

- [ ] **Top 5 drivers com forca >= 60/100**
  - Se top 5 < 60, drivers sao fracos = pouca evidencia
  - Buscar mais MIUs de suporte ou revisitar fontes

### Evidencia

- [ ] **Todo driver tem minimo 2 MIUs de evidencia**
  - Driver com 1 MIU = hipotese, nao inferencia
  - Remover ou marcar como "tentative"

- [ ] **Cadeia de evidencia documentada** (`04-drivers/driver-evidence.yaml`)
  - Cada link MIU → driver com contribuicao explicada
  - Permite auditoria e refinamento

### Relacoes

- [ ] **Minimo 5 relacoes entre drivers detectadas**
  - Drivers isolados = perfil superficial
  - Buscar: amplificacoes, conflitos, compensacoes

- [ ] **Minimo 1 paradoxo produtivo identificado**
  - Paradoxos sao diferenciais de autenticidade
  - Se nao encontrou, revisar MIUs de OPINION e BEHAVIORAL

### Cobertura

- [ ] **Todas as 6 categorias de drivers representadas**
  - cognitive, emotional, motivational, social, behavioral, meta
  - Categoria vazia = blind spot no perfil

### Reporting

- [ ] **Driver report gerado** (`04-drivers/driver-report.md`)
  - Top 10, distribuicao, paradoxos, clusters, insights

---

## Decisao

| Resultado | Criterio | Acao |
|-----------|----------|------|
| **PASS** | 7+/8 checks | Prosseguir para Fase 5 |
| **CONDITIONAL** | 5-6/8 + gaps documentados | Prosseguir com warnings |
| **FAIL** | < 5/8 | BLOQUEAR — re-analisar MIUs |

---

## Se FAIL

1. Verificar se MIUs sao suficientes (talvez QG-002 foi CONDITIONAL)
2. Expandir busca no catalogo — drivers nao mapeados?
3. Revisar fontes — faltam fontes de opiniao/comportamento?
4. Max 2 retries antes de escalar
