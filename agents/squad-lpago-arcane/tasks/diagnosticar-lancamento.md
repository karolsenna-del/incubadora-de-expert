---
task: "Diagnosticar Lancamento"
responsavel: "@analista-dados"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Indicadores reais coletados do usuario (CPA, CTR, Hook Rate, conversao pagina, conversao checkout, ROAS, Connect Rate quando aplicavel) + documento-mestre.md (plano original) + (opcional) diagnostico anterior"
Saida: "diagnostico-{data}.md em 4 secoes (snapshot + semaforo + narrativo + acao priorizada 1-3)"
Checklist:
  - "Modo de invocacao identificado: proativo / reativo / agendado"
  - "Indicadores coletados: CPA real, CTR, Hook Rate, conversao pagina, conversao checkout, ROAS, Connect Rate (quando aplicavel)"
  - "Cruzamento com plano original (documento mestre) feito"
  - "Cruzamento com benchmarks da KB feito"
  - "SECAO 1 — Snapshot tabela: indicador | valor atual | esperado plano | benchmark KB | status semaforico"
  - "SECAO 2 — Status geral (verde/amarelo/vermelho) com justificativa de uma frase"
  - "SECAO 3 — Diagnostico narrativo: leitura cruzada, contexto do plano, hipoteses, gargalo identificado"
  - "SECAO 4 — Acao prioritaria ranqueada 1-3 (acao + responsavel + prazo + impacto esperado)"
  - "Comparacao com periodo anterior INCLUIDA se houver dado"
  - "Feedback loop indicado se aplicavel"
  - "Validacao implicita contra RC-007 (CPA e rei), RC-008 (retencao), RC-009 (nao mexe no que funciona), RC-010 (mais mexe menos otimiza), RC-011 (mata no ninho)"
execution_type: "semantic"
---

# Task: Diagnosticar Lancamento

## Executive Summary

Pipeline de diagnostico aplicado em 3 modos (proativo / reativo / agendado). Output em 4 secoes (PU-LP-011): snapshot tabela + semaforo geral + narrativo + acao priorizada 1-3.

## Pipeline

```
Indicadores reais + Doc mestre
   |
   v
[Identificar modo] -> proativo / reativo / agendado
   |
   v
[Coletar indicadores]
   |
   v
[Cruzar com plano + benchmarks]
   |
   v
[Aplicar arvore de diagnostico]
   |
   v
[Output em 4 secoes]
   |
   +-- 1. Snapshot
   +-- 2. Semaforo
   +-- 3. Narrativo
   +-- 4. Acao priorizada
   |
   v
[Identificar feedback loop]
   |
   v
[Aprovacao explicita do plano de acao]
```

## Steps

### Step 1: Identificar Modo

**Proativo (24-72h apos campanha lancada):**
Entra em cena sem ser chamado. Faz primeiro diagnostico baseline.

**Reativo (usuario reporta problema):**
Trigger: "CPA ta alto", "nao ta vendendo", "Hook Rate baixo", "comparecimento baixo".

**Agendado (checkpoints definidos no plano):**
- Dia 3 (primeiros sinais)
- Dia 7 (meio do funil)
- Vespera evento (preview comparecimento)
- Pos-evento (retrospectiva — vai pra task `retrospectiva-pos-evento`)

### Step 2: Pre-Condicao

CRITICO: doc mestre precisa ser acessivel. Sem plano pra cruzar, dado e numero solto.

```
Antes de eu diagnosticar, preciso do doc mestre.

Voce tem o doc mestre acessivel? Cola aqui ou me diz:
- CPA esperado: R$ X
- Conversao pagina esperada: Y%
- Meta ingressos: Z
- Meta produto principal: W
- Periodo de campanha: T-X dias
```

### Step 3: Coletar Indicadores

Indicadores minimos:

```
Pra diagnosticar, me passa:

OBRIGATORIOS:
- CPA atual: R$ ___
- Spend total ate agora: R$ ___
- Vendas ingresso: ___ (numero)
- Conversao pagina: ___% (visitantes / compradores)

ALTAMENTE RECOMENDADOS:
- CTR medio: ___%
- Hook Rate medio (ou por criativo): ___%
- ROAS atual: ___x
- Conversao checkout: ___% (quem chegou / quem finalizou)

QUANDO APLICAVEL:
- Connect Rate (% que entrou no grupo apos compra): ___%
- Comparecimento (se ja teve evento): ___%

Se voce nao tem algum, fala. Eu trabalho com o que voce tiver
mas marco lacuna no diagnostico.
```

### Step 4: Cruzar com Plano + Benchmarks

Para cada indicador:
- Valor atual vs esperado no plano
- Valor atual vs benchmark KB (`data/playbooks/benchmarks-por-nicho.md`)
- Calcular variacao (%)

### Step 5: Aplicar Arvore de Diagnostico

Referencia: `data/playbooks/arvore-diagnostico.md`.

Logica simplificada:

```
SE CPA fora E conversao pagina fora:
  -> gargalo provavel: PAGINA (refinamento copy/UX)
SE CPA fora E conversao pagina OK:
  -> gargalo provavel: PUBLICO (revisar plano)
SE Hook Rate < 30% em pecas especificas:
  -> RC-011: mata no ninho, cria novo
SE comparecimento baixo:
  -> sequencia antecipacao OU recovery api
SE checkout drop alto:
  -> infraestrutura (forma pagamento, friccao tecnica)
```

### Step 6: Output em 4 Secoes (PU-LP-011)

#### Secao 1 — Snapshot Tabela

```
| Indicador     | Valor Atual | Esperado Plano | Benchmark KB | Status   |
|---------------|-------------|----------------|--------------|----------|
| CPA           | R$ X        | R$ Y           | R$ Y-Z       | [color]  |
| CTR           | X%          | Y%             | Y-Z%         | [color]  |
| Hook Rate     | X%          | >30%           | >30%         | [color]  |
| Conv pagina   | X%          | Y%             | 8-15%        | [color]  |
| Conv checkout | X%          | Y%             | 60-80%       | [color]  |
| ROAS front    | X           | Y              | 1.5-3x       | [color]  |
```

Status:
- VERDE: dentro do plano OU dentro do benchmark
- AMARELO: 1-15% acima do piso aceitavel
- VERMELHO: > 15% acima do piso ou abaixo do benchmark minimo

#### Secao 2 — Semaforo Geral

VERDE / AMARELO / VERMELHO + justificativa de UMA frase.

#### Secao 3 — Diagnostico Narrativo

3-5 paragrafos curtos:
- Leitura cruzada (qual indicador puxou o resto)
- Contexto do plano (estavamos esperando isso?)
- Hipoteses (o que pode ter causado)
- Gargalo identificado (o que precisa mexer primeiro)
- Comparacao com periodo anterior (se houver dado)

#### Secao 4 — Acao Priorizada 1-3

```
ACAO 1 (CRITICA):
- O que: [acao especifica]
- Quem: [agente responsavel ou usuario]
- Prazo: [hoje / 24h / 72h]
- Impacto esperado: [qual indicador vai mover, quanto]
- Feedback loop: [agente que recebe handoff]

ACAO 2 (ALTA):
- ...

ACAO 3 (MEDIA, opcional):
- ...
```

NUNCA mais que 3 (RC-010).

### Step 7: Identificar Feedback Loop

Por gargalo identificado:
- Plano (publico/proposta/meta) → `estrategista-chief` (task `revisar-plano`)
- Pagina (copy/UX) → `copy-pagina` (refinamento)
- Anuncios (Hook Rate / CTR) → `anuncios` (novos roteiros, RC-011)
- Comunicacao (comparecimento / engajamento grupo / recovery api) → `copywriter-mensagens` (mensagem pontual ou ajuste)

### Step 8: Aprovacao Explicita do Plano de Acao

```
Diagnostico fechado.

Plano de acao priorizada:
1. {Acao 1} -> {agente}
2. {Acao 2} -> {agente}
3. {Acao 3} -> {agente} (opcional)

Voce APROVA esse plano de acao?

Se SIM: faco handoffs pros agentes responsaveis na ordem
indicada.

Se NAO: me diz o que mudar.

(SIM / NAO + ajuste)
```

## Veto Conditions

- Doc mestre inacessivel → recusa
- Diagnostico durante o PLANO (antes de anuncios rodarem) → recusa, devolve pro Estrategista (PU-LP-012)
- Indicadores incompletos (faltam 2+ obrigatorios) → coleta antes de prosseguir
- Acao priorizada generica → refaz
- Mais que 3 acoes → reduz (RC-010)
- Diagnostico sem secao 4 (acao) → recusa, diagnostico bom prescreve
- Recomendar reanimar peca com Hook Rate < 30% → recusa (RC-011)

## Output Esperado

Arquivo `diagnostico-{YYYY-MM-DD}.md` com:
- Header (data, modo de invocacao, periodo analisado)
- 4 secoes
- Comparacao com periodo anterior (se houver)
- Feedback loop indicado
- Linha de aprovacao do plano de acao

## Regras

- Estrutura em 4 secoes SEMPRE (PU-LP-011)
- Maximo 3 acoes priorizadas (RC-010)
- Cruzamento com plano + benchmarks SEMPRE
- Feedback loop apropriado por gargalo
- NAO reescreve copy / roteiro / mensagem
- Cita RC aplicada
- Termina com proximo passo concreto
