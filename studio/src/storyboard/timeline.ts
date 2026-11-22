import type { Storyboard, Transisi } from "./types";

export const FPS = 30;
/** jeda dari awal adegan sampai suara mulai (frame) */
export const VO_LEAD = 9;
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
    const t = timings[i];
    // 1) waktu kata: dari voice-over (presisi) atau estimasi rata
    let timed: CaptionWord[];
    if (s.vo?.words?.length) {
      const base = t.start + VO_LEAD;
      timed = s.vo.words.map((w) => ({ w: w.w, start: Math.round(base + w.start * FPS), end: Math.round(base + w.end * FPS) }));
    } else {
      const words = s.narasi.split(/\s+/).filter(Boolean);
      if (!words.length) return;
      const winStart = t.start + VO_LEAD;
      const winEnd = t.start + t.dur - Math.max(t.transOut, 10);
      const per = (winEnd - winStart) / words.length;
      timed = words.map((w, k) => ({ w, start: Math.round(winStart + k * per), end: Math.round(winStart + (k + 1) * per) }));
    }
    // 2) pecah jadi potongan 2–5 kata (memotong di tanda baca)
    let cur: CaptionWord[] = [];
    const groups: CaptionWord[][] = [];
    timed.forEach((cw) => {
      cur.push(cw);
      const punct = /[,.;:!?…]$/.test(cw.w);
      if (cur.length >= 5 || (punct && cur.length >= 2) || (cur.length >= 4 && cw.w.length > 7)) {
        groups.push(cur);
        cur = [];
      }
    });
    if (cur.length) {
      if (cur.length === 1 && groups.length) groups[groups.length - 1].push(cur[0]);
      else groups.push(cur);
    }
    groups.forEach((g) => chunks.push({ start: g[0].start, end: g[g.length - 1].end, words: g }));
  });
  return chunks;
}
