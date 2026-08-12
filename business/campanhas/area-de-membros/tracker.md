# TRACKER — Área de Membros (Incubadora de Expert)

> Execucao viva do projeto. Todos os agentes leem e atualizam este arquivo.
> Briefing: [briefing.md](briefing.md)
> Cockpit: [cockpit](../../cockpit.md)

**Inicio:** 11/08/2026
**Deadline:** sem deadline definido
**Dono geral:** Karol
**Status:** Ativo

---

## FASES

| # | Fase | Status | Inicio | Fim |
|---|------|--------|--------|-----|
| 1 | Layout/plataforma (dashboard, roteiro clicavel, vitrine, standby, popup de modulo) | V1 no ar — refinamento continua | 11/08 | — |
| 2 | Migracao de conteudo — Expert360º (43 aulas, M0-M4) | Nao iniciado (paralelo a Fase 1 depois que a estrutura existir) | — | — |
| 3 | Migracao de conteudo — Mentoria (aulas Expert360 + Encontros da Incubadora + Lives + modulo novo Encontros Individuais) | Nao iniciado (paralelo a Fase 1 depois que a estrutura existir) | — | — |
| 4 | Integracao checkout → acesso (webhook Voomp Pay das 7 ofertas → Supabase → libera acesso) | Nao iniciado | — | — |
| 5 | Piloto + lancamento | Nao iniciado | — | — |

**Fase atual:** 1 — Layout/plataforma. V1 no ar: **https://area-de-membros-incubadora.vercel.app** (login por magic link — usa seu e-mail real, Supabase Auth). Sequencia decidida (11/08): constroi a estrutura toda primeiro, migracao de conteudo (Expert360º + Mentoria) roda em paralelo depois. Conteudo restante do desenho (perguntas do popup de NPS, banco de frases motivacionais) a Karol vai entregando aos poucos nas weeklys — nao bloqueia o que ja foi construido.

**O que já dá pra ver no V1:** login, dashboard com as 2 trilhas (Expert360º com nomes reais dos módulos + Mentoria com os 4 módulos do briefing), roteiro clicável, vitrine com as 7 ofertas reais, overlay de standby (frase motivacional placeholder), popup de fim de módulo (perguntas placeholder). Aulas dentro de cada módulo, frases do standby e perguntas do popup ainda são placeholder — ver `js/data.js` no site, tudo marcado com `// PLACEHOLDER`.

---

## CONTEXTO DO PROJETO

Ver [briefing.md](briefing.md) pro desenho completo (publico, telas, vitrine, decisoes fechadas, proposta tecnica do Gestor de Infra Arcane). Resumo:

- Plataforma unica pra Expert360º (curso) + Mentoria 1:1, modelada na experiencia da Arcane — substitui Voomp Play (curso) e o Drive solto (mentoria).
- Vitrine mostra as 7 ofertas do ecossistema — cross-sell nativo entre curso e mentoria.
- Checkout unificado: todas as 7 ofertas migram pra Voomp Pay (webhook de venda confirmado — libera acesso automatico via Supabase).
- Modulo novo "Encontros Individuais" na mentoria — grava sessao 1:1, aluna aprova uma vez no onboarding (nao por sessao), automacao existente reaproveitada com padrao de nome `Individual - {slug-da-aluna} - {AAAA-MM-DD}`.
- Popup de fim de modulo vira coleta de NPS/transformacao + prova do metodo (perguntas exatas ainda nao definidas).

---

## TAREFAS (fase atual)

| Tarefa | Dono | Status | Depende de | Notas |
|--------|------|--------|------------|-------|
| Pesquisar webhook de venda da Voomp | Gestor de Infra Arcane | Done — 11/08 | — | Confirmado: webhook nativo (Vendas/Assinatura/Checkout), documentado em `gestor-infra-kb.md` secao 1.3. Payload real ainda nao testado |
| Desenhar escopo/briefing completo | Companion | Done — 11/08 | — | `briefing.md` — publico, telas, vitrine, tecnico, decisoes |
| Criar checkout Voomp pras 7 ofertas | Karol | Em andamento — VIP e Sprint ja criados (11/08) | — | Faltam: Diagnostico Ferramentas, Metodo Express, Grupo, Individual, Expert360º (confirmar se ja tem ou se migra do Hotmart) |
| Construir layout da plataforma (Fase 1) | Gestor de Infra Arcane | V1 no ar — 11/08 | Escopo fechado | https://area-de-membros-incubadora.vercel.app — login/dashboard/roteiro/vitrine/standby/popup funcionando com dados de exemplo. Detalhe completo no Mission Log #10 do Gestor de Infra Arcane |
| Entregar banco de frases motivacionais (standby) | Karol | Nao iniciado | — | Aos poucos, nas weeklys |
| Definir perguntas do popup de fim de módulo (NPS/transformação/prova) | Karol | Nao iniciado | — | Aos poucos, nas weeklys |
| Propor schema novo (matrícula/progresso/respostas do popup) e pedir aprovação | Gestor de Infra Arcane | Nao iniciado | — | Nivel 3 (Consult) na Delegation Map — precisa aprovação antes de rodar migration. Fase 4 |
| Remover bypass de QA (`localStorage.preview_mode`) do app.js | Gestor de Infra Arcane | Nao iniciado | — | Antes de qualquer integração real de dado (Fase 4) |
| Validar e-mail contra alunos ativos antes de liberar acesso | Gestor de Infra Arcane | Nao iniciado | Fase 4 (schema de matrícula) | Karol alertou (11/08): hoje qualquer e-mail consegue criar conta e entrar (Supabase cria usuário novo por padrão). Precisa checar contra tabela de matrícula/`pessoas` antes de mostrar conteúdo real — depende da tabela nova (Nível 3 Consult, aguarda aprovação) |
| Configurar SMTP customizado pra e-mail de auth ter marca "Incubadora de Expert" | Karol + Gestor de Infra Arcane | **Done — 11-12/08** | — | Resend (free tier) configurado. Domínio `incubadoradeexpert.com.br` verificado (DKIM/SPF no Registro.br). E-mail de login agora sai com marca da Incubadora e código de 6 dígitos visível. Limite de 2 e-mails/hora do mailer padrão também sumiu. Teste real disparado — aguardando confirmação da Karol que chegou certo |
| Capas dos produtos mais premium | Gestor de Infra Arcane | Done — 11/08 | — | Karol pediu "quero que você crie algo". Trocado o gradiente flat por capa gerada em SVG (arcos concêntricos ecoando o motivo dos 2 logos reais, tipografia grande quase invisível, ponto com glow) — cresce em densidade com o preço da oferta. Sem foto/IA externa (sem credencial de gerador de imagem no vault). Se um dia a Karol tiver fotos reais dos produtos, é só trocar por elas |
| Atualizar CTAs das 7 paginas de venda pro checkout Voomp | Gestor de Infra Arcane | Bloqueado | Karol terminar de criar os checkouts | Depende dos links Voomp de cada oferta |

---

## BLOCKERS

| Blocker | Desde | Impacta | Acao necessaria |
|---------|-------|---------|-----------------|
| — | — | — | — |

---

## LOG

> Mais recente primeiro.

- 11-12/08 — @gestor-infra-arcane (techOps): **SMTP customizado (Resend) configurado — os 2 últimos pendentes de e-mail resolvidos.** Domínio `incubadoradeexpert.com.br` verificado no Resend (Karol fez a parte manual: conta + DNS no Registro.br). E-mail de login agora sai com marca "Incubadora de Expert" e mostra o código de 6 dígitos de verdade (antes só o link chegava). Limite de 2 e-mails/hora também não existe mais. Teste real disparado pro e-mail da Karol — aguardando ela confirmar que chegou certo. Detalhe completo no Mission Log #20.
- 11/08 — @gestor-infra-arcane (techOps): **INCIDENTE corrigido — projeto Supabase errado.** E-mail de login chegou com marca "ARKA — Mentoria Arcane" porque a integração (missão #9/#10) usou um projeto Supabase diferente do real (achado por grep no código, não confirmado contra `business/vault/supabase.md`). Corrigido pro projeto certo (`pxnbcbhgoewrwyreohki`). No caminho, achado e corrigido outro bug real: `site_url`/redirect do Auth nunca tinham sido configurados pra produção (ficariam presos em localhost). Adicionado campo de código de 6 dígitos no login (alternativa ao clique no link — a Karol pediu). Branding do e-mail ainda é genérico da Supabase (não dá pra customizar sem SMTP próprio no free tier — pendência nova abaixo). REGRA-015 criada pro Gestor de Infra Arcane não repetir esse erro. Detalhe completo no Mission Log #16.
- 11/08 — @gestor-infra-arcane (techOps): **Achado importante — Karol estava testando `localhost:8995`, não o site publicado** (print mostrava a URL local do QA). Isso explica o bug de "divisão preta e branca" anterior — não era bug real. Mas 2 bugs reais foram achados e corrigidos no processo: (1) scroll quebrado dentro do Roteiro (item de grid com `max-height`/`overflow` que não funcionava sem `min-height:0` — clássico de CSS Grid) impedia alcançar o botão "Marcar aula como concluída"; fix: página rola inteira como uma unidade só, header fixo. (2) Checklist só marcava verde clicando num botão separado — agora o círculo de check é clicável direto na lista (toggle liga/desliga). Detalhe no Mission Log #15 e KB 5.2.
- 11/08 — @gestor-infra-arcane (techOps): **Logo do topbar/login trocada pra versão dark real** (Karol mandou `Logo Incubadora fundo preto-transparente.png`, com transparência de verdade) — tirou o "card branco" que ela achou feio. Reclamação de "divisão preta e branca" no login não foi reproduzida (testado nas mesmas larguras do print dela) — pode ser cache/zoom do lado dela, sinalizado de volta. Detalhe no Mission Log #14.
- 11/08 — @gestor-infra-arcane (techOps): **Capas de produto geradas em SVG** (`js/covers.js`) — substituiu o gradiente flat por arte própria (arcos ecoando os logos, tipografia grande quase invisível, ponto de destaque com glow), densidade crescendo com o preço da oferta. Sem foto real nem API de imagem externa. Detalhe no Mission Log #13 e KB 5.4.
- 11/08 — @gestor-infra-arcane (techOps): **Home ("Início"), logos reais e modo foco adicionados.** Home vira tela padrão (boas-vindas + progresso por trilha + "continuar de onde parei" + Vitrine embaixo, formato "Seus Produtos/Outros Produtos" igual referência da Arka). Logos reais da Incubadora e do Expert360º aplicados (topbar, jornada, cards de produto). Modo foco esconde a coluna do roteiro pra assistir sem distração. Capas dos produtos seguem placeholder (gradiente) — pendente decisão da Karol sobre fotos/design reais. Mesma URL: https://area-de-membros-incubadora.vercel.app. Detalhe no Mission Log #12.
- 11/08 — @gestor-infra-arcane (techOps): **Roteiro redesenhado no formato "Mapa da Jornada"** — Karol mandou print de referência (plataforma Arka/Arcane): timeline vertical com progresso %, checklist que risca ao concluir, clicar na aula abre o conteúdo do lado, letras maiores. App inteiro virou tema escuro. Ao completar a última aula do módulo, o popup de NPS/feedback abre sozinho (antes tinha botão manual "Concluir módulo"). Redeployado, mesma URL: https://area-de-membros-incubadora.vercel.app. Detalhe no Mission Log #11 do Gestor de Infra Arcane.
- 11/08 — @gestor-infra-arcane (techOps): **Fase 1 (layout) V1 no ar** — https://area-de-membros-incubadora.vercel.app. Login por magic link, dashboard com roteiro (2 trilhas), vitrine (7 ofertas reais), standby motivacional, popup de fim de módulo. Validado local (JS syntax + Playwright desktop/mobile, sem erro de console) antes do deploy. Conteúdo de módulo/aula, frases e perguntas do popup são placeholder — Karol entrega aos poucos. Detalhe técnico completo no Mission Log #10 e KB seção 5.2 do Gestor de Infra Arcane.
- 11/08 — @companion: Projeto criado e movido pra ATIVO no cockpit (vaga aberta pela saida do CRM Reativacao de Leads pra Operacoes Continuas). Sequencia definida: layout completo primeiro, depois migracao de conteudo (Expert360º + Mentoria) em paralelo. Escopo fechado em `briefing.md` ao longo da conversa de 11/08 (vitrine com 7 ofertas, checkout unificado Voomp, modulo Encontros Individuais, popup de NPS/prova).
- 11/08 — @gestor-infra-arcane (techOps): Pesquisa confirmando webhook de venda nativo da Voomp — ver Mission Log #9 e KB secao 1.3.

---

## METRICAS (se aplicavel)

| Metrica | Baseline | Meta | Atual |
|---------|----------|------|-------|
| Ofertas com checkout Voomp | 2 (VIP, Sprint) | 7 | 2 |
| Fases concluidas | 0 | 5 | 0 |

---

## RETRO (preencher ao concluir)

1. **Deu o resultado esperado?**
2. **O que funcionou?**
3. **O que faria diferente?**
