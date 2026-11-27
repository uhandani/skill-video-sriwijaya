# Platform UDcation — mesin & konten (tahap konten)

Mesin murni TypeScript (tanpa UI/server) untuk platform belajar numerasi & literasi UDcation:
baca jawaban siswa → cocokkan pola salah → feedback 3 lapis → profil salah → diagnostik adaptif.

Desain: `../docs/superpowers/specs/2026-11-23-platform-udcation-design.md` ·
Rencana: `../docs/superpowers/plans/2026-11-23-platform-udcation-konten.md`

## Perintah

```bash
npm install
npm test          # semua tes (mesin + validator konten, 200 seed per templat)
npm run cek       # tsc --noEmit
npm run verifikasi  # ekspor 20 soal/templat, hitung ulang kunci dengan Python
```

## Struktur

| Path | Isi |
|---|---|
| `src/pecahan.ts` | bilangan rasional (`pec`, `tambah`, `kali`, …) |
| `src/baca.ts` | baca ketikan siswa: `0,5`, `½`, `1 1/2`, `-3/4`; tandai `belumSederhana` |
| `src/ekspresi.ts` | parser ekspresi (`2x`, `ma`, `v²`, `√(2E/m)`) & `setara()` numerik |
| `src/templat.ts` | tipe `Templat`, `buatSoal(templat, seed)`, `samaJawaban` |
| `src/cek.ts` | `cekJawaban(soal, teks)` → `benar` / `pola` (+`polaId`) / `tak-dikenal` / `tak-terbaca` |
| `src/langkah.ts` | mode per langkah untuk persamaan: `cekLangkah(awal, langkah[], "x", POLA_LANGKAH)` |
| `src/diagnostik.ts` | tes adaptif: `mulaiDiagnostik` → `simpulBerikut` / `catat` → `ringkasan` (Kuasai/Rapuh/Bolong, titik mulai) |
| `src/profil.ts` | profil salah, `perluRemedi` (pola sama ≥ 2× dalam 5), `polaDominan`, `laporanKumpulan` |
| `konten/peta.json` | peta Tangga Pondasi J01–J15 (80 simpul, prasyarat, fase, target detik) |
| `konten/pola-salah.json` | pola salah + teks feedback `sebut` & `tunjukkan` (+ sumber) |
| `konten/templat/` | templat soal berparameter: J07 pecahan, J12 persamaan, J13 ubah rumus |
| `konten/pola-langkah.ts` | pola salah per langkah (mode C) |
| `konten/modul/` | modul per simpul J07, J12, J13 |
| `riset/` | riset soal (Kumon, AKM, Gradient, miskonsepsi) & riset gamifikasi |
| `verify/cek_kunci.py` | verifikasi independen kunci jawaban |

## Menambah konten

1. Simpul baru → `konten/peta.json` (Ki Hajar).
2. Templat → `konten/templat/jXX-*.ts`, daftarkan di `konten/templat/index.ts`. Pakai `unik()` dari
   `bantu.ts` supaya kunci ≠ jawaban pola (Sultan Agung / Habibie).
3. Tiap `polaId` baru → `konten/pola-salah.json` dengan `sebut` & `tunjukkan` (Kartini).
4. Modul → `konten/modul/<idSimpul>.md`, sebut id templat dalam backtick; tambahkan jalur ke
   `JALUR_PENUH` di `test/konten.test.ts`.
5. `npm test && npm run verifikasi` (Dewi Sartika). Untuk pola teks soal baru, tambahkan pembacanya di
   `verify/cek_kunci.py`.

## Aplikasi web

Prototipe uji coba kelas ada di `web/` — lihat `web/README.md`.

## Tim agen

Panggil skill dengan nama: `/gajahmada-koordinator`, `/kihajar-kurikulum`, `/malahayati-riset-soal`,
`/sultanagung-bank-soal-mtk`, `/habibie-fisika`, `/kartini-literasi-modul`, `/dewisartika-penguji`,
`/djuanda-developer`, `/radensaleh-kreatif-game`.
