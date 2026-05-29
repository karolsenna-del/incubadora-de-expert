---
task: "Save and Deliver"
responsavel: "@visual-briefer"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Briefings finalizados de todos os blocos do evento"
Saida: "Briefings salvos no workspace + cópia em local de fácil acesso, entregue ao usuário"
Checklist:
  - "Workspace path confirmado com usuário"
  - "Local de fácil acesso confirmado com usuário"
  - "Todos os briefings salvos nos 2 paths"
  - "Style prefix consistente entre partes verificado"
  - "Confirmação de entrega ao usuário"
execution_type: "interactive"
---

# Task: Save and Deliver — Fase 7 fim

## Executive Summary

Última task do squad. Salva os briefings nos paths definidos pelo usuário e entrega.

**Quality Gate: QG-SF-06 (Briefing Entregue)**

## Steps

### Step 1: Confirmar paths (primeira vez do evento)

Se ainda não definiu paths nesse evento:

> "Onde quero salvar os briefings? Preciso de 2 caminhos:
> 1. **Workspace do evento** (onde fica o trabalho organizado)
> 2. **Local de fácil acesso** pra você pegar e mandar pro Manus rapidamente (Downloads, área de trabalho, drive, ou outro)"

Capturar paths e reusar nos blocos seguintes do mesmo evento.

### Step 2: Salvar nos 2 paths

Pra cada bloco do evento:

```bash
# Workspace
{workspace_path}/briefing-manus-pt{N}.md

# Local fácil acesso
{easy_access_path}/briefing-manus-{evento}-parte{N}.md
```

### Step 3: Verificar consistência

Checar:
- [ ] Style prefix IDÊNTICO em todas as partes
- [ ] Numeração de slides correta entre partes (workshop) ou independente (avulsa)
- [ ] Visual rhymes apontam pra slides existentes
- [ ] Sequências evolutivas marcadas
- [ ] Final notes consolidam visual rhymes + sequences + central images

### Step 4: Entregar ao usuário

```
=== BRIEFINGS ENTREGUES ===

{N} arquivos de briefing salvos:

Workspace ({workspace_path}):
  - briefing-manus-pt1.md (Bloco 1: {nome})
  - briefing-manus-pt2.md (Bloco 2: {nome})
  - ...

Cópia fácil acesso ({easy_access_path}):
  - briefing-manus-{evento}-parte1.md
  - briefing-manus-{evento}-parte2.md
  - ...

Pra mandar pro Manus:
1. Abre uma task nova no Manus
2. Cola o briefing inteiro de uma parte
3. Manda gerar
4. Repete pra cada parte

Style prefix está IDÊNTICO em todas as partes — os slides ficam visualmente consistentes.

Acabou. {Total slides} slides com briefing pronto pra produção visual.
```

### Step 5: Quality Gate QG-SF-06

**Critério:**
- [ ] Briefing salvo em ambos paths
- [ ] Style prefix consistente verificado
- [ ] Confirmação de entrega ao usuário

Se passou: pipeline completo. Squad encerra.

## Error Handling

| Cenário | Ação |
|---------|------|
| Path apontado não existe | Sinalizar pro usuário criar ou apontar outro |
| Permissão negada pra escrever | Sinalizar pro usuário ajustar permissões |
| Style prefix inconsistente entre partes | BLOQUEAR QG-SF-06. Voltar pra build-style-prefix, refazer briefings |
| Algum bloco sem briefing | BLOQUEAR. Voltar pra write-manus-briefing do bloco faltando |

---

## Cardinal Rules Aplicadas

- Style prefix IDÊNTICO entre partes (PU-031)
- Não infere paths — pergunta ao usuário (PU-030)
- Cópia em local de fácil acesso pra mandar pro Manus rápido
