# Project Tracker Protocol — Regra para Todos os Agentes

## Quando Esta Regra se Aplica

Esta regra se aplica sempre que um agente trabalha em algo relacionado a um projeto listado no cockpit (`business/cockpit.md`).

## Protocolo Obrigatorio

### ANTES de trabalhar

1. **Ler o tracker do projeto** (path no cockpit) — entender onde estamos, quais tarefas sao suas, o que esta bloqueado
2. **Verificar dependencias** — se sua tarefa depende de outra que nao esta Done, nao comece (registre como blocker)
3. **Identificar sua tarefa** — saber exatamente o que precisa fazer antes de comecar

### DURANTE o trabalho

4. **Focar no escopo** — fazer o que o tracker define, nao mais, nao menos
5. **Se encontrar blocker novo** — registrar imediatamente no tracker (secao BLOCKERS)

### DEPOIS de trabalhar

6. **Atualizar o tracker** — marcar tarefas como Done + data, atualizar status
7. **Adicionar entrada no LOG** — uma linha: data — agente: o que fez
8. **Se desbloqueou outra tarefa** — isso fica visivel automaticamente pela mudanca de status da dependencia
9. **Se completou a ultima tarefa da fase** — atualizar a fase para Done e indicar proxima fase

### SE nao existe tracker

- Se o projeto esta no cockpit mas nao tem tracker: avisar o Euriler ("Projeto X nao tem tracker. Quer que eu crie?")
- Se o trabalho nao esta relacionado a nenhum projeto do cockpit: trabalhar normalmente sem tracker

## O que NAO fazer

- NAO criar tracker sem o projeto estar no cockpit
- NAO alterar tarefas de outros agentes (so atualizar as suas)
- NAO remover entradas do log (log e append-only)
- NAO mudar o objetivo ou fases do projeto (so o Euriler/Jarvis fazem isso)

## Formato do LOG

```
- DD/MM — @nome-agente: descricao curta do que foi feito
```

Exemplo:
```
- 16/03 — @tech-ops: Configurou UTMs na LP final
- 15/03 — @design: Entregou criativos lote 2 (9 pecas)
```
