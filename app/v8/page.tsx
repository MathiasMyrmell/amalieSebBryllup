import Kart from "@/components/Kart";
import NedtellingFelles from "@/components/felles/NedtellingFelles";
import RsvpFelles from "@/components/felles/RsvpFelles";
import { bryllup } from "@/content/bryllup";

/** v8 — «Botanisk»: grønt og krem, bladranker og myke, avrundede former. */

const display = { fontFamily: "var(--font-v8-display)" };

/** Bladranke brukt som skille og pynt */
function Ranke({ speilvendt }: { speilvendt?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 24"
      className={`h-6 w-32 text-[#7d9160] ${speilvendt ? "scale-x-[-1]" : ""}`}
      fill="currentColor"
      aria-hidden
    >
      <path d="M0 12h120" stroke="currentColor" strokeWidth="0.8" fill="none" />
      {[20, 40, 60, 80, 100].map((x, i) => (
        <g key={x}>
          <ellipse cx={x} cy={i % 2 ? 7 : 17} rx="7" ry="3.2" />
        </g>
      ))}
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
        <div className="flex items-center justify-center gap-4">
          <Ranke />
          <h2 className="text-3xl whitespace-nowrap sm:text-4xl" style={display}>
            {tittel}
          </h2>
          <Ranke speilvendt />
        </div>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

export default function V8() {
  const hoved = bryllup.kontakter.find((p) => p.hoved);
  const ovrige = bryllup.kontakter.filter((p) => p !== hoved);

  return (
    <div>
      <header className="relative overflow-hidden px-6 py-24 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-[#e4ecd8] blur-3xl"
        />
        <div className="relative mx-auto max-w-2xl">
          <div className="flex justify-center">
            <Ranke />
          </div>

          <h1 className="mt-8 text-6xl leading-tight sm:text-7xl" style={display}>
            {bryllup.par.brud}
            <span className="mx-3 text-[#7d9160]">&amp;</span>
            {bryllup.par.brudgom}
          </h1>

          <p className="mt-6 text-lg text-[#5c6b57]">
            {bryllup.datoTekst} &middot; {bryllup.sted}
          </p>

          <p className="mx-auto mt-8 max-w-md leading-relaxed text-[#5c6b57]">
            {bryllup.ingress}
          </p>

          <div className="mt-12">
            <NedtellingFelles
              dato={bryllup.dato}
              stil={{
                rad: "flex justify-center gap-3",
                celle:
                  "w-[4.75rem] rounded-[1.75rem] bg-[#e4ecd8] px-2 py-5 text-center",
                tall: "text-2xl",
                etikett: "mt-1 text-[0.6rem] uppercase tracking-widest text-[#7d9160]",
                ferdig: "text-2xl",
              }}
              korteEtiketter
            />
          </div>

          {bryllup.rsvp.apen && (
            <a
              href="#rsvp"
              className="mt-12 inline-block rounded-full bg-[#5c7343] px-10 py-4 text-sm text-[#f6f7f0] transition-colors hover:bg-[#48592f]"
            >
              Gi oss beskjed
            </a>
          )}
        </div>
      </header>

      <Bolk tittel="Program">
        <div className="mx-auto max-w-2xl space-y-4">
          {bryllup.program.map((post) => (
            <div
              key={`${post.tid}-${post.tittel}`}
              className="flex gap-5 rounded-[1.75rem] bg-white/70 p-6"
            >
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e4ecd8] text-sm text-[#5c7343]"
                style={display}
              >
                {post.tid}
              </span>
              <div>
                <h3 className="text-lg" style={display}>
                  {post.tittel}
                </h3>
                {post.beskrivelse && (
                  <p className="mt-1 text-sm text-[#5c6b57]">{post.beskrivelse}</p>
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
              className="overflow-hidden rounded-[2rem] bg-white/70"
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
                  markor="bg-[#5c7343] ring-4 ring-white/80"
                  merke="bg-white/80 text-[#7d9160]"
                />
              )}
              <div className="p-6">
                <p className="text-xs tracking-[0.2em] text-[#7d9160] uppercase">
                  {sted.merkelapp}
                </p>
                <h3 className="mt-2 text-2xl" style={display}>
                  {sted.navn}
                </h3>
                <p className="mt-1 text-sm text-[#5c6b57]">{sted.adresse}</p>
                {sted.notat && (
                  <p className="mt-1 text-sm text-[#7d9160]">{sted.notat}</p>
                )}
                <a
                  href={sted.kartUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block rounded-full bg-[#e4ecd8] px-5 py-2 text-sm text-[#5c7343]"
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
          {bryllup.praktisk.map((punkt) => (
            <div key={punkt.tittel} className="rounded-[1.75rem] bg-white/70 p-6">
              <h3 className="text-xl" style={display}>
                {punkt.tittel}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5c6b57]">{punkt.tekst}</p>
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk tittel="Gaver">
        <div className="mx-auto max-w-xl rounded-[2rem] bg-[#e4ecd8] p-9 text-center">
          <p className="leading-relaxed text-[#42513c]">{bryllup.gaver.tekst}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            {bryllup.gaver.lenker.map((lenke) => (
              <a
                key={lenke.navn}
                href={lenke.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#5c7343] px-7 py-2.5 text-sm text-[#f6f7f0]"
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
              className="flex aspect-square items-center justify-center rounded-[2rem] bg-white/70 p-4 text-center"
            >
              <span className="text-sm text-[#7d9160]">{bilde.bildetekst}</span>
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk tittel="Ta kontakt">
        {hoved && (
          <div className="rounded-[2rem] bg-[#5c7343] p-8 text-center text-[#f6f7f0]">
            <p className="text-xs tracking-[0.25em] uppercase opacity-80">
              {hoved.rolle}
            </p>
            <h3 className="mt-2 text-3xl" style={display}>
              {hoved.navn}
            </h3>
            {hoved.notat && (
              <p className="mx-auto mt-3 max-w-lg leading-relaxed opacity-90">
                {hoved.notat}
              </p>
            )}
            <p className="mt-4 text-sm">{hoved.telefon}</p>
          </div>
        )}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {ovrige.map((person) => (
            <div
              key={`${person.rolle}-${person.navn}`}
              className="rounded-[1.75rem] bg-white/70 p-6 text-center"
            >
              <p className="text-[0.65rem] tracking-[0.2em] text-[#7d9160] uppercase">
                {person.rolle}
              </p>
              <h3 className="mt-2" style={display}>
                {person.navn}
              </h3>
              <p className="mt-1 text-sm text-[#5c6b57]">{person.telefon}</p>
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk id="rsvp" tittel="Kommer du?">
        <p className="mb-8 text-center text-sm text-[#7d9160]">
          Svarfrist {bryllup.rsvp.frist}
        </p>
        <div className="mx-auto max-w-xl rounded-[2rem] bg-white/70 p-8">
          <RsvpFelles
            stil={{
              etikett: "mb-2 block text-sm text-[#5c6b57]",
              felt: "w-full rounded-2xl bg-[#f6f7f0] px-4 py-3 outline-none focus:ring-2 focus:ring-[#7d9160]",
              hjelp: "mt-2 text-xs text-[#7d9160]",
              valgAktiv:
                "flex-1 cursor-pointer rounded-full bg-[#5c7343] px-4 py-3 text-center text-sm text-[#f6f7f0]",
              valgPassiv:
                "flex-1 cursor-pointer rounded-full bg-[#e4ecd8] px-4 py-3 text-center text-sm text-[#42513c]",
              knapp:
                "w-full rounded-full bg-[#5c7343] py-4 text-sm text-[#f6f7f0] transition-colors hover:bg-[#48592f] disabled:opacity-60",
              kvittering: "rounded-[2rem] bg-[#e4ecd8] p-10 text-center",
              kvitteringTittel: "text-3xl",
            }}
          />
        </div>
      </Bolk>

      <footer className="px-6 pb-16 text-center">
        <div className="flex justify-center">
          <Ranke />
        </div>
        <p className="mt-5 text-3xl" style={display}>
          {bryllup.par.brud} &amp; {bryllup.par.brudgom}
        </p>
        <a href="/versjoner" className="mt-5 inline-block text-sm text-[#7d9160] underline">
          Alle utkast
        </a>
      </footer>
    </div>
  );
}
