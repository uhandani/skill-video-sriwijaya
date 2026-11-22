"""Verifikasi angka video GerakParabola45 (tanpa hambatan udara). Jalankan: python3 verify/gerak-parabola-45.py"""
import math
g, v0 = 9.8, 20
R = lambda deg: v0**2 * math.sin(math.radians(2*deg)) / g
r30, r45, r60 = R(30), R(45), R(60)
print(f"R(30)={r30:.2f} m, R(45)={r45:.2f} m, R(60)={r60:.2f} m")
assert round(r30) == 35, "narasi: 'sekitar tiga puluh lima meter'"
assert 40.5 < r45 < 41, "narasi: 'hampir empat puluh satu meter'"
assert math.isclose(r30, r60), "30° dan 60° harus sama jauh"
assert round(r45, 1) == 40.8, "counter: 40,8 m"
# 45° adalah maksimum
best = max(range(0, 91), key=R)
assert best == 45
# titik grafik di storyboard
assert abs(r30 - 35.35) < 0.01 and abs(r45 - 40.82) < 0.01
print("OK: semua angka GerakParabola45 benar")
