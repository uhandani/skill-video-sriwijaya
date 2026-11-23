# UDcation — konteks untuk sesi Claude Code

Proyek video pendek edukasi MTK & fisika bergaya "Nusantara Emas" milik UDcation.
**Baca dulu `PANDUAN-PROYEK-UDCATION.md`** (brand, 3 pilar, aturan wajib, daftar video, urutan seri, ide konten).

## Cara kerja
- Video dibuat dengan skill: `video-ruang-hitung` (inti, MTK), `video-ruang-semesta` (fisika), `video-ruang-nusantara` (sejarah & budaya). Ikuti alur di `.claude/skills/video-ruang-hitung/SKILL.md`.
- Mesin video: Remotion di `studio/`. Satu video = satu storyboard JSON di `studio/src/storyboards/`, didaftarkan di `index.ts`.
- Cek: `npm run cek`, `npm run verifikasi`, `npx tsc --noEmit` (dari `studio/`).
- Voice-over: ElevenLabs, suara "Saos Cocol" (voice_id `R86jddkroI9bJwXFfjsr`), model `eleven_v4`, 1 take per adegan, berurutan. Teks TTS di field `tts` (lafal Indonesia: huruf I ditulis "ii", v "ve", dst.). Jika "Free generations are busy": jangan ulang di giliran yang sama, minta pengguna mengetik "lanjut".
- Audio: `studio/public/audio/<nama-file-storyboard>/<n>-<id>.mp3`, lalu `npm run sinkron -- src/storyboards/<file>.json`.
- Render final + loudnorm + thumbnail: lihat `.claude/skills/video-ruang-hitung/references/production.md`.

## Aturan dari pengguna
- Riset + sumber di akhir video; klaim belum pasti diberi label "konon".
- Selalu ada ilustrasi; tiap pilar warnanya beda; thumbnail Reels & YouTube dengan hook "wow".
- Nomor part di video/thumbnail mengikuti **urutan posting**, bukan urutan rencana.
- Hemat token & kredit ElevenLabs: untuk revisi, ubah hanya adegan yang perlu.
- Bahasa percakapan: Indonesia.

## Platform UDcation (tahap konten)
- Platform belajar numerasi & literasi SD–SMA (gratis dulu, nanti langganan). Kode & konten di `platform/`.
- Desain: `docs/superpowers/specs/2026-11-23-platform-udcation-design.md` · Rencana: `docs/superpowers/plans/2026-11-23-platform-udcation-konten.md`.
- Tim agen tokoh (skill + agen, panggil dengan nama, mis. `/kihajar-kurikulum`): `gajahmada-koordinator`, `kihajar-kurikulum`, `malahayati-riset-soal`, `sultanagung-bank-soal-mtk`, `habibie-fisika`, `kartini-literasi-modul`, `dewisartika-penguji`, `djuanda-developer`, `radensaleh-kreatif-game`.
- Cek: `cd platform && npm test && npm run cek`.
- Prototipe web (Vite + React + Supabase) di `platform/web/` — cek: `cd platform/web && npm test && npm run cek && npm run e2e && npm run uji-rls`. Mode demo `/?demo=1`.
