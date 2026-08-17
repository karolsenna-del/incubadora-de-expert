# SOP — Entrega de Materiais da Mentoria pro Drive da Aluna

**Última atualização:** 01/07/2026
**Dono:** Karol
**Aplica a:** toda aluna em `mentoria/alunas/{aluna}/`

---

## O que resolve

Os materiais de cada aluna são criados e mantidos localmente em `mentoria/alunas/{aluna}/` (fonte da verdade, versionada). Mas a aluna não acessa essa pasta — ela usa a pasta dela no Google Drive. Sem esse SOP, um material pode ficar pronto localmente e nunca chegar até quem precisa dele (aconteceu com a Milena — roteiro pronto há dias, nunca copiado pro Drive dela).

---

## Estrutura de origem (local)

```
mentoria/alunas/{aluna-slug}/
├── 00- Anotações.md                      ← aluna-facing (encontros: gravação/transcrição + ideias da aluna)
├── 0- Biblioteca de IAs.md              ← aluna-facing
├── 0.1- Roteiro da Jornada.md           ← aluna-facing
├── M0.1 - {nome}.md ... M4.7 - {nome}.md ← aluna-facing (entregáveis dos módulos)
├── sessões/                              ← aluna-facing (notas de sessão, se houver)
└── _mentor/                              ← PRIVADO. NUNCA vai pro Drive da aluna
    ├── perfil.md
    ├── negocio.md
    ├── contexto.md
    ├── roteiro.md      (versão de bastidor, com notas de coaching)
    └── cadastro.md     (dados contratuais, financeiros, tem o path do Drive dela)
```

**Regra:** tudo que está fora de `_mentor/` é potencialmente aluna-facing. Tudo dentro de `_mentor/` é privado da Karol e nunca é copiado.

---

## Destino (Google Drive da aluna)

O Google Drive Desktop está montado localmente — a pasta da aluna é um caminho normal do sistema, tipo:

```
G:\Meu Drive\CLIENTES\{Nome da Aluna}\Incubadora de Expert {ano}\
```

O path exato de cada aluna fica registrado em `_mentor/cadastro.md`, campo **"Pasta no Drive"**. Copiar um arquivo pra essa pasta sincroniza automaticamente pro Google Drive — não precisa de nenhuma ferramenta especial, é cópia de arquivo local.

---

## Convenção de nomenclatura (local → Drive)

| Local (repo) | Drive (entregue) | Formato |
|---|---|---|
| `00- Anotações.md` | `00) Anotações.docx` | .docx |
| `M0.1 - Minha Lista de Fracassos.md` | `M0.1) Minha Lista de Fracassos.docx` | .docx |
| `0- Biblioteca de IAs.md` | `0) Biblioteca de IAs.docx` | .docx |
| `0.1- Roteiro da Jornada.md` | `0.1) Roteiro da Jornada.xlsx` | **.xlsx** |

Local usa `número - nome` (espaço-hífen-espaço). Drive usa `número) nome` (parêntese) — é o padrão que já existia nas pastas de outras alunas (Analía, Bruno, etc). Manter esse padrão ao entregar.

**Exceção importante — o Roteiro da Jornada (`0.1`) é sempre .xlsx, nunca .docx.** Ele tem uma coluna de Status por entregável que a aluna precisa marcar/atualizar conforme avança (Pendente / Em andamento / Concluído). Em .docx isso não é editável de forma prática — a aluna não consegue "marcar" status num Word. Em .xlsx vira dropdown clicável. Todos os outros documentos (Biblioteca de IAs, M0.1-M4.7) são conteúdo pra ler/preencher texto — .docx serve bem.

**Exceção — o Anotações (`00-`) não sincroniza de volta pro repo.** Diferente dos outros, é um documento vivo: você registra os encontros (gravação/transcrição) e a aluna escreve ideias direto no Drive, sessão após sessão. Entrega uma vez (esqueleto vazio) e a partir daí o Drive é a fonte — você abre ele direto de lá antes de cada sessão, não precisa puxar de volta pro repo. Só valeria puxar de volta se algum agente precisasse ler esse histórico pra preparar sessão automaticamente.

---

## Passo a passo

### 1. Identificar o que precisa ser entregue
Comparar o que existe em `mentoria/alunas/{aluna}/` (fora de `_mentor/`) com o que já está na pasta dela no Drive. Qualquer arquivo novo ou atualizado que ainda não foi copiado é candidato à entrega.

### 2. Verificar conflito de nomenclatura
Alunas antigas (pré-Expert360) podem ter arquivos com numeração diferente na pasta do Drive (ex: um "M0.1" antigo que não é o mesmo conteúdo do "M0.1" novo). **Nunca sobrescrever ou apagar nada sem confirmar com a Karol antes** — ela pode preferir manter o material antigo em uso.

### 3. Converter .md → .docx (ou .xlsx pro Roteiro)

Não existe Google Docs/Sheets nativo gerado por script — a conversão é pra `.docx`/`.xlsx` (formato Word/Excel), que o Google Drive sincroniza e abre normalmente (inclusive como Google Doc/Sheet, se a aluna escolher abrir assim).

**Pra Biblioteca de IAs e M0.1-M4.7 (conteúdo pra ler/preencher texto):**
Script: `business/processos/scripts/converter-md-para-docx.py` (usa `python-docx`; se não estiver instalado: `python -m pip install python-docx`).

```bash
python business/processos/scripts/converter-md-para-docx.py "{arquivo-origem.md}" "{destino-na-pasta-do-drive.docx}"
```

Suporta: headers, tabelas, listas, negrito/itálico, blockquotes, linhas horizontais.

**Pra Roteiro da Jornada (0.1 — precisa de status editável):**
Script: `business/processos/scripts/converter-roteiro-para-xlsx.py` (usa `openpyxl`; se não estiver instalado: `python -m pip install openpyxl`).

```bash
python business/processos/scripts/converter-roteiro-para-xlsx.py "{roteiro-origem.md}" "{destino-na-pasta-do-drive.xlsx}"
```

Gera 2 abas: "Onde Estou" (tabela de entregáveis com Status em dropdown — Pendente/Em andamento/Concluído) e "Cronograma" (mês a mês, com a sessão-marco de cada um). Espera a estrutura padrão do `0.1- Roteiro da Jornada.md` (seção `### Entregáveis por módulo` com tabela, seção `## Cronograma` com `### Mês N — Título` + bullets + linha `★`).

### 4. Copiar pro Drive
O destino do script já pode ser direto o caminho dentro de `G:\Meu Drive\...\` — não tem passo de "cópia" separado, o script já escreve lá.

### 5. Registrar a entrega
Adicionar uma linha em `_mentor/cadastro.md`, seção "Notas de acompanhamento", com a data e o que foi entregue. Isso evita reentregar o mesmo material por engano numa sessão futura.

---

## O que NUNCA fazer

- Copiar `_mentor/` pro Drive da aluna (informação privada da Karol — perfil de coaching, notas internas)
- Apagar arquivo existente no Drive da aluna sem perguntar antes (pode já estar em uso, preenchido, ou ser referência que a Karol quer manter)
- Assumir que todo módulo listado localmente deve ser usado — a Karol pode pular exercícios específicos por aluna (ex: "Lista de Fracassos" não é usado com todas)

---

## Entrega da Biblioteca de Templates (caso especial — não é aluna-facing numerado)

Diferente dos entregáveis M0.1-M4.7 (que são individuais por módulo), a **Biblioteca de Templates** (10 ferramentas genéricas do Expert360º — checklist, diagnóstico, roteiro, scripts, planilhas, planner, worksheet, mapa, calculadora, template de conteúdo) é um pacote único que se repete igual pra toda aluna.

**Fonte (repo, markdown):** `business/campanhas/expert360-curso/biblioteca-templates/` — 11 `.md` + 4 `.csv`, source of truth.

**Master pronto pra entregar (Drive):** pasta `Biblioteca de Templates` dentro de `Materiais/` — 16 itens: 7 `.docx` + 4 `.xlsx` (com fórmula já calculando) + 4 Google Docs (texto explicativo de diagnóstico/rastreador/planner/calculadora) + capa. Sempre que o repo mudar, atualizar esse master primeiro.

**Regra obrigatória: sempre entrega como SUBPASTA, nunca arquivo solto.**
1. Criar uma pasta `Biblioteca de Templates` dentro da pasta da aluna no Drive (`create_file` com `mimeType` de pasta).
2. Copiar (`copy_file`) os 16 itens do master pra dentro dessa subpasta nova — cada arquivo com `parentId` = id da subpasta.
3. Nunca soltar os arquivos direto na raiz da pasta da aluna, misturados com M0.1-M4.7 — isso vira bagunça (aconteceu com a Milena em 17/08, corrigido no mesmo dia).

**Incidente (17/08/2026):** primeira entrega pra Milena foi feita com os 16 arquivos soltos na raiz da pasta dela, misturados com os outros entregáveis. Corrigido no mesmo dia: criada a subpasta e todos os itens movidos pra dentro (via `update_file` trocando o `parentId`). Regra da subpasta obrigatória nasceu dessa correção.

---

## Caso de referência

Aplicado pela primeira vez em 01/07/2026 pra Milena Gehrke — 20 arquivos aluna-facing convertidos e entregues em `G:\Meu Drive\CLIENTES\Milena Gehrke\Incubadora de Expert 2026\`. Dois arquivos antigos (`M0.1) Minha história real.gdoc`, `M0.2) Meu Ikigai.gdoc`) já estavam preenchidos e a Karol optou por mantê-los em uso — não foram apagados, coexistem com os novos. O exercício "Lista de Fracassos" (M0.1 novo) não será usado com essa aluna.

Correção no mesmo dia: o Roteiro da Jornada foi entregue primeiro como `.docx`, mas a Karol não conseguia alterar o status dos entregáveis nesse formato — reconvertido pra `.xlsx` com dropdown de status. A regra "Roteiro é sempre .xlsx" (ver seção de nomenclatura acima) nasceu dessa correção.
