# Demandas e Backlog

> Pendencias, ideias, tarefas que precisam ser feitas. Organizado por prioridade.

## Urgente (doendo agora)

<!-- O que precisa ser feito AGORA -->

- **Automatizar Stories — CATALOGO ADAPTADO (12/08), aguardando 3 decisoes da Karol antes de automatizar.** Pipeline: ETLmaker extraiu os 13 PDFs pra KB (`agents/etlmaker/kbs/alcateia-implementacao/VOL-conteudo.md` secao 5) → Squad Conteudo Arcane (Rico) adaptou pro tom/posicionamento da Karol, resultado em `docs/producao-conteudo/karol/rotina-stories-formatos.md`. Reusou o `perfil-tom-de-voz.md` ja existente (sem recaptura). Catalogo final: 2 ancoras fixas (Domingo=Levantada de Mao, Sabado=Day Off) + 15 formatos rotativos (Caixinha, Enquete Positiva, Dominando a Mente, Cantinho do Pensamento, Pico de Engajamento, Sequencia, Isca Digital/Social Selling/Call, Voce no Game, Depoimento ou Bastidor, entre outros) adaptados pra tese/ofertas da Incubadora — sem inventar numeros/cases que a Karol nao tem.

  **4 decisoes fechadas com a Karol (12/08):** (1) Levantada de Mao rotaciona entre um **ciclo de 5 ofertas** (nao as 7) — Diagnostico Ferramentas, Expert360, Sprint do Metodo, Grupo, Individual — cada uma resolve uma trava especifica (ver `crm-reativacao-leads/arsenal-vendas-closer.md` secao 5). **Metodo VIP e Metodo Express ficam de fora da rotina fixa** — ela oferece no direct/downsell caso a caso. (2) Levantada de Mao sobe de 1x pra **3x/semana — Domingo, Terca e Quinta** (Sexta descartada: "ninguem quer comprar nada") — isso tirou Caixinha e Enquete Positiva do dia fixo delas, catalogo rotativo agora e so Segunda/Quarta/Sexta (14 formatos pra 3 dias). (3) Pode reaproveitar historias ja usadas em carrossel/Reels nos Stories, sem problema.

  **Pendencia restante (menor):** formatos com prova numerica (Cantinho do Pensamento, Dominando a Mente) precisam de dado real dela — resolver caso a caso na hora de produzir, nao bloqueia o desenho da rotina.

  **Worker criado (12/08): Expert-Stories** (`agents/expert-stories/`, ativa com `/expert-stories`). Sabe a rotina fixa + catalogo rotativo + ciclo de 5 ofertas, escreve o texto no tom da Karol, conduz a decisao de override do dia (registra cada caso no Mission Log ate virar padrao). Classificacao visual nova incorporada em `rotina-stories-formatos.md`: 11 dos 16 formatos sao 🟢/🟡 (texto ou texto+foto generica, geraveis sem foto/video real dela) — so 5 sao 🔴 (Voce no Game, Depoimento/Bastidor, De Volta ao Passado, Atualizacao, Day Off).

  **Gestor de Infra Arcane resolveu a pendencia tecnica principal (12/08):** pesquisou a documentacao oficial da Meta e confirmou que `media_type=STORIES` e suportado pela mesma Graph API do carrossel (mesmo fluxo container->publish) — registrado em `agents/insta-scheduler/data/insta-scheduler-kb.md` secao 1.5. Confirmado tambem, por documentacao oficial (nao mais suposicao): sticker nativo (Caixinha, Enquete, Teste de Demanda) realmente nao pode ser colado via API — limite real da Meta.

  **2 acoes que ainda faltam (nao bloqueiam o worker existir, so a geracao/postagem automatica de verdade):**
  1. Escrever e testar o script Python de publicacao de Stories (adaptacao direta do script de carrossel ja existente — esforco baixo, ainda nao feito)
  2. Criar template de imagem Stories (1080x1920) no Squad Carrossel Arcane via `*add-template` — dono dessa parte e o Squad Carrossel Arcane, nao o Gestor de Infra (avaliado nesta sessao)

  Worker **Expert-Stories** (`agents/expert-stories/`, ativa com `/expert-stories`) ja esta pronto pra rodar a rotina (decisao do formato do dia, texto, conducao de override) — as 2 acoes acima destravam a parte de geracao de imagem + postagem automatica quando a Karol quiser acionar.

  **Historico (desenho fechado antes do processamento):** Karol mandou os 13 PDFs (semana 1-12 + playbook levantada de mao), ja copiados em `agents/etlmaker/kbs/alcateia-implementacao/00-pipeline/sources/pdfs-rotina-stories/`. Achado: a KB da Alcateia (`agents/etlmaker/kbs/alcateia-implementacao/VOL-conteudo.md` secao 5, "Teia de Aranha") ja tem a rotina de Stories do Vini extraida (tabela por dia + scripts) — e o `MAPA-TERRITORIAL.md` daquele ETL ja tinha flagado gap "Aula 90 (PDF) — possivelmente rotina de stories visual, solicitar ao expert se critico". Os PDFs novos provavelmente preenchem esse gap. Ops instalou o poppler-utils (12/08) — Read tool ja consegue renderizar PDF nesse ambiente, confirmado lendo semana-01.pdf. Proximo passo: ETLmaker le os 13 PDFs de verdade e atualiza (nao recria) a secao 5 do VOL-conteudo.md; so depois Squad Conteudo Arcane adapta pro tom de voz da Karol + layouts, e Gestor de Infra Arcane avalia agendamento via GitHub Actions (padrao ja usado no Rota100k).

  **Desenho da camada de adaptacao ao contexto (fechado com a Karol, 12/08):**
  - **Sinal do override:** chat (Companion ou worker de Stories) — sem infra nova. WhatsApp/audio fica pra quando a Fase 2 do Bootstrap 3 (Z-API) for priorizada, hoje nenhum agente escuta audio do WhatsApp.
  - **Rotina fixa por dia/hora:** Segunda 15h-16h30 horario de Brasilia (Karol mora no MS, 1h a menos) = mentoria em grupo — condicional: so vira Story se apareceu aluno. Quarta 15h-16h (Brasilia) = live Expert360º.
  - **Rotina fixa por tipo de evento (dia variavel, mas sempre que acontece vira conteudo):** Encontro individual e Sessao estrategica — toda vez que rolam, sempre geram Story do que foi falado, independente do dia.
  - **Formato:** essa automacao cobre SO STORIES. Reels nao entra no fluxo automatico — se o assunto for muito bom, a Karol replica/complementa em Reels manualmente depois, por fora do sistema.
  - **Encaixe do override "genuino" (evento fora dos 4 gatilhos conhecidos, tipo "fechei uma venda hoje"):** decisao explicita da Karol (12/08) — SEM regra fixa por enquanto. Cada caso e decidido junto no chat (substitui o Story do dia, soma como extra, ou guarda pra depois) ate acumular casos suficientes pra virar padrao. Quem estiver conduzindo o chat nesse momento (Companion ou worker de Stories) deve registrar a decisao de cada caso pra eventualmente propor a regra formal.
- ~~**Logar manualmente na Hotmart no perfil do Playwright MCP** (ou atualizar senha em `agents/course-publisher/data/vault.yaml`)~~ — **Senha corrigida (06/08): `KSFPate2026!`.** Fallback de login deve funcionar na próxima rodada (quinta, 08h) sem precisar de sessão salva. Ainda não confirmado na prática — se falhar de novo, o problema é outro (ex: 2FA). Monitorar o resultado do próximo `weekly-sync` em `agents/course-publisher/data/course-publisher-missions.md`.

- **Banco de frases motivacionais da Área de Membros — Aria escreve na voz da Karol** (12/08): Gestor de Infra Arcane extraiu 84 frases de PDFs que a Karol tinha (pôster de citações), mas ela decidiu não usar — tom de autoridade emprestada/empreendedor genérico, não bate com o posicionamento atual de especialista. Material bruto arquivado em `business/campanhas/area-de-membros/material-bruto-frases-standby.md` (referência, não pra copiar direto). Karol vai chamar a Aria (squad-conteudo-arcane) num outro chat pra escrever o banco definitivo, na voz do método — ponto de partida são os 4 placeholders que já existem em `js/data.js` (`FRASES_MOTIVACIONAIS`), ex: "Diploma é o que você estudou. Método é o que você viveu."

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
