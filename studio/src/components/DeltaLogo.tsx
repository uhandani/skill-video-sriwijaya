import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { DOT_R_BP, PETALS, R, STROKE_BP, VERTS, VIEWBOX } from "../brand/delta";
import { C, GOLD_STOPS } from "../brand/theme";

/**
 * Logo resmi Δ Kawung CETAK BIRU: tiga kelopak berupa GARIS emas (tanpa isi,
 * TANPA ARSIRAN), titik krem di pusat. Animasi: garis bantu teknik (opsional)
 * muncul, tiap kelopak tergambar seperti pena, titik jatuh ke pusat (titik berat),
 * lalu kilau foil menyapu garis. `delay` dalam frame.
 * `isStatic` = langsung tampil penuh (watermark, thumbnail).
 * `construction` = tampilkan garis bantu (hanya untuk logo besar: intro/outro).
 * `stroke` = tebal garis (satuan R=100); naikkan untuk ukuran kecil (< 80 px).
 */
export const DeltaLogo: React.FC<{
  size: number;
  delay?: number;
  dotColor?: string;
  isStatic?: boolean;
  construction?: boolean;
  stroke?: number;
  id?: string;
}> = ({ size, delay = 0, dotColor = C.krem, isStatic = false, construction = false, stroke, id = "dl" }) => {
  const frame = useCurrentFrame() - delay;
  const t = isStatic ? 999 : frame;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const ease = Easing.bezier(0.45, 0, 0.2, 1);
  const sw = stroke ?? (size < 80 ? 6 : size < 160 ? 4.2 : STROKE_BP);
  const shine = interpolate(t, [46, 70], [-1.2, 1.4], clamp);
  const guide = interpolate(t, [0, 10], [0, 1], clamp);
  return (
    <svg width={size} height={size * 0.9} viewBox={VIEWBOX} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          {GOLD_STOPS.map(([o, c]) => (
            <stop key={o} offset={o} stopColor={c} />
          ))}
        </linearGradient>
        <linearGradient id={`${id}-s`} x1="0" y1="0" x2="1" y2="0.6" gradientTransform={`translate(${shine} 0)`}>
          <stop offset="0.35" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.5" stopColor="#fff" stopOpacity={0.8} />
          <stop offset="0.65" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>
      {construction ? (
        <g opacity={0.55 * guide} stroke={C.emas} fill="none">
          {VERTS.map(([x, y], i) => (
            <line key={i} x1={x * 1.18} y1={y * 1.18} x2={-x * 0.62} y2={-y * 0.62} strokeWidth={0.8} strokeDasharray="12 4 2.5 4" />
          ))}
          <circle cx={0} cy={0} r={R} strokeWidth={0.7} strokeDasharray="2 4.5" />
        </g>
      ) : null}
      {PETALS.map((d, i) => {
        const start = 6 + i * 8;
        const p = interpolate(t, [start, start + 18], [0, 1], { ...clamp, easing: ease });
        return (
          <g key={i}>
            <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} fill="none" stroke={`url(#${id}-g)`} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" />
            <path d={d} fill="none" stroke={`url(#${id}-s)`} strokeWidth={sw} strokeLinejoin="round" opacity={p} />
          </g>
        );
      })}
      <circle
        cx={0}
        cy={interpolate(t, [32, 44], [-140, 0], { ...clamp, easing: Easing.bounce })}
        r={DOT_R_BP + (sw - STROKE_BP) * 0.6}
        fill={dotColor}
        opacity={interpolate(t, [32, 35], [0, 1], clamp)}
      />
    </svg>
  );
};
