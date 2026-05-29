---
task: "Criar Teoria"
responsavel: "@sage-teorico"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "context.yaml do post (tema cravado + virais de referencia + formato + moral)"
Saida: "teoria.md completo com tese + linha raciocinio + provas + leque hooks + fontes"
Checklist:
  - "Pesquisa interna do expert executada PRIMEIRO (extrair o que ja sabe)"
  - "Pergunta sobre fontes proprias do expert"
  - "Pesquisa externa densa (artigos, livros, papers, videos, gringo)"
  - "Engenharia reversa de 5-15 virais relevantes (transcrever se necessario)"
  - "Amarracao com 6 lentes aplicada"
  - "Tese central em 1 frase definida"
  - "Leque de 5-7 hooks sugeridos com diversidade de gatilhos"
  - "teoria.md salvo no padrao completo"
execution_type: "interactive"
---

# Task: Criar Teoria — Passo 4 do Fluxo (master)

**Task ID:** squad-conteudo-arcane/criar-teoria
**Version:** 1.0.0
**Responsavel:** @sage-teorico
**Category:** Rotina por Post — Coração do método
**Execution Type:** Interactive

---

## Pipeline Visual

```
criar-teoria (master)
  |
  v
SUB-PASSO 4.1: PESQUISA INTERNA
  Expert despeja primeiro (60-70% ja ta na cabeça)
  Task: pesquisa-interna.md
  |
  v
SUB-PASSO 4.2: PESQUISA EXTERNA
  Sage pergunta fontes do expert + faz pesquisa publica densa
  + engenharia reversa de virais
  Task: pesquisa-externa.md
  |
  v
SUB-PASSO 4.3: AMARRACAO COM 6 LENTES
  Aplica lentes durante a pesquisa (nao depois)
  Task: amarracao-lentes.md
  |
  v
STEP 4: ENTREGAR teoria.md
  Tese + raciocinio + provas + leque hooks + fontes
```

---

## Step 1: Receber Contexto + Confirmar

Sage recebe handoff da Iris com `context.yaml`. Lê:
- Tema cravado
- Categoria Audience
- Formato escolhido
- Moral da história
- Virais de referência separados

Sage abre conversa:

```
Beleza, tema cravado: "{tema}". Formato: {formato}.

Vou construir a TEORIA do post em 3 sub-passos:

4.1 PESQUISA INTERNA (com voce) — extrair o que voce ja sabe
4.2 PESQUISA EXTERNA (eu sozinho) — artigos, livros, virais
4.3 AMARRACAO com 6 lentes de comunicacao

Resultado: tese + linha de raciocinio + 5-7 hooks sugeridos
pro Rico. Tempo estimado: 20-40 min.

Bora começar pela interna? E a mais importante.
```

---

## Step 2: Executar Sub-Passo 4.1 — Pesquisa Interna

**Delega pra task:** `pesquisa-interna.md` (ver task específica).

Resumo: Sage entrevista expert com 6 perguntas, captura big ideas, casos, conceitos próprios, crença central, argumentos, fontes que ele já estudou.

Output: seção "Pesquisa Interna" do teoria.md preenchida.

---

## Step 3: Executar Sub-Passo 4.2 — Pesquisa Externa

**Delega pra task:** `pesquisa-externa.md` (ver task específica).

Resumo:
- Identifica gaps na interna
- Pergunta fontes do expert
- Pesquisa pública densa (posts, artigos, livros, papers, vídeos, gringo)
- Engenharia reversa de 5-15 virais (transcreve se necessário)
- Extrai padrões dos virais

Output: seções "Pesquisa Externa" + "Engenharia Reversa de Virais Relevantes" + "Fontes Consultadas" do teoria.md preenchidas.

---

## Step 4: Executar Sub-Passo 4.3 — Amarração com 6 Lentes

**Delega pra task:** `amarracao-lentes.md` (ver task específica).

Resumo: Sage estrutura tudo da pesquisa (interna + externa) aplicando as 6 lentes:

1. **O que vai CHAMAR ATENÇÃO** (insumos do hook)
2. **CONSTRUÇÃO DE RACIOCÍNIO** (lógica encadeada)
3. **CONSTRUÇÃO DE TENSÃO** (conflito, paradoxo)
4. **NARRATIVA** (história magnética)
5. **LÓGICA** (causa-efeito, provas)
6. **CONTEÚDO NOTÁVEL** (8 elementos Audience)

Output: seções "Chama-Atenção" + "Linha de Raciocínio" + "Narrativa" + "Argumentos de Prova" + "Contra-Intuitivo/Polêmica" + "Pontos de Identificação" + "Moral da História" + "Leque de Hooks Sugeridos" do teoria.md preenchidas.

---

## Step 5: Gerar Tese Central

Sage condensa tudo em UMA FRASE — a tese central:

```
TESE CENTRAL (1 frase, o que o publico tem que acreditar/sentir no fim):

"{frase única}"

Tudo no post aponta pra ca. Hook fisga, conteúdo prova, moral fecha.
```

Pergunta ao expert: "Bate? Quer ajustar antes do Rico pegar?"

---

## Step 6: Gerar Leque de 5-7 Hooks Sugeridos

Sage entrega 5-7 hooks com diversidade de gatilhos (não 5 todos com mistério):

```
LEQUE DE HOOKS SUGERIDOS (insumos pro Rico — ele escolhe ou cria proprio):

Hook 1 ({gatilho1} + {gatilho2}):
  Frase: "{hook completo}"
  Por que pode funcionar: {motivo concreto}
  Sugestão de 1ª linha pós-hook: "{frase}"

Hook 2 ({gatilho diferente}): ...
[...]
Hook 7: ...

Diversidade de gatilhos coberta:
✓ Recompensa
✓ Mistério
✓ Popularidade
✓ Reputação
✓ Crença
✓ Disrupção
✓ Reconhecimento
(nem todos os 7 precisam estar, mas variedade é obrigatória)
```

---

## Step 7: Salvar teoria.md Completo

Sage salva arquivo final em `docs/producao-conteudo/{expert}/posts/{slug}/teoria.md`:

```markdown
# Teoria do Post — {slug}

## Tema
{tema cravado}

## Tese Central
"{frase única}"

## Chama-Atenção (insumos do gancho)
- {dado curioso 1}
- {dado curioso 2}
- {imagem mental forte}
- {polêmica em potencial}

## Linha de Raciocínio
1. Premissa de entrada: {onde o público está mentalmente}
2. Quebra/tensão: {conflito apresentado}
3. Virada: {a verdade que o expert defende}
4. Prova/sustentação: {argumento/dado}
5. Conclusão/moral: {fechamento}

## Narrativa
{história, caso, jornada que ilustra a tese}

## Argumentos de Prova
- {estudo/dado/fonte 1}
- {caso real / exemplo}
- {autoridade externa}

## Contra-Intuitivo / Polêmica
{o que vai gerar disrupção}

## Pontos de Identificação
{situações cotidianas do público}

## Moral da História / Gancho do Produto
{a virada final que conecta ao produto/visão}

## Leque de Hooks Sugeridos (insumos pro Passo 5)

[5-7 hooks com gatilhos + por que funciona + 1ª linha pós-hook]

→ Rico (Passo 5) escolhe um, adapta, ou cria próprio.

## Pesquisa Interna (do expert)
- Big ideas: ...
- Casos pessoais: ...
- Conceitos próprios: ...
- Crença central: ...
- Argumentos do expert: ...

## Pesquisa Externa
- Posts/artigos consultados: [...]
- Livros / capítulos relevantes: [...]
- Papers / estudos: [...]
- Vídeos / palestras: [...]
- Conteúdo gringo: [...]

## Engenharia Reversa de Virais Relevantes
- Viral 1: canal/título/views/ângulo/hook usado
- Viral 2: ...
- ...
- Padrões extraídos: {síntese}

## Fontes Consultadas
- {lista completa com links/referências}
```

---

## Step 8: Handoff pro Rico

```
Teoria pronta. Salvei em
`docs/producao-conteudo/{expert}/posts/{slug}/teoria.md`.

RESUMO PRA TI:
- Tese: "{frase}"
- Lentes aplicadas: ✓ (6 lentes)
- Leque de hooks: 6 ofertas com diversidade de gatilhos
- Provas: {N} estudos/fontes
- Engenharia reversa: {N} virais analisados
- Pesquisa interna: extraida da tua cabeca + complementada

Te entregando pro Rico. Ele vai:
1. Capturar teu tom de voz (se for 1ª vez aqui no squad)
2. Perguntar coleta pre-roteiro (frases, padroes, evitacoes)
3. Roteirizar usando a teoria como base
4. Loop iterativo até voce aprovar

Tem mais alguma coisa que voce quer adicionar na teoria antes
do Rico pegar?
```

---

## Veto Conditions

| Condição | Ação |
|----------|------|
| Expert quer pular pesquisa interna | "Não pulo. 60-70% da teoria boa ta na tua cabeca. Pesquisa externa primeiro é trabalho dobrado + risco de ignorar tua visao." |
| Pesquisa externa não rendeu (poucas fontes) | Avisar: "Material externo escasso. Vou trabalhar mais com tua pesquisa interna + virais relevantes. Tudo bem?" |
| Expert quer copiar narrativa de viral diretamente | "Não copio. Engenharia reversa = extrair PADRÕES, não texto. Texto vem da tua ótica única + lentes." |
| Não consegue gerar 5 hooks distintos | Pesquisar mais até conseguir. 5 hooks com diversidade de gatilhos é mínimo não-negociável. |
| Expert quer mais 1 hora pra pensar antes de roteirizar | OK. Sage pausa, salva teoria, expert volta quando pronto. Sem pressa. |

---

## Quality Gate

**QG-SCA-003 — Teoria pronta**

Checklist:
- [ ] Tese central definida em 1 frase
- [ ] Linha de raciocínio com 5 etapas (premissa → conclusão)
- [ ] Pesquisa interna do expert capturada e validada
- [ ] Pesquisa externa com fontes citadas
- [ ] Engenharia reversa de pelo menos 5 virais
- [ ] 6 lentes aplicadas (cada uma com algo)
- [ ] Leque com 5-7 hooks de gatilhos diversos
- [ ] Moral da história clara
- [ ] teoria.md salvo no padrão

Se algum item falhou: voltar ao sub-passo correspondente.

---

**Task Status:** Ready for Production
