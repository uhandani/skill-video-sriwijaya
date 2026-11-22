// Ekspor kit logo UDcation: SVG + PNG.
// Jalankan: node branding/tools/export-assets.mjs  (butuh playwright)
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { markSVG, petals, COLORS, GOLD_STOPS, DOT_R, SPEC_TYPO } from './delta.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
mkdirSync(join(OUT, 'svg'), { recursive: true });
mkdirSync(join(OUT, 'png'), { recursive: true });

const K = COLORS;
const svgs = {
  'mark-gold-on-dark': markSVG({ fills: ['gold', 'gold', 'gold', K.krem] }),
  'mark-gold-on-light': markSVG({ fills: ['gold', 'gold', 'gold', K.navy] }),
  'mark-duo': markSVG({ fills: ['gold', K.krem, K.krem, K.emas] }),
  'mark-navy': markSVG({ fills: [K.navy, K.navy, K.navy, K.navy] }),
  'mark-white': markSVG({ fills: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'] }),
  'mark-black': markSVG({ fills: ['#000000', '#000000', '#000000', '#000000'] }),
  'mark-typo-alt': markSVG({ fills: ['gold', 'gold', 'gold', K.krem], spec: SPEC_TYPO }),
};
for (const [n, s] of Object.entries(svgs)) writeFileSync(join(OUT, 'svg', `${n}.svg`), s);

// --- lockup & ikon dirender lewat HTML (butuh font Google) ---
const FONT = `<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Mulish:wght@700&display=swap" rel="stylesheet">`;
const inline = (s, w) => s.replace(/width="\d+" height="\d+"/, `width="${w}" height="${Math.round(w * 198 / 220)}"`);
const word = (ud, rest, size) => `<span style="font-family:'Cormorant Garamond';font-weight:600;font-size:${size}px;letter-spacing:.16em"><span style="color:${ud}">UD</span><span style="color:${rest}">CATION</span></span>`;

const pages = [
  // nama, lebar, tinggi, html, transparan?
  ['profile-1080', 1080, 1080, `<div style="width:1080px;height:1080px;background:${K.navy};display:flex;align-items:center;justify-content:center">${inline(svgs['mark-gold-on-dark'], 600)}</div>`],
  ['app-icon-1024', 1024, 1024, `<div style="width:1024px;height:1024px;background:${K.marun};border-radius:0;display:flex;align-items:center;justify-content:center">${inline(svgs['mark-duo'], 600)}</div>`],
  ['favicon-512', 512, 512, `<div style="width:512px;height:512px;background:${K.navy};border-radius:96px;display:flex;align-items:center;justify-content:center">${inline(svgs['mark-gold-on-dark'], 380)}</div>`, true],
  ['favicon-32', 32, 32, `<div style="width:32px;height:32px;background:${K.navy};border-radius:6px;display:flex;align-items:center;justify-content:center">${inline(svgs['mark-gold-on-dark'], 26)}</div>`, true],
  ['watermark-400', 400, 360, `<div style="width:400px;height:360px;display:flex;align-items:center;justify-content:center">${inline(svgs['mark-gold-on-dark'], 400)}</div>`, true],
  ['lockup-horizontal-dark', 1600, 400, `<div style="width:1600px;height:400px;background:${K.navyDeep};display:flex;align-items:center;justify-content:center;gap:56px">${inline(svgs['mark-gold-on-dark'], 240)}${word(K.emas, K.krem, 150)}</div>`],
  ['lockup-horizontal-light', 1600, 400, `<div style="width:1600px;height:400px;background:#F4ECDD;display:flex;align-items:center;justify-content:center;gap:56px">${inline(svgs['mark-gold-on-light'], 240)}${word(K.emasTua, K.navy, 150)}</div>`],
  ['lockup-vertical-dark', 1200, 1200, `<div style="width:1200px;height:1200px;background:${K.navyDeep};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:48px">${inline(svgs['mark-gold-on-dark'], 480)}${word(K.emas, K.krem, 120)}<div style="font-family:Mulish;font-weight:700;font-size:30px;letter-spacing:.42em;color:${K.krem};opacity:.65">ILMU SEMESTA · RASA NUSANTARA</div></div>`],
  ['yt-banner-2560', 2560, 1440, `<div style="width:2560px;height:1440px;background:${K.navyDeep};display:flex;align-items:center;justify-content:center;gap:60px">${inline(svgs['mark-gold-on-dark'], 260)}<div>${word(K.emas, K.krem, 150)}<div style="font-family:Mulish;font-weight:700;font-size:38px;letter-spacing:.42em;color:${K.krem};opacity:.65;margin-top:14px">MATEMATIKA · FISIKA · NUSANTARA</div></div></div>`],
];

const browser = await chromium.launch();
for (const [name, w, h, body, transparent] of pages) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(`<!doctype html><html><head>${FONT}<style>*{margin:0}body{background:transparent}</style></head><body>${body}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(OUT, 'png', `${name}.png`), omitBackground: !!transparent });
  await page.close();
}
await browser.close();
console.log('ok', Object.keys(svgs).length, 'svg,', pages.length, 'png');
