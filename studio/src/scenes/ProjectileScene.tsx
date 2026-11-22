import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, sans, serif } from "../brand/theme";
import type { ProjectileProps } from "../storyboard/types";
import { SceneHeading, clamp, useS } from "./common";

const fmt = (n: number, d = 1) => n.toLocaleString("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d });

/**
 * Gerak parabola yang DIHITUNG dari persamaan fisika:
 * x = v0·cosθ·t,  y = v0·sinθ·t − ½·g·t²
 */
export const ProjectileScene: React.FC<ProjectileProps> = ({ judul, v0, sudut, g = 9.8, slow = 1, tampilkanVektor = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, width, height, portrait } = useS();
  const th = (sudut * Math.PI) / 180;
  const vx = v0 * Math.cos(th);
  const vy0 = v0 * Math.sin(th);
  const T = (2 * vy0) / g;
  const range = vx * T;
  const hmax = (vy0 * vy0) / (2 * g);

  const groundY = height * (portrait ? 0.63 : 0.78);
  const left = width * 0.1;
  const availW = width * 0.8;
  const availH = height * (portrait ? 0.3 : 0.5);
  const k = Math.min(availW / range, availH / hmax); // px per meter
  const X = (m: number) => left + m * k;
  const Y = (m: number) => groundY - m * k;

  const delay = 0.6 * fps;
  const t = Math.min(T, Math.max(0, (frame - delay) / fps / slow));
  const bx = vx * t;
  const by = vy0 * t - 0.5 * g * t * t;
  const vyt = vy0 - g * t;
  const landed = t >= T;

  const trail: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const tt = (t * i) / 80;
    trail.push(`${X(vx * tt).toFixed(1)} ${Y(vy0 * tt - 0.5 * g * tt * tt).toFixed(1)}`);
  }
  const guide: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const tt = (T * i) / 80;
    guide.push(`${X(vx * tt).toFixed(1)} ${Y(vy0 * tt - 0.5 * g * tt * tt).toFixed(1)}`);
  }
  const vs = 9 * s; // px per (m/s) untuk panjang panah
  const intro = interpolate(frame, [0, 14], [0, 1], clamp);
  const endP = interpolate(frame, [delay + T * slow * fps, delay + T * slow * fps + 14], [0, 1], clamp);

  const Arrow: React.FC<{ dx: number; dy: number; color: string; w: number }> = ({ dx, dy, color, w }) => {
    const x2 = X(bx) + dx;
    const y2 = Y(by) - dy;
    const a = Math.atan2(-dy, dx);
    const h = 18 * s;
    if (Math.hypot(dx, dy) < 4) return null;
    return (
      <g stroke={color} fill={color} strokeWidth={w} strokeLinecap="round">
        <line x1={X(bx)} y1={Y(by)} x2={x2} y2={y2} />
        <path d={`M${x2} ${y2} L${x2 - h * Math.cos(a - 0.4)} ${y2 - h * Math.sin(a - 0.4)} L${x2 - h * Math.cos(a + 0.4)} ${y2 - h * Math.sin(a + 0.4)} Z`} strokeWidth={1} />
      </g>
    );
  };

  return (
    <AbsoluteFill>
      {judul ? <SceneHeading text={judul} /> : null}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="pGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={8} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* tanah bermotif ombak */}
        <line x1={width * 0.05} y1={groundY} x2={width * 0.95} y2={groundY} stroke={C.krem} strokeWidth={5 * s} opacity={intro} />
        {Array.from({ length: 14 }).map((_, i) => (
          <path
            key={i}
            d={`M${width * 0.06 + i * width * 0.064} ${groundY + 26 * s} q ${12 * s} ${-14 * s} ${24 * s} 0 t ${24 * s} 0`}
            stroke={C.krem}
            strokeWidth={2.5 * s}
            fill="none"
            opacity={0.35 * intro}
          />
        ))}
        <path d={`M${guide.join(" L")}`} stroke={C.krem} strokeWidth={3 * s} strokeDasharray={`${10 * s} ${12 * s}`} fill="none" opacity={0.3 * intro} />
        <path d={`M${trail.join(" L")}`} stroke={C.emas} strokeWidth={7 * s} fill="none" strokeLinecap="round" filter="url(#pGlow)" />
        {/* sudut lempar */}
        <path
          d={`M${X(0) + 80 * s} ${Y(0)} A ${80 * s} ${80 * s} 0 0 0 ${X(0) + 80 * s * Math.cos(th)} ${Y(0) - 80 * s * Math.sin(th)}`}
          stroke={C.emas}
          strokeWidth={4 * s}
          fill="none"
          opacity={intro}
        />
        <text x={X(0) + 100 * s} y={Y(0) - 24 * s} fontFamily={serif} fontWeight={700} fontSize={44 * s} fill={C.emas} opacity={intro}>
          {sudut}°
        </text>
        {tampilkanVektor && !landed ? (
          <>
            <Arrow dx={vx * vs} dy={0} color={C.krem} w={5 * s} />
            <Arrow dx={0} dy={vyt * vs} color={C.krem} w={5 * s} />
            <Arrow dx={vx * vs} dy={vyt * vs} color={C.emas} w={7 * s} />
          </>
        ) : null}
        <circle cx={X(bx)} cy={Y(by)} r={22 * s} fill={C.emas} filter="url(#pGlow)" />
        <circle cx={X(bx) - 6 * s} cy={Y(by) - 6 * s} r={7 * s} fill="#FFF3C8" opacity={0.8} />
        {/* penanda tinggi maks & jangkauan */}
        <g opacity={endP} fontFamily={sans} fontWeight={800} fontSize={34 * s} fill={C.krem}>
          <line x1={X(range / 2)} y1={Y(0)} x2={X(range / 2)} y2={Y(hmax)} stroke={C.emas} strokeWidth={3 * s} strokeDasharray={`${8 * s} ${8 * s}`} />
          <text x={X(range / 2) + 16 * s} y={Y(hmax / 2)}>
            h maks = {fmt(hmax)} m
          </text>
          <text x={X(range)} y={Y(0) + 80 * s} textAnchor="end">
            jangkauan = {fmt(range)} m
          </text>
        </g>
      </svg>
      {/* panel angka */}
      <div
        style={{
          position: "absolute",
          top: height * (portrait ? 0.2 : 0.18),
          left: width * 0.1,
          fontFamily: sans,
          fontWeight: 800,
          fontSize: 36 * s,
          color: C.krem,
          lineHeight: 1.5,
          padding: `${16 * s}px ${26 * s}px`,
          background: "rgba(20,24,51,0.55)",
          borderLeft: `${5 * s}px solid ${C.emas}`,
          opacity: intro,
        }}
      >
        <div>
          v₀ = {fmt(v0, 0)} m/s · g = {fmt(g)} m/s²
        </div>
        <div style={{ color: C.emas }}>
          t = {fmt(t, 2)} s · x = {fmt(bx)} m · y = {fmt(Math.max(0, by))} m
        </div>
      </div>
    </AbsoluteFill>
  );
};
