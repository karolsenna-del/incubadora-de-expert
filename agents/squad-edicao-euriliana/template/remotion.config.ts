import {Config} from '@remotion/cli/config';
import {VERSION} from 'remotion';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
// Navegador de renderizar baixado uma vez para todos os vídeos (o Auroq OS deixa pronto em segundo plano, na pasta da
// versão do Remotion). Sem ele, o Remotion baixa o dele dentro deste projeto, como sempre (~90 MB no primeiro render).
const plataforma = process.platform === 'win32' ? 'win64'
  : process.platform === 'darwin' ? (os.arch() === 'arm64' ? 'mac-arm64' : 'mac-x64')
  : (os.arch() === 'arm64' ? 'linux-arm64' : 'linux64');
const navegador = path.join(os.homedir(), '.cache', 'edicao-euriliana', 'remotion-navegador', VERSION, 'chrome-headless-shell',
  plataforma, `chrome-headless-shell-${plataforma}`,
  plataforma === 'win64' ? 'chrome-headless-shell.exe' : plataforma === 'linux-arm64' ? 'headless_shell' : 'chrome-headless-shell');
if (fs.existsSync(navegador)) {
  Config.setBrowserExecutable(navegador);
}
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
// 8 renderizações em paralelo, ou o número de núcleos se a máquina tiver menos (notebook de 4 núcleos: com 8 fixo o
// Remotion recusa o render com "concurrency is set higher than the amount of CPU cores")
Config.setConcurrency(Math.min(8, os.cpus().length || 1));
Config.setPixelFormat('yuv420p');
Config.setColorSpace('bt709'); // sem isso sai yuvj420p (faixa cheia) e o portão de entrega reprova
