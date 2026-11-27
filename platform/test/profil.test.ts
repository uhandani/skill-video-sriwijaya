import { describe, expect, it } from "vitest";
import type { HasilCek } from "../src/cek";
import { catatHasil, laporanKumpulan, perluRemedi, polaDominan, profilBaru, type Profil } from "../src/profil";

const pola = (id: string): HasilCek => ({ status: "pola", polaId: id });
const benar: HasilCek = { status: "benar" };
const isi = (xs: HasilCek[], pr: Profil = profilBaru()) => xs.reduce((p, h, i) => catatHasil(p, "J07-01", h, i), pr);

describe("profil", () => {
  it("remedi bila pola sama 2x dalam 5 terakhir", () => {
    expect(perluRemedi(isi([pola("PEC-JUMLAH-LURUS"), benar, pola("PEC-JUMLAH-LURUS")])))
      .toEqual([{ simpul: "J07-01", polaId: "PEC-JUMLAH-LURUS" }]);
  });
  it("satu kali tidak", () => expect(perluRemedi(isi([pola("PEC-JUMLAH-LURUS"), benar]))).toEqual([]));
  it("sudah lewat 5 catatan tidak", () =>
    expect(perluRemedi(isi([pola("A"), pola("A"), benar, benar, benar, benar, benar]))).toEqual([]));
  it("bobot pola lama memudar", () => {
    const pr = isi([pola("LAMA"), ...Array(10).fill(benar), pola("BARU")]);
    expect(pr.bobot.LAMA).toBeLessThan(pr.bobot.BARU);
    expect(polaDominan(pr, 1)).toEqual(["BARU"]);
  });
  it("tidak mengubah profil lama", () => {
    const a = profilBaru();
    catatHasil(a, "J07-01", pola("A"), 0);
    expect(a.riwayat).toHaveLength(0);
  });
  it("laporan kumpulan", () => {
    const p1 = isi([pola("A"), pola("B")]);
    const p2 = isi([pola("A")]);
    expect(laporanKumpulan([p1, p2])).toEqual([{ polaId: "A", jumlah: 2 }, { polaId: "B", jumlah: 1 }]);
  });
});
