import { describe, expect, it } from "vitest";
import { buatAcak } from "../src/acak";
import { pec, tambah } from "../src/pecahan";
import { buatSoal, type Templat } from "../src/templat";
import { cekJawaban } from "../src/cek";

type P = { a: number; b: number; c: number; d: number };
const jumlahPecahan: Templat<P> = {
  id: "UJI-JUMLAH", simpul: "J07-01", tingkat: 2,
  buatParam: () => ({ a: 1, b: 2, c: 1, d: 3 }),
  teks: (p) => `${p.a}/${p.b} + ${p.c}/${p.d} = ?`,
  kunci: (p) => ({ jenis: "bilangan", nilai: tambah(pec(p.a, p.b), pec(p.c, p.d)) }),
  polaSalah: [
    { id: "PEC-JUMLAH-LURUS", jawaban: (p) => ({ jenis: "bilangan", nilai: pec(p.a + p.c, p.b + p.d) }) },
  ],
  wajibSederhana: true,
};

const ubahRumus: Templat<null> = {
  id: "UJI-RUMUS", simpul: "J13-01", tingkat: 2,
  buatParam: () => null,
  teks: () => "v = s/t. Tulis t = ?",
  kunci: () => ({ jenis: "ekspresi", teks: "s/v", variabel: ["s", "v"] }),
  polaSalah: [{ id: "RUMUS-KALI-BUKAN-BAGI", jawaban: () => ({ jenis: "ekspresi", teks: "s*v", variabel: ["s", "v"] }) }],
};

describe("cekJawaban bilangan", () => {
  const soal = buatSoal(jumlahPecahan, 42);
  it("benar", () => expect(cekJawaban(soal, "5/6")).toEqual({ status: "benar" }));
  it("pola salah dikenali", () =>
    expect(cekJawaban(soal, "2/5")).toEqual({ status: "pola", polaId: "PEC-JUMLAH-LURUS" }));
  it("tak dikenal", () => expect(cekJawaban(soal, "7/9")).toEqual({ status: "tak-dikenal" }));
  it("tak terbaca", () => expect(cekJawaban(soal, "xx")).toEqual({ status: "tak-terbaca" }));
  it("belum sederhana saat wajib", () =>
    expect(cekJawaban(soal, "10/12")).toEqual({ status: "pola", polaId: "UMUM-BELUM-SEDERHANA", belumSederhana: true }));
  it("belum sederhana boleh bila tidak wajib", () => {
    const s2 = buatSoal({ ...jumlahPecahan, wajibSederhana: false }, 1);
    expect(cekJawaban(s2, "10/12")).toEqual({ status: "benar", belumSederhana: true });
  });
  it("kunci menang atas pola bila kembar", () => {
    const kembar = buatSoal({ ...jumlahPecahan, buatParam: () => ({ a: 1, b: 2, c: 1, d: 2 }), wajibSederhana: false }, 1);
    expect(cekJawaban(kembar, "1").status).toBe("benar");
  });
});

describe("cekJawaban ekspresi", () => {
  const soal = buatSoal(ubahRumus, 1);
  it("bentuk setara benar", () => expect(cekJawaban(soal, "s ÷ v").status).toBe("benar"));
  it("pola", () => expect(cekJawaban(soal, "sv")).toEqual({ status: "pola", polaId: "RUMUS-KALI-BUKAN-BAGI" }));
  it("tak terbaca", () => expect(cekJawaban(soal, "s/").status).toBe("tak-terbaca"));
  it("boleh menulis t = di depan", () => expect(cekJawaban(soal, "t = s/v").status).toBe("benar"));
});

describe("buatSoal", () => {
  it("deterministik per seed", () => {
    const t: Templat<number> = {
      id: "UJI-ACAK", simpul: "J01-01", tingkat: 1,
      buatParam: (a) => a.bulat(1, 1000), teks: (n) => `${n}`,
      kunci: (n) => ({ jenis: "bilangan", nilai: pec(n) }), polaSalah: [],
    };
    expect(buatSoal(t, 42)).toEqual(buatSoal(t, 42));
    expect(buatSoal(t, 42).teks).not.toBe(buatSoal(t, 43).teks);
  });
  it("acak bulat dalam rentang", () => {
    const a = buatAcak(3);
    for (let i = 0; i < 100; i++) { const x = a.bulat(2, 5); expect(x >= 2 && x <= 5).toBe(true); }
  });
});
