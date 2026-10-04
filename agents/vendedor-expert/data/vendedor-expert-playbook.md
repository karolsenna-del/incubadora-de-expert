# Vendedor Expert — Playbook

> SOPs do worker. Consultar ANTES de iniciar qualquer missão. Se já tem SOP, seguir.
> **Regras operacionais:** ver `vendedor-expert-rules.md` (carregado no start).

---

## Tier 1 — Recorrentes

### [SOP-001] Responder uma conversa (copiloto)
**Criado em:** 03/10/2026 · **Última execução:** — · **Trigger:** Karol cola print/texto · **Tempo:** 1–2 min
**Ferramentas:** KB ETL (REPERTORIO §1), KB Incubadora §3, §7, §8, §12
**Regras obrigatórias:** R-001, R-002, R-003, R-004, R-007
**Passos:**
1. Ler a conversa inteira; identificar: etapa (prospecção / condução / fechamento / follow-up), última fala da lead, objeção literal (se houver), formato (texto/áudio)
2. Se a lead está no CRM e a Karol citou o nome → ler a ficha (Resumo IA, O que já tentou, Último follow-up)
3. Achar o script-base no roteador (REPERTORIO §1) e a adaptação Incubadora (KB §12)
4. Se há objeção → mapa unificado (KB §7) + produto que quebra (KB §2.1.1) + prova (KB §8) + bônus documentado ou sugestão do cardápio (R-003)
5. Escrever 1 mensagem (no máximo 1 alternativa, se houver dúvida real de tom)
   - Verificar: avança 1 passo, termina com pergunta, copo d'água, gênero ok
6. Entregar no formato da saída
**Output:**
```
Etapa: {etapa} · Objeção: {literal ou "nenhuma"} · Oferta: {sugerida + 1 linha de porquê | "ainda não"}

{mensagem pronta — bloco copiável}

Anexar: {prova, se houver}
[Sugestão de bônus (aprovar antes de mandar): ...]   ← só se aplicável
Próximo passo: {o que esperar / quando retomar}
```
**Troubleshooting:**
- Lead mandou áudio → entregar roteiro de áudio (fala corrida, 30–60s)
- Conversa sem contexto suficiente → perguntar 1 coisa à Karol, não 5

### [SOP-002] Lote do dia a partir do CRM
**Criado em:** 03/10/2026 · **Trigger:** "quem eu chamo hoje?" · **Tempo:** 5–10 min
**Ferramentas:** conector Google Drive (`read_file_content`, id `1BD4L6toolVi17Of1PrwmNFnRQprk8obV6wWN_lLatn0`), KB §6, §9
**Regras obrigatórias:** R-001, R-002, R-005, R-006
**Passos:**
1. Baixar a planilha inteira: `download_file_content` (id acima, `exportMimeType: text/csv`). O resultado é grande e fica salvo num arquivo local fora do repositório — **não** usar `read_file_content` pro lote (ele só devolve uma amostra de ~13 linhas; achado no teste de 03/10)
2. Priorizar com o script: `python agents/vendedor-expert/scripts/priorizar-crm.py "<arquivo salvo>" --n 10 [--origem X] [--status Y]`
   - O script filtra fechou/desistiu e ordena: Próximo contato vencido/hoje → Urgência desc → origem (sessão > comprador > webinar > grupo); imprime só os N escolhidos
3. Conferir a contagem por status que o script mostra (vira a leitura do funil)
4. Selecionar até 10 (ou o número que a Karol pedir; nunca > 20 frias)
5. Pra cada lead: abertura por origem (KB §6) + toque de cadência correto (1º, 2º ou 3º contato, pelo Último follow-up)
6. Gerar a linha de CRM: Status sugerido · Observação · Próximo contato (data)
**Output:** por lead → Nome (só no chat) · origem · toque nº · mensagem (bloco) · linha de CRM
**Troubleshooting:**
- Download falhou → pedir à Karol que exporte a aba CRM em CSV e passe o caminho (o script aceita CSV direto)
- Ficha só com telefone → abertura de grupo_whatsapp (perguntar o nome)

### [SOP-003] Rotina do dia
**Criado em:** 03/10/2026 · **Trigger:** "bora a rotina" · **Tempo:** 3 min
**Passos:**
1. Perguntar (ou ler do CRM) o que está pendente
2. Montar os 5 blocos (VOL-01 §9) com nomes/ações concretos
3. Se a Karol só tem 1 bloco → prospecção (regra anti-burnout)
4. No "fecha meu dia" → checklist diário (6 itens) + o que vira Próximo contato de amanhã

---

## Tier 2 — Sob demanda

### [SOP-004] Levantada de mão
**Criado em:** 03/10/2026 · **Trigger:** "preciso de stories pra gerar lead"
**Regras obrigatórias:** R-001, R-004
**Passos:**
1. Perguntar o objetivo (abrir conversa, chamar pra live, testar oferta) e o canal (story, sequência, grupo, feed, Consultoria 0800)
2. Usar o template do VOL-01 §4 / VOL-02 §4 com dores e vocabulário da Laura (KB §4)
3. Nada de venda; CTA de manifestação (emoji, "manda um oi", palavra-chave)
4. Neutralizar gênero (Consultoria 0800: "5 pessoas", não "5 mulheres")
**Output:** textos prontos, um bloco por story/post

---

## Tier 3 — One-shot

(nenhum ainda)

---

## Template de SOP

### [SOP-XXX] {Nome}
**Criado em:** {data} · **Última execução:** {data} · **Trigger:** {gatilho} · **Tempo:** {estimativa}
**Ferramentas:** {quais}
**Regras obrigatórias:** {R-xxx}
**Pré-requisitos:** {o que precisa}
**Passos:**
1. {passo} — Verificar: {como saber que deu certo}
**Output esperado:** {o que sai}
**Troubleshooting:** {problema}: {solução}
