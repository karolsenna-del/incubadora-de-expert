---
task: "Update Squad"
responsavel: "@forge-smith"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Nome do squad existente + descricao da mudanca desejada"
Saida: "Squad atualizado em squads/{name}/, audit-report apos mudanca, file list das edicoes"
Checklist:
  - "Squad existente identificado e backup criado"
  - "Mudanca descrita pelo usuario clarificada"
  - "Edicoes cirurgicas aplicadas (sem reextrair)"
  - "Self-audit roda apos edicao (mantem profundidade)"
  - "squad-validator.js PASS apos edicao"
  - "Smoke test do que mudou: 1/1 PASS"
execution_type: "interactive"
---

# Task: Update Squad — Modificacao Cirurgica de Squad Existente

**Task ID:** squad-forge/update-squad
**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-05-05
**Category:** Maintenance
**Execution Type:** Interactive

---

## Executive Summary

Modo `*update {squad-name}` do forge-chief. Permite mudancas cirurgicas em squad existente sem rodar pipeline completo de extracao. Diferente de `*rebuild` (refaz do zero), `*update` edita preservando o que ja funciona.

**Quando usar:**
- Adicionar/remover 1 agente
- Editar persona/comandos de agente especifico
- Atualizar KB com novo conhecimento
- Adicionar/remover task
- Corrigir typo ou ajuste pequeno

**Quando NAO usar (usar `*rebuild`):**
- Repensar arquitetura inteira
- Mudar processo extraido fundamentalmente
- Squad com profundidade muito abaixo do padrao (melhor refazer)

---

## Pipeline Visual

```
update-squad
  |
  v
STEP 1: IDENTIFY SQUAD
  Listar squads/, validar existencia
  |
  v
STEP 2: BACKUP
  squads/{name}/ → squads/_archive/{name}-{timestamp}/
  |
  v
STEP 3: CLARIFY CHANGE
  Conversar com usuario: o que muda exatamente?
  |
  v
STEP 4: SURGICAL EDIT
  Editar arquivos especificos (nao reescrever tudo)
  |
  v
STEP 5: SELF-AUDIT
  Garantir profundidade preservada apos edicao
  |
  v
STEP 6: STRUCTURAL VALIDATION
  squad-validator.js PASS
  |
  v
STEP 7: SMOKE TEST
  Cenario que exercita o que mudou
  |
  v
STEP 8: FINALIZE
  Atualizar tracker do squad + log
```

---

## Step-by-Step Execution

### Step 1: Identify Squad

Listar squads instalados e validar:

```bash
ls -1 squads/ | grep -v '^_'
```

Se `{squad-name}` nao existe, oferecer lista pra usuario escolher.

### Step 2: Backup

```bash
mkdir -p squads/_archive
cp -r squads/{squad-name}/ squads/_archive/{squad-name}-{ISO_timestamp}/
```

Avisar usuario:
```
Backup criado em squads/_archive/{name}-{timestamp}/
Se algo der errado, posso restaurar a partir dele.
```

### Step 3: Clarify Change

Conversar pra entender exatamente o que muda:

```yaml
elicit: true
prompt: |
  Squad {name} backup feito. Agora me conta:

  - Que tipo de mudanca: adicionar agente, editar agente, mudar task, atualizar KB, outra?
  - Em qual arquivo especifico (se souber)?
  - Qual o comportamento NOVO esperado?
  - Tem algum exemplo concreto?
type: "free_text"
```

Antes de editar, **confirmar entendimento:**

```
Entendi: voce quer {resumo da mudanca}.

Vou editar:
- {arquivo 1}: {o que muda}
- {arquivo 2}: {o que muda}

Confirma?
```

### Step 4: Surgical Edit

Aplicar **apenas** as edicoes acordadas. Nao reescrever arquivo inteiro pra mudar 1 linha.

**Regras:**
- Preservar formatacao existente
- Preservar Output Examples e Immune System (a menos que a mudanca seja explicitamente sobre isso)
- Manter rastreabilidade aos PUs originais (se squad foi gerado pelo forge)
- Atualizar version do agente/task editado (1.0.0 → 1.0.1)

**Se mudanca exige novo agente:**
- Gerar arquivo completo seguindo formato obrigatorio do `assemble-squad.md` Step 3 (>=250 linhas, 3+ Output Examples, etc)

**Se mudanca exige nova task:**
- Gerar com 8 campos TASK-FORMAT-SPEC-V1

### Step 5: Self-Audit (preservar profundidade)

Rodar checks quantitativos do `assemble-squad.md` Step 8 nos arquivos editados:

```bash
# Para cada arquivo editado
for arquivo in {lista_de_editados}; do
  if [[ "$arquivo" == *"agents/"* ]]; then
    lines=$(wc -l < "$arquivo")
    examples=$(grep -c "^### Exemplo" "$arquivo")
    triggers=$(grep -c "IMMUNE SYSTEM" "$arquivo" | wc -l)
    if [ "$lines" -lt 250 ]; then echo "FAIL: $arquivo encolheu pra $lines linhas"; fi
    if [ "$examples" -lt 3 ]; then echo "FAIL: $arquivo perdeu Output Examples"; fi
  fi
done
```

**Se profundidade caiu:** rejeitar edicao, restaurar do backup, perguntar ao usuario:

```
A edicao reduziu profundidade do agente {name}:
- Linhas: {antes} → {depois}
- Output Examples: {antes} → {depois}

Posso:
1. Manter a edicao e expandir o agente pra recuperar profundidade
2. Reverter pro backup e fazer edicao diferente
3. Aceitar mesmo assim (override — squad fica abaixo do padrao)
```

### Step 6: Structural Validation

```bash
node .auroq-core/development/scripts/squad/squad-validator.js squads/{squad-name}/
```

Self-healing loop max 3 tentativas (mesmo padrao do assemble-squad).

### Step 7: Smoke Test

Construir 1 cenario que exercita o que mudou:

```yaml
elicit: true
prompt: |
  Mudanca aplicada. Vamos testar:

  Imagina que {trigger relacionado a mudanca}.

  O squad faria:
  {fluxo esperado apos mudanca}

  Bate com o que voce esperava?
type: "confirmation"
```

Se usuario rejeita: voltar pro Step 3 (re-clarificar mudanca).

### Step 8: Finalize

Atualizar:

1. **Tracker do squad** (`business/campanhas/squad-{name}/tracker.md` se existir):
   ```markdown
   ## LOG
   - {data} — @forge-smith via *update: {resumo da mudanca}
   ```

2. **Version do squad** em `squad.yaml`: bump patch version (1.0.0 → 1.0.1)

3. **Mensagem final ao usuario:**
   ```
   Squad {name} atualizado.

   Arquivos editados: {lista}
   Backup em: squads/_archive/{name}-{timestamp}/
   Validacao: PASS
   Smoke test: PASS

   Pra reverter: restaurar do backup.
   ```

---

## Outputs

| Arquivo | Conteudo |
|---------|----------|
| `squads/{name}/{arquivos editados}` | Squad atualizado |
| `squads/_archive/{name}-{timestamp}/` | Backup do estado anterior |
| `business/campanhas/squad-{name}/tracker.md` | LOG atualizado |

---

## Error Handling

| Cenario | Acao |
|---------|------|
| Squad nao existe | Listar disponiveis, perguntar qual |
| Mudanca afeta arquitetura inteira | Sugerir `*rebuild` ao inves |
| Profundidade cai apos edicao | Rejeitar (Step 5) |
| validator FAIL apos 3 tentativas | Restaurar backup, reportar |
| Usuario rejeita smoke test | Voltar ao Step 3 |

---

**Task Status:** Ready for Production
