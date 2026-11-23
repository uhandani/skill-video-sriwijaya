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
  | "kapal" | "candi" | "rumahPanggung" | "gong" | "orang" | "kelapa" | "planet"
  | "tangga" | "dindingBata" | "gulungan" | "buku" | "kubah" | "percetakan"
  | "borobudur" | "hujan" | "roket" | "jam" | "bohlam" | "baterai" | "petir";

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

const Bata: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => {
  const rows = Math.floor(h / 22);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={IL.bata} stroke={C.krem} strokeWidth={L} />
      <g stroke={C.krem} strokeWidth={1.8} opacity={0.55}>
        {Array.from({ length: rows }).map((_, r) => (
          <g key={r}>
            <path d={`M${x} ${y + (r + 1) * 22} H${x + w}`} />
            {Array.from({ length: Math.ceil(w / 40) + 1 }).map((__, c) => {
              const bx = x + c * 40 + (r % 2 ? 20 : 0);
              return bx > x && bx < x + w ? <path key={c} d={`M${bx} ${y + r * 22} V${y + (r + 1) * 22}`} /> : null;
            })}
          </g>
        ))}
      </g>
    </g>
  );
};

/** Tembok bata (tukang bangunan). (0,0) = tengah-bawah. */
const DindingBata: React.FC = () => (
  <g>
    <Bata x={-110} y={-176} w={220} h={176} />
    <path d="M-120 0 H120" stroke={C.krem} strokeWidth={L} />
  </g>
);

/** Tangga bersandar di tembok — proporsi 3 : 4 : 5 (kaki 3, tinggi 4, tangga 5). */
const Tangga: React.FC = () => {
  const u = 44; // 1 meter
  const wallX = 60;
  const foot: [number, number] = [wallX - 3 * u, 0];
  const top: [number, number] = [wallX, -4 * u];
  const rail = (dx: number) => `M${foot[0] + dx} ${foot[1]} L${top[0] + dx - 4} ${top[1]}`;
  return (
    <g strokeLinecap="round">
      <Bata x={wallX} y={-4 * u - 30} w={60} h={4 * u + 30} />
      <path d={`M-120 0 H${wallX + 80}`} stroke={C.krem} strokeWidth={L} />
      <g stroke={C.krem} strokeWidth={15}>
        <path d={rail(-10)} />
        <path d={rail(10)} />
      </g>
      <g stroke={C.krem} strokeWidth={11}>
        {Array.from({ length: 7 }).map((_, i) => {
          const t = (i + 1) / 8;
          const x = foot[0] + (top[0] - foot[0]) * t;
          const y = foot[1] + (top[1] - foot[1]) * t;
          return <path key={i} d={`M${x - 13} ${y} L${x + 11} ${y}`} />;
        })}
      </g>
      <g stroke={IL.kayuTerang} strokeWidth={8}>
        <path d={rail(-10)} />
        <path d={rail(10)} />
      </g>
      <g stroke={IL.kayuTerang} strokeWidth={5}>
        {Array.from({ length: 7 }).map((_, i) => {
          const t = (i + 1) / 8;
          const x = foot[0] + (top[0] - foot[0]) * t;
          const y = foot[1] + (top[1] - foot[1]) * t;
          return <path key={i} d={`M${x - 12} ${y} L${x + 10} ${y}`} />;
        })}
      </g>
      <g stroke={C.krem} strokeWidth={3} fill="none">
        <path d={rail(-10)} opacity={0} />
        <path d={`M${wallX - 16} 0 V-16 H${wallX}`} />
      </g>
    </g>
  );
};

/** Gulungan naskah kuno (papirus/perkamen) dengan tulisan samar. */
const Gulungan: React.FC = () => (
  <g stroke={C.krem} strokeWidth={L} strokeLinejoin="round">
    <path d="M-90 -120 H90 V-20 H-90 Z" fill={C.perkamen} />
    <g stroke={IL.kayu} strokeWidth={3} opacity={0.7}>
      {[-100, -84, -68, -52, -36].map((y, i) => (
        <path key={y} d={`M-70 ${y} H${40 - (i % 2) * 30}`} />
      ))}
    </g>
    <rect x={-104} y={-130} width={18} height={120} rx={9} fill={IL.kayuTerang} />
    <rect x={86} y={-130} width={18} height={120} rx={9} fill={IL.kayuTerang} />
    <path d="M-95 -132 v-10 M95 -132 v-10 M-95 -8 v10 M95 -8 v10" stroke={C.emas} strokeWidth={5} />
  </g>
);

/** Buku terbuka + pena bulu (naskah matematika). */
const Buku: React.FC = () => (
  <g stroke={C.krem} strokeWidth={L} strokeLinejoin="round">
    <path d="M0 -20 Q-50 -40 -110 -24 V-110 Q-50 -126 0 -106 Z" fill={C.perkamen} />
    <path d="M0 -20 Q50 -40 110 -24 V-110 Q50 -126 0 -106 Z" fill={C.perkamen} />
    <path d="M0 -106 V-20" />
    <path d="M-110 -24 L-110 -10 Q-50 -26 0 -6 Q50 -26 110 -10 L110 -24" fill={IL.marun} />
    <g stroke={IL.kayu} strokeWidth={2.5} opacity={0.75}>
      {[-92, -78, -64, -50].map((y) => (
        <path key={y} d={`M-90 ${y + 4} Q-50 ${y - 6} -14 ${y + 4}`} fill="none" />
      ))}
      <path d="M20 -80 q20 -18 40 0 q20 18 40 0" fill="none" />
    </g>
    <g transform="translate(70 -110) rotate(28)">
      <path d="M0 0 C-14 -40 -6 -90 12 -120 C18 -86 14 -40 0 0 Z" fill={C.krem} strokeWidth={3} />
      <path d="M0 0 L6 -100" strokeWidth={2} />
      <path d="M0 0 l-3 12 l6 0 Z" fill={C.emas} stroke="none" />
    </g>
  </g>
);

/** Bangunan berkubah ala Baghdad abad pertengahan (rumah ilmu). */
const Kubah: React.FC = () => (
  <g stroke={C.krem} strokeWidth={L} strokeLinejoin="round">
    <path d="M-110 0 V-90 H110 V0 Z" fill={IL.kayu} />
    {[-70, -24, 24, 70].map((x) => (
      <path key={x} d={`M${x - 14} 0 V-44 Q${x} -66 ${x + 14} -44 V0`} fill={IL.indigoGelap} />
    ))}
    <path d="M-60 -90 Q-60 -170 0 -186 Q60 -170 60 -90 Z" fill={IL.indigo} />
    <path d="M-40 -100 Q-38 -160 0 -172" fill="none" strokeWidth={2} opacity={0.5} />
    <path d="M0 -186 V-212" stroke={C.emas} strokeWidth={5} />
    <circle cy={-218} r={7} fill={C.emas} stroke="none" />
    <path d="M150 0 V-150 M130 0 V-150 M125 -150 H155 L140 -176 Z" fill={IL.kayuTerang} />
    <path d="M-114 -90 H114" stroke={C.emas} strokeWidth={4} />
  </g>
);

/** Mesin cetak kayu + blok huruf (salah satunya "x"). */
const Percetakan: React.FC<{ t: number }> = ({ t }) => {
  const press = Math.max(0, Math.sin(t / 16)) * 14;
  return (
    <g stroke={C.krem} strokeWidth={L} strokeLinejoin="round">
      <path d="M-80 0 V-200 M80 0 V-200 M-96 -200 H96" fill="none" strokeWidth={10} stroke={IL.kayuTerang} />
      <path d="M-6 -200 V-150" stroke={C.emas} strokeWidth={6} />
      <rect x={-60} y={-150 + press} width={120} height={22} fill={IL.kayu} />
      <rect x={-70} y={-60} width={140} height={16} fill={IL.kayu} />
      {[-48, -16, 16, 48].map((x, i) => (
        <g key={x}>
          <rect x={x - 14} y={-92} width={28} height={30} fill={i === 2 ? C.emas : C.perkamen} strokeWidth={2.5} />
          <text x={x} y={-70} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontWeight={700} fontSize={22} fill={IL.indigoGelap} stroke="none">
            {["a", "b", "x", "y"][i]}
          </text>
        </g>
      ))}
      <path d="M-100 0 H100" />
    </g>
  );
};

const StupaKecil: React.FC<{ x: number; y: number; s?: number; emas?: boolean }> = ({ x, y, s = 1, emas }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-10 0 C-12 -16 12 -16 10 0 Z" fill={emas ? "url(#ilGold)" : IL.kayuTerang} stroke={C.krem} strokeWidth={2.5} />
    <path d="M0 -13 V-20" stroke={emas ? C.emas : C.krem} strokeWidth={2.5} />
  </g>
);

/** Borobudur: 5 teras persegi bertingkat + 3 teras bundar berstupa + stupa induk emas (di atas bukit). */
const Borobudur: React.FC = () => {
  const teras = [260, 228, 196, 166, 138];
  let y = 0;
  const rows: React.ReactNode[] = [];
  teras.forEach((w, i) => {
    const h = 18;
    rows.push(
      <g key={`t${i}`}>
        <rect x={-w / 2} y={y - h} width={w} height={h} fill={i % 2 ? IL.kayu : IL.kayuTerang} stroke={C.krem} strokeWidth={3.5} />
        <g stroke={C.krem} strokeWidth={1.4} opacity={0.55}>
          {Array.from({ length: Math.floor(w / 18) }).map((_, k) => (
            <path key={k} d={`M${-w / 2 + 9 + k * 18} ${y - h + 4} V${y - 4}`} />
          ))}
        </g>
      </g>,
    );
    y -= h;
  });
  const bundar = [112, 88, 64];
  bundar.forEach((w, i) => {
    rows.push(<path key={`b${i}`} d={`M${-w / 2} ${y} Q0 ${y - 10} ${w / 2} ${y} V${y - 6} Q0 ${y - 16} ${-w / 2} ${y - 6} Z`} fill={IL.indigoTerang} stroke={C.krem} strokeWidth={3} />);
    const n = [7, 5, 3][i];
    for (let k = 0; k < n; k++) {
      const x = -w / 2 + 10 + (k * (w - 20)) / (n - 1);
      rows.push(<StupaKecil key={`s${i}-${k}`} x={x} y={y - 8} s={0.9} />);
    }
    y -= 22;
  });
  rows.push(<StupaKecil key="induk" x={0} y={y + 4} s={2.2} emas />);
  return (
    <g strokeLinejoin="round">
      <path d="M-170 0 Q-140 -40 -60 -44 H60 Q140 -40 170 0 Z" fill={IL.indigo} stroke={C.krem} strokeWidth={3} opacity={0.85} transform="translate(0 0) scale(1 0.45)" />
      {rows}
    </g>
  );
};

/** Hujan: awan + garis hujan bergerak. */
const Hujan: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <g transform="translate(0 -40)">
      <Awan />
    </g>
    <g stroke={C.krem} strokeWidth={3} strokeLinecap="round" opacity={0.75}>
      {Array.from({ length: 12 }).map((_, i) => {
        const x = -90 + (i % 6) * 36 + (i > 5 ? 18 : 0);
        const y = ((t * 6 + i * 23) % 90) - 20;
        return <path key={i} d={`M${x} ${y} l-6 18`} />;
      })}
    </g>
  </g>
);

/** Roket dengan nyala api berkedip (percepatan). (0,0) = tengah-bawah nozzle. */
const Roket: React.FC<{ t: number }> = ({ t }) => {
  const fl = 1 + 0.18 * Math.sin(t / 2.2) + 0.08 * Math.sin(t / 1.3);
  return (
    <g strokeLinejoin="round">
      <g transform={`scale(1 ${fl})`}>
        <path d="M-18 0 Q0 70 18 0 Z" fill={C.emas} />
        <path d="M-9 0 Q0 40 9 0 Z" fill="#FFF3C8" />
      </g>
      <g stroke={C.krem} strokeWidth={L}>
        <path d="M-34 -10 L-62 18 L-56 -40 Z M34 -10 L62 18 L56 -40 Z" fill={IL.bata} />
        <path d="M-34 0 V-150 Q0 -230 34 -150 V0 Z" fill={C.krem} />
        <circle cy={-120} r={18} fill={IL.indigo} />
        <path d="M-34 -40 H34" strokeWidth={3} />
      </g>
      <path d="M-34 -150 Q0 -230 34 -150 Z" fill={IL.bata} stroke={C.krem} strokeWidth={L} />
    </g>
  );
};

/** Jam dinding dengan jarum berputar (waktu). (0,0) = pusat. */
const Jam: React.FC<{ t: number }> = ({ t }) => (
  <g strokeLinecap="round">
    <circle r={86} fill={C.perkamen} stroke={C.emas} strokeWidth={8} />
    <circle r={76} fill="none" stroke={IL.kayu} strokeWidth={2} />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * Math.PI) / 6;
      return <line key={i} x1={64 * Math.sin(a)} y1={-64 * Math.cos(a)} x2={72 * Math.sin(a)} y2={-72 * Math.cos(a)} stroke={IL.indigoGelap} strokeWidth={i % 3 ? 3 : 6} />;
    })}
    <line x1={0} y1={0} x2={0} y2={-40} stroke={IL.indigoGelap} strokeWidth={7} transform={`rotate(${t * 0.5})`} />
    <line x1={0} y1={0} x2={0} y2={-60} stroke={IL.bata} strokeWidth={4} transform={`rotate(${t * 6})`} />
    <circle r={7} fill={C.emas} />
  </g>
);

/** Bohlam menyala (0,0 = bawah fitting). Cahaya berdenyut. */
const Bohlam: React.FC<{ t: number }> = ({ t }) => {
  const g = 0.75 + 0.25 * Math.sin(t / 9);
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <circle cy={-150} r={120} fill={C.emas} opacity={0.18 * g} />
      <circle cy={-150} r={92} fill={C.emas} opacity={0.22 * g} />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        return <line key={i} x1={Math.cos(a) * 100} y1={-150 + Math.sin(a) * 100} x2={Math.cos(a) * (124 + 8 * g)} y2={-150 + Math.sin(a) * (124 + 8 * g)} stroke={C.emas} strokeWidth={6} opacity={g} />;
      })}
      <path d="M-34 -62 Q-34 -92 -58 -122 A72 72 0 1 1 58 -122 Q34 -92 34 -62 Z" fill="#FFF3C8" stroke={C.krem} strokeWidth={L} />
      <path d="M-16 -66 V-120 L-8 -140 L0 -120 L8 -140 L16 -120 V-66" fill="none" stroke={C.emas} strokeWidth={5} filter="url(#ilGlow)" />
      <g stroke={C.krem} strokeWidth={L}>
        <rect x={-36} y={-62} width={72} height={46} rx={6} fill={IL.indigo} />
        <path d="M-36 -47 H36 M-36 -32 H36" strokeWidth={3} />
        <path d="M-22 -16 Q0 4 22 -16 Z" fill={IL.indigoGelap} />
      </g>
    </g>
  );
};
/** Baterai berdiri (0,0 = bawah), dengan tanda + dan − serta pita emas. */
const Baterai: React.FC<{ t: number }> = ({ t }) => (
  <g strokeLinejoin="round">
    <g stroke={C.krem} strokeWidth={L}>
      <rect x={-18} y={-232} width={36} height={22} rx={5} fill={C.emas} />
      <rect x={-56} y={-212} width={112} height={212} rx={16} fill={IL.indigo} />
      <rect x={-56} y={-212} width={112} height={70} rx={16} fill={IL.bata} />
    </g>
    <Isen x={-46} y={-130} w={92} h={120} step={16} />
    <path d="M-56 -142 H56" stroke={C.emas} strokeWidth={8} />
    <g stroke={C.krem} strokeWidth={8} strokeLinecap="round">
      <path d="M-16 -177 H16 M0 -193 V-161" />
      <path d="M-16 -40 H16" />
    </g>
    <path d="M8 -125 L-14 -82 H4 L-8 -50 L20 -96 H2 Z" fill={C.emas} opacity={0.7 + 0.3 * Math.sin(t / 6)} />
  </g>
);
/** Petir zig-zag (0,0 = ujung bawah), berkedip. Pasangkan dengan "awan" di atasnya. */
const Petir: React.FC<{ t: number }> = ({ t }) => {
  const k = (t % 45) < 4 || ((t % 45) > 7 && (t % 45) < 10) ? 1 : 0.55;
  return (
    <g opacity={k} filter="url(#ilGlow)">
      <path d="M40 -330 L-50 -150 H10 L-40 0 L80 -190 H20 L90 -330 Z" fill="url(#ilGold)" stroke="#FFF3C8" strokeWidth={4} strokeLinejoin="round" />
    </g>
  );
};

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
  tangga: Tangga,
  dindingBata: DindingBata,
  gulungan: Gulungan,
  buku: Buku,
  kubah: Kubah,
  percetakan: Percetakan,
  borobudur: Borobudur,
  hujan: Hujan,
  roket: Roket,
  jam: Jam,
  bohlam: Bohlam,
  baterai: Baterai,
  petir: Petir,
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
