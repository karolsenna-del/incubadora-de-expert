# Task: roteirizar

## Objetivo

Entregar um roteiro pronto (gancho, corpo, CTA) a partir de um tema ou pedido do aluno.

## Trigger

- Comando `*roteiriza`
- Linguagem natural: "cria um roteiro", "cria um Reels sobre X", "preciso postar hoje", "me ajuda a escrever sobre X", "faz um conteúdo sobre X", "que gancho eu uso pra..."

## Pré-condições

- KB carregada e Entrada coletada (via task `start`)

## Passos

1. **Identificar tema e assunto.** Se o aluno trouxer só um tema amplo (ex.: "relacionamento"), pedir o recorte específico — "assunto vago não vira gancho forte" (KB Seção 5.2 / 12, item 5.6 herdado da regra de Clara).
2. **Escolher formato.** Se o aluno não especificar, usar a Estrutura de 8 Passos da Clara como espinha dorsal (KB Seção 10.2). Se ele pedir um formato específico do catálogo (ex.: "modelo de comparação"), usar esse.
3. **Construir o gancho** combinando pelo menos 2 dos 3 tipos (visual/frase/áudio — KB Seção 5.2). Ir direto ao ponto, sem introdução.
4. **Preencher o corpo** com liberdade criativa (Afonso) e, se fizer sentido pro tema, usar a técnica de História/Conexão do Rafael (KB Seção 6.1).
5. **Fechar com CTA obrigatória.** Nunca entregar roteiro sem ela. Se for opinião/debate, oferecer CTA Duplo de Clara — só se o tema for de negócio/mercado.
6. **Checar as restrições de governança:** se o assunto tocar em polarização político-partidária, religiosa, ou em qualquer tema que o aluno marcou como limite na Entrada, ativar o Immune System (recusar e redirecionar) ANTES de escrever qualquer coisa.
7. **Adicionar nota de edição** (ritmo, corte, legenda, música) se for relevante pro formato escolhido.

## Formato de Output

```
ROTEIRO — {Formato escolhido}

1. Formato: {nome}
2. Tema: {tema}
3. Assunto: {recorte específico}
4. Gancho: {frase/visual/áudio}
5. Início: {contexto}
6. Meio: {desenvolvimento}
7. Fim: {frase de impacto}
8. CTA: {chamada de ação}

Nota de edição: {se aplicável}
```

Ver KB Seção 13.1 pra exemplo completo.

## Error Handling

| Cenário | Ação |
|---------|------|
| Tema tocar em política/religião/limite do aluno como isca de debate | Ativar Immune System — recusar e oferecer alternativa de opinião de negócio |
| Aluno não der assunto específico, só tema | Perguntar o recorte antes de escrever o gancho |
| Roteiro ficaria sem CTA | Nunca entregar assim — sempre completar com CTA antes do output final |

## Completion Criteria

- Roteiro com os 8 elementos preenchidos
- CTA presente
- Nenhuma violação das restrições de governança da sessão
