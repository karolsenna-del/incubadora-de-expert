# Índice da KB — Squad LPago Arcane

> **KB do Squad LPago Arcane — Mapa de Navegação**
> Carregado por: TODOS os 5 agentes (estrategista-chief, copy-pagina, anuncios, copywriter-mensagens, analista-dados)
>
> Esta KB é autocontida. Todos os arquivos vivem em `squads/squad-lpago-arcane/data/`.
> Nenhum arquivo referencia paths externos do repo. Squad é portável — pode ser instalado em qualquer máquina.

---

## Estrutura

```
data/
├── 00-INDICE.md                               (este arquivo)
├── metodo/                                    (11 arquivos — método LP completo)
│   ├── 01-fundamentos.md                      Filosofia, 80/20, 5 fases, timeline
│   ├── 02-proposta-municao.md                 Proposta + 9 tipos de munição
│   ├── 03-pagina-vendas.md                    12 seções + 3 pilares + 4 inimigos
│   ├── 04-anuncios-trafego.md                 6 tipos + Hook→Interesse→Oportunidade→CTA
│   ├── 05-infraestrutura.md                   Stack mínima (sem detalhe de ferramenta)
│   ├── 06-antecipacao.md                      Protocolo INTEGRAL — 11 momentos, 3 canais
│   ├── 07-evento-pitch.md                     4 princípios + 3 pitches + lotes
│   ├── 08-pos-evento.md                       Meteórico, 7 ângulos, ficha, comercial
│   ├── 09-referencia-tatica.md                Benchmarks completos por dimensão
│   ├── 10-recuperacao-ingresso.md             Recuperação de venda de ingresso (pré-evento, ≠ downsell pós)
│   ├── REGRAS-CARDINAIS.md                    RC-001 a RC-020 (literal — não interpretar)
│   └── REPERTORIO.md                          Cases reais, bordões, templates
├── templates/                                 (5 arquivos — outputs do squad)
│   ├── documento-mestre.md                    Template do output do Estrategista
│   ├── briefing-pagina.md                     Template do output do Copy/Página
│   ├── roteiro-anuncio.md                     Template do output do Anúncios
│   ├── diagnostico-lancamento.md              Template do output do Analista (4 seções)
│   ├── recuperacao-ingresso.md                Sequência recuperação venda ingresso (Disparo 1 detalhado + 2-6 TBD)
│   └── downsell-pos-evento.md                 PLACEHOLDER — Meteórico/downsell (copies TBD até oferta continuidade)
├── playbooks/                                 (3 arquivos — heurísticas operacionais)
│   ├── arvore-diagnostico.md                  Decision tree do Analista
│   ├── instrucoes-calculadora-arcane.md       Fluxo da calculadora externa
│   └── benchmarks-por-nicho.md                V1 genérico → V2+ Euriler refina
└── exemplos/                                  (7 arquivos — referências reais NDF)
    ├── briefing-pagina-ndf.md                 COPY-MESTRE NDF (referência premium)
    ├── cronograma-disparos-ndf.md             Estrutura intencionalidade 34+ disparos
    ├── active-ndf-ciclo-real.md               Copies LITERAIS por fase do ciclo ativo
    ├── ciclo-historico-2026-04-26.md          Ciclo executado completo
    ├── email-boas-vindas-ndf.md               Template MailerLite real
    ├── template-whatsapp-meta-ndf.md          Template Meta com video header + buttons
    ├── templates-meta-api-placeholder.md      8 templates Meta com {{TODO body}}
    ├── swipe-criativos-vendas-ingresso.md     Banco de conceitos campeões (Kimura, Kacio) com CPA real
    └── swipe-lp-lancamento-pago.md            3 LPs reais + análise comparativa + estrutura master + copy-lego
```

---

## Por Agente — O que cada um carrega

> Os 5 agentes têm **nomes humanos**: 🎯 **Atlas** (Chief) · 📄 **Quill** (Copy/Página) · 📺 **Spark** (Anúncios) · 💬 **Echo** (Copywriter Mensagens) · 📊 **Pulse** (Analista). Os IDs técnicos abaixo são usados pra routing.

### Atlas · estrategista-chief (Orchestrator)
- **Método (todo):** 01, 02, 03, 04, 05, 06, 07, 08, 09, REGRAS-CARDINAIS, REPERTORIO
- **Templates:** documento-mestre.md
- **Playbooks:** instrucoes-calculadora-arcane.md, benchmarks-por-nicho.md
- **Exemplos:** cronograma-disparos-ndf.md, ciclo-historico-2026-04-26.md
- **Por quê:** duplo papel produção+consultoria — precisa do método inteiro pra responder qualquer dúvida estratégica e construir documento mestre completo.

### Quill · copy-pagina
- **Método:** 02-proposta-municao.md, 03-pagina-vendas.md, REGRAS-CARDINAIS, REPERTORIO
- **Templates:** briefing-pagina.md
- **Exemplos:** briefing-pagina-ndf.md + swipe-lp-lancamento-pago.md (3 LPs reais + análise + copy-lego — consultar antes de redigir)
- **Por quê:** foco em traduzir proposta em copy de página. Não precisa de antecipação, anúncios, evento, pós.

### Spark · anuncios
- **Método:** 04-anuncios-trafego.md, REGRAS-CARDINAIS, REPERTORIO
- **Templates:** roteiro-anuncio.md
- **Exemplos:** swipe-criativos-vendas-ingresso.md (banco de conceitos campeões — consultar antes de roteirizar)
- **Por quê:** foco em roteiros. Anúncios são a fase mais delimitada do squad.

### Echo · copywriter-mensagens
- **Método:** 06-antecipacao.md (INTEGRAL), 08-pos-evento.md (recuperação preservada), REGRAS-CARDINAIS
- **Templates:** recuperacao-ingresso.md (parcial TBD), downsell-pos-evento.md (placeholder)
- **Exemplos:** TODOS os 7 (referências reais NDF + placeholder Meta)
- **Por quê:** o agente que mais carrega KB. Precisa de protocolo completo + estrutura + referências reais pra escrever copies de antecipação, evento, recuperação e pontuais.

### Pulse · analista-dados
- **Método:** 04-anuncios-trafego.md (entender o que se mede), 08-pos-evento.md (recuperação), 09-referencia-tatica.md (benchmarks), REGRAS-CARDINAIS
- **Templates:** diagnostico-lancamento.md
- **Playbooks:** arvore-diagnostico.md, benchmarks-por-nicho.md
- **Por quê:** cruza dados reais com plano. Precisa de benchmarks, árvore de decisão e formato do output.

---

## Por Necessidade — "Preciso saber X, vou em Y"

| Preciso saber... | Vou em... |
|---|---|
| O que é proposta no método | `metodo/02-proposta-municao.md` |
| Como estruturar página de vendas | `metodo/03-pagina-vendas.md` |
| Hook Rate, CPA, conversão esperada | `metodo/09-referencia-tatica.md` |
| Quando dispara cada mensagem do NDF | `exemplos/cronograma-disparos-ndf.md` |
| Copy real de mensagem do Euriler | `exemplos/active-ndf-ciclo-real.md` |
| Regra que NÃO PODE ser quebrada | `metodo/REGRAS-CARDINAIS.md` |
| Caso real de nicho específico | `metodo/REPERTORIO.md` |
| Como diagnosticar gargalo | `playbooks/arvore-diagnostico.md` |
| Onde está a calculadora | `playbooks/instrucoes-calculadora-arcane.md` |
| Estrutura template de output | `templates/{nome}.md` |
| Como escrever copy de antecipação | `metodo/06-antecipacao.md` + `exemplos/active-ndf-ciclo-real.md` |
| Como recuperar leads que abandonaram checkout do ingresso | `metodo/10-recuperacao-ingresso.md` + `templates/recuperacao-ingresso.md` |
| Estrutura downsell pós-evento (Meteórico) | `metodo/08-pos-evento.md` + `templates/downsell-pos-evento.md` (placeholder) |

---

## Sequência de Leitura Recomendada (pra entender o método do zero)

1. `metodo/01-fundamentos.md` (filosofia + 5 fases)
2. `metodo/REGRAS-CARDINAIS.md` (as 20 leis)
3. `metodo/02-proposta-municao.md` (coração do lançamento)
4. `metodo/03-pagina-vendas.md` (conversão 1)
5. `metodo/04-anuncios-trafego.md` (captação)
6. `metodo/06-antecipacao.md` (preparação do evento)
7. `metodo/07-evento-pitch.md` (conversão 2)
8. `metodo/08-pos-evento.md` (Meteórico + recuperação)
9. `metodo/09-referencia-tatica.md` (benchmarks)
10. `metodo/REPERTORIO.md` (cases + bordões)
11. `metodo/05-infraestrutura.md` (rápida — só essencial)

---

## Versionamento da KB

| Versão | Data | Notas |
|---|---|---|
| 1.0.0 | 2026-05-08 | Release inicial. KB completa baseada em KB LP Master + ETL Oficina + referências reais NDF Workshop. Recuperação de venda e templates Meta API como placeholders. |

---

## Placeholders Ativos (V2+)

- `templates/downsell-pos-evento.md` — copies bloqueadas até oferta de continuidade ser definida
- `templates/recuperacao-ingresso.md` — disparo 1 (15min) detalhado; cadência 2-6 e roteiro literal do vídeo TBD (Euriler completa depois)
- `exemplos/templates-meta-api-placeholder.md` — bodies dos 8 templates Meta API a exportar do ManyChat/Cloud API
- `playbooks/benchmarks-por-nicho.md` — V1 genérico, V2+ Euriler injeta benchmarks proprietários

---

**Última atualização:** 2026-05-08
**Versão:** 1.0.0
