import type { Status } from "../data/tipe";
export default function Titik({ status }: { status?: Status }) {
  return <span className={`titik ${status ?? "belum"}`} title={status ?? "belum dites"} />;
}
