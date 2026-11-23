import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, sans, serif } from "../brand/theme";
import { GoldText } from "../components/GoldText";
import { Tex } from "../components/Tex";
import type { KembarProps } from "../storyboard/types";
import { Kicker, clamp, easeOut, useS } from "./common";

/**
 * "Huruf kembar": satu huruf, beberapa arti. Setiap varian = kartu
 * (huruf emas | kata asal + besaran · satuan + rumus) yang muncul saat disebut.
 */
export const KembarScene: React.FC<KembarProps> = ({ kicker, judul, varian }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, height } = useS();
  const pJ = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: height * 0.1, paddingLeft: 60 * s, paddingRight: 60 * s }}>
      {kicker ? <Kicker text={kicker} /> : null}
      <div style={{ marginTop: 14 * s, opacity: pJ, scale: `${0.85 + 0.15 * pJ}` }}>
        <GoldText size={120 * s} shineAt={6}>
          {judul}
        </GoldText>
      </div>
      <div style={{ marginTop: 30 * s, width: "100%", display: "flex", flexDirection: "column", gap: 22 * s }}>
        {varian.map((v, i) => {
          const at = (v.at ?? 1 + i * 2.2) * fps;
          const p = interpolate(frame, [at, at + 14], [0, 1], { ...clamp, easing: easeOut });
          const rest = v.istilah.slice(1);
          return (
            <div
              key={i}
              style={{
                opacity: p,
                translate: `${(1 - p) * 60 * s}px 0px`,
                display: "flex",
                alignItems: "center",
                gap: 26 * s,
                padding: `${16 * s}px ${26 * s}px`,
                background: "rgba(8,24,22,0.5)",
                border: `${2 * s}px solid ${C.aksen2}`,
                borderLeft: `${10 * s}px solid ${C.emas}`,
                borderRadius: 16 * s,
              }}
            >
              <div style={{ width: 130 * s, textAlign: "center", flex: "none" }}>
                <GoldText size={130 * s} shineAt={at / 1 + 6}>
                  {v.huruf}
                </GoldText>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 70 * s, lineHeight: 1, color: C.krem }}>
                  <span style={{ color: C.emas }}>{v.istilah[0]}</span>
                  {rest}
                </div>
                <div style={{ marginTop: 8 * s, fontFamily: sans, fontWeight: 800, fontSize: 38 * s, color: C.krem }}>
                  {v.besaran} <span style={{ color: C.aksen2 }}>·</span> <span style={{ color: C.emasMuda }}>{v.satuan}</span>
                </div>
              </div>
              {v.tex ? (
                <div style={{ flex: "none" }}>
                  <Tex tex={v.tex} size={54 * s} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
