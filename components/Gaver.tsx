import { bryllup } from "@/content/bryllup";
import Seksjon from "./Seksjon";

export default function Gaver() {
  return (
    <Seksjon id="gaver" overtittel="Ønskeliste" tittel="Gaver" toner>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-lg leading-relaxed text-dempet">{bryllup.gaver.tekst}</p>

        {bryllup.gaver.lenker.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {bryllup.gaver.lenker.map((lenke) => (
              <a
                key={lenke.navn}
                href={lenke.url}
                target="_blank"
                rel="noreferrer"
                className="border border-salvie-dyp px-8 py-3 text-xs uppercase tracking-[0.2em] text-salvie-dyp transition-colors hover:bg-salvie-dyp hover:text-krem"
              >
                {lenke.navn}
              </a>
            ))}
          </div>
        )}
      </div>
    </Seksjon>
  );
}
