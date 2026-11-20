# Painel Comercial — documento de trabalho

> Pedido da Karol (11/11/2026): trocar o CRM e o Garimpo em planilha por um painel visual e moderno, com os
> indicadores do funil (abordagens, respostas, sessões, vendas, tempo do lead até virar aluno).

## O que existe hoje (levantado em 11/11/2026)

- **Garimpo** (aba "Garimpo" da planilha CRM `1BD4L6...`): 156 leads. Status: 90 Abordagem feita, 5 Em conversa,
  1 Respondeu, 57 Sem abordagem, 3 Reprovado. Fechou? = "Em aberto" em todos. Só guarda a data da ÚLTIMA interação:
  não dá pra saber quando cada lead respondeu ou foi pra sessão.
- **CRM no banco** (Supabase `crm_leads`): 321 leads de outras origens (sessão estratégica, webinar, grupo, Black,
  WhatsApp, prospecção ativa). 94 com data de diagnóstico (sessão). Status: a_reativar, em_conversa,
  follow_up_marcado, fechou (6), desistiu. Histórico de contatos em `crm_followups` (132 registros).
- **Vendas**: painel Financeiro (`fin_lancamentos`, Voomp entra sozinha + lançamentos à mão).
- Modelo pronto pra copiar: painel Financeiro em membros.incubadoradeexpert.com.br/financeiro.html (login só da Karol).

## Proposta

1. Garimpo entra no banco, junto com o CRM (um lugar só pra todo lead, com a origem marcada).
2. Toda mudança de etapa grava data (abordado → respondeu → sessão → proposta → aluno / perdido), pra medir tempo
   entre etapas daqui pra frente. Passado: só o que tem data hoje (abordagem, diagnóstico, venda).
3. Painel na área de membros (`comercial.html`), login só da Karol: indicadores do funil, taxa de cada passagem,
   tempo médio até virar aluno, filtro por origem e período, quadro de leads por etapa (arrastar muda a etapa).
4. Fila de abordagem passa a gravar no banco.

## Decisões (Karol, 11/11/2026)

- [x] Mudança no banco aprovada ("ok A")
- [x] A: planilha se aposenta, painel vira o lugar de trabalho (aba Garimpo fica como arquivo)
- Correção: o pré-diagnóstico NÃO cai sozinho no banco (vai pra planilha de respostas); a sessão entra no CRM quando o lead é registrado com data de diagnóstico, ou arrastando no painel.

## Como ficou

- Banco: `crm_leads` ganhou `etapa`, `etapa_em`, `etapa_fonte`, `garimpo`, `produto`, `valor_venda`, `motivo_perda`; tabela `crm_etapas` (histórico). SQL: `business/campanhas/area-de-membros/sql/comercial.sql`, `-2`, `-3`.
- Muda sozinho: mensagem recebida no WhatsApp (→ Em conversa), data de diagnóstico preenchida (→ Sessão), matrícula ou venda paga na Voomp com o mesmo e-mail (→ Aluno; comprador fora do CRM entra como "Compra direta"), "Enviei" na aba Abordar (→ Abordado).
- Muda à mão: resposta no direct do Instagram, proposta, perdido, venda fora da Voomp.
- Painel: `site/comercial.html` + `js/comercial.js` + `css/comercial.css`; abas Indicadores, Leads (quadro), Abordar (fila). Login só da Karol.
- Garimpeiro: `planilha.mjs enviar` grava os leads novos no painel (perfil karol).
- Datas da migração são aproximadas (marcadas); o tempo até virar aluno só conta vendas com data certa.

## Checklist

- [x] Aprovação
- [x] Banco (aplicado e ensaiado com desfazer: WhatsApp, diagnóstico, matrícula, Voomp)
- [x] Migrar Garimpo (156: 155 novos + 1 que já estava no CRM)
- [x] Painel
- [x] Fila gravando no banco (aba Abordar)
- [x] Teste com dados reais (14 checagens ok) + fotos no computador e no celular 375px, sem erro e sem rolagem lateral
- [x] Publicado pela Karol em 11/11 (membros dpl_2BiKQovHWqCFKf2VLGNrGzFjgevw, Central dpl_8zPLKguNAibTtPRaevrKdAGrxzNt) e conferido no domínio
- [x] Central sem o cartão da planilha CRM (11/11, publicada e conferida)
- [x] Números clicáveis (11/11): cartões, funil, "agora" e tabela por origem abrem a lista de quem compõe o número (com quem passou / ficou parado, data da etapa e etapa de hoje); clicar na pessoa abre a ficha. Ensaio: listas batem com o número no computador e no celular, sem erro. Publicado e conferido (11/11)
- [ ] Marcar como Aluno as vendas que o painel não ligou: Método VIP 24/09, 27/10, 29/10 e Sprint 20/08, 14/09 (Voomp sem e-mail no CRM)

## Botão "Garimpar novos leads" (pedido da Karol, 13/11/2026)

Decisão: caminho A. O botão na aba Abordar grava um pedido. Um robô no computador da Karol confere os pedidos a cada
15 minutos e roda o Garimpeiro sozinho. Os termos ficam editáveis e vêm preenchidos com os do último garimpo.

- [x] Banco: tabela `garimpo_pedidos` (só a Karol lê e grava pelo painel) + semente com os termos da rodada 25/10
- [x] Painel: bloco na aba Abordar (termos, quantidade, botão, status do último pedido)
- [x] Robô: `agents/garimpeiro-leads-instagram/tools/pedidos.mjs` (pega o pedido, roda o Garimpeiro em modo automático, grava o resultado)
- [x] Agendador do Windows a cada 15 min (tarefa "Garimpo - pedidos do painel" → `tools/pedidos-agendado.vbs`; testado: vê o pedido rodando e espera)
- [x] Teste de ponta a ponta (13/11, pedido 2: fonoaudióloga, máx 10 → 10 leads novos no painel com mensagem, ~US$0,30)
- [x] Publicado pela Karol (dpl_Cwp4aaTeDnRJhaxympLWWDBEv7Gs) e conferido no domínio
- [ ] Conferir o 1º pedido que rodar pelo agendador (o teste rodou a partir da conversa; a chave do Apify vem do 1Password, que precisa estar desbloqueado)

## Fichas duplicadas do WhatsApp (13/11/2026)

- Causa: a mensagem do WhatsApp procurava a ficha pelo celular idêntico; com/sem o 9 (ou 55/00) criava ficha nova.
- Feito: 52 fichas "WhatsApp (chegou sozinho)" juntadas na ficha antiga da pessoa (2 alunos, 10 em sessão, 13 compradores
  de outro produto, 27 da lista da Black), mensagens levadas junto; Flávia Freitas (Garimpo + WhatsApp + pré-diagnóstico)
  juntada à mão e posta em Sessão; Rodrigo Teixeira ganhou nome/e-mail do cadastro de compradores.
- Correção no banco: `sql/whatsapp-sem-duplicar.sql` (compara DDD + 8 últimos dígitos; nome da agenda só entra em ficha sem nome).
  Antes: `sql/backup-crm_ingest_whatsapp_event-2026-11-13.sql`. Ensaio com desfazer: mensagem do Luiz sem o 9 caiu na ficha dele.
- Limite: lead do Garimpo só tem @, então quando ele chama no WhatsApp o sistema não tem como saber que é o mesmo (caso Flávia).
  O pré-diagnóstico vai pra planilha, não pro CRM.

## Coluna "Diagnóstico" (15/11/2026)

- Antes: quem respondia o pré-diagnóstico caía direto em Sessão (83 fichas), misturando quem fez sessão com quem sumiu.
- Agora: pré-diagnóstico → **Diagnóstico** (lista de recuperação). **Sessão** = fez a sessão (prova: gravação ou anotação
  da Karol); a Karol move o card depois da conversa. A dinâmica "Crie seu método em 1 hora" não conta como pré-diagnóstico.
- Separação feita com a Karol pelas gravações do Drive (pasta Meet Recordings + gravações por nome): 36 ficaram em Sessão,
  15 foram para Diagnóstico, 30 da dinâmica para Abordado (sessão oferecida e não aceita), Karen Altafini (VIP) e
  Rômulo Toledo (consultoria) para Aluno. 8 gravações achadas no Drive viraram o link da ficha.
- Banco: `sql/crm-etapa-diagnostico.sql` (etapa nova, gatilho do pré-diagnóstico, reclassificação com histórico corrigido).
  Ensaio com desfazer antes; teste: pré-diagnóstico novo → Diagnóstico, dinâmica → Novo.
- Cuidado aprendido: ligar gravação a ficha só pelo primeiro nome erra (Luciano da agência ≠ Luciano da Maxichip; Iza
  tinha gravação de outro encontro). Na dúvida, perguntar à Karol.
- [x] Publicado pela Karol (dpl_7f9BjUfyMd7YJQ6PtkNJU75jD57U) e conferido no domínio

## Expert Plan no painel (16/11/2026)

- Pedido: levar o Expert Plan (estratégico → tático → operacional) pro comercial/financeiro.
- Decisões da Karol: (B) primeiro plano montado pelo agente a partir das vendas reais, ela ajusta no painel;
  plano começa em dez/2026 (12 meses: dez/26 a nov/27); pode criar o lugar novo no banco.
- Contas iguais às da planilha M5.1 (`_gerar-expert-plan.py`): distribuição por estágio, conta de trás pra frente com ROUNDUP,
  1 sessão por venda, follow-up = sessões realizadas − vendas, capacidade de 6 sessões/semana.
- Realizado: vendas = CRM (etapa Aluno, produto da ficha); faturamento = financeiro (receitas no caixa − estornos);
  abordagens/sessões = histórico de etapas; follow-ups = anotações do CRM.
- [x] Banco: tabela `plano_expert` (1 linha, plano em JSON, só a Karol) — `sql/plano-expert.sql`
- [x] Primeiro plano gravado (VIP 2/mês, Express 1/mês, Sprint em meses alternados; estágio 2; meta 12 meses R$96.000)
- [x] Aba "Plano" no Comercial (`js/plano.js`): painel do mês, estratégico, tático, operacional, taxas reais x plano
- [x] Meta da semana no topo da aba Abordar
- [x] Teste local das contas (Node, dados reais: dez = 200 abordagens e 5 sessões por semana; salvar grava)
- [x] Publicado pela Karol (dpl_6WPkcfuJPWGzW7w6USMVbfX8pX1z) e conferido no domínio (arquivos novos no ar)
- Achado: a resposta real à abordagem é 4,3% (6 de 140) e conversa→sessão 9,1%; a planilha supõe 50% e 24%. Por isso o plano pede 200 abordagens/semana.
- 17/11 ajuste (Karol: "40 abordagens frias por dia é fora da realidade"): o 4,3% era do Garimpo (frio) e foi usado em Vendas Secretas (quente).
  Agora: Vendas Secretas = quente, resposta 50% (planilha) e fechamento 20% (real); Garimpo = funil frio à parte, conta de frente pra trás
  pela capacidade (8/dia útil, ritmo real de ~40/semana) e taxa da Karol (45 frias → 1 sessão marcada); vendas do Garimpo são extra, por cima da meta.
  Dez: 20 quentes + 40 frias por semana, 6 sessões (cabe); nos meses com Sprint dá 7 sessões (passou).
- [x] Ajuste publicado pela Karol (dpl_2LEYgzudUbX1pwp88A1X55azc9Lj) e conferido no domínio

## Quem engajou com o perfil entra na fila (18/11/2026)

- Pedido da Karol: trazer quem comentou e curtiu os posts dela, com o que falou, qual post e a mensagem pronta. Curtidas pelo Apify, sempre dentro do crédito grátis de US$5/mês.
- Garimpeiro: `tools/engajamento.mjs` (passo 2c da rodada). Origem no painel: "Engajou no perfil — rodada {data} (comentou/curtiu)"; `garimpo` ganhou "Grupo" e "Post do engajamento".
- Painel: cartão da aba Abordar mostra "Engajou com você" + link do post; quem engajou vem antes do frio na fila.
- [x] 1ª rodada no painel: 14 leads (12 curtiram, 1 comentou, 1 comentou e curtiu), conferidos no banco com mensagem e post
- [ ] Publicar o cartão novo (`comercial.js`): a trava automática barra o deploy, a Karol publica

## 1ª mensagem automática pra quem comenta (18/11/2026)

- Quem comenta num post (sem palavra-gatilho) recebe pela resposta privada oficial: "Oi! Vi seu comentário no meu post e quis passar aqui pra agradecer. Fiquei curiosa: o que você faz hoje?".
- Uma vez por pessoa. Não recebe: quem já está no CRM fora de "novo", resposta dentro de conversa de comentários, a própria conta. Quem estava em "novo" (garimpo) passa a "abordado".
- Entra no painel como "Abordado", origem "Comentou no Instagram", com o comentário guardado. A resposta da pessoa chega no Direct e a Karol segue a conversa à mão.
- Desligar: `ABORDAR_QUEM_COMENTA = false` em `site/api/webhook-instagram-dm.js` e publicar.
- Testado com 7 casos simulados e publicado em 18/11; falta conferir o 1º comentário real.

## Palavra LIVE dentro da live (18/11/2026)

- Comentário feito durante a live chega pelo campo `live_comments` do webhook, que o código ignorava: quem comentava LIVE na live não recebia o link. Corrigido em `webhook-instagram-dm.js` (só palavra-gatilho; comentário sem palavra na live não gera abordagem). A Meta só aceita a resposta privada enquanto a live está no ar.
- `live_comments` já estava assinado no painel da Meta (app "api" 1425049681635685 > Casos de uso > API do Instagram > Configuração da API com login do Instagram; conferido 18/11). Correção publicada em 18/11; prova real na próxima live.

## Meta x realizado semana a semana + sessões (18/11/2026)

- Pedido da Karol: meta x realizado desde novembro (meta de nov = 3 sessões realizadas por semana) e um jeito de lidar com remarcação e falta.
- Banco: `crm_sessoes` (`sql/crm-sessoes.sql`): cada horário é uma linha (marcada, realizada, faltou, remarcada, cancelada). Remarcar = a velha vira remarcada e nasce outra marcada (`remarcada_de`).
- Plano: `metasAvulsas` no JSON do plano (`{"2026-11": {"realizadas": 3}}`); quentes saem da mesma conta do plano (dá 20/semana), frias = capacidade do Garimpo (40/semana).
- Ficha do lead: seção Sessões (marcar, Realizada, Faltou, Remarcar, Cancelar). Faltou cria anotação "remarcar" pra amanhã e o cartão do quadro mostra "Faltou: remarcar".
- Aba Abordar: no topo, sessões que já passaram sem marcar, faltas sem remarcar e próximas sessões. Linha da meta conta sessões realizadas.
- Aba Plano: tabela "Meta x realizado, semana a semana" desde nov, com total do mês.
- Retroativo: 5 sessões de nov achadas nas anotações do Meet (Gemini) gravadas como realizadas (semana de 02/11). Faltam as que não tiveram anotação (Karol conta 7 nessa semana e 2 na de 09/11).
- Abordagem quente só conta se o lead passar por Abordado no painel; as feitas fora dele não aparecem.
- Testado com dados reais (contas e tela da aba Plano). [x] Publicado pela Karol (dpl_5fvHnn9y9a3ogJ4py1Kmwtm4wbM1) e conferido no domínio.
- 18/11 (Karol): quem engajou com o perfil (curtiu ou comentou) conta como abordagem QUENTE, porque deu o primeiro passo. Regra em `planoEhFrio` (plano.js): frio = Garimpo sem "Post do engajamento". Vale pra meta da semana, taxas reais e funil das vendas. Testado: semana de 16/11 passou a 3 quentes e 20 frias.
- 18/11 retroativo completo da semana de 02/11 (Karol): 5 realizadas + faltas do Benício (04 e 06/11) e do Alessandro (06/11 e 13/11, horário aproximado). Ronaldo, Dianessa e Bianca passaram de Sessão pra Proposta (sessão feita, Express apresentada). Notas novas da Karol na ficha de Fernanda, Juliani, Benício e Alessandro.
- Defeito achado e corrigido (banco, já valendo): o botão "Anotar" do painel nunca gravava — o check de `crm_followups.origem_registro` só aceitava closer/backfill_planilha. `sql/crm-followups-painel.sql` libera 'painel_comercial'.
- Topo da aba Abordar: "Faltou, falta remarcar" só lista lead que ainda não andou (até Sessão). [x] Publicado 18/11 e conferido no domínio.
- 18/11 limpeza dos Indicadores (Karol: "pode fazer a limpeza assim"): topo só com o que o funil não mostra (Vendas com R$, Do lead ao aluno, Tempo até virar aluno, Tempo até responder); funil com "Sessões feitas" = realizadas do registro de sessões (igual à aba Plano) e lista de faltas; nota embaixo separa quentes x frias com a taxa de resposta de cada uma; abordagem automática de quem comenta fora da conta. Teste 30 dias: 3 quentes (33% responderam), 149 frias (6%), 5 sessões feitas, 4 faltas. [ ] Publicar (Karol).

## Google Agenda → sessões (18/11/2026)
- Evento da agenda com convidado cujo e-mail é de um lead (o mesmo do pré-diagnóstico) vira sessão marcada sozinho, ao abrir o painel; o lead vai pra Sessão se estava antes disso.
- Mudou o horário na agenda → remarcada + nova marcada. Cancelou/apagou o evento (futuro) → cancelada. Realizada e Faltou continuam no clique da Karol.
- Sessão já registrada à mão no mesmo dia: liga ao evento e acerta o horário pelo da agenda (não duplica). Ignora: eventos antes de 01/11/2026, eventos de quem já era aluno no dia (mentoria) e eventos sem e-mail de lead. Janela: 60 dias pra trás e pra frente.
- Teste com a agenda real (19/11): 18 de 30 eventos com convidado batem com leads; de nov, entram as 6 sessões já registradas (horário acertado) e a da Flávia Freitas em 25/11.
- Peças: sql/crm-sessoes-agenda.sql (aplicado), api/agenda-sessoes.js, sincronizarAgenda() em js/comercial.js, env GOOGLE_AGENDA_ICAL na Vercel (business/vault/google-agenda.md).
- [x] Endereço secreto gravado na Vercel (19/11)
- [x] Publicado e conferido (19/11): 6 sessões de nov ligadas à agenda com horário acertado; Flávia 25/11 15:30 entrou sozinha

- 19/11: topo da aba Abordar se redesenha quando a etapa muda pela ficha (Benício virou Perdido e continuava em "falta remarcar" até recarregar). [ ] Publicar (Karol)

## Aba Conversas — WhatsApp de todos os chips (19/11/2026)
- Só leitura: lista de conversas (mais recente primeiro, filtro por chip, busca por nome/telefone/palavra), fio da conversa e "Abrir ficha". Faixa laranja = a última mensagem é da pessoa.
- Fonte: crm_whatsapp_events (recebedor em vendas.incubadoradeexpert.com.br/api/whatsapp-webhook). Chips ligados: 4690 (coexistência desde set/26, histórico desde abr/26) e 3543 (API). 7681 (pessoal) fica fora por decisão da Karol; 5536 (Paty/Hermes) fora por enquanto.
- Chip anotado no metadata (phone_number_id) a partir de 19/11; antes disso, até 19/10 = 4690, depois = "não identificado".
- Boas-vindas automática do 3543 passa a entrar na conversa (webhook-voomp grava o envio; a da Juliani de 19/11 foi lançada à mão).
- [x] Publicado e conferido no ar (19/11); ecos = 4690, reações fora da lista
- [ ] 4726 (comercial): trocar os aparelhos (decisão de 19/10) e depois ligar numa 3ª conta oficial

## Tempos de venda: "lead desde" (19/11/2026)

- **Tempo até virar aluno** agora conta desde que a pessoa virou lead de verdade, não desde que apareceu no painel.
  O início é a data **Lead desde** da ficha (a Karol preenche quando sabe, ex.: entrou no grupo de lives); sem ela,
  o registro mais antigo que o banco acha (função `crm_lead_vestigios()`: 1ª mensagem no WhatsApp, lista da live,
  captura de página, pré-diagnóstico, 1ª etapa, entrada no painel).
- Cartão novo **Da sessão à compra**: dias entre a etapa Sessão e a compra.
- Banco: coluna `crm_leads.lead_desde` + função `crm_lead_vestigios()` (só responde pra Karol), em `sql/crm-lead-desde.sql` (aplicado).
- Motivo: Sandra Mello é lead desde o começo do ano (grupo de lives), mas o painel só a conhecia desde o diagnóstico de 27/10; 12 dos 18 alunos tinham o 1º registro no dia da compra.

## Seguidores da Karol na fila (19/11/2026)

- Decisão da Karol: caminho A, só no crédito grátis do Apify. Seguidor conta como abordagem QUENTE (escolheu seguir).
- Robô: `agents/garimpeiro-leads-instagram/tools/seguidores-diario.mjs`. Agendador do Windows "Garimpo - seguidores diario",
  10h, roda assim que o PC ligar se perdeu o horário, 1x por dia. Lê ~50 seguidores pela referenciasgpt (continua de onde parou),
  qualifica pelo Garimpeiro (claude -p), escreve a mensagem e manda pro painel. Pula o dia se o Apify passou de US$3,50 no ciclo
  (deixa US$1,50 pro botão e pro garimpo de quem engajou) ou se tem garimpo do botão rodando. Log: `rodadas/seguidores-diario.log`.
- Painel: Grupo "Seguidor sem interação", origem "Segue você — rodada {data}", cartão com "Segue você"; fila = engajou → seguidor → frio;
  `planoEhFrio` não conta seguidor como frio.
- [x] Robô, `planilha.mjs` (grupo/origem do seguidor) e agendador criados
- [x] Publicado e conferido no domínio (19/11)
- [ ] 1º teste parou: a conta referenciasgpt está travada pelo Instagram ("tentativa de login incomum", Android, Volta Redonda, 17/11 04:05). A Karol precisa responder na conta; depois, rodar o robô de novo e conferir a 1ª leva na fila.

## Vendas da Voomp com valor e sem ficha duplicada (20/11/2026)

- A venda paga agora grava o valor (sale.amount) na ficha e procura a ficha antiga por e-mail → celular → nome (ficha sem e-mail, nome dela no começo do nome do comprador, só se for única); completa e-mail e celular. SQL: `sql/comercial-4.sql` (aplicado).
- Corrigido à mão (Karol confirmou): Tasso = Método VIP 24/09 R$1.500; Vagner = Sprint 14/09 R$3.000 (datas certas, não mais aproximadas); Juliani R$2.500; Thalita R$1.500 e a ficha da compra juntada na da prospecção de 21/09.
- Renata = "Seu método em 1h", R$97 (22/09), confirmado pela Karol. Pix de R$97 da Iza pela sessão fica só no financeiro (PJ, Outros); no painel ela segue como lead.
