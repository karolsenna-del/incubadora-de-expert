# Log de Decisoes

> Decisoes importantes registradas com racional e contexto. Append-only.

<!-- Formato:
## [DATA] — [TITULO DA DECISAO]
**Contexto:** [o que estava acontecendo]
**Decisao:** [o que foi decidido]
**Racional:** [por que]
**Impacto:** [o que muda]
-->

## 19/08/2026 — Link bio do Instagram reestruturado: vitrine de 7 ofertas entra como 3ª posição, não como funil principal

**Contexto:** No Squad Posicionamento Arcane, Karol propôs trocar o link bio atual (grupo de leads + diagnóstico gratuito + suporte "fale com a Karol") por um único link pra uma página com as 7 ofertas à venda, mais os links de grupo e diagnóstico. O @vitrine-strategist confrontou: página com 7 ofertas como primeiro link vira "cardápio" e gera paralisia de escolha — quebra a regra de ouro do link bio (primeiro link = funil principal único).

**Decisão:** Nova estrutura do link bio do Instagram: 1) Diagnóstico gratuito (funil principal da mentoria) — continua primeiro; 2) Grupo de leads gratuito — segunda porta pra quem não tá pronto pra call; 3) Página vitrine com as 7 ofertas (a mesma vitrine já decidida em 11/08/2026 pra área de membros) — como opção de explorar pra quem já confia e quer escolher sozinho, não como porta de entrada; 4) "Fale com a Karol" sai do link bio — vai pra um destaque de Contato ou fica só em DM.

**Racional:** Objetivo atual do Instagram é SALES/DM (vender a mentoria via diagnóstico), então o primeiro clique precisa levar a UM destino óbvio. Cardápio de 7 produtos não serve como porta de entrada — serve como camada extra pra quem já está mais próximo. Suporte não deveria competir por espaço no link bio comercial.

**Impacto:** Karol vai construir a página vitrine (mesma vitrine da decisão de 11/08) e adicionar no Linktree na posição 3. "Fale com a Karol" precisa ser realocado pra um destaque de Contato.

## 14/08/2026 — Área de membros vira entrega da Individual (fase de escala) + manutenção recorrente pós-mentoria

**Contexto:** Ao pensar em dar "cara de produto" ao Sprint do Método — que hoje entrega os 5Ps + roteiros de validação via pasta de Drive replicada por aluno + encontros por Zoom/Meet, sem nenhuma plataforma — Karol cogitou incluir uma área de membros clonada da própria (adaptada com a identidade visual do cliente, inicialmente só com a trilha Mentoria). Ao olhar o esforço real de construção da própria Área de Membros (dezenas de missões no tracker), ficou claro que replicar isso a cada venda do Sprint (R$3.000/5 semanas) não escala sem um "motor" replicável pronto pra spin-up rápido — que Karol decidiu não construir agora, preferindo deixar a própria estrutura amadurecer com uso e ajustes reais antes de generalizar pra outros clientes.

**Decisão:** Área de membros (site próprio do aluno, identidade visual adaptada, inicialmente só trilha Mentoria) passa a ser entrega da **Mentoria Individual (R$10.000/12 meses)**, dentro da fase de escala (mês 7-12) — como extensão do que já estava prometido ali (página/LP, funil de automação, configuração de tráfego — decisão de 31/07). Não entra no Sprint do Método por enquanto. Abre também a possibilidade de **manutenção recorrente paga após o fim dos 12 meses**, pra quem quiser manter o site rodando e atualizado — escopo exato dessa recorrência (ilimitado vs. pacote fechado de ajustes/mês) ainda não foi fechado.

**Racional:** R$10K/12 meses tem margem e prazo pra absorver construção sob medida (sem motor replicável pronto) — o que R$3.000/5 semanas do Sprint não tem. A Individual já promete infra nessa fase (página/LP/funil/tráfego), então área de membros formaliza/estende esse item em vez de criar escopo novo do zero. Motor replicável fica pra depois — pavimenta primeiro (Karol usa e ajusta a própria estrutura antes de generalizar pra outros clientes).

**Impacto:** Roteiro da Individual (fase de escala, mês 7-12) precisa refletir área de membros como parte do item de infra já existente. `docs/knowledge/expert-business/produto/ecossistema-ofertas-jul2026.md` deve registrar essa entrega + a linha de manutenção recorrente pós-mentoria (receita nova, escopo do pacote em aberto). Sprint do Método segue como está (persona/promessa/processo/proposta/agente do método + roteiros de validação, entrega via Drive/Zoom) — sem área de membros por ora. Motor replicável (template genérico pra spin-up rápido por cliente) fica como ideia futura, condicionada à maturidade da própria Área de Membros da Karol.

## 11/08/2026 — Checkout unificado na Voomp pra todas as 7 ofertas

**Contexto:** Ao desenhar a vitrine da área de membros (mostrando as 7 ofertas do ecossistema), Karol decidiu unificar o checkout. Ela já tinha criado checkout na Voomp pro Método VIP e pro Sprint do Método (que antes fechavam por Hotmart/conversa) e vai criar pros demais, incluindo o Diagnóstico Ferramentas (R$97).

**Decisão:** Todas as 7 ofertas (Diagnóstico Ferramentas, Expert360º, Método Express, Método VIP, Sprint do Método, Grupo, Individual) passam a ter checkout na Voomp Pay — não mais mix de Hotmart + WhatsApp manual.

**Racional:** Coerência com a vitrine unificada da área de membros — checkout espalhado em plataformas diferentes complicaria tanto a experiência de compra quanto a automação de liberação de acesso (um único webhook de venda, já confirmado que a Voomp tem, libera acesso em qualquer produto, sem precisar de fluxo manual pros que fechavam só por conversa).

**Impacto:** As 7 páginas de vendas (`vendas-incubadora.vercel.app`) precisam ter os CTAs atualizados pra apontar pro checkout Voomp de cada oferta — hoje Método Express e Diagnóstico Ferramentas apontam pro WhatsApp, Grupo e Individual apontavam pro Hotmart. Fica pendente pro Gestor de Infra Arcane assim que a Karol passar os links Voomp de cada oferta (Fase 5 do tracker `crm-reativacao-leads` precisa ser reaberta pra essa troca).

## 11/08/2026 — Karol assume a operação de vendas do CRM pessoalmente, closer pausado

**Contexto:** CRM Reativação de Leads (150 leads, planilha + arsenal de vendas) foi construído pra um closer contratado trabalhar (Fase 5 — Ativação com o comercial). Karol conversou com o Clone Euriler sobre a situação financeira atual: precisa de dinheiro, sem receita recorrente, sem previsibilidade nenhuma no momento.

**Decisão:** Por orientação do Clone Euriler, Karol assume a reativação de leads pessoalmente (usando a planilha/CRM/arsenal já prontos) em vez de delegar pro closer, até a venda virar processo validado e repetível.

**Racional:** Sem receita recorrente, delegar pra quem ainda não validou o processo é risco maior que o ganho de tempo. Bate com a premissa "pavimenta primeiro" — quem faz sabe cobrar qualidade depois de delegar. Karol reativando ela mesma valida oferta e script na prática antes de repassar.

**Impacto:** CRM Reativação de Leads sai de ATIVOS e vira Operação Contínua no cockpit — a ferramenta já está pronta e permanente, o que muda é quem opera. Closer fica pausado por ora (não descartado — retoma quando o processo estiver validado). O `arsenal-vendas-closer.md` passa a ser o script de trabalho da própria Karol nesse meio tempo.

## 09/08/2026 — Garantia das 7 ofertas alinhada ao contrato (após venda revelar inconsistência)

**Contexto:** Karol vendeu o Sprint do Método e ficou em dúvida se "30 dias de garantia" — texto que estava nas páginas de venda — tinha sido uma decisão dela. Checagem mostrou que não havia registro dessa decisão, e pior: o contrato real (Termos Gerais, Cláusula 9) só cobre 7 dias corridos de arrependimento (art. 49 CDC) antes do serviço começar, mais reembolso proporcional às etapas não entregues (menos 20% de custo administrativo) depois disso — divergente do que a página prometia. Risco de publicidade enganosa (CDC art. 37) em 4 páginas ainda não vendidas (VIP, Grupo, Individual, além do Sprint já vendido).

**Decisão:** Sprint, VIP, Grupo e Individual (as 4 ofertas de "Prestação de Serviço", que usam a Cláusula 9 dos Termos Gerais) passam a anunciar "7 dias de garantia incondicional" + explicação do reembolso proporcional no FAQ. Expert360 fica de fora dessa correção — é produto digital self-paced, contrato próprio de "Termo de Compra" (não Prestação de Serviço) — Karol decidiu manter os 30 dias ali, e o contrato do Expert360 recebeu cláusula nova (5.2) garantindo isso explicitamente, já que antes só tinha o mínimo legal de 7 dias.

**Racional:** A copy precisa refletir o que o contrato realmente garante — prometer mais do que o contrato cobre expõe a Karol legalmente (e o Sprint já tinha sido vendido com a promessa errada). Pra quem já comprou o Sprint sob a promessa de 30 dias, a orientação foi honrar os 30 dias prometidos na venda (o que a cliente viu antes de comprar prevalece), mesmo com a página já corrigida daqui pra frente.

**Impacto:** 4 páginas de vendas corrigidas + contrato do Expert360 atualizado. Fica em aberto: revisão de advogado nos 9 contratos (pendência já conhecida, não é bloqueio) e reexportar o PDF do Expert360 via Playwright (só o `.md`/HTML foram atualizados até agora).

## 06/08/2026 — Desafio 10 Dias (Ciclo 2) encerrado sem resultado

**Contexto:** Weekly review. Ciclo 2 do Desafio 10 Dias (ativação do algoritmo via ebook ReelsPro, batelada de posts 21-28/07) chegou ao fim.

**Decisão:** Karol encerrou o desafio: "não resultou em nada, nenhum formato validado, nenhum conteúdo garanhão". Substituído no cockpit pelo Desafio Rota100k (guia externo da mentoria "Se Posicione", iniciado 05/08).

**Racional:** Nenhum framework testado gerou sinal validado. Esse é o 5º ciclo de conteúdo de negócio sem engajamento consistente (mesma questão em aberto desde a Reanálise do Ciclo 1 em 20/07 — ver decisão daquela data). A causa raiz continua indefinida entre duas hipóteses: falta de audiência de base (visão da Karol) vs. falta de consistência/sinal de conta (suspeita da Aria/Sage). Nenhum dos dois é descartável só com este resultado.

**Impacto:** Cockpit atualizado (ARQUIVO). Se o Desafio Rota100k também não validar formato até o fim da Semana 01-02, vale parar e investigar a causa raiz diretamente (auditoria de conta/sinal) em vez de testar mais um framework de conteúdo.

## 01/08/2026 — Correção de promessa: validar em até 4 meses, não 12

**Contexto:** Ao revisar a página de vendas do Grupo (construída pelo Quill/Squad LPago Arcane), Karol identificou que a headline prometia "12 meses até a primeira venda" — mas o roteiro da jornada (fundação → processo autoral → validação nos meses 4-6) permite validar/fazer as primeiras vendas já a partir do mês 4. Prometer o total de acesso (12 meses) como se fosse o prazo até o resultado é uma promessa mais fraca do que a real.

**Decisão:** Headline, CTA e FAQ das páginas de Grupo e Individual passam a prometer "primeiras vendas em até 4 meses", com "12 meses de acesso" reposicionado como o tempo pra completar a jornada até posicionamento/escala — não como a promessa principal. Confirmado que a correção vale pras duas ofertas (mesmo roteiro de jornada: fundação → validação no mês 4-6 → escala).

**Racional:** RC-005 do Método LP (Squad LPago Arcane) — a primeira dobra deve prometer o resultado mais forte, não o programa inteiro. "4 meses até vender" é objetivamente mais forte que "12 meses até vender", mesmo sendo o mesmo produto — só estava prometendo a métrica errada.

**Impacto:** `business/campanhas/crm-reativacao-leads/paginas-vendas/grupo-briefing-copy.md` e `individual-briefing-copy.md` corrigidos (headline, cards de entrega, FAQ, CTA final). `00-documento-mestre-ofertas.md` atualizado com nota de promessa de tempo pras duas ofertas — vale como padrão pra qualquer página futura com o mesmo roteiro de jornada.

## 01/08/2026 — Escopo das páginas de venda pro closer: 7 páginas, uma por oferta

**Contexto:** O item pendente "links de pagamento" da Fase 5 do CRM Reativação de Leads foi repensado — Karol fecha a maioria das ofertas no pix direto na conversa (Método Express, VIP, Sprint do Método, Diagnóstico Ferramentas), então o que a Closer precisa não é checkout automatizado, é uma página estruturada pra mandar quando o lead quer saber mais antes de decidir. Grupo, Individual e Expert360º fecham por outro caminho (não pix), mas não têm material de vendas atualizado — o PDF antigo está desatualizado (ver decisão de repaginação do ecossistema, 31/07).

**Decisão:** Construir 7 páginas de vendas, uma por oferta (não um cardápio único) — página por oferta evita confundir o lead na hora de fechar, já que a Closer conduz a conversa pra uma oferta específica antes de mandar o link. Escopo: Método Express, Método VIP, Sprint do Método, Grupo, Individual, Expert360º, Diagnóstico Ferramentas.

**Racional:** Página única por oferta reforça a oferta que a Closer já escolheu na ligação, em vez de abrir múltiplas opções que geram indecisão. A Incubadora já tem página de captação (diagnóstico/sessão estratégica, topo de funil) — essas 7 são páginas de fechamento, função diferente.

**Impacto:** `crm-reativacao-leads/tracker.md` (Fase 5) e `arsenal-vendas-closer.md` atualizados com o escopo. Pendente: rotear construção pro Squad LPago Arcane (reaproveita padrão das LPs de diagnóstico e mini treinamento já feitas).

## 01/08/2026 — "Faço por Você" renomeado pra "Sprint do Método"

**Contexto:** Ao planejar as páginas de venda pro closer (CRM Reativação de Leads, Fase 5), o nome "Faço por Você" ficou em pauta — genérico, linguagem de agência ("eu crio seu site pra você"), sem ligação com a tese da Incubadora e sem diferenciar de um pacote pronto/template, o que contradiz o próprio diferencial do produto (a fundação é do aluno, construída com o método dele, só que em ritmo acelerado).

**Decisão:** Renomear "Faço por Você" para **"Sprint do Método"**. Mantém o padrão de nomenclatura funcional dos outros produtos (Método Express, Método VIP) e evita a armadilha de soar "pronto/genérico".

**Racional:** Companion sugeriu 4 opções (Fundação Expressa, Sprint do Método, Método em 5 Semanas, Fundação Guiada) — Karol escolheu "Sprint do Método" por capturar o formato intensivo/construído-junto sem contradizer a tese.

**Impacto:** Renomeado em `docs/knowledge/expert-business/produto/ecossistema-ofertas-jul2026.md` e `business/campanhas/crm-reativacao-leads/arsenal-vendas-closer.md` (todas as ocorrências, incluindo abreviação FPV → Sprint).

## 31/07/2026 — Entregáveis do Faço por Você, Individual e Grupo fechados

**Contexto:** Depois de travar preços do ecossistema de ofertas (ver decisão "Repaginação do ecossistema de ofertas" abaixo, mesma data), faltava definir o que cada oferta entrega de fato — principalmente Individual (pedido original da Karol: mais coisas prontas, já que é 1:1) e Grupo (versão sem presença dela, via IA).

**Decisão:**
- **Faço por Você** — 5 semanas com entregável fixo por semana: imersão → persona+promessa → processo+ferramentas → proposta+roteiros de validação → agente de IA do método + handoff.
- **Individual** — entregáveis novos amarrados às fases já existentes do Roteiro de 12 meses (decisão 03/07): fundação personalizada (mês 1-3), roteiros reais de validação (mês 4-6), e na fase de escala (mês 7-12) — além do agente do método — também página/LP, funil de automação e configuração de tráfego, usando os squads que a Karol já tem prontos (Squad LPago Arcane, Gestor de Infra Arcane, Tráfego Arcane).
- **Grupo** — acesso aos 6 agentes do método por P (persona, promessa, processo, portfólio, proposta, autoridade) + 2 agentes novos a construir: Agente de Roteiro de Validação (prioridade alta — é o diferencial central de Vendas Secretas) e Agente de Feedback de Portfólio, um "Clone Karol" com escopo restrito (só avalia fundação com o critério dela, não é um clone completo).

**Racional:** No processo, descobrimos que o tracker do Expert360º estava desatualizado — os 6 agentes por P já existem (Custom GPTs, atendendo alunas do Expert360 há meses, ver `mentoria/alunas/{aluna}/0- Biblioteca de IAs.md`), mas a Fase 3 do tracker (`business/campanhas/expert360-curso/tracker.md`) seguia marcada "Não iniciado". Isso significa que o item 1 do Grupo já é entregável hoje, sem trabalho novo — só os 2 agentes extras (roteiro de validação, feedback) ainda precisam ser construídos antes de prometer pro aluno. O agente do método na Individual só entra na fase de escala (mês 7-12), depois de validado com vendas reais — construir antes seria prematuro, o método ainda pode mudar durante a validação.

**Impacto:** `docs/knowledge/expert-business/produto/ecossistema-ofertas-jul2026.md` e `business/campanhas/crm-reativacao-leads/arsenal-vendas-closer.md` atualizados com os entregáveis. Tracker do Expert360 corrigido (Fase 3 = Done, métrica de agentes = 6/6). Pendente: construir Agente de Roteiro de Validação (via Worker Forge/Mind Forge) e Agente de Feedback de Portfólio (via Clone Forge, escopo restrito) antes de vender essa parte do Grupo.

## 31/07/2026 — Repaginação do ecossistema de ofertas da Incubadora de Expert

**Contexto:** Karol foi criar o arsenal de vendas pro closer (CRM Reativação de Leads) e percebeu que a oferta documentada (PDF "Incubadora de Expert: Crie seu método com clareza e segurança") estava desatualizada e sub-aproveitando a capacidade de entrega atual via Auroq/Claude Code — principalmente na Mentoria Individual, onde dá pra personalizar ferramentas, roteiros e até criar um agente de IA do método de cada aluno durante o 1:1, ao invés de entregar bônus genéricos. Na conversa também vieram à tona 3 serviços que ela já vende ou testou fora do repo (Método Express, Método VIP, Faço por Você/diagnóstico de ferramentas) e que nunca tinham sido consolidados com o resto do ecossistema.

**Decisão:** Novo ecossistema de produtos, organizado em 2 eixos (VENDER vs. MANTER/ESCALAR) com preços travados:

*Eixo 1 — Ajudar a criar método e vender (do zero até a primeira venda):*
| Produto | Duração | Preço | Pra quem |
|---|---|---|---|
| Expert360º (curso) | Self-paced | R$497 (funil) / R$697 (plataforma) | Tem tempo, orçamento baixo, quer estudar sozinha |
| Método Express | 1 encontro (1h) | R$300 | Trava pontual num dos 5Ps. **Nunca vendido — precisa testar antes de tratar como validado** |
| Método VIP | 3 encontros | R$1.500 (3x R$500 pix) | Quer fazer ela mesma, precisa de direção/ajuste (na prática costuma virar trabalho de posicionamento/conteúdo) |
| Faço por Você | 5 semanas | R$3.000 | Travada por falta de tempo **e** clareza ao mesmo tempo — já tentou e não conseguiu, ou não sabe nada de marketing/ferramentas. Entrega fundação pronta (persona+promessa+processo+proposta+agente do método), sem validação. Depende da agenda dela abrir |
| → Continuação Grupo (pós-FPV) | 6 meses | R$2.000 | Só valida+posiciona+escala — fundação já feita. Total FPV+continuação = R$5.000, igual ao Grupo do zero |
| → Continuação Individual (pós-FPV) | 6 meses | R$5.000 | Total FPV+continuação = R$8.000 — R$2.000 mais barato que a Individual do zero, como recompensa por já ter validado o caminho |
| Grupo (do zero) | 12 meses (única duração agora — 6 meses não dá tempo de validar+posicionar) | R$5.000 | Quer jornada completa com validação, topa atenção dividida |
| Individual (do zero) | 12 meses | R$10.000 | Mantido — produto mais caro, mais garantido em agenda |

*Eixo 2 — Ajudar a manter/escalar (produto já rodando, dor é o aluno terminar/engajar, não vender):*
| Produto | Formato | Preço |
|---|---|---|
| Diagnóstico Ferramentas | Questionário + reunião → proposta de 15-20 ferramentas, orçamento à parte pra construir | R$97 (vira cashback se contratar a construção) |

**Racional:** A Individual (12 meses) e o Grupo (5.000-7.500) estavam sem nada entre eles e o VIP (1.500) — buraco grande de preço que fazia o Grupo parecer caro sem ter pra que comparar. O Faço por Você preenche esse buraco com um produto rápido (5 semanas) e 100% personalizado — o mesmo aproveitamento de Auroq que motivou repensar os bônus da Individual, só que empacotado como oferta própria. A continuação (pós-FPV) reaproveita o Grupo/Individual como destino em vez de criar produto novo, e o desconto na Individual (R$2.000) funciona como incentivo real pra passar pelo FPV primeiro — fecha mais rápido, ela prova valor antes de pedir R$10k, e quem chega na Individual por esse caminho já é lead mais qualificado. O Diagnóstico Ferramentas não compete com nada disso — ataca a segunda grande dor do expert (fazer o aluno terminar o método, não vender), pra quem já tem produto rodando; inclusive pode ser oferecido pros leads do CRM já marcados como `aluno_ativo` (compraram o Combo Incubadora), que não são alvo de reativação pra uma mentoria nova.

**Impacto:** Vira fonte oficial em `docs/knowledge/expert-business/produto/ecossistema-ofertas-jul2026.md` (substitui a análise de precificação de maio como referência de preço atual). Arsenal de vendas do closer (CRM Reativação de Leads, Fase 5) construído em cima dessa tabela. Pendente: Método Express precisa ser testado com lead real antes de entrar como oferta validada; links de pagamento/checkout de cada produto ainda não estão documentados no sistema.

## 28/07/2026 — Contratação de comercial/closer + CRM de reativação de leads

**Contexto:** Karol identificou que perde vendas porque nunca faz follow-up de quem fez sessão estratégica (diagnóstico) e não fechou. Contratou um comercial/closer pra assumir essa reativação.

**Decisão:** Abrir um projeto (CRM Reativação de Leads) pra dar ferramenta de trabalho ao closer: expandir o banco unificado do Bootstrap 3 (Supabase: pessoas/capturas/compras) com status de lead, histórico de follow-up e resumo automático gerado por IA a partir do diagnóstico. Três fontes de lead: sessão estratégica (Google Forms), compradores de outros produtos (Hotmart — ex. workshop Destrave seu curso online, ainda não importado), e grupo fechado do WhatsApp (números, sem nome ainda). Interface operacional: planilha (Google Sheets) com colunas divididas em "zona do robô" (sync automático do Supabase) e "zona do closer" (status/observação/follow-up, só ele escreve).

**Racional:** O gargalo real não era falta de leads — era falta de acompanhamento. Ferramenta em planilha (não Supabase direto) porque o closer não é técnico. Separação robô/closer evita que o sync automático sobrescreva o que o closer acabou de registrar — causa comum de CRM em planilha virar bagunça. Reuso do banco do Bootstrap 3 em vez de criar do zero (Fase 1 já entregou pessoas/capturas/compras com RLS).

**Impacto:** Projeto criado no cockpit (`business/campanhas/crm-reativacao-leads/tracker.md`). Próximo passo: handoff pro Dara (data-engineer) desenhar o schema expandido. Compras históricas da Hotmart e lista de participantes do grupo WhatsApp são importações/investigações separadas, ainda não resolvidas.

## 20/07/2026 — Reanálise completa do Ciclo 1 (Desafio 10 Dias): gargalo é interação, não alcance nem volume

**Contexto:** Karol sentia o perfil "travado" mesmo com o Desafio 10 Dias rodando. Reanálise da Aria com dado automatizado completo (27 posts, não mais prints seletivos) mostrou que NENHUM post cruzou o threshold de 10% de Interação/View do Método Audience — 8 de 27 tiveram zero interação. Padrão: posts de "afirmação genérica" (tom consultoria) zeram; posts com confronto de crença + história pessoal performam melhor (ainda abaixo do threshold, mas melhor).

**Decisão:** (1) Cortar o formato "afirmação genérica" dos próximos roteiros. (2) Testar CTA de reconhecimento específico em vez de "comenta X" solto. (3) Manter o volume alto de postagem — NÃO reduzir.

**Racional:** Hipótese inicial da Aria era que o volume alto (4-6 posts/dia) dividia a atenção da mesma audiência entre os posts. Karol contestou: a maioria das views vem de não-seguidores (confirmado 87,7% no post "domingo à noite", 18/07) — cada post é descoberto por gente nova, não compete pela mesma base fixa. Reduzir volume não resolveria o gargalo real (interação), só reduziria as chances de achar o padrão que converte.

**Impacto:** Próximo roteiro do Ciclo 2 (Rico) parte desse padrão: sem afirmação genérica, CTA de reconhecimento específico, volume mantido. Relatório completo: `docs/producao-conteudo/karol/analises/2026-07-20/relatorio-batch-completo.md`.

## 13/07/2026 — Hospedagem dos vídeos do Expert360: YouTube não listado + Voomp Tube

**Contexto:** Ao iniciar o upload das aulas na Voomp Play, descobrimos que o plano atual não hospeda vídeo de curso: upload direto limitado a 80 MB por arquivo e 3 GB de biblioteca — os vídeos do Expert360 têm 219-864 MB cada (~6,8 GB já gravados, curso completo deve passar de 15 GB).

**Decisão:** Hospedar os vídeos no YouTube como "não listado" e embedar nas aulas via Voomp Tube (player customizado da Voomp por cima do YouTube).

**Racional:** Custo zero, Karol já usa YouTube (VSL da LP), links não listados não aparecem em busca nem no canal (risco de vazamento baixo, prática comum em cursos). Alternativas pagas (Vimeo ~R$100+/mês, Cloudflare Stream ~US$5-10/mês) não se justificam agora. Upload em lote pelo YouTube Studio é rápido e o restante (link → aula certa + título + descrição + thumb na Voomp) é 100% automatizável.

**Impacto:** Fluxo de publicação do curso vira: Karol sobe vídeos em lote no YouTube Studio (não listado) → course-publisher mapeia cada link à aula na Voomp via automação. O voomp-publisher.py será adaptado desse novo fluxo (sem upload de arquivo).

## 03/07/2026 — Rebalancear o Roteiro da Jornada: acelerar fases iniciais, mais tempo pra proposta/validação/posicionamento

**Contexto:** Na prática com a Milena, M0 e P1 (Persona Compradora) fecharam em sequência acelerada — as fases iniciais são conduzidas pelos agentes de IA com a aluna e andam muito mais rápido do que o roteiro de 12 meses previa (5 meses pra M0-M2). Já a parte que realmente demora é a criação e validação do produto no campo.

**Decisão (cronograma validado pela Karol em 03/07):**
- Mês 1: M0 + M1 (desbloqueio + persona + promessa)
- Meses 2-3: M2 + campo (processo autoral + portfólio + 3+ leads)
- Meses 4-6: M3 + campo (proposta + 10+ conversas + validar 3x)
- Meses 7-12: M4 + escala (autoridade, frase-tese, presença, conteúdo, escala)

**Racional:** O gargalo real da jornada não é conceitual — é ir a campo, vender, validar 3x e construir posicionamento. O roteiro antigo superestimava o tempo da fundação (5 meses pra M0-M2) e subestimava o tempo de validação. A experiência real com aluna (Milena) é a evidência.

**Impacto:** Aplicado em 03/07 no template (`mentoria/alunas/_template/0.1- Roteiro da Jornada.md`) e replicado pros 5 alunos ativos (Milena, Analia, Helio, Ricardo, Rodrigo). Milena já segue o ritmo novo: P1 fechada 03/07, P2 fecha na semana de 06-10/07 — dentro do Mês 1.

## 01/07/2026 — Migração de plataforma: Hotmart bloqueou → curso migrado pra Voomp Play

**Contexto:** Expert360º estava planejado pra rodar na Hotmart (estrutura, questionário de pré-diagnóstico, agente de suporte nativo). Hotmart bloqueou o acesso/uso pretendido.

**Decisão:** Migrar o curso pra Voomp Play. O worker `course-publisher` (`agents/course-publisher/`) já estruturou os 5 módulos + Módulo de Orientações com as 43 aulas na nova plataforma (config.yaml).

**Racional:** Sem alternativa viável na Hotmart, Voomp Play oferece a estrutura equivalente (módulos, aulas, agente de suporte nativo) sem o bloqueio.

**Impacto:** PRD atualizado pra v1.4 refletindo a mudança. Itens do checklist de produção que citavam Hotmart (H01-H09) atualizados pra Voomp — parte já concluída (estrutura dos módulos), parte pendente (upload de vídeos, vínculo de materiais, questionário de pré-diagnóstico equivalente na Voomp).

## 15/06/2026 — Criar especialista "Expert em Lives" para roteiros de live semanal

**Contexto:** Karol faz lives semanais pro grupo fechado (Google Meet) hoje sem agente especializado — produzidas no "Claude normal", cada sessão do zero. Testamos um outline em tópicos pra Live 19, adaptando o modelo "Funil de Zoom" (Conversão Imediata) do ETL Vinizoom: Narrativa → Execução (com spoiler do pitch) → Prática (reusa o exercício "Lista de Fracassos" do M0) → Prova Racional + Pitch Estendido.

**Decisão:** Criar um Worker "Expert em Lives", especializado em roteiros de live semanal no modelo Funil de Zoom, usando o outline da Live 19 como seed/referência.

**Racional:** Lives semanais são operação contínua e recorrente — repertório hoje não persiste entre sessões. O teste da Live 19 validou o formato tópicos + Funil de Zoom; precisa virar competência fixa no sistema (REUSE > recriar do zero a cada semana).

**Impacto:** Próximo passo: ativar `/worker-forge` pra criar o Expert em Lives, com `business/campanhas/lives-semanais/live-19-outline.md` como referência inicial.

## 28/05/2026 — "Expert em fracassar no digital" como pilar de posicionamento

**Contexto:** Weekly review. Gancho levantado em 11/05 foi revisitado e elevado de ideia de conteudo para decisao de posicionamento.

**Decisao:** Nao e so angulo de conteudo — e pilar central de posicionamento. O metodo da Karol nasceu dos seus fracassos. A autoridade nao vem dos acertos — vem de ter falhado, entendido o porque, e transformado em metodo.

**Racional:** Conecta diretamente a tese ("Diploma e o que voce estudou. Metodo e o que voce viveu."), ao M0 do Expert360 ("Fracasso como Prova"), e a ferida→medicina do diagnostico de proposito (13 anos servico publico + 8 fracassos). A maioria dos players fala de sucesso. Karol fala de autoridade construida na derrota — diferencial raro.

**Impacto:** Usar "expert em fracassar no digital" como angulo estruturante do posicionamento no Instagram. Permeia bio, conteudo e abertura dos modulos do curso.

## 14/05/2026 — Persona compradora vs persona de propósito: manter "sem lançamentos" na promessa

**Contexto:** Durante o preenchimento da ferramenta de posicionamento, surgiu dúvida sobre manter "sem lançamentos" na promessa principal. A questão era se a persona conhece o termo — já que o propósito da Karol é libertar CLTs e servidores públicos que ainda não entraram no digital.

**Decisão:** Manter "sem lançamentos" na promessa da oferta. Calibrar a promessa para a persona compradora de hoje (Laura 2 — já tentou, estudou Fórmula de Lançamento, conhece o mercado). A persona de propósito (Laura 1 — CLT, servidor público, ainda não começou) é o movimento de longo prazo, construído via conteúdo e tese.

**Racional:** Quem compra hoje é Laura 2. "Sem lançamentos" fala diretamente com ela — é alívio imediato, diferenciação clara do mercado. Laura 1 chega pelo conteúdo ao longo do tempo, não pela promessa da oferta. As duas coexistem: Laura 2 financia enquanto Laura 1 chega.

**Impacto:** Promessa da oferta calibrada para Laura 2. Conteúdo e tese continuam falando com o movimento maior (Laura 1). Não misturar os dois na mesma comunicação.

## 19/05/2026 — Precificação do curso Expert360º

**Contexto:** Durante o módulo de criação de produtos da Arcane, surgiu a dúvida sobre incluir os agentes de IA no curso online ou entregar só teoria + templates. A percepção era de que R$497 estava barato para um produto com os agentes.

**Decisão:** Incluir os agentes no curso. Preço direto na plataforma: R$697. Preço nos funis: R$497.

**Racional:** Os agentes são o mecanismo do Expert360º — sem eles, o curso vira teoria genérica e não entrega a transformação prometida. R$697 ancora o valor percebido. R$497 nos funis cria oferta agressiva de escala sem desvalorizar o produto na plataforma.

**Impacto:** Curso Expert360º com agentes de IA incluídos. Estratégia de preço duplo: R$697 (plataforma) / R$497 (funis). Meta: escala com percepção de premium mantida.

## 19/05/2026 — Entregáveis finais do curso Expert360º

**Contexto:** Definição dos entregáveis do curso durante módulo de criação de produtos da Arcane.

**Decisão:**
- Agentes de IA incluídos (6 agentes — mecanismo do produto, não acessório)
- Sem comunidade de alunos ativos (protege self-image da persona)
- Sem suporte direto da Karol (anti-escala — agentes substituem)
- Encontro mensal ao vivo em grupo: Q&A coletivo, não individual
- Alumni group como bônus futuro (quem concluiu — não alunos ativos)

**Racional:** Encontro mensal resolve objeção de compra ("não estou sozinha"), mantém engajamento e serve como upsell natural para mentoria — quem quer mais acompanhamento já conhece e confia, a venda é continuidade, não pitch.

**Impacto:** Produto limpo, escalável, com touchpoint mensal de upsell para mentoria integrado à experiência do aluno.

## 08/06/2026 — Renomear aulas de "Encerramento" em todos os módulos do Expert360º

**Contexto:** Durante a roteirização do Encerramento M3, Karol observou que o nome "Encerramento" soa institucional/genérico — do tipo que aluna pula — mas essas aulas carregam a virada psicológica de identidade de cada módulo (consolidação de quem ela se tornou).

**Decisão:** Renomear todas as aulas de Encerramento (M0, M1, M2, M3 — e futuramente M4) para **"Quem Você Se Tornou — Encerramento Módulo X: [tema]"**. Mantém a referência ao módulo para navegação interna do roteiro, mas o nome que a aluna vê passa a comunicar o real valor da aula: reconhecimento da transformação, não aviso de fim de conteúdo.

**Racional:** "Encerramento" é nome operacional (perspectiva de produção), não persuasivo (perspectiva de quem assiste). Aulas que carregam a virada de identidade — o momento mais importante da jornada psicológica — não podem ter nome que convide a pular.

**Impacto:** Aplicado em `m0-roteiros.md`, `m1-roteiros.md`, `m2-roteiros.md` e `m3-roteiros.md`. M4, quando roteirizado, deve seguir a mesma convenção.

## 03/07/2026 — Copy pública em masculino genérico

**Contexto:** Durante a reescrita da LP do mini treinamento, surgiu a questão de gênero na copy — a persona (Laura) é feminina, mas 40% dos alunos da Karol são homens. Testou-se alternância de gênero na mesma frase ("psicóloga, advogado, médica...") e a Karol vetou: parece erro de concordância.

**Decisão:** Toda copy pública (LPs, posts, anúncios) usa **masculino genérico como padrão**. Feminino só em contexto exclusivamente feminino (história da Karol, depoimentos de alunas). Nunca alternar gênero dentro da mesma frase ou lista. Perfis de público nomeados direto ("Profissional liberal", "Empregado CLT", "Servidor público"), sem rótulos criativos.

**Racional:** Alienar 40% da audiência custa mais do que a especificidade de gênero agrega. A persona Laura segue como referência de dores e ruminações — muda só a marca gramatical.

**Impacto:** Aplicado na LP nova (`business/campanhas/lp-minitreinamento/`). Vale pra toda produção de copy futura (registrado também na memória do sistema).
