# Princípios Operacionais — Bootstrap 3 (transversal)

> Regras que TODOS os operadores do squad (infra, banco, automações) e o chief seguem,
> em todas as fases. Nasceram da 1ª execução real (Arsenal Trader, 27/06/2026) — cada
> uma corrige um atrito que apareceu na prática. Estas regras têm precedência sobre
> qualquer instrução pontual de kit que as contrarie.

---

## 1. Princípio do Cofre (1Password) — INEGOCIÁVEL

Toda credencial vive no 1Password (vault `Claude`), nunca no chat. Há dois fluxos, e o operador
sabe SEMPRE em qual está:

### (a) O que o SQUAD gera → o squad salva, automático
Senhas e chaves que o próprio Claude Code cria (senha do Postgres, encryption key do n8n, senha do
owner do n8n, qualquer secret gerado com `openssl`/API):
- Salvar **na hora que gera**, antes de usar, com `op item create`/`op item edit`.
- Nomenclatura padronizada **por projeto**: prefixo do negócio + descrição. Ex: `Arsenal - n8n Postgres`,
  `Arsenal - n8n Encryption Key`, `Arsenal - n8n Admin`.
- Nunca exibir o valor no chat. Confirmar só que salvou ("guardei no cofre, item X").

### (b) O que SÓ o aluno pode pegar → o squad orienta, explícito, e valida
Credenciais que exigem ação humana num painel externo (token Hetzner, secret key do Supabase,
Instance ID/Token/Client-Token do Z-API):
- O operador diz **exatamente** onde salvar: "vault `Claude`, item `<nome>`, campo `<campo>`".
- Dá o caminho **exato no painel** de onde extrair (menu → aba → botão).
- Depois **lê do cofre** (`op read`) e **valida** (chama a API, confirma HTTP 200) — sem o valor passar
  pelo chat. Se o aluno colar no chat por engano: não repetir, orientar revogar/rotacionar.
- Aceitar tanto **campos nomeados** quanto **notas** do item (parsing robusto) — o aluno pode salvar
  de qualquer forma; o operador se vira pra ler.

### Convenção de nomes
Confirmar com o aluno o **prefixo do projeto** no início (ex: "Arsenal"). Todo item criado/orientado
nesta jornada usa esse prefixo. Itens de PRODUÇÃO do aluno (outros negócios) **nunca** são tocados —
se um item de cofre parecer de outro projeto, verificar e perguntar antes de usar (ver Princípio 4).

---

## 2. Sempre a ÚLTIMA versão estável das ferramentas

Nenhuma versão de imagem/plano é hardcodada às cegas. Ferramentas de terceiros mudam e quebram o
material defasado (foi o que aconteceu: Docker 29 x Traefik v3.1, plano CX22 descontinuado).

Antes de provisionar/subir, o operador **verifica a versão estável atual** e usa pins recentes e
**compatíveis entre si**:
- **Imagens Docker** (Traefik, n8n, Postgres, Redis): conferir a release estável atual; ao escolher,
  garantir compatibilidade cruzada (ex: Traefik ≥ 3.6.1 fala com Docker ≥ 29). Pinnar versão explícita
  (reprodutível), não `:latest` cego — mas uma versão **recente**, não a do material antigo.
- **Plano da Hetzner**: listar `GET /v1/server_types`, filtrar os **não-deprecated** com ~2vCPU/4GB,
  escolher o equivalente atual (não hardcodar `cx22`).
- **n8n**: detectar a versão instalada e adaptar instruções/capacidades (ver Princípio 3).

Se uma versão nova quebrar algo, **diagnosticar na fonte** (release notes/issues) — não chutar.

---

## 3. Ativação e teste de workflow no n8n (queue mode)

Aprendizados da arquitetura real (n8n em **queue mode**, com processo `n8n-webhook` separado):

- **Ativar = "Publish"**, não "Active": versões recentes do n8n (2.27+) usam o botão **Publish** no
  editor. A ativação via API (campo `active`) **não liga o webhook** nessas versões. O operador
  **detecta a versão** e, se for ≥ 2.27, orienta o aluno a **publicar pelo editor** (1 clique).
- **Testar SEMPRE em produção**: o webhook de **teste** (`/webhook-test/...`) **não funciona** em
  queue mode (é servido por outro processo). O dry-run é feito no **webhook de produção**
  (`/webhook/...`) com o workflow publicado, usando payload de teste — e depois os dados de teste
  são limpos do banco.
- **Montagem via API, não na mão**: o aluno é não-dev. Os workflows são **criados via API do n8n**
  pelo operador (ou importados de um JSON embarcado no squad), com as credenciais injetadas — o aluno
  não monta node a node. Workflows de referência ficam versionados no squad como template.

---

## 4. Banco via MCP + isolamento produção/cobaia

- **Operar o Supabase via MCP** quando disponível (apply_migration, execute_sql, list_tables). Não
  buscar/usar service_role do cofre pra DDL se o MCP resolve.
- **Verificar o projeto certo**: antes de usar qualquer key/projeto, confirmar o `ref` (decodificar o
  JWT/secret ou checar `list_projects`). Itens de cofre podem ser de OUTRO projeto do aluno — nunca
  mexer no ambiente de produção dele por engano.
- **Projeto pausado**: free tier pausa por inatividade. Se `INACTIVE` → `restore` e **aguardar
  `ACTIVE_HEALTHY`** antes de qualquer migration.
- **Não confiar no `success`**: durante `COMING_UP`, `apply_migration` pode dar falso-sucesso (não
  persiste). Após cada migration, **confirmar persistência** (`information_schema`/`pg_proc`).
- **RLS negativa via MCP**: testar o bloqueio anônimo com `set local role anon` dentro do
  `execute_sql` — não precisa expor a anon key.
- **Secret key nova do Supabase** (`sb_secret_...`): substitui a `service_role` legacy e funciona
  **só com o header `apikey`** (`Authorization: Bearer` sozinho retorna 401). Quando o n8n precisar
  escrever no banco via REST, a credencial é **um header `apikey`**. O aluno pega essa key no painel
  (Settings → API Keys → Secret keys) — o MCP **não** a expõe (proteção; ver Princípio 1b).

---

## 5. Custos sempre atuais, antes do compromisso

Informar custo real **antes** de cada compromisso, e manter os valores atualizados (eles mudam):
- Servidor Hetzner: o equivalente atual a ~2vCPU/4GB (cx23 ≈ **€6,49/mês** em 06/2026 — checar o valor
  vigente ao provisionar, não repetir o número do material).
- Z-API: ~R$100/mês por instância.
Se o valor do material divergir do real, usar o **real** e avisar o aluno da diferença.

---

## 6. Robustez de espera (provisionamento)

Esperas (cloud-init, emissão de SSL, projeto Supabase subindo) variam. O operador usa polling com
tolerância adequada e **mensagem honesta** ("ainda subindo, normal" vs "falhou de verdade") — e
**confirma o estado real** (SSH responde? cert emitido? status ACTIVE_HEALTHY?) antes de concluir
sucesso OU falha. Um timeout de polling não é, sozinho, prova de falha.
