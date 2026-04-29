# Clone Forge — Knowledge Base

## Fundamentos

O Clone Forge combina 3 abordagens de clonagem cognitiva numa unica pipeline:

### 1. Squad Creator Premium (Alan + Pedro)

Base confiavel que produz `mind_dna_complete.yaml` com Voice DNA + Thinking DNA. Smoke tests validam comportamento. Limitacao: output unico e monolitico.

**Fontes:** `agents/squad-creator/data/squad-kb.md`, workflows `wf-clone-mind.yaml`

### 2. POC v1.1 — Ontologia de Conhecimento

Organiza o perfil em 4 camadas de profundidade (Observable → Cognitive → Deep Identity → Ecosystem) e 6 modulos contextuais (Identidade, Modelo Mental, Operacional, Repertorio, Framework Visual, Ecossistema). Adiciona proveniencia por campo.

**Schema:** `data/poc-schema.yaml`

### 3. Pipeline do Alan (reverse-engineered)

31 tabelas, 951 drivers psicologicos, 134 sistemas de assessment. Fases: Coleta → Extracao (MIUs) → Inferencia (drivers) → Mapeamento (psicometria) → Perfil → Recomendacao.

**Referencia:** `docs/knowledge/aios-study/AIOS-clonagem-reverse-engineering.md`

## Principios de Extracao

### Zero-Inference
Extrai o que ESTA la, nao o que PODERIA estar. Toda inferencia e marcada como `[INFERRED]` com nivel de confianca.

### Curadoria > Volume
Menos material OURO > muito material BRONZE. Se entrar coco, sai coco.

### Trinity: Playbook + Framework + Swipe
- **Playbook:** como faz X passo a passo
- **Framework:** SE situacao X, ENTAO faz Y
- **Swipe:** exemplo real aplicando Playbook + Framework

### 40/20/40
- 40% curadoria (selecao e classificacao de fontes)
- 20% extracao (prompt/processamento)
- 40% refinamento (testes e iteracao)

## Classificacao de Fontes

### Tier 0 — OURO MAXIMO (peso 1.0)
Entrevista profunda direta com a pessoa. Voz propria, sem filtro.

### Tier 1 — OURO (peso 0.85-0.95)
- Comentarios/respostas em Q&A (espontaneos)
- Entrevistas longas (perguntas dificeis forcam pensamento real)
- Livros/obras escritas (pensamento profundo estruturado)
- Posts de analise de caso (mostra processo de decisao)

### Tier 2 — PRATA (peso 0.6-0.84)
- Podcasts como convidado
- Aulas/cursos gravados
- Posts em redes sociais

### Tier 3 — BRONZE (peso < 0.6)
- Conteudo antigo/desatualizado
- Material generico
- Discursos memorizados/repetitivos
- Conteudo de terceiros sobre a pessoa

## Drivers Psicologicos

Drivers sao padroes psicologicos inferidos a partir dos MIUs. Cada driver tem:
- Nome e descricao
- Forca (0-100)
- Evidencia (lista de MIUs que suportam)
- Categoria (cognitive, emotional, motivational, social, behavioral)
- Relacoes com outros drivers (amplifica, conflita, condicional)

**Catalogo completo:** `data/driver-catalog.yaml`

## Mapeamento Psicometrico

Sistemas mapeados:
1. **MBTI** — 16 tipos + 8 funcoes cognitivas
2. **Enneagram** — 9 tipos + asas + instintos + trifix
3. **DISC** — 4 dimensoes (0-100)
4. **Big Five / OCEAN** — 5 dimensoes + facetas
5. **IQ/EQ** — estimativas com evidencia
6. **Spiral Dynamics** — nivel predominante

Todos os mapeamentos sao ESTIMADOS (nao aferidos formalmente) a menos que resultado de assessment formal exista (ex: Zona Genialidade).

## Quality Gates

| Gate | Fase | Blocking | Criterio |
|------|------|----------|----------|
| SOURCE_QUALITY | 1 | Sim | 10+ fontes, 5+ Tier 1, 3+ tipos |
| MIU_QUALITY | 2 | Sim | Taxa extracao >= 60%, min 5/categoria |
| DNA_QUALITY | 3 | Sim | Voice 8/10 + Thinking 7/9 |
| PROFILE_COMPLETENESS | 6 | Sim | POC >= 80% todos modulos |
| CLONE_VALIDATION | 7 | Sim | Smoke 3/3 + fidelidade >= 80% |

## Anti-Patterns

1. **Dump sem curadoria** — volume != qualidade
2. **So Playbook, sem Framework** — teoria sem regras de decisao
3. **BRONZE como fonte primaria** — perde autenticidade
4. **Prompt monolitico** — IA se perde em contexto grande
5. **Pular refinamento** — v1.0 sempre tem problemas
6. **Ignorar contradicoes** — contradicoes sao features, nao bugs
7. **Nao testar com humanos** — blind test e obrigatorio
