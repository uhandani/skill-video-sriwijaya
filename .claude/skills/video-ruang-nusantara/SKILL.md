---
name: video-ruang-nusantara
description: Membuat video pendek pilar "Ruang Nusantara" UDcation — sejarah, budaya, dan peninggalan Nusantara (candi, kapal pinisi/jung, rumah adat, gamelan, batik, kalender Jawa, navigasi pelaut) yang dikaitkan dengan MTK & fisika. Gaya paling dekat video referensi Sriwijaya: latar cokelat sogan + indigo, motif batik parang, ilustrasi tekstil (kapal, candi, rumah panggung, gong, gunung, laut, orang bercaping), plus thumbnail. Gunakan saat pengguna minta konten UDcation tentang sejarah/budaya/peninggalan Nusantara + sains, atau menyebut "Ruang Nusantara" / "Jejak Ilmu Nusantara".
---

# Video Ruang Nusantara — UDcation

Pilar sejarah & budaya × MTK/fisika. Mesin video dan alur kerja SAMA dengan skill
**video-sains-nusantara**; yang berbeda: tema, ilustrasi, pola cerita, dan **standar riset yang lebih ketat**.

**Baca dulu**: `.claude/skills/video-sains-nusantara/SKILL.md` (alur kerja & aturan gaya), lalu
`.claude/skills/video-sains-nusantara/references/`: `scene-library.md`, `production.md`,
`accuracy.md`, `tema-ilustrasi-thumbnail.md`.

## Identitas Ruang Nusantara

- `"pilar": "Ruang Nusantara"` → latar **cokelat sogan** (`bg: navy`), latar sekunder **laut indigo**
  (`bg: cokelat`), bar subtitle **indigo**, aksen **terakota**, motif **parang** (motif keraton).
- Ilustrasi bergaya video Sriwijaya: garis krem, isian warna tekstil, aksen emas, laut bermotif ombak
  (`garisLaut`). Inilah ciri utama pilar ini — **setiap video minimal 2 adegan `ilustrasi`**.

## Riset & akurasi (lebih ketat dari pilar lain)

1. Cari minimal **2 sumber kredibel** per klaim sejarah/budaya (UNESCO, BPCB/Kemendikbud, jurnal,
   buku sejarah, museum). Catat di `sumber` dan tampilkan adegan `sumber` di akhir video.
2. Pisahkan tegas: **fakta tercatat** vs **dugaan/legenda/klaim populer**. Klaim populer
   (mis. "Borobudur pakai rasio emas") hanya boleh tampil sebagai pertanyaan "Mitos atau fakta?"
   dan dijawab jujur. Jangan mengarang tahun, nama, ukuran, atau angka.
3. Jangan mengklaim leluhur "tahu rumus X" tanpa bukti — tulis "mempraktikkan / menguasai lewat pengalaman".
4. Jika fakta meragukan atau sumber bertentangan → **tanya pengguna** sebelum produksi.
5. Skrip `studio/verify/<nama>.py` meng-assert angka DAN konsistensi fakta (tahun di narasi = di layar = di sumber),
   contoh: `verify/pinisi-terapung.py`, `verify/asal-usul-x.py`.
6. Nama tempat/tokoh: subtitle pakai ejaan resmi; `tts` pakai ejaan lafal bila perlu.

## Pola cerita (diadaptasi dari video referensi Sriwijaya)

1. **Peninggalan → misteri → ilmu** (default):
   ilustrasi pembuka (`ilustrasi`, laut/candi/kapal) → hook `title` + "?" ("Kok bisa…?") →
   prinsip sains (`diagram`/`equation`) → angka contoh (`counter`/`equation`) →
   fakta sejarah/pengakuan (`ilustrasi` + label tahun/lembaga) → `outro` → `sumber`.
2. **Mitos atau fakta?**: klaim populer di latar `perkamen` (transisi keluar `perkamen`) → cek data → jawaban jujur.
3. **Jejak waktu**: urutan tahun (`counter` dengan `"tahun": true`) seperti video Sriwijaya / AsalUsulX.

Contoh lengkap: `studio/src/storyboards/pinisi-terapung.json`.

Bank ide (wajib riset dulu): weton 35 hari (KPK 5 & 7) · stupa Borobudur (barisan) ·
batu candi tanpa semen (gesekan, kunci batu) · rumah panggung (gempa/banjir) · navigasi bintang pelaut Bugis
(sudut/trigonometri) · angin muson & jalur Sriwijaya · gamelan slendro/pelog (frekuensi) · angklung (resonansi) ·
batik kawung/parang (simetri) · pranata mangsa (posisi matahari).

## Ilustrasi & thumbnail

- Jenis budaya: `kapal`, `candi`, `rumahPanggung`, `gong`, `orang`, `kelapa`; alam: `gunung`, `ombak`,
  `awan`, `matahari`. Belum ada yang dibutuhkan (mis. angklung, wayang, keris)? Buat di
  `studio/src/components/Ilustrasi.tsx` mengikuti gaya wajib, lalu dokumentasikan.
- Thumbnail wajib: hook angka/pertanyaan + satu peninggalan besar sebagai pahlawan
  (kapal, candi, rumah adat). Render `<Id>-thumb` & `<Id>-thumb-yt`. Detail: `tema-ilustrasi-thumbnail.md`.

## Checklist tambahan sebelum render

- [ ] Latar cokelat sogan + bar indigo tampil (pilar benar)
- [ ] ≥ 2 adegan `ilustrasi`, adegan `sumber` di akhir
- [ ] Setiap klaim sejarah punya sumber; klaim populer ditandai jujur
- [ ] Ejaan nama tempat/tokoh benar di layar & subtitle
- [ ] Thumbnail dirender dan dicek
