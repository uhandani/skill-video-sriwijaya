import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { C } from "../brand/theme";
import type { Transisi } from "../storyboard/types";

type P = Record<string, never>;

/** Iris cincin emas: lingkaran bergerigi emas membesar dan membuka adegan baru. */
const GoldIris: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress }) => {
  const { width, height } = useVideoConfig();
  if (presentationDirection === "exiting") {
    return <AbsoluteFill style={{ filter: `brightness(${1 - presentationProgress * 0.35})` }}>{children}</AbsoluteFill>;
  }
  const p = presentationProgress;
  const cx = width / 2;
  const cy = height * 0.42;
  // jarak ke sudut terjauh + lebar gerigi, supaya cincin keluar layar sepenuhnya
  const maxR = Math.hypot(Math.max(cx, width - cx), Math.max(cy, height - cy)) + 60;
  const r = Math.max(1, p * p * maxR);
  const teeth = 36;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `circle(${r}px at ${cx}px ${cy}px)` }}>{children}</AbsoluteFill>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: p < 0.8 ? 1 : Math.max(0, (1 - p) / 0.2) }}>
        <g transform={`translate(${cx} ${cy}) rotate(${p * 90})`}>
          <circle r={r} fill="none" stroke={C.emas} strokeWidth={14} />
          <circle r={r + 16} fill="none" stroke={C.emasTua} strokeWidth={3} />
          {Array.from({ length: teeth }).map((_, i) => (
            <rect key={i} x={r + 6} y={-5} width={22} height={10} fill={C.emas} transform={`rotate(${(i * 360) / teeth})`} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** Fade ke perkamen: adegan lama memudar jadi sepia (kenangan/miskonsepsi). */
const Perkamen: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress }) => {
  const p = presentationProgress;
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill style={{ filter: `sepia(${p}) saturate(${1 - p * 0.6}) contrast(${1 - p * 0.2})`, opacity: 1 - Math.max(0, (p - 0.5) * 2) }}>
        {children}
      </AbsoluteFill>
    );
  }
  return <AbsoluteFill style={{ opacity: Math.max(0, (p - 0.4) / 0.6) }}>{children}</AbsoluteFill>;
};

export const goldIris = (): TransitionPresentation<P> => ({ component: GoldIris, props: {} });
export const perkamen = (): TransitionPresentation<P> => ({ component: Perkamen, props: {} });

export const presentationFor = (t: Transisi): TransitionPresentation<Record<string, unknown>> => {
  if (t === "fade") return fade() as unknown as TransitionPresentation<Record<string, unknown>>;
  if (t === "perkamen") return perkamen() as unknown as TransitionPresentation<Record<string, unknown>>;
  return goldIris() as unknown as TransitionPresentation<Record<string, unknown>>;
};
