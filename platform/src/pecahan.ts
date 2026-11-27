/** Bilangan rasional sederhana: q > 0, FPB(|p|, q) = 1. */
export type Pecahan = { p: number; q: number };

const fpb = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
};

export function pec(p: number, q = 1): Pecahan {
  if (q === 0) throw new Error("penyebut nol");
  if (!Number.isInteger(p) || !Number.isInteger(q)) throw new Error("pec butuh bilangan bulat");
  const s = q < 0 ? -1 : 1;
  const g = fpb(p, q);
  return { p: (s * p) / g + 0, q: (s * q) / g };
}

export const tambah = (a: Pecahan, b: Pecahan) => pec(a.p * b.q + b.p * a.q, a.q * b.q);
export const kurang = (a: Pecahan, b: Pecahan) => pec(a.p * b.q - b.p * a.q, a.q * b.q);
export const kali = (a: Pecahan, b: Pecahan) => pec(a.p * b.p, a.q * b.q);
export const bagi = (a: Pecahan, b: Pecahan) => pec(a.p * b.q, a.q * b.p);
export const sama = (a: Pecahan, b: Pecahan) => a.p * b.q === b.p * a.q;
export const keDesimal = (a: Pecahan) => a.p / a.q;
export const keTeks = (a: Pecahan) => (a.q === 1 ? `${a.p}` : `${a.p}/${a.q}`);
