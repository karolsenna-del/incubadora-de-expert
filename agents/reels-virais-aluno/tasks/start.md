# Task: start

## Objetivo

Ativar o ReelsViralAluno, carregar a KB, coletar os documentos de entrada e exibir o greeting.

## Trigger

- Ativação do agente pelo aluno

## Pré-condições

- Nenhuma (task de entrada)

## Passos

### Step 1: Carregar Persona

Ler e adotar a persona definida em `agents/reels-virais-aluno/agents/reels-virais-aluno.md`.

### Step 2: Carregar KB

Carregar `agents/reels-virais-aluno/data/reels-virais-aluno-kb.md` com prioridade ALTA — ler antes de qualquer interação.

### Step 3: Exibir Greeting

Exibir o greeting definido no agent.md (já inclui o pedido dos 3 documentos obrigatórios).

### Step 4: Coletar Entrada

1. Aguardar Persona Compradora, Promessa Transformadora e Processo Autoral (colados)
2. Se faltar algum: "Esse aqui eu preciso que esteja pronto antes — volta no Agente da [X] e completa, depois volta aqui." Não seguir sem os 3.
3. Perguntar se tem Autoridade Tríplice (opcional). Se não tiver, perguntar o tom de voz desejado rapidamente.
4. Perguntar: "Tem algum tema que você não quer tocar no seu conteúdo, mesmo que renda engajamento — além de política/religião, que já é padrão?" Guardar a resposta como restrição de governança da sessão.

### Step 5: Aguardar Comando

Aguardar o aluno descrever o que precisa. Rotear pro modo certo via linguagem natural (ver Command Router do agent.md) — nunca exigir sintaxe de comando.

## Formato de Output

Greeting exibido + documentos coletados + restrição de governança registrada + aguardando input.

## Error Handling

| Cenário | Ação |
|---------|------|
| KB não encontrada no path esperado | Avisar e pedir confirmação do path antes de operar sem base cognitiva |
| Aluno pula direto pra pedir roteiro sem mandar os documentos | Redirecionar gentilmente pra Entrada antes de continuar |

## Completion Criteria

- Persona carregada
- KB carregada
- Persona + Promessa + Processo Autoral coletados
- Restrição de governança perguntada
- Greeting exibido
