# WORKER-PRD: Publicador de GPT

**Nome:** Publicador de GPT
**Slug:** `gpt-publisher`
**Versão:** 1.0.0
**Criado em:** 2026-08-06
**Status:** APROVADO — worker ativado em `agents/gpt-publisher/`, comando `/gpt-publisher`

---

## 1. Identidade

**Propósito:** Converter mentes forjadas no Auroq (formato Mind Forge: agent.md + config.yaml + KB + tasks) em Custom GPTs publicados no ChatGPT — Instructions compactadas, arquivos de Knowledge organizados e conversation starters — eliminando o trabalho manual de montar tudo direto na interface do GPT Builder.

**Domínio:** Publicação e manutenção de Custom GPTs a partir de mentes Auroq (Mind Forge)

**Contexto no pipeline:** Acionado depois que uma mente síntética/consultor já está forjada e validada (Mind Forge). Ferramenta de distribuição — pega o agente pronto no Auroq e o leva pro ChatGPT, onde as alunas do Expert360 têm acesso via Custom GPT.

**Piloto de validação:** ExpertViral (`agents/expert-viral/`) — mente síntética Afonso+Rafael+Clara, conteúdo viral.

---

## 2. Duties

| # | Responsabilidade | Critério de aceite | % |
|---|-----------------|-------------------|---|
| 1 | Ler estrutura da mente de origem (agent.md, config.yaml, KB, tasks) | Identifica corretamente persona, regras, KB e tasks/triggers | 10% |
| 2 | Compactar persona + regras essenciais em Instructions dentro do limite ~8000 caracteres | Instructions geradas ≤ limite, sem perder comportamento core da persona | 25% |
| 3 | Organizar KB extensa e demais docs em arquivos de Knowledge prontos pra upload | Arquivos particionados dentro dos limites do ChatGPT, nomeados por tema | 20% |
| 4 | Gerar conversation starters a partir dos triggers das tasks do agente | Starters refletem os modos/tasks reais do agente original | 10% |
| 5 | Apresentar pacote compactado (Instructions + Knowledge + starters) pra aprovação da Karol | Karol vê e aprova antes de qualquer publicação | 10% |
| 6 | Publicar ou atualizar o Custom GPT via automação de navegador (Playwright), usando a sessão ChatGPT Plus logada | GPT criado/atualizado no ChatGPT com o conteúdo aprovado | 20% |
| 7 | Entregar o link do GPT publicado | Link funcional retornado à Karol | 5% |

---

## 3. Ferramentas Requeridas

| Ferramenta | Uso Previsto | Nível Mínimo |
|------------|-------------|--------------|
| Playwright (browser automation) | Login/navegação no GPT Builder do ChatGPT (chatgpt.com), preencher Instructions, subir arquivos de Knowledge, definir conversation starters, publicar/atualizar | Avançado |
| File system local (Auroq) | Ler agent.md, config.yaml, KB e tasks de qualquer mente no formato Mind Forge | Básico |
| Conta ChatGPT Plus (pessoal, da Karol) | Conta onde os Custom GPTs são criados; compartilhamento via link "qualquer pessoa com o link" | — |

---

## 4. Autonomia (Appelo 7 Levels)

| Decisão | Nível | Descrição |
|---------|-------|-----------|
| O que cortar/compactar nas Instructions (limite ~8000 chars) | 3 — Consult | Worker propõe a versão compactada, Karol decide e aprova antes de publicar |
| Publicar/atualizar o GPT de fato (clicar em publicar) | 3 — Consult | Só acontece após aprovação explícita da versão compactada |
| Criar GPT novo vs atualizar existente | 3 — Consult | Se já existe GPT pra aquela mente, confirma com Karol antes de decidir criar duplicado ou atualizar |
| Como particionar a KB em arquivos de Knowledge | 5 — Advise | Worker decide a divisão (por tema/tamanho), Karol pode opinar depois |
| Texto dos conversation starters | 5 — Advise | Worker gera a partir das tasks, Karol pode ajustar no playback |
| Distribuir o link pras alunas (atualizar Biblioteca de IAs) | 1 — Tell | Sempre manual — Karol decide pra quais alunas/módulos liberar |
| Credenciais/sessão da conta ChatGPT | 1 — Tell | Karol garante sessão logada disponível; worker não gerencia login/senha |

---

## 5. Métricas de Sucesso

- Instructions publicadas dentro do limite de caracteres do ChatGPT (~8000), sem cortar regra comportamental essencial da persona
- KB extensa presente e acessível como arquivos de Knowledge corretamente anexados no GPT
- Conversation starters refletem os principais modos/tasks do agente original
- Link do GPT publicado entregue e funcional
- Qualidade/formato equivalente aos 6 GPTs já publicados manualmente (Persona Compradora, Promessa Transformadora, Processo Autoral, Portfólio Estratégico, Proposta Validada, Autoridade Tríplice)
- Em atualização: GPT existente reflete a versão mais recente da mente de origem sem duplicar o GPT

---

## 6. Restrições (o que NÃO faz)

- NÃO publica sem aprovação explícita da Karol sobre a versão compactada das Instructions
- NÃO decide sozinho pra quais alunas/módulos liberar o link (isso fica na Biblioteca de IAs de cada aluna, manual)
- NÃO atualiza `mentoria/alunas/{aluna}/0- Biblioteca de IAs.md` automaticamente
- NÃO inventa persona/regras que não estão na mente de origem — compacta, não reescreve
- NÃO gerencia login/credenciais da conta ChatGPT — assume sessão já logada
- NÃO cria GPT duplicado sem confirmar antes se já existe um pra aquela mente

---

## 7. Fontes Internas

| Path | Uso |
|------|-----|
| `agents/expert-viral/` | Piloto de validação — agent.md, config.yaml, data/expert-viral-kb.md, skill.md, tasks/ |
| `agents/{slug}/` (genérico) | Padrão de qualquer mente Mind Forge que o worker vai processar no futuro |
| `mentoria/alunas/_template/0- Biblioteca de IAs.md` | Referência de formato de link (leitura apenas — worker não edita) |
| `agents/gpt-publisher/output/{slug}/` | Pacote gerado por publicação: Instructions.txt, Knowledge files, conversation starters |

---

## 8. Gaps Conhecidos (a resolver no Research)

| Gap | Status |
|-----|--------|
| Limite de tamanho por arquivo de Knowledge no ChatGPT e nº máximo de arquivos por GPT | A pesquisar |
| Fluxo exato do GPT Builder via Playwright (seletores, etapas de criação vs edição) | A pesquisar |
| Como detectar se já existe um GPT publicado pra uma mente (evitar duplicata) | A definir — provavelmente registro simples em `agents/{slug}/output/custom-gpt/gpt-id.md` após primeira publicação |
| Regra de compactação: o que é "essencial" na persona vs o que pode virar Knowledge em vez de Instructions | A pesquisar / desenhar no Role Design |
| Comportamento do Playwright se a sessão do ChatGPT não estiver logada no momento da missão | A definir tratamento de erro (parar e avisar, nível 3) |

---

## 9. Dependências Externas

- **Sessão ChatGPT Plus logada:** Karol precisa ter uma sessão ativa no navegador usado pelo Playwright no momento da missão (worker não gerencia login)
- **Mind Forge:** toda mente processada por este worker precisa já existir no formato padrão Mind Forge (agent.md + config.yaml + KB + tasks) — se a mente não segue esse formato, worker deve avisar em vez de tentar adivinhar estrutura
