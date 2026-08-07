# Publicador de GPT — Foundation KB (rascunho da Fase 1)

> Pesquisado por @knowledge-curator (Worker Forge). Alimenta a KB final do worker `gpt-publisher`.

---

## 1. Contexto do Negócio

A Incubadora de Expert forja mentes sintéticas e consultores no formato Mind Forge (`agents/{slug}/agent.md` + `config.yaml` + `data/{slug}-kb.md` + `tasks/`) pra rodar dentro do Auroq OS via Claude Code. Parte dessas mentes precisa também ficar disponível fora do Auroq — hoje isso é feito publicando um Custom GPT no ChatGPT, pra que as alunas do Expert360 usem sem precisar de acesso ao repositório.

Hoje existem 6 Custom GPTs publicados manualmente (Persona Compradora, Promessa Transformadora, Processo Autoral, Portfólio Estratégico, Proposta Validada, Autoridade Tríplice — ver `mentoria/alunas/_template/0- Biblioteca de IAs.md`). O piloto deste worker é o ExpertViral (`agents/expert-viral/`), mente síntética Afonso+Rafael+Clara pra conteúdo viral.

---

## 2. Plataformas e Ferramentas

### 2.1 ChatGPT Custom GPT (GPT Builder)

**O que é:** Editor da OpenAI pra criar "GPTs" — versões customizadas do ChatGPT com Instructions, arquivos de Knowledge (RAG) e conversation starters próprios. Acessado em chatgpt.com, área "GPTs" → "Create" (builder conversacional) ou "Configure" (edição direta dos campos).

**Features core:**
- **Instructions:** campo de texto que define persona, regras e comportamento. **Limite: 8.000 caracteres.** O editor não deixa salvar acima disso. (Importante: isso é diferente do campo "Custom Instructions" da personalização geral do ChatGPT, que tem limite de 5.000 caracteres pra contas pagas desde jul/2026 — são dois campos diferentes, não confundir.)
- **Knowledge files:** upload de arquivos pro GPT consultar via retrieval (RAG). **Limite: até 20 arquivos por GPT.** Cada arquivo até 512MB e até 2.000.000 tokens (limite de tokens não se aplica a planilhas). Formatos suportados: `.txt`, `.pdf`, `.docx`, `.csv`, `.json`, `.md`, `.pptx`, `.xlsx`. Existe rate limit de upload (~80 arquivos/3h) e cap de storage (25GB/usuário, 100GB/org) compartilhado com Projects e outros chats.
- **Conversation starters:** prompts de exemplo exibidos quando o usuário abre o GPT. O builder sugere defaults com base nas Instructions, mas podem ser definidos manualmente (até 4 costumam aparecer na tela inicial).
- **Compartilhamento/publicação:** botão "Share" no editor. Opções: privado (só você), pessoas específicas, workspace (contas Team/Enterprise), **link — "qualquer pessoa com o link"** (o modo usado pelos 6 GPTs atuais das alunas), ou publicado no GPT Store (exige categoria e revisão de política — não é o caso de uso aqui).

**API:** **Não existe API pública oficial pra criar/editar Custom GPTs.** O GPT Builder só é acessível via interface web. Isso é o motivo estrutural pelo qual este worker precisa de automação de navegador (Playwright) em vez de chamadas de API — decisão já validada com a Karol no Discovery.

**Limites conhecidos:**
- Instructions ficam truncadas/rejeitadas acima de 8.000 caracteres — todo o trabalho de compactação da persona do Auroq precisa respeitar esse teto com folga (ver Decision Tree 6.1)
- Sem API = sem endpoint estável; qualquer automação via UI é sensível a mudanças de layout da OpenAI
- Conversation starters não têm limite documentado de caracteres muito alto — mantê-los curtos (uma linha, no estilo dos prompts de exemplo)

**Documentação oficial (Help Center, tier ouro — acesso direto bloqueado por 403 no momento da pesquisa, dados confirmados via múltiplas fontes cruzadas):**
- Creating and editing GPTs — https://help.openai.com/en/articles/8554397-creating-and-editing-gpts
- Sharing and publishing GPTs — https://help.openai.com/en/articles/8798878-sharing-and-publishing-gpts
- File uploads FAQ — https://help.openai.com/en/articles/8555545-file-uploads-faq
- GPTs in ChatGPT — https://help.openai.com/en/articles/8554407-gpts-in-chatgpt

### 2.2 Playwright (browser automation)

**O que é:** framework de automação de navegador já disponível no Auroq (MCP `playwright`/`playwright-firefox`). Usado aqui pra logar na sessão ChatGPT Plus já autenticada da Karol e operar o GPT Builder como um humano operaria (navegar, preencher campos, fazer upload, clicar em publicar).

**Uso previsto:** navegar até `chatgpt.com/gpts/editor` (ou fluxo equivalente a partir de "Meus GPTs"), preencher Instructions, subir arquivos de Knowledge, definir conversation starters, e publicar/atualizar — sempre depois da aprovação da Karol sobre o conteúdo compactado.

**Limites/riscos:**
- Depende de sessão já logada no navegador usado pelo Playwright — o worker não gerencia login/senha/2FA
- Seletores da UI podem mudar sem aviso (OpenAI atualiza o produto com frequência) — automação frágil por natureza, precisa de tratamento de erro que pare e avise em vez de tentar "adivinhar" um seletor que sumiu
- Uso automatizado de conta pessoal pode esbarrar em termos de uso da OpenAI dependendo do volume/frequência — mitigado aqui por ser uso de baixo volume (publicações pontuais, não scraping em massa) e sempre com aprovação humana no loop antes de cada ação de publicação

---

## 3. Integrações

### 3.1 Mind Forge (Auroq) <-> ChatGPT Custom GPT

**Método:** leitura de arquivos locais (Mind Forge) → transformação/compactação → automação de navegador (Playwright) no GPT Builder. Não há integração via API entre os dois lados.

**Padrão de fluxo:**
1. Ler `agents/{slug}/agent.md` (persona), `config.yaml` (metadados), `data/{slug}-kb.md` (KB), `tasks/*.md` (modos/procedimentos)
2. Compactar persona + regras essenciais → Instructions (≤ 8.000 chars, com folga de segurança — meta prática ~7.000 pra sobrar espaço de manutenção futura)
3. Levar o que não coube (KB completa, tasks detalhadas, exemplos longos) → 1 ou mais arquivos de Knowledge (dentro do limite de 20 arquivos / 512MB / 2M tokens cada)
4. Gerar conversation starters a partir dos triggers de cada task (ex: task `roteirizar.md` → starter "Quero roteirizar um vídeo sobre X")
5. Apresentar pacote compactado pra aprovação da Karol
6. Publicar/atualizar via Playwright, sessão ChatGPT Plus

**Cuidados:**
- Persona e KB do Auroq são escritas assumindo um agente rodando dentro do Claude Code, com acesso a ferramentas de arquivo, tasks nomeadas e comandos `*`. O Custom GPT não tem esse runtime — referências a comandos `*`, paths de arquivo do Auroq, ou nomes de tasks internas precisam ser traduzidas pra linguagem natural equivalente (o próprio princípio "Natural Language First" do Auroq já ajuda aqui, já que a persona não deveria depender de sintaxe de comando pra funcionar)
- KB do Auroq geralmente já é markdown — compatível nativamente com Knowledge files do GPT (`.md` suportado)

---

## 4. SOPs Existentes

Nenhum SOP prévio encontrado no Auroq pra esse processo — os 6 GPTs atuais foram montados manualmente na interface, sem procedimento documentado. Este worker é o primeiro a formalizar o processo. Não há Playbook anterior pra importar; o Playbook deste worker nasce vazio e cresce a partir da primeira missão real (publicação do ExpertViral).

**Referência de formato (não é SOP, é o padrão observado):** `mentoria/alunas/_template/0- Biblioteca de IAs.md` mostra como os links dos GPTs existentes são organizados e referenciados pras alunas — útil como referência de estilo do link final, mas o worker não edita esse arquivo (decisão do Discovery: distribuição do link é manual).

---

## 5. Decision Trees

### 5.1 O que vai pra Instructions vs. o que vai pra Knowledge file

```
A informação é necessária em TODA interação pra manter a persona/voz/regras core?
├── SIM → Instructions
│         (identidade, tom de voz, strict rules, boundaries, os 3-5 modos principais
│          resumidos em 1-2 linhas cada)
└── NÃO → a informação é consultada só em cenários específicos (procedimento detalhado
          de uma task, exemplos extensos, troubleshooting, glossário de termos)?
          ├── SIM → Knowledge file (o GPT puxa via retrieval quando o contexto pede)
          └── NÃO (é dado que muda com frequência, tipo config.yaml) → normalmente
                    NÃO entra no GPT — fica só como referência interna do Auroq
```

**Caso real do piloto (ExpertViral), medido nesta pesquisa:**

| Fonte | Tamanho |
|-------|---------|
| `agent.md` (persona completa) | ~11.050 caracteres |
| `config.yaml` | ~499 caracteres |
| `data/expert-viral-kb.md` | ~26.030 caracteres (393 linhas) |
| `tasks/*.md` (5 arquivos) | ~8.823 caracteres (243 linhas) |
| **Total bruto** | **~46.400 caracteres** |
| **Limite de Instructions** | **8.000 caracteres (~17% do total bruto)** |

Conclusão prática: a persona sozinha (11.050) já estoura o limite de Instructions — compactação é obrigatória mesmo sem contar KB e tasks. A KB inteira (26.030 chars) cabe folgada como 1 único Knowledge file (limite é 2M tokens ≈ milhões de caracteres). As 5 tasks (8.823 chars) também cabem como Knowledge file(s) separado(s) ou anexadas ao mesmo arquivo da KB — decisão de organização fica a critério do worker (autonomia nível 5, Advise).

### 5.2 Criar GPT novo vs. atualizar existente

```
Já existe um GPT publicado pra essa mente?
├── Não há registro em agents/{slug}/output/custom-gpt/gpt-id.md
│   → Provavelmente é criação nova, mas CONFIRMAR com a Karol antes (nível 3, Consult)
│     — evita duplicata caso o GPT tenha sido criado manualmente antes deste worker existir
└── Há registro com o link/ID do GPT
    → É atualização. Abrir o GPT existente no editor (não criar um novo) e sobrescrever
      Instructions/Knowledge/starters com a versão aprovada
```

---

## 6. Troubleshooting

| Problema | Causa provável | Solução |
|----------|----------------|---------|
| Instructions rejeitadas ao salvar | Passou de 8.000 caracteres | Cortar mais na compactação; mover trecho cortado pra um Knowledge file |
| GPT "esquece" regra que estava na KB | Informação em Knowledge file não foi puxada via retrieval no contexto da conversa | Regra comportamental crítica (não só factual) deve ficar nas Instructions, não só no Knowledge file — retrieval não é garantido a cada turno |
| Upload de Knowledge file falha | Arquivo acima de 512MB ou 2M tokens, ou mais de 20 arquivos já anexados | Particionar arquivo grande em partes menores por tema; remover arquivo redundante |
| Seletor do Playwright não encontra o campo esperado | OpenAI mudou o layout do GPT Builder | Parar a automação, tirar screenshot do estado atual, avisar a Karol (nível 3 — não tentar "chutar" um seletor alternativo sozinho) |
| Sessão ChatGPT não está logada quando a missão roda | Sessão expirou ou navegador do Playwright é uma instância limpa | Parar e avisar a Karol pra logar antes de tentar de novo — worker não gerencia credenciais |
| GPT publicado mas link não abre / dá erro de permissão | Configuração de compartilhamento ficou como "somente eu" em vez de "qualquer pessoa com o link" | Verificar campo de Share antes de considerar a missão concluída |

---

## 7. Glossário

- **GPT Builder:** editor da OpenAI (dentro do ChatGPT) pra criar Custom GPTs
- **Custom GPT / "GPT":** versão customizada do ChatGPT com Instructions, Knowledge e starters próprios
- **Instructions:** campo de texto (≤8.000 chars) que define persona e comportamento do GPT — equivalente ao `agent.md` compactado
- **Knowledge files:** arquivos anexados ao GPT que ele consulta via retrieval (RAG) — equivalente à KB (`data/{slug}-kb.md`) e tasks do Auroq
- **Conversation starters:** prompts de exemplo mostrados na tela inicial do GPT — derivados dos triggers das tasks
- **Retrieval:** mecanismo pelo qual o GPT busca trechos relevantes dos Knowledge files durante a conversa (não é "memória" garantida, é busca sob demanda)
- **GPT Store:** loja pública de GPTs da OpenAI — fora do escopo deste worker (publicação é sempre via link, não Store)
- **Mind Forge:** squad do Auroq que forja mentes sintéticas/consultores no formato que este worker consome como entrada

---

## 8. Gaps Registrados

```yaml
gaps:
  - tool: "ChatGPT GPT Builder"
    gap: "Fluxo exato de seletores/passos do Playwright (criar vs editar) não documentado — depende de navegação ao vivo"
    action: "Mapear na Fase 4 (Assembly), com uma rodada de reconhecimento real do GPT Builder antes de automatizar"
  - tool: "help.openai.com"
    gap: "Acesso direto às páginas oficiais retornou 403 (WebFetch bloqueado); dados vieram de busca cruzada (múltiplas fontes community + trechos oficiais citados por terceiros)"
    action: "Nenhuma — dados consistentes entre 3+ fontes independentes, confiança alta mesmo sem fetch direto"
  - tool: "ChatGPT (uso automatizado da conta)"
    gap: "Termos de uso da OpenAI sobre automação de sessão via Playwright não verificados em detalhe"
    action: "Karol já validou essa abordagem no Discovery; manter volume baixo (publicações pontuais, não scraping) e sempre com humano no loop antes de cada publicação"
```

**Fontes:** ~85% tier PRATA (community.openai.com, cruzado entre 3+ threads independentes, mais artigos de blog que citam o Help Center oficial), ~15% tier OURO (conteúdo do Help Center citado diretamente pelos artigos de blog, ainda que o fetch direto tenha sido bloqueado).
