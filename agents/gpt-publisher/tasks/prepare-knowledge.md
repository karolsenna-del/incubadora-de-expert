---
task: "Prepare Knowledge"
responsavel: "@gpt-publisher"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "KB + tasks da mente de origem + o que foi cortado das Instructions"
Saida: "1+ arquivos de Knowledge prontos pra upload no GPT Builder"
Checklist:
  - "Todo conteúdo cortado das Instructions foi preservado em algum Knowledge file"
  - "Arquivos organizados por tema, não por fonte"
  - "Nenhum arquivo passa de 512MB / 2.000.000 tokens"
  - "Total de arquivos <= 20"
  - "Formato .md (compatível nativamente)"
execution_type: "sequential"
---

# Task: Prepare Knowledge — Organizar Arquivos de Knowledge

## Objetivo

Pegar a KB completa, as tasks detalhadas e tudo que foi cortado da compactação das Instructions, e organizar em arquivos de Knowledge dentro dos limites do GPT Builder.

## Trigger

Terceiro passo de `execute-mission.md`, após `compact-instructions.md`.

## Limites a Respeitar

- Até 20 arquivos por GPT
- Cada arquivo até 512MB e até 2.000.000 tokens (não costuma ser problema pra texto — KBs do Auroq raramente passam de algumas dezenas de milhares de caracteres)
- Formatos aceitos: `.txt`, `.pdf`, `.docx`, `.csv`, `.json`, `.md`, `.pptx`, `.xlsx` — preferir `.md` (já é o formato nativo das KBs Auroq)

## Passos

### Step 1: Decidir Particionamento

Pra mentes com KB pequena/média (como a maioria dos casos hoje no Auroq — dezenas de KB até algumas centenas de linhas): **1 único arquivo de Knowledge basta**, sem necessidade de particionar.

Particionar em múltiplos arquivos quando:
- A KB tem seções muito distintas que fazem sentido como documentos separados (ex: "Procedimentos" vs. "Glossário" vs. "Exemplos")
- O arquivo ficaria grande o suficiente pra dificultar o retrieval (na prática, isso é raro nas KBs atuais do Auroq — decisão de bom senso, não regra rígida)

### Step 2: Montar o(s) Arquivo(s)

**Arquivo padrão: `knowledge-base.md`**
```markdown
# {Nome da Mente} — Base de Conhecimento

{Conteúdo completo da KB original}

## Procedimentos Detalhados

{Conteúdo de cada task/*.md, com o trigger de cada uma no início da seção,
pra o GPT saber quando consultar aquele procedimento}

### {Nome da Task 1}
**Quando usar:** {trigger em linguagem natural}
{Procedimento completo}

### {Nome da Task 2}
...
```

**Se algo foi cortado das Instructions e não estava na KB original** (ex: exemplos extensos, explicações longas de regras): adicionar numa seção própria, ex: `## Contexto Adicional e Exemplos`.

### Step 3: Nomear os Arquivos

Nomenclatura clara, um humano revisando o GPT Builder depois deve entender o conteúdo só pelo nome:
- `knowledge-base.md` — KB principal
- `procedimentos.md` — se separado da KB principal
- `glossario-exemplos.md` — se houver volume relevante de exemplos/glossário

(Decisão de nomenclatura e organização é autonomia nível 5 — Advise — do worker.)

### Step 4: Checar Limites

Antes de considerar pronto:
- [ ] Nº de arquivos <= 20
- [ ] Nenhum arquivo individual excede 2M tokens (raro no Auroq hoje, mas checar em KBs muito grandes)
- [ ] Todo conteúdo relevante da mente original está representado em algum lugar (Instructions OU Knowledge — nada foi perdido)

## Output

Arquivo(s) `.md` prontos em `agents/gpt-publisher/output/{slug}/custom-gpt/knowledge/`, usados no Step de upload de `publish-gpt.md`.

## Error Handling

| Cenário | Ação |
|---------|------|
| KB de uma mente é excepcionalmente grande (milhares de linhas) | Particionar por seção temática, documentar a divisão no relatório apresentado pra Karol |
| Conteúdo de uma task não faz sentido fora do runtime do Auroq (ex: comandos internos) | Adaptar a linguagem, manter só o procedimento que um usuário do GPT conseguiria de fato acionar via conversa |
| Overlap entre o que já ficou nas Instructions e o que vai pro Knowledge | Não duplicar — Knowledge complementa, não repete o que já está nas Instructions |
