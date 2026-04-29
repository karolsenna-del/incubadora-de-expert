# Agent Authority — Auroq OS

## Delegation Matrix

### Ops — Operacoes Exclusivas

| Operacao | Exclusivo? | Outros Agentes |
|----------|-----------|--------------|
| `git push` / `git push --force` | SIM | BLOQUEADO |
| `gh pr create` / `gh pr merge` | SIM | BLOQUEADO |
| MCP add/remove/configure | SIM | BLOQUEADO |
| Environment bootstrap | SIM | BLOQUEADO |
| Commit inteligente (ritual completo) | SIM | Outros agentes delegam |

### Companion — Cerebro do Sistema

| Operacao | Exclusivo? |
|----------|-----------|
| Situacao diaria (boot + briefing) | SIM |
| Sistema de memoria (contexto, decisoes, padroes) | SIM |
| Sistema de projetos (cockpit, trackers, escalacao) | SIM |
| Weekly review | SIM |
| Roteamento para agente adequado | SIM |
| Criacao de projetos | SIM |

### Organizer — Organizacao e Higiene do Sistema

| Operacao | Exclusivo? |
|----------|-----------|
| Diagnostico de organizacao | SIM |
| Mover/renomear arquivos pra organizar | SIM (com aprovacao do expert) |
| Limpeza de temporarios e duplicados | SIM (com aprovacao do expert) |
| Backup espelhado pro Google Drive | SIM |
| Consultoria de nomenclatura e estrutura | SIM |

### Meta Squads — Criacao de Agentes

| Squad | Operacao Exclusiva |
|-------|--------------------|
| Squad Forge (`/squad-forge`) | Criar squads multi-agente a partir de processos |
| Mind Forge (`/mind-forge`) | Criar mentes sinteticas e consultores |
| Worker Forge (`/worker-forge`) | Criar workers especializados |
| Clone Forge (`/clone-forge`) | Clonar mentes reais em agentes digitais |
| ETLmaker (`/etlmaker`) | Extrair e estruturar conhecimento em KBs |

### Workers — Execucao

| Permitido | Bloqueado |
|---------|---------|
| `git add`, `git commit`, `git status` | `git push` (delegar pra Ops) |
| `git branch`, `git checkout` (local) | `gh pr create/merge` (delegar pra Ops) |
| Execucao de tasks operacionais | Criar novos agentes (delegar pro Meta Squad adequado) |
| Atualizacao de documentos de trabalho | Decisoes estrategicas (delegar pro Expert) |

### Squads — Processos Complexos

| Permitido | Bloqueado |
|---------|---------|
| Executar pipeline completo com quality gates | `git push` (delegar pra Ops) |
| Criar documentos de output | Criar novos agentes (delegar pro Meta Squad adequado) |
| Atualizar KBs e skills | Decisoes fora do escopo do squad |

## Cross-Agent Delegation

### Git Push Flow
```
QUALQUER agente → Ops (*commit / *push)
```

### Novo Agente Flow
```
Expert pede → Meta Squad adequado cria → Expert valida
  Squads → /squad-forge
  Minds  → /mind-forge
  Workers → /worker-forge
  Clones → /clone-forge
  KBs    → /etlmaker
```

### Projeto Novo Flow
```
Expert pede → Companion cria (*novo-projeto) → Expert valida
```

### Memoria Flow
```
QUALQUER agente detecta trigger → salva (ou pergunta) conforme rule memoria-inteligente
Companion consolida no weekly review
```

## Escalation Rules

1. Agente nao consegue completar task → Informar expert com contexto
2. Quality gate falha → Retornar pro executor com feedback especifico
3. Violacao constitucional detectada → BLOCK, corrigir antes de prosseguir
4. Conflito de boundary → Constitution Art. II resolve (cada um faz o seu)
