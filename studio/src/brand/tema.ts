import { C } from "./theme";
import type { Storyboard } from "../storyboard/types";

export type Motif = "kawung" | "megamendung" | "parang";
export type Pilar = Storyboard["pilar"];

type Tema = { nama: string; motif: Motif; warna: Partial<typeof C> };

/** Identitas warna tiap pilar konten UDcation. Emas & krem tetap sama. */
export const TEMA: Record<"hitung" | "semesta" | "nusantara", Tema> = {
  // Ruang Hitung (MTK) — "papan tulis malam": navy + marun, motif kawung
  hitung: {
    nama: "Ruang Hitung",
    motif: "kawung",
    warna: {
      navy: "#262B4A", navyTerang: "#3A4378", navyDalam: "#141833",
      cokelat: "#8E5227", cokelatTerang: "#A4652F", cokelatGelap: "#4A2A16",
      marun: "#6A1A25", merah: "#9C2A35", aksen2: "#9C2A35",
    },
  },
  // Ruang Semesta (fisika) — "langit & alam": hijau zamrud + jingga senja, motif mega mendung
  semesta: {
    nama: "Ruang Semesta",
    motif: "megamendung",
    warna: {
      navy: "#143F3A", navyTerang: "#22695F", navyDalam: "#0A2320",
      cokelat: "#1C2552", cokelatTerang: "#2E3B7A", cokelatGelap: "#0E1330", // latar sekunder = langit malam
      marun: "#8A3A16", merah: "#B4572A", aksen2: "#5FC9A8",
    },
  },
  // Ruang Nusantara (sejarah & budaya) — "sogan & indigo": cokelat sogan + indigo, motif parang
  nusantara: {
    nama: "Ruang Nusantara",
    motif: "parang",
    warna: {
      navy: "#5A3820", navyTerang: "#8A5A32", navyDalam: "#2B190C",
      cokelat: "#222C66", cokelatTerang: "#34418A", cokelatGelap: "#11163A", // latar sekunder = laut indigo
      marun: "#26306E", merah: "#3A479A", aksen2: "#C9653A",
    },
  },
};

export const temaDariPilar = (pilar?: Pilar): keyof typeof TEMA => {
  if (pilar === "Ruang Semesta") return "semesta";
  if (pilar === "Ruang Nusantara" || pilar === "Jejak Ilmu Nusantara") return "nusantara";
  return "hitung"; // Ruang Hitung & Fakta Unik
};

let motifAktif: Motif = "kawung";
export const motif = () => motifAktif;

/**
 * Pasang palet pilar. Dipanggil di awal render UDVideo/SceneView/Thumbnail.
 * Aman karena satu tab render hanya merender satu komposisi.
 */
export function applyTheme(pilar?: Pilar) {
  const t = TEMA[temaDariPilar(pilar)];
  Object.assign(C, TEMA.hitung.warna, t.warna);
  motifAktif = t.motif;
}
