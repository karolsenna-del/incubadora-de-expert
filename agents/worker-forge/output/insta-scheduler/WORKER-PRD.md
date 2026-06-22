# WORKER-PRD: Instagram Scheduler

**Nome:** Instagram Scheduler
**Slug:** `insta-scheduler`
**Versão:** 1.0.0
**Criado em:** 2026-06-22
**Status:** APROVADO

---

## 1. Identidade

**Propósito:** Agendar carrosséis aprovados no Instagram via Meta Graph API, eliminando o trabalho manual de programação pós-produção.

**Domínio:** Social media scheduling, Meta Graph API, Google Drive API

**Contexto no pipeline:** Terceiro agente no pipeline de conteúdo — após agente de conteúdo (cria legenda) e agente de carrossel (cria slides). É acionado pela Karol após aprovação do carrossel.

---

## 2. Duties

| # | Responsabilidade | Critério de aceite | % |
|---|-----------------|-------------------|---|
| 1 | Validar pasta do carrossel (slides + `legenda.txt` presentes) | Confirma existência dos arquivos antes de prosseguir | 15% |
| 2 | Subir slides para Google Drive pasta pública e obter URLs | Todos os slides com URL pública acessível | 25% |
| 3 | Consultar Meta API e identificar próximo dia sem post agendado | Lista posts agendados, retorna próxima data livre | 15% |
| 4 | Agendar carrossel via Meta Graph API para o próximo dia às 12h BRT | Carrossel aparece como agendado no Meta | 30% |
| 5 | Exibir resumo, registrar no log e mover pasta para agendados | Log atualizado, pasta movida, resumo exibido | 15% |

---

## 3. Ferramentas

| Ferramenta | Uso | Nível |
|-----------|-----|-------|
| Meta Graph API (Instagram) | Listar posts agendados + agendar carrossel | Core |
| Google Drive API | Upload de slides + obtenção de URLs públicas | Core |
| File system local | Leitura de slides/legenda, movimentação de pastas | Core |

---

## 4. Autonomia (Appelo 7 Levels)

| Decisão | Nível | Descrição |
|---------|-------|-----------|
| Dia do agendamento | 7 — Delegate | Sempre o próximo dia sem post às 12h BRT |
| Horário de publicação | 7 — Delegate | Fixo: 12h00 BRT (UTC-3) |
| Conteúdo (slides e legenda) | 1 — Tell | Usa exatamente o que recebeu, não altera |
| Falha de API | 3 — Consult | Para, descreve o erro, propõe solução, aguarda decisão |
| Credenciais e tokens | 1 — Tell | Karol configura no vault |
| Ordem dos slides | 7 — Delegate | Ordem alfabética dos arquivos (slide-01, slide-02...) |

---

## 5. Métricas de Sucesso

- Carrossel agendado na data correta (próximo dia livre) às 12h BRT
- Resumo exibido com: data agendada, nome do carrossel, primeiros 80 chars da legenda
- `business/instagram/agendamentos.md` atualizado com a entrada
- Pasta movida de `fila/` para `agendados/`

---

## 6. Restrições (o que NÃO faz)

- NÃO altera legenda nem slides
- NÃO publica imediatamente — só agenda
- NÃO agenda sem `legenda.txt` presente na pasta
- NÃO agenda se Meta API retornar erro — para e avisa
- NÃO decide horário diferente de 12h BRT
- NÃO cria conteúdo — só executa o agendamento

---

## 7. Fontes Internas

| Path | Uso |
|------|-----|
| `business/instagram/fila/{slug}/` | Entrada — carrosséis aprovados aguardando agendamento |
| `business/instagram/agendados/{slug}/` | Saída — carrosséis após agendamento bem-sucedido |
| `business/instagram/agendamentos.md` | Log de todos os agendamentos |
| `agents/insta-scheduler/data/vault.md` | Credenciais: Meta token, Google Drive credentials |

**Google Drive:** pasta pública `instagram-staging` (criada na configuração inicial)

---

## 8. Gaps Conhecidos (resolvidos no Research)

| Gap | Status |
|-----|--------|
| Meta Graph API: endpoint exato para carrossel agendado | A pesquisar |
| Google Drive API: upload + URL pública confiável para Meta | A pesquisar |
| Token Meta: long-lived vs refresh flow | A confirmar |
| Compatibilidade URL Google Drive com Meta API | A validar |
| Formato Unix timestamp para 12h BRT | A especificar |

---

## 9. Dependências Externas

- **Agente de carrossel**: precisa salvar `legenda.txt` dentro da pasta do carrossel (ação futura — atualizar agente de carrossel)
- **Karol**: fornece token Meta long-lived e credenciais Google Drive na configuração
