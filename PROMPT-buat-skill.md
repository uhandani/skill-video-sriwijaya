# Prompt: Buat Skill "video-ruang-hitung" (UDcation)

> **Status:** skill ini sudah dibangun di `.claude/skills/video-ruang-hitung/` dengan proyek
> Remotion di `studio/` (contoh: `Pythagoras345`, `GerakParabola45`). Prompt di bawah disimpan
> sebagai spesifikasi asal.

> Salin seluruh isi blok di bawah ini ke Claude Code (sebaiknya di repo ini).
> Gaya desainnya diambil dari video referensi "Sriwijaya" (Instagram Reels),
> lalu disesuaikan menjadi **identitas visual tetap** untuk konten Matematika & Fisika.
> Yang diambil hanya bahasa desainnya; isi dan adegannya dibuat ulang untuk sains.

---

```text
Buatkan sebuah Claude Code skill bernama `video-ruang-hitung` (simpan di
`.claude/skills/video-ruang-hitung/`) untuk membuat video pendek edukasi
MATEMATIKA dan FISIKA secara berulang dengan satu gaya visual khas yang konsisten
(ciri khas channel saya). Gunakan skill `skill-creator` (atau
`superpowers:writing-skills`) untuk struktur skill, dan Remotion (React) untuk
membangun & me-render video — pakai skill `remotion:*` yang tersedia.

Input skill  : topik/konsep (mis. "Teorema Pythagoras", "Hukum Newton II",
               "Kenapa 0,999… = 1", "Gerak parabola"), opsional: tingkat
               (SMP/SMA/umum), durasi target, rasio (9:16 default, 16:9 opsional),
               file voice-over, file musik.
Output skill : (1) naskah narasi, (2) storyboard JSON per adegan,
               (3) proyek Remotion siap render, (4) MP4 hasil render.

Prinsip utama: skill ini adalah SISTEM DESAIN + LIBRARY ADEGAN yang dipakai
ulang. Video baru = naskah + storyboard JSON baru; komponen, tema, dan aset
inti tidak dibuat ulang setiap kali.

==================================================================
1. IDENTITAS GAYA ("Nusantara Emas") — yang WAJIB konsisten
==================================================================
Estetika: ilustrasi flat 2D bertekstur kain batik/tenun dan kertas tua,
line-art krem seperti digambar tangan, aksen foil emas yang berkilau, nuansa
hangat-misterius seperti buku kuno yang hidup. Diterapkan ke rumus, grafik,
dan diagram sains.

Palet (token tema, simpan di theme.ts):
  navy      #262B4A   latar utama / "papan tulis malam"   terang #3A4378
  cokelat   #8E5227   latar sekunder, benda kayu           gelap #4A2A16
  emas      #EDB53D   HAL PENTING: rumus kunci, jawaban, titik fokus
            #C8923A   emas tua (bayangan/gradien)
  marun     #6A1A25   bar subtitle, penekanan kedua        terang #9C2A35
  krem      #F1E6D0   semua line-art, sumbu grafik, teks biasa
  perkamen  #CDBFA6   adegan kertas/sketsa, "cara lama/yang salah"
  Aturan warna: emas hanya untuk 1–2 hal terpenting per adegan. Variabel yang
  berbeda boleh dibedakan dengan krem / emas / merah terang, tidak lebih.

Tekstur latar (selalu ada, tidak pernah warna polos):
  - Navy: pola batik geometri samar (opacity 8–12%). Gunakan motif yang memang
    matematis: kawung (lingkaran bersinggungan), parang (diagonal berulang),
    ceplok (simetri rotasi) — ini jadi jembatan budaya ↔ matematika.
  - Cokelat: anyaman diagonal / crosshatch tenun.
  - Perkamen: serat kertas, kotak-kotak buku catatan samar, retakan halus.
  - Overlay global: film grain 4–6%, vignette, light leak hangat di satu sudut.

Ornamen khas:
  - Bingkai garis krem ganda dengan border tumpal (segitiga zigzag).
  - Motif ombak spiral, awan berarak, matahari emas bersinar garis tipis.
  - Cincin emas bergerigi (seperti matahari/roda gigi) sebagai penanda fokus
    dan transisi.

Line-art: garis krem 3–4 px, sedikit goyah seperti tangan, ujung membulat.
Semua aset dibuat sebagai komponen SVG React agar bisa dianimasikan per-path.

==================================================================
2. TIPOGRAFI
==================================================================
- Judul, angka besar, hasil akhir: serif display tebal ("DM Serif Display"
  atau "Playfair Display"), emas dengan gradien foil
  (#F6D27A → #EDB53D → #B07A26), inner glow + bayangan hangat.
- Rumus: render dengan KaTeX (atau MathJax) ke SVG, warna krem; bagian kunci
  diberi warna emas. Rumus utama di adegan "reveal" tampil besar dengan foil emas.
- Label diagram/grafik: serif krem kecil. Sub-label: sans kecil.
- Subtitle: sans bulat tebal ("Mulish"/"Nunito" ExtraBold).

==================================================================
3. SUBTITLE KHAS (wajib di semua video)
==================================================================
- Posisi tengah, ±72–80% dari atas. Kotak marun #6A1A25 bertekstur samar,
  lebar ±78%, garis tipis emas di atas & bawah, maks 2 baris, 2–5 kata.
- Karaoke per kata: kata yang sedang diucapkan = emas + scale 1.05;
  yang sudah = krem penuh; yang belum = krem 55%.
- Simbol/rumus di subtitle ditulis seperti diucapkan ("a kuadrat"), rumusnya
  ditampilkan di visual, bukan di bar subtitle.
- Timing dari VO via `remotion:remotion-captions` (Whisper word-level);
  tanpa VO, estimasi 2,6 kata/detik.

==================================================================
4. BAHASA ANIMASI (signature moves)
==================================================================
Dipakai ulang di setiap video agar terasa satu seri:
  a. PEMBUKA "PENA EMAS": pena/kuas emas menggambar sketsa di perkamen
     (stroke-dashoffset), lalu berubah jadi ilustrasi berwarna di latar navy.
  b. IRIS CINCIN EMAS: cincin emas membesar menelan layar → adegan berikut.
     Versi kecil = penanda fokus pada titik/sudut/bagian rumus.
  c. DRAW-ON: garis, sumbu, bangun geometri, vektor, kurva grafik selalu
     tergambar, tidak langsung muncul.
  d. FOIL SHINE: kilau diagonal pada setiap teks/objek emas saat muncul;
     glow emas berdenyut ±2 detik.
  e. COUNT-UP: angka berhitung naik/turun (hasil hitungan, nilai variabel).
  f. FADE KE PERKAMEN: desaturasi + retakan untuk "cara lama", "miskonsepsi",
     atau "yang salah"; lalu kembali berwarna saat jawaban benar.
  g. BUSUR EMAS MENYATU: beberapa potongan (langkah/fakta) mengirim busur emas
     ke satu titik → ledakan cahaya + percikan → hasil/rumus final muncul.
Aturan: tidak ada hard-cut; selalu ada gerakan halus (drift kamera 1–3%,
partikel debu emas); easing spring/easeInOutCubic.

==================================================================
5. LIBRARY ADEGAN (komponen yang dapat dipakai ulang)
==================================================================
Bangun sebagai komponen Remotion berparameter, dipanggil dari storyboard JSON:
  - TitleCard        : judul/pertanyaan besar emas di bingkai tumpal.
  - QuestionMark     : tanda tanya emas berdenyut (hook).
  - EquationReveal   : rumus KaTeX, bisa highlight bagian, substitusi nilai
                       (variabel berubah jadi angka), dan langkah aljabar yang
                       ber-morph dari baris ke baris.
  - GraphScene       : bidang koordinat bergaya peta (sumbu krem, grid samar),
                       kurva fungsi tergambar, titik bergerak di kurva, area di
                       bawah kurva terisi tekstur, label serif.
  - GeometryScene    : konstruksi jangka & penggaris (lingkaran, segitiga,
                       sudut dengan busur emas, potongan bangun yang dipindah
                       untuk pembuktian visual).
  - PhysicsScene     : benda + vektor gaya/kecepatan (panah krem, resultan emas),
                       lintasan putus-putus, bandul, pegas, gelombang, bidang
                       miring. Gerak dihitung dari persamaan fisika yang benar
                       (bukan asal animasi) di fungsi frame → posisi.
  - CounterNumber    : angka besar emas count-up + label kecil di bawahnya.
  - FigureMedallion  : potret oval berbingkai emas + nama + peran (ilmuwan,
                       mis. "Isaac Newton — fisikawan Inggris"), opsional.
  - DeskScene        : meja kayu top-down: lampu minyak, buku catatan, jangka,
                       penggaris, kertas hitungan, kaca pembesar — untuk adegan
                       "mari kita hitung".
  - Analogy/WorldScene: ilustrasi dunia nyata bergaya tekstil (kapal, jembatan,
                       roket, bola, rumah panggung) untuk konteks soal.
  - OutroCard        : kesimpulan satu kalimat + rumus final emas + logo
                       UDcation "Δ Kawung" + wordmark (lihat bagian 10).
  - BrandIntro       : emblem "Gunungan Kawung" berputar lalu membuka
                       (±1,5 dtk) — opsional, untuk video YouTube panjang.

==================================================================
6. STRUKTUR NARASI (template, bisa disesuaikan per topik)
==================================================================
Pola dasar diadaptasi dari video referensi (misteri → reveal → bukti → payoff):
  1. HOOK (0–5 dtk)      : pertanyaan/paradoks/fakta mengejutkan, belum ada rumus.
                           "Kenapa…?", "Pernah dengar…?", "Ternyata…"
  2. KONTEKS (5–12)      : situasi nyata / gambar sederhana; definisikan simbol.
  3. INTUISI (12–25)     : visual menunjukkan idenya (bukti visual, simulasi).
  4. REVEAL RUMUS (25–32): rumus kunci muncul dengan foil emas (gerakan g).
  5. CONTOH (32–45)      : satu angka konkret, substitusi, hasil count-up.
  6. PAYOFF (45–55)      : kesimpulan "aha" + rumus final + ajakan seri.
Mode alternatif yang juga didukung: "Sejarah Sains" (pakai pola 7-beat
referensi: misteri → tokoh → tahun → penemuan), "Soal Cepat" (soal → jebakan →
cara cepat → jawaban, 30 dtk), "Miskonsepsi" (yang salah di perkamen → yang
benar berwarna).
Bahasa Indonesia, kalimat pendek, nada bercerita tenang, ±2,6 kata/detik.

==================================================================
7. AKURASI (wajib untuk konten MTK & fisika)
==================================================================
- Setiap rumus, langkah, dan angka diverifikasi dengan skrip (Python/sympy
  atau JS) sebelum masuk storyboard; hasil cek disimpan di folder video.
- Satuan fisika selalu ditulis dan dicek konsistensinya; nilai konstanta
  disebutkan pembulatannya (mis. g ≈ 9,8 m/s²).
- Grafik dan animasi fisika digambar dari fungsi yang sama dengan rumusnya.
- Fakta sejarah sains disertai sumber; jika ragu, tanya pengguna.

==================================================================
8. AUDIO
==================================================================
- Voice-over Bahasa Indonesia, nada tenang & penasaran. Tanpa file VO,
  skill tetap membuat naskah + timing (opsi TTS).
- Musik latar etnik-sinematik lembut (gamelan/kecapi + pad), terus-menerus,
  ducking −12 dB saat VO. SFX: shimmer (emas muncul), whoosh (iris),
  goresan pena (draw-on), "tik" saat count-up. Target ±−14 LUFS.

==================================================================
9. ALUR KERJA SKILL
==================================================================
1. Pahami topik + tingkat penonton → tentukan mode narasi (bagian 6).
2. Tulis naskah, lalu verifikasi semua matematika/fisika (bagian 7).
3. Buat storyboard JSON: per adegan → beat, waktu, komponen dari library
   (bagian 5) + parameternya, latar, transisi keluar, potongan subtitle.
4. Isi proyek Remotion dari template; hanya tambah aset/komponen baru bila
   library belum punya (lalu simpan kembali ke library agar bisa dipakai ulang).
5. Render still frame di 5 titik waktu, cek dengan checklist, lalu render MP4
   (9:16 1080x1920 30fps; 16:9 1920x1080 jika diminta — layout menyesuaikan).

Checklist gaya (wajib lolos sebelum render):
[ ] Latar bertekstur (batik geometri / tenun / perkamen), bukan warna polos
[ ] Hanya palet bagian 1; emas hanya untuk 1–2 fokus per adegan
[ ] Subtitle bar marun + karaoke kata emas
[ ] Minimal 3 signature moves dari bagian 4, termasuk pembuka pena emas
[ ] Tidak ada hard-cut
[ ] Rumus dirender KaTeX dan sudah diverifikasi
[ ] Teks di dalam safe area (atas 8%, bawah 18%, samping 6%)

==================================================================
10. BRAND: UDcation
==================================================================
Nama channel: UDcation (UD = Uhan Dani, plesetan "education").
> **PEMBARUAN 25 Nov 2026:** logo resmi sekarang **Δ Kawung Cetak Biru** (kelopak garis emas, tanpa isi,
> tanpa arsiran, titik krem; wordmark IBM Plex Mono). Deskripsi logo isi foil di bawah ini sudah usang —
> ikuti `branding/UDcation-brand.md` dan `studio/src/components/DeltaLogo.tsx`.

Aset & filosofi ada di `branding/` repo ini (UDcation-brand.md, logo-konsep.html):
  - Logo utama "Δ Kawung" (branding/logo-delta-kawung.html — salin fungsi
    petal() & simbolnya): segitiga Δ yang tiap sisinya kelopak kawung emas,
    titik krem di pusat (titik berat). Animasi logo: tiga kelopak tergambar
    dari tiap sudut, bertemu membentuk Δ, lalu titik jatuh ke pusat + foil
    shine. Muncul di OutroCard; watermark kecil sudut kanan atas (opacity 25%).
  - Gimmick: di EquationReveal, simbol Δ pada rumus (Δx, Δv, Δt) boleh
    diganti logo Δ Kawung saat rumus kunci muncul.
  - Pola brand: Δ dan ∇ bergantian (tessellation) untuk tekstur latar.
  - Emblem "Gunungan Kawung" (gunungan berisi pola kawung + logo Δ Kawung)
    untuk BrandIntro, terinspirasi logo G20 Indonesia 2022.
  - Wordmark: "UDCATION" huruf kapital renggang, Cormorant Garamond
    SemiBold; "UD" emas, "CATION" krem/navy.
  - Tagline default: "Ilmu Semesta, Rasa Nusantara".
Pilar konten (tambahkan sebagai field `pilar` di storyboard JSON + label kecil
di TitleCard): Ruang Hitung (MTK), Ruang Semesta (Fisika), Fakta Unik,
Jejak Ilmu Nusantara. Field `kurikulum` (kelas/bab) juga disimpan untuk
dipakai ulang di platform belajar nanti.

Struktur folder skill:
  SKILL.md                         (alur kerja + aturan singkat)
  references/style-guide.md        (bagian 1–4, 8)
  references/scene-library.md      (bagian 5: props tiap komponen + contoh JSON)
  references/narrative-modes.md    (bagian 6 + contoh naskah per mode)
  references/accuracy.md           (bagian 7)
  templates/remotion/              (proyek starter: theme.ts, komponen, aset SVG,
                                    tekstur, font, Composition pembaca JSON)
  examples/pythagoras.storyboard.json
  examples/newton-2.storyboard.json

Uji skill dengan dua topik — "Teorema Pythagoras" (MTK) dan "Gerak parabola"
(fisika) — tunjukkan still frame keduanya dan pastikan keduanya terasa
satu seri yang sama.
```

---

## Lampiran: analisis gaya video referensi (Sriwijaya)

Yang diambil sebagai "DNA" gaya: tekstur kain/kertas, line-art krem, foil emas,
palet navy–cokelat–marun, subtitle marun karaoke emas, pembuka pena emas, iris
cincin emas, fade ke perkamen, count-up angka, busur emas yang menyatu menjadi
reveal akhir, dan alur misteri → reveal → bukti → payoff.

| Detik | Adegan di video referensi | Padanan di konten MTK/fisika |
|---|---|---|
| 0–2 | Kuas emas menggambar sketsa kapal | Pena emas menggambar bangun/diagram |
| 2–8 | Kapal & mahkota di bingkai tumpal → "?" emas | Hook: pertanyaan + tanda tanya emas |
| 8–11 | Judul emas "Sriwijaya" | Nama konsep / judul |
| 11–20 | Peta, rute kapal, cincin penanda | Grafik/bidang koordinat, lintasan, penanda fokus |
| 20–30 | "671 M", tokoh, "954 → 1.000+" | Angka besar, ilmuwan, count-up hasil |
| 30–34 | Memudar jadi perkamen retak | Miskonsepsi / cara lama |
| 34–42 | Meja kayu, lampu minyak, prasasti, kaca pembesar | Meja hitung: buku, jangka, kaca pembesar |
| 42–45 | Busur emas menyatu → "Sriwijaya" | Langkah-langkah menyatu → rumus final emas |
