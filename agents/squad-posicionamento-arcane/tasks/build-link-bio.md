---
task: "Build Link da Bio"
responsavel: "@vitrine-strategist"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "Bio fechada + nucleo completo + ativos do aluno (produto, lead magnet, redes)"
Saida: "Opcao escolhida + ordem dos links definida + primeiro link = funil principal"
Checklist:
  - "Aluno escolheu opcao (Linktree / LP direta / Pagina sob medida)"
  - "Primeiro link = funil principal do aluno (REGRA INEGOCIAVEL)"
  - "Maximo 4-5 links (decision fatigue)"
  - "Cada link com label clara"
  - "Estrutura adaptada ao objetivo (sales/growth/dm/local)"
  - "Se aluno nao tem ativos: placeholder + instrucao acionavel"
execution_type: "interactive"
---

# Task: Build Link da Bio — Item 3 da Vitrine

**Task ID:** posicionamento-digital/build-link-bio
**Version:** 1.0.0
**Category:** Vitrine / Item 3

---

## Executive Summary

Terceiro item. 3 opcoes (Linktree / LP direta / Pagina sob medida) + ordem dos links. Primeiro link SEMPRE = funil principal. Se aluno nao tem nada, placeholder + instrucao.

---

## Inputs

- Bio fechada (CTA da bio aponta pro link)
- Nucleo completo
- Ativos digitais do aluno (perguntar):
  - LP/funil principal
  - Lead magnet (e-book, aula gratis, manifesto, etc.)
  - Outras redes (YouTube, TikTok)
  - Contato (WhatsApp, e-mail)
  - Pagina "Sobre"

**KB consultada:** `data/vitrine-instagram-2026.md` (secao Link da Bio)

---

## Outputs

- Opcao escolhida (linktree | lp_direta | pagina_sob_medida)
- Ordem completa dos links
- Labels (texto de cada link)
- Placeholder se aluno nao tem ativos

---

## Step-by-Step Execution

### Step 1: Iniciar Item

```
Vitrine, item 3 de 9: LINK DA BIO.

Antes de estruturar, preciso de 2 infos:

1. Voce ja tem alguma ferramenta de link-in-bio configurada? 
   (Linktree, Beacons, Stan Store, pagina propria, etc.)

2. Quais ativos digitais voce tem hoje pra colocar no link?
   - LP/pagina do produto principal (qual?)
   - Lead magnet gratuito (e-book, aula, manifesto, guia)
   - Outras redes sociais ativas
   - WhatsApp/e-mail de contato
   - Pagina "Sobre" ou portfolio
   - Outros?

Manda do jeito que sair.
```

### Step 2: Apresentar 3 Opcoes (com tradeoff)

Baseado nos ativos do aluno, agente recomenda usando esta heuristica:

| Perfil do aluno | Recomenda |
|----------------|-----------|
| Tem produto pago + quer monetizar pelo Insta | **Stan Store** (checkout integrado, sem taxa) |
| Tem varios ativos (LP + lead magnet + redes) sem foco em vender pelo Insta | **Linktree** ou **Beacons** (mais simples, visual) |
| Tem dominio proprio + brand forte + pessoa pra construir | **Pagina sob medida** (Claude Code / dev) |
| 1 produto unico, foco total em conversao | **LP direta** (ignora hub, vai direto) |
| Iniciante (sem clareza ainda) | **Linktree** (mais simples pra comecar) |

Agente apresenta as 3 opcoes COM a recomendacao explicada baseada no perfil:

```
3 opcoes pra estruturar seu Link da Bio:

A) LINKTREE (ou Beacons / Stan Store)
   - Lista de links com pagina hospedada externa
   - Gratuito, setup em 5 min
   - Limitacao: dominio externo (linktr.ee/aluno)
   - Bom pra: comeco, varios destinos

B) LP DIRETA do funil principal
   - Link aponta direto pra pagina do produto
   - Conversao maxima, branding total
   - Limitacao: so 1 destino (perde quem quer engajar sem comprar)
   - Bom pra: 1 produto + foco total em conversao

C) PAGINA SOB MEDIDA (no seu dominio)
   - Pagina estilo Linktree mas customizada
   - Branding total + dominio proprio (autoridade)
   - Limitacao: precisa construir (Claude Code, Claude Design, dev)
   - Bom pra: quem tem dominio + quer brand forte + tem quem construir

Pelo que voce me contou ([resumo dos ativos]), eu recomendo [LETRA] 
porque [motivo]. Mas a decisao e sua.

Qual?
```

### Step 3: Definir Ordem dos Links

Apos escolha (A ou C — pra B nao tem ordem), agente estrutura:

**REGRA INEGOCIAVEL:** Primeiro link = funil principal.

#### Se objetivo SALES:
```
1. [HERO] [Nome do produto principal] — link da LP
2. [Lead magnet gratuito] — captura quem nao compra agora
3. [Depoimentos / cases] OU Sobre (autoridade)
4. [WhatsApp / contato]
```

#### Se objetivo GROWTH:
```
1. [HERO] [Lead magnet de alto valor] — gera lista
2. [Conteudo top — playlist, masterclass gratuita]
3. [Cadastro newsletter / grupo WhatsApp]
4. [Outras redes — TikTok, YouTube]
```

#### Se objetivo DM/QUALIFICACAO:
```
1. [HERO] [Pagina de diagnostico / call gratuita] — chama acao primaria
2. [Cases / depoimentos] — autoridade
3. [Sobre / quem atende] — filtro
4. [WhatsApp]
```

### Step 4: Validar Estrutura

- [ ] Primeiro link e funil principal? (REGRA)
- [ ] Maximo 4-5 links? (Decision fatigue)
- [ ] Cada link com label CLARA? (nao "clique aqui")
- [ ] Hierarquia visual (hero destacado)?

### Step 5: Apresentar Estrutura

```
═══════════════════════════════════════
LINK DA BIO — Plataforma: [Linktree / LP direta / Pagina sob medida]
═══════════════════════════════════════

ORDEM DOS LINKS:

1. [HERO — destaque maximo]
   Label: "[texto que aparece]"
   Destino: [URL ou descricao do destino]
   Funcao: FUNIL PRINCIPAL (regra)

2. [SECUNDARIO]
   Label: "[texto]"
   Destino: [...]
   Funcao: [...]

3. [SECUNDARIO]
   ...

4. [SECUNDARIO]
   ...

═══════════════════════════════════════

Bate? Quer ajustar a ordem ou trocar algum link?
```

### Step 6: Loop ate Check

Mesma logica. Aluno pode pedir trocar ordem, mudar label, adicionar/remover link.

**Confronto especifico:**
- Se aluno quer colocar OUTRO link como primeiro → "Primeiro = funil principal. Sem excecao. Por que voce quer mudar isso?"
- Se aluno quer 6+ links → "Maximo 4-5. Decision fatigue mata conversao."

### Step 7: Caso Especial — Placeholder

Se aluno nao tem NENHUM ativo digital:

```
═══════════════════════════════════════
LINK DA BIO — PLACEHOLDER
═══════════════════════════════════════

Voce ainda nao tem nenhum ativo digital pra colocar aqui.

QUANDO TIVER, USE A ESTRUTURA:

1. Funil principal (LP do produto ou lead magnet) 
   ← OBRIGATORIO primeiro (regra inegociavel)

2. Pagina secundaria (sobre, conteudo, etc.)

3. Outras redes / contato

PROXIMO PASSO ACIONAVEL:
□ Decidir qual sera seu funil principal
   - Produto pronto? Sera a LP do produto
   - Sem produto? Comece com lead magnet (e-book, aula gratis)
□ Construir LP (Claude Code, Hotmart, Notion publico, etc.)
□ Voltar aqui pra estruturar o link bio

═══════════════════════════════════════
```

### Step 8: Oferta de Producao

```
Link bio estruturado.

Quer ajuda pra:
A) Escrever as LABELS dos links (texto que aparece em cada botao)
B) Configurar Linktree (passo a passo: criar conta + colar estrutura)
C) Briefing pra construir Pagina sob Medida (Claude Code)
D) Nao, ja sei o que fazer
```

Se A/B/C, produz conteudo correspondente.

### Step 9: Atualizar Estado

```yaml
vitrine.link_bio:
  opcao: "linktree|lp_direta|pagina_sob_medida"
  primeiro_link: "..."  # funil principal
  outros_links: [...]
  labels: [...]
  placeholder: "..." | null
  aluno_aprovou: true
```

Item 3 de 9: ✓

---

## Veto Conditions

| Condicao | Acao |
|----------|------|
| Aluno quer link nao-funil como primeiro | Confronta: "Regra inegociavel. Primeiro = funil principal. Por que voce quer outra coisa?" |
| Aluno quer 6+ links | Confronta: "Decision fatigue. Maximo 4-5. Quais 4 sao prioridade?" |
| Aluno quer LP direta mas tem multiplos ativos | Sugere Linktree em vez (perde audiencia que nao quer comprar agora) |
| Aluno quer Pagina sob Medida mas nao tem quem construir | Sugere Linktree como temporario + adiciona pendencia "construir Pagina Sob Medida no futuro" |
| Aluno nao tem funil principal | Adiciona pendencia critica + sugere construir lead magnet primeiro |

---

**Task Status:** Ready for Production
