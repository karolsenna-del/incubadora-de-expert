# Sistema de Memoria Inteligente — Auroq OS

> Como o sistema lembra, persiste e consolida informacao. Nao e sobre arquivos — e sobre QUANDO, O QUE e ONDE salvar.

---

## Por que existe

IA sem memoria e amnesia. Cada sessao comeca do zero. Autocompact apaga contexto. Troca de agente perde informacao. O expert nao pode ser responsavel por lembrar de tudo — o sistema lembra por ele.

---

## Arquitetura de 3 Camadas

```
CAMADA 1 — MEMORIA DE SESSAO (efemera)
  Onde: na conversa ativa
  Sobrevive: dentro da sessao
  Morre: no autocompact se nao salva
  Acao: salvar em doc de trabalho ou data/ antes de perder

CAMADA 2 — MEMORIA OPERACIONAL (curto/medio prazo)
  Onde: agents/companion/data/
  Sobrevive: entre sessoes
  Atualizado: toda sessao significativa
  Consolidado: weekly review

CAMADA 3 — MEMORIA PERMANENTE (longo prazo — Exocortex)
  Onde: docs/knowledge/ + business/processos/
  Sobrevive: pra sempre
  Atualizado: quando conhecimento e tratado ou processo e documentado
  Cresce: via ETL, SOPs, vivencia documentada
```

### Mapa de Arquivos por Camada

**Camada 2 — Memoria Operacional:**

| Arquivo | Conteudo | Frequencia de atualizacao |
|---------|---------|--------------------------|
| `contexto-dinamico.md` | Onde estamos AGORA. Estado da empresa, sessao, foco atual | Toda sessao (no boot e no encerramento) |
| `log-decisoes.md` | Decisoes tomadas + racional + contexto. Append-only | Quando decisao e tomada |
| `demandas-backlog.md` | Ideias, pendencias, tarefas futuras | Quando surge ideia. Processado no weekly |
| `padroes-observados.md` | Meta-cognicao. Padroes recorrentes no expert e no sistema | Quando Companion detecta padrao |

**Camada 3 — Memoria Permanente:**

| Local | Conteudo | Quando muda |
|-------|---------|-------------|
| `expert-mind/` | Identidade, valores, tom, historia | Raramente (quando expert evolui) |
| `expert-business/` | Posicionamento, publico, metodologia | Quando negocio evolui |
| `biblioteca-pmi/` | Conhecimento tratado (ETL) | Quando novo conhecimento e processado |
| `business/processos/` | SOPs documentados | Quando processo e pavimentado |
| `business/cockpit.md` | Estado dos projetos | Toda sessao (via project protocol) |

---

## 6 Triggers de Salvamento

### Trigger 1: Decisao Tomada
**Detecta:** Expert decidiu algo significativo (estrategia, preco, foco, cancelamento, prioridade)
**Acao:** Agente ativo pergunta: "Registro essa decisao no log?"
**Formato:**
```markdown
## [DATA] — [TITULO]
**Contexto:** [o que tava acontecendo]
**Decisao:** [o que foi decidido]
**Racional:** [por que]
**Impacto:** [o que muda]
```
**Destino:** `agents/companion/data/log-decisoes.md`

### Trigger 2: Projeto Progrediu
**Detecta:** Tarefa de projeto concluida, fase avancou, blocker resolvido
**Acao:** Agente ativo atualiza tracker (conforme project-tracker protocol)
**Destino:** `business/campanhas/{projeto}/tracker.md`

### Trigger 3: Conhecimento Criado
**Detecta:** Expert ou agente produziu documento, framework, analise, processo novo
**Acao:** Agente ativo pergunta: "Salvo na biblioteca? Onde faz mais sentido?"
**Destino:** `docs/knowledge/` (subpasta adequada) ou `business/processos/`

### Trigger 4: Padrao Detectado
**Detecta:** Companion percebe comportamento recorrente (positivo ou negativo)
**Exemplos:** "Expert sempre adia decisoes de preco", "Lancamentos que comecam na segunda performam melhor", "Expert produz mais de manha"
**Acao:** Companion registra sem perguntar (meta-cognicao silenciosa)
**Formato:**
```markdown
## [PADRAO]
**Observado em:** [quando/contexto]
**Frequencia:** [quantas vezes]
**Descricao:** [o que acontece]
**Recomendacao:** [o que fazer quando esse padrao aparece]
```
**Destino:** `agents/companion/data/padroes-observados.md`

### Trigger 5: Sessao Encerrando
**Detecta:** Expert pede commit final ou indica que vai fechar
**Acao:** Ops verifica (via commit inteligente):
- contexto-dinamico reflete onde paramos?
- trackers dos projetos ativos atualizados?
- decisoes nao registradas?
**Destino:** `contexto-dinamico.md` + trackers

### Trigger 6: Autocompact Iminente
**Detecta:** Sessao longa, muitos tokens consumidos
**Acao:** Agente ativo salva estado IMEDIATAMENTE:
- Criar/atualizar documento de trabalho com tudo que importa
- Atualizar contexto-dinamico se nao fez ainda
**Destino:** Doc de trabalho + `contexto-dinamico.md`

---

## Regra de Ouro

**"Na duvida, salva."**

E mais barato salvar informacao que nao vai usar do que perder informacao que precisava. 1 minuto salvando = horas poupadas no futuro.

---

## Consolidacao

Memoria se move das camadas inferiores pras superiores:

### No Commit (toda sessao significativa)
- contexto-dinamico atualizado com estado atual
- Trackers atualizados
- Decisoes logadas

### No Weekly Review (semanal)
- Inbox processado (ideias → fila ou descarte)
- Cockpit validado
- Padroes revisados — algum padrao virou regra?
- Log-decisoes revisado — alguma decisao precisa virar processo?

### Quando Acumula
- log-decisoes com 20+ entradas → Companion sugere extrair padroes
- padroes-observados com padrao confirmado 3+ vezes → vira recomendacao ativa
- Processo feito 3+ vezes → vira SOP em business/processos/

---

## Anti-Padroes de Memoria

| Anti-padrao | Por que e ruim |
|-------------|---------------|
| Nao salvar decisoes | Repete mesmos debates, perde racional |
| contexto-dinamico desatualizado | Companion abre sessao com info velha |
| Salvar tudo sem criterio | Poluicao — ninguem (nem IA) le tudo |
| Nunca consolidar | Memoria operacional incha, perde utilidade |
| Depender da conversa | Autocompact apaga, troca de sessao perde |
| Expert responsavel por lembrar | Derrota o proposito do sistema |

---

*Sistema de Memoria v1.0.0 — Auroq OS*
