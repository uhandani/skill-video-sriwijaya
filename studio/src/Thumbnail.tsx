import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { applyTheme, TEMA, temaDariPilar } from "./brand/tema";
import { C, sans, serif } from "./brand/theme";
import { Background } from "./components/Background";
import { DeltaLogo } from "./components/DeltaLogo";
import { Elemen, IlustrasiDefs } from "./components/Ilustrasi";
import { TumpalFrame } from "./components/TumpalFrame";
import type { Storyboard } from "./storyboard/types";
import { Tex } from "./components/Tex";

/** Ukuran huruf agar baris terpanjang muat di lebar `w` (lebar rata-rata huruf Cormorant ≈ 0,5em). */
const fitSize = (text: string, w: number, max: number) => {
  const longest = Math.max(...text.replace(/\*/g, "").split("\n").map((l) => l.length));
  return Math.min(max, w / (0.5 * longest));
};

/** "Kok *Bisa* Terapung?" → kata ber-*bintang* jadi emas. */
const Hook: React.FC<{ text: string; size: number; align: "center" | "left" }> = ({ text, size, align }) => (
  <div
    style={{
      fontFamily: serif,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.0,
      textAlign: align,
      color: C.krem,
      whiteSpace: "pre-line",
      textShadow: "0 6px 0 rgba(0,0,0,0.35), 0 10px 30px rgba(0,0,0,0.6)",
      letterSpacing: "-0.01em",
      fontVariantNumeric: "lining-nums",
    }}
  >
    {text.split(/(\*[^*]+\*)/g).map((part, i) =>
      part.startsWith("*") ? (
        <span
          key={i}
          style={{
            backgroundImage: "linear-gradient(180deg,#FBE3A0 0%,#EDB53D 55%,#B07A26 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textShadow: "none",
            filter: "drop-shadow(0 6px 0 rgba(0,0,0,0.35)) drop-shadow(0 0 24px rgba(237,181,61,0.45))",
          }}
        >
          {part.slice(1, -1)}
        </span>
      ) : (
        <span key={i}>{part}</span>
      ),
    )}
  </div>
);

const Badge: React.FC<{ text: string; s: number }> = ({ text, s }) => (
  <div
    style={{
      display: "inline-block",
      padding: `${10 * s}px ${26 * s}px`,
      background: C.marun,
      border: `${3 * s}px solid ${C.emas}`,
      borderRadius: 999,
      fontFamily: sans,
      fontWeight: 800,
      fontSize: 30 * s,
      letterSpacing: "0.22em",
      color: C.krem,
      textTransform: "uppercase",
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
    }}
  >
    {text}
  </div>
);

const Art: React.FC<{ sb: Storyboard; size: number }> = ({ sb, size }) => (
  <div style={{ position: "relative", width: size, height: size }}>
  <svg width={size} height={size} viewBox="0 0 1000 1000" style={{ overflow: "visible", position: "absolute" }}>
    <IlustrasiDefs />
    <circle cx={500} cy={520} r={420} fill={C.emas} opacity={0.08} />
    <circle cx={500} cy={520} r={420} fill="none" stroke={C.emas} strokeWidth={6} strokeDasharray="4 18" opacity={0.6} />
    {(sb.thumbnail?.elemen ?? []).map((el, i) => (
      <Elemen key={i} el={{ ...el, at: 0 }} frame={60} fps={30} />
    ))}
  </svg>
    {sb.thumbnail?.tex ? (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", top: size * 0.04 }}>
        <Tex tex={sb.thumbnail.tex} size={size * 0.13} />
      </div>
    ) : null}
  </div>
);

const Brand: React.FC<{ s: number }> = ({ s }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 * s }}>
    <DeltaLogo size={70 * s} isStatic id="thumb-logo" />
    <span style={{ fontFamily: serif, fontWeight: 600, fontSize: 46 * s, letterSpacing: "0.16em" }}>
      <span style={{ color: C.emas }}>UD</span>
      <span style={{ color: C.krem }}>CATION</span>
    </span>
  </div>
);

/** Thumbnail video: hook besar + ilustrasi + badge pilar + logo, warna sesuai pilar. */
export const Thumbnail: React.FC<{ storyboard: Storyboard }> = ({ storyboard: sb }) => {
  applyTheme(sb.pilar);
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  const s = Math.min(width, height) / 1080;
  const nama = TEMA[temaDariPilar(sb.pilar)].nama;
  const hook = sb.thumbnail?.hook ?? sb.judul;
  if (portrait) {
    return (
      <AbsoluteFill>
        <Background variant="navy" />
        <TumpalFrame opacity={0.55} />
        <div style={{ position: "absolute", left: 40 * s, top: height * 0.33 }}>
          <Art sb={sb} size={1000 * s} />
        </div>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 140 * s, paddingLeft: 70 * s, paddingRight: 70 * s }}>
          <Badge text={nama} s={s} />
          <div style={{ marginTop: 40 * s }}>
            <Hook text={hook} size={fitSize(hook, 940, 156) * s} align="center" />
          </div>
          {sb.thumbnail?.sub ? (
            <div style={{ marginTop: 26 * s, fontFamily: sans, fontWeight: 800, fontSize: 44 * s, color: C.emasMuda, textAlign: "center", textShadow: "0 3px 10px rgba(0,0,0,.6)" }}>
              {sb.thumbnail.sub}
            </div>
          ) : null}
        </AbsoluteFill>
        <div style={{ position: "absolute", bottom: 110 * s, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Brand s={s * 1.25} />
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Background variant="navy" />
      <div style={{ position: "absolute", right: -40 * s, top: 0, bottom: 0, display: "flex", alignItems: "center" }}>
        <Art sb={sb} size={height * 1.0} />
      </div>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-start", paddingLeft: 90 * s, width: width * 0.6 }}>
        <Badge text={nama} s={s} />
        <div style={{ marginTop: 30 * s }}>
          <Hook text={hook} size={fitSize(hook, 1050, 130) * s} align="left" />
        </div>
        {sb.thumbnail?.sub ? (
          <div style={{ marginTop: 22 * s, fontFamily: sans, fontWeight: 800, fontSize: 40 * s, color: C.krem, opacity: 0.9 }}>{sb.thumbnail.sub}</div>
        ) : null}
        <div style={{ marginTop: 40 * s }}>
          <Brand s={s * 0.9} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
