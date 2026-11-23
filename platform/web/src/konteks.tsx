import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { buatAntrean } from "./data/antrean";
import { dataMemori } from "./data/memori";
import { dataSupabase } from "./data/supabase";
import type { BarisJawaban, Data, Kelas, Pengguna } from "./data/tipe";

export const DEMO_KODE = "KAWUNG7";

function pilihData(): { data: Data | null; demo: boolean } {
  const q = new URLSearchParams(location.search);
  let demo = false;
  try {
    if (q.get("demo") === "1") sessionStorage.setItem("udcation-demo", q.get("peran") === "guru" ? "guru" : "siswa");
    demo = !!sessionStorage.getItem("udcation-demo");
  } catch { demo = q.get("demo") === "1"; }
  if (demo) {
    const sebagaiGuru = q.get("peran") === "guru" || (() => { try { return sessionStorage.getItem("udcation-demo") === "guru"; } catch { return false; } })();
    const d = dataMemori({
      guruDiizinkan: ["guru-demo@udcation.id"],
      kelasAwal: [{ nama: "Kelas Demo", kode: DEMO_KODE, guruId: "demo-guru" }],
    });
    if (sebagaiGuru) d._masukSebagai({ id: "demo-guru", nama: "Guru Demo", email: "guru-demo@udcation.id" });
    return { data: d, demo: true };
  }
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const kunci = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  return { data: url && kunci ? dataSupabase(url, kunci) : null, demo: false };
}

type Konteks = {
  data: Data; demo: boolean; pengguna: Pengguna | null; kelas: Kelas | null; siap: boolean;
  muatUlang(): Promise<void>; kirimJawaban(j: BarisJawaban): Promise<void>; tertunda: number;
};
const K = createContext<Konteks | null>(null);
export const useApp = () => { const k = useContext(K); if (!k) throw new Error("di luar penyedia"); return k; };

export function PenyediaApp({ children }: { children: ReactNode }) {
  const [{ data, demo }] = useState(pilihData);
  const [pengguna, setPengguna] = useState<Pengguna | null>(null);
  const [kelas, setKelas] = useState<Kelas | null>(null);
  const [siap, setSiap] = useState(false);
  const [tertunda, setTertunda] = useState(0);

  const antrean = useMemo(() => data && buatAntrean((j) => data.simpanJawaban(j), (() => { try { return localStorage; } catch { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) }; } })()), [data]);

  const muatUlang = useCallback(async () => {
    if (!data) return;
    const p = await data.pengguna().catch(() => null);
    setPengguna(p);
    setKelas(p?.peran === "siswa" ? await data.kelasSaya().catch(() => null) : null);
    setSiap(true);
  }, [data]);

  useEffect(() => { void muatUlang(); }, [muatUlang]);
  useEffect(() => {
    if (!antrean) return;
    const kirim = () => void antrean.kirimUlang().then(() => setTertunda(antrean.jumlah()));
    kirim();
    addEventListener("online", kirim);
    const t = setInterval(kirim, 30_000);
    return () => { removeEventListener("online", kirim); clearInterval(t); };
  }, [antrean]);

  if (!data) return (
    <div className="kartu">
      <h2>Belum terhubung ke server</h2>
      <p>Aplikasi ini belum disambungkan ke database. Coba <a href="/?demo=1">mode demo</a>.</p>
    </div>
  );

  const nilai: Konteks = {
    data, demo, pengguna, kelas, siap, muatUlang, tertunda,
    async kirimJawaban(j) { await antrean!.tambah(j); setTertunda(antrean!.jumlah()); },
  };
  return <K.Provider value={nilai}>{children}</K.Provider>;
}
