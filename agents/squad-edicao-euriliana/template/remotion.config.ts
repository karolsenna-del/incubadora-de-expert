import {Config} from '@remotion/cli/config';
import os from 'node:os';
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
// 8 renderizações em paralelo, ou o número de núcleos se a máquina tiver menos (notebook de 4 núcleos: com 8 fixo o
// Remotion recusa o render com "concurrency is set higher than the amount of CPU cores")
Config.setConcurrency(Math.min(8, os.cpus().length || 1));
Config.setPixelFormat('yuv420p');
Config.setColorSpace('bt709'); // sem isso sai yuvj420p (faixa cheia) e o portão de entrega reprova
