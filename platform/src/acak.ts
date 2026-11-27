/** Pembangkit acak berbenih (mulberry32) — soal sama untuk seed sama. */
export type Acak = {
  dasar(): number;
  bulat(min: number, max: number): number;
  pilih<T>(xs: readonly T[]): T;
};

export function buatAcak(seed: number): Acak {
  let a = seed >>> 0;
  const dasar = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    dasar,
    bulat: (min, max) => min + Math.floor(dasar() * (max - min + 1)),
    pilih: (xs) => xs[Math.floor(dasar() * xs.length)],
  };
}
