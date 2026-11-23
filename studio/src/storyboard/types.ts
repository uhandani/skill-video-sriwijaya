import type { BgVariant } from "../components/Background";
import type { ElemenIlustrasi } from "../components/Ilustrasi";

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

/** Isyarat sinkron: `npm run sinkron` mengisi `at` = saat kata ini diucapkan di voice-over. */
export type Isyarat = { kata?: string; kataKe?: number; kataMaju?: number };

export type DiagramItem = Prim & Isyarat & {
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
  /** narasi voice-over; juga sumber subtitle (ejaan benar) */
  narasi: string;
  /** teks untuk TTS bila lafal beda dari ejaan (mis. "Dekart" untuk Descartes); default = narasi */
  tts?: string;
  bg?: BgVariant;
  /** transisi KELUAR dari adegan ini */
  transisi?: Transisi;
  bingkai?: boolean;
  /** lapisan ilustrasi di belakang konten adegan apa pun (kanvas 1000 × 1778) */
  ilustrasi?: IlustrasiProps;
  /** voice-over per adegan — diisi otomatis oleh `npm run sinkron` */
  vo?: SceneVO;
};

export type SceneVO = {
  /** path relatif ke public/ */
  file: string;
  /** durasi audio (detik) */
  durasi: number;
  /** waktu tiap kata relatif awal audio (detik) */
  words: { w: string; start: number; end: number }[];
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

export type EquationStep = Isyarat & { tex: string; at?: number; catatan?: string };
export type EquationProps = { judul?: string; langkah: EquationStep[]; finalEmas?: boolean; size?: number };

export type GraphCurve = Isyarat & { expr: string; color?: string; at: number; dur?: number; label?: string; labelAt?: number };
export type GraphProps = {
  judul?: string;
  x: [number, number];
  y: [number, number];
  curves: GraphCurve[];
  points?: (Isyarat & { x: number; y: number; label?: string; at: number })[];
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

export type CounterProps = { from: number; to: number; desimal?: number; /** tanpa pemisah ribuan (1637, bukan 1.637) */ tahun?: boolean; satuan?: string; label?: string; judul?: string };

export type OutroProps = { kesimpulan: string; tex?: string; ajakan?: string };

/** Adegan ilustrasi bergaya Sriwijaya (kanvas 1000 lebar; tinggi 1778 untuk 9:16). */
export type IlustrasiProps = {
  judul?: string;
  elemen: ElemenIlustrasi[];
  label?: { teks: string; x: number; y: number; at?: number; ukuran?: number; emas?: boolean }[];
  /** y garis laut/tanah (kanvas); bila diisi, bagian bawah jadi laut bermotif ombak */
  garisLaut?: number;
};

/** Thumbnail video (Reels 1080×1920 & YouTube 1280×720). */
export type ThumbnailSpec = {
  /** hook besar; baris baru pakai \n; kata dalam *bintang* jadi emas */
  hook: string;
  sub?: string;
  /** ilustrasi utama, koordinat kanvas 1000×1000 (persegi, diletakkan di area gambar) */
  elemen: ElemenIlustrasi[];
  /** rumus besar di tengah gambar (untuk konten MTK tanpa ilustrasi benda); bagian kunci \\g{} */
  tex?: string;
};

/** Kartu lambang besaran (seri "Kode Rahasia Lambang Fisika"). */
export type LambangProps = {
  kicker?: string;
  /** huruf/lambang, mis. "v", "Δ" */
  huruf: string;
  /** kata asal yang diawali huruf tsb, mis. "velocity" (untuk Δ: "Δiaphorá" → tulis "Δiaphorá") */
  kata: string;
  /** keterangan asal, mis. "Latin: vēlōcitās —" */
  asal: string;
  /** arti, mis. "“kecepatan”" */
  arti: string;
  besaran: string;
  satuan?: string;
  tex?: string;
  status?: "jelas" | "konon";
  /** momen animasi: urai (kata muncul), info, rumus — bisa diberi isyarat "kata" */
  momen?: (Isyarat & { nama: "urai" | "info" | "rumus"; at?: number })[];
};

/** Daftar sumber riset di akhir video (setelah outro). */
export type SumberProps = { judul?: string; daftar: string[]; catatan?: string };

export type Scene =
  | (SceneBase & { type: "title"; props: TitleProps })
  | (SceneBase & { type: "diagram"; props: DiagramProps })
  | (SceneBase & { type: "equation"; props: EquationProps })
  | (SceneBase & { type: "graph"; props: GraphProps })
  | (SceneBase & { type: "projectile"; props: ProjectileProps })
  | (SceneBase & { type: "counter"; props: CounterProps })
  | (SceneBase & { type: "outro"; props: OutroProps })
  | (SceneBase & { type: "sumber"; props: SumberProps })
  | (SceneBase & { type: "ilustrasi"; props: IlustrasiProps })
  | (SceneBase & { type: "lambang"; props: LambangProps });

export type Storyboard = {
  id: string;
  judul: string;
  pilar: "Ruang Hitung" | "Ruang Semesta" | "Ruang Nusantara" | "Fakta Unik" | "Jejak Ilmu Nusantara";
  kurikulum?: string;
  rasio?: "9:16" | "16:9";
  /** kata per detik untuk estimasi subtitle tanpa VO */
  kpd?: number;
  audio?: { voiceover?: string; musik?: string; musikVolume?: number };
  sumber?: string[];
  thumbnail?: ThumbnailSpec;
  scenes: Scene[];
};
