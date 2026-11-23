import type { SesiDiagnostik } from "../../src/diagnostik";

const VERSI = 1;
type Toko = { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void };
const kunci = (jalur: string) => `udcation-diag-${jalur}`;
const tokoBawaan = (): Toko | null => { try { return localStorage; } catch { return null; } };

/** Simpan sesi diagnostik yang sedang berjalan supaya tab yang tertutup bisa dilanjutkan. */
export function simpanSesi(jalur: string, s: SesiDiagnostik, toko = tokoBawaan()): void {
  try { toko?.setItem(kunci(jalur), JSON.stringify({ versi: VERSI, sesi: { ...s, tersirat: [...s.tersirat] } })); } catch { /* abaikan */ }
}

/** Muat sesi; null bila tidak ada, rusak, atau versi beda (jalur diulang dari awal). */
export function muatSesi(jalur: string, toko = tokoBawaan()): SesiDiagnostik | null {
  try {
    const x = JSON.parse(toko?.getItem(kunci(jalur)) ?? "null");
    if (!x || x.versi !== VERSI || !x.sesi || !Array.isArray(x.sesi.antre) || !Array.isArray(x.sesi.tersirat)) return null;
    return { ...x.sesi, tersirat: new Set<string>(x.sesi.tersirat) };
  } catch {
    return null;
  }
}

export function hapusSesi(jalur: string, toko = tokoBawaan()): void {
  try { toko?.removeItem(kunci(jalur)); } catch { /* abaikan */ }
}
