import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { catatHasil, perluRemedi, profilBaru } from "../../../src/profil";
import { keTeks } from "../../../src/pecahan";
import type { Jawaban } from "../../../src/templat";
import { useApp } from "../konteks";
import { ambilSoal, infoSimpul, nilaiJawaban, nilaiLangkah, umpanPola, type Penilaian } from "../penilai";
import { gabungStatus, seedBaru, simpulLatihanBerikut, sudahLancar, type CatatanLatihan } from "../latihan";
import IsianJawaban from "./IsianJawaban";
import KartuModul from "./KartuModul";

const teksJawaban = (j: Jawaban) => (j.jenis === "bilangan" ? keTeks(j.nilai) : j.teks);
/** Persamaan awal dari teks soal J12 ("Selesaikan: 2x + 3 = 11. …"). */
const persamaanSoal = (teks: string) => /(?:Selesaikan:|Jadi) (.+?=.+?)\.(?: |$)/.exec(teks)?.[1].replace(/−/g, "-") ?? null;

/** Kunci per simpul: pindah simpul = layar latihan baru. */
export default function LatihanSimpul() {
  const { simpul = "" } = useParams();
  return <Latihan key={simpul} />;
}

function Latihan() {
  const { simpul = "" } = useParams();

  const { data, demo, pengguna, kelas, kirimJawaban, kirimStatus } = useApp();
  const info = infoSimpul(simpul);
  const [riwayat, setRiwayat] = useState<CatatanLatihan[] | null>(null);
  const [lihatModul, setLihatModul] = useState(true);
  const [seed, setSeed] = useState(seedBaru);
  const [mulai, setMulai] = useState(Date.now());
  const [jawab, setJawab] = useState("");
  const [langkahMode, setLangkahMode] = useState(false);
  const [langkah, setLangkah] = useState("");
  const [hasil, setHasil] = useState<(Penilaian & { jatuhDi?: number }) | null>(null);
  const [tunjuk, setTunjuk] = useState(false);
  const [lancar, setLancar] = useState(false);

  useEffect(() => {
    void data.riwayatSaya().then((r) =>
      setRiwayat(r.filter((x) => x.mode !== "diagnostik").map((x) => ({ simpul: x.simpul, benar: x.status === "benar", detik: x.detik, polaId: x.polaId ?? undefined }))),
    ).catch(() => setRiwayat([]));
  }, [data, simpul]);

  const soal = useMemo(() => (info ? ambilSoal(simpul, seed) : null), [info, simpul, seed]);
  if (!info || !soal) return <p>Simpul tidak dikenal. <Link to="/">Kembali</Link></p>;
  if (!riwayat) return <p className="redup">Memuat…</p>;
  const awalPersamaan = simpul.startsWith("J12") ? persamaanSoal(soal.teks) : null;

  const soalBaru = () => { setSeed(seedBaru()); setMulai(Date.now()); setJawab(""); setLangkah(""); setHasil(null); setTunjuk(false); };

  async function periksa(teks: string, mode: "latihan" | "langkah", h: Penilaian & { jatuhDi?: number }) {
    const detik = Math.round((Date.now() - mulai) / 100) / 10;
    setHasil(h);
    await kirimJawaban({
      id: crypto.randomUUID(), siswaId: pengguna!.id, kelasId: kelas!.id, mode, simpul, templatId: soal!.templatId, seed: soal!.seed,
      teksJawaban: teks, status: h.status, polaId: h.polaId ?? null, detik, dibuat: new Date().toISOString(),
    });
    if (h.status === "tak-terbaca") return;
    const baru = [...riwayat!, { simpul, benar: h.status === "benar", detik, polaId: h.polaId }];
    setRiwayat(baru);
    if (h.status === "benar" && sudahLancar(baru, simpul, info!.targetDetik)) {
      await kirimStatus(simpul, "kuasai", "latihan");
      setLancar(true);
      return;
    }
    const profil = baru.filter((r) => r.simpul === simpul).reduce((p, r, i) =>
      catatHasil(p, simpul, r.polaId ? { status: "pola", polaId: r.polaId } : { status: r.benar ? "benar" : "tak-dikenal" }, i), profilBaru());
    if (h.status === "pola" && perluRemedi(profil).some((x) => x.polaId === h.polaId)) setLihatModul(true);
  }

  if (lancar) {
    const status = { [simpul]: "kuasai" as const };
    return (
      <main>
        <section className="kartu umpan baik">
          <h2>Lancar!</h2>
          <p>Kamu sudah menguasai <b>{info.nama}</b>. Satu anak tangga terisi.</p>
        </section>
        <LanjutSimpul jalur={info.jalur} statusTambahan={status} />
      </main>
    );
  }

  const benarSimpul = riwayat.filter((r) => r.simpul === simpul).slice(-10).filter((r) => r.benar).length;
  return (
    <main>
      <h2>{info.nama}</h2>
      <p className="redup">Benar {benarSimpul}/10 terakhir · target &lt; {info.targetDetik} detik per soal</p>
      {lihatModul ? (
        <KartuModul simpul={simpul}>
          <button className="tombol emas penuh" onClick={() => { setLihatModul(false); setMulai(Date.now()); }}>Mulai soal</button>
        </KartuModul>
      ) : (
        <section className="kartu">
          <p className="soal" data-testid="soal" data-pola-contoh={demo ? teksJawaban(soal.pola[0].jawaban) : undefined}>{soal.teks}</p>
          {!hasil && !langkahMode && (
            <IsianJawaban nilai={jawab} ubah={setJawab} kirim={() => void periksa(jawab, "latihan", nilaiJawaban(soal, jawab))} />
          )}
          {!hasil && langkahMode && awalPersamaan && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const baris = langkah.split("\n").map((s) => s.trim().replace(/−/g, "-")).filter(Boolean);
              const r = nilaiLangkah(awalPersamaan, baris);
              const u = r.polaId ? umpanPola(r.polaId) : undefined;
              void periksa(langkah, "langkah", { status: r.benar ? "benar" : r.polaId ? "pola" : "tak-dikenal", polaId: r.polaId, umpan: u, jatuhDi: r.jatuhDi });
            }}>
              <label htmlFor="langkah" className="redup">Satu langkah per baris, akhiri dengan x = …</label>
              <textarea id="langkah" className="isian" rows={4} maxLength={500} value={langkah} onChange={(e) => setLangkah(e.target.value)} placeholder={"2x = 8\nx = 4"} />
              <p><button className="tombol penuh" disabled={!langkah.trim()}>Periksa</button></p>
            </form>
          )}
          {!hasil && awalPersamaan && (
            <p><button className="tombol garis" type="button" onClick={() => setLangkahMode(!langkahMode)}>{langkahMode ? "Jawab langsung" : "Tulis langkah"}</button></p>
          )}
          {hasil && <Umpan hasil={hasil} tunjuk={tunjuk} setTunjuk={setTunjuk} soalBaru={soalBaru} ulangi={() => setHasil(null)} />}
          <p><button className="tombol garis" type="button" onClick={() => setLihatModul(true)}>Lihat modul</button></p>
        </section>
      )}
      <p><Link to="/" className="redup">← Beranda</Link></p>
    </main>
  );
}

function Umpan({ hasil, tunjuk, setTunjuk, soalBaru, ulangi }: {
  hasil: Penilaian & { jatuhDi?: number }; tunjuk: boolean; setTunjuk(b: boolean): void; soalBaru(): void; ulangi(): void;
}) {
  if (hasil.status === "benar") return (
    <div className="umpan baik">
      <p><b>Benar!</b>{hasil.belumSederhana ? " (Bisa disederhanakan lagi, lho.)" : ""}</p>
      <button className="tombol penuh" onClick={soalBaru}>Soal berikutnya</button>
    </div>
  );
  if (hasil.status === "tak-terbaca") return (
    <div className="umpan">
      <p>Jawabanmu belum terbaca. Contoh penulisan: <code>3/4</code>, <code>1 1/2</code>, <code>-2</code>, <code>s/v</code>, <code>√(2E/m)</code>.</p>
      <button className="tombol penuh" onClick={ulangi}>Perbaiki jawaban</button>
    </div>
  );
  if (hasil.status === "pola" && hasil.umpan) return (
    <div className="umpan">
      {hasil.jatuhDi !== undefined && <p className="redup">Langkah ke-{hasil.jatuhDi + 1} meleset.</p>}
      <p data-testid="umpan-sebut">{hasil.umpan.sebut}</p>
      {!tunjuk && <button className="tombol garis" onClick={() => setTunjuk(true)}>Tunjukkan</button>}
      {tunjuk && <p data-testid="umpan-tunjukkan">{hasil.umpan.tunjukkan}</p>}
      <p><button className="tombol penuh" onClick={soalBaru}>Coba soal kembar</button></p>
    </div>
  );
  return (
    <div className="umpan">
      {hasil.jatuhDi !== undefined && <p className="redup">Langkah ke-{hasil.jatuhDi + 1} meleset.</p>}
      <p>Hmm, jawabanmu belum tepat dan belum kami kenali polanya. Gurumu akan melihatnya untuk membantu. Coba cek lagi langkahmu.</p>
      <button className="tombol penuh" onClick={soalBaru}>Coba soal lain</button>
    </div>
  );
}

function LanjutSimpul({ jalur, statusTambahan }: { jalur: string; statusTambahan: Record<string, "kuasai"> }) {
  const { data, kirimanTertunda } = useApp();
  const [berikut, setBerikut] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    void data.statusSaya().catch(() => ({})).then((s) => setBerikut(simpulLatihanBerikut(jalur, { ...gabungStatus(s, kirimanTertunda()), ...statusTambahan })));
  }, [data, jalur, statusTambahan, kirimanTertunda]);
  if (berikut === undefined) return null;
  return berikut
    ? <p><Link className="tombol emas penuh" to={`/latihan/${berikut}`}>Lanjut ke simpul berikut</Link></p>
    : <p><b>Seluruh jalur ini sudah kuasai!</b> <Link to="/">Kembali ke beranda</Link></p>;
}
