import type { Storyboard } from "../storyboard/types";
import pythagoras from "./pythagoras-345.json";
import parabola from "./gerak-parabola-45.json";
import asalUsulX from "./asal-usul-x.json";
import bulan from "./bulan-tidak-jatuh.json";
import pinisi from "./pinisi-terapung.json";
import borobudur from "./borobudur-tanpa-semen.json";
import lambang1 from "./lambang-fisika-part1.json";
import lambang2 from "./lambang-fisika-part2.json";
import lambang3 from "./lambang-fisika-part3.json";
import lambang4 from "./lambang-fisika-part4.json";

/**
 * Daftar semua video. Video baru = tambah file JSON di folder ini
 * lalu tambahkan satu baris import + entri di array ini.
 */
export const STORYBOARDS: Storyboard[] = [pythagoras as Storyboard, parabola as Storyboard, asalUsulX as Storyboard, bulan as Storyboard, pinisi as Storyboard, borobudur as Storyboard, lambang1 as Storyboard, lambang2 as Storyboard, lambang3 as Storyboard, lambang4 as Storyboard];
