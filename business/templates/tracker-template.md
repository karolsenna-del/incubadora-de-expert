# TRACKER — {NOME DO PROJETO}

> Execucao viva do projeto. Todos os agentes leem e atualizam este arquivo.
> Playbook: {path do playbook se existir, ou "—"}
> Cockpit: [cockpit](../../cockpit.md)

**Inicio:** {data}
**Deadline:** {data ou "sem deadline"}
**Dono geral:** {quem responde pelo projeto}
**Status:** {Ativo | Em finalizacao | Bloqueado}

---

## FASES

| # | Fase | Status | Inicio | Fim |
|---|------|--------|--------|-----|
| 1 | {nome da fase} | {Done / Em andamento / Nao iniciado} | {data} | {data} |
| 2 | {nome da fase} | | | |
| 3 | {nome da fase} | | | |

**Fase atual:** {numero} — {nome}

---

## TAREFAS (fase atual)

| Tarefa | Dono | Status | Depende de | Notas |
|--------|------|--------|------------|-------|
| {tarefa 1} | {agente/pessoa} | {Done DD/MM / Em andamento / Bloqueado / Nao iniciado} | {dependencia ou —} | {nota curta} |
| {tarefa 2} | | | | |

**Legenda de status:**
- `Done DD/MM` — concluido com data
- `Em andamento` — alguem ta trabalhando
- `Bloqueado` — depende de algo externo
- `Nao iniciado` — na fila desta fase

---

## BLOCKERS

| Blocker | Desde | Impacta | Acao necessaria |
|---------|-------|---------|-----------------|
| {descricao} | {data} | {quais tarefas} | {o que fazer pra destravar} |

---

## LOG

> Mais recente primeiro. Cada entrada: data — agente/pessoa: o que fez.

- {DD/MM} — {quem}: {o que aconteceu}

---

## METRICAS (se aplicavel)

| Metrica | Baseline | Meta | Atual |
|---------|----------|------|-------|
| {metrica} | {valor} | {valor} | {valor} |

---

## RETRO (preencher ao concluir)

> Companion preenche com o expert quando o projeto termina.

1. **Deu o resultado esperado?**
2. **O que funcionou?**
3. **O que faria diferente?**
