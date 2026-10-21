# Garimpeiro de Leads no Instagram — Foundation KB

> Montada pelo Worker Forge em 17/10/2026. Atualizar a cada descoberta (ator, campo, preço, problema).
> Regra-mãe: só fato público e verificável entra na lista. Campo sem dado = "não público", nunca suposição.

---

## 1. Visão do fluxo (v2 — custo zero, desde 18/10/2026)

```
Perfil de busca (por cliente: Karol ou aluno)
   ↓ termos da rodada
[1] Descoberta — WebSearch site:instagram.com (agente), sem login
   ↓ lista de @ (rodadas/candidatos-*.txt)
[2] Dedup (CRM + aba + rodadas) → página pública (nome, bio, seguidores, posts) → filtro mecânico
   ↓ agente responde fit 1-3 pela bio; fit 1 = Não → descarte
[3] Aprofundamento logado (referenciasgpt, Playwright + Chrome, teto 15/rodada) — só quem passou
   ↓ bio completa, link, categoria, últimos 6 posts → fit 4, Perfil, fato-gancho
[4] Classificação final: aderência/prioridade + 4 fits + Perfil + fato-gancho com fonte
   ↓
[5] Entrega: aba "Garimpo" (até 50) — bloco garimpo (A–R) + bloco rastreador (S–AI)
   ↓
Karol revisa → (Karol) Vendedor Expert escreve copy | (aluno) entrega para no fato-gancho
```

### 1.1 O que a página pública mostra sem login (testado 18/10/2026)
- `GET https://www.instagram.com/{arroba}/` com `User-Agent: Mozilla/5.0` → meta `description`:
  `"{seg} Followers, {seg} Following, {n} Posts - {Nome} (@{arroba}) on Instagram: "{bio}""`.
  Dá nome, bio, seguidores, seguindo e nº de posts. NÃO dá posts, link externo, categoria nem se é privado.
- Com User-Agent de Chrome completo a resposta veio vazia no teste — usar o curto (`Mozilla/5.0`).
- `i.instagram.com/api/v1/users/web_profile_info` sem login → 401 (fechado). Logado (de dentro da página, com `x-ig-app-id`) devolve tudo, incluindo os 12 últimos posts — é o que a fase 3 usa.
- Busca por hashtag (`/explore/tags/`) sem login → redireciona pro login.
- Volume: pausa de 2,5s entre perfis públicos. Se a página parar de trazer a meta, é bloqueio temporário → parar e tentar horas depois.

### 1.2 Descoberta grátis — o que funcionou (18/10/2026)
- WebSearch do Claude com `allowed_domains: ["instagram.com"]` devolve ~8 perfis por consulta. Vem sujeira (sindicato, cursinho, mentor de carreira) — o filtro e a classificação limpam.
- DuckDuckGo HTML (`html.duckduckgo.com`) devolveu só 1 perfil por consulta e o Bing não respondeu pra curl — não usar.
- Rende mais variando a consulta (cidade/UF, cargo + "servidora", frase de dor) do que repetindo o termo.
- **Teto prático da leitura pública (19/10/2026):** o Instagram pediu login depois de 8 perfis lidos, e a fase 3 logada levou 429 logo em seguida (mesma máquina/IP). Ler em lotes pequenos (≤10) espaçados por horas e não rodar a fase 3 logo depois de um bloqueio da fase 2.

### 1.3 Fase 3 — sessão logada
- `tools/logado.mjs` usa o pacote `playwright` (instalado em `tools/`, `node_modules` gitignorado) com `channel: 'chrome'` (Chrome instalado da Karol — não baixa navegador).
- Sessão persistente em `~/.auroq/garimpeiro/sessao-instagram` (fora do repo e do OneDrive). Conta: `referenciasgpt` (conferida por `ds_user_id` → `/api/v1/users/{id}/info/`).
- Janela visível de propósito (Chrome headless é mais fácil de ser marcado como robô).
- **18/10/2026, logo após o 1º login da referenciasgpt:** `/api/v1/users/{id}/info/` e `/api/v1/users/web_profile_info/` responderam **429** (excesso de pedidos); `/api/v1/accounts/edit/web_form_data/` respondeu 200 com o username → é por ele que o script confere a conta. Fase 3 depende do `web_profile_info`: testar com 1 perfil no dia seguinte antes de rodar lote. Se o 429 persistir, plano B = abrir a página do perfil logado e ler os posts da própria página (menos chamadas de API).
- Lista de seguidores (desde 18/10/2026): `/api/v1/friendships/{id}/followers/?count=50&search_surface=follow_list_page&max_id={cursor}`, de dentro da página logada. Devolve `users[]` (username, full_name, is_private) e `next_max_id` — sem bio e sem data de quando a pessoa passou a seguir. Costuma vir dos mais recentes pros mais antigos (comportamento comum, não documentado). Karol (@karolsenna._): 6.837 seguidores em 18/10/2026 → ~23 dias a 300/dia.

### 1.4 Rastreador de Leads Qualificados na aba (desde 18/10/2026)
Estrutura do "M3.5) Rastreador de leads qualificados" do Expert360º, com as perguntas de fit da Karol. Colunas S–AI:
Grupo · Tem anos de experiência na área? · Mostra a dor que a Incubadora resolve? · Já cria conteúdo profissional? · Quer ser autoridade na área? · Score de Fit (0-4) · Prioridade de abordagem · Perfil · Status · Data Última Interação · Próxima Ação · Data Próxima Ação · Fechou? · Valor · Data Fechamento · Depoimento · Observações.
- **Divisão de papéis (Karol, 18/10/2026):** Aderência (L) = "é do meu público?" · fit = "vale abordar agora?". As perguntas v1 da manhã (carreira clara / não vende método / sinal de transição / conteúdo) repetiam a Aderência e foram trocadas; as respostas v1 ficaram em `fit_v1` nas rodadas locais.
- Fit: Sim / Não / A avaliar. "A avaliar" e lead sem fase 3 → "Revisar: ..." em Observações (automático), dizendo o que olhar no perfil. "A avaliar" não penaliza a prioridade: ela usa a proporção de Sim só entre as respondidas (Alta exige 3+ respondidas; com 4 respondidas é igual à régua original). O Score (fórmula) continua contando só os Sim.
- **Dor inclui negócio paralelo (Karol, 19/10/2026):** negócio paralelo próprio ou estudo voltado a mudar de rumo (negócios/empreender) = Sim em "Mostra a dor?". Na 1ª revisão os 3 aprovados que caíram em Baixa eram assim. Estudar pra outro concurso não conta.
- Prioridade de abordagem: Alta = Score 4, ou 3 com aderência alta · Baixa = Score 0-1 ou aderência baixa · Média = resto.
- Coluna M virou "Postou nos últimos 30 dias?" (Sim/Não, a contar da data da rodada) — desempate. A prioridade 1-3 antiga segue só no JSON.
- O Garimpeiro preenche: Grupo, 4 fits, Prioridade de abordagem, Perfil, Status "Sem abordagem", Fechou? "Em aberto", Depoimento "Pendente", Observações "Revisar: ...". O resto é da Karol.
- **1ª aplicação (37 leads de 17/10):** Score 0 = 16 · 1 = 3 · 2 = 13 · 3 = 4 · 4 = 1 → Alta 4, Média 14, Baixa 19; 26 com "Revisar". Experiência e dor quase nunca aparecem explícitas no perfil — esperar muito "A avaliar" nessas duas.
- Score = `=SUMPRODUCT((T{n}:W{n}="Sim")*1)` — sem separador de argumento, funciona em pt-BR (REGRA-025 do Gestor de Infra).
- Menus suspensos em todas as colunas de opção (e em "Status revisão").
- "Renda que permite investir?" do modelo original saiu: não qualifica abordagem inicial (Karol, 18/10/2026).

---

## 2. Plataformas e Ferramentas

> **Histórico (até 17/10/2026):** as seções 2.1–2.5 e 10.1 descrevem a coleta via Apify, desligada em 18/10/2026 (REGRA-002). Ficam como referência caso a Karol decida voltar a pagar.

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
- Perfil privado: descarte (desde 21/10/2026 — a Karol não consegue mandar DM pra abordar). Só a leitura logada (fase 3) e a lista de seguidores mostram se a conta é privada; a página pública não.

### 2.5 API Apify — padrão de chamada
- Auth: header `Authorization: Bearer {token}`. Validar com `GET /v2/users/me`.
- Rodada curta (≤300s): `POST /v2/acts/{ator}/run-sync-get-dataset-items` com o input no corpo → devolve os itens direto.
- Rodada longa: `POST /v2/acts/{ator}/runs` → acompanhar `GET /v2/actor-runs/{id}` → `GET /v2/datasets/{datasetId}/items`.
- O endpoint síncrono tem teto de 300s; se estourar, a execução continua do lado da Apify — buscar pelo id da run em vez de rodar de novo (evita cobrança dobrada).
- Fonte OURO: https://docs.apify.com/api/v2/actor-run-sync-get-dataset-items-get.md

### 2.6 Orçamento por rodada (estimativa — validar na 1ª rodada real)
- Custo ≈ (resultados de coleta × US$0,0026–0,0027) + (perfis únicos enriquecidos × US$0,0026).
- **Medido (17/10/2026):** 180 posts + 104 perfis = US$0,70 → ~US$0,0025 por item coletado; 35 entregues = US$0,02 por perfil entregue.
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
- **Descartes:** blogueira · afiliado · "achadinhos" · quem compartilha rotina (lifestyle) · quem já vende curso grande · perfil de loja · coach com mentoria própria · estrangeiro.
- **Nacionalidade:** brasileiro em qualquer país está DENTRO; estrangeiro sai. Sinais de brasileiro: bio em PT-BR, "brasileira em...", conselho profissional brasileiro (CRP/CRM/OAB/CRC), WhatsApp +55. Português de Portugal sem sinal de brasileiro → baixa, com nota.

### 3.3 Régua de aderência
| Aderência | Regra |
|-----------|-------|
| Alta | Profissão clara na bio + ≥1 sinal de que atende/vende serviço + dentro da faixa de seguidores + nenhum sinal de produto digital próprio |
| Média | Profissão clara, mas falta sinal de serviço OU fora da faixa por pouco |
| Baixa | Profissão ambígua — vai pra lista só se faltar volume, marcado |
| Descarte | Bateu em qualquer descarte → não entra na entrega (fica no log da rodada) |

**Régua servidor/CLT (aprovada pela Karol 17/10/2026):** servidor e CLT ainda não vendem serviço, então não se exige link de agenda/consultoria.
| Aderência | Regra servidor/CLT |
|-----------|-------------------|
| Alta | Carreira clara (cargo, órgão, área, anos) + sinal de querer sair/empreender (transição, projeto paralelo, posts sobre mudar) |
| Média | Carreira clara, sem sinal de transição |
| Baixa / descarte | Concurseiro ainda estudando (sem cargo) · perfil só de meme/humor de servidor |

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
| Perfis de fora do Brasil (espanhol) | Hashtag sem acento é comum ao espanhol (ex: #psicologa → México, Espanha — rodada teste 17/10: 2 de 4) | Preferir termo com acento ou só-BR (#psicóloga, #psicologaclinica, #psicologabr, cidade/UF); descartar só ESTRANGEIRO — brasileiro morando fora está dentro (regra da Karol, 17/10); DDI estrangeiro sozinho não descarta |
| Custo do relatório menor que o real | `usageTotalUsd` da run não inclui cobrança por evento (17/10: marcou US$0,15, real US$0,70) | Resolvido 17/10: custo = uso mensal depois − antes (`/users/me/limits`) |
| Perfil descartado volta na rodada seguinte | Descartados não vão pra aba | Resolvido 17/10: `garimpo.mjs` também deduplica contra os JSON de `rodadas/` do mesmo cliente |

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
- ~~Destino dos alunos~~ — resolvido: planilha "Garimpo Alunos", aba por aluno, dedup contra o garimpo dele (§13).
- Crédito Free único pra Karol + alunos — decisão 17/10: ficar no grátis por enquanto; reavaliar com dado real.
- ~~Escrita na aba Garimpo~~ — resolvido: webhook n8n (§11).

---

## 9. Input real dos atores (input schema lido da API em 17/10/2026 — OURO)

| Ator | Campos | Obrigatório | Observação |
|------|--------|-------------|-----------|
| `apify/instagram-hashtag-scraper` | `hashtags` (array), `resultsType` (`posts`/`reels`/`stories`), `resultsLimit` (int, padrão 20), `keywordSearch` (bool) | `hashtags` | Hashtag sem `#`. `keywordSearch` não usado (não testado) |
| `apify/instagram-search-scraper` | `search` (string, vírgula separa termos), `searchType` (`place`/`user`/`hashtag`/`popular`), `searchLimit` (int, padrão 1), `liveSearch`, `enhanceUserSearchWithFacebookPage` | `search` | Padrão é `place` — SEMPRE passar `searchType: "user"` |
| `apify/instagram-profile-scraper` | `usernames` (array), `includeAboutSection` (bool, padrão false) | `usernames` | `includeAboutSection` cobra add-on de US$0,007/perfil — manter false |

---

## 10. Ferramentas do worker (`tools/`)

### 10.1 `garimpo.mjs` (v2, 18/10/2026 — sem Apify)
| Comando | O que faz |
|---------|-----------|
| `coletar --perfil X --candidatos {arquivo.txt}` | Fase 2: dedup → página pública → filtro mecânico → JSON da rodada (máx. 150 candidatos) |
| `coletar --perfil X --arrobas "a,b" [--termo T]` | Mesmo, com @ passados direto |
| `publico --arroba X` | Testa a leitura pública de um perfil |

- Arquivo de candidatos: `@arroba<TAB>termo` por linha, em `rodadas/` (gitignorada).
- Bloqueio temporário (página sem meta / redirect pro login) → para e lista em `nao_lidos`.
- Dedup da Karol lê `business/vault/supabase.md` (chave secreta) — a chave nunca é impressa.
- A versão com Apify está no histórico do git (até o commit de 17/10/2026).

### 10.1b `logado.mjs` (fase 3)
| Comando | O que faz |
|---------|-----------|
| `login` | Abre o Chrome na sessão do Garimpeiro; a Karol entra na `referenciasgpt` à mão; confere a conta |
| `conferir` | `{sessao_ativa, conta, conta_certa}` (sai com erro se não for a referenciasgpt) |
| `aprofundar --rodada X [--teto 15]` | Não descartados e ainda sem fase 3 → bio, link, categoria, privado, 6 posts; salva a cada perfil; para em 401/403/429 (exit 2) |

### 10.2 `planilha.mjs`
| Comando | O que faz |
|---------|-----------|
| `listar --perfil X` | Lê a aba de destino (cria aba + cabeçalho se não existir) |
| `enviar --rodada {arquivo}` | Valida fato-gancho/fonte e fit 1-3, ordena (prioridade, aderência), corta em 50, pula quem já está na aba, anexa A–AI e reescreve a fórmula do Score |
| `preparar --perfil X` | Cabeçalho S1:AI1 + menus suspensos + fórmula do Score (pode rodar de novo sem estrago) |
| `migrar --perfil X` | Preenche o rastreador das linhas antigas a partir das rodadas locais — só onde "Grupo" está vazio |

### 10.3 Formato do JSON da rodada (`rodadas/{data}-{hora}-{cliente}.json`, gitignorado)
```json
{
  "perfil": "karol", "data": "2026-10-17", "termos": ["psicologa"], "modo": "hashtag",
  "limite_por_termo": 60, "custo_usd": 0.31,
  "contagem": { "candidatos": 0, "duplicados": 0, "enriquecidos": 0, "descartados_filtro": 0, "para_classificar": 0 },
  "para_classificar": [
    { "@": "...", "link_perfil": "...", "nome": "...", "bio": "...", "link_externo": "...", "seguidores": 0,
      "posts": 0, "categoria": "...", "conta_comercial": true, "privado": false, "termo": "#psicologa",
      "origem": "hashtag", "post_da_hashtag": { "data": "...", "legenda": "...", "url": "..." },
      "posts_recentes": [ { "data": "...", "legenda": "...", "url": "..." } ],
      "fase": 2, "aprofundado_em": "(fase 3)",
      "fit_carreira": "Sim|Não", "fit_nao_vende": "Sim|Não", "fit_transicao": "Sim|Não", "fit_conteudo": "Sim|Não|vazio",
      "perfil_leitura": "Conector|Analista|Diretivo",
      "aderencia": "(agente)", "prioridade": "(agente)", "sinais": "(agente)", "motivo_nota": "(agente)",
      "fato_gancho": "(agente)", "fonte_gancho": "(agente)" }
  ],
  "descartados": [ { "@": "...", "nome": "...", "termo": "...", "motivo": "..." } ]
}
```

---

## 11. Infra da aba de garimpo (montada pelo Gestor de Infra em 17/10/2026)

- **Workflow n8n:** "Garimpo - planilha (webhook)" — id `XlJH1qP21KSzpueh`, ativo, em `n8n.karolsenna.com.br` (queue mode).
- **URL:** `POST https://webhook.karolsenna.com.br/webhook/garimpo`
- **Auth:** header `X-Garimpo-Token` — valor em `op://Claude/Garimpo - webhook n8n/credential` (credencial n8n `Garimpo - webhook token`, id `nG6NUQwEV9EdUZKV`). Sem token → 403.
- **Google:** usa a credencial OAuth "Google Sheets account" (`m2KgTQc2hm6x4Ob7`) — a mesma dos workflows do CRM.
- **Ações (corpo JSON):** `{acao: "abas"|"listar"|"criar_aba"|"anexar", planilha, aba, linhas}`. Desde 18/10/2026 (v2): `atualizar` (`intervalo` tipo `S1:AI1`, `linhas`, `formula`) e `validacao` (`regras: [{coluna, opcoes}]` → menus suspensos; o nó "Montar validacao" lê o sheetId da aba e só aplica em aba "Garimpo*"). `listar` lê `A1:AI5000`.
- **Travas:** só planilhas da lista `PLANILHAS_PERMITIDAS` (hoje: CRM da Karol); só abas cujo nome começa com "Garimpo"; `anexar` com 1–200 linhas; grava com `valueInputOption=RAW` (bio que começa com "=" não vira fórmula). `atualizar` com `formula: true` só aceita a fórmula do Score (`=SUMPRODUCT((X1:Y1="Sim")*1)`), o resto é RAW.
- **Não interfere no CRM:** os workflows `KEhDYSTPogtNSuuP` e `iLjCuQWklJsHJSQc` leem só `CRM!A2:P2000`/`CRM!A2:R2000`.
- **Testes de aceite (17/10):** sem token 403 · planilha fora da lista 500 · anexar na aba CRM 500 · listar abas 200.

### Colunas da aba
A–R: Data rodada · Cliente · Termo · Nome · @ · Link do perfil · Bio · Link externo · Seguidores · Categoria · Sinais · Aderência · Prioridade · Motivo da nota · Fato-gancho · Fonte do gancho · **Status revisão** (Karol: aprovado/descartado) · **Copy** (Vendedor Expert)
S–AI: bloco do rastreador de leads qualificados (ver §1.4)

---

## 12. Exemplos de classificação (régua §3.3 aplicada — perfis fictícios)

| Bio (fictícia) | Seguidores | Nota | Por quê |
|----------------|-----------|------|--------|
| "Psicóloga clínica · TCC · Atendimento online · Agende 👇" + link de agenda | 3.200 | alta / p1 se post recente | Profissão clara + vende serviço 1:1 + sem produto digital |
| "Nutricionista materno-infantil · mãe do Theo · consultório em Cuiabá" | 1.100 | alta | "Mãe" é contexto da Laura, não descarte |
| "Contadora há 15 anos · dicas de IR" sem link | 800 | média | Profissão clara, mas sem sinal de que atende/vende |
| "Advogada | Mentoria para advogadas iniciantes | Turma aberta" | 9.000 | descarte | Já vende mentoria/método próprio |
| "Achadinhos da Shopee · cupons todo dia" | 15.000 | descarte | Afiliado/achadinhos |
| "Minha rotina de mãe, casa e skincare" | 4.000 | descarte | Lifestyle/rotina como conteúdo principal |
| "Servidora pública · concurseira · estudando pra AFRFB" | 2.000 | baixa | Profissão, mas fala como aluna, sem experiência pra virar método (avaliar com a Karol) |

---

## 13. Destinos por cliente

| Cliente | Planilha | Aba | Dedup |
|---------|----------|-----|-------|
| Karol | CRM `1BD4L6toolVi17Of1PrwmNFnRQprk8obV6wWN_lLatn0` | `Garimpo` | Supabase `crm_leads.instagram` + aba |
| Aluno | "Garimpo Alunos" (criar no 1º aluno, conta da Karol) | `Garimpo - {Nome}` | Aba do aluno (+ CRM dele, se mandar) |

CRM da Karol em 17/10/2026: 301 leads, 49 com Instagram preenchido (32 com "@", 17 sem) — a normalização cobre os dois formatos.
