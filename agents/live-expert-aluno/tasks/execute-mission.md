---
task: "Execute Mission"
responsavel: "@live-expert-aluno"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Persona + Promessa + Processo Autoral (colados) — Autoridade Tríplice e histórico de lives opcionais"
Saida: "Roteiro completo (8 blocos) + checklist + recomendação de histórico próprio"
Checklist:
  - "3 documentos obrigatórios recebidos"
  - "Tema proposto e aprovado"
  - "8 blocos da Aula de 8 Blocos completos (Acordo, Filtro, Dor e Eventos, Tira a Culpa, Autoridade Imediata, 5 Afirmações, Projeção do Cliente, Pitch+Oferta)"
  - "Bloco 6 com as 5 afirmações levantadas via IA e priorizadas"
  - "Bloco 7 com projeção usando dados reais do aluno, nunca inventados"
  - "Pitch estruturado nas 4 partes do Bloco 8 (Promessa, Filtro, Estrutura, Bônus único)"
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

### Step 3: Montar o Roteiro — 8 Blocos da Aula

Consultar `data/live-expert-aluno-kb.md` pra fórmula completa de cada bloco. Resumo:

1. **Acordo** — quem é o aluno + o que vai entregar nessa aula (o combinado)
2. **Filtro de Leads** — casos/nichos/depoimentos reais do aluno que quebram "isso funciona pro meu caso?" (perguntar quais ele tem, nunca inventar)
3. **Dor e Eventos** — 2-4 caminhos tradicionais do nicho do aluno + por que cada um costuma falhar
4. **Tira a Culpa do Lead** — reposiciona: o problema é o mercado/soluções tentadas, não a audiência
5. **Autoridade Imediata / Método** — por que o método do aluno funciona, revelando o "o quê" sem ensinar o "como" completo
6. **5 Afirmações** — usar IA (prompt na KB, seção 7) pra levantar 10 objeções do público do aluno e condensar em 5 afirmações que as quebram
7. **Projeção do Cliente** — tabela 15/30/90 dias, executando vs. não executando, com números reais do aluno (nunca inventados — se ele não tiver, usar projeção qualitativa)
8. **Pitch + Oferta + Q&A** — Promessa, Pré-requisitos/Filtro, Estrutura/Entregáveis, Bônus único (nunca vários) + abertura pra dúvidas

Fechar o Bloco 8 com a técnica "Decisão Mais Inteligente" (KB, seção 12): 2 caminhos — sozinho vs. com o aluno.

Estimar duração de cada bloco. Sem teto fixo de tempo (a Aula de 8 Blocos costuma rodar 45-60 min) — ajustar conforme o tema e a quantidade de objeções do Bloco 6.

### Step 4: Checar DoD

Percorrer o Definition of Done do agent.md antes de entregar. Se algo faltar (ex: exercício sem entrega tangível, pitch colado no final), corrigir antes de mostrar pro aluno.

### Step 5: Entregar

```
=== ROTEIRO DA LIVE — {tema} ===

{roteiro completo nos 8 blocos, com timing estimado}

--- CHECKLIST ---
{itens do DoD}

Guarda esse tema numa lista das suas lives — assim, da próxima vez que vier aqui, você já cola o histórico e eu não repito assunto.

Faz sentido, ou ajusta algo?
```

### Step 6: PDSA

1. **Plan:** que tema foi proposto?
2. **Do:** roteiro entregue com os 8 blocos completos?
3. **Study:** o aluno pediu ajuste grande ou aprovou de primeira?
4. **Act:** se um gap se repetir entre alunos, atualizar Playbook.

## Error Handling

| Cenário | Ação |
|---------|------|
| Falta Persona, Promessa ou Processo Autoral | Não avança — pede pra completar o agente correspondente primeiro |
| Aluno não tem caso/depoimento pro Bloco 2 (Filtro de Leads) | Usa validação indireta (processo autoral testado em X contexto) em vez de inventar prova social |
| Aluno não tem número/resultado real pra Bloco 7 (Projeção do Cliente) | Sugere projeção qualitativa ("onde você estaria") em vez de inventar número |
| Aluno não sabe as objeções do próprio público pro Bloco 6 | Roda o prompt de IA da KB (seção 7) junto com o aluno, na hora |
