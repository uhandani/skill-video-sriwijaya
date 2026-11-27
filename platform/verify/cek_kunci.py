"""Dewi Sartika: hitung ulang kunci jawaban dari TEKS soal, terpisah dari kode TypeScript.

Pecahan & persamaan dihitung dengan fractions.Fraction; ubah rumus dicek dengan memasukkan
kunci kembali ke rumus awal pada nilai acak.
"""
import json, math, random, re, sys
from fractions import Fraction as F
from pathlib import Path

def normal(t: str) -> str:
    t = t.replace("−", "-").replace("×", "*").replace("÷", "/").replace("·", "*")
    t = t.replace("½", "(1/2)").replace("²", "**2").replace("^", "**").replace("√", "akar")
    t = re.sub(r"(\d+) (\d+)/(\d+)", r"(\1+\2/\3)", t)          # pecahan campuran
    t = re.sub(r"(\d)\s*([A-Za-zρλ(])", r"\1*\2", t)            # 3x, 2(…)
    t = re.sub(r"\)\s*([A-Za-zρλ(])", r")*\1", t)
    return t

def pecahan(expr: str) -> F:
    t = re.sub(r"(\d+)/(\d+)", r"(\1/\2)", normal(expr))      # a/b ÷ c/d → (a/b)/(c/d)
    return eval(re.sub(r"\d+", lambda m: f"F({m.group()})", t), {"F": F})

def kunci_bilangan(k: str) -> F:
    return F(k)

def linear(eq: str) -> F:
    kiri, kanan = normal(eq).split("=")
    f = lambda x: eval(re.sub(r"\d+", lambda m: f"F({m.group()})", kiri), {"F": F, "x": x}) - \
                  eval(re.sub(r"\d+", lambda m: f"F({m.group()})", kanan), {"F": F, "x": x})
    a = f(F(1)) - f(F(0))
    return -f(F(0)) / a

def cek_rumus(teks: str, kunci: str) -> bool:
    rumus = re.search(r"Rumus: (.+?) \(", teks).group(1)
    target = re.search(r"menjadi (\S) =", teks).group(1)
    kiri, kanan = normal(rumus).split("=")
    lam = {"akar": math.sqrt}
    huruf = set(re.findall(r"[A-Za-zρλ]", rumus)) - {target}
    rnd = random.Random(7)
    for _ in range(5):
        nilai = {h: rnd.uniform(1.5, 9.5) for h in huruf}
        nilai[target] = eval(normal(kunci), lam, dict(nilai))
        if not math.isclose(eval(kiri, lam, nilai), eval(kanan, lam, nilai), rel_tol=1e-9):
            return False
    return True

def hitung(s) -> bool:
    t = s["teks"]
    if s["jenis"] == "ekspresi":
        return cek_rumus(t, s["kunci"])
    k = kunci_bilangan(s["kunci"])
    if m := re.match(r"Hitung: (.+?) = …", t):
        return pecahan(m.group(1)) == k
    if m := re.search(r"memuat (\S+) ton .* lalu (\S+) ton", t):
        return pecahan(m.group(1)) + pecahan(m.group(2)) == k
    if m := re.search(r"luasnya (\d+) hektare\. Sebanyak (\S+) bagian", t):
        return pecahan(m.group(1)) * pecahan(m.group(2)) == k
    if m := re.search(r"(?:Selesaikan:|Jadi) (.+?=.+?)\. Berapa", t):
        return linear(m.group(1)) == k
    raise ValueError(f"pola teks tidak dikenal: {t}")

def main():
    sampel = json.loads((Path(__file__).parent / "sampel.json").read_text())
    salah = [s for s in sampel if not hitung(s)]
    for s in salah:
        print(f"SALAH {s['templat']} seed {s['seed']}: {s['teks']} → kunci {s['kunci']}")
    if salah:
        sys.exit(1)
    print(f"cek_kunci: OK ({len(sampel)} soal)")

main()
