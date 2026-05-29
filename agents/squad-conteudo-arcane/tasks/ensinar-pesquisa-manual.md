---
task: "Ensinar Pesquisa Manual"
responsavel: "@iris-pesquisador"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Nicho do expert"
Saida: "Tutorial passo a passo + checklist pra expert pesquisar sozinho"
Checklist:
  - "Onde pesquisar (YT, IG, TikTok, ingles)"
  - "Como filtrar (canal pequeno + engajamento alto)"
  - "O que olhar (titulo+thumb / headline+hook / padrao de repeticao)"
  - "O que anotar (tema + formato + metricas + hipotese)"
  - "Como integrar achados com Iris depois"
execution_type: "interactive"
---

# Task: Ensinar Pesquisa Manual — Tutorial

**Task ID:** squad-conteudo-arcane/ensinar-pesquisa-manual
**Version:** 1.0.0
**Responsavel:** @iris-pesquisador
**Category:** Educação / Apoio Fase Inicial
**Execution Type:** Interactive

---

## Propósito

IA + olhar humano > só IA. Iris ensina expert a pesquisar manualmente — pratica traz repertorio com o tempo.

---

## Conteúdo do Tutorial

### 1. Onde pesquisar

**Primário — YouTube:**
- Busca por keywords do nicho
- Filtra: por relevância, depois por views (decrescente)
- Olha canais com **menos de 50k seguidores** mas com views muito acima da média (mostra força do tema)

**Secundário — TikTok:**
- Search > keyword > Mais curtidos
- Olha hooks dos primeiros 1-3s

**Concorrentes — Instagram:**
- Perfis do nicho que já viralizam
- Reels com views > 100x número de seguidores

**Internacional — Inglês:**
- YouTube com keywords em inglês
- Identifica tendência antes do BR

### 2. Como filtrar (a regra de ouro)

**Canal pequeno + viral grande = força do tema**

Se um canal com 5k seguidores faz reels de 500k views, o que viralizou foi o TEMA + HOOK, não a fama do criador.

Quando você encontra esse padrão, pega o tema — é mina de ouro pra qualquer expert do nicho usar.

### 3. O que olhar

**No YouTube:**
- TÍTULO do vídeo (carrega o tema)
- THUMB (visual que parou o scroll)

**No Instagram/TikTok:**
- HEADLINE / HOOK do vídeo (frases primárias)
- O que aparece na CAPA (texto + visual)

**Padrão de repetição:**
- O criador repete o mesmo tema + forma? Sinal de tema acertado.
- Múltiplos criadores do mesmo nicho repetindo? Sinal de tema viral mainstream.

### 4. O que anotar

Pra cada descoberta:

```
TEMA: {qual o assunto central}
CANAL: {nome + número de seguidores}
TÍTULO/HOOK: {frase exata)
ALCANCE: {views aproximadas}
FORMATO: {análise / diálogo / lo-fi / etc}
HIPÓTESE: {por que pegou — qual dor/interesse/gatilho}
```

### 5. Cadência sugerida

- **Diário:** 5 min scroll no IG/TikTok com olhar de pesquisador (não consumir, observar)
- **Semanal:** 30-60 min pesquisa estruturada (YT keyword + anotar 10-20 achados)
- **Mensal:** revisar pool com Iris, atualizar baseado em achados

### 6. Como integrar com Iris

- Quando você tem 5-10 achados anotados, manda pra Iris
- Iris compara com pool atual
- Pode adicionar novos temas
- Pode atualizar peso/categoria de temas existentes

---

## Output

Tutorial entregue ao expert + criação de doc próprio em:

`docs/producao-conteudo/{expert}/pesquisa-manual.md` (template inicial, expert preenche ao longo do tempo)

---

**Task Status:** Ready for Production
