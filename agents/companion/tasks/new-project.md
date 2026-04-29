# Task: new-project

## Objetivo

Criar um novo projeto no sistema: verificar vaga, coletar info, criar tracker, adicionar no cockpit.

## Trigger

- `*novo-projeto` no Companion
- "quero comecar um projeto novo", "novo projeto", "tenho um projeto"

## Agente Executor

companion

## Passos

### Step 1: Verificar Vaga no Cockpit

Ler `business/cockpit.md` secao ATIVOS.

**SE 3 projetos ativos:**
→ "Voce ja tem 3 projetos ativos (max permitido):"
→ Listar os 3 com status
→ "Qual voce quer congelar pra abrir espaco?"
→ SE expert escolhe: mover projeto pra CONGELADOS no cockpit
→ Continuar

**SE menos de 3:**
→ Continuar

### Step 2: Coletar Informacoes

Perguntar ao expert (pode ser tudo de uma vez ou em etapas):

1. **Nome do projeto** — como vai chamar? (ex: "NDF Workshop Ciclo 28/03")
2. **Objetivo** — o que esse projeto precisa alcançar? (1 frase)
3. **Dono** — quem responde? (ex: "Euriler + Agentes")
4. **Deadline** — tem data limite? (ex: "28/03" ou "sem deadline")
5. **Fases previstas** — quais as etapas grandes? (ex: "Preparacao, Captacao, Evento, Pos-evento")

SE expert nao sabe as fases:
→ "Posso sugerir fases baseado no objetivo. Quer?"
→ Sugerir 3-5 fases logicas

### Step 3: Criar Slug do Projeto

Gerar slug a partir do nome:
- Lowercase, sem acentos, hifens no lugar de espacos
- Ex: "NDF Workshop Ciclo 28/03" → `ndf-workshop-ciclo-2803`

### Step 4: Criar Estrutura

1. Criar pasta `business/campanhas/{slug}/`
2. Copiar `business/templates/tracker-template.md` → `business/campanhas/{slug}/tracker.md`
3. Preencher tracker com info coletada:
   - Header (inicio, deadline, dono, status: Ativo)
   - Fases (tabela com status "Nao iniciado")
   - Primeira fase marcada como "Em andamento"
4. Criar `business/campanhas/{slug}/BRIEFING.md` do template se aplicavel

### Step 5: Adicionar no Cockpit

Editar `business/cockpit.md`:
- Adicionar nova linha na tabela ATIVOS
- Preencher: nome, objetivo, next action, dono, status, link pro tracker

### Step 6: Definir Primeiras Tarefas

Perguntar ao expert:
→ "Quais sao as primeiras tarefas da Fase 1?"
→ SE expert sabe: adicionar no tracker
→ SE nao sabe: "Posso sugerir baseado no objetivo. Quer?"

### Step 7: Briefing do Projeto

Apresentar resumo:

```
=== PROJETO CRIADO ===

Nome: {nome}
Objetivo: {objetivo}
Deadline: {deadline}
Fases: {lista de fases}

Tracker: business/campanhas/{slug}/tracker.md
Cockpit: atualizado

Fase 1: {nome da fase}
Primeiras tarefas:
- {tarefa 1} — {dono}
- {tarefa 2} — {dono}

Pronto pra comecar. Quer focar nesse projeto agora?
```

## Veto Conditions

| Condicao | Acao |
|----------|------|
| Cockpit nao existe | Criar cockpit do template antes de continuar |
| 3+ projetos ativos e expert nao quer congelar | VETO — "Nao posso criar sem vaga. Max 3 ativos (Constitution)" |
| Nome duplicado no cockpit | Avisar: "Ja existe projeto com esse nome. Quer outro nome?" |

## Completion Criteria

- Tracker criado e preenchido
- Cockpit atualizado com novo projeto
- Primeiras tarefas definidas
- Expert recebeu briefing do projeto
