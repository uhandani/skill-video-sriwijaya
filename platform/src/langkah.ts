import { bacaEkspresi, nilai, variabelDari, type Ekspresi } from "./ekspresi";
import { pec, sama, type Pecahan } from "./pecahan";

export type Persamaan = { kiri: Ekspresi; kanan: Ekspresi };
export type Solusi = Pecahan | "semua" | "tidak-ada";
export type PolaLangkah = { id: string; terapkan(sebelum: Persamaan, v: string): Persamaan[] };
export type HasilLangkah = { benar: boolean; jatuhDi?: number; polaId?: string };

const EPS = 1e-9;

export function bacaPersamaan(teks: string): Persamaan | null {
  const ruas = teks.split("=");
  if (ruas.length !== 2) return null;
  const kiri = bacaEkspresi(ruas[0]), kanan = bacaEkspresi(ruas[1]);
  return kiri && kanan ? { kiri, kanan } : null;
}

/** e = a·v + b, atau null bila tidak linear dalam v / ada variabel lain. */
export function koefLinear(e: Ekspresi, v: string): { a: number; b: number } | null {
  if (variabelDari(e).some((x) => x !== v)) return null;
  const f = (x: number) => nilai(e, { [v]: x });
  const b = f(0), a = f(1) - b;
  if (![a, b].every(Number.isFinite)) return null;
  for (const x of [2, 7.3, -3.1]) if (Math.abs(f(x) - (a * x + b)) > 1e-7 * Math.max(1, Math.abs(f(x)))) return null;
  return { a, b };
}

/** Pecahan terdekat (penyebut ≤ 10000) bila cukup tepat. */
export function kePecahan(x: number): Pecahan | null {
  for (let q = 1; q <= 10000; q++) {
    const p = Math.round(x * q);
    if (Math.abs(p / q - x) < 1e-9 * Math.max(1, Math.abs(x))) return pec(p, q);
  }
  return null;
}

export function solusiLinear(p: Persamaan, v: string): Solusi | null {
  const L = koefLinear(p.kiri, v), R = koefLinear(p.kanan, v);
  if (!L || !R) return null;
  const a = L.a - R.a, b = R.b - L.b;
  if (Math.abs(a) < EPS) return Math.abs(b) < EPS ? "semua" : "tidak-ada";
  return kePecahan(b / a);
}

const samaSolusi = (x: Solusi | null, y: Solusi | null) =>
  x !== null && y !== null && (typeof x === "string" || typeof y === "string" ? x === y : sama(x, y));

const bentukAkhir = (p: Persamaan, v: string) => {
  const isVar = (e: Ekspresi) => e.k === "var" && e.v === v;
  const tanpaVar = (e: Ekspresi) => variabelDari(e).length === 0;
  return (isVar(p.kiri) && tanpaVar(p.kanan)) || (isVar(p.kanan) && tanpaVar(p.kiri));
};

/** Cek langkah demi langkah; langkah pertama yang solusinya berubah = titik jatuh. */
export function cekLangkah(awal: string, langkah: string[], v: string, pola: PolaLangkah[]): HasilLangkah {
  const p0 = bacaPersamaan(awal);
  if (!p0) throw new Error(`persamaan awal tak terbaca: ${awal}`);
  const s0 = solusiLinear(p0, v);
  let sebelum = p0;
  for (let i = 0; i < langkah.length; i++) {
    const p = bacaPersamaan(langkah[i]);
    if (!p) return { benar: false, jatuhDi: i };
    const s = solusiLinear(p, v);
    if (!samaSolusi(s, s0)) {
      const cocok = pola.find((pl) => pl.terapkan(sebelum, v).some((q) => samaSolusi(solusiLinear(q, v), s)));
      return cocok ? { benar: false, jatuhDi: i, polaId: cocok.id } : { benar: false, jatuhDi: i };
    }
    sebelum = p;
  }
  return langkah.length > 0 && bentukAkhir(sebelum, v) ? { benar: true } : { benar: false };
}
