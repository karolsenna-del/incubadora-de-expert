// Cenas de grafismo: conversa, contato, lista, número, rede, hiperespaço.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FT, FU, FX, T, useCena, useQuadro} from '../motor/contexto';
import {Bolha, Cartao, Cursor, Etiqueta, Fundo, Midia, Pop, ease} from '../motor/pecas';

// Conversa (atendimento, DM, pergunta de aluno, IA respondendo). avatar pode ser vídeo com transparência.
export const Chat: React.FC<{avatar?: {src: string; transparente?: boolean}; titulo?: string; mensagens: {lado: 'esq' | 'dir'; texto: string; em?: any}[]; selo?: {texto: string; em?: any; cor?: string}}> = ({avatar, titulo, mensagens, selo}) => {
  const q = useQuadro();
  const {area} = useCena();
  const av = Math.min(area.w * 0.46, area.h * 0.3);
  return (
    <AbsoluteFill><Fundo cor={T.acento2} />
      {avatar && <div style={{position: 'absolute', left: area.w / 2 - av / 2, top: 30, width: av, height: av}}><Midia s={avatar.src} transparente={avatar.transparente} loop={5} style={{width: av, height: av, objectFit: 'contain'}} /></div>}
      {titulo && <div style={{position: 'absolute', top: avatar ? av + 30 : 60, width: '100%', textAlign: 'center', fontFamily: FU, fontWeight: 700, fontSize: 40, color: T.texto}}>{titulo}</div>}
      <div style={{position: 'absolute', left: 60, right: 60, top: avatar ? av + (titulo ? 110 : 60) : 160, display: 'flex', flexDirection: 'column', gap: 26}}>
        {mensagens.map((m, i) => (
          <Pop key={i} at={q(m.em, 0.3 + i * 1.2)} de="baixo" style={{alignSelf: m.lado === 'esq' ? 'flex-start' : 'flex-end', maxWidth: '86%'}}>
            <Bolha lado={m.lado}>{m.texto}</Bolha>
          </Pop>
        ))}
        {selo && <Pop at={q(selo.em, 3)} style={{alignSelf: 'center'}}><Etiqueta cor={selo.cor ?? T.ok} tamanho={38}>{selo.texto}</Etiqueta></Pop>}
      </div>
    </AbsoluteFill>
  );
};

// Cartão de contato/produto/oferta com botão que é clicado no tempo certo
export const Contato: React.FC<{avatar?: string; titulo: string; subtitulo?: string; destaque?: string; botao?: {texto: string; depois?: string; clique?: any}; cor?: string}> = ({avatar, titulo, subtitulo, destaque, botao, cor}) => {
  const fr = useCurrentFrame();
  const q = useQuadro();
  const {area} = useCena();
  const clique = botao?.clique !== undefined ? q(botao.clique) : -999;
  const feito = fr >= clique + 4 && clique > 0;
  const cx = interpolate(fr, [clique - 24, clique], [area.w * 0.82, area.w / 2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cy = interpolate(fr, [clique - 24, clique], [area.h * 0.92, area.h * 0.66], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill><Fundo cor={cor ?? T.ok} />
      <Pop at={2} de="baixo" style={{position: 'absolute', left: 90, right: 90, top: area.h * 0.1}}>
        <Cartao style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
          {avatar && <div style={{width: 150, height: 150, borderRadius: 75, overflow: 'hidden', border: `4px solid ${T.acento2}`}}><Midia s={avatar} style={{width: 150, height: 150, objectFit: 'cover'}} /></div>}
          <div style={{fontFamily: FU, fontWeight: 700, fontSize: 52, color: T.texto, textAlign: 'center'}}>{titulo}</div>
          {subtitulo && <div style={{fontFamily: FX, fontSize: 32, color: T.suave, textAlign: 'center'}}>{subtitulo}</div>}
          {destaque && <div style={{fontFamily: FU, fontWeight: 600, fontSize: 46, color: T.acento2}}>{destaque}</div>}
          {botao && <div style={{marginTop: 18, minWidth: 520, padding: '0 40px', height: 96, borderRadius: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', background: feito ? T.ok : T.acento, color: '#fff', fontFamily: FU, fontWeight: 700, fontSize: 38, transform: `scale(${fr >= clique && fr < clique + 5 ? 0.94 : 1})`}}>{feito ? `✓  ${botao.depois ?? botao.texto}` : botao.texto}</div>}
        </Cartao>
      </Pop>
      {botao && fr >= clique - 24 && fr < clique + 30 && <Cursor x={cx} y={cy} clique={clique} />}
    </AbsoluteFill>
  );
};

// Lista que se preenche (a lista vazia promete o fim). estilo check ou numero. final: texto grande que toma a cena.
export const Lista: React.FC<{titulo?: string; itens: (string | {texto: string; em?: any})[]; em?: any; passo?: number; estilo?: 'check' | 'numero'; vazia_antes?: boolean; final?: {linhas: string[]; em: any; botao?: string; botao_em?: any}}> = ({titulo, itens, em, passo = 0.4, estilo = 'check', vazia_antes = true, final}) => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  const q = useQuadro();
  const {area} = useCena();
  if (final && fr >= q(final.em)) {
    const bA = final.botao_em !== undefined ? q(final.botao_em) : q(final.em) + 15;
    return (
      <AbsoluteFill><Fundo />
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 40}}>
          <Pop at={q(final.em)}><div style={{fontFamily: FT, fontSize: Math.min(area.w, area.h) * 0.16, color: T.texto, lineHeight: 0.95, textAlign: 'center'}}>{final.linhas.map((l, i) => <div key={i} style={{color: i % 2 ? T.acento2 : T.texto}}>{l}</div>)}</div></Pop>
          {final.botao && <Pop at={bA}><div style={{transform: `scale(${1 + 0.04 * Math.sin((fr - bA) / 3)})`, padding: '26px 60px', borderRadius: 60, background: T.acento, color: '#fff', fontFamily: FU, fontWeight: 700, fontSize: 46, boxShadow: `0 0 50px ${T.acento}`}}>{final.botao}</div></Pop>}
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  const base = q(em, 0.3);
  const tam = Math.min(area.w, area.h * 1.1) / 1080;
  return (
    <AbsoluteFill><Fundo />
      <Cartao style={{position: 'absolute', left: 90 * tam, right: 90 * tam, top: area.h * 0.12, display: 'flex', flexDirection: 'column', gap: 26 * tam}}>
        {titulo && <div style={{fontFamily: FU, fontWeight: 700, fontSize: 46 * tam, color: T.texto}}>{titulo}</div>}
        {itens.map((raw, i) => {
          const it = typeof raw === 'string' ? {texto: raw} : raw;
          const at = it.em !== undefined ? q(it.em) : base + Math.round(i * passo * 30);
          const ok = fr >= at;
          if (!ok && !vazia_antes) return null;
          const s = spring({frame: fr - at, fps, config: {damping: 12}});
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, opacity: ok ? 1 : 0.35}}>
              <div style={{width: 64 * tam, height: 64 * tam, flexShrink: 0, borderRadius: 18, border: `3px solid ${ok ? T.acento2 : T.linha}`, background: ok ? `${T.acento2}33` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.acento2, fontFamily: FU, fontSize: 40 * tam, fontWeight: 800, transform: `scale(${ok ? 0.7 + 0.3 * s : 1})`}}>{estilo === 'numero' ? i + 1 : ok ? '✓' : ''}</div>
              <div style={{fontFamily: FX, fontWeight: 600, fontSize: 42 * tam, color: T.texto, lineHeight: 1.2}}>{ok || estilo === 'numero' ? it.texto : ''}</div>
            </div>
          );
        })}
      </Cartao>
    </AbsoluteFill>
  );
};

// Número que conta (resultado, porcentagem, dinheiro) com barra opcional
export const Numero: React.FC<{rotulo?: string; de?: number; ate: number; prefixo?: string; sufixo?: string; barra?: boolean; em?: any; duracao?: number; casas?: number; cor?: string}> = ({rotulo, de = 0, ate, prefixo = '', sufixo = '', barra, em, duracao = 1.2, casas = 0, cor}) => {
  const fr = useCurrentFrame();
  const q = useQuadro();
  const {area} = useCena();
  const a = q(em, 0.1);
  const p = ease(fr, a, a + duracao * 30);
  const v = de + (ate - de) * p;
  const txt = v.toLocaleString('pt-BR', {minimumFractionDigits: casas, maximumFractionDigits: casas});
  return (
    <AbsoluteFill><Fundo cor={cor} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 30}}>
        {rotulo && <div style={{fontFamily: FU, fontWeight: 700, fontSize: 44, color: T.suave, letterSpacing: 4, textTransform: 'uppercase'}}>{rotulo}</div>}
        <div style={{fontFamily: FT, fontSize: Math.min(area.w, area.h) * 0.24, color: cor ?? T.texto, lineHeight: 0.9}}>{prefixo}{txt}{sufixo}</div>
        {barra && <div style={{width: area.w * 0.76, height: 34, borderRadius: 17, background: T.linha, overflow: 'hidden'}}><div style={{width: `${p * 100}%`, height: '100%', background: `linear-gradient(90deg, ${T.acento}, ${T.acento2})`, boxShadow: `0 0 30px ${T.acento2}`}} /></div>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Rede de conexões que se liga (comunidade, networking, sistema integrado)
export const Rede: React.FC<{centro?: string; texto?: string; em?: any; nos?: number}> = ({centro = 'VOCÊ', texto, em, nos = 26}) => {
  const fr = useCurrentFrame();
  const q = useQuadro();
  const {area} = useCena();
  const cx = area.w / 2, cy = area.h * 0.36;
  const R = Math.min(area.w, area.h) * 0.42;
  const pts = Array.from({length: nos}, (_, i) => {
    const a = i * 2.39996; const r = R * (0.3 + ((i * 71) % 100) / 140);
    return {x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.9, d: i * 3};
  });
  const b = q(em, 1.5);
  return (
    <AbsoluteFill><Fundo cor={T.acento2} />
      <svg width={area.w} height={area.h} style={{position: 'absolute'}}>
        {pts.map((n, i) => {
          const p = ease(fr, n.d, n.d + 14);
          const m = pts[(i * 7 + 3) % pts.length];
          const k = ease(fr, n.d + 8, n.d + 24);
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={cx + (n.x - cx) * p} y2={cy + (n.y - cy) * p} stroke={T.acento} strokeOpacity={0.5} strokeWidth={2} />
              <line x1={n.x} y1={n.y} x2={n.x + (m.x - n.x) * k} y2={n.y + (m.y - n.y) * k} stroke={T.acento2} strokeOpacity={0.35} strokeWidth={1.5} />
              <circle cx={n.x} cy={n.y} r={10 * p + (fr > b ? 3 * Math.sin((fr + i * 5) / 4) : 0)} fill={i % 3 ? T.acento2 : T.texto} />
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={70} fill={T.acento} />
        <text x={cx} y={cy + 13} textAnchor="middle" fill="#fff" fontFamily={FU} fontWeight={700} fontSize={34}>{centro}</text>
      </svg>
      {texto && <Pop at={b} style={{position: 'absolute', top: cy + R + 20, width: '100%', textAlign: 'center'}}><div style={{fontFamily: FT, fontSize: Math.min(area.w, area.h) * 0.15, color: T.acento2, textShadow: `0 0 50px ${T.acento}`}}>{texto}</div></Pop>}
    </AbsoluteFill>
  );
};

// Hiperespaço/velocidade: estrelas em fuga + textos (metáfora de velocidade, virada, "nave", "foguete")
export const Hiperespaco: React.FC<{textos?: {texto: string; em?: any; cor?: string}[]}> = ({textos = []}) => {
  const fr = useCurrentFrame();
  const q = useQuadro();
  const {area} = useCena();
  const cx = area.w / 2, cy = area.h * 0.42;
  const vel = interpolate(fr, [0, 20, 60], [0.3, 1, 2.2], {extrapolateRight: 'clamp'});
  const ats = textos.map((t, i) => q(t.em, i * 0.8));
  let atual = -1;
  ats.forEach((a, i) => { if (fr >= a) atual = i; });
  return (
    <AbsoluteFill style={{background: '#02030a'}}>
      <svg width={area.w} height={area.h}>
        {Array.from({length: 220}, (_, i) => {
          const a = (i * 137.508 * Math.PI) / 180; const r0 = 30 + ((i * 97) % 400); const v = 0.6 + ((i * 53) % 100) / 60;
          const r = (r0 + fr * 14 * v * vel) % (Math.max(area.w, area.h) * 0.75);
          const len = 20 + r * 0.25 * vel;
          const cor = i % 5 === 0 ? T.acento2 : i % 7 === 0 ? T.acento : T.texto;
          return <line key={i} x1={cx + Math.cos(a) * r} y1={cy + Math.sin(a) * r} x2={cx + Math.cos(a) * (r + len)} y2={cy + Math.sin(a) * (r + len)} stroke={cor} strokeWidth={1 + r / 400} strokeOpacity={Math.min(1, r / 300)} strokeLinecap="round" />;
        })}
      </svg>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 42%, ${T.acento}55 0%, transparent 40%)`}} />
      {atual >= 0 && (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', top: -area.h * 0.13}}>
          <Pop key={atual} at={ats[atual]}><div style={{fontFamily: FT, fontSize: Math.min(area.w, area.h) * 0.24, color: textos[atual].cor ?? T.texto, textAlign: 'center', lineHeight: 0.95, textShadow: `0 0 70px ${T.acento}`}}>{textos[atual].texto}</div></Pop>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
