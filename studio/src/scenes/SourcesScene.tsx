import React from "react";
import { AbsoluteFill } from "remotion";
import { C, sans, serif } from "../brand/theme";
import type { SumberProps } from "../storyboard/types";
import { useAppear, useS } from "./common";

const Item: React.FC<{ i: number; text: string; s: number }> = ({ i, text, s }) => {
  const st = useAppear(10 + i * 8, 14);
  return (
    <div style={{ display: "flex", gap: 18 * s, alignItems: "baseline", ...st }}>
      <span style={{ fontFamily: serif, fontWeight: 700, fontSize: 40 * s, color: C.emas, minWidth: 34 * s }}>{i + 1}</span>
      <span style={{ fontFamily: sans, fontWeight: 600, fontSize: 31 * s, lineHeight: 1.35, color: C.krem }}>{text}</span>
    </div>
  );
};

/** Daftar sumber riset — tampil setelah outro. */
export const SourcesScene: React.FC<SumberProps> = ({ judul = "Sumber riset", daftar, catatan }) => {
  const { s, height } = useS();
  return (
    <AbsoluteFill style={{ paddingTop: height * 0.1, paddingLeft: 90 * s, paddingRight: 90 * s }}>
      <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 70 * s, color: C.krem, textAlign: "center", ...useAppear(0, 14) }}>
        {judul}
        <div style={{ width: 120 * s, height: 3 * s, background: C.emas, margin: `${14 * s}px auto 0`, borderRadius: 2 }} />
      </div>
      <div style={{ marginTop: 50 * s, display: "flex", flexDirection: "column", gap: 26 * s }}>
        {daftar.map((d, i) => (
          <Item key={i} i={i} text={d} s={s} />
        ))}
      </div>
      {catatan ? (
        <div
          style={{
            marginTop: 40 * s,
            fontFamily: sans,
            fontWeight: 600,
            fontSize: 28 * s,
            color: C.krem,
            opacity: 0.7,
            fontStyle: "italic",
            ...useAppear(20 + daftar.length * 8, 14),
          }}
        >
          {catatan}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
