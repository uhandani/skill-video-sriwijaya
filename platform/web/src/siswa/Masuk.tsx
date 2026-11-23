import { useState } from "react";
import { useApp } from "../konteks";

export default function Masuk() {
  const { data, muatUlang } = useApp();
  const [galat, setGalat] = useState("");
  return (
    <main>
      <h1>Isi ulang pondasimu.</h1>
      <p>Pecahan, persamaan, ubah rumus fisika — kuasai dasarnya sekali, pakai seterusnya di MTK &amp; fisika SMA.</p>
      <div className="kartu">
        <button className="tombol emas penuh" onClick={async () => {
          try { await data.masukGoogle(); await muatUlang(); } catch (e) { setGalat(`Gagal masuk: ${(e as Error).message}`); }
        }}>Masuk dengan Google</button>
        {galat && <p className="galat">{galat}</p>}
        <p className="redup">Kami hanya menyimpan nama, email, dan jawabanmu untuk gurumu. Tanpa iklan.</p>
      </div>
    </main>
  );
}
