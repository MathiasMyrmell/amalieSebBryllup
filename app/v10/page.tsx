import Kart from "@/components/Kart";
import NedtellingFelles from "@/components/felles/NedtellingFelles";
import RsvpFelles from "@/components/felles/RsvpFelles";
import { bryllup } from "@/content/bryllup";

/** v10 — «Magasin»: redaksjonelt oppsett med anfang, spalter og tynne linjer. */

const display = { fontFamily: "var(--font-v10-display)" };

function Bolk({
  id,
  nr,
  tittel,
  children,
}: {
  id?: string;
  nr: string;
  tittel: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t-2 border-[#1f1d1b] py-12">
      <div className="mb-8 flex items-baseline justify-between gap-4">
        <h2 className="text-3xl sm:text-4xl" style={display}>
          {tittel}
        </h2>
        <span className="text-xs tracking-[0.3em] text-[#b3402f] uppercase">{nr}</span>
      </div>
      {children}
    </section>
  );
}

export default function V10() {
  const hoved = bryllup.kontakter.find((p) => p.hoved);
  const ovrige = bryllup.kontakter.filter((p) => p !== hoved);
  const [forste, ...resten] = bryllup.ingress.split(" ");

  return (
    <div className="mx-auto max-w-4xl px-6">
      <header className="py-14">
        {/* Avishode */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[#1f1d1b] py-2 text-[0.65rem] tracking-[0.25em] uppercase">
          <span>{bryllup.sted}</span>
          <span className="text-[#b3402f]">Bryllup</span>
          <span>{bryllup.datoTekst}</span>
        </div>

        <h1
          className="mt-12 text-center text-6xl leading-[0.95] sm:text-8xl"
          style={display}
        >
          {bryllup.par.brud}
          <span className="mx-4 italic text-[#b3402f]">&amp;</span>
          {bryllup.par.brudgom}
        </h1>

        {/* Ingressen er for kort til spalter – den ville brukket midt i en setning */}
        <div className="mx-auto mt-12 max-w-xl border-t border-[#1f1d1b] pt-8">
          <p className="text-lg leading-relaxed">
            <span
              className="float-left mt-1 mr-2 text-6xl leading-[0.8] text-[#b3402f]"
              style={display}
            >
              {forste.charAt(0)}
            </span>
            {forste.slice(1)} {resten.join(" ")}
          </p>
        </div>

        <div className="mt-12 border-y border-[#1f1d1b] py-6">
          <NedtellingFelles
            dato={bryllup.dato}
            stil={{
              rad: "grid grid-cols-4 divide-x divide-[#e2ddd3]",
              celle: "px-2 text-center",
              tall: "text-3xl tabular-nums",
              etikett:
                "mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-[#7c766c]",
              ferdig: "text-center text-2xl",
            }}
            korteEtiketter
          />
        </div>

        {bryllup.rsvp.apen && (
          <div className="mt-10 text-center">
            <a
              href="#rsvp"
              className="inline-block bg-[#b3402f] px-10 py-3.5 text-xs tracking-[0.25em] text-white uppercase"
            >
              Svar på invitasjonen
            </a>
          </div>
        )}
      </header>

      <Bolk nr="Del én" tittel="Program">
        <div className="sm:columns-2 sm:gap-10">
          {bryllup.program.map((post) => (
            <div
              key={`${post.tid}-${post.tittel}`}
              className="mb-5 break-inside-avoid border-b border-[#e2ddd3] pb-4"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-lg text-[#b3402f]" style={display}>
                  {post.tid}
                </span>
                <h3 className="font-medium">{post.tittel}</h3>
              </div>
              {post.beskrivelse && (
                <p className="mt-1 text-sm leading-relaxed text-[#57524b]">
                  {post.beskrivelse}
                </p>
              )}
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk nr="Del to" tittel="Sted">
        <div className="grid gap-10 sm:grid-cols-2">
          {bryllup.steder.map((sted) => (
            <article key={sted.navn + sted.merkelapp}>
              <p className="text-[0.65rem] tracking-[0.25em] text-[#b3402f] uppercase">
                {sted.merkelapp}
              </p>
              <h3 className="mt-2 text-2xl" style={display}>
                {sted.navn}
              </h3>
              <p className="mt-1 text-sm text-[#57524b]">{sted.adresse}</p>
              {sted.notat && <p className="text-sm text-[#7c766c]">{sted.notat}</p>}
              {sted.kart && (
                <div className="mt-4">
                  <Kart
                    lat={sted.kart.lat}
                    lon={sted.kart.lon}
                    zoom={sted.kart.zoom}
                    tittel={sted.navn}
                    lenke={sted.kartUrl}
                    hoyde={175}
                    ramme="border border-[#1f1d1b]"
                    markor="bg-[#b3402f] ring-4 ring-white/80"
                    merke="bg-white/80 text-[#7c766c]"
                  />
                </div>
              )}
              <a
                href={sted.kartUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block border-b border-[#b3402f] pb-0.5 text-sm text-[#b3402f]"
              >
                Veibeskrivelse
              </a>
            </article>
          ))}
        </div>
      </Bolk>

      <Bolk nr="Del tre" tittel="Praktisk">
        <dl className="sm:columns-2 sm:gap-10">
          {bryllup.praktisk.map((punkt) => (
            <div key={punkt.tittel} className="mb-6 break-inside-avoid">
              <dt className="text-lg" style={display}>
                {punkt.tittel}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-[#57524b]">
                {punkt.tekst}
              </dd>
            </div>
          ))}
        </dl>
      </Bolk>

      <Bolk nr="Del fire" tittel="Gaver">
        <div className="grid gap-8 sm:grid-cols-[2fr_1fr]">
          <p className="leading-relaxed text-[#57524b]">{bryllup.gaver.tekst}</p>
          <div className="space-y-3">
            {bryllup.gaver.lenker.map((lenke) => (
              <a
                key={lenke.navn}
                href={lenke.url}
                target="_blank"
                rel="noreferrer"
                className="block border border-[#1f1d1b] px-5 py-2.5 text-center text-sm"
              >
                {lenke.navn}
              </a>
            ))}
          </div>
        </div>
      </Bolk>

      <Bolk nr="Del fem" tittel="Bilder">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          {bryllup.galleri.map((bilde, i) => (
            <figure key={i}>
              <div className="aspect-[4/5] border border-[#1f1d1b] bg-[#f4f0e8]" />
              <figcaption className="mt-1.5 text-xs text-[#7c766c]">
                {String(i + 1).padStart(2, "0")} — {bilde.bildetekst}
              </figcaption>
            </figure>
          ))}
        </div>
      </Bolk>

      <Bolk nr="Del seks" tittel="Ta kontakt">
        {hoved && (
          <div className="border-y-2 border-[#1f1d1b] py-7">
            <p className="text-[0.65rem] tracking-[0.25em] text-[#b3402f] uppercase">
              {hoved.rolle}
            </p>
            <h3 className="mt-2 text-3xl" style={display}>
              {hoved.navn}
            </h3>
            {hoved.notat && (
              <p className="mt-3 max-w-xl leading-relaxed text-[#57524b]">
                {hoved.notat}
              </p>
            )}
            <p className="mt-3 text-sm">
              {hoved.telefon} {hoved.epost && `· ${hoved.epost}`}
            </p>
          </div>
        )}
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {ovrige.map((person) => (
            <div key={`${person.rolle}-${person.navn}`}>
              <p className="text-[0.6rem] tracking-[0.2em] text-[#b3402f] uppercase">
                {person.rolle}
              </p>
              <h3 className="mt-1.5 text-lg" style={display}>
                {person.navn}
              </h3>
              <p className="text-sm text-[#57524b]">{person.telefon}</p>
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk id="rsvp" nr={`Frist ${bryllup.rsvp.frist}`} tittel="Kommer du?">
        <RsvpFelles
          stil={{
            skjema: "max-w-xl space-y-6",
            etikett: "mb-1.5 block text-[0.65rem] uppercase tracking-[0.2em] text-[#7c766c]",
            felt: "w-full border border-[#1f1d1b] bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-[#b3402f]",
            hjelp: "mt-1.5 text-xs text-[#7c766c]",
            valgAktiv:
              "flex-1 cursor-pointer border border-[#b3402f] bg-[#b3402f] px-4 py-3 text-center text-sm text-white",
            valgPassiv:
              "flex-1 cursor-pointer border border-[#1f1d1b] px-4 py-3 text-center text-sm",
            knapp:
              "bg-[#1f1d1b] px-10 py-3.5 text-xs tracking-[0.25em] text-white uppercase disabled:opacity-50",
            kvittering: "max-w-xl border-2 border-[#1f1d1b] p-9",
            kvitteringTittel: "text-3xl",
          }}
        />
      </Bolk>

      <footer className="flex flex-wrap items-baseline justify-between gap-4 border-t-2 border-[#1f1d1b] py-8 text-xs tracking-[0.2em] uppercase">
        <span>
          {bryllup.par.brud} &amp; {bryllup.par.brudgom}
        </span>
        <span className="text-[#7c766c]">{bryllup.datoTekst}</span>
        <a href="/versjoner" className="text-[#b3402f]">
          Alle utkast
        </a>
      </footer>
    </div>
  );
}
