// Cria os modelos de onboarding pós-compra na WABA do 99884-3543.
// Texto: business/processos/onboarding-pos-compra.md (Central da Incubadora), com "Olá {nome}",
// linha de suporte (4690, 9h-18h) e assinatura Karol Senna.
// Uso: node modelos-onboarding.mjs [--enviar]   (sem --enviar só mostra)
const WABA = '1086482547720701';
const TOKEN = process.env.WA_TOKEN;
const SUPORTE = 'Dúvidas? Fala com o suporte no WhatsApp (67) 99232-4690, de segunda a sexta, das 9h às 18h.';
const ASSINA = 'Karol Senna';

const corpos = {
  sprint: `Seja bem-vinda(o) ao Sprint do Método! Que bom te ter aqui.

Antes da nossa primeira sessão (Semana 1 — Imersão), preciso que você responda um diagnóstico rápido — ele já cobre tudo que eu preciso saber: seu contexto de negócio, sua história real e seu ikigai. É num único lugar, e se precisar parar no meio fica salvo sozinho, pode continuar depois de onde parou.

Responde aqui: https://vendas.incubadoradeexpert.com.br/sprint-do-metodo/diagnostico/

Assim que você finalizar, eu recebo suas respostas e entro em contato pra agendarmos nossa Semana 1.

Parabéns pela decisão!`,
  individual: `Seja bem-vinda(o) à Incubadora de Expert! Você está começando uma jornada de 12 meses — do método autoral validado até as primeiras vendas reais.

Antes da nossa primeira sessão, dá uma passada pela página de onboarding — ela explica como funciona a jornada, os encontros e o suporte:
https://onboarding.incubadoradeexpert.com.br

Seu acesso à Área de Membros já está liberado (usa o mesmo e-mail da compra pra entrar):
https://membros.incubadoradeexpert.com.br

A única coisa que falta antes de eu marcar nossa 1ª sessão é você responder o DNA do Expert (o link também está na página de onboarding) — assim que eu receber suas respostas, entro em contato pra agendarmos.

Parabéns pela decisão!`,
  grupo: `Seja bem-vinda(o) à Mentoria em Grupo da Incubadora de Expert! Você está começando uma jornada de 12 meses — do método autoral validado até as primeiras vendas reais.

Antes de tudo, dá uma passada pela página de onboarding — ela explica como funciona a jornada, as oficinas ao vivo, as sessões comigo e o suporte:
https://onboarding.incubadoradeexpert.com.br/grupo

Seu acesso à Área de Membros já está liberado (usa o mesmo e-mail da compra pra entrar):
https://membros.incubadoradeexpert.com.br

Sua primeira entrega é responder o DNA do Expert (o link também está na página de onboarding) — assim que eu receber suas respostas, entro em contato pra agendarmos sua Sessão 1.

Parabéns pela decisão!`,
  express: `Seja bem-vinda(o) à Incubadora Express! Agora começa o nosso caminho até a sua primeira venda no digital, em 30 dias.

Antes de tudo, dá uma passada pela página de onboarding. Ela explica como funcionam as 5 sessões comigo, o ritmo de 30 dias e as suas ferramentas:
https://onboarding.incubadoradeexpert.com.br/express

Seu acesso à Área de Membros já está liberado (usa o mesmo e-mail da compra pra entrar):
https://membros.incubadoradeexpert.com.br

Sua primeira entrega é responder o DNA do Expert (o link também está na página de onboarding). Assim que eu receber suas respostas, entro em contato pra agendarmos a sua Sessão 1, de onde você já sai com a data da sua primeira Venda Secreta.

Parabéns pela decisão!`,
  vip: `Seja bem-vinda(o) ao Método VIP! Que bom te ter aqui.

Antes do nosso primeiro encontro, preciso que você responda um diagnóstico — é nele que você me conta sua persona, sua promessa e o caminho do seu método. É com essas respostas que eu chego no Encontro 1 já sabendo como te orientar melhor nos próximos passos. Se precisar parar no meio, fica salvo sozinho, pode continuar depois de onde parou.

Responde aqui: https://vendas.incubadoradeexpert.com.br/metodo-vip/diagnostico/

Assim que você finalizar, eu recebo suas respostas e entro em contato pra agendarmos nosso primeiro encontro.

Parabéns pela decisão!`,
  expert360: `Seja bem-vinda(o) ao Expert360º! Seu acesso já está liberado na Área de Membros — usa o mesmo e-mail da compra pra entrar:
https://membros.incubadoradeexpert.com.br

O curso é no seu ritmo: 5 módulos (M0 a M4), com um agente de IA te acompanhando em cada etapa.

Parabéns pela decisão!`
};

const modelos = [];
for (const [prod, corpo] of Object.entries(corpos)) {
  for (const comNome of [true, false]) {
    const abre = comNome ? 'Olá {{1}}!' : 'Olá!';
    const texto = `${abre}\n\n${corpo}\n\n${SUPORTE}\n\n${ASSINA}`;
    const body = { type: 'BODY', text: texto };
    if (comNome) body.example = { body_text: [['Maria']] };
    modelos.push({
      name: `onboarding_${prod}${comNome ? '' : '_sem_nome'}`,
      language: 'pt_BR', category: 'UTILITY', components: [body]
    });
  }
}

for (const m of modelos) {
  const n = m.components[0].text.length;
  if (!process.argv.includes('--enviar')) { console.log(m.name, n, 'caracteres'); continue; }
  const r = await fetch(`https://graph.facebook.com/v21.0/${WABA}/message_templates`, {
    method: 'POST', headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(m)
  });
  const j = await r.json();
  console.log(m.name, n, r.status, j.status || '', j.category || '', j.error ? j.error.error_user_msg || j.error.message : '');
}
