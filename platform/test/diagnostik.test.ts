import { describe, expect, it } from "vitest";
import type { Peta } from "../src/peta";
import { catat, mulaiDiagnostik, ringkasan, simpulBerikut, type SesiDiagnostik } from "../src/diagnostik";

const buatPeta = (n: number): Peta => ({
  jalur: [{ id: "JX", nama: "Uji" }],
  simpul: Array.from({ length: n }, (_, i) => ({
    id: `JX-${i + 1}`, jalur: "JX", nama: `S${i + 1}`, urutan: i + 1,
    prasyarat: i ? [`JX-${i}`] : [], fase: "C", targetDetik: 30,
  })),
});

/** Jalankan sesi; siswa menjawab benar bila bisa(simpulId, nomorSoalKe). */
function jalankan(s: SesiDiagnostik, bisa: (id: string, ke: number) => boolean) {
  let soal = 0;
  const ke: Record<string, number> = {};
  for (let id = simpulBerikut(s); id; id = simpulBerikut(s)) {
    ke[id] = (ke[id] ?? 0) + 1;
    catat(s, id, bisa(id, ke[id]));
    if (++soal > 100) throw new Error("tidak berhenti");
  }
  return soal;
}

describe("diagnostik", () => {
  it("menemukan simpul bolong pertama", () => {
    const s = mulaiDiagnostik(buatPeta(8), ["JX"], "SMP");
    const n = jalankan(s, (id) => Number(id.split("-")[1]) <= 5);
    const r = ringkasan(s);
    expect(n).toBeLessThanOrEqual(12);
    expect(r.status["JX-6"]).toBe("bolong");
    expect(r.status["JX-5"]).toBe("kuasai");
    expect(r.titikMulai.JX).toBe("JX-6");
    expect(Object.keys(r.status)).toHaveLength(8);
  });
  it("semua benar", () => {
    const s = mulaiDiagnostik(buatPeta(8), ["JX"], "SD");
    jalankan(s, () => true);
    const r = ringkasan(s);
    expect(Object.values(r.status).every((x) => x === "kuasai")).toBe(true);
    expect(r.titikMulai.JX).toBeNull();
  });
  it("semua salah", () => {
    const s = mulaiDiagnostik(buatPeta(8), ["JX"], "SMA");
    jalankan(s, () => false);
    const r = ringkasan(s);
    expect(Object.values(r.status).every((x) => x === "bolong")).toBe(true);
    expect(r.titikMulai.JX).toBe("JX-1");
  });
  it("satu benar satu salah lalu benar = rapuh", () => {
    const s = mulaiDiagnostik(buatPeta(1), ["JX"], "SMA");
    const n = jalankan(s, (_, ke) => ke !== 2);
    expect(n).toBe(3);
    expect(ringkasan(s).status["JX-1"]).toBe("rapuh");
  });
  it("tersirat dicatat", () => {
    const s = mulaiDiagnostik(buatPeta(8), ["JX"], "SMP");
    jalankan(s, () => true);
    expect(ringkasan(s).tersirat).toContain("JX-1");
  });
  it("catat simpul yang bukan giliran ditolak", () => {
    const s = mulaiDiagnostik(buatPeta(8), ["JX"], "SMP");
    expect(() => catat(s, "JX-1", true)).toThrow();
  });
});
