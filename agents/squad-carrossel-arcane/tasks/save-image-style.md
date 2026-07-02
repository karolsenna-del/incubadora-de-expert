---
task: "Save Image Style"
responsavel: "@image-director"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Estilo novo calibrado OU aprendizados de uma sessao de producao"
Saida: "Template de estilo criado/atualizado em image-styles/{nome}/ (style.md + examples.md + meta.yaml)"
Checklist:
  - "Os 3 arquivos (meta.yaml, style.md, examples.md) existem e sao consistentes"
  - "examples.md tem os exemplos da sessao (texto -> prompt -> resultado)"
  - "style.md cobre Regra de Ouro, vibe, emocoes, simbolos, specs, o que evitar"
  - "Autocontido (sem refs a paths privados do repo)"
  - "Versao bumpada (se atualizacao)"
execution_type: "interactive"
---

# Task: Save Image Style

## Executive Summary

Cristaliza um estilo de imagem como **template reutilizavel** — ou cria um novo (apos calibracao do zero), ou atualiza um existente com os aprendizados de uma sessao de producao (requisito do fluxo: o template fica vivo e melhora a cada uso).

Objetivo central: o template tem que ser tao completo que **qualquer sessao nova reproduza a mesma performance** — o conhecimento vive no template, nao na conversa.

---

## Onde salva

- **Templates embarcados (do squad, distribuidos):** `knowledge/image-styles/{nome}/`
- **Templates do usuario (runtime, locais):** `~/.carrossel-arcane/image-styles/{nome}/`

Cada template tem 3 arquivos:

| Arquivo | Conteudo |
|---------|----------|
| `meta.yaml` | id, nome, autor, provider default, modelo, aspect ratio, versao, ponteiros |
| `style.md` | Regras + direcao visual + vibe + Regra de Ouro + paleta emocional + simbolos + specs + o que evitar |
| `examples.md` | Exemplos calibrados: texto do card → prompt exato → resultado (few-shot pro agente) |

---

## Modo 1: Criar template novo (apos calibracao do zero)

### Step 1: Coletar a essencia
A partir da calibracao aprovada, destilar:
- Vibe/tom, emocoes-alvo, nivel de ousadia/polarizacao
- Simbolos/recursos tipicos (rostos famosos, marcas, satira)
- Specs tecnicas (modelo, aspect, realismo)
- O que evitar

### Step 2: Escrever os 3 arquivos
Gerar `meta.yaml`, `style.md`, `examples.md` com as 3 piloto aprovadas como primeiros exemplos.

### Step 3: Confirmar nome e salvar
```
Salvo o template '{nome}'. Da proxima vez e so pedir esse estilo que eu reproduzo igual.
```

---

## Modo 2: Cristalizar/atualizar template existente (apos producao)

### Step 1: Coletar aprendizados da sessao
- Exemplos que funcionaram: texto do card → prompt aprovado → nota do resultado
- Correcoes de direcao que o usuario pediu (ex.: "mais escuro", "robo consistente")
- Novos simbolos/padroes validados
- Quantas iteracoes cada card levou (sinaliza o que e dificil)

### Step 2: Append nos arquivos (nao reescrever do zero)
- `examples.md`: adicionar os novos pares texto→prompt→resultado
- `style.md`: ajustar/adicionar regras se a sessao revelou algo novo
- `meta.yaml`: bump da versao do template

### Step 3: Confirmar
```
Atualizei o template '{nome}' (v{X} → v{X+1}) com {N} exemplos novos e {M} ajustes de direcao.
Proxima producao ja comeca desse nivel.
```

---

## Principio de reprodutibilidade

O template e considerado bom quando um agente em sessao NOVA, lendo so o template + a metodologia (`imagens-padrao-euriler.md`), produz no mesmo nivel da sessao que o gerou. Se faltar algo pra isso, faltou no template — completar.

Sinais de template incompleto: regra aplicada "de cabeca" que nao esta escrita; exemplo de sucesso nao registrado; direcao visual implicita. Tudo que move a qualidade tem que estar no documento.

---

## Quality Gates

- Os 3 arquivos existem e sao consistentes entre si
- `examples.md` tem pelo menos os exemplos da sessao (texto→prompt→resultado)
- `style.md` cobre: Regra de Ouro, vibe, emocoes, simbolos, specs, o que evitar
- Autocontido — sem refs a paths privados do repo (REGRA AUTOCONTIDO)
- Versao bumpada (se atualizacao)

## Veto Conditions

| Cenario | Acao |
|---------|------|
| Atualizacao reduziria qualidade do template | Rejeitar; manter o que ja funciona |
| Exemplo com dado nao verificado | Marcar como "narrativa do autor — confirmar fonte" |
| Template referencia path privado | Bloquear (autocontido) — embutir o conteudo |

---

**Task Status:** Ready for Production
