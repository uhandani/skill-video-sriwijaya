import type { Storyboard, Transisi } from "./types";

export const FPS = 30;
export const TRANS_FRAMES: Record<Transisi, number> = { iris: 22, fade: 15, perkamen: 24, none: 0 };

export type SceneTiming = { start: number; dur: number; transOut: number };

/** Hitung frame awal tiap adegan (memperhitungkan tumpang-tindih transisi). */
export function sceneTimings(sb: Storyboard): SceneTiming[] {
  const out: SceneTiming[] = [];
  let cursor = 0;
  sb.scenes.forEach((s, i) => {
    const dur = Math.round(s.durasi * FPS);
    const isLast = i === sb.scenes.length - 1;
    const transOut = isLast ? 0 : TRANS_FRAMES[s.transisi ?? "iris"];
    out.push({ start: cursor, dur, transOut });
    cursor += dur - transOut;
  });
  return out;
}

export function totalFrames(sb: Storyboard): number {
  const t = sceneTimings(sb);
  const last = t[t.length - 1];
  return last ? last.start + last.dur : FPS;
}

export type CaptionWord = { w: string; start: number; end: number };
export type CaptionChunk = { start: number; end: number; words: CaptionWord[] };

/**
 * Subtitle dari narasi: kata dibagi rata di jendela tampil adegan,
 * dipotong per 2–5 kata (memotong di tanda baca bila ada).
 */
export function buildCaptions(sb: Storyboard): CaptionChunk[] {
  const timings = sceneTimings(sb);
  const chunks: CaptionChunk[] = [];
  sb.scenes.forEach((s, i) => {
    const words = s.narasi.split(/\s+/).filter(Boolean);
    if (!words.length) return;
    const t = timings[i];
    const lead = 8; // jeda sebelum bicara
    const winStart = t.start + lead;
    const winEnd = t.start + t.dur - Math.max(t.transOut, 10);
    const per = (winEnd - winStart) / words.length;
    // pecah jadi potongan
    const groups: string[][] = [];
    let cur: string[] = [];
    words.forEach((w) => {
      cur.push(w);
      const punct = /[,.;:!?…]$/.test(w);
      if (cur.length >= 5 || (punct && cur.length >= 2) || (cur.length >= 4 && w.length > 7)) {
        groups.push(cur);
        cur = [];
      }
    });
    if (cur.length) {
      if (cur.length === 1 && groups.length) groups[groups.length - 1].push(cur[0]);
      else groups.push(cur);
    }
    let k = 0;
    groups.forEach((g) => {
      const cw: CaptionWord[] = g.map((w) => {
        const st = winStart + k * per;
        k++;
        return { w, start: Math.round(st), end: Math.round(st + per) };
      });
      chunks.push({ start: cw[0].start, end: cw[cw.length - 1].end, words: cw });
    });
  });
  return chunks;
}
