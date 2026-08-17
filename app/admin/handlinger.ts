"use server";

import { redirect } from "next/navigation";
import { erLike, loggInn, loggUt, riktigKode } from "@/lib/admin-tilgang";

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
