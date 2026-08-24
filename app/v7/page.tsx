import Kart from "@/components/Kart";
import NedtellingFelles from "@/components/felles/NedtellingFelles";
import RsvpFelles from "@/components/felles/RsvpFelles";
import { bryllup } from "@/content/bryllup";

/**
 * v7 — «Nordisk lys». Én skriftfamilie i lette snitt, kjølig lys palett,
 * hårfine streker og mye luft. Så lite pynt som mulig uten å bli kaldt.
 */

function Bolk({
  id,
  tittel,
  children,
}: {
  id?: string;
  tittel: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-14 text-xs font-light tracking-[0.45em] text-[#7d9299] uppercase">
          {tittel}
        </h2>
        {children}
      </div>
    </section>
  );
}

export default function V7() {
  const hoved = bryllup.kontakter.find((p) => p.hoved);
  const ovrige = bryllup.kontakter.filter((p) => p !== hoved);

  return (
    <div>
      <header className="flex min-h-[92vh] flex-col justify-center px-6">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="text-5xl leading-[1.15] font-extralight tracking-tight sm:text-7xl">
            {bryllup.par.brud}
            <br />
            <span className="text-[#7d9299]">&amp;</span> {bryllup.par.brudgom}
          </h1>

          <div className="mt-16 h-px w-full bg-[#dbe4e6]" />

          <div className="mt-8 flex flex-wrap gap-x-16 gap-y-4 text-sm font-light">
            <span>{bryllup.datoTekst}</span>
            <span className="text-[#7d9299]">{bryllup.sted}</span>
          </div>

          <p className="mt-16 max-w-md text-lg leading-relaxed font-light text-[#5a686c]">
            {bryllup.ingress}
          </p>

          <div className="mt-20 max-w-md">
            <NedtellingFelles
              dato={bryllup.dato}
              stil={{
                rad: "grid grid-cols-4",
                celle: "",
                tall: "text-3xl font-extralight tabular-nums",
                etikett:
                  "mt-2 text-[0.65rem] font-light uppercase tracking-[0.2em] text-[#7d9299]",
                ferdig: "text-2xl font-extralight",
              }}
              korteEtiketter
            />
          </div>

          {bryllup.rsvp.apen && (
            <a
              href="#rsvp"
              className="mt-20 inline-block text-sm font-light text-[#7d9299] transition-colors hover:text-[#2f3a3d]"
            >
              Gi beskjed &#8595;
            </a>
          )}
        </div>
      </header>

      <Bolk tittel="Program">
        <div>
          {bryllup.program.map((post) => (
            <div
              key={`${post.tid}-${post.tittel}`}
              className="grid grid-cols-[4rem_1fr] gap-6 border-t border-[#dbe4e6] py-7"
            >
              <span className="text-sm font-light tabular-nums text-[#7d9299]">
                {post.tid}
              </span>
              <div>
                <h3 className="font-light">{post.tittel}</h3>
                {post.beskrivelse && (
                  <p className="mt-1 text-sm font-light text-[#5a686c]">
                    {post.beskrivelse}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk tittel="Sted">
        <div className="space-y-20">
          {bryllup.steder.map((sted) => (
            <article key={sted.navn + sted.merkelapp}>
              <p className="text-[0.65rem] tracking-[0.3em] text-[#7d9299] uppercase">
                {sted.merkelapp}
              </p>
              <h3 className="mt-3 text-3xl font-extralight">{sted.navn}</h3>
              <p className="mt-2 text-sm font-light text-[#5a686c]">{sted.adresse}</p>
              {sted.notat && (
                <p className="text-sm font-light text-[#7d9299]">{sted.notat}</p>
              )}
              {sted.kart && (
                <div className="mt-7">
                  <Kart
                    lat={sted.kart.lat}
                    lon={sted.kart.lon}
                    zoom={sted.kart.zoom}
                    tittel={sted.navn}
                    lenke={sted.kartUrl}
                    hoyde={190}
                    lag="light_nolabels"
                    ramme="border border-[#dbe4e6]"
                    markor="bg-[#7d9299] ring-4 ring-white/80"
                    merke="bg-white/70 text-[#7d9299]"
                  />
                </div>
              )}
              <a
                href={sted.kartUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-block text-sm font-light text-[#7d9299]"
              >
                Veibeskrivelse &#8594;
              </a>
            </article>
          ))}
        </div>
      </Bolk>

      <Bolk tittel="Praktisk">
        <dl className="grid gap-x-16 gap-y-12 sm:grid-cols-2">
          {bryllup.praktisk.map((punkt) => (
            <div key={punkt.tittel}>
              <dt className="text-lg font-light">{punkt.tittel}</dt>
              <dd className="mt-2 text-sm leading-relaxed font-light text-[#5a686c]">
                {punkt.tekst}
              </dd>
            </div>
          ))}
        </dl>
      </Bolk>

      <Bolk tittel="Gaver">
        <p className="max-w-xl text-lg leading-relaxed font-light text-[#5a686c]">
          {bryllup.gaver.tekst}
        </p>
        <div className="mt-10 flex flex-wrap gap-10">
          {bryllup.gaver.lenker.map((lenke) => (
            <a
              key={lenke.navn}
              href={lenke.url}
              target="_blank"
              rel="noreferrer"
              className="border-b border-[#dbe4e6] pb-1 text-sm font-light"
            >
              {lenke.navn}
            </a>
          ))}
        </div>
      </Bolk>

      <Bolk tittel="Bilder">
        <div className="grid grid-cols-2 gap-px bg-[#dbe4e6] sm:grid-cols-3">
          {bryllup.galleri.map((bilde, i) => (
            <div key={i} className="flex aspect-square items-end bg-[#f5f8f9] p-4">
              <span className="text-xs font-light text-[#7d9299]">
                {bilde.bildetekst}
              </span>
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk tittel="Kontakt">
        {hoved && (
          <div className="border-t border-[#dbe4e6] pt-7">
            <p className="text-[0.65rem] tracking-[0.3em] text-[#7d9299] uppercase">
              {hoved.rolle}
            </p>
            <h3 className="mt-3 text-3xl font-extralight">{hoved.navn}</h3>
            {hoved.notat && (
              <p className="mt-3 max-w-xl text-sm leading-relaxed font-light text-[#5a686c]">
                {hoved.notat}
              </p>
            )}
            <p className="mt-3 text-sm font-light">
              {hoved.telefon} {hoved.epost && `· ${hoved.epost}`}
            </p>
          </div>
        )}
        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {ovrige.map((person) => (
            <div
              key={`${person.rolle}-${person.navn}`}
              className="border-t border-[#dbe4e6] pt-5"
            >
              <p className="text-[0.6rem] tracking-[0.25em] text-[#7d9299] uppercase">
                {person.rolle}
              </p>
              <h3 className="mt-2 font-light">{person.navn}</h3>
              <p className="text-sm font-light text-[#5a686c]">{person.telefon}</p>
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk id="rsvp" tittel={`Svarfrist ${bryllup.rsvp.frist}`}>
        <h3 className="mb-12 text-4xl font-extralight">Kommer du?</h3>
        <RsvpFelles
          stil={{
            skjema: "max-w-lg space-y-8",
            etikett:
              "mb-2 block text-[0.65rem] font-light uppercase tracking-[0.2em] text-[#7d9299]",
            felt: "w-full border-b border-[#dbe4e6] bg-transparent py-2.5 font-light outline-none focus:border-[#7d9299]",
            hjelp: "mt-2 text-xs font-light text-[#7d9299]",
            valgAktiv:
              "cursor-pointer border-b-2 border-[#2f3a3d] px-1 pb-1 text-sm font-light",
            valgPassiv:
              "cursor-pointer border-b border-[#dbe4e6] px-1 pb-1 text-sm font-light text-[#7d9299]",
            valgRad: "mt-3 flex gap-10",
            knapp:
              "border border-[#2f3a3d] px-10 py-3 text-sm font-light transition-colors hover:bg-[#2f3a3d] hover:text-white disabled:opacity-40",
            kvittering: "max-w-lg border-t border-[#dbe4e6] pt-8",
            kvitteringTittel: "text-3xl font-extralight",
          }}
        />
      </Bolk>

      <footer className="border-t border-[#dbe4e6] px-6 py-14">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-between gap-4 text-xs font-light text-[#7d9299]">
          <span>
            {bryllup.par.brud} &amp; {bryllup.par.brudgom}
          </span>
          <span>{bryllup.datoTekst}</span>
          <a href="/versjoner">Alle utkast</a>
        </div>
      </footer>
    </div>
  );
}
