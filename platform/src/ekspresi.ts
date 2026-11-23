import { buatAcak } from "./acak";

export type Ekspresi =
  | { k: "bil"; n: number }
  | { k: "var"; v: string }
  | { k: "neg"; a: Ekspresi }
  | { k: "akar"; a: Ekspresi }
  | { k: "op"; op: "+" | "-" | "*" | "/" | "^"; a: Ekspresi; b: Ekspresi };

type Token = { t: "bil"; n: number } | { t: "var"; v: string } | { t: "sim"; s: string };

const SIMBOL: Record<string, string> = {
  "+": "+", "-": "-", "−": "-", "–": "-", "*": "*", "×": "*", "·": "*", "⋅": "*",
  "/": "/", "÷": "/", ":": "/", "^": "^", "(": "(", ")": ")", "√": "√",
};

function tokenisasi(teks: string): Token[] | null {
  const hasil: Token[] = [];
  let i = 0;
  while (i < teks.length) {
    const c = teks[i];
    if (/\s/.test(c)) { i++; continue; }
    const m = /^\d+(?:[.,]\d+)?/.exec(teks.slice(i));
    if (m) { hasil.push({ t: "bil", n: Number(m[0].replace(",", ".")) }); i += m[0].length; continue; }
    if (SIMBOL[c]) { hasil.push({ t: "sim", s: SIMBOL[c] }); i++; continue; }
    if (/\p{L}/u.test(c)) { hasil.push({ t: "var", v: c }); i++; continue; }
    return null;
  }
  return hasil;
}

/** Baca ekspresi ketikan siswa (perkalian tersirat: 2x, ma). null bila tak terbaca. */
export function bacaEkspresi(teks: string): Ekspresi | null {
  const hasilTk = tokenisasi(teks);
  if (!hasilTk || hasilTk.length === 0) return null;
  const tk: Token[] = hasilTk;
  let i = 0;
  const lihat = () => tk[i];
  const sim = (s: string) => { const t = tk[i]; return t?.t === "sim" && t.s === s; };
  const awalFaktor = () => { const t = tk[i]; return !!t && (t.t !== "sim" || t.s === "(" || t.s === "√"); };

  function jumlah(): Ekspresi {
    let a = kali();
    while (sim("+") || sim("-")) { const op = (tk[i++] as { s: "+" | "-" }).s; a = { k: "op", op, a, b: kali() }; }
    return a;
  }
  function kali(): Ekspresi {
    let a = unar();
    for (;;) {
      if (sim("*") || sim("/")) { const op = (tk[i++] as { s: "*" | "/" }).s; a = { k: "op", op, a, b: unar() }; }
      else if (awalFaktor()) a = { k: "op", op: "*", a, b: pangkat() };
      else return a;
    }
  }
  function unar(): Ekspresi {
    if (sim("-")) { i++; return { k: "neg", a: unar() }; }
    if (sim("+")) { i++; return unar(); }
    return pangkat();
  }
  function pangkat(): Ekspresi {
    const a = atom();
    if (sim("^")) { i++; return { k: "op", op: "^", a, b: unar() }; }
    return a;
  }
  function atom(): Ekspresi {
    const t = lihat();
    if (!t) throw 0;
    if (t.t === "bil") { i++; return { k: "bil", n: t.n }; }
    if (t.t === "var") { i++; return { k: "var", v: t.v }; }
    if (t.s === "(") { i++; const e = jumlah(); if (!sim(")")) throw 0; i++; return e; }
    if (t.s === "√") { i++; return { k: "akar", a: pangkat() }; }
    throw 0;
  }
  try {
    const e = jumlah();
    return i === tk.length ? e : null;
  } catch {
    return null;
  }
}

export function nilai(e: Ekspresi, v: Record<string, number>): number {
  switch (e.k) {
    case "bil": return e.n;
    case "var": return e.v in v ? v[e.v] : NaN;
    case "neg": return -nilai(e.a, v);
    case "akar": return Math.sqrt(nilai(e.a, v));
    case "op": {
      const a = nilai(e.a, v), b = nilai(e.b, v);
      return e.op === "+" ? a + b : e.op === "-" ? a - b : e.op === "*" ? a * b : e.op === "/" ? a / b : a ** b;
    }
  }
}

export function variabelDari(e: Ekspresi): string[] {
  const s = new Set<string>();
  const jalan = (x: Ekspresi) => {
    if (x.k === "var") s.add(x.v);
    else if (x.k === "neg" || x.k === "akar") jalan(x.a);
    else if (x.k === "op") { jalan(x.a); jalan(x.b); }
  };
  jalan(e);
  return [...s].sort();
}

/** Setara bila nilainya sama di ≥ 3 titik uji sah (7 titik acak, seed 7, rentang 1,5–9,5). */
export function setara(a: Ekspresi, b: Ekspresi, variabel: string[]): boolean {
  const acak = buatAcak(7);
  let sah = 0;
  for (let n = 0; n < 7; n++) {
    const titik: Record<string, number> = {};
    for (const v of variabel) titik[v] = 1.5 + acak.dasar() * 8;
    const x = nilai(a, titik), y = nilai(b, titik);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    if (Math.abs(x - y) > 1e-9 * Math.max(1, Math.abs(x), Math.abs(y))) return false;
    sah++;
  }
  return sah >= 3;
}
