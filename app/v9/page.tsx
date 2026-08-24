import Kart from "@/components/Kart";
import NedtellingFelles from "@/components/felles/NedtellingFelles";
import RsvpFelles from "@/components/felles/RsvpFelles";
import { bryllup } from "@/content/bryllup";

/** v9 — «Retro»: sennepsgult, rust og krem, runde former og fete overskrifter. */

/** Bølgestripe som skille */
function Bolge() {
  return (
    <svg viewBox="0 0 120 12" className="h-3 w-40 text-[#d97941]" aria-hidden>
      <path
        d="M0 6 Q10 0 20 6 T40 6 T60 6 T80 6 T100 6 T120 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
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
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{tittel}</h2>
          <Bolge />
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

export default function V9() {
  const hoved = bryllup.kontakter.find((p) => p.hoved);
  const ovrige = bryllup.kontakter.filter((p) => p !== hoved);

  return (
    <div>
      <header className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[3rem] bg-[#e8b33c] px-8 py-16 text-center">
            <p className="text-xs font-semibold tracking-[0.3em] text-[#7a4a1e] uppercase">
              {bryllup.datoTekst}
            </p>

            <h1 className="mt-6 text-6xl leading-[0.95] font-bold tracking-tight text-[#42301f] sm:text-8xl">
              {bryllup.par.brud}
              <br />
              <span className="text-[#d97941]">&amp;</span> {bryllup.par.brudgom}
            </h1>

            <div className="mt-8 flex justify-center">
              <Bolge />
            </div>

            <p className="mx-auto mt-8 max-w-md leading-relaxed text-[#5c4426]">
              {bryllup.ingress}
            </p>
          </div>

          <div className="mt-10">
            <NedtellingFelles
              dato={bryllup.dato}
              stil={{
                rad: "grid grid-cols-4 gap-3",
                celle: "rounded-[2rem] bg-[#d97941] py-6 text-center text-[#fdf0dc]",
                tall: "text-3xl font-bold",
                etikett: "mt-1 text-[0.6rem] font-semibold uppercase tracking-widest",
                ferdig: "text-center text-2xl font-bold",
              }}
              korteEtiketter
            />
          </div>

          {bryllup.rsvp.apen && (
            <div className="mt-10 text-center">
              <a
                href="#rsvp"
                className="inline-block rounded-full bg-[#42301f] px-12 py-4 font-semibold text-[#fdf0dc]"
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
              className="flex flex-col gap-3 rounded-[2rem] bg-white/60 px-7 py-5 sm:flex-row sm:items-center sm:gap-6"
            >
              <span className="w-fit rounded-full bg-[#e8b33c] px-4 py-1.5 text-sm font-bold">
                {post.tid}
              </span>
              <div>
                <h3 className="font-semibold">{post.tittel}</h3>
                {post.beskrivelse && (
                  <p className="text-sm text-[#6b543a]">{post.beskrivelse}</p>
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
              className="overflow-hidden rounded-[2.5rem] bg-white/60"
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
                  markor="bg-[#d97941] ring-4 ring-[#fdf0dc]/80"
                  merke="bg-[#fdf0dc]/80 text-[#6b543a]"
                />
              )}
              <div className="p-7">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#d97941] uppercase">
                  {sted.merkelapp}
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight">{sted.navn}</h3>
                <p className="mt-1 text-sm text-[#6b543a]">{sted.adresse}</p>
                {sted.notat && (
                  <p className="mt-1 text-sm text-[#8a7256]">{sted.notat}</p>
                )}
                <a
                  href={sted.kartUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block rounded-full bg-[#e8b33c] px-5 py-2 text-sm font-semibold"
                >
                  Veibeskrivelse
                </a>
              </div>
            </article>
          ))}
        </div>
      </Bolk>

      <Bolk tittel="Praktisk">
        <div className="grid gap-5 sm:grid-cols-2">
          {bryllup.praktisk.map((punkt, i) => (
            <div
              key={punkt.tittel}
              className="rounded-[2rem] p-7"
              style={{ backgroundColor: i % 2 ? "#f6e0be" : "#ffffff99" }}
            >
              <h3 className="text-xl font-bold tracking-tight">{punkt.tittel}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6b543a]">{punkt.tekst}</p>
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk tittel="Gaver">
        <div className="rounded-[2.5rem] bg-[#d97941] p-9 text-[#fdf0dc]">
          <p className="max-w-xl leading-relaxed">{bryllup.gaver.tekst}</p>
          <div className="mt-7 flex flex-wrap gap-4">
            {bryllup.gaver.lenker.map((lenke) => (
              <a
                key={lenke.navn}
                href={lenke.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#fdf0dc] px-7 py-2.5 text-sm font-semibold text-[#42301f]"
              >
                {lenke.navn}
              </a>
            ))}
          </div>
        </div>
      </Bolk>

      <Bolk tittel="Bilder">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {bryllup.galleri.map((bilde, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded-full p-6 text-center"
              style={{ backgroundColor: ["#e8b33c", "#f6e0be", "#d97941"][i % 3] }}
            >
              <span className="text-sm font-semibold text-[#42301f]">
                {bilde.bildetekst}
              </span>
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk tittel="Ta kontakt">
        {hoved && (
          <div className="rounded-[2.5rem] bg-[#42301f] p-8 text-[#fdf0dc]">
            <p className="text-xs font-semibold tracking-[0.25em] text-[#e8b33c] uppercase">
              {hoved.rolle}
            </p>
            <h3 className="mt-2 text-3xl font-bold tracking-tight">{hoved.navn}</h3>
            {hoved.notat && (
              <p className="mt-3 max-w-xl leading-relaxed opacity-90">{hoved.notat}</p>
            )}
            <p className="mt-4 text-sm">
              {hoved.telefon} {hoved.epost && `· ${hoved.epost}`}
            </p>
          </div>
        )}
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {ovrige.map((person) => (
            <div
              key={`${person.rolle}-${person.navn}`}
              className="rounded-[2rem] bg-white/60 p-6"
            >
              <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-[#d97941] uppercase">
                {person.rolle}
              </p>
              <h3 className="mt-2 font-semibold">{person.navn}</h3>
              <p className="text-sm text-[#6b543a]">{person.telefon}</p>
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk id="rsvp" tittel="Kommer du?">
        <p className="mb-8 text-sm font-semibold tracking-[0.2em] text-[#d97941] uppercase">
          Svarfrist {bryllup.rsvp.frist}
        </p>
        <div className="max-w-xl rounded-[2.5rem] bg-white/60 p-8">
          <RsvpFelles
            stil={{
              etikett: "mb-2 block text-sm font-semibold",
              felt: "w-full rounded-2xl border-2 border-[#f0d9ae] bg-[#fdf0dc] px-4 py-3 outline-none focus:border-[#d97941]",
              hjelp: "mt-2 text-xs text-[#8a7256]",
              valgAktiv:
                "flex-1 cursor-pointer rounded-full bg-[#42301f] px-4 py-3 text-center text-sm font-semibold text-[#fdf0dc]",
              valgPassiv:
                "flex-1 cursor-pointer rounded-full bg-[#f6e0be] px-4 py-3 text-center text-sm font-semibold",
              knapp:
                "w-full rounded-full bg-[#d97941] py-4 font-semibold text-[#fdf0dc] disabled:opacity-60",
              kvittering: "rounded-[2rem] bg-[#e8b33c] p-10 text-center",
              kvitteringTittel: "text-3xl font-bold tracking-tight",
            }}
          />
        </div>
      </Bolk>

      <footer className="px-6 pb-16">
        <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-[#e8b33c] px-8 py-10 text-center">
          <p className="text-3xl font-bold tracking-tight">
            {bryllup.par.brud} &amp; {bryllup.par.brudgom}
          </p>
          <p className="mt-2 text-sm font-semibold text-[#7a4a1e]">
            {bryllup.datoTekst}
          </p>
          <a href="/versjoner" className="mt-4 inline-block text-sm underline">
            Alle utkast
          </a>
        </div>
      </footer>
    </div>
  );
}
