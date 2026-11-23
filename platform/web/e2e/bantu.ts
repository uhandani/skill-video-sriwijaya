import { createRequire } from "node:module";
import { preview, type PreviewServer } from "vite";
import type { Browser, Page } from "playwright";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright") as typeof import("playwright");

export async function mulai(): Promise<{ server: PreviewServer; browser: Browser; url: string }> {
  const server = await preview({ root: new URL("..", import.meta.url).pathname, preview: { port: 4178, strictPort: true } });
  const browser = await chromium.launch();
  return { server, browser, url: "http://localhost:4178" };
}

export async function halamanHp(browser: Browser): Promise<Page> {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  return ctx.newPage();
}
