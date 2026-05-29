---
workflow: "Setup Inicial"
versao: "1.0.0"
fases: 2
duracao_estimada: "20-40 min"
quando_usar: "Primeira vez no squad — expert ainda nao tem formatos nem pool de temas definidos"
output_principal: "docs/producao-conteudo/{expert}/base-inicial.md"
---

# Workflow: Setup Inicial — Base Pontual

**Workflow ID:** setup-inicial
**Versão:** 1.0.0

---

## Quando Usar

Use este workflow quando:
- Expert chega pela primeira vez ao squad
- Ainda não existe `base-inicial.md` na pasta dele
- Expert quer começar do zero
- Ou: expert quer revisar/refazer a base (formatos estagnaram, pool desatualizado)

**Cadência:** roda 1x (base pontual). Revisita só quando necessário.

---

## Pipeline (2 Fases)

```
═══════════════════════════════════════════════════════════════
SETUP INICIAL — Fase Pontual
═══════════════════════════════════════════════════════════════

FASE 1: DEFINIR FORMATOS (Iris)
  ↓ Task: pesquisar-formatos
  ↓ Output: 1-3 formatos cravados + lapidacao 80/20
  ↓ Duracao: 10-20 min
  ↓
  ↓ Quality Gate: 1-3 formatos definidos
  ↓
  ↓
FASE 2: POOL DE TEMAS (Iris)
  ↓ Task: pesquisar-temas
  ↓ Output: 15-30 temas categorizados em 3 niveis
  ↓ Duracao: 15-30 min
  ↓
  ↓ Quality Gate: pool com >=15 temas
  ↓
  ↓
ENTREGA: base-inicial.md completo
  ↓
  ↓ Output: docs/producao-conteudo/{expert}/base-inicial.md
  ↓
  ↓ Próximos passos sugeridos:
  ↓ - workflow produzir-post (rotina)
  ↓ - workflow produzir-batch (batelada)
```

---

## FASE 1: DEFINIR FORMATOS

**Responsável:** @iris-pesquisador
**Task:** `pesquisar-formatos.md`

### Steps

1. Iris explica o que é formato (com exemplos)
2. Apresenta cardápio visual da biblioteca embarcada
3. Pergunta se expert já gosta de algum
4. Se SIM: lapida em cima
5. Se NÃO: sugere 3-5 candidatos com 5 critérios (referências, autenticidade, recursos, "tem que ser massa de fazer", consegue sustentar)
6. Pesquisa adicional sob demanda (se nenhum bate)
7. Expert crava 1-3 formatos
8. Lapidação 80/20 explicada
9. Salva em `base-inicial.md` (seção FORMATOS)

### Quality Gate: QG-SCA-001 (parcial)

- [ ] 1-3 formatos cravados pelo expert
- [ ] Cada um com descrição visual e justificativa
- [ ] Lapidação 80/20 explicada
- [ ] Salvo em base-inicial.md

---

## FASE 2: POOL DE TEMAS

**Responsável:** @iris-pesquisador
**Task:** `pesquisar-temas.md`

### Steps

1. Iris explica o que é tema viral (vs tema do momento)
2. Pesquisa profunda em múltiplos canais (YT pequenos + IG/TikTok hooks + inglês)
3. Aplica 16 categorias Audience
4. Apresenta primeira leva (5-10 sugestões)
5. Debate iterativo com expert (feedback → repesquisa → refina)
6. Detecta tema quente emergente e sinaliza
7. Organiza pool final em 3 níveis (Fortes / Médios / Quentes)
8. Salva em `base-inicial.md` (seção POOL DE TEMAS)

### Quality Gate: QG-SCA-001 (parcial)

- [ ] 15-30 temas no pool
- [ ] Organizado em 3 níveis
- [ ] Cada tema com categoria Audience + exemplo viral
- [ ] Pelo menos 1 tema quente sinalizado
- [ ] Salvo em base-inicial.md

---

## Output Final

`docs/producao-conteudo/{expert}/base-inicial.md`:

```markdown
# Base Inicial — {Expert}

## FORMATOS ESCOLHIDOS

### Formato Principal: {nome}
### Formato Secundário: {nome}
### Formato Pra Testar (20%): {nome}

## POOL DE TEMAS (data: {YYYY-MM-DD})

### 🔥 TOP 10 — TEMAS FORTES
[lista]

### ⚡ MÉDIOS (10-15)
[lista]

### 🌟 QUENTES / EMERGENTES (5)
[lista]
```

---

## Próximos Passos Sugeridos

Após setup inicial completo:

```
Base inicial pronta. Salvei em base-inicial.md.

Agora voce tem:
- {N} formatos pra focar inicialmente
- Pool de {N} temas pra pescar

Cadencia ideal: 3-7 posts/semana (minimo 3, ideal 1/dia).

Próximo passo: PRODUZIR.

Quer:
1. Produzir 1 post agora (workflow produzir-post)
2. Produzir batelada (workflow produzir-batch — 3-7 posts)
3. Pausar e voltar depois pra produzir
```

---

## Revisita

Quando revisitar este workflow:
- Formatos atuais estagnaram (3+ posts seguidos com performance baixa)
- Pool de temas esvaziou
- Expert mudou de nicho/posicionamento
- Cada 3-6 meses como manutenção

---

**Workflow Status:** Ready for Production
