"""Verifikasi angka & fakta video BorobudurTanpaSemen. Jalankan: python3 verify/borobudur-tanpa-semen.py"""
import json
from pathlib import Path

sb = json.loads((Path(__file__).parent.parent / "src/storyboards/borobudur-tanpa-semen.json").read_text())
S = {s["id"]: s for s in sb["scenes"]}

# Umur: dibangun abad ke-8–9 (UNESCO) -> tahun 2026 = ±1.130–1.326 tahun -> "sekitar 1.200 tahun" wajar
TAHUN_SEKARANG = 2026
umur_min, umur_max = TAHUN_SEKARANG - 900, TAHUN_SEKARANG - 700
assert umur_min <= 1200 <= umur_max
assert "abad kedelapan sampai kesembilan" in S["pembuka"]["narasi"]

# Volume batu ≈ 55.000 m³ (Balai Konservasi via Historia/Detik)
assert S["volume"]["props"]["to"] == 55000 and "lima puluh lima ribu" in S["volume"]["narasi"]

# Gaya gesek: f = μ N, batu 50 kg, μ = 0,6 (batas bawah rentang 0,6–0,85, Byerlee 1978)
m, g, mu = 50, 9.8, 0.6
N = m * g
f = mu * N
assert round(N) == 490
assert round(f) == 294 and abs(f - 300) < 10, "narasi: 'sekitar tiga ratus newton'"
assert 0.6 <= mu <= 0.85

# Klaim yang SENGAJA tidak dipakai (tak terverifikasi): jumlah 100 pancuran, mitos putih telur
semua = " ".join(s["narasi"] for s in sb["scenes"]).lower()
assert "putih telur" not in semua and "seratus pancuran" not in semua

# Pemugaran: UNESCO menyebut 1970-an
assert "tujuh puluhan" in S["pemugaran"]["narasi"]
assert S["sumber"]["props"]["daftar"] == sb["sumber"]
print("OK: angka & fakta BorobudurTanpaSemen konsisten")
