/** Galat yang tidak akan berhasil walau dikirim ulang (ditolak database/RLS). Item dibuang dari antrean. */
export class GalatPermanen extends Error {}

type Toko = { getItem(k: string): string | null; setItem(k: string, v: string): void };

/**
 * Antrean kiriman: item disimpan lokal DULU, lalu dikirim di latar belakang. Sinyal putus / lambat
 * (batas waktu) → tetap di antrean untuk dicoba lagi. GalatPermanen → dibuang supaya antrean tidak macet.
 * Item ber-id sama menggantikan yang lama. `kunci` dibuat per pengguna (HP dipakai bergantian).
 */
export function buatAntrean<T extends { id: string }>(kirim: (x: T) => Promise<void>, toko: Toko, kunci: string, batasMs = 8000) {
  let isi: T[] = [];
  let dibuang = 0;
  let sedang: Promise<number> | null = null;
  try {
    const x = JSON.parse(toko.getItem(kunci) ?? "[]");
    if (Array.isArray(x)) isi = x;
  } catch { isi = []; }
  const simpan = () => { try { toko.setItem(kunci, JSON.stringify(isi)); } catch { /* storage penuh/terblokir */ } };
  const denganBatas = (p: Promise<void>) =>
    Promise.race([p, new Promise<void>((_, tolak) => setTimeout(() => tolak(new Error("batas waktu")), batasMs))]);

  async function kirimSemua(): Promise<number> {
    let n = 0;
    for (let item = isi[0]; item; item = isi[0]) {
      try {
        await denganBatas(kirim(item));
        n++;
      } catch (e) {
        if (!(e instanceof GalatPermanen)) break;
        dibuang++;
      }
      isi = isi.filter((x) => x !== item);
      simpan();
    }
    return n;
  }

  const api = {
    jumlah: () => isi.length,
    dibuang: () => dibuang,
    isi: () => [...isi],
    /** Simpan lokal lalu coba kirim di latar belakang; tidak menunggu jaringan. */
    async tambah(item: T) {
      isi = [...isi.filter((x) => x.id !== item.id), item];
      simpan();
      void api.kirimUlang();
    },
    kirimUlang(): Promise<number> {
      if (!sedang) sedang = kirimSemua().finally(() => { sedang = null; });
      return sedang;
    },
  };
  return api;
}
