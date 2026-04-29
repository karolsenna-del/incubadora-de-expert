# Quality Dashboard — {mind_name}

**Data:** {date}
**Pipeline:** Clone Forge v1.0
**Modo:** {full|quick}
**Tempo total:** {hours}h

---

## Score Geral: {fidelity_score}/100

```
Fidelidade: [████████████████████░░░░░] {fidelity_score}%
Completude: [█████████████████████░░░░] {completeness}%
Confianca:  [██████████████████░░░░░░░] {confidence}%
```

---

## Pipeline Status

| Fase | Nome | Status | Gate | Tempo |
|------|------|--------|------|-------|
| 0 | Ingestao | {status} | — | {time} |
| 1 | Coleta/Validacao | {status} | {gate} | {time} |
| 1.5 | Entrevista | {status} | — | {time} |
| 2 | MIUs | {status} | {gate} | {time} |
| 3 | DNA | {status} | {gate} | {time} |
| 4 | Drivers | {status} | {gate} | {time} |
| 5 | Psicometria | {status} | — | {time} |
| 6 | Perfil | {status} | {gate} | {time} |
| 6.5 | Gap Analysis | {status} | — | {time} |
| 7 | Validacao | {status} | {gate} | {time} |
| 8 | Agente | {status} | — | {time} |

---

## Fontes

| Metrica | Valor | Target | Status |
|---------|-------|--------|--------|
| Total de fontes | {n} | >= 10 | {PASS/FAIL} |
| Tier 0 (entrevista) | {n} | >= 1 | {PASS/FAIL} |
| Tier 1 (ouro) | {n} | >= 5 | {PASS/FAIL} |
| Tipos diferentes | {n} | >= 3 | {PASS/FAIL} |
| Horas de conteudo | {h} | >= 5 | {PASS/FAIL} |

---

## Extracao (MIUs)

| Metrica | Valor | Target | Status |
|---------|-------|--------|--------|
| MIUs validos | {n} | — | — |
| MIUs rejeitados | {n} | — | — |
| Taxa de extracao | {%} | >= 60% | {PASS/FAIL} |
| Proveniencia completa | {%} | >= 90% | {PASS/FAIL} |

### Distribuicao por Categoria

| Categoria | Count | % |
|-----------|-------|---|
| BEHAVIORAL | {n} | {%} |
| METHODOLOGICAL | {n} | {%} |
| STORYTELLING | {n} | {%} |
| OPINION | {n} | {%} |
| TECHNICAL | {n} | {%} |

---

## DNA

| Componente | Score | Minimo | Status |
|------------|-------|--------|--------|
| Voice DNA | {s}/10 | 8/10 | {PASS/FAIL} |
| Thinking DNA | {s}/9 | 7/9 | {PASS/FAIL} |
| Power words | {n} | >= 10 | {PASS/FAIL} |
| Signature phrases | {n} | >= 5 | {PASS/FAIL} |
| Heuristics | {n} | >= 5 | {PASS/FAIL} |

---

## Drivers Psicologicos

| Metrica | Valor | Target | Status |
|---------|-------|--------|--------|
| Drivers inferidos | {n} | >= 20 | {PASS/FAIL} |
| Top 5 forca media | {avg} | >= 60 | {PASS/FAIL} |
| Relacoes detectadas | {n} | >= 5 | {PASS/FAIL} |
| Paradoxos produtivos | {n} | >= 1 | {PASS/FAIL} |

---

## Mapeamento Psicometrico

| Sistema | Resultado | Confianca | Tipo |
|---------|-----------|-----------|------|
| MBTI | {type} | {conf} | {estimado/aferido} |
| Enneagram | {type} | {conf} | {estimado/aferido} |
| DISC | {profile} | {conf} | {estimado/aferido} |
| Big Five | {scores} | {conf} | {estimado/aferido} |
| IQ/EQ | {estimate} | {conf} | {estimado/aferido} |
| Spiral Dynamics | {level} | {conf} | {estimado/aferido} |

---

## Perfil POC (Completude por Modulo)

| Modulo | Completude | Threshold | Status |
|--------|-----------|-----------|--------|
| Identidade | {%} | 80% | {PASS/FAIL} |
| Modelo Mental | {%} | 80% | {PASS/FAIL} |
| Operacional | {%} | 70% | {PASS/FAIL} |
| Repertorio | {%} | 70% | {PASS/FAIL} |
| Framework Visual | {%} | 60% | {PASS/FAIL} |
| Ecossistema | {%} | 60% | {PASS/FAIL} |
| **GERAL** | **{%}** | **80%** | **{PASS/FAIL}** |

---

## Validacao

### Smoke Tests

| Teste | Resultado | Score |
|-------|-----------|-------|
| Conhecimento do Dominio | {PASS/FAIL} | {n}/5 |
| Tomada de Decisao | {PASS/FAIL} | {n}/5 |
| Resposta a Objecao | {PASS/FAIL} | {n}/5 |

### Blind Test

| Metrica | Valor | Target |
|---------|-------|--------|
| Participantes | {n} | >= 5 |
| Atribuicao correta | {%} | >= 70% |
| Resultado | {PASS/FAIL/PENDING} | — |

### Fidelidade (8 Camadas)

| Camada | Tipo | Peso | Score |
|--------|------|------|-------|
| Padroes Comportamentais | Observable | 0.8 | {s}/5 |
| Estilo Comunicacao | Observable | 0.8 | {s}/5 |
| Rotinas e Habitos | Observable | 0.8 | {s}/5 |
| Padroes de Reconhecimento | Observable | 0.8 | {s}/5 |
| Modelos Mentais | Cognitive | 1.0 | {s}/5 |
| Hierarquia de Valores | Deep Identity | 1.0 | {s}/5 |
| Obsessoes Core | Deep Identity | 1.0 | {s}/5 |
| Paradoxos Produtivos | Deep Identity | 1.0 | {s}/5 |
| **MEDIA PONDERADA** | — | — | **{avg}/5** |

---

## Fidelity Tier

| Tier | Range | Status |
|------|-------|--------|
| v1.0 (MVP) | 60-75% | {current?} |
| v2.0 (Functional) | 75-85% | {current?} |
| v3.0+ (Production) | 85-97% | {current?} |

**Tier atual: {tier}**

---

## Gaps e Recomendacoes

### Gaps Criticos
{lista de gaps que impactam fidelidade}

### Recomendacoes
{acoes sugeridas para melhorar o clone}

### Proximos Passos
{o que fazer para subir de tier}

---

## Arquivos Gerados

| Pasta | Arquivo | Status |
|-------|---------|--------|
| 01-sources/ | sources-inventory.yaml | {status} |
| 01-sources/ | local-sources-index.yaml | {status} |
| 02-extraction/ | mius.yaml | {status} |
| 02-extraction/ | mius-rejected.yaml | {status} |
| 02-extraction/ | extraction-report.md | {status} |
| 03-dna/ | voice-dna.yaml | {status} |
| 03-dna/ | thinking-dna.yaml | {status} |
| 03-dna/ | implicit-knowledge.yaml | {status} |
| 03-dna/ | dna-synthesis.yaml | {status} |
| 04-drivers/ | mind-drivers.yaml | {status} |
| 04-drivers/ | driver-evidence.yaml | {status} |
| 04-drivers/ | driver-relationships.yaml | {status} |
| 04-drivers/ | driver-report.md | {status} |
| 05-psychometric/ | mbti.yaml | {status} |
| 05-psychometric/ | enneagram.yaml | {status} |
| 05-psychometric/ | disc.yaml | {status} |
| 05-psychometric/ | big-five.yaml | {status} |
| 05-psychometric/ | iq-eq-estimate.yaml | {status} |
| 05-psychometric/ | psychometric-synthesis.md | {status} |
| 06-profile/ | identity.yaml | {status} |
| 06-profile/ | mental-model.yaml | {status} |
| 06-profile/ | operational.yaml | {status} |
| 06-profile/ | repertoire.yaml | {status} |
| 06-profile/ | visual-framework.yaml | {status} |
| 06-profile/ | ecosystem.yaml | {status} |
| 06-profile/ | contradictions.yaml | {status} |
| 06-profile/ | obsessions.yaml | {status} |
| 06-profile/ | unified-profile.md | {status} |
| 07-validation/ | smoke-test-results.yaml | {status} |
| 07-validation/ | blind-test-results.yaml | {status} |
| 07-validation/ | fidelity-score.yaml | {status} |
| 07-validation/ | quality-dashboard.md | {status} |
| 08-agent/ | agent-config.yaml | {status} |
| 08-agent/ | system-prompt.md | {status} |
| 08-agent/ | deployment-notes.md | {status} |
