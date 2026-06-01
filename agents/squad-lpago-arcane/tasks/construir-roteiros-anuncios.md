---
task: "Construir Roteiros de Anuncios"
responsavel: "@anuncios"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "briefing-pagina.md COM COPY REDIGIDA + documento-mestre.md aprovado"
Saida: "roteiros-anuncios.md (3-6 pecas com copy + direcao criativa + direcao de edicao por peca)"
Checklist:
  - "Trava de PU-LP-007 verificada: pagina TEM copy redigida (nao apenas briefing)"
  - "Mix de anuncios definido (3-6 pecas com tipos variados)"
  - "Para cada peca: Hook (3s) -> Interesse -> Oportunidade -> CTA"
  - "Hook explicitamente desenhado pra Hook Rate >30% (RC-008) — testado em voz alta"
  - "Promessa do anuncio coerente com headline da pagina (RC-006: testar headlines NOS criativos)"
  - "Anuncio sustenta publico frio (RC-004: se funciona pro frio, funciona pro quente)"
  - "Direcao criativa: cenario, vestuario, energia, ritmo"
  - "Direcao de edicao: cortes, legendas, B-roll, transicoes, trilha"
  - "Validacao contra RC-004, RC-006, RC-008, RC-009, RC-010, RC-011"
  - "Sem mencao de data no anuncio (regra REPERTORIO: 'NUNCA fala data')"
  - "Mecanismo aparece na peca (RC-003)"
  - "Sem 'Ola pessoal, tudo bem' ou abertura tipica de infoprodutor"
  - "Roteiros aprovados EXPLICITAMENTE pelo usuario"
execution_type: "interactive"
---

# Task: Construir Roteiros de Anuncios

## Executive Summary

Pipeline pra produzir mix de 3-6 roteiros de anuncio (copy + direcao criativa + direcao de edicao). PU-LP-007 trava forte: SO destrava se pagina tem COPY REDIGIDA aprovada. Sem isso, recusa.

## Pipeline

```
Pagina com COPY REDIGIDA aprovada + Doc mestre
   |
   v
[Verificar trava PU-LP-007] -> Sim/Nao
   |
   v (Sim)
[Definir mix] -> tipos variados (3-6 pecas)
   |
   v
[Construir cada peca]
   |
   +-- Hook (3s)
   +-- Interesse (3-15s)
   +-- Oportunidade (15-45s)
   +-- CTA (final 5-10s)
   |
   v
[Direcao criativa por peca]
   |
   v
[Direcao de edicao por peca]
   |
   v
[Validacao RCs]
   |
   v
[Aprovacao explicita]
```

## Steps

### Step 1: Verificar Trava PU-LP-007

ANTES de qualquer coisa:

```
Antes de comecar, verificacao:

1. Pagina tem COPY REDIGIDA aprovada (texto final, nao briefing)?
2. Documento mestre aprovado?

Se SIM em ambos: vamos.
Se NAO em qualquer um: te devolvo pro agente competente.
```

Se NAO:
- Pagina sem copy: "Volta pro copy-pagina, fecha copy redigida primeiro."
- Doc mestre nao aprovado: "Volta pro estrategista-chief, fecha doc mestre."

Recusa avancar. Sem trava verde, anuncio fica desconectado da pagina.

### Step 2: Definir Mix de Pecas

Default pra primeiro lancamento: **5 pecas**, tipos variados.

| # | Tipo | Quando usar |
|---|------|-------------|
| 1 | Video direto da proposta | Sempre (peca-base) |
| 2 | Ruminacao | Sempre (identificacao forte) |
| 3 | Depoimento | Quando ha caso real disponivel |
| 4 | Comparativo | Nicho com muita concorrencia |
| 5 | Mecanismo tangivel | Quando mecanismo tem nome forte |
| 6 | Autoridade | Nicho B2B / high-ticket |

Adapta conforme contexto do doc mestre.

### Step 3: Construir Cada Peca

Para cada peca, estrutura universal:

**HOOK — 0-3s:**
- Frase que para o scroll
- Maximo 8-10 palavras
- Visual + audio coerentes
- Open caption animada

**INTERESSE — 3-15s:**
- Aprofunda curiosidade ou identificacao
- Sustenta atencao
- Cortes secos a cada 2-3s

**OPORTUNIDADE — 15-45s:**
- Apresenta mecanismo (RC-003)
- Promessa coerente com headline da pagina (RC-006)
- B-roll cobrindo dados especificos
- Energia subindo

**CTA — final 5-10s:**
- Acao especifica ("garante vaga em [pagina]")
- Sem mencao de data fixa
- Texto sobre + setinha pra link

### Step 4: Direcao Criativa Por Peca

- **Cenario:** onde grava? (home office natural, luz de janela > studio caro)
- **Vestuario:** estilo coerente com posicionamento (sem jaleco se cria distancia, sem traje formal se nicho casual)
- **Energia:** baixa (intima) / media (didatica) / alta (provocativa)
- **Ritmo:** lento (storytelling) / medio (didatico) / rapido (cortes secos)

### Step 5: Direcao de Edicao Por Peca

- **Cortes:** secos a cada N segundos? (mais cortes = mais retencao)
- **Legendas:** SEMPRE (acessibilidade + retencao)
- **Open caption:** primeira frase animada bem grande
- **B-roll:** % do tempo total + o que cobre
- **Trilha:** genero + volume relativo
- **SFX:** em transicoes-chave
- **Aspecto:** 9:16 (Reels/Stories) + 1:1 (feed)

### Step 6: Teste do Hook em Voz Alta

Para cada peca:
1. Le o hook em voz alta
2. Pergunta-se: "isso para o scroll?"
3. Se nao: refaz com gancho real (numero, ruminacao, indignacao, revelacao curta)
4. Se sim: registra no briefing com justificativa

### Step 7: Validacao RCs

Checklist por peca:
- [ ] RC-003: mecanismo aparece com nome
- [ ] RC-004: sustenta frio (alguem que NUNCA te viu entende?)
- [ ] RC-006: promessa bate com headline da pagina
- [ ] RC-008: Hook Rate projetado > 30%
- [ ] RC-009: nao mexe no que funciona (se ha pecas vencedoras de ciclo anterior)
- [ ] RC-011: pecas com Hook Rate < 30% sao mortas (cria nova, nao reanima)
- [ ] REPERTORIO: SEM mencao de data fixa
- [ ] Sem "Ola pessoal, tudo bem"
- [ ] CTA especifico (nao "saiba mais")

### Step 8: Aprovacao Explicita

```
Mix de {N} pecas fechado.

Cada peca: roteiro + direcao criativa + direcao de edicao.

Voce APROVA esse mix pra producao? Aprovacao significa: voce vai
gravar e editar (ou mandar gravar/editar) conforme. Apos isso,
sobe no Meta Ads.

(SIM / NAO + ajuste especifico por peca)
```

## Veto Conditions

- Pagina sem copy redigida aprovada → recusa total
- Hook nao para o scroll em 3s → refaz
- Anuncio menciona data fixa → recusa
- Anuncio nao sustenta frio → refaz
- Promessa diverge da headline da pagina → refaz
- "Ola pessoal, tudo bem" ou abertura tipica → refaz
- Mecanismo invisivel na peca → refaz
- Mix com pecas todas iguais (mesmo tipo) → recusa, exige variedade

## Output Esperado

Arquivo `roteiros-anuncios.md` com:
- Header (data, versao, mix definido + justificativa)
- Por peca:
  - Briefing (tipo, duracao alvo, publico alvo)
  - Roteiro completo (Hook + Interesse + Oportunidade + CTA)
  - Direcao criativa
  - Direcao de edicao
  - Justificativa do hook
  - Checklist RCs verde
- Linha de aprovacao

## Regras

- Verifica trava PU-LP-007 ANTES de comecar
- Mix vence peca unica
- Hook em 3s testado em voz alta
- Direcao criativa especifica (nao generica)
- Cita RC aplicada por peca
- SEM mencao de data
- Cenario natural > studio de guru
- Termina com proximo passo concreto
