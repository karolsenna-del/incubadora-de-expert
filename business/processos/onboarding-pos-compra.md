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

## 2. Individual — R$10.000/12m (3x R$1.035 no cartão ou à vista)

**Quando enviar:** assim que o pagamento/contrato for confirmado (Voomp, produto `individual`,
checkout `/16367` — ou fechamento manual via PIX/contrato quando for o caso, já que é venda
1:1 de alto ticket).

**Pré-requisito:** nenhum arquivo separado pra anexar. A página de onboarding
(`onboarding.incubadoradeexpert.com.br`) já explica a jornada de 12 meses, os encontros, o
suporte e onde preencher o DNA do Expert — a mensagem só precisa apontar pra ela, não repetir
o conteúdo (fonte: `lp-onboarding-incubadora/briefing.md`, página publicada 31/08/2026).

**MENSAGEM (WhatsApp):**
```
Seja bem-vinda(o) à Incubadora de Expert! Você está começando uma jornada de
12 meses — do método autoral validado até as primeiras vendas reais.

Antes da nossa primeira sessão, dá uma passada pela página de onboarding — ela
explica como funciona a jornada, os encontros e o suporte:

https://onboarding.incubadoradeexpert.com.br

Seu acesso à Área de Membros já está liberado (usa o mesmo e-mail da compra
pra entrar):

https://membros.incubadoradeexpert.com.br

A única coisa que falta antes de eu marcar nossa 1ª sessão é você responder o
DNA do Expert (o link também está na página de onboarding) — assim que eu
receber suas respostas, entro em contato pra agendarmos.

Parabéns pela decisão!
```

**Por que esse formato:**
- Não repete o conteúdo da página de onboarding (jornada em 5 fases, encontros, suporte, Drive)
  — ela já existe e já faz isso melhor que uma mensagem de WhatsApp conseguiria. A mensagem só
  entrega os 2 links e o próximo passo.
- Mesmo padrão de fechamento do Sprint: "eu entro em contato pra agendarmos" (não o cliente
  escolhendo sozinho) + "Parabéns pela decisão!" no final. **Confirmado pela Karol (14/09)**
  que esse padrão vale também pra Individual.
- Menciona "mesmo e-mail da compra" pro login na Área de Membros — gap real já documentado
  (checkout vs. login), mesma frase já usada na página de vendas do Sprint.

**O que acontece quando o cliente termina o DNA do Expert:** mesmo padrão do Sprint — o
`diagnostico-interativo.html` do DNA do Expert (`lp-onboarding-incubadora/dna-do-expert/`) está
na lista dos "5 diagnósticos" corrigidos em 11/09 (ver contexto-dinamico.md) — Karol recebe
e-mail automático quando o aluno termina, não depende de aviso manual.

**Pendência real que isso resolve:** este é o item que ficou em aberto desde a weekly de 02/09
("mensagem de boas-vindas atualizada com os links da página de onboarding e da área de membros")
— registrado como `[ ]` não feito em
`incubadora-de-expert-individual/checklist-producao.md` linha 13. Ao aprovar esta mensagem,
esse item pode ser marcado como concluído.

**Grupo (R$5.000/12m) — ADIADO DE PROPÓSITO (decisão da Karol, 14/09).** A página de onboarding
atual descreve especificamente o formato **1:1** ("programa personalizado 1:1", "14 sessões
1:1") — não serve pro Grupo sem ajuste, e o Grupo já tem 2 alunas reais (Rosiani, Analia). A
Karol decidiu: (1) terminar as mensagens dos outros produtos primeiro, (2) só depois construir
uma página de onboarding própria pro Grupo (rotear pro Squad LPago Arcane ou adaptar a existente
— decidir na hora), (3) escrever a mensagem do Grupo depois que a página existir. Não escrever
essa mensagem agora — ficaria presa numa página que descreve a experiência errada.

---

## 3. Expert360º — R$497 (funil) / R$697 (plataforma)

**Quando enviar:** assim que o pagamento aparecer confirmado (Voomp, produto `expert360`,
checkout `/15514`).

**Pré-requisito:** nenhum — checkout automatizado, sem contato pessoal antes da compra
(diferente de todos os outros produtos desta lista).

**MENSAGEM (WhatsApp):**
```
Seja bem-vinda(o) ao Expert360º! Seu acesso já está liberado na Área de
Membros — usa o mesmo e-mail da compra pra entrar:

https://membros.incubadoradeexpert.com.br

O curso é no seu ritmo: 5 módulos (M0 a M4), com um agente de IA te
acompanhando em cada etapa.

Parabéns pela decisão!
```

**Por que esse formato:**
- Sem "próxima sessão" nem "vou entrar em contato" — não existe encontro marcado, é self-paced.
  Diferente de todos os outros produtos da lista.
- **Removido (decisão da Karol, 14/09):** a frase original tinha "não precisa de agenda comigo"
  — tirado porque passa a ideia de que o aluno está sozinho no processo, o que pode gerar
  frustração. O agente de IA por módulo já comunica acompanhamento sem prometer contato pessoal
  que não existe nesse produto.
- Sem link de diagnóstico — o Expert360º não tem etapa de diagnóstico prévio, o aluno entra
  direto no curso.

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
Método VIP, Expert360º, Diagnóstico Ferramentas, Grupo) — cada um entra numa seção nova aqui,
mesma lógica: só o que muda de fato entre eles. Grupo provavelmente reaproveita quase 100% da
seção do Individual (ver nota lá).
