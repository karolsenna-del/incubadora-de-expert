# IA Videos Arcane

Squad de produção de criativos de anúncio em vídeo via Higgsfield. Recebe roteiros ou ideias, propõe formatos, produz lotes de teste, pontua com o Virality Predictor, roda feedback loop até acertar e escala em variações.

## Ativação

```
/squad-iavideos-arcane
```

## Pré-requisito

O squad usa o CLI do Higgsfield. Antes do primeiro uso, o agente conduz o setup:

1. Instalar o CLI: `curl -fsSL https://raw.githubusercontent.com/higgsfield-ai/cli/main/install.sh | sh`
2. Autenticar: `higgsfield auth login`

As skills `higgsfield-*` (generate, soul-id, product-photoshoot) precisam estar disponíveis no ambiente.

## Agentes

| Agente | Papel |
|--------|-------|
| @iavideos-chief | Orquestra o pipeline, conduz setup, validação, feedback loop e entrega |
| @estrategista-criativo | Classifica o input, roteiriza ideias e propõe formatos/ângulos/hooks |
| @diretor-persona | Escolhe ou cria avatares (sub-loop de geração até aprovação) |
| @operador-higgsfield | Produz peças, roda Virality Predictor, escala variações e entrega |

## Pipeline

```
0. Setup do ambiente        (Chief)        — 1ª vez
1. Conceito                 (Estrategista) — classifica, roteiriza, propõe formatos
2. Validação do conceito    (Chief)        ⚡ QG-IAV-01
3. Avatar                   (Diretor)      — condicional, só UGC
4. Produção                 (Operador)     ⚡ QG-IAV-02
5. Avaliação e feedback     (Chief)        ⚡ QG-IAV-03
6. Escala de variações      (Operador)
7. Entrega                  (Operador)     — vídeos em ~/Downloads/
```

## Como funciona

O squad é colaborativo: propõe e você decide. Você manda um roteiro pronto ou só uma ideia. O Estratega classifica, roteiriza se preciso e propõe um leque de formatos. Você valida o conceito. O Operador produz um lote de teste, roda o Virality Predictor em cada peça e o Chief te apresenta com as notas. Você dá feedback, o squad regenera até acertar. Aprovado, o Operador escala em variações (avatar, copy ou formato) e baixa tudo numa pasta.

## Conhecimento

A `data/` traz a KB embarcada: melhores práticas de anúncio (pesquisa de mercado 2026), catálogo de modelos Higgsfield, guia de produção, guia de personas e treino (Soul ID + padrão de qualidade orgânico), troubleshooting e regras cardinais. O squad é autocontido — funciona sem dependências externas.

## Use cases

- **Pipeline completo** — roteiro/ideia → criativos prontos
- **Ideia crua** — só uma ideia, o squad roteiriza
- **Variação de formato** — transformar um criativo existente em outro formato
- **Reavivar campeão** — refazer um criativo antigo de bom desempenho com nova cara
