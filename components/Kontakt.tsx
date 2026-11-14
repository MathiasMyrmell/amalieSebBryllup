import Image from "next/image";
import { bryllup } from "@/content/bryllup";
import { innfeltFlate, kortFlate } from "@/lib/flater";
import Seksjon from "./Seksjon";

type Person = (typeof bryllup.kontakter)[number];

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

export default function Kontakt({ toner }: { toner?: boolean }) {
  const hoved = bryllup.kontakter.find((p) => p.hoved);
  const ovrige = bryllup.kontakter.filter((p) => p !== hoved);
  const kort = kortFlate(toner);
  const innfelt = innfeltFlate(toner);

  return (
    <Seksjon id="kontakt" overtittel="Spørsmål?" tittel="Ta kontakt" toner={toner}>
      {hoved && <Hovedkort person={hoved} kort={kort} innfelt={innfelt} />}

      <div className={`grid gap-6 sm:grid-cols-3 ${hoved ? "mt-6" : ""}`}>
        {ovrige.map((person) => (
          <Kort
            key={`${person.rolle}-${person.navn}`}
            person={person}
            kort={kort}
            innfelt={innfelt}
          />
        ))}
      </div>
    </Seksjon>
  );
}

/**
 * Bredt kort for hovedkontakten, satt opp i tre kolonner:
 * bilde – navn og kontaktinfo – hva personen kan kontaktes om.
 * På mobil stables kolonnene under hverandre og sentreres.
 */
function Hovedkort({
  person,
  kort,
  innfelt,
}: {
  person: Person;
  kort: string;
  innfelt: string;
}) {
  return (
    <article
      className={`grid items-center gap-7 border border-salvie/40 p-8 text-center sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.1fr)] sm:items-start sm:gap-10 sm:p-10 sm:text-left ${kort}`}
    >
      {/* Kolonne 1 */}
      <div className="flex justify-center">
        <Portrett
          navn={person.navn}
          bilde={person.bilde}
          storrelse={128}
          innfelt={innfelt}
        />
      </div>

      {/* Kolonne 2 */}
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-gull">{person.rolle}</p>
        <h3 className="mt-2 font-display text-4xl font-light">{person.navn}</h3>

        <div className="mt-4 space-y-1 text-sm">
          {person.telefon && (
            <a
              href={telLenke(person.telefon)}
              className="block text-salvie-dyp underline-offset-4 transition-colors hover:underline"
            >
              {person.telefon}
            </a>
          )}
          {person.epost && (
            <a
              href={`mailto:${person.epost}`}
              className="block break-all text-salvie-dyp underline-offset-4 transition-colors hover:underline"
            >
              {person.epost}
            </a>
          )}
        </div>
      </div>

      {/* Kolonne 3 */}
      {person.notat && (
        <p className="border-t border-kant pt-6 leading-relaxed text-dempet sm:border-t-0 sm:border-l sm:pt-1 sm:pl-10">
          {person.notat}
        </p>
      )}
    </article>
  );
}

/** Mindre kort for forloverne */
function Kort({
  person,
  kort,
  innfelt,
}: {
  person: Person;
  kort: string;
  innfelt: string;
}) {
  return (
    <article
      className={`flex flex-col items-center border border-kant p-6 text-center ${kort}`}
    >
      <Portrett
        navn={person.navn}
        bilde={person.bilde}
        storrelse={72}
        innfelt={innfelt}
      />

      <p className="mt-4 text-xs uppercase tracking-[0.25em] text-gull">{person.rolle}</p>
      <h3 className="mt-2 font-display text-xl font-light">{person.navn}</h3>

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
        <p className="mt-3 text-sm leading-relaxed text-dempet">{person.notat}</p>
      )}
    </article>
  );
}

/** Rundt portrettbilde, eller initialer så lenge bildet mangler */
function Portrett({
  navn,
  bilde,
  storrelse,
  innfelt,
}: {
  navn: string;
  bilde: string;
  storrelse: number;
  innfelt: string;
}) {
  const mal = { width: storrelse, height: storrelse };

  if (!bilde) {
    return (
      <div
        aria-hidden
        style={mal}
        className={`flex shrink-0 items-center justify-center rounded-full border border-dashed border-kant font-display font-light text-gull ${innfelt}`}
      >
        <span style={{ fontSize: storrelse * 0.28 }}>{initialer(navn)}</span>
      </div>
    );
  }

  return (
    <div style={mal} className="relative shrink-0 overflow-hidden rounded-full">
      <Image
        src={bilde}
        alt={navn}
        fill
        sizes={`${storrelse}px`}
        className="object-cover"
      />
    </div>
  );
}
