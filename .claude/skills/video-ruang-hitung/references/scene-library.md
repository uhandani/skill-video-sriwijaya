# Pustaka Adegan (storyboard JSON)

Struktur storyboard (tipe lengkap: `studio/src/storyboard/types.ts`):

```json
{
  "id": "Pythagoras345",                // huruf/angka/tanda hubung — jadi ID komposisi
  "judul": "Rahasia Tali 3-4-5",
  "pilar": "Ruang Hitung",              // Ruang Hitung | Ruang Semesta | Fakta Unik | Jejak Ilmu Nusantara
  "kurikulum": "SMP Kelas 8 — Teorema Pythagoras",
  "rasio": "9:16",                      // atau "16:9"
  "kpd": 2.6,                           // kata per detik (subtitle & cek durasi)
  "sumber": ["..."],                    // WAJIB
  "audio": { "voiceover": "audio/vo.mp3", "musik": "audio/musik.mp3", "musikVolume": 0.18 },
  "scenes": [ /* adegan berurutan */ ]
}
```

Field umum tiap adegan:

| Field | Keterangan |
|---|---|
| `id` | unik dalam storyboard |
| `type` | `title` · `diagram` · `equation` · `graph` · `projectile` · `counter` · `ilustrasi` · `outro` · `sumber` |
| `durasi` | detik. Minimal ≈ `kata/2.6 + 0.3 + durasi transisi`. `npm run cek` menghitungnya. |
| `narasi` | teks voice-over = sumber subtitle karaoke |
| `bg` | `navy` (default) · `cokelat` · `perkamen` · `kayu` |
| `transisi` | transisi KELUAR: `iris` (default, 0,73 dtk) · `fade` (0,5) · `perkamen` (0,8) |
| `bingkai` | `true` = bingkai krem ganda + tumpal (pakai di hook & outro) |
| `props` | khusus per tipe (di bawah) |

Waktu di dalam `props` (`at`, `dur`) dalam **detik relatif awal adegan**.

**Isyarat kata (sinkron dengan voice-over)** — item diagram, langkah rumus, titik & kurva grafik
boleh diberi `"kata": "tiga"` (opsional `"kataKe": 2` untuk kemunculan ke-2, `"kataMaju": 0.1`
detik lebih awal). `npm run sinkron` lalu mengisi `at` tepat saat kata itu diucapkan, jadi visual
muncul bersamaan dengan suara. Kata dicocokkan tanpa tanda baca, tidak peka huruf besar.
Field `vo` pada adegan diisi otomatis — jangan ditulis manual.

**Wajib pada video ber-VO:** beri `"kata"` pada SEMUA elemen yang menggambarkan sesuatu yang
diucapkan (blok, panah, label, ilustrasi). Elemen tanpa isyarat memakai `at` tetap dan bisa muncul
*sebelum* kata-nya diucapkan → urutan terasa salah. Untuk elemen pendukung yang muncul berurutan
pada satu kata, pakai `kataMaju` negatif (mis. `-0.4`) agar muncul sedikit *setelah* kata itu.

---

## `title` — hook / judul

```json
{ "kicker": "Ruang Hitung", "judul": "Kenapa harus 3, 4, 5?", "sub": "opsional", "tandaTanya": true, "logo": false }
```
Judul emas foil + kilau; `tandaTanya` = "?" emas besar berdenyut. Judul > 40 huruf otomatis mengecil.

## `diagram` — geometri / ilustrasi yang tergambar (draw-on)

```json
{ "judul": "Persegi di tiap sisi", "pena": false, "items": [ ... ] }
```
Kanvas `viewBox 0..1000 × 0..1000`, diletakkan di tengah area atas (di atas subtitle).
Opsional `top`, `height` (px pada lebar 1080) untuk mengatur area.

Item (semua punya `at`, opsional `dur` (default 0,8), `stroke`, `fill`, `fillOpacity`,
`width` (default 6), `dashed`, `hideAt`, `focus` = cincin emas penanda):

| type | field | catatan |
|---|---|---|
| `line` | `from:[x,y]`, `to:[x,y]` | |
| `polygon` | `points:[[x,y],...]`, `close` | default tertutup |
| `circle` | `c`, `r` | |
| `arc` | `c`, `r`, `from`, `to` | derajat; 0 = kanan, berlawanan jarum jam |
| `rect` | `x,y,w,h` | |
| `path` | `d` | path SVG bebas (mis. grid miring) |
| `rightAngle` | `vertex`, `dir1`, `dir2`, `size` | tanda siku |
| `grid` | `x,y,w,h,step` | kotak satuan (luas) |
| `text` | `pos`, `text`, `size`, `anchor` | serif tebal; warna lewat `fill` |
| `tex` | `pos`, `tex`, `size` | rumus KaTeX di dalam diagram |

Warna: token `krem` `emas` `marun` `navy` `navyTerang` `cokelat` `perkamen` atau hex.
`stroke: "emas"` otomatis gradien foil + glow. Di latar `perkamen` pakai tinta gelap
(`#3A2A12`) dan `marun` — krem tidak terbaca di perkamen.
`pena: true` → pena emas mengikuti garis yang sedang digambar (signature pembuka).

## `equation` — langkah rumus

```json
{ "judul": "Contoh: tangga", "size": 68, "finalEmas": true,
  "langkah": [ { "tex": "b = \\sqrt{5^2 - 3^2}", "at": 2.6, "catatan": "opsional" }, ... ] }
```
Langkah muncul berurutan; yang lama naik & meredup. Langkah terakhir dibingkai emas
(`finalEmas`). Bagian kunci: `\\g{...}` (emas berpendar). Maks ±4 langkah per adegan.
Di JSON backslash ditulis ganda (`\\frac`).

## `graph` — bidang koordinat

```json
{ "judul": "Jangkauan vs sudut", "x": [0, 90], "y": [0, 45], "xLabel": "θ (°)", "yLabel": "R (m)",
  "curves": [ { "expr": "400/9.8*sin(2*x*PI/180)", "at": 0.5, "dur": 2, "label": "R(θ)", "labelAt": 70, "color": "emas" } ],
  "points": [ { "x": 45, "y": 40.82, "label": "45°", "at": 2.8 } ],
  "moving": { "curve": 0, "from": 10, "to": 45, "at": 5.2, "dur": 2.5 } }
```
`expr` = ekspresi JavaScript dalam `x`; fungsi Math tanpa awalan (`sin`, `sqrt`, `PI`, `exp`).
`moving` = titik emas berjalan di kurva dengan garis bantu & koordinat. Angka ditampilkan format Indonesia (koma desimal).

## `projectile` — gerak parabola (dihitung dari fisika)

```json
{ "judul": "θ = 45°", "v0": 20, "sudut": 45, "g": 9.8, "slow": 1.3, "tampilkanVektor": true }
```
Lintasan, vektor vx/vy/v, panel t·x·y, penanda h maks & jangkauan — semua dari
`x = v0 cosθ t`, `y = v0 sinθ t − ½gt²`. `slow` = perlambatan (1 detik simulasi = `slow` detik video).
Pastikan `durasi ≥ 0,6 + slow × T + 1,2` dengan `T = 2 v0 sinθ / g`.

## `counter` — angka besar berhitung

```json
{ "from": 0, "to": 40.8, "desimal": 1, "satuan": "m", "label": "jangkauan terjauh untuk v₀ = 20 m/s" }
```
Untuk tahun pakai `"tahun": true` (tanpa pemisah ribuan: 1637, bukan 1.637).

## `sumber` — daftar sumber riset (setelah outro)

```json
{ "judul": "Sumber riset", "daftar": ["F. Cajori, A History of Mathematical Notations (1928)", "..."], "catatan": "opsional" }
```
Dipakai bila pengguna minta sumber ditampilkan di video. Isi `daftar` = `sumber` storyboard.
Teks krem/emas tidak terbaca di latar `perkamen` — pakai perkamen hanya untuk diagram bertinta gelap.

## `outro` — penutup (wajib di akhir)

```json
{ "kesimpulan": "Seutas tali 3-4-5 = sudut siku-siku sempurna", "tex": "\\g{a^2 + b^2 = c^2}", "ajakan": "Ikuti UDcation untuk seri berikutnya" }
```
Kesimpulan → rumus emas → logo Δ Kawung Cetak Biru (garis bantu muncul, kelopak tergambar, titik jatuh, kilau) → wordmark UDCATION (mono) → tagline → ajakan.
Watermark logo kecil otomatis hilang saat outro.

---

## Komponen pendukung (untuk adegan baru)

| Komponen | File | Fungsi |
|---|---|---|
| `Background` | `components/Background.tsx` | latar bertekstur + grain + light leak + vignette, drift pelan |
| `TumpalFrame` | `components/TumpalFrame.tsx` | bingkai krem ganda + tumpal, tergambar |
| `DeltaLogo` | `components/DeltaLogo.tsx` | logo resmi Δ Kawung Cetak Biru: kelopak garis emas tergambar, titik jatuh, kilau; `construction` = garis bantu; `isStatic` untuk watermark. Tanpa arsiran. |
| `GoldText` | `components/GoldText.tsx` | teks emas foil + kilau menyapu |
| `Tex` | `components/Tex.tsx` | KaTeX; `\g{}` = emas |
| `CaptionBar` | `components/CaptionBar.tsx` | subtitle marun karaoke |
| `goldIris`, `perkamen` | `components/transitions.tsx` | transisi khas |
| `SceneHeading`, `Kicker`, `GoldDust`, `useAppear`, `useS` | `scenes/common.tsx` | judul adegan, label pilar, debu emas, animasi muncul, skala |

Pola adegan baru: terima props dari JSON, pakai `useCurrentFrame()` + `interpolate()` (bukan CSS animation),
ukuran dikali `s` dari `useS()`, warna dari `C`, fokus emas maksimal 1–2.

## `ilustrasi` — adegan ilustrasi bergaya Sriwijaya

Lihat `tema-ilustrasi-thumbnail.md` (daftar jenis, koordinat, gaya wajib). Contoh:
`studio/src/storyboards/pinisi-terapung.json` (adegan `pembuka`, `unesco`).

## `lambang` — kartu lambang besaran (seri "Kode Rahasia Lambang Fisika")

```json
{ "type": "lambang", "props": {
  "kicker": "Lambang Fisika · Part 1",
  "huruf": "v", "kata": "velocity",
  "asal": "Latin: vēlōcitās —", "arti": "“kecepatan”",
  "besaran": "kecepatan", "satuan": "m/s", "tex": "v = \\frac{s}{t}",
  "status": "jelas",
  "momen": [ { "nama": "urai", "kata": "velocity." }, { "nama": "info", "kata": "Latin" },
             { "nama": "rumus", "kata": "kecepatan.", "kataKe": 2 } ] } }
```
Huruf emas raksasa → terurai jadi `kata` (huruf pertama tetap emas) → asal & arti → pil besaran/satuan →
rumus. `kata` harus diawali `huruf`. `status: "konon"` menampilkan lencana "KONON · BELUM PASTI" —
wajib untuk asal-usul yang tidak tercatat jelas. Contoh: `studio/src/storyboards/lambang-fisika-part1.json`.
Pakai `kataKe` bila kata isyarat juga muncul lebih awal di narasi (mis. "kecepatan").
Hemat kredit VO: kalimat yang persis sama (mis. "Sumber riset ada di layar.") boleh memakai ulang file audio video lain.

## `kembar` — huruf kembar (satu huruf, beberapa arti)

Untuk seri "Kode Rahasia Lambang Fisika" Part 6. Setiap varian menjadi kartu: huruf emas | istilah
(huruf awal emas) + `besaran · satuan` | rumus opsional. Kartu muncul pada `at`, atau otomatis
dari isyarat `kata` (diisi `npm run sinkron`).

```json
{ "type": "kembar", "props": { "kicker": "Lambang Fisika · Part 6", "judul": "Huruf P",
  "varian": [
    { "huruf": "P", "istilah": "Power", "besaran": "daya", "satuan": "watt (W)", "tex": "P = \\frac{W}{t}", "kata": "power," },
    { "huruf": "P", "istilah": "Pressure", "besaran": "tekanan", "satuan": "pascal (Pa)", "tex": "P = \\frac{F}{A}", "kata": "pressure," }
  ] } }
```
- `istilah` = teks tampilan; `kata` = isyarat sinkron (kata di narasi, termasuk tanda baca).
- Maksimal 3 varian agar muat di layar 9:16.
