# Quando Revisitar a Base (Formatos + Pool de Temas)

**Aplicação:** Vox usa pra orientar expert quando algo estagna.
**Princípio:** base é pontual mas não imutável. Revisita quando sinais aparecem.

---

## Sinais Pra Revisitar a Base

### Sinal 1 — Formatos Estagnaram

**O que é:** 3+ posts seguidos com performance abaixo da média histórica.

**Causa provável:**
- Audiência cansou do formato
- Mercado saturou
- Algoritmo mudou (raro mas acontece)

**Ação:** revisitar Passo 1 — testar novos formatos.

### Sinal 2 — Pool de Temas Esvaziou

**O que é:** Iris apresentando candidatos repetidos OU expert disse "já produzi todos".

**Causa provável:**
- Pool estava pequeno (15-20 temas só pra 6 meses de cadência alta)
- Pool desatualizado (virais novos não foram incorporados)

**Ação:** revisitar Passo 2 — re-pesquisar pool com novos virais.

### Sinal 3 — Mudança de Nicho/Posicionamento

**O que é:** expert mudou:
- Público-alvo
- Produto principal
- Visão de mundo
- Identidade da marca

**Causa:** mudança estratégica do expert.

**Ação:** REFAZER setup inicial completo. Base anterior pode estar incompatível.

### Sinal 4 — Cadência de 3-6 Meses (Manutenção)

**O que é:** simplesmente tempo passou desde último setup.

**Causa:** virais mudam, tendências evoluem.

**Ação:** rodada de manutenção — atualizar pool, revisar formatos top.

---

## Como Revisitar (Não Necessariamente Refazer Tudo)

### Cenário A — Atualização Cirurgica

Quando sinais 2 ou 4 (pool desatualizado ou manutenção periódica):

Iris faz:
1. Lê base-inicial.md atual
2. Pesquisa novos virais no nicho desde última atualização
3. Adiciona novos temas ao pool
4. Marca temas obsoletos (que saturaram)
5. Sinaliza novos temas quentes emergentes

**Tempo:** 15-30 min.

**Output:** base-inicial.md atualizado (não substituído).

### Cenário B — Revisão De Formato

Quando sinal 1 (formatos estagnaram):

Iris faz:
1. Analisa quais formatos performaram pior
2. Discute com expert se troca ou ajusta
3. Pode adicionar formato novo pra 20% testando (lapidação)
4. Mantém formato campeão se ainda funciona

**Tempo:** 15-20 min.

**Output:** seção FORMATOS atualizada.

### Cenário C — Refazer Setup Completo

Quando sinal 3 (mudança estratégica) ou sinais 1+2 combinados:

Roda workflow `setup-inicial` inteiro de novo.

**Tempo:** 30-50 min.

**Output:** novo base-inicial.md (versionado pra preservar histórico).

---

## Como Vox Detecta

Vox monitora durante o uso:

- Aria reporta posts seguidos com performance baixa → Vox sugere revisita
- Iris reporta pool esvaziando → Vox sugere atualização
- Expert menciona mudança de nicho → Vox sugere refazer setup
- Tempo desde último setup > 3 meses → Vox sugere manutenção

Sugestão tipo:

```
Vejo que teus últimos 3 posts performaram abaixo do esperado.

Pode ser:
1. Formato estagnou (audiência cansou)
2. Tema/categoria perdeu força
3. Algo no roteiro ou produção

Quer que a Iris revisite a base (formatos + pool)? 30 min e
você tem cardápio novo.
```

---

## Versionamento

Quando refaz setup completo (Cenário C), preservar versão anterior:

```
docs/producao-conteudo/{expert}/
├── base-inicial.md              (atual — Cenário C novo)
├── base-inicial-v1-2026-05.md   (versão anterior arquivada)
└── ...
```

Permite voltar se nova base não funcionar.

---

## Princípio

> Base é PONTUAL mas não IMUTÁVEL.

Pontual = não roda toda semana. Roda quando precisa.

Não imutável = atualiza conforme sinais aparecem. Quem não atualiza estagna.

**Cadência saudável de revisita:**
- Atualização cirurgica do pool: a cada 1-2 meses
- Revisão de formato: a cada 3-6 meses (ou quando estagnar)
- Refazer setup completo: 1x por ano (ou em mudança estratégica)

---

## Aplicação no Squad

- **Vox** detecta sinais e sugere revisita
- **Iris** executa atualização/revisão/refazer
- **Aria** sinaliza estagnação via análise de performance
