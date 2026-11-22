import React from "react";
import { C } from "../brand/theme";

/**
 * Pustaka ilustrasi bergaya video referensi Sriwijaya:
 * line-art krem tebal + isian warna tekstil (palet pilar) + aksen emas + isen-isen (titik/garis).
 * Setiap gambar digambar di kotak lokal ±100 satuan, titik (0,0) = tengah-bawah
 * (kecuali benda langit: (0,0) = pusat). `t` = frame untuk gerak idle.
 */
export type JenisIlustrasi =
  | "matahari" | "bulan" | "bumi" | "bintang" | "awan" | "ombak" | "gunung"
  | "kapal" | "candi" | "rumahPanggung" | "gong" | "orang" | "kelapa" | "planet";

const L = 4.5; // tebal garis

/** Warna tekstil tetap (seperti video Sriwijaya) — tidak ikut tema; aksen2 & emas yang ikut pilar. */
const IL = {
  kayu: "#8E5227",
  kayuTerang: "#A4652F",
  indigo: "#2E3A6E",
  indigoTerang: "#3A4A8A",
  indigoGelap: "#1C2038",
  marun: "#6A1A25",
  bata: "#9C2A35",
};

const Isen: React.FC<{ x: number; y: number; w: number; h: number; step?: number }> = ({ x, y, w, h, step = 14 }) => (
  <g fill={C.krem} opacity={0.55}>
    {Array.from({ length: Math.floor(w / step) * Math.floor(h / step) }).map((_, i) => {
      const cols = Math.floor(w / step);
      const cx = x + (i % cols) * step + step / 2 + (Math.floor(i / cols) % 2 ? step / 2 : 0);
      const cy = y + Math.floor(i / cols) * step + step / 2;
      return cx < x + w ? <circle key={i} cx={cx} cy={cy} r={1.6} /> : null;
    })}
  </g>
);

const Matahari: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <g transform={`rotate(${t * 0.3})`} stroke={C.emas} strokeWidth={3.2} strokeLinecap="round">
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i * Math.PI) / 8;
        const r1 = 62;
        const r2 = i % 2 ? 84 : 96;
        return <line key={i} x1={r1 * Math.cos(a)} y1={r1 * Math.sin(a)} x2={r2 * Math.cos(a)} y2={r2 * Math.sin(a)} />;
      })}
    </g>
    <circle r={52} fill="url(#ilGold)" filter="url(#ilGlow)" />
    <circle r={40} fill="none" stroke="#FFF3C8" strokeWidth={2} opacity={0.5} />
  </g>
);

const Bulan: React.FC = () => (
  <g>
    <circle r={60} fill={C.krem} filter="url(#ilGlow)" />
    <g fill="#CFC2A6">
      <circle cx={-18} cy={-14} r={11} />
      <circle cx={20} cy={10} r={8} />
      <circle cx={-6} cy={26} r={6} />
      <circle cx={26} cy={-24} r={5} />
    </g>
    <circle r={60} fill="none" stroke={C.emasTua} strokeWidth={2} opacity={0.6} />
  </g>
);

const Bumi: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <defs>
      <clipPath id="ilBumiClip">
        <circle r={70} />
      </clipPath>
    </defs>
    <circle r={70} fill={IL.indigo} />
    <g clipPath="url(#ilBumiClip)" fill={C.aksen2} stroke={C.krem} strokeWidth={2.5}>
      <g transform={`translate(${((t * 0.4) % 140) - 70} 0)`}>
        {[-140, 0, 140].map((o) => (
          <g key={o} transform={`translate(${o} 0)`}>
            <path d="M-50 -30 q20 -20 40 -6 q14 10 4 26 q-10 14 -30 8 q-22 -6 -14 -28 Z" />
            <path d="M10 12 q18 -8 30 6 q8 14 -6 26 q-16 8 -24 -6 Z" />
          </g>
        ))}
      </g>
    </g>
    <circle r={70} fill="none" stroke={C.krem} strokeWidth={L} />
    <path d="M-60 -20 A70 70 0 0 1 20 -66" stroke="#fff" strokeWidth={3} fill="none" opacity={0.35} />
  </g>
);

const Planet: React.FC = () => (
  <g>
    <circle r={48} fill={C.aksen2} stroke={C.krem} strokeWidth={L} />
    <path d="M-40 -18 H40 M-46 2 H46 M-38 22 H38" stroke={C.krem} strokeWidth={2} opacity={0.5} />
    <ellipse rx={88} ry={20} fill="none" stroke={C.emas} strokeWidth={5} transform="rotate(-18)" />
  </g>
);

const Bintang: React.FC<{ t: number }> = ({ t }) => {
  const pts = [[-80, -30], [-30, -70], [20, -20], [70, -60], [50, 30], [-50, 40], [0, 70]];
  return (
    <g>
      {pts.map(([x, y], i) => {
        const s = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin((t + i * 17) / 9));
        return (
          <path
            key={i}
            d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z"
            transform={`translate(${x} ${y}) scale(${s})`}
            fill={i % 3 ? C.krem : C.emas}
          />
        );
      })}
    </g>
  );
};

const Awan: React.FC = () => (
  <g fill={IL.indigoTerang} stroke={C.krem} strokeWidth={L} strokeLinejoin="round">
    <path d="M-100 0 a30 30 0 0 1 40 -38 a42 42 0 0 1 76 -6 a30 30 0 0 1 44 20 a22 22 0 0 1 40 24 Z" />
    <path d="M-60 -8 a14 14 0 1 1 20 -6 M10 -26 a16 16 0 1 1 22 -2" fill="none" strokeWidth={2.5} />
  </g>
);

const Ombak: React.FC<{ t: number }> = ({ t }) => (
  <g transform={`translate(${Math.sin(t / 20) * 8} 0)`} fill="none" stroke={C.krem} strokeWidth={3.5} strokeLinecap="round">
    {[-160, -80, 0, 80, 160].map((x, i) => (
      <path key={i} d={`M${x - 40} 0 q20 -34 44 -18 q16 12 2 22 q-12 6 -14 -6`} transform={`translate(0 ${Math.sin((t + i * 10) / 14) * 4})`} />
    ))}
  </g>
);

const Gunung: React.FC = () => (
  <g stroke={C.krem} strokeWidth={L} strokeLinejoin="round">
    <path d="M-110 0 C-90 -80 -30 -100 0 -100 C30 -100 90 -80 110 0 Z" fill={IL.indigoTerang} />
    <Isen x={-80} y={-80} w={160} h={70} step={16} />
    <path d="M-60 0 C-50 -46 -18 -58 0 -58 C18 -58 50 -46 60 0" fill="none" strokeWidth={2.5} opacity={0.6} />
  </g>
);

const Kapal: React.FC<{ t: number }> = ({ t }) => (
  <g transform={`rotate(${Math.sin(t / 18) * 2.5})`} strokeLinejoin="round">
    {/* layar (jung/pinisi): cokelat bergaris kotak */}
    <g stroke={C.krem} strokeWidth={L}>
      <path d="M-70 -50 L-62 -170 L-6 -160 L-14 -48 Z" fill={IL.kayuTerang} />
      <path d="M6 -46 L12 -140 L64 -132 L56 -44 Z" fill={IL.kayuTerang} />
      <g strokeWidth={2} opacity={0.75}>
        <path d="M-66 -110 L-10 -104 M-64 -140 L-8 -132 M-68 -80 L-12 -76" />
        <path d="M8 -110 L60 -104 M10 -80 L58 -76" />
        <path d="M-38 -165 L-42 -49 M38 -136 L32 -45" />
      </g>
      <path d="M-34 -164 L-34 -196 L-14 -188 L-34 -180" fill={IL.bata} strokeWidth={2.5} />
    </g>
    {/* lambung emas berhias segitiga (tumpal) */}
    <path d="M-120 -40 Q0 -28 120 -46 Q96 4 0 6 Q-96 4 -120 -40 Z" fill={IL.indigoGelap} stroke={C.emas} strokeWidth={L} />
    <g fill={C.emas}>
      {Array.from({ length: 9 }).map((_, i) => (
        <path key={i} d={`M${-84 + i * 21} -24 l10 0 l-5 12 Z`} />
      ))}
    </g>
    <path d="M-120 -40 q-14 -10 -6 -22 M120 -46 q14 -8 8 -22" fill="none" stroke={C.emas} strokeWidth={4} strokeLinecap="round" />
  </g>
);

const Candi: React.FC = () => (
  <g stroke={C.krem} strokeWidth={L} strokeLinejoin="round">
    <path d="M-120 0 H120 V-26 H-120 Z" fill={IL.kayu} />
    <path d="M-100 -26 H100 V-54 H-100 Z" fill={IL.marun} />
    <path d="M-80 -54 H80 V-82 H-80 Z" fill={IL.kayu} />
    <path d="M-58 -82 H58 V-108 H-58 Z" fill={IL.marun} />
    <path d="M-36 -108 C-36 -150 36 -150 36 -108 Z" fill="url(#ilGold)" />
    <path d="M0 -146 V-176" stroke={C.emas} strokeWidth={5} />
    <circle cy={-180} r={5} fill={C.emas} stroke="none" />
    <g strokeWidth={2} opacity={0.6}>
      {[-90, -60, -30, 0, 30, 60, 90].map((x) => (
        <path key={x} d={`M${x} -26 V0`} />
      ))}
      {[-70, -40, -10, 20, 50].map((x) => (
        <path key={x} d={`M${x + 10} -82 V-54`} />
      ))}
    </g>
  </g>
);

const RumahPanggung: React.FC = () => (
  <g stroke={C.krem} strokeWidth={L} strokeLinejoin="round">
    {[-60, -20, 20, 60].map((x) => (
      <path key={x} d={`M${x} 0 V-50`} />
    ))}
    <path d="M-80 -50 H80 V-110 H-80 Z" fill={IL.kayu} />
    <g strokeWidth={2} opacity={0.6}>
      {[-60, -40, -20, 0, 20, 40, 60].map((x) => (
        <path key={x} d={`M${x} -54 V-106`} />
      ))}
    </g>
    <path d="M-120 -104 Q-60 -150 0 -190 Q60 -150 120 -104 Q60 -122 0 -126 Q-60 -122 -120 -104 Z" fill={IL.bata} />
    <path d="M-120 -104 q-12 -30 6 -50 M120 -104 q12 -30 -6 -50" fill="none" stroke={C.emas} strokeWidth={4} strokeLinecap="round" />
    <path d="M-14 -50 H14 V-86 H-14 Z" fill={IL.indigoGelap} />
  </g>
);

const Gong: React.FC<{ t: number }> = ({ t }) => (
  <g strokeLinejoin="round">
    <path d="M-90 0 V-170 H90 V0" fill="none" stroke={C.krem} strokeWidth={L + 1} />
    <path d="M-100 -170 H100" stroke={C.emas} strokeWidth={8} strokeLinecap="round" />
    <g transform={`rotate(${Math.sin(t / 10) * 2} 0 -150)`}>
      <path d="M-20 -164 L-10 -128 M20 -164 L10 -128" stroke={C.krem} strokeWidth={3} />
      <circle cy={-74} r={56} fill="url(#ilGold)" stroke={C.emasTua} strokeWidth={3} />
      <circle cy={-74} r={40} fill="none" stroke={C.emasTua} strokeWidth={2} />
      <circle cy={-74} r={16} fill={C.emasMuda} stroke={C.emasTua} strokeWidth={2} />
    </g>
  </g>
);

const Orang: React.FC<{ t: number }> = ({ t }) => (
  <g stroke={C.krem} strokeWidth={L} strokeLinejoin="round" strokeLinecap="round" transform={`translate(0 ${Math.abs(Math.sin(t / 12)) * -2})`}>
    <path d="M-12 0 L-8 -60 M12 0 L8 -60" />
    <path d="M-24 -56 L-16 -120 H16 L24 -56 Z" fill={IL.bata} />
    <path d="M-16 -110 L-34 -74 M16 -110 L34 -76" />
    <circle cy={-136} r={14} fill={IL.kayuTerang} />
    <path d="M-36 -140 L0 -168 L36 -140 Z" fill={C.emas} strokeWidth={3} />
  </g>
);

const Kelapa: React.FC<{ t: number }> = ({ t }) => (
  <g stroke={C.krem} strokeWidth={L} strokeLinejoin="round" strokeLinecap="round">
    <path d="M0 0 C10 -60 -6 -120 10 -180" fill="none" strokeWidth={7} />
    <g transform={`translate(10 -180) rotate(${Math.sin(t / 25) * 4})`} fill={C.aksen2}>
      {[-150, -110, -60, -20, 20, 60].map((a, i) => (
        <path key={i} d="M0 0 Q40 -20 80 10 Q40 0 0 0 Z" transform={`rotate(${a})`} />
      ))}
      <circle cx={-6} cy={8} r={7} fill={IL.kayuTerang} />
      <circle cx={8} cy={10} r={7} fill={IL.kayuTerang} />
    </g>
  </g>
);

export const ILUSTRASI: Record<JenisIlustrasi, React.FC<{ t: number }>> = {
  matahari: Matahari,
  bulan: Bulan,
  bumi: Bumi,
  bintang: Bintang,
  planet: Planet,
  awan: Awan,
  ombak: Ombak,
  gunung: Gunung,
  kapal: Kapal,
  candi: Candi,
  rumahPanggung: RumahPanggung,
  gong: Gong,
  orang: Orang,
  kelapa: Kelapa,
};

/** <defs> bersama (gradien emas + glow). Taruh sekali di dalam <svg>. */
export const IlustrasiDefs: React.FC = () => (
  <defs>
    <linearGradient id="ilGold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#F8DA88" />
      <stop offset="0.55" stopColor="#EDB53D" />
      <stop offset="1" stopColor="#B07A26" />
    </linearGradient>
    <filter id="ilGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation={8} result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

export type ElemenIlustrasi = {
  jenis: JenisIlustrasi;
  /** posisi di kanvas 1000 × (1000·tinggi/lebar) */
  x: number;
  y: number;
  skala?: number;
  /** detik mulai muncul */
  at?: number;
  /** gerak tambahan: melayang naik-turun, bergeser horizontal */
  gerak?: "melayang" | "geser";
  cermin?: boolean;
  opacity?: number;
  kata?: string;
  kataKe?: number;
  kataMaju?: number;
};

/** Satu elemen dengan animasi muncul (skala + naik + fade) dan gerak idle. */
export const Elemen: React.FC<{ el: ElemenIlustrasi; frame: number; fps: number }> = ({ el, frame, fps }) => {
  const Comp = ILUSTRASI[el.jenis];
  if (!Comp) return null;
  const st = (el.at ?? 0) * fps;
  const p = Math.min(1, Math.max(0, (frame - st) / 16));
  const e = 1 - Math.pow(1 - p, 3);
  if (p <= 0) return null;
  const t = frame - st;
  const dy = el.gerak === "melayang" ? Math.sin(t / 22) * 10 : 0;
  const dx = el.gerak === "geser" ? t * 0.6 : 0;
  const s = (el.skala ?? 1) * (0.7 + 0.3 * e);
  return (
    <g transform={`translate(${el.x + dx} ${el.y + dy + (1 - e) * 30}) scale(${el.cermin ? -s : s} ${s})`} opacity={e * (el.opacity ?? 1)}>
      <Comp t={t} />
    </g>
  );
};
