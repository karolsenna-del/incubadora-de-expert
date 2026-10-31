// Área de Membros — App shell (Fase 1: layout com dados placeholder — ver js/data.js)
// Roteiro no formato "Mapa da Jornada" (checklist com progresso, timeline de módulos)

const TRILHAS = [ROTEIRO_EXPERT360, ROTEIRO_MENTORIA, TRILHA_CONSULTORIAS];
let trilhaAtivaId = null; // definido em runtime a partir das trilhas liberadas pra matrícula (ver trilhasDoAluno)
let aulaAtivaRef = null; // { moduloId, aulaIdx }
let modoFoco = false;
let sessaoAtual = null;

// ---------- MATRÍCULA REAL (tabela `matriculas`, gravada pelo webhook Voomp) ----------
// Substitui o mock MATRICULA_EXEMPLO por dado real quando há sessão logada de verdade.
// Modo preview (sem user.id real) mantém o mock do data.js intacto — QA continua funcionando.
// `expira_em` (29/08): NULL = acesso vitalício (comportamento de sempre); com data preenchida, uma
// linha expirada é tratada exatamente como "nunca comprou" — não entra em MATRICULA_EXEMPLO, então
// tudo que já filtra por essa lista (Vitrine, Roteiro, Biblioteca de IA) fica protegido automaticamente.
// Lives temporárias dos serviços (VIP/Destrava/Sprint): data até quando ainda vale, ou null.
let livesServicoAte = null;
async function carregarMatriculaReal() {
  const userId = sessaoAtual && sessaoAtual.user && sessaoAtual.user.id;
  const email = sessaoAtual && sessaoAtual.user && sessaoAtual.user.email;
  if (!userId || !email) return;

  const { data, error } = await getSupabase()
    .from('matriculas')
    .select('produto_slug, expira_em, liberado_em')
    .eq('email', email)
    .eq('ativo', true);

  if (error) { console.error('Erro ao carregar matrícula:', error); return; }

  const agora = new Date();
  MATRICULA_EXEMPLO.length = 0;
  livesServicoAte = null;
  (data || []).forEach(row => {
    if (!PRODUTOS_LIVES_TEMPORARIAS.includes(row.produto_slug) || !row.liberado_em) return;
    const ate = new Date(new Date(row.liberado_em).getTime() + DIAS_LIVES_SERVICOS * 86400000);
    if (ate > agora && (!livesServicoAte || ate > livesServicoAte)) livesServicoAte = ate;
  });
  (data || []).forEach(row => {
    if (row.expira_em && new Date(row.expira_em) <= agora) return; // expirado, trata como sem acesso
    if (!MATRICULA_EXEMPLO.includes(row.produto_slug)) MATRICULA_EXEMPLO.push(row.produto_slug);
  });
}

// ---------- EXPERT-IAs (ex-Biblioteca de Agentes de IA) ----------
// Acesso (decidido pela Karol 30/10): todo aluno do Expert360º — oferta que inclui a trilha Expert360º
// (curso, Grupo, Individual, Incubadora Express) ou o produto avulso 'biblioteca-ia'.
// Mesma lista de PRODUTOS_COM_ACESSO em api/chat-agente.js (que valida de novo no servidor) — mudar nos dois.
const PRODUTOS_COM_ACESSO_IAS = ['expert360', 'grupo', 'individual', 'incubadora-express', 'biblioteca-ia'];
function temAcessoBibliotecaIA() {
  return MATRICULA_EXEMPLO.some(slug => PRODUTOS_COM_ACESSO_IAS.includes(slug));
}

// ---------- TRILHAS LIBERADAS (por matrícula) ----------
// Vitrine mostra as 7 ofertas; Roteiro mostra Método / Aulas gravadas / Encontros (31/10):
// - Método: quem tem a trilha expert360 (TRILHA_POR_OFERTA)
// - Aulas gravadas: quem tem Método ou mentoria (Lives pra todos; Encontros em grupo o RLS só entrega pra mentoria)
// - Encontros: todo aluno — sem encontro, vira convite pra agendar sessão
function trilhasDoAluno() {
  const idsLiberados = new Set(MATRICULA_EXEMPLO.flatMap(slug => TRILHA_POR_OFERTA[slug] || []));
  const temGravadas = idsLiberados.has('expert360') || idsLiberados.has('mentoria') || !!livesServicoAte;
  return TRILHAS.filter(t => {
    if (t.id === 'mentoria') return temGravadas;
    if (t.id === 'consultorias') return true;
    return idsLiberados.has(t.id);
  });
}

function temMentoria() {
  return MATRICULA_EXEMPLO.some(slug => (TRILHA_POR_OFERTA[slug] || []).includes('mentoria'));
}

// ---------- AUTH GUARD ----------
async function checarSessao() {
  const sb = getSupabase();
  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    window.location.href = 'index.html';
    return null;
  }
  document.getElementById('user-email').textContent = session.user.email;
  return session;
}

// ---------- NOME PREFERIDO (onboarding, so pergunta uma vez) ----------
// Guardado em user_metadata do Supabase Auth — nao precisa de tabela nova (REUSE).
// Se um dia a matricula (Fase 4) trouxer o nome real da compra via webhook, esse valor
// pode ser pre-preenchido aqui em vez de perguntar, mas continua editavel (apelido != nome de pagamento).
function getNomeExibicao() {
  const meta = (sessaoAtual && sessaoAtual.user && sessaoAtual.user.user_metadata) || {};
  if (meta.nome_preferido) return meta.nome_preferido;
  const email = sessaoAtual && sessaoAtual.user ? sessaoAtual.user.email : '';
  return email ? email.split('@')[0] : '';
}

function checarNomePreferido(session) {
  const meta = session.user.user_metadata || {};
  if (meta.nome_preferido || meta.nome_perguntado) return;
  document.getElementById('modal-nome').classList.add('visivel');
}

async function salvarNomePreferido() {
  const valor = document.getElementById('input-nome-preferido').value.trim();
  const dados = valor ? { nome_preferido: valor, nome_perguntado: true } : { nome_perguntado: true };
  const { data, error } = await getSupabase().auth.updateUser({ data: dados });
  if (!error && data && data.user) {
    sessaoAtual.user = data.user;
  }
  document.getElementById('modal-nome').classList.remove('visivel');
  renderHome();
}

document.addEventListener('DOMContentLoaded', async () => {
  const session = await checarSessao();
  if (!session) return;
  sessaoAtual = session;

  await carregarMatriculaReal(); // precisa rodar antes de qualquer trilhasDoAluno() — define o que o aluno realmente comprou
  await carregarEncontrosMentoria(); // precisa rodar antes: define o tamanho final de aulas[] que carregarProgresso indexa
  await carregarProgresso();
  const minhasTrilhas = trilhasDoAluno();
  trilhaAtivaId = minhasTrilhas.length ? minhasTrilhas[0].id : null;
  montarTrilhaTabs();
  renderJornada();

  document.getElementById('btn-logout').addEventListener('click', async () => {
    await getSupabase().auth.signOut();
    window.location.href = 'index.html';
  });

  document.getElementById('nav-home').addEventListener('click', () => trocarView('home'));
  document.getElementById('nav-roteiro').addEventListener('click', () => trocarView('roteiro'));
  document.getElementById('nav-vitrine').addEventListener('click', () => trocarView('vitrine'));
  document.getElementById('nav-biblioteca-ia').addEventListener('click', () => trocarView('biblioteca-ia'));

  document.getElementById('btn-pular-popup').addEventListener('click', fecharPopup);
  document.getElementById('btn-enviar-popup').addEventListener('click', enviarPopup);

  document.getElementById('btn-salvar-nome').addEventListener('click', () => salvarNomePreferido());
  document.getElementById('btn-pular-nome').addEventListener('click', () => salvarNomePreferido());
  document.getElementById('input-nome-preferido').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') salvarNomePreferido();
  });
  checarNomePreferido(session);

  document.getElementById('btn-sim-compartilhar').addEventListener('click', () => decidirCompartilhar(true));
  document.getElementById('btn-nao-compartilhar').addEventListener('click', () => decidirCompartilhar(false));

  document.getElementById('btn-chat-fechar').addEventListener('click', fecharChatAgente);
  document.getElementById('btn-chat-nova').addEventListener('click', novaConversaChat);
  document.getElementById('btn-chat-enviar').addEventListener('click', () => enviarMensagemChat());
  document.getElementById('chat-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarMensagemChat(); }
  });

  renderVitrine(document.getElementById('vitrine-view-slot'));
  renderHome();
  trocarView('home');
  iniciarStandby();
});

// ---------- NAV (Início / Roteiro / Vitrine / Expert-IAs) ----------
function trocarView(view) {
  document.getElementById('view-home').style.display = view === 'home' ? 'block' : 'none';
  document.getElementById('view-roteiro').style.display = view === 'roteiro' ? 'grid' : 'none';
  document.getElementById('view-vitrine').style.display = view === 'vitrine' ? 'block' : 'none';
  document.getElementById('view-biblioteca-ia').style.display = view === 'biblioteca-ia' ? 'block' : 'none';
  document.getElementById('nav-home').classList.toggle('ativo', view === 'home');
  document.getElementById('nav-roteiro').classList.toggle('ativo', view === 'roteiro');
  document.getElementById('nav-vitrine').classList.toggle('ativo', view === 'vitrine');
  document.getElementById('nav-biblioteca-ia').classList.toggle('ativo', view === 'biblioteca-ia');
  if (view === 'home') renderHome(); // reflete progresso mais recente
  if (view === 'biblioteca-ia') renderBibliotecaIA();
}

// ---------- EXPERT-IAs (view dedicada) ----------
function renderBibliotecaIA() {
  const container = document.getElementById('biblioteca-ia-slot');
  container.innerHTML = '';

  if (!temAcessoBibliotecaIA()) {
    container.innerHTML = `
      <div class="material-card">
        <div class="material-titulo">🔒 Ainda não faz parte do seu acesso</div>
        <p class="material-desc">A Expert-IAs faz parte do Expert360º. Quem tem o curso ou a mentoria conversa com os agentes aqui.</p>
      </div>
    `;
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'biblioteca-ia-grid';
  BIBLIOTECA_IA_AGENTES.forEach(agente => {
    if (agente.modo === 'chat') {
      const card = document.createElement('div');
      card.className = 'material-card';
      card.style.cursor = 'pointer';
      card.innerHTML = `
        <div class="material-titulo">${agente.titulo}</div>
        <p class="material-desc">${agente.descricao}</p>
        <span class="link">Conversar →</span>
      `;
      card.addEventListener('click', () => abrirChatAgente(agente));
      grid.appendChild(card);
      return;
    }
    const card = document.createElement('a');
    card.className = 'material-card';
    card.href = agente.link;
    card.target = '_blank';
    card.rel = 'noopener';
    card.innerHTML = `
      <div class="material-titulo">${agente.titulo}</div>
      <p class="material-desc">${agente.descricao}</p>
      <span class="link">Abrir agente →</span>
    `;
    grid.appendChild(card);
  });
  container.appendChild(grid);
}

// ---------- CHAT INTERNO (api/chat-agente.js) ----------
// Histórico fica no navegador do aluno (localStorage, uma conversa por agente e por usuário) — fechar o
// chat ou recarregar a página não perde a conversa, que costuma ser longa. "Nova conversa" zera.
// Não vai pro banco: se a Karol quiser ver as conversas depois, é uma tabela nova.
let chatAgenteAtual = null;
let chatHistorico = [];
let chatEnviando = false;
const CHAT_ABERTURA = 'Olá! Quero começar.';

function chaveChat(agente) {
  const userId = (sessaoAtual && sessaoAtual.user && sessaoAtual.user.id) || 'anon';
  return `expert-ias:${userId}:${agente.agenteId}`;
}

function salvarChat() {
  if (!chatAgenteAtual) return;
  try { localStorage.setItem(chaveChat(chatAgenteAtual), JSON.stringify(chatHistorico)); } catch (e) {}
}

function abrirChatAgente(agente) {
  chatAgenteAtual = agente;
  chatHistorico = [];
  try { chatHistorico = JSON.parse(localStorage.getItem(chaveChat(agente)) || '[]'); } catch (e) { chatHistorico = []; }
  if (!Array.isArray(chatHistorico)) chatHistorico = [];
  document.getElementById('chat-agente-titulo').textContent = agente.titulo;
  document.getElementById('chat-mensagens').innerHTML = '';
  document.getElementById('chat-input').value = '';
  // A mensagem automática de abertura não aparece na tela — só a resposta do agente.
  chatHistorico.forEach((m, i) => { if (!(i === 0 && m.role === 'user' && m.content === CHAT_ABERTURA)) adicionarMensagemChat(m.role, m.content); });
  document.getElementById('modal-chat-agente').classList.add('visivel');
  // Conversa nova: o agente abre a conversa (como o Custom GPT faz ao receber o primeiro "oi").
  if (chatHistorico.length === 0) enviarMensagemChat(CHAT_ABERTURA);
}

function novaConversaChat() {
  if (!chatAgenteAtual || chatEnviando) return;
  chatHistorico = [];
  try { localStorage.removeItem(chaveChat(chatAgenteAtual)); } catch (e) {}
  document.getElementById('chat-mensagens').innerHTML = '';
  enviarMensagemChat(CHAT_ABERTURA);
}

function fecharChatAgente() {
  document.getElementById('modal-chat-agente').classList.remove('visivel');
  chatAgenteAtual = null;
}

function adicionarMensagemChat(role, texto) {
  const div = document.createElement('div');
  div.className = `chat-msg chat-msg-${role}`;
  // Resposta do agente vem em markdown (tabelas do Canvas, listas, negrito) — renderiza sanitizado.
  if (role === 'assistant' && window.marked && window.DOMPurify) {
    div.classList.add('md');
    div.innerHTML = DOMPurify.sanitize(marked.parse(texto || ''));
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

async function enviarMensagemChat(textoAutomatico) {
  const input = document.getElementById('chat-input');
  const automatico = typeof textoAutomatico === 'string';
  const texto = automatico ? textoAutomatico : input.value.trim();
  if (!texto || !chatAgenteAtual || chatEnviando) return;

  chatEnviando = true;
  document.getElementById('btn-chat-enviar').disabled = true;
  if (!automatico) input.value = '';
  chatHistorico.push({ role: 'user', content: texto });
  if (!automatico) adicionarMensagemChat('user', texto);
  adicionarMensagemChat('carregando', 'Pensando...');

  const accessToken = sessaoAtual && sessaoAtual.access_token;
  try {
    const resp = await fetch('/api/chat-agente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agenteId: chatAgenteAtual.agenteId, mensagens: chatHistorico, accessToken })
    });
    const data = await resp.json();
    document.querySelector('.chat-msg-carregando')?.remove();
    if (!resp.ok) {
      chatHistorico.pop(); // mensagem não respondida sai do histórico — aluno reenvia
      if (!automatico) input.value = texto;
      adicionarMensagemChat('erro', data.error || 'Erro ao falar com o agente.');
      return;
    }
    chatHistorico.push({ role: 'assistant', content: data.resposta });
    salvarChat();
    adicionarMensagemChat('assistant', data.resposta);
  } catch (err) {
    document.querySelector('.chat-msg-carregando')?.remove();
    chatHistorico.pop();
    if (!automatico) input.value = texto;
    adicionarMensagemChat('erro', 'Erro de conexão com o agente.');
  } finally {
    chatEnviando = false;
    document.getElementById('btn-chat-enviar').disabled = false;
  }
}

// ---------- HOME (Início) ----------
function encontrarProximaAula() {
  for (const trilha of trilhasDoAluno()) {
    for (const modulo of trilha.modulos) {
      for (let idx = 0; idx < modulo.aulas.length; idx++) {
        if (!modulo.aulas[idx].concluida) {
          return { trilha, modulo, idx, aula: modulo.aulas[idx] };
        }
      }
    }
  }
  return null;
}

function renderHome() {
  const nome = getNomeExibicao();
  document.getElementById('home-saudacao').textContent = nome ? `Bem-vindo de volta, ${nome}` : 'Bem-vindo de volta';

  // Continuar de onde parou
  const proxima = encontrarProximaAula();
  const continuarBox = document.getElementById('home-continuar');
  if (proxima) {
    continuarBox.style.display = 'flex';
    continuarBox.innerHTML = `
      <div>
        <span class="rotulo">Continuar — ${proxima.trilha.nome}</span>
        <div class="titulo">${proxima.aula.titulo}</div>
      </div>
      <div class="seta">→</div>
    `;
    continuarBox.onclick = () => {
      trilhaAtivaId = proxima.trilha.id;
      montarTrilhaTabs();
      renderJornada();
      trocarView('roteiro');
      selecionarAula(proxima.modulo, proxima.idx);
    };
  } else {
    continuarBox.style.display = 'none';
  }

  // Progresso por trilha
  const grid = document.getElementById('home-progresso-grid');
  grid.innerHTML = '';
  trilhasDoAluno().filter(t => t.id !== 'consultorias').forEach(trilha => {
    const { pct } = calcularProgresso(trilha);
    const card = document.createElement('div');
    card.className = 'home-progresso-card';
    card.innerHTML = `
      <h3>${trilha.nome}</h3>
      <div class="progresso-linha">
        <div class="progresso-bar"><div class="progresso-fill" style="width:${pct}%"></div></div>
        <span class="progresso-pct">${pct}%</span>
      </div>
    `;
    card.addEventListener('click', () => {
      trilhaAtivaId = trilha.id;
      montarTrilhaTabs();
      renderJornada();
      trocarView('roteiro');
    });
    grid.appendChild(card);
  });

  // Vitrine (mesmo componente da view dedicada)
  renderVitrine(document.getElementById('home-vitrine-slot'));
}

function getTrilhaAtiva() {
  return TRILHAS.find(t => t.id === trilhaAtivaId);
}

// ---------- TABS DE TRILHA ----------
function montarTrilhaTabs() {
  const container = document.getElementById('trilha-tabs');
  container.innerHTML = '';
  trilhasDoAluno().forEach(trilha => {
    const btn = document.createElement('button');
    btn.className = 'trilha-tab' + (trilha.id === trilhaAtivaId ? ' ativo' : '');
    btn.textContent = trilha.nome;
    btn.addEventListener('click', () => {
      trilhaAtivaId = trilha.id;
      aulaAtivaRef = null;
      montarTrilhaTabs();
      renderJornada();
      mostrarConteudoVazio();
    });
    container.appendChild(btn);
  });
}

// ---------- PERSISTÊNCIA DE PROGRESSO (Supabase — tabela `progresso`) ----------
// Sem sessão real (modo preview de QA), mantém os dados de exemplo do data.js — não há usuário de verdade pra persistir.
async function carregarProgresso() {
  const userId = sessaoAtual && sessaoAtual.user && sessaoAtual.user.id;
  if (!userId) return;

  TRILHAS.forEach(t => t.modulos.forEach(m => m.aulas.forEach(a => { a.concluida = false; })));

  const { data, error } = await getSupabase()
    .from('progresso')
    .select('trilha_id, modulo_id, aula_idx')
    .eq('user_id', userId);

  if (error) {
    console.error('Erro ao carregar progresso:', error);
    return;
  }

  (data || []).forEach(row => {
    const trilha = TRILHAS.find(t => t.id === row.trilha_id);
    const modulo = trilha && trilha.modulos.find(m => m.id === row.modulo_id);
    const aula = modulo && modulo.aulas[row.aula_idx];
    if (aula) aula.concluida = true;
  });
}

// ---------- AULAS GRAVADAS + ENCONTROS INDIVIDUAIS (tabela `encontros_mentoria`, populada pelo weekly-sync do course-publisher) ----------
// O RLS decide o que cada aluno recebe (31/10): 'live' pra quem tem a trilha expert360 (curso, Grupo, Individual,
// Express), 'incubadora' (encontros em grupo) só pra mentoria, 'individual' só a própria aluna. Módulo só aparece
// com gravação real. Ids de módulo ('lives', 'encontros-incubadora') e ordem por data mantidos: o progresso já
// marcado é indexado por eles.
let gravacoesIndividuais = [];
async function carregarEncontrosMentoria() {
  const userId = sessaoAtual && sessaoAtual.user && sessaoAtual.user.id;
  if (!userId) return;

  const { data, error } = await getSupabase()
    .from('encontros_mentoria')
    .select('tipo, titulo, youtube_id, data_encontro')
    .in('tipo', ['incubadora', 'live', 'individual'])
    .order('data_encontro', { ascending: true });

  if (error) { console.error('Erro ao carregar aulas gravadas:', error); return; }

  const porTipo = { incubadora: [], live: [], individual: [] };
  (data || []).forEach(row => { if (porTipo[row.tipo]) porTipo[row.tipo].push(row); });

  const paraAula = row => ({ titulo: row.titulo, concluida: false, youtube_id: row.youtube_id });
  ROTEIRO_MENTORIA.modulos = [];
  if (porTipo.live.length) {
    ROTEIRO_MENTORIA.modulos.push({ id: 'lives', numero: String(ROTEIRO_MENTORIA.modulos.length + 1).padStart(2, '0'), titulo: 'Lives Expert360º', aulas: porTipo.live.map(paraAula) });
  }
  if (porTipo.incubadora.length) {
    ROTEIRO_MENTORIA.modulos.push({ id: 'encontros-incubadora', numero: String(ROTEIRO_MENTORIA.modulos.length + 1).padStart(2, '0'), titulo: 'Oficinas em grupo', aulas: porTipo.incubadora.map(paraAula) });
  }
  gravacoesIndividuais = porTipo.individual;
}

async function salvarProgresso(trilhaId, moduloId, aulaIdx, concluida) {
  const userId = sessaoAtual && sessaoAtual.user && sessaoAtual.user.id;
  if (!userId) return true; // modo preview — nada real pra persistir, nao trata como falha

  const sb = getSupabase();
  if (concluida) {
    const { error } = await sb.from('progresso').upsert(
      { user_id: userId, trilha_id: trilhaId, modulo_id: moduloId, aula_idx: aulaIdx },
      { onConflict: 'user_id,trilha_id,modulo_id,aula_idx' }
    );
    if (error) { console.error('Erro ao salvar progresso:', error); return false; }
  } else {
    const { error } = await sb.from('progresso').delete()
      .eq('user_id', userId).eq('trilha_id', trilhaId).eq('modulo_id', moduloId).eq('aula_idx', aulaIdx);
    if (error) { console.error('Erro ao remover progresso:', error); return false; }
  }
  return true;
}

// ---------- CONSULTORIAS (tabela `materiais_consultoria` — gravações/materiais por aluna) ----------
// Reciprocidade estilo Erico Rocha: compartilhar as próprias sessões destrava ver as das outras.
// A regra é imposta pela própria RLS da tabela (ver migration) — o front só reflete o que o banco já permite.
async function carregarMateriaisConsultoria() {
  const userId = sessaoAtual && sessaoAtual.user && sessaoAtual.user.id;
  if (!userId) return { proprios: [], casosReais: [], jaDecidiu: true, compartilha: false };

  const sb = getSupabase();

  const { data: proprios, error: erroProprios } = await sb
    .from('materiais_consultoria')
    .select('*')
    .eq('user_id', userId)
    .order('data_sessao', { ascending: false });
  if (erroProprios) console.error('Erro ao carregar materiais de consultoria:', erroProprios);

  const { data: casosReais, error: erroCasos } = await sb
    .from('materiais_consultoria')
    .select('*')
    .eq('compartilhado', true)
    .neq('user_id', userId)
    .order('data_sessao', { ascending: false });
  if (erroCasos) console.error('Erro ao carregar casos reais:', erroCasos);

  const meta = sessaoAtual.user.user_metadata || {};
  return {
    proprios: proprios || [],
    casosReais: casosReais || [],
    jaDecidiu: !!meta.compartilhar_perguntado,
    compartilha: !!meta.compartilha_consultoria
  };
}

async function decidirCompartilhar(sim) {
  const { data, error } = await getSupabase().auth.updateUser({
    data: { compartilha_consultoria: sim, compartilhar_perguntado: true }
  });
  if (!error && data && data.user) sessaoAtual.user = data.user;

  const userId = sessaoAtual && sessaoAtual.user && sessaoAtual.user.id;
  if (sim && userId) {
    const { error: erroUpdate } = await getSupabase()
      .from('materiais_consultoria')
      .update({ compartilhado: true })
      .eq('user_id', userId);
    if (erroUpdate) console.error('Erro ao marcar materiais como compartilhados:', erroUpdate);
  }

  document.getElementById('modal-compartilhar').classList.remove('visivel');
  renderJornada();
}

function criarBlocoOferta(slug, materiaisProprios) {
  const oferta = VITRINE_OFERTAS.find(o => o.slug === slug);
  const encontros = ENCONTROS_POR_OFERTA[slug] || [];
  const materiaisDaOferta = materiaisProprios.filter(m => m.produto_slug === slug);
  const feitas = encontros.filter(label => materiaisDaOferta.some(m => m.titulo === label)).length;

  const fase = document.createElement('div');
  fase.className = 'fase';

  const marker = document.createElement('div');
  marker.className = 'fase-marker' + (feitas === encontros.length && encontros.length ? ' completa' : (feitas > 0 ? ' parcial' : ''));
  marker.textContent = feitas === encontros.length && encontros.length ? '✓' : String(encontros.length);
  fase.appendChild(marker);

  const titulo = document.createElement('div');
  titulo.className = 'fase-titulo';
  titulo.textContent = oferta ? oferta.nome : (NOME_OFERTA_FORA_VITRINE[slug] || slug);
  fase.appendChild(titulo);

  const sub = document.createElement('div');
  sub.className = 'fase-subtitulo';
  sub.textContent = `${feitas}/${encontros.length} encontros`;
  fase.appendChild(sub);

  const aulasSub = document.createElement('div');
  aulasSub.className = 'aulas-sub';

  encontros.forEach(label => {
    const materiais = materiaisDaOferta.filter(m => m.titulo === label);
    const feito = materiais.length > 0;

    const row = document.createElement('div');
    row.className = 'aula-row';
    row.innerHTML = `
      <div class="check ${feito ? 'concluida' : ''}">${feito ? '✓' : ''}</div>
      <div class="titulo ${feito ? 'concluida' : ''}">${label}${materiais.length > 1 ? ` (${materiais.length})` : ''}</div>
    `;
    aulasSub.appendChild(row);

    materiais.forEach(m => {
      const linha = document.createElement('div');
      linha.className = 'material-sub-link';
      const dataFormatada = new Date(m.data_sessao + 'T00:00:00').toLocaleDateString('pt-BR');
      linha.innerHTML = m.url_gravacao
        ? `<a href="${m.url_gravacao}" target="_blank" rel="noopener">${dataFormatada} — Ver gravação →</a>`
        : `<span>${dataFormatada}${m.descricao ? ' — ' + m.descricao : ''}</span>`;
      aulasSub.appendChild(linha);
    });
  });

  fase.appendChild(aulasSub);
  return fase;
}

// Sessões gravadas da mentoria anual — bloco com o nome do produto, igual às consultorias (Karol, 31/10).
// Quem tem Individual vê "Mentoria Individual"; só Grupo vê "Mentoria em Grupo" (um bloco só, sem repetir).
function nomeBlocoMentoria() {
  return MATRICULA_EXEMPLO.includes('individual') ? 'Mentoria Individual' : 'Mentoria em Grupo';
}

function criarBlocoIndividuais() {
  // Checklist fixo por produto (Karol, 31/10): Individual = 14 encontros, Grupo = 8 (individuais — o Grupo
  // tem encontros individuais + oficinas em grupo, que ficam em Aulas gravadas). A gravação de número i
  // (por data, vinda do weekly-sync) preenche o "Encontro i" e abre no player ao clicar.
  const total = MATRICULA_EXEMPLO.includes('individual') ? ENCONTROS_MENTORIA.individual : ENCONTROS_MENTORIA.grupo;
  const feitas = Math.min(gravacoesIndividuais.length, total);
  const fase = document.createElement('div');
  fase.className = 'fase';
  fase.innerHTML = `
    <div class="fase-marker ${feitas === total ? 'completa' : (feitas > 0 ? 'parcial' : '')}">${feitas === total ? '✓' : total}</div>
    <div class="fase-titulo">${nomeBlocoMentoria()}</div>
    <div class="fase-subtitulo">${feitas}/${total} encontros</div>
  `;
  const aulasSub = document.createElement('div');
  aulasSub.className = 'aulas-sub';
  for (let i = 0; i < Math.max(total, gravacoesIndividuais.length); i++) {
    const row = gravacoesIndividuais[i];
    const linha = document.createElement('div');
    linha.className = 'aula-row';
    linha.innerHTML = `<div class="check ${row ? 'concluida' : ''}">${row ? '✓' : ''}</div><div class="titulo ${row ? 'concluida' : ''}">Encontro ${i + 1}</div>`;
    if (row) linha.addEventListener('click', () => abrirGravacaoIndividual(row));
    aulasSub.appendChild(linha);
  }
  fase.appendChild(aulasSub);
  return fase;
}

function abrirGravacaoIndividual(row) {
  const col = document.getElementById('conteudo-col');
  col.innerHTML = `
    <span class="conteudo-eyebrow">${nomeBlocoMentoria()}</span>
    <h1 class="conteudo-titulo"></h1>
    <div class="player-box embed"><iframe id="player-aula" src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(row.youtube_id)}?enablejsapi=1&cc_load_policy=0&rel=0&origin=${encodeURIComponent(location.origin)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
  `;
  col.querySelector('.conteudo-titulo').textContent = row.titulo;
  desligarLegendaAutomatica('player-aula');
}

function criarCardMaterial(m, mostrarAutor) {
  const card = document.createElement('div');
  card.className = 'material-card';
  const autor = mostrarAutor ? `<span class="material-autor">${m.nome_aluna || 'Colega de mentoria'}</span>` : '';
  const link = m.url_gravacao ? `<a href="${m.url_gravacao}" target="_blank" rel="noopener">Ver gravação →</a>` : '';
  const dataFormatada = new Date(m.data_sessao + 'T00:00:00').toLocaleDateString('pt-BR');
  card.innerHTML = `
    <div class="material-data">${dataFormatada}</div>
    <div class="material-titulo">${m.titulo}</div>
    ${autor}
    ${m.descricao ? `<p class="material-desc">${m.descricao}</p>` : ''}
    ${link}
  `;
  return card;
}

async function renderConsultorias() {
  document.getElementById('jornada-titulo').textContent = 'Seus encontros';
  document.getElementById('jornada-logo-slot').innerHTML = '';
  document.getElementById('progresso-fill').style.width = '0%';
  document.getElementById('progresso-pct').textContent = '';

  const timeline = document.getElementById('timeline');
  timeline.className = 'timeline timeline-consultorias';
  timeline.innerHTML = '<div class="fase-vazio">Carregando...</div>';
  mostrarConteudoVazio();

  const { proprios, casosReais, jaDecidiu, compartilha } = await carregarMateriaisConsultoria();

  timeline.innerHTML = '';

  const ofertasConsultoria = MATRICULA_EXEMPLO.filter(slug => (TRILHA_POR_OFERTA[slug] || []).includes('consultorias'));

  const secaoPropria = document.createElement('div');
  secaoPropria.className = 'consultoria-secao';
  secaoPropria.innerHTML = '<h3>Suas sessões</h3>';
  const mentoria = temMentoria();
  if (!ofertasConsultoria.length && !mentoria) {
    // Nenhum encontro em produto nenhum — convite pro WhatsApp comercial (Karol, 31/10).
    const msg = encodeURIComponent('Olá, Karol! Sou aluno da área de membros e quero agendar uma sessão com você.');
    secaoPropria.innerHTML += `
      <div class="encontros-convite">
        <p>Você ainda não tem encontros comigo. Quer uma sessão individual pra destravar o seu método?</p>
        <a class="btn-concluir" href="https://wa.me/${WHATSAPP_COMERCIAL}?text=${msg}" target="_blank" rel="noopener">Agendar uma sessão pelo WhatsApp</a>
      </div>`;
    timeline.appendChild(secaoPropria);
    return; // sem sessão própria não há o que compartilhar nem casos reais pra destravar
  }
  ofertasConsultoria.forEach(slug => secaoPropria.appendChild(criarBlocoOferta(slug, proprios)));
  if (mentoria) secaoPropria.appendChild(criarBlocoIndividuais());
  timeline.appendChild(secaoPropria);

  const secaoCasos = document.createElement('div');
  secaoCasos.className = 'consultoria-secao';
  if (compartilha) {
    secaoCasos.innerHTML = '<h3>Casos reais de outros alunos</h3>';
    timeline.appendChild(secaoCasos);
    if (!casosReais.length) {
      const vazio = document.createElement('div');
      vazio.className = 'fase-vazio';
      vazio.textContent = 'Ainda não tem casos compartilhados por outros colegas.';
      secaoCasos.appendChild(vazio);
    } else {
      casosReais.forEach(m => secaoCasos.appendChild(criarCardMaterial(m, true)));
    }
  } else {
    secaoCasos.className = 'consultoria-secao consultoria-bloqueado';
    secaoCasos.innerHTML = `
      <h3>Casos reais de outros alunos</h3>
      <div class="fase-vazio">Compartilhe suas sessões pra destravar o acesso aos casos reais de outros alunos.</div>
      <button class="btn-concluir" id="btn-abrir-compartilhar">Saber como funciona</button>
    `;
    timeline.appendChild(secaoCasos);
    document.getElementById('btn-abrir-compartilhar').addEventListener('click', () => {
      document.getElementById('modal-compartilhar').classList.add('visivel');
    });
  }

  if (!jaDecidiu && proprios.length) {
    document.getElementById('modal-compartilhar').classList.add('visivel');
  }
}

// ---------- MAPA DA JORNADA (timeline + progresso) ----------
function calcularProgresso(trilha) {
  let total = 0, feitas = 0;
  trilha.modulos.forEach(m => {
    total += m.aulas.length;
    feitas += m.aulas.filter(a => a.concluida).length;
  });
  return { total, feitas, pct: total ? Math.round((feitas / total) * 100) : 0 };
}

function renderJornada() {
  const trilha = getTrilhaAtiva();

  if (!trilha) {
    document.getElementById('jornada-titulo').textContent = 'Nenhum conteúdo liberado ainda';
    document.getElementById('jornada-logo-slot').innerHTML = '';
    document.getElementById('progresso-fill').style.width = '0%';
    document.getElementById('progresso-pct').textContent = '';
    const timelineVazia = document.getElementById('timeline');
    timelineVazia.className = 'timeline';
    timelineVazia.innerHTML = '<div class="fase-vazio">Assim que uma matrícula for liberada na sua conta, o roteiro aparece aqui. Enquanto isso, dá uma olhada na Vitrine.</div>';
    mostrarConteudoVazio();
    return;
  }

  if (trilha.id === 'consultorias') {
    renderConsultorias();
    return;
  }

  document.getElementById('jornada-titulo').textContent = trilha.id === 'expert360' ? `Mapa da Jornada — ${trilha.nome}` : trilha.nome;

  const logoSlot = document.getElementById('jornada-logo-slot');
  logoSlot.innerHTML = trilha.id === 'expert360'
    ? '<img src="img/logo-expert360-preto.png" class="jornada-logo" alt="Expert360º">'
    : '';

  const { pct } = calcularProgresso(trilha);
  document.getElementById('progresso-fill').style.width = pct + '%';
  document.getElementById('progresso-pct').textContent = pct + '%';

  const timeline = document.getElementById('timeline');
  timeline.className = 'timeline';
  timeline.innerHTML = '';

  if (!trilha.modulos.length) {
    timeline.innerHTML = '<div class="fase-vazio">As gravações aparecem aqui assim que forem publicadas.</div>';
  }
  // Quem só tem as Lives por causa de um serviço vê até quando vale o acesso.
  const idsTrilha = new Set(MATRICULA_EXEMPLO.flatMap(slug => TRILHA_POR_OFERTA[slug] || []));
  if (trilha.id === 'mentoria' && livesServicoAte && !idsTrilha.has('expert360') && !idsTrilha.has('mentoria')) {
    const aviso = document.createElement('div');
    aviso.className = 'fase-vazio';
    aviso.textContent = `Bônus do seu serviço: acesso às Lives até ${livesServicoAte.toLocaleDateString('pt-BR')}.`;
    timeline.appendChild(aviso);
  }

  trilha.modulos.forEach(modulo => {
    const total = modulo.aulas.length;
    const feitas = modulo.aulas.filter(a => a.concluida).length;
    const status = total === 0 ? '' : (feitas === total ? 'completa' : (feitas > 0 ? 'parcial' : ''));

    const fase = document.createElement('div');
    fase.className = 'fase';

    const marker = document.createElement('div');
    marker.className = 'fase-marker ' + status;
    marker.textContent = status === 'completa' ? '✓' : modulo.numero;
    fase.appendChild(marker);

    const titulo = document.createElement('div');
    titulo.className = 'fase-titulo';
    titulo.textContent = modulo.titulo;
    fase.appendChild(titulo);

    if (modulo.subtitulo) {
      const sub = document.createElement('div');
      sub.className = 'fase-subtitulo';
      sub.textContent = modulo.subtitulo;
      fase.appendChild(sub);
    } else {
      const sub = document.createElement('div');
      sub.className = 'fase-subtitulo';
      sub.textContent = total ? `${feitas}/${total} aulas` : '';
      fase.appendChild(sub);
    }

    const aulasSub = document.createElement('div');
    aulasSub.className = 'aulas-sub';

    if (!modulo.aulas.length) {
      const vazio = document.createElement('div');
      vazio.className = 'fase-vazio';
      vazio.textContent = modulo.vazio_msg || 'Em breve.';
      aulasSub.appendChild(vazio);
    } else {
      modulo.aulas.forEach((aula, idx) => {
        const ativa = aulaAtivaRef && aulaAtivaRef.moduloId === modulo.id && aulaAtivaRef.aulaIdx === idx;
        const row = document.createElement('div');
        row.className = 'aula-row' + (ativa ? ' ativa' : '');
        row.innerHTML = `
          <div class="check ${aula.concluida ? 'concluida' : ''}" title="Marcar como concluída">${aula.concluida ? '✓' : ''}</div>
          <div class="titulo ${aula.concluida ? 'concluida' : ''}">${aula.titulo}</div>
        `;
        row.addEventListener('click', () => selecionarAula(modulo, idx));
        row.querySelector('.check').addEventListener('click', (e) => {
          e.stopPropagation();
          toggleAulaConcluida(modulo, idx);
        });
        aulasSub.appendChild(row);
      });
    }

    fase.appendChild(aulasSub);
    timeline.appendChild(fase);
  });
}

// ---------- CONTEÚDO (painel direito) ----------
function mostrarConteudoVazio() {
  document.getElementById('conteudo-col').innerHTML = '<div class="conteudo-vazio">Escolhe uma aula no roteiro pra começar.</div>';
}

function selecionarAula(modulo, idx) {
  aulaAtivaRef = { moduloId: modulo.id, aulaIdx: idx };
  const aula = modulo.aulas[idx];
  renderJornada(); // reflete o item ativo na timeline

  const col = document.getElementById('conteudo-col');
  col.innerHTML = `
    <span class="conteudo-eyebrow">${modulo.titulo}</span>
    <h1 class="conteudo-titulo">${aula.titulo}</h1>
    ${aula.youtube_id
      ? `<div class="player-box embed"><iframe id="player-aula" src="https://www.youtube-nocookie.com/embed/${aula.youtube_id}?enablejsapi=1&cc_load_policy=0&rel=0&origin=${encodeURIComponent(location.origin)}" title="${aula.titulo}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
      : `<div class="player-box">▶ ${aula.titulo}</div>`}
    <div class="conteudo-acoes">
      <button class="btn-concluir ${aula.concluida ? 'feita' : ''}" id="btn-marcar-concluida">
        ${aula.concluida ? 'Aula concluída ✓ — desmarcar' : 'Marcar aula como concluída'}
      </button>
      <button class="btn-modo-foco" id="btn-modo-foco">${modoFoco ? '↩ Sair do modo foco' : '⛶ Modo foco'}</button>
    </div>
    ${renderDescricaoAula(modulo, aula)}
  `;

  document.getElementById('btn-marcar-concluida').addEventListener('click', () => toggleAulaConcluida(modulo, idx));
  document.getElementById('btn-modo-foco').addEventListener('click', toggleModoFoco);
  if (aula.youtube_id) desligarLegendaAutomatica('player-aula');
}

// ---------- LEGENDA AUTOMÁTICA DO YOUTUBE (desligada sempre) ----------
// As aulas já têm legenda gravada na imagem. O YouTube gera sozinho uma faixa automática (e às vezes
// regera depois que a gente limpa) que aparece por cima pra quem tem CC ligado no navegador — a
// "legenda dupla" (27/08 e de novo 31/10). Em vez de limpar vídeo por vídeo no Studio, o player
// descarrega o módulo de legendas ao ficar pronto e de novo a cada play (o CC volta ao dar play).
let ytApiPronta = null;
function carregarYouTubeApi() {
  if (ytApiPronta) return ytApiPronta;
  ytApiPronta = new Promise(resolve => {
    if (window.YT && window.YT.Player) return resolve();
    const anterior = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { if (anterior) anterior(); resolve(); };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  });
  return ytApiPronta;
}

function desligarLegendaAutomatica(iframeId) {
  carregarYouTubeApi().then(() => {
    if (!document.getElementById(iframeId)) return; // aluno já trocou de aula
    const desligar = (p) => {
      try { p.unloadModule('captions'); p.unloadModule('cc'); } catch (e) {}
    };
    new YT.Player(iframeId, {
      events: {
        onReady: (ev) => desligar(ev.target),
        onStateChange: (ev) => { if (ev.data === YT.PlayerState.PLAYING || ev.data === YT.PlayerState.BUFFERING) desligar(ev.target); },
        onApiChange: (ev) => desligar(ev.target)
      }
    });
  }).catch(() => {});
}

// Descrição da aula (js/descricoes-aulas.js, gerado de descricoes.md). Busca pelo vídeo; sem vídeo, pelo título.
function renderDescricaoAula(modulo, aula) {
  if (typeof DESCRICOES_AULAS === 'undefined') return '';
  const texto = (aula.youtube_id && DESCRICOES_AULAS.porYoutube[aula.youtube_id])
    || DESCRICOES_AULAS.porTitulo[`${modulo.id}|${aula.titulo}`];
  if (!texto) return '';
  const escapar = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const paragrafos = texto.split(/\n\s*\n/).map(p => {
    const html = escapar(p.trim()).replace(/https?:\/\/[^\s<]+[^\s<.,;:!?)]/g,
      url => `<a href="${url}" target="_blank" rel="noopener">${url.replace(/^https?:\/\//, '')}</a>`);
    return `<p>${html}</p>`;
  }).join('');
  return `<div class="conteudo-descricao"><span class="conteudo-descricao-label">Sobre esta aula</span>${paragrafos}</div>`;
}

function toggleModoFoco() {
  modoFoco = !modoFoco;
  document.getElementById('view-roteiro').classList.toggle('foco', modoFoco);
  if (aulaAtivaRef) {
    const trilha = getTrilhaAtiva();
    const modulo = trilha.modulos.find(m => m.id === aulaAtivaRef.moduloId);
    if (modulo) selecionarAula(modulo, aulaAtivaRef.aulaIdx);
  }
}

async function toggleAulaConcluida(modulo, idx) {
  const aula = modulo.aulas[idx];
  const estavaTudoFeito = modulo.aulas.every(a => a.concluida);
  const novoValor = !aula.concluida;
  aula.concluida = novoValor;

  renderJornada(); // atualiza timeline + barra de progresso (otimista, antes de confirmar no banco)

  // só re-renderiza o painel de conteúdo se a aula alterada é a que está aberta
  const ehAtiva = aulaAtivaRef && aulaAtivaRef.moduloId === modulo.id && aulaAtivaRef.aulaIdx === idx;
  if (ehAtiva) selecionarAula(modulo, idx);

  const todasFeitasAgora = modulo.aulas.every(a => a.concluida);
  if (aula.concluida && todasFeitasAgora && !estavaTudoFeito) {
    abrirPopupModulo(modulo);
  }

  const trilha = TRILHAS.find(t => t.modulos.includes(modulo));
  const salvou = await salvarProgresso(trilha.id, modulo.id, idx, novoValor);
  if (!salvou) {
    // gravacao falhou — reverte o estado otimista pra nao ficar dessincronizado do banco
    aula.concluida = !novoValor;
    renderJornada();
    if (ehAtiva) selecionarAula(modulo, idx);
  }
}

// ---------- VITRINE (componente compartilhado — Início e aba Vitrine) ----------
// Capas ainda são placeholder (gradiente) — pendente a Karol entregar capa/imagem real por produto.
function criarCardProduto(oferta, jaTem) {
  const card = document.createElement('a');
  card.className = 'produto-card-grande';
  card.href = oferta.link || `${CONFIG.vendasBaseUrl}/${oferta.slug}/`;
  card.target = '_blank';
  card.rel = 'noopener';

  const logoHtml = oferta.logo ? `<img src="${oferta.logo}" alt="${oferta.nome}">` : '';
  const tagHtml = jaTem
    ? '<span class="produto-tag liberado">Liberado</span>'
    : '<span class="produto-tag bloqueado">Bloqueado</span>';
  const cadeadoHtml = jaTem ? '' : '<span class="cadeado">🔒</span>';

  card.innerHTML = `
    <div class="produto-capa">
      ${gerarCapaSVG(oferta)}
      ${cadeadoHtml}
      ${logoHtml}
      ${tagHtml}
    </div>
    <div class="produto-corpo">
      <h3>${oferta.nome}</h3>
      <div class="preco">${oferta.preco}</div>
      <p>${oferta.desc}</p>
      <span class="link">${jaTem ? 'Entrar →' : 'Saber mais →'}</span>
    </div>
  `;
  return card;
}

function renderVitrine(container) {
  container.innerHTML = '';

  const suas = VITRINE_OFERTAS.filter(o => MATRICULA_EXEMPLO.includes(o.slug));
  const outras = VITRINE_OFERTAS.filter(o => !MATRICULA_EXEMPLO.includes(o.slug));

  if (suas.length) {
    const secao = document.createElement('div');
    secao.className = 'produtos-secao';
    secao.innerHTML = '<div class="produtos-secao-titulo">Seus produtos</div>';
    const grid = document.createElement('div');
    grid.className = 'produtos-grid-grande';
    suas.forEach(o => grid.appendChild(criarCardProduto(o, true)));
    secao.appendChild(grid);
    container.appendChild(secao);
  }

  if (outras.length) {
    const secao = document.createElement('div');
    secao.className = 'produtos-secao';
    secao.innerHTML = `
      <div class="produtos-secao-titulo">🔒 Outros produtos</div>
      <div class="produtos-secao-sub">Ainda não liberados na sua conta. Clique pra entender como funciona cada um.</div>
    `;
    const grid = document.createElement('div');
    grid.className = 'produtos-grid-grande';
    outras.forEach(o => grid.appendChild(criarCardProduto(o, false)));
    secao.appendChild(grid);
    container.appendChild(secao);
  }
}

// ---------- POPUP FIM DE MÓDULO ----------
let moduloPopupAtual = null; // guarda qual módulo está aberto no popup, pra persistir com o id certo

function abrirPopupModulo(modulo) {
  moduloPopupAtual = modulo;
  const container = document.getElementById('perguntas-container');
  container.innerHTML = '';

  PERGUNTAS_POPUP_MODULO.forEach((p, idx) => {
    const bloco = document.createElement('div');
    bloco.className = 'pergunta-bloco';

    if (p.tipo === 'nota') {
      const notas = Array.from({ length: 11 }, (_, n) => n);
      bloco.innerHTML = `
        <label>${p.pergunta}</label>
        <div class="nota-escala" data-pergunta-idx="${idx}">
          ${notas.map(n => `<button type="button" data-nota="${n}">${n}</button>`).join('')}
        </div>
      `;
    } else {
      bloco.innerHTML = `
        <label>${p.pergunta}</label>
        <textarea data-pergunta-idx="${idx}" placeholder="Escreve aqui..."></textarea>
      `;
    }
    container.appendChild(bloco);
  });

  container.querySelectorAll('.nota-escala').forEach(escala => {
    escala.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') return;
      escala.querySelectorAll('button').forEach(b => b.classList.remove('selecionada'));
      e.target.classList.add('selecionada');
    });
  });

  document.getElementById('modal-overlay').classList.add('visivel');
}

function fecharPopup() {
  document.getElementById('modal-overlay').classList.remove('visivel');
}

async function enviarPopup() {
  const respostas = [];
  document.querySelectorAll('#perguntas-container .pergunta-bloco').forEach((bloco, idx) => {
    const pergunta = PERGUNTAS_POPUP_MODULO[idx];
    if (pergunta.tipo === 'nota') {
      const sel = bloco.querySelector('.nota-escala .selecionada');
      respostas.push({ pergunta: pergunta.pergunta, tipo: 'nota', valor: sel ? sel.dataset.nota : null });
    } else {
      const valor = bloco.querySelector('textarea').value.trim();
      respostas.push({ pergunta: pergunta.pergunta, tipo: 'texto', valor: valor || null });
    }
  });

  const userId = sessaoAtual && sessaoAtual.user && sessaoAtual.user.id;
  if (userId && moduloPopupAtual) {
    const trilha = TRILHAS.find(t => t.modulos.includes(moduloPopupAtual));
    const linhas = respostas
      .filter(r => r.valor !== null)
      .map(r => ({
        user_id: userId,
        trilha_id: trilha.id,
        modulo_id: moduloPopupAtual.id,
        pergunta: r.pergunta,
        tipo: r.tipo,
        valor: String(r.valor)
      }));
    if (linhas.length) {
      const { error } = await getSupabase().from('respostas_popup').insert(linhas);
      if (error) console.error('Erro ao salvar respostas do popup:', error);
    }
  } else {
    console.log('Respostas do popup de módulo (modo preview, não persistido):', respostas);
  }

  fecharPopup();
}

// ---------- STANDBY (frase motivacional após inatividade) ----------
function iniciarStandby() {
  let ultimaAtividade = Date.now();
  const overlay = document.getElementById('standby-overlay');
  const fraseEl = document.getElementById('standby-frase');
  const limiteMs = (CONFIG.standbyMinutos || 3) * 60 * 1000;

  const registrarAtividade = () => {
    ultimaAtividade = Date.now();
    if (overlay.classList.contains('visivel')) {
      overlay.classList.remove('visivel');
    }
  };

  ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, registrarAtividade);
  });

  overlay.addEventListener('click', registrarAtividade);

  setInterval(() => {
    if (Date.now() - ultimaAtividade >= limiteMs && !overlay.classList.contains('visivel')) {
      const frase = FRASES_MOTIVACIONAIS[Math.floor(Math.random() * FRASES_MOTIVACIONAIS.length)];
      fraseEl.textContent = frase;
      overlay.classList.add('visivel');
    }
  }, 5000);
}
