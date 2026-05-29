# Squad Posicionamento Arcane

> Squad da Mentoria Arcane | Criado por Euriler Jube
> Organiza a vitrine completa do Instagram do aluno expert — do nucleo de influencia ate os 3 posts fixados.
> Ativacao: `/squad-posicionamento-arcane`

---

## O Que Faz

Conduz o aluno por uma jornada estruturada em 4 fases:

1. **Onboarding + Diagnostico** — chief diagnostica em que ponto o aluno esta
2. **Nucleo de Influencia** — nucleo-strategist constroi o nucleo segundo metodo audience
3. **Vitrine** — vitrine-strategist monta os 9 itens da vitrine (display name + bio + link + 3 destaques + 3 pinned)
4. **Compilacao** — chief entrega schema final pronto pra postar

**Output final:** schema completo copy-paste pronto. Estrategia + copy. Zero design.

---

## Estrutura

```
squad-posicionamento-arcane/
├── squad.yaml                          # Manifest do squad
├── README.md                            # Este arquivo
│
├── agents/                              # 3 agentes
│   ├── posicionamento-chief.md          # Orquestrador
│   ├── nucleo-strategist.md             # Especialista nucleo (metodo audience)
│   └── vitrine-strategist.md            # Especialista vitrine
│
├── tasks/                               # 12 tasks
│   ├── start.md                         # Entry point
│   ├── diagnose-state.md                # Diagnostico do aluno
│   ├── compile-final-output.md          # Compilacao final
│   ├── gather-fase1-materials.md        # Coleta de materiais
│   ├── build-nucleo-influencia.md       # Construcao do nucleo
│   ├── loop-feedback-nucleo.md          # Loop ate check
│   ├── build-display-name.md            # Item 1
│   ├── build-bio.md                     # Item 2
│   ├── build-link-bio.md                # Item 3
│   ├── build-destaques.md               # Items 4-6
│   ├── build-pinned-posts.md            # Items 7-9
│   └── produce-copy.md                  # Producao de copy sob demanda
│
├── workflows/
│   └── wf-posicionamento-digital.yaml   # Workflow principal (4 fases)
│
├── checklists/                          # 3 checklists de qualidade
│   ├── nucleo-quality-checklist.md
│   ├── vitrine-quality-checklist.md
│   └── output-final-checklist.md
│
└── data/                                # KB autocontida
    ├── metodo-audience-completo.md      # Nucleo (Elias Maman / Arcane)
    ├── vitrine-instagram-2026.md        # Best practices Instagram 2026
    └── copy-de-oferta.md                # Estrutura ruminacao→solucao→produto→CTA
```

---

## Quem Usa

Aluno da Mentoria Arcane que ja passou pela **Fase 1** (proposito + posicionamento + metodologia + primeiro produto).

Pode rodar sem Fase 1 fechada, mas saida fica mais pobre — agent confronta com clareza didatica e o aluno decide.

---

## Como Ativar

```
/squad-posicionamento-arcane
```

Squad ativa, chief faz onboarding e roteia.

---

## Fluxo Resumido

```
Aluno digita /squad-posicionamento-arcane
     ↓
Chief: greeting + apresenta equipe
     ↓
Chief: diagnose-state (3 perguntas-chave)
     ↓
ROTEAMENTO baseado no estado:
  
  Tem materiais Fase 1 + sem nucleo → nucleo-strategist → vitrine-strategist
  Sem materiais (improviso) → nucleo-strategist (mais profundo) → vitrine-strategist  
  Tem nucleo fechado → direto pro vitrine-strategist
  Quer revisar item especifico → loop de revisao
     ↓
Nucleo-strategist (se necessario):
  - gather-fase1-materials (absorve + clarea)
  - build-nucleo-influencia (11 pontos + crencas + apresentacao magnetica)
  - loop-feedback-nucleo (ate "check, perfeito")
     ↓
Vitrine-strategist (sempre):
  Loop linear 1 por item:
    Item 1: Display Name
    Item 2: Bio
    Item 3: Link da Bio
    Item 4: Destaque Sobre Mim
    Item 5: Destaque Produto
    Item 6: Destaque Depoimentos
    Item 7: Pinned 1 (Sobre)
    Item 8: Pinned 2 (Tese/Crenca)
    Item 9: Pinned 3 (Oferta — ruminacao→solucao→produto→CTA)
  
  Cada item: sugiro → feedback → refaz → check → "quer ajuda pra produzir?"
     ↓
Chief: compile-final-output
  Schema markdown copiavel + lista de pendencias + checklist implementacao
     ↓
Squad fechado. Aluno tem tudo pronto.
```

---

## Decisoes-Chave (Metodologia Arcane)

| Decisao | Valor Fixo | Por que |
|---------|-----------|---------|
| Display Name | "Nome Sobrenome \| Credencial de Especialista" | SEO 2026 + clareza |
| Destaques | 3 fixos: Sobre / Produto / Depoimentos | Clareza, sem dispersao |
| Pinned Posts | 3 fixos: Sobre / Tese / Oferta | Storefront: Clareza → Credibilidade → Conversao |
| Pinned 3 (Oferta) | Estrutura: ruminacao → solucao → produto → CTA | Sem ruminacao, ninguem compra |
| Primeiro link da bio | Funil principal (sempre) | Regra inegociavel |
| Maximo links na bio | 4-5 | Decision fatigue |
| Capas | Conceito visual (sem design fino) | Zero design no escopo |
| Loop feedback | 1 por item | Granularidade maxima, sem aprovar mediano |
| Tom do agent | Mix didatico + confrontativo | Nao aceita cliche/preguica |

---

## KB Embarcada (Autocontido)

Squad NAO referencia paths externos em runtime. Toda KB esta em `data/`:

- **`metodo-audience-completo.md`** — sintese adaptada do squad metodo-audience (Elias Maman / Imersao Arcane). Foco em construcao de nucleo de influencia (nao em roteiros de Reels — fora de escopo).
- **`vitrine-instagram-2026.md`** — sintese da pesquisa de best practices Instagram 2026 + decisoes especificas da Mentoria Arcane.
- **`copy-de-oferta.md`** — estrutura ruminacao→solucao→produto→CTA explicitada por Euriler + repertorio LLM de copy.

---

## Quality Gates

| Gate | Bloqueia? | Criterio |
|------|-----------|----------|
| QG-PD-001 | Nao | Materiais Fase 1 OK ou aluno aceitou seguir sem |
| QG-PD-002 | Sim | Aluno confirmou "check, perfeito" no nucleo |
| QG-PD-003 | Sim | 9 itens da vitrine com check (placeholders OK com instrucao) |
| QG-PD-004 | Sim | Output final compilado + pendencias listadas |

---

## Bottleneck

**Task gargalo:** `loop-feedback-nucleo`

Nucleo medio = vitrine medio. Sem nucleo bom, output final sai fraco. Agent tem tom didatico-confrontativo pra evitar aprovacao precoce do aluno.

---

## O Que Squad NAO Faz

- **Design** — sem paleta, sem fonte, sem layout. So conceito da capa.
- **Foto de perfil** — fora de escopo. Vira pendencia se necessario.
- **Reels alem do Pinned 1** — squad nao gera estrategia de Reels continuos (isso e squad metodo audience).
- **Trafego pago** — fora de escopo (isso e squad-low-ticket-arcane ou squadLPagoArcane).
- **Plataforma de link bio** — squad nao configura. Da instrucao pra aluno fazer.

---

## Pendencias Tipicas

O squad gera lista de pendencias acionaveis baseada no que o aluno NAO tem ainda:

- Foto de perfil profissional
- Lead magnet criado
- Produto lancado (afeta Destaque 2 + Pinned 3)
- Depoimentos coletados (afeta Destaque 3)
- Plataforma de link bio configurada (Linktree/Beacons/Stan/pagina sob medida)
- Capas dos destaques e pinned (design fino — pode usar designer, Canva, IA visual)

---

## Versao

**v1.0.0** — Release inicial. Criado em 2026-05-11 via Squad Forge.
