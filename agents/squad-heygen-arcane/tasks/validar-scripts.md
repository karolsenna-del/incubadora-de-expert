---
task: "Validar Scripts"
responsavel: "@heygen-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "3 ângulos de script gerados pelo estrategista"
Saida: "Scripts aprovados pelo usuário (escolhidos e/ou ajustados)"
Checklist:
  - "Scripts apresentados ao usuário com justificativa"
  - "Usuário escolheu quais quer gravar"
  - "Ajustes de texto aplicados, se houve"
  - "Confirmação explícita coletada"
quality_gate: "QG-HGN-02"
execution_type: "interactive"
---

# Task: Validar Scripts — Quality Gate QG-HGN-02

## Executive Summary

O Chief apresenta os scripts gerados e coleta a aprovação explícita do usuário. Nada vai pra gravação sem esse aval — gravar áudio de um script ruim é retrabalho do usuário. O usuário escolhe quais gravar, pode ajustar texto, ou pedir novos ângulos.

## Steps

### Step 1: Apresentar os scripts

Mostrar os 3 ângulos, cada um com o texto completo e a justificativa de uma linha. Formato claro, numerado.

### Step 2: Coletar a decisão

Perguntar: quais ângulos o usuário quer gravar? Pode escolher um, vários, todos, ou nenhum. Pode pedir ajuste de texto ou um quarto ângulo.

### Step 3: Aplicar ajustes

Se o usuário pediu mudança de texto, devolver pro estrategista (`gerar-scripts`) e reapresentar. Se pediu ângulo novo, mesmo caminho.

### Step 4: Confirmar (QG-HGN-02)

Coletar a confirmação explícita: estes scripts, este texto final, estão aprovados pra gravação. Sem isso, o pipeline não avança.

### Step 5: Handoff

Passar os scripts aprovados pro diretor-look (task implícita de casamento) e depois `orientar-gravacao`.

## Error Handling

| Cenário | Ação |
|---------|------|
| Usuário rejeita todos os ângulos | Coletar o porquê, devolver pro estrategista com direção nova |
| Usuário quer ajustar texto | Devolver pro estrategista, reapresentar a versão ajustada |
| Usuário aprova mas o texto tem promessa pesada | Apontar antes de aprovar — a regra anti-promessa vale mesmo se o usuário não reparou |
