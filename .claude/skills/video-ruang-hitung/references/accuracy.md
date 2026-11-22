# Akurasi (wajib untuk konten MTK & fisika)

Konten edukasi yang salah merusak kepercayaan channel. Setiap video harus lolos verifikasi
sebelum dirender.

## Aturan

1. **Setiap angka di narasi, rumus, label diagram, grafik, dan counter** punya assert di
   `studio/verify/<nama-file-storyboard>.py` (nama sama dengan file JSON-nya).
2. Rumus diturunkan atau dicek secara simbolik/numerik — jangan hanya disalin.
3. **Satuan fisika** selalu ditulis dan konsisten. Konstanta diberi pembulatan eksplisit
   (g ≈ 9,8 m/s²) dan disebut di `sumber`.
4. **Asumsi** (tanpa hambatan udara, benda titik, gesekan diabaikan) disebut di narasi atau kesimpulan.
5. Grafik dan simulasi memakai fungsi yang **sama** dengan rumus di video
   (`graph.expr`, `projectile` menghitung dari persamaan gerak).
6. Pembulatan di narasi harus jujur: "sekitar 35 meter" untuk 35,35; "hampir 41" untuk 40,82.
7. Fakta sejarah/budaya: minimal satu sumber kredibel di `sumber`. Jika tidak yakin → tanya pengguna
   atau tulis dengan bahasa hati-hati ("menurut catatan …", "diperkirakan …"). Jangan mengarang tahun, nama, atau angka.
8. Koordinat geometri dihitung dengan skrip (panjang sisi, tegak lurus, titik tengah) dan
   diperiksa di skrip verifikasi bila bentuknya klaim matematis (mis. persegi miring benar-benar persegi).

## Templat skrip verifikasi

```python
"""Verifikasi angka video <Id>. Jalankan: python3 verify/<nama>.py"""
import math

# 1. angka di narasi
assert ...

# 2. rumus (cek numerik di beberapa titik, atau sympy bila tersedia)
assert math.isclose(..., ...)

# 3. data grafik/diagram di storyboard
...
print("OK: semua angka <Id> benar")
```

Jalankan semua: `cd studio && npm run verifikasi`.
