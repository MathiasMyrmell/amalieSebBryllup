/**
 * Stillestående kart satt sammen av kartfliser fra CARTO «Positron» – et lyst,
 * nesten fargeløst kartlag som ikke stjeler oppmerksomhet fra resten av siden.
 *
 * Kartet er med vilje ikke interaktivt: det laster raskt, krever ingen API-nøkkel
 * eller informasjonskapsler, og stjeler ikke scrollingen på mobil. Trykker gjesten
 * på kartet, åpnes veibeskrivelsen i deres egen kartapp i stedet.
 *
 * Vil du ha et annet utseende? Bytt `LAG` under:
 *   light_all        lyst med stedsnavn (standard)
 *   light_nolabels   lyst helt uten tekst
 *   dark_all         mørkt med stedsnavn
 *   rastertiles/voyager  litt mer farge, fortsatt dempet
 */

const LAG = "light_all";

const FLIS = 256;
/** Bredden på flisteppet. Kortet er smalere og beskjærer det, så kartet fyller alltid ut. */
const BREDDE = 960;
const HOYDE = 224;

/** Lengdegrad → vannrett flisposisjon (Web Mercator) */
function flisX(lon: number, zoom: number) {
  return ((lon + 180) / 360) * 2 ** zoom;
}

/** Breddegrad → loddrett flisposisjon (Web Mercator) */
function flisY(lat: number, zoom: number) {
  const rad = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** zoom;
}

export default function Kart({
  lat,
  lon,
  tittel,
  lenke,
  zoom = 14,
}: {
  lat: number;
  lon: number;
  tittel: string;
  /** Åpnes når gjesten trykker på kartet */
  lenke: string;
  zoom?: number;
}) {
  // Hvor senterpunktet ligger i kartets eget pikselrutenett
  const senterX = flisX(lon, zoom) * FLIS;
  const senterY = flisY(lat, zoom) * FLIS;

  const venstre = senterX - BREDDE / 2;
  const topp = senterY - HOYDE / 2;

  const fraX = Math.floor(venstre / FLIS);
  const tilX = Math.floor((venstre + BREDDE - 1) / FLIS);
  const fraY = Math.floor(topp / FLIS);
  const tilY = Math.floor((topp + HOYDE - 1) / FLIS);

  const fliser = [];
  for (let x = fraX; x <= tilX; x++) {
    for (let y = fraY; y <= tilY; y++) {
      fliser.push({
        x,
        y,
        venstre: x * FLIS - venstre,
        topp: y * FLIS - topp,
      });
    }
  }

  return (
    <a
      href={lenke}
      target="_blank"
      rel="noreferrer"
      aria-label={`Kart over ${tittel} – åpne veibeskrivelse`}
      className="group relative block overflow-hidden border border-kant bg-krem-dyp"
      style={{ height: HOYDE }}
    >
      <div
        className="absolute top-0 left-1/2 transition-opacity group-hover:opacity-90"
        style={{ width: BREDDE, height: HOYDE, marginLeft: -BREDDE / 2 }}
      >
        {fliser.map((flis) => (
          // Rene kartfliser fra et eksternt tjeneste – vanlig <img> er riktig her,
          // next/image ville bare lagt et unødvendig mellomledd på veien.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${flis.x}-${flis.y}`}
            src={`https://basemaps.cartocdn.com/${LAG}/${zoom}/${flis.x}/${flis.y}@2x.png`}
            alt=""
            width={FLIS}
            height={FLIS}
            loading="lazy"
            className="absolute max-w-none"
            style={{ left: flis.venstre, top: flis.topp }}
          />
        ))}
      </div>

      {/* Markør midt i kartet */}
      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-salvie-dyp ring-4 ring-krem/80"
      />

      <span className="absolute right-0 bottom-0 bg-krem/80 px-1.5 py-0.5 text-[0.6rem] text-dempet">
        © OpenStreetMap © CARTO
      </span>
    </a>
  );
}
