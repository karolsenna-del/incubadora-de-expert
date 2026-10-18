// Legenda atrás (estilo 19, plano.legenda.estilo_visual = "atras"): a palavra falada fica grande na parede, atrás da
// cabeça, e o cabelo cobre a base das letras. O fundo é o vídeo original; a máscara da pessoa (scripts/mascara_pessoa.py,
// um PNG por quadro em public/mascara/) só apaga o texto onde a pessoa está:
// saída = quadro + (texto - quadro) × alfa_texto × (1 - alfa_pessoa). Desenhado em canvas para a máscara do quadro
// estar carregada antes da foto (delayRender), sem halo e sem trocar o fundo.
// Animações (legenda.atras.animacao): palavra · sobe · letreiro · parede · pancada · duas (guia references/legenda-atras.md).
import React, {useLayoutEffect, useRef} from 'react';
import {continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import {DATA, FPS, H, W} from './contexto';
import {ATRAS, ATRAS_DADOS} from './legendas';

type Pal = {t0: number; t1: number; w: string};
const CAP = 0.859; // altura da maiúscula da Anton (1760/2048 do em): a base das letras é a linha de base do canvas
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeOutCubic = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
const easeOutBack = (x: number) => { const c = clamp01(x) - 1; return 1 + 2.70158 * c * c * c + 1.70158 * c * c; };

const trocas: Record<string, string> = Object.fromEntries(
  Object.entries({...(ATRAS_DADOS?.trocas ?? {}), ...(ATRAS?.trocas ?? {})}).map(([k, v]) => [k.toLowerCase(), String(v)]));
const limpa = (w: string) => w.replace(/[.,!?;:"“”…]/g, '').trim();
const PALAVRAS: Pal[] = ((DATA.palavras ?? []) as Pal[])
  .map((p) => ({...p, w: (trocas[limpa(p.w).toLowerCase()] ?? limpa(p.w)).toLocaleUpperCase('pt-BR')}))
  .filter((p) => p.w);

// frases para "sobe" e "parede": até max_palavras/max_letras, quebra em pontuação ou pausa
const BLOCOS: Pal[][] = (() => {
  const out: Pal[][] = [];
  let cur: Pal[] = [];
  const crus = (DATA.palavras ?? []) as Pal[];
  PALAVRAS.forEach((p, i) => {
    cur.push(p);
    const prox = PALAVRAS[i + 1];
    const letras = cur.map((x) => x.w).join(' ').length;
    if (!prox || cur.length >= (ATRAS?.max_palavras ?? 4) || letras >= (ATRAS?.max_letras ?? 18) || /[.,!?;:]$/.test(crus[i]?.w ?? '')
      || prox.t0 - p.t1 > 0.35) { out.push(cur); cur = []; }
  });
  return out;
})();

const N = ATRAS_DADOS?.quadros ?? 1;
const topoEm = (fr: number) => ATRAS?.y_cabeca ?? ATRAS_DADOS.topo[Math.max(0, Math.min(N - 1, fr))];
// o texto fica parado enquanto está na tela: mede pelo ponto mais alto que a cabeça chega nesse tempo, senão a
// cabeça sobe depois que a palavra apareceu e esconde ela inteira
const topoEntre = (t0: number, t1: number) => {
  let m = Infinity;
  for (let q = Math.round(t0 * FPS); q <= Math.round(t1 * FPS); q++) m = Math.min(m, topoEm(q));
  return m;
};
const centroEm = (fr: number) => ATRAS_DADOS.centro[Math.max(0, Math.min(N - 1, fr))];
const margem = () => ATRAS?.margem ?? (ATRAS_DADOS.margem ?? 0.05) * H;
const fonte = (px: number) => `${Math.round(px)}px "${ATRAS.fonte}"`;

// tamanho que cabe entre a margem do topo e a cabeça (o cabelo cobre "sobreposicao" da altura da letra) e na largura
const tamanhoPara = (ctx: CanvasRenderingContext2D, linhas: string[], topo: number, max: number, entrelinha = 0.95) => {
  const sob = ATRAS.sobreposicao;
  const n = linhas.length;
  // altura ocupada: maiúscula da linha de baixo + (n-1) entrelinhas; base da de baixo em topo + sob × maiúscula
  // +0,15 da maiúscula de folga em cima: acento (Á, Ç, Õ) e o pulo de entrada não saem pela borda
  const porAltura = (topo - margem()) / (CAP * (1 - sob + 0.15) + (n - 1) * entrelinha);
  ctx.font = fonte(100);
  const larg = Math.max(...linhas.map((l) => ctx.measureText(l).width / 100));
  const porLargura = (W * (ATRAS.largura ?? 0.9)) / Math.max(larg, 0.01);
  // a pessoa chegou perto e a cabeça ocupa o topo: a palavra não encolhe até sumir; fica no tamanho mínimo, no alto,
  // e a cabeça cobre o que cobrir (como uma parede de verdade)
  // (frase em duas linhas aceita letra menor antes de deixar a cabeça cobrir a linha de baixo)
  const minimo = Math.min(porLargura, (ATRAS.tamanho_min ?? max * 0.55) * (n > 1 ? 0.65 : 1));
  return Math.max(minimo, Math.min(max, porAltura, porLargura));
};
// linha de base da linha de baixo: o cabelo cobre "sobreposicao" da letra; nunca acima da margem (com folga de acento)
const baseDe = (topo: number, tam: number, linhas = 1) =>
  ATRAS.y ?? Math.max(topo + ATRAS.sobreposicao * CAP * tam, margem() + 1.15 * CAP * tam + (linhas - 1) * 0.95 * tam);

const escreve = (ctx: CanvasRenderingContext2D, txt: string, x: number, y: number, tam: number, contorno = false) => {
  ctx.font = fonte(tam);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  if (contorno) {
    ctx.lineWidth = Math.max(2, tam * 0.03);
    ctx.lineJoin = 'round';
    ctx.strokeStyle = ATRAS.cor;
    ctx.strokeText(txt, x, y);
  } else {
    ctx.fillStyle = ATRAS.cor;
    ctx.fillText(txt, x, y);
  }
};

// palavra da vez: da hora em que é dita até a próxima (ou até 0,5 s depois dela, se vier pausa)
const palavraEm = (t: number) => {
  let i = -1;
  for (let k = 0; k < PALAVRAS.length; k++) if (PALAVRAS[k].t0 <= t) i = k; else break;
  if (i < 0) return -1;
  const fim = Math.min(PALAVRAS[i + 1]?.t0 ?? Infinity, PALAVRAS[i].t1 + 0.5);
  return t < fim ? i : -1;
};
const blocoEm = (t: number) => {
  const i = BLOCOS.findIndex((b, k) => t >= b[0].t0 && t < Math.min(BLOCOS[k + 1]?.[0].t0 ?? Infinity, b[b.length - 1].t1 + 0.6));
  return i;
};

// letreiro: a frase inteira numa linha que corre da direita para a esquerda; a palavra falada passa pelo meio da tela
// na hora em que é dita (posição suavizada para a velocidade não dar tranco)
const letreiro = (ctx: CanvasRenderingContext2D, t: number, fr: number) => {
  if (!PALAVRAS.length) return false;
  const topo = topoEntre(t - 1, t + 1);
  const max = ATRAS.tamanho;
  ctx.font = fonte(100);
  const esp = ctx.measureText(' ').width / 100 + 0.25;
  const tam = Math.min(max, tamanhoPara(ctx, ['M'], topo, max));
  const larg = PALAVRAS.map((p) => (ctx.measureText(p.w).width / 100) * tam);
  const centros: number[] = [];
  let x = 0;
  larg.forEach((l) => { centros.push(x + l / 2); x += l + esp * tam; });
  const ts = PALAVRAS.map((p) => p.t0);
  const vel = (centros[centros.length - 1] - centros[0]) / Math.max(0.5, ts[ts.length - 1] - ts[0]);
  const pos = (q: number) => {
    if (q <= ts[0]) return centros[0] + (q - ts[0]) * vel;
    if (q >= ts[ts.length - 1]) return centros[centros.length - 1] + (q - ts[ts.length - 1]) * vel;
    let k = 0;
    while (ts[k + 1] < q) k++;
    const d = ts[k + 1] - ts[k];
    return centros[k] + (d > 0 ? (q - ts[k]) / d : 1) * (centros[k + 1] - centros[k]);
  };
  let s = 0;
  for (let k = -6; k <= 6; k++) s += pos(t + k * 0.1);
  const desloc = W / 2 - s / 13;
  const y = baseDe(topo, tam);
  ctx.font = fonte(tam);
  ctx.textAlign = 'left';
  ctx.fillStyle = ATRAS.cor;
  PALAVRAS.forEach((p, k) => {
    const x0 = desloc + centros[k] - larg[k] / 2;
    if (x0 > W || x0 + larg[k] < 0) return;
    ctx.fillText(p.w, x0, y);
  });
  return true;
};

// parede de texto: faixas da frase da vez, alternando letra cheia e só contorno, cada uma andando para um lado
const parede = (ctx: CanvasRenderingContext2D, t: number) => {
  const bi = blocoEm(t);
  if (bi < 0) return false;
  const frase = BLOCOS[bi].map((p) => p.w).join(' ') + '  •  ';
  const tam = ATRAS.tamanho * 0.55;
  ctx.font = fonte(tam);
  const lf = ctx.measureText(frase).width;
  const passo = tam * 0.9;
  const vel = ATRAS.velocidade ?? 140;
  let linha = 0;
  for (let y = margem() + CAP * tam; y < H + tam; y += passo, linha++) {
    const dir = linha % 2 ? 1 : -1;
    let x = (((dir * vel * t + linha * lf * 0.37) % lf) + lf) % lf - lf;
    ctx.textAlign = 'left';
    for (; x < W; x += lf) {
      if (linha % 2) escreve(ctx, frase, x + lf / 2, y, tam, true);
      else escreve(ctx, frase, x + lf / 2, y, tam);
    }
  }
  return true;
};

const desenha = (ctx: CanvasRenderingContext2D, fr: number) => {
  const t = fr / FPS;
  const anim = ATRAS.animacao;
  if (anim === 'letreiro') return letreiro(ctx, t, fr);
  if (anim === 'parede') return parede(ctx, t);
  if (anim === 'sobe') {
    const bi = blocoEm(t);
    if (bi < 0) return false;
    const b = BLOCOS[bi];
    const topo = topoEntre(b[0].t0, Math.min(BLOCOS[bi + 1]?.[0].t0 ?? Infinity, b[b.length - 1].t1 + 0.6));
    // até 2 linhas: a quebra que deixa as linhas mais parecidas
    const ws = b.map((p) => p.w);
    ctx.font = fonte(100);
    let linhas = [ws.join(' ')];
    if (ws.length > 1 && ctx.measureText(linhas[0]).width / 100 > 3.2) {
      let melhor = Infinity;
      for (let k = 1; k < ws.length; k++) {
        const a = ws.slice(0, k).join(' '), c = ws.slice(k).join(' ');
        const m = Math.max(ctx.measureText(a).width, ctx.measureText(c).width);
        if (m < melhor) { melhor = m; linhas = [a, c]; }
      }
    }
    const tam = tamanhoPara(ctx, linhas, topo, ATRAS.tamanho * 0.85);
    const base = baseDe(topo, tam, linhas.length);
    // sobe de trás do ombro (começa escondida pelo corpo) e assenta; as duas linhas sobem juntas
    const k = easeOutCubic((t - b[0].t0 + 0.05) / (ATRAS.subida ?? 0.35));
    const dy = (1 - k) * (H * 0.82 - base);
    linhas.forEach((l, i) => escreve(ctx, l, W / 2, base + dy - (linhas.length - 1 - i) * tam * 0.95, tam));
    return true;
  }
  // palavra, duas e pancada: uma palavra por vez
  const i = palavraEm(t);
  if (i < 0) return false;
  const p = PALAVRAS[i];
  const f0 = Math.round(p.t0 * FPS);
  const topo = topoEntre(p.t0, Math.min(PALAVRAS[i + 1]?.t0 ?? Infinity, p.t1 + 0.5));
  const tam = tamanhoPara(ctx, [p.w], topo, ATRAS.tamanho);
  const base = baseDe(topo, tam);
  const d = t - p.t0;
  let esc = 1, dx = 0, dy = 0;
  if (anim === 'pancada') {
    // cai gigante (1,7×) e assenta com sobra; depois anda ao contrário da cabeça, como parede mais longe (paralaxe)
    const k = easeOutBack(d / 0.28);
    esc = 1.7 - 0.7 * k;
    dy = -(1 - clamp01(d / 0.2)) * H * 0.08;
    dx = -(centroEm(fr) - centroEm(f0)) * (ATRAS.paralaxe ?? 0.45);
  } else {
    esc = 1.25 - 0.25 * easeOutCubic(d / 0.22); // pulo do guia: começa 25% maior e assenta em 0,22 s
  }
  // o pulo e a pancada nunca estouram a borda da tela
  ctx.font = fonte(tam);
  esc = Math.min(esc, Math.max(1, (W * 0.98) / Math.max(1, ctx.measureText(p.w).width)));
  const cy = base - (CAP * tam) / 2;
  esc = Math.min(esc, Math.max(1, (2 * (cy + Math.min(0, dy))) / (CAP * tam * 1.15)));
  ctx.save();
  ctx.translate(W / 2 + dx, cy + dy);
  ctx.scale(esc, esc);
  escreve(ctx, p.w, 0, base - cy, tam);
  ctx.restore();
  return true;
};

const mascaraDe = (fr: number) => staticFile(`mascara/q_${String(Math.max(1, Math.min(N, fr + 1))).padStart(5, '0')}.png`);
const carregar = (src: string) => new Promise<HTMLImageElement>((ok, erro) => {
  const im = new Image();
  im.onload = () => ok(im);
  im.onerror = () => erro(new Error(`máscara não achada: ${src} (rode scripts/mascara_pessoa.py)`));
  im.src = src;
});

export const LegendaAtras: React.FC = () => {
  const fr = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const h = delayRender(`legenda atrás, quadro ${fr}`);
    let vivo = true;
    (async () => {
      await document.fonts.load(fonte(100));
      const ctx = cv.getContext('2d')!;
      // desenha fora da tela e só troca quando a máscara do quadro estiver pronta
      const off = document.createElement('canvas');
      off.width = W; off.height = H;
      const o = off.getContext('2d')!;
      const tem = desenha(o, fr);
      if (tem) {
        const m = await carregar(mascaraDe(fr));
        o.globalCompositeOperation = 'destination-in'; // fica só o texto que cai na parede
        o.imageSmoothingQuality = 'high';
        o.drawImage(m, 0, 0, W, H);
      }
      if (!vivo) return;
      ctx.clearRect(0, 0, W, H);
      if (tem) ctx.drawImage(off, 0, 0);
    })().catch((e) => console.error(e)).finally(() => continueRender(h));
    return () => { vivo = false; };
  }, [fr]);
  return <canvas ref={ref} width={W} height={H} style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: ATRAS.opacidade ?? 1}} />;
};
