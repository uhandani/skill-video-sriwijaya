import { describe, expect, it } from "vitest";
import { pec } from "../src/pecahan";
import { bacaPersamaan, cekLangkah, koefLinear, solusiLinear, type PolaLangkah } from "../src/langkah";

const POLA: PolaLangkah[] = [
  {
    id: "PERS-PINDAH-TANDA-TETAP",
    terapkan(p, v) {
      const L = koefLinear(p.kiri, v), R = koefLinear(p.kanan, v);
      if (!L || !R || L.b === 0) return [];
      return [bacaPersamaan(`${L.a}${v}=${R.b + L.b}`)!];
    },
  },
];

describe("solusiLinear", () => {
  it("satu solusi", () => expect(solusiLinear(bacaPersamaan("2x+3=11")!, "x")).toEqual(pec(4)));
  it("pecahan", () => expect(solusiLinear(bacaPersamaan("3x=2")!, "x")).toEqual(pec(2, 3)));
  it("kedua ruas", () => expect(solusiLinear(bacaPersamaan("5x-2=2x+7")!, "x")).toEqual(pec(3)));
  it("semua & tidak ada", () => {
    expect(solusiLinear(bacaPersamaan("x+1=x+1")!, "x")).toBe("semua");
    expect(solusiLinear(bacaPersamaan("x+1=x+2")!, "x")).toBe("tidak-ada");
  });
  it("bukan linear", () => expect(solusiLinear(bacaPersamaan("x^2=4")!, "x")).toBeNull());
  it("bacaPersamaan menolak tanpa = atau dua =", () => {
    expect(bacaPersamaan("2x+3")).toBeNull();
    expect(bacaPersamaan("x=1=2")).toBeNull();
  });
});

describe("cekLangkah", () => {
  it("langkah benar", () => expect(cekLangkah("2x+3=11", ["2x=8", "x=4"], "x", POLA)).toEqual({ benar: true }));
  it("lompat langkah boleh", () => expect(cekLangkah("2x+3=11", ["x=4"], "x", POLA)).toEqual({ benar: true }));
  it("ruas terbalik boleh", () => expect(cekLangkah("2x+3=11", ["8=2x", "4=x"], "x", POLA)).toEqual({ benar: true }));
  it("pola dikenali di langkah pertama", () =>
    expect(cekLangkah("2x+3=11", ["2x=14", "x=7"], "x", POLA)).toEqual({ benar: false, jatuhDi: 0, polaId: "PERS-PINDAH-TANDA-TETAP" }));
  it("salah di langkah kedua tanpa pola", () =>
    expect(cekLangkah("2x+3=11", ["2x=8", "x=6"], "x", POLA)).toEqual({ benar: false, jatuhDi: 1 }));
  it("belum selesai", () => expect(cekLangkah("2x+3=11", ["2x=8"], "x", POLA)).toEqual({ benar: false }));
  it("langkah tak terbaca", () => expect(cekLangkah("2x+3=11", ["2x=="], "x", POLA)).toEqual({ benar: false, jatuhDi: 0 }));
});
