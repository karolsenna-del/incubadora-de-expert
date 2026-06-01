---
task: "Construir Documento Mestre"
responsavel: "@estrategista-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Perfil + nicho + maturidade identificados na task start"
Saida: "documento-mestre.md aprovado pelo usuario (Bloco 1 Tese e Proposta + Bloco 2 Publico + Bloco 3 Orcamento via Calculadora + Bloco 4 Cronograma Operacional + Bloco 5 Cronograma de Disparos + Bloco 6 Metas + Bloco 7 Validacao RCs)"
Checklist:
  - "Bloco 1 — Tese e Proposta definida usando 5 passos do VOL-02 (publico, conhecimento, problema, solucao, peca que faltava)"
  - "Bloco 1 — Recorte especifico em 3 dimensoes (conteudo + publico + dor)"
  - "Bloco 1 — Validacao contra RC-002 (produto, nao aula) e RC-003 (peca que faltava com NOME)"
  - "Bloco 2 — Publico-alvo + fatia detalhada (DOR, DESEJO, MEDO, RUMINACOES)"
  - "Bloco 3 — Direcionamento explicito pra Calculadora Arcane apos Bloco 1 e 2 fechados"
  - "Bloco 3 — Resultado da Calculadora integrado de volta no documento"
  - "Bloco 4 — Cronograma operacional (data evento + data inicio vendas + deadlines de entrega)"
  - "Bloco 5 — Cronograma de disparos de comunicacao (intencao + canal + timing por disparo, sem copies)"
  - "Bloco 6 — Metas projetadas (ingressos + produto principal + exposicao caixa + ROAS)"
  - "Bloco 7 — Validacao contra RC-001 (80% fundamentos), RC-015 (ingresso = Preco da Escala: faixa R$27-R$67, default R$38, ajustar via teste; fora da faixa exige justificativa de nicho), RC-018 (formato 2 dias preferivel)"
  - "Postura didatica ativa em todo o pipeline (PU-LP-014)"
  - "Documento aprovado EXPLICITAMENTE pelo usuario antes de avancar pro Quality Gate QG-LP-01"
execution_type: "interactive"
---

# Task: Construir Documento Mestre

## Executive Summary

Pipeline guiado de 7 blocos pra construir o ARTEFATO ANCORA do lancamento. Sem documento mestre aprovado, todo o resto do squad trava. RC-001: 80% do resultado vem desses fundamentos.

## Pipeline

```
Bloco 1: Tese e Proposta (5 passos do VOL-02)
   |
   v
Bloco 2: Publico + Fatia (DOR, DESEJO, MEDO, RUMINACOES)
   |
   v
Bloco 3: Calculadora Arcane (handoff externo + paste do resultado)
   |
   v
Bloco 4: Cronograma Operacional (datas + deadlines)
   |
   v
Bloco 5: Cronograma de Disparos (intencao + canal + timing — SEM copies)
   |
   v
Bloco 6: Metas Projetadas (ingressos + produto + exposicao + ROAS)
   |
   v
Bloco 7: Validacao RCs aplicaveis
   |
   v
Aprovacao explicita do usuario --> QG-LP-01 -> Fase 2 destrava
```

## Steps

### Step 1: Bloco 1 — Tese e Proposta

Conduzir os 5 passos do VOL-02:

**Passo 1 — Publico (recorte em 3 dimensoes):**
- 1a. Conteudo (tema especifico)
- 1b. Publico (recorte dentro do nicho)
- 1c. Dor (UMA dor, na linguagem do publico, nao tecnica)

**Passo 2 — Conhecimento atual:**
- O que o publico ja sabe?
- Ja tentou o que?
- Posicionar como APROFUNDAMENTO ou REVELACAO?

**Passo 3 — Problema:**
- A DOR real, na palavra do publico

**Passo 4 — Solucao:**
- Qual mecanismo VOCE oferece?

**Passo 5 — Peca que Faltava (RC-003):**
- O que torna sua solucao DIFERENTE?
- Mecanismo precisa ter NOME proprio (nao "metodo", mas "Sistema X em 3 fases")

Validar:
- RC-002: produto, nao aula
- RC-003: peca que faltava com nome

### Step 2: Bloco 2 — Publico + Fatia

Para o publico definido no Passo 1, mapear 4 dimensoes:

- **DOR:** palavra que ELE usa (nao termo tecnico)
- **DESEJO:** o resultado tangivel
- **MEDO:** o que ele teme acontecer ou nao acontecer
- **RUMINACOES:** frases que ele repete pra si mesmo (literais — nao parafrase)

Sem ruminacoes reais, identificacao da pagina vira generica e nao engaja.

### Step 3: Bloco 3 — Calculadora Arcane

Apos Bloco 1 e 2 fechados, dispara handoff externo:

```
Bloco 1 e 2 fechados. Agora roda a Calculadora Arcane.

PASSO A PASSO:
1. Abre a plataforma Arcane (mentoria.arka.education)
2. Vai em FERRAMENTAS > Calculadora de Lancamento Pago
3. Preenche com os dados que ja temos: nicho, publico, ticket
   pretendido (RC-015 Preco da Escala — default R$38, faixa real R$27-R$67;
   R$97 raro; R$200-R$300 so nicho premium tipo medico)
4. Baixa o resultado (.md ou .pdf) OU copia o conteudo
5. Cola aqui no chat

Eu integro de volta no documento mestre.

Vai. Te espero.
```

Aguarda paste. Quando recebe:
- Extrai: budget total + projecao de ingressos + ticket sugerido + CPA maximo + meta produto principal
- Confronta com benchmarks da KB se algo destoar
- Integra no documento

Referencia: `data/playbooks/instrucoes-calculadora-arcane.md`

### Step 4: Bloco 4 — Cronograma Operacional

Define:
- Data do evento
- Data de inicio de vendas (T-7d a T-21d dependendo de maturidade da audiencia)
- Deadlines de entrega:
  - Pagina pronta (T-X dias)
  - Anuncios prontos (T-X dias)
  - Templates Meta API aprovados (T-7d minimo — RC-aprendizado: aprovacao Meta pode levar 24-48h)
  - Sequencias agendadas no dispatcher

### Step 5: Bloco 5 — Cronograma de Disparos de Comunicacao

ESTRUTURA: tabela com #, quando (timing relativo), canal, tipo, intencao.

NAO escreve copies. Apenas estrutura + intencao. Output vira input pro `copywriter-mensagens` quando construir antecipacao + mensagens evento.

Exemplo:

```
| # | Quando  | Canal       | Tipo                  | Intencao                          |
|---|---------|-------------|-----------------------|-----------------------------------|
| 1 | T-7d    | Grupo WA    | Boas-vindas + mecanismo | Acolher + apresentar SHE         |
| 2 | T-7d    | Email       | Boas-vindas pos-compra | Confirmar compra + grupo         |
| 3 | T-3d    | Grupo WA    | Lembrete + dor        | Identificacao + curiosidade       |
| 4 | T-1d    | API individ | Lembrete pessoal      | Toque humano pre-evento           |
| 5 | T-1d    | Grupo WA    | Vespera               | Aquecimento + check-in            |
| 6 | T-1h    | API individ | Link antecipado       | Link do Meet pessoal              |
| 7 | T0      | Grupo WA    | Start ao vivo         | Gatilho COMECOU                   |
| 8 | T+15min | API individ | Recovery cade voce    | Presenca individual               |
...
```

Volume tipico: 25-35 disparos pra ciclo completo (pre-evento + evento 2 dias + pos-evento).

Referencia: `data/exemplos/cronograma-disparos-ndf.md` mostra estrutura real do Workshop NDF.

### Step 6: Bloco 6 — Metas Projetadas

- **Ingressos vendidos:** numero + receita
- **Produto principal:** numero de vendas + receita
- **Order bumps:** estimativa
- **Downsell Meteorico:** estimativa
- **Exposicao de caixa:** caixa que precisa ter pra rodar antes de receber (CRITICO — primeiro lancamento subdimensiona isso e quebra)
- **ROAS objetivo:** front (so ingressos) + total (com produto principal)

Cruzar com benchmarks da KB: `data/playbooks/benchmarks-por-nicho.md`.

### Step 7: Bloco 7 — Validacao RCs

Checklist final antes de aprovar:
- [ ] RC-001: 80% fundamentos OK?
- [ ] RC-002: produto, nao aula
- [ ] RC-003: peca que faltava com nome proprio
- [ ] RC-015: ingresso = Preco da Escala (faixa R$27-R$67 sweet spot R$38-R$57, default R$38 com plano de teste 48-72h; preco fora da faixa exige justificativa de nicho premium)
- [ ] RC-018: formato 2 dias preferivel (excecao precisa justificativa)

Outras RCs sao validadas em outras tasks (RC-005 na pagina, RC-008 nos anuncios, etc.).

### Step 8: Aprovacao Explicita

```
Documento mestre fechado. Bloco a bloco:

1. Tese e Proposta: [resumo]
2. Publico + Fatia: [resumo]
3. Orcamento (Calculadora): [resumo]
4. Cronograma Operacional: [resumo]
5. Cronograma de Disparos: [tabela]
6. Metas Projetadas: [resumo]
7. Validacao RCs: [checklist verde]

Tudo isso vai virar input pros outros 4 agentes do squad.

Voce APROVA esse documento mestre como esta? Aprovacao explicita
significa: voce leu, entende, concorda, e VAI executar conforme.

(SIM / NAO + ajuste especifico)
```

## Veto Conditions

- Bloco 1 com publico generico ("mulheres", "empreendedores") → recusa, exige aperto
- Bloco 1 sem mecanismo nomeado → recusa
- Bloco 3 sem rodar Calculadora → recusa
- Bloco 5 com copies redigidas (deve ser SO intencao) → corrige escopo
- Bloco 7 com RC violada sem justificativa → recusa
- Aprovacao implicita ("acho que ta bom") → exige SIM/NAO explicito

## Output Esperado

Arquivo `documento-mestre.md` (formato em `data/templates/documento-mestre.md`) com:
- Header (data, versao v1, perfil, nicho, maturidade)
- 7 blocos preenchidos
- Checklist RCs validado
- Linha de aprovacao com data + assinatura simbolica do usuario

Estado salvo em sessao. Handoff pro `copy-pagina` (Bloco 1+2) e pro `copywriter-mensagens` (Bloco 5) destravado parcialmente assim que docs aprovados.

QG-LP-01 PASS.

## Regras

- Postura didatica em CADA bloco (PU-LP-014) — explica o porque
- Cita fonte da KB quando explica conceito (VOL-02, RC-XXX, REPERTORIO)
- NAO permite avancar bloco sem completar o anterior
- NAO consulta Analista de Dados durante esse pipeline (PU-LP-012)
- Versionamento: documento e v1 por default — se for revisao, usa task `revisar-plano`
