# Publicador de GPT — Foundation KB

> Base de conhecimento do worker `gpt-publisher`. Cresce conforme o worker pesquisa (Modo Pesquisa) e documenta missões (Modo Documentação).

---

## 1. Contexto do Negócio

A Incubadora de Expert forja mentes sintéticas e consultores no formato Mind Forge (`agents/{slug}/agent.md` + `config.yaml` + `data/{slug}-kb.md` + `tasks/`) pra rodar dentro do Auroq OS via Claude Code. Parte dessas mentes precisa também ficar disponível fora do Auroq — hoje isso é feito publicando um Custom GPT no ChatGPT, pra que as alunas do Expert360 usem sem precisar de acesso ao repositório.

Hoje existem 6 Custom GPTs publicados manualmente:
- Agente da Persona Compradora
- Agente da Promessa Transformadora
- Agente do Processo Autoral
- Agente do Portfólio Estratégico
- Agente da Proposta Validada
- Agente da Autoridade Tríplice

Todos referenciados em `mentoria/alunas/_template/0- Biblioteca de IAs.md` (e nas cópias por aluna). Esse worker é o primeiro a formalizar o processo de publicação — antes, tudo era feito manualmente na interface do ChatGPT.

**Piloto de validação:** ExpertViral (`agents/expert-viral/`), mente síntética Afonso+Rafael+Clara pra conteúdo viral.

---

## 2. Plataformas e Ferramentas

### 2.1 ChatGPT Custom GPT (GPT Builder)

**O que é:** editor da OpenAI pra criar "GPTs" — versões customizadas do ChatGPT com Instructions, arquivos de Knowledge (RAG) e conversation starters próprios. Acessado em chatgpt.com, área "GPTs" → "Create" (builder conversacional) ou "Configure" (edição direta dos campos — preferível pra automação, mais previsível que o builder conversacional).

**Features core e limites confirmados:**

| Campo | Limite | Observação |
|-------|--------|------------|
| Instructions | **8.000 caracteres** | Editor não deixa salvar acima disso. Campo separado do "Custom Instructions" da personalização geral do ChatGPT (esse último tem limite de 5.000 chars pra contas pagas desde jul/2026 — são dois campos diferentes, não confundir) |
| Knowledge files | **até 20 arquivos por GPT** | Cada arquivo até 512MB e até 2.000.000 tokens (limite de tokens não se aplica a planilhas) |
| Formatos de Knowledge | `.txt`, `.pdf`, `.docx`, `.csv`, `.json`, `.md`, `.pptx`, `.xlsx` | `.md` é o formato nativo das KBs do Auroq — upload direto, sem conversão |
| Rate limit de upload | ~80 arquivos / 3 horas | Não costuma ser problema pra publicações pontuais |
| Storage compartilhado | 25GB/usuário, 100GB/org | Compartilhado com Projects e outros chats — não é dedicado só a GPTs |
| Conversation starters | Sem limite documentado de caracteres relevante | Manter curtos (1 linha), o builder mostra tipicamente 4 |

**Compartilhamento/publicação:** botão "Share" no editor. Opções:
- Privado (só quem criou)
- Pessoas específicas
- Workspace (contas Team/Enterprise)
- **Link — "Anyone with the link"** ← modo usado pelos 6 GPTs atuais das alunas, e o padrão pra este worker
- Publicado no GPT Store (exige categoria + revisão de política — fora do escopo deste worker)

**API:** **não existe API pública oficial pra criar/editar Custom GPTs.** O GPT Builder só é acessível via interface web. Esse é o motivo estrutural da automação via Playwright em vez de chamadas de API — decisão validada com a Karol no Discovery (ela escolheu automação de navegador mesmo sabendo do trade-off de fragilidade).

**Limites/riscos conhecidos:**
- Instructions ficam truncadas/rejeitadas acima de 8.000 caracteres — compactação precisa de folga de segurança (meta prática: ~7.000, não 8.000 exatos)
- Sem API = sem endpoint estável; automação via UI é sensível a mudanças de layout da OpenAI, que atualiza o produto com frequência
- Retrieval de Knowledge não é garantido em toda conversa — é busca sob demanda, não "memória" carregada sempre. Regra comportamental crítica precisa estar nas Instructions, não só no Knowledge

**Documentação oficial (tier ouro, citada por múltiplas fontes cruzadas — acesso direto ao Help Center retornou 403 no momento da pesquisa):**
- Creating and editing GPTs — https://help.openai.com/en/articles/8554397-creating-and-editing-gpts
- Sharing and publishing GPTs — https://help.openai.com/en/articles/8798878-sharing-and-publishing-gpts
- File uploads FAQ — https://help.openai.com/en/articles/8555545-file-uploads-faq
- GPTs in ChatGPT — https://help.openai.com/en/articles/8554407-gpts-in-chatgpt

### 2.2 Playwright (browser automation)

**O que é:** framework de automação de navegador já disponível no Auroq (MCP `playwright`/`playwright-firefox`). Usado pra logar na sessão ChatGPT Plus já autenticada da Karol e operar o GPT Builder como um humano operaria.

**Uso previsto:** navegar até a área de GPTs no chatgpt.com, preencher Instructions, subir arquivos de Knowledge, definir conversation starters, configurar compartilhamento, e publicar/atualizar — sempre depois de aprovação humana sobre o conteúdo compactado.

**Limites/riscos:**
- Depende de sessão já logada no navegador usado pelo Playwright — o worker não gerencia login/senha/2FA
- Seletores da UI podem mudar sem aviso — automação frágil por natureza. Tratamento: parar e avisar em vez de "adivinhar" um seletor que sumiu
- Uso automatizado de conta pessoal pode esbarrar em termos de uso da OpenAI dependendo do volume/frequência — mitigado por baixo volume (publicações pontuais) e humano sempre no loop antes de cada ação de publicação

### 2.3 Mind Forge (formato de origem)

**O que é:** squad interno do Auroq que forja mentes sintéticas/consultores. Todo worker deste tipo (gpt-publisher) consome mentes produzidas nesse formato como entrada.

**Estrutura padrão de uma mente Mind Forge:**
```
agents/{slug}/
  agents/{slug}.md      — persona completa (identidade, personalidade, strict rules, modos)
  config.yaml            — metadados (nome, descrição, domínios, versão)
  data/{slug}-kb.md      — Foundation KB do domínio
  tasks/*.md              — procedimentos/modos específicos, cada um com trigger próprio
  skill.md                — shim de ativação (não relevante pro GPT, é específico do Claude Code)
```

---

## 3. Integrações

### 3.1 Mind Forge (Auroq) → ChatGPT Custom GPT

**Método:** leitura de arquivos locais (Mind Forge) → transformação/compactação → automação de navegador (Playwright) no GPT Builder. Não há integração via API entre os dois lados — é tradução manual assistida por IA, não um pipe de dados automático.

### 3.2 Mapeamento de Campos — Auroq → GPT Builder

| Componente Auroq | Vira no GPT Builder | Observação |
|-------------------|----------------------|------------|
| `agent.md` → Identidade + Personalidade + Estilo | Instructions (parte 1) | Compactado — ver `compact-instructions.md` |
| `agent.md` → Strict Rules (NUNCA/SEMPRE) | Instructions (parte 2) | Só as que mudam comportamento perceptível pro usuário final |
| `agent.md` → Modos de Operação | Instructions (resumo 1-2 linhas cada) + Knowledge (detalhe completo) | Resumo fica nas Instructions, protocolo completo vai pro Knowledge |
| `config.yaml` → nome/descrição | Nome e descrição do GPT | Direto, sem compactação necessária (já é curto) |
| `data/{slug}-kb.md` | Arquivo(s) de Knowledge | Geralmente cabe como 1 arquivo único — ver seção 5 |
| `tasks/*.md` (procedimentos detalhados) | Arquivo(s) de Knowledge (seção "Procedimentos Detalhados") | Trigger de cada task vira "Quando usar" no Knowledge |
| `tasks/*.md` (triggers) | Conversation starters | Traduzidos pra linguagem natural, não nomes técnicos de task |
| Comandos `*comando` | Removidos ou traduzidos pra linguagem natural | Custom GPT não tem sintaxe de comando — herda o princípio Natural Language First do próprio Auroq |
| Paths de arquivo do Auroq (`agents/...`, `business/...`) | Removidos | Não fazem sentido fora do runtime do Auroq |
| Referências a outros agentes do Auroq (Companion, Ops, etc.) | Removidas | Não existem no contexto do GPT publicado |
| `skill.md` | Não usado | É o shim de ativação do Claude Code, sem equivalente no GPT |

**Cuidado central:** a persona do Auroq é escrita assumindo um agente rodando dentro do Claude Code, com acesso a ferramentas de arquivo, tasks nomeadas e comandos `*`. O Custom GPT não tem esse runtime. Toda referência a esse ambiente precisa ser traduzida ou removida — não é só "encurtar texto", é adaptar contexto de execução.

---

## 4. SOPs Existentes

Nenhum SOP prévio encontrado no Auroq pra esse processo — os 6 GPTs atuais foram montados manualmente na interface, sem procedimento documentado. Este worker é o primeiro a formalizar o processo. O Playbook (`gpt-publisher-playbook.md`) nasce vazio e cresce a partir da primeira missão real (publicação do ExpertViral).

**Referência de formato (não é SOP, é o padrão observado):** `mentoria/alunas/_template/0- Biblioteca de IAs.md` mostra como os links dos GPTs existentes são organizados e referenciados pras alunas — útil como referência de estilo do link final. O worker não edita esse arquivo (distribuição do link é decisão manual da Karol).

---

## 5. Decision Trees

### 5.1 O que vai pra Instructions vs. o que vai pra Knowledge

```
A informação é necessária em TODA interação pra manter a persona/voz/regras core?
├── SIM → Instructions
│         (identidade, tom de voz, strict rules, boundaries, modos resumidos em
│          1-2 linhas cada)
└── NÃO → é consultada só em cenários específicos (procedimento detalhado de uma
          task, exemplos extensos, troubleshooting, glossário)?
          ├── SIM → Knowledge file (retrieval sob demanda)
          └── NÃO (dado que muda com frequência, tipo config.yaml bruto) →
                    normalmente NÃO entra no GPT — fica só como referência interna
```

### 5.2 Caso Real do Piloto (ExpertViral) — Medido na Pesquisa Inicial

| Fonte | Tamanho |
|-------|---------|
| `agent.md` (persona completa) | ~11.050 caracteres |
| `config.yaml` | ~499 caracteres |
| `data/expert-viral-kb.md` | ~26.030 caracteres (393 linhas) |
| `tasks/*.md` (5 arquivos: analisar-referencia, consultor, diagnosticar, roteirizar, start) | ~8.823 caracteres (243 linhas) |
| **Total bruto** | **~46.400 caracteres** |
| **Limite de Instructions** | **8.000 caracteres (~17% do total bruto)** |

**Leitura prática:** a persona sozinha (11.050 chars) já estoura o limite de Instructions — compactação é obrigatória mesmo sem contar KB e tasks. A KB inteira (26.030 chars) cabe folgada como 1 único Knowledge file (limite real é da ordem de milhões de caracteres). As 5 tasks (8.823 chars) também cabem como parte do mesmo Knowledge file ou em arquivo separado — decisão de organização é autonomia nível 5 (Advise) do worker.

**Estimativa de corte necessário pro piloto:** a persona de 11.050 chars precisa perder pelo menos ~4.000 caracteres (36%) pra caber com folga em 7.000. Isso normalmente vem de: remover explicações longas do "porquê" das regras (manter só a regra), resumir os 4-5 modos de operação pra 1-2 linhas cada, remover exemplos extensos (movidos pro Knowledge), e traduzir/remover referências a comandos e paths do Auroq.

### 5.3 Criar GPT Novo vs. Atualizar Existente

```
Já existe um GPT publicado pra essa mente?
├── Não há registro em agents/gpt-publisher/output/{slug}/custom-gpt/gpt-id.md
│   → Provavelmente é criação nova, mas CONFIRMAR com a Karol antes (nível 3, Consult)
│     — evita duplicata caso o GPT tenha sido criado manualmente antes deste worker existir
│     (é o caso dos 6 GPTs atuais — nenhum tem registro, porque foram feitos manualmente)
└── Há registro com o link/ID do GPT
    → É atualização. Abrir o GPT existente no editor (não criar um novo) e sobrescrever
      Instructions/Knowledge/starters com a versão aprovada
```

**Atenção especial:** os 6 GPTs atuais das alunas foram criados manualmente, então não têm (e não devem ganhar automaticamente) registro em `gpt-id.md`. Se a Karol pedir pra "atualizar" um desses 6 via este worker, o primeiro passo é localizar o GPT manualmente (ela sabe o link) e criar o registro `gpt-id.md` retroativamente antes de tratar como atualização normal.

---

## 6. Checklist Pré-Publicação (Pre-flight)

Antes de considerar o pacote pronto pra apresentar à Karol:

- [ ] Instructions ≤ 8.000 caracteres (meta prática: ≤ 7.000)
- [ ] Identidade, tom de voz e boundaries preservados nas Instructions
- [ ] Nenhuma referência a comando `*`, path do Auroq, ou outro agente Auroq sobrou nas Instructions
- [ ] Toda regra comportamental crítica está nas Instructions, não só no Knowledge
- [ ] Todo conteúdo cortado das Instructions foi preservado em algum Knowledge file (nada foi perdido, só realocado)
- [ ] Nº de arquivos de Knowledge ≤ 20
- [ ] Nenhum arquivo de Knowledge excede 512MB / 2M tokens
- [ ] Conversation starters refletem tasks/modos reais (nenhum inventado)
- [ ] Decisão criar vs. atualizar confirmada
- [ ] Relatório de cortes documentado (o que saiu das Instructions e por quê)

---

## 7. Troubleshooting

| Problema | Causa provável | Solução |
|----------|----------------|---------|
| Instructions rejeitadas ao salvar | Passou de 8.000 caracteres | Cortar mais; mover trecho pro Knowledge |
| GPT "esquece" regra que estava na KB | Retrieval não é garantido a cada turno | Regra comportamental crítica deve ficar nas Instructions, não só no Knowledge |
| Upload de Knowledge file falha | Arquivo acima de 512MB/2M tokens, ou mais de 20 já anexados | Particionar arquivo grande por tema; remover redundante |
| Seletor do Playwright não encontra o campo esperado | OpenAI mudou o layout do GPT Builder | Parar, tirar screenshot, avisar a Karol — não tentar seletor alternativo sozinho |
| Sessão ChatGPT não logada quando a missão roda | Sessão expirou ou navegador é instância limpa | Parar e avisar a Karol pra logar antes de tentar de novo |
| GPT publicado mas link não abre / erro de permissão | Compartilhamento ficou como "só eu" em vez de "qualquer pessoa com o link" | Verificar campo Share antes de considerar a missão concluída |
| Persona compactada perdeu a "voz" do agente original | Cortes priorizaram tamanho sobre comportamento | Revisar: identidade e tom de voz nunca deveriam ser o primeiro corte — ver ordem de prioridade em `compact-instructions.md` |
| Mente de origem depende fortemente de comandos `*` pra funcionar | Persona foi desenhada assumindo runtime do Claude Code | Sinalizar à Karol antes de prosseguir — pode não ser uma boa candidata a Custom GPT sem redesenho |
| GPT respondendo com informação desatualizada | Mente de origem evoluiu após a última publicação | Rodar `audit-published.md`, oferecer republicação |

---

## 8. Glossário

- **GPT Builder:** editor da OpenAI (dentro do ChatGPT) pra criar Custom GPTs
- **Custom GPT / "GPT":** versão customizada do ChatGPT com Instructions, Knowledge e starters próprios
- **Instructions:** campo de texto (≤8.000 chars) que define persona e comportamento do GPT — equivalente ao `agent.md` compactado
- **Knowledge files:** arquivos anexados ao GPT que ele consulta via retrieval (RAG) — equivalente à KB e tasks do Auroq
- **Conversation starters:** prompts de exemplo mostrados na tela inicial do GPT — derivados dos triggers das tasks
- **Retrieval:** mecanismo pelo qual o GPT busca trechos relevantes dos Knowledge files durante a conversa — busca sob demanda, não memória sempre carregada
- **GPT Store:** loja pública de GPTs da OpenAI — fora do escopo deste worker (publicação é sempre via link, não Store)
- **Mind Forge:** squad do Auroq que forja mentes sintéticas/consultores no formato que este worker consome como entrada
- **gpt-id.md:** arquivo de registro que este worker cria por mente publicada, guardando o link e a versão da mente no momento da publicação — usado pra decidir criar vs. atualizar e pra auditoria

---

## 9. Gaps Registrados

```yaml
gaps:
  - tool: "ChatGPT GPT Builder"
    gap: "Fluxo exato de seletores/passos do Playwright (criar vs editar) não documentado — depende de navegação ao vivo"
    action: "Mapear na primeira missão real (piloto ExpertViral), documentar como SOP-001 e SOP-002 no Playbook"
  - tool: "help.openai.com"
    gap: "Acesso direto às páginas oficiais retornou 403 (WebFetch bloqueado); dados vieram de busca cruzada"
    action: "Nenhuma ação necessária — dados consistentes entre 3+ fontes independentes, confiança alta"
  - tool: "ChatGPT (uso automatizado da conta)"
    gap: "Termos de uso da OpenAI sobre automação de sessão via Playwright não verificados em detalhe"
    action: "Karol já validou essa abordagem no Discovery; manter volume baixo e humano no loop antes de cada publicação"
  - tool: "6 GPTs existentes (manuais)"
    gap: "Nenhum tem registro gpt-id.md — não foram criados por este worker"
    action: "Se a Karol pedir atualização de um desses via este worker, criar o registro retroativamente antes de tratar como atualização normal"
```

**Fontes:** ~85% tier PRATA (community.openai.com, cruzado entre 3+ threads independentes, mais artigos que citam o Help Center oficial), ~15% tier OURO (conteúdo do Help Center citado diretamente, ainda que o fetch direto tenha sido bloqueado).

---

## 10. Orçamento de Caracteres — Guia de Compactação

Referência prática pra distribuir os ~7.000 caracteres de meta (dentro do limite de 8.000) entre as seções das Instructions. Não é regra rígida — é ponto de partida pra evitar que uma seção consuma tudo e sufoque as outras:

| Seção das Instructions | Orçamento aproximado | Prioridade se precisar cortar mais |
|--------------------------|----------------------|--------------------------------------|
| Identidade (quem é, propósito) | ~400-600 chars | Última a cortar |
| Tom de voz / Personalidade | ~600-900 chars | Última a cortar |
| Scope + Boundaries | ~500-800 chars | Nunca cortar (par obrigatório) |
| Modos de operação (resumo) | ~150-250 chars por modo | Cortar detalhe, manter 1 linha |
| Strict Rules essenciais | ~800-1.200 chars | Cortar a explicação do "porquê", manter a regra |
| Instrução de uso do Knowledge | ~100-150 chars | Nunca cortar (sem isso o GPT não sabe que tem Knowledge) |
| Folga de segurança | ~1.000-1.500 chars | Reservada — evita estourar em revisões futuras |

Se a soma passar de ~7.000: revisar primeiro Strict Rules (geralmente a seção mais fácil de enxugar sem perder comportamento) e os resumos de modos secundários, antes de tocar em Identidade/Tom de voz/Boundaries.

---

## 11. Primeira Publicação — Checklist Consolidado de Execução

Sequência de referência rápida (o detalhe de cada etapa está no task file correspondente):

1. **Confirmar criação vs. atualização** — checar `output/{slug}/custom-gpt/gpt-id.md` (ver seção 5.3)
2. **`extract-mind.md`** — ler agent.md, config.yaml, KB, tasks; medir tamanhos
3. **`compact-instructions.md`** — aplicar o orçamento da seção 10, traduzir referências do Auroq, cortar até caber
4. **`prepare-knowledge.md`** — decidir 1 arquivo vs. múltiplos (ver seção 2.1 — raramente precisa de mais de 1 pras KBs atuais do Auroq)
5. **`generate-starters.md`** — até 4 starters, derivados de tasks reais
6. **Checklist pré-publicação** (seção 6) — rodar antes de apresentar o pacote
7. **Apresentação e aprovação** — nível 3 (Consult), sem pular
8. **`publish-gpt.md`** — confirmar sessão logada, preencher campos, configurar "Anyone with the link", capturar URL
9. **Registrar `gpt-id.md`** e atualizar `gpt-publisher-missions.md`
10. **PDSA** — se algo do fluxo foi diferente do esperado, isso vira SOP em `document-process.md`

Essa sequência ainda não tem execução real registrada — a primeira vez que rodar de ponta a ponta (piloto ExpertViral) deve virar SOP-001 no Playbook, incluindo os seletores reais do Playwright encontrados no caminho.

---

## 12. Referência — GPTs Existentes (Manuais)

Tabela de referência dos 6 GPTs já publicados manualmente pra alunas do Expert360, útil como ponto de comparação de qualidade/formato quando o worker publicar os primeiros GPTs automatizados. Fonte: `mentoria/alunas/_template/0- Biblioteca de IAs.md` (leitura apenas — worker não edita esse arquivo).

| GPT | Módulo | Link (referência) |
|-----|--------|--------------------|
| Agente da Persona Compradora | M1 | ver Biblioteca de IAs |
| Agente da Promessa Transformadora | M1 | ver Biblioteca de IAs |
| Agente do Processo Autoral | M2 | ver Biblioteca de IAs |
| Agente do Portfólio Estratégico | M2 | ver Biblioteca de IAs |
| Agente da Proposta Validada | M3 | ver Biblioteca de IAs |
| Agente da Autoridade Tríplice | M4 | ver Biblioteca de IAs |

Nenhum desses tem registro em `gpt-id.md` — foram criados fora deste worker. Conteúdo interno (Instructions/Knowledge reais) desses 6 GPTs não foi inspecionado nesta pesquisa; se a Karol quiser usá-los como referência de estilo pra calibrar as primeiras publicações automatizadas, isso exigiria abrir cada um no GPT Builder e ler o que está configurado — não assumir conteúdo sem checar.

## 13. Como Confirmar o Tipo de Conta (Plus vs. Team)

A conta usada por este worker é ChatGPT Plus pessoal (confirmado no Discovery). Caso isso mude no futuro (upgrade pra Team/Enterprise), sinais pra reconhecer na interface antes de publicar:

- **Plus (pessoal):** não há seletor de workspace no canto superior; opção de compartilhamento "Share" vai direto pra "Anyone with the link" ou pessoas específicas
- **Team/Enterprise:** existe um seletor de workspace; "Share" ganha uma opção adicional de "toda a workspace"; GPTs podem ficar restritos ao workspace por padrão

Se o tipo de conta mudar, revisar `publish-gpt.md` Step 4 (Configurar Compartilhamento) — a opção "Anyone with the link" pode estar em local diferente do fluxo Team.
