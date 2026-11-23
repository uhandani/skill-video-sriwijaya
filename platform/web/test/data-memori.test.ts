import { describe, expect, it } from "vitest";
import { buatKodeKelas, dataMemori } from "../src/data/memori";
import type { BarisJawaban } from "../src/data/tipe";

const guru = { id: "g1", nama: "Pak Uhan", email: "guru@sekolah.id" };
const siswa = { id: "s1", nama: "Rina", email: "rina@siswa.id" };

async function siapkan() {
  const d = dataMemori({ guruDiizinkan: ["guru@sekolah.id"] });
  d._masukSebagai(guru);
  const k = await d.buatKelas("XI IPA 2");
  d._masukSebagai(siswa);
  return { d, k };
}

const jwb = (id: string): BarisJawaban => ({
  id, siswaId: "s1", kelasId: "x", mode: "latihan", simpul: "J07-01", templatId: "T-J07-01-A", seed: 1,
  teksJawaban: "1/2", status: "benar", polaId: null, detik: 5, dibuat: new Date().toISOString(),
});

describe("dataMemori", () => {
  it("peran dari daftar guru", async () => {
    const { d } = await siapkan();
    expect((await d.pengguna())!.peran).toBe("siswa");
    d._masukSebagai(guru);
    expect((await d.pengguna())!.peran).toBe("guru");
  });
  it("gabung kelas: benar, tidak ada, sudah punya kelas", async () => {
    const { d, k } = await siapkan();
    expect(await d.gabungKelas("ZZZZZZZ")).toEqual({ ok: false, alasan: "tidak-ada" });
    const r = await d.gabungKelas(k.kode.toLowerCase());
    expect(r.ok).toBe(true);
    expect((await d.kelasSaya())!.id).toBe(k.id);
    expect(await d.gabungKelas(k.kode)).toEqual({ ok: false, alasan: "sudah-punya-kelas" });
  });
  it("kelas nonaktif", async () => {
    const { d, k } = await siapkan();
    d._masukSebagai(guru);
    await d.aturAktif(k.id, false);
    d._masukSebagai(siswa);
    expect(await d.gabungKelas(k.kode)).toEqual({ ok: false, alasan: "nonaktif" });
  });
  it("siswa tidak bisa membuat kelas", async () => {
    const { d } = await siapkan();
    await expect(d.buatKelas("X")).rejects.toThrow();
  });
  it("simpanJawaban idempoten per id & guru melihat jawaban kelasnya", async () => {
    const { d, k } = await siapkan();
    await d.gabungKelas(k.kode);
    await d.simpanJawaban({ ...jwb("a"), kelasId: k.id });
    await d.simpanJawaban({ ...jwb("a"), kelasId: k.id });
    expect(await d.riwayatSaya()).toHaveLength(1);
    d._masukSebagai(guru);
    expect(await d.jawabanKelas(k.id)).toHaveLength(1);
    expect((await d.siswaKelas(k.id)).map((s) => s.nama)).toEqual(["Rina"]);
  });
  it("status simpul", async () => {
    const { d, k } = await siapkan();
    await d.gabungKelas(k.kode);
    await d.simpanStatus("J07-01", "bolong", "diagnostik");
    await d.simpanStatus("J07-01", "kuasai", "latihan");
    expect(await d.statusSaya()).toEqual({ "J07-01": "kuasai" });
    d._masukSebagai(guru);
    expect(await d.statusKelas(k.id)).toEqual([{ siswaId: "s1", simpul: "J07-01", status: "kuasai" }]);
  });
});

it("buatKodeKelas: 7 karakter tanpa O0I1", () => {
  for (let i = 0; i < 1000; i++) expect(buatKodeKelas()).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{7}$/);
});
