# COCKPIT — Projetos

> Fonte unica de verdade sobre o que esta rodando na empresa.
> Mantido pelo Companion. Expert valida.
> Regra: max 3 ativos. Sem excecao.

**Ultima atualizacao:** 28/07/2026 (projeto CRM Reativacao de Leads aberto)
**Proximo review:** 04/08/2026

---

## ATIVOS (max 3)

| # | Projeto | Objetivo | Next Action | Dono | Status | Tracker |
|---|---------|----------|-------------|------|--------|---------|
| 1 | Expert360º (Curso) | Construir e lancar curso escalavel para especialistas | Reeditar (CapCut, legenda queimada) e subir via /course-publisher: M1 aulas 00 e 01 restantes + M2 aulas 5-9 + M3 e M4 completos | Karol | Producao — M0 (5/5) e M2 (5/9) publicados na Voomp com legenda; M1 (6/8) publicado, faltam 2 aulas sem legenda. Plataforma migrada de Hotmart pra VOOMP (01/07). | [tracker](campanhas/expert360-curso/tracker.md) |
| 2 | Desafio 10 Dias (Instagram) → Ciclo 2 | Reanalise completa (Aria, dado automatizado) + abertura do Ciclo 2 com conteudo do resort (Samoa Villa) + batelada de temas novos | Serie Samoa Villa ENCERRADA (Karol ja deixou o resort — `resort-nao-quer-todo-mundo` nao sera gravado, junta ao `resort-caro-e-cheio` ja pausado). Iris precisa trazer novo pool de temas/candidatos pro Ciclo 2 (sem mais material do resort) | Karol + Squad Conteudo Arcane | Batelada de 5 posts (Carol Diniz, Mari Vabo, Matheus Carmo, marketing conversacional, essencia x IA) publicada e agendada via GitHub Actions (21-26/07). "cafe da manha no hotel" (Reels de teste) liberado pra audiencia geral (28/07) apos validar bem com nao-seguidores (analise da Aria, 27/07). Coleta automatica de metricas do Instagram rodando diariamente. | [plano](../docs/producao-conteudo/karol/desafio-10-dias-plano.md) |
| 3 | CRM Reativação de Leads (Comercial) | Dar ferramenta pro comercial/closer contratado reativar leads (sessao estrategica sem fechamento, compradores de outros produtos, grupo fechado WhatsApp) via CRM expandido do banco unificado (Supabase) + planilha operacional | Handoff pro Dara (data-engineer): desenhar schema expandido (status, historico, follow-up, resumo automatico) em cima de pessoas/capturas/compras | Karol + Dara | Escopo definido em conversa 28/07. Fase 2 — schema do banco | [tracker](campanhas/crm-reativacao-leads/tracker.md) |

---

## FILA (proximo quando liberar vaga)

| # | Projeto | Objetivo | Depende de | Prioridade |
|---|---------|----------|------------|------------|
| | | | | |

---

## INBOX (ideias brutas — nao sao projetos ainda)

| Ideia | Origem | Notas |
|-------|--------|-------|
| | | |

> Companion classifica no weekly review: sobe pra fila, congela, ou descarta.

---

## CONGELADOS (someday/maybe)

| Projeto | Objetivo | Por que parou |
|---------|----------|---------------|
| | | |

---

## OPERACOES CONTINUAS (nao sao projetos — rodam permanentemente)

| Operacao | Responsavel | Status | Onde acompanhar |
|----------|-------------|--------|-----------------|
| Instagram / Conteudo | Karol | Ativa — Ciclo Desafio 10 Dias rodando (ver ATIVOS #2) | contexto-dinamico.md — prioridades do momento |
| Lives semanais (grupo fechado) | Karol + /expert-em-lives | Ativa — Live 22 realizada (15/07). Roteiro da live desta semana sendo fechado em outro chat com /expert-em-lives | business/campanhas/lives-semanais/ |
| Mentoria (5 alunos) | Karol | Ativa — Milena: P2 (Promessa) FECHADA + criacao do metodo adiantada (10/07). Roteiro da jornada rebalanceado (03/07) e replicado pros 5 alunos | mentoria/alunas/ |
| Funil mini treinamento (LP → WhatsApp) | Karol | LP nova PUBLICADA — treinamento.incubadoradeexpert.com.br (Vercel) | business/campanhas/lp-minitreinamento/ |

---

## ARQUIVO (concluidos)

| Projeto | Concluido em | Resultado |
|---------|-------------|-----------|
| Ferramenta de Produto Arcane | 20/05/2026 | Expert360 totalmente definido — PRD v1.2 aprovado |
| ETL Alcateia Implementacao | 12/07/2026 | KB completa: 7 volumes entregues, validation_score 95.4, verdict APPROVED. Estava registrada como pendente na fila por engano — pipeline ja tinha fechado. |

---

## REGRAS DO COCKPIT

1. **Max 3 ativos** — se quer adicionar, primeiro congela ou conclui um
2. **Todo ativo tem next action** — se nao tem, o projeto ta morto
3. **Fila e ordenada** — item 1 sobe primeiro quando vaga abrir
4. **Congelado nao e cancelado** — pode voltar quando fizer sentido
5. **Companion mantem** — expert valida no weekly review
6. **Operacoes nao contam como projeto** — rodam em paralelo, monitoradas separadamente
7. **Inbox nao e fila** — ideia bruta precisa ser processada antes de virar projeto
