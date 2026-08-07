---
task: "Weekly Sync — Meet Recordings para Hotmart"
responsavel: "@course-publisher"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Nenhuma — dispara sozinha via agendamento (Ops)"
Saida: "Aulas novas publicadas na Hotmart + Mission Log atualizado + state atualizado"
execution_type: "autonomous"
---

# Task: Weekly Sync — Meet Recordings → Hotmart

## Objetivo

Rodar sem intervenção da Karol: verificar se houve gravação nova de Live Expert360 (quarta-feira)
ou Encontro Incubadora / Mentoria em Grupo (segunda-feira) na pasta Drive "Meet Recordings",
e subir cada uma pro módulo certo dentro do produto Hotmart "Combo Incubadora" (id 5163418, aba Adicional).

Esta task é disparada por agendamento (cron/Task Scheduler configurado pelo Ops), não por pedido
direto da Karol numa conversa. **Ela roda sozinha — REGRA-015 se aplica: nunca travar esperando
resposta humana.**

## Protocolo

### 1. Ler estado anterior

Ler `agents/course-publisher/data/weekly-sync-state.yaml`. Contém, por série:
- `ultimo_processado_titulo`: título exato do arquivo Drive já processado
- `ultimo_processado_data`: data (createdTime) do último processado
- `proximo_numero` (só Live): próximo número sequencial a usar

### 2. Buscar gravações novas no Drive

**Duas raízes possíveis** (desde 05/08/2026, ver missão #12 no Mission Log):

1. Pasta clássica `1eZySH6OIAsGasoHAZB9XxII0Gx686qQi` ("Meet Recordings") — também recebe
   gravações de outras reuniões da Karol (mentorias 1:1 tipo "Milena", "Simone e Mavi", "David"
   etc.) que NÃO são desta automação. Filtrar SEMPRE por prefixo exato do título:

```
parentId = '1eZySH6OIAsGasoHAZB9XxII0Gx686qQi'
and mimeType = 'video/mp4'
and createdTime > '{ultimo_processado_data}'
and (title contains 'Live Expert360 -' or title contains 'Encontro Incubadora -')
```

2. Pasta nova `1mlJbXrY5rLxcobA9PTztLcX0NnMXr17L` ("Google Meet") — o Meet passou a criar aqui
   uma subpasta por série recorrente (`{Série} (recurring)`), ex: "Live Expert360 (recurring)"
   (`1GGeLSKWDPiKT-GNic7GeKyDIU4A8asAv`). Buscar por subpastas com esse padrão de nome dentro
   dela e repetir a mesma busca por `mimeType = 'video/mp4' and createdTime > '{ultimo_processado_data}'`
   dentro de cada uma encontrada. Se aparecer uma pasta "Encontro Incubadora (recurring)" pela
   primeira vez, ela provavelmente **não estará compartilhada** com `karol.franzini@gmail.com`
   ainda — tentar baixar, e se der 403, registrar como pendência pedindo pra Karol compartilhar
   (mesma solução já usada antes), não travar a missão inteira por isso.

Ignorar qualquer arquivo de vídeo que não comece exatamente com um desses dois prefixos, em
qualquer uma das raízes. Causa da mudança de pasta ainda não confirmada (mudança no convite
recorrente do Calendar ou comportamento novo do Workspace) — manter vigiando as duas raízes até
ficar claro que uma delas parou de receber gravações novas.

### 3. Para cada gravação nova (ordem cronológica)

**3a. Juntar partes, se houver.**
Se existir também um arquivo com sufixo " - Recording 2" do mesmo horário/reunião: baixar ambos e
juntar com `ffmpeg -f concat -safe 0 -c copy` antes de seguir (ver missão #4 no Mission Log pro
comando exato). Usar paths estilo `C:/Users/...` (não `/c/...`) no arquivo de lista do ffmpeg.

**3b. Determinar série pelo prefixo do título:**

- **"Live Expert360 - ..."** → série Live Expert360
  1. Número = `proximo_numero` do state.
  2. Buscar o roteiro correspondente em `business/campanhas/lives-semanais/live-{numero}-*.md`
     (padrão de nome varia: `-roteiro.md`, `-outline.md`; pegar o que tiver o conteúdo do roteiro).
  3. Extrair o título real da live do conteúdo do roteiro (não do nome do arquivo — ver como os
     títulos das Lives 16-23 foram extraídos na missão #6 do Mission Log).
  4. **Se não achar roteiro correspondente:** NÃO inventar título, NÃO subir essa aula. Registrar
     como pendência no relatório final ("Live {N} sem roteiro encontrado — aguardando Karol
     escrever/indicar o roteiro") e seguir para a próxima gravação.
  5. Nome final na Hotmart: `{N} - {Título}` (mesmo padrão das Lives 13 em diante — espaço antes
     do traço).

- **"Encontro Incubadora - ..."** → série Mentoria em Grupo
  1. Data = extrair do título do arquivo (`YYYY/MM/DD`), formatar como `DD.MM.AA`.
  2. Tema = ler o documento irmão "{mesmo prefixo e data} - Anotações do Gemini" (mesma pasta,
     mesmo horário) via `mcp__claude_ai_Google_Drive__read_file_content` ou
     `download_file_content`, e resumir o assunto principal da sessão num tema curto (2-6
     palavras), no mesmo estilo dos títulos já aprovados pela Karol (ex: "Definição da Persona
     (Rosiani)", "Estruturação do Método (Rosiani)").
  3. **Se não existir Anotações do Gemini pra essa gravação:** NÃO inventar tema. Registrar como
     pendência ("Encontro de {data} sem Anotações do Gemini — precisa Karol indicar o tema") e
     seguir para a próxima.
  4. Nome final na Hotmart: `DD.MM.AA - {Tema}`.

**3c. Verificar sessão Hotmart (REGRA-013).**
Testar sessão ativa do navegador antes de tentar login com senha do vault (ver nota em
`data/vault.yaml` — a senha salva está desatualizada, o login real é via sessão já autenticada).

**3d. Upload.**
Seguir SOP-002 do Playbook (upload de aula), adaptado: módulo = "Live Expert360" ou "Mentoria em
Grupo" dentro de `combo_incubadora_url` (vault.yaml). REGRA-002 (título limpo), REGRA-003 (produto
certo), REGRA-009 (timeout generoso, nunca cancelar upload em andamento).

**3e. Atualizar state IMEDIATAMENTE após cada upload bem-sucedido** (não esperar o fim do lote) —
se a missão for interrompida no meio, o que já subiu não pode ser re-processado na próxima rodada.

### 4. Ao final: relatório + Mission Log

Mesmo formato de sempre (REGRA-010, REGRA-011). Se rodou sem nenhuma gravação nova: registrar
"nenhuma gravação nova encontrada" — ainda assim é uma execução válida da task, não uma falha.

Se ficou alguma pendência (roteiro faltando, tema não identificado, sessão Hotmart expirada e sem
fallback): listar claramente no relatório. **Não é erro fatal da missão — sobe o que dá, documenta
o que não deu, e para por aí.** A Karol resolve a pendência na próxima vez que abrir o sistema.

### 5. Notificar a Karol (REGRA-016)

Ela pediu explicitamente pra ser avisada quando essa missão rodar. Como é execução headless (sem
ninguém olhando o terminal), o único jeito dela saber é notificação — chamar `PushNotification` como
ÚLTIMO passo, sempre, independente do resultado:

- Subiu aula(s): `"Course Publisher: subiu {N} aula(s) nova(s) — {lista curta, ex: Live 24, Encontro 03.08}"`
- Nada novo encontrado: `"Course Publisher: rodou hoje, nenhuma gravação nova pra subir"`
- Ficou pendência: `"Course Publisher: {N} pendência(s) — {resumo curto, ex: Live 24 sem roteiro}"`
- Erro impediu a missão de rodar: `"Course Publisher: weekly-sync falhou — {motivo curto}"`

Mensagem sempre curta (< 200 caracteres), sem markdown, liderando com o que importa (quantidade e o
que é), igual aos exemplos acima.

## PDSA

Mesma estrutura do `execute-mission.md`. Adicionalmente: se o padrão de nome do Drive mudar (ex.
Karol renomear a recorrência do Meet), ou se aparecer uma terceira série de reunião recorrente
usando o mesmo prefixo por engano, registrar e ajustar o filtro do Passo 2.
