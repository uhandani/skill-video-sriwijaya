"""Verifikasi angka & rumus video Pythagoras345. Jalankan: python3 verify/pythagoras-345.py"""
import math
a, b, c = 3, 4, 5
assert a**2 == 9 and b**2 == 16 and c**2 == 25
assert a**2 + b**2 == c**2, "3-4-5 harus memenuhi Pythagoras"
# kebalikan teorema: sisi 3,4,5 -> sudut di depan sisi 5 tepat 90°
gamma = math.degrees(math.acos((a*a + b*b - c*c) / (2*a*b)))
assert abs(gamma - 90) < 1e-9
# contoh tangga: c=5 m, a=3 m -> b=4 m
assert math.isclose(math.sqrt(5**2 - 3**2), 4.0)
# tali 12 simpul: keliling 3+4+5 = 12 satuan
assert a + b + c == 12
# geometri diagram: sisi miring 350 px = 5 satuan x 70 px, persegi miring tegak lurus
import itertools
A, B = (400, 380), (680, 590)
assert math.isclose(math.dist(A, B), 350)
print("OK: semua angka Pythagoras345 benar")
