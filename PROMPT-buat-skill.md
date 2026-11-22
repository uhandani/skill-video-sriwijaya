# Prompt: Buat Skill "video-sejarah-nusantara"

> Salin seluruh isi blok di bawah ini ke Claude Code (sebaiknya di repo kosong ini).
> Prompt ini disusun dari analisis frame-by-frame video referensi
> "Pernah ada kerajaan besar di Sumatra… Sriwijaya" (Instagram Reels, 45 detik).

---

```text
Buatkan sebuah Claude Code skill bernama `video-sejarah-nusantara` (simpan di
`.claude/skills/video-sejarah-nusantara/`) yang bisa mengubah satu topik sejarah /
fakta unik Indonesia menjadi video pendek vertikal (Reels/TikTok/Shorts) dengan gaya
visual yang SAMA PERSIS seperti spesifikasi di bawah. Gunakan skill `skill-creator`
(atau `superpowers:writing-skills`) untuk struktur skill, dan Remotion (React) untuk
membangun & me-render video — pakai skill `remotion:*` yang tersedia.

Input skill  : topik (mis. "Majapahit", "Candi Borobudur", "Kerajaan Kutai"),
               opsional: durasi target, file voice-over, file musik.
Output skill : (1) naskah narasi, (2) storyboard per adegan, (3) proyek Remotion
               yang sudah jadi, (4) file MP4 1080x1920 hasil render.

==================================================================
1. FORMAT TEKNIS
==================================================================
- Rasio 9:16, 1080x1920, 30 fps, durasi 40–60 detik (referensi: 45 detik).
- Satu "kanvas" yang terus bergerak: TIDAK ada hard-cut. Perpindahan adegan
  memakai kamera pan/zoom, morph, iris-cincin emas, atau fade ke kertas tua.
- Selalu ada gerakan halus di setiap frame (drift kamera 1–3%, glow berdenyut,
  partikel debu emas, kapal/air bergoyang). Tidak boleh ada frame diam total.

==================================================================
2. STRUKTUR NARASI (7 BEAT, ±110–130 kata Bahasa Indonesia)
==================================================================
Pola yang dipakai video referensi — skill harus menulis naskah dengan pola ini:
  1. HOOK MISTERI   (0–7 dtk)  : "Pernah ada ___ yang ___ sempat dilupakan ___."
                                 Jangan sebut nama dulu. Tutup dengan ikon "?" emas.
  2. REVEAL IDENTITAS (7–11)   : "Namanya ___, berpusat di ___." Judul emas muncul.
  3. KENAPA PENTING (11–20)    : Peta + jalur/rute + "dan ___ menguasai ___."
  4. SAKSI/BUKTI    (20–30)    : Tahun besar + tokoh sejarah + angka yang dihitung naik.
  5. KEJATUHAN      (30–34)    : "Tapi setelah ___ runtuh, namanya perlahan hilang
                                 dari ingatan." Visual memudar jadi kertas tua retak.
  6. PENEMUAN KEMBALI (34–42)  : "Baru tahun ___, ___ (peran) ___ membaca/menemukan ___
                                 dan menyadari ___."
  7. PAYOFF         (42–45)    : Nama besar emas berkilau sebagai penutup.
Gaya bahasa: bercerita, kalimat pendek, nada dokumenter tenang, ada jeda "…"
untuk ketegangan. Fakta wajib akurat — sertakan daftar sumber di storyboard.

Contoh naskah referensi (untuk few-shot di SKILL.md):
"Pernah ada kerajaan besar di Sumatra… yang namanya sempat dilupakan selama
ratusan tahun. Namanya Sriwijaya, berpusat di sekitar Palembang. Kapal dagang
dari India sampai Tiongkok harus melewati Selat Malaka, dan Sriwijaya menguasai
jalur itu. Tahun 671, biksu Tiongkok I Tsing singgah di sana, dan menulis ada
lebih dari seribu biksu yang belajar. Tapi setelah kerajaannya runtuh, namanya
perlahan hilang dari ingatan. Baru tahun 1918, sejarawan Prancis George Cœdès
membaca prasasti-prasasti kuno… dan menyadari semuanya menunjuk ke satu kerajaan
yang sama. Sriwijaya."

==================================================================
3. GAYA VISUAL ("ilustrasi tekstil Nusantara + foil emas")
==================================================================
Estetika: ilustrasi flat 2D seperti kain batik/songket & tenun yang dijahit,
dengan garis tangan krem, aksen foil emas metalik, dan tekstur kain/kertas tua.

Palet (token warna):
  --navy-indigo   #262B4A  (latar utama, laut)   variasi terang #3A4378
  --cokelat-sogan #8E5227  (daratan, layar kapal, meja kayu) gelap #4A2A16
  --emas          #EDB53D  (highlight, judul, ikon)  emas tua #C8923A
  --merah-marun   #6A1A25  (bar subtitle, atap, jubah)  merah terang #9C2A35
  --krem-garis    #F1E6D0  (line-art, label peta)
  --perkamen      #CDBFA6  (kertas tua / sketsa / adegan "terlupakan")

Tekstur (WAJIB di semua latar):
  - Navy: motif kawung/bunga batik samar (opacity 8–12%) + noise kain.
  - Cokelat: anyaman diagonal / crosshatch tenun + titik-titik.
  - Perkamen: serat kertas + retakan halus.
  - Overlay global: film grain 4–6%, vignette gelap di tepi, cahaya hangat
    diffuse (light leak) dari salah satu sudut.

Ornamen berulang:
  - Bingkai garis krem ganda dengan border "tumpal" (segitiga zigzag) atas-bawah.
  - Motif ombak spiral (gulungan) untuk air, motif awan berarak di langit.
  - Gunung/bukit berbentuk kubah biru bertitik (seperti pulau di peta).
  - Matahari emas dengan sinar garis tipis.

Line-art & objek:
  - Garis krem 3–4 px, sedikit goyah seperti digambar tangan, sudut membulat.
  - Objek: kapal jung dua layar (layar cokelat bergaris kotak + lambang teratai),
    mahkota emas bertitik merah, rumah panggung beratap merah, perahu kecil,
    candi/vihara bertingkat (atap navy-merah bergaris, stupa emas), figur orang
    sederhana tanpa wajah detail (topi caping, jubah merah), kerumunan biksu
    (satu figur diduplikasi dalam grid), prasasti batu biru dengan aksara kuno
    (pseudo-aksara Pallawa), lampu minyak bercahaya, kaca pembesar emas,
    buku catatan terbuka, medali potret oval berbingkai emas.
  - Buat semua aset sebagai komponen SVG React (bukan gambar raster) agar bisa
    dianimasikan per-path.

==================================================================
4. TIPOGRAFI
==================================================================
- Judul / angka besar / nama tempat: serif display tebal berkontras tinggi
  (Google Fonts: "DM Serif Display" atau "Playfair Display" Bold), warna emas
  dengan gradien foil (#F6D27A → #EDB53D → #B07A26), inner glow + drop shadow
  hangat. Contoh: "Sriwijaya", "671 M", "1.000+", "1918".
- Label peta & nama tokoh: serif yang sama, warna krem, ukuran kecil-sedang,
  bayangan halus. Sub-label (peran) pakai sans kecil: "sejarawan Prancis".
- Subtitle: sans bulat tebal ("Mulish" / "Nunito" ExtraBold), lihat bagian 5.

==================================================================
5. SUBTITLE (CIRI KHAS PALING PENTING)
==================================================================
- Posisi: tengah horizontal, ±72–80% dari atas (di atas safe-area UI Reels).
- Kotak: persegi panjang merah marun #6A1A25 bertekstur (motif belah ketupat
  samar), lebar ±78% layar, garis tipis emas di atas & bawah kotak,
  sedikit bayangan. Kotak melebar/menyusut halus mengikuti panjang teks.
- Isi: 2–5 kata per potongan, maksimal 2 baris, rata tengah, spasi kata lebar.
- Animasi karaoke per kata:
    kata yang SEDANG diucapkan  = emas #EDB53D, scale 1.05
    kata yang SUDAH diucapkan   = putih krem penuh
    kata yang BELUM diucapkan   = putih krem opacity 55%
- Pergantian potongan: fade+slide 8 px, ±6 frame.
- Timing kata diambil dari voice-over (gunakan skill `remotion:remotion-captions`
  untuk transkripsi Whisper word-level). Tanpa VO: estimasi 2,6 kata/detik.

==================================================================
6. BAHASA ANIMASI & TRANSISI
==================================================================
- Pembuka "menggambar": kuas/pena emas menggambar sketsa line-art di atas
  perkamen (stroke-dashoffset), lalu sketsa berubah menjadi ilustrasi berwarna
  di latar navy (morph warna + fill masuk dari bawah).
- Elemen muncul dengan: pop-in skala (spring, sedikit overshoot), garis
  ter-gambar (draw-on), atau berkilau (shine sweep diagonal pada emas).
- Emas berdenyut: glow bloom 0.8→1.0 opacity, periode ±2 detik.
- Transisi "iris cincin emas": lingkaran bergerigi seperti matahari/roda emas
  muncul, membesar menyelimuti layar → masuk ke adegan berikutnya; versi kecil
  dipakai sebagai penanda lokasi di peta (cincin emas berputar pelan).
- Peta: kamera turun dari langit (matahari) ke peta, garis rute putus-putus
  ter-gambar, kapal-kapal kecil bergerak sepanjang rute, label muncul satu per
  satu, lalu kamera zoom + rotasi ±8° ke titik penting.
- Angka: count-up (954 → 1.000+), lalu label kecil di bawahnya.
- Adegan "terlupakan": seluruh adegan desaturasi → sepia perkamen, retakan
  muncul, objek memudar ke 20% opacity (ghosting).
- Adegan penemuan: kamera mundur ke meja kayu (top-down), lampu minyak menyala
  berkedip, kaca pembesar menyapu prasasti (aksara menyala emas), lalu
  garis-garis busur emas melesat dari setiap prasasti ke titik pusat → ledakan
  cahaya + percikan bintang → judul emas besar muncul.
- Easing: semua gerakan pakai spring/easeInOutCubic; tidak ada gerakan linier
  kecuali drift kamera.

==================================================================
7. AUDIO
==================================================================
- Voice-over Bahasa Indonesia, nada pencerita dokumenter tenang & sedikit
  misterius. Jika tidak ada file VO, skill menyediakan opsi TTS dan tetap
  menulis naskah + timing.
- Musik latar sinematik etnik (gamelan/kecapi lembut + pad orkestra), selalu
  ada sepanjang video (tidak ada jeda hening), ducking −12 dB saat VO.
- SFX halus: "shimmer" saat emas muncul, "whoosh" saat iris transisi,
  goresan pena saat menggambar. Target loudness ±−14 LUFS.

==================================================================
8. ALUR KERJA YANG HARUS DIJALANKAN SKILL
==================================================================
1. Riset singkat topik → tulis 5–8 fakta kunci + sumber; tanya pengguna jika
   fakta meragukan.
2. Tulis naskah 7-beat (bagian 2), hitung durasi per beat.
3. Buat storyboard JSON: per adegan → beat, rentang waktu, latar (navy /
   cokelat / perkamen / meja kayu), objek, teks judul/angka/label, animasi,
   transisi keluar, potongan subtitle.
4. Bangun proyek Remotion: komponen bersama (TexturedBackground, GoldText,
   CaptionBar, GoldRingIris, MapScene, CounterNumber, DeskScene, aset SVG)
   + satu Composition yang membaca storyboard JSON. Komponen harus generik
   agar topik baru cukup mengganti JSON + aset spesifik.
5. Preview beberapa still frame (detik 2, 10, 20, 32, 44) dan bandingkan dengan
   checklist gaya di bawah sebelum render penuh.
6. Render MP4 H.264 1080x1920 30fps.

Checklist gaya (wajib lolos sebelum render):
[ ] Latar bertekstur kain/kertas, bukan warna polos
[ ] Hanya memakai palet di bagian 3
[ ] Ada aksen emas berkilau di setiap adegan
[ ] Subtitle bar marun + karaoke kata emas
[ ] Tidak ada hard-cut; setiap transisi tergolong salah satu jenis di bagian 6
[ ] Hook tidak menyebut nama; nama baru muncul di beat 2 dan diulang di akhir
[ ] Ada minimal 1 peta, 1 angka/tahun besar, 1 tokoh dengan label peran
[ ] Teks tidak keluar dari safe area (atas 8%, bawah 18%, samping 6%)

Sertakan di folder skill: SKILL.md, references/style-guide.md (bagian 3–7),
references/narrative-template.md (bagian 2 + contoh Sriwijaya),
templates/remotion/ (proyek starter), dan examples/sriwijaya.storyboard.json
yang merekonstruksi video referensi. Uji skill dengan topik baru
("Kerajaan Majapahit") dan tunjukkan hasil still frame-nya.
```

---

## Catatan analisis video referensi

| Detik | Adegan | Teknik |
|---|---|---|
| 0–2 | Kuas emas menggambar sketsa kapal di perkamen | draw-on line art |
| 2–6 | Kapal + mahkota emas di latar navy berbingkai tumpal | morph sketsa → warna |
| 6–8 | Cincin emas → tanda tanya emas | iris transisi, ikon misteri |
| 8–11 | Sungai berliku, rumah panggung, judul "Sriwijaya / sekitar Palembang" | judul emas tertulis |
| 11–20 | Peta Selat Malaka, rute India–Tiongkok, kapal bergerak, cincin penanda | peta animasi, zoom + rotasi |
| 20–27 | "671 M", biksu I Tsing turun kapal, vihara bertingkat | angka besar, figur karakter |
| 27–30 | Ribuan biksu (grid), "954 → 1.000+ biksu belajar" | count-up |
| 30–34 | Semua memudar jadi perkamen retak, "Sriwijaya" menghilang | desaturasi / ghosting |
| 34–42 | Meja kayu, lampu minyak, prasasti, "1918", medali George Cœdès, kaca pembesar | top-down desk scene |
| 42–45 | Busur emas dari prasasti → ledakan cahaya → "Sriwijaya" | payoff reveal |

Spesifikasi file: 540x960 (diunggah ulang; aslinya kemungkinan 1080x1920), 30 fps,
45,3 detik, audio stereo 44,1 kHz tanpa jeda hening (musik latar terus-menerus).
