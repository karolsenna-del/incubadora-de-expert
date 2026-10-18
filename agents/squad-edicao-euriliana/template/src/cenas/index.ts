// Registro das cenas disponíveis no plano ("tipo"). Para cena nova sob medida use tipo "custom".
import React from 'react';
import {Citacao, Comparacao, Titulo} from './texto';
import {Filmada, Imagem, Palavras, Tela, Telefone, Video} from './midia';
import {Chat, Contato, Hiperespaco, Lista, Numero, Rede} from './graficos';
import {Escolha, Fala, Fluxo, Grafico, Ideia, Jornada, Pacote3, Prova} from './horizontal';
import {CartaoArcane, DestaquesArcane, VinhetaArcane} from './arcane';
import {CUSTOM} from '../custom';

const CENAS: Record<string, React.FC<any>> = {
  titulo: Titulo, citacao: Citacao, comparacao: Comparacao,
  imagem: Imagem, video: Video, palavras: Palavras, telefone: Telefone, tela: Tela, filmada: Filmada,
  chat: Chat, contato: Contato, lista: Lista, numero: Numero, rede: Rede, hiperespaco: Hiperespaco,
  // pensadas para o horizontal (visual do squad 3.0, feitas na casa) + a ponte para os pacotes originais do 3.0
  // padrão v2 dos depoimentos Arcane (aprovado em 07/10/2026): cartão de nome, destaques ao lado da pessoa e vinheta com o tigre
  cartao_arcane: CartaoArcane, destaques_arcane: DestaquesArcane, vinheta_arcane: VinhetaArcane,
  fala: Fala, ideia: Ideia, escolha: Escolha, grafico: Grafico, prova: Prova, fluxo: Fluxo, jornada: Jornada, pacote3: Pacote3,
};

export const REGISTRO = (tipo: string, props: any): React.FC<any> | null => {
  if (tipo === 'custom') {
    const c = CUSTOM[props?.componente];
    if (!c) throw new Error(`cena custom não registrada em src/custom/index.ts: ${props?.componente}`);
    return c;
  }
  const c = CENAS[tipo.toLowerCase()];
  if (!c) throw new Error(`tipo de cena desconhecido: ${tipo}. Tipos: ${Object.keys(CENAS).join(', ')}, custom`);
  return c;
};
