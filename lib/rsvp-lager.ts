import type { Lager, Svar } from "./rsvp-typer";

export type { Svar };

/**
 * Velger hvor RSVP-svarene lagres.
 *
 *   POSTGRES_URL / DATABASE_URL satt  →  Postgres  (Vercel og annen drift)
 *   ingen av dem satt                 →  data/rsvp.json  (lokal utvikling)
 *
 * Resten av koden bryr seg ikke om hvilken som brukes – begge har samme
 * funksjoner. Vil du bytte til noe helt annet, er det bare å lage en ny fil
 * med de samme fire funksjonene og peke hit.
 */
const brukPostgres = Boolean(process.env.POSTGRES_URL ?? process.env.DATABASE_URL);

async function lager(): Promise<Lager> {
  if (brukPostgres) return await import("./rsvp-lager-postgres");

  // Uten denne ville fillagringen blitt brukt på Vercel, og feilet med en
  // kryptisk EROFS-feil ved første skriving. Bedre å si hva som mangler.
  if (process.env.VERCEL) {
    throw new Error(
      "Ingen database er koblet til. Filsystemet på Vercel er skrivebeskyttet, " +
        "så POSTGRES_URL (eller DATABASE_URL) må være satt under Settings → " +
        "Environment Variables. Husk å rulle ut på nytt etterpå.",
    );
  }

  return await import("./rsvp-lager-fil");
}

export async function lesSvar(): Promise<Svar[]> {
  return (await lager()).lesSvar();
}

export async function leggTilSvar(svar: Svar): Promise<void> {
  return (await lager()).leggTilSvar(svar);
}

export async function settFjernet(id: string, fjernet: boolean): Promise<boolean> {
  return (await lager()).settFjernet(id, fjernet);
}

export async function slettSvar(id: string): Promise<boolean> {
  return (await lager()).slettSvar(id);
}
