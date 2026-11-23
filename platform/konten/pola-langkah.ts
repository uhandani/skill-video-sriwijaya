import { bacaPersamaan, koefLinear, type Persamaan, type PolaLangkah } from "../src/langkah";

/** Bangun persamaan aL·v + bL = aR·v + bR dari angka. */
function pers(v: string, aL: number, bL: number, aR: number, bR: number): Persamaan {
  const p = bacaPersamaan(`(${aL})${v}+(${bL})=(${aR})${v}+(${bR})`);
  if (!p) throw new Error("pola-langkah: gagal membangun persamaan");
  return p;
}

function koef(p: Persamaan, v: string) {
  const L = koefLinear(p.kiri, v), R = koefLinear(p.kanan, v);
  return L && R ? { aL: L.a, bL: L.b, aR: R.a, bR: R.b } : null;
}

export const POLA_LANGKAH: PolaLangkah[] = [
  {
    id: "PERS-PINDAH-TANDA-TETAP",
    terapkan(p, v) {
      const k = koef(p, v);
      if (!k) return [];
      const hasil: Persamaan[] = [];
      if (k.bL !== 0) hasil.push(pers(v, k.aL, 0, k.aR, k.bR + k.bL));
      if (k.aR !== 0) hasil.push(pers(v, k.aL + k.aR, k.bL, 0, k.bR));
      if (k.bR !== 0 && k.aL === 0) hasil.push(pers(v, 0, k.bL + k.bR, k.aR, 0));
      return hasil;
    },
  },
  {
    id: "PERS-BAGI-SATU-SUKU",
    terapkan(p, v) {
      const k = koef(p, v);
      if (!k || k.aR !== 0 || k.aL === 0 || k.aL === 1 || k.bL === 0) return [];
      return [pers(v, 1, k.bL, 0, k.bR / k.aL)];
    },
  },
  {
    id: "PERS-KURANG-KOEF",
    terapkan(p, v) {
      const k = koef(p, v);
      if (!k || k.aR !== 0 || k.bL !== 0 || k.aL === 1) return [];
      return [pers(v, 1, 0, 0, k.bR - k.aL)];
    },
  },
  {
    id: "PERS-KALI-BUKAN-BAGI",
    terapkan(p, v) {
      const k = koef(p, v);
      if (!k || k.aR !== 0 || k.bL !== 0 || k.aL === 1) return [];
      return [pers(v, 1, 0, 0, k.bR * k.aL)];
    },
  },
];
