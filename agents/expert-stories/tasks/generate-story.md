---
task: "Generate Story"
responsavel: "@expert-stories"
atomic_layer: "task"
entrada: "Karol pede o Story do dia (ou dia da semana identificado no start)"
saida: "Texto do Story pronto + imagem gerada (se 🟢/🟡) ou orientação de gravação (se 🔴)"
execution_type: "interactive"
---

# Task: Generate Story — Decidir e Produzir o Story do Dia

## Objetivo

Identificar o formato certo pro dia, escrever o texto no tom da Karol, e gerar a imagem
(quando o formato permite) ou orientar a gravação (quando exige conteúdo real dela).

## Passos

### Step 1: Identificar o Dia e o Formato

Consultar `docs/producao-conteudo/karol/rotina-stories-formatos.md`:

| Dia | Formato |
|---|---|
| Domingo | Levantada de Mão — define a oferta da semana (ciclo de 5) |
| Segunda | Catálogo rotativo |
| Terça | Levantada de Mão — reforça a oferta da semana, ângulo diferente |
| Quarta | Catálogo rotativo (**verificar antes**: live Expert360º 15h-16h Brasília — se
aconteceu, considerar como candidato a override) |
| Quinta | Levantada de Mão — reforça a oferta da semana, ângulo diferente |
| Sexta | Catálogo rotativo |
| Sábado | Day Off |

**Antes de seguir:** checar se é dia de compromisso fixo (Segunda 15h-16h30 mentoria em
grupo — condicional a ter aparecido aluno; Quarta 15h-16h live Expert360º; qualquer dia com
Encontro individual ou Sessão estratégica) — esses SEMPRE viram Story do que foi falado,
mesmo em dia de catálogo rotativo. Perguntar à Karol se algum desses aconteceu hoje antes de
puxar o catálogo rotativo.

### Step 2: Se for Levantada de Mão — Checar o Ciclo de Ofertas

Ler o Mission Log (`data/expert-stories-missions.md`) pra saber em que semana do ciclo de 5
está (Diagnóstico Ferramentas → Expert360º → Sprint do Método → Grupo → Individual). Se a
última Levantada de Mão foi de Domingo passado, avançar pra próxima oferta do ciclo; se foi
Terça/Quinta desta semana, manter a mesma oferta com ângulo variado (ver rotina).

### Step 3: Se for Catálogo Rotativo — Escolher o Formato

Evitar repetir o mesmo formato usado no dia rotativo anterior (checar Mission Log). Escolher
dentre os 14 formatos do catálogo (Caixinha, Enquete Positiva, Dominando a Mente, Cantinho do
Pensamento, Pico de Engajamento, Sequência, Isca Digital/Social Selling/Call, Você no Game,
Depoimento ou Bastidor, De Volta ao Passado, Atualização, Gerar Valor, Inimigo Comum, Teste de
Demanda).

### Step 4: Escrever o Texto

Usar `docs/producao-conteudo/karol/perfil-tom-de-voz.md`. Regras:
- Sem escassez fabricada ("última chance", "vagas se esgotando")
- Se o formato pede prova numérica (Cantinho do Pensamento, Dominando a Mente) e não há dado
  real disponível, PARAR e perguntar à Karol — nunca inventar número
- Pode reaproveitar histórias já usadas em carrossel/Reels (decisão da Karol, 12/08)

### Step 5: Gerar a Imagem (se 🟢/🟡) ou Orientar (se 🔴)

Consultar a classificação visual no catálogo:

**🟢/🟡 (texto ou texto+foto genérica):**
- Acionar o Squad Carrossel Arcane (`@producer`, task `produce-static-post`) com o texto
  pronto, usando o template `story-texto` (`~/.carrossel-arcane/templates/story-texto/`,
  1080x1920) e o modifier certo:
  - `numerada` — Levantada de Mão, Isca Digital/Social Selling/Call
  - `texto-corrido` — Cantinho do Pensamento, Dominando a Mente
  - `quiz` — Pico de Engajamento
  - `cta-grande` — Sequência, Gerar Valor, Inimigo Comum
- Se o formato usa sticker nativo do Instagram (Caixinha, Enquete Positiva, Teste de
  Demanda): gerar só o fundo/texto de apoio, avisando que ela precisa colar o sticker no app

**🔴 (precisa de conteúdo real):**
- Não produzir nada — orientar o que fotografar/gravar (ex: "hoje é Você no Game — manda uma
  foto/vídeo rápido de você trabalhando ou numa sessão")
- Escrever só o texto de apoio (legenda/overlay) pra ela aplicar em cima da própria mídia

### Step 6: Entregar

```
Hoje é [dia] — [formato].
{se Levantada de Mão}: oferta da semana = [oferta], ângulo = [Domingo/reforço 1/reforço 2]

[texto do Story pronto]

{se 🟢/🟡}: imagem gerada em [caminho]
{se 🔴}: manda [o que fotografar/gravar] que eu escrevo o texto de apoio
{se sticker nativo}: lembra de colar o [sticker] no app — a API não deixa automatizar isso
```

### Step 7: Documentar

Registrar no Mission Log (`data/expert-stories-missions.md`): data, dia, formato, oferta (se
aplicável), se precisou perguntar dado real, se teve algum ajuste da Karol.

## Veto Conditions

| Condição | Ação |
|---|---|
| Formato pede prova numérica sem dado real disponível | PARAR, perguntar à Karol — nunca inventar |
| Dia tem compromisso fixo não confirmado (live, mentoria, encontro) | Perguntar antes de puxar catálogo rotativo |
| Template Stories não existe no Squad Carrossel Arcane | Não deveria acontecer — template `story-texto` já existe desde 13/08. Se sumiu, avisar a Karol e sugerir `*add-template` de novo lá |
