import { bryllup } from "@/content/bryllup";

export default function Bunn() {
  return (
    <footer className="border-t border-kant px-6 py-16 text-center">
      <p className="font-display text-3xl font-light">
        {bryllup.par.brud}
        <span className="mx-3 text-salvie">&amp;</span>
        {bryllup.par.brudgom}
      </p>
      <p className="mt-3 text-xs uppercase tracking-[0.3em] text-dempet">
        {bryllup.datoTekst}
      </p>
    </footer>
  );
}
