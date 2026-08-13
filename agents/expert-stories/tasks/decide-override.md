---
task: "Decide Override"
responsavel: "@expert-stories"
atomic_layer: "task"
entrada: "Karol conta que rolou algo fora do roteiro do dia"
saida: "Decisão registrada (substituiu ou somou) + Story escrito se aplicável"
execution_type: "interactive"
---

# Task: Decide Override — Camada de Adaptação ao Dia

## Objetivo

Decidir junto com a Karol se um evento fora do roteiro (algo bom que aconteceu, novidade,
insight) substitui o Story planejado do dia ou soma como Story extra. **Essa regra ainda não
é fixa** — cada caso é decidido em conversa até acumular padrão suficiente pra virar regra
formal (ver `rotina-stories-formatos.md`, decisão de 12/08).

## Passos

### Step 1: Ouvir o Que Rolou

Deixar a Karol contar sem interromper. Não assumir que é sempre "substitui" nem sempre "soma".

### Step 2: Contextualizar Contra o Story Planejado do Dia

Lembrar qual era o Story planejado pra hoje (formato + se já foi escrito). Perguntar (ou
julgar com ela) o que faz mais sentido:

1. **Substitui** — o que rolou é mais forte/relevante que o planejado
2. **Soma** — os dois cabem no dia, sem prejudicar um ou outro
3. **Guarda pra depois** — bom demais pra hoje, mas não urgente, vira candidato de override
   de outro dia ou até formato do catálogo rotativo (ex: virar "Cantinho do Pensamento" numa
   próxima Quarta)

### Step 3: Escrever o Story (se decidiu produzir agora)

Mesmas regras de `generate-story.md`: tom da Karol, sem inventar número, verificar se precisa
de imagem gerada (🟢/🟡) ou é conteúdo real dela (🔴 — quase sempre é, já que overrides
nascem de algo que aconteceu de verdade).

### Step 4: Registrar a Decisão

Sempre registrar no Mission Log, mesmo que pareça óbvio:

```
[DATA] — OVERRIDE
O que rolou: [resumo]
Story planejado do dia: [formato]
Decisão: [substituiu / somou / guardou pra depois]
Por quê: [raciocínio da Karol ou combinado]
```

### Step 5: Checar Padrão Acumulado

Se esse é o 3º+ override com a mesma lógica (ex: sempre que rola venda fechada, sempre
substitui), sinalizar à Karol:

```
Isso já é a 3ª vez que [padrão]. Quer que eu vire isso regra fixa em
rotina-stories-formatos.md, ou ainda prefere decidir caso a caso?
```

Se ela topar, atualizar a seção "Override do dia" do documento — Consult (nível 3), nunca
decide sozinho.

## Veto Conditions

| Condição | Ação |
|---|---|
| Karol não tem certeza se o que rolou vale Story | Perguntar: "isso é o tipo de coisa que você contaria pra uma amiga hoje?" — ajuda a calibrar |
| Padrão de override contradiz um já registrado | Mostrar os dois casos, perguntar o que mudou |
