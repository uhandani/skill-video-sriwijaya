import { describe, expect, it } from "vitest";
import { bacaEkspresi, nilai, setara, variabelDari } from "../src/ekspresi";

const s = (t: string) => {
  const e = bacaEkspresi(t);
  if (!e) throw new Error(`tak terbaca: ${t}`);
  return e;
};

describe("ekspresi", () => {
  it("menghitung nilai", () => {
    expect(nilai(s("2x+3"), { x: 4 })).toBe(11);
    expect(nilai(s("2(x-1)^2"), { x: 3 })).toBe(8);
    expect(nilai(s("-x^2"), { x: 3 })).toBe(-9);
    expect(nilai(s("ma"), { m: 2, a: 5 })).toBe(10);
    expect(nilai(s("0,5mv^2"), { m: 4, v: 3 })).toBe(18);
    expect(nilai(s("m/ρ"), { m: 6, ρ: 2 })).toBe(3);
  });
  it("bentuk setara diterima", () => {
    expect(setara(s("s/v"), s("s*v^-1"), ["s", "v"])).toBe(true);
    expect(setara(s("(s)/(v)"), s("s÷v"), ["s", "v"])).toBe(true);
    expect(setara(s("F/a"), s("F/(a-a+a)"), ["F", "a"])).toBe(true);
    expect(setara(s("2E/v^2"), s("(2·E)/(v·v)"), ["E", "v"])).toBe(true);
  });
  it("bentuk berbeda ditolak", () => {
    expect(setara(s("s/v"), s("v/s"), ["s", "v"])).toBe(false);
    expect(setara(s("s/v"), s("s*v"), ["s", "v"])).toBe(false);
  });
  it("akar", () => {
    expect(setara(s("√(2E/m)"), s("(2E/m)^0.5"), ["E", "m"])).toBe(true);
    expect(setara(s("√(2E/m)"), s("2E/m"), ["E", "m"])).toBe(false);
  });
  it("menolak ketikan rusak tanpa error", () => {
    for (const t of ["2x+", "", "(a", "a)", "3//4", "x$"]) expect(bacaEkspresi(t)).toBeNull();
  });
  it("tidak setara bila hampir semua titik tak sah", () => {
    expect(setara(s("1/(x-x)"), s("1/(x-x)"), ["x"])).toBe(false);
  });
  it("mendaftar variabel", () => {
    expect(variabelDari(s("2E/m + x"))).toEqual(["E", "m", "x"]);
  });
});
