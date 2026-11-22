import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { C } from "../brand/theme";

/**
 * Rumus KaTeX. Bagian penting dibungkus \g{...} → emas berpendar.
 * Contoh: "\\g{a^2 + b^2} = c^2"
 */
export const Tex: React.FC<{ tex: string; size: number; color?: string; style?: React.CSSProperties }> = ({
  tex,
  size,
  color = C.krem,
  style,
}) => {
  const html = useMemo(
    () =>
      katex.renderToString(tex.replace(/\\g\{/g, "\\htmlClass{ud-gold}{"), {
        throwOnError: false,
        displayMode: true,
        trust: true,
        strict: false,
      }),
    [tex],
  );
  return (
    <div style={{ fontSize: size, color, ...style }}>
      <style>{`.ud-gold{color:${C.emas};text-shadow:0 0 22px rgba(237,181,61,.55)} .katex-display{margin:0}`}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
