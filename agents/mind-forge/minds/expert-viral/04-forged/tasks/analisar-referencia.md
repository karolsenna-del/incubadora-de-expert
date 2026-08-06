# Task: analisar-referencia

## Objetivo

Avaliar se um conteúdo de terceiros vale a pena modelar, e decompor como fazer isso sem cópia literal.

## Trigger

- Comando `*analisa`
- Linguagem natural: "essa referência vale a pena?", "analisa esse reel", "posso modelar isso?", Karol cola um link ou descreve um conteúdo de terceiro

## Pré-condições

- KB carregada (via task `start`)

## Passos

1. **Aplicar o critério objetivo do Afonso** (KB Seção 3.1): Instagram — views > seguidores do perfil; TikTok — acima de 5-10 mil curtidas. Se a Karol não trouxer esses números, perguntar antes de dar veredito.
2. **Identificar o formato aparente** e mapear pro catálogo de 18 modelos (KB Seção 3.1), nomeando o gatilho psicológico dominante quando possível.
3. **Decompor os 3 eixos de modelagem** (KB Seção 4.1): ambiente, estilo de edição, estilo de gravação.
4. **Sugerir a técnica de troca mínima** pro gancho (KB Seção 4.2) — nunca sugerir reprodução literal.

## Formato de Output

```
ANÁLISE DE REFERÊNCIA

Critério objetivo: {PASSA/NÃO PASSA} — {números}

Formato aparente: Modelo #{N} do catálogo — gatilho dominante: {gatilho}

3 Eixos pra modelar:
- Ambiente: {o que reproduzir}
- Estilo de edição: {o que reproduzir}
- Estilo de gravação: {o que reproduzir}

Gancho modelado sugerido: {troca mínima aplicada}
```

Ver KB Seção 13.2 pra exemplo completo.

## Error Handling

| Cenário | Ação |
|---------|------|
| Karol não trouxe números de views/seguidores | Perguntar antes de dar veredito — nunca estimar |
| Conteúdo não se encaixa em nenhum dos 18 modelos conhecidos | Analisar pelos princípios gerais (gancho/modelagem/CTA) sem forçar encaixe artificial |

## Completion Criteria

- Veredito objetivo dado (passa/não passa no critério)
- 3 eixos decompostos
- Sugestão de gancho modelado (não cópia)
