# Tema Pilar, Ilustrasi & Thumbnail (dipakai ketiga skill UDcation)

## Tema per pilar

`"pilar"` di storyboard otomatis memasang palet & motif (`studio/src/brand/tema.ts`).
Emas & krem sama di semua pilar = benang merah brand.

| Pilar (`pilar`) | Skill | Latar utama (`bg: navy`) | Latar sekunder (`bg: cokelat`) | Bar subtitle | Aksen ilustrasi | Motif batik |
|---|---|---|---|---|---|---|
| `Ruang Hitung` (juga `Fakta Unik`) | video-sains-nusantara | navy | cokelat kayu | marun | merah | **kawung** |
| `Ruang Semesta` | video-ruang-semesta | hijau zamrud | langit malam indigo | jingga senja | hijau giok | **mega mendung** |
| `Ruang Nusantara` (juga `Jejak Ilmu Nusantara`) | video-ruang-nusantara | cokelat sogan | laut indigo | indigo | terakota | **parang** |

Nama `bg` tetap `navy`/`cokelat`/`perkamen`/`kayu` — artinya **peran** (utama/sekunder), warnanya
mengikuti pilar. Perkamen sama di semua pilar (pembuka pena emas, "masa lalu", miskonsepsi);
teks krem/emas TIDAK terbaca di perkamen — pakai perkamen hanya untuk diagram bertinta gelap.

## Adegan `ilustrasi` (gaya video Sriwijaya)

```json
{ "type": "ilustrasi", "props": {
  "judul": "opsional",
  "garisLaut": 1180,
  "elemen": [
    { "jenis": "matahari", "x": 230, "y": 420, "skala": 1.3, "at": 0.2 },
    { "jenis": "kapal", "x": 560, "y": 1190, "skala": 2.4, "at": 0.9, "kata": "Pinisi," },
    { "jenis": "awan", "x": 760, "y": 520, "gerak": "melayang" }
  ],
  "label": [ { "teks": "Pinisi", "x": 560, "y": 1400, "at": 1.8, "emas": true, "ukuran": 70 } ]
} }
```

- Kanvas: lebar **1000**, tinggi **1778** (9:16). Jaga elemen di atas y≈1300 (bar subtitle di ±1325).
- `garisLaut` = y laut/tanah; di bawahnya otomatis laut indigo bermotif ombak.
- Titik (x, y) = **tengah-bawah** benda; untuk benda langit (matahari, bulan, bumi, planet, bintang) = **pusat**.
- `skala` 1 ≈ lebar 200 satuan. `gerak`: `melayang` (naik-turun) atau `geser` (bergerak ke kanan).
  Matahari berputar, kapal & gong bergoyang, ombak & bintang bergerak sendiri.
- Isyarat `"kata"` berlaku untuk elemen & label (lihat production.md → sinkron).

Jenis yang tersedia (`studio/src/components/Ilustrasi.tsx`):

| Langit | Alam | Budaya & manusia |
|---|---|---|
| `matahari` `bulan` `bumi` `planet` `bintang` `awan` | `gunung` `ombak` `kelapa` | `kapal` (jung/pinisi) `candi` `rumahPanggung` `gong` `orang` (bercaping) |

Gaya wajib untuk ilustrasi baru: garis krem tebal (±4,5) berujung bulat, isian warna **tekstil tetap**
(`IL.kayu`, `IL.indigo`, `IL.bata`, … — tidak ikut tema, seperti video Sriwijaya), aksen `C.emas`/`C.aksen2`,
isen-isen titik/garis, bentuk sederhana tanpa wajah detail. Tambahkan ke `ILUSTRASI` + tipe `JenisIlustrasi`
lalu dokumentasikan di tabel ini.

## Thumbnail

Setiap storyboard punya field `thumbnail`; komposisi `<Id>-thumb` (Reels/Shorts 1080×1920) dan
`<Id>-thumb-yt` (YouTube 1280×720) otomatis tersedia.

```json
"thumbnail": {
  "hook": "Kayu *Puluhan Ton*\nKok Bisa Terapung?",
  "sub": "Rahasia kapal pinisi dari Sulawesi",
  "elemen": [ { "jenis": "kapal", "x": 520, "y": 760, "skala": 2.6 } ],
  "tex": "opsional — rumus besar di tengah gambar (konten MTK)"
}
```
- `hook`: maks 2 baris, 2–5 kata per baris; kata dalam `*bintang*` jadi emas (1–2 kata kunci saja).
  Ukuran huruf menyesuaikan baris terpanjang otomatis.
- `elemen`: kanvas persegi 1000×1000, pusat gambar di (500, 520). Satu objek pahlawan besar + 1–2 pendamping.
- Render: `npx remotion still <Id>-thumb out/thumb/<Id>.png` dan `npx remotion still <Id>-thumb-yt out/thumb/<Id>-yt.png`.

**Rumus hook yang "wow"** (pilih satu):
1. **Paradoks**: "Bulan Itu *Selalu Jatuh!*" — fakta yang terdengar salah.
2. **Angka mengejutkan**: "Kayu *Puluhan Ton* Kok Bisa Terapung?"
3. **Pertanyaan kenapa**: "Kenapa Harus *x*?"
4. **Rahasia/trik**: "Rahasia Tali *3-4-5*"
5. **Mitos atau fakta**: "Borobudur Pakai *Rasio Emas*?" (wajib dijawab jujur di video)
Hindari clickbait yang tidak dijawab di video. Badge pilar & logo otomatis.
