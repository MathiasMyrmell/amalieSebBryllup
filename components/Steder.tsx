import Image from "next/image";
import { bryllup } from "@/content/bryllup";
import Kart from "./Kart";
import Seksjon from "./Seksjon";

export default function Steder() {
  return (
    <Seksjon id="sted" overtittel="Hvor" tittel="Sted" toner>
      <div className="grid gap-8 sm:grid-cols-2">
        {bryllup.steder.map((sted) => (
          <article
            key={sted.navn + sted.merkelapp}
            className="flex flex-col border border-kant bg-krem"
          >
            {sted.bilde && (
              <div className="relative aspect-[3/2] w-full">
                <Image
                  src={sted.bilde}
                  alt={sted.navn}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex flex-1 flex-col p-8">
              <p className="text-xs uppercase tracking-[0.25em] text-gull">
                {sted.merkelapp}
              </p>
              <h3 className="mt-3 font-display text-3xl font-light">{sted.navn}</h3>
              <p className="mt-3 leading-relaxed text-dempet">{sted.adresse}</p>
              {sted.notat && (
                <p className="mt-4 text-sm leading-relaxed text-dempet">{sted.notat}</p>
              )}

              {sted.kart && (
                <div className="mt-6">
                  <Kart
                    lat={sted.kart.lat}
                    lon={sted.kart.lon}
                    zoom={sted.kart.zoom}
                    tittel={sted.navn}
                    lenke={sted.kartUrl}
                  />
                </div>
              )}

              <a
                href={sted.kartUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 self-start border-b border-salvie pb-0.5 text-sm text-salvie-dyp transition-colors hover:border-salvie-dyp"
              >
                Åpne veibeskrivelse &#8594;
              </a>
            </div>
          </article>
        ))}
      </div>
    </Seksjon>
  );
}
