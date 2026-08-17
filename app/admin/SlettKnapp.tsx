"use client";

import { useState } from "react";
import { slettSvarHandling } from "./handlinger";

/**
 * Sletter et arkivert svar for godt. Spør først, siden dette ikke kan angres.
 *
 * Bekreftelsen vises i selve raden i stedet for i en nettleserdialog – dialoger
 * kan blokkeres eller undertrykkes av nettleseren, og da ville sletting skjedd
 * med ett klikk uten at noen ble spurt.
 */
export default function SlettKnapp({ id, navn }: { id: string; navn: string }) {
  const [bekrefter, setBekrefter] = useState(false);

  if (!bekrefter) {
    return (
      <button
        type="button"
        onClick={() => setBekrefter(true)}
        className="text-xs text-dempet underline-offset-4 transition-colors hover:text-red-700 hover:underline"
      >
        Slett
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-3 text-xs">
      <span className="text-dempet">Er du sikker?</span>

      <form action={slettSvarHandling} className="inline">
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          aria-label={`Slett svaret fra ${navn} for godt`}
          className="text-red-700 underline underline-offset-4"
        >
          Ja, slett
        </button>
      </form>

      <button
        type="button"
        onClick={() => setBekrefter(false)}
        className="text-dempet underline underline-offset-4"
      >
        Avbryt
      </button>
    </span>
  );
}
