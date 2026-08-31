# PLAYBACK: Reels Virais Aluno

**Status:** APROVADO — mente ativada em `agents/reels-virais-aluno/`
**Tipo:** Mente Sintética (herdada de `agents/expert-viral/`, versão pessoal da Karol — original intacto)
**Modo de construção:** ADAPT, não CREATE — não houve ingestão de fontes brutas (Fases 1-2 do pipeline padrão), a mente já estava forjada e rica; o trabalho foi generalização pontual, não extração.

## Fontes

`agents/expert-viral/` completo: `agents/expert-viral.md`, `config.yaml`, `data/expert-viral-kb.md`, `tasks/{start,roteirizar,analisar-referencia,diagnosticar,consultor}.md`.

## Experts (herdados, sem alteração de método)

- Afonso Molina (ROTA 100K)
- Rafael Bem (Reels Pro)
- Clara Siqueira (Código PEV 2.0)

## Domínios (8, todos genéricos)

Caça de Referência/Curadoria · Modelagem e Adaptação · Construção de Gancho · Corpo/Retenção do Meio · CTA · Edição/Ritmo/Frequência · Algoritmo/Métricas/Troubleshooting · Vozes (quando puxar cada expert)

Mais: Princípios de Convergência Tripla, Caixa de Ferramentas, 18 Heurísticas Mestras, catálogo de 18 Modelos Virais.

## O que foi generalizado (única mudança de conteúdo)

1. **Seção 2.2 da KB (Restrições de Governança)** — de regra fixa "definida pela Karol" (nunca tema político-religioso, protege a autoridade/imagem dela) para regra configurável por sessão: política/religião continua padrão, mas o agente pergunta ao aluno, na Entrada, se existe algum outro tema que ele especificamente não quer tocar.
2. **Seção 1 (Visão Geral)** — "base operacional da Karol" → "base operacional do aluno".
3. Referências pontuais a "Karol" trocadas por "aluno"/"você" ao longo da KB (linhas 15, 206, 291, 307 do original) e dos 5 tasks.
4. **Nova seção "ENTRADA"** no agent.md (não existia no original — a Karol não precisa "entregar documento" pra si mesma) — coleta Persona + Promessa + Processo Autoral (obrigatórios) e Autoridade Tríplice (opcional), mesmo padrão já estabelecido em `live-expert-aluno` e `stories-expert-aluno`.

## O que NÃO mudou (fidelidade ao método)

- Catálogo de 18 Modelos Virais, taxonomia de gatilhos, fórmulas de gancho, Ciclo de Troubleshooting, regra de desempate Afonso>Rafael — tudo método dos 3 experts-fonte, preservado integralmente.
- Os 4 modos de operação (Roteirista, Analista de Referência, Troubleshooting, Consultor) e o Immune System — estrutura idêntica, só generalizando o texto de resposta onde citava "Karol"/"sua persona" de forma não genérica.

## Gaps

Nenhum — mente já era rica (8 domínios, catálogo completo, 393 linhas de KB original). Generalização foi cirúrgica, não reconstrução.

## Validação

Confirmado via `git status --porcelain` que `agents/expert-viral/` não foi alterado — só arquivos novos criados em `agents/reels-virais-aluno/` e `agents/mind-forge/minds/reels-virais-aluno/`.

**Próximo passo:** testar com uma missão real antes de empacotar como chat-agente. Depois de validado, o gpt-publisher compacta pro `AGENTES_CONFIG` em `chat-agente.js` — a KB completa (~400 linhas) provavelmente precisa de curadoria adicional nesse momento, já que o campo `systemPrompt` de um chat completion tem custo por token maior que rodar nativo no Auroq.
