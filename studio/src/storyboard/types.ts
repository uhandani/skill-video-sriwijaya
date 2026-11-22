import type { BgVariant } from "../components/Background";

export type Transisi = "iris" | "fade" | "perkamen" | "none";

/** Elemen gambar untuk DiagramScene (koordinat viewBox 0..1000). */
export type Prim =
  | { type: "line"; from: [number, number]; to: [number, number] }
  | { type: "polygon"; points: [number, number][]; close?: boolean }
  | { type: "circle"; c: [number, number]; r: number }
  | { type: "arc"; c: [number, number]; r: number; from: number; to: number } // derajat, 0 = kanan, berlawanan jarum jam
  | { type: "rect"; x: number; y: number; w: number; h: number }
  | { type: "path"; d: string }
  | { type: "rightAngle"; vertex: [number, number]; dir1: [number, number]; dir2: [number, number]; size?: number }
  | { type: "grid"; x: number; y: number; w: number; h: number; step: number }
  | { type: "text"; pos: [number, number]; text: string; size?: number; anchor?: "start" | "middle" | "end" }
  | { type: "tex"; pos: [number, number]; tex: string; size?: number };

export type DiagramItem = Prim & {
  /** detik (relatif awal adegan) saat mulai digambar */
  at: number;
  /** lama menggambar (detik) */
  dur?: number;
  stroke?: string;
  fill?: string;
  fillOpacity?: number;
  width?: number;
  dashed?: boolean;
  /** detik saat elemen menghilang (opsional) */
  hideAt?: number;
  /** cincin emas penanda fokus di titik ini */
  focus?: boolean;
};

export type SceneBase = {
  id: string;
  /** durasi adegan (detik) */
  durasi: number;
  /** narasi voice-over; juga sumber subtitle */
  narasi: string;
  bg?: BgVariant;
  /** transisi KELUAR dari adegan ini */
  transisi?: Transisi;
  bingkai?: boolean;
};

export type TitleProps = {
  kicker?: string;
  judul: string;
  sub?: string;
  tandaTanya?: boolean;
  logo?: boolean;
};

export type DiagramProps = {
  judul?: string;
  items: DiagramItem[];
  /** pena emas mengikuti garis yang sedang digambar (signature pembuka) */
  pena?: boolean;
  /** area diagram (px di kanvas 1080 lebar): y atas & tinggi */
  top?: number;
  height?: number;
};

export type EquationStep = { tex: string; at?: number; catatan?: string };
export type EquationProps = { judul?: string; langkah: EquationStep[]; finalEmas?: boolean; size?: number };

export type GraphCurve = { expr: string; color?: string; at: number; dur?: number; label?: string; labelAt?: number };
export type GraphProps = {
  judul?: string;
  x: [number, number];
  y: [number, number];
  curves: GraphCurve[];
  points?: { x: number; y: number; label?: string; at: number }[];
  moving?: { curve: number; from: number; to: number; at: number; dur: number };
  xLabel?: string;
  yLabel?: string;
};

export type ProjectileProps = {
  judul?: string;
  v0: number;
  sudut: number;
  g?: number;
  /** perlambatan: 1 detik simulasi = `slow` detik video */
  slow?: number;
  tampilkanVektor?: boolean;
};

export type CounterProps = { from: number; to: number; desimal?: number; satuan?: string; label?: string; judul?: string };

export type OutroProps = { kesimpulan: string; tex?: string; ajakan?: string };

export type Scene =
  | (SceneBase & { type: "title"; props: TitleProps })
  | (SceneBase & { type: "diagram"; props: DiagramProps })
  | (SceneBase & { type: "equation"; props: EquationProps })
  | (SceneBase & { type: "graph"; props: GraphProps })
  | (SceneBase & { type: "projectile"; props: ProjectileProps })
  | (SceneBase & { type: "counter"; props: CounterProps })
  | (SceneBase & { type: "outro"; props: OutroProps });

export type Storyboard = {
  id: string;
  judul: string;
  pilar: "Ruang Hitung" | "Ruang Semesta" | "Fakta Unik" | "Jejak Ilmu Nusantara";
  kurikulum?: string;
  rasio?: "9:16" | "16:9";
  /** kata per detik untuk estimasi subtitle tanpa VO */
  kpd?: number;
  audio?: { voiceover?: string; musik?: string; musikVolume?: number };
  sumber?: string[];
  scenes: Scene[];
};
