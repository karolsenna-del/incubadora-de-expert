import {Composition, continueRender, delayRender, staticFile} from 'remotion';
import {loadFont as carregarArquivo} from '@remotion/fonts';
import {getAvailableFonts} from '@remotion/google-fonts';
import {Video} from './motor/Video';
import {DATA, FPS, H, PLANO, T, W} from './motor/contexto';
import {FONTES_LEGENDA} from './motor/legendas';

// Fontes do tema: nomes do Google Fonts (tema.fonte_titulo/texto/ui e legenda.fonte) ou arquivos locais (tema.fontes_locais)
const familias = Array.from(new Set([T.fonte_titulo, T.fonte_texto, T.fonte_ui, PLANO.legenda?.fonte, PLANO.headline?.fonte].filter(Boolean)));
const locais: {familia: string; arquivo: string; peso?: string}[] = PLANO.tema?.fontes_locais ?? [];
const espera = delayRender('carregando fontes do tema');
Promise.all([
  ...locais.map((l) => carregarArquivo({family: l.familia, url: staticFile(l.arquivo), weight: l.peso})),
  ...familias.filter((n) => !locais.some((l) => l.familia === n)).map(async (nome) => {
    const g = getAvailableFonts().find((x) => x.fontFamily === nome);
    if (!g) { console.warn(`fonte não achada no Google Fonts: ${nome}`); return; }
    const m: any = await g.load();
    m.loadFont('normal', {subsets: ['latin', 'latin-ext']});
  }),
  // fontes do estilo de legenda escolhido (só os pesos usados; itálico quando o estilo pede)
  ...FONTES_LEGENDA.filter((l) => !familias.includes(l.familia)).map(async (l) => {
    const g = getAvailableFonts().find((x) => x.fontFamily === l.familia);
    if (!g) { console.warn(`fonte não achada no Google Fonts: ${l.familia}`); return; }
    const m: any = await g.load();
    m.loadFont('normal', {weights: l.pesos, subsets: ['latin', 'latin-ext']});
    if (l.italico) m.loadFont('italic', {weights: l.pesos, subsets: ['latin', 'latin-ext']});
  }),
]).then(() => continueRender(espera)).catch((e) => { console.error(e); continueRender(espera); });

export const Root = () => (
  <Composition id="Edicao" component={Video} durationInFrames={Math.ceil((DATA.total + (PLANO.cauda ?? 0)) * FPS)} fps={FPS} width={W} height={H} />
);
