# Prototipe Web UDcation (Uji Coba Kelas) — Desain

Tanggal: 2026-11-23 · Status: menunggu persetujuan · Lanjutan dari
`2026-11-23-platform-udcation-design.md` (mesin & konten di `platform/` sudah jadi).

## 1. Kenapa

Mesin cek jawaban, diagnostik, dan konten J07/J12/J13 sudah ada, tapi belum bisa dipakai siswa.
Pemilik (guru MTK & fisika SMA) ingin **uji coba di kelasnya sendiri** untuk mendapat data nyata:
target waktu yang pas, jawaban salah yang belum dikenali mesin, dan apakah siswa suka.
Karena tujuannya data, **guru harus bisa melihat hasil tiap siswa**.

## 2. Tujuan, bukan-tujuan, anti-tujuan

**Tujuan**
- Siswa login Google, gabung kelas dengan kode, ikut tes diagnostik J07/J12/J13, lalu latihan di simpul
  yang bolong dengan feedback 3 lapis.
- Guru login Google, membuat kelas, melihat hasil per siswa & per simpul, pola salah terbanyak,
  jawaban "tak dikenal", dan waktu per simpul; bisa unduh CSV.
- Online lewat satu link (Vercel), enak di HP, tetap baik di laptop.

**Bukan tujuan sekarang:** peta kerajaan, kartu tokoh, gelar, streak, pembayaran, jalur selain J07/J12/J13,
aplikasi Android/iOS.

**Anti-tujuan** (gagal walau jalan):
- Siswa bisa melihat data siswa lain, atau siapa pun bisa menjadikan dirinya guru.
- Login/gabung kelas ribet sampai siswa menyerah sebelum soal pertama.
- Berat/lambat di HP murah atau sinyal lemah; jawaban hilang saat sinyal putus.
- Mengetik pecahan/rumus di HP menyusahkan (tidak ada tombol / ² √).

## 3. Batasan

- Data siswa (banyak di bawah umur): simpan seperlunya saja (nama & email dari Google, jawaban). Tanpa iklan,
  tanpa pelacak pihak ketiga.
- Login Google lewat Supabase Auth: pemilik perlu membuat OAuth Client di Google Cloud Console (dipandu).
- Layanan: Supabase (database + auth) dan Vercel (hosting) yang sudah terhubung; paket gratis cukup untuk
  satu–beberapa kelas.
- Gaya visual "Nusantara Emas": navy `#262B4A`, marun `#6A1A25`, emas `#EDB53D` (fokus 1–2 per layar),
  krem `#F1E6D0`; font Cormorant Garamond (judul) + Mulish (teks); logo Δ Kawung.

## 4. Pendekatan

| | Cara | Plus | Minus |
|---|---|---|---|
| **A** | **Aplikasi web ringan React + Vite; mesin jalan di browser; Supabase + aturan keamanan baris (RLS)** | cepat dibuat, ringan, tanpa server | kunci bisa "diintip" siswa yang paham teknik |
| B | Next.js; cek jawaban di server | kunci aman, siap versi berbayar | lebih lama, lebih banyak bagian |

**Dipilih pemilik: A**, dengan syarat **bisa pindah ke B nanti**. Cara menjaga itu:
semua pemanggilan mesin lewat satu modul `penilai.ts` (`ambilSoal`, `nilaiJawaban`, `nilaiLangkah`), dan semua
akses data lewat satu modul `data.ts`. Pindah ke B = mengganti isi dua modul itu dengan panggilan ke server;
layar tidak berubah. Mesin `platform/src` tetap TypeScript murni.

Login: dipilih pemilik **Google** (bukan kode+PIN atau email+password).

## 5. Desain

### 5.1 Alur siswa

```
[Masuk dengan Google] → [Gabung kelas: ketik kode, mis. KAWUNG7] (sekali saja)
→ Beranda → Tes diagnostik (per jalur) → Hasil → Latihan simpul → … 
```

Beranda (HP):
```
┌──────────────────────────┐
│ Δ UDcation      Hai, Rina│
│ Isi ulang pondasimu      │
│ ─ Pecahan (J07)   ●●●○○○○│  ● kuasai  ◐ rapuh  ○ bolong
│   [Lanjut latihan]       │
│ ─ Persamaan (J12) belum  │
│   [Mulai tes, ±8 menit]  │
│ ─ Ubah rumus (J13) belum │
│   [Mulai tes]            │
└──────────────────────────┘
```

Layar soal:
```
┌──────────────────────────┐
│ Pecahan · soal 3         │
│ Hitung: 2/3 ÷ 3/4 = …    │
│ ┌──────────────────────┐ │
│ │ 8/9                  │ │
│ └──────────────────────┘ │
│ [ / ][ ² ][ √ ][ ( ][ ) ][−]   ← tombol bantu
│        [ Periksa ]       │
└──────────────────────────┘
```

- **Diagnostik**: pakai `mulaiDiagnostik` (jenjang SMA) per jalur, satu soal per layar, soal dari templat simpul
  terkait dengan seed acak. Selama diagnostik **tanpa feedback** (hanya "tersimpan"), supaya cepat & murni.
  Hasil: daftar simpul dengan status + titik mulai.
- **Latihan** di titik mulai: kartu modul singkat (isi `konten/modul/<simpul>.md`) → soal → bila salah:
  lapis 1 `sebut`, tombol "Tunjukkan" → lapis 2 `tunjukkan`, lalu **soal kembar** (seed baru). Tak dikenal:
  "Hmm, jawabanmu belum kami kenali — coba cek lagi", jawabannya dicatat untuk guru.
- **Syarat lancar**: 10 soal terakhir di simpul itu akurasi ≥ 90 % dan rata-rata < `targetDetik` → simpul
  jadi kuasai, lanjut ke simpul berikut. `perluRemedi` → kembali tampilkan modul.
- **Mode langkah** (J12): tombol "Tulis langkah" opsional; tiap baris satu langkah, dinilai `cekLangkah`.
- Sinyal putus: jawaban disimpan dulu di antrean lokal lalu dikirim ulang (tidak hilang).

### 5.2 Alur guru

```
[Masuk dengan Google] → Kelas saya → [Buat kelas] → kode tampil (salin / bagikan)
→ Dasbor kelas:
   Tab Siswa  : tabel siswa × simpul (warna kuasai/rapuh/bolong), klik siswa → riwayat jawabannya
   Tab Pola   : pola salah terbanyak di kelas (laporanKumpulan) + teks feedbacknya
   Tab Tak dikenal : jawaban yang tak cocok kunci/pola (soal, jawaban, siswa) — bahan pola baru
   Tab Waktu  : rata-rata detik per simpul vs targetDetik
   [Unduh CSV semua jawaban]
```

### 5.3 Peran & keamanan

- Peran `guru` **tidak bisa dipilih sendiri**: hanya email di tabel `guru_diizinkan` (diisi pemilik/Claude lewat
  SQL; awalnya email pemilik). Semua akun lain = siswa.
- RLS: siswa hanya bisa membaca/menulis datanya sendiri; guru hanya bisa membaca data siswa di kelas miliknya.
  Siswa tidak bisa membaca daftar siswa lain.
- Kode kelas: 6–7 huruf/angka acak tanpa huruf mirip (O/0, I/1); bisa dinonaktifkan guru.

### 5.4 Data (Supabase/Postgres)

| Tabel | Kolom pokok |
|---|---|
| `profil` | `id` (= auth user), `nama`, `email`, `peran` (`siswa`/`guru`), `dibuat` |
| `guru_diizinkan` | `email` |
| `kelas` | `id`, `nama`, `kode` (unik), `guru_id`, `aktif`, `dibuat` |
| `anggota` | `kelas_id`, `siswa_id`, `bergabung` |
| `jawaban` | `id`, `siswa_id`, `kelas_id`, `mode` (`diagnostik`/`latihan`/`langkah`), `simpul`, `templat_id`, `seed`, `teks_jawaban`, `status`, `pola_id`, `detik`, `dibuat` |
| `status_simpul` | `siswa_id`, `simpul`, `status`, `sumber` (`diagnostik`/`latihan`), `diperbarui` |

Satu siswa satu kelas aktif (cukup untuk uji coba).

### 5.5 Teknis (keputusan Claude)

- Folder `platform/web/` (Vite + React + TypeScript), mengimpor `platform/src` & `platform/konten` langsung.
- Router sederhana (React Router), Supabase JS client, tanpa pustaka UI besar (CSS sendiri, token warna di `:root`).
- Tes: unit test untuk `penilai.ts`, alur latihan (syarat lancar), dan antrean offline (vitest); satu uji
  ujung-ke-ujung Playwright untuk alur siswa dengan Supabase tiruan/lokal; uji RLS dengan SQL.
- Deploy Vercel dari repo (folder `platform/web`), variabel `VITE_SUPABASE_URL` & kunci publik.

## 6. Yang dikerjakan pemilik

1. Buat OAuth Client di Google Cloud Console (dipandu langkah demi langkah) dan tempel ID/secret di Supabase.
2. Setujui pembuatan proyek Supabase & Vercel baru (paket gratis).
3. Uji coba: buat kelas, bagikan kode ke siswa.

## 7. Diserahkan ke pembangun

Struktur komponen, detail CSS, teks UI kecil, jumlah soal per diagnostik per simpul (ikut mesin: 2–3),
cara menampilkan modul markdown, format CSV.
