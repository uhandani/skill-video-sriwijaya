// Geometri logo Δ Kawung. Salinan TypeScript dari branding/tools/delta.mjs —
// jika bentuk logo diubah, ubah keduanya.

export const R = 100;
export const SIDE = R * Math.sqrt(3);
export const VERTS: [number, number][] = [
  [0, -R],
  [R * Math.sin(Math.PI / 3), R / 2],
  [-R * Math.sin(Math.PI / 3), R / 2],
];
export const DOT_R = 10;
export const VIEWBOX = "-110 -112 220 198";

type Spec = [number, number, number];
export const SPEC_MAIN: Spec = [0.04, 0.16, 6];

const rad = (c: number, h: number) => (c * c) / 4 / (2 * h) + h / 2;
const f = (n: number) => Number(n.toFixed(2));

export function petalPath(
  A: [number, number],
  B: [number, number],
  ho: number,
  hi: number,
  gap: number,
) {
  const dx = B[0] - A[0];
  const dy = B[1] - A[1];
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const a = [A[0] + ux * gap, A[1] + uy * gap];
  const b = [B[0] - ux * gap, B[1] - uy * gap];
  const c = len - 2 * gap;
  const seg = (q: number[], h: number) =>
    h <= 0
      ? `L${f(q[0])},${f(q[1])}`
      : `A${f(rad(c, h))},${f(rad(c, h))} 0 0 1 ${f(q[0])},${f(q[1])}`;
  return `M${f(a[0])},${f(a[1])} ${seg(b, ho)} ${seg(a, hi)} Z`;
}

export const PETALS: string[] = VERTS.map((_, i) =>
  petalPath(
    VERTS[i],
    VERTS[(i + 1) % 3],
    SPEC_MAIN[0] * SIDE,
    SPEC_MAIN[1] * SIDE,
    SPEC_MAIN[2],
  ),
);
