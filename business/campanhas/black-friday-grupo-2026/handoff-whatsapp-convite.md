# Handoff — convite Black Expert por WhatsApp

**Status (30/09, 22h):** infraestrutura de envio PRONTA e testada (teste entregue). Envio aos 124 aguardando novo horário aprovado pela Karol  
**Responsável técnico:** Gestor de Infra Arcane  
**Data:** 30/09/2026

## Objetivo

Construir e validar a rota de disparo do convite individual da Black Expert pelo WhatsApp Business Platform/Dualhook, sem usar a fila antes da aprovação final da Karol.

## Dados privados locais

A fila não pode entrar no Git porque contém nomes e telefones. No computador principal da Karol, está em:

`business/vault/black-expert-2026/fila-api-dry-run/`

Arquivos esperados:

- `fila-revisao.csv` — 131 contatos únicos, personalizados e em `aguarda_confirmacao_karol`;
- `quarentena.csv` — 82 contatos excluídos da fila;
- `bloqueados.csv` — 53 registros novos, ainda sem validação;
- `resumo-dry-run.json` — contagens e verificações mecânicas;
- `README.md` — auditoria e dependências.

Se esses arquivos não existirem no ambiente atual, **não reconstruir nem inventar a lista**. Informar que o vault privado não acompanhou o clone e pedir acesso ao computador/pasta correta.

## Fonte da copy

`business/campanhas/black-friday-grupo-2026/copies.md`, seção “Disparo #1 — WhatsApp individual”.

Link aprovado do grupo:

`https://chat.whatsapp.com/D150ioiZPgfGuYgsSNIwBH`

## Estado técnico confirmado

- O endpoint `https://vendas.incubadoradeexpert.com.br/api/whatsapp-webhook` recebe mensagens/histórico e rejeita acesso sem segredo.
- Não existe rota documentada de envio de campanha.
- O dry-run não chama Dualhook/Meta e não envia nada.
- Nenhum template Meta foi confirmado como aprovado para esse convite.

## Trabalho pendente do Gestor de Infra

1. Ler o README e o resumo do vault local.
2. Auditar a documentação/API real disponível no Dualhook/Meta para envio ativo.
3. Confirmar se a conta possui template de marketing aprovado com variáveis compatíveis.
4. Construir uma rota idempotente de envio, com chave por campanha+telefone e registro de status.
5. Implementar limites de lote, retries seguros, opt-out e bloqueio da quarentena.
6. Testar exclusivamente com mocks/dry-run antes de qualquer destinatário real.
7. Não colocar nomes, telefones, tokens ou payloads privados no Git.
8. Não disparar sem confirmação explícita da Karol sobre lista nominal, horário, template e custo.

## Decisões ainda necessárias da Karol

- aprovação nominal da fila final;
- horário do disparo;
- rota Dualhook/Meta escolhida;
- template Meta aprovado;
- execução pessoal de eventual pagamento ou cadastro financeiro;
- autorização explícita do envio real.

## Critério de conclusão

A infraestrutura só estará pronta quando houver rota de saída real documentada, teste não faturável aprovado, idempotência comprovada e leitura de status. Uma fila CSV pronta, sozinha, não significa infraestrutura de disparo pronta.

## Atualização 30/09 — Gestor de Infra Arcane (infra construída)

- **Rota de saída:** Dualhook Runtime API (`https://api.dualhook.com/v25.0`, Graph-compatível). Chave `dh_live_` no 1Password: `op://Claude/Dualhook API/password`. WABA `624446197295808`, phone number ID `663604156841540` (+55 67 9232-4690, tier 2K, WABA verificada).
- **Pagamento:** Visa •••• 2767 vinculado à WABA Incubadora De Expert (Karol, 30/09).
- **Modelos Meta (MARKETING, pt_BR):** `black_expert_convite_grupo` ("Olá {{1}}…", id 2305836966819027, PENDING) e `black_expert_convite_grupo_sem_nome` ("Olá, tudo bem?…", id 27889941810685464, APPROVED). Link do grupo no corpo — Meta proíbe link chat.whatsapp.com em botão. Assinatura "Karol Senna" sem hífen (pedido da Karol).
- **Script:** `scripts/enviar-convite-whatsapp.py` — dry-run por padrão; `--teste`; envio real só com `--enviar --confirmo BLACK-EXPERT`; idempotente pelo log `business/vault/black-expert-2026/envios-whatsapp-log.csv`; exclui quarentena, bloqueados e `ja-recebeu-manual.csv` (7 convidados por Karol no 1:1); 1 msg/2s; para em erro de conta/limite. Dry-run: **124 pendentes (91 com nome, 33 sem nome)**.
- **Teste:** 2 tentativas às 08h12/08h39 falharam (1 status só — provável cartão recém-cadastrado). Às 21h57 o teste foi **sent → delivered**, sem erro, categoria marketing.
- **Observabilidade:** webhook republicado (dpl_Br5HevVaLSnEu2CNveP1gbfKzABJ, Karol rodou o deploy) a partir do commit publicado 78d3992 + 3 campos no safe-diagnostic (`status_values`, `status_errors` código/título, `status_pricing`) — sem telefone/texto. **Essa mudança ainda NÃO está commitada no branch `feat/dualhook-webhook`** (cópia em scratchpad da sessão) — replicar no branch antes do próximo deploy.
- **Pendente da Karol:** novo horário (11h de 30/09 passou sem envio). Proposta: 01/10 09h, antes da Live 32. Aprovação condicional já dada: enviar se o teste fosse entregue.

## Envio real — 01/10/2026, 09h00–09h09 (Cuiabá)

- Dry-run: 124 pendentes, 4 modelos APPROVED → usados os **v2 com negrito**: `black_expert_convite_grupo_v2` (91, com nome) e `black_expert_convite_grupo_sem_nome_v2` (33).
- API: **124 aceitos, 0 erros** (log `business/vault/black-expert-2026/envios-whatsapp-log.csv`).
- Webhook (eventos de status, 20 min): sent 198 · delivered 144 · read 27 · **failed 72** — contagem de EVENTOS (a Meta repete status), não de pessoas. Estimativa: ~2/3 entregues, ~1/3 falharam.
- Motivos das falhas: **131026 Message undeliverable (75%)** · 130472 número em experimento da Meta (12,5%) · 131049 limite de marketing por pessoa (12,5%).
- **9 respostas** recebidas em 30 min (crm_whatsapp_events, direção entrada) → `revisao_pendente` no CRM.
- **Gap:** o safe-diagnostic não registra o id da mensagem (wamid), então não dá pra saber QUEM falhou. Pra próximos envios: incluir `statuses[].id` no diagnóstico (não é dado pessoal) e cruzar com o log de envio.

## Página 1:1 atualizada — 01/10, 09h25

`business/vault/black-expert-2026/convite-whatsapp-black-expert.html` (privada, fora do git) regenerada com quem ficou de fora da API: **102 contatos** — adicionados pela Karol 49 · grupo/comunidade (decida você) 42 · relação incerta (decida você) 8 · clientes atuais/renovação 3. Excluídos: enviados pela API, já convidados no 1:1, opt-out, telefone inválido, próprio número, não lead. Mensagem = modelo v2 (nome + data em negrito). Marcações em localStorage `bx2`. Falhas de entrega da API não entram (sem wamid no diagnóstico → não dá pra saber quem).

## Migração Dualhook → Meta direto — 10/10 (em andamento)

- **Motivo:** teste grátis do Dualhook acaba 11/10; Karol quer cancelar. Envio do dia 14/10 vai pra TODOS os convidados (124 da API + os do 1:1), pelo chip atual (+55 67 9232-4690).
- **Feito:** script ganhou `--rota meta|dualhook` (padrão `meta` = graph.facebook.com, chave `op://Claude/Meta WhatsApp/password`, prefixo `EA`). Dry-run para na falta da chave — esperado.
- **Falta:** (1) Karol gera token de Usuário do Sistema (whatsapp_business_messaging + management, WABA 624446197295808) e salva no 1Password como "Meta WhatsApp"; (2) teste pro número da Karol pela rota meta; (3) só então cancelar Dualhook e repetir o teste; (4) modelo novo do dia 14 aprovado na Meta; (5) lista do 1:1 — marcações estão só no localStorage do navegador da Karol (`bx2`), precisa exportar.
- **Não confirmado:** se cancelar o Dualhook mexe no registro do número/coexistência. Respostas pro CRM dependem do webhook do Dualhook — sem ele, chegam só no app.
- **10/10 17h:** token "Meta whatsapp" (1Password, app "Incubadora WhatsApp", usuário do sistema) validado — lê número (GREEN, CONNECTED) e modelos. Teste rota meta pro número pessoal da Karol: **entregue**. Karol cancelando Dualhook (repetir teste depois).
- **Webhook:** só o app Dualhook está inscrito na WABA, com override pro NOSSO endpoint (`vendas.../api/whatsapp-webhook`). Pós-cancelamento: inscrever o app novo com o mesmo override (checar se o endpoint valida assinatura do app Dualhook).
- **Modelos do dia 14 (submetidos 10/10, PENDING):** `black_expert_dia_live` (id 1990515491632584, {{1}} nome, {{2}} link) e `black_expert_dia_live_sem_nome` (id 2075203829789801, {{1}} link). Texto aprovado pela Karol. Envio: **14/10 10h Brasília (9h Cuiabá)**, 1 mensagem só, pra todos os convidados (124 API + marcados no 1:1). Link da live: Karol vai criar.
- **Modelos da live (submetidos 10/10 ~23h, PENDING):** `black_expert_live_cade_voce` (2278534252927450) + `_sem_nome` (1854151595946503) → enviar 15h05–15h10 Brasília; `black_expert_live_oferta` (878335451935194) + `_sem_nome` (1325039736273919) → enviar no ponto alto da live. Link do Meet fixo no corpo, só {{1}} = nome. Script: `scripts/submeter-modelos-live.py` (`status` pra conferir). **Falta:** disparo dos dois durante a live — Karol estará ao vivo; definir quem roda o envio (o marido manda as mensagens do grupo) ou deixar agendado.
- **10/10 23h20 — os 4 modelos da live APROVADOS.** Script de envio ganhou `--mensagem convite|dia_live|live_cade_voce|live_oferta` (idempotência própria por mensagem; dia 14 vai pra fila + ja-recebeu-manual + `vault/.../convidados-1a1.csv` se existir). Dry-run: **131 contatos** (98 com nome). Envio escondido (sem janela na tela da live) via `scripts/envio-agendado.pyw` + Agendador do Windows (`scripts/agendar-whatsapp-live.ps1 -Oferta "HH:MM"`), log em `vault/black-expert-2026/envios-agendados.log`. Testado em dry-run pelo pythonw: ok. **Falta:** horário da oferta na live; export das marcações da página 1:1 (102 contatos, localStorage `bx2`) — sem isso eles não recebem.

- **11/10 — Lista 1:1 resolvida:** cruzamento do vídeo do WhatsApp da Karol com a página de convite → 94 convidados efetivos em `vault/black-expert-2026/convidados-1a1.csv` (fora: 7 da relação incerta + final 8896). Script ajustado: convidado 1:1 sai da quarentena/bloqueio no modo dia 14. Simulação `live_cade_voce`: 225 pendentes (150 com nome, 75 sem). Falta só o horário da oferta pra agendar (`agendar-whatsapp-live.ps1 -Oferta "HH:MM"`, até 14/10 9h Cuiabá).
- **11/10 — Agendado no Windows:** BlackExpert-1-dia-live (14/10 09:00 Cuiabá = 10h BSB), 2-cade-voce (14:07 = 15h07 BSB), 3-oferta (14:45 = 15h45 BSB). Lista: 226 (131 API + 95 1:1, inclui Etielle, nova do grupo de lives, já no segmento Resend). PC ligado e logado. Log: vault/black-expert-2026/envios-agendados.log
- **14/10, 11h20 Cuiabá — Reagendado no Windows:** 2-cade-voce 14:05 (15h05 BSB) e 3-oferta 14:15 (15h15 BSB, era 15h45) — roteiro encurtado, oferta abre ~15h17-19. Página `business/central-incubadora/black-expert-dia-14.html` atualizada com os horários (deploy na Vercel pendente).
