# Course Publisher — Rules Operacionais

> Regras que nasceram de incidentes e protegem contra erros especificos do dominio.
> Carregadas SEMPRE, antes de qualquer missao.

---

## REGRA-001 — Dimensoes sao inegociaveis

PNG gerado com dimensoes diferentes das especificadas na KB e invalido.
**Nao usar. Re-gerar com viewport correto.**

## REGRA-002 — Titulo limpo para o aluno

Nunca mostrar hifens, underscores ou prefixos numericos no titulo de uma aula na Hotmart.
`01-fracasso-como-prova.mp4` → titulo = `Fracasso como Prova`.
Sempre aplicar a funcao de limpeza antes de preencher o campo de titulo.

## REGRA-003 — Produto correto antes de qualquer upload

Confirmar o nome do produto na Hotmart antes de iniciar qualquer upload.
Se o produto especificado nao for encontrado: parar e confirmar com a Karol.
Nunca subir aulas em produto diferente do solicitado.

## REGRA-004 — Nao deletar sem aprovacao nivel 1

Deletar modulo, aula ou qualquer conteudo existente na Hotmart requer aprovacao explicita da Karol.
Sem essa aprovacao: nao executar, mesmo que faca parte da missao.

## REGRA-005 — Vault primeiro, nunca pedir duas vezes

Antes de pedir qualquer credencial (login, senha): consultar vault.
Se estiver no vault: usar direto, sem perguntar.
Se nao estiver: pedir UMA vez e registrar IMEDIATAMENTE no vault.

## REGRA-006 — descricoes.md determina o que colar

Nunca inventar descricao de aula. A unica fonte e `descricoes.md`.
Se o arquivo nao existir ou a aula nao tiver entrada: subir sem descricao e registrar o gap no relatorio.

## REGRA-007 — Verificar arquivos antes de iniciar

Antes de comecar qualquer upload: verificar que todos os arquivos de video do modulo existem na pasta.
Se algum estiver faltando: listar o que falta e aguardar antes de continuar.

## REGRA-008 — Pasta assets/ e criada automaticamente

Se a pasta `assets/` (e subpastas) nao existir no produto: criar automaticamente antes de salvar qualquer PNG.

## REGRA-009 — Upload com timeout generoso

Videos grandes podem levar 20-30 minutos para subir. Nunca cancelar upload em andamento.
Timeout minimo por arquivo: 30 minutos. Monitorar progresso passivamente.

## REGRA-010 — Relatorio obrigatorio

Toda missao termina com relatorio estruturado: o que foi feito, o que subiu, o que falhou, o que falta.
Sem relatorio = missao nao concluida.

## REGRA-011 — Mission Log a cada missao

Registrar no Mission Log toda missao executada ao final da sessao.
Nunca encerrar sessao sem rastro documentado.

## REGRA-013 — Sessao primeiro, login manual so se necessario

Antes de qualquer acesso a Hotmart: verificar se existe sessao salva em
`agents/course-publisher/data/.session/hotmart-session.json`.
Se existir: carregar sessao — sem login, sem codigo 2FA.
So pedir intervencao da Karol se a sessao nao existir ou estiver expirada.
Apos login manual bem-sucedido: salvar sessao IMEDIATAMENTE.

## REGRA-012 — Design system do produto

Cada produto pode ter identidade visual diferente. Antes de gerar assets:
verificar se existe briefing visual do produto em `business/campanhas/{produto}/branding/`.
Se nao existir: perguntar qual paleta usar antes de gerar.

---

**Rules Status:** Production Ready
**Versao:** 1.0.0
