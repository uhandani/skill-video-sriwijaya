import { simpulJalur, type Peta, type Status } from "./peta";

type Jalur = { id: string; ids: string[]; lo: number; hi: number; mid: number; jawab: boolean[] };

export type SesiDiagnostik = {
  antre: Jalur[];
  status: Record<string, Status>;
  tersirat: Set<string>;
  semuaJalur: { id: string; ids: string[] }[];
};

const MULAI = { SD: 1 / 4, SMP: 1 / 2, SMA: 3 / 4 } as const;

export function mulaiDiagnostik(peta: Peta, jalurIds: string[], jenjang: keyof typeof MULAI): SesiDiagnostik {
  const antre = jalurIds
    .map((id) => ({ id, ids: simpulJalur(peta, id).map((s) => s.id) }))
    .filter((j) => j.ids.length > 0)
    .map((j) => ({ ...j, lo: 0, hi: j.ids.length - 1, mid: Math.min(j.ids.length - 1, Math.floor(j.ids.length * MULAI[jenjang])), jawab: [] }));
  return { antre, status: {}, tersirat: new Set(), semuaJalur: antre.map(({ id, ids }) => ({ id, ids })) };
}

/** Simpul yang harus diuji berikutnya; null = selesai. */
export function simpulBerikut(s: SesiDiagnostik): string | null {
  const j = s.antre[0];
  return j ? j.ids[j.mid] : null;
}

function tetapkan(s: SesiDiagnostik, j: Jalur, st: Status) {
  s.status[j.ids[j.mid]] = st;
  s.tersirat.delete(j.ids[j.mid]);
  const naik = st === "kuasai";
  for (let i = naik ? j.lo : j.mid + 1; i <= (naik ? j.mid - 1 : j.hi); i++) {
    s.status[j.ids[i]] = naik ? "kuasai" : "bolong";
    s.tersirat.add(j.ids[i]);
  }
  if (naik) j.lo = j.mid + 1;
  else j.hi = j.mid - 1;
  j.jawab = [];
  if (j.lo > j.hi) s.antre.shift();
  else j.mid = Math.floor((j.lo + j.hi) / 2);
}

/** 2/2 benar → kuasai; 0/2 → bolong; 1/2 → soal ke-3: benar → rapuh, salah → bolong. */
export function catat(s: SesiDiagnostik, simpulId: string, benar: boolean): void {
  const j = s.antre[0];
  if (!j || j.ids[j.mid] !== simpulId) throw new Error(`bukan giliran simpul ${simpulId}`);
  j.jawab.push(benar);
  const b = j.jawab.filter(Boolean).length;
  if (j.jawab.length === 2 && b === 2) tetapkan(s, j, "kuasai");
  else if (j.jawab.length === 2 && b === 0) tetapkan(s, j, "bolong");
  else if (j.jawab.length === 3) tetapkan(s, j, benar ? "rapuh" : "bolong");
}

export function ringkasan(s: SesiDiagnostik) {
  const titikMulai: Record<string, string | null> = {};
  for (const j of s.semuaJalur) titikMulai[j.id] = j.ids.find((id) => s.status[id] !== "kuasai") ?? null;
  return { status: { ...s.status }, tersirat: [...s.tersirat], titikMulai };
}
