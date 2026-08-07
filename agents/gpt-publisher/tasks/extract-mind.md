---
task: "Extract Mind"
responsavel: "@gpt-publisher"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Slug da mente de origem (ex: expert-viral)"
Saida: "Estrutura da mente lida e mapeada: persona, regras, KB, tasks"
Checklist:
  - "agent.md lido e persona identificada"
  - "config.yaml lido"
  - "KB completa lida"
  - "Todas as tasks/*.md lidas"
  - "Tamanho de cada fonte medido em caracteres"
execution_type: "sequential"
---

# Task: Extract Mind — Ler a Mente de Origem

## Objetivo

Ler e mapear a estrutura completa da mente Mind Forge antes de qualquer compactação. Sem isso não dá pra saber o que é essencial.

## Trigger

Primeiro passo de `execute-mission.md`.

## Pré-condições

`agents/{slug}/` existe e segue o formato Mind Forge.

## Passos

### Step 1: Validar Formato

Verificar presença de:
- `agents/{slug}/agents/{slug}.md` (persona)
- `agents/{slug}/config.yaml` (metadados)
- `agents/{slug}/data/{slug}-kb.md` (KB)
- `agents/{slug}/tasks/*.md` (modos/procedimentos)
- `agents/{slug}/skill.md` (shim — geralmente pequeno, referência apenas)

SE algum componente central (agent.md ou KB) estiver ausente: **PARAR** — "A mente `{slug}` não tem {componente}. Preciso do formato Mind Forge completo pra publicar."

### Step 2: Ler Cada Componente

1. Ler `agent.md` na íntegra — identificar: Identidade, Personalidade, Estilo de Comunicação, Domínio de Expertise, Strict Rules (NUNCA/SEMPRE), Modos de Operação
2. Ler `config.yaml` — nome, descrição, domínios, versão
3. Ler a KB completa — mapear seções principais
4. Ler cada arquivo em `tasks/` — identificar trigger, ciclo/protocolo de cada um

### Step 3: Medir Tamanhos

Registrar o tamanho em caracteres de cada fonte (ajuda a estimar o esforço de compactação):

```
agent.md:        {N} caracteres
config.yaml:      {N} caracteres
KB:               {N} caracteres ({N} linhas)
tasks/ (total):   {N} caracteres ({N} arquivos)
```

### Step 4: Classificar Conteúdo

Para cada trecho do agent.md, classificar:
- **Core** (identidade, tom de voz, strict rules, boundaries) → vai pra Instructions
- **Procedimento detalhado** (passo a passo de cada task) → vai pra Knowledge
- **Referencial** (glossário, exemplos extensos, troubleshooting) → vai pra Knowledge

## Output

Relatório interno pra alimentar `compact-instructions.md` e `prepare-knowledge.md`:

```
=== MENTE LIDA: {nome} ===
Persona: {N} chars — {resumo de 1 linha do que é core vs. procedimento}
KB: {N} chars / {N} linhas
Tasks: {N} arquivos, {N} chars totais
Modos de operação identificados: {lista}
```

## Error Handling

| Cenário | Ação |
|---------|------|
| `agent.md` não segue a estrutura padrão Auroq (sem seções claras) | Ler mesmo assim, mas avisar que a compactação pode ser mais manual/interpretativa |
| KB muito curta (<50 linhas) | Seguir normalmente — nem toda mente tem KB extensa |
| Tasks ausentes ou só o `start.md` | Gerar conversation starters genéricos a partir dos Modos de Operação da persona, avisando a Karol |
