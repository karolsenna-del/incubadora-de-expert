// Montagem: rosto (cheio, dividido ou em círculo) + cenas do plano + legenda + headline + som.
import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENAS, Cena, CenaCtx, DATA, FPS, FT, FU, H, PAINEL, PLANO, ROSTO_X, T, VERTICAL, W, areaDe, beat, cenaEm, f, layoutEm, painelX} from './contexto';
import {REGISTRO} from '../cenas';
import {ATRAS, LEG, LEG_FRENTE, MOMENTOS, ehEnfase} from './legendas';
import {LegendaAtras} from './atras';
import {COMPONENTES} from './legendas-extra';
import {Fundo} from './pecas';

// ---------- rosto ----------
const corteEm = (t: number) => DATA.cortes.findIndex((c: any) => t >= c.t0 && t < c.t1);
const ZOOMS: number[] = PLANO.rosto?.zoom ?? [1, 1.05];

// ---------- palco horizontal (squad 3.0 refeito na casa): câmera que abre afastando e empurra devagar a cada trecho,
// e o vidro do layout "lado", onde a pessoa desliza no tamanho original para um painel em pé e volta para a tela cheia ----------
type Estado = 'cheio' | 'esquerda' | 'direita';
const CAMERA: string = PLANO.rosto?.camera ?? (PLANO.rosto?.zoom ? 'alterna' : 'empurra'); // empurra | alterna | parada
const EMPURRA: number = PLANO.rosto?.empurra ?? 0.06;   // quanto cada trecho aproxima, do começo ao fim dele
const ABERTURA: number = PLANO.rosto?.abertura ?? 0.65; // s do zoom de abertura 1,10 → 1,00 (0 desliga)
const DESLIZE = 26; // quadros da ida e da volta do vidro
const estadoEm = (t: number): Estado => { const c = cenaEm(t); return c?.layout === 'lado' ? (c.pessoa as Estado) : 'cheio'; };
const MARCOS: number[] = Array.from(new Set(CENAS.flatMap((c) => [c.t0, c.t1]))).filter((x) => x > 0).sort((a, b) => a - b);
const zoomCamera = (t: number): number => {
  if (CAMERA === 'alterna') return ZOOMS[Math.max(0, corteEm(t)) % ZOOMS.length];
  if (CAMERA === 'parada') return 1;
  const j = DATA.janelas.find((x: any) => t >= x.t0 && t < x.t1) ?? DATA.janelas[DATA.janelas.length - 1];
  if (!j) return 1;
  if (j === DATA.janelas[0] && ABERTURA > 0) return interpolate(t, [0, ABERTURA], [1.1, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return 1 + EMPURRA * Math.min(1, Math.max(0, (t - j.t0) / Math.max(0.5, j.t1 - j.t0)));
};
const geoDe = (e: Estado) => e === 'cheio' ? {x: 0, y: 0, w: W, h: H, r: 0, v: 0, tx: 0, ty: 0}
  : {x: painelX(e), y: PAINEL.y, w: PAINEL.w, h: PAINEL.h, r: 32, v: 1, tx: Math.min(0, Math.max(PAINEL.w - W, PAINEL.w / 2 - ROSTO_X * W)), ty: -60};

const PalcoH: React.FC<{soco: number}> = ({soco}) => {
  const fr = useCurrentFrame();
  const t = fr / FPS;
  const e = estadoEm(t);
  let desde = -1, antes: Estado = e;
  for (const m of MARCOS) {
    if (m > t) break;
    const a = estadoEm(m - 0.001);
    if (a !== estadoEm(m)) { desde = m; antes = a; }
  }
  const local = desde < 0 ? 999 : fr - f(desde);
  const p = local >= DESLIZE + 2 ? 1 : spring({frame: local, fps: FPS, config: {damping: 200, stiffness: 120, mass: 0.9}, durationInFrames: DESLIZE});
  const A = geoDe(antes), B = geoDe(e);
  const g = (k: keyof typeof A) => A[k] + (B[k] - A[k]) * p;
  // no vidro a imagem não tem zoom; a sobra de zoom do rosto cheio sai junto com o deslize (sem pulo na emenda)
  const zA = antes === 'cheio' ? zoomCamera(Math.max(0, desde - 1 / FPS)) : 1;
  const zB = e === 'cheio' ? zoomCamera(t) + soco : 1;
  const z = zA + (zB - zA) * p;
  const v = g('v');
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: g('x'), top: g('y'), width: g('w'), height: g('h'), borderRadius: g('r'), overflow: 'hidden',
        boxShadow: v > 0.05 ? `0 34px 90px rgba(0,0,0,${0.55 * v})` : undefined, border: v > 0.05 ? `1px solid rgba(255,255,255,${0.16 * v})` : undefined}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `translate(${g('tx')}px, ${g('ty')}px) scale(${z})`, transformOrigin: `${ROSTO_X * 100}% 35%`}}>
          <OffthreadVideo muted src={staticFile('media/full.mp4')} style={{width: W, height: H}} />
          {ATRAS && <LegendaAtras />}
        </div>
        {v > 0.05 && <div style={{position: 'absolute', inset: 0, background: `linear-gradient(135deg, rgba(255,255,255,${0.15 * v}), rgba(255,255,255,0) 45%)`, boxShadow: `inset 0 1px 0 rgba(255,255,255,${0.3 * v})`}} />}
      </div>
    </AbsoluteFill>
  );
};

import {zoomRosto} from './camera';
import {PalcoSpot} from './spotlight';
import {TEMPLATE} from './contexto';

const Rosto: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / FPS;
  const lay = layoutEm(t);
  // soco: zoom rápido no rosto em beats de impacto (plano.rosto.socos), criado no workshop de 27/09
  const socos: number[] = (PLANO.rosto?.socos ?? []).map((x: any) => (typeof x === 'number' ? x : beat(x)));
  const soco = socos.reduce((acc, x) => {
    const d = fr - f(x);
    return d >= 0 && d < 12 ? Math.max(acc, 0.14 * (1 - spring({frame: d, fps: FPS, config: {damping: 12}}))) + (d < 2 ? 0.14 : 0) : acc;
  }, 0);
  if (!VERTICAL && (lay === 'rosto' || lay === 'lado')) return <PalcoH soco={soco} />;
  if (TEMPLATE === 'spotlight' && (lay === 'rosto' || lay === 'janela' || lay === 'painel')) return <PalcoSpot soco={soco} />;
  const z = zoomRosto(fr) + soco; // movimento de câmera: motor/camera.ts (plano.rosto.movimento)
  if (lay === 'rosto') {
    return (
      <AbsoluteFill style={{overflow: 'hidden'}}>
        {/* legenda atrás: o texto mora na parede, no mesmo zoom do vídeo, e a máscara da pessoa esconde a parte atrás dela */}
        <div style={{position: 'absolute', width: W, height: H, transform: `scale(${z})`, transformOrigin: '50% 32%'}}>
          <OffthreadVideo muted src={staticFile('media/full.mp4')} style={{width: W, height: H}} />
          {ATRAS && <LegendaAtras />}
        </div>
        {VERTICAL && <AbsoluteFill style={{background: `linear-gradient(transparent 62%, ${T.fundo}B0 100%)`}} />}
      </AbsoluteFill>
    );
  }
  if (lay === 'dividida') {
    const box = VERTICAL ? {left: 0, top: 960, width: 1080, height: 960} : {left: 1152, top: 0, width: 768, height: 1080};
    return (
      <div style={{position: 'absolute', ...box, overflow: 'hidden'}}>
        <OffthreadVideo muted src={staticFile('media/half.mp4')} style={{width: box.width, height: box.height, transform: `scale(${z})`, transformOrigin: '50% 35%'}} />
      </div>
    );
  }
  return null;
};

const Pip: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / FPS;
  const c = cenaEm(t);
  if (!c || c.layout !== 'pip') return null;
  const s = spring({frame: fr - f(c.t0), fps: FPS, config: {damping: 15}});
  const d = VERTICAL ? 340 : 300;
  const pos = VERTICAL ? {left: 540 - d / 2, top: 1470} : {left: 1920 - d - 60, top: 1080 - d - 60};
  const hw = VERTICAL ? [1080, 960] : [768, 1080];
  const k = (d * 1.25) / hw[1];
  return (
    <div style={{position: 'absolute', ...pos, width: d, height: d, borderRadius: d / 2, overflow: 'hidden', border: `6px solid ${T.acento}`, boxShadow: `0 0 50px ${T.acento}88`, transform: `scale(${s})`}}>
      <OffthreadVideo muted src={staticFile('media/half.mp4')} style={{position: 'absolute', width: hw[0] * k, height: hw[1] * k, left: -(hw[0] * k - d) / 2, top: -d * 0.08}} />
    </div>
  );
};

// ---------- legenda (estilos prontos em legendas.ts: plano.legenda.estilo_visual) ----------
type P = {t0: number; t1: number; w: string};
const BLOCOS: P[][] = (() => {
  const out: P[][] = [];
  let cur: P[] = [];
  const ws = DATA.palavras as P[];
  ws.forEach((w, i) => {
    // estilo premium: a palavra forte sai sozinha na tela
    if (LEG.enfase_sozinha && ehEnfase(w.w) && cur.length) { out.push(cur); cur = []; }
    cur.push(w);
    const txt = cur.map((x) => x.w).join(' ');
    const prox = ws[i + 1];
    if (cur.length >= LEG.max_palavras || txt.length >= LEG.max_letras || /[.,!?]$/.test(w.w) || !prox || prox.t0 - w.t1 > 0.35
      || (LEG.enfase_sozinha && (ehEnfase(w.w) || ehEnfase(prox.w)))) {
      out.push(cur);
      cur = [];
    }
  });
  return out;
})();

const POS_LEG: Record<string, number> = VERTICAL
  ? {rosto: LEG.y ?? 1330, dividida: 890, cheia: LEG.y ?? 1290, pip: LEG.y ?? 1290, janela: 905, painel: 905, ...(LEG.posicao ?? {})}
  : {rosto: 880, dividida: 900, cheia: 880, pip: 900, lado: 880, ...(LEG.posicao ?? {})};

const textoDa = (w: string) => {
  const t = LEG.pontuacao ? w : w.replace(/[.,!?;:]/g, '');
  return LEG.caixa_alta ? t.toUpperCase() : LEG.minusculas ? t.toLowerCase() : t;
};

// estilo de cor (legenda.estilo): palavra (a falada no destaque) · acumula (a dita fica no destaque, karaokê) ·
// revela (por dizer apagada, dita em luz, falada no destaque) · dividida_cor (fim da frase no destaque, na linha de baixo) · bloco
const corDa = (w: P, i: number, b: P[], t: number, enf: boolean) => {
  const destaque = LEG.cor_destaque ?? T.legenda_destaque;
  const cor = (LEG.cores ?? {})[w.w.replace(/[.,!?;:]/g, '').toLowerCase()] ?? LEG.cor ?? T.texto;
  const dito = t >= w.t0 - 0.04;
  const ativo = t >= w.t0 && (i === b.length - 1 || t < b[i + 1].t0);
  const corEnf = enf && LEG.cor_enfase && dito ? LEG.cor_enfase : null;
  switch (LEG.estilo) {
    case 'palavra': return ativo ? destaque : corEnf ?? cor;
    case 'acumula': return dito ? destaque : cor;
    case 'revela': return ativo ? destaque : dito ? corEnf ?? cor : LEG.cor_futuro ?? `${cor}8C`;
    case 'dividida_cor': return i >= corteDa(b) ? destaque : cor;
    default: return cor;
  }
};
const corteDa = (b: P[]) => (b.length > 1 ? Math.ceil(b.length * 0.6) : b.length);

// animação por palavra do cardápio animado (legenda.animacao), no tempo da própria palavra
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeOutBack = (x: number) => 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);
type Fx = {color?: string; opacity?: number; transform?: string; textShadow?: string; oculto?: boolean; preenche?: number; traco?: number};
const animar = (w: P, t: number, ativo: boolean, dito: boolean, enf: boolean): Fx => {
  const destaque = LEG.cor_destaque ?? T.legenda_destaque;
  const cor = (LEG.cores ?? {})[w.w.replace(/[.,!?;:]/g, '').toLowerCase()] ?? LEG.cor ?? T.texto;
  const desde = (ms: number) => clamp01((t - w.t0) / (ms / 1000));
  const sombra = LEG.sombra === 'none' ? undefined : LEG.sombra;
  switch (LEG.animacao) {
    case 'slam': {
      if (!dito) return {oculto: true};
      const k = easeOutBack(desde(180));
      return {color: enf && LEG.cor_enfase ? LEG.cor_enfase : cor, opacity: Math.min(1, k * 2), transform: `scale(${0.4 + 0.6 * k})`, textShadow: sombra};
    }
    case 'pinta': {
      const prog = t <= w.t0 ? 0 : w.t1 <= w.t0 ? 1 : clamp01((t - w.t0) / (w.t1 - w.t0));
      return {color: cor, preenche: prog, textShadow: sombra};
    }
    case 'cresce': {
      const e = ativo ? easeOutCubic(desde(150)) : 0;
      return {color: ativo ? destaque : dito ? cor : LEG.cor_futuro ?? cor, transform: `scale(${1 + 0.12 * e})`, textShadow: sombra};
    }
    case 'sublinhado':
      return {color: enf && LEG.cor_enfase ? LEG.cor_enfase : cor, traco: ativo ? easeOutCubic(desde(200)) : 0, textShadow: sombra};
    case 'surge':
      return {color: enf && LEG.cor_enfase ? LEG.cor_enfase : cor, opacity: 0.35 + 0.65 * easeOutCubic(desde(140))};
    default:
      return {};
  }
};

const Legenda: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / FPS;
  if (LEG.estilo === 'nenhuma') return null;
  const c = cenaEm(t);
  if (c?.props?.sem_legenda) return null;
  const lay = c?.layout ?? 'rosto';
  // legenda atrás no rosto cheio: a da frente só aparece se pedida (legenda.frente); nas outras telas ela segura a fala
  if (ATRAS && lay === 'rosto' && !LEG_FRENTE) return null;
  // cena "fala" já escreve a fala na tela (lado aberto do horizontal): a legenda sai, a não ser que a cena peça
  if (c?.tipo === 'fala' && !c.props?.legenda) return null;
  // legendas da vitrine (legendas-extra.js, gerado de arka1/packages/legendas-euriliana): o componente desenha tudo na faixa centrada em y 1250; aqui só sobe a faixa
  // para a emenda nas cenas divididas (ou para props.legenda_y / legenda.y da cena)
  // técnica de dinâmica de legenda: no trecho de um momento, a legenda forte do momento entra no lugar da de leitura
  const tempo = (x: number | string) => (typeof x === 'string' ? beat(x) : x);
  const mom = MOMENTOS.find((m) => t >= tempo(m.de) && t < tempo(m.ate));
  const componente = mom?.componente ?? LEG.componente;
  if (componente) {
    const Comp = COMPONENTES[componente];
    if (!Comp) throw new Error(`legenda: componente ${componente} não está em motor/legendas-extra.js`);
    const alvo = c?.props?.legenda_y ?? (lay === 'dividida' && VERTICAL ? POS_LEG.dividida : LEG.y_componente);
    const sobe = alvo !== undefined ? alvo + 30 - 1250 : 0;
    return <AbsoluteFill style={{transform: `translateY(${VERTICAL ? sobe : 0}px)`}}><Comp /></AbsoluteFill>;
  }
  if (LEG.estilo === 'corrida') return <LegendaCorrida c={c} lay={lay} />;
  const bi = BLOCOS.findIndex((b, i) => t >= b[0].t0 && t < (BLOCOS[i + 1]?.[0].t0 ?? DATA.total) && t < b[b.length - 1].t1 + 0.7);
  if (bi < 0) return null;
  const b = BLOCOS[bi];
  const d = fr - f(b[0].t0);
  // entrada: pop (mola que cresce), mola (sobe 16 px, pílula), subir (sobe 8 px em 5 quadros, minimalist),
  // desfoque (2 quadros borrados, premium) ou corte seco (cara de "editado no app")
  const s = LEG.entrada === 'pop' ? spring({frame: d, fps: FPS, config: {damping: 12, stiffness: 220}}) : 1;
  const sobe = LEG.entrada === 'mola' ? spring({frame: d, fps: FPS, config: {damping: 20, stiffness: 150}, durationInFrames: 8})
    : LEG.entrada === 'subir' ? interpolate(d, [0, 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}) : 1;
  const abre = LEG.entrada === 'abre' ? easeOutCubic(clamp01(d / (0.16 * FPS))) : 1;
  const desloca = (1 - sobe) * (LEG.entrada === 'mola' ? 16 : 8);
  const blur = LEG.entrada === 'desfoque' ? interpolate(d, [0, 2], [8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  const fundoEscuro = lay === 'dividida' && VERTICAL && !LEG.pilula;
  // enfase_auto: sem palavra-chave marcada no bloco, a mais longa vai em negrito
  const auto = LEG.enfase_auto && !b.some((w) => ehEnfase(w.w))
    ? b.reduce((m, w, i) => (textoDa(w.w).length > textoDa(b[m].w).length ? i : m), 0) : -1;
  // pílula: a letra encolhe para a frase caber numa linha
  const tam = LEG.tamanho_auto
    ? Math.min(LEG.tamanho, Math.floor((VERTICAL ? 900 : 1400) / Math.max(b.map((w) => textoDa(w.w)).join(' ').length * 0.6, 1)))
    : LEG.tamanho;
  const fundo = LEG.pilula ?? (fundoEscuro ? `${T.fundo}D9` : 'transparent');
  return (
    <div style={{position: 'absolute', left: margensLeg(c, lay)[0], right: margensLeg(c, lay)[1], top: c?.props?.legenda_y ?? POS_LEG[lay], display: 'flex', justifyContent: 'center', opacity: sobe * abre, transform: `translateY(${desloca}px) scale(${(0.75 + 0.25 * s) * (0.92 + 0.08 * abre)})`, filter: blur ? `blur(${blur}px)` : undefined}}>
      <div style={{display: 'flex', columnGap: tam * (LEG.espaco_palavras ?? 0.25), rowGap: tam * ((LEG.entrelinha ?? 1.15) - 1.15), flexWrap: LEG.uma_linha ? 'nowrap' : 'wrap', whiteSpace: LEG.uma_linha ? 'nowrap' : undefined, justifyContent: 'center', alignItems: 'baseline', maxWidth: LEG.largura, padding: LEG.pilula ? (LEG.raio_pilula ? `${tam * 0.28}px ${tam * 0.55}px` : '14px 30px') : fundoEscuro ? '6px 30px' : 0, borderRadius: LEG.pilula ? (LEG.raio_pilula ? tam * LEG.raio_pilula : 16) : 24, background: fundo, boxShadow: LEG.sombra_pilula}}>
        {b.map((w, i) => {
          const txt = textoDa(w.w);
          const enf = ehEnfase(w.w) || i === auto;
          const serifa = enf && LEG.enfase_fonte;
          const dito = t >= w.t0 - 0.04;
          const ativo = t >= w.t0 && (i === b.length - 1 || t < b[i + 1].t0);
          // pílula: a ênfase engrossa e dá um pulinho quando é dita
          const dt = t - w.t0;
          const pulo = enf && LEG.enfase_pulso && dt >= 0 && dt < 0.4 ? 1 + 0.08 * Math.sin(Math.PI * (dt / 0.4)) : 1;
          const grosso = enf && LEG.enfase_peso && (!LEG.enfase_pulso || dito);
          const escala = (ativo && LEG.entrada === 'pop' ? 1.08 : ativo && LEG.escala_ativa ? LEG.escala_ativa : 1) * pulo;
          const fx = LEG.animacao ? animar(w, t, ativo, dito, enf) : null;
          if (fx?.oculto) return null;
          const corFx = fx?.color ?? corDa(w, i, b, t, enf);
          return (
            <React.Fragment key={i}>
              {LEG.estilo === 'dividida_cor' && i === corteDa(b) && i > 0 ? <div style={{flexBasis: '100%', height: 0}} /> : null}
              <span style={{
                fontFamily: `'${serifa ? LEG.enfase_fonte : LEG.fonte}', ${FT}`, fontStyle: serifa && LEG.enfase_italico ? 'italic' : undefined,
                fontWeight: grosso ? LEG.enfase_peso : LEG.peso, fontSize: tam * (serifa ? LEG.enfase_escala ?? 1 : 1),
                letterSpacing: serifa ? undefined : LEG.espaco, lineHeight: 1.15,
                color: corFx, opacity: fx?.opacity,
                WebkitTextStroke: LEG.contorno ? `${LEG.contorno}px #000` : undefined, paintOrder: 'stroke fill',
                textShadow: fx ? fx.textShadow : LEG.sombra === 'none' ? undefined : LEG.sombra,
                transform: fx?.transform ?? `scale(${escala})`, transformOrigin: 'center 78%', display: 'inline-block', position: 'relative'}}>
                {txt}
                {/* pinta: cópia amarela recortada da esquerda para a direita conforme a palavra é dita */}
                {fx?.preenche ? <span aria-hidden style={{position: 'absolute', inset: 0, color: enf && LEG.cor_enfase ? LEG.cor_enfase : LEG.cor_destaque ?? T.legenda_destaque, clipPath: `inset(0 ${(1 - fx.preenche) * 100}% 0 0)`}}>{txt}</span> : null}
                {/* sublinhado: traço que corre embaixo da palavra falada */}
                {fx?.traco ? <span aria-hidden style={{position: 'absolute', left: '0.04em', right: '0.04em', bottom: '-0.06em', height: '0.08em', borderRadius: '0.04em', background: LEG.cor_destaque ?? T.legenda_destaque, transformOrigin: 'left center', transform: `scaleX(${fx.traco})`}} /> : null}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// margens da legenda: no vertical sempre 40; no horizontal a dividida e o "lado" deixam a legenda só na área aberta
const margensLeg = (c: Cena | undefined, lay: string): [number, number] => {
  if (VERTICAL) return [40, 40];
  if (lay === 'dividida') return [40, 808];
  if (lay === 'lado') return c?.pessoa === 'esquerda' ? [PAINEL.margem + PAINEL.w + 40, 40] : [40, W - painelX('direita') + 40];
  return [40, 40];
};

// ---------- legenda 20 "corrida" (a do motor antigo do squad 3.0, refeita na casa; só no horizontal) ----------
// cada palavra entra 4 quadros antes de ser dita (sobe 10 px e acende em 8 quadros) e fica 2,4 s; alinhada à esquerda,
// a palavra de ênfase vem em amarelo, 8% maior e com brilho; o bloco flutua de leve
const LegendaCorrida: React.FC<{c?: Cena; lay: string}> = ({c, lay}) => {
  const fr = useCurrentFrame();
  const t = fr / FPS;
  const fica = LEG.janela ?? 2.4;
  const ws = (DATA.palavras as P[]).filter((w) => t >= w.t0 - 4 / FPS && t <= w.t0 + fica);
  if (!ws.length) return null;
  const [l, r] = margensLeg(c, lay);
  const esq = l + (LEG.recuo ?? 80);
  const tam = LEG.tamanho;
  const destaque = LEG.cor_destaque ?? T.legenda_destaque;
  return (
    <div style={{position: 'absolute', left: esq, right: r + (LEG.recuo ?? 80), top: c?.props?.legenda_y ?? POS_LEG[lay], display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start',
      alignItems: 'baseline', columnGap: Math.round(tam * 0.18), rowGap: 4, maxWidth: LEG.largura, lineHeight: 1.05, transform: `translateY(${Math.sin((t * Math.PI * 2) / 2.8) * 3}px)`}}>
      {ws.map((w, i) => {
        const k = interpolate(fr, [f(w.t0) - 4, f(w.t0) + 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
        const enf = ehEnfase(w.w);
        return (
          <span key={`${w.t0}-${i}`} style={{fontFamily: `'${LEG.fonte}', ${FU}`, opacity: k, transform: `translateY(${(1 - k) * 10}px)`, display: 'inline-block',
            color: enf ? destaque : LEG.cor ?? T.texto, fontWeight: enf ? LEG.enfase_peso ?? 800 : LEG.peso, fontSize: enf ? tam * 1.08 : tam,
            textShadow: enf ? `0 0 18px ${destaque}8C` : LEG.sombra}}>{textoDa(w.w)}</span>
        );
      })}
    </div>
  );
};

// ---------- headline (frase na tela desde o primeiro quadro) ----------
// estilo "padrao": caixa branca com letra vermelha, some com fade. estilo "caixa": fundo de texto do Instagram
// (headline-vermelha-5x do catálogo): Figtree ExtraBold CAIXA ALTA branca, uma caixa vermelha arredondada por linha, sai em corte seco
const Headline: React.FC = () => {
  const fr = useCurrentFrame();
  const h = PLANO.headline;
  if (!h) return null;
  const ate = f(typeof h.ate === 'string' ? beat(h.ate) : h.ate ?? 8);
  if (fr >= ate) return null;
  const linhas: string[] = Array.isArray(h.texto) ? h.texto : [h.texto];
  if (h.estilo === 'caixa') {
    const tam = h.tamanho ?? (VERTICAL ? 63 : 52);
    return (
      <div style={{position: 'absolute', top: h.y ?? (VERTICAL ? 270 : 60), left: 60, right: 60, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{maxWidth: h.largura ?? (VERTICAL ? 800 : 1100), textAlign: 'center', lineHeight: 1.5}}>
          {linhas.map((l, i) => (
            <React.Fragment key={i}>
              <span style={{fontFamily: `'${h.fonte ?? 'Figtree'}', ${FU}`, fontWeight: 800, fontSize: tam, color: h.cor ?? '#FFFFFF', background: h.fundo ?? '#FA0000', borderRadius: h.raio ?? 22, padding: '0.16em 0.45em', textTransform: 'uppercase', WebkitBoxDecorationBreak: 'clone', boxDecorationBreak: 'clone'}}>{l}</span>
              {i < linhas.length - 1 ? <br /> : null}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
  const sai = interpolate(fr, [ate - 8, ate], [1, 0], {extrapolateLeft: 'clamp'});
  return (
    <div style={{position: 'absolute', top: VERTICAL ? 170 : 60, left: 60, right: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: sai}}>
      {linhas.map((l, i) => (
        <span key={i} style={{padding: '8px 22px', borderRadius: 12, background: h.fundo ?? '#FFFFFF', color: h.cor ?? '#E11D2A', fontFamily: h.fonte ? `'${h.fonte}'` : FU, fontWeight: 800, fontSize: h.tamanho ?? (VERTICAL ? 62 : 52), lineHeight: 1.15, textAlign: 'center', boxShadow: '0 8px 30px #0007'}}>{l}</span>
      ))}
    </div>
  );
};

// ---------- cenas ----------
// cenas de interface (conversa, cartão, comparação, lista) nasceram com letra pensada para área grande:
// no vertical elas saem ampliadas por padrão. props.escala muda isso em qualquer cena (1 = sem ampliar).
const ESCALA_PADRAO: Record<string, number> = VERTICAL ? {chat: 1.25, contato: 1.2, comparacao: 1.3, lista: 1.15} : {};

const SeqCena: React.FC<{c: Cena}> = ({c}) => {
  const Comp = c.tipo ? REGISTRO(c.tipo, c.props) : null;
  if (!Comp) return null;
  const a = areaDe(c.layout, c.pessoa);
  // template spotlight: os gráficos da janela e do painel saem ampliados 1,45× para ler no celular (props.escala muda)
  const k = c.props.escala ?? (TEMPLATE === 'spotlight' && (c.layout === 'janela' || c.layout === 'painel') ? 1.45 : ESCALA_PADRAO[(c.tipo ?? '').toLowerCase()] ?? 1);
  const w = a.w / k, h = a.h / k;
  return (
    <Sequence from={f(c.t0)} durationInFrames={Math.max(1, f(c.t1) - f(c.t0))}>
      <CenaCtx.Provider value={{cena: c, area: {w, h}}}>
        <div style={{position: 'absolute', left: a.x, top: a.y, width: a.w, height: a.h, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transform: `scale(${k})`, transformOrigin: '0 0'}}>
            <Comp {...c.props} />
          </div>
        </div>
      </CenaCtx.Provider>
    </Sequence>
  );
};

const Sfx: React.FC<{at: number; som: string; vol?: number}> = ({at, som, vol = 0.5}) => (
  <Sequence from={Math.max(0, f(at))} durationInFrames={90}><Audio src={staticFile(`sfx/${som}.wav`)} volume={vol} /></Sequence>
);

export const Video: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / FPS;
  const total = useVideoConfig().durationInFrames; // inclui a cauda (plano.cauda: segundos extras depois da fala, p/ cartão final)
  const trocas = CENAS.map((c) => c.t0).concat(CENAS.map((c) => c.t1)).filter((x, i, s) => x > 0.3 && x < total / FPS - 0.2 && s.indexOf(x) === i);
  const flash = PLANO.flash !== false && trocas.some((x) => fr >= f(x) && fr < f(x) + 2) ? 0.16 : 0;
  const tri = PLANO.trilha;
  // tremor: a tela inteira chacoalha ~0,3 s em beats de impacto (plano.tremores)
  const tre = (PLANO.tremores ?? []).reduce((acc: {x: number; y: number}, x: any) => {
    const at = f(typeof x === 'number' ? x : beat(x)); const d = fr - at;
    if (d < 0 || d > 10) return acc;
    const k = (1 - d / 10) * 18;
    return {x: acc.x + Math.sin(d * 2.9) * k, y: acc.y + Math.cos(d * 3.7) * k};
  }, {x: 0, y: 0});
  const sfxAuto = PLANO.sfx_auto !== false;
  return (
    <AbsoluteFill style={{background: T.fundo}}>
      <AbsoluteFill style={{transform: `translate(${tre.x}px, ${tre.y}px) scale(${tre.x || tre.y ? 1.03 : 1})`}}>
      {(!VERTICAL || TEMPLATE === 'spotlight') && <Fundo cor={T.acento} />}
      <Rosto />
      {CENAS.map((c) => <SeqCena key={c.i} c={c} />)}
      <Pip />
      {layoutEm(t) === 'dividida' && (VERTICAL
        ? <div style={{position: 'absolute', top: 957, left: 0, width: 1080, height: 6, background: T.acento, boxShadow: `0 0 24px ${T.acento}`}} />
        : <div style={{position: 'absolute', top: 0, left: 1149, width: 6, height: 1080, background: T.acento, boxShadow: `0 0 24px ${T.acento}`}} />)}
      <Headline />
      <Legenda />
      </AbsoluteFill>
      <AbsoluteFill style={{background: '#fff', opacity: flash, pointerEvents: 'none'}} />
      {PLANO.barra_progresso !== false && <div style={{position: 'absolute', top: 0, left: 0, height: 8, width: `${(fr / total) * 100}%`, background: T.acento}} />}

      <Audio src={staticFile('media/voz.wav')} />
      {tri?.src && (
        <Audio src={staticFile(tri.src)} loop volume={(q) => {
          const lay = layoutEm(q / FPS);
          const base = lay === 'cheia' ? tri.volume_cheia ?? 0.18 : tri.volume ?? 0.07;
          return base * interpolate(q, [0, 20, total - 45, total], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        }} />
      )}
      {sfxAuto && trocas.map((x) => <Sfx key={`w${x}`} at={x - 0.18} som="whoosh" vol={0.26} />)}
      {(PLANO.sfx ?? []).map((s: any, i: number) => <Sfx key={i} at={typeof s.em === 'number' ? s.em : beat(s.em)} som={s.som} vol={s.vol ?? 0.4} />)}
    </AbsoluteFill>
  );
};
