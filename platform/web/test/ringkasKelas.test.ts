import { describe, expect, it } from "vitest";
import { keCsv, polaTerbanyak, takDikenal, waktuPerSimpul } from "../src/ringkasKelas";
import type { BarisJawaban, Pengguna } from "../src/data/tipe";

let n = 0;
const j = (x: Partial<BarisJawaban>): BarisJawaban => ({
  id: `${++n}`, siswaId: "s1", kelasId: "k", mode: "latihan", simpul: "J07-01", templatId: "T-J07-01-A", seed: 1,
  teksJawaban: "1/2", status: "benar", polaId: null, detik: 10, dibuat: `2026-11-23T10:00:${String(n).padStart(2, "0")}Z`, ...x,
});

describe("ringkas kelas", () => {
  it("polaTerbanyak urut turun dengan nama", () => {
    const r = polaTerbanyak([j({ status: "pola", polaId: "PEC-JUMLAH-LURUS" }), j({ status: "pola", polaId: "PEC-JUMLAH-LURUS" }), j({ status: "pola", polaId: "PEC-LUPA-PENYEBUT" })]);
    expect(r.map((x) => [x.polaId, x.jumlah])).toEqual([["PEC-JUMLAH-LURUS", 2], ["PEC-LUPA-PENYEBUT", 1]]);
    expect(r[0].nama).toMatch(/lurus/i);
  });
  it("takDikenal hanya status itu, terbaru dulu", () => {
    const a = j({ status: "tak-dikenal", teksJawaban: "7/9" }), b = j({ status: "tak-dikenal", teksJawaban: "3" });
    expect(takDikenal([a, j({}), b]).map((x) => x.teksJawaban)).toEqual(["3", "7/9"]);
  });
  it("waktuPerSimpul mengabaikan diagnostik", () => {
    const r = waktuPerSimpul([j({ detik: 10 }), j({ detik: 20 }), j({ mode: "diagnostik", detik: 100 })]);
    expect(r).toEqual([{ simpul: "J07-01", rataDetik: 15, target: 15, n: 2 }]);
  });
  it("keCsv meng-escape koma dan kutip", () => {
    const siswa: Pengguna[] = [{ id: "s1", nama: 'Rina "R"', email: "r@x.id", peran: "siswa" }];
    const csv = keCsv([j({ teksJawaban: "1,5" })], siswa);
    expect(csv.startsWith("\uFEFF")).toBe(true);
    const [kepala, baris] = csv.replace("\uFEFF", "").trim().split("\n");
    expect(kepala).toBe("waktu,nama,email,mode,simpul,templat,jawaban,status,pola,detik");
    expect(baris).toContain('"Rina ""R"""');
    expect(baris).toContain('"1,5"');
  });
  it("keCsv menetralkan jawaban berbentuk rumus Excel", () => {
    const csv = keCsv([j({ teksJawaban: "=HYPERLINK(1)" }), j({ teksJawaban: "-3" }), j({ teksJawaban: "+x" })], []);
    expect(csv).toContain("'=HYPERLINK(1)");
    expect(csv).toContain(",'-3,");
    expect(csv).toContain(",'+x,");
  });
});
