---
task: "Produzir Peças"
responsavel: "@operador-higgsfield"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Conceito validado + avatares definidos (se UGC)"
Saida: "Lote enxuto de peças de teste gerado pelo Higgsfield"
Checklist:
  - "Modelo Higgsfield correto selecionado para cada peça"
  - "Lote enxuto produzido (1-2 peças por formato — não lote grande de cara)"
  - "Jobs concluídos com URLs válidas"
  - "Falhas de rede recuperadas pelo job ID"
execution_type: "semantic"
---

# Task: Produzir Peças

## Executive Summary

O operador-higgsfield transforma o conceito aprovado em vídeo, usando os modelos certos do Higgsfield e os avatares definidos. Produz lote enxuto de teste — não lote grande — porque o objetivo é descobrir o que funciona antes de escalar.

## Steps

### Step 1: Selecionar o modelo

Para cada formato no conceito, escolher o modelo conforme `data/catalogo-modelos-higgsfield.md`:

- UGC, founder-led, anúncio, demo de produto → **Marketing Studio** (modo conforme formato)
- Vídeo geral com motion forte → **Seedance 2.0**
- Cena de plano único, mais barato → **Kling 3.0**

### Step 2: Montar os parâmetros

- **Aspect ratio:** 9:16 para Reels/Stories (default), 1:1 para feed
- **Duração:** 21-34s (sweet spot)
- **Avatares:** passar os IDs definidos pelo diretor-persona (formato JSON)
- **Modo Marketing Studio:** ugc, ugc_how_to, tv_spot, etc, conforme o formato

### Step 3: Submeter lote

Disparar a geração com `higgsfield generate create marketing_studio_video --wait`. Lote enxuto (1-2 peças por formato escolhido). Se a rede cair, recuperar o job pelo ID — não regerar do zero (`data/troubleshooting.md`).

### Step 4: Validar saída

Confirmar URL de cada peça gerada. Encaminhar pra task `avaliar-viralidade`.

## Error Handling

| Cenário | Ação |
|---------|------|
| Falha de rede no --wait | `higgsfield generate get <job_id>` recupera a URL |
| Parâmetro fora do enum (aspect ratio, duração) | Rodar `higgsfield model get <modelo>`, ajustar e re-submeter |
| Conta sem créditos | Avisar o usuário antes de submeter; sugerir lote menor |
| Erro de parsing no JSON de saída | Validar pela listagem (`generate list`) — a operação geralmente concluiu |
