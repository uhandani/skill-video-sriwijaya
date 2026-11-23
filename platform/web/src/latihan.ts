import type { Status } from "../../src/peta";
import { simpulJalur } from "./penilai";

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
