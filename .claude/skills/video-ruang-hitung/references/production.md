# Produksi: perintah, audio, lingkungan

Semua perintah dijalankan di folder `studio/`.

| Tujuan | Perintah |
|---|---|
| Pasang dependensi (sekali) | `npm install` |
| Preview interaktif | `npx remotion studio` (buka URL yang dicetak; tiap adegan juga punya komposisi sendiri di folder `<Id>-Adegan`) |
| Cek storyboard | `npm run cek` |
| Verifikasi angka | `npm run verifikasi` |
| Sinkron voice-over | `npm run sinkron -- src/storyboards/<nama>.json` |
| Cek tipe | `npx tsc --noEmit` |
| Still untuk cek visual | `npx remotion render <Id> out/cek --frames=30,150,300 --image-format=png --scale=0.5` |
| Render final | `npx remotion render <Id> out/<Id>.mp4 --codec=h264 --crf=20` |
| Normalisasi volume (setelah render ber-VO) | `ffmpeg -i out/<Id>.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 192k out/<Id>-UDcation.mp4` |
| Daftar komposisi | `npx remotion compositions` |

Frame = detik × 30. Untuk memilih frame cek: ambil tengah setiap adegan + saat transisi.

## Audio

### Voice-over per adegan (alur utama, sudah teruji)

1. **Naskah TTS** = `narasi` tiap adegan, tapi tulis istilah asing sesuai bunyi Indonesia
   (mis. "Pitagoras", "teta"). Subtitle tetap memakai ejaan `narasi` (mis. "Pythagoras").
2. **Generate** — via konektor ElevenLabs (`creative_generate_speech`):
   - suara default UDcation: **"Saos Cocol – Warm Cinematic Storyteller"** `R86jddkroI9bJwXFfjsr`
     (cek dulu dengan `creative_list_voices` search "saos cocol"; jangan menebak voice_id)
   - model `eleven_v4`, `generations_count: 1`, satu flow per video (`creative_create_flow`)
   - generate **satu adegan per giliran, tunggu selesai, baru adegan berikutnya** — paket Free
     menolak permintaan paralel ("Free generations are busy"). Jika ditolak: JANGAN langsung
     ulang di giliran yang sama; beri tahu pengguna dan coba lagi setelah ±1 menit.
   - unduh `content_url` dengan `curl` (butuh host `elevenlabsusercontent.com` diizinkan di
     environment; URL kedaluwarsa dalam beberapa jam).
3. **Simpan** di `studio/public/audio/<nama-storyboard>/<nomor>-<id-adegan>.mp3`
   (mis. `public/audio/pythagoras-345/1-pembuka-tali.mp3`).
4. **Sinkron**: `npm run sinkron -- src/storyboards/<nama>.json`
   - mengisi `scene.vo` (file, durasi, waktu tiap kata) → subtitle karaoke mengikuti suara
   - memperpanjang `durasi` adegan bila suara tidak muat sebelum transisi
   - elemen dengan isyarat `"kata"` diberi `at` = saat kata itu diucapkan (lihat scene-library.md)
5. `npm run cek` lalu render. Audio ditempatkan otomatis per adegan (mulai 0,3 dtk setelah adegan masuk).

Biaya: ±1 kredit per karakter; video 40 detik ≈ 480 karakter. Paket Free (10.000/bulan) tanpa
hak komersial — untuk konten yang dimonetisasi perlu minimal Starter.

### Alternatif
- **Satu file VO utuh**: `"audio": {"voiceover": "audio/<file>.mp3"}` — subtitle tetap estimasi;
  lebih presisi pakai alur per adegan di atas.
- **Rekaman suara sendiri**: simpan per adegan dengan konvensi nama yang sama, lalu `npm run sinkron`.
- **Musik latar**: etnik-sinematik lembut, berlisensi. `"musik": "audio/<file>.mp3", "musikVolume": 0.18`.
- SFX (opsional, belum diotomasi): shimmer saat emas muncul, whoosh saat iris, goresan pena.

## Brand

- Logo resmi: **Δ Kawung Cetak Biru** (garis emas tanpa isi, TANPA arsiran, titik krem). Aset: `branding/assets/svg|png`;
  logo isi foil lama hanya arsip di `branding/assets/legacy-foil/` — jangan dipakai di video/thumbnail baru.
- Logo, aset, dan filosofi: `branding/UDcation-brand.md`.
- Geometri logo: `branding/tools/delta.mjs` ⇄ `studio/src/brand/delta.ts` (`SPEC_BLUEPRINT`, `STROKE_BP`, `DOT_R_BP`;
  ubah keduanya bila logo berubah).
- Di video selalu pakai komponen `DeltaLogo` (jangan menggambar logo sendiri). Wordmark: font `mono` (IBM Plex Mono).
- Ekspor ulang aset logo: `NODE_PATH=$(npm root -g) node branding/tools/export-assets.mjs` (butuh playwright).

## Catatan lingkungan

- Font (Cormorant Garamond & Mulish, SIL OFL) disimpan lokal di `studio/public/fonts/` →
  render tidak butuh internet. KaTeX memakai font dari `node_modules`.
- `remotion.config.ts` otomatis memakai `/opt/pw-browsers/chromium_headless_shell` bila ada
  (lingkungan cloud tanpa akses unduh browser). Di komputer biasa Remotion mengunduh browsernya sendiri.
- Render 1080×1920 ±40 detik memakan beberapa menit; jalankan di latar belakang.
