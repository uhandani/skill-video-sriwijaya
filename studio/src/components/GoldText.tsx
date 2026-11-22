import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { serif } from "../brand/theme";

/** Teks emas foil dengan kilau menyapu saat muncul (`shineAt` frame). */
export const GoldText: React.FC<{
  children: React.ReactNode;
  size: number;
  shineAt?: number;
  weight?: number;
  font?: string;
  letterSpacing?: string;
  style?: React.CSSProperties;
}> = ({ children, size, shineAt = 0, weight = 700, font = serif, letterSpacing, style }) => {
  const frame = useCurrentFrame();
  const pos = interpolate(frame, [shineAt, shineAt + 24], [130, -30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span
      style={{
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.05,
        letterSpacing,
        backgroundImage: `linear-gradient(110deg, rgba(255,255,255,0) ${pos - 12}%, rgba(255,250,230,0.95) ${pos}%, rgba(255,255,255,0) ${pos + 12}%), linear-gradient(180deg, #F8DA88 0%, #EDB53D 52%, #B07A26 100%)`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        filter: "drop-shadow(0 6px 18px rgba(237,181,61,0.35)) drop-shadow(0 2px 2px rgba(0,0,0,0.5))",
        display: "inline-block",
        fontVariantNumeric: "lining-nums",
        ...style,
      }}
    >
      {children}
    </span>
  );
};
