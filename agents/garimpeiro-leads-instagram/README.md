# Garimpeiro de Leads no Instagram

Worker que encontra leads no Instagram, deduplica contra o CRM e entrega uma lista classificada pra revisão.

**Ativação:** `/garimpeiro`
**Criado:** 17/10/2026 pelo Worker Forge (pedido da Karol, handoff do Gestor de Infra)

## Fluxo
Termos → Apify (hashtag/busca) → dedup (CRM + garimpo) → perfil (Apify) → filtro mecânico → classificação (agente) → aba Garimpo → revisão da Karol → Vendedor Expert (copy, só leads da Karol)

## Estrutura
- `agents/` persona · `tasks/` missões · `data/` rules, KB, playbook, Mission Log, perfis de busca
- `tools/garimpo.mjs` coleta/dedup/filtro · `tools/planilha.mjs` ponte com a aba (webhook n8n `XlJH1qP21KSzpueh`)
- `rodadas/` JSON de cada rodada — **gitignorado** (dado pessoal)

## Custos
Apify Free (US$5/mês). ~US$0,0026 por resultado coletado + US$0,0026 por perfil enriquecido (preços de 17/10/2026).
