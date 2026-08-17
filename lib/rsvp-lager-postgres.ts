import { Pool } from "pg";
import type { Svar } from "./rsvp-typer";

/**
 * Lagring av RSVP-svar i en Postgres-database.
 *
 * Brukes automatisk så snart POSTGRES_URL eller DATABASE_URL er satt – det gjør
 * Vercel for deg når du kobler på en database fra Storage-fanen. Fungerer like
 * godt mot Neon, Supabase, eller en hvilken som helst annen Postgres.
 *
 * Tabellen opprettes av seg selv første gang noe leses eller skrives, så du
 * trenger ikke kjøre noen migrering manuelt.
 */

const TILKOBLING = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;

/** Er det en database på egen maskin? Da trengs ikke TLS. */
function erLokal(url: string) {
  return /@(localhost|127\.0\.0\.1|\[::1\])[:/]/.test(url);
}

/**
 * Vi krever gyldig sertifikat som standard, noe Neon og Supabase har.
 * Bruker leverandøren din et selvsignert sertifikat, feiler tilkoblingen med
 * «self-signed certificate in certificate chain». Sett da miljøvariabelen
 * POSTGRES_SSL_NO_VERIFY=true – men bare hvis du vet at det er årsaken.
 */
const hoppOverSertifikatsjekk = process.env.POSTGRES_SSL_NO_VERIFY === "true";

// Én tilkoblingspool per prosess. Den legges på globalThis så den overlever
// hot reload i utvikling – ellers ville hver filendring åpnet en ny pool.
const globaltOmfang = globalThis as typeof globalThis & {
  _rsvpPool?: Pool;
  _rsvpTabell?: Promise<void>;
};

function pool(): Pool {
  if (!TILKOBLING) {
    throw new Error(
      "Mangler POSTGRES_URL (eller DATABASE_URL). Koble på en database i Vercel, eller fjern variabelen for å lagre i fil lokalt.",
    );
  }

  if (!globaltOmfang._rsvpPool) {
    globaltOmfang._rsvpPool = new Pool({
      connectionString: TILKOBLING,
      // Serverløse funksjoner er kortlivde – hold antall tilkoblinger lavt
      max: 3,
      ssl: erLokal(TILKOBLING)
        ? false
        : { rejectUnauthorized: !hoppOverSertifikatsjekk },
    });
  }

  return globaltOmfang._rsvpPool;
}

/**
 * Prøver å snakke med databasen, og forteller hva som eventuelt gikk galt.
 * Brukes av diagnosesiden /admin/status.
 */
export async function sjekkTilkobling(): Promise<{ ok: boolean; melding: string }> {
  try {
    const { rows } = await pool().query<{ versjon: string }>("SELECT version() AS versjon");
    return { ok: true, melding: rows[0]?.versjon ?? "tilkoblet" };
  } catch (feil) {
    return { ok: false, melding: feil instanceof Error ? feil.message : String(feil) };
  }
}

/** Verten i tilkoblingsstrengen, uten brukernavn og passord */
export function vertsnavn(): string {
  if (!TILKOBLING) return "(ingen tilkoblingsstreng)";
  try {
    return new URL(TILKOBLING).host;
  } catch {
    return "(klarte ikke tolke tilkoblingsstrengen)";
  }
}

const SKJEMA = `
  CREATE TABLE IF NOT EXISTS rsvp (
    id         TEXT PRIMARY KEY,
    mottatt    TIMESTAMPTZ NOT NULL,
    navn       TEXT        NOT NULL,
    epost      TEXT        NOT NULL DEFAULT '',
    telefon    TEXT        NOT NULL DEFAULT '',
    kommer     TEXT        NOT NULL,
    antall     INTEGER     NOT NULL DEFAULT 0,
    folge      TEXT        NOT NULL DEFAULT '',
    allergier  TEXT        NOT NULL DEFAULT '',
    melding    TEXT        NOT NULL DEFAULT '',
    fjernet    BOOLEAN     NOT NULL DEFAULT FALSE
  )
`;

/** Sørger for at tabellen finnes. Kjøres bare én gang per prosess. */
function klargjor(): Promise<void> {
  if (!globaltOmfang._rsvpTabell) {
    globaltOmfang._rsvpTabell = pool()
      .query(SKJEMA)
      .then(() => undefined)
      .catch((feil) => {
        // Ikke lås inn en feilet klargjøring – neste forsøk skal få prøve på nytt
        globaltOmfang._rsvpTabell = undefined;
        throw feil;
      });
  }

  return globaltOmfang._rsvpTabell;
}

type Rad = Omit<Svar, "mottatt" | "fjernet"> & { mottatt: Date; fjernet: boolean };

function tilSvar(rad: Rad): Svar {
  return { ...rad, mottatt: rad.mottatt.toISOString() };
}

export async function lesSvar(): Promise<Svar[]> {
  await klargjor();

  const { rows } = await pool().query<Rad>(
    "SELECT * FROM rsvp ORDER BY mottatt ASC",
  );

  return rows.map(tilSvar);
}

export async function leggTilSvar(svar: Svar): Promise<void> {
  await klargjor();

  await pool().query(
    `INSERT INTO rsvp (id, mottatt, navn, epost, telefon, kommer, antall, folge, allergier, melding, fjernet)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      svar.id,
      svar.mottatt,
      svar.navn,
      svar.epost,
      svar.telefon,
      svar.kommer,
      svar.antall,
      svar.folge,
      svar.allergier,
      svar.melding,
      svar.fjernet ?? false,
    ],
  );
}

/** Flytter et svar til arkivet, eller henter det opp igjen. Sletter ingenting. */
export async function settFjernet(id: string, fjernet: boolean): Promise<boolean> {
  await klargjor();

  const { rowCount } = await pool().query("UPDATE rsvp SET fjernet = $2 WHERE id = $1", [
    id,
    fjernet,
  ]);

  return (rowCount ?? 0) > 0;
}

/**
 * Sletter et svar for godt. Kan ikke angres, og derfor krever spørringen at
 * svaret allerede ligger i arkivet – et feilklikk i hovedlisten er aldri endelig.
 */
export async function slettSvar(id: string): Promise<boolean> {
  await klargjor();

  const { rowCount } = await pool().query(
    "DELETE FROM rsvp WHERE id = $1 AND fjernet = TRUE",
    [id],
  );

  return (rowCount ?? 0) > 0;
}
