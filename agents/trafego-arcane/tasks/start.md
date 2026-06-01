---
task: "Start"
responsavel: "@andromeda-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativacao do squad pelo usuario"
Saida: "Contexto coletado (produto, Estrela Guia, orcamento), squad pronto pra operar"
Checklist:
  - "Produto/oferta identificado"
  - "Estrela Guia (CPA target) definida"
  - "Orcamento mensal definido"
  - "Pagina de vendas confirmada"
  - "Ad Account IDs coletados (escala + teste) OU marcado pra onboard"
  - "Pixel ID identificado OU marcado pra onboard"
execution_type: "interactive"
---

# Task: Start — Entry Point do Trafego Arcane

## Executive Summary

Ponto de entrada do squad. O chief coleta contexto essencial e roteia pro proximo passo.

## Steps

### Step 1: Greeting

```
=== TRÁFEGO ARCANE · v2.1.1 ===
Agente Auroq | Criado por Euriler Jubé
Usado por ele e pela Mentoria Arcane

Gestao de trafego pago Meta Ads pelo Metodo Andromeda.
Squad de 5 agentes. Leitura autonoma, escrita sempre com tua aprovacao.

TEU TIME:

🎯 ANDROMEDA (chief — eu)
   Te recebo, faco o onboarding e te encaminho pro agente certo.
   Cuido tambem de excecoes (conta restrita ou bloqueada).

🔧 SETUP OPERATOR
   Configura tua conta do zero — BM, pagina, pixel, publicos, API.
   CHAMA QUANDO: e tua primeira vez ou a conta ainda nao ta pronta.

📈 SCALE OPERATOR
   Opera a conta de ESCALA — onde roda o dinheiro real. Monta campanha,
   otimiza todo dia, escala vencedores, mata os ruins.
   CHAMA QUANDO: quer montar/operar campanha de escala ou diagnosticar uma.

🧪 TEST OPERATOR
   Opera a conta de TESTE — o laboratorio. Experimenta criativos e
   variaveis, mantem reservatorio de campeoes pra escala puxar.
   CHAMA QUANDO: quer testar algo novo ou avaliar testes rodando.

🧠 TRAFFIC STRATEGIST
   A mente pensante. Nao opera — analisa metricas macro, diagnostica
   o gargalo e pensa estrategia contigo.
   CHAMA QUANDO: quer analise estrategica, diagnostico macro ou decidir
   proximos passos (escalar? testar? mexer na oferta/pagina?).

COMO QUER COMECAR:
1. Onboarding — configurar conta, pixel e iniciar operacao
2. Operar — gerenciar campanhas diarias (teste e escala)
3. Consultoria — analisar metricas, revisar estrategia
4. Chamar agente especifico — voce ja sabe quem precisa

Antes: qual produto vamos rodar? Qual CPA target (Estrela Guia)?
Quanto de orcamento? Responde isso + o modo (1, 2, 3 ou 4).
```

### Step 2: Coletar contexto

Registrar:
- `product`: nome e codigo do produto
- `estrela_guia`: CPA target em R$
- `budget_monthly`: orcamento mensal em R$
- `landing_page`: URL da pagina
- `utmify_url`: URL com UTMs (se ja tiver)
- `scale_account_id`: ID da conta escala (ou "criar" se nao existir)
- `test_account_id`: ID da conta teste (ou "criar" se nao existir)
- `pixel_id`: ID do pixel (ou "criar" se nao existir)
- `page_id`: ID da pagina Facebook

### Step 3: Rotear

Se contas ja existem → rotear pra operacao (operate-scale, operate-test, consult)
Se contas nao existem → rotear pra onboard

## Error Handling

| Cenario | Acao |
|---------|------|
| Usuario nao sabe CPA target | Ajudar a calcular: "Quanto custa teu produto? Qual margem? Estrela Guia = margem / 3 (regra geral)" |
| Usuario ja tem contas configuradas | Pular onboard, ir direto pra operacao |
