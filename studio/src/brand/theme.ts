import { continueRender, delayRender, staticFile } from "remotion";

// Font disimpan lokal di public/fonts (lisensi SIL OFL) agar render bisa offline.
// Keduanya variable font: satu file mencakup semua ketebalan.
const FONTS = [
  { family: "UD Cormorant", file: "fonts/CormorantGaramond-latin.woff2", weight: "300 700" },
  { family: "UD Mulish", file: "fonts/Mulish-latin.woff2", weight: "200 1000" },
  // Wordmark logo resmi (Δ Kawung cetak biru): UD tebal emas + CATION reguler krem.
  { family: "UD Plex", file: "fonts/IBMPlexMono-Regular.ttf", weight: "400" },
  { family: "UD Plex", file: "fonts/IBMPlexMono-Bold.ttf", weight: "700" },
];

if (typeof document !== "undefined") {
  const handle = delayRender("Memuat font lokal UDcation");
  Promise.all(
    FONTS.map((f) => {
      const face = new FontFace(f.family, `url(${staticFile(f.file)}) format("${f.file.endsWith(".ttf") ? "truetype" : "woff2"}")`, { weight: f.weight });
      document.fonts.add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}

export const serif = '"UD Cormorant", "Cormorant Garamond", Georgia, serif';
/** Font wordmark logo resmi UDCATION. */
export const mono = '"UD Plex", "IBM Plex Mono", Menlo, monospace';
export const sans = '"UD Mulish", Mulish, "Helvetica Neue", Arial, sans-serif';

/**
 * Palet aktif. Nama kunci = PERAN warna (bukan warna harfiah):
 *   navy*      = latar utama        cokelat*  = latar sekunder
 *   marun/merah= bar subtitle/aksen kuat      aksen2 = aksen ilustrasi
 *   emas/krem/perkamen = sama di semua pilar (benang merah UDcation)
 * Nilainya diganti per pilar oleh applyTheme() — lihat brand/tema.ts.
 */
export const C: Record<
  | "navy" | "navyTerang" | "navyDalam" | "cokelat" | "cokelatTerang" | "cokelatGelap"
  | "emas" | "emasTua" | "emasMuda" | "marun" | "merah" | "krem" | "perkamen" | "aksen2",
  string
> = {
  navy: "#262B4A",
  navyTerang: "#3A4378",
  navyDalam: "#141833",
  cokelat: "#8E5227",
  cokelatTerang: "#A4652F",
  cokelatGelap: "#4A2A16",
  emas: "#EDB53D",
  emasTua: "#C8923A",
  emasMuda: "#F6D27A",
  marun: "#6A1A25",
  merah: "#9C2A35",
  krem: "#F1E6D0",
  perkamen: "#CDBFA6",
  aksen2: "#9C2A35",
};

export type WarnaKey = keyof typeof C;

/** Terima nama token (mis. "emas") atau hex langsung. */
export const warna = (w?: string, fallback: string = C.krem): string => {
  if (!w) return fallback;
  return (C as Record<string, string>)[w] ?? w;
};

export const GOLD_CSS =
  "linear-gradient(180deg, #F8DA88 0%, #EDB53D 52%, #B07A26 100%)";

export const GOLD_STOPS: [number, string][] = [
  [0, "#F6D27A"],
  [0.55, "#E2A834"],
  [1, "#B07A26"],
];

/** Skala ukuran relatif terhadap sisi pendek video (1080 = 1). */
export const useScale = (width: number, height: number) =>
  Math.min(width, height) / 1080;
