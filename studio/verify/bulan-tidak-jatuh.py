"""Verifikasi angka video BulanTidakJatuh. Jalankan: python3 verify/bulan-tidak-jatuh.py"""
import math
GM = 3.986004418e14      # m^3/s^2, IERS 2010
r = 384_400e3            # m, jarak rata-rata (NASA)
v = math.sqrt(GM / r)
print(f"v = {v:.1f} m/s")
assert 1000 < v < 1030, "harus 'sekitar satu kilometer per detik'"
assert round(v / 1000, 1) == 1.0          # counter & langkah akhir: 1,0 km/s
assert abs(v / 1000 - 1.022) < 0.01       # konsisten dgn NASA 1,022 km/s (orbit nyata elips)
assert abs(GM / 1e14 - 3.986) < 0.001 and abs(r / 1e8 - 3.844) < 0.001  # angka di rumus
print("OK: angka BulanTidakJatuh benar")
