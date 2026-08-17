"use client";

import { useEffect, useState } from "react";
import { bryllup } from "@/content/bryllup";

const lenker = [
  { href: "#program", tekst: "Program" },
  { href: "#sted", tekst: "Sted" },
  { href: "#praktisk", tekst: "Praktisk" },
  { href: "#gaver", tekst: "Gaver" },
  { href: "#galleri", tekst: "Galleri" },
  { href: "#kontakt", tekst: "Kontakt" },
  // Skjules sammen med skjemaet når RSVP-en stenges, så lenken ikke peker i tomme luften
  ...(bryllup.rsvp.apen ? [{ href: "#rsvp", tekst: "Gi beskjed" }] : []),
];

export default function Meny() {
  const [festet, setFestet] = useState(false);
  const [apen, setApen] = useState(false);

  useEffect(() => {
    const veksle = () => setFestet(window.scrollY > 80);
    veksle();
    window.addEventListener("scroll", veksle, { passive: true });
    return () => window.removeEventListener("scroll", veksle);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        festet || apen ? "bg-krem/95 shadow-sm backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#topp" className="font-display text-lg tracking-wide">
          &#10086;
        </a>

        <ul className="hidden gap-7 text-sm md:flex">
          {lenker.map((lenke) => (
            <li key={lenke.href}>
              <a
                href={lenke.href}
                className="text-dempet transition-colors hover:text-salvie-dyp"
              >
                {lenke.tekst}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setApen((v) => !v)}
          aria-expanded={apen}
          aria-label={apen ? "Lukk meny" : "Åpne meny"}
          className="md:hidden"
        >
          <span className="block h-px w-6 bg-blekk" />
          <span className="mt-1.5 block h-px w-6 bg-blekk" />
          <span className="mt-1.5 block h-px w-6 bg-blekk" />
        </button>
      </div>

      {apen && (
        <ul className="border-t border-kant bg-krem px-6 pb-6 pt-2 md:hidden">
          {lenker.map((lenke) => (
            <li key={lenke.href}>
              <a
                href={lenke.href}
                onClick={() => setApen(false)}
                className="block py-3 text-dempet"
              >
                {lenke.tekst}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
