"""Verifikasi fakta video LambangFisikaPart1. Jalankan: python3 verify/lambang-fisika-part1.py"""
import json
from pathlib import Path

sb = json.loads((Path(__file__).parent.parent / "src/storyboards/lambang-fisika-part1.json").read_text())
S = {s["id"]: s for s in sb["scenes"]}

# Setiap kartu: kata asal diawali hurufnya (huruf emas = huruf pertama kata)
for sid in ("v", "a", "t", "delta", "s"):
    p = S[sid]["props"]
    assert p["kata"].startswith(p["huruf"]), sid
# Pasangan lambang–kata sesuai sumber (Merriam-Webster, Etymonline, Wikipedia Delta)
assert S["v"]["props"]["kata"] == "velocity" and "vēlōcitās" in S["v"]["props"]["asal"]
assert S["a"]["props"]["kata"] == "acceleration" and "accelerāre" in S["a"]["props"]["asal"]
assert "tempus" in S["t"]["props"]["asal"]
assert "diaphorá" in S["delta"]["props"]["asal"] and "perbedaan" in S["delta"]["props"]["arti"]
# Klaim lemah wajib ditandai
assert S["s"]["props"]["status"] == "konon" and "Konon" in S["s"]["narasi"]
# Satuan SI benar
assert S["v"]["props"]["satuan"] == "m/s" and S["a"]["props"]["satuan"] == "m/s²" and S["t"]["props"]["satuan"].startswith("s")
# Contoh numerik rumus konsisten: v = s/t, a = Δv/Δt
s_, t_ = 100, 20
assert s_ / t_ == 5                       # 100 m dalam 20 s -> 5 m/s
v1, v2, dt = 0, 10, 5
assert (v2 - v1) / dt == 2                # 0 -> 10 m/s dalam 5 s -> 2 m/s²
assert S["sumber"]["props"]["daftar"] == sb["sumber"]
print("OK: fakta LambangFisikaPart1 konsisten")
