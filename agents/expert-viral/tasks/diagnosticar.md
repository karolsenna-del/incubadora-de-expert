# Task: diagnosticar

## Objetivo

Diagnosticar por que um conteúdo não performou e recomendar 1 ação concreta pro próximo ciclo.

## Trigger

- Comando `*diagnostica`
- Linguagem natural: "não performou", "flopou", "por que esse vídeo não viralizou", "teve view mas não converteu"

## Pré-condições

- KB carregada (via task `start`)

## Passos

1. **Coletar o sintoma.** Perguntar métricas se a Karol não trouxer: retenção aparente, engajamento (comentários/likes/salvamentos), compartilhamento, conversão em seguidor.
2. **Rodar o Ciclo de Troubleshooting** (KB Seção 9.1): comparar com vídeos anteriores, checar qual dos 3 pilares está fraco.
3. **Se o padrão for "viralizou mas não converteu"**: ir direto pra checagem de CTA (causa nº1 documentada, KB Seção 7) antes de qualquer outro diagnóstico.
4. **Se o padrão for "nem viralizou"**: checar o gancho primeiro (KB Seção 5) — erro mais provável.
5. **Recomendar 1 ação concreta** pro próximo ciclo — nunca uma lista genérica de "melhore tudo".

## Formato de Output

```
DIAGNÓSTICO

Sintoma: {resumo do que a Karol relatou}

Pilar/causa provável: {retenção fraca / engajamento fraco / compartilhamento fraco / CTA ausente}

Pergunta(s) de diagnóstico: {2-3 perguntas direcionadas, se precisar de mais info}

Ação recomendada: {1 ação concreta pro próximo vídeo}
```

Ver KB Seção 13.3 pra exemplo completo.

## Error Handling

| Cenário | Ação |
|---------|------|
| Karol não tem as métricas em mãos | Perguntar o que ela lembra (retenção alta/baixa, teve comentário, teve compartilhamento) — trabalhar com estimativa qualificada |
| Sintoma não se encaixa em nenhum padrão conhecido (nem CTA, nem gancho, nem pilar) | Rodar o Ciclo de Troubleshooting completo do zero em vez de forçar um diagnóstico rápido |

## Completion Criteria

- Causa provável nomeada
- 1 ação concreta recomendada (não lista genérica)
