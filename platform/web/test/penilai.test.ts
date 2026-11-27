import { describe, expect, it } from "vitest";
import { JALUR_UJI, ambilSoal, modulSimpul, nilaiJawaban, nilaiLangkah, simpulJalur, templatSimpul } from "../src/penilai";
import { buatSoal } from "../../src/templat";
import { SEMUA_TEMPLAT } from "../../konten/templat";

describe("penilai", () => {
  it("ambilSoal deterministik & dari simpul itu", () => {
    const a = ambilSoal("J07-05", 3), b = ambilSoal("J07-05", 3);
    expect(a).toEqual(b);
    expect(a.templatId.startsWith("T-J07-05")).toBe(true);
  });
  it("tiap simpul jalur uji punya templat", () => {
    for (const j of JALUR_UJI) for (const s of simpulJalur(j)) expect(templatSimpul(s.id).length, s.id).toBeGreaterThan(0);
  });
  it("pola salah membawa umpan", () => {
    const t = SEMUA_TEMPLAT.find((x) => x.id === "T-J07-02-A")!;
    const soal = { ...buatSoal(t, 1), kunci: { jenis: "bilangan" as const, nilai: { p: 5, q: 6 } },
      pola: [{ id: "PEC-JUMLAH-LURUS", jawaban: { jenis: "bilangan" as const, nilai: { p: 2, q: 5 } } }] };
    const h = nilaiJawaban(soal, "2/5");
    expect(h.status).toBe("pola");
    expect(h.umpan?.sebut.length).toBeGreaterThan(0);
    expect(nilaiJawaban(soal, "5/6").umpan).toBeUndefined();
  });
  it("nilaiLangkah memakai pola langkah", () => {
    expect(nilaiLangkah("2x+3=11", ["2x=14"])).toEqual({ benar: false, jatuhDi: 0, polaId: "PERS-PINDAH-TANDA-TETAP" });
  });
  it("modul dimuat", () => {
    expect(modulSimpul("J12-04")).toMatch(/Dua langkah/);
    expect(modulSimpul("J99-01")).toBeNull();
  });
});
