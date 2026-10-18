// Cenas de texto: título cinético, citação, comparação.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FT, FU, FX, T, useCena, useQuadro} from '../motor/contexto';
import {Cartao, Fundo, Midia, Pop, cabe} from '../motor/pecas';

type Linha = {texto: string; em?: any; cor?: string; tamanho?: number; fonte?: 'titulo' | 'texto'};

// Tipografia cinética. efeito: slam (bate e assenta), sobe, digita (letra a letra), risca (entra e a linha anterior é riscada)
export const Titulo: React.FC<{linhas: Linha[]; fundo?: {imagem?: string; video?: string; cor?: string; escurece?: number; take?: number}; alinhar?: 'centro' | 'topo' | 'baixo'; efeito?: 'slam' | 'sobe' | 'digita'; transparente?: boolean}> = ({linhas, fundo, alinhar = 'centro', efeito = 'slam', transparente}) => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  const q = useQuadro();
  const {area} = useCena();
  const base = Math.min(area.w, area.h * 0.9) / 1080;
  return (
    <AbsoluteFill>
      {!transparente && <Fundo cor={fundo?.cor} imagem={fundo?.imagem ?? fundo?.video} escurece={fundo?.escurece ?? 0.55} take={fundo?.take} />}
      <AbsoluteFill style={{justifyContent: alinhar === 'centro' ? 'center' : alinhar === 'topo' ? 'flex-start' : 'flex-end', alignItems: 'center', flexDirection: 'column', padding: 60, paddingTop: alinhar === 'topo' ? 140 : 60, paddingBottom: alinhar === 'baixo' ? 180 : 60}}>
        {linhas.map((l, i) => {
          const at = q(l.em, i * 0.25);
          if (fr < at) return <div key={i} style={{height: 0}} />;
          const s = spring({frame: fr - at, fps, config: {damping: efeito === 'slam' ? 10 : 16, stiffness: 220}});
          const tam = cabe(l.texto, (l.tamanho ?? 150) * base, area.w, l.fonte === 'texto' ? 0.58 : 0.47);
          let texto: React.ReactNode = l.texto;
          if (efeito === 'digita') texto = l.texto.slice(0, Math.floor((fr - at) * 1.6));
          const tr = efeito === 'slam' ? `scale(${1.2 - 0.2 * s})` : efeito === 'sobe' ? `translateY(${(1 - s) * 80}px)` : '';
          return (
            <div key={i} style={{fontFamily: l.fonte === 'texto' ? FX : FT, fontWeight: l.fonte === 'texto' ? 800 : 400, fontSize: tam, lineHeight: 0.95, color: l.cor ?? T.texto, textAlign: 'center', textShadow: `0 8px 40px #000C${l.cor ? `, 0 0 50px ${l.cor}66` : ''}`, opacity: Math.min(1, s * 1.5), transform: tr}}>
              {texto}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Citacao: React.FC<{texto: string; autor?: string; em?: any; fundo?: {imagem?: string; cor?: string}}> = ({texto, autor, em, fundo}) => {
  const fr = useCurrentFrame();
  const q = useQuadro();
  const at = q(em, 0.1);
  const palavras = texto.split(' ');
  const {area} = useCena();
  const tam = Math.min(area.w, area.h) / 1080 * 70;
  return (
    <AbsoluteFill><Fundo cor={fundo?.cor} imagem={fundo?.imagem} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 90}}>
        <div style={{fontFamily: FT, fontSize: tam * 3, color: T.acento2, lineHeight: 0.5, alignSelf: 'flex-start'}}>“</div>
        <div style={{fontFamily: FX, fontWeight: 700, fontSize: tam, color: T.texto, lineHeight: 1.2, textAlign: 'center'}}>
          {palavras.map((p, i) => <span key={i} style={{opacity: interpolate(fr, [at + i * 2, at + i * 2 + 6], [0.15, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>{p} </span>)}
        </div>
        {autor && <Pop at={at + palavras.length * 2}><div style={{marginTop: 40, fontFamily: FU, fontSize: tam * 0.5, color: T.suave, letterSpacing: 3}}>— {autor}</div></Pop>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

type Lado = {titulo: string; itens: string[]; cor?: string};
export const Comparacao: React.FC<{esquerda: Lado; direita: Lado; em?: any; direita_em?: any}> = ({esquerda, direita, em, direita_em}) => {
  const q = useQuadro();
  const {area} = useCena();
  const coluna = (l: Lado, at: number, cor: string) => (
    <Pop at={at} de="baixo" style={{flex: 1}}>
      <Cartao style={{height: '100%', padding: '34px 30px', borderColor: cor}}>
        <div style={{fontFamily: FT, fontSize: 70, color: cor, marginBottom: 20}}>{l.titulo}</div>
        {l.itens.map((it, i) => <div key={i} style={{fontFamily: FX, fontSize: 34, color: T.texto, marginBottom: 16, lineHeight: 1.25}}>• {it}</div>)}
      </Cartao>
    </Pop>
  );
  return (
    <AbsoluteFill><Fundo />
      <div style={{position: 'absolute', inset: 50, top: area.h > 1000 ? 140 : 70, display: 'flex', gap: 28}}>
        {coluna(esquerda, q(em, 0.2), esquerda.cor ?? T.alerta)}
        {coluna(direita, q(direita_em ?? em, 1.2), direita.cor ?? T.ok)}
      </div>
    </AbsoluteFill>
  );
};
