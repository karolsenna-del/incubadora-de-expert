// Template "spotlight" (vertical), refeito na casa a partir do Spotlight do squad de edição 3.0 (nenhum código do original):
// abre com a pessoa em tela cheia e um zoom que afasta (1,4 → 1,0 em 0,85 s); depois a pessoa alterna entre a JANELA
// (pequena, embaixo, com o gráfico em cima) e o PAINEL (grande, quase a tela toda). Cada troca dura 0,5 s; de um painel
// para outro painel, o velho sai pela esquerda e o novo entra pela direita. Fundo de azulejos claros (pecas.tsx).
import React from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CENAS, DATA, FPS, PLANO, ROSTO_X, cenaEm, f} from './contexto';

type Estado = 'cheio' | 'janela' | 'painel';
const SP = PLANO.spotlight ?? {};
const TROCA = Math.round((SP.troca ?? 0.5) * FPS);    // quadros de cada troca
const ABRE = SP.abertura ?? 0.85;                     // s do zoom de abertura
const ZOOM_JANELA = SP.janela_zoom ?? 1.0;            // quanto a janela aproxima o rosto
const ROSTO_Y: number = DATA.rosto_y ?? 0.36;         // altura dos olhos no full.mp4 (0 a 1), medida pelo cortar.py
const VW = 1080, VH = 1920;

const CAIXAS = {
  cheio: {x: 0, y: 0, w: VW, h: VH, r: 0},
  janela: {x: 70, y: 1185, w: 940, h: 605, r: 46},
  painel: {x: 26, y: 26, w: 1028, h: 1868, r: 42},
};
const estadoEm = (t: number): {e: Estado; id: number} => {
  const c = cenaEm(t);
  if (c?.layout === 'janela') return {e: 'janela', id: c.i};
  if (c?.layout === 'painel') return {e: 'painel', id: c.i};
  return {e: 'cheio', id: -1};
};
const MARCOS: number[] = Array.from(new Set(CENAS.flatMap((c) => [c.t0, c.t1]))).filter((x) => x > 0).sort((a, b) => a - b);

// enquadramento do vídeo dentro da caixa: cobre a caixa e põe o rosto no ponto certo (sem faixa vazia)
const enquadra = (e: Estado, z: number) => {
  const c = CAIXAS[e];
  if (e === 'cheio') return {...c, s: z, tx: (VW / 2) * (1 - z), ty: VH * 0.32 * (1 - z)};
  const s = Math.max(c.w / VW, c.h / VH) * (e === 'janela' ? ZOOM_JANELA : 1);
  const lim = (v: number, min: number) => Math.min(0, Math.max(min, v));
  return {...c, s, tx: lim(c.w / 2 - ROSTO_X * VW * s, c.w - VW * s), ty: lim(c.h * (e === 'janela' ? 0.42 : 0.3) - ROSTO_Y * VH * s, c.h - VH * s)};
};
type Geo = ReturnType<typeof enquadra>;
const mistura = (a: Geo, b: Geo, p: number): Geo => {
  const o: any = {};
  (Object.keys(a) as (keyof Geo)[]).forEach((k) => { o[k] = a[k] + (b[k] - a[k]) * p; });
  return o;
};

const Camada: React.FC<{g: Geo; dx?: number}> = ({g, dx = 0}) => (
  <div style={{position: 'absolute', left: g.x + dx, top: g.y, width: g.w, height: g.h, borderRadius: g.r, overflow: 'hidden',
    boxShadow: g.r > 1 ? '0 26px 60px rgba(20,22,28,0.28), 0 2px 0 rgba(255,255,255,0.7) inset' : undefined}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: VW, height: VH, transformOrigin: '0 0', transform: `translate(${g.tx}px, ${g.ty}px) scale(${g.s})`}}>
      <OffthreadVideo muted src={staticFile('media/full.mp4')} style={{width: VW, height: VH}} />
    </div>
  </div>
);

export const PalcoSpot: React.FC<{soco: number}> = ({soco}) => {
  const fr = useCurrentFrame();
  const t = fr / FPS;
  const agora = estadoEm(t);
  let desde = -1, antes = agora;
  for (const m of MARCOS) {
    if (m > t) break;
    const a = estadoEm(m - 0.001), d = estadoEm(m);
    if (a.e !== d.e || (a.e === 'painel' && a.id !== d.id)) { desde = m; antes = a; }
  }
  const zAbre = interpolate(t, [0, ABRE], [1.4, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const z = (e: Estado) => (e === 'cheio' ? zAbre + soco : 1);
  const local = desde < 0 ? 999 : fr - f(desde);
  const p = interpolate(local, [0, TROCA], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const B = enquadra(agora.e, z(agora.e));
  if (p >= 1) return <AbsoluteFill><Camada g={B} /></AbsoluteFill>;
  // painel → painel: o velho sai pela esquerda, o novo entra pela direita
  if (antes.e === 'painel' && agora.e === 'painel') {
    return (
      <AbsoluteFill>
        <Camada g={B} dx={-(VW + 40) * p} />
        <Camada g={B} dx={(VW + 40) * (1 - p)} />
      </AbsoluteFill>
    );
  }
  return <AbsoluteFill><Camada g={mistura(enquadra(antes.e, z(antes.e)), B, p)} /></AbsoluteFill>;
};
