import type { BarisJawaban } from "./tipe";

const KUNCI = "udcation-antrean";
type Toko = { getItem(k: string): string | null; setItem(k: string, v: string): void };

/** Antrean jawaban: bila kirim gagal (sinyal putus), simpan lokal & kirim ulang nanti. Id jawaban dibuat di klien → upsert, tidak dobel. */
export function buatAntrean(kirim: (j: BarisJawaban) => Promise<void>, toko: Toko) {
  let isi: BarisJawaban[] = [];
  try {
    const x = JSON.parse(toko.getItem(KUNCI) ?? "[]");
    if (Array.isArray(x)) isi = x;
  } catch { isi = []; }
  const simpan = () => { try { toko.setItem(KUNCI, JSON.stringify(isi)); } catch { /* storage penuh/terblokir */ } };

  return {
    jumlah: () => isi.length,
    async tambah(j: BarisJawaban) {
      try { await kirim(j); } catch { isi.push(j); simpan(); }
    },
    async kirimUlang(): Promise<number> {
      let n = 0;
      for (const j of [...isi]) {
        try {
          await kirim(j);
          isi = isi.filter((x) => x.id !== j.id);
          simpan();
          n++;
        } catch { break; }
      }
      return n;
    },
  };
}
