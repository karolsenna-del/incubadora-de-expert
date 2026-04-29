# Mind Forge — Knowledge Base

> Fabrica de mentes sinteticas e consultores. Transforma documentacao em inteligencia operacional.

---

## 1. O QUE E UMA BOA MENTE

Uma mente bem forjada tem 7 qualidades:

1. **Organizada por dominio** — Conhecimento agrupado pelo que FAZ, nao por quem disse
2. **Operacional** — Principios viram heuristicas SE/ENTAO usaveis em tempo real
3. **Ancorada** — Cada conceito tem pelo menos 1 exemplo concreto
4. **Protegida** — Immune system previne mau uso antes de acontecer
5. **Vocalmente coerente** — Uma voz unica, mesmo quando fundida de N experts
6. **Limitada** — Sabe onde NAO se aplica (anti-padroes e fronteiras)
7. **Demonstravel** — Output examples mostram exatamente como a mente responde

---

## 2. REFERENCIA: GPMASTER (PADRAO-OURO)

O padrao-ouro de mente sintetica bem feita. Caracteristicas:

| Elemento | Como deve ser feito |
|----------|-------------------|
| KB | 1005 linhas, 11 secoes, organizada por DOMINIO |
| Modos | 4 (Juiz, Arquiteto, Otimizador, Consultor) |
| Immune System | 7 triggers com respostas automaticas |
| Strict Rules | 10 NUNCAs + 9 SEMPREs |
| Heuristicas | Top 20 em formato SE/ENTAO |
| Output Examples | 3 completos (1 por modo principal) |
| Caixa de Ferramentas | 5 tabelas situacao → ferramenta |
| Proporcao | 40% diagnostico, 20% design, 40% refinamento |

---

## 3. DOIS TIPOS DE MENTE

### 3.1 Mente Sintetica (Fusao N→1)

**Input:** N fontes de N experts diferentes
**Fusao:** Cruzar por dominio, preservar convergencias, documentar tensoes
**Voz:** Fundida do expert dominante + blend dos demais
**Modos tipicos:** Judge / Create / Optimize / Consult
**Immune System:** Cross-expert (previne simplificacao)

**Exemplo real:** Exemplo: 10 mestres de um dominio fundidos numa mente

### 3.2 Consultor (Deep-dive 1 assunto)

**Input:** 1+ fontes sobre 1 metodologia/assunto
**Fusao:** Nenhuma — organizacao profunda por subtopico
**Voz:** Do autor da metodologia ou neutra-tecnica
**Modos tipicos:** Teach / Apply / Audit / Consult
**Immune System:** Pureza metodologica (previne distorcao)

**Exemplo hipotetico:** Consultor de OKRs = livros do Doerr + frameworks + cases

### 3.3 PADRAO OBRIGATORIO PARA CONSULTORES

Todo consultor (tipo 3.2) gerado pelo Mind Forge DEVE seguir este padrao. Sem excecao.

**3 Modos Operacionais (obrigatorios):**

| Modo | Trigger (linguagem natural) | Trigger (comando) | O que faz |
|------|---------------------------|-------------------|-----------|
| **Mentor** | "explica", "o que e", "como funciona", "me ensina" | `*mentor` | Ensina conceitos: definicao + contexto + mecanica + analogia + heuristica |
| **Juiz** | "avalia", "o que acha", "ta certo?", "julga", "review", "feedback" | `*judge` | Avalia contra principios/regras/benchmarks. Emite VEREDICTO (Aprovado/Com Ressalvas/Reprovado) |
| **Consultor** | "como faco", "qual a melhor", "me ajuda", "to com problema" | `*consult` | Responde duvidas com fundamentacao. Opcoes numeradas. Proximo passo concreto |

**Elementos obrigatorios para todo consultor:**

| Elemento | Descricao | Referencia |
|----------|-----------|-----------|
| Immune System | >= 5 triggers com resposta automatica para anti-padroes do dominio | 7-9 triggers recomendados |
| Context Death Recovery | Protocolo explicito com sinais de deteccao e passos de recuperacao | Ambos consultores implementam |
| Strict Rules: NUNCAs | >= 5 regras do que a mente NUNCA faz | 9+ regras recomendadas |
| Strict Rules: SEMPREs | >= 5 regras do que a mente SEMPRE faz | 10+ regras recomendadas |
| Voice DNA | Tom, frases de assinatura, vocabulario proibido, estilo de comunicacao | Definido na analise (Fase 2) |
| Greeting padrao | 3 modos listados + pergunta de contexto/fase | Padrao em ambos consultores |
| Command Router | Tabela linguagem natural → modo + comandos `*` | Padrao em ambos consultores |
| KB por dominio | Organizada por tema, nao por fonte. Heuristicas SE/ENTAO, benchmarks, anti-padroes | >= 300 linhas |

**Tasks obrigatorias (4 arquivos):**
1. `tasks/start.md` — Ativacao: carregar persona → carregar KB → greeting → aguardar
2. `tasks/mentor.md` — Modo Mentor: definicao + contexto + mecanica + analogia + heuristica
3. `tasks/judge.md` — Modo Juiz: receber material → avaliar 5 dimensoes → veredicto 3 partes
4. `tasks/consult.md` — Modo Consultor: entender duvida → consultar KB → responder fundamentado → proximo passo

**Referencia: usar qualquer mente bem-feita ja instalada como modelo

---

## 4. ARMADILHAS NA FORJA

| Armadilha | Sinal | Correcao |
|-----------|-------|----------|
| KB rasa | Menos de 300 linhas, sem exemplos | Voltar pra analise, extrair mais KFs |
| Voz de comite | Respostas parecem "correcao politica de grupo" | Definir 1 expert dominante como ancora |
| Immune system fraco | Nenhum trigger definido | Extrair anti-padroes das fontes (L6) |
| Modos artificiais | Modos nao refletem uso real | Perguntar: "o que o usuario PEDIRIA pra essa mente?" |
| Fusao superficial | KB e lista de experts, nao integracao | Reorganizar por dominio, cruzar perspectivas |
| Zero exemplos | Tudo abstrato, nada concreto | Buscar cases em L5 ou pedir ao usuario |
| Heuristicas vagas | "Faca X" sem condicao | Reformular: "SE {quando}, ENTAO {o que}" |

---

## 5. SOURCE TIERS (inspirado por Alan Nicolas)

Nem toda fonte vale o mesmo. Classificar ANTES de extrair.

| Tier | Peso | Criterio |
|------|------|----------|
| OURO (1.0) | 0.90-1.00 | Conteudo original, profundo, editado (livro, KB curada, curso completo) |
| PRATA (0.7) | 0.60-0.89 | Conteudo do expert mas parcial (transcript, podcast, posts) |
| BRONZE (0.4) | 0.30-0.59 | Conteudo secundario (resumos, notas, conteudo antigo) |

O peso propaga pra confianca de cada KF: `confidence = base * tier_weight`.
Se ouro_ratio < 40%: mente sera construida sobre areia.

---

## 6. TRINITY CHECK (inspirado por Alan Nicolas)

Todo dominio da KB precisa ter 3 pernas:

| Perna | Tipo de KF | Funcao |
|-------|-----------|--------|
| **Playbook** | FRAMEWORK | Como fazer (passos) |
| **Framework** | HEURISTIC | Quando fazer (SE/ENTAO) |
| **Swipe File** | EXAMPLE | Exemplo real aplicado |

Se falta 1 das 3, o dominio e manco. Mente desequilibrada = conselho raso.

---

## 7. PARETO AO CUBO NOS KFs (inspirado por Alan Nicolas)

Nem todo KF vale o mesmo. Apos extrair, classificar cada KF:

| Zona | % dos KFs | % do valor | Tratamento na KB |
|------|----------|-----------|-----------------|
| Crown Jewel (0.8%) | <5% | ~51% | Destaque em Principios Universais + Heuristicas Mestras |
| Excellence (4%) | ~10-15% | ~13% | Secao dedicada no dominio, detalhado com exemplos |
| Impact (20%) | ~20-30% | ~16% | Incluso no dominio, formato padrao |
| Filler (80%) | ~50-60% | ~20% | Avaliar inclusao. Na duvida, descartar |

**Regra:** Se >10% dos KFs sao Crown Jewel, a classificacao esta inflacionada.

---

## 8. REGRA 40/20/40 (inspirado por Alan Nicolas)

Distribuicao de esforco no pipeline:

| Fase | % esforco | O que faz |
|------|----------|-----------|
| Curadoria (Fases 1-2) | 40% | Ingestao + analise profunda + classificacao |
| Construcao (Fase 4) | 20% | Forja da mente (KB, agent, tasks) |
| Refinamento (Fases 3+5) | 40% | Playback + validacao + iteracao |

Inverter essa proporcao = mente mal testada. A tentacao e apressar a validacao — resistir.

---

## 9. CHECKLIST DE MENTE PRONTA

- [ ] KB organizada por dominio (nao por fonte/expert)
- [ ] >= 300 linhas de KB
- [ ] >= 2 frameworks completos (nome + passos)
- [ ] >= 10 heuristicas SE/ENTAO
- [ ] >= 3 output examples (1 por modo principal)
- [ ] Immune system com >= 3 triggers
- [ ] Strict rules: NUNCA (5+) + SEMPRE (5+)
- [ ] Caixa de ferramentas (situacao → ferramenta/acao)
- [ ] Voice DNA definida (tom, frases, vocabulario proibido)
- [ ] Config.yaml com type: single-mind
- [ ] Skill.md como shim de ativacao
- [ ] Pelo menos 2 modos operacionais com tasks dedicadas
- [ ] Trinity Check: cada dominio tem FRAMEWORK + HEURISTIC + EXAMPLE
- [ ] Context Death Test: mente funciona cold-start sem contexto previo
