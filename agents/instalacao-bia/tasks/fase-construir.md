---
task: "Construir — Passos 5 e 6 do INSTALL"
responsavel: "@construtor"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "QG-IB-001 validado (tabelas, inbox Chatwoot, credentials)"
Saida: "4 workflows importados e ajustados, prompts customizados e injetados (Bia montada, ainda não conectada ao mundo)"
Checklist:
  - "Passo 5: 4 workflows importados (ordem OUTBOUND→AGENT-CORE→INBOUND→CHATWOOT-HUMAN), placeholders/IDs/credentials ajustados, sem node vermelho. NÃO ativar ainda"
  - "Passo 6: prompts-template preenchidos com os dados do aluno (a alma)"
  - "Passo 6: JS validado (node -c), injetado no AGENT-CORE, cache cycle, L4 atualizada no Supabase, zero {{var}} literal"
execution_type: "interactive"
---

# Construir (Passos 5 e 6 do INSTALL)

**Agente:** @construtor · **Gate de saída:** QG-IB-002
**Material:** `data/kit/INSTALL.md` (passos 5, 6), `data/kit/03-workflows.md`, `data/kit/05-prompts.md`, `data/kit/prompts-template/`, `data/kit/regras.md`

## Passo 5 — Importar e ajustar os 4 workflows (~45-60min)
1. Importa na ordem **OUTBOUND → AGENT-CORE → INBOUND → CHATWOOT-HUMAN** · anota os 4 workflow IDs
2. Substitui placeholders (`{{SUPABASE_PROJECT_REF}}`, `{{PHONE_NUMBER_ID}}`, etc) · liga as credentials (zero node vermelho) · resolve os cross-references (Execute Workflow)
3. **NÃO ativa ainda** — ativação é na fase Conectar

## Passo 6 — Customizar e injetar os prompts (a alma) (~60-90min)
> É aqui que a Bia ganha a cara do aluno — **escrever E injetar juntos**, como no INSTALL.
1. Preenche os `prompts-template/*.md` com os dados do aluno (mínimo: L1-L2-base + L3-triage + L4-campanha)
2. **Valida o JS** (`node -c`) ANTES de salvar — prompt com newline cru mata o workflow (REGRA-012)
3. Injeta no node "Configuracao do Agente" do AGENT-CORE (preenche os placeholders dos prompts que já vêm genéricos)
4. **Cache cycle** (REGRA-005) · atualiza a L4 em `bia_campaign_data` no Supabase
5. Confirma: zero `{{var}}` literal (exceto `{{data_*}}` dinâmico)

## Gate QG-IB-002 → reporta ao Chief
4 workflows sem credential vermelha · placeholders substituídos · prompts injetados sem `{{var}}` · JS validado · cache cycle feito.

## Error Handling
| Cenário | Ação |
|---------|------|
| Bia parou após colar prompt | 99% é JS inválido → `node -c`, corrigir, cache cycle |
| Mudança via API não surtiu efeito | Faltou cache cycle |
| Nodes vermelhos | Credential não atribuída |
