---
task: "Generate Production Checklist"
responsavel: "@course-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Produto completo e revisado (QG-CC-009 aprovado)"
Saida: "Checklist completo de tudo que falta produzir pra lancar"
Checklist:
  - "Itens por aula gerados (gravar, editar, subir)"
  - "Materiais de apoio listados"
  - "Setup de plataforma listado"
  - "Itens de venda listados (pagina, checkout, emails)"
  - "Itens transversais listados"
  - "Tudo priorizado (P1/P2/P3)"
  - "Expert confirmou que o checklist cobre tudo"
execution_type: "interactive"
---

# Task: Generate Production Checklist — Fase 9

**Task ID:** course-creator/generate-checklist
**Version:** 2.0.0
**Status:** Production Ready
**Created:** 2026-04-08
**Category:** Finalization
**Execution Type:** Interactive

---

## Executive Summary

O squad DESENHOU o produto. Agora lista TUDO que o expert precisa produzir/fazer pra colocar no ar. O checklist e gerado automaticamente a partir de tudo que foi desenhado nas fases anteriores. Organizado por categoria e prioridade.

**Gate:** QG-CC-010 — Checklist de Producao Confirmado

---

## Step-by-Step Execution

### Step 1: Varrer Todas as Fases

Ler todos os artefatos das fases anteriores e extrair itens de producao:

**Do curso (Fases 3-5):**
- Para cada aula: gravar, editar/pos-produzir, subir na plataforma
- Duracao estimada por aula (se disponivel)
- Materiais de apoio mencionados (slides, PDFs, exercicios, templates)

**Do branding (Fase 6):**
- Aplicar naming em todos os materiais
- Verificar posicionamento em todos os pontos de contato

**Do empacotamento (Fase 7):**
- Entregaveis comprometidos no cartao de identidade
- Stack de entrega (plataforma, ferramentas, canais)

### Step 2: Gerar Checklist por Categoria

```
=== CHECKLIST DE PRODUCAO — {Nome do Curso} ===

📹 GRAVACAO E PRODUCAO
- [ ] Gravar aula: {nome} (Modulo {X}) — ~{min} estimados
- [ ] Gravar aula: {nome} (Modulo {X}) — ~{min} estimados
  ... (por aula, na ordem dos modulos)
- [ ] Editar/pos-produzir aula: {nome}
  ... (por aula)

📚 MATERIAIS DE APOIO
- [ ] Criar {material} para aula {nome}
  ... (por material mencionado no roteiro)

🖥️ PLATAFORMA
- [ ] Configurar area de membros (modulos, acessos, permissoes)
- [ ] Subir aulas na plataforma (por aula)
- [ ] Configurar ordem e liberacao de conteudo
- [ ] Testar acesso do aluno (fluxo completo)

💰 VENDA
- [ ] Criar pagina de vendas
- [ ] Configurar checkout/pagamento
- [ ] Criar sequencia de emails (boas-vindas, onboarding)
- [ ] Configurar integracao compra → acesso

🧪 TESTE
- [ ] Testar fluxo completo: compra → acesso → conteudo → suporte

🔄 TRANSVERSAL
- [ ] Revisar branding (naming, posicionamento) em todos os materiais
- [ ] Revisar produto estruturado (cartao de identidade) — esta completo?
- [ ] Definir data de lancamento/abertura
- [ ] Preparar comunicacao de venda (copy, criativos, sequencias)
```

### Step 3: Priorizar

Cada item recebe prioridade:

| Prioridade | Descricao | Criterio |
|-----------|-----------|----------|
| **P1** | Bloqueia lancamento | Sem isso, nao tem como lancar |
| **P2** | Importante | Melhora significativamente a experiencia, mas da pra lancar sem |
| **P3** | Nice to have | Bom ter, mas pode ser feito depois do lancamento |

### Step 4: Quality Gate QG-CC-010

Protocolo de 5 passos:

1. **APRESENTAR** checklist completo, categorizado e priorizado
2. **PERGUNTAR** "Cobre tudo? Falta alguma coisa?"
3. **LOOP DE DEBATE** — ajustar ate satisfeito
4. **APROVACAO EXPLICITA** — expert confirma "cobre tudo"
5. **DONE** — pipeline completo

---

## Veto Conditions

- VETO se checklist nao tem itens por aula (o basico: gravar, editar, subir)
- VETO se faltam itens de plataforma e venda
- VETO se itens nao estao priorizados
- VETO se expert nao confirmou que cobre tudo

---

## Error Handling

| Cenario | Acao |
|---------|------|
| Expert quer adicionar itens nao previstos | Adicionar. O checklist e do expert |
| Muitos itens P1 | Normal pra curso completo. Organizar em ordem logica de execucao |
| Expert quer prioridade diferente | Ajustar. Prioridade e decisao do expert |
| Itens dependem de ferramentas nao definidas | Adicionar item "Definir ferramenta pra {finalidade}" como P1 |

---

**Task Status:** Ready for Production
