import { erInnlogget } from "@/lib/admin-tilgang";
import { lesSvar, type Svar } from "@/lib/rsvp-lager";
import Innlogging from "./Innlogging";
import SlettKnapp from "./SlettKnapp";
import { fjernSvar, hentOppSvar, loggUtHandling } from "./handlinger";

/**
 * Oversikt over innkomne RSVP-svar.
 *
 * Åpnes på /admin. Er du ikke logget inn, møter du kodefeltet først.
 * Koden settes i .env.local (ADMIN_KODE) – se README.
 */
export const dynamic = "force-dynamic";

export const metadata = { robots: { index: false, follow: false } };

export default async function Admin() {
  if (!(await erInnlogget())) {
    return (
      <Ramme>
        <Innlogging />
      </Ramme>
    );
  }

  // Feiler lagringen, er det nesten alltid oppsettet av databasen. Vis hva som
  // gikk galt her i stedet for å la siden svare 500 uten forklaring.
  let alle;
  try {
    alle = await lesSvar();
  } catch (feil) {
    return (
      <Ramme>
        <h1 className="font-display text-4xl font-light">Får ikke kontakt med lagringen</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-dempet">
          Svarene kunne ikke hentes. Feilmeldingen fra serveren:
        </p>
        <pre className="mt-4 overflow-x-auto border border-kant bg-krem-dyp p-4 text-sm text-red-800">
          {feil instanceof Error ? feil.message : String(feil)}
        </pre>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-dempet">
          Se avsnittet «Hvor svarene lagres» i README for hva som må være satt opp.
        </p>
      </Ramme>
    );
  }

  const aktive = alle.filter((s) => !s.fjernet);
  const fjernede = alle.filter((s) => s.fjernet);

  const kommer = aktive.filter((s) => s.kommer === "ja");
  const antallGjester = kommer.reduce((sum, s) => sum + (s.antall || 1), 0);

  return (
    <Ramme>
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-display text-4xl font-light">RSVP-svar</h1>
        <form action={loggUtHandling}>
          <button
            type="submit"
            className="text-sm text-dempet underline-offset-4 transition-colors hover:text-salvie-dyp hover:underline"
          >
            Logg ut
          </button>
        </form>
      </div>

      <div className="my-8 flex gap-10 border-y border-kant py-5 text-sm">
        <Tall verdi={aktive.length} etikett="svar totalt" />
        <Tall verdi={antallGjester} etikett="gjester kommer" />
        <Tall verdi={aktive.length - kommer.length} etikett="kan ikke" />
      </div>

      {aktive.length === 0 ? (
        <p className="text-dempet">Ingen svar ennå.</p>
      ) : (
        <Tabell svar={aktive} handling={fjernSvar} knappetekst="Fjern" />
      )}

      {fjernede.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-light text-dempet">
            Fjernet ({fjernede.length})
          </h2>
          <p className="mt-2 mb-6 text-sm text-dempet">
            Disse telles ikke med i tallene over. «Hent opp igjen» legger svaret tilbake i
            listen. «Slett» fjerner det for godt, og kan ikke angres.
          </p>
          <div className="opacity-70">
            <Tabell
              svar={fjernede}
              handling={hentOppSvar}
              knappetekst="Hent opp igjen"
              kanSlettes
            />
          </div>
        </section>
      )}
    </Ramme>
  );
}

function Tabell({
  svar,
  handling,
  knappetekst,
  kanSlettes,
}: {
  svar: Svar[];
  /** Server action som kjøres på knappen i hver rad */
  handling: (skjema: FormData) => Promise<void>;
  knappetekst: string;
  /** Viser i tillegg en «Slett»-knapp. Bare aktuelt i arkivet. */
  kanSlettes?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-kant text-xs uppercase tracking-wider text-dempet">
            <th className="py-3 pr-4">Navn</th>
            <th className="py-3 pr-4">Svar</th>
            <th className="py-3 pr-4">Ant.</th>
            <th className="py-3 pr-4">Følge</th>
            <th className="py-3 pr-4">Allergier</th>
            <th className="py-3 pr-4">Kontakt</th>
            <th className="py-3 pr-4">Hilsen</th>
            <th className="py-3 pr-4">Mottatt</th>
            <th className="py-3" />
          </tr>
        </thead>
        <tbody>
          {svar.map((s) => (
            <tr key={s.id} className="border-b border-kant/60 align-top">
              <td className="py-3 pr-4 font-medium">{s.navn}</td>
              <td className="py-3 pr-4">
                <span className={s.kommer === "ja" ? "text-salvie-dyp" : "text-dempet"}>
                  {s.kommer === "ja" ? "Kommer" : "Kan ikke"}
                </span>
              </td>
              <td className="py-3 pr-4 tabular-nums">{s.antall || "–"}</td>
              <td className="py-3 pr-4">{s.folge || "–"}</td>
              <td className="py-3 pr-4">{s.allergier || "–"}</td>
              <td className="py-3 pr-4">
                {s.epost && <div className="break-all">{s.epost}</div>}
                {s.telefon && <div>{s.telefon}</div>}
                {!s.epost && !s.telefon && "–"}
              </td>
              <td className="max-w-xs py-3 pr-4 text-dempet">{s.melding || "–"}</td>
              <td className="py-3 pr-4 whitespace-nowrap text-dempet">
                {new Date(s.mottatt).toLocaleDateString("nb-NO", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </td>
              <td className="py-3 whitespace-nowrap text-right">
                <div className="flex justify-end gap-4">
                  <form action={handling}>
                    <input type="hidden" name="id" value={s.id} />
                    <button
                      type="submit"
                      className="text-xs text-dempet underline-offset-4 transition-colors hover:text-salvie-dyp hover:underline"
                    >
                      {knappetekst}
                    </button>
                  </form>
                  {kanSlettes && <SlettKnapp id={s.id} navn={s.navn} />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Ramme({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto max-w-6xl px-6 py-16">{children}</main>;
}

function Tall({ verdi, etikett }: { verdi: number; etikett: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-light lining-nums">{verdi}</div>
      <div className="text-xs uppercase tracking-wider text-dempet">{etikett}</div>
    </div>
  );
}
