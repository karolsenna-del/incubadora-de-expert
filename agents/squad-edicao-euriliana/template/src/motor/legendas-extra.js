// ARQUIVO GERADO: não edite. Fonte: arka1/packages/legendas-euriliana/src (monte com montar.mjs).
// Estilos 22 a 54 da Edição Euriliana (captioneer e remotion-captions-kit: MIT; HyperFrames: Apache-2.0; o 54, glow-emoji, é da casa).
/* eslint-disable */

// packages/legendas-euriliana/src/estilos/c/bounce-emoji.tsx
import { spring as spring2, useCurrentFrame as useCurrentFrame2, useVideoConfig as useVideoConfig2 } from "remotion";

// packages/legendas-euriliana/src/estilos/c/bounce.tsx
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

// packages/legendas-euriliana/src/base.ts
import { DATA, FPS as FPS_MOTOR, H as H_MOTOR, PLANO, VERTICAL, W as W_MOTOR } from "./contexto";
import { VERTICAL as VERTICAL2 } from "./contexto";
var PALAVRAS = DATA.palavras.map((p) => ({ w: p.w, t0: p.t0, t1: p.t1 }));
var FPS = FPS_MOTOR;
var W = W_MOTOR;
var H = H_MOTOR;
var Y_CENTRO = VERTICAL ? 1250 : 880;
var blocos = (ws = PALAVRAS, maxP = 4, maxL = 24) => {
  const out = [];
  let cur = [];
  ws.forEach((w, i) => {
    cur.push(w);
    const prox = ws[i + 1];
    const txt = cur.map((x) => x.w).join(" ");
    if (cur.length >= maxP || txt.length >= maxL || /[.,!?]$/.test(w.w) || !prox || prox.t0 - w.t1 > 0.35) {
      out.push(cur);
      cur = [];
    }
  });
  return out;
};
var limpa = (w) => w.replace(/[.,!?;:]/g, "");
var norm = (w) => limpa(w).toLowerCase();
var LIGACAO = /* @__PURE__ */ new Set(["para", "porque", "quando", "então", "muito", "sobre", "entre", "depois", "antes", "ainda", "também", "mesmo", "você", "vocês", "essa", "esse", "isso", "aqui", "onde", "como", "mais", "menos", "pelo", "pela", "sendo", "tinha", "temos", "estou", "está", "estão"]);
var LISTA = [...PLANO.legenda?.enfase ?? [], ...Object.keys(PLANO.legenda?.cores ?? {})].map(norm);
var ENFASE_DO_PLANO = new Set(LISTA);
var temEnfaseNoPlano = LISTA.length > 0;
var CHAVES_IDX = (() => {
  if (temEnfaseNoPlano) return new Set(PALAVRAS.map((p, i) => ENFASE_DO_PLANO.has(norm(p.w)) ? i : -1).filter((i) => i >= 0));
  const out = /* @__PURE__ */ new Set();
  let i02 = 0;
  for (const b of blocos()) {
    let melhor = -1;
    b.forEach((p, k) => {
      const w = norm(p.w);
      if (w.length >= 5 && !LIGACAO.has(w) && (melhor < 0 || w.length > norm(b[melhor].w).length)) melhor = k;
    });
    if (melhor >= 0) out.add(i02 + melhor);
    i02 += b.length;
  }
  return out;
})();
var ehChave = (i) => CHAVES_IDX.has(i);
var EMOJIS = {
  avançado: "🚀",
  programa: "💻",
  arcane: "🔮",
  completo: "✅",
  sair: "🚪",
  viver: "🔥",
  realidade: "✨",
  inteligência: "🧠",
  artificial: "🤖",
  dinheiro: "💰",
  venda: "💸",
  vendas: "💸",
  erro: "❌",
  segredo: "🤫",
  ia: "🤖",
  cliente: "🤝",
  clientes: "🤝",
  tempo: "⏰",
  resultado: "📈",
  resultados: "📈",
  marketing: "📣",
  ideia: "💡",
  medo: "😱",
  ...Object.fromEntries(Object.entries(PLANO.legenda?.emojis ?? {}).map(([k, v]) => [norm(k), v]))
};
var emojiDe = (w) => EMOJIS[norm(w)];
var TOTAL = DATA.total ?? (PALAVRAS.length ? PALAVRAS[PALAVRAS.length - 1].t1 + 1 : 0);
var SEGURA = 0.7;

// packages/legendas-euriliana/src/estilos/c/_comum.ts
var fromPalavras = (chunk = 5) => {
  const segments = [];
  for (let i = 0; i < PALAVRAS.length; i += chunk) {
    const words = PALAVRAS.slice(i, i + chunk).map((p) => ({ word: p.w.trim(), startMs: p.t0 * 1e3, endMs: p.t1 * 1e3, confidence: 1 }));
    segments.push({ text: words.map((w) => w.word).join(" "), startMs: words[0].startMs, endMs: words[words.length - 1].endMs, words });
  }
  return { segments, language: "pt", durationMs: segments.length ? segments[segments.length - 1].endMs : 0 };
};
var CAPTIONS = fromPalavras();
var getActiveSegment = (c2, ms) => c2.segments.find((s) => ms >= s.startMs && ms <= s.endMs) ?? null;
var getActiveWordIndex = (s, ms) => s.words.findIndex((w) => ms >= w.startMs && ms <= w.endMs);
var K = 1.25;
var fs = (n) => Math.round(n * K);
var fillStyle = {
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: H - 2 * Y_CENTRO,
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};
var rowStyle = (gap, alignItems = "center") => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems,
  gap,
  maxWidth: "80%",
  padding: "16px 24px"
});

// packages/legendas-euriliana/src/estilos/c/bounce.tsx
import { jsx } from "react/jsx-runtime";
var { fontFamily: inter } = loadFont("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
var BounceBase = ({
  captions = CAPTIONS,
  fontSize: fontSize10 = fs(58),
  fontColor: fontColor10 = "rgba(255,255,255,0.5)",
  bounceColor = "#FF0000",
  bounceHeight = fs(30),
  escala = 0.15
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = frame / fps * 1e3;
  const seg = getActiveSegment(captions, ms);
  if (!seg) return null;
  const a = getActiveWordIndex(seg, ms);
  return /* @__PURE__ */ jsx("div", { style: fillStyle, children: /* @__PURE__ */ jsx("div", { style: rowStyle(`${fs(8)}px ${fs(12)}px`, "baseline"), children: seg.words.map((w, i) => {
    const isActive = i === a, isPast = i < a;
    const b = isActive ? spring({ frame: (ms - w.startMs) / 1e3 * fps, fps, config: { damping: 8, stiffness: 300, mass: 0.5 } }) : 0;
    const y = isActive ? -bounceHeight * Math.sin(b * Math.PI) : 0;
    const s = isActive ? 1 + escala * Math.sin(b * Math.PI) : 1;
    return /* @__PURE__ */ jsx("span", { style: { fontFamily: inter, fontSize: fontSize10, fontWeight: 700, color: isActive ? bounceColor : isPast ? "white" : fontColor10, display: "inline-block", transform: `translateY(${y}px) scale(${s})`, textShadow: isActive ? `0 4px 15px ${bounceColor}60` : "0 2px 8px rgba(0,0,0,0.5)" }, children: w.word }, `${w.startMs}-${i}`);
  }) }) });
};

// packages/legendas-euriliana/src/estilos/c/bounce-emoji.tsx
import { Fragment, jsx as jsx2, jsxs } from "react/jsx-runtime";
var EMOJI_PT = {
  avançado: "🚀",
  programa: "💻",
  arcane: "🔮",
  completo: "✅",
  você: "👉",
  sair: "🚪",
  viver: "🔥",
  realidade: "✨",
  inteligência: "🧠",
  artificial: "🤖",
  dinheiro: "💰",
  venda: "💸",
  vendas: "💸",
  erro: "❌",
  segredo: "🤫"
};
var norm2 = (w) => w.toLowerCase().replace(/[^a-z0-9à-ÿ]/g, "");
var TAM = 150;
var Emojis = () => {
  const frame = useCurrentFrame2();
  const { fps } = useVideoConfig2();
  const ms = frame / fps * 1e3;
  const seg = getActiveSegment(CAPTIONS, ms);
  if (!seg) return null;
  const ditos = seg.words.filter((w) => EMOJI_PT[norm2(w.word)] && ms >= w.startMs).slice(-3);
  if (!ditos.length) return null;
  const largura = seg.text.length * fs(58) * 0.56;
  const linhas = Math.max(1, Math.ceil(largura / (0.8 * 1080 - 48)));
  const topoLegenda = Y_CENTRO - linhas * fs(58) * 1.25 / 2;
  return /* @__PURE__ */ jsx2("div", { style: { position: "absolute", left: 0, right: 0, top: topoLegenda - 24 - TAM * 1.15, height: TAM * 1.15, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 18 }, children: ditos.map((w) => {
    const local = (ms - w.startMs) / 1e3 * fps;
    const s = spring2({ frame: local, fps, config: { damping: 7, stiffness: 260, mass: 0.7 } });
    const giro = (1 - s) * -25;
    return /* @__PURE__ */ jsx2("div", { style: { fontSize: TAM, lineHeight: 1, transform: `scale(${0.2 + 1 * s}) rotate(${giro}deg)`, filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.45))" }, children: EMOJI_PT[norm2(w.word)] }, w.startMs);
  }) });
};
var CapBounceEmoji = () => /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx2(BounceBase, { bounceHeight: fs(12), escala: 0.07 }),
  /* @__PURE__ */ jsx2(Emojis, {})
] });

// packages/legendas-euriliana/src/estilos/c/typewriter.tsx
import { useCurrentFrame as useCurrentFrame3, useVideoConfig as useVideoConfig3 } from "remotion";
import { loadFont as loadFont2 } from "@remotion/google-fonts/JetBrainsMono";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var { fontFamily } = loadFont2("normal", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] });
var fontSize = fs(44);
var fontColor = "#FFFFFF";
var cursorColor = "#00FF88";
var CapTypewriter = () => {
  const frame = useCurrentFrame3();
  const { fps } = useVideoConfig3();
  const ms = frame / fps * 1e3;
  const seg = getActiveSegment(CAPTIONS, ms);
  if (!seg) return null;
  const prog3 = (ms - seg.startMs) / (seg.endMs - seg.startMs);
  const n = Math.ceil(prog3 * seg.words.length);
  const visible = seg.words.slice(0, n).map((w) => w.word).join(" ");
  const showCursor = Math.floor(frame / 15) % 2 === 0;
  return /* @__PURE__ */ jsx3("div", { style: fillStyle, children: /* @__PURE__ */ jsx3("div", { style: { maxWidth: "80%", padding: `${fs(16)}px ${fs(24)}px`, background: "rgba(0,0,0,0.6)", borderRadius: fs(12), border: `2px solid ${cursorColor}40` }, children: /* @__PURE__ */ jsxs2("span", { style: { fontFamily, fontSize, fontWeight: 500, color: fontColor, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }, children: [
    visible,
    showCursor && /* @__PURE__ */ jsx3("span", { style: { color: cursorColor, fontWeight: 400, marginLeft: 2 }, children: "|" })
  ] }) }) });
};

// packages/legendas-euriliana/src/estilos/c/wave.tsx
import { useCurrentFrame as useCurrentFrame4, useVideoConfig as useVideoConfig4 } from "remotion";
import { loadFont as loadFont3 } from "@remotion/google-fonts/Inter";
import { jsx as jsx4 } from "react/jsx-runtime";
var { fontFamily: fontFamily2 } = loadFont3("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
var fontSize2 = fs(56);
var fontColor2 = "rgba(255,255,255,0.35)";
var waveColor = "#00D4FF";
var waveHeight = fs(25);
var waveDelay = 3;
var CapWave = () => {
  const frame = useCurrentFrame4();
  const { fps } = useVideoConfig4();
  const ms = frame / fps * 1e3;
  const seg = getActiveSegment(CAPTIONS, ms);
  if (!seg) return null;
  const a = getActiveWordIndex(seg, ms);
  return /* @__PURE__ */ jsx4("div", { style: fillStyle, children: /* @__PURE__ */ jsx4("div", { style: rowStyle(`${fs(8)}px ${fs(12)}px`, "baseline"), children: seg.words.map((w, i) => {
    const isActive = i === a, isPast = i < a;
    const d = i - a;
    const y = d >= 0 && d <= waveDelay ? -waveHeight * Math.sin(d / waveDelay * Math.PI) : isPast ? -5 : 0;
    return /* @__PURE__ */ jsx4("span", { style: { fontFamily: fontFamily2, fontSize: fontSize2, fontWeight: 700, color: isActive ? waveColor : isPast ? "white" : fontColor2, display: "inline-block", transform: `translateY(${y}px)`, textShadow: isActive ? `0 0 15px ${waveColor}60` : "0 2px 8px rgba(0,0,0,0.5)" }, children: w.word }, `${w.startMs}-${i}`);
  }) }) });
};

// packages/legendas-euriliana/src/estilos/c/glow.tsx
import { useCurrentFrame as useCurrentFrame5, useVideoConfig as useVideoConfig5 } from "remotion";
import { loadFont as loadFont4 } from "@remotion/google-fonts/Inter";
import { PLANO as PLANO2 } from "./contexto";
import { jsx as jsx5 } from "react/jsx-runtime";
var { fontFamily: fontFamily3 } = loadFont4("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
var fontSize3 = fs(56);
var fontColor3 = "rgba(255,255,255,0.25)";
var glowColor = PLANO2.legenda?.cor_destaque ?? "#00FFFF";
var glowIntensity = fs(30);
var CapGlow = () => {
  const frame = useCurrentFrame5();
  const { fps } = useVideoConfig5();
  const ms = frame / fps * 1e3;
  const seg = getActiveSegment(CAPTIONS, ms);
  if (!seg) return null;
  const a = getActiveWordIndex(seg, ms);
  const pulse = Math.sin(frame * 0.15) * 0.3 + 0.7;
  return /* @__PURE__ */ jsx5("div", { style: fillStyle, children: /* @__PURE__ */ jsx5("div", { style: rowStyle(`${fs(8)}px ${fs(14)}px`), children: seg.words.map((w, i) => {
    const isActive = i === a, isPast = i < a;
    const g = isActive ? glowIntensity * pulse : 0;
    return /* @__PURE__ */ jsx5("span", { style: { fontFamily: fontFamily3, fontSize: fontSize3, fontWeight: 700, color: isActive ? "#fff" : isPast ? "white" : fontColor3, display: "inline-block", textShadow: isActive ? `0 0 ${g}px ${glowColor}, 0 0 ${g * 2}px ${glowColor}80, 0 0 ${g * 3}px ${glowColor}40` : "0 2px 8px rgba(0,0,0,0.5)", filter: isActive ? `brightness(${1 + pulse * 0.3})` : "none" }, children: w.word }, `${w.startMs}-${i}`);
  }) }) });
};

// packages/legendas-euriliana/src/estilos/c/typewriter-erase.tsx
import { useCurrentFrame as useCurrentFrame6, useVideoConfig as useVideoConfig6 } from "remotion";
import { loadFont as loadFont5 } from "@remotion/google-fonts/JetBrainsMono";
import { jsx as jsx6, jsxs as jsxs3 } from "react/jsx-runtime";
var { fontFamily: fontFamily4 } = loadFont5("normal", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] });
var fontSize4 = fs(42);
var fontColor4 = "#FFFFFF";
var cursorColor2 = "#00FF88";
var eraseColor = "#FF4444";
var CapTypewriterErase = () => {
  const frame = useCurrentFrame6();
  const { fps } = useVideoConfig6();
  const ms = frame / fps * 1e3;
  const seg = getActiveSegment(CAPTIONS, ms);
  if (!seg) return null;
  const prog3 = (ms - seg.startMs) / (seg.endMs - seg.startMs);
  const typeEnd = 0.6, eraseStart = 0.7;
  let words;
  let erasing = false;
  if (prog3 < typeEnd) words = seg.words.slice(0, Math.ceil(prog3 / typeEnd * seg.words.length)).map((w) => w.word);
  else if (prog3 < eraseStart) words = seg.words.map((w) => w.word);
  else {
    erasing = true;
    const ep = (prog3 - eraseStart) / (1 - eraseStart);
    words = seg.words.slice(0, Math.floor((1 - ep) * seg.words.length)).map((w) => w.word);
  }
  const showCursor = Math.floor(frame / 15) % 2 === 0;
  return /* @__PURE__ */ jsx6("div", { style: fillStyle, children: /* @__PURE__ */ jsx6("div", { style: { maxWidth: "80%", padding: `${fs(16)}px ${fs(24)}px`, background: "rgba(0,0,0,0.6)", borderRadius: fs(12), border: `2px solid ${erasing ? eraseColor + "40" : cursorColor2 + "40"}` }, children: /* @__PURE__ */ jsxs3("span", { style: { fontFamily: fontFamily4, fontSize: fontSize4, fontWeight: 500, color: erasing ? eraseColor : fontColor4, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }, children: [
    words.join(" "),
    showCursor && /* @__PURE__ */ jsx6("span", { style: { color: erasing ? eraseColor : cursorColor2, fontWeight: 400, marginLeft: 2 }, children: "|" })
  ] }) }) });
};

// packages/legendas-euriliana/src/estilos/c/flicker.tsx
import { useCurrentFrame as useCurrentFrame7, useVideoConfig as useVideoConfig7 } from "remotion";
import { loadFont as loadFont6 } from "@remotion/google-fonts/Inter";
import { jsx as jsx7 } from "react/jsx-runtime";
var { fontFamily: fontFamily5 } = loadFont6("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
var fontSize5 = fs(56);
var fontColor5 = "rgba(255,255,255,0.2)";
var flickerColor = "#FF9500";
var CapFlicker = () => {
  const frame = useCurrentFrame7();
  const { fps } = useVideoConfig7();
  const ms = frame / fps * 1e3;
  const seg = getActiveSegment(CAPTIONS, ms);
  if (!seg) return null;
  const a = getActiveWordIndex(seg, ms);
  return /* @__PURE__ */ jsx7("div", { style: fillStyle, children: /* @__PURE__ */ jsx7("div", { style: rowStyle(`${fs(8)}px ${fs(12)}px`), children: seg.words.map((w, i) => {
    const isActive = i === a, isPast = i < a;
    let opacity = isPast ? 1 : isActive ? 0.4 : 0.25;
    if (isActive) opacity = [1, 0.2, 1, 1, 0.3, 1, 1, 0.2][frame % 8];
    return /* @__PURE__ */ jsx7("span", { style: { fontFamily: fontFamily5, fontSize: fontSize5, fontWeight: 700, color: isActive ? flickerColor : isPast ? "white" : fontColor5, display: "inline-block", opacity, textShadow: isActive ? `0 0 10px ${flickerColor}, 0 0 20px ${flickerColor}60` : isPast ? "0 2px 8px rgba(0,0,0,0.5)" : "none" }, children: w.word }, `${w.startMs}-${i}`);
  }) }) });
};

// packages/legendas-euriliana/src/estilos/c/highlighter.tsx
import { useCurrentFrame as useCurrentFrame8, useVideoConfig as useVideoConfig8 } from "remotion";
import { loadFont as loadFont7 } from "@remotion/google-fonts/Inter";
import { jsx as jsx8 } from "react/jsx-runtime";
var { fontFamily: fontFamily6 } = loadFont7("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
var fontSize6 = fs(52);
var fontColor6 = "rgba(255,255,255,0.4)";
var highlightColor = "#FFEB3B";
var highlightOpacity = 0.7;
var bg = `${highlightColor}${Math.round(highlightOpacity * 255).toString(16).padStart(2, "0")}`;
var CapHighlighter = () => {
  const frame = useCurrentFrame8();
  const { fps } = useVideoConfig8();
  const ms = frame / fps * 1e3;
  const seg = getActiveSegment(CAPTIONS, ms);
  if (!seg) return null;
  const a = getActiveWordIndex(seg, ms);
  return /* @__PURE__ */ jsx8("div", { style: fillStyle, children: /* @__PURE__ */ jsx8("div", { style: rowStyle(`${fs(8)}px ${fs(12)}px`), children: seg.words.map((w, i) => {
    const isActive = i === a, isPast = i < a;
    return /* @__PURE__ */ jsx8("span", { style: { fontFamily: fontFamily6, fontSize: fontSize6, fontWeight: 700, color: isActive ? "#000" : isPast ? "white" : fontColor6, display: "inline-block", backgroundColor: isActive ? bg : "transparent", padding: isActive ? `${fs(2)}px ${fs(8)}px` : 0, borderRadius: fs(4), transform: isActive ? "rotate(-1deg)" : "none", textShadow: isActive ? "none" : "0 2px 8px rgba(0,0,0,0.5)" }, children: w.word }, `${w.startMs}-${i}`);
  }) }) });
};

// packages/legendas-euriliana/src/estilos/c/blur.tsx
import { useCurrentFrame as useCurrentFrame9, useVideoConfig as useVideoConfig9 } from "remotion";
import { loadFont as loadFont8 } from "@remotion/google-fonts/Inter";
import { jsx as jsx9 } from "react/jsx-runtime";
var { fontFamily: fontFamily7 } = loadFont8("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
var fontSize7 = fs(56);
var fontColor7 = "rgba(255,255,255,0.4)";
var focusColor = "#FFFFFF";
var blurAmount = fs(8);
var CapBlur = () => {
  const frame = useCurrentFrame9();
  const { fps } = useVideoConfig9();
  const ms = frame / fps * 1e3;
  const seg = getActiveSegment(CAPTIONS, ms);
  if (!seg) return null;
  const a = getActiveWordIndex(seg, ms);
  return /* @__PURE__ */ jsx9("div", { style: fillStyle, children: /* @__PURE__ */ jsx9("div", { style: rowStyle(`${fs(8)}px ${fs(12)}px`), children: seg.words.map((w, i) => {
    const isActive = i === a, isPast = i < a;
    const blur = isActive || isPast ? 0 : blurAmount;
    const opacity = isActive ? 1 : isPast ? 0.9 : 0.3;
    return /* @__PURE__ */ jsx9("span", { style: { fontFamily: fontFamily7, fontSize: fontSize7, fontWeight: 700, color: isActive ? focusColor : isPast ? "white" : fontColor7, display: "inline-block", filter: `blur(${blur}px)`, opacity, textShadow: isActive ? "0 0 20px rgba(255,255,255,0.3)" : "0 2px 8px rgba(0,0,0,0.5)" }, children: w.word }, `${w.startMs}-${i}`);
  }) }) });
};

// packages/legendas-euriliana/src/estilos/c/rainbow.tsx
import { useCurrentFrame as useCurrentFrame10, useVideoConfig as useVideoConfig10 } from "remotion";
import { loadFont as loadFont9 } from "@remotion/google-fonts/Inter";
import { jsx as jsx10 } from "react/jsx-runtime";
var { fontFamily: fontFamily8 } = loadFont9("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
var fontSize8 = fs(60);
var fontColor8 = "rgba(255,255,255,0.3)";
var speed = 3;
var CapRainbow = () => {
  const frame = useCurrentFrame10();
  const { fps } = useVideoConfig10();
  const ms = frame / fps * 1e3;
  const seg = getActiveSegment(CAPTIONS, ms);
  if (!seg) return null;
  const a = getActiveWordIndex(seg, ms);
  return /* @__PURE__ */ jsx10("div", { style: fillStyle, children: /* @__PURE__ */ jsx10("div", { style: rowStyle(`${fs(8)}px ${fs(12)}px`), children: seg.words.map((w, i) => {
    const isActive = i === a, isPast = i < a;
    const hue = (frame * speed + i * 40) % 360;
    return /* @__PURE__ */ jsx10("span", { style: { fontFamily: fontFamily8, fontSize: fontSize8, fontWeight: 700, color: isActive ? `hsl(${hue}, 100%, 65%)` : isPast ? "white" : fontColor8, display: "inline-block", textShadow: isActive ? `0 0 15px hsla(${hue}, 100%, 65%, 0.376)` : "0 2px 8px rgba(0,0,0,0.5)" }, children: w.word }, `${w.startMs}-${i}`);
  }) }) });
};

// packages/legendas-euriliana/src/estilos/c/spotlight.tsx
import { useCurrentFrame as useCurrentFrame11, useVideoConfig as useVideoConfig11 } from "remotion";
import { loadFont as loadFont10 } from "@remotion/google-fonts/PlayfairDisplay";
import { jsx as jsx11 } from "react/jsx-runtime";
var { fontFamily: fontFamily9 } = loadFont10("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
var fontSize9 = fs(52);
var fontColor9 = "rgba(255,255,255,0.3)";
var c = "#D4AF37";
var CapSpotlight = () => {
  const frame = useCurrentFrame11();
  const { fps } = useVideoConfig11();
  const ms = frame / fps * 1e3;
  const seg = getActiveSegment(CAPTIONS, ms);
  if (!seg) return null;
  const a = getActiveWordIndex(seg, ms);
  return /* @__PURE__ */ jsx11("div", { style: fillStyle, children: /* @__PURE__ */ jsx11("div", { style: rowStyle(`${fs(8)}px ${fs(14)}px`), children: seg.words.map((w, i) => {
    const isActive = i === a, isPast = i < a;
    return /* @__PURE__ */ jsx11("span", { style: { fontFamily: fontFamily9, fontSize: fontSize9, fontWeight: 700, color: isActive ? "#000" : isPast ? "white" : fontColor9, display: "inline-block", backgroundColor: isActive ? c : "transparent", backgroundImage: isActive ? `radial-gradient(ellipse at center, ${c} 0%, ${c}CC 40%, ${c}40 70%, transparent 100%)` : "none", padding: isActive ? `${fs(4)}px ${fs(16)}px` : 0, borderRadius: isActive ? fs(8) : 0, textShadow: isActive ? "none" : "0 2px 8px rgba(0,0,0,0.5)", boxShadow: isActive ? `0 0 30px ${c}80, 0 0 60px ${c}40` : "none" }, children: w.word }, `${w.startMs}-${i}`);
  }) }) });
};

// packages/legendas-euriliana/src/estilos/a/clip-wipe.tsx
import { useCurrentFrame as useCurrentFrame12 } from "remotion";
import { loadFont as loadFont11 } from "@remotion/google-fonts/Poppins";

// packages/legendas-euriliana/src/estilos/a/_util.ts
import { useEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";
var clamp01 = (p) => Math.max(0, Math.min(1, p));
var linear = (p) => p;
var power2Out = (p) => 1 - (1 - p) * (1 - p);
var power2In = (p) => p * p;
var power3Out = (p) => 1 - Math.pow(1 - p, 3);
var expoOut = (p) => p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);
var sineInOut = (p) => -(Math.cos(Math.PI * p) - 1) / 2;
var backOut = (s = 1.70158) => (p) => {
  const q = p - 1;
  return q * q * ((s + 1) * q + s) + 1;
};
var prog = (t, at, dur, ease = linear) => {
  if (t <= at) return 0;
  if (dur <= 0 || t >= at + dur) return 1;
  return ease(clamp01((t - at) / dur));
};
var lerp = (a, b, p) => a + (b - a) * p;
var parse = (c2) => {
  if (c2.startsWith("#")) {
    let h = c2.slice(1);
    if (h.length === 3) h = h.split("").map((x) => x + x).join("");
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1];
  }
  const m = c2.match(/[\d.]+/g).map(Number);
  return [m[0], m[1], m[2], m[3] ?? 1];
};
var mixCor = (a, b, p) => {
  const x = parse(a);
  const y = parse(b);
  const r = x.map((v, i) => lerp(v, y[i], p));
  return `rgba(${Math.round(r[0])},${Math.round(r[1])},${Math.round(r[2])},${r[3].toFixed(3)})`;
};
var ctx = null;
var mede = (texto, fonte, letterSpacingEm = 0, tamanho = 0) => {
  if (!ctx) ctx = document.createElement("canvas").getContext("2d");
  ctx.font = fonte;
  return ctx.measureText(texto).width + letterSpacingEm * tamanho * texto.length;
};
var cabe = (texto, base2, peso, familia, maxW, estilo = "", ls = 0, minFrac = 0.45) => {
  let s = base2;
  const min = Math.floor(base2 * minFrac);
  while (s > min) {
    if (mede(texto, `${estilo} ${peso} ${s}px "${familia}"`, ls, s) <= maxW) return s;
    s -= 2;
  }
  return min;
};
var useFontes = (esperas) => {
  const [pronto, setPronto] = useState(false);
  const [h] = useState(() => delayRender("fontes do estilo"));
  useEffect(() => {
    Promise.all(esperas.map((f) => f())).then(() => document.fonts.ready).then(() => setPronto(true));
  }, []);
  useEffect(() => {
    if (pronto) continueRender(h);
  }, [pronto, h]);
  return pronto;
};

// packages/legendas-euriliana/src/estilos/a/clip-wipe.tsx
import { jsx as jsx12 } from "react/jsx-runtime";
var { fontFamily: fontFamily10, waitUntilDone } = loadFont11("normal", { weights: ["800"], subsets: ["latin", "latin-ext"] });
var BS = blocos();
var base = 0;
var GRUPOS = BS.map((b, gi) => {
  const ini = base;
  base += b.length;
  const prox = BS[gi + 1]?.[0].t0 ?? 1e9;
  return { ws: b, ini, start: b[0].t0, end: Math.min(b[b.length - 1].t1 + 0.5, prox - 0.05) };
});
var BASE = 88;
var MAXW = W - 120;
var ClipWipe = () => {
  const pronto = useFontes([waitUntilDone]);
  const t = useCurrentFrame12() / FPS;
  if (!pronto) return null;
  const g = GRUPOS.find((x) => t >= x.start && t < x.end);
  if (!g) return null;
  const maior = g.ws.map((w) => w.w.toUpperCase()).sort((a, b) => b.length - a.length)[0];
  const fs2 = cabe(maior, BASE, "800", fontFamily10, MAXW, "", 0.04);
  return /* @__PURE__ */ jsx12("div", { style: { position: "absolute", left: 0, width: W, bottom: H - (Y_CENTRO + fs2 / 2), display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "center", gap: 24, padding: "0 60px", boxSizing: "border-box" }, children: g.ws.map((w, i) => {
    const kw = CHAVES_IDX.has(g.ini + i);
    const pIn = prog(t, w.t0, 0.3, power2Out);
    const pOut = prog(t, g.end - 0.2 + i * 0.04, 0.25, power2In);
    let cor = "#ffffff";
    if (kw) cor = mixCor("#ffffff", "#FFD700", prog(t, w.t0 + 0.1, 0.05));
    cor = mixCor(cor, "rgba(255,255,255,0.4)", prog(t, w.t1, 0.2));
    const clip = `inset(0 ${(1 - pIn) * 100}% 0 ${pOut * 100}%)`;
    return /* @__PURE__ */ jsx12("span", { style: { fontFamily: fontFamily10, fontWeight: 800, fontSize: fs2, textTransform: "uppercase", color: cor, display: "inline-block", letterSpacing: "0.04em", lineHeight: 1, clipPath: clip, WebkitClipPath: clip }, children: w.w.toUpperCase() }, i);
  }) });
};

// packages/legendas-euriliana/src/estilos/a/editorial-emphasis.tsx
import { useCurrentFrame as useCurrentFrame13 } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { jsx as jsx13, jsxs as jsxs4 } from "react/jsx-runtime";
var inter2 = loadInter("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });
var interI = loadInter("italic", { weights: ["400"], subsets: ["latin", "latin-ext"] });
var play = loadPlayfair("italic", { weights: ["800"], subsets: ["latin", "latin-ext"] });
var txtDe = (idx) => idx.map((i) => PALAVRAS[i].w).join(" ");
var normais = (idx) => {
  const n = (l) => l.map((i) => [i, "n"]);
  if (idx.length < 2 || idx.length <= 3 && txtDe(idx).length <= 15) return { l1: n(idx), l2: null };
  let melhor = 1;
  let menor = Infinity;
  for (let s = 1; s < idx.length; s++) {
    const m = Math.max(txtDe(idx.slice(0, s)).length, txtDe(idx.slice(s)).length);
    if (m <= menor) {
      menor = m;
      melhor = s;
    }
  }
  return { l1: n(idx.slice(0, melhor)), l2: n(idx.slice(melhor)) };
};
var BLOCOS = (() => {
  const out = [];
  let i02 = 0;
  for (const b of blocos()) {
    let resto = b.map((_, k) => i02 + k);
    i02 += b.length;
    while (resto.length) {
      const k = resto.findIndex((i) => ehChave(i));
      if (k < 0) {
        out.push(normais(resto));
        break;
      }
      const antes = resto.slice(0, k);
      const e = resto[k];
      if (!antes.length) out.push({ l1: [[e, "e"]], l2: null });
      else if (antes.length === 1 && limpa(PALAVRAS[antes[0]].w).length <= 3) out.push({ l1: [[antes[0], "i"], [e, "e"]], l2: null });
      else out.push({ l1: antes.map((i) => [i, "n"]), l2: [[e, "e"]] });
      resto = resto.slice(k + 1);
    }
  }
  return out;
})();
var SAFE = W - 120;
var ENTRY = 0.1;
var SLIDE = 0.2;
var COR = "#f5f0d0";
var SOMBRA = "0 2px 12px rgba(0,0,0,0.6), 0 4px 24px rgba(0,0,0,0.35)";
var idxDe = (b) => [...b.l1, ...b.l2 ?? []].map((p) => p[0]);
var inicio = (b) => PALAVRAS[b.l1[0][0]].t0;
var fimDe = (b) => PALAVRAS[Math.max(...idxDe(b))].t1 + SEGURA;
var EditorialEmphasis = () => {
  const pronto = useFontes([inter2.waitUntilDone, interI.waitUntilDone, play.waitUntilDone]);
  const t = useCurrentFrame13() / FPS;
  if (!pronto) return null;
  let bi = -1;
  BLOCOS.forEach((b2, i) => {
    if (t >= inicio(b2)) bi = i;
  });
  if (bi < 0) return null;
  const b = BLOCOS[bi];
  if (t >= fimDe(b)) return null;
  const tamanho = (l) => {
    const txt = l.map((p) => PALAVRAS[p[0]].w).join(" ");
    return l.some((p) => p[1] === "e") ? cabe(txt, 180, "800", play.fontFamily, SAFE, "italic") : cabe(txt, 86, "400", inter2.fontFamily, SAFE);
  };
  const estilo = (tipo, fs2) => tipo === "e" ? { fontFamily: play.fontFamily, fontWeight: 800, fontStyle: "italic", fontSize: fs2, lineHeight: 0.9 } : { fontFamily: inter2.fontFamily, fontWeight: 400, fontStyle: tipo === "i" ? "italic" : "normal", fontSize: fs2 };
  const largura = (l, fs2) => l.reduce((s, p, k) => s + (k ? 14 : 0) + mede(PALAVRAS[p[0]].w, p[1] === "e" ? `italic 800 ${fs2}px "${play.fontFamily}"` : `${p[1] === "i" ? "italic " : ""}400 ${fs2}px "${inter2.fontFamily}"`), 0);
  const f1 = tamanho(b.l1);
  const f2 = b.l2 ? tamanho(b.l2) : 0;
  const maxW = Math.max(largura(b.l1, f1), b.l2 ? largura(b.l2, f2) : 0);
  const esc = maxW > SAFE ? SAFE / maxW : 1;
  const palavra = (p, fs2, k, porPalavra) => {
    const w = PALAVRAS[p[0]];
    const pr = porPalavra ? prog(t, w.t0, ENTRY, power2Out) : 1;
    return /* @__PURE__ */ jsx13("span", { style: { display: "inline-block", color: COR, textShadow: SOMBRA, opacity: pr, transform: `scale(${lerp(1.12, 1, pr)})`, transformOrigin: "0% 100%", ...estilo(p[1], fs2) }, children: w.w }, k);
  };
  const linha = (l, fs2, segunda) => {
    const enfase = segunda && l.some((p) => p[1] === "e");
    const pr = enfase ? prog(t, PALAVRAS[l[0][0]].t0, SLIDE, power2Out) : 1;
    return /* @__PURE__ */ jsx13("div", { style: { display: "flex", alignItems: "baseline", gap: 14, lineHeight: 1.1, whiteSpace: "nowrap", marginTop: segunda ? 8 : 0, opacity: pr, transform: `translateX(${(1 - pr) * -W}px)` }, children: l.map((p, k) => palavra(p, fs2, k, !enfase)) });
  };
  return /* @__PURE__ */ jsxs4("div", { style: { position: "absolute", left: 60, top: Y_CENTRO - 110, transform: `scale(${esc})`, transformOrigin: "0% 0%" }, children: [
    linha(b.l1, f1, false),
    b.l2 ? linha(b.l2, f2, true) : null
  ] });
};

// packages/legendas-euriliana/src/estilos/a/blend-difference.tsx
import { useCurrentFrame as useCurrentFrame14 } from "remotion";
import { loadFont as loadFont12 } from "@remotion/google-fonts/InterTight";
import { jsx as jsx14 } from "react/jsx-runtime";
var { fontFamily: fontFamily11, waitUntilDone: waitUntilDone2 } = loadFont12("normal", { weights: ["900"], subsets: ["latin", "latin-ext"] });
var BS2 = blocos(void 0, 3, 18);
var BASE2 = 210;
var MAXW2 = W - 100;
var BlendDifference = () => {
  const pronto = useFontes([waitUntilDone2]);
  const t = useCurrentFrame14() / FPS;
  if (!pronto) return null;
  const bi = BS2.findIndex((b2, i) => t >= b2[0].t0 && t < (BS2[i + 1]?.[0].t0 ?? 1e9) && t < b2[b2.length - 1].t1 + SEGURA);
  if (bi < 0) return null;
  const b = BS2[bi];
  const linhas = [];
  b.forEach((w) => {
    const ult = linhas[linhas.length - 1];
    if (ult && cabe([...ult, w].map((x) => x.w.toUpperCase()).join(" "), BASE2, "900", fontFamily11, MAXW2, "", -0.02, 0.2) >= 170) ult.push(w);
    else linhas.push([w]);
  });
  const fs2 = Math.min(...linhas.map((l) => cabe(l.map((w) => w.w.toUpperCase()).join(" "), BASE2, "900", fontFamily11, MAXW2, "", -0.02, 0.2)));
  const fim = Math.min(BS2[bi + 1]?.[0].t0 ?? 1e9, b[b.length - 1].t1 + SEGURA, TOTAL);
  const ultimo = b[b.length - 1].t1;
  const saidaIni = Math.max(ultimo, fim - 0.4);
  const saida = prog(t, saidaIni, fim - saidaIni, power2In);
  return /* @__PURE__ */ jsx14("div", { style: { position: "absolute", left: 0, width: W, top: Y_CENTRO, transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, mixBlendMode: "difference", color: "#ffffff", fontFamily: fontFamily11, fontWeight: 900, letterSpacing: "-0.02em", textTransform: "uppercase" }, children: linhas.map((l, k) => {
    const p = prog(t, l[0].t0, 0.6, expoOut);
    const vis = t >= l[0].t0;
    return /* @__PURE__ */ jsx14("div", { style: { fontSize: fs2, lineHeight: 1, whiteSpace: "nowrap", visibility: vis ? "visible" : "hidden", opacity: p * (1 - saida), transform: `translateY(${(1 - p) * 60}px)` }, children: l.map((w) => w.w).join(" ") }, k);
  }) });
};

// packages/legendas-euriliana/src/estilos/a/kinetic-slam.tsx
import { useCurrentFrame as useCurrentFrame15 } from "remotion";
import { loadFont as loadFont13 } from "@remotion/google-fonts/Anton";
import { Fragment as Fragment2, jsx as jsx15 } from "react/jsx-runtime";
var { fontFamily: fontFamily12, waitUntilDone: waitUntilDone3 } = loadFont13("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });
var MAXW3 = W - 120;
var back17 = backOut(1.7);
var back22 = backOut(2.2);
var KineticSlam = () => {
  const pronto = useFontes([waitUntilDone3]);
  const t = useCurrentFrame15() / FPS;
  if (!pronto) return null;
  return /* @__PURE__ */ jsx15(Fragment2, { children: PALAVRAS.map((w, wi) => {
    if (t < w.t0 || t >= w.t1 + 0.1) return null;
    const txt = w.w.toUpperCase();
    const fs2 = cabe(txt, 220, "400", fontFamily12, MAXW3, "", 0.04);
    const modo = wi % 4;
    let x = 0;
    let y = 0;
    let s = 1;
    let op = 1;
    if (modo === 0) {
      const p = prog(t, w.t0, 0.22, back17);
      y = lerp(-120, 0, p);
      op = Math.min(1, p);
    } else if (modo === 1 || modo === 2) {
      const p = prog(t, w.t0, 0.2, expoOut);
      x = lerp(modo === 1 ? -300 : 300, 0, p);
      op = p;
    } else {
      const p = prog(t, w.t0, 0.24, back22);
      s = lerp(0.4, 1, p);
      op = Math.min(1, prog(t, w.t0, 0.24, back22));
    }
    op *= 1 - prog(t, w.t1, 0.1, power2In);
    return /* @__PURE__ */ jsx15("div", { style: { position: "absolute", left: 0, width: W, top: Y_CENTRO, textAlign: "center", fontFamily: fontFamily12, fontWeight: 400, fontSize: fs2, textTransform: "uppercase", color: CHAVES_IDX.has(wi) ? "#FFD700" : "#ffffff", letterSpacing: "0.04em", lineHeight: 1, opacity: Math.max(0, op), transform: `translate(${x}px, ${y}px) translateY(-50%) scale(${s})` }, children: txt }, wi);
  }) });
};

// packages/legendas-euriliana/src/estilos/a/emoji-pop.tsx
import { useCurrentFrame as useCurrentFrame16 } from "remotion";
import { loadFont as loadFont14 } from "@remotion/google-fonts/Gabarito";
import { jsx as jsx16, jsxs as jsxs5 } from "react/jsx-runtime";
var { fontFamily: fontFamily13, waitUntilDone: waitUntilDone4 } = loadFont14("normal", { weights: ["900"], subsets: ["latin", "latin-ext"] });
var ENTRY2 = 4 / 30;
var EXIT = 3 / 30;
var FS = 72;
var SAFE2 = W - 120;
var PRIMARY = "#FFFFFF";
var ACCENTS = ["#FF76FF", "#FF0002", "#B2F7FF"];
var norm3 = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z]/g, "");
var TRANSITION = /* @__PURE__ */ new Set(["a", "o", "e", "ao", "aos", "as", "os", "de", "do", "da", "dos", "das", "para", "pra", "seu", "sua", "em", "no", "na", "que", "onde", "com", "um", "uma", "se", "por", "mas", "ou", "nao", "sim", "so"]);
var EMOJI_TAM = 90;
var EMOJI_DY = 70 + (EMOJI_TAM - 56) / 2;
var seeded = (seed) => {
  const x = Math.sin(seed * 9999) * 1e4;
  return x - Math.floor(x);
};
var cores = (ws, gi, i02) => ws.map((w, i) => {
  const c2 = norm3(w.w);
  if (ehChave(i02 + i)) return ACCENTS[Math.floor(seeded(gi * 23 + i * 31) * ACCENTS.length)];
  if (TRANSITION.has(c2)) return PRIMARY;
  const r = seeded(gi * 13 + i);
  if (r > 0.55) return ACCENTS[Math.floor(r * ACCENTS.length) % ACCENTS.length];
  return PRIMARY;
});
var sombra = (hex) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `0 4px 8px rgba(0,0,0,0.7), 0 0 2px rgba(${r},${g},${b},1), 0 0 8px rgba(${r},${g},${b},0.6)`;
};
var i0 = 0;
var GRUPOS2 = blocos(PALAVRAS, 3, 18).map((ws, gi) => {
  const g = { ws, cores: cores(ws, gi, i0), emoji: ws.map((w) => emojiDe(w.w)).find(Boolean) ?? null, start: ws[0].t0, end: ws[ws.length - 1].t1 };
  i0 += ws.length;
  return g;
});
var VIS = GRUPOS2.map((g, gi) => {
  const prev = GRUPOS2[gi - 1];
  const gap = prev ? Math.max(0, g.start - prev.end) : ENTRY2;
  return Math.max(0, g.start - Math.min(ENTRY2, gap));
});
var EmojiPop = () => {
  const pronto = useFontes([waitUntilDone4]);
  const t = useCurrentFrame16() / FPS;
  if (!pronto) return null;
  let gi = -1;
  VIS.forEach((v, i) => {
    if (t >= v) gi = i;
  });
  if (gi < 0) return null;
  const g = GRUPOS2[gi];
  const vs = VIS[gi];
  const ve = Math.min(gi < GRUPOS2.length - 1 ? VIS[gi + 1] : TOTAL, g.end + SEGURA);
  if (t >= ve) return null;
  const exitStart = Math.max(vs, ve - EXIT);
  const pIn = prog(t, vs, ENTRY2, power3Out);
  const pOut = prog(t, exitStart, EXIT, power2In);
  const sx = lerp(lerp(0.8, 1, pIn), 0.75, pOut);
  const op = lerp(pIn, 0.8, pOut);
  const fs2 = cabe(g.ws.map((w) => w.w.toUpperCase()).join(" "), FS, "900", fontFamily13, SAFE2);
  return /* @__PURE__ */ jsxs5("div", { style: { position: "absolute", left: 0, width: W, top: Y_CENTRO - 140, height: 280, display: "flex", alignItems: "center", justifyContent: "center", opacity: op, transform: `scaleX(${sx})`, transformOrigin: "50% 50%" }, children: [
    g.emoji ? /* @__PURE__ */ jsx16("div", { style: { position: "absolute", top: "50%", left: "50%", transform: `translate(-50%, calc(-50% - ${EMOJI_DY}px))`, fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif', fontSize: EMOJI_TAM, lineHeight: 1, textAlign: "center" }, children: g.emoji }) : null,
    /* @__PURE__ */ jsx16("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 14, lineHeight: 1.1, whiteSpace: "nowrap" }, children: g.ws.map((w, i) => {
      const cor = g.cores[i] || PRIMARY;
      return /* @__PURE__ */ jsx16("span", { style: { display: "inline-block", color: cor, fontFamily: fontFamily13, fontWeight: 900, fontSize: fs2, lineHeight: 1.1, letterSpacing: "-0.03em", textTransform: "uppercase", WebkitTextStroke: "3px #000000", paintOrder: "stroke fill", textShadow: sombra(cor) }, children: w.w.toUpperCase() }, i);
    }) })
  ] });
};

// packages/legendas-euriliana/src/estilos/a/parallax-layers.tsx
import { useCurrentFrame as useCurrentFrame17 } from "remotion";
import { loadFont as loadFont15 } from "@remotion/google-fonts/InstrumentSerif";
import { Fragment as Fragment3, jsx as jsx17, jsxs as jsxs6 } from "react/jsx-runtime";
var reg = loadFont15("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });
var ita = loadFont15("italic", { weights: ["400"], subsets: ["latin", "latin-ext"] });
var fam = reg.fontFamily;
var BLOCOS2 = (() => {
  const out = [];
  let i02 = 0;
  for (const b of blocos()) {
    const idx = b.map((_, k) => i02 + k);
    i02 += b.length;
    const tras = idx.filter((i) => ehChave(i));
    const frente = idx.filter((i) => !ehChave(i));
    out.push({ behind: tras.length ? tras : null, front: frente.length ? frente : null });
  }
  return out;
})();
var italico = (i) => /[.!?]$/.test(PALAVRAS[i].w);
var BEHIND_W = Math.round(W * (1800 / 1920));
var FRONT_W = Math.round(W * (1750 / 1920));
var todas = (b) => [...b.behind ?? [], ...b.front ?? []];
var inicio2 = (b) => Math.min(...todas(b).map((i) => PALAVRAS[i].t0));
var fimDe2 = (b) => Math.max(...todas(b).map((i) => PALAVRAS[i].t1)) + SEGURA;
var TOPO_TRAS = VERTICAL2 ? 340 : 60;
var TOPO_FRENTE = Y_CENTRO - 72;
var ParallaxLayers = () => {
  const pronto = useFontes([reg.waitUntilDone, ita.waitUntilDone]);
  const t = useCurrentFrame17() / FPS;
  if (!pronto) return null;
  let bi = -1;
  BLOCOS2.forEach((b2, i) => {
    if (t >= inicio2(b2)) bi = i;
  });
  if (bi < 0) return null;
  const b = BLOCOS2[bi];
  if (t >= fimDe2(b)) return null;
  let tras = null;
  if (b.behind) {
    const txt = b.behind.map((i) => PALAVRAS[i].w).join(" ");
    const fs2 = cabe(txt, 220, "400", fam, BEHIND_W);
    const nat = b.behind.reduce((s, i, k) => s + (k ? 14 : 0) + mede(PALAVRAS[i].w, `400 ${fs2}px "${fam}"`), 0) + 10;
    const sx = BEHIND_W / nat;
    tras = /* @__PURE__ */ jsx17("div", { style: { position: "absolute", left: "50%", top: TOPO_TRAS, transform: "translateX(-50%)" }, children: /* @__PURE__ */ jsx17("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "center", gap: 14, lineHeight: 1.1, whiteSpace: "nowrap", transform: `scaleX(${sx}) scaleY(2.8)`, transformOrigin: "50% 0%" }, children: b.behind.map((i) => /* @__PURE__ */ jsx17("span", { style: { display: "inline-block", fontFamily: fam, fontSize: fs2, fontWeight: 400, lineHeight: 0.9, color: "#e50914", WebkitTextStroke: "5px #e50914", textShadow: "2px 4px 4px #a30610", opacity: prog(t, PALAVRAS[i].t0, 0.1, power2Out) }, children: PALAVRAS[i].w }, i)) }) });
  }
  let frente = null;
  if (b.front) {
    const fs2 = cabe(b.front.map((i) => PALAVRAS[i].w).join(" "), 130, "400", fam, FRONT_W);
    frente = /* @__PURE__ */ jsx17("div", { style: { position: "absolute", left: "50%", top: TOPO_FRENTE, transform: "translateX(-50%)" }, children: /* @__PURE__ */ jsx17("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "center", gap: 14, lineHeight: 1.1, whiteSpace: "nowrap" }, children: b.front.map((i) => /* @__PURE__ */ jsx17("span", { style: { display: "inline-block", fontFamily: fam, fontSize: fs2, fontWeight: 400, fontStyle: italico(i) ? "italic" : "normal", color: "#eeeeee", textShadow: "0 2px 12px rgba(0,0,0,0.6), 0 4px 24px rgba(0,0,0,0.35)", opacity: t >= PALAVRAS[i].t0 ? 1 : 0 }, children: PALAVRAS[i].w }, i)) }) });
  }
  return /* @__PURE__ */ jsxs6(Fragment3, { children: [
    tras,
    frente
  ] });
};

// packages/legendas-euriliana/src/estilos/a/texture.tsx
import { useCurrentFrame as useCurrentFrame18 } from "remotion";
import { loadFont as loadFont16 } from "@remotion/google-fonts/Anton";

// packages/legendas-euriliana/src/estilos/a/lava.png
var lava_default = "data:image/png;base64,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";

// packages/legendas-euriliana/src/estilos/a/texture.tsx
import { Fragment as Fragment4, jsx as jsx18 } from "react/jsx-runtime";
var { fontFamily: fontFamily14, waitUntilDone: waitUntilDone5 } = loadFont16("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });
var MAXW4 = W - 120;
var Texture = () => {
  const pronto = useFontes([waitUntilDone5]);
  const t = useCurrentFrame18() / FPS;
  if (!pronto) return null;
  return /* @__PURE__ */ jsx18(Fragment4, { children: PALAVRAS.map((w, wi) => {
    if (t < w.t0 || t >= w.t1 + 0.1) return null;
    const txt = w.w.toUpperCase();
    const fs2 = cabe(txt, 200, "400", fontFamily14, MAXW4, "", 0.04);
    const dur = Math.max(w.t1 - w.t0 + 0.3, 0.4);
    const pIn = prog(t, w.t0, 0.18, power3Out);
    const pOut = prog(t, w.t1, 0.1, power2In);
    const op = pIn * (1 - pOut);
    const s = pOut > 0 ? lerp(1, 1.08, pOut) : lerp(0.88, 1, pIn);
    const mx = prog(t, w.t0, dur, sineInOut) * 100;
    const mask = `url(${lava_default})`;
    return /* @__PURE__ */ jsx18("div", { style: { position: "absolute", left: 0, width: W, top: Y_CENTRO, textAlign: "center", filter: "drop-shadow(0 4px 24px rgba(255, 100, 20, 0.55))", opacity: op, transform: `translateY(-50%) scale(${s})` }, children: /* @__PURE__ */ jsx18(
      "div",
      {
        style: {
          fontFamily: fontFamily14,
          fontWeight: 400,
          textTransform: "uppercase",
          color: CHAVES_IDX.has(wi) ? "#FFAA44" : "#ffd0a0",
          display: "inline-block",
          letterSpacing: "0.04em",
          lineHeight: 1,
          fontSize: fs2,
          WebkitMaskImage: mask,
          maskImage: mask,
          WebkitMaskSize: "200% 200%",
          maskSize: "200% 200%",
          WebkitMaskPosition: `${mx}% 50%`,
          maskPosition: `${mx}% 50%`,
          maskMode: "luminance",
          filter: "contrast(1.2)"
        },
        children: txt
      }
    ) }, wi);
  }) });
};

// packages/legendas-euriliana/src/estilos/a/camera-follow.tsx
import { useCurrentFrame as useCurrentFrame19 } from "remotion";
import { loadFont as loadFont17 } from "@remotion/google-fonts/InterTight";
import { Fragment as Fragment5, jsx as jsx19, jsxs as jsxs7 } from "react/jsx-runtime";
var { fontFamily: fontFamily15, waitUntilDone: waitUntilDone6 } = loadFont17("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
function bezier(x1, y1, x2, y2) {
  const curve = (t, a1, a2) => {
    const A = 1 - 3 * a2 + 3 * a1;
    const B = 3 * a2 - 6 * a1;
    const C = 3 * a1;
    return ((A * t + B) * t + C) * t;
  };
  const slope = (t, a1, a2) => {
    const A = 1 - 3 * a2 + 3 * a1;
    const B = 3 * a2 - 6 * a1;
    const C = 3 * a1;
    return (3 * A * t + 2 * B) * t + C;
  };
  return (p) => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    let t = p;
    for (let i = 0; i < 8; i++) {
      const d = slope(t, x1, x2);
      if (Math.abs(d) < 1e-6) break;
      const e = curve(t, x1, x2) - p;
      if (Math.abs(e) < 1e-7) return curve(t, y1, y2);
      t -= e / d;
    }
    let lo = 0;
    let hi = 1;
    t = p;
    for (let j = 0; j < 24; j++) {
      const x = curve(t, x1, x2);
      if (Math.abs(x - p) < 1e-7) break;
      if (x > p) hi = t;
      else lo = t;
      t = (lo + hi) / 2;
    }
    return curve(t, y1, y2);
  };
}
var EASE_STEP = bezier(0.31, 0, 0.11, 1);
var EASE_WIDE = bezier(0.42, 0, 0.14, 1);
var EASE_INK = bezier(0.2, 0.7, 0.3, 1);
var EASE_BLUR_UP = bezier(0.2, 0.8, 0.4, 1);
var EASE_BLUR_DOWN = bezier(0.5, 0, 0.2, 1);
var FRAME_W = W;
var FRAME_H = 600;
var TOPO = Y_CENTRO - FRAME_H / 2;
var MOVE = 0.4;
var RATIO = 0.72;
var MARGIN = 1.36;
var BLUR = FRAME_W * 0.026;
var HALF_DIAG = Math.sqrt(FRAME_W * FRAME_W + FRAME_H * FRAME_H) / 2;
var ACCENT = "#ffd84d";
var MAX_PAL = 16;
var PAUSA = 0.6;
var SEGURA_FRASE = 2.2;
var poseFor = (b, margin) => {
  const bw = (b.x1 - b.x0) * margin;
  const bh = (b.y1 - b.y0) * margin;
  const s = Math.min(FRAME_W / bw, FRAME_H / bh);
  return { x: FRAME_W / 2 - s * (b.x0 + b.x1) / 2, y: FRAME_H / 2 - s * (b.y0 + b.y1) / 2, scale: s };
};
var monta = () => {
  const grupos2 = [[]];
  PALAVRAS.forEach((p, i) => {
    const g = grupos2[grupos2.length - 1];
    g.push(i);
    const prox = PALAVRAS[i + 1];
    if (!prox) return;
    if (/[.!?]$/.test(p.w) || prox.t0 - p.t1 > PAUSA || /[,;:]$/.test(p.w) && g.length >= 6 || g.length >= MAX_PAL) grupos2.push([]);
  });
  const BASE5 = Math.max(FRAME_W, FRAME_H) * 0.16;
  return grupos2.map((idx, gi) => {
    let box = null;
    const ws = idx.map((pi, k) => {
      const text = limpa(PALAVRAS[pi].w).toUpperCase();
      const fs2 = k === 0 ? BASE5 : (box.y1 - box.y0) * RATIO;
      const w = mede(text, `700 ${fs2}px "${fontFamily15}"`, 5e-3, fs2);
      const h = fs2 * 0.78;
      const gap = fs2 * 0.07;
      let x = 0;
      let y = 0;
      if (k > 0) {
        if ((box.x1 - box.x0) / (box.y1 - box.y0) < FRAME_W / FRAME_H) {
          x = box.x1 + gap;
          y = box.y1 - h;
        } else {
          x = box.x0;
          y = box.y1 + gap;
        }
      }
      box = box ? { x0: Math.min(box.x0, x), y0: Math.min(box.y0, y), x1: Math.max(box.x1, x + w), y1: Math.max(box.y1, y + h) } : { x0: x, y0: y, x1: x + w, y1: y + h };
      const t = k === 0 && gi === 0 && PALAVRAS[pi].t0 < 0.5 ? 0 : PALAVRAS[pi].t0;
      return { i: pi, text, fs: fs2, x, y, w, h, box: { ...box }, accent: CHAVES_IDX.has(pi), t };
    });
    const FULL = box;
    const ini = ws[0].t;
    const ultimaPal = PALAVRAS[idx[idx.length - 1]];
    const proxIni = Math.min(grupos2[gi + 1] ? PALAVRAS[grupos2[gi + 1][0]].t0 : TOTAL, ultimaPal.t0 + SEGURA_FRASE);
    const ks = (centre, scale, count) => ws.slice(0, count).map((wd) => {
      const cx = wd.x + wd.w / 2;
      const cy = wd.y + wd.h / 2;
      const d = scale * Math.hypot(cx - centre.x, cy - centre.y) / HALF_DIAG;
      return 0.2 + 1.15 * Math.min(1, d);
    });
    const movs = [];
    ws.forEach((wd, k) => {
      if (k === 0) return;
      const p = poseFor(wd.box, MARGIN);
      movs.push({ at: wd.t, dur: MOVE, ease: EASE_STEP, to: p, ks: ks({ x: (wd.box.x0 + wd.box.x1) / 2, y: (wd.box.y0 + wd.box.y1) / 2 }, p.scale, k + 1), up: MOVE * 0.24, down: MOVE * 0.44, amt: BLUR / p.scale });
    });
    const ultimo = ws[ws.length - 1].t;
    const wideAt = Math.min(ultimo + 0.62, proxIni - 0.42);
    const wideDur = Math.min(0.94, proxIni - wideAt);
    const wide = poseFor(FULL, 1.2);
    const up = Math.min(0.3, wideDur * 0.32);
    movs.push({ at: wideAt, dur: wideDur, ease: EASE_WIDE, to: wide, ks: ks({ x: (FULL.x0 + FULL.x1) / 2, y: (FULL.y0 + FULL.y1) / 2 }, wide.scale, ws.length), up, down: Math.min(0.58, wideDur * 0.62), amt: BLUR * 0.8 / wide.scale });
    const first = poseFor(ws[0].box, MARGIN);
    let prev = first;
    movs.forEach((m, j) => {
      const anterior = movs[j - 1];
      if (anterior) {
        const p = anterior.ease(Math.max(0, Math.min(1, (m.at - anterior.at) / anterior.dur)));
        prev = { x: lerp(anterior.from.x, anterior.to.x, p), y: lerp(anterior.from.y, anterior.to.y, p), scale: lerp(anterior.from.scale, anterior.to.scale, p) };
      }
      m.from = prev;
    });
    return { ws, movs, first, ini, fim: proxIni };
  });
};
var CACHE = null;
var CameraFollow = () => {
  const pronto = useFontes([waitUntilDone6]);
  const t = useCurrentFrame19() / FPS;
  if (!pronto) return null;
  if (!CACHE) CACHE = monta();
  const f = CACHE.find((x) => t >= x.ini && t < x.fim);
  if (!f) return null;
  let cam = f.first;
  let ativo = null;
  for (const m of f.movs) if (t >= m.at) ativo = m;
  if (ativo) {
    const p = ativo.ease(Math.max(0, Math.min(1, (t - ativo.at) / ativo.dur)));
    cam = { x: lerp(ativo.from.x, ativo.to.x, p), y: lerp(ativo.from.y, ativo.to.y, p), scale: lerp(ativo.from.scale, ativo.to.scale, p) };
  }
  let amt = 0;
  let ks = [];
  if (ativo) {
    ks = ativo.ks;
    const dt = t - ativo.at;
    amt = dt < ativo.up ? lerp(0, ativo.amt, EASE_BLUR_UP(dt / ativo.up)) : lerp(ativo.amt, 0, EASE_BLUR_DOWN(Math.min(1, (dt - ativo.up) / ativo.down)));
  }
  const fade = "linear-gradient(to bottom, transparent 0, #000 60px, #000 calc(100% - 60px), transparent 100%)";
  return /* @__PURE__ */ jsxs7(Fragment5, { children: [
    /* @__PURE__ */ jsx19("div", { style: { position: "absolute", left: 0, top: TOPO, width: FRAME_W, height: FRAME_H, overflow: "hidden", WebkitMaskImage: fade, maskImage: fade }, children: f.ws.map((wd, k) => {
      const op = k === 0 ? 1 : EASE_INK(Math.max(0, Math.min(1, (t - wd.t) / 0.16)));
      if (t < wd.t && k > 0) return null;
      const s = cam.scale;
      const blur = (ks[k] ?? 0) * amt * s;
      return /* @__PURE__ */ jsx19("div", { style: { position: "absolute", left: cam.x + wd.x * s, top: cam.y + wd.y * s, fontSize: wd.fs * s, whiteSpace: "nowrap", fontFamily: fontFamily15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.005em", lineHeight: 0.78, color: wd.accent ? ACCENT : "#ffffff", opacity: op, filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : void 0 }, children: wd.text }, wd.i);
    }) }),
    /* @__PURE__ */ jsx19("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.55) 100%)" } })
  ] });
};

// packages/legendas-euriliana/src/estilos/b/particle-burst.tsx
import { interpolateColors, random, useCurrentFrame as useCurrentFrame20 } from "remotion";
import { loadFont as loadFont18 } from "@remotion/google-fonts/Outfit";

// packages/legendas-euriliana/src/estilos/b/comum.ts
import { useEffect as useEffect2, useMemo, useState as useState2 } from "react";
import { continueRender as continueRender2, delayRender as delayRender2 } from "remotion";
var E = {
  none: (t) => t,
  p1out: (t) => 1 - (1 - t) ** 2,
  p1in: (t) => t * t,
  p2out: (t) => 1 - (1 - t) ** 3,
  p2in: (t) => t ** 3,
  p3out: (t) => 1 - (1 - t) ** 4,
  sineInOut: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  backOut: (s) => (t) => 1 + (s + 1) * (t - 1) ** 3 + s * (t - 1) ** 2
};
var clamp012 = (x) => Math.max(0, Math.min(1, x));
var prog2 = (t, ini, dur, ease = E.p1out) => dur <= 0 ? t >= ini ? 1 : 0 : ease(clamp012((t - ini) / dur));
var mix = (a, b, p) => a + (b - a) * p;
var mulberry32 = (seed) => () => {
  seed |= 0;
  seed = seed + 1831565813 | 0;
  let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
var KW = CHAVES_IDX;
var KW_TXT = new Set([...KW].map((i) => limpa(PALAVRAS[i].w).toLowerCase()));
var grupos = (fim, bs = blocos()) => {
  let i02 = 0;
  return bs.map((ws, gi) => {
    const nb = bs[gi + 1];
    const next = nb ? nb[0].t0 : 1e9;
    const lastEnd = ws[ws.length - 1].t1;
    const g = { ws, i0: i02, start: ws[0].t0, lastEnd, next, end: fim(lastEnd, next, !nb) };
    i02 += ws.length;
    return g;
  });
};
var grupoEm = (gs, t) => gs.findIndex((g) => t >= g.start && t < g.end);
var larg = (txt, size, k, ls = 0) => typeof k === "function" ? k(txt, size) + txt.length * size * ls : txt.length * size * (k + ls);
var useMede = (weight, family) => {
  const [h] = useState2(() => delayRender2(`fonte ${family} ${weight}`));
  const [ok, setOk] = useState2(false);
  useEffect2(() => {
    const fim = () => {
      setOk(true);
      continueRender2(h);
    };
    document.fonts.load(`${weight} 100px "${family}"`).then(fim, fim);
  }, [h, weight, family]);
  return useMemo(() => {
    if (!ok) return null;
    const ctx2 = document.createElement("canvas").getContext("2d");
    return (txt, size) => {
      ctx2.font = `${weight} ${size}px "${family}"`;
      return ctx2.measureText(txt).width;
    };
  }, [ok, weight, family]);
};
var nLinhas = (ws, s, maxW, k, ls, gap, pad) => {
  let n = 1;
  let x = 0;
  for (const w of ws) {
    const lw3 = larg(w, s, k, ls) + pad;
    if (lw3 > maxW) return 99;
    if (x === 0) x = lw3;
    else if (x + gap + lw3 <= maxW) x += gap + lw3;
    else {
      n++;
      x = lw3;
    }
  }
  return n;
};
var cabe2 = (ws, base2, maxW, k, ls = 0, gap = 24, pad = 0, maxL = 2) => {
  let s = base2;
  while (s > Math.floor(base2 * 0.45) && nLinhas(ws, s, maxW, k, ls, gap, pad) > maxL) s -= 2;
  return s;
};

// packages/legendas-euriliana/src/estilos/b/particle-burst.tsx
import { Fragment as Fragment6, jsx as jsx20, jsxs as jsxs8 } from "react/jsx-runtime";
var { fontFamily: fontFamily16 } = loadFont18("normal", { weights: ["900"], subsets: ["latin", "latin-ext"] });
var GS = grupos((lastEnd, next) => Math.min(lastEnd + 0.35, next - 0.05));
var CORES = ["#FFD700", "#FF6B35", "#FF3C78", "#9B5DE5", "#00BBF9", "#00F5D4", "#ffffff", "#F15BB5"];
var N = 10;
var PARTS = {};
KW.forEach((wi) => {
  PARTS[wi] = Array.from({ length: N }, (_, p) => {
    const ang = p / N * Math.PI * 2 + random(`pb-${wi}-${p}-a`) * 0.6;
    const dist = 120 + random(`pb-${wi}-${p}-d`) * 200;
    return { dx: Math.cos(ang) * dist, dy: -Math.sin(ang) * dist, sz: 4 + random(`pb-${wi}-${p}-s`) * 8, cor: CORES[p % CORES.length] };
  });
});
var INATIVO = "rgba(255,255,255,0.45)";
var APAGADO = "rgba(255,255,255,0.4)";
var ParticleBurst = () => {
  const t = useCurrentFrame20() / FPS;
  const mede2 = useMede(900, fontFamily16);
  if (!mede2) return null;
  const gi = grupoEm(GS, t);
  if (gi < 0) return null;
  const g = GS[gi];
  const size = cabe2(g.ws.map((w) => w.w.toUpperCase()), 88, W - 140 - 10, mede2, 0.05, 40, 10);
  const pe = prog2(t, g.start, 0.2, E.backOut(1.5));
  const ps = prog2(t, g.end - 0.14, 0.14, E.p2in);
  const op = pe * (1 - ps);
  const sc = mix(0.92, 1, pe);
  const particulas = [];
  const palavras = g.ws.map((w, k) => {
    const wi = g.i0 + k;
    const kw = KW.has(wi);
    const a = prog2(t, w.t0, 0.08);
    const b = prog2(t, w.t1, 0.1);
    const ativo = kw ? "#FFD700" : "#ffffff";
    let cor = interpolateColors(a, [0, 1], [INATIVO, ativo]);
    let s = mix(1, kw ? 1.12 : 1.05, a);
    if (t >= w.t1) {
      cor = interpolateColors(b, [0, 1], [ativo, APAGADO]);
      s = mix(kw ? 1.12 : 1.05, 1, b);
    }
    if (kw && t >= w.t0 && t < w.t0 + 0.7) {
      PARTS[wi].forEach((pd, pi) => {
        const d0 = w.t0 + pi * 0.018;
        const m = prog2(t, d0, 0.12, E.p3out);
        const fade = prog2(t, w.t0 + 0.12 + pi * 0.018, 0.45, E.p1in);
        const o = t < d0 ? 0 : m * (1 - fade);
        particulas.push(
          /* @__PURE__ */ jsx20("div", { style: { position: "absolute", left: W / 2, top: Y_CENTRO, width: pd.sz, height: pd.sz, borderRadius: "50%", background: pd.cor, opacity: o, transform: `translate(${pd.dx * m}px, ${pd.dy * m}px)` } }, `${wi}-${pi}`)
        );
      });
    }
    return /* @__PURE__ */ jsx20("span", { style: { display: "inline-block", color: cor, transform: `scale(${s})` }, children: w.w.toUpperCase() }, k);
  });
  return /* @__PURE__ */ jsxs8(Fragment6, { children: [
    /* @__PURE__ */ jsx20("div", { style: { position: "absolute", left: 0, right: 0, top: Y_CENTRO, transform: `translateY(-50%) scale(${sc})`, opacity: op, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-end", columnGap: 40, rowGap: 14, padding: "0 70px", fontFamily: fontFamily16, fontWeight: 900, fontSize: size, letterSpacing: "0.05em", lineHeight: 1 }, children: palavras }),
    particulas
  ] });
};

// packages/legendas-euriliana/src/estilos/b/weight-shift.tsx
import { useCurrentFrame as useCurrentFrame21 } from "remotion";
import { loadFont as loadFont19 } from "@remotion/google-fonts/Montserrat";
import { jsx as jsx21 } from "react/jsx-runtime";
var { fontFamily: fontFamily17 } = loadFont19("normal", { weights: ["300", "700"], subsets: ["latin", "latin-ext"] });
var FONT = 72;
var MAX_LINE = W - 160;
var MAX_WORDS = 4;
var SPACING = 12;
var PAUSE = 0.1;
var ENTRY3 = 0.1;
var WEIGHT_T = 0.1;
var mw = (w, size = FONT) => w.w.toLowerCase().length * size * 0.57 * 1.14;
var lw = (ws, size = FONT) => ws.reduce((a, w, i) => a + mw(w, size) + (i ? SPACING : 0), 0);
var splitLines = (ws) => {
  if (ws.length < 2) return [ws];
  let best = Math.ceil(ws.length / 2);
  let bestDiff = Infinity;
  for (let s = 1; s < ws.length; s++) {
    const a = lw(ws.slice(0, s));
    const b = lw(ws.slice(s));
    if (a <= MAX_LINE && b <= MAX_LINE && Math.abs(a - b) < bestDiff) {
      bestDiff = Math.abs(a - b);
      best = s;
    }
  }
  return [ws.slice(0, best), ws.slice(best)].filter((l) => l.length);
};
var mk = (ws) => ({ words: ws.slice(), lines: splitLines(ws), start: ws[0].t0, end: ws[ws.length - 1].t1 });
var makeGroups = (ws) => {
  const gs = [];
  let cur = [];
  ws.forEach((w, i) => {
    const nx = ws[i + 1];
    const test = cur.concat([w]);
    if (test.length > MAX_WORDS || lw(test) > MAX_LINE * 1.8) {
      if (cur.length) gs.push(mk(cur));
      cur = [w];
      return;
    }
    cur.push(w);
    const pausa = nx ? nx.t0 - w.t1 : 0;
    if (!nx || /[,.:!?]$/.test(w.w) || pausa >= PAUSE || cur.length >= MAX_WORDS) {
      gs.push(mk(cur));
      cur = [];
    }
  });
  if (cur.length) gs.push(mk(cur));
  const out = [];
  gs.forEach((g) => {
    if (g.words.length === 1 && out.length && out[out.length - 1].words.length < MAX_WORDS) out[out.length - 1] = mk(out[out.length - 1].words.concat(g.words));
    else out.push(g);
  });
  for (let i = 0; i < out.length; i++) {
    if (out[i].words.length !== 1) continue;
    if (i + 1 < out.length && out[i + 1].words.length < MAX_WORDS) {
      out[i] = mk(out[i].words.concat(out[i + 1].words));
      out.splice(i + 1, 1);
    } else if (i > 0 && out[i - 1].words.length < MAX_WORDS) {
      out[i - 1] = mk(out[i - 1].words.concat(out[i].words));
      out.splice(i, 1);
      i--;
    }
  }
  return out;
};
var GS2 = makeGroups(PALAVRAS);
var VS = GS2.map((g, i) => {
  const prev = GS2[i - 1];
  const gap = prev ? Math.max(0, g.start - prev.end) : ENTRY3;
  return Math.max(0, g.start - Math.min(ENTRY3, gap));
});
var WeightShift = () => {
  const t = useCurrentFrame21() / FPS;
  const gi = GS2.findIndex((g2, i) => t >= VS[i] && t < Math.min(i < GS2.length - 1 ? VS[i + 1] : TOTAL, g2.end + SEGURA));
  if (gi < 0) return null;
  const g = GS2[gi];
  const pe = prog2(t, VS[gi], ENTRY3, E.p3out);
  const troca = g.lines.length === 2 && prog2(t, g.lines[1][0].t0, WEIGHT_T, E.p2out) >= 0.5;
  const maior = Math.max(...g.lines.map((l) => lw(l)));
  const size = maior > MAX_LINE ? Math.max(Math.floor(FONT * 0.45), Math.floor(FONT * MAX_LINE / maior)) : FONT;
  return /* @__PURE__ */ jsx21("div", { style: { position: "absolute", left: 0, right: 0, top: Y_CENTRO, transform: `translateY(-50%) scale(${mix(0.85, 1, pe)})`, opacity: pe, display: "flex", flexDirection: "column", alignItems: "center" }, children: g.lines.map((l, li) => {
    const bold = li === 0 ? !troca : troca;
    return /* @__PURE__ */ jsx21("div", { style: { display: "flex", gap: SPACING, whiteSpace: "nowrap", lineHeight: 1.1, color: "#fff", fontFamily: fontFamily17, fontSize: size, fontWeight: bold ? 700 : 300, letterSpacing: "-0.03em", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }, children: l.map((w, k) => /* @__PURE__ */ jsx21("span", { style: { display: "inline-block" }, children: w.w.toLowerCase() }, k)) }, li);
  }) });
};

// packages/legendas-euriliana/src/estilos/b/neon-glow.tsx
import { interpolateColors as interpolateColors2, useCurrentFrame as useCurrentFrame22 } from "remotion";
import { loadFont as loadFont20 } from "@remotion/google-fonts/Outfit";
import { jsx as jsx22 } from "react/jsx-runtime";
var { fontFamily: fontFamily18 } = loadFont20("normal", { weights: ["900"], subsets: ["latin", "latin-ext"] });
var GS3 = grupos((lastEnd, next) => Math.min(lastEnd + 0.1, next - 0.05));
var APAGADO2 = "rgba(0,255,240,0.14)";
var rgba = (hex, a) => {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
};
var NeonGlow = () => {
  const t = useCurrentFrame22() / FPS;
  const mede2 = useMede(900, fontFamily18);
  if (!mede2) return null;
  const gi = grupoEm(GS3, t);
  if (gi < 0) return null;
  const g = GS3[gi];
  if (t < g.start + 0.05) return null;
  const x = mix(-8, 0, prog2(t, g.start + 0.05, 0.14, E.p3out));
  const size = cabe2(g.ws.map((w) => w.w.toUpperCase()), 96, W - 120 - 10, mede2, 0.04, 24);
  return /* @__PURE__ */ jsx22("div", { style: { position: "absolute", left: 0, right: 0, top: Y_CENTRO, transform: `translate(${x}px, -50%)`, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-end", columnGap: 24, rowGap: 16, padding: "0 60px", fontFamily: fontFamily18, fontWeight: 900, fontSize: size, letterSpacing: "0.04em", lineHeight: 1, textTransform: "uppercase" }, children: g.ws.map((w, k) => {
    const kw = KW.has(g.i0 + k);
    const ativo = kw ? "#FF0099" : "#00FFF0";
    const p = t < w.t1 ? prog2(t, w.t0, 0.06) : 1 - prog2(t, w.t1, 0.06);
    const cor = interpolateColors2(p, [0, 1], [APAGADO2, ativo]);
    const sh = p > 0 ? `0 0 ${10 * p}px ${rgba(ativo, p)}, 0 0 ${35 * p}px ${rgba(ativo, p)}, 0 0 ${90 * p}px ${rgba(ativo, p)}` : "none";
    return /* @__PURE__ */ jsx22("span", { style: { display: "inline-block", color: cor, textShadow: sh }, children: w.w }, k);
  }) });
};

// packages/legendas-euriliana/src/estilos/b/matrix-decode.tsx
import { useCurrentFrame as useCurrentFrame23 } from "remotion";
import { loadFont as loadFont21 } from "@remotion/google-fonts/SpaceGrotesk";
import { jsx as jsx23, jsxs as jsxs9 } from "react/jsx-runtime";
var { fontFamily: fontFamily19 } = loadFont21("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
var GS4 = grupos((lastEnd, next) => Math.min(lastEnd + 0.3, next));
var ALNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
var scramble = (seed, n) => {
  const r = mulberry32(seed);
  let s = "";
  for (let i = 0; i < n; i++) s += ALNUM[Math.floor(r() * ALNUM.length)];
  return s;
};
var MatrixDecode = () => {
  const t = useCurrentFrame23() / FPS;
  const mede2 = useMede(700, fontFamily19);
  if (!mede2) return null;
  const gi = grupoEm(GS4, t);
  if (gi < 0) return null;
  const g = GS4[gi];
  const op = prog2(t, g.start, 0.1) * (1 - prog2(t, g.end - 0.12, 0.12));
  const size = cabe2(g.ws.map((w) => w.w), 96, W - 120 - 10, mede2, 0.04);
  return /* @__PURE__ */ jsx23("div", { style: { position: "absolute", left: 0, right: 0, top: Y_CENTRO, transform: "translateY(-50%)", opacity: op, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-end", columnGap: 24, rowGap: 14, padding: "0 60px", fontFamily: fontFamily19, fontWeight: 700, fontSize: size, letterSpacing: "0.04em", lineHeight: 1, color: "#00ff41" }, children: g.ws.map((w, k) => {
    const wi = g.i0 + k;
    const d = t - w.t0;
    const fase = d < 0 ? -1 : d < 0.1 ? 0 : d < 0.2 ? 1 : 2;
    return /* @__PURE__ */ jsxs9("span", { style: { display: "inline-block", position: "relative" }, children: [
      /* @__PURE__ */ jsx23("span", { style: { visibility: fase === 2 ? "visible" : "hidden" }, children: w.w }),
      fase === 0 || fase === 1 ? /* @__PURE__ */ jsx23("span", { style: { position: "absolute", left: 0, top: 0, whiteSpace: "nowrap" }, children: scramble(wi * 1e3 + fase, w.w.length) }) : null
    ] }, k);
  }) });
};

// packages/legendas-euriliana/src/estilos/b/neon-accent.tsx
import { useCurrentFrame as useCurrentFrame24 } from "remotion";
import { loadFont as loadFont22 } from "@remotion/google-fonts/Montserrat";
import { jsx as jsx24 } from "react/jsx-runtime";
var { fontFamily: fontFamily20 } = loadFont22("normal", { weights: ["800"], subsets: ["latin", "latin-ext"] });
var SAFE3 = W - 120;
var BASE3 = 88;
var MIN = 62;
var MAX_WORDS2 = 4;
var SPACING2 = 16;
var PAUSE2 = 0.1;
var ENTRY4 = 7 / 30;
var WIGGLE = 14;
var CYCLE = 2 / 1.3;
var SAFETY = 1.14;
var PRIMARY2 = "#FFFFFF";
var ACCENTS2 = ["#53FF01", "#FF0002", "#FCFF00"];
var TRANSICAO = /* @__PURE__ */ new Set(["o", "a", "os", "as", "um", "uma", "e", "ou", "mas", "é", "são", "ao", "aos", "de", "do", "da", "dos", "das", "em", "no", "na", "nos", "nas", "para", "pra", "por", "com", "sem", "se", "que", "seu", "sua", "você", "onde", "está", "isso", "este", "esta", "esse", "essa", "foi", "ser", "tem", "não", "sim", "só", "eu", "ele", "ela", "mais"]);
var seeded2 = (seed) => {
  const x = Math.sin(seed * 9999) * 1e4;
  return x - Math.floor(x);
};
var norm4 = (s) => limpa(s).toLowerCase();
var colors = (ws, gi) => ws.map((w, idx) => {
  if (KW_TXT.has(norm4(w.w))) return ACCENTS2[Math.floor(seeded2(gi * 23 + 7) * ACCENTS2.length)];
  if (TRANSICAO.has(norm4(w.w))) return PRIMARY2;
  const r = seeded2(gi * 7 + idx);
  if (r > 0.6) return ACCENTS2[Math.floor(r * ACCENTS2.length) % ACCENTS2.length];
  return PRIMARY2;
});
var mw2 = (w, c2, fs2) => w.w.toUpperCase().length * (c2 === PRIMARY2 ? fs2 : fs2 * 1.2) * 0.74 * SAFETY;
var lw2 = (ws, cs, fs2) => ws.reduce((a, w, i) => a + mw2(w, cs[i] || PRIMARY2, fs2) + (i ? SPACING2 : 0), 0);
var split = (ws, cs, fs2) => {
  if (ws.some((w, i) => mw2(w, cs[i] || PRIMARY2, fs2) > SAFE3)) return null;
  if (lw2(ws, cs, fs2) <= SAFE3) return [{ ws, cs }];
  let best = null;
  let bd = Infinity;
  for (let s = 1; s < ws.length; s++) {
    const a = lw2(ws.slice(0, s), cs.slice(0, s), fs2);
    const b = lw2(ws.slice(s), cs.slice(s), fs2);
    if (a <= SAFE3 && b <= SAFE3 && Math.abs(a - b) < bd) {
      bd = Math.abs(a - b);
      best = [{ ws: ws.slice(0, s), cs: cs.slice(0, s) }, { ws: ws.slice(s), cs: cs.slice(s) }];
    }
  }
  return best;
};
var mk2 = (ws, gi) => {
  const cs = colors(ws, gi);
  let fs2 = BASE3;
  while (fs2 > MIN && !split(ws, cs, fs2)) fs2 -= 2;
  return { ws: ws.slice(), fs: fs2, lines: split(ws, cs, fs2) || [{ ws, cs }], start: ws[0].t0, end: ws[ws.length - 1].t1 };
};
var GS5 = (() => {
  const gs = [];
  let cur = [];
  PALAVRAS.forEach((w, i) => {
    const nx = PALAVRAS[i + 1];
    const test = cur.concat([w]);
    if (test.length > MAX_WORDS2 || !split(test, colors(test, gs.length), BASE3)) {
      if (cur.length) gs.push(mk2(cur, gs.length));
      cur = [w];
      return;
    }
    cur.push(w);
    const pausa = nx ? nx.t0 - w.t1 : 0;
    if (!nx || /[,.:!?]$/.test(w.w) || pausa >= PAUSE2 || cur.length >= MAX_WORDS2) {
      gs.push(mk2(cur, gs.length));
      cur = [];
    }
  });
  if (cur.length) gs.push(mk2(cur, gs.length));
  return gs;
})();
var VS2 = GS5.map((g, i) => {
  const prev = GS5[i - 1];
  const gap = prev ? Math.max(0, g.start - prev.end) : ENTRY4;
  return Math.max(0, g.start - Math.min(ENTRY4, gap));
});
var rgb = (hex) => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((o) => parseInt(h.slice(o, o + 2), 16)).join(",");
};
var sombra2 = (c2) => {
  const v = rgb(c2);
  return `0 8px 16px rgba(0,0,0,0.8), 0 16px 40px rgba(0,0,0,0.6), 0 0 4px rgba(${v},1), 0 0 10px rgba(${v},0.9), 0 0 20px rgba(${v},0.7), 0 0 40px rgba(${v},0.4)`;
};
var estadoAcento = (t) => {
  const gi = GS5.findIndex((g2, i) => t >= VS2[i] && t < Math.min(i < GS5.length - 1 ? VS2[i + 1] : TOTAL, g2.end + SEGURA));
  if (gi < 0) return null;
  const g = GS5[gi];
  const pe = prog2(t, VS2[gi], ENTRY4, E.p3out);
  const D = WIGGLE * (gi % 2 === 0 ? -1 : 1);
  const ph = Math.max(0, t - VS2[gi]) / (CYCLE / 2);
  const k = Math.floor(ph);
  const f = E.sineInOut(ph - k);
  const off = D * (k % 2 === 0 ? f : 1 - f);
  const altura = g.lines.slice(0, 2).reduce((a, l) => a + Math.max(...l.cs.map((c2) => c2 === PRIMARY2 ? g.fs : g.fs * 1.2)) * 1.1, 0);
  return { gi, g, pe, off, altura };
};
var NeonAccent = () => {
  const t = useCurrentFrame24() / FPS;
  const e = estadoAcento(t);
  if (!e) return null;
  const { g, pe, off } = e;
  return /* @__PURE__ */ jsx24("div", { style: { position: "absolute", left: 0, right: 0, top: Y_CENTRO, transform: `translate(${off}px, calc(-50% + ${off}px)) scale(${mix(0.65, 1, pe)})`, opacity: pe, display: "flex", flexDirection: "column", alignItems: "center" }, children: g.lines.slice(0, 2).map((l, li) => /* @__PURE__ */ jsx24("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: SPACING2, whiteSpace: "nowrap", lineHeight: 1.1 }, children: l.ws.map((w, j) => {
    const c2 = l.cs[j] || PRIMARY2;
    return /* @__PURE__ */ jsx24("span", { style: { display: "inline-block", fontFamily: fontFamily20, fontWeight: 800, lineHeight: 1.1, color: c2, fontSize: c2 === PRIMARY2 ? g.fs : g.fs * 1.2, textShadow: sombra2(c2) }, children: w.w.toUpperCase() }, j);
  }) }, li)) });
};

// packages/legendas-euriliana/src/estilos/b/neon-accent-emoji.tsx
import { spring as spring3, useCurrentFrame as useCurrentFrame25 } from "remotion";
import { Fragment as Fragment7, jsx as jsx25, jsxs as jsxs10 } from "react/jsx-runtime";
var TAM2 = 150;
var FOLGA = 24;
var Emojis2 = () => {
  const frame = useCurrentFrame25();
  const t = frame / FPS;
  const e = estadoAcento(t);
  if (!e) return null;
  const ditos = e.g.ws.filter((w) => emojiDe(w.w) && t >= w.t0).slice(-3);
  if (!ditos.length) return null;
  const topo = Y_CENTRO + e.off - e.altura * mix(0.65, 1, e.pe) / 2;
  return /* @__PURE__ */ jsx25("div", { style: { position: "absolute", left: 0, right: 0, top: topo - FOLGA - TAM2 * 1.15, height: TAM2 * 1.15, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 18, transform: `translateX(${e.off}px)`, opacity: e.pe }, children: ditos.map((w) => {
    const s = spring3({ frame: (t - w.t0) * FPS, fps: FPS, config: { damping: 7, stiffness: 260, mass: 0.7 } });
    const giro = (1 - s) * -25;
    return /* @__PURE__ */ jsx25("div", { style: { fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif', fontSize: TAM2, lineHeight: 1, transform: `scale(${0.2 + 1 * s}) rotate(${giro}deg)`, transformOrigin: "50% 100%", filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.45))" }, children: emojiDe(w.w) }, w.t0);
  }) });
};
var NeonAccentEmoji = () => /* @__PURE__ */ jsxs10(Fragment7, { children: [
  /* @__PURE__ */ jsx25(NeonAccent, {}),
  /* @__PURE__ */ jsx25(Emojis2, {})
] });

// packages/legendas-euriliana/src/estilos/b/glitch-rgb.tsx
import { AbsoluteFill as AbsoluteFill11, useCurrentFrame as useCurrentFrame26 } from "remotion";
import { loadFont as loadFont23 } from "@remotion/google-fonts/SpaceGrotesk";
import { jsx as jsx26, jsxs as jsxs11 } from "react/jsx-runtime";
var { fontFamily: fontFamily21 } = loadFont23("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
var TR = PALAVRAS;
var RAW = (() => {
  const gs = [];
  let s = 0;
  let ch = 0;
  for (let i = 0; i < TR.length; i++) {
    ch += TR[i].w.length + 1;
    const fimFrase = /[.!?]$/.test(TR[i].w);
    const gap = i + 1 < TR.length ? TR[i + 1].t0 - TR[i].t1 : 0;
    if (fimFrase || gap > 0.28 || i - s >= 3 || ch >= 21 || i === TR.length - 1) {
      gs.push([s, i]);
      s = i + 1;
      ch = 0;
    }
  }
  return gs;
})();
var GS6 = RAW.map(([ws, we], gi) => {
  const next = gi + 1 < RAW.length ? TR[RAW[gi + 1][0]].t0 : 1e9;
  return { ws, we, start: TR[ws].t0, end: Math.min(TR[we].t1 + 0.24, next - 0.04) };
});
var PLANOS = TR.map((w, wi) => {
  const g = GS6.find((x) => wi >= x.ws && wi <= x.we);
  const nx = TR[wi + 1];
  const nextStart = nx ? nx.t0 : w.t1 + 0.3;
  const total = Math.min(0.24, Math.max(0.08, Math.min(w.t1, nextStart) - w.t0 - 0.02));
  const rng = mulberry32(wi * 777 + 13);
  const travel = -(8 + rng() * 8);
  const mag = 5 + rng() * 7;
  const out = [{ t0: w.t0, d1: total * 0.35, d2: total * 0.65, x: travel, s: mag, e1: E.none }];
  const ns = nx ? nx.t0 : g.end;
  const afterEnd = Math.min(g.end - 0.08, ns - 0.04);
  const longa = /\d|\$|%/.test(w.w) || w.w.replace(/[^\w]/g, "").length >= 7;
  if (longa && afterEnd - w.t1 > 0.22) {
    let ps = w.t1 + 0.08;
    let pi = 0;
    while (ps + 0.1 < afterEnd) {
      const px = -(3 + rng() * 5);
      const pm = 3 + rng() * 5;
      out.push({ t0: ps, d1: 0.045, d2: 0.075, x: px, s: pm, e1: E.none });
      pi++;
      ps += pi % 2 === 0 ? 0.18 : 0.24;
    }
  }
  return out;
});
var BASE_SH = "0 5px 18px rgba(0,0,0,0.52)";
var GlitchRgb = () => {
  const t = useCurrentFrame26() / FPS;
  const mede2 = useMede(700, fontFamily21);
  if (!mede2) return null;
  const gi = GS6.findIndex((g2) => t >= g2.start && t < g2.end);
  const g = gi >= 0 ? GS6[gi] : null;
  return /* @__PURE__ */ jsxs11(AbsoluteFill11, { children: [
    /* @__PURE__ */ jsx26(AbsoluteFill11, { style: { background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.16) 54%, rgba(0,0,0,0.5) 100%)" } }),
    /* @__PURE__ */ jsx26(AbsoluteFill11, { style: { opacity: 0.55, background: "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.16) 3px, rgba(0,0,0,0.16) 4px)" } }),
    g ? (() => {
      const ws = TR.slice(g.ws, g.we + 1);
      const op = prog2(t, g.start, 0.12, E.p2out) * (1 - prog2(t, g.end - 0.1, 0.1, E.p2in));
      const size = cabe2(ws.map((w) => w.w.toUpperCase()), 88, W - 140 - 10, mede2, 0.03, 14);
      return /* @__PURE__ */ jsx26("div", { style: { position: "absolute", left: 0, right: 0, top: Y_CENTRO, transform: "translateY(-50%)", opacity: op, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-end", columnGap: 14, rowGap: 12, padding: "0 70px" }, children: ws.map((w, k) => {
        const wi = g.ws + k;
        let x = 0;
        let s = 0;
        for (const p of PLANOS[wi]) {
          if (t < p.t0) break;
          if (t < p.t0 + p.d1) {
            const a = (t - p.t0) / p.d1;
            x = mix(0, p.x, a);
            s = mix(0, p.s, a);
          } else {
            const b = prog2(t, p.t0 + p.d1, p.d2, E.p3out);
            x = mix(p.x, 0, b);
            s = mix(p.s, 0, b);
          }
        }
        const sh = s > 0.05 ? `${s.toFixed(1)}px 0 #ff003c, -${s.toFixed(1)}px 0 #00e5ff, ${BASE_SH}` : BASE_SH;
        return /* @__PURE__ */ jsx26("span", { style: { display: "inline-block", fontFamily: fontFamily21, fontWeight: 700, fontSize: size, letterSpacing: "0.03em", lineHeight: 0.96, color: "#fff", textShadow: sh, transform: `translateX(${x}px)` }, children: w.w.toUpperCase() }, k);
      }) });
    })() : null
  ] });
};

// packages/legendas-euriliana/src/estilos/b/highlight.tsx
import { useCurrentFrame as useCurrentFrame27 } from "remotion";
import { loadFont as loadFont24 } from "@remotion/google-fonts/Montserrat";
import { PLANO as PLANO3 } from "./contexto";
import { jsx as jsx27, jsxs as jsxs12 } from "react/jsx-runtime";
var { fontFamily: fontFamily22 } = loadFont24("normal", { weights: ["800"], subsets: ["latin", "latin-ext"] });
var GS7 = grupos((lastEnd, next) => Math.min(lastEnd + 0.5, next - 0.05));
var COR_PLANO = PLANO3.legenda?.cor_destaque;
var rgbDe = (c2) => {
  const h = c2.trim().replace("#", "");
  const x = h.length === 3 ? h.split("").map((v) => v + v).join("") : h;
  return /^[0-9a-f]{6}$/i.test(x) ? [0, 2, 4].map((o) => parseInt(x.slice(o, o + 2), 16)) : null;
};
var TARJA = (() => {
  const rgb2 = COR_PLANO ? rgbDe(COR_PLANO) : null;
  if (!rgb2) return { fundo: "linear-gradient(135deg, #ff1745 0%, #df1238 100%)", sombra: "0 12px 30px rgba(229,20,58,0.32)" };
  const esc = rgb2.map((v) => Math.round(v * 0.88));
  return { fundo: `linear-gradient(135deg, rgb(${rgb2.join(",")}) 0%, rgb(${esc.join(",")}) 100%)`, sombra: `0 12px 30px rgba(${rgb2.join(",")},0.32)` };
})();
var Highlight = () => {
  const t = useCurrentFrame27() / FPS;
  const mede2 = useMede(800, fontFamily22);
  if (!mede2) return null;
  const gi = grupoEm(GS7, t);
  if (gi < 0) return null;
  const g = GS7[gi];
  const op = prog2(t, g.start, 0.12, E.p2out) * (1 - prog2(t, g.end - 0.1, 0.1, E.p2in));
  const size = cabe2(g.ws.map((w) => w.w.toUpperCase()), 80, W - 140 - 10, mede2, 0.02, 8, 24);
  return /* @__PURE__ */ jsx27("div", { style: { position: "absolute", left: 0, right: 0, top: Y_CENTRO, transform: "translateY(-50%)", opacity: op, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-end", gap: 8, padding: "0 70px" }, children: g.ws.map((w, k) => {
    let bo = 0;
    let bs = 0;
    if (t >= w.t0 && t < w.t1) {
      const a = prog2(t, w.t0, 0.15, E.p2out);
      bo = a;
      bs = a;
    } else if (t >= w.t1 && t < w.t1 + 0.1) {
      const b = prog2(t, w.t1, 0.1, E.p2in);
      const a0 = prog2(w.t1, w.t0, 0.15, E.p2out);
      bo = mix(a0, 0, b);
      bs = mix(a0, 1.02, b);
    }
    const br = t >= w.t0 && t < w.t0 + 0.24 ? t < w.t0 + 0.08 ? mix(1, 1.05, prog2(t, w.t0, 0.08, E.p2out)) : mix(1.05, 1, prog2(t, w.t0 + 0.08, 0.16, E.p2out)) : 1;
    return /* @__PURE__ */ jsxs12("span", { style: { display: "inline-block", position: "relative", padding: "6px 12px 8px", fontFamily: fontFamily22, fontWeight: 800, fontSize: size, letterSpacing: "0.02em", lineHeight: 1, color: "#fff", textShadow: "0 6px 18px rgba(0,0,0,0.45)", transformOrigin: "50% 58%", filter: `brightness(${br})` }, children: [
      /* @__PURE__ */ jsx27("span", { style: { position: "absolute", inset: 0, background: TARJA.fundo, borderRadius: 10, boxShadow: TARJA.sombra, opacity: bo, transform: `scaleX(${bs})`, transformOrigin: "0% 50%" } }),
      /* @__PURE__ */ jsx27("span", { style: { position: "relative" }, children: w.w.toUpperCase() })
    ] }, k);
  }) });
};

// packages/legendas-euriliana/src/estilos/b/gradient-fill.tsx
import { useCurrentFrame as useCurrentFrame28 } from "remotion";
import { loadFont as loadFont25 } from "@remotion/google-fonts/Montserrat";
import { jsx as jsx28 } from "react/jsx-runtime";
var { fontFamily: fontFamily23 } = loadFont25("normal", { weights: ["900"], subsets: ["latin", "latin-ext"] });
var GS8 = grupos((lastEnd, next, last) => last ? lastEnd + 0.5 : Math.min(next, lastEnd + SEGURA));
var GRAD = "linear-gradient(90deg, #fe9f1b 0%, #f76e49 10%, #ff2063 20%, #fd56cb 30%, #ef7aff 40%, #fe9f1b 50%, white 50.5%, white 100%)";
var GradientFill = () => {
  const t = useCurrentFrame28() / FPS;
  const mede2 = useMede(900, fontFamily23);
  if (!mede2) return null;
  const gi = grupoEm(GS8, t);
  if (gi < 0) return null;
  const g = GS8[gi];
  const gap = g.end - g.lastEnd;
  const fadeDur = Math.min(0.25, gap * 0.8);
  const op = 1 - prog2(t, g.end - fadeDur, fadeDur, E.p1out);
  const size = cabe2(g.ws.map((w) => w.w), 100, W - 120 - 10, mede2, 0.04);
  return /* @__PURE__ */ jsx28("div", { style: { position: "absolute", left: 0, right: 0, top: Y_CENTRO, transform: "translateY(-50%)", opacity: op, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-end", columnGap: 24, rowGap: 0, padding: "0 60px" }, children: g.ws.map((w, k) => {
    const ativo = t >= w.t0 && t < w.t1;
    const pos = ativo ? mix(45, 0, (t - w.t0) / (w.t1 - w.t0)) : 100;
    const s = t < w.t0 ? 1 : ativo ? 1.04 : mix(1.04, 1, prog2(t, w.t1, 0.15, E.p2out));
    return /* @__PURE__ */ jsx28("span", { style: { display: "inline-block", fontFamily: fontFamily23, fontWeight: 900, fontSize: size, letterSpacing: "0.04em", lineHeight: 1.15, paddingBottom: "0.05em", backgroundImage: GRAD, backgroundSize: "350% 100%", backgroundPosition: `${pos}% 0`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent", transform: `scale(${s})` }, children: w.w }, k);
  }) });
};

// packages/legendas-euriliana/src/estilos/a/pill-karaoke.tsx
import { useCurrentFrame as useCurrentFrame29 } from "remotion";
import { loadFont as loadFont26 } from "@remotion/google-fonts/Poppins";
import { jsx as jsx29 } from "react/jsx-runtime";
var { fontFamily: fontFamily24, waitUntilDone: waitUntilDone7 } = loadFont26("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
var PILL_MAX = W - 120;
var PAD_MIN = 30;
var PAD_MAX = 60;
var SAFETY2 = 1.18;
var BASE4 = 72;
var MIN_FS = 52;
var GAP = 16;
var END_BUFFER = 0.3;
var INATIVO2 = "#A6A6A6";
var ATIVO = "#1C1E1D";
var larg2 = (txt, fs2) => mede(txt, `700 ${fs2}px "${fontFamily24}"`) * SAFETY2;
var largLinha = (ws, fs2) => ws.reduce((s, w, i) => s + larg2(w.w.toLowerCase(), fs2) + (i ? GAP : 0), 0);
var divide = (ws, fs2) => {
  const max = PILL_MAX - PAD_MIN * 2;
  if (ws.some((w) => larg2(w.w.toLowerCase(), fs2) > max)) return null;
  if (largLinha(ws, fs2) <= max) return [ws];
  let best = null;
  let bestImb = Infinity;
  for (let k = 1; k < ws.length; k++) {
    const a = ws.slice(0, k);
    const b = ws.slice(k);
    const wa = largLinha(a, fs2);
    const wb = largLinha(b, fs2);
    if (wa <= max && wb <= max && Math.abs(wa - wb) < bestImb) {
      best = [a, b];
      bestImb = Math.abs(wa - wb);
    }
  }
  return best;
};
var GRUPOS3 = blocos(PALAVRAS, 4, 40);
var PillKaraoke = () => {
  const pronto = useFontes([waitUntilDone7]);
  const t = useCurrentFrame29() / FPS;
  if (!pronto) return null;
  const gi = GRUPOS3.findIndex((g2, i) => {
    const prox = GRUPOS3[i + 1];
    const fim = prox ? Math.min(prox[0].t0, g2[g2.length - 1].t1 + END_BUFFER) : Math.min(TOTAL, g2[g2.length - 1].t1 + SEGURA);
    return t >= g2[0].t0 && t < Math.max(g2[0].t0 + 0.01, fim);
  });
  if (gi < 0) return null;
  const g = GRUPOS3[gi];
  let fs2 = BASE4;
  while (fs2 > MIN_FS && !divide(g, fs2)) fs2 -= 2;
  const linhas = divide(g, fs2) || [g];
  const maior = Math.max(...linhas.map((l) => largLinha(l, fs2)));
  const padX = Math.max(PAD_MIN, Math.min(PAD_MAX, Math.floor((PILL_MAX - maior) / 2)));
  const pillW = Math.min(PILL_MAX, Math.ceil(maior + padX * 2));
  const vs = g[0].t0;
  return /* @__PURE__ */ jsx29("div", { style: { position: "absolute", left: 0, width: W, top: Y_CENTRO - 110, height: 220, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx29("div", { style: { width: pillW, padding: `18px ${padX}px 20px`, boxSizing: "border-box", borderRadius: 22, background: "#e7e5e7", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", textAlign: "center" }, children: /* @__PURE__ */ jsx29("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", fontFamily: fontFamily24, fontSize: fs2, fontWeight: 700, lineHeight: 1.16, letterSpacing: 0, whiteSpace: "nowrap" }, children: linhas.slice(0, 2).map((l, li) => /* @__PURE__ */ jsx29("div", { style: { display: "flex", justifyContent: "center", gap: GAP, width: "100%", lineHeight: 1.16, whiteSpace: "nowrap" }, children: l.map((w) => {
    const primeira = w === g[0];
    const ini = Math.max(vs, w.t0 - 0.05);
    const cor = primeira ? ATIVO : mixCor(INATIVO2, ATIVO, prog(t, ini, 0.1));
    return /* @__PURE__ */ jsx29("span", { style: { display: "inline-block", color: cor }, children: w.w.toLowerCase() }, w.t0);
  }) }, li)) }) }) });
};

// packages/legendas-euriliana/src/estilos/d/glow-emoji.tsx
import { useCurrentFrame as useCurrentFrame30 } from "remotion";
import { loadFont as loadFont27 } from "@remotion/google-fonts/Montserrat";
import { PLANO as PLANO4 } from "./contexto";

// packages/legendas-euriliana/src/estilos/d/emojis-auto.ts
var GE_VARIEDADE = 20;
var GE_MIN_PALAVRAS = 3;
var GE_VIS_MIN = 0.25;
var geNormalizar = (w) => String(w ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
var GE_LIGACAO = new Set("a o as os um uma uns umas de do da dos das em no na nos nas por pelo pela pelos pelas para pra com sem sob sobre entre ate e ou mas porque que se como quando onde mais menos muito muita muitos muitas pouco ja ainda tambem so apenas nao sim eu tu ele ela voce voces eles elas me te lhe meu minha seu sua nosso nossa isso isto esse essa este esta aquilo aquele aquela aqui ali la ser sou eh era foi sao ta tava estao estou tem tinha teve ha ter vai vou vamos va ir fazer faz fez pode poder deve dever tudo todo toda todos todas cada outro outra mesmo mesma entao depois antes agora hoje ontem sempre nunca".split(" "));
var GE_DICIONARIO = [
  // emoções e estados
  ["amor amo amar amei amou amando paixao apaixonado apaixonada", "❤️", 3],
  ["coracao coracoes", "❤️", 3],
  ["medo medos assustado assustada assusta assustou susto", "😱", 3],
  ["raiva odio bravo brava irritado irritada", "😡", 3],
  ["feliz felizes felicidade alegria alegre", "😄", 3],
  ["triste tristeza", "😢", 3],
  ["choro chorar chorou chorando", "😭", 3],
  ["rir riu risada risadas riso gargalhada", "😂", 3],
  ["surpresa surpreso chocado chocada", "😮", 3],
  ["sono dormir dormi dormiu dormia dormindo", "😴", 3],
  ["cansado cansada cansaco exausto exausta", "😩", 3],
  ["vergonha", "😳", 3],
  ["ansiedade ansioso ansiosa nervoso nervosa", "😰", 3],
  ["sorte", "🍀", 3],
  ["sonho sonhos sonhar sonhei", "💭", 2],
  ["pensar pensei pensou pensamento pensamentos duvida duvidas", "🤔", 2],
  ["festa festas comemorar comemorou celebrar celebrou parabens", "🎉", 3],
  // números e valores
  ["zero", "0️⃣", 3],
  ["dois duas", "2️⃣", 3],
  ["tres", "3️⃣", 3],
  ["quatro", "4️⃣", 3],
  ["cinco", "5️⃣", 3],
  ["seis", "6️⃣", 3],
  ["sete", "7️⃣", 3],
  ["oito", "8️⃣", 3],
  ["nove", "9️⃣", 3],
  ["dez", "🔟", 3],
  ["cem", "💯", 3],
  ["reais dolares dolar euros", "💵", 3],
  // dinheiro e negócio
  ["dinheiro grana lucro lucros lucrar faturamento faturar faturei faturou rico rica riqueza salario salarios renda", "💰", 3],
  ["venda vendas vender vendi vendeu vende vendem vendedor vendedora", "💸", 2],
  ["cliente clientes parceria parcerias parceiro parceiros", "🤝", 2],
  ["comprar compro comprei comprou compra compras carrinho", "🛒", 2],
  ["pagar paguei pagou pagamento pagamentos cartao cartoes pix", "💳", 2],
  ["oferta ofertas promocao promocoes desconto descontos barato barata preco precos", "🏷️", 2],
  ["gratis gratuito gratuita", "🆓", 2],
  ["loja lojas", "🏪", 3],
  ["empresa empresas", "🏢", 3],
  ["negocio negocios trabalho trabalhos emprego", "💼", 1.2],
  ["entrega entregas pacote pacotes enviar enviei enviou", "📦", 2],
  ["presente presentes brinde brindes bonus", "🎁", 3],
  ["lancamento lancamentos lancar lancei lancou lancando decolar decolou", "🚀", 2],
  ["marketing anuncio anuncios propaganda publicidade", "📣", 2],
  ["meta metas objetivo objetivos alvo alvos foco", "🎯", 2],
  // objetos e lugares
  ["celular celulares smartphone telefone telefones app apps aplicativo aplicativos", "📱", 3],
  ["digital", "📱", 2],
  ["computador computadores notebook laptop", "💻", 3],
  ["tecnologia", "💻", 2],
  ["camera cameras filmar filmei filmou video videos", "🎥", 3],
  ["gravar gravei gravou gravacao gravacoes", "🎥", 2],
  ["foto fotos", "📸", 3],
  ["microfone microfones podcast", "🎙️", 3],
  ["livro livros ebook ebooks", "📚", 3],
  ["curso cursos aula aulas estudar estudei estudou estudo aprender aprendi aprendeu aprendizado", "🎓", 2],
  ["casa casas lar", "🏠", 3],
  ["carro carros", "🚗", 3],
  ["aviao avioes voar voei voou voo viagem viagens viajar viajei viajou", "✈️", 3],
  ["foguete foguetes", "🚀", 3],
  ["relogio relogios", "⏰", 3],
  ["hora horas", "⏰", 2],
  ["tempo", "⏰", 1.2],
  ["calendario agenda prazo prazos", "📅", 2],
  ["email emails", "📧", 3],
  ["mensagem mensagens whatsapp zap chat conversa conversas", "💬", 3],
  ["chave chaves senha senhas", "🔑", 3],
  ["cadeado cadeados seguranca proteger protecao", "🔒", 2],
  ["bomba bombas explosao explodir explodiu impacto quebrar quebrei quebrou", "💥", 2],
  ["fogo queimar queimou", "🔥", 3],
  ["agua", "💧", 3],
  ["mundo planeta", "🌎", 2],
  ["sol", "☀️", 3],
  ["chuva", "🌧️", 3],
  ["lua", "🌙", 3],
  ["estrela estrelas", "⭐", 3],
  ["comida comer comi comeu fome almoco jantar", "🍽️", 3],
  ["cafe", "☕", 3],
  ["pizza", "🍕", 3],
  ["remedio remedios", "💊", 3],
  ["hospital", "🏥", 3],
  ["escola", "🏫", 3],
  ["ideia ideias", "💡", 2],
  ["grafico graficos crescer cresci cresceu cresce crescimento crescendo aumentar aumentou aumento", "📈", 2],
  ["cair caiu queda quedas perder perdi perdeu perdendo", "📉", 2],
  ["trofeu trofeus vencer venci venceu vitoria vitorias ganhar ganhei ganhou ganha campeao campea", "🏆", 2],
  ["medalha medalhas", "🏅", 3],
  ["coroa rei rainha", "👑", 3],
  ["diamante diamantes", "💎", 3],
  ["lupa pesquisar pesquisei pesquisou pesquisa buscar busquei busca procurar procurei", "🔍", 2],
  ["ferramenta ferramentas", "🛠️", 3],
  ["construir construi construiu construcao", "🏗️", 2],
  ["internet site sites online link links", "🌐", 3],
  ["youtube", "▶️", 3],
  ["texto textos escrever escrevi escreveu", "✍️", 2],
  ["ler li leu leitura", "📖", 2],
  // pessoas, corpo e ideias
  ["forca forte fortes fortalecer musculo musculos", "💪", 3],
  ["energia raio", "⚡", 2],
  ["gente pessoas pessoa publico audiencia comunidade equipe time seguidores multidao", "👥", 1.2],
  ["familia familias filho filha filhos filhas", "👨‍👩‍👧‍👦", 3],
  ["bebe bebes", "👶", 3],
  ["cerebro inteligencia", "🧠", 3],
  ["ia ias robo robos", "🤖", 3],
  ["olho olhos olhar olhei olhou", "👀", 3],
  ["ouvir ouvi ouviu escutar escutei ouvido", "👂", 3],
  ["mao maos", "✋", 3],
  ["segredo segredos secreto secreta escondido escondida", "🤫", 3],
  ["pergunta perguntas perguntar perguntei", "❓", 2],
  ["alerta alertas atencao cuidado perigo perigoso problema problemas risco riscos", "⚠️", 2],
  ["erro erros errado errada errar errei falha falhas falhar", "❌", 2],
  ["aprovado aprovada", "✅", 2],
  ["parar pare parou", "🛑", 2],
  ["proibido proibida", "🚫", 2],
  ["novidade novidades", "🆕", 2],
  ["brilho brilhar brilhou", "✨", 2],
  ["correr corri correu correndo corrida", "🏃", 2],
  ["treino treinos treinar treinei treinou academia malhar malhei", "🏋️", 2],
  ["luta lutar lutei lutou batalha", "🥊", 2],
  ["futebol bola gol", "⚽", 3],
  ["musica musicas cantar cantei cantou som", "🎵", 3],
  ["tigre", "🐯", 3],
  ["leao", "🦁", 3],
  ["aguia", "🦅", 3],
  ["cachorro", "🐶", 3],
  ["gato", "🐱", 3],
  ["tubarao", "🦈", 3],
  ["fantasma", "👻", 3],
  // fé
  ["deus oracao oracoes orar orei rezar gratidao agradecer obrigado obrigada", "🙏", 2],
  ["jesus cristo cruz", "✝️", 3],
  ["biblia", "📖", 3],
  ["igreja", "⛪", 3],
  ["paz", "🕊️", 2]
];
var GE_MAPA = /* @__PURE__ */ new Map();
GE_DICIONARIO.forEach(([ps, emoji, carga]) => ps.split(" ").forEach((p) => GE_MAPA.set(p, { emoji, carga })));
var GE_TAMANHO_DICIONARIO = GE_MAPA.size;
var gePlural = (n) => {
  const f = [];
  if (n.length > 3 && n.endsWith("oes")) f.push(n.slice(0, -3) + "ao");
  if (n.length > 3 && n.endsWith("aes")) f.push(n.slice(0, -3) + "ao");
  if (n.length > 3 && n.endsWith("es")) f.push(n.slice(0, -2));
  if (n.length > 2 && n.endsWith("s")) f.push(n.slice(0, -1));
  return f;
};
var geFormas = (n) => {
  const f = [n, ...gePlural(n)];
  if (n.length > 3 && n.endsWith("a")) f.push(n.slice(0, -1) + "o");
  if (n.length > 3 && n.endsWith("as")) f.push(n.slice(0, -2) + "o");
  return f;
};
var geBusca = (n) => {
  for (const f of geFormas(n)) {
    const a = GE_MAPA.get(f);
    if (a) return a;
  }
  return void 0;
};
var escolherEmojis = (ps, o) => {
  const expl = /* @__PURE__ */ new Map();
  const chaves = [];
  const naoCasaram = [];
  Object.entries(o.explicitos).forEach(([k, v]) => {
    if (!v || typeof v !== "string") return;
    if (/\s/.test(k.trim())) {
      naoCasaram.push(`${k} (vale uma palavra só)`);
      return;
    }
    const n = geNormalizar(k);
    if (!n) return;
    chaves.push({ orig: k, usada: false });
    [n, ...gePlural(n)].forEach((f) => {
      if (!expl.has(f)) expl.set(f, { emoji: v, chave: chaves.length - 1 });
    });
  });
  const cands = [];
  const descartados = [];
  let pos = -1;
  ps.forEach((p, i) => {
    const n = geNormalizar(p.w);
    if (!n) return;
    pos++;
    let emoji;
    let base2 = 0;
    let explicito = false;
    for (const f of geFormas(n)) {
      const e = expl.get(f);
      if (e) {
        emoji = e.emoji;
        explicito = true;
        base2 = 100;
        chaves[e.chave].usada = true;
        break;
      }
    }
    if (!emoji && o.auto && !GE_LIGACAO.has(n)) {
      const a = geBusca(n);
      if (a) {
        emoji = a.emoji;
        base2 = a.carga;
      }
    }
    if (!emoji) return;
    if (p.vis !== void 0 && p.vis < GE_VIS_MIN) {
      descartados.push({ i, w: p.w, emoji, motivo: `a palavra fica menos de ${GE_VIS_MIN} s na tela (o emoji piscaria)`, explicito });
      return;
    }
    const prox = ps[i + 1];
    let score = base2;
    if (o.enfase?.has(n)) score += 2;
    if (/[.,!?;:…]$/.test(String(p.w).trim()) || prox && prox.t0 - p.t1 > 0.3) score += 0.2;
    if (n.length >= 6) score += 0.1;
    cands.push({ i, w: p.w, emoji, score, t0: p.t0, explicito, pos });
  });
  chaves.forEach((c2) => {
    if (!c2.usada) naoCasaram.push(c2.orig);
  });
  cands.sort(o.auto ? (a, b) => b.score - a.score || a.t0 - b.t0 : (a, b) => a.t0 - b.t0);
  const aceitos = [];
  for (const c2 of cands) {
    const perto = aceitos.find((a) => Math.abs(a.t0 - c2.t0) < o.gap || Math.abs(a.pos - c2.pos) < GE_MIN_PALAVRAS);
    const igual = aceitos.find((a) => a.emoji === c2.emoji && Math.abs(a.t0 - c2.t0) < GE_VARIEDADE);
    if (perto || igual) {
      descartados.push({ i: c2.i, w: c2.w, emoji: c2.emoji, motivo: perto ? `perto demais de "${perto.w}" (menos de ${o.gap} s ou ${GE_MIN_PALAVRAS} palavras)` : `${c2.emoji} já apareceu em "${igual.w}" há menos de ${GE_VARIEDADE} s`, explicito: c2.explicito });
      continue;
    }
    aceitos.push(c2);
  }
  return { emojis: new Map(aceitos.map((a) => [a.i, a.emoji])), descartados, naoCasaram };
};

// packages/legendas-euriliana/src/estilos/d/glow-emoji.tsx
import { Fragment as Fragment8, jsx as jsx30, jsxs as jsxs13 } from "react/jsx-runtime";
var { fontFamily: fontFamily25, waitUntilDone: waitUntilDone8 } = loadFont27("normal", { weights: ["800"], subsets: ["latin", "latin-ext"] });
var GE_FONTE_EMOJI = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
var GE_FILTRO = "glow-emoji-h";
var GE_PLANO = PLANO4.legenda ?? {};
var GE_K = (VERTICAL2 ? W : 0.75 * H) / 1080;
var geNum = (v, padrao) => {
  const n = typeof v === "string" && v.trim() !== "" ? Number(v) : v;
  return typeof n === "number" && Number.isFinite(n) ? n : padrao;
};
var GE_EMOJI_LADO = geNum(GE_PLANO.emoji_tamanho, 120) * GE_K;
var GE_EMOJI_FOLGA = geNum(GE_PLANO.emoji_folga, 12) * GE_K;
var GE_NIVEIS = /* @__PURE__ */ new Map([["baixa", 7], ["media", 4], ["alta", 2.5]]);
var GE_SEM_EMOJI = /* @__PURE__ */ new Set(["nenhuma", "nenhum", "sem", "zero", "off", "false"]);
var geDens = GE_PLANO.emoji_densidade ?? GE_PLANO.emojiDensidade;
var geDensNum = geNum(geDens, -1);
var geDensNome = geNormalizar(String(geDens ?? "media"));
var GE_DESLIGADO = geDens === false || GE_SEM_EMOJI.has(geDensNome);
var GE_GAP = geDensNum >= 0 ? geDensNum : GE_NIVEIS.get(geDensNome) ?? 4;
if (geDens !== void 0 && !GE_DESLIGADO && geDensNum < 0 && !GE_NIVEIS.has(geDensNome)) console.warn(`glow-emoji: emoji_densidade desconhecida (${geDens}); use baixa, media, alta, nenhuma ou um número de segundos. Ficou media.`);
var GE_ALTURA = 600 * GE_K;
var GE_MAX_W = 0.88 * (VERTICAL2 ? W : 0.75 * H);
var GE_SOMBRA = [[12, 1], [36, 0.85], [90, 0.6]].map(([r, a]) => `0 0 ${r * GE_K}px rgba(255,255,255,${a})`).join(", ");
var GE_CAPS = 0.7;
var GE_ACENTO = 0.22;
var GE_TEM_ACENTO = /[ÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜ]/;
var geTexto = (w) => String(w ?? "").normalize("NFC").replace(/^[^\p{L}\p{N}$]+/u, "").replace(/[^\p{L}\p{N}%]+$/u, "").trim().toUpperCase();
var GE_NF = Math.ceil(TOTAL * FPS);
var GE_BRUTAS = PALAVRAS.map((p, i) => ({ i, p, txt: geTexto(p.w) })).filter((b) => b.txt);
var geAnterior = -Infinity;
var GE_ITENS = GE_BRUTAS.map((b, k) => {
  const f0 = Math.max(Math.round(b.p.t0 * FPS), geAnterior + 2);
  geAnterior = f0;
  return { k, i: b.i, txt: b.txt, f0, f1: 0 };
});
GE_ITENS.forEach((it, k) => {
  const prox = GE_ITENS[k + 1] ? GE_ITENS[k + 1].f0 : GE_NF;
  it.f1 = Math.max(it.f0 + 1, Math.min(prox, Math.round((GE_BRUTAS[k].p.t1 + SEGURA) * FPS), GE_NF));
});
var geCache = null;
var geEmojis = () => {
  if (geCache) return geCache;
  if (GE_DESLIGADO) return geCache = /* @__PURE__ */ new Map();
  const explicitos = {};
  Object.entries(GE_PLANO.emojis ?? {}).forEach(([k, v]) => {
    if (typeof v === "string" && v) explicitos[k] = v;
  });
  const enfase = temEnfaseNoPlano ? new Set([...ENFASE_DO_PLANO].map(geNormalizar)) : null;
  const r = escolherEmojis(
    GE_BRUTAS.map((b, k) => ({ w: b.p.w, t0: b.p.t0, t1: b.p.t1, vis: (GE_ITENS[k].f1 - GE_ITENS[k].f0) / FPS })),
    { explicitos, enfase, gap: GE_GAP, auto: Object.keys(explicitos).length === 0 }
  );
  r.descartados.filter((d) => d.explicito).forEach((d) => console.warn(`glow-emoji: o emoji ${d.emoji} de "${d.w}" ficou de fora: ${d.motivo} (legenda.emoji_densidade muda isso)`));
  r.naoCasaram.forEach((c2) => console.warn(`glow-emoji: "${c2}" em legenda.emojis não casou com nenhuma palavra da fala`));
  console.warn(`glow-emoji: emojis escolhidos (${Object.keys(explicitos).length ? "lista do plano" : "automático"}): ${[...r.emojis.entries()].map(([k, e]) => `${GE_BRUTAS[k].txt}${e}@${GE_BRUTAS[k].p.t0.toFixed(1)}s`).join(" ") || "nenhum"}`);
  return geCache = r.emojis;
};
var geEfeito = (it, f) => {
  const dur = it.f1 - it.f0;
  const desde = f - it.f0;
  const ate = it.f1 - 1 - f;
  const lado = it.i % 2 === 0 ? -1 : 1;
  if (dur >= 4 && desde === 0) return { sx: 28, dx: 0, op: 0.85 };
  if (dur >= 4 && ate === 0) return { sx: 30, dx: lado * 22, op: 0.85 };
  if (dur >= 9 && desde === 1 || dur < 4 && desde === 0) return { sx: 9, dx: 0, op: 1 };
  if (dur >= 9 && ate === 1) return { sx: 15, dx: lado * 10, op: 1 };
  return { sx: 0, dx: 0, op: 1 };
};
var GE_BASE = 0;
var geTamanho = (t) => {
  if (!GE_BASE) GE_BASE = Math.round(100 * 0.58 * (VERTICAL2 ? W : 0.75 * H) / mede("DAUGHTER", `800 100px "${fontFamily25}"`));
  return cabe(t, GE_BASE, "800", fontFamily25, GE_MAX_W, "", 0, 0.3);
};
var GlowEmoji = () => {
  const pronto = useFontes([waitUntilDone8]);
  const f = useCurrentFrame30();
  if (!pronto) return null;
  let it;
  for (const x of GE_ITENS) if (f >= x.f0 && f < x.f1) it = x;
  if (!it) return null;
  const emoji = geEmojis().get(it.k);
  const { sx, dx, op } = geEfeito(it, f);
  const fs2 = geTamanho(it.txt);
  const topoLetras = Y_CENTRO - fs2 * (GE_CAPS / 2 + (GE_TEM_ACENTO.test(it.txt) ? GE_ACENTO : 0));
  const caixaEmoji = { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: GE_FONTE_EMOJI, fontSize: GE_EMOJI_LADO * 0.86, lineHeight: 1 };
  return /* @__PURE__ */ jsxs13(Fragment8, { children: [
    /* @__PURE__ */ jsx30("svg", { width: 0, height: 0, style: { position: "absolute" }, "aria-hidden": true, children: /* @__PURE__ */ jsx30("filter", { id: GE_FILTRO, x: "-15%", y: "-15%", width: "130%", height: "130%", colorInterpolationFilters: "sRGB", children: /* @__PURE__ */ jsx30("feGaussianBlur", { in: "SourceGraphic", stdDeviation: `${sx * GE_K} 0` }) }) }),
    /* @__PURE__ */ jsx30("div", { style: { position: "absolute", left: 0, width: W, top: Y_CENTRO - GE_ALTURA / 2, height: GE_ALTURA, display: "flex", alignItems: "center", justifyContent: "center", opacity: op, transform: dx ? `translateX(${dx * GE_K}px)` : void 0, filter: sx ? `url(#${GE_FILTRO})` : void 0 }, children: /* @__PURE__ */ jsx30("div", { style: { fontFamily: fontFamily25, fontWeight: 800, fontSize: fs2, lineHeight: 1, color: "#FFFFFF", whiteSpace: "nowrap", textShadow: GE_SOMBRA }, children: it.txt }) }),
    emoji ? /* @__PURE__ */ jsxs13("div", { style: { position: "absolute", left: (W - GE_EMOJI_LADO) / 2, top: topoLetras - GE_EMOJI_FOLGA - GE_EMOJI_LADO, width: GE_EMOJI_LADO, height: GE_EMOJI_LADO, opacity: op }, children: [
      /* @__PURE__ */ jsx30("div", { style: { ...caixaEmoji, filter: `blur(${12 * GE_K}px)`, opacity: 0.7 }, children: emoji }),
      /* @__PURE__ */ jsx30("div", { style: caixaEmoji, children: emoji })
    ] }) : null
  ] });
};

// packages/legendas-euriliana/src/index.ts
var COMPONENTES = {
  "pilula-cinza": PillKaraoke,
  // 44 · HyperFrames caption-pill-karaoke (voltou em 04/10: o Euriler aprovou na revisão)
  emoji: CapBounceEmoji,
  // 22 · captioneer Bounce + emojis (refeito em 04/10: pulo menor, até 3 emojis centralizados)
  maquina: CapTypewriter,
  // 25 · captioneer Typewriter
  onda: CapWave,
  // 27 · captioneer Wave
  brilho: CapGlow,
  // 28 · captioneer Glow (uma das preferidas do Euriler)
  "digita-apaga": CapTypewriterErase,
  // 29 · captioneer TypewriterErase
  pisca: CapFlicker,
  // 31 · captioneer Flicker (aposta para gancho)
  "marca-texto": CapHighlighter,
  // 32 · captioneer Highlighter
  desfoque: CapBlur,
  // 33 · captioneer Blur
  "arco-iris": CapRainbow,
  // 34 · captioneer Rainbow
  holofote: CapSpotlight,
  // 36 · captioneer Spotlight
  cortina: ClipWipe,
  // 37 · HyperFrames caption-clip-wipe (Apache-2.0)
  // portes dos estilos de legenda do HyperFrames (Apache-2.0), aprovados na vitrine em 04/10
  editorial: EditorialEmphasis,
  // 38 · editorial-emphasis (palavra de ênfase em serifa itálica gigante)
  inverte: BlendDifference,
  // 39 · blend-difference (letra inverte o vídeo atrás)
  impacto: KineticSlam,
  // 40 · kinetic-slam (uma palavra por vez, gigante)
  "emoji-pop": EmojiPop,
  // 41 · emoji-pop (emoji 1,6x maior que o original)
  camadas: ParallaxLayers,
  // 42 · parallax-layers (ênfase vermelha gigante atrás, frase na frente)
  lava: Texture,
  // 43 · texture (palavra recortada pela textura de lava)
  camera: CameraFollow,
  // 45 · camera-follow (a câmera recua a cada palavra)
  particulas: ParticleBurst,
  // 46 · particle-burst
  peso: WeightShift,
  // 47 · weight-shift
  "neon-forte": NeonGlow,
  // 48 · neon-glow
  matrix: MatrixDecode,
  // 49 · matrix-decode
  acento: NeonAccent,
  // 50 · neon-accent
  "acento-emoji": NeonAccentEmoji,
  // 50b · neon-accent + fila de até 3 emojis grandes acima
  glitch: GlitchRgb,
  // 51 · glitch-rgb
  tarja: Highlight,
  // 52 · highlight (cor da tarja: legenda.cor_destaque)
  degrade: GradientFill,
  // 53 · gradient-fill
  "glow-emoji": GlowEmoji
  // 54 · feito na casa a partir do reel Db7dEmsoOzM (12/10): uma palavra com glow branco, borrão horizontal e emoji em cima
};
export {
  COMPONENTES
};
