// Geometri logo Δ Kawung — satu sumber kebenaran untuk SVG, PNG, dan Remotion.
// LOGO RESMI (sejak 25 Nov 2026): Δ Kawung CETAK BIRU — kelopak berupa GARIS
// emas tanpa isi dan TANPA ARSIRAN, titik krem di pusat. Lihat SPEC_BLUEPRINT,
// STROKE_BP, DOT_R_BP, markSVG({ style: 'line' }). Versi isi foil (SPEC_MAIN)
// sekarang arsip/legacy.
// Segitiga sama sisi (jari-jari R ke sudut), tiap sisi = kelopak kawung
// (irisan dua busur lingkaran). Sisi luar hampir lurus, sisi dalam melengkung.

export const R = 100;
export const SIDE = R * Math.sqrt(3);
export const VERTS = [
  [0, -R],
  [R * Math.sin(Math.PI / 3), R / 2],
  [-R * Math.sin(Math.PI / 3), R / 2],
]; // searah jarum jam

// [tonjolan luar, tonjolan dalam, celah sudut] per sisi
export const SPEC_MAIN = [0.04, 0.16, 6];
// Logo resmi cetak biru: kelopak ramping, sisi dalam melengkung dalam, celah sudut lebar.
export const SPEC_BLUEPRINT = [0.013, 0.108, 0.09 * SIDE];
export const STROKE_BP = 3.2; // tebal garis kelopak (satuan R = 100)
export const DOT_R_BP = 9;
export const SPEC_TYPO = [[0.2, 0.2, 6], [0.11, 0.11, 6], [0.07, 0.07, 6]];
export const DOT_R = 10;
// viewBox yang membungkus mark dengan pas
export const VIEWBOX = '-110 -112 220 198';

const rad = (c, h) => (c * c / 4 + h * h) / (2 * h);
const f = (n) => Number(n.toFixed(2));

export function petalPath(A, B, ho, hi, gap) {
  const dx = B[0] - A[0], dy = B[1] - A[1], len = Math.hypot(dx, dy);
  const ux = dx / len, uy = dy / len;
  const a = [A[0] + ux * gap, A[1] + uy * gap];
  const b = [B[0] - ux * gap, B[1] - uy * gap];
  const c = len - 2 * gap;
  const seg = (q, h) => h <= 0 ? `L${f(q[0])},${f(q[1])}` : `A${f(rad(c, h))},${f(rad(c, h))} 0 0 1 ${f(q[0])},${f(q[1])}`;
  return `M${f(a[0])},${f(a[1])} ${seg(b, ho)} ${seg(a, hi)} Z`;
}

export function petals(spec = SPEC_MAIN) {
  const specs = Array.isArray(spec[0]) ? spec : [spec, spec, spec];
  return VERTS.map((v, i) => {
    const [ho, hi, gap] = specs[i];
    return petalPath(VERTS[i], VERTS[(i + 1) % 3], ho * SIDE, hi * SIDE, gap);
  });
}

export const COLORS = {
  navy: '#262B4A', navyDeep: '#141833', krem: '#F1E6D0', perkamen: '#CDBFA6',
  emas: '#EDB53D', emasTua: '#B07A26', marun: '#6A1A25', cokelat: '#8E5227',
};

export const GOLD_STOPS = [[0, '#F6D27A'], [0.55, '#E2A834'], [1, '#B07A26']];

/** Garis bantu gambar teknik (opsional, hanya untuk ukuran besar/intro). */
export function constructionSVG(color, sw = 0.8) {
  const lines = VERTS.map(([x, y]) => `<line x1="${f(x * 1.18)}" y1="${f(y * 1.18)}" x2="${f(-x * 0.62)}" y2="${f(-y * 0.62)}" stroke="${color}" stroke-width="${sw}" stroke-dasharray="12 4 2.5 4" opacity=".7"/>`).join('');
  const circ = `<circle cx="0" cy="0" r="${R}" fill="none" stroke="${color}" stroke-width="${sw * 0.8}" stroke-dasharray="2 4.5" opacity=".55"/>`;
  const arc = `<path d="M-14 -76 A28 28 0 0 0 14 -76" fill="none" stroke="${color}" stroke-width="${sw}"/>`;
  return lines + circ + arc;
}

/**
 * Logo resmi: garis (cetak biru). line = warna garis kelopak, dot = warna titik pusat.
 * construction = tambah garis bantu teknik. Tidak pernah ada arsiran.
 */
export function lineMarkSVG({ line = COLORS.emas, dot = COLORS.krem, size = 512, bg = null, pad = 6, construction = false, stroke = STROKE_BP } = {}) {
  const [x, y, w, h] = VIEWBOX.split(' ').map(Number);
  const P = construction ? Math.max(pad, 18) : pad;
  const vb = `${x - P} ${y - P} ${w + 2 * P} ${h + 2 * P}`;
  const H = Math.round(size * (h + 2 * P) / (w + 2 * P));
  const p = petals(SPEC_BLUEPRINT);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${H}" viewBox="${vb}">` +
    (bg ? `<rect x="${x - P}" y="${y - P}" width="${w + 2 * P}" height="${h + 2 * P}" fill="${bg}"/>` : '') +
    (construction ? constructionSVG(line) : '') +
    p.map((d) => `<path d="${d}" fill="none" stroke="${line}" stroke-width="${stroke}" stroke-linejoin="round"/>`).join('') +
    `<circle cx="0" cy="0" r="${DOT_R_BP}" fill="${dot}"/></svg>`;
}

/** LEGACY (logo isi foil lama). fills: [p1,p2,p3,dot]; 'gold' = gradien foil. */
export function markSVG({ fills = ['gold', 'gold', 'gold', COLORS.krem], size = 512, bg = null, spec = SPEC_MAIN, pad = 0 } = {}) {
  const [x, y, w, h] = VIEWBOX.split(' ').map(Number);
  const vb = `${x - pad} ${y - pad} ${w + 2 * pad} ${h + 2 * pad}`;
  const H = Math.round(size * (h + 2 * pad) / (w + 2 * pad));
  const grad = `<linearGradient id="g" x1="0" y1="0" x2="0" y2="1">${GOLD_STOPS.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
  const fill = (c) => (c === 'gold' ? 'url(#g)' : c);
  const p = petals(spec);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${H}" viewBox="${vb}"><defs>${grad}</defs>` +
    (bg ? `<rect x="${x - pad}" y="${y - pad}" width="${w + 2 * pad}" height="${h + 2 * pad}" fill="${bg}"/>` : '') +
    p.map((d, i) => `<path d="${d}" fill="${fill(fills[i])}"/>`).join('') +
    `<circle cx="0" cy="0" r="${DOT_R}" fill="${fill(fills[3])}"/></svg>`;
}
