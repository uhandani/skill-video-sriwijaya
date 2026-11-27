# Platform UDcation — Desain Tahap Konten (Kurikulum, Bank Soal, Diagnostik, Analisis Salah, Tim Agen)

Tanggal: 2026-11-23 · Status: menunggu persetujuan

## 1. Kenapa

Pemilik (guru MTK & fisika SMA) melihat banyak siswa SMA belum kuat MTK dasar:
operasi bilangan, pecahan, bentuk persamaan (huruf dalam MTK, rumus fisika), dan soal cerita.
Akibatnya MTK dan fisika SMA terasa berat, lalu dibenci. Akar masalahnya pondasi.

UDcation ingin jadi platform belajar umum (SD–SMA, gratis dulu, nanti langganan) yang
menambal pondasi numerasi & literasi, dibungkus gamifikasi bertema Nusantara.
Pembeda dari Gradient Academy (fokus UTBK/TKA): UDcation fokus **pondasi**.

## 2. Tujuan, bukan-tujuan, anti-tujuan

**Tujuan tahap ini**
- Peta kurikulum "tangga pondasi": dari hitung dasar sampai soal cerita & ubah rumus fisika.
- Bank soal berparameter (angka bisa diacak) per anak tangga.
- Konsep + mesin tes diagnostik: tahu yang sudah bisa & yang bolong.
- Analisis salah: tebak *kenapa* siswa salah, beri feedback yang pas, catat pola salah terus-menerus.
- Tim agen AI bernama tokoh Nusantara untuk mengerjakan semua ini.

**Bukan tujuan sekarang** (ditunda): map kerajaan, kartu tokoh, login, pembayaran, tampilan aplikasi.

**Anti-tujuan** (gagal walau jalan):
- Menyalin lembar Kumon atau soal berhak cipta lain.
- Feedback yang cuma "Salah, coba lagi".
- Fakta sejarah/tokoh tanpa sumber, atau klaim belum pasti tanpa label "konon".
- Konteks Nusantara yang dipaksakan sampai soal jadi membingungkan.
- Fitur "bikin betah" yang menjebak: loot box berbayar/judi, pay-to-win, tekanan streak berlebihan, notifikasi memaksa. Yang dicari: ketagihan **belajar**, bukan ketagihan layar.
- Siswa SMA merasa direndahkan karena diberi soal "anak SD" tanpa bingkai yang tepat.

## 3. Batasan

- Bahasa Indonesia. Acuan: Kurikulum Merdeka (Fase A–E), AKM numerasi & literasi.
- Kumon, AKM, PISA, Gradient: **amati–tiru–modifikasi** cara & urutan, bukan isi halaman.
- Semua kunci jawaban & aturan pola salah diverifikasi dengan skrip (seperti `studio/verify/`).
- Riset + sumber dicatat; klaim belum pasti diberi label "konon".

## 4. Pendekatan

### Cara siswa menjawab (menentukan analisis salah)

| | Cara | Plus | Minus |
|---|---|---|---|
| A | Pilihan ganda, tiap pengecoh = satu salah konsep | mudah, diagnosis jelas | bisa ditebak |
| **B** | **Isian, jawaban dicocokkan dengan pola salah** | tak bisa ditebak, otomatis, angka bisa diacak | aturan pola salah ditulis satu-satu |
| **C** | **Isian per langkah** | paling tajam (tahu langkah mana jatuh) | berat dibuat, lambat |

**Dipilih pemilik: B sebagai inti, C untuk persamaan & ubah rumus fisika, A sedikit untuk soal konsep.**

### Bentuk tim agen

Dipilih: tiap tokoh = **skill** (dipanggil pemilik dengan nama, mis. `/kihajar-kurikulum`)
+ **agen** di `.claude/agents/` (supaya Gajah Mada bisa menyuruh beberapa bekerja paralel).
Nama skill = nama tokoh + keahlian (permintaan pemilik).

## 5. Desain

### 5.1 Peta kurikulum "Tangga Pondasi"

Satu **simpul** = satu kemampuan kecil. Simpul punya: id, nama, jalur, prasyarat, fase
Kurikulum Merdeka, contoh soal, dan **syarat lancar** gaya Kumon (akurasi ≥ 90 % dan
di bawah target waktu per soal).

Jalur (draf, diperhalus oleh Ki Hajar Dewantara):

| Jalur | Isi | Fase |
|---|---|---|
| J1 Bilangan & nilai tempat | cacah, nilai tempat, banding | A–B |
| J2 Tambah & kurang | fakta dasar, bersusun, meminjam | A–B |
| J3 Kali & bagi | fakta perkalian, bersusun, bagi bersisa | B–C |
| J4 Bilangan bulat | negatif, operasi, garis bilangan | D |
| J5 Urutan operasi | kurung, kali/bagi dulu | C–D |
| J6 Pecahan: makna | senilai, sederhanakan, banding | B–C |
| J7 Pecahan: operasi | + − × ÷ pecahan, campuran | C–D |
| J8 Desimal & persen | ubah bentuk, operasi | C–D |
| J9 Rasio & proporsi | perbandingan, skala, laju | D |
| J10 Pangkat & akar | arti pangkat, sifat, akar | D |
| J11 Huruf dalam MTK | huruf = bilangan, substitusi, sederhanakan | D |
| J12 Persamaan linear | 1 variabel, langkah setimbang | D |
| J13 Ubah rumus | v = s/t, F = m·a, ρ = m/V, dst. | D–E |
| J14 Satuan | konversi, analisis satuan | C–E |
| J15 Soal cerita | baca → model → hitung → cek | semua |

### 5.2 Bank soal

- **Templat berparameter**: teks + rentang angka + fungsi kunci. Satu templat bisa jadi ribuan soal.
- Tiap templat punya ≥ 3 **pola salah** yang terkait (lihat 5.4) dan tingkat (1–5).
- Ada juga soal tetap (soal cerita, soal konsep pilihan ganda).
- Konteks Nusantara dipakai jika wajar (pasar, sawah, pinisi, kain batik, kalender Jawa).
- Format data: JSON di `platform/konten/` (simpul, templat, pola salah) — keputusan Claude.

### 5.3 Tes diagnostik

- Adaptif di atas peta prasyarat: tiap jalur dimulai dari simpul tengah sesuai jenjang siswa.
  Benar 2 dari 2 → naik; salah → turun (mirip cari biner di tangga). 2–3 soal per simpul.
- Target ≤ 25 menit; bisa dicicil per jalur.
- Hasil: status tiap simpul **Kuasai / Rapuh / Bolong** + pola salah yang dominan
  + titik mulai latihan (simpul bolong paling bawah).

### 5.4 Analisis salah & feedback

Alur cek satu jawaban:
1. Normalisasi (2/4 = 0,5 = ½; spasi; koma desimal).
2. Cocok kunci → benar.
3. Cocok **aturan pola salah** → sebut kemungkinan salahnya.
   Contoh: ½ + ⅓ dijawab 2/5 → `PEC-JUMLAH-LURUS` (pembilang+pembilang, penyebut+penyebut).
4. Tidak cocok → "tak dikenal", dicatat untuk ditinjau (bahan aturan baru).

Mode C (per langkah) untuk J11–J13: tiap langkah dicek apakah setara dengan langkah sebelumnya;
langkah pertama yang tak setara = titik jatuh, dicocokkan dengan pola salah langkah
(mis. `PERS-PINDAH-TANDA-TETAP`: memindah +3 ke ruas kanan tetap +3).

Feedback 3 lapis:
1. **Sebut**: "Sepertinya kamu menjumlah penyebutnya juga."
2. **Tunjukkan**: contoh tandingan/gambar (½ + ½ jadi 2/4 = ½? aneh, kan?).
3. **Coba lagi**: soal kembar dengan angka lain.

### 5.5 Evaluasi berkelanjutan

- Profil salah per siswa: hitungan tiap pola salah, yang lama makin berkurang bobotnya.
- Pola sama muncul ≥ 2 kali dalam 5 soal terakhir → masuk remedi simpul itu.
- Laporan kumpulan: pola salah terbanyak per jalur/jenjang (bahan konten & video).
- Jawaban "tak dikenal" dikumpulkan; Sultan Agung usul aturan baru, Dewi Sartika menguji.

### 5.6 Modul

Per simpul: konsep singkat → contoh → latihan bertahap (langkah kecil gaya Kumon)
→ cek lancar. Bahasa ramah & tidak merendahkan siswa SMA (bingkai: "isi ulang pondasi").

### 5.7 Tim agen

| Skill | Tokoh | Keahlian |
|---|---|---|
| `gajahmada-koordinator` | Gajah Mada | pecah tugas, atur urutan, panggil agen lain |
| `kihajar-kurikulum` | Ki Hajar Dewantara | peta kurikulum, Kurikulum Merdeka/AKM, desain diagnostik & modul |
| `malahayati-riset-soal` | Malahayati | riset Kumon, AKM, PISA, Gradient; amati–tiru–modifikasi |
| `sultanagung-bank-soal-mtk` | Sultan Agung | templat soal MTK & aturan pola salah |
| `habibie-fisika` | B.J. Habibie | soal ubah rumus & fisika, jembatan MTK → fisika |
| `kartini-literasi-modul` | R.A. Kartini | soal cerita, bahasa modul, teks feedback |
| `dewisartika-penguji` | Dewi Sartika | verifikasi kunci, pola salah, & hitungan dengan skrip |
| `djuanda-developer` | Ir. Djuanda | format data, mesin cek jawaban & diagnostik, platform |
| `radensaleh-kreatif-game` | Raden Saleh | tim kreatif pendamping Djuanda: riset app belajar ala game (Duolingo, Prodigy, dll.) & game mobile favorit anak; ubah fitur yang bikin betah jadi usulan fitur UDcation |

Tiap skill: `.claude/skills/<nama>/SKILL.md` (peran, tugas, aturan, file yang dipegang, kapan
serah ke agen lain). Tiap agen: `.claude/agents/<nama>.md` (ringkas, mengarah ke skill-nya).

## 6. Urutan kerja tahap ini (keputusan Claude, bisa dikoreksi)

1. Buat 9 skill + agen.
2. Malahayati: riset Kumon/AKM/Gradient → `platform/riset/`. Raden Saleh: riset gamifikasi → `platform/riset/riset-gamifikasi.md`.
3. Ki Hajar: peta kurikulum lengkap J1–J15 (garis besar semua simpul).
4. Djuanda: skema JSON + mesin cek jawaban (TypeScript, dengan tes) — keputusan Claude:
   TypeScript karena platform web nanti & sejalan dengan `studio/`.
5. Isi penuh 3 jalur dulu: **J7 pecahan operasi, J12 persamaan linear, J13 ubah rumus**
   (paling sering bikin siswa SMA macet). Jalur lain menyusul.
6. Dewi Sartika: verifikasi semua kunci & pola salah.

## 7. Diserahkan ke pembangun

Rincian simpul, angka target waktu, isi tiap templat, struktur file mesin, dan teks feedback.
