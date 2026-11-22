import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, sans, serif, warna } from "../brand/theme";
import type { GraphProps } from "../storyboard/types";
import { SceneHeading, clamp, easeOut, useS } from "./common";

/** Ubah ekspresi (sintaks JS, fungsi Math tanpa awalan) menjadi fungsi. Hanya untuk storyboard sendiri. */
export const compileExpr = (expr: string): ((x: number) => number) =>
  // eslint-disable-next-line no-new-func
  new Function("x", `with (Math) { return (${expr}); }`) as (x: number) => number;

const niceStep = (span: number) => {
  const raw = span / 6;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  return [1, 2, 5, 10].map((m) => m * p).find((v) => v >= raw) ?? p * 10;
};

const fmt = (n: number) => n.toLocaleString("id-ID", { maximumFractionDigits: 2 });

/** Bidang koordinat bergaya peta: sumbu krem, kurva tergambar, titik bergerak. */
export const GraphScene: React.FC<GraphProps> = ({ judul, x, y, curves, points = [], moving, xLabel = "x", yLabel = "y" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width, height, portrait } = useS();
  const size = Math.min(width * 0.86, height * (portrait ? 0.48 : 0.7));
  const left = (width - size) / 2;
  const top = portrait ? height * 0.22 : height * 0.16;
  const V = 1000;
  const sx = (v: number) => ((v - x[0]) / (x[1] - x[0])) * V;
  const sy = (v: number) => V - ((v - y[0]) / (y[1] - y[0])) * V;
  const fns = useMemo(() => curves.map((c) => compileExpr(c.expr)), [curves]);
  const paths = useMemo(
    () =>
      fns.map((fn) => {
        const pts: string[] = [];
        for (let i = 0; i <= 240; i++) {
          const xv = x[0] + ((x[1] - x[0]) * i) / 240;
          const yv = fn(xv);
          if (!Number.isFinite(yv)) continue;
          pts.push(`${sx(xv).toFixed(1)} ${sy(Math.max(y[0] - (y[1] - y[0]), Math.min(y[1] + (y[1] - y[0]), yv))).toFixed(1)}`);
        }
        return `M${pts.join(" L")}`;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fns, x[0], x[1], y[0], y[1]],
  );
  const axisP = interpolate(frame, [0, 20], [0, 1], { ...clamp, easing: easeOut });
  const xs = niceStep(x[1] - x[0]);
  const ys = niceStep(y[1] - y[0]);
  const ticksX: number[] = [];
  for (let v = Math.ceil(x[0] / xs) * xs; v <= x[1] + 1e-9; v += xs) if (Math.abs(v) > 1e-9) ticksX.push(v);
  const ticksY: number[] = [];
  for (let v = Math.ceil(y[0] / ys) * ys; v <= y[1] + 1e-9; v += ys) if (Math.abs(v) > 1e-9) ticksY.push(v);
  const ox = sx(Math.min(Math.max(0, x[0]), x[1]));
  const oy = sy(Math.min(Math.max(0, y[0]), y[1]));

  let mover: React.ReactNode = null;
  if (moving) {
    const st = moving.at * fps;
    const p = interpolate(frame, [st, st + moving.dur * fps], [0, 1], { ...clamp, easing: easeOut });
    if (frame >= st) {
      const xv = moving.from + (moving.to - moving.from) * p;
      const yv = fns[moving.curve](xv);
      mover = (
        <g>
          <path d={`M${sx(xv)} ${oy} V${sy(yv)} H${ox}`} stroke={C.emas} strokeWidth={3} strokeDasharray="10 9" fill="none" opacity={0.8} />
          <circle cx={sx(xv)} cy={sy(yv)} r={16} fill={C.emas} filter="url(#gGlow)" />
          <text x={sx(xv) + 26} y={sy(yv) - 24} fontFamily={sans} fontWeight={800} fontSize={44} fill={C.krem}>
            ({fmt(xv)}; {fmt(yv)})
          </text>
        </g>
      );
    }
  }

  return (
    <AbsoluteFill>
      {judul ? <SceneHeading text={judul} /> : null}
      <svg width={size} height={size} viewBox={`0 0 ${V} ${V}`} style={{ position: "absolute", left, top, overflow: "visible" }}>
        <defs>
          <filter id="gGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={6} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker id="arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 Z" fill={C.krem} />
          </marker>
        </defs>
        {/* grid samar */}
        <g stroke={C.krem} strokeWidth={1.2} opacity={0.12 * axisP}>
          {ticksX.map((v) => (
            <line key={`gx${v}`} x1={sx(v)} y1={0} x2={sx(v)} y2={V} />
          ))}
          {ticksY.map((v) => (
            <line key={`gy${v}`} x1={0} y1={sy(v)} x2={V} y2={sy(v)} />
          ))}
        </g>
        <g stroke={C.krem} strokeWidth={4} pathLength={1}>
          <line x1={0} y1={oy} x2={V} y2={oy} markerEnd="url(#arr)" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - axisP} />
          <line x1={ox} y1={V} x2={ox} y2={0} markerEnd="url(#arr)" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - axisP} />
        </g>
        <g fontFamily={sans} fontWeight={800} fontSize={40} fill={C.krem} opacity={0.8 * axisP}>
          {ticksX.map((v) => (
            <text key={`tx${v}`} x={sx(v)} y={oy + 50} textAnchor="middle">
              {fmt(v)}
            </text>
          ))}
          {ticksY.map((v) => (
            <text key={`ty${v}`} x={ox - 16} y={sy(v) + 10} textAnchor="end">
              {fmt(v)}
            </text>
          ))}
        </g>
        <g fontFamily={serif} fontWeight={700} fontSize={50} fill={C.krem} opacity={axisP}>
          <text x={V - 6} y={oy - 34} textAnchor="end">
            {xLabel}
          </text>
          <text x={ox + 20} y={30}>
            {yLabel}
          </text>
        </g>
        {curves.map((c, i) => {
          const st = c.at * fps;
          const p = interpolate(frame, [st, st + (c.dur ?? 1.5) * fps], [0, 1], { ...clamp, easing: easeOut });
          const col = warna(c.color ?? "emas");
          const lp = interpolate(frame, [st + (c.dur ?? 1.5) * fps, st + (c.dur ?? 1.5) * fps + 12], [0, 1], clamp);
          const lx = c.labelAt ?? x[0] + (x[1] - x[0]) * 0.8;
          const ly = fns[i](lx);
          return (
            <g key={i}>
              <path d={paths[i]} fill="none" stroke={col} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} filter="url(#gGlow)" />
              {c.label ? (
                <text x={sx(lx) + 14} y={sy(ly) - 22} fontFamily={serif} fontWeight={700} fontStyle="italic" fontSize={48} fill={col} opacity={lp}>
                  {c.label}
                </text>
              ) : null}
            </g>
          );
        })}
        {points.map((pt, i) => {
          const p = interpolate(frame, [pt.at * fps, pt.at * fps + 10], [0, 1], { ...clamp, easing: easeOut });
          return (
            <g key={i} opacity={p}>
              <circle cx={sx(pt.x)} cy={sy(pt.y)} r={12 * p + 2} fill={C.krem} stroke={C.emas} strokeWidth={4} />
              {pt.label ? (
                <text x={sx(pt.x) + 22} y={sy(pt.y) + 44} fontFamily={sans} fontWeight={800} fontSize={42} fill={C.krem}>
                  {pt.label}
                </text>
              ) : null}
            </g>
          );
        })}
        {mover}
      </svg>
    </AbsoluteFill>
  );
};
