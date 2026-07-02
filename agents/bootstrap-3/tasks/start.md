---
task: "Start — Bootstrap 3 (Configuracoes Avancadas)"
responsavel: "@b3-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativacao do squad via /bootstrap3"
Saida: "Tracker lido/criado, pre-requisitos confirmados (QG-B3-000), aluno na fase certa (nova ou retomada)"
Checklist:
  - "Persona do b3-chief carregada"
  - "Tracker lido (business/infra/bootstrap3-tracker.md) — ou criado do template se primeira vez"
  - "Pre-requisitos verificados (bootstrap 1 concluido; dominio recomendado)"
  - "Custos informados (Hetzner ~€6,49/mes — checar valor vigente, Z-API ~R$100/mes na Fase 2)"
  - "Jornada aberta na fase correta"
execution_type: "interactive"
---

# Task: Start — Entry Point do Bootstrap 3

## Objetivo

Ativar o `b3-chief`, **ler o tracker** (protocolo tracker-first), verificar pre-requisitos (QG-B3-000) e abrir a jornada — nova ou retomada do ponto exato onde parou.

## Passos

### Step 1: Carregar persona
Ler e adotar `agents/b3-chief.md`.

### Step 2: TRACKER FIRST (antes de qualquer saudacao longa)

Procurar `business/infra/bootstrap3-tracker.md` no repo do aluno:

| Resultado | Acao |
|-----------|------|
| **Existe** | Ler. Identificar fase + ultimo passo concluido. Saudar JA situando: "Voce parou em {fase}, {passo}. Retomamos dai?" → pular pro Step 5 (retomada) |
| **Nao existe** | Primeira vez → seguir Step 3 (jornada nova) |
| Nao existe MAS o aluno diz que ja comecou | Nao confiar em memoria de conversa: verificar o estado REAL (n8n responde? tabelas existem?) e reconstruir o tracker com o que validar |

### Step 3: Greeting (primeira vez)

```
=== BOOTSTRAP 3 — CONFIGURACOES AVANCADAS · v1.2.0 ===
Squad Auroq | Mentoria Arcane | Fase Turbinando

PRA QUE ESTE SQUAD SERVE: montar a infra avancada do teu negocio —
a mesma arquitetura que roda a operacao do Euriler, na TUA conta,
no TEU servidor, com os TEUS dados.

QUANDO A GENTE FECHAR O PROCESSO, voce vai ter uma maquina de
operacao 24/7 funcionando sozinha:

  → Compra aprovada (mesmo as 3h da manha) entra no teu banco e o
    cliente recebe boas-vindas no WhatsApp — sem voce existir
  → Disparos programados saem na hora certa, pra grupos e individual,
    com cadencia segura e registro de tudo
  → Quem quase comprou e desistiu recebe resgate automatico — e para
    de receber NA HORA que compra
  → E o terreno fica pronto pra Bia (tua atendente IA, proximo passo
    da jornada) — ela vai morar nesse servidor

O CAMINHO, em 3 fases:

  FASE 0  Servidor proprio (tua maquina 24/7 — Hetzner + n8n)
  FASE 1  Banco de dados unificado (a memoria central do negocio)
  FASE 2  Automacoes essenciais (compras, disparos e recovery)

~4-7h no total, FEITO PRA FAZER EM PARTES: cada fase fecha sozinha,
teu progresso fica salvo num tracker, e voce volta quando quiser.
Cada fase tem um PORTAO DE QUALIDADE OBRIGATORIO: eu so te deixo
avancar quando a anterior fecha de verdade — testada e com tudo
em maos (testado, nao "parece que foi").

Dois custos novos, pra voce saber JA: servidor ~€6,49/mes (~R$38) —
valor atual do plano equivalente, confirmado ao provisionar — e,
la na Fase 2, o Z-API ~R$100/mes. Explico cada um na hora certa.

Antes de comecar, uma confirmacao rapida.
```

### Step 4: Verificar pre-requisitos (QG-B3-000)

Confirmar:
1. **Bootstrap 1 concluido?** (Claude Code + Auroq rodando, GitHub conectado, Supabase conectado, cofre criado — o "Nave Embarcada" do Ops)
2. **Dominio proprio?** (RECOMENDADO — a Fase 0 precisa pro SSL. Se nao tem: da pra comprar na hora, ~R$50/ano, o operador-infra guia)

| Resultado | Acao |
|-----------|------|
| Bootstrap 1 OK | QG-B3-000 ✅ — criar o tracker do template (`data/tracker-template.md`) em `business/infra/bootstrap3-tracker.md` e seguir pro Step 5 |
| Bootstrap 1 incompleto | **BLOQUEAR.** Apontar o caminho: `npx auroq-os` → agente Ops → bootstrap. Sem o nucleo, nada aqui se apoia. Nao improvisar |
| Sem dominio | Nao bloqueia o inicio, mas avisar que a Fase 0 vai precisar (compra guiada no momento certo) |

### Step 5: Abrir a jornada

Mostrar o mapa e acionar a fase correta:

```
O caminho:

  FASE 0  (@operador-infra)      → servidor Hetzner via API + n8n em https     [~40min]
  FASE 1  (@operador-banco)      → 3 tabelas core + logica centralizada       [~45min]
  FASE 2  (@operador-automacoes) → Z-API + compras + disparos + recovery      [~2-4h]

Voce fala sempre comigo; eu chamo o operador de cada fase.
Teu progresso fica salvo — pode parar no fim de qualquer bloco.

Bora? Te passo agora pro operador do servidor (Fase 0).
```

- Jornada nova → **handoff explicito:** anunciar a passagem ("te passo pro operador do servidor") e acionar `fase-0-infra` (@operador-infra)
- Retomada → acionar a task da fase registrada no tracker, no passo onde parou (handoff pro operador daquela fase)

## Roteamento das fases

| Fase | Task | Agente | Gate |
|------|------|--------|------|
| FASE 0 — Servidor | `fase-0-infra.md` | @operador-infra | QG-B3-001 |
| FASE 1 — Banco unificado | `fase-1-banco.md` | @operador-banco | QG-B3-002 |
| FASE 2 — Automacoes | `fase-2-automacoes.md` | @operador-automacoes | QG-B3-003 |

Apos cada gate validado, o controle volta ao Chief, que atualiza o tracker e libera a proxima fase.

## Error Handling

| Cenario | Acao |
|---------|------|
| Bootstrap 1 ausente/incompleto | Bloquear QG-B3-000, apontar `npx auroq-os` → Ops |
| Aluno quer pular fase | Recusar — gate anterior e obrigatorio (dependencia real, nao burocracia) |
| Aluno trava no meio | Coletar sintoma, identificar fase/passo pelo tracker, reacionar o operador certo |
| Duvida conceitual (banco, servidor, jornada) | Modo consultoria — `knowledge/banco-unificado-logica.md` |
| Aluno pergunta da Bia | Esclarecer ordem: Bia e o squad seguinte (`/instalacaoBia`) e reusa este servidor |
