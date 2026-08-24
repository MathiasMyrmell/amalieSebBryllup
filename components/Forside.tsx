import { bryllup } from "@/content/bryllup";
import Nedtelling from "./Nedtelling";

export default function Forside() {
  return (
    <header
      id="topp"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* Dekorativ bakgrunn. Vil du bruke et foto i stedet?
          Se README, avsnittet «Bytte forsidebakgrunn». */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_15%,#ffffff_0%,#f6f1e7_45%,#eae2d3_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 -top-28 -z-10 h-96 w-96 rounded-full bg-salvie/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 -z-10 h-96 w-96 rounded-full bg-gull/10 blur-3xl"
      />

      <p className="mb-8 text-xs uppercase tracking-[0.4em] text-gull">
        Vi gifter oss
      </p>

      <h1 className="flex max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-1 font-display text-6xl font-light leading-[1.05] sm:gap-x-6 sm:text-8xl">
        <span>{bryllup.par.brud}</span>
        <span className="text-salvie">&amp;</span>
        <span>{bryllup.par.brudgom}</span>
      </h1>

      <div className="mt-10 flex items-center gap-5 text-sm uppercase tracking-[0.2em] text-dempet">
        <span>{bryllup.datoTekst}</span>
        <span className="h-4 w-px bg-kant" />
        <span>{bryllup.sted}</span>
      </div>

      <p className="mt-10 max-w-xl text-balance leading-relaxed text-dempet">
        {bryllup.ingress}
      </p>

      <div className="mt-14 w-full max-w-lg">
        <Nedtelling dato={bryllup.dato} />
      </div>

      {bryllup.rsvp.apen && (
        <a
          href="#rsvp"
          className="mt-14 inline-block border border-salvie-dyp px-9 py-3 text-xs uppercase tracking-[0.2em] text-salvie-dyp transition-colors hover:bg-salvie-dyp hover:text-krem"
        >
          Gi oss beskjed
        </a>
      )}
    </header>
  );
}
