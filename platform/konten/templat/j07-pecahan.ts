import type { Acak } from "../../src/acak";
import { bagi, kali, kurang, pec, tambah, type Pecahan } from "../../src/pecahan";
import type { Jawaban, Templat } from "../../src/templat";
import { B, kpk, pecahanAcak, tulis, unik } from "./bantu";

type Dua = { x: Pecahan; y: Pecahan };
const SEDERHANA = " Tulis jawaban paling sederhana.";

/** Templat dua pecahan; `buat` memberi soal + jawaban. */
function dua(
  id: string, simpul: string, tingkat: Templat<Dua>["tingkat"], maks: number,
  op: string, kunci: (p: Dua) => Pecahan,
  pola: [string, (p: Dua) => Pecahan][],
  gen: (a: Acak) => Dua = (a) => ({ x: pecahanAcak(a, maks), y: pecahanAcak(a, maks) }),
  syarat: (p: Dua) => boolean = () => true,
): Templat<Dua> {
  const semua = (p: Dua): Jawaban[] => [B(kunci(p)), ...pola.map(([, f]) => B(f(p)))];
  return {
    id, simpul, tingkat, wajibSederhana: true,
    buatParam: (a) => unik(a, gen, semua, syarat),
    teks: (p) => `Hitung: ${tulis(p.x)} ${op} ${tulis(p.y)} = …${SEDERHANA}`,
    kunci: (p) => B(kunci(p)),
    polaSalah: pola.map(([pid, f]) => ({ id: pid, jawaban: (p: Dua) => B(f(p)) })),
  };
}

// J07-01 — penyebut sama
const penyebutSama = (maks: number) => (a: Acak): Dua => {
  const n = a.bulat(3, maks), p = a.bulat(1, n - 2), q = a.bulat(1, n - 1 - p);
  return { x: { p, q: n }, y: { p: q, q: n } };
};
const polaSama: [string, (p: Dua) => Pecahan][] = [
  ["PEC-JUMLAH-LURUS", ({ x, y }) => pec(x.p + y.p, x.q + y.q)],
  ["PEC-PENYEBUT-DIKALI", ({ x, y }) => pec(x.p + y.p, x.q * y.q)],
  ["PEC-LUPA-PENYEBUT", ({ x, y }) => pec(x.p + y.p)],
];
const T0701a = dua("T-J07-01-A", "J07-01", 1, 9, "+", ({ x, y }) => tambah(x, y), polaSama, penyebutSama(9));
const T0701b = dua("T-J07-01-B", "J07-01", 2, 15, "+", ({ x, y }) => tambah(x, y), polaSama, penyebutSama(15));

// J07-02 — penyebut beda
const polaBeda: [string, (p: Dua) => Pecahan][] = [
  ["PEC-JUMLAH-LURUS", ({ x, y }) => pec(x.p + y.p, x.q + y.q)],
  ["PEC-SAMAKAN-PENYEBUT-SAJA", ({ x, y }) => pec(x.p + y.p, kpk(x.q, y.q))],
  ["PEC-LUPA-PENYEBUT", ({ x, y }) => { const L = kpk(x.q, y.q); return pec((x.p * L) / x.q + (y.p * L) / y.q); }],
];
const beda = (p: Dua) => p.x.q !== p.y.q;
const T0702a = dua("T-J07-02-A", "J07-02", 2, 6, "+", ({ x, y }) => tambah(x, y), polaBeda, undefined, beda);
const T0702b = dua("T-J07-02-B", "J07-02", 3, 12, "+", ({ x, y }) => tambah(x, y), polaBeda, undefined, beda);
const T0702c = dua("T-J07-02-C", "J07-02", 3, 12, "−", ({ x, y }) => kurang(x, y), [
  ["PEC-JUMLAH-LURUS", ({ x, y }) => pec(x.p - y.p, x.q - y.q)],
  ["PEC-SAMAKAN-PENYEBUT-SAJA", ({ x, y }) => pec(x.p - y.p, kpk(x.q, y.q))],
  ["PEC-LUPA-PENYEBUT", ({ x, y }) => { const L = kpk(x.q, y.q); return pec((x.p * L) / x.q - (y.p * L) / y.q); }],
], undefined, (p) => beda(p) && p.x.p * p.y.q > p.y.p * p.x.q);

// J07-03 — pecahan campuran
type Campur = { w1: number; x: Pecahan; w2: number; y: Pecahan };
const nilaiCampur = (w: number, x: Pecahan) => tambah(pec(w), x);
const tulisCampur = (w: number, x: Pecahan) => `${w} ${tulis(x)}`;
const polaCampur: [string, (p: Campur) => Pecahan][] = [
  ["PEC-CAMPURAN-ABAIKAN-BULAT", ({ x, y }) => tambah(x, y)],
  ["PEC-JUMLAH-LURUS", ({ w1, x, w2, y }) => tambah(pec(w1 + w2), pec(x.p + y.p, x.q + y.q))],
  ["PEC-CAMPURAN-UBAH-SALAH", ({ w1, x, w2, y }) => tambah(pec(w1 + x.p, x.q), pec(w2 + y.p, y.q))],
];
function campuran(id: string, tingkat: Templat<Campur>["tingkat"], maks: number): Templat<Campur> {
  const kunci = (p: Campur) => tambah(nilaiCampur(p.w1, p.x), nilaiCampur(p.w2, p.y));
  return {
    id, simpul: "J07-03", tingkat, wajibSederhana: true,
    buatParam: (a) => unik(a, (r) => ({ w1: r.bulat(1, 5), x: pecahanAcak(r, maks), w2: r.bulat(1, 5), y: pecahanAcak(r, maks) }),
      (p) => [B(kunci(p)), ...polaCampur.map(([, f]) => B(f(p)))]),
    teks: (p) => `Hitung: ${tulisCampur(p.w1, p.x)} + ${tulisCampur(p.w2, p.y)} = … (boleh ditulis pecahan campuran, mis. 3 1/4).${SEDERHANA}`,
    kunci: (p) => B(kunci(p)),
    polaSalah: polaCampur.map(([pid, f]) => ({ id: pid, jawaban: (p: Campur) => B(f(p)) })),
  };
}
const T0703a = campuran("T-J07-03-A", 3, 6);
const T0703b = campuran("T-J07-03-B", 4, 10);

// J07-04 — kali
const polaKali: [string, (p: Dua) => Pecahan][] = [
  ["PEC-KALI-SILANG", ({ x, y }) => pec(x.p * y.q, x.q * y.p)],
  ["PEC-KALI-SEPERTI-JUMLAH", ({ x, y }) => tambah(x, y)],
  ["PEC-KALI-SAMAKAN-PENYEBUT", ({ x, y }) => { const L = kpk(x.q, y.q); return pec(((x.p * L) / x.q) * ((y.p * L) / y.q), L); }],
];
const T0704a = dua("T-J07-04-A", "J07-04", 2, 6, "×", ({ x, y }) => kali(x, y), polaKali);
const T0704b = dua("T-J07-04-B", "J07-04", 3, 12, "×", ({ x, y }) => kali(x, y), polaKali);

// J07-05 — bagi
const polaBagi: [string, (p: Dua) => Pecahan][] = [
  ["PEC-BAGI-TANPA-BALIK", ({ x, y }) => kali(x, y)],
  ["PEC-BALIK-YANG-SALAH", ({ x, y }) => kali(pec(x.q, x.p), y)],
  ["PEC-BALIK-KEDUANYA", ({ x, y }) => kali(pec(x.q, x.p), pec(y.q, y.p))],
];
const T0705a = dua("T-J07-05-A", "J07-05", 3, 6, "÷", ({ x, y }) => bagi(x, y), polaBagi);
const T0705b = dua("T-J07-05-B", "J07-05", 4, 12, "÷", ({ x, y }) => bagi(x, y), polaBagi);

// J07-06 — operasi campuran: x + y × z
type Tiga = { x: Pecahan; y: Pecahan; z: Pecahan };
const polaTiga: [string, (p: Tiga) => Pecahan][] = [
  ["PEC-URUTAN-KIRI-KANAN", ({ x, y, z }) => kali(tambah(x, y), z)],
  ["PEC-JUMLAH-LURUS", ({ x, y, z }) => { const k = kali(y, z); return pec(x.p + k.p, x.q + k.q); }],
  ["PEC-KALI-SILANG", ({ x, y, z }) => tambah(x, pec(y.p * z.q, y.q * z.p))],
];
function tiga(id: string, tingkat: Templat<Tiga>["tingkat"], maks: number): Templat<Tiga> {
  const kunci = ({ x, y, z }: Tiga) => tambah(x, kali(y, z));
  return {
    id, simpul: "J07-06", tingkat, wajibSederhana: true,
    buatParam: (a) => unik(a, (r) => ({ x: pecahanAcak(r, maks), y: pecahanAcak(r, maks), z: pecahanAcak(r, maks) }),
      (p) => [B(kunci(p)), ...polaTiga.map(([, f]) => B(f(p)))]),
    teks: (p) => `Hitung: ${tulis(p.x)} + ${tulis(p.y)} × ${tulis(p.z)} = …${SEDERHANA}`,
    kunci: (p) => B(kunci(p)),
    polaSalah: polaTiga.map(([pid, f]) => ({ id: pid, jawaban: (p: Tiga) => B(f(p)) })),
  };
}
const T0706a = tiga("T-J07-06-A", 4, 6);
const T0706b = tiga("T-J07-06-B", 5, 10);

// J07-07 — soal cerita
const NAMA = ["Daeng Mappa", "Bu Ketut", "Pak Made", "Mak Ijah", "Ucok", "Nyoman", "Siti", "Asep"];
type Cerita1 = Dua & { nama: string };
const T0707a: Templat<Cerita1> = {
  id: "T-J07-07-A", simpul: "J07-07", tingkat: 4, wajibSederhana: true,
  buatParam: (a) => unik(a, (r) => ({ nama: r.pilih(NAMA), x: pecahanAcak(r, 8), y: pecahanAcak(r, 8) }),
    (p) => [B(tambah(p.x, p.y)), ...polaBeda.map(([, f]) => B(f(p)))], beda),
  teks: (p) => `${p.nama} memuat ${tulis(p.x)} ton kopra ke kapal pinisi pagi hari, lalu ${tulis(p.y)} ton lagi sore hari. Berapa ton kopra yang dimuat seluruhnya?${SEDERHANA}`,
  kunci: (p) => B(tambah(p.x, p.y)),
  polaSalah: polaBeda.map(([pid, f]) => ({ id: pid, jawaban: (p: Cerita1) => B(f(p)) })),
};
type Cerita2 = { nama: string; w: number; x: Pecahan };
const polaSawah: [string, (p: Cerita2) => Pecahan][] = [
  ["PEC-SALAH-OPERASI-TAMBAH", ({ w, x }) => tambah(pec(w), x)],
  ["PEC-SALAH-OPERASI-BAGI", ({ w, x }) => bagi(pec(w), x)],
  ["PEC-KALI-BULAT-KE-PENYEBUT", ({ w, x }) => pec(x.p, x.q * w)],
];
const T0707b: Templat<Cerita2> = {
  id: "T-J07-07-B", simpul: "J07-07", tingkat: 4, wajibSederhana: true,
  buatParam: (a) => unik(a, (r) => ({ nama: r.pilih(NAMA), w: r.bulat(2, 12), x: pecahanAcak(r, 8) }),
    (p) => [B(kali(pec(p.w), p.x)), ...polaSawah.map(([, f]) => B(f(p)))]),
  teks: (p) => `Sawah ${p.nama} luasnya ${p.w} hektare. Sebanyak ${tulis(p.x)} bagian sawah itu ditanami padi. Berapa hektare yang ditanami padi?${SEDERHANA}`,
  kunci: (p) => B(kali(pec(p.w), p.x)),
  polaSalah: polaSawah.map(([pid, f]) => ({ id: pid, jawaban: (p: Cerita2) => B(f(p)) })),
};

export const TEMPLAT_J07 = [
  T0701a, T0701b, T0702a, T0702b, T0702c, T0703a, T0703b, T0704a, T0704b,
  T0705a, T0705b, T0706a, T0706b, T0707a, T0707b,
];
