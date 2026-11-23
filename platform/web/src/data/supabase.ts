import { createClient } from "@supabase/supabase-js";
import { buatKodeKelas } from "./kode";
import type { BarisJawaban, Data, HasilGabung, Kelas, Pengguna, Status } from "./tipe";

type BarisDb = {
  id: string; siswa_id: string; kelas_id: string; mode: BarisJawaban["mode"]; simpul: string; templat_id: string;
  seed: number; teks_jawaban: string; status: BarisJawaban["status"]; pola_id: string | null; detik: number; dibuat: string;
};
const keDb = (j: BarisJawaban): BarisDb => ({
  id: j.id, siswa_id: j.siswaId, kelas_id: j.kelasId, mode: j.mode, simpul: j.simpul, templat_id: j.templatId,
  seed: j.seed, teks_jawaban: j.teksJawaban, status: j.status, pola_id: j.polaId, detik: j.detik, dibuat: j.dibuat,
});
const dariDb = (r: BarisDb): BarisJawaban => ({
  id: r.id, siswaId: r.siswa_id, kelasId: r.kelas_id, mode: r.mode, simpul: r.simpul, templatId: r.templat_id,
  seed: r.seed, teksJawaban: r.teks_jawaban, status: r.status, polaId: r.pola_id, detik: r.detik, dibuat: r.dibuat,
});
const KOLOM_KELAS = "id, nama, kode, aktif";

function periksa<T>(r: { data: T; error: { message: string } | null }): T {
  if (r.error) throw new Error(r.error.message);
  return r.data;
}

export function dataSupabase(url: string, kunci: string): Data {
  const sb = createClient(url, kunci);
  const idSaya = async () => {
    const { data } = await sb.auth.getUser();
    if (!data.user) throw new Error("belum masuk");
    return data.user.id;
  };

  return {
    async pengguna() {
      const { data } = await sb.auth.getUser();
      if (!data.user) return null;
      const p = await sb.from("profil").select("id, nama, email, peran").eq("id", data.user.id).maybeSingle();
      return (periksa(p) as Pengguna | null) ?? null;
    },
    async masukGoogle() {
      const { error } = await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.origin } });
      if (error) throw new Error(error.message);
    },
    async keluar() { await sb.auth.signOut(); },
    async kelasSaya() {
      const r = await sb.from("anggota").select(`kelas(${KOLOM_KELAS})`).eq("siswa_id", await idSaya()).maybeSingle();
      const d = periksa(r) as { kelas: Kelas | null } | null;
      return d?.kelas ?? null;
    },
    async gabungKelas(kode) {
      return periksa(await sb.rpc("gabung_kelas", { kode_masuk: kode.trim().toUpperCase() })) as HasilGabung;
    },
    async simpanJawaban(j) { periksa(await sb.from("jawaban").upsert(keDb(j))); },
    async simpanStatus(simpul, status, sumber) {
      periksa(await sb.from("status_simpul").upsert({ siswa_id: await idSaya(), simpul, status, sumber, diperbarui: new Date().toISOString() }));
    },
    async statusSaya() {
      const r = periksa(await sb.from("status_simpul").select("simpul, status").eq("siswa_id", await idSaya())) as { simpul: string; status: Status }[];
      return Object.fromEntries(r.map((x) => [x.simpul, x.status]));
    },
    async riwayatSaya() {
      const r = periksa(await sb.from("jawaban").select("*").eq("siswa_id", await idSaya()).order("dibuat")) as BarisDb[];
      return r.map(dariDb);
    },
    async buatKelas(nama) {
      const guru = await idSaya();
      for (let i = 0; i < 5; i++) {
        const r = await sb.from("kelas").insert({ nama, kode: buatKodeKelas(), guru_id: guru }).select(KOLOM_KELAS).single();
        if (!r.error) return r.data as Kelas;
        if (!r.error.message.includes("duplicate")) throw new Error(r.error.message);
      }
      throw new Error("gagal membuat kode kelas unik");
    },
    async kelasGuru() {
      return periksa(await sb.from("kelas").select(KOLOM_KELAS).eq("guru_id", await idSaya()).order("dibuat")) as Kelas[];
    },
    async aturAktif(id, aktif) { periksa(await sb.from("kelas").update({ aktif }).eq("id", id)); },
    async siswaKelas(id) {
      const r = periksa(await sb.from("anggota").select("profil(id, nama, email, peran)").eq("kelas_id", id)) as unknown as { profil: Pengguna | null }[];
      return r.map((x) => x.profil).filter((p): p is Pengguna => !!p);
    },
    async jawabanKelas(id) {
      const r = periksa(await sb.from("jawaban").select("*").eq("kelas_id", id).order("dibuat")) as BarisDb[];
      return r.map(dariDb);
    },
    async statusKelas(id) {
      const siswa = (periksa(await sb.from("anggota").select("siswa_id").eq("kelas_id", id)) as { siswa_id: string }[]).map((x) => x.siswa_id);
      if (!siswa.length) return [];
      const r = periksa(await sb.from("status_simpul").select("siswa_id, simpul, status").in("siswa_id", siswa)) as { siswa_id: string; simpul: string; status: Status }[];
      return r.map((x) => ({ siswaId: x.siswa_id, simpul: x.simpul, status: x.status }));
    },
  };
}
