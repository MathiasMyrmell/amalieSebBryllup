import { erInnlogget } from "@/lib/admin-tilgang";
import { lesEposter } from "@/lib/epost-lager";
import { synkroniserEpost } from "@/lib/epost-innboks";
import { lesSvar } from "@/lib/rsvp-lager";
import type { Epost, Svar } from "@/lib/rsvp-typer";
import Gjesterad, { type Variant } from "./Gjesterad";
import Innlogging from "./Innlogging";
import { loggUtHandling } from "./handlinger";

/**
 * Oversikt over innkomne RSVP-svar.
 *
 * Åpnes på /admin. Er du ikke logget inn, møter du kodefeltet først.
 * Koden settes i .env.local (ADMIN_KODE) – se README.
 */
export const dynamic = "force-dynamic";
/** Tid til å hente e-post fra postkassen i tillegg til svarene */
export const maxDuration = 30;

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

  // Henter nye e-poster fra postkassen hver gang siden åpnes. Går det galt, vises
  // det som allerede er lagret, med en beskjed øverst.
  const epostSjekk = await synkroniserEpost(alle);
  let eposter: Epost[] = [];
  try {
    eposter = await lesEposter();
  } catch (feil) {
    console.error("Klarte ikke lese e-post:", feil);
  }

  // E-postene samles på adressen gjesten oppga. Brukes samme adresse flere ganger,
  // hører tråden til den som svarte først.
  const eierAvAdresse = new Map<string, Svar>();
  for (const s of alle) {
    const adresse = s.epost.trim().toLowerCase();
    if (adresse && !eierAvAdresse.has(adresse)) eierAvAdresse.set(adresse, s);
  }
  const eposterPerAdresse = new Map<string, Epost[]>();
  for (const e of eposter) {
    eposterPerAdresse.set(e.adresse, [...(eposterPerAdresse.get(e.adresse) ?? []), e]);
  }

  const rad = (s: Svar, variant: Variant) => {
    const adresse = s.epost.trim().toLowerCase();
    const eier = adresse ? eierAvAdresse.get(adresse) : undefined;
    const erEier = !eier || eier.id === s.id;
    return (
      <Gjesterad
        key={s.id}
        svar={s}
        eposter={erEier ? (eposterPerAdresse.get(adresse) ?? []) : []}
        eier={erEier ? undefined : eier?.navn}
        variant={variant}
      />
    );
  };

  const aktive = alle.filter((s) => !s.fjernet);
  const fjernede = alle.filter((s) => s.fjernet);

  const kommer = aktive.filter((s) => s.kommer === "ja");
  const kommerIkke = aktive.filter((s) => s.kommer !== "ja");
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
        <Tall verdi={kommerIkke.length} etikett="kan ikke" />
      </div>

      {epostSjekk.feil && (
        <p role="alert" className="mb-8 border border-kant bg-krem-dyp p-4 text-sm text-red-800">
          Fikk ikke hentet nye e-poster akkurat nå: {epostSjekk.feil}. E-poster som allerede er
          lagret vises som vanlig.
        </p>
      )}

      {aktive.length === 0 ? (
        <p className="text-dempet">Ingen svar ennå.</p>
      ) : (
        <>
          <Gruppe tittel={`Kommer (${kommer.length})`} variant="kommer">
            {kommer.map((s) => rad(s, "kommer"))}
          </Gruppe>
          <Gruppe tittel={`Kommer ikke (${kommerIkke.length})`} variant="kommerIkke">
            {kommerIkke.map((s) => rad(s, "kommerIkke"))}
          </Gruppe>
        </>
      )}

      {fjernede.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-light text-dempet">
            Fjernet ({fjernede.length})
          </h2>
          <p className="mt-2 mb-6 text-sm text-dempet">
            Disse telles ikke med i tallene over. «Hent opp igjen» legger svaret tilbake i
            listen. «Slett» fjerner det og tilhørende e-poster for godt, og kan ikke angres.
          </p>
          <div className="opacity-70">
            <Tabell variant="fjernet">{fjernede.map((s) => rad(s, "fjernet"))}</Tabell>
          </div>
        </section>
      )}
    </Ramme>
  );
}

function Gruppe({
  tittel,
  variant,
  children,
}: {
  tittel: string;
  variant: Variant;
  children: React.ReactNode;
}) {
  const tom = Array.isArray(children) && children.length === 0;
  return (
    <section className="mt-12 first:mt-0">
      <h2 className="mb-5 font-display text-2xl font-light">{tittel}</h2>
      {tom ? <p className="text-sm text-dempet">Ingen.</p> : <Tabell variant={variant}>{children}</Tabell>}
    </section>
  );
}

/** Overskriftene følger hva som er relevant: følge og allergier gir bare mening for dem som kommer */
function Tabell({ variant, children }: { variant: Variant; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-kant text-xs uppercase tracking-wider text-dempet">
            <th className="py-3 pr-4">Navn</th>
            {variant === "fjernet" && <th className="py-3 pr-4">Svar</th>}
            {variant === "kommer" && (
              <>
                <th className="py-3 pr-4">Ant.</th>
                <th className="py-3 pr-4">Følge</th>
                <th className="py-3 pr-4">Allergier</th>
              </>
            )}
            <th className="py-3 pr-4">Kontakt</th>
            <th className="py-3 pr-4">Hilsen</th>
            <th className="py-3 pr-4">Mottatt</th>
            <th className="py-3" />
          </tr>
        </thead>
        <tbody>{children}</tbody>
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
