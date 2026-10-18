// Cenas de mídia: imagem com movimento, b-roll de vídeo, mundo ilustrado, celular e demonstração de tela.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {DATA, FT, FU, T, useCena, useQuadro} from '../motor/contexto';
import {Cursor, Enquadra, Etiqueta, Fundo, Midia, Moldura, Pop, Ret, Tarja, cabe, retEm} from '../motor/pecas';

type Chip = {texto: string; em?: any; cor?: string};
const Chips: React.FC<{chips?: Chip[]; topo?: number; esq?: number}> = ({chips = [], topo, esq = 60}) => {
  const q = useQuadro();
  const {area} = useCena();
  return (
    <div style={{position: 'absolute', left: esq, top: topo ?? area.h * 0.42, display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'flex-start'}}>
      {chips.map((c, i) => <Pop key={i} at={q(c.em, 0.3 + i * 0.6)} de="esq"><Etiqueta cor={c.cor ?? T.acento2} tamanho={(c as any).tamanho ?? 52}>{c.texto}</Etiqueta></Pop>)}
    </div>
  );
};

// Imagem (ou vídeo) cobrindo a área, com zoom lento, título e chips que entram no tempo da fala
export const Imagem: React.FC<{src: string; zoom?: [number, number]; titulo?: string; chips?: Chip[]; escurece?: boolean; foco?: string}> = ({src, zoom = [1.05, 1.18], titulo, chips, escurece = true, foco = '50% 40%'}) => {
  const fr = useCurrentFrame();
  const {cena} = useCena();
  const dur = (cena.t1 - cena.t0) * 30;
  const z = interpolate(fr, [0, dur], zoom);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <Midia s={src} loop={30} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: foco, transform: `scale(${z})`}} />
      {escurece && <AbsoluteFill style={{background: `linear-gradient(${T.fundo}66, transparent 30%, transparent 55%, ${T.fundo}EE 100%)`}} />}
      {titulo && <div style={{position: 'absolute', left: 60, top: 70, padding: '14px 28px', borderRadius: 20, background: `${T.fundo}D9`, fontFamily: FU, fontWeight: 700, color: T.texto, fontSize: 50}}>{titulo}</div>}
      <Chips chips={chips} />
    </AbsoluteFill>
  );
};

// B-roll de vídeo (gerado, de acervo ou gravado). texto opcional por cima.
// take: duração do vídeo em segundos (take gerado = 5); se a cena for mais longa, o vídeo repete em vez de congelar
export const Video: React.FC<{src: string; inicio?: number; zoom?: [number, number]; textos?: (Chip & {tamanho?: number})[]; escurece?: number; foco?: string; take?: number}> = ({src, inicio = 0, zoom = [1.0, 1.08], textos = [], escurece = 0.25, foco = '50% 50%', take}) => {
  const fr = useCurrentFrame();
  const q = useQuadro();
  const {cena, area} = useCena();
  const z = interpolate(fr, [0, (cena.t1 - cena.t0) * 30], zoom);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <Midia s={src} inicio={inicio} loop={take ? take - inicio : undefined} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: foco, transform: `scale(${z})`}} />
      <AbsoluteFill style={{background: `radial-gradient(circle, transparent 40%, #000 100%)`, opacity: escurece * 2}} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        {textos.map((t, i) => (
          <Pop key={i} at={q(t.em, 0.2)}><div style={{fontFamily: FT, fontSize: cabe(t.texto, t.tamanho ?? Math.min(area.w, area.h) * 0.2, area.w), color: t.cor ?? T.texto, lineHeight: 0.95, textAlign: 'center', textShadow: `0 10px 50px #000, 0 0 60px ${t.cor ?? T.acento}88`}}>{t.texto}</div></Pop>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Mundo ilustrado / b-roll de palavra: cada imagem entra na palavra dita, corte rápido, com leve movimento.
// modo "cartas" empilha cartões sobre o fundo (bom sobre o rosto); modo "cheio" troca a tela inteira.
export const Palavras: React.FC<{itens: {em: any; src: string; texto?: string}[]; modo?: 'cheio' | 'cartas'}> = ({itens, modo = 'cheio'}) => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  const q = useQuadro();
  const {area} = useCena();
  const ats = itens.map((it) => q(it.em));
  let atual = -1;
  ats.forEach((a, i) => { if (fr >= a) atual = i; });
  if (modo === 'cartas') {
    return (
      <AbsoluteFill>
        {itens.map((it, i) => {
          if (fr < ats[i] || i < atual - 2) return null;
          const s = spring({frame: fr - ats[i], fps, config: {damping: 13}});
          const rot = ((i * 37) % 14) - 7;
          const w = area.w * 0.62;
          return (
            <div key={i} style={{position: 'absolute', left: area.w / 2 - w / 2 + (((i * 53) % 120) - 60), top: area.h * 0.18 + (((i * 29) % 80) - 40), width: w, transform: `rotate(${rot}deg) scale(${0.5 + 0.5 * s})`, opacity: Math.min(1, s * 1.5), borderRadius: 26, overflow: 'hidden', border: `6px solid ${T.texto}`, boxShadow: '0 30px 80px #000C'}}>
              <Midia s={it.src} style={{width: '100%', display: 'block'}} />
              {it.texto && <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 20px', background: `${T.fundo}E0`, fontFamily: FT, fontSize: 64, color: T.texto}}>{it.texto}</div>}
            </div>
          );
        })}
      </AbsoluteFill>
    );
  }
  if (atual < 0) return <Fundo />;
  const it = itens[atual];
  const d = fr - ats[atual];
  const z = 1.12 - Math.min(d, 40) * 0.002;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <Midia s={it.src} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`}} />
      <AbsoluteFill style={{background: `linear-gradient(transparent 50%, ${T.fundo}CC)`}} />
      {d < 3 && <AbsoluteFill style={{background: '#fff', opacity: 0.25 * (1 - d / 3)}} />}
      {it.texto && <div style={{position: 'absolute', bottom: area.h * 0.1, width: '100%', textAlign: 'center', fontFamily: FT, fontSize: Math.min(area.w, area.h) * 0.16, color: T.texto, textShadow: '0 8px 40px #000'}}>{it.texto}</div>}
    </AbsoluteFill>
  );
};

// Celular com imagem/vídeo dentro (print de app, WhatsApp, story...). rolar: desce a imagem devagar.
export const Telefone: React.FC<{src: string; etiqueta?: string; cor?: string; rolar?: number}> = ({src, etiqueta, cor, rolar = 0}) => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {area, cena} = useCena();
  const s = spring({frame: fr, fps, config: {damping: 15}});
  const h = area.h * 0.84;
  const w = h * 0.5;
  const desce = interpolate(fr, [10, (cena.t1 - cena.t0) * 30], [0, rolar], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill><Fundo cor={cor} />
      <div style={{position: 'absolute', left: area.w / 2 - w / 2, top: area.h * 0.1 + (1 - s) * 500}}>
        <Moldura tipo="telefone" W={w} H={h}><Midia s={src} style={{width: '100%', transform: `translateY(${-desce}px)`}} /></Moldura>
      </div>
      {etiqueta && <Pop at={8} de="esq" style={{position: 'absolute', left: 40, top: 40}}><Etiqueta cor={cor}>{etiqueta}</Etiqueta></Pop>}
    </AbsoluteFill>
  );
};

// Demonstração de tela: print (ou vídeo de tela) numa moldura, com zoom guiado, cursor que clica e troca de tela.
type Troca = {src: string; natural: [number, number]; em: any; de: Ret; para?: Ret; etiqueta?: string};
export const Tela: React.FC<{
  src: string; natural: [number, number]; de: Ret; para?: Ret; zoom_de?: any; zoom_ate?: any; moldura?: 'navegador' | 'janela' | 'telefone' | 'nenhuma';
  url?: string; etiqueta?: string; etiqueta_cor?: string; cursor?: {alvo: [number, number]; clique: any; de?: [number, number]}; troca?: Troca; brilho_em?: any; tarjas?: Tarja[];
}> = ({src, natural, de, para, zoom_de, zoom_ate, moldura = 'navegador', url = '', etiqueta, etiqueta_cor, cursor, troca, brilho_em, tarjas}) => {
  const fr = useCurrentFrame();
  const q = useQuadro();
  const {area, cena} = useCena();
  const dur = Math.round((cena.t1 - cena.t0) * 30);
  const topo = etiqueta ? 130 : 60;
  const Wv = area.w - 100;
  const Hv = Math.min(area.h - topo - 60 - (moldura === 'navegador' || moldura === 'janela' ? 56 : 0), Wv * 1.2);
  const clique = cursor ? q(cursor.clique) : -999;
  const tTroca = troca ? q(troca.em) : 99999;
  const fade = interpolate(fr, [tTroca - 4, tTroca + 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const brilho = brilho_em !== undefined && fr >= q(brilho_em) ? 0.5 + 0.5 * Math.sin((fr - q(brilho_em)) / 5) : fr >= clique ? 0.5 : 0;
  // posição do cursor: do canto até o alvo (coordenadas da imagem convertidas para a tela)
  const za = zoom_de !== undefined ? q(zoom_de) : cursor ? clique + 4 : 0;
  const zb = zoom_ate !== undefined ? q(zoom_ate) : troca ? tTroca : dur;
  let cur = null as null | React.ReactNode;
  if (cursor && fr < tTroca) {
    // o alvo acompanha o zoom: depois do clique o cursor continua em cima do botão
    const r = retEm(Math.max(fr, clique), de, para, za, zb); const k = Wv / r.w;
    const ax = 50 + (cursor.alvo[0] - r.x) * k;
    const ay = topo + (moldura === 'navegador' || moldura === 'janela' ? 56 : 0) + (cursor.alvo[1] - r.y) * k;
    const o = cursor.de ?? [area.w * 0.8, area.h * 0.9];
    const x = fr < clique ? interpolate(fr, [0, clique], [o[0], ax], {easing: Easing.inOut(Easing.cubic)}) : ax;
    const y = fr < clique ? interpolate(fr, [0, clique], [o[1], ay], {easing: Easing.inOut(Easing.cubic)}) : ay;
    cur = <Cursor x={x} y={y} clique={clique} />;
  }
  return (
    <AbsoluteFill><Fundo />
      <div style={{position: 'absolute', left: 50, top: topo}}>
        <Moldura tipo={moldura} W={Wv} H={Hv} url={url} brilho={brilho}>
          <div style={{position: 'absolute', inset: 0, opacity: 1 - fade}}><Enquadra s={src} natural={natural} de={de} para={para} a={za} b={zb} W={Wv} H={Hv} tarjas={tarjas} /></div>
          {troca && <div style={{position: 'absolute', inset: 0, opacity: fade}}><Enquadra s={troca.src} natural={troca.natural} de={troca.de} para={troca.para} a={tTroca} b={dur} W={Wv} H={Hv} /></div>}
        </Moldura>
      </div>
      {cur}
      {etiqueta && (
        <Pop at={4} de="baixo" style={{position: 'absolute', top: 40, width: '100%', textAlign: 'center'}}>
          <Etiqueta cor={etiqueta_cor}>{fr >= tTroca && troca?.etiqueta ? troca.etiqueta : etiqueta}</Etiqueta>
        </Pop>
      )}
    </AbsoluteFill>
  );
};

// O próprio bruto (quadro inteiro, sem recorte de rosto), sincronizado com a fala, com zoom guiado numa região.
// Para vídeo sem rosto: tela filmada pelo celular, gravação de tela, Meet, demonstração de produto.
// Coordenadas em px de media/bruto.mp4 (tamanho em data.json "bruto": [largura, altura]).
export const Filmada: React.FC<{de?: Ret; para?: Ret; zoom_de?: any; zoom_ate?: any; moldura?: 'nenhuma' | 'janela' | 'navegador' | 'telefone';
  etiqueta?: string; etiqueta_cor?: string; passo?: number | string; tarjas?: Tarja[]; margem?: number}> = ({de, para, zoom_de, zoom_ate, moldura = 'nenhuma', etiqueta, etiqueta_cor, passo, tarjas, margem}) => {
  const q = useQuadro();
  const {area, cena} = useCena();
  const [bw, bh] = DATA.bruto ?? [1080, 1920];
  const inteiro = {x: 0, y: 0, w: bw};
  const m = margem ?? (moldura === 'nenhuma' ? 0 : 50);
  const topo = etiqueta || passo !== undefined ? (m ? 130 : 0) : m;
  const Wv = area.w - 2 * m;
  const Hv = area.h - topo - m - (moldura === 'navegador' || moldura === 'janela' ? 56 : 0);
  const dur = Math.round((cena.t1 - cena.t0) * 30);
  // o bruto.mp4 segue a linha do tempo do vídeo final: a cena começa no mesmo ponto
  const conteudo = <Enquadra s="media/bruto.mp4" natural={[bw, bh]} de={de ?? inteiro} para={para} a={zoom_de !== undefined ? q(zoom_de) : 0} b={zoom_ate !== undefined ? q(zoom_ate) : dur} W={Wv} H={Hv} tarjas={tarjas} inicio={cena.t0} />;
  return (
    <AbsoluteFill><Fundo />
      <div style={{position: 'absolute', left: m, top: topo}}>
        {moldura === 'nenhuma' ? <div style={{position: 'relative', width: Wv, height: Hv, overflow: 'hidden', borderRadius: m ? T.raio : 0}}>{conteudo}</div>
          : <Moldura tipo={moldura} W={Wv} H={Hv}>{conteudo}</Moldura>}
      </div>
      {(etiqueta || passo !== undefined) && (
        <Pop at={3} de="baixo" style={{position: 'absolute', top: m ? 40 : 60, width: '100%', display: 'flex', justifyContent: 'center', gap: 16}}>
          {passo !== undefined && <div style={{width: 64, height: 64, borderRadius: 32, background: T.acento, color: '#fff', fontFamily: FU, fontWeight: 800, fontSize: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 30px ${T.acento}`}}>{passo}</div>}
          {etiqueta && <Etiqueta cor={etiqueta_cor}>{etiqueta}</Etiqueta>}
        </Pop>
      )}
    </AbsoluteFill>
  );
};
