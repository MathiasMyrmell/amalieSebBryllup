"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { erInnlogget, erLike, loggInn, loggUt, riktigKode } from "@/lib/admin-tilgang";
import { settFjernet, slettSvar } from "@/lib/rsvp-lager";

/** Kalles av innloggingsskjemaet. Returnerer en feilmelding, eller slipper deg inn. */
export async function sendKode(
  _forrige: string | null,
  skjema: FormData,
): Promise<string | null> {
  if (!riktigKode()) {
    return "ADMIN_KODE er ikke satt på serveren. Se README.";
  }

  const oppgitt = String(skjema.get("kode") ?? "").trim();
  if (!oppgitt) {
    return "Skriv inn koden.";
  }

  if (!erLike(oppgitt, riktigKode()!)) {
    // Liten forsinkelse gjør det upraktisk å gjette seg fram
    await new Promise((r) => setTimeout(r, 600));
    return "Feil kode.";
  }

  await loggInn();
  redirect("/admin");
}

export async function loggUtHandling() {
  await loggUt();
  redirect("/admin");
}

/**
 * Flytter et svar til arkivet nederst på siden, eller henter det opp igjen.
 * Server actions kan kalles utenfra, så innloggingen må sjekkes her også –
 * det holder ikke at siden selv er beskyttet.
 */
async function endreFjernet(skjema: FormData, fjernet: boolean) {
  if (!(await erInnlogget())) return;

  const id = String(skjema.get("id") ?? "");
  if (!id) return;

  await settFjernet(id, fjernet);
  revalidatePath("/admin");
}

export async function fjernSvar(skjema: FormData) {
  await endreFjernet(skjema, true);
}

export async function hentOppSvar(skjema: FormData) {
  await endreFjernet(skjema, false);
}

/**
 * Sletter et svar for godt. Bekreftelsen skjer i nettleseren, men det er
 * `slettSvar` som passer på at bare arkiverte svar kan slettes.
 */
export async function slettSvarHandling(skjema: FormData) {
  if (!(await erInnlogget())) return;

  const id = String(skjema.get("id") ?? "");
  if (!id) return;

  await slettSvar(id);
  revalidatePath("/admin");
}
