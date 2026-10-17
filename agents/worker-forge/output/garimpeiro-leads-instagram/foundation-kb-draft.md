# Garimpeiro de Leads no Instagram — Foundation KB (rascunho Fase 1)

> Rascunho do @knowledge-curator (17/10/2026). Vira `data/garimpeiro-leads-instagram-kb.md` na montagem.
> Regra-mãe: só fato público e verificável entra na lista. Campo sem dado = "não público", nunca suposição.

---

## 1. Visão do fluxo

```
Perfil de busca (por cliente: Karol ou aluno)
   ↓ palavras-chave/hashtags da rodada
[1] Coleta de candidatos (Apify — hashtag ou busca de usuário)
   ↓ lista de @ únicos
[2] Enriquecimento (Apify — Profile Scraper: nome, bio, link, seguidores, categoria)
   ↓
[3] Deduplicação (CRM da Karol: Supabase crm_leads.instagram)
   ↓
[4] Filtro de descarte + classificação de aderência/prioridade (critérios do perfil de busca)
   ↓
[5] Entrega: aba "Garimpo" (até 50 aprovados) + fato-gancho por linha
   ↓
Karol revisa → (Karol) Vendedor Expert escreve copy | (aluno) entrega para no fato-gancho
```

---

## 2. Plataformas e Ferramentas

### 2.1 Apify — visão geral
**O que é:** plataforma de "atores" (robôs prontos) que coletam dados públicos da web e devolvem em dataset JSON.
**Conta:** da Karol, token em `op://Claude/Apify/credential` (1Password, vault Claude). Ver vault do Gestor de Infra.
**Plano:** Free — teto de US$5/mês de uso. Ciclo atual: 26/09 → 25/10/2026 (consultado via `GET /v2/users/me/limits` em 17/10: US$0 usado).
**Login no Instagram:** os atores oficiais NÃO usam a conta da Karol — coleta pública, sem risco de bloqueio da conta dela.
**Doc oficial:** https://docs.apify.com/api/v2

### 2.2 Atores relevantes (preço conferido na API da Apify em 17/10/2026, faixa FREE) — fonte OURO

| Ator | O que devolve | Evento cobrado | Preço (Free) |
|------|---------------|----------------|--------------|
| `apify/instagram-hashtag-scraper` | Posts de uma hashtag (inclui `ownerUsername`) | por resultado | US$0,0026 |
| `apify/instagram-search-scraper` | Busca por termo (usuários, hashtags, lugares) | por resultado | US$0,0027 |
| `apify/instagram-profile-scraper` | Perfil completo (bio, link, seguidores, categoria) | por perfil | US$0,0026 |
| `apify/instagram-profile-scraper` add-on "About account" | Dados extras da conta | por perfil | US$0,007 (não usar por padrão) |
| `apify/instagram-scraper` (genérico) | Posts/perfis/hashtags por URL ou busca | por resultado | US$0,0027 |

Preços mudam por plano (tabela escalonada: Free > Starter > Scale > Business). Sempre reconsultar antes de orçar:
`GET https://api.apify.com/v2/acts/apify~{ator}` → `data.pricingInfos[-1].pricingPerEvent.actorChargeEvents`.

### 2.3 Estratégias de coleta de candidatos

**A) Hashtag → donos dos posts**
- Input típico: `{"hashtags": ["contadora"], "resultsLimit": N}`
- Cada post traz `ownerUsername`. Vários posts podem ser do mesmo dono → deduplicar @ antes do passo 2.
- Vantagem: pega quem POSTA sobre o tema (sinal de que produz conteúdo).
- Risco: hashtag genérica traz muita loja, blogueira, perfil de "achadinhos" → descarte alto.

**B) Busca de usuário por palavra-chave**
- `apify/instagram-search-scraper` com tipo de busca "user" e o termo (ex: "psicóloga clínica").
- Devolve perfis direto (menos desperdício que hashtag), mas a busca do Instagram prioriza nome/@, não bio.
- Histórico: a busca de usuário já quebrou e foi restaurada algumas vezes após mudanças do Instagram (changelog do ator oficial) — fonte PRATA.

**Recomendação inicial:** começar com A + B na 1ª rodada de teste com os mesmos termos e comparar taxa de aprovação por real gasto. Fixar a estratégia que render mais aprovados por dólar.

### 2.4 Enriquecimento (Profile Scraper)
- Input: `{"usernames": ["@1","@2",...]}` em lote.
- Campos usados: `username`, `fullName`, `biography`, `externalUrl`/`externalUrls`, `followersCount`, `followsCount`, `postsCount`, `isBusinessAccount`, `businessCategoryName`, `private`, `verified`, `latestPosts` (legendas recentes = fonte de fato-gancho).
- Perfil privado: guardar só o que é público (nome, @, bio) e marcar "privado" — não entra como prioridade alta (não dá pra validar).

### 2.5 API Apify — padrão de chamada
- Auth: header `Authorization: Bearer {token}`. Validar com `GET /v2/users/me`.
- Rodada curta (≤300s): `POST /v2/acts/{ator}/run-sync-get-dataset-items` com o input no corpo → devolve os itens direto.
- Rodada longa: `POST /v2/acts/{ator}/runs` → acompanhar `GET /v2/actor-runs/{id}` → `GET /v2/datasets/{datasetId}/items`.
- O endpoint síncrono tem teto de 300s; se estourar, a execução continua do lado da Apify — buscar pelo id da run em vez de rodar de novo (evita cobrança dobrada).
- Fonte OURO: https://docs.apify.com/api/v2/actor-run-sync-get-dataset-items-get.md

### 2.6 Orçamento por rodada (estimativa — validar na 1ª rodada real)
- Custo ≈ (resultados de coleta × US$0,0026–0,0027) + (perfis únicos enriquecidos × US$0,0026).
- Exemplo hipotético: 300 posts de hashtag → ~150 @ únicos → 150 perfis = US$0,78 + US$0,39 ≈ **US$1,17/rodada**.
- Quantos viram aprovados depende do descarte (desconhecido até testar). Se a taxa for 1 em 3, 150 perfis rendem ~50.
- Teto Free (US$5/mês) cobre ~4 rodadas assim. Karol + alunos estoura → decisão de plano é nível 3 (Karol aprova).
- Controle obrigatório: consultar `/v2/users/me/limits` antes de cada rodada; se a rodada estimada passar do saldo, parar e avisar.

### 2.7 CRM da Karol (deduplicação)
- **Fonte de verdade:** Supabase projeto `incubadora-de-expert` (`pxnbcbhgoewrwyreohki`), tabela `crm_leads`, coluna `instagram`. A aba "CRM" da planilha `1BD4L6toolVi17Of1PrwmNFnRQprk8obV6wWN_lLatn0` é espelho sincronizado por n8n a cada 15 min.
- Credencial: `business/vault/supabase.md` (REGRA-015 do Gestor de Infra — nunca usar credencial achada por grep).
- Leitura: `GET {url}/rest/v1/crm_leads?select=instagram&instagram=not.is.null`.
- Normalização do @ antes de comparar: minúsculo, sem `@`, sem `instagram.com/`, sem `/` e `?` finais, sem espaços.
- Dedup também DENTRO da aba Garimpo (não repetir quem já foi garimpado em rodada anterior, aprovado ou rejeitado).

### 2.8 Aba "Garimpo" (entrega)
- Fica na planilha do CRM, em aba própria. Nunca escrever na aba "CRM" (zona do robô n8n + zona do closer — ver tracker `crm-reativacao-leads`).
- Os jobs n8n leem a aba "CRM" pelo nome — aba nova não interfere, mas conferir o range dos 2 workflows (`KEhDYSTPogtNSuuP`, `iLjCuQWklJsHJSQc`) antes de criar.
- **Como escrever** (decisão da Fase 4):
  - Opção 1 (preferida): workflow n8n com webhook que recebe JSON e faz `values:append` na aba Garimpo — reaproveita a credencial Google OAuth que já funciona nessa planilha (testada 30/07).
  - Opção 2: Apps Script Web App vinculado à planilha (padrão já usado várias vezes; deploy é manual da Karol — REGRA-023, limite do classificador).
- Colunas propostas: Data rodada · Cliente (Karol/aluno) · Termo de busca · Nome · @ · Link do perfil · Bio · Link externo · Seguidores · Categoria · Sinais · Aderência (alta/média/baixa) · Prioridade (1-3) · Motivo da nota · Fato-gancho · Status revisão (vazio / aprovado / descartado) · Copy (Vendedor Expert)

---

## 3. Classificação

### 3.1 Perfil de busca (configurável por cliente)
Cada cliente (Karol ou aluno) tem um arquivo de perfil com:
- `termos`: hashtags/palavras-chave (trocam por rodada)
- `publico_alvo`: quem é lead bom (descrição + sinais)
- `descartes`: quem sai de cara
- `faixa_seguidores`: mín–máx
- `destino`: onde a lista vai
- `crm_dedup`: contra o que deduplicar

### 3.2 Perfil padrão da Karol (Incubadora de Expert)
- **Público:** quem tem profissão ou experiência de carreira e ainda não vende o próprio método (persona Laura).
- **Sinais positivos:** bio cita profissão; link de agendamento/WhatsApp/"consultoria"; 500–20 mil seguidores; posta sobre a própria área.
- **Descartes:** blogueira · afiliado · "achadinhos" · quem compartilha rotina (lifestyle) · quem já vende curso grande · perfil de loja · coach com mentoria própria.

### 3.3 Régua de aderência
| Aderência | Regra |
|-----------|-------|
| Alta | Profissão clara na bio + ≥1 sinal de que atende/vende serviço + dentro da faixa de seguidores + nenhum sinal de produto digital próprio |
| Média | Profissão clara, mas falta sinal de serviço OU fora da faixa por pouco |
| Baixa | Profissão ambígua — vai pra lista só se faltar volume, marcado |
| Descarte | Bateu em qualquer descarte → não entra na entrega (fica no log da rodada) |

**Prioridade:** 1 = aderência alta + post recente (≤30 dias) com fato-gancho forte · 2 = alta sem post recente ou média com gancho · 3 = resto.

### 3.4 Fato-gancho
- Um fato concreto e público do perfil que justifica a abordagem: frase da bio, tema de post recente, serviço oferecido.
- Sempre com a fonte ("bio", "post de 12/10").
- Proibido: deduzir renda, vida pessoal, problema que a pessoa não declarou.

---

## 4. LGPD e termos de uso

- Nome, @ e bio de prospect são dado pessoal. Base legal de prospecção B2B por dado público é discutível — manter mínimo necessário e só uso de abordagem.
- Lista NUNCA vai pro git (classificador "Sensitive-Source Provenance" já bloqueou commit de dado de terceiro). Arquivos temporários de rodada: scratchpad ou pasta no `.gitignore`.
- Quem pedir pra não ser contatado → marcar "não abordar" e nunca mais garimpar (lista de bloqueio por cliente).
- Os termos do Instagram restringem coleta automatizada. Os atores coletam só dado público e sem a conta da Karol; o risco jurídico/de plataforma é da operação, não da conta pessoal dela. Volume baixo (50/semana) reduz exposição.

---

## 5. Troubleshooting (conhecido de fonte externa — validar na prática)

| Problema | Causa provável | O que fazer |
|----------|----------------|-------------|
| Busca de usuário volta posts ou vazio | Mudança de endpoint do Instagram (já aconteceu no ator oficial) | Checar changelog do ator; cair pra estratégia por hashtag |
| Run síncrona dá timeout | Passou de 300s | Pegar o id da run e buscar o dataset; não rodar de novo |
| 401 na API | Token inválido/expirado | `GET /v2/users/me`; reler do 1Password |
| Campos de bio/link vazios | Perfil privado ou ator sem o campo | Marcar "não público" |
| Custo maior que o estimado | Hashtag genérica, muito @ repetido | Reduzir `resultsLimit`; usar termo mais específico |

---

## 6. Integrações

| Par | Método | Cuidado |
|-----|--------|---------|
| Apify → script local | API REST (Bearer) | Token só em variável de ambiente via `op read`, nunca em arquivo |
| Script → Supabase (dedup) | REST PostgREST, só leitura | Credencial do vault de negócio |
| Script → aba Garimpo | Webhook n8n (preferido) ou Apps Script | Nunca tocar a aba CRM |
| Aba Garimpo → Vendedor Expert | Leitura das linhas "aprovado" pela Karol | Só pros leads da Karol |

---

## 7. Fontes

| Fonte | Tier |
|-------|------|
| API Apify `/v2/acts/{ator}` (preços consultados 17/10/2026) | OURO |
| API Apify `/v2/users/me/limits` (conta da Karol) | OURO |
| Doc oficial Apify API v2 — run-sync-get-dataset-items | OURO |
| Tracker `business/campanhas/crm-reativacao-leads/tracker.md` (CRM, n8n, colunas) | OURO (interno) |
| `agents/vendedor-expert/data/vendedor-expert-kb.md` (colunas CRM, abertura por origem) | OURO (interno) |
| Changelog/issues do ator oficial `apify/instagram-scraper` (busca de usuário instável) | PRATA |
| Páginas da Apify Store / guias 2026 sobre preço e campos | PRATA/BRONZE |

Distribuição: ~70% OURO · ~20% PRATA · ~10% BRONZE.

---

## 8. Gaps

- Taxa real de aprovação por termo (só a 1ª rodada responde) → define custo por aprovado.
- Campos exatos do Search Scraper no modo usuário (conferir no input schema na 1ª execução).
- Para aluno: onde vai a lista e contra qual CRM deduplicar.
- Crédito Free único pra Karol + alunos — provável upgrade de plano (decisão da Karol).
- Escrita na aba Garimpo: n8n webhook vs Apps Script (decidir na montagem).
