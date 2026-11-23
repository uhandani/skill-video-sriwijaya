/** Tulis 20 soal per templat ke verify/sampel.json untuk dihitung ulang oleh verify/cek_kunci.py. */
import { writeFileSync } from "node:fs";
import { SEMUA_TEMPLAT } from "../konten/templat";
import { keTeks } from "../src/pecahan";
import { buatSoal } from "../src/templat";

const sampel = SEMUA_TEMPLAT.flatMap((t) =>
  Array.from({ length: 20 }, (_, i) => {
    const s = buatSoal(t, 1000 + i);
    return {
      templat: t.id,
      seed: s.seed,
      teks: s.teks,
      kunci: s.kunci.jenis === "bilangan" ? keTeks(s.kunci.nilai) : s.kunci.teks,
      jenis: s.kunci.jenis,
    };
  }),
);
writeFileSync(new URL("../verify/sampel.json", import.meta.url), JSON.stringify(sampel, null, 1));
console.log(`ekspor: ${sampel.length} soal`);
