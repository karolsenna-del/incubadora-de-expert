# Briefing — Página do Diagnóstico do Expert (Mentoria Incubadora de Expert)

> Documento mestre enxuto (variante página de aplicação — não é lançamento).
> Montado pelo Atlas (Squad LPago Arcane) em 03/07/2026. Fontes: Exocortex (tese, dossiê de personas, posicionamento) + respostas da Karol + forms de pré-diagnóstico real.
> Status: APROVADO pela Karol em 03/07/2026. Handoff pro Quill (copy) em andamento.

---

## 1. OBJETIVO DA PÁGINA

Substituir o fluxo atual `bitly → Google Forms` por `página no domínio próprio → Google Forms`.

A página:
1. Apresenta a Incubadora de Expert (dores, desejos, método — SEM entregáveis, SEM preços)
2. Vende o próximo passo: a **sessão gratuita de Diagnóstico do Expert** (45 min com a Karol)
3. Qualifica e aquece quem chega antes do forms
4. Instala pixel Meta no caminho (remarketing + evento Lead)

**CTA único:** preencher o pré-diagnóstico (link pro Google Forms atual).

## 2. FUNIL E ORIGEM DO TRÁFEGO

- **Onde o link circula:** bio do Instagram + direct (Karol envia manualmente pra quem procura)
- **Nível de consciência:** morno/quente — a pessoa já conhece a Karol pelo conteúdo ou já a procurou. NÃO é tráfego frio.
- **Implicação de copy:** não precisa "provar que o problema existe" do zero. A página confirma que a Karol entendeu a dor melhor que ninguém e dá o caminho.
- **Copy única** (decisão da Karol): mesma página pra bio e direct.

## 3. O "PRODUTO" DA PÁGINA — Sessão de Diagnóstico do Expert

- Sessão gratuita de **45 minutos** com a Karol
- A pessoa preenche o pré-diagnóstico (forms) antes: negócio, persona, promessa, provas, o que já tentou, maior dificuldade
- Na sessão: discussão das respostas + orientações de pontos de melhoria + apresentação da mentoria Incubadora de Expert
- **Enquadramento na copy:** é um diagnóstico de verdade (a pessoa sai com clareza mesmo sem comprar), não uma "call de vendas" disfarçada. Mas sem esconder que a mentoria será apresentada — honestidade filtra melhor.

## 4. PÚBLICO (Bloco DOR / DESEJO / MEDO / RUMINAÇÕES)

**Persona compradora: Laura 2** — profissional liberal, 35-45 anos, autoridade no offline, já tentou o digital e se frustrou, conhece o mercado (sabe o que é lançamento, já viu "6 em 7", rejeita fórmulas prontas e hype).

| Dimensão | Na linguagem dela |
|----------|-------------------|
| **DOR** | "Eu sei muito, mas não sei estruturar isso num método que vende." Já tentou sozinha e se frustrou. Consome conteúdo e fica mais confusa. |
| **DESEJO** | Método próprio estruturado e validado. Negócio digital sólido sem virar influenciadora, sem dancinha, sem lançamento barulhento. Ser reconhecida como referência. |
| **MEDO** | Parecer amadora. Investir tempo e dinheiro sem retorno (de novo). Ficar pra trás vendo gente menos experiente crescer. |
| **RUMINAÇÕES** | "Será que vou conseguir?" / "Preciso estudar mais." / "Vejo gente menos experiente crescendo." / "Fórmulas prontas não combinam comigo." |

**Nota de linguagem:** copy pública em **masculino genérico** (40% dos alunos são homens). Perfis nomeados direto quando citar: profissional liberal, CLT, servidor. Nunca alternar gênero na mesma frase.

## 5. TESE, INIMIGO E PEÇA QUE FALTAVA

- **Frase-tese (usar como espinha dorsal):** "Diploma é o que você estudou. Método é o que você viveu."
- **Inimigo:** a crença de que credencial vende — que diploma, título e certificado dão autoridade no digital. (Inimigo = crença, nunca a pessoa.)
- **Problema impostor (o que a persona ACHA que precisa):** "organizar meu conhecimento em etapas claras e didáticas pra vender."
- **Causa oculta:** método organizado sem história é commodity. O que faz método virar movimento não é o quanto é didático — é o quanto é SEU.
- **Peça que faltava (mecanismo):** a **Narrativa do Método** — a fase da metodologia da Karol onde o expert coloca a própria vida dentro do que ensina.

## 6. AUTORIDADE DA KAROL

- Pilar: **"expert em fracassar no digital"** — autoridade visceral construída na derrota. 13 anos de serviço público + 8 tentativas que não deram certo → método nascido da experiência real, não da teoria.
- Diferencial vs. mercado: todo mundo vende do palco do sucesso; a Karol fala de quem já quebrou a cara — exatamente como a persona.

## 7. O QUE A PÁGINA NÃO REVELA

- Entregáveis da mentoria
- Preços (variam por tempo de acesso e formato grupo/individual)
- Formato dos encontros
- Tudo isso é assunto da sessão de diagnóstico.

## 8. ESTRUTURA SUGERIDA (variante do Método LP pra página de aplicação — ~8 seções)

1. **Headline** — tese + promessa de clareza (não de resultado financeiro milagroso)
2. **Identificação** — o retrato da dor (sabe muito, não vende; já tentou; fórmulas não serviram)
3. **O inimigo** — por que credencial não vende no digital
4. **A virada** — Narrativa do Método (método sem história é commodity)
5. **Quem é a Karol** — expert em fracassar no digital (autoridade visceral)
6. **O que é o Diagnóstico do Expert** — o que acontece na sessão de 45 min, o que a pessoa sai sabendo
7. **Pra quem é / pra quem não é** — filtro explícito (qualifica o lead)
8. **CTA** — preencher o pré-diagnóstico (botão → Google Forms)

Quill tem liberdade pra ajustar ordem/fusão de seções dentro do método.

## 9. ESPECIFICAÇÃO TÉCNICA

| Item | Definição |
|------|-----------|
| Domínio | `diagnostico.incubadoradeexpert.com.br` (decisão da Karol 03/07) |
| Hospedagem | Vercel (mesmo processo pavimentado da LP do mini treinamento) |
| Pixel Meta | `4188654601446070` — PageView no load + **Lead** no clique de TODOS os CTAs pro forms |
| Destino do CTA | Google Forms atual (link direto, sem embed — mantém o forms como está) |
| Design | Paleta Incubadora: preto, branco, cinza e laranja (destaque). Referência: `business/campanhas/lp-minitreinamento/index.html` |
| Forms | `https://docs.google.com/forms/d/150_Ba6N6EEBHEhPrasEIrJAgG3-o5kY4jDONHjZA2RE` |

## 10. PERGUNTAS DO FORMS (pra página conversar com ele, sem duplicar)

O forms já pede: nome, celular, sexo, idade, @, seguidores, views/comentários, tempo de expertise, visão geral do negócio, história do negócio, faturamento, lista/grupo, perfil de cliente definido, promessa, provas, urgência (1-10), principal dificuldade, meta/desejo, o que já tentou, resultado esperado da sessão.

**Implicação:** a página NÃO precisa coletar nada — só aquecer e mandar. E pode antecipar: "você vai responder um pré-diagnóstico sobre seu negócio — quanto mais sincero, mais valiosa a sessão".

## 11. PONTO DE ATENÇÃO (fora do escopo da página, mas registrado)

A descrição atual do forms fala em "se preparar para o **lançamento** do seu infoproduto" e "seu próximo **lançamento**" — dissonante com o posicionamento "sem lançamentos" que fala com a Laura 2. Recomendação: depois que a página estiver no ar, atualizar o texto de abertura do forms pra alinhar com a tese (ajuste manual da Karol no Google Forms).

---

## LOG

- 03/07 — @quill (squad-lpago-arcane): Karol atualizou a abertura do forms com a VERSÃO ALTERNATIVA (abre com a tese) — seção 11 (dissonância "lançamento") RESOLVIDA. Autorização da Karol: produzir tudo (copy completa + página) pra aprovação posterior ("faz tudo que aprovo depois").
- 03/07 — @atlas (squad-lpago-arcane): briefing aprovado pela Karol. Domínio definido: diagnostico.incubadoradeexpert.com.br. Handoff pro Quill.
- 03/07 — @atlas (squad-lpago-arcane): briefing enxuto montado a partir do Exocortex + respostas da Karol + forms real.
