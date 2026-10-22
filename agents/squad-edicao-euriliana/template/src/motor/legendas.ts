// Estilos prontos de legenda (plano.legenda.estilo_visual). Qualquer chave do plano.legenda vence o estilo.
// premium e hormozi: pesquisa de legendas do catálogo de formatos
// (laboratorio/experimentos/2026-09-25-catalogo-formatos/pesquisa-legendas/RELATORIO.md), medidos em 1080×1920.
// minimalist: squad de edição 3.0 (template Minimalist).
// pinta, bebas-pop, cresce, sublinhado e pilula-clara: o cardápio animado do squad 3.0 (18/09),
// reproduzido dos presets originais (remotion-captions-kit, remotion-captioneer e RemotionUI, todos MIT).
// A caixa vermelha do Instagram é headline (plano.headline.estilo = "caixa"), não legenda: pedido do Euriler, 03/10.
// atras (19): a palavra na parede atrás da cabeça (motor/atras.tsx + scripts/mascara_pessoa.py), pedido do Euriler, 03/10.
// ce-atual (20, apelido corrida): a legenda do motor antigo do squad 3.0 (ce-atual da vitrine), refeita na casa; só no horizontal (Euriler, 04/10).
import {DATA, PLANO, T, VERTICAL} from './contexto';
import atrasDados from '../atras.json';

export type Fonte = {familia: string; pesos: string[]; italico?: boolean};

const ESTILOS: Record<string, any> = {
  // padrão da casa: Bebas Neue gigante, contorno preto, palavra falada em amarelo, entra com mola
  euriler: {estilo: 'palavra', fonte: T.fonte_titulo, peso: 400, tamanho: 112, caixa_alta: true, max_palavras: 3, max_letras: 16,
    contorno: 10, sombra: '0 6px 18px #000A', entrada: 'pop', fontes: [{familia: T.fonte_titulo, pesos: ['400']}]},
  // premium e orgânica (legenda-32, Joel Jota): Inter Bold apertada em minúsculas; a palavra forte sai sozinha em serifa itálica
  // ("Source Serif Four" é o nome com que o Google registra a Source Serif 4 no navegador)
  premium: {estilo: 'bloco', fonte: 'Inter', peso: 700, tamanho: 65, caixa_alta: false, minusculas: true, pontuacao: true, max_palavras: 3, max_letras: 18,
    contorno: 0, sombra: '0 2px 6px #0000004D', entrada: 'desfoque', espaco: '-0.05em', y: 1150, cor: '#F6F3F1',
    enfase_fonte: 'Source Serif Four', enfase_peso: 650, enfase_italico: true, enfase_escala: 1.33, enfase_sozinha: true,
    fontes: [{familia: 'Inter', pesos: ['700']}, {familia: 'Source Serif 4', pesos: ['600', '700'], italico: true}]},
  // destaque amarelo (legenda do headline-21): Poppins ExtraBold branca, palavra falada em amarelo, sombra curta
  // Hormozi (legenda-51): Montserrat Regular pequena, cinza-claro, palavra-chave em negrito na mesma cor, corte seco
  hormozi: {estilo: 'bloco', fonte: 'Montserrat', peso: 400, tamanho: 57, caixa_alta: false, minusculas: true, max_palavras: 4, max_letras: 26,
    contorno: 0, sombra: '0 2px 5px #00000073', entrada: 'corte', y: 1094, largura: 820, cor: '#E6E1E2', enfase_peso: 700, enfase_auto: true,
    fontes: [{familia: 'Montserrat', pesos: ['400', '700']}]},
  // Minimalist (squad 3.0): bloco inteiro aparece subindo; palavra por dizer em névoa apagada, dita em luz, a que está
  // sendo dita em ciano e cresce 4%; palavra de ênfase fica ciano depois de dita
  minimalist: {estilo: 'revela', fonte: 'Space Grotesk', peso: 700, tamanho: 66, caixa_alta: false, max_palavras: 4, max_letras: 24,
    contorno: 0, sombra: '0 3px 14px #07090FE6, 0 0 2px #07090FE6', entrada: 'subir', espaco: '-0.01em', y: 1200, largura: 920,
    cor: '#F0F4F8', cor_futuro: '#C8D2E08C', cor_destaque: '#22D3EE', cor_enfase: '#06B6D4', escala_ativa: 1.04,
    fontes: [{familia: 'Space Grotesk', pesos: ['700']}]},
  // Spotlight (squad 3.0): pílula escura translúcida, uma linha, Hanken Grotesk; palavra falada em amarelo; ênfase fica
  // ---- cardápio animado do squad 3.0: Hanken Grotesk creme, amarelo #F7C715 (o mesmo do Spotlight) ----
  // pinta (KaraokeFill): o amarelo varre cada palavra da esquerda para a direita no ritmo da fala
  pinta: {estilo: 'bloco', animacao: 'pinta', fonte: 'Hanken Grotesk', peso: 800, tamanho: 68, caixa_alta: false, pontuacao: true,
    max_palavras: 4, max_letras: 28, contorno: 0, sombra: '0 2px 12px rgba(0,0,0,0.65)', entrada: 'corte', y: 1250, largura: 930,
    cor: '#F5F1EA', cor_destaque: '#F7C715', fontes: [{familia: 'Hanken Grotesk', pesos: ['800']}]},
  // bebas-pop (bônus do cardápio): o slam em Bebas Neue, branca com a ênfase amarela
  'bebas-pop': {estilo: 'bloco', animacao: 'slam', fonte: T.fonte_titulo, peso: 400, tamanho: 96, caixa_alta: true, pontuacao: true,
    max_palavras: 4, max_letras: 24, contorno: 0, sombra: '0 3px 0 rgba(0,0,0,0.35), 0 6px 24px rgba(0,0,0,0.5)', entrada: 'corte', y: 1240,
    largura: 930, cor: '#FFFFFF', cor_enfase: '#F7C715', fontes: [{familia: T.fonte_titulo, pesos: ['400']}]},
  // cresce (KaraokeCaptions "scale" do RemotionUI): a palavra falada cresce 12% e acende; as ditas ficam claras, as próximas apagadas
  cresce: {estilo: 'bloco', animacao: 'cresce', fonte: 'Hanken Grotesk', peso: 800, tamanho: 66, caixa_alta: false, pontuacao: true,
    max_palavras: 4, max_letras: 28, contorno: 0, sombra: '0 2px 12px rgba(0,0,0,0.6)', entrada: 'corte', y: 1250, largura: 930, espaco_palavras: 0.45,
    cor: '#F5F1EA', cor_futuro: 'rgba(245,241,234,0.4)', cor_destaque: '#F7C715', fontes: [{familia: 'Hanken Grotesk', pesos: ['800']}]},
  // sublinhado (EditorialEmphasis + underline do RemotionUI): um traço amarelo corre embaixo da palavra falada; ênfase amarela
  sublinhado: {estilo: 'bloco', animacao: 'sublinhado', fonte: 'Hanken Grotesk', peso: 700, tamanho: 64, caixa_alta: false, pontuacao: true,
    max_palavras: 4, max_letras: 28, contorno: 0, sombra: '0 2px 14px rgba(0,0,0,0.55)', entrada: 'subir', y: 1250, largura: 930,
    cor: '#F5F1EA', cor_destaque: '#F7C715', cor_enfase: '#F7C715', fontes: [{familia: 'Hanken Grotesk', pesos: ['700']}]},
  // pilula-clara (PillKaraoke): pílula clara com texto escuro; cada palavra escurece quando é dita; ênfase em dourado escuro
  'pilula-clara': {estilo: 'bloco', animacao: 'surge', fonte: 'Hanken Grotesk', peso: 800, tamanho: 62, caixa_alta: false, pontuacao: true,
    max_palavras: 4, max_letras: 28, contorno: 0, sombra: 'none', entrada: 'abre', y: 1250, largura: 930, pilula: '#ECECEE',
    raio_pilula: 0.45, sombra_pilula: '0 8px 32px rgba(0,0,0,0.18)', cor: '#1E1E20', cor_enfase: '#B7791F',
    fontes: [{familia: 'Hanken Grotesk', pesos: ['800']}]},
  // ---- vitrine aprovada pelo Euriler (04/10): componentes prontos em motor/legendas-extra.js (gerado de arka1/packages/legendas-euriliana) (fonte, cor e animação
  // do original; posição na faixa da legenda). cor/tamanho do plano não mexem neles.
  emoji: {estilo: 'bloco', componente: 'emoji', tamanho: 72, contorno: 0, fontes: []},
  maquina: {estilo: 'bloco', componente: 'maquina', tamanho: 72, contorno: 0, fontes: []},
  onda: {estilo: 'bloco', componente: 'onda', tamanho: 72, contorno: 0, fontes: []},
  brilho: {estilo: 'bloco', componente: 'brilho', tamanho: 72, contorno: 0, fontes: []},
  'digita-apaga': {estilo: 'bloco', componente: 'digita-apaga', tamanho: 72, contorno: 0, fontes: []},
  pisca: {estilo: 'bloco', componente: 'pisca', tamanho: 72, contorno: 0, fontes: []},
  'marca-texto': {estilo: 'bloco', componente: 'marca-texto', tamanho: 72, contorno: 0, fontes: []},
  desfoque: {estilo: 'bloco', componente: 'desfoque', tamanho: 72, contorno: 0, fontes: []},
  'arco-iris': {estilo: 'bloco', componente: 'arco-iris', tamanho: 72, contorno: 0, fontes: []},
  holofote: {estilo: 'bloco', componente: 'holofote', tamanho: 72, contorno: 0, fontes: []},
  cortina: {estilo: 'bloco', componente: 'cortina', tamanho: 72, contorno: 0, fontes: []},
  editorial: {estilo: 'bloco', componente: 'editorial', tamanho: 72, contorno: 0, fontes: []},
  inverte: {estilo: 'bloco', componente: 'inverte', tamanho: 72, contorno: 0, fontes: []},
  impacto: {estilo: 'bloco', componente: 'impacto', tamanho: 72, contorno: 0, fontes: []},
  'emoji-pop': {estilo: 'bloco', componente: 'emoji-pop', tamanho: 72, contorno: 0, fontes: []},
  camadas: {estilo: 'bloco', componente: 'camadas', tamanho: 72, contorno: 0, fontes: []},
  'pilula-cinza': {estilo: 'bloco', componente: 'pilula-cinza', tamanho: 72, contorno: 0, fontes: []},
  lava: {estilo: 'bloco', componente: 'lava', tamanho: 72, contorno: 0, fontes: []},
  camera: {estilo: 'bloco', componente: 'camera', tamanho: 72, contorno: 0, fontes: []},
  particulas: {estilo: 'bloco', componente: 'particulas', tamanho: 72, contorno: 0, fontes: []},
  peso: {estilo: 'bloco', componente: 'peso', tamanho: 72, contorno: 0, fontes: []},
  'neon-forte': {estilo: 'bloco', componente: 'neon-forte', tamanho: 72, contorno: 0, fontes: []},
  matrix: {estilo: 'bloco', componente: 'matrix', tamanho: 72, contorno: 0, fontes: []},
  acento: {estilo: 'bloco', componente: 'acento', tamanho: 72, contorno: 0, fontes: []},
  'acento-emoji': {estilo: 'bloco', componente: 'acento-emoji', tamanho: 72, contorno: 0, fontes: []},
  glitch: {estilo: 'bloco', componente: 'glitch', tamanho: 72, contorno: 0, fontes: []},
  tarja: {estilo: 'bloco', componente: 'tarja', tamanho: 72, contorno: 0, fontes: []},
  degrade: {estilo: 'bloco', componente: 'degrade', tamanho: 72, contorno: 0, fontes: []},
  // glow-emoji (54, reel Db7dEmsoOzM, 12/10): uma palavra por vez com glow branco e emoji em cima; y_componente 1440 deixa o emoji abaixo
  // do queixo e do pescoço; na cena dividida a palavra sobe para 850 (o padrão 890 encosta na emenda e o emoji cairia sobre o gráfico)
  'glow-emoji': {estilo: 'bloco', componente: 'glow-emoji', tamanho: 72, contorno: 0, fontes: [], y_componente: 1440, posicao: {dividida: 850}},
  // faixa (template spotlight): até 5 palavras numa faixa escura translúcida arredondada, a falada em amarelo, as outras brancas;
  // y 1230 na abertura em tela cheia e 905 na janela e no painel. É a legenda padrão quando plano.template = "spotlight".
  faixa: {estilo: 'palavra', fonte: 'Hanken Grotesk', peso: 600, tamanho: 46, caixa_alta: false, pontuacao: true, max_palavras: 5, max_letras: 30,
    contorno: 0, sombra: 'none', entrada: 'corte', y: 1230, posicao: {janela: 905, painel: 905}, largura: 980, uma_linha: true, tamanho_auto: true,
    pilula: 'rgba(30,32,38,0.74)', raio_pilula: 0.32, cor: '#FFFFFF', cor_destaque: '#F7C715', fontes: [{familia: 'Hanken Grotesk', pesos: ['600']}]},
  // ce-atual / corrida (20, só horizontal): palavra por palavra alinhada à esquerda, cada uma fica 2,4 s e sai; ênfase amarela com brilho
  // (o desenho mora em Video.tsx, LegendaCorrida). 72 vira 54 px no horizontal.
  'ce-atual': {estilo: 'corrida', fonte: 'Hanken Grotesk', peso: 700, enfase_peso: 800, tamanho: 72, caixa_alta: false, pontuacao: true,
    max_palavras: 12, max_letras: 90, contorno: 0, sombra: '0 8px 24px rgba(0,0,0,0.45)', entrada: 'corte', janela: 2.4, recuo: 80,
    cor: '#F5F1EA', cor_destaque: '#F7C715', fontes: [{familia: 'Hanken Grotesk', pesos: ['700', '800']}]},
};
export const NOMES_ESTILOS = Object.keys(ESTILOS);

// numeração da folha de amostra (references/estilos-legenda.jpg) e da saudação: "legenda 13" = pinta; 2, 5, 6, 8–12, 14, 21, 23, 24, 26, 30 e 35 foram reprovadas (o número fica reservado)
const NUMEROS = ['euriler', 'tiktok', 'premium', 'hormozi', 'amarela', 'minima', 'minimalist', 'pilula', 'viral', 'karaoke',
  'neon', 'slam', 'pinta', 'quique', 'bebas-pop', 'cresce', 'sublinhado', 'pilula-clara', 'atras',
  // 20–53: a vitrine de 04/10 (20 = legenda do motor antigo, guardada para vídeo horizontal); 54 = glow-emoji (reel Db7dEmsoOzM, 12/10)
  'ce-atual', 'weight-shift', 'emoji', 'destaque-rosa', 'karaoke-rosa', 'maquina', 'pulo', 'onda', 'brilho', 'digita-apaga',
  'pilula-azul', 'pisca', 'marca-texto', 'desfoque', 'arco-iris', 'escala', 'holofote', 'cortina',
  'editorial', 'inverte', 'impacto', 'emoji-pop', 'camadas', 'lava', 'pilula-cinza', 'camera', 'particulas', 'peso',
  'neon-forte', 'matrix', 'acento', 'glitch', 'tarja', 'degrade', 'glow-emoji'];
// sem número (variação): 'acento-emoji' = a 50 com emojis estourando em cima da frase
const APELIDOS: Record<string, string> = {corrida: 'ce-atual'};
// reprovadas pelo Euriler (04/10): saem do motor e ficam no depósito do laboratório
// (laboratorio/experimentos/2026-09-25-skill-edicao-euriliana/legendas-rejeitadas/README.md)
const REJEITADAS: Record<string, string> = {neon: 'difícil de ler', slam: 'parecida demais com a bebas-pop', quique: 'difícil de ler',
  pilula: 'simples demais; o fundo escuro já entra sozinho quando precisa', viral: 'ultrapassada', karaoke: 'parecida demais com as animadas',
  tiktok: 'duas linhas paradas, pouco dinâmica', minima: 'fraquinha', amarela: 'parecida com muitas outras',
  'weight-shift': 'bonita, mas igual à 16 cresce', 'destaque-rosa': 'ruim', 'karaoke-rosa': 'não ficou boa', pulo: 'repetitiva',
  'pilula-azul': 'não gostou', escala: 'não curtiu'};
const pedido = PLANO.legenda ?? {};
const porNome = (v: any) => { const s = String(v); return /^\d+$/.test(s) ? NUMEROS[Number(s) - 1] ?? s : APELIDOS[s] ?? s; };
const pedidoNome = porNome(pedido.estilo_visual ?? (PLANO.template === 'spotlight' ? 'faixa' : 'euriler'));

// ---- 19 atras: legenda atrás da pessoa. Só vale com a máscara do mesmo vídeo (atras.json do mascara_pessoa.py) e
// espaço acima da cabeça; sem isso cai para a legenda da frente (legenda.frente, ou a padrão) e avisa no render.
const ANIMACOES_ATRAS = ['palavra', 'sobe', 'letreiro', 'parede', 'pancada', 'duas'];
export const ATRAS_DADOS: any = atrasDados;
const pedeAtras = pedidoNome === 'atras';
const atrasPedido = {...(pedido.atras ?? {})};
const motivoSem = !pedeAtras ? '' : !ATRAS_DADOS?.versao ? 'falta a máscara: rode scripts/mascara_pessoa.py <trabalho>'
  : Math.abs(ATRAS_DADOS.quadros - Math.round(DATA.total * 30)) > 2 ? `a máscara é de outro corte (${ATRAS_DADOS.quadros} quadros, vídeo com ${Math.round(DATA.total * 30)}): rode scripts/mascara_pessoa.py de novo`
  : !ATRAS_DADOS.cabe && !atrasPedido.forcar ? ATRAS_DADOS.aviso || 'sem espaço acima da cabeça' : '';
if (motivoSem) console.warn(`legenda atrás desligada, caindo para a legenda da frente: ${motivoSem}`);
const animAtras = atrasPedido.animacao ?? 'palavra';
if (pedeAtras && !ANIMACOES_ATRAS.includes(animAtras)) throw new Error(`legenda.atras.animacao desconhecida: ${animAtras} (use ${ANIMACOES_ATRAS.join(', ')})`);
export const ATRAS: any = pedeAtras && !motivoSem ? {
  animacao: animAtras, fonte: 'Anton', tamanho: VERTICAL ? 330 : 240, sobreposicao: 0.16, largura: 0.84,
  cor: ATRAS_DADOS.parede?.cor_texto ?? '#0E1116', ...atrasPedido,
} : null;
if (ATRAS && (ATRAS.cor === 'auto' || !ATRAS.cor)) ATRAS.cor = ATRAS_DADOS.parede?.cor_texto ?? '#0E1116';
// legenda da frente junto com a de trás: legenda.frente (estilo 1 a 18); "duas" põe uma pequena no peito por padrão
const frente = pedeAtras ? (pedido.frente ? porNome(pedido.frente) : animAtras === 'duas' && ATRAS ? 'hormozi' : null) : null;
export const LEG_FRENTE = Boolean(frente) || (pedeAtras && !ATRAS);
const nome = pedeAtras ? frente ?? 'euriler' : pedidoNome;
if (REJEITADAS[nome]) throw new Error(`a legenda ${nome} foi reprovada pelo Euriler (${REJEITADAS[nome]}) e saiu do motor; escolha outra`);
if (nome === 'ce-atual' && VERTICAL) throw new Error('a legenda 20 (ce-atual, a corrida) é de vídeo horizontal: no vertical escolha outra');
if (!ESTILOS[nome]) throw new Error(`legenda.estilo_visual desconhecido: ${nome} (use ${NOMES_ESTILOS.join(', ')}, atras)`);
const base = pedeAtras && animAtras === 'duas' && !pedido.frente && VERTICAL ? {...ESTILOS[nome], y: 1500} : ESTILOS[nome];
// horizontal: tudo 0,75× (112 → 84 no padrão); a altura vem das posições horizontais do motor
const esc = (v: number) => (VERTICAL ? v : Math.round(v * 0.75));
export const LEG: any = {
  ...base,
  tamanho: esc(base.tamanho), contorno: esc(base.contorno), largura: base.largura ? esc(base.largura) : undefined,
  y: VERTICAL ? base.y : undefined,
  ...pedido,
  estilo_visual: nome,
};
if (pedeAtras) { delete LEG.atras; delete LEG.frente; }
// "contorno": true no plano antigo = contorno padrão do estilo euriler
if (LEG.contorno === true) LEG.contorno = esc(10);

// fontes que o Root precisa carregar para este estilo (a do plano.legenda.fonte entra pelo tema)
export const FONTES_LEGENDA: Fonte[] = [
  ...(pedido.fonte ? [] : base.fontes),
  ...(ATRAS ? [{familia: ATRAS.fonte, pesos: ['400']}] : []),
  // headline em caixa vermelha usa Figtree ExtraBold quando o plano não escolhe outra fonte
  ...(PLANO.headline?.estilo === 'caixa' && !PLANO.headline?.fonte ? [{familia: 'Figtree', pesos: ['800']}] : []),
];

const limpa = (w: string) => w.replace(/[.,!?;:"“”]/g, '').toLowerCase();
const ENFASE = new Set<string>([...(LEG.enfase ?? []), ...Object.keys(LEG.cores ?? {})].map(limpa));
export const ehEnfase = (w: string) => ENFASE.has(limpa(w));

// ---- técnica de dinâmica de legenda (ideia do Euriler, 04/10): o vídeo tem uma legenda de leitura tranquila e, no gancho
// ou nos momentos de destaque, troca por uma legenda forte por alguns segundos. legenda.momentos:
// [{"de": 0, "ate": 3.2, "estilo_visual": "lava"}, {"de": "virada", "ate": "virada+2", "estilo_visual": 40}]
// (de/ate em segundos do vídeo final ou momentos-chave; o estilo do momento tem de ser um dos componentes, 22 a 54)
export type Momento = {de: number | string; ate: number | string; estilo_visual: string | number};
export const MOMENTOS: {de: number | string; ate: number | string; componente: string; y_componente?: number}[] = ((PLANO.legenda?.momentos ?? []) as Momento[]).map((m) => {
  const n = porNome(m.estilo_visual);
  if (REJEITADAS[n]) throw new Error(`legenda.momentos: a legenda ${n} foi reprovada pelo Euriler (${REJEITADAS[n]})`);
  const e = ESTILOS[n];
  if (!e?.componente) throw new Error(`legenda.momentos: ${n} não serve para momento (use um dos estilos 22 a 54, como lava, impacto, camadas)`);
  // a altura do estilo do momento (ex.: glow-emoji, 1440) vale no trecho, a não ser que o plano peça outra em legenda.y_componente
  return {de: m.de, ate: m.ate, componente: e.componente, y_componente: pedido.y_componente ?? e.y_componente};
});
