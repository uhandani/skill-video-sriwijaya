import { useRef } from "react";
import PapanBantu from "./PapanBantu";

export default function IsianJawaban({ nilai, ubah, kirim, nonaktif }: { nilai: string; ubah(v: string): void; kirim(): void; nonaktif?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (nilai.trim()) kirim(); }}>
      <label htmlFor="jawaban" className="redup">Jawaban</label>
      <input id="jawaban" ref={ref} className="isian" value={nilai} onChange={(e) => ubah(e.target.value)}
        autoComplete="off" autoCorrect="off" spellCheck={false} inputMode="text" maxLength={500} disabled={nonaktif} />
      <PapanBantu isian={ref} nilai={nilai} ubah={ubah} />
      <button className="tombol penuh" disabled={nonaktif || !nilai.trim()}>Periksa</button>
    </form>
  );
}
