---
task: "Diagnose Issue"
responsavel: "@vendedor-expert"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Sintoma de venda travada ('ninguém responde', 'todo mundo some no preço', 'só recebo não')"
Saida: "Diagnóstico com causa provável + 1–3 ajustes concretos"
Checklist:
  - "Sintomas coletados"
  - "Etapa do gargalo identificada"
  - "Ajustes propostos e documentados"
execution_type: "interactive"
---

# Task: Diagnose Issue

## 1. Coletar sintomas
Perguntar (no máximo 3): em que etapa as conversas param? · quantas pessoas por dia está ativando? · pode colar 2–3 conversas que travaram?

## 2. Localizar o gargalo

| Sintoma | Causa provável | Onde olhar |
|---------|----------------|------------|
| Ninguém responde a 1ª mensagem | Abertura genérica, oferta cedo, origem fria demais | VOL-01 §5, KB §6, R-006 |
| Respondem e somem na condução | Caixa d'água (informação demais), pergunta fechada, sem prova | VOL-01 §6 |
| Somem no preço | Preço antes do fit, sem âncora real, objeção real não descoberta | Scripts 15, 17, 19–20 |
| "Vou pensar" e não volta | Sem follow-up ou follow-up de cobrança | Scripts 27, VOL-02 §6 |
| Pouca gente pra conversar | Volume baixo de levantada de mão/prospecção | VOL-01 §4, §9 |

## 3. Propor
1–3 ajustes concretos (com a mensagem reescrita, se for o caso). Nada de teoria.

## 4. Documentar
- Padrão novo → `aprendizados.md`
- Erro recorrente do próprio worker → regra em `rules.md`
- Mission Log: situação genérica (R-005)
