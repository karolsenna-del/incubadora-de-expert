// Área de Membros — Login (Supabase Auth: OTP por e-mail — link OU código de 6 dígitos)
// Sem tabela nova, sem migration — usa auth.users nativo do Supabase (Nivel 3 Consult da Delegation Map
// exige aprovacao pra mudar schema; login por OTP nao mexe em schema nenhum).
//
// Por que os dois (link e código): alguns provedores de e-mail corporativo escaneiam links
// automaticamente por segurança, o que "gasta" o link de uso único antes do usuário clicar.
// O código de 6 dígitos (que a Supabase manda no mesmo e-mail) não tem esse problema.

document.addEventListener('DOMContentLoaded', () => {
  const sb = getSupabase();
  const formEmail = document.getElementById('form-login');
  const formCodigo = document.getElementById('form-codigo');
  const inputEmail = document.getElementById('input-email');
  const inputCodigo = document.getElementById('input-codigo');
  const btnEntrar = document.getElementById('btn-entrar');
  const btnVerificar = document.getElementById('btn-verificar');
  const btnReenviar = document.getElementById('btn-reenviar');
  const msg = document.getElementById('login-msg');

  let emailAtual = '';

  // Vídeo abre mudo (autoplay com som é bloqueado pelo navegador sem interação do usuário).
  // Sem botão visível: a primeira interação da pessoa em QUALQUER lugar da página (ex: clicar
  // no campo de e-mail, que é a primeira coisa que se faz aqui mesmo) já ativa o som e reinicia
  // o vídeo do começo — na prática, sente como autoplay com som pra quase todo mundo.
  const videoLogo = document.getElementById('video-logo');
  if (videoLogo) {
    const ativarSomUmaVez = () => {
      videoLogo.muted = false;
      videoLogo.currentTime = 0;
      videoLogo.play();
      ['click', 'touchstart', 'keydown'].forEach(evt => document.removeEventListener(evt, ativarSomUmaVez));
    };
    ['click', 'touchstart', 'keydown'].forEach(evt => document.addEventListener(evt, ativarSomUmaVez, { once: false }));
  }

  // Se já veio de um clique no magic link (hash com access_token), redireciona direto
  if (window.location.hash.includes('access_token')) {
    window.location.href = 'app.html' + window.location.hash;
    return;
  }

  function setMsg(texto, tipo) {
    msg.textContent = texto;
    msg.className = 'login-msg' + (tipo ? ' ' + tipo : '');
  }

  async function enviarCodigo(email) {
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + window.location.pathname.replace('index.html', 'app.html') }
    });
    return error;
  }

  // Mensagem específica quando é limite de envio (comum no e-mail padrão da Supabase — poucos
  // envios por hora) em vez do genérico "tenta de novo", que confunde mais do que ajuda.
  function mensagemErroEnvio(error) {
    const texto = (error && error.message || '').toLowerCase();
    if (texto.includes('rate limit') || texto.includes('too many') || error?.status === 429) {
      return 'Muitas tentativas em pouco tempo — o e-mail tem um limite por hora. Espera um pouco e tenta de novo.';
    }
    return 'Não consegui enviar o código. Tenta de novo em instantes.';
  }

  formEmail.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = inputEmail.value.trim();
    if (!email) return;

    btnEntrar.disabled = true;
    btnEntrar.textContent = 'Enviando...';
    setMsg('', '');

    const error = await enviarCodigo(email);

    btnEntrar.disabled = false;
    btnEntrar.textContent = 'Receber código de acesso';

    if (error) {
      setMsg(mensagemErroEnvio(error), 'erro');
      console.error(error);
      return;
    }

    emailAtual = email;
    formEmail.style.display = 'none';
    formCodigo.style.display = 'block';
    inputCodigo.value = '';
    inputCodigo.focus();
    setMsg('Enviamos um link e um código de 6 dígitos pra ' + email + '. Clica no link OU digita o código aqui embaixo.', 'ok');
  });

  formCodigo.addEventListener('submit', async (e) => {
    e.preventDefault();
    const codigo = inputCodigo.value.trim();
    if (!codigo) return;

    btnVerificar.disabled = true;
    btnVerificar.textContent = 'Verificando...';
    setMsg('', '');

    const { error } = await sb.auth.verifyOtp({ email: emailAtual, token: codigo, type: 'email' });

    btnVerificar.disabled = false;
    btnVerificar.textContent = 'Entrar';

    if (error) {
      setMsg('Código inválido ou expirado. Confere e tenta de novo, ou pede um novo código.', 'erro');
      console.error(error);
      return;
    }

    window.location.href = 'app.html';
  });

  btnReenviar.addEventListener('click', async () => {
    if (!emailAtual) return;
    btnReenviar.disabled = true;
    const textoOriginal = btnReenviar.textContent;
    btnReenviar.textContent = 'Reenviando...';

    const error = await enviarCodigo(emailAtual);

    btnReenviar.disabled = false;
    btnReenviar.textContent = textoOriginal;

    setMsg(error ? mensagemErroEnvio(error) : 'Novo código enviado pra ' + emailAtual + '.', error ? 'erro' : 'ok');
  });
});
