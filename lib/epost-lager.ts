import { pool } from "./rsvp-lager-postgres";
import type { Epost } from "./rsvp-typer";

/**
 * Lagring av e-poster som er sendt til eller mottatt fra gjester.
 *
 * Ligger i samme Postgres-database som RSVP-svarene, i tabellen «epost».
 * Uten database (lokal utvikling med fillagring) gjør funksjonene her ingenting –
 * da vises bare ikke e-poster på /admin.
 */

export const harEpostLager = Boolean(process.env.POSTGRES_URL ?? process.env.DATABASE_URL);

const globaltOmfang = globalThis as typeof globalThis & {
  _epostTabell?: Promise<void>;
};

const SKJEMA = [
  `CREATE TABLE IF NOT EXISTS epost (
    id         TEXT PRIMARY KEY,
    adresse    TEXT        NOT NULL,
    retning    TEXT        NOT NULL,
    fra        TEXT        NOT NULL DEFAULT '',
    til        TEXT        NOT NULL DEFAULT '',
    emne       TEXT        NOT NULL DEFAULT '',
    tekst      TEXT        NOT NULL DEFAULT '',
    tidspunkt  TIMESTAMPTZ NOT NULL
  )`,
  "CREATE INDEX IF NOT EXISTS epost_adresse_idx ON epost (adresse)",
];

function klargjor(): Promise<void> {
  if (!globaltOmfang._epostTabell) {
    globaltOmfang._epostTabell = (async () => {
      for (const sql of SKJEMA) await pool().query(sql);
    })().catch((feil) => {
      globaltOmfang._epostTabell = undefined;
      throw feil;
    });
  }
  return globaltOmfang._epostTabell;
}

type Rad = Omit<Epost, "tidspunkt"> & { tidspunkt: Date };

/** Lagrer en e-post. Finnes den fra før (samme Message-ID), skjer ingenting. */
export async function lagreEpost(epost: Epost): Promise<void> {
  if (!harEpostLager) return;
  await klargjor();

  await pool().query(
    `INSERT INTO epost (id, adresse, retning, fra, til, emne, tekst, tidspunkt)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (id) DO NOTHING`,
    [
      epost.id,
      epost.adresse.toLowerCase(),
      epost.retning,
      epost.fra,
      epost.til,
      epost.emne,
      epost.tekst,
      epost.tidspunkt,
    ],
  );
}

/** Alle e-poster, eldste først */
export async function lesEposter(): Promise<Epost[]> {
  if (!harEpostLager) return [];
  await klargjor();

  const { rows } = await pool().query<Rad>("SELECT * FROM epost ORDER BY tidspunkt ASC");
  return rows.map((r) => ({ ...r, tidspunkt: r.tidspunkt.toISOString() }));
}

/** Message-ID-ene vi allerede har lagret */
export async function kjenteEpostIder(): Promise<Set<string>> {
  if (!harEpostLager) return new Set();
  await klargjor();

  const { rows } = await pool().query<{ id: string }>("SELECT id FROM epost");
  return new Set(rows.map((r) => r.id));
}

/** Sletter all e-post knyttet til en adresse. Brukes når en gjest slettes for godt. */
export async function slettEposterFor(adresse: string): Promise<void> {
  if (!harEpostLager) return;
  await klargjor();

  await pool().query("DELETE FROM epost WHERE adresse = $1", [adresse.toLowerCase()]);
}
