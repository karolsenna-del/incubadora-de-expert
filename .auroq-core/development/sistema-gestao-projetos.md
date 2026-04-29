# Sistema de Gestao de Projetos — Auroq OS

> Como o expert opera seu negocio via projetos dentro do Auroq OS.
> Fundamentacao: 10 mestres (Allen/GTD, Sutherland/Scrum, Goldratt/TOC, Drucker, Ohno/TPS, Cohn, Appelo, Gawande, Cagan, Deming)

---

## Problema que Resolve

Expert operando com IA tem um problema novo: muitas possibilidades, muita velocidade, muita coisa rodando ao mesmo tempo. Sem sistema:
- Perde visao do todo (o que ta rodando?)
- Agentes trabalham sem saber o que outros fizeram
- Projetos ficam pendurados sem conclusao
- Ideias se misturam com compromissos
- Nao tem historico de decisoes

---

## 10 Principios

| # | Principio | Mestre | No Auroq OS |
|---|-----------|--------|-------------|
| 1 | **Capturar tudo, processar depois** | Allen (GTD) | Inbox → Companion classifica |
| 2 | **Limitar trabalho em progresso** | Goldratt (TOC) | Max 3 projetos ativos. Sem excecao |
| 3 | **Puxar, nao empurrar** | Ohno (TPS) | Agentes leem tracker e puxam trabalho |
| 4 | **Processo sem dono esta morto** | Drucker | Toda tarefa tem dono (agente ou pessoa) |
| 5 | **Checklists em pontos criticos** | Gawande | Weekly review = 6-item DO-CONFIRM |
| 6 | **Melhoria continua** | Deming (PDSA) | Todo projeto termina com retro (3 perguntas) |
| 7 | **Medir resultados, nao outputs** | Cagan | Metricas = outcomes, nao task count |
| 8 | **Transparencia e ritmo** | Sutherland | Tracker visivel, weekly review e o ritmo |
| 9 | **Estimar com honestidade** | Cohn | Deadlines reais, next action explicita |
| 10 | **Sistema remove atrito** | Appelo | Agentes auto-orientam, expert valida |

---

## Arquitetura de 4 Camadas

```
CAMADA 4 — INBOX
"O que eu pensei / preciso resolver?"
  ↓ Companion captura e classifica

CAMADA 3 — COCKPIT
"O que ta rodando na empresa?" (Fonte unica de verdade)
  ↓ cada projeto ativo usa

CAMADA 2 — PLAYBOOKS
"Como se faz isso?" (Receita reutilizavel)
  ↓ quando o processo roda de verdade

CAMADA 1 — TRACKERS
"Onde estamos AGORA nesse que ta rodando?"
```

### Camada 4: Inbox
- Ideias brutas capturadas pelo Companion
- Nao sao projetos — sao possibilidades
- Processadas no weekly review: sobe pra fila, congela, ou descarta
- Vive no cockpit, secao INBOX

### Camada 3: Cockpit (`business/cockpit.md`)
- Fonte UNICA de verdade sobre projetos
- 7 secoes: ATIVOS (max 3), FILA, INBOX, CONGELADOS, OPERACOES, ARQUIVO, REGRAS
- Mantido pelo Companion, validado pelo expert
- Todo agente consulta antes de trabalhar

### Camada 2: Playbooks (`business/processos/`)
- Receitas reutilizaveis (como fazer lancamento, como rodar campanha, etc.)
- Criados apos fazer pela primeira vez (pavimentar → documentar → reutilizar)
- Referenciados nos trackers

### Camada 1: Trackers (`business/campanhas/{projeto}/tracker.md`)
- Execucao ao vivo do projeto
- Fases, tarefas, dependencias, blockers, log, metricas, retro
- Todo agente le ANTES de trabalhar e atualiza DEPOIS
- Template padrao em `business/templates/tracker-template.md`

---

## Ciclo de Vida do Projeto

```
IDEIA (inbox) → FILA (priorizada) → ATIVO (max 3) → CONCLUIDO (arquivo)
                                        ↕
                                   CONGELADO (someday)
```

### Nasce
1. Ideia capturada no inbox (pelo expert ou Companion)
2. Weekly review processa: vira projeto na fila ou descarta
3. Quando vaga abre (ativo sai), primeiro da fila entra

### Vive
1. Tracker criado (do template)
2. Fases e tarefas definidas
3. Agentes puxam trabalho (pull, nao push)
4. Log atualizado a cada acao
5. Blockers registrados imediatamente

### Morre
1. Ultima tarefa da ultima fase concluida
2. Metricas preenchidas
3. Retro feita (3 perguntas)
4. Move pro ARQUIVO no cockpit
5. Vaga abre — proximo da fila entra

---

## Protocolo de Agentes

**Regra global** (`rules/project-tracker-protocol.md`):

### ANTES de trabalhar
1. Ler tracker → entender onde estamos
2. Verificar dependencias → nao comecar bloqueado
3. Identificar sua tarefa → saber exatamente o que fazer

### DURANTE
4. Focar no escopo → fazer o que o tracker define
5. Registrar blockers novos → imediatamente

### DEPOIS
6. Marcar tarefas Done + data
7. Adicionar log (data — @agente: o que fez)
8. Se desbloqueou outra tarefa → visivel automaticamente
9. Se completou ultima tarefa da fase → marcar fase Done

---

## Weekly Review (Companion conduz)

**Frequencia:** Semanal (7 dias). Force alert em 14 dias.
**Duracao:** 20 minutos max.

### 4 Passos:
1. **Briefing** — Companion apresenta estado de todos os projetos
2. **DO-CONFIRM checklist** (6 itens):
   - Todo ativo tem next action?
   - Algum ativo parado 5+ dias?
   - Algum blocker sem acao?
   - Fila ordenada corretamente?
   - Inbox processado?
   - Operacoes continuas saudaveis?
3. **Update** — Atualizar cockpit e trackers
4. **Close** — Resumo e proxima data de review

---

## Escalacao Automatica (Companion monitora)

| Condicao | Acao |
|----------|------|
| Blocker 3+ dias | Alertar expert |
| Projeto sem movimento 5+ dias | Perguntar: congelar? |
| Deadline em 7 dias | Marcar urgente |
| Weekly review atrasado 7+ dias | Pull automatico |
| Weekly review atrasado 14+ dias | Force alert |

---

## Anti-Padroes

| Anti-padrao | Por que e ruim |
|-------------|---------------|
| Mais de 3 ativos | Context switching mata throughput |
| Cockpit sem weekly review | Vira documento abandonado |
| Tracker sem donos | Ninguem se responsabiliza |
| 50+ tarefas por tracker | Ninguem le |
| Ignorar blockers | Perpetua impedimentos |
| Pular retro | Repete mesmos erros |
| Tracker sem cockpit | Fragmenta de volta |
| Criar tracker sem projeto no cockpit | Projeto fantasma |

---

## Mapa de Arquivos

```
business/
├── cockpit.md                          ← Fonte unica de verdade
├── templates/
│   └── tracker-template.md             ← Molde de tracker
├── processos/
│   └── {playbooks documentados}/       ← Receitas reutilizaveis
└── campanhas/
    ├── _template/                      ← Template de campanha
    └── {projeto-ativo}/
        └── tracker.md                  ← Execucao ao vivo
```

---

*Sistema desenhado com fundamentacao nos 10 mestres. Adaptado para expert operando com SO de IA.*
