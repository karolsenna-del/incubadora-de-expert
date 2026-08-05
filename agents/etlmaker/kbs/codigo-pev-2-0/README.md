# KB — Código PEV 2.0 (Clara Siqueira)

**Tipo:** Curso em vídeo (20 aulas, 5 módulos)
**Fonte:** Cademi — clarasiqueira.cademi.com.br
**Processamento:** ETLmaker v3.0 — transcrição via Whisper `tiny` + Mapeamento Territorial retroativo + composição com rastreabilidade completa
**Status:** Completo e validado (Camada 2 + Camada 3)
**Autores:** Clara Siqueira (Módulos 1-4 e Módulo 5/Aula 1) + co-estrategista não identificado por nome completo (Módulo 5/Aulas 2-3)

---

## Docs Transversais

| Doc | Descrição |
|-----|-----------|
| [MAPA-TERRITORIAL.md](00-pipeline/MAPA-TERRITORIAL.md) | Mapeamento territorial completo (11 seções) |
| [REGRAS-CARDINAIS.md](REGRAS-CARDINAIS.md) | 13 princípios absolutos organizados por domínio |
| [REPERTORIO.md](REPERTORIO.md) | Templates, fórmulas, checklists, workflows, catchphrases (11 seções) |
| [GLOSSARIO.md](GLOSSARIO.md) | 22 termos proprietários com definições |

---

## O Que É Esta KB

Extração e estruturação do curso Código PEV 2.0 da Clara Siqueira — um sistema de viralização no Instagram para mulheres de qualquer nicho. O curso ensina como criar conteúdo que viraliza organicamente, construir comunidade nos stories e transformar engajamento em renda.

**Promessa central do curso:** viralizar sem equipamento profissional, sem edição pesada, sem horas de produção. Copiar e aplicar os códigos → ter resultado.

---

## Estrutura da KB (5 Volumes)

### [VOL-01 — Algoritmo e Estrutura Viral](VOL-01-algoritmo-e-estrutura.md)
**Módulo:** Comece Aqui para Resultado Rápido

Conteúdo:
- O que é o Código PEV e para quem serve
- Como o algoritmo do Instagram mudou de 2025 para 2026
- O que nunca muda: retenção como prioridade permanente
- Como identificar para onde o algoritmo está indo
- Estrutura de topo/meio/fundo de funil

### [VOL-02 — Os 5 Códigos Virais](VOL-02-os-cinco-codigos-virais.md)
**Módulo:** Códigos pra Viralizar ainda Hoje

Conteúdo:
- O princípio do tempo de tela e por que gera viralização
- Método TikTok: como encontrar ideias virais com filtro de curtidas
- Código 1: Loufai (posicionamento direto, baixa edição)
- Código 2: React (reação a vídeos que já viralizaram)
- Código 3: Vogue (vlog de rotina com ganchos)
- Código 4: Frases (vídeo de 10 segundos com frase viral)
- Código 5: Pauta Quente (vídeo viral + sua opinião ou pergunta)

### [VOL-03 — Como Escrever Roteiros Virais](VOL-03-roteiros-virais.md)
**Módulo:** Como Escrevo meus Roteiros

Conteúdo:
- 3 tipos de gancho: visual, frase, áudio
- O que fazer no meio do vídeo para garantir retenção
- A CTA obrigatória: como pedir ação sem parecer chato
- Estrutura completa do roteiro viral (8 passos)
- Como descobrir onde seu vídeo está perdendo audiência (Instagram Insights)

### [VOL-04 — Movimento, Stories e Posicionamento](VOL-04-movimento-stories-posicionamento.md)
**Módulo:** Nunca Mais tenha um Perfil Flopado

Conteúdo:
- Por que movimento gera movimento (e o perfil nunca flopa)
- O código dos stories: documentar a vida com produto escondido na rotina
- Estrutura de um dia de stories (início, meio, fim)
- Estratégias para bombar visualizações dos stories
- Como ficar na boca do povo sendo repostada por perfis grandes
- Posicionamento como estratégia de crescimento acelerado

### [VOL-05 — Estrutura de um Perfil que Vende](VOL-05-perfil-que-vende.md)
**Módulo:** Estrutura de um Perfil que Vende

Conteúdo:
- OBE: o básico obrigatório do perfil (foto, nome, bio, destaques, feed)
- Reels x Stories: objetivos completamente diferentes
- Reels = atração (90% para crescer, 10% para vender)
- Stories = conversão (80% rotina, 20% venda)
- Os 3 pilares do clima de compra
- A jornada de 28 pontos de contato até a compra
- A diferença entre vender para a pessoa e fazer a pessoa querer comprar

---

## Conceitos Centrais do Curso

| Conceito | Volume |
|----------|--------|
| Retenção como prioridade do algoritmo | VOL-01 |
| Algoritmo 2026: orgânico > elaborado | VOL-01 |
| Topo/Meio/Fundo de funil | VOL-01 |
| Método TikTok de ideias virais | VOL-02 |
| 5 Códigos (Loufai, React, Vogue, Frases, Pauta Quente) | VOL-02 |
| 3 tipos de gancho (visual, frase, áudio) | VOL-03 |
| Estrutura do roteiro viral (8 passos) | VOL-03 |
| CTA obrigatória | VOL-03 |
| Movimento gera movimento | VOL-04 |
| Stories como novela diária | VOL-04 |
| Posicionamento gera repostagem | VOL-04 |
| OBE (básico do perfil) | VOL-05 |
| Reels = atração, Stories = venda | VOL-05 |
| Regra 80/20 dos stories | VOL-05 |
| Clima de compra | VOL-05 |
| 28 pontos de contato | VOL-05 |

---

## Uso desta KB

Esta KB fica **standalone** — disponível pra qualquer agente futuro sobre crescimento de perfil, stories ou vendas no Instagram. Por decisão do expert, apenas **VOL-02** (Os 5 Códigos Virais) e **VOL-03** (Como Escrever Roteiros Virais) foram trazidos pra dentro da KB multi-autor `conteudo-viral` (junto com Afonso Molina e Rafael Bem), por serem os módulos mais diretamente relacionados a criação de conteúdo viral. VOL-01, VOL-04 e VOL-05 continuam aqui, prontos pra alimentar um agente diferente (ex.: crescimento de perfil / conversão em vendas) quando fizer sentido.

---

## Arquivos de Pipeline

```
00-pipeline/
  sources/
    audio/          → 20 arquivos .mp3 (áudios das aulas)
    transcricoes/   → 20 arquivos .txt (transcrições Whisper)
  extrair.py        → Script de extração automática
  progresso.log     → Log de execução do pipeline
```
