# 03 — Dicionário de correções (nomes próprios)

Como configurar `data/nomes-proprios.yaml` pro whisper acertar SEUS nomes.

## Por que existe

O whisper-cli é genérico — não conhece seu nome, sua marca, seu produto. Pra ele, "Euriler" vira "Reeler" e "Bia" vira "Biá". Sem correção, suas legendas saem com nomes errados.

Solução em 2 camadas:

1. **`--prompt` no whisper** — alimenta os nomes corretos como contexto. O whisper se torna mais propenso a acertar (ele "viu" o nome antes)
2. **Dicionário de correção automática** — varredura pós-transcrição que substitui erros conhecidos

## Estrutura do `nomes-proprios.yaml`

```yaml
nomes_corretos:        # vai pro --prompt do whisper
  - "Seu Nome"
  - "Sua Marca"
  - "Seu Produto"
  - "Termos técnicos do seu nicho"

correcoes_automaticas: # varredura pós-transcrição
  - errado: "como whisper transcreve"
    correto: "como deveria ser"

correcoes_ortografia:  # acentos comuns que whisper esquece
  - errado: "Negocio"
    correto: "Negócio"
```

## Como preencher (passo a passo)

### 1. Liste TODOS os nomes próprios

Pense em tudo que vocês menciona repetidamente nos vídeos:

- Seu nome (e variações — apelido, sobrenome)
- Pessoas da equipe que você cita ("manda mensagem pra Bia", "a Maria do suporte")
- Marca, produto, programa, mentoria
- Workshop, evento, lançamento
- Termos técnicos específicos do seu nicho (siglas, conceitos próprios)
- Cidades / lugares que você cita

### 2. Edite seu primeiro video

Roda o pipeline com `nomes_corretos` populado. Olha o transcript bruto:

- Se "Seu Nome" virou "Sue Nome" → adiciona em `correcoes_automaticas`
- Se "Sua Marca" virou "Soa Marca" → adiciona em `correcoes_automaticas`

### 3. Refine com o tempo

A cada novo video, se aparecer um erro recorrente, adiciona ao dicionário. Em 3-5 videos, dicionário fica robusto.

## Exemplo (Euriler — case de referência)

```yaml
nomes_corretos:
  - "Euriler"
  - "Bia"
  - "Workshop Negocio Digital do Futuro"
  - "Arka"
  - "NDF"
  - "inteligencia artificial"

correcoes_automaticas:
  - errado: "Reeler"
    correto: "Euriler"
  - errado: "Eu Reeler"
    correto: "Euriler"
  - errado: "Biá"
    correto: "Bia"

correcoes_ortografia:
  - errado: "Negocio"
    correto: "Negócio"
```

## O que NÃO colocar

- **Frases inteiras** — só nomes/termos curtos (1-3 palavras)
- **Palavras comuns mal acentuadas que mudam significado** (ex: "está" vs "esta") — o @scribe revisa essas na main thread
- **Termos que mudam de vídeo pra vídeo** — só os recorrentes

## Como o @scribe usa

Na revisão (passo 3 do pipeline):

1. Lê o transcript bruto do whisper
2. Aplica `correcoes_automaticas` → varre o texto e substitui
3. Aplica `correcoes_ortografia` → mesma coisa
4. Lê linha por linha procurando outras inconsistências (acento, concordância)
5. Salva como `*_transcript_revisado.txt`

A revisão automática (1-3) é mecânica. A revisão de leitura (4) é onde o agent "pensa" — pra isso ele usa Opus na main thread.
