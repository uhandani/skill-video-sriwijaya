import type { Templat } from "../../src/templat";
import { TEMPLAT_J07 } from "./j07-pecahan";
import { TEMPLAT_J12 } from "./j12-persamaan";
import { TEMPLAT_J13 } from "./j13-ubah-rumus";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SEMUA_TEMPLAT: Templat<any>[] = [...TEMPLAT_J07, ...TEMPLAT_J12, ...TEMPLAT_J13];
