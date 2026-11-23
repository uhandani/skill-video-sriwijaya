import type { ReactNode } from "react";
import { modulSimpul } from "../penilai";

/** Tampilkan modul markdown (subset sederhana); bagian "Latihan bertahap" disembunyikan dari siswa. */
function render(md: string): ReactNode[] {
  const out: ReactNode[] = [];
  let lewati = false;
  const inline = (t: string) => t.split(/(\*\*[^*]+\*\*)/g).map((x, i) => x.startsWith("**") ? <b key={i}>{x.slice(2, -2)}</b> : x);
  md.split("\n").forEach((baris, i) => {
    if (baris.startsWith("## ")) lewati = baris.includes("Latihan bertahap");
    if (lewati || !baris.trim()) return;
    if (baris.startsWith("# ")) out.push(<h1 key={i}>{baris.slice(2)}</h1>);
    else if (baris.startsWith("## ")) out.push(<h3 key={i}>{baris.slice(3)}</h3>);
    else if (baris.startsWith("> ")) out.push(<p key={i} className="redup">{inline(baris.slice(2))}</p>);
    else if (/^\d+\. /.test(baris)) out.push(<p key={i}>• {inline(baris.replace(/^\d+\. /, ""))}</p>);
    else out.push(<p key={i}>{inline(baris)}</p>);
  });
  return out;
}

export default function KartuModul({ simpul, children }: { simpul: string; children?: ReactNode }) {
  const md = modulSimpul(simpul);
  return (
    <section className="kartu modul">
      {md ? render(md) : <p>Modul belum tersedia.</p>}
      {children}
    </section>
  );
}
