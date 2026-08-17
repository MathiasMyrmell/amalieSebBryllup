import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Innlogging til RSVP-oversikten.
 *
 * Koden settes i .env.local (ADMIN_KODE). Når den skrives riktig, legges det en
 * informasjonskapsel med et avtrykk av koden – ikke koden selv – slik at man slipper
 * å skrive den på nytt hver gang. Kapselen er httpOnly, så JavaScript i nettleseren
 * kommer ikke til den.
 *
 * Dette er en enkel sperre for å holde oversikten unna gjester og søkemotorer,
 * ikke ekte brukerinnlogging. Bruk en kode du ikke bruker andre steder.
 */

const KAPSEL = "bryllup_admin";
const STI = "/admin";
const LEVETID = 60 * 60 * 24 * 30; // 30 dager

function avtrykk(verdi: string) {
  return createHash("sha256").update(verdi).digest("hex");
}

/** Sammenligner uten å røpe hvor mange tegn som stemte */
export function erLike(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/** Koden fra .env.local, eller null om den ikke er satt */
export function riktigKode(): string | null {
  const kode = process.env.ADMIN_KODE;
  return kode && kode.length > 0 ? kode : null;
}

export async function erInnlogget(): Promise<boolean> {
  const kode = riktigKode();
  if (!kode) return false;

  const kapsel = (await cookies()).get(KAPSEL)?.value;
  if (!kapsel) return false;

  return erLike(kapsel, avtrykk(kode));
}

export async function loggInn(): Promise<void> {
  const kode = riktigKode();
  if (!kode) return;

  (await cookies()).set(KAPSEL, avtrykk(kode), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: STI,
    maxAge: LEVETID,
  });
}

export async function loggUt(): Promise<void> {
  // Tømmer kapselen med samme sti som den ble satt med
  (await cookies()).set(KAPSEL, "", { path: STI, maxAge: 0 });
}
