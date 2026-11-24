import type { Status } from "../../src/peta";
import { simpulJalur } from "./penilai";
import type { Kiriman } from "./data/tipe";

export type CatatanLatihan = { simpul: string; benar: boolean; detik: number; polaId?: string };

/** Lancar: 10 jawaban latihan terakhir di simpul ini, akurasi ≥ 0,9 dan rata-rata detik < target. */
export function sudahLancar(riwayat: CatatanLatihan[], simpul: string, targetDetik: number): boolean {
  const akhir = riwayat.filter((r) => r.simpul === simpul).slice(-10);
  if (akhir.length < 10) return false;
  const benar = akhir.filter((r) => r.benar).length;
  const rata = akhir.reduce((s, r) => s + r.detik, 0) / akhir.length;
  return benar / akhir.length >= 0.9 && rata < targetDetik;
}

export function simpulLatihanBerikut(jalur: string, status: Record<string, Status>): string | null {
  return simpulJalur(jalur).find((s) => status[s.id] !== "kuasai")?.id ?? null;
}

export function seedBaru(): number {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return (a[0] % 2_000_000_000) + 1;
}

/** Status dari server ditimpa kiriman status yang masih menunggu di antrean (offline tetap terlihat). */
export function gabungStatus(server: Record<string, Status>, tertunda: Kiriman[]): Record<string, Status> {
  const hasil = { ...server };
  for (const k of tertunda) if (k.jenis === "status") hasil[k.simpul] = k.status;
  return hasil;
}
