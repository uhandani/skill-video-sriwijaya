import { afterAll, beforeAll, expect, it } from "vitest";
import type { Browser } from "playwright";
import type { PreviewServer } from "vite";
import { halamanHp, mulai } from "./bantu";

let server: PreviewServer, browser: Browser, url: string;
beforeAll(async () => ({ server, browser, url } = await mulai()));
afterAll(async () => { await browser?.close(); await new Promise<void>((r) => server?.httpServer.close(() => r())); });

it("alur siswa: masuk → gabung → diagnostik → hasil → latihan dengan feedback berlapis", async () => {
  const p = await halamanHp(browser);
  await p.goto(`${url}/?demo=1`);
  await p.getByRole("button", { name: "Masuk dengan Google" }).click();
  await p.getByLabel("Kode kelas").fill("uddemo7");
  await p.getByRole("button", { name: "Gabung" }).click();

  for (const j of ["Pecahan", "Persamaan", "Ubah rumus"]) await expect(p.getByText(j, { exact: false }).first().isVisible()).resolves.toBe(true);

  await p.getByRole("link", { name: /Mulai tes/ }).first().click();
  for (let i = 0; i < 40 && !p.url().includes("/hasil/"); i++) {
    await p.getByLabel("Jawaban").fill("0");
    await p.getByRole("button", { name: "Periksa" }).click();
    await p.waitForTimeout(50);
  }
  expect(p.url()).toContain("/hasil/J07");
  await expect(p.getByText("bolong").first().isVisible()).resolves.toBe(true);

  await p.getByRole("link", { name: "Mulai latihan" }).click();
  await p.getByRole("button", { name: "Mulai soal" }).click();

  // tombol bantu menyisipkan simbol
  await p.getByRole("button", { name: "²" }).click();
  expect(await p.getByLabel("Jawaban").inputValue()).toBe("²");

  const soalAwal = await p.getByTestId("soal").innerText();
  const pola = await p.getByTestId("soal").getAttribute("data-pola-contoh");
  expect(pola).toBeTruthy();
  await p.getByLabel("Jawaban").fill(pola!);
  await p.getByRole("button", { name: "Periksa" }).click();
  await expect(p.getByTestId("umpan-sebut").isVisible()).resolves.toBe(true);
  await p.getByRole("button", { name: "Tunjukkan" }).click();
  await expect(p.getByTestId("umpan-tunjukkan").isVisible()).resolves.toBe(true);
  await p.getByRole("button", { name: "Coba soal kembar" }).click();
  const soalBaru = await p.getByTestId("soal").innerText();
  expect(soalBaru).not.toBe(soalAwal);
});
