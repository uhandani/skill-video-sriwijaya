import { afterAll, beforeAll, expect, it } from "vitest";
import type { Browser } from "playwright";
import type { PreviewServer } from "vite";
import { halamanHp, mulai } from "./bantu";

let server: PreviewServer, browser: Browser, url: string;
beforeAll(async () => ({ server, browser, url } = await mulai()));
afterAll(async () => { await browser?.close(); await new Promise<void>((r) => server?.httpServer.close(() => r())); });

it("alur guru: buat kelas → kode → dasbor 4 tab", async () => {
  const p = await halamanHp(browser);
  const galat: string[] = [];
  p.on("pageerror", (e) => galat.push(e.message));
  await p.goto(`${url}/?demo=1&peran=guru`);
  await p.getByLabel("Nama kelas").fill("XI IPA 2");
  await p.getByRole("button", { name: "Buat kelas" }).click();
  const kode = await p.getByTestId("kode-kelas").last().innerText();
  expect(kode).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{7}$/);
  await p.getByRole("link", { name: /XI IPA 2/ }).click();
  for (const t of ["Siswa", "Pola salah", "Tak dikenal", "Waktu"]) {
    await p.getByRole("tab", { name: t }).click();
    await expect(p.getByRole("tab", { name: t }).getAttribute("aria-selected")).resolves.toBe("true");
  }
  await expect(p.getByRole("button", { name: "Unduh CSV" }).isVisible()).resolves.toBe(true);
  expect(galat).toEqual([]);
});
