# Cortes — Sessão de venda Dr. Diogo e Juliana (29/10/2026)

Pedido da Karol (11/11): cortar a call focando nas partes em que ela fala (não no lead). Pode usar
tela cheia, edição dinâmica e tela compartilhada quando necessário.

Fonte: Drive "Dr Diogo e Juliana - 2026/10/29 13:59 GMT-04:00 - Recording" (id 1yVBI3Jf8Y324AY3fW7Ulb5XTx6Reqnio), 1,1 GB.
Juliana fechou o Método VIP (30/10). Sessão de venda: trecho de oferta/preço fica fora dos cortes.

## Regras que valem
- Headline: rosto em tela cheia → topo (margem 4:5); tela compartilhada → centro. Caixa preta, letra branca, palavra-chave laranja.
- Sem legenda nos primeiros segundos (enquanto a headline aparece). Legenda custom-karol-laranja.
- Nada de Sanesul, nada de Black, nada de "yap/7s". Glowup leve: 2 tentativas, senão segue sem.
- Antes do render: RAM livre, fechar ChatGPT e Edge (nunca msedgewebview2), não mexer no WSL.

## Layout (1920x1080, 99min22s)
- 0-~1min: Juliana em tela cheia (celular, retrato).
- ~1min-~93min: tela compartilhada (Diagnóstico do Expert; no fim, slides do Método VIP = oferta, fora) + janelinha de quem fala à direita (1442:406, 468x264).
- ~93min-fim: Karol em tela cheia (paisagem) e Juliana — aí vale montar-corte-rosto.py.
- Tela mostra @ do Instagram do Diogo e, no topo do diagnóstico (só no começo), nome/e-mail: conferir cada corte, nada de e-mail/telefone.

## Técnico
- ffmpeg do Auroq (9.0.2) não aceita mais -filter_complex_script: rodar os scripts com o ffmpeg do winget (N-123778) na frente do PATH.
- Script novo: agents/clip-expert/scripts/montar-corte-tela.py (rosto em cima com zoom alternado a cada 5s, tela embaixo, legenda custom-karol-laranja-tela, headline no centro). Teste ok.
- Transcrição: whisper-cli small levaria horas (CPU dividida com a edição Euriliana) → faster-whisper small int8 (venv edicao-euriliana).

## Candidatos (garimpo em andamento, tempos do vídeo bruto)
- A 13:13-14:01 três personas, impossível falar com as três numa rede (criança gordinha x neném que mal respira) + "ser especialista dá trabalho"
- B 17:51-18:27 "cheguei no digital pra ensinar gestão que serve pra todo mundo" → método serve pra 2, posicionamento é 1 conversa só
- D 19:17-20:10 modelo de negócio: o urgente vende (mãe angustiada com tosse), lead entra cedo e vira paciente eterno
- E 20:39-21:29 prova com sangue nos olhos: integrativa todo mundo concorda racionalmente, mas "3 semanas sem crise" é o que vende
- G 32:23-33:00 "na Incubadora a gente não posta nenhum conteúdo até as primeiras vendas" (vende pro grupo de conhecidos)
- (fraco/específico) 31:09-31:52 app como 1º produto + vendas secretas; 33:47-34:15 vender pra médico x pra mãe
- L 46:24-46:58 "sou da área técnica, fui fazer MBA em vendas... não dá pra esperar 1 ano de cada coisa pra ter resultado"
- M 47:20-47:50 aluno de mentoria raramente faz o passo a passo até o fim; pega pedaços
- (fraco) 42:54-43:17 bônus físico vende na oferta
- C 17:14-17:35 Auroq faz tudo, as pessoas travam, nada finaliza (curto; corta antes de apresentar o serviço)

## Checklist
- [x] Baixar vídeo (raw.mp4)
- [x] Mapear layout (quem está em tela, quando tem tela compartilhada)
- [ ] Transcrever (faster-whisper small pra garimpar) → agents/clip-expert/data/transcripts/diogo-juliana-2026-10-29-small.txt
- [ ] Pontuar trechos (nota mín 7.0, foco na fala da Karol)
- [ ] Retranscrever os escolhidos com medium (legenda precisa)
- [ ] Montar cortes (montar-corte-rosto.py; tela compartilhada com headline no centro)
- [ ] Conferir frames
- [ ] Entregar pra revisão da Karol
