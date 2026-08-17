import { erInnlogget } from "@/lib/admin-tilgang";
import Innlogging from "../Innlogging";

/**
 * Diagnosesiden. Viser hva serveren faktisk ser: hvilke miljøvariabler som er
 * satt, og om databasen svarer. Ment for å finne ut hvorfor noe feiler i drift.
 *
 * Ligger bak samme innlogging som resten av /admin, og skriver aldri ut
 * tilkoblingsstrengen – bare vertsnavnet.
 */
export const dynamic = "force-dynamic";

export const metadata = { robots: { index: false, follow: false } };

export default async function Status() {
  if (!(await erInnlogget())) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <Innlogging />
      </main>
    );
  }

  const harPostgresUrl = Boolean(process.env.POSTGRES_URL);
  const harDatabaseUrl = Boolean(process.env.DATABASE_URL);
  const harDatabase = harPostgresUrl || harDatabaseUrl;

  const miljo: [string, string][] = [
    ["POSTGRES_URL", harPostgresUrl ? "satt" : "IKKE SATT"],
    ["DATABASE_URL", harDatabaseUrl ? "satt" : "IKKE SATT"],
    ["ADMIN_KODE", process.env.ADMIN_KODE ? "satt" : "IKKE SATT"],
    ["POSTGRES_SSL_NO_VERIFY", process.env.POSTGRES_SSL_NO_VERIFY ?? "(ikke satt)"],
    ["Kjører på Vercel", process.env.VERCEL ? "ja" : "nei"],
    ["NODE_ENV", process.env.NODE_ENV ?? "(ukjent)"],
    ["Node-versjon", process.version],
    [
      "Lagring i bruk",
      harDatabase ? "Postgres" : process.env.VERCEL ? "INGEN – vil feile" : "data/rsvp.json",
    ],
  ];

  let database: { ok: boolean; melding: string } | null = null;
  let vert = "";

  if (harDatabase) {
    // Importeres først her, så siden fungerer selv uten database satt opp
    const lager = await import("@/lib/rsvp-lager-postgres");
    vert = lager.vertsnavn();
    database = await lager.sjekkTilkobling();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl font-light">Status</h1>
      <p className="mt-3 text-sm text-dempet">
        Dette er hva serveren ser akkurat nå. Kopier gjerne hele siden hvis du trenger
        hjelp til å tolke den.
      </p>

      <h2 className="mt-12 mb-4 text-xs uppercase tracking-[0.25em] text-gull">
        Miljø
      </h2>
      <dl className="border-t border-kant text-sm">
        {miljo.map(([navn, verdi]) => (
          <div key={navn} className="flex justify-between gap-6 border-b border-kant py-3">
            <dt className="text-dempet">{navn}</dt>
            <dd
              className={
                verdi.includes("IKKE SATT") || verdi.includes("INGEN")
                  ? "text-red-700"
                  : "font-medium"
              }
            >
              {verdi}
            </dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-12 mb-4 text-xs uppercase tracking-[0.25em] text-gull">
        Database
      </h2>

      {!harDatabase ? (
        <p className="text-sm leading-relaxed text-red-700">
          Ingen tilkoblingsstreng funnet. Koble en Postgres-database til prosjektet i
          Vercel, eller legg inn POSTGRES_URL manuelt under Settings → Environment
          Variables – og rull ut på nytt etterpå.
        </p>
      ) : (
        <>
          <p className="text-sm text-dempet">
            Vert: <span className="text-blekk">{vert}</span>
          </p>
          <p className="mt-3 text-sm">
            {database?.ok ? (
              <span className="text-salvie-dyp">Tilkobling OK</span>
            ) : (
              <span className="text-red-700">Tilkobling feilet</span>
            )}
          </p>
          <pre className="mt-3 overflow-x-auto border border-kant bg-krem-dyp p-4 text-sm whitespace-pre-wrap">
            {database?.melding}
          </pre>
        </>
      )}

      <p className="mt-12 text-sm">
        <a href="/admin" className="text-salvie-dyp underline underline-offset-4">
          Tilbake til RSVP-svarene
        </a>
      </p>
    </main>
  );
}
