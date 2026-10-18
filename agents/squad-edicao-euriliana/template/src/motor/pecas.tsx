// Peças visuais reaproveitadas pelas cenas. Todas seguem o tema (T) — nada de cor fixa aqui.
import React from 'react';
import {AbsoluteFill, Easing, Img, Loop, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FU, FX, H, T, W} from './contexto';

export const ease = (fr: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(fr, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.2, 0.8, 0.2, 1)});

// tamanho de fonte que cabe na largura (títulos em fonte condensada ~0,45 em por letra)
export const cabe = (texto: string, desejado: number, largura: number, porLetra = 0.47) =>
  Math.min(desejado, (largura * 0.92) / Math.max(1, Math.max(...texto.split('\n').map((l) => l.length)) * porLetra));

export const src = (s: string) => (/^https?:/.test(s) ? s : staticFile(s));
export const ehVideo = (s: string) => /\.(mp4|mov|webm|m4v)$/i.test(s);

// entrada com mola; "de" escolhe o movimento
export const Pop: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties; de?: 'escala' | 'baixo' | 'esq' | 'dir' | 'cima' | 'fade'; saida?: number}> = ({at, children, style, de = 'escala', saida}) => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (fr < at || (saida !== undefined && fr >= saida)) return null;
  const s = spring({frame: fr - at, fps, config: {damping: 14, stiffness: 180}});
  const tr = {
    escala: `scale(${0.6 + 0.4 * s})`, baixo: `translateY(${(1 - s) * 70}px)`, cima: `translateY(${(1 - s) * -70}px)`,
    esq: `translateX(${(1 - s) * -140}px)`, dir: `translateX(${(1 - s) * 140}px)`, fade: '',
  }[de];
  return <div style={{...style, opacity: Math.min(1, s * 1.4), transform: `${style?.transform ?? ''} ${tr}`}}>{children}</div>;
};

// texturas dos temas do horizontal: "grafite" (grade fina de 12 px sobre grafite, luz de cima e vinheta) e "radial" (azul-noite)
const BASE_TEXTURA: Record<string, string> = {
  grafite: `radial-gradient(130% 110% at 50% 0%, ${T.superficie} 0%, ${T.fundo} 58%, #0E0F12 100%)`,
  radial: `radial-gradient(120% 100% at 50% 30%, ${T.superficie} 0%, ${T.fundo} 70%)`,
};
// fundo do template spotlight: azulejos claros arredondados que correm devagar para a esquerda, com pares amarelos que
// acendem e apagam (redesenhado na casa a partir do visual do Spotlight)
const CEL = 46, AZ = 38;
const PULSOS = Array.from({length: 26}, (_, i) => {
  const h = (n: number) => { let x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453; return x - Math.floor(x); };
  return {col: Math.floor(h(1) * 60), lin: Math.floor(h(2) * 44), fase: h(3) * 6, per: 3 + h(4) * 3, par: h(5) > 0.35};
});
export const FundoAzulejo: React.FC = () => {
  const fr = useCurrentFrame();
  const anda = (fr / 30) * 16; // px por segundo para a esquerda
  const off = anda % CEL;
  const larg = Math.ceil(W / CEL) + 2;
  const azulejo = `<svg xmlns='http://www.w3.org/2000/svg' width='${CEL}' height='${CEL}'><rect x='${(CEL - AZ) / 2}' y='${(CEL - AZ) / 2}' width='${AZ}' height='${AZ}' rx='8' fill='${T.linha}' fill-opacity='0.55'/></svg>`;
  return (
    <AbsoluteFill style={{background: T.fundo, overflow: 'hidden'}}>
      <AbsoluteFill style={{backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(azulejo)}")`, backgroundSize: `${CEL}px ${CEL}px`, backgroundPosition: `${-off}px 0px`}} />
      {PULSOS.map((p, i) => {
        const a = Math.max(0, Math.sin(((fr / 30 + p.fase) / p.per) * Math.PI * 2)) * 0.85;
        if (a < 0.03) return null;
        const col = (((p.col * CEL - anda) % (larg * CEL)) + larg * CEL) % (larg * CEL) - CEL;
        return [0, ...(p.par ? [1] : [])].map((k) => (
          <div key={`${i}-${k}`} style={{position: 'absolute', left: col + k * CEL + (CEL - AZ) / 2, top: (p.lin % Math.ceil(H / CEL)) * CEL + (CEL - AZ) / 2,
            width: AZ, height: AZ, borderRadius: 8, background: T.acento, opacity: a}} />
        ));
      })}
    </AbsoluteFill>
  );
};

export const Fundo: React.FC<{cor?: string; imagem?: string; escurece?: number; take?: number}> = ({cor = T.acento, imagem, escurece = 0.55, take}) => {
  const fr = useCurrentFrame();
  if (T.textura === 'azulejo' && !imagem) return <FundoAzulejo />;
  return (
    <AbsoluteFill style={{background: BASE_TEXTURA[T.textura] ?? `radial-gradient(circle at 50% 35%, ${cor}38 0%, ${T.superficie} 48%, ${T.fundo} 100%)`, overflow: 'hidden'}}>
      {imagem && <Midia s={imagem} loop={ehVideo(imagem) ? take ?? 5 : undefined} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.05 + fr / 2000})`}} />}
      {imagem && <AbsoluteFill style={{background: T.fundo, opacity: escurece}} />}
      {T.textura === 'grade' && <AbsoluteFill style={{backgroundImage: `linear-gradient(${T.linha}55 1px, transparent 1px), linear-gradient(90deg, ${T.linha}55 1px, transparent 1px)`, backgroundSize: '60px 60px', opacity: 0.35}} />}
      {T.textura === 'ruido' && <AbsoluteFill style={{backgroundImage: 'repeating-radial-gradient(circle at 17% 32%, #ffffff08 0 1px, transparent 1px 3px)', opacity: 0.8}} />}
      {T.textura === 'grafite' && <>
        <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(245,243,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,243,238,0.05) 1px, transparent 1px)', backgroundSize: '12px 12px'}} />
        <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(245,243,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(245,243,238,0.06) 1px, transparent 1px)', backgroundSize: '60px 60px'}} />
        <AbsoluteFill style={{background: 'radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(0,0,0,0.4))'}} />
      </>}
    </AbsoluteFill>
  );
};

export const Etiqueta: React.FC<{children: React.ReactNode; cor?: string; style?: React.CSSProperties; tamanho?: number}> = ({children, cor = T.acento2, style, tamanho = 30}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: `${tamanho * 0.4}px ${tamanho * 0.8}px`, borderRadius: 999, background: `${T.fundo}E6`, border: `2px solid ${cor}`, color: T.texto, fontFamily: FU, fontWeight: 700, fontSize: tamanho, letterSpacing: 2, textTransform: 'uppercase', boxShadow: `0 0 30px ${cor}55`, ...style}}>
    <span style={{width: tamanho * 0.4, height: tamanho * 0.4, borderRadius: 99, background: cor, boxShadow: `0 0 12px ${cor}`}} />
    {children}
  </div>
);

// imagem ou vídeo (b-roll); vídeo em loop se for mais curto que a cena
export const Midia: React.FC<{s: string; style?: React.CSSProperties; inicio?: number; transparente?: boolean; loop?: number}> = ({s, style, inicio = 0, transparente, loop}) => {
  if (!ehVideo(s)) return <Img src={src(s)} style={style} />;
  const v = <OffthreadVideo muted transparent={transparente} src={src(s)} startFrom={Math.round(inicio * 30)} style={style} />;
  return loop ? <Loop durationInFrames={Math.round(loop * 30)}>{v}</Loop> : v;
};

// enquadra uma imagem grande num retângulo que se move (zoom/pan de print de tela)
export type Ret = {x: number; y: number; w: number};
// retângulo visível no quadro fr (mesma conta usada para posicionar o cursor em cima do zoom)
export const retEm = (fr: number, de: Ret, para: Ret | undefined, a: number, b: number): Ret => {
  const p = para ? ease(fr, a, b) : 0;
  const q = para ?? de;
  return {x: de.x + (q.x - de.x) * p, y: de.y + (q.y - de.y) * p, w: de.w + (q.w - de.w) * p};
};

export type Tarja = {x: number; y: number; w: number; h: number; estilo?: 'borrao' | 'solida'};

export const Enquadra: React.FC<{s: string; natural: [number, number]; de: Ret; para?: Ret; a?: number; b?: number; W: number; H: number; tarjas?: Tarja[]; inicio?: number}> = ({s, natural, de, para, a = 0, b = 60, W, H, tarjas = [], inicio = 0}) => {
  const fr = useCurrentFrame();
  const r = retEm(fr, de, para, a, b);
  const k = W / r.w;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#05070d'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: natural[0], height: natural[1], transformOrigin: '0 0', transform: `translate(${-r.x * k}px, ${-r.y * k}px) scale(${k})`}}>
        <Midia s={s} inicio={inicio} style={{position: 'absolute', left: 0, top: 0, width: natural[0], height: natural[1]}} />
        {tarjas.map((q, i) => (
          <div key={i} style={{position: 'absolute', left: q.x, top: q.y, width: q.w, height: q.h, borderRadius: 8,
            ...(q.estilo === 'solida' ? {background: T.superficie} : {backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', background: '#8888881a'})}} />
        ))}
      </div>
    </div>
  );
};

export const Moldura: React.FC<{tipo?: 'navegador' | 'janela' | 'telefone' | 'nenhuma'; W: number; H: number; url?: string; brilho?: number; children: React.ReactNode}> = ({tipo = 'navegador', W, H, url = '', brilho = 0, children}) => {
  const sombra = `0 30px 80px #000A, 0 0 ${40 + brilho * 60}px ${T.acento}${brilho > 0 ? 'AA' : '33'}`;
  if (tipo === 'nenhuma') return <div style={{position: 'relative', width: W, height: H, borderRadius: T.raio, overflow: 'hidden', boxShadow: sombra}}>{children}</div>;
  if (tipo === 'telefone') {
    return (
      <div style={{position: 'relative', width: W, height: H, borderRadius: 64, border: '14px solid #0b0d12', overflow: 'hidden', background: '#000', boxShadow: sombra}}>
        <div style={{position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 130, height: 34, borderRadius: 20, background: '#000', zIndex: 2}} />
        {children}
      </div>
    );
  }
  return (
    <div style={{position: 'relative', width: W, height: H + 56, borderRadius: T.raio, overflow: 'hidden', background: T.superficie, border: `2px solid ${T.linha}`, boxShadow: sombra}}>
      <div style={{height: 56, display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px', background: '#111827'}}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} style={{width: 16, height: 16, borderRadius: 8, background: c}} />)}
        {tipo === 'navegador' && <div style={{marginLeft: 18, flex: 1, height: 34, borderRadius: 17, background: T.fundo, color: T.suave, fontFamily: FU, fontSize: 20, display: 'flex', alignItems: 'center', paddingLeft: 18}}>🔒 {url}</div>}
      </div>
      <div style={{position: 'relative', width: W, height: H}}>{children}</div>
    </div>
  );
};

export const Cursor: React.FC<{x: number; y: number; clique?: number}> = ({x, y, clique = -999}) => {
  const fr = useCurrentFrame();
  const d = fr - clique;
  return (
    <>
      {d >= 0 && d < 18 && <div style={{position: 'absolute', left: x - 60, top: y - 60, width: 120, height: 120, borderRadius: 60, border: `4px solid ${T.acento2}`, opacity: 1 - d / 18, transform: `scale(${0.3 + d / 12})`}} />}
      <svg width="64" height="64" viewBox="0 0 24 24" style={{position: 'absolute', left: x - 8, top: y - 6, transform: `scale(${d >= 0 && d < 6 ? 0.85 : 1})`, filter: 'drop-shadow(0 4px 10px #000C)'}}>
        <path d="M4 2 L4 20 L9 15 L12.5 22 L15.5 20.5 L12 13.8 L19 13.8 Z" fill="#fff" stroke="#000" strokeWidth="1.2" />
      </svg>
    </>
  );
};

export const Bolha: React.FC<{lado: 'esq' | 'dir'; children: React.ReactNode; tamanho?: number}> = ({lado, children, tamanho = 40}) => (
  <div style={{padding: `${tamanho * 0.65}px ${tamanho * 0.85}px`, borderRadius: 34, borderBottomLeftRadius: lado === 'esq' ? 8 : 34, borderBottomRightRadius: lado === 'dir' ? 8 : 34, background: lado === 'esq' ? T.linha : T.acento, color: T.texto, fontFamily: FX, fontSize: tamanho, fontWeight: 600, lineHeight: 1.25, boxShadow: '0 10px 30px #0008'}}>{children}</div>
);

// cartão de superfície do tema
export const Cartao: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{borderRadius: T.raio + 8, background: `${T.superficie}F2`, border: `2px solid ${T.linha}`, padding: '40px 48px', boxShadow: '0 30px 80px #000A', ...style}}>{children}</div>
);
