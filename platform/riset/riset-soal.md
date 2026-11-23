# Riset Soal & Metode — Malahayati (2026-11-23)

Prinsip: **amati–tiru–modifikasi** cara & urutan. Tidak ada teks soal yang disalin.

## 1. Kumon

| Diamati | Ditiru | Dimodifikasi untuk UDcation |
|---|---|---|
| 20+ level (6A → O), lembar kerja naik **sedikit demi sedikit** dari berhitung sampai materi SMA | Simpul kecil berurutan (`urutan`) per jalur | Urutan dibuat lintas jalur dengan `prasyarat`, bukan satu garis panjang, supaya siswa SMA langsung ke anak tangga bolong |
| Naik level hanya setelah **mahir** (mastery) | Syarat lancar: akurasi ≥ 0,9 & di bawah `targetDetik` | Waktu & akurasi dicatat otomatis; tidak perlu instruktur menilai |
| **Tes penempatan** gratis; banyak anak mulai di bawah/di atas kelasnya | Tes diagnostik adaptif sebelum latihan | Adaptif (cari biner), ≤ 25 menit, hasil Kuasai/Rapuh/Bolong per simpul |
| Pengulangan banyak lembar serupa | Templat berparameter → soal kembar tak terbatas | Ditambah analisis pola salah, bukan cuma ulang |

Catatan: tidak ditemukan angka resmi "waktu standar" per level dari sumber publik; target waktu UDcation ditetapkan sendiri lalu dikalibrasi dari data siswa.

Sumber: [Kumon Parents Guide](https://www.kumon.com/assets/us-en/pdfs/KUMON_PARENTS_GUIDE.pdf) ·
[Kumon — small-step worksheets](https://kumon.com/about-kumon/kumon-method/small-step-worksheets) ·
[Cuemath — Kumon levels](https://www.cuemath.com/blog/kumon-math-levels/) (sekunder)

## 2. AKM Numerasi (Pusmenjar)

- **Konten:** bilangan · geometri & pengukuran · aljabar · data & ketidakpastian.
- **Level kognitif:** pemahaman · penerapan · penalaran.
- **Konteks:** personal · sosial-budaya · saintifik.

Untuk UDcation: tiap templat diberi label konten AKM & level kognitif (nanti di peta); soal cerita
Kartini memakai konteks **sosial-budaya Nusantara** (pasar, sawah, pinisi) dan **saintifik** (fisika).
Perlu dicek ke dokumen resmi Pusmenjar (yang ditemukan baru sumber sekunder yang mengutipnya).

Sumber: [Gramedia — AKM](https://www.gramedia.com/literasi/akm/) ·
[Prosiding UNNES](https://proceeding.unnes.ac.id/prisma/article/download/4323/3846/9187) ·
[Jurnal UM Kuningan](https://jurnal.umkuningan.ac.id/index.php/jumlahku/article/download/3708/1583)

## 3. Gradient Academy

Tes diagnostik di menu latihan soal, **mastery per subtes**, rapor tiap sesi, tryout model IRT, asisten AI.
Ditiru: mastery per simpul + rapor. Dimodifikasi: UDcation fokus pondasi (bukan UTBK) dan
menjelaskan **kenapa** salah (pola salah), bukan hanya skor.

Sumber: [Google Play](https://play.google.com/store/apps/details?id=com.gradient.academy) ·
[gradient.academy/utbk](https://gradient.academy/utbk)

## 4. Miskonsepsi kandidat

### J7 — Pecahan
| Id usulan | Contoh salah | Sumber |
|---|---|---|
| `PEC-JUMLAH-LURUS` | ½ + ⅓ = 2/5 (pembilang+pembilang, penyebut+penyebut) — salah satu kesalahan paling sering | [NFER](https://www.nfer.ac.uk/assessment-hub/what-are-the-common-mistakes-when-adding-fractions/), [arXiv 2610.14735](https://arxiv.org/pdf/2610.14735) (Streefland 1991; Ni & Zhou 2005) |
| `PEC-SAMAKAN-PENYEBUT-SAJA` | ½ + ⅓ = 2/6 (penyebut disamakan, pembilang tidak diubah) | [ERIC EJ1139514](https://files.eric.ed.gov/fulltext/EJ1139514.pdf) |
| `PEC-KALI-SILANG` | ⅔ × ¾ = 9/8 (kali silang seperti membandingkan) | pola guru; dicek ulang |
| `PEC-BAGI-TANPA-BALIK` | ⅔ ÷ ¾ = 2/1… (bagi lurus pembilang/penyebut) | pola guru; dicek ulang |
| `PEC-BALIK-YANG-SALAH` | ⅔ ÷ ¾ = 3/2 × ¾ (yang dibalik pecahan pertama) | pola guru |
| `PEC-CAMPURAN-ABAIKAN-BULAT` | 1½ + ⅓ = 5/6 (bilangan bulat hilang) | pola guru |

Ide feedback dari riset: cek akal sehat "hasil penjumlahan harus lebih besar dari tiap suku" (2/5 < ½ → aneh).

### J12 — Persamaan linear
| Id usulan | Contoh salah | Sumber |
|---|---|---|
| `PERS-PINDAH-TANDA-TETAP` | 2x + 3 = 11 → 2x = 14 (pindah ruas tanpa ganti tanda; *switching addends*) | [Hall 2002, PoME 15](https://www.exeter.ac.uk/research/groups/education/pmej/pome15/errors.htm), [Wits](https://wiredspace.wits.ac.za/bitstreams/137964e3-9ef5-4268-b8da-e5d2be9472f7/download) |
| `PERS-BAGI-SATU-SUKU` | 2x + 6 = 10 → x + 6 = 5 (hanya satu suku dibagi) | [Core 270294089](https://core.ac.uk/download/270294089.pdf) |
| `PERS-KURANG-KOEF` | 3x = 12 → x = 9 (koefisien dikurangkan, bukan dibagi) | pola guru; dicek ulang |
| `PERS-KALI-BUKAN-BAGI` | 3x = 12 → x = 36 | pola guru |
| Tanda negatif | soal dengan bilangan negatif paling sering salah | Powell (dalam [Core 77937877](https://core.ac.uk/download/77937877.pdf)); Booth & Koedinger 2008 |

### J13 — Ubah rumus
| Id usulan | Contoh salah | Sumber |
|---|---|---|
| `RUMUS-BALIK-PECAHAN` | v = s/t → t = v/s | [MSOR journal](https://journals.gre.ac.uk/index.php/msor/article/view/1053/pdf), [MTU](https://mathematics.mtu.ie/common-errors-and-misconceptions) |
| `RUMUS-KALI-BUKAN-BAGI` | v = s/t → t = v·s (operasi kebalikan salah) | sama |
| `RUMUS-AKAR-LUPA` | Ek = ½mv² → v = 2Ek/m (lupa akar; kebalikan kuadrat adalah akar) | [MTU](https://mathematics.mtu.ie/common-errors-and-misconceptions) |
| `RUMUS-LUPA-KONSTANTA` | Ek = ½mv² → m = Ek/v² (½ hilang) | pola guru |
| `RUMUS-PINDAH-TANDA` | v = v₀ + at → a = (v + v₀)/t | pola guru; sejalan dengan `PERS-PINDAH-TANDA-TETAP` |

Strategi pengajaran yang didukung riset (untuk modul J13, Habibie & Kartini): buat **persamaan angka
kembar** (mis. 6 = 12/2), selesaikan, lalu terapkan langkah yang sama ke rumus; kerjakan dari variabel
target ke luar. Sumber: [SERC Carleton](https://serc.carleton.edu/mathyouneed/equations/ManEqInstructor.html).
