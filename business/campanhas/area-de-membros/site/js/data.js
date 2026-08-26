// ============================================
// DATA — Área de Membros (Fase 1: dados de exemplo/placeholder)
// A migração de conteúdo real (Fase 2/3 do tracker) substitui isto por dados vindos do Supabase.
// Tudo marcado com "// PLACEHOLDER" ainda não foi entregue pela Karol — não inventar conteúdo final aqui.
// ============================================

// Roteiro do Expert360º — nomes de módulo REAIS (course-publisher-kb.md). Orientações + M0-M2 têm
// título+youtube_id reais (fonte: agents/course-publisher/data/config.yaml). M3 parcial (3/13, 26/08).
// M4 ainda placeholder — vídeo não gravado.
const ROTEIRO_EXPERT360 = {
  id: 'expert360',
  nome: 'Expert360º',
  modulos: [
    {
      id: 'orientacoes', numero: 'OR', titulo: 'Módulo de Orientações', subtitulo: 'Antes de começar',
      aulas: [
        { titulo: 'Boas-vindas ao Expert360', concluida: false, youtube_id: 'u-_ZM9k3Ntw' },
        { titulo: 'Antes de Começar', concluida: false, youtube_id: 'Gcz0wrqSqEo' }
      ]
    },
    {
      id: 'm0', numero: 'M0', titulo: 'Desbloqueio',
      aulas: [
        { titulo: 'Introdução', concluida: true, youtube_id: 'vJj2pCeJYAI' },
        { titulo: 'Fracasso como Prova', concluida: true, youtube_id: 'PtGmzBl1H0Y' },
        { titulo: 'Sua História Real', concluida: true, youtube_id: 'Ok4Rv2Kskyc' },
        { titulo: 'Ikigai', concluida: false, youtube_id: 'trhH9zkWpg0' },
        { titulo: 'Encerramento — Quem Você Se Tornou', concluida: false, youtube_id: 'rlFwMM8KQjA' }
      ]
    },
    {
      // Títulos e youtube_id via course-publisher config.yaml (fonte oficial de mapeamento aula→vídeo)
      id: 'm1', numero: 'M1', titulo: 'Persona e Promessa', subtitulo: 'Para de vender pra todo mundo',
      aulas: [
        { titulo: 'Boas-vindas ao M1', concluida: false, youtube_id: 'Zu0xBRBY3mM' },
        { titulo: 'O que é Persona Compradora', concluida: false, youtube_id: 'i_t69Lq-tx8' },
        { titulo: 'Exercício: Agente da Persona', concluida: false, youtube_id: '9CYk8jvNg3Y' },
        { titulo: 'O que é Promessa Transformadora', concluida: false, youtube_id: 'L_dzTw-c8b4' },
        { titulo: 'Exercício: Agente da Promessa', concluida: false, youtube_id: 's6VNasrevwY' },
        { titulo: 'Posicionamento no Mercado', concluida: false, youtube_id: '-BlTLClbx78' },
        { titulo: 'O Custo Invisível do Sim', concluida: false, youtube_id: 'EPsmMlqu7NQ' },
        { titulo: 'Quem Você se Tornou no M1', concluida: false, youtube_id: 'zMbcIcrDHFY' }
      ]
    },
    {
      // Ordem segue o currículo reestruturado em 14/07/2026 (course-publisher config.yaml), não a numeração do arquivo de vídeo
      id: 'm2', numero: 'M2', titulo: 'Método Autoral', subtitulo: 'Inconfundível. Com nome próprio.',
      aulas: [
        { titulo: 'O que te espera no Módulo 2', concluida: false, youtube_id: '88MC-eycrgE' },
        { titulo: 'Você não precisa saber tudo', concluida: false, youtube_id: '11ivTDwd1ws' },
        { titulo: 'Seu método já existe', concluida: false, youtube_id: 'KeI0rnRISeE' },
        { titulo: 'O que é um Método Autoral', concluida: false, youtube_id: 'L1O9iCSYTnk' },
        { titulo: 'As 3 Jornadas do Aluno', concluida: false, youtube_id: 'gufIRh7Kh-M' },
        { titulo: 'Agente do Processo Autoral', concluida: false, youtube_id: 'FV7TbHZsld4' },
        { titulo: 'Por que ferramentas vendem mais do que copy', concluida: false, youtube_id: '1yl97febgHg' },
        { titulo: 'Agente do Portfólio Estratégico', concluida: false, youtube_id: 'Y1edC4d-iwU' },
        { titulo: 'Quem Você se Tornou no M2', concluida: false, youtube_id: 'UyATh-MRLpQ' }
      ]
    },
    {
      // Currículo real via course-publisher config.yaml — 3/13 aulas com vídeo (26/08), resto aguarda gravação
      id: 'm3', numero: 'M3', titulo: 'Vendas Secretas', subtitulo: '3 vendas reais antes de aparecer',
      aulas: [
        { titulo: 'Boas-vindas ao M3', concluida: false, youtube_id: 'jWJvBgpiHms' },
        { titulo: 'A1 — Vendas Secretas: Conceito', concluida: false, youtube_id: 'RralsyVgAtA' },
        { titulo: 'A2 — Feito é Melhor que Perfeito', concluida: false, youtube_id: 'G27FO-emYaY' },
        { titulo: 'A3 — A Oferta de Lançamento', concluida: false },
        { titulo: 'A4 — Exercício: Agente da Proposta Validada', concluida: false },
        { titulo: 'A5 — Rastreador de Leads Quentes', concluida: false },
        { titulo: 'A6 — Social Selling', concluida: false },
        { titulo: 'A7 — Lendo seu Lead', concluida: false },
        { titulo: 'A8 — Roteiro de Abordagem', concluida: false },
        { titulo: 'A9 — Roteiro da Sessão', concluida: false },
        { titulo: 'A10 — Pós-Sessão', concluida: false },
        { titulo: 'A11 — A Escala Secreta', concluida: false },
        { titulo: 'Quem Você se Tornou no M3', concluida: false }
      ]
    },
    {
      id: 'm4', numero: 'M4', titulo: 'Autoridade Digital', subtitulo: 'Presença que vende sem precisar pedir',
      aulas: Array.from({ length: 10 }, (_, i) => ({ titulo: `Aula ${i + 1}`, concluida: false })) // PLACEHOLDER
    }
  ]
};

// Roteiro da Mentoria — estrutura descrita no briefing (business/campanhas/area-de-membros/briefing.md). Conteúdo placeholder.
// Teoria do método (Expert360º) NÃO é módulo daqui — é acesso direto à trilha 'expert360' (ver TRILHA_POR_OFERTA,
// decisão 14/08: dar acesso em vez de duplicar conteúdo — fonte única de verdade pro vídeo).
const ROTEIRO_MENTORIA = {
  id: 'mentoria',
  nome: 'Mentoria',
  modulos: [
    {
      id: 'encontros-incubadora', numero: '01', titulo: 'Encontros da Incubadora',
      aulas: Array.from({ length: 3 }, (_, i) => ({ titulo: `Encontro ${i + 1}`, concluida: false })) // PLACEHOLDER
    },
    {
      id: 'lives', numero: '02', titulo: 'Lives Expert360º',
      aulas: Array.from({ length: 3 }, (_, i) => ({ titulo: `Live ${i + 1}`, concluida: false })) // PLACEHOLDER
    },
    {
      id: 'individuais', numero: '03', titulo: 'Encontros Individuais',
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

// Matrícula do aluno logado — valor abaixo é só o fallback do modo preview (sem sessão real).
// Com sessão real, `carregarMatriculaReal()` (app.js) sobrescreve isso com a leitura de verdade
// da tabela `matriculas` (gravada pelo webhook Voomp — ver api/webhook-voomp.js), no boot.
const MATRICULA_EXEMPLO = ['expert360', 'metodo-vip']; // fallback do modo preview

// Mapeia cada oferta pras trilhas de CONTEÚDO (Roteiro) que ela libera — não é 1:1 com a Vitrine, que mostra as 7 ofertas.
// Cada valor é um array (uma oferta pode liberar mais de 1 trilha). Fonte: briefing.md ("Público/Quem usa o quê") +
// decisão de 12/08 — Grupo e Individual são as mentorias 1:1 de 12 meses (roteiro fixo, "Jornada de 12 meses"), que
// por sua vez inclui a teoria do método Expert360º. VIP, Método Express, Sprint do Método e Diagnóstico Ferramentas
// são consultorias individuais mais curtas — caem na trilha "Consultorias" (conteúdo dinâmico, não currículo fixo).
// Decisão 14/08: Grupo/Individual ganham acesso DIRETO à trilha 'expert360' (mesma aba, mesmo vídeo) em vez de
// replicar as aulas do método dentro da Mentoria — evita 2 cópias do mesmo conteúdo dessincronizando com o tempo.
const TRILHA_POR_OFERTA = {
  'expert360': ['expert360'],
  'grupo': ['expert360', 'mentoria'],
  'individual': ['expert360', 'mentoria'],
  'metodo-vip': ['consultorias'],
  'metodo-express': ['consultorias'],
  'sprint-do-metodo': ['consultorias'],
  'diagnostico-ferramentas': ['consultorias']
};

// Trilha "Consultorias" — ao contrário de Expert360º/Mentoria, não tem módulos/aulas fixos no data.js: o
// conteúdo real vem da tabela `materiais_consultoria` no Supabase (ver app.js renderConsultorias()).
// Fica como um "trilha vazia" aqui só pra entrar no mesmo mecanismo de abas/matrícula das outras duas.
const TRILHA_CONSULTORIAS = { id: 'consultorias', nome: 'Consultorias', modulos: [] };

// Quantidade e rótulo dos encontros por consultoria (definido pela Karol, 12/08) — cada rótulo vira 1 check
// no checklist da aluna; fica "concluído" quando existe material em `materiais_consultoria` com esse título.
const ENCONTROS_POR_OFERTA = {
  'metodo-vip': ['Encontro 1', 'Encontro 2', 'Encontro 3'],
  'metodo-express': ['Encontro único'],
  'sprint-do-metodo': ['Encontro 1', 'Encontro 2', 'Encontro 3', 'Encontro 4', 'Encontro 5'],
  // Diagnóstico Ferramentas: 1 encontro fixo do diagnóstico em si + 1 "balde" pros encontros de construção
  // da ferramenta, que variam de quantidade — "Outros encontros" pode ter 0, 1 ou vários materiais dentro.
  'diagnostico-ferramentas': ['Diagnóstico', 'Outros encontros']
};

// Frases motivacionais do standby — PLACEHOLDER. Karol decidiu (12/08) não usar o banco extraído de PDFs
// (tom de "empreendedor genérico"/autoridade emprestada, não bate com a voz atual do método) — material
// bruto arquivado em `business/campanhas/area-de-membros/material-bruto-frases-standby.md` pra Aria
// (squad-conteudo-arcane) construir um banco de verdade na voz da Karol, quando ela chamar.
const FRASES_MOTIVACIONAIS = [
  'Diploma é o que você estudou. Método é o que você viveu.',
  'Feito é melhor que perfeito.',
  'Quem valida antes de escalar, escala sem quebrar.',
  'Prontidão não é pré-requisito pra vender — é consequência de vender.'
]; // PLACEHOLDER — trocar pelo banco real da Karol (via Aria)

// Perguntas do popup de fim de módulo — confirmadas pela Karol (12/08), conteúdo final.
const PERGUNTAS_POPUP_MODULO = [
  { tipo: 'nota', pergunta: 'De 0 a 10, o quanto esse módulo te aproximou do resultado que você busca?' },
  { tipo: 'texto', pergunta: 'O que mudou pra você depois desse módulo?' },
  { tipo: 'texto', pergunta: '(Opcional) Quer deixar um print, depoimento ou prova do que você construiu?' }
];
