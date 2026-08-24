"use client";

import { useState } from "react";
import { bryllup } from "@/content/bryllup";
import Seksjon from "./Seksjon";

type Status = "klar" | "sender" | "sendt" | "feil";

const feltStil =
  "w-full border border-kant bg-krem px-4 py-3 text-blekk outline-none transition-colors placeholder:text-dempet/60 focus:border-salvie";

export default function Rsvp() {
  const [status, setStatus] = useState<Status>("klar");
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

    const skjema = new FormData(event.currentTarget);
    const data = Object.fromEntries(skjema.entries());

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

  return (
    <Seksjon id="rsvp" overtittel={`Svarfrist ${bryllup.rsvp.frist}`} tittel="Kommer du?">
      <div className="mx-auto max-w-xl">
        {status === "sendt" ? (
          <div className="border border-salvie bg-krem-dyp p-10 text-center">
            <p className="font-display text-3xl font-light text-salvie-dyp">
              Tusen takk!
            </p>
            <p className="mt-3 leading-relaxed text-dempet">
              Svaret er registrert. {bryllup.rsvp.hjelpetekst}
            </p>
          </div>
        ) : (
          <form onSubmit={send} className="space-y-6">
            <div>
              <label htmlFor="navn" className="mb-2 block text-sm">
                Navn <span className="text-gull">*</span>
              </label>
              <input
                id="navn"
                name="navn"
                required
                maxLength={120}
                autoComplete="name"
                className={feltStil}
                placeholder="Ola Nordmann"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="epost" className="mb-2 block text-sm">
                  E-post
                </label>
                <input
                  id="epost"
                  name="epost"
                  type="email"
                  maxLength={160}
                  autoComplete="email"
                  className={feltStil}
                  placeholder="ola@eksempel.no"
                />
              </div>
              <div>
                <label htmlFor="telefon" className="mb-2 block text-sm">
                  Telefon
                </label>
                <input
                  id="telefon"
                  name="telefon"
                  type="tel"
                  maxLength={40}
                  autoComplete="tel"
                  className={feltStil}
                  placeholder="900 00 000"
                />
              </div>
            </div>

            <fieldset>
              <legend className="mb-2 block text-sm">
                Kommer du? <span className="text-gull">*</span>
              </legend>
              <div className="flex gap-3">
                {(
                  [
                    ["ja", "Ja, jeg kommer"],
                    ["nei", "Dessverre ikke"],
                  ] as const
                ).map(([verdi, etikett]) => (
                  <label
                    key={verdi}
                    className={`flex-1 cursor-pointer border px-4 py-3 text-center text-sm transition-colors ${
                      kommer === verdi
                        ? "border-salvie-dyp bg-salvie-dyp text-krem"
                        : "border-kant bg-krem hover:border-salvie"
                    }`}
                  >
                    <input
                      type="radio"
                      name="kommer"
                      value={verdi}
                      required
                      checked={kommer === verdi}
                      onChange={() => setKommer(verdi)}
                      className="sr-only"
                    />
                    {etikett}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Feltene under er bare relevante for dem som faktisk kommer */}
            {kommer === "ja" && (
              <>
                <div className="sm:max-w-[12rem]">
                  <label htmlFor="antall" className="mb-1 block text-sm">
                    Hvor mange kommer?
                  </label>
                  <p id="antall-hjelp" className="mb-2 text-xs text-dempet">
                    Deg selv medregnet.
                  </p>
                  <input
                    id="antall"
                    name="antall"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={10}
                    value={antallTekst}
                    onChange={(e) => setAntallTekst(e.target.value)}
                    aria-describedby="antall-hjelp"
                    className={feltStil}
                  />
                </div>

                {/* Følgefeltet gir bare mening når gjesten tar med noen */}
                {antallFolge > 0 && (
                  <div>
                    <label htmlFor="folge" className="mb-1 block text-sm">
                      Hvem tar du med?
                    </label>
                    <p id="folge-hjelp" className="mb-2 text-xs text-dempet">
                      {antallFolge === 1
                        ? "Skriv navnet på den du tar med."
                        : `Skriv navnet på de ${antallFolge} du tar med.`}
                    </p>
                    <input
                      id="folge"
                      name="folge"
                      maxLength={300}
                      aria-describedby="folge-hjelp"
                      className={feltStil}
                      placeholder={
                        antallFolge === 1 ? "Kari Nordmann" : "Kari Nordmann, Ola Nordmann"
                      }
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="allergier" className="mb-2 block text-sm">
                    Allergier eller matbehov
                  </label>
                  <input
                    id="allergier"
                    name="allergier"
                    maxLength={500}
                    className={feltStil}
                    placeholder="Glutenfritt, vegetar, nøtteallergi …"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="melding" className="mb-2 block text-sm">
                Hilsen til brudeparet
              </label>
              <textarea
                id="melding"
                name="melding"
                rows={4}
                maxLength={1000}
                className={`${feltStil} resize-y`}
                placeholder="Valgfritt"
              />
            </div>

            {status === "feil" && (
              <p role="alert" className="text-sm text-red-700">
                {feilmelding}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sender"}
              className="w-full border border-salvie-dyp bg-salvie-dyp py-4 text-xs uppercase tracking-[0.2em] text-krem transition-colors hover:bg-transparent hover:text-salvie-dyp disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sender" ? "Sender …" : "Send svar"}
            </button>

            <p className="text-center text-sm text-dempet">{bryllup.rsvp.hjelpetekst}</p>
          </form>
        )}
      </div>
    </Seksjon>
  );
}
