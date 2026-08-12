# Briefing — Área de Membros (Incubadora de Expert)

> Documento de trabalho. Projeto ATIVO no cockpit (11/08/2026) — ver [tracker.md](tracker.md) pra execução.
> Nasceu de conversa com o Companion em 11/08/2026.

## Objetivo

Plataforma própria de entrega + vitrine, modelada na experiência da plataforma da Arcane. Unifica o Expert360º (curso) e a mentoria 1:1 (hoje espalhada no Drive de cada aluna) numa casa só — e usa essa unificação como motor de cross-sell: quem tá no curso vê a vitrine da mentoria e se interessa em subir de nível.

## Por que unificado (caminho 1, decidido em 11/08)

- Karol identificou o motivo de negócio: aluno do Expert360º dentro da mesma plataforma vê o "andar de cima" (mentoria) e considera migrar — cross-sell nativo, sem depender de DM/e-mail manual.
- Tecnicamente viável sem migrar pagamento: o checkout do Expert360º pode continuar no Voomp Pay (webhook de vendas confirmado — ver achado do Gestor de Infra Arcane, 11/08) enquanto a liberação de acesso aponta pra plataforma nova em vez da Voomp Play.

## Público / Quem usa o quê

| Quem | Roteiro que vê |
|------|-----------------|
| Alunos Expert360º (R$497) | Roteiro fixo — M0 a M4, 43 aulas (vídeo YouTube não-listado + materiais de apoio) |
| Alunas Mentoria 1:1 (VIP/Grupo/Individual/Sprint) | Roteiro personalizado por fase — reaproveita o Roteiro da Jornada de 12 meses já usado (fundação → validação mês 4-6 → escala) |
| Todos | Vitrine completa do ecossistema (ver abaixo) |

### O que compõe o roteiro da Mentoria (detalhado 11/08)

- **Todas as aulas do Expert360º** (teoria do método) — mesmo conteúdo do curso, reaproveitado
- **Encontros da Incubadora** — hoje já tem automação que sobe pra Hotmart
- **Lives Expert360º** — hoje também já tem automação que sobe pra Hotmart (as duas automações vão precisar redirecionar pra plataforma nova)
- **NOVO módulo — Encontros Individuais** — hoje o 1:1 é só um link de Google Meet dentro do "Roteiro do Expert" no Drive da aluna, sem ficar registrado em lugar nenhum. Vai virar módulo próprio na plataforma: sessão é gravada, e aparece automaticamente no módulo da aluna.
  - **Aprovação é única, no onboarding** (não por sessão) — a aluna consente uma vez que as sessões serão gravadas e publicadas no módulo dela; depois disso, toda gravação nova entra sem fricção.
  - **Automação:** reaproveita a mesma automação que já sobe Encontros da Incubadora e Lives Expert360º pra Hotmart (não precisa criar nova). Só precisa de convenção de nome pra automação achar e rotear certo dentro da pasta de gravações do Google Meet:
    - **Padrão CONFIRMADO (11/08):** `Individual - {slug-da-aluna} - {AAAA-MM-DD}` (slug igual ao já usado em `mentoria/alunas/{slug}/` — ex: `milena-gehrke`, `analia-arguello`) — nome da reunião/gravação no Google Meet segue esse padrão daqui pra frente.

## Vitrine — TODAS as ofertas, não só curso e mentoria

Decisão de 11/08: a vitrine mostra o ecossistema inteiro, não só "próximo nível" óbvio. As 7 ofertas já têm página de vendas pronta (`vendas-incubadora.vercel.app`):

| Oferta | Preço | Página |
|--------|-------|--------|
| Diagnóstico Ferramentas | R$97 | /diagnostico-ferramentas/ |
| Expert360º (curso) | R$497 | /expert360/ |
| Método Express | R$300 | /metodo-express/ |
| Método VIP | R$1.500 | /metodo-vip/ |
| Sprint do Método | R$3.000 | /sprint-do-metodo/ |
| Grupo | R$5.000/12m | /grupo/ |
| Individual | R$10.000/12m | /individual/ |

Cada card da vitrine aponta pra página de vendas correspondente. Cada aluno vê a oferta que já tem marcada (acesso liberado) e as que ainda não tem como "próximo passo".

## Telas / Estrutura

1. **Login/Dashboard** — saudação, progresso atual, próxima ação
2. **Roteiro do Aluno** — lista clicável de módulos/fases → clica, aparece a aula (vídeo embed) + materiais daquela etapa
3. **Vitrine** — grid das 7 ofertas (ver acima)
4. **Standby** — após X minutos de inatividade, troca a tela por frase motivacional (no lugar dos versículos bíblicos que a Arcane usa)
5. **Popup de fim de módulo** — não é só lembrete. Vira ponto de coleta: 2-3 perguntas por módulo pra medir NPS e transformação do aluno, mais um espaço pra coletar feedback/depoimento ou prova do método (reaproveitável como prova racional em vendas/lives — mesmo uso que os prints da Anália e outras já servem hoje). Perguntas exatas ainda não definidas (Karol vai pensar) — quando for a hora, ajudo a desenhar

## Identidade Visual

Reaproveita a IV já validada nas páginas de venda: preto `#0B0B0C`, laranja `#FF6B1A`, fonte Sora.

## Proposta técnica (Gestor de Infra Arcane, 11/08)

- **Checkout unificado na Voomp Pay pra TODAS as 7 ofertas** (decisão de 11/08 — ver log-decisoes). Karol já criou checkout lá pro Método VIP e Sprint do Método; vai criar pros demais, incluindo Diagnóstico Ferramentas. Um único webhook de venda (produto → Entregas → evento Vendas/Assinatura/Checkout) libera acesso em qualquer produto — nenhuma oferta precisa mais de fluxo manual de liberação. Payload real do webhook ainda não testado (gap conhecido).
- **Vídeo:** continua no YouTube não-listado, sem re-hospedagem — a plataforma só embeda.
- **Banco:** Supabase, reaproveitando `pessoas`/`capturas`/`compras` + tabela nova de matrícula/progresso por produto.
- **Deploy:** Vercel (mesmo padrão das LPs já publicadas).
- **Pendência decorrente:** as 7 páginas de vendas em `vendas-incubadora.vercel.app` têm CTAs desatualizados (Método Express/Diagnóstico → WhatsApp; Grupo/Individual → Hotmart) — precisam apontar pro checkout Voomp assim que Karol passar os links. Rotear pro Gestor de Infra Arcane quando os links estiverem prontos.
- **Automações a redirecionar:** hoje "Encontros da Incubadora" e "Lives Expert360º" já sobem automaticamente pra Hotmart — essas automações vão precisar apontar pra plataforma nova em vez da Hotmart.

## Perguntas em aberto (precisam de decisão da Karol antes de fechar o escopo)

1. **Perguntas exatas do popup de fim de módulo** (NPS/transformação/prova) — Karol ainda não pensou no conteúdo. Ajudo a desenhar quando ela quiser.
2. **Frases motivacionais do standby** — já existe um banco, ou puxo da sua metodologia/tese pra montar?
3. **Quem executa a Fase 1 (layout/plataforma)** — candidato natural é o Gestor de Infra Arcane (já construiu as 7 páginas de venda + já tem contexto técnico do projeto), mas é escopo maior que uma LP estática. Confirmar antes de rotear.

## Decisões já fechadas

- **11/08** — Plataforma unificada (curso + mentoria), não separada. Motivo: cross-sell nativo via vitrine.
- **11/08** — Vitrine mostra as 7 ofertas do ecossistema, não só curso/mentoria.
- **11/08** — Checkout unificado: todas as 7 ofertas migram pra Voomp Pay (Karol já criou VIP e Sprint; vai criar os demais, incluindo o Diagnóstico de R$97).
- **11/08** — Mentoria ganha módulo novo "Encontros Individuais" — sessões 1:1 gravadas, entram automaticamente no módulo. Aprovação da aluna é única (onboarding), não por sessão. Reaproveita a automação já existente (mesma que sobe Encontros da Incubadora/Lives pra Hotmart), só precisa de convenção de nome pra rotear certo.
- **11/08** — Popup de fim de módulo vira coleta estruturada: 2-3 perguntas de NPS/transformação + espaço pra feedback/prova do método (não é só lembrete).
- **11/08** — Padrão de nome das gravações de Encontros Individuais: `Individual - {slug-da-aluna} - {AAAA-MM-DD}` (mesmo slug de `mentoria/alunas/`).
- **11/08** — Projeto vira ATIVO no cockpit (vaga aberta pela saída do CRM pra Operações Contínuas).
- **11/08** — Sequência de execução: constrói o layout/estrutura da plataforma inteiro primeiro (Fase 1); migração de conteúdo (Expert360º + Mentoria) roda em paralelo depois — não é uma coisa de cada vez.
