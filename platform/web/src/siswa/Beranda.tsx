import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../konteks";
import { JALUR_UJI, PETA, simpulJalur } from "../penilai";
import { gabungStatus, simpulLatihanBerikut } from "../latihan";
import type { Status } from "../data/tipe";
import Titik from "./Titik";

export const NAMA_JALUR: Record<string, string> = { J07: "Pecahan", J12: "Persamaan linear", J13: "Ubah rumus fisika" };

export default function Beranda() {
  const { data, pengguna, kelas, kirimanTertunda } = useApp();
  const [status, setStatus] = useState<Record<string, Status> | null>(null);
  useEffect(() => { void data.statusSaya().catch(() => ({})).then((st) => setStatus(gabungStatus(st, kirimanTertunda()))); }, [data, kirimanTertunda]);
  if (!status) return <p className="redup">Memuat…</p>;
  return (
    <main>
      <h2>Hai, {pengguna?.nama.split(" ")[0]}</h2>
      <p className="redup">{kelas?.nama} · Isi ulang pondasimu, satu anak tangga demi satu.</p>
      {JALUR_UJI.map((j) => {
        const ss = simpulJalur(j);
        const sudahTes = ss.some((s) => status[s.id]);
        const berikut = simpulLatihanBerikut(j, status);
        return (
          <section className="kartu" key={j}>
            <h3>{NAMA_JALUR[j]} <span className="redup">({j})</span></h3>
            <p>{ss.map((s) => <Titik key={s.id} status={status[s.id]} />)}</p>
            {!sudahTes && <Link className="tombol emas" to={`/tes/${j}`}>Mulai tes (±{Math.round(ss.length * 1.2)} menit)</Link>}
            {sudahTes && berikut && <Link className="tombol" to={`/latihan/${berikut}`}>Lanjut latihan: {PETA.simpul.find((s) => s.id === berikut)?.nama}</Link>}
            {sudahTes && !berikut && <p><b>Semua simpul kuasai.</b> Mantap!</p>}
            {sudahTes && <p><Link to={`/tes/${j}`} className="redup">Ulang tes</Link></p>}
          </section>
        );
      })}
      <p className="redup"><Titik status="kuasai" /> kuasai <Titik status="rapuh" /> rapuh <Titik status="bolong" /> bolong <Titik /> belum dites</p>
    </main>
  );
}
