# Mapa Territorial — Vendas Sem Call (Priscila Espinoza)

> Gerado pelo ETLmaker v3.0 — Fase 1: Mapeamento Territorial
> Data: 2026-10-03
> Fontes: 7 páginas do Notion (~38.700 caracteres, ~800 linhas úteis)

---

## 0. Fontes

| ID | Arquivo | Conteúdo | Linhas |
|----|---------|----------|--------|
| SRC-000 | 00-principal.md | Página-mãe: o que recebe, como usar, 4 princípios, 5 etapas, rotina diária, checklist, CTA de venda | 115 |
| SRC-001 | 01-etapa1-prospeccao.md | Scripts 1–8 + prompt + checklist | 71 |
| SRC-002 | 02-etapa2-conducao.md | Scripts 9–16 + prompt + checklist | 72 |
| SRC-003 | 03-etapa3-fechamento.md | Scripts 17–24 + prompt + checklist | 73 |
| SRC-004 | 04-etapa4-followup.md | Scripts 25–32 + prompt + checklist | 68 |
| SRC-005 | 05-bonus-reativacao-leads.md | Manual de reativação (Hotseat 29/07/2026): etiquetas, 5 tipos de lead dormente, Consultoria 0800, novos seguidores, cadência, objeções, 8 prompts | 291 |
| SRC-006 | 06-bonus-levantada-de-mao.md | Módulo 0: 9 templates (story, sequência, grupo, feed) + prompt + checklist | 114 |
| ~~SRC-007~~ | ~~07-fluxo-ascensao.md~~ | **Excluída** — documento operacional interno da empresa da autora (ver PLANO-ETL) | — |

## 1. Domínios de Conhecimento

| Domínio | Descrição | Subtópicos | Importância | Fonte |
|---------|-----------|------------|-------------|-------|
| Princípios da venda sem call | Base filosófica que rege todo script | Relacionamento antes de oferta; copo d'água; escrachado; espelhamento e persistência gentil | core | SRC-000 (reforçado em todos os prompts) |
| Levantada de mão (Módulo 0) | Gerar sinal de interesse em massa antes do 1 a 1 | Story único, sequência de 5 stories, grupo WhatsApp, feed | core | SRC-006 |
| Prospecção (Módulo 1) | Transformar sinal de vida em conversa | 8 gatilhos de entrada (curtida, comentário, story, novo seguidor, isca, lista antiga, indicação, grupo) | core | SRC-001, SRC-005 Parte 4 |
| Condução (Módulo 2) | Descobrir momento/dor e apresentar solução certa | Descoberta, aprofundar, empatia + prova social, solução amarrada à dor, "por dentro", depoimento, confirmar fit, reconduzir desvio | core | SRC-002 |
| Fechamento e objeções (Módulo 3) | Apresentar valor e conduzir à decisão | Ancoragem, pergunta de fechamento, 4 objeções, carta na manga, fechamento por áudio; objeções extras (dinheiro, marido, organização) | core | SRC-003, SRC-005 Parte 6 |
| Follow-up e reativação (Módulo 4 + Bônus) | Reativar sem cobrança | 8 situações de follow-up; 5 tipos de lead dormente; cadência de 3 contatos; Consultoria 0800 | core | SRC-004, SRC-005 |
| Operação diária | Rotina e organização do funil | Rotina de 5 blocos (1h30), checklist diário, regra anti-burnout, etiquetas do Instagram como CRM, checklist semanal de reativação | supporting | SRC-000, SRC-005 Parte 1 |
| Personalização via IA | Prompts que adaptam os scripts ao negócio | 5 prompts de módulo + 8 prompts do bônus de reativação | supporting | SRC-001 a SRC-006 |

## 2. Backbone

- `backbone_exists`: true
- `backbone_description`: A autora define explicitamente a ordem "Levantada de Mão → Prospecção → Condução → Fechamento → Follow-up" e numera os scripts de 1 a 32 nos 4 módulos.
- `strategy`: use_author_backbone
- `justification`: Estrutura numerada, sequencial e didática. O bônus de reativação é transversal (aplica-se a leads parados de qualquer etapa) e fica num volume próprio.

## 3. Autores

| Autor | Papel | Peso | Marcadores de voz |
|-------|-------|------|-------------------|
| Priscila Espinoza | primary (única) | high | Tom de amiga, direto, coloquial ("kkk", "Me conta", "Seja sincera comigo"); público feminino (flexões no feminino: "bem-vinda", "sozinha"); termos-assinatura: "copo d'água, não caixa d'água", "escrachado", "anti-burnout", "sinal de vida", "levantada de mão", "carta na manga", "Consultoria 0800" |

## 4. Frameworks e Métodos

| Framework | Propósito | Estrutura | Fonte |
|-----------|-----------|-----------|-------|
| 5 etapas da venda sem call | Funil conversacional completo no direct/WhatsApp | Levantada de Mão → Prospecção → Condução → Fechamento → Follow-up | SRC-000 |
| 4 princípios | Regras-base de toda conversa | ver Seção 5 | SRC-000 |
| Rotina de Vendas Diária | Volume mínimo viável diário | 5 blocos (manhã 20min, meio da manhã 20min, início da tarde 15min, fim da tarde 20min, fim do dia 15min) ≈ 1h30 | SRC-000 |
| Sequência de 5 stories | Leva de levantadas de mão | Gancho → Identificação → Virada → Prova social → CTA | SRC-006 |
| Etiquetas do Instagram como CRM | Organizar leads | Lead / Conversando / Quase / Pago / Frio | SRC-005 P1 |
| 5 tipos de lead dormente | Diagnóstico de quem reativar e como | Pegou isca e sumiu; Curtiu e nunca foi ao direct; Ex-aluna; "Quase" e sumiu; Membro inativa de comunidade | SRC-005 P2 |
| Consultoria 0800 | Fazer o lead vir até você | Story-convite → 3 perguntas → áudio de diagnóstico 2–5 min (4 passos) → ponte para o produto | SRC-005 P3 |
| Cadência 3 contatos | Follow-up sem perseguição | D0 curiosidade → D3–5 novo gatilho → D7–10 leveza → etiqueta Frio, volta em 30–45 dias | SRC-005 P5 |

## 5. Regras Cardinais

| Regra | Absoluteness | Fonte |
|-------|--------------|-------|
| Nunca abra vendendo / nunca oferta na primeira mensagem | máxima | SRC-000 princ. 1; SRC-005 P5; prompt SRC-001 |
| Fale só o "copo d'água" — o que resolve a dor específica que a pessoa trouxe | máxima | SRC-000 princ. 2; prompt SRC-002 |
| Resultado concreto, nunca termo vago sem tradução prática | alta | SRC-000 princ. 3 |
| Espelhamento: áudio recebe áudio, texto recebe texto | alta | SRC-000 princ. 4; Script 24 |
| Follow-up é infinito, mas nunca é cobrança — é cuidado genuíno | máxima | SRC-000 princ. 4; prompt SRC-004; SRC-005 P5 |
| Siga as etapas na ordem; não pule etapas | alta | SRC-000 "Como usar"; prompt SRC-002 |
| Ancoragem: valor oficial antes da condição vigente | alta | Script 17; prompt SRC-003 |
| Nunca insista em preço quando a objeção real é medo | alta | prompt SRC-003 |
| Termine sempre com uma pergunta que avança a conversa | alta | prompt SRC-003; SRC-005 P5 |
| Confirme o fit antes de falar de preço | alta | Script 15 |
| Urgência/bônus só se for real e ligado à dor dela | alta | Script 23; Script 4B |
| Nunca use motivo inventado para reativar | alta | Script 3A; Script 1B |
| Na levantada de mão não se vende nada | alta | SRC-006 prompt |
| Nunca mande mensagem genérica a novo seguidor — prove que olhou o perfil | alta | SRC-005 P4 |
| Se só der um bloco no dia, faça a prospecção | alta | SRC-000 regra anti-burnout |
| Nunca: 2 follow-ups no mesmo dia; "vi que não respondeu"; pedir desculpa por mandar mensagem | máxima | SRC-005 P5 |

## 6. Glossário Preliminar

Sinal de vida · Levantada de mão · Copo d'água / caixa d'água · Escrachado · Espelhamento · Persistência gentil · "Por dentro" do produto · Fit · Ancoragem · Condição vigente · Carta na manga · Lead frio/dormente · Isca · Consultoria 0800 · Etiquetas (Lead/Conversando/Quase/Pago/Frio) · Social selling · Regra anti-burnout · Hotseat

## 7. Plano de Volumes (proposto — aguarda aprovação)

| Vol | Título | Conteúdo | Fontes primárias |
|-----|--------|----------|------------------|
| VOL-01 | O Método e os 41 Scripts do Funil | Princípios, 5 etapas, Módulo 0 (9 templates) + Módulos 1–4 (32 scripts) com "quando usar" e campo de personalização, 5 prompts de módulo, rotina diária, checklists | SRC-000, 001, 002, 003, 004, 006 |
| VOL-02 | Reativação de Leads e Social Selling | Mentalidade, etiquetas-CRM, 5 tipos de lead dormente (12 scripts), Consultoria 0800, novos seguidores, cadência, 4 objeções, 8 prompts, checklist semanal | SRC-005 |

Transversais: README, REGRAS-CARDINAIS, REPERTORIO (mapa "situação → script"), GLOSSARIO.

## 8. Contradições / Sobreposições

- Script 4 (SRC-001) e "Abordagem de novo seguidor" (SRC-005 P4) cobrem a mesma situação; a versão do bônus acrescenta a observação do perfil. Manter ambas, cruzar referência.
- Script 2 / Script 1 (SRC-001) e Scripts 2A/2B (SRC-005) se sobrepõem (curtida). Idem.
- Objeções "tá caro"/"preciso pensar" aparecem em SRC-003 e SRC-005 P6 com redações diferentes. Manter ambas.
- Página-mãe diz "40+ scripts" e o título "30+"; contagem real composta: 32 + 9 + ~14 = 55 modelos.

## 9. Fora de Escopo

- CTAs comerciais da autora (Aceleração Escala Anti-Burnout, voucher, WhatsApp de vendas, link do agente de IA dela).
- Fluxo de Ascensão (SRC-007) — operação interna da empresa da autora.

## 10. Gaps

- Nenhum dos 32 scripts traz exemplo preenchido — só o molde com colchetes. A adaptação à Incubadora caberá ao agente.
- Público da fonte é feminino; a Karol usa masculino genérico (40% alunos homens) — ajuste fica na camada do agente.
