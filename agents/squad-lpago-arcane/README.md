# Squad LPago Arcane

Squad operacional de Lancamento Pago — 5 agentes orquestrando o pipeline completo, do documento mestre ao pos-evento, com KB autocontida do Metodo LP do Euriler + referencias reais do Workshop NDF.

**Versao:** 1.0.0 (release inicial — 2026-05-08)
**Autor:** Euriler Jube
**Slash:** `/squadLPagoArcane`
**Target:** Neutro (Euriler ou aluno Mentoria Arcane)

---

## Estrutura

```
squads/squad-lpago-arcane/
├── skill.md                      # Entry point pro Claude Code
├── config.yaml                   # Manifest do squad
├── squad.yaml                    # Manifest Auroq canonico
├── README.md                     # Este arquivo
├── agents/                       # 5 agentes
│   ├── estrategista-chief.md
│   ├── copy-pagina.md
│   ├── anuncios.md
│   ├── copywriter-mensagens.md
│   └── analista-dados.md
├── tasks/                        # 13 tasks
│   ├── start.md
│   ├── construir-documento-mestre.md
│   ├── consultar-estrategia.md
│   ├── revisar-plano.md
│   ├── construir-briefing-pagina.md
│   ├── construir-roteiros-anuncios.md
│   ├── construir-sequencia-antecipacao.md
│   ├── construir-mensagens-evento.md
│   ├── construir-recuperacao-ingresso.md
│   ├── construir-downsell-pos-evento.md
│   ├── construir-mensagem-pontual.md
│   ├── diagnosticar-lancamento.md
│   └── retrospectiva-pos-evento.md
├── workflows/                    # 1 workflow
│   └── wf-squad-lpago-arcane.yaml
└── data/                         # 30 arquivos KB autocontida
    ├── 00-INDICE.md
    ├── metodo/                   # 11 arquivos (Metodo LP completo)
    ├── templates/                # 5 arquivos (output)
    ├── playbooks/                # 3 arquivos (decision trees + instrucoes)
    └── exemplos/                 # 7 arquivos (referencias reais NDF)
```

---

## Os 5 Agentes

| Nome | ID | Tier | Papel | Tasks |
|------|----|------|-------|-------|
| **🎯 Atlas** | estrategista-chief | Orchestrator | Documento mestre + consultoria estrategica + revisao de plano | start, construir-documento-mestre, consultar-estrategia, revisar-plano |
| **📄 Quill** | copy-pagina | Tier 1 | Briefing + copy final da pagina de vendas (12 secoes) | construir-briefing-pagina |
| **📺 Spark** | anuncios | Tier 1 | Roteiros + direcao criativa + direcao de edicao | construir-roteiros-anuncios |
| **💬 Echo** | copywriter-mensagens | Tier 1 | Antecipacao + evento + recuperacao ingresso + downsell + msgs ad-hoc | construir-sequencia-antecipacao, construir-mensagens-evento, construir-recuperacao-ingresso, construir-downsell-pos-evento, construir-mensagem-pontual |
| **📊 Pulse** | analista-dados | Tier 1 | Diagnostico + retrospectiva pos-evento | diagnosticar-lancamento, retrospectiva-pos-evento |

---

## Os 13 Tasks

| Task | Owner | Quando |
|------|-------|--------|
| start | estrategista-chief | Ativacao do squad |
| construir-documento-mestre | estrategista-chief | Plano novo |
| consultar-estrategia | estrategista-chief | Duvida estrategica pontual |
| revisar-plano | estrategista-chief | Plano precisa ajuste durante lancamento |
| construir-briefing-pagina | copy-pagina | Apos doc mestre aprovado |
| construir-roteiros-anuncios | anuncios | Apos pagina com copy REDIGIDA |
| construir-sequencia-antecipacao | copywriter-mensagens | Apos cronograma fechado no doc mestre |
| construir-mensagens-evento | copywriter-mensagens | Vespera do evento |
| construir-recuperacao-ingresso | copywriter-mensagens | Durante captacao (lead abandonou checkout) |
| construir-downsell-pos-evento | copywriter-mensagens | Pos-evento (placeholder se sem oferta de continuidade) |
| construir-mensagem-pontual | copywriter-mensagens | Ad-hoc, qualquer momento |
| diagnosticar-lancamento | analista-dados | Proativo / reativo / agendado |
| retrospectiva-pos-evento | analista-dados | Fechamento do ciclo |

---

## Workflow — 5 Fases

```
Fase 1: Plano                    @estrategista-chief
   |
   +--> Fase 2: Pagina            @copy-pagina
           |                       (paralelismo opcional com Fase 1)
           +--> Fase 3: Anuncios   @anuncios
                   |
                   +--> Fase 3b: Comunicacao (PARALELA com Fase 3)
                   |       @copywriter-mensagens
                   |       (destrava com cronograma fechado)
                   |
                   +--> Fase 4: Monitoramento (continuo, multi-trigger)
                           @analista-dados
                           Feedback loops -> @estrategista | @copy | @anuncios | @copywriter
                           |
                           +--> Fase 5: Pos-Evento
                                   @analista-dados (retrospectiva)
                                   @copywriter-mensagens (recuperacao)
```

**Bottleneck:** Pagina com copy REDIGIDA (Fase 2 -> 3, QG-LP-02).

---

## Quality Gates

| Gate | Transicao | Blocking | Criterio |
|------|-----------|----------|----------|
| QG-LP-01 | 1 -> 2 | SIM | Doc mestre completo + RCs validadas + aprovacao |
| QG-LP-02 | 2 -> 3 | **SIM (critico)** | Pagina com COPY REDIGIDA (nao briefing) |
| QG-LP-03 | 3+3b -> 4 | NAO | Roteiros + sequencia antecipacao prontos |
| QG-LP-04 | intra-4 | SIM | Diagnostico em 4 secoes + acao priorizada |
| QG-LP-05 | fim 5 | NAO | Retrospectiva + recuperacao (placeholder OK) |

---

## Como usar

1. Ative com `/squadLPagoArcane`
2. Estrategista cumprimenta e identifica perfil (Euriler ou aluno + nicho + maturidade)
3. Escolha modo: (1) novo plano / (2) consulta estrategica / (3) retomar lancamento
4. Pipeline avanca pelas fases conforme aprovacao em cada gate
5. Diagnostico continuo na Fase 4 — pode disparar feedback loop pra qualquer agente
6. Encerra ciclo com retrospectiva pos-evento

---

## Dependencias externas

- **Calculadora Arcane:** plataforma Arcane > Ferramentas. Squad direciona usuario, usuario cola resultado de volta. Instrucao em `data/playbooks/instrucoes-calculadora-arcane.md`.
- **Templates Meta API:** vivem na Meta/ManyChat. Squad gera estrutura conhecida + body como placeholder. Euriler exporta bodies quando aprovar templates. Lista em `data/exemplos/templates-meta-api-placeholder.md`.

---

## Versao

**V1 (2026-05-08):** release inicial.
- 5 agentes funcionais
- 12 tasks com TASK-FORMAT-SPECIFICATION-V1
- 1 workflow com 5 fases + paralelismo Fase 3b
- KB autocontida (30 arquivos / ~7500-9000 linhas)
- Templates Meta API e copies de recuperacao como placeholders (Euriler ativa quando definir)
- Sem segmentacao por temperatura (frio/morno/quente) — nao existe no metodo

**V2+ (futuro):** refinamento Euriler.
- Benchmarks por nicho proprietarios
- Cases reais de alunos
- Bodies de template Meta API exportados
- Oferta de continuidade definida (downsell-pos-evento com copies finais)

---

## Regras inegociaveis

1. KB autocontida — runtime SO referencia paths em `squads/squad-lpago-arcane/data/`. Nunca `docs/knowledge/`, `business/campanhas/`, `squads/etlmaker/`.
2. Documento mestre e VIVO — pode ser revisado durante o lancamento via `revisar-plano`.
3. Estrategista NAO consulta Analista durante o PLANO — valida sozinho via Calculadora + benchmarks.
4. Pagina precisa COPY REDIGIDA antes de Anuncios. Trava forte (QG-LP-02).
5. Outputs validados contra Regras Cardinais (RC-001 a RC-020) quando aplicaveis.
6. Sem invencao de copies de template Meta API ou de oferta de recuperacao quando faltar definicao do dono — entrega placeholder com estrutura preservada.

---

## Audit

| Metric | Valor |
|--------|-------|
| Agentes | 5 |
| Tasks | 12 |
| Workflows | 1 |
| Quality Gates | 5 |
| Human Touchpoints | 9 |
| Feedback Loops | 4 |
| Arquivos KB | 30 |
| PUs cobertos | 19/19 (100%) |

Detalhes em `squads/squad-forge/minds/squad-lpago-arcane/03-blueprint/`.
