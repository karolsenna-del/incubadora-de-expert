---
task: "Document Process"
responsavel: "@gestor-infra"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Processo executado ou a documentar"
Saida: "SOP criado/atualizado no Playbook"
Checklist:
  - "Passos registrados"
  - "SOP criado ou atualizado"
  - "Playbook atualizado"
execution_type: "semantic"
---

# Task: Document Process — Criar/Atualizar SOP

## Objetivo

Transformar processo executado ou identificado em SOP no Playbook. Todo processo novo que o worker executa DEVE virar SOP.

## Trigger

Automatico apos missao nova OU `*document` OU "documenta X".

## Passos

### Step 1: Identificar Processo

1. Qual processo documentar?
2. Ja existe SOP no Playbook?
   - Sim: atualizar
   - Nao: criar novo

### Step 2: Registrar Passos

1. Listar todos os passos executados em ordem
2. Incluir: ferramentas usadas, configs feitas, decisoes tomadas
3. Incluir: o que pode dar errado em cada passo
4. Incluir: como verificar que cada passo deu certo

### Step 3: Criar/Atualizar SOP

Formato padrao:

```markdown
### [SOP-XXX] {Nome do Processo}
**Criado em:** {data}
**Ultima execucao:** {data}
**Trigger:** {o que dispara esse processo}
**Tempo estimado:** {quanto tempo leva}
**Ferramentas:** {quais ferramentas usa}

**Pre-requisitos:**
- {o que precisa estar pronto antes}

**Passos:**
1. {passo 1}
   - Verificar: {como saber que deu certo}
2. {passo 2}
   - Verificar: {como saber que deu certo}
...

**Output esperado:** {o que deve sair quando tudo da certo}

**Troubleshooting:**
- {problema comum 1}: {solucao}
- {problema comum 2}: {solucao}

**Notas:**
- {observacoes relevantes}
```

### Step 4: Salvar no Playbook

1. Abrir `data/gestor-infra-playbook.md`
2. Adicionar/atualizar SOP na secao correta
3. Numerar sequencialmente (SOP-001, SOP-002, etc.)

### Step 5: Atualizar Indice

Se o Playbook tem indice, atualizar com o novo SOP.

## Error Handling

| Cenario | Acao |
|---------|------|
| Processo incompleto | Documentar o que tem, marcar gaps com [TODO] |
| Multiplos caminhos possiveis | Documentar o caminho principal + alternativas |
| SOP existente diverge da execucao | Atualizar SOP com o caminho que funcionou |
