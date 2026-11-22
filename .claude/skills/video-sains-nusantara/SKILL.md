---
name: video-sains-nusantara
description: Membuat video pendek edukasi Matematika & Fisika bergaya khas UDcation ("Nusantara Emas" — tekstur batik/kawung, foil emas, subtitle marun karaoke, logo Δ Kawung) dengan Remotion. Gunakan setiap kali pengguna minta membuat video/Reels/Shorts/konten UDcation tentang konsep MTK, fisika, fakta unik sains, atau sejarah Nusantara yang dikaitkan dengan MTK/fisika — termasuk "buatkan video tentang X", "bikin konten Pythagoras", "video fisika gerak parabola", atau revisi video UDcation yang sudah ada.
---

# Video Sains Nusantara (UDcation)

Skill ini mengubah satu topik MTK/fisika menjadi video vertikal 9:16 (atau 16:9) dengan
identitas visual UDcation yang konsisten. **Satu video = satu file storyboard JSON.**
Semua komponen visual sudah ada di proyek Remotion `studio/` dan dipakai ulang.

## Peta repo

| Path | Isi |
|---|---|
| `studio/` | Proyek Remotion (React). Komponen, adegan, storyboard, skrip cek. |
| `studio/src/storyboards/*.json` | Storyboard tiap video + `index.ts` (daftar video) |
| `studio/verify/*.py` | Skrip verifikasi angka/rumus per video (wajib) |
| `branding/` | Logo Δ Kawung (SVG/PNG), dokumen brand, generator aset |
| `.claude/skills/video-sains-nusantara/references/` | Panduan rinci (baca sesuai kebutuhan) |

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
4. **Susun storyboard JSON** di `studio/src/storyboards/<nama-file>.json`, pilih tipe adegan
   dari `references/scene-library.md`. Daftarkan di `studio/src/storyboards/index.ts`.
   Koordinat geometri yang rumit → hitung dengan skrip Python, jangan ditebak.
5. **Cek otomatis:** `cd studio && npm run cek && npm run verifikasi && npx tsc --noEmit`.
6. **Cek visual:** render 6–9 still lalu LIHAT gambarnya (Read) dan cocokkan dengan
   checklist di bawah:
   `npx remotion render <Id> out/cek --frames=30,120,... --image-format=png --scale=0.5`
7. **Render final** (hanya setelah cek lolos):
   `npx remotion render <Id> out/<Id>.mp4 --codec=h264 --crf=20`
8. Laporkan ke pengguna: file MP4, durasi, ringkasan adegan, hal yang belum (mis. VO/musik).

Perintah lengkap, audio/voice-over, dan catatan lingkungan → `references/production.md`.

## Aturan gaya yang tidak boleh dilanggar

- Palet hanya: navy `#262B4A`, cokelat `#8E5227`, emas `#EDB53D`, marun `#6A1A25`,
  krem `#F1E6D0`, perkamen `#CDBFA6` (token di `studio/src/brand/theme.ts`).
- **Emas hanya untuk 1–2 fokus per adegan** (rumus kunci, jawaban, titik penting).
  Di rumus: bungkus bagian kunci dengan `\g{...}`.
- Latar selalu bertekstur (komponen `Background`: navy/cokelat/perkamen/kayu) — tidak ada warna polos.
- Tidak ada hard-cut: transisi `iris` (default), `fade`, atau `perkamen` (untuk "yang salah / masa lalu").
- Video dibuka dengan **pena emas** menggambar di perkamen (`diagram` + `"pena": true`, `bg: "perkamen"`)
  ATAU hook `title` dengan tanda tanya emas. Adegan terakhir selalu `outro` (logo Δ Kawung).
- Subtitle dibuat otomatis dari `narasi` — jangan menaruh rumus di narasi; tulis seperti diucapkan.
- Teks di dalam safe area: atas 8%, bawah 18% (bar subtitle di ±74%), samping 6%.

## Checklist sebelum render final

- [ ] `npm run cek` lolos (durasi cukup untuk jumlah kata, ada sumber, outro di akhir)
- [ ] `npm run verifikasi` lolos (semua angka benar)
- [ ] Still frame: tidak ada teks terpotong/bertumpuk, subtitle tidak menutupi diagram penting
- [ ] Minimal 3 signature move: pena emas · iris cincin emas · draw-on · count-up · foil shine · fade perkamen
- [ ] Emas tidak dipakai berlebihan; tiap adegan punya satu fokus jelas
- [ ] Hook ≤ 7 detik dan memancing rasa ingin tahu; payoff menjawab hook

## Menambah kemampuan baru

Jika sebuah topik butuh visual yang belum ada (mis. bandul, gelombang, rangkaian listrik),
buat komponen adegan baru di `studio/src/scenes/`, tambahkan tipenya di
`studio/src/storyboard/types.ts`, daftarkan di `SceneBody` (`studio/src/UDVideo.tsx`), lalu
**dokumentasikan di `references/scene-library.md`** agar bisa dipakai ulang video berikutnya.
Gerak fisika harus dihitung dari persamaannya (lihat `ProjectileScene.tsx`), bukan animasi asal.
