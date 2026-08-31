---
task: "Execute Mission"
responsavel: "@live-expert-aluno"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Persona + Promessa + Processo Autoral (colados) — Autoridade Tríplice e histórico de lives opcionais"
Saida: "Roteiro completo (4 blocos) + checklist + recomendação de histórico próprio"
Checklist:
  - "3 documentos obrigatórios recebidos"
  - "Tema proposto e aprovado"
  - "4 blocos do Funil de Zoom completos"
  - "Exercício com entrega tangível presente"
  - "Pitch integrado, não colado no final"
  - "DoD conferido"
  - "Recomendação de histórico próprio entregue"
execution_type: "sequential"
---

# Task: Execute Mission — Roteirizar a Live

## Objetivo

Executar o pipeline completo: coletar insumos → propor tema → montar roteiro → checar DoD → entregar.

## Pré-condições

- Persona Compradora, Promessa Transformadora e Processo Autoral do aluno, colados na conversa.

## Passos

### Step 1: Perguntar por Insumos Opcionais

Depois dos 3 obrigatórios, perguntar:

"Você tem sua Autoridade Tríplice pronta? Se tiver, cola aqui pra eu usar seu tom de voz já definido — se não tiver, eu pergunto direto."

"Você já tem um histórico das lives que já fez? Se tiver, cola aqui pra eu não repetir tema. Se não tiver, sem problema, seguimos sem essa checagem."

Se não vier Autoridade Tríplice: perguntar rapidamente o tom de voz desejado (inspirador, direto, provocativo, acolhedor, técnico, etc — mesmas opções da Etapa 9 do Agente da Promessa Transformadora).

### Step 2: Propor Tema

Com base na dor mais forte da Persona e na progressão do Processo Autoral (em que módulo/etapa o aluno está falando pra sua audiência), propor um tema específico — nunca genérico. Se houver histórico de lives, checar que o tema não repete um já usado recentemente.

Apresentar: "Proponho o tema '{tema}' porque {justificativa}. Faz sentido, ou prefere outro ângulo?"

Aguardar aprovação (sim/ajustar) antes de montar o roteiro completo.

### Step 3: Montar o Roteiro — 4 Blocos do Funil de Zoom

Consultar `data/live-expert-aluno-kb.md` pra fórmula completa de cada bloco. Resumo:

1. **Narrativa (Porquê)** — gancho de abertura + história real do aluno relacionada ao tema (perguntar se ele tem uma, nunca inventar) + frase-âncora
2. **Execução (Como)** — o princípio/framework central do tema + passo a passo + spoiler do pitch plantado no meio (uma menção rápida da oferta, não o pitch completo ainda)
3. **Prática (Mão na Massa)** — exercício concreto que a audiência faz ao vivo, com tempo real reservado, e como reengajar depois
4. **Prova Racional + Pitch** — prova com resultado/número concreto do próprio aluno (nunca inventado — perguntar se ele tem um) + pitch da oferta dele com CTA único

Estimar duração de cada bloco, mirando ≤30 min total (ajustável se o aluno pedir mais tempo).

### Step 4: Checar DoD

Percorrer o Definition of Done do agent.md antes de entregar. Se algo faltar (ex: exercício sem entrega tangível, pitch colado no final), corrigir antes de mostrar pro aluno.

### Step 5: Entregar

```
=== ROTEIRO DA LIVE — {tema} ===

{roteiro completo nos 4 blocos, com timing estimado}

--- CHECKLIST ---
{itens do DoD}

Guarda esse tema numa lista das suas lives — assim, da próxima vez que vier aqui, você já cola o histórico e eu não repito assunto.

Faz sentido, ou ajusta algo?
```

### Step 6: PDSA

1. **Plan:** que tema foi proposto?
2. **Do:** roteiro entregue com os 4 blocos completos?
3. **Study:** o aluno pediu ajuste grande ou aprovou de primeira?
4. **Act:** se um gap se repetir entre alunos, atualizar Playbook.

## Error Handling

| Cenário | Ação |
|---------|------|
| Falta Persona, Promessa ou Processo Autoral | Não avança — pede pra completar o agente correspondente primeiro |
| Aluno não tem história pessoal pro tema proposto | Pergunta se quer usar outro ângulo sem história, ou trocar de tema |
| Aluno não tem número/resultado pra Prova Racional | Sugere usar resultado qualitativo (transformação de um caso, se tiver permissão de citar) em vez de inventar número |
