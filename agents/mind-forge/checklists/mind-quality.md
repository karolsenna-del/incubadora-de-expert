# Checklist: Mind Quality (QG-MF-004)

## KB

- [ ] Organizada por DOMINIO (nao por fonte/expert)
- [ ] >= 300 linhas
- [ ] Secao de principios universais presente
- [ ] >= 2 frameworks completos (nome + passos)
- [ ] >= 10 heuristicas em formato SE/ENTAO
- [ ] Caixa de ferramentas (situacao → acao)
- [ ] Heuristicas mestras (top 15-20)
- [ ] Output examples (>= 1 por modo principal)
- [ ] Visao geral (tabela de experts ou overview da metodologia)

## Agent

- [ ] Secao IDENTIDADE completa (proposito, dominio, voice DNA, frases)
- [ ] >= 2 modos operacionais com protocolo e formato de output
- [ ] Principios inegociaveis (5-10)
- [ ] Immune system com >= 3 triggers e respostas automaticas
- [ ] STRICT RULES: >= 5 NUNCAs
- [ ] STRICT RULES: >= 5 SEMPREs
- [ ] Greeting texto de ativacao
- [ ] Command router (comandos + linguagem natural)
- [ ] Referencia a KB com path correto

## Tasks

- [ ] start.md presente (carrega agent + KB + exibe greeting)
- [ ] >= 1 task por modo operacional
- [ ] Cada task tem: objetivo, trigger, passos, formato de output

## Config & Skill

- [ ] config.yaml com name, version, type: single-mind
- [ ] config.yaml lista agents e tasks corretos
- [ ] skill.md aponta pro agent correto

## Trinity Check (por dominio)

Para CADA dominio na KB, verificar:
- [ ] Pelo menos 1 FRAMEWORK (como fazer — passos/componentes)
- [ ] Pelo menos 1 HEURISTIC (quando fazer — regra SE/ENTAO)
- [ ] Pelo menos 1 EXAMPLE (caso concreto que ancora)

Se algum dominio tem framework sem exemplo ou heuristica sem framework, o dominio esta desequilibrado. Corrigir antes de aprovar.

## Veto Conditions

- Agent sem IDENTIDADE ou MODOS DE OPERACAO
- KB < 100 linhas
- Zero modos definidos
- Immune system ausente
- config.yaml ou skill.md ausente
- Algum dominio com 0/3 no Trinity Check (zero dos 3 tipos)
