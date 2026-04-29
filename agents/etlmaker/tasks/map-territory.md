---
task: "Map Territory"
responsavel: "@analyst"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Fontes normalizadas em 00-pipeline/sources/, ingestion-manifest.yaml"
Saida: "MAPA-TERRITORIAL.md com 11 secoes integradas"
Checklist:
  - "TODAS as fontes lidas profundamente"
  - ">= 3 dominios identificados"
  - "Backbone identificado ou justificado"
  - "Autores mapeados com hierarquia"
  - "Frameworks e metodos proprietarios catalogados"
  - "Regras cardinais identificadas (>= 1)"
  - "Glossario preliminar (>= 10 termos se fonte tiver)"
  - "Fontes classificadas (primaria vs suporte) por volume"
  - "Plano de volumes com sequencia logica"
  - "Catalogo de artefatos acionaveis"
  - "Voice profile do(s) autor(es) principal(is)"
  - "MAPA-TERRITORIAL.md salvo em 00-pipeline/"
execution_type: "interactive"
---

# Task: Map Territory — Fase 1

**Task ID:** etlmaker/map-territory
**Version:** 3.0.0
**Status:** Production Ready
**Created:** 2026-03-08
**Category:** Analysis + Architecture
**Execution Type:** Interactive (requer aprovacao do usuario no plano de volumes)

---

## Executive Summary

Mapeamento territorial profundo de TODAS as fontes antes de qualquer composicao. Substitui as antigas tasks deep-read + plan-volumes. O Analyst agora faz TUDO: le, compreende, mapeia dominios, descobre backbone, perfila voz, classifica fontes, planeja volumes, cataloga artefatos — porque QUEM ENTENDE o conteudo e quem deve planejar.

O output e um unico documento integrado (MAPA-TERRITORIAL.md) que substitui os 4 yamls do v2.0 (source-map, voice-profile, topic-structure, reading-report). Serve como GPS pra composicao, plano pra volumes, e referencia pra validacao.

---

## Pipeline Visual

```
FONTES NORMALIZADAS (00-pipeline/sources/)
  |
  v
STEP 1: LEITURA TERRITORIAL
  Ler TODAS as fontes — profunda, nao superficial
  |
  v
STEP 2: MAPEAR DOMINIOS
  Identificar grandes temas, hierarquia, conexoes
  |
  v
STEP 3: DESCOBRIR BACKBONE
  O autor ja organizou? Qual e a espinha dorsal?
  |
  v
STEP 4: MAPEAR AUTORES
  Quem ensina o que, hierarquia de peso
  |
  v
STEP 5: CATALOGAR FRAMEWORKS
  Metodos proprietarios, nomes, estruturas
  |
  v
STEP 6: IDENTIFICAR REGRAS CARDINAIS
  Principios absolutos, frequencia, evidencia
  |
  v
STEP 7: CONSTRUIR GLOSSARIO PRELIMINAR
  Termos proprietarios com definicoes breves
  |
  v
STEP 8: CLASSIFICAR FONTES POR VOLUME
  Primarias (ancora) vs Suporte (enriquecimento)
  |
  v
STEP 9: PLANEJAR VOLUMES
  Titulos, dominios, fontes, estimativas, sequencia
  |
  v
STEP 10: CATALOGAR ARTEFATOS ACIONAVEIS
  Templates, formulas, benchmarks, checklists, workflows
  |
  v
STEP 11: VOICE PROFILING
  Tom, catchphrases, estilo didatico, metaforas
  |
  v
QG-ETL-001: TERRITORIAL COMPREHENSION
  Todas as secoes preenchidas, dominios >= 3, backbone, voz
  |
  v
QG-ETL-002: ARCHITECTURE APPROVAL
  Plano de volumes apresentado ao usuario → aprovacao explicita
```

---

## Step-by-Step Execution

### Step 1: Leitura Territorial

Ler TODAS as fontes normalizadas de `00-pipeline/sources/` com atencao profunda.

**Isso NAO e scanning.** E leitura profunda o suficiente pra entender:
- Quais sao os grandes temas
- Como eles se conectam
- Quem ensina o que
- Qual e a estrutura natural do conteudo
- Quais conceitos o autor trata como fundamentais
- Quais sao os termos proprietarios

**Durante a leitura, anotar:**
- Temas que se repetem entre fontes
- Conceitos tratados como fundamentais
- Frases que o autor repete (catchphrases)
- Exemplos e historias concretas
- Metaforas e analogias
- Regras tratadas como absolutas
- Templates, formulas, benchmarks, checklists (artefatos acionaveis)
- Pontos onde fontes se contradizem

### Step 2: Mapear Dominios de Conhecimento

Apos ler tudo, identificar os grandes dominios:

Para CADA dominio:
- **Nome** — titulo descritivo
- **Descricao** — 1-2 frases
- **Subtopicos** — o que esta dentro deste dominio
- **Importancia** — `core` | `supporting` | `peripheral`
- **Frequencia** — em quantas fontes aparece
- **Fontes** — quais fontes cobrem este dominio
- **Quem ensina** — qual autor/instrutor

**Criterios de importancia:**
- `core` — Dominio central do metodo, aparece em 3+ fontes
- `supporting` — Complementa um dominio core, aparece em 1-2 fontes
- `peripheral` — Tangencial ao metodo, aparece em 1 fonte

### Step 3: Descoberta de Backbone

O autor ja organizou o metodo de alguma forma?

**Decisao arquitetural:**

| Cenario | Estrategia |
|---------|-----------|
| 1 autor, 1 metodo estruturado (curso com etapas, livro com progressao) | Usar backbone do autor como esqueleto |
| Compilado de multiplos autores sobre mesmo tema | Organizar por dominio — nao tem backbone unico |
| Autor sem estrutura clara (transcricoes soltas, Q&A) | Criar estrutura baseada nos dominios emergentes |
| Multiplas disciplinas | Cada disciplina pode ter seu backbone ou virar KB separada |

Documentar:
- `backbone_exists`: boolean
- `backbone_description`: como o autor organizou
- `backbone_source`: qual fonte contem o backbone
- `strategy`: use_author_backbone | organize_by_domain | create_from_scratch
- `justification`: por que essa estrategia

### Step 4: Mapeamento de Autores

Para CADA autor/instrutor relevante:
- **Nome**
- **Papel** — `primary` | `collaborator` | `guest`
- **Dominios** — quais dominios ensina
- **Peso** — `high` | `medium` | `low`
- **Marcadores de voz** — catchphrases, tom, estilo (breve)

Documentar hierarquia: quem tem mais peso e por que.

### Step 5: Catalogar Frameworks e Metodos Proprietarios

Para CADA framework/metodo identificado:
- **Nome** — como o autor chama
- **Criador** — quem criou
- **Proposito** — 1 frase
- **Estrutura** — descricao breve (etapas, componentes, regras)
- **Fontes** — onde aparece

### Step 6: Identificar Regras Cardinais

Para CADA regra que o autor trata como absoluta:
- **Regra** — texto da regra
- **Frequencia** — em quantas fontes aparece
- **Absoluteness** — `maxima` | `alta` | `media`
- **Fontes** — quais fontes referenciam

**Minimo:** >= 1 regra cardinal identificada.

### Step 7: Construir Glossario Preliminar

Para CADA termo proprietario ou do dominio:
- **Termo** — como o autor usa
- **Definicao** — 1-2 frases

**Criterio:** >= 10 termos se fonte tiver terminologia proprietaria. Se nao tiver, registrar termos tecnicos do dominio.

### Step 8: Classificar Fontes por Volume

Para CADA volume planejado:
- **Volume ID** — VOL-{N}
- **Fontes primarias** — quais sao ancora (dao estrutura e conceitos core)
- **Fontes de suporte** — quais enriquecem (exemplos, Q&A, edge cases, troubleshooting)
- **Tamanho estimado** — KB total das fontes primarias

**Regra:** Composicao le PRIMARIAS primeiro (estrutura), depois SUPORTE (profundidade). A ancora da o esqueleto do volume; o enriquecimento da a carne.

### Step 9: Planejar Volumes

Para CADA volume:
- **ID** — VOL-{N}
- **Titulo** — descritivo
- **Dominios cobertos** — quais dominios estao neste volume
- **Backbone anchor** — qual fonte/secao e a ancora
- **Enriquecimento** — quais fontes enriquecem
- **Estimativa de linhas** — baseada no tamanho das fontes
- **Descricao** — o que este volume cobre em 1-2 frases

**Docs transversais obrigatorios:**
- README.md
- REGRAS-CARDINAIS.md
- REPERTORIO.md
- GLOSSARIO.md

**Sequencia logica com justificativa.**

**Criterios de agrupamento:**
- Dominios fortemente relacionados ficam no mesmo volume
- Cada volume deve ter conteudo estimado para >= 300 linhas
- Cada volume deve ser autocontido (leitor entende sem ler os outros)
- Sequencia respeita dependencias (conceitos basicos antes de avancados)

### Step 10: Catalogar Artefatos Acionaveis

Para CADA artefato acionavel identificado nas fontes:
- **Tipo** — `template` | `formula` | `benchmark` | `checklist` | `workflow` | `script` | `swipe` | `reference_table`
- **Nome** — descritivo
- **Descricao** — 1 frase
- **Fonte** — onde foi encontrado
- **Volume alvo** — em qual volume deve aparecer

**Cada artefato aparece em 2 lugares:**
1. DENTRO do volume (contextualizado, com explicacao)
2. NO REPERTORIO (catalogado por tipo, navegavel)

### Step 11: Voice Profiling

Perfil de voz do(s) autor(es) principal(is):

- **Tom:** formalidade (1-10), energia (1-10), diretividade (1-10)
- **Catchphrases:** frases repetidas com frequencia e contexto
- **Estilo didatico:** padroes de ensino observados
- **Metaforas:** analogias usadas com significado
- **Terminologia preferida:** termos do autor vs termos formais
- **Terminologia do dominio:** termos especificos do campo

---

## Output: MAPA-TERRITORIAL.md

Um documento markdown integrado com todas as 11 secoes acima. Template:

```markdown
# Mapa Territorial — {Nome da KB}

> Gerado pelo ETLmaker v3.0 — Fase 1: Mapeamento Territorial
> Data: {timestamp}
> Fontes: {N} fontes, {total_words} palavras

---

## 1. Dominios de Conhecimento

{tabela ou lista com todos os dominios}

## 2. Backbone

{descoberta de backbone com justificativa}

## 3. Autores

{mapeamento de autores com hierarquia}

## 4. Frameworks e Metodos Proprietarios

{catalogo de frameworks}

## 5. Regras Cardinais

{lista de regras absolutas}

## 6. Glossario Preliminar

{termos proprietarios com definicoes}

## 7. Classificacao de Fontes por Volume

{fontes primarias vs suporte por volume}

## 8. Plano de Volumes

{volumes com titulos, dominios, fontes, estimativas}
{docs transversais}
{sequencia com justificativa}

## 9. Catalogo de Artefatos Acionaveis

{artefatos por tipo com fonte e volume alvo}

## 10. Problemas / Gaps / Contradicoes

{o que esta incompleto, o que se contradiz}

## 11. Voice Profile

{perfil de voz do(s) autor(es) principal(is)}
```

Salvar em: `kbs/{slug}/00-pipeline/MAPA-TERRITORIAL.md`

---

## Quality Gate QG-ETL-001: Territorial Comprehension

| Criterio | Threshold |
|----------|-----------|
| Todas as fontes lidas | Cada SRC-* no manifest tem dominio mapeado |
| Dominios identificados | >= 3 |
| Backbone identificado | Secao 2 preenchida (com justificativa se nao existe) |
| Autores mapeados | Secao 3 preenchida com hierarquia |
| Fontes classificadas | Cada volume tem primarias + suporte |
| Regras cardinais | >= 1 identificada |
| Voice profile completo | Tom + catchphrases + terminologia |
| MAPA-TERRITORIAL.md salvo | Arquivo existe em 00-pipeline/ |

**Se falhar:** Informar Chief com detalhes do que falta.

---

## Quality Gate QG-ETL-002: Architecture Approval

| Criterio | Threshold |
|----------|-----------|
| Plano apresentado ao usuario | Chief mostrou secao 8 do MAPA |
| Aprovacao explicita | Usuario disse "sim/aprovo/pode ir" |
| Volumes definidos | >= 2 |
| Dominios core cobertos | 100% |

**Nao avanca sem aprovacao explicita do usuario.**

```yaml
elicit: true
prompt: |
  Mapa Territorial completo. Apresentando plano de volumes:

  {secao 8 do MAPA — volumes com titulos, dominios, estimativas}

  Logica da sequencia: {rationale}

  Voce aprova essa estrutura? Quer mudar algo?
type: "free_text"
```

**Acoes do usuario:**
1. Aprovar como esta → avancar
2. Reordenar volumes → ajustar e reapresentar
3. Combinar volumes → ajustar e reapresentar
4. Separar volume → ajustar e reapresentar
5. Adicionar/remover dominio → ajustar e reapresentar

---

## Arquivos Gerados

```
kbs/{slug}/00-pipeline/
  MAPA-TERRITORIAL.md              # Documento integrado com 11 secoes
```

**NAO gera mais:**
- ~~source-map.yaml~~ (absorvido pelo MAPA)
- ~~voice-profile.yaml~~ (absorvido pelo MAPA)
- ~~topic-structure.yaml~~ (absorvido pelo MAPA)
- ~~reading-report.yaml~~ (absorvido pelo MAPA)
- ~~volume-plan.yaml~~ (absorvido pelo MAPA)

---

**Task Status:** Ready for Production
