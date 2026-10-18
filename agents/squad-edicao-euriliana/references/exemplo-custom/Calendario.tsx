import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FT, FU, FX, T, useQuadro} from '../motor/contexto';
import {Cartao, Fundo, Pop} from '../motor/pecas';

// Calendário do mês com o dia do próximo encontro aceso e um selo que entra na fala
export const Calendario: React.FC<{mes: string; dia: number; vazios: number; dias: number; rodape: string; selo: {titulo: string; sub: string; em: any}}> = ({mes, dia, vazios, dias, rodape, selo}) => {
  const q = useQuadro();
  return (
    <AbsoluteFill><Fundo />
      <Pop at={2} de="baixo" style={{position: 'absolute', left: 110, right: 110, top: 80}}>
        <Cartao style={{padding: '34px 40px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22}}>
            <div style={{fontFamily: FU, fontWeight: 700, fontSize: 46, color: T.texto}}>Calendário</div>
            <div style={{fontFamily: FT, fontSize: 52, color: T.acento2, letterSpacing: 2}}>{mes}</div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10}}>
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((x, i) => <div key={i} style={{textAlign: 'center', fontFamily: FX, fontSize: 24, color: T.suave}}>{x}</div>)}
            {Array.from({length: vazios}, (_, i) => <div key={`v${i}`} />)}
            {Array.from({length: dias}, (_, i) => (
              <div key={i} style={{height: 70, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FU, fontWeight: 700, fontSize: 32, color: i + 1 === dia ? '#fff' : T.texto, background: i + 1 === dia ? T.acento : `${T.linha}88`, boxShadow: i + 1 === dia ? `0 0 30px ${T.acento}` : 'none'}}>{i + 1}</div>
            ))}
          </div>
          <div style={{marginTop: 22, fontFamily: FX, fontSize: 30, color: T.suave}}>{rodape}</div>
        </Cartao>
      </Pop>
      <Pop at={q(selo.em)} style={{position: 'absolute', left: 170, right: 170, top: 330}}>
        <div style={{borderRadius: 34, padding: '34px 30px', background: `linear-gradient(135deg, ${T.acento}, ${T.acento2})`, textAlign: 'center', boxShadow: `0 20px 70px ${T.acento}AA`, transform: 'rotate(-3deg)'}}>
          <div style={{fontFamily: FT, fontSize: 130, color: '#fff', lineHeight: 0.9}}>{selo.titulo}</div>
          <div style={{fontFamily: FU, fontWeight: 700, fontSize: 36, color: T.fundo, marginTop: 8}}>{selo.sub}</div>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
