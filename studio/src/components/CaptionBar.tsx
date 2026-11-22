import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, sans } from "../brand/theme";
import type { CaptionChunk } from "../storyboard/timeline";

/**
 * Subtitle khas UDcation: bar marun bertekstur, garis emas atas-bawah,
 * karaoke per kata (sedang = emas, sudah = krem, belum = krem 55%).
 */
export const CaptionBar: React.FC<{ chunks: CaptionChunk[] }> = ({ chunks }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const s = Math.min(width, height) / 1080;
  const idx = chunks.findIndex((c, i) => frame >= c.start && frame < (chunks[i + 1]?.start ?? c.end + 12) && frame < c.end + 12);
  if (idx < 0) return null;
  const chunk = chunks[idx];
  const prev = chunks[idx - 1];
  const local = frame - chunk.start;
  // bar hanya animasi masuk bila potongan sebelumnya sudah lama selesai (jeda antar adegan)
  const contiguous = prev !== undefined && chunk.start - prev.end < 8;
  const appear = contiguous ? 1 : interpolate(local, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const textIn = interpolate(local, [0, 4], [0.35, 1], { extrapolateRight: "clamp" });
  const next = chunks[idx + 1];
  const keepsGoing = next !== undefined && next.start - chunk.end < 8;
  const vanish = keepsGoing ? 1 : interpolate(frame, [chunk.end + 4, chunk.end + 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: height * (width < height ? 0.745 : 0.8),
        translate: `-50% ${interpolate(appear, [0, 1], [10, 0])}px`,
        opacity: appear * vanish,
        width: Math.min(width * 0.8, 1100 * s),
        padding: `${22 * s}px ${34 * s}px`,
        background: `repeating-linear-gradient(45deg, rgba(255,255,255,0.035) 0 2px, transparent 2px 16px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.035) 0 2px, transparent 2px 16px), linear-gradient(180deg, ${C.merah}, ${C.marun})`,
        borderTop: `${3 * s}px solid ${C.emasTua}`,
        borderBottom: `${3 * s}px solid ${C.emasTua}`,
        boxShadow: `0 ${10 * s}px ${30 * s}px rgba(0,0,0,0.45), inset 0 ${5 * s}px 0 -${3 * s}px rgba(237,181,61,0.45), inset 0 -${5 * s}px 0 -${3 * s}px rgba(237,181,61,0.45)`,
        textAlign: "center",
        fontFamily: sans,
        fontWeight: 800,
        fontSize: 50 * s,
        lineHeight: 1.25,
        wordSpacing: `${8 * s}px`,
      }}
    >
      {chunk.words.map((w, i) => {
        const active = frame >= w.start && frame < w.end;
        const done = frame >= w.end;
        return (
          <span
            key={i}
            style={{
              color: active ? C.emas : C.krem,
              opacity: (active || done ? 1 : 0.55) * textIn,
              display: "inline-block",
              scale: active ? "1.06" : "1",
              textShadow: active ? "0 0 18px rgba(237,181,61,0.5)" : "0 2px 4px rgba(0,0,0,0.4)",
              marginRight: `${10 * s}px`,
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};
