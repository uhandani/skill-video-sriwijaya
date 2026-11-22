import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, serif } from "../brand/theme";
import { Elemen, IlustrasiDefs } from "../components/Ilustrasi";
import type { IlustrasiProps } from "../storyboard/types";
import { SceneHeading, useAppear, useS } from "./common";

/**
 * Adegan ilustrasi bergaya Sriwijaya: elemen (kapal, candi, matahari, …) disusun bebas
 * di kanvas 1000 lebar, muncul bergiliran, bergerak halus. Bisa diberi label teks.
 */
export const IllustrationScene: React.FC<IlustrasiProps> = ({ judul, elemen, label, garisLaut }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width, height } = useS();
  const H = (1000 * height) / width;
  return (
    <AbsoluteFill>
      <svg width={width} height={height} viewBox={`0 0 1000 ${H}`} style={{ position: "absolute", inset: 0 }}>
        <IlustrasiDefs />
        {garisLaut !== undefined ? (
          <g>
            <rect x={0} y={garisLaut} width={1000} height={H - garisLaut} fill={C.cokelat} opacity={0.85} />
            <path d={`M0 ${garisLaut} H1000`} stroke={C.krem} strokeWidth={4} />
            {Array.from({ length: 6 }).map((_, r) =>
              Array.from({ length: 9 }).map((__, c) => (
                <path
                  key={`${r}-${c}`}
                  d={`M${c * 120 + (r % 2) * 60 - 20} ${garisLaut + 40 + r * 60} q14 -16 28 0 t28 0`}
                  fill="none"
                  stroke={C.krem}
                  strokeWidth={2.5}
                  opacity={0.35}
                  transform={`translate(${Math.sin((frame + r * 20) / 25) * 10} 0)`}
                />
              )),
            )}
          </g>
        ) : null}
        {elemen.map((el, i) => (
          <Elemen key={i} el={el} frame={frame} fps={fps} />
        ))}
        {(label ?? []).map((lb, i) => (
          <Label key={i} {...lb} />
        ))}
      </svg>
      {judul ? <SceneHeading text={judul} /> : null}
    </AbsoluteFill>
  );
};

const Label: React.FC<{ teks: string; x: number; y: number; at?: number; ukuran?: number; emas?: boolean }> = ({ teks, x, y, at = 0, ukuran = 52, emas }) => {
  const st = useAppear(at * 30, 14);
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontFamily={serif}
      fontWeight={700}
      fontSize={ukuran}
      fill={emas ? C.emas : C.krem}
      style={{ ...st, filter: "drop-shadow(0 3px 6px rgba(0,0,0,.6))" }}
    >
      {teks}
    </text>
  );
};
