"use client";

import { useState } from "react";

export type RsvpStatus = "klar" | "sender" | "sendt" | "feil";

/**
 * All logikken bak RSVP-skjemaet, uten noe utseende.
 *
 * Utformingsvariantene (/v2 og utover) deler denne, slik at det bare er
 * markup og farger som skiller dem – ikke oppførsel. Alle sender til samme
 * /api/rsvp og havner i samme liste på /admin.
 */
export function brukRsvp() {
  const [status, setStatus] = useState<RsvpStatus>("klar");
  const [feilmelding, setFeilmelding] = useState("");
  const [kommer, setKommer] = useState<"ja" | "nei" | "">("");
  // Holdes som tekst, slik at feltet kan stå tomt mens gjesten skriver
  const [antallTekst, setAntallTekst] = useState("1");

  const antall = Math.min(Math.max(parseInt(antallTekst, 10) || 1, 1), 10);
  const antallFolge = antall - 1;

  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sender");
    setFeilmelding("");

    const data = Object.fromEntries(new FormData(event.currentTarget).entries());

    try {
      const svar = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!svar.ok) {
        const kropp = (await svar.json().catch(() => ({}))) as { feil?: string };
        setFeilmelding(kropp.feil ?? "Noe gikk galt. Prøv igjen.");
        setStatus("feil");
        return;
      }

      setStatus("sendt");
    } catch {
      setFeilmelding("Fikk ikke kontakt med serveren. Sjekk nettet og prøv igjen.");
      setStatus("feil");
    }
  }

  return {
    status,
    feilmelding,
    kommer,
    setKommer,
    antallTekst,
    setAntallTekst,
    antallFolge,
    send,
  };
}
