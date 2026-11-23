import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, sans, serif } from "../brand/theme";
import { GoldText } from "../components/GoldText";
import { Tex } from "../components/Tex";
import type { LambangProps } from "../storyboard/types";
import { Kicker, clamp, easeOut, useS } from "./common";

const momenAt = (p: LambangProps, nama: string, def: number) => p.momen?.find((m) => m.nama === nama)?.at ?? def;

/**
 * Kartu lambang besaran: huruf emas raksasa → terurai jadi kata asalnya
 * (huruf pertama tetap emas) → bahasa asal & arti → besaran, satuan, rumus.
 */
export const LambangScene: React.FC<LambangProps> = (props) => {
  const { huruf, kata, asal, arti, besaran, satuan, tex, status = "jelas", kicker } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, height } = useS();
  const tUrai = momenAt(props, "urai", 1.2) * fps;
  const tInfo = momenAt(props, "info", 2.6) * fps;
  const tRumus = momenAt(props, "rumus", 4.2) * fps;

  const pIn = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: easeOut });
  const pUrai = interpolate(frame, [tUrai, tUrai + 14], [0, 1], { ...clamp, easing: easeOut });
  const rest = kata.slice(huruf.length);
  const shown = Math.floor(interpolate(frame, [tUrai + 4, tUrai + 4 + rest.length * 2.2], [0, rest.length], clamp));
  const info = (at: number) => {
    const p = interpolate(frame, [at, at + 14], [0, 1], { ...clamp, easing: easeOut });
    return { opacity: p, translate: `0px ${(1 - p) * 20}px` };
  };
  const wordSize = kata.length > 11 ? 128 : 160;

  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: height * 0.13, paddingLeft: 70 * s, paddingRight: 70 * s, textAlign: "center" }}>
      {kicker ? <Kicker text={kicker} /> : null}
      <div style={{ position: "relative", height: 440 * s, width: "100%", marginTop: 20 * s }}>
        {/* huruf raksasa */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: pIn * (1 - pUrai),
            scale: `${(0.7 + 0.3 * pIn) * (1 - 0.4 * pUrai)}`,
          }}
        >
          <GoldText size={420 * s} shineAt={8}>
            {huruf}
          </GoldText>
        </div>
        {/* kata asal */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: pUrai }}>
          <span style={{ fontFamily: serif, fontWeight: 700, fontSize: wordSize * s, lineHeight: 1 }}>
            <GoldText size={wordSize * s * 1.15} shineAt={tUrai + 10}>
              {huruf}
            </GoldText>
            <span style={{ color: C.krem, textShadow: "0 4px 14px rgba(0,0,0,.5)" }}>{rest.slice(0, shown)}</span>
            <span style={{ color: "transparent" }}>{rest.slice(shown)}</span>
          </span>
        </div>
      </div>
      {/* asal kata */}
      <div style={{ ...info(tInfo), marginTop: 6 * s, fontFamily: sans, fontWeight: 600, fontSize: 48 * s, color: C.krem, lineHeight: 1.35 }}>
        {asal} <span style={{ fontStyle: "italic", fontWeight: 800, color: C.emasMuda }}>{arti}</span>
        {status === "konon" ? (
          <div style={{ marginTop: 10 * s, display: "inline-block", padding: `${4 * s}px ${16 * s}px`, border: `${2 * s}px solid ${C.emas}`, borderRadius: 999, fontSize: 28 * s, fontWeight: 800, color: C.emas, letterSpacing: "0.12em" }}>
            KONON · BELUM PASTI
          </div>
        ) : null}
      </div>
      {/* besaran & satuan */}
      <div style={{ ...info(tInfo + 10), marginTop: 34 * s, display: "flex", gap: 22 * s, justifyContent: "center", flexWrap: "wrap" }}>
        <Pill s={s} label="besaran" value={besaran} />
        {satuan ? <Pill s={s} label="satuan" value={satuan} /> : null}
      </div>
      {tex ? (
        <div style={{ ...info(tRumus), marginTop: 26 * s }}>
          <Tex tex={tex} size={96 * s} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Pill: React.FC<{ s: number; label: string; value: string }> = ({ s, label, value }) => (
  <div
    style={{
      padding: `${10 * s}px ${24 * s}px`,
      background: "rgba(10,20,20,0.45)",
      border: `${2 * s}px solid ${C.aksen2}`,
      borderRadius: 14 * s,
      fontFamily: sans,
      color: C.krem,
    }}
  >
    <div style={{ fontSize: 24 * s, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: C.aksen2 }}>{label}</div>
    <div style={{ fontSize: 48 * s, fontWeight: 800 }}>{value}</div>
  </div>
);
