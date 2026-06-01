---
task: "Revisar Plano (Documento Mestre Vivo)"
responsavel: "@estrategista-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "documento-mestre.md existente + trigger de revisao (feedback do Analista, mudanca de contexto, percepcao do usuario)"
Saida: "documento-mestre.md atualizado (versionado v1 -> v2) + lista explicita de propagacoes necessarias pros outros agentes"
Checklist:
  - "Identificar o que motivou a revisao (CPA fora do plano / publico errado / proposta fraca / etc.)"
  - "Localizar secao(oes) afetada(s) do documento mestre"
  - "Propor ajuste e validar com usuario"
  - "Reaplicar Calculadora Arcane se ajuste afeta orcamento/metas"
  - "Re-validar contra Regras Cardinais aplicaveis"
  - "Listar EXPLICITAMENTE o que precisa propagar pros outros agentes (Copy/Pagina, Anuncios, Copywriter de Mensagens)"
  - "Versionar documento mestre (v1 -> v2 com data + motivo)"
  - "Aprovacao explicita do usuario na nova versao"
execution_type: "interactive"
---

# Task: Revisar Plano

## Executive Summary

Documento mestre e VIVO (PU-LP-017). Durante o lancamento, usuario PODE/FREQUENTEMENTE volta pra revisar publico, proposta, orcamento, cronograma, metas. Esta task captura essa revisao formal — nao e refazer do zero, e ajustar bloco(s) afetado(s) e propagar pros outros agentes.

## Pipeline

```
Trigger de revisao
   |
   v
[Identificar motivo]
   |
   +-- Feedback do Analista (CPA alto, conv pagina baixa, comparecimento)
   +-- Mudanca de contexto (concorrente lancou, evento externo)
   +-- Percepcao do usuario (recorte largo demais, meta irreal)
   |
   v
[Localizar secao(oes) afetada(s)]
   |
   v
[Propor ajuste e validar com usuario]
   |
   v
[Reaplicar Calculadora se afeta orcamento/metas]
   |
   v
[Re-validar RCs]
   |
   v
[Listar propagacoes pros outros agentes]
   |
   v
[Versionar v1 -> v2]
   |
   v
[Aprovacao explicita]
```

## Steps

### Step 1: Identificar Motivo da Revisao

Capturar:
- **Quem trouxe:** usuario espontaneo / feedback do Analista / mudanca externa
- **O que motivou:** dado especifico (ex: "CPA R$80, plano era R$40") ou percepcao ("acho que apertei pouco o publico")
- **Urgencia:** revisao critica (lancamento ja rodando) ou refinamento (entre ciclos)

### Step 2: Localizar Secoes Afetadas

Mapeamento tipico:

| Motivo | Bloco do doc mestre afetado |
|--------|------------------------------|
| CPA muito acima do plano | Bloco 2 (publico — pode estar largo) + Bloco 3 (orcamento — Calculadora desatualizada) |
| Conversao pagina baixa | Bloco 1 (proposta — pode nao estar tangivel) + Bloco 2 (publico — ruminacoes podem nao estar reais) |
| Comparecimento baixo | Bloco 5 (cronograma de disparos — antecipacao pode estar fraca) |
| Meta irreal | Bloco 6 (metas) + Bloco 3 (orcamento) |
| Concorrente lancou | Bloco 1 (proposta — peca que faltava pode precisar ajuste) |

### Step 3: Propor Ajuste e Validar

Estrutura:

```
=== REVISAO DO PLANO ===

MOTIVO: [resumo do que motivou]

SECOES AFETADAS:
- {Bloco X}: {explicacao do gap}
- {Bloco Y}: {se aplicavel}

PROPOSTA DE AJUSTE:

Para {Bloco X}:
  [valor atual] -> [valor proposto]
  Justificativa: [referencia da KB]

Para {Bloco Y}:
  [...]

CONSEQUENCIA:
- Outros blocos afetados: [list]
- Orcamento/Calculadora precisa rerodar? Sim/Nao
- RCs afetadas: [list]

Voce concorda com o ajuste? Quer testar primeiro ou ja aplicamos?
```

### Step 4: Reaplicar Calculadora Arcane (se aplicavel)

Se ajuste afeta:
- Publico (Bloco 2)
- Ticket
- CPA esperado
- Meta

Roda novamente:

```
Esse ajuste muda parametros do orcamento. Roda a Calculadora
Arcane com os novos numeros. Plataforma Arcane > Ferramentas >
Calculadora de Lancamento Pago. Cola o resultado novo aqui.
```

### Step 5: Re-validar RCs

Especialmente:
- RC-001 (fundamentos)
- RC-002 (produto, nao aula)
- RC-003 (peca que faltava)
- RC-015 (ingresso = Preco da Escala — faixa R$27-R$67, sweet spot R$38-R$57, default R$38, ajustar via teste 48-72h; fora da faixa exige justificativa de nicho)

Se ajuste viola RC, confronta com usuario antes de aceitar.

### Step 6: Listar Propagacoes (CRITICO)

Apos ajuste validado, lista EXPLICITAMENTE o que precisa propagar:

```
=== PROPAGACOES NECESSARIAS ===

Esse ajuste afeta os outputs de outros agentes. Pra documentar:

PARA copy-pagina:
- [ ] Headline da pagina precisa atualizar pq mudamos {X}
- [ ] Secao Identificacao: ruminacoes ainda batem? Validar
- [ ] Sub-headline pode precisar ajuste
- TASK: invocar copy-pagina pra refinamento

PARA anuncios:
- [ ] Promessa do anuncio principal precisa atualizar (RC-006)
- [ ] Nova peca de Mecanismo Tangivel pq mecanismo refinou
- TASK: invocar anuncios pra refinamento + nova peca

PARA copywriter-mensagens:
- [ ] Mensagem #2 do grupo precisa ajuste pq promessa mudou
- [ ] Email de boas-vindas pode precisar update (workshop_nome ou variavel)
- TASK: invocar copywriter-mensagens pra ajuste pontual

OBSERVACAO: nao precisa fazer tudo agora. Lista de propagacoes
fica como TODO ate voce sequenciar com cada agente.
```

### Step 7: Versionar Documento

```
=== VERSAO ATUALIZADA ===

documento-mestre.md
- Versao anterior: v1 (data: 2026-05-08)
- Versao atual: v2 (data: 2026-05-15)
- Motivo: [resumo de uma frase]
- Blocos alterados: [list]
- Aprovado por: usuario
- Status: ATIVO

Versao v1 mantida em historico (header marca como obsoleta).
```

### Step 8: Aprovacao Explicita

```
Documento mestre v2 fechado.

Voce APROVA essa nova versao? Aprovacao explicita significa: voce
leu, entende, concorda, e VAI executar conforme — incluindo as
propagacoes listadas.

(SIM / NAO + ajuste especifico)
```

## Veto Conditions

- Revisao sem motivo claro / dado especifico → recusa, exige clareza
- Ajuste que viola RC sem justificativa → recusa
- Aprovacao implicita ("acho que ta bom") → exige SIM/NAO explicito
- Ajuste que afeta orcamento sem rerodar Calculadora → recusa
- Lista de propagacoes vazia (mudou plano mas "nao afeta nada") → confronta, pq mudanca no plano SEMPRE propaga

## Output Esperado

- `documento-mestre.md` versionado (v1 -> v2 com motivo + data)
- Lista explicita de propagacoes pros outros agentes
- Aprovacao registrada

## Regras

- Versiona SEMPRE (nao sobrescreve v1)
- Lista propagacoes EXPLICITAS por agente
- Reaplicar Calculadora se afeta orcamento
- Cita fonte da KB pra justificar ajuste
- Nao revisa "preventivamente" — precisa de motivo concreto
- Postura didatica: explica por que o ajuste e necessario
