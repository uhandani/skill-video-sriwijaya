# UDcation Studio

Proyek Remotion untuk video edukasi Matematika & Fisika bergaya "Nusantara Emas".
Panduan lengkap: `.claude/skills/video-sains-nusantara/SKILL.md`.

```bash
npm install
npx remotion studio                 # preview
npm run cek && npm run verifikasi   # cek storyboard + angka
npx remotion render Pythagoras345 out/Pythagoras345.mp4 --codec=h264 --crf=20
```

Video baru = file JSON baru di `src/storyboards/` + daftarkan di `src/storyboards/index.ts`
+ skrip verifikasi di `verify/`.

| Folder | Isi |
|---|---|
| `src/brand/` | tema warna, font lokal, geometri logo Δ Kawung |
| `src/components/` | latar bertekstur, logo animasi, teks emas, KaTeX, subtitle, transisi |
| `src/scenes/` | tipe adegan: title, diagram, equation, graph, projectile, counter, outro |
| `src/storyboard/` | tipe data & perhitungan timeline/subtitle |
| `src/storyboards/` | storyboard tiap video |
| `verify/` | skrip verifikasi angka per video |
| `scripts/` | pemeriksa storyboard |
| `public/fonts/` | Cormorant Garamond & Mulish (SIL Open Font License) |
