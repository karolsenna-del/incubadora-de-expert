# COCKPIT — Projetos

> Fonte unica de verdade sobre o que esta rodando na empresa.
> Mantido pelo Companion. Expert valida.
> Regra: max 3 ativos. Sem excecao.

**Ultima atualizacao:** 13/09/2026 (Companion — weekly review)
**Proximo review:** 20/09/2026

---

## ATIVOS (max 3)

| # | Projeto | Objetivo | Next Action | Dono | Status | Tracker |
|---|---------|----------|-------------|------|--------|---------|
| 1 | Expert360º (Curso) | Construir e lancar curso escalavel para especialistas | **Fechar uma leva objetiva do M3** (gravacao, edicao e publicacao), sem abrir nova frente antes disso. Depois: M1 aulas 00-01 + M4 | Karol | Producao ativa — Orientacoes 2/2 e inicio do M3 3/13 publicados na Area de Membros; restante do M3 em producao. Legenda dupla corrigida nos videos publicados (27/08). | [tracker](campanhas/expert360-curso/tracker.md) |
| 2 | Desafio Rota100k (Instagram) | Executar o Desafio Rota100k (guia externo, mentoria "Se Posicione" — Afonso) — pra crescimento/posicionamento no Instagram. **Duracao: ate dezembro/2026.** Semana 07 (14/09-20/09) roteirizada e com os 7 carrosseis produzidos e programados. | Karol publicar/gravar os 21 Reels YAP + 7 Demonstracoes da Semana 07 (guiao ja escrito); acompanhar performance com a Aria ao longo da semana | Karol + Squad Conteudo Arcane | Ativo — Semanas 01-06 concluidas (analise da Aria dos ultimos 10 dias em `analises/2026-09-12/`); Semana 07 roteirizada (42 posts: 7 Reels 7s, 21 YAP, 7 Demonstracoes vitrine do negocio, 7 carrosseis) e os 7 carrosseis ja programados manualmente (20h, via app — pipeline automatico via GitHub Actions com incidente ativo nao resolvido, erro 9004, ver `insta-scheduler-rules.md` RULE-4 a RULE-8). | [plano semana 07](../docs/producao-conteudo/karol/desafio-rota100k-semana07-plano.md) |
| 3 | Área de Membros (Curso + Mentoria) | Construir plataforma própria (modelada na Arcane) unificando Expert360º e mentoria 1:1, com vitrine das ofertas do ecossistema (cross-sell nativo) — substitui Voomp Play e o Drive solto da mentoria | **Priorizar a Biblioteca de IA para a Black Friday.** Proximo passo: Karol fechar o pacote; depois, criar produto/checkout Voomp, ligar matricula com prazo e adicionar o card na Vitrine. Sem preco, prazo de acesso ou pacote presumidos | Karol + Gestor de Infra Arcane | Ativo — Fase 4 (checkout→acesso) fechada; V1 no ar em dominio proprio; infra generica da Biblioteca de IA pronta, comercializacao ainda pendente das decisoes do pacote. | [tracker](campanhas/area-de-membros/tracker.md) |

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
| Instagram / Conteudo | Karol | Ativa — Desafio Rota100k Semana 07 roteirizada/produzida/programada (12/09). **SOP-022 APROVADO pela Meta (13/09)** — verificacao de Provedor de Tecnologia liberada; falta testar comentario->Direct de verdade com conta de fora | contexto-dinamico.md — prioridades do momento |
| Lives semanais (grupo fechado) | Karol + /expert-em-lives | Ativa — Live 30 roteiro pronto: "Seu conhecimento é suficiente para se tornar método" (CTA AUTORIDADE, pendente link da planilha bônus). Live Black For You (Voomp+Anhanguera, 15/09) com 3 reels de divulgação prontos + aula bônus roteirizada (15/09) pra quem entrar na Black da Voomp, pendente gravação | business/campanhas/lives-semanais/ |
| Mentoria (6 alunas) | Karol | Ativa — Mentoria Individual formalizada. Proxima leva confirmada em 02/09: fechar o contrato de 12 meses, atualizar a mensagem de boas-vindas e definir as regras de uso do WhatsApp. Fonte de verdade das alunas segue sendo o Drive de cada uma | [checklist](campanhas/incubadora-de-expert-individual/checklist-producao.md) |
| Funil mini treinamento (LP → WhatsApp) | Karol | Ativa mas **sem resultado** (flagado 14/08 pela Karol: "nunca deu resultado", precisa ser otimizado) | business/campanhas/lp-minitreinamento/ |
| Comercial — CRM + contatos quentes | Karol | Ativa — foco confirmado no weekly de 02/09: seguir a reativacao pessoal pelo CRM e acompanhar Nanny e Euriler. Nanny ainda esta pensando na parceria; proposta de Black Friday enviada ao Euriler, sem retorno ate 02/09. Nao enviar nova mensagem sem decisao da Karol | [CRM](campanhas/crm-reativacao-leads/tracker.md) · [proposta Euriler](propostas/proposta-black-friday-euriler.md) |

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
