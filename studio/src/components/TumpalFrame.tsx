import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../brand/theme";

/** Bingkai garis krem ganda + barisan tumpal (segitiga) atas & bawah. */
export const TumpalFrame: React.FC<{ color?: string; opacity?: number }> = ({ color = C.krem, opacity = 0.75 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const m = 48;
  const w = width - 2 * m;
  const h = height - 2 * m;
  const draw = interpolate(frame, [0, 30], [1, 0], { extrapolateRight: "clamp" });
  const tri = 34;
  const n = Math.floor((w - 40) / tri);
  const zig = (y: number, dir: 1 | -1) => {
    let d = `M${m + 20} ${y}`;
    for (let i = 0; i < n; i++) d += ` l${tri / 2} ${-dir * tri * 0.7} l${tri / 2} ${dir * tri * 0.7}`;
    return d;
  };
  return (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity }}>
      <g fill="none" stroke={color} strokeLinejoin="round">
        <rect x={m} y={m} width={w} height={h} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={draw} />
        <rect x={m + 14} y={m + 14} width={w - 28} height={h - 28} strokeWidth={1.4} pathLength={1} strokeDasharray={1} strokeDashoffset={draw} />
        <path d={zig(m + 70, 1)} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={draw} />
        <path d={zig(height - m - 70, -1)} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={draw} />
      </g>
    </svg>
  );
};
