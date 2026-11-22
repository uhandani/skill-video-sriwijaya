import React from "react";
import { AbsoluteFill } from "remotion";
import { C, sans, serif } from "../brand/theme";
import { DeltaLogo } from "../components/DeltaLogo";
import { Tex } from "../components/Tex";
import type { OutroProps } from "../storyboard/types";
import { useAppear, useS } from "./common";

/** Penutup: kesimpulan + rumus emas + logo Δ Kawung + wordmark + ajakan. */
export const OutroScene: React.FC<OutroProps> = ({ kesimpulan, tex, ajakan = "Ikuti UDcation untuk seri berikutnya" }) => {
  const { s, height } = useS();
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: height * 0.13, paddingLeft: 90 * s, paddingRight: 90 * s, textAlign: "center" }}>
      <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 64 * s, color: C.krem, lineHeight: 1.2, ...useAppear(0, 16) }}>{kesimpulan}</div>
      {tex ? (
        <div style={{ marginTop: 30 * s, ...useAppear(14, 16) }}>
          <Tex tex={tex} size={84 * s} />
        </div>
      ) : null}
      <div style={{ marginTop: 70 * s }}>
        <DeltaLogo size={230 * s} delay={30} id="outro-logo" />
      </div>
      <div style={{ marginTop: 20 * s, fontFamily: serif, fontWeight: 600, fontSize: 68 * s, letterSpacing: "0.18em", ...useAppear(64, 16) }}>
        <span style={{ color: C.emas }}>UD</span>
        <span style={{ color: C.krem }}>CATION</span>
      </div>
      <div style={{ marginTop: 10 * s, fontFamily: sans, fontWeight: 800, fontSize: 26 * s, letterSpacing: "0.36em", color: C.krem, opacity: 0.7, ...useAppear(72, 16) }}>
        ILMU SEMESTA · RASA NUSANTARA
      </div>
      <div style={{ marginTop: 26 * s, fontFamily: sans, fontWeight: 800, fontSize: 32 * s, color: C.emas, ...useAppear(84, 16) }}>{ajakan}</div>
    </AbsoluteFill>
  );
};
