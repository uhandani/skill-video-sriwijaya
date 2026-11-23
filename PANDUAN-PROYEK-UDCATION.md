# UDcation — Panduan Proyek

> Dokumen acuan untuk Project UDCATION di Claude. Selalu diperbarui di repo
> `uhandani/skill-video-sriwijaya` (sinkronkan lewat Project knowledge → GitHub).

## 1. Tentang UDcation

- **Nama:** UD = Uhan Dani, UDcation = plesetan *education*.
- **Misi:** belajar Matematika & Fisika dengan rasa Nusantara — mewah, otentik, ilmiah.
- **Tahap 1 (sekarang):** bangun audiens lewat video pendek di Instagram Reels, YouTube Shorts, TikTok.
- **Tahap 2:** platform belajar MTK & fisika — gratis + versi berlangganan.
- **Tagline di outro:** "Ilmu Semesta · Rasa Nusantara".

## 2. Identitas visual

| Elemen | Ketentuan |
|---|---|
| Logo | **Δ Kawung** — segitiga (delta = perubahan) yang ketiga sisinya kelopak kawung, titik pusat = titik berat. Detail: `branding/UDcation-brand.md` |
| Gaya | "Nusantara Emas": tekstur kain/batik, foil emas, ilustrasi tekstil bergaya video Sriwijaya, subtitle karaoke |
| Font | Cormorant Garamond (judul, serif) + Mulish (teks, sans) |
| Emas | Hanya 1–2 fokus per adegan (rumus kunci, hasil, kata penting) |
| Suara | ElevenLabs, suara **"Saos Cocol"**, model eleven_v4, 1 take per adegan |
| Durasi | 45–80 detik, 9:16 (1080×1920) |

## 3. Tiga pilar konten

| Pilar | Isi | Warna latar | Bar subtitle | Motif |
|---|---|---|---|---|
| **Ruang Hitung** | Matematika, fakta unik MTK, sejarah simbol | Navy | Marun | Kawung |
| **Ruang Semesta** | Fisika, fenomena alam, astronomi | Hijau zamrud (+ indigo malam) | Jingga senja | Mega mendung |
| **Ruang Nusantara** | Sejarah, budaya, peninggalan Nusantara × MTK/fisika | Cokelat sogan | Indigo | Parang |

Skill Claude Code per pilar: `video-ruang-hitung` (inti), `video-ruang-semesta`, `video-ruang-nusantara`.

## 4. Aturan wajib setiap video

1. **Riset dulu.** Fakta dicek; klaim yang belum pasti diberi label **"KONON · BELUM PASTI"**.
   Ruang Nusantara: minimal 2 sumber per klaim, mitos dipisahkan dari fakta.
2. **Sumber riset ditampilkan di akhir video** (adegan `sumber`).
3. **Ada ilustrasi** supaya tidak monoton (orang, benda, alam, bangunan).
4. **Sinkron:** subtitle, suara, dan animasi muncul tepat saat kata diucapkan.
5. **Hitungan diverifikasi ulang** dengan skrip `studio/verify/<nama>.py`.
6. **Thumbnail** 2 versi (Reels 1080×1920 & YouTube 1280×720): hook "wow" + ilustrasi.
7. Penutup menyebut part/video berikutnya dengan **nomor sesuai urutan posting**.

## 5. Video yang sudah dibuat

| ID | Judul | Pilar | Kurikulum | Status |
|---|---|---|---|---|
| Pythagoras345 | Rahasia Tali 3-4-5 | Ruang Hitung | SMP 8 — Teorema Pythagoras | Selesai + VO |
| AsalUsulX | Kenapa Harus x? | Ruang Hitung (Fakta Unik) | SMP 7 — Aljabar | Selesai + VO |
| GerakParabola45 | Lemparan Terjauh Itu 45°? | Ruang Semesta | SMA 10 — Gerak Parabola | Video tanpa VO |
| BulanTidakJatuh | Bulan Itu Selalu Jatuh! | Ruang Semesta | SMA 10 — Gravitasi | Storyboard saja |
| PinisiTerapung | Kayu Puluhan Ton Kok Terapung? | Ruang Nusantara | SMP 8 — Archimedes | Storyboard saja |
| BorobudurTanpaSemen | Tanpa Semen, Berdiri 1.200 Tahun? | Ruang Nusantara | SMP 8 — Gaya gesek | Selesai + VO |
| LambangFisikaPart1 | Huruf v Itu Velocity?! | Ruang Semesta | SMP 8/SMA 10 — Gerak lurus | Selesai + VO |
| LambangFisikaPart2 | P Itu Daya atau Tekanan? (Huruf Kembar) | Ruang Semesta | Besaran & satuan | Selesai + VO |
| LambangFisikaPart3 | Arus Listrik Kok I, Bukan C? | Ruang Semesta | SMP 9/SMA 12 — Listrik dinamis | Selesai + VO |

### Seri "Kode Rahasia Lambang Fisika" (urutan posting)

1. ✅ Velocity (v, a, t, Δ, s)
2. ✅ Huruf Kembar (P, V/v, T, W/w)
3. ✅ Lambang Listrik (I, Q, V, R, Ω)
4. ⏳ Gaya & Energi (F, m, g, E, W, p)
5. ⏳ Gelombang (λ, f, T, v)
6. ⏳ Panas & Zat (Q, c, ρ, P)
7. ⏳ Cerita sejarah di balik lambang

## 6. Ide konten Ruang Hitung

Angka/fakta di bawah masih **ide** — semuanya diriset & diverifikasi ulang saat produksi.
⭐ = disarankan dibuat duluan (hook kuat, dekat dengan materi sekolah).

### Seri A — "Asal-usul Simbol MTK" (lanjutan video huruf x)

| # | Judul / hook thumbnail | Isi singkat | Kurikulum |
|---|---|---|---|
| A1 ⭐ | **Siapa Penemu Tanda "="?** | Robert Recorde (1557): dua garis sejajar "karena tak ada yang lebih sama" | SMP 7 — Persamaan |
| A2 | **π Bukan 22/7!** | Asal huruf π, kenapa 22/7 cuma pendekatan, Archimedes & poligon | SMP 8 — Lingkaran |
| A3 | **Kenapa Akar Bentuknya √?** | Dari huruf r (radix) yang memanjang | SMP 9 — Bentuk akar |
| A4 | **Asal-usul + dan −** | Dari singkatan & tanda pedagang abad ke-15 | SMP 7 — Bilangan bulat |
| A5 | **Kenapa Persen Ditulis %?** | Dari singkatan *per cento* | SMP 7 — Persentase |
| A6 | **Angka 0: Penemuan Paling Mahal?** | Dari India (Brahmagupta) sampai Nusantara (prasasti Sriwijaya berangka tahun) — kolaborasi dengan Ruang Nusantara | SMP 7 — Bilangan |

### Seri B — "Kok Bisa Begitu?" (aturan MTK yang sering dihafal tanpa paham)

| # | Judul / hook thumbnail | Isi singkat | Kurikulum |
|---|---|---|---|
| B1 ⭐ | **Negatif × Negatif = Positif, Kok Bisa?** | Pola bilangan & garis bilangan | SMP 7 — Bilangan bulat |
| B2 ⭐ | **Kenapa Tidak Boleh Dibagi 0?** | Pembagian = perkalian terbalik, grafik 1/x | SMP 7 |
| B3 | **a⁰ = 1, Bukan 0?** | Pola pangkat turun: bagi terus dengan a | SMP 9 — Perpangkatan |
| B4 | **0! = 1?!** | Banyak cara menyusun nol benda | SMA 12 — Kaidah pencacahan |
| B5 | **0,999… = 1?** | Paradoks; bukti dengan 1/3 × 3 dan aljabar | SMP 7 — Desimal |
| B6 | **Kenapa Lingkaran 360°?** | Babilonia, basis 60, banyak faktor | SMP 7 — Sudut |
| B7 | **Kenapa 1 Jam = 60 Menit?** | Sistem bilangan basis 60 Babilonia | SMP 7 — Satuan waktu |
| B8 | **Rumus Luas Lingkaran dari Pizza** | Potong juring → susun jadi jajar genjang → πr² | SMP 8 — Lingkaran |

### Seri C — "Peluang & Paradoks"

| # | Judul / hook thumbnail | Isi singkat | Kurikulum |
|---|---|---|---|
| C1 ⭐ | **23 Orang, 50% Ulang Tahunnya Sama!** | Paradoks ulang tahun, dihitung lewat peluang komplemen | SMP 8 / SMA 12 — Peluang |
| C2 | **Ganti Pintu atau Tidak?** | Masalah Monty Hall + simulasi | SMA 12 — Peluang |
| C3 | **Diskon 20% + 20% ≠ 40%!** | Persen bertingkat di toko online | SMP 7 — Aritmetika sosial |
| C4 | **Lipat Kertas 42 Kali Sampai Bulan?** | Pertumbuhan eksponen (cek ulang angka) | SMP 9 / SMA 10 — Eksponen |
| C5 | **Pinjam Rp1 Juta, Bunga 1% per Hari** | Bunga majemuk vs tunggal — literasi keuangan | SMA 10 — Barisan & deret |

### Seri D — "MTK di Sekitar Kita" (banyak ilustrasi)

| # | Judul / hook thumbnail | Isi singkat | Kurikulum |
|---|---|---|---|
| D1 ⭐ | **Lebah Lebih Jago MTK dari Kita?** | Kenapa sarang lebah segi enam (keliling minimum) | SMP 7 — Bangun datar |
| D2 | **Bunga Matahari Bisa Berhitung** | Bilangan Fibonacci pada spiral biji | SMP 8 — Pola bilangan |
| D3 | **Kenapa Kaleng Berbentuk Tabung?** | Volume vs luas permukaan (optimasi) | SMP 9 — Bangun ruang |
| D4 | **Batik Itu Matematika!** | Kawung & parang = translasi, rotasi, refleksi (crossover Ruang Nusantara) | SMP 9 — Transformasi |
| D5 | **Tinggi Pohon Tanpa Memanjat** | Kesebangunan dengan bayangan/tongkat | SMP 9 — Kesebangunan |

### Seri E — "Trik Hitung Kilat" (cocok untuk konten cepat)

| # | Judul / hook thumbnail | Isi singkat |
|---|---|---|
| E1 | **Kali 11 dalam 2 Detik** | Jumlahkan digit, sisipkan di tengah — lalu buktikan aljabarnya |
| E2 | **Kalian 9 Pakai Jari** | Trik jari + alasan matematisnya |
| E3 | **Kuadrat Angka Berakhiran 5** | 35² = 3·4 lalu tulis 25 — dibuktikan dengan (10a+5)² |

**Usulan urutan rilis Ruang Hitung:** A1 → B1 → C1 → D1 → B2 → A2 → C3 → D4.
Selang-seling dengan seri lambang fisika (Ruang Semesta) dan Ruang Nusantara agar feed bervariasi.

## 7. Cara meminta video baru (di Claude Code)

Ketik, misalnya:

- `/video-ruang-hitung buatkan video A1 "Siapa Penemu Tanda =?". Riset, kasih sumber di akhir.`
- `/video-ruang-semesta lanjut part 4 gaya & energi`
- `/video-ruang-nusantara buatkan video Pinisi Kok Bisa Terapung pakai voice-over`

Claude akan: riset → storyboard → cek & verifikasi angka → pratinjau gambar → voice-over → sinkron → render → thumbnail → kirim file → commit.

Catatan ElevenLabs gratis: bila muncul "Free generations are busy", tunggu ±1 menit lalu ketik **"lanjut"**.

## 8. Lokasi file di repo

| Isi | Lokasi |
|---|---|
| Brand & logo | `branding/` (logo SVG/PNG di `branding/assets/`) |
| Skill & aturan gaya | `.claude/skills/` |
| Naskah/storyboard video | `studio/src/storyboards/*.json` |
| Voice-over | `studio/public/audio/<nama-video>/` |
| Thumbnail | `studio/thumbnails/` |
| Skrip verifikasi angka | `studio/verify/` |

File video MP4 tidak disimpan di repo (terlalu besar). Simpan hasil unduhan di Google Drive, misalnya folder
`UDCATION/Video/<Pilar>/` dan `UDCATION/Thumbnail/<Pilar>/`.

## Platform UDcation (Tahap 2)

Platform belajar umum SD–SMA untuk menambal **pondasi** numerasi & literasi: operasi bilangan,
pecahan, huruf dalam MTK/persamaan, ubah rumus fisika, dan soal cerita. Pembeda dari Gradient
Academy (fokus UTBK/TKA): UDcation fokus pondasi.

- Alur siswa: login → tes diagnostik adaptif → peta Kuasai/Rapuh/Bolong → latihan di anak tangga yang bolong.
- Analisis salah: jawaban isian dicocokkan dengan pola salah (miskonsepsi), cek per langkah untuk persamaan & ubah rumus,
  feedback 3 lapis (sebut → tunjukkan → soal kembar), profil salah dievaluasi terus.
- Gamifikasi (nanti): map kerajaan Nusantara, kartu tokoh & pahlawan nasional dari prestasi belajar (bukan uang).

| Skill/agen | Tokoh | Keahlian |
|---|---|---|
| `gajahmada-koordinator` | Gajah Mada | koordinator tim |
| `kihajar-kurikulum` | Ki Hajar Dewantara | kurikulum, diagnostik, desain modul |
| `malahayati-riset-soal` | Malahayati | riset Kumon, AKM, PISA, Gradient |
| `sultanagung-bank-soal-mtk` | Sultan Agung | bank soal MTK & pola salah |
| `habibie-fisika` | B.J. Habibie | ubah rumus & soal fisika |
| `kartini-literasi-modul` | R.A. Kartini | soal cerita, modul, teks feedback |
| `dewisartika-penguji` | Dewi Sartika | verifikasi kunci & hitungan |
| `djuanda-developer` | Ir. Djuanda | developer platform |
| `radensaleh-kreatif-game` | Raden Saleh | tim kreatif & gamifikasi |
