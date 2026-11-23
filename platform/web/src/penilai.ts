/**
 * Satu-satunya pintu ke mesin cek jawaban. Saat pindah ke opsi B (Next.js, cek di server),
 * cukup isi modul ini yang diganti dengan panggilan API.
 */
import petaJson from "../../konten/peta.json";
import polaJson from "../../konten/pola-salah.json";
import { SEMUA_TEMPLAT } from "../../konten/templat";
import { POLA_LANGKAH } from "../../konten/pola-langkah";
import { cekJawaban, type HasilCek } from "../../src/cek";
import { cekLangkah, type HasilLangkah } from "../../src/langkah";
import { buatSoal, type Soal, type Templat } from "../../src/templat";
import type { Peta, Simpul } from "../../src/peta";

export const JALUR_UJI = ["J07", "J12", "J13"] as const;
export const PETA = petaJson as Peta;
const POLA = new Map((polaJson as { id: string; nama: string; sebut: string; tunjukkan: string }[]).map((p) => [p.id, p]));

const MODUL = import.meta.glob("../../konten/modul/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

export type Umpan = { sebut: string; tunjukkan: string };
export type Penilaian = HasilCek & { umpan?: Umpan };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const templatSimpul = (simpul: string): Templat<any>[] => SEMUA_TEMPLAT.filter((t) => t.simpul === simpul);

export const simpulJalur = (jalur: string): Simpul[] =>
  PETA.simpul.filter((s) => s.jalur === jalur).sort((a, b) => a.urutan - b.urutan);

export const infoSimpul = (id: string): Simpul | undefined => PETA.simpul.find((s) => s.id === id);
export const namaPola = (id: string): string => POLA.get(id)?.nama ?? id;

export function ambilSoal(simpul: string, seed: number): Soal {
  const ts = templatSimpul(simpul);
  if (!ts.length) throw new Error(`tidak ada templat untuk ${simpul}`);
  return buatSoal(ts[seed % ts.length], seed);
}

export function nilaiJawaban(soal: Soal, teks: string): Penilaian {
  const h = cekJawaban(soal, teks);
  const p = h.status === "pola" && h.polaId ? POLA.get(h.polaId) : undefined;
  return p ? { ...h, umpan: { sebut: p.sebut, tunjukkan: p.tunjukkan } } : h;
}

export const nilaiLangkah = (awal: string, langkah: string[]): HasilLangkah => cekLangkah(awal, langkah, "x", POLA_LANGKAH);

export function umpanPola(polaId: string): Umpan | undefined {
  const p = POLA.get(polaId);
  return p && { sebut: p.sebut, tunjukkan: p.tunjukkan };
}

export const modulSimpul = (simpul: string): string | null => MODUL[`../../konten/modul/${simpul}.md`] ?? null;
