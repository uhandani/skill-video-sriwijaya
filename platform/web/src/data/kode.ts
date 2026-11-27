const ALFABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
/** Kode kelas 7 karakter tanpa huruf/angka mirip (O/0, I/1). */
export function buatKodeKelas(acak: () => number = Math.random): string {
  return Array.from({ length: 7 }, () => ALFABET[Math.floor(acak() * ALFABET.length)]).join("");
}
