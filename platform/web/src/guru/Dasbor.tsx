import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "../konteks";
import { JALUR_UJI, infoSimpul, simpulJalur, umpanPola } from "../penilai";
import { keCsv, polaTerbanyak, takDikenal, waktuPerSimpul } from "../ringkasKelas";
import type { BarisJawaban, Pengguna, Status } from "../data/tipe";
import Titik from "../siswa/Titik";

type Isi = { siswa: Pengguna[]; jawaban: BarisJawaban[]; status: { siswaId: string; simpul: string; status: Status }[] };
const TAB = ["Siswa", "Pola salah", "Tak dikenal", "Waktu"] as const;

export default function Dasbor() {
  const { id = "" } = useParams();
  const { data } = useApp();
  const [isi, setIsi] = useState<Isi | null>(null);
  const [galat, setGalat] = useState("");
  const [tab, setTab] = useState<(typeof TAB)[number]>("Siswa");
  const [pilih, setPilih] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([data.siswaKelas(id), data.jawabanKelas(id), data.statusKelas(id)])
      .then(([siswa, jawaban, status]) => setIsi({ siswa, jawaban, status })).catch((e) => setGalat(e.message));
  }, [data, id]);

  if (galat) return <p className="galat">{galat}</p>;
  if (!isi) return <p className="redup">Memuat dasbor…</p>;
  const st = new Map(isi.status.map((s) => [`${s.siswaId}|${s.simpul}`, s.status]));
  const nama = new Map(isi.siswa.map((s) => [s.id, s.nama]));

  return (
    <main>
      <p><Link to="/" className="redup">← Kelas saya</Link></p>
      <h2>Dasbor kelas</h2>
      <p className="redup">{isi.siswa.length} siswa · {isi.jawaban.length} jawaban</p>
      <div className="tab" role="tablist">
        {TAB.map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>{t}</button>)}
      </div>

      {tab === "Siswa" && (
        <section className="kartu gulir">
          {!isi.siswa.length && <p>Belum ada siswa. Bagikan kode kelas.</p>}
          {JALUR_UJI.map((j) => (
            <div key={j}>
              <h3>{j}</h3>
              <table>
                <tbody>
                  {isi.siswa.map((s) => (
                    <tr key={s.id}>
                      <td><button className="tombol garis" style={{ padding: "2px 10px", fontSize: ".85rem" }} onClick={() => setPilih(pilih === s.id ? null : s.id)}>{s.nama}</button></td>
                      <td>{simpulJalur(j).map((x) => <Titik key={x.id} status={st.get(`${s.id}|${x.id}`)} />)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          {pilih && (
            <>
              <h3>Riwayat {nama.get(pilih)}</h3>
              <table>
                <thead><tr><th>Simpul</th><th>Jawaban</th><th>Hasil</th><th>Detik</th></tr></thead>
                <tbody>
                  {isi.jawaban.filter((x) => x.siswaId === pilih).slice(-50).reverse().map((x) => (
                    <tr key={x.id}><td>{x.simpul}</td><td>{x.teksJawaban}</td><td>{x.status === "pola" ? x.polaId : x.status}</td><td>{x.detik}</td></tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </section>
      )}

      {tab === "Pola salah" && (
        <section className="kartu">
          {!polaTerbanyak(isi.jawaban).length && <p>Belum ada pola salah.</p>}
          {polaTerbanyak(isi.jawaban).map((p) => (
            <details key={p.polaId}>
              <summary><b>{p.jumlah}×</b> {p.nama} <span className="redup">({p.polaId})</span></summary>
              <p className="redup">{umpanPola(p.polaId)?.sebut}</p>
            </details>
          ))}
        </section>
      )}

      {tab === "Tak dikenal" && (
        <section className="kartu gulir">
          <p className="redup">Jawaban salah yang belum cocok dengan pola mana pun — bahan pola salah baru.</p>
          <table>
            <thead><tr><th>Siswa</th><th>Simpul</th><th>Soal (templat · seed)</th><th>Jawaban</th></tr></thead>
            <tbody>
              {takDikenal(isi.jawaban).map((x) => (
                <tr key={x.id}><td>{nama.get(x.siswaId)}</td><td>{x.simpul}</td><td>{x.templatId} · {x.seed}</td><td><b>{x.teksJawaban}</b></td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab === "Waktu" && (
        <section className="kartu gulir">
          <table>
            <thead><tr><th>Simpul</th><th>Rata-rata</th><th>Target</th><th>n</th></tr></thead>
            <tbody>
              {waktuPerSimpul(isi.jawaban).map((w) => (
                <tr key={w.simpul}><td>{w.simpul} {infoSimpul(w.simpul)?.nama}</td><td style={{ color: w.rataDetik > w.target ? "var(--bolong)" : undefined }}>{w.rataDetik} dtk</td><td>{w.target} dtk</td><td>{w.n}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <p><button className="tombol emas penuh" onClick={() => {
        const url = URL.createObjectURL(new Blob([keCsv(isi.jawaban, isi.siswa)], { type: "text/csv;charset=utf-8" }));
        const a = Object.assign(document.createElement("a"), { href: url, download: `udcation-kelas-${id}.csv` });
        a.click(); URL.revokeObjectURL(url);
      }}>Unduh CSV</button></p>
    </main>
  );
}
