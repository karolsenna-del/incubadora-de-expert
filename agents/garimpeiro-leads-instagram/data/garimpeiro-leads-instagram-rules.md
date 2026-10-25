# Garimpeiro de Leads no Instagram — Regras Operacionais

> Regras que nascem de incidentes e aprendizados operacionais.
> Carregar SEMPRE antes de qualquer rodada.
> Este arquivo cresce com o tempo. Cada regra deve ter: contexto, motivo e checklist.

---

## REGRA-001: Dado de prospect nunca vai pro git

**Contexto:** nome, @ e bio de quem ainda não é lead é dado pessoal (LGPD). O classificador "Sensitive-Source Provenance" já bloqueou commit de dado de terceiro neste repo.
**Regra:** o JSON da rodada fica só em `rodadas/` (gitignorada). Playbook, Mission Log, KB e rules nunca recebem nome/@/bio de prospect — só contagens e termos.
**Checklist:**
- [ ] `git check-ignore agents/garimpeiro-leads-instagram/rodadas/x.json` responde o caminho
- [ ] Relatório no chat cita números, não lista de nomes (a lista está na aba)

## REGRA-002: Apify só pra leitura, com teto de custo

**Contexto:** 18/10/2026 a Karol tirou o Apify (custo zero). 25/10/2026 ela o trouxe de volta só pra LER perfis: a página pública bloqueia depois de 5–8 leituras e a conta referenciasgpt levou 429 no 1º perfil em todas as tentativas (18, 19, 21 e 25/10).
**Regra:** descoberta continua grátis (busca na web). Leitura: `coletar --fonte apify` (bio/seguidores, ~US$0,0013/perfil) → peneira da bio → `posts --rodada` (6 posts, ~US$0,016/perfil). Custo real da 1ª rodada: US$1,26 pra 101 perfis. Rodada acima de US$3 ou saldo do mês abaixo de US$1 = avisar a Karol antes. Nunca usar Apify pra busca por hashtag sem OK dela.
**Nunca:** tentar fazer a automação "parecer humana" pra driblar bloqueio do Instagram (barrado em 25/10/2026). Bloqueio = parar.

## REGRA-004: Login no Instagram só na fase 3, só na conta referenciasgpt, com teto

**Contexto:** a busca por hashtag e os posts só aparecem logado. A Karol aprovou (18/10/2026) usar a conta secundária `referenciasgpt` só pra aprofundar quem já passou da fase 2, pra proteger a conta onde ela vende.
**Regra:**
- Fase 1 e 2 nunca usam login, com uma exceção: ler a lista de seguidores do próprio cliente (`logado.mjs seguidores`, teto 300/dia, máx. 600). Fase 3 só abre perfil que passou da fase 2.
- Conta: `referenciasgpt`, nunca a principal da Karol nem de aluno. O script confere a conta e para se for outra.
- Teto: 15 por rodada (padrão), 30 no máximo; mais de 30 no dia = OK da Karol. Pausa de 8–15s entre perfis.
- Instagram respondeu 401/403/429 → parar, não repetir no mesmo dia, avisar a Karol.
- Só leitura: nunca seguir, curtir, comentar ou mandar mensagem pela conta.
- Senha nunca passa pelo agente: a Karol faz o login à mão (`logado.mjs login`). A sessão fica em `~/.auroq/garimpeiro/sessao-instagram`, fora do repositório e do OneDrive.
**Checklist:**
- [ ] `logado.mjs conferir` → `conta_certa: true` antes da fase 3
- [ ] `--teto` dentro do limite

## REGRA-003: Fora das abas "Garimpo*" nada é escrito

**Contexto:** a aba CRM é sincronizada com o Supabase por 2 workflows n8n a cada 15 min; mexer nela quebra o CRM.
**Regra:** escrever só via `planilha.mjs` (o webhook recusa qualquer aba que não comece com "Garimpo").

---

## Registro de Incidentes

| # | O que aconteceu | Fix | Regra criada |
|---|----------------|-----|-------------|
| | (nenhum ainda) | | |
