import { bacaBilangan } from "./baca";
import { bacaEkspresi, setara } from "./ekspresi";
import { sama } from "./pecahan";
import type { Jawaban, Soal } from "./templat";

export type HasilCek = {
  status: "benar" | "pola" | "tak-dikenal" | "tak-terbaca";
  polaId?: string;
  belumSederhana?: boolean;
};

export const POLA_BELUM_SEDERHANA = "UMUM-BELUM-SEDERHANA";

type Terbaca = { cocok(j: Jawaban): boolean; belumSederhana: boolean };

function baca(soal: Soal, teks: string): Terbaca | null {
  const tanpaRuasKiri = teks.replace(/^\s*\p{L}\s*=/u, "");
  if (soal.kunci.jenis === "bilangan") {
    const b = bacaBilangan(tanpaRuasKiri);
    if (!b) return null;
    return { belumSederhana: b.belumSederhana, cocok: (j) => j.jenis === "bilangan" && sama(j.nilai, b.nilai) };
  }
  const e = bacaEkspresi(tanpaRuasKiri);
  if (!e) return null;
  return {
    belumSederhana: false,
    cocok: (j) => {
      if (j.jenis !== "ekspresi") return false;
      const k = bacaEkspresi(j.teks);
      return !!k && setara(e, k, j.variabel);
    },
  };
}

/** Cek jawaban siswa: kunci dulu, lalu pola salah, lalu tak dikenal. */
export function cekJawaban(soal: Soal, teks: string): HasilCek {
  const j = baca(soal, teks);
  if (!j) return { status: "tak-terbaca" };
  if (j.cocok(soal.kunci)) {
    if (!j.belumSederhana) return { status: "benar" };
    return soal.wajibSederhana
      ? { status: "pola", polaId: POLA_BELUM_SEDERHANA, belumSederhana: true }
      : { status: "benar", belumSederhana: true };
  }
  const pola = soal.pola.find((x) => j.cocok(x.jawaban));
  return pola ? { status: "pola", polaId: pola.id } : { status: "tak-dikenal" };
}
