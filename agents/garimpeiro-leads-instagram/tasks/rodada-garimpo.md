---
task: "Rodada de Garimpo"
responsavel: "@garimpeiro-leads-instagram"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Cliente (karol ou aluno) + termos (profissões, cargos, frases de dor)"
Saida: "Até 50 perfis classificados (aderência + 4 perguntas de fit + Perfil) na aba de garimpo do cliente + relatório da rodada"
Checklist:
  - "Perfil do cliente carregado"
  - "Fase 1: candidatos descobertos por busca na web"
  - "Fase 2: perfil público lido, dedup + filtro mecânico, fit 1-3 respondido"
  - "Fase 3: quem passou foi aprofundado logado (teto respeitado)"
  - "Cada perfil com aderência, 4 perguntas de fit, Perfil e fato-gancho com fonte"
  - "Aba preenchida (garimpo + rastreador)"
  - "Relatório entregue"
  - "Mission Log + playbook atualizados"
execution_type: "semantic"
---

# Task: Rodada de Garimpo (v2 — custo zero, 18/10/2026)

Pipeline completo pra um cliente. SOP base: Playbook SOP-001. Sem Apify, sem ferramenta paga.

## Entrada
- **Cliente:** `karol` (padrão) ou slug do aluno. Sem perfil em `data/perfis/{cliente}.json` → `perfil-cliente.md` primeiro.
- **Termos:** o cliente passa. Sem termo → perguntar ("Quais profissões, cargos ou temas?"). Pode sugerir termos que renderam bem (playbook), mas quem escolhe é o cliente.

## Passos

### 1. Preparar
- Ler `data/perfis/{cliente}.json` e o playbook (seções "Rendimento por termo" e "Consultas que funcionam").
- Revisão da rodada anterior pendente de calibração? → rodar `calibrar-regua.md` antes (ou avisar que está pulando).
- Conferir a sessão logada: `node agents/garimpeiro-leads-instagram/tools/logado.mjs conferir`. Se não estiver ativa, pedir pra Karol rodar `login` antes da fase 3. As fases 1 e 2 rodam sem login.

### 2. Fase 1 — Descoberta (WebSearch, sem login, sem custo)
- Pra cada termo, rodar várias consultas no WebSearch com `allowed_domains: ["instagram.com"]`. Variar:
  - `site:instagram.com "{termo}"`
  - `site:instagram.com "{termo}" "{cidade/UF}"` (capitais e estados variam o resultado)
  - `site:instagram.com "{cargo}" "servidora"` / `"concursada"` / `"CLT"`
  - frase da dor/desejo da persona: `"{termo}" "transição"`, `"projeto paralelo"`, `"empreender"`
- Guardar só URLs de PERFIL (`instagram.com/{arroba}/`). Ignorar `/p/`, `/reel/`, `/explore/`, `/tags/`.
- Mirar ~3x o número de entregas desejado em candidatos (padrão: 150 pra 50 entregas).
- Gravar em `agents/garimpeiro-leads-instagram/rodadas/candidatos-{data}-{cliente}.txt` (pasta gitignorada): uma linha por perfil, `@arroba<TAB>termo`.

### 2b. Fase 1 alternativa — Seguidores do cliente (logado)
Quando o cliente pede "garimpa meus seguidores" (precisa de `instagram_proprio` no perfil):
`node agents/garimpeiro-leads-instagram/tools/logado.mjs seguidores --perfil {cliente} --teto 300`
- Lê a lista pela `referenciasgpt`, 50 por página, pausa de 20–40s, teto 300/dia (máx. 600). Guarda o cursor em `rodadas/seguidores-estado-{cliente}.json` e continua no dia seguinte. Gera `rodadas/candidatos-{data}-{hora}-{cliente}.txt` (termo "seguidor de @...").
- Ler ATÉ O FIM: não cortar seguidor antigo pela época. O fit da bio decide (Karol, 18/10/2026).
- A API não diz desde quando a pessoa segue. Nunca afirmar isso.
- Daí em diante, fase 2 e 3 iguais. Grupo no rastreador = "Seguidor sem interação" (nunca "Seguidores engajados" — esse é de quem comenta/responde; a Karol muda à mão quando a pessoa interagir).
- Lista de seguidores e fase 3 usam a mesma conta no mesmo dia: rodar a fase 3 com teto 15 depois da leitura da lista, não antes.

### 3. Fase 2 — Perfil público (script, sem login)
`node agents/garimpeiro-leads-instagram/tools/garimpo.mjs coletar --perfil {cliente} --candidatos agents/garimpeiro-leads-instagram/rodadas/candidatos-{data}-{cliente}.txt`

O script faz: dedup (CRM + aba de garimpo + rodadas anteriores + `nao_abordar`) → página pública (nome, bio, seguidores, posts; pausa de 2,5s) → filtro mecânico → grava `rodadas/{data}-{hora}-{cliente}.json`. Máximo 150 por rodada.

Se aparecer "o Instagram parou de mostrar perfil público": é bloqueio temporário por volume. Seguir com o que foi lido; os demais ficam em `nao_lidos` pra outra rodada.

**Classificação da fase 2 (o agente):** pra cada item de `para_classificar`, só com nome + bio + seguidores:
- `fit_carreira`, `fit_nao_vende`, `fit_transicao` → "Sim"/"Não" (régua abaixo)
- `fit_carreira` = "Não" ou descarte claro pela bio → `aderencia: "descarte"` (não vai pra fase 3)
- Os demais seguem pra fase 3 (sem `aderencia` final ainda)

### 4. Fase 3 — Aprofundamento logado (só quem passou)
`node agents/garimpeiro-leads-instagram/tools/logado.mjs aprofundar --rodada agents/garimpeiro-leads-instagram/rodadas/{arquivo}.json --teto 15`

- Abre o Chrome (janela visível) na sessão `referenciasgpt`, lê bio completa, link externo, categoria, privado e os últimos 6 posts de cada perfil não descartado, com pausa de 8–15s. Salva no próprio JSON a cada perfil (`fase: 3`).
- Teto padrão 15, máximo 30 por rodada. Mais de 30 no mesmo dia = pedir OK da Karol.
- Se o script parar com 401/403/429: não rodar de novo hoje; avisar a Karol. Quem ficou sem fase 3 pode ser entregue com a classificação da fase 2 (fit 4 em branco, fonte do gancho = "bio").

### 5. Classificação final (o agente — não o script)
Pra CADA item não descartado de `para_classificar`, completar no próprio item:

| Campo | Regra |
|-------|-------|
| `aderencia` | `alta` / `media` / `baixa` / `descarte` — régua da KB §3.3 + descartes do perfil |
| `prioridade` | 1 / 2 / 3 — KB §3.3 |
| `fit_carreira` | **Tem carreira clara?** Sim = profissão liberal, cargo CLT ou carreira de servidor visível. Concurseiro sem cargo = Não |
| `fit_nao_vende` | **Ainda não vende o próprio método?** Sim = sem curso, mentoria, formação, guia ou produto digital próprio. Atender 1:1 (agenda, consultoria) pode |
| `fit_transicao` | **Sinal de empreender/transição?** Sim = fala em sair do emprego, projeto paralelo, transição, empreender; ou já atende/vende serviço próprio (liberal com agenda); ou posta a dor da rotina com tom de quem quer mudar |
| `fit_conteudo` | **Já cria conteúdo profissional?** Sim = a maioria dos últimos posts é sobre a própria área (dica, caso, bastidor do trabalho), não vida pessoal. Sem fase 3 → deixar vazio |
| `perfil_leitura` | `Conector` (família, comunidade, propósito, escreve com calor) · `Analista` (formação, registro, explicação técnica, precisão) · `Diretivo` (cargo, anos de mercado, posta pouco e direto) |
| `sinais` | sinais públicos encontrados, curto ("bio: psicóloga clínica · link de agenda") |
| `motivo_nota` | 1 frase: por que essa nota |
| `fato_gancho` | 1 fato concreto e público que justifica puxar conversa — de preferência de post recente (fase 3) |
| `fonte_gancho` | "bio" ou "post de DD/MM" ou "link externo" |

Regras de julgamento:
- Lifestyle/rotina como conteúdo principal → descarte; profissional que menciona rotina do consultório → não.
- Já vende curso/mentoria/formação própria (link de checkout, "turma", "inscrições abertas", "método X") → descarte.
- Servidor/CLT: usar a régua própria (KB §3.3 e `regua_servidor_clt` do perfil) — não exigir link de agenda.
- Perfil privado → no máximo `baixa`.
- Na dúvida entre duas notas, a menor. Na dúvida num fit, "Não".
- Nunca deduzir o que não está escrito.

Gravar o JSON editado (Edit/Write no próprio arquivo da rodada).

### 6. Enviar
`node agents/garimpeiro-leads-instagram/tools/planilha.mjs enviar --rodada agents/garimpeiro-leads-instagram/rodadas/{arquivo}.json`
- Ordena por prioridade e aderência, corta em 50, pula quem já está na aba, recusa item sem fato-gancho ou sem fit 1-3.
- Preenche o rastreador: Grupo = "Conexões frias qualificadas", 4 fits, Prioridade de abordagem (alta→Alta, média→Média, baixa→Baixa), Perfil, Status = "Sem abordagem", Fechou? = "Em aberto", Depoimento = "Pendente". Score de Fit é fórmula.

### 7. Relatório (pro cliente)
```
Rodada {data} — {cliente}
Termos: {t1} ({descobertos}/{entregues}) · {t2} (...)
Descobertos {N} → duplicados {N} → descartados {N} (principais motivos: ...) → aprofundados logado {N} → entregues {N}
Aderência: alta {N} · média {N} · baixa {N} · Score de Fit: 4 = {N} · 3 = {N} · 2 ou menos = {N}
Custo: zero
Termo que rendeu melhor: ... · Termo fraco: ... (sugestão: ...)
Lista na aba "{aba}". Revisa a coluna "Status revisão" (aprovado/descartado); o acompanhamento segue no bloco do rastreador.
```
Pra Karol: lembrar que os aprovados vão pro Vendedor Expert escrever a mensagem (o Perfil ajuda a escolher o tom).

### 8. Documentar
- Mission Log: 1 linha.
- Playbook → "Rendimento por termo" (termo, data, descobertos, entregues) e "Consultas que funcionam".
- Se houve incidente → regra nova em rules.

## Veto
- Entregar perfil sem fato-gancho/fonte ou sem fit 1-3
- Abrir logado quem foi descartado na fase 2, passar do teto, ou insistir depois de 401/403/429
- Usar outra conta que não a `referenciasgpt`
- Escrever fora de aba "Garimpo*"
