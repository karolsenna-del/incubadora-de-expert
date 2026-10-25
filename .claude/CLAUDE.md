# Auroq OS

Sistema operacional de IA para o negócio do aluno. Ele pede, confere e aprova; a IA executa.

As regras de base de toda conversa estão no `AGENTS.md` da raiz da pasta, o mesmo arquivo que o Codex
e o Grok leem. Ele entra aqui pela linha abaixo:

@../AGENTS.md

## Só no Claude Code

- As regras de `.claude/rules/` carregam sozinhas. `.claude/rules/custom-do-aluno.md` vale acima de todas.
- O estilo de resposta é o Direto (`.claude/output-styles/direto.md`).
- Agentes pelo comando: `/auroq-companion`, `/auroq-consultor` e as forjas `/auroq-squad-forge`,
  `/auroq-mind-forge`, `/auroq-worker-forge`, `/auroq-clone-forge`, `/auroq-etlmaker`. O aluno não
  precisa usar nenhum: falar o que quer basta, e o Companion cuida do resto (inclusive do técnico).
