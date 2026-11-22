import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, sans } from "../brand/theme";
import { Tex } from "../components/Tex";
import type { EquationProps } from "../storyboard/types";
import { SceneHeading, clamp, easeOut, useS } from "./common";

/**
 * Langkah-langkah rumus muncul berurutan; langkah lama naik & meredup.
 * Langkah terakhir bisa dibingkai emas (rumus kunci).
 */
export const EquationScene: React.FC<EquationProps & { durasi: number }> = ({ judul, langkah, finalEmas = true, size = 76, durasi }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, height, width } = useS();
  const n = langkah.length;
  const starts = langkah.map((l, i) => Math.round((l.at ?? 0.5 + (i * (durasi - 1.2)) / n) * fps));
  // tinggi baris menyesuaikan: pecahan/akar butuh ruang lebih
  const tall = (t: string) => /\\frac|\\sqrt|\^\{|_\{/.test(t);
  const rowH = (size / 76) * 190 * s;
  const shown = starts.filter((st) => frame >= st).length;
  const centerY = height * 0.42;
  return (
    <AbsoluteFill>
      {judul ? <SceneHeading text={judul} /> : null}
      {langkah.map((l, i) => {
        const p = interpolate(frame, [starts[i], starts[i] + 16], [0, 1], { ...clamp, easing: easeOut });
        if (p <= 0) return null;
        const fromLatest = Math.max(0, shown - 1 - i);
        // geser ke atas sejumlah tinggi baris-baris setelahnya
        let shift = 0;
        for (let j = i + 1; j < shown; j++) shift += rowH * (tall(langkah[j].tex) || tall(langkah[j - 1].tex) ? 1.25 : 0.95);
        const y = centerY - shift + (1 - p) * 40 * s;
        const isFinal = i === n - 1 && finalEmas;
        const boxP = interpolate(frame, [starts[i] + 10, starts[i] + 30], [0, 1], { ...clamp, easing: easeOut });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              width,
              top: y - rowH / 2,
              height: rowH,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: p * (fromLatest === 0 ? 1 : Math.max(0.15, 0.55 - (fromLatest - 1) * 0.25)),
              scale: fromLatest === 0 ? "1" : "0.82",
            }}
          >
            <div
              style={{
                position: "relative",
                padding: `${18 * s}px ${44 * s}px`,
                border: isFinal ? `${4 * s}px solid rgba(237,181,61,${boxP})` : "none",
                boxShadow: isFinal ? `0 0 ${40 * s * boxP}px rgba(237,181,61,${0.35 * boxP}), inset 0 0 ${30 * s * boxP}px rgba(237,181,61,${0.12 * boxP})` : "none",
                background: isFinal ? `rgba(20,24,51,${0.55 * boxP})` : "transparent",
              }}
            >
              <Tex tex={l.tex} size={size * s} color={C.krem} />
            </div>
            {l.catatan ? (
              <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 38 * s, color: C.krem, opacity: 0.8, marginTop: 10 * s }}>{l.catatan}</div>
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
