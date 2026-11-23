import { buatKodeKelas } from "./kode";
import type { BarisJawaban, Data, Kelas, Pengguna, Status } from "./tipe";

export { buatKodeKelas };

type KelasM = Kelas & { guruId: string };

/** Data di memori: untuk tes & mode demo (?demo=1). Aturan akses meniru RLS Supabase. */
export function dataMemori(awal: { pengguna?: Pengguna; guruDiizinkan?: string[]; kelasAwal?: { nama: string; kode: string; guruId: string }[] } = {}) {
  const guru = new Set((awal.guruDiizinkan ?? []).map((e) => e.toLowerCase()));
  const profil = new Map<string, Pengguna>();
  const kelas: KelasM[] = (awal.kelasAwal ?? []).map((k, i) => ({ id: `k-awal-${i + 1}`, aktif: true, ...k }));
  const anggota = new Map<string, string>(); // siswaId → kelasId
  const jawaban = new Map<string, BarisJawaban>();
  const status = new Map<string, { siswaId: string; simpul: string; status: Status }>();
  let kini: Pengguna | null = null;

  const masuk = (p: Omit<Pengguna, "peran">) => {
    const peran = guru.has(p.email.toLowerCase()) ? "guru" : "siswa";
    kini = { ...p, peran };
    profil.set(p.id, kini);
  };
  if (awal.pengguna) masuk(awal.pengguna);

  const saya = () => { if (!kini) throw new Error("belum masuk"); return kini; };
  const milikGuru = (kelasId: string) => {
    const k = kelas.find((x) => x.id === kelasId);
    if (!k || k.guruId !== saya().id) throw new Error("bukan kelas Anda");
    return k;
  };
  const tanpaGuru = ({ guruId: _, ...k }: KelasM): Kelas => k;

  const d: Data & { _masukSebagai(p: Omit<Pengguna, "peran">): void } = {
    _masukSebagai: masuk,
    async pengguna() { return kini; },
    async masukGoogle() { masuk({ id: "demo-siswa", nama: "Siswa Demo", email: "demo@udcation.id" }); },
    async keluar() { kini = null; },
    async kelasSaya() {
      const id = anggota.get(saya().id);
      const k = kelas.find((x) => x.id === id);
      return k ? tanpaGuru(k) : null;
    },
    async gabungKelas(kode) {
      const k = kelas.find((x) => x.kode === kode.trim().toUpperCase());
      if (!k) return { ok: false, alasan: "tidak-ada" };
      if (!k.aktif) return { ok: false, alasan: "nonaktif" };
      if (anggota.has(saya().id)) return { ok: false, alasan: "sudah-punya-kelas" };
      anggota.set(saya().id, k.id);
      return { ok: true, kelas: tanpaGuru(k) };
    },
    async simpanJawaban(j) {
      if (j.siswaId !== saya().id) throw new Error("bukan jawaban Anda");
      jawaban.set(j.id, { ...j });
    },
    async simpanStatus(simpul, st) {
      status.set(`${saya().id}|${simpul}`, { siswaId: saya().id, simpul, status: st });
    },
    async statusSaya() {
      return Object.fromEntries([...status.values()].filter((s) => s.siswaId === saya().id).map((s) => [s.simpul, s.status]));
    },
    async riwayatSaya() { return [...jawaban.values()].filter((j) => j.siswaId === saya().id); },
    async buatKelas(nama) {
      if (saya().peran !== "guru") throw new Error("hanya guru");
      const k: KelasM = { id: `k${kelas.length + 1}`, nama, kode: buatKodeKelas(), aktif: true, guruId: saya().id };
      kelas.push(k);
      return tanpaGuru(k);
    },
    async kelasGuru() { return kelas.filter((k) => k.guruId === saya().id).map(tanpaGuru); },
    async aturAktif(id, aktif) { milikGuru(id).aktif = aktif; },
    async siswaKelas(id) {
      milikGuru(id);
      return [...anggota].filter(([, k]) => k === id).map(([s]) => profil.get(s)!).filter(Boolean);
    },
    async jawabanKelas(id) { milikGuru(id); return [...jawaban.values()].filter((j) => j.kelasId === id); },
    async statusKelas(id) {
      milikGuru(id);
      const ids = new Set([...anggota].filter(([, k]) => k === id).map(([s]) => s));
      return [...status.values()].filter((s) => ids.has(s.siswaId));
    },
  };
  return d;
}
