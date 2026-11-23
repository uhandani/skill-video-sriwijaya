import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "../konteks";
import { simpulJalur } from "../penilai";
import { simpulLatihanBerikut } from "../latihan";
import type { Status } from "../data/tipe";
import Titik from "./Titik";
import { NAMA_JALUR } from "./Beranda";

export default function Hasil() {
  const { jalur = "" } = useParams();
  const { data } = useApp();
  const [status, setStatus] = useState<Record<string, Status> | null>(null);
  useEffect(() => { void data.statusSaya().then(setStatus); }, [data]);
  if (!status) return <p className="redup">Memuat hasil…</p>;
  const mulai = simpulLatihanBerikut(jalur, status);
  return (
    <main>
      <h2>Hasil tes {NAMA_JALUR[jalur]}</h2>
      <section className="kartu">
        {simpulJalur(jalur).map((s) => (
          <p key={s.id}><Titik status={status[s.id]} /> {s.nama} — <b>{status[s.id] ?? "belum"}</b></p>
        ))}
      </section>
      {mulai
        ? <p><Link className="tombol emas penuh" to={`/latihan/${mulai}`}>Mulai latihan</Link></p>
        : <p><b>Semua kuasai!</b> <Link to="/">Kembali ke beranda</Link></p>}
    </main>
  );
}
