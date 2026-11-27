import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../konteks";
import type { Kelas } from "../data/tipe";

export default function KelasSaya() {
  const { data, pengguna } = useApp();
  const [kelas, setKelas] = useState<Kelas[] | null>(null);
  const [nama, setNama] = useState("");
  const [galat, setGalat] = useState("");
  const muat = () => void data.kelasGuru().then(setKelas).catch((e) => setGalat(e.message));
  useEffect(muat, [data]);
  return (
    <main>
      <h2>Kelas saya</h2>
      <p className="redup">Selamat datang, {pengguna?.nama}. Bagikan kode kelas ke siswa; mereka masuk dengan Google lalu mengetik kodenya.</p>
      <form className="kartu" onSubmit={async (e) => {
        e.preventDefault(); setGalat("");
        try { await data.buatKelas(nama.trim()); setNama(""); muat(); } catch (err) { setGalat((err as Error).message); }
      }}>
        <label htmlFor="nama-kelas">Nama kelas</label>
        <input id="nama-kelas" className="isian" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="mis. XI IPA 2" />
        <p><button className="tombol penuh" disabled={!nama.trim()}>Buat kelas</button></p>
        {galat && <p className="galat">{galat}</p>}
      </form>
      {kelas?.map((k) => (
        <section className="kartu" key={k.id}>
          <h3><Link to={`/kelas/${k.id}`}>{k.nama}</Link></h3>
          <p>Kode: <b data-testid="kode-kelas" style={{ fontSize: "1.4rem", letterSpacing: ".12em" }}>{k.kode}</b>{" "}
            <button className="tombol garis" style={{ padding: "4px 12px" }} onClick={() => void navigator.clipboard?.writeText(k.kode)}>Salin</button></p>
          <p className="redup">{k.aktif ? "Terbuka untuk siswa baru." : "Ditutup: siswa baru tidak bisa bergabung."}{" "}
            <button className="tombol garis" style={{ padding: "4px 12px" }} onClick={async () => { await data.aturAktif(k.id, !k.aktif); muat(); }}>{k.aktif ? "Tutup" : "Buka"}</button></p>
        </section>
      ))}
    </main>
  );
}
