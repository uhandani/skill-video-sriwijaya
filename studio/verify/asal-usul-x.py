"""Verifikasi fakta & angka video AsalUsulX. Jalankan: python3 verify/asal-usul-x.py"""
import json
from pathlib import Path

sb = json.loads((Path(__file__).parent.parent / "src/storyboards/asal-usul-x.json").read_text())
S = {s["id"]: s for s in sb["scenes"]}

SAT = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan"]
def kata(n: int) -> str:
    """bilangan bulat -> kata Bahasa Indonesia (sampai 9999)"""
    if n < 10: return SAT[n]
    if n == 10: return "sepuluh"
    if n == 11: return "sebelas"
    if n < 20: return SAT[n - 10] + " belas"
    if n < 100: return (SAT[n // 10] + " puluh " + SAT[n % 10]).strip()
    if n < 1000:
        h = "seratus" if n // 100 == 1 else SAT[n // 100] + " ratus"
        return (h + " " + (kata(n % 100) if n % 100 else "")).strip()
    r = "seribu" if n // 1000 == 1 else SAT[n // 1000] + " ribu"
    return (r + " " + (kata(n % 1000) if n % 1000 else "")).strip()

assert kata(1591) == "seribu lima ratus sembilan puluh satu"
assert kata(1637) == "seribu enam ratus tiga puluh tujuh"

# Tahun di narasi = tahun di layar = tahun di sumber (MacTutor/Cajori)
VIETE, DESCARTES = 1591, 1637
assert kata(VIETE) in S["viete"]["narasi"] and str(VIETE) in S["viete"]["props"]["judul"]
assert kata(DESCARTES) in S["descartes-tahun"]["narasi"] and S["descartes-tahun"]["props"]["to"] == DESCARTES
assert "La Géométrie (1637)" in " ".join(sb["sumber"])

# Urutan kronologis adegan: Diophantus (abad 3) < al-Khwarizmi (abad 9) < Viète < Descartes
assert "Abad ketiga" in S["diophantus"]["narasi"] and "Abad ke-3" in S["diophantus"]["props"]["judul"]
assert "Abad kesembilan" in S["khwarizmi"]["narasi"] and "Abad ke-9" in S["khwarizmi"]["props"]["kicker"]
abad = lambda tahun: (tahun - 1) // 100 + 1
assert 3 < 9 < abad(VIETE) == 16 < abad(DESCARTES) == 17

# Aturan Descartes: huruf awal = diketahui, huruf akhir = dicari (Cajori via MacTutor)
L = S["aturan-descartes"]["props"]["langkah"]
assert "diketahui" in L[0]["tex"] and all(c in L[0]["tex"] for c in "abc")
assert "dicari" in L[1]["tex"] and all(c in L[1]["tex"] for c in "xyz")
# Viète: vokal = dicari, konsonan = diketahui
V = S["viete"]["props"]["langkah"]
assert "dicari" in V[0]["tex"] and all(c in V[0]["tex"] for c in "AEIOU")
assert "diketahui" in V[1]["tex"] and not any(c in V[1]["tex"].split(":")[1] for c in "AEIOU")

# Contoh soal pembuka: 2x + 3 = 11 punya jawaban bulat (x = 4)
x = (11 - 3) / 2
assert x == 4

# Teori populer HARUS disebut belum terbukti
assert "belum terbukti" in S["teori-populer"]["narasi"]
assert "belum terbukti" in S["teori-populer"]["props"]["sub"]

# Sumber tampil di video sama dengan daftar sumber storyboard
assert S["sumber"]["props"]["daftar"] == sb["sumber"] and len(sb["sumber"]) >= 3
print("OK: fakta & angka AsalUsulX konsisten dengan sumber")
