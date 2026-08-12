// Área de Membros — App shell (Fase 1: layout com dados placeholder — ver js/data.js)
// Roteiro no formato "Mapa da Jornada" (checklist com progresso, timeline de módulos)

const TRILHAS = [ROTEIRO_EXPERT360, ROTEIRO_MENTORIA];
let trilhaAtivaId = TRILHAS[0].id;
let aulaAtivaRef = null; // { moduloId, aulaIdx }
let modoFoco = false;
let sessaoAtual = null;

// ---------- AUTH GUARD ----------
async function checarSessao() {
  const sb = getSupabase();
  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    // TEMP QA — bypass local pra visualizar o layout sem precisar de login real via e-mail.
    // Remover antes da Fase 4 (integração real de acesso).
    if (localStorage.getItem('preview_mode') === '1') {
      document.getElementById('user-email').textContent = 'preview@incubadoradeexpert.com.br (modo preview)';
      return { user: { email: 'preview@incubadoradeexpert.com.br' } };
    }
    window.location.href = 'index.html';
    return null;
  }
  document.getElementById('user-email').textContent = session.user.email;
  return session;
}

document.addEventListener('DOMContentLoaded', async () => {
  const session = await checarSessao();
  if (!session) return;
  sessaoAtual = session;

  montarTrilhaTabs();
  renderJornada();

  document.getElementById('btn-logout').addEventListener('click', async () => {
    await getSupabase().auth.signOut();
    window.location.href = 'index.html';
  });

  document.getElementById('nav-home').addEventListener('click', () => trocarView('home'));
  document.getElementById('nav-roteiro').addEventListener('click', () => trocarView('roteiro'));
  document.getElementById('nav-vitrine').addEventListener('click', () => trocarView('vitrine'));

  document.getElementById('btn-pular-popup').addEventListener('click', fecharPopup);
  document.getElementById('btn-enviar-popup').addEventListener('click', enviarPopup);

  renderVitrine(document.getElementById('vitrine-view-slot'));
  renderHome();
  trocarView('home');
  iniciarStandby();
});

// ---------- NAV (Início / Roteiro / Vitrine) ----------
function trocarView(view) {
  document.getElementById('view-home').style.display = view === 'home' ? 'block' : 'none';
  document.getElementById('view-roteiro').style.display = view === 'roteiro' ? 'grid' : 'none';
  document.getElementById('view-vitrine').style.display = view === 'vitrine' ? 'block' : 'none';
  document.getElementById('nav-home').classList.toggle('ativo', view === 'home');
  document.getElementById('nav-roteiro').classList.toggle('ativo', view === 'roteiro');
  document.getElementById('nav-vitrine').classList.toggle('ativo', view === 'vitrine');
  if (view === 'home') renderHome(); // reflete progresso mais recente
}

// ---------- HOME (Início) ----------
function encontrarProximaAula() {
  for (const trilha of TRILHAS) {
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
  const nome = sessaoAtual && sessaoAtual.user ? sessaoAtual.user.email.split('@')[0] : '';
  document.getElementById('home-saudacao').textContent = nome ? `Bem-vinda de volta, ${nome}` : 'Bem-vinda de volta';

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
  TRILHAS.forEach(trilha => {
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
  TRILHAS.forEach(trilha => {
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
  document.getElementById('jornada-titulo').textContent = `Mapa da Jornada — ${trilha.nome}`;

  const logoSlot = document.getElementById('jornada-logo-slot');
  logoSlot.innerHTML = trilha.id === 'expert360'
    ? '<img src="img/logo-expert360-preto.png" class="jornada-logo" alt="Expert360º">'
    : '';

  const { pct } = calcularProgresso(trilha);
  document.getElementById('progresso-fill').style.width = pct + '%';
  document.getElementById('progresso-pct').textContent = pct + '%';

  const timeline = document.getElementById('timeline');
  timeline.innerHTML = '';

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
    <div class="player-box">▶ ${aula.titulo}</div>
    <div class="conteudo-acoes">
      <button class="btn-concluir ${aula.concluida ? 'feita' : ''}" id="btn-marcar-concluida">
        ${aula.concluida ? 'Aula concluída ✓ — desmarcar' : 'Marcar aula como concluída'}
      </button>
      <button class="btn-modo-foco" id="btn-modo-foco">${modoFoco ? '↩ Sair do modo foco' : '⛶ Modo foco'}</button>
    </div>
  `;

  document.getElementById('btn-marcar-concluida').addEventListener('click', () => toggleAulaConcluida(modulo, idx));
  document.getElementById('btn-modo-foco').addEventListener('click', toggleModoFoco);
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

function toggleAulaConcluida(modulo, idx) {
  const aula = modulo.aulas[idx];
  const estavaTudoFeito = modulo.aulas.every(a => a.concluida);
  aula.concluida = !aula.concluida;

  renderJornada(); // atualiza timeline + barra de progresso

  // só re-renderiza o painel de conteúdo se a aula alterada é a que está aberta
  const ehAtiva = aulaAtivaRef && aulaAtivaRef.moduloId === modulo.id && aulaAtivaRef.aulaIdx === idx;
  if (ehAtiva) selecionarAula(modulo, idx);

  const todasFeitasAgora = modulo.aulas.every(a => a.concluida);
  if (aula.concluida && todasFeitasAgora && !estavaTudoFeito) {
    abrirPopupModulo(modulo);
  }
}

// ---------- VITRINE (componente compartilhado — Início e aba Vitrine) ----------
// Capas ainda são placeholder (gradiente) — pendente a Karol entregar capa/imagem real por produto.
function criarCardProduto(oferta, jaTem) {
  const card = document.createElement('a');
  card.className = 'produto-card-grande';
  card.href = `${CONFIG.vendasBaseUrl}/${oferta.slug}/`;
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
function abrirPopupModulo(modulo) {
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

function enviarPopup() {
  // PLACEHOLDER — Fase 4 (integração) grava isso numa tabela nova no Supabase (proposta de schema pendente de aprovação da Karol).
  const respostas = [];
  document.querySelectorAll('#perguntas-container .nota-escala').forEach(el => {
    const sel = el.querySelector('.selecionada');
    respostas.push({ tipo: 'nota', valor: sel ? sel.dataset.nota : null });
  });
  document.querySelectorAll('#perguntas-container textarea').forEach(el => {
    respostas.push({ tipo: 'texto', valor: el.value });
  });
  console.log('Respostas do popup de módulo (placeholder, ainda não persistido):', respostas);
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
