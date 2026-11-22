---
name: video-ruang-semesta
description: Membuat video pendek FISIKA pilar "Ruang Semesta" UDcation — gaya Nusantara Emas bertema hijau zamrud + jingga senja, motif batik mega mendung, ilustrasi langit & alam bergaya video Sriwijaya (matahari, bulan, bumi, planet, bintang, awan, ombak), simulasi fisika yang dihitung dari persamaan, plus thumbnail. Gunakan saat pengguna minta video/Reels/Shorts/konten UDcation tentang fisika (gerak, gaya, gravitasi, energi, gelombang, bunyi, cahaya, listrik, astronomi, fenomena alam) atau menyebut "Ruang Semesta".
---

# Video Ruang Semesta (Fisika) — UDcation

Pilar fisika UDcation. Mesin video, komponen, dan alur kerja SAMA dengan skill
**video-ruang-hitung** (Ruang Hitung); yang berbeda: tema warna, motif, ilustrasi, dan pola cerita.

**Baca dulu**: `.claude/skills/video-ruang-hitung/SKILL.md` (alur kerja 9 langkah & aturan gaya),
lalu referensi bersama di `.claude/skills/video-ruang-hitung/references/`:
`scene-library.md`, `production.md`, `accuracy.md`, `tema-ilustrasi-thumbnail.md`.

## Identitas Ruang Semesta

- `"pilar": "Ruang Semesta"` → palet otomatis: latar **hijau zamrud** (`bg: navy`), latar sekunder
  **langit malam indigo** (`bg: cokelat`, cocok untuk astronomi/antariksa), bar subtitle **jingga senja**,
  aksen **hijau giok**, motif **mega mendung** (awan Cirebon = langit, udara, alam).
- Emas tetap untuk 1–2 fokus per adegan (rumus kunci, hasil, benda yang dibahas).
- Nuansa: "langit & alam" — tenang, kagum, penasaran.

## Pola cerita fisika (pilih satu)

1. **Fenomena → kenapa?** (default): ilustrasi fenomena (`ilustrasi`) → hook `title` + "?" →
   eksperimen pikiran / simulasi (`diagram` / `projectile` / `graph`) → angka (`counter`) →
   rumus (`equation`, langkah akhir emas) → payoff `outro` → `sumber`.
2. **Paradoks**: pernyataan yang terdengar salah ("Bulan selalu jatuh!") lalu dibuktikan.
3. **Bandingkan**: dua kondisi berdampingan (30° vs 45°) lalu grafik yang menjelaskan.
4. **Fisika sehari-hari**: benda di sekitar (gasing, layang-layang, bedug) → prinsipnya → rumus.

Contoh lengkap: `studio/src/storyboards/bulan-tidak-jatuh.json` (meriam Newton, kecepatan orbit)
dan `gerak-parabola-45.json` (simulasi peluru).

## Aturan khusus fisika

- **Gerak wajib dihitung dari persamaan** (lihat `ProjectileScene.tsx`), bukan animasi asal.
  Fenomena baru (bandul, pegas, gelombang, orbit) → buat adegan baru yang menghitung posisi per frame,
  daftarkan di `types.ts` + `UDVideo.tsx`, dokumentasikan di `scene-library.md`.
- **Satuan** selalu ditulis; konstanta dengan pembulatan eksplisit (g ≈ 9,8 m/s², GM Bumi ≈ 3,986×10¹⁴).
- **Asumsi model** disebut (tanpa hambatan udara, orbit lingkaran, gesekan diabaikan) di narasi atau
  `catatan` adegan sumber.
- Skrip `studio/verify/<nama>.py` menghitung ulang SEMUA angka (lihat `verify/bulan-tidak-jatuh.py`).
- Sumber: NASA/ESA/NOAA, buku fisika SMA, makalah asli (Newton, Archimedes, dst.).

## Ilustrasi & thumbnail

- Adegan `ilustrasi` untuk pembuka fenomena: `matahari`, `bulan`, `bumi`, `planet`, `bintang`, `awan`,
  `ombak`, `gunung`, `orang`. Benda langit memakai titik pusat; letakkan di kanvas 1000×1778.
- Thumbnail wajib: `"thumbnail": {hook, sub, elemen}` — hook paradoks/angka mengejutkan,
  satu benda langit/alam besar sebagai pahlawan. Render `<Id>-thumb` & `<Id>-thumb-yt`.
  Detail: `tema-ilustrasi-thumbnail.md`.

## Checklist tambahan sebelum render

- [ ] Latar hijau zamrud tampil (pilar benar), bar subtitle jingga
- [ ] Simulasi/diagram konsisten dengan rumus di video (fungsi yang sama)
- [ ] Asumsi model disebut
- [ ] Thumbnail dirender dan dicek (hook terbaca di ukuran kecil)
