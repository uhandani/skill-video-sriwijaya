# UDcation — Konsep Brand

**UD** = Uhan Dani · **UDcation** = plesetan *education*.
Posisi: belajar Matematika & Fisika dengan rasa Nusantara — mewah, otentik, dan ilmiah.

## LOGO RESMI (sejak 25 Nov 2026): Δ Kawung Cetak Biru

Lembar logo: [`logo-cetak-biru.png`](logo-cetak-biru.png) (sumber: `logo-cetak-biru.html`).
Penerapan di 7 media (Instagram, intro & watermark video, banner YouTube, kartu nama, merchandise, sertifikat):
kanvas desain https://claude.ai/artifact/7HFkVJhg4eLm3NAKna2bf8

- **Bentuk:** sama dengan Δ Kawung (segitiga dari tiga kelopak kawung, titik di pusat), tetapi digambar
  sebagai **gambar teknik / cetak biru**: kelopak berupa **garis emas tanpa isi**, ramping, dengan celah lebar
  di tiap sudut.
- **TANPA ARSIRAN.** Tidak ada kelopak yang diarsir/di-hatch, di ukuran apa pun.
- **Garis bantu teknik** (garis tengah putus-putus ke tiap sudut, lingkaran luar, busur 60°) **opsional**,
  hanya untuk logo besar: intro/outro video, lembar logo, banner, sertifikat. Ukuran kecil = tanpa garis bantu.
- **Warna** (tetap palet Δ Kawung):
  | Peran | Hex |
  |---|---|
  | garis kelopak (utama) | emas `#EDB53D` |
  | titik pusat di latar gelap | krem `#F1E6D0` |
  | latar utama | navy `#262B4A` (bertekstur kertas cetak biru halus) |
  | latar terang | krem `#F4ECDD` — garis emas tua `#B07A26`, titik navy |
  | satu warna | krem di marun `#6A1A25`, navy, putih, hitam |
  | aksen (stempel, garis kecil) | marun `#6A1A25` |
- **Wordmark:** `UDCATION` IBM Plex Mono, spasi huruf lebar — **UD** tebal emas, **CATION** reguler krem
  (navy di latar terang). Tagline tulisan tangan Architects Daughter: *Ilmu Semesta · Rasa Nusantara*.
- **Ukuran kecil (≤ 64 px):** pakai garis lebih tebal (`mark-icon-small.svg`, favicon).
- **Geometri (satu sumber):** `tools/delta.mjs` ⇄ `studio/src/brand/delta.ts` → `SPEC_BLUEPRINT = [0.013, 0.108, 0.09·SIDE]`,
  `STROKE_BP = 3.2`, `DOT_R_BP = 9` (satuan R = 100).
- **Aset:** `assets/svg/` (mark-gold-on-dark, mark-gold-on-light, mark-krem-on-marun, mark-navy, mark-white,
  mark-black, mark-icon-small, mark-construction) dan `assets/png/` (profile-1080, app-icon-1024, favicon-512/32,
  watermark-400, lockup horizontal gelap/terang, lockup vertikal, yt-banner-2560).
  Ekspor ulang: `NODE_PATH=$(npm root -g) node branding/tools/export-assets.mjs`. Font OFL di `fonts/`.
- **Video:** komponen `DeltaLogo` (Remotion) menggambar logo ini: garis bantu muncul → kelopak tergambar seperti
  pena → titik jatuh ke pusat → kilau foil. Watermark & thumbnail memakai versi statis.
- **Arsip:** logo Δ Kawung isi foil (versi di bawah) dipindah ke `assets/legacy-foil/`. Jangan dipakai lagi
  untuk konten baru. Video yang sudah dirender tidak perlu diubah.

---

## Versi sebelumnya: Δ Kawung isi foil (delta dari tiga kelopak kawung)

Sketsa: [`logo-delta-kawung.png`](logo-delta-kawung.png) (sumber: `logo-delta-kawung.html`).

- **Bentuk:** segitiga sama sisi (Δ). Ketiga sisinya adalah **kelopak kawung**: sisi luar hampir lurus sehingga siluetnya tetap segitiga tegas, sisi dalam melengkung seperti buah aren. Di tiap sudut ada celah kecil, dan di pusatnya ada **titik**.
- **Filosofi:**
  - **Δ = perubahan.** Dalam MTK dan fisika: Δx, Δv, Δt. Belajar adalah perubahan, dari tidak tahu menjadi paham.
  - **Tiga kelopak kawung** = tiga akar UDcation: Matematika, Fisika, Nusantara. Kawung melambangkan kebijaksanaan dan keseimbangan.
  - **Titik pusat** = titik berat (sentroid), tempat semua gaya seimbang.
  - **Segitiga** = bangun paling kokoh, dipakai pada rangka jembatan dan atap. Celah di sudut = ruang untuk bertumbuh.
- **Warna:** emas penuh (utama); dua warna (satu kelopak emas, dua krem); satu warna navy/putih.
- **Turunan:**
  - Pola Δ dan ∇ bergantian (tessellation segitiga) untuk latar video dan kemasan.
  - Logo bisa dipakai langsung sebagai simbol Δ di dalam rumus video, misalnya v = Δx/Δt. Ini gimmick khas UDcation.
- **Alternatif:** Δ tipografis, dengan kelopak kanan tebal dan kiri tipis seperti huruf Yunani di buku teks.
- **Catatan desain:** kelopak yang terlalu gemuk membuat bentuknya membulat dan mirip simbol radiasi, jadi dipilih kelopak dengan sisi luar hampir lurus.

---

## Versi sebelumnya: Kawung UD v2 (huruf dari kelopak)

Sketsa: [`logo-kawung-ud-v2.png`](logo-kawung-ud-v2.png) (sumber: `logo-kawung-ud-v2.html`).
Pendekatannya mengikuti referensi logo KVG (huruf yang disusun dari bentuk kawung) dan logo G20 Indonesia 2022 (siluet gunungan yang diisi motif kawung).

- **Modul:** satu lingkaran kawung dibagi empat oleh garis silang. Tiap seperempatnya bisa berupa kelopak (irisan dua lingkaran, bentuk buah aren), seperempat lingkaran, atau batang. Celah di antara potongan adalah garis silang khas kawung.
- **U:** dua lengan seperempat lingkaran yang mekar seperti cawan, di atas mangkuk setengah lingkaran yang terbelah garis kawung. Di dasarnya ada **biji emas** = benih ilmu di dalam wadah.
- **D:** batang tegak sebagai poros, ditambah **dua kelopak kawung emas** yang membentuk lengkung D.
- **Warna:** krem/navy untuk potongan dasar, emas untuk kelopak dan biji. Versi satu warna tetap terbaca karena bentuknya solid.
- **Turunan:**
  - Pola brand dari modul yang sama.
  - Emblem *Gunungan Kawung*: siluet gunungan berisi pola kawung dengan mark UD di dalamnya, terinspirasi logo G20 Indonesia. Cocok untuk intro video dan sertifikat.
- **Catatan:** sejumlah variasi bentuk lengan U sudah dicoba. Lengan kelopak tipis membuat logo terlihat seperti kepala banteng, jadi dipilih lengan seperempat lingkaran.

---

## Versi sebelumnya: Kawung UD v1 (garis + kelopak di dalam)

Sketsa: [`logo-kawung-ud.png`](logo-kawung-ud.png) (sumber: `logo-kawung-ud.html`)

- **Bentuk:**
  - Huruf **U** dan **D** berbagi satu tiang (ligatur), ditulis dengan garis bulat lembut. Lengan U dan mangkuk D sengaja sedikit asimetris supaya tidak kaku.
  - Di dalam ruang kedua huruf ada **empat kelopak kawung** berbentuk elips buah aren, dengan titik "biji" di tiap kelopak.
  - Kelopak menghadap ke tiang. Pusat kawung jatuh tepat di tiang bersama, jadi motif kawungnya utuh.
- **Filosofi:**
  - **U** = wadah: pelajar yang siap menampung ilmu.
  - **Tiang bersama** = guru dan murid berdiri di satu poros.
  - **D** = kedalaman pemahaman.
  - **Empat kelopak** = empat pilar konten (Ruang Hitung, Ruang Semesta, Fakta Unik, Jejak Ilmu Nusantara).
  - **Pusat kawung** = titik (0,0), tempat semua perhitungan bermula.
  - Kawung sendiri melambangkan kebijaksanaan, kemurnian, dan keseimbangan, dan bentuknya punya simetri yang dipelajari dalam matematika.
- **Warna:**
  - Huruf navy #262B4A (atau krem #F1E6D0 di latar gelap) dengan kelopak emas.
  - Versi satu warna (hitam atau putih) tetap terbaca, cocok untuk stempel, sablon, dan emboss.
- **Turunan:** pola brand dibuat dari kelopak yang sama, untuk latar video, kemasan, dan sertifikat.
- **Masih perlu dirapikan untuk versi final:**
  - Ketebalan garis dan *optical balance* (agar bentuk terlihat seimbang di mata).
  - Versi khusus 16 px yang disederhanakan, misalnya dengan kelopak tanpa biji.
  - Ekspor ke SVG/AI.

---

## Arsip: tiga konsep awal

Lihat sketsa visual: [`logo-konsep.png`](logo-konsep.png) (sumber: `logo-konsep.html`). Konsep B (Kawung Semesta) dikembangkan menjadi logo Kawung UD di atas.

---

## 1. Tiga konsep logo

### A. Surya Ilmu — *rekomendasi logo utama*
- **Bentuk:** bintang segi delapan emas dengan 32 sinar, terinspirasi lambang Surya Majapahit. Di tengahnya ada monogram **UD** yang dikelilingi lintasan orbit dengan satu titik cahaya.
- **Filosofi:**
  - Surya Majapahit adalah lambang pemersatu Nusantara. Matahari melambangkan *cahaya ilmu* yang menerangi.
  - Delapan penjuru mata angin berarti ilmu ada di mana-mana. Bintang segi delapan sendiri adalah bangun geometri, dua persegi yang diputar 45°.
  - Orbit melambangkan fisika: gerak, gravitasi, dan alam semesta. Titik cahayanya adalah pelajar yang terus bergerak mengelilingi sumber ilmu.
- **Kenapa direkomendasikan:**
  - Masih terbaca jelas di ukuran foto profil kecil.
  - Monogram UD-nya kuat.
  - Nyambung langsung dengan transisi "cincin emas bergerigi" di gaya video, jadi logo bisa muncul dari transisi itu.

### B. Kawung Semesta — *pola brand & stempel resmi*
- **Bentuk:** empat kelopak kawung berwarna marun-emas. Di pusatnya ada bintang empat arah, dikelilingi cincin bertuliskan *UDCATION ✦ MATEMATIKA ✦ FISIKA ✦ NUSANTARA*.
- **Filosofi:**
  - Kawung adalah motif batik tua yang melambangkan kebijaksanaan dan kemurnian hati, dan dulu dikenakan kalangan keraton.
  - Secara matematis, kawung memiliki simetri lipat-4 yang dalam teori grup wallpaper disebut *p4m*. Artinya matematika sudah ada dalam warisan kita.
  - Empat kelopak = empat pilar konten UDcation (lihat bagian 3).
  - Titik pusat = titik nol (0,0), tempat semua perhitungan bermula.
- **Kegunaan:** pola latar di semua materi, stempel di sertifikat platform nanti, dan watermark video.

### C. Gunungan Ilmu — *pembuka & penutup video*
- **Bentuk:** gunungan wayang (kayon). Di dalamnya, dari atas ke bawah: atom, gelombang sinus, segitiga siku-siku, dan gapura bertuliskan **UD** di dasar.
- **Filosofi:**
  - Gunungan selalu muncul di awal dan akhir pertunjukan wayang sebagai pembuka dan penutup cerita, sama seperti setiap video UDcation.
  - Segitiga siku-siku di bawah adalah matematika sebagai fondasi. Gelombang dan atom di atas adalah fisika, alam semesta yang dibangun di atas fondasi itu.
  - Gapura melambangkan pintu masuk menuju ilmu.
- **Kegunaan:** animasi intro dan outro, misalnya gunungan diputar lalu terbuka seperti di pentas wayang. Tidak cocok jadi ikon kecil karena detailnya terlalu banyak.

### Rekomendasi sistem
Ketiga konsep tidak perlu dipilih salah satu. Gunakan sebagai satu sistem:

| Peran | Konsep |
|---|---|
| Logo utama, foto profil, favicon platform | **A. Surya Ilmu** |
| Pola latar, sertifikat, watermark | **B. Kawung Semesta** |
| Intro dan outro video | **C. Gunungan Ilmu** |

**Wordmark:** **UD** dalam emas foil + *cation* dalam krem. Huruf serif display (DM Serif Display) untuk wordmark, Mulish untuk teks pendukung.

**Pilihan tagline:**
- *Ilmu Semesta, Rasa Nusantara*
- *Setiap Cerita Punya Rumusnya*
- *Matematika & Fisika dari Bumi Nusantara*

> Ini sketsa konsep, bukan logo final. Untuk versi final, sebaiknya dikerjakan ulang oleh desainer, atau dirapikan lagi dari sketsa ini dalam format vektor. Lakukan juga dua pengecekan:
> 1. Cek merek "UDcation" di PDKI DJKI (pdki-indonesia.dgip.go.id) sebelum didaftarkan.
> 2. Amankan nama akun @udcation di IG, YouTube, dan TikTok, serta domainnya (udcation.id / .com).

---

## 2. Apakah sudah ada konten seperti ini?

Hasil penelusuran singkat:

- **Etnomatematika (matematika dalam budaya) sudah ramai di dunia akademik Indonesia.** Ada banyak jurnal dan buku tentang geometri candi, simetri batik kawung dan parang, rumah adat, congklak, dan kalender Jawa ([kumparan](https://kumparan.com/devintafajarlestari9/etnomatematika-menanamkan-konsep-matematika-dan-cinta-budaya-nusantara-1wJIZc6780R), [Eksplorasi Etnomatematika Candi Asu](https://www.researchgate.net/publication/342593843_Eksplorasi_Etnomatematika_pada_Candi_Asu), [buku Etnomatematika Nusantara](https://www.researchgate.net/publication/405134117_ETNOMATEMATIKA_MENGUNGKAP_MATEMATIKA_DALAM_BUDAYA_NUSANTARA)).
- **Saya tidak menemukan kreator yang konsisten menggabungkan Nusantara × MTK/fisika** dalam format video pendek beranimasi premium.
  - Konten sejarah di TikTok umumnya membahas tokoh dan kerajaan arus utama ([skripsi UIN SATU](https://repo.uinsatu.ac.id/68915/)).
  - Akun fisika di Instagram berdiri sendiri, tanpa unsur budaya ([e-journal UNDIKMA](https://e-journal.undikma.ac.id/index.php/Lensa/article/download/16278/7301)).
  - Yang ada di YouTube kebanyakan rekaman kegiatan sekolah ([Festival Batik Matematika](https://www.youtube.com/watch?v=1Kmi6JeJzRc)).
- **Kesimpulan:** celahnya nyata. Isinya punya landasan riset yang kuat, tapi bentuk kontennya untuk publik belum digarap. Bonusnya, guru dan pengembang kurikulum yang memakai pendekatan kearifan lokal/etnosains bisa menjadi audiens kedua, sekaligus calon pengguna platform.
- **Catatan:** penelusuran ini terbatas pada mesin pencari. Pencarian langsung di IG dan TikTok (misalnya #etnomatematika, #etnosains, #matematikabudaya) belum saya lakukan. Kreator sains umum yang sudah besar, seperti kanal animasi sains dan kreator matematika populer, tetap jadi pesaing untuk perhatian penonton, meskipun tidak di niche yang sama.

---

## 3. Empat pilar konten (= empat kelopak kawung)

| Pilar | Isi | Porsi awal | Fungsi |
|---|---|---|---|
| **1. Ruang Hitung** (MTK) | Konsep, bukti visual, trik, pembahasan soal | 30% | Konten *evergreen* yang dicari orang, nanti jadi materi platform |
| **2. Ruang Semesta** (Fisika) | Konsep, simulasi, eksperimen | 20% | Sama seperti pilar 1 |
| **3. Fakta Unik** | Paradoks dan fakta mengejutkan MTK/fisika | 20% | Menarik penonton baru, mudah dibagikan |
| **4. Jejak Ilmu Nusantara** | Sejarah/budaya Nusantara × MTK/fisika | 30% | **Ciri khas utama**, pembeda dari kreator lain |

**Bank ide pilar 4.** Semua fakta wajib diverifikasi dulu sebelum produksi:
- Kalender Jawa: weton berulang setiap 35 hari = KPK(5, 7). Pasaran dan hari dalam seminggu sebagai aritmetika modular.
- Batik kawung & parang: simetri dan grup wallpaper. Batik fraktal.
- Gamelan: frekuensi, gelombang, dan tangga nada slendro/pelog dibandingkan dengan nada Barat.
- Angklung dan bedug: resonansi tabung dan membran.
- Kapal pinisi dan perahu bercadik: gaya apung Archimedes dan stabilitas.
- Sriwijaya dan angin muson: fisika atmosfer di balik jalur dagang.
- Navigasi bintang pelaut Bugis: astronomi dan sudut.
- Rumah adat tahan gempa: fisika getaran dan sambungan pasak.
- Sumpit/tulup: tekanan udara dan gerak peluru.
- Geometri Borobudur: susunan stupa dan pola tingkat.
- Pranata mangsa: kalender musim berbasis posisi matahari.

---

## 4. Peta jalan: dari konten ke platform

1. **Fase 1 — Konten (bulan 0–6)**
   - Ritme: 3–4 Reels/Shorts per minggu + 1 video YouTube panjang per 2 minggu.
   - Pakai skill `video-ruang-hitung` supaya produksinya konsisten dan cepat.
   - Dari awal, tandai setiap video dengan topik kurikulum (kelas & bab) agar nanti bisa langsung dipindah ke platform.
2. **Fase 2 — Komunitas (bulan 4–9)**
   - Buat saluran WhatsApp atau newsletter.
   - Beri materi gratis bergaya UDcation (ringkasan rumus PDF, poster batik-matematika) untuk mengumpulkan kontak.
3. **Fase 3 — Platform gratis (MVP)**
   - Isinya: video tersusun per bab + latihan soal singkat.
   - Komponen visual dari skill video dipakai ulang untuk video materi.
4. **Fase 4 — Versi langganan**
   - Isinya: bank soal & pembahasan, tryout, kelas live, dan sertifikat berstempel *Kawung Semesta*.
   - Bisa ditambah paket khusus guru: bahan ajar etnomatematika/etnosains siap pakai.
