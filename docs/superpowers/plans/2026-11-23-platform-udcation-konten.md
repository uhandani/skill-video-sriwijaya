# Platform UDcation — Tahap Konten: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tim 9 agen tokoh Nusantara, riset soal, peta kurikulum J1–J15, mesin cek jawaban + analisis salah + diagnostik, dan konten penuh J7 (pecahan), J12 (persamaan linear), J13 (ubah rumus).

**Architecture:** Paket TypeScript baru `platform/` terpisah dari `studio/`. Metadata (simpul, pola salah, teks feedback) di JSON; templat soal berparameter berupa modul TS (punya fungsi kunci & fungsi jawaban-salah). Mesin murni (tanpa UI, tanpa server): cek jawaban → cocokkan pola salah → profil → diagnostik adaptif.

**Tech Stack:** Node 22, TypeScript 5.9.3, vitest 3.2.4, tsx. Tanpa pustaka matematika luar (pecahan & parser ekspresi kecil dibuat sendiri).

**Spec:** `docs/superpowers/specs/2026-11-23-platform-udcation-design.md`

## Global Constraints

- Bahasa Indonesia untuk semua teks siswa, nama file konten, dan identitas kode domain (`pecahan`, `simpul`, `polaSalah`).
- Acuan: Kurikulum Merdeka (Fase A–E), AKM numerasi & literasi.
- Kumon/AKM/PISA/Gradient: amati–tiru–modifikasi cara & urutan; **tidak** menyalin teks/halaman soal.
- Klaim sejarah/tokoh belum pasti → label "konon"; riset mencatat sumber (URL).
- Status simpul: `kuasai` / `rapuh` / `bolong`. Diagnostik ≤ 25 menit; 2–3 soal per simpul.
- Remedi: pola salah sama ≥ 2 kali dalam 5 jawaban terakhir.
- Syarat lancar default: akurasi ≥ 0,9 dan di bawah `targetDetik` simpul.
- Tiap templat ≥ 3 pola salah; tingkat 1–5.
- Nama skill/agen persis: `gajahmada-koordinator`, `kihajar-kurikulum`, `malahayati-riset-soal`, `sultanagung-bank-soal-mtk`, `habibie-fisika`, `kartini-literasi-modul`, `dewisartika-penguji`, `djuanda-developer`, `radensaleh-kreatif-game`.
- Feedback 3 lapis: `sebut`, `tunjukkan`, lalu soal kembar (dibuat mesin).

## Review Focus

1. **Jawaban pola salah = kunci** (mis. ½+½ "lurus" = 2/4 = ½): harus dinilai benar; templat wajib menolak parameter seperti itu → tes keunikan di Task 9.
2. **Variasi ketikan siswa** ("0,5", " 1 / 2 ", "½", "1 1/2", "-1/2", "2/4"): semua terbaca; "2/4" benar tapi `belumSederhana: true` → tes di Task 2.
3. **Input rusak** ("abc", "1/0", kosong): status `tak-terbaca`, tidak melempar error → tes di Task 2 & 3.
4. **Ubah rumus bentuk setara** ("s/v", "s*v^-1", "(s)/(v)") benar; titik uji tidak boleh membuat bagi nol → tes di Task 3.
5. **Diagnostik ujung** (jalur 1 simpul; semua benar; semua salah): sesi selesai & ringkasan memuat semua simpul → tes di Task 6.

---

### Task 1: Tim agen tokoh Nusantara

**Files:**
- Create: `.claude/skills/<nama>/SKILL.md` × 9, `.claude/agents/<nama>.md` × 9
- Modify: `CLAUDE.md` (bagian "Platform UDcation"), `PANDUAN-PROYEK-UDCATION.md` (bagian baru "Platform")

- [ ] **Step 1:** Tulis 9 SKILL.md. Frontmatter `name` = nama folder, `description` (kapan dipakai, kata kunci Indonesia). Isi: peran & tokoh (1 paragraf, fakta tokoh dengan sumber), tugas, file yang dipegang, aturan wajib (Global Constraints yang relevan), serah-terima ke agen lain. Peran per spec §5.7; `gajahmada-koordinator` memuat urutan kerja spec §6 dan cara memanggil agen lain lewat Agent tool `subagent_type: <nama>`.
- [ ] **Step 2:** Tulis 9 agen: frontmatter `name`, `description`, `tools` (Djuanda & Dewi Sartika: semua; Malahayati & Raden Saleh: Read, Write, Grep, Glob, WebSearch, WebFetch; lainnya: Read, Write, Edit, Grep, Glob, Bash). Badan: "Baca dan ikuti `.claude/skills/<nama>/SKILL.md`."
- [ ] **Step 3: Verifikasi**
  Run: `for d in .claude/skills/*/; do n=$(basename $d); grep -q "^name: $n$" $d/SKILL.md || echo SALAH $n; done; ls .claude/agents | wc -l`
  Expected: tanpa "SALAH", `9`.
- [ ] **Step 4:** Commit `feat: tim agen tokoh Nusantara`.

### Task 2: Paket `platform/`, pecahan, baca jawaban

**Files:**
- Create: `platform/package.json`, `platform/tsconfig.json`, `platform/src/pecahan.ts`, `platform/src/baca.ts`
- Test: `platform/test/pecahan.test.ts`, `platform/test/baca.test.ts`

**Interfaces — Produces:**
- `type Pecahan = { p: number; q: number }` (q > 0, selalu disederhanakan oleh `pec`)
- `pec(p: number, q?: number): Pecahan` (lempar error jika q = 0), `tambah|kurang|kali|bagi(a, b): Pecahan`, `sama(a, b): boolean`, `keTeks(a): string` ("3/4", "-2", "1 1/2" tidak — bentuk biasa saja)
- `bacaBilangan(teks: string): { nilai: Pecahan; belumSederhana: boolean } | null`

- [ ] **Step 1:** `package.json` (`"type": "module"`, scripts `test: vitest run`, `cek: tsc --noEmit`), devDeps typescript 5.9.3, vitest 3.2.4, tsx ^4.19.2. `npm install`.
- [ ] **Step 2: Tes gagal**
```ts
expect(tambah(pec(1,2), pec(1,3))).toEqual(pec(5,6));
expect(pec(2,-4)).toEqual({ p: -1, q: 2 });
expect(() => pec(1,0)).toThrow();
expect(bacaBilangan("0,5")!.nilai).toEqual(pec(1,2));
expect(bacaBilangan(" 1 / 2 ")!.nilai).toEqual(pec(1,2));
expect(bacaBilangan("½")!.nilai).toEqual(pec(1,2));
expect(bacaBilangan("1 1/2")!.nilai).toEqual(pec(3,2));
expect(bacaBilangan("-1/2")!.nilai).toEqual(pec(-1,2));
expect(bacaBilangan("2/4")).toEqual({ nilai: pec(1,2), belumSederhana: true });
for (const t of ["abc", "1/0", "", "1//2"]) expect(bacaBilangan(t)).toBeNull();
```
- [ ] **Step 3:** `npm test` → FAIL. Implementasi. `npm test` → PASS. `npm run cek` → bersih.
- [ ] **Step 4:** Commit `feat(platform): pecahan dan baca jawaban`.

### Task 3: Ekspresi & kesetaraan numerik

**Files:** Create `platform/src/ekspresi.ts`; Test `platform/test/ekspresi.test.ts`

**Interfaces — Produces:**
- `bacaEkspresi(teks: string): Ekspresi | null` — tata bahasa: + − × * · / ÷ ^, kurung, bilangan (koma/titik desimal), variabel satu huruf (boleh huruf Yunani ρ, λ), perkalian tersirat (`2x`, `ma`).
- `nilai(e: Ekspresi, v: Record<string, number>): number`
- `setara(a: Ekspresi, b: Ekspresi, variabel: string[]): boolean` — 7 titik uji acak tetap (seed 7) di rentang 1,5–9,5, abaikan titik yang menghasilkan non-finite; setara jika |selisih| ≤ 1e-9·max(1,|a|) di semua titik sah dan ≥ 3 titik sah.

- [ ] **Step 1: Tes gagal**
```ts
const s = (t: string) => bacaEkspresi(t)!;
expect(setara(s("s/v"), s("s*v^-1"), ["s","v"])).toBe(true);
expect(setara(s("(s)/(v)"), s("s÷v"), ["s","v"])).toBe(true);
expect(setara(s("s/v"), s("v/s"), ["s","v"])).toBe(false);
expect(setara(s("F/a"), s("F/(a-a+a)"), ["F","a"])).toBe(true);
expect(bacaEkspresi("2x+")).toBeNull();
expect(nilai(s("2x+3"), { x: 4 })).toBe(11);
```
- [ ] **Step 2:** FAIL → implementasi (recursive descent) → PASS. Commit `feat(platform): ekspresi dan kesetaraan`.

### Task 4: Templat soal & cek jawaban (mode B)

**Files:** Create `platform/src/acak.ts`, `platform/src/templat.ts`, `platform/src/cek.ts`; Test `platform/test/cek.test.ts`

**Interfaces — Produces:**
```ts
type Jawaban = { jenis: "bilangan"; nilai: Pecahan } | { jenis: "ekspresi"; teks: string; variabel: string[] };
type Templat<P> = {
  id: string; simpul: string; tingkat: 1|2|3|4|5;
  buatParam(acak: Acak): P;            // wajib menolak param yang membuat pola = kunci
  teks(p: P): string;
  kunci(p: P): Jawaban;
  polaSalah: { id: string; jawaban(p: P): Jawaban }[];
  wajibSederhana?: boolean;
};
type Soal = { templatId: string; simpul: string; teks: string; kunci: Jawaban; pola: { id: string; jawaban: Jawaban }[]; wajibSederhana: boolean };
type HasilCek = { status: "benar" | "pola" | "tak-dikenal" | "tak-terbaca"; polaId?: string; belumSederhana?: boolean };
buatAcak(seed: number): Acak  // mulberry32; Acak = { bulat(min,max): number; pilih<T>(xs: T[]): T }
buatSoal<P>(t: Templat<P>, seed: number): Soal
cekJawaban(soal: Soal, teks: string): HasilCek
```
Aturan: kunci dicek dulu (benar menang atas pola); `wajibSederhana && belumSederhana` → status `pola`, `polaId: "UMUM-BELUM-SEDERHANA"`.

- [ ] **Step 1: Tes gagal** — templat uji ½-an `a/b + c/d` dengan pola `PEC-JUMLAH-LURUS`; `cekJawaban(soal,"2/5")` untuk ½+⅓ → `{status:"pola", polaId:"PEC-JUMLAH-LURUS"}`; "5/6" → benar; "7/9" → tak-dikenal; "xx" → tak-terbaca; `buatSoal(t, 42)` dua kali → sama (deterministik).
- [ ] **Step 2:** FAIL → implementasi → PASS. Commit `feat(platform): templat dan cek jawaban`.

### Task 5: Mode langkah persamaan linear (mode C)

**Files:** Create `platform/src/langkah.ts`; Test `platform/test/langkah.test.ts`

**Interfaces — Consumes:** `bacaEkspresi`, `Pecahan`. **Produces:**
- `bacaPersamaan(teks: string): { kiri: Ekspresi; kanan: Ekspresi } | null` (satu `=`)
- `solusiLinear(p, v: string): Pecahan | "semua" | "tidak-ada" | null` (null jika bukan linear)
- `type PolaLangkah = { id: string; terapkan(sebelum: Persamaan, v: string): Persamaan[] }`
- `cekLangkah(awal: string, langkah: string[], v: string, pola: PolaLangkah[]): { benar: boolean; jatuhDi?: number; polaId?: string }` — langkah ke-i "jatuh" bila solusinya ≠ solusi awal; `polaId` = pola yang `terapkan(langkah sebelumnya)` menghasilkan persamaan bersolusi sama dengan langkah siswa. Langkah terakhir harus berbentuk `x = bilangan` agar `benar`.

- [ ] **Step 1: Tes gagal**
```ts
expect(cekLangkah("2x+3=11", ["2x=8","x=4"], "x", POLA)).toEqual({ benar: true });
expect(cekLangkah("2x+3=11", ["x=4"], "x", POLA)).toEqual({ benar: true });       // lompat langkah boleh
expect(cekLangkah("2x+3=11", ["2x=14","x=7"], "x", POLA))
  .toEqual({ benar: false, jatuhDi: 0, polaId: "PERS-PINDAH-TANDA-TETAP" });
expect(cekLangkah("2x+3=11", ["2x=8"], "x", POLA)).toEqual({ benar: false });     // belum selesai
```
- [ ] **Step 2:** FAIL → implementasi (POLA uji didefinisikan di tes; pola sungguhan di Task 10) → PASS. Commit `feat(platform): cek per langkah persamaan`.

### Task 6: Tes diagnostik adaptif

**Files:** Create `platform/src/peta.ts`, `platform/src/diagnostik.ts`; Test `platform/test/diagnostik.test.ts`

**Interfaces — Produces:**
```ts
type Simpul = { id: string; jalur: string; nama: string; urutan: number; prasyarat: string[]; fase: string; targetDetik: number };
type Peta = { jalur: { id: string; nama: string }[]; simpul: Simpul[] };
type Status = "kuasai" | "rapuh" | "bolong";
mulaiDiagnostik(peta: Peta, jalurIds: string[], jenjang: "SD"|"SMP"|"SMA"): SesiDiagnostik
simpulBerikut(s: SesiDiagnostik): string | null      // null = selesai
catat(s: SesiDiagnostik, simpulId: string, benar: boolean): void
ringkasan(s): { status: Record<string, Status>; tersirat: string[]; titikMulai: Record<string, string | null> }
```
Algoritma per jalur (simpul diurutkan `urutan`): cari biner `lo..hi`, mulai: SD = 1/4, SMP = 1/2, SMA = 3/4 panjang jalur. 2/2 benar → `kuasai`, semua di bawahnya tersirat kuasai, `lo = mid+1`. 0/2 → `bolong`, semua di atasnya tersirat bolong, `hi = mid-1`. 1/2 → soal ke-3: benar → `rapuh`, salah → `bolong`; keduanya `hi = mid-1` dan di atasnya tersirat bolong. `titikMulai` = simpul terendah yang bukan kuasai (null jika semua kuasai).

- [ ] **Step 1: Tes gagal** — peta uji 8 simpul: siswa simulasi menguasai urutan 1–5 → status urutan 6 bolong, `titikMulai` = urutan 6, jumlah soal ≤ 3·⌈log2 8⌉+3; semua benar → semua kuasai, `titikMulai` null; semua salah → selesai, semua bolong; jalur 1 simpul → selesai setelah ≤ 3 soal.
- [ ] **Step 2:** FAIL → implementasi → PASS. Commit `feat(platform): diagnostik adaptif`.

### Task 7: Profil salah & remedi

**Files:** Create `platform/src/profil.ts`; Test `platform/test/profil.test.ts`

**Interfaces — Produces:**
- `type Profil = { riwayat: { simpul: string; hasil: HasilCek; waktu: number }[]; bobot: Record<string, number> }`
- `catatHasil(pr: Profil, simpul: string, hasil: HasilCek, waktu: number): Profil` — bobot pola: kali 0,9 tiap catatan baru lalu +1 untuk pola yang muncul.
- `perluRemedi(pr: Profil): { simpul: string; polaId: string }[]` — pola sama ≥ 2 dalam 5 riwayat terakhir.
- `polaDominan(pr: Profil, n = 3): string[]`
- `laporanKumpulan(semua: Profil[]): { polaId: string; jumlah: number }[]` — pola terbanyak di semua siswa, urut turun (spec §5.5).

- [ ] **Step 1: Tes gagal** — 2× `PEC-JUMLAH-LURUS` dalam 5 terakhir → remedi; 1× → tidak; dua kali tapi 6 catatan lalu → tidak; bobot pola lama < bobot pola baru setelah 10 catatan; `laporanKumpulan` dua profil menjumlah benar & terurut.
- [ ] **Step 2:** FAIL → implementasi → PASS. Commit `feat(platform): profil salah dan remedi`.

### Task 8: Riset soal (Malahayati)

**Files:** Create `platform/riset/riset-soal.md`

- [ ] **Step 1:** Riset web (WebSearch): metode Kumon (urutan level matematika, latihan berulang, target waktu, tes penempatan), AKM numerasi (domain, level kognitif, konteks), PISA math, Gradient Academy (diagnostik & mastery), riset miskonsepsi pecahan & aljabar & ubah rumus. Isi per sumber: temuan, "amati–tiru–modifikasi" untuk UDcation, URL.
- [ ] **Step 2:** Bagian akhir "Daftar miskonsepsi kandidat" untuk J7/J12/J13 (id usulan, contoh salah, sumber).
- [ ] **Step 3:** Cek: tidak ada teks soal yang disalin utuh; tiap klaim ber-URL. Commit `docs(riset): riset soal Kumon AKM Gradient`.

### Task 8b: Riset gamifikasi (Raden Saleh)

**Files:** Create `platform/riset/riset-gamifikasi.md`

- [ ] **Step 1:** Riset web: app belajar ala game (Duolingo, Prodigy Math, Khan Academy Kids, DragonBox, Brilliant, Quipper/Ruangguru/Zenius bila ada fitur game) dan game mobile favorit anak/remaja Indonesia (mis. Mobile Legends, Free Fire, Roblox, Minecraft, Genshin, EA FC Mobile). Per app: fitur pemikat (streak, liga, XP, koleksi kartu, quest harian, avatar, event musiman, mabar), alasan psikologisnya, sumber URL.
- [ ] **Step 2:** Tabel "fitur → versi UDcation bertema Nusantara" (mis. liga = turnamen antar-kerajaan, gacha → kartu tokoh didapat dari **prestasi**, bukan uang), diberi prioritas (versi pertama / nanti).
- [ ] **Step 3:** Bagian "Garis merah": fitur yang ditolak (loot box berbayar, pay-to-win, streak yang menghukum, notifikasi memaksa) + alasan, rujuk riset/aturan perlindungan anak. Commit `docs(riset): riset gamifikasi`.

### Task 9: Peta kurikulum + validator konten (Ki Hajar, Dewi Sartika)

**Files:** Create `platform/konten/peta.json`, `platform/konten/pola-salah.json`, `platform/test/konten.test.ts`, `platform/konten/templat/index.ts` (ekspor `SEMUA_TEMPLAT: Templat<any>[]`, kosong dulu)

- [ ] **Step 1:** `peta.json` sesuai tipe `Peta`: J1–J15 (spec §5.1), tiap jalur 4–10 simpul, id `J07-03` dst., fase, `targetDetik`, prasyarat (boleh lintas jalur).
- [ ] **Step 2:** `pola-salah.json`: `{ id, simpul, nama, sebut, tunjukkan, sumber? }[]` (isi bertambah di Task 10–12). Tambah `UMUM-BELUM-SEDERHANA`.
- [ ] **Step 3: Tes validator**
  - id simpul unik; prasyarat ada & tanpa siklus; tiap jalur di spec ada.
  - tiap templat: `simpul` ada di peta, ≥ 3 pola, tiap `polaId` ada di `pola-salah.json`.
  - untuk seed 1..200 tiap templat: kunci ≠ setiap jawaban pola, dan antar-pola tidak kembar (Review Focus 1); `teks` tanpa `undefined`/`NaN`.
  - tiap entri pola-salah punya `sebut` & `tunjukkan` tak kosong.
- [ ] **Step 4:** `npm test` → PASS. Commit `feat(konten): peta kurikulum dan validator`.

### Task 10: Konten J7 pecahan operasi (Sultan Agung, Kartini)

**Files:** Create `platform/konten/templat/j07-pecahan.ts`; Modify `platform/konten/templat/index.ts`, `platform/konten/pola-salah.json`

- [ ] **Step 1:** Satu templat per simpul J7 (≥ 1 tingkat mudah & 1 sulit per simpul) + 2 soal cerita berkonteks Nusantara. Pola minimal: `PEC-JUMLAH-LURUS`, `PEC-KALI-SILANG`, `PEC-BAGI-TANPA-BALIK`, `PEC-BALIK-YANG-SALAH`, `PEC-SAMAKAN-PENYEBUT-SAJA`, `PEC-CAMPURAN-ABAIKAN-BULAT` (diperhalus dari riset Task 8).
- [ ] **Step 2:** Teks `sebut`/`tunjukkan` tiap pola (Kartini): ramah, tidak merendahkan, ≤ 2 kalimat per lapis.
- [ ] **Step 3:** Modul per simpul J7 (spec §5.6): `platform/konten/modul/<idSimpul>.md` — konsep singkat, 1–2 contoh, latihan bertahap (id templat), syarat lancar. Bingkai "isi ulang pondasi".
- [ ] **Step 4:** Tambah ke validator: tiap simpul J07/J12/J13 punya file modul dan tiap id templat yang disebut modul ada.
- [ ] **Step 5:** `npm test` (validator Task 9) → PASS. Commit `feat(konten): J7 pecahan`.

### Task 11: Konten J12 persamaan linear

**Files:** Create `platform/konten/templat/j12-persamaan.ts`, `platform/konten/pola-langkah.ts` (ekspor `POLA_LANGKAH: PolaLangkah[]`); Modify index & `pola-salah.json`

- [ ] **Step 1:** Templat (jawaban akhir, mode B) per simpul J12 + pola langkah mode C: `PERS-PINDAH-TANDA-TETAP`, `PERS-BAGI-SATU-SUKU`, `PERS-KURANG-KOEF`, `PERS-KALI-BUKAN-BAGI`.
- [ ] **Step 2:** Tes tambahan di `konten.test.ts`: tiap `POLA_LANGKAH` terdeteksi oleh `cekLangkah` pada satu contoh di tes.
- [ ] **Step 3:** Modul per simpul J12 (format Task 10 Step 3).
- [ ] **Step 4:** `npm test` → PASS. Commit `feat(konten): J12 persamaan linear`.

### Task 12: Konten J13 ubah rumus (Habibie)

**Files:** Create `platform/konten/templat/j13-ubah-rumus.ts`; Modify index & `pola-salah.json`

- [ ] **Step 1:** Templat jawaban `ekspresi` untuk rumus: v = s/t, F = m·a, ρ = m/V, P = W/t, W = F·s, Ek = ½mv², V = I·R, v = λ·f, a = (v−v₀)/t. Pola: `RUMUS-BALIK-PECAHAN` (t = v/s), `RUMUS-KALI-BUKAN-BAGI` (t = v·s), `RUMUS-LUPA-KONSTANTA` (½ hilang), `RUMUS-AKAR-LUPA` (v = 2Ek/m tanpa akar), `RUMUS-PINDAH-TANDA` (v₀ salah tanda). Variabel satu huruf (pakai `E` untuk Ek, `u` untuk v₀) dan teks soal menjelaskan lambangnya.
- [ ] **Step 2:** Pastikan `setara` menangani `^0.5`/`√` untuk akar — jika `bacaEkspresi` belum dukung `√`, tambahkan + tes `setara(s("√(2E/m)"), s("(2E/m)^0.5"), ["E","m"])`.
- [ ] **Step 3:** Modul per simpul J13 (format Task 10 Step 3).
- [ ] **Step 4:** `npm test` → PASS. Commit `feat(konten): J13 ubah rumus fisika`.

### Task 13: Verifikasi akhir (Dewi Sartika)

**Files:** Create `platform/scripts/ekspor-sampel.ts`, `platform/verify/cek_kunci.py`, `platform/README.md`

- [ ] **Step 1:** `platform/scripts/ekspor-sampel.ts` (tsx) tulis 20 soal per templat ke `platform/verify/sampel.json`; `cek_kunci.py` hitung ulang kunci dengan `fractions.Fraction`/`sympy`-bebas (evaluasi numerik) dan bandingkan.
- [ ] **Step 2:** Run: `cd platform && npm test && npm run cek && npx tsx scripts/ekspor-sampel.ts && python3 verify/cek_kunci.py`
  Expected: semua PASS, `cek_kunci: OK`.
- [ ] **Step 3:** README: struktur, cara menambah templat & pola, cara panggil agen. Commit & push.
