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
| `type` | `title` · `diagram` · `equation` · `graph` · `projectile` · `counter` · `outro` |
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
Kesimpulan → rumus emas → logo Δ Kawung beranimasi → wordmark UDCATION → tagline → ajakan.
Watermark logo kecil otomatis hilang saat outro.

---

## Komponen pendukung (untuk adegan baru)

| Komponen | File | Fungsi |
|---|---|---|
| `Background` | `components/Background.tsx` | latar bertekstur + grain + light leak + vignette, drift pelan |
| `TumpalFrame` | `components/TumpalFrame.tsx` | bingkai krem ganda + tumpal, tergambar |
| `DeltaLogo` | `components/DeltaLogo.tsx` | logo Δ Kawung animasi (kelopak tumbuh, titik jatuh, kilau) |
| `GoldText` | `components/GoldText.tsx` | teks emas foil + kilau menyapu |
| `Tex` | `components/Tex.tsx` | KaTeX; `\g{}` = emas |
| `CaptionBar` | `components/CaptionBar.tsx` | subtitle marun karaoke |
| `goldIris`, `perkamen` | `components/transitions.tsx` | transisi khas |
| `SceneHeading`, `Kicker`, `GoldDust`, `useAppear`, `useS` | `scenes/common.tsx` | judul adegan, label pilar, debu emas, animasi muncul, skala |

Pola adegan baru: terima props dari JSON, pakai `useCurrentFrame()` + `interpolate()` (bukan CSS animation),
ukuran dikali `s` dari `useS()`, warna dari `C`, fokus emas maksimal 1–2.
