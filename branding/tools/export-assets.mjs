// Ekspor kit logo UDcation — LOGO RESMI Δ Kawung CETAK BIRU (garis emas, tanpa arsiran).
// Jalankan dari root repo: NODE_PATH=$(npm root -g) node branding/tools/export-assets.mjs  (butuh playwright)
// Logo lama (isi foil) diarsipkan di branding/assets/legacy-foil/ dan tidak diekspor ulang.
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { lineMarkSVG, COLORS } from './delta.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'assets');
const FONTS = join(HERE, '..', 'fonts');
mkdirSync(join(OUT, 'svg'), { recursive: true });
mkdirSync(join(OUT, 'png'), { recursive: true });

const K = COLORS;
const ICON = 7; // garis tebal untuk ukuran kecil (≤ 64 px)
const svgs = {
  'mark-gold-on-dark': lineMarkSVG({ line: K.emas, dot: K.krem }),
  'mark-gold-on-light': lineMarkSVG({ line: K.emasTua, dot: K.navy }),
  'mark-krem-on-marun': lineMarkSVG({ line: K.krem, dot: K.emas }),
  'mark-navy': lineMarkSVG({ line: K.navy, dot: K.navy }),
  'mark-white': lineMarkSVG({ line: '#FFFFFF', dot: '#FFFFFF' }),
  'mark-black': lineMarkSVG({ line: '#000000', dot: '#000000' }),
  'mark-icon-small': lineMarkSVG({ line: K.emas, dot: K.krem, stroke: ICON }),
  'mark-construction': lineMarkSVG({ line: K.emas, dot: K.krem, construction: true }),
};
for (const [n, s] of Object.entries(svgs)) writeFileSync(join(OUT, 'svg', `${n}.svg`), s);

const fontURL = (f) => pathToFileURL(join(FONTS, f)).href;
const HEAD = `<style>
@font-face{font-family:'UD Plex';src:url('${fontURL('IBMPlexMono-Regular.ttf')}');font-weight:400}
@font-face{font-family:'UD Plex';src:url('${fontURL('IBMPlexMono-Bold.ttf')}');font-weight:700}
@font-face{font-family:'UD Hand';src:url('${fontURL('ArchitectsDaughter-Regular.ttf')}')}
*{margin:0}body{background:transparent}</style>`;

const size = (s, w) => s.replace(/width="\d+" height="\d+"/, (m) => {
  const [, W, H] = m.match(/width="(\d+)" height="(\d+)"/);
  return `width="${w}" height="${Math.round(w * H / W)}"`;
});
// kertas cetak biru bernuansa navy (tekstur halus, tanpa arsiran)
const sheet = (w, h) => `<svg width="${w}" height="${h}" style="position:absolute;inset:0"><filter id="t" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${(2.6 / Math.max(w, h)).toFixed(5)}" numOctaves="4" seed="9"/><feColorMatrix values="0 0 0 0 .11  0 0 0 0 .12  0 0 0 0 .23  0 0 0 .45 0"/></filter><rect width="${w}" height="${h}" fill="${K.navy}"/><rect width="${w}" height="${h}" filter="url(#t)"/></svg>`;
const word = (px, ud = K.emas, rest = K.krem) => `<div style="font-family:'UD Plex';font-size:${px}px;letter-spacing:.32em;line-height:1;white-space:nowrap"><b style="color:${ud}">UD</b><span style="color:${rest}">CATION</span></div>`;
const tag = (px, color = K.krem, text = 'Ilmu Semesta · Rasa Nusantara') => `<div style="font-family:'UD Hand';font-size:${px}px;color:${color};opacity:.85">${text}</div>`;
const box = (w, h, inner, bg = '', extra = '') => `<div style="position:relative;width:${w}px;height:${h}px;${bg ? `background:${bg};` : ''}overflow:hidden;${extra}">${inner}</div>`;
const center = (inner, col = false, gap = 0) => `<div style="position:absolute;inset:0;display:flex;${col ? 'flex-direction:column;' : ''}align-items:center;justify-content:center;gap:${gap}px">${inner}</div>`;

const pages = [
  // nama, lebar, tinggi, html, transparan?
  ['profile-1080', 1080, 1080, box(1080, 1080, sheet(1080, 1080) + center(size(svgs['mark-gold-on-dark'], 700)))],
  ['app-icon-1024', 1024, 1024, box(1024, 1024, center(size(svgs['mark-krem-on-marun'], 680)), K.marun)],
  ['favicon-512', 512, 512, box(512, 512, center(size(svgs['mark-icon-small'], 400)), K.navy, 'border-radius:96px'), true],
  ['favicon-32', 32, 32, box(32, 32, center(size(lineMarkSVG({ line: K.emas, dot: K.krem, stroke: 11, pad: 2 }), 30)), K.navy, 'border-radius:6px'), true],
  ['watermark-400', 400, 360, center(size(lineMarkSVG({ line: K.emas, dot: K.krem, stroke: 5 }), 400)), true],
  ['lockup-horizontal-dark', 1600, 400, box(1600, 400, sheet(1600, 400) + center(size(svgs['mark-gold-on-dark'], 250) + word(110), false, 64))],
  ['lockup-horizontal-light', 1600, 400, box(1600, 400, center(size(svgs['mark-gold-on-light'], 250) + word(110, K.emasTua, K.navy), false, 64), '#F4ECDD')],
  ['lockup-vertical-dark', 1200, 1200, box(1200, 1200, sheet(1200, 1200) + center(size(svgs['mark-construction'], 560) + word(92) + tag(46), true, 40))],
  ['yt-banner-2560', 2560, 1440, box(2560, 1440, sheet(2560, 1440) +
    `<div style="position:absolute;inset:0;background-image:linear-gradient(${K.emas}14 1px,transparent 1px),linear-gradient(90deg,${K.emas}14 1px,transparent 1px);background-size:80px 80px"></div>` +
    center(size(svgs['mark-gold-on-dark'], 300) + `<div style="display:flex;flex-direction:column;gap:28px">${word(104)}${tag(52)}</div>`, false, 70))],
];

const browser = await chromium.launch();
const tmp = join(OUT, '_tmp.html');
for (const [name, w, h, body, transparent] of pages) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8">${HEAD}</head><body>${body}</body></html>`);
  await page.goto(pathToFileURL(tmp).href);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(OUT, 'png', `${name}.png`), omitBackground: !!transparent });
  await page.close();
}
rmSync(tmp);
await browser.close();
console.log('ok', Object.keys(svgs).length, 'svg,', pages.length, 'png');
