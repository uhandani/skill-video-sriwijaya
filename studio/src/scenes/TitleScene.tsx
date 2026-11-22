import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, serif } from "../brand/theme";
import { DeltaLogo } from "../components/DeltaLogo";
import { GoldText } from "../components/GoldText";
import type { TitleProps } from "../storyboard/types";
import { Kicker, clamp, easeOut, useAppear, useS } from "./common";

/** Hook / judul: kicker pilar, judul emas, sub, tanda tanya emas berdenyut. */
export const TitleScene: React.FC<TitleProps> = ({ kicker, judul, sub, tandaTanya, logo }) => {
  const frame = useCurrentFrame();
  const { s, height } = useS();
  const subSt = useAppear(26);
  const q = interpolate(frame, [30, 48], [0, 1], { ...clamp, easing: easeOut });
  const pulse = 1 + 0.04 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", top: height * 0.08, bottom: height * 0.3, height: "auto", paddingLeft: 90 * s, paddingRight: 90 * s, textAlign: "center" }}>
      {logo ? (
        <div style={{ marginBottom: 30 * s }}>
          <DeltaLogo size={150 * s} id="title-logo" />
        </div>
      ) : null}
      {kicker ? <Kicker text={kicker} /> : null}
      <div style={{ marginTop: 26 * s, ...useAppear(6, 18) }}>
        <GoldText size={judul.length > 40 ? 84 * s : 104 * s} shineAt={20}>
          {judul}
        </GoldText>
      </div>
      {sub ? (
        <div style={{ marginTop: 30 * s, fontFamily: serif, fontWeight: 600, fontSize: 52 * s, color: C.krem, lineHeight: 1.25, ...subSt }}>{sub}</div>
      ) : null}
      {tandaTanya ? (
        <div style={{ marginTop: 20 * s, opacity: q, scale: `${(0.6 + 0.4 * q) * pulse}` }}>
          <GoldText size={330 * s} shineAt={50}>
            ?
          </GoldText>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
