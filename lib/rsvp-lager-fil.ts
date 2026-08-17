import { promises as fs } from "node:fs";
import path from "node:path";
import type { Svar } from "./rsvp-typer";

/**
 * Lagring av RSVP-svar i en JSON-fil under  data/rsvp.json.
 *
 * Dette brukes automatisk når det ikke er satt opp noen database, og er ment
 * for lokal utvikling – da slipper du å ha en database kjørende for å teste
 * skjemaet. Det fungerer også i drift på en server med skrivbart filsystem
 * (egen VPS, Docker, eller `npm start` på en maskin som står på).
 *
 * På Vercel og andre serverløse plattformer er filsystemet skrivebeskyttet,
 * og da må du bruke database. Se lib/rsvp-lager.ts og README.
 */

const FIL = path.join(process.cwd(), "data", "rsvp.json");

export async function lesSvar(): Promise<Svar[]> {
  try {
    const innhold = await fs.readFile(FIL, "utf8");
    const data: unknown = JSON.parse(innhold);
    return Array.isArray(data) ? (data as Svar[]) : [];
  } catch (feil) {
    // Filen finnes ikke ennå – det er helt greit før første svar.
    if ((feil as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw feil;
  }
}

async function skrivAlle(alle: Svar[]): Promise<void> {
  await fs.mkdir(path.dirname(FIL), { recursive: true });
  // Skriv til midlertidig fil først, så ingen svar går tapt om noe kræsjer midtveis.
  const midlertidig = `${FIL}.tmp`;
  await fs.writeFile(midlertidig, JSON.stringify(alle, null, 2), "utf8");
  await fs.rename(midlertidig, FIL);
}

export async function leggTilSvar(svar: Svar): Promise<void> {
  const alle = await lesSvar();
  alle.push(svar);
  await skrivAlle(alle);
}

/**
 * Flytter et svar til arkivet (`fjernet: true`) eller henter det opp igjen.
 * Ingenting slettes fra filen.
 */
export async function settFjernet(id: string, fjernet: boolean): Promise<boolean> {
  const alle = await lesSvar();
  const svar = alle.find((s) => s.id === id);
  if (!svar) return false;

  svar.fjernet = fjernet;
  await skrivAlle(alle);
  return true;
}

/**
 * Sletter et svar for godt. Til forskjell fra settFjernet kan dette ikke angres,
 * så den brukes bare fra arkivet – etter at svaret allerede er fjernet én gang.
 */
export async function slettSvar(id: string): Promise<boolean> {
  const alle = await lesSvar();
  const svar = alle.find((s) => s.id === id);

  // Bare arkiverte svar kan slettes, så et feilklikk i hovedlisten ikke er endelig
  if (!svar || !svar.fjernet) return false;

  await skrivAlle(alle.filter((s) => s.id !== id));
  return true;
}
