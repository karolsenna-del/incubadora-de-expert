// ---------- CHAT DA EXPERT-IAs (api/chat-agente.js) ----------
// 17/11/2026 (doc: business/campanhas/area-de-membros/expert-ias-anexos-contexto.md):
// - Conversas no banco (ia_conversas): várias por agente, o aluno reabre as antigas em "Conversas".
//   A conversa antiga que estava só no navegador (localStorage) migra sozinha na primeira abertura.
// - Anexos: imagem vai pro agente ler na hora (não fica guardada; na conversa fica "Imagem enviada");
//   PDF, Word e texto viram texto aqui no navegador e entram na mensagem como [Arquivo: nome].
// - "Meu contexto" (ia_contexto): o servidor põe junto das instruções de todo agente.
// - Conversa longa: aviso com "continuar numa conversa nova" — o agente resume e a conversa nova começa
//   com o resumo; a antiga fica guardada inteira.
let chatAgenteAtual = null;
let chatConversa = null; // { id, titulo, mensagens, resumo }
let chatHistorico = [];
let chatEnviando = false;
let chatAnexos = []; // { tipo: 'imagem'|'texto', nome, dataUrl?, texto? }
let chatAvisoDispensado = false;
const CHAT_ABERTURA = 'Olá! Quero começar.';
const CHAT_CONTINUAR = 'Vamos continuar de onde paramos.';
const CHAT_AVISO_A_PARTIR = 30; // mensagens trocadas
const CHAT_MAX_IMAGENS = 4;
const CHAT_MAX_TEXTO_ARQUIVO = 60000; // caracteres por arquivo

function chatSb() { return getSupabase(); }
function chatEsc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function chatChaveLocal(agente) {
  const userId = (sessaoAtual && sessaoAtual.user && sessaoAtual.user.id) || 'anon';
  return `expert-ias:${userId}:${agente.agenteId}`;
}
const chatOculta = (m, i) => i === 0 && m.role === 'user' && (m.content === CHAT_ABERTURA || m.content === CHAT_CONTINUAR);

// ---------- banco ----------
async function chatMigrarLocal(agente) {
  let antigas = null;
  try { antigas = JSON.parse(localStorage.getItem(chatChaveLocal(agente)) || 'null'); } catch (e) { antigas = null; }
  if (!Array.isArray(antigas) || !antigas.length) return;
  const { error } = await chatSb().from('ia_conversas').insert({ agente_id: agente.agenteId, titulo: chatTituloDe(antigas) || 'Conversa anterior', mensagens: antigas });
  if (!error) { try { localStorage.removeItem(chatChaveLocal(agente)); } catch (e) {} }
  else console.error('[chat] migração da conversa local falhou', error);
}

async function chatListarConversas(agente) {
  const { data, error } = await chatSb().from('ia_conversas').select('id,titulo,atualizada_em')
    .eq('agente_id', agente.agenteId).order('atualizada_em', { ascending: false }).limit(50);
  if (error) throw error;
  return data || [];
}

async function chatCarregarConversa(id) {
  const { data, error } = await chatSb().from('ia_conversas').select('id,titulo,mensagens,resumo').eq('id', id).single();
  if (error) throw error;
  return { id: data.id, titulo: data.titulo, mensagens: Array.isArray(data.mensagens) ? data.mensagens : [], resumo: data.resumo };
}

function chatTituloDe(mensagens) {
  const primeira = mensagens.find((m, i) => m.role === 'user' && !chatOculta(m, i));
  if (!primeira) return '';
  const t = String(primeira.content).split('\n\n[Arquivo:')[0].replace(/\s+/g, ' ').trim();
  return t.length > 60 ? t.slice(0, 57) + '...' : t;
}

async function salvarChat() {
  if (!chatAgenteAtual || !chatConversa) return;
  chatConversa.mensagens = chatHistorico;
  if (!chatConversa.titulo) chatConversa.titulo = chatTituloDe(chatHistorico) || null;
  const dados = { mensagens: chatHistorico, titulo: chatConversa.titulo || chatAgenteAtual.titulo, atualizada_em: new Date().toISOString() };
  try {
    if (chatConversa.id) {
      const { error } = await chatSb().from('ia_conversas').update(dados).eq('id', chatConversa.id);
      if (error) throw error;
    } else {
      const { data, error } = await chatSb().from('ia_conversas')
        .insert({ ...dados, agente_id: chatAgenteAtual.agenteId, resumo: chatConversa.resumo || null }).select('id').single();
      if (error) throw error;
      chatConversa.id = data.id;
    }
  } catch (e) {
    // banco fora do ar: guarda no navegador pra não perder (migra de volta na próxima abertura)
    console.error('[chat] não salvou no banco', e);
    try { localStorage.setItem(chatChaveLocal(chatAgenteAtual), JSON.stringify(chatHistorico)); } catch (e2) {}
  }
}

// ---------- abrir / trocar conversa ----------
async function abrirChatAgente(agente) {
  chatAgenteAtual = agente;
  document.getElementById('chat-agente-titulo').textContent = agente.titulo;
  document.getElementById('chat-mensagens').innerHTML = '<div class="chat-msg chat-msg-carregando">Abrindo sua conversa...</div>';
  document.getElementById('chat-input').value = '';
  chatLimparAnexos();
  chatFecharLista();
  document.getElementById('modal-chat-agente').classList.add('visivel');
  try {
    await chatMigrarLocal(agente);
    const lista = await chatListarConversas(agente);
    if (lista.length) { await chatMostrarConversa(await chatCarregarConversa(lista[0].id)); return; }
  } catch (e) {
    console.error('[chat] não carregou as conversas', e);
  }
  novaConversaChat();
}

async function chatMostrarConversa(conversa) {
  chatConversa = conversa;
  chatHistorico = conversa.mensagens;
  chatAvisoDispensado = false;
  const caixa = document.getElementById('chat-mensagens');
  caixa.innerHTML = '';
  if (conversa.resumo) chatAdicionarNota('Esta conversa continua uma anterior. O agente recebeu o resumo do que vocês já fizeram; a conversa antiga está em "Conversas".');
  chatHistorico.forEach((m, i) => { if (!chatOculta(m, i)) adicionarMensagemChat(m.role, m.content); });
  chatAtualizarAviso();
}

function novaConversaChat(resumo) {
  if (!chatAgenteAtual || chatEnviando) return;
  const comResumo = typeof resumo === 'string' && resumo.trim();
  chatConversa = { id: null, titulo: null, mensagens: [], resumo: comResumo ? resumo : null };
  chatHistorico = [];
  chatAvisoDispensado = false;
  chatFecharLista();
  document.getElementById('chat-mensagens').innerHTML = '';
  if (comResumo) chatAdicionarNota('Conversa nova, continuando a anterior: o agente recebeu o resumo do que vocês já fizeram. A conversa antiga continua guardada em "Conversas".');
  chatAtualizarAviso();
  // O agente abre a conversa (como o Custom GPT faz ao receber o primeiro "oi").
  enviarMensagemChat(comResumo ? CHAT_CONTINUAR : CHAT_ABERTURA);
}

function fecharChatAgente() {
  document.getElementById('modal-chat-agente').classList.remove('visivel');
  chatAgenteAtual = null;
  chatConversa = null;
}

async function chatAlternarLista() {
  const painel = document.getElementById('chat-lista');
  if (!painel.hidden) { chatFecharLista(); return; }
  painel.hidden = false;
  painel.innerHTML = '<p class="chat-lista-vazia">Carregando...</p>';
  try {
    const lista = await chatListarConversas(chatAgenteAtual);
    painel.innerHTML = lista.length
      ? lista.map((c) => '<button type="button" class="chat-lista-item' + (chatConversa && c.id === chatConversa.id ? ' atual' : '') + '" data-id="' + c.id + '"><span>' + chatEsc(c.titulo || 'Conversa') + '</span><small>' +
          new Date(c.atualizada_em).toLocaleDateString('pt-BR') + '</small></button>').join('')
      : '<p class="chat-lista-vazia">Ainda não tem conversas salvas com este agente.</p>';
    painel.querySelectorAll('[data-id]').forEach((b) => b.addEventListener('click', async () => {
      if (chatEnviando) return;
      chatFecharLista();
      document.getElementById('chat-mensagens').innerHTML = '<div class="chat-msg chat-msg-carregando">Abrindo...</div>';
      try { await chatMostrarConversa(await chatCarregarConversa(b.dataset.id)); }
      catch (e) { document.getElementById('chat-mensagens').innerHTML = ''; adicionarMensagemChat('erro', 'Não consegui abrir essa conversa.'); }
    }));
  } catch (e) {
    painel.innerHTML = '<p class="chat-lista-vazia">Não consegui carregar as conversas.</p>';
  }
}
function chatFecharLista() { const p = document.getElementById('chat-lista'); if (p) p.hidden = true; }

// ---------- conversa longa ----------
function chatContaTrocadas() { return chatHistorico.filter((m, i) => !chatOculta(m, i)).length; }
function chatAtualizarAviso() {
  const aviso = document.getElementById('chat-aviso-longa');
  if (!aviso) return;
  aviso.hidden = chatAvisoDispensado || chatContaTrocadas() < CHAT_AVISO_A_PARTIR;
}
async function chatContinuarComResumo() {
  if (!chatAgenteAtual || chatEnviando || !chatHistorico.length) return;
  const botao = document.getElementById('btn-chat-continuar');
  botao.disabled = true; botao.textContent = 'Resumindo a conversa...';
  chatEnviando = true;
  try {
    const resp = await fetch('/api/chat-agente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao: 'resumir', agenteId: chatAgenteAtual.agenteId, mensagens: chatHistorico, resumo: chatConversa && chatConversa.resumo, accessToken: sessaoAtual && sessaoAtual.access_token })
    });
    const data = await resp.json();
    if (!resp.ok || !data.resumo) throw new Error(data.error || 'sem resumo');
    chatEnviando = false;
    novaConversaChat(data.resumo);
  } catch (e) {
    chatEnviando = false;
    adicionarMensagemChat('erro', 'Não consegui resumir agora. Tente de novo em instantes.');
  } finally {
    botao.disabled = false; botao.textContent = 'Continuar numa conversa nova';
  }
}

// ---------- anexos ----------
function chatCarregarScript(url) {
  return new Promise((ok, falha) => {
    if (document.querySelector('script[src="' + url + '"]')) return ok();
    const s = document.createElement('script');
    s.src = url; s.onload = ok; s.onerror = () => falha(new Error('não carregou ' + url));
    document.head.appendChild(s);
  });
}

function chatReduzirImagem(arquivo) {
  return new Promise((ok, falha) => {
    const leitor = new FileReader();
    leitor.onerror = () => falha(new Error('não leu a imagem'));
    leitor.onload = () => {
      const img = new Image();
      img.onerror = () => falha(new Error('imagem inválida'));
      img.onload = () => {
        const max = 1600, escala = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * escala); c.height = Math.round(img.height * escala);
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        ok(c.toDataURL('image/jpeg', 0.85));
      };
      img.src = leitor.result;
    };
    leitor.readAsDataURL(arquivo);
  });
}

// PDF, Word (.docx) e texto -> texto
async function chatLerTextoDeArquivo(arquivo) {
  const nome = arquivo.name.toLowerCase();
  if (nome.endsWith('.pdf')) {
    await chatCarregarScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const pdf = await window.pdfjsLib.getDocument({ data: await arquivo.arrayBuffer() }).promise;
    const paginas = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const pg = await pdf.getPage(i);
      const tc = await pg.getTextContent();
      paginas.push(tc.items.map((it) => it.str + (it.hasEOL ? '\n' : ' ')).join(''));
    }
    return paginas.join('\n\n');
  }
  if (nome.endsWith('.docx')) {
    await chatCarregarScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
    const r = await window.mammoth.extractRawText({ arrayBuffer: await arquivo.arrayBuffer() });
    return r.value;
  }
  if (/\.(txt|md|csv)$/.test(nome) || arquivo.type.startsWith('text/')) return await arquivo.text();
  throw new Error('formato');
}

async function chatAdicionarArquivos(lista) {
  for (const arquivo of lista) {
    try {
      if (arquivo.type.startsWith('image/')) {
        if (chatAnexos.filter((a) => a.tipo === 'imagem').length >= CHAT_MAX_IMAGENS) { chatAvisoAnexo('Até ' + CHAT_MAX_IMAGENS + ' imagens por mensagem.'); continue; }
        chatAnexos.push({ tipo: 'imagem', nome: arquivo.name, dataUrl: await chatReduzirImagem(arquivo) });
      } else {
        let texto = (await chatLerTextoDeArquivo(arquivo)).trim();
        if (!texto) { chatAvisoAnexo('Não achei texto em ' + arquivo.name + '. Se for um PDF de imagem, mande prints das páginas.'); continue; }
        if (texto.length > CHAT_MAX_TEXTO_ARQUIVO) { texto = texto.slice(0, CHAT_MAX_TEXTO_ARQUIVO); chatAvisoAnexo(arquivo.name + ' é grande: vai o começo dele.'); }
        chatAnexos.push({ tipo: 'texto', nome: arquivo.name, texto });
      }
    } catch (e) {
      chatAvisoAnexo(e.message === 'formato'
        ? arquivo.name + ': esse formato não dá. Use imagem, PDF, Word (.docx) ou texto.'
        : 'Não consegui ler ' + arquivo.name + '.');
    }
  }
  chatMostrarAnexos();
}
function chatAvisoAnexo(t) { adicionarMensagemChat('erro', t); }
function chatLimparAnexos() { chatAnexos = []; chatMostrarAnexos(); }
function chatMostrarAnexos() {
  const el = document.getElementById('chat-anexos');
  if (!el) return;
  el.hidden = !chatAnexos.length;
  el.innerHTML = chatAnexos.map((a, i) => '<span class="chat-anexo">' + (a.tipo === 'imagem' ? 'Imagem: ' : 'Arquivo: ') + chatEsc(a.nome) +
    '<button type="button" data-tirar="' + i + '" aria-label="Tirar ' + chatEsc(a.nome) + '">×</button></span>').join('');
  el.querySelectorAll('[data-tirar]').forEach((b) => b.addEventListener('click', () => { chatAnexos.splice(Number(b.dataset.tirar), 1); chatMostrarAnexos(); }));
}

// ---------- mensagens na tela ----------
function chatAdicionarNota(texto) {
  const div = document.createElement('div');
  div.className = 'chat-nota';
  div.textContent = texto;
  document.getElementById('chat-mensagens').appendChild(div);
}

function adicionarMensagemChat(role, texto) {
  const div = document.createElement('div');
  div.className = `chat-msg chat-msg-${role}`;
  // Resposta do agente vem em markdown (tabelas do Canvas, listas, negrito) — renderiza sanitizado.
  if (role === 'assistant' && window.marked && window.DOMPurify) {
    div.classList.add('md');
    div.innerHTML = DOMPurify.sanitize(marked.parse(texto || ''));
  } else if (role === 'user') {
    // o texto dos arquivos vai pro agente, mas na tela aparece só o nome
    const partes = String(texto || '').split('\n\n[Arquivo: ');
    div.textContent = partes[0].replace(/\n\n\[Imagem enviada: [^\]]*\]/g, '');
    const nomes = partes.slice(1).map((p) => 'Arquivo: ' + p.split(']')[0]).concat((partes[0].match(/\[Imagem enviada: [^\]]*\]/g) || []).map((m) => 'Imagem: ' + m.slice(17, -1)));
    if (nomes.length) {
      const l = document.createElement('small');
      l.className = 'chat-msg-anexos';
      l.textContent = nomes.join(' · ');
      div.appendChild(l);
    }
  } else {
    div.textContent = texto;
  }
  if (role === 'assistant') div.appendChild(criarAcoesResposta(texto, div.innerHTML));
  document.getElementById('chat-mensagens').appendChild(div);
  div.scrollIntoView({ block: 'end' });
}

// Botões "Copiar" e "Baixar" em cada resposta do agente — o aluno guarda o resultado (Dossiê, Promessa,
// Canvas…) no Drive dele sem precisar selecionar a conversa. Copia como HTML + texto, pra tabela colar
// inteira no Google Docs/Word; baixa como .doc (HTML que Word e Google Docs abrem com a tabela).
function criarAcoesResposta(texto, html) {
  const acoes = document.createElement('div');
  acoes.className = 'chat-acoes';

  const btnCopiar = document.createElement('button');
  btnCopiar.type = 'button';
  btnCopiar.textContent = 'Copiar';
  btnCopiar.addEventListener('click', async () => {
    try {
      if (window.ClipboardItem) {
        await navigator.clipboard.write([new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([texto], { type: 'text/plain' })
        })]);
      } else {
        await navigator.clipboard.writeText(texto);
      }
      btnCopiar.textContent = 'Copiado ✓';
    } catch (e) {
      btnCopiar.textContent = 'Não deu pra copiar';
    }
    setTimeout(() => { btnCopiar.textContent = 'Copiar'; }, 2000);
  });

  const btnBaixar = document.createElement('button');
  btnBaixar.type = 'button';
  btnBaixar.textContent = 'Baixar resultado';
  btnBaixar.addEventListener('click', () => {
    const titulo = chatAgenteAtual ? chatAgenteAtual.titulo : 'Expert-IAs';
    const data = new Date().toISOString().slice(0, 10);
    const doc = `<html><head><meta charset="utf-8"><title>${titulo}</title>
<style>body{font-family:Arial,sans-serif;font-size:11pt;line-height:1.5}table{border-collapse:collapse}th,td{border:1px solid #999;padding:6px;vertical-align:top}</style>
</head><body><h2>${titulo}</h2><p style="color:#777">Expert-IAs · Incubadora de Expert · ${data.split('-').reverse().join('/')}</p>${html}</body></html>`;
    const url = URL.createObjectURL(new Blob(['﻿', doc], { type: 'application/msword' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${titulo} - ${data}.doc`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  acoes.append(btnCopiar, btnBaixar);
  return acoes;
}

// ---------- enviar ----------
async function enviarMensagemChat(textoAutomatico) {
  const input = document.getElementById('chat-input');
  const automatico = typeof textoAutomatico === 'string';
  const digitado = automatico ? textoAutomatico : input.value.trim();
  const anexos = automatico ? [] : chatAnexos.slice();
  if ((!digitado && !anexos.length) || !chatAgenteAtual || chatEnviando) return;

  // monta o que vai pro agente: texto + conteúdo dos arquivos + marca das imagens
  let texto = digitado || 'Segue o anexo.';
  for (const a of anexos) {
    texto += a.tipo === 'texto' ? '\n\n[Arquivo: ' + a.nome + ']\n' + a.texto : '\n\n[Imagem enviada: ' + a.nome + ']';
  }
  const imagens = anexos.filter((a) => a.tipo === 'imagem').map((a) => a.dataUrl);

  chatEnviando = true;
  document.getElementById('btn-chat-enviar').disabled = true;
  if (!automatico) { input.value = ''; chatLimparAnexos(); }
  chatHistorico.push({ role: 'user', content: texto });
  if (!automatico) adicionarMensagemChat('user', texto);
  adicionarMensagemChat('carregando', imagens.length ? 'Olhando a imagem...' : 'Pensando...');

  const accessToken = sessaoAtual && sessaoAtual.access_token;
  try {
    const resp = await fetch('/api/chat-agente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agenteId: chatAgenteAtual.agenteId, mensagens: chatHistorico, imagens, resumo: chatConversa && chatConversa.resumo, accessToken })
    });
    let data = {};
    try { data = await resp.json(); } catch (e) { data = { error: resp.status === 413 ? 'Os anexos ficaram grandes demais. Mande menos imagens por vez.' : '' }; }
    document.querySelector('.chat-msg-carregando')?.remove();
    if (!resp.ok) {
      chatHistorico.pop(); // mensagem não respondida sai do histórico — aluno reenvia
      if (!automatico) { input.value = digitado; chatAnexos = anexos; chatMostrarAnexos(); }
      adicionarMensagemChat('erro', data.error || 'Erro ao falar com o agente.');
      return;
    }
    chatHistorico.push({ role: 'assistant', content: data.resposta });
    adicionarMensagemChat('assistant', data.resposta);
    salvarChat();
    chatAtualizarAviso();
  } catch (err) {
    document.querySelector('.chat-msg-carregando')?.remove();
    chatHistorico.pop();
    if (!automatico) { input.value = digitado; chatAnexos = anexos; chatMostrarAnexos(); }
    adicionarMensagemChat('erro', 'Erro de conexão com o agente.');
  } finally {
    chatEnviando = false;
    document.getElementById('btn-chat-enviar').disabled = false;
  }
}

// ---------- Meu contexto ----------
const CONTEXTO_CAMPOS = [
  ['persona', 'Dossiê da persona', 'Quem é a sua persona: o que ela vive, diz, sente, quer e teme. Cole o dossiê do Agente da Persona Compradora.'],
  ['posicionamento', 'Posicionamento', 'Sua promessa, sua autoridade (Autoridade Tríplice) e o que te diferencia.'],
  ['processo', 'Processo autoral (seu método)', 'O passo a passo do seu método com os nomes de cada etapa.'],
  ['outros', 'Outras informações', 'Seus produtos e preços, seu tom de voz, palavras que você usa e as que evita.'],
];

async function abrirMeuContexto() {
  const modal = document.getElementById('modal-meu-contexto');
  const corpo = document.getElementById('contexto-campos');
  corpo.innerHTML = '<p class="modal-texto">Carregando...</p>';
  modal.classList.add('visivel');
  let atual = {};
  try {
    const { data } = await chatSb().from('ia_contexto').select('persona,posicionamento,processo,outros').maybeSingle();
    atual = data || {};
  } catch (e) { atual = {}; }
  corpo.innerHTML = CONTEXTO_CAMPOS.map(([k, titulo, dica]) =>
    '<div class="contexto-campo"><label for="ctx-' + k + '">' + titulo + '</label><small>' + dica + '</small>' +
    '<textarea id="ctx-' + k + '" rows="5">' + chatEsc(atual[k] || '') + '</textarea>' +
    '<label class="contexto-arquivo">Puxar de um arquivo (PDF, Word ou texto)<input type="file" accept=".pdf,.docx,.txt,.md" data-campo="' + k + '"></label></div>').join('');
  corpo.querySelectorAll('input[type=file]').forEach((inp) => inp.addEventListener('change', async () => {
    const f = inp.files[0]; if (!f) return;
    const area = document.getElementById('ctx-' + inp.dataset.campo);
    try {
      const t = (await chatLerTextoDeArquivo(f)).trim();
      area.value = (area.value.trim() ? area.value.trim() + '\n\n' : '') + t;
    } catch (e) { alertaContexto('Não consegui ler ' + f.name + '. Use PDF, Word (.docx) ou texto.'); }
    inp.value = '';
  }));
}
function alertaContexto(t) { const el = document.getElementById('contexto-status'); if (el) el.textContent = t; }

async function salvarMeuContexto() {
  const botao = document.getElementById('btn-contexto-salvar');
  botao.disabled = true;
  const dados = { atualizado_em: new Date().toISOString() };
  CONTEXTO_CAMPOS.forEach(([k]) => { dados[k] = document.getElementById('ctx-' + k).value.trim() || null; });
  dados.user_id = sessaoAtual && sessaoAtual.user && sessaoAtual.user.id;
  const { error } = await chatSb().from('ia_contexto').upsert(dados);
  botao.disabled = false;
  if (error) { alertaContexto('Não salvou: tente de novo.'); return; }
  alertaContexto('Salvo. Os agentes já usam nas próximas mensagens.');
  setTimeout(() => { document.getElementById('modal-meu-contexto').classList.remove('visivel'); alertaContexto(''); }, 1200);
}

document.addEventListener('DOMContentLoaded', () => {
  const ligar = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
  ligar('btn-chat-conversas', chatAlternarLista);
  ligar('btn-chat-contexto', abrirMeuContexto);
  ligar('btn-chat-continuar', chatContinuarComResumo);
  ligar('btn-chat-agora-nao', () => { chatAvisoDispensado = true; chatAtualizarAviso(); });
  ligar('btn-chat-anexar', () => document.getElementById('chat-arquivo').click());
  ligar('btn-contexto-salvar', salvarMeuContexto);
  ligar('btn-contexto-fechar', () => document.getElementById('modal-meu-contexto').classList.remove('visivel'));
  const arq = document.getElementById('chat-arquivo');
  if (arq) arq.addEventListener('change', async () => { await chatAdicionarArquivos([...arq.files]); arq.value = ''; });
  // colar print direto na caixa de mensagem
  const input = document.getElementById('chat-input');
  if (input) input.addEventListener('paste', (e) => {
    const imgs = [...(e.clipboardData ? e.clipboardData.files : [])].filter((f) => f.type.startsWith('image/'));
    if (imgs.length) { e.preventDefault(); chatAdicionarArquivos(imgs); }
  });
});
