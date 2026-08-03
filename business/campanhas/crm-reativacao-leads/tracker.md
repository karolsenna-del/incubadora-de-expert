# TRACKER — CRM Reativação de Leads (Comercial)

> Execucao viva do projeto. Todos os agentes leem e atualizam este arquivo.
> Playbook: —
> Cockpit: [cockpit](../../cockpit.md)

**Inicio:** 28/07/2026
**Deadline:** sem deadline definido
**Dono geral:** Karol
**Status:** Ativo

---

## FASES

| # | Fase | Status | Inicio | Fim |
|---|------|--------|--------|-----|
| 1 | Definicao do escopo | Done | 28/07 | 28/07 |
| 2 | Schema do banco (Camada Sistema: crm_leads + crm_followups) | Done | 28/07 | 28/07 |
| 3 | Importacao de dados das 4 fontes | Done — Forms + Hotmart (28/07) + grupo WhatsApp (30/07) | 28/07 | 30/07 |
| 4 | Interface planilha (zona robo / zona closer) + sync n8n | Done | 30/07 | 30/07 |
| 5 | Ativacao com o comercial | Nao iniciado | — | — |

**Fase atual:** 5 — Ativacao com o comercial. Arsenal de vendas do closer pronto (31/07). 7 paginas de venda no ar (02/08) — falta so ativacao efetiva do closer.

**Links das 7 paginas (site `vendas-incubadora` no Vercel):**
- Metodo Express (R$300): https://vendas-incubadora.vercel.app/metodo-express/
- Metodo VIP (R$1.500): https://vendas-incubadora.vercel.app/metodo-vip/
- Sprint do Metodo (R$3.000): https://vendas-incubadora.vercel.app/sprint-do-metodo/
- Grupo (R$5.000/12m): https://vendas-incubadora.vercel.app/grupo/
- Individual (R$10.000/12m): https://vendas-incubadora.vercel.app/individual/
- Expert360º (R$497): https://vendas-incubadora.vercel.app/expert360/
- Diagnostico Ferramentas (R$97): https://vendas-incubadora.vercel.app/diagnostico-ferramentas/

---

## CONTEXTO DO PROJETO

Karol contratou um comercial/closer pra reativar leads que fizeram sessao estrategica (diagnostico) e nao fecharam por falta de follow-up dela mesma. O CRM existe pra dar ferramenta de trabalho pro closer — nao so organizar dado, e permitir reativacao com contexto.

**3 fontes de lead:**
1. **Sessao estrategica (lead mais quente)** — diagnostico feito via Google Forms antes da sessao. Ainda nao esta no Supabase. Precisa: puxar respostas do Forms + IA gera resumo do lead (nicho, perfil, o que ja tentou, maturidade) pro closer nao comecar do zero.
2. **Compradores de outros produtos** (ex: workshop "Destrave seu curso online") — estao na Hotmart. Confirmado (28/07): a tabela `compras` do Supabase (criada na Fase 1 do Bootstrap 3) esta vazia — a automacao Fase 2 do Bootstrap 3 (que ligaria vendas futuras via webhook) esta pausada desde 08/07. Puxar o historico de compradores e importacao separada (backfill), nao existe ainda.
3. **Grupo fechado do WhatsApp** (participantes das lives) — Karol consegue puxar os numeros, nao os nomes. Ficha do lead pode nascer so com numero e ser enriquecida depois. Hipotese nao confirmada: Z-API (Fase 2 do Bootstrap 3, ainda pausada) pode ter endpoint pra listar participantes de grupo automaticamente — verificar com Dara/Gestor de Infra antes de assumir.
   - **Lista de bloqueio (30/07):** 6 numeros (mesmo bloco DDD 67, provavel spam/nao-lead) que a Karol pediu pra nunca importar deste grupo: `5567981422965`, `5567992337681`, `5567992324690`, `5567992356183`, `5567999949874`, `5583987897942`. Nao existiam no CRM — se aparecerem em proxima exportacao do grupo, excluir antes de importar.
   - **Importado (30/07 — Dara):** 51 numeros exportados pela Karol. 5 ja existiam como lead por outra origem (telefone bateu com sessao_estrategica/webinar_metodo_1h/comprador_outro_produto) — nao duplicado, virou followup de qualificacao ("também participa do grupo do WhatsApp"). 46 novos leads criados com `origem='grupo_whatsapp'`, so telefone (sem nome/email — enriquece depois). Fonte: https://docs.google.com/spreadsheets/d/1zAm2oarPRbDYl1MX6Ci_4jEUBybdmO1a4wQ8EYLWDVg

**Interface operacional (decidida em 28/07):** planilha (Google Sheets), nao Supabase direto — o comercial nao e tecnico. Modelo sugerido pelo Companion: colunas divididas em "zona do robo" (Supabase escreve via sync n8n — nome, contato, origem, nicho, perfil, o que ja tentou, maturidade, resumo gerado pela IA) e "zona do closer" (so ele escreve — status do lead, observacao de cada follow-up, proximo contato; um job separado le essas colunas e grava no Supabase). Evita sync sobrescrever o que o closer acabou de registrar.

**Reuso:** parte do backbone ja existe — Bootstrap 3 Fase 1 criou as tabelas `pessoas`/`capturas`/`compras` no Supabase (RLS + triggers), fechada em 04/07. Este projeto EXPANDE esse banco, nao cria um novo do zero.

---

## TAREFAS (fase atual)

| Tarefa | Dono | Status | Depende de | Notas |
|--------|------|--------|------------|-------|
| Desenhar schema expandido (Camada Sistema, nao mexe no core pessoas/capturas/compras) | Dara (data-engineer) | Done | — | crm_leads + crm_followups (migrations 001/002), 4 origens contempladas desde o inicio |
| Confirmar se Z-API consegue listar participantes de grupo do WhatsApp via API | Dara ou Gestor de Infra | Descartado | — | Karol exportou manual pelo WhatsApp Web (30/07) — nao precisa mais da automacao pra este import. Pode reaparecer se o grupo precisar de sync continuo no futuro |
| Construir automacao Google Sheets → Supabase (n8n) | Gestor de Infra Arcane | **Done (30/07)** | — | 2 workflows publicados no n8n (ativos, rodando a cada 15min). Ver detalhes abaixo |
| Criar a planilha operacional (arquivo) | Gestor de Infra Arcane | Done — 30/07 | — | Criada so com cabecalho (18 colunas da especificacao). O job do robo preenche os dados quando a automacao estiver pronta |
| Montar arsenal de vendas do closer (produtos, objecoes, provas, fluxo) | Companion | Done — 31/07 | — | `arsenal-vendas-closer.md`. Junto, repaginacao completa do ecossistema de ofertas (ver `docs/knowledge/expert-business/produto/ecossistema-ofertas-jul2026.md` + log-decisoes 31/07). |
| Criar copy das 7 paginas de vendas (uma por oferta: Metodo Express, Metodo VIP, Sprint do Metodo, Grupo, Individual, Expert360, Diagnostico Ferramentas) | Squad LPago Arcane | **Done — 7 de 7 aprovadas (01-02/08)** | Escopo fechado 01/08 | Substitui o item antigo "links de pagamento/checkout" — fechamento e no pix (exceto Grupo/Individual/Expert360), pagina serve pra apoiar decisao do lead, nao pra checkout automatizado. 7 arquivos de briefing+copy em `paginas-vendas/`. Metodo Express e Diagnostico Ferramentas usam garantia de 100% devolucao (sessao/entrega unica); as demais usam 30 dias. Expert360 vendido como curso completo apesar de M3/M4 ainda nao gravados (decisao 02/08, entrega progressiva). Ver log-decisoes 01/08 |
| Implementar as 7 paginas em page builder real (HTML/Vercel, mesmo padrao de lp-diagnostico-expert e lp-minitreinamento) | Gestor de Infra Arcane | **Done (02/08)** — 7 de 7 no ar, testadas (200 OK). CTA de Grupo/Individual/Expert360 apontando pro checkout real (Hotmart/Voomp); as outras 4 apontam pro WhatsApp | Copy das 7 paginas aprovada | SOP-018 criado no playbook do Gestor de Infra. Evento de pixel nas 3 com checkout trocado de `Contact` pra `InitiateCheckout` (mais preciso pra otimizacao de trafego pago no futuro). Links na secao abaixo |

---

## ESPECIFICACAO INTERFACE PLANILHA (Fase 4 — pronta pro Gestor de Infra Arcane, 30/07 — Dara)

Planilha operacional do closer (Google Sheets). Uma linha por lead. Coluna oculta `lead_id` (uuid de `crm_leads.id`) é a chave de sync dos dois jobs — nunca mostrar pro closer, só usar internamente.

### Zona do robô (sync Supabase → Sheets — só leitura pro closer, job sobrescreve sempre)

| Coluna na planilha | Fonte | Observação |
|---|---|---|
| `lead_id` (oculta) | `crm_leads.id` | Chave de sync — nunca editar |
| Nome | `crm_leads.nome` | Vazio pra quem só tem telefone (grupo_whatsapp) |
| Telefone | `crm_leads.telefone` | Já normalizado (só dígitos, DDI 55) |
| Instagram | `crm_leads.instagram` | — |
| Origem | `crm_leads.origem` + `origem_detalhe` | Concatenar pro closer entender de onde veio |
| Data do diagnóstico | `crm_leads.diagnostico_em` | Sinal de "quão frio" |
| Faturamento | `crm_leads.faturamento_mensal` | Sinal de fit de ticket |
| Urgência (1-10) | `crm_leads.urgencia` | Closer pode ordenar a planilha por isso |
| O que já tentou | `crm_leads.o_que_ja_tentou` | Evita repetir objeção descartada |
| Nicho | `crm_leads.nicho` | — |
| Maturidade | `crm_leads.maturidade` | — |
| Link da sessão | `crm_leads.link_sessao` | Closer abre com 1 clique |
| Resumo (IA) | `crm_leads.resumo_ia` | Primeira coisa que o closer lê |
| Último follow-up | `max(crm_followups.observacao)` por `created_at desc` | Somente leitura — histórico completo fica no Supabase, aqui só o mais recente |

### Zona do closer (sync Sheets → Supabase — só ele escreve, robô nunca sobrescreve)

| Coluna na planilha | Grava em | Regra de sync |
|---|---|---|
| Status | `crm_leads.status` (dropdown: a_reativar / em_conversa / follow_up_marcado / fechou / desistiu) | Job lê a célula, se mudou desde a última sync faz `UPDATE crm_leads set status = ...` |
| Observação (novo contato) | novo registro em `crm_followups` (`autor='<closer>'`, `origem_registro='closer'`) | Célula funciona como "caixa de entrada": job lê, se não vazia insere followup novo e LIMPA a célula (pra não duplicar na próxima rodada) |
| Próximo contato | `crm_followups.proximo_contato_em` do followup recém-criado (ou `crm_leads` se preferir campo separado — decisão do Gestor de Infra na hora de montar) | Só grava junto com uma observação nova |

### Direção dos 2 jobs n8n

1. **Robô → Sheets** (ex: a cada 15-30min ou on-demand): `SELECT` em `crm_leads` + último `crm_followups` por `lead_id`, upsert na planilha por `lead_id` (nunca toca nas colunas da zona do closer).
2. **Sheets → Supabase** (mesmo intervalo, depois do job 1): lê só as colunas da zona do closer, aplica `UPDATE`/`INSERT` como acima, nunca toca nas colunas da zona do robô.

**Regra de ouro (evita a bagunça clássica de CRM em planilha):** cada job só escreve na sua própria zona. Se o Gestor de Infra achar necessário um "carimbo" de última sync por linha pra evitar condição de corrida entre os 2 jobs, decisão dele — mas os 2 jobs nunca devem correr ao mesmo tempo sobre a mesma linha.

### IMPLEMENTADO E PUBLICADO (30/07 — Gestor de Infra Arcane)

Os 2 workflows estão no n8n (`n8n.karolsenna.com.br`), **ativos** (Schedule Trigger a cada 15min, também com Manual Trigger pra rodar sob demanda):

1. **"CRM - Robo to Sheets"** (id `KEhDYSTPogtNSuuP`) — busca `crm_leads` + último followup de `crm_followups`, lê a planilha atual (pra saber quem já existe e não pisar no Status do closer), e escreve via `values:batchUpdate` do Google Sheets: atualiza a zona do robô (colunas B-N) de quem já existe, cria linha nova pra lead novo (A-P, incluindo Status inicial), e só seta o Status de quem ainda está com a célula vazia — nunca sobrescreve Status já definido pelo closer.
2. **"CRM - Sheets to Supabase"** (id `iLjCuQWklJsHJSQc`) — lê a planilha inteira, compara o Status da linha com o Status atual no banco (detecta mudança), grava followup novo quando a coluna "Observação (novo contato)" tem texto, e limpa essa célula depois (funciona como caixa de entrada — só processa o que é novo).

**Seed inicial feito:** os 150 leads já estão na planilha (https://docs.google.com/spreadsheets/d/1BD4L6toolVi17Of1PrwmNFnRQprk8obV6wWN_lLatn0/edit), aba "CRM".

**2 bugs reais encontrados e corrigidos durante o teste (guardar como aprendizado de n8n):**
- **Execução por item:** nó HTTP encadeado direto depois de outro nó com múltiplos itens executa uma vez POR ITEM (não uma vez só) — "Get Followups" rodou 150x e estourou limite de requisições do Google. Fix: os 3 fetches (leads/followups/planilha) rodam em paralelo a partir do trigger, convergindo num nó "Merge" antes do código que combina tudo.
- **`queryParameters` no lugar errado:** pra um nó HTTP Request enviar `select`/`order`/etc pro Postgrest, `queryParameters` precisa estar no nível principal dos parâmetros do nó (junto de `sendQuery: true`), não dentro de `options`. Nesse lugar errado, o n8n aceita salvar sem erro mas simplesmente ignora os parâmetros — sintoma traiçoeiro (bateu na API mas sem filtro nenhum).

**Testado de ponta a ponta:** seed dos 150 leads, idempotência (rodar 2x não duplica), edição simulada do closer (mudança de status + observação) sincronizou pro Supabase certo e limpou a célula, e o ciclo completo (robô atualiza "Último follow-up" com o texto novo, sem pisar no Status). Dados de teste revertidos após validar (lead usado no teste foi só a Adriana Messias, status e followup de teste removidos).

**Planilha criada (30/07):** só com o cabeçalho, pronta pro job do robô popular.
https://docs.google.com/spreadsheets/d/1BD4L6toolVi17Of1PrwmNFnRQprk8obV6wWN_lLatn0/edit

### BLOCKER — credencial Google no n8n (30/07 — Gestor de Infra Arcane)

O n8n é self-hosted (servidor da Karol, Bootstrap 3 Fase 0) — diferente do n8n Cloud, ele não vem com credencial Google pronta. Pra ler/escrever na planilha, precisa de UMA das duas:

1. **Service Account** (recomendado pra automação sem interação humana recorrente): criar um projeto no Google Cloud Console (gratuito), ativar a API do Google Sheets, criar uma conta de serviço, gerar a chave JSON, e compartilhar a planilha com o e-mail da conta de serviço. ~10-15min, só feito uma vez.
2. **OAuth2** (login "Entrar com Google" direto no n8n): também exige criar um Client ID/Secret no Google Cloud Console primeiro (Google exige isso pra instâncias self-hosted, não é automático) — depois é só 1 clique de autorização no editor do n8n.

As duas exigem acesso ao Google Cloud Console da Karol pra criar o projeto/credencial — não dá pra fazer isso via API sem esse passo inicial no painel. Pendente: Karol escolher a opção e/ou confirmar que tem (ou quer criar) um projeto no Google Cloud.

**RESOLVIDO (30/07):** Conta de serviço bloqueada por política da organização (`iam.disableServiceAccountKeyCreation`) — trocado pra **OAuth2** (projeto "My First Project" da própria Karol, tipo Interno já que o domínio é Workspace — sem expiração de token, sem verificação do Google). Client ID/Secret criados no Google Cloud, credencial "Google Sheets account" criada no n8n.

**Achado de infra corrigido:** o n8n usa `WEBHOOK_URL` (`webhook.karolsenna.com.br`) pra construir a URL de callback OAuth, mas esse subdomínio só roda o processo `n8n-webhook` (que não implementa `/rest/oauth2-credential/callback` — só rotas de webhook de produção). Fix: adicionado `N8N_EDITOR_BASE_URL=https://n8n.karolsenna.com.br/` no `docker-compose.yml` do servidor (mesmo `.env` compartilhado pelos 3 serviços — n8n, n8n-worker, n8n-webhook) — separa a URL do editor/credenciais da URL de webhook. Containers recriados, backup do compose salvo (`docker-compose.yml.bak-20260730160807`). Documentado em `business/infra/bootstrap3-tracker.md`.

**Credencial testada e confirmada funcionando (30/07):** workflow de teste no n8n leu os metadados reais da planilha via API do Sheets (autenticação OAuth2 ok). Achado: a aba criada pela conversão CSV→Sheets (feita pelo Companion/Claude ao criar o arquivo) tinha `sheetId=647930954` e título `"Untitled"` — não era `gid=0` nem `"Sheet1"` como seria de esperar. Renomeada pra **"CRM"** via API. Workflow de teste deletado (arquivado + removido) depois de confirmar.

---

## ANALISE DO FORMS DE DIAGNOSTICO (28/07 — Dara)

Fonte lida direto do Drive: "Pré-diagnóstico do Seu Perfil de Expert. (Respostas)" (Google Sheets, id `1QXyhz4sAOblbXpqJS0fc0MCeACi7U6Q48a8N5GX3wDE`). 87 respostas lidas (linhas 4-88), header confirmado com 25 colunas.

**Achado importante — a planilha nao e homogenea:**
- Linhas ~4-51 (jan/2025 a jun/2026): respostas completas do formulario de diagnostico (23 perguntas)
- Linhas 52-53: registros esparsos so com nome/email + LINK + Observacao ("Fechou", "Comprou workshop")
- Linhas 54-88 (bloco de 2025/10/15 em diante): contatos so com nome/email/telefone, SEM diagnostico nenhum — varios marcados "Seu método em 1 hora" no LINK/Observacoes. Parece ser OUTRO tipo de sessao/oferta, capturado na mesma planilha. Precisa confirmar com a Karol se e origem separada.

**Confirmado: coluna "Observações" JA é o historico de follow-up/fechamento**, preenchido pela Karol ao longo de 1.5 anos: valores reais encontrados incluem "Fechou", "Fechou consultoria", "Comprou workshop", "Não quis em março", "Vai pensar", "Vai tentar", "FUP 6ª feira", "Lançamento", "Não teve", "Não autorizou gravar". Isso vira backfill de `crm_followups`, nao so contexto no jsonb.

**Classificacao das 23 perguntas do form (o que vira coluna vs o que fica so no jsonb):**

| Campo | Vira coluna propria? | Por que |
|---|---|---|
| Carimbo de data/hora | Sim (`diagnostico_em`) | Lead de jan/2025 pede abordagem diferente de um de jun/2026 — sinal de "quao frio" |
| Email/Nome/Celular | Vai pro hub `pessoas` | Identidade |
| Instagram (@) | Sim (`instagram`) | Closer confere o perfil antes de ligar |
| Faturamento mensal (**"renda"**) | Sim (`faturamento_mensal`) | Sinal direto de fit de ticket — texto categorico (ex: "Até R$2000", "Acima de R$10.000"), nao numero limpo |
| Urgencia (escala 1-10) | Sim (`urgencia`, numerico) | Sinal direto de prontidao pra comprar — o closer pode ordenar a fila por isso |
| O que ja tentou (e nao deu certo) | Sim (`o_que_ja_tentou`) | Pedido explicito da Karol — evita repetir objecao ja descartada |
| Nicho/perfil/maturidade | Sim, mas **derivados por IA** | Nao existe pergunta literal "nicho" — vem de resumir "visao geral do negocio" + sinais de maturidade (perfil de cliente definido? promessa definida? provas? tempo de expertise?) |
| LINK (da sessao) | Sim (`link_sessao`) | Closer abre com 1 clique — mistura URL real (Drive/Streamyard) e texto de agendamento, tratar como texto livre |
| Sexo, idade, seguidores, views, comentarios, lista de email/whats | Nao — fica so no jsonb | Nao muda a decisao do closer no primeiro contato; falta -> filtra por outra coisa se precisar depois |
| Visao geral do negocio, historia, dificuldade, meta, resultado esperado da sessao | Nao como coluna — insumo do `resumo_ia` | Texto rico, mas e material pro resumo gerado, nao pra filtro/busca direta |

**Pendente de confirmacao com a Karol:** as linhas "Seu método em 1 hora" (bloco 2025/10/15+) sao origem separada de reativacao, ou entram junto com "sessao_estrategica"?

---

## BLOCKERS

| Blocker | Desde | Impacta | Acao necessaria |
|---------|-------|---------|-----------------|
| — | — | — | — |

---

## LOG

> Mais recente primeiro. Cada entrada: data — agente/pessoa: o que fez.

- 03/08 — @companion: **Dados do PIX adicionados ao arsenal** (nova seção em "Páginas de vendas") — Karol passou o PIX pro closer fechar Express/VIP/Sprint/Diagnóstico Ferramentas direto na conversa: chave CNPJ 38.431.977/0001-36, titular "Gestão pra Tudo - Karoline Franzini de Carvalho Senna".
- 03/08 — @companion: **Revisão dos mapas de objeção (seções 6-8) pra cobrir gaps por origem.** Faltavam 2 pontes: (1) objeção de reativação pra quem veio do workshop e tentou criar o método sozinha sem sucesso — diferente da objeção de sessão estratégica, seção 8 agora tem as duas pontes lado a lado; (2) objeção de legitimidade do grupo do WhatsApp ("como você tem meu número?") — canal mais frio, sem opt-in comercial, agora com resposta transparente na seção 3. Tabelas de persona (Laura/Ricardo) revisadas e mantidas como estão — são genéricas por natureza, não precisam de origem.
- 03/08 — @companion: **Arsenal do closer ganhou seção de abordagem por origem do lead** (`arsenal-vendas-closer.md`, nova seção 3). Closer já foi acionado pra iniciar reativação — faltava orientar a abertura da ligação conforme a origem (sessão estratégica vs webinar vs comprador de outro produto vs grupo WhatsApp), já que cada uma tem grau de familiaridade diferente com a Incubadora. Destaques: sessão estratégica reabre citando a melhoria real da oferta (Grupo dobrou de 6 pra 12 meses de acesso); comprador de workshop pergunta primeiro se já criou o método — se sim, vai direto pro Sprint do Método; grupo WhatsApp trata a 1ª mensagem como enriquecimento de ficha, sem pitch imediato (número não é opt-in comercial). Seções renumeradas (3→11) pra acomodar a nova seção 3.
- 31/07 — @companion: **Entregáveis do Faço por Você, Individual e Grupo fechados e adicionados ao arsenal.** No processo, achado e corrigido: tracker do Expert360 dizia Fase 3 (agentes) "Não iniciado", mas os 6 agentes por P já existem e atendem alunas há meses (corrigido em `expert360-curso/tracker.md`). Grupo pode oferecer acesso a eles hoje; faltam construir só o Agente de Roteiro de Validação e o Agente de Feedback de Portfólio (Clone Karol restrito). Decisão completa em log-decisoes 31/07.
- 31/07 — @companion: **Arsenal de vendas do closer criado** (`arsenal-vendas-closer.md`) — produtos por perfil de lead, mapas de objeção (Laura + Ricardo + a específica de reativação), provas por objeção, fluxo de uso da planilha. No processo, repaginação completa do ecossistema de ofertas da Incubadora (2 eixos: vender vs. manter/escalar; novo produto "Faço por Você" R$3.000 + continuações; Grupo travado em R$5.000/12 meses; VIP, Express e Diagnóstico Ferramentas consolidados). Decisão registrada em log-decisoes 31/07, fonte oficial de produto em `docs/knowledge/expert-business/produto/ecossistema-ofertas-jul2026.md`. Pendente: links de pagamento/checkout e teste real do Método Express.
- 30/07 — @gestor-infra: **Fase 4 concluída — sync Planilha ↔ Supabase publicado no n8n.** 2 workflows ativos (schedule 15min): "CRM - Robo to Sheets" e "CRM - Sheets to Supabase". Seed inicial dos 150 leads feito na planilha. 2 bugs de configuração n8n encontrados e corrigidos no processo (execução por item causando 10.800 chamadas indevidas; `queryParameters` no lugar errado fazendo `select`/`order` serem ignorados silenciosamente). Testado ponta a ponta com edição simulada de closer — sincronizou e limpou célula corretamente. Detalhes completos na seção acima. Projeto passa pra Fase 5 (ativação com o comercial).
- 30/07 — @data-engineer (Dara): Rosiane Cavalcante Bezerra (5511987220049) — Karol confirmou que fechou tambem. Status atualizado a_reativar → fechou, followup registrado.
- 30/07 — @data-engineer (Dara): Confirmado com a Karol — os 6 numeros (DDD 67, ver secao CONTEXTO) nao vem de outra planilha, sao numeros que ela quer bloquear de qualquer import futuro deste grupo. Guardados como lista de bloqueio (nao existiam no CRM, nada foi deletado).
- 30/07 — @data-engineer (Dara): Karol identificou 3 numeros do grupo que ja eram alunos/leads conhecidos com telefone JA cadastrado (David Rose +14703835439 — sessao_estrategica/fechou; Rosiane Cavalcante Bezerra 5511987220049 — webinar_metodo_1h/a_reativar; Analía Arguello 5551995052419 — sessao_estrategica/fechou, pessoa_id ja linkado). Nao eram os mesmos numeros do arquivo importado — match direto por telefone confirmou identidade. Followup de qualificacao (mesmo padrao dos 5 anteriores) adicionado aos 3. **Pendente:** Karol tambem passou 6 numeros pra excluir (5567981422965, 5567992337681, 5567992324690, 5567992356183, 5567999949874, 5583987897942) — nenhum dos 6 existe em crm_leads nem estava no arquivo de 51 numeros importado. Perguntei se ela quer que eu guarde como lista de bloqueio pra proximos imports desse grupo, ou se ha um arquivo/lista diferente de onde esses numeros vieram.
- 30/07 — @data-engineer (Dara): **Import do grupo do WhatsApp concluido — Fase 3 (importacao das 4 fontes) FECHADA.** 51 numeros da planilha exportada pela Karol conferidos contra `crm_leads.telefone` e `pessoas.telefone` antes de inserir (dedup por telefone, mesma doutrina dos imports anteriores). 5 numeros ja eram lead por outra origem (Aline Feitoza — comprador_outro_produto; Mateus Cayres e Tasso Ramalho — sessao_estrategica; Gustavo de Paula e Ricardo Silva — webinar_metodo_1h): nao duplicado, cada um recebeu 1 followup de qualificacao (`origem_registro='backfill_planilha'`) confirmando presenca no grupo — sinal de engajamento extra pro closer. 46 leads novos inseridos com `origem='grupo_whatsapp'`, so telefone (sem nome/email — ficha nasce assim e enriquece na conversa). SQL idempotente (guard NOT EXISTS por telefone), executado via Supabase Management API, nao versionado como migration (e import de dado, nao alteracao de schema — mesmo padrao dos imports do Forms/Hotmart). **Total CRM agora: 150 leads** (104 anteriores + 46 do grupo). Proximo: Fase 4 — interface planilha (zona robo/zona closer) + sync n8n.
- 30/07 — @companion: Karol exportou os numeros do grupo fechado do WhatsApp pro Google Sheets (link registrado na secao CONTEXTO, fonte 3). Fase 3 desbloqueada pra importar a ultima fonte pendente — falta acionar o Dara.
- 28/07 — @data-engineer (Dara): Confirmado pela Karol: exclusao da Rayane correta, correcao da Analia ok, e os 3 emails "leandro*" sao o suporte dela (nao lead) — 3 registros de crm_leads (+ followups associados) removidos. `pessoas`/`compras` mantidos intactos (fato de pagamento real, ledger append-only nao se mexe so por causa de quem e o comprador). **Total final: 104 leads no CRM.**
- 28/07 — @data-engineer (Dara): **Import do Hotmart concluido** (`C:\Users\karol\Downloads\Vendas Hotmart.xls`, na verdade um .xlsx — 77 vendas, exportado via Excel COM pra CSV, parseado com TextFieldParser dado header com "Moeda" duplicada). **Achado importante: 27 das 77 vendas (Marketing Perinatal + Gestação Sem Dor) sao de outro produtor (Rayane Vilela Pereira) — Karol e so coprodutora. EXCLUIDAS do import** (nao sao leads/clientes da Incubadora de Expert). Das 50 vendas proprias da Karol: backfill de `pessoas` (32 pessoas, upsert por email) e `compras` (50 pagamentos, ledger completo — resolve a pendencia antiga da Fase 2 do Bootstrap 3 que nunca puxou historico) feito no CORE, nao no CRM. 4 pessoas identificadas como quem realmente fechou a mentoria via Hotmart (Incubadora de Expert/Combo Incubadora): Anália Arguello, Ramires Advogado, Helio Neto, Rodrigo Teixeira — `pessoas.status_geral='aluno_ativo'`. **Correcao aplicada:** Anália estava com status `a_reativar` no CRM (Forms so sabia "Comprou workshop") — Hotmart prova que ela fechou o Combo Incubadora 2x — corrigido pra `fechou` com nota no followup explicando o porque. 28 compradores de OUTRO produto (workshop/curso/infoproduto, nunca fecharam mentoria) processados: 6 ja existiam no CRM (linkados por pessoa_id), 22 novos leads inseridos (origem=`comprador_outro_produto`). 41 followups de historico de compra + 1 nota de correcao inseridos em `crm_followups`. **Total CRM agora: 107 leads, 5 fechou, 31 com pessoa_id linkado, 67 followups.** **Pendente de decisao da Karol:** 3 emails parecidos (leandropxml@gmail.com / leandronazevedo@gmail.com / leandroazevedo@incubadoradeexpert.com.br) podem ser a MESMA pessoa com emails diferentes — nao mesclado automaticamente (hub usa email como identidade unica, merge manual e decisao de negocio, nao tecnica).
- 28/07 — @data-engineer (Dara): **Import do Forms concluido.** 85 leads inseridos em `crm_leads` (50 sessao_estrategica + 35 webinar_metodo_1h). Status derivado das Observações: 4 fechou, 1 desistiu, 3 follow_up_marcado, 77 a_reativar (pool real de trabalho do closer). 25 followups historicos importados em `crm_followups` (backfill, origem_registro='backfill_planilha') a partir da coluna Observações. Gap encontrado e corrigido: faltava coluna `nome` em crm_leads (migration 002, com backfill). `nicho`/`maturidade`/`resumo_ia` sao v1 **rule-based** (montados a partir dos proprios campos do form, nao prosa gerada por IA) — funcional pro closer usar ja, pode ser refinado depois se a Karol quiser algo mais narrativo. Regra aplicada e CONFIRMADA pela Karol (28/07): "Comprou workshop" NAO fecha o lead pra mentoria — status fica `a_reativar`. Contexto: o workshop era lancamento pago pra venda da propria mentoria (nao produto separado) — quem comprou o workshop e alvo primario de reativacao, nao um "fechou". Scripts em `business/campanhas/crm-reativacao-leads/migrations/` (001, 002) + payload/CSV brutos no scratchpad da sessao (nao versionados).
- 28/07 — @data-engineer (Dara): Migration 001 aplicada no Supabase (`incubadora-de-expert`, projeto estava INACTIVE/hibernado, restaurado via Management API antes de aplicar). Tabelas `crm_leads` e `crm_followups` criadas e verificadas (colunas + RLS ativo confirmados por query). Origem `webinar_metodo_1h` confirmada pela Karol — leads da palestra "Seu Método em 1 Hora". Migration em `business/campanhas/crm-reativacao-leads/migrations/001_crm_leads_followups.sql`.
- 28/07 — @data-engineer (Dara): Analise do Forms de diagnostico feita direto no Drive (87 respostas lidas). Achado: coluna Observações ja e historico de follow-up (vira backfill de crm_followups); planilha mistura 2 populacoes (diagnostico completo + bloco de contatos so nome/email/telefone da palestra). Campos mapeados: coluna propria vs jsonb (ver secao ANALISE DO FORMS acima).
- 28/07 — @companion: projeto criado. Escopo definido em conversa (3 fontes de lead, resumo automatico, planilha com zona robo/zona closer). Handoff pro Dara (data-engineer) preparado.

---

## METRICAS (se aplicavel)

| Metrica | Baseline | Meta | Atual |
|---------|----------|------|-------|
| Leads reativados pelo comercial | 0 | — | 0 |
| Leads no CRM (total) | 104 (28/07) | — | 150 (30/07) |

---

## RETRO (preencher ao concluir)

> Companion preenche com o expert quando o projeto termina.

1. **Deu o resultado esperado?**
2. **O que funcionou?**
3. **O que faria diferente?**
