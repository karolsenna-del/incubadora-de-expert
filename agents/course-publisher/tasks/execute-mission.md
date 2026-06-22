---
task: "Execute Mission"
responsavel: "@course-publisher"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Descricao da missao pelo usuario"
Saida: "Missao executada + relatorio + Mission Log atualizado"
execution_type: "interactive"
---

# Task: Execute Mission

## Objetivo

Executar missao de geracao de assets ou publicacao na Hotmart.

## Protocolo

### 1. Confirmar entendimento

Antes de executar, confirmar:
- Produto: qual?
- Escopo: gerar assets? upload de videos? configurar capas? tudo?
- Modulos: todos ou especificos?

### 2. Checar pre-requisitos

| Pre-requisito | Como checar |
|---------------|-------------|
| Credenciais no vault | Ler vault — campos preenchidos? |
| Videos na pasta | Listar `business/producao/{produto}/{modulo}/` |
| descricoes.md existe | Verificar `business/producao/{produto}/descricoes.md` |
| Briefing visual existe | Verificar `business/campanhas/{produto}/branding/` |

Se algum estiver faltando: reportar o que falta antes de continuar.

### 3. Consultar Playbook

Identificar qual SOP usar (ver arvore de decisao no topo do Playbook).
Carregar SOPs relevantes.

### 4. Checar Delegation Map

| Decisao | Nivel | Acao |
|---------|-------|------|
| Produto/modulo especificado | 7 | Executar direto |
| Produto nao encontrado na Hotmart | 3 | Confirmar antes de criar |
| Deletar algo existente | 1 | Nunca sem aprovacao explicita |

### 5. Executar

Seguir SOP correspondente.
Monitorar progresso. Registrar erros/gaps durante execucao.

### 6. Reportar resultado

```
=== RELATORIO DE MISSAO ===

Produto: {nome}
Modulos: {lista}

Assets gerados:
  - {tipo}: {N} arquivos → {pasta}

Aulas upadas:
  - {modulo}: {N}/{total} aulas
  - Gaps de descricao: {lista ou "nenhum"}

Erros/pendencias:
  - {lista ou "nenhum"}

Status: COMPLETO / PARCIAL / FALHOU
```

### 7. Documentar

Se processo novo executado: criar SOP no Playbook.
Registrar no Mission Log: data, missao, resultado, assets gerados, videos upados.

## PDSA (apos cada missao)

1. **Plan:** O que era esperado?
2. **Do:** O que foi feito?
3. **Study:** Dimensoes corretas? Uploads OK? Titulos limpos? Descricoes coladas?
4. **Act:** Atualizar SOP? Corrigir seletor Playwright? Registrar novo troubleshooting?
