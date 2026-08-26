# Standalone — Ferramentas Conduz Agro pro domínio da Milena

Essa pasta tem cópias autossuficientes dos 7 formulários/ferramentas web do Conduz Agro, prontas pra subir em **qualquer hospedagem** (o domínio da Milena, GitHub Pages, Netlify, cPanel, etc.) — não dependem da minha conta Claude nem do link `claude.ai/code/artifact/...`.

## Arquivos

| Arquivo | O que é |
|---|---|
| `diagnostico-interativo.html` | Diagnóstico da Autoridade Aplicada (30 perguntas) |
| `pre-diagnostico-vendas.html` | Pré-Diagnóstico de Vendas (qualificação de lead) |
| `ficha-inscricao.html` | Ficha de Inscrição do Destrava Condução |
| `raio-x-conversa.html` | Raio-X da Conversa com o Produtor (aceita print) |
| `leitura-do-produtor.html` | Os 6 perfis de produtor — consulta fixa |
| `roteiro-conducao-conversa.html` | Fluxograma + roteiro dos 10 passos da condução |
| `simulador-conversas.html` | 7 cenários de treino de objeção |

## O que mudou em relação aos arquivos da pasta principal

Só a estrutura por fora: adicionei `<!DOCTYPE html><html><head>...</head><body>...</body></html>` em volta de cada um, porque os arquivos originais (`../*.html`) são escritos como fragmento — pensados pra rodar dentro do visualizador de Artifact do Claude, que injeta esse wrapper sozinho. Fora do Claude, sem o wrapper, a página não renderiza certo. **Conteúdo, estilo, lógica e imagens (todas embutidas em base64, nenhuma depende de caminho de arquivo) são idênticos.**

Testei os 2 mais complexos (Ficha de Inscrição e Diagnóstico Interativo) num navegador local antes de considerar pronto — carregam, navegam entre perguntas e não tem erro no console.

## Como subir

Cada arquivo é 100% autocontido (HTML+CSS+JS+imagens numa página só) — não precisa de servidor especial, banco de dados nem build. É só colocar o arquivo em qualquer pasta pública do domínio (ex: `conduzagro.com.br/diagnostico.html`) via FTP, painel de hospedagem, GitHub Pages ou Netlify.

Os 4 que enviam dado (Diagnóstico, Pré-Diagnóstico, Ficha de Inscrição, Raio-X) continuam mandando as respostas pro mesmo Apps Script/planilha "Respostas dos Formulários - Conduz Agro" — não muda nada nesse fluxo.

## ⚠️ Manutenção — ficam 2 cópias de cada arquivo agora

A partir de agora existem **2 versões** de cada uma dessas 7 ferramentas:
- `../{nome}.html` — fonte publicada como Artifact do Claude (link `claude.ai/code/artifact/...`)
- `standalone/{nome}.html` — cópia pro domínio da Milena

**Se qualquer uma mudar de conteúdo no futuro (nova pergunta, novo endpoint, correção de texto), as duas precisam ser atualizadas.** Ninguém edita direto os arquivos dessa pasta — sempre edita o arquivo fonte na pasta principal e gera a versão standalone de novo (repetir o processo de envolver com `<!DOCTYPE>`/`<html>`/`<head>`/`<body>`).
