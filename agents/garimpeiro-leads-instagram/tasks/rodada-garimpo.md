---
task: "Rodada de Garimpo"
responsavel: "@garimpeiro-leads-instagram"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Cliente (karol ou aluno) + termos (hashtags/palavras)"
Saida: "Até 50 perfis classificados na aba de garimpo do cliente + relatório da rodada"
Checklist:
  - "Perfil do cliente carregado"
  - "Saldo Apify conferido"
  - "Coleta + dedup + enriquecimento + filtro mecânico rodados"
  - "Cada perfil classificado com fato-gancho e fonte"
  - "Aba preenchida"
  - "Relatório entregue"
  - "Mission Log + playbook atualizados"
execution_type: "semantic"
---

# Task: Rodada de Garimpo

Pipeline completo pra um cliente. SOP base: Playbook SOP-001.

## Entrada
- **Cliente:** `karol` (padrão) ou slug do aluno. Sem perfil em `data/perfis/{cliente}.json` → `perfil-cliente.md` primeiro.
- **Termos:** o cliente passa. Sem termo → perguntar ("Quais hashtags ou palavras?"). Pode sugerir termos que renderam bem (playbook), mas quem escolhe é o cliente.

## Passos

### 1. Preparar
- Ler `data/perfis/{cliente}.json` e o playbook (seção "Rendimento por termo").
- Revisão da rodada anterior pendente de calibração? → rodar `calibrar-regua.md` antes (ou avisar que está pulando).
- Estimar: `node agents/garimpeiro-leads-instagram/tools/garimpo.mjs coletar --perfil {cliente} --termos "{t1,t2}" --modo hashtag --limite {N} --estimar`
- Escolha de `--limite` (por termo): mirar ~3x o número de entregas desejado no total. Padrão: 50 entregas ÷ nº de termos × 3. Se a estimativa passar do saldo, reduzir; se mesmo assim não couber → parar e pedir OK (nível 3).

### 2. Coletar
`node agents/garimpeiro-leads-instagram/tools/garimpo.mjs coletar --perfil {cliente} --termos "{...}" --modo {hashtag|busca|ambos} --limite {N}`

O script faz: coleta → dedup (CRM + aba de garimpo + rodadas anteriores + `nao_abordar`) → enriquecimento → filtro mecânico → grava `agents/garimpeiro-leads-instagram/rodadas/{data}-{hora}-{cliente}.json`.

Se o aviso "não consegui ler o histórico do garimpo" aparecer: seguir, mas a etapa 5 (`planilha.mjs enviar`) pula quem já está na aba de qualquer jeito.

### 3. Classificar (o agente — não o script)
Ler o JSON. Para CADA item de `para_classificar`, acrescentar no próprio item:

| Campo | Regra |
|-------|-------|
| `aderencia` | `alta` / `media` / `baixa` / `descarte` — régua da KB §3.3 + descartes do perfil |
| `prioridade` | 1 / 2 / 3 — KB §3.3 |
| `sinais` | sinais públicos encontrados, curto ("bio: psicóloga clínica · link de agenda") |
| `motivo_nota` | 1 frase: por que essa nota |
| `fato_gancho` | 1 fato concreto e público que justifica puxar conversa |
| `fonte_gancho` | "bio" ou "post de DD/MM" ou "link externo" |

Regras de julgamento:
- Ler bio + categoria + últimos posts. Lifestyle/rotina como conteúdo principal → descarte; profissional que menciona rotina do consultório → não.
- Já vende curso/mentoria/formação própria (link de checkout, "turma", "inscrições abertas", "método X") → descarte.
- Servidor/CLT: usar a régua própria (KB §3.3 e `regua_servidor_clt` do perfil) — não exigir link de agenda.
- Perfil privado → no máximo `baixa`.
- Na dúvida entre duas notas, a menor.
- Nunca deduzir o que não está escrito.

Gravar o JSON editado (Edit/Write no próprio arquivo da rodada).

### 4. Enviar
`node agents/garimpeiro-leads-instagram/tools/planilha.mjs enviar --rodada agents/garimpeiro-leads-instagram/rodadas/{data}-{hora}-{cliente}.json`
- Ordena por prioridade e aderência, corta em 50, pula quem já está na aba, recusa item sem fato-gancho.

### 5. Relatório (pro cliente)
```
Rodada {data} — {cliente}
Termos: {t1} ({coletados}/{entregues}) · {t2} (...)
Coletados {N} → duplicados {N} → descartados {N} (principais motivos: ...) → entregues {N}
Aderência: alta {N} · média {N} · baixa {N}
Custo: US${x} (saldo restante no mês: US${y})
Termo que rendeu melhor: ... · Termo fraco: ... (sugestão: ...)
Lista na aba "{aba}". Revisa a coluna "Status revisão" (aprovado/descartado).
```
Pra Karol: lembrar que os aprovados vão pro Vendedor Expert escrever a mensagem.

### 6. Documentar
- Mission Log: 1 linha.
- Playbook → tabela "Rendimento por termo" (termo, data, coletados, entregues, custo).
- Se houve incidente → regra nova em rules.

## Veto
- Entregar perfil sem fato-gancho/fonte
- Passar do saldo sem OK
- Escrever fora de aba "Garimpo*"
