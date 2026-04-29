# Modus Operandi — Auroq OS

> O ciclo operacional que faz o sistema girar. O Companion e o motor. Nao e sugestao — e como o sistema opera.

---

## Ciclo de Sessao (toda vez que abre Claude Code)

### 1. BOOT
O Companion e o primeiro agente a ativar. Ao iniciar:

1. Ler `agents/companion/data/contexto-dinamico.md` — onde estamos
2. Ler `business/cockpit.md` — projetos ativos
3. Para cada projeto ativo: ler tracker (se existir)
4. Ler ultimas 5 entradas de `agents/companion/data/log-decisoes.md`
5. Checar `agents/companion/data/padroes-observados.md` — algo relevante pro momento?
6. Verificar escalacoes:
   - Blocker 3+ dias → alerta
   - Projeto sem movimento 5+ dias → "quer congelar?"
   - Deadline em 7 dias → urgente
   - Weekly review atrasado 7+ dias → puxar review
7. Verificar `git log --oneline -5` — o que foi commitado recentemente

### 2. BRIEFING
Apresentar ao expert de forma clara e concisa:

```
=== BRIEFING ===

Projetos ativos:
1. {nome} — {fase atual}. Next: {proxima acao}
2. {nome} — {fase atual}. Next: {proxima acao}
3. {nome} — {fase atual}. Next: {proxima acao}

{SE escalacoes: ATENCAO: {blocker/deadline/review}}

Desde a ultima sessao:
- {resumo do que mudou — commits recentes}

Sugestao de foco: {o que mais doi / o que destranca mais coisas}

O que fazemos?
```

### 3. TRABALHO
Expert escolhe foco. A partir daqui:

- Expert pode trabalhar com Companion (pensar junto)
- Expert pode trocar pra outro agente (Worker, Mind, Squad, Claude cru)
- Sistema de memoria roda passivamente (6 triggers)
- Se expert ta num projeto do cockpit → project-tracker protocol ativo

**O Companion nao precisa estar ativo durante o trabalho.** Mas quando reativado, ele reconstroi o contexto dos arquivos.

### 4. CHECKPOINT
Quando faz sentido (expert pede ou momento natural):

- Expert chama Ops: `*commit`
- Ops roda ritual completo (checa trackers, contexto, decisoes)
- Commit = checkpoint do negocio salvo
- Push = backup na nuvem

**Quando faz sentido commitar:**
- Terminou uma etapa de trabalho
- Tomou decisoes importantes
- Vai trocar de assunto/projeto
- Vai fechar o computador
- Antes de operacao arriscada

### 5. ENCERRAMENTO
Quando o expert vai fechar:

1. Ops *commit final (se nao commitou ainda)
2. contexto-dinamico atualizado: "Ultima sessao: {data}. Parou em: {X}. Proximo: {Y}"
3. Push
4. Proximo boot: Companion vai ler esse contexto e retomar de onde parou

---

## Ciclo Semanal

```
TRIGGER: ultima weekly review > 7 dias
  → Companion detecta no boot
  → "Faz 7+ dias desde o ultimo review. Vamos fazer agora? (20 min)"

RITUAL:
  1. Briefing completo (todos os projetos, nao so ativos)
  2. DO-CONFIRM checklist (6 itens)
  3. Processar inbox (classificar ideias)
  4. Consolidar memoria (decisoes → padroes? processos → SOPs?)
  5. Atualizar cockpit
  6. Definir proxima data

OUTPUT: cockpit atualizado, memoria consolidada, foco claro pra semana
```

---

## Ciclo de Projeto

### Nasce (*novo-projeto)
1. Expert fala que quer comecar projeto novo
2. Companion verifica cockpit: tem vaga? (max 3 ativos)
3. SE nao tem vaga: "Voce tem 3 ativos. Qual congela pra abrir espaco?"
4. SE tem vaga: coletar info (nome, objetivo, dono, deadline)
5. Criar tracker do template (`business/templates/tracker-template.md`)
6. Adicionar no cockpit (secao ATIVOS)
7. Definir fases e primeiras tarefas
8. Projeto esta ativo — agentes ja podem trabalhar nele

### Vive
- Todo agente que toca o projeto le tracker antes, atualiza depois
- Companion monitora escalacoes no boot de cada sessao
- Expert atualiza via trabalho normal + commits

### Morre
1. Ultima tarefa da ultima fase concluida
2. Companion preenche RETRO com expert (3 perguntas)
3. Metricas consolidadas
4. Move pro ARQUIVO no cockpit
5. Vaga abre → proximo da fila entra automaticamente (Companion sugere)

---

## Como os Ciclos se Conectam

```
SESSAO (diario)
  └── Boot → Briefing → Trabalho → Checkpoint → Encerramento
       │         │          │           │
       │         │          │           └── Commit salva estado
       │         │          └── Projeto progride (tracker atualizado)
       │         └── Escalacoes detectadas (weekly, blockers)
       └── Memoria carregada (contexto, decisoes, padroes)

SEMANAL
  └── Weekly Review → Consolida memoria → Processa inbox → Valida cockpit

PROJETO
  └── Nasce → Vive (varias sessoes) → Morre → Retro → Proximo entra
```

Cada ciclo alimenta os outros. A sessao alimenta a semana (commits acumulam). A semana alimenta os projetos (review valida). Os projetos alimentam as sessoes (trackers guiam trabalho).

---

## Principio Fundamental

**O sistema fica mais inteligente a cada volta.**
- Cada sessao: contexto-dinamico mais preciso
- Cada decisao: log mais rico
- Cada projeto concluido: retro gera aprendizado
- Cada semana: padroes mais claros
- Cada commit: historico mais completo

Isso e o volante de crescimento materializado no modus operandi.

---

*Modus Operandi v1.0.0 — Auroq OS*
