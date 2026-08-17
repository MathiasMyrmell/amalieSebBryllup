"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { bryllup } from "@/content/bryllup";
import Seksjon from "./Seksjon";

export default function Galleri() {
  const bilder = bryllup.galleri;
  const [apent, setApent] = useState<number | null>(null);

  // Lukk forstørret bilde med Escape.
  useEffect(() => {
    if (apent === null) return;
    const lukk = (e: KeyboardEvent) => e.key === "Escape" && setApent(null);
    window.addEventListener("keydown", lukk);
    return () => window.removeEventListener("keydown", lukk);
  }, [apent]);

  return (
    <Seksjon id="galleri" overtittel="Litt om oss" tittel="Bilder">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {bilder.map((bilde, i) => (
          <figure key={i} className="group relative aspect-[4/5] overflow-hidden">
            {bilde.src ? (
              <button
                type="button"
                onClick={() => setApent(i)}
                className="h-full w-full cursor-zoom-in"
                aria-label={`Forstørr bilde: ${bilde.alt}`}
              >
                <Image
                  src={bilde.src}
                  alt={bilde.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </button>
            ) : (
              <Plassholder tekst={bilde.bildetekst} />
            )}

            {bilde.src && bilde.bildetekst && (
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-blekk/70 to-transparent p-4 text-sm text-krem opacity-0 transition-opacity group-hover:opacity-100">
                {bilde.bildetekst}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {apent !== null && bilder[apent].src && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={bilder[apent].alt}
          onClick={() => setApent(null)}
          className="fixed inset-0 z-[60] flex cursor-zoom-out items-center justify-center bg-blekk/90 p-6"
        >
          <div className="relative h-[80vh] w-full max-w-4xl">
            <Image
              src={bilder[apent].src}
              alt={bilder[apent].alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </Seksjon>
  );
}

/** Vises så lenge et bilde mangler i content/bryllup.ts */
function Plassholder({ tekst }: { tekst: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-kant bg-krem-dyp p-4 text-center">
      <span className="text-2xl text-gull/60" aria-hidden>
        &#9906;
      </span>
      <span className="text-xs leading-snug text-dempet">{tekst}</span>
    </div>
  );
}
