"use client";

import { useState } from "react";
import type { Epost, Svar } from "@/lib/rsvp-typer";
import { endreSvarHandling, fjernSvar, hentOppSvar } from "./handlinger";
import SlettKnapp from "./SlettKnapp";

export type Variant = "kommer" | "kommerIkke" | "fjernet";

const lenke =
  "inline-flex items-center gap-1.5 text-xs text-dempet underline-offset-4 transition-colors hover:text-salvie-dyp hover:underline";

function tidspunkt(iso: string) {
  return new Date(iso).toLocaleString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Oslo",
  });
}

/**
 * Én rad per gjest. Tre handlinger i siste kolonne:
 *   – pil som viser/skjuler e-postene (åpner en rad rett under)
 *   – «Fjern» (i arkivet: «Hent opp igjen» og «Slett»)
 *   – «Endre svar», for dem som ombestemmer seg
 */
export default function Gjesterad({
  svar,
  eposter,
  eier,
  variant,
}: {
  svar: Svar;
  /** E-postene som hører til denne gjesten, eldste først */
  eposter: Epost[];
  /** Satt når en annen gjest med samme e-postadresse svarte først – tråden ligger da under den */
  eier?: string;
  variant: Variant;
}) {
  const [visEpost, setVisEpost] = useState(false);
  const [redigerer, setRedigerer] = useState(false);
  const [kommer, setKommer] = useState<"ja" | "nei">(svar.kommer);
  const [antallTekst, setAntallTekst] = useState(String(svar.antall || 1));

  const arkivert = variant === "fjernet";
  const kommerNå = svar.kommer === "ja";
  const antallKolonner = variant === "kommer" ? 8 : variant === "fjernet" ? 6 : 5;

  return (
    <>
      <tr className="border-b border-kant/60 align-top">
        <td className="py-3 pr-4 font-medium">{svar.navn}</td>

        {arkivert && (
          <td className="py-3 pr-4">
            <span className={kommerNå ? "text-salvie-dyp" : "text-dempet"}>
              {kommerNå ? `Kommer (${svar.antall || 1})` : "Kan ikke"}
            </span>
          </td>
        )}

        {variant === "kommer" && (
          <>
            <td className="py-3 pr-4 tabular-nums">{svar.antall || 1}</td>
            <td className="py-3 pr-4">{svar.folge || "–"}</td>
            <td className="py-3 pr-4">{svar.allergier || "–"}</td>
          </>
        )}

        <td className="py-3 pr-4">
          {svar.epost && <div className="break-all">{svar.epost}</div>}
          {svar.telefon && <div>{svar.telefon}</div>}
          {!svar.epost && !svar.telefon && "–"}
        </td>
        <td className="max-w-xs py-3 pr-4 text-dempet">{svar.melding || "–"}</td>
        <td className="py-3 pr-4 whitespace-nowrap text-dempet">
          {new Date(svar.mottatt).toLocaleDateString("nb-NO", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            timeZone: "Europe/Oslo",
          })}
        </td>

        <td className="py-3 whitespace-nowrap text-right">
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => setVisEpost((v) => !v)}
              aria-expanded={visEpost}
              aria-controls={`epost-${svar.id}`}
              className={lenke}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                aria-hidden="true"
                className={`transition-transform ${visEpost ? "rotate-180" : ""}`}
              >
                <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              E-post{eier ? "" : ` (${eposter.length})`}
            </button>

            {arkivert ? (
              <>
                <form action={hentOppSvar}>
                  <input type="hidden" name="id" value={svar.id} />
                  <button type="submit" className={lenke}>
                    Hent opp igjen
                  </button>
                </form>
                <SlettKnapp id={svar.id} navn={svar.navn} />
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setRedigerer((v) => !v)}
                  aria-expanded={redigerer}
                  className={lenke}
                >
                  Endre svar
                </button>
                <form action={fjernSvar}>
                  <input type="hidden" name="id" value={svar.id} />
                  <button type="submit" className={lenke}>
                    Fjern
                  </button>
                </form>
              </>
            )}
          </div>
        </td>
      </tr>

      {redigerer && !arkivert && (
        <tr className="border-b border-kant/60">
          <td colSpan={antallKolonner} className="pb-4">
            <form
              action={async (skjema) => {
                await endreSvarHandling(skjema);
                setRedigerer(false);
              }}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 bg-krem-dyp/40 p-4 text-sm"
            >
              <input type="hidden" name="id" value={svar.id} />

              <fieldset className="flex gap-4">
                <legend className="sr-only">Kommer {svar.navn}?</legend>
                {(
                  [
                    ["ja", "Kommer"],
                    ["nei", "Kommer ikke"],
                  ] as const
                ).map(([verdi, etikett]) => (
                  <label key={verdi} className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="kommer"
                      value={verdi}
                      checked={kommer === verdi}
                      onChange={() => setKommer(verdi)}
                    />
                    {etikett}
                  </label>
                ))}
              </fieldset>

              {kommer === "ja" && (
                <label>
                  Antall personer
                  <input
                    name="antall"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={10}
                    value={antallTekst}
                    onChange={(e) => setAntallTekst(e.target.value)}
                    className="ml-3 w-20 border border-kant bg-transparent px-2 py-1"
                  />
                </label>
              )}

              <div className="flex gap-4 text-xs">
                <button type="submit" className="text-salvie-dyp underline underline-offset-4">
                  Lagre
                </button>
                <button
                  type="button"
                  onClick={() => setRedigerer(false)}
                  className="text-dempet underline underline-offset-4"
                >
                  Avbryt
                </button>
              </div>
            </form>
          </td>
        </tr>
      )}

      {visEpost && (
        <tr className="border-b border-kant/60">
          <td colSpan={antallKolonner} className="pb-4">
            <div id={`epost-${svar.id}`} className="space-y-3 bg-krem-dyp/40 p-4">
              {eier ? (
                <p className="text-sm text-dempet">
                  Samme e-postadresse ble brukt først av {eier}. E-postene vises på den raden.
                </p>
              ) : !svar.epost ? (
                <p className="text-sm text-dempet">Ingen e-postadresse oppgitt.</p>
              ) : eposter.length === 0 ? (
                <p className="text-sm text-dempet">Ingen e-poster ennå.</p>
              ) : (
                eposter.map((e) => (
                  <div
                    key={e.id}
                    className={`border-l-2 pl-3 text-sm ${
                      e.retning === "ut" ? "border-salvie" : "border-gull"
                    }`}
                  >
                    <div className="flex flex-wrap justify-between gap-x-4 text-xs text-dempet">
                      <span>
                        {e.retning === "ut" ? "Sendt til gjesten" : "Mottatt fra gjesten"}
                      </span>
                      <time dateTime={e.tidspunkt}>{tidspunkt(e.tidspunkt)}</time>
                    </div>
                    {e.emne && <div className="mt-1 font-medium">{e.emne}</div>}
                    {/* Vises som ren tekst – aldri som HTML */}
                    <div className="mt-1 max-h-64 overflow-y-auto whitespace-pre-wrap break-words text-dempet">
                      {e.tekst || "(ingen tekst)"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
