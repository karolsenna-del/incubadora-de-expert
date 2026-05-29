---
task: "Capture Dump"
responsavel: "@slide-forge-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Trigger (usuário invoca *despejar OU Chief detecta gap OU usuário discorda da síntese)"
Saida: "dump-bruto-{topico}-{data}.md (capturado na íntegra, marcado [DESPEJO BRUTO])"
Checklist:
  - "Despejo capturado SEM filtro/resumo/tradução"
  - "Marcação [DESPEJO BRUTO — DD/MM/AAAA] aplicada"
  - "Integrado como fonte primária no doc de construção"
execution_type: "interactive"
---

# Task: Capture Dump — Modo Despejo Bruto (transversal)

## Executive Summary

Modo despejo bruto. Ativável a qualquer momento das Fases 2-3 (e até dentro do debate). Chief escuta sem interromper, captura literal, integra como fonte primária. **Despejo do usuário PREVALECE sobre material documentado.**

## Triggers

Esse task pode ser ativado por:

1. **Usuário invoca explicitamente:** "deixa eu falar", "vou despejar", "conta o que penso disso", `*despejar`
2. **Chief detecta gap em fonte:** "o material está fraco em X — me despeja sua visão"
3. **Usuário discorda da síntese proposta:** quer trazer versão própria

## Steps

### Step 1: Confirmar tópico do despejo

> "Sobre o que? {tema/conceito}"

Anotar tópico pra usar no nome do arquivo.

### Step 2: Escutar sem interromper

Usuário fala/escreve. Chief:
- **NÃO** interrompe pra "esclarecer"
- **NÃO** filtra durante a captura
- **NÃO** resume "pra economizar tempo"
- **NÃO** traduz pra "linguagem mais técnica"
- **NÃO** substitui termos do usuário por sinônimos

### Step 3: Capturar na íntegra

Anotar literalmente o que o usuário diz/escreve. Se for áudio, transcrever literalmente. Se for fala, capturar nas palavras dele.

### Step 4: Marcar com `[DESPEJO BRUTO]`

Cabeçalho do arquivo:

```markdown
# Despejo Bruto — {Tópico}

> **[DESPEJO BRUTO — DD/MM/AAAA]**
> Capturado na íntegra. Sem filtro/resumo/tradução. Fonte primária.

---

{conteúdo capturado literalmente}
```

Salvar em `dumps/dump-bruto-{topico-slug}-{YYYY-MM-DD}.md`.

### Step 5: Integrar como fonte primária

No `sources-map.md`, marcar o conceito como "fonte: despejo bruto + path do arquivo".

No doc de construção do bloco correspondente, adicionar seção:

```markdown
### Palavras do Usuário (cruas — DD/MM/AAAA)
> {despejo bruto preservado}
```

### Step 6: Retornar pro task pai

Despejo é transversal. Após capturar, retorna pro task que estava ativo (map-sources, develop-block-theory, etc).

## Error Handling

| Cenário | Ação |
|---------|------|
| Usuário despeja muito longo | Continuar capturando — não cortar |
| Usuário despeja conceito que conflita com fonte documentada | Marcar AMBOS no doc — debate decide qual prevalece (despejo geralmente prevalece) |
| Usuário pediu pra refazer despejo | Capturar nova versão, marcar `[DESPEJO BRUTO v2]`, manter v1 também |
| Despejo trouxe múltiplos tópicos misturados | Capturar tudo junto primeiro, separar DEPOIS no doc de construção |

---

## Cardinal Rules Aplicadas

- Despejo do usuário é fonte primária (PU-005b — captura íntegra, prevalece sobre documentado)
- Não invento, não chuto (PU-005 — despejo é a fonte)

Ver `data/cardinal-rules.md` pra regras completas.
