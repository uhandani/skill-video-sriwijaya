import type { Acak } from "../../src/acak";
import { pec, type Pecahan } from "../../src/pecahan";
import type { Jawaban, Templat } from "../../src/templat";
import { B, unik } from "./bantu";

/** Tulis a·x + b dengan rapi: "3x − 5", "x + 2", "−x". */
export function lin(a: number, b: number, v = "x"): string {
  const sukuX = a === 0 ? "" : a === 1 ? v : a === -1 ? `−${v}` : `${a < 0 ? "−" : ""}${Math.abs(a)}${v}`;
  if (b === 0) return sukuX || "0";
  const sukuB = `${Math.abs(b)}`;
  if (!sukuX) return b < 0 ? `−${sukuB}` : sukuB;
  return `${sukuX} ${b < 0 ? "−" : "+"} ${sukuB}`;
}
const angka = (n: number) => (n < 0 ? `−${-n}` : `${n}`);

type Fn<P> = (p: P) => Pecahan;
function buat<P>(
  id: string, simpul: string, tingkat: Templat<P>["tingkat"], gen: (a: Acak) => P,
  teks: (p: P) => string, kunci: Fn<P>, pola: [string, Fn<P>][], syarat?: (p: P) => boolean,
): Templat<P> {
  const semua = (p: P): Jawaban[] => [B(kunci(p)), ...pola.map(([, f]) => B(f(p)))];
  return {
    id, simpul, tingkat,
    buatParam: (a) => unik(a, gen, semua, syarat),
    teks: (p) => `${teks(p)} Berapa nilai x?`,
    kunci: (p) => B(kunci(p)),
    polaSalah: pola.map(([pid, f]) => ({ id: pid, jawaban: (p: P) => B(f(p)) })),
  };
}

type XAB = { x: number; a: number; b: number };
const KUSTAN = ["Daeng", "Wayan", "Ucok", "Siti", "Mak Ijah", "Asep"];

// x + a = b
const polaTambah: [string, Fn<XAB>][] = [
  ["PERS-PINDAH-TANDA-TETAP", ({ x, a }) => pec(x + 2 * a)],
  ["PERS-KURANG-TERBALIK", ({ x }) => pec(-x)],
  ["PERS-ABAIKAN-SUKU", ({ x, a }) => pec(x + a)],
];

const T1201 = buat<XAB & { nama: string }>("T-J12-01-A", "J12-01", 1,
  (r) => ({ nama: r.pilih(KUSTAN), x: r.bulat(2, 30), a: r.bulat(1, 20), b: 0 }),
  (p) => `Timbangan ${p.nama} seimbang. Piring kiri berisi sekantong beras x kg dan batu ${p.a} kg. Piring kanan berisi beras ${p.x + p.a} kg. Jadi x + ${p.a} = ${p.x + p.a}.`,
  ({ x }) => pec(x), polaTambah);

const T1202a = buat<XAB>("T-J12-02-A", "J12-02", 1,
  (r) => ({ x: r.bulat(-10, 30), a: r.bulat(1, 20), b: 0 }),
  (p) => `Selesaikan: x + ${p.a} = ${angka(p.x + p.a)}.`, ({ x }) => pec(x), polaTambah, (p) => p.x !== 0);
const T1202b = buat<XAB>("T-J12-02-B", "J12-02", 2,
  (r) => ({ x: r.bulat(-10, 30), a: r.bulat(1, 20), b: 0 }),
  (p) => `Selesaikan: x − ${p.a} = ${angka(p.x - p.a)}.`, ({ x }) => pec(x), [
    ["PERS-PINDAH-TANDA-TETAP", ({ x, a }) => pec(x - 2 * a)],
    ["PERS-KURANG-TERBALIK", ({ x, a }) => pec(2 * a - x)],
    ["PERS-ABAIKAN-SUKU", ({ x, a }) => pec(x - a)],
  ], (p) => p.x !== 0);

// ax = b
const polaKali: [string, Fn<XAB>][] = [
  ["PERS-KURANG-KOEF", ({ x, a }) => pec(a * x - a)],
  ["PERS-KALI-BUKAN-BAGI", ({ x, a }) => pec(a * a * x)],
  ["PERS-BAGI-TERBALIK", ({ x, a }) => pec(a, a * x)],
];
const T1203a = buat<XAB>("T-J12-03-A", "J12-03", 1,
  (r) => ({ x: r.bulat(2, 12), a: r.bulat(2, 9), b: 0 }),
  (p) => `Selesaikan: ${p.a}x = ${p.a * p.x}.`, ({ x }) => pec(x), polaKali);
const T1203b = buat<XAB>("T-J12-03-B", "J12-03", 2,
  (r) => ({ x: r.bulat(-12, 12), a: r.pilih([-9, -7, -5, -3, -2, 2, 3, 4, 6, 8]), b: 0 }),
  (p) => `Selesaikan: ${p.a}x = ${angka(p.a * p.x)}.`, ({ x }) => pec(x), polaKali, (p) => p.x !== 0);

// ax + b = c
const polaDua: [string, Fn<XAB>][] = [
  ["PERS-PINDAH-TANDA-TETAP", ({ x, a, b }) => pec(a * x + 2 * b, a)],
  ["PERS-BAGI-SATU-SUKU", ({ x, a, b }) => pec(a * x + b - a * b, a)],
  ["PERS-KURANG-KOEF", ({ x, a }) => pec(a * x - a)],
  ["PERS-KALI-BUKAN-BAGI", ({ x, a }) => pec(a * a * x)],
];
const T1204a = buat<XAB>("T-J12-04-A", "J12-04", 2,
  (r) => ({ x: r.bulat(1, 12), a: r.bulat(2, 9), b: r.bulat(1, 20) }),
  (p) => `Selesaikan: ${lin(p.a, p.b)} = ${p.a * p.x + p.b}.`, ({ x }) => pec(x), polaDua);
const T1204b = buat<XAB>("T-J12-04-B", "J12-04", 3,
  (r) => ({ x: r.bulat(-10, 12), a: r.pilih([-6, -4, -3, -2, 2, 3, 5, 7]), b: r.bulat(-20, 20) }),
  (p) => `Selesaikan: ${lin(p.a, p.b)} = ${angka(p.a * p.x + p.b)}.`, ({ x }) => pec(x), polaDua, (p) => p.b !== 0 && p.x !== 0);

// ax + b = cx + d
type Kedua = { x: number; a: number; b: number; c: number; d: number };
const T1205 = buat<Kedua>("T-J12-05-A", "J12-05", 3,
  (r) => { const x = r.bulat(-8, 10), a = r.bulat(3, 9), c = r.bulat(1, a - 1), b = r.bulat(-15, 15); return { x, a, b, c, d: a * x + b - c * x }; },
  (p) => `Selesaikan: ${lin(p.a, p.b)} = ${lin(p.c, p.d)}.`, ({ x }) => pec(x), [
    ["PERS-PINDAH-TANDA-TETAP", ({ a, b, c, d }) => pec(d - b, a + c)],
    ["PERS-KURANG-TERBALIK", ({ a, b, c, d }) => pec(b - d, a - c)],
    ["PERS-KURANG-KOEF", ({ a, b, c, d }) => pec(d - b - (a - c))],
  ], (p) => p.b !== 0 && p.d !== 0);

// a(x + b) = c
const T1206 = buat<XAB>("T-J12-06-A", "J12-06", 3,
  (r) => ({ x: r.bulat(-8, 12), a: r.bulat(2, 9), b: r.bulat(-9, 9) }),
  (p) => `Selesaikan: ${p.a}(${lin(1, p.b)}) = ${angka(p.a * (p.x + p.b))}.`, ({ x }) => pec(x), [
    ["PERS-KURUNG-SEBAGIAN", ({ x, a, b }) => pec(a * (x + b) - b, a)],
    ["PERS-PINDAH-TANDA-TETAP", ({ x, b }) => pec(x + 2 * b)],
    ["PERS-KALI-BUKAN-BAGI", ({ x, a, b }) => pec(a * a * (x + b) - b)],
  ], (p) => p.b !== 0);

// x/a + b = c
const T1207 = buat<XAB>("T-J12-07-A", "J12-07", 4,
  (r) => { const a = r.bulat(2, 8); return { x: a * r.bulat(-6, 9), a, b: r.bulat(-9, 9) }; },
  (p) => `Selesaikan: x/${p.a} ${p.b < 0 ? "−" : "+"} ${Math.abs(p.b)} = ${angka(p.x / p.a + p.b)}.`, ({ x }) => pec(x), [
    ["PERS-PINDAH-TANDA-TETAP", ({ x, a, b }) => pec(x + 2 * a * b)],
    ["PERS-BAGI-BUKAN-KALI", ({ x, a }) => pec(x, a * a)],
    ["PERS-KALI-SATU-SUKU", ({ x, a, b }) => pec(x + a * b - b)],
  ], (p) => p.b !== 0 && p.x !== 0);

export const TEMPLAT_J12 = [T1201, T1202a, T1202b, T1203a, T1203b, T1204a, T1204b, T1205, T1206, T1207];
