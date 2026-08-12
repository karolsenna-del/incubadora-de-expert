// ============================================
// CONFIG — Área de Membros (Incubadora de Expert)
// Gerado pelo Gestor de Infra Arcane — Fase 1 (layout)
// ============================================

const CONFIG = {
  // Projeto Supabase real da Karol ("incubadora-de-expert", ver business/vault/supabase.md).
  // CORRIGIDO 11/08: estava apontando por engano pro projeto tzvfkdqzdkftcqfourom.supabase.co
  // (achado via grep em lib/supabase.js, sem checar o vault primeiro — era projeto de outra coisa,
  // por isso o e-mail de login chegou com marca "ARKA/Mentoria Arcane").
  supabaseUrl: 'https://pxnbcbhgoewrwyreohki.supabase.co',
  supabaseAnonKey: 'sb_publishable_tVRpUaJhU7JCMfOiE2lXfQ__osqLrIB',

  // Minutos de inatividade antes do standby motivacional aparecer
  standbyMinutos: 3,

  // URL base das paginas de venda (vitrine aponta pra ca)
  vendasBaseUrl: 'https://vendas-incubadora.vercel.app'
};
