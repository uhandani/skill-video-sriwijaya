import type { Acak } from "../../src/acak";
import { pec, type Pecahan } from "../../src/pecahan";
import { samaJawaban, type Jawaban } from "../../src/templat";

export const B = (x: Pecahan): Jawaban => ({ jenis: "bilangan", nilai: x });
export const E = (teks: string, variabel: string[]): Jawaban => ({ jenis: "ekspresi", teks, variabel });

export const fpb = (a: number, b: number): number => (b ? fpb(b, a % b) : Math.abs(a));
export const kpk = (a: number, b: number) => (a / fpb(a, b)) * b;

/** Pecahan sejati acak a/b sudah sederhana, 2 ≤ b ≤ maks. */
export function pecahanAcak(acak: Acak, maks: number): Pecahan {
  for (;;) {
    const b = acak.bulat(2, maks), a = acak.bulat(1, b - 1);
    if (fpb(a, b) === 1) return pec(a, b);
  }
}

export const tulis = (x: Pecahan) => (x.q === 1 ? `${x.p}` : `${x.p}/${x.q}`);

/** Ulangi gen sampai kunci & semua jawaban pola saling berbeda (dan lolos syarat tambahan). */
export function unik<P>(acak: Acak, gen: (a: Acak) => P, jawab: (p: P) => Jawaban[], syarat: (p: P) => boolean = () => true): P {
  for (let i = 0; i < 1000; i++) {
    const p = gen(acak);
    if (!syarat(p)) continue;
    let js: Jawaban[];
    try { js = jawab(p); } catch { continue; }
    if (js.every((x, k) => js.slice(k + 1).every((y) => !samaJawaban(x, y)))) return p;
  }
  throw new Error("unik: tidak menemukan parameter");
}
