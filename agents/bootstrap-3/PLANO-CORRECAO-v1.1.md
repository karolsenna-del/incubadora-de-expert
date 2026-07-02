# Plano de Correção — Squad Bootstrap 3 (v1.1)

> Levantado a partir da 1ª execução real ponta a ponta (aluno: Euriler/Arsenal Trader, 27/06/2026).
> Cada item = um atrito/bug que apareceu na prática. Fonte: `business/infra/bootstrap3-tracker.md`.
> Legenda severidade: **P0** = trava o aluno (processo falha) · **P1** = atrito (confunde/atrasa, dá pra contornar) · **P2** = cosmético/melhoria.
> Status: ✅ já corrigido na sessão · ⬜ pendente.

---

## Resumo executivo

A jornada fechou Fases 0, 1 e os passos 2.0 + 2.1 com sucesso — mas **6 itens P0** travaram de verdade e foram resolvidos no improviso. Sem corrigir o material, o próximo aluno bate nos mesmos muros. A maioria das falhas vem de **defasagem do kit vs. estado atual das ferramentas** (Hetzner descontinuou plano, Docker subiu de versão, Supabase trocou modelo de API keys, n8n trocou "Active" por "Publish").

| # | Item | Sev | Fase | Status |
|---|------|-----|------|--------|
| B0.1 | Plano CX22 descontinuado na Hetzner | P0 | 0 | ⬜ |
| B0.2 | Docker 29 quebra Traefik v3.1 | P0 | 0 | ✅ |
| B0.3 | Preço/cópia desatualizados (€4 → €6,49) | P2 | 0 | ⬜ |
| B0.4 | n8n atrás do Traefik sem `trust proxy` | P1 | 0 | ⬜ |
| B0.5 | Espera do cloud-init dá timeout falso | P2 | 0 | ⬜ |
| B1.1 | Projeto Supabase pausado (INACTIVE) | P1 | 1 | ⬜ |
| B1.2 | `apply_migration` dá falso-sucesso em projeto subindo | P0 | 1 | ⬜ |
| B1.3 | Keys do cofre podem ser de OUTRO projeto | P1 | 1 | ⬜ |
| B1.4 | Testes do kit via REST; melhor via MCP | P2 | 1 | ⬜ |
| B2.0.1 | Formato de salvamento das credenciais Z-API | P1 | 2.0 | ⬜ |
| B2.1.1 | Nova secret key Supabase só aceita header `apikey` | P0 | 2.1 | ⬜ |
| B2.1.2 | MCP não expõe service_role (pega no painel) | P1 | 2.1 | ⬜ |
| B2.1.3 | n8n usa "Publish", não "Active" (API não ativa) | P0 | 2.1 | ⬜ |
| B2.1.4 | webhook-test não funciona em queue mode | P0 | 2.1 | ⬜ |
| B2.1.5 | Kit manda montar workflow na mão (inviável p/ leigo) | P1 | 2.1 | ⬜ |
| B2.1.6 | Sessão Z-API cai no meio do processo | P2 | 2.0/2.1 | ⬜ |
| **N1** | **Sempre usar a ÚLTIMA versão estável das ferramentas** | **P0** | todas | ⬜ |
| **N2** | **Conta owner do n8n deve ser criada via API pelo squad** | **P0** | 0 | ⬜ |
| **N3** | **Princípio de cofre: squad salva o que gera + orienta o que o aluno salva** | **P0** | todas | ⬜ |
| B2.2/2.3.1 | Dispatcher/Recovery herdam os P0 da 2.1 (Publish, MCP, secret key, montagem via API) | P0 | 2.2/2.3 | ⬜ |

---

## P0 — Bloqueantes (corrigir primeiro)

### B0.1 — Plano CX22 descontinuado
**O que aconteceu:** `POST /v1/servers` com `server_type: cx22` retornou `server type 104 is deprecated`. A criação do servidor **falha na 1ª tentativa**.
**Correção:**
- `data/kit/fase-0/setup-servidor.md` (Passo 3.2) e `tasks/fase-0-infra.md`: trocar `cx22` por `cx23` (mesma config 2vCPU/4GB).
- **Melhor ainda (robusto a futuras descontinuações):** antes de criar, o playbook lista `GET /v1/server_types`, filtra os não-`deprecated` com ~2vCPU/4GB e escolhe o mais barato. Não hardcodar o tipo.
- Atualizar a tabela de custos.

### B0.2 — Docker 29 quebra Traefik v3.1 ✅
**O que aconteceu:** `get.docker.com` instala Docker 29 (API mín. 1.40); Traefik v3.1 fixa client 1.24 → rejeitado → provider Docker não carrega → SSL nunca emite → n8n `HTTP 000`. A env `DOCKER_API_VERSION` **não resolve** (Traefik ignora). Fonte: traefik/traefik#12253.
**Correção (já aplicada):** `traefik:v3.1` → `v3.6.1` + Armadilha 7 documentada no kit.

### B1.2 — `apply_migration` dá falso-sucesso em projeto subindo
**O que aconteceu:** com o projeto em `COMING_UP` (logo após `restore`), `apply_migration` retornou `success: true` mas as tabelas **não persistiram** (sumiram). Só foi pego ao testar (`relation does not exist`). **Falha silenciosa perigosa** — dá pra avançar a fase achando que o banco existe.
**Correção:** `data/kit/fase-1/esquema-core.md` + `tasks/fase-1-banco.md`:
- Regra dura: **só aplicar com o projeto `ACTIVE_HEALTHY`** (checar `get_project` antes).
- Após cada migration, **confirmar persistência** via `information_schema.tables` / `pg_proc`. Não confiar no `success`.

### B2.1.1 — Nova secret key do Supabase só aceita header `apikey`
**O que aconteceu:** o Supabase migrou de `service_role` (JWT legacy) para **secret keys** (`sb_secret_...`). Essa nova key funciona **só com o header `apikey`** — `Authorization: Bearer` sozinho retorna **401**. O kit manda mandar os dois headers; o node HTTP do jeito antigo **falharia**.
**Correção:** `data/kit/fase-2/01-compras.md` (Bloco C): credencial HTTP no n8n = **um header `apikey`** (não `Authorization`). Documentar que `sb_secret_` ≠ `service_role` legacy e que o gateway aceita só `apikey`.

### B2.1.3 — n8n usa "Publish", não "Active"
**O que aconteceu:** n8n 2.27.4 substituiu o toggle Active/Inactive por **"Publish"**. Ativar via API (campo `active`, PATCH parcial e completo, Public API) **não liga o webhook**. Gastou 4 tentativas.
**Correção:** `data/kit/fase-2/*` + `agents/operador-automacoes`: instruir **publicar pelo editor** (clique em "Publish"). Documentar que a ativação programática não funciona nesta linha de versão. Idealmente o operador **detecta a versão do n8n** e adapta a instrução.

### B2.1.4 — webhook-test não funciona em queue mode
**O que aconteceu:** o servidor roda n8n em **queue mode** (processo `n8n-webhook` separado). O webhook de **teste** (`/webhook-test/...`) é servido pelo processo main, mas a URL aponta pro processo webhook → `Cannot POST`. O "Execute workflow" não testa nessa arquitetura.
**Correção:** `data/kit/fase-2/01-compras.md` (e demais): o **dry-run é sempre em PRODUÇÃO** — publicar o workflow e bater no webhook real (`/webhook/compras`). Remover/ajustar o exemplo que usa `/webhook-test/`.

---

## P1 — Atritos (corrigir em seguida)

### B0.4 — n8n atrás do Traefik sem `trust proxy`
**O que aconteceu:** logs do n8n com `ValidationError: X-Forwarded-For ... trust proxy ... false`. Não bloqueou, mas o n8n identifica IP do cliente errado (afeta rate-limit/logs).
**Correção:** no `docker-compose` (Passo 5.3), adicionar `N8N_PROXY_HOPS=1` no env dos 3 services do n8n.

### B1.1 — Projeto Supabase pausado
**O que aconteceu:** projeto free estava `INACTIVE`; precisou `restore` + esperar `ACTIVE_HEALTHY` antes de aplicar.
**Correção:** kit da Fase 1: passo explícito "se o projeto estiver pausado, reativar e **aguardar `ACTIVE_HEALTHY`**". Casa com B1.2.

### B1.3 — Keys do cofre podem ser de outro projeto
**O que aconteceu:** o item "Supabase" do cofre tinha keys de **outro projeto** do aluno (Arka). Risco de mexer no ambiente errado.
**Correção:** kit deve mandar **verificar o `ref` do projeto** (decodificar o JWT/secret) antes de usar qualquer key, e reforçar isolamento **produção vs. cobaia**. (Já em memória do sistema.)

### B2.0.1 — Formato das credenciais Z-API
**O que aconteceu:** aluno salvou as 3 credenciais nas **notas** do item 1Password (não em campos nomeados); exigiu parsing. Funcionou, mas frágil.
**Correção:** kit do Passo 2.0: padronizar o item "Arsenal - Z-API" com campos nomeados (`instance_id`, `token`, `client_token`) — e o operador aceitar ambos (campos OU notas) por robustez.

### B2.1.2 — MCP não expõe service_role
**O que aconteceu:** aluno perguntou se dava pra puxar a key via MCP. **Não dá** (proteção: MCP só entrega chaves públicas). Precisa pegar no painel.
**Correção:** documentar no kit o caminho exato no painel (Settings → API Keys → **Secret keys** → `sb_secret_`) e que isso é esperado, não falha.

### B2.1.5 — Kit manda montar o workflow na mão
**O que aconteceu:** o kit descreve montar 7-9 nodes node a node — inviável pra aluno leigo sozinho. Na prática, o operador montou **via API do n8n**.
**Correção:** **embarcar o workflow pronto** no squad (JSON exportável de `COMPRAS - Arsenal (B3)`) pra importar/criar via API, com placeholders. O operador injeta credenciais e publica. Idem para Dispatcher (2.2) e Recovery (2.3).

---

## P2 — Cosmético / melhorias

- **B0.3 — Preço:** kit/persona/greetings dizem "~€4/mês (CX22)". Real: **~€6,49 (cx23)**. Atualizar todas as menções de custo (b3-chief.md, start.md, fase-0).
- **B0.5 — Espera do cloud-init:** o loop de polling deu **timeout falso** (servidor só demorava o boot). Melhorar tolerância/heurística e a mensagem ("ainda subindo" vs "falhou").
- **B1.4 — Testes via MCP:** `esquema-core.md` descreve testes via curl REST com service_role; reescrever pro caminho **MCP** (`execute_sql` + `set role anon` pra RLS) — mais seguro e alinhado à restrição do aluno (só MCP).
- **B2.1.6 — Z-API cai:** já avisado no kit; considerar um node/healthcheck de checagem de `connected` antes de disparos, e instrução de reconexão rápida.

---

## Pontos do aluno (pós-execução — elevados a P0)

### N1 — Sempre usar a ÚLTIMA versão estável das ferramentas
**Origem:** o kit hardcodava `traefik:v3.1` e assumia um Docker antigo → travou o processo (ver B0.2). **Generalização do aluno:** "o squad tem que sempre buscar a última versão e configurar com a última."
**Correção (transversal):** nenhuma versão de imagem/plano hardcodada às cegas. Antes de provisionar, o operador **verifica a versão estável atual** (Docker Hub / release notes) de Traefik, n8n, Postgres, Redis — e usa pins recentes e compatíveis entre si. Idem para o plano da Hetzner (listar `server_types` vivos). Regra fixa nos princípios operacionais.

### N2 — Conta owner do n8n criada via API pelo squad
**O que aconteceu:** o operador pediu pro aluno criar a conta admin do n8n na tela. O aluno (com razão) apontou: **o squad podia ter criado via API e já salvado tudo.** Foi o que se fez no fim — mas só depois de pedido.
**Correção:** `data/kit/fase-0` + `operador-infra`: a conta owner é criada **via API** (`POST /rest/owner/setup`), com senha forte gerada pelo squad, e **salva automaticamente no cofre** ("Arsenal - n8n Admin"). O aluno não digita nada. (O e-mail do owner é confirmado com o aluno antes.)

### N3 — Princípio de cofre (1Password) — transversal e inegociável
**O que aconteceu:** o salvamento no cofre foi feito de forma inconsistente (às vezes o squad salvava, às vezes pedia pro aluno, sem padrão claro). O aluno definiu a regra:
- **(a) Tudo que o SQUAD gera** (senhas Postgres, encryption key, senha admin n8n, etc.) → o squad **salva automaticamente** no 1Password (vault `Claude`), com nomenclatura padronizada por projeto (prefixo, ex: "Arsenal - ...").
- **(b) Tudo que SÓ o aluno pode pegar** (token Hetzner, secret key do Supabase, credenciais do Z-API) → o squad **orienta de forma explícita e específica** onde salvar: "vault Claude, item `X`, campo `Y`" — e depois **lê e valida** de lá, nunca pelo chat.
**Correção:** vira **princípio operacional** (`knowledge/principios-operacionais.md`) que TODOS os operadores seguem, com a convenção de nomes e o checklist de "gerei → salvei" / "preciso → orientei a salvar".

---

## Melhorias estruturais (além dos bugs pontuais)

1. **Preflight check por fase:** o operador roda checagens no início de cada fase (server_types válidos da Hetzner · status do projeto Supabase · versão do n8n · `connected` do Z-API) e adapta — em vez de assumir o estado.
2. **Detecção de versão do n8n:** adaptar instruções (Publish vs Active) e capacidades (Public API on/off) à versão detectada.
3. **Workflows embarcados como template:** Compras/Dispatcher/Recovery como JSON versionado no squad — o operador cria via API, não o aluno na mão.
4. **Kit "vivo":** adicionar nota de manutenção — ferramentas de terceiros (Hetzner/Docker/Supabase/n8n) mudam; revisar versões/planos a cada N meses.

---

## Sugestão de ordem de execução

1. **P0 da Fase 0 e 1** (B0.1, B1.2) — sem isso o aluno não sai do lugar.
2. **P0 da Fase 2.1** (B2.1.1, B2.1.3, B2.1.4) — o coração das automações.
3. **Embarcar o workflow de Compras** (B2.1.5) — destrava o resto da Fase 2.
4. **P1/P2** em lote, junto com a melhoria estrutural de preflight.
