"use client";

import Image from "next/image";
import { bryllup } from "@/content/bryllup";

/**
 * Galleri i den mørke stilen: en vannrett stripe man drar i, i stedet for et
 * rutenett. Bilder som mangler vises som nummererte plassholderfelt.
 */
export default function Galleri2() {
  return (
    <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:-mx-10 sm:px-10">
      {bryllup.galleri.map((bilde, i) => (
        <figure
          key={i}
          className="relative aspect-[3/4] w-64 shrink-0 snap-start overflow-hidden sm:w-72"
        >
          {bilde.src ? (
            <Image
              src={bilde.src}
              alt={bilde.alt}
              fill
              sizes="288px"
              className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
            />
          ) : (
            <div className="flex h-full flex-col justify-between border border-strek bg-natt-lys p-5">
              <span className="font-grotesk text-xs text-messing">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm leading-snug text-tåke">{bilde.bildetekst}</span>
            </div>
          )}

          {bilde.src && (
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-natt to-transparent p-4 text-sm">
              {bilde.bildetekst}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
