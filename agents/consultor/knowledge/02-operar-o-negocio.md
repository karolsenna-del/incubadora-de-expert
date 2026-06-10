# 02 — Operar o Negócio dentro do Auroq OS

> Como o expert roda o dia a dia: projetos, memória, fluxo diário e o ritual de commit. O consultor usa isto pra responder "como eu opero?", "como faço no dia a dia?", "onde registro isso?".

---

## O Fluxo Diário (o básico que o aluno repete todo dia)

```
1. Abre o Terminal
2. cd meu-negocio
3. claude
4. Ativa o Companion  (/{nome}-companion)
5. Companion situa: "onde paramos, o que está rodando, qual o foco"
6. Expert trabalha — descreve o que quer, o sistema roteia pro agente certo
7. No fim: Ops faz o commit (salva o checkpoint do negócio)
```

Princípio que rege tudo: **linguagem natural primeiro**. O expert não decora comando — ele descreve o que quer e o sistema resolve qual task/agente usar (`rules/natural-language-first.md`).

---

## Sistema de Gestão de Projetos — 4 Camadas

O problema que resolve: expert operando com IA tem velocidade e possibilidades demais. Sem sistema, perde a visão do todo, projetos ficam pendurados, ideias se misturam com compromissos.

```
CAMADA 4 — INBOX        "O que eu pensei / preciso resolver?"
    ↓ Companion captura e classifica
CAMADA 3 — COCKPIT      "O que está rodando na empresa?" (fonte única de verdade)
    ↓
CAMADA 2 — PLAYBOOKS    "Como se faz isso?" (receita reutilizável)
    ↓
CAMADA 1 — TRACKERS     "Onde estamos AGORA neste projeto?"
```

| Camada | Arquivo | O que é |
|--------|---------|---------|
| **Inbox** | seção do cockpit | ideias brutas — não são projetos, são possibilidades. Processadas no weekly |
| **Cockpit** | `business/cockpit.md` | fonte ÚNICA de verdade. 7 seções: ATIVOS (max 3), FILA, INBOX, CONGELADOS, OPERAÇÕES, ARQUIVO, REGRAS |
| **Playbooks** | `business/processos/` | receitas reutilizáveis (como fazer lançamento, rodar campanha). Criados depois de fazer 1ª vez |
| **Trackers** | `business/campanhas/{projeto}/tracker.md` | execução ao vivo: fases, tarefas, blockers, log, métricas, retro |

### Regra de ouro dos projetos: **máximo 3 ativos**
Mais de 3 = context switching mata throughput (Goldratt/TOC). Sem exceção.

### Ciclo de vida
```
IDEIA (inbox) → FILA (priorizada) → ATIVO (max 3) → CONCLUÍDO (arquivo)
                                          ↕
                                     CONGELADO (someday)
```
Projeto morre direito: última tarefa concluída → métricas preenchidas → retro (3 perguntas) → move pro arquivo → vaga abre → próximo da fila entra.

### Protocolo de agente (todo agente segue, `rules/project-tracker.md`)
- **ANTES:** lê o tracker, verifica dependências, identifica sua tarefa
- **DURANTE:** foca no escopo, registra blockers novos na hora
- **DEPOIS:** marca tarefas Done + data, adiciona linha no log, atualiza fase

### Weekly Review (o Companion conduz, ~20 min)
1. Briefing do estado de todos os projetos
2. DO-CONFIRM checklist (6 itens): todo ativo tem next action? algum parado 5+ dias? blocker sem ação? fila ordenada? inbox processado? operações saudáveis?
3. Update do cockpit e trackers
4. Close + próxima data

### Escalação automática (Companion monitora)
Blocker 3+ dias → alerta · projeto parado 5+ dias → "congelar?" · weekly atrasado 14+ dias → force alert.

---

## Sistema de Memória — 3 Camadas

IA sem memória é amnésia. O sistema lembra pelo expert — ele não pode ser responsável por lembrar de tudo.

```
CAMADA 1 — SESSÃO (efêmera)        na conversa · morre no autocompact se não salvar
CAMADA 2 — OPERACIONAL (curto/médio) agents/companion/data/ · sobrevive entre sessões
CAMADA 3 — PERMANENTE (Exocórtex)   docs/knowledge/ + business/processos/ · pra sempre
```

### Camada 2 — Memória Operacional (`agents/companion/data/`)
| Arquivo | Conteúdo |
|---------|----------|
| `contexto-dinamico.md` | onde estamos AGORA — estado da empresa, foco atual (atualiza toda sessão) |
| `log-decisoes.md` | decisões + racional + contexto (append-only) |
| `demandas-backlog.md` | ideias e pendências (processado no weekly) |
| `padroes-observados.md` | meta-cognição — padrões recorrentes do expert e do sistema |

### Camada 3 — Memória Permanente (Exocórtex)
`expert-mind/` (identidade, valores, tom, história) · `expert-business/` (posicionamento, público, metodologia) · `biblioteca-pmi/` (conhecimento tratado via ETL) · `business/processos/` (SOPs).

### 6 Triggers de Salvamento
Decisão tomada → log · Projeto progrediu → tracker · Conhecimento criado → biblioteca · Padrão detectado → padroes-observados (Companion registra sozinho) · Sessão encerrando → contexto-dinamico + trackers · Autocompact iminente → salvar estado JÁ.

### Regra de Ouro: **"Na dúvida, salva."**
É mais barato salvar o que não vai usar do que perder o que precisava.

### Consolidação (memória sobe de camada)
log-decisoes com 20+ entradas → extrair padrões · padrão confirmado 3+ vezes → vira recomendação ativa · processo feito 3+ vezes → vira SOP em `business/processos/`.

---

## O Ritual de Commit (Ops conduz)

O commit no Auroq OS **não é sobre código — é sobre salvar o checkpoint do negócio.**

1. **Revisar** o que mudou (`git status`, `git diff --stat`)
2. **Verificar projetos** — tracker do projeto ativo está atualizado? Se não, Ops avisa
3. **Verificar contexto** — decisões importantes estão no log? contexto-dinamico reflete?
4. **Mensagem de negócio** — conta O QUE ACONTECEU, não o que mudou nos arquivos:
   - `progresso:` avançou em projeto · `decisao:` decisão estratégica · `processo:` documentou SOP
   - `agente:` criou/melhorou agente · `conhecimento:` tratou conhecimento · `campanha:` ação de campanha
   - `fix:` corrigiu · `setup:` infra
   - Ex: `progresso: NDF Workshop fase 1 concluída — LP, flows e criativos prontos`
5. **Confirmar e commitar** (`git add` nunca pega vault/ ou .env)
6. **Push (opcional)** — backup na nuvem

> Git push, PR e deploy são **exclusivos do Ops** (Constitution Artigo II). Qualquer outro agente delega.

---

## Onde cada coisa mora (resumo de roteamento)

| O expert quer… | Vai em… |
|----------------|---------|
| Ver o que está rodando | `business/cockpit.md` |
| Tocar um projeto | `business/campanhas/{projeto}/tracker.md` |
| Guardar uma credencial | `business/vault/` (gitignored) |
| Documentar um processo | `business/processos/` |
| Registrar quem ele é | `docs/knowledge/expert-mind/` |
| Guardar conhecimento tratado | `docs/knowledge/biblioteca-pmi/` |
| Lembrar uma decisão | `agents/companion/data/log-decisoes.md` |

---

*Fonte: repo auroq-os (sistema-gestao-projetos.md, sistema-memoria.md, ops.md, guia de instalação). Fundação factual.*
