# Panduan Gaya "Nusantara Emas" — UDcation

Diturunkan dari video referensi Sriwijaya (ilustrasi tekstil + foil emas), disesuaikan untuk MTK & fisika.
Implementasi ada di `studio/src/` — panduan ini menjelaskan *kenapa* dan *kapan*.

## Identitas

- **Brand**: UDcation (UD = Uhan Dani, plesetan *education*). Tagline: *Ilmu Semesta · Rasa Nusantara*.
- **Logo (resmi sejak 25 Nov 2026)**: **Δ Kawung Cetak Biru** — tiga kelopak kawung berupa **garis emas** `#EDB53D`
  tanpa isi dan **tanpa arsiran**, membentuk segitiga Δ; titik krem `#F1E6D0` di pusat (titik berat). Latar navy
  `#262B4A`. Garis bantu teknik (garis tengah putus-putus, lingkaran, sudut 60°) hanya untuk logo besar (intro/outro).
  Δ = perubahan; 3 kelopak = Matematika, Fisika, Nusantara. Logo isi foil lama = arsip, jangan dipakai lagi.
- **Wordmark**: `UDCATION` kapital renggang, IBM Plex Mono — "UD" tebal emas, "CATION" reguler krem.
  Tagline tulisan tangan (Architects Daughter) di aset brand; di video tetap pakai font video.
- **Pilar konten**: Ruang Hitung (MTK) · Ruang Semesta (fisika) · Fakta Unik · Jejak Ilmu Nusantara.

## Warna

| Token | Hex | Pakai untuk |
|---|---|---|
| navy | `#262B4A` | latar utama ("papan tulis malam") |
| cokelat | `#8E5227` | latar sekunder: contoh soal, angka, dunia nyata |
| perkamen | `#CDBFA6` | pembuka pena emas, "masa lalu", miskonsepsi |
| emas | `#EDB53D` | HANYA 1–2 fokus per adegan: rumus kunci, jawaban, titik penting |
| marun | `#6A1A25` | bar subtitle, isian bangun, penekanan kedua |
| krem | `#F1E6D0` | semua garis & teks biasa di latar gelap |

## Tekstur & ornamen

- Latar selalu bertekstur: kawung samar (navy), anyaman tenun (cokelat/kayu), kotak buku (perkamen)
  + butiran film + light leak hangat + vignette. Kamera selalu drift pelan.
- Bingkai krem ganda + tumpal (segitiga) untuk hook & outro (`bingkai: true`).
- Debu emas melayang di setiap adegan → tidak ada frame yang diam total.

## Tipografi

- Judul, label diagram, angka besar: **Cormorant Garamond Bold** (angka oldstyle = khas elegan).
- Subtitle, label kecil, panel angka: **Mulish ExtraBold**.
- Rumus: **KaTeX** (font Computer Modern) — krem, bagian kunci `\g{}` emas berpendar.
- Ukuran minimum (lebar 1080): judul adegan 64 px, judul hook 84–104 px, teks pendukung ≥ 38 px.

## Subtitle (ciri paling khas)

Bar marun bertekstur, garis emas atas-bawah, di ±74% tinggi layar, 2–5 kata per potongan.
Karaoke: kata yang sedang diucapkan emas + sedikit membesar; yang sudah krem; yang belum krem 55%.
Bar tetap tampil antar-potongan dalam satu adegan (tidak berkedip).

## Signature moves

| Gerakan | Implementasi | Kapan |
|---|---|---|
| Pena emas | `diagram` + `pena: true` di `bg: perkamen` | pembuka video |
| Iris cincin emas | transisi `iris` | perpindahan adegan default |
| Draw-on | semua item `diagram`, kurva `graph`, sumbu | setiap garis/bangun |
| Foil shine | `GoldText`, logo | judul, angka besar |
| Count-up | `counter` | hasil hitung, angka mengejutkan |
| Fade perkamen | transisi `perkamen` | keluar dari "yang salah / masa lalu" |
| Bingkai emas rumus | langkah terakhir `equation` | rumus kunci / jawaban |
| Logo mekar | `outro` | penutup |

## Audio

VO Bahasa Indonesia tenang & penasaran; musik etnik-sinematik lembut terus-menerus (ducking −12 dB);
SFX halus (shimmer, whoosh, goresan pena). Target ±−14 LUFS.
