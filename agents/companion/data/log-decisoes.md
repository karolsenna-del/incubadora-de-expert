# Log de Decisoes

> Decisoes importantes registradas com racional e contexto. Append-only.

<!-- Formato:

## 30/10/2026 — Juliana Pasqual fechou o Método VIP

**Contexto:** Sessão de vendas de 29/10 (Juliana pelo Dr. Diogo), ofertado o Método VIP (R$1.500 pix ou 12x R$150).
**Decisão:** Venda fechada (Karol, 30/10). Forma de pagamento não informada.
**Racional:** Confirmação da Karol.
**Impacto:** CRM marcado como "fechou". Próximo passo é o onboarding do VIP.

## 30/10/2026 — Meta de 1 ano: R$50 mil/mês em meio período

**Contexto:** Pergunta do post de domingo 01/11 (Rota100k): onde a Karol quer estar daqui a um ano.
**Decisão:** Novembro de 2027 faturando R$50.000/mês, trabalhando meio período.
**Racional:** Meta declarada pela Karol (30/10).
**Impacto:** Vira compromisso público no Reels de domingo 15h; referência pra planejamento de 2027.

## 30/10/2026 — Novembro: foco total em comercial

**Contexto:** Meta de 1 abordagem por dia deu resultado; em outubro a meta subiu pra 3 sessões de Vendas Secretas por semana. Mentoria redonda e produtos prontos.
**Decisão:** Novembro é foco total em comercial (rotina comercial como coração do negócio).
**Racional:** Antes, sem produto pronto, nem a Karol tinha clareza do que oferecer e o lead não entendia a jornada dele no produto; agora o timing chegou.
**Impacto:** Conteúdo de novembro abre com isso (Rota100k Dom 01/11 07h). Prioridade do mês é a rotina comercial.

## [DATA] — [TITULO DA DECISAO]
**Contexto:** [o que estava acontecendo]
**Decisao:** [o que foi decidido]
**Racional:** [por que]
**Impacto:** [o que muda]
-->

## 23/10/2026 — Sprint do Vagner: ferramentas só são construídas depois que ele revisa as fichas de conteúdo
**Contexto:** S4 do Vagner apresentava o Kit (planilha) e a vitrine (protótipo com dados fictícios) e já liberava a versão de uso nas Aprovações.
**Decisao:** As 6 essenciais ganham uma ficha de conteúdo cada (pra que serve, quem usa, estrutura das telas, o que calcula, template do resultado, o que precisa vir dele, o que fica fora da 1ª versão). Revisar conteúdo, estrutura e template é a tarefa dele até a S5. A construção só começa com as fichas devolvidas.
**Racional:** Karol quer construir sem retrabalho; o protótipo e a planilha não diziam o que vai dentro de cada ferramenta.
**Impacto:** S4 do cronograma ganhou o bloco de tarefa com campos salvos (`s4-ficha1..6-*`, `s4-fichas-prazo`); as perguntas de taxas e extrato saíram das Aprovações e foram pras fichas 02 e 04 (mesmas chaves).

## 20/10/2026 — Agente da Autoridade Tríplice passa a entregar Frase-Tese e bio; vitrine fica nos materiais do M4
**Contexto:** Revisando o GPT da Autoridade Tríplice, a Karol notou que a frase-tese não estava nele. Ela existia só na versão da área de membros (seção 4, Tese Autoral), nunca colada no GPT. O curso também definia frase-tese e bio de dois jeitos diferentes (M4.2 x área de membros; roteiro da Aula 4 x Agente da Promessa).
**Decisão:** (1) O agente ganha a Tese Autoral e a bio do Instagram; destaques e posts fixados ficam fora e seguem nos materiais M4.4 e M4.5. (2) Frase-tese: critério "curta e memorável, a bandeira que a pessoa repete de cabeça". (3) Bio: modelo "Eu ajudo [persona] a conquistar [resultado], [atratividade]" + CTA, até 150 caracteres. (4) Sintoma, problema impostor e causa oculta são sugeridos pelo agente e o aluno confirma ou ajusta, porque as alunas travam ao escrever isso. v2 aprovada pela Karol.
**Racional:** Frase-tese e bio fecham a tríplice e saem dela; destaques e posts pedem materiais que o agente não tem (História Real, depoimentos), alongariam a conversa e estourariam o limite de 8.000 caracteres do GPT.
**Impacto:** `agents/gpt-publisher/output/autoridade-triplice/custom-gpt/Instructions-v2.txt` (7.888 caracteres) pronto pra colar no GPT. Course Creator precisa ajustar o M4 antes da gravação (Aulas 3 e 4, M4.1, M4.2, M4.5, descrição da A4), tarefa no tracker do curso. Seção 6 do handoff da área de membros fica pendente de receber as mesmas mudanças.

## 19/10/2026 — Incubadora Express promete a 1ª Venda Secreta em 30 dias, com a data marcada na S1
**Contexto:** Análise de persona e produto com o Clone Euriler. A promessa da Incubadora só falava do medo da persona, a única prova de dinheiro (Milena: Venda Secreta montada em 23/09, venda de R$2.500 em 30/09) não aparecia na sessão, e os alunos anteriores desistiam montando método e ferramentas antes de chegar na Venda Secreta.
**Decisão:** (1) Promessa da Express: "Em 30 dias, o que você sabe vira um método com o seu nome e você faz a sua primeira Venda Secreta — numa conversa, sem lançamento, sem exposição amadora." (2) Os 30 dias são meta de ritmo, não garantia; escopo e contrato não mudam. (3) Na S1 o aluno sai com a data da 1ª Venda Secreta marcada (~dia 30). (4) O caso Milena entra como prova em toda sessão, logo depois da história. (5) Na sessão, nada de ensinar: vontade de explicar vira "isso é o que a gente faz na sessão X".
**Racional:** A data marcada com uma pessoa real tira o projeto paralelo do plano B. A persona é técnica, competente e desvalorizada, como a Milena e a Karol; a prova de alguém igual a ela vale mais que a promessa. Dar aula na sessão deixa a lead com o "clareou", ela tenta sozinha e não volta.
**Impacto:** Roteiro da Sessão de Vendas Secretas v4 (só Sprint e Express). Apresentação da oferta da Express criada (`business/campanhas/incubadora-de-expert-grupo/apresentacao-oferta-express.html`). O funil da Live 33 continua apontando pra apresentação da Individual (material de aula, fica como está).

## 18/10/2026 — 60 dias sem funil novo: Sessão Estratégica como único método, meta de 3 conversas por semana
**Contexto:** A Black Expert (live de 14/10, só público quente) teve 0 vendas: 226 convidados, 47 no grupo, 20 na live, 16 no pitch e 0 cliques em comprar. A Karol tem histórico de lançamentos que não venderam e hoje só vende por sessão estratégica. Estava cogitando funil de quiz, VSL e mini-treinamento. Decisão tomada com o Clone Euriler.
**Decisão:** (1) **Nenhum funil novo por 60 dias** (quiz, VSL e lançamento parados até ~17/12). Método único: **Sessão Estratégica**. (2) Na sessão, só duas opções: **Sprint do Método (R$5.000)** pra quem não tem tempo nem clareza, e **Incubadora Express (R$2.500)** pra quem quer fazer com acompanhamento e sente o peso do valor. O resto do portfólio sai da vitrine e só aparece se a pessoa pedir. (3) Meta: **3 sessões estratégicas por semana**. (4) Como o gargalo é falta de gente, a conversa passa a ser aberta pela Karol: convite 1 a 1 pra base existente (226 contatos, grupo de lives, grupo da Black, quem comenta AULA). Premissa provisória: 5 convites por dia útil na 1ª semana, recalibrar pelo que virar sessão.
**Racional:** A live segurou o público (80% ficou até a oferta). O gargalo é o volume e o encaixe do ticket, não falta de funil. A conversa 1 a 1 é o único canal que já gerou receita, e é o perfil dela. 8 portas de entrada pra uma base pequena dispersam a escolha. As leads quentes pediram oferta menor e acompanhada, e a Incubadora Express (criada em 17/10) já é essa oferta.
**Impacto:** Conteúdo (desafio de 6 posts por dia) passa a ser fonte de convite, medido por conversas abertas e não por seguidores. CTA migra de "comenta AULA" pra conversa. Leads quentes da retro: continuação do Sprint oferecida à lead 8, Expert360º + sessão avulsa quando travar oferecidos à lead 2, Incubadora Express a oferecer a 3 leads (incluindo a 7) até 23/10.

## 04/10/2026 — Mentorias ganham 3 agentes de IA de conteúdo; Grupo recebe Kit de Scripts em template
**Contexto:** Revisão da aba "Comparar tudo" da Jornada do Aluno (artifact WrMZHw5ZpDfSYYZYGPTjak).
**Decisão:** **3 agentes de IA de criação de conteúdo** (live semanal, reels e stories), entregues na fase de Posicionamento, **exclusivos de Grupo e Individual**. **Grupo:** Kit de Scripts de Vendas Secretas como **templates pra adaptar**. **Individual:** materiais de aplicação, Kit de Scripts e Funil de Lives Semanais **feitos pelo time**. **Expert360º:** ensina o Expert Plan no módulo de escala.
**Racional:** Definido pela Karol.
**Impacto:** Jornada do Aluno v5, KB do Vendedor Expert, ecossistema e arsenal do closer atualizados. Status dos 3 agentes de conteúdo (Karol, 04/10): já existem pro uso dela e vão virar Custom GPTs no ChatGPT pros alunos, no mesmo formato dos 6 agentes do método. Precisam estar prontos antes de o primeiro aluno chegar no Posicionamento.

## 03/10/2026 — Expert360º a R$697, Studio exclusivo das mentorias, VIP com 7 dias, Sprint com funil completo
**Contexto:** Revisão da Jornada do Aluno com todas as ofertas (artifact WrMZHw5ZpDfSYYZYGPTjak) e da comparação lado a lado. Apareceram pontos em aberto em preço, bônus e garantia.
**Decisão:** Expert360º passa a **R$697 à vista ou 12x R$69,70** (sai o R$497). **Studio de Ensaio sai do Expert360º** e fica exclusivo de Grupo e Individual. **Método VIP: garantia de 7 dias.** **Método Express: R$300 à vista ou 12x R$30.** **Sprint do Método entrega o Funil de Vendas Secretas completo**: captar leads, abordagem, pré-diagnóstico, agenda da sessão, diagnóstico, oferta, fechamento, onboarding (sim) e follow-up 5x (não).
**Racional:** Definido pela Karol. Studio exclusivo reforça a diferença entre curso e mentoria.
**Impacto:** Jornada do Aluno v3, Portas do Método v3, arsenal do closer, ecossistema de ofertas e documento mestre atualizados. **Pendente:** a página do Expert360º no ar ainda mostra R$497, 12x R$49,70 e o Studio (conferido via curl em 03/10). O checkout da Voomp e a vitrine da Área de Membros precisam ser conferidos.

## 02/10/2026 — Sprint do Método sobe de R$3.000 pra R$5.000

**Contexto:** O Sprint do Método era vendido a R$3.000 (12x R$300 na página). Na prática a Karol monta toda a estrutura e entrega pronta. O cliente só valida em cada etapa.
**Decisão:** Novo preço-base de R$5.000 à vista ou 12x de R$500. Checkout Voomp no formato novo (`pay.voompcreators.com.br/oLLZMsigRPz811l1/offer/60AOYt`, mesma oferta do produto 16365). Página de vendas atualizada e publicada em 02/10.
**Racional:** Pelo trabalho entregue (estrutura feita por ela e entregue pronta), R$3.000 não fazia sentido. A Karol também pretende passar a entregar o **funil de Vendas Secretas pronto**, e não só os roteiros, o que aumenta ainda mais o valor entregue.
**Impacto:** Contrato modelo (cláusula 4.1), vitrine da Área de Membros, Central da Incubadora e docs internos ainda citam R$3.000. Cascata pendente, ver tracker do CRM de reativação. Clientes que já fecharam (ex.: Vagner) seguem no valor contratado. **Atualização (mesmo dia):** o funil entrou no escopo e o Sprint passou de 6 pra **8 semanas** ("mais folgado e real"). O funil ocupa as S6-S7 e vai da abordagem do lead, questionário de diagnóstico e roteiro da sessão até a apresentação da oferta; a plataforma o cliente escolhe. A página deixa explícito que é **prestação de serviço**: não inclui mentoria, acompanhamento da implementação, análise de casos e vendas reais nem tráfego pago. Página publicada. O contrato ainda precisa refletir isso.

## 01/10/2026 — Meta de vendas da Black Expert: 4 vendas

**Contexto:** Black Expert (Grupo 2026), oferta relâmpago de 1 dia em 14/10, R$2.500. Meta numérica estava pendente desde 18/09. Convite 1:1 pelo WhatsApp oficial saiu hoje pra 124 contatos.
**Decisão:** meta de 4 vendas.
**Racional:** definido pela Karol.
**Impacto:** 4 x R$2.500 = R$10.000 de faturamento-alvo. Item "meta pendente" sai do cockpit.

## 21/09/2026 — Causa raiz da letra pequena no celular: faltava meta viewport (RESOLVIDO)

**Contexto:** Karol reportou letra pequena no celular no Diagnostico do Expert. Um primeiro
ajuste de font-size no CSS mobile nao resolveu — ela confirmou que continuava pequeno mesmo
depois do deploy.
**Decisao/Achado:** A causa real era estrutural, nao de CSS: os 4 arquivos (Diagnostico do
Expert, DNA do Expert, Kit de Ferramentas, Sprint do Metodo) nao tinham `<!DOCTYPE html>` nem
`<meta name="viewport" content="width=device-width, initial-scale=1.0">`. Sem isso, o navegador
mobile renderiza a pagina inteira como se fosse desktop (~980px de largura virtual) e encolhe
tudo pra caber na tela — qualquer aumento de font-size fica sem efeito visivel porque a pagina
toda esta reduzida. Corrigido nos 4 arquivos (doctype + viewport + fechamento de html/body) e
republicado nos 4 projetos Vercel. **Confirmado pela Karol que ficou certo.**
**Racional:** Bug estrutural raro de aparecer em testes de desktop (so afeta renderizacao
mobile), por isso passou despercebido ate agora.
**Impacto:** Fica registrado como CHECKLIST pra qualquer pagina nova construida nesse mesmo
molde (self-paced diagnostico interativo) — sempre conferir doctype + viewport antes de
declarar pronto pra mobile. Achado colateral (nao corrigido ainda, so registrado no backlog):
mais 6 arquivos no repo tem o mesmo padrao sem viewport — a maioria sao copias de referencia em
pastas `materiais/` (nao servidas ao vivo), exceto `business/campanhas/metodo-em-1-hora/index.html`
que nao tem projeto Vercel proprio (status de publicacao incerto).

## 21/09/2026 — Radar do Expert criado; sincronizacao do pre-diagnostico e manual, sob pedido

**Contexto:** Karol usava uma planilha do Google Sheets pra pontuar os 5Ps na Sessao Estrategica
(radar de Persona/Promessa/Processo/Proposta/Posicionamento). Pediu pra virar ferramenta
interativa e perguntou se as respostas do pre-diagnostico (que o lead preenche antes da sessao)
poderiam alimentar a pontuacao automaticamente.
**Decisao:** Criado o artifact **Radar do Expert**
(`https://claude.ai/artifact/AgwbWdzWbfo5QWgxuy9wVb`) com banco de dados proprio (historico de
leads). A sincronizacao do pre-diagnostico pra dentro dele **e manual, sob pedido** — nao existe
automacao ponta a ponta porque o formulario do pre-diagnostico roda fora do Claude (site +
Apps Script) e o banco do artifact so aceita escrita de dentro da propria ferramenta, nunca de
um servidor externo. Karol pede ("importa o pre-diagnostico da Fulana") e o Claude le a planilha
e grava no artifact via ArtifactData.
**Racional:** Limitacao de plataforma (nao ha endpoint publico pro banco do artifact) — nao e
falta de esforco, e arquitetura. O caminho manual ainda assim elimina o trabalho de re-digitar
tudo na hora da sessao.
**Impacto:** Processo documentado em
`business/processos/sincronizar-pre-diagnostico-radar-expert.md`. Testado com a lead Marcelli
(marcellistrobel@gmail.com) — nesse teste foi achado que a resposta dela caiu numa planilha
**antiga**, diferente da linkada como oficial na Central Incubadora (ver item no backlog).

## 17/09/2026 — Sequencia oficial do Vendas Secretas e VENDER -> VALIDAR -> CRESCER (nao validar->vender->crescer)

**Contexto:** Revisando o roteiro da aula bonus da Voomp (Black For You), a Karol corrigiu a ordem
do mecanismo Vendas Secretas que o roteiro usava. A KB `agents/etlmaker/kbs/sessao-estrategica/VOL-06-identidade-oferta-leads.md`
(linha 17, Regra Cardinal) e as Lives 23, 25, 28, 29 e 30 ja publicadas usam a ordem
"validar -> vender -> crescer".
**Decisao:** A ordem correta, nas palavras da Karol: "eu faco a VENDA secreta, o aluno passa
pelo metodo para VALIDAR e depois trabalhamos o posicionamento para CRESCER". Ou seja:
**vender -> validar -> crescer**. A venda individual em privado (a "venda secreta") e o que
o aluno usa pra validar o metodo na pratica; só depois entra o trabalho de posicionamento
pra crescer/escalar.
**Racional:** Correcao explicita da autora do metodo, dada apos eu apontar a inconsistencia
com a KB e as lives anteriores — nao foi typo, e a sequencia real que ela ensina e pratica.
**Impacto:** Roteiro `business/campanhas/lives-semanais/aula-bonus-black-for-you-voomp.md" ja
corrigido (Tese, Bloco 5, Bloco 8). **Pendente:** (1) VOL-06 tem uma Regra Cardinal desatualizada
e precisa de correcao — fora do escopo do worker Expert em Lives, rotear pro ETLmaker; (2) Lives
23/25/28/29/30 ja publicadas usam a ordem antiga — decidir se ficam como estao (ja gravadas/entregues)
ou se merece nota de atualizacao; (3) contexto-dinamico.md e outros materiais que citam a tese
("validar -> vender -> crescer") tambem ficam desatualizados.

## 14/09/2026 — Sprint do Metodo passa de 5 pra 6 semanas (Processo e Ferramentas separados)

**Contexto:** Karol apontou que a semana 3 do Sprint do Metodo ("Processo Autoral + Ferramentas")
tinha informacao demais pro cliente assimilar e validar numa unica sessao/semana.
**Decisao:** Sprint do Metodo passa de 5 pra 6 semanas. Processo Autoral (semana 3) e
Ferramentas personalizadas (semana 4, nova) viram entregas separadas, cada uma com sua
propria semana. Semanas seguintes empurradas: Proposta+Roteiros vai pra semana 5 (era 4),
Agente de IA+Handoff vai pra semana 6 (era 5). Preco (R$3.000) e demais termos comerciais
nao mudam — decisao e so sobre ritmo/carga de entrega.
**Racional:** Decisao explicita da Karol — qualidade de assimilacao do cliente importa mais
que comprimir o cronograma.
**Impacto:** Atualizado em cascata: master de ofertas, copy da pagina de vendas (doc +
HTML live), doc de conhecimento do ecossistema de ofertas, arsenal do closer, contrato
juridico (`.md` + HTML regerado — PDF final ainda pendente de reexportar via Playwright),
Vitrine da Area de Membros, materiais de diagnostico de kickoff e briefings de design do
infografico (nunca executado, sem asset visual pra refazer). Detalhe completo no LOG de
`business/campanhas/crm-reativacao-leads/tracker.md` (entrada 14/09). Pendente: commit
via Ops (mudancas ainda nao commitadas) + reexportar PDF do contrato antes de usar com
cliente real.

## 14/09/2026 — Agente de Roteiro de Validacao (Vendas Secretas) espera a KB Sessao Estrategica fechar

**Contexto:** No fim da conversa sobre a aula bonus da Voomp (publico "Black For You"), Karol
conectou a KB "Sessao Estrategica" (ETL em andamento, `agents/etlmaker/kbs/sessao-estrategica/`)
com o backlog antigo (31/07) "Construir Agente de Roteiro de Validacao (Grupo/Vendas Secretas)".
VOL-01 a VOL-04 (aula do Tomas, Arcane) ja estao aprovados e completos (score 98.2) — VOL-04
cobre os 4 blocos da sessao estrategica (rapport, mapeamento de dor, conexao dor-produto,
pitch+fechamento com PIX na call). Um merge adicional com material do Lourival (Formula High
Ticket, modulo Sessao 1a1) esta em andamento — Fase 1 aprovada, Fase 2 (compor VOL-05) pendente.
**Decisao:** Karol vai esperar o merge do VOL-05 (Lourival) fechar antes de comecar a construir
o Agente de Roteiro de Validacao. Nao inicia o agente com so o material do Tomas.
**Racional:** Decisao explicita da Karol — quer a KB completa (as duas fontes) como base antes
de criar o agente.
**Impacto:** Proximo passo tecnico e ETLmaker terminar o merge (Fase 2: compor VOL-05, ver
`00-pipeline/PLANO-ETL.md`). So depois disso o Agente de Roteiro de Validacao entra em producao
(Worker Forge ou Mind Forge). Backlog atualizado com este sequenciamento.

## 13/09/2026 — SOP-022 aprovado pela Meta; Direct automatico liberado pra teste real

**Contexto:** App "postador-conteudo" estava bloqueado desde 07-08/09 por falta de verificacao de
Provedor de Tecnologia (selo extra exigido pra apps que acessam comentarios de outras contas). Formulario
de verificacao enviado em 08/09, resposta esperada ate 13/09.
**Decisao:** Meta aprovou a verificacao (confirmado por Karol, 13/09, weekly review).
**Racional:** Verificacao era o unico bloqueio identificado — App Review, testador e usuarios de teste
travavam por causa dela.
**Impacto:** Proximo passo e testar comentario→Direct de verdade com conta de fora (testador ou App
Review completo). Rotear pro Gestor de Infra Arcane pra rodar o teste.

## 13/09/2026 — "Crie seu Metodo em 1 Hora" e bonus pontual de aula, nao operacao monitorada

**Contexto:** Diagnostico novo criado 11/09 (duplicado do Kit de Ferramentas com pergunta de interesse
individual), ainda fora do cockpit — decisao pendente desde a criacao.
**Decisao:** Fica como bonus de aula, nao entra como operacao continua monitorada pelo Companion.
**Racional:** Karol confirmou no weekly review (13/09).
**Impacto:** Nenhuma acao de infra adicional necessaria; nao entra no cockpit nem em operacoes continuas.

## 27/08/2026 — Recuperados 52 commits (23-26/08) que nunca chegaram ao GitHub

**Contexto:** Execução autônoma do Expert-Stories (missão de quinta) encontrou o container
partindo de um HEAD detached, não conectado a nenhum branch. Investigando, `origin/master`
estava travado no commit de 23/08 10h11 UTC — 4 dias sem avançar — enquanto o container local
tinha 52 commits em cima desse ponto, de 23 a 26/08: missões #6-#10 do Expert-Stories (imagens
geradas, publicações via insta-scheduler), correções de regras (palavra-gatilho fixa, exceção
Expert360º nas vagas, `git add -f` obrigatório), SOP-022 (automação de Direct), fix de webhook
em produção, weekly review de 24/08, e múltiplas entregas do Conduz Agro (Milena Gehrke). Tudo
commitado localmente em sessões anteriores, mas nenhum push chegou a completar — provável causa
o erro 403 do GitHub App já citado nas instruções da missão diária ("conhecido, pode ainda não
estar resolvido").
**Decisão:** Confirmado que `origin/master` era ancestral direto dessa cadeia (fast-forward
puro, nada reescrito) — sincronizado com `git push` normal, sem force. Nenhum conteúdo
descartado; a missão de hoje (Story de quinta, Expert360º) foi aplicada por cima e enviada
junto.
**Racional:** Container é efêmero — mais um ciclo de reclaim sem esse push e os 3.5 dias de
trabalho (de vários agentes, não só Expert-Stories) se perderiam de vez. Como era fast-forward
verificado, o risco do push era baixo comparado ao risco de perder o trabalho.
**Impacto:** `origin/master` está em dia (27/08). O push manual funcionou desta vez — o 403
mencionado nas instruções não se repetiu agora, mas o padrão (commits acumulando sem push por
dias sem ninguém perceber) é um risco real: vale o Gestor de Infra Arcane investigar se algo
no ambiente de execução autônoma está deixando o `git push` falhar silenciosamente em algumas
sessões, e considerar um passo de verificação (`git fetch` + comparar com `origin/HEAD`) no
início de toda missão autônoma, não só no fim.

## 24/08/2026 — Padronizar nome dos encontros 1:1 no Calendar, sem backfill do histórico

**Contexto:** Weekly review. A automação de Encontros Individuais (`weekly-sync`, Área de Membros) espera que a gravação no Drive comece com `Individual - {slug-da-aluna} - {data}`, mas o Google Meet nomeia pelo título da reunião no Calendar — hoje só "Milena", "Simone e Mavi", "David" etc, sem o prefixo. Resultado: nenhuma gravação de 1:1 está sendo processada automaticamente. Levantada a possibilidade de puxar o histórico também (a série nunca rodou, watermark null = primeira rodada sem filtro de data), mas o comportamento de descoberta de subpasta nessa série nunca foi testado — risco parecido com o quase-duplicado da Live 25 (20/08).

**Decisão:** Karol renomeia a reunião recorrente de cada aluna no Google Calendar/Meet pra `Individual - {slug-da-aluna}` (slug = nome da pasta em `mentoria/alunas/{slug}/`) — vale pra todas as alunas com 1:1 recorrente, não só a Milena. **Sem backfill do histórico** — só gravações novas, feitas depois da renomeação, entram na automação.

**Racional:** Renomear a reunião é ação simples e sem risco, resolve o problema pra frente sem esforço de dev. Puxar histórico exigiria testar um caminho de código nunca validado (descoberta de subpasta pra série nova) — o ganho (algumas gravações antigas na Área de Membros) não compensa o risco de repetir um incidente de dado duplicado/errado, especialmente sem supervisão ativa da Karol no teste.

**Impacto:** Nenhuma mudança de código necessária agora. Pendência de `demandas-backlog.md` fechada como decidida. Se o comportamento de descoberta de subpasta precisar ser confirmado/corrigido no futuro (ex: se a Karol quiser puxar histórico depois), rotear pro Gestor de Infra Arcane.

## 21/08/2026 — Rotina de Stories: vagas fixas, handoff pra automação diária

**Contexto:** Karol relatou dificuldade em manter os Stories em dia porque a rotina hoje
depende dela vir puxar conversa com o Expert-Stories todo dia. Proposta feita e aprovada:
automatizar em duas frentes — script de postagem (Gestor de Infra Arcane) e gatilho diário
que ativa o worker sozinho (Ops). No caminho, dois destravamentos: (1) Karol fixou o número
de vagas da Levantada de Mão em 2, eliminando a maior causa recorrente de precisar perguntar
algo a ela; (2) confirmado que existe banco de histórias reais (Squad Conteúdo Arcane,
`historias-trajetoria.md` + `historias-mentorias-atendidas.md`) que pode alimentar formatos
antes tratados como 🔴 (De Volta ao Passado, possivelmente Depoimento ou Bastidor) sem
precisar de conteúdo novo dela.

**Decisão:** (1) Vagas da Levantada de Mão fixas em 2 até ela mudar explicitamente. (2)
Seguir com handoff pro Gestor de Infra Arcane (escrever/testar script de publicação de
Stories no `insta-scheduler`, incluindo apagar a Story anterior antes de publicar a nova) e
pro Ops (configurar gatilho diário que ativa o Expert-Stories sozinho). (3) Canal de aviso
quando o worker precisar de algo dela: notificação push (Claude Code/Remote Control) — ela
só trabalha no chat à tarde, então perguntas urgentes de manhã (ex: Levantada de Mão 8h-10h)
não podem depender só do chat.

**Racional:** Cada blocker que dependia de resposta manual da Karol reduz o quanto a
automação pode rodar sem ela. Fixar o número e mapear o banco de histórias já elimina dois
dos três blockers recorrentes (número real, conteúdo 🔴) — sobra praticamente só override.

**Impacto:** Handoffs registrados em `.auroq/handoffs/`. Depois que o script existir e o
cron estiver configurado, a maioria dos dias deve sair sem ela precisar abrir o chat.

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

## 28/08/2026 — Canal oficial de suporte async da Incubadora de Expert: WhatsApp

**Contexto:** Fase 3 do Mentoring Creator (Estrutura do Programa) identificou que o campo "Canal de comunicação preferido" nunca tinha sido preenchido no `_mentor/cadastro.md` de nenhum aluno (nem Milena, nem David) — gap real na operação atual.

**Decisão:** Canal oficial de suporte entre sessões é WhatsApp. SLA de resposta e regras de uso ficam em aberto pra Fase 5 (Design de Entregáveis) do pipeline.

**Racional:** Formaliza o que já era prática de facto, fecha o gap antes do lançamento formal do produto.

**Impacto:** Registrado em `business/campanhas/incubadora-de-expert-individual/estrutura-programa.md`. Ação pendente: atualizar `_mentor/cadastro.md` de Milena e David com o canal.

## 28/08/2026 — Offboarding da Incubadora de Expert: depoimento na validação do método, não no fechamento

**Contexto:** Fase 5 do Mentoring Creator (Design de Entregáveis) levantou que nenhum aluno passou pelo offboarding formal ainda (Rodrigo, Ricardo e Helio finalizaram sem processo estruturado). Karol definiu as peças que faltavam.

**Decisões:**
- Depoimento/case study é capturado logo após a validação do método (3ª venda real das Vendas Secretas, Sessão 8/F3) — não no fechamento dos 12 meses (F4). Motivo: a prova em campo é a promessa central da mentoria, não a autoridade digital.
- Plano de continuidade usa a ferramenta **Expert Plan** (já existe, precisa melhorar): https://docs.google.com/spreadsheets/d/1T8hHRb1IRXDuRElpUwNKa8tHWuVxWp_g6gyPUB5vHpE/edit — 3 camadas (estratégico: projeção de faturamento por produto; tático: funis ativos; operacional: prospecção/sessões/follow-up).
- Alumni network: mantém como está por enquanto (sem grupo/acesso contínuo pós-programa).
- Próximo nível pós-mentoria: ideia embrionária da Karol (ela é contadora/administradora de formação) — entrar na gestão do negócio do aluno (contratar, estruturar, processos). Não é produto formal ainda; entregue informalmente 1:1 quando algum aluno chegar nesse ponto.

**Impacto:** Registrado em `business/campanhas/incubadora-de-expert-individual/design-entregaveis.md`. `design-sessoes.md` (Fase 4) revisado: Sessão 8 ganhou captura de depoimento, Sessão 14 ficou só com assessment final + Expert Plan.

## 29/08/2026 — Empacotamento da Incubadora de Expert: preço-base mantido, add-on de tráfego fechado em R$1.500

**Contexto:** Fase 7 do Mentoring Creator (Empacotamento). Karol cogitou subir o preço-base de R$10.000 pra R$15.000, mas recuou por já ter vendido pouco a R$10.000. Add-on de páginas+tráfego nunca foi cobrado antes (sem preço de referência interna).

**Decisões:**
- Preço-base mantido em R$10.000. Diagnóstico: pelo benchmark de mercado (teto R$50.000, add-on gringo US$3-6k só pra parte técnica), o preço não está caro — o baixo volume de vendas é mais provável ser problema de distribuição/audiência do que de preço. Revisão de preço fica pra depois de investigar a causa real do baixo volume (conecta com a hipótese já registrada sobre audiência vs. consistência de conteúdo).
- Add-on de páginas + configuração de tráfego: pesquisa de mercado sugeriu R$3.000-5.000, mas Karol achou caro pro serviço prestado e fechou em **R$1.500** (valor único, sem gestão contínua).
- Descoberta durante a fase: existe um produto separado, **Sprint do Método** (DFY — Karol monta toda a fundação do método pro cliente), seguido de uma variante de 6 meses da Incubadora de Expert cobrindo só Posicionamento + outros produtos do Portfólio pra escala. Não é uma opção alternativa da Incubadora de 12 meses — é esteira de entrada diferente. Fora do escopo deste pipeline; candidato a processo próprio do Mentoring Creator no futuro, se a Karol quiser formalizar.

**Impacto:** Registrado em `business/campanhas/incubadora-de-expert-individual/empacotamento.md` e `prd.md` (preço do add-on de tráfego atualizado).

## 02/09/2026 — Weekly review: foco em entrega, Biblioteca de IA e comercial quente

**Contexto:** Weekly review posterior à de 24/08. Karol fechou as prioridades da semana e as decisões que ainda estavam abertas sobre a proposta de Black Friday enviada a Euriler e sobre a formalização da Mentoria Individual.

**Decisões:**
- Expert360º: fechar uma leva objetiva do M3; quantidade da leva não definida.
- Black Friday: priorizar a Biblioteca de IA; pacote, preço, prazo de acesso e demais condições continuam sem definição.
- Comercial: concentrar em CRM e contatos quentes Nanny e Euriler. Nanny segue pensando na parceria. A proposta de Black Friday já foi enviada a Euriler e, até 02/09, não houve retorno.
- Proposta Euriler: objeto confirmado como desafio para um grupo selecionado de alunos da Arcane/Auroq. O público são os alunos que demonstrarem interesse e forem admitidos; todos os interessados elegíveis admitidos entram em um grupo administrado pela própria Karol. Nenhum critério adicional de seleção foi definido.
- Mentoria Individual: fechar nesta semana o contrato de 12 meses, a mensagem de boas-vindas e as regras de uso do WhatsApp. Decisão confirmada; não voltar a perguntar se esses três itens devem ser feitos.

**Racional:** Reduzir dispersão e transformar frentes já maduras em entregas concretas, sem inventar condições comerciais ou escopo ainda não decidido.

**Impacto:** Cockpit e trackers passam a refletir as próximas ações; a proposta do Euriler fica marcada como enviada/aguardando retorno e deixa de tratar o objeto como decisão pendente. Próxima weekly review: 09/09/2026.

## 16/09/2026 — Reprecificação da Mentoria Individual: R$10.000+add-ons vira R$13.500 tudo incluso

**Contexto:** Karol trouxe o documento "Proposta Validada — Mentoria Individual" (item 5 de 6 dos agentes de IA do método: Persona → Promessa → Processo Autoral → Portfólio Estratégico → Proposta Validada → Autoridade Tríplice), gerado fora do Mentoring Creator, com uma oferta reformulada. Reabriu a Fase 7 (Empacotamento, aprovada em 29/08 com preço-base R$10.000 + add-ons) pra reconciliar com essa versão nova.

**Decisões:**
- Preço sai do modelo composto (R$10.000 base + ~R$1.000 ferramentas/agente de IA + R$1.500 páginas/tráfego, total ~R$12.500) e vira **preço único: R$15.000 referência / R$13.500 condição atual**, à vista no pix ou **12x R$1.350,01** no cartão.
- Ferramentas do método, Agente de IA do Método Autoral e páginas+configuração de tráfego deixam de ser add-on cobrado à parte e passam a estar **inclusos** no preço.
- Nova **garantia de aderência de 30 dias**, formalizada como argumento comercial (sem virar barreira burocrática).
- **Escassez comunicada como agenda**, não como urgência de preço — "o que é limitado é a minha agenda, porque durante 12 meses eu participo diretamente da construção do projeto."
- Cadência das 14 sessões (aprovada em 28/08 na Fase 4) foi revisada junto e **mantida sem alteração**.
- Preço da continuação "Individual 6 meses pós-Sprint" (R$5.000, ancorado nos R$10.000 antigos) fica **pendente de nova decisão** — não foi inventado número novo, registrado como pendência em `docs/knowledge/expert-business/produto/ecossistema-ofertas-jul2026.md`.

**Racional:** Consolidar num preço único o que já era entregue de fato (ferramentas, agente de IA, páginas/tráfego), em vez de manter como add-ons fragmentados — alinhado ao diferencial já mapeado na Fase 1 de que o mercado gringo sempre cobra a implementação técnica separada da mentoria.

**Impacto:** Atualizados `business/campanhas/incubadora-de-expert-individual/prd.md`, `empacotamento.md` (v2.0), `checklist-producao.md` (v2.0 — revisado item a item com a Karol; 5 dos 10 itens originais já resolvidos desde 29/08) e `docs/knowledge/expert-business/produto/ecossistema-ofertas-jul2026.md` (fonte oficial de preços). Documento original guardado em `business/campanhas/incubadora-de-expert-individual/proposta-validada-2026-09.md`. Commitado em `78a3a07`.

## 24/09/2026 — Onboarding do Metodo VIP: primeiro passo e um diagnostico proprio

**Contexto:** O Metodo VIP (R$1.500, 3 encontros) era o unico produto de alto contato sem mensagem de boas-vindas nem etapa de preparo antes do Encontro 1.
**Decisao:** Primeiro passo da cliente VIP e responder um diagnostico replicado do "Crie seu Metodo em 1 Hora" — sem a pergunta final de interesse (ja comprou), mantendo o bloco de ferramentas. Mensagem no padrao Sprint, com o texto "ja sabendo como te orientar melhor nos proximos passos" (ajuste da Karol).
**Racional:** O Encontro 1 do VIP analisa persona/promessa/metodo — exatamente o que esse diagnostico coleta.
**Impacto:** `onboarding-pos-compra.md` secao 4; diagnostico no ar em vendas.incubadoradeexpert.com.br/metodo-vip/diagnostico/.

## 25/09/2026 — Diagnosticos pos-venda passam a coletar dados para contrato

**Contexto:** Karol quer os dados de contrato ja no onboarding, sem pedir separado.
**Decisao:** Bloco "DADOS PARA CONTRATO" (nome completo, RG, CPF, endereco, CEP) no FIM dos diagnosticos pos-venda: Sprint, Metodo VIP, DNA do Expert, Kit de Ferramentas e Agente de IA.
**Impacto:** Execucao com o Gestor de Infra (em andamento 25/09).

## 26/09/2026 — Expert360º sem feminino: linguagem neutra em todo material do curso

**Contexto:** Materiais, planilhas e roteiros do M3 usavam feminino ("ela", "a lead", "Conectora", "Fui prospectada"), mas ~40% dos alunos são homens.
**Decisao:** Nada no feminino em lugar nenhum do curso — linguagem neutra; masculino genérico só quando não houver forma neutra (ex.: perfis Conector/Analista/Diretivo, concordando com "perfil"). Aulas já gravadas (Intro–A8 do M3) não são reescritas.
**Racional:** Público misto; feminino exclui parte dos alunos.
**Impacto:** Roteiro M3 da A9 em diante, Rastreador de Leads Qualificados (todas as cópias), guia M3.5, agente Vendedor Secreto v2.1.0.

## 26/09/2026 — Pedido de desconto: condição de pagamento é regra da oferta, desconto negociado não entra

**Contexto:** Nova A11 do M3 ensina como responder quando o lead pede desconto na sessão.
**Decisao:** Pergunta separadora ("o que está pesando mais: o valor em si ou alguma outra coisa?") → resposta por perfil → se for o valor, confirmar ("se o valor não fosse uma questão, você entraria?"). Desconto à vista continua como condição de pagamento (normal em high ticket); o que não entra é reduzir o preço porque a pessoa pediu.
**Racional:** Desconto negociado desvaloriza a oferta validada; condição de pagamento vale pra todo mundo.
**Impacto:** M3 A11 e KB do Vendedor Secreto (seção 8.1).

## 26/09/2026 — Expert360º está só na área de membros própria (não na Voomp)

**Contexto:** Checklist e PRD ainda citavam Voomp como plataforma do curso.
**Decisao:** Correção da Karol — o curso está só em membros.incubadoradeexpert.com.br, publicado via course-publisher. Menções à Voomp são histórico.
**Impacto:** Checklist de produção (P4 e V04–V06) corrigido; tarefas de plataforma do curso ficam com o course-publisher.

## 27/09/2026 — Biblioteca de IA congelada até 15/10; comentários "BLACK" respondidos à mão
**Contexto:** Weekly review. Biblioteca de IA (Área de Membros) parada 8 dias esperando o pacote; Black Expert em 14/10 com Disparo #1 em 29/09 e automação comentário→Direct (SOP-022) ainda em App Review na Meta.
**Decisão:** (1) Congelar a comercialização da Biblioteca de IA até 15/10. (2) Karol responde manualmente cada comentário "BLACK" com o link do grupo da Black Expert enquanto a automação não libera.
**Racional:** Proteger o foco na Black Expert (única janela de venda com data fixa nas próximas 2 semanas); Biblioteca ainda chega a tempo da Black Friday de novembro. Resposta manual mantém o CTA planejado da Semana 09 sem reescrever legendas.
**Impacto:** Cockpit #3 em pausa comercial até 15/10. Karol reserva tempo diário pra responder comentários de 29/09 a 04/10 (e além, se o CTA seguir).

## 27/09/2026 — Black Expert: plano v1.3 aprovado (live às 15h, Sprint fora, Expert360º R$697)
**Contexto:** Revisão do documento mestre da Black Expert com o Atlas (Squad LPago), faltando 17 dias.
**Decisão:** Antecipação vira captação pro grupo; Disparo #1 em 28/09 à noite; Live 32 na quinta 01/10 15h (Karol em evento ter/qua); dia 14 com live de fechamento às 15h no lugar da VSL; Sprint fora da comunicação; pós-Black 15-21/10 com Expert360º; Expert360º sobe de R$497 pra R$697 em 01/10 (página "de R$997 por R$697"); Mentoria em Grupo passa a quinzenal; Desafio 5 Dias (19-23/10) mão na massa.
**Racional:** Edição de vídeo é o gargalo recorrente — live elimina edição do caminho crítico; RC-017 (uma oferta só); RC-013/014 (downsell só depois, pós-evento vende).
**Impacto:** Echo, Quill, Expert em Lives, Squad Conteúdo e Gestor de Infra com entregas até 12/10. Doc: `business/campanhas/black-friday-grupo-2026/documento-mestre.md` (seção Revisão v1.3).

## 28/09/2026 — Black Expert ganha identidade visual própria
**Contexto:** Montagem do deck da Live 32 (porta de entrada do grupo da Black Expert). A campanha não tinha nenhum padrão visual.
**Decisão:** Identidade "Incubadora em modo evento": mesma paleta da marca com preto dominante, nome em letra (BLACK branco / EXPERT laranja), chama desenhada em traço (nunca emoji 🔥), selo 14.10 e faixa laranja inclinada. Na Live 32, só o Bloco 8 vira Black (Blocos 1-7 ficam no visual Live Expert360).
**Racional:** Uma identidade só pra deck, stories, grupo, página e live de fechamento. Sem cor nova pra não virar "Black genérica"; virada só no pitch pra aula não parecer venda.
**Impacto:** Guia em `business/campanhas/black-friday-grupo-2026/identidade-visual.md` — usar em todas as peças da campanha (Quill na página, stories, live do dia 14).

## 02/10/2026 — Radar do Expert vira Diagnóstico do Expert por fases
**Contexto:** Karol voltou da imersão FHT (origem do diagnóstico e sessão de vendas 1:1) e quis que a ferramenta da sessão fizesse aflorar a necessidade com dores reais da persona, não critérios de aula.
**Decisão:** Os 5Ps saem do Radar; entram 5 áreas (Método, Validação, Posicionamento, Escala — fases da Incubadora — + Expert), 25 perguntas de situação vivida, nota de 0 a 10 dita pelo lead (10 = fácil/resolvido), sem pré-marcação. Radar final ao lado do ideal nota 10. A ferramenta se chama Diagnóstico do Expert e o formulário do lead passa a se chamar pré-diagnóstico. A sessão inteira segue SPIN (o Diagnóstico é o S); vontade de transição vira pergunta falada, fora do gráfico; pedido de indicação em todo fechamento.
**Racional:** Pergunta de "quanto você sabe" puxa pra solução "vou aprender" (curso) e mexe com o ego; pergunta de situação vivida faz o lead se ver. Escala única evita confusão no gráfico. As fases conectam o buraco direto ao que a Incubadora entrega.
**Impacto:** Perguntas em `business/campanhas/incubadora-de-expert-individual/sessoes-estrategicas/radar-fases-perguntas.md`; roteiro da sessão v3 (https://claude.ai/artifact/WeV7CVV38uBV7YTjvDzmc4); ferramenta v10 no mesmo link (https://claude.ai/artifact/AgwbWdzWbfo5QWgxuy9wVb); LP do pré-diagnóstico e Central renomeadas e no ar.

## 02/10/2026 — Mentoria em Grupo redesenhada: sem plantão, sessões acionadas pela entrega
**Contexto:** Plantões fixos (semanais ou quinzenais) não funcionavam: alunos não iam e a agenda da Karol ficava presa. Referência: oferta do Acelerador Fórmula High Ticket (imersão FHT).
**Decisão:** Fim dos encontros fixos (substitui a decisão de 27/09 de deixar o Grupo quinzenal). O Grupo passa a ter 12 meses de acesso, **8 sessões individuais acionadas pela entrega do aluno** (Diagnóstico + Roteiro do Expert, Revisão do Método, Checkup da Oferta, Raio-X de Venda, Estruturação do Produto, Revisão de Posicionamento, Raio-X da Live, Fechamento), **4 oficinas ao vivo** (Método = Desafio 5 Dias, Vendas Secretas, Posicionamento, Funil de Lives), Raio-X de 3 vendas e prazo dos marcos = os 12 meses de acesso (acaba a ideia de 6 meses acompanhados + 12 de acesso). Escala no Grupo = funil de lives + Expert Plan (plano de escala) + cálculo de sessões de venda; sem oficina de página e sem ensinar tráfego. Suporte durante a venda = Agente Vendedor Secreto. Ferramentas de treino divididas: Simulador de Conversas (o que falar) e Studio de Ensaio (como falar: grava 3 vezes, avalia e mede a evolução), com destaque pro Studio. Regra que separa os produtos: no Grupo o aluno faz com oficina e revisão; na Individual constrói junto e o time executa.
**Racional:** O entregável aciona a mentora: quem não entrega não ocupa agenda, e quem entrega recebe atenção na hora certa.
**Impacto:** `business/campanhas/incubadora-de-expert-grupo/setup-fase0.md` (pipeline Mentoring Creator, Fase 0). Pendências: versão aluno do Vendedor Secreto (V02 do Expert360), construir Simulador genérico e Studio, testar avaliação de tom por áudio, decidir se o Studio sai do Expert360º.

## 02/10/2026 — Black Expert v1.4: R$5.000 no dia 14, R$7.500 depois, oferta só na live
**Contexto:** Redesenho do Grupo mudou o que a Black vende; a Karol não quis cortar o valor pela metade de um programa com mais entregas.
**Decisão:** Preço da Black **R$5.000** (pix ou 12x no cartão), não mais R$2.500. **A partir de 15/10 o Grupo passa a custar R$7.500.** Meta: **4 vendas de R$5.000 (R$20 mil)**. A condição que não se repete é a oferta (entregáveis + bônus), não só o preço. **Nada da oferta antes da live de 14/10, às 15h.** Bônus: Desafio 5 Dias pra todos, com premiação pro vencedor (10 ferramentas da Biblioteca personalizadas); Funil de Vendas Secretas montado pros 3 primeiros; Central do Mentor pra quem paga à vista (escopo novo: do "sim" em diante); Agente do Método pro 1º (a confirmar). Disparos #3 a #9 reescritos com dores e desejos do Diagnóstico do Expert, em aprovação.
**Racional:** Manter o valor do programa novo e dar um motivo real pra decidir no dia (bônus + preço antes do aumento). Não vender antes da live preserva a força do pitch ao vivo.
**Impacto:** Doc mestre v1.4 e `copies.md` (revisão v2 no topo). Pendentes: aprovação dos disparos, carrinho abrir às 15h, #10 e #11, datas da premiação, página da Black.

## 02/10/2026 — Individual a R$15.000 e Sprint a R$5.000
**Contexto:** Fechamento das ofertas pras sessões de venda de 02/10.
**Decisão:** Mentoria Individual sai de R$13.500 pra **R$15.000 à vista ou 12x de R$1.500** (checkout `pay.voompcreators.com.br/16367/offer/waPZk3`). Bônus pra quem paga à vista: **a Karol participa junto da 1ª Venda Secreta do aluno** (desafio em grupo descartado: quem compra a Individual não quer grupo; gestão de tráfego descartada: benefício muito distante). Sprint do Método passa de R$3.000 pra **R$5.000** e inclui a criação do Funil de Vendas Secretas. Leitura da Karol: Individual = Sprint (feito junto) + acompanhamento de Posicionamento e Escala. Nome comercial nas apresentações: "Acelerador de Carreira no Digital".
**Racional:** A Individual entrega construção conjunta + execução do time; o preço reflete isso. O bônus à vista é exclusivo, individual e cai no momento de maior medo.
**Impacto:** Página da Individual publicada com o preço novo; `oferta-comercial-4-macrofases.md` v3.1; fichas de oferta, apresentações (Grupo e Individual) e mapa da jornada com comparativo Grupo × Individual em `incubadora-de-expert-grupo/` e `incubadora-de-expert-individual/`. Conferir página e checkout do Sprint com o valor novo.

## 03/10/2026 — Toda oferta terá bônus; Expert360º ganha sessão de Perfil do Expert
**Contexto:** Criação do agente Venda Sem Call (Worker Forge). O método prevê o "bônus de decisão rápida" (Script 23) e a Karol não tinha bônus definido pra maioria das ofertas. Também apareceu divergência no Sprint (documento de ofertas dizia 6 semanas/à vista; página dizia 8 semanas/12x R$500).
**Decisão:** Cada oferta pode ter um bônus. **Expert360º: 1 sessão individual gratuita de Perfil do Expert.** Individual mantém o bônus à vista (Karol na 1ª Venda Secreta do aluno). Demais ofertas: a Karol vai definir ao montar um arquivo único com todos os produtos. Sprint confirmado: **8 semanas, R$5.000 à vista ou 12x R$500** (o documento de ofertas foi alinhado com a página).
**Racional:** Dar ao agente (e à Karol) um motivo real pra decisão no dia, sem inventar urgência.
**Impacto:** `ecossistema-ofertas-jul2026.md` atualizado (Sprint 8 semanas + parcelamento + bônus). O agente Venda Sem Call só oferece bônus que estiverem documentados. Pendente: arquivo de produtos da Karol com os bônus de Express, VIP, Sprint, Grupo (fora da Black) e Diagnóstico Ferramentas.

## 05/10/2026 — Weekly: carrinho da Black às 15h, Agente do Método pros 5 primeiros, M3 pausado até 15/10
**Contexto:** Weekly review (adiada de 04/10), a 9 dias da Black Expert, com 6 entregas da campanha na semana.
**Decisão:** (1) Carrinho e página da Black abrem às **15h de Brasília**, junto com a live de fechamento. (2) **Agente do Método Autoral vira bônus dos 5 primeiros** (antes: 1º, a confirmar). Funil de Vendas Secretas segue nos 3 primeiros até a Karol revisar a oferta. (3) **Gravação/edição do M3 do Expert360º (A9-A13) pausada até 15/10.** (4) Gerador Social Lead não congela — Karol quer usar como ferramenta de apresentação; papel na Black a definir.
**Racional:** Coerência com "nada da oferta antes da live"; proteger o tempo da Karol pra fechar oferta, página e roteiro antes de 14/10.
**Impacto:** Doc mestre da Black ganha a seção v1.5. Cockpit #1 em pausa até 15/10. Próximo passo: levantar a oferta completa.

## 16/10/2026 — Retro da Black Expert: testar oferta menor no 1:1 antes de redesenhar o Grupo
**Contexto:** A Black Expert (14/10, R$5.000) fechou com 0 vendas e 0 checkouts. 226 convidados, 47 no grupo, 20 na live, 16 até a oferta. Das 7 conversas que não fecharam, 4 citaram valor ou momento. Os outros 3 motivos não eram preço (crença de que a área só funciona presencial, não entendeu a oferta, já está em outro programa). A Karol levantou a hipótese de que a persona, ainda fora do digital, não compra R$5 mil e pensou em enxugar o Grupo (6 meses, só a Validação, mais barato).
**Decisão:** Não redesenhar o Grupo agora. Primeiro testar no 1:1 um formato menor (Validação, 6 meses) com as leads quentes da Black. O Grupo a R$7.500 segue como está até o teste responder.
**Racional:** A amostra é pequena (16 no pitch, uma live só, grupo montado em 15 dias). A persona já comprou ticket alto da Karol no 1:1 (Sprint do Vagner, VIP do Tasso), e uma lead que recebeu o VIP de R$1.500 em fevereiro também não comprou. Então o preço pode não ser a única causa. Testar no 1:1 separa "não cabe no orçamento" de "não vê retorno".
**Impacto:** A retro em `business/campanhas/black-friday-grupo-2026/retro-black-expert.md` fica com as próximas ações. Falta a Karol definir o formato do teste (escopo, duração e preço).

## 17/10/2026 — Nasce a Incubadora Express (R$2.500, 6 meses); Método Express vira Destrava Expert - Sessão única
**Contexto:** A retro da Black Expert decidiu testar no 1:1 um formato menor antes de redesenhar o Grupo.
**Decisão:** Produto novo **Incubadora Express**: R$2.500, 6 meses de acesso, 5 sessões individuais liberadas pela entrega (S1 Diagnóstico + Roteiro, S2 Revisão do Método, S3 Checkup da Oferta, S4/S5 Raio-X de Venda), Expert360º e os agentes do método mais o Vendedor Secreto. **Sem oficinas** (eram da oferta da Black, que não vendeu) e **sem Funil de Vendas Secretas montado** (contratação à parte). A Karol grava o M3 (A9 a A13) a tempo. O antigo **Método Express** (sessão única) passa a se chamar **Destrava Expert - Sessão única**.
**Racional:** Testar se o preço era a barreira com uma oferta que a Karol entrega sozinha, sem prometer turma.
**Impacto:** Escopo em `business/campanhas/incubadora-de-expert-grupo/recorte-validacao-6-meses.md`. Gestor de Infra cria o produto e checkout na Voomp e o acesso de 6 meses. A troca de nome do Método Express precisa passar por páginas, contratos, Central, onboarding e KBs dos agentes de venda. Grupo segue a R$7.500.

## 18/10/2026 — Parceria com a Nanny em stand-by; garantia da Incubadora Express em 15 dias
**Contexto:** Weekly pós-Black. A Nanny tinha ficado de responder sobre a parceria em outubro. A Incubadora Express estava sem contrato e com garantia de 7 dias na Voomp.
**Decisão:** (1) Nanny em stand-by, sem acompanhamento ativo. (2) Garantia da Incubadora Express = 15 dias, devolução integral por qualquer motivo, mesmo com a S1 feita.
**Racional:** (1) A parceria seria um projeto paralelo, não uma aluna. Poderia dar dinheiro, mas tiraria o foco de fazer a Incubadora dar certo. (2) Fica igual à garantia que o Grupo já usa.
**Impacto:** Contrato em `business/juridico/contratos/09-incubadora-express.md` + PDF. Falta trocar a garantia do produto #17442 na Voomp. Nanny sai das pendências comerciais.

## 23/10/2026 — Conduz Agro: os 6 pilares do método definidos
**Contexto:** a atividade de autoavaliação da S2 (Plano de Aplicação Diária) pedia nota nos "6 pilares", mas nenhum arquivo do programa listava quais eram.
**Decisão:** os 6 pilares são técnica, comunicação, condução, negociação, posicionamento e segurança. Na apresentação de vendas a Milena resume em 3 (técnica, emocional e condução). O pilar técnica não tem módulo: é coberto pelo Agente de IA Técnico e pelas lives de casos práticos.
**Racional:** informado pela Karol; é o que o método trabalha por inteiro.
**Impacto:** nomes colocados na atividade da S2 nos scripts `apps-script-diario-aplicacao.gs` e `apps-script-plano-aplicacao-diaria.gs`; scripts rodados nas duas planilhas em 23/10. Depois a Karol mandou excluir a planilha antiga "Plano de Aplicação Diária" (tabela única), que foi pra lixeira do Drive pra não confundir com a versão do aluno; os guias passaram a apontar só pra versão do aluno.

## 23/10/2026 — Tasso: R$2.500 da due diligence sai de todo o material
**Contexto:** O valor veio de uma nota digitada no Encontro 1 (06/10, nota-q2-5: "due diligence R$2500") e foi repetido no Encontro 2, no Canvas e no documento de aprovação. O Tasso diz que nunca falou esse valor; Apresentação e Manual não trazem preço.
**Decisão:** Excluir o valor. Due diligence fica "em orçamento com o parceiro jurídico" até o Tasso informar.
**Racional:** Número sem fonte confirmada não entra em material do cliente.
**Impacto:** Canvas (já limpo ao vivo), documento de aprovação (5 trechos) e página antiga do Encontro 2 corrigidos. A nota original do E1 ficou como registro histórico.

## 24/10/2026 — Reels Mesarios: edicao fechada
**Contexto:** resposta ao comentario de uma mesaria, editada pelo Squad Edicao Euriliana (pirotecnia 2, legenda euriler, zoom misto).
**Decisao:** sem glowup (pedido da Karol depois da falta de memoria); comentario recriado como cartao sem o @ da autora; "politicagem/corrupcao" tratado sem nenhuma imagem partidaria; velocidade 1,05x.
**Racional:** proteger quem comentou, manter o tema servidor sem angulo partidario (persona dos sonhos) e caber na RAM do PC.
**Impacto:** video final em `Videos/edicao-euriliana/mesarios/saida/mesarios-final.mp4`; render longo passa a ser feito em partes em primeiro plano.

## 24/10/2026 — Padrao de edicao dos Reels da Karol
**Contexto:** Karol mandou 3 videos de uma vez pra editar sozinha enquanto saia.
**Decisao:** headline no meio da tela e sem legenda nos primeiros segundos; glow leve sempre (2 tentativas, se travar segue sem avisar antes); pirotecnia 2, legenda euriler, zoom misto como padrao.
**Racional:** preferencia dela; o glow so caia por falta de RAM.
**Impacto:** regra do glow em `.claude/rules/custom-do-aluno.md`; render longo feito em partes em primeiro plano.

## 25/10/2026 — Conduz Agro: pré-diagnóstico com 2 perguntas novas
**Contexto:** a Milena pediu pra ajustar as perguntas do Pré-Diagnóstico de Vendas.
**Decisão:** a pergunta 7 virou "Quais são suas principais dificuldades e desafios na profissão hoje?". Em "Sobre você" entraram, depois da urgência, "Como você espera ser visto(a) pelo produtor rural daqui 1 ano?" (texto livre) e "Qual o faturamento pretendido com a sua profissão para daqui 1 ano?" (campo curto).
**Racional:** a urgência fica colada na pergunta das dificuldades, porque pergunta sobre "resolver isso".
**Impacto:** site milenagehrke.com.br/pre-diagnostico republicado; Apps Script na versão 5 (mesmo link), com 2 colunas novas abertas depois da Urgência sem mexer nas respostas antigas. Testado ponta a ponta e a linha de teste foi apagada.

## 25/10/2026 — Node 26 e Python 3.14 como padrão
**Contexto:** a Karol pediu Python e Node na versão mais recente e o motor do Auroq atualizado.
**Decisão:** Node trocado do 24 LTS para o 26.12.1 (Current); Python 3.14.7 instalado ao lado do 3.12 e virou o padrão, com os mesmos pacotes reinstalados e testados.
**Racional:** "mais recente" foi o pedido; o 3.12 ficou de reserva pra nada da edição de vídeo quebrar se algum pacote der problema no 3.14.
**Impacto:** se algum script de vídeo/PDF falhar no 3.14, rodar com `py -3.12`. Auroq OS em 2.8.2.

## 25/10/2026 — Garimpeiro volta a usar o Apify só pra ler perfil
**Contexto:** o garimpo grátis travava: o Instagram bloqueava a leitura pública depois de 5 perfis e a conta referenciasgpt levou bloqueio no 1º perfil em todas as tentativas.
**Decisão:** Apify de volta só pra leitura de bio e posts (descoberta segue grátis pela busca no Google). Profissional da beleza sai dos termos (traz muita gente desqualificada).
**Racional:** custa ~US$1,26 por 100 perfis e é o único caminho que entrega as 4 perguntas pelos posts e escala pros alunos. Disfarçar a conta logada de "pessoa" foi descartado (é driblar a proteção do Instagram).
**Impacto:** rodada com teto de US$3 sem aviso; alunos usariam a conta Apify deles.

## 25/10/2026 — Garimpeiro troca a pergunta "Mostra a dor?" por "Vende só o próprio tempo?"
**Contexto:** a pergunta da dor dava "Não" em quase todo perfil (profissional liberal posta a dor do cliente, não a própria), então não separava ninguém.
**Decisão:** no lugar dela entra "Vende só o próprio tempo?" (só atende 1 a 1, sem produto que venda sozinho).
**Racional:** dá pra responder pela bio e pelo link quase sempre, e é exatamente o teto que a Incubadora resolve.
**Impacto:** aba recalculada (Alta 6 → 37 na 1ª leva). Quem já vende e-book, desafio ou curso perde 1 ponto, mas não é descartado.

## 25/10/2026 — Carrosséis de conteúdo passam a sair às 20h
**Contexto:** agendamento dos 6 carrosséis do dia.
**Decisão:** Karol pediu 20h, um por dia a partir de 26/10 (padrão do agendador era 12h).
**Racional:** horário que ela já usava no Rota100K.
**Impacto:** posts de 26 a 31/10 às 20h.

## 25/10/2026 — Aba Garimpo com cores por situação e colunas de sistema ocultas
**Contexto:** a Karol achou a aba Garimpo difícil de usar (feia, bagunçada, coluna demais).
**Decisão:** linha colorida pela situação (follow-up vencido em laranja forte, pronto pra abordar em laranja claro, em conversa em cinza claro, cliente em preto, descartado/perdido em cinza riscado), ordem por Prioridade (Alta → Baixa, descartados no fim), 18 colunas de sistema ocultas, aba "Garimpo - Legenda". Follow-up vence na Data Próxima Ação ou 3 dias depois da última interação (suposição do agente, a Karol pode mudar).
**Racional:** bater o olho e saber onde focar.
**Impacto:** cada rodada nova do Garimpeiro já entra ordenada e colorida.

## 26/10/2026 — Conduz Agro: pré-diagnóstico com 6 perguntas novas no resultado
**Contexto:** a Karol mandou mais perguntas da Milena pro Pré-Diagnóstico de Vendas (Emocional e Condução) e pediu que contassem no resultado final.
**Decisão:** 4 Emocionais (reação quando o produtor fecha com outro técnico, escala 0-10 de decidir e agir, como se sente ao apresentar orçamento, se cobra o que vale) e 2 de Condução (adaptar a conversa ao perfil do produtor, perceber se ele entendeu a explicação técnica). A trava sinalizada agora é a média de cada esfera: múltipla escolha pela opção mais segura (não pela letra), escala como nota/10; a do orçamento é aberta e não pontua.
**Racional:** as perguntas vieram com ordem de opção variada (às vezes a melhor é A, às vezes C), então a pontuação segue o sentido de cada resposta.
**Impacto:** milenagehrke.com.br/pre-diagnostico republicado (22 perguntas, "uns 8 minutos"); Apps Script versão 6 (mesmo link), 6 colunas abertas no lugar certo sem mexer nas 5 respostas reais. Testado ponta a ponta e as linhas de teste foram apagadas.

## 26/10/2026 — Agentes do método dos alunos saem do ChatGPT: página com código de acesso por aluno
**Contexto:** a OpenAI vai aposentar os GPTs (conta pessoal já não cria nem publica GPT novo) e o Google troca os Gems por Skills a partir de 17/11, ainda sem compartilhamento. Skill do Claude não tem link aberto fora de Team/Enterprise e expõe o método.
**Decisão:** o agente que a Karol entrega a cada aluno (pra ele compartilhar com os clientes dele) vira uma página só do agente, sem área de membros, com código de acesso por aluno e IA por API. Planilha controla código, vencimento e limite mensal de mensagens (trava no servidor, zera todo mês), mais teto de gasto na conta de IA do aluno.
**Racional:** não depender de regra de plataforma, cliente final sem conta nem configuração, método escondido, e o aluno não paga o uso de quem já saiu (código vence).
**Impacto:** entregável padrão novo pras ofertas; falta testar Haiku x Sonnet e construir o modelo. Detalhes em demandas-backlog.md.

## 26/10/2026 — Diagnóstico do Expert: "concorrentes" vira pergunta de perfis de referência com @
**Contexto:** "Quem são seus principais concorrentes?" voltava genérica (categoria, "não tenho").
**Decisão:** "Quais perfis da sua área você acompanha ou vê como referência no Instagram?" + ajuda "Cite de 2 a 3 @: quem faz algo parecido com você, quem você admira ou com quem você sente que é comparada." + exemplo "@perfil1, @perfil2, @perfil3". Fica na seção do negócio.
**Racional:** pegar com quem ela se compara, quem modela e nomes reais pra prospectar a Incubadora.
**Impacto:** no ar em diagnostico.incubadoradeexpert.com.br/diagnostico/ (26/10, publicado pela Karol); mesmo campo `concorrentes`, mesma coluna AA da planilha.

## 26/10/2026 — Rota100k Semana 13 sem a segunda-feira
**Contexto:** guia da Semana 13 (26/10 a 01/11) chegou no próprio dia 26.
**Decisão:** a Karol pulou a segunda; o plano cobre terça a domingo (36 posts).
**Racional:** pedido da Karol (motivo não informado).
**Impacto:** checklist do guia fica com 36 de 42; o pessoal das 15h usa histórias pouco usadas (venda fantasma, troféu, férias da expert, Receita Federal).

## 26/10/2026 — Coleta de métricas do Instagram renova a própria chave
**Contexto:** a chave de métricas do Instagram venceu em 23/10 e a coleta diária ficou parada de 24 a 26/10 sem ninguém perceber.
**Decisão:** a Karol gerou uma chave nova. O robô passou a renovar a chave todo dia, guarda a versão renovada cifrada no GitHub e abre um aviso (issue, que chega por e-mail) quando falha.
**Racional:** a chave vale 60 dias e nada renovava; a falha só aparecia na aba Actions.
**Impacto:** 24 e 25/10 preenchidos (alcance e visitas; seguidores em branco). Chave valendo até 25/12 e renovando sozinha.

## 27/10/2026 — Direct automático renova a própria chave
**Contexto:** a chave do Direct automático foi invalidada pela Meta e o Direct parou; a Meta devolve uma chave nova a cada renovação, então renovar só no robô das métricas não chegava ao site.
**Decisão:** Karol pediu pra colocar a renovação do Direct junto com a das métricas. Toda segunda o robô diário leva a chave renovada pra Vercel e republica o site da área de membros (autorização "robo-direct-instagram" criada pela Karol).
**Racional:** sem isso a chave vence em 60 dias e o Direct para sem aviso.
**Impacto:** Direct e métricas usam a mesma chave; se a renovação falhar, chega aviso por e-mail (issue no GitHub).

## 27/10/2026 — Reels "prospecção" com a fala inteira
**Contexto:** a 1ª edição tirava pausas e a frase "e também nas travas dos alunos", e a conferência final reprovou 4 cortes em cima da voz (fala contínua ali).
**Decisão:** manter a fala inteira (0–110,6 s), cortando só o "ok?" e a repetição do CTA; Karol tinha liberado passar de 90 s.
**Racional:** sem corte no meio da voz o vídeo passa na conferência; ficou ~2 s mais longo.
**Impacto:** vídeo final 1min51s a 1,05x, legenda 1 euriler laranja, headline caixa preta com PROSPECTA em laranja.

## 27/10/2026 — Sessão da Bruna sem radar na tela
**Contexto:** Bruna Camargo (nutricionista recém-formada, leiga de tudo, medo de ser julgada) teria notas perto de zero no radar do diagnóstico.
**Decisão:** não mostrar o radar; diagnóstico em conversa (automotivo → nutrição → persona), notas anotadas só pela Karol; uma dose de valor só ("sua combinação já é o começo do método"); mostrar o quê falta, nunca o como.
**Racional:** desenho zerado confirmaria o medo e a faria sair assustada; ideia demais a faria pensar sozinha e sumir.
**Impacto:** roteiro em business/campanhas/incubadora-de-expert-individual/sessoes-estrategicas/bruna-camargo-sessao.md atualizado (Etapa 2, ECROI R/O, objeção "parece muita coisa").

## 27/10/2026 — Sessão da Sandra Mello: radar na tela e Método VIP
**Contexto:** Sandra Mello (servidora, aluna da Arcane, SSI de ChatGPT/Claude "aberta a todos", sem persona/promessa/prova) respondeu o pré-diagnóstico em 27/10.
**Decisão:** mostrar o radar (o desenho torto, alto no fazer e baixo no Método, prova sozinho que falta direção); oferta Método VIP R$1.500 (3x R$500 pix, 7 dias de garantia).
**Racional:** executar é fácil pra ela; falta direção. Dificuldade é tempo, e os 3 encontros pontuais cabem nos 30 dias que ela quer.
**Impacto:** pré-diagnóstico importado no Diagnóstico do Expert; roteiro em business/campanhas/incubadora-de-expert-individual/sessoes-estrategicas/sandra-mello-sessao.md.

## 27/10/2026 — Bruna no CRM aguardando pagamento; leitura da SSI da Sandra
**Contexto:** Bruna Camargo disse na sessão que vai fechar. Para a Sandra, a Karol leu a SSI.
**Decisão:** Bruna cadastrada no CRM (origem sessao_estrategica, status follow_up_marcado, próximo contato 28/10), aguardando pagamento. Na Sandra: a SSI serve para a empreendedora; vende quando mostra as possibilidades de ter uma SSI no próprio negócio, não o uso prático da IA para leigos.
**Racional:** ensinar IA a leigo deixa a pessoa travada; mostrar a possibilidade gera vontade de contratar.
**Impacto:** dica entrou no roteiro da Sandra (só para a Karol). Oferta da Bruna não confirmada no CRM (roteiro previa Express R.500).

## 27/10/2026 — Apresentação da Incubadora Express publicada para envio
**Contexto:** Karol quis mandar a apresentação da Express para a Bruna, que disse que vai fechar.
**Decisão:** Versão de envio publicada em https://vendas.incubadoradeexpert.com.br/incubadora-express/ (noindex), com botão para o checkout Voomp 17442, leitura em rolagem no celular e sem o bônus de ação rápida ("fechando hoje, nesta conversa"), que só vale na sessão. A apresentação original da sessão ficou intacta.
**Racional:** O texto da sessão falava em "fechando hoje" e "te mando o link agora", que não fazem sentido num link enviado depois.
**Impacto:** Arquivo em business/campanhas/crm-reativacao-leads/paginas-vendas/site/incubadora-express/index.html (deploy dpl_BmGUKWrTTqimGxtXWrfasu9aqaNw). A Express ainda não tem mensagem de onboarding em business/processos/onboarding-pos-compra.md.

## 27/10/2026 — Onboarding da Incubadora Express
**Contexto:** Primeira venda da Express (Bruna) e o produto não tinha mensagem nem página de onboarding.
**Decisão:** Mensagem nova (seção 2c de business/processos/onboarding-pos-compra.md) e versão /express na página de onboarding (mesmo arquivo da Individual e do Grupo): 5 sessões, ritmo de 30 dias, 6 meses, sem oficinas, Studio, Simulador nem Kit de Scripts. Primeira entrega = DNA do Expert, como no Grupo (suposição). Dúvidas e agendamento pelo WhatsApp da Karol.
**Racional:** Reaproveitar a página e a mensagem do Grupo, tirando o que a Express não inclui.
**Impacto:** Publicação da página bloqueada pela permissão de deploy, espera o ok da Karol. A Central (mensagens-onboarding.html) ainda não tem a Express.

## 27/10/2026 — Onboarding da Express publicado
**Decisão:** Karol autorizou. Página onboarding.incubadoradeexpert.com.br/express e Central (mensagens-onboarding.html, seção Incubadora Express) no ar, conferidas.

## 28/10/2026 — Onboarding: promessa da Express e canal oficial do suporte
**Contexto:** Karol revisou a página /express de onboarding.
**Decisão:** promessa da Express passa a ser "30 dias até a sua primeira venda no digital" (sem "Secreta" na promessa; Venda Secreta segue como nome da etapa). WhatsApp (67) 99232-4690 é o suporte ao aluno e canal oficial de comunicação, em todas as versões da página (Individual, Grupo, Express). Topo da /express diz "Incubadora Express"; botões da Área e do DNA alinhados; Sessões 4 e 5 empilhadas.
**Impacto:** mensagem da Express na Central e no processo de onboarding com a promessa nova. Publicado e conferido no ar em 28/10.

## 29/10/2026 — Headline dos Reels vai no topo
**Contexto:** a headline de abertura ficava no meio da tela, em cima do rosto da Karol.
**Decisão:** a headline fica no topo, dentro da margem segura do feed (corte 4:5), em 2 linhas. Continua com caixa preta, letra branca e a palavra-chave em laranja.
**Racional:** aparecer no feed sem cobrir o rosto.
**Impacto:** vale para todas as edições de Reels (anotado em custom-do-aluno.md).

## 29/10/2026 — Card do Diagnóstico do Expert fica enxuto
**Contexto:** a pedido de "puxar as respostas" pra sessão, o card ganhou as perguntas de qualificação; a Karol não queria isso.
**Decisão:** card sem acompanha/prazo/quem decide/perfis de referência e sem promessa/provas (versão 13). Leads Diogo e Arley importados.
**Racional:** ela só precisa das respostas carregadas pra conduzir a sessão.
**Impacto:** mesmo link; processo atualizado em business/processos/sincronizar-pre-diagnostico-radar-expert.md.

## 29/10/2026 — Sessão da Juliana Pasqual: Método VIP
**Contexto:** Juliana (aluna da Arcane, esposa do Dr. Diogo, pediatra integrativo com o Método Presença) respondeu o pré-diagnóstico em 29/10.
**Decisão:** ofertar o Método VIP (a Karol decidiu): ela só precisa de direção e prioridade, a execução fica com o Auroq.
**Racional:** método com nome, tecnologia (app) e execução já existem; falta a ordem do que vem primeiro, e o Diogo tem pouco tempo.
**Impacto:** roteiro em business/campanhas/incubadora-de-expert-individual/sessoes-estrategicas/juliana-pasqual-sessao.md.

## 29/10/2026 — Juliana Pasqual no CRM aguardando pagamento do Método VIP
**Contexto:** sessão de vendas de 29/10 com a Juliana (pelo Dr. Diogo); ofertado o Método VIP.
**Decisão:** ela disse que vai fechar; lead cadastrado no CRM (origem sessao_estrategica, status em_conversa, mesmo padrão da Bruna), próximo contato 30/10 às 11h.
**Racional:** pedido da Karol.
**Impacto:** follow-up registrado; atualizar pra "fechou" quando o pagamento cair.

## 30/10/2026 — Hunt (Tasso, Método VIP): materiais reposicionados como assessoria de compra paga pelo comprador
**Contexto:** no Encontro 2 (23/10) a promessa "sem custo adicional para a compradora" caiu por risco de propaganda enganosa.
**Decisão:** a aba "Ajustes nos seus materiais" da página do Tasso foi refeita: 5% sobre o valor de compra, pagos pelo comprador no sinal, só se comprar; due diligence incluída; reforma e mudança fora da conta. Slides novos de Investimento e "Como você acompanha", falas de fechamento e objeções do preço.
**Racional:** pedido da Karol, com base no encontro.
**Impacto:** https://claude.ai/artifact/DisG8Kk7Dv6VhkMqXe8o7y (versão 16). Em aberto: se a Hunt divide algo com o corretor do vendedor.

## 30/10/2026 — Materiais da Milena no padrão atual do Expert360º, com o M4 puxando do relatório da Autoridade Tríplice
**Contexto:** a pasta da Milena tinha os materiais antigos, em branco e sem os prompts. O Agente da Autoridade Tríplice agora entrega Frase-Tese, bio, pilares editoriais, quadros, banco de ideias e roteiros-modelo.
**Decisão:** arquivos da Milena trocados pelos do curso, mantendo o que ela já tinha. No M4, Frase-Tese e bio registradas direto do relatório (sem o prompt das 5 opções), e a Linha Editorial usa os 5 pilares do relatório em vez de gerar 3 novos. M2.4 (3 Jornadas) fica de fora porque o agente do Processo Autoral já cria.
**Racional:** pedido da Karol; o relatório já traz esses resultados.
**Impacto:** a Milena tem os prompts prontos do M4.3 ao M4.7. Os outros alunos e o `_template` continuam na versão antiga.

## 30/10/2026 — M4 do curso: frase-tese e bio saem do Agente da Autoridade Tríplice
**Contexto:** a v2 do agente (20/10) entrega Tese Autoral com Frase-Tese e Bio; o M4 ainda mandava gerar 5 frases polarizadoras e bio em 3 linhas.
**Decisão:** M4.2 vira registro da frase-tese e da bio do relatório (com teste da voz alta); roteiro A3/A4, M4.1, M4.5 e descrições acompanham. Linha editorial e roteiros continuam gerados pelos prompts (o agente padrão não entrega pilares nem roteiros; o relatório da Milena traz porque a conversa dela foi além).
**Racional:** pedido da Karol ("atualiza o M4 do curso"), seguindo o mapa do handoff de 20/10.
**Impacto:** M4 pronto pra gravar com o agente atual. Falta publicar o site da área de membros com as descrições novas.

## 30/10/2026 — Modelo das alunas alinhado ao curso
**Contexto:** o `_template` e os M4 do David no repo estavam com a versão antiga, sem os prompts.
**Decisão:** o `_template` agora usa os materiais do curso (M0–M4, mais a planilha do M2.2 e o M3.5). Os M4 do David, que estavam em branco, viraram a versão do curso. Os alunos da estrutura antiga (Analía, Helio, Ricardo e Rodrigo) e os Drives deles ficaram como estavam, porque usam outro currículo.
**Impacto:** aluna nova já começa com os prompts. As descrições novas da A3 e da A4 do M4 só aparecem na área de membros depois do deploy.
