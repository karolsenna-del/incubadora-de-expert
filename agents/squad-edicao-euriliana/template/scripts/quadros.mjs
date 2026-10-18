// Renderiza quadros soltos (para conferir as cenas antes do vídeo inteiro). Empacota uma vez só.
// Uso (de dentro de app/): node scripts/quadros.mjs <pasta_saida> <escala> <seg1> <seg2> ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [saida, escala, ...segs] = process.argv.slice(2);
fs.mkdirSync(saida, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public')});
const composition = await selectComposition({serveUrl, id: 'Edicao'});
for (const s of segs) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(parseFloat(s) * 30));
  const out = path.join(saida, `q_${parseFloat(s).toFixed(2).padStart(7, '0')}.jpg`);
  await renderStill({composition, serveUrl, output: out, frame, scale: parseFloat(escala), imageFormat: 'jpeg', jpegQuality: 85});
  console.log(out);
}
