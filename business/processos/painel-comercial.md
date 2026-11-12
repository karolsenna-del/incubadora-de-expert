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
