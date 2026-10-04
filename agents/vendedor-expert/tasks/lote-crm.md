---
task: "Lote do CRM"
responsavel: "@vendedor-expert"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Pedido da Karol (quantidade, filtro opcional: origem, status, urgência)"
Saida: "Lista priorizada com mensagem por lead + linha de CRM pra colar"
Checklist:
  - "Planilha lida (só leitura)"
  - "Priorização aplicada"
  - "Abertura por origem e toque de cadência corretos"
  - "Limites de canal respeitados"
  - "Nenhum dado de lead salvo em arquivo"
execution_type: "interactive"
---

# Task: Lote do CRM

Segue o **SOP-002** do playbook.

## 1. Ler a planilha
- Conector Google Drive → `download_file_content` no id `1BD4L6toolVi17Of1PrwmNFnRQprk8obV6wWN_lLatn0` com `exportMimeType: text/csv` (o resultado fica salvo num arquivo local).
- Priorizar com `scripts/priorizar-crm.py` (passo 2 abaixo já vem pronto do script). `read_file_content` só traz amostra — não serve pro lote.
- Falhou → pedir à Karol que exporte a aba CRM em CSV.
- **Nunca escrever** na planilha (a coluna Observação dispara sync com o Supabase).

## 2. Priorizar
1. Status `fechou` ou `desistiu` → fora
2. Próximo contato vencido ou hoje
3. Urgência (1–10) desc
4. Origem: sessao_estrategica > comprador_outro_produto > webinar_metodo_1h > grupo_whatsapp
5. Quantidade: o que a Karol pedir; padrão 10; nunca > 20 frias no dia (R-006)

## 3. Definir o toque de cada lead
Pelo **Último follow-up** e pela cadência (VOL-02 §6):

| Situação | Toque |
|----------|-------|
| Nunca contatado | 1º — curiosidade/pergunta, abertura por origem (KB §6) |
| 1 contato sem resposta há 3–5 dias | 2º — novo gatilho (prova social, evento real, conteúdo) |
| 2 contatos sem resposta há 7–10 dias | 3º — leveza (figurinha, pergunta aberta, humor) |
| 3 tentativas sem resposta | Sugerir Status `a_reativar` + Próximo contato em 30–45 dias. Sem mensagem hoje |
| Pediu pra não ser contatado | Sugerir `desistiu`. Sem mensagem |

## 4. Escrever cada mensagem
- Lê **Resumo (IA)**, **O que já tentou**, **Nicho**, **Último follow-up**
- Cita 1 coisa real da ficha; não repete objeção já descartada
- Sem oferta na 1ª mensagem; sem link na 1ª mensagem pra `grupo_whatsapp`
- Gênero neutro (R-004)

## 5. Saída (só no chat)

```
Lote de hoje — {N} leads · {canal sugerido}

1. {Nome} · {origem} · {toque nº}
{mensagem — bloco copiável}
CRM → Status: {em_conversa|follow_up_marcado|...} · Observação: "{toque nº, gancho usado}" · Próximo contato: {data}

2. ...
```

Ao final: "Me conta quem respondeu que eu sigo a conversa."

## 6. Depois
- Mission Log: registrar só "lote de N leads, origens X/Y" (R-005).
