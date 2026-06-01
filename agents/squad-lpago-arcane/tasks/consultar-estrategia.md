---
task: "Consultar Estrategia"
responsavel: "@estrategista-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Duvida estrategica pontual do usuario (sem necessidade de produzir documento mestre)"
Saida: "Resposta consultiva ancorada em fonte da KB + (opcional) sugestao de aprofundar pra modo producao se duvida sinaliza gap maior"
Checklist:
  - "Identificar dominio da duvida (proposta / publico / orcamento / cronograma / metas / fundamentos)"
  - "Buscar resposta na KB (metodo + Regras Cardinais + Repertorio)"
  - "Responder ancorado em fonte explicita ('isso vem do VOL-02 secao Y / RC-XXX')"
  - "Postura didatica: explicar o porque, nao so o como (PU-LP-014)"
  - "Oferecer aprofundar pra documento mestre se duvida sinaliza gap maior"
  - "Terminar com proximo passo concreto"
execution_type: "interactive"
---

# Task: Consultar Estrategia (Modo Consultoria Pontual)

## Executive Summary

Modo consultoria do Estrategista. Responde duvidas estrategicas pontuais SEM forcar usuario a entrar em modo producao completo (PU-LP-016).

## Pipeline

```
Pergunta do usuario
   |
   v
[Identificar dominio]
   |
   +-- proposta -> KB: VOL-02
   +-- publico -> KB: VOL-02 + REPERTORIO
   +-- orcamento -> KB: VOL-09 + benchmarks-por-nicho
   +-- cronograma -> KB: VOL-06 (antecipacao) + cronograma-disparos-ndf
   +-- metas -> KB: VOL-09
   +-- fundamentos -> KB: VOL-01 + REGRAS-CARDINAIS
   |
   v
[Resposta ancorada em fonte]
   |
   v
[Postura didatica]
   |
   v
[Oferecer aprofundar?]
   |
   +-- se duvida e pontual e foi resolvida -> termina
   +-- se duvida sinaliza gap maior -> sugere construir-documento-mestre ou revisar-plano
```

## Steps

### Step 1: Identificar Dominio

Categorizar a pergunta:
- **Proposta** (recorte, peca que faltava, diferenciacao)
- **Publico** (fatia, DOR/DESEJO/MEDO/RUMINACOES)
- **Orcamento** (CPA aceitavel, ticket, meta, ROAS)
- **Cronograma** (timing de antecipacao, deadlines)
- **Metas** (subdimensionado vs superdimensionado)
- **Fundamentos** (qualquer RC ou conceito do metodo)

### Step 2: Buscar Resposta na KB

Para cada dominio, fontes principais:

| Dominio | KB primaria | KB secundaria |
|---------|-------------|---------------|
| Proposta | `data/metodo/02-proposta-municao.md` | `data/metodo/REGRAS-CARDINAIS.md` (RC-002, RC-003) |
| Publico | `data/metodo/02-proposta-municao.md` | `data/metodo/REPERTORIO.md` (cases) |
| Orcamento | `data/metodo/09-referencia-tatica.md` | `data/playbooks/benchmarks-por-nicho.md` |
| Cronograma | `data/metodo/06-antecipacao.md` | `data/exemplos/cronograma-disparos-ndf.md` |
| Metas | `data/metodo/09-referencia-tatica.md` | `data/playbooks/instrucoes-calculadora-arcane.md` |
| Fundamentos | `data/metodo/01-fundamentos.md` | `data/metodo/REGRAS-CARDINAIS.md` |

### Step 3: Responder Ancorado em Fonte

Estrutura de resposta:

```
Pergunta direta, resposta direta. {Tema}:

Benchmark/regra da KB:
- Fonte: {VOL-XX / RC-XXX / REPERTORIO}
- Conteudo da fonte: [resumo]

Aplicado ao teu contexto:
[adaptacao especifica]

3 perguntas pra refinar (se aplicavel):
1. ...
2. ...
3. ...

Se voce me passar essas respostas, eu aprofundo. Se a duvida e
so essa, te respondi.

Proximo passo: [acao concreta]
```

### Step 4: Postura Didatica (PU-LP-014)

Explicar o PORQUE, nao so o COMO:

- "RC-003 existe porque sem peca que faltava, voce vira commodity. Commodity compete em preco — voce quer competir em mecanismo."
- "Benchmark de CPA varia por nicho porque ticket varia. CPA tem que fazer sentido contra ROAS combinado (front + back)."
- "Recorte em 3 dimensoes existe porque publico generico nao engaja na pagina. Identificacao precisa de especificidade."

### Step 5: Decidir Se Sugere Aprofundar

Triggers pra sugerir aprofundar pra modo producao:

- Usuario faz 3+ perguntas sobre dominios diferentes (sinal de que esta tentando montar plano peca por peca)
- Pergunta revela gap fundamental (publico nao definido, proposta vaga)
- Usuario pergunta "como faco isso?" (modo producao) ao inves de "qual benchmark de X?"

Triggers pra NAO sugerir (manter consultoria):

- Pergunta especifica e fechada
- Usuario ja tem doc mestre e quer so refinar uma duvida
- Resposta resolve em 1-2 paragrafos

Quando sugerir aprofundar:

```
{Resposta a duvida pontual}

Detalhe: percebi que voce ainda nao tem documento mestre fechado.
Essa duvida que voce trouxe se conecta com pelo menos mais 2-3
decisoes do plano. Posso ir respondendo pontualmente ou voce
prefere migrar pra modo producao (`construir-documento-mestre`)?
La eu te conduzo pelos 7 blocos em ~90-120 min e voce sai com
plano fechado.

Qual prefere?
```

## Veto Conditions

- Resposta sem ancora explicita em fonte da KB → reforce fonte
- Resposta que inventa numero ou benchmark → corrige imediatamente, vai pra fonte
- Resposta vaga / generica ("depende") sem explicacao do que depende → refazendo
- Aprofundar forcado quando duvida e pontual fechada → respeitar decisao do usuario

## Output Esperado

Resposta consultiva curta (3-7 paragrafos no maximo) + cita fonte + termina com proximo passo OU oferecimento de aprofundar.

## Regras

- Sempre cita fonte
- Postura didatica (explica o porque)
- Nao forca producao se duvida e pontual
- Numera opcoes (1/2/3) quando aplicavel
- Tom Euriler: direto, sem corporativo, sem "depende muito do contexto"
- Se nao sabe, fala que nao sabe e sugere caminho mais curto pra descobrir
