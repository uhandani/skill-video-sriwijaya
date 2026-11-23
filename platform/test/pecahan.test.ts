import { describe, expect, it } from "vitest";
import { pec, tambah, kurang, kali, bagi, sama, keTeks } from "../src/pecahan";

describe("pecahan", () => {
  it("menjumlah dan menyederhanakan", () => {
    expect(tambah(pec(1, 2), pec(1, 3))).toEqual(pec(5, 6));
    expect(kurang(pec(1, 2), pec(1, 2))).toEqual(pec(0));
    expect(kali(pec(2, 3), pec(3, 4))).toEqual(pec(1, 2));
    expect(bagi(pec(1, 2), pec(1, 4))).toEqual(pec(2));
  });
  it("tanda dipindah ke pembilang", () => {
    expect(pec(2, -4)).toEqual({ p: -1, q: 2 });
  });
  it("penyebut nol ditolak", () => {
    expect(() => pec(1, 0)).toThrow();
    expect(() => bagi(pec(1), pec(0))).toThrow();
  });
  it("sama dan keTeks", () => {
    expect(sama(pec(2, 4), pec(1, 2))).toBe(true);
    expect(keTeks(pec(3, 4))).toBe("3/4");
    expect(keTeks(pec(-4, 2))).toBe("-2");
  });
});
