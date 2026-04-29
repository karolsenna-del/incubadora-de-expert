---
task: "Discover Needs"
responsavel: "@worker-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Descricao inicial do usuario sobre o worker desejado"
Saida: "Discovery summary completo: dominio, duties, ferramentas, autonomia, metricas"
Checklist:
  - "Proposito do worker claro"
  - "Atividades/duties listadas"
  - "Ferramentas/plataformas identificadas"
  - "Nivel de autonomia definido"
  - "Criterios de entrega claros"
  - "Gaps resolvidos ou registrados"
execution_type: "interactive"
---

# Task: Discover Needs — Discovery Profundo

## Objetivo

Captar TUDO que a pessoa pensa e precisa do worker. Mesmo se chegar confusa, ajudar a entender o que realmente precisa. Sair com um discovery summary claro o suficiente pra alimentar Role Design e Knowledge Build.

## Posicao no Workflow

Fase 0 do pipeline. Gate: QG-WF-001.

## Protocolo

### Abordagem

NAO e questionario. E conversa guiada. O Chief usa 5 lentes mas nao segue ordem rigida — adapta ao que o usuario traz.

### As 5 Lentes do Discovery

**D1: Proposito**
- "Esse worker existe pra resolver qual problema?"
- "O que muda na sua vida se ele existir?"
- "Que dor ele elimina?"

**D2: Atividades**
- "O que ele faz no dia-a-dia? Me lista tudo que vier na cabeca."
- "Das atividades que voce faz hoje, quais quer passar pra ele?"
- "Tem atividade que ele vai fazer que voce NUNCA fez? (nova)"

**D3: Ferramentas**
- "Quais plataformas e sistemas ele vai precisar usar?"
- "Tem alguma ferramenta que voce usa hoje que ele precisa dominar?"
- "Tem ferramenta nova que voce quer comecar a usar e ele seria o responsavel?"

**D4: Autonomia**
- "Ate onde ele decide sozinho sem te perguntar?"
- "O que ele NUNCA deve fazer sem sua aprovacao?"
- "Em que situacao ele deve te chamar?"

**D5: Entrega**
- "Como voce sabe que ele fez bem feito?"
- "O que e 'missao completa' pra voce?"
- "Tem alguma metrica que importa? (velocidade, qualidade, custo)"

### Tecnicas de Clarificacao

**Quando usuario e vago:**
- "Voce disse 'mexe em tudo'. Me da 3 exemplos concretos do que seria 'tudo'."
- "Pensa na ultima semana. Que tarefa voce fez que queria ter delegado?"

**Quando usuario confunde worker com consultor:**
- "Isso que voce ta descrevendo — voce quer alguem que TE ENSINE a fazer ou que FACA por voce?"
- Se ensinar: sugerir Mind Forge

**Quando escopo parece grande demais:**
- "Isso ta parecendo 2 workers diferentes. Vamos separar?"
- Propor decomposicao por area de responsabilidade

**Quando usuario nao sabe responder autonomia:**
- "Vou te dar cenarios. Me diz se ele faz sozinho ou te pergunta primeiro."
- Listar 5 cenarios concretos do dominio e pedir classificacao

### Consolidacao

Apos explorar as 5 lentes, consolidar em Discovery Summary:

```yaml
discovery_summary:
  worker_name: "{nome}"
  worker_slug: "{slug}"
  purpose: "{por que existe}"
  domain: "{area de atuacao}"
  duties:
    - name: "{atividade 1}"
      effort_pct: XX
    - name: "{atividade 2}"
      effort_pct: XX
  tools:
    - name: "{ferramenta 1}"
      usage: "{como usa}"
    - name: "{ferramenta 2}"
      usage: "{como usa}"
  autonomy_signals:
    - decision: "{tipo de decisao}"
      level: "{alto|medio|baixo}"
  success_criteria:
    - "{criterio 1}"
    - "{criterio 2}"
  internal_sources:
    - "{path de processo existente}"
  gaps:
    - "{duvida nao resolvida}"
```

### Step: Gerar WORKER-PRD

Apos consolidar o discovery_summary e ANTES de apresentar ao usuario, gerar o documento formal de requisitos:

Criar arquivo `agents/worker-forge/output/{slug}/WORKER-PRD.md`:

```markdown
# WORKER-PRD — {Worker Name}

## 1. Identidade
- **Nome:** {worker_name}
- **Slug:** {worker_slug}
- **Proposito:** {por que existe — extraido de D1}
- **Dominio:** {area de atuacao}

## 2. Duties (Responsabilidades)

| # | Duty | Esforco (%) | Criterio de Aceite |
|---|------|-------------|---------------------|
| 1 | {duty da D2} | XX% | {como saber que fez bem} |
| 2 | {duty da D2} | XX% | {como saber que fez bem} |
| ... | | | |

## 3. Ferramentas Requeridas

| Ferramenta | Uso Previsto | Nivel Minimo |
|------------|-------------|--------------|
| {tool da D3} | {como usa} | {basico/intermediario/avancado} |

## 4. Autonomia (Delegation Map Resumido)

| Tipo de Decisao | Nivel Appelo | Em Linguagem Simples |
|-----------------|-------------|----------------------|
| {decisao da D4} | {1-7} | {traducao} |

## 5. Metricas de Sucesso
- {criterio da D5}
- {criterio da D5}

## 6. Restricoes
- **NAO faz:** {lista}
- **Boundaries:** {lista}

## 7. Fontes Internas
- {paths de processos/docs existentes encontrados na coleta interna}

## 8. Gaps Conhecidos
- {duvidas nao resolvidas durante a Discovery}
```

**Regras:**
- Cada campo vem DIRETAMENTE do discovery_summary — zero invencao
- Se discovery_summary nao tem info pra uma secao, marcar como "A definir na Fase 1 (Research)"
- Criterios de aceite na Secao 2 sao OBRIGATORIOS — se a Discovery nao capturou, perguntar ao usuario agora
- O PRD e apresentado ao usuario JUNTO com o discovery_summary na Confirmacao

### Confirmacao

Apresentar resumo pro usuario:

```
Entendi. Deixa eu confirmar:

Worker: {nome}
Proposito: {1-2 frases}
Faz: {lista de duties}
Usa: {lista de ferramentas}
Decide sozinho: {o que}
Te pergunta: {o que}
Bem feito = {criterios}

Gerei tambem o WORKER-PRD com os requisitos formais. Ele sera a fonte de verdade pra validacao no final.

Isso bate?
```

Se usuario confirmar: QG-WF-001 passed. Handoff pra Fase 1 via protocolo do Chief.
Se usuario corrigir: integrar correcoes, re-confirmar.

### Handoff de Saida

Entregar ao Chief que repassa ao @knowledge-curator com:
- worker_name, worker_slug, domain
- Lista de ferramentas identificadas
- Fontes internas relevantes
- Discovery summary completo
- worker_prd_path

## Quality Gate: QG-WF-001

| Criterio | Obrigatorio |
|----------|-------------|
| Proposito claro | Sim |
| >=3 duties listadas | Sim |
| >=1 ferramenta identificada | Sim |
| Autonomia minimamente definida | Sim |
| >=1 criterio de sucesso | Sim |
| Dominio nao ambiguo | Sim |

**Veto:** Proposito vago ("faz tudo"), zero ferramentas, zero criterio de sucesso.

## Error Handling

| Cenario | Acao |
|---------|------|
| Usuario confuso | Usar cenarios concretos, exemplos da ultima semana |
| Escopo gigante | Propor decomposicao em 2+ workers |
| Parece consultor | Sugerir Mind Forge |
| Usuario cansa | Pausar. "Retomamos. Ja tenho bastante pra comecar." |
