import Kart from "@/components/Kart";
import NedtellingFelles from "@/components/felles/NedtellingFelles";
import RsvpFelles from "@/components/felles/RsvpFelles";
import { bryllup } from "@/content/bryllup";

/** v6 — «Papir»: alt ligger på et arkt med dobbel ramme, som en trykt invitasjon. */

/** Vignett mellom seksjonene */
function Vignett() {
  return (
    <div className="flex items-center justify-center gap-4 text-[#a08e63]" aria-hidden>
      <span className="h-px w-20 bg-[#ddd3bd]" />
      <span className="text-lg">&#10087;</span>
      <span className="h-px w-20 bg-[#ddd3bd]" />
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
    <section id={id} className="px-8 py-14 sm:px-14">
      <Vignett />
      <h2 className="mt-6 mb-9 text-center text-sm tracking-[0.4em] uppercase">
        {tittel}
      </h2>
      {children}
    </section>
  );
}

export default function V6() {
  const hoved = bryllup.kontakter.find((p) => p.hoved);
  const ovrige = bryllup.kontakter.filter((p) => p !== hoved);

  return (
    <div className="px-4 py-8 sm:px-8 sm:py-14">
      {/* Selve «arket» med dobbel ramme */}
      <div className="mx-auto max-w-3xl border-2 border-[#c9bb9a] bg-[#fdfbf5] p-1.5 shadow-sm">
        <div className="border border-[#ddd3bd]">
          <header className="px-8 py-16 text-center sm:px-14">
            <p className="text-xs tracking-[0.4em] uppercase text-[#a08e63]">
              Sammen med sine familier
            </p>
            <p className="mt-6 text-sm italic text-[#7a7062]">
              har gleden av å invitere til bryllup
            </p>

            <h1 className="mt-8 text-4xl leading-snug sm:text-5xl">
              {bryllup.par.brud}
              <span className="mx-3 italic text-[#a08e63]">og</span>
              <br />
              {bryllup.par.brudgom}
            </h1>

            <div className="mt-8">
              <Vignett />
            </div>

            <p className="mt-8 text-sm tracking-[0.3em] uppercase">
              {bryllup.datoTekst}
            </p>
            <p className="mt-2 text-sm text-[#7a7062]">
              {bryllup.steder[0]?.navn}, {bryllup.sted}
            </p>

            <p className="mx-auto mt-8 max-w-md text-sm leading-loose text-[#7a7062]">
              {bryllup.ingress}
            </p>

            <div className="mt-10">
              <NedtellingFelles
                dato={bryllup.dato}
                stil={{
                  rad: "flex justify-center divide-x divide-[#ddd3bd] border-y border-[#ddd3bd]",
                  celle: "px-5 py-4 text-center",
                  tall: "text-xl",
                  etikett:
                    "mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-[#a08e63]",
                  ferdig: "py-4 italic",
                }}
                korteEtiketter
              />
            </div>
          </header>

          <Bolk tittel="Program">
            <ol className="mx-auto max-w-md">
              {bryllup.program.map((post, i) => (
                <li
                  key={`${post.tid}-${post.tittel}`}
                  className={`py-4 text-center ${
                    i > 0 ? "border-t border-dotted border-[#ddd3bd]" : ""
                  }`}
                >
                  <p className="text-xs tracking-[0.25em] text-[#a08e63]">{post.tid}</p>
                  <h3 className="mt-1">{post.tittel}</h3>
                  {post.beskrivelse && (
                    <p className="mt-1 text-sm italic text-[#7a7062]">
                      {post.beskrivelse}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </Bolk>

          <Bolk tittel="Sted">
            <div className="space-y-10">
              {bryllup.steder.map((sted) => (
                <article key={sted.navn + sted.merkelapp} className="text-center">
                  <p className="text-xs tracking-[0.3em] uppercase text-[#a08e63]">
                    {sted.merkelapp}
                  </p>
                  <h3 className="mt-2 text-2xl">{sted.navn}</h3>
                  <p className="mt-1 text-sm text-[#7a7062]">{sted.adresse}</p>
                  {sted.notat && (
                    <p className="mt-1 text-sm italic text-[#7a7062]">{sted.notat}</p>
                  )}
                  {sted.kart && (
                    <div className="mt-5 border border-[#ddd3bd] p-1.5">
                      <Kart
                        lat={sted.kart.lat}
                        lon={sted.kart.lon}
                        zoom={sted.kart.zoom}
                        tittel={sted.navn}
                        lenke={sted.kartUrl}
                        hoyde={160}
                        lag="light_nolabels"
                        ramme=""
                        markor="bg-[#a08e63] ring-4 ring-[#fdfbf5]/80"
                        merke="bg-[#fdfbf5]/80 text-[#a08e63]"
                      />
                    </div>
                  )}
                  <a
                    href={sted.kartUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-block text-xs tracking-[0.2em] uppercase text-[#a08e63]"
                  >
                    Veibeskrivelse
                  </a>
                </article>
              ))}
            </div>
          </Bolk>

          <Bolk tittel="Praktisk">
            <dl className="mx-auto max-w-lg">
              {bryllup.praktisk.map((punkt, i) => (
                <div
                  key={punkt.tittel}
                  className={`py-4 text-center ${
                    i > 0 ? "border-t border-dotted border-[#ddd3bd]" : ""
                  }`}
                >
                  <dt className="text-xs tracking-[0.25em] uppercase text-[#a08e63]">
                    {punkt.tittel}
                  </dt>
                  <dd className="mt-2 text-sm leading-loose text-[#7a7062]">
                    {punkt.tekst}
                  </dd>
                </div>
              ))}
            </dl>
          </Bolk>

          <Bolk tittel="Gaver">
            <p className="mx-auto max-w-lg text-center text-sm leading-loose text-[#7a7062]">
              {bryllup.gaver.tekst}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              {bryllup.gaver.lenker.map((lenke) => (
                <a
                  key={lenke.navn}
                  href={lenke.url}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-[#c9bb9a] px-7 py-2.5 text-xs tracking-[0.2em] uppercase text-[#a08e63]"
                >
                  {lenke.navn}
                </a>
              ))}
            </div>
          </Bolk>

          <Bolk tittel="Bilder">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {bryllup.galleri.map((bilde, i) => (
                <div
                  key={i}
                  className="flex aspect-[4/5] items-center justify-center border border-[#ddd3bd] p-2 text-center"
                >
                  <span className="text-xs italic text-[#a08e63]">
                    {bilde.bildetekst}
                  </span>
                </div>
              ))}
            </div>
          </Bolk>

          <Bolk tittel="Ta kontakt">
            {hoved && (
              <div className="border border-[#c9bb9a] p-7 text-center">
                <p className="text-xs tracking-[0.3em] uppercase text-[#a08e63]">
                  {hoved.rolle}
                </p>
                <h3 className="mt-2 text-2xl">{hoved.navn}</h3>
                {hoved.notat && (
                  <p className="mx-auto mt-3 max-w-md text-sm leading-loose italic text-[#7a7062]">
                    {hoved.notat}
                  </p>
                )}
                <p className="mt-3 text-sm">{hoved.telefon}</p>
              </div>
            )}
            <div className="mt-6 grid gap-4 text-center sm:grid-cols-3">
              {ovrige.map((person) => (
                <div key={`${person.rolle}-${person.navn}`}>
                  <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#a08e63]">
                    {person.rolle}
                  </p>
                  <h3 className="mt-1.5 text-sm">{person.navn}</h3>
                  <p className="text-sm text-[#7a7062]">{person.telefon}</p>
                </div>
              ))}
            </div>
          </Bolk>

          <Bolk id="rsvp" tittel={`Svar innen ${bryllup.rsvp.frist}`}>
            <div className="mx-auto max-w-lg">
              <RsvpFelles
                stil={{
                  etikett:
                    "mb-2 block text-xs tracking-[0.2em] uppercase text-[#a08e63]",
                  felt: "w-full border border-[#ddd3bd] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#a08e63]",
                  hjelp: "mt-2 text-xs italic text-[#7a7062]",
                  valgAktiv:
                    "flex-1 cursor-pointer border border-[#a08e63] bg-[#a08e63] px-4 py-3 text-center text-sm text-[#fdfbf5]",
                  valgPassiv:
                    "flex-1 cursor-pointer border border-[#ddd3bd] px-4 py-3 text-center text-sm",
                  knapp:
                    "w-full border border-[#a08e63] py-3.5 text-xs tracking-[0.3em] uppercase text-[#a08e63] disabled:opacity-50",
                  kvittering: "border border-[#c9bb9a] p-10 text-center",
                  kvitteringTittel: "text-2xl italic",
                }}
              />
            </div>
          </Bolk>

          <footer className="px-8 pb-12 text-center">
            <Vignett />
            <p className="mt-5 text-xl">
              {bryllup.par.brud} <span className="italic text-[#a08e63]">og</span>{" "}
              {bryllup.par.brudgom}
            </p>
            <a
              href="/versjoner"
              className="mt-5 inline-block text-xs uppercase tracking-[0.2em] text-[#a08e63]"
            >
              Alle utkast
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}
