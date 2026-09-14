# Onboarding Pós-Compra — Mensagens por Produto

> Mensagem que a Karol manda pro cliente assim que a compra é confirmada (hoje manual — não tem
> automação ligando pagamento → envio, ver nota em "Estado da automação" no fim do arquivo).
> Formato: 1 seção por produto, igual ao padrão do `00-documento-mestre-ofertas.md`.
> Iniciado 14/09/2026, começando pelo Sprint do Método — demais produtos entram conforme forem
> adaptados.

---

## 1. Sprint do Método — R$3.000

**Quando enviar:** assim que o pagamento aparecer confirmado (Voomp, produto `sprint-do-metodo`,
checkout `/16365`).

**Pré-requisito:** nenhum arquivo separado pra anexar — o diagnóstico interativo já cobre
contexto de negócio, História Real e Ikigai no mesmo fluxo (ver nota abaixo).

**MENSAGEM (WhatsApp):**
```
Seja bem-vinda(o) ao Sprint do Método! Que bom te ter aqui.

Antes da nossa primeira sessão (Semana 1 — Imersão), preciso que você responda
um diagnóstico rápido — ele já cobre tudo que eu preciso saber: seu contexto de
negócio, sua história real e seu ikigai. É num único lugar, e se precisar parar
no meio fica salvo sozinho, pode continuar depois de onde parou.

Responde aqui: https://vendas.incubadoradeexpert.com.br/sprint-do-metodo/diagnostico/

Assim que você finalizar, eu recebo suas respostas e entro em contato pra
agendarmos nossa Semana 1.

Parabéns pela decisão!
```

**Por que esse formato:**
- Sem lista numerada de "2 coisas pra fazer" (formato antigo, Forms) — hoje é 1 coisa só, o
  diagnóstico interativo já resolve tudo. Simplificação real: o link do formulário de
  diagnóstico é a mesma coisa que os 2 arquivos que existiam antes (`Minha História Real` +
  `Meu Ikigai`), unificados na Seção 3 (História Real) e Seção 4 (Ikigai) do
  `diagnostico-interativo.html` — não precisa anexar nada.
- Não pede pro cliente chamar a Karol no WhatsApp — ela já é avisada por e-mail automaticamente
  (ver "O que acontece quando o cliente termina" abaixo), então pedir isso na mensagem seria
  redundante. **Decisão da Karol (14/09):** tirar essa linha.
- Fecha com "eu entro em contato pra agendarmos" (não "eu marco") — quem inicia o agendamento
  é a Karol, depois de ver as respostas, não o cliente escolhendo horário sozinho.
  **Decisão da Karol (14/09).**
- Não repete "qual seu melhor horário" na mensagem — isso já é a última pergunta do diagnóstico
  (Seção 5), perguntar de novo seria redundante.
- Tom: direto, sem "Sprint" explicado de novo (cliente acabou de comprar, já sabe o que é).

**O que acontece quando o cliente termina o diagnóstico (confirmado no código, 14/09):**
- **Automático, sempre, sem precisar de ação do cliente:** as respostas vão pra uma planilha
  (Google Sheets, via `sendToSheet()`) **e** a Karol recebe e-mail com o conteúdo
  (`MailApp.sendEmail` pro `karolsenna@incubadoradeexpert.com.br`, configurado no Apps Script —
  ver `setup-planilha-automatica.md`). Isso dispara assim que o cliente chega na tela final,
  antes de qualquer clique.
- **Opcional, botão "Avisar a Karol no WhatsApp →":** abre um WhatsApp pré-preenchido pro
  cliente mandar um "oi, terminei" — sinal mais rápido/informal, mas não é a notificação real
  (o e-mail já garante isso independente do cliente clicar ou não).
- **Opcional, botão "Baixar uma cópia pra mim":** gera um PDF das respostas via jsPDF **no
  navegador do próprio cliente** e baixa localmente pra ele guardar — não é enviado pra Karol,
  é só cópia pessoal de quem respondeu.

**Fonte:** substitui a versão em `sprint-do-metodo/materiais/Diagnóstico de Início - Sprint do
Método.md` (que ainda descreve o fluxo antigo de Forms + 2 arquivos anexos — desatualizado,
mantido só como referência histórica das perguntas originais, não como o processo real de hoje).

---

## Estado da automação (14/09/2026)

**Hoje é 100% manual.** Não existe nada ligando "pagamento confirmado" → "mensagem enviada":

- O webhook da Voomp (`business/campanhas/area-de-membros/site/api/webhook-voomp.js`) só grava
  matrícula/acesso na Área de Membros — não dispara mensagem nenhuma, não notifica a Karol.
- A Karol precisa perceber a venda sozinha (painel da Voomp) e copiar/colar a mensagem manualmente.

**Se quiser automatizar depois:** rotear pro Gestor de Infra Arcane — a ideia seria o
`webhook-voomp.js` (ou um webhook irmão) disparar a mensagem certa por produto (WhatsApp via
API, ou pelo menos um alerta pra Karol saber que precisa mandar). Este arquivo já fica pronto
como fonte das mensagens por produto quando isso for construído.

**Próximo passo combinado:** adaptar esse mesmo formato pros demais produtos (Método Express,
Método VIP, Expert360º, Diagnóstico Ferramentas, Grupo, Individual) — cada um entra numa seção
nova aqui, mesma lógica: só o que muda de fato entre eles.
