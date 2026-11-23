import { describe, expect, it } from "vitest";
import { buatAntrean } from "../src/data/antrean";
import type { BarisJawaban } from "../src/data/tipe";

const toko = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) }; };
const j = (id: string) => ({ id } as BarisJawaban);

describe("antrean offline", () => {
  it("gagal kirim → tersimpan, lalu terkirim sekali", async () => {
    const simpan = toko();
    let online = false;
    const terkirim: string[] = [];
    const kirim = async (x: BarisJawaban) => { if (!online) throw new Error("offline"); terkirim.push(x.id); };
    const a = buatAntrean(kirim, simpan);
    await a.tambah(j("1"));
    expect(a.jumlah()).toBe(1);
    const b = buatAntrean(kirim, simpan);
    expect(b.jumlah()).toBe(1);
    online = true;
    expect(await b.kirimUlang()).toBe(1);
    expect(b.jumlah()).toBe(0);
    expect(await b.kirimUlang()).toBe(0);
    expect(terkirim).toEqual(["1"]);
  });
  it("online langsung terkirim", async () => {
    const terkirim: string[] = [];
    const a = buatAntrean(async (x) => void terkirim.push(x.id), toko());
    await a.tambah(j("2"));
    expect(terkirim).toEqual(["2"]);
    expect(a.jumlah()).toBe(0);
  });
  it("storage rusak tidak membuat crash", () => {
    const s = toko(); s.setItem("udcation-antrean", "{rusak");
    expect(buatAntrean(async () => {}, s).jumlah()).toBe(0);
  });
});
