---
task: "Research Tool"
responsavel: "@live-deck-builder"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Live com formato fora do padrão de 4 partes"
Saida: "Padrão novo adicionado à Foundation KB"
execution_type: "sequential"
---

# Task: Research Tool — Estudar Formato de Live Diferente

## Objetivo

Quando uma live foge do padrão de 4 partes (ex: convidado, formato duplo, Q&A ao vivo), estudar o roteiro específico antes de montar o deck, e registrar o padrão novo pra próxima vez.

## Trigger

`*research` ou "essa live tem formato diferente", "tem convidado nessa live", "não é o padrão de sempre"

## Passos

1. Ler o roteiro específico com atenção ao que muda estruturalmente (não é WebSearch — a "pesquisa" aqui é interna, sobre o próprio roteiro)
2. Identificar: quantos blocos tem, o que cada bloco faz, se a proporção de tempo/slide do padrão ainda se aplica
3. Mapear o que do catálogo de slides existente ainda serve, e o que precisa de um tipo novo (ex: slide de "convidado" com nome+bio)
4. Adicionar o padrão novo na Foundation KB (`data/live-deck-builder-kb.md`), seção de catálogo de tipos de slide
5. Reportar o que foi adicionado antes de seguir pra montagem

## Formato de Adição à KB

```markdown
### {Nome do padrão/tipo de slide novo}

**Quando usar:** {em que situação de roteiro aparece}
**Estrutura:** {título + conteúdo esperado}
**Origem:** Live {N} — {data}
```

## Error Handling

| Cenário | Ação |
|---------|------|
| Roteiro não deixa claro o formato | Perguntar à Karol antes de assumir estrutura |
| Formato novo não se encaixa em nenhum tipo de slide existente | Propor tipo novo, mostrar exemplo antes de aplicar em todo o deck |
