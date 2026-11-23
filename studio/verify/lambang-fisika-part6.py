"""Verifikasi fakta video LambangFisikaPart6. Jalankan: python3 verify/lambang-fisika-part6.py"""
import json
from pathlib import Path

sb = json.loads((Path(__file__).parent.parent / "src/storyboards/lambang-fisika-part6.json").read_text())
S = {s["id"]: s for s in sb["scenes"]}

# Pasangan huruf - istilah - besaran - satuan SI (BIPM SI Brochure 2019)
BENAR = {
    ("P", "Power"): ("daya", "watt"), ("P", "Pressure"): ("tekanan", "pascal"),
    ("V", "Voltage"): ("tegangan", "volt"), ("V", "Volume"): ("volume", "m³"),
    ("v", "velocity"): ("kecepatan", "m/s"),
    ("T", "Temperature"): ("suhu", "kelvin"), ("T", "Time (periode)"): ("periode", "sekon"),
    ("W", "Work"): ("usaha", "joule"), ("w", "weight"): ("berat", "newton"),
}
n = 0
for sid in ("p", "v", "t", "w"):
    for v in S[sid]["props"]["varian"]:
        besaran, satuan = BENAR[(v["huruf"], v["istilah"])]
        assert besaran in v["besaran"] and satuan in v["satuan"], v
        assert v["istilah"][0].lower() == v["huruf"].lower(), "huruf = huruf awal istilah"
        assert v["kata"].rstrip(",.").lower() in S[sid]["narasi"].lower(), ("isyarat ada di narasi", v["kata"])
        n += 1
assert n == 9
# Rumus konsisten dengan satuan: P = W/t -> J/s = W ; P = F/A -> N/m² = Pa ; W = F·s -> N·m = J ; w = m·g -> kg·m/s² = N
assert S["trik"]["props"]["sub"].count("→") == 4
assert S["sumber"]["props"]["daftar"] == sb["sumber"]
print("OK: fakta LambangFisikaPart6 konsisten (9 pasangan lambang)")
