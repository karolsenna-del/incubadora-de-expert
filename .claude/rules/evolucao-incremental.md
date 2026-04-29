# Evolucao Incremental — Rules

> Constitution Art. VI: Nunca do zero. REUSE > ADAPT > CREATE.

## Hierarquia de Verificacao

Antes de criar QUALQUER artefato (documento, agente, processo, template):

### Gate 1: REUSE — Ja existe?
- Buscar no Exocortex (docs/knowledge/)
- Buscar nos squads instalados (agents/)
- Buscar nos processos documentados (business/processos/)
- Buscar nos templates de campanha (business/campanhas/_template/)

SE encontrou algo que resolve → USAR direto. Nao recriar.

### Gate 2: ADAPT — Existe algo parecido?
- Buscar por artefato similar que pode ser adaptado
- Template que pode ser preenchido
- KB de dominio adjacente que pode ser reutilizada
- Processo de outra campanha que pode ser copiado

SE encontrou algo parecido → ADAPTAR. Nao criar do zero.

### Gate 3: CREATE — Nao existe nada?
- So agora criar do zero
- Ao criar: documentar para futuro reuso
- Usar templates padrao quando disponiveis

## Aplicacoes Praticas

| Situacao | REUSE | ADAPT | CREATE |
|----------|-------|-------|--------|
| Nova campanha | Copiar _template/ | Ajustar campanha anterior | So se for modelo novo |
| Novo processo | Verificar se ja tem SOP | Adaptar SOP similar | Documentar apos fazer |
| Novo agente | Verificar se ja existe squad/worker | Adaptar agente existente | Criar via Meta Squad adequado (/squad-forge, /mind-forge, /worker-forge, /clone-forge) |
| Novo documento | Verificar biblioteca-pmi/ | Adaptar doc existente | Criar e adicionar a biblioteca |

## Regra de Ouro

**Cada artefato criado deve ser reusavel.** Se criou um processo, documente como SOP. Se criou um template, coloque em _template/. Se criou um documento, adicione a biblioteca.

O sistema fica mais rico a cada uso — nao mais poluido.
