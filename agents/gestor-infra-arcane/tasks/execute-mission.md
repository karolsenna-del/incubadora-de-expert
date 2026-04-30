---
task: "Execute Mission"
responsavel: "@gestor-infra"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Missao descrita pelo usuario"
Saida: "Missao executada + relatorio + documentacao"
Checklist:
  - "Entendimento da missao confirmado"
  - "Playbook consultado"
  - "Delegation Map checado"
  - "Missao executada"
  - "Relatorio entregue"
  - "SOP criado/atualizado se processo novo"
  - "Mission Log atualizado"
  - "PDSA executado"
execution_type: "semantic"
---

# Task: Execute Mission — Ciclo Completo de Missao

## Objetivo

Receber missao, executar, reportar, documentar. O ciclo principal do worker.

## Trigger

`*mission` ou qualquer tarefa recebida do usuario.

## Passos

### Step 1: Receber e Confirmar

1. Ler a missao do usuario
2. Identificar: O que fazer? Em qual plataforma? Qual resultado esperado?
3. Se algo nao esta claro: perguntar ANTES de executar
4. Se esta claro: confirmar entendimento brevemente e seguir

### Step 2: Checar Vault e Playbook

1. Abrir `data/gestor-infra-vault.md` — ja tem credenciais necessarias?
2. Abrir `data/gestor-infra-playbook.md`
3. Buscar SOP relevante pra essa missao
3. Se encontrou: seguir SOP como base (adaptar se necessario)
4. Se nao encontrou: planejar execucao (consultar KB, pesquisar se necessario)

### Step 3: Checar Delegation Map

1. Identificar nivel de autonomia pra essa missao
2. Se nivel 4-7: executar diretamente
3. Se nivel 1-3: apresentar plano, aguardar aprovacao

### Step 4: Planejar (se necessario)

1. Consultar Foundation KB pra informacoes relevantes
2. Se KB nao tem: pesquisar via WebSearch
3. Definir passos de execucao
4. Identificar riscos e pontos de atencao

### Step 5: Executar

1. Executar a missao seguindo o plano
2. Usar ferramenta adequada (Playwright vs API vs MCP vs script)
3. **Visao periferica:** observar ambiente ao redor durante execucao
   - Encontrou algo quebrado? Registrar pra relatorio
   - Encontrou inconsistencia? Flaggar
   - Encontrou oportunidade de automacao? Anotar
4. Testar resultado
5. Se usuario forneceu credenciais novas durante a missao: registrar IMEDIATAMENTE no Vault

### Step 6: Reportar

Entregar relatorio estruturado:

```
=== RELATORIO DE MISSAO ===

Missao: {o que foi pedido}
Status: {Concluida / Parcial / Bloqueada}

O que foi feito:
  1. {passo 1}
  2. {passo 2}
  ...

Resultado: {evidencia do resultado}

Observacoes:
  - {gaps/inconsistencias encontradas, se houver}
  - {oportunidades de automacao, se identificadas}

Proximos passos: {se houver}
```

### Step 7: Documentar

1. Se processo novo: criar SOP no Playbook (`document-process`)
2. Se processo existente mudou: atualizar SOP
3. Se aprendizado novo: atualizar Foundation KB
4. Registrar no Mission Log

### Step 8: PDSA (Improvement Loop)

1. **Plan:** O que era esperado?
2. **Do:** O que foi feito?
3. **Study:** Bateu? O que surpreendeu? O que demorou?
4. **Act:** Atualizar SOP? KB? Propor automacao? Criar script?

## Error Handling

| Cenario | Acao |
|---------|------|
| Ferramenta desconhecida | Modo Pesquisa antes de executar |
| Erro durante execucao | Diagnosticar, resolver, documentar |
| Acesso faltando | Flagar e pedir acesso |
| Missao parcial | Reportar o que fez e o que falta |
| Encontrou gap critico | Parar, flagar, aguardar direcao |
