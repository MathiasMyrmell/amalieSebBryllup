"use client";

import { bryllup } from "@/content/bryllup";
import { brukRsvp } from "@/lib/bruk-rsvp";

/** Klassene som skiller utformingene fra hverandre */
export type RsvpStil = {
  skjema?: string;
  etikett: string;
  felt: string;
  hjelp: string;
  valgAktiv: string;
  valgPassiv: string;
  valgRad?: string;
  knapp: string;
  kvittering: string;
  kvitteringTittel: string;
  feil?: string;
};

/**
 * RSVP-skjemaet som alle utformingsvariantene deler. Oppførselen ligger i
 * brukRsvp(); her er det bare markup, og klassene kommer utenfra.
 */
export default function RsvpFelles({ stil }: { stil: RsvpStil }) {
  const {
    status,
    feilmelding,
    kommer,
    setKommer,
    antallTekst,
    setAntallTekst,
    antallFolge,
    send,
  } = brukRsvp();

  if (!bryllup.rsvp.apen) return null;

  if (status === "sendt") {
    return (
      <div className={stil.kvittering}>
        <p className={stil.kvitteringTittel}>Tusen takk!</p>
        <p className="mt-3 leading-relaxed opacity-80">
          Svaret er registrert. {bryllup.rsvp.hjelpetekst}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={send} className={stil.skjema ?? "space-y-6"}>
      <div>
        <label htmlFor="r-navn" className={stil.etikett}>
          Navn *
        </label>
        <input
          id="r-navn"
          name="navn"
          required
          maxLength={120}
          autoComplete="name"
          className={stil.felt}
          placeholder="Ola Nordmann"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="r-epost" className={stil.etikett}>
            E-post
          </label>
          <input
            id="r-epost"
            name="epost"
            type="email"
            maxLength={160}
            autoComplete="email"
            className={stil.felt}
            placeholder="ola@eksempel.no"
          />
        </div>
        <div>
          <label htmlFor="r-telefon" className={stil.etikett}>
            Telefon
          </label>
          <input
            id="r-telefon"
            name="telefon"
            type="tel"
            maxLength={40}
            autoComplete="tel"
            className={stil.felt}
            placeholder="900 00 000"
          />
        </div>
      </div>

      <fieldset>
        <legend className={stil.etikett}>Kommer du? *</legend>
        <div className={stil.valgRad ?? "mt-2 flex gap-3"}>
          {(
            [
              ["ja", "Ja, jeg kommer"],
              ["nei", "Dessverre ikke"],
            ] as const
          ).map(([verdi, tekst]) => (
            <label
              key={verdi}
              className={kommer === verdi ? stil.valgAktiv : stil.valgPassiv}
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
              {tekst}
            </label>
          ))}
        </div>
      </fieldset>

      {kommer === "ja" && (
        <>
          <div className="sm:max-w-[12rem]">
            <label htmlFor="r-antall" className={stil.etikett}>
              Hvor mange kommer?
            </label>
            <input
              id="r-antall"
              name="antall"
              type="number"
              inputMode="numeric"
              min={1}
              max={10}
              value={antallTekst}
              onChange={(e) => setAntallTekst(e.target.value)}
              aria-describedby="r-antall-hjelp"
              className={stil.felt}
            />
            <p id="r-antall-hjelp" className={stil.hjelp}>
              Deg selv medregnet.
            </p>
          </div>

          {antallFolge > 0 && (
            <div>
              <label htmlFor="r-folge" className={stil.etikett}>
                Hvem tar du med?
              </label>
              <input
                id="r-folge"
                name="folge"
                maxLength={300}
                className={stil.felt}
                placeholder={
                  antallFolge === 1 ? "Kari Nordmann" : "Kari Nordmann, Ola Nordmann"
                }
              />
              <p className={stil.hjelp}>
                {antallFolge === 1
                  ? "Skriv navnet på den du tar med."
                  : `Skriv navnet på de ${antallFolge} du tar med.`}
              </p>
            </div>
          )}

          <div>
            <label htmlFor="r-allergier" className={stil.etikett}>
              Allergier eller matbehov
            </label>
            <input
              id="r-allergier"
              name="allergier"
              maxLength={500}
              className={stil.felt}
              placeholder="Glutenfritt, vegetar, nøtteallergi …"
            />
          </div>
        </>
      )}

      <div>
        <label htmlFor="r-melding" className={stil.etikett}>
          Hilsen til brudeparet
        </label>
        <textarea
          id="r-melding"
          name="melding"
          rows={4}
          maxLength={1000}
          className={`${stil.felt} resize-y`}
          placeholder="Valgfritt"
        />
      </div>

      {status === "feil" && (
        <p role="alert" className={stil.feil ?? "text-sm text-red-700"}>
          {feilmelding}
        </p>
      )}

      <button type="submit" disabled={status === "sender"} className={stil.knapp}>
        {status === "sender" ? "Sender …" : "Send svar"}
      </button>
    </form>
  );
}
