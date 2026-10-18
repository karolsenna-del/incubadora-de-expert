// Cenas pensadas para o vídeo horizontal (16:9), no visual dos templates do squad de edição 3.0, escritas na casa
// (nenhum código dos pacotes pagos): fala no lado aberto, ideia com ícone (tela inteira), gráfico, prova, fluxo e jornada.
// Funcionam também no vertical, mas foram desenhadas para a área larga. pacote3 usa os pacotes originais do 3.0
// quando eles estão instalados nesta máquina (só no Mac do Euriler; ver references/horizontal.md).
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame} from 'remotion';
import {icons} from 'lucide-react';
import {DATA, FPS, FU, PLANO, T, f, useCena, useQuadro} from '../motor/contexto';
import {Fundo, src} from '../motor/pecas';
import {PACOTES3} from '../pacote3';

// ---------- peças ----------
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const mola = (fr: number, at: number, rapida = false) =>
  fr < at ? 0 : spring({frame: fr - at, fps: FPS, config: rapida ? {damping: 200, stiffness: 240, mass: 0.5} : {damping: 16, stiffness: 170}, durationInFrames: rapida ? 8 : undefined});
// b <= a acontece quando os `em` do plano vêm fora de ordem (item com beat antes do tempo padrão do anterior): o
// interpolate do Remotion derrubava o render inteiro ("inputRange must be strictly monotonically increasing")
export const suave = (fr: number, a: number, b: number) => interpolate(fr, [a, Math.max(b, a + 1)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
const respira = (fr: number, amp = 5, per = 2.8) => Math.sin(((fr / FPS) * Math.PI * 2) / per) * amp;
const num = (v: number, casas = 0) => v.toLocaleString('pt-BR', {minimumFractionDigits: casas, maximumFractionDigits: casas});
const CORES = () => [T.acento, T.acento2, T.alerta, T.ok, T.suave];
const limpa = (w: string) => w.replace(/[.,!?;:"“”()]/g, '').toLowerCase();
const ENFASE_PLANO: string[] = [...(PLANO.legenda?.enfase ?? [])].map(limpa);
// fundo claro (template spotlight): texto direto no fundo usa a "tinta" escura e a ênfase vira marcação amarela com letra escura
// (amarelo sobre claro não se lê); nos temas escuros nada muda
const CLARO = Boolean(T.tinta);
const TINTA: string = T.tinta ?? T.texto;
const ROTULO_FORA = CLARO ? T.tinta : T.acento;
const marca = (tam: number): React.CSSProperties => (CLARO ? {background: T.acento, color: T.tinta, borderRadius: Math.round(tam * 0.14), padding: `0 ${Math.round(tam * 0.12)}px`, textShadow: 'none'} : {});

// ícone por nome (lucide, em inglês: "book-open", "Rocket") ou apelido em português
const APELIDOS: Record<string, string> = {
  livro: 'BookOpen', dinheiro: 'DollarSign', raio: 'Zap', alvo: 'Target', foguete: 'Rocket', grafico: 'TrendingUp', crescimento: 'TrendingUp',
  pessoas: 'Users', pessoa: 'User', check: 'Check', certo: 'CircleCheck', cerebro: 'Brain', chave: 'Key', cadeado: 'Lock', relogio: 'Clock', tempo: 'Clock',
  calendario: 'Calendar', mensagem: 'MessageCircle', conversa: 'MessagesSquare', estrela: 'Star', coracao: 'Heart', ia: 'Sparkles', brilho: 'Sparkles',
  video: 'Video', camera: 'Camera', computador: 'Laptop', celular: 'Smartphone', ferramenta: 'Wrench', escudo: 'Shield', ideia: 'Lightbulb',
  lampada: 'Lightbulb', presente: 'Gift', trofeu: 'Trophy', sino: 'Bell', casa: 'House', mundo: 'Globe', pasta: 'Folder', link: 'Link',
  play: 'Play', seta: 'ArrowRight', email: 'Mail', carrinho: 'ShoppingCart', loja: 'Store', fogo: 'Flame', escola: 'GraduationCap', aula: 'GraduationCap',
  mapa: 'Map', bandeira: 'Flag', robo: 'Bot', codigo: 'Code', lista: 'ListChecks', filtro: 'Funnel', ciclo: 'RefreshCw', microfone: 'Mic',
  documento: 'FileText', senha: 'KeyRound', alerta: 'TriangleAlert', pergunta: 'CircleHelp', aperto: 'Handshake', moeda: 'Coins',
};
const pascal = (s: string) => s.replace(/(^|[-_ ])(\w)/g, (_, __, c) => c.toUpperCase());
export const Icone: React.FC<{nome?: string; tamanho?: number; cor?: string; traco?: number; cheio?: boolean}> = ({nome = 'sparkles', tamanho = 64, cor = T.texto, traco = 1.8, cheio}) => {
  const chave = APELIDOS[nome.toLowerCase()] ?? pascal(nome);
  const C = (icons as any)[chave];
  if (!C) console.warn(`ícone desconhecido: ${nome} (use um nome do lucide.dev ou um apelido de cenas/horizontal.tsx)`);
  const Comp = C ?? (icons as any).Sparkles;
  return <Comp size={tamanho} color={cor} strokeWidth={traco} fill={cheio ? cor : 'none'} />;
};

export const Rotulo: React.FC<{children: React.ReactNode; cor?: string; tamanho?: number; style?: React.CSSProperties}> = ({children, cor = T.acento, tamanho = 26, style}) => (
  <div style={{fontFamily: FU, fontWeight: 800, fontSize: tamanho, letterSpacing: '0.16em', textTransform: 'uppercase', color: cor, ...style}}>{children}</div>
);

// cartão de vidro sobre o fundo do tema
export const Vidro: React.FC<{style?: React.CSSProperties; children: React.ReactNode; brilho?: number}> = ({style, children, brilho = 0}) => (
  <div style={{position: 'relative', borderRadius: T.raio, background: CLARO ? T.superficie : `linear-gradient(160deg, ${T.superficie}F2, ${T.fundo}E6)`, border: `1px solid ${T.texto}1C`,
    boxShadow: `0 30px 70px rgba(0,0,0,0.5), inset 0 1px 0 ${T.texto}14${brilho ? `, 0 0 ${40 * brilho}px ${T.acento}${Math.round(60 * brilho).toString(16).padStart(2, '0')}` : ''}`, overflow: 'hidden', ...style}}>
    {children}
  </div>
);

// fundo da cena: no layout cheia a cena cobre a tela com o fundo do tema; no "lado" e no rosto fica transparente
const FundoSeCheia: React.FC<{forcar?: boolean}> = ({forcar}) => {
  const {cena} = useCena();
  return cena.layout === 'cheia' || cena.layout === 'dividida' || forcar ? <Fundo cor={T.acento} /> : null;
};

// item de lista que pode vir como texto ou objeto
type Item = string | {texto: string; rotulo?: string; icone?: string; valor?: string; em?: any; detalhe?: string};
const item = (x: Item) => (typeof x === 'string' ? {texto: x} : x);
// tempo de cada item: o "em" dele, ou em + i × passo
const temposItens = (q: (r: any, p?: number) => number, itens: Item[], em: any, passo: number) =>
  itens.map((x, i) => { const o = item(x); return o.em !== undefined ? q(o.em) : q(em, 0.3) + Math.round(i * passo * FPS); });

// ---------- fala: a fala palavra por palavra no lado aberto (o lado do vidro), ênfase amarela que brilha ----------
type P = {t0: number; t1: number; w: string};
export const Fala: React.FC<{enfase?: string[]; tamanho?: number; rotulo?: string; max_palavras?: number; alinhar?: 'esquerda' | 'centro'; cor?: string}> = ({enfase = [], tamanho = 76, rotulo, max_palavras = 14, alinhar = 'esquerda', cor}) => {
  const fr = useCurrentFrame();
  const {cena, area} = useCena();
  const agora = cena.t0 + fr / FPS;
  const ws = (DATA.palavras as P[]).filter((w) => w.t0 >= cena.t0 - 0.05 && w.t0 < cena.t1);
  // páginas: quebra em fim de frase depois de 6 palavras ou ao passar do máximo
  const pags: P[][] = [];
  let cur: P[] = [];
  ws.forEach((w) => {
    cur.push(w);
    if ((cur.length >= 6 && /[.!?]$/.test(w.w)) || cur.length >= max_palavras) { pags.push(cur); cur = []; }
  });
  if (cur.length) pags.push(cur);
  if (!pags.length) return null;
  let pi = 0;
  pags.forEach((p, i) => { if (p[0].t0 <= agora + 0.2) pi = i; });
  const pag = pags[pi];
  const enf = new Set([...enfase.map(limpa), ...ENFASE_PLANO]);
  const letras = pag.reduce((n, w) => n + w.w.length + 1, 0);
  const tam = Math.max(46, Math.round(tamanho * Math.min(1, Math.sqrt(110 / Math.max(letras, 1)))));
  const destaque = T.legenda_destaque;
  const brilho = 0.45 + 0.2 * Math.sin(((fr / FPS) * Math.PI * 2) / 2.2);
  return (
    <AbsoluteFill style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `0 ${Math.round(area.w * 0.08)}px`}}>
      <div style={{transform: `translateY(${respira(fr, 4)}px)`}}>
        {rotulo && <Rotulo cor={ROTULO_FORA} style={{marginBottom: 26, opacity: mola(fr, 0)}}>{rotulo}</Rotulo>}
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: alinhar === 'centro' ? 'center' : 'flex-start', alignItems: 'baseline', columnGap: Math.round(tam * 0.22), rowGap: Math.round(tam * 0.04), lineHeight: 1.04}}>
          {pag.map((w, i) => {
            const p = mola(fr, f(w.t0 - cena.t0) - 5, true);
            const e = enf.has(limpa(w.w));
            return (
              <span key={`${pi}-${i}`} style={{fontFamily: FU, fontWeight: 800, fontSize: tam, letterSpacing: '-0.02em', display: 'inline-block', color: e ? destaque : cor ?? TINTA,
                textShadow: e ? `0 0 ${Math.round(tam * 0.5)}px ${destaque}${Math.round(brilho * 255).toString(16).padStart(2, '0')}` : CLARO ? 'none' : '0 6px 20px rgba(0,0,0,0.35)', ...(e ? marca(tam) : {}),
                opacity: p, transform: `translateY(${(1 - p) * 10}px) scale(${0.72 + 0.28 * p})`}}>{w.w}</span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- ideia: um ícone por ideia + a frase em branco com ênfase amarela, palavras num ritmo fixo (o 16:9 limpo) ----------
export const Ideia: React.FC<{texto: string; icone?: string; enfase?: string[]; em?: any; rotulo?: string; cadencia?: number; tamanho?: number}> = ({texto, icone = 'lampada', enfase = [], em, rotulo, cadencia = 4, tamanho = 92}) => {
  const fr = useCurrentFrame();
  const q = useQuadro();
  const {area, cena} = useCena();
  const at = q(em, 0.1);
  const palavras = texto.split(/\s+/).filter(Boolean);
  const enf = new Set([...enfase.map(limpa), ...ENFASE_PLANO]);
  const largura = Math.min(area.w - 160, 1400);
  const tam = Math.max(54, Math.min(tamanho, Math.round((largura * 2.3) / Math.max(texto.length, 1) * 1.05)));
  const ic = mola(fr, at);
  const dur = f(cena.t1 - cena.t0);
  const zoom = 1 + 0.04 * clamp01(fr / Math.max(1, dur));
  return (
    <AbsoluteFill>
      <FundoSeCheia />
      <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 46, transform: `scale(${zoom})`}}>
        <div style={{width: 172, height: 172, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: CLARO ? T.superficie : `${T.texto}0F`,
          border: `1.5px solid ${T.texto}2E`, boxShadow: `0 0 0 14px ${T.texto}08, 0 24px 60px rgba(0,0,0,0.45)`, opacity: ic, transform: `scale(${0.6 + 0.4 * ic}) translateY(${respira(fr, 4, 3.2)}px)`}}>
          <Icone nome={icone} tamanho={92} cor="#D9DEE7" traco={1.6} />
        </div>
        {rotulo && <Rotulo cor={ROTULO_FORA} style={{opacity: mola(fr, at + 6)}}>{rotulo}</Rotulo>}
        <div style={{maxWidth: largura, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: Math.round(tam * 0.24), rowGap: 6, lineHeight: 1.08}}>
          {palavras.map((w, i) => {
            const p = mola(fr, at + 8 + i * cadencia, true);
            const e = enf.has(limpa(w));
            return <span key={i} style={{fontFamily: FU, fontWeight: 800, fontSize: tam, letterSpacing: '-0.02em', color: e ? T.legenda_destaque : TINTA, opacity: p,
              transform: `translateY(${(1 - p) * 14}px)`, display: 'inline-block', textShadow: e ? `0 0 30px ${T.legenda_destaque}80` : undefined, ...(e ? marca(tam) : {})}}>{w}</span>;
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- gráfico: barras, ranking, linha, rosca e anéis, com os valores que a pessoa falou ----------
type Valor = {rotulo: string; valor: number; destaque?: boolean};
export const Grafico: React.FC<{grafico?: 'barras' | 'ranking' | 'linha' | 'rosca' | 'aneis'; titulo?: string; rotulo?: string; valores: Valor[]; prefixo?: string; sufixo?: string;
  casas?: number; em?: any; passo?: number; fonte?: string; numero?: {valor: number; rotulo?: string; prefixo?: string; sufixo?: string; casas?: number}}> = (p) => {
  const {grafico = 'barras', titulo, rotulo, valores, prefixo = '', sufixo = '', casas = 0, em, passo = 0.14, fonte, numero} = p;
  const fr = useCurrentFrame();
  const q = useQuadro();
  const {area} = useCena();
  const at = q(em, 0.15);
  const W = Math.min(area.w - 120, 1180), H = Math.min(area.h - 140, 780);
  const corpoH = H - (titulo || rotulo ? 190 : 80) - (fonte ? 40 : 0);
  const corpoW = W - 120;
  const max = Math.max(...valores.map((v) => v.valor), 1);
  const cores = CORES();
  const fmt = (v: number) => `${prefixo}${num(v, casas)}${sufixo}`;
  const ent = mola(fr, at - 6);
  const prog = (i: number, dur = 22) => suave(fr, at + Math.round(i * passo * FPS), at + Math.round(i * passo * FPS) + dur);
  let corpo: React.ReactNode = null;
  if (grafico === 'barras') {
    const n = valores.length, gap = Math.min(40, corpoW / n * 0.25), bw = (corpoW - gap * (n - 1)) / n;
    corpo = (
      <div style={{position: 'relative', width: corpoW, height: corpoH, display: 'flex', alignItems: 'flex-end', gap}}>
        {valores.map((v, i) => {
          const k = prog(i), h = (corpoH - 90) * (v.valor / max) * k, d = v.destaque;
          return (
            <div key={i} style={{width: bw, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
              <div style={{fontFamily: FU, fontWeight: 800, fontSize: 30, color: d ? T.acento : T.texto, opacity: k}}>{fmt(v.valor * k)}</div>
              <div style={{width: '100%', height: h, borderRadius: '14px 14px 4px 4px', background: d ? `linear-gradient(${T.acento}, ${T.acento}B0)` : `${T.texto}2A`,
                border: d ? 'none' : `1px solid ${T.texto}24`, boxShadow: d ? `0 0 34px ${T.acento}66` : undefined}} />
              <div style={{fontFamily: FU, fontWeight: 700, fontSize: 22, color: T.suave, textAlign: 'center', lineHeight: 1.1, height: 52}}>{v.rotulo}</div>
            </div>
          );
        })}
      </div>
    );
  } else if (grafico === 'ranking') {
    const lh = Math.min(120, corpoH / (valores.length * 1.3));
    corpo = (
      <div style={{width: corpoW, display: 'flex', flexDirection: 'column', gap: lh * 0.28}}>
        {valores.map((v, i) => {
          const k = prog(i), d = v.destaque;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, opacity: clamp01(k * 2)}}>
              <div style={{width: 250, fontFamily: FU, fontWeight: 700, fontSize: 26, color: d ? T.texto : T.suave, textAlign: 'right'}}>{v.rotulo}</div>
              <div style={{flex: 1, height: lh * 0.62, borderRadius: 999, background: `${T.texto}12`, overflow: 'hidden'}}>
                <div style={{width: `${(v.valor / max) * 100 * k}%`, height: '100%', borderRadius: 999, background: d ? T.acento : `${T.texto}55`, boxShadow: d ? `0 0 24px ${T.acento}77` : undefined}} />
              </div>
              <div style={{width: 150, fontFamily: FU, fontWeight: 800, fontSize: 28, color: d ? T.acento : T.texto}}>{fmt(v.valor * k)}</div>
            </div>
          );
        })}
      </div>
    );
  } else if (grafico === 'linha') {
    const n = valores.length, pad = 30;
    const xs = valores.map((_, i) => pad + (i * (corpoW - 2 * pad)) / Math.max(1, n - 1));
    const ys = valores.map((v) => pad + (corpoH - 80 - 2 * pad) * (1 - v.valor / max));
    const k = suave(fr, at, at + 40);
    const d = xs.map((x, i) => `${i ? 'L' : 'M'}${x},${ys[i]}`).join(' ');
    const compr = xs.reduce((s, x, i) => (i ? s + Math.hypot(x - xs[i - 1], ys[i] - ys[i - 1]) : 0), 0);
    corpo = (
      <svg width={corpoW} height={corpoH} style={{overflow: 'visible'}}>
        <defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={T.acento} stopOpacity="0.32" /><stop offset="1" stopColor={T.acento} stopOpacity="0" /></linearGradient></defs>
        {[0, 1, 2, 3].map((g) => <line key={g} x1={0} x2={corpoW} y1={pad + g * (corpoH - 80 - 2 * pad) / 3} y2={pad + g * (corpoH - 80 - 2 * pad) / 3} stroke={T.texto} strokeOpacity={0.08} />)}
        <path d={`${d} L${xs[n - 1]},${corpoH - 80} L${xs[0]},${corpoH - 80} Z`} fill="url(#area)" opacity={k} />
        <path d={d} fill="none" stroke={T.acento} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={compr} strokeDashoffset={compr * (1 - k)} style={{filter: `drop-shadow(0 0 10px ${T.acento}88)`}} />
        {valores.map((v, i) => {
          const pk = clamp01((k * (n - 1) - i + 0.6) * 2.5);
          return (
            <g key={i} opacity={pk}>
              <circle cx={xs[i]} cy={ys[i]} r={v.destaque || i === n - 1 ? 12 : 8} fill={T.fundo} stroke={T.acento} strokeWidth={5} />
              <text x={xs[i]} y={ys[i] - 26} textAnchor="middle" fill={v.destaque || i === n - 1 ? T.acento : T.texto} fontFamily={FU} fontWeight={800} fontSize={28}>{fmt(v.valor)}</text>
              <text x={xs[i]} y={corpoH - 34} textAnchor="middle" fill={T.suave} fontFamily={FU} fontWeight={700} fontSize={22}>{v.rotulo}</text>
            </g>
          );
        })}
      </svg>
    );
  } else if (grafico === 'rosca') {
    const total = valores.reduce((s, v) => s + v.valor, 0) || 1;
    const R = Math.min(corpoH, 520) / 2 - 20, cx = R + 20, cy = corpoH / 2, circ = 2 * Math.PI * R;
    let acum = 0;
    const centro = valores.find((v) => v.destaque) ?? valores[0];
    corpo = (
      <div style={{display: 'flex', alignItems: 'center', gap: 70, width: corpoW}}>
        <svg width={2 * R + 40} height={corpoH}>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={T.texto} strokeOpacity={0.08} strokeWidth={56} />
          {valores.map((v, i) => {
            const fr0 = acum / total; acum += v.valor;
            const k = prog(i, 24), frac = (v.valor / total) * k;
            return <circle key={i} cx={cx} cy={cy} r={R} fill="none" stroke={cores[i % cores.length]} strokeWidth={56} strokeDasharray={`${Math.max(0, frac * circ - 6)} ${circ}`}
              strokeDashoffset={-fr0 * circ} transform={`rotate(-90 ${cx} ${cy})`} style={{filter: v.destaque ? `drop-shadow(0 0 12px ${cores[i % cores.length]}99)` : undefined}} />;
          })}
          <text x={cx} y={cy + 6} textAnchor="middle" fill={T.texto} fontFamily={FU} fontWeight={800} fontSize={64}>{num(((centro.valor / total) * 100) * suave(fr, at, at + 30), 0)}%</text>
          <text x={cx} y={cy + 46} textAnchor="middle" fill={T.suave} fontFamily={FU} fontWeight={700} fontSize={22}>{centro.rotulo}</text>
        </svg>
        <div style={{display: 'flex', flexDirection: 'column', gap: 26}}>
          {valores.map((v, i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, opacity: clamp01(prog(i) * 2)}}>
              <span style={{width: 20, height: 20, borderRadius: 6, background: cores[i % cores.length]}} />
              <span style={{fontFamily: FU, fontWeight: 700, fontSize: 28, color: T.texto}}>{v.rotulo}</span>
              <span style={{fontFamily: FU, fontWeight: 800, fontSize: 28, color: cores[i % cores.length]}}>{fmt(v.valor)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    // anéis: valores de 0 a 100 (porcentagem), um anel por valor
    const R0 = Math.min(corpoH, 560) / 2 - 10, cx = R0 + 10, cy = corpoH / 2;
    corpo = (
      <div style={{display: 'flex', alignItems: 'center', gap: 70, width: corpoW}}>
        <svg width={2 * R0 + 20} height={corpoH}>
          {valores.slice(0, 4).map((v, i) => {
            const r = R0 - i * 58, c = 2 * Math.PI * r, k = prog(i, 30);
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.texto} strokeOpacity={0.08} strokeWidth={34} />
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={cores[i]} strokeWidth={34} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - (Math.min(100, v.valor) / 100) * k)}
                  transform={`rotate(-90 ${cx} ${cy})`} style={{filter: `drop-shadow(0 0 8px ${cores[i]}77)`}} />
              </g>
            );
          })}
        </svg>
        <div style={{display: 'flex', flexDirection: 'column', gap: 34}}>
          {valores.slice(0, 4).map((v, i) => (
            <div key={i} style={{opacity: clamp01(prog(i) * 2)}}>
              <div style={{fontFamily: FU, fontWeight: 800, fontSize: 44, color: cores[i]}}>{fmt(v.valor * prog(i, 30))}</div>
              <div style={{fontFamily: FU, fontWeight: 700, fontSize: 22, color: T.suave, letterSpacing: '0.08em', textTransform: 'uppercase'}}>{v.rotulo}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <FundoSeCheia />
      <Vidro style={{width: W, height: H, padding: '50px 60px', opacity: ent, transform: `translateY(${(1 - ent) * 40 + respira(fr, 4, 3.1)}px)`}}>
        {(titulo || rotulo) && (
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40}}>
            <div>
              {rotulo && <Rotulo>{rotulo}</Rotulo>}
              {titulo && <div style={{fontFamily: FU, fontWeight: 800, fontSize: 52, color: T.texto, letterSpacing: '-0.02em', marginTop: 8, lineHeight: 1.05}}>{titulo}</div>}
            </div>
            {numero && (
              <div style={{textAlign: 'right'}}>
                <div style={{fontFamily: FU, fontWeight: 800, fontSize: 64, color: T.acento, textShadow: `0 0 28px ${T.acento}66`}}>{numero.prefixo ?? ''}{num(numero.valor * suave(fr, at, at + 36), numero.casas ?? 0)}{numero.sufixo ?? ''}</div>
                {numero.rotulo && <Rotulo cor={T.suave} tamanho={18}>{numero.rotulo}</Rotulo>}
              </div>
            )}
          </div>
        )}
        {corpo}
        {fonte && <div style={{position: 'absolute', left: 60, bottom: 26, fontFamily: FU, fontSize: 20, color: T.suave}}>Fonte: {fonte}</div>}
      </Vidro>
    </AbsoluteFill>
  );
};

// ---------- prova: depoimento, marco (número grande), notificações e antes × depois (sempre com dado real) ----------
export const Prova: React.FC<{prova?: 'depoimento' | 'marco' | 'notificacoes' | 'antes_depois'; texto?: string; nome?: string; papel?: string; foto?: string; estrelas?: number;
  valor?: number; prefixo?: string; sufixo?: string; casas?: number; rotulo?: string; titulo?: string; itens?: Item[]; antes?: {rotulo: string; valor: string}; depois?: {rotulo: string; valor: string};
  em?: any; passo?: number}> = (p) => {
  const {prova = 'depoimento', em, passo = 0.5} = p;
  const fr = useCurrentFrame();
  const q = useQuadro();
  const {area} = useCena();
  const at = q(em, 0.15);
  const ent = mola(fr, at - 4);
  const W = Math.min(area.w - 140, 1100);
  let corpo: React.ReactNode;
  if (prova === 'marco') {
    const k = suave(fr, at, at + 42);
    const fim = fr >= at + 42 ? mola(fr, at + 42) : 0;
    corpo = (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: ent}}>
        {p.rotulo && <Rotulo tamanho={26} cor={ROTULO_FORA}>{p.rotulo}</Rotulo>}
        <div style={{fontFamily: FU, fontWeight: 800, fontSize: Math.min(230, area.w / 5.2), color: CLARO ? TINTA : T.acento, letterSpacing: '-0.03em', lineHeight: 1,
          textShadow: CLARO ? 'none' : `0 0 ${50 + 40 * fim}px ${T.acento}${fim ? '99' : '66'}`, transform: `scale(${1 + 0.05 * fim * (1 - clamp01((fr - at - 42) / 12))})`}}>
          {p.prefixo ?? ''}{num((p.valor ?? 0) * k, p.casas ?? 0)}{p.sufixo ?? ''}
        </div>
        {p.titulo && <div style={{fontFamily: FU, fontWeight: 800, fontSize: 48, color: TINTA, opacity: mola(fr, at + 20), textAlign: 'center', maxWidth: W}}>{p.titulo}</div>}
      </div>
    );
  } else if (prova === 'notificacoes') {
    const itens = p.itens ?? [];
    const ts = temposItens(q, itens, em, passo);
    corpo = (
      <div style={{width: Math.min(W, 860), display: 'flex', flexDirection: 'column', gap: 22}}>
        {p.titulo && <Rotulo cor={ROTULO_FORA} style={{opacity: ent, marginBottom: 6}}>{p.titulo}</Rotulo>}
        {itens.map((x, i) => {
          const o = item(x), k = mola(fr, ts[i]), cor = CORES()[i % 3];
          return (
            <Vidro key={i} style={{height: 128, padding: '0 28px', display: 'flex', alignItems: 'center', gap: 22, opacity: k, transform: `translateX(${(1 - k) * -60}px)`}}>
              <div style={{width: 70, height: 70, borderRadius: 20, background: `${cor}1E`, border: `1px solid ${cor}66`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icone nome={o.icone ?? 'sino'} tamanho={34} cor={cor} /></div>
              <div style={{flex: 1}}>
                <div style={{fontFamily: FU, fontWeight: 800, fontSize: 30, color: T.texto}}>{o.texto}</div>
                {(o.detalhe ?? o.valor) && <div style={{fontFamily: FU, fontWeight: 800, fontSize: 24, color: cor, marginTop: 6}}>{o.detalhe ?? o.valor}</div>}
              </div>
              <Icone nome="badge-check" tamanho={32} cor={cor} />
            </Vidro>
          );
        })}
      </div>
    );
  } else if (prova === 'antes_depois') {
    const a = p.antes ?? {rotulo: 'Antes', valor: ''}, d = p.depois ?? {rotulo: 'Depois', valor: ''};
    const ka = mola(fr, at), seta = suave(fr, at + 10, at + 28), kd = mola(fr, at + 24);
    const Col: React.FC<{o: {rotulo: string; valor: string}; k: number; forte?: boolean}> = ({o, k, forte}) => (
      <Vidro brilho={forte ? k : 0} style={{flex: 1, padding: '44px 40px', opacity: k, transform: `translateY(${(1 - k) * 30}px)`, border: forte ? `1.5px solid ${T.acento}88` : undefined}}>
        <Rotulo cor={forte ? T.acento : T.suave}>{o.rotulo}</Rotulo>
        <div style={{fontFamily: FU, fontWeight: 800, fontSize: 72, color: forte ? T.texto : T.suave, marginTop: 16, letterSpacing: '-0.02em', lineHeight: 1.05}}>{o.valor}</div>
      </Vidro>
    );
    corpo = (
      <div style={{width: W, display: 'flex', alignItems: 'center', gap: 34}}>
        <Col o={a} k={ka} />
        <div style={{width: 90, opacity: seta, transform: `translateX(${(1 - seta) * -20}px)`}}><Icone nome="arrow-right" tamanho={80} cor={T.acento} traco={2.4} /></div>
        <Col o={d} k={kd} forte />
      </div>
    );
  } else {
    const palavras = (p.texto ?? '').split(/\s+/).filter(Boolean);
    const tam = Math.max(32, Math.min(50, Math.round(1500 / Math.max(palavras.length, 1) * 0.9)));
    const iniciais = (p.nome ?? '?').split(/\s+/).map((x) => x[0]).slice(0, 2).join('').toUpperCase();
    corpo = (
      <Vidro style={{width: W, padding: '56px 64px', opacity: ent, transform: `translateY(${(1 - ent) * 40 + respira(fr, 4, 3.1)}px)`}}>
        <div style={{fontFamily: 'Georgia, serif', fontSize: 150, lineHeight: 0.6, color: T.acento, height: 70}}>“</div>
        <div style={{fontFamily: FU, fontWeight: 700, fontSize: tam, lineHeight: 1.25, color: T.texto}}>
          {palavras.map((w, i) => <span key={i} style={{opacity: 0.15 + 0.85 * suave(fr, at + 4 + i * 2, at + 10 + i * 2)}}>{w} </span>)}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 38}}>
          <div style={{width: 76, height: 76, borderRadius: 99, overflow: 'hidden', background: `${T.acento}2A`, border: `2px solid ${T.acento}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FU, fontWeight: 800, fontSize: 28, color: T.acento}}>
            {p.foto ? <Img src={src(p.foto)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : iniciais}
          </div>
          <div>
            {p.nome && <div style={{fontFamily: FU, fontWeight: 800, fontSize: 30, color: T.texto}}>{p.nome}</div>}
            {p.papel && <div style={{fontFamily: FU, fontWeight: 600, fontSize: 22, color: T.suave, marginTop: 4}}>{p.papel}</div>}
          </div>
          {p.estrelas ? (
            <div style={{marginLeft: 'auto', display: 'flex', gap: 6}}>
              {Array.from({length: p.estrelas}).map((_, i) => { const k = mola(fr, at + 14 + i * 4); return <div key={i} style={{transform: `scale(${k})`}}><Icone nome="star" tamanho={38} cor={T.acento} cheio /></div>; })}
            </div>
          ) : null}
        </div>
      </Vidro>
    );
  }
  return (
    <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <FundoSeCheia />
      {corpo}
    </AbsoluteFill>
  );
};

// ---------- fluxo: passos ligados por seta, funil, checklist e ciclo ----------
export const Fluxo: React.FC<{fluxo?: 'passos' | 'funil' | 'checklist' | 'ciclo'; titulo?: string; rotulo?: string; itens: Item[]; em?: any; passo?: number}> = (p) => {
  const {fluxo = 'passos', titulo, rotulo, itens, em, passo = 0.6} = p;
  const fr = useCurrentFrame();
  const q = useQuadro();
  const {area} = useCena();
  const ts = temposItens(q, itens, em, passo);
  const ent = mola(fr, Math.min(...ts) - 8);
  const ativo = ts.reduce((a, t, i) => (fr >= t ? i : a), -1);
  const n = itens.length;
  const cab = (titulo || rotulo) ? (
    <div style={{textAlign: 'center', marginBottom: 50, opacity: ent}}>
      {rotulo && <Rotulo cor={ROTULO_FORA}>{rotulo}</Rotulo>}
      {titulo && <div style={{fontFamily: FU, fontWeight: 800, fontSize: 56, color: TINTA, letterSpacing: '-0.02em', marginTop: 8}}>{titulo}</div>}
    </div>
  ) : null;
  let corpo: React.ReactNode;
  if (fluxo === 'funil') {
    const W = Math.min(area.w - 200, 1000), hh = Math.min(118, (area.h - 360) / n);
    corpo = (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
        {itens.map((x, i) => {
          const o = item(x), k = mola(fr, ts[i]), w = W * (1 - (i * 0.5) / Math.max(1, n - 1) * 0.9), on = i === ativo;
          return (
            <div key={i} style={{width: w, height: hh, clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)', background: on ? `linear-gradient(90deg, ${T.acento}, ${T.acento}C0)` : CLARO ? T.superficie : `${T.texto}${i % 2 ? '1A' : '24'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, opacity: k, transform: `translateY(${(1 - k) * -26}px)`}}>
              <span style={{fontFamily: FU, fontWeight: 800, fontSize: Math.min(38, hh * 0.36), color: on ? '#16181D' : T.texto}}>{o.texto}</span>
              {o.valor && <span style={{fontFamily: FU, fontWeight: 800, fontSize: Math.min(34, hh * 0.32), color: on ? '#16181D' : T.acento}}>{o.valor}</span>}
            </div>
          );
        })}
      </div>
    );
  } else if (fluxo === 'checklist') {
    const W = Math.min(area.w - 200, 980);
    const feitos = ts.filter((t) => fr >= t + 6).length;
    corpo = (
      <Vidro style={{width: W, padding: '44px 54px', opacity: ent, transform: `translateY(${respira(fr, 4, 3.1)}px)`}}>
        <div style={{height: 10, borderRadius: 99, background: `${T.texto}14`, marginBottom: 34, overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${(feitos / n) * 100}%`, background: T.acento, boxShadow: `0 0 18px ${T.acento}`}} />
        </div>
        {itens.map((x, i) => {
          const o = item(x), k = mola(fr, ts[i]), ck = mola(fr, ts[i] + 6);
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, padding: '16px 0', borderTop: i ? `1px solid ${T.texto}12` : undefined, opacity: 0.35 + 0.65 * k}}>
              <div style={{width: 52, height: 52, borderRadius: 14, border: `2.5px solid ${ck > 0.1 ? T.acento : `${T.texto}44`}`, background: `${T.acento}${ck > 0.1 ? '22' : '00'}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{transform: `scale(${ck})`}}><Icone nome="check" tamanho={32} cor={T.acento} traco={3} /></div>
              </div>
              <div style={{fontFamily: FU, fontWeight: 800, fontSize: 38, color: T.texto}}>{o.texto}</div>
            </div>
          );
        })}
      </Vidro>
    );
  } else if (fluxo === 'ciclo') {
    const R = Math.min(area.h - 300, area.w - 500) / 2, cx = area.w / 2, cy = (area.h + (cab ? 80 : 0)) / 2;
    const rodada = suave(fr, ts[0], ts[n - 1] + 20);
    const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const pontoA = -Math.PI / 2 + rodada * 2 * Math.PI;
    corpo = (
      <AbsoluteFill>
        <svg width={area.w} height={area.h} style={{position: 'absolute', inset: 0}}>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={T.texto} strokeOpacity={0.1} strokeWidth={3} strokeDasharray="10 12" />
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={T.acento} strokeWidth={5} strokeDasharray={2 * Math.PI * R} strokeDashoffset={2 * Math.PI * R * (1 - rodada)} transform={`rotate(-90 ${cx} ${cy})`} style={{filter: `drop-shadow(0 0 8px ${T.acento})`}} />
          <circle cx={cx + R * Math.cos(pontoA)} cy={cy + R * Math.sin(pontoA)} r={12} fill={T.acento} style={{filter: `drop-shadow(0 0 14px ${T.acento})`}} />
        </svg>
        {itens.map((x, i) => {
          const o = item(x), k = mola(fr, ts[i]), on = i === ativo;
          return (
            <div key={i} style={{position: 'absolute', left: cx + R * Math.cos(ang(i)), top: cy + R * Math.sin(ang(i)), transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * k})`, opacity: k}}>
              <Vidro brilho={on ? 1 : 0} style={{padding: '18px 28px', display: 'flex', alignItems: 'center', gap: 14, border: on ? `1.5px solid ${T.acento}` : undefined}}>
                {o.icone && <Icone nome={o.icone} tamanho={34} cor={on ? T.acento : T.texto} />}
                <span style={{fontFamily: FU, fontWeight: 800, fontSize: 32, color: T.texto, whiteSpace: 'nowrap'}}>{o.texto}</span>
              </Vidro>
            </div>
          );
        })}
      </AbsoluteFill>
    );
  } else {
    // passos: lado a lado se couber, senão um embaixo do outro
    const deitado = area.w >= 1300 || n <= 3;
    const cw = deitado ? Math.min(460, (area.w - 160 - (n - 1) * 70) / n) : Math.min(area.w - 200, 820);
    corpo = (
      <div style={{display: 'flex', flexDirection: deitado ? 'row' : 'column', alignItems: 'center', gap: 0}}>
        {itens.map((x, i) => {
          const o = item(x), k = mola(fr, ts[i]), on = i === ativo, liga = i < n - 1 ? suave(fr, ts[i] + 4, ts[i + 1] ?? ts[i] + 14) : 0;
          return (
            <React.Fragment key={i}>
              <Vidro brilho={on ? 0.8 : 0} style={{width: cw, padding: deitado ? '34px 30px' : '24px 32px', opacity: CLARO ? k : 0.25 + 0.75 * k, transform: `translateY(${(1 - k) * 30}px) scale(${on ? 1.03 : 1})`,
                border: on ? `1.5px solid ${T.acento}AA` : undefined, display: 'flex', flexDirection: deitado ? 'column' : 'row', alignItems: deitado ? 'flex-start' : 'center', gap: 18}}>
                <div style={{width: 64, height: 64, borderRadius: 18, background: on ? T.acento : `${T.texto}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                  {o.icone ? <Icone nome={o.icone} tamanho={34} cor={on ? '#16181D' : T.texto} /> : <span style={{fontFamily: FU, fontWeight: 800, fontSize: 30, color: on ? '#16181D' : T.texto}}>{i + 1}</span>}
                </div>
                <div>
                  {o.rotulo && <Rotulo tamanho={18} cor={on ? T.acento : T.suave}>{o.rotulo}</Rotulo>}
                  <div style={{fontFamily: FU, fontWeight: 800, fontSize: deitado ? 36 : 38, color: T.texto, lineHeight: 1.12, marginTop: o.rotulo ? 8 : 0}}>{o.texto}</div>
                </div>
              </Vidro>
              {i < n - 1 && (
                <div style={{width: deitado ? 70 : 6, height: deitado ? 6 : 50, position: 'relative'}}>
                  <div style={{position: 'absolute', left: deitado ? 10 : 0, top: deitado ? 0 : 6, width: deitado ? `${(70 - 20) * liga}px` : 6, height: deitado ? 6 : `${38 * liga}px`, borderRadius: 9, background: T.acento, boxShadow: `0 0 12px ${T.acento}`}} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
  return (
    <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <FundoSeCheia />
      {fluxo !== 'ciclo' && cab}
      {fluxo === 'ciclo' && cab && <div style={{position: 'absolute', top: 60, width: '100%'}}>{cab}</div>}
      {corpo}
    </AbsoluteFill>
  );
};

// ---------- jornada: cartão de título com câmera que passeia de ponto em ponto e abre no fim (zoom e pan) ----------
export const Jornada: React.FC<{titulo?: string; subtitulo?: string; rotulo?: string; pontos: Item[]; em?: any; passo?: number; final?: any}> = (p) => {
  const {titulo, subtitulo, rotulo, pontos, em, passo = 1.2} = p;
  const fr = useCurrentFrame();
  const q = useQuadro();
  const {area, cena} = useCena();
  const dur = f(cena.t1 - cena.t0);
  const ts = temposItens(q, pontos, em, passo);
  const tFinal = p.final !== undefined ? q(p.final) : Math.min(dur - 30, ts[ts.length - 1] + 40);
  const n = pontos.length;
  // mundo: pontos em diagonal suave, cada um num cartão
  const CW = 520, CH = 300, passoX = 640;
  const mundoW = (n - 1) * passoX + CW, mundoH = 760;
  const pos = (i: number) => ({x: i * passoX, y: 300 + (i % 2 ? 120 : -40)});
  // câmera: segue o ponto da vez com zoom 1,55; no final abre para mostrar tudo com o título
  const alvoZoom = 1.55, abre = Math.min((area.w - 120) / mundoW, (area.h - 260) / mundoH, 1);
  const centroDe = (i: number) => ({x: pos(i).x + CW / 2, y: pos(i).y + CH / 2});
  let cam = {...centroDe(0), z: alvoZoom};
  const chaves = ts.map((t, i) => ({t, ...centroDe(i), z: alvoZoom}));
  chaves.push({t: tFinal, x: mundoW / 2, y: mundoH / 2 + 30, z: abre});
  for (let i = 0; i < chaves.length; i++) {
    const a = chaves[i - 1] ?? chaves[0], b = chaves[i];
    if (fr >= b.t) cam = {x: b.x, y: b.y, z: b.z};
    else { const k = suave(fr, b.t - 18, b.t + 4); if (k > 0 && fr < b.t + 4) cam = {x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, z: a.z + (b.z - a.z) * k}; break; }
  }
  const tit = mola(fr, tFinal + 4);
  const linha = suave(fr, ts[0], tFinal);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <FundoSeCheia forcar />
      <div style={{position: 'absolute', left: area.w / 2, top: area.h / 2 + 40 * tit, width: mundoW, height: mundoH, transformOrigin: '0 0',
        transform: `scale(${cam.z}) translate(${-cam.x}px, ${-cam.y}px)`}}>
        <svg width={mundoW} height={mundoH} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <path d={pontos.map((_, i) => `${i ? 'L' : 'M'}${centroDe(i).x},${centroDe(i).y}`).join(' ')} fill="none" stroke={T.texto} strokeOpacity={0.18} strokeWidth={4} strokeDasharray="14 14" />
          <path d={pontos.map((_, i) => `${i ? 'L' : 'M'}${centroDe(i).x},${centroDe(i).y}`).join(' ')} fill="none" stroke={T.acento} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - linha} style={{filter: `drop-shadow(0 0 8px ${T.acento})`}} />
        </svg>
        {pontos.map((x, i) => {
          const o = item(x), k = mola(fr, ts[i] - 10), on = fr >= ts[i] && (i === n - 1 || fr < ts[i + 1]) && fr < tFinal;
          return (
            <div key={i} style={{position: 'absolute', left: pos(i).x, top: pos(i).y, width: CW, height: CH, opacity: 0.55 + 0.45 * k, transform: `scale(${0.92 + 0.08 * k})`}}>
              <Vidro brilho={on ? 1 : 0} style={{width: '100%', height: '100%', padding: '34px 38px', border: on ? `2px solid ${T.acento}` : undefined}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                  <div style={{width: 58, height: 58, borderRadius: 16, background: on ? T.acento : `${T.texto}14`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {o.icone ? <Icone nome={o.icone} tamanho={32} cor={on ? '#16181D' : T.texto} /> : <span style={{fontFamily: FU, fontWeight: 800, fontSize: 28, color: on ? '#16181D' : T.texto}}>{i + 1}</span>}
                  </div>
                  <Rotulo tamanho={20} cor={on ? T.acento : T.suave}>{o.rotulo ?? `Ponto ${i + 1}`}</Rotulo>
                </div>
                <div style={{fontFamily: FU, fontWeight: 800, fontSize: 44, color: T.texto, lineHeight: 1.1, marginTop: 26, letterSpacing: '-0.01em'}}>{o.texto}</div>
              </Vidro>
            </div>
          );
        })}
      </div>
      {(titulo || rotulo) && (
        <div style={{position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', opacity: tit, transform: `translateY(${(1 - tit) * -30}px)`}}>
          {rotulo && <Rotulo cor={ROTULO_FORA}>{rotulo}</Rotulo>}
          {titulo && <div style={{fontFamily: FU, fontWeight: 800, fontSize: 64, color: TINTA, letterSpacing: '-0.02em', marginTop: 6}}>{titulo}</div>}
          {subtitulo && <div style={{fontFamily: FU, fontWeight: 600, fontSize: 28, color: T.suave, marginTop: 6}}>{subtitulo}</div>}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- escolha: opções lado a lado; na hora da decisão as erradas apagam com X e risco, a certa acende em amarelo com ✓ ----------
export const Escolha: React.FC<{itens: {texto: string; icone?: string; certo?: boolean; detalhe?: string; em?: any}[]; decide?: any; rotulo?: string; titulo?: string; em?: any; passo?: number}> = (p) => {
  const {itens, rotulo, titulo, em, passo = 0.35} = p;
  const fr = useCurrentFrame();
  const q = useQuadro();
  const {area} = useCena();
  const ts = temposItens(q, itens, em, passo);
  const dec = p.decide !== undefined ? q(p.decide) : ts[ts.length - 1] + 18;
  const k = mola(fr, dec);
  const n = itens.length;
  const cw = Math.min(330, (area.w - 140 - (n - 1) * 30) / n);
  return (
    <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 34}}>
      <FundoSeCheia />
      {(titulo || rotulo) && (
        <div style={{textAlign: 'center', opacity: mola(fr, ts[0] - 6)}}>
          {rotulo && <Rotulo cor={ROTULO_FORA}>{rotulo}</Rotulo>}
          {titulo && <div style={{fontFamily: FU, fontWeight: 800, fontSize: 50, color: TINTA, marginTop: 6}}>{titulo}</div>}
        </div>
      )}
      <div style={{display: 'flex', gap: 30}}>
        {itens.map((o, i) => {
          const e = mola(fr, ts[i]);
          const certo = Boolean(o.certo);
          const amarelo = certo ? k : 0;
          return (
            <div key={i} style={{position: 'relative', opacity: e * (certo ? 1 : 1 - 0.45 * k), transform: `translateY(${(1 - e) * 30}px) scale(${certo ? 1 + 0.06 * k : 1 - 0.04 * k})`}}>
              <div style={{width: cw, height: cw * 0.95, borderRadius: T.raio, background: certo && k > 0.01 ? `linear-gradient(${T.acento}, ${T.acento2 ?? T.acento})` : T.superficie,
                boxShadow: `0 24px 50px rgba(0,0,0,0.3)${amarelo ? `, 0 0 ${50 * amarelo}px ${T.acento}88` : ''}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: 24}}>
                <Icone nome={o.icone ?? (certo ? 'certo' : 'alerta')} tamanho={Math.round(cw * 0.3)} cor={certo && k > 0.5 ? '#1A1C21' : T.texto} traco={2} />
                <div style={{fontFamily: FU, fontWeight: 800, fontSize: Math.round(cw * 0.1), textAlign: 'center', lineHeight: 1.15, color: certo && k > 0.5 ? '#1A1C21' : T.texto,
                  textDecoration: !certo && k > 0.3 ? 'line-through' : undefined, textDecorationColor: T.alerta, textDecorationThickness: 4}}>{o.texto}</div>
                {o.detalhe && <div style={{fontFamily: FU, fontWeight: 600, fontSize: Math.round(cw * 0.065), color: certo && k > 0.5 ? '#1A1C21' : T.suave, textAlign: 'center'}}>{o.detalhe}</div>}
              </div>
              {k > 0.01 && (
                <div style={{position: 'absolute', top: -18, right: -18, width: 56, height: 56, borderRadius: 99, background: certo ? '#1A1C21' : T.alerta, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transform: `scale(${k})`, boxShadow: '0 8px 20px rgba(0,0,0,0.3)'}}>
                  <Icone nome={certo ? 'check' : 'x'} tamanho={32} cor={certo ? T.acento : '#FFFFFF'} traco={3.2} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- pacote3: os pacotes horizontais originais do squad 3.0, quando instalados nesta máquina ----------
// O novo_projeto.py copia os pacotes de ~/content-engine para src/pacote3/ (fora da skill e do Git); a skill não leva
// código dos pacotes pagos. Só entram os que aceitam texto próprio: fluxos (workflowsystemspack) e cartões de título
// com zoom (zoompanpack). Os de gráfico e prova social têm números de exemplo fixos em inglês: use Grafico e Prova.
const CAMPO3: Record<string, string> = {workflowsystemspack: 'workflowSystem', zoompanpack: 'zoomPanTitle'};
export const Pacote3: React.FC<{pacote: string; tipo: string; lado?: 'left' | 'right'; [k: string]: any}> = ({pacote, tipo, lado = 'left', ...resto}) => {
  const {cena} = useCena();
  const mod = PACOTES3[pacote];
  if (!mod) throw new Error(`pacote3 "${pacote}" não está instalado nesta máquina (só existe onde o squad de edição 3.0 está: ~/content-engine). Use as cenas próprias grafico, prova, fluxo, ideia e jornada.`);
  const {sem_legenda, legenda_y, escala, ...dados} = resto;
  const b = {[CAMPO3[pacote]]: {type: tipo, ...dados}};
  return <AbsoluteFill>{mod.render({b, start: 0, end: f(cena.t1 - cena.t0), f, scene: 'host', side: lado})}</AbsoluteFill>;
};
