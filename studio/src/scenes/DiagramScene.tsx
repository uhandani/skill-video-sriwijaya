import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, GOLD_STOPS, serif, warna } from "../brand/theme";
import { Tex } from "../components/Tex";
import type { DiagramItem, DiagramProps } from "../storyboard/types";
import { SceneHeading, clamp, easeOut, useS } from "./common";

type Pt = [number, number];

const arcPts = (c: Pt, r: number, a0: number, a1: number): Pt[] => {
  const n = Math.max(8, Math.ceil(Math.abs(a1 - a0) / 4));
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)] as Pt;
  });
};

const norm = (v: Pt): Pt => {
  const l = Math.hypot(v[0], v[1]) || 1;
  return [v[0] / l, v[1] / l];
};

/** Titik-titik polyline (untuk pena & penanda fokus); null bila bukan garis. */
const polyOf = (it: DiagramItem): Pt[] | null => {
  switch (it.type) {
    case "line":
      return [it.from, it.to];
    case "polygon":
      return it.close === false ? it.points : [...it.points, it.points[0]];
    case "rect":
      return [[it.x, it.y], [it.x + it.w, it.y], [it.x + it.w, it.y + it.h], [it.x, it.y + it.h], [it.x, it.y]];
    case "circle":
      return arcPts(it.c, it.r, 90, 450);
    case "arc":
      return arcPts(it.c, it.r, it.from, it.to);
    case "rightAngle": {
      const sz = it.size ?? 34;
      const a = norm(it.dir1);
      const b = norm(it.dir2);
      const p1: Pt = [it.vertex[0] + a[0] * sz, it.vertex[1] + a[1] * sz];
      const p2: Pt = [p1[0] + b[0] * sz, p1[1] + b[1] * sz];
      const p3: Pt = [it.vertex[0] + b[0] * sz, it.vertex[1] + b[1] * sz];
      return [p1, p2, p3];
    }
    default:
      return null;
  }
};

const pointAt = (pts: Pt[], p: number): Pt => {
  const segs = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  let d = p * total;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i] || i === segs.length - 1) {
      const t = segs[i] ? Math.min(1, d / segs[i]) : 0;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t];
    }
    d -= segs[i];
  }
  return pts[pts.length - 1];
};

const anchorOf = (it: DiagramItem): Pt => {
  if (it.type === "circle" || it.type === "arc") return it.c;
  if (it.type === "text" || it.type === "tex") return it.pos;
  if (it.type === "rightAngle") return it.vertex;
  const pts = polyOf(it);
  if (!pts) return [500, 500];
  const u = it.type === "line" ? pts : pts.slice(0, -1);
  return [u.reduce((a, p) => a + p[0], 0) / u.length, u.reduce((a, p) => a + p[1], 0) / u.length];
};

const Pen: React.FC<{ at: Pt }> = ({ at }) => (
  <g transform={`translate(${at[0]} ${at[1]}) rotate(-38)`}>
    <ellipse cx={0} cy={0} rx={18} ry={18} fill={C.emas} opacity={0.35} />
    <path d="M0 0 L-7 -22 L-7 -150 L7 -150 L7 -22 Z" fill="url(#penGold)" stroke="#7A4E14" strokeWidth={1.5} />
    <path d="M0 0 L-7 -22 L7 -22 Z" fill="#3A2A12" />
    <rect x={-8} y={-160} width={16} height={12} rx={3} fill={C.marun} />
  </g>
);

/** Diagram geometri/fisika yang tergambar garis demi garis (draw-on). */
export const DiagramScene: React.FC<DiagramProps> = ({ judul, items, pena, top, height: hProp }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, width, height, portrait } = useS();
  const areaTop = top !== undefined ? top * s : height * (portrait ? 0.2 : 0.16);
  const areaH = hProp !== undefined ? hProp * s : portrait ? Math.min(width * 0.92, height * 0.5) : height * 0.62;
  const size = Math.min(areaH, width * 0.92);

  let penAt: Pt | null = null;
  const rendered = items.map((it, idx) => {
    const st = Math.round(it.at * fps);
    const du = Math.max(1, Math.round((it.dur ?? 0.8) * fps));
    const p = interpolate(frame, [st, st + du], [0, 1], { ...clamp, easing: easeOut });
    if (p <= 0) return null;
    const hide = it.hideAt !== undefined ? interpolate(frame, [it.hideAt * fps, it.hideAt * fps + 10], [1, 0], clamp) : 1;
    const stroke = warna(it.stroke, C.krem);
    const isGold = it.stroke === "emas";
    const sw = it.width ?? 6;
    const fillOp = interpolate(p, [0.6, 1], [0, it.fillOpacity ?? 1], clamp);
    const common = {
      fill: it.fill ? warna(it.fill) : "none",
      fillOpacity: it.fill ? fillOp : 0,
      stroke: isGold ? "url(#diagGold)" : stroke,
      strokeWidth: sw,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
      pathLength: 1,
      strokeDasharray: it.dashed ? undefined : 1,
      strokeDashoffset: it.dashed ? undefined : 1 - p,
      style: it.dashed ? { strokeDasharray: "14 12", opacity: p } : undefined,
      filter: isGold ? "url(#diagGlow)" : undefined,
    };
    if (pena && p > 0 && p < 1) {
      const pts = polyOf(it);
      if (pts) penAt = pointAt(pts, p);
    }
    let el: React.ReactNode = null;
    switch (it.type) {
      case "text":
        el = (
          <text
            x={it.pos[0]}
            y={it.pos[1] + (1 - p) * 16}
            fontFamily={serif}
            fontWeight={700}
            fontSize={it.size ?? 54}
            textAnchor={it.anchor ?? "middle"}
            fill={warna(it.fill ?? it.stroke, C.krem)}
            opacity={p}
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,.5))" }}
          >
            {it.text}
          </text>
        );
        break;
      case "tex": {
        const w = 700;
        const h = 200;
        el = (
          <foreignObject x={it.pos[0] - w / 2} y={it.pos[1] - h / 2} width={w} height={h} opacity={p}>
            <div style={{ width: w, height: h, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Tex tex={it.tex} size={it.size ?? 48} color={warna(it.fill ?? it.stroke, C.krem)} />
            </div>
          </foreignObject>
        );
        break;
      }
      case "grid": {
        let d = "";
        for (let x = it.x; x <= it.x + it.w + 0.1; x += it.step) d += `M${x} ${it.y} V${it.y + it.h} `;
        for (let y = it.y; y <= it.y + it.h + 0.1; y += it.step) d += `M${it.x} ${y} H${it.x + it.w} `;
        el = <path d={d} stroke={stroke} strokeWidth={it.width ?? 2} opacity={p * 0.6} fill="none" />;
        break;
      }
      case "path":
        el = <path d={it.d} {...common} />;
        break;
      case "circle":
        el = <circle cx={it.c[0]} cy={it.c[1]} r={it.r} {...common} transform={`rotate(-90 ${it.c[0]} ${it.c[1]})`} />;
        break;
      default: {
        const pts = polyOf(it)!;
        const d = `M${pts.map((q) => `${q[0]} ${q[1]}`).join(" L")}${it.type === "polygon" && it.close !== false ? " Z" : ""}`;
        el = <path d={d} {...common} />;
      }
    }
    const focus = it.focus ? (
      <circle
        cx={anchorOf(it)[0]}
        cy={anchorOf(it)[1]}
        r={46 + 6 * Math.sin(frame / 6)}
        fill="none"
        stroke={C.emas}
        strokeWidth={5}
        opacity={interpolate(p, [0.8, 1], [0, 0.9], clamp)}
        strokeDasharray="10 8"
      />
    ) : null;
    return (
      <g key={idx} opacity={hide}>
        {el}
        {focus}
      </g>
    );
  });

  return (
    <AbsoluteFill>
      {judul ? <SceneHeading text={judul} /> : null}
      <svg
        width={size}
        height={size}
        viewBox="0 0 1000 1000"
        style={{ position: "absolute", left: (width - size) / 2, top: areaTop + (areaH - size) / 2, overflow: "visible" }}
      >
        <defs>
          <linearGradient id="diagGold" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1000">
            {GOLD_STOPS.map(([o, c]) => (
              <stop key={o} offset={o} stopColor={c} />
            ))}
          </linearGradient>
          <linearGradient id="penGold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#B07A26" />
            <stop offset="0.5" stopColor="#F8DA88" />
            <stop offset="1" stopColor="#B07A26" />
          </linearGradient>
          <filter id="diagGlow" filterUnits="userSpaceOnUse" x={-200} y={-200} width={1400} height={1400}>
            <feGaussianBlur stdDeviation={5} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {rendered}
        {penAt ? <Pen at={penAt} /> : null}
      </svg>
    </AbsoluteFill>
  );
};
