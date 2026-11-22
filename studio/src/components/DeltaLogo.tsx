import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { DOT_R, PETALS, VERTS, VIEWBOX } from "../brand/delta";
import { C, GOLD_STOPS } from "../brand/theme";

/**
 * Logo Δ Kawung beranimasi: 3 kelopak tumbuh dari tiap sudut, titik jatuh ke
 * pusat (titik berat), lalu kilau foil menyapu. `delay` dalam frame.
 * `static` = langsung tampil penuh (untuk watermark).
 */
export const DeltaLogo: React.FC<{
  size: number;
  delay?: number;
  dotColor?: string;
  isStatic?: boolean;
  id?: string;
}> = ({ size, delay = 0, dotColor = C.krem, isStatic = false, id = "dl" }) => {
  const frame = useCurrentFrame() - delay;
  const t = isStatic ? 999 : frame;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const shine = interpolate(t, [34, 58], [-1.2, 1.4], clamp);
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
          <stop offset="0.5" stopColor="#fff" stopOpacity={0.75} />
          <stop offset="0.65" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <filter id={`${id}-glow`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={6} result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#${id}-glow)`}>
        {PETALS.map((d, i) => {
          const start = i * 7;
          const p = interpolate(t, [start, start + 16], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
          const [vx, vy] = VERTS[i];
          return (
            <g key={i} transform={`translate(${vx} ${vy}) scale(${0.25 + 0.75 * p}) translate(${-vx} ${-vy})`} opacity={p}>
              <path d={d} fill={`url(#${id}-g)`} />
              <path d={d} fill={`url(#${id}-s)`} />
            </g>
          );
        })}
      </g>
      <circle
        cx={0}
        cy={interpolate(t, [22, 34], [-140, 0], { ...clamp, easing: Easing.bounce })}
        r={DOT_R}
        fill={dotColor}
        opacity={interpolate(t, [22, 25], [0, 1], clamp)}
      />
    </svg>
  );
};
