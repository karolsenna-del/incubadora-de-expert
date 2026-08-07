# SOP — Formalização de Contrato via ZapSign

> Fluxo pro closer formalizar a venda depois que o lead fecha. Contratos-fonte em `business/juridico/contratos/`.
> Criado: 07/08/2026 (Companion, a pedido da Karol).

## Decisão: manual formalizado, não automação

Fluxo é **manual pelo closer**, não automatizado (n8n/API ZapSign). Motivo: volume de fechamento hoje cabe folgado nos 5 documentos gratuitos/mês do ZapSign, e a escolha do contrato certo + conferência dos dados do cliente exige julgamento humano antes de mandar um documento jurídico pra assinatura — não é tarefa mecânica de "copiar campo do CRM pro contrato". Se o volume de fechamento crescer a ponto de estourar o plano gratuito com regularidade, automatizar a geração/envio vira pauta pro Gestor de Infra Arcane.

---

## Passo a passo

### 1. Lead fecha

Closer confirma o fechamento (pix caiu, ou checkout automatizado confirmou pagamento no caso do Expert360º/Grupo/Individual) e atualiza o **Status** do lead no CRM (planilha operacional) para `fechou`, registrando qual oferta foi fechada na coluna de observação.

### 2. Escolher o PDF certo

Os contratos já estão prontos, formatados na identidade visual, em `business/juridico/contratos/pdf/` — **não precisa gerar nada**, é só pegar o arquivo:

| Oferta fechada | Arquivo (`pdf/`) |
|---|---|
| Método Express | `01-metodo-express.pdf` |
| Método VIP | `02-metodo-vip.pdf` |
| Sprint do Método | `03-sprint-do-metodo.pdf` |
| Grupo (do zero) | `04-grupo.pdf` |
| Individual (do zero) | `05-individual.pdf` |
| Diagnóstico Ferramentas | `06-diagnostico-ferramentas.pdf` |
| Continuação pós-Sprint (Grupo ou Individual) | `08-aditivo-continuacao-pos-sprint.pdf` |

Expert360º **não usa este fluxo** — é o Termo de Compra (`07-expert360-termos-de-compra.pdf`), aceito por checkbox no próprio checkout, sem envio individual pra assinatura.

**Se o negócio fechado tiver alguma condição fora do padrão** (desconto, parcelamento diferente do combinado no contrato) — não uses o PDF padrão: avisa a Karol pra ajustar o `.md` de origem em `business/juridico/contratos/` e gerar uma versão específica antes de mandar pra assinatura. Isso não é tarefa do closer.

### 3. Subir no ZapSign e preencher os dados do cliente

**Testado na prática (07/08):** o campo "Texto" do ZapSign, no plano gratuito, não fica salvo em branco pro cliente preencher sozinho — só persiste se já tiver conteúdo digitado. Ou seja, quem preenche é quem está montando o envio (Karol ou o closer), não o cliente. Isso é mais simples do que o fluxo antigo (editar `.md` e rodar script pra cada venda): dá pra digitar direto em cima do PDF-modelo, dentro do próprio ZapSign, sem editor nenhum.

1. Criar novo documento no ZapSign, upload do PDF escolhido no passo 2 (o mesmo arquivo-modelo serve pra qualquer cliente daquela oferta).
2. Adicionar dois signatários: CONTRATADA (Karol) e CONTRATANTE (cliente) — nome + e-mail e/ou WhatsApp do cliente, conforme o que estiver no CRM.
3. Usar a ferramenta **Texto** do ZapSign pra clicar em cada linha em branco do bloco "CONTRATANTE" (nome completo, CPF, endereço, e-mail, telefone) e do "Local/Data" no fim, digitando os dados reais do cliente ali — as linhas já estão no PDF exatamente pra isso.
4. Marcar os campos de assinatura de cada parte (posicionar sobre os dois blocos de assinatura no fim do documento).
5. Enviar. O ZapSign notifica o cliente automaticamente (e-mail ou WhatsApp, conforme configurado).

*(Se algum dia migrar pro plano PRO do ZapSign, vale testar de novo se campo vazio pro destinatário preencher passa a funcionar — pareceu trava de plano gratuito, não limitação do documento.)*

### 4. Depois de assinado

1. Baixar o PDF assinado (com a trilha de auditoria) do ZapSign.
2. Salvar em `business/juridico/contratos-assinados/{ano}/{nome-do-cliente}-{oferta}.pdf` (pasta a criar na primeira vez que for usada — não versionar no git por conter dados pessoais do cliente; adicionar ao `.gitignore` se ainda não estiver coberto).
3. Atualizar o CRM: status do lead para `contrato assinado`, com data.

---

## Quando considerar automatizar

Sinal de que vale revisitar essa decisão: estourar os 5 documentos gratuitos do ZapSign com regularidade (2+ meses seguidos), ou o volume de fechamento justificar tirar esse trabalho manual do closer. Nesse ponto, o desenho natural seria: CRM marca `fechou` → automação (Gestor de Infra Arcane, via n8n) identifica a oferta, preenche o template e dispara pro ZapSign via API — mas isso é trabalho de infra, não deste SOP.
