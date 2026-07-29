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
| 3 | Importacao de dados das 4 fontes | Em andamento — Forms + Hotmart importados (28/07) | 28/07 | — |
| 4 | Interface planilha (zona robo / zona closer) + sync n8n | Nao iniciado | — | — |
| 5 | Ativacao com o comercial | Nao iniciado | — | — |

**Fase atual:** 3 — Importacao de dados. Falta: grupo WhatsApp.

---

## CONTEXTO DO PROJETO

Karol contratou um comercial/closer pra reativar leads que fizeram sessao estrategica (diagnostico) e nao fecharam por falta de follow-up dela mesma. O CRM existe pra dar ferramenta de trabalho pro closer — nao so organizar dado, e permitir reativacao com contexto.

**3 fontes de lead:**
1. **Sessao estrategica (lead mais quente)** — diagnostico feito via Google Forms antes da sessao. Ainda nao esta no Supabase. Precisa: puxar respostas do Forms + IA gera resumo do lead (nicho, perfil, o que ja tentou, maturidade) pro closer nao comecar do zero.
2. **Compradores de outros produtos** (ex: workshop "Destrave seu curso online") — estao na Hotmart. Confirmado (28/07): a tabela `compras` do Supabase (criada na Fase 1 do Bootstrap 3) esta vazia — a automacao Fase 2 do Bootstrap 3 (que ligaria vendas futuras via webhook) esta pausada desde 08/07. Puxar o historico de compradores e importacao separada (backfill), nao existe ainda.
3. **Grupo fechado do WhatsApp** (participantes das lives) — Karol consegue puxar os numeros, nao os nomes. Ficha do lead pode nascer so com numero e ser enriquecida depois. Hipotese nao confirmada: Z-API (Fase 2 do Bootstrap 3, ainda pausada) pode ter endpoint pra listar participantes de grupo automaticamente — verificar com Dara/Gestor de Infra antes de assumir.

**Interface operacional (decidida em 28/07):** planilha (Google Sheets), nao Supabase direto — o comercial nao e tecnico. Modelo sugerido pelo Companion: colunas divididas em "zona do robo" (Supabase escreve via sync n8n — nome, contato, origem, nicho, perfil, o que ja tentou, maturidade, resumo gerado pela IA) e "zona do closer" (so ele escreve — status do lead, observacao de cada follow-up, proximo contato; um job separado le essas colunas e grava no Supabase). Evita sync sobrescrever o que o closer acabou de registrar.

**Reuso:** parte do backbone ja existe — Bootstrap 3 Fase 1 criou as tabelas `pessoas`/`capturas`/`compras` no Supabase (RLS + triggers), fechada em 04/07. Este projeto EXPANDE esse banco, nao cria um novo do zero.

---

## TAREFAS (fase atual)

| Tarefa | Dono | Status | Depende de | Notas |
|--------|------|--------|------------|-------|
| Desenhar schema expandido (Camada Sistema, nao mexe no core pessoas/capturas/compras) | Dara (data-engineer) | Em andamento | — | Ver ANALISE DO FORMS DE DIAGNOSTICO abaixo |
| Confirmar se Z-API consegue listar participantes de grupo do WhatsApp via API | Dara ou Gestor de Infra | Nao iniciado | — | Hipotese, nao fato — nao assumir sem checar doc oficial da Z-API |
| Construir automacao Google Sheets → Supabase (n8n) | Gestor de Infra Arcane ou operador-automacoes (Bootstrap 3) | Nao iniciado | Schema fechado | Fora do escopo do Dara — precisa autorizar Google no n8n |

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

---

## RETRO (preencher ao concluir)

> Companion preenche com o expert quando o projeto termina.

1. **Deu o resultado esperado?**
2. **O que funcionou?**
3. **O que faria diferente?**
