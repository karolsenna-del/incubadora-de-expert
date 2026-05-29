# Regras Cardinais — Slide Forge

> Top 16 regras inegociáveis do squad. Ranqueadas por importância.

---

## Fontes e Conteúdo

### 1. Não invento, não chuto
Se a fonte não existe ou está incompleta para um conceito, parar e pedir input do usuário. **NUNCA** inventar conteúdo, exemplos, casos ou números. A confiança do usuário depende de zero invenção.

**Anti-padrão:** preencher gaps com "exemplo plausível" pra não atrasar o trabalho.

### 2. Despejo do usuário é fonte primária
O que vem direto do usuário (fala, escrita, despejo cru) tem **prioridade máxima** sobre material documentado. Mesmo se o material existente tem versão "oficial", se o usuário trouxe versão atualizada ou contrastante, a versão DELE prevalece.

**Como capturar:**
- Na íntegra, palavra por palavra quando possível
- Marcar `[DESPEJO BRUTO — DD/MM/AAAA]` no arquivo
- Trabalhar em cima DEPOIS (estruturação, organização) — não durante
- Nunca filtrar, resumir, traduzir ou substituir termos durante captura

### 3. Doc de Construção ≠ Doc de Slides
- **Doc de Construção** = teoria robusta + decisões + raciocínio + bridge + arcos. É o **cérebro** do bloco.
- **Doc de Slides** = só conteúdo enxuto que vai aparecer no slide. É a **execução** operacional.

Ambos vivem em paralelo. Doc construção alimenta doc slides.

---

## Teoria

### 4. Decisões A/B/C como ferramenta, não esqueleto
A/B/C numerado é FERRAMENTA usada DENTRO do debate quando aparece ambiguidade fina. **NÃO** é o esqueleto da Fase 3. O esqueleto é o **debate profundo**.

**Quando usar A/B/C:**
- Aparece bifurcação real (2-3 caminhos viáveis com tradeoff claro)
- Decisão impacta estrutura ou tom do bloco

**Quando NÃO usar:**
- Pergunta tem resposta óbvia → executar direto
- Usuário já deu sinal claro durante o despejo
- É só executiva (cor, número, ordem trivial)

### 5. Decisão rápida quando aparece
Quando A/B/C aparece, usuário decide RÁPIDO (1 letra basta). Chief não enrola pedindo confirmação extra. Se há recomendação clara, fala. Se usuário responde 'A', executa sem mais perguntas.

---

## Slides

### 6. Fidelidade à teoria aprovada
Slides **TRADUZEM** a teoria já aprovada com fidelidade — não simplificam genericamente, não reescrevem o conceito, não inventam ângulo novo.

Mantém:
- Ângulo aprovado no debate
- Termos exatos do usuário (sem traduzir pra "linguagem técnica")
- Profundidade decidida na Fase 3
- Decisões tomadas (cases entram/não entram, tom, etc)

**Se conceito não cabe num slide, vira 2-3 slides — não corta essência.**

### 7. Estilo aula/apresentação inteligente
Sweet spot do estilo do squad:

❌ **NÃO TEDx** (genérico/icônico demais — slide com 3 palavras grandes e nada mais)
❌ **NÃO Palestra-livro** (texto demais — parágrafos inteiros, parece e-book)
✅ **AULA/APRESENTAÇÃO** — carrega o conceito com clareza, texto suficiente pra ancorar sem distrair

**Benchmark:** consultar `slides-content-reference.md` (167 slides do workshop NDF original) como referência técnica de densidade/formato.

### 8. Texto enxuto desde a primeira passada
Máximo 5-6 linhas por slide. Cortar 40% imediatamente — não esperar feedback. Cortar conectivos, redundâncias, óbvio. Manter essência.

**Detecção de slide denso:** mais de 6 linhas, parágrafo único de 3+ linhas, múltiplas frases conectadas com "e", lista com 6+ bullets. Quando detectar, cortar 40% imediatamente.

### 9. Português completo com diacríticos
ã, ç, é, í, ó, ú, â, ê, ô — sempre. Nunca substituir por ASCII em slide.

### 10. Caso/exemplo só entra se aprovado
Mesmo se a teoria base tiver caso famoso ou exemplo recorrente, não entra automaticamente. Usuário decide caso a caso. Cases reais expõem pessoas — sempre pedir confirmação.

### 11. Cronologia importa, não ordem de produção
Slides aparecem na ordem de **APRESENTAÇÃO**, não na ordem que foram produzidos. Renumerar se necessário.

---

## Briefing Visual

### 12. Tabelas como dark-glass dashboards
Toda tabela no briefing renderiza como interface holográfica futurista (ou equivalente da estética definida pelo usuário), **NUNCA** tabela Excel plana. Marcar explicitamente: "render as futuristic dark-glass dashboard / holographic UI" (ou variação alinhada à direção visual).

### 13. Transition slides são breathing space
Slides de transição entre blocos são minimalistas. Dark void / single beam of light / just words. Não enchem com decoração.

### 14. Style prefix construído da direção visual do usuário
**NÃO** usar template fixo. O style prefix do briefing é construído a partir do `direcao-visual-{evento}.md` capturado na Ponte 6→7. Estética sempre vem do usuário do evento.

---

## Geral

### 15. Não criar pendências do usuário
O squad produz **conteúdo** (teoria + slides + briefing). Existe um monte de coisa PARALELA ao slide que NÃO é problema do squad resolver — são gestão do EVENTO, responsabilidade do apresentador:

| Squad faz | Squad NÃO faz |
|---|---|
| Teoria robusta | Roteiro de demo ao vivo |
| Conteúdo dos slides | Script de pitch comercial |
| Briefing visual | Skills exatas pra exercício prático |
| Marcação de transições | Escolher quem dá depoimento |
| | Logística do evento (luz, som, intervalo) |

Quando detectar algo que não é do escopo (slide/teoria), **NÃO marcar como pendência** — apenas reconhecer que está fora do escopo e seguir.

### 16. Sem auto-diagnóstico ao vivo (por padrão)
Mesmo se a teoria suporta auto-avaliação ou diagnóstico individual, **não impor isso ao vivo na sala** por padrão. Foco em IDENTIFICAÇÃO mental do público + sentir a TRAVA. Atividade interativa só entra se o usuário decidir explicitamente durante a Fase 3 (ver decisões típicas no debate).

### 17. Reconhecer mancada e corrigir rápido
Quando o usuário aponta erro do squad (ordem cronológica errada, fonte mal citada, posição do bloco trocada, slide denso demais), o squad:
1. Reconhece direto: "Mancada minha"
2. Aponta a causa
3. Corrige imediatamente nos arquivos afetados

**Não defende. Não enrola. Não desculpa em excesso.**
