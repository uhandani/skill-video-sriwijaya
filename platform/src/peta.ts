export type Simpul = {
  id: string;
  jalur: string;
  nama: string;
  urutan: number;
  prasyarat: string[];
  fase: string;
  targetDetik: number;
};
export type Peta = { jalur: { id: string; nama: string }[]; simpul: Simpul[] };
export type Status = "kuasai" | "rapuh" | "bolong";

export const simpulJalur = (peta: Peta, jalurId: string) =>
  peta.simpul.filter((s) => s.jalur === jalurId).sort((a, b) => a.urutan - b.urutan);
