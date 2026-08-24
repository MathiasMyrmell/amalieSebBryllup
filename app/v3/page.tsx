import Kart from "@/components/Kart";
import NedtellingFelles from "@/components/felles/NedtellingFelles";
import RsvpFelles from "@/components/felles/RsvpFelles";
import { bryllup } from "@/content/bryllup";

/** v3 — «Blomstereng»: lys rosa, buede kort, kruseduller og kursiv. Mye pynt. */

const display = { fontFamily: "var(--font-v3-display)" };

/** Liten blomsterranke som skille mellom seksjonene */
function Ranke() {
  return (
    <div className="flex items-center justify-center gap-3 py-2" aria-hidden>
      <span className="h-px w-16 bg-[#e3c4c0]" />
      <svg viewBox="0 0 40 24" className="h-5 w-8 text-[#c98f8a]" fill="currentColor">
        <circle cx="20" cy="12" r="3.2" />
        <ellipse cx="12" cy="8" rx="5" ry="2.6" transform="rotate(-25 12 8)" />
        <ellipse cx="28" cy="8" rx="5" ry="2.6" transform="rotate(25 28 8)" />
        <ellipse cx="12" cy="16" rx="5" ry="2.6" transform="rotate(25 12 16)" />
        <ellipse cx="28" cy="16" rx="5" ry="2.6" transform="rotate(-25 28 16)" />
      </svg>
      <span className="h-px w-16 bg-[#e3c4c0]" />
    </div>
  );
}

function Bolk({
  id,
  overtittel,
  tittel,
  children,
}: {
  id?: string;
  overtittel: string;
  tittel: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <Ranke />
        <p className="mt-6 text-center text-xs tracking-[0.3em] text-[#c98f8a] uppercase">
          {overtittel}
        </p>
        <h2
          className="mt-2 text-center text-4xl italic sm:text-5xl"
          style={display}
        >
          {tittel}
        </h2>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

export default function V3() {
  const hoved = bryllup.kontakter.find((p) => p.hoved);
  const ovrige = bryllup.kontakter.filter((p) => p !== hoved);

  return (
    <div>
      <header className="relative overflow-hidden px-6 py-24 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#f6dedb] blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#efe3d0] blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl">
          <p className="text-xs tracking-[0.4em] text-[#c98f8a] uppercase">
            Vi skal gifte oss
          </p>

          <h1 className="mt-8 text-6xl leading-tight sm:text-7xl" style={display}>
            {bryllup.par.brud}
            <span className="mx-3 italic text-[#c98f8a]">og</span>
            <br className="sm:hidden" />
            {bryllup.par.brudgom}
          </h1>

          <Ranke />

          <p className="mt-4 text-lg italic" style={display}>
            {bryllup.datoTekst} · {bryllup.sted}
          </p>

          <p className="mx-auto mt-8 max-w-md leading-relaxed text-[#7c6a6b]">
            {bryllup.ingress}
          </p>

          <div className="mt-12">
            <NedtellingFelles
              dato={bryllup.dato}
              stil={{
                rad: "flex justify-center gap-4",
                celle:
                  "w-20 rounded-full border border-[#e3c4c0] bg-white/60 px-2 py-4 text-center",
                tall: "text-2xl",
                etikett: "mt-1 text-[0.6rem] uppercase tracking-widest text-[#a98e8b]",
                ferdig: "text-2xl italic text-[#c98f8a]",
              }}
              korteEtiketter
            />
          </div>

          {bryllup.rsvp.apen && (
            <a
              href="#rsvp"
              className="mt-12 inline-block rounded-full bg-[#c98f8a] px-10 py-3.5 text-xs tracking-[0.2em] text-white uppercase transition-colors hover:bg-[#b57a75]"
            >
              Svar på invitasjonen
            </a>
          )}
        </div>
      </header>

      <Bolk overtittel="Dagens gang" tittel="Program">
        <div className="mx-auto max-w-xl space-y-4">
          {bryllup.program.map((post) => (
            <div
              key={`${post.tid}-${post.tittel}`}
              className="rounded-3xl border border-[#f0dcd9] bg-white/70 px-7 py-5"
            >
              <div className="flex items-baseline gap-4">
                <span className="text-xl text-[#c98f8a]" style={display}>
                  {post.tid}
                </span>
                <h3 className="text-lg">{post.tittel}</h3>
              </div>
              {post.beskrivelse && (
                <p className="mt-1 text-sm text-[#7c6a6b]">{post.beskrivelse}</p>
              )}
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk overtittel="Hvor" tittel="Sted">
        <div className="grid gap-8 sm:grid-cols-2">
          {bryllup.steder.map((sted) => (
            <article
              key={sted.navn + sted.merkelapp}
              className="overflow-hidden rounded-[2rem] border border-[#f0dcd9] bg-white/70 p-7 text-center"
            >
              <p className="text-xs tracking-[0.25em] text-[#c98f8a] uppercase">
                {sted.merkelapp}
              </p>
              <h3 className="mt-2 text-3xl italic" style={display}>
                {sted.navn}
              </h3>
              <p className="mt-2 text-sm text-[#7c6a6b]">{sted.adresse}</p>
              {sted.notat && (
                <p className="mt-2 text-sm text-[#7c6a6b]">{sted.notat}</p>
              )}
              {sted.kart && (
                <div className="mt-5 overflow-hidden rounded-2xl">
                  <Kart
                    lat={sted.kart.lat}
                    lon={sted.kart.lon}
                    zoom={sted.kart.zoom}
                    tittel={sted.navn}
                    lenke={sted.kartUrl}
                    hoyde={170}
                    ramme="border border-[#f0dcd9]"
                    markor="bg-[#c98f8a] ring-4 ring-white/80"
                    merke="bg-white/80 text-[#a98e8b]"
                  />
                </div>
              )}
              <a
                href={sted.kartUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-block rounded-full border border-[#c98f8a] px-6 py-2 text-xs tracking-[0.15em] text-[#c98f8a] uppercase"
              >
                Veibeskrivelse
              </a>
            </article>
          ))}
        </div>
      </Bolk>

      <Bolk overtittel="Godt å vite" tittel="Praktisk">
        <div className="grid gap-6 sm:grid-cols-2">
          {bryllup.praktisk.map((punkt) => (
            <div
              key={punkt.tittel}
              className="rounded-3xl border border-[#f0dcd9] bg-white/70 p-6"
            >
              <h3 className="text-xl italic" style={display}>
                {punkt.tittel}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#7c6a6b]">{punkt.tekst}</p>
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk overtittel="Ønskeliste" tittel="Gaver">
        <div className="mx-auto max-w-xl text-center">
          <p className="leading-relaxed text-[#7c6a6b]">{bryllup.gaver.tekst}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {bryllup.gaver.lenker.map((lenke) => (
              <a
                key={lenke.navn}
                href={lenke.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white px-8 py-3 text-xs tracking-[0.2em] text-[#c98f8a] uppercase shadow-sm"
              >
                {lenke.navn}
              </a>
            ))}
          </div>
        </div>
      </Bolk>

      <Bolk overtittel="Litt om oss" tittel="Bilder">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {bryllup.galleri.map((bilde, i) => (
            <div
              key={i}
              className="flex aspect-[4/5] items-center justify-center rounded-t-full border border-[#f0dcd9] bg-white/70 p-4 text-center"
            >
              <span className="text-sm text-[#a98e8b]">{bilde.bildetekst}</span>
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk overtittel="Spørsmål?" tittel="Ta kontakt">
        {hoved && (
          <div className="rounded-[2rem] border border-[#e3c4c0] bg-white/80 p-8 text-center">
            <p className="text-xs tracking-[0.25em] text-[#c98f8a] uppercase">
              {hoved.rolle}
            </p>
            <h3 className="mt-2 text-3xl italic" style={display}>
              {hoved.navn}
            </h3>
            {hoved.notat && (
              <p className="mx-auto mt-3 max-w-lg text-sm text-[#7c6a6b]">
                {hoved.notat}
              </p>
            )}
            <p className="mt-4 text-sm text-[#c98f8a]">
              {hoved.telefon} {hoved.epost && `· ${hoved.epost}`}
            </p>
          </div>
        )}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {ovrige.map((person) => (
            <div
              key={`${person.rolle}-${person.navn}`}
              className="rounded-3xl border border-[#f0dcd9] bg-white/70 p-5 text-center"
            >
              <p className="text-[0.65rem] tracking-[0.2em] text-[#c98f8a] uppercase">
                {person.rolle}
              </p>
              <h3 className="mt-2 italic" style={display}>
                {person.navn}
              </h3>
              <p className="mt-1 text-sm text-[#7c6a6b]">{person.telefon}</p>
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk id="rsvp" overtittel={`Svarfrist ${bryllup.rsvp.frist}`} tittel="Kommer du?">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-[#f0dcd9] bg-white/70 p-8">
          <RsvpFelles
            stil={{
              etikett: "mb-2 block text-sm text-[#7c6a6b]",
              felt: "w-full rounded-2xl border border-[#f0dcd9] bg-white px-4 py-3 outline-none focus:border-[#c98f8a]",
              hjelp: "mt-2 text-xs text-[#a98e8b]",
              valgAktiv:
                "flex-1 cursor-pointer rounded-full bg-[#c98f8a] px-4 py-3 text-center text-sm text-white",
              valgPassiv:
                "flex-1 cursor-pointer rounded-full border border-[#f0dcd9] bg-white px-4 py-3 text-center text-sm",
              knapp:
                "w-full rounded-full bg-[#c98f8a] py-4 text-xs tracking-[0.2em] text-white uppercase transition-colors hover:bg-[#b57a75] disabled:opacity-60",
              kvittering: "rounded-[2rem] bg-[#f9ece9] p-10 text-center",
              kvitteringTittel: "text-3xl italic",
            }}
          />
        </div>
      </Bolk>

      <footer className="px-6 pb-16 text-center">
        <Ranke />
        <p className="mt-4 text-3xl italic" style={display}>
          {bryllup.par.brud} og {bryllup.par.brudgom}
        </p>
        <p className="mt-2 text-xs tracking-[0.3em] text-[#a98e8b] uppercase">
          {bryllup.datoTekst}
        </p>
        <a href="/versjoner" className="mt-6 inline-block text-xs text-[#c98f8a] underline">
          Alle utkast
        </a>
      </footer>
    </div>
  );
}
