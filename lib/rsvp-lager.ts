import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Enkel lagring av RSVP-svar i en JSON-fil under  data/rsvp.json.
 *
 * Dette holder for et bryllup med noen hundre gjester, og krever ingen
 * database. MERK: det forutsetter en server med skrivbart filsystem
 * (f.eks. egen VPS, Docker eller `npm start` på en maskin som står på).
 * Kjører du på Vercel eller andre serverløse plattformer er filsystemet
 * flyktig – se README for alternativer.
 */

export type Svar = {
  id: string;
  mottatt: string;
  navn: string;
  epost: string;
  telefon: string;
  kommer: "ja" | "nei";
  antall: number;
  folge: string;
  allergier: string;
  melding: string;
};

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

export async function leggTilSvar(svar: Svar): Promise<void> {
  const alle = await lesSvar();
  alle.push(svar);

  await fs.mkdir(path.dirname(FIL), { recursive: true });
  // Skriv til midlertidig fil først, så ingen svar går tapt om noe kræsjer midtveis.
  const midlertidig = `${FIL}.tmp`;
  await fs.writeFile(midlertidig, JSON.stringify(alle, null, 2), "utf8");
  await fs.rename(midlertidig, FIL);
}
