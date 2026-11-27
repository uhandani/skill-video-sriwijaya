import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { catat, mulaiDiagnostik, ringkasan, simpulBerikut, type SesiDiagnostik } from "../../../src/diagnostik";
import { useApp } from "../konteks";
import { JALUR_UJI, PETA, ambilSoal, nilaiJawaban } from "../penilai";
import { seedBaru } from "../latihan";
import { hapusSesi, muatSesi, simpanSesi } from "../diagnostikLokal";
import IsianJawaban from "./IsianJawaban";
import { NAMA_JALUR } from "./Beranda";

export default function Diagnostik() {
  const { jalur = "" } = useParams();
  const nav = useNavigate();
  const { pengguna, kelas, kirimJawaban, kirimStatus } = useApp();
  const [sesi, setSesi] = useState<SesiDiagnostik | null>(null);
  const [seed, setSeed] = useState(seedBaru);
  const [mulai, setMulai] = useState(Date.now());
  const [jawab, setJawab] = useState("");
  const [nomor, setNomor] = useState(1);
  const [sibuk, setSibuk] = useState(false);

  useEffect(() => {
    if (!(JALUR_UJI as readonly string[]).includes(jalur)) { nav("/"); return; }
    setSesi(muatSesi(pengguna!.id, jalur) ?? mulaiDiagnostik(PETA, [jalur], "SMA"));
  }, [jalur, nav, pengguna]);

  if (!sesi) return <p className="redup">Menyiapkan tes…</p>;
  const simpul = simpulBerikut(sesi);
  if (!simpul) return <p className="redup">Menyimpan hasil…</p>;
  const soal = ambilSoal(simpul, seed);

  async function periksa() {
    if (!sesi || !simpul) return;
    setSibuk(true);
    const h = nilaiJawaban(soal, jawab);
    await kirimJawaban({
      id: crypto.randomUUID(), siswaId: pengguna!.id, kelasId: kelas!.id, mode: "diagnostik", simpul,
      templatId: soal.templatId, seed: soal.seed, teksJawaban: jawab, status: h.status, polaId: h.polaId ?? null,
      detik: Math.round((Date.now() - mulai) / 100) / 10, dibuat: new Date().toISOString(),
    });
    catat(sesi, simpul, h.status === "benar");
    if (!simpulBerikut(sesi)) {
      const r = ringkasan(sesi);
      // Status lewat antrean: tetap aman walau sinyal putus di soal terakhir.
      for (const [id, st] of Object.entries(r.status)) await kirimStatus(id, st, "diagnostik");
      hapusSesi(pengguna!.id, jalur);
      nav(`/hasil/${jalur}`, { state: r });
      return;
    }
    simpanSesi(pengguna!.id, jalur, sesi);
    setSesi({ ...sesi });
    setSeed(seedBaru()); setMulai(Date.now()); setJawab(""); setNomor((n) => n + 1); setSibuk(false);
  }

  return (
    <main>
      <h2>Tes {NAMA_JALUR[jalur]}</h2>
      <p className="redup">Soal {nomor} · Kerjakan sebisamu. Tidak apa-apa salah — tes ini untuk menemukan anak tangga yang perlu diisi ulang.</p>
      <section className="kartu">
        <p className="soal" data-testid="soal">{soal.teks}</p>
        <IsianJawaban nilai={jawab} ubah={setJawab} kirim={periksa} nonaktif={sibuk} />
      </section>
    </main>
  );
}
