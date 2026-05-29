---
task: "Define Visual Direction"
responsavel: "@visual-briefer"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Todos os blocos de slides aprovados (QG-SF-04 passou)"
Saida: "direcao-visual-{evento}.md (vibe + refs + design system + negativos)"
Checklist:
  - "Vibe / sentimento capturado literalmente"
  - "Referências visuais coletadas"
  - "Design system documentado (se houver) ou marcado como 'construir do zero'"
  - "Negativos (o que evitar) capturados"
  - "Usuário confirmou a direção"
execution_type: "interactive"
---

# Task: Define Visual Direction — Ponte 6→7

## Executive Summary

Imediatamente ANTES da Fase 7. Visual-briefer captura a direção visual com o usuário em sessão dedicada de 4 perguntas. Esse documento alimenta diretamente a construção do style prefix.

**Quality Gate: QG-SF-05 (Direção Visual Capturada)**

## Steps

### Step 1: GREETING

```
=== DIREÇÃO VISUAL — Ponte 6→7 ===

Conteúdo dos slides aprovado em todos os blocos. Antes do briefing,
vou capturar com você a direção visual do evento.

Vou perguntar 4 coisas:
1. Vibe / sentimento
2. Referências visuais
3. Design system (se tiver)
4. O que EVITAR

Bora?
```

### Step 2: PERGUNTA 1 — VIBE / SENTIMENTO

> "Como você quer que o público SINTA olhando os slides?"

Capturar literal:
- Adjetivos do usuário
- Comparações ("tipo Apple", "estilo cinemático")
- Sentimentos primários
- Energia do evento

### Step 3: PERGUNTA 2 — REFERÊNCIAS

> "Tem referências visuais? Filmes, decks de outras apresentações, sites, marcas, obras de arte?"

- Capturar links, imagens descritas, refs verbais
- Não filtrar
- Se enviar imagem: descrever em palavras (Manus precisa de descrição textual)

### Step 4: PERGUNTA 3 — DESIGN SYSTEM

> "Tem design system pronto? Paleta, fontes, logos, padrões?"

**Se sim:**
- Pedir paleta (hex)
- Pedir fontes (nomes específicos)
- Pedir logos / símbolos
- Pedir doc do design system se existir

**Se não:**
- Vai construir a partir de vibe + refs

### Step 5: PERGUNTA 4 — NEGATIVOS

> "Tem alguma estética que você definitivamente NÃO quer?"

Capturar pra entrar no `NEGATIVES:` do style prefix. Exemplos comuns:
- Genérico TEDx
- Corporativo chato
- Clipart / stock photos / cartoon
- Gradients cafonas
- Templates PowerPoint

### Step 6: SALVAR DIREÇÃO VISUAL

Salvar em `direcao-visual-{evento}.md` (perguntar path ao usuário se não definiu):

```markdown
# Direção Visual — {Nome do Evento}

> Capturado em DD/MM/AAAA com o usuário.

## Vibe / Sentimento
{captura literal}

## Referências
- Ref 1: {descrição}
- Ref 2: {descrição}

## Design System
{Se tiver: paleta hex, fontes, logos, padrões}
{Se não: "Sem design system pronto. Construído do zero."}

## Negativos
- {item 1}
- {item 2}
```

Ver `data/visual-direction-template.md` pra estrutura completa.

### Step 7: CONFIRMAR

> "É essa a direção? Posso construir o style prefix com base nisso?"

Aguarda confirmação explícita do usuário.

### Step 8: Quality Gate QG-SF-05

**Critério:** documento criado, vibe + refs + design system + negativos preenchidos, usuário confirmou.

**Se passou:** handoff `build-style-prefix`.

## Error Handling

| Cenário | Ação |
|---------|------|
| Vibe vaga ("quero algo bonito") | Puxar concreto: "Tem ref específica? O que NÃO quer?" |
| Sem refs e sem design system | OK — construir a partir da vibe verbal. Sinalizar que vai ser mais experimental |
| Refs contraditórias | Sinalizar pro usuário escolher direção principal |
| Design system enviado em formato não-textual (Figma link, etc) | Pedir pra exportar paleta hex + nomes de fontes em texto |

---

## Cardinal Rules Aplicadas

- Style prefix construído da direção visual do usuário (PU-024)
- Despejo do usuário é fonte primária (PU-005b)
- Não invento, não chuto (PU-005)
