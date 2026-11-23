import { describe, expect, it } from "vitest";
import { hapusSesi, muatSesi, simpanSesi } from "../src/diagnostikLokal";
import { catat, mulaiDiagnostik, simpulBerikut } from "../../src/diagnostik";
import { PETA } from "../src/penilai";

const toko = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), m }; };

describe("sesi diagnostik lokal", () => {
  it("simpan lalu muat sama (termasuk tersirat)", () => {
    const t = toko();
    const s = mulaiDiagnostik(PETA, ["J07"], "SMA");
    const id = simpulBerikut(s)!;
    catat(s, id, true); catat(s, id, true);
    simpanSesi("J07", s, t);
    const m = muatSesi("J07", t)!;
    expect(simpulBerikut(m)).toBe(simpulBerikut(s));
    expect([...m.tersirat]).toEqual([...s.tersirat]);
    expect(m.status).toEqual(s.status);
  });
  it("data rusak → null", () => {
    const t = toko();
    t.setItem("udcation-diag-J07", "{rusak");
    expect(muatSesi("J07", t)).toBeNull();
    t.setItem("udcation-diag-J07", JSON.stringify({ versi: 99 }));
    expect(muatSesi("J07", t)).toBeNull();
  });
  it("hapus satu jalur tidak menyentuh jalur lain", () => {
    const t = toko();
    simpanSesi("J07", mulaiDiagnostik(PETA, ["J07"], "SMA"), t);
    simpanSesi("J12", mulaiDiagnostik(PETA, ["J12"], "SMA"), t);
    hapusSesi("J07", t);
    expect(muatSesi("J07", t)).toBeNull();
    expect(muatSesi("J12", t)).not.toBeNull();
  });
});
