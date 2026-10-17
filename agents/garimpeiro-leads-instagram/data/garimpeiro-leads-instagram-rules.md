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

## REGRA-002: Saldo do Apify antes de rodar

**Contexto:** plano Free, US$5/mês, um saldo só pra Karol + alunos (decisão 17/10/2026: só grátis por enquanto).
**Regra:** sempre `--estimar` antes. Estimativa acima do saldo → reduzir limite ou parar e pedir OK.

## REGRA-003: Fora das abas "Garimpo*" nada é escrito

**Contexto:** a aba CRM é sincronizada com o Supabase por 2 workflows n8n a cada 15 min; mexer nela quebra o CRM.
**Regra:** escrever só via `planilha.mjs` (o webhook recusa qualquer aba que não comece com "Garimpo").

---

## Registro de Incidentes

| # | O que aconteceu | Fix | Regra criada |
|---|----------------|-----|-------------|
| | (nenhum ainda) | | |
