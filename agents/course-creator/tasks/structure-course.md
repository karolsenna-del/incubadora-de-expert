---
task: "Structure Course"
responsavel: "@course-creator"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "PRD v2 com metodologia (QG-CC-003 aprovado)"
Saida: "Estrutura macro do curso: modulos nomeados, sequenciados, jornada coerente"
Checklist:
  - "Teoria do curso co-desenvolvida e validada"
  - "Objetivo do curso definido (transformacao clara)"
  - "Conteudo necessario mapeado"
  - "Agrupado em modulos"
  - "Modulos sequenciados em ordem logica"
  - "Modulos nomeados"
  - "Expert validou estrutura macro"
execution_type: "interactive"
---

# Task: Structure Course — Fase 3: Macro do Curso

**Task ID:** course-creator/structure-course
**Version:** 2.0.0
**Status:** Production Ready
**Created:** 2026-03-03
**Category:** Structure
**Execution Type:** Interactive

---

## Executive Summary

Fase 3 do pipeline. O Creator co-desenvolve a teoria do curso com o expert, define o objetivo, mapeia todo conteudo necessario, agrupa em modulos, sequencia e valida a estrutura macro. Segue o ciclo fractal: TEORIA → ESTRUTURA → REFINAMENTO → VALIDACAO. Executa CONTRA o PRD — toda decisao de estrutura deve ser coerente com o que foi definido no PRD (Fases 1-2).

**Gate:** QG-CC-004 — Estrutura Macro Validada

---

## Step-by-Step Execution

### Step 1: Carregar KB + PRD

Ler `data/course-creation-kb.md` — craft do roteiro, criterios de qualidade, padroes didaticos.
Ler PRD (v2 com metodologia) — parametros do produto, entregaveis comprometidos, metodologia mapeada. A estrutura do curso deve ser COERENTE com o PRD.

### Step 2: Co-Desenvolver Teoria do Curso

Seguir o protocolo de co-desenvolvimento:

1. Trazer o que ja sabe sobre o tema do curso
2. Perguntar se o expert tem mais, dar opcoes do que pode trazer
3. Expert despeja o que pensa — deixar "esvaziar a cabeca"
4. Direcionar perguntas pra estimular extracao e aprofundamento
5. Pesquisar fontes se necessario
6. Se expert trouxer materiais: processar e VOLTAR PRO DEBATE
7. Repetir ate: contexto fecha, tudo conecta, "wow faz sentido"

**Sinal de que chegou la:** o contexto fecha, tudo se conecta, esta bem amarrado, alguem de fora consegue seguir o raciocinio.

### Step 3: Definir Objetivo do Curso

Com a teoria desenvolvida, definir:
- Pra quem e
- Qual transformacao gera
- Ponto A → Ponto B (claro e especifico)

### Step 4: Mapear Conteudo Necessario

Brainstorm livre de TUDO que precisa ser abordado no curso.
- Sem filtrar ainda — listar tudo
- Expert + IA juntos
- Pode trazer do que foi debatido na teoria

### Step 5: Agrupar em Modulos

Temas que caminham juntos viram modulos:
- Identificar clusters de conteudo relacionado
- Cada modulo = um tema ou etapa da jornada
- Nao forcar numero de modulos — o conteudo que dita

### Step 6: Sequenciar Modulos

Ordenar em jornada logica de aprendizado:
- O que precisa vir antes?
- O que depende de que?
- Qual a progressao natural?
- Aplicar Padrao Quebra-Cabeca: mostrar o desenho grande primeiro

### Step 7: Nomear Modulos

Nomes que comunicam o tema/essencia de cada modulo.

### Step 8: Validar Estrutura Macro

Apresentar pro expert:
- Lista de modulos com nomes e ordem
- Breve descricao do que cada modulo cobre

Perguntar:
- Faz sentido?
- Completo?
- Enxuto?
- Jornada clara?

### Step 9: Quality Gate QG-CC-004

Protocolo de 5 passos:
1. **APRESENTAR** estrutura macro (modulos nomeados, sequenciados, com descricao)
2. **PERGUNTAR** "Isso bate? O que ajustaria?"
3. **LOOP DE DEBATE** — ajustar ate satisfeito
4. **APROVACAO EXPLICITA** — expert diz "fechou"
5. **HANDOFF** — informar ao Chief que Fase 3 completa. Proximo: Fase 4 (estruturar modulos)

Checar:
- [ ] Teoria do curso co-desenvolvida
- [ ] Objetivo definido
- [ ] Modulos nomeados e sequenciados
- [ ] Estrutura coerente com PRD
- [ ] Expert confirmou que a estrutura faz sentido

---

## Veto Conditions

- VETO se avancar pra Step 4 (mapear conteudo) sem teoria co-desenvolvida e validada
- VETO se avancar pra Step 8 (validar macro) sem modulos nomeados e sequenciados
- VETO se estrutura contradiz o PRD (parametros, entregaveis, metodologia)
- VETO se declarar QG-CC-004 PASS sem confirmacao explicita do expert

---

## Error Handling

| Cenario | Acao |
|---------|------|
| Expert quer mudar a ordem depois | Normal. Resequenciar e revalidar |
| Modulos demais (10+) | Questionar se alguns podem ser agrupados. Decisao e do expert |
| Expert traz material externo | Processar, extrair insights, voltar pro debate |
| Teoria trava | Pesquisar fontes, trazer provocacoes, mudar angulo |

---

**Task Status:** Ready for Production
