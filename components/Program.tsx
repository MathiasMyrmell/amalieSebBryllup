import { bryllup } from "@/content/bryllup";
import Seksjon from "./Seksjon";

export default function Program() {
  return (
    <Seksjon id="program" overtittel="Slik blir dagen" tittel="Program">
      <ol className="mx-auto max-w-2xl">
        {bryllup.program.map((post, i) => (
          <li key={`${post.tid}-${post.tittel}`} className="flex gap-6 sm:gap-10">
            {/* Tidslinje */}
            <div className="flex flex-col items-center">
              <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-salvie" />
              {i < bryllup.program.length - 1 && (
                <span className="w-px flex-1 bg-kant" />
              )}
            </div>

            <div className="pb-10">
              <span className="font-display text-2xl text-salvie-dyp lining-nums tabular-nums">
                {post.tid}
              </span>
              <h3 className="mt-1 text-lg font-medium">{post.tittel}</h3>
              {post.beskrivelse && (
                <p className="mt-1 leading-relaxed text-dempet">{post.beskrivelse}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Seksjon>
  );
}
