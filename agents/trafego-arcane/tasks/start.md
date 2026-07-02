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

### Step 0: Carregar inventario de contas + historico de acoes (ANTI-AMNESIA) + modo de operacao

**SEMPRE rodar antes do greeting.** Mata a amnesia em dois eixos: (a) quais contas existem e como carregar o token de cada; (b) o que o squad JA FEZ (ultimas operacoes/decisoes), pra dar continuidade sem reinvestigar a cada chat novo.

```bash
cat squads/trafego-arcane/data/accounts.yaml 2>/dev/null || echo "SEM_REGISTRY"
echo "--- ULTIMAS ACOES ---"
tail -n 12 squads/trafego-arcane/data/historico-acoes.md 2>/dev/null || echo "SEM_HISTORICO"
```

- **accounts.yaml existe:** extrair `business_managers` (BMs + contas + status), `default_account` e `operating_mode`. Usar no greeting (Step 1.5) e no contexto (Step 2) — NAO perguntar o que ja esta no registry.
- **`SEM_REGISTRY`:** primeira vez nesta maquina. Seguir pro onboarding (Step 3 → onboard). O setup-operator cria o `accounts.yaml` de `accounts.example.yaml`.
- **historico existe:** ler as ultimas acoes pra Step 1.5 (continuidade). **`SEM_HISTORICO`:** ainda nao houve operacao registrada — sera criado na 1ª escrita via `data/log-action.sh`.

**⚙️ MODO DE OPERACAO (inegociavel, vale toda a sessao):** este squad opera via **System User token + Graph Marketing API direta (curl/script)**. **NUNCA via MCP Meta** — mesmo que um MCP Meta esteja conectado na sessao (ele autentica com identidade diferente e nao enxerga as contas certas, ex: CA05). Credenciais por conta via `creds.helper` do registry. Detalhe em `knowledge/andromeda-rules.md`.

### Step 1: Greeting

```
=== TRÁFEGO ARCANE · v2.5.2 ===
Agente Auroq | Criado por Euriler Jubé
Usado por ele e pela Mentoria Arcane

Gestao de trafego pago Meta Ads pelo Metodo Andromeda.
Squad de 6 agentes. Leitura autonoma, escrita sempre com tua aprovacao.

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

🎬 CREATIVE PREP OPERATOR
   Prepara o lote de criativos pro upload — organiza a pasta, aplica a
   nomenclatura, transcreve, e escreve 3 titulos + a legenda de cada anuncio.
   CHAMA QUANDO: tem criativos crus e quer eles prontos pro scale/test subir.

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

### Step 1.5: Apresentar inventario (se houver registry)

Se o Step 0 carregou um `accounts.yaml`, apresentar o que ja conhece ANTES de perguntar qualquer coisa de conta. **Montar a partir do registro real** (os dados abaixo sao só o FORMATO — preencher com os `business_managers`/`accounts` do arquivo):

```
📋 CONTAS QUE JA CONHECO (do teu registry):

  BM "{alias}" ({status}) — pixel {pixel}
    • {conta alias} {account_id} · {status}{ · EM USO se in_use}
  BM "{alias}" ({status}) — token via {creds.helper}
    • {conta} {id} · {status}   ⭐ default: {default_account}
  Modo: System User token (Graph API direta) — sem MCP

📒 ULTIMAS ACOES (do historico):
  • {data} · {conta} · {acao} · {resultado}
  • {data} · {conta} · {acao} · {resultado}
  (resumir as ultimas ~3-5 linhas de historico-acoes.md)

Opero a conta default por padrao. Quer outra? Me fala o alias.
Retomo de onde paramos ou e algo novo?
```

Isso elimina o "qual conta?" e o "o que ja fizemos?" do zero.

### Step 2: Coletar contexto

Registrar (os campos de **conta/pixel/page ja vem do `accounts.yaml`** quando o registry existe — so perguntar o que faltar):
- `product`: nome e codigo do produto
- `estrela_guia`: CPA target em R$
- `budget_monthly`: orcamento mensal em R$
- `landing_page`: URL da pagina
- `utmify_url`: URL com UTMs (se ja tiver)
- `scale_account_id`: **do registry** (`default_account` ou o alias que o usuario escolher); "criar" so se `SEM_REGISTRY`
- `test_account_id`: **do registry**; "criar" so se `SEM_REGISTRY`
- `pixel_id`: **do registry** (campo `pixel` da BM escolhida); "criar" so se `SEM_REGISTRY`
- `page_id`: **do registry** (campo `page.id`)

### Step 3: Rotear

Se contas ja existem → rotear pra operacao (operate-scale, operate-test, consult)
Se contas nao existem → rotear pra onboard

## Error Handling

| Cenario | Acao |
|---------|------|
| Usuario nao sabe CPA target | Ajudar a calcular: "Quanto custa teu produto? Qual margem? Estrela Guia = margem / 3 (regra geral)" |
| Usuario ja tem contas configuradas | Pular onboard, ir direto pra operacao |
