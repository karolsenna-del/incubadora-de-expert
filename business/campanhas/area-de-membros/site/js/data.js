// ============================================
// DATA — Área de Membros (Fase 1: dados de exemplo/placeholder)
// A migração de conteúdo real (Fase 2/3 do tracker) substitui isto por dados vindos do Supabase.
// Tudo marcado com "// PLACEHOLDER" ainda não foi entregue pela Karol — não inventar conteúdo final aqui.
// ============================================

// Roteiro do Expert360º — nomes de módulo REAIS (course-publisher-kb.md). Aulas dentro de cada módulo são placeholder.
const ROTEIRO_EXPERT360 = {
  id: 'expert360',
  nome: 'Expert360º',
  modulos: [
    {
      id: 'm0', numero: 'M0', titulo: 'Desbloqueio',
      aulas: [
        { titulo: 'Introdução', concluida: true },
        { titulo: 'Fracasso como Prova', concluida: true },
        { titulo: 'Sua História Real', concluida: true },
        { titulo: 'Ikigai', concluida: false },
        { titulo: 'Encerramento — Quem Você Se Tornou', concluida: false }
      ]
    },
    {
      id: 'm1', numero: 'M1', titulo: 'Persona e Promessa', subtitulo: 'Para de vender pra todo mundo',
      aulas: Array.from({ length: 8 }, (_, i) => ({ titulo: `Aula ${i + 1}`, concluida: false })) // PLACEHOLDER
    },
    {
      id: 'm2', numero: 'M2', titulo: 'Método Autoral', subtitulo: 'Inconfundível. Com nome próprio.',
      aulas: Array.from({ length: 9 }, (_, i) => ({ titulo: `Aula ${i + 1}`, concluida: false })) // PLACEHOLDER
    },
    {
      id: 'm3', numero: 'M3', titulo: 'Vendas Secretas', subtitulo: '3 vendas reais antes de aparecer',
      aulas: Array.from({ length: 12 }, (_, i) => ({ titulo: `Aula ${i + 1}`, concluida: false })) // PLACEHOLDER
    },
    {
      id: 'm4', numero: 'M4', titulo: 'Autoridade Digital', subtitulo: 'Presença que vende sem precisar pedir',
      aulas: Array.from({ length: 10 }, (_, i) => ({ titulo: `Aula ${i + 1}`, concluida: false })) // PLACEHOLDER
    }
  ]
};

// Roteiro da Mentoria — estrutura descrita no briefing (business/campanhas/area-de-membros/briefing.md). Conteúdo placeholder.
const ROTEIRO_MENTORIA = {
  id: 'mentoria',
  nome: 'Mentoria',
  modulos: [
    {
      id: 'metodo', numero: '01', titulo: 'Teoria do Método (Expert360º)',
      aulas: [{ titulo: 'Reaproveita o roteiro completo do Expert360º acima', concluida: false }]
    },
    {
      id: 'encontros-incubadora', numero: '02', titulo: 'Encontros da Incubadora',
      aulas: Array.from({ length: 3 }, (_, i) => ({ titulo: `Encontro ${i + 1}`, concluida: false })) // PLACEHOLDER
    },
    {
      id: 'lives', numero: '03', titulo: 'Lives Expert360º',
      aulas: Array.from({ length: 3 }, (_, i) => ({ titulo: `Live ${i + 1}`, concluida: false })) // PLACEHOLDER
    },
    {
      id: 'individuais', numero: '04', titulo: 'Encontros Individuais',
      aulas: [], // PLACEHOLDER — populado automaticamente conforme as sessões 1:1 são gravadas (ver briefing.md)
      vazio_msg: 'Suas sessões individuais aparecem aqui automaticamente depois de gravadas.'
    }
  ]
};

// Vitrine — as 7 ofertas REAIS do ecossistema (links já publicados em vendas-incubadora.vercel.app)
// "capa" é gerada em js/covers.js (arte própria, sem foto/IA externa) — "intensidade" (1-7) controla
// a densidade da composição, crescente com o tier da oferta (mais arcos/camadas = oferta mais funda).
const VITRINE_OFERTAS = [
  { slug: 'diagnostico-ferramentas', nome: 'Diagnóstico Ferramentas', preco: 'R$97', desc: 'Diagnóstico rápido de onde você está no método', intensidade: 1 },
  { slug: 'metodo-express', nome: 'Método Express', preco: 'R$300', desc: 'Sessão única, resultado rápido', intensidade: 2 },
  { slug: 'expert360', nome: 'Expert360º', preco: 'R$497', desc: 'Curso completo — estruture seu método autoral', intensidade: 3, logo: 'img/logo-expert360-preto.png' },
  { slug: 'metodo-vip', nome: 'Método VIP', preco: 'R$1.500', desc: 'Acompanhamento próximo, ritmo acelerado', intensidade: 4 },
  { slug: 'sprint-do-metodo', nome: 'Sprint do Método', preco: 'R$3.000', desc: '5 semanas, fundação construída junto', intensidade: 5 },
  { slug: 'grupo', nome: 'Grupo', preco: 'R$5.000/12m', desc: 'Mentoria em grupo, jornada completa até validar', intensidade: 6 },
  { slug: 'individual', nome: 'Individual', preco: 'R$10.000/12m', desc: '1:1 do zero até escalar, tudo personalizado', intensidade: 7 }
];

// Exemplo de matrícula (Fase 1 — mock. Fase 4 troca isso por leitura real do Supabase via webhook Voomp)
const MATRICULA_EXEMPLO = ['expert360', 'metodo-vip']; // PLACEHOLDER — ofertas que este aluno de exemplo já tem

// Frases motivacionais do standby — PLACEHOLDER. Karol ainda vai entregar o banco real (ver briefing.md, pergunta em aberto).
const FRASES_MOTIVACIONAIS = [
  'Diploma é o que você estudou. Método é o que você viveu.',
  'Feito é melhor que perfeito.',
  'Quem valida antes de escalar, escala sem quebrar.',
  'Prontidão não é pré-requisito pra vender — é consequência de vender.'
]; // PLACEHOLDER — trocar pelo banco real da Karol

// Perguntas do popup de fim de módulo — PLACEHOLDER. Karol ainda vai definir o conteúdo exato (ver briefing.md).
const PERGUNTAS_POPUP_MODULO = [
  { tipo: 'nota', pergunta: 'De 0 a 10, o quanto esse módulo te aproximou do resultado que você busca?' },
  { tipo: 'texto', pergunta: 'O que mudou pra você depois desse módulo?' },
  { tipo: 'texto', pergunta: '(Opcional) Quer deixar um print, depoimento ou prova do que você construiu?' }
]; // PLACEHOLDER — trocar pelas perguntas reais da Karol
