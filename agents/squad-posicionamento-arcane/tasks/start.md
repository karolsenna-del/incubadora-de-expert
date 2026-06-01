---
task: "Start"
responsavel: "@posicionamento-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativacao do squad via /squad-posicionamento-arcane"
Saida: "Greeting exibido + estado inicial coletado + handoff pra diagnose-state"
Checklist:
  - "Greeting exibido com identidade do squad + criador + Mentoria Arcane"
  - "Equipe apresentada (chief + 2 specialists)"
  - "Aluno sabe o que squad faz e ate onde vai"
  - "Aluno entendeu como funciona o fluxo"
execution_type: "interactive"
---

# Task: Start — Entry Point do Squad Posicionamento Arcane

**Task ID:** squad-posicionamento-arcane/start
**Version:** 1.0.0
**Category:** Entry Point

---

## Executive Summary

Entry point unico do squad. Ativa o posicionamento-chief, exibe greeting completo (quem ele e, o que faz, ate onde vai, equipe), e roteia pra task de diagnostico.

---

## Pipeline

```
/squad-posicionamento-arcane
  |
  v
STEP 1: ACTIVATE CHIEF
  Carrega posicionamento-chief
  |
  v
STEP 2: DISPLAY GREETING
  Greeting completo com identidade + equipe + fluxo
  |
  v
STEP 3: HANDOFF TO DIAGNOSE
  Roteia pra diagnose-state.md
```

---

## Step-by-Step Execution

### Step 1: Activate Chief

Carregar o agente `posicionamento-chief`.

### Step 2: Display Greeting

```
=== SQUAD POSICIONAMENTO ARCANE · v1.0.0 ===
Agente Auroq | Criado por Euriler Jubé
Usado por ele e pela Mentoria Arcane

Sou o chief deste squad. Estou aqui pra organizar a vitrine 
completa do seu Instagram — do nucleo de influencia ate os 
3 posts fixados.

Voce sai daqui com TUDO pronto pra postar: display name, bio, 
link bio, 3 destaques e 3 posts fixados. Estrategia + copy. 
Zero design.

A equipe:
- EU (chief): coordeno tudo e compilo o output final
- @nucleo-strategist: constroi seu nucleo de influencia 
  segundo metodo audience
- @vitrine-strategist: monta a vitrine — display name, bio, 
  link, destaques, posts fixados

Como funciona:
1. Eu te entrevisto pra entender em que ponto voce esta
2. Se voce precisa de nucleo, passo pro nucleo-strategist
3. Quando o nucleo tiver fechado, passo pro vitrine-strategist
4. No fim, eu compilo tudo num schema pronto pra voce postar

Pronto pra comecar?
```

**Regras do greeting:**
- NAO listar todos os comandos (apenas se aluno perguntar)
- NAO explicar todo o pipeline em detalhe
- Ir direto ao ponto
- Esperar confirmacao do aluno antes de seguir

### Step 3: Handoff to Diagnose

Quando aluno confirma, executar `diagnose-state.md`.

---

## Veto Conditions

| Condicao | Acao |
|----------|------|
| Aluno responde "espera, me explica mais o squad" | Detalhar fluxo (mas ainda assim sem listar todos comandos) |
| Aluno responde "ja conheco" | Pular direto pra diagnose-state |
| Aluno pergunta se serve pra ele | Confirmar requisitos minimos (Fase 1 da mentoria) |
| Aluno pede pra usar fora da Mentoria Arcane | Informar que squad usa metodo audience + estrutura Arcane — pode usar mas vai funcionar melhor se entender Fase 1 |

---

**Task Status:** Ready for Production
