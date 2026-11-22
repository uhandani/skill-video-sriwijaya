import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../brand/theme";
import { motif as motifAktif } from "../brand/tema";

export type BgVariant = "navy" | "cokelat" | "perkamen" | "kayu";

const baseOf = (variant: BgVariant): { bg: string; motif: string; op: number } => {
  switch (variant) {
    case "navy":
      return { bg: `radial-gradient(ellipse at 50% 38%, ${C.navyTerang} 0%, ${C.navy} 45%, ${C.navyDalam} 100%)`, motif: C.krem, op: 0.09 };
    case "cokelat":
      return { bg: `radial-gradient(ellipse at 50% 40%, ${C.cokelatTerang} 0%, ${C.cokelat} 45%, ${C.cokelatGelap} 100%)`, motif: "#F1D6A8", op: 0.1 };
    case "perkamen":
      return { bg: `radial-gradient(ellipse at 50% 40%, #E6DAC2 0%, ${C.perkamen} 60%, #A8977C 100%)`, motif: "#6B5A44", op: 0.12 };
    default:
      return { bg: `linear-gradient(100deg, #3A2112 0%, #5A3420 30%, #4A2A16 55%, #5E3822 80%, #3A2112 100%)`, motif: "#E0B98A", op: 0.06 };
  }
};

/** Mega mendung: awan bergulung berlapis (Cirebon) — motif Ruang Semesta. */
const MegaMendungTile: React.FC<{ id: string; color: string }> = ({ id, color }) => {
  const cloud = (x: number, y: number) =>
    [0, 1, 2].map((k) => {
      const r = 34 - k * 9;
      return (
        <path
          key={k}
          d={`M${x - r * 1.9} ${y} a${r * 0.95} ${r * 0.95} 0 0 1 ${r * 1.9} 0 a${r * 0.7} ${r * 0.7} 0 0 1 ${r * 1.4} 0 a${r * 0.5} ${r * 0.5} 0 0 1 ${r} 0`}
          fill="none"
          stroke={color}
          strokeWidth={1.8}
        />
      );
    });
  return (
    <pattern id={id} width={180} height={120} patternUnits="userSpaceOnUse">
      {cloud(70, 50)}
      {cloud(160, 110)}
      {cloud(-20, 110)}
    </pattern>
  );
};

/** Parang: rantai huruf S miring berulang (motif keraton) — motif Ruang Nusantara. */
const ParangTile: React.FC<{ id: string; color: string }> = ({ id, color }) => (
  <pattern id={id} width={60} height={60} patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
    <path d="M0 30 C10 10 20 10 30 30 S50 50 60 30" fill="none" stroke={color} strokeWidth={2} />
    <path d="M0 0 H60 M0 60 H60" stroke={color} strokeWidth={1.2} strokeDasharray="3 5" />
    <circle cx={15} cy={22} r={2} fill={color} />
    <circle cx={45} cy={38} r={2} fill={color} />
  </pattern>
);

/** Motif kawung: 4 kelopak per sel menunjuk ke pusat sel. */
const lens = (x: number, y: number, d: "\\" | "/", s: number) =>
  d === "\\"
    ? `M${x},${y} A${s},${s} 0 0 0 ${x + s},${y + s} A${s},${s} 0 0 0 ${x},${y} Z`
    : `M${x + s},${y} A${s},${s} 0 0 0 ${x},${y + s} A${s},${s} 0 0 0 ${x + s},${y} Z`;

const KawungTile: React.FC<{ id: string; color: string; size: number }> = ({ id, color, size }) => {
  const h = size / 2;
  return (
    <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
      <g fill="none" stroke={color} strokeWidth={1.6}>
        <path d={lens(0, 0, "\\", h)} />
        <path d={lens(h, 0, "/", h)} />
        <path d={lens(0, h, "/", h)} />
        <path d={lens(h, h, "\\", h)} />
        <circle cx={h} cy={h} r={2.4} fill={color} />
      </g>
    </pattern>
  );
};

const WeaveTile: React.FC<{ id: string; color: string }> = ({ id, color }) => (
  <pattern id={id} width={18} height={18} patternUnits="userSpaceOnUse">
    <path d="M0 18 L18 0 M-4 4 L4 -4 M14 22 L22 14" stroke={color} strokeWidth={1.4} />
    <circle cx={9} cy={9} r={1.2} fill={color} />
  </pattern>
);

const NotebookTile: React.FC<{ id: string; color: string }> = ({ id, color }) => (
  <pattern id={id} width={54} height={54} patternUnits="userSpaceOnUse">
    <path d="M54 0 L0 0 0 54" fill="none" stroke={color} strokeWidth={1} />
  </pattern>
);

/**
 * Latar bertekstur khas UDcation: warna dasar + motif (kawung/tenun/kertas)
 * + butiran film + vignette + cahaya hangat. Selalu bergerak pelan.
 */
export const Background: React.FC<{ variant?: BgVariant; motif?: boolean }> = ({
  variant = "navy",
  motif = true,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const b = baseOf(variant);
  const m = motifAktif();
  const id = `motif-${variant}`;
  return (
    <AbsoluteFill style={{ background: b.bg, overflow: "hidden" }}>
      {motif ? (
        <AbsoluteFill
          style={{
            scale: interpolate(frame, [0, 600], [1.04, 1.1]),
            translate: interpolate(frame, [0, 600], ["0px 0px", "-30px -50px"]),
          }}
        >
          <svg width={width} height={height} style={{ opacity: b.op }}>
            <defs>
              {(variant === "navy" || (variant === "cokelat" && m !== "kawung")) && m === "kawung" ? <KawungTile id={id} color={b.motif} size={96} /> : null}
              {(variant === "navy" || variant === "cokelat") && m === "megamendung" ? <MegaMendungTile id={id} color={b.motif} /> : null}
              {(variant === "navy" || variant === "cokelat") && m === "parang" ? <ParangTile id={id} color={b.motif} /> : null}
              {variant === "cokelat" && m === "kawung" ? <WeaveTile id={id} color={b.motif} /> : null}
              {variant === "perkamen" ? <NotebookTile id={id} color={b.motif} /> : null}
              {variant === "kayu" ? <WeaveTile id={id} color={b.motif} /> : null}
            </defs>
            <rect width={width} height={height} fill={`url(#${id})`} />
          </svg>
        </AbsoluteFill>
      ) : null}
      {/* serat kain / kertas */}
      <svg width={width} height={height} style={{ position: "absolute", opacity: variant === "perkamen" ? 0.35 : 0.16, mixBlendMode: "overlay" }}>
        <filter id={`grain-${variant}`}>
          <feTurbulence type="fractalNoise" baseFrequency={variant === "kayu" ? "0.012 0.4" : "0.85"} numOctaves={2} seed={frame % 6} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={width} height={height} filter={`url(#grain-${variant})`} />
      </svg>
      {/* cahaya hangat (light leak) bergerak pelan */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${interpolate(frame, [0, 600], [12, 30])}% ${interpolate(frame, [0, 600], [8, 14])}%, rgba(255,196,110,0.22) 0%, rgba(255,196,110,0) 45%)`,
          mixBlendMode: "screen",
        }}
      />
      {/* vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};
