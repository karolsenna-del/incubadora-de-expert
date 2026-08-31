---
task: "Execute Mission"
responsavel: "@stories-expert-aluno"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Persona + Promessa + Processo Autoral (colados) — Autoridade Tríplice opcional"
Saida: "Sequência de stories com texto pronto, numerada"
Checklist:
  - "3 documentos obrigatórios recebidos"
  - "Hoje ou semana definido"
  - "Categoria/distribuição aprovada"
  - "1 tema por sequência respeitado"
  - "Dispositivos aplicados sem expor jargão"
  - "CTA no story 1 quando categoria for vender"
  - "Nenhum número/prova inventado"
execution_type: "sequential"
---

# Task: Execute Mission — Escrever a Sequência de Stories

## Objetivo

Executar o pipeline completo: coletar insumos → definir escopo (dia/semana) → propor categoria/distribuição → escrever → checar DoD → entregar.

## Pré-condições

- Persona Compradora, Promessa Transformadora e Processo Autoral do aluno, colados na conversa.

## Passos

### Step 1: Perguntar Escopo

"Quer Stories só de hoje, ou quer planejar a semana toda de uma vez?"

### Step 2A: Se For Hoje

1. Perguntar categoria (educar, vender, conectar, bastidor) ou tema específico
2. Perguntar quantos stories ele quer nessa sequência (sugerir 5-7 como padrão se ele não souber)
3. Ir pro Step 3

### Step 2B: Se For Semana

1. Perguntar quantos dias ele posta na semana
2. Perguntar quantas ofertas ativas ele tem agora
3. Consultar `data/stories-expert-aluno-kb.md` (seção 4) e propor distribuição de categorias respeitando a proporção (maioria comunidade/educação, venda como minoria, nunca 2 dias de venda seguidos)
4. Apresentar: "Proponho essa distribuição: {lista dia→categoria}. Faz sentido, ou ajusta?"
5. Aguardar aprovação antes de escrever qualquer sequência

### Step 3: Se Não Tiver Autoridade Tríplice

Perguntar o tom de voz desejado (ver KB, seção 5).

### Step 4: Escrever a(s) Sequência(s)

Pra cada sequência (1 se for dia único, N se for semana):

1. Definir 1 tema (nunca misturar temas na mesma sequência)
2. Consultar KB seção 3 — escolher os dispositivos adequados à categoria (sem nomear pro aluno)
3. Escrever cada story da sequência, numerado (Story 1, 2, 3...)
4. Se categoria for vender: story 1 com CTA, mínimo 5 stories com CTA na sequência inteira
5. Se precisar de história pessoal, número ou resultado: perguntar ao aluno, nunca inventar

### Step 5: Checar DoD

Percorrer o Definition of Done do agent.md antes de entregar.

### Step 6: Entregar

```
=== SEQUÊNCIA DE STORIES — {tema/dia} ===

Story 1: {texto}
Story 2: {texto}
...

{SE categoria vender} CTA presente nos stories {lista}.

Faz sentido, ou ajusta algo?
```

### Step 7: PDSA

1. **Plan:** que categoria/tema foi proposto?
2. **Do:** sequência entregue, quantos stories, quais dispositivos aplicados?
3. **Study:** aluno pediu ajuste grande ou aprovou de primeira?
4. **Act:** atualizar Playbook se um padrão se repetir.

## Error Handling

| Cenário | Ação |
|---------|------|
| Falta Persona, Promessa ou Processo Autoral | Não avança — pede pra completar o agente correspondente primeiro |
| Aluno não tem história pessoal pro tema | Sugere trocar de categoria ou ângulo sem história |
| Aluno pede pra vender toda semana | Sinaliza a regra da KB (seção 2) e sugere reduzir — mas se o aluno insistir depois de avisado, segue (não é boundary rígido, é recomendação) |
