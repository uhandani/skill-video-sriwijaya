import type { Templat } from "../../src/templat";
import { E, unik } from "./bantu";

/** Satu soal ubah rumus: rumus awal, arti lambang, target, kunci & jawaban tiap pola. */
type Rumus = { rumus: string; arti: string; target: string; variabel: string[]; kunci: string; pola: Record<string, string> };

function templat(id: string, simpul: string, tingkat: Templat<Rumus>["tingkat"], polaIds: string[], daftar: Rumus[]): Templat<Rumus> {
  for (const r of daftar) for (const p of polaIds) if (!(p in r.pola)) throw new Error(`${id}: ${r.rumus} tanpa ${p}`);
  return {
    id, simpul, tingkat,
    buatParam: (a) => unik(a, (x) => x.pilih(daftar), (r) => [E(r.kunci, r.variabel), ...polaIds.map((p) => E(r.pola[p], r.variabel))]),
    teks: (r) => `Rumus: ${r.rumus} (${r.arti}). Ubah rumus itu menjadi ${r.target} = … (tulis dengan huruf; pakai / untuk bagi, ^ atau ² untuk pangkat, √ untuk akar).`,
    kunci: (r) => E(r.kunci, r.variabel),
    polaSalah: polaIds.map((p) => ({ id: p, jawaban: (r: Rumus) => E(r.pola[p], r.variabel) })),
  };
}

const ARTI = {
  v: "v = kecepatan, s = jarak, t = waktu",
  rho: "ρ = massa jenis, m = massa, V = volume",
  P: "P = daya, W = usaha, t = waktu",
  F: "F = gaya, m = massa, a = percepatan",
  W: "W = usaha, F = gaya, s = perpindahan",
  V: "V = tegangan, I = kuat arus, R = hambatan",
  gel: "v = cepat rambat, λ = panjang gelombang, f = frekuensi",
  glbb: "v = kecepatan akhir, u = kecepatan awal (v₀), a = percepatan, t = waktu",
  Ek: "E = energi kinetik, m = massa, v = kecepatan",
  s: "s = jarak, a = percepatan, t = waktu (mulai dari diam)",
};

// J13-01 — bentuk bagi, target pembilang & penyebut
const T1301a = templat("T-J13-01-A", "J13-01", 2, ["RUMUS-BALIK-PECAHAN", "RUMUS-BAGI-BUKAN-KALI", "RUMUS-TAMBAH-BUKAN-KALI"], [
  { rumus: "v = s/t", arti: ARTI.v, target: "s", variabel: ["v", "t"], kunci: "v*t", pola: { "RUMUS-BALIK-PECAHAN": "t/v", "RUMUS-BAGI-BUKAN-KALI": "v/t", "RUMUS-TAMBAH-BUKAN-KALI": "v+t" } },
  { rumus: "ρ = m/V", arti: ARTI.rho, target: "m", variabel: ["ρ", "V"], kunci: "ρ*V", pola: { "RUMUS-BALIK-PECAHAN": "V/ρ", "RUMUS-BAGI-BUKAN-KALI": "ρ/V", "RUMUS-TAMBAH-BUKAN-KALI": "ρ+V" } },
  { rumus: "P = W/t", arti: ARTI.P, target: "W", variabel: ["P", "t"], kunci: "P*t", pola: { "RUMUS-BALIK-PECAHAN": "t/P", "RUMUS-BAGI-BUKAN-KALI": "P/t", "RUMUS-TAMBAH-BUKAN-KALI": "P+t" } },
]);
const T1301b = templat("T-J13-01-B", "J13-01", 3, ["RUMUS-BALIK-PECAHAN", "RUMUS-KALI-BUKAN-BAGI", "RUMUS-KURANG-BUKAN-BAGI"], [
  { rumus: "v = s/t", arti: ARTI.v, target: "t", variabel: ["s", "v"], kunci: "s/v", pola: { "RUMUS-BALIK-PECAHAN": "v/s", "RUMUS-KALI-BUKAN-BAGI": "s*v", "RUMUS-KURANG-BUKAN-BAGI": "s-v" } },
  { rumus: "ρ = m/V", arti: ARTI.rho, target: "V", variabel: ["m", "ρ"], kunci: "m/ρ", pola: { "RUMUS-BALIK-PECAHAN": "ρ/m", "RUMUS-KALI-BUKAN-BAGI": "m*ρ", "RUMUS-KURANG-BUKAN-BAGI": "m-ρ" } },
  { rumus: "P = W/t", arti: ARTI.P, target: "t", variabel: ["W", "P"], kunci: "W/P", pola: { "RUMUS-BALIK-PECAHAN": "P/W", "RUMUS-KALI-BUKAN-BAGI": "W*P", "RUMUS-KURANG-BUKAN-BAGI": "W-P" } },
]);

// J13-02 — bentuk kali
const kaliRumus = (rumus: string, arti: string, kiri: string, x: string, y: string): Rumus => ({
  rumus, arti, target: x, variabel: [kiri, y], kunci: `${kiri}/${y}`,
  pola: { "RUMUS-BALIK-PECAHAN": `${y}/${kiri}`, "RUMUS-KALI-BUKAN-BAGI": `${kiri}*${y}`, "RUMUS-KURANG-BUKAN-BAGI": `${kiri}-${y}` },
});
const T1302 = templat("T-J13-02-A", "J13-02", 2, ["RUMUS-BALIK-PECAHAN", "RUMUS-KALI-BUKAN-BAGI", "RUMUS-KURANG-BUKAN-BAGI"], [
  kaliRumus("F = m·a", ARTI.F, "F", "m", "a"),
  kaliRumus("F = m·a", ARTI.F, "F", "a", "m"),
  kaliRumus("W = F·s", ARTI.W, "W", "s", "F"),
  kaliRumus("V = I·R", ARTI.V, "V", "R", "I"),
  kaliRumus("V = I·R", ARTI.V, "V", "I", "R"),
  kaliRumus("v = λ·f", ARTI.gel, "v", "λ", "f"),
]);

// J13-03 — dua langkah v = u + a·t
const T1303 = templat("T-J13-03-A", "J13-03", 3, ["RUMUS-PINDAH-TANDA", "RUMUS-BAGI-SATU-SUKU", "RUMUS-KALI-BUKAN-BAGI"], [
  { rumus: "v = u + a·t", arti: ARTI.glbb, target: "a", variabel: ["v", "u", "t"], kunci: "(v-u)/t", pola: { "RUMUS-PINDAH-TANDA": "(v+u)/t", "RUMUS-BAGI-SATU-SUKU": "v/t-u", "RUMUS-KALI-BUKAN-BAGI": "(v-u)*t" } },
  { rumus: "v = u + a·t", arti: ARTI.glbb, target: "t", variabel: ["v", "u", "a"], kunci: "(v-u)/a", pola: { "RUMUS-PINDAH-TANDA": "(v+u)/a", "RUMUS-BAGI-SATU-SUKU": "v/a-u", "RUMUS-KALI-BUKAN-BAGI": "(v-u)*a" } },
]);

// J13-04 — konstanta ½
const T1304 = templat("T-J13-04-A", "J13-04", 4, ["RUMUS-LUPA-KONSTANTA", "RUMUS-KONSTANTA-TERBALIK", "RUMUS-KUADRAT-LUPA"], [
  { rumus: "E = ½·m·v²", arti: ARTI.Ek, target: "m", variabel: ["E", "v"], kunci: "2E/v^2", pola: { "RUMUS-LUPA-KONSTANTA": "E/v^2", "RUMUS-KONSTANTA-TERBALIK": "E/(2v^2)", "RUMUS-KUADRAT-LUPA": "2E/v" } },
  { rumus: "s = ½·a·t²", arti: ARTI.s, target: "a", variabel: ["s", "t"], kunci: "2s/t^2", pola: { "RUMUS-LUPA-KONSTANTA": "s/t^2", "RUMUS-KONSTANTA-TERBALIK": "s/(2t^2)", "RUMUS-KUADRAT-LUPA": "2s/t" } },
]);

// J13-05 — kuadrat & akar
const T1305 = templat("T-J13-05-A", "J13-05", 5, ["RUMUS-AKAR-LUPA", "RUMUS-LUPA-KONSTANTA", "RUMUS-AKAR-SEBAGIAN"], [
  { rumus: "E = ½·m·v²", arti: ARTI.Ek, target: "v", variabel: ["E", "m"], kunci: "√(2E/m)", pola: { "RUMUS-AKAR-LUPA": "2E/m", "RUMUS-LUPA-KONSTANTA": "√(E/m)", "RUMUS-AKAR-SEBAGIAN": "√(2E)/m" } },
  { rumus: "s = ½·a·t²", arti: ARTI.s, target: "t", variabel: ["s", "a"], kunci: "√(2s/a)", pola: { "RUMUS-AKAR-LUPA": "2s/a", "RUMUS-LUPA-KONSTANTA": "√(s/a)", "RUMUS-AKAR-SEBAGIAN": "√(2s)/a" } },
]);

export const TEMPLAT_J13 = [T1301a, T1301b, T1302, T1303, T1304, T1305];
