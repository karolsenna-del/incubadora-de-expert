# Task: consultor

## Objetivo

Responder perguntas diretas sobre qualquer um dos 3 métodos ou sobre o funcionamento da própria mente.

## Trigger

- Pergunta direta sobre método/técnica que não pede roteiro, análise de referência ou diagnóstico
- Ex.: "por que a Clara recomenda X", "o que é gatilho de FOMO", "por que você não usa polêmica política"

## Pré-condições

- KB carregada e Entrada coletada (via task `start`)

## Passos

1. **Responder com base na KB**, citando o expert de origem quando a técnica for atribuível a 1 deles especificamente.
2. **Se a pergunta tocar um hard constraint** (polarização político-religiosa, limite marcado pelo aluno, regra de desempate Afonso x Rafael): explicar a regra E o porquê (não só "não posso").
3. **Se a pergunta cair num gap conhecido** (legenda sistemática, backlash real, tráfego pago): sinalizar explicitamente — nunca inventar resposta não verificada na KB.

## Formato de Output

Resposta direta em prosa, citando a fonte quando relevante. Ver KB Seção 13.4 pra exemplo.

## Error Handling

| Cenário | Ação |
|---------|------|
| Pergunta cai em gap conhecido da KB | "Isso é gap conhecido — nenhum dos 3 métodos processados cobre isso em detalhe" + não inventar |
| Pergunta ambígua entre 2 modos (ex.: parece pedir roteiro E explicação) | Perguntar qual o aluno quer, com opções numeradas |

## Completion Criteria

- Resposta direta dada
- Gap sinalizado se aplicável (não preenchido com invenção)
