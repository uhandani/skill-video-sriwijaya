import { infoSimpul, namaPola } from "./penilai";
import type { BarisJawaban, Pengguna } from "./data/tipe";

export function polaTerbanyak(js: BarisJawaban[]) {
  const n = new Map<string, number>();
  for (const j of js) if (j.status === "pola" && j.polaId) n.set(j.polaId, (n.get(j.polaId) ?? 0) + 1);
  return [...n].map(([polaId, jumlah]) => ({ polaId, jumlah, nama: namaPola(polaId) }))
    .sort((a, b) => b.jumlah - a.jumlah || a.polaId.localeCompare(b.polaId));
}

export const takDikenal = (js: BarisJawaban[]) =>
  js.filter((j) => j.status === "tak-dikenal").sort((a, b) => b.dibuat.localeCompare(a.dibuat));

export function waktuPerSimpul(js: BarisJawaban[]) {
  const g = new Map<string, number[]>();
  for (const j of js) if (j.mode !== "diagnostik") g.set(j.simpul, [...(g.get(j.simpul) ?? []), j.detik]);
  return [...g].sort(([a], [b]) => a.localeCompare(b)).map(([simpul, d]) => ({
    simpul, rataDetik: Math.round((d.reduce((s, x) => s + x, 0) / d.length) * 10) / 10, target: infoSimpul(simpul)?.targetDetik ?? 0, n: d.length,
  }));
}

const sel = (v: string | number | null) => {
  const s = v === null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function keCsv(js: BarisJawaban[], siswa: Pengguna[]): string {
  const p = new Map(siswa.map((s) => [s.id, s]));
  const baris = js.map((j) => [j.dibuat, p.get(j.siswaId)?.nama ?? "", p.get(j.siswaId)?.email ?? "", j.mode, j.simpul, j.templatId, j.teksJawaban, j.status, j.polaId, j.detik].map(sel).join(","));
  return ["waktu,nama,email,mode,simpul,templat,jawaban,status,pola,detik", ...baris].join("\n") + "\n";
}
