---
name: video-ruang-hitung
description: Membuat video pendek MATEMATIKA pilar "Ruang Hitung" UDcation (juga konten Fakta Unik) bergaya khas "Nusantara Emas" — navy + marun, motif kawung, foil emas, subtitle karaoke, logo Δ Kawung Cetak Biru, rumus KaTeX, diagram & grafik, voice-over ElevenLabs, plus thumbnail — dengan Remotion. Ini juga skill INTI: mesin video, alur kerja, dan referensi bersama untuk skill video-ruang-semesta (fisika) dan video-ruang-nusantara (sejarah & budaya). Gunakan saat pengguna minta video/Reels/Shorts UDcation tentang MTK (aljabar, geometri, bilangan, peluang, sejarah simbol MTK) atau revisi video UDcation.
---

# Video Ruang Hitung (MTK) — inti UDcation

> **Tiga pilar, tiga skill, satu mesin:**
> Ruang Hitung (MTK) → skill ini · Ruang Semesta (fisika) → `video-ruang-semesta` ·
> Ruang Nusantara (sejarah & budaya × sains) → `video-ruang-nusantara`.
> Warna & motif otomatis dari `"pilar"` di storyboard — lihat `references/tema-ilustrasi-thumbnail.md`.

Skill ini mengubah satu topik MTK/fisika menjadi video vertikal 9:16 (atau 16:9) dengan
identitas visual UDcation yang konsisten. **Satu video = satu file storyboard JSON.**
Semua komponen visual sudah ada di proyek Remotion `studio/` dan dipakai ulang.

## Peta repo

| Path | Isi |
|---|---|
| `studio/` | Proyek Remotion (React). Komponen, adegan, storyboard, skrip cek. |
| `studio/src/storyboards/*.json` | Storyboard tiap video + `index.ts` (daftar video) |
| `studio/verify/*.py` | Skrip verifikasi angka/rumus per video (wajib) |
| `branding/` | Logo resmi **Δ Kawung Cetak Biru** (garis emas, tanpa arsiran) SVG/PNG, dokumen brand, generator aset |
| `.claude/skills/video-ruang-hitung/references/` | Panduan rinci (baca sesuai kebutuhan) |

Jika `studio/` belum ada `node_modules`, jalankan `cd studio && npm install` dulu.

## Alur kerja (ikuti berurutan)

1. **Pahami permintaan.** Tentukan topik, tingkat penonton (SMP/SMA/umum), **pilar**
   (Ruang Hitung = MTK · Ruang Semesta = fisika · Fakta Unik · Jejak Ilmu Nusantara),
   dan **mode narasi** → baca `references/narrative-modes.md`.
   Jika topik Nusantara/sejarah dan faktanya meragukan → tanya pengguna, jangan mengarang.
2. **Tulis naskah** per adegan (kalimat pendek, Bahasa Indonesia, ±2,6 kata/detik,
   angka ditulis seperti diucapkan: "dua puluh lima").
3. **Verifikasi isi** → `references/accuracy.md`. Buat `studio/verify/<nama-file>.py`
   yang meng-assert setiap angka di narasi, rumus, grafik, dan simulasi. Jalankan sampai OK.
4. **Susun storyboard JSON** — termasuk lapisan `"ilustrasi"` untuk benda/tokoh/tempat yang disebut
   (lihat `references/tema-ilustrasi-thumbnail.md` → "Lapisan ilustrasi").
   Simpan di `studio/src/storyboards/<nama-file>.json`, pilih tipe adegan
   dari `references/scene-library.md`. Daftarkan di `studio/src/storyboards/index.ts`.
   Koordinat geometri yang rumit → hitung dengan skrip Python, jangan ditebak.
5. **Cek otomatis:** `cd studio && npm run cek && npm run verifikasi && npx tsc --noEmit`.
6. **Cek visual:** render 6–9 still lalu LIHAT gambarnya (Read) dan cocokkan dengan
   checklist di bawah:
   `npx remotion render <Id> out/cek --frames=30,120,... --image-format=png --scale=0.5`
7. **Voice-over** (bila diminta / konektor ElevenLabs tersedia): generate per adegan dengan suara
   UDcation "Saos Cocol", simpan ke `public/audio/<nama>/<n>-<id>.mp3`, lalu
   `npm run sinkron -- src/storyboards/<nama>.json` (subtitle, durasi, dan isyarat `"kata"`
   otomatis menyesuaikan suara). Detail & aturan antrean paket Free → `references/production.md`.
8. **Thumbnail**: isi `"thumbnail"` (hook "wow" + rumus/ilustrasi), lalu
   `npx remotion still <Id>-thumb out/thumb/<Id>.png` dan `<Id>-thumb-yt` → LIHAT hasilnya.
   Rumus hook & format → `references/tema-ilustrasi-thumbnail.md`.
9. **Render final** (hanya setelah cek lolos):
   `npx remotion render <Id> out/<Id>.mp4 --codec=h264 --crf=20`
10. Laporkan ke pengguna: file MP4, durasi, ringkasan adegan, hal yang belum (mis. VO/musik).

Perintah lengkap, audio/voice-over, dan catatan lingkungan → `references/production.md`.

## Aturan gaya yang tidak boleh dilanggar

- `"pilar": "Ruang Hitung"` (MTK) → navy `#262B4A`, cokelat `#8E5227`, marun `#6A1A25`, motif kawung.
  Emas `#EDB53D`, krem `#F1E6D0`, perkamen `#CDBFA6` sama di semua pilar. Pakai token `C.*`, jangan hex baru.
- **Emas hanya untuk 1–2 fokus per adegan** (rumus kunci, jawaban, titik penting).
  Di rumus: bungkus bagian kunci dengan `\g{...}`.
- Latar selalu bertekstur (komponen `Background`: navy/cokelat/perkamen/kayu) — tidak ada warna polos.
- Tidak ada hard-cut: transisi `iris` (default), `fade`, atau `perkamen` (untuk "yang salah / masa lalu").
- Video dibuka dengan **pena emas** menggambar di perkamen (`diagram` + `"pena": true`, `bg: "perkamen"`)
  ATAU hook `title` dengan tanda tanya emas. Adegan terakhir selalu `outro` (logo Δ Kawung Cetak Biru tergambar garis demi garis).
- Subtitle dibuat otomatis dari `narasi` — jangan menaruh rumus di narasi; tulis seperti diucapkan.
- Teks di dalam safe area: atas 8%, bawah 18% (bar subtitle di ±74%), samping 6%.

## Checklist sebelum render final

- [ ] `npm run cek` lolos (durasi cukup untuk jumlah kata, ada sumber, outro di akhir)
- [ ] `npm run verifikasi` lolos (semua angka benar)
- [ ] Still frame: tidak ada teks terpotong/bertumpuk, subtitle tidak menutupi diagram penting
- [ ] Minimal 3 signature move: pena emas · iris cincin emas · draw-on · count-up · foil shine · fade perkamen
- [ ] Emas tidak dipakai berlebihan; tiap adegan punya satu fokus jelas
- [ ] Hook ≤ 7 detik dan memancing rasa ingin tahu; payoff menjawab hook
- [ ] Thumbnail `<Id>-thumb` & `<Id>-thumb-yt` dirender dan dicek
- [ ] **Tidak monoton**: benda/tokoh/tempat konkret di narasi punya ilustrasi yang muncul saat disebut
      (field `"ilustrasi"` di adegan mana pun) — minimal separuh adegan berilustrasi

## Menambah kemampuan baru

Jika sebuah topik butuh visual yang belum ada (mis. bandul, gelombang, rangkaian listrik),
buat komponen adegan baru di `studio/src/scenes/`, tambahkan tipenya di
`studio/src/storyboard/types.ts`, daftarkan di `SceneBody` (`studio/src/UDVideo.tsx`), lalu
**dokumentasikan di `references/scene-library.md`** agar bisa dipakai ulang video berikutnya.
Gerak fisika harus dihitung dari persamaannya (lihat `ProjectileScene.tsx`), bukan animasi asal.
