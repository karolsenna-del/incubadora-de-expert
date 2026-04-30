---
task: "Structure Module"
responsavel: "@course-creator"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "Estrutura macro validada (QG-CC-004), modulo a estruturar, PRD como referencia"
Saida: "Modulo estruturado: objetivo, aulas com objetivo + essencia, validado"
Checklist:
  - "Teoria do modulo co-desenvolvida"
  - "Objetivo do modulo definido (com o que o aluno SAI)"
  - "Aulas listadas com objetivo e essencia"
  - "Expert validou estrutura do modulo"
execution_type: "interactive"
---

# Task: Structure Module — Fase 4: Estruturacao do Modulo

**Task ID:** course-creator/structure-module
**Version:** 2.0.0
**Status:** Production Ready
**Created:** 2026-03-03
**Category:** Structure
**Execution Type:** Interactive
**Repeatable:** Sim — executa para CADA modulo do curso

---

## Executive Summary

Fase 4 do pipeline. Para cada modulo, o Creator co-desenvolve a teoria especifica, define objetivo, lista aulas com objetivo e essencia, e valida com o expert. Mesmo ciclo fractal aplicado ao nivel de modulo. Executa CONTRA o PRD — estrutura do modulo deve ser coerente com entregaveis e metodologia definidos.

**Gate:** QG-CC-005 — Estrutura do Modulo Validada (por modulo)

---

## Step-by-Step Execution

### Step 1: Contextualizar Modulo

Apresentar:
- Qual modulo estamos trabalhando (nome, posicao na sequencia)
- O que veio antes (modulo anterior, se houver)
- O que vem depois (proximo modulo)
- Como esse modulo se encaixa no desenho geral do curso

### Step 2: Co-Desenvolver Teoria do Modulo

Mesmo protocolo fractal:

1. Trazer o que ja sabe sobre o tema do modulo
2. Perguntar se o expert tem mais
3. Expert despeja
4. Perguntas provocativas pra aprofundar
5. Pesquisar se necessario
6. Processar materiais e voltar pro debate
7. Repetir ate fechar

Manter conexao com a teoria geral do curso — nao perder o fio.

### Step 3: Definir Objetivo do Modulo

- Com o que o aluno SAI desse modulo
- Qual "peca do quebra-cabeca" o aluno monta aqui
- Como isso conecta com o proximo modulo

### Step 4: Listar Aulas do Modulo

Para CADA aula definir:
- **Objetivo:** o que o aluno aprende/entende/consegue
- **Essencia:** o core do que vai ser abordado (2-3 frases)
- **Com o que o aluno sai:** resultado tangivel

Nao forcar numero de aulas — o conteudo que dita.

### Step 5: Validar Estrutura do Modulo

Apresentar pro expert:
- Objetivo do modulo
- Lista de aulas com objetivo e essencia

Perguntar:
- Faz sentido essa divisao?
- Alguma aula precisa dividir ou juntar?
- A sequencia ta logica?
- Falta algo?

**Nota:** Dividir/juntar aulas e instinto do expert (tacito). Respeitar.

### Step 6: Quality Gate QG-CC-005

Protocolo de 5 passos:
1. **APRESENTAR** estrutura do modulo (objetivo + aulas com objetivo e essencia)
2. **PERGUNTAR** "Isso bate? O que ajustaria?"
3. **LOOP DE DEBATE** — ajustar ate satisfeito
4. **APROVACAO EXPLICITA** — expert diz "fechou"
5. **HANDOFF** — informar ao Chief. Proximo: desenvolver aulas (Fase 5) ou estruturar proximo modulo

Checar:
- [ ] Teoria do modulo co-desenvolvida
- [ ] Objetivo do modulo definido
- [ ] Cada aula tem objetivo + essencia
- [ ] Estrutura coerente com PRD
- [ ] Expert validou a estrutura

---

## Veto Conditions

- VETO se listar aulas (Step 4) sem objetivo do modulo definido
- VETO se aula sem objetivo OU sem essencia definida
- VETO se declarar QG-CC-005 PASS sem confirmacao explicita do expert

---

## Decisao de Fluxo Pos-Gate

Apos QG-CC-005 passar, duas opcoes:

1. **Ir pra Fase 5** — desenvolver aulas desse modulo (sequencial)
2. **Estruturar proximo modulo** — deixar aulas pra depois

Quem decide e o expert. Perguntar:
"Quer ja desenvolver as aulas desse modulo ou prefere estruturar o proximo modulo primeiro?"

---

## Error Handling

| Cenario | Acao |
|---------|------|
| Expert quer dividir aula que parecia unica | Normal — ajustar lista e revalidar |
| Expert quer juntar duas aulas | Normal — consolidar e revalidar |
| Modulo ficou com muitas aulas (8+) | Questionar se pode dividir em 2 modulos. Decisao do expert |
| Conteudo de uma aula parece pertencer a outro modulo | Sinalizar. Mover se expert concordar |

---

**Task Status:** Ready for Production
