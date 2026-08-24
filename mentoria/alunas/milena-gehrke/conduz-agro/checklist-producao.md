# Checklist de Produção — Conduz Agro

> Status: Gerado 23/08/2026 (Fase 9, QG-MC-010)
> Produto estruturado ≠ produto finalizado. Tudo abaixo já pode ser VENDIDO — o que falta é produzir/finalizar pra entregar.
> Prioridade: **P1** bloqueia lançamento (venda) | **P2** importante (bloqueia entrega, não venda) | **P3** nice to have
> Status: `[ ]` Pendente | `[~]` Em progresso | `[x]` Feito

---

## 1. Assessments e Ferramentas

| # | Item | Referência | Prioridade | Status |
|---|---|---|---|---|
| 1.1 | Diagnóstico da Autoridade Aplicada — interativo | `diagnostico-interativo.html` (publicado) | P1 | [x] Feito |
| 1.2 | Pré-Diagnóstico de Vendas — interativo | `pre-diagnostico-vendas.html` (publicado) | P1 | [x] Feito |
| 1.3 | Testar envio ponta a ponta dos 2 formulários acima (responder → conferir linha na planilha) | Apps Script já implantado, falta 1 teste real | P1 | [ ] Pendente |
| 1.4 | Mapa do Caso — template preenchível | `design-entregaveis.md` Seção 3, usado S4/S12 | P2 | [ ] Pendente |
| 1.5 | Simulador de Conversas que Conduzem — template/ferramenta | Usado S6, S16 | P2 | [ ] Pendente |
| 1.6 | Mapa de Posicionamento — template preenchível | Usado S7, S18 | P2 | [ ] Pendente |
| 1.7 | Mapa de Valor Percebido no Agro — template preenchível | Usado S7 | P2 | [ ] Pendente |
| 1.8 | Círculo de Controle da Condução — versão interna (template) | **Reconstruído como template Google Sheets** (não mais HTML — aluno reusa por duplicação de aba, mantém histórico). `scripts/apps-script-templates-ferramentas.gs` + `scripts/SETUP-FERRAMENTAS.md`. Formatado na IV da Milena (cores, bordas). Usado S3 | P2 | [~] Em progresso — falta Milena rodar `criarTodosTemplates` na planilha |
| 1.9 | Círculo de Controle da Condução — versão pro produtor (matriz de responsabilidade/cronograma) | **Reconstruído como template Google Sheets** — tabela com dropdown de Responsável (Você/Produtor/Terceiro, cor muda sozinha), sem marca Conduz Agro. Entrega ao produtor via Baixar → PDF. Mesmo script/guia do item 1.8 | P2 | [~] Em progresso — falta Milena rodar `criarTodosTemplates` na planilha |
| 1.10 | Roteiro de Condução da Conversa — fluxograma completo (prospecção → entrega) | Novo, 23/08 — kit de boas-vindas | P2 | [ ] Pendente |
| 1.11 | Raio-X da Conversa com o Produtor — ferramenta de análise (in-program) | Novo, 23/08 — uso contínuo do mentorado | P2 | [ ] Pendente |
| 1.12 | Ficha de Inscrição — formulário de intake do Destrava Condução | `ficha-inscricao.html` construído (mesmo padrão visual dos diagnósticos), Apps Script atualizado (`apps-script-diagnosticos.gs`, 3ª aba) | P1 *(precisa existir antes do primeiro uso do Destrava Condução, que pode acontecer cedo — S8 é mês 4)* | [~] Em progresso — falta Milena colar o `.gs` atualizado no Apps Script existente e reimplantar (ver `scripts/SETUP-PLANILHAS.md`), depois publicar o HTML como Artifact |
| 1.13 | Protocolo Pessoal de Condução — template do sistema pessoal | Usado S23-S24 | P3 *(só usado no fim do programa)* | [ ] Pendente |
| 1.14 | Checklist de Evidências da Autoridade — template com pontuação | Usado S8, S12, S16, S20, S24 | P2 *(precisa existir até S8, mês 4)* | [ ] Pendente |
| 1.15 | Plano de Aplicação Diária — formato de entrega definido e montado (agente de IA ou calendário/PDF) | `estrutura-programa.md` — formato ainda em aberto | P2 | [ ] Pendente |
| 1.16 | CRM Comercial — Milena cria a planilha real a partir do template | `crm-comercial.md` + 2 CSVs prontos, falta só ela executar "Como usar" | P2 *(entregável ao aluno também — corrigido 23/08)* | [ ] Pendente |

## 2. Agentes de IA (Suporte Entre Sessões)

| # | Item | Referência | Prioridade | Status |
|---|---|---|---|---|
| 2.1 | Agente do Método Conduz Agro (self-service, ilimitado) | `estrutura-programa.md` Seção 4 | P2 | [ ] Pendente |
| 2.2 | Preparador de Conversas Difíceis (self-service, ilimitado) | `estrutura-programa.md` Seção 4 | P2 | [ ] Pendente |
| 2.3 | Agente de IA Técnico em Regularização | `prd.md` Seção 4 | P2 | [ ] Pendente |

## 3. Sessões e Currículo

| # | Item | Referência | Prioridade | Status |
|---|---|---|---|---|
| 3.1 | Roteiro-guia detalhado por sessão (24 sessões) — script prático pra Milena conduzir | `design-sessoes.md` tem o desenho, falta o roteiro executável | P2 *(pelo menos S1-S8 antes do 1º aluno chegar na Etapa 2)* | [ ] Pendente |
| 3.2 | Definir agenda real de sessões (calendário, horários, plataforma de call = Meet) | `design-entregaveis.md` Seção 5 | P2 | [ ] Pendente |

## 4. Onboarding e Offboarding

| # | Item | Referência | Prioridade | Status |
|---|---|---|---|---|
| 4.1 | Welcome sequence (WhatsApp + e-mail pós-pagamento) | `design-entregaveis.md` Seção 1 — proposto, não escrito | P2 | [ ] Pendente |
| 4.2 | Kit de boas-vindas completo (calendário, acessos aos 3 agentes, instruções da trilha diária, contato WhatsApp) | `design-entregaveis.md` Seção 1 | P2 | [ ] Pendente |
| 4.3 | Roteiro de pedido de depoimento em vídeo (S24) | `design-entregaveis.md` Seção 2 — proposto | P3 | [ ] Pendente |

## 5. Plataforma e Tecnologia

| # | Item | Referência | Prioridade | Status |
|---|---|---|---|---|
| 5.1 | Configurar plataforma de gravação/área de membros (Hotmart ou similar) | `design-entregaveis.md` Seção 5 | P2 | [ ] Pendente |
| 5.2 | Configurar checkout Voomp com os 2 preços (R$2.797 validação / R$3.997 cheio) + parcelamento 12x | `empacotamento.md` Passo 4 | P1 | [ ] Pendente |

## 6. Comercial e Vendas

| # | Item | Referência | Prioridade | Status |
|---|---|---|---|---|
| 6.1 | Página de vendas | `empacotamento.md` (Cartão de Identidade como base de copy) | P1 | [ ] Pendente |
| 6.2 | Comunicação de venda (copy, criativos, sequências) | Usa a Matriz de Benefícios já aprovada (`empacotamento.md` Passo 2) | P1 | [ ] Pendente |
| 6.3 | Testar fluxo completo: Pré-Diagnóstico → sessão estratégica de vendas → aceite → checkout → onboarding → S1 | Ponta a ponta, nenhuma etapa testada ainda | P1 | [ ] Pendente |

## Transversal

| # | Item | Referência | Prioridade | Status |
|---|---|---|---|---|
| T.1 | Validar identidade verbal com a Milena (preencher M4.3/M4.6 do Expert360º) | `branding.md` Seção 4 — segue provisória | P2 | [ ] Pendente |
| T.2 | Revisar produto estruturado (Cartão de Identidade) | `empacotamento.md` | P1 | [x] Feito — aprovado 23/08 |
| T.3 | Definir data de lançamento/abertura | Não definida ainda | P1 | [ ] Pendente |
| T.4 | Confirmar taxa de juros do parcelamento na Voomp | `empacotamento.md` Passo 4 | P1 | [ ] Pendente |
| T.5 | Confirmar quando a fase de validação termina no controle da Milena (contador de vendas: 3 → sobe pra R$3.997) | `empacotamento.md` Passo 3 | P2 | [ ] Pendente |

---

## Resumo

- **P1 (bloqueia lançamento):** 8 itens — testar os 2 formulários, Ficha de Inscrição, checkout Voomp configurado, página de vendas, comunicação de venda, testar fluxo completo, definir data de lançamento, confirmar juros do parcelamento
- **P2 (importante, não bloqueia venda mas bloqueia entrega):** 21 itens — a maioria das ferramentas do Portfólio, os 3 agentes de IA, roteiros de sessão, onboarding, plataforma
- **P3 (nice to have):** 2 itens — Protocolo Pessoal de Condução (só usado no mês 12), roteiro de depoimento

**Leitura prática:** o produto já pode ser vendido — falta fechar os 8 itens P1 (principalmente página de vendas, checkout e comunicação de venda) pra abrir a primeira turma de validação. Os itens P2 podem ser produzidos em paralelo às primeiras sessões, seguindo a ordem do currículo (o que a S1-S8 usa primeiro tem prioridade sobre o que só entra na Etapa 2).
