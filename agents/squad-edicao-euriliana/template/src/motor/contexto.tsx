// Dados do vídeo (data.json, gerado por scripts/cortar.py) + plano criativo (plano.json, escrito pelo agente),
// tema visual e a régua de tempo. Tudo que as cenas precisam vem daqui.
import React, {createContext, useContext} from 'react';
import data from '../data.json';
import plano from '../plano.json';

export const DATA = data as any;
// taxa do vídeo: a do bruto quando o data.json traz "fps" (gravação do Zoom a 25 ou 24 não ganha quadro repetido); senão 30
export const FPS: number = DATA.fps ?? 30;
export const PLANO = plano as any;
export const f = (t: number) => Math.round(t * FPS);

export const VERTICAL = (DATA.formato ?? 'vertical') === 'vertical';
export const W = VERTICAL ? 1080 : 1920;
export const H = VERTICAL ? 1920 : 1080;

const TEMA_PADRAO = {
  fundo: '#0A0E1A', superficie: '#0D1B2A', linha: '#1E293B', texto: '#F0F4F8', suave: '#94A3B8',
  acento: '#3B82F6', acento2: '#06B6D4', alerta: '#EF4444', ok: '#22C55E', legenda_destaque: '#FFE500',
  fonte_titulo: 'Bebas Neue', fonte_texto: 'Inter', fonte_ui: 'Space Grotesk',
  raio: 28, textura: 'grade', // grade | ruido | grafite | radial | nenhuma
};
// Temas prontos do horizontal (tema.preset), redesenhados na casa a partir do visual do squad de edição 3.0:
// "estudio" = grafite com grade fina e amarelo que brilha (o Content Engine); "minimalist" = azul-noite radial,
// texto branco e ênfase amarela (o 16:9 limpo). No horizontal o padrão é "estudio"; "nenhum" volta ao tema da casa.
const PRESETS: Record<string, any> = {
  estudio: {fundo: '#16181D', superficie: '#23262C', linha: '#3A3D44', texto: '#EFEAE0', suave: '#A49F96', acento: '#F7C715',
    acento2: '#4ED5C7', alerta: '#E8916F', ok: '#9ECE6A', legenda_destaque: '#F7C715',
    fonte_titulo: 'Bebas Neue', fonte_texto: 'Hanken Grotesk', fonte_ui: 'Hanken Grotesk', raio: 28, textura: 'grafite'},
  minimalist: {fundo: '#070C18', superficie: '#13203A', linha: '#22304D', texto: '#FFFFFF', suave: '#9AA6BD', acento: '#F7C715',
    acento2: '#7AA2F7', alerta: '#EF6F6C', ok: '#7DD3A0', legenda_destaque: '#F7C715',
    fonte_titulo: 'Bebas Neue', fonte_texto: 'Inter', fonte_ui: 'Inter', raio: 24, textura: 'radial'},
  // template Spotlight (vertical): fundo claro de azulejos, cartões grafite com amarelo; "tinta" = texto direto no fundo claro
  spotlight: {fundo: '#EEEAE2', superficie: '#1E2026', linha: '#DCD6CB', texto: '#F5F1EA', tinta: '#1A1C21', suave: '#8F8A80', acento: '#F7C715',
    acento2: '#F0BC07', alerta: '#E5484D', ok: '#2FA36B', legenda_destaque: '#F7C715',
    fonte_titulo: 'Bebas Neue', fonte_texto: 'Hanken Grotesk', fonte_ui: 'Hanken Grotesk', raio: 28, textura: 'azulejo'},
};
// Templates (plano.template): "euriliano" (padrão: o motor como sempre foi, com as pirotecnias) ou um template específico com
// gramática própria. Hoje: "spotlight" (vertical), refeito na casa a partir do Spotlight do squad 3.0. Ver references/templates.md.
const TEMPLATES = ['euriliano', 'spotlight'];
export const TEMPLATE: string = PLANO.template ?? 'euriliano';
if (!TEMPLATES.includes(TEMPLATE)) throw new Error(`template desconhecido: ${TEMPLATE} (use ${TEMPLATES.join(', ')})`);
if (TEMPLATE === 'spotlight' && !VERTICAL) throw new Error('o template spotlight é vertical (9:16): no horizontal use o padrão euriliano com os temas do 3.0');
const preset = PLANO.tema?.preset ?? (TEMPLATE === 'spotlight' ? 'spotlight' : VERTICAL ? 'nenhum' : 'estudio');
export const T = {...TEMA_PADRAO, ...(PRESETS[preset] ?? {}), ...(PLANO.tema ?? {})};
export const FT = `'${T.fonte_titulo}', Impact, sans-serif`;
export const FX = `'${T.fonte_texto}', Inter, sans-serif`;
export const FU = `'${T.fonte_ui}', '${T.fonte_texto}', sans-serif`;

// ---- régua de tempo ----
// Uma referência de tempo nas props pode ser: número (segundos desde o início da cena),
// "nome" (momento-chave do data.json) ou "nome+0.4" / "nome-0.3".
export const beat = (nome: string): number => {
  const m = /^([\w\-áéíóúãõâêôç]+?)([+-]\d+(?:\.\d+)?)?$/i.exec(nome.trim());
  if (!m || DATA.beats[m[1]] === undefined) throw new Error(`momento-chave desconhecido: ${nome}`);
  return DATA.beats[m[1]] + (m[2] ? parseFloat(m[2]) : 0);
};

export type Cena = {t0: number; t1: number; layout: Layout; tipo?: string; props: any; i: number; nome: string; pessoa?: 'esquerda' | 'direita'};
export type Layout = 'rosto' | 'dividida' | 'cheia' | 'pip' | 'lado' | 'janela' | 'painel';

const janela = (n: string) => {
  const j = DATA.janelas.find((x: any) => x.nome === n);
  if (!j) throw new Error(`janela desconhecida no plano: ${n}`);
  return j;
};
const tempoAbs = (v: any, padrao: number) => (v === undefined ? padrao : typeof v === 'number' ? v : beat(v));

// "lado" (horizontal): a pessoa desliza para um painel de vidro em pé num dos lados e o lado aberto recebe a cena;
// sem tipo, o lado aberto mostra a própria fala palavra por palavra (cena "fala"). No vertical vira "dividida".
let ladoN = 0;
export const CENAS: Cena[] = (PLANO.cenas ?? []).map((c: any, i: number) => {
  const js = c.janela ? (Array.isArray(c.janela) ? c.janela : [c.janela]) : [];
  const t0 = js.length ? janela(js[0]).t0 : 0;
  const t1 = js.length ? janela(js[js.length - 1]).t1 : DATA.total;
  const lado = c.layout === 'lado';
  // "janela" e "painel" são do template spotlight; fora dele viram "dividida" e "rosto"
  const spot = c.layout === 'janela' || c.layout === 'painel';
  const layout: Layout = lado && VERTICAL ? 'dividida' : spot && TEMPLATE !== 'spotlight' ? (c.layout === 'janela' ? 'dividida' : 'rosto') : c.layout ?? 'dividida';
  const pessoa = lado ? c.pessoa ?? (ladoN++ % 2 === 0 ? 'direita' : 'esquerda') : undefined;
  return {
    t0: tempoAbs(c.de, t0), t1: tempoAbs(c.ate, t1), layout, tipo: c.tipo ?? (layout === 'lado' ? 'fala' : undefined),
    props: c.props ?? {}, i, nome: c.nome ?? js.join('+') ?? `cena${i}`, pessoa,
  };
}).sort((a: Cena, b: Cena) => a.t0 - b.t0);

export const cenaEm = (t: number): Cena | undefined => {
  // por quadro, com o mesmo arredondamento da Sequence de cada cena: comparando segundos soltos, na troca sobrava um quadro
  // em que o layout ainda era o da cena que já tinha saído (tela de cima vazia por 1 quadro na dividida, achado em 20/10)
  const q = f(t);
  let achou: Cena | undefined;
  for (const c of CENAS) if (q >= f(c.t0) && q < f(c.t1)) achou = c; // a última declarada vence
  return achou;
};
export const layoutEm = (t: number): Layout => cenaEm(t)?.layout ?? 'rosto';

// painel de vidro do layout "lado" (horizontal) e a área aberta ao lado dele
export const PAINEL = {w: 620, h: 1000, y: 40, margem: 56};
export const painelX = (pessoa?: string) => (pessoa === 'esquerda' ? PAINEL.margem : W - PAINEL.margem - PAINEL.w);
// onde o rosto está no full.mp4 (0 a 1 na largura), medido pelo cortar.py; o painel centraliza nele
export const ROSTO_X: number = DATA.rosto_x ?? 0.5;

// área onde a cena desenha, por layout e formato
export const areaDe = (l: Layout, pessoa?: string) => {
  if (l === 'dividida') return VERTICAL ? {x: 0, y: 0, w: 1080, h: 960} : {x: 0, y: 0, w: 1152, h: 1080};
  // spotlight: na janela o gráfico mora em cima da faixa da legenda; no painel, embaixo do rosto
  if (l === 'janela') return {x: 0, y: 0, w: 1080, h: 880};
  if (l === 'painel') return {x: 60, y: 1150, w: 960, h: 700};
  if (l === 'lado') return pessoa === 'esquerda' ? {x: PAINEL.margem + PAINEL.w, y: 0, w: W - PAINEL.margem - PAINEL.w, h: H} : {x: 0, y: 0, w: painelX('direita'), h: H};
  return {x: 0, y: 0, w: W, h: H};
};

type Ctx = {cena: Cena; area: {w: number; h: number}};
export const CenaCtx = createContext<Ctx | null>(null);
export const useCena = () => useContext(CenaCtx)!;

// converte referência de tempo em quadro RELATIVO ao início da cena (para usar com useCurrentFrame)
export const useQuadro = () => {
  const {cena} = useCena();
  return (ref: any, padrao = 0): number => {
    if (ref === undefined || ref === null) return f(padrao);
    if (typeof ref === 'number') return f(ref);
    return f(beat(ref) - cena.t0);
  };
};

export const Provider: React.FC<{cena: Cena; children: React.ReactNode}> = ({cena, children}) => {
  const a = areaDe(cena.layout, cena.pessoa);
  return <CenaCtx.Provider value={{cena, area: {w: a.w, h: a.h}}}>{children}</CenaCtx.Provider>;
};
