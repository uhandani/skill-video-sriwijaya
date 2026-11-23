import type { RefObject } from "react";

const TOMBOL = ["/", "²", "√", "(", ")", "−"];

/** Tombol bantu ketik untuk HP: menyisipkan simbol di posisi kursor. */
export default function PapanBantu({ isian, nilai, ubah }: { isian: RefObject<HTMLInputElement | null>; nilai: string; ubah(v: string): void }) {
  return (
    <div className="papan">
      {TOMBOL.map((t) => (
        <button key={t} type="button" onClick={() => {
          const el = isian.current;
          const a = el?.selectionStart ?? nilai.length, b = el?.selectionEnd ?? nilai.length;
          const sisip = t === "−" ? "-" : t;
          ubah(nilai.slice(0, a) + sisip + nilai.slice(b));
          requestAnimationFrame(() => { el?.focus(); el?.setSelectionRange(a + sisip.length, a + sisip.length); });
        }}>{t}</button>
      ))}
    </div>
  );
}
