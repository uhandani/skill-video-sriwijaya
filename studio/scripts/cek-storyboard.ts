/**
 * Pemeriksa storyboard UDcation. Jalankan: npm run cek
 * Memeriksa aturan yang bisa dicek otomatis dari checklist gaya.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { Storyboard } from "../src/storyboard/types";
import { FPS, TRANS_FRAMES, VO_LEAD, totalFrames } from "../src/storyboard/timeline";

const DIR = join(__dirname, "..", "src", "storyboards");
const TYPES = ["title", "diagram", "equation", "graph", "projectile", "counter", "outro", "sumber", "ilustrasi", "lambang", "kembar"];
const BG = ["navy", "cokelat", "perkamen", "kayu"];
let gagal = 0;

for (const f of readdirSync(DIR).filter((x) => x.endsWith(".json"))) {
  const sb = JSON.parse(readFileSync(join(DIR, f), "utf8")) as Storyboard;
  const err: string[] = [];
  const warn: string[] = [];
  const kpd = sb.kpd ?? 2.6;
  if (!sb.id || !/^[A-Za-z0-9-]+$/.test(sb.id)) err.push("id wajib, hanya huruf/angka/tanda hubung");
  if (!sb.sumber?.length) err.push("sumber wajib diisi (akurasi)");
  if (!sb.kurikulum) warn.push("kurikulum kosong (dipakai ulang di platform)");
  const ids = new Set<string>();
  sb.scenes.forEach((s, i) => {
    if (ids.has(s.id)) err.push(`id adegan ganda: ${s.id}`);
    ids.add(s.id);
    if (!TYPES.includes(s.type)) err.push(`${s.id}: type tidak dikenal (${s.type})`);
    if (s.bg && !BG.includes(s.bg)) err.push(`${s.id}: bg tidak dikenal (${s.bg})`);
    const kata = s.narasi.split(/\s+/).filter(Boolean).length;
    const trans = i < sb.scenes.length - 1 ? TRANS_FRAMES[s.transisi ?? "iris"] / FPS : 0;
    if (s.vo) {
      const perluVo = VO_LEAD / FPS + s.vo.durasi + trans + 0.2;
      if (s.durasi < perluVo) err.push(`${s.id}: suara ${s.vo.durasi}s tidak muat di ${s.durasi}s — jalankan npm run sinkron`);
    } else {
      const perlu = kata / kpd + 0.3 + Math.max(trans, 0.35);
      if (s.durasi < perlu) err.push(`${s.id}: durasi ${s.durasi}s terlalu pendek untuk ${kata} kata (min ${perlu.toFixed(1)}s pada ${kpd} kata/detik)`);
      if (sb.scenes.some((x) => x.vo)) warn.push(`${s.id}: belum ada voice-over`);
    }
    if (s.transisi === "none") warn.push(`${s.id}: transisi "none" = hard cut, hindari`);
  });
  const types = sb.scenes.map((x) => x.type);
  const lastT = types[types.length - 1];
  const okEnd = lastT === "outro" || (lastT === "sumber" && types[types.length - 2] === "outro");
  if (!okEnd) err.push("video harus diakhiri outro (boleh diikuti satu adegan sumber)");
  const verifPy = join(__dirname, "..", "verify", `${f.replace(".json", "")}.py`);
  if (!existsSync(verifPy)) warn.push(`belum ada skrip verifikasi ${verifPy}`);
  const dur = totalFrames(sb) / FPS;
  if (dur < 25 || dur > 95) warn.push(`total durasi ${dur.toFixed(1)}s di luar 25–95 detik`);
  console.log(`\n${f}  (${dur.toFixed(1)} detik, ${sb.scenes.length} adegan)`);
  err.forEach((e) => console.log("  ✗", e));
  warn.forEach((w) => console.log("  !", w));
  if (!err.length) console.log("  ✓ lolos");
  gagal += err.length;
}
process.exit(gagal ? 1 : 0);
