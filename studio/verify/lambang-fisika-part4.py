"""Verifikasi fakta video LambangFisikaPart4. Jalankan: python3 verify/lambang-fisika-part4.py"""
import json, math
from pathlib import Path

sb = json.loads((Path(__file__).parent.parent / "src/storyboards/lambang-fisika-part4.json").read_text())
S = {s["id"]: s for s in sb["scenes"]}
BENAR = {  # huruf -> (kata asal, besaran, satuan SI) — etymonline, BIPM SI Brochure
    "F": ("Force", "gaya", "newton"), "m": ("mass", "massa", "kilogram"),
    "g": ("gravitas", "gravitasi", "m/s²"), "E": ("Energy", "energi", "joule"),
}
for sid in ("f", "m", "g", "e"):
    p = S[sid]["props"]
    kata, besaran, satuan = BENAR[p["huruf"]]
    assert p["kata"] == kata and besaran in p["besaran"] and satuan in p["satuan"], p
    assert p["kata"][0].lower() == p["huruf"].lower()
# satuan turunan: 1 N = 1 kg·m/s², 1 J = 1 N·m  (dimensi [M L T^-2] dan [M L^2 T^-2])
N = (1, 1, -2); J = tuple(a + b for a, b in zip(N, (0, 1, 0)))
assert J == (1, 2, -2)
# g ≈ 9,8 m/s² (standar 9,80665)
assert abs(9.80665 - 9.8) < 0.01 and "9,8" in S["g"]["narasi"]
# kelapa jatuh 10 m: t = sqrt(2h/g) ≈ 1,43 s < siklus 3 s ; v saat menyentuh tanah ≈ 14 m/s
t = math.sqrt(2 * 10 / 9.8); assert 1.4 < t < 1.45 and t + 1.3 < 3.0
# Ek = ½ m v² konsisten dengan joule: kg·(m/s)² = kg·m²/s²
assert S["sumber"]["props"]["daftar"] == sb["sumber"]
print("OK: fakta LambangFisikaPart4 konsisten (t jatuh kelapa = %.2f s)" % t)
