'use strict';

const prompts = require('prompts');
const { createAuthClient } = require('./supabase');
const credentials = require('./credentials');

const PLATFORM_URL = 'https://arcane.arka.education';
const SUPPORT_CONTACT = '11 97312-2273';
const MAX_LOGIN_ATTEMPTS = 3;

const PURPLE = '\x1b[38;2;120;80;200m';
const GOLD = '\x1b[38;2;245;158;11m';
const CYAN = '\x1b[38;2;34;211;238m';
const GREEN = '\x1b[38;2;52;211;153m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

function log(msg) { console.log(`  ${msg}`); }
function step(msg) { console.log(`\n  ${CYAN}▸${RESET} ${msg}`); }
function ok(msg) { console.log(`  ${GREEN}✓${RESET} ${msg}`); }
function warn(msg) { console.log(`  ${GOLD}!${RESET} ${msg}`); }
function err(msg) { console.log(`  ${PURPLE}✗${RESET} ${msg}`); }

function translateAuthError(error) {
  if (!error) return 'Erro desconhecido.';
  const msg = error.message || String(error);
  if (msg === 'Invalid login credentials' || /invalid.*credentials/i.test(msg)) {
    return 'E-mail ou senha incorretos.';
  }
  if (/email not confirmed/i.test(msg)) {
    return 'Conta ainda nao confirmada. Entre na plataforma primeiro.';
  }
  if (/rate limit|too many/i.test(msg)) {
    return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
  }
  return msg;
}

function statusMessage(status) {
  if (status === 'cancelado') {
    return `Seu contrato foi cancelado. Contato do suporte: ${SUPPORT_CONTACT}`;
  }
  if (status === 'suspenso') {
    return `Seu acesso esta suspenso. Regularize com o financeiro: ${SUPPORT_CONTACT}`;
  }
  if (status === 'finalizado') {
    return `Seu contrato foi finalizado. Contato do suporte: ${SUPPORT_CONTACT}`;
  }
  return `Seu acesso nao esta ativo (${status || 'desconhecido'}). Contato: ${SUPPORT_CONTACT}`;
}

function isOffline(error) {
  if (!error) return false;
  const msg = error.message || String(error);
  return /fetch failed|network|enotfound|eai_again|econnrefused|timeout/i.test(msg);
}

async function checkAccess(client) {
  const { data, error } = await client.rpc('check_access_status');
  if (error) {
    const e = new Error(`Falha ao verificar acesso: ${error.message}`);
    e.cause = error;
    throw e;
  }
  return data;
}

async function promptCredentials() {
  if (!process.stdin.isTTY) {
    throw new Error('Login interativo precisa de um terminal. Rode em um shell interativo.');
  }

  const response = await prompts([
    {
      type: 'text',
      name: 'email',
      message: 'Email (Mentoria Arcane)',
      validate: (val) => (/^\S+@\S+\.\S+$/.test(val) ? true : 'Email invalido'),
    },
    {
      type: 'password',
      name: 'password',
      message: 'Senha',
      validate: (val) => (val && val.length >= 1 ? true : 'Senha obrigatoria'),
    },
  ], {
    onCancel: () => {
      throw new Error('Login cancelado.');
    },
  });

  return response;
}

async function interactiveLogin({ forceFresh = false } = {}) {
  log('');
  log(`${BOLD}Login — Mentoria Arcane${RESET}`);
  log(`${DIM}Use o mesmo email e senha da plataforma web.${RESET}`);
  log(`${DIM}${PLATFORM_URL}${RESET}`);
  log('');

  let lastError = null;

  for (let attempt = 1; attempt <= MAX_LOGIN_ATTEMPTS; attempt++) {
    const { email, password } = await promptCredentials();

    const client = createAuthClient();
    let authResult;
    try {
      authResult = await client.auth.signInWithPassword({ email, password });
    } catch (e) {
      if (isOffline(e)) {
        err('Sem conexao com a internet. Conecte e tente de novo.');
        process.exit(1);
      }
      err(translateAuthError(e));
      lastError = e;
      continue;
    }

    if (authResult.error) {
      err(translateAuthError(authResult.error));
      lastError = authResult.error;
      if (attempt < MAX_LOGIN_ATTEMPTS) {
        log(`${DIM}Tentativa ${attempt} de ${MAX_LOGIN_ATTEMPTS}.${RESET}`);
      }
      continue;
    }

    const { session, user } = authResult.data;
    if (!session || !user) {
      err('Sessao invalida retornada pelo servidor.');
      lastError = new Error('No session');
      continue;
    }

    log('');
    step('Verificando acesso ativo...');
    let status;
    try {
      status = await checkAccess(client);
    } catch (e) {
      if (isOffline(e)) {
        err('Sem conexao. Nao foi possivel verificar acesso.');
        process.exit(1);
      }
      err(`Nao foi possivel verificar o status de acesso: ${e.message}`);
      await client.auth.signOut().catch(() => {});
      process.exit(1);
    }

    if (status !== 'ativo') {
      await client.auth.signOut().catch(() => {});
      err(statusMessage(status));
      process.exit(1);
    }

    const saved = credentials.save({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
      user: { id: user.id, email: user.email },
      last_validated_at: Math.floor(Date.now() / 1000),
      last_status: status,
    });

    ok(`Autenticado como ${BOLD}${user.email}${RESET}`);
    ok(`Status: ${GREEN}ativo${RESET}`);
    return saved;
  }

  err(`Falha no login apos ${MAX_LOGIN_ATTEMPTS} tentativas.`);
  if (lastError) {
    log(`${DIM}${translateAuthError(lastError)}${RESET}`);
  }
  log('');
  log(`${DIM}Esqueceu a senha? Recupere em ${PLATFORM_URL}${RESET}`);
  process.exit(1);
}

async function refreshSession(cred) {
  const client = createAuthClient();
  const { data, error } = await client.auth.refreshSession({
    refresh_token: cred.refresh_token,
  });
  if (error || !data.session) {
    const e = new Error(error ? error.message : 'Refresh sem sessao');
    e.cause = error;
    throw e;
  }
  return { client, session: data.session, user: data.user };
}

async function getValidSession({ allowOffline = true } = {}) {
  const cred = credentials.load();

  if (!cred) {
    return await interactiveLogin();
  }

  if (!credentials.isExpired(cred)) {
    step('Verificando acesso...');
    try {
      const client = createAuthClient();
      await client.auth.setSession({
        access_token: cred.access_token,
        refresh_token: cred.refresh_token,
      });
      const status = await checkAccess(client);
      if (status !== 'ativo') {
        err(statusMessage(status));
        credentials.clear();
        process.exit(1);
      }
      const saved = credentials.save({
        ...cred,
        last_validated_at: Math.floor(Date.now() / 1000),
        last_status: status,
      });
      ok(`Autenticado como ${BOLD}${cred.user.email}${RESET}`);
      ok(`Status: ${GREEN}ativo${RESET}`);
      return saved;
    } catch (e) {
      if (isOffline(e) && allowOffline) {
        const age = Math.floor((Date.now() / 1000 - (cred.last_validated_at || 0)) / 3600);
        warn(`Modo offline — ultima validacao ha ${age}h`);
        ok(`Autenticado como ${BOLD}${cred.user.email}${RESET} ${DIM}(offline)${RESET}`);
        return cred;
      }
      warn(`Falha ao verificar sessao atual: ${e.message}`);
    }
  }

  step('Renovando sessao...');
  try {
    const { client, session, user } = await refreshSession(cred);
    let status;
    try {
      status = await checkAccess(client);
    } catch (e) {
      if (isOffline(e) && allowOffline) {
        const age = Math.floor((Date.now() / 1000 - (cred.last_validated_at || 0)) / 3600);
        warn(`Modo offline — ultima validacao ha ${age}h`);
        return cred;
      }
      err(`Falha ao verificar acesso: ${e.message}`);
      process.exit(1);
    }

    if (status !== 'ativo') {
      err(statusMessage(status));
      credentials.clear();
      process.exit(1);
    }

    const saved = credentials.save({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
      user: { id: user.id, email: user.email },
      last_validated_at: Math.floor(Date.now() / 1000),
      last_status: status,
    });
    ok(`Sessao renovada — ${BOLD}${user.email}${RESET}`);
    ok(`Status: ${GREEN}ativo${RESET}`);
    return saved;
  } catch (e) {
    if (isOffline(e) && allowOffline) {
      const age = Math.floor((Date.now() / 1000 - (cred.last_validated_at || 0)) / 3600);
      warn(`Modo offline — ultima validacao ha ${age}h. Seguindo com credencial local.`);
      ok(`Autenticado como ${BOLD}${cred.user.email}${RESET} ${DIM}(offline)${RESET}`);
      return cred;
    }
    warn('Sessao expirada. Refaca o login.');
    credentials.clear();
    return await interactiveLogin();
  }
}

async function logout() {
  const cred = credentials.load();
  if (!cred) {
    log(`${DIM}Ja estava desconectado.${RESET}`);
    return;
  }
  try {
    const client = createAuthClient();
    await client.auth.setSession({
      access_token: cred.access_token,
      refresh_token: cred.refresh_token,
    });
    await client.auth.signOut().catch(() => {});
  } catch {}
  credentials.clear();
  ok('Sessao encerrada. Credenciais locais removidas.');
}

function whoami() {
  const cred = credentials.load();
  if (!cred) {
    log(`${DIM}Nao autenticado.${RESET}`);
    log('');
    log(`${DIM}Para entrar: ${CYAN}auroq-os login${RESET}`);
    return;
  }
  const now = Math.floor(Date.now() / 1000);
  const validatedAgo = cred.last_validated_at ? Math.floor((now - cred.last_validated_at) / 60) : null;
  const expired = credentials.isExpired(cred);

  log('');
  log(`${BOLD}Autenticado como:${RESET} ${cred.user.email}`);
  log(`${DIM}Id:${RESET} ${cred.user.id}`);
  log(`${DIM}Ultimo status:${RESET} ${cred.last_status || 'desconhecido'}`);
  if (validatedAgo !== null) {
    const humanAge = validatedAgo < 60
      ? `${validatedAgo} min atras`
      : `${Math.floor(validatedAgo / 60)}h atras`;
    log(`${DIM}Validado:${RESET} ${humanAge}`);
  }
  log(`${DIM}Access token:${RESET} ${expired ? `${GOLD}expirado${RESET}` : `${GREEN}valido${RESET}`}`);
  log('');
}

/**
 * Gate ESTRITO para download/update (Pack Arcane e *update do Auroq OS).
 * Valida o acesso SEMPRE online — sem fallback offline. Se o aluno saiu da
 * mentoria (contrato != ativo) ou nao tem internet, o processo encerra com exit 1.
 * Retorna a credencial salva SOMENTE se o contrato esta 'ativo' validado agora.
 *
 * Diferenca pra getValidSession(): nao tem allowOffline. Atualizar/baixar exige
 * conexao (o download precisa dela de qualquer forma) e a validacao do contrato
 * e a unica trava de acesso caso o aluno saia.
 */
async function requireActiveAccess() {
  let cred = credentials.load();

  // Sem credencial local → login interativo (que ja valida ativo online)
  if (!cred) {
    return await interactiveLogin();
  }

  const client = createAuthClient();

  // Garantir sessao utilizavel (refresh se expirada) — sempre online
  try {
    if (credentials.isExpired(cred)) {
      const refreshed = await refreshSession(cred);
      cred = credentials.save({
        access_token: refreshed.session.access_token,
        refresh_token: refreshed.session.refresh_token,
        expires_at: refreshed.session.expires_at,
        user: { id: refreshed.user.id, email: refreshed.user.email },
        last_validated_at: cred.last_validated_at,
        last_status: cred.last_status,
      });
    }
    await client.auth.setSession({
      access_token: cred.access_token,
      refresh_token: cred.refresh_token,
    });
  } catch (e) {
    if (isOffline(e)) {
      err('Sem conexao. Atualizar/baixar exige internet pra validar seu acesso.');
      process.exit(1);
    }
    // Sessao invalida por outro motivo → forcar novo login
    credentials.clear();
    return await interactiveLogin();
  }

  // Validar contrato ATIVO — sempre online, sem fallback
  step('Verificando acesso...');
  let status;
  try {
    status = await checkAccess(client);
  } catch (e) {
    if (isOffline(e)) {
      err('Sem conexao. Atualizar/baixar exige internet pra validar seu acesso.');
      process.exit(1);
    }
    err(`Nao foi possivel verificar o acesso: ${e.message}`);
    process.exit(1);
  }

  if (status !== 'ativo') {
    err(statusMessage(status));
    credentials.clear();
    process.exit(1);
  }

  const saved = credentials.save({
    ...cred,
    last_validated_at: Math.floor(Date.now() / 1000),
    last_status: status,
  });
  ok(`Acesso confirmado — ${BOLD}${cred.user.email}${RESET} (${GREEN}ativo${RESET})`);
  return saved;
}

module.exports = {
  interactiveLogin,
  getValidSession,
  requireActiveAccess,
  logout,
  whoami,
  checkAccess,
  translateAuthError,
  statusMessage,
  isOffline,
};
