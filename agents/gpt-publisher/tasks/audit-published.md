---
task: "Audit Published"
responsavel: "@gpt-publisher"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Nenhuma (varre todos os registros existentes)"
Saida: "Relatório de quais GPTs publicados estão desatualizados em relação à mente de origem"
Checklist:
  - "Todos os registros gpt-id.md encontrados"
  - "Cada mente de origem comparada com o estado no momento da última publicação"
  - "Divergências listadas"
execution_type: "sequential"
---

# Task: Audit Published — Auditoria de GPTs Publicados

## Objetivo

Conferir se algum GPT publicado ficou desatualizado porque a mente de origem no Auroq evoluiu (KB viva — mentes crescem com uso).

## Trigger

Modo 5 (Auditoria): "os GPTs publicados ainda batem com as mentes de origem?", "verifica se algum GPT ficou desatualizado", `*audita`

## Passos

### Step 1: Listar Registros

Buscar todos os arquivos `agents/gpt-publisher/output/*/custom-gpt/gpt-id.md`.

SE nenhum encontrado: "Ainda não publiquei nenhum GPT — nada pra auditar."

### Step 2: Comparar Cada Registro com a Mente Atual

Para cada registro:
1. Ler a "Versão da mente publicada" (data/hash registrado no momento da publicação)
2. Checar a data de modificação atual de `agents/{slug}/agents/{slug}.md` e `agents/{slug}/data/{slug}-kb.md`
3. SE a mente foi modificada depois da última publicação → marcar como desatualizado

### Step 3: Reportar

```
=== AUDITORIA DE GPTs PUBLICADOS ===

Atualizados:
  • {mente-1} — publicado {data}, mente sem mudanças desde então

Desatualizados:
  • {mente-2} — publicado {data}, mente mudou em {data-mudança}
    Mudou: {agent.md e/ou KB}

Quer que eu atualize algum desses agora?
```

### Step 4: Se Karol Pedir Atualização

Seguir `execute-mission.md` normalmente pra cada mente escolhida, com `gpt_id_existente=true` (fluxo de atualização, não criação).

## Error Handling

| Cenário | Ação |
|---------|------|
| Registro `gpt-id.md` corrompido ou incompleto | Reportar como "status desconhecido", sugerir republicar do zero |
| Mente de origem foi removida (`agents/{slug}/` não existe mais) | Sinalizar: "O GPT `{nome}` foi publicado a partir de uma mente que não existe mais no Auroq. Mantém o GPT no ar mesmo assim?" |
