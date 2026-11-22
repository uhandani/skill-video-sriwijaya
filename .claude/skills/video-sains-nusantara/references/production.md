# Produksi: perintah, audio, lingkungan

Semua perintah dijalankan di folder `studio/`.

| Tujuan | Perintah |
|---|---|
| Pasang dependensi (sekali) | `npm install` |
| Preview interaktif | `npx remotion studio` (buka URL yang dicetak; tiap adegan juga punya komposisi sendiri di folder `<Id>-Adegan`) |
| Cek storyboard | `npm run cek` |
| Verifikasi angka | `npm run verifikasi` |
| Cek tipe | `npx tsc --noEmit` |
| Still untuk cek visual | `npx remotion render <Id> out/cek --frames=30,150,300 --image-format=png --scale=0.5` |
| Render final | `npx remotion render <Id> out/<Id>.mp4 --codec=h264 --crf=20` |
| Daftar komposisi | `npx remotion compositions` |

Frame = detik × 30. Untuk memilih frame cek: ambil tengah setiap adegan + saat transisi.

## Audio

- **Tanpa audio**: subtitle diestimasi dari `narasi` (dibagi rata per adegan, `kpd` kata/detik).
- **Voice-over**: rekam per video, taruh di `studio/public/audio/<Id>-vo.mp3`, isi `"audio": {"voiceover": "audio/<Id>-vo.mp3"}`.
  Sesuaikan `durasi` adegan dengan rekaman. Untuk subtitle presisi per kata, gunakan skill
  `remotion:remotion-captions` (transkripsi Whisper) — lalu ganti `buildCaptions` dengan hasil transkripsi.
- **Musik latar**: etnik-sinematik lembut (gamelan/kecapi + pad), bebas royalti/berlisensi.
  `"musik": "audio/<file>.mp3", "musikVolume": 0.18` (≈ −12 dB di bawah VO). Target ±−14 LUFS.
- SFX (opsional, belum diotomasi): shimmer saat emas muncul, whoosh saat iris, goresan pena.

## Brand

- Logo, aset, dan filosofi: `branding/UDcation-brand.md`, `branding/assets/`.
- Geometri logo: `branding/tools/delta.mjs` ⇄ `studio/src/brand/delta.ts` (ubah keduanya bila logo berubah).
- Ekspor ulang aset logo: `NODE_PATH=$(npm root -g) node branding/tools/export-assets.mjs` (butuh playwright).

## Catatan lingkungan

- Font (Cormorant Garamond & Mulish, SIL OFL) disimpan lokal di `studio/public/fonts/` →
  render tidak butuh internet. KaTeX memakai font dari `node_modules`.
- `remotion.config.ts` otomatis memakai `/opt/pw-browsers/chromium_headless_shell` bila ada
  (lingkungan cloud tanpa akses unduh browser). Di komputer biasa Remotion mengunduh browsernya sendiri.
- Render 1080×1920 ±40 detik memakan beberapa menit; jalankan di latar belakang.
