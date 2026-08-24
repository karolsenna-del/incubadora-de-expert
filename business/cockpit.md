# COCKPIT — Projetos

> Fonte unica de verdade sobre o que esta rodando na empresa.
> Mantido pelo Companion. Expert valida.
> Regra: max 3 ativos. Sem excecao.

**Ultima atualizacao:** 24/08/2026 (Companion — reconciliacao de 4 dias sem atualizacao formal: Rota100k Semana 04 agendada + risco de META_TOKEN, Conduz Agro/Milena pipeline 10/10 fases concluido fora do cockpit, Expert360 sem log ha 10 dias)
**Proximo review:** ATRASADO — ultimo review real foi 14/08 (10 dias)

---

## ATIVOS (max 3)

| # | Projeto | Objetivo | Next Action | Dono | Status | Tracker |
|---|---------|----------|-------------|------|--------|---------|
| 1 | Expert360º (Curso) | Construir e lancar curso escalavel para especialistas | Karol gravando e editando M3 (confirmado 24/08). Depois: M1 aulas 00-01 + M4 | Karol | Producao ativa — M3 em gravacao/edicao. M0 (5/5) e M2 (9/9) publicados na Voomp com legenda; M1 (6/8) publicado, faltam 2 aulas sem legenda. Plataforma migrada de Hotmart pra VOOMP (01/07). | [tracker](campanhas/expert360-curso/tracker.md) |
| 2 | Desafio Rota100k (Instagram) | Executar o Desafio Rota100k (guia externo, mentoria "Se Posicione" — Afonso) — pra crescimento/posicionamento no Instagram. **Duracao: ate dezembro/2026.** Semana 04 (24-30/08) com os 7 carrosseis ja agendados via GitHub Actions (20h BRT cada dia). | Reels/Stories da semana seguirem sendo produzidos/publicados ate 30/08. **URGENTE: renovar META_TOKEN antes de sexta 28/08** — expira 29/08, risco dos posts de sabado 29/08 e domingo 30/08 (20h) falharem sem alerta (SOP-001) | Karol + Squad Conteudo Arcane | Ativo — Semanas 01, 02 e 03 concluidas. Semana 04 mapeada e com os 7 carrosseis agendados. | [plano semana 04](../docs/producao-conteudo/karol/desafio-rota100k-semana04-plano.md) |
| 3 | Área de Membros (Curso + Mentoria) | Construir plataforma própria (modelada na Arcane) unificando Expert360º e mentoria 1:1, com vitrine das 7 ofertas do ecossistema (cross-sell nativo) — substitui Voomp Play e o Drive solto da mentoria | **RESOLVIDO (20/08): Live 26 no ar na Área de Membros** (compartilhamento do Drive corrigido pela Karol + sync manual disparada). Achado no processo: pastas de sessao 1:1 da Milena no Drive nao seguem o padrao de nome que a automacao de Encontros Individuais espera — precisa decisao (ajustar filtro ou renomear pastas). Fora isso: pendencias tecnicas criticas fechadas (17-18/08 — bypass de auth, RLS, bug de matricula, aviso de e-mail); Karol entrega aos poucos banco de frases motivacionais + perguntas do popup de NPS | Karol + Gestor de Infra Arcane | Ativo — Fase 4 (checkout→acesso) fechada e endurecida (17-18/08). V1 no ar em dominio proprio. Bloqueio de acesso ao Drive (20/08) resolvido e confirmado — Live 26 publicada. | [tracker](campanhas/area-de-membros/tracker.md) |

---

## FILA (proximo quando liberar vaga)

| # | Projeto | Objetivo | Depende de | Prioridade |
|---|---------|----------|------------|------------|
| | | | | |

---

## INBOX (ideias brutas — nao sao projetos ainda)

| Ideia | Origem | Notas |
|-------|--------|-------|
| Workshop Método Validado | Documento mestre criado 14/08 (`business/campanhas/workshop-metodo-validado/documento-mestre.md`) — proposta e público já fechados | Achado pelo Companion em 19/08 durante reconciliação — nunca entrou no cockpit/inbox. Nao processado: perguntar Karol se vira projeto novo (sem vaga — 3 ativos), fica congelado, ou e outra coisa (ex: parte de operação existente) |

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
| Instagram / Conteudo | Karol | Ativa — Desafio Rota100k rodando (ver ATIVOS #1... #2 acima). Automacao de Stories no ar de verdade (23/08): cron publica sozinho as 09h30 America/Cuiaba (SOP-021, apaga a Story anterior antes de postar). SOP-022 (Direct automatico por palavra-gatilho) com codigo escrito, aguardando acao da Karol pra ativar | contexto-dinamico.md — prioridades do momento |
| Lives semanais (grupo fechado) | Karol + /expert-em-lives | Ativa — Live 26 realizada (confirmado 24/08): "Ninguém te enxerga como autoridade", CTA VITRINE | business/campanhas/lives-semanais/ |
| Mentoria (6 alunas) | Karol | Ativa — Rosiani Bezerra (aluna de turma anterior) ganhou pasta formal em mentoria/alunas/ (17/08), total subiu de 5 pra 6. Fonte de verdade e o Drive de cada aluna, nao o cockpit (Karol atualiza direto la) | mentoria/alunas/ |
| Funil mini treinamento (LP → WhatsApp) | Karol | Ativa mas **sem resultado** (flagado 14/08 pela Karol: "nunca deu resultado", precisa ser otimizado) | business/campanhas/lp-minitreinamento/ |
| CRM Reativação de Leads | Karol | Ativa — ferramenta (Supabase + planilha + sync n8n) construída e permanente. Karol reativando os leads pessoalmente, confirmado em andamento (14/08) — Clone Euriler orientou não enviar pro closer. Fase 5 do tracker formalizada como encerrada nesse formato | [tracker](campanhas/crm-reativacao-leads/tracker.md) |

---

## ARQUIVO (concluidos)

| Projeto | Concluido em | Resultado |
|---------|-------------|-----------|
| Ferramenta de Produto Arcane | 20/05/2026 | Expert360 totalmente definido — PRD v1.2 aprovado |
| ETL Alcateia Implementacao | 12/07/2026 | KB completa: 7 volumes entregues, validation_score 95.4, verdict APPROVED. Estava registrada como pendente na fila por engano — pipeline ja tinha fechado. |
| Desafio 10 Dias (Instagram) → Ciclo 2 | 05/08/2026 | **Nao resultou em nada** — nenhum formato validado, nenhum conteudo garanhao. Substituido pelo Desafio Rota100k (ver ATIVOS #2). Plano historico: [plano](../docs/producao-conteudo/karol/desafio-10-dias-plano.md) |

---

## REGRAS DO COCKPIT

1. **Max 3 ativos** — se quer adicionar, primeiro congela ou conclui um
2. **Todo ativo tem next action** — se nao tem, o projeto ta morto
3. **Fila e ordenada** — item 1 sobe primeiro quando vaga abrir
4. **Congelado nao e cancelado** — pode voltar quando fizer sentido
5. **Companion mantem** — expert valida no weekly review
6. **Operacoes nao contam como projeto** — rodam em paralelo, monitoradas separadamente
7. **Inbox nao e fila** — ideia bruta precisa ser processada antes de virar projeto
