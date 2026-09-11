# Agente da Proposta Validada — Registro

**Link publicado:** https://chatgpt.com/g/g-69040ce07b7481918336fb272b6cb0a2-proposta-validada
**Origem:** GPT criado manualmente direto no GPT Builder (não veio de uma mente Mind Forge — um dos 6 GPTs legados do Expert360º, junto com Persona Compradora, Promessa Transformadora, Processo Autoral, Portfólio Estratégico e Autoridade Tríplice).
**Referência de uso:** `mentoria/alunas/_template/0- Biblioteca de IAs.md` (M3 — Vendas Secretas)

## Arquivos deste registro

| Arquivo | O que é |
|---------|---------|
| `instructions-atual.md` | Instructions em produção no GPT hoje (capturadas em 11/09/2026, coladas pela Karol) |
| `instructions-v2-proposta.md` | Proposta de revisão — ainda **não aplicada** no GPT Builder, aguardando validação da Karol |

## Motivo da revisão (11/09/2026)

Karol aplicou o Agente da Proposta Validada na oferta **Mentoria Conduz Agro** e depois levou o resultado pra um segundo agente (externo, sem instruções documentadas) especializado em analisar ofertas. A análise gerada apontou gaps recorrentes que não são específicos da Conduz Agro — são falhas estruturais que o Agente da Proposta Validada pode repetir em qualquer oferta. A v2 incorpora guardrails pra evitar esses gaps:

1. **Público vago** → agora o agente PROPÕE um público delimitado com base no Dossiê da Persona já recebido (não pergunta do zero) e pede só confirmação/ajuste.
2. **Promessa somando 5+ benefícios** → nova etapa "Desejo Dominante": o agente propõe qual dos benefícios já listados é o dominante, expert confirma ou ajusta.
3. **Mecanismo virando lista de disciplinas** → instrução explícita pra nomear como sequência de ação/protocolo.
4. **Ausência de prova nunca sinalizada** → nova pergunta "Prova Existente" (essa sim precisa ser perguntada, não dá pra inferir); se não houver, a oferta marca `[PENDENTE: incluir prova]` em vez de omitir — e isso virou critério pontuado na Análise de Força da Oferta.
5. **Excesso de bônus / bônus duplicando o produto principal** → limite de 2 bônus, cada um endereçando objeção diferente das já cobertas pelos pilares.
6. **Desconto agressivo entre janelas** (a Conduz Agro caiu 37,5% pra fechar na sessão) → **corrigido após revisão da Karol**: a regra de manter o preço base estável só se aplica quando o método do próprio expert promete explicitamente "não competir por preço" — não é regra universal. Fora esse caso, o desconto entre janelas fica a critério do expert.
7. **Escassez/urgência sem justificativa real** → **corrigido após revisão da Karol**: não trava mais em "número de vagas" como único formato válido — pergunta a razão operacional real (vagas, capacidade, janela de turma, prazo de bônus, sazonalidade etc.), qualquer formato serve desde que seja real.
8. ~~CTA ausente no fim da proposta~~ → **removido após revisão da Karol**: o Bônus de Ação Rápida (decidir em até 24h da sessão) já cumpre esse papel — instrução redundante, instructions originais mantidas nesse ponto.

**Fonte:** `M3.1) Minha Proposta Validada (P4).docx` (output do agente) + `Análise conduz agro.docx` (análise + oferta revisada), ambos em `C:\Users\karol\Downloads\`.

**Revisão da Karol (11/09/2026):** apontou que os itens 6, 7 e 8 da v1 desta proposta generalizaram regras específicas da Conduz Agro ou perguntas que o próprio agente já podia responder. Corrigido — ver acima.

## Status

- [ ] Karol validou a v2
- [ ] V2 colada no GPT Builder (ação manual da Karol — este worker não tem acesso de edição ao GPT)
- [ ] Testada com uma oferta real
