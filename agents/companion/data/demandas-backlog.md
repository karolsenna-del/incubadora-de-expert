# Demandas e Backlog

> Pendencias, ideias, tarefas que precisam ser feitas. Organizado por prioridade.

## Urgente (doendo agora)

<!-- O que precisa ser feito AGORA -->

- **Automatizar Stories — EM ANDAMENTO** (12/08): Karol pediu pra iniciar agora (antes de ir pra uma live), vai mandar o roteiro das 12 semanas em seguida. Plano: quando o roteiro chegar, adaptar copy pra formato Stories + layouts prontos (Squad Conteudo Arcane) e avaliar agendamento automatico via GitHub Actions, reaproveitando o padrao ja usado no Rota100k (Gestor de Infra Arcane). Nao precisa de vaga no cockpit — entra como melhoria da operacao continua "Instagram / Conteudo". Proximo passo: aguardando o roteiro da Karol.
- ~~**Logar manualmente na Hotmart no perfil do Playwright MCP** (ou atualizar senha em `agents/course-publisher/data/vault.yaml`)~~ — **Senha corrigida (06/08): `KSFPate2026!`.** Fallback de login deve funcionar na próxima rodada (quinta, 08h) sem precisar de sessão salva. Ainda não confirmado na prática — se falhar de novo, o problema é outro (ex: 2FA). Monitorar o resultado do próximo `weekly-sync` em `agents/course-publisher/data/course-publisher-missions.md`.

## Importante (proximo foco)

- ~~**6 posts da `business/instagram/fila/` — revisar copy e produzir carrossel**~~ — **CONCLUIDO.** Confirmado 28/07 (Karol) + git log: os 6 (`cansaco-palavra-do-ano`, `diploma-vs-vivencia`, `duas-pos-graduacoes`, `medo-parecer-amadora`, `nao-precisa-seguidores`, `sabe-demais-paralisando`) ja tinham sido publicados automaticamente pelo insta-scheduler entre 24-29/06. Item ficou desatualizado no backlog por engano.
- ~~**Limpar 12 screenshots do Cloudinary soltos na raiz**~~ — **CONCLUIDO 12/07 (Organizer).** Eram 13 arquivos `cloudinary-*.png` (prints do wizard de onboarding), todos commitados no git. Varredura de seguranca: nenhum exibia API key/secret (apesar dos nomes `cloudinary-apikeys*.png`) — sem necessidade de rotacionar credencial. Backup dispensado: historico do git ja preserva. `git rm` dos 13 + commit local. Push pendente com o Ops.
- ~~**Criar "Expert em Lives" via Worker Forge**~~ — **CONCLUIDO 18/06**. Worker criado e instalado.
- ~~**Bio Instagram com tese**~~ — **CONCLUIDO**.
- **Primeiros posts feed** — post da tese sendo publicado 18/06. Continuar com angulo "expert em fracassar no digital" nos proximos conteudos.
- **Construir Agente de Roteiro de Validação** (Grupo/Vendas Secretas) — aluno descreve método/oferta, agente gera o roteiro da ligação de venda 1:1 adaptado pro caso dele. Prioridade alta: é o diferencial central da Incubadora (Vendas Secretas). Rotear pra Worker Forge ou Mind Forge quando a Karol quiser começar. Surgiu 31/07 ao fechar os entregáveis do ecossistema de ofertas — ver `docs/knowledge/expert-business/produto/ecossistema-ofertas-jul2026.md`.
- **Construir Agente de Feedback de Portfólio ("Clone Karol" restrito)** (Grupo) — aluno sobe o que produziu (persona/promessa/proposta), agente corrige com o critério de avaliação da própria Karol, sem ela revisar manualmente. Escopo deliberadamente restrito (não é um clone completo — só avalia fundação). Rotear pro Clone Forge quando a Karol quiser começar. Surgiu 31/07, mesma origem do item acima.
- ~~**Atualizar o agente "Posicionamento de Autoridade" (painel de agentes)** — renomear pra "Agente da Autoridade Tríplice"~~ — **RENOMEADO pela Karol (12/07).** Enriquecer a pergunta 2.4 (alinhar com o nome usado em m4-roteiros.md, A1-A3) e enriquecer a pergunta 2.4 ("nível de consciência da persona") com os 5 Níveis de Consciência de Eugene Schwartz (Inconsciente / Consciente do Problema / Consciente da Solução / Consciente do Produto / Totalmente Consciente), com nota-ponte pro funil de 3 estágios (Topo/Meio/Fundo) usado em A2. Ajuste na configuração do agente, fora deste repo. Surgiu em 13/06 ao corrigir o ponto 2 da NOTA DE RECONSTRUÇÃO de m4-roteiros.md.

## Backlog (quando tiver tempo)

<!-- Gancho "Expert em fracassar no digital" — elevado para posicionamento central em 28/05. Ver log-decisoes.md. -->

- **Diagnóstico do Expert — perguntas de qualificação por oferta** (12/08): adicionar perguntas ao diagnóstico atual (tempo disponível/semana, facilidade com IA/ChatGPT, renda geral do negócio — não só digital, prefere aprender/fazer junto/receber pronto) pra indicar qual das 7 ofertas o lead mais se encaixa antes da sessão estratégica. Afeta `diagnostico.incubadoradeexpert.com.br`.
- **Oferta Individual — adicionar "10 ferramentas personalizadas do método"** (12/08): hoje a Individual usa os mesmos 10 templates genéricos da biblioteca (`docs/knowledge/expert-business/produto/biblioteca-templates/`); ideia é adaptar esses templates pra cada aluno como entregável exclusivo. Atualizar copy da página de vendas + `ecossistema-ofertas-jul2026.md`.
- **App da Incubadora de Expert** (12/08): PRECISA CLARIFICAR — pode ser a mesma coisa que a Área de Membros (já ativa, cockpit #3) ou algo diferente (app nativo mobile?). Não tratar como ideia nova antes de confirmar com a Karol.
- **Agente/prompts de fotos profissionais de bônus** (12/08): gerar 10-20 fotos profissionais por IA, calibradas no estilo de comunicação/valores de cada expert, a partir do resultado da Autoridade Tríplice. Bônus de posicionamento — oferta de destino ainda não definida.
- **Automatizar Stories** (12/08) — dor recorrente: Karol tem roteiro de 12 semanas pronto mas não consegue manter o hábito de postar. Quer copy adaptada + layouts prontos pra postar rápido, possivelmente agendado via GitHub (já existe precedente: agendamento de carrossel do Rota100k via GitHub Actions).

---

*Ultima atualizacao: 12/08/2026*
