// Câmera no rosto: quanto o rosto está ampliado em cada quadro (plano.rosto). Três jeitos de mexer:
//  - "seco": pulo de aproximação no corte (punch-in), alternando perto/longe, com intervalo mínimo e teto
//  - "suave": a câmera se aproxima devagar durante a frase e volta sem corte no começo da próxima
//  - "misto": o suave de base + alguns pulos secos nos cortes de verdade (padrão nos níveis 2 e 3)
// Mais `aproximar`: momentos em que a câmera chega rápido e suave perto do rosto e depois volta (sem corte).
// Tudo calculado uma vez, quadro a quadro, antes do render (determinístico).
import {DATA, FPS, PLANO, VERTICAL, beat} from './contexto';

type Chave = {t: number; z: number; dur: number; curva: 'lenta' | 'rapida'};

const R = PLANO.rosto ?? {};
const PIRO: number = PLANO.pirotecnia ?? 2;
export const MOVIMENTO: 'seco' | 'suave' | 'misto' | 'nenhum' =
  R.movimento ?? (PIRO <= 1 ? 'suave' : 'misto');
const INT: 'leve' | 'media' | 'forte' = R.intensidade ?? (PIRO <= 1 ? 'leve' : PIRO >= 3 ? 'forte' : 'media');
const NIVEIS = {leve: [1.05, 1.08], media: [1.08, 1.13], forte: [1.1, 1.16]}[INT];
// `rosto.zoom` antigo ([1, 1.05]) continua valendo: vira o nível "perto"
const PERTO: number = R.zoom?.[1] ?? NIVEIS[0];
const MUITO: number = R.zoom?.[2] ?? Math.max(NIVEIS[1], PERTO + 0.03);
const TETO: number = R.max ?? (VERTICAL ? 1.17 : 1.12);
const BASE: number = R.zoom?.[0] ?? 1;
const INTERVALO_SECO: number = R.intervalo ?? {leve: 3.2, media: 2.4, forte: 1.8}[INT];
// no seco, sem corte nem começo de frase por perto, pula numa palavra para o rosto não ficar parado mais que isso
const MAX_PARADO: number = {leve: 5, media: 4, forte: 3}[INT];

const tempo = (x: any): number => (typeof x === 'number' ? x : beat(x));
const ease = (p: number, curva: Chave['curva']) => {
  const x = Math.min(1, Math.max(0, p));
  return curva === 'lenta' ? -(Math.cos(Math.PI * x) - 1) / 2 : 1 - Math.pow(1 - x, 3);
};

// frases: palavras seguidas, quebrando em pausa > 0,3 s ou pontuação; frase curta demais junta com a próxima
type Frase = {t0: number; t1: number};
const FRASES: Frase[] = (() => {
  const out: Frase[] = [];
  const ws = (DATA.palavras ?? []) as {t0: number; t1: number; w: string}[];
  let cur: Frase | null = null;
  ws.forEach((w, i) => {
    cur = cur ? {t0: cur.t0, t1: w.t1} : {t0: w.t0, t1: w.t1};
    const prox = ws[i + 1];
    if (!prox || prox.t0 - w.t1 > 0.3 || /[.!?]$/.test(w.w) || (/,$/.test(w.w) && cur.t1 - cur.t0 > 2.5)) {
      if (cur.t1 - cur.t0 >= 1.2 || !out.length) out.push(cur);
      else out[out.length - 1].t1 = cur.t1;
      cur = null;
    }
  });
  return out;
})();

const CORTES: number[] = (DATA.cortes ?? []).map((c: any) => c.t0).filter((t: number) => t > 0.3);

const valorEm = (chaves: Chave[], t: number): number => {
  let a: (Chave & {de: number}) | null = null;
  for (const k of chaves) {
    if (k.t > t) break;
    const de = a ? (a.dur <= 0 ? a.z : a.de + (a.z - a.de) * ease((k.t - a.t) / a.dur, a.curva)) : BASE;
    a = {...k, de};
  }
  if (!a) return BASE;
  return a.dur <= 0 ? a.z : a.de + (a.z - a.de) * ease((t - a.t) / a.dur, a.curva);
};

const montar = (): Chave[] => {
  let ch: Chave[] = [];
  const ordenar = () => ch.sort((x, y) => x.t - y.t);
  if (MOVIMENTO === 'suave' || MOVIMENTO === 'misto') {
    // aproxima devagar numa frase, volta suave no começo da seguinte; frase longa ganha uma deriva leve
    FRASES.forEach((fr, i) => {
      const dur = fr.t1 - fr.t0;
      if (i % 2 === 0) {
        ch.push({t: fr.t0, z: i % 4 === 0 ? PERTO : MUITO, dur: Math.min(Math.max(dur, 1.5), 4), curva: 'lenta'});
      } else {
        ch.push({t: fr.t0, z: BASE, dur: Math.min(0.9, Math.max(0.5, dur / 3)), curva: 'lenta'});
        if (dur > 3.5) ch.push({t: fr.t0 + 1.2, z: BASE + (PERTO - BASE) * 0.5, dur: dur - 1.2, curva: 'lenta'});
      }
    });
  }
  if (MOVIMENTO === 'seco' || MOVIMENTO === 'misto') {
    // pulo seco: de preferência num corte de verdade; no seco puro também no começo de frase
    const fortes = new Set([...CORTES, ...FRASES.map((x) => x.t0)].map((x) => x.toFixed(3)));
    const palavras = ((DATA.palavras ?? []) as {t0: number}[]).map((w) => w.t0);
    const cand = MOVIMENTO === 'misto' ? CORTES : [...new Set([...fortes].map(Number).concat(palavras))].sort((a, b) => a - b);
    const minimo = MOVIMENTO === 'misto' ? Math.max(3.5, INTERVALO_SECO * 1.5) : INTERVALO_SECO;
    let ultimo = 0;
    for (const t of cand) {
      if (t < 0.5 || t - ultimo < (fortes.has(t.toFixed(3)) ? minimo : MAX_PARADO)) continue;
      // no misto, não pula em cima de um movimento suave que está começando
      if (MOVIMENTO === 'misto' && ch.some((k) => Math.abs(k.t - t) < 0.6)) continue;
      const agora = valorEm(ch, t - 0.01);
      const alvo = agora > BASE + 0.025 ? BASE : PERTO;
      ch.push({t, z: alvo, dur: 0, curva: 'rapida'});
      ordenar();
      // no misto, depois do pulo, a câmera segue o movimento suave a partir do novo valor
      ultimo = t;
    }
  }
  // aproximar: chega rápido e suave perto do rosto e volta; tira o que estava no meio
  for (const x of R.aproximar ?? []) {
    const b = tempo(x);
    const volta = valorEm(ch, b - 0.3);
    ch = ch.filter((k) => k.t < b - 0.3 || k.t > b + 1.4);
    ch.push({t: b - 0.25, z: MUITO, dur: 0.35, curva: 'rapida'}, {t: b + 0.7, z: volta, dur: 0.7, curva: 'lenta'});
  }
  ordenar();
  return ch;
};

const CHAVES: Chave[] = MOVIMENTO === 'nenhum' ? [] : montar();
const QUADROS: number[] = (() => {
  const n = Math.ceil((DATA.total + (PLANO.cauda ?? 0)) * FPS) + 2;
  return Array.from({length: n}, (_, i) => Math.min(TETO, valorEm(CHAVES, i / FPS)));
})();

export const zoomRosto = (fr: number): number => QUADROS[Math.max(0, Math.min(QUADROS.length - 1, fr))] ?? BASE;
