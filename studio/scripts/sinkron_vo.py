"""
Sinkronkan voice-over per adegan dengan storyboard.

Pemakaian:  python3 scripts/sinkron_vo.py src/storyboards/<nama>.json
            (atau: npm run sinkron -- src/storyboards/<nama>.json)

Konvensi file audio: public/audio/<nama>/<nomor>-<id-adegan>.mp3
  contoh: public/audio/pythagoras-345/1-pembuka-tali.mp3

Untuk tiap adegan yang punya file audio:
  1. ukur durasi & deteksi jeda (ffmpeg silencedetect)
  2. waktu tiap kata = dibagi menurut jumlah suku kata, HANYA di bagian bersuara
     (jeda di koma/titik otomatis jatuh di tempat yang benar)
  3. tulis scene.vo = {file, durasi, words}
  4. perpanjang scene.durasi bila suara tidak muat sebelum transisi
  5. elemen visual yang punya isyarat "kata" (mis. {"kata": "tiga"} atau
     {"kata": "lima", "kataKe": 2}) diberi `at` = saat kata itu diucapkan
     — berlaku untuk props.items, props.langkah, props.points, props.curves
Teks subtitle tetap diambil dari `narasi` (ejaan benar, mis. "Pythagoras"),
walau naskah untuk TTS boleh ditulis sesuai bunyi ("Pitagoras").
"""
import json
import math
import re
import subprocess
import sys
from pathlib import Path

FPS = 30
VO_LEAD = 9  # frame, harus sama dengan timeline.ts
TRANS = {"iris": 22, "fade": 15, "perkamen": 24, "none": 0}
TAIL = 0.25  # detik hening setelah suara sebelum transisi dimulai


def durasi_audio(f: Path) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def jeda(f: Path, db=-35, d=0.12):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(f), "-af", f"silencedetect=n={db}dB:d={d}", "-f", "null", "-"],
                       capture_output=True, text=True)
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r.stderr)]
    en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r.stderr)]
    return list(zip(st, en + [math.inf] * (len(st) - len(en))))


def bagian_bersuara(dur: float, sil):
    seg, t = [], 0.0
    for s, e in sil:
        if s > t + 0.02:
            seg.append((t, min(s, dur)))
        t = max(t, min(e, dur))
    if t < dur - 0.02:
        seg.append((t, dur))
    return seg or [(0.0, dur)]


def suku_kata(w: str) -> int:
    w = w.lower()
    if re.fullmatch(r"[\d.,]+", w):
        return max(1, len(w))
    return max(1, len(re.findall(r"[aiueoéèê]+", w)))


def waktu_kata(narasi: str, seg):
    words = narasi.split()
    weights = [suku_kata(w) for w in words]
    total_w = sum(weights)
    total_t = sum(e - s for s, e in seg)

    def peta(x):  # detik "bersuara" kumulatif -> detik nyata
        for s, e in seg:
            if x <= (e - s) + 1e-9:
                return s + x
            x -= e - s
        return seg[-1][1]

    out, acc = [], 0.0
    for w, k in zip(words, weights):
        a = acc / total_w * total_t
        acc += k
        b = acc / total_w * total_t
        out.append({"w": w, "start": round(peta(a), 3), "end": round(peta(b - 1e-6), 3)})
    return out


def norm(w: str) -> str:
    return re.sub(r"[^\wÀ-ÿ]", "", w.lower())


def pasang_isyarat(sc, words):
    for props in (sc.get("props", {}), sc.get("ilustrasi") or {}):
        _pasang(sc, props, words)


def _pasang(sc, props, words):
    lead = VO_LEAD / FPS
    for key in ("items", "langkah", "points", "curves", "elemen", "label", "momen"):
        daftar = props.get(key)
        if not isinstance(daftar, list):
            continue
        for el in daftar:
            if not isinstance(el, dict):
                continue
            kata = el.get("kata")
            if not kata:
                continue
            ke = el.get("kataKe", 1)
            hits = [w for w in words if norm(w["w"]) == norm(kata)]
            if len(hits) < ke:
                print(f"    ! isyarat '{kata}' (ke-{ke}) tidak ditemukan di narasi {sc['id']}")
                continue
            el["at"] = round(lead + hits[ke - 1]["start"] - el.get("kataMaju", 0.1), 2)


def main(path: str):
    p = Path(path)
    sb = json.loads(p.read_text())
    root = p.resolve().parents[2]  # studio/
    stem = p.stem
    n = len(sb["scenes"])
    for i, sc in enumerate(sb["scenes"], 1):
        rel = f"audio/{stem}/{i}-{sc['id']}.mp3"
        f = root / "public" / rel
        if not f.exists():
            print(f"  - {sc['id']}: belum ada {rel} (subtitle pakai estimasi)")
            sc.pop("vo", None)
            continue
        dur = durasi_audio(f)
        seg = bagian_bersuara(dur, jeda(f))
        sc["vo"] = {"file": rel, "durasi": round(dur, 3), "words": waktu_kata(sc["narasi"], seg)}
        pasang_isyarat(sc, sc["vo"]["words"])
        trans = 0 if i == n else TRANS[sc.get("transisi", "iris")]
        perlu = VO_LEAD / FPS + dur + trans / FPS + TAIL
        if i == n:
            perlu = VO_LEAD / FPS + dur + 1.0  # beri waktu logo di penutup
        if sc["durasi"] < perlu:
            baru = math.ceil(perlu * 10) / 10
            print(f"  ~ {sc['id']}: durasi {sc['durasi']}s -> {baru}s (suara {dur:.2f}s)")
            sc["durasi"] = baru
        else:
            print(f"  ✓ {sc['id']}: suara {dur:.2f}s muat di {sc['durasi']}s")
    p.write_text(json.dumps(sb, ensure_ascii=False, indent=1) + "\n")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(sys.argv[1])
