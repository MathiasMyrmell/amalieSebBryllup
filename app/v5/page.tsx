import Kart from "@/components/Kart";
import NedtellingFelles from "@/components/felles/NedtellingFelles";
import RsvpFelles from "@/components/felles/RsvpFelles";
import { bryllup } from "@/content/bryllup";

/** v5 — «Riviera»: sandfarget bunn, terrakotta og oliven, buede former. */

const display = { fontFamily: "var(--font-v5-display)" };

/** Stripemønster som gjentas som skille */
function Striper() {
  return (
    <div className="flex gap-1.5" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="h-1 w-8 rounded-full"
          style={{ backgroundColor: i % 2 ? "#7d8b5a" : "#c26a44" }}
        />
      ))}
    </div>
  );
}

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
    <section id={id} className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <Striper />
        <h2 className="mt-5 mb-10 text-4xl sm:text-5xl" style={display}>
          {tittel}
        </h2>
        {children}
      </div>
    </section>
  );
}

export default function V5() {
  const hoved = bryllup.kontakter.find((p) => p.hoved);
  const ovrige = bryllup.kontakter.filter((p) => p !== hoved);

  return (
    <div>
      <header className="px-6 pt-20 pb-10">
        <div className="mx-auto max-w-4xl">
          {/* Buet felt med navnene */}
          <div className="rounded-t-full border border-[#e0cdb4] bg-[#f5e7d3] px-8 pt-20 pb-14 text-center">
            <p className="text-xs tracking-[0.35em] text-[#c26a44] uppercase">
              {bryllup.datoTekst}
            </p>
            <h1 className="mt-6 text-5xl leading-tight sm:text-7xl" style={display}>
              {bryllup.par.brud}
              <span className="mx-3 text-[#7d8b5a]">&amp;</span>
              {bryllup.par.brudgom}
            </h1>
            <p className="mt-4 text-sm tracking-[0.2em] text-[#8a7a67] uppercase">
              {bryllup.sted}
            </p>
            <div className="mt-8 flex justify-center">
              <Striper />
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-lg text-center leading-relaxed text-[#6c5d4e]">
            {bryllup.ingress}
          </p>

          <div className="mt-10">
            <NedtellingFelles
              dato={bryllup.dato}
              stil={{
                rad: "flex justify-center gap-3",
                celle:
                  "w-20 rounded-t-full border border-[#e0cdb4] bg-[#f5e7d3] px-2 pt-6 pb-3 text-center",
                tall: "text-2xl",
                etikett: "mt-1 text-[0.6rem] uppercase tracking-widest text-[#8a7a67]",
                ferdig: "text-center text-2xl",
              }}
              korteEtiketter
            />
          </div>

          {bryllup.rsvp.apen && (
            <div className="mt-12 text-center">
              <a
                href="#rsvp"
                className="inline-block rounded-full bg-[#c26a44] px-10 py-3.5 text-xs tracking-[0.2em] text-[#fbf3e8] uppercase"
              >
                Gi oss beskjed
              </a>
            </div>
          )}
        </div>
      </header>

      <Bolk tittel="Program">
        <div className="space-y-3">
          {bryllup.program.map((post) => (
            <div
              key={`${post.tid}-${post.tittel}`}
              className="flex flex-col gap-1 rounded-2xl border border-[#e0cdb4] bg-[#f5e7d3]/60 px-6 py-4 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="text-xl text-[#c26a44] sm:w-20" style={display}>
                {post.tid}
              </span>
              <div>
                <h3 className="font-medium">{post.tittel}</h3>
                {post.beskrivelse && (
                  <p className="text-sm text-[#6c5d4e]">{post.beskrivelse}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk tittel="Sted">
        <div className="grid gap-6 sm:grid-cols-2">
          {bryllup.steder.map((sted) => (
            <article
              key={sted.navn + sted.merkelapp}
              className="overflow-hidden rounded-3xl border border-[#e0cdb4] bg-[#f5e7d3]/60"
            >
              {sted.kart && (
                <Kart
                  lat={sted.kart.lat}
                  lon={sted.kart.lon}
                  zoom={sted.kart.zoom}
                  tittel={sted.navn}
                  lenke={sted.kartUrl}
                  hoyde={170}
                  ramme=""
                  markor="bg-[#c26a44] ring-4 ring-[#fbf3e8]/80"
                  merke="bg-[#fbf3e8]/80 text-[#8a7a67]"
                />
              )}
              <div className="p-6">
                <p className="text-xs tracking-[0.25em] text-[#7d8b5a] uppercase">
                  {sted.merkelapp}
                </p>
                <h3 className="mt-2 text-2xl" style={display}>
                  {sted.navn}
                </h3>
                <p className="mt-1 text-sm text-[#6c5d4e]">{sted.adresse}</p>
                {sted.notat && (
                  <p className="mt-1 text-sm text-[#8a7a67]">{sted.notat}</p>
                )}
                <a
                  href={sted.kartUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-sm text-[#c26a44] underline underline-offset-4"
                >
                  Veibeskrivelse
                </a>
              </div>
            </article>
          ))}
        </div>
      </Bolk>

      <Bolk tittel="Praktisk">
        <div className="grid gap-6 sm:grid-cols-2">
          {bryllup.praktisk.map((punkt) => (
            <div key={punkt.tittel} className="border-t-2 border-[#c26a44] pt-4">
              <h3 className="text-xl" style={display}>
                {punkt.tittel}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-[#6c5d4e]">{punkt.tekst}</p>
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk tittel="Gaver">
        <p className="max-w-xl leading-relaxed text-[#6c5d4e]">{bryllup.gaver.tekst}</p>
        <div className="mt-6 flex flex-wrap gap-4">
          {bryllup.gaver.lenker.map((lenke) => (
            <a
              key={lenke.navn}
              href={lenke.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#7d8b5a] px-7 py-2.5 text-sm text-[#7d8b5a]"
            >
              {lenke.navn}
            </a>
          ))}
        </div>
      </Bolk>

      <Bolk tittel="Bilder">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {bryllup.galleri.map((bilde, i) => (
            <div
              key={i}
              className="flex aspect-[4/5] items-end rounded-t-full border border-[#e0cdb4] bg-[#f5e7d3]/60 p-5"
            >
              <span className="text-sm text-[#8a7a67]">{bilde.bildetekst}</span>
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk tittel="Ta kontakt">
        {hoved && (
          <div className="rounded-3xl bg-[#7d8b5a] p-8 text-[#fbf3e8]">
            <p className="text-xs tracking-[0.25em] uppercase opacity-80">
              {hoved.rolle}
            </p>
            <h3 className="mt-2 text-3xl" style={display}>
              {hoved.navn}
            </h3>
            {hoved.notat && (
              <p className="mt-3 max-w-xl leading-relaxed opacity-90">{hoved.notat}</p>
            )}
            <p className="mt-4 text-sm">
              {hoved.telefon} {hoved.epost && `· ${hoved.epost}`}
            </p>
          </div>
        )}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {ovrige.map((person) => (
            <div
              key={`${person.rolle}-${person.navn}`}
              className="rounded-2xl border border-[#e0cdb4] p-5"
            >
              <p className="text-[0.65rem] tracking-[0.2em] text-[#7d8b5a] uppercase">
                {person.rolle}
              </p>
              <h3 className="mt-2 text-lg" style={display}>
                {person.navn}
              </h3>
              <p className="text-sm text-[#6c5d4e]">{person.telefon}</p>
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk id="rsvp" tittel="Kommer du?">
        <p className="mb-8 text-sm tracking-[0.2em] text-[#c26a44] uppercase">
          Svarfrist {bryllup.rsvp.frist}
        </p>
        <RsvpFelles
          stil={{
            skjema: "max-w-xl space-y-6",
            etikett: "mb-2 block text-sm text-[#6c5d4e]",
            felt: "w-full rounded-xl border border-[#e0cdb4] bg-[#f5e7d3]/50 px-4 py-3 outline-none focus:border-[#c26a44]",
            hjelp: "mt-2 text-xs text-[#8a7a67]",
            valgAktiv:
              "flex-1 cursor-pointer rounded-full bg-[#c26a44] px-4 py-3 text-center text-sm text-[#fbf3e8]",
            valgPassiv:
              "flex-1 cursor-pointer rounded-full border border-[#e0cdb4] px-4 py-3 text-center text-sm",
            knapp:
              "rounded-full bg-[#7d8b5a] px-10 py-3.5 text-xs tracking-[0.2em] text-[#fbf3e8] uppercase disabled:opacity-60",
            kvittering: "max-w-xl rounded-3xl border border-[#e0cdb4] bg-[#f5e7d3]/60 p-10",
            kvitteringTittel: "text-3xl",
          }}
        />
      </Bolk>

      <footer className="px-6 pb-14 text-center">
        <div className="flex justify-center">
          <Striper />
        </div>
        <p className="mt-5 text-3xl" style={display}>
          {bryllup.par.brud} &amp; {bryllup.par.brudgom}
        </p>
        <a href="/versjoner" className="mt-5 inline-block text-xs text-[#8a7a67] underline">
          Alle utkast
        </a>
      </footer>
    </div>
  );
}
