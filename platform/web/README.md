# UDcation Web — prototipe uji coba kelas

Aplikasi web HP-first: siswa masuk Google → gabung kelas (kode) → tes diagnostik J07/J12/J13 → latihan
dengan feedback berlapis. Guru: buat kelas, dasbor (Siswa · Pola salah · Tak dikenal · Waktu), unduh CSV.
Desain: `../../docs/superpowers/specs/2026-11-23-prototipe-web-udcation-design.md`.

## Jalankan

```bash
npm install
npm run dev            # http://localhost:5173/?demo=1  (mode demo: tanpa login & database)
npm test               # unit test
npm run cek            # tsc
npm run e2e            # build + uji ujung-ke-ujung (Playwright, viewport HP)
npm run uji-rls        # uji keamanan database di Postgres lokal sementara
```

Mode demo: `/?demo=1` (siswa, kode kelas `KAWUNG7`) dan `/?demo=1&peran=guru`. Data demo hanya di memori.

Produksi: buat `.env.local` berisi `VITE_SUPABASE_URL=…` dan `VITE_SUPABASE_ANON_KEY=…` (kunci publik).
Database: jalankan `supabase/skema.sql` di proyek Supabase. Login Google: `PANDUAN-LOGIN-GOOGLE.md`.

## Struktur

| Path | Isi |
|---|---|
| `src/penilai.ts` | **satu-satunya pintu ke mesin** (`ambilSoal`, `nilaiJawaban`, `nilaiLangkah`, modul) |
| `src/data/tipe.ts` | antarmuka `Data` — **satu-satunya pintu ke data** |
| `src/data/supabase.ts`, `memori.ts` | implementasi produksi & demo/tes |
| `src/data/antrean.ts` | antrean jawaban saat sinyal putus |
| `src/latihan.ts`, `src/ringkasKelas.ts`, `src/diagnostikLokal.ts` | logika murni (dites) |
| `src/siswa/`, `src/guru/` | layar |
| `supabase/skema.sql`, `uji-rls.sql` | tabel, RLS, fungsi `gabung_kelas`; uji keamanan |

## Pindah ke opsi B (Next.js, cek jawaban di server)

Layar tidak perlu diubah. Ganti isi `src/penilai.ts` dengan panggilan API server (server memakai `platform/src`
& `platform/konten` yang sama) dan, bila perlu, `src/data/supabase.ts`. Kunci jawaban lalu tidak lagi dikirim ke browser.
