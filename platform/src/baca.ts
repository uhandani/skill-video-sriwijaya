import { pec, type Pecahan } from "./pecahan";

const UNIKODE: Record<string, string> = {
  "½": "1/2", "⅓": "1/3", "⅔": "2/3", "¼": "1/4", "¾": "3/4",
  "⅕": "1/5", "⅖": "2/5", "⅗": "3/5", "⅘": "4/5", "⅙": "1/6", "⅚": "5/6", "⅛": "1/8",
};

/** Baca jawaban bilangan ketikan siswa. null bila tak terbaca. */
export function bacaBilangan(teks: string): { nilai: Pecahan; belumSederhana: boolean } | null {
  let t = teks.trim().replace(/[−–]/g, "-");
  for (const [u, g] of Object.entries(UNIKODE)) t = t.replace(u, ` ${g}`);
  t = t.trim().replace(/\s*\/\s*/g, "/").replace(/\s+/g, " ");
  if (!t) return null;

  let m = /^(-?)(\d+)(?:[.,](\d+))?$/.exec(t);
  if (m) {
    const des = m[3] ?? "";
    const nilai = pec(Number(m[2] + des), 10 ** des.length);
    return { nilai: m[1] ? pec(-nilai.p, nilai.q) : nilai, belumSederhana: false };
  }
  m = /^(-?)(?:(\d+) )?(\d+)\/(\d+)$/.exec(t);
  if (!m) return null;
  const [, tanda, bulat, a, b] = m;
  const p = Number(a), q = Number(b);
  if (q === 0) return null;
  const pecahan = pec(p, q);
  const belumSederhana = pecahan.p !== p || pecahan.q !== q;
  const total = Number(bulat ?? 0) * q + p;
  const nilai = pec(tanda ? -total : total, q);
  return { nilai, belumSederhana };
}
