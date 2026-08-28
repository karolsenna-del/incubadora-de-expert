# COCKPIT — Projetos

> Fonte unica de verdade sobre o que esta rodando na empresa.
> Mantido pelo Companion. Expert valida.
> Regra: max 3 ativos. Sem excecao.

**Ultima atualizacao:** 28/08/2026 (Companion — reconciliacao: Area de Membros com M3 iniciado + acesso proprio da Karol, 52 commits recuperados apos incidente de push)
**Proximo review:** 31/08/2026

---

## ATIVOS (max 3)

| # | Projeto | Objetivo | Next Action | Dono | Status | Tracker |
|---|---------|----------|-------------|------|--------|---------|
| 1 | Expert360º (Curso) | Construir e lancar curso escalavel para especialistas | Modulo de Orientacoes + inicio do M3 ja publicados na Area de Membros (26/08) — checar com Karol se M3 terminou de gravar/editar. Depois: M1 aulas 00-01 + M4 | Karol | Producao ativa — M3 em gravacao/edicao/publicacao. Legenda dupla (ASR sobrepondo legenda queimada) corrigida em 53 videos (27/08). | [tracker](campanhas/expert360-curso/tracker.md) |
| 2 | Desafio Rota100k (Instagram) | Executar o Desafio Rota100k (guia externo, mentoria "Se Posicione" — Afonso) — pra crescimento/posicionamento no Instagram. **Duracao: ate dezembro/2026.** Semana 04 (24-30/08) com os 7 carrosseis ja agendados via GitHub Actions (20h BRT cada dia). | Reels/Stories da semana seguirem sendo produzidos/publicados ate 30/08. **URGENTE: renovar META_TOKEN antes de sexta 28/08** — expira 29/08, risco dos posts de sabado 29/08 e domingo 30/08 (20h) falharem sem alerta (SOP-001) | Karol + Squad Conteudo Arcane | Ativo — Semanas 01, 02 e 03 concluidas. Semana 04 mapeada e com os 7 carrosseis agendados. | [plano semana 04](../docs/producao-conteudo/karol/desafio-rota100k-semana04-plano.md) |
| 3 | Área de Membros (Curso + Mentoria) | Construir plataforma própria (modelada na Arcane) unificando Expert360º e mentoria 1:1, com vitrine das 7 ofertas do ecossistema (cross-sell nativo) — substitui Voomp Play e o Drive solto da mentoria | **RESOLVIDO (27-28/08): Karol (dona) ganhou matricula/acesso proprio** (login antigo nao mostrava produto nenhum). Modulo de Orientacoes + inicio do M3 publicados. Legenda dupla (ASR x legenda queimada) corrigida em 53 videos. Pendente: pastas 1:1 da Milena no Drive fora do padrao esperado pela automacao (decisao registrada em log-decisoes 24/08 — vale so daqui pra frente) | Karol + Gestor de Infra Arcane | Ativo — Fase 4 (checkout→acesso) fechada e endurecida. V1 no ar em dominio proprio, conteudo do Expert360 crescendo (M0-M3). | [tracker](campanhas/area-de-membros/tracker.md) |

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
| Workshop Método Validado | Documento mestre em `business/campanhas/workshop-metodo-validado/documento-mestre.md` — proposta e público já fechados | Congelado no weekly review de 24/08 — cockpit sem vaga (3 ativos), Karol decidiu não priorizar agora |

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
