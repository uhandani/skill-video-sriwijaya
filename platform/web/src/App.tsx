import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { PenyediaApp, useApp } from "./konteks";
import Masuk from "./siswa/Masuk";
import GabungKelas from "./siswa/GabungKelas";
import Beranda from "./siswa/Beranda";
import Diagnostik from "./siswa/Diagnostik";
import Hasil from "./siswa/Hasil";
import Latihan from "./siswa/Latihan";
import KelasSaya from "./guru/KelasSaya";
import Dasbor from "./guru/Dasbor";

function Kepala() {
  const { pengguna, data, muatUlang, tertunda, demo } = useApp();
  return (
    <header className="kepala">
      <Link to="/" className="logo">Δ <b>UD</b>cation</Link>
      <span className="redup">
        {demo && "Demo · "}
        {tertunda > 0 && `${tertunda} jawaban menunggu sinyal · `}
        {pengguna && <button className="tombol garis" style={{ padding: "4px 12px", fontSize: ".85rem" }} onClick={async () => { await data.keluar(); await muatUlang(); }}>Keluar</button>}
      </span>
    </header>
  );
}

function Rute() {
  const { siap, pengguna, kelas } = useApp();
  if (!siap) return <p className="redup">Memuat…</p>;
  if (!pengguna) return <Masuk />;
  if (pengguna.peran === "guru")
    return (
      <Routes>
        <Route path="/" element={<KelasSaya />} />
        <Route path="/kelas/:id" element={<Dasbor />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  if (!kelas) return <GabungKelas />;
  return (
    <Routes>
      <Route path="/" element={<Beranda />} />
      <Route path="/tes/:jalur" element={<Diagnostik />} />
      <Route path="/hasil/:jalur" element={<Hasil />} />
      <Route path="/latihan/:simpul" element={<Latihan />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PenyediaApp>
        <Kepala />
        <Rute />
      </PenyediaApp>
    </BrowserRouter>
  );
}
