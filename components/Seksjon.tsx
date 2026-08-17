"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  id: string;
  overtittel?: string;
  tittel: string;
  /** Lysere bakgrunn for å skille seksjoner fra hverandre */
  toner?: boolean;
  children: React.ReactNode;
};

/**
 * Felles ramme rundt hver seksjon: overskrift, luft og myk innfading
 * når seksjonen scrolles inn i bildet.
 */
export default function Seksjon({ id, overtittel, tittel, toner, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [synlig, setSynlig] = useState(false);

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
      id={id}
      ref={ref}
      className={`px-6 py-20 sm:py-28 ${toner ? "bg-krem-dyp" : ""}`}
    >
      <div className={`mx-auto max-w-5xl fade-inn ${synlig ? "synlig" : ""}`}>
        <header className="mb-12 text-center">
          {overtittel && (
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gull">
              {overtittel}
            </p>
          )}
          <h2 className="font-display text-4xl font-light sm:text-5xl">{tittel}</h2>
          <div className="mx-auto mt-6 h-px w-16 bg-kant" />
        </header>
        {children}
      </div>
    </section>
  );
}
