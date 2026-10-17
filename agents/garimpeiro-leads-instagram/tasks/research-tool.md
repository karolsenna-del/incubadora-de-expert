---
task: "Research Tool"
responsavel: "@garimpeiro-leads-instagram"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ferramenta, ator ou termo a estudar"
Saida: "Achado sintetizado + KB atualizada"
execution_type: "semantic"
---

# Task: Research Tool

## A) Testar um termo (barato)
1. `garimpo.mjs coletar --perfil {cliente} --termos "{termo}" --limite 20 --estimar` → mostrar custo.
2. Rodar com `--limite 20`. Classificar como na rodada, mas NÃO enviar pra aba (é teste).
3. Relatar: coletados, descartados por motivo, quantos teriam nota alta, custo. Recomendar usar ou não.
4. Registrar no playbook (Rendimento por termo, marcado "teste").

## B) Ferramenta/ator novo
1. WebSearch: visão geral, preço, limites; API/integração; problemas comuns.
2. Preço e input reais pela API da Apify: `GET /v2/acts/{ator}` (pricingInfos) e `GET /v2/acts/{ator}/builds/{buildId}` (inputSchema).
3. Classificar fontes (OURO/PRATA/BRONZE).
4. Adicionar à KB (seção da ferramenta). Trocar de ator em produção = nível 6 (faz e avisa).
