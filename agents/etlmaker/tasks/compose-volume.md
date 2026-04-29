---
task: "Compose Volume"
responsavel: "@composer"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "MAPA-TERRITORIAL.md, fontes originais"
Saida: "Volume composto (1 arquivo .md por volume) + spot-check + checkpoint"
Checklist:
  - "Volume tem >= 300 linhas"
  - "Formatacao rica (tabelas, listas, headers)"
  - ">= 3 exemplos preservados do original"
  - ">= 2 tabelas"
  - ">= 10 referencias [Fonte:] inline"
  - "Voz do instrutor preservada"
  - "Regras cardinais destacadas"
  - "Spot-check: 10 claims verificados (>= 8 corretos, 0 inventados)"
  - "Checkpoint salvo + PLANO-ETL.md atualizado"
execution_type: "automated"
---

# Task: Compose Volume — Fase 2

**Task ID:** etlmaker/compose-volume
**Version:** 3.0.0
**Status:** Production Ready
**Created:** 2026-03-04
**Updated:** 2026-03-08
**Category:** Composition
**Execution Type:** Automated (executado 1x por volume, ciclo blocado)

---

## Executive Summary

Compor um volume rico usando ciclo blocado de 6 steps: carregar contexto → ler primarias → ler enriquecimento → compor → spot-check → checkpoint. Cada volume e um ciclo completo e independente. So avanca pro proximo depois de salvar.

O input agora e o MAPA-TERRITORIAL.md (nao mais source-map.yaml + volume-plan.yaml). O composer le as fontes primarias primeiro (estrutura), depois as de enriquecimento (profundidade).

---

## Pipeline Visual — Ciclo Blocado por Volume

```
Para cada volume do plano (sequencial):

  ┌─ STEP 1: Carregar contexto do volume ──────────────┐
  │  Ler secao do MAPA-TERRITORIAL pra este volume     │
  │  Identificar fontes primarias + enriquecimento      │
  └────────────────────────────────────────────────────┘
                      │
                      v
  ┌─ STEP 2: Ler fontes primarias (ancora) ────────────┐
  │  Leitura profunda das fontes que dao ESTRUTURA      │
  │  Extrair: conceitos, frameworks, regras, exemplos   │
  └────────────────────────────────────────────────────┘
                      │
                      v
  ┌─ STEP 3: Ler fontes de enriquecimento ─────────────┐
  │  Q&A, plantoes, exemplos, edge cases, troubleshoot  │
  │  Complementar o que a ancora deu                    │
  └────────────────────────────────────────────────────┘
                      │
                      v
  ┌─ STEP 4: Compor volume ────────────────────────────┐
  │  Todas as skills ETLmaker:                          │
  │  - Voz preservada                                   │
  │  - Proveniencia inline [Fonte:]                     │
  │  - Formatacao rica (tabelas, listas, headers)       │
  │  - Exemplos preservados (nunca resumidos)            │
  │  - Regras Cardinais destacadas                      │
  │  - Metaforas e analogias do autor                   │
  │  - Autocontido (leitor entende sem ler outros)      │
  └────────────────────────────────────────────────────┘
                      │
                      v
  ┌─ STEP 5: Spot-check de fidelidade ─────────────────┐
  │  Auditor verifica:                                  │
  │  - 10 claims aleatorios → batem com fonte?          │
  │  - Alguma invencao obvia?                           │
  │  - Voz consistente?                                 │
  │  - Se falhar: corrigir AGORA (nao propagar erro)    │
  └────────────────────────────────────────────────────┘
                      │
                      v
  ┌─ STEP 6: Checkpoint ──────────────────────────────┐
  │  Salvar volume como arquivo                         │
  │  Atualizar progresso no PLANO-ETL.md               │
  │  Registrar metricas (linhas, tabelas, fontes)      │
  │  → PROXIMO VOLUME                                  │
  └────────────────────────────────────────────────────┘
```

---

## Step-by-Step Execution

### Step 1: Load Context

1. Ler secao 8 do MAPA-TERRITORIAL para saber dados deste volume
2. Ler secao 7 para saber fontes primarias e de suporte
3. Ler secao 11 para saber o voice profile
4. Identificar artefatos acionaveis deste volume (secao 9 do MAPA)

**NAO precisa ter todos os volumes anteriores em contexto.** Precisa saber o plano geral (secao 8) pra evitar sobreposicao.

### Step 2: Read Primary Sources (Ancora)

Para cada fonte classificada como PRIMARIA para este volume:
1. Ler a fonte INTEIRA (nao parcial, nao scanning)
2. Extrair: conceitos, frameworks, regras, estrutura
3. Identificar exemplos, metaforas, templates

**CRITICO:** Estas sao as fontes que dao o ESQUELETO do volume.

### Step 3: Read Support Sources (Enriquecimento)

Para cada fonte classificada como SUPORTE para este volume:
1. Ler a fonte INTEIRA
2. Extrair: exemplos praticos, Q&A, edge cases, troubleshooting
3. Complementar o que as primarias deram

**CRITICO:** Estas fontes dao a CARNE — a profundidade, os exemplos reais, os edge cases.

### Step 4: Compose Document

Escrever o volume seguindo esta estrutura:

```markdown
# {Titulo do Volume}

> **Fontes primarias:** {lista}
> **Fontes de enriquecimento:** {lista}
> **Dominios:** {lista}

---

## {Dominio/Topico 1}

### {Subtopico 1.1}

{Conteudo completo — explicacao rica, nao resumida}
[Fonte: {nome}, Secao X]

> **Exemplo:** {exemplo concreto preservado fielmente}
> [Fonte: {nome}, minuto 15:30]

| Col 1 | Col 2 | Col 3 |
|-------|-------|-------|
| dado  | dado  | dado  |
[Fonte: {nome}, Secao Y]

> **REGRA CARDINAL:** {principio absoluto}
> *Motivo:* {por que e absoluto}
> [Fontes: {fonte-1} + {fonte-2} — repetida como principio absoluto]

### {Subtopico 1.2}
{...}

---

## {Dominio/Topico 2}
{...}
```

---

## Regra Operacional: Profundidade Obrigatoria

**Esta e a regra mais importante de todo o pipeline.**

O composer opera sob pressao de contexto — le 50-100KB de fonte e precisa produzir output rico. A tentacao natural e comprimir, resumir, "pegar o essencial". Isso e o OPOSTO do objetivo.

**Regras inegociaveis de profundidade:**

1. **Ler a fonte primaria INTEIRA** — cada paragrafo, cada exemplo, cada tangente. Nao scanear, nao pular o que "parece repetitivo"
2. **Ler a fonte de enriquecimento INTEIRA** — Q&A, plantoes, edge cases. Esses sao onde esta a riqueza real
3. **ZERO compressao** — se o autor gastou 5 paragrafos explicando algo, o volume reflete essa profundidade. Output MAIOR e mais organizado que input, nunca menor
4. **CADA exemplo preservado** — se o autor contou uma historia, ela aparece no volume. Se usou uma metafora, ela ta la. Se mostrou um template, ele ta la
5. **Se o autor disse de 3 formas diferentes, capturar a riqueza** — nao escolher 1 e descartar 2
6. **Se tem duvida sobre significado, reler** — nunca inferir, nunca assumir, voltar na fonte
7. **Cada claim com proveniencia** — se nao consegue apontar [Fonte:], o claim nao entra
8. **Cada erro de interpretacao custa centenas de milhares de reais** — esse conhecimento e usado pra operar negocios reais

**Anti-padroes que o composer deve evitar:**

| Anti-padrao | O que parece | O que realmente e |
|-------------|-------------|-------------------|
| "Resumir pra ficar limpo" | Organizacao | Perda de profundidade |
| "Pular exemplo que parece repetido" | Eficiencia | Perda de riqueza didatica |
| "Generalizar o que o autor disse" | Clareza | Distorcao de significado |
| "Inferir o que o autor quis dizer" | Inteligencia | Invencao |
| "Omitir tangente que nao parece central" | Foco | Perda de contexto pratico |
| "Usar terminologia 'mais clara'" | Acessibilidade | Perda de voz do autor |

**Velocidade adaptativa:** Se a fonte e pequena (5-10KB), o composer pode compor rapido. Se a fonte e gigante (50-100KB), DEVE levar o tempo que precisar. Sem pressa.

---

### Step 5: Spot-Check (Camada 1)

Apos compor, o auditor faz spot-check imediato:

```yaml
spot_check:
  claims_per_volume: 10
  selection: "aleatorio, distribuido entre secoes do volume"

  per_claim:
    - localizar: "A referencia [Fonte:] do claim"
    - ler: "O trecho ORIGINAL da fonte"
    - classificar: "CORRECT | DISTORTED | INVENTED"

  pass_criteria:
    invented: 0
    correct_min: 8
    distorted_max: 2

  fail_action:
    - "Composer corrige claims apontados"
    - "Auditor re-verifica APENAS os corrigidos"
    - "Maximo 2 ciclos por volume"
    - "Se falhar 2x: ESCALAR ao chief + usuario"
```

### Step 6: Checkpoint

Apos spot-check PASS:

1. **Salvar** — VOL-{N}-{topic-slug}.md como arquivo
2. **Atualizar PLANO-ETL.md** — marcar volume como [x] com linhas e metricas
3. **Atualizar .state.json** — volumes_composed += 1
4. **Log** — "Volume {N} composto. {lines} linhas, {fontes} referencias. Spot-check PASS."
5. **Proximo** — iniciar Step 1 do proximo volume, ou handoff ao architect se ultimo

---

## Protocolo de Persistencia

**Se contexto estourar durante a composicao:**

1. Todos os volumes ate o atual estao SALVOS (sao arquivos .md)
2. PLANO-ETL.md tem progresso atualizado (sabe onde parou)
3. MAPA-TERRITORIAL.md tem o plano completo (sabe o que falta)
4. Na retomada: reler PLANO-ETL.md → reler MAPA-TERRITORIAL.md → continuar do proximo volume

**Regra:** PLANO-ETL.md e MAPA-TERRITORIAL.md sao os 2 documentos que SEMPRE sobrevivem.

---

## Criterios de Riqueza (QG-ETL-003)

| Criterio | Minimo |
|----------|--------|
| Linhas totais | >= 300 |
| Tabelas | >= 2 |
| Exemplos preservados | >= 3 |
| Regras Cardinais | >= 1 |
| Proveniencia inline [Fonte:] | >= 10 |
| Metaforas/analogias | >= 1 |
| Headers (H2/H3) | >= 5 |
| Listas | >= 3 |

**Se nao atingir minimos:** Expandir conteudo lendo mais das fontes. Se as fontes nao tem material suficiente, informar Chief.

---

## Regras de Composicao

1. **Completude > Brevidade** — Incluir TUDO que as fontes dizem, nao resumir
2. **Organizacao > Ordem original** — Reorganizar por clareza, mas preservar conteudo
3. **Exemplos sao obrigatorios** — Se a fonte tem exemplo, ele aparece no volume
4. **Voz preservada** — Usar terminologia e frases-chave do voice profile
5. **Proveniencia inline** — Cada bloco de conteudo tem [Fonte:]
6. **Formatacao rica** — Tabelas, listas, blocos de destaque, headers
7. **Autocontido** — Leitor entende o volume sem ler os outros

---

## Arquivos Gerados

```
kbs/{slug}/
  VOL-01-{topico}.md              # Volume 1
  VOL-02-{topico}.md              # Volume 2
  ...
```

**NAO gera mais:** REPERTORIO.md (agora e responsabilidade do @architect na task integrate-package)

---

**Task Status:** Ready for Production
