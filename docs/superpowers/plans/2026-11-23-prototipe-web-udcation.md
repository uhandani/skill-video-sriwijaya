# Prototipe Web UDcation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplikasi web HP-first untuk uji coba kelas: siswa login Google → gabung kelas → diagnostik → latihan dengan feedback; guru → kelas → dasbor + CSV.

**Architecture:** `platform/web/` (Vite + React + TS) mengimpor mesin `platform/src` & `platform/konten`. Batas pindah ke Next.js (opsi B): semua mesin lewat `web/src/penilai.ts`, semua data lewat antarmuka `Data` di `web/src/data/`. Logika murni (latihan, ringkas kelas, CSV, antrean) dipisah dari komponen supaya bisa dites tanpa browser. Implementasi `Data`: `dataMemori` (tes & mode demo) dan `dataSupabase` (produksi, RLS).

**Tech Stack:** Vite 6, React 19, React Router 7, @supabase/supabase-js 2, vitest 3.2.4, Playwright (sudah terpasang di mesin), TypeScript 5.9.3.

**Spec:** `docs/superpowers/specs/2026-11-23-prototipe-web-udcation-design.md`

## Global Constraints

- Jalur uji coba: `J07`, `J12`, `J13` saja. Diagnostik jenjang `"SMA"`.
- Diagnostik tanpa feedback; latihan: `sebut` → tombol "Tunjukkan" → `tunjukkan` → soal kembar (seed baru).
- Lancar: 10 jawaban latihan terakhir di simpul, akurasi ≥ 0,9 dan rata-rata detik < `targetDetik`.
- Remedi (`perluRemedi`) → tampilkan modul lagi.
- Tombol bantu: `/` `²` `√` `(` `)` `−`.
- Peran guru hanya bila email ada di `guru_diizinkan`; siswa hanya melihat datanya sendiri; guru hanya kelas miliknya.
- Kode kelas 7 karakter dari `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (tanpa O/0/I/1).
- Satu siswa satu kelas aktif.
- Warna: navy `#262B4A`, marun `#6A1A25`, emas `#EDB53D`, krem `#F1E6D0`; font Cormorant Garamond + Mulish; token di `:root`.
- Tanpa iklan/pelacak; simpan hanya nama, email, jawaban.
- Teks UI Bahasa Indonesia.

## Review Focus

1. **Sinyal putus saat mengirim jawaban** → masuk antrean lokal, terkirim saat online, tidak dobel (id jawaban dibuat di klien, `upsert`) → tes di Task 3.
2. **Siswa membaca jawaban siswa lain / menjadikan diri guru lewat API** → ditolak RLS → tes SQL di Task 6.
3. **Kode kelas salah, kelas nonaktif, atau sudah punya kelas** → pesan jelas, tidak crash → tes di Task 3 (`gabungKelas`).
4. **Tab ditutup di tengah diagnostik** → saat kembali, jalur itu diulang dari awal; status jalur lain tidak rusak → tes di Task 4.
5. **Simpul tanpa riwayat / CSV dengan koma & kutip di jawaban** → `sudahLancar` false; CSV di-escape benar → tes di Task 2 & 5.

---

### Task 1: Kerangka `platform/web` + `penilai.ts`

**Files:** Create `platform/web/{package.json,vite.config.ts,tsconfig.json,index.html}`, `platform/web/src/{main.tsx,gaya.css,penilai.ts}`; Test `platform/web/test/penilai.test.ts`

**Interfaces — Produces:**
```ts
JALUR_UJI = ["J07", "J12", "J13"] as const
templatSimpul(simpul: string): Templat<any>[]
ambilSoal(simpul: string, seed: number): Soal          // pilih templat = templats[seed % n]
nilaiJawaban(soal: Soal, teks: string): HasilCek & { umpan?: { sebut: string; tunjukkan: string } }
nilaiLangkah(awal: string, langkah: string[]): HasilLangkah   // POLA_LANGKAH, variabel "x"
modulSimpul(simpul: string): string | null              // isi markdown via import.meta.glob
simpulJalur(jalur: string): Simpul[]                    // dari peta.json
```
- [ ] **Step 1:** Tes: `ambilSoal("J07-05", 3)` deterministik & `templatId` diawali `T-J07-05`; `nilaiJawaban` untuk soal ½+⅓ jawaban "2/5" → `status: "pola"` dan `umpan.sebut` tidak kosong; "5/6" → tanpa `umpan`; `templatSimpul` tidak kosong untuk tiap simpul di J07/J12/J13; `modulSimpul("J12-04")` memuat "Dua langkah".
- [ ] **Step 2:** FAIL → buat paket (scripts `dev`, `build`, `test: vitest run`, `cek: tsc --noEmit`), `gaya.css` dengan token warna & font Google, `penilai.ts` → PASS; `npm run build` sukses. Commit `feat(web): kerangka dan penilai`.

### Task 2: Logika latihan (murni)

**Files:** Create `platform/web/src/latihan.ts`; Test `platform/web/test/latihan.test.ts`

**Interfaces — Produces:**
```ts
type CatatanLatihan = { simpul: string; benar: boolean; detik: number; polaId?: string };
sudahLancar(riwayat: CatatanLatihan[], simpul: string, targetDetik: number): boolean
simpulLatihanBerikut(jalur: string, status: Record<string, Status>): string | null   // simpul terendah bukan "kuasai"
seedBaru(): number                                        // crypto.getRandomValues
```
- [ ] **Step 1:** Tes: 10 benar cepat → true; 9 benar + 1 salah (0,9) cepat → true; 8/10 → false; 10 benar tapi rata-rata ≥ target → false; < 10 catatan → false; riwayat kosong → false; hanya catatan simpul itu yang dihitung; `simpulLatihanBerikut` mengembalikan null bila semua kuasai.
- [ ] **Step 2:** FAIL → implementasi → PASS. Commit `feat(web): logika latihan`.

### Task 3: Lapisan data + antrean offline

**Files:** Create `platform/web/src/data/{tipe.ts,memori.ts,supabase.ts,antrean.ts}`; Test `platform/web/test/{data-memori.test.ts,antrean.test.ts}`

**Interfaces — Produces (`tipe.ts`):**
```ts
type Peran = "siswa" | "guru";
type Pengguna = { id: string; nama: string; email: string; peran: Peran };
type Kelas = { id: string; nama: string; kode: string; aktif: boolean };
type BarisJawaban = { id: string; siswaId: string; kelasId: string; mode: "diagnostik"|"latihan"|"langkah";
  simpul: string; templatId: string; seed: number; teksJawaban: string; status: HasilCek["status"];
  polaId: string | null; detik: number; dibuat: string };
interface Data {
  pengguna(): Promise<Pengguna | null>; masukGoogle(): Promise<void>; keluar(): Promise<void>;
  kelasSaya(): Promise<Kelas | null>;                                  // siswa
  gabungKelas(kode: string): Promise<{ ok: true; kelas: Kelas } | { ok: false; alasan: "tidak-ada" | "nonaktif" | "sudah-punya-kelas" }>;
  simpanJawaban(j: BarisJawaban): Promise<void>;                         // upsert by id
  simpanStatus(simpul: string, status: Status, sumber: "diagnostik"|"latihan"): Promise<void>;
  statusSaya(): Promise<Record<string, Status>>;
  riwayatSaya(): Promise<BarisJawaban[]>;
  buatKelas(nama: string): Promise<Kelas>; kelasGuru(): Promise<Kelas[]>; aturAktif(kelasId: string, aktif: boolean): Promise<void>;
  siswaKelas(kelasId: string): Promise<Pengguna[]>; jawabanKelas(kelasId: string): Promise<BarisJawaban[]>;
  statusKelas(kelasId: string): Promise<{ siswaId: string; simpul: string; status: Status }[]>;
}
buatKodeKelas(acak?: () => number): string    // 7 karakter, alfabet Global Constraints
dataMemori(awal?: { pengguna?: Pengguna; guruDiizinkan?: string[] }): Data & { _masukSebagai(p: Omit<Pengguna,"peran">): void }
buatAntrean(kirim: (j: BarisJawaban) => Promise<void>, simpan: Pick<Storage,"getItem"|"setItem">): { tambah(j): Promise<void>; kirimUlang(): Promise<number>; jumlah(): number }
dataSupabase(url: string, kunci: string): Data
```
- [ ] **Step 1: Tes data-memori** — gabung kode benar → ok; kode tak ada → `tidak-ada`; kelas nonaktif → `nonaktif`; sudah anggota → `sudah-punya-kelas`; email di `guruDiizinkan` → peran guru, lainnya siswa; `simpanJawaban` dengan id sama dua kali → satu baris; `buatKodeKelas` 1000× → panjang 7, tanpa `O0I1`.
- [ ] **Step 2: Tes antrean** — `kirim` melempar → `jumlah()` 1 dan tersimpan di storage; `kirimUlang` setelah `kirim` pulih → 1 terkirim, `jumlah()` 0; antrean dibuat ulang dari storage yang sama memuat item tertunda; kirim ulang dua kali tidak mengirim dobel.
- [ ] **Step 3:** FAIL → implementasi `memori.ts`, `antrean.ts`; `supabase.ts` memetakan tiap metode ke tabel spec §5.4 (snake_case), `masukGoogle` = `signInWithOAuth({ provider: "google", options: { redirectTo: location.origin } })` → PASS, `npm run cek` bersih. Commit `feat(web): lapisan data dan antrean offline`.

### Task 4: Layar siswa

**Files:** Create `platform/web/src/{App.tsx,konteks.tsx}`, `platform/web/src/siswa/{Masuk.tsx,GabungKelas.tsx,Beranda.tsx,Diagnostik.tsx,Hasil.tsx,Latihan.tsx,PapanBantu.tsx,KartuModul.tsx}`, `platform/web/src/diagnostikLokal.ts`; Test `platform/web/test/diagnostikLokal.test.ts`, `platform/web/e2e/siswa.spec.ts`

**Interfaces — Consumes:** `penilai.ts`, `latihan.ts`, `Data`. **Produces:**
- `simpanSesi(jalur, sesi) / muatSesi(jalur): SesiDiagnostik | null / hapusSesi(jalur)` di `diagnostikLokal.ts` — `muatSesi` mengembalikan null bila data rusak/versi beda (jalur diulang).
- Rute: `/masuk`, `/gabung`, `/`, `/tes/:jalur`, `/hasil/:jalur`, `/latihan/:simpul`. Mode demo: `?demo=1` memakai `dataMemori` (untuk e2e & pratinjau tanpa Supabase).
- [ ] **Step 1: Tes unit** — sesi tersimpan lalu dimuat sama; JSON rusak → null; hapus satu jalur tidak menyentuh jalur lain.
- [ ] **Step 2: Tes e2e (Playwright, viewport 390×844, `?demo=1`)** — masuk → gabung kode demo `UDDEMO7` → beranda menampilkan 3 jalur → tes J07 dengan menjawab semua salah → hasil menampilkan "bolong" & tombol latihan → latihan: jawab pola salah → teks `sebut` tampil → klik "Tunjukkan" → `tunjukkan` tampil → soal kembar baru tampil; tombol `²` menyisipkan "²" ke isian.
- [ ] **Step 3:** FAIL → implementasi. Detail: `Diagnostik` memakai `mulaiDiagnostik/simpulBerikut/catat` + `ambilSoal(simpul, seedBaru())`, menyimpan tiap jawaban (`mode: "diagnostik"`) lewat antrean, selesai → `simpanStatus` semua simpul (`sumber: "diagnostik"`). `Latihan` mencatat detik dari soal tampil sampai Periksa; lancar → `simpanStatus(simpul,"kuasai","latihan")` lalu ke `simpulLatihanBerikut`; `perluRemedi` → `KartuModul` tampil lagi; J12 ada tombol "Tulis langkah" (`nilaiLangkah`). → PASS (`npx playwright test`). Commit `feat(web): layar siswa`.

### Task 5: Layar guru + ringkasan & CSV

**Files:** Create `platform/web/src/guru/{KelasSaya.tsx,Dasbor.tsx,TabSiswa.tsx,TabPola.tsx,TabTakDikenal.tsx,TabWaktu.tsx}`, `platform/web/src/ringkasKelas.ts`; Test `platform/web/test/ringkasKelas.test.ts`, `platform/web/e2e/guru.spec.ts`

**Interfaces — Produces:**
```ts
polaTerbanyak(j: BarisJawaban[]): { polaId: string; jumlah: number; nama: string }[]
takDikenal(j: BarisJawaban[]): BarisJawaban[]                      // status "tak-dikenal", terbaru dulu
waktuPerSimpul(j: BarisJawaban[]): { simpul: string; rataDetik: number; target: number; n: number }[]   // mode latihan saja
keCsv(j: BarisJawaban[], siswa: Pengguna[]): string               // header: waktu,nama,email,mode,simpul,templat,jawaban,status,pola,detik
```
- [ ] **Step 1: Tes** — `polaTerbanyak` urut turun & memakai nama dari `pola-salah.json`; `takDikenal` hanya status itu; `waktuPerSimpul` mengabaikan diagnostik; `keCsv` meng-escape `"1,5"` → `"\"1,5\""` dan kutip ganda dobel; e2e guru (`?demo=1&peran=guru`): buat kelas → kode 7 karakter tampil → dasbor 4 tab terbuka tanpa error.
- [ ] **Step 2:** FAIL → implementasi (unduh CSV via `Blob` + `<a download>`) → PASS. Commit `feat(web): layar guru`.

### Task 6: Supabase — skema, RLS, uji keamanan

**Files:** Create `platform/web/supabase/skema.sql`, `platform/web/supabase/uji-rls.sql`

- [ ] **Step 1:** `skema.sql`: tabel spec §5.4; trigger `on auth.users insert` membuat `profil` (nama dari `raw_user_meta_data.full_name`, peran `guru` bila email di `guru_diizinkan`); fungsi `gabung_kelas(kode text)` (security definer) mengembalikan `ok/tidak-ada/nonaktif/sudah-punya-kelas`; RLS: `profil` baca diri sendiri + guru baca anggota kelasnya, **update `peran` ditolak** (kolom tidak bisa diubah klien); `jawaban`/`status_simpul` insert/select milik sendiri, guru select untuk kelas miliknya; `kelas` insert/update hanya peran guru & milik sendiri.
- [ ] **Step 2:** `uji-rls.sql` (dijalankan dengan `set role authenticated` + `request.jwt.claims`): siswa A tidak bisa select jawaban siswa B (0 baris); siswa A `update profil set peran='guru'` gagal; guru G tidak melihat jawaban kelas guru lain; siswa tidak bisa insert kelas.
- [ ] **Step 3:** Minta persetujuan pemilik lalu buat proyek Supabase (paket gratis) lewat konektor; `apply_migration` skema; jalankan uji RLS lewat `execute_sql` → semua asersi lulus. Masukkan email guru **setelah pemilik mengonfirmasi email itu di chat**. Commit `feat(web): skema dan RLS Supabase`.

### Task 7: Login Google, deploy, panduan

**Files:** Create `platform/web/PANDUAN-LOGIN-GOOGLE.md`, `platform/web/README.md`; Modify `platform/README.md`, `CLAUDE.md`

- [ ] **Step 1:** Panduan langkah demi langkah (Bahasa Indonesia, untuk guru non-programmer): buat proyek Google Cloud → layar persetujuan OAuth → OAuth Client (Web) dengan redirect `https://<proyek>.supabase.co/auth/v1/callback` → tempel Client ID & Secret di Supabase Auth → Providers → Google; tambahkan URL Vercel ke Site URL & Redirect URLs.
- [ ] **Step 2:** Deploy ke Vercel (persetujuan pemilik): root `platform/web`, env `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Verifikasi: buka URL produksi di Playwright `?demo=1` → beranda tampil; tanpa demo → tombol "Masuk dengan Google" tampil.
- [ ] **Step 3:** README (cara jalan lokal, mode demo, struktur, batas pindah ke opsi B); CLAUDE.md tambah baris `platform/web`. Commit & push.
