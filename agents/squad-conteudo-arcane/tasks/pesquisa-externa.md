---
task: "Pesquisa Externa (densa)"
responsavel: "@sage-teorico"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Pesquisa interna concluida (gaps identificados) + tema + virais de referencia (de Iris)"
Saida: "Seções 'Pesquisa Externa' + 'Engenharia Reversa de Virais' + 'Fontes' do teoria.md"
Checklist:
  - "Identificou gaps na pesquisa interna"
  - "Perguntou fontes proprias do expert"
  - "Pesquisa publica densa (posts, artigos, livros, papers, videos, gringo)"
  - "Engenharia reversa de 5-15 virais relevantes"
  - "Transcreveu virais se necessario"
  - "Extraiu padroes dos virais"
  - "Salvou nas secoes do teoria.md"
execution_type: "interactive"
---

# Task: Pesquisa Externa — Sub-Passo 4.2

**Task ID:** squad-conteudo-arcane/pesquisa-externa
**Version:** 1.0.0
**Responsavel:** @sage-teorico
**Category:** Criar Teoria — Sub-passo 2
**Execution Type:** Interactive

---

## Pipeline

```
pesquisa-externa
  |
  v
STEP 1: IDENTIFICAR GAPS NA INTERNA
  Falta prova? Falta caso externo? Falta dado?
  |
  v
STEP 2: PERGUNTAR FONTES DO EXPERT
  Livros, transcricoes, podcasts, anotacoes
  |
  v
STEP 3: PESQUISA PUBLICA DENSA
  Posts + artigos + livros + papers + videos + gringo
  |
  v
STEP 4: ENGENHARIA REVERSA DE VIRAIS
  5-15 virais relevantes + transcrever se necessario
  |
  v
STEP 5: EXTRAIR PADROES
  Angulos + hooks + argumentos + estruturas
  |
  v
STEP 6: SALVAR NAS SECOES DO teoria.md
```

---

## Step 1: Identificar Gaps

Sage olha a pesquisa interna e identifica:

- Falta prova externa (estudo/dado)?
- Falta caso além dos pessoais do expert?
- Falta ângulo contra-intuitivo?
- Falta fato curioso forte?
- Falta autoridade externa pra reforçar crença?

Lista os gaps mentalmente.

---

## Step 2: Perguntar Fontes do Expert

```
Antes de eu sair pesquisando pública, deixa eu confirmar:

Voce tem alguma FONTE PROPRIA sobre esse tema que pode me passar?
- Livros que voce ja leu (mesmo se nao terminou)
- Transcricoes de palestras/podcasts que voce absorveu
- Anotacoes pessoais
- Artigos que voce salvou
- Cursos que voce fez

Manda os links ou descreve o que tem. Eu absorvo antes de ir
pra pesquisa publica.
```

Expert entrega o que tiver (pode ser nada — segue sem).

---

## Step 3: Pesquisa Pública Densa

Sage faz pesquisa em múltiplos canais:

**Posts/artigos:**
- Google Scholar pra papers científicos
- Medium / blogs especializados
- Sites de referência no nicho

**Livros:**
- Top livros do tema
- Foco em autores reconhecidos
- Em inglês se necessário

**Papers/estudos:**
- Estudos científicos relevantes
- Universidades top (Harvard, MIT, Yale, etc) se aplicável
- Dados estatísticos de instituições (Gallup, Pew, etc)

**Vídeos:**
- TED Talks relevantes
- Palestras de conferências
- YouTube de especialistas

**Conteúdo gringo:**
- SEMPRE pesquisar em inglês também
- Pode trazer ângulo único pro BR (antecipar tendência)

**Princípio:** densa, não superficial. 30+ minutos de pesquisa pra um post.

---

## Step 4: Engenharia Reversa de Virais

Sage busca 5-15 virais relevantes ao TEMA específico.

**Onde:**
- IG/TikTok/YT por keyword do tema
- Foco em criadores PEQUENOS com hit grande (mostra força do tema)

**O que faz:**
1. Identifica o viral (canal + título/hook + alcance)
2. **Transcreve se necessário** (vídeos vão pra texto)
3. Analisa:
   - Qual ângulo usaram?
   - Qual hook funcionou?
   - Quais argumentos/fatos citaram?
   - Quais pontos ressoaram (alta interação)?
   - Qual estrutura de roteiro?

**Importante:** NUNCA copia texto. Engenharia reversa = extrair PADRÕES, não copiar.

---

## Step 5: Extrair Padrões

Sage sintetiza os virais analisados:

```
PADROES IDENTIFICADOS NA ENGENHARIA REVERSA:

ANGULOS RECORRENTES:
- {angulo 1} aparece em {N} virais
- {angulo 2}

HOOKS QUE FUNCIONAM PRO TEMA:
- Estrutura: "{padrão de hook}"
- Gatilho dominante: {qual dos 7}

ARGUMENTOS/FATOS MAIS CITADOS:
- {fato/dado 1}
- {estudio 2}

PONTOS QUE RESSOARAM (alta interação):
- {ponto 1}
- {ponto 2}

ESTRUTURAS DE ROTEIRO COMUNS:
- {estrutura A}: aparece em {N}
- {estrutura B}: aparece em {N}
```

---

## Step 6: Salvar nas Seções

Atualiza `teoria.md` com:

```markdown
## Pesquisa Externa

### Posts/Artigos Consultados
- {fonte 1 + link}
- {fonte 2 + link}

### Livros / Capítulos Relevantes
- {livro 1, autor, capítulo}

### Papers / Estudos
- {paper 1 + link}
- {dado/estatística + fonte}

### Vídeos / Palestras
- {TED talk + link}
- {palestra + link}

### Conteúdo Gringo
- {fonte em inglês + link + por que relevante}

## Engenharia Reversa de Virais Relevantes

### Virais Analisados
1. **{Canal X}** ({seguidores}) — "{título/hook}" — {alcance} views
   - Ângulo: {qual}
   - Hook: "{frase}"
   - Argumento central: {qual}
   - Estrutura: {qual}

2. **{Canal Y}** — ...

[5-15 virais]

### Padrões Extraídos
[síntese do Step 5]

## Fontes Consultadas
[lista completa com links]
```

---

## Veto Conditions

| Condição | Ação |
|----------|------|
| Expert quer copiar texto direto de um viral | "Não copio. Engenharia reversa = padrão, não cópia." |
| Pesquisa pública não rendeu (poucas fontes) | Avisar: "Material escasso. Vou trabalhar mais com pesquisa interna + virais relevantes." |
| Expert quer pular engenharia reversa | "Virais carregam validação do público. Estudar é repertório. Aplicação é única." |

---

**Task Status:** Ready for Production
