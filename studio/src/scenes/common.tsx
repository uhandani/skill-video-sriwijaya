import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, sans, serif } from "../brand/theme";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

/** Skala px relatif lebar 1080. */
export const useS = () => {
  const { width, height } = useVideoConfig();
  return { s: Math.min(width, height) / 1080, width, height, portrait: height > width };
};

/** Muncul: fade + naik sedikit, mulai di frame `at`. */
export const useAppear = (at: number, dur = 14) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: easeOut });
  return { opacity: p, translate: `0px ${(1 - p) * 26}px` } as React.CSSProperties;
};

/** Judul kecil di atas adegan (label serif krem dengan garis emas). */
export const SceneHeading: React.FC<{ text: string; at?: number }> = ({ text, at = 0 }) => {
  const { s, height, portrait } = useS();
  const st = useAppear(at);
  return (
    <div
      style={{
        position: "absolute",
        top: portrait ? height * 0.1 : height * 0.08,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: serif,
        fontWeight: 700,
        fontSize: 64 * s,
        color: C.krem,
        textShadow: "0 3px 12px rgba(0,0,0,0.5)",
        ...st,
      }}
    >
      {text}
      <div style={{ width: 120 * s, height: 3 * s, background: C.emas, margin: `${14 * s}px auto 0`, borderRadius: 2 }} />
    </div>
  );
};

/** Label pilar kecil (huruf kapital renggang). */
export const Kicker: React.FC<{ text: string; at?: number }> = ({ text, at = 0 }) => {
  const { s } = useS();
  const st = useAppear(at);
  return (
    <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 30 * s, letterSpacing: "0.32em", color: C.emas, textTransform: "uppercase", ...st }}>
      {text}
    </div>
  );
};

/** Partikel debu emas melayang (selalu ada gerakan). */
export const GoldDust: React.FC<{ n?: number }> = ({ n = 26 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const rx = (seed / 233280) * width;
        const ry = ((i * 7919) % 1000) / 1000 * height;
        const sp = 0.3 + ((i * 37) % 10) / 14;
        const y = (ry - frame * sp * 1.4 + height * 2) % height;
        const x = rx + Math.sin((frame + i * 20) / 40) * 14;
        const tw = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin((frame + i * 13) / 12));
        return <circle key={i} cx={x} cy={y} r={1.4 + (i % 3)} fill={C.emasMuda} opacity={tw} />;
      })}
    </svg>
  );
};
