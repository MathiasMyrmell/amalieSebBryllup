import { bryllup } from "@/content/bryllup";
import Seksjon from "./Seksjon";

export default function Praktisk() {
  return (
    <Seksjon id="praktisk" overtittel="Godt å vite" tittel="Praktisk informasjon">
      <dl className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
        {bryllup.praktisk.map((punkt) => (
          <div key={punkt.tittel}>
            <dt className="font-display text-2xl font-light">{punkt.tittel}</dt>
            <dd className="mt-2 leading-relaxed text-dempet">{punkt.tekst}</dd>
          </div>
        ))}
      </dl>
    </Seksjon>
  );
}
