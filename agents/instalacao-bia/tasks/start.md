---
task: "Start — Instalação da Bia"
responsavel: "@bia-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativação do squad via /instalacaoBia"
Saida: "Pré-requisitos confirmados (QG-IB-000), Passo 0 feito (identidade + contas IA + cofre), aluno na fase Preparar"
Checklist:
  - "Persona do bia-chief carregada"
  - "Greeting exibido"
  - "Pré-requisitos verificados (API Meta funcional + infra de pé)"
  - "Passo 0 feito: identidade da Bia decidida, contas Anthropic/OpenAI em mãos, cofre aberto"
execution_type: "interactive"
---

# Task: Start — Entry Point da Instalação da Bia

## Objetivo

Ativar o `bia-chief`, acolher, **verificar pré-requisitos** (QG-IB-000), conduzir o **Passo 0** (preparação rápida) e abrir a jornada — que segue fielmente os passos do `data/kit/INSTALL.md`.

## Passos

### Step 1: Carregar persona
Ler e adotar `agents/bia-chief.md`.

### Step 2: Greeting

```
=== INSTALAÇÃO DA BIA · v1.0.0 ===
Squad Auroq | Mentoria Arcane

Vou te guiar do zero até a sua Bia respondendo no WhatsApp — com a SUA
cara e handoff humano. ~4-5h, dá pra dividir em 2 dias.

Sigo o passo a passo do kit, e cada etapa tem um portão de qualidade:
só avanço quando a anterior fecha. Assim você não acumula erro pro fim.

Antes de começar, duas confirmações rápidas.
```

### Step 3: Verificar pré-requisitos (QG-IB-000)

Confirmar (o aluno chega com isso de steps anteriores):
1. **API oficial Meta (Cloud API)** configurada e funcional? (BM, número, token, PIN já prontos)
2. **Infra de pé:** servidor com **n8n** + **Supabase** + **Chatwoot**, num **domínio com SSL**?

| Resultado | Ação |
|-----------|------|
| Ambos "sim" | QG-IB-000 ✅ — seguir pro Step 3.5 |
| Algum "não"/"não sei" | **BLOQUEAR.** É pré-requisito (a Bia não roda sem). Apontar o step da mentoria onde aquilo é levantado. Não improvisar. |

### Step 3.5: Passo 0 — Preparação rápida (~10min)

Antes de montar nada, garantir (Passo 0 do INSTALL):
- **Decidir a identidade da Bia:** nome dela, nome do expert, empresa, domínio
- **Contas de IA em mãos:** conta **Anthropic** + **OpenAI** criadas, com billing, chaves copiadas
- **Cofre aberto** (1Password/Bitwarden) pra anotar tudo + `SUBSTITUICOES.md` à mão

### Step 4: Abrir a jornada

Mostrar o mapa (espelha os passos do INSTALL) e acionar a fase Preparar:

```
Beleza. O caminho, em 4 blocos:

  Preparar  (@preparador) → Passo 1 migrations · Passo 3 Chatwoot inbox · Passo 4 credentials n8n
  Construir (@construtor)  → Passo 5 importar workflows · Passo 6 prompts (a alma)
  Conectar  (@conector)    → webhooks Meta+Chatwoot · ativar · template
  Acender   (@doutor)      → smoke test 4 cenários → Bia viva

Você fala sempre comigo; eu chamo o especialista de cada bloco.
Bora pro Preparar.
```

Acionar a task `fase-preparar` (@preparador).

## Roteamento das fases

| Bloco | Task | Agente | Passos INSTALL | Gate |
|-------|------|--------|----------------|------|
| Preparar | `fase-preparar.md` | @preparador | 1, 3, 4 | QG-IB-001 |
| Construir | `fase-construir.md` | @construtor | 5, 6 | QG-IB-002 |
| Conectar | `fase-conectar.md` | @conector | 5.4, 5.5, 7 | QG-IB-003 |
| Acender | `fase-diagnosticar.md` | @doutor | 8 | QG-IB-004 |

Após cada gate validado, o controle volta ao Chief, que libera o próximo bloco.

## Error Handling

| Cenário | Ação |
|---------|------|
| Pré-requisito ausente (API Meta ou infra) | Bloquear QG-IB-000, listar o que falta |
| Aluno quer pular fase | Recusar — gate anterior é obrigatório |
| Aluno trava no meio | Coletar sintoma, identificar a fase, reacionar a estação (ou o doutor) |
| Dúvida sobre como a Bia funciona | Modo consultoria — `knowledge/bia-como-funciona.md` + `arquitetura-4-camadas.md` |
