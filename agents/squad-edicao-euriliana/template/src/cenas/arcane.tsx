// Padrão v2 dos depoimentos Arcane (aprovado pelo Euriler no piloto da Telma, 07/10/2026): cartão de nome, destaques ao lado
// da pessoa e vinheta de saída. Tipos no plano: cartao_arcane, destaques_arcane, vinheta_arcane (ver references/cenas.md).
// Materiais em public/arcane/ (tigre da plataforma, logos e o rugido gerado no ElevenLabs). Funciona no horizontal e no vertical.
// Identidade da plataforma (globals.css): fundo #05070D, cartão #0A0E18, azul #3B82F6, neon #60A5FA, brilho #93C5FD, texto #F1F5F9.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {FPS, H, VERTICAL, W, useCena, useQuadro} from '../motor/contexto';

const K = FPS / 30; // as animações foram desenhadas a 30 quadros por segundo; K acerta para a taxa do vídeo

const AZ = '#3B82F6', NEON = '#60A5FA', BRILHO = '#93C5FD', TX = '#F1F5F9', CARTAO = '10,14,24';
const TIT = `'Space Grotesk', Inter, sans-serif`, TXT = `Inter, sans-serif`;
const sua = (fr: number, a: number, b: number, de = 0, ate = 1) =>
  interpolate(fr, [a, b], [de, ate], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)});
const vidro = (alfa = 0.8): React.CSSProperties => ({
  background: `linear-gradient(135deg, rgba(${CARTAO},${alfa}) 0%, rgba(${CARTAO},${alfa - 0.12}) 100%)`,
  backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
  border: `1px solid rgba(96,165,250,0.38)`,
  boxShadow: `0 18px 60px rgba(0,0,0,0.5), 0 0 34px rgba(59,130,246,0.22), inset 0 1px 0 rgba(147,197,253,0.22)`,
});

// Cartão de nome e profissão: o traço azul se desenha, o nome sobe por máscara, a profissão entra em seguida; sai suave.
export const CartaoArcane: React.FC<{nome: string; profissao: string | string[]; x?: number; y?: number; sai?: number}> = ({nome, profissao, x = VERTICAL ? 56 : 96, y = VERTICAL ? 1250 : 600, sai}) => {
  const linhas = Array.isArray(profissao) ? profissao : [profissao];
  const fr = useCurrentFrame() / K;
  const {cena} = useCena();
  const dur = Math.round((cena.t1 - cena.t0) * 30);
  const fim = sai !== undefined ? Math.round(sai * 30) : dur - 14;
  const some = sua(fr, fim, fim + 12, 1, 0);
  const abre = sua(fr, 2, 16);               // vidro
  const traco = sua(fr, 0, 12);              // traço azul
  const sobeNome = sua(fr, 6, 20, 105, 0);   // % (máscara)
  const prof = sua(fr, 13, 24);
  const larg = Math.max(nome.length * 37, ...linhas.map((l) => l.length * 20.5)) + 190;
  const alt = 122 + linhas.length * 46;
  return (
    <AbsoluteFill style={{opacity: some}}>
      <div style={{position: 'absolute', left: x, top: y + (1 - some) * 14, width: larg, height: alt, borderRadius: 20, overflow: 'hidden', ...vidro(0.82),
        opacity: abre, clipPath: `inset(0 ${(1 - abre) * 100}% 0 0 round 20px)`}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 6, height: `${traco * 100}%`, background: `linear-gradient(${BRILHO}, ${AZ})`, boxShadow: `0 0 22px ${NEON}`}} />
        <div style={{position: 'absolute', left: 38, top: 22, right: 120, overflow: 'hidden', height: 82}}>
          <div style={{fontFamily: TIT, fontWeight: 700, fontSize: 66, lineHeight: '82px', color: '#FFFFFF', letterSpacing: -1.2, whiteSpace: 'nowrap', transform: `translateY(${sobeNome}%)`}}>{nome}</div>
        </div>
        <div style={{position: 'absolute', left: 40, top: 106, fontFamily: TXT, fontWeight: 500, fontSize: 38, lineHeight: '46px', color: BRILHO, whiteSpace: 'nowrap',
          opacity: prof, transform: `translateY(${(1 - prof) * 10}px)`}}>{linhas.map((l, i) => <div key={i}>{l}</div>)}</div>
        <div style={{position: 'absolute', right: 26, top: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: prof * 0.95}}>
          <Img src={staticFile('arcane/logo-arcane-mark-white.svg')} style={{width: 62, height: 58, filter: `drop-shadow(0 0 10px ${NEON})`}} />
          <div style={{fontFamily: TIT, fontWeight: 600, fontSize: 15, letterSpacing: 4, color: TX, opacity: 0.85}}>ARCANE</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Destaques ao lado da pessoa: cada item entra no tempo da palavra (em), empilha e todos saem juntos no fim da cena.
type Item = {valor: string; texto: string; em?: any};
export const DestaquesArcane: React.FC<{itens: Item[]; lado?: 'esquerda' | 'direita'; y?: number}> = ({itens, lado = 'esquerda', y = 300}) => {
  const fr = useCurrentFrame() / K;
  const q = useQuadro();
  const {cena} = useCena();
  const dur = Math.round((cena.t1 - cena.t0) * 30);
  const some = sua(fr, dur - 12, dur - 1, 1, 0);
  return (
    <AbsoluteFill style={{opacity: some}}>
      <div style={{position: 'absolute', [lado === 'esquerda' ? 'left' : 'right']: VERTICAL ? 56 : 96, top: y, display: 'flex', flexDirection: 'column', gap: 18, alignItems: lado === 'esquerda' ? 'flex-start' : 'flex-end'} as any}>
        {itens.map((it, i) => {
          const at = q(it.em, i * 1.2) / K;
          const p = sua(fr, at, at + 14);
          if (fr < at) return null;
          const luz = sua(fr, at, at + 10, 1, 0) ;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '16px 30px 16px 24px', maxWidth: W - 140, borderRadius: 18, ...vidro(0.8),
              opacity: p, transform: `translateX(${(1 - p) * (lado === 'esquerda' ? -46 : 46)}px) scale(${0.96 + 0.04 * p})`, transformOrigin: lado === 'esquerda' ? 'left center' : 'right center',
              boxShadow: `0 14px 44px rgba(0,0,0,0.45), 0 0 ${26 + luz * 40}px rgba(96,165,250,${0.2 + luz * 0.45})`}}>
              <div style={{width: 5, alignSelf: 'stretch', borderRadius: 3, background: `linear-gradient(${BRILHO}, ${AZ})`, boxShadow: `0 0 16px ${NEON}`}} />
              <div style={{display: 'flex', flexDirection: VERTICAL ? 'column' : 'row', alignItems: VERTICAL ? 'flex-start' : 'center', gap: VERTICAL ? 6 : 20}}>
                <div style={{fontFamily: TIT, fontWeight: 700, fontSize: 64, lineHeight: 1, color: '#FFFFFF', letterSpacing: -1, textShadow: `0 0 22px rgba(96,165,250,0.55)`, whiteSpace: 'nowrap'}}>{it.valor}</div>
                <div style={{fontFamily: TXT, fontWeight: 500, fontSize: 36, lineHeight: 1.15, color: BRILHO, whiteSpace: 'nowrap'}}>{it.texto}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Vinheta de saída da Arcane (reutilizável): tigre branco com luz azul, a logo acende e um rugido baixo.
export const VinhetaArcane: React.FC<{volume?: number; rugido?: string}> = ({volume = 0.5, rugido = 'arcane/rugido.mp3'}) => {
  const fr = useCurrentFrame() / K;
  const {cena} = useCena();
  const dur = Math.round((cena.t1 - cena.t0) * 30);
  const entra = sua(fr, 0, 9);
  const tigre = sua(fr, 2, 20) * sua(fr, 46, 78, 1, 0.16);
  const logo = sua(fr, 40, 62);
  const acende = sua(fr, 46, 60, 1, 0) ;
  const fecha = sua(fr, dur - 9, dur - 1, 1, 0);
  return (
    <AbsoluteFill style={{background: '#05070D', opacity: entra}}>
      <AbsoluteFill style={{opacity: tigre, transform: `scale(${1.02 + fr * 0.0011})`}}>
        <OffthreadVideo muted src={staticFile('arcane/tigre.mp4')} playbackRate={1.35} style={{width: W, height: H, objectFit: 'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(70% 70% at 50% 46%, rgba(5,7,13,0) 0%, rgba(5,7,13,0.55) 62%, #05070D 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: logo * fecha}}>
        <Img src={staticFile('arcane/logo-arcane-white.svg')} style={{width: 560, height: 560, marginTop: -10, transform: `scale(${0.94 + 0.06 * logo})`,
          filter: `drop-shadow(0 0 ${18 + acende * 50}px rgba(96,165,250,${0.75 + acende * 0.25})) drop-shadow(0 0 70px rgba(59,130,246,0.45))`}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: '#05070D', opacity: 1 - fecha}} />
      <Sequence from={Math.round(5 * K)}><Audio src={staticFile(rugido)} volume={(k0) => volume * interpolate(k0 / K, [0, 4, dur - 22, dur - 7], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} /></Sequence>
    </AbsoluteFill>
  );
};
