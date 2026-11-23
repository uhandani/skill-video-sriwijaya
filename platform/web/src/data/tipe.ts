import type { HasilCek } from "../../../src/cek";
import type { Status } from "../../../src/peta";

export type { Status };
export type Peran = "siswa" | "guru";
export type Pengguna = { id: string; nama: string; email: string; peran: Peran };
export type Kelas = { id: string; nama: string; kode: string; aktif: boolean };
export type ModeJawaban = "diagnostik" | "latihan" | "langkah";
export type BarisJawaban = {
  id: string; siswaId: string; kelasId: string; mode: ModeJawaban;
  simpul: string; templatId: string; seed: number; teksJawaban: string; status: HasilCek["status"];
  polaId: string | null; detik: number; dibuat: string;
};
export type HasilGabung = { ok: true; kelas: Kelas } | { ok: false; alasan: "tidak-ada" | "nonaktif" | "sudah-punya-kelas" };

/** Satu-satunya pintu ke data. Opsi B nanti: ganti implementasi, layar tetap. */
export interface Data {
  pengguna(): Promise<Pengguna | null>;
  masukGoogle(): Promise<void>;
  keluar(): Promise<void>;
  kelasSaya(): Promise<Kelas | null>;
  gabungKelas(kode: string): Promise<HasilGabung>;
  simpanJawaban(j: BarisJawaban): Promise<void>;
  simpanStatus(simpul: string, status: Status, sumber: "diagnostik" | "latihan"): Promise<void>;
  statusSaya(): Promise<Record<string, Status>>;
  riwayatSaya(): Promise<BarisJawaban[]>;
  buatKelas(nama: string): Promise<Kelas>;
  kelasGuru(): Promise<Kelas[]>;
  aturAktif(kelasId: string, aktif: boolean): Promise<void>;
  siswaKelas(kelasId: string): Promise<Pengguna[]>;
  jawabanKelas(kelasId: string): Promise<BarisJawaban[]>;
  statusKelas(kelasId: string): Promise<{ siswaId: string; simpul: string; status: Status }[]>;
}
