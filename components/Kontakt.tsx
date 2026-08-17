import Image from "next/image";
import { bryllup } from "@/content/bryllup";
import Seksjon from "./Seksjon";

/** Gjør et norsk telefonnummer om til noe tel:-lenken forstår */
function telLenke(nummer: string) {
  return `tel:${nummer.replace(/[^\d+]/g, "")}`;
}

/** «Frida Krüger Hansen» → «FH». Brukes når personen mangler bilde. */
function initialer(navn: string) {
  const ord = navn.trim().split(/\s+/).filter(Boolean);
  if (ord.length === 0) return "";
  const forste = ord[0][0];
  const siste = ord.length > 1 ? ord[ord.length - 1][0] : "";
  return (forste + siste).toUpperCase();
}

export default function Kontakt() {
  return (
    <Seksjon id="kontakt" overtittel="Spørsmål?" tittel="Ta kontakt" toner>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {bryllup.kontakter.map((person) => (
          <article
            key={`${person.rolle}-${person.navn}`}
            className="flex flex-col items-center border border-kant bg-krem p-7 text-center"
          >
            <Portrett navn={person.navn} bilde={person.bilde} />

            <p className="mt-5 text-xs uppercase tracking-[0.25em] text-gull">
              {person.rolle}
            </p>
            <h3 className="mt-2 font-display text-2xl font-light">{person.navn}</h3>

            <div className="mt-3 space-y-1 text-sm">
              {person.telefon && (
                <a
                  href={telLenke(person.telefon)}
                  className="block text-dempet transition-colors hover:text-salvie-dyp"
                >
                  {person.telefon}
                </a>
              )}
              {person.epost && (
                <a
                  href={`mailto:${person.epost}`}
                  className="block break-all text-dempet transition-colors hover:text-salvie-dyp"
                >
                  {person.epost}
                </a>
              )}
            </div>

            {person.notat && (
              <p className="mt-4 text-sm leading-relaxed text-dempet">{person.notat}</p>
            )}
          </article>
        ))}
      </div>
    </Seksjon>
  );
}

/** Rundt portrettbilde, eller initialer så lenge bildet mangler */
function Portrett({ navn, bilde }: { navn: string; bilde: string }) {
  if (!bilde) {
    return (
      <div
        aria-hidden
        className="flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-kant bg-krem-dyp font-display text-2xl font-light text-gull"
      >
        {initialer(navn)}
      </div>
    );
  }

  return (
    <div className="relative h-24 w-24 overflow-hidden rounded-full">
      <Image
        src={bilde}
        alt={navn}
        fill
        sizes="96px"
        className="object-cover"
      />
    </div>
  );
}
