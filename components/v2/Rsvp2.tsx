"use client";

import { useState } from "react";
import { bryllup } from "@/content/bryllup";

type Status = "klar" | "sender" | "sendt" | "feil";

const felt =
  "w-full border-b border-strek bg-transparent py-3 text-elfenben outline-none transition-colors placeholder:text-tåke/60 focus:border-messing";

const etikett = "mb-1 block text-[0.7rem] uppercase tracking-[0.2em] text-tåke";

/** Samme skjema og samme API som forsiden, men i den mørke stilen */
export default function Rsvp2() {
  const [status, setStatus] = useState<Status>("klar");
  const [feilmelding, setFeilmelding] = useState("");
  const [kommer, setKommer] = useState<"ja" | "nei" | "">("");
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

  if (!bryllup.rsvp.apen) return null;

  if (status === "sendt") {
    return (
      <div className="border border-messing/40 p-10">
        <p className="font-grotesk text-3xl">Takk.</p>
        <p className="mt-3 max-w-md leading-relaxed text-tåke">
          Svaret er registrert. {bryllup.rsvp.hjelpetekst}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={send} className="max-w-xl space-y-8">
      <div>
        <label htmlFor="v2-navn" className={etikett}>
          Navn *
        </label>
        <input
          id="v2-navn"
          name="navn"
          required
          maxLength={120}
          autoComplete="name"
          className={felt}
          placeholder="Ola Nordmann"
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="v2-epost" className={etikett}>
            E-post
          </label>
          <input
            id="v2-epost"
            name="epost"
            type="email"
            maxLength={160}
            autoComplete="email"
            className={felt}
            placeholder="ola@eksempel.no"
          />
        </div>
        <div>
          <label htmlFor="v2-telefon" className={etikett}>
            Telefon
          </label>
          <input
            id="v2-telefon"
            name="telefon"
            type="tel"
            maxLength={40}
            autoComplete="tel"
            className={felt}
            placeholder="900 00 000"
          />
        </div>
      </div>

      <fieldset>
        <legend className={etikett}>Kommer du? *</legend>
        <div className="mt-2 flex gap-8">
          {(
            [
              ["ja", "Ja"],
              ["nei", "Nei"],
            ] as const
          ).map(([verdi, tekst]) => (
            <label key={verdi} className="cursor-pointer">
              <input
                type="radio"
                name="kommer"
                value={verdi}
                required
                checked={kommer === verdi}
                onChange={() => setKommer(verdi)}
                className="sr-only"
              />
              <span
                className={`font-grotesk text-2xl transition-colors ${
                  kommer === verdi
                    ? "text-messing underline underline-offset-8"
                    : "text-tåke hover:text-elfenben"
                }`}
              >
                {tekst}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {kommer === "ja" && (
        <>
          <div className="sm:max-w-[10rem]">
            <label htmlFor="v2-antall" className={etikett}>
              Hvor mange
            </label>
            <input
              id="v2-antall"
              name="antall"
              type="number"
              inputMode="numeric"
              min={1}
              max={10}
              value={antallTekst}
              onChange={(e) => setAntallTekst(e.target.value)}
              aria-describedby="v2-antall-hjelp"
              className={felt}
            />
            <p id="v2-antall-hjelp" className="mt-2 text-xs text-tåke">
              Deg selv medregnet.
            </p>
          </div>

          {antallFolge > 0 && (
            <div>
              <label htmlFor="v2-folge" className={etikett}>
                Hvem tar du med
              </label>
              <input
                id="v2-folge"
                name="folge"
                maxLength={300}
                className={felt}
                placeholder={
                  antallFolge === 1 ? "Kari Nordmann" : "Kari Nordmann, Ola Nordmann"
                }
              />
              <p className="mt-2 text-xs text-tåke">
                {antallFolge === 1
                  ? "Skriv navnet på den du tar med."
                  : `Skriv navnet på de ${antallFolge} du tar med.`}
              </p>
            </div>
          )}

          <div>
            <label htmlFor="v2-allergier" className={etikett}>
              Allergier eller matbehov
            </label>
            <input
              id="v2-allergier"
              name="allergier"
              maxLength={500}
              className={felt}
              placeholder="Glutenfritt, vegetar, nøtteallergi …"
            />
          </div>
        </>
      )}

      <div>
        <label htmlFor="v2-melding" className={etikett}>
          Hilsen til brudeparet
        </label>
        <textarea
          id="v2-melding"
          name="melding"
          rows={3}
          maxLength={1000}
          className={`${felt} resize-y`}
          placeholder="Valgfritt"
        />
      </div>

      {status === "feil" && (
        <p role="alert" className="text-sm text-red-400">
          {feilmelding}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sender"}
        className="border border-messing px-10 py-4 font-grotesk text-xs uppercase tracking-[0.25em] text-messing transition-colors hover:bg-messing hover:text-natt disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "sender" ? "Sender …" : "Send svar"}
      </button>
    </form>
  );
}
