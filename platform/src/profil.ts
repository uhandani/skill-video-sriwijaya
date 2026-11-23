import type { HasilCek } from "./cek";

export type Profil = {
  riwayat: { simpul: string; hasil: HasilCek; waktu: number }[];
  bobot: Record<string, number>;
};

export const profilBaru = (): Profil => ({ riwayat: [], bobot: {} });

/** Catat satu jawaban. Bobot semua pola ×0,9, lalu +1 untuk pola yang muncul. Tidak mengubah profil lama. */
export function catatHasil(pr: Profil, simpul: string, hasil: HasilCek, waktu: number): Profil {
  const bobot: Record<string, number> = {};
  for (const [k, v] of Object.entries(pr.bobot)) bobot[k] = v * 0.9;
  if (hasil.status === "pola" && hasil.polaId) bobot[hasil.polaId] = (bobot[hasil.polaId] ?? 0) + 1;
  return { riwayat: [...pr.riwayat, { simpul, hasil, waktu }], bobot };
}

/** Pola sama ≥ 2 kali dalam 5 jawaban terakhir → remedi. */
export function perluRemedi(pr: Profil): { simpul: string; polaId: string }[] {
  const akhir = pr.riwayat.slice(-5);
  const hitung = new Map<string, { simpul: string; n: number }>();
  for (const r of akhir) {
    const id = r.hasil.status === "pola" ? r.hasil.polaId : undefined;
    if (!id) continue;
    hitung.set(id, { simpul: r.simpul, n: (hitung.get(id)?.n ?? 0) + 1 });
  }
  return [...hitung].filter(([, x]) => x.n >= 2).map(([polaId, x]) => ({ simpul: x.simpul, polaId }));
}

export const polaDominan = (pr: Profil, n = 3) =>
  Object.entries(pr.bobot).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k);

/** Pola salah terbanyak di semua siswa, urut turun. */
export function laporanKumpulan(semua: Profil[]): { polaId: string; jumlah: number }[] {
  const n = new Map<string, number>();
  for (const pr of semua)
    for (const r of pr.riwayat) if (r.hasil.status === "pola" && r.hasil.polaId) n.set(r.hasil.polaId, (n.get(r.hasil.polaId) ?? 0) + 1);
  return [...n].map(([polaId, jumlah]) => ({ polaId, jumlah })).sort((a, b) => b.jumlah - a.jumlah || a.polaId.localeCompare(b.polaId));
}
