# Instagram Scheduler — Playbook

> SOPs e procedimentos passo-a-passo. Carregado sob demanda.
> Cresce a cada processo novo executado.

---

## Estrutura

- **Recorrentes:** processos executados toda vez
- **Sob demanda:** processos acionados por trigger específico
- **One-shot:** processos de configuração/setup (executados uma vez)

---

## RECORRENTES

### SOP-001: Agendar Carrossel (Fluxo Principal)

**Trigger:** Karol aprova carrossel e chama o worker
**Input:** Pasta em `business/instagram/fila/{slug}/` com slides + `legenda.txt`
**Output:** Post agendado no Instagram + log atualizado + pasta movida
**Regras obrigatórias:** Confirmar antes de executar. Nunca alterar conteúdo. Parar se API falhar.

**Passos:** Ver `tasks/execute-mission.md` (fluxo completo)

---

### SOP-002: Renovar Token Meta

**Trigger:** Token com menos de 5 dias para expirar OU erro 190 da Meta API
**Input:** Token atual do Vault
**Output:** Novo token salvo no Vault
**Regras obrigatórias:** Salvar no Vault imediatamente após renovação. Registrar data de expiração.

```
GET https://graph.instagram.com/refresh_access_token
  grant_type   = ig_refresh_token
  access_token = {TOKEN_ATUAL}
```

Atualizar `data/vault.md`:
- `META_TOKEN`: novo token
- `META_TOKEN_EXPIRES`: data de expiração (hoje + 60 dias)

---

## SOB DEMANDA

### SOP-003: Verificar Fila

**Trigger:** Karol pede status OU `*status` OU `*fila`
**Output:** Lista de carrosséis aguardando na fila

```bash
ls business/instagram/fila/
```

Para cada pasta: verificar se tem slides + legenda.txt.

Reportar:
```
Fila atual ({N} carrosséis):
  ✓ {slug-1} — slides: {N}, legenda: sim
  ✓ {slug-2} — slides: {N}, legenda: sim
  ✗ {slug-3} — slides: {N}, legenda: NÃO (aguardando agente de conteúdo)
```

---

### SOP-004: Ver Log de Agendamentos

**Trigger:** `*log` ou "mostra os últimos agendamentos"
**Output:** Últimas entradas de `business/instagram/agendamentos.md`

Mostrar últimas 10 linhas da tabela de log.

---

## ONE-SHOT (Setup Inicial)

### SOP-100: Configuração Inicial

**Executado:** Uma vez, na primeira vez que o worker é ativado.
**Objetivo:** Garantir que toda a infraestrutura está em ordem.

**Checklist:**
- [ ] Vault preenchido com Meta Token + IG User ID
- [ ] Vault preenchido com Google Service Account JSON
- [ ] Vault preenchido com Drive Folder ID
- [ ] Pasta `business/instagram/fila/` existe
- [ ] Pasta `business/instagram/agendados/` existe
- [ ] Arquivo `business/instagram/agendamentos.md` existe
- [ ] Token Meta válido (verificar via API)
- [ ] Drive API acessível (test upload + delete)

---

## Template de SOP (para novos processos)

```markdown
### SOP-{N}: {Nome do Processo}

**Trigger:** {quando executar}
**Input:** {o que entra}
**Output:** {o que sai}
**Regras obrigatórias:** {regras específicas}

**Passos:**
1. {passo 1}
2. {passo 2}
...

**Error handling:**
| Cenário | Ação |
|---------|------|
| {cenário} | {ação} |
```
