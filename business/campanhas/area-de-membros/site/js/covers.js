// Área de Membros — Capas de produto (arte própria, gerada em SVG — sem foto/IA externa)
// Motivo do estilo: os dois logos reais da Incubadora (rocket + arco) e do Expert360º (círculo partido)
// já usam arco/órbita como assinatura visual — as capas reaproveitam esse motivo em vez de inventar um novo.
// "intensidade" (1-7, ver js/data.js) controla quantos arcos aparecem — tier mais caro = composição mais funda.

function hashSlug(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

function gerarCapaSVG(oferta) {
  const seed = hashSlug(oferta.slug);
  const cx = 420 + (seed % 40); // centro das órbitas fora do canvas (canto superior direito)
  const cy = -20 - (seed % 30);
  const n = oferta.intensidade || 1;
  const inicial = (oferta.nome.match(/[A-Za-zÀ-ÿ0-9]/) || ['?'])[0].toUpperCase();

  let arcos = '';
  for (let i = 0; i < n; i++) {
    const r = 70 + i * 34;
    const opacidade = Math.max(0.12, 0.85 - i * 0.11);
    const largura = i === 0 ? 3 : 1.6;
    arcos += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#FF6B1A" stroke-width="${largura}" opacity="${opacidade.toFixed(2)}" />`;
  }

  // ponto "você está aqui" na órbita mais interna, ângulo variando por oferta
  const angulo = (seed % 70 + 20) * (Math.PI / 180);
  const r0 = 70;
  const dotX = cx - r0 * Math.cos(angulo);
  const dotY = cy + r0 * Math.sin(angulo);

  return `
    <svg viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;width:100%;height:100%;">
      <defs>
        <linearGradient id="bg-${oferta.slug}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#151517" />
          <stop offset="100%" stop-color="#0B0B0C" />
        </linearGradient>
        <radialGradient id="glow-${oferta.slug}" cx="${dotX}" cy="${dotY}" r="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FF6B1A" stop-opacity="0.55" />
          <stop offset="100%" stop-color="#FF6B1A" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="225" fill="url(#bg-${oferta.slug})" />
      <text x="-6" y="205" font-family="Sora, sans-serif" font-weight="800" font-size="170" fill="#FFFFFF" opacity="0.05">${inicial}</text>
      ${arcos}
      <circle cx="${dotX.toFixed(1)}" cy="${dotY.toFixed(1)}" r="34" fill="url(#glow-${oferta.slug})" />
      <circle cx="${dotX.toFixed(1)}" cy="${dotY.toFixed(1)}" r="4.5" fill="#FF6B1A" />
    </svg>
  `;
}
