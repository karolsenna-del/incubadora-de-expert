---
task: "Start"
responsavel: "@chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativacao do squad pelo expert via /auroq-squad-edicao-arcane"
Saida: "Roteamento pra workflow correto (instalar / pipeline-edicao / diagnosticar)"
execution_type: "interactive"
---

# Task: Start — Entry point do Squad Edicao Arcane

Ativado quando o expert chama `/auroq-squad-edicao-arcane` ou fala "edita esse video".

## Greeting

```
=== SQUAD EDICAO ARCANE · v1.0.1 ===
Agente Auroq | Criado por Euriler Jubé
Usado por ele e pela Mentoria Arcane

Squad que pega seu video bruto e devolve pronto pra Reels:
corte por fala → 1.2x → zoom dinamico → legenda → trilha de fundo.

O que vai ser?

1. Editar um video (default — me passa o path)
2. Instalar / atualizar dependencias (1a vez ou se deu erro)
3. Diagnosticar (algo nao roda — checa o que falta)
4. Cortar so a fala (sem speed nem legenda — pra usar em outro editor)

Pode falar livre: "edita esse video: /Users/expert/Movies/X.mov"
```

## Regras do greeting

- Curto — 1 frase do que o squad faz + 4 opcoes
- NAO explica pipeline inteiro (quem chega com video quer editar, nao palestra)
- NAO lista todos os agentes
- NAO lista todas as skills/scripts
- Termina com convite a falar livre

## Roteamento

### Opcao 1 — Editar video (mais comum)

1. Coletar path do video (perguntar se nao veio junto)
2. **Sempre passar pelo @installer primeiro** (doctor) — bloqueia se ambiente quebrado
3. Se doctor PASS: handoff cascata @installer → @cutter → @scribe → @zoomer → @finisher → @chief (entrega)
4. Executar workflow `pipeline-edicao.md`

### Opcao 2 — Instalar

- Handoff direto pra @installer
- Executa `tasks/instalar.md`

### Opcao 3 — Diagnosticar

- Handoff direto pra @installer
- Executa `tasks/diagnosticar.md` (so doctor, nao instala)

### Opcao 4 — Cortar so

- Handoff direto pra @cutter (apos doctor PASS)
- Skip @scribe e @finisher

## Veto conditions

| Condicao | Acao |
|---|---|
| Expert nao tem video bruto | "Esse squad e pra video bruto talking-head. Voce ja tem o arquivo?" |
| Path nao existe | "Nao encontrei o arquivo. Confere o caminho?" |
| Video < 30s | "Video muito curto pra ter ganho real com corte de fala. Vai render <10s. Quer mesmo?" |
| Video > 30min | "Video longo — pipeline vai demorar 10-20min. Tudo bem?" |
| Doctor FAIL | Bloqueia, manda pra @installer |
| Pipeline ja rodando | "Tem um video em edicao agora. Termina esse primeiro ou aborta?" |

## Handoff inicial (toda edicao)

```yaml
handoff:
  from: chief
  to: installer
  context:
    video_path: "{path}"
    intent: "editar"
  instruction: "Roda doctor. Se PASS, passa pra @cutter. Se FAIL, conserta antes."
```
