"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { bryllup } from "@/content/bryllup";

/**
 * Stort bilde av paret i et fullbredde-bånd rett under forsiden.
 * Innholdet redigeres i content/bryllup.ts under «portrett».
 */
export default function Portrett() {
  const { src, alt, bildetekst } = bryllup.portrett;
  const ref = useRef<HTMLElement>(null);
  const [synlig, setSynlig] = useState(false);

  // Myk innfading når båndet scrolles inn i bildet (samme som seksjonene).
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([oppforing]) => {
        if (oppforing.isIntersecting) {
          setSynlig(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Bilde av paret"
      className={`fade-inn ${synlig ? "synlig" : ""}`}
    >
      <figure className="relative h-[60vh] min-h-[380px] w-full overflow-hidden sm:h-[80vh] sm:max-h-[760px]">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <Plassholder />
        )}

        {src && bildetekst && (
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-blekk/60 to-transparent p-6 text-center text-lg tracking-wide text-krem sm:p-10 sm:text-xl">
            {bildetekst}
          </figcaption>
        )}
      </figure>
    </section>
  );
}

/** Vises så lenge bildet mangler i content/bryllup.ts */
function Plassholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 border-y border-dashed border-kant bg-krem-dyp p-6 text-center">
      <span className="text-4xl text-gull/60" aria-hidden>
        &#9906;
      </span>
      <span className="max-w-xs text-sm leading-snug text-dempet">
        Her kommer et stort bilde av Amalie og Sebastian. Legg bildet i mappen{" "}
        <code className="font-mono">public/</code> og skriv filnavnet i{" "}
        <code className="font-mono">content/bryllup.ts</code> under «portrett».
      </span>
    </div>
  );
}
