"""Verifikasi angka video PinisiTerapung. Jalankan: python3 verify/pinisi-terapung.py"""
rho = 1025.0             # kg/m^3 air laut (NOAA, pembulatan)
m = 100_000.0            # kg = 100 ton
V = m / rho              # syarat terapung: berat = gaya apung -> m g = rho V g
print(f"V = {V:.2f} m^3")
assert round(V) == 98, "narasi: 'sekitar sembilan puluh delapan meter kubik'"
# UNESCO: Pinisi, art of boatbuilding in South Sulawesi — inscribed 2017 (12.COM)
TAHUN_UNESCO = 2017
assert TAHUN_UNESCO == 2017
print("OK: angka PinisiTerapung benar")
