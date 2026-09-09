# KB Plan — Clip Expert

## Fontes externas identificadas (build-time inputs)

- `agents/expert-viral/data/expert-viral-kb.md` (393 linhas) — fonte dos critérios de pontuação. **Não copiada literal.** Sintetizada em `agents/clip-expert/data/clip-expert-kb.md` como uma rubrica objetiva de pontuação 0-10 (seção "Rubrica de Pontuação"), adaptada pro contexto de "pontuar um trecho de transcrição de live", que é diferente do contexto original do Expert Viral (roteirizar/analisar Reels prontos).
- `agents/squad-edicao-arcane/agents/stylist.md` — não é fonte de conteúdo pra internalizar, é uma **dependência de runtime** (o squad chama o agente Stylist de verdade, não duplica a lógica dele). Documentado na KB como "como invocar", não copiado.

## target_audience: internal

Squad é de uso interno da Karol por enquanto. Isso relaxa a REGRA AUTOCONTIDO estrita (squad não precisa funcionar isolado numa máquina de aluna que não tem os outros squads) — mas a KB ainda sintetiza o conteúdo do Expert Viral em vez de só linkar, porque é mais robusto e mais fácil de calibrar (rubrica objetiva > "vai lá e pergunta pro Expert Viral toda vez").

## Classificação do squad

**Tipo:** Operacional (curadoria de conteúdo + produção de mídia) — mas de escopo mais estreito que um squad de tráfego/vendas full-time. KB alvo: 500-800 linhas (usa piso do tipo Analítico como referência, já que o núcleo do squad é "avaliar/pontuar", com uma camada operacional de produção de mídia por cima).

## Estrutura da KB (`agents/clip-expert/data/clip-expert-kb.md`)

1. Regras Cardinais (das PU-TACIT e PU-EXCEPTION mais críticas)
2. Rubrica de Pontuação (sintetizada do Expert Viral, adaptada pro contexto de transcrição de live)
3. Protocolo de Detecção e Ingestão (PU-003, PU-012)
4. Protocolo de Transcrição Condicional (PU-004, PU-005)
5. Protocolo de Corte e Legenda (PU-010, PU-015 — como invocar o Stylist)
6. Decision Trees (transcrever ou não; quantidade de cortes)
7. Tabela de Referência (nota → ação)
8. Troubleshooting (live atrasada, Drive bloqueado, Expert Viral indisponível, squad-edicao-arcane não instalado)
9. Glossário (termos do domínio: "corte", "nota mínima", "fila do Postador", etc.)
