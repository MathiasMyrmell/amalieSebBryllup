"use client";

import { useActionState } from "react";
import { sendKode } from "./handlinger";

export default function Innlogging() {
  const [feil, handling, venter] = useActionState(sendKode, null);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center">
      <h1 className="text-center font-display text-4xl font-light">RSVP-svar</h1>
      <p className="mt-3 text-center text-sm text-dempet">
        Skriv inn koden for å se oversikten.
      </p>

      <form action={handling} className="mt-10 space-y-4">
        <div>
          <label htmlFor="kode" className="mb-2 block text-sm">
            Kode
          </label>
          <input
            id="kode"
            name="kode"
            type="password"
            autoFocus
            autoComplete="current-password"
            className="w-full border border-kant bg-krem px-4 py-3 outline-none transition-colors focus:border-salvie"
          />
        </div>

        {feil && (
          <p role="alert" className="text-sm text-red-700">
            {feil}
          </p>
        )}

        <button
          type="submit"
          disabled={venter}
          className="w-full border border-salvie-dyp bg-salvie-dyp py-3.5 text-xs uppercase tracking-[0.2em] text-krem transition-colors hover:bg-transparent hover:text-salvie-dyp disabled:cursor-not-allowed disabled:opacity-60"
        >
          {venter ? "Sjekker …" : "Logg inn"}
        </button>
      </form>
    </div>
  );
}
