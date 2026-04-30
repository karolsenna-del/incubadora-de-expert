---
task: "Diagnose Issue"
responsavel: "@gestor-infra"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Problema reportado ou detectado"
Saida: "Diagnostico + solucao (executada ou proposta) + documentacao"
Checklist:
  - "Sintomas coletados"
  - "KB consultada"
  - "Causa raiz identificada"
  - "Solucao proposta ou executada"
  - "Troubleshooting atualizado na KB"
execution_type: "semantic"
---

# Task: Diagnose Issue — Investigar e Resolver Problema

## Objetivo

Investigar problema tecnico, identificar causa raiz, resolver (ou propor solucao), documentar.

## Trigger

`*diagnose` ou "o que ta errado com X", "por que Y nao funciona", "audita Z".

## Passos

### Step 1: Coletar Sintomas

1. O que esta acontecendo?
2. O que deveria estar acontecendo?
3. Quando comecou?
4. O que mudou recentemente?
5. Se usuario nao sabe: investigar diretamente

### Step 2: Consultar KB

1. Abrir `data/gestor-infra-kb.md` — secao Troubleshooting
2. Buscar problema similar ja documentado
3. Se encontrou: seguir solucao documentada
4. Se nao encontrou: investigar

### Step 3: Investigar

1. Checar logs (se disponivel)
2. Checar configuracoes da plataforma afetada
3. Checar integracoes (webhook, API, automacao)
4. Se necessario: usar Playwright pra inspecionar interface
5. Se necessario: pesquisar via WebSearch

### Step 4: Diagnosticar

1. Identificar causa raiz (nao so sintoma)
2. Classificar severidade: Critico / Alto / Medio / Baixo
3. Avaliar impacto: o que mais pode ser afetado?

### Step 5: Resolver ou Propor

1. Checar Delegation Map
2. Se nivel 4-7: executar fix diretamente
3. Se nivel 1-3: propor solucao, aguardar aprovacao
4. Testar que o fix resolveu o problema

### Step 6: Reportar

```
=== DIAGNOSTICO ===

Problema: {descricao}
Severidade: {Critico/Alto/Medio/Baixo}
Causa raiz: {o que causou}

Solucao: {o que foi feito ou proposto}
Status: {Resolvido / Proposto / Parcial}

Impacto colateral: {o que mais foi afetado, se algo}
Prevencao: {como evitar que aconteca de novo}
```

### Step 7: Documentar

1. Adicionar ao Troubleshooting da Foundation KB
2. Se solucao envolve processo: criar SOP preventivo no Playbook
3. Se problema recorrente: flagar pro usuario

## Error Handling

| Cenario | Acao |
|---------|------|
| Causa raiz nao identificada | Documentar o que investigou, escalar pro usuario |
| Fix requer acesso que nao tem | Flagar, pedir acesso |
| Problema em cascata | Mapear todas as dependencias, resolver na raiz |
| Infra complexa demais | Escalar com diagnostico completo |
