import Kart from "@/components/Kart";
import Galleri2 from "@/components/v2/Galleri2";
import Nedtelling2 from "@/components/v2/Nedtelling2";
import Rsvp2 from "@/components/v2/Rsvp2";
import { bryllup } from "@/content/bryllup";

/**
 * Utkast 2. Samme innhold som forsiden, hentet fra content/bryllup.ts –
 * bare en annen utforming. Endrer du innholdsfilen, endres begge sidene.
 */

/** Nummerert seksjon: etikett til venstre, innhold til høyre */
function Bolk({
  nummer,
  tittel,
  children,
}: {
  nummer: string;
  tittel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-strek py-16 sm:py-24">
      <div className="grid gap-8 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-12">
        <div>
          <p className="font-grotesk text-xs text-messing">{nummer}</p>
          <h2 className="mt-2 font-grotesk text-sm uppercase tracking-[0.25em] text-tåke">
            {tittel}
          </h2>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

function telLenke(nummer: string) {
  return `tel:${nummer.replace(/[^\d+]/g, "")}`;
}

export default function V2() {
  const hoved = bryllup.kontakter.find((p) => p.hoved);
  const ovrige = bryllup.kontakter.filter((p) => p !== hoved);

  return (
    <div className="mx-auto max-w-5xl px-6 sm:px-10">
      {/* Tittelfelt */}
      <header className="flex min-h-screen flex-col justify-between py-14">
        <p className="font-grotesk text-xs uppercase tracking-[0.4em] text-messing">
          {bryllup.datoTekst} — {bryllup.sted}
        </p>

        <div>
          <h1 className="font-grotesk text-[15vw] leading-[0.85] font-medium tracking-tight sm:text-[8.5rem]">
            {bryllup.par.brud}
            <br />
            <span className="text-tåke">&amp;</span> {bryllup.par.brudgom}
          </h1>

          <p className="mt-10 max-w-md leading-relaxed text-tåke">{bryllup.ingress}</p>
        </div>

        <div>
          <Nedtelling2 dato={bryllup.dato} />
          {bryllup.rsvp.apen && (
            <a
              href="#v2-rsvp"
              className="mt-10 inline-block font-grotesk text-sm underline decoration-messing underline-offset-8 transition-colors hover:text-messing"
            >
              Gi oss beskjed
            </a>
          )}
        </div>
      </header>

      <Bolk nummer="01" tittel="Program">
        <ol className="space-y-0">
          {bryllup.program.map((post) => (
            <li
              key={`${post.tid}-${post.tittel}`}
              className="flex flex-col gap-1 border-b border-strek py-5 sm:flex-row sm:gap-8"
            >
              <span className="font-grotesk text-lg tabular-nums text-messing sm:w-20">
                {post.tid}
              </span>
              <div>
                <h3 className="font-grotesk text-lg">{post.tittel}</h3>
                {post.beskrivelse && (
                  <p className="mt-1 text-sm leading-relaxed text-tåke">
                    {post.beskrivelse}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Bolk>

      <Bolk nummer="02" tittel="Sted">
        <div className="space-y-12">
          {bryllup.steder.map((sted) => (
            <article key={sted.navn + sted.merkelapp}>
              <p className="font-grotesk text-xs uppercase tracking-[0.25em] text-messing">
                {sted.merkelapp}
              </p>
              <h3 className="mt-2 font-grotesk text-3xl">{sted.navn}</h3>
              <p className="mt-2 text-tåke">{sted.adresse}</p>
              {sted.notat && <p className="mt-2 text-sm text-tåke">{sted.notat}</p>}

              {sted.kart && (
                <div className="mt-5">
                  <Kart
                    lat={sted.kart.lat}
                    lon={sted.kart.lon}
                    zoom={sted.kart.zoom}
                    tittel={sted.navn}
                    lenke={sted.kartUrl}
                    lag="dark_all"
                    hoyde={200}
                    ramme="border border-strek bg-natt-lys"
                    markor="bg-messing ring-4 ring-natt/70"
                    merke="bg-natt/80 text-tåke"
                  />
                </div>
              )}

              <a
                href={sted.kartUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm underline decoration-strek underline-offset-4 transition-colors hover:decoration-messing"
              >
                Åpne veibeskrivelse
              </a>
            </article>
          ))}
        </div>
      </Bolk>

      <Bolk nummer="03" tittel="Praktisk">
        <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {bryllup.praktisk.map((punkt) => (
            <div key={punkt.tittel}>
              <dt className="font-grotesk">{punkt.tittel}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-tåke">{punkt.tekst}</dd>
            </div>
          ))}
        </dl>
      </Bolk>

      <Bolk nummer="04" tittel="Gaver">
        <p className="max-w-xl leading-relaxed">{bryllup.gaver.tekst}</p>
        {bryllup.gaver.lenker.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-8">
            {bryllup.gaver.lenker.map((lenke) => (
              <a
                key={lenke.navn}
                href={lenke.url}
                target="_blank"
                rel="noreferrer"
                className="font-grotesk text-sm underline decoration-messing underline-offset-8 transition-colors hover:text-messing"
              >
                {lenke.navn}
              </a>
            ))}
          </div>
        )}
      </Bolk>

      <Bolk nummer="05" tittel="Bilder">
        <Galleri2 />
      </Bolk>

      <Bolk nummer="06" tittel="Kontakt">
        {hoved && (
          <div className="border border-strek bg-natt-lys p-8">
            <p className="font-grotesk text-xs uppercase tracking-[0.25em] text-messing">
              {hoved.rolle}
            </p>
            <h3 className="mt-2 font-grotesk text-3xl">{hoved.navn}</h3>
            {hoved.notat && (
              <p className="mt-4 max-w-xl leading-relaxed text-tåke">{hoved.notat}</p>
            )}
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-1 text-sm">
              {hoved.telefon && (
                <a href={telLenke(hoved.telefon)} className="hover:text-messing">
                  {hoved.telefon}
                </a>
              )}
              {hoved.epost && (
                <a href={`mailto:${hoved.epost}`} className="break-all hover:text-messing">
                  {hoved.epost}
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {ovrige.map((person) => (
            <article
              key={`${person.rolle}-${person.navn}`}
              className="border-t border-strek pt-4"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-messing">
                {person.rolle}
              </p>
              <h3 className="mt-2 font-grotesk">{person.navn}</h3>
              {person.telefon && (
                <a
                  href={telLenke(person.telefon)}
                  className="mt-1 block text-sm text-tåke hover:text-elfenben"
                >
                  {person.telefon}
                </a>
              )}
            </article>
          ))}
        </div>
      </Bolk>

      <div id="v2-rsvp">
        <Bolk nummer="07" tittel={`Svarfrist ${bryllup.rsvp.frist}`}>
          <h3 className="mb-10 font-grotesk text-4xl">Kommer du?</h3>
          <Rsvp2 />
        </Bolk>
      </div>

      <footer className="flex flex-wrap items-baseline justify-between gap-4 border-t border-strek py-12">
        <p className="font-grotesk text-lg">
          {bryllup.par.brud} <span className="text-tåke">&amp;</span>{" "}
          {bryllup.par.brudgom}
        </p>
        <p className="text-xs uppercase tracking-[0.25em] text-tåke">
          {bryllup.datoTekst}
        </p>
        <a
          href="/"
          className="text-xs text-tåke underline underline-offset-4 hover:text-messing"
        >
          Se utkast 1
        </a>
      </footer>
    </div>
  );
}
