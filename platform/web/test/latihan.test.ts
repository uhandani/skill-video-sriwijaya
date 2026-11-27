import { describe, expect, it } from "vitest";
import { seedBaru, simpulLatihanBerikut, sudahLancar, type CatatanLatihan } from "../src/latihan";

const c = (benar: boolean, detik = 10, simpul = "J07-01"): CatatanLatihan => ({ simpul, benar, detik });

describe("sudahLancar", () => {
  it("10 benar cepat", () => expect(sudahLancar(Array(10).fill(c(true)), "J07-01", 15)).toBe(true));
  it("9/10 masih lancar", () => expect(sudahLancar([c(false), ...Array(9).fill(c(true))], "J07-01", 15)).toBe(true));
  it("8/10 belum", () => expect(sudahLancar([c(false), c(false), ...Array(8).fill(c(true))], "J07-01", 15)).toBe(false));
  it("terlalu lambat", () => expect(sudahLancar(Array(10).fill(c(true, 15)), "J07-01", 15)).toBe(false));
  it("kurang dari 10", () => expect(sudahLancar(Array(9).fill(c(true)), "J07-01", 15)).toBe(false));
  it("kosong", () => expect(sudahLancar([], "J07-01", 15)).toBe(false));
  it("hanya simpul itu yang dihitung, 10 terakhir", () => {
    const r = [...Array(5).fill(c(false)), ...Array(10).fill(c(true)), ...Array(3).fill(c(false, 10, "J07-02"))];
    expect(sudahLancar(r, "J07-01", 15)).toBe(true);
  });
});

describe("simpulLatihanBerikut", () => {
  it("simpul terendah yang belum kuasai", () =>
    expect(simpulLatihanBerikut("J07", { "J07-01": "kuasai", "J07-02": "rapuh", "J07-03": "bolong" })).toBe("J07-02"));
  it("simpul tanpa status dianggap belum kuasai", () => expect(simpulLatihanBerikut("J07", { "J07-01": "kuasai" })).toBe("J07-02"));
  it("semua kuasai", () => {
    const st = Object.fromEntries(["01", "02", "03", "04", "05", "06", "07"].map((n) => [`J07-${n}`, "kuasai" as const]));
    expect(simpulLatihanBerikut("J07", st)).toBeNull();
  });
});

it("seedBaru bilangan bulat positif dan berbeda", () => {
  const a = seedBaru(), b = seedBaru();
  expect(Number.isInteger(a) && a > 0).toBe(true);
  expect(a).not.toBe(b);
});

import { gabungStatus } from "../src/latihan";
it("gabungStatus: kiriman status tertunda menimpa status server", () => {
  const tertunda = [
    { id: "status|J07-01", jenis: "status" as const, simpul: "J07-01", status: "kuasai" as const, sumber: "latihan" as const },
    { id: "x", jenis: "jawaban" as const, jawaban: {} as never },
  ];
  expect(gabungStatus({ "J07-01": "bolong", "J07-02": "rapuh" }, tertunda)).toEqual({ "J07-01": "kuasai", "J07-02": "rapuh" });
});
