import { describe, expect, it } from "vitest";
import petaJson from "../konten/peta.json";
import polaJson from "../konten/pola-salah.json";
import { SEMUA_TEMPLAT } from "../konten/templat";
import { buatSoal, samaJawaban } from "../src/templat";
import { existsSync, readFileSync } from "node:fs";
import { POLA_LANGKAH } from "../konten/pola-langkah";
import { cekLangkah } from "../src/langkah";
import { POLA_BELUM_SEDERHANA } from "../src/cek";
import type { Peta } from "../src/peta";

const peta = petaJson as Peta;
const pola = polaJson as { id: string; simpul: string; nama: string; sebut: string; tunjukkan: string; sumber?: string }[];
const idSimpul = new Set(peta.simpul.map((s) => s.id));
const idPola = new Set(pola.map((p) => p.id));

describe("peta kurikulum", () => {
  it("memuat J01–J15", () => {
    expect(peta.jalur.map((j) => j.id)).toEqual(Array.from({ length: 15 }, (_, i) => `J${String(i + 1).padStart(2, "0")}`));
  });
  it("id simpul unik & tiap jalur 3–10 simpul", () => {
    expect(idSimpul.size).toBe(peta.simpul.length);
    for (const j of peta.jalur) {
      const n = peta.simpul.filter((s) => s.jalur === j.id).length;
      expect(n, j.id).toBeGreaterThanOrEqual(3);
      expect(n, j.id).toBeLessThanOrEqual(10);
    }
  });
  it("prasyarat ada & tanpa siklus", () => {
    const pra = new Map(peta.simpul.map((s) => [s.id, s.prasyarat]));
    for (const s of peta.simpul) for (const p of s.prasyarat) expect(idSimpul.has(p), `${s.id} → ${p}`).toBe(true);
    const status = new Map<string, 1 | 2>();
    const kunjungi = (id: string): void => {
      if (status.get(id) === 2) return;
      if (status.get(id) === 1) throw new Error(`siklus di ${id}`);
      status.set(id, 1);
      pra.get(id)!.forEach(kunjungi);
      status.set(id, 2);
    };
    peta.simpul.forEach((s) => kunjungi(s.id));
  });
  it("fase & target waktu wajar", () => {
    for (const s of peta.simpul) {
      expect(["A", "B", "C", "D", "E"], s.id).toContain(s.fase);
      expect(s.targetDetik, s.id).toBeGreaterThan(0);
    }
  });
});

describe("pola salah", () => {
  it("id unik, simpul ada, teks feedback terisi", () => {
    expect(idPola.size).toBe(pola.length);
    expect(idPola.has(POLA_BELUM_SEDERHANA)).toBe(true);
    for (const p of pola) {
      if (p.simpul !== "UMUM") expect(idSimpul.has(p.simpul), p.id).toBe(true);
      expect(p.sebut.trim().length, p.id).toBeGreaterThan(0);
      expect(p.tunjukkan.trim().length, p.id).toBeGreaterThan(0);
    }
  });
});

describe("templat", () => {
  it("id templat unik", () => {
    expect(new Set(SEMUA_TEMPLAT.map((t) => t.id)).size).toBe(SEMUA_TEMPLAT.length);
  });
  for (const t of SEMUA_TEMPLAT) {
    it(`${t.id}: struktur`, () => {
      expect(idSimpul.has(t.simpul)).toBe(true);
      expect(t.polaSalah.length).toBeGreaterThanOrEqual(3);
      for (const p of t.polaSalah) expect(idPola.has(p.id), p.id).toBe(true);
    });
    it(`${t.id}: 200 seed tanpa kembar & teks bersih`, () => {
      for (let seed = 1; seed <= 200; seed++) {
        const s = buatSoal(t, seed);
        expect(s.teks, `seed ${seed}`).not.toMatch(/undefined|NaN|Infinity/);
        s.pola.forEach((p, i) => {
          expect(samaJawaban(p.jawaban, s.kunci), `seed ${seed} ${p.id} = kunci`).toBe(false);
          s.pola.slice(i + 1).forEach((q) => expect(samaJawaban(p.jawaban, q.jawaban), `seed ${seed} ${p.id} = ${q.id}`).toBe(false));
        });
      }
    });
  }
});

const JALUR_PENUH = ["J07", "J12"];

describe("modul jalur penuh", () => {
  for (const s of peta.simpul.filter((x) => JALUR_PENUH.includes(x.jalur))) {
    it(`${s.id}: punya modul & templat`, () => {
      const f = new URL(`../konten/modul/${s.id}.md`, import.meta.url);
      expect(existsSync(f), `modul ${s.id}`).toBe(true);
      const isi = readFileSync(f, "utf8");
      for (const id of isi.match(/`(T-[A-Z0-9-]+)`/g) ?? [])
        expect(SEMUA_TEMPLAT.some((t) => t.id === id.slice(1, -1)), id).toBe(true);
      expect(SEMUA_TEMPLAT.some((t) => t.simpul === s.id), `templat untuk ${s.id}`).toBe(true);
    });
  }
});

describe("pola langkah J12", () => {
  const contoh: [string, string, string[]][] = [
    ["PERS-PINDAH-TANDA-TETAP", "2x+3=11", ["2x=14"]],
    ["PERS-PINDAH-TANDA-TETAP", "5x-2=2x+7", ["7x-2=7"]],
    ["PERS-BAGI-SATU-SUKU", "2x+6=10", ["x+6=5"]],
    ["PERS-KURANG-KOEF", "3x=12", ["x=9"]],
    ["PERS-KALI-BUKAN-BAGI", "3x=12", ["x=36"]],
  ];
  it.each(contoh)("%s terdeteksi pada %s", (id, awal, langkah) => {
    expect(cekLangkah(awal, langkah, "x", POLA_LANGKAH)).toEqual({ benar: false, jatuhDi: 0, polaId: id });
  });
  it("tiap pola langkah terdaftar di pola-salah.json", () => {
    for (const p of POLA_LANGKAH) expect(idPola.has(p.id), p.id).toBe(true);
  });
});
