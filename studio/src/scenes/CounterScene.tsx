import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, sans, serif } from "../brand/theme";
import { GoldText } from "../components/GoldText";
import type { CounterProps } from "../storyboard/types";
import { SceneHeading, clamp, useAppear, useS } from "./common";

/** Angka besar emas yang berhitung naik + label kecil di bawahnya. */
export const CounterScene: React.FC<CounterProps> = ({ from, to, desimal = 0, satuan, label, judul }) => {
  const frame = useCurrentFrame();
  const { s, height } = useS();
  const v = interpolate(frame, [8, 50], [from, to], { ...clamp, easing: Easing.bezier(0.2, 0.8, 0.2, 1) });
  const txt = v.toLocaleString("id-ID", { minimumFractionDigits: desimal, maximumFractionDigits: desimal });
  const lab = useAppear(48);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: height * 0.3 }}>
      {judul ? <SceneHeading text={judul} /> : null}
      <div style={{ display: "flex", alignItems: "baseline", gap: 18 * s }}>
        <GoldText size={220 * s} shineAt={50}>
          {txt}
        </GoldText>
        {satuan ? <span style={{ fontFamily: serif, fontWeight: 700, fontSize: 80 * s, color: C.emas }}>{satuan}</span> : null}
      </div>
      {label ? (
        <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 44 * s, color: C.krem, marginTop: 12 * s, textAlign: "center", padding: `0 ${90 * s}px`, ...lab }}>
          {label}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
