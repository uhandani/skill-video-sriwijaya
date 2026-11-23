import { useState } from "react";
import { useApp } from "../konteks";

const PESAN = {
  "tidak-ada": "Kode itu tidak ditemukan. Cek lagi huruf dan angkanya, ya.",
  nonaktif: "Kelas ini sedang ditutup. Tanyakan ke gurumu.",
  "sudah-punya-kelas": "Kamu sudah tergabung di sebuah kelas.",
} as const;

export default function GabungKelas() {
  const { data, muatUlang, pengguna } = useApp();
  const [kode, setKode] = useState("");
  const [galat, setGalat] = useState("");
  const [sibuk, setSibuk] = useState(false);
  return (
    <main>
      <h2>Halo, {pengguna?.nama.split(" ")[0]}!</h2>
      <p>Ketik kode kelas dari gurumu.</p>
      <form className="kartu" onSubmit={async (e) => {
        e.preventDefault();
        setSibuk(true); setGalat("");
        try {
          const r = await data.gabungKelas(kode);
          if (r.ok || r.alasan === "sudah-punya-kelas") await muatUlang();
          else setGalat(PESAN[r.alasan]);
        } catch (err) { setGalat(`Gagal: ${(err as Error).message}`); }
        setSibuk(false);
      }}>
        <label htmlFor="kode">Kode kelas</label>
        <input id="kode" className="isian" value={kode} onChange={(e) => setKode(e.target.value.toUpperCase())}
          autoCapitalize="characters" autoComplete="off" maxLength={7} placeholder="mis. KAWUNG7" />
        <p><button className="tombol penuh" disabled={sibuk || kode.trim().length < 7}>Gabung</button></p>
        {galat && <p className="galat" role="alert">{galat}</p>}
      </form>
    </main>
  );
}
