import { buatAcak, type Acak } from "./acak";
import type { Pecahan } from "./pecahan";

export type Jawaban =
  | { jenis: "bilangan"; nilai: Pecahan }
  | { jenis: "ekspresi"; teks: string; variabel: string[] };

export type Templat<P> = {
  id: string;
  simpul: string;
  tingkat: 1 | 2 | 3 | 4 | 5;
  /** Wajib menolak parameter yang membuat jawaban pola = kunci atau antar-pola kembar. */
  buatParam(acak: Acak): P;
  teks(p: P): string;
  kunci(p: P): Jawaban;
  polaSalah: { id: string; jawaban(p: P): Jawaban }[];
  wajibSederhana?: boolean;
};

export type Soal = {
  templatId: string;
  simpul: string;
  seed: number;
  teks: string;
  kunci: Jawaban;
  pola: { id: string; jawaban: Jawaban }[];
  wajibSederhana: boolean;
};

export function buatSoal<P>(t: Templat<P>, seed: number): Soal {
  const p = t.buatParam(buatAcak(seed));
  return {
    templatId: t.id,
    simpul: t.simpul,
    seed,
    teks: t.teks(p),
    kunci: t.kunci(p),
    pola: t.polaSalah.map((x) => ({ id: x.id, jawaban: x.jawaban(p) })),
    wajibSederhana: t.wajibSederhana ?? false,
  };
}
