/**
 * Oversikt over utformingsvariantene. Ikke ment for gjestene – bare et sted
 * å hoppe mellom utkastene mens dere bestemmer dere.
 */
export const metadata = {
  title: "Utkast",
  robots: { index: false, follow: false },
};

const utkast = [
  {
    sti: "/",
    navn: "Krem og salvie",
    pynt: "Medium",
    om: "Dagens versjon. Lys krem, dempet grønn, klassisk antikva og midtstilt oppsett.",
  },
  {
    sti: "/v2",
    navn: "Natt",
    pynt: "Lite",
    om: "Mørk og typografisk, nummererte seksjoner, messing som eneste aksent.",
  },
  {
    sti: "/v3",
    navn: "Blomstereng",
    pynt: "Mye",
    om: "Lys rosa, kursiv display, buede kort og blomsterranker.",
  },
  {
    sti: "/v4",
    navn: "Sveitsisk",
    pynt: "Nesten ingen",
    om: "Hvitt, stramt rutenett, én skrift. All rytme kommer fra typografi og luft.",
  },
  {
    sti: "/v5",
    navn: "Riviera",
    pynt: "Medium",
    om: "Terrakotta, oliven og sand. Buede former og stripete skiller.",
  },
  {
    sti: "/v6",
    navn: "Papir",
    pynt: "Mye",
    om: "Som en trykt invitasjon: dobbel ramme, kapiteler og vignetter.",
  },
  {
    sti: "/v7",
    navn: "Nordisk lys",
    pynt: "Lite",
    om: "Kjølig lys palett, lette skriftsnitt, hårfine streker og mye luft.",
  },
  {
    sti: "/v8",
    navn: "Botanisk",
    pynt: "Mye",
    om: "Grønt og krem, bladranker, runde og myke former.",
  },
  {
    sti: "/v9",
    navn: "Retro",
    pynt: "Mye",
    om: "Sennep, rust og krem. Fete typer, bølger og runde flater.",
  },
  {
    sti: "/v10",
    navn: "Magasin",
    pynt: "Medium",
    om: "Redaksjonelt: avishode, spaltesats, anfang og teglrød aksent.",
  },
];

export default function Versjoner() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl font-light">Utkast</h1>
      <p className="mt-3 max-w-xl leading-relaxed text-dempet">
        Alle henter innhold fra samme fil, så det er bare utformingen som skiller dem.
        Ingen av dem er lenket til fra forsiden, og alle er skjult for søkemotorer.
      </p>

      <ul className="mt-12 border-t border-kant">
        {utkast.map((u) => (
          <li key={u.sti} className="border-b border-kant">
            <a href={u.sti} className="group flex gap-6 py-5">
              <span className="w-14 shrink-0 pt-1 font-display text-lg text-gull">
                {u.sti === "/" ? "v1" : u.sti.slice(1)}
              </span>
              <span className="flex-1">
                <span className="font-display text-xl font-light group-hover:text-salvie-dyp">
                  {u.navn}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-dempet">
                  {u.om}
                </span>
              </span>
              <span className="w-28 shrink-0 pt-1.5 text-right text-xs uppercase tracking-wider text-dempet">
                {u.pynt}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
