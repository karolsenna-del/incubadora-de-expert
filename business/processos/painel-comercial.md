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
