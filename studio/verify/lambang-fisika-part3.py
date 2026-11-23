"""Verifikasi fakta video LambangFisikaPart3. Jalankan: python3 verify/lambang-fisika-part3.py"""
import json
from pathlib import Path

sb = json.loads((Path(__file__).parent.parent / "src/storyboards/lambang-fisika-part3.json").read_text())
S = {s["id"]: s for s in sb["scenes"]}

# huruf -> (istilah, besaran, satuan SI, status) — sumber: Wikipedia Electric current / Ohm / Volt, IEC 113-02-10
BENAR = {
    "I": ("Intensité", "kuat arus", "ampere", "jelas"),
    "Q": ("Quantity", "muatan", "coulomb", "konon"),   # asal huruf Q belum pasti
    "V": ("Volta", "tegangan", "volt", "jelas"),
    "R": ("Resistance", "hambatan", "ohm", "jelas"),
}
for sid in ("i", "q", "v", "r"):
    p = S[sid]["props"]
    istilah, besaran, satuan, status = BENAR[p["huruf"]]
    assert p["kata"] == istilah and besaran in p["besaran"] and satuan in p["satuan"] and p["status"] == status, p
    assert p["kata"][0] == p["huruf"]

# Konsistensi dimensi rumus (SI dasar: A, s, kg, m)
# I = Q/t : C/s = A ;  V = W/Q : J/C = V ;  R = V/I : V/A = Ω ;  V = I·R
I, R = 2.0, 6.0
V = I * R
assert abs(V / I - R) < 1e-12 and abs(V / R - I) < 1e-12
Q, t = 10.0, 5.0
assert Q / t == 2.0  # 10 C dalam 5 s = 2 A
# Tahun sejarah
assert "1820" in S["i"]["narasi"]   # Ampère, hukum gaya 1820
assert "1800" in S["v"]["narasi"]   # tumpukan Volta, 1800
assert "Ω" in S["r"]["props"]["satuan"]
# Rangkaian: arus konvensional keluar dari kutub + (pelat panjang, atas) -> atas -> kanan -> bawah -> kiri
items = S["rangkaian"]["props"]["items"]
panah = [it for it in items if it["type"] == "polygon"][0]["points"]
assert panah[0][0] < panah[1][0], "panah di kabel bawah menunjuk ke kiri"
plat = [it for it in items if it["type"] == "line" and it.get("kata") == "Baterai"]
assert plat[0]["from"][1] < plat[1]["from"][1] and plat[0]["to"][0] - plat[0]["from"][0] > plat[1]["to"][0] - plat[1]["from"][0], "pelat panjang (+) di atas"
assert S["sumber"]["props"]["daftar"] == sb["sumber"]
print("OK: fakta & rangkaian LambangFisikaPart3 konsisten")
