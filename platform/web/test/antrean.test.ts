import { describe, expect, it } from "vitest";
import { GalatPermanen, buatAntrean } from "../src/data/antrean";

type X = { id: string };
const toko = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), m }; };
const x = (id: string): X => ({ id });
const tunggu = () => new Promise((r) => setTimeout(r, 0));

describe("antrean offline", () => {
  it("gagal kirim → tersimpan, lalu terkirim sekali", async () => {
    const simpan = toko();
    let online = false;
    const terkirim: string[] = [];
    const kirim = async (v: X) => { if (!online) throw new Error("offline"); terkirim.push(v.id); };
    const a = buatAntrean<X>(kirim, simpan, "k");
    await a.tambah(x("1"));
    await a.kirimUlang();
    expect(a.jumlah()).toBe(1);
    const b = buatAntrean<X>(kirim, simpan, "k");
    expect(b.jumlah()).toBe(1);
    online = true;
    expect(await b.kirimUlang()).toBe(1);
    expect(b.jumlah()).toBe(0);
    expect(await b.kirimUlang()).toBe(0);
    expect(terkirim).toEqual(["1"]);
  });
  it("tambah tidak menunggu jaringan", async () => {
    let lepas!: () => void;
    const a = buatAntrean<X>(() => new Promise<void>((r) => { lepas = r; }), toko(), "k");
    await a.tambah(x("2"));          // selesai walau kirim belum selesai
    expect(a.jumlah()).toBe(1);
    lepas(); await tunggu(); await tunggu();
    expect(a.jumlah()).toBe(0);
  });
  it("galat permanen dibuang & tidak menahan antrean", async () => {
    const terkirim: string[] = [];
    const a = buatAntrean<X>(async (v) => { if (v.id === "rusak") throw new GalatPermanen("ditolak"); terkirim.push(v.id); }, toko(), "k");
    await a.tambah(x("rusak")); await a.tambah(x("baik"));
    await a.kirimUlang();
    expect(terkirim).toEqual(["baik"]);
    expect(a.jumlah()).toBe(0);
    expect(a.dibuang()).toBe(1);
  });
  it("kirim yang menggantung dianggap gagal sementara (batas waktu)", async () => {
    const a = buatAntrean<X>(() => new Promise<void>(() => {}), toko(), "k", 20);
    await a.tambah(x("3"));
    expect(await a.kirimUlang()).toBe(0);
    expect(a.jumlah()).toBe(1);
  });
  it("id sama menggantikan yang lama (tidak dobel)", async () => {
    const a = buatAntrean<X & { v: number }>(async () => { throw new Error("offline"); }, toko(), "k");
    await a.tambah({ id: "s", v: 1 }); await a.tambah({ id: "s", v: 2 });
    await a.kirimUlang();
    expect(a.isi()).toEqual([{ id: "s", v: 2 }]);
  });
  it("kunci berbeda (per pengguna) terpisah", async () => {
    const t = toko();
    const a = buatAntrean<X>(async () => { throw new Error("offline"); }, t, "u1");
    await a.tambah(x("1")); await a.kirimUlang();
    expect(buatAntrean<X>(async () => {}, t, "u2").jumlah()).toBe(0);
  });
  it("storage rusak tidak membuat crash", () => {
    const s = toko(); s.setItem("k", "{rusak");
    expect(buatAntrean<X>(async () => {}, s, "k").jumlah()).toBe(0);
  });
});
