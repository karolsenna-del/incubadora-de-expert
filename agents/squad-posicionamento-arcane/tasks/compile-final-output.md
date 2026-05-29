---
task: "Compile Final Output"
responsavel: "@posicionamento-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Vitrine completa entregue por @vitrine-strategist (QG-PD-003 PASS)"
Saida: "Schema final consolidado entregue ao aluno + lista de pendencias acionaveis"
Checklist:
  - "Todos os 9 itens da vitrine consolidados (display name + bio + link + 3 destaques + 3 pinned)"
  - "Conteudo formatado em markdown copiavel"
  - "Capas-conceito incluidas pra cada item visivel"
  - "Copies produzidas (se aluno aceitou) incluidas completas"
  - "Lista de pendencias acionaveis explicita"
  - "Proxima revisao recomendada (timeline)"
execution_type: "semantic"
---

# Task: Compile Final Output — Compilacao do Schema Final

**Task ID:** posicionamento-digital/compile-final-output
**Version:** 1.0.0
**Category:** Output

---

## Executive Summary

Apos vitrine-strategist entregar todos os 9 itens com check, o chief compila tudo num schema final entregavel. Formato: markdown limpo, copiavel, pronto pra postar.

---

## Inputs

Handoff do vitrine-strategist contendo:
- `display_name` (final + char_count)
- `bio` (type + texto + cta)
- `link_bio` (opcao + ordem + placeholders se houver)
- `destaques[3]` (conteudo + stories + capas)
- `pinned_posts[3]` (formato + copy + capas)
- `pendencias_acionaveis` (lista)
- Acesso ao nucleo de influencia (referencia)

---

## Step-by-Step Execution

### Step 1: Validar Inputs

- Verifica que vitrine-strategist marcou QG-PD-003 PASS
- Verifica que os 9 itens existem (mesmo que placeholder)
- Verifica que itens com `quer_produzir=true` tem copy/stories produzidos

### Step 2: Estruturar Output

Formato padrao:

```markdown
# Sua Vitrine de Posicionamento — Pronta pra Postar

> Squad Posicionamento Arcane | Mentoria Arcane
> Concluido em [data]
> Baseado no seu nucleo de influencia

---

## 🎯 NUCLEO DE INFLUENCIA (referencia rapida)

- **Quem voce ajuda:** [Ponto 3]
- **Dor:** [Ponto 5]
- **Inimigo:** [Ponto 6]
- **Solucao:** [Ponto 10]
- **3 Beneficios:** [Ponto 11]
- **Crenca central:** [crenca 1]

---

## 1️⃣ DISPLAY NAME

```
[nome final escolhido]
```
[N] caracteres. Cola direto no campo "Nome" do perfil Instagram.

---

## 2️⃣ BIO

```
[texto da bio com quebras de linha]
```
[N] caracteres. Tipo: [GROWTH/SALES/DM/LOCAL].

---

## 3️⃣ LINK DA BIO

**Plataforma escolhida:** [Linktree / LP direta / Pagina sob medida]

**Ordem dos links:**
1. [HERO] [funil principal] — sempre primeiro
2. [link 2 + label]
3. [link 3 + label]
4. [link 4 + label]

[Se placeholder: instrucao acionavel]

---

## 4️⃣ DESTAQUE 1 — SOBRE MIM

**Capa-conceito:**
- [frase/palavra que aparece]
- [elemento visual conceitual]
- [hierarquia]

**Stories** (se produzidos):
- Story 1: [texto]
- Story 2: [texto]
- ...

[Se placeholder: estrutura sugerida + instrucoes pra preencher]

---

## 5️⃣ DESTAQUE 2 — PRODUTO

[Mesma estrutura — capa + stories OU placeholder]

---

## 6️⃣ DESTAQUE 3 — DEPOIMENTOS

[Mesma estrutura — capa + estrutura OU placeholder]

---

## 7️⃣ PINNED 1 — SOBRE ELA + TRABALHO

**Formato sugerido:** [Reel / Carrossel / Foto]

**Capa-conceito:**
- [frase/palavra]
- [elemento]
- [hierarquia]

**Copy completa** (se produzida):
```
[texto completo, frame a frame ou slide a slide]
```

---

## 8️⃣ PINNED 2 — TESE / CRENCA

[Mesma estrutura]

---

## 9️⃣ PINNED 3 — PRODUTO E OFERTA

**Formato sugerido:** [Carrossel / Reel]

**Estrutura interna:**
1. Ruminacao (slides 1-3)
2. Solucao (slides 4-5)
3. Produto (slides 6-7)
4. CTA (slides 8)

**Capa-conceito:**
- [frase/palavra]
- [elemento]

**Copy completa** (se produzida):
```
[texto completo com estrutura ruminacao→solucao→produto→CTA marcada]
```

[Se placeholder: estrutura preenchivel]

---

## 📌 PENDENCIAS ACIONAVEIS

□ [Pendencia 1 — concreto, com proximo passo]
□ [Pendencia 2]
□ [Pendencia 3]
□ ...

> **Se voce tem 3+ placeholders:** Sua vitrine sai com partes pendentes 
> nao porque o squad falhou — e porque voce ainda nao tem todos os ativos. 
> Isso e NORMAL pra quem ta comecando. As pendencias acima viram seu roteiro 
> dos proximos 30-60 dias. Volta aqui (`/squad-posicionamento-arcane` + 
> `*review {item}`) quando completar cada uma.

---

## 🔄 PROXIMA REVISAO RECOMENDADA

Em [30/60/90] dias. Coisas pra rever:
- [item provavel de revisar — ex: trocar pinned 2 quando tiver case novo]
- [outros]

---

## ✅ CHECKLIST DE IMPLEMENTACAO

Antes de considerar postado:
- [ ] Display name atualizado no perfil
- [ ] Bio colada e link bio atualizado
- [ ] [Plataforma escolhida] configurada com ordem correta de links
- [ ] 3 destaques criados com capas
- [ ] 3 pinned posts publicados E fixados (toca na ⋮ → "Fixar na pagina")
- [ ] Capas dos destaques alinhadas visualmente (paleta + fonte consistentes)
- [ ] Foto de perfil compativel com display name

---

Pronto. Bora pra cima.
```

### Step 3: Apresentar Output

Mostra o output completo. Pergunta se quer:
- A) Receber tudo em 1 mensagem (cola onde quiser)
- B) Receber em partes (item por item)
- C) Receber em arquivo .md (salva)

### Step 4: Encerrar Squad

Marca todas as fases como `completed` no state. Despede do aluno:

```
Squad encerrado. Voce tem TUDO que precisa.

Se quiser revisar algo no futuro, e so chamar /squad-posicionamento-arcane 
de novo e usar `*review {item}`.

Boa vitrine. 🚀
```

---

## Veto Conditions

| Condicao | Acao |
|----------|------|
| Algum item nao tem check do aluno | Voltar pro vitrine-strategist completar antes de compilar |
| Vitrine completa mas placeholder em itens criticos | Compilar mesmo assim, listar pendencias com prioridade |
| Aluno quer alterar item depois de compilar | Re-rodar build-{item} no vitrine-strategist + re-compilar |

---

**Task Status:** Ready for Production
