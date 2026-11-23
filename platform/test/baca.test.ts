import { describe, expect, it } from "vitest";
import { bacaBilangan } from "../src/baca";
import { pec } from "../src/pecahan";

describe("bacaBilangan", () => {
  it.each([
    ["0,5", pec(1, 2)],
    ["0.5", pec(1, 2)],
    [" 1 / 2 ", pec(1, 2)],
    ["½", pec(1, 2)],
    ["1 1/2", pec(3, 2)],
    ["-1/2", pec(-1, 2)],
    ["-1 1/2", pec(-3, 2)],
    ["7", pec(7)],
    ["−3", pec(-3)],
  ])("membaca %s", (teks, nilai) => {
    expect(bacaBilangan(teks)!.nilai).toEqual(nilai);
  });
  it("menandai belum sederhana", () => {
    expect(bacaBilangan("2/4")).toEqual({ nilai: pec(1, 2), belumSederhana: true });
    expect(bacaBilangan("1/2")!.belumSederhana).toBe(false);
    expect(bacaBilangan("4/2")!.belumSederhana).toBe(true);
  });
  it.each(["abc", "1/0", "", "1//2", "1/2/3", "--1"])("menolak %j", (t) => {
    expect(bacaBilangan(t)).toBeNull();
  });
});
