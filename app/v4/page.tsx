import Kart from "@/components/Kart";
import NedtellingFelles from "@/components/felles/NedtellingFelles";
import RsvpFelles from "@/components/felles/RsvpFelles";
import { bryllup } from "@/content/bryllup";

/**
 * v4 — «Sveitsisk». Hvit bakgrunn, ett rutenett, ingen dekorasjon.
 * All rytme kommer fra typografi og luft.
 */

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
    <section id={id} className="border-t border-black/10 py-14">
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="text-xs tabular-nums text-black/40">{nr}</p>
          <h2 className="mt-1 text-sm font-medium tracking-tight">{tittel}</h2>
        </div>
        <div className="md:col-span-9">{children}</div>
      </div>
    </section>
  );
}

export default function V4() {
  const hoved = bryllup.kontakter.find((p) => p.hoved);
  const ovrige = bryllup.kontakter.filter((p) => p !== hoved);

  return (
    <div className="mx-auto max-w-5xl px-6">
      <header className="grid gap-6 py-24 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="text-xs text-black/40">
            {bryllup.datoTekst}
            <br />
            {bryllup.sted}
          </p>
        </div>
        <div className="md:col-span-9">
          <h1 className="text-5xl leading-[1.05] font-medium tracking-tight sm:text-7xl">
            {bryllup.par.brud} &amp; {bryllup.par.brudgom}
          </h1>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-black/60">
            {bryllup.ingress}
          </p>

          <div className="mt-14 max-w-md">
            <NedtellingFelles
              dato={bryllup.dato}
              stil={{
                rad: "grid grid-cols-4 gap-4",
                celle: "",
                tall: "text-3xl font-medium tabular-nums tracking-tight",
                etikett: "mt-1 text-xs text-black/40",
                ferdig: "text-2xl font-medium",
              }}
              korteEtiketter
            />
          </div>

          {bryllup.rsvp.apen && (
            <a
              href="#rsvp"
              className="mt-14 inline-block border-b border-black pb-0.5 text-sm"
            >
              Gi beskjed
            </a>
          )}
        </div>
      </header>

      <Bolk nr="01" tittel="Program">
        <table className="w-full text-sm">
          <tbody>
            {bryllup.program.map((post) => (
              <tr key={`${post.tid}-${post.tittel}`} className="border-b border-black/10">
                <td className="w-20 py-4 align-top tabular-nums text-black/40">
                  {post.tid}
                </td>
                <td className="py-4 align-top">
                  <div className="font-medium">{post.tittel}</div>
                  {post.beskrivelse && (
                    <div className="mt-0.5 text-black/50">{post.beskrivelse}</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Bolk>

      <Bolk nr="02" tittel="Sted">
        <div className="grid gap-10 sm:grid-cols-2">
          {bryllup.steder.map((sted) => (
            <article key={sted.navn + sted.merkelapp}>
              <p className="text-xs text-black/40">{sted.merkelapp}</p>
              <h3 className="mt-1 text-xl font-medium tracking-tight">{sted.navn}</h3>
              <p className="mt-1 text-sm text-black/60">{sted.adresse}</p>
              {sted.notat && <p className="text-sm text-black/40">{sted.notat}</p>}
              {sted.kart && (
                <div className="mt-4">
                  <Kart
                    lat={sted.kart.lat}
                    lon={sted.kart.lon}
                    zoom={sted.kart.zoom}
                    tittel={sted.navn}
                    lenke={sted.kartUrl}
                    hoyde={160}
                    lag="light_nolabels"
                    ramme="border border-black/10"
                    markor="bg-black ring-4 ring-white"
                    merke="bg-white/80 text-black/40"
                  />
                </div>
              )}
              <a
                href={sted.kartUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block border-b border-black/30 pb-0.5 text-sm"
              >
                Veibeskrivelse
              </a>
            </article>
          ))}
        </div>
      </Bolk>

      <Bolk nr="03" tittel="Praktisk">
        <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {bryllup.praktisk.map((punkt) => (
            <div key={punkt.tittel}>
              <dt className="text-sm font-medium">{punkt.tittel}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-black/60">
                {punkt.tekst}
              </dd>
            </div>
          ))}
        </dl>
      </Bolk>

      <Bolk nr="04" tittel="Gaver">
        <p className="max-w-lg text-sm leading-relaxed text-black/70">
          {bryllup.gaver.tekst}
        </p>
        <div className="mt-5 flex flex-wrap gap-6">
          {bryllup.gaver.lenker.map((lenke) => (
            <a
              key={lenke.navn}
              href={lenke.url}
              target="_blank"
              rel="noreferrer"
              className="border-b border-black pb-0.5 text-sm"
            >
              {lenke.navn}
            </a>
          ))}
        </div>
      </Bolk>

      <Bolk nr="05" tittel="Bilder">
        <div className="grid grid-cols-3 gap-2">
          {bryllup.galleri.map((bilde, i) => (
            <div key={i} className="aspect-square bg-black/[0.04] p-3">
              <span className="text-xs text-black/40">{bilde.bildetekst}</span>
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk nr="06" tittel="Kontakt">
        <div className="grid gap-8 sm:grid-cols-2">
          {hoved && (
            <div className="sm:col-span-2">
              <p className="text-xs text-black/40">{hoved.rolle}</p>
              <h3 className="mt-1 text-xl font-medium tracking-tight">{hoved.navn}</h3>
              {hoved.notat && (
                <p className="mt-2 max-w-lg text-sm text-black/60">{hoved.notat}</p>
              )}
              <p className="mt-2 text-sm">
                {hoved.telefon} {hoved.epost && `· ${hoved.epost}`}
              </p>
            </div>
          )}
          {ovrige.map((person) => (
            <div key={`${person.rolle}-${person.navn}`}>
              <p className="text-xs text-black/40">{person.rolle}</p>
              <h3 className="mt-1 font-medium">{person.navn}</h3>
              <p className="text-sm text-black/60">{person.telefon}</p>
            </div>
          ))}
        </div>
      </Bolk>

      <Bolk id="rsvp" nr="07" tittel={`Svar innen ${bryllup.rsvp.frist}`}>
        <RsvpFelles
          stil={{
            skjema: "max-w-lg space-y-5",
            etikett: "mb-1.5 block text-xs text-black/50",
            felt: "w-full border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-black",
            hjelp: "mt-1.5 text-xs text-black/40",
            valgAktiv:
              "cursor-pointer border border-black bg-black px-5 py-2.5 text-sm text-white",
            valgPassiv: "cursor-pointer border border-black/15 px-5 py-2.5 text-sm",
            knapp:
              "bg-black px-8 py-3 text-sm text-white transition-opacity hover:opacity-80 disabled:opacity-40",
            kvittering: "max-w-lg border border-black/15 p-8",
            kvitteringTittel: "text-2xl font-medium tracking-tight",
          }}
        />
      </Bolk>

      <footer className="flex flex-wrap justify-between gap-4 border-t border-black/10 py-10 text-xs text-black/40">
        <span>
          {bryllup.par.brud} &amp; {bryllup.par.brudgom}
        </span>
        <span>{bryllup.datoTekst}</span>
        <a href="/versjoner" className="underline">
          Alle utkast
        </a>
      </footer>
    </div>
  );
}
